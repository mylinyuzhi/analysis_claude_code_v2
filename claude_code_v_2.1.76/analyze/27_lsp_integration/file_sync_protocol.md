# LSP File Sync Protocol - Complete Analysis

> **Module**: LSP Integration
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.138.mjs`

---

## Overview

LSP servers need to be aware of file contents to provide accurate analysis. This document covers the complete file synchronization protocol used by Claude Code to keep LSP servers in sync with the file system.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure

Key functions in this document:
- `openFile` (H in eo4) - Send didOpen notification
- `changeFile` (j in eo4) - Send didChange notification
- `saveFile` (J in eo4) - Send didSave notification
- `closeFile` (M in eo4) - Send didClose notification
- `isFileOpen` (D in eo4) - Check if file is tracked
- `getServerForFile` (_ in eo4) - Resolve server by extension
- `ensureServerStarted` (w in eo4) - Start server if stopped

---

## Protocol Overview

LSP servers maintain an internal model of open files. The synchronization protocol ensures this model matches the actual file system state.

### Synchronization Methods

| Method | LSP Notification | Purpose |
|--------|------------------|---------|
| `openFile` | `textDocument/didOpen` | Register file with server |
| `changeFile` | `textDocument/didChange` | Notify of content changes |
| `saveFile` | `textDocument/didSave` | Notify of file save |
| `closeFile` | `textDocument/didClose` | Unregister file from server |

### State Management

```javascript
// ============================================
// LSP Server Manager State
// Location: chunks.138.mjs:806-809
// ============================================

// ORIGINAL:
function eo4() {
    let A = new Map,     // servers: name → client
        q = new Map,     // extensionMap: .ts → ["typescript-language-server"]
        K = new Map;     // openFiles: uri → serverName

// READABLE:
function LspServerManager() {
    const servers = new Map();        // name → LspClient instance
    const extensionMap = new Map();   // .ts → ["typescript-language-server"]
    const openFiles = new Map();      // uri → serverName that owns this file

// Mapping: eo4→LspServerManager, A→servers, q→extensionMap, K→openFiles
```

---

## File Open Protocol

### Implementation

```javascript
// ============================================
// openFile - Send textDocument/didOpen
// Location: chunks.138.mjs:878-901
// ============================================

// ORIGINAL:
async function H(X, P) {
    let W = await w(X);  // ensureServerStarted
    if (!W) return;
    let Z = Vl6(fl.resolve(X)).href;
    if (K.get(Z) === W.name) {
        k(`LSP: File already open, skipping didOpen for ${X}`);
        return
    }
    let G = fl.extname(X).toLowerCase(),
        f = W.config.extensionToLanguage[G] || "plaintext";
    try {
        await W.sendNotification("textDocument/didOpen", {
            textDocument: {
                uri: Z,
                languageId: f,
                version: 1,
                text: P
            }
        }), K.set(Z, W.name), k(`LSP: Sent didOpen for ${X} (languageId: ${f})`)
    } catch (v) {
        let N = Error(`Failed to sync file open ${X}: ${v.message}`);
        throw _6(N), N
    }
}

// READABLE:
async function openFile(filePath, content) {
    // 1. Ensure server is started
    const client = await ensureServerStarted(filePath);
    if (!client) return;  // No server for this file type

    // 2. Build file URI
    const uri = pathToFileUrl(path.resolve(filePath)).href;

    // 3. Check if already open
    if (openFiles.get(uri) === client.name) {
        log(`LSP: File already open, skipping didOpen for ${filePath}`);
        return;  // Idempotent
    }

    // 4. Determine language ID from extension
    const ext = path.extname(filePath).toLowerCase();
    const languageId = client.config.extensionToLanguage[ext] || "plaintext";

    // 5. Send didOpen notification
    try {
        await client.sendNotification("textDocument/didOpen", {
            textDocument: {
                uri: uri,
                languageId: languageId,
                version: 1,
                text: content
            }
        });

        // 6. Track open file
        openFiles.set(uri, client.name);
        log(`LSP: Sent didOpen for ${filePath} (languageId: ${languageId})`);

    } catch (error) {
        const wrappedError = Error(`Failed to sync file open ${filePath}: ${error.message}`);
        logError(wrappedError);
        throw wrappedError;
    }
}

// Mapping: H→openFile, w→ensureServerStarted, Vl6→pathToFileUrl, fl→path, K→openFiles, k→log
```

### didOpen Notification Structure

```typescript
interface DidOpenParams {
    textDocument: {
        uri: string;           // "file:///path/to/file.ts"
        languageId: string;    // "typescript", "python", "go", etc.
        version: number;       // Always 1 for initial open
        text: string;          // Full file content
    }
}
```

### Extension to Language ID Resolution

```javascript
// ============================================
// Language ID Resolution
// ============================================

// Example mapping from config:
const extensionToLanguage = {
    ".ts": "typescript",
    ".tsx": "typescriptreact",
    ".js": "javascript",
    ".jsx": "javascriptreact",
    ".py": "python",
    ".go": "go",
    ".rs": "rust"
};

// Resolution logic:
const languageId = client.config.extensionToLanguage[ext] || "plaintext";
```

### Open File Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FILE OPEN FLOW                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  openFile(filePath, content) called                                     │
│      │                                                                   │
│      ▼                                                                   │
│  ensureServerStarted(filePath)                                          │
│      │                                                                   │
│      ├─► getServerForFile(filePath)                                     │
│      │   └─► extensionMap.get(".ts") → "typescript-language-server"    │
│      │                                                                   │
│      └─► if (client.state === "stopped") await client.start()          │
│          │                                                               │
│          ▼                                                               │
│  Check openFiles Map                                                    │
│      │                                                                   │
│      ├─► URI already tracked for this server?                           │
│      │   └─► Yes → Skip (idempotent)                                    │
│      │                                                                   │
│      └─► No → Continue                                                  │
│          │                                                               │
│          ▼                                                               │
│  Build notification:                                                    │
│  {                                                                       │
│    textDocument: {                                                       │
│      uri: "file:///absolute/path/to/file.ts",                           │
│      languageId: "typescript",                                          │
│      version: 1,                                                         │
│      text: "export function hello() { ... }"                           │
│    }                                                                     │
│  }                                                                       │
│      │                                                                   │
│      ▼                                                                   │
│  client.sendNotification("textDocument/didOpen", params)               │
│      │                                                                   │
│      ▼                                                                   │
│  openFiles.set(uri, serverName)                                         │
│      │                                                                   │
│      ▼                                                                   │
│  LSP server now has file in its internal model                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## File Change Protocol

### Implementation

```javascript
// ============================================
// changeFile - Send textDocument/didChange
// Location: chunks.138.mjs:902-921
// ============================================

// ORIGINAL:
async function j(X, P) {
    let W = _(X);  // getServerForFile
    if (!W || W.state !== "running") return H(X, P);  // Fallback to open
    let Z = Vl6(fl.resolve(X)).href;
    if (K.get(Z) !== W.name) return H(X, P);  // Not our file, open instead
    try {
        await W.sendNotification("textDocument/didChange", {
            textDocument: {
                uri: Z,
                version: 1
            },
            contentChanges: [{
                text: P
            }]
        }), k(`LSP: Sent didChange for ${X}`)
    } catch (G) {
        let f = Error(`Failed to sync file change ${X}: ${G.message}`);
        throw _6(f), f
    }
}

// READABLE:
async function changeFile(filePath, content) {
    // 1. Get server for file
    const client = getServerForFile(filePath);

    // 2. Fallback to open if server not running
    if (!client || client.state !== "running") {
        return openFile(filePath, content);
    }

    // 3. Build URI
    const uri = pathToFileUrl(path.resolve(filePath)).href;

    // 4. Check if this server owns the file
    if (openFiles.get(uri) !== client.name) {
        return openFile(filePath, content);  // Different server or not open
    }

    // 5. Send didChange notification
    try {
        await client.sendNotification("textDocument/didChange", {
            textDocument: {
                uri: uri,
                version: 1
            },
            contentChanges: [{
                text: content  // Full file content (not incremental)
            }]
        });
        log(`LSP: Sent didChange for ${filePath}`);

    } catch (error) {
        const wrappedError = Error(`Failed to sync file change ${filePath}: ${error.message}`);
        logError(wrappedError);
        throw wrappedError;
    }
}

// Mapping: j→changeFile, _→getServerForFile, H→openFile, Vl6→pathToFileUrl, K→openFiles
```

### didChange Notification Structure

```typescript
interface DidChangeParams {
    textDocument: {
        uri: string;
        version: number;       // Typically unchanged (Claude uses 1)
    };
    contentChanges: Array<{
        // Full text mode (used by Claude Code):
        text: string;
    } | {
        // Incremental mode (not used):
        range: Range;
        rangeLength?: number;
        text: string;
    }>;
}
```

**Important:** Claude Code uses **full text sync mode**, sending the entire file content on each change, not incremental ranges.

### Change vs Open Decision Tree

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CHANGE VS OPEN DECISION                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  changeFile(filePath, content) called                                   │
│      │                                                                   │
│      ▼                                                                   │
│  getServerForFile(filePath) → client                                    │
│      │                                                                   │
│      ├─► No server found?                                               │
│      │   └─► Return silently (no LSP support for this file type)        │
│      │                                                                   │
│      ├─► Server not running?                                            │
│      │   └─► Fallback: openFile() (start server + send didOpen)         │
│      │                                                                   │
│      └─► Server running                                                 │
│          │                                                               │
│          ▼                                                               │
│      Is file open for this server?                                      │
│          │                                                               │
│          ├─► No (different server or never opened)                      │
│          │   └─► Fallback: openFile()                                   │
│          │                                                               │
│          └─► Yes                                                         │
│              └─► Send didChange                                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## File Save Protocol

### Implementation

```javascript
// ============================================
// saveFile - Send textDocument/didSave
// Location: chunks.138.mjs:922-935
// ============================================

// ORIGINAL:
async function J(X) {
    let P = _(X);
    if (!P || P.state !== "running") return;
    try {
        await P.sendNotification("textDocument/didSave", {
            textDocument: {
                uri: Vl6(fl.resolve(X)).href
            }
        }), k(`LSP: Sent didSave for ${X}`)
    } catch (W) {
        let Z = Error(`Failed to sync file save ${X}: ${W.message}`);
        throw _6(Z), Z
    }
}

// READABLE:
async function saveFile(filePath) {
    // 1. Get server for file
    const client = getServerForFile(filePath);

    // 2. Skip if no server or not running
    if (!client || client.state !== "running") return;

    // 3. Send didSave notification
    try {
        await client.sendNotification("textDocument/didSave", {
            textDocument: {
                uri: pathToFileUrl(path.resolve(filePath)).href
            }
        });
        log(`LSP: Sent didSave for ${filePath}`);

    } catch (error) {
        const wrappedError = Error(`Failed to sync file save ${filePath}: ${error.message}`);
        logError(wrappedError);
        throw wrappedError;
    }
}

// Mapping: J→saveFile, _→getServerForFile, Vl6→pathToFileUrl
```

### didSave Notification Structure

```typescript
interface DidSaveParams {
    textDocument: {
        uri: string;
        // Optionally: text: string (if includeText capability set)
    };
}
```

### When Save is Triggered

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SAVE TRIGGER POINTS                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. After Write tool execution                                          │
│     └─► File edit tool saves file → trigger didSave                    │
│                                                                          │
│  2. After Apply tool execution                                          │
│     └─► Edit application saves file → trigger didSave                  │
│                                                                          │
│  3. External file save detection                                        │
│     └─► IDE integration detects save → trigger didSave                 │
│                                                                          │
│  IMPORTANT: didSave is NOT triggered by didChange                       │
│     └─► Changes in memory don't trigger save notifications             │
│     └─► Only actual file persistence triggers save                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## File Close Protocol

### Implementation

```javascript
// ============================================
// closeFile - Send textDocument/didClose
// Location: chunks.138.mjs:936-950
// ============================================

// ORIGINAL:
async function M(X) {
    let P = _(X);
    if (!P || P.state !== "running") return;
    let W = Vl6(fl.resolve(X)).href;
    try {
        await P.sendNotification("textDocument/didClose", {
            textDocument: {
                uri: W
            }
        }), K.delete(W), k(`LSP: Sent didClose for ${X}`)
    } catch (Z) {
        let G = Error(`Failed to sync file close ${X}: ${Z.message}`);
        throw _6(G), G
    }
}

// READABLE:
async function closeFile(filePath) {
    // 1. Get server for file
    const client = getServerForFile(filePath);

    // 2. Skip if no server or not running
    if (!client || client.state !== "running") return;

    // 3. Build URI
    const uri = pathToFileUrl(path.resolve(filePath)).href;

    // 4. Send didClose notification
    try {
        await client.sendNotification("textDocument/didClose", {
            textDocument: {
                uri: uri
            }
        });

        // 5. Remove from tracking
        openFiles.delete(uri);
        log(`LSP: Sent didClose for ${filePath}`);

    } catch (error) {
        const wrappedError = Error(`Failed to sync file close ${filePath}: ${error.message}`);
        logError(wrappedError);
        throw wrappedError;
    }
}

// Mapping: M→closeFile, _→getServerForFile, Vl6→pathToFileUrl, K→openFiles
```

### didClose Notification Structure

```typescript
interface DidCloseParams {
    textDocument: {
        uri: string;
    };
}
```

### When Close is Triggered

Close notifications are sent to free server resources when:
- Session ends (manager shutdown)
- File is no longer being analyzed
- Manual cleanup for performance

**Note:** In practice, Claude Code tends to keep files open throughout a session and relies on the manager shutdown to close all files at once.

---

## Server Resolution

### getServerForFile Implementation

```javascript
// ============================================
// getServerForFile - Resolve server by extension
// Location: chunks.138.mjs:847-854
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
    // 1. Get extension (lowercase for case-insensitive matching)
    const ext = path.extname(filePath).toLowerCase();

    // 2. Look up server(s) that handle this extension
    const serverNames = extensionMap.get(ext);
    if (!serverNames || serverNames.length === 0) {
        return undefined;  // No server for this file type
    }

    // 3. Use first server (priority order)
    const serverName = serverNames[0];
    if (!serverName) return undefined;

    // 4. Return client instance
    return servers.get(serverName);
}

// Mapping: _→getServerForFile, fl→path, q→extensionMap, A→servers
```

### Extension Map Building

```javascript
// ============================================
// Extension map is built during manager initialization
// Location: chunks.138.mjs:820-826
// ============================================

// ORIGINAL:
let Z = Object.keys(W.extensionToLanguage);
for (let f of Z) {
    let v = f.toLowerCase();
    if (!q.has(v)) q.set(v, []);
    let N = q.get(v);
    if (N) N.push(P)  // Add server name to list
}

// READABLE:
const extensions = Object.keys(config.extensionToLanguage);
for (const ext of extensions) {
    const normalized = ext.toLowerCase();
    if (!extensionMap.has(normalized)) {
        extensionMap.set(normalized, []);
    }
    extensionMap.get(normalized)?.push(serverName);
}
```

**Example extension map:**
```javascript
extensionMap = Map {
    ".ts" → ["typescript-language-server"],
    ".tsx" → ["typescript-language-server"],
    ".js" → ["typescript-language-server"],
    ".jsx" → ["typescript-language-server"],
    ".go" → ["gopls"],
    ".py" → ["pyright"]
}
```

---

## Complete Sync Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE FILE SYNC LIFECYCLE                                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  T0: Agent requests LSP operation                                                   │
│      │                                                                               │
│      ▼                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│  │ OPEN FILE (if not already open)                                               │  │
│  │                                                                               │  │
│  │  1. Check openFiles Map                                                       │  │
│  │  2. If not open:                                                              │  │
│  │     a. Resolve server by extension                                            │  │
│  │     b. Ensure server started                                                  │  │
│  │     c. Read file content                                                      │  │
│  │     d. Send textDocument/didOpen                                              │  │
│  │     e. Track in openFiles Map                                                 │  │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
│      │                                                                               │
│      ▼                                                                               │
│  LSP operation executes (definition, references, etc.)                              │
│      │                                                                               │
│      ▼                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│  │ FILE EDIT (if agent modifies file)                                            │  │
│  │                                                                               │  │
│  │  1. Write/Edit tool executes                                                  │  │
│  │  2. changeFile(newContent) called                                            │  │
│  │     a. Check if server running                                                │  │
│  │     b. Check if file open for this server                                    │  │
│  │     c. Send textDocument/didChange                                           │  │
│  │  3. File saved to disk                                                        │  │
│  │  4. saveFile() called                                                         │  │
│  │     a. Send textDocument/didSave                                             │  │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
│      │                                                                               │
│      ▼                                                                               │
│  Subsequent LSP operations use updated file state                                   │
│      │                                                                               │
│      ▼                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│  │ SESSION END (manager shutdown)                                                │  │
│  │                                                                               │  │
│  │  1. shutdownLspServerManager() called                                        │  │
│  │  2. manager.shutdown() executes                                              │  │
│  │  3. All servers stopped:                                                      │  │
│  │     a. Send shutdown request                                                  │  │
│  │     b. Send exit notification                                                │  │
│  │     c. Kill process                                                           │  │
│  │  4. openFiles Map cleared                                                     │  │
│  │  5. All state reset                                                           │  │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Version Tracking

Claude Code uses a simplified version tracking scheme:

```javascript
// Version is always 1 for all operations
textDocument: {
    uri: uri,
    version: 1,  // Never incremented
    text: content
}
```

**Why version = 1:**
- Claude Code uses **full text sync**, not incremental
- No need to track incremental version numbers
- Server re-parses entire file on each change
- Simpler implementation, fewer edge cases

**Alternative (incremental):**
```javascript
// NOT used by Claude Code
version: 1,
contentChanges: [{
    range: { start: { line: 10, character: 0 }, end: { line: 10, character: 5 } },
    text: "newText"
}]
```

---

## Integration with File Tools

The LSP file sync is triggered automatically by file editing tools:

```javascript
// ============================================
// File tool → LSP sync integration
// Location: File tool implementation
// ============================================

// After Write tool completes:
async function afterWriteFile(filePath, content) {
    const manager = getLspManager();
    if (manager) {
        await manager.changeFile(filePath, content);
        await manager.saveFile(filePath);
    }
}

// After Edit tool completes:
async function afterEditFile(filePath, newContent) {
    const manager = getLspManager();
    if (manager) {
        await manager.changeFile(filePath, newContent);
        await manager.saveFile(filePath);
    }
}
```

---

## Error Handling

| Error | Scenario | Recovery |
|-------|----------|----------|
| Server not running | `changeFile` when server crashed | Fallback to `openFile` (restarts server) |
| File not tracked | `changeFile` for file opened by different server | Fallback to `openFile` |
| Notification fails | Network/process error | Log and throw, caller handles |
| No server for extension | Unsupported file type | Return silently |

---

## Source Locations

| Function | Symbol | Location |
|----------|--------|----------|
| openFile | H | chunks.138.mjs:878-901 |
| changeFile | j | chunks.138.mjs:902-921 |
| saveFile | J | chunks.138.mjs:922-935 |
| closeFile | M | chunks.138.mjs:936-950 |
| isFileOpen | D | chunks.138.mjs:952-955 |
| getServerForFile | _ | chunks.138.mjs:847-854 |
| ensureServerStarted | w | chunks.138.mjs:855-864 |
| LspServerManager | eo4 | chunks.138.mjs:806-969 |

---

**Last Updated**: 2026-03-24
**Version**: Claude Code 2.1.76
**Status**: Complete - All sync methods documented with source code verification