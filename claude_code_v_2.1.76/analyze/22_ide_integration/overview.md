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

Key symbols in this document:
- `Gb` - DiagnosticsManager class (singleton managing IDE LSP diagnostics baseline/delta)
- `Nl` - Singleton instance of DiagnosticsManager
- `gX6` - IDE configuration map (all supported IDEs)
- `kN7` - JetBrains plugin ID mapping
- `vl3` - VS Code extension ID constant (`anthropic.claude-code`)
- `bp3` - JetBrains plugin ID constant (`claude-code-jetbrains-plugin`)
- `Gv` - findConnectedIdeClient (locates connected IDE MCP client)
- `openDiffInIde` (EPz) - Opens diff view in IDE and waits for user response
- `IDEDiffHandler` (pSq) - React component orchestrating diff display lifecycle
- `hasConnectedIde` (L$1) - Returns true if IDE MCP client is connected
- `getIdeName` (R$1) - Returns display name of connected IDE

## Symbol Validation Status (v2.1.76) ✅

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `Gb` | DiagnosticsManager | chunks.170.mjs:740 | ✅ Validated - Singleton class |
| `gX6` | IDE_CONFIG | chunks.65.mjs:2112 | ✅ Validated - 19 IDE configurations |
| `Gv` | findConnectedIdeClient | chunks.65.mjs:2032 | ✅ Validated - Locates connected IDE client |
| `L$1` | hasConnectedIde | chunks.65.mjs:1811 | ✅ Validated - Boolean check for IDE connection |

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

## Component Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         IDE Integration Components                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Connection Layer                  Tool Layer                   UI Layer   │
│  ┌──────────────────────┐        ┌──────────────────────┐   ┌────────────┐ │
│  │ Gv (findConnectedIde │        │ EPz (openDiffInIde)  │   │ IdeSelection│ │
│  │ Client)              │        │ Cs8 (closeDiffTab)   │   │ Indicator  │ │
│  │ ideKind detection     │        │ getDiagnostics      │   │ (loc TBD)  │ │
│  │ SSE/WebSocket transport│        └──────────────────────┘   └────────────┘ │
│  └──────────────────────┘                 │                        │        │
│           │                              │                        ▼        │
│           ▼                              ▼                   ┌────────────┐ │
│  ┌──────────────────────┐        ┌──────────────────────┐   │ pSq (IDE   │ │
│  │ MCP Client Manager    │        │ DiagnosticsManager   │   │ DiffHandler)│
│  │ (chunks.65.mjs)       │        │ (Gb/Nl)              │   │            │ │
│  │                       │        │                      │   │• showDiff()│ │
│  │ • initialize()        │        │ • baseline Map       │   │• handleResp│ │
│  │ • callTool()          │        │ • getNewDiagnostics()│   │• fallback  │ │
│  │ • notifications       │        │ • formatSummary()    │   └────────────┘ │
│  └──────────────────────┘        └──────────────────────┘                   │
│                                                                             │
│  System Integration                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ • beforeFileEdited hook → capture diagnostic baseline                  ││
│  │ • getNewDiagnostics → system reminder attachment                       ││
│  │ • selection_changed → ideSelection state → status bar + prompt context ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

---

## Deep Algorithm Analysis

### IDE Configuration Registry (IDE_CONFIG / gX6)

**What it does**: Central registry defining all supported IDEs, their detection keywords, and family classification.

**Location:** `chunks.65.mjs:2112-2239`

```javascript
// ============================================
// IDE_CONFIG - Complete IDE support registry
// Location: chunks.65.mjs:2112-2239
// ============================================

// ORIGINAL (for source lookup):
gX6 = {
    cursor: {
        ideKind: "vscode",
        displayName: "Cursor",
        processKeywordsMac: ["Cursor Helper", "Cursor.app"],
        processKeywordsWindows: ["cursor.exe"],
        processKeywordsLinux: ["cursor"]
    },
    windsurf: {
        ideKind: "vscode",
        displayName: "Windsurf",
        processKeywordsMac: ["Windsurf Helper", "Windsurf.app"],
        processKeywordsWindows: ["windsurf.exe"],
        processKeywordsLinux: ["windsurf"]
    },
    vscode: {
        ideKind: "vscode",
        displayName: "VS Code",
        processKeywordsMac: ["Visual Studio Code", "Code Helper"],
        processKeywordsWindows: ["code.exe"],
        processKeywordsLinux: ["code"]
    },
    intellij: {
        ideKind: "jetbrains",
        displayName: "IntelliJ IDEA",
        processKeywordsMac: ["IntelliJ IDEA"],
        processKeywordsWindows: ["idea64.exe"],
        processKeywordsLinux: ["idea", "intellij"]
    },
    // ... (19 IDEs total)
};

// READABLE (for understanding):
const IDE_CONFIG = {
    // VS Code family (4 IDEs)
    cursor: {
        ideKind: "vscode",           // Uses VS Code extension API
        displayName: "Cursor",
        processKeywordsMac: ["Cursor Helper", "Cursor.app"],
        processKeywordsWindows: ["cursor.exe"],
        processKeywordsLinux: ["cursor"]
    },
    windsurf: {
        ideKind: "vscode",
        displayName: "Windsurf",
        processKeywordsMac: ["Windsurf Helper", "Windsurf.app"],
        processKeywordsWindows: ["windsurf.exe"],
        processKeywordsLinux: ["windsurf"]
    },
    vscode: {
        ideKind: "vscode",
        displayName: "VS Code",
        processKeywordsMac: ["Visual Studio Code", "Code Helper"],
        processKeywordsWindows: ["code.exe"],
        processKeywordsLinux: ["code"]
    },

    // JetBrains family (15 IDEs)
    intellij: {
        ideKind: "jetbrains",        // Uses JetBrains plugin API
        displayName: "IntelliJ IDEA",
        processKeywordsMac: ["IntelliJ IDEA"],
        processKeywordsWindows: ["idea64.exe"],
        processKeywordsLinux: ["idea", "intellij"]
    },
    pycharm: {
        ideKind: "jetbrains",
        displayName: "PyCharm",
        processKeywordsMac: ["PyCharm"],
        processKeywordsWindows: ["pycharm64.exe"],
        processKeywordsLinux: ["pycharm"]
    },
    // ... (see full list below)
};

// Mapping: gX6→IDE_CONFIG
```

**Why this design:**

1. **ideKind bifurcation**: Only two `ideKind` values exist:
   - `"vscode"` - VS Code family uses extension API, JSON settings, `.vscode` folders
   - `"jetbrains"` - JetBrains family uses plugin API, XML settings, `.idea` folders

2. **Platform-specific keywords**: Process names differ per platform:
   - **macOS**: Uses `.app` bundle names and "Helper" suffix (e.g., "Cursor Helper")
   - **Windows**: Uses `*64.exe` convention for 64-bit IDEs
   - **Linux**: Uses simple process names without extension

3. **Detection algorithm**: Process tree walking matches these keywords against running processes to auto-detect the active IDE.

**Full IDE list (19 total):**

| Key | Family | Display Name | Windows Executable |
|-----|--------|--------------|-------------------|
| `cursor` | vscode | Cursor | cursor.exe |
| `windsurf` | vscode | Windsurf | windsurf.exe |
| `vscode` | vscode | VS Code | code.exe |
| `intellij` | jetbrains | IntelliJ IDEA | idea64.exe |
| `pycharm` | jetbrains | PyCharm | pycharm64.exe |
| `webstorm` | jetbrains | WebStorm | webstorm64.exe |
| `phpstorm` | jetbrains | PhpStorm | phpstorm64.exe |
| `rubymine` | jetbrains | RubyMine | rubymine64.exe |
| `clion` | jetbrains | CLion | clion64.exe |
| `goland` | jetbrains | GoLand | goland64.exe |
| `rider` | jetbrains | Rider | rider64.exe |
| `datagrip` | jetbrains | DataGrip | datagrip64.exe |
| `appcode` | jetbrains | AppCode | appcode.exe |
| `dataspell` | jetbrains | DataSpell | dataspell64.exe |
| `aqua` | jetbrains | Aqua | aqua64.exe |
| `gateway` | jetbrains | Gateway | gateway64.exe |
| `fleet` | jetbrains | Fleet | fleet.exe |
| `androidstudio` | jetbrains | Android Studio | studio64.exe |

---

### findConnectedIdeClient (Gv)

**What it does**: Locates the connected IDE MCP client from the clients list. Returns `undefined` if not connected.

**Location:** `chunks.65.mjs:2032-2036`

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
    // Guard: no clients list provided
    if (!mcpClients) return undefined;

    // Find IDE client that is connected
    let ideClient = mcpClients.find(
        client => client.type === "connected" && client.name === "ide"
    );

    // Double-check connection state and return
    return ideClient?.type === "connected" ? ideClient : undefined;
}

// Mapping: Gv→findConnectedIdeClient, A→mcpClients, q→ideClient
```

**Why double-check the type:**

The redundant `q?.type === "connected"` check after `find()` is a defensive pattern:
1. The `find()` already filters for `type === "connected"`
2. The second check handles edge cases where the array mutates between find and return
3. TypeScript narrowing: ensures return type is `McpClient | undefined`, not `McpClient | null`

**Usage pattern:**
```javascript
// Typical usage in diff handler
let ideClient = findConnectedIdeClient(toolUseContext.options.mcpClients);
if (ideClient) {
    await openDiffInIde(filePath, edits, ideClient, tabName);
}
```

---

### hasConnectedIde (L$1)

**What it does**: Simple boolean check for IDE connection. Returns `true` if any MCP client named "ide" is in connected state.

**Location:** `chunks.65.mjs:1811-1813`

```javascript
// ============================================
// hasConnectedIde - Boolean check for IDE connection
// Location: chunks.65.mjs:1811-1813
// ============================================

// ORIGINAL (for source lookup):
function L$1(A) {
    return A.some((q) => q.type === "connected" && q.name === "ide")
}

// READABLE (for understanding):
function hasConnectedIde(mcpClients) {
    return mcpClients.some(
        client => client.type === "connected" && client.name === "ide"
    );
}

// Mapping: L$1→hasConnectedIde, A→mcpClients, q→client
```

**Difference from findConnectedIdeClient:**

| Function | Return Type | Use Case |
|----------|-------------|----------|
| `hasConnectedIde` | `boolean` | Conditional branching, UI state |
| `findConnectedIdeClient` | `McpClient \| undefined` | Actually calling IDE tools |

```javascript
// hasConnectedIde: Quick check for conditional
if (hasConnectedIde(mcpClients)) {
    showIdeDiffOption();
}

// findConnectedIdeClient: Need the actual client to call methods
let client = findConnectedIdeClient(mcpClients);
await client.callTool("openDiff", params);
```

---

### getIdeName (R$1)

**What it does**: Returns the display name of the connected IDE (e.g., "VS Code", "Cursor", "IntelliJ IDEA").

**Location:** `chunks.65.mjs:2006-2009`

```javascript
// ============================================
// getIdeName - Get display name of connected IDE
// Location: chunks.65.mjs:2006-2014
// ============================================

// ORIGINAL (for source lookup):
function R$1(A) {
    let q = A.find((K) => K.type === "connected" && K.name === "ide");
    return sj8(q)
}

function sj8(A) {
    let q = A?.config;
    return q?.type === "sse-ide" || q?.type === "ws-ide"
        ? q.ideName
        : FM() ? Y$(LT.terminal) : null
}

// READABLE (for understanding):
function getIdeName(mcpClients) {
    let ideClient = mcpClients.find(
        client => client.type === "connected" && client.name === "ide"
    );
    return resolveIdeDisplayName(ideClient);
}

function resolveIdeDisplayName(ideClient) {
    let config = ideClient?.config;

    // Priority 1: IDE config specifies name (from MCP connection)
    if (config?.type === "sse-ide" || config?.type === "ws-ide") {
        return config.ideName;
    }

    // Priority 2: Running inside IDE terminal
    if (isRunningInIdeTerminal()) {
        return getIdeNameFromTerminalType(terminalType);
    }

    // Default: No IDE name available
    return null;
}

// Mapping: R$1→getIdeName, sj8→resolveIdeDisplayName, FM→isRunningInIdeTerminal
```

**Why the fallback chain:**

1. **MCP config**: When connected via MCP, the config contains the `ideName` from the IDE extension
2. **Terminal detection**: When Claude Code runs inside an IDE's integrated terminal, it can detect which IDE via environment variables
3. **null**: Neither available — IDE integration not active

---

### DiagnosticsManager: getNewDiagnostics Algorithm

**What it does**: Fetches current diagnostics from IDE, filters to files with baselines, computes delta (new issues not in baseline).

**Location:** `chunks.170.mjs:806-839`

```javascript
// ============================================
// getNewDiagnostics - Compute diagnostic delta from baseline
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
    let q = A.filter((z) => this.baseline.has(this.normalizeFileUri(z.uri)))
             .filter((z) => z.uri.startsWith("file://")),
        K = new Map;
    A.filter((z) => this.baseline.has(this.normalizeFileUri(z.uri)))
     .filter((z) => z.uri.startsWith("_claude_fs_right:"))
     .forEach((z) => { K.set(this.normalizeFileUri(z.uri), z) });
    let Y = [];
    for (let z of q) {
        let _ = this.normalizeFileUri(z.uri),
            w = this.baseline.get(_) || [],
            O = K.get(_),
            $ = z;
        if (O) {
            let j = this.rightFileDiagnosticsState.get(_);
            if (!j || !this.areDiagnosticArraysEqual(j, O.diagnostics)) $ = O;
            this.rightFileDiagnosticsState.set(_, O.diagnostics)
        }
        let H = $.diagnostics.filter((j) => !w.some((J) => this.areDiagnosticsEqual(j, J)));
        if (H.length > 0) Y.push({ uri: z.uri, diagnostics: H });
        this.baseline.set(_, $.diagnostics)
    }
    return Y
}

// READABLE (for understanding):
async getNewDiagnostics() {
    // Gate: Must be initialized with connected MCP client
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") {
        return [];
    }

    // Step 1: Fetch ALL current diagnostics from IDE
    let allDiagnostics = [];
    try {
        let result = await callMcpTool("getDiagnostics", {}, this.mcpClient);
        allDiagnostics = this.parseDiagnosticResult(result);
    } catch (error) {
        return [];  // Silently fail - IDE may not support diagnostics
    }

    // Step 2: Filter to files with baseline (i.e., files we've edited)
    let editedFilesDiagnostics = allDiagnostics
        .filter(d => this.baseline.has(this.normalizeFileUri(d.uri)))
        .filter(d => d.uri.startsWith("file://"));

    // Step 3: Handle diff view diagnostics (special "_claude_fs_right:" URIs)
    // These come from IDE's diff preview panel
    let rightPaneDiagnostics = new Map();
    allDiagnostics
        .filter(d => this.baseline.has(this.normalizeFileUri(d.uri)))
        .filter(d => d.uri.startsWith("_claude_fs_right:"))
        .forEach(d => {
            rightPaneDiagnostics.set(this.normalizeFileUri(d.uri), d);
        });

    // Step 4: Compute delta for each edited file
    let newDiagnostics = [];
    for (let fileDiag of editedFilesDiagnostics) {
        let normalizedUri = this.normalizeFileUri(fileDiag.uri);
        let baselineDiags = this.baseline.get(normalizedUri) || [];

        // Check if diff pane has newer diagnostics
        let rightPaneDiag = rightPaneDiagnostics.get(normalizedUri);
        let effectiveDiag = fileDiag;

        if (rightPaneDiag) {
            let previousRightState = this.rightFileDiagnosticsState.get(normalizedUri);
            // Use right pane diagnostics if they changed
            if (!previousRightState ||
                !this.areDiagnosticArraysEqual(previousRightState, rightPaneDiag.diagnostics)) {
                effectiveDiag = rightPaneDiag;
            }
            // Track right pane state for next comparison
            this.rightFileDiagnosticsState.set(normalizedUri, rightPaneDiag.diagnostics);
        }

        // Step 5: Filter out diagnostics that were in baseline
        let deltaDiags = effectiveDiag.diagnostics.filter(d =>
            !baselineDiags.some(b => this.areDiagnosticsEqual(d, b))
        );

        // Step 6: Only include files with NEW issues
        if (deltaDiags.length > 0) {
            newDiagnostics.push({
                uri: fileDiag.uri,
                diagnostics: deltaDiags
            });
        }

        // Step 7: Update baseline for next call
        this.baseline.set(normalizedUri, effectiveDiag.diagnostics);
    }

    return newDiagnostics;
}

// Mapping: pC→callMcpTool, A→allDiagnostics, q→editedFilesDiagnostics,
//          K→rightPaneDiagnostics, Y→newDiagnostics
```

**Why this algorithm is sophisticated:**

1. **Baseline gating**: Only files that have a baseline (were edited) are considered. This prevents showing pre-existing issues.

2. **Diff pane handling**: When IDE shows a diff preview, diagnostics come from two sources:
   - `file://` URIs: The actual file on disk
   - `_claude_fs_right:` URIs: The proposed new content in diff preview

3. **Delta computation**: Uses `areDiagnosticsEqual` to compare each diagnostic's identity fields:
   ```javascript
   areDiagnosticsEqual(a, b) {
       return a.message === b.message
           && a.severity === b.severity
           && a.source === b.source
           && a.code === b.code
           && a.range.start.line === b.range.start.line
           && a.range.start.character === b.range.start.character
           && a.range.end.line === b.range.end.line
           && a.range.end.character === b.range.end.character;
   }
   ```

   All 8 fields must match for two diagnostics to be considered "the same".

4. **State tracking for right pane**: `rightFileDiagnosticsState` tracks the last-seen state of diff pane diagnostics to detect changes.

---

### DiagnosticsManager: beforeFileEdited Algorithm

**What it does**: Captures diagnostic baseline before a file edit, enabling delta computation later.

**Location:** `chunks.170.mjs:785-805`

```javascript
// ============================================
// beforeFileEdited - Capture diagnostic baseline before edit
// Location: chunks.170.mjs:785-805
// ============================================

// ORIGINAL (for source lookup):
async beforeFileEdited(A) {
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return;
    let q = Date.now();
    try {
        let K = await pC("getDiagnostics", { uri: `file://${A}` }, this.mcpClient),
            Y = this.parseDiagnosticResult(K)[0];
        if (Y) {
            if (!fGq(this.normalizeFileUri(A), this.normalizeFileUri(Y.uri))) {
                _6(new GGq(`Diagnostics file path mismatch: expected ${A}, got ${Y.uri})`));
                return
            }
            let z = this.normalizeFileUri(A);
            this.baseline.set(z, Y.diagnostics), this.lastProcessedTimestamps.set(z, q)
        } else {
            let z = this.normalizeFileUri(A);
            this.baseline.set(z, []), this.lastProcessedTimestamps.set(z, q)
        }
    } catch (K) {}
}

// READABLE (for understanding):
async beforeFileEdited(filePath) {
    // Gate: Must be initialized with connected MCP client
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") {
        return;
    }

    let timestamp = Date.now();

    try {
        // Step 1: Fetch diagnostics specifically for this file
        let result = await callMcpTool("getDiagnostics", {
            uri: `file://${filePath}`
        }, this.mcpClient);

        let diagnostic = this.parseDiagnosticResult(result)[0];

        if (diagnostic) {
            // Step 2: Verify path matches (prevent injection attacks)
            if (!pathsEqual(
                this.normalizeFileUri(filePath),
                this.normalizeFileUri(diagnostic.uri)
            )) {
                logError(new DiagnosticsPathMismatchError(
                    `Diagnostics file path mismatch: expected ${filePath}, got ${diagnostic.uri})`
                ));
                return;
            }

            // Step 3: Store baseline for delta computation
            let normalizedPath = this.normalizeFileUri(filePath);
            this.baseline.set(normalizedPath, diagnostic.diagnostics);
            this.lastProcessedTimestamps.set(normalizedPath, timestamp);
        } else {
            // Step 4: No diagnostics - store empty baseline
            let normalizedPath = this.normalizeFileUri(filePath);
            this.baseline.set(normalizedPath, []);
            this.lastProcessedTimestamps.set(normalizedPath, timestamp);
        }
    } catch (error) {
        // Silently ignore - file may not be tracked by IDE
    }
}

// Mapping: pC→callMcpTool, fGq→pathsEqual, _6→logError, GGq→DiagnosticsPathMismatchError
```

**Why path verification matters:**

The `pathsEqual` check prevents a subtle attack vector:
1. Attacker could craft a file path that normalizes differently
2. IDE might return diagnostics for a different file
3. Baseline would be set for wrong file, corrupting delta computation

**Why empty baseline is stored:**

Even if a file has no diagnostics now, storing `[]` as baseline ensures:
1. The file is "tracked" for future `getNewDiagnostics` calls
2. Any diagnostics that appear after the edit are considered "new"
3. Consistent behavior whether file starts clean or with issues

---

## IDE Support Matrix

### Supported IDEs (19 Total)

| Family | IDEs | Extension/Plugin |
|--------|------|-----------------|
| **VS Code** | VS Code, Cursor, Windsurf, VSCodium | `anthropic.claude-code` |
| **JetBrains** | IntelliJ IDEA, PyCharm, WebStorm, PhpStorm, RubyMine, CLion, GoLand, Rider, DataGrip, AppCode, DataSpell, Aqua, Gateway, Fleet, Android Studio | `claude-code-jetbrains-plugin` |

### IDE Family Detection

Each IDE has an `ideKind` property that determines behavior:
- `ideKind: "vscode"` - Uses VS Code extension API, keybindings.json
- `ideKind: "jetbrains"` - Uses JetBrains plugin API, different protocol

**Why this matters:** JetBrains IDEs have different capabilities and use different terminology ("plugin" vs "extension"). The `ideKind` allows code to branch appropriately.

For complete IDE configuration details, see [ide_support_matrix.md](./ide_support_matrix.md).

---

## Core Components

### DiagnosticsManager (Gb)

**Location:** `chunks.170.mjs:740-883`

**What it does**: Singleton class that fetches IDE diagnostics (errors, warnings from LSP), computes a baseline before file edits, and surfaces only new diagnostics (delta) to avoid overwhelming the LLM with pre-existing issues.

**Design principle**: New diagnostics since session start are more actionable than pre-existing ones. The baseline snapshot prevents Claude from getting distracted by issues that were there before it started working.

**Key methods:**
- `handleQueryStart(toolUseContext)` - Initialize/reset at session start
- `beforeFileEdited(filePath)` - Capture baseline before edit
- `getNewDiagnostics()` - Compute and return delta
- `formatDiagnosticsSummary(results)` - Format for LLM context

For detailed implementation, see [diagnostics_manager.md](./diagnostics_manager.md).

### IDEDiffHandler (pSq)

**Location:** `chunks.188.mjs:880-940`

**What it does**: React component that orchestrates diff display routing. Decides whether to show the diff in the IDE (via MCP `openDiff` tool) or fall back to terminal rendering.

**Decision logic:**
```javascript
useIdeDiff = hasConnectedIde(mcpClients)
    && settings.diffTool === "auto"
    && !filePath.endsWith(".ipynb")  // Jupyter notebooks need terminal diff
```

**Resolution outcomes:**
- `FILE_SAVED` → User accepted and saved → use saved content
- `TAB_CLOSED` → User closed without rejecting → treat as acceptance
- `DIFF_REJECTED` → User clicked reject → emit `onChange({ type: "reject" })`

For detailed diff handling, see [ide_tools.md](./ide_tools.md).

### Selection Tracking

**Component:** `IdeSelectionIndicator` (dIq) - chunks.191.mjs:7

**Hook:** `getIdeConnectionStatus` (LV6) - chunks.190.mjs:2902 - Returns connection status and IDE name

**Notification Schema:** `selectionChangedSchema` - chunks.194.mjs:1032
- Defines Zod schema for `selection_changed` MCP notification
- Validates `start`/`end` line/character positions and file path

**State shape:**
```typescript
interface IdeSelection {
    lineCount: number;           // 0 when no selection; >0 when text selected
    lineStart: number | undefined;  // 0-based line number of selection start
    text: string | undefined;       // selected text content
    filePath: string | undefined;   // absolute path to active file
}

interface IdeConnectionStatus {
    status: "connected" | "pending" | "disconnected" | null;
    ideName: string | null;  // "vscode", "jetbrains", etc.
}
```

**Integration flow:**
```
IDE Extension
    │ MCP notification: selection_changed
    ▼
REPL state: ideSelection (managed by parent component)
    │
    ├─► IdeSelectionIndicator (dIq) → renders "⧉ 3 lines selected"
    │       at chunks.191.mjs:7
    │
    └─► System prompt injection → "User has selected 3 lines in foo.ts: ..."
```

```javascript
// ============================================
// IdeSelectionIndicator - Status bar selection badge component
// Location: chunks.191.mjs:7-42
// ============================================

// ORIGINAL (for source lookup):
function dIq(A) {
    let q = A6(7), { ideSelection: K, mcpClients: Y } = A,
        { status: z } = LV6(Y),
        _ = z === "connected" && (K?.filePath || K?.text && K.lineCount > 0);
    if (z === null || !_ || !K) return null;
    if (K.text && K.lineCount > 0) {
        let w = K.lineCount === 1 ? "line" : "lines";
        return fa6.createElement(T, { color: "ide" }, "⧉ ", K.lineCount, " ", w, " selected");
    }
    if (K.filePath) {
        return fa6.createElement(T, { color: "ide" }, "⧉ In ", basename(K.filePath));
    }
}

// READABLE (for understanding):
function IdeSelectionIndicator({ ideSelection, mcpClients }) {
    // Memoization cache for React performance
    let cache = useMemoArray(7);

    let { status } = getIdeConnectionStatus(mcpClients);  // LV6

    // Only show if connected AND has content
    let hasContent = status === "connected" &&
        (ideSelection?.filePath || (ideSelection?.text && ideSelection.lineCount > 0));

    if (status === null || !hasContent || !ideSelection) return null;

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

// Mapping: dIq→IdeSelectionIndicator, LV6→getIdeConnectionStatus, A→props, K→ideSelection, Y→mcpClients
```

> **Symbol Corrections:**
> - `FWq` in chunks.168.mjs:327 is NOT IdeSelectionIndicator - it's a brief mode slash command initializer.
> - `fVq` in chunks.178.mjs:729 is NOT useIdeSelection - it's a module initializer for tool display names (Read: "Reading", Write: "Writing", etc.).
> - The correct IdeSelectionIndicator is `dIq` at chunks.191.mjs:7.
> - The correct getIdeConnectionStatus is `LV6` at chunks.190.mjs:2902.

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
           └─ ideSelection state begins tracking editor state
```

**Key Symbol:**
- `getIdeConnectionStatus` (LV6) - chunks.190.mjs:2902 - Hook that returns `{ status, ideName }` for IDE MCP client
- `hasConnectedIde` (L$1) - chunks.65.mjs:1811 - Simple boolean check: `mcpClients.some(c => c.type === "connected" && c.name === "ide")`

For detailed connection lifecycle, see [connection_lifecycle.md](./connection_lifecycle.md).

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

**Mode values:**
| Mode | IDE Behavior |
|------|--------------|
| `default` | Normal operation, permission prompts shown |
| `plan` | Shows "Plan Mode" indicator, preview changes before apply |
| `accept-edits` | Auto-accept file edits, minimal UI interruption |
| `restricted` | Shows lock icon, limits available operations |

---

## System Reminder Integration

IDE diagnostics are injected into system reminders via the `getIdeDiagnosticsAttachment` function:

```javascript
// chunks.147.mjs:789-798
async function getIdeDiagnosticsAttachment(toolUseContext) {
    if (!toolUseContext.options.tools.some(t => t.name === "Edit")) return [];
    let newDiagnostics = await diagnosticsManager.getNewDiagnostics();
    if (newDiagnostics.length === 0) return [];
    return [{ type: "diagnostics", files: newDiagnostics, isNew: true }];
}
```

**Formatted output example:**
```
<new-diagnostics>The following new diagnostic issues were detected:

main.ts:
  ✗ [Line 15:10] Cannot find name 'undefinedVar' [TS2304] (typescript)
  ⚠ [Line 23:5] Unused variable 'temp' [no-unused-vars] (eslint)

utils.ts:
  ✗ [Line 8:1] Expected ';' but found '}' [JS1005] (javascript)
</new-diagnostics>
```

---

## Error Handling

| Error Scenario | Behavior |
|----------------|----------|
| IDE not running | `ideStatus = null` — no status indicator shown |
| IDE disconnects mid-session | `ideStatus = "disconnected"` — notification shown |
| `openDiff` call fails | `hasError = true` — falls back to terminal diff |
| Diff tab closed by user | Treated as acceptance of proposed change |
| JetBrains plugin not connected | Distinct "plugin not connected" notification |
| Diagnostics path mismatch | Logged as error, baseline capture skipped |

---

## Platform-Specific Considerations

### macOS
- IDE detection via process tree walking (`ps` command)
- App bundle path extraction for CLI resolution
- Application Support directories for config files

### Windows
- JetBrains IDEs use `*64.exe` naming convention
- VS Code family uses `.exe` directly
- Registry-based detection for installed IDEs

### Linux
- `DISPLAY` environment cleared during CLI operations
- Config files in `~/.config/` directory
- Process names used for detection

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

- [connection_lifecycle.md](./connection_lifecycle.md) - IDE connection management, discovery, reconnection
- [ide_tools.md](./ide_tools.md) - MCP tools exposed by IDE (openDiff, getDiagnostics, etc.)
- [diagnostics_manager.md](./diagnostics_manager.md) - LSP diagnostics baseline/delta management
- [ide_support_matrix.md](./ide_support_matrix.md) - Complete list of supported IDEs and configuration
- [ui_linkage.md](./ui_linkage.md) - UI components and React hooks for IDE integration
- [../06_mcp/mcp_implementation.md](../06_mcp/mcp_implementation.md) - MCP protocol and transport layer

---

## openDiffInIde (EPz) - Diff Preview Implementation

### What it does

Opens a diff preview in the IDE, allowing the user to accept/reject proposed file edits. Handles WSL path translation and abort signal cleanup.

### Location: chunks.188.mjs:955-1011

```javascript
// ============================================
// openDiffInIde - Open diff preview in IDE
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
        if (y8() === "wsl" && J && process.env.WSL_DISTRO_NAME)
            j = new nD6(process.env.WSL_DISTRO_NAME).toIDEPath(_);
        let M = await pC("openDiff", {
                old_file_path: j,
                new_file_path: j,
                new_file_contents: H,
                tab_name: Y
            }, $),
            D = Array.isArray(M) ? M : [M];
        if (RPz(D)) return O(), { oldContent: w, newContent: D[1].text };
        else if (yPz(D)) return O(), { oldContent: w, newContent: H };
        else if (LPz(D)) return O(), { oldContent: w, newContent: w };
        throw Error("Not accepted")
    } catch (H) {
        throw _6(H), O(), H
    }
}

// READABLE (for understanding):
async function openDiffInIde(filePath, edits, toolUseContext, tabName) {
    let closed = false;
    let resolvedPath = path.resolve(filePath);
    let oldContent = "";

    // Read current file content (if exists)
    try {
        oldContent = await readFile(resolvedPath);
    } catch (err) {
        if (err.code !== "ENOENT") throw err;
        // File doesn't exist - that's OK for new files
    }

    // Cleanup function: close diff tab on abort/exit
    async function cleanup() {
        if (closed) return;
        closed = true;
        try {
            await closeDiffTab(tabName, ideClient);
        } catch (err) {
            logError(err);
        }
        process.off("beforeExit", cleanup);
        toolUseContext.abortController.signal.removeEventListener("abort", cleanup);
    }

    // Register cleanup handlers
    toolUseContext.abortController.signal.addEventListener("abort", cleanup);
    process.on("beforeExit", cleanup);

    // Find connected IDE client
    let ideClient = findConnectedIdeClient(toolUseContext.options.mcpClients);

    try {
        // Apply edits to get new content
        let { updatedFile: newContent } = applyEdits({
            filePath: resolvedPath,
            fileContents: oldContent,
            edits: edits
        });

        if (!ideClient || ideClient.type !== "connected") {
            throw new Error("IDE client not available");
        }

        // Handle WSL path translation
        let ideFilePath = resolvedPath;
        let isWindowsIDE = ideClient.config.ideRunningInWindows === true;
        if (getPlatform() === "wsl" && isWindowsIDE && process.env.WSL_DISTRO_NAME) {
            ideFilePath = new WslPathTranslator(process.env.WSL_DISTRO_NAME).toIDEPath(resolvedPath);
        }

        // Call IDE's openDiff tool
        let response = await callMcpTool("openDiff", {
            old_file_path: ideFilePath,
            new_file_path: ideFilePath,
            new_file_contents: newContent,
            tab_name: tabName
        }, ideClient);

        let responseParts = Array.isArray(response) ? response : [response];

        // Parse response type
        if (isAcceptWithEdits(responseParts)) {
            cleanup();
            return { oldContent, newContent: responseParts[1].text };  // User modified content
        } else if (isAccept(responseParts)) {
            cleanup();
            return { oldContent, newContent };  // User accepted as-is
        } else if (isReject(responseParts)) {
            cleanup();
            return { oldContent, newContent: oldContent };  // User rejected
        }

        throw new Error("Not accepted");
    } catch (err) {
        logError(err);
        cleanup();
        throw err;
    }
}

// Mapping: EPz→openDiffInIde, A→filePath, q→edits, K→toolUseContext, Y→tabName,
//          Gv→findConnectedIdeClient, Cs8→closeDiffTab, pC→callMcpTool, L4→path.resolve,
//          IM→readFile, Qx6→applyEdits, y8→getPlatform, RPz→isAcceptWithEdits,
//          yPz→isAccept, LPz→isReject
```

### Response Types

| Response Type | Detection | Meaning |
|--------------|-----------|---------|
| Accept with edits | `D[0].type === "text" && D[1].type === "text"` | User modified diff before accepting |
| Accept | `D[0].text === "TAB_CLOSED"` | User closed tab (accepted) |
| Reject | `D[0].text === "DIFF_REJECTED"` | User rejected diff |

### WSL Path Translation

When Claude Code runs in WSL but the IDE runs on Windows, file paths must be translated:

```
Linux path: /home/user/project/file.ts
    │
    ▼ WslPathTranslator.toIDEPath()
Windows path: \\wsl$\Ubuntu\home\user\project\file.ts
```

---

## closeDiffTab (Cs8) - Cleanup Implementation

### Location: chunks.188.mjs:1013-1022

```javascript
// ============================================
// closeDiffTab - Close diff tab in IDE
// Location: chunks.188.mjs:1013-1022
// ============================================

// ORIGINAL (for source lookup):
async function Cs8(A, q) {
    try {
        if (!q || q.type !== "connected") throw Error("IDE client not available");
        await pC("close_tab", {
            tab_name: A
        }, q)
    } catch (K) {
        _6(K)
    }
}

// READABLE (for understanding):
async function closeDiffTab(tabName, ideClient) {
    try {
        if (!ideClient || ideClient.type !== "connected") {
            throw new Error("IDE client not available");
        }
        await callMcpTool("close_tab", { tab_name: tabName }, ideClient);
    } catch (err) {
        logError(err);  // Non-blocking - don't throw
    }
}

// Mapping: Cs8→closeDiffTab, A→tabName, q→ideClient, pC→callMcpTool
```

---

## Validated Symbol Summary (Phase 1 Cross-Validation)

### Confirmed Correct Mappings

| Obfuscated | Readable | File:Line | Validation Status |
|------------|----------|-----------|-------------------|
| Gv | findConnectedIdeClient | chunks.65.mjs:2032 | ✅ Validated |
| L$1 | hasConnectedIde | chunks.65.mjs:1811 | ✅ Validated |
| R$1 | getIdeName | chunks.65.mjs:2006 | ✅ Validated |
| gX6 | IDE_CONFIG | chunks.65.mjs:2114 | ✅ Validated |
| EPz | openDiffInIde | chunks.188.mjs:955 | ✅ Validated |
| Cs8 | closeDiffTab | chunks.188.mjs:1013 | ✅ Validated |
| sj8 | resolveIdeDisplayName | chunks.65.mjs:2011 | ✅ Validated |
| vl3 | VS_CODE_EXTENSION_ID | chunks.65.mjs:2082 | ✅ Validated |

### Corrected Mappings

| Obfuscated | Previous Mapping | Correct Mapping | Correct Location |
|------------|-----------------|-----------------|------------------|
| FWq | IdeSelectionIndicator | dIq is correct | chunks.191.mjs:7 |
| Rf1 | getIdeConnectionStatus | LV6 is correct | chunks.190.mjs:2902 |
| fVq | useIdeSelection | Module initializer | chunks.178.mjs:729 |

### IDE Configuration Constants (gX6)

| Key | ideKind | DisplayName | Windows Executable |
|-----|---------|-------------|-------------------|
| cursor | vscode | Cursor | cursor.exe |
| windsurf | vscode | Windsurf | windsurf.exe |
| vscode | vscode | VS Code | code.exe |
| intellij | jetbrains | IntelliJ IDEA | idea64.exe |
| pycharm | jetbrains | PyCharm | pycharm64.exe |
| webstorm | jetbrains | WebStorm | webstorm64.exe |
| phpstorm | jetbrains | PhpStorm | phpstorm64.exe |
| rubymine | jetbrains | RubyMine | rubymine64.exe |
| clion | jetbrains | CLion | clion64.exe |
| goland | jetbrains | GoLand | goland64.exe |
| rider | jetbrains | Rider | rider64.exe |
| datagrip | jetbrains | DataGrip | datagrip64.exe |
| appcode | jetbrains | AppCode | appcode.exe |
| dataspell | jetbrains | DataSpell | dataspell64.exe |
| aqua | jetbrains | Aqua | aqua64.exe |
| gateway | jetbrains | Gateway | gateway64.exe |
| fleet | jetbrains | Fleet | fleet.exe |
| androidstudio | jetbrains | Android Studio | studio64.exe |

### Platform Detection Keywords

| Platform | macOS Keywords | Windows Executable | Linux Process |
|----------|---------------|-------------------|---------------|
| Cursor | "Cursor Helper", "Cursor.app" | cursor.exe | cursor |
| VS Code | "Visual Studio Code", "Code Helper" | code.exe | code |
| IntelliJ | "IntelliJ IDEA" | idea64.exe | idea, intellij |
| PyCharm | "PyCharm" | pycharm64.exe | pycharm |

---

## Integration with 04_system_reminder (Summary)

The IDE integration module connects to system reminders through:

1. **Selection Context Injection** - `ideSelection` state becomes system reminder attachment
2. **Diagnostics Attachments** - New IDE LSP issues after edits
3. **Opened File Context** - Files opened in IDE editor

### Key Integration Points

```
04_system_reminder ←→ 22_ide_integration
    │
    ├─ Selection context
    │   └─ "User has selected N lines in file.ts"
    │
    ├─ Diagnostics
    │   └─ New errors/warnings after Edit tool
    │
    ├─ File context
    │   └─ Currently open files in IDE
    │
    └─ Diff flow
        └─ openDiffInIde → accept/reject → Edit tool result
```