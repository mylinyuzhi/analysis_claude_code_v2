# IDE Integration Architecture (Claude Code 2.1.76)

## Overview

Claude Code integrates with IDEs (VS Code, JetBrains, Cursor, Windsurf, etc.) through a bidirectional MCP (Model Context Protocol) connection. The IDE extension/plugin starts an MCP server; Claude Code connects to it as a client. This enables: passing live editor selection context, showing diff previews, opening files at specific lines, fetching LSP diagnostics, and syncing permission modes. The transport is either SSE (Server-Sent Events) over HTTP or WebSocket, with an auth token header for WebSocket.

**New in v2.1.76**:
- VS Code extension displays a spark icon in the status bar when Claude Code is active
- Proposed edits can be viewed as a markdown plan view in the IDE sidebar before applying
- A native MCP server configuration dialog is available directly from within the IDE extension panel

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (IDE Integration)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol)

Key functions in this document:
- `findConnectedIdeClient` (iV) - Finds the connected IDE MCP client from the clients list
- `closeAllDiffTabs` (mx7) - Sends command to IDE to close all diff preview tabs
- `closeDiffTab` (aQA) - Sends command to close a specific diff tab by tab name
- `sendIdeConnectedNotification` (hx7) - Sends `ide_connected` notification after MCP handshake
- `useIdeSelection` (fVq) - React hook tracking current editor selection via MCP notifications
- `selectionChangedSchema` (oMz) - Zod schema for `selection_changed` notification from IDE
- `callMcpTool` (_h) - Low-level helper wrapping `lo4` to invoke IDE MCP tools
- `executeMcpTool` (lo4) - Core MCP tool invoker with timeout, progress, auth error handling
- `openDiffInIde` (aJz) - Opens diff view in IDE and waits for user response
- `IDEDiffHandler` (MPq) - React hook orchestrating diff display lifecycle
- `DiagnosticsManager` (KI) - Singleton managing IDE LSP diagnostics baseline/delta

---

## Architecture: Bidirectional MCP Connection

```
IDE Extension (VS Code, JetBrains, Cursor, Windsurf)
        │
        │  Starts MCP server on localhost:PORT
        │
        ▼
   ┌─────────────────────────────────────────────┐
   │          MCP Client (Claude Code)            │
   │                                              │
   │  Transport: SSE (HTTP) or WebSocket          │
   │  Auth: x-claude-code-ide-authorization: TOKEN│
   │  Server name: "ide"                         │
   └──────────────────────────────────────────────┘
        │
        ├── Resources subscribed by Claude Code:
        │   • selection_changed notifications
        │   • diagnostics updates
        │
        └── Tools invoked by Claude Code:
            • openDiff, closeDiff, getAllDiagnostics
            • getOpenEditors, openFile, navigateTo
```

**Why MCP for IDE integration**: MCP is already the standard protocol for Claude Code's external integrations. Using it for IDE connectivity means no bespoke protocol needed — the same client, connection management, and error handling code is reused.

---

## Core Functions

### `findConnectedIdeClient` (iV)

**What it does**: Scans the `mcpClients` list for an entry with `name: "ide"` and `type: "connected"`. Returns the client object or `null`.

**Why linear scan**: MCP clients are typically a small list (< 10 servers). O(N) scan is fast and simpler than maintaining a separate index.

### `openDiffInIde` (aJz)

**What it does**: Sends the diff to the IDE and blocks until the user accepts, rejects, or closes the tab.

**How it works**:
1. Calls the IDE's `openDiff` MCP tool with file path, original content, and proposed content
2. Sets up event listeners for three resolution events: `FILE_SAVED`, `TAB_CLOSED`, `DIFF_REJECTED`
3. Resolves with `{ oldContent, newContent }` based on user action
4. If the IDE disconnects during wait, throws an error (caught by `IDEDiffHandler`)

**Three resolution outcomes**:
- `FILE_SAVED`: User accepted and saved → `newContent` = user's saved version
- `TAB_CLOSED`: User closed without rejecting → `newContent` = proposed content
- `DIFF_REJECTED`: User explicitly rejected → triggers `onChange({ type: "reject" })`

### `DiagnosticsManager` (KI)

**What it does**: Singleton class that fetches IDE diagnostics (errors, warnings from LSP), computes a baseline on session start, and surfaces only new diagnostics (delta) to avoid overwhelming the LLM with pre-existing issues.

**Design principle**: New diagnostics since session start are more actionable than pre-existing ones. The baseline snapshot prevents Claude from getting distracted by issues that were there before it started working.

---

## IDE Connection Flow

```
Session startup
    │
    ├─ Look for "ide" in MCP server configs
    │
    ├─ Connect via SSE or WebSocket transport
    │      │
    │      ├─ SSE: HTTP GET /events with Authorization header
    │      └─ WebSocket: ws:// with x-claude-code-ide-authorization header
    │
    ├─ MCP handshake completes
    │
    ├─ sendIdeConnectedNotification (hx7) fires
    │      └─ Sends "ide_connected" notification to IDE extension
    │              └─ IDE shows "Claude Code connected" in status bar
    │
    └─ Subscribe to selection_changed notifications
           └─ useIdeSelection (fVq) begins tracking editor state
```

---

## Permission Mode Sync

When Claude Code's permission mode changes (e.g., entering plan mode, bypassPermissions), it notifies the IDE extension. This allows the extension to update its UI to indicate the current mode:

```
Claude Code mode changes
    │
    ├─ syncPermissionModeToIde (aVq)
    │      └─ Calls IDE MCP tool: setPermissionMode({ mode: "plan" })
    │
    └─ IDE extension updates status bar icon
```

---

## IDE Support Matrix (198 chunk files in v2.1.76)

The `IDE_CONFIG_MAP` (U01) contains configurations for 18 supported IDEs, including:

| IDE | Identifier | Plugin/Extension |
|-----|------------|-----------------|
| VS Code | `vscode` | `anthropic.claude-code` extension |
| Cursor | `cursor` | Same extension ID |
| Windsurf | `windsurf` | Same extension ID |
| IntelliJ IDEA | `intellij` | JetBrains plugin |
| PyCharm | `pycharm` | JetBrains plugin |
| WebStorm | `webstorm` | JetBrains plugin |
| (+ 12 others) | ... | ... |

JetBrains IDEs use the term "plugin" while VS Code-family IDEs use "extension".

---

## Error Handling

| Error Scenario | Behavior |
|----------------|----------|
| IDE not running | `ideStatus = null` — no status indicator shown |
| IDE disconnects mid-session | `ideStatus = "disconnected"` — notification shown |
| `openDiff` call fails | `hasError = true` — falls back to terminal diff |
| Diff tab closed by user | Treated as acceptance of proposed change |
| JetBrains plugin not connected | Distinct "plugin not connected" notification |

---

## New Features in v2.1.76

### Spark Icon in VS Code Status Bar

The VS Code extension now shows a spark icon in the status bar when Claude Code has an active connection. This provides persistent visual feedback that the IDE integration is live, even when no diff is open or no selection is active.

**Implementation**: The `sendIdeConnectedNotification` (hx7) function triggers the extension to display the icon. On disconnect, the extension removes it automatically.

### Markdown Plan View

Before applying proposed file edits, users can view a rendered markdown summary of all planned changes in the IDE sidebar. This is triggered when plan mode is active and the LLM proposes a multi-file edit sequence.

**Integration**: When `planMode` is detected and the IDE is connected, `openDiffInIde` (aJz) can be called in a "preview" variant that renders a markdown plan document rather than a per-file diff.

### Native MCP Server Configuration Dialog

Users can now configure MCP servers directly from the IDE extension panel without editing JSON files manually. The extension provides a form-based UI that writes to `~/.claude/settings.json` and triggers a live reload.

**How it works**: The IDE extension calls a new MCP tool `configureMcpServer` which Claude Code exposes back to the extension. This creates a bidirectional MCP relationship: Claude Code connects to the IDE as a client, and the IDE calls back into Claude Code for configuration operations.

---

## Related Documents

- [ui_linkage.md](./ui_linkage.md) - UI components and React hooks for IDE integration
- [27_lsp_integration/](../27_lsp_integration/) - LSP client architecture (separate from IDE MCP)
- [06_mcp/](../06_mcp/) - MCP protocol and transport layer
