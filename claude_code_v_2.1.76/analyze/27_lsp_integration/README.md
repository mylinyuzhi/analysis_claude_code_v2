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
│  │  LSP Tool   │───►│ LspServerManager │───►│  LSP Client (Fm4)   │ │
│  │   (vRA)     │    │     (lm4)        │    │                     │ │
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
│         │         │ (om4, sm4, WIY)     │  publishDiagnostics      │
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
| `LspTool` (vRA) | Tool interface for LSP operations | chunks.140.mjs:698 |
| `LspServerManager` (lm4) | Polyglot server coordinator | chunks.133.mjs:2172 |
| `createLspClient` (Fm4) | Client factory for individual servers | chunks.133.mjs:1785 |
| `loadLspConfigs` (dm4) | Configuration aggregation from plugins | chunks.133.mjs:2144 |
| `registerDiagnostics` (om4) | Diagnostic buffering system | chunks.133.mjs:2350 |
| `WIY` | System prompt diagnostic attachment | chunks.142.mjs:2473 |

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
| [ui_linkage.md](./ui_linkage.md) | UI rendering and notification handling |

### Feature Documentation

| File | Description |
|------|-------------|
| [error_handling.md](./error_handling.md) | Error handling, retry mechanisms, and crash recovery |
| [configuration.md](./configuration.md) | `.lsp.json` schema and plugin configuration flow |
| [lifecycle.md](./lifecycle.md) | Manager initialization, startup, and shutdown sequences |
| [cross_module_integration.md](./cross_module_integration.md) | Integration with Tools, System Reminder, File Tools |

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
- `createLspClient` (Fm4) - Main client factory
- `LspServerManager` (lm4) - Server coordinator
- `LspTool` (vRA) - Tool object definition
- `loadPluginLspConfig` (HvY) - Configuration loader
- `registerDiagnostics` (om4) - Diagnostic registry
- `checkDiagnosticsRegistry` (sm4) - Diagnostic deduplication
- `getLSPDiagnosticAttachments` (WIY) - System prompt attachment