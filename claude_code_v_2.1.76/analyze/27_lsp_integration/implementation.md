# LSP Integration - Deep Implementation Analysis

## Module Overview

Claude Code v2.1.76 implements a **polyglot LSP client** that delegates language intelligence to external Language Server Protocol servers. Rather than bundling its own static analysis engines, the system spawns standard LSP servers (TypeScript, Go, Python, Rust, etc.) and acts as their client — giving Claude IDE-level intelligence about the codebase it is working in.

All LSP logic is bundled in `chunks.133.mjs`, which includes vendored copies of:
- `vscode-jsonrpc` (Zm4) — JSON-RPC 2.0 transport over streams
- `vscode-languageserver-protocol` (GP6) — LSP protocol type definitions

The tool surface is defined in `chunks.140.mjs` (the LSP Tool object), and the system prompt injection of diagnostics is handled in `chunks.142.mjs`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure

Key functions in this document:
- `createLspProcessWrapper` (um4) - Low-level stdio transport, process lifecycle, queued handlers
- `createLspClient` (Fm4) - High-level server instance: init, restart, request retry
- `LspServerManager` (lm4) - Polyglot coordinator: extension→server routing, file sync
- `loadLspConfigs` (dm4) - Aggregates plugin-provided LSP configs
- `loadPluginLspConfig` (HvY) - Reads `.lsp.json` from a single plugin
- `registerDiagnostics` (om4) - Buffers incoming `publishDiagnostics` notifications
- `checkDiagnosticsRegistry` (sm4) - Deduplicates, volume-limits, delivers diagnostics
- `registerNotificationHandlers` (em4) - Wires up async diagnostic listeners on all servers
- `initializeLspServerManager` (KF4) - Singleton init with generation counter
- `shutdownLspServerManager` (YF4) - Graceful teardown
- `getLspManager` (md) - Singleton accessor used by tools
- `getLspManagerStatus` (W51) - Status check (`not-started`/`pending`/`success`/`failed`)
- `waitForLspManager` (qF4) - Awaitable pending state
- `LspTool` (vRA) - The agent-facing tool object (`chunks.140.mjs`)
- `buildLspRequestParams` (LCY) - Maps operation name → JSON-RPC method + params
- `formatLspResult` (yCY) - Formats raw LSP response into human-readable string
- `getLSPDiagnosticAttachments` (WIY) - Injects diagnostics into system prompt

---

## Architecture Overview

```
Plugin manifest (.lsp.json / lspServers field)
           │
           ▼
   loadLspConfigs (dm4)
           │ collects all server configs
           ▼
   LspServerManager (lm4)
   ┌────────────────────────────────────┐
   │  Map<serverName, LspClient(Fm4)>  │
   │  Map<extension, serverName[]>      │  ← extension routing
   │  Map<fileUri, serverName>          │  ← open files registry
   └────────────────────────────────────┘
           │
           ▼ (per-server)
   createLspClient / LspServerInstance (Fm4)
           │
           ▼
   createLspProcessWrapper (um4)
           │ spawns child process
           ▼
   [LSP Server Process]  ←──── stdio (JSON-RPC) ────────►  vscode-jsonrpc (Zm4)
   (tsserver, gopls, ...)
```

---

## Layer 1: Low-Level Process Wrapper (um4)

### createLspProcessWrapper

**What it does:** Wraps a spawned child process into an async JSON-RPC channel. Handles queued notification/request handlers that register before the process is ready.

**How it works:**

```javascript
// ============================================
// createLspProcessWrapper - Stdio-based LSP process manager
// Location: chunks.133.mjs:1614-1775
// ============================================

// ORIGINAL (for source lookup):
function um4(A) {
    let q, K, Y, z = !1,
        w = !1,
        H, $ = !1,
        O = [],  // pendingNotificationHandlers
        _ = [];  // pendingRequestHandlers

    function J() {
        if (w) throw H || Error(`LSP server ${A} failed to start`)
    }
    return {
        get capabilities() { return Y },
        get isInitialized() { return z },
        async start(X, D, j) { /* ... */ },
        async initialize(X) { /* ... */ },
        async sendRequest(X, D) { /* ... */ },
        async sendNotification(X, D) { /* ... */ },
        onNotification(X, D) { /* registers or queues */ },
        onRequest(X, D) { /* registers or queues */ },
        async stop() { /* ... */ }
    }
}

// READABLE (for understanding):
function createLspProcessWrapper(serverName) {
    let childProcess,          // q: spawned Node.js ChildProcess
        connection,            // K: vscode-jsonrpc MessageConnection
        capabilities,          // Y: negotiated server capabilities
        isInitialized = false, // z: has 'initialized' ack been sent?
        hasFailed = false,     // w: process crashed/errored?
        lastError,             // H: last error object
        isStopping = false,    // $: graceful stop in progress
        pendingNotifHandlers = [], // O: queued before connection ready
        pendingReqHandlers = [];   // _: queued before connection ready

    function assertNotFailed() {
        if (hasFailed) throw lastError || Error(`LSP server ${serverName} failed to start`);
    }
    // ...
}

// Mapping: um4→createLspProcessWrapper, A→serverName, q→childProcess,
//          K→connection, Y→capabilities, z→isInitialized, w→hasFailed,
//          H→lastError, $→isStopping, O→pendingNotifHandlers, _→pendingReqHandlers
```

### Startup Sequence (start method)

**How it works:**
1. Spawn child process with `stdio: ["pipe","pipe","pipe"]` and `windowsHide: true`
2. Wait for `spawn` event via Promise — gates on actual process startup, not just command launch
3. Attach stderr listener → logs `[LSP SERVER ${name}] ...` lines from the server
4. Attach `error` / `exit` event handlers for crash detection
5. Create `StreamMessageReader(stdout)` + `StreamMessageWriter(stdin)` via vscode-jsonrpc
6. Create `MessageConnection` from reader/writer, enable verbose tracing to internal log
7. Flush queued notification/request handlers (registered before connection was ready)

**Why the spawn-event gate matters:** Node.js's `spawn()` returns before the process is running. Without waiting for `spawn`, you might try to send JSON-RPC before the pipe is writable, producing silent drops. The Promise wrapper ensures initialization is sequential.

**Handler queuing design:** When `onNotification()` is called before `start()` completes (e.g., to register `publishDiagnostics` handlers immediately after creating the client), handlers are buffered in `O` / `_` arrays and replayed once the connection is ready. This prevents a race condition where diagnostics arrive before handlers are registered.

### Initialize Method

```javascript
// ORIGINAL:
async initialize(X) {
    if (!K) throw Error("LSP client not started");
    J(); // assertNotFailed
    try {
        let D = await K.sendRequest("initialize", X);
        return Y = D.capabilities, await K.sendNotification("initialized", {}), z = !0, ...D
    } catch (D) { throw K1(Error(...)), D }
}

// READABLE:
async initialize(initParams) {
    const result = await connection.sendRequest("initialize", initParams);
    capabilities = result.capabilities;           // store negotiated caps
    await connection.sendNotification("initialized", {});  // LSP handshake
    isInitialized = true;
    return result;
}
```

**Key insight:** The two-step handshake (`initialize` request → `initialized` notification) is required by the LSP spec. Setting `isInitialized = true` only after the `initialized` notification prevents any requests from being dispatched before the server is ready.

### Stop Method

The stop sequence follows the LSP shutdown protocol:
1. Set `isStopping = true` (suppresses crash detection for the managed teardown)
2. Send `shutdown` request (server flushes pending work)
3. Send `exit` notification (server terminates)
4. Dispose `MessageConnection`
5. `kill()` the child process
6. Clear all event listeners

**Why `isStopping` flag?** Without it, the `exit` event (exit code 0 from a clean shutdown) would trigger crash recovery logic, causing spurious error logs or restart attempts.

---

## Layer 2: Server Instance with Retry Logic (Fm4)

### createLspClient (High-Level)

**What it does:** Adds state machine (`stopped→starting→running→stopping→stopped/error`), restart tracking, and ContentModified retry logic on top of `createLspProcessWrapper`.

```javascript
// ============================================
// createLspClient (LspServerInstance) - State-managed server wrapper
// Location: chunks.133.mjs:1785-1957
// ============================================

// ORIGINAL:
function Fm4(A, q) {
    if (q.restartOnCrash !== void 0) throw Error(`...restartOnCrash is not yet implemented...`);
    if (q.startupTimeout !== void 0) throw Error(`...startupTimeout is not yet implemented...`);
    if (q.shutdownTimeout !== void 0) throw Error(`...shutdownTimeout is not yet implemented...`);
    let K = um4(A),     // createLspProcessWrapper
        Y = "stopped",  // state
        z, w, H = 0;    // startTime, lastError, restartCount
    // ...
}

// READABLE:
function createLspClient(serverName, config) {
    // Guard: reject not-yet-implemented config fields
    if (config.restartOnCrash !== undefined) throw Error("restartOnCrash not yet implemented");

    let processWrapper = createLspProcessWrapper(serverName);
    let state = "stopped";      // Y: "stopped"|"starting"|"running"|"stopping"|"error"
    let startTime;              // z: Date when server became running
    let lastError;              // w: last Error object
    let restartCount = 0;       // H: number of restarts attempted
    // ...
}
// Mapping: Fm4→createLspClient, A→serverName, q→config, K→processWrapper,
//          Y→state, z→startTime, w→lastError, H→restartCount
```

### Client Capabilities Advertised to Server

The initialization parameters sent in the `initialize` request define what Claude Code tells the LSP server it can handle:

```javascript
const initParams = {
    processId: process.pid,
    initializationOptions: config.initializationOptions ?? {},
    workspaceFolders: [{
        uri: `file://${workspacePath}`,
        name: path.basename(workspacePath)
    }],
    rootPath: workspacePath,        // legacy field, still expected by many servers
    rootUri: `file://${workspacePath}`,
    capabilities: {
        workspace: {
            configuration: false,   // Claude Code does NOT handle workspace/configuration requests
            workspaceFolders: false  // Claude Code does NOT update workspace folder list
        },
        textDocument: {
            synchronization: {
                dynamicRegistration: false,
                willSave: false,        // no pre-save hooks
                willSaveWaitUntil: false,
                didSave: true           // ONLY sends didSave notifications
            },
            publishDiagnostics: {
                relatedInformation: true,
                tagSupport: { valueSet: [1, 2] },  // Unnecessary=1, Deprecated=2
                versionSupport: false,
                codeDescriptionSupport: true,
                dataSupport: false
            },
            hover: {
                dynamicRegistration: false,
                contentFormat: ["markdown", "plaintext"]
            },
            definition:     { dynamicRegistration: false, linkSupport: true },
            references:     { dynamicRegistration: false },
            documentSymbol: { dynamicRegistration: false, hierarchicalDocumentSymbolSupport: true },
            callHierarchy:  { dynamicRegistration: false }
        },
        general: {
            positionEncodings: ["utf-16"]  // LSP default; critical for correct char offsets
        }
    }
};
```

**Why `workspace.configuration: false`?** The `workspace/configuration` request would require Claude Code to maintain a persistent settings store per server. Instead, the manager intercepts these requests and returns `null` for every item (a no-op). This prevents servers that depend on configuration from crashing, while avoiding the complexity of a config management system.

**Why `synchronization.didSave` only?** Sending `didChange` on every keystroke (like a real editor) would require Claude Code to track document versions and emit incremental or full-document updates for every file write. Since the agent writes files atomically (via FileWrite/FileEdit), a single `didSave` notification after the write is sufficient.

**`workspace/configuration` interception:** The manager registers a request handler for each server:
```javascript
server.onRequest("workspace/configuration", (params) => {
    return params.items.map(() => null);
});
```
This stub prevents TypeScript Language Server (and others) from stalling indefinitely waiting for config.

### ContentModified Retry Algorithm

**What it does:** Retries failed LSP requests when the server reports it is busy re-indexing.

**How it works:**

```javascript
// ============================================
// sendRequestWithRetry - ContentModified exponential backoff
// Location: chunks.133.mjs:1892-1912
// ============================================

// ORIGINAL:
async function X(P, W) {
    if (!J()) {
        let Z = Error(`Cannot send request to LSP server '${A}': server is ${Y}...`);
        throw K1(Z), Z
    }
    let G;
    for (let Z = 0; Z <= fkA; Z++) try {
        return await K.sendRequest(P, W)
    } catch (N) {
        G = N;
        let T = N.code;
        if (typeof T === "number" && T === qvY && Z < fkA) {
            let y = KvY * Math.pow(2, Z);
            h(`LSP request '${P}' to '${A}' got ContentModified error, retrying in ${y}ms ...`),
            await new Promise((B) => setTimeout(B, y));
            continue
        }
        break
    }
    throw K1(f), f
}

// READABLE:
async function sendRequestWithRetry(method, params) {
    const MAX_RETRIES = 3;    // fkA = 3
    const BASE_DELAY = 500;   // KvY = 500ms
    const CONTENT_MODIFIED = -32801;  // qvY = LSP error code

    let lastError;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await processWrapper.sendRequest(method, params);
        } catch (error) {
            lastError = error;
            if (error.code === CONTENT_MODIFIED && attempt < MAX_RETRIES) {
                const delay = BASE_DELAY * Math.pow(2, attempt); // 500, 1000, 2000ms
                await sleep(delay);
                continue;
            }
            break;  // any other error: don't retry
        }
    }
    throw new Error(`LSP request '${method}' failed: ${lastError?.message}`);
}

// Mapping: fkA→MAX_RETRIES(3), KvY→BASE_DELAY(500), qvY→CONTENT_MODIFIED(-32801)
```

**Why exponential backoff for ContentModified?**
- LSP error code `-32801` (`ContentModified`) means the server discarded the request because the document state changed during processing (e.g., the indexer is still running).
- A fixed delay would cause thundering herd — all queued retries fire at the same moment.
- Exponential backoff (500ms → 1000ms → 2000ms) gives the server progressively more time to finish indexing.
- Three retries max prevents indefinite blocking of the agent loop.

### Restart Logic

```javascript
// ============================================
// restartLspServer - Max-attempts bounded restart
// Location: chunks.133.mjs:1868-1887
// ============================================

// ORIGINAL:
async function _() {
    try { await O() } catch (W) { ... }
    H++;  // increment restartCount
    let P = q.maxRestarts ?? 3;
    if (H > P) throw Error(`Max restart attempts (${P}) exceeded for '${A}'`);
    try { await $() } catch (W) { ... }
}

// READABLE:
async function restartServer() {
    await stopServer();
    restartCount++;
    const maxRestarts = config.maxRestarts ?? 3;
    if (restartCount > maxRestarts) {
        throw Error(`Max restart attempts (${maxRestarts}) exceeded for '${serverName}'`);
    }
    await startServer();
}
```

**Note:** `restartOnCrash` is explicitly rejected with an error message. This means auto-restart on crash is NOT yet implemented — the config field is reserved for a future feature. The restart API exists only for manual invocation.

---

## Layer 3: Polyglot Server Manager (lm4)

### LspServerManager

**What it does:** The central coordinator. Maintains three maps: servers by name, extension→server routing, and open files tracking. Provides the unified interface for file synchronization and request routing.

```javascript
// ============================================
// LspServerManager - Multi-server coordinator
// Location: chunks.133.mjs:2172-2341
// ============================================

// ORIGINAL:
function lm4() {
    let A = new Map,   // serverInstances: name → LspServerInstance
        q = new Map,   // extensionMap: ".ts" → ["ts-server", ...]
        K = new Map;   // openFiles: "file:///..." → serverName

    async function Y() { /* initialize: load configs, create instances, start all */ }
    async function z() { /* shutdown: stop all running servers */ }
    function w(M) { /* getServerForFile: extension lookup */ }
    async function H(M) { /* ensureServerStarted */ }
    async function $(M, P, W) { /* sendRequest: file→server→request */ }
    function O() { /* getAllServers: returns the full Map */ }
    async function _(M, P) { /* openFile: didOpen notification */ }
    async function J(M, P) { /* changeFile: didChange notification */ }
    async function X(M) { /* saveFile: didSave notification */ }
    async function D(M) { /* closeFile: didClose notification */ }
    function j(M) { /* isFileOpen: checks openFiles map */ }
    return { initialize: Y, shutdown: z, getServerForFile: w,
             ensureServerStarted: H, sendRequest: $, getAllServers: O,
             openFile: _, changeFile: J, saveFile: X, closeFile: D, isFileOpen: j }
}

// Mapping: lm4→LspServerManager, A→serverInstances, q→extensionMap, K→openFiles
```

### Initialize Algorithm

**What it does:** Loads all plugin-provided LSP configs, creates `LspServerInstance` objects, and starts them concurrently.

**How it works:**
1. Call `loadLspConfigs()` (dm4) → get `{ [serverName]: config }` from all enabled plugins
2. For each server config:
   - Validate: `command` is required; `extensionToLanguage` must have at least one entry
   - Build extension→server mapping: for each extension in `extensionToLanguage`, append serverName to `extensionMap`
   - Create `LspServerInstance` via `createLspClient(name, config)` (Fm4)
   - Register `workspace/configuration` stub request handler
   - Call `server.start()` asynchronously (non-blocking — failures logged but don't abort init)
3. Log total server count

**Design choice:** Starting all servers concurrently (via `.catch()` instead of `await`) means initialization doesn't block. Servers that fail to start set their state to `"error"` and the tool's `isEnabled()` check will skip them. This is a fast-fail-gracefully approach.

### File Extension Routing Algorithm

```javascript
// ORIGINAL:
function w(M) {
    let P = Bd.extname(M).toLowerCase(),  // e.g. ".ts"
        W = q.get(P);                      // extensionMap lookup
    if (!W || W.length === 0) return;
    let G = W[0];  // first registered server for this extension
    if (!G) return;
    return A.get(G)  // return the LspServerInstance
}

// READABLE:
function getServerForFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();  // e.g. ".ts"
    const serverNames = extensionMap.get(ext);         // ["typescript-language-server"]
    if (!serverNames || serverNames.length === 0) return undefined;
    return serverInstances.get(serverNames[0]);        // first match wins
}
```

**Why first-wins?** Multiple plugins could provide servers for the same extension (e.g., two TypeScript server variants). Taking the first registered one prevents conflicts. The registration order follows plugin load order.

### File Synchronization Protocol

The manager implements the document lifecycle:

```
openFile(path, content)   → textDocument/didOpen    (version: 1)
changeFile(path, content) → textDocument/didChange  (full replacement, version: 1)
saveFile(path)            → textDocument/didSave
closeFile(path)           → textDocument/didClose
```

**openFile logic:**
```javascript
async function openFile(filePath, content) {
    const server = await ensureServerStarted(filePath);
    if (!server) return;
    const fileUri = `file://${path.resolve(filePath)}`;
    if (openFiles.get(fileUri) === server.name) {
        return;  // already open on this server, skip didOpen
    }
    const ext = path.extname(filePath).toLowerCase();
    const languageId = server.config.extensionToLanguage[ext] || "plaintext";
    await server.sendNotification("textDocument/didOpen", {
        textDocument: { uri: fileUri, languageId, version: 1, text: content }
    });
    openFiles.set(fileUri, server.name);
}
```

**changeFile vs openFile:** Before sending `didChange`, the manager checks if the file is already open on the correct server. If not (e.g., after a server restart), it falls back to `openFile`. This handles the case where the server was restarted between file open and file change.

**Version pinned at 1:** The LSP spec requires incrementing document versions with each change. Claude Code always sends `version: 1` because it treats each write as a complete document replacement (no incremental patching). LSP servers are expected to tolerate this.

---

## Layer 4: Configuration Loading Pipeline (dm4 / HvY)

### loadLspConfigs

**What it does:** Aggregates LSP server configurations from all enabled plugins.

```javascript
// ============================================
// loadLspConfigs - Plugin LSP config aggregator
// Location: chunks.133.mjs:2144-2163
// ============================================

// ORIGINAL:
async function dm4() {
    let A = {};  // result: { [serverName]: config }
    try {
        let { enabled: q } = await iY();  // getLoadedPlugins
        for (let K of q) {
            let Y = [], z = await Um4(K, Y);  // loadPluginLspConfig
            if (z && Object.keys(z).length > 0) Object.assign(A, z);
            if (Y.length > 0) h(`${Y.length} error(s) loading LSP servers from plugin: ${K.name}`)
        }
    } catch (q) { /* log error */ }
    return { servers: A }
}

// READABLE:
async function loadLspConfigs() {
    const allServers = {};
    const { enabled: enabledPlugins } = await getLoadedPlugins();
    for (const plugin of enabledPlugins) {
        const errors = [];
        const pluginServers = await loadSinglePluginLspConfig(plugin, errors);
        if (pluginServers) Object.assign(allServers, pluginServers);
        // errors are logged but don't abort
    }
    return { servers: allServers };
}
```

### loadPluginLspConfig (HvY)

Reads LSP config from two sources per plugin:
1. `.lsp.json` file in the plugin root (a JSON record of server name → config)
2. `lspServers` field in the plugin manifest (can be a path, inline record, or array of paths/records)

```javascript
// ORIGINAL:
async function HvY(A, q = []) {
    let K = {};  // collected configs
    let Y = YvY(A.path, ".lsp.json");  // join(pluginPath, ".lsp.json")
    try {
        let z = await gm4(Y, "utf-8"),
            w = _A(z),  // JSON.parse
            H = u.record(u.string(), ew1).safeParse(w);  // Zod validation
        if (H.success) Object.assign(K, H.data);
        else { /* push validation error */ }
    } catch (z) {
        if (z.code !== "ENOENT") { /* log non-ENOENT errors */ }
        // ENOENT is normal: plugin doesn't have .lsp.json
    }
    if (A.manifest.lspServers) {
        let z = await $vY(A.manifest.lspServers, A.path, A.name, q);
        if (z) Object.assign(K, z);
    }
    return Object.keys(K).length > 0 ? K : undefined;
}
```

### Variable Expansion in LSP Configs (OvY / _vY)

Configs may reference `${CLAUDE_PLUGIN_ROOT}` and other env vars. Before use, all config strings are expanded:

```javascript
// ORIGINAL:
function OvY(A, q) {
    return A.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, q)
}

// _vY expands a single server config:
// 1. Replace ${CLAUDE_PLUGIN_ROOT} in command, args, env values, workspaceFolder
// 2. Collect names of any missing env vars → emit a warning
// 3. Inject CLAUDE_PLUGIN_ROOT into the env object
```

### Server Namespacing (JvY)

Each plugin's servers are namespaced to prevent collisions:
```javascript
// Input:  { "typescript": { command: "tsserver", ... } }
// Output: { "plugin:my-plugin:typescript": { ...config, scope: "dynamic", source: "my-plugin" } }
function namespacePluginServers(servers, pluginName) {
    const result = {};
    for (const [name, config] of Object.entries(servers)) {
        result[`plugin:${pluginName}:${name}`] = {
            ...config,
            scope: "dynamic",
            source: pluginName
        };
    }
    return result;
}
```

### Security: Path Traversal Prevention in lspServers

When `lspServers` references a file path string, the path is validated against the plugin root:
```javascript
function wvY(pluginPath, configPath) {
    const absolute = resolve(pluginPath);
    const joined = resolve(pluginPath, configPath);
    const relative = relative(absolute, joined);
    // If relative path starts with ".." → escaping the plugin dir → BLOCK
    if (relative.startsWith("..") || isAbsolute(relative)) return null;
    return joined;
}
```
Any path traversal attempt is blocked, logged, and reported as a validation error.

---

## Layer 5: LSP Server Config Schema (ew1)

Defined in `chunks.15.mjs:274-293` using Zod strict validation:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `command` | string | ✓ | No spaces; use `args` for arguments |
| `args` | string[] | - | Command-line arguments |
| `extensionToLanguage` | `{".ext": "langId"}` | ✓ | At least one mapping; extensions must start with `.` |
| `transport` | `"stdio"` \| `"socket"` | - | Default: `"stdio"` |
| `env` | `{string: string}` | - | Additional env vars |
| `initializationOptions` | unknown | - | Passed verbatim in `initialize` request |
| `settings` | unknown | - | For `workspace/didChangeConfiguration` (reserved) |
| `workspaceFolder` | string | - | Overrides default CWD |
| `startupTimeout` | number | - | **Not yet implemented** — rejected at runtime |
| `shutdownTimeout` | number | - | **Not yet implemented** — rejected at runtime |
| `restartOnCrash` | boolean | - | **Not yet implemented** — rejected at runtime |
| `maxRestarts` | number | - | Default: 3 |

---

## Layer 6: Passive Diagnostics System

### Full Pipeline

```
LSP Server ──publishDiagnostics──► em4 (registerNotificationHandlers)
                                          │ calls om4 (registerDiagnostics)
                                          │         │ stores in cQ1 (Map)
                                          ▼
                                   sm4 (checkDiagnosticsRegistry)
                                   │ deduplicates via hashing
                                   │ volume-limits (VP6=10/file, nm4=30 total)
                                   │ sort by severity
                                   ▼
                                   WIY (getLSPDiagnosticAttachments)
                                   │ called per agent turn
                                   ▼
                                   System prompt as `lsp_diagnostics` attachment
```

### registerNotificationHandlers (em4)

**What it does:** After the LSP manager is initialized, wires up `textDocument/publishDiagnostics` listeners on every registered server.

**How it works:**
```javascript
// ORIGINAL (simplified):
function em4(A) {
    let q = A.getAllServers(), K = [], Y = 0, z = new Map;  // errors, successCount, failureTracker
    for (let [H, $] of q.entries()) try {
        if (!$ || typeof $.onNotification !== "function") {
            K.push({ serverName: H, error: "..." });
            continue
        }
        $.onNotification("textDocument/publishDiagnostics", async (O) => {
            // validate O has uri + diagnostics
            let _ = O, J = WvY(_),   // convertDiagnosticUriToPath
                X = J[0];
            if (!X || X.diagnostics.length === 0) return;
            om4({ serverName: H, files: J });   // register
            z.delete(H);  // reset consecutive failure counter
        });
        Y++
    } catch (O) { K.push({ serverName: H, error: O.message }) }
    // log: Y/q.size succeeded
}

// READABLE:
function registerNotificationHandlers(manager) {
    const servers = manager.getAllServers();
    for (const [serverName, server] of servers.entries()) {
        server.onNotification("textDocument/publishDiagnostics", async (params) => {
            const diagnosticFiles = convertDiagnosticParamsToFiles(params);
            if (!diagnosticFiles[0] || diagnosticFiles[0].diagnostics.length === 0) return;
            registerDiagnostics({ serverName, files: diagnosticFiles });
        });
    }
}
```

**Consecutive failure tracking:** If the diagnostic handler throws 3+ times for the same server, a `WARNING` is logged. This surfaces persistent issues (e.g., malformed params from a buggy LSP server) without crashing.

### registerDiagnostics (om4) — The Pending Registry

```javascript
// ============================================
// registerDiagnostics - Buffers incoming diagnostics
// Location: chunks.133.mjs:2350-2361
// ============================================

// ORIGINAL:
function om4({ serverName: A, files: q }) {
    let K = XvY();  // generateUUID
    cQ1.set(K, {
        serverName: A,
        files: q,
        timestamp: Date.now(),
        attachmentSent: false
    })
}

// READABLE:
function registerDiagnostics({ serverName, files }) {
    const id = generateUUID();
    pendingDiagnosticsMap.set(id, {  // cQ1: Map<uuid, DiagnosticSet>
        serverName,
        files,
        timestamp: Date.now(),
        attachmentSent: false   // marks when delivered to agent
    });
}
```

### checkDiagnosticsRegistry (sm4) — Dedup + Volume Limit

**What it does:** The core delivery algorithm. Collects all un-sent diagnostics, deduplicates, volume-limits, and returns the final payload.

**How it works:**
1. **Collect** all `DiagnosticSet` records where `attachmentSent === false`
2. **Deduplicate** via `jvY()`:
   - Hash each diagnostic: `SHA(message + severity + range + source + code)`
   - Skip if same hash already seen for this URI (current batch) or already delivered (LRU cache `MW1`)
3. **Sort** each file's diagnostics by severity (Error=1 > Warning=2 > Info=3 > Hint=4)
4. **Volume-limit**:
   - Per-file cap: `VP6 = 10` diagnostics
   - Global cap: `nm4 = 30` diagnostics total
5. **Mark** all processed records as `attachmentSent = true`
6. **Update** delivered-set LRU cache `MW1` (max 500 entries, `DvY = 500`)
7. **Return** merged payload: `[{ serverName: "server1, server2", files: [...] }]`

```javascript
// ORIGINAL (simplified):
function sm4() {
    let A = [], q = new Set, K = [];
    for (let _ of cQ1.values())
        if (!_.attachmentSent) A.push(..._.files), q.add(_.serverName), K.push(_);
    if (A.length === 0) return [];
    let Y = jvY(A);   // deduplicate
    for (let _ of K) _.attachmentSent = !0;
    // sort + volume limit
    for (let _ of Y) {
        _.diagnostics.sort((X, D) => rm4(X.severity) - rm4(D.severity));
        if (_.diagnostics.length > VP6)
            _.diagnostics = _.diagnostics.slice(0, VP6);  // cap at 10/file
        let J = nm4 - H;
        if (_.diagnostics.length > J)
            _.diagnostics = _.diagnostics.slice(0, J);    // cap at 30 total
        H += _.diagnostics.length
    }
    // update MW1 (LRU) with delivered hashes
    return [{ serverName: Array.from(q).join(", "), files: Y }]
}
```

**Why LRU for delivered diagnostics?** The `MW1` cache with `max: 500` bounds memory. Without eviction, a workspace with 500+ files would grow the delivered-set indefinitely, eventually causing memory pressure on long-running sessions.

**Why sort by severity?** The agent prompt has a token budget. By placing Error-level diagnostics first, the most actionable information survives the per-file cap even if Hints are trimmed.

---

## Layer 7: Singleton Manager Lifecycle

### initializeLspServerManager (KF4)

**What it does:** Creates the singleton `LspServerManager` and starts async initialization. Uses a generation counter to handle rapid re-init (e.g., after config change).

```javascript
// ============================================
// initializeLspServerManager - Singleton init with generation guard
// Location: chunks.133.mjs:2641-2656
// ============================================

// ORIGINAL:
function KF4() {
    if (jI !== void 0 && ev !== "failed") return;  // already init'd
    if (ev === "failed") jI = void 0, vP6 = void 0; // clear failure state
    jI = lm4();   // create new manager
    ev = "pending";
    let A = ++TP6;  // generation counter
    EP6 = jI.initialize().then(() => {
        if (A === TP6) {  // still current generation?
            ev = "success";
            if (jI) em4(jI);   // registerNotificationHandlers
        }
    }).catch((q) => {
        if (A === TP6) ev = "failed", vP6 = q, jI = void 0
    })
}

// Readable state machine:
// jI (manager instance), ev (state), vP6 (error), TP6 (generation), EP6 (init Promise)
```

**Generation counter design:** `TP6` increments on each `initializeLspServerManager()` call. The `then`/`catch` callbacks only apply their state change if `A === TP6` (i.e., they are from the current generation). This prevents a stale init from overwriting the state of a newer one — critical if `YF4` (shutdown) is called immediately after `KF4`.

**State machine:**
```
"not-started" → KF4() → "pending" → success → "success" → em4() registers handlers
                                    → failure → "failed"  (jI = undefined)
"failed" → KF4() → clears error → "pending" → ...
```

### getLspManager (md)

```javascript
function md() {
    if (ev === "failed") return undefined;
    return jI;  // may be undefined if pending
}
```

**Why return `undefined` on `"failed"` explicitly?** The tool's `call()` method checks `!w` (no manager) and returns a user-visible error message rather than throwing. This makes LSP failures graceful — the agent gets an explanatory message instead of an unhandled exception.

### Startup Integration (chunks.189.mjs)

`KF4()` is called during the main REPL startup sequence:
```javascript
// chunks.189.mjs:1409
if (KF4(), !z1) {
    // ... MCP setup, UI rendering, etc.
}
```
It fires asynchronously in parallel with other startup tasks (MCP server connect, UI render). By the time the user first invokes the LSP tool, the initialization is usually complete.

`YF4()` (shutdown) is registered via `Tq(YF4)` — the process exit cleanup registry:
```javascript
// chunks.175.mjs:2339
Tq(YF4)  // = registerProcessExitCleanup(shutdownLspServerManager)
```

---

## Layer 8: The LSP Tool (vRA in chunks.140.mjs)

### Tool Metadata

```javascript
const LspTool = {
    name: "LSP",              // VRA
    maxResultSizeChars: 100000,
    isLsp: true,
    isReadOnly() { return true },
    isConcurrencySafe() { return true },
    userFacingName() { return "LSP" },
}
```

### isEnabled Check

```javascript
isEnabled() {
    if (getLspManagerStatus().status === "failed") return false;
    const manager = getLspManager();
    if (!manager) return false;
    const servers = manager.getAllServers();
    if (servers.size === 0) return false;
    // Tool is enabled if ANY server is not in error state
    return Array.from(servers.values()).some(s => s.state !== "error");
}
```

**Why `some(s => s.state !== "error")`?** A workspace might have TypeScript and Python servers. If the Python server fails to start but TypeScript is healthy, the tool should still be available for `.ts` files. The check requires at least one functional server.

### Supported Operations (LCY → buildLspRequestParams)

```javascript
// ============================================
// buildLspRequestParams - Operation → JSON-RPC method mapper
// Location: chunks.140.mjs:454-541
// ============================================

// ORIGINAL:
function LCY(A, q) {
    let K = vCY(q).href,   // pathToFileURL(filePath).href
        Y = { line: A.line - 1, character: A.character - 1 };  // 1-based → 0-based
    switch (A.operation) {
        case "goToDefinition":      return { method: "textDocument/definition", params: {...} };
        case "findReferences":      return { method: "textDocument/references", params: { ..., context: { includeDeclaration: true } } };
        case "hover":               return { method: "textDocument/hover", params: {...} };
        case "documentSymbol":      return { method: "textDocument/documentSymbol", params: {...} };
        case "workspaceSymbol":     return { method: "workspace/symbol", params: { query: "" } };
        case "goToImplementation":  return { method: "textDocument/implementation", params: {...} };
        case "prepareCallHierarchy":return { method: "textDocument/prepareCallHierarchy", params: {...} };
        case "incomingCalls":       return { method: "textDocument/prepareCallHierarchy", params: {...} };
        case "outgoingCalls":       return { method: "textDocument/prepareCallHierarchy", params: {...} };
    }
}
```

**Call hierarchy two-step:** For `incomingCalls` and `outgoingCalls`, `LCY` maps both to `textDocument/prepareCallHierarchy` as the first request. The tool's `call()` then uses the returned `CallHierarchyItem` to make a second request to `callHierarchy/incomingCalls` or `callHierarchy/outgoingCalls`:

```javascript
// In LspTool.call():
if (operation === "incomingCalls" || operation === "outgoingCalls") {
    const hierarchyItems = await manager.sendRequest(filePath, "textDocument/prepareCallHierarchy", params);
    if (!hierarchyItems || hierarchyItems.length === 0) return "No call hierarchy item found";
    const secondMethod = operation === "incomingCalls"
        ? "callHierarchy/incomingCalls"
        : "callHierarchy/outgoingCalls";
    result = await manager.sendRequest(filePath, secondMethod, { item: hierarchyItems[0] });
}
```

**Why not a direct `callHierarchy/incomingCalls`?** The LSP spec requires prepare first — the server returns a canonical `CallHierarchyItem` (which may differ from the raw position), and that item is passed to the second call. Skipping prepare would violate the protocol.

**`workspaceSymbol` query is `""`:** This requests all workspace symbols. A non-empty query would filter — but since Claude Code wants the full picture, it always asks for everything.

### Tool call() Main Flow

```javascript
async call(input, context) {
    const filePath = resolvePath(input.filePath);

    // 1. Wait if manager is pending
    if (getLspManagerStatus().status === "pending") await waitForLspManager();

    const manager = getLspManager();
    if (!manager) return { data: { result: "LSP server manager not initialized", ... } };

    // 2. Map operation → method+params
    const { method, params } = buildLspRequestParams(input, filePath);

    // 3. Auto-open file if not already open
    if (!manager.isFileOpen(filePath)) {
        const content = await readFile(filePath, "utf-8");
        await manager.openFile(filePath, content);
    }

    // 4. Send request (with retry logic in LspServerInstance)
    let result = await manager.sendRequest(filePath, method, params);

    // 5. Special handling for call hierarchy (two-step)
    if (operation === "incomingCalls" || operation === "outgoingCalls") {
        // ... second request as described above
    }

    // 6. Format result
    const { formatted, resultCount, fileCount } = formatLspResult(operation, result, cwd);
    return { data: { operation, result: formatted, filePath, resultCount, fileCount } };
}
```

**Auto-open on first access:** If the LSP tool is invoked on a file the manager hasn't seen yet, it reads the file and sends `didOpen`. This is important because LSP servers may not return results for files they haven't indexed. Without `didOpen`, `textDocument/hover` on an unregistered file often returns `null`.

### Input/Output Schema

**Input** (ECY — Zod strict object):
```
operation: "goToDefinition" | "findReferences" | "hover" | "documentSymbol" |
           "workspaceSymbol" | "goToImplementation" | "prepareCallHierarchy" |
           "incomingCalls" | "outgoingCalls"
filePath:  string (absolute or relative)
line:      positive integer (1-based)
character: positive integer (1-based)
```

**Output** (kCY):
```
operation:    string (echoed)
result:       string (formatted output)
filePath:     string
resultCount?: number
fileCount?:   number
```

**1-based → 0-based conversion:** The agent inputs use 1-based line/character (editor convention). `LCY` converts: `{ line: A.line - 1, character: A.character - 1 }`. LSP itself uses 0-based positions.

### Symbol Kind Mapping (cW1)

LSP returns `DocumentSymbol.kind` as an integer (1–26). The formatter maps these:

```
1=File, 2=Module, 3=Namespace, 4=Package, 5=Class, 6=Method, 7=Property,
8=Field, 9=Constructor, 10=Enum, 11=Interface, 12=Function, 13=Variable,
14=Constant, 15=String, 16=Number, 17=Boolean, 18=Array, 19=Object,
20=Key, 21=Null, 22=EnumMember, 23=Struct, 24=Event, 25=Operator, 26=TypeParameter
```

Hierarchical symbols are recursively formatted with 2-space indentation per level.

---

## File Synchronization: Edit Tool → LSP Integration

When `FileEditTool` (chunks.134.mjs) or `FileWriteTool` (chunks.146.mjs) writes a file, they notify the LSP manager:

```javascript
// chunks.134.mjs:2361-2366 (FileEditTool.call)
const manager = getLspManager();  // md()
if (manager) {
    clearDeliveredDiagnosticsForUri(`file://${filePath}`);  // NP6()
    manager.changeFile(filePath, newContent)
        .catch(err => logError(err));
    manager.saveFile(filePath)
        .catch(err => logError(err));
}
```

**Why clear delivered diagnostics?** After a file edit, old diagnostics for that file are stale. `NP6()` removes the file's hash set from the LRU cache `MW1`, so the next `publishDiagnostics` notification for the same file will be delivered as fresh (not deduplicated away).

**Why both `changeFile` and `saveFile`?** Some LSP servers (e.g., tsserver) only re-analyze on `didSave`. Others index on `didChange`. Sending both ensures maximum compatibility.

**Non-blocking with `.catch()`:** Both notifications are fire-and-forget. Failing to notify the LSP server of a file change is not fatal — the tool will still work, just with potentially stale data.

---

## Diagnostics Injection into System Prompt

### Pipeline Integration

```javascript
// chunks.142.mjs:1962 — buildAttachments()
const D = isMainAgent ? [
    // ...other attachments...
    gw("lsp_diagnostics", async () => WIY(sessionContext)),
    // ...
] : [];
```

`WIY` (getLSPDiagnosticAttachments) calls `sm4()` (checkDiagnosticsRegistry) and formats results. Diagnostics appear as a `type: "diagnostics"` system reminder injected before the assistant turn.

**Timing:** Diagnostics are collected fresh on every agent turn (before each LLM API call). This means if a server pushes diagnostics between turns, they appear in the next turn's system prompt — providing real-time feedback on the agent's edits.

---

## Summary: Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| `didSave` only (not `didChange`) | Avoids version tracking complexity; atomic file writes make full sync sufficient |
| Lazy server start | Servers only start when a file of their extension is first accessed, saving resources for unused languages |
| `workspace/configuration` stub returning `null` | Prevents server stalls without requiring a full settings management system |
| 3-retry exponential backoff for ContentModified | Balances responsiveness against thundering herd during indexing |
| Diagnostic deduplication via hashing | Prevents duplicate errors from filling the agent's context window |
| 10/file + 30 total diagnostic cap | Constrains token usage while surfacing the most actionable errors |
| LRU(500) for delivered diagnostics | Bounds memory for long-running sessions with many files |
| Generation counter in singleton init | Handles rapid re-initialization without race conditions |
| Path traversal check on plugin LSP config paths | Sandboxes plugins to their own directory |
