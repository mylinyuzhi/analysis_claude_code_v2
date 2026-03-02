# Edit Tool - Deep Analysis (Claude Code 2.1.38)

> Complete analysis of the Edit file system tool: validation pipeline, execution flow, and UI rendering linkage.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI rendering infrastructure

Key functions in this document:
- `EditTool` (sW) - Edit tool definition object - chunks.134.mjs:2124
- `TOOL_NAME_EDIT` (bq) - Tool name constant - chunks.134.mjs
- `validateEditInput` (sW.validateInput) - 9-step validation pipeline - chunks.134.mjs:2167
- `callEditTool` (sW.call) - Execution method - chunks.134.mjs:2316
- `renderEditToolUseMessage` (IF4) - Header UI - chunks.134.mjs:1234
- `renderEditToolProgress` (xF4) - Progress UI (null) - chunks.134.mjs:1246
- `renderEditToolResult` (bF4) - Result diff UI - chunks.134.mjs:1250
- `renderEditToolRejected` (uF4) - Rejection preview - chunks.134.mjs:1271
- `renderEditToolError` (BF4) - Error display - chunks.134.mjs:1320
- `DiffViewer` (SP6) - Diff rendering component - chunks.134.mjs
- `PreviewEdit` (ZW1) - Edit preview component - chunks.134.mjs
- `generatePatch` (j_6) - Unified diff generator - chunks.134.mjs
- `findExactString` (PK1) - Fuzzy string matching - chunks.134.mjs
- `getLineEnding` (Qd) - CRLF/LF detection - chunks.134.mjs
- `getFileEncoding` (AX) - Encoding detection - chunks.134.mjs

---

## Architecture Overview

```
LLM generates Edit tool_use block
  { file_path, old_string, new_string, replace_all? }
             │
             ▼
  validateInput (9 ordered checks)
  ├── [1] old_string === new_string? → error
  ├── [2] permission denied? → error
  ├── [3] UNC/network path? → allow (passthrough)
  ├── [4] file doesn't exist? → error + "Did you mean?" hint
  ├── [5] .ipynb file? → redirect to NotebookEdit
  ├── [6] file not read yet? → error (readFileState)
  ├── [7] file modified since read? → error (timestamp check)
  ├── [8] old_string not found? → error
  └── [9] multiple matches + replace_all=false? → error
             │
             ▼
  Pre-hook execution (B1q)
             │
             ▼
  Permission check (checkEditPermissions / N51)
             │
             ▼
  call() execution
  ├── Skill dir triggers (TW1)
  ├── File watcher cache clear (EW1)
  ├── beforeFileEdited hook (Fd)
  ├── Read original content
  ├── Verify no external modification
  ├── Update file history state (if z2() enabled)
  ├── Find exact match (PK1 / fuzzy)
  ├── Generate unified patch (j_6)
  ├── Detect encoding + line endings
  ├── Write file (ft)
  ├── Notify LSP server
  ├── Update readFileState cache
  ├── CLAUDE.md special telemetry
  ├── Record patch (ix1)
  └── [remote mode] Compute git diff (xP6)
             │
             ▼
  Return { data: { filePath, oldString, newString,
                   originalFile, structuredPatch,
                   userModified, replaceAll, gitDiff? } }
             │
             ▼
  UI Rendering (bF4 → SP6 DiffViewer component)
```

---

## 1. Tool Definition Object

### EditTool - Top-level tool object

**What it does:** Defines the complete interface for the Edit file operation tool, including metadata, schema accessors, permission checker, and UI renderers.

**How it works:**

```javascript
// ============================================
// EditTool - Main file editing tool definition
// Location: chunks.134.mjs:2124-2166
// ============================================

// ORIGINAL (for source lookup):
sW = {
    name: bq,
    maxResultSizeChars: 1e5,
    strict: !0,
    async description() { return "A tool for editing files" },
    async prompt() { return pu4() },
    userFacingName: hP6,
    getToolUseSummary: SkA,
    getActivityDescription(A) { let q = SkA(A); return q ? `Editing ${q}` : "Editing file" },
    isEnabled() { return !0 },
    get inputSchema() { return Qw6() },
    get outputSchema() { return TR7() },
    isConcurrencySafe() { return !1 },
    isReadOnly() { return !1 },
    getPath(A) { return A.file_path },
    async checkPermissions(A, q) { let K = await q.getAppState(); return N51(sW, A, K.toolPermissionContext) },
    renderToolUseMessage: IF4,
    renderToolUseProgressMessage: xF4,
    renderToolResultMessage: bF4,
    renderToolUseRejectedMessage: uF4,
    renderToolUseErrorMessage: BF4,
    async validateInput(...) { ... },
    async call(...) { ... },
    mapToolResultToToolResultBlockParam(...) { ... }
}

// READABLE (for understanding):
const EditTool = {
    name: TOOL_NAME_EDIT,
    maxResultSizeChars: 100000,
    strict: true,
    async description() { return "A tool for editing files" },
    async prompt() { return getEditToolPrompt() },
    userFacingName: getEditToolUserFacingName,
    getToolUseSummary: getEditToolSummary,
    getActivityDescription(input) {
        let summary = getEditToolSummary(input);
        return summary ? `Editing ${summary}` : "Editing file"
    },
    isEnabled() { return true },
    get inputSchema() { return getEditToolInputSchema() },
    get outputSchema() { return getEditToolOutputSchema() },
    isConcurrencySafe() { return false },   // File writes are NOT concurrency-safe
    isReadOnly() { return false },           // Mutates file system
    getPath(input) { return input.file_path },
    async checkPermissions(input, context) {
        let appState = await context.getAppState();
        return checkEditPermissions(EditTool, input, appState.toolPermissionContext)
    },
    renderToolUseMessage: renderEditToolUseMessage,       // Header: shows file path
    renderToolUseProgressMessage: renderEditToolProgress, // Returns null (sync op)
    renderToolResultMessage: renderEditToolResult,        // Diff viewer component
    renderToolUseRejectedMessage: renderEditToolRejected, // Preview diff before rejection
    renderToolUseErrorMessage: renderEditToolError,       // Error message display
}

// Mapping: sW→EditTool, bq→TOOL_NAME_EDIT, pu4→getEditToolPrompt, hP6→getEditToolUserFacingName,
//          SkA→getEditToolSummary, Qw6→getEditToolInputSchema, TR7→getEditToolOutputSchema,
//          N51→checkEditPermissions
```

**Key properties:**
- `isConcurrencySafe: false` — Only one Edit tool may run at a time per session
- `isReadOnly: false` — Mutates the filesystem (requires permission check)
- `maxResultSizeChars: 100000` — Caps result payload size to prevent context overflow
- `strict: true` — Strict Zod schema validation enabled

---

## 2. Input Validation Pipeline

### validateInput - 9 Ordered Safety Checks

**What it does:** Validates the Edit tool input before any filesystem access or permission check. This is the first line of defense against bad inputs from the LLM.

**How it works (check order is critical):**

```javascript
// ============================================
// validateEditInput - 9-step validation pipeline
// Location: chunks.134.mjs:2167-2297
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ file_path: A, old_string: q, new_string: K, replace_all: Y = !1 }, z) {
    if (q === K) return { result: !1, behavior: "ask", message: "No changes to make...", errorCode: 1 };
    let w = g4(A), H = await z.getAppState();
    if (Gj(w, H.toolPermissionContext, "edit", "deny") !== null) return { result: !1, behavior: "ask", message: "File is in a directory...", errorCode: 2 };
    if (w.startsWith("\\\\") || w.startsWith("//")) return { result: !0 };
    let O = b1();
    if (!O.existsSync(w) && q === "") return { result: !0 };   // new file creation
    if (!O.existsSync(w)) return { result: !1, ..., errorCode: 4 };
    if (w.endsWith(".ipynb")) return { result: !1, message: `Use the ${jM} tool...`, errorCode: 5 };
    let _ = z.readFileState.get(w);
    if (!_) return { result: !1, behavior: "ask", message: "File has not been read yet...", errorCode: 6 };
    if (_) { if (aW(w) > _.timestamp) { /* check for content identity */ return { result: !1, ..., errorCode: 7 } } }
    let J = O.readFileSync(w, { encoding: AX(w) }).replaceAll(`\r\n`, `\n`);
    let X = PK1(J, q);
    if (!X) return { result: !1, ..., errorCode: 8 };
    let D = J.split(X).length - 1;
    if (D > 1 && !Y) return { result: !1, ..., errorCode: 9 };
    let j = zF4(w, J, () => Y ? J.replaceAll(X, K) : J.replace(X, K));
    if (j !== null) return j;
    return { result: !0, meta: { actualOldString: X } }
}

// READABLE (for understanding):
async validateInput({ file_path, old_string, new_string, replace_all = false }, sessionContext) {

    // [Check 1] Identical strings — no-op edit
    if (old_string === new_string) {
        return { result: false, behavior: "ask",
                 message: "No changes to make: old_string and new_string are exactly the same.",
                 errorCode: 1 };
    }

    let absolutePath = resolvePath(file_path);
    let appState = await sessionContext.getAppState();

    // [Check 2] Permission explicitly denied by rules
    if (checkPathDenyRule(absolutePath, appState.toolPermissionContext, "edit", "deny") !== null) {
        return { result: false, behavior: "ask",
                 message: "File is in a directory that is denied by your permission settings.",
                 errorCode: 2 };
    }

    // [Check 3] Network/UNC paths → allowed without further checks
    if (absolutePath.startsWith("\\\\") || absolutePath.startsWith("//")) return { result: true };

    let fs = getFileSystem();

    // [Check 4] File existence
    if (!fs.existsSync(absolutePath) && old_string === "") return { result: true }; // new file
    
    // [Check 4b] New file creation but file already exists (implicit check in source)
    // Error Code 3: Cannot create new file - file already exists
    if (fs.existsSync(absolutePath) && old_string === "") {
        let existingContent = fs.readFileSync(absolutePath, { encoding: getEncoding(absolutePath) }).replaceAll("\r\n", "\n").trim();
        if (existingContent !== "") {
             return { result: false, behavior: "ask",
                      message: "Cannot create new file - file already exists.",
                      errorCode: 3 };
        }
        return { result: true }; // Allow if existing file is empty
    }

    if (!fs.existsSync(absolutePath)) {
        let suggestion = findSimilarFile(absolutePath);
        return { result: false, behavior: "ask",
                 message: `File does not exist${suggestion ? `. Did you mean ${suggestion}?` : ""}`,
                 errorCode: 4 };
    }

    // [Check 5] Jupyter notebook — redirect to NotebookEdit
    if (absolutePath.endsWith(".ipynb")) {
        return { result: false, behavior: "ask",
                 message: `File is a Jupyter Notebook. Use the ${NOTEBOOK_EDIT_TOOL_NAME} to edit this file.`,
                 errorCode: 5 };
    }

    // [Check 6] File must have been read first
    let fileState = sessionContext.readFileState.get(absolutePath);
    if (!fileState) {
        return { result: false, behavior: "ask",
                 message: "File has not been read yet. Read it first before writing to it.",
                 meta: { isFilePathAbsolute: String(isAbsolutePath(file_path)) },
                 errorCode: 6 };
    }

    // [Check 7] External modification detection (mtime check)
    if (getModificationTime(absolutePath) > fileState.timestamp) {
        // Exception: allow if content is identical despite mtime change
        let currentContent = fs.readFileSync(absolutePath, { encoding: getEncoding(absolutePath) })
            .replaceAll("\r\n", "\n");
        if (!(fileState.offset === undefined && fileState.limit === undefined &&
              currentContent === fileState.content)) {
            return { result: false, behavior: "ask",
                     message: "File has been modified since read. Read it again before attempting to write it.",
                     errorCode: 7 };
        }
    }

    let currentContent = fs.readFileSync(absolutePath, { encoding: getEncoding(absolutePath) })
        .replaceAll("\r\n", "\n");

    // [Check 8] old_string must exist in file
    let searchString = findExactString(currentContent, old_string); // PK1 - fuzzy whitespace matching
    if (!searchString) {
        return { result: false, behavior: "ask",
                 message: `String to replace not found in file.\nString: ${old_string}`,
                 meta: { isFilePathAbsolute: String(isAbsolutePath(file_path)) },
                 errorCode: 8 };
    }

    // [Check 9] Multiple matches require replace_all=true
    let matchCount = currentContent.split(searchString).length - 1;
    if (matchCount > 1 && !replace_all) {
        return { result: false, behavior: "ask",
                 message: `Found ${matchCount} matches of the string to replace. Set replace_all=true to replace all.`,
                 errorCode: 9 };
    }

    // [Optional] Lint/syntax check on proposed result
    let lintResult = performLintValidation(absolutePath, currentContent,
        () => replace_all ? currentContent.replaceAll(searchString, new_string)
                          : currentContent.replace(searchString, new_string));
    if (lintResult !== null) return lintResult;

    return { result: true, meta: { actualOldString: searchString } }
}

// Mapping: A→file_path, q→old_string, K→new_string, Y→replace_all, z→sessionContext,
//          g4→resolvePath, Gj→checkPathDenyRule, b1→getFileSystem, aW→getModificationTime,
//          AX→getEncoding, PK1→findExactString, zF4→performLintValidation, jM→NOTEBOOK_EDIT_TOOL_NAME
```

**Why this check order:**
- Identical strings caught first (cheapest check, no I/O)
- Permission deny checked before file I/O (avoids leaking path existence)
- UNC paths passthrough early (network paths have different semantics)
- Notebook redirect prevents corrupting `.ipynb` JSON with text replacement
- `readFileState` check ensures the LLM actually knows the file content
- Fuzzy match (`PK1`) handles common LLM failures with whitespace normalization
- Lint validation is last (most expensive) — only runs if all other checks pass

**Key insight about `PK1` (findExactString):** The fuzzy matching normalizes whitespace differences between what the LLM "remembers" reading and what's actually in the file. This handles cases where the LLM reads a file with trailing spaces but the old_string omits them.

---

## 3. Execution Method

### callEditTool - Core execution with full side effects

**What it does:** Performs the actual string replacement, handles all pre/post-write operations, updates all relevant caches, and returns a structured patch result.

**How it works:**

```javascript
// ============================================
// callEditTool - Execute file edit operation
// Location: chunks.134.mjs:2316-2402
// ============================================

// ORIGINAL (for source lookup):
async call({ file_path: A, old_string: q, new_string: K, replace_all: Y = !1 },
           { readFileState: z, userModified: w, updateFileHistoryState: H, dynamicSkillDirTriggers: $ },
           O, _) {
    let J = b1(), X = g4(A), D = h6(), j = TW1([X], D);
    if (j.length > 0) { for (let B of j) $?.add(B); vW1(j).catch(() => {}) }
    EW1([X], D), await Fd.beforeFileEdited(X);
    let M = J.existsSync(X) ? $J(X) : "";
    if (J.existsSync(X)) {
        let B = aW(X), S = z.get(X);
        if (!S || B > S.timestamp) { if (!(S && S.offset === void 0 && S.limit === void 0 && M === S.content)) throw Error(ty1) }
    }
    if (z2()) await Xt(H, X, _.uuid);
    let P = PK1(M, q) || q,
        { patch: W, updatedFile: G } = j_6({ filePath: X, fileContents: M, oldString: P, newString: K, replaceAll: Y });
    let f = EEY(X);
    J.mkdirSync(f);
    let Z = J.existsSync(X) ? Qd(X) : "LF", N = J.existsSync(X) ? AX(X) : "utf8";
    ft(X, G, N, Z);
    let T = md();
    if (T) NP6(`file://${X}`), T.changeFile(X, G).catch(...), T.saveFile(X).catch(...);
    _t(X, M, G);
    z.set(X, { content: G, timestamp: aW(X), offset: void 0, limit: void 0 });
    if (X.endsWith(`${kEY}CLAUDE.md`)) c("tengu_write_claudemd", {});
    ix1(W), eS({ operation: "edit", tool: "FileEditTool", filePath: X });
    let k;
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "remote" && x8("tengu_quartz_lantern", !1)) {
        let B = Date.now(), S = await xP6(X);
        if (S) k = S;
        c("tengu_tool_use_diff_computed", { isEditTool: !0, durationMs: Date.now() - B, hasDiff: !!S })
    }
    return { data: { filePath: A, oldString: P, newString: K, originalFile: M, structuredPatch: W,
                     userModified: w ?? !1, replaceAll: Y, ...k && { gitDiff: k } } }
}

// READABLE (for understanding):
async call({ file_path, old_string, new_string, replace_all = false },
           { readFileState, userModified, updateFileHistoryState, dynamicSkillDirTriggers },
           toolContext, invocationContext) {

    let fs = getFileSystem();
    let absolutePath = resolvePath(file_path);
    let cwd = getCwd();

    // === Step 1: Skill directory trigger detection ===
    let skillDirs = findSkillDirTriggers([absolutePath], cwd);
    if (skillDirs.length > 0) {
        for (let dir of skillDirs) dynamicSkillDirTriggers?.add(dir);
        refreshSkillDirs(skillDirs).catch(() => {});  // Background refresh
    }

    // === Step 2: Clear file watcher cache ===
    clearFileWatcherCache([absolutePath], cwd);  // EW1

    // === Step 3: Pre-edit hook ===
    await diagnosticsManager.beforeFileEdited(absolutePath);  // Captures pre-edit LSP diagnostics

    // === Step 4: Read original content ===
    let originalContent = fs.existsSync(absolutePath) ? readFileSyncWithEncoding(absolutePath) : "";

    // === Step 5: Double-check external modification ===
    if (fs.existsSync(absolutePath)) {
        let modTime = getModificationTime(absolutePath);
        let fileState = readFileState.get(absolutePath);
        if (!fileState || modTime > fileState.timestamp) {
            // Only throw if content actually changed (handles formatter-only mtime bumps)
            if (!(fileState && fileState.offset === undefined && fileState.limit === undefined &&
                  originalContent === fileState.content)) {
                throw Error(CONCURRENT_EDIT_ERROR_MESSAGE);  // ty1
            }
        }
    }

    // === Step 6: Update file history (undo support) ===
    if (isFileHistoryEnabled()) {  // z2() feature flag
        await saveFileHistoryEntry(updateFileHistoryState, absolutePath, invocationContext.uuid);
    }

    // === Step 7: Find and apply replacement ===
    let searchString = findExactString(originalContent, old_string) || old_string;  // PK1
    let { patch, updatedFile } = generateUnifiedPatch({  // j_6
        filePath: absolutePath,
        fileContents: originalContent,
        oldString: searchString,
        newString: new_string,
        replaceAll: replace_all
    });

    // === Step 8: Create parent directory if needed ===
    let parentDir = getParentDirectory(absolutePath);  // EEY
    fs.mkdirSync(parentDir, { recursive: true });

    // === Step 9: Detect and preserve encoding/line endings ===
    let lineEnding = fs.existsSync(absolutePath) ? detectLineEnding(absolutePath) : "LF";  // Qd
    let encoding = fs.existsSync(absolutePath) ? detectEncoding(absolutePath) : "utf8";    // AX

    // === Step 10: Write file ===
    writeFileWithEncoding(absolutePath, updatedFile, encoding, lineEnding);  // ft

    // === Step 11: Notify LSP server ===
    let lspManager = getLspManager();  // md()
    if (lspManager) {
        clearDeliveredDiagnosticsForUri(`file://${absolutePath}`);  // NP6
        lspManager.changeFile(absolutePath, updatedFile).catch(logLspError);
        lspManager.saveFile(absolutePath).catch(logLspError);
    }

    // === Step 12: Update git watcher cache ===
    updateGitWatcherCache(absolutePath, originalContent, updatedFile);  // _t

    // === Step 13: Update readFileState cache ===
    readFileState.set(absolutePath, {
        content: updatedFile,
        timestamp: getModificationTime(absolutePath),
        offset: undefined,
        limit: undefined
    });

    // === Step 14: Special CLAUDE.md telemetry ===
    if (absolutePath.endsWith(`${PATH_SEP}CLAUDE.md`)) {
        telemetry("tengu_write_claudemd", {});
    }

    // === Step 15: Record patch and file operation ===
    recordPatch(patch);  // ix1
    recordFileOperation({ operation: "edit", tool: "FileEditTool", filePath: absolutePath });  // eS

    // === Step 16: [Remote mode only] Compute git diff ===
    let gitDiffInfo;
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "remote" && isFeatureEnabled("tengu_quartz_lantern")) {
        let start = Date.now();
        let diff = await computeGitDiff(absolutePath);  // xP6
        if (diff) gitDiffInfo = diff;
        telemetry("tengu_tool_use_diff_computed", {
            isEditTool: true,
            durationMs: Date.now() - start,
            hasDiff: !!diff
        });
    }

    return {
        data: {
            filePath: file_path,
            oldString: searchString,
            newString: new_string,
            originalFile: originalContent,
            structuredPatch: patch,
            userModified: userModified ?? false,
            replaceAll: replace_all,
            ...(gitDiffInfo && { gitDiff: gitDiffInfo })
        }
    }
}

// Mapping: A→file_path, q→old_string, K→new_string, Y→replace_all, z→readFileState,
//          w→userModified, H→updateFileHistoryState, $→dynamicSkillDirTriggers,
//          O→toolContext, _→invocationContext, J→fs, X→absolutePath, D→cwd,
//          j→skillDirs, TW1→findSkillDirTriggers, vW1→refreshSkillDirs,
//          EW1→clearFileWatcherCache, Fd→diagnosticsManager, M→originalContent,
//          B→modTime, S→fileState, ty1→CONCURRENT_EDIT_ERROR_MESSAGE,
//          z2→isFileHistoryEnabled, Xt→saveFileHistoryEntry,
//          P→searchString, W→patch, G→updatedFile, j_6→generateUnifiedPatch,
//          f→parentDir, EEY→getParentDirectory, Z→lineEnding, Qd→detectLineEnding,
//          N→encoding, AX→detectEncoding, ft→writeFileWithEncoding,
//          T→lspManager, md→getLspManager, NP6→clearDeliveredDiagnosticsForUri,
//          _t→updateGitWatcherCache, kEY→PATH_SEP, c→telemetry,
//          ix1→recordPatch, eS→recordFileOperation, k→gitDiffInfo, xP6→computeGitDiff
```

**Why 16 ordered steps:**
- Steps 1-3 (skill dirs, cache clear, pre-edit hook) set up side-effects that depend on knowing the file
- Step 5 (double-check modification) mirrors validation but uses throws instead of error codes — the second check catches race conditions between validateInput and call
- Step 9 (encoding/line ending detection) prevents corrupting files with mixed endings or non-UTF-8 encoding
- LSP notification (step 11) must happen AFTER the write so the LSP server reads updated content
- Step 16 (git diff) is conditional and remote-only to avoid unnecessary subprocess overhead in local mode

**Key insight — `j_6` (generateUnifiedPatch):** Returns both the `patch` (unified diff format) and `updatedFile` (full new content). The patch is used for UI diff display; the updatedFile is what gets written. This two-output design separates "what changed" from "the result" cleanly.

---

## 4. UI Rendering — Complete Linkage

The Edit tool has 5 rendering functions covering every possible display state:

### State: Tool Use Invoked (header display)

```javascript
// ============================================
// renderEditToolUseMessage (IF4) - Shows file path as breadcrumb
// Location: chunks.134.mjs:1234-1244
// ============================================

// ORIGINAL (for source lookup):
function IF4({ file_path: A }, { verbose: q }) {
    if (!A) return null;
    if (A.startsWith(UM())) return "";
    return rO.createElement(AE, { filePath: A }, q ? A : L3(A))
}

// READABLE (for understanding):
function renderEditToolUseMessage({ file_path }, { verbose }) {
    if (!file_path) return null;
    // Plan files (CLAUDE.md) show empty string to suppress display
    if (file_path.startsWith(getPlanFilePrefix())) return "";
    // Show full path in verbose mode, just filename otherwise
    return React.createElement(FilePathBreadcrumb, { filePath: file_path },
        verbose ? file_path : getFilename(file_path)
    )
}

// Mapping: IF4→renderEditToolUseMessage, A→file_path, q→verbose, rO→React,
//          AE→FilePathBreadcrumb, L3→getFilename, UM→getPlanFilePrefix
```

**UI output:** `Edit (path/to/file.ts)` or `Edit (src/server.ts)` in normal mode

### State: Tool Executing (progress display)

```javascript
// ============================================
// renderEditToolProgress (xF4) - No progress indicator
// Location: chunks.134.mjs:1246-1248
// ============================================

// ORIGINAL (for source lookup):
function xF4() { return null }

// READABLE (for understanding):
function renderEditToolProgress() { return null }
```

**Why null:** File edits are synchronous operations completing in milliseconds. There's no meaningful "in-progress" state to display.

### State: Tool Completed (result display)

```javascript
// ============================================
// renderEditToolResult (bF4) - Unified diff viewer
// Location: chunks.134.mjs:1250-1268
// ============================================

// ORIGINAL (for source lookup):
function bF4({ filePath: A, structuredPatch: q, originalFile: K }, Y, { style: z, verbose: w }) {
    let H = A.startsWith(UM());
    return rO.createElement(SP6, {
        filePath: A,
        structuredPatch: q,
        firstLine: K.split(`\n`)[0] ?? null,
        fileContent: K,
        style: z,
        verbose: w,
        previewHint: H ? "/plan to preview" : void 0
    })
}

// READABLE (for understanding):
function renderEditToolResult({ filePath, structuredPatch, originalFile }, unused, { style, verbose }) {
    let isPlanFile = filePath.startsWith(getPlanFilePrefix());
    return React.createElement(DiffViewer, {
        filePath,
        structuredPatch,          // Unified diff patches for rendering
        firstLine: originalFile.split("\n")[0] ?? null,  // First line for context
        fileContent: originalFile, // Full original content for context
        style,
        verbose,
        previewHint: isPlanFile ? "/plan to preview" : undefined  // Plan-specific hint
    })
}

// Mapping: bF4→renderEditToolResult, A→filePath, q→structuredPatch, K→originalFile,
//          Y→unused, z→style, w→verbose, H→isPlanFile, SP6→DiffViewer, UM→getPlanFilePrefix
```

**UI output:** A terminal diff view showing `- removed lines` and `+ added lines`. For plan files (CLAUDE.md), shows hint `/plan to preview`.

### State: Tool Use Rejected by User (pre-rejection preview)

```javascript
// ============================================
// renderEditToolRejected (uF4) - Preview the edit before user rejected it
// Location: chunks.134.mjs:1271-1318
// ============================================

// ORIGINAL (for source lookup):
function uF4({ file_path: A, old_string: q, new_string: K, replace_all: Y = !1 }, z) {
    let { style: w, verbose: H } = z;
    if (q === "") return rO.createElement(ZW1, {
        file_path: A, operation: "write", content: K,
        firstLine: K.split(`\n`)[0] ?? null, verbose: H
    });
    try {
        let O = b1().existsSync(A) ? b1().readFileSync(A, { encoding: "utf8" }) : "",
            _ = PK1(O, q) || q,
            { patch: J } = j_6({ filePath: A, fileContents: O, oldString: _, newString: K, replaceAll: Y });
        return rO.createElement(ZW1, {
            file_path: A, operation: "update", patch: J,
            firstLine: O.split(`\n`)[0] ?? null, fileContent: O, style: w, verbose: H
        })
    } catch (O) {
        return logError(O), rO.createElement(Box, { height: 1 }, rO.createElement(Text, null, "(No changes)"))
    }
}

// READABLE (for understanding):
function renderEditToolRejected({ file_path, old_string, new_string, replace_all = false }, context) {
    let { style, verbose } = context;

    // Case A: Creating new file (old_string is empty)
    if (old_string === "") {
        return React.createElement(EditPreview, {
            file_path,
            operation: "write",         // Create operation
            content: new_string,
            firstLine: new_string.split("\n")[0] ?? null,
            verbose
        });
    }

    // Case B: Modifying existing file — generate diff to show what would have changed
    try {
        let currentContent = fs.existsSync(file_path) ?
            fs.readFileSync(file_path, { encoding: "utf8" }) : "";
        let searchString = findExactString(currentContent, old_string) || old_string;
        let { patch } = generateUnifiedPatch({
            filePath: file_path, fileContents: currentContent,
            oldString: searchString, newString: new_string, replaceAll: replace_all
        });
        return React.createElement(EditPreview, {
            file_path,
            operation: "update",         // Modify operation
            patch,                        // The diff that would have been applied
            firstLine: currentContent.split("\n")[0] ?? null,
            fileContent: currentContent,
            style, verbose
        })
    } catch (error) {
        logError(error);
        return React.createElement(Box, { height: 1 },
            React.createElement(Text, null, "(No changes)")
        )
    }
}

// Mapping: uF4→renderEditToolRejected, A→file_path, q→old_string, K→new_string,
//          Y→replace_all, z→context, w→style, H→verbose, O→currentContent,
//          _→searchString, J→patch, ZW1→EditPreview, b1→fs, PK1→findExactString, j_6→generateUnifiedPatch
```

**Key insight:** The rejection renderer actually reads the current file and computes the diff at render time. This means even when the user rejects, they see exactly what the tool was proposing to change — providing full transparency.

### State: Tool Execution Error

```javascript
// ============================================
// renderEditToolError (BF4) - Context-aware error display
// Location: chunks.134.mjs:1320-1335
// ============================================

// ORIGINAL (for source lookup):
function BF4(A, q) {
    let { verbose: K } = q;
    if (!K && typeof A === "string" && C4(A, "tool_use_error")) {
        if (C4(A, "tool_use_error")?.includes("File has not been read yet"))
            return rO.createElement(Box, null, rO.createElement(Text, { dimColor: !0 }, "File must be read first"));
        return rO.createElement(Box, null, rO.createElement(Text, { color: "error" }, "Error editing file"))
    }
    return rO.createElement(z5, { result: A, verbose: K })
}

// READABLE (for understanding):
function renderEditToolError(errorResult, context) {
    let { verbose } = context;

    // Non-verbose mode: show simplified user-friendly messages
    if (!verbose && typeof errorResult === "string" && extractToolUseError(errorResult)) {
        let errorText = extractToolUseError(errorResult);

        // Most common error: file not read first
        if (errorText?.includes("File has not been read yet")) {
            return React.createElement(Box, null,
                React.createElement(Text, { dimColor: true }, "File must be read first")
            );
        }

        // Generic edit error
        return React.createElement(Box, null,
            React.createElement(Text, { color: "error" }, "Error editing file")
        );
    }

    // Verbose mode: show full error details
    return React.createElement(ToolResultDisplay, { result: errorResult, verbose })
}

// Mapping: BF4→renderEditToolError, A→errorResult, q→context, K→verbose,
//          C4→extractToolUseError, z5→ToolResultDisplay
```

**Error display logic:**
- `errorCode 6` ("not read yet") → subtle dimmed "File must be read first" (not alarming, just informative)
- Other errors → red "Error editing file"
- Verbose mode → full error JSON with all details

---

## 5. Key Algorithms

### findExactString (PK1) - Fuzzy Whitespace Matching

**What it does:** Searches for `old_string` in file content with whitespace normalization to handle LLM imprecision.

**Why needed:** LLMs often generate `old_string` values with slightly different whitespace than what's actually in the file (trailing spaces, indent inconsistencies). `PK1` normalizes both the content and the search string before matching, increasing the success rate.

**Key insight:** If `PK1` returns a match, the match is used instead of the raw `old_string`. This means the actual replacement uses the exact whitespace from the file, not the LLM's approximation.

### generateUnifiedPatch (j_6) - Diff Generation

**What it does:** Takes old/new content and produces a structured patch object containing hunk-by-hunk changes.

**Output format:**
```typescript
{
    patch: UnifiedDiff[],  // Array of hunks for display
    updatedFile: string    // Full new file content for writing
}
```

**Key insight:** Two outputs allow the patch to drive the diff view while the updatedFile is written atomically. The UI renders the patch hunks as `- removed` / `+ added` lines.

### detectLineEnding (Qd) + detectEncoding (AX)

**What they do:** Detect the existing line ending style (LF vs CRLF) and character encoding (UTF-8, UTF-16, Latin-1) of the file.

**Why important:** A file originally written with CRLF line endings would become corrupted if written back with LF endings. The detection preserves the original format, preventing spurious diffs in version control.

---

## 6. Complete Execution Timeline

```
T+0ms  LLM produces tool_use { type:"edit", file_path, old_string, new_string }
T+0ms  validateInput() begins — 9 synchronous checks
T+1ms  validateInput() returns { result: true, meta: { actualOldString } }
T+1ms  Pre-tool hooks (B1q) run — hooks may modify input or override permission
T+2ms  Permission check (N51/checkEditPermissions) — may prompt user
T+?ms  User approves (or auto-approved by rules)
T+?ms  call() begins
T+?ms  Skill dir triggers checked (TW1)
T+?ms  beforeFileEdited hook fires (captures pre-edit diagnostics)
T+?ms  Original content read from disk
T+?ms  External modification double-check
T+?ms  File history entry saved (if enabled)
T+?ms  Fuzzy string search (PK1) + patch generation (j_6)
T+?ms  Parent dir created if needed
T+?ms  Encoding/line ending detected
T+?ms  File written to disk
T+?ms  LSP changeFile() + saveFile() notified
T+?ms  readFileState cache updated
T+?ms  Telemetry events recorded
T+?ms  [remote] Git diff computed
T+?ms  Result { structuredPatch, originalFile, ... } returned
T+?ms  Post-tool hooks (b1q) run
T+?ms  Result rendered via bF4 → SP6 (DiffViewer)
```
