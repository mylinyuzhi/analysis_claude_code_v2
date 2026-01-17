# Tree-sitter Bash AST Parsing System

## Overview

Tree-sitter in Claude Code is **exclusively used for Bash command parsing**, primarily serving the permission checking system. It parses shell commands into Abstract Syntax Trees (AST) via WASM runtime, extracting pipelines, redirections, and environment variables.

**Key Information:**
- **Purpose**: Bash command permission analysis
- **WASM Files**: `tree-sitter.wasm` + `tree-sitter-bash.wasm`
- **No Other Languages**: Does not support JS/TS/Python syntax parsing
- **Caching**: Parser singleton, no command-level cache

> **Note**: File path completion is provided by the [FileIndex](./file_path_index.md) system, unrelated to Tree-sitter.

---

## Table of Contents

- [1. Trigger Conditions](#1-trigger-conditions)
- [2. Parsing Flow](#2-parsing-flow)
- [3. WASM Loading](#3-wasm-loading)
- [4. Parser and Language Classes](#4-parser-and-language-classes)
- [5. Command Classes](#5-command-classes)
- [6. AST Node Types](#6-ast-node-types)
- [7. Related Symbols](#7-related-symbols)

---

## 1. Trigger Conditions

### When Tree-sitter Parsing Triggers

```
+---------------------------------------------------------------------+
|                    Tree-sitter Trigger Conditions                     |
+---------------------------------------------------------------------+
|                                                                       |
|  Parsing Scenarios:                                                  |
|  +---------------------------------------------------------------+   |
|  | 1. Bash tool executes any command                             |   |
|  |    -> Permission check analyzes command structure             |   |
|  |                                                                |   |
|  | 2. Command contains pipe |                                    |   |
|  |    -> Split into segments, check each permission              |   |
|  |    -> Example: ls | grep foo | head                           |   |
|  |                                                                |   |
|  | 3. Command contains redirection > or >>                       |   |
|  |    -> Detect output target file                               |   |
|  |    -> Example: echo "data" > output.txt                       |   |
|  |                                                                |   |
|  | 4. Command contains environment variable assignment           |   |
|  |    -> Extract VAR=value prefix                                |   |
|  |    -> Example: NODE_ENV=prod npm start                        |   |
|  +---------------------------------------------------------------+   |
|                                                                       |
|  Skip Parsing:                                                       |
|  +---------------------------------------------------------------+   |
|  | x Command exceeds 10000 characters                            |   |
|  | x Parser not initialized                                      |   |
|  | x Parsing error -> fallback to string analysis                |   |
|  +---------------------------------------------------------------+   |
|                                                                       |
+---------------------------------------------------------------------+
```

### Trigger Condition Table

| Condition | Triggers Parsing? | Reason |
|-----------|------------------|--------|
| Command contains `\|` | YES | Need to extract pipe segments |
| Command contains `>` | YES | Need to detect redirections |
| Command contains `VAR=` | YES | Need to extract env variables |
| Command > 10000 chars | NO | Safety limit |
| First parsing call | YES | Lazy loads WASM |
| Parser not initialized | NO | Returns null |

---

## 2. Parsing Flow

### Complete Call Chain

```
+--------------------------------------------------------------------+
|                    Bash Tool Execution                               |
|                   (command string)                                   |
+---------------------------+----------------------------------------+
                            |
                            v
+--------------------------------------------------------------------+
|              Permission Check Entry                                  |
|              checkBashPermission(...)                                |
+---------------------------+----------------------------------------+
                            |
            +---------------+---------------+
            |  Command contains pipe |?     |
            +---------------+---------------+
                            | YES
                            v
+--------------------------------------------------------------------+
|         Shell Parser Facade (shellCommandParser)                     |
|                    cK1.parse(command)                                |
|                 chunks.123.mjs:826-841                               |
|  +----------------------------------------------------------------+ |
|  |  async parse(command) {                                        | |
|  |    if (!command) return null;                                  | |
|  |                                                                | |
|  |    // Check Tree-sitter availability                          | |
|  |    if (await isTreeSitterAvailable()) {                        | |
|  |      try {                                                     | |
|  |        let result = await parseCommand(command);               | |
|  |        if (result) {                                           | |
|  |          let pipes = extractPipePositions(result.rootNode);    | |
|  |          let redirects = extractRedirections(result.rootNode); | |
|  |          result.tree.delete();  // Free WASM memory           | |
|  |          return new RichCommand(command, pipes, redirects);    | |
|  |        }                                                       | |
|  |      } catch {}                                                | |
|  |    }                                                           | |
|  |    // Fallback to simple string parser                        | |
|  |    return new SimpleCommand(command);                          | |
|  |  }                                                             | |
|  +----------------------------------------------------------------+ |
+---------------------------+----------------------------------------+
                            |
                            v
+--------------------------------------------------------------------+
|          Lazy Load Initialization (ensureTreeSitterLoaded)           |
|                    hm2()                                             |
|                 chunks.123.mjs:595-598                               |
|  +----------------------------------------------------------------+ |
|  |  async function ensureTreeSitterLoaded() {                     | |
|  |    if (!initPromise) initPromise = initializeTreeSitter();     | |
|  |    await initPromise;                                          | |
|  |  }                                                             | |
|  +----------------------------------------------------------------+ |
+---------------------------+----------------------------------------+
                            | (first call only)
                            v
+--------------------------------------------------------------------+
|              WASM Loading (initializeTreeSitter)                     |
|                    Mn5()                                             |
|                 chunks.123.mjs:562-593                               |
|  +----------------------------------------------------------------+ |
|  |  1. Try embedded WASM (Bun.embeddedFiles)                      | |
|  |  2. Fallback: Load from disk (~/.claude/dependencies/)         | |
|  |  3. Initialize tree-sitter runtime                             | |
|  |  4. Create Parser instance                                     | |
|  |  5. Load Bash language grammar                                 | |
|  |  6. Send telemetry                                             | |
|  +----------------------------------------------------------------+ |
+---------------------------+----------------------------------------+
                            |
                            v
+--------------------------------------------------------------------+
|              Core Parsing (parseCommand)                             |
|                    Rn5(command)                                      |
|                 chunks.123.mjs:600-618                               |
|  +----------------------------------------------------------------+ |
|  |  async function parseCommand(command) {                        | |
|  |    await ensureTreeSitterLoaded();                             | |
|  |                                                                | |
|  |    // Safety checks                                            | |
|  |    if (!command || command.length > 10000 ||                   | |
|  |        !parser || !language) return null;                      | |
|  |                                                                | |
|  |    // Execute parsing                                          | |
|  |    let tree = parser.parse(command);                           | |
|  |    let rootNode = tree?.rootNode;                              | |
|  |    let commandNode = findCommandNode(rootNode);                | |
|  |    let envVars = extractEnvVars(commandNode);                  | |
|  |                                                                | |
|  |    return { tree, rootNode, envVars, commandNode };            | |
|  |  }                                                             | |
|  +----------------------------------------------------------------+ |
+--------------------------------------------------------------------+
```

### Parse Result Structure

```javascript
// parseCommand (Rn5) return value
{
  tree: Tree,              // Complete AST tree (WASM object)
  rootNode: Node,          // Root node
  envVars: string[],       // Environment variables ["VAR=value", ...]
  commandNode: Node,       // Command node
  originalCommand: string  // Original command string
}

// getPipeSegments() return value
["ls -la", "grep foo", "head -n 10"]  // Split by pipes

// getOutputRedirections() return value
[{
  target: "output.txt",    // Target file
  operator: ">"            // ">" or ">>"
}]
```

---

## 3. WASM Loading

### Initialization Strategy

```javascript
// ============================================
// initializeTreeSitter (Mn5) - Load WASM binaries
// Location: chunks.123.mjs:562-593
// ============================================

// ORIGINAL (for source lookup):
async function Mn5() {
  let A = vA();
  if (LG()) {
    let J = await fm2("tree-sitter.wasm"),
      X = await fm2("tree-sitter-bash.wasm");
    if (J && X) {
      await rbA.init({
        wasmBinary: J
      }), DEA = new rbA, GfA = await yK1.load(X), DEA.setLanguage(GfA),
      k("tree-sitter: loaded from embedded"),
      l("tengu_tree_sitter_load", {
        success: !0,
        from_embedded: !0
      });
      return
    }
  }
  let B = Ln5(),
    G = !1,
    Z = G ? dK1(B, "web-tree-sitter", "tree-sitter.wasm") : dK1(B, "tree-sitter.wasm"),
    Y = G ? dK1(B, "tree-sitter-bash", "tree-sitter-bash.wasm") : dK1(B, "tree-sitter-bash.wasm");
  if (!A.existsSync(Z) || !A.existsSync(Y)) {
    k("tree-sitter: WASM files not found"),
    l("tengu_tree_sitter_load", { success: !1 });
    return
  }
  await rbA.init({
    locateFile: (J) => J.endsWith("tree-sitter.wasm") ? Z : J
  }), DEA = new rbA, GfA = await yK1.load(A.readFileBytesSync(Y)),
  DEA.setLanguage(GfA),
  k("tree-sitter: loaded from disk"),
  l("tengu_tree_sitter_load", {
    success: !0,
    from_embedded: !1
  })
}

// READABLE (for understanding):
async function initializeTreeSitter() {
  let fs = getFileSystem();

  // Strategy 1: Try embedded WASM (Bun runtime bundled mode)
  if (isBundledMode()) {
    let treeSitterWasm = await loadEmbeddedFile("tree-sitter.wasm");
    let bashParserWasm = await loadEmbeddedFile("tree-sitter-bash.wasm");

    if (treeSitterWasm && bashParserWasm) {
      // Initialize Parser with embedded binary
      await Parser.init({
        wasmBinary: treeSitterWasm
      });
      globalParser = new Parser();
      globalBashLanguage = await Language.load(bashParserWasm);
      globalParser.setLanguage(globalBashLanguage);

      log("tree-sitter: loaded from embedded");
      recordTelemetry("tengu_tree_sitter_load", {
        success: true,
        from_embedded: true
      });
      return;
    }
  }

  // Strategy 2: Load from disk
  let basePath = getNodeModulesPath();
  let useWebTreeSitter = false;  // Flag for alternative package
  let treeSitterPath = useWebTreeSitter
    ? joinPath(basePath, "web-tree-sitter", "tree-sitter.wasm")
    : joinPath(basePath, "tree-sitter.wasm");
  let bashParserPath = useWebTreeSitter
    ? joinPath(basePath, "tree-sitter-bash", "tree-sitter-bash.wasm")
    : joinPath(basePath, "tree-sitter-bash.wasm");

  // Check files exist
  if (!fs.existsSync(treeSitterPath) || !fs.existsSync(bashParserPath)) {
    log("tree-sitter: WASM files not found");
    recordTelemetry("tengu_tree_sitter_load", { success: false });
    return;
  }

  // Initialize from disk
  await Parser.init({
    locateFile: (filename) =>
      filename.endsWith("tree-sitter.wasm") ? treeSitterPath : filename
  });
  globalParser = new Parser();
  globalBashLanguage = await Language.load(fs.readFileBytesSync(bashParserPath));
  globalParser.setLanguage(globalBashLanguage);

  log("tree-sitter: loaded from disk");
  recordTelemetry("tengu_tree_sitter_load", {
    success: true,
    from_embedded: false
  });
}

// Mapping: Mn5→initializeTreeSitter, vA→getFileSystem, LG→isBundledMode,
//          fm2→loadEmbeddedFile, rbA→Parser, yK1→Language,
//          DEA→globalParser, GfA→globalBashLanguage, Ln5→getNodeModulesPath,
//          dK1→joinPath
```

### WASM Loading Diagram

```
+---------------------------------------------------------------------+
|                    WASM Loading Strategy                              |
+---------------------------------------------------------------------+
|                                                                       |
|  Loading Priority:                                                   |
|                                                                       |
|  1. Embedded WASM (Bun.embeddedFiles)                               |
|     +-----------------------------------------------------------+   |
|     | - Fastest: Already in memory                              |   |
|     | - Only available in bundled distribution                   |   |
|     | - Files: tree-sitter.wasm, tree-sitter-bash.wasm          |   |
|     +-----------------------------------------------------------+   |
|                            |                                         |
|                   [Not available?]                                   |
|                            v                                         |
|  2. Disk-based WASM (node_modules or ~/.claude/)                    |
|     +-----------------------------------------------------------+   |
|     | - Fallback for npm install mode                           |   |
|     | - Reads files synchronously                               |   |
|     | - Path: {basePath}/tree-sitter.wasm                       |   |
|     +-----------------------------------------------------------+   |
|                            |                                         |
|                   [Files not found?]                                 |
|                            v                                         |
|  3. Fail Gracefully                                                  |
|     +-----------------------------------------------------------+   |
|     | - Log: "tree-sitter: WASM files not found"                |   |
|     | - Telemetry: success: false                               |   |
|     | - Parser returns null, fallback to SimpleCommand          |   |
|     +-----------------------------------------------------------+   |
|                                                                       |
+---------------------------------------------------------------------+
```

### WASM Files

| File | Size | Purpose |
|------|------|---------|
| `tree-sitter.wasm` | ~200KB | Tree-sitter runtime |
| `tree-sitter-bash.wasm` | ~150KB | Bash grammar |

---

## 4. Parser and Language Classes

### Language Class (yK1)

The Language class wraps a compiled grammar, providing access to node types and field names.

```javascript
// ============================================
// Language (yK1) - Tree-sitter language binding
// Location: chunks.122.mjs:736-859
// ============================================

// Key interface (simplified from WASM bindings):
class Language {
  // Internal WASM pointer
  #ptr = 0;

  // Array of node type names (e.g., "command", "pipeline", "word")
  types: string[];

  // Array of field names (e.g., "name", "argument", "body")
  fields: string[];

  // Load language from WASM binary
  static async load(wasmPath: string | Uint8Array): Promise<Language>;
}
```

### Parser Class (rbA)

The Parser class provides the main parsing interface.

```javascript
// ============================================
// Parser (rbA) - Tree-sitter parser wrapper
// Location: chunks.122.mjs:2144-2226
// ============================================

// Key interface:
class Parser {
  // Initialize WASM module (must call before creating parsers)
  static async init(options: { wasmBinary?: Uint8Array, locateFile?: Function }): Promise<void>;

  // Set language for parsing
  setLanguage(language: Language): this;

  // Parse string into syntax tree
  parse(input: string, previousTree?: Tree, options?: ParseOptions): Tree | null;

  // Clean up WASM resources
  delete(): void;
}
```

### Core Parsing Function

```javascript
// ============================================
// parseCommand (Rn5) - Parse bash command into AST
// Location: chunks.123.mjs:600-618
// ============================================

// ORIGINAL (for source lookup):
async function Rn5(A) {
  if (await hm2(), !A || A.length > Un5 || !DEA || !GfA) return null;
  try {
    let Q = DEA.parse(A),
      B = Q?.rootNode;
    if (!B) return null;
    let G = gm2(B),
      Z = _n5(G);
    return {
      tree: Q,
      rootNode: B,
      envVars: Z,
      commandNode: G,
      originalCommand: A
    }
  } catch {
    return null
  }
}

// READABLE (for understanding):
async function parseCommand(commandString) {
  // Ensure WASM is loaded
  await ensureTreeSitterLoaded();

  // Validate input
  if (!commandString ||
      commandString.length > MAX_COMMAND_LENGTH ||
      !globalParser ||
      !globalBashLanguage) {
    return null;
  }

  try {
    // Parse with tree-sitter
    let tree = globalParser.parse(commandString);
    let rootNode = tree?.rootNode;

    if (!rootNode) return null;

    // Extract semantic information
    let commandNode = findCommandNode(rootNode);
    let envVars = extractEnvironmentVariables(commandNode);

    return {
      tree: tree,              // Full AST (caller must delete)
      rootNode: rootNode,      // Root of the tree
      envVars: envVars,        // Extracted env vars
      commandNode: commandNode,// Main command node
      originalCommand: commandString
    };
  } catch {
    return null;  // Graceful failure
  }
}

// Mapping: Rn5→parseCommand, hm2→ensureTreeSitterLoaded, Un5→MAX_COMMAND_LENGTH,
//          DEA→globalParser, GfA→globalBashLanguage, gm2→findCommandNode,
//          _n5→extractEnvironmentVariables
```

---

## 5. Command Classes

### SimpleCommand (Fallback)

Used when Tree-sitter parsing fails or is unavailable.

```javascript
// ============================================
// SimpleCommand (um2) - Fallback command wrapper
// Location: chunks.123.mjs:695-732
// ============================================

// ORIGINAL (for source lookup):
class um2 {
  originalCommand;
  constructor(A) {
    this.originalCommand = A
  }
  toString() {
    return this.originalCommand
  }
  getPipeSegments() {
    try {
      let A = ZfA(this.originalCommand),
        Q = [],
        B = [];
      for (let G of A)
        if (G === "|") {
          if (B.length > 0) Q.push(B.join(" ")), B = []
        } else B.push(G);
      if (B.length > 0) Q.push(B.join(" "));
      return Q.length > 0 ? Q : [this.originalCommand]
    } catch {
      return [this.originalCommand]
    }
  }
  withoutOutputRedirections() {
    if (!this.originalCommand.includes(">")) return this.originalCommand;
    let { commandWithoutRedirections: A, redirections: Q } = Hx(this.originalCommand);
    return Q.length > 0 ? A : this.originalCommand
  }
  getOutputRedirections() {
    let { redirections: A } = Hx(this.originalCommand);
    return A
  }
}

// READABLE (for understanding):
class SimpleCommand {
  originalCommand;

  constructor(commandString) {
    this.originalCommand = commandString;
  }

  toString() {
    return this.originalCommand;
  }

  getPipeSegments() {
    try {
      // Use tokenizer (not full AST parser)
      let tokens = tokenizeCommand(this.originalCommand);
      let segments = [];
      let current = [];

      for (let token of tokens) {
        if (token === "|") {
          if (current.length > 0) {
            segments.push(current.join(" "));
            current = [];
          }
        } else {
          current.push(token);
        }
      }

      if (current.length > 0) {
        segments.push(current.join(" "));
      }

      return segments.length > 0 ? segments : [this.originalCommand];
    } catch {
      return [this.originalCommand];
    }
  }

  withoutOutputRedirections() {
    if (!this.originalCommand.includes(">")) {
      return this.originalCommand;
    }

    let { commandWithoutRedirections, redirections } =
      extractOutputRedirections(this.originalCommand);

    return redirections.length > 0
      ? commandWithoutRedirections
      : this.originalCommand;
  }

  getOutputRedirections() {
    let { redirections } = extractOutputRedirections(this.originalCommand);
    return redirections;
  }
}

// Mapping: um2→SimpleCommand, ZfA→tokenizeCommand, Hx→extractOutputRedirections
```

### RichCommand (AST-backed)

Used when Tree-sitter parsing succeeds, provides precise position information.

```javascript
// ============================================
// RichCommand (mm2) - AST-backed command wrapper
// Location: chunks.123.mjs:768-807
// ============================================

// ORIGINAL (for source lookup):
class mm2 {
  originalCommand;
  pipePositions;
  redirectionNodes;
  constructor(A, Q, B) {
    this.originalCommand = A, this.pipePositions = Q, this.redirectionNodes = B
  }
  toString() {
    return this.originalCommand
  }
  getPipeSegments() {
    if (this.pipePositions.length === 0) return [this.originalCommand];
    let A = [],
      Q = 0;
    for (let G of this.pipePositions) {
      let Z = this.originalCommand.slice(Q, G).trim();
      if (Z) A.push(Z);
      Q = G + 1
    }
    let B = this.originalCommand.slice(Q).trim();
    if (B) A.push(B);
    return A
  }
  withoutOutputRedirections() {
    if (this.redirectionNodes.length === 0) return this.originalCommand;
    let A = [...this.redirectionNodes].sort((B, G) => G.startIndex - B.startIndex),
      Q = this.originalCommand;
    for (let B of A) Q = Q.slice(0, B.startIndex) + Q.slice(B.endIndex);
    return Q.trim().replace(/\s+/g, " ")
  }
  getOutputRedirections() {
    return this.redirectionNodes.map(({ target: A, operator: Q }) => ({
      target: A,
      operator: Q
    }))
  }
}

// READABLE (for understanding):
class RichCommand {
  originalCommand;
  pipePositions;      // Array of pipe operator character indices
  redirectionNodes;   // Array of redirection metadata

  constructor(commandString, pipePositions, redirectionNodes) {
    this.originalCommand = commandString;
    this.pipePositions = pipePositions;
    this.redirectionNodes = redirectionNodes;
  }

  toString() {
    return this.originalCommand;
  }

  getPipeSegments() {
    if (this.pipePositions.length === 0) {
      return [this.originalCommand];
    }

    let segments = [];
    let currentPos = 0;

    for (let pipePos of this.pipePositions) {
      let segment = this.originalCommand.slice(currentPos, pipePos).trim();
      if (segment) {
        segments.push(segment);
      }
      currentPos = pipePos + 1;  // Skip the | character
    }

    let lastSegment = this.originalCommand.slice(currentPos).trim();
    if (lastSegment) {
      segments.push(lastSegment);
    }

    return segments;
  }

  withoutOutputRedirections() {
    if (this.redirectionNodes.length === 0) {
      return this.originalCommand;
    }

    // Sort by startIndex descending to avoid offset corruption
    let sorted = [...this.redirectionNodes].sort((a, b) =>
      b.startIndex - a.startIndex
    );
    let result = this.originalCommand;

    // Remove from highest index to lowest
    for (let redirection of sorted) {
      result = result.slice(0, redirection.startIndex) +
               result.slice(redirection.endIndex);
    }

    return result.trim().replace(/\s+/g, " ");
  }

  getOutputRedirections() {
    return this.redirectionNodes.map(({ target, operator }) => ({
      target: target,
      operator: operator
    }));
  }
}

// Mapping: mm2→RichCommand
```

**Key Difference: SimpleCommand vs RichCommand**

| Aspect | SimpleCommand | RichCommand |
|--------|---------------|-------------|
| Parsing | String tokenization | Full AST |
| Accuracy | May fail on complex syntax | Precise positions |
| Performance | Faster | Slower (WASM) |
| Memory | Lower | Higher (AST tree) |
| Use case | Fallback | Primary |

---

## 6. AST Node Types

### Bash AST Node Type Categories

```
+---------------------------------------------------------------------+
|                    Bash AST Node Types                                |
+---------------------------------------------------------------------+
|                                                                       |
|  Command Nodes:                                                      |
|  +---------------------------------------------------------------+   |
|  | command              - Regular command (ls -la)               |   |
|  | declaration_command  - Declaration (export, declare)          |   |
|  | command_name         - Command name (ls)                      |   |
|  | word                 - Word/argument (-la)                    |   |
|  +---------------------------------------------------------------+   |
|                                                                       |
|  Compound Nodes:                                                     |
|  +---------------------------------------------------------------+   |
|  | pipeline             - Pipeline (cmd1 | cmd2)                 |   |
|  | redirected_statement - Redirected statement                   |   |
|  | compound_statement   - Compound statement                     |   |
|  | subshell             - Subshell (...)                         |   |
|  | list                 - Command list                           |   |
|  +---------------------------------------------------------------+   |
|                                                                       |
|  Variable Nodes:                                                     |
|  +---------------------------------------------------------------+   |
|  | variable_assignment  - Variable assignment (VAR=value)        |   |
|  | variable_name        - Variable name                          |   |
|  | expansion            - Variable expansion ($VAR)              |   |
|  | simple_expansion     - Simple expansion ($VAR)                |   |
|  +---------------------------------------------------------------+   |
|                                                                       |
|  Redirection Nodes:                                                  |
|  +---------------------------------------------------------------+   |
|  | file_redirect        - File redirect (> file)                 |   |
|  | heredoc_redirect     - Here document (<<EOF)                  |   |
|  | herestring_redirect  - Here string (<<<)                      |   |
|  | >                    - Output redirect operator               |   |
|  | >>                   - Append redirect operator               |   |
|  | <                    - Input redirect operator                |   |
|  +---------------------------------------------------------------+   |
|                                                                       |
|  Substitution Nodes:                                                 |
|  +---------------------------------------------------------------+   |
|  | command_substitution - Command substitution $(cmd)            |   |
|  | process_substitution - Process substitution <(cmd) >(cmd)     |   |
|  +---------------------------------------------------------------+   |
|                                                                       |
|  Literal Nodes:                                                      |
|  +---------------------------------------------------------------+   |
|  | string               - Double-quoted string "..."             |   |
|  | raw_string           - Single-quoted string '...'             |   |
|  | number               - Numeric literal                        |   |
|  | concatenation        - String concatenation                   |   |
|  +---------------------------------------------------------------+   |
|                                                                       |
|  Operator Nodes:                                                     |
|  +---------------------------------------------------------------+   |
|  | |                    - Pipe operator                          |   |
|  | &&                   - AND operator                           |   |
|  | ||                   - OR operator                            |   |
|  | ;                    - Semicolon separator                    |   |
|  +---------------------------------------------------------------+   |
|                                                                       |
+---------------------------------------------------------------------+
```

### Node Type Constants (Used in Code)

```javascript
// Location: chunks.123.mjs:686-693

const MAX_COMMAND_LENGTH = 10000;  // Un5

// Declaration keywords - used in declaration_command nodes
const DECLARATION_KEYWORDS = new Set([
  "export", "declare", "typeset", "readonly", "local", "unset", "unsetenv"
]);  // qn5

// Argument node types - valid as command arguments
const ARGUMENT_TYPES = new Set([
  "word", "string", "raw_string", "number"
]);  // Nn5

// Substitution types - parsing stops at these (complex nested structures)
const SUBSTITUTION_TYPES = new Set([
  "command_substitution", "process_substitution"
]);  // wn5

// Valid command node types - targets for findCommandNode
const COMMAND_NODE_TYPES = new Set([
  "command", "declaration_command"
]);  // Nq0
```

### AST Example: Pipeline with Redirection

```
Input: "VAR=1 grep pattern file.txt | head -n 10 > output.txt"

AST Structure:
program
└── redirected_statement
    ├── pipeline
    │   ├── command
    │   │   ├── variable_assignment ("VAR=1")
    │   │   ├── command_name
    │   │   │   └── word ("grep")
    │   │   ├── word ("pattern")
    │   │   └── word ("file.txt")
    │   ├── | (pipe operator)
    │   └── command
    │       ├── command_name
    │       │   └── word ("head")
    │       ├── word ("-n")
    │       └── word ("10")
    └── file_redirect
        ├── > (redirect operator)
        └── word ("output.txt")

Extraction Results:
- pipePositions: [28]  (index of | character)
- redirections: [{startIndex: 41, endIndex: 53, target: "output.txt", operator: ">"}]
- envVars: ["VAR=1"]
```

### Finding Command Node

```javascript
// ============================================
// findCommandNode (gm2) - Extract main command from AST
// Location: chunks.123.mjs:620-634
// ============================================

// ORIGINAL (for source lookup):
function gm2(A) {
  let {
    type: Q,
    children: B,
    parent: G
  } = A;
  if (Nq0.has(Q)) return A;
  if (Q === "variable_assignment" && G)
    return G.children.find((Z) => Z && Nq0.has(Z.type) && Z.startIndex > A.startIndex) ?? null;
  if (Q === "pipeline" || Q === "redirected_statement")
    return B.find((Z) => Z && Nq0.has(Z.type)) ?? null;
  for (let Z of B) {
    let Y = Z && gm2(Z);
    if (Y) return Y
  }
  return null
}

// READABLE (for understanding):
function findCommandNode(node) {
  let { type, children, parent } = node;

  // If already a command node, return it
  if (COMMAND_NODE_TYPES.has(type)) {
    return node;
  }

  // Handle variable assignments (find command after assignment)
  // Example: VAR=value command args -> return "command args" node
  if (type === "variable_assignment" && parent) {
    return parent.children.find(sibling =>
      sibling &&
      COMMAND_NODE_TYPES.has(sibling.type) &&
      sibling.startIndex > node.startIndex
    ) ?? null;
  }

  // Handle pipelines and redirected statements
  // Example: cmd1 | cmd2 -> return first command node
  if (type === "pipeline" || type === "redirected_statement") {
    return children.find(child =>
      child && COMMAND_NODE_TYPES.has(child.type)
    ) ?? null;
  }

  // Recursively search children
  for (let child of children) {
    let found = child && findCommandNode(child);
    if (found) return found;
  }

  return null;
}

// Mapping: gm2→findCommandNode, Nq0→COMMAND_NODE_TYPES
```

### Environment Variable Extraction

```javascript
// ============================================
// extractEnvironmentVariables (_n5) - Extract env vars from command
// Location: chunks.123.mjs:636-645
// ============================================

// ORIGINAL (for source lookup):
function _n5(A) {
  if (!A || A.type !== "command") return [];
  let Q = [];
  for (let B of A.children) {
    if (!B) continue;
    if (B.type === "variable_assignment") Q.push(B.text);
    else if (B.type === "command_name" || B.type === "word") break
  }
  return Q
}

// READABLE (for understanding):
function extractEnvironmentVariables(commandNode) {
  if (!commandNode || commandNode.type !== "command") {
    return [];
  }

  let envVars = [];

  for (let child of commandNode.children) {
    if (!child) continue;

    // Collect variable assignments at start of command
    // Example: VAR1=val1 VAR2=val2 npm start
    if (child.type === "variable_assignment") {
      envVars.push(child.text);  // "VAR1=val1"
    }
    // Stop at first command name or argument
    else if (child.type === "command_name" || child.type === "word") {
      break;
    }
  }

  return envVars;
}

// Mapping: _n5→extractEnvironmentVariables
```

### Pipe Position Extraction

```javascript
// ============================================
// extractPipePositions (Pn5) - Find pipe operators in AST
// Location: chunks.123.mjs:741-749
// ============================================

// ORIGINAL (for source lookup):
function Pn5(A) {
  let Q = [];
  return Mq0(A, (B) => {
    if (B.type === "pipeline") {
      for (let G of B.children)
        if (G && G.type === "|") Q.push(G.startIndex)
    }
  }), Q
}

// READABLE (for understanding):
function extractPipePositions(rootNode) {
  let positions = [];

  // Traverse entire AST
  traverseTree(rootNode, (node) => {
    if (node.type === "pipeline") {
      // Find all pipe operators in pipeline
      for (let child of node.children) {
        if (child && child.type === "|") {
          positions.push(child.startIndex);
        }
      }
    }
  });

  return positions;
}

// Mapping: Pn5→extractPipePositions, Mq0→traverseTree
```

### Redirection Extraction

```javascript
// ============================================
// extractRedirections (Sn5) - Extract output redirections
// Location: chunks.123.mjs:751-766
// ============================================

// ORIGINAL (for source lookup):
function Sn5(A) {
  let Q = [];
  return Mq0(A, (B) => {
    if (B.type === "file_redirect") {
      let G = B.children,
        Z = G.find((J) => J && (J.type === ">" || J.type === ">>")),
        Y = G.find((J) => J && J.type === "word");
      if (Z && Y) Q.push({
        startIndex: B.startIndex,
        endIndex: B.endIndex,
        target: Y.text,
        operator: Z.type
      })
    }
  }), Q
}

// READABLE (for understanding):
function extractRedirections(rootNode) {
  let redirections = [];

  traverseTree(rootNode, (node) => {
    if (node.type === "file_redirect") {
      let children = node.children;

      // Find redirection operator (> or >>)
      let operator = children.find(child =>
        child && (child.type === ">" || child.type === ">>")
      );

      // Find target filename
      let target = children.find(child =>
        child && child.type === "word"
      );

      if (operator && target) {
        redirections.push({
          startIndex: node.startIndex,
          endIndex: node.endIndex,
          target: target.text,
          operator: operator.type  // ">" or ">>"
        });
      }
    }
  });

  return redirections;
}

// Mapping: Sn5→extractRedirections
```

### Bash AST Node Hierarchy

```
program
├── command
│   ├── command_name
│   │   └── word ("ls")
│   └── word ("-la")
│
├── pipeline
│   ├── command
│   │   ├── command_name
│   │   │   └── word ("grep")
│   │   └── word ("pattern")
│   ├── | (pipe operator)
│   └── command
│       └── command_name
│           └── word ("wc")
│
├── redirected_statement
│   ├── command
│   │   └── command_name
│   │       └── word ("echo")
│   └── file_redirect
│       ├── > (redirect operator)
│       └── word ("output.txt")
│
└── declaration_command
    └── word ("export")
```

---

## 7. Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Code Indexing module

### Core Functions

- `initializeTreeSitter` (Mn5) - Load WASM binaries
- `ensureTreeSitterLoaded` (hm2) - Lazy initialization guard
- `parseCommand` (Rn5) - Main parse entry point
- `findCommandNode` (gm2) - Extract command from AST
- `extractEnvironmentVariables` (_n5) - Get env vars
- `extractCommandArguments` (jn5) - Get command and args
- `extractPipePositions` (Pn5) - Find pipe operators
- `extractRedirections` (Sn5) - Find output redirections
- `traverseTree` (Mq0) - AST traversal helper
- `unquoteString` (Tn5) - Remove quotes from strings
- `isTreeSitterAvailable` (xn5) - Check parser availability
- `stripOutputRedirections` (vn5) - Remove redirections from command

### Classes

- `Language` (yK1) - Tree-sitter language binding
- `Parser` (rbA) - Tree-sitter parser wrapper
- `Tree` (ii5) - AST tree object
- `SimpleCommand` (um2) - Fallback command class
- `RichCommand` (mm2) - AST-backed command class
- `shellCommandParser` (cK1) - High-level parse API

### Global Variables

- `globalParser` (DEA) - Parser singleton
- `globalBashLanguage` (GfA) - Bash language instance
- `initPromise` (wq0) - Initialization promise
- `MAX_COMMAND_LENGTH` (Un5) - 10000 char limit
- `COMMAND_NODE_TYPES` (Nq0) - {"command", "declaration_command"}
- `DECLARATION_KEYWORDS` (qn5) - {"export", "declare", ...}
- `ARGUMENT_TYPES` (Nn5) - {"word", "string", "raw_string", "number"}
- `SUBSTITUTION_TYPES` (wn5) - {"command_substitution", "process_substitution"}

---

## Summary

### Tree-sitter vs Regex/String Parsing

| Aspect | Tree-sitter | Regex/String |
|--------|-------------|--------------|
| Accuracy | Handles nested structures | May fail on complex cases |
| Performance | WASM overhead | Fast |
| Memory | AST tree allocation | Minimal |
| Features | Position info, node types | Limited |

### Key Design Decisions

1. **WASM for Portability** - Same grammar works across platforms
2. **Lazy Loading** - Don't load until first parsing needed
3. **Graceful Fallback** - SimpleCommand when Tree-sitter unavailable
4. **Memory Management** - Caller must call `tree.delete()` to free WASM memory
5. **Bash Only** - Single language focus for permission checking use case

---

## Related Documentation

- [FileIndex File Path Autocomplete](./file_path_index.md) - File suggestion system
- [Integration Points](./integration.md) - Cross-module connections
