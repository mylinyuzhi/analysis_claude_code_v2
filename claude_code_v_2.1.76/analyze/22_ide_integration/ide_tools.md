# IDE MCP Tools (Claude Code 2.1.76)

## Overview

The IDE extension exposes MCP tools that Claude Code invokes to interact with the editor. These tools enable file operations, diff viewing, navigation, and diagnostics retrieval. All tools are invoked through the MCP client connected to the IDE server (server name: "ide").

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - IDE Integration
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - MCP Protocol

Key functions in this document:
- `openDiffInIde` (EPz) - Opens diff view in IDE and waits for user response
- `closeDiffTab` (Cs8) - Closes a specific diff tab by name
- `closeAllDiffTabs` ($R7) - Closes all Claude Code diff tabs
- `findConnectedIdeClient` (Gv) - Locates the connected IDE client
- `hasConnectedIde` (L$1) - Returns true if IDE MCP client is connected
- `getIdeName` (R$1) - Returns display name of connected IDE
- `callMcpTool` (pC) - Low-level MCP tool invocation helper

---

## Tool Registry

### IDE-Exposed MCP Tools

| Tool Name | Purpose | Parameters | Response |
|-----------|---------|------------|----------|
| `openDiff` | Show file diff in IDE | filePath, oldContent, newContent, tabName | { event, content } |
| `closeDiff` | Close a diff tab | tabName | { success: boolean } |
| `getAllDiagnostics` | Get LSP diagnostics | filter | { diagnostics: Diagnostic[] } |
| `openFile` | Open file in editor | filePath, line?, column? | { success: boolean } |
| `navigateTo` | Navigate to location | filePath, line, column | { success: boolean } |
| `setPermissionMode` | Update permission mode | mode | { success: boolean } |
| `getOpenEditors` | List open editors | - | { editors: EditorInfo[] } |
| `getWorkspaceFolders` | Get workspace roots | - | { folders: string[] } |

---

## Tool: `openDiff`

### Purpose

Opens a diff view in the IDE showing proposed file changes. The diff view allows users to:
- See the original content vs. proposed changes
- Edit the proposed content directly
- Accept (save) or reject the changes

### Request Schema

```javascript
// ============================================
// openDiff input schema
// ============================================

const openDiffInputSchema = {
    type: "object",
    properties: {
        filePath: {
            type: "string",
            description: "Absolute path to the file being modified"
        },
        oldContent: {
            type: "string",
            description: "Current file content (null if new file)"
        },
        newContent: {
            type: "string",
            description: "Proposed new content"
        },
        tabName: {
            type: "string",
            description: "Name for the diff tab (for multi-file edits)"
        },
        editMode: {
            type: "string",
            enum: ["replace", "append", "prepend"],
            description: "Type of edit operation"
        }
    },
    required: ["filePath", "newContent"]
};
```

### Response Events

The `openDiff` tool is asynchronous and waits for user interaction:

| Event | Meaning | Response Content |
|-------|---------|------------------|
| `FILE_SAVED` | User accepted and saved | The final saved content |
| `TAB_CLOSED` | User closed the diff tab | The proposed content (treated as acceptance) |
| `DIFF_REJECTED` | User explicitly rejected | null |

### Implementation: `openDiffInIde` (EPz)

```javascript
// ============================================
// openDiffInIde - Opens diff view and waits for user response
// Location: chunks.188.mjs:955-1011
// ============================================

// ORIGINAL (for source lookup):
async function EPz(A, q, K, Y) {
    let z = !1,
        _ = L4(A),
        w = "";
    try {
        w = IM(_)
    } catch (H) {
        if (H.code !== "ENOENT") throw H
    }
    async function O() {
        if (z) return;
        z = !0;
        try {
            await Cs8(Y, $)
        } catch (H) {
            _6(H)
        }
        process.off("beforeExit", O), K.abortController.signal.removeEventListener("abort", O)
    }
    K.abortController.signal.addEventListener("abort", O), process.on("beforeExit", O);
    let $ = Gv(K.options.mcpClients);
    try {
        let {
            updatedFile: H
        } = Qx6({
            filePath: _,
            fileContents: w,
            edits: q
        });
        if (!$ || $.type !== "connected") throw Error("IDE client not available");
        let j = _,
            J = $.config.ideRunningInWindows === !0;
        if (y8() === "wsl" && J && process.env.WSL_DISTRO_NAME) j = new nD6(process.env.WSL_DISTRO_NAME).toIDEPath(_);
        let M = await pC("openDiff", {
                old_file_path: j,
                new_file_path: j,
                new_file_contents: H,
                tab_name: Y
            }, $),
            D = Array.isArray(M) ? M : [M];
        if (RPz(D)) return O(), {
            oldContent: w,
            newContent: D[1].text
        };
        else if (yPz(D)) return O(), {
            oldContent: w,
            newContent: H
        };
        else if (LPz(D)) return O(), {
            oldContent: w,
            newContent: w
        };
        throw Error("Not accepted")
    } catch (H) {
        throw _6(H), O(), H
    }
}

// READABLE (for understanding):
async function openDiffInIde(filePath, edits, toolUseContext, tabName) {
    let cleanupFired = false;
    let absolutePath = resolveAbsolutePath(filePath);
    let oldContent = "";

    // Read current file content (may not exist for new files)
    try {
        oldContent = readFileSync(absolutePath);
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }

    // Cleanup function: close tab and remove listeners
    async function cleanup() {
        if (cleanupFired) return;
        cleanupFired = true;
        try {
            await closeDiffTab(tabName, ideClient);
        } catch (error) {
            logError(error);
        }
        process.off("beforeExit", cleanup);
        toolUseContext.abortController.signal.removeEventListener("abort", cleanup);
    }

    // Register cleanup on abort and process exit
    toolUseContext.abortController.signal.addEventListener("abort", cleanup);
    process.on("beforeExit", cleanup);

    let ideClient = findConnectedIdeClient(toolUseContext.options.mcpClients);

    try {
        // Apply edits to generate new content
        let { updatedFile: newContent } = applyEdits({
            filePath: absolutePath,
            fileContents: oldContent,
            edits: edits
        });

        // Guard: IDE must be connected
        if (!ideClient || ideClient.type !== "connected") {
            throw new Error("IDE client not available");
        }

        // Handle WSL path translation if IDE is running on Windows
        let ideFilePath = absolutePath;
        let ideIsOnWindows = ideClient.config.ideRunningInWindows === true;
        if (getPlatform() === "wsl" && ideIsOnWindows && process.env.WSL_DISTRO_NAME) {
            ideFilePath = new WSLPathTranslator(process.env.WSL_DISTRO_NAME).toIDEPath(absolutePath);
        }

        // Call MCP openDiff tool on IDE (BLOCKING call)
        let result = await callMcpTool("openDiff", {
            old_file_path: ideFilePath,
            new_file_path: ideFilePath,
            new_file_contents: newContent,
            tab_name: tabName
        }, ideClient);

        let responses = Array.isArray(result) ? result : [result];

        // Response type 1: FILE_SAVED - user accepted and saved
        if (isFileSavedResponse(responses)) {
            cleanup();
            return {
                oldContent: oldContent,
                newContent: responses[1].text  // User's edited version
            };
        }
        // Response type 2: TAB_CLOSED - user closed without rejecting
        else if (isTabClosedResponse(responses)) {
            cleanup();
            return {
                oldContent: oldContent,
                newContent: newContent  // Our proposed version
            };
        }
        // Response type 3: DIFF_REJECTED - user clicked reject
        else if (isDiffRejectedResponse(responses)) {
            cleanup();
            return {
                oldContent: oldContent,
                newContent: oldContent  // Original unchanged
            };
        }

        throw new Error("Not accepted");
    } catch (error) {
        logError(error);
        cleanup();
        throw error;
    }
}

// Mapping: EPz→openDiffInIde, A→filePath, q→edits, K→toolUseContext, Y→tabName
//          L4→resolveAbsolutePath, IM→readFileSync, Cs8→closeDiffTab, Gv→findConnectedIdeClient
//          pC→callMcpTool, Qx6→applyEdits, RPz→isFileSavedResponse, yPz→isTabClosedResponse, LPz→isDiffRejectedResponse
```

### Three-Way Resolution Logic

The diff handler implements a three-way resolution model:

```
                    ┌─────────────────┐
                    │  openDiffInIde  │
                    │     called      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Diff tab open │
                    │   in IDE        │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │ FILE_SAVED   │ │ TAB_CLOSED   │ │ DIFF_REJECTED│
     │ User saved   │ │ User closed  │ │ User clicked │
     │ edited ver.  │ │ without edit │ │ reject btn   │
     └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
            │                │                │
            ▼                ▼                ▼
     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │ Use saved    │ │ Use proposed │ │ onChange({   │
     │ content      │ │ content      │ │   type:      │
     │              │ │              │ │   "reject"   │
     └──────────────┘ └──────────────┘ │ })           │
                                       └──────────────┘
```

**Why TAB_CLOSED = acceptance:** If a user closes the diff tab without explicitly rejecting, it's assumed they reviewed and accepted the changes. This matches common IDE behavior where closing a preview accepts it.

---

## Tool: `closeDiff` and `closeAllDiffTabs`

### Purpose

Cleans up diff tabs after file edits are complete. Claude Code may have multiple diff tabs open during a multi-file edit session.

### `closeDiffTab` (Cs8) Implementation

```javascript
// ============================================
// closeDiffTab - Close a specific diff tab by name
// Location: chunks.188.mjs:1013-1020
// ============================================

// ORIGINAL (for source lookup):
async function Cs8(A, q) {
    try {
        if (!q || q.type !== "connected") throw Error("IDE client not available");
        await pC("close_tab", {
            tab_name: A
        }, q)
    } catch (K) {}
}

// READABLE (for understanding):
async function closeDiffTab(tabName, ideClient) {
    try {
        if (!ideClient || ideClient.type !== "connected") {
            throw new Error("IDE client not available");
        }
        await callMcpTool("close_tab", { tab_name: tabName }, ideClient);
    } catch (error) {
        // Silently ignore errors - tab may already be closed or IDE may not support this tool
    }
}

// Mapping: Cs8→closeDiffTab, A→tabName, q→ideClient, pC→callMcpTool
```

### `closeAllDiffTabs` ($R7) Implementation

```javascript
// ============================================
// closeAllDiffTabs - Close all Claude Code diff tabs
// Location: chunks.65.mjs:2038-2042
// ============================================

// ORIGINAL (for source lookup):
async function $R7(A) {
    try {
        await pC("closeAllDiffTabs", {}, A)
    } catch (q) {}
}

// READABLE (for understanding):
async function closeAllDiffTabs(ideClient) {
    try {
        await callMcpTool("closeAllDiffTabs", {}, ideClient);
    } catch (error) {
        // Silently ignore errors
    }
}

// Mapping: $R7→closeAllDiffTabs, A→ideClient, pC→callMcpTool
```

---

## Tool: `getAllDiagnostics`

### Purpose

Retrieves LSP diagnostics (errors, warnings, hints) from the IDE. Used to surface code issues to the LLM context.

### Request/Response Schema

```javascript
// Request
{
    filter?: {
        severities?: ("error" | "warning" | "hint" | "information")[],
        filePath?: string,
        limit?: number
    }
}

// Response
{
    diagnostics: [
        {
            filePath: string,
            range: {
                start: { line: number, character: number },
                end: { line: number, character: number }
            },
            severity: "error" | "warning" | "hint" | "information",
            message: string,
            source: string,     // e.g., "typescript", "eslint"
            code?: string       // e.g., "TS2304"
        }
    ]
}
```

### Integration with DiagnosticsManager

```javascript
// ============================================
// DiagnosticsManager - Manages diagnostic baseline and delta
// Location: chunks.144.mjs (approx)
// ============================================

// READABLE (for understanding):
class DiagnosticsManager {
    constructor(ideClient) {
        this.ideClient = ideClient;
        this.baseline = null;
        this.lastFetched = null;
    }

    // Called at session start to establish baseline
    async captureBaseline() {
        let allDiagnostics = await this.ideClient.callTool("getAllDiagnostics", {});
        this.baseline = this.indexDiagnostics(allDiagnostics.diagnostics);
        this.lastFetched = Date.now();
    }

    // Get only new diagnostics since baseline
    async getNewDiagnostics() {
        let current = await this.ideClient.callTool("getAllDiagnostics", {});
        return this.computeDelta(this.baseline, current.diagnostics);
    }

    // Index diagnostics by file for efficient lookup
    indexDiagnostics(diagnostics) {
        let index = new Map();
        for (let d of diagnostics) {
            if (!index.has(d.filePath)) {
                index.set(d.filePath, []);
            }
            index.get(d.filePath).push(d);
        }
        return index;
    }

    // Compute diagnostics that are new since baseline
    computeDelta(baseline, current) {
        let newDiagnostics = [];
        for (let d of current) {
            let baselineForFile = baseline.get(d.filePath) || [];
            if (!this.containsDiagnostic(baselineForFile, d)) {
                newDiagnostics.push(d);
            }
        }
        return newDiagnostics;
    }

    // Check if diagnostic exists in baseline
    containsDiagnostic(baselineList, diagnostic) {
        return baselineList.some(b =>
            b.message === diagnostic.message &&
            b.range.start.line === diagnostic.range.start.line &&
            b.severity === diagnostic.severity
        );
    }
}
```

**Why baseline + delta:** Pre-existing code issues are less actionable than new issues introduced during the session. The baseline ensures the LLM focuses on problems it might have caused.

---

## Tool: `openFile` and `navigateTo`

### Purpose

Opens files in the IDE and navigates to specific locations. Used when the LLM wants to draw user attention to a specific file or code location.

### Request Schemas

```javascript
// openFile
{
    filePath: string,        // Absolute path
    line?: number,           // Optional: line to highlight
    column?: number,         // Optional: column position
    preview?: boolean        // Optional: open in preview mode
}

// navigateTo
{
    filePath: string,        // Absolute path
    line: number,            // Required: target line
    column?: number          // Optional: target column
}
```

### Usage Pattern

```javascript
// Example: After finding an error, navigate user to it
async function navigateToError(filePath, line, column) {
    let ideClient = findConnectedIdeClient(getMcpClients());
    if (!ideClient) return;

    await ideClient.callTool("navigateTo", {
        filePath,
        line,
        column: column || 1
    });
}
```

---

## Tool: `setPermissionMode`

### Purpose

Notifies the IDE when Claude Code's permission mode changes. The IDE can update its UI to reflect the current mode (e.g., plan mode, auto-approve, restricted).

### Request Schema

```javascript
{
    mode: "default" | "plan" | "accept-edits" | "restricted"
}
```

### IDE UI Response

When the IDE receives `setPermissionMode`:

| Mode | IDE Behavior |
|------|--------------|
| `default` | Normal operation, permission prompts shown |
| `plan` | Shows "Plan Mode" indicator, preview changes before apply |
| `accept-edits` | Auto-accept file edits, minimal UI interruption |
| `restricted` | Shows lock icon, limits available operations |

---

## Tool Invocation Helpers

### `findConnectedIdeClient` (Gv)

```javascript
// ============================================
// findConnectedIdeClient - Locate connected IDE MCP client
// Location: chunks.65.mjs:2032-2036
// ============================================

// ORIGINAL (for source lookup):
function Gv(A) {
    if (!A) return;
    let q = A.find((K) => K.type === "connected" && K.name === "ide");
    return q?.type === "connected" ? q : void 0
}

// READABLE (for understanding):
function findConnectedIdeClient(mcpClients) {
    if (!mcpClients) return undefined;

    let ideClient = mcpClients.find(client =>
        client.type === "connected" && client.name === "ide"
    );

    // Type guard: only return if actually connected
    return ideClient?.type === "connected" ? ideClient : undefined;
}

// Mapping: Gv→findConnectedIdeClient, A→mcpClients, q→ideClient
```

### `hasConnectedIde` (L$1)

```javascript
// ============================================
// hasConnectedIde - Check if IDE MCP client is connected
// Location: chunks.65.mjs:1811-1813
// ============================================

// ORIGINAL (for source lookup):
function L$1(A) {
    return A.some((q) => q.type === "connected" && q.name === "ide")
}

// READABLE (for understanding):
function hasConnectedIde(mcpClients) {
    return mcpClients.some(client =>
        client.type === "connected" && client.name === "ide"
    );
}

// Mapping: L$1→hasConnectedIde, A→mcpClients
```

### `getIdeName` (R$1)

```javascript
// ============================================
// getIdeName - Get display name of connected IDE
// Location: chunks.65.mjs:2006-2009
// ============================================

// ORIGINAL (for source lookup):
function R$1(A) {
    let q = A.find((K) => K.type === "connected" && K.name === "ide");
    return sj8(q)
}

// READABLE (for understanding):
function getIdeName(mcpClients) {
    let ideClient = mcpClients.find(client =>
        client.type === "connected" && client.name === "ide"
    );
    return extractIdeName(ideClient);
}

// Mapping: R$1→getIdeName, A→mcpClients, sj8→extractIdeName
```

### `getIdeConnectionStatus` (LV6)

```javascript
// ============================================
// getIdeConnectionStatus - Memoized IDE connection state hook
// Location: chunks.190.mjs:2902-2924
// ============================================

// ORIGINAL (for source lookup):
function LV6(A) {
    return UIq.useMemo(() => {
        let q = A?.find((z) => z.name === "ide");
        if (!q) return { status: null, ideName: null };
        let K = q.config,
            Y = K.type === "sse-ide" || K.type === "ws-ide" ? K.ideName : null;
        if (q.type === "connected") return { status: "connected", ideName: Y };
        if (q.type === "pending") return { status: "pending", ideName: Y };
        return { status: "disconnected", ideName: Y }
    }, [A])
}

// READABLE (for understanding):
function getIdeConnectionStatus(mcpClients) {
    return React.useMemo(() => {
        // Find IDE client by name
        let ideClient = mcpClients?.find(client => client.name === "ide");

        // No IDE configured
        if (!ideClient) return { status: null, ideName: null };

        // Extract IDE name from config (only for IDE-specific transport types)
        let config = ideClient.config;
        let ideName = (config.type === "sse-ide" || config.type === "ws-ide")
            ? config.ideName
            : null;

        // Return connection status
        if (ideClient.type === "connected") {
            return { status: "connected", ideName };
        }
        if (ideClient.type === "pending") {
            return { status: "pending", ideName };
        }
        return { status: "disconnected", ideName };
    }, [mcpClients]);
}

// Mapping: LV6→getIdeConnectionStatus, A→mcpClients, UIq→React, q→ideClient,
//          K→config, Y→ideName
```

**Return values:**
| status | ideName | Meaning |
|--------|---------|---------|
| `null` | `null` | No IDE configured |
| `"disconnected"` | string | IDE was configured but connection failed |
| `"pending"` | string | IDE connection in progress |
| `"connected"` | string | IDE is connected and ready |

### `callMcpTool` (pC)

```javascript
// ============================================
// callMcpTool - Low-level MCP tool invocation wrapper
// Location: chunks.65.mjs (used throughout IDE integration)
// ============================================

// The pC function is the primary MCP tool invocation helper.
// It handles the JSON-RPC call to the MCP server.

// READABLE (for understanding):
async function callMcpTool(toolName, args, mcpClient) {
    if (!mcpClient || mcpClient.type !== "connected") {
        throw new Error("MCP client not connected");
    }

    // MCP uses JSON-RPC 2.0 format
    let request = {
        jsonrpc: "2.0",
        id: generateRequestId(),
        method: "tools/call",
        params: {
            name: toolName,
            arguments: args
        }
    };

    // Send via transport (SSE or WebSocket)
    return await mcpClient.transport.sendRequest(request);
}

// Mapping: pC→callMcpTool
```

---

## Error Handling

### Tool Call Error Matrix

| Error | Meaning | Recovery |
|-------|---------|----------|
| `IDE_NOT_CONNECTED` | MCP client not found | Fall back to terminal-based alternative |
| `TOOL_NOT_FOUND` | IDE doesn't expose this tool | Skip operation, show warning |
| `TIMEOUT` | No response within timeout | Retry with longer timeout, then fail |
| `AUTH_REQUIRED` | Token expired or invalid | Trigger re-authentication flow |
| `PERMISSION_DENIED` | User denied the operation | Propagate to LLM, let it decide next action |

### Example Error Handling

```javascript
// ============================================
// IDEDiffHandler error handling
// Location: chunks.180.mjs
// ============================================

// READABLE (for understanding):
async function handleDiffError(error, fallback) {
    if (error.message.includes("not connected")) {
        // IDE disconnected - use terminal diff
        return { showingDiffInIDE: false };
    }

    if (error.message.includes("timed out")) {
        // Timeout - maybe user is away, show notification
        addNotification({
            key: "diff-timeout",
            text: "Diff timed out. Click to retry.",
            action: () => retryDiff()
        });
        return { hasError: true };
    }

    // Unknown error - log and fall back
    console.error("IDE diff error:", error);
    return { hasError: true };
}
```

---

## Cross-Module Integration

### With System Reminders

IDE diagnostics are injected into system reminders:

```javascript
// When building system prompt attachments
async function createDiagnosticAttachment(diagnosticsManager) {
    let newDiagnostics = await diagnosticsManager.getNewDiagnostics();

    if (newDiagnostics.length === 0) return null;

    return {
        type: "ide_diagnostics",
        content: formatDiagnostics(newDiagnostics),
        priority: "high",
        trigger: "on_new_diagnostics"
    };
}
```

### With Edit Tool

The `IDEDiffHandler` is integrated into the Edit tool's rendering pipeline:

```javascript
// Edit tool uses IDE diff when available
function EditTool({ input, onChange, toolUseContext }) {
    let { showingDiffInIDE, hasError } = IDEDiffHandler({
        filePath: input.file_path,
        edits: input.edits,
        toolUseContext,
        onChange
    });

    if (showingDiffInIDE) {
        return <Text>Viewing diff in IDE...</Text>;
    }

    if (hasError) {
        return <TerminalDiffView input={input} onChange={onChange} />;
    }

    return null;
}
```

---

## Deep Algorithm Analysis: IDE Diff Handler

### Algorithm Overview

The `IDEDiffHandler` (pSq) is a React hook that manages the complete lifecycle of diff display in the IDE:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    IDEDiffHandler (pSq) State Machine                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Initial State                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ showingDiffInIDE = false, hasError = false                          │    │
│  │ cleanedUp = useRef(false)                                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Component Mount (useEffect)                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 1. Check if IDE diff is available:                                   │    │
│  │    - IDE connected? (hasConnectedIde)                                │    │
│  │    - Diff tool set to "auto"?                                        │    │
│  │    - Not a .ipynb file?                                              │    │
│  │                                                                       │    │
│  │ 2. If available, call openDiffInIde()                               │    │
│  │    (this is BLOCKING - waits for user interaction)                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│           ┌───────────────┴───────────────┐                                 │
│           │                               │                                  │
│           ▼                               ▼                                  │
│  ┌─────────────────────┐       ┌─────────────────────┐                     │
│  │ IDE Diff Available  │       │ IDE Diff Not Available│                   │
│  │                     │       │                       │                   │
│  │ Call openDiffInIde  │       │ Return immediately:   │                   │
│  │ (blocking wait)     │       │ showingDiffInIDE=false│                   │
│  └─────────┬───────────┘       └───────────────────────┘                   │
│            │                                                                 │
│            ▼                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ User Interaction in IDE                                              │    │
│  │                                                                       │    │
│  │ ┌───────────────┐  ┌───────────────┐  ┌───────────────┐            │    │
│  │ │ FILE_SAVED    │  │ TAB_CLOSED    │  │ DIFF_REJECTED │            │    │
│  │ │ User saved    │  │ User closed   │  │ User clicked  │            │    │
│  │ │ (may have     │  │ without edit  │  │ reject button │            │    │
│  │ │ edited)       │  │               │  │               │            │    │
│  │ └───────┬───────┘  └───────┬───────┘  └───────┬───────┘            │    │
│  │         │                  │                  │                     │    │
│  │         ▼                  ▼                  ▼                     │    │
│  │ ┌───────────────┐  ┌───────────────┐  ┌───────────────┐            │    │
│  │ │ Extract user  │  │ Use proposed  │  │ onChange({    │            │    │
│  │ │ edited content│  │ content       │  │   type:       │            │    │
│  │ │               │  │               │  │   "reject"    │            │    │
│  │ │ Recompute     │  │ onChange({    │  │ })            │            │    │
│  │ │ edits from    │  │   type:       │  │               │            │    │
│  │ │ diff          │  │   "accept-    │  │               │            │    │
│  │ │               │  │   once"       │  │               │            │    │
│  │ └───────────────┘  └───────────────┘  └───────────────┘            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Component Unmount (cleanup)                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ cleanedUp.current = true                                             │    │
│  │ closeTabInIDE() - close the diff tab                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Code Analysis: IDEDiffHandler (pSq)

**Location:** `chunks.188.mjs:880-940`

```javascript
// ============================================
// IDEDiffHandler - React hook for IDE diff lifecycle
// Location: chunks.188.mjs:880-940
// ============================================

// ORIGINAL (for source lookup):
function pSq({
    onChange: A,
    toolUseContext: q,
    filePath: K,
    edits: Y,
    editMode: z
}) {
    let _ = gi.useRef(!1),
        [w, O] = gi.useState(!1),
        $ = gi.useMemo(() => NPz().slice(0, 6), []),
        H = gi.useMemo(() => `✻ [Claude Code] ${VPz(K)} (${$}) ⧉`, [K, $]),
        j = L$1(q.options.mcpClients) && X1().diffTool === "auto" && !K.endsWith(".ipynb"),
        J = R$1(q.options.mcpClients) ?? "IDE";
    async function M() {
        if (!j) return;
        try {
            d("tengu_ext_will_show_diff", {});
            let {
                oldContent: D,
                newContent: X
            } = await EPz(K, Y, q, H);
            if (_.current) return;
            d("tengu_ext_diff_accepted", {});
            let P = kPz(K, D, X, z);
            if (P.length === 0) {
                d("tengu_ext_diff_rejected", {});
                let W = Gv(q.options.mcpClients);
                if (W) await Cs8(H, W);
                A({
                    type: "reject"
                }, {
                    file_path: K,
                    edits: Y
                });
                return
            }
            A({
                type: "accept-once"
            }, {
                file_path: K,
                edits: P
            })
        } catch (D) {
            _6(D), O(!0)
        }
    }
    return gi.useEffect(() => {
        return M(), () => {
            _.current = !0
        }
    }, []), {
        closeTabInIDE() {
            let D = Gv(q.options.mcpClients);
            if (!D) return Promise.resolve();
            return Cs8(H, D)
        },
        showingDiffInIDE: j && !w,
        ideName: J,
        hasError: w
    }
}

// READABLE (for understanding):
function IDEDiffHandler({
    onChange,          // Callback to accept/reject edits
    toolUseContext,    // Contains MCP clients, abort controller
    filePath,          // File being edited
    edits,             // Proposed edit operations
    editMode           // "single" or other modes
}) {
    // Track cleanup state (prevents race conditions)
    let cleanedUp = useRef(false);
    let [hasError, setHasError] = useState(false);

    // Generate unique tab name with short ID
    let shortId = useMemo(() => generateShortId().slice(0, 6), []);
    let tabName = useMemo(() => {
        let filename = getFilenameFromPath(filePath);
        return `✻ [Claude Code] ${filename} (${shortId}) ⧉`;
    }, [filePath, shortId]);

    // Check if IDE diff is available
    let canUseIdeDiff = (
        hasConnectedIde(toolUseContext.options.mcpClients) &&
        getSettings().diffTool === "auto" &&
        !filePath.endsWith(".ipynb")  // Notebooks don't support diff view
    );

    let ideName = getIdeName(toolUseContext.options.mcpClients) ?? "IDE";

    // Main async function: open diff and wait for user response
    async function openDiffAndWaitForUser() {
        if (!canUseIdeDiff) return;

        try {
            // Telemetry: diff shown
            telemetry("tengu_ext_will_show_diff", {});

            // BLOCKING CALL: Opens diff in IDE and waits for user interaction
            let { oldContent, newContent } = await openDiffInIde(
                filePath,
                edits,
                toolUseContext,
                tabName
            );

            // Check if component was unmounted during the wait
            if (cleanedUp.current) return;

            // Telemetry: diff accepted (user interacted)
            telemetry("tengu_ext_diff_accepted", {});

            // Recompute edits from the diff between old and new content
            // (User may have edited the content in the IDE)
            let finalEdits = recomputeEditsFromDiff(filePath, oldContent, newContent, editMode);

            if (finalEdits.length === 0) {
                // No changes - effectively rejected
                telemetry("tengu_ext_diff_rejected", {});

                // Close the diff tab
                let ideClient = findConnectedIdeClient(toolUseContext.options.mcpClients);
                if (ideClient) {
                    await closeDiffTab(tabName, ideClient);
                }

                // Notify parent of rejection
                onChange({ type: "reject" }, {
                    file_path: filePath,
                    edits: edits
                });
                return;
            }

            // Accept the (possibly user-edited) changes
            onChange({ type: "accept-once" }, {
                file_path: filePath,
                edits: finalEdits
            });

        } catch (error) {
            // Error occurred - show terminal diff instead
            logError(error);
            setHasError(true);
        }
    }

    // Effect: Run on mount, cleanup on unmount
    useEffect(() => {
        openDiffAndWaitForUser();

        // Cleanup function
        return () => {
            cleanedUp.current = true;  // Signal to async function to stop
        };
    }, []);  // Empty deps = run once on mount

    // Return values for rendering
    return {
        closeTabInIDE() {
            let ideClient = findConnectedIdeClient(toolUseContext.options.mcpClients);
            if (!ideClient) return Promise.resolve();
            return closeDiffTab(tabName, ideClient);
        },
        showingDiffInIDE: canUseIdeDiff && !hasError,
        ideName: ideName,
        hasError: hasError
    };
}

// Mapping: pSq→IDEDiffHandler, A→onChange, q→toolUseContext, K→filePath,
//          Y→edits, z→editMode, _→cleanedUp, w→hasError, O→setHasError,
//          $→shortId, H→tabName, j→canUseIdeDiff, J→ideName, M→openDiffAndWaitForUser,
//          L$1→hasConnectedIde, X1→getSettings, R$1→getIdeName, EPz→openDiffInIde,
//          kPz→recomputeEditsFromDiff, Gv→findConnectedIdeClient, Cs8→closeDiffTab
```

### Key Design Decisions

**1. Why Blocking Wait for User Response?**

The `openDiffInIde` call is intentionally blocking:
- The LLM is waiting for the result of its edit operation
- User can see the diff and make informed decision
- No background processing while user reviews

This creates a natural pause point in the LLM's operation.

**2. Why Recompute Edits After User Interaction?**

Users can edit the content in the IDE diff view:
1. Original: `function hello() { return 1; }`
2. Proposed: `function hello() { return 2; }`
3. User edits in IDE: `function hello() { return 3; }`

The `recomputeEditsFromDiff` (kPz) function:
1. Takes the user's final saved content
2. Computes the diff against original
3. Generates new edit operations reflecting user's actual changes

This ensures the file is written exactly as the user saved it.

**3. Why Track `cleanedUp.current`?**

Race condition scenario:
1. Component mounts, opens diff in IDE
2. User waits 30 seconds reviewing
3. User navigates away (component unmounts)
4. User finally clicks "Save" in IDE
5. Async callback fires, but component is gone

Without `cleanedUp` check, the callback would try to call `onChange` on an unmounted component. The ref prevents this.

**4. Why Exclude `.ipynb` Files?**

Jupyter notebooks use a special JSON format:
- IDEs have dedicated notebook editors
- Diff view doesn't render notebooks properly
- Cell-by-cell comparison is needed, not line-by-line

The code falls back to terminal diff for notebooks.

### Edit Recomputation Algorithm: `recomputeEditsFromDiff` (kPz)

**Location:** `chunks.188.mjs:942-953`

```javascript
// ============================================
// recomputeEditsFromDiff - Recompute edits from user's final content
// Location: chunks.188.mjs:942-953
// ============================================

// ORIGINAL (for source lookup):
function kPz(A, q, K, Y) {
    let z = Y === "single",
        _ = t21({
            filePath: A,
            oldContent: q,
            newContent: K,
            singleHunk: z
        });
    if (_.length === 0) return [];
    if (z && _.length > 1) _6(Error(`Unexpected number of hunks: ${_.length}. Expected 1 hunk.`));
    return gf7(_)
}

// READABLE (for understanding):
function recomputeEditsFromDiff(filePath, oldContent, newContent, editMode) {
    // Check if single-hunk mode (for simple string replacements)
    let isSingleHunk = editMode === "single";

    // Compute unified diff between old and new content
    let hunks = computeDiffHunks({
        filePath: filePath,
        oldContent: oldContent,
        newContent: newContent,
        singleHunk: isSingleHunk  // Forces single hunk for simple edits
    });

    // No changes = rejected or identical content
    if (hunks.length === 0) return [];

    // In single-hunk mode, there should be exactly one hunk
    if (isSingleHunk && hunks.length > 1) {
        logError(new Error(`Unexpected number of hunks: ${hunks.length}. Expected 1 hunk.`));
    }

    // Convert hunks to edit operations
    return hunksToEdits(hunks);
}

// Mapping: kPz→recomputeEditsFromDiff, A→filePath, q→oldContent, K→newContent,
//          Y→editMode, z→isSingleHunk, _→hunks, t21→computeDiffHunks, gf7→hunksToEdits
```

**Why recompute instead of trust user content:**
1. Edit operations need specific structure (old_string/new_string)
2. Multiple edits might be collapsed or expanded by user
3. Line numbers in original edits may be invalid after user edits
4. Diff algorithm produces canonical representation

---

## Related Documents

- [connection_lifecycle.md](./connection_lifecycle.md) - IDE connection management
- [diagnostics_manager.md](./diagnostics_manager.md) - Diagnostic baseline and delta
- [overview.md](./overview.md) - High-level IDE architecture
- [../06_mcp/mcp_implementation.md](../06_mcp/mcp_implementation.md) - MCP client implementation