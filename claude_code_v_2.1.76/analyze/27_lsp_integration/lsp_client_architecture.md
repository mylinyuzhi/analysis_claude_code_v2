# LSP Integration Architecture

## Overview

Claude Code (`v2.1.38`) acts as a **polyglot Language Server Protocol (LSP) Client**. It does not implement its own static analysis engines but instead leverages existing LSP servers (like `tsserver`, `gopls`, `pyright`, etc.) to provide "IDE-like" intelligence to the model. This allows Claude to "jump to definition," "find references," and "hover" over symbols during its investigation.

## Core Architecture

The implementation is bundled in `chunks.133.mjs`, which includes minified versions of `vscode-jsonrpc` and `vscode-languageserver-protocol`.

### The LSP Client (`Fm4`)
The central component is a factory function that creates an LSP client instance. It manages:
1.  **Process Management**: Spawning the LSP server executable.
2.  **Transport**: Connecting via Stdio (Pipes).
3.  **Protocol**: Handling JSON-RPC messages.
4.  **Lifecycle**: `initialize`, `shutdown`, `exit`.

### Configuration (`.lsp.json`)
LSP servers are configured via `.lsp.json` files found in plugins or the workspace. This configuration defines:
- `command`: The executable to run (e.g., `typescript-language-server`).
- `args`: Arguments.
- `env`: Environment variables.
- `workspaceFolder`: The root to index.

## Client Capabilities

When connecting to a server, Claude Code advertises the following capabilities in the `initialize` handshake:

| Feature | Support | Note |
|---------|---------|------|
| **Synchronization** | `didSave` | It does NOT sync every keystroke (`didChange`), only saves. |
| **Hover** | Markdown/Plaintext | Used for reading docstrings. |
| **Definition** | Link Support | Used for "Go to Definition". |
| **References** | Supported | Used for "Find References". |
| **DocumentSymbol** | Hierarchical | Used for "Outline" / "Structure". |
| **Workspace** | Folders | Basic workspace folder support. |

### Code Snippet: LSP Client Initialization

```javascript
// ============================================
// createLspClient - Factory for LSP client instances
// Location: chunks.133.mjs:1785-1957
// ============================================

// ORIGINAL (for source lookup):
function Fm4(A, q) {
    if (q.restartOnCrash !== void 0) throw Error(`LSP server '${A}': restartOnCrash is not yet implemented...`);
    // ...
    async function $() {
        // ...
        await K.start(q.command, q.args || [], { ... });
        let G = {
            processId: process.pid,
            capabilities: {
                textDocument: {
                    synchronization: { didSave: !0 }, // Only didSave
                    hover: { contentFormat: ["markdown", "plaintext"] },
                    definition: { linkSupport: !0 },
                    references: {},
                    documentSymbol: { hierarchicalDocumentSymbolSupport: !0 }
                }
                // ...
            }
        };
        await K.initialize(G);
        // ...
    }
    // ...
}

// READABLE (for understanding):
function createLspClient(serverName, config) {
    // ... validation
    let connection = createLspProcess(serverName); // um4
    
    async function start() {
        // ...
        await connection.start(config.command, config.args, { ... });
        
        const initParams = {
            processId: process.pid,
            capabilities: {
                textDocument: {
                    synchronization: {
                        didSave: true // We only notify on file save
                    },
                    hover: {
                        contentFormat: ["markdown", "plaintext"]
                    },
                    definition: { linkSupport: true },
                    references: { dynamicRegistration: false },
                    documentSymbol: { hierarchicalDocumentSymbolSupport: true }
                }
            },
            rootUri: `file://${config.workspaceFolder}`
        };
        
        await connection.initialize(initParams);
        // ...
    }
    
    return {
        name: serverName,
        start,
        stop,
        restart,
        sendRequest,
        sendNotification
    };
}

// Mapping: Fm4→createLspClient, A→serverName, q→config, um4→createLspProcess
```

## Transport Layer

The system uses `vscode-jsonrpc` over Node.js streams. It specifically supports:
- **Pipes**: `createClientPipeTransport`
- **Sockets**: `createClientSocketTransport`
- **Stdio**: Direct process attachment (standard method).

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure

Key functions in this document:
- `createLspClient` (Fm4) - Main client logic
- `createLspProcess` (um4) - Process spawner & connection builder
- `loadPluginLspConfig` (HvY) - Loads .lsp.json
- `vscode-languageserver-protocol` (GP6) - Bundled library
- `vscode-jsonrpc` (Zm4) - Bundled library
