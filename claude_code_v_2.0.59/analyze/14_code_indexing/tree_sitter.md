# Tree-sitter WASM Integration

## Overview

Claude Code v2.0.59 integrates **tree-sitter** via WebAssembly for code parsing and AST (Abstract Syntax Tree) traversal. The implementation is found in `chunks.89.mjs` and provides language-agnostic code analysis capabilities.

## Core Classes

### 1. Tree Class

Represents a parsed syntax tree:

```javascript
M15 = class A {
  static {
    X0(this, "Tree")
  }

  [0] = 0;
  textCallback;
  language;

  constructor(Q, B, G, Z) {
    BIA(Q);
    this[0] = B;           // WASM pointer
    this.language = G;
    this.textCallback = Z;
  }

  // Copy the tree
  copy() {
    let Q = V1._ts_tree_copy(this[0]);
    return new A(xl, Q, this.language, this.textCallback);
  }

  // Delete the tree (free WASM memory)
  delete() {
    V1._ts_tree_delete(this[0]);
    this[0] = 0;
  }

  // Get root node
  get rootNode() {
    return V1._ts_tree_root_node_wasm(this[0]), XY(this);
  }

  // Get root node with offset
  rootNodeWithOffset(Q, B) {
    let G = $2 + vU;
    V1.setValue(G, Q, "i32");
    bM(G + d2, B);
    V1._ts_tree_root_node_with_offset_wasm(this[0]);
    return XY(this);
  }

  // Edit the tree
  edit(Q) {
    WA2(Q);
    V1._ts_tree_edit_wasm(this[0]);
  }

  // Create a tree cursor
  walk() {
    return this.rootNode.walk();
  }

  // Get changed ranges between trees
  getChangedRanges(Q) {
    if (!(Q instanceof A))
      throw TypeError("Argument must be a Tree");

    V1._ts_tree_get_changed_ranges_wasm(this[0], Q[0]);

    let B = V1.getValue($2, "i32"),
        G = V1.getValue($2 + d2, "i32"),
        Z = Array(B);

    if (B > 0) {
      let I = G;
      for (let Y = 0; Y < B; Y++) {
        Z[Y] = D01(I);
        I += cNA;
      }
      V1._free(G);
    }

    return Z;
  }

  // Get included ranges
  getIncludedRanges() {
    V1._ts_tree_included_ranges_wasm(this[0]);

    let Q = V1.getValue($2, "i32"),
        B = V1.getValue($2 + d2, "i32"),
        G = Array(Q);

    if (Q > 0) {
      let Z = B;
      for (let I = 0; I < Q; I++) {
        G[I] = D01(Z);
        Z += cNA;
      }
      V1._free(B);
    }

    return G;
  }
}
```

### 2. TreeCursor Class

Enables efficient tree traversal:

```javascript
O15 = class A {
  static {
    X0(this, "TreeCursor")
  }

  [0] = 0;  // Context pointer
  [1] = 0;  // ID
  [2] = 0;  // Tree pointer
  [3] = 0;  // Reserved
  tree;

  constructor(Q, B) {
    BIA(Q);
    this.tree = B;
    Hq(this);  // Marshal cursor
  }

  // Copy the cursor
  copy() {
    let Q = new A(xl, this.tree);
    V1._ts_tree_cursor_copy_wasm(this.tree[0]);
    Hq(Q);
    return Q;
  }

  // Delete the cursor
  delete() {
    DZ(this);  // Unmarshal cursor
    V1._ts_tree_cursor_delete_wasm(this.tree[0]);
    this[0] = this[1] = this[2] = 0;
  }

  // Get current node
  get currentNode() {
    DZ(this);
    V1._ts_tree_cursor_current_node_wasm(this.tree[0]);
    return XY(this.tree);
  }

  // Get current field ID
  get currentFieldId() {
    DZ(this);
    return V1._ts_tree_cursor_current_field_id_wasm(this.tree[0]);
  }

  // Get current field name
  get currentFieldName() {
    return this.tree.language.fields[this.currentFieldId];
  }

  // Get current depth
  get currentDepth() {
    DZ(this);
    return V1._ts_tree_cursor_current_depth_wasm(this.tree[0]);
  }

  // Get descendant index
  get currentDescendantIndex() {
    DZ(this);
    return V1._ts_tree_cursor_current_descendant_index_wasm(this.tree[0]);
  }

  // Navigation methods
  gotoFirstChild() {
    DZ(this);
    let Q = V1._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
    Hq(this);
    return Q === 1;
  }

  gotoLastChild() {
    DZ(this);
    let Q = V1._ts_tree_cursor_goto_last_child_wasm(this.tree[0]);
    Hq(this);
    return Q === 1;
  }

  gotoParent() {
    DZ(this);
    let Q = V1._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
    Hq(this);
    return Q === 1;
  }

  gotoNextSibling() {
    DZ(this);
    let Q = V1._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
    Hq(this);
    return Q === 1;
  }

  gotoPreviousSibling() {
    DZ(this);
    let Q = V1._ts_tree_cursor_goto_previous_sibling_wasm(this.tree[0]);
    Hq(this);
    return Q === 1;
  }

  gotoDescendant(Q) {
    DZ(this);
    V1._ts_tree_cursor_goto_descendant_wasm(this.tree[0], Q);
    Hq(this);
  }

  gotoFirstChildForIndex(Q) {
    DZ(this);
    V1.setValue($2 + Co1, Q, "i32");
    let B = V1._ts_tree_cursor_goto_first_child_for_index_wasm(this.tree[0]);
    Hq(this);
    return B === 1;
  }

  gotoFirstChildForPosition(Q) {
    DZ(this);
    bM($2 + Co1, Q);
    let B = V1._ts_tree_cursor_goto_first_child_for_position_wasm(this.tree[0]);
    Hq(this);
    return B === 1;
  }

  // Reset cursor
  reset(Q) {
    N8(Q);
    DZ(this, $2 + vU);
    V1._ts_tree_cursor_reset_wasm(this.tree[0]);
    Hq(this);
  }

  resetTo(Q) {
    DZ(this, $2);
    DZ(Q, $2 + Co1);
    V1._ts_tree_cursor_reset_to_wasm(this.tree[0], Q.tree[0]);
    Hq(this);
  }

  // Properties
  get nodeType() {
    return this.tree.language.types[this.nodeTypeId] || "ERROR";
  }

  get nodeTypeId() {
    DZ(this);
    return V1._ts_tree_cursor_current_node_type_id_wasm(this.tree[0]);
  }

  get nodeStateId() {
    DZ(this);
    return V1._ts_tree_cursor_current_node_state_id_wasm(this.tree[0]);
  }

  get nodeId() {
    DZ(this);
    return V1._ts_tree_cursor_current_node_id_wasm(this.tree[0]);
  }

  get nodeIsNamed() {
    DZ(this);
    return V1._ts_tree_cursor_current_node_is_named_wasm(this.tree[0]) === 1;
  }

  get nodeIsMissing() {
    DZ(this);
    return V1._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0]) === 1;
  }

  get nodeText() {
    DZ(this);
    let Q = V1._ts_tree_cursor_start_index_wasm(this.tree[0]),
        B = V1._ts_tree_cursor_end_index_wasm(this.tree[0]);
    V1._ts_tree_cursor_start_position_wasm(this.tree[0]);
    let G = yAA($2);
    return $o1(this.tree, Q, B, G);
  }

  get startPosition() {
    DZ(this);
    V1._ts_tree_cursor_start_position_wasm(this.tree[0]);
    return yAA($2);
  }

  get endPosition() {
    DZ(this);
    V1._ts_tree_cursor_end_position_wasm(this.tree[0]);
    return yAA($2);
  }

  get startIndex() {
    DZ(this);
    return V1._ts_tree_cursor_start_index_wasm(this.tree[0]);
  }

  get endIndex() {
    DZ(this);
    return V1._ts_tree_cursor_end_index_wasm(this.tree[0]);
  }
}
```

### 3. Node Class

Represents a syntax tree node:

```javascript
R15 = class {
  static {
    X0(this, "Node")
  }

  [0] = 0;
  _children;
  _namedChildren;

  constructor(A, { id: Q, tree: B, startIndex: G, startPosition: Z, other: I }) {
    BIA(A);
    this[0] = I;
    this.id = Q;
    this.tree = B;
    this.startIndex = G;
    this.startPosition = Z;
  }

  id;
  startIndex;
  startPosition;
  tree;

  // Type information
  get typeId() {
    return N8(this), V1._ts_node_symbol_wasm(this.tree[0]);
  }

  get grammarId() {
    return N8(this), V1._ts_node_grammar_symbol_wasm(this.tree[0]);
  }

  get type() {
    return this.tree.language.types[this.typeId] || "ERROR";
  }

  get grammarType() {
    return this.tree.language.types[this.grammarId] || "ERROR";
  }

  // Node properties
  get isNamed() {
    return N8(this), V1._ts_node_is_named_wasm(this.tree[0]) === 1;
  }

  get isExtra() {
    return N8(this), V1._ts_node_is_extra_wasm(this.tree[0]) === 1;
  }

  get isError() {
    return N8(this), V1._ts_node_is_error_wasm(this.tree[0]) === 1;
  }

  get isMissing() {
    return N8(this), V1._ts_node_is_missing_wasm(this.tree[0]) === 1;
  }

  get hasChanges() {
    return N8(this), V1._ts_node_has_changes_wasm(this.tree[0]) === 1;
  }

  get hasError() {
    return N8(this), V1._ts_node_has_error_wasm(this.tree[0]) === 1;
  }

  // Position information
  get endIndex() {
    return N8(this), V1._ts_node_end_index_wasm(this.tree[0]);
  }

  get endPosition() {
    return N8(this), V1._ts_node_end_point_wasm(this.tree[0]), yAA($2);
  }

  get text() {
    return $o1(this.tree, this.startIndex, this.endIndex, this.startPosition);
  }

  // Parse state
  get parseState() {
    return N8(this), V1._ts_node_parse_state_wasm(this.tree[0]);
  }

  get nextParseState() {
    return N8(this), V1._ts_node_next_parse_state_wasm(this.tree[0]);
  }

  // Navigation
  child(A) {
    return N8(this), V1._ts_node_child_wasm(this.tree[0], A), XY(this.tree);
  }

  namedChild(A) {
    return N8(this), V1._ts_node_named_child_wasm(this.tree[0], A), XY(this.tree);
  }

  childForFieldId(A) {
    return N8(this), V1._ts_node_child_by_field_id_wasm(this.tree[0], A), XY(this.tree);
  }

  childForFieldName(A) {
    let Q = this.tree.language.fields.indexOf(A);
    if (Q !== -1) return this.childForFieldId(Q);
    return null;
  }

  // Comparison
  equals(A) {
    return this.tree === A.tree && this.id === A.id;
  }

  // Create cursor
  walk() {
    N8(this);
    V1._ts_tree_cursor_new_wasm(this.tree[0]);
    return DZ(new O15(xl, this.tree));
  }
}
```

### 4. Language Class

Represents a programming language grammar:

```javascript
// ============================================
// Language - Programming Language Grammar
// Location: chunks.89.mjs:736-859
// ============================================
class Language {
  static {
    X0(this, "Language")
  }

  [0] = 0;        // WASM language pointer
  types;          // Array of node type names
  fields;         // Array of field names

  constructor(internalSymbol, languagePointer) {
    BIA(internalSymbol);  // Assert internal symbol
    this[0] = languagePointer;

    // Load node types from WASM
    this.types = Array(V1._ts_language_symbol_count(this[0]));
    for (let i = 0, len = this.types.length; i < len; i++) {
      if (V1._ts_language_symbol_type(this[0], i) < 2) {
        this.types[i] = V1.UTF8ToString(
          V1._ts_language_symbol_name(this[0], i)
        );
      }
    }

    // Load field names from WASM
    this.fields = Array(V1._ts_language_field_count(this[0]) + 1);
    for (let i = 0, len = this.fields.length; i < len; i++) {
      let fieldName = V1._ts_language_field_name_for_id(this[0], i);
      if (fieldName !== 0) {
        this.fields[i] = V1.UTF8ToString(fieldName);
      } else {
        this.fields[i] = null;
      }
    }
  }

  // Language metadata
  get name() {
    let namePtr = V1._ts_language_name(this[0]);
    if (namePtr === 0) return null;
    return V1.UTF8ToString(namePtr);
  }

  get version() {
    return V1._ts_language_version(this[0]);
  }

  get abiVersion() {
    return V1._ts_language_abi_version(this[0]);
  }

  get fieldCount() {
    return this.fields.length - 1;
  }

  get stateCount() {
    return V1._ts_language_state_count(this[0]);
  }

  // Field lookup
  fieldIdForName(fieldName) {
    let id = this.fields.indexOf(fieldName);
    return id !== -1 ? id : null;
  }

  fieldNameForId(fieldId) {
    return this.fields[fieldId] ?? null;
  }

  // Query language (deprecated)
  query(source) {
    console.warn("Language.query is deprecated. Use new Query(language, source) instead.");
    return new Query(this, source);
  }

  // ============================================
  // Language.load() - Load Language from WASM
  // Location: chunks.89.mjs:837-859
  // ============================================
  static async load(wasmSource) {
    let wasmBytes;

    // Handle different input types
    if (wasmSource instanceof Uint8Array) {
      wasmBytes = Promise.resolve(wasmSource);
    } else if (globalThis.process?.versions.node) {
      // Node.js: read from file
      wasmBytes = (await import("fs/promises")).readFile(wasmSource);
    } else {
      // Browser: fetch from URL
      wasmBytes = fetch(wasmSource).then((response) =>
        response.arrayBuffer().then((buffer) => {
          if (response.ok) {
            return new Uint8Array(buffer);
          } else {
            let errorText = new TextDecoder("utf-8").decode(buffer);
            throw Error(`Language.load failed with status ${response.status}.

${errorText}`);
          }
        })
      );
    }

    // Load WASM module
    let wasmModule = await V1.loadWebAssemblyModule(await wasmBytes, {
      loadAsync: true
    });

    // Find language function in exports
    let exports = Object.keys(wasmModule);
    let languageFunctionName = exports.find((name) =>
      /^tree_sitter_\w+$/.test(name) &&
      !name.includes("external_scanner_")
    );

    if (!languageFunctionName) {
      console.log(`Couldn't find language function in WASM file. Symbols:
${JSON.stringify(exports, null, 2)}`);
      throw Error("Language.load failed: no language function found in WASM file");
    }

    // Call language function to get language pointer
    let languagePointer = wasmModule[languageFunctionName]();

    // Create Language instance
    return new Language(xl, languagePointer);
  }
}
```

### 5. Parser Class

Main parsing interface:

```javascript
// ============================================
// Parser - Tree-sitter WASM Parser
// Location: chunks.89.mjs (inferred from usage)
// ============================================
class Parser {
  static {
    X0(this, "Parser")
  }

  [0] = 0;              // WASM parser pointer
  language = null;      // Current language

  // Initialize parser
  constructor() {
    if (!V1)  // V1 is the WASM module
      throw Error("cannot construct a Parser before calling `init()`");

    // Create new parser in WASM memory
    this[0] = V1._ts_parser_new_wasm();
  }

  // Set the language for parsing
  setLanguage(languageInstance) {
    if (languageInstance) {
      if (languageInstance.constructor === Language) {
        // Set language in WASM
        V1._ts_parser_set_language(this[0], languageInstance[0]);
        this.language = languageInstance;
      } else {
        throw Error("Argument must be a Language");
      }
    } else {
      // Clear language
      V1._ts_parser_set_language(this[0], 0);
      this.language = languageInstance;
    }
    return this;
  }

  // Parse source code into syntax tree
  parse(sourceCode, oldTree, options) {
    if (!this.language)
      throw Error("Parser must have a language to parse");

    // Parse the source code
    // - sourceCode: string or function that returns chunks
    // - oldTree: previous Tree for incremental parsing
    // - options: { includedRanges, timeout, etc. }

    let treePointer = V1._ts_parser_parse_wasm(
      this[0],           // Parser pointer
      oldTree?.[0] || 0, // Old tree pointer (for incremental)
      // ... additional parsing parameters
    );

    // Create Tree wrapper around WASM tree
    return new Tree(xl, treePointer, this.language, this.textCallback);
  }

  // Delete parser (free WASM memory)
  delete() {
    V1._ts_parser_delete(this[0]);
    this[0] = 0;
  }

  // Set parsing timeout
  setTimeoutMicros(timeout) {
    V1._ts_parser_set_timeout_micros(this[0], timeout);
  }

  // Get parsing timeout
  getTimeoutMicros() {
    return V1._ts_parser_timeout_micros(this[0]);
  }

  // Reset parser state
  reset() {
    V1._ts_parser_reset(this[0]);
  }
}
```

## WASM Memory Management

### Marshal/Unmarshal Functions

Tree-sitter uses a marshal/unmarshal pattern to communicate between JavaScript and WASM memory:

```javascript
// ============================================
// Memory Management Functions
// Location: chunks.89.mjs:468-477
// ============================================

// Marshal Node - Write Node data to WASM memory
// Called before passing node to WASM functions
X0(N8, "marshalNode");
function marshalNode(node, offset = $2) {
  // Write node data to WASM memory at offset
  // - Node ID
  // - Tree pointer
  // - Start index
  // - Start position (row, column)
}

// Unmarshal Node - Read Node data from WASM memory
// Called after WASM functions return node data
X0(XY, "unmarshalNode");
function unmarshalNode(tree, offset = $2) {
  // Read node data from WASM memory
  // Create new Node instance with data
  let id = V1.getValue(offset, "i32");
  let other = V1.getValue(offset + d2, "i32");
  // ... read more fields
  return new Node(xl, { id, tree, startIndex, startPosition, other });
}

// Marshal TreeCursor - Write cursor data to WASM memory
X0(DZ, "marshalTreeCursor");
function marshalTreeCursor(cursor, offset = $2) {
  // Write cursor's 4 internal fields to WASM
  V1.setValue(offset, cursor[0], "i32");
  V1.setValue(offset + d2, cursor[1], "i32");
  V1.setValue(offset + 2 * d2, cursor[2], "i32");
  V1.setValue(offset + 3 * d2, cursor[3], "i32");
}

// Unmarshal TreeCursor - Read cursor data from WASM memory
X0(Hq, "unmarshalTreeCursor");
function unmarshalTreeCursor(cursor, offset = $2) {
  // Read cursor's 4 internal fields from WASM
  cursor[0] = V1.getValue(offset, "i32");
  cursor[1] = V1.getValue(offset + d2, "i32");
  cursor[2] = V1.getValue(offset + 2 * d2, "i32");
  cursor[3] = V1.getValue(offset + 3 * d2, "i32");
}

// Marshal Point - Write position to WASM memory
X0(bM, "marshalPoint");
function marshalPoint(offset, point) {
  V1.setValue(offset, point.row, "i32");
  V1.setValue(offset + d2, point.column, "i32");
}

// Unmarshal Point - Read position from WASM memory
X0(yAA, "unmarshalPoint");
function unmarshalPoint(offset) {
  return {
    row: V1.getValue(offset, "i32"),
    column: V1.getValue(offset + d2, "i32")
  };
}

// Marshal Range - Write range to WASM memory
X0(JA2, "marshalRange");
function marshalRange(offset, range) {
  marshalPoint(offset, range.startPosition);
  marshalPoint(offset + wk, range.endPosition);
  V1.setValue(offset + 2 * wk, range.startIndex, "i32");
  V1.setValue(offset + 2 * wk + d2, range.endIndex, "i32");
}

// Unmarshal Range - Read range from WASM memory
X0(D01, "unmarshalRange");
function unmarshalRange(offset) {
  return {
    startPosition: unmarshalPoint(offset),
    endPosition: unmarshalPoint(offset + wk),
    startIndex: V1.getValue(offset + 2 * wk, "i32"),
    endIndex: V1.getValue(offset + 2 * wk + d2, "i32")
  };
}
```

### Memory Layout

The implementation uses specific memory offsets for data structures:

```javascript
// ============================================
// Memory Offsets
// Location: chunks.89.mjs:4
// ============================================
d2 = 4;                     // Size of i32 (4 bytes)
Co1 = 4 * d2;               // Offset: 16 bytes
vU = 5 * d2;                // Offset: 20 bytes (size of Node/cursor data)
wk = 2 * d2;                // Offset: 8 bytes (size of Point)
cNA = 2 * d2 + 2 * wk;      // Offset: 24 bytes (size of Range)

$2 = /* base memory address for transfer */;

// Memory layout for Node (20 bytes total):
// [0-3]:   Context pointer
// [4-7]:   Node ID
// [8-11]:  Tree pointer
// [12-15]: Reserved/other
// [16-19]: Reserved

// Memory layout for Point (8 bytes):
// [0-3]:   Row (i32)
// [4-7]:   Column (i32)

// Memory layout for Range (24 bytes):
// [0-7]:   Start Position (Point)
// [8-15]:  End Position (Point)
// [16-19]: Start Index (i32)
// [20-23]: End Index (i32)
```

### Point Representation

```javascript
// ============================================
// Point Structure
// Location: chunks.89.mjs:4-7
// ============================================
yl = {
  row: 0,
  column: 0
};

// Used as default/zero point in many operations
// Example: tree.rootNode (no offset = yl)
```

### WASM Module Initialization

```javascript
// ============================================
// WASM Module Loading
// Location: chunks.89.mjs:860-966
// ============================================
k15 = (() => {
  var _scriptName = import.meta.url;

  return async function(moduleArg = {}) {
    var Module = moduleArg;
    var readyPromise = new Promise((resolve, reject) => {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });

    // Detect environment
    var ENVIRONMENT_IS_WEB = typeof window == "object";
    var ENVIRONMENT_IS_WORKER = typeof WorkerGlobalScope !== "undefined";
    var ENVIRONMENT_IS_NODE = typeof process == "object" &&
                              typeof process.versions == "object" &&
                              typeof process.versions.node == "string";

    // Initialize WASM memory
    var INITIAL_MEMORY = Module.INITIAL_MEMORY || 33554432;  // 32MB
    wasmMemory = new WebAssembly.Memory({
      initial: INITIAL_MEMORY / 65536,  // Pages (64KB each)
      maximum: 32768                     // 2GB max
    });

    // Create typed array views on WASM memory
    function updateMemoryViews() {
      var buffer = wasmMemory.buffer;
      Module.HEAP_DATA_VIEW = new DataView(buffer);
      Module.HEAP8 = new Int8Array(buffer);
      Module.HEAP16 = new Int16Array(buffer);
      Module.HEAPU8 = new Uint8Array(buffer);
      Module.HEAPU16 = new Uint16Array(buffer);
      Module.HEAP32 = new Int32Array(buffer);
      Module.HEAPU32 = new Uint32Array(buffer);
      Module.HEAPF32 = new Float32Array(buffer);
      Module.HEAPF64 = new Float64Array(buffer);
      Module.HEAP64 = new BigInt64Array(buffer);
      Module.HEAPU64 = new BigUint64Array(buffer);
    }
    updateMemoryViews();

    // Runtime initialization
    function initRuntime() {
      runtimeInitialized = true;
      wasmExports.__wasm_call_ctors();  // Call C++ constructors
      // ... more initialization
    }

    // Load and instantiate WASM
    // ... (WebAssembly.instantiate code)

    return Module;
  };
})();

// Global WASM module reference
var V1 = null;  // Set after initialization

// Initialize tree-sitter
async function init() {
  V1 = await k15();
  // V1 now contains all WASM exports
}
```

## Use Cases in Claude Code

### 1. Code Parsing

Parse source code to get AST:

```javascript
let parser = new Parser();
parser.setLanguage(language);
let tree = parser.parse(sourceCode);
```

### 2. AST Traversal

Navigate through syntax tree:

```javascript
let cursor = tree.walk();

// Traverse children
while (cursor.gotoNextSibling()) {
  console.log(cursor.nodeType);
}

// Navigate by position
cursor.gotoFirstChildForIndex(100);
```

### 3. Code Analysis

Extract information from nodes:

```javascript
let node = tree.rootNode;
console.log(node.type);        // Node type
console.log(node.text);        // Source text
console.log(node.startIndex);  // Start byte
console.log(node.endIndex);    // End byte
```

### 4. Incremental Parsing

Update tree after edits:

```javascript
let oldTree = parser.parse(oldSource);

// Apply edit
tree.edit({
  startIndex: 10,
  oldEndIndex: 15,
  newEndIndex: 20,
  startPosition: { row: 0, column: 10 },
  oldEndPosition: { row: 0, column: 15 },
  newEndPosition: { row: 0, column: 20 }
});

// Reparse
let newTree = parser.parse(newSource, oldTree);
```

### 5. Change Detection

Find what changed between versions:

```javascript
let changedRanges = newTree.getChangedRanges(oldTree);
for (let range of changedRanges) {
  console.log(range.startIndex, range.endIndex);
}
```

## Helper Functions

### Get Text: $o1()

```javascript
X0($o1, "getText");
// Extracts text from tree between positions
```

### Point Checking: dNA()

```javascript
X0(dNA, "isPoint");
// Validates point structure
```

### Internal Assertion: BIA()

```javascript
X0(BIA, "assertInternal");
// Validates internal symbol
```

## Summary

Tree-sitter integration in Claude Code provides:

1. **WASM-based parsing**: Language-agnostic code analysis
2. **Efficient traversal**: TreeCursor for fast navigation
3. **Memory management**: Explicit delete() for WASM memory
4. **Incremental parsing**: Edit support for efficient reparsing
5. **Change detection**: Track modifications between parses
6. **Rich API**: Complete access to AST information
7. **Language loading**: Dynamic language grammar loading
8. **Query support**: Pattern matching (via Query class)
9. **Position tracking**: Byte offsets and row/column positions
10. **Error detection**: Missing and error nodes identified

This enables Claude Code to perform sophisticated code analysis, refactoring, and navigation operations across multiple programming languages.
