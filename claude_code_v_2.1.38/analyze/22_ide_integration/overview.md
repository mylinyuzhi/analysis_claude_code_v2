# IDE Integration Architecture (Claude Code 2.1.38)

## Overview

Claude Code integrates with IDEs (VS Code, JetBrains, Cursor, etc.) through a bidirectional MCP (Model Context Protocol) connection. The IDE runs an MCP server that Claude Code connects to as a client, enabling features like: passing file/selection context from the editor, showing diff previews, opening files at specific lines, tracking PR review status, and sending notifications. This is not a traditional language server -- it is an IDE-specific MCP transport built on either SSE (Server-Sent Events) or WebSocket connections.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (IDE Integration)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol)

Key functions in this document:
- `findConnectedIdeClient` (iV) - Finds the connected IDE MCP client from the clients list
- `closeAllDiffTabs` (mx7) - Sends command to IDE to close all diff preview tabs
- `closeDiffTab` (aQA) - Sends command to close a specific diff tab
- `sendIdeConnectedNotification` (hx7) - Sends `ide_connected` notification after MCP handshake
- `useIdeSelection` (fVq) - React hook tracking current editor selection via MCP notifications
- `selectionChangedSchema` (oMz) - Zod schema for `selection_changed` notification from IDE
- `connectMcpServer` - Main MCP connection function handling sse-ide/ws-ide transports

---

## Architecture Diagram

```
IDE (VS Code / JetBrains / Cursor)
  |
  | Extension starts MCP server
  | (SSE endpoint or WebSocket)
  |
  v
+---------------------------+
| MCP Server (in IDE)       |
|  - Exposes tools:         |
|    - openDiff             |
|    - closeAllDiffTabs     |
|    - openFile             |
|  - Sends notifications:   |
|    - selection_changed    |
|    - pr_review_status     |
+---------------------------+
       ^          |
       |          | MCP Protocol (JSON-RPC)
       |          |
       |          v
+---------------------------+
| Claude Code CLI           |
|  - MCP Client for "ide"   |
|  - Transport: sse-ide     |
|    or ws-ide              |
|  - Receives selection ctx |
|  - Sends tool calls       |
+---------------------------+
```

---

## IDE Detection and Connection

### Finding the IDE Client

The IDE MCP server is configured as a special MCP server with the name `"ide"`. When Claude Code starts and detects an IDE connection configuration, it connects using the appropriate transport.

```javascript
// ============================================
// findConnectedIdeClient - Finds the connected IDE MCP client
// Location: chunks.80.mjs:1868-1872 (Ln 217207)
// ============================================

// ORIGINAL (for source lookup):
function iV(A) {
    if (!A) return;
    let q = A.find((K) => K.type === "connected" && K.name === "ide");
    return q?.type === "connected" ? q : void 0
}

// READABLE (for understanding):
function findConnectedIdeClient(mcpClients) {
    if (!mcpClients) return undefined;
    let ideClient = mcpClients.find((client) => client.type === "connected" && client.name === "ide");
    return ideClient?.type === "connected" ? ideClient : undefined;
}

// Mapping: iV->findConnectedIdeClient, A->mcpClients, q->ideClient
```

**What it does:** Searches the array of MCP clients for one named "ide" that is in "connected" state. Returns `undefined` if no IDE is connected.

**Why this approach:**
- The IDE connection is just another MCP server, but with a reserved name "ide"
- The `type === "connected"` check ensures we only use active connections (not "connecting" or "error" states)
- This function is called frequently throughout the UI to conditionally enable IDE-specific features

### MCP Transport Types for IDE

The MCP connection code in chunks.145.mjs handles two IDE-specific transport types:

**`sse-ide` (Server-Sent Events):**
- Used by VS Code extension and similar
- Creates a `StreamableHTTPClientTransport` to the IDE's SSE endpoint
- The IDE serves an HTTP endpoint that streams events
- Supports optional proxy dispatcher for network-restricted environments

**`ws-ide` (WebSocket):**
- Alternative transport for IDEs that prefer WebSocket
- Creates a WebSocket connection with authentication headers
- Includes `X-Claude-Code-Ide-Authorization` header for IDE auth tokens
- User-Agent header identifies Claude Code

```javascript
// ============================================
// connectMcpServer - IDE transport setup (excerpt)
// Location: chunks.145.mjs:1938-1956 (Ln ~)
// ============================================

// ORIGINAL (for source lookup):
// ... inside connectMcpServer function ...
} else if (q.type === "sse-ide") {
    SA(A, `Setting up SSE-IDE transport to ${q.url}`);
    let S = $81(), m = S.dispatcher ? { eventSourceInit: { fetch: async (b, g) => {
        return globalThis.fetch(b, { ...g, dispatcher: S.dispatcher })
    } } } : {};
    z = new D$6(new URL(q.url), Object.keys(m).length > 0 ? m : void 0)
} else if (q.type === "ws-ide") {
    let S = Io6(), m = {
        "User-Agent": Xr(),
        ...q.authToken && { "X-Claude-Code-Ide-Authorization": q.authToken }
    };
    // ... WebSocket transport creation ...
}

// READABLE (for understanding):
// When the MCP server type is "sse-ide":
if (serverConfig.type === "sse-ide") {
    logMcp(serverName, `Setting up SSE-IDE transport to ${serverConfig.url}`);
    let httpAgent = getHttpAgent();
    // If we have a custom dispatcher (for proxy), use it for the SSE fetch
    let options = httpAgent.dispatcher ? {
        eventSourceInit: {
            fetch: async (url, init) => globalThis.fetch(url, { ...init, dispatcher: httpAgent.dispatcher })
        }
    } : {};
    transport = new StreamableHTTPClientTransport(new URL(serverConfig.url), options);

// When the MCP server type is "ws-ide":
} else if (serverConfig.type === "ws-ide") {
    let wsClientClass = getWebSocketClient();
    let headers = {
        "User-Agent": getUserAgent(),
        // IDE authentication token, if provided
        ...(serverConfig.authToken && { "X-Claude-Code-Ide-Authorization": serverConfig.authToken })
    };
    // ... creates WebSocket transport with these headers ...
}

// Mapping: q->serverConfig, A->serverName, D$6->StreamableHTTPClientTransport, SA->logMcp, $81->getHttpAgent, Io6->getWebSocketClient, Xr->getUserAgent
```

### Post-Connection: ide_connected Notification

After a successful MCP handshake with an IDE server, Claude Code sends an `ide_connected` notification:

```javascript
// ============================================
// sendIdeConnectedNotification - Notifies IDE that Claude Code is connected
// Location: chunks.145.mjs:2182-2186
// ============================================

// ORIGINAL (for source lookup):
if (q.type === "sse-ide" || q.type === "ws-ide") {
    let S = Date.now() - Y;
    c("tengu_mcp_ide_server_connection_succeeded", { connectionDurationMs: S, serverVersion: D });
    try { hx7(O) }
    catch (m) { Kz(A, `Failed to send ide_connected notification: ${m}`) }
}

// READABLE (for understanding):
if (serverConfig.type === "sse-ide" || serverConfig.type === "ws-ide") {
    let connectionDurationMs = Date.now() - startTime;
    logEvent("tengu_mcp_ide_server_connection_succeeded", { connectionDurationMs, serverVersion });
    try {
        sendIdeConnectedNotification(mcpSession);
    } catch (error) {
        logMcpWarning(serverName, `Failed to send ide_connected notification: ${error}`);
    }
}

// Mapping: hx7->sendIdeConnectedNotification, O->mcpSession, D->serverVersion, Y->startTime
```

---

## File and Selection Context Passing

### Selection Changed Notification

The IDE extension monitors the user's active editor selection and sends `selection_changed` notifications to Claude Code. This allows the model to know what code the user is looking at.

```javascript
// ============================================
// useIdeSelection - React hook for IDE selection tracking
// Location: chunks.186.mjs:410-453 (Ln 482303)
// ============================================

// ORIGINAL (for source lookup):
function fVq(A, q) {
    let K = ic1.useRef(!1), Y = ic1.useRef(null);
    ic1.useEffect(() => {
        let z = iV(A);
        if (Y.current !== z) K.current = !1, Y.current = z || null, q({ lineCount: 0, lineStart: void 0, text: void 0, filePath: void 0 });
        if (K.current || !z) return;
        let w = (H) => {
            if (H.selection?.start && H.selection?.end) {
                let { start: $, end: O } = H.selection, _ = O.line - $.line + 1;
                if (O.character === 0) _--;
                let J = { lineCount: _, lineStart: $.line, text: H.text, filePath: H.filePath };
                q(J)
            }
        };
        z.client.setNotificationHandler(oMz, (H) => {
            if (Y.current !== z) return;
            try {
                let $ = H.params;
                if ($.selection && $.selection.start && $.selection.end) w($);
                else if ($.text !== void 0) w({ selection: null, text: $.text, filePath: $.filePath })
            } catch ($) { K1($) }
        }), K.current = !0
    }, [A, q])
}

// READABLE (for understanding):
function useIdeSelection(mcpClients, onSelectionChange) {
    let handlerRegistered = useRef(false);
    let currentIdeClient = useRef(null);

    useEffect(() => {
        let ideClient = findConnectedIdeClient(mcpClients);

        // If IDE client changed, reset state
        if (currentIdeClient.current !== ideClient) {
            handlerRegistered.current = false;
            currentIdeClient.current = ideClient || null;
            onSelectionChange({ lineCount: 0, lineStart: undefined, text: undefined, filePath: undefined });
        }

        // Skip if already registered or no IDE connected
        if (handlerRegistered.current || !ideClient) return;

        let processSelection = (data) => {
            if (data.selection?.start && data.selection?.end) {
                let { start, end } = data.selection;
                let lineCount = end.line - start.line + 1;
                // If cursor is at beginning of last line, don't count that line
                if (end.character === 0) lineCount--;
                onSelectionChange({
                    lineCount,
                    lineStart: start.line,
                    text: data.text,
                    filePath: data.filePath
                });
            }
        };

        // Register MCP notification handler for selection_changed
        ideClient.client.setNotificationHandler(selectionChangedSchema, (notification) => {
            if (currentIdeClient.current !== ideClient) return; // Stale handler
            try {
                let params = notification.params;
                if (params.selection?.start && params.selection?.end) {
                    processSelection(params);
                } else if (params.text !== undefined) {
                    // Selection cleared but text/file still available
                    processSelection({ selection: null, text: params.text, filePath: params.filePath });
                }
            } catch (error) {
                reportError(error);
            }
        });

        handlerRegistered.current = true;
    }, [mcpClients, onSelectionChange]);
}

// Mapping: fVq->useIdeSelection, A->mcpClients, q->onSelectionChange, K->handlerRegistered, Y->currentIdeClient, z->ideClient, oMz->selectionChangedSchema, iV->findConnectedIdeClient
```

**What it does:** Registers a notification handler on the IDE MCP client that fires whenever the user's selection changes in the editor. The selection data (line range, text content, file path) is passed to the callback.

**How it works:**
1. Finds the connected IDE client from the MCP clients list
2. If the IDE client changes (reconnection, disconnect), resets the handler
3. Registers a handler for `selection_changed` notifications via `setNotificationHandler`
4. The handler extracts line count, start line, selected text, and file path
5. A special case handles "cursor at beginning of last line" -- this means the user selected up to but not including that line, so lineCount is decremented

**Why this approach:**
- Using MCP notifications (rather than polling) ensures real-time updates with minimal overhead
- The `useRef` pattern prevents duplicate handler registrations across React re-renders
- The stale handler check (`currentIdeClient.current !== ideClient`) prevents processing events from a disconnected IDE

### Selection Changed Schema

```javascript
// ============================================
// selectionChangedSchema - Zod schema for IDE selection notifications
// Location: chunks.186.mjs:463-479 (Ln 482347)
// ============================================

// ORIGINAL (for source lookup):
oMz = u.object({
    method: u.literal("selection_changed"),
    params: u.object({
        selection: u.object({
            start: u.object({ line: u.number(), character: u.number() }),
            end: u.object({ line: u.number(), character: u.number() })
        }).nullable().optional(),
        text: u.string().optional(),
        filePath: u.string().optional()
    })
})

// READABLE (for understanding):
selectionChangedSchema = z.object({
    method: z.literal("selection_changed"),
    params: z.object({
        selection: z.object({
            start: z.object({ line: z.number(), character: z.number() }),
            end: z.object({ line: z.number(), character: z.number() })
        }).nullable().optional(),   // null when selection is cleared
        text: z.string().optional(),       // Selected text content
        filePath: z.string().optional()    // File path of active editor
    })
});

// Mapping: oMz->selectionChangedSchema
```

---

## Diff Preview and File Operations

### IDE Tool Commands

The IDE MCP server exposes several tools that Claude Code invokes:

1. **`openDiff`** - Opens a diff view in the IDE showing proposed changes
2. **`closeAllDiffTabs`** - Closes all diff preview tabs (called after accepting/rejecting edits)
3. **`openFile`** - Opens a file at a specific line in the editor
4. **`closeDiffTab`** - Closes a specific diff tab by identifier

```javascript
// ============================================
// closeAllDiffTabs - Closes all diff preview tabs in IDE
// Location: chunks.80.mjs:1874-1878 (Ln 217212)
// ============================================

// ORIGINAL (for source lookup):
async function mx7(A) {
    try {
        await _h("closeAllDiffTabs", {}, A)
    } catch (q) {}
}

// READABLE (for understanding):
async function closeAllDiffTabs(ideClient) {
    try {
        await callMcpTool("closeAllDiffTabs", {}, ideClient);
    } catch (error) {
        // Silently ignore errors -- IDE might have already closed tabs
    }
}

// Mapping: mx7->closeAllDiffTabs, A->ideClient, _h->callMcpTool
```

**Key insight:** The diff preview workflow is:
1. When Claude proposes a file edit, the edit tool calls `openDiff` in the IDE
2. The user sees a side-by-side diff in their IDE
3. When the user accepts or rejects, `closeAllDiffTabs` is called
4. This seamless integration means users review code changes in their familiar IDE diff viewer, not in the terminal

---

## PR Review Status Indicator

The IDE integration includes PR (Pull Request) review status tracking. When the IDE detects that the user is in a PR review context (e.g., GitHub PR in VS Code), it can send status information to Claude Code. This allows Claude to:

1. Understand the PR context (files changed, review comments)
2. Display PR review status in the CLI UI
3. Tailor its suggestions to the PR workflow

The connection telemetry tracks IDE-specific metrics:

```javascript
// Connection metrics tracked:
{
    sseIdeCount: number,      // Number of SSE-IDE connections
    wsIdeCount: number,       // Number of WebSocket-IDE connections
    connectionDurationMs: ms, // Time to establish connection
    serverVersion: string     // IDE extension version
}
```

---

## Terminal Detection vs IDE Detection

Claude Code distinguishes between running in a terminal emulator and running inside an IDE's integrated terminal:

### Terminal Program Detection (chunks.107.mjs)

```
TERM_PROGRAM environment variable:
  "vscode"     -> VS Code integrated terminal
  "iTerm.app"  -> iTerm2
  "Apple_Terminal" -> macOS Terminal.app
  "ghostty"    -> Ghostty
  "WezTerm"    -> WezTerm
  "Hyper"      -> Hyper terminal
```

### IDE MCP Connection Detection

The IDE is detected through the MCP configuration, not environment variables. The VS Code extension (or JetBrains plugin) registers an MCP server entry with `type: "sse-ide"` or `type: "ws-ide"`, which Claude Code discovers during MCP initialization.

**Key insight:** Terminal detection (via `TERM_PROGRAM`) determines visual capabilities (colors, Unicode support, image protocols). IDE detection (via MCP client named "ide") determines interactive capabilities (diff views, file opening, selection tracking). A user can be in VS Code's terminal (detected by `TERM_PROGRAM=vscode`) but without the Claude Code extension installed, in which case IDE features are unavailable.

---

## Supported IDEs

Based on the codebase analysis, the following IDE integrations are supported:

1. **VS Code** - Primary integration via extension that starts SSE-IDE or WS-IDE MCP server
2. **Cursor** - VS Code fork, compatible with the same extension mechanism
3. **JetBrains IDEs** - Supported via plugin (referenced in configuration patterns)
4. **Zed** - Mentioned in terminal detection context
5. **Any IDE with MCP support** - The protocol is generic enough that any IDE can implement the server side

The integration is transport-agnostic: the IDE just needs to expose an MCP server with the expected tools and notification types, and configure Claude Code to connect to it.
