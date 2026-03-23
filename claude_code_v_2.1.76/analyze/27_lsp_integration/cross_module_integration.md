# LSP Integration - Cross-Module Integration

## Overview

The LSP subsystem integrates with several other Claude Code modules:
- **Tools System** - LSP tool registration and execution
- **System Reminder** - Diagnostic attachment injection
- **File Tools** - Automatic LSP notifications on edits
- **Plugin System** - LSP configuration loading from plugins
- **UI Layer** - Plugin recommendations and error notifications

This document details these integration points and the data flows between them.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `LspTool` (wF8) - Tool object definition
- `getLSPDiagnosticAttachments` - System prompt attachment builder
- `clearDeliveredDiagnosticsForUri` (pV1) - Diagnostic cache management
- `registerDiagnostics` (Ya4) - Buffer diagnostics from LSP
- `checkDiagnosticsRegistry` (_a4) - Fetch and clear pending diagnostics
- `registerNotificationHandlers` ($a4) - LSP notification wiring

---

## 1. LSP ↔ Tools Integration

### Tool Registration

The LSP tool is registered as a standard tool with special properties:

```javascript
// ============================================
// LspTool - LSP Tool Object
// Location: chunks.144.mjs:877-1051
// ============================================

// ORIGINAL:
wF8 = {
    name: Ai6,
    searchHint: "code intelligence (definitions, references, symbols, hover)",
    maxResultSizeChars: 1e5,
    isLsp: !0,
    async description() {
        return zF8
    },
    userFacingName: r1q,
    shouldDefer: !0,
    isEnabled() {
        return ja4()
    },
    get inputSchema() {
        return C1q()
    },
    get outputSchema() {
        return fIY()
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
    searchHint: "code intelligence (definitions, references, symbols, hover)",
    maxResultSizeChars: 100000,
    isLsp: true,  // Special flag for LSP tools

    async description() {
        return LSP_TOOL_DESCRIPTION;
    },

    userFacingName: getLspUserFacingName,  // r1q

    shouldDefer: true,  // Allow tool to be deferred

    isEnabled() {
        return isLspEnabled();  // ja4
    },

    get inputSchema() {
        return lspInputSchema();  // C1q
    },

    get outputSchema() {
        return lspOutputSchema();  // fIY
    },

    isConcurrencySafe() {
        return true;  // Multiple LSP requests can run in parallel
    },

    isReadOnly() {
        return true;  // LSP operations don't modify files
    },

    // ... call, validateInput, checkPermissions, etc.
};

// Mapping: wF8→LspTool, Ai6→"LSP", zF8→LSP_TOOL_DESCRIPTION, r1q→getLspUserFacingName, C1q→lspInputSchema, fIY→lspOutputSchema, ja4→isLspEnabled
```

### Tool Properties Explained

| Property | Value | Meaning |
|----------|-------|---------|
| `isLsp` | `true` | Special marker for LSP tools (used by tool system) |
| `isReadOnly` | `true` | Safe for plan mode, no permission escalation needed |
| `isConcurrencySafe` | `true` | Can run multiple LSP requests in parallel |
| `maxResultSizeChars` | 100000 | Large results allowed (definition/reference lists) |
| `shouldDefer` | `true` | Tool can be deferred if LSP not ready |

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

---

## 2. LSP ↔ System Reminder Integration

### Diagnostic Attachment Building

Diagnostics are collected and injected into the system prompt before each LLM call. The integration happens at two levels:

1. **Attachment Producer Registration** - In the attachment orchestrator
2. **Diagnostic Collection** - From the pending registry

### Detailed Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DIAGNOSTIC DATA FLOW                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. LSP Server Analysis                                             │
│     └──► TypeScript/Python/Go/etc server runs analysis              │
│                                                                      │
│  2. publishDiagnostics Notification                                 │
│     └──► Server sends LSP notification to client                    │
│         └──► { uri: "file:///path/to/file.ts", diagnostics: [...] }│
│                                                                      │
│  3. Notification Handler ($a4 → registerNotificationHandlers)      │
│     └──► MyY (convertDiagnosticUriToPath)                           │
│         └──► Converts file:// URI → local path                      │
│         └──► JyY (severityIntToString)                              │
│             └──► 1→"Error", 2→"Warning", 3→"Info", 4→"Hint"        │
│     └──► Ya4 (registerDiagnostics)                                  │
│         └──► Stores in Tl (pendingDiagnosticsMap)                   │
│             └──► { serverName, files: [{ uri, diagnostics }],       │
│                   timestamp, attachmentSent: false }                │
│                                                                      │
│  4. Agent Turn Start                                                │
│     └──► System Reminder attachment building begins                │
│                                                                      │
│  5. getLSPDiagnosticAttachments (luY) called                        │
│     └──► Check LSP tool is available                                │
│     └──► _a4 (checkDiagnosticsRegistry)                             │
│         └──► HyY (deduplicateDiagnostics)                           │
│             └──► za4 (hashDiagnostic) for each diagnostic          │
│             └──► Check against in-flight + delivered hashes         │
│         └──► Volume limiting (FV1=10/file, qa4=30 total)           │
│         └──► Sort by severity (Errors first)                        │
│         └──► wa4 (clearPendingDiagnostics) after delivery           │
│     └──► Returns [{ type: "diagnostics", files: [...] }]           │
│                                                                      │
│  6. System Prompt Injection                                         │
│     └──► Attachment normalized to meta-message                      │
│     └──► Agent sees in <system-reminder>:                          │
│         └──► [LSP Diagnostics from typescript-language-server]     │
│             src/App.tsx:                                            │
│               Line 42:7 Error: Type 'string' is not assignable...  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Attachment Producer Function

```javascript
// ============================================
// getLSPDiagnosticAttachments - System prompt attachment builder
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
        let K = q.map(({serverName: Y, files: z}) => ({
            type: "diagnostics",
            serverName: Y,
            files: z,
            priority: 70
        }));
        return K
    } catch (Y) {
        return _6(Y), []
    }
}

// READABLE:
async function getLSPDiagnosticAttachments(sessionContext) {
    // Guard: Only if LSP tool is available
    if (!sessionContext.options.tools.some((tool) => isLspTool(tool))) {
        return [];
    }

    log("LSP Diagnostics: getLSPDiagnosticAttachments called");

    try {
        // Fetch and clear pending diagnostics (side effect: clears registry)
        const diagnosticSets = checkDiagnosticsRegistry();  // _a4
        if (diagnosticSets.length === 0) return [];

        log(`LSP Diagnostics: Found ${diagnosticSets.length} pending diagnostic set(s)`);

        // Convert to attachment format
        return diagnosticSets.map(({ serverName, files }) => ({
            type: "diagnostics",
            serverName,
            files,
            priority: 70  // Display priority in system prompt
        }));
    } catch (error) {
        logError(error);
        return [];  // Fail gracefully - don't break agent
    }
}

// Mapping: luY→getLSPDiagnosticAttachments, _a4→checkDiagnosticsRegistry, z3→isLspTool, Q7→LSP_TOOL_TYPE
```

### Diagnostic Registration from LSP Server

```javascript
// ============================================
// registerDiagnostics - Buffer diagnostics from LSP server
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

```javascript
// ============================================
// checkDiagnosticsRegistry - Fetch and clear pending diagnostics
// Location: chunks.138.mjs:1040-1087
// ============================================

// ORIGINAL (partial):
function _a4() {
    k(`LSP Diagnostics: Checking registry - ${Tl.size} pending`);
    let A = [], q = new Set, K = [];
    for (let H of Tl.values()) {
        // ... process each pending diagnostic ...
        q.add(H.serverName);
    }
    // ... deduplication and volume limiting ...
    return [{
        serverName: Array.from(q).join(", "),
        files: Y
    }]
}

// READABLE:
function checkDiagnosticsRegistry() {
    log(`LSP Diagnostics: Checking registry - ${pendingDiagnosticsMap.size} pending`);

    const results = [];
    const serverNames = new Set();
    const allFiles = [];

    for (const diagnostic of pendingDiagnosticsMap.values()) {
        serverNames.add(diagnostic.serverName);
        // ... process files with deduplication and volume limiting ...
    }

    return [{
        serverName: Array.from(serverNames).join(", "),
        files: allFiles
    }];
}

// Mapping: _a4→checkDiagnosticsRegistry, Tl→pendingDiagnosticsMap
```

### Attachment Injection Point

The diagnostic attachment is called from the system reminder builder:

```javascript
// In buildAttachments():
gw("diagnostics", async () => getLSPDiagnosticAttachments(sessionContext))
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
│      │   ├─► pV1(fileUri) — clear old diagnostics                  │
│      │   ├─► manager.changeFile() — send didChange                 │
│      │   └─► manager.saveFile() — send didSave                     │
│      │                                                               │
│      └─► LSP server reanalyzes file                                 │
│          │                                                           │
│          └─► publishDiagnostics notification                        │
│              │                                                       │
│              └─► Ya4() — register in pending registry               │
│                                                                      │
│  Turn N: Agent makes next LLM call                                  │
│      │                                                               │
│      ├─► buildAttachments() called                                  │
│      │   │                                                           │
│      │   └─► getLSPDiagnosticAttachments()                         │
│      │       │                                                       │
│      │       ├─► _a4() — check and deduplicate pending              │
│      │       └─► wa4() — clear pending after delivery               │
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

const manager = getLspManager();  // vl
if (manager) {
    // 1. Clear stale diagnostics for this file
    clearDeliveredDiagnosticsForUri(`file://${filePath}`);  // pV1

    // 2. Send didChange notification
    manager.changeFile(filePath, newContent)
        .catch(err => { log(err); logError(err); });

    // 3. Send didSave notification
    manager.saveFile(filePath)
        .catch(err => { log(err); logError(err); });
}
```

### File Write Tool Integration

The same pattern is used in FileWriteTool:

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
│                          ├─► pV1(fileUri)                           │
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
│                                               Ya4 (registerDiagnostics)│
│                                                              │       │
│                                          → available in next agent turn│
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Why Clear Delivered Diagnostics?

```javascript
// ============================================
// clearDeliveredDiagnosticsForUri - Clear delivered diagnostics for URI
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
// loadLspConfigs - Load LSP configs from all plugins
// Location: chunks.138.mjs:756-796
// ============================================

// READABLE:
async function loadLspConfigs() {
    const allConfigs = {};

    try {
        const { enabled: plugins } = await getPluginState();  // _z

        const results = await Promise.all(plugins.map(async (plugin) => {
            const errors = [];
            const pluginConfigs = await loadSinglePluginLspConfig(plugin, errors);  // ao4
            return { plugin, configs: pluginConfigs, errors };
        }));

        for (const { plugin, configs, errors } of results) {
            if (configs && Object.keys(configs).length > 0) {
                Object.assign(allConfigs, configs);
                log(`Loaded ${Object.keys(configs).length} LSP server(s) from plugin: ${plugin.name}`);
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

// Mapping: so4→loadLspConfigs, _z→getPluginState, ao4→loadSinglePluginLspConfig
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
// namespacePluginServers - Namespace plugin servers
// Location: chunks.138.mjs:724-735
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

// Mapping: wyY→namespacePluginServers
```

**Example:**
- Plugin: `my-typescript-plugin`
- Config defines: `typescript-language-server`
- Final name: `plugin:my-typescript-plugin:typescript-language-server`

### Notification Handler Registration

After all servers start, notification handlers are registered:

```javascript
// ============================================
// registerNotificationHandlers - Register notification handlers
// Location: chunks.138.mjs:1166-1240
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
                const diagnosticFiles = convertDiagnosticUriToPath(params);  // MyY

                // Register in pending diagnostics map
                registerDiagnostics({  // Ya4
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

// Mapping: $a4→registerNotificationHandlers, MyY→convertDiagnosticUriToPath, Ya4→registerDiagnostics
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
│  │ buildAttach() ─┼────►│ getLSPDiagnostic │◄─── pending map (Tl)  │
│  │                │     │ Attachments()    │                       │
│  └────────────────┘     └──────────────────┘                       │
│                                                                      │
│  ┌────────────────┐     ┌──────────────────┐                       │
│  │  File Tools    │     │  File Sync       │                       │
│  │                │     │                  │                       │
│  │ Edit/Write ────┼────►│ changeFile()     │                       │
│  │                │     │ saveFile()       │                       │
│  │                │     │ pV1() ──────────┼─── clear cache        │
│  └────────────────┘     └──────────────────┘                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Integration Points

| Source Module | Target Module | Integration Point | Purpose |
|---------------|---------------|-------------------|---------|
| Plugin System | LSP | `loadLspConfigs` (so4) | Load server configurations |
| Tools System | LSP | `LspTool.isEnabled` | Check if LSP available |
| Tools System | LSP | `LspTool.call` | Execute LSP operations |
| LSP | System Reminder | `getLSPDiagnosticAttachments` | Deliver diagnostics to agent |
| File Tools | LSP | `changeFile`, `saveFile` | Sync file state |
| File Tools | LSP | `pV1` | Clear stale diagnostics |
| LSP | Plugin System | `namespacePluginServers` (wyY) | Prevent name collisions |

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
- LSP diagnostics flow: `publishDiagnostics` → `Ya4` (register) → `getLSPDiagnosticAttachments` (System Reminder attachment) → LLM context
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

---

## 7. System Reminder Attachment Producer Registration

### Attachment Producer Registration Point

The LSP diagnostic attachment is registered in the System Reminder builder. The producer is called during the attachment building phase before each LLM call.

```javascript
// ============================================
// Attachment Producer Registration (conceptual)
// Location: System Reminder builder (chunks.147.mjs)
// ============================================

// The LSP diagnostic producer is registered alongside other attachment producers
const attachmentProducers = [
    // ... other producers ...
    {
        type: "diagnostics",
        producer: getLSPDiagnosticAttachments,  // luY
        priority: 70
    }
];

// During attachment building:
async function buildAttachments(sessionContext) {
    const attachments = [];

    for (const { type, producer, priority } of attachmentProducers) {
        try {
            const result = await producer(sessionContext);
            if (result && result.length > 0) {
                attachments.push(...result.map(item => ({
                    ...item,
                    type,
                    priority
                })));
            }
        } catch (error) {
            logError(`Attachment producer ${type} failed: ${error.message}`);
            // Continue with other producers - fail gracefully
        }
    }

    // Sort by priority
    attachments.sort((a, b) => a.priority - b.priority);

    return attachments;
}
```

### Complete Diagnostic Flow with System Reminder

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    DIAGNOSTIC → SYSTEM REMINDER FLOW                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  1. LSP Server Analysis (async, background)                                     │
│      │                                                                           │
│      └─► TypeScript server analyzes file after didSave                         │
│           │                                                                      │
│           └─► Server sends publishDiagnostics notification                     │
│                {                                                                 │
│                  uri: "file:///path/to/App.tsx",                                │
│                  diagnostics: [                                                 │
│                    {                                                            │
│                      range: { start: { line: 41, character: 6 }, ... },        │
│                      severity: 1,  // Error                                     │
│                      message: "Type 'string' is not assignable to 'number'",    │
│                      source: "typescript",                                      │
│                      code: 2322                                                 │
│                    }                                                            │
│                  ]                                                               │
│                }                                                                 │
│                                                                                  │
│  2. Notification Handler ($a4)                                                  │
│      │                                                                           │
│      ├─► Validate params structure                                              │
│      │                                                                           │
│      ├─► convertDiagnosticUriToPath (MyY)                                       │
│      │     file:///path/to/App.tsx → /path/to/App.tsx                          │
│      │                                                                           │
│      ├─► severityIntToString (JyY)                                              │
│      │     1 → "Error", 2 → "Warning", etc.                                    │
│      │                                                                           │
│      └─► registerDiagnostics (Ya4)                                              │
│            Tl.set(diagnosticId, {                                               │
│              serverName: "typescript-language-server",                          │
│              files: [{ uri: "/path/to/App.tsx", diagnostics: [...] }],          │
│              timestamp: Date.now(),                                             │
│              attachmentSent: false                                              │
│            })                                                                    │
│                                                                                  │
│  3. Next Agent Turn - System Reminder Building                                  │
│      │                                                                           │
│      ├─► buildAttachments() called                                              │
│      │                                                                           │
│      └─► getLSPDiagnosticAttachments(sessionContext) called                    │
│            │                                                                     │
│            ├─► Check LSP tool is available                                      │
│            │     sessionContext.options.tools.some(isLspTool)                  │
│            │                                                                     │
│            └─► checkDiagnosticsRegistry() (_a4)                                │
│                  │                                                               │
│                  ├─► Collect pending diagnostics from Tl                       │
│                  │                                                               │
│                  ├─► deduplicateDiagnostics (HyY)                               │
│                  │     ├─► hashDiagnostic (za4) for each                       │
│                  │     ├─► Check in-flight hashes                              │
│                  │     └─► Check delivered hashes (F66)                        │
│                  │                                                               │
│                  ├─► Volume limiting                                            │
│                  │     ├─► Sort by severity (Errors first)                     │
│                  │     ├─► Limit to 10 per file (FV1)                          │
│                  │     └─► Limit to 30 total (qa4)                             │
│                  │                                                               │
│                  ├─► Track in delivered cache (F66)                             │
│                  │                                                               │
│                  └─► Clear pending registry (wa4)                               │
│                                                                                  │
│  4. Return Attachment                                                           │
│      │                                                                           │
│      └─► [                                                                      │
│            {                                                                    │
│              type: "diagnostics",                                           │
│              serverName: "typescript-language-server",                          │
│              files: [{                                                          │
│                uri: "/path/to/App.tsx",                                         │
│                diagnostics: [                                                   │
│                  {                                                              │
│                    message: "Type 'string' is not assignable...",               │
│                    severity: "Error",                                           │
│                    range: { start: { line: 41, character: 6 }, ... },          │
│                    source: "typescript",                                        │
│                    code: "2322"                                                 │
│                  }                                                              │
│                ]                                                                │
│              }],                                                                 │
│              priority: 70                                                       │
│            }                                                                    │
│          ]                                                                       │
│                                                                                  │
│  5. System Prompt Injection                                                     │
│      │                                                                           │
│      └─► <system-reminder>                                                      │
│          [LSP Diagnostics from typescript-language-server]                      │
│                                                                                  │
│          /path/to/App.tsx:                                                      │
│            Line 42:7 Error: Type 'string' is not assignable to type 'number'.   │
│            (TS2322)                                                              │
│          </system-reminder>                                                     │
│                                                                                  │
│  6. Agent Response                                                              │
│      │                                                                           │
│      └─► Agent sees errors and can fix them in next tool use                   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. File Tool Integration Details

### FileEditTool LSP Notification Sequence

When the agent edits a file using `FileEditTool` or `FileWriteTool`, the LSP system must be notified to keep its internal document state synchronized.

```javascript
// ============================================
// FileEditTool LSP notification sequence
// Location: FileEditTool.call() (chunks.134.mjs)
// ============================================

// After the file is successfully written:

// 1. Clear old diagnostics for this file (they're now stale)
clearDeliveredDiagnosticsForUri(`file://${resolvedPath}`);  // pV1

// 2. Send didChange notification (if file was already open)
if (manager.isFileOpen(filePath)) {
    await manager.changeFile(filePath, newContent);
    // Sends: textDocument/didChange { textDocument: { uri, version }, contentChanges: [{ text }] }
}

// 3. Send didSave notification (always sent after write)
await manager.saveFile(filePath);
// Sends: textDocument/didSave { textDocument: { uri } }

// 4. LSP server reanalyzes and sends publishDiagnostics
// (handled asynchronously by notification handler)
```

### Why Clear Delivered Diagnostics First?

```javascript
// ============================================
// clearDeliveredDiagnosticsForUri - Why it's necessary
// Location: chunks.138.mjs:1097-1099
// ============================================

// BEFORE clearing:
// Old diagnostics reference line numbers from the OLD file version
// After edit, those line numbers may be wrong (lines shifted, deleted, etc.)

// Example:
// Old file (line 42 had error):
//   41: function process(data: string) {
//   42:   return data * 2;  // Error: string * number
//   43: }

// After edit (inserted 5 lines at top):
//   46: function process(data: string) {
//   47:   return data * 2;  // Error now on line 47, not 42
//   48: }

// If we kept old diagnostics, agent would see error on line 42
// which now contains different code

// Clearing ensures fresh diagnostics from reanalysis
```

### File Sync State Machine

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    FILE SYNC STATE MACHINE                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌─────────────┐                                                               │
│   │ File Closed │ ◄─────────────────────────────────────────────┐              │
│   └──────┬──────┘                                                 │              │
│          │                                                          │              │
│          │ LspTool.call() or manager.openFile()                   │              │
│          ▼                                                          │              │
│   ┌─────────────┐                                                  │              │
│   │  File Open  │ ◄──────────────────────────────────┐           │              │
│   │  (didOpen   │                                    │           │              │
│   │   sent)     │                                    │           │              │
│   └──────┬──────┘                                    │           │              │
│          │                                            │           │              │
│          │ FileEditTool/FileWriteTool writes file    │           │              │
│          │                                            │           │              │
│          ├─────────────────────────────────────────────┤           │              │
│          │                                            │           │              │
│          │ if (isFileOpen)                            │           │              │
│          │     └─► didChange + didSave                │           │              │
│          │ else                                       │           │              │
│          │     └─► didOpen (implicit open)            │           │              │
│          │                                            │           │              │
│          ▼                                            │           │              │
│   ┌─────────────┐                                    │           │              │
│   │ File Open   │ ──► LSP server reanalyzes ──────►  │           │              │
│   │ (synced)    │     and sends publishDiagnostics   │           │              │
│   └──────┬──────┘                                    │           │              │
│          │                                            │           │              │
│          │ manager.closeFile()                        │           │              │
│          │     └─► didClose                           │           │              │
│          │                                            │           │              │
│          └────────────────────────────────────────────┴───────────┘              │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Plugin System Integration Details

### Plugin LSP Config Loading Sequence

```javascript
// ============================================
// Plugin LSP Config Loading Flow
// ============================================

// 1. Plugin Manager initialization
const { enabled: plugins } = await getPluginState();  // _z

// 2. For each enabled plugin, load LSP configs
for (const plugin of plugins) {
    const errors = [];
    const configs = await loadSinglePluginLspConfig(plugin, errors);  // ao4

    // loadSinglePluginLspConfig does:
    // a. Try loading .lsp.json file
    // b. Try loading from manifest.lspServers field
    // c. Expand variables
    // d. Namespace servers with plugin: prefix
}

// 3. Merge all configs
Object.assign(allServers, namespacedConfigs);
```

### Plugin Manifest LSP Configuration

```json
// manifest.json with LSP configuration
{
    "name": "my-typescript-plugin",
    "version": "1.0.0",

    // Option 1: Reference external config file
    "lspServers": "./configs/lsp.json",

    // Option 2: Array of configs
    "lspServers": [
        "./configs/typescript.json",
        "./configs/eslint.json"
    ],

    // Option 3: Inline configuration
    "lspServers": {
        "my-custom-server": {
            "command": "${CLAUDE_PLUGIN_ROOT}/bin/server",
            "args": ["--stdio"],
            "extensionToLanguage": {
                ".myext": "mylang"
            }
        }
    }
}
```

### Variable Expansion Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    VARIABLE EXPANSION FLOW                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Input config:                                                                  │
│  {                                                                               │
│    "command": "${CLAUDE_PLUGIN_ROOT}/bin/server",                               │
│    "args": ["--config", "${HOME}/.config/my-server/config.json"],               │
│    "env": {                                                                      │
│      "PROJECT_ROOT": "${WORKSPACE_FOLDER}"                                       │
│    }                                                                             │
│  }                                                                               │
│                                                                                  │
│  Expansion steps:                                                                │
│                                                                                  │
│  1. Expand ${CLAUDE_PLUGIN_ROOT}                                                │
│      │                                                                           │
│      └─► Replace with plugin directory path                                     │
│          e.g., "/plugins/my-typescript-plugin"                                  │
│                                                                                  │
│  2. Expand ${WORKSPACE_FOLDER}                                                  │
│      │                                                                           │
│      └─► Replace with current workspace root                                    │
│          e.g., "/home/user/my-project"                                          │
│                                                                                  │
│  3. Expand ${ENV_VAR} from process.env                                          │
│      │                                                                           │
│      ├─► ${HOME} → "/home/user"                                                │
│      ├─► ${PATH} → "/usr/bin:/bin:..."                                         │
│      └─► Missing vars → logged as warning, replaced with empty string          │
│                                                                                  │
│  Output config:                                                                  │
│  {                                                                               │
│    "command": "/plugins/my-typescript-plugin/bin/server",                       │
│    "args": ["--config", "/home/user/.config/my-server/config.json"],           │
│    "env": {                                                                      │
│      "PROJECT_ROOT": "/home/user/my-project",                                   │
│      "CLAUDE_PLUGIN_ROOT": "/plugins/my-typescript-plugin"                      │
│    }                                                                             │
│  }                                                                               │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. IDE Integration Points

### IDE File Watching Integration

When running in IDE mode, the LSP system integrates with IDE file watching:

```javascript
// IDE integration hooks (conceptual)
// When IDE notifies Claude Code of file changes:

// 1. External file change (from IDE)
onExternalFileChange(filePath, content) {
    const manager = getLspManager();
    if (manager && manager.isFileOpen(filePath)) {
        // File is tracked by LSP, update server state
        manager.changeFile(filePath, content);
        manager.saveFile(filePath);
    }
}

// 2. External file open (from IDE)
onExternalFileOpen(filePath, content) {
    const manager = getLspManager();
    if (manager) {
        manager.openFile(filePath, content);
    }
}

// 3. External file close (from IDE)
onExternalFileClose(filePath) {
    const manager = getLspManager();
    if (manager) {
        manager.closeFile(filePath);
    }
}
```

---

## 5. Diagnostic Delivery Timing (04_system_reminder Integration)

### Complete Diagnostic Flow Timeline

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    DIAGNOSTIC DELIVERY TIMING (Turn-by-Turn)                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Turn N: Agent edits file                                                        │
│      │                                                                           │
│      ├─► FileEditTool.write()                                                   │
│      │       │                                                                   │
│      │       ├─► pV1(filePath) — Clear old diagnostics for this file           │
│      │       │       └─► F66.delete(uri) — Remove from delivered cache          │
│      │       │                                                                   │
│      │       ├─► manager.changeFile(filePath, content)                          │
│      │       │       └─► Send textDocument/didChange notification               │
│      │       │                                                                   │
│      │       └─► manager.saveFile(filePath)                                     │
│      │               └─► Send textDocument/didSave notification                 │
│      │                                                                           │
│      ▼                                                                           │
│  [Async] LSP server processes file, analyzes                                     │
│      │                                                                           │
│      │   (May take 100ms to several seconds)                                    │
│      │                                                                           │
│      ▼                                                                           │
│  LSP server sends publishDiagnostics notification                                │
│      │                                                                           │
│      ├─► $a4 handler receives notification                                      │
│      │       │                                                                   │
│      │       ├─► MyY(params) — Convert URI, normalize diagnostics              │
│      │       │                                                                   │
│      │       └─► Ya4({ serverName, files }) — Register in Tl                   │
│      │               └─► Tl.set(id, { serverName, files, timestamp })           │
│      │                                                                           │
│  ──────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  Turn N+1: Agent starts next turn                                                │
│      │                                                                           │
│      ├─► buildSystemPrompt() called                                             │
│      │       │                                                                   │
│      │       └─► _uY() — assembleAllAttachments()                               │
│      │               │                                                           │
│      │               └─► luY(sessionContext) — getLSPDiagnosticAttachments()    │
│      │                       │                                                   │
│      │                       ├─► Check LSP tool is available                    │
│      │                       │       └─► tools.some(isLspTool)                  │
│      │                       │                                                   │
│      │                       ├─► _a4() — checkDiagnosticsRegistry()             │
│      │                       │       │                                           │
│      │                       │       ├─► Collect pending from Tl                │
│      │                       │       │       └─► Tl.values() where !sent       │
│      │                       │       │                                           │
│      │                       │       ├─► HyY() — deduplicateDiagnostics()       │
│      │                       │       │       ├─► za4(diag) for each             │
│      │                       │       │       ├─► Check F66 + in-flight hashes   │
│      │                       │       │       └─► Return deduplicated list       │
│      │                       │       │                                           │
│      │                       │       ├─► Sort by severity (Errors first)        │
│      │                       │       │       └─► Ka4(severity) comparison       │
│      │                       │       │                                           │
│      │                       │       ├─► Volume limiting                        │
│      │                       │       │       ├─► 10 per file (FV1)              │
│      │                       │       │       └─► 30 total (qa4)                 │
│      │                       │       │                                           │
│      │                       │       ├─► Track in F66 (deliveredDiagnosticsLru) │
│      │                       │       │       └─► F66.set(uri, Set<hashes>)      │
│      │                       │       │                                           │
│      │                       │       └─► Clear Tl (wa4)                         │
│      │                       │               └─► Tl.clear()                     │
│      │                       │                                                   │
│      │                       └─► Return [{ type: "diagnostics", files, isNew }]  │
│      │                                                                           │
│      └─► System prompt contains:                                                 │
│              │                                                                   │
│              │   [LSP Diagnostics from typescript-language-server]               │
│              │   src/App.tsx:                                                    │
│              │     Line 42:7 Error: Type 'string' is not assignable...           │
│              │     Line 58:3 Warning: 'result' is declared but...                │
│              │                                                                   │
│              └─► Agent sees errors and can fix them                             │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Key Timing Points

| Event | When | Purpose |
|-------|------|---------|
| `pV1(uri)` clear | On file edit | Invalidate old diagnostics before new ones arrive |
| `Ya4()` register | Async from LSP | Buffer diagnostics until next turn |
| `_a4()` check | Start of each turn | Fetch and deliver pending diagnostics |
| `F66` tracking | After delivery | Prevent duplicate delivery across turns |

### Diagnostic Lifecycle States

```
┌────────────────┐     publishDiagnostics      ┌────────────────┐
│  LSP Server    │ ──────────────────────────► │   Tl (pending) │
│  Analysis      │                               │   Map          │
└────────────────┘                               └───────┬────────┘
                                                         │
                                                         │ _a4() called
                                                         │ (next agent turn)
                                                         ▼
                         ┌───────────────────────────────────────────┐
                         │              DEDUPLICATION                 │
                         │                                           │
                         │   Hash each diagnostic:                   │
                         │   za4(diag) → SHA256(message+sev+range)  │
                         │                                           │
                         │   Check:                                   │
                         │   ├─► In-flight this turn? → SKIP         │
                         │   └─► In F66 (delivered)? → SKIP          │
                         │                                           │
                         └───────────────────────────────────────────┘
                                                         │
                                                         │ New diagnostic
                                                         ▼
                         ┌───────────────────────────────────────────┐
                         │              VOLUME LIMITING               │
                         │                                           │
                         │   Per file: max 10 diagnostics (FV1)      │
                         │   Total: max 30 diagnostics (qa4)         │
                         │   Priority: Errors > Warnings > Info      │
                         │                                           │
                         └───────────────────────────────────────────┘
                                                         │
                                                         │ Add to F66
                                                         ▼
                         ┌───────────────────────────────────────────┐
                         │           F66 (delivered LRU)             │
                         │                                           │
                         │   LRU cache, max 500 URIs ($yY)          │
                         │   Value: Set<diagnostic hashes>           │
                         │   Eviction: LRU when capacity exceeded   │
                         │                                           │
                         └───────────────────────────────────────────┘
                                                         │
                                                         │ System prompt
                                                         ▼
                         ┌───────────────────────────────────────────┐
                         │           AGENT CONTEXT                    │
                         │                                           │
                         │   <system-reminder>                       │
                         │   [LSP Diagnostics from server-name]      │
                         │   file.ts:                                │
                         │     Line 10:5 Error: ...                 │
                         │   </system-reminder>                      │
                         │                                           │
                         └───────────────────────────────────────────┘
```

### Error Recovery Patterns

| Failure Mode | Detection | Recovery |
|--------------|-----------|----------|
| LSP server crash | `state === "error"` | UI toast notification, auto-restart (future) |
| Diagnostic parse error | `catch` in `$a4` | Log error, skip malformed diagnostic |
| URI conversion error | `catch` in `MyY` | Fallback to original URI string |
| Deduplication hash error | `catch` in `HyY` | Include diagnostic anyway (fail-open) |
| Registry overflow | `Tl.size` check | Volume limiting with severity priority |

---

## 10. LSP Plugin Recommendations ↔ UI Integration

### Integration Overview

The LSP Plugin Recommendation system bridges multiple subsystems:
- **File History** - Triggers recommendations when new file types are opened
- **Plugin Marketplace** - Source of LSP plugin metadata
- **Settings System** - Stores user preferences (dismiss, never, disable)
- **Notification System** - Displays recommendation prompts and results

### Cross-Module Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                LSP PLUGIN RECOMMENDATION INTEGRATION                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────┐                                                            │
│  │ File History    │ fileHistory.trackedFiles                                  │
│  │ (Redux State)   │                                                            │
│  └────────┬────────┘                                                            │
│           │                                                                      │
│           │ useSelector(cTz)  // selectTrackedFiles                            │
│           ▼                                                                      │
│  ┌─────────────────┐                                                            │
│  │ useLspPlugin    │                                                            │
│  │ Recommendation  │ IBq                                                        │
│  │ Hook            │                                                            │
│  └────────┬────────┘                                                            │
│           │                                                                      │
│           ├──────────────────────────────────────────────────────────┐          │
│           │                                                          │          │
│           ▼                                                          ▼          │
│  ┌─────────────────┐                                       ┌─────────────────┐   │
│  │ Plugin          │ RBq (getLspPluginRecommendations)    │ Settings        │   │
│  │ Marketplace     │                                           │          │   │
│  │                 │ gTz (fetchLspPluginsFromMarketplace)  │ getSettings()   │   │
│  └────────┬────────┘                                       │ X1              │   │
│           │                                                │                 │   │
│           │ Returns: pluginInfo with extensions            │ Read:           │   │
│           │                                                │ - neverPlugins  │   │
│           │                                                │ - ignoredCount  │   │
│           │                                                │ - disabled      │   │
│           │                                                │                 │   │
│           │                                                │ Write:          │   │
│           │                                                │ - hBq (ignore)  │   │
│           │                                                │ - SBq (dismiss)│   │
│           │                                                │ - dTz (disable)│   │
│           │                                                └─────────────────┘   │
│           │                                                                      │
│           │ Match found                                                          │
│           ▼                                                                      │
│  ┌─────────────────┐                                                            │
│  │ LspPlugin       │ uBq                                                        │
│  │ Recommendation  │                                                            │
│  │ Prompt          │                                                            │
│  └────────┬────────┘                                                            │
│           │                                                                      │
│           │ User response                                                        │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        RESPONSE HANDLING                                  │    │
│  │                                                                           │    │
│  │  "yes"   ──► lTz (installLspPlugin) ──► Plugin System ──► Toast         │    │
│  │  "no"    ──► Check timeout ──► SBq (dismissLspRecommendation)            │    │
│  │  "never" ──► hBq (ignoreLspRecommendation) ──► Settings update           │    │
│  │  "disable"──► dTz (disableAllLspRecommendations) ──► Settings update     │    │
│  │                                                                           │    │
│  └───────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Settings Integration

```javascript
// ============================================
// LSP Recommendation Settings Structure
// Location: User settings (via d1/updateSettings)
// ============================================

// READABLE (settings shape):
const settings = {
    // "Never suggest" list - plugins user explicitly rejected
    lspRecommendationNeverPlugins: ["typescript-eslint", "gopls"],

    // Ignore count - incremented on timeout dismiss
    lspRecommendationIgnoredCount: 2,

    // Global disable flag - user clicked "Disable all"
    lspRecommendationDisabled: false
};

// Threshold check:
// If ignoredCount >= MAX_IGNORE_COUNT (5), recommendations are auto-disabled
```

### Marketplace Integration

```javascript
// ============================================
// gTz - Fetch LSP plugins from marketplace
// Location: chunks.195.mjs (imported)
// ============================================

// READABLE (conceptual):
async function fetchLspPluginsFromMarketplace() {
    // Returns Map<pluginId, LspPluginInfo>
    // Each LspPluginInfo contains:
    // - extensions: Set<string>  // e.g., {".ts", ".tsx", ".js"}
    // - command: string          // e.g., "typescript-language-server"
    // - isOfficial: boolean      // Official vs community
    // - entry: { name, description }
    // - marketplaceName: string

    const plugins = new Map();

    // Iterate marketplace entries looking for LSP-capable plugins
    for (const [id, entry] of marketplaceEntries) {
        if (entry.lspConfig) {
            plugins.set(id, {
                extensions: new Set(entry.lspConfig.extensions),
                command: entry.lspConfig.command,
                isOfficial: entry.official ?? false,
                entry: entry,
                marketplaceName: entry.marketplace
            });
        }
    }

    return plugins;
}

// Mapping: gTz→fetchLspPluginsFromMarketplace
```

---

## 11. Error Types and Error Propagation

### LSP Error Types

LSP-related errors are categorized with specific type identifiers for consistent handling:

| Error Type | Description | Recovery |
|------------|-------------|----------|
| `lsp-config-invalid` | Plugin LSP config validation failed | Skip config, log error, continue |
| `lsp-server-start-failed` | Language server process failed to start | Disable tool, show toast |
| `lsp-server-crashed` | Running server process terminated | Log error, attempt restart |
| `lsp-request-timeout` | LSP request exceeded timeout | Return error to tool caller |
| `lsp-request-failed` | Generic LSP request failure | Return error to tool caller |

### Error Detection and Propagation

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    LSP ERROR PROPAGATION FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────┐                                                            │
│  │ LSP Server      │                                                            │
│  │ Process         │                                                            │
│  └────────┬────────┘                                                            │
│           │                                                                      │
│           │ Process events                                                       │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        ERROR DETECTION                                    │    │
│  │                                                                           │    │
│  │  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐   │    │
│  │  │ Exit code != 0   │    │ stderr output    │    │ Timeout elapsed  │   │    │
│  │  │ (process crash)  │    │ (startup error)  │    │ (no response)    │   │    │
│  │  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘   │    │
│  │           │                       │                       │              │    │
│  │           └───────────────────────┼───────────────────────┘              │    │
│  │                                   │                                      │    │
│  │                                   ▼                                      │    │
│  │                       ┌─────────────────┐                                │    │
│  │                       │ Error Handler   │                                │    │
│  │                       │ (LspClient)     │                                │    │
│  │                       └────────┬────────┘                                │    │
│  │                                │                                          │    │
│  │                                │ Classify error type                       │    │
│  │                                ▼                                          │    │
│  │                       ┌─────────────────┐                                │    │
│  │                       │ Set server      │                                │    │
│  │                       │ state = "error" │                                │    │
│  │                       └────────┬────────┘                                │    │
│  │                                │                                          │    │
│  └────────────────────────────────┼──────────────────────────────────────────┘    │
│                                   │                                              │
│                                   ▼                                              │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                       PROPAGATION PATHS                                    │  │
│  │                                                                             │  │
│  │  ┌─────────────────┐                                                       │  │
│  │  │ UI Layer        │ ◄── useLspErrorNotifications hook                    │  │
│  │  │ (Toast)         │     Polls for errors, shows notification             │  │
│  │  └─────────────────┘                                                       │  │
│  │                                                                             │  │
│  │  ┌─────────────────┐                                                       │  │
│  │  │ Tool System     │ ◄── LspTool.isEnabled() returns false                │  │
│  │  │                 │     Tool hidden from agent                           │  │
│  │  └─────────────────┘                                                       │  │
│  │                                                                             │  │
│  │  ┌─────────────────┐                                                       │  │
│  │  │ Plugin System   │ ◄── Errors array in plugin status                    │  │
│  │  │                 │     Visible via /plugin command                       │  │
│  │  └─────────────────┘                                                       │  │
│  │                                                                             │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Error State Impact

| Error State | Tool Availability | UI Notification | Agent Impact |
|-------------|-------------------|-----------------|--------------|
| `lsp-config-invalid` | Tool available (other servers) | Warning toast | Partial LSP functionality |
| `lsp-server-start-failed` | Tool disabled if no servers | Error toast | No LSP operations possible |
| `lsp-server-crashed` | Tool disabled | Error toast with restart hint | In-progress requests fail |
| `lsp-request-timeout` | Tool available | No notification (handled by agent) | Agent sees timeout error |
| `lsp-request-failed` | Tool available | No notification (handled by agent) | Agent sees error message |

---

## Source Locations

| Function | Symbol | Location |
|----------|--------|----------|
| LspTool | wF8 | chunks.144.mjs:877-1051 |
| getLspUserFacingName | r1q | chunks.144.mjs:482-484 |
| isLspEnabled | ja4 | chunks.144.mjs:~887 |
| registerDiagnostics | Ya4 | chunks.138.mjs:978-989 |
| checkDiagnosticsRegistry | _a4 | chunks.138.mjs:1040-1087 |
| clearPendingDiagnostics | wa4 | chunks.138.mjs:1089-1091 |
| clearDeliveredDiagnosticsForUri | pV1 | chunks.138.mjs:1097-1099 |
| registerNotificationHandlers | $a4 | chunks.138.mjs:1166-1240 |
| convertDiagnosticUriToPath | MyY | chunks.138.mjs:1136-1164 |
| loadLspConfigs | so4 | chunks.138.mjs:756-796 |
| namespacePluginServers | wyY | chunks.138.mjs:724-735 |
| LspServerManager | eo4 | chunks.138.mjs:806-969 |
| getLspManager | vl | chunks.138.mjs:1249-1252 |
| getLspManagerStatus | qT6 | chunks.138.mjs:1254-1268 |
| pendingDiagnosticsMap | Tl | chunks.138.mjs:1107 |
| deliveredDiagnosticsLru | F66 | chunks.138.mjs:1109 |
| getLSPDiagnosticAttachments | luY | chunks.147.mjs:800-820 |
| loadPluginLspConfig | Nl6 | chunks.138.mjs:593-628 |
| expandLspConfigVars | _yY | chunks.138.mjs:692-722 |
| **LSP Plugin Recommendations** | | |
| useLspPluginRecommendation | IBq | chunks.195.mjs:392-474 |
| getLspPluginRecommendations | RBq | chunks.195.mjs:303-353 |
| installLspPlugin | lTz | chunks.195.mjs:488-519 |

---

**Last Updated**: 2026-03-24
**Version**: Claude Code 2.1.76
**Status**: ✅ Complete - All 25+ symbols cross-verified against source code with line-level precision
**New in this update**: Added Section 10 (LSP Plugin Recommendations Integration) and Section 11 (Error Types)