# LSP Integration — UI Linkage Analysis

## Overview

The LSP subsystem surfaces to the user interface in four distinct ways:
1. **Error notification toasts** — when LSP server initialization fails
2. **Tool use rendering** — the LSP tool in the conversation stream
3. **Diagnostic attachments** — LSP diagnostics injected into the system prompt
4. **File sync side effects** — invisible LSP notifications triggered by file edit tools

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `LspTool` (vRA) - Tool object with render functions
- `renderLspToolUseMessage` (Cd4) - Renders the "using LSP" line while tool runs
- `renderLspToolResultMessage` (xd4) - Renders result count summary
- `renderLspToolUseErrorMessage` (hd4) - Renders error state
- `LspResultSummaryComponent` (NCY) - React component for compact result display
- `checkLspManagerErrors` hook - Polls for LSP server errors, shows toast notifications
- `getLspManager` (md) - Singleton accessor
- `getLspManagerStatus` (W51) - Status check for pending/failed guard

---

## 1. Tool Use Rendering Pipeline

When Claude invokes the LSP tool, the terminal UI renders the tool call lifecycle in four phases:

### Phase 1: Tool Use Message (While Tool Is Running)

```javascript
// ============================================
// renderLspToolUseMessage - Progress display while LSP is running
// Location: chunks.140.mjs:347-364
// ============================================

// ORIGINAL:
function Cd4(A, { verbose: q }) {
    if (!A.operation) return null;
    let K = [];
    if ((A.operation === "goToDefinition" || ...) && A.filePath && ...) {
        let Y = Ld4(A.filePath, A.line - 1, A.character - 1),  // extractSymbolAtPosition
            z = q ? A.filePath : L3(A.filePath);  // verbose: full path, else: basename
        if (Y) K.push(`operation: "${A.operation}"`), K.push(`symbol: "${Y}"`), K.push(`in: "${z}"`);
        else K.push(`operation: "${A.operation}"`), K.push(`file: "${z}"`), K.push(`position: ${A.line}:${A.character}`);
        return K.join(", ")
    }
    if (K.push(`operation: "${A.operation}"`), A.filePath) {
        let Y = q ? A.filePath : L3(A.filePath);
        K.push(`file: "${Y}"`)
    }
    return K.join(", ")
}

// READABLE:
function renderLspToolUseMessage(input, { verbose }) {
    const parts = [];
    if (isPositionalOperation(input.operation) && input.filePath) {
        const symbolAtPos = extractSymbolAtPosition(
            input.filePath, input.line - 1, input.character - 1
        );
        const displayPath = verbose ? input.filePath : path.basename(input.filePath);
        if (symbolAtPos) {
            parts.push(`operation: "${input.operation}"`);
            parts.push(`symbol: "${symbolAtPos}"`);  // e.g. symbol: "useState"
            parts.push(`in: "${displayPath}"`);
        } else {
            parts.push(`operation: "${input.operation}"`);
            parts.push(`file: "${displayPath}"`);
            parts.push(`position: ${input.line}:${input.character}`);
        }
    } else {
        parts.push(`operation: "${input.operation}"`);
        if (input.filePath) parts.push(`file: "${displayPath}"`);
    }
    return parts.join(", ");
}
// Mapping: Cd4→renderLspToolUseMessage, Ld4→extractSymbolAtPosition
```

**Symbol extraction at display time (Ld4):** Before the LSP request completes, the renderer reads the source file synchronously and finds the word at the given position using the regex `/[\w$'!]+|[+\-*/%&|^~<>=]+/g`. This extracts the token name (e.g., `useState`) for display. If the symbol is longer than 30 characters, it is truncated to 27 + `"..."`.

**UX goal:** The terminal line reads like:
```
⏳ LSP  operation: "goToDefinition", symbol: "useState", in: "App.tsx"
```
rather than the raw position `line: 42, character: 7`, making the tool usage immediately legible.

### Phase 2: Tool Use Rejected Message

```javascript
// ORIGINAL:
function Sd4() {
    return IJ.default.createElement(Y9, null)  // renders a Permission Denied component
}
```

Returns the standard permission-denied UI component — no LSP-specific rendering needed.

### Phase 3: Tool Use Error Message

```javascript
// ============================================
// renderLspToolUseErrorMessage - Error state rendering
// Location: chunks.140.mjs:370-380
// ============================================

// ORIGINAL:
function hd4(A, { verbose: q }) {
    if (!q && typeof A === "string" && C4(A, "tool_use_error"))
        return createElement(Box, null, createElement(Text, { color: "error" }, "LSP operation failed"));
    return createElement(DefaultErrorRenderer, { result: A, verbose: q })
}

// READABLE:
function renderLspToolUseErrorMessage(errorResult, { verbose }) {
    // In compact mode, show a simple "LSP operation failed" message
    if (!verbose && typeof errorResult === "string" && isToolUseError(errorResult)) {
        return <Box><Text color="error">LSP operation failed</Text></Box>;
    }
    // In verbose mode, show the full error detail
    return <DefaultErrorRenderer result={errorResult} verbose={verbose} />;
}
```

**Two-level error display:** In compact view (default), the user sees a brief `"LSP operation failed"` in red. In verbose mode (`--verbose` flag), the full error stack/message is shown. This keeps the default terminal output clean while preserving debuggability.

### Phase 4: Tool Result Message (After Tool Completes)

```javascript
// ============================================
// renderLspToolResultMessage - Result summary display
// Location: chunks.140.mjs:386-397
// ============================================

// ORIGINAL:
function xd4(A, q, { verbose: K }) {
    if (A.resultCount !== void 0 && A.fileCount !== void 0)
        return createElement(NCY, {
            operation: A.operation,
            resultCount: A.resultCount,
            fileCount: A.fileCount,
            content: A.result,
            verbose: K
        });
    return createElement(Box, null, createElement(Text, null, A.result))
}

// READABLE:
function renderLspToolResultMessage(output, toolUseId, { verbose }) {
    if (output.resultCount !== undefined && output.fileCount !== undefined) {
        return <LspResultSummaryComponent
            operation={output.operation}
            resultCount={output.resultCount}
            fileCount={output.fileCount}
            content={output.result}
            verbose={verbose}
        />;
    }
    // Fallback: plain text
    return <Box><Text>{output.result}</Text></Box>;
}
```

### LspResultSummaryComponent (NCY)

This is the primary display component for LSP results in the terminal UI.

**What it renders:**
- Compact mode: A single line — `Found **3** references across **2** files  ⎿`
- Verbose mode: The same header + the full formatted content below it

```javascript
// ============================================
// LspResultSummaryComponent - Compact + verbose result display
// Location: chunks.140.mjs:285-341
// ============================================

// READABLE structure:
function LspResultSummaryComponent({ operation, resultCount, fileCount, content, verbose }) {
    // Map operation → plural/singular label
    const label = OPERATION_LABELS[operation];  // VCY
    const countLabel = resultCount === 1 ? label.singular : label.plural;

    // Build header line
    let header;
    if (operation === "hover" && resultCount > 0 && label.special) {
        header = <Text>Hover info <Text>{label.special}</Text></Text>;  // "Hover info available"
    } else {
        header = <Text>Found <Text bold>{resultCount} </Text>{countLabel}</Text>;
    }

    // File count suffix
    const fileSuffix = fileCount > 1
        ? <Text> across <Text bold>{fileCount} </Text>files</Text>
        : null;

    if (verbose) {
        return (
            <Box flexDirection="column">
                <Box flexDirection="row"><Text>  ⎿  {header}{fileSuffix}</Text></Box>
                <Box marginLeft={5}><Text>{content}</Text></Box>
            </Box>
        );
    }
    return (
        <Box height={1}>
            <Text>{header}{fileSuffix} {resultCount > 0 && <SpinnerDone />}</Text>
        </Box>
    );
}
```

**Operation label map (VCY):**
```javascript
{
    goToDefinition:      { singular: "definition",  plural: "definitions" },
    findReferences:      { singular: "reference",   plural: "references" },
    documentSymbol:      { singular: "symbol",      plural: "symbols" },
    workspaceSymbol:     { singular: "symbol",      plural: "symbols" },
    hover:               { singular: "hover info",  plural: "hover info", special: "available" },
    goToImplementation:  { singular: "implementation", plural: "implementations" },
    prepareCallHierarchy:{ singular: "call item",   plural: "call items" },
    incomingCalls:       { singular: "caller",      plural: "callers" },
    outgoingCalls:       { singular: "callee",      plural: "callees" }
}
```

**Hover special case:** `hover` uses a different format — "Hover info available" — instead of "Found N hover infos", since there is always at most 1 hover result.

---

## 2. LSP Manager Error Toast Notifications

When LSP servers fail to initialize or crash, the UI shows a toast-style error notification.

### Error Monitoring Hook (chunks.187.mjs)

```javascript
// ============================================
// LSP error monitoring hook - Polls for server errors
// Location: chunks.187.mjs:1459-1483
// ============================================

// ORIGINAL (simplified):
function _(A) {  // showLspManagerErrors(setNotification)
    if (Nq()) return;  // isHeadlessSession() - no UI in headless mode
    let j = W51();  // getLspManagerStatus
    if (j.status === "failed") {
        A("lsp-manager", j.error.message);  // show error notification
        z(!1);  // disable polling
        return
    }
    if (j.status === "pending" || j.status === "not-started") return;
    let M = md();  // getLspManager
    if (M) {
        let P = M.getAllServers();
        for (let [W, G] of P)
            if (G.state === "error" && G.lastError)
                A(W, G.lastError.message)  // show per-server error
    }
}

// Set up polling every 5000ms
RX(J, Y ? 5000 : null);  // useInterval hook

// Also run immediately via useEffect
jG.useEffect(X, D);
```

**What it does:** Polls the LSP manager state every `zWz = 5000ms`. If any server enters the `"error"` state, it calls `setNotification(serverName, errorMessage)` which shows a toast.

**Why poll instead of push?** The LSP server instances don't have direct access to React state. The polling approach decouples the server lifecycle management from UI state updates, avoiding React context leakage into the core LSP logic.

**Headless guard:** `isHeadlessSession()` (Nq) prevents toast notifications in non-interactive (SDK/CI) contexts where there is no terminal UI to display them.

**Toast display format:** The notification shows the server name (e.g., `"typescript-language-server"`) and the error message. Users see this in the status bar / notification area of the terminal UI.

---

## 3. System Prompt Diagnostic Attachment

Diagnostics from LSP servers are injected into the system prompt as a structured attachment, giving the agent real-time awareness of compilation errors.

### Attachment Building (chunks.142.mjs)

```javascript
// In buildAttachments() / phY():
gw("lsp_diagnostics", async () => WIY(sessionContext))
```

`WIY` (getLSPDiagnosticAttachments) is called on every agent turn. It:
1. Calls `sm4()` (checkDiagnosticsRegistry) to collect fresh, deduplicated diagnostics
2. Formats each diagnostic file as a system prompt section
3. Clears the pending registry after delivery (via `tm4()`)

**What the agent sees:**

The diagnostic attachment injects content like:
```
[LSP Diagnostics from typescript-language-server]

src/App.tsx:
  Line 42:7 Error: Type 'string' is not assignable to type 'number'. (TS2322)
  Line 58:3 Warning: 'result' is declared but its value is never read. (TS6133)

src/utils.ts:
  Line 12:5 Error: Cannot find name 'foo'. (TS2304)
```

This appears in the `<system-reminder>` section injected before each LLM call, making the agent immediately aware of build errors caused by its recent file edits.

### Diagnostic Format Pipeline

```
publishDiagnostics notification
         │
         ▼
WvY (convertDiagnosticUriToPath)
│ Converts "file:///path/to/file" → "/path/to/file"
│ Falls back to original URI if conversion fails
         │
         ▼
PvY (severityIntToString)
│ 1 → "Error", 2 → "Warning", 3 → "Info", 4 → "Hint"
         │
         ▼
am4 (hashDiagnostic)
│ SHA-hash of {message, severity, range, source, code}
│ Used for deduplication comparison
         │
         ▼
om4 (registerDiagnostics)
│ Stores in cQ1 (pending registry Map)
         │
         ▼ (on next agent turn)
sm4 (checkDiagnosticsRegistry)
│ Dedup + volume limit + sort
         │
         ▼
WIY (getLSPDiagnosticAttachments)
│ tm4() — clears pending registry
│ Returns [{ serverName, files }]
         │
         ▼
System prompt injection (type: "diagnostics")
```

---

## 4. File Edit Tools → LSP Side Effects

File write operations transparently trigger LSP notifications. This is entirely invisible to the user but critical for keeping the LSP server's in-memory model synchronized with disk.

### FileEditTool sync (chunks.134.mjs)

```javascript
// After writing the file to disk:
const manager = getLspManager();  // md()
if (manager) {
    clearDeliveredDiagnosticsForUri(`file://${filePath}`);  // NP6: clear stale diagnostics
    manager.changeFile(filePath, newContent)  // textDocument/didChange
        .catch(err => { log(err); logError(err); });
    manager.saveFile(filePath)               // textDocument/didSave
        .catch(err => { log(err); logError(err); });
}
```

### FileWriteTool sync (chunks.146.mjs)

Same pattern — both tools follow the identical LSP notification sequence.

**Sequence diagram:**
```
Agent ──FileEdit──► FileEditTool.call()
                         │
                         ├──► write to disk
                         │
                         ├──► NP6(fileUri)  // clear stale LSP diagnostic cache
                         │
                         ├──► manager.changeFile()  ──► didChange notification ──► LSP Server
                         │                                                               │
                         └──► manager.saveFile()    ──► didSave notification ──► LSP Server
                                                                                        │
                                                             (reanalysis) ◄─────────────┘
                                                                  │
                                                    publishDiagnostics notification
                                                                  │
                                                    om4 (registerDiagnostics)
                                                                  │
                                                    → available in next agent turn
```

**User experience:** The user never sees these LSP notifications directly. Their effect is observable one agent turn later: if the file edit introduced a type error, the LSP server will push a `publishDiagnostics` notification, and the next system prompt will contain that error, prompting the agent to fix it.

---

## 5. Tool Permission Rendering

The LSP tool participates in the standard permission system:

```javascript
// In LspTool.checkPermissions():
async checkPermissions(input, context) {
    const appState = await context.getAppState();
    return checkToolPermission(LspTool, input, appState.toolPermissionContext);
}
```

The LSP tool is treated as a **read-only** operation (`isReadOnly() { return true }`), which means:
- In `Plan Mode`, it is allowed without special approval (read-only tools are generally permitted)
- The permission dialog shows the LSP tool name + the operation being performed
- Auto-approval rules (e.g., `--dangerously-skip-permissions`) apply as with other read-only tools

---

## 6. Position Input Validation UI

Before an LSP request is dispatched, `validateInput()` checks:

```javascript
async validateInput(input) {
    // 1. Zod schema validation (Dd4.safeParse)
    const parsed = LspInputSchema.safeParse(input);
    if (!parsed.success) return { result: false, message: `Invalid input: ${...}`, errorCode: 3 };

    // 2. File existence check
    const filePath = resolvePath(input.filePath);
    if (filePath.startsWith("\\\\") || filePath.startsWith("//")) return { result: true };  // UNC paths: skip
    if (!fs.existsSync(filePath)) return { result: false, message: `File does not exist: ${input.filePath}`, errorCode: 1 };

    // 3. Is-file check
    if (!fs.statSync(filePath).isFile()) return { result: false, message: `Path is not a file: ${input.filePath}`, errorCode: 2 };

    return { result: true };
}
```

Error codes map to distinct user-visible messages in the permission dialog.

---

## Data Flow Summary

```
                          ┌────────────────────────────────┐
                          │         AGENT TURN N           │
                          │                                │
  File edit tools ────────┤── NP6 + changeFile + saveFile │
  (FileEdit/FileWrite)    │                                │
                          │                                │
  LSP Tool invocation ────┤── isEnabled check             │
  (goToDefinition, etc.)  │   ├── openFile (auto)         │
                          │   ├── sendRequest             │
                          │   └── formatResult            │
                          │                                │
  System prompt ──────────┤── lsp_diagnostics attachment  │
  (WIY, sm4)              │   (from previous publishDiag) │
                          └────────────────────────────────┘
                                         │
                          ┌──────────────▼─────────────────┐
                          │      LSP SERVER LAYER          │
                          │                                │
                          │  textDocument/didChange        │
                          │  textDocument/didSave          │
                          │  textDocument/definition       │
                          │  textDocument/hover            │
                          │  ... etc.                      │
                          │           │                    │
                          │           ▼                    │
                          │  publishDiagnostics ──► om4   │
                          └────────────────────────────────┘

                          ┌────────────────────────────────┐
                          │         TERMINAL UI            │
                          │                                │
                          │  • Tool use lines (Cd4)        │
                          │  • Result summary (NCY)        │
                          │  • Error toasts (poll/5s)      │
                          └────────────────────────────────┘
```
