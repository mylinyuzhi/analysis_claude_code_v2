# LSP Integration - Cross-Module Integration

## Overview

The LSP subsystem integrates with several other Claude Code modules:
- **Tools System** - LSP tool registration and execution
- **System Reminder** - Diagnostic attachment injection
- **File Tools** - Automatic LSP notifications on edits
- **Plugin System** - LSP configuration loading from plugins

This document details these integration points and the data flows between them.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `LspTool` (vRA) - Tool object definition
- `getLSPDiagnosticAttachments` (WIY) - System prompt attachment builder
- `clearDeliveredDiagnosticsForUri` (NP6) - Diagnostic cache management
- `registerNotificationHandlers` (em4) - LSP notification wiring

---

## 1. LSP ↔ Tools Integration

### Tool Registration

The LSP tool is registered as a standard tool with special properties:

```javascript
// ============================================
// vRA - LSP Tool Object
// Location: chunks.140.mjs:698-855
// ============================================

// ORIGINAL:
vRA = {
    name: VRA,
    maxResultSizeChars: 1e5,
    isLsp: !0,
    async description() {
        return NRA
    },
    userFacingName: yd4,
    isEnabled() {
        if (W51().status === "failed") return !1;
        let q = md();
        if (!q) return !1;
        let K = q.getAllServers();
        if (K.size === 0) return !1;
        return Array.from(K.values()).some((z) => z.state !== "error")
    },
    get inputSchema() {
        return ECY()
    },
    get outputSchema() {
        return kCY()
    },
    isConcurrencySafe() {
        return !0
    },
    isReadOnly() {
        return !0
    },
    // ... other methods
}

// READABLE:
const LspTool = {
    name: "LSP",
    maxResultSizeChars: 100000,
    isLsp: true,  // Special flag for LSP tools

    async description() {
        return LSP_TOOL_DESCRIPTION;
    },

    userFacingName: getLspUserFacingName,

    isEnabled() {
        // Check if manager is in failed state
        if (getLspManagerStatus().status === "failed") return false;

        // Check if manager exists
        const manager = getLspManager();
        if (!manager) return false;

        // Check if any servers are available
        const servers = manager.getAllServers();
        if (servers.size === 0) return false;

        // At least one server must not be in error state
        return Array.from(servers.values()).some(s => s.state !== "error");
    },

    get inputSchema() {
        return lspInputSchema();
    },

    get outputSchema() {
        return lspOutputSchema();
    },

    isConcurrencySafe() {
        return true;  // Multiple LSP requests can run in parallel
    },

    isReadOnly() {
        return true;  // LSP operations don't modify files
    },

    // ... call, validateInput, checkPermissions, etc.
};

// Mapping: vRA→LspTool, VRA→"LSP", NRA→LSP_TOOL_DESCRIPTION, yd4→getLspUserFacingName, ECY→lspInputSchema, kCY→lspOutputSchema, W51→getLspManagerStatus, md→getLspManager
```

### Tool Properties Explained

| Property | Value | Meaning |
|----------|-------|---------|
| `isLsp` | `true` | Special marker for LSP tools (used by tool system) |
| `isReadOnly` | `true` | Safe for plan mode, no permission escalation needed |
| `isConcurrencySafe` | `true` | Can run multiple LSP requests in parallel |
| `maxResultSizeChars` | 100000 | Large results allowed (definition/reference lists) |

### isEnabled Logic Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    isEnabled() DECISION TREE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Manager status == "failed"?                                        │
│      │                                                               │
│      ├─► Yes ──► return false (initialization failed)              │
│      │                                                               │
│      └─► No ──► Continue                                            │
│                                                                      │
│  Manager exists?                                                    │
│      │                                                               │
│      ├─► No ──► return false (not initialized)                     │
│      │                                                               │
│      └─► Yes ──► Continue                                           │
│                                                                      │
│  Any servers registered?                                            │
│      │                                                               │
│      ├─► No ──► return false (no LSP support for this project)     │
│      │                                                               │
│      └─► Yes ──► Continue                                           │
│                                                                      │
│  Any server NOT in error state?                                     │
│      │                                                               │
│      ├─► No ──► return false (all servers crashed)                 │
│      │                                                               │
│      └─► Yes ──► return true (LSP available)                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Tool Execution Flow

```javascript
// ============================================
// LspTool.call - Main execution method
// Location: chunks.140.mjs:778-846
// ============================================

// ORIGINAL (partial):
async call(A, q) {
    let K = g4(A.filePath),
        Y = h6();
    if (W51().status === "pending") await qF4();
    let w = md();
    if (!w) return K1(Error("LSP server manager not initialized when tool was called")), {
        data: {
            operation: A.operation,
            result: "LSP server manager not initialized. This may indicate a startup issue.",
            filePath: A.filePath
        }
    };
    let {
        method: H,
        params: $
    } = LCY(A, K);
    try {
        if (!w.isFileOpen(K)) {
            let j = await TCY(K, "utf-8");
            await w.openFile(K, j)
        }
        let O = await w.sendRequest(K, H, $);
        // ... result handling ...
    } catch (O) {
        // ... error handling ...
    }
}

// READABLE:
async call(input, context) {
    const filePath = resolvePath(input.filePath);
    const verbose = isVerboseMode();

    // Wait for manager if still initializing
    if (getLspManagerStatus().status === "pending") {
        await waitForLspManager();
    }

    const manager = getLspManager();
    if (!manager) {
        logError(Error("LSP server manager not initialized when tool was called"));
        return {
            data: {
                operation: input.operation,
                result: "LSP server manager not initialized. This may indicate a startup issue.",
                filePath: input.filePath
            }
        };
    }

    // Build LSP request
    const { method, params } = buildLspRequestParams(input, filePath);

    try {
        // Auto-open file if not already open
        if (!manager.isFileOpen(filePath)) {
            const content = await readFileForLsp(filePath, "utf-8");
            await manager.openFile(filePath, content);
        }

        // Send request to appropriate server
        const response = await manager.sendRequest(filePath, method, params);

        // Handle call hierarchy special cases
        if (input.operation === "incomingCalls" || input.operation === "outgoingCalls") {
            // ... handle call hierarchy ...
        }

        // Format result
        const { formatted, resultCount, fileCount } = formatLspResult(
            input.operation,
            response,
            verbose
        );

        return {
            data: {
                operation: input.operation,
                result: formatted,
                filePath: input.filePath,
                resultCount,
                fileCount
            }
        };

    } catch (error) {
        logError(Error(`LSP tool request failed for ${input.operation} on ${input.filePath}`));
        return {
            data: {
                operation: input.operation,
                result: `Error performing ${input.operation}: ${error.message}`,
                filePath: input.filePath
            }
        };
    }
}

// Mapping: A→input, q→context, g4→resolvePath, h6→isVerboseMode, W51→getLspManagerStatus, qF4→waitForLspManager, md→getLspManager, LCY→buildLspRequestParams, TCY→readFileForLsp
```

---

## 2. LSP ↔ System Reminder Integration

### Diagnostic Attachment Building

Diagnostics are collected and injected into the system prompt before each LLM call:

```javascript
// ============================================
// WIY - Get LSP diagnostic attachments
// Location: chunks.142.mjs:2473-2491
// ============================================

// ORIGINAL:
async function WIY(A) {
    h("LSP Diagnostics: getLSPDiagnosticAttachments called");
    try {
        let q = sm4();
        if (q.length === 0) return [];
        h(`LSP Diagnostics: Found ${q.length} pending diagnostic set(s)`);
        let K = q.map(({
            files: Y
        }) => ({
            type: "diagnostics",
            files: Y,
            isNew: !0
        }));
        if (q.length > 0) tm4(), h(`LSP Diagnostics: Cleared ${q.length} delivered diagnostic(s) from registry`);
        return h(`LSP Diagnostics: Returning ${K.length} diagnostic attachment(s)`), K
    } catch (q) {
        let K = q instanceof Error ? q : Error(String(q));
        return K1(Error(`Failed to get LSP diagnostic attachments: ${K.message}`)), []
    }
}

// READABLE:
async function getLSPDiagnosticAttachments(sessionContext) {
    log("LSP Diagnostics: getLSPDiagnosticAttachments called");

    try {
        // Check pending diagnostics registry
        const pendingDiagnostics = checkDiagnosticsRegistry();  // sm4

        if (pendingDiagnostics.length === 0) {
            return [];  // No diagnostics to report
        }

        log(`LSP Diagnostics: Found ${pendingDiagnostics.length} pending diagnostic set(s)`);

        // Convert to attachment format
        const attachments = pendingDiagnostics.map(({ files }) => ({
            type: "diagnostics",
            files,
            isNew: true
        }));

        // Clear pending registry after delivery
        if (pendingDiagnostics.length > 0) {
            clearPendingDiagnostics();  // tm4
            log(`LSP Diagnostics: Cleared ${pendingDiagnostics.length} delivered diagnostic(s) from registry`);
        }

        log(`LSP Diagnostics: Returning ${attachments.length} diagnostic attachment(s)`);
        return attachments;

    } catch (error) {
        const err = error instanceof Error ? error : Error(String(error));
        logError(Error(`Failed to get LSP diagnostic attachments: ${err.message}`));
        return [];  // Return empty on error - don't block the agent
    }
}

// Mapping: WIY→getLSPDiagnosticAttachments, sm4→checkDiagnosticsRegistry, tm4→clearPendingDiagnostics
```

### Attachment Injection Point

The diagnostic attachment is called from the system reminder builder:

```javascript
// In buildAttachments() / phY():
gw("lsp_diagnostics", async () => WIY(sessionContext))
```

### Timing of Diagnostic Delivery

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DIAGNOSTIC DELIVERY TIMELINE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Turn N-1: Agent edits file                                         │
│      │                                                               │
│      ├─► FileEditTool.call() or FileWriteTool.call()               │
│      │   │                                                           │
│      │   ├─► Write file to disk                                     │
│      │   ├─► NP6(fileUri) — clear old diagnostics                  │
│      │   ├─► manager.changeFile() — send didChange                 │
│      │   └─► manager.saveFile() — send didSave                     │
│      │                                                               │
│      └─► LSP server reanalyzes file                                 │
│          │                                                           │
│          └─► publishDiagnostics notification                        │
│              │                                                       │
│              └─► om4() — register in pending registry               │
│                                                                      │
│  Turn N: Agent makes next LLM call                                  │
│      │                                                               │
│      ├─► buildAttachments() called                                  │
│      │   │                                                           │
│      │   └─► WIY() — get diagnostic attachments                    │
│      │       │                                                       │
│      │       ├─► sm4() — check and deduplicate pending              │
│      │       └─► tm4() — clear pending after delivery               │
│      │                                                               │
│      └─► System prompt contains:                                    │
│          │                                                           │
│          │   [LSP Diagnostics from typescript-language-server]      │
│          │   src/App.tsx:                                           │
│          │     Line 42:7 Error: Type 'string' is not...             │
│          │                                                           │
│          └─► Agent sees errors and can fix them                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Diagnostic Attachment Format

The diagnostic attachment appears in the system prompt as:

```
[LSP Diagnostics from typescript-language-server]

src/App.tsx:
  Line 42:7 Error: Type 'string' is not assignable to type 'number'. (TS2322)
  Line 58:3 Warning: 'result' is declared but its value is never read. (TS6133)

src/utils.ts:
  Line 12:5 Error: Cannot find name 'foo'. (TS2304)
```

---

## 3. LSP ↔ File Tools Integration

### File Edit Tool Integration

```javascript
// ============================================
// FileEditTool LSP notification sequence
// Location: chunks.134.mjs (after file write)
// ============================================

// READABLE (conceptual):
// After writing the file to disk:

const manager = getLspManager();  // md()
if (manager) {
    // 1. Clear stale diagnostics for this file
    clearDeliveredDiagnosticsForUri(`file://${filePath}`);  // NP6

    // 2. Send didChange notification
    manager.changeFile(filePath, newContent)
        .catch(err => { log(err); logError(err); });

    // 3. Send didSave notification
    manager.saveFile(filePath)
        .catch(err => { log(err); logError(err); });
}
```

### File Write Tool Integration

The same pattern is used in FileWriteTool (chunks.146.mjs):

```javascript
// READABLE (conceptual):
// After writing the file to disk:

const manager = getLspManager();
if (manager) {
    clearDeliveredDiagnosticsForUri(`file://${filePath}`);
    manager.changeFile(filePath, content).catch(logError);
    manager.saveFile(filePath).catch(logError);
}
```

### Notification Sequence Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FILE EDIT → LSP SEQUENCE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Agent ──FileEdit──► FileEditTool.call()                           │
│                          │                                           │
│                          ├─► write to disk                          │
│                          │                                           │
│                          ├─► NP6(fileUri)                           │
│                          │   Clear stale LSP diagnostic cache       │
│                          │                                           │
│                          ├─► manager.changeFile()                   │
│                          │   └──► didChange notification            │
│                          │        └──► LSP Server                   │
│                          │                                           │
│                          └─► manager.saveFile()                     │
│                              └──► didSave notification              │
│                                   └──► LSP Server                   │
│                                                                      │
│                                                              │       │
│                                                    (reanalysis)│      │
│                                                              ▼       │
│                                               publishDiagnostics       │
│                                                              │       │
│                                               om4 (registerDiagnostics)│
│                                                              │       │
│                                          → available in next agent turn│
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Why Clear Delivered Diagnostics?

```javascript
// ============================================
// NP6 - Clear delivered diagnostics for URI
// Location: chunks.133.mjs:2463-2465
// ============================================

// ORIGINAL:
function NP6(A) {
    if (MW1.has(A)) h(`LSP Diagnostics: Clearing delivered diagnostics for ${A}`), MW1.delete(A)
}

// READABLE:
function clearDeliveredDiagnosticsForUri(uri) {
    if (deliveredDiagnosticsLru.has(uri)) {
        log(`LSP Diagnostics: Clearing delivered diagnostics for ${uri}`);
        deliveredDiagnosticsLru.delete(uri);
    }
}

// Mapping: NP6→clearDeliveredDiagnosticsForUri, MW1→deliveredDiagnosticsLru
```

**Why this is necessary:**
1. Old diagnostics are for the previous version of the file
2. After editing, line numbers may have shifted
3. The error may have been fixed by the edit
4. Clearing ensures fresh diagnostics from the reanalysis

---

## 4. LSP ↔ Plugin System Integration

### Plugin Discovery and Config Loading

```javascript
// ============================================
// dm4 - Load LSP configs from all plugins
// Location: chunks.133.mjs:2144-2163
// ============================================

// ORIGINAL:
async function dm4() {
    let A = {};
    try {
        let {
            enabled: q
        } = await iY();
        for (let K of q) {
            let Y = [],
                z = await Um4(K, Y);
            if (z && Object.keys(z).length > 0) Object.assign(A, z), h(`Loaded ${Object.keys(z).length} LSP server(s) from plugin: ${K.name}`);
            if (Y.length > 0) h(`${Y.length} error(s) loading LSP servers from plugin: ${K.name}`)
        }
        h(`Total LSP servers loaded: ${Object.keys(A).length}`)
    } catch (q) {
        K1(q instanceof Error ? q : Error(`Failed to load LSP servers: ${String(q)}`)), h(`Error loading LSP servers: ${q instanceof Error?q.message:String(q)}`)
    }
    return {
        servers: A
    }
}

// READABLE:
async function loadLspConfigs() {
    const allConfigs = {};

    try {
        const { enabled: plugins } = await getPluginState();  // iY

        for (const plugin of plugins) {
            const errors = [];
            const pluginConfigs = await loadSinglePluginLspConfig(plugin, errors);

            if (pluginConfigs && Object.keys(pluginConfigs).length > 0) {
                Object.assign(allConfigs, pluginConfigs);
                log(`Loaded ${Object.keys(pluginConfigs).length} LSP server(s) from plugin: ${plugin.name}`);
            }

            if (errors.length > 0) {
                log(`${errors.length} error(s) loading LSP servers from plugin: ${plugin.name}`);
            }
        }

        log(`Total LSP servers loaded: ${Object.keys(allConfigs).length}`);

    } catch (error) {
        logError(error);
        log(`Error loading LSP servers: ${error.message}`);
    }

    return { servers: allConfigs };
}

// Mapping: dm4→loadLspConfigs, iY→getPluginState, Um4→loadSinglePluginLspConfig
```

### Plugin LSP Config Sources

A plugin can provide LSP configs from:

1. **`.lsp.json` file** in plugin root
2. **`manifest.lspServers` field** - can be:
   - String path to config file
   - Array of paths
   - Inline config object

### Server Namespacing by Plugin

```javascript
// ============================================
// JvY - Namespace plugin servers
// Location: chunks.133.mjs:2114-2125
// ============================================

// READABLE:
function namespacePluginServers(configs, pluginName) {
    const namespaced = {};

    for (const [serverName, config] of Object.entries(configs)) {
        // Prefix: plugin:{pluginName}:{serverName}
        const namespacedName = `plugin:${pluginName}:${serverName}`;

        namespaced[namespacedName] = {
            ...config,
            scope: "dynamic",    // Mark as plugin-provided
            source: pluginName   // Track origin
        };
    }

    return namespaced;
}
```

**Example:**
- Plugin: `my-typescript-plugin`
- Config defines: `typescript-language-server`
- Final name: `plugin:my-typescript-plugin:typescript-language-server`

### Notification Handler Registration

After all servers start, notification handlers are registered:

```javascript
// ============================================
// em4 - Register notification handlers
// Location: chunks.133.mjs:2532-2606
// ============================================

// READABLE (conceptual):
function registerNotificationHandlers(manager) {
    const servers = manager.getAllServers();

    for (const [serverName, client] of servers.entries()) {
        try {
            // Register handler for publishDiagnostics
            client.onNotification("textDocument/publishDiagnostics", (params) => {
                log(`LSP: Received publishDiagnostics from ${serverName}`);

                // Convert URI to file path
                const diagnosticFiles = convertDiagnosticUriToPath(params);

                // Register in pending diagnostics map
                registerDiagnostics({
                    serverName,
                    files: diagnosticFiles
                });
            });

            // Register handler for logMessage (server logs)
            client.onNotification("window/logMessage", (params) => {
                log(`LSP [${serverName}]: ${params.message}`);
            });

        } catch (error) {
            logError(`Failed to register notification handlers for ${serverName}`);
        }
    }
}
```

---

## 5. Integration Summary

### Data Flow Between Modules

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MODULE INTEGRATION                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────┐                                                 │
│  │ Plugin System  │                                                 │
│  │                │                                                 │
│  │ .lsp.json ────┼───► loadLspConfigs() ───► Manager.initialize()  │
│  │ manifest.lsp   │                                                 │
│  └────────────────┘                                                 │
│                                                                      │
│  ┌────────────────┐     ┌──────────────────┐                       │
│  │  Tools System  │     │ LSP Integration  │                       │
│  │                │     │                  │                       │
│  │ LspTool.call()─┼────►│ manager.send    │                       │
│  │                │     │ Request()        │                       │
│  │ isEnabled() ◄──┼─────┤ manager.status   │                       │
│  └────────────────┘     └────────┬─────────┘                       │
│                                  │                                   │
│                                  │ publishDiagnostics                │
│                                  ▼                                   │
│  ┌────────────────┐     ┌──────────────────┐                       │
│  │ System Reminder│     │ Diagnostic Reg   │                       │
│  │                │     │                  │                       │
│  │ buildAttach() ─┼────►│ WIY() ◄─────────┼─── pending map        │
│  │                │     │ sm4()            │                       │
│  └────────────────┘     └──────────────────┘                       │
│                                                                      │
│  ┌────────────────┐     ┌──────────────────┐                       │
│  │  File Tools    │     │  File Sync       │                       │
│  │                │     │                  │                       │
│  │ Edit/Write ────┼────►│ changeFile()     │                       │
│  │                │     │ saveFile()       │                       │
│  │                │     │ NP6() ──────────┼─── clear cache        │
│  └────────────────┘     └──────────────────┘                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Integration Points

| Source Module | Target Module | Integration Point | Purpose |
|---------------|---------------|-------------------|---------|
| Plugin System | LSP | `loadLspConfigs` | Load server configurations |
| Tools System | LSP | `LspTool.isEnabled` | Check if LSP available |
| Tools System | LSP | `LspTool.call` | Execute LSP operations |
| LSP | System Reminder | `WIY` | Deliver diagnostics to agent |
| File Tools | LSP | `changeFile`, `saveFile` | Sync file state |
| File Tools | LSP | `NP6` | Clear stale diagnostics |
| LSP | Plugin System | `namespacePluginServers` | Prevent name collisions |

### Error Propagation

| Error Source | Propagates To | User Impact |
|--------------|---------------|-------------|
| Server startup failure | `LspTool.isEnabled` → false | LSP tool disabled |
| Config validation error | Error array, logged | Server skipped, others continue |
| Request timeout | Tool result error | Agent sees error message |
| Diagnostic processing | Empty array returned | No diagnostics in system prompt |

---

## 6. Non-Integration Boundaries

### LSP and Compact

LSP diagnostics do **NOT** integrate with the Compact system. These are separate subsystems with distinct purposes:

| System | Purpose | Scope |
|--------|---------|-------|
| **LSP Diagnostics** | Real-time code analysis from language servers | Per-file errors, warnings from `publishDiagnostics` |
| **Compact** | Message history compaction for token limits | Conversation history compression |

**Why they don't integrate:**
- LSP diagnostics flow: `publishDiagnostics` → `om4` (register) → `WIY` (System Reminder attachment) → LLM context
- Compact flow: Token counting → History compaction → Summarization of old messages
- They operate on different data types (diagnostics vs. conversation messages)
- No shared state or coordination between these systems

### LSP and Slash Commands

LSP is a **Tool**, not a Slash Command. These are different invocation mechanisms:

| Mechanism | Invocation | Examples |
|-----------|------------|----------|
| **Tools** | Agent-initiated via tool use blocks | `LSP`, `Read`, `Edit`, `Bash` |
| **Slash Commands** | User-invoked shortcuts | `/commit`, `/clear`, `/help` |

**Architectural distinction:**
```
┌─────────────────────────────────────────────────────────────────────┐
│                      INVOCATION MECHANISMS                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  User Input                    Agent Decision                        │
│      │                              │                                │
│      ▼                              ▼                                │
│  "/commit" ──► Slash Command    "need definition" ──► Tool (LSP)   │
│  "/clear"   ──► Slash Command    "read file"       ──► Tool (Read) │
│  "/help"    ──► Slash Command    "edit code"       ──► Tool (Edit) │
│                                                                      │
│  • User-initiated               • Agent-initiated                   │
│  • Direct execution             • Via tool_use block                │
│  • No agent decision            • Agent chooses operation           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**LSP Tool access pattern:**
- The agent must explicitly invoke the `LSP` tool with an operation parameter
- LSP operations (`goToDefinition`, `findReferences`, etc.) are only available through tool use
- No `/lsp` or similar slash command exists

### LSP and Hooks

LSP operations do **NOT** trigger the Hooks system. Hooks are triggered by:

| Hook Type | Trigger Event | Example |
|-----------|---------------|---------|
| `PreToolUse` | Before tool execution | Validate parameters |
| `PostToolUse` | After tool completion | Log results |
| `Notification` | System events | Progress updates |
| `Stop` | Session end | Cleanup |

**Why LSP doesn't have dedicated hooks:**
- LSP diagnostic delivery is async via `publishDiagnostics`
- Diagnostics are batched and delivered as System Reminders
- File notifications (`didChange`, `didSave`) are internal LSP protocol, not hook events
- Tool hooks (`PreToolUse`, `PostToolUse`) apply to `LspTool` but don't expose internal LSP state

### Summary: Integration Boundaries

| System | Integrates with LSP? | Reason |
|--------|---------------------|--------|
| **Tools System** | ✅ Yes | LSP is exposed as a Tool object |
| **System Reminder** | ✅ Yes | Diagnostics injected as attachments |
| **File Tools** | ✅ Yes | Sync file state via `didChange`/`didSave` |
| **Plugin System** | ✅ Yes | Configs loaded from plugin `.lsp.json` |
| **Compact** | ❌ No | Operates on conversation history, not diagnostics |
| **Slash Commands** | ❌ No | LSP is a Tool, not a user shortcut |
| **Hooks** | ⚠️ Partial | Tool hooks apply, but no LSP-specific hooks |
| **MCP** | ❌ No | Separate protocol; LSP is not exposed via MCP |