# File System Tool Integration

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

## Overview

This document covers cross-cutting concerns between file system operations and other modules:
- Tool read-only classification
- Plan mode integration
- Permission system
- LSP server integration
- File history
- Hook system
- Telemetry

---

## 1. Tool Read-Only Classification

### isReadOnly() Method

Each file-related tool implements `isReadOnly()` to indicate whether it modifies files:

```javascript
// ============================================
// Tool isReadOnly methods
// Location: various chunks
// ============================================

// Read Tool (chunks.86.mjs:588)
isReadOnly() { return !0 }  // true - read-only

// Write Tool (chunks.115.mjs:1294)
isReadOnly() { return !1 }  // false - modifies files

// Edit Tool (chunks.115.mjs:799)
isReadOnly() { return !1 }  // false - modifies files

// Glob Tool (chunks.119.mjs:1272)
isReadOnly() { return !0 }  // true - read-only

// Grep Tool (chunks.119.mjs:1502)
isReadOnly() { return !0 }  // true - read-only
```

### Tool Groups (XG9)

Tools are organized into groups for permission handling:

```javascript
// ============================================
// getToolGroups - Tool grouping configuration
// Location: chunks.144.mjs:1259-1281
// ============================================

// ORIGINAL (for source lookup):
XG9 = () => ({
  READ_ONLY: {
    name: "Read-only tools",
    toolNames: new Set([as.name, Tc.name, V$.name, v5.name, hF.name, vD.name,
                        XK1.name, ZK1.name, JK1.name, Ud.name, qd.name])
  },
  EDIT: {
    name: "Edit tools",
    toolNames: new Set([J$.name, X$.name, qf.name])
  },
  EXECUTION: {
    name: "Execution tools",
    toolNames: new Set([o2.name, void 0].filter(Boolean))
  },
  MCP: {
    name: "MCP tools",
    toolNames: new Set,
    isMcp: !0
  },
  OTHER: {
    name: "Other tools",
    toolNames: new Set
  }
})

// READABLE (for understanding):
getToolGroups = () => ({
  READ_ONLY: {
    name: "Read-only tools",
    toolNames: new Set([
      BashTool.name,           // as - Bash (read-only mode)
      GitTool.name,            // Tc
      ReadTool.name,           // V$
      WebFetchTool.name,       // v5
      FetchTool.name,          // hF
      WebSearchTool.name,      // vD
      GlobTool.name,           // XK1
      GrepTool.name,           // ZK1
      LSPTool.name,            // JK1
      TaskOutputTool.name,     // Ud
      ReadMcpResourceTool.name // qd
    ])
  },
  EDIT: {
    name: "Edit tools",
    toolNames: new Set([
      WriteTool.name,          // J$
      EditTool.name,           // X$
      NotebookEditTool.name    // qf
    ])
  },
  EXECUTION: {
    name: "Execution tools",
    toolNames: new Set([
      BashExecuteTool.name     // o2 - Bash (execution mode)
    ].filter(Boolean))
  },
  MCP: {
    name: "MCP tools",
    toolNames: new Set(),      // Populated dynamically
    isMcp: true
  },
  OTHER: {
    name: "Other tools",
    toolNames: new Set()       // Remainder
  }
})

// Mapping: XG9→getToolGroups, as→BashTool, V$→ReadTool, J$→WriteTool,
// X$→EditTool, qf→NotebookEditTool, XK1→GlobTool, ZK1→GrepTool
```

### Tool Group Summary

| Group | Name | Tools |
|-------|------|-------|
| READ_ONLY | "Read-only tools" | Bash*, Git, Read, WebFetch, Fetch, WebSearch, Glob, Grep, LSP, TaskOutput, ReadMcpResource |
| EDIT | "Edit tools" | Write, Edit, NotebookEdit |
| EXECUTION | "Execution tools" | Bash (execute mode) |
| MCP | "MCP tools" | (dynamically populated) |
| OTHER | "Other tools" | (remainder) |

*Bash in READ_ONLY is the read-only mode variant

---

## 2. Plan Mode Integration

### UI Label Determination

The `isReadOnly()` method determines UI labels in plan mode:

```javascript
// ============================================
// renderFileOperationUI - File operation UI with plan mode awareness
// Location: chunks.150.mjs:1987-2023
// ============================================

// ORIGINAL (for source lookup):
function TD9({ toolUseConfirm: A, onDone: Q, onReject: B, verbose: G, toolUseContext: Z }) {
  let [Y] = oB(),
      J = DN7(A),
      X = A.tool.userFacingName(A.input),
      I = A.tool.isReadOnly(A.input),  // Check if read-only
      W = `${I?"Read":"Edit"} file`;    // Dynamic title

  if (!J) return puA.default.createElement(d$1, {...});

  let V = puA.default.createElement(T, {...});

  return puA.default.createElement(Ih, {
    toolUseConfirm: A,
    toolUseContext: Z,
    onDone: Q,
    onReject: B,
    title: W,                           // "Read file" or "Edit file"
    content: V,
    path: J,
    parseInput: K,
    operationType: I ? "read" : "write", // Affects permission handling
    completionType: "tool_use_single",
    languageName: "none"
  })
}

// READABLE (for understanding):
function renderFileOperationUI({ toolUseConfirm, onDone, onReject, verbose, toolUseContext }) {
  let [theme] = getTheme();
  let filePath = getFilePath(toolUseConfirm);
  let toolName = toolUseConfirm.tool.userFacingName(toolUseConfirm.input);
  let isReadOnly = toolUseConfirm.tool.isReadOnly(toolUseConfirm.input);
  let title = `${isReadOnly ? "Read" : "Edit"} file`;

  if (!filePath) {
    return renderGenericToolUI({...});
  }

  return renderFileOperationPrompt({
    toolUseConfirm,
    toolUseContext,
    onDone,
    onReject,
    title,                              // Shows "Read file" or "Edit file"
    content,
    path: filePath,
    parseInput,
    operationType: isReadOnly ? "read" : "write",
    completionType: "tool_use_single",
    languageName: "none"
  });
}

// Mapping: TD9→renderFileOperationUI, A→toolUseConfirm, I→isReadOnly,
// W→title, oB→getTheme, DN7→getFilePath
```

### Plan Mode System Reminder

In plan mode, the system reminder blocks edit operations:

```
Plan mode is active. The user indicated that they do not want you to execute yet --
you MUST NOT make any edits (with the exception of the plan file mentioned below),
run any non-readonly tools, or otherwise make any changes to the system.
```

**Key insight:** The tool grouping (READ_ONLY vs EDIT) determines which tools are allowed during plan mode.

---

## 3. Permission System Integration

### Permission Check Function

```javascript
// ============================================
// matchPathRule - Check file against permission rules
// Location: chunks.115.mjs:1313
// ============================================

// ORIGINAL (for source lookup):
if (AE(B, G.toolPermissionContext, "edit", "deny") !== null) return {
  result: !1,
  message: "File is in a directory that is denied by your permission settings.",
  errorCode: 1
};

// READABLE (for understanding):
if (matchPathRule(resolvedPath, appState.toolPermissionContext, "edit", "deny") !== null) {
  return {
    result: false,
    message: "File is in a directory that is denied by your permission settings.",
    errorCode: 1
  };
}

// Mapping: AE→matchPathRule, B→resolvedPath, G→appState
```

### Permission Context

The `toolPermissionContext` from AppState contains:
- `allow` rules - Paths/patterns that are allowed
- `deny` rules - Paths/patterns that are denied
- Operation types: `"edit"`, `"read"`, etc.

**How it works:**
1. Tool calls `matchPathRule(path, context, operationType, ruleType)`
2. If matches a "deny" rule, operation is blocked
3. If matches an "allow" rule, operation is permitted
4. Default behavior depends on configuration

---

## 4. LSP Server Integration

### getLSPClient Function

```javascript
// ============================================
// getLSPClient - Get LSP manager instance
// Location: chunks.114.mjs:2614-2617
// ============================================

// ORIGINAL (for source lookup):
function Rc() {
  if (kO === "failed") return;
  return Yx
}

// READABLE (for understanding):
function getLSPClient() {
  if (lspInitStatus === "failed") return undefined;
  return lspManager;
}

// Mapping: Rc→getLSPClient, kO→lspInitStatus, Yx→lspManager
```

### File Change Notification

When files are modified, the LSP server is notified:

```javascript
// ============================================
// LSP notification after file edit
// Location: chunks.115.mjs:998-1003
// ============================================

// ORIGINAL (for source lookup):
let O = Rc();
if (O) XW1(`file://${W}`), O.changeFile(W, H).catch((M) => {
  k(`LSP: Failed to notify server of file change for ${W}: ${M.message}`), e(M)
}), O.saveFile(W).catch((M) => {
  k(`LSP: Failed to notify server of file save for ${W}: ${M.message}`), e(M)
});

// READABLE (for understanding):
let lspClient = getLSPClient();
if (lspClient) {
  notifyIDE(`file://${resolvedPath}`);

  lspClient.changeFile(resolvedPath, newContent).catch((error) => {
    logger(`LSP: Failed to notify server of file change for ${resolvedPath}: ${error.message}`);
    logError(error);
  });

  lspClient.saveFile(resolvedPath).catch((error) => {
    logger(`LSP: Failed to notify server of file save for ${resolvedPath}: ${error.message}`);
    logError(error);
  });
}

// Mapping: O→lspClient, Rc→getLSPClient, XW1→notifyIDE,
// W→resolvedPath, H→newContent
```

### beforeFileEdited Hook

The LSP integration includes a `beforeFileEdited` hook that captures baseline diagnostics:

```javascript
// ============================================
// beforeFileEdited - Get LSP diagnostics baseline
// Location: chunks.112.mjs:630-650
// ============================================

// ORIGINAL (for source lookup):
async beforeFileEdited(A) {
  if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return;
  let Q = Date.now();
  try {
    let B = await Hc("getDiagnostics", { uri: `file://${A}` }, this.mcpClient),
        G = this.parseDiagnosticResult(B)[0];
    if (G) {
      if (!dT2(this.normalizeFileUri(A), this.normalizeFileUri(G.uri))) {
        e(new mT2(`Diagnostics file path mismatch: expected ${A}, got ${G.uri})`));
        return
      }
      let Z = this.normalizeFileUri(A);
      this.baseline.set(Z, G.diagnostics);
      this.lastProcessedTimestamps.set(Z, Q)
    } else {
      let Z = this.normalizeFileUri(A);
      this.baseline.set(Z, []);
      this.lastProcessedTimestamps.set(Z, Q)
    }
  } catch (B) {}
}

// READABLE (for understanding):
async beforeFileEdited(filePath) {
  // Skip if not initialized or not connected
  if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") {
    return;
  }

  let timestamp = Date.now();

  try {
    // Get current diagnostics for the file
    let diagnosticResult = await mcpRequest("getDiagnostics", {
      uri: `file://${filePath}`
    }, this.mcpClient);

    let firstResult = this.parseDiagnosticResult(diagnosticResult)[0];

    if (firstResult) {
      // Verify file path matches
      if (!urisMatch(this.normalizeFileUri(filePath), this.normalizeFileUri(firstResult.uri))) {
        logError(new PathMismatchError(
          `Diagnostics file path mismatch: expected ${filePath}, got ${firstResult.uri})`
        ));
        return;
      }

      let normalizedUri = this.normalizeFileUri(filePath);
      // Store baseline diagnostics for later comparison
      this.baseline.set(normalizedUri, firstResult.diagnostics);
      this.lastProcessedTimestamps.set(normalizedUri, timestamp);
    } else {
      let normalizedUri = this.normalizeFileUri(filePath);
      // No diagnostics - store empty baseline
      this.baseline.set(normalizedUri, []);
      this.lastProcessedTimestamps.set(normalizedUri, timestamp);
    }
  } catch (error) {
    // Silently fail - diagnostics are optional
  }
}

// Mapping: A→filePath, Q→timestamp, B→diagnosticResult/error,
// Hc→mcpRequest, dT2→urisMatch, mT2→PathMismatchError
```

**Key insight:** This hook captures the "before" state of LSP diagnostics, enabling detection of new diagnostics introduced by file edits.

---

## 5. File History Integration

### saveToFileHistory Function

```javascript
// ============================================
// saveToFileHistory - Save file state before modification
// Location: chunks.115.mjs:981
// ============================================

// ORIGINAL (for source lookup):
if (vG()) await ps(J, W, I.uuid);

// READABLE (for understanding):
if (isFileHistoryEnabled()) {
  await saveToFileHistory(updateFileHistoryState, resolvedPath, meta.uuid);
}

// Mapping: vG→isFileHistoryEnabled, ps→saveToFileHistory,
// J→updateFileHistoryState, W→resolvedPath, I→meta
```

**How file history works:**
1. Before any file modification, check if file history is enabled (`vG()`)
2. If enabled, save the current file state to history (`ps()`)
3. This enables file recovery if needed
4. The `meta.uuid` links the history entry to the tool use

### isFileHistoryEnabled Check

The file history feature can be enabled/disabled via configuration. When enabled:
- Each file modification creates a history entry
- Users can recover previous file states
- History is linked to tool use UUIDs for traceability

---

## 6. Hook System Integration

### beforeFileEdited Hook (Ec)

```javascript
// ============================================
// beforeFileEdited hook usage in Edit/Write tools
// Location: chunks.115.mjs:972 (Edit), chunks.115.mjs:1348 (Write)
// ============================================

// Edit Tool:
await Ec.beforeFileEdited(W);

// Write Tool:
await Ec.beforeFileEdited(J);

// READABLE (for understanding):
// Before modifying file, notify hooks to capture baseline state
await hooks.beforeFileEdited(resolvedPath);

// Mapping: Ec→hooks, W/J→resolvedPath
```

### Post-Edit Hook (ds)

```javascript
// ============================================
// postEditHook - Notify after file modification
// Location: chunks.115.mjs:1004 (Edit), chunks.115.mjs:1376 (Write)
// ============================================

// ORIGINAL (for source lookup):
ds(W, K, H)  // Edit tool
ds(J, K, Q)  // Write tool

// READABLE (for understanding):
postEditHook(resolvedPath, originalContent, newContent);

// Mapping: ds→postEditHook
```

**How hooks work:**
1. `beforeFileEdited` - Called before modification
   - Captures LSP diagnostics baseline
   - Saves file history if enabled
2. `postEditHook` - Called after modification
   - Triggers any registered file change listeners
   - Can be used for custom integrations

---

## 7. Telemetry Events

### File Operation Logging

```javascript
// ============================================
// logOperation - Log file operation for telemetry
// Location: chunks.86.mjs:781-786 (Read), chunks.115.mjs:1010-1013 (Edit)
// ============================================

// ORIGINAL (for source lookup):
$b({
  operation: "read",
  tool: "FileReadTool",
  filePath: D,
  content: K
})

$b({
  operation: "edit",
  tool: "FileEditTool",
  filePath: W
})

// READABLE (for understanding):
logOperation({
  operation: "read",       // or "edit", "write"
  tool: "FileReadTool",    // or "FileEditTool", "FileWriteTool"
  filePath: resolvedPath,
  content: fileContent     // Only for read operations
});

// Mapping: $b→logOperation
```

### CLAUDE.md Telemetry

Special telemetry event when CLAUDE.md is modified:

```javascript
// ============================================
// tengu_write_claudemd - Track CLAUDE.md modifications
// Location: chunks.115.mjs:1009, chunks.115.mjs:1381
// ============================================

// ORIGINAL (for source lookup):
if (W.endsWith(`${zu5}CLAUDE.md`)) l("tengu_write_claudemd", {});

// READABLE (for understanding):
if (resolvedPath.endsWith(`${pathSeparator}CLAUDE.md`)) {
  logEvent("tengu_write_claudemd", {});
}

// Mapping: l→logEvent, zu5→pathSeparator
```

**Why track CLAUDE.md:**
- CLAUDE.md contains project-specific instructions
- Modifications indicate customization of Claude's behavior
- Useful for understanding how users configure their projects

---

## 8. System Reminder Integration

The file system module integrates with the system reminder system to notify the model when files have been modified externally.

### Changed Files Detection (m27)

The `changedFilesReminder` function uses `readFileState` to detect external modifications:

```javascript
// ============================================
// changedFilesReminder - Detects files modified externally since last read
// Location: chunks.131.mjs:3458-3497
// ============================================

// ORIGINAL (for source lookup):
async function m27(A) {
  let Q = await A.getAppState();
  return (await Promise.all(FS(A.readFileState).map(async (G) => {
    let Z = A.readFileState.get(G);
    if (!Z) return null;
    if (Z.offset !== void 0 || Z.limit !== void 0) return null;
    let Y = Y4(G);
    if (nEA(Y, Q.toolPermissionContext)) return null;
    try {
      if (mz(Y) <= Z.timestamp) return null;
      // ... re-read file and generate diff
    }
  })));
}

// READABLE (for understanding):
async function changedFilesReminder(sessionContext) {
  let appState = await sessionContext.getAppState();
  return (await Promise.all(
    Array.from(sessionContext.readFileState.keys()).map(async (filePath) => {
      let readRecord = sessionContext.readFileState.get(filePath);
      if (!readRecord) return null;

      // Skip partial reads (offset/limit specified)
      if (readRecord.offset !== void 0 || readRecord.limit !== void 0) return null;

      let resolvedPath = resolvePath(filePath);

      // Skip if permission denied
      if (isPathDenied(resolvedPath, appState.toolPermissionContext)) return null;

      try {
        // Skip if file hasn't been modified
        if (getFileModifiedTime(resolvedPath) <= readRecord.timestamp) return null;

        // Re-read file and generate diff snippet
        // Returns { type: "edited_text_file", filename, snippet } or
        //         { type: "edited_image_file", filename, content }
      }
    })
  ));
}

// Mapping: m27→changedFilesReminder, A→sessionContext, Q→appState, G→filePath,
//          Z→readRecord, Y→resolvedPath, FS→Array.from(...keys()), mz→getFileModifiedTime,
//          nEA→isPathDenied
```

**How it works:**
1. Iterates through all files in `readFileState`
2. Skips partial reads (offset/limit defined) - only full file reads are tracked
3. Checks permission context to skip denied paths
4. Compares current file modification time with stored timestamp
5. If file changed, re-reads and generates a diff snippet

**Generated reminder types:**
- `edited_text_file` - Text file changed, includes diff snippet
- `edited_image_file` - Image file changed, includes new content
- `todo` - Special case for TODO file changes

### Empty File Warning

When reading an empty file, a system reminder is injected:

```javascript
// ============================================
// Empty file system reminder
// Location: chunks.86.mjs:818
// ============================================

// ORIGINAL (for source lookup):
B = A.file.totalLines === 0
  ? "<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>"
  : `<system-reminder>Warning: the file exists but is shorter than the provided offset (${A.file.startLine})...</system-reminder>`;

// READABLE (for understanding):
content = fileResult.file.totalLines === 0
  ? "<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>"
  : `<system-reminder>Warning: the file exists but is shorter than the provided offset (${fileResult.file.startLine})...</system-reminder>`;
```

**Use cases:**
- Alerts model when a file exists but has no content
- Warns when offset is beyond file length
- Prevents confusion about "empty" vs "not found"

---

## 9. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    File System Tool Integration                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────┐                                                │
│  │    Tool Groups      │                                                │
│  │  ┌───────────────┐  │        ┌────────────────────┐                  │
│  │  │  READ_ONLY    │◄─┼────────│   Plan Mode UI     │                  │
│  │  │  Read, Glob,  │  │        │  isReadOnly check  │                  │
│  │  │  Grep, etc.   │  │        │  "Read file" title │                  │
│  │  ├───────────────┤  │        └────────────────────┘                  │
│  │  │    EDIT       │  │                                                │
│  │  │  Edit, Write, │  │        ┌────────────────────┐                  │
│  │  │  NotebookEdit │◄─┼────────│ Permission System  │                  │
│  │  └───────────────┘  │        │  matchPathRule()   │                  │
│  └─────────────────────┘        │  allow/deny rules  │                  │
│                                 └────────────────────┘                  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                        Hook System                                │   │
│  │  ┌──────────────────────┐    ┌──────────────────────┐            │   │
│  │  │   beforeFileEdited   │───►│    postEditHook      │            │   │
│  │  │  - LSP diagnostics   │    │  - Notify listeners  │            │   │
│  │  │  - File history      │    │  - Trigger updates   │            │   │
│  │  └──────────────────────┘    └──────────────────────┘            │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                      LSP Integration                              │   │
│  │  ┌──────────────────┐  ┌───────────────┐  ┌─────────────────┐   │   │
│  │  │  getLSPClient()  │  │  changeFile() │  │   saveFile()    │   │   │
│  │  │       (Rc)       │  │  Notify edit  │  │  Trigger save   │   │   │
│  │  └──────────────────┘  └───────────────┘  └─────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                       Telemetry                                   │   │
│  │  ┌──────────────────────────┐  ┌─────────────────────────────┐   │   │
│  │  │  logOperation() - $b     │  │  logEvent() - l             │   │   │
│  │  │  read/edit/write ops     │  │  tengu_write_claudemd       │   │   │
│  │  └──────────────────────────┘  └─────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Key Functions Summary

Key functions in this document:

- `getToolGroups` (XG9) - Returns tool group configuration
- `renderFileOperationUI` (TD9) - Renders file operation UI with plan mode awareness
- `matchPathRule` (AE) - Checks file against permission rules
- `getLSPClient` (Rc) - Gets LSP manager instance
- `beforeFileEdited` (Ec.beforeFileEdited) - Hook before file modification
- `postEditHook` (ds) - Hook after file modification
- `saveToFileHistory` (ps) - Saves file state for recovery
- `isFileHistoryEnabled` (vG) - Checks if file history is enabled
- `logOperation` ($b) - Logs file operations for telemetry
- `logEvent` (l) - Logs events like tengu_write_claudemd
- `notifyIDE` (XW1) - Notifies IDE of file changes
- `changedFilesReminder` (m27) - Detects externally modified files for system reminders

---

## 11. Cross-References

- [implementation.md](./implementation.md) - Core file system operations
- [special_file_handling.md](./special_file_handling.md) - Notebooks, images, PDFs
- [../05_tools/permissions.md](../05_tools/permissions.md) - Permission system details
- [../12_plan_mode/overview.md](../12_plan_mode/overview.md) - Plan mode mechanics
- [../11_hook/hooks_implementation.md](../11_hook/hooks_implementation.md) - Hook system
- [../27_lsp_integration/lsp_tool.md](../27_lsp_integration/lsp_tool.md) - LSP integration
