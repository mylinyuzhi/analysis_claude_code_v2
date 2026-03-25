# Diagnostics Manager (Claude Code 2.1.76)

## Overview

The Diagnostics Manager (`Gb` class, singleton instance `Nl`) manages LSP diagnostics from the IDE integration. It implements a baseline-delta pattern: on session start (or before file edits), it captures the current diagnostic state as a baseline, then subsequent queries return only new diagnostics that weren't present in the baseline. This prevents the LLM from being distracted by pre-existing code issues and focuses attention on problems introduced during the current session.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - IDE Integration

Key symbols in this document:
- `Gb` - DiagnosticsManager class (singleton managing IDE LSP diagnostics baseline/delta)
- `Nl` - Singleton instance of DiagnosticsManager
- `GGq` - DiagnosticsPathMismatchError (error class for URI validation)
- `ZGq` - MAX_DIAGNOSTIC_SUMMARY_LENGTH constant (4000 chars)
- `handleQueryStart` - Initialize/reset diagnostics state at query start
- `beforeFileEdited` - Capture baseline before file edit
- `getNewDiagnostics` - Fetch and compute delta of new diagnostics
- `formatDiagnosticsSummary` - Format diagnostics for LLM context
- `cuY` - getIdeDiagnosticsAttachment function (system reminder integration)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DiagnosticsManager (Gb)                          │
├─────────────────────────────────────────────────────────────────────────┤
│  State:                                                                 │
│  ┌─────────────────┐  ┌──────────────────────┐  ┌────────────────────┐  │
│  │ baseline: Map   │  │ lastProcessedTs: Map │  │ rightFileDiags:    │  │
│  │ filePath → diag │  │ filePath → timestamp │  │ Map (diff view)    │  │
│  └─────────────────┘  └──────────────────────┘  └────────────────────┘  │
│                                                                         │
│  Lifecycle:                                                             │
│  ┌───────────────┐    ┌───────────────────┐    ┌──────────────────┐    │
│  │handleQueryStart│───▶│beforeFileEdited  │───▶│getNewDiagnostics │    │
│  │ (session start)│    │ (pre-edit hook)  │    │ (post-edit delta)│    │
│  └───────────────┘    └───────────────────┘    └──────────────────┘    │
│           │                    │                       │                │
│           ▼                    ▼                       ▼                │
│      initialize()        set baseline           compute delta          │
│      or reset()          for edited file        vs baseline            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   System Reminder   │
                         │   Integration       │
                         │   (chunks.147.mjs)  │
                         │                     │
                         │   cuY() fetches     │
                         │   new diagnostics   │
                         │   → formats for LLM │
                         └─────────────────────┘
```

---

## Class Definition: `DiagnosticsManager` (Gb)

**Location:** `chunks.170.mjs:740-883`

```javascript
// ============================================
// DiagnosticsManager - Singleton managing LSP diagnostic baseline/delta
// Location: chunks.170.mjs:740-883
// ============================================

// ORIGINAL (for source lookup):
class Gb {
    static instance;
    baseline = new Map;
    initialized = !1;
    mcpClient;
    lastProcessedTimestamps = new Map;
    rightFileDiagnosticsState = new Map;
    static getInstance() {
        if (!Gb.instance) Gb.instance = new Gb;
        return Gb.instance
    }
    initialize(A) {
        if (this.initialized) return;
        this.mcpClient = A, this.initialized = !0
    }
    async shutdown() {
        this.initialized = !1, this.baseline.clear(), this.rightFileDiagnosticsState.clear(), this.lastProcessedTimestamps.clear()
    }
    reset() {
        this.baseline.clear(), this.rightFileDiagnosticsState.clear(), this.lastProcessedTimestamps.clear()
    }
    normalizeFileUri(A) {
        let q = ["file://", "_claude_fs_right:", "_claude_fs_left:"],
            K = A;
        for (let Y of q)
            if (A.startsWith(Y)) {
                K = A.slice(Y.length);
                break
            } return $$(K)
    }
    async ensureFileOpened(A) {
        if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return;
        try {
            await pC("openFile", {
                filePath: A,
                preview: !1,
                startText: "",
                endText: "",
                selectToEndOfLine: !1,
                makeFrontmost: !1
            }, this.mcpClient)
        } catch (q) {
            _6(q)
        }
    }
    async beforeFileEdited(A) { /* ... see below */ }
    async getNewDiagnostics() { /* ... see below */ }
    // ... additional methods
}

// READABLE (for understanding):
class DiagnosticsManager {
    static instance;
    baseline = new Map();              // filePath → Diagnostic[]
    initialized = false;
    mcpClient;                         // IDE MCP client reference
    lastProcessedTimestamps = new Map(); // filePath → timestamp
    rightFileDiagnosticsState = new Map(); // For diff view right pane tracking

    static getInstance() {
        if (!DiagnosticsManager.instance) {
            DiagnosticsManager.instance = new DiagnosticsManager();
        }
        return DiagnosticsManager.instance;
    }

    initialize(mcpClient) {
        if (this.initialized) return;
        this.mcpClient = mcpClient;
        this.initialized = true;
    }

    async shutdown() {
        this.initialized = false;
        this.baseline.clear();
        this.rightFileDiagnosticsState.clear();
        this.lastProcessedTimestamps.clear();
    }

    reset() {
        // Called when re-entering a session - clear all baselines
        this.baseline.clear();
        this.rightFileDiagnosticsState.clear();
        this.lastProcessedTimestamps.clear();
    }
}

// Mapping: Gb→DiagnosticsManager, $→normalizeFilePath (for cross-platform paths)
```

---

## State Management

### Three Internal Maps

| Map | Type | Purpose |
|-----|------|---------|
| `baseline` | `Map<string, Diagnostic[]>` | Stores the diagnostic snapshot for each file before edits |
| `lastProcessedTimestamps` | `Map<string, number>` | Tracks when each file's baseline was captured (for debugging) |
| `rightFileDiagnosticsState` | `Map<string, Diagnostic[]>` | Tracks diagnostics in the "right" pane of IDE diff view |

**Why `rightFileDiagnosticsState`:** When Claude Code shows a diff in the IDE, it creates a virtual file with a `_claude_fs_right:` URI scheme. The IDE's LSP may report diagnostics for both the original file (`file://`) and the diff preview (`_claude_fs_right:`). The manager tracks the right-pane diagnostics separately to avoid double-counting issues.

---

## URI Normalization Algorithm

```javascript
// ============================================
// normalizeFileUri - Normalize various IDE URI schemes to file path
// Location: chunks.170.mjs:761-769
// ============================================

// ORIGINAL (for source lookup):
normalizeFileUri(A) {
    let q = ["file://", "_claude_fs_right:", "_claude_fs_left:"],
        K = A;
    for (let Y of q)
        if (A.startsWith(Y)) {
            K = A.slice(Y.length);
            break
        } return $$(K)
}

// READABLE (for understanding):
normalizeFileUri(uri) {
    const URI_PREFIXES = ["file://", "_claude_fs_right:", "_claude_fs_left:"];

    let normalized = uri;
    for (const prefix of URI_PREFIXES) {
        if (uri.startsWith(prefix)) {
            normalized = uri.slice(prefix.length);
            break;
        }
    }

    // $$ is a cross-platform path normalizer (handles Windows vs Unix)
    return normalizePath(normalized);
}

// Mapping: $→normalizePath, K→normalized, q→URI_PREFIXES
```

**Why multiple URI schemes:**
- `file://` - Standard IDE file reference
- `_claude_fs_right:` - Right pane in diff view (proposed changes)
- `_claude_fs_left:` - Left pane in diff view (original content)

All three need to be normalized to the same file path for baseline comparison.

---

## Key Methods

### `handleQueryStart` - Session Lifecycle Hook

```javascript
// ============================================
// handleQueryStart - Initialize or reset diagnostics at session start
// Location: chunks.170.mjs:854-859
// ============================================

// ORIGINAL (for source lookup):
async handleQueryStart(A) {
    if (!this.initialized) {
        let q = Gv(A);
        if (q) this.initialize(q)
    } else this.reset()
}

// READABLE (for understanding):
async handleQueryStart(toolUseContext) {
    if (!this.initialized) {
        // First session - find IDE MCP client and initialize
        let ideClient = findConnectedIdeClient(toolUseContext);
        if (ideClient) {
            this.initialize(ideClient);
        }
    } else {
        // Re-entering session - clear old baselines
        this.reset();
    }
}

// Mapping: Gv→findConnectedIdeClient, A→toolUseContext, q→ideClient
```

**When called:** At the start of each LLM query cycle (chunks.196.mjs:725).

**Design decision:** Instead of capturing a global baseline at session start, the manager only captures baselines for files being edited (`beforeFileEdited`). This lazy approach is more efficient and handles the common case where the user starts working on specific files.

---

### `beforeFileEdited` - Pre-Edit Baseline Capture

```javascript
// ============================================
// beforeFileEdited - Capture diagnostic baseline before file edit
// Location: chunks.170.mjs:785-805
// ============================================

// ORIGINAL (for source lookup):
async beforeFileEdited(A) {
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return;
    let q = Date.now();
    try {
        let K = await pC("getDiagnostics", {
                uri: `file://${A}`
            }, this.mcpClient),
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
    // Guard: only work if initialized and IDE is connected
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") {
        return;
    }

    let timestamp = Date.now();

    try {
        // Fetch current diagnostics from IDE via MCP
        let response = await callMcpTool("getDiagnostics", {
            uri: `file://${filePath}`
        }, this.mcpClient);

        // Parse the response - may be empty or contain diagnostics
        let diagnosticResult = this.parseDiagnosticResult(response)[0];

        if (diagnosticResult) {
            // Validate: IDE should report diagnostics for the file we asked about
            if (!pathsEqual(this.normalizeFileUri(filePath), this.normalizeFileUri(diagnosticResult.uri))) {
                logError(new DiagnosticsPathMismatchError(
                    `Diagnostics file path mismatch: expected ${filePath}, got ${diagnosticResult.uri})`
                ));
                return;
            }

            let normalizedPath = this.normalizeFileUri(filePath);
            this.baseline.set(normalizedPath, diagnosticResult.diagnostics);
            this.lastProcessedTimestamps.set(normalizedPath, timestamp);
        } else {
            // No diagnostics for this file - store empty baseline
            let normalizedPath = this.normalizeFileUri(filePath);
            this.baseline.set(normalizedPath, []);
            this.lastProcessedTimestamps.set(normalizedPath, timestamp);
        }
    } catch (error) {
        // Silently ignore - IDE may not support getDiagnostics
    }
}

// Mapping: pC→callMcpTool, fGq→pathsEqual, _6→logError, GGq→DiagnosticsPathMismatchError
```

**When called:** Before every file edit operation (chunks.139.mjs:163, chunks.170.mjs:1338).

**Why capture before edit:** The goal is to know what problems existed *before* Claude Code's changes, so we can identify what problems were *introduced* by those changes.

**Key insight:** The method stores an empty baseline (`[]`) even when no diagnostics exist. This ensures `getNewDiagnostics` knows the file was tracked, preventing it from being treated as "never captured".

---

### `getNewDiagnostics` - Delta Computation

```javascript
// ============================================
// getNewDiagnostics - Fetch current diagnostics and compute delta
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
    A.filter((z) => this.baseline.has(this.normalizeFileUri(z.uri))).filter((z) => z.uri.startsWith("_claude_fs_right:")).forEach((z) => {
        K.set(this.normalizeFileUri(z.uri), z)
    });
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

    // Fetch all diagnostics from IDE
    let allDiagnostics = [];
    try {
        let response = await callMcpTool("getDiagnostics", {}, this.mcpClient);
        allDiagnostics = this.parseDiagnosticResult(response);
    } catch (error) {
        return [];
    }

    // Filter to files we've tracked (have baselines)
    let fileDiagnostics = allDiagnostics
        .filter(d => this.baseline.has(this.normalizeFileUri(d.uri)))
        .filter(d => d.uri.startsWith("file://"));

    // Build map of right-pane diagnostics (diff view)
    let rightPaneMap = new Map();
    allDiagnostics
        .filter(d => this.baseline.has(this.normalizeFileUri(d.uri)))
        .filter(d => d.uri.startsWith("_claude_fs_right:"))
        .forEach(d => {
            rightPaneMap.set(this.normalizeFileUri(d.uri), d);
        });

    let newDiagnostics = [];

    for (let diagResult of fileDiagnostics) {
        let normalizedPath = this.normalizeFileUri(diagResult.uri);
        let baselineDiags = this.baseline.get(normalizedPath) || [];

        // Check if there's a right-pane (diff view) result
        let rightPaneResult = rightPaneMap.get(normalizedPath);
        let currentResult = diagResult;

        if (rightPaneResult) {
            // Prefer right-pane diagnostics for diff view
            let prevRightDiags = this.rightFileDiagnosticsState.get(normalizedPath);
            if (!prevRightDiags || !this.areDiagnosticArraysEqual(prevRightDiags, rightPaneResult.diagnostics)) {
                currentResult = rightPaneResult;
            }
            this.rightFileDiagnosticsState.set(normalizedPath, rightPaneResult.diagnostics);
        }

        // Compute delta: diagnostics in current but not in baseline
        let deltaDiagnostics = currentResult.diagnostics.filter(d =>
            !baselineDiags.some(baselineDiag => this.areDiagnosticsEqual(d, baselineDiag))
        );

        if (deltaDiagnostics.length > 0) {
            newDiagnostics.push({
                uri: diagResult.uri,
                diagnostics: deltaDiagnostics
            });
        }

        // Update baseline for next comparison
        this.baseline.set(normalizedPath, currentResult.diagnostics);
    }

    return newDiagnostics;
}

// Mapping: A→allDiagnostics, q→fileDiagnostics, K→rightPaneMap, Y→newDiagnostics,
//          z→diagResult, _→normalizedPath, w→baselineDiags, O→rightPaneResult
```

**Algorithm analysis:**

1. **Fetch all diagnostics** from IDE via `getDiagnostics` MCP tool
2. **Filter to tracked files** - only files with baselines (were edited or opened)
3. **Handle diff view edge case** - IDE may report diagnostics for both original file and diff preview
4. **Compute delta** - filter out diagnostics that existed in baseline
5. **Update baseline** - new baseline includes current state for next comparison

**Why `filter(d => this.baseline.has(...))`:** The manager only reports diagnostics for files it has tracked. This prevents surfacing issues in unrelated files that the user happened to have open.

---

### `areDiagnosticsEqual` - Diagnostic Deduplication

```javascript
// ============================================
// areDiagnosticsEqual - Compare two diagnostics for equality
// Location: chunks.170.mjs:847-849
// ============================================

// ORIGINAL (for source lookup):
areDiagnosticsEqual(A, q) {
    return A.message === q.message && A.severity === q.severity && A.source === q.source && A.code === q.code && A.range.start.line === q.range.start.line && A.range.start.character === q.range.start.character && A.range.end.line === q.range.end.line && A.range.end.character === q.range.end.character
}

// READABLE (for understanding):
areDiagnosticsEqual(diagA, diagB) {
    return (
        diagA.message === diagB.message &&
        diagA.severity === diagB.severity &&
        diagA.source === diagB.source &&      // e.g., "typescript", "eslint"
        diagA.code === diagB.code &&          // e.g., "TS2304"
        diagA.range.start.line === diagB.range.start.line &&
        diagA.range.start.character === diagB.range.start.character &&
        diagA.range.end.line === diagB.range.end.line &&
        diagA.range.end.character === diagB.range.end.character
    );
}

// Mapping: A→diagA, q→diagB
```

**What it compares:** Seven fields for equality - message, severity, source, code, and all four range coordinates (start line/char, end line/char).

**Why not use just message:** The same message (e.g., "Cannot find name 'x'") could appear multiple times at different locations or from different sources. Including all fields ensures accurate deduplication.

---

## System Reminder Integration

### Attachment Generation

**Location:** `chunks.147.mjs:789-798`

```javascript
// ============================================
// getIdeDiagnosticsAttachment - Fetch new diagnostics for system reminder
// Location: chunks.147.mjs:789-798
// ============================================

// ORIGINAL (for source lookup):
async function cuY(A) {
    if (!A.options.tools.some((K) => z3(K, Q7))) return [];
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
    // Only proceed if Edit tool is available (diagnostics are most useful for edits)
    let hasEditTool = toolUseContext.options.tools.some(tool => tool.name === "Edit");
    if (!hasEditTool) return [];

    let newDiagnostics = await diagnosticsManager.getNewDiagnostics();
    if (newDiagnostics.length === 0) return [];

    return [{
        type: "diagnostics",
        files: newDiagnostics,
        isNew: true
    }];
}

// Mapping: cuY→getIdeDiagnosticsAttachment, A→toolUseContext, Nl→diagnosticsManager, z3→toolNameMatches, Q7→"Edit"
```

### Formatting for LLM Context

**Location:** `chunks.174.mjs:236-245`

```javascript
// ============================================
// Diagnostics formatting for system reminder
// Location: chunks.174.mjs:236-245
// ============================================

// ORIGINAL (for source lookup):
case "diagnostics": {
    if (A.files.length === 0) return [];
    let K = Gb.formatDiagnosticsSummary(A.files);
    return b5([p1({
        content: `<new-diagnostics>The following new diagnostic issues were detected:

${K}</new-diagnostics>`,
        isMeta: !0
    })])
}

// READABLE (for understanding):
case "diagnostics": {
    if (attachment.files.length === 0) return [];

    let formattedSummary = DiagnosticsManager.formatDiagnosticsSummary(attachment.files);
    return [
        createTextBlock({
            content: `<new-diagnostics>The following new diagnostic issues were detected:

${formattedSummary}</new-diagnostics>`,
            isMeta: true  // Meta blocks are lower priority in context
        })
    ];
}

// Mapping: Gb→DiagnosticsManager, b5→array wrap, p1→createTextBlock
```

### Formatting Method

```javascript
// ============================================
// formatDiagnosticsSummary - Format diagnostics for LLM consumption
// Location: chunks.170.mjs:860-874
// ============================================

// ORIGINAL (for source lookup):
static formatDiagnosticsSummary(A) {
    let K = A.map((Y) => {
        let z = Y.uri.split("/").pop() || Y.uri,
            _ = Y.diagnostics.map((w) => {
                return `  ${Gb.getSeveritySymbol(w.severity)} [Line ${w.range.start.line+1}:${w.range.start.character+1}] ${w.message}${w.code?` [${w.code}]`:""}${w.source?` (${w.source})`:""}`
            }).join(`
`);
        return `${z}:
${_}`
    }).join(`

`);
    if (K.length > ZGq) return K.slice(0, ZGq - 12) + "…[truncated]";
    return K
}

// READABLE (for understanding):
static formatDiagnosticsSummary(diagnosticResults) {
    let formatted = diagnosticResults.map(result => {
        let filename = result.uri.split("/").pop() || result.uri;

        let issues = result.diagnostics.map(diag => {
            let lineNum = diag.range.start.line + 1;    // Convert 0-based to 1-based
            let colNum = diag.range.start.character + 1;
            let severitySymbol = this.getSeveritySymbol(diag.severity);

            let line = `  ${severitySymbol} [Line ${lineNum}:${colNum}] ${diag.message}`;
            if (diag.code) line += ` [${diag.code}]`;
            if (diag.source) line += ` (${diag.source})`;

            return line;
        }).join("\n");

        return `${filename}:\n${issues}`;
    }).join("\n\n");

    // Truncate if too long (prevents context bloat)
    const MAX_LENGTH = 4000;
    if (formatted.length > MAX_LENGTH) {
        return formatted.slice(0, MAX_LENGTH - 12) + "…[truncated]";
    }
    return formatted;
}

// Mapping: ZGq→MAX_DIAGNOSTIC_SUMMARY_LENGTH (4000)
```

**Example output:**
```
main.ts:
  ✗ [Line 15:10] Cannot find name 'undefinedVar' [TS2304] (typescript)
  ⚠ [Line 23:5] Unused variable 'temp' [no-unused-vars] (eslint)

utils.ts:
  ✗ [Line 8:1] Expected ';' but found '}' [JS1005] (javascript)
```

### Severity Symbols

```javascript
// ============================================
// getSeveritySymbol - Map severity to display symbol
// Location: chunks.170.mjs:875-882
// ============================================

// ORIGINAL (for source lookup):
static getSeveritySymbol(A) {
    return {
        Error: a6.cross,
        Warning: a6.warning,
        Info: a6.info,
        Hint: a6.star
    } [A] || a6.bullet
}

// READABLE (for understanding):
static getSeveritySymbol(severity) {
    const SYMBOLS = {
        Error: "✗",      // Cross mark
        Warning: "⚠",    // Warning triangle
        Info: "ℹ",       // Info circle
        Hint: "★"        // Star (less visible, hints are suggestions)
    };
    return SYMBOLS[severity] || "•";  // Bullet as fallback
}

// Mapping: a6→symbol constants object
```

---

## Lifecycle Integration

### Session Start Hook

**Location:** `chunks.196.mjs:725`

```javascript
// In REPL component, at query start:
Nl.handleQueryStart(V6);  // V6 = toolUseContext
```

### Session End Hook

**Location:** `chunks.196.mjs:1274`

```javascript
// Cleanup effect in REPL component:
useEffect(() => {
    return () => {
        Nl.shutdown();  // Clear all state on unmount
    };
}, []);
```

### Pre-Edit Hook

**Location:** `chunks.139.mjs:163`, `chunks.170.mjs:1338`

```javascript
// In Edit tool execution:
LW6([filePath], editContent);     // Open file in IDE first
await Nl.beforeFileEdited(filePath);  // Capture baseline
// ... then perform the edit
```

---

## Error Handling

### DiagnosticsPathMismatchError

```javascript
// ============================================
// DiagnosticsPathMismatchError - Error for URI validation failures
// Location: chunks.170.mjs:899
// ============================================

// ORIGINAL (for source lookup):
GGq = class GGq extends iL6 {};

// READABLE (for understanding):
class DiagnosticsPathMismatchError extends Error {
    constructor(message) {
        super(message);
        this.name = "DiagnosticsPathMismatchError";
    }
}

// Mapping: GGq→DiagnosticsPathMismatchError, iL6→Error
```

**When thrown:** When the IDE returns diagnostics for a different file path than requested. This can happen with:
- Symlink resolution differences
- Case-insensitive filesystem issues (macOS/Windows)
- Virtual file system remapping

---

## Design Rationale

### Why Baseline-Delta Pattern

**Problem:** Pre-existing code issues (errors, warnings) would constantly appear in the LLM context, wasting tokens and potentially confusing the model about what problems it caused.

**Solution:** Capture a snapshot of diagnostics before each edit, then report only the delta (new issues not in the snapshot).

**Trade-offs:**
- **Pro:** LLM focuses on issues it introduced, more actionable
- **Pro:** Less context consumption, more efficient
- **Con:** May miss issues that existed but weren't detected until after edit (false positives)
- **Con:** Requires MCP round-trip before each edit (slight latency)

### Why Per-File Baselines (Not Global)

The manager stores baselines per-file rather than capturing all diagnostics at session start:

1. **Efficiency:** Only track files being actively edited
2. **Freshness:** Baseline captured right before edit, not 30 minutes ago
3. **Simplicity:** No need to detect file renames/deletes

### Why Not Filter by Severity

The manager reports all severity levels (Error, Warning, Info, Hint) without filtering because:
1. Warnings often indicate real issues (unused variables, deprecated APIs)
2. Hints can be useful (suggested refactorings)
3. The LLM can decide what to act on based on context

---

## Deep Algorithm Analysis: Delta Computation

### Algorithm Overview

The `getNewDiagnostics` method computes the delta between current diagnostics and the captured baseline through a multi-step filtering process:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Diagnostics Delta Computation Algorithm                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Step 1: Fetch All Diagnostics from IDE                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ MCP call: getDiagnostics({})                                         │    │
│  │ Returns: [{ uri: string, diagnostics: Diagnostic[] }, ...]          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Step 2: Filter to Tracked Files (have baselines)                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ fileDiagnostics = results.filter(d => baseline.has(normalize(d.uri)))│   │
│  │                    .filter(d => d.uri.startsWith("file://"))         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Step 3: Build Right-Pane Map (for diff view)                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ rightPaneMap = results.filter(d => d.uri.startsWith("_claude_fs_right:"))│ │
│  │                .reduce((map, d) => map.set(normalize(d.uri), d))     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Step 4: For Each Tracked File                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ for each fileResult in fileDiagnostics:                              │    │
│  │   normalizedPath = normalizeFileUri(fileResult.uri)                 │    │
│  │   baselineDiags = baseline.get(normalizedPath)                      │    │
│  │                                                                      │    │
│  │   // Check for right-pane (diff view) result                        │    │
│  │   rightPaneResult = rightPaneMap.get(normalizedPath)                │    │
│  │   if (rightPaneResult exists && changed from last check):          │    │
│  │     currentResult = rightPaneResult  // Prefer diff view diagnostics│    │
│  │   else:                                                              │    │
│  │     currentResult = fileResult                                       │    │
│  │                                                                      │    │
│  │   // Compute delta                                                   │    │
│  │   delta = currentResult.diagnostics.filter(d =>                      │    │
│  │     !baselineDiags.some(b => areDiagnosticsEqual(d, b))             │    │
│  │   )                                                                  │    │
│  │                                                                      │    │
│  │   if (delta.length > 0):                                             │    │
│  │     newDiagnostics.push({ uri, diagnostics: delta })                │    │
│  │                                                                      │    │
│  │   // Update baseline for next comparison                             │    │
│  │   baseline.set(normalizedPath, currentResult.diagnostics)           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Step 5: Return New Diagnostics                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ return newDiagnostics                                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Code Analysis: getNewDiagnostics

**Location:** `chunks.170.mjs:806-839`

```javascript
// ============================================
// getNewDiagnostics - Compute delta of new diagnostics
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
    A.filter((z) => this.baseline.has(this.normalizeFileUri(z.uri))).filter((z) => z.uri.startsWith("_claude_fs_right:")).forEach((z) => {
        K.set(this.normalizeFileUri(z.uri), z)
    });
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
    // Guard: must be initialized and connected
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") {
        return [];
    }

    // =====================================================
    // STEP 1: Fetch all diagnostics from IDE
    // =====================================================
    let allDiagnostics = [];
    try {
        let response = await callMcpTool("getDiagnostics", {}, this.mcpClient);
        allDiagnostics = this.parseDiagnosticResult(response);
    } catch (error) {
        return [];  // IDE may not support getDiagnostics
    }

    // =====================================================
    // STEP 2: Filter to tracked files (file:// URIs with baselines)
    // =====================================================
    let fileDiagnostics = allDiagnostics
        .filter(d => this.baseline.has(this.normalizeFileUri(d.uri)))
        .filter(d => d.uri.startsWith("file://"));

    // =====================================================
    // STEP 3: Build right-pane map (diff view diagnostics)
    // =====================================================
    let rightPaneMap = new Map();
    allDiagnostics
        .filter(d => this.baseline.has(this.normalizeFileUri(d.uri)))
        .filter(d => d.uri.startsWith("_claude_fs_right:"))
        .forEach(d => {
            rightPaneMap.set(this.normalizeFileUri(d.uri), d);
        });

    // =====================================================
    // STEP 4: Compute delta for each tracked file
    // =====================================================
    let newDiagnostics = [];

    for (let fileResult of fileDiagnostics) {
        let normalizedPath = this.normalizeFileUri(fileResult.uri);
        let baselineDiags = this.baseline.get(normalizedPath) || [];

        // Check for right-pane (diff view) result
        let rightPaneResult = rightPaneMap.get(normalizedPath);
        let currentResult = fileResult;

        if (rightPaneResult) {
            // Check if right-pane diagnostics changed since last check
            let prevRightDiags = this.rightFileDiagnosticsState.get(normalizedPath);
            if (!prevRightDiags || !this.areDiagnosticArraysEqual(prevRightDiags, rightPaneResult.diagnostics)) {
                currentResult = rightPaneResult;  // Use diff view diagnostics
            }
            // Update right-pane state for next comparison
            this.rightFileDiagnosticsState.set(normalizedPath, rightPaneResult.diagnostics);
        }

        // Compute delta: diagnostics in current but not in baseline
        let deltaDiagnostics = currentResult.diagnostics.filter(d =>
            !baselineDiags.some(baselineDiag => this.areDiagnosticsEqual(d, baselineDiag))
        );

        // Only include files with new diagnostics
        if (deltaDiagnostics.length > 0) {
            newDiagnostics.push({
                uri: fileResult.uri,
                diagnostics: deltaDiagnostics
            });
        }

        // Update baseline for next comparison (rolling baseline)
        this.baseline.set(normalizedPath, currentResult.diagnostics);
    }

    // =====================================================
    // STEP 5: Return new diagnostics
    // =====================================================
    return newDiagnostics;
}

// Mapping: A→allDiagnostics, q→fileDiagnostics, K→rightPaneMap, Y→newDiagnostics,
//          z→fileResult, _→normalizedPath, w→baselineDiags, O→rightPaneResult
```

### Diagnostic Equality Algorithm

**Location:** `chunks.170.mjs:847-849`

```javascript
// ============================================
// areDiagnosticsEqual - Compare two diagnostics for equality
// Location: chunks.170.mjs:847-849
// ============================================

// ORIGINAL (for source lookup):
areDiagnosticsEqual(A, q) {
    return A.message === q.message && A.severity === q.severity && A.source === q.source && A.code === q.code && A.range.start.line === q.range.start.line && A.range.start.character === q.range.start.character && A.range.end.line === q.range.end.line && A.range.end.character === q.range.end.character
}

// READABLE (for understanding):
areDiagnosticsEqual(diagA, diagB) {
    // Compare all identifying fields for deduplication
    return (
        // Message content must match
        diagA.message === diagB.message &&

        // Severity (Error/Warning/Info/Hint)
        diagA.severity === diagB.severity &&

        // Source (e.g., "typescript", "eslint", "gopls")
        diagA.source === diagB.source &&

        // Error code (e.g., "TS2304", "no-unused-vars")
        diagA.code === diagB.code &&

        // Range: start position
        diagA.range.start.line === diagB.range.start.line &&
        diagA.range.start.character === diagB.range.start.character &&

        // Range: end position
        diagA.range.end.line === diagB.range.end.line &&
        diagA.range.end.character === diagB.range.end.character
    );
}

// Mapping: A→diagA, q→diagB
```

**Why compare 7 fields:**
- `message` alone: Same message can appear at multiple locations
- `source` + `code`: Different linters may report same issue differently
- `range`: Same error may move between lines as code changes
- All fields together: Accurate deduplication across IDE state changes

### Diff View Handling

**Why special handling for `_claude_fs_right:` URIs:**

When Claude Code shows a diff preview in the IDE:
1. The IDE creates a virtual file with `_claude_fs_right:` URI scheme
2. The LSP runs on both original (`file://`) and preview (`_claude_fs_right:`)
3. Diagnostics may differ between them (preview has fixes applied)

The algorithm:
1. Collects both `file://` and `_claude_fs_right:` diagnostics
2. Prefers right-pane diagnostics if they changed since last check
3. Tracks right-pane state separately to detect changes

**This prevents:**
- Double-counting diagnostics
- Stale diagnostics from original file overriding preview diagnostics
- False positives when switching between diff view and original

---

## Related Documents

- [ide_tools.md](./ide_tools.md) - MCP tools including `getDiagnostics`
- [connection_lifecycle.md](./connection_lifecycle.md) - IDE connection management
- [overview.md](./overview.md) - High-level IDE architecture
- [../04_system_reminder/implementation.md](../04_system_reminder/implementation.md) - System reminder architecture