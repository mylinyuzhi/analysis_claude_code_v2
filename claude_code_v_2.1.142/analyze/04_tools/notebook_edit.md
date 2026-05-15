# NotebookEdit Tool — v2.1.142

## Overview

`NotebookEditTool` (`fB` in cli_inner_pretty.js:361758) edits Jupyter notebooks (`.ipynb` files) at the cell level. It supports three edit modes: `replace` (overwrite a cell's source), `insert` (add a new cell), and `delete` (remove a cell). The tool parses the notebook JSON, mutates the cells array in place, re-serializes, and writes the result back. It enforces a Read-before-Edit gate (same model as FileEditTool) and integrates with file history. Tool-name in transcripts: `Edit Notebook`.

## Schema (Zod)

```javascript
// ============================================
// notebookEditInputSchema — NotebookEditTool input parameters
// Location: cli_inner_pretty.js (lazy schema bi_)
// ============================================

// ORIGINAL (for source lookup):
// bi_() returns z.strictObject({ notebook_path, cell_id?, new_source, cell_type?, edit_mode? })

// READABLE (for understanding):
const notebookEditInputSchema = z.strictObject({
  notebook_path: z.string().describe('The absolute path to the Jupyter notebook file to edit (must be absolute, not relative)'),
  cell_id: z.string().optional().describe(
    'The ID of the cell to edit. When inserting a new cell, the new cell will be inserted after the cell with this ID, ' +
    'or at the beginning if not specified.'
  ),
  new_source: z.string().describe('The new source for the cell'),
  cell_type: z.enum(['code', 'markdown']).optional().describe(
    'The type of the cell (code or markdown). If not specified, it defaults to the current cell type. ' +
    'If using edit_mode=insert, this is required.'
  ),
  edit_mode: z.enum(['replace', 'insert', 'delete']).optional().describe('The type of edit to make. Defaults to replace.'),
});

// Mapping: bi_→notebookEditInputSchema
```

Output schema (`xi_()`):
- `new_source: string`
- `cell_id?: string`
- `cell_type: 'code' | 'markdown'`
- `language: string` (from `notebook.metadata.language_info.name`, defaults to `'python'`)
- `edit_mode: string` (the mode actually applied — may differ from input if `replace` was coerced to `insert`)
- `error?: string`
- `notebook_path: string`
- `original_file: string` (pre-edit JSON)
- `updated_file: string` (post-edit JSON)

`maxResultSizeChars` is **100,000**. The tool sets `shouldDefer: true`, meaning it's deferred behind tool-search by default — it's only loaded when the model actually wants to edit a notebook, saving baseline context.

## validateInput

```javascript
// ============================================
// validateInput — Read-before-Edit + .ipynb check + cell-id resolution
// Location: cli_inner_pretty.js:361817-361870 (mirrors src/tools/NotebookEditTool/NotebookEditTool.ts:176-293)
// ============================================

// ORIGINAL (for source lookup):
// async validateInput({ notebook_path, cell_type, cell_id, edit_mode = "replace" }, _) {
//   const A = eq(notebook_path); /* team-mem secret check, UNC bypass, .ipynb check, mode validation,
//                                    Read-before-Edit gate, staleness check, JSON parse, cell lookup */
// }

// READABLE (for understanding):
async function validateInput({ notebook_path, cell_type, cell_id, edit_mode = 'replace' }, toolUseContext) {
  const fullPath = expandPath(notebook_path);

  // (1) Subagent team-memory secret-write guard
  const teamMemError = checkTeamMemSecrets(fullPath, toolUseContext.agentId);
  if (teamMemError) return { result: false, message: teamMemError, errorCode: 12 };

  // (2) UNC bypass
  if (fullPath.startsWith('\\\\') || fullPath.startsWith('//')) return { result: true };

  // (3) Extension check — must be .ipynb
  if (path.extname(fullPath) !== '.ipynb') {
    return { result: false, message: 'File must be a Jupyter notebook (.ipynb file). For editing other file types, use the FileEdit tool.', errorCode: 2 };
  }

  // (4) edit_mode validation
  if (edit_mode !== 'replace' && edit_mode !== 'insert' && edit_mode !== 'delete') {
    return { result: false, message: 'Edit mode must be replace, insert, or delete.', errorCode: 4 };
  }

  // (5) Insert requires cell_type
  if (edit_mode === 'insert' && !cell_type) {
    return { result: false, message: 'Cell type is required when using edit_mode=insert.', errorCode: 5 };
  }

  // (6) Read-before-Edit gate
  const readTimestamp = toolUseContext.readFileState.get(fullPath);
  if (!readTimestamp) {
    return { result: false, message: 'File has not been read yet. Read it first before writing to it.', errorCode: 9 };
  }

  // (7) Mode (chmod) check — read-only file rejection
  if (fileHistoryEnabled()) {
    try {
      const { mode } = await getFsImplementation().stat(fullPath);
      if (isModeRestricted(mode)) return { result: false, message: FILE_READ_ONLY_ERROR_MESSAGE, errorCode: 11 };
    } catch (e) { if (!isENOENT(e)) throw e; }
  }

  // (8) Staleness check
  if (getFileModificationTime(fullPath) > readTimestamp.timestamp) {
    return { result: false, message: 'File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.', errorCode: 10 };
  }

  // (9) Read + parse the notebook
  let content;
  try {
    content = readFileSyncWithMetadata(fullPath).content;
  } catch (e) {
    if (isENOENT(e)) return { result: false, message: 'Notebook file does not exist.', errorCode: 1 };
    throw e;
  }
  const notebook = safeParseJSON(content);
  if (!notebook) return { result: false, message: 'Notebook is not valid JSON.', errorCode: 6 };

  // (10) Cell-id resolution
  if (!cell_id) {
    if (edit_mode !== 'insert') {
      return { result: false, message: 'Cell ID must be specified when not inserting a new cell.', errorCode: 7 };
    }
  } else {
    const cellIndex = notebook.cells.findIndex(cell => cell.id === cell_id);
    if (cellIndex === -1) {
      // Fall back to `cell-N` numeric index (used by FileReadTool when notebook lacks cell ids)
      const parsedCellIndex = parseCellId(cell_id);
      if (parsedCellIndex !== undefined) {
        if (!notebook.cells[parsedCellIndex]) return { result: false, message: `Cell with index ${parsedCellIndex} does not exist in notebook.`, errorCode: 7 };
      } else {
        return { result: false, message: `Cell with ID "${cell_id}" not found in notebook.`, errorCode: 8 };
      }
    }
  }

  return { result: true };
}

// Mapping: eq→expandPath, dnH→checkTeamMemSecrets, IU7→path module (lazy require),
//          Mc→readFileSyncWithMetadata, Y7→safeParseJSON, hX$→parseCellId,
//          oN→getFileModificationTime, QRH→isModeRestricted, Yx8→fileHistoryEnabled
```

### Why a Read-before-Edit gate for notebooks?

Same reason as FileEditTool: the model could otherwise blast `replace` operations at a notebook it has never seen. The gate ensures the model has read the cell list and knows which cell IDs exist. Notebook reads expand into a structured cell list via `mapNotebookCellsToToolResult` so the model gets cell metadata (cell_id, cell_type, source) explicitly.

### Cell-ID resolution: real ID + `cell-N` fallback

When FileReadTool serializes a notebook, cells get IDs either from `cell.id` (real, nbformat ≥ 4.5) or a generated `cell-${index}` (legacy notebooks without IDs). The validator handles both forms:
1. Try `notebook.cells.findIndex(c => c.id === cell_id)`.
2. On miss, try `parseCellId(cell_id)` which extracts the index from `cell-N` strings.
3. If still not found, error.

This makes the tool resilient to notebooks from older Jupyter versions.

## checkPermissions

```javascript
async function checkPermissions(input, context) {
  return checkWritePermissionForTool(NotebookEditTool, input, context.getAppState().toolPermissionContext);
}
```

Uses the same write-permission walker as FileEditTool/FileWriteTool. The `getPath(input)` returns `input.notebook_path` so allow/deny rules treat notebooks just like any other file. The `backfillObservableInput` runs `expandPath` on `notebook_path` so hook allowlists can't be bypassed via `~` or relative paths.

## call

```javascript
// ============================================
// NotebookEditTool.call — JSON parse → mutate → JSON stringify → write
// Location: cli_inner_pretty.js (call on fB, mirrors src/tools/NotebookEditTool/NotebookEditTool.ts:295-489)
// ============================================

// ORIGINAL (for source lookup):
// async call({ notebook_path, new_source, cell_id, cell_type, edit_mode: originalEditMode }, { readFileState, updateFileHistoryState }, _, parentMessage) {
//   const fullPath = expandPath(notebook_path);
//   if (fileHistoryEnabled()) await fileHistoryTrackEdit(updateFileHistoryState, fullPath, parentMessage.uuid);
//   const { content, encoding, lineEndings } = readFileSyncWithMetadata(fullPath);
//   const notebook = jsonParse(content); // non-memoized — we mutate in place
//   /* resolve cellIndex, coerce replace→insert when at end, generate new cell_id for nbformat ≥ 4.5,
//      mutate based on edit_mode (delete: splice, insert: build cell + splice, replace: targetCell.source = ...),
//      jsonStringify, writeTextContent, update readFileState. */
// }

// READABLE (for understanding):
async function call({ notebook_path, new_source, cell_id, cell_type, edit_mode: originalEditMode }, { readFileState, updateFileHistoryState }, _, parentMessage) {
  const fullPath = expandPath(notebook_path);
  if (fileHistoryEnabled()) {
    await fileHistoryTrackEdit(updateFileHistoryState, fullPath, parentMessage.uuid);
  }
  try {
    const { content, encoding, lineEndings } = readFileSyncWithMetadata(fullPath);
    let notebook;
    try {
      notebook = jsonParse(content);  // NOT safeParseJSON — we mutate, can't share memoized refs
    } catch {
      return { data: { /* error: 'Notebook is not valid JSON.' */ } };
    }

    // (1) Cell-index resolution: real id → cell-N fallback → 0 if no cell_id (insert at start)
    let cellIndex;
    if (!cell_id) {
      cellIndex = 0;
    } else {
      cellIndex = notebook.cells.findIndex(c => c.id === cell_id);
      if (cellIndex === -1) {
        const parsedCellIndex = parseCellId(cell_id);
        if (parsedCellIndex !== undefined) cellIndex = parsedCellIndex;
      }
      if (originalEditMode === 'insert') cellIndex += 1; // Insert AFTER the named cell
    }

    // (2) Replace at end + 1 → coerce to insert (with default cell_type if not provided)
    let edit_mode = originalEditMode;
    if (edit_mode === 'replace' && cellIndex === notebook.cells.length) {
      edit_mode = 'insert';
      if (!cell_type) cell_type = 'code';
    }

    // (3) Generate new cell_id for nbformat ≥ 4.5
    const language = notebook.metadata.language_info?.name ?? 'python';
    let new_cell_id;
    if (notebook.nbformat > 4 || (notebook.nbformat === 4 && notebook.nbformat_minor >= 5)) {
      if (edit_mode === 'insert') new_cell_id = Math.random().toString(36).substring(2, 15);
      else if (cell_id !== null) new_cell_id = cell_id;
    }

    // (4) Mutate
    if (edit_mode === 'delete') {
      notebook.cells.splice(cellIndex, 1);
    } else if (edit_mode === 'insert') {
      const new_cell = cell_type === 'markdown'
        ? { cell_type: 'markdown', id: new_cell_id, source: new_source, metadata: {} }
        : { cell_type: 'code', id: new_cell_id, source: new_source, metadata: {}, execution_count: null, outputs: [] };
      notebook.cells.splice(cellIndex, 0, new_cell);
    } else {
      // replace
      const targetCell = notebook.cells[cellIndex];
      targetCell.source = new_source;
      if (targetCell.cell_type === 'code') {
        // Modified code cell — reset execution count + clear outputs
        targetCell.execution_count = null;
        targetCell.outputs = [];
      }
      if (cell_type && cell_type !== targetCell.cell_type) targetCell.cell_type = cell_type;
    }

    // (5) Serialize + write
    const IPYNB_INDENT = 1;
    const updatedContent = jsonStringify(notebook, null, IPYNB_INDENT);
    writeTextContent(fullPath, updatedContent, encoding, lineEndings);

    // (6) Update readFileState — invalidate dedup match, sync mtime
    readFileState.set(fullPath, {
      content: updatedContent,
      timestamp: getFileModificationTime(fullPath),
      offset: undefined,
      limit: undefined,
    });

    return { data: { new_source, cell_type: cell_type ?? 'code', language, edit_mode, cell_id: new_cell_id || undefined, error: '', notebook_path: fullPath, original_file: content, updated_file: updatedContent } };
  } catch (error) {
    return { data: { new_source, cell_type: cell_type ?? 'code', language: 'python', edit_mode: 'replace', error: error.message ?? 'Unknown error', cell_id, notebook_path: fullPath, original_file: '', updated_file: '' } };
  }
}

// Mapping: eq→expandPath, Mc→readFileSyncWithMetadata, jsonParse/jsonStringify→slowOperations.ts wrappers,
//          parseCellId (hX$)→legacy cell-N parser, writeTextContent, oN→getFileModificationTime
```

### Key algorithm: replace-past-end coercion

**What it does:** If the model says `replace` on a cellIndex that's at `notebook.cells.length` (i.e., one past the last cell), the tool silently coerces it to `insert`.

**How it works:**
```javascript
if (edit_mode === 'replace' && cellIndex === notebook.cells.length) {
  edit_mode = 'insert';
  if (!cell_type) cell_type = 'code';
}
```

**Why this approach:** The model frequently asks to "replace cell-5" in a notebook with 5 cells (indices 0-4). Without coercion this would fail with "Cell with index 5 does not exist". With coercion, it appends a new cell — what the model likely meant. The default `cell_type: 'code'` matches the most common case.

**Trade-off:** This is silent magic — the model doesn't get an explicit "I coerced to insert" signal beyond `edit_mode: 'insert'` in the return value. Defensible because the alternative is a friction error that the model would just retry with `insert`.

### Key algorithm: clear outputs on modify

**What it does:** When `replace`-ing a code cell's source, clear its `outputs` array and reset `execution_count` to null.

**How it works:**
```javascript
if (targetCell.cell_type === 'code') {
  targetCell.execution_count = null;
  targetCell.outputs = [];
}
```

**Why this approach:** A cell's outputs reflect a previous execution of its source. After modifying source, the outputs are stale and misleading. Setting `execution_count: null` marks the cell as "not yet executed", and Jupyter's UI will re-show the `[ ]` indicator.

**Edge case:** Markdown cells don't have outputs — the `if (targetCell.cell_type === 'code')` guard avoids creating `outputs: []` on markdown cells. Markdown→code or code→markdown conversions trigger the `cell_type` reassignment in the next line.

### Why `jsonParse` not `safeParseJSON` in call() but `safeParseJSON` in validate()?

**`safeParseJSON`** is memoized by content string and returns a shared object reference. Safe for read-only inspection (validate just checks structure).

**`jsonParse`** is non-memoized. `call()` **mutates** the parsed notebook in place (`cells.splice`, `targetCell.source = ...`), so a shared reference would poison the cache for subsequent validateInput() calls or other call() invocations against the same file content.

### Notebook indentation: 1-space

`jsonStringify(notebook, null, 1)` — single-space indent. Pre-modification notebooks have varying indentation (Jupyter writes 2 spaces, nbformat ≥ 4 specifies "any whitespace"). Writing back with consistent 1-space indent gives stable diffs across edits.

### Cell ID generation

`Math.random().toString(36).substring(2, 15)` — produces a ~13-character base36 string (the leading "0." is stripped). Not cryptographically random, but cell IDs only need to be unique within a single notebook, so collision risk is negligible. Matches Jupyter's default ID format.

## Render methods

- `renderToolUseMessage` (`vU7`) — `NotebookEdit(path, cell_id, mode)` chrome.
- `renderToolUseRejectedMessage` (`kU7`) — for permission denial.
- `renderToolUseErrorMessage` (`NU7`) — for validateInput failures.
- `renderToolResultMessage` (`EU7`) — shows the cell-level diff: old source vs new source.

`mapToolResultToToolResultBlockParam` is mode-specific:
- `replace` → `"Updated cell ${cell_id} with ${new_source}"`
- `insert` → `"Inserted cell ${cell_id} with ${new_source}"`
- `delete` → `"Deleted cell ${cell_id}"`
- Error → `{ content: error, is_error: true }`

## Key insights

1. **`shouldDefer: true`** marks NotebookEditTool as a deferred tool — it's only loaded into the model's tool list when the model explicitly activates it via the tool search. Notebooks are a minority workflow; deferring saves baseline tool-context bytes for every other session.

2. **The cell-N fallback ID** lives in `parseCellId(cell_id)`. It accepts `"cell-5"`, `"cell-15"`, etc. and returns the integer. Used both in validateInput (for existence checks) and call (for index resolution). This is how the tool stays compatible with legacy notebooks that don't have real cell IDs.

3. **`originalEditMode` is preserved** in call() so the offset-after-cell-id logic doesn't double-coerce. The `+= 1` happens for `originalEditMode === 'insert'`, not the (possibly-coerced) `edit_mode`.

4. **Markdown cells get `outputs: undefined`**, not `outputs: []`. They're a different shape in JSON. The mutation logic respects this — `cell_type` is the discriminator.

5. **`updated_file` in the output** is the full post-edit JSON content. Combined with `original_file`, this lets renderers compute their own diff if needed. The output is *not* compressed for storage (no `stripForStorage` override), so notebooks-as-context can be very token-heavy if edited multiple times in a session.

6. **No LSP integration.** Unlike FileEditTool/FileWriteTool, NotebookEditTool doesn't call `lspManager.changeFile/saveFile` because LSP servers don't understand `.ipynb` (they expect line-based source files). The LSP behaviour for notebook editing depends on the editor's notebook integration (VS Code, JupyterLab, etc.) which provides its own LSP bridge.

7. **`backfillObservableInput`** expands `notebook_path` for hook allowlist matching, the same pattern as FileEditTool.

## v2.1.112 → v2.1.142 deltas

| Version | Change | Where |
|---------|--------|-------|
| 2.1.112 | NotebookEdit now uses `readFileSyncWithMetadata` (single pass for content+encoding+endings) instead of separate detectEncoding/readFile/detectEndings chain | upstream in `readFileForEdit` |
| 2.1.113 | (no notebook-specific changes) | — |
| 2.1.119 | Subagent run with different model than main: file reads no longer flagged with malware warning — affects notebook cells with code that look "suspicious" | upstream |
| 2.1.142 | (no notebook-specific functional changes) | — |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_filesystem.md](../00_overview/symbol_additions_v2_1_142_tools_filesystem.md) — full mapping table

Key functions in this document:
- `NotebookEditTool` (fB) — top-level tool object built by `XK`
- `checkWritePermissionForTool` (VkH) — shared write-permission walker
- `readFileSyncWithMetadata` (Mc) — sync read with encoding + line-ending detection
- `parseCellId` (hX$) — legacy `cell-N` index parser
- `safeParseJSON` (Y7) — memoized JSON parse (read-only use)
- `jsonParse` / `jsonStringify` (slowOperations.ts) — non-memoized JSON ops
- `writeTextContent` — preserve original encoding + line endings on write
- `fileHistoryTrackEdit` — pre-edit backup for undo
- `fileHistoryEnabled` (Yx8) — gate for file history
- `checkTeamMemSecrets` (dnH) — team-memory secret-write guard
- `getFileModificationTime` (oN) — sync stat-based mtime
- `IPYNB_INDENT` — 1-space JSON indent for consistent diffs
