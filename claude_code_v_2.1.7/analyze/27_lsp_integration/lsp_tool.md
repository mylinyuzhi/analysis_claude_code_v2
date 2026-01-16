# LSP Tool Integration (2.1.7)

> **NEW in 2.0.74** - Language Server Protocol for code intelligence features

---

## Overview

The LSP tool provides code intelligence features by interfacing with Language Server Protocol servers. It enables:
- Go to definition
- Find references
- Hover information (documentation, type info)
- Document symbols
- Workspace symbol search
- Go to implementation
- Call hierarchy analysis (incoming/outgoing calls)

> For server implementation details, see [lsp_server.md](./lsp_server.md)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LSP Tool (vU0)                           │
│  - validateInput() validates file exists                        │
│  - call() orchestrates LSP request                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  LSP Server Manager (Uy2)                       │
│  - Manages server lifecycle (start/stop/restart)                │
│  - Routes requests by file extension                            │
│  - Maintains file open state (textDocument/didOpen)             │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  LSP Server Instance (Vy2)                      │
│  - Wraps individual LSP server process                          │
│  - Handles JSON-RPC communication via vscode-jsonrpc            │
│  - Manages retry logic on ContentModified errors                │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  LSP Client (Dy2)                               │
│  - Low-level process management                                 │
│  - StreamMessageReader/Writer for stdio communication           │
│  - Handles initialize/shutdown LSP lifecycle                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tool Definition

```javascript
// ============================================
// lspTool - Main LSP Tool Definition
// Location: chunks.120.mjs:15-176
// ============================================

// ORIGINAL (for source lookup):
vU0 = {
  name: Sg2,                    // "LSP"
  maxResultSizeChars: 1e5,      // 100,000 chars max
  isLsp: !0,
  async description() { return xU0 },
  userFacingName: vg2,
  isEnabled() { ... },          // Check if any LSP server available
  inputSchema: Ol5,
  outputSchema: Ml5,
  isConcurrencySafe() { return !0 },
  isReadOnly() { return !0 },
  getPath({ filePath: A }) { return Y4(A) },
  async validateInput(A) { ... },
  async checkPermissions(A, Q) { ... },
  async prompt() { return xU0 },
  renderToolUseMessage: kg2,
  async call(A, Q) { ... },     // Main execution
  mapToolResultToToolResultBlockParam(A, Q) { ... }
}

// READABLE (for understanding):
lspTool = {
  name: LSP_TOOL_NAME,          // "LSP"
  maxResultSizeChars: 100000,
  isLsp: true,
  async description() { return lspToolDescription },
  userFacingName: lspUserFacingName,
  isEnabled() {
    // Check manager state and server availability
    if (getLspManagerStatus().status === "failed") return false;
    const manager = getLspManager();
    if (!manager) return false;
    const servers = manager.getAllServers();
    if (servers.size === 0) return false;
    // At least one server must not be in error state
    return Array.from(servers.values()).some(s => s.state !== "error");
  },
  inputSchema: lspInputSchema,
  outputSchema: lspOutputSchema,
  isConcurrencySafe() { return true },
  isReadOnly() { return true },
  getPath({ filePath }) { return resolvePath(filePath) },
  async validateInput(input) { ... },
  async checkPermissions(input, context) { ... },
  async prompt() { return lspToolDescription },
  renderToolUseMessage: formatLspToolUse,
  async call(input, context) { ... },
  mapToolResultToToolResultBlockParam(result, toolUseId) { ... }
}

// Mapping: vU0→lspTool, Sg2→LSP_TOOL_NAME, xU0→lspToolDescription, Ol5→lspInputSchema, Ml5→lspOutputSchema
```

**Key insight:** The tool is read-only and concurrency-safe, meaning multiple LSP operations can run in parallel without side effects.

---

## Tool Prompt (LLM Description)

The tool prompt is the description shown to the LLM when it considers using the LSP tool:

```javascript
// ============================================
// lspToolDescription - LSP Tool Description (Prompt for LLM)
// Location: chunks.119.mjs:3122-3141
// ============================================

// ORIGINAL (for source lookup):
xU0 = `Interact with Language Server Protocol (LSP) servers to get code intelligence features.

Supported operations:
- goToDefinition: Find where a symbol is defined
- findReferences: Find all references to a symbol
- hover: Get hover information (documentation, type info) for a symbol
- documentSymbol: Get all symbols (functions, classes, variables) in a document
- workspaceSymbol: Search for symbols across the entire workspace
- goToImplementation: Find implementations of an interface or abstract method
- prepareCallHierarchy: Get call hierarchy item at a position (functions/methods)
- incomingCalls: Find all functions/methods that call the function at a position
- outgoingCalls: Find all functions/methods called by the function at a position

All operations require:
- filePath: The file to operate on
- line: The line number (1-based, as shown in editors)
- character: The character offset (1-based, as shown in editors)

Note: LSP servers must be configured for the file type. If no server is available, an error will be returned.`

// Mapping: xU0→lspToolDescription, Sg2→LSP_TOOL_NAME ("LSP")
```

**Key insight:** The prompt clearly explains:
1. What the tool does (code intelligence via LSP)
2. All 9 supported operations with brief descriptions
3. Required parameters (filePath, line, character) with 1-based indexing clarification
4. Constraints (servers must be configured)

---

## Input/Output Schema

```javascript
// ============================================
// lspInputSchema - LSP Input Schema
// Location: chunks.120.mjs:15-19
// ============================================

// ORIGINAL (for source lookup):
Ol5 = m.strictObject({
  operation: m.enum([
    "goToDefinition", "findReferences", "hover", "documentSymbol",
    "workspaceSymbol", "goToImplementation", "prepareCallHierarchy",
    "incomingCalls", "outgoingCalls"
  ]).describe("The LSP operation to perform"),
  filePath: m.string().describe("The absolute or relative path to the file"),
  line: m.number().int().positive().describe("The line number (1-based, as shown in editors)"),
  character: m.number().int().positive().describe("The character offset (1-based, as shown in editors)")
})

// READABLE (for understanding):
lspInputSchema = zod.strictObject({
  operation: zod.enum([...]),   // 9 supported operations
  filePath: zod.string(),       // File to operate on
  line: zod.number().int().positive(),      // 1-based line
  character: zod.number().int().positive()  // 1-based character
})

// Mapping: Ol5→lspInputSchema
```

```javascript
// ============================================
// lspOutputSchema - LSP Output Schema
// Location: chunks.120.mjs:20-25
// ============================================

// ORIGINAL (for source lookup):
Ml5 = m.object({
  operation: m.enum([...]).describe("The LSP operation that was performed"),
  result: m.string().describe("The formatted result of the LSP operation"),
  filePath: m.string().describe("The file path the operation was performed on"),
  resultCount: m.number().int().nonnegative().optional().describe("Number of results"),
  fileCount: m.number().int().nonnegative().optional().describe("Number of files containing results")
})

// READABLE (for understanding):
lspOutputSchema = zod.object({
  operation: zod.enum([...]),
  result: zod.string(),          // Formatted human-readable result
  filePath: zod.string(),
  resultCount: zod.number().optional(),
  fileCount: zod.number().optional()
})

// Mapping: Ml5→lspOutputSchema
```

---

## Main Tool Handler (call)

```javascript
// ============================================
// lspTool.call - Main LSP Operation Handler
// Location: chunks.120.mjs:99-167
// ============================================

// ORIGINAL (for source lookup):
async call(A, Q) {
  let B = Y4(A.filePath),
    G = o1();
  if (f6A().status === "pending") await Ty2();
  let Y = Rc();
  if (!Y) return e(Error("LSP server manager not initialized when tool was called")), {
    data: { operation: A.operation, result: "LSP server manager not initialized...", filePath: A.filePath }
  };
  let { method: J, params: X } = Rl5(A, B);
  try {
    if (!Y.isFileOpen(B)) {
      let F = await wl5(B, "utf-8");
      await Y.openFile(B, F)
    }
    let I = await Y.sendRequest(B, J, X);
    if (I === void 0) return k(`No LSP server available for file type ${yU0.extname(B)}...`), {
      data: { operation: A.operation, result: `No LSP server available for file type: ${yU0.extname(B)}`, filePath: A.filePath }
    };
    // Special handling for call hierarchy
    if (A.operation === "incomingCalls" || A.operation === "outgoingCalls") {
      let F = I;
      if (!F || F.length === 0) return { data: { ... resultCount: 0, fileCount: 0 } };
      let H = A.operation === "incomingCalls" ? "callHierarchy/incomingCalls" : "callHierarchy/outgoingCalls";
      I = await Y.sendRequest(B, H, { item: F[0] });
    }
    let { formatted: D, resultCount: W, fileCount: K } = jl5(A.operation, I, G);
    return { data: { operation: A.operation, result: D, filePath: A.filePath, resultCount: W, fileCount: K } }
  } catch (I) {
    let W = (I instanceof Error ? I : Error(String(I))).message;
    return e(Error(`LSP tool request failed for ${A.operation} on ${A.filePath}: ${W}`)), {
      data: { operation: A.operation, result: `Error performing ${A.operation}: ${W}`, filePath: A.filePath }
    }
  }
}

// READABLE (for understanding):
async call(input, context) {
  let resolvedPath = resolvePath(input.filePath);
  let workingDir = getCwd();

  // Wait for manager initialization if pending
  if (getLspManagerStatus().status === "pending") {
    await waitForLspManagerInit();
  }

  let manager = getLspManager();
  if (!manager) {
    logError(Error("LSP server manager not initialized when tool was called"));
    return { data: { operation: input.operation, result: "LSP server manager not initialized...", filePath: input.filePath } };
  }

  // Build LSP request from operation
  let { method, params } = buildLspRequest(input, resolvedPath);

  try {
    // Ensure file is opened in LSP server
    if (!manager.isFileOpen(resolvedPath)) {
      let content = await readFile(resolvedPath, "utf-8");
      await manager.openFile(resolvedPath, content);
    }

    let result = await manager.sendRequest(resolvedPath, method, params);

    if (result === undefined) {
      logDebug(`No LSP server available for file type ${path.extname(resolvedPath)}...`);
      return { data: { operation: input.operation, result: `No LSP server available for file type: ${path.extname(resolvedPath)}`, filePath: input.filePath } };
    }

    // Call hierarchy requires two requests: prepareCallHierarchy + incomingCalls/outgoingCalls
    if (input.operation === "incomingCalls" || input.operation === "outgoingCalls") {
      let callItems = result;
      if (!callItems || callItems.length === 0) {
        return { data: { ... resultCount: 0, fileCount: 0 } };
      }
      let callMethod = input.operation === "incomingCalls"
        ? "callHierarchy/incomingCalls"
        : "callHierarchy/outgoingCalls";
      result = await manager.sendRequest(resolvedPath, callMethod, { item: callItems[0] });
    }

    // Format result for display
    let { formatted, resultCount, fileCount } = formatLspResult(input.operation, result, workingDir);
    return { data: { operation: input.operation, result: formatted, filePath: input.filePath, resultCount, fileCount } };
  } catch (error) {
    let message = (error instanceof Error ? error : Error(String(error))).message;
    logError(Error(`LSP tool request failed for ${input.operation} on ${input.filePath}: ${message}`));
    return { data: { operation: input.operation, result: `Error performing ${input.operation}: ${message}`, filePath: input.filePath } };
  }
}

// Mapping: A→input, Q→context, B→resolvedPath, G→workingDir, Y→manager, J→method, X→params
// Mapping: Rl5→buildLspRequest, jl5→formatLspResult, Y4→resolvePath, o1→getCwd
// Mapping: f6A→getLspManagerStatus, Ty2→waitForLspManagerInit, Rc→getLspManager
```

**Key insight:** The call hierarchy operations (`incomingCalls`, `outgoingCalls`) require a two-step process:
1. First call `textDocument/prepareCallHierarchy` to get the call item at position
2. Then call `callHierarchy/incomingCalls` or `callHierarchy/outgoingCalls` with that item

---

## LSP Request Builder

```javascript
// ============================================
// buildLspRequest - Build LSP Request from Operation
// Location: chunks.119.mjs:3320-3407
// ============================================

// ORIGINAL (for source lookup):
function Rl5(A, Q) {
  let B = Ll5(Q).href,
    G = { line: A.line - 1, character: A.character - 1 };  // Convert to 0-based
  switch (A.operation) {
    case "goToDefinition":
      return { method: "textDocument/definition", params: { textDocument: { uri: B }, position: G } };
    case "findReferences":
      return { method: "textDocument/references", params: { textDocument: { uri: B }, position: G, context: { includeDeclaration: !0 } } };
    case "hover":
      return { method: "textDocument/hover", params: { textDocument: { uri: B }, position: G } };
    case "documentSymbol":
      return { method: "textDocument/documentSymbol", params: { textDocument: { uri: B } } };
    case "workspaceSymbol":
      return { method: "workspace/symbol", params: { query: "" } };
    case "goToImplementation":
      return { method: "textDocument/implementation", params: { textDocument: { uri: B }, position: G } };
    case "prepareCallHierarchy":
    case "incomingCalls":
    case "outgoingCalls":
      return { method: "textDocument/prepareCallHierarchy", params: { textDocument: { uri: B }, position: G } };
  }
}

// READABLE (for understanding):
function buildLspRequest(input, filePath) {
  let fileUri = pathToFileUri(filePath).href;
  let position = { line: input.line - 1, character: input.character - 1 };  // 1-based → 0-based

  switch (input.operation) {
    case "goToDefinition":
      return { method: "textDocument/definition", params: { textDocument: { uri: fileUri }, position } };
    case "findReferences":
      return { method: "textDocument/references", params: { textDocument: { uri: fileUri }, position, context: { includeDeclaration: true } } };
    case "hover":
      return { method: "textDocument/hover", params: { textDocument: { uri: fileUri }, position } };
    case "documentSymbol":
      return { method: "textDocument/documentSymbol", params: { textDocument: { uri: fileUri } } };
    case "workspaceSymbol":
      return { method: "workspace/symbol", params: { query: "" } };  // Empty query = all symbols
    case "goToImplementation":
      return { method: "textDocument/implementation", params: { textDocument: { uri: fileUri }, position } };
    case "prepareCallHierarchy":
    case "incomingCalls":
    case "outgoingCalls":
      // All start with prepareCallHierarchy (additional call made in handler)
      return { method: "textDocument/prepareCallHierarchy", params: { textDocument: { uri: fileUri }, position } };
  }
}

// Mapping: Rl5→buildLspRequest, Ll5→pathToFileUri, A→input, Q→filePath, B→fileUri, G→position
```

**Key insight:** Position conversion is critical - the tool accepts 1-based positions (as shown in editors) but LSP protocol uses 0-based positions internally.

---

## Result Formatters

### Go to Definition

```javascript
// ============================================
// formatGoToDefinitionResult - Format Go To Definition Result
// Location: chunks.119.mjs:2878-2896
// ============================================

// ORIGINAL (for source lookup):
function PU0(A, Q) {
  if (!A) return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
  if (Array.isArray(A)) {
    let G = A.map((X) => qg2(X) ? Ug2(X) : X),
      Z = G.filter((X) => !X || !X.uri);
    if (Z.length > 0) k(`formatGoToDefinitionResult: Filtering out ${Z.length} invalid location(s)...`, { level: "warn" });
    let Y = G.filter((X) => X && X.uri);
    if (Y.length === 0) return "No definition found...";
    if (Y.length === 1) return `Defined in ${WK1(Y[0],Q)}`;
    let J = Y.map((X) => `  ${WK1(X,Q)}`).join(`\n`);
    return `Found ${Y.length} definitions:\n${J}`
  }
  let B = qg2(A) ? Ug2(A) : A;
  return `Defined in ${WK1(B,Q)}`
}

// READABLE (for understanding):
function formatGoToDefinitionResult(result, workingDir) {
  if (!result) {
    return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
  }

  if (Array.isArray(result)) {
    // Normalize LocationLink to Location format
    let locations = result.map(item => isLocationLink(item) ? locationLinkToLocation(item) : item);
    let invalid = locations.filter(loc => !loc || !loc.uri);
    if (invalid.length > 0) {
      logDebug(`formatGoToDefinitionResult: Filtering out ${invalid.length} invalid location(s)...`, { level: "warn" });
    }
    let valid = locations.filter(loc => loc && loc.uri);

    if (valid.length === 0) return "No definition found...";
    if (valid.length === 1) return `Defined in ${formatLocation(valid[0], workingDir)}`;

    let formatted = valid.map(loc => `  ${formatLocation(loc, workingDir)}`).join("\n");
    return `Found ${valid.length} definitions:\n${formatted}`;
  }

  // Single location
  let location = isLocationLink(result) ? locationLinkToLocation(result) : result;
  return `Defined in ${formatLocation(location, workingDir)}`;
}

// Mapping: PU0→formatGoToDefinitionResult, qg2→isLocationLink, Ug2→locationLinkToLocation, WK1→formatLocation
```

### Find References

```javascript
// ============================================
// formatFindReferencesResult - Format Find References Result
// Location: chunks.119.mjs:2898-2921
// ============================================

// ORIGINAL (for source lookup):
function Lg2(A, Q) {
  if (!A || A.length === 0) return "No references found...";
  let B = A.filter((J) => !J || !J.uri);
  if (B.length > 0) k(`formatFindReferencesResult: Filtering out ${B.length} invalid location(s)...`, { level: "warn" });
  let G = A.filter((J) => J && J.uri);
  if (G.length === 0) return "No references found...";
  if (G.length === 1) return `Found 1 reference:\n  ${WK1(G[0],Q)}`;
  let Z = wg2(G, Q),
    Y = [`Found ${G.length} references across ${Z.size} files:`];
  for (let [J, X] of Z) {
    Y.push(`\n${J}:`);
    for (let I of X) {
      let D = I.range.start.line + 1,
        W = I.range.start.character + 1;
      Y.push(`  Line ${D}:${W}`)
    }
  }
  return Y.join(`\n`)
}

// READABLE (for understanding):
function formatFindReferencesResult(locations, workingDir) {
  if (!locations || locations.length === 0) {
    return "No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.";
  }

  let invalid = locations.filter(loc => !loc || !loc.uri);
  if (invalid.length > 0) {
    logDebug(`formatFindReferencesResult: Filtering out ${invalid.length} invalid location(s)...`, { level: "warn" });
  }
  let valid = locations.filter(loc => loc && loc.uri);

  if (valid.length === 0) return "No references found...";
  if (valid.length === 1) return `Found 1 reference:\n  ${formatLocation(valid[0], workingDir)}`;

  // Group by file
  let groupedByFile = groupLocationsByFile(valid, workingDir);
  let lines = [`Found ${valid.length} references across ${groupedByFile.size} files:`];

  for (let [filePath, fileLocations] of groupedByFile) {
    lines.push(`\n${filePath}:`);
    for (let location of fileLocations) {
      let line = location.range.start.line + 1;
      let char = location.range.start.character + 1;
      lines.push(`  Line ${line}:${char}`);
    }
  }

  return lines.join("\n");
}

// Mapping: Lg2→formatFindReferencesResult, wg2→groupLocationsByFile
```

### Hover

```javascript
// ============================================
// formatHoverResult - Format Hover Result
// Location: chunks.119.mjs:2935-2946
// ============================================

// ORIGINAL (for source lookup):
function Og2(A, Q) {
  if (!A) return "No hover information available...";
  let B = Ul5(A.contents);
  if (A.range) {
    let G = A.range.start.line + 1,
      Z = A.range.start.character + 1;
    return `Hover info at ${G}:${Z}:\n\n${B}`
  }
  return B
}

// READABLE (for understanding):
function formatHoverResult(hover, workingDir) {
  if (!hover) {
    return "No hover information available. This may occur if the cursor is not on a symbol, or if the LSP server has not fully indexed the file.";
  }

  let content = extractHoverContent(hover.contents);

  if (hover.range) {
    let line = hover.range.start.line + 1;
    let char = hover.range.start.character + 1;
    return `Hover info at ${line}:${char}:\n\n${content}`;
  }

  return content;
}

// Mapping: Og2→formatHoverResult, Ul5→extractHoverContent
```

### Document Symbol

```javascript
// ============================================
// formatDocumentSymbolResult - Format Document Symbol Result
// Location: chunks.119.mjs:2979-3003
// ============================================

// ORIGINAL (for source lookup):
function Mg2(A, Q = 0) {     // flattenDocumentSymbol(symbol, depth)
  let B = [];
  B.push({
    name: A.name,
    kind: A.kind,
    range: A.range,
    depth: Q
  });
  if (A.children)
    for (let X of A.children) B.push(...Mg2(X, Q + 1));
  return B
}

function Rg2(A, Q) {         // formatDocumentSymbolResult(symbols, workingDir)
  if (!A || A.length === 0)
    return "No symbols found in this document.";
  let G = [],
    Z = [];
  for (let Y of A) Z.push(...Mg2(Y));
  for (let { name: Y, kind: J, range: X, depth: I } of Z) {
    let D = X.start.line + 1,
      W = rHA(J),            // symbolKindToName
      K = "  ".repeat(I);
    G.push(`${K}${W}: ${Y} (line ${D})`)
  }
  return G.join(`\n`)
}

// READABLE (for understanding):
function flattenDocumentSymbol(symbol, depth = 0) {
  let result = [];
  result.push({
    name: symbol.name,
    kind: symbol.kind,
    range: symbol.range,
    depth: depth
  });
  if (symbol.children) {
    for (let child of symbol.children) {
      result.push(...flattenDocumentSymbol(child, depth + 1));
    }
  }
  return result;
}

function formatDocumentSymbolResult(symbols, workingDir) {
  if (!symbols || symbols.length === 0) {
    return "No symbols found in this document.";
  }

  let lines = [];
  let flatSymbols = [];

  // Flatten hierarchical symbols
  for (let symbol of symbols) {
    flatSymbols.push(...flattenDocumentSymbol(symbol));
  }

  // Format each symbol with indentation based on depth
  for (let { name, kind, range, depth } of flatSymbols) {
    let line = range.start.line + 1;
    let kindName = symbolKindToName(kind);
    let indent = "  ".repeat(depth);
    lines.push(`${indent}${kindName}: ${name} (line ${line})`);
  }

  return lines.join("\n");
}

// Mapping: Rg2→formatDocumentSymbolResult, Mg2→flattenDocumentSymbol, rHA→symbolKindToName
```

**Key insight:** Document symbols can be hierarchical (e.g., methods inside classes). The formatter flattens the hierarchy and uses indentation to show nesting depth.

### Workspace Symbol

```javascript
// ============================================
// formatWorkspaceSymbolResult - Format Workspace Symbol Result
// Location: chunks.119.mjs:3001-3023
// ============================================

// ORIGINAL (for source lookup):
function SU0(A, Q) {
  if (!A || A.length === 0) return "No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.";
  let B = A.filter((J) => !J || !J.location || !J.location.uri);
  if (B.length > 0) k(`formatWorkspaceSymbolResult: Filtering out ${B.length} invalid symbol(s) - this should have been caught earlier`, { level: "warn" });
  let G = A.filter((J) => J && J.location && J.location.uri);
  if (G.length === 0) return "No symbols found in workspace...";
  let Z = [`Found ${G.length} symbol${G.length===1?"":"s"} in workspace:`],
    Y = wg2(G, Q);
  for (let [J, X] of Y) {
    Z.push(`\n${J}:`);
    for (let I of X) {
      let D = rHA(I.kind),
        W = I.location.range.start.line + 1,
        K = `  ${I.name} (${D}) - Line ${W}`;
      if (I.containerName) K += ` in ${I.containerName}`;
      Z.push(K)
    }
  }
  return Z.join(`\n`)
}

// READABLE (for understanding):
function formatWorkspaceSymbolResult(symbols, workingDir) {
  if (!symbols || symbols.length === 0) {
    return "No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.";
  }

  // Filter out invalid symbols
  let invalid = symbols.filter(sym => !sym || !sym.location || !sym.location.uri);
  if (invalid.length > 0) {
    logDebug(`formatWorkspaceSymbolResult: Filtering out ${invalid.length} invalid symbol(s) - this should have been caught earlier`, { level: "warn" });
  }
  let valid = symbols.filter(sym => sym && sym.location && sym.location.uri);

  if (valid.length === 0) {
    return "No symbols found in workspace...";
  }

  let lines = [`Found ${valid.length} symbol${valid.length === 1 ? "" : "s"} in workspace:`];

  // Group symbols by file
  let groupedByFile = groupLocationsByFile(valid, workingDir);

  for (let [filePath, fileSymbols] of groupedByFile) {
    lines.push(`\n${filePath}:`);
    for (let symbol of fileSymbols) {
      let kindName = symbolKindToName(symbol.kind);
      let line = symbol.location.range.start.line + 1;
      let entry = `  ${symbol.name} (${kindName}) - Line ${line}`;
      // Include container name if present (e.g., "method in ClassName")
      if (symbol.containerName) {
        entry += ` in ${symbol.containerName}`;
      }
      lines.push(entry);
    }
  }

  return lines.join("\n");
}

// Mapping: SU0→formatWorkspaceSymbolResult, wg2→groupLocationsByFile, rHA→symbolKindToName
```

**Key insight:** Workspace symbols include a `containerName` field that shows the parent context (e.g., a method's containing class). This helps distinguish symbols with the same name in different contexts.

### Call Hierarchy

```javascript
// ============================================
// formatCallHierarchyItem - Format Single Call Hierarchy Item
// Location: chunks.119.mjs:3026-3035
// ============================================

// ORIGINAL (for source lookup):
function Ng2(A, Q) {
  if (!A.uri) return k("formatCallHierarchyItem: CallHierarchyItem has undefined URI", { level: "warn" }),
    `${A.name} (${rHA(A.kind)}) - <unknown location>`;
  let B = hbA(A.uri, Q),
    G = A.range.start.line + 1,
    Z = rHA(A.kind),
    Y = `${A.name} (${Z}) - ${B}:${G}`;
  if (A.detail) Y += ` [${A.detail}]`;
  return Y
}

// READABLE (for understanding):
function formatCallHierarchyItem(item, workingDir) {
  if (!item.uri) {
    logDebug("formatCallHierarchyItem: CallHierarchyItem has undefined URI", { level: "warn" });
    return `${item.name} (${symbolKindToName(item.kind)}) - <unknown location>`;
  }

  let relativePath = uriToRelativePath(item.uri, workingDir);
  let line = item.range.start.line + 1;
  let kindName = symbolKindToName(item.kind);
  let result = `${item.name} (${kindName}) - ${relativePath}:${line}`;

  // Include detail if present (e.g., function signature)
  if (item.detail) {
    result += ` [${item.detail}]`;
  }

  return result;
}

// Mapping: Ng2→formatCallHierarchyItem, hbA→uriToRelativePath, rHA→symbolKindToName
```

```javascript
// ============================================
// formatPrepareCallHierarchy, formatIncomingCalls, formatOutgoingCalls
// Location: chunks.119.mjs:3038-3115
// ============================================

// ORIGINAL (for source lookup):
function _g2(A, Q) {         // formatPrepareCallHierarchy(items, workingDir)
  if (!A || A.length === 0)
    return "No call hierarchy item found at this location.";
  let B = A[0],
    G = B.uri.replace("file://", ""),
    Z = Mc.relative(Q, G),
    Y = B.range.start.line + 1;
  return `Call hierarchy item: ${B.name} (${rHA(B.kind)}) at ${Z}:${Y}`
}

function jg2(A, Q) {         // formatIncomingCalls(calls, workingDir)
  if (!A || A.length === 0)
    return "No incoming calls found (no functions call this location).";
  let B = [`Found ${A.length} incoming call(s):`];
  for (let G of A) {
    let Z = G.from,
      Y = Z.uri.replace("file://", ""),
      J = Mc.relative(Q, Y),
      X = Z.range.start.line + 1,
      I = rHA(Z.kind);
    B.push(`  ${I}: ${Z.name} at ${J}:${X}`);
    if (G.fromRanges && G.fromRanges.length > 0) {
      for (let D of G.fromRanges) {
        let W = D.start.line + 1;
        B.push(`    - call at line ${W}`)
      }
    }
  }
  return B.join(`\n`)
}

function Tg2(A, Q) {         // formatOutgoingCalls(calls, workingDir)
  if (!A || A.length === 0)
    return "No outgoing calls found (this location doesn't call other functions).";
  let B = [`Found ${A.length} outgoing call(s):`];
  for (let G of A) {
    let Z = G.to,
      Y = Z.uri.replace("file://", ""),
      J = Mc.relative(Q, Y),
      X = Z.range.start.line + 1,
      I = rHA(Z.kind);
    B.push(`  ${I}: ${Z.name} at ${J}:${X}`);
    if (G.fromRanges && G.fromRanges.length > 0) {
      for (let D of G.fromRanges) {
        let W = D.start.line + 1;
        B.push(`    - call at line ${W}`)
      }
    }
  }
  return B.join(`\n`)
}

// READABLE (for understanding):
function formatPrepareCallHierarchy(items, workingDir) {
  if (!items || items.length === 0) {
    return "No call hierarchy item found at this location.";
  }
  let item = items[0];
  let filePath = item.uri.replace("file://", "");
  let relativePath = path.relative(workingDir, filePath);
  let line = item.range.start.line + 1;
  return `Call hierarchy item: ${item.name} (${symbolKindToName(item.kind)}) at ${relativePath}:${line}`;
}

function formatIncomingCalls(calls, workingDir) {
  if (!calls || calls.length === 0) {
    return "No incoming calls found (no functions call this location).";
  }

  let lines = [`Found ${calls.length} incoming call(s):`];
  for (let call of calls) {
    let caller = call.from;
    let filePath = caller.uri.replace("file://", "");
    let relativePath = path.relative(workingDir, filePath);
    let line = caller.range.start.line + 1;
    let kindName = symbolKindToName(caller.kind);
    lines.push(`  ${kindName}: ${caller.name} at ${relativePath}:${line}`);

    // Show specific call sites within the caller
    if (call.fromRanges && call.fromRanges.length > 0) {
      for (let range of call.fromRanges) {
        let callLine = range.start.line + 1;
        lines.push(`    - call at line ${callLine}`);
      }
    }
  }
  return lines.join("\n");
}

function formatOutgoingCalls(calls, workingDir) {
  if (!calls || calls.length === 0) {
    return "No outgoing calls found (this location doesn't call other functions).";
  }

  let lines = [`Found ${calls.length} outgoing call(s):`];
  for (let call of calls) {
    let callee = call.to;
    let filePath = callee.uri.replace("file://", "");
    let relativePath = path.relative(workingDir, filePath);
    let line = callee.range.start.line + 1;
    let kindName = symbolKindToName(callee.kind);
    lines.push(`  ${kindName}: ${callee.name} at ${relativePath}:${line}`);

    // Show specific call sites (where the call is made)
    if (call.fromRanges && call.fromRanges.length > 0) {
      for (let range of call.fromRanges) {
        let callLine = range.start.line + 1;
        lines.push(`    - call at line ${callLine}`);
      }
    }
  }
  return lines.join("\n");
}

// Mapping: _g2→formatPrepareCallHierarchy, jg2→formatIncomingCalls, Tg2→formatOutgoingCalls
```

**Key insight:** Call hierarchy provides bidirectional navigation:
- **Incoming calls**: "Who calls this function?" - useful for understanding impact of changes
- **Outgoing calls**: "What does this function call?" - useful for understanding dependencies

---

## Symbol Kind Mapping

```javascript
// ============================================
// symbolKindToName - Symbol Kind to Human-Readable Name
// Location: chunks.119.mjs:2948-2977
// ============================================

// ORIGINAL (for source lookup):
function rHA(A) {
  return {
    [1]: "File", [2]: "Module", [3]: "Namespace", [4]: "Package",
    [5]: "Class", [6]: "Method", [7]: "Property", [8]: "Field",
    [9]: "Constructor", [10]: "Enum", [11]: "Interface", [12]: "Function",
    [13]: "Variable", [14]: "Constant", [15]: "String", [16]: "Number",
    [17]: "Boolean", [18]: "Array", [19]: "Object", [20]: "Key",
    [21]: "Null", [22]: "EnumMember", [23]: "Struct", [24]: "Event",
    [25]: "Operator", [26]: "TypeParameter"
  }[A] || "Unknown"
}

// READABLE (for understanding):
function symbolKindToName(kind) {
  const kindMap = {
    1: "File", 2: "Module", 3: "Namespace", 4: "Package",
    5: "Class", 6: "Method", 7: "Property", 8: "Field",
    9: "Constructor", 10: "Enum", 11: "Interface", 12: "Function",
    13: "Variable", 14: "Constant", 15: "String", 16: "Number",
    17: "Boolean", 18: "Array", 19: "Object", 20: "Key",
    21: "Null", 22: "EnumMember", 23: "Struct", 24: "Event",
    25: "Operator", 26: "TypeParameter"
  };
  return kindMap[kind] || "Unknown";
}

// Mapping: rHA→symbolKindToName
```

---

## Symbol Extraction for UI

```javascript
// ============================================
// extractSymbolAtPosition - Extract Symbol at Position for Display
// Location: chunks.119.mjs:3143-3172
// ============================================

// ORIGINAL (for source lookup):
function xg2(A, Q, B) {
  try {
    let G = vA(),
      Z = Y4(A);
    if (!G.existsSync(Z)) return null;
    let J = G.readFileSync(Z, { encoding: "utf-8" }).split(`\n`);
    if (Q < 0 || Q >= J.length) return null;
    let X = J[Q];
    if (!X || B < 0 || B >= X.length) return null;
    let I = /[\w$'!]+|[+\-*/%&|^~<>=]+/g,
      D;
    while ((D = I.exec(X)) !== null) {
      let W = D.index,
        K = W + D[0].length;
      if (B >= W && B < K) {
        let V = D[0];
        return V.length > 30 ? V.slice(0, 27) + "..." : V
      }
    }
    return null
  } catch (G) {
    if (G instanceof Error) k(`Symbol extraction failed for ${A}:${Q}:${B}: ${G.message}`, { level: "warn" });
    return null
  }
}

// READABLE (for understanding):
function extractSymbolAtPosition(filePath, line, character) {
  try {
    let fs = getFs();
    let resolvedPath = resolvePath(filePath);

    if (!fs.existsSync(resolvedPath)) return null;

    let lines = fs.readFileSync(resolvedPath, { encoding: "utf-8" }).split("\n");

    if (line < 0 || line >= lines.length) return null;

    let lineContent = lines[line];
    if (!lineContent || character < 0 || character >= lineContent.length) return null;

    // Match identifiers OR operators
    let symbolRegex = /[\w$'!]+|[+\-*/%&|^~<>=]+/g;
    let match;

    while ((match = symbolRegex.exec(lineContent)) !== null) {
      let startIndex = match.index;
      let endIndex = startIndex + match[0].length;

      if (character >= startIndex && character < endIndex) {
        let symbol = match[0];
        // Truncate long symbols to 30 chars
        return symbol.length > 30 ? symbol.slice(0, 27) + "..." : symbol;
      }
    }
    return null;
  } catch (error) {
    if (error instanceof Error) {
      logDebug(`Symbol extraction failed for ${filePath}:${line}:${character}: ${error.message}`, { level: "warn" });
    }
    return null;
  }
}

// Mapping: xg2→extractSymbolAtPosition, vA→getFs, Y4→resolvePath
```

**Why this approach:**
- Extracts the symbol name at cursor position for displaying in the UI
- Uses regex to match both identifiers (`\w$'!`) and operators (`+-*/%&|^~<>=`)
- Truncates symbols > 30 chars to prevent UI overflow
- Independent of LSP - works even when LSP server is unavailable

---

## Supported Operations Summary

| Operation | LSP Method | Returns |
|-----------|------------|---------|
| `goToDefinition` | `textDocument/definition` | Definition location(s) |
| `findReferences` | `textDocument/references` | Reference locations |
| `hover` | `textDocument/hover` | Documentation, type info |
| `documentSymbol` | `textDocument/documentSymbol` | Symbols in file |
| `workspaceSymbol` | `workspace/symbol` | Symbols across workspace |
| `goToImplementation` | `textDocument/implementation` | Implementation locations |
| `prepareCallHierarchy` | `textDocument/prepareCallHierarchy` | Call hierarchy item |
| `incomingCalls` | `textDocument/prepareCallHierarchy` + `callHierarchy/incomingCalls` | Callers |
| `outgoingCalls` | `textDocument/prepareCallHierarchy` + `callHierarchy/outgoingCalls` | Callees |

---

## Related Symbols

> Symbol mappings: [symbol_index_infra.md](../00_overview/symbol_index_infra.md)

### Tool Definition
- `lspTool` (vU0) - Main LSP tool definition
- `LSP_TOOL_NAME` (Sg2) - Tool name constant "LSP"
- `lspToolDescription` (xU0) - Tool prompt description
- `lspInputSchema` (Ol5) - Zod input schema
- `lspOutputSchema` (Ml5) - Zod output schema

### Request Processing
- `buildLspRequest` (Rl5) - Build LSP request from operation
- `formatLspResult` (jl5) - Format LSP result for display
- `pathToFileUri` (Ll5) - Convert path to file:// URI
- `readFile` (wl5) - Read file contents

### Result Formatters
- `formatGoToDefinitionResult` (PU0) - Format definition result
- `formatFindReferencesResult` (Lg2) - Format references result
- `formatHoverResult` (Og2) - Format hover result
- `formatDocumentSymbolResult` (Rg2) - Format document symbols
- `flattenDocumentSymbol` (Mg2) - Flatten symbol hierarchy
- `formatWorkspaceSymbolResult` (SU0) - Format workspace symbols grouped by file
- `formatCallHierarchyItem` (Ng2) - Format single call hierarchy item
- `formatPrepareCallHierarchy` (_g2) - Format call hierarchy item
- `formatIncomingCalls` (jg2) - Format incoming callers
- `formatOutgoingCalls` (Tg2) - Format outgoing callees
- `symbolKindToName` (rHA) - Symbol kind to readable name

### Location Helpers
- `formatLocation` (WK1) - Format location as file:line:col
- `groupLocationsByFile` (wg2) - Group locations by file path
- `isLocationLink` (qg2) - Check if LocationLink type
- `locationLinkToLocation` (Ug2) - Convert LocationLink to Location
- `extractHoverContent` (Ul5) - Extract content from hover result

### UI Rendering
- `extractSymbolAtPosition` (xg2) - Extract symbol for UI display
- `formatLspToolUse` (kg2) - Format tool use message
- `lspUserFacingName` (vg2) - Tool display name
- `renderLspToolRejected` (bg2) - Render rejected message
- `renderLspToolError` (fg2) - Render error message
- `renderLspToolProgress` (hg2) - Render progress message
- `renderLspToolResult` (gg2) - Render result message

---

## See Also

- [lsp_server.md](./lsp_server.md) - Server implementation details
- [../25_plugin/](../25_plugin/) - Plugin system (LSP server configuration)
- [../00_overview/symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Complete symbol index
