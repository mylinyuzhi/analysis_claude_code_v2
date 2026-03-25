# IDE Integration Cross-Module Integration (Claude Code 2.1.76)

## Overview

The IDE integration system connects Claude Code to development environments (VS Code, JetBrains, Cursor, etc.) through MCP. This document maps all integration points, showing how IDE connectivity interacts with system reminders, LSP, code indexing, and other features.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - IDE Integration section
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - MCP Protocol

Key symbols in this document:
- `DiagnosticsManager` (Gb) - Manages IDE LSP diagnostics baseline/delta
- `Nl` - Singleton instance of DiagnosticsManager
- `findConnectedIdeClient` (Gv) - Locates connected IDE MCP client
- `openDiffInIde` (EPz) - Opens diff preview in IDE
- `hasConnectedIde` (L$1) - Returns true if IDE is connected
- `getIdeName` (R$1) - Returns display name of connected IDE
- `getIdeConnectionStatus` (LV6) - React hook for connection state
- `IdeSelectionIndicator` (dIq) - Status bar selection badge
- `IDEDiffHandler` (pSq) - React component for diff routing

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    IDE Integration Points                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  04_system_reminder (System Prompts)                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • IDE selection context injected into system prompts                │    │
│  │ • Diagnostics attachments from IDE LSP                              │    │
│  │ • "User has selected N lines in file.ts" context                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  06_mcp (MCP Protocol)                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • IDE connects as MCP server, Claude Code as client                 │    │
│  │ • Tools: openDiff, getDiagnostics, openFile, navigateTo            │    │
│  │ • Notifications: selection_changed, diagnostics_update             │    │
│  │ • Permission mode synced via setPermissionMode tool                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  27_lsp_integration (Language Server Protocol)                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • IDE provides LSP diagnostics via getDiagnostics tool              │    │
│  │ • DiagnosticsManager computes baseline/delta                        │    │
│  │ • Shared file URI normalization                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  14_code_indexing (Code Search)                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • IDE project context available to search                           │    │
│  │ • File open state tracked for context                              │    │
│  │ • Selection provides symbol context                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  05_tools (Tool System)                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Edit tool uses IDEDiffHandler for preview                        │    │
│  │ • Fallback to terminal diff when IDE disconnected                  │    │
│  │ • openDiff tool waits for user response (accept/reject)            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  11_hooks (Hook System)                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • beforeFileEdited hook captures diagnostic baseline                │    │
│  │ • Hooks can access IDE selection context                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  02_ui (User Interface)                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • IdeSelectionIndicator shows selection in status bar              │    │
│  │ • IDE onboarding dialog for first-time setup                       │    │
│  │ • Status notifications for connection state                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

---

## 1. Integration with 04_system_reminder

### Selection Context Injection

**What it does:** When the user has text selected in the IDE, that context is injected into system reminders so the model understands what the user is working on.

**How it works:**

```javascript
// ============================================
// getIdeSelectionAttachment - Creates selection attachment for system reminder
// Location: chunks.147.mjs (approx)
// ============================================

// READABLE (for understanding):
function getIdeSelectionAttachment(ideSelection) {
    // Guard: No selection or empty selection
    if (!ideSelection?.text || ideSelection.lineCount === 0) {
        return null;
    }

    // Build human-readable context string
    let context = `User has selected ${ideSelection.lineCount} lines`;

    if (ideSelection.filePath) {
        let filename = path.basename(ideSelection.filePath);
        context += ` in ${filename}`;

        if (ideSelection.lineStart !== undefined) {
            // Convert 0-based to 1-based for user-facing display
            context += ` starting at line ${ideSelection.lineStart + 1}`;
        }
    }

    context += `:\n\n${ideSelection.text}`;

    return {
        type: "ide_selection",
        content: context,
        priority: "high"  // High priority = always included when available
    };
}
```

**Integration point:**

The selection attachment is gathered during system prompt building:

```javascript
// In system prompt builder
let attachments = [];

// Check for IDE selection
let selectionAttachment = getIdeSelectionAttachment(state.ideSelection);
if (selectionAttachment) {
    attachments.push(selectionAttachment);
}

// Attachments are formatted and injected into the model context
```

### Selection Notification Flow (End-to-End)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Selection Context Injection Flow                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  IDE Editor (VS Code, JetBrains, etc.)                                      │
│       │                                                                      │
│       │  User selects text in active editor                                 │
│       │                                                                      │
│       ▼                                                                      │
│  IDE Extension (MCP Server)                                                  │
│       │                                                                      │
│       │  MCP notification: selection_changed                                │
│       │  Payload: { lineCount, lineStart, text, filePath }                  │
│       │                                                                      │
│       ▼                                                                      │
│  Claude Code MCP Client                                                      │
│       │                                                                      │
│       │  useIdeSelection hook (fVq) receives notification                   │
│       │  Validates against selectionChangedSchema                           │
│       │                                                                      │
│       ▼                                                                      │
│  REPL State (K6 = ideSelection)                                             │
│       │                                                                      │
│       ├─────────────────────────────────────────────┐                        │
│       │                                              │                        │
│       ▼                                              ▼                        │
│  IdeSelectionIndicator (dIq)              System Prompt Builder              │
│       │                                          │                           │
│       │  Renders "⧉ N lines selected"            │                           │
│       │  in status bar                           ▼                           │
│       │                               getIdeSelectionAttachment()            │
│       │                                          │                           │
│       │                                          ▼                           │
│       │                               Attachment pushed to context           │
│       │                                          │                           │
│       │                                          ▼                           │
│       │                               "User has selected 3 lines             │
│       │                                in file.ts starting at line 15:       │
│       │                                <selected code>"                      │
│       │                                          │                           │
│       ▼                                          ▼                           │
│  User sees visual feedback            LLM receives enriched context          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Diagnostics Attachments

**What it does:** IDE LSP diagnostics are injected as system reminders when Edit tool is used.

```javascript
// ============================================
// getIdeDiagnosticsAttachment - Creates diagnostic attachment for system reminder
// Location: chunks.147.mjs:789-798
// ============================================

// ORIGINAL (for source lookup):
async function getIdeDiagnosticsAttachment(A) {
    if (!A.options.tools.some((q) => q.name === "Edit")) return [];
    let q = await Nl.getNewDiagnostics();
    if (q.length === 0) return [];
    return [{
        type: "diagnostics",
        files: q,
        isNew: !0
    }]
}

// READABLE (for understanding):
async function getIdeDiagnosticsAttachment(toolUseContext) {
    // Only include if Edit tool is being used
    if (!toolUseContext.options.tools.some(t => t.name === "Edit")) {
        return [];
    }

    let newDiagnostics = await diagnosticsManager.getNewDiagnostics();
    if (newDiagnostics.length === 0) {
        return [];
    }

    return [{
        type: "diagnostics",
        files: newDiagnostics,
        isNew: true  // Mark as new (delta from baseline)
    }];
}

// Mapping: Nl→diagnosticsManager, A→toolUseContext, q→newDiagnostics
```

### Formatted Diagnostics Output

```
<new-diagnostics>The following new diagnostic issues were detected:

main.ts:
  ✗ [Line 15:10] Cannot find name 'undefinedVar' [TS2304] (typescript)
  ⚠ [Line 23:5] Unused variable 'temp' [no-unused-vars] (eslint)

utils.ts:
  ✗ [Line 8:1] Expected ';' but found '}' [JS1005] (javascript)
</new-diagnostics>
```

### Diagnostics Flow (End-to-End)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Diagnostics Integration Flow                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Edit Tool Invoked                                                          │
│       │                                                                      │
│       │  User asks Claude to edit a file                                    │
│       │                                                                      │
│       ▼                                                                      │
│  beforeFileEdited Hook Fires                                                │
│       │                                                                      │
│       │  DiagnosticsManager.beforeFileEdited(filePath)                      │
│       │       │                                                              │
│       │       ├─ Call IDE: getDiagnostics({ uri: "file://path" })           │
│       │       │                                                              │
│       │       └─ Store result in baseline Map                               │
│       │                                                                      │
│       ▼                                                                      │
│  Edit Applied to File                                                       │
│       │                                                                      │
│       │  File content changes                                               │
│       │  IDE's LSP server re-analyzes                                       │
│       │                                                                      │
│       ▼                                                                      │
│  getNewDiagnostics Called                                                   │
│       │                                                                      │
│       │  DiagnosticsManager.getNewDiagnostics()                             │
│       │       │                                                              │
│       │       ├─ Call IDE: getDiagnostics({}) (all files)                   │
│       │       │                                                              │
│       │       ├─ Filter to files with baseline                              │
│       │       │                                                              │
│       │       └─ Compute delta: new issues not in baseline                  │
│       │                                                                      │
│       ▼                                                                      │
│  System Reminder Attachment                                                 │
│       │                                                                      │
│       │  If delta.length > 0:                                               │
│       │       │                                                              │
│       │       └─ getIdeDiagnosticsAttachment() creates attachment           │
│       │              │                                                       │
│       │              └─ Formatted as <new-diagnostics> XML block            │
│       │                                                                      │
│       ▼                                                                      │
│  LLM Receives Context                                                       │
│       │                                                                      │
│       │  Model sees:                                                         │
│       │  "The following NEW diagnostic issues were detected after           │
│       │   your edit. You may want to address them."                         │
│       │                                                                      │
│       ▼                                                                      │
│  Model Can Take Action                                                      │
│                                                                              │
│       └─ Model may propose additional edits to fix the new issues           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why Baseline/Delta Approach

**Problem**: IDE projects often have hundreds of pre-existing diagnostics. If Claude sees all of them, it gets distracted trying to fix issues that existed before.

**Solution**: Track only NEW diagnostics since edit.

```javascript
// Before edit (baseline):
// main.ts has 15 diagnostics (pre-existing)

// After edit:
// main.ts has 17 diagnostics

// Delta: 2 new diagnostics introduced by the edit
// Only these 2 are shown to the model
```

**Trade-offs:**
- **Pro**: Model focuses on actionable issues it may have caused
- **Pro**: Reduces token usage (only delta shown)
- **Con**: Model won't see pre-existing issues that might be relevant
- **Con**: Requires IDE to be connected before edit starts

---

## 2. Integration with 06_mcp

### IDE as MCP Server

**What it does:** IDE extensions start an MCP server, and Claude Code connects as a client.

**Connection flow:**
```
IDE Extension starts
    │
    ├─ Detect Claude Code process
    │
    ├─ Start MCP server on localhost:PORT
    │
    └─ Expose tools and notifications
           │
           ▼
Claude Code discovers IDE
    │
    ├─ Read MCP config for "ide" server
    │
    ├─ Connect via SSE or WebSocket
    │
    └─ Subscribe to notifications
           │
           ▼
sendIdeConnectedNotification()
    │
    └─ IDE shows spark icon in status bar
```

### MCP Tools Exposed by IDE

| Tool | Purpose | Parameters |
|------|---------|------------|
| `openDiff` | Show diff preview | `{ filePath, oldContent, newContent, tabName }` |
| `closeDiff` | Close diff tab | `{ tabName }` |
| `getDiagnostics` | Get LSP diagnostics | `{ uri? }` |
| `openFile` | Open file in editor | `{ filePath, line?, column? }` |
| `navigateTo` | Navigate to location | `{ filePath, line, column }` |
| `setPermissionMode` | Update permission mode | `{ mode }` |
| `getOpenEditors` | List open files | `{}` |

### MCP Notifications from IDE

| Notification | Trigger | Payload |
|--------------|---------|---------|
| `selection_changed` | User selects text | `{ lineCount, lineStart, text, filePath }` |
| `diagnostics_update` | LSP diagnostics change | `{ uri, diagnostics }` |
| `editor_focus` | User switches files | `{ filePath }` |

### useIdeSelection Hook

```javascript
// ============================================
// useIdeSelection - Subscribe to IDE selection changes
// Location: chunks.186.mjs:410
// ============================================

// ORIGINAL (for source lookup):
function fVq(A, q) {
    let K = A?.find((Y) => Y.name === "ide");
    if (!K) return;
    let Y = K.subscribeToNotification("selection_changed", (z) => {
        let w = oMz.parse(z.params);
        q(w)
    });
    return () => Y?.unsubscribe()
}

// READABLE (for understanding):
function useIdeSelection(mcpClients, onSelectionChange) {
    // Find IDE client from MCP clients list
    let ideClient = mcpClients?.find(client => client.name === "ide");
    if (!ideClient) return;  // IDE not configured

    // Subscribe to selection_changed notification
    let subscription = ideClient.subscribeToNotification("selection_changed", (notification) => {
        let selection = selectionChangedSchema.parse(notification.params);
        onSelectionChange(selection);
    });

    // Return cleanup function
    return () => subscription?.unsubscribe();
}

// Mapping: fVq→useIdeSelection, A→mcpClients, q→onSelectionChange, K→ideClient, oMz→selectionChangedSchema
```

---

## 3. Integration with 27_lsp_integration

### Shared Diagnostics Infrastructure

**What it does:** IDE-provided diagnostics complement or override LSP diagnostics from Claude Code's internal LSP client.

**Key distinction:**
- IDE diagnostics come from the IDE's language server
- LSP diagnostics come from Claude Code's internal LSP client
- Both flow through DiagnosticsManager for baseline/delta computation

### DiagnosticsManager Algorithm

```javascript
// ============================================
// DiagnosticsManager.getNewDiagnostics - Compute diagnostic delta
// Location: chunks.170.mjs:806-839
// ============================================

// ORIGINAL (for source lookup):
async getNewDiagnostics() {
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return [];
    let A = [];
    try {
        let z = await pC("getDiagnostics", {}, this.mcpClient);
        A = this.parseDiagnosticResult(z)
    } catch (z) {
        return []
    }
    let q = A.filter((z) => this.baseline.has(this.normalizeFileUri(z.uri))).filter((z) => z.uri.startsWith("file://")),
        K = new Map;
    // ... filter and compute delta
    let Y = [];
    for (let z of q) {
        let _ = this.normalizeFileUri(z.uri),
            w = this.baseline.get(_) || [],
            H = $.diagnostics.filter((j) => !w.some((J) => this.areDiagnosticsEqual(j, J)));
        if (H.length > 0) Y.push({
            uri: z.uri,
            diagnostics: H
        });
        this.baseline.set(_, $.diagnostics)
    }
    return Y
}

// READABLE (for understanding):
async getNewDiagnostics() {
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") {
        return [];
    }

    // Fetch current diagnostics from IDE
    let allDiagnostics = [];
    try {
        let result = await callMcpTool("getDiagnostics", {}, this.mcpClient);
        allDiagnostics = this.parseDiagnosticResult(result);
    } catch (error) {
        return [];
    }

    // Filter to files that have a baseline (i.e., were edited)
    let relevantDiagnostics = allDiagnostics
        .filter(d => this.baseline.has(this.normalizeFileUri(d.uri)))
        .filter(d => d.uri.startsWith("file://"));

    // Compute delta: new diagnostics not in baseline
    let newDiagnostics = [];
    for (let fileDiag of relevantDiagnostics) {
        let normalizedUri = this.normalizeFileUri(fileDiag.uri);
        let baselineDiags = this.baseline.get(normalizedUri) || [];

        // Filter out diagnostics that were already present
        let deltaDiags = fileDiag.diagnostics.filter(d =>
            !baselineDiags.some(b => this.areDiagnosticsEqual(d, b))
        );

        if (deltaDiags.length > 0) {
            newDiagnostics.push({
                uri: fileDiag.uri,
                diagnostics: deltaDiags
            });
        }

        // Update baseline for next comparison
        this.baseline.set(normalizedUri, fileDiag.diagnostics);
    }

    return newDiagnostics;
}

// Mapping: pC→callMcpTool
```

### Baseline Capture Before Edit

```javascript
// ============================================
// DiagnosticsManager.beforeFileEdited - Capture baseline before edit
// Location: chunks.170.mjs:785-805
// ============================================

// READABLE (for understanding):
async beforeFileEdited(filePath) {
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") {
        return;
    }

    try {
        // Fetch diagnostics for the specific file
        let result = await callMcpTool("getDiagnostics", {
            uri: `file://${filePath}`
        }, this.mcpClient);

        let diagnostic = this.parseDiagnosticResult(result)[0];

        if (diagnostic) {
            // Verify file path matches (prevent mismatch)
            let normalizedPath = this.normalizeFileUri(filePath);
            let normalizedUri = this.normalizeFileUri(diagnostic.uri);
            if (normalizedPath !== normalizedUri) {
                logError(`Diagnostics path mismatch: expected ${filePath}, got ${diagnostic.uri}`);
                return;
            }

            // Store baseline for delta computation
            this.baseline.set(normalizedPath, diagnostic.diagnostics);
        } else {
            // No diagnostics - store empty baseline
            this.baseline.set(this.normalizeFileUri(filePath), []);
        }
    } catch (error) {
        // Silently ignore - file may not be tracked
    }
}
```

---

## 4. Integration with 14_code_indexing

### Project Context from IDE

**What it does:** IDE provides additional context about the project structure and open files.

**Context available:**
- Currently open files
- Active file and cursor position
- Selection range
- Project/workspace root

### Selection-Enhanced Search

When the user has a symbol selected, code search can prioritize results:

```javascript
// Context-aware search enhancement
function enhanceSearchWithContext(query, ideSelection) {
    if (ideSelection?.filePath) {
        // Add file context to search
        return {
            query,
            contextFile: ideSelection.filePath,
            selectedText: ideSelection.text
        };
    }
    return { query };
}
```

---

## 5. Integration with 05_tools

### IDEDiffHandler

**What it does:** Routes Edit tool diffs to IDE when connected, falls back to terminal otherwise.

```javascript
// ============================================
// IDEDiffHandler - Routes diff display to IDE or terminal
// Location: chunks.180.mjs:3-63
// ============================================

// READABLE (for understanding):
function IDEDiffHandler({ onChange, toolUseContext, filePath, edits }) {
    let [hasError, setHasError] = useState(false);
    let tabId = useMemo(() => generateRandomId().slice(0, 6), []);
    let tabName = `✻ [Claude Code] ${basename(filePath)} (${tabId}) ⧉`;

    // Decision: use IDE diff or terminal diff?
    let useIdeDiff = hasConnectedIde(toolUseContext.options.mcpClients)
        && getSettings().diffTool === "auto"
        && !filePath.endsWith(".ipynb");  // Notebooks need terminal diff

    async function showDiffAndHandleResponse() {
        if (!useIdeDiff) return;  // Let terminal handle it

        try {
            let { oldContent, newContent } = await openDiffInIde(
                filePath, edits, toolUseContext, tabName
            );

            // User response determines action
            let finalEdits = computeDiffEdits(filePath, oldContent, newContent);

            if (finalEdits.length === 0) {
                // User rejected the diff
                onChange({ type: "reject" }, { file_path: filePath, edits });
            } else {
                // User accepted (possibly with modifications)
                onChange({ type: "accept-once" }, { file_path: filePath, edits: finalEdits });
            }
        } catch (error) {
            setHasError(true);  // Fall back to terminal diff
        }
    }

    useEffect(() => {
        showDiffAndHandleResponse();
    }, []);

    return {
        showingDiffInIDE: useIdeDiff && !hasError,
        hasError
    };
}
```

### openDiffInIde Implementation

```javascript
// ============================================
// openDiffInIde - Opens diff preview in IDE
// Location: chunks.145.mjs (approx)
// ============================================

// READABLE (for understanding):
async function openDiffInIde(filePath, edits, toolUseContext, tabName) {
    let ideClient = findConnectedIdeClient(toolUseContext.options.mcpClients);
    if (!ideClient) {
        throw new Error("IDE not connected");
    }

    // Read current file content
    let oldContent = await fs.readFile(filePath, "utf-8");

    // Apply edits to get proposed content
    let newContent = applyEdits(oldContent, edits);

    // Call IDE MCP tool to show diff
    let response = await ideClient.callTool("openDiff", {
        filePath,
        oldContent,
        newContent,
        tabName
    });

    // Wait for user response
    // Response types: FILE_SAVED, TAB_CLOSED, DIFF_REJECTED
    return response;
}

// Mapping: aJz→openDiffInIde
```

---

## 6. Integration with 11_hooks

### beforeFileEdited Hook

**What it does:** Captures diagnostic baseline before Edit tool modifies a file.

**Hook integration:**
```javascript
// In Edit tool handler
async function handleEdit(editParams, toolUseContext) {
    // Fire beforeFileEdited hook
    await diagnosticsManager.beforeFileEdited(editParams.file_path);

    // Apply the edit
    await applyEdit(editParams);

    // Get new diagnostics (delta from baseline)
    let newDiags = await diagnosticsManager.getNewDiagnostics();

    // Include in tool result
    if (newDiags.length > 0) {
        return {
            success: true,
            newDiagnostics: DiagnosticsManager.formatDiagnosticsSummary(newDiags)
        };
    }
}
```

---

## 7. Integration with 02_ui

### IdeSelectionIndicator Component

**What it does:** Shows the current IDE selection context in the status bar.

```javascript
// ============================================
// IdeSelectionIndicator - Status bar selection badge
// Location: chunks.182.mjs:1514-1545
// ============================================

// ORIGINAL (for source lookup):
function dIq(A) {
    let { ideSelection: q, mcpClients: K } = A,
        Y = LV6(K),
        z = Y === "connected" && (q?.filePath || q?.text && q.lineCount > 0);
    if (Y === null || !z || !q) return null;
    if (q.text && q.lineCount > 0) {
        let H = q.lineCount === 1 ? "line" : "lines";
        return React.createElement(Text, { color: "ide" },
            "⧉ ", q.lineCount, " ", H, " selected");
    }
    if (q.filePath) {
        return React.createElement(Text, { color: "ide" },
            "⧉ In ", basename(q.filePath));
    }
}

// READABLE (for understanding):
function IdeSelectionIndicator({ ideSelection, mcpClients }) {
    let ideStatus = getIdeConnectionStatus(mcpClients);

    let hasContent = ideStatus === "connected" &&
        (ideSelection?.filePath || (ideSelection?.text && ideSelection.lineCount > 0));

    if (ideStatus === null || !hasContent || !ideSelection) {
        return null;  // Nothing to show
    }

    // Priority 1: Text selected
    if (ideSelection.text && ideSelection.lineCount > 0) {
        let unit = ideSelection.lineCount === 1 ? "line" : "lines";
        return <Text color="ide">⧉ {ideSelection.lineCount} {unit} selected</Text>;
    }

    // Priority 2: Cursor in file
    if (ideSelection.filePath) {
        return <Text color="ide">⧉ In {basename(ideSelection.filePath)}</Text>;
    }
}

// Mapping: dIq→IdeSelectionIndicator, LV6→getIdeConnectionStatus
```

### getIdeConnectionStatus Hook

```javascript
// ============================================
// getIdeConnectionStatus - Memoized IDE connection state
// Location: chunks.190.mjs:2902-2924
// ============================================

// ORIGINAL (for source lookup):
function LV6(A) {
    return useMemo(() => {
        let q = A?.find((K) => K.name === "ide");
        if (!q) return null;
        return q.type === "connected" ? "connected" : "disconnected"
    }, [A])
}

// READABLE (for understanding):
function getIdeConnectionStatus(mcpClients) {
    return useMemo(() => {
        let ideClient = mcpClients?.find(c => c.name === "ide");
        if (!ideClient) return null;  // IDE not configured

        return ideClient.type === "connected" ? "connected" : "disconnected";
    }, [mcpClients]);
}

// Mapping: LV6→getIdeConnectionStatus, A→mcpClients, q→ideClient
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Complete IDE Integration Flow                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  IDE Extension (VS Code / JetBrains / etc.)                                 │
│       │                                                                      │
│       ├─ User selects text                                                  │
│       │      │                                                               │
│       │      └─ selection_changed notification → Claude Code               │
│       │                                                                      │
│       ├─ User edits file (LSP updates diagnostics)                         │
│       │      │                                                               │
│       │      └─ diagnostics_update notification → Claude Code              │
│       │                                                                      │
│       └─ MCP server listens on localhost:PORT                               │
│              │                                                               │
│              └─ Claude Code connects as client                              │
│       │                                                                      │
│       ▼                                                                      │
│  Claude Code (MCP Client)                                                   │
│       │                                                                      │
│       ├─ useIdeSelection() updates ideSelection state                       │
│       │      │                                                               │
│       │      ├─ IdeSelectionIndicator renders in status bar                │
│       │      └─ System prompt includes selection context                   │
│       │                                                                      │
│       ├─ DiagnosticsManager (Nl) manages baseline/delta                    │
│       │      │                                                               │
│       │      ├─ beforeFileEdited() captures baseline                       │
│       │      └─ getNewDiagnostics() computes delta                         │
│       │                                                                      │
│       └─ Edit tool uses IDEDiffHandler                                     │
│              │                                                               │
│              ├─ IDE connected? → openDiff in IDE                           │
│              │      │                                                        │
│              │      ├─ User accepts → Apply edit                           │
│              │      └─ User rejects → Cancel edit                          │
│              │                                                               │
│              └─ IDE disconnected? → Terminal diff                          │
│       │                                                                      │
│       ▼                                                                      │
│  System Reminder (injected context)                                         │
│       │                                                                      │
│       ├─ Selection: "User has selected N lines in file.ts"                  │
│       └─ Diagnostics: New issues detected after edit                        │
│       │                                                                      │
│       ▼                                                                      │
│  LLM receives enriched context                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Integration Points Summary

| Module | Integration | Key Symbol |
|--------|-------------|------------|
| 04_system_reminder | Selection/diagnostics injection | getIdeSelectionAttachment |
| 06_mcp | IDE as MCP server | Gv (findConnectedIdeClient), fVq (useIdeSelection) |
| 27_lsp_integration | Shared diagnostics | Gb (DiagnosticsManager), Nl |
| 14_code_indexing | Project context | Selection-enhanced search |
| 05_tools | Diff routing | pSq (IDEDiffHandler), EPz (openDiffInIde) |
| 11_hooks | beforeFileEdited | DiagnosticsManager.beforeFileEdited |
| 02_ui | Status indicators | dIq (IdeSelectionIndicator), LV6 (getIdeConnectionStatus) |

---

## 8. Unified Cross-Module Integration: MCP ↔ Sandbox ↔ IDE

### The Trinity: IDE as MCP Client, Protected by Sandbox

The IDE integration module operates as an MCP client that provides context to the LLM while respecting sandbox boundaries.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    IDE-CENTRIC INTEGRATION VIEW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  IDE Extension (MCP Server)              Claude Code (MCP Client)            │
│  ┌──────────────────────────┐           ┌──────────────────────────┐        │
│  │ • LSP diagnostics        │◄────────► │ • findConnectedIdeClient │        │
│  │ • Selection tracking     │    MCP    │ • DiagnosticsManager     │        │
│  │ • File open/close        │           │ • useIdeSelection hook   │        │
│  │ • Diff preview UI        │           │ • IDEDiffHandler         │        │
│  └──────────────────────────┘           └──────────────────────────┘        │
│                                                                              │
│  MCP Module Interaction:                                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ • IDE registered as MCP client with name === "ide"                   │   │
│  │ • Tools: openDiff, getDiagnostics, openFile, navigateTo, etc.        │   │
│  │ • Notifications: selection_changed, diagnostics_update               │   │
│  │ • Connection: SSE on localhost (exempt from network sandbox)         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Sandbox Module Interaction:                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ • Selection attachment: isSandboxBlocked(filePath) → skip           │   │
│  │ • Diagnostics attachment: filtered by sandbox read rules            │   │
│  │ • IDE MCP connection: localhost, exempt from network restrictions   │   │
│  │ • Edit tool: runs sandboxed, IDE preview is exempt                  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  System Reminder Integration:                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ • getIdeSelectionAttachment (kuY): "User has selected N lines..."   │   │
│  │ • getDiagnosticsAttachment (cuY): "New diagnostics detected..."      │   │
│  │ • getIdeOpenedFileAttachment (LuY): "User opened file..."           │   │
│  │ • All filtered by sandbox permissions before injection              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### End-to-End Context Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  USER ACTION → LLM CONTEXT PIPELINE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. User selects code in IDE                                                 │
│     │                                                                        │
│     ▼                                                                        │
│  IDE Extension sends selection_changed notification                         │
│     │  { lineCount: 15, lineStart: 42, text: "...", filePath: "main.ts" }   │
│     ▼                                                                        │
│  Claude Code MCP client receives via useIdeSelection hook                   │
│     │                                                                        │
│     ▼                                                                        │
│  State updated: ideSelection                                                │
│     │                                                                        │
│     ├─► IdeSelectionIndicator renders in status bar                         │
│     │        "⧉ 15 lines selected"                                          │
│     │                                                                        │
│     └─► Next agent turn: getIdeSelectionAttachment called                   │
│              │                                                               │
│              ├─► detectIdeName(mcpClients) → "VS Code"                      │
│              ├─► isSandboxBlocked(filePath) → false (allowed)               │
│              │                                                               │
│              └─► Return attachment:                                          │
│                  { type: "selected_lines_in_ide",                            │
│                    ideName: "VS Code",                                       │
│                    lineStart: 42, lineEnd: 56,                               │
│                    filename: "main.ts",                                      │
│                    content: "..." }                                          │
│                     │                                                        │
│                     ▼                                                        │
│  Normalized to system-reminder message:                                     │
│  "<system-reminder>User has selected 15 lines in VS Code                    │
│   in main.ts starting at line 42: ...</system-reminder>"                    │
│                     │                                                        │
│                     ▼                                                        │
│  LLM receives enriched context and can reference the selection              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Sandbox Filtering in Attachments

Both IDE selection and MCP resources attachments check sandbox permissions:

```javascript
// In getIdeSelectionAttachment (kuY):
let appState = await sessionContext.getAppState();
if (isSandboxBlocked(ideContext.filePath, appState.toolPermissionContext)) {
    return [];  // Silently skip sandboxed files
}

// In getMcpResourcesAttachment (SuY):
// Similar check for @server:uri mentions that reference file paths
```

**Why this matters:**
- Prevents leaking sandboxed file contents to LLM
- Maintains security boundary even in context injection
- Silent failure (empty array) avoids revealing blocked paths

### DiagnosticsManager Integration Points

The DiagnosticsManager (Gb) sits at the intersection of IDE, MCP, and LSP:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DIAGNOSTICSMANAGER FLOW                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Before Edit (Edit tool calls beforeFileEdited hook)                        │
│     │                                                                        │
│     ▼                                                                        │
│  DiagnosticsManager.beforeFileEdited(filePath)                              │
│     │                                                                        │
│     ├─► findConnectedIdeClient(mcpClients) → ideClient                      │
│     │                                                                        │
│     └─► callMcpTool("getDiagnostics", { uri: "file://..." })                │
│              │                                                               │
│              ▼                                                               │
│          Store in baseline Map<filePath, Diagnostic[]>                       │
│                                                                              │
│  After Edit (getNewDiagnostics called)                                       │
│     │                                                                        │
│     ▼                                                                        │
│  DiagnosticsManager.getNewDiagnostics()                                      │
│     │                                                                        │
│     ├─► callMcpTool("getDiagnostics", {}) → all current diagnostics         │
│     │                                                                        │
│     ├─► Filter to files with baseline                                       │
│     │                                                                        │
│     └─► Compute delta: diagnostics not in baseline                          │
│              │                                                               │
│              ▼                                                               │
│          Return new diagnostics only                                         │
│              │                                                               │
│              ▼                                                               │
│          diagnostics attachment (cuY) created                               │
│              │                                                               │
│              ▼                                                               │
│          "<system-reminder>New diagnostics detected: ...</system-reminder>" │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Related Documents

- [overview.md](./overview.md) - IDE integration architecture
- [connection_lifecycle.md](./connection_lifecycle.md) - Connection management
- [ide_tools.md](./ide_tools.md) - MCP tools exposed by IDE
- [diagnostics_manager.md](./diagnostics_manager.md) - Diagnostics infrastructure
- [ui_linkage.md](./ui_linkage.md) - UI components
- [../06_mcp/cross_module_integration.md](../06_mcp/cross_module_integration.md) - MCP integration
- [../18_sandbox/cross_module_integration.md](../18_sandbox/cross_module_integration.md) - Sandbox integration