# LSP Tool — v2.1.142

## Overview

`LSPTool` (`fE6` in cli_inner_pretty.js:382949) is the code-intelligence gateway. It exposes nine LSP operations (`goToDefinition`, `findReferences`, `hover`, `documentSymbol`, `workspaceSymbol`, `goToImplementation`, `prepareCallHierarchy`, `incomingCalls`, `outgoingCalls`) through a single tool. The tool routes the request through an internal `LspServerManager` which proxies to the configured language servers (TypeScript, Python, Rust, etc.). New in v2.1.142: plugins can ship LSP server configurations via their `lspServers` manifest key, and `/plugin` shows them in the details pane.

## Schema (Zod)

```javascript
// ============================================
// lspInputSchema — LSPTool input parameters (tool-compatible regular ZodObject)
// Location: cli_inner_pretty.js:382903-382922 / ze_() at runtime
// ============================================

// ORIGINAL (for source lookup):
// ze_() returns z.strictObject({ operation: enum(9 ops), filePath, line, character })

// READABLE (for understanding):
const lspInputSchema = z.strictObject({
  operation: z.enum([
    'goToDefinition', 'findReferences', 'hover',
    'documentSymbol', 'workspaceSymbol',
    'goToImplementation',
    'prepareCallHierarchy', 'incomingCalls', 'outgoingCalls',
  ]).describe('The LSP operation to perform'),
  filePath: z.string().describe('The absolute or relative path to the file'),
  line: z.number().int().positive().describe('The line number (1-based, as shown in editors)'),
  character: z.number().int().positive().describe('The character offset (1-based, as shown in editors)'),
});

// Mapping: ze_→lspInputSchema (lazy)
//
// Note: validateInput runs an additional pass through Pl7() — a discriminated union
// where each operation has its own required-parameter shape. workspaceSymbol uses
// `query` not `line`/`character`, but the tool-facing schema is the strictObject above
// (Pl7 → lspDiscriminatedSchema lets us return better validation error messages).
```

Output schema (`Ye_()`):
- `operation: ...`
- `result: string` — pre-formatted human-readable result
- `filePath: string`
- `resultCount?: number` — count of definitions/references/symbols
- `fileCount?: number` — count of distinct files

`maxResultSizeChars` is **100,000**. The tool sets `isLsp: true`, `shouldDefer: true`, `isReadOnly: true`, `isConcurrencySafe: true`. The `isEnabled()` predicate returns `isLspConnected()` — the tool drops out of the tool registry entirely when no LSP servers are connected (which keeps the tool list small for non-coding sessions).

## validateInput

```javascript
// ============================================
// validateInput — discriminated-union check + file existence + isFile assertion
// Location: cli_inner_pretty.js:382977-382995 (mirrors src/tools/LSPTool/LSPTool.ts:155-209)
// ============================================

// ORIGINAL (for source lookup):
// async validateInput(H) {
//   const $ = Pl7().safeParse(H); if (!$.success) return { result: !1, message: ..., errorCode: 3 };
//   const q = C$(); /* fs.stat → ENOENT → "File does not exist" → access error → "Cannot access file" → not-a-file → "Path is not a file" */
// }

// READABLE (for understanding):
async function validateInput(input) {
  // (1) Discriminated-union validation for better operation-specific error messages
  const parseResult = lspDiscriminatedSchema().safeParse(input);
  if (!parseResult.success) {
    return { result: false, message: `Invalid input: ${parseResult.error.message}`, errorCode: 3 };
  }

  // (2) File existence check
  const fs = getFsImplementation();
  const absolutePath = expandPath(input.filePath);
  if (absolutePath.startsWith('\\\\') || absolutePath.startsWith('//')) return { result: true };

  let stats;
  try {
    stats = await fs.stat(absolutePath);
  } catch (error) {
    if (isENOENT(error)) return { result: false, message: `File does not exist: ${input.filePath}`, errorCode: 1 };
    const err = toError(error);
    logError(new Error(`Failed to access file stats for LSP operation on ${input.filePath}: ${err.message}`));
    return { result: false, message: `Cannot access file: ${input.filePath}. ${err.message}`, errorCode: 4 };
  }
  if (!stats.isFile()) return { result: false, message: `Path is not a file: ${input.filePath}`, errorCode: 2 };
  return { result: true };
}

// Mapping: Pl7→lspDiscriminatedSchema, eq→expandPath, f8→isENOENT, y6→toError, EH→logError
```

The discriminated union check lets us emit operation-specific error messages: `goToDefinition` requires `line`/`character`, `workspaceSymbol` requires `query`. The outer schema (`ze_`) accepts both forms for tool-protocol compatibility; the discriminated check enforces semantic correctness.

## checkPermissions

```javascript
async function checkPermissions(input, context) {
  return checkReadPermissionForTool(LSPTool, input, context.getAppState().toolPermissionContext);
}
```

LSP is treated as a read operation — same shared walker as FileReadTool/GlobTool/GrepTool. Allow rules like `Read(src/**)` cover LSP queries against those files.

## call

```javascript
// ============================================
// LSPTool.call — wait for init → ensure file open → send request → format result
// Location: cli_inner_pretty.js:383007-383200 (mirrors src/tools/LSPTool/LSPTool.ts:224-450)
// ============================================

// ORIGINAL (for source lookup):
// async call(H, $) {
//   const q = eq(H.filePath); const K = I$();
//   if (QnH().status === "pending") await gB7(); // waitForInitialization
//   const A = qDH(); if (!A) return error("LSP server manager not initialized");
//   const { method, params } = fe_(H, q);
//   /* If file not open in LSP: read it, check size cap, openFile. */
//   let f = await A.sendRequest(q, method, params);
//   if (f === void 0) return "No LSP server available for file type";
//   /* For incomingCalls/outgoingCalls: 2-step process (prepareCallHierarchy first, then incoming/outgoing) */
//   /* For findReferences/goToDefinition/goToImplementation/workspaceSymbol: filter to cwd */
//   const { formatted, resultCount, fileCount } = we_(operation, f, K);
//   return { data: { operation, result: formatted, filePath, resultCount, fileCount } };
// }

// READABLE (for understanding):
async function call(input, _context) {
  const absolutePath = expandPath(input.filePath);
  const cwd = getCwd();

  // (1) Wait for LSP initialization (pending → wait)
  if (getInitializationStatus().status === 'pending') {
    await waitForInitialization();
  }

  // (2) Get manager — fail clearly if startup hadn't completed
  const manager = getLspServerManager();
  if (!manager) {
    logError(new Error('LSP server manager not initialized when tool was called'));
    return { data: { operation: input.operation, result: 'LSP server manager not initialized. This may indicate a startup issue.', filePath: input.filePath } };
  }

  // (3) Map operation → (LSP method, params)
  const { method, params } = getMethodAndParams(input, absolutePath);

  try {
    // (4) Ensure file is open in the server (textDocument/didOpen)
    if (!manager.isFileOpen(absolutePath)) {
      const handle = await fs.promises.open(absolutePath, 'r');
      try {
        const stats = await handle.stat();
        if (stats.size > MAX_LSP_FILE_SIZE_BYTES) {
          return { data: { operation: input.operation, result: `File too large for LSP analysis (${Math.ceil(stats.size / 1_000_000)}MB exceeds 10MB limit)`, filePath: input.filePath } };
        }
        const fileContent = await handle.readFile({ encoding: 'utf-8' });
        await manager.openFile(absolutePath, fileContent);
      } finally {
        await handle.close();
      }
    }

    // (5) Send the request
    let result = await manager.sendRequest(absolutePath, method, params);
    if (result === undefined) {
      logForDebugging(`No LSP server available for file type ${path.extname(absolutePath)} for operation ${input.operation} on file ${input.filePath}`);
      return { data: { operation: input.operation, result: `No LSP server available for file type: ${path.extname(absolutePath)}`, filePath: input.filePath } };
    }

    // (6) Two-step call hierarchy: prepare first, then incomingCalls/outgoingCalls
    if (input.operation === 'incomingCalls' || input.operation === 'outgoingCalls') {
      const items = result;
      if (!items || items.length === 0) {
        return { data: { operation: input.operation, result: 'No call hierarchy item found at this position', filePath: input.filePath, resultCount: 0, fileCount: 0 } };
      }
      const followUp = input.operation === 'incomingCalls' ? 'callHierarchy/incomingCalls' : 'callHierarchy/outgoingCalls';
      result = await manager.sendRequest(absolutePath, followUp, { item: items[0] });
      if (result === undefined) logForDebugging(`LSP server returned undefined for ${followUp} on ${input.filePath}`);
    }

    // (7) Cross-file location operations: filter results to cwd
    if (result && Array.isArray(result) && (
        input.operation === 'findReferences' ||
        input.operation === 'goToDefinition' ||
        input.operation === 'goToImplementation' ||
        input.operation === 'workspaceSymbol')) {
      if (input.operation === 'workspaceSymbol') {
        const symbols = result;
        const locations = symbols.filter(s => s?.location?.uri).map(s => s.location);
        const filtered = await filterLocationsToCwd(locations, cwd);
        const allowed = new Set(filtered.map(l => l.uri));
        result = symbols.filter(s => !s?.location?.uri || allowed.has(s.location.uri));
      } else {
        const locations = result.map(lspLocationLinkToLocation);
        const filtered = await filterLocationsToCwd(locations, cwd);
        const allowed = new Set(filtered.map(l => l.uri));
        result = result.filter(item => {
          const loc = lspLocationLinkToLocation(item);
          return !loc.uri || allowed.has(loc.uri);
        });
      }
    }

    // (8) Format
    const { formatted, resultCount, fileCount } = formatLspResult(input.operation, result, cwd);
    return { data: { operation: input.operation, result: formatted, filePath: input.filePath, resultCount, fileCount } };
  } catch (error) {
    /* error path — return data.result with error message */
  }
}

// Mapping: eq→expandPath, QnH→getInitializationStatus, gB7→waitForInitialization,
//          qDH→getLspServerManager, fe_→getMethodAndParams, we_→formatLspResult,
//          hl7→filterLocationsToCwd, p38→lspLocationLinkToLocation
```

### Key algorithm: two-step call hierarchy

**What it does:** Convert "Find calls into/out of the function at this position" into the right pair of LSP requests.

**How it works:**
1. LSP defines call hierarchy as a three-method protocol:
   - `textDocument/prepareCallHierarchy` returns `CallHierarchyItem[]` for a position
   - `callHierarchy/incomingCalls` takes a `CallHierarchyItem` and returns its callers
   - `callHierarchy/outgoingCalls` takes a `CallHierarchyItem` and returns its callees
2. The tool collapses this into a single "incomingCalls" or "outgoingCalls" operation.
3. First call: send `prepareCallHierarchy` (mapped from input.operation), which yields `CallHierarchyItem[]`.
4. If the array is empty, return "No call hierarchy item found at this position".
5. Otherwise, take the first item and send `callHierarchy/incomingCalls` or `/outgoingCalls`.

**Why this approach:** Asking the model to call prepareCallHierarchy first and then the follow-up is friction — the model would just chain them anyway, but with an extra round-trip. The tool merges the two-step protocol into a single operation. The user-facing prompt explicitly says "incomingCalls: Find all functions/methods that call the function at a position" without mentioning the prepare step.

**Edge case:** If the first item from prepareCallHierarchy is wrong (e.g., overload resolution), the tool has no UI for selecting an alternative. This is a known limitation — usually the first item is what the user wants.

### Key algorithm: cwd filtering

**What it does:** Restrict `findReferences`/`goToDefinition`/`goToImplementation`/`workspaceSymbol` results to files under the current working directory.

**How it works:**
1. For non-`workspaceSymbol` operations: map results to `Location` objects (collapsing `LocationLink` if needed) via `lspLocationLinkToLocation`.
2. Run `filterLocationsToCwd(locations, cwd)` which keeps only URIs whose file path is under `cwd`.
3. Build a `Set` of allowed URIs.
4. Filter the original results array, keeping items whose URI is in the set.

**Why this approach:** LSP servers often return references in dependencies (`node_modules/**`, `.venv/**`, system headers). The model rarely wants those — it wants project code. Filtering at the tool level reduces noise without per-server config.

**Trade-off:** A reference in a sibling project (e.g., a workspace package outside cwd) is filtered out. This is occasionally wrong but the model can pass an explicit path to broaden the search if needed.

### Key algorithm: file-size cap (10 MB)

**What it does:** Reject LSP analysis on files > 10 MB.

**How it works:** `MAX_LSP_FILE_SIZE_BYTES = 10_000_000`. Before sending `textDocument/didOpen`, the tool stats the file. If size exceeds the cap, it returns a friendly error.

**Why this approach:** LSP servers OOM on very large files (a single 50MB minified bundle can take 10+ seconds to parse + use 1GB+ RAM). Capping at 10MB keeps the LSP responsive for the typical session.

### Key algorithm: lazy textDocument/didOpen

**What it does:** Only open files in the LSP server when the model actually queries them.

**How it works:** `manager.isFileOpen(absolutePath)` returns false for files not yet opened. The tool then reads the file from disk, calls `manager.openFile(absolutePath, fileContent)` which sends `textDocument/didOpen`, and proceeds. Subsequent operations on the same file skip the read+open step.

**Why this approach:** Sending `didOpen` for every file in the project on startup would (a) take seconds, (b) trigger full project analysis in some servers (TypeScript), and (c) blow the memory budget. Lazy open keeps the working set small.

### v2.1.98: `clientInfo` field

Added in 2.1.98 (per CHANGELOG): the LSP client's `initialize` request now includes a `clientInfo` field identifying Claude Code by name and version. This lets language servers log telemetry, customise behaviour, and gate experimental features per client. Same pattern as VS Code, Cursor, and other LSP clients.

### v2.1.121: expand diagnostic on click/Ctrl+O

> LSP diagnostic summaries now expand on click/ctrl+o and show the expand hint

The compact-mode UI shows e.g., "3 type errors" with a click-to-expand affordance. Ctrl+O on the row also expands. New in 2.1.121, replacing the always-expanded prior render.

### v2.1.142: plugin-provided LSP servers

> The `/plugin` details pane and `claude plugin details` now show LSP servers a plugin provides

Plugins can declare `lspServers` in their manifest. Pre-2.1.142, this key was loaded but not surfaced in `/plugin` details or `claude plugin details`. The 2.1.142 release exposes them so users can see what code intelligence each plugin contributes.

## Render methods

- `renderToolUseMessage` (`kl7`) — `LSP(operation, file:line:char)` chrome.
- `renderToolUseErrorMessage` (`Nl7`) — for validateInput failures.
- `renderToolResultMessage` (`El7`) — formatted `LSPResultSummary` showing operation, file count, result count, then the result body.

`mapToolResultToToolResultBlockParam` is uniform — the `result` field is already pre-formatted for the model. It just wraps in a `tool_result` block.

`formatLspResult` (`we_`) is operation-aware:
- `goToDefinition` → `formatGoToDefinitionResult` (path:line:char with snippet preview)
- `findReferences` → `formatFindReferencesResult` (grouped by file, count per file)
- `hover` → `formatHoverResult` (markdown documentation block)
- `documentSymbol` → `formatDocumentSymbolResult` (nested symbol tree)
- `workspaceSymbol` → `formatWorkspaceSymbolResult` (flat list with kind labels)
- `prepareCallHierarchy` → `formatPrepareCallHierarchyResult` (item names + locations)
- `incomingCalls` → `formatIncomingCallsResult` (caller list + ranges)
- `outgoingCalls` → `formatOutgoingCallsResult` (callee list + ranges)

## Key insights

1. **`isEnabled()` returns `isLspConnected()`.** The tool drops out of the registry when no servers are connected. For non-coding sessions (writing markdown docs, e.g.), this saves tool-context bytes. Reconnecting an LSP server (via VS Code extension, `/mcp reconnect`, etc.) re-enables the tool dynamically.

2. **`shouldDefer: true`** plus `isEnabled()` gating means the tool is double-deferred: even when enabled, it's only loaded when the model activates it via tool search.

3. **`isLsp: true`** is a marker for the orchestrator. Some renderers and the tool registry use it to group LSP queries under a single section for display.

4. **No `preparePermissionMatcher`** — LSP doesn't define a wildcard pattern (the input is a position, not a path-glob). Permission checking goes via `getPath(input)` which returns the absolute file path.

5. **`maxResultSizeChars: 100_000`** — bigger than Grep (20K) because `findReferences` against a common identifier can produce a lot of locations. The cap mainly affects `workspaceSymbol` queries with very broad search terms.

6. **Permission errors and "no server" errors differ.** A read-deny rejection comes from `checkPermissions`. A "no server" message comes from `call()`'s `result === undefined` branch. The model gets different actionable hints accordingly.

7. **Cwd filtering uses `URI.fsPath` resolution.** A reference in `/tmp/foo.ts` from a cwd of `/home/user/proj` is excluded. Symlinks are resolved before comparison.

## v2.1.112 → v2.1.142 deltas

| Version | Change | Where |
|---------|--------|-------|
| 2.1.98 | Added `clientInfo` field to LSP `initialize` request — servers can identify Claude Code by name+version | `LspServerManager.initialize` |
| 2.1.119 | (no LSP-specific changes; tool registration fixes apply) | — |
| 2.1.121 | LSP diagnostic summaries expand on click/Ctrl+O and show the expand hint | UI side, not tool side |
| 2.1.126 | `/usage` Ctrl+S hanging fix (X11 clipboard) — unrelated to LSP but shipped together | — |
| 2.1.142 | Plugins with `lspServers` manifest key surfaced in `/plugin` details and `claude plugin details` | `/plugin` details pane |
| 2.1.142 | (LSP tool-level behaviour unchanged) | — |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_filesystem.md](../00_overview/symbol_additions_v2_1_142_tools_filesystem.md) — full mapping table

Key functions in this document:
- `LSPTool` (fE6) — top-level tool object built by `XK`
- `LSP_DESCRIPTION` (t06) — the prompt/description string for the tool
- `MAX_LSP_FILE_SIZE_BYTES` (Ae_) — 10 MB cap
- `isLspConnected` (FB7) — gate for `isEnabled()`
- `getInitializationStatus` (QnH) — LSP init status getter
- `waitForInitialization` (gB7) — async wait for LSP init
- `getLspServerManager` (qDH) — manager getter
- `getMethodAndParams` (fe_) — operation → (method, params) mapper
- `formatLspResult` (we_) — operation-aware formatter
- `filterLocationsToCwd` (hl7) — restrict cross-file results to cwd
- `lspLocationLinkToLocation` (p38) — coerce LocationLink to Location
- `checkReadPermissionForTool` (CwH) — shared with Read/Glob/Grep
- `lspDiscriminatedSchema` (Pl7) — per-operation validation for better error messages
- `toError` (y6) / `logError` (EH) — error coercer + logger
