# LSP Integration Module

## Overview

The LSP Integration module (`27_lsp_integration`) documents Claude Code's implementation as a **polyglot Language Server Protocol (LSP) Client**. Instead of bundling its own static analysis engines, Claude Code spawns standard LSP servers (TypeScript, Go, Python, Rust, etc.) to provide IDE-level intelligence to the AI model.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLAUDE CODE AGENT                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐    ┌─────────────────┐    ┌──────────────────────┐ │
│  │  LSP Tool   │───►│ LspServerManager │───►│  LSP Client (no4)   │ │
│  │   (wF8)     │    │     (eo4)        │    │                     │ │
│  └─────────────┘    └─────────────────┘    └──────────┬───────────┘ │
│         │                   │                        │              │
│         │                   │                        ▼              │
│         │                   │              ┌──────────────────────┐ │
│         │                   │              │  LSP Server Process  │ │
│         │                   │              │ (typescript-server,  │ │
│         │                   │              │  gopls, pyright...)  │ │
│         │                   │              └──────────────────────┘ │
│         │                   │                        │              │
│         │                   ▼                        │              │
│         │         ┌─────────────────────┐           │              │
│         │         │ Diagnostic Registry │◄──────────┘              │
│         │         │ (Ya4, _a4, pV1)     │  publishDiagnostics      │
│         │         └─────────────────────┘                          │
│         │                   │                                       │
│         │                   ▼                                       │
│         │         ┌─────────────────────┐                          │
│         └────────►│ System Prompt       │                          │
│                   │ (diagnostic attach) │                          │
│                   └─────────────────────┘                          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Components

| Component | Description | Location |
|-----------|-------------|----------|
| `LspTool` (wF8) | Tool interface for LSP operations | chunks.144.mjs:877 |
| `LspServerManager` (eo4) | Polyglot server coordinator | chunks.138.mjs:806 |
| `createLspClient` (no4) | Client factory for individual servers | chunks.138.mjs:389 |
| `createLspProcessWrapper` (co4) | Low-level process & transport | chunks.138.mjs:218 |
| `loadLspConfigs` (so4) | Configuration aggregation from plugins | chunks.138.mjs:756 |
| `registerDiagnostics` (Ya4) | Diagnostic buffering system | chunks.138.mjs:978 |
| `checkDiagnosticsRegistry` (_a4) | Fetch and dedupe diagnostics | chunks.138.mjs:1040 |

## Supported Operations

The LSP Tool supports 9 operations:

| Operation | LSP Method | Purpose |
|-----------|------------|---------|
| `goToDefinition` | `textDocument/definition` | Navigate to definition |
| `findReferences` | `textDocument/references` | Find all references |
| `hover` | `textDocument/hover` | Get type/docstring info |
| `documentSymbol` | `textDocument/documentSymbol` | File outline/structure |
| `workspaceSymbol` | `workspace/symbol` | Search symbols in workspace |
| `goToImplementation` | `textDocument/implementation` | Navigate to implementations |
| `prepareCallHierarchy` | `textDocument/prepareCallHierarchy` | Init call hierarchy |
| `incomingCalls` | `callHierarchy/incomingCalls` | Find callers |
| `outgoingCalls` | `callHierarchy/outgoingCalls` | Find callees |

## Documentation Index

### Core Documentation

| File | Description |
|------|-------------|
| [implementation.md](./implementation.md) | Deep implementation analysis with code snippets |
| [lsp_client_architecture.md](./lsp_client_architecture.md) | LSP client creation and capabilities overview |
| [algorithms.md](./algorithms.md) | Deep analysis of retry, deduplication, generation counter, and extension resolution algorithms |
| [diagnostic_pipeline.md](./diagnostic_pipeline.md) | Complete diagnostic pipeline: notification handling, buffering, deduplication, delivery |
| [configuration_deep_dive.md](./configuration_deep_dive.md) | Configuration schema, plugin loading, variable expansion, path validation |

### Feature Documentation

| File | Description |
|------|-------------|
| [error_handling.md](./error_handling.md) | Error handling, retry mechanisms, and crash recovery |
| [configuration.md](./configuration.md) | `.lsp.json` schema and plugin configuration flow |
| [lifecycle.md](./lifecycle.md) | Manager initialization, startup, and shutdown sequences |
| [cross_module_integration.md](./cross_module_integration.md) | Integration with Tools, System Reminder, File Tools, Plugins |
| [ui_linkage.md](./ui_linkage.md) | UI rendering, React hooks, error notifications, tool message display |
| [result_formatting.md](./result_formatting.md) | LSP result formatting, LocationLink normalization, git ignore filtering |
| [request_flow.md](./request_flow.md) | **NEW**: Complete request flow from tool invocation to result |
| [file_sync_protocol.md](./file_sync_protocol.md) | **NEW**: File sync protocol (didOpen/didChange/didSave/didClose) |

## Related Modules

| Module | Relationship |
|--------|--------------|
| [05_tools](../05_tools/) | LSP tool registration and rendering |
| [04_system_reminder](../04_system_reminder/) | Diagnostic attachment injection |
| [25_plugin_system](../25_plugin_system/) | Plugin LSP configuration loading |
| [18_sandbox](../18_sandbox/) | LSP server process sandboxing |

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure

Key functions in this module:
- `createLspProcessWrapper` (co4) - Low-level process & transport setup
- `createLspClient` (no4) - Main client factory with retry logic
- `LspServerManager` (eo4) - Server coordinator singleton
- `LspTool` (wF8) - Tool object definition
- `loadPluginLspConfig` (Nl6) - Configuration loader
- `registerDiagnostics` (Ya4) - Diagnostic registry
- `checkDiagnosticsRegistry` (_a4) - Diagnostic deduplication
- `hashDiagnostic` (za4) - SHA hash for deduplication
- `getLspManager` (vl) - Singleton accessor
- `getLspManagerStatus` (qT6) - Status query
- `lspInputSchemaLazy` (C1q) - Zod lazy schema factory for all 9 LSP operations
- `readFile` (MIY) - fs.promises.readFile for file content
- `path` (_F8) - Node.js path module (extname)

## Key Algorithms

### 1. Retry with Exponential Backoff

When LSP returns error code `-32801` (ContentModified), the client retries with exponential backoff:

```
Attempt 0: 500ms delay
Attempt 1: 1000ms delay
Attempt 2: 2000ms delay
Maximum wait: 3500ms
```

### 2. Diagnostic Deduplication

Two-level deduplication prevents duplicate diagnostics:
1. **In-flight dedup** - During current agent turn
2. **Delivered dedup** - LRU cache of previously seen diagnostics

Hash is computed from: `{message, severity, range, source, code}`

### 3. Generation Counter Pattern

Prevents race conditions during reinitialization:
- Each init gets a generation number
- Only the latest generation can update state
- Stale init results are discarded

## Source Locations

| Category | File | Lines | Content |
|----------|------|-------|---------|
| Core LSP | chunks.138.mjs | 218-379 | Process wrapper (co4 - createLspProcessWrapper) |
| Core LSP | chunks.138.mjs | 389-563 | Client factory (no4 - createLspClient) |
| Core LSP | chunks.138.mjs | 565-570 | Timeout wrapper (AyY - withTimeout) |
| Core LSP | chunks.138.mjs | 572-576 | Retry constants (tEY, Qm8, eEY) |
| Core LSP | chunks.138.mjs | 585-591 | Safe path validation (YyY - safePluginRelativePath) |
| Core LSP | chunks.138.mjs | 593-628 | Plugin config loader (Nl6 - loadPluginLspConfig) |
| Core LSP | chunks.138.mjs | 630-690 | Manifest resolver (zyY - resolvePluginLspServersField) |
| Core LSP | chunks.138.mjs | 692-722 | Variable expansion (_yY - expandLspConfigVars) |
| Core LSP | chunks.138.mjs | 724-735 | Namespacing (wyY - namespacePluginServers) |
| Core LSP | chunks.138.mjs | 737-745 | Single plugin loader (ao4 - loadSinglePluginLspConfig) |
| Core LSP | chunks.138.mjs | 756-796 | Config aggregator (so4 - loadLspConfigs) |
| Core LSP | chunks.138.mjs | 806-969 | LspServerManager (eo4) |
| Core LSP | chunks.138.mjs | 978-989 | Diagnostic registration (Ya4) |
| Core LSP | chunks.138.mjs | 991-1004 | Severity string→int (Ka4) |
| Core LSP | chunks.138.mjs | 1006-1014 | Diagnostic hasher (za4) |
| Core LSP | chunks.138.mjs | 1016-1038 | Deduplication (HyY) |
| Core LSP | chunks.138.mjs | 1040-1087 | Registry check (_a4) |
| Core LSP | chunks.138.mjs | 1089-1095 | Clear functions (wa4, Oa4) |
| Core LSP | chunks.138.mjs | 1097-1099 | URI cache clear (pV1) |
| Core LSP | chunks.138.mjs | 1101-1109 | Volume constants & state (FV1, qa4, $yY, Tl, F66) |
| Core LSP | chunks.138.mjs | 1121-1164 | Severity/format conversions (JyY, MyY) |
| Core LSP | chunks.138.mjs | 1166-1240 | Notification handlers ($a4) |
| Core LSP | chunks.138.mjs | 1249-1320 | Singleton accessors & lifecycle (vl, qT6, ja4, Ja4, dm8, dV1, Ma4) |
| LSP Tool | chunks.144.mjs | 359 | Tool name constant (Ai6) |
| LSP Tool | chunks.144.mjs | 361-379 | Tool description (zF8) |
| LSP Tool | chunks.144.mjs | 381-414 | Symbol extractor (i1q) |
| LSP Tool | chunks.144.mjs | 416 | Buffer size constant (l1q = 65536) |
| LSP Tool | chunks.144.mjs | 424-480 | Result component (JIY) |
| LSP Tool | chunks.144.mjs | 482-536 | Render functions (r1q, o1q, a1q, s1q, t1q, e1q) |
| LSP Tool | chunks.144.mjs | 552-590 | Operation labels (jIY) |
| LSP Tool | chunks.144.mjs | 593-681 | Request builder (WIY) |
| LSP Tool | chunks.144.mjs | 745-830 | Result formatter (fIY) |
| LSP Tool | chunks.144.mjs | 866-1051 | Tool definition (XIY, PIY, wF8) |
| System Reminder | chunks.147.mjs | 800-820 | Diagnostic attachment (luY) |
| UI Notifications | chunks.195.mjs | 155-194 | Error polling hook (useLspErrorNotifications) |
| UI Notifications | chunks.195.mjs | 203 | Poll interval constant (ITz = 5000) |

## UI Interaction

The LSP subsystem surfaces to the user interface through **five distinct touchpoints**:

1. **Tool Rendering** - Progress and result display for LSP operations
2. **Error Notifications** - Polling-based toast notifications for server failures
3. **Diagnostic Attachments** - System prompt injection via System Reminder
4. **File Sync Side Effects** - Transparent LSP notifications on file edits
5. **Plugin Recommendations** - Proactive suggestions to install LSP plugins

### Tool Rendering Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LSP TOOL UI RENDERING                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Agent invokes LSP Tool                                             │
│      │                                                               │
│      ▼                                                               │
│  Phase 1: Tool Use Message (o1q)                                    │
│      │   Extract symbol at position from source file                │
│      │   Display: operation: "goToDefinition", symbol: "useState"  │
│      │                                                               │
│      ▼                                                               │
│  Phase 2: LSP Request Processing                                    │
│      │   Send request to LSP server via manager                     │
│      │   Handle retry with exponential backoff if needed            │
│      │                                                               │
│      ▼                                                               │
│  Phase 3: Result Rendering (JIY)                                    │
│      │   Compact: "Found 3 references across 2 files ✓"            │
│      │   Verbose: Header + full formatted content                   │
│      │                                                               │
│      ▼                                                               │
│  Phase 4: Error Handling (s1q)                                      │
│      │   Compact: "LSP operation failed" (red)                      │
│      │   Verbose: Full error stack trace                            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Error Notification System

UI polls for LSP server errors every 5 seconds (ITz = 5000ms):

| Error Source | Toast Message | Timeout |
|--------------|---------------|---------|
| Manager init failed | "LSP for lsp-manager failed" | 8s |
| Server crash | "LSP for {serverName} failed" | 8s |
| Config error | Via /plugin details | - |

**Headless guard**: Error polling disabled in SDK/CI mode (t4 check).

#### useLspErrorNotifications Hook Implementation

```javascript
// ============================================
// useLspErrorNotifications - React hook for LSP error polling
// Location: chunks.195.mjs:155-194
// ============================================

// ORIGINAL (from source):
// Lines 155-194 contain the complete hook implementation with:
// - Toast notification dispatcher with 8-second timeout
// - Error polling every 5 seconds (ITz = 5000)
// - Headless mode guard (t4 check)
// - Server name extraction for plugin namespaced servers

// READABLE (conceptual):
function useLspErrorNotifications() {
    const [isEnabled, setIsEnabled] = useState(true);
    const addToast = useToastStore();  // Toast notification dispatcher

    const showError = useCallback((serverName, errorMessage) => {
        // Extract plugin name if namespaced (plugin:name → name)
        const displayName = serverName.startsWith("plugin:")
            ? serverName.split(":")[1] ?? serverName
            : serverName;

        addToast({
            key: `lsp-error-${serverName}`,
            jsx: (
                <Fragment>
                    <Text color="error">LSP for {displayName} failed</Text>
                    <Text dimColor> · /plugin for details</Text>
                </Fragment>
            ),
            priority: "medium",
            timeoutMs: 8000  // 8 second auto-dismiss
        });
    }, []);

    const pollErrors = useCallback(() => {
        // Guard: Skip in headless/SDK mode
        if (isHeadlessMode()) return;

        // Check manager status
        const status = getLspManagerStatus();  // qT6
        if (status.status === "failed") {
            showError("lsp-manager", status.error.message);
            setIsEnabled(false);
            return;
        }

        // Skip if pending or not started
        if (status.status === "pending" || status.status === "not-started") return;

        // Poll each server for errors
        const manager = getLspManager();  // vl
        if (manager) {
            const servers = manager.getAllServers();
            for (const [name, client] of servers) {
                if (client.state === "error" && client.lastError) {
                    showError(name, client.lastError.message);
                }
            }
        }
    }, [showError]);

    // Poll every 5 seconds when enabled, null when disabled
    useInterval(pollErrors, isEnabled ? LSP_ERROR_POLL_INTERVAL : null);

    // Also poll on mount
    useEffect(() => {
        if (isHeadlessMode()) return;
        pollErrors();
    }, [pollErrors]);
}

// Mapping: ITz→LSP_ERROR_POLL_INTERVAL, t4→isHeadlessMode, qT6→getLspManagerStatus, vl→getLspManager
```

#### Polling Timing Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ERROR POLLING TIMELINE                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   T=0s: Component mounts                                            │
│       └─► Immediate poll (useEffect)                                │
│       └─► If manager failed → show toast, disable polling           │
│                                                                      │
│   T=5s: First interval poll (ITz = 5000ms)                          │
│       └─► Check qT6() status                                        │
│       └─► Iterate all servers, check state === "error"              │
│       └─► Show toast for each failed server                         │
│                                                                      │
│   T=10s, 15s, 20s...: Continue polling                              │
│       └─► Polls continue until component unmounts                   │
│       └─► OR polling disabled due to manager failure                │
│                                                                      │
│   Toast Behavior:                                                   │
│       └─► Auto-dismiss after 8000ms                                 │
│       └─► Key: "lsp-error-{serverName}" for deduplication           │
│       └─► Priority: "medium"                                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Cross-Module UI Touchpoints

| Module | Integration | UI Impact |
|--------|-------------|-----------|
| **04_system_reminder** | Diagnostic attachment | Agent sees errors in system prompt |
| **05_tools** | Tool registration | LSP appears in tool list |
| **16_file_system** | File edit triggers | Transparent didChange/didSave |
| **25_plugin_system** | Server discovery | Plugin LSP configs loaded |

## Symbol Cross-Validation Status

All symbols in this module have been cross-validated against source code with line-level precision:

### Core LSP Symbols (chunks.138.mjs) ✅ VERIFIED

| Symbol | Readable | Line | Verification |
|--------|----------|------|--------------|
| co4 | createLspProcessWrapper | :218-379 | ✅ Process spawning, stdio transport |
| no4 | createLspClient | :389-563 | ✅ Client factory with retry logic |
| eo4 | LspServerManager | :806-969 | ✅ Manager factory with file sync |
| AyY | withTimeout | :565-570 | ✅ Timeout wrapper |
| tEY | CONTENT_MODIFIED_ERROR_CODE | :572 | ✅ = -32801 |
| Qm8 | LSP_MAX_RETRIES | :574 | ✅ = 3 |
| eEY | LSP_RETRY_BASE_DELAY_MS | :576 | ✅ = 500 |
| YyY | safePluginRelativePath | :585-591 | ✅ Path traversal protection |
| Nl6 | loadPluginLspConfig | :593-628 | ✅ Config loading from plugin |
| zyY | resolvePluginLspServersField | :630-690 | ✅ Manifest resolution |
| _yY | expandLspConfigVars | :692-722 | ✅ Variable expansion |
| wyY | namespacePluginServers | :724-735 | ✅ Server namespacing |
| ao4 | loadSinglePluginLspConfig | :737-745 | ✅ Single plugin loader |
| so4 | loadLspConfigs | :756-796 | ✅ Aggregate config loader |
| Ya4 | registerDiagnostics | :978-989 | ✅ Diagnostic registration |
| Ka4 | severityStringToInt | :991-1004 | ✅ "Error"→1 conversion |
| za4 | hashDiagnostic | :1006-1014 | ✅ SHA-256 hashing |
| HyY | deduplicateDiagnostics | :1016-1038 | ✅ Two-level deduplication |
| _a4 | checkDiagnosticsRegistry | :1040-1087 | ✅ Volume limiting & delivery |
| wa4 | clearPendingDiagnostics | :1089-1091 | ✅ Clear pending |
| Oa4 | resetAllDiagnosticsState | :1093-1095 | ✅ Full reset |
| pV1 | clearDeliveredDiagnosticsForUri | :1097-1099 | ✅ URI cache clear |
| FV1 | LSP_MAX_DIAGNOSTICS_PER_FILE | :1101 | ✅ = 10 |
| qa4 | LSP_MAX_DIAGNOSTICS_TOTAL | :1103 | ✅ = 30 |
| $yY | LSP_DIAGNOSTICS_LRU_SIZE | :1105 | ✅ = 500 |
| Tl | pendingDiagnosticsMap | :1107 | ✅ Map type |
| F66 | deliveredDiagnosticsLru | :1109 | ✅ LRU Map |
| JyY | severityIntToString | :1121-1134 | ✅ 1→"Error" conversion |
| MyY | convertDiagnosticUriToPath | :1136-1164 | ✅ URI handling |
| $a4 | registerNotificationHandlers | :1166-1240 | ✅ Handler registration |
| vl | getLspManager | :1249-1252 | ✅ Singleton accessor |
| qT6 | getLspManagerStatus | :1254-1268 | ✅ Status query |
| ja4 | isLspEnabled | :1270-1279 | ✅ Enabled check |
| Ja4 | waitForLspManager | :1281-1284 | ✅ Wait for init |
| dm8 | initializeLspServerManager | :1286-1301 | ✅ Init with generation |
| dV1 | reinitializeLspServerManager | :1303-1309 | ✅ Force reinit |
| Ma4 | shutdownLspServerManager | :1311-1320 | ✅ Clean shutdown |
| MN | lspManagerInstance | :1322 | ✅ Singleton instance |
| IZ | lspManagerState | :1324 | ✅ State string |
| kl6 | lspManagerLastError | :1326 | ✅ Error variable |
| QV1 | lspInitGeneration | :1328 | ✅ Generation counter |
| UV1 | lspInitPromise | :1330 | ✅ Promise variable |

### Tool Definition Symbols (chunks.144.mjs) ✅ VERIFIED

| Symbol | Readable | Line | Verification |
|--------|----------|------|--------------|
| Ai6 | LSP_TOOL_NAME | :359 | ✅ = "LSP" |
| zF8 | LSP_TOOL_DESCRIPTION | :361-379 | ✅ Tool description |
| C1q | lspInputSchemaLazy | :5-61 | ✅ Zod lazy schema factory for all 9 LSP operations |
| MIY | readFile | cli.chunks.mjs:5648 | ✅ fs.promises.readFile for file content |
| _F8 | path | :981 | ✅ Node.js path module (extname) |
| i1q | extractSymbolAtPosition | :381-414 | ✅ Symbol extraction |
| l1q | SYMBOL_EXTRACTION_BUFFER_SIZE | :416 | ✅ = 65536 |
| JIY | LspResultSummaryComponent | :424-480 | ✅ Result display |
| r1q | getLspUserFacingName | :482-484 | ✅ Returns "LSP" |
| o1q | renderLspToolUseMessage | :486-503 | ✅ Progress display |
| a1q | renderLspToolUseRejectedMessage | :505-507 | ✅ Rejected message |
| s1q | renderLspToolUseErrorMessage | :509-519 | ✅ Error rendering |
| t1q | renderLspToolUseProgressMessage | :521-523 | ✅ Returns null |
| e1q | renderLspToolResultMessage | :525-536 | ✅ Result summary |
| jIY | OPERATION_LABELS | :552-590 | ✅ Labels map |
| WIY | buildLspRequestParams | :593-681 | ✅ Request builder |
| fIY | formatLspResult | :745-830 | ✅ Result formatter |
| GIY | isDefinitionLink | :733-735 | ✅ LocationLink check |
| ak1 | normalizeLocation | :737-743 | ✅ LocationLink → Location |
| TIY | countCallHierarchyFiles | :832-835 | ✅ Count files |
| vIY | countIncomingCallerFiles | :837-840 | ✅ Count caller files |
| NIY | countOutgoingCalleeFiles | :842-845 | ✅ Count callee files |
| XIY | lspInputSchema | :866-871 | ✅ Zod schema |
| PIY | lspOutputSchema | :871-877 | ✅ Zod schema |
| wF8 | LspTool | :877-1051 | ✅ Tool object |

### System Reminder Integration (chunks.147.mjs) ✅ VERIFIED

| Symbol | Readable | Line | Verification |
|--------|----------|------|--------------|
| luY | getLSPDiagnosticAttachments | :800-820 | ✅ Attachment builder, returns type: "diagnostics" |

### UI Component Symbols (chunks.195.mjs) ✅ VERIFIED

| Symbol | Readable | Line | Verification |
|--------|----------|------|--------------|
| ITz | LSP_ERROR_POLL_INTERVAL | :203 | ✅ = 5000ms |
| useLspErrorNotifications | (hook) | :155-194 | ✅ Error polling hook |
| OX | useInterval | :174-192 | ✅ Polling with null-for-disable |
| o4 | useNotifications | :180 | ✅ Toast notification dispatcher |
| t4 | isHeadlessMode | :175 | ✅ SDK mode guard check |
| M1 | useAppState | :397 | ✅ Zustand state selector |
| Uu1 | hasShownRecommendationThisSession | :393 | ✅ Session flag variable |
| kBq | checkBinaryAvailable | :217-225 | ✅ Binary check |
| mTz | isOfficialMarketplace | :235-237 | ✅ Official check |
| BTz | parseLspServersConfig | :239-251 | ✅ Config parser |
| LBq | extractLspServerInfo | :257-272 | ✅ Server info extractor |
| gTz | getAllLspPlugins | :274-301 | ✅ Plugin fetcher |
| RBq | getLspPluginRecommendations | :303-353 | ✅ Recommendations |
| hBq | ignoreLspRecommendation | :355-364 | ✅ Add to never list |
| SBq | dismissLspRecommendation | :366-374 | ✅ Increment ignored |
| FTz | isLspRecommendationDisabled | :376-379 | ✅ Disabled check |
| uTz | MAX_IGNORE_COUNT | :381 | ✅ = 5 |
| IBq | useLspPluginRecommendation | :392-474 | ✅ Recommendation hook |
| dTz | disableAllLspRecommendations | :476-481 | ✅ Disable all |
| cTz | selectTrackedFiles | :484-486 | ✅ State selector |
| lTz | installLspPlugin | :488-519 | ✅ Plugin installer |
| UTz | RECOMMENDATION_TIMEOUT_MS | :523 | ✅ = 28000 |
| uBq | LspPluginRecommendationPrompt | :544-611 | ✅ UI component |
| iTz | RECOMMENDATION_AUTO_DISMISS_MS | :615 | ✅ = 30000 |

**Total symbols cross-validated: 140+**

## Key Algorithms Documented

| Algorithm | Symbol | Document | Key Insight |
|-----------|--------|----------|-------------|
| **Exponential Backoff Retry** | no4 | [algorithms.md](./algorithms.md) | 500ms→1000ms→2000ms with ContentModified (-32801) handling |
| **Diagnostic Deduplication** | za4, HyY | [diagnostic_pipeline.md](./diagnostic_pipeline.md) | Two-level cache (in-flight + LRU 500 entries) |
| **Generation Counter** | eo4 | [algorithms.md](./algorithms.md) | Prevents race conditions during reinitialization |
| **Symbol Extraction** | i1q | [algorithms.md](./algorithms.md) | 64KB buffer, regex tokenization, 30-char truncation |
| **Git Ignore Filtering** | q8q | [algorithms.md](./algorithms.md) | Batch of 50 paths, git check-ignore, 5s timeout |
| **URI to Path Conversion** | ZIY | [algorithms.md](./algorithms.md) | Windows drive letter detection, URL decode |
| **Request Building** | WIY | [implementation.md](./implementation.md) | Operation→method mapping with position encoding |
| **Result Formatting** | fIY | [result_formatting.md](./result_formatting.md) | Operation-specific formatters, LocationLink normalization |
| **Volume Limiting** | Tl, F66 | [diagnostic_pipeline.md](./diagnostic_pipeline.md) | 10/file, 30 total with severity-aware filtering |
| **Variable Expansion** | _yY | [configuration_deep_dive.md](./configuration_deep_dive.md) | ${VAR} syntax with process.env substitution |
| **Path Validation** | YyY | [configuration_deep_dive.md](./configuration_deep_dive.md) | Prevents directory traversal in plugin configs |
| **React Memoization** | A6 | [algorithms.md](./algorithms.md) | 23-element cache array for performance optimization |
| **Binary Check Caching** | kBq, VBq | [algorithms.md](./algorithms.md) | Map cache for PATH availability checks |
| **Plugin Recommendation Matching** | RBq | [algorithms.md](./algorithms.md) | Two-phase filtering, official-first sorting, binary availability check |

---

**Last Updated**: 2026-03-24
**Version**: Claude Code 2.1.76
**Status**: ✅ **VERIFIED** - All 140+ symbols cross-validated against source code. Diagnostic attachment type corrected from "lsp_diagnostics" to "diagnostics" (per chunks.147.mjs:810). New symbols verified: C1q (lspInputSchemaValidator), MIY (readFile), _F8 (path module).

### Symbol Cross-Validation Summary

| Category | Symbols Verified | Source File |
|----------|-----------------|-------------|
| Process & Client | 4 | chunks.138.mjs |
| Configuration | 7 | chunks.138.mjs |
| Diagnostics | 12 | chunks.138.mjs, chunks.147.mjs |
| State Variables | 8 | chunks.138.mjs |
| Constants | 6 | chunks.138.mjs |
| Singleton Accessors | 7 | chunks.138.mjs |
| Tool Definition | 11 | chunks.144.mjs, cli.chunks.mjs |
| Result Rendering | 10 | chunks.144.mjs |
| Tool Helpers | 6 | chunks.144.mjs |
| Formatters | 12 | chunks.144.mjs |
| Counting | 4 | chunks.144.mjs |
| Integration | 2 | chunks.147.mjs |
| UI Notifications & Hooks | 7 | chunks.195.mjs |
| Binary Check | 2 | chunks.195.mjs |
| Marketplace Parsing | 4 | chunks.195.mjs |
| **Plugin Recommendations** | **18** | chunks.195.mjs |

### Documentation Completeness

| File | Status | Key Content |
|------|--------|-------------|
| `implementation.md` | ✅ Complete | Process wrapper, client factory, manager, all code snippets |
| `lsp_client_architecture.md` | ✅ Complete | Client creation, capabilities, transport layer |
| `algorithms.md` | ✅ Complete | **13 algorithms**: retry, deduplication, git ignore, URI conversion, React memoization, binary check caching, plugin recommendation matching |
| `diagnostic_pipeline.md` | ✅ Complete | Full pipeline from notification to system prompt |
| `configuration_deep_dive.md` | ✅ Complete | Schema, plugin loading, variable expansion, security |
| `error_handling.md` | ✅ Complete | All error types, recovery strategies, fail-open, **error type identifiers** |
| `lifecycle.md` | ✅ Complete | State machine, init/shutdown sequences |
| `ui_linkage.md` | ✅ Complete | React hooks, rendering flow, notifications, **LSP Plugin Recommendations**, **Visual Design Interaction** |
| `cross_module_integration.md` | ✅ Complete | System reminder, file tools, plugins, **Plugin Recommendations integration** |
| `result_formatting.md` | ✅ Complete | Formatters, LocationLink, git ignore |
| `configuration.md` | ✅ Complete | `.lsp.json` schema, configuration flow |
| `request_flow.md` | ✅ **NEW** | Complete request flow from tool invocation to result formatting |
| `file_sync_protocol.md` | ✅ **NEW** | File sync protocol: didOpen/didChange/didSave/didClose |

**Total documentation files**: 13
**Total symbols documented**: 140+
**Source files analyzed**: chunks.138.mjs, chunks.144.mjs, chunks.147.mjs, chunks.195.mjs, cli.chunks.mjs

---

## Source Code Verification

All symbol mappings have been verified against the following source files:

| Source File | Lines Analyzed | Symbols Found |
|-------------|----------------|---------------|
| chunks.138.mjs | 218-1330 | 60+ |
| chunks.144.mjs | 5-80, 359-1051 | 45+ |
| chunks.147.mjs | 800-820 | 2 |
| chunks.195.mjs | 155-615 | 18+ |
| cli.chunks.mjs | 5648 | 1 |

**Verification method**: Direct source code reading with line-by-line comparison. All obfuscated names matched to readable names with semantic context.

---

## New in This Update

### LSP Plugin Recommendation System (Section 11 in ui_linkage.md)

The LSP Plugin Recommendation system proactively suggests installing LSP plugins when users open files without LSP support:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RECOMMENDATION FLOW                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  User opens .ts file                                                │
│      │                                                               │
│      ▼                                                               │
│  useLspPluginRecommendation hook detects new file type             │
│      │                                                               │
│      ▼                                                               │
│  getLspPluginRecommendations queries marketplace                    │
│      │                                                               │
│      ▼                                                               │
│  Found: typescript-eslint (not installed, binary available)         │
│      │                                                               │
│      ▼                                                               │
│  Display LspPluginRecommendationPrompt                              │
│      │                                                               │
│      ├── "Yes" → Install plugin → Toast "installed · restart"       │
│      ├── "No" → Dismiss (track timeout for ignored count)          │
│      ├── "Never" → Add to never-suggest list                        │
│      └── "Disable" → Disable all LSP recommendations               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Monitors `fileHistory.trackedFiles` for new file types
- Queries plugin marketplace for matching LSP plugins
- Checks if required binary (e.g., `typescript-language-server`) is available
- Sorts results: Official plugins first
- Tracks dismissed recommendations with auto-disable after 5 dismissals
- 30-second auto-dismiss timeout