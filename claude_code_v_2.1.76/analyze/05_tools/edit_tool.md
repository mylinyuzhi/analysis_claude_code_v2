# Edit Tool - Deep Analysis (Claude Code 2.1.76)

> Complete analysis of the Edit file system tool: validation pipeline, execution flow, and UI rendering linkage.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI rendering infrastructure

Key functions in this document:
- `EditTool` (pX) - Edit tool definition object - chunks.170.mjs:1116
- `TOOL_NAME_EDIT` (R4) - Tool name constant - chunks.56.mjs:102
- `validateEditInput` (pX.validateInput) - 10-step validation pipeline - chunks.170.mjs:1172
- `callEditTool` (pX.call) - Execution method - chunks.170.mjs:1318
- `renderEditToolUseMessage` (NGq) - Header UI - chunks.170.mjs:939
- `renderEditToolProgress` (VGq) - Progress UI (null)
- `renderEditToolResult` (kGq) - Result diff UI - chunks.170.mjs:959
- `renderEditToolRejected` (EGq) - Rejection preview - chunks.170.mjs:976
- `renderEditToolError` (yGq) - Error display - chunks.170.mjs
- `getEditToolInputSchema` (lV1) - Input schema accessor - chunks.170.mjs:1137
- `getEditToolOutputSchema` (Pa4) - Output schema accessor - chunks.170.mjs:1149
- `checkEditPermissions` (Xz6) - Permission check - chunks.170.mjs:1165
- `findExactString` (sq6) - Fuzzy string matching - chunks.57.mjs:190
- `generateUnifiedPatch` (qw1) - Diff generation - chunks.57.mjs:249
- `applyEditsAndGeneratePatch` (Qx6) - Core patch logic - chunks.57.mjs:267
- `normalizeQuotes` (uf7) - Quote normalization - chunks.57.mjs:174
- `adjustNewStringQuotes` (hD6) - Quote preservation - chunks.57.mjs:198

---

## Architecture Overview

```
LLM generates Edit tool_use block
  { file_path, old_string, new_string, replace_all? }
             │
             ▼
  validateInput (10 ordered checks)
  ├── [0] path validation? → error
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
// Location: chunks.170.mjs:1116-1166
// ============================================

// ORIGINAL (for source lookup):
pX = {
    name: R4,
    maxResultSizeChars: 1e5,
    strict: !0,
    async description() { return "A tool for editing files" },
    async prompt() { return bf7() },
    userFacingName: ph1,
    getToolUseSummary: $n8,
    getActivityDescription(A) { let q = $n8(A); return q ? `Editing ${q}` : "Editing file" },
    isEnabled() { return !0 },
    get inputSchema() { return lV1() },
    inputParamAliases: {
        old_str: "old_string",
        new_str: "new_string",
        oldString: "old_string",
        newString: "new_string",
        filePath: "file_path",
        filepath: "file_path",
        path: "file_path"
    },
    get outputSchema() { return Pa4() },
    isConcurrencySafe() { return !1 },
    isReadOnly() { return !1 },
    getPath(A) { return A.file_path },
    async checkPermissions(A, q) { let K = q.getAppState(); return Xz6(pX, A, K.toolPermissionContext) },
    renderToolUseMessage: NGq,
    renderToolUseProgressMessage: VGq,
    renderToolResultMessage: kGq,
    renderToolUseRejectedMessage: EGq,
    renderToolUseErrorMessage: yGq,
    async validateInput(...) { ... },
    async call(...) { ... }
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
    inputParamAliases: {
        // Support various parameter name aliases for flexibility
        old_str: "old_string",
        new_str: "new_string",
        oldString: "old_string",
        newString: "new_string",
        filePath: "file_path",
        filepath: "file_path",
        path: "file_path"
    },
    get outputSchema() { return getEditToolOutputSchema() },
    isConcurrencySafe() { return false },   // File writes are NOT concurrency-safe
    isReadOnly() { return false },           // Mutates file system
    getPath(input) { return input.file_path },
    async checkPermissions(input, context) {
        let appState = await context.getAppState();
        return checkEditPermissions(EditTool, input, appState.toolPermissionContext)
    },
    renderToolUseMessage: renderEditToolUseMessage,
    renderToolUseProgressMessage: renderEditToolProgress,
    renderToolResultMessage: renderEditToolResult,
    renderToolUseRejectedMessage: renderEditToolRejected,
    renderToolUseErrorMessage: renderEditToolError,
}

// Mapping: pX→EditTool, R4→TOOL_NAME_EDIT, bf7→getEditToolPrompt, ph1→getEditToolUserFacingName,
//          $n8→getEditToolSummary, lV1→getEditToolInputSchema, Pa4→getEditToolOutputSchema,
//          Xz6→checkEditPermissions, NGq→renderEditToolUseMessage, VGq→renderEditToolProgress,
//          kGq→renderEditToolResult, EGq→renderEditToolRejected, yGq→renderEditToolError
```

**Key properties:**
- `isConcurrencySafe: false` — Only one Edit tool may run at a time per session
- `isReadOnly: false` — Mutates the filesystem (requires permission check)
- `maxResultSizeChars: 100000` — Caps result payload size to prevent context overflow
- `strict: true` — Strict Zod schema validation enabled

---

## 2. Input Validation Pipeline

### validateInput - 10 Ordered Safety Checks

**What it does:** Validates the Edit tool input before any filesystem access or permission check. This is the first line of defense against bad inputs from the LLM.

**How it works (check order is critical):**

```javascript
// ============================================
// validateEditInput - 10-step validation pipeline
// Location: chunks.170.mjs:1172-1298
// ============================================

// ORIGINAL (for source lookup):
async validateInput(A, q) {
    let { file_path: K, old_string: Y, new_string: z, replace_all: _ = !1 } = A,
        w = L4(K), O = cV1(w, z);
    if (O) return { result: !1, message: O, errorCode: 0 };
    if (Y === z) return { result: !1, behavior: "ask", message: "No changes to make...", errorCode: 1 };
    let $ = q.getAppState();
    if (ZX(w, $.toolPermissionContext, "edit", "deny") !== null) return { result: !1, behavior: "ask", message: "File is in a denied directory...", errorCode: 2 };
    if (w.startsWith("\\\\") || w.startsWith("//")) return { result: !0 };
    let j = $1(), J;
    try { let Z = await j.readFileBytes(w); J = Z.toString(G).replaceAll(`\r\n`, `\n`) }
    catch (Z) { if (Z.code === "ENOENT") J = null; else throw Z }
    if (J === null) {
        if (Y === "") return { result: !0 };  // New file creation
        return { result: !1, behavior: "ask", message: "File does not exist...", errorCode: 4 }
    }
    if (Y === "") {
        if (J.trim() !== "") return { result: !1, behavior: "ask", message: "Cannot create new file - file already exists.", errorCode: 3 };
        return { result: !0 }
    }
    if (w.endsWith(".ipynb")) return { result: !1, behavior: "ask", message: `Use the ${bJ} tool...`, errorCode: 5 };
    let M = q.readFileState.get(w);
    if (!M || M.isPartialView) return { result: !1, behavior: "ask", message: "File has not been read yet...", errorCode: 6 };
    if (M && Jh(w) > M.timestamp && !(M.offset === void 0 && M.limit === void 0 && J === M.content))
        return { result: !1, behavior: "ask", message: "File modified since read...", errorCode: 7 };
    let D = J, X = sq6(D, Y);
    if (!X) return { result: !1, behavior: "ask", message: "String not found...", errorCode: 8 };
    let P = D.split(X).length - 1;
    if (P > 1 && !_) return { result: !1, behavior: "ask", message: "Multiple matches...", errorCode: 9 };
    let W = TGq(w, D, () => _ ? D.replaceAll(X, z) : D.replace(X, z));
    if (W !== null) return W;
    return { result: !0, meta: { actualOldString: X } }
}

// READABLE (for understanding):
async validateInput({ file_path, old_string, new_string, replace_all = false }, sessionContext) {

    // [Check 0] File path validation (symlink traversal, etc.)
    let absolutePath = resolvePath(file_path);
    let pathError = validatePathForNewContent(absolutePath, new_string);
    if (pathError) return { result: false, message: pathError, errorCode: 0 };

    // [Check 1] Identical strings — no-op edit
    if (old_string === new_string) {
        return { result: false, behavior: "ask",
                 message: "No changes to make: old_string and new_string are exactly the same.",
                 errorCode: 1 };
    }

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
    let fileContent = null;

    // Read file if exists
    try {
        let bytes = await fs.readFileBytes(absolutePath);
        let encoding = bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE ? "utf16le" : "utf8";
        fileContent = bytes.toString(encoding).replaceAll("\r\n", "\n");
    } catch (err) {
        if (err.code === "ENOENT") fileContent = null;
        else throw err;
    }

    // [Check 4] File doesn't exist
    if (fileContent === null) {
        if (old_string === "") return { result: true };  // New file creation allowed

        let suggestion = findSimilarFile(absolutePath);
        let similarDir = await findSimilarDirectory(absolutePath);
        let message = `File does not exist. ${getReadToolHint()} ${getWriteToolHint()}.`;
        if (similarDir) message += ` Did you mean ${similarDir}?`;
        else if (suggestion) message += ` Did you mean ${suggestion}?`;

        return { result: false, behavior: "ask", message, errorCode: 4 };
    }

    // [Check 3b - Error Code 3] New file creation but file already exists
    if (old_string === "") {
        if (fileContent.trim() !== "") {
            return { result: false, behavior: "ask",
                     message: "Cannot create new file - file already exists.",
                     errorCode: 3 };
        }
        return { result: true };  // Allow if existing file is empty
    }

    // [Check 5] Jupyter notebook — redirect to NotebookEdit
    if (absolutePath.endsWith(".ipynb")) {
        return { result: false, behavior: "ask",
                 message: `File is a Jupyter Notebook. Use the ${NOTEBOOK_EDIT_TOOL_NAME} to edit this file.`,
                 errorCode: 5 };
    }

    // [Check 6] File must have been read first
    let fileState = sessionContext.readFileState.get(absolutePath);
    if (!fileState || fileState.isPartialView) {
        return { result: false, behavior: "ask",
                 message: "File has not been read yet. Read it first before writing to it.",
                 meta: { isFilePathAbsolute: String(isAbsolutePath(file_path)) },
                 errorCode: 6 };
    }

    // [Check 7] External modification detection (mtime check)
    if (fileState && getModificationTime(absolutePath) > fileState.timestamp) {
        // Exception: allow if content is identical despite mtime change
        if (!(fileState.offset === undefined && fileState.limit === undefined &&
              fileContent === fileState.content)) {
            return { result: false, behavior: "ask",
                     message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
                     errorCode: 7 };
        }
    }

    // [Check 8] old_string must exist in file
    let searchString = findExactString(fileContent, old_string);  // sq6 - fuzzy whitespace matching
    if (!searchString) {
        return { result: false, behavior: "ask",
                 message: `String to replace not found in file.\nString: ${old_string}`,
                 meta: { isFilePathAbsolute: String(isAbsolutePath(file_path)) },
                 errorCode: 8 };
    }

    // [Check 9] Multiple matches require replace_all=true
    let matchCount = fileContent.split(searchString).length - 1;
    if (matchCount > 1 && !replace_all) {
        return { result: false, behavior: "ask",
                 message: `Found ${matchCount} matches of the string to replace, but replace_all is false. To replace all occurrences, set replace_all to true.`,
                 meta: { isFilePathAbsolute: String(isAbsolutePath(file_path)), actualOldString: searchString },
                 errorCode: 9 };
    }

    // [Check 10] Lint/syntax check on proposed result
    let lintResult = performLintValidation(absolutePath, fileContent,
        () => replace_all ? fileContent.replaceAll(searchString, new_string)
                          : fileContent.replace(searchString, new_string));
    if (lintResult !== null) return lintResult;

    return { result: true, meta: { actualOldString: searchString } }
}

// Mapping: K→file_path, Y→old_string, z→new_string, _→replace_all, q→sessionContext,
//          L4→resolvePath, cV1→validatePathForNewContent, ZX→checkPathDenyRule,
//          $1→getFileSystem, Jh→getModificationTime, sq6→findExactString,
//          TGq→performLintValidation, bJ→NOTEBOOK_EDIT_TOOL_NAME
```

**Complete Error Code Taxonomy:**

| Code | Meaning | Recovery |
|------|---------|----------|
| 0 | Path validation failed | Check file path format |
| 1 | `old_string === new_string` | LLM should provide different strings |
| 2 | Path denied by permission rules | Check allowed directories |
| 3 | Cannot create new file - file already exists | Use non-empty old_string to edit |
| 4 | File doesn't exist | Check file path, or create file first |
| 5 | File is `.ipynb` | Use NotebookEdit instead |
| 6 | File not read yet | Call Read tool first |
| 7 | File modified since read | Re-read file to get latest content |
| 8 | `old_string` not found | Check exact string match (whitespace, etc.) |
| 9 | Multiple matches | Add `replace_all: true` or use more specific string |

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

### findExactString (sq6) - Fuzzy Whitespace Matching

**What it does:** Searches for `old_string` in file content with whitespace/quote normalization to handle LLM imprecision.

**How it works:**

```javascript
// ============================================
// findExactString - Fuzzy search with quote normalization
// Location: chunks.57.mjs:190-196
// ============================================

// ORIGINAL (for source lookup):
function sq6(A, q) {
    if (A.includes(q)) return q;
    let K = uf7(q),
        z = uf7(A).indexOf(K);
    if (z !== -1) return A.substring(z, z + q.length);
    return null
}

// READABLE (for understanding):
function findExactString(fileContent, searchString) {
    // [Step 1] Try exact match first
    if (fileContent.includes(searchString)) return searchString;

    // [Step 2] Normalize quotes and try fuzzy match
    // uf7 normalizes various quote types: smart quotes, curly quotes, etc.
    let normalizedSearch = normalizeQuotes(searchString);
    let normalizedContent = normalizeQuotes(fileContent);
    let index = normalizedContent.indexOf(normalizedSearch);

    // [Step 3] Return the original text from file (preserving actual whitespace)
    if (index !== -1) return fileContent.substring(index, index + searchString.length);

    return null;
}

// Mapping: sq6→findExactString, A→fileContent, q→searchString, uf7→normalizeQuotes
```

**Why this approach:**
- LLMs often generate `old_string` with different quote characters (curly vs straight quotes, smart quotes)
- The `uf7` helper normalizes all quote variants before matching
- Returns the actual text from the file (not the LLM's approximation) to ensure the replacement uses exact whitespace

**Key insight:** If `sq6` returns a match, the match is used instead of the raw `old_string`. This means the actual replacement uses the exact whitespace from the file, not the LLM's approximation.

### normalizeQuotes (uf7) - Quote Normalization Helper

**What it does:** Normalizes various quote character types for fuzzy matching.

```javascript
// ============================================
// normalizeQuotes - Convert all quote types to standard quotes
// Location: chunks.57.mjs:174-176
// ============================================

// ORIGINAL (for source lookup):
function uf7(A) {
    return A.replaceAll(VO8, "'").replaceAll(Aw1, "'")
            .replaceAll(kO8, '"').replaceAll(EO8, '"')
}

// READABLE (for understanding):
function normalizeQuotes(text) {
    return text
        .replaceAll(SMART_SINGLE_QUOTE_OPEN, "'")   // ' → '
        .replaceAll(SMART_SINGLE_QUOTE_CLOSE, "'")  // ' → '
        .replaceAll(SMART_DOUBLE_QUOTE_OPEN, '"')   // " → "
        .replaceAll(SMART_DOUBLE_QUOTE_CLOSE, '"'); // " → "
}

// Mapping: uf7→normalizeQuotes, VO8→SMART_SINGLE_QUOTE_OPEN, Aw1→SMART_SINGLE_QUOTE_CLOSE,
//          kO8→SMART_DOUBLE_QUOTE_OPEN, EO8→SMART_DOUBLE_QUOTE_CLOSE
```

### generateUnifiedPatch (qw1) - Diff Generation

**What it does:** Takes old/new content and produces a structured patch object containing hunk-by-hunk changes.

**How it works:**

```javascript
// ============================================
// generateUnifiedPatch - Generate unified diff from edits
// Location: chunks.57.mjs:249-264
// ============================================

// ORIGINAL (for source lookup):
function qw1({
    filePath: A,
    fileContents: q,
    oldString: K,
    newString: Y,
    replaceAll: z = !1
}) {
    return Qx6({
        filePath: A,
        fileContents: q,
        edits: [{
            old_string: K,
            new_string: Y,
            replace_all: z
        }]
    })
}

// READABLE (for understanding):
function generateUnifiedPatch({ filePath, fileContents, oldString, newString, replaceAll = false }) {
    // Delegates to the multi-edit handler with a single edit
    return applyEditsAndGeneratePatch({
        filePath,
        fileContents,
        edits: [{
            old_string: oldString,
            new_string: newString,
            replace_all: replaceAll
        }]
    });
}

// Mapping: qw1→generateUnifiedPatch, Qx6→applyEditsAndGeneratePatch,
//          A→filePath, q→fileContents, K→oldString, Y→newString, z→replaceAll
```

### applyEditsAndGeneratePatch (Qx6) - Core Patch Logic

**What it does:** Applies multiple edits to a file and generates the unified diff output.

```javascript
// ============================================
// applyEditsAndGeneratePatch - Apply edits and generate diff
// Location: chunks.57.mjs:267-303
// ============================================

// ORIGINAL (for source lookup):
function Qx6({
    filePath: A,
    fileContents: q,
    edits: K
}) {
    let Y = q,
        z = [];
    if (!q && K.length === 1 && K[0] && K[0].old_string === "" && K[0].new_string === "") return {
        patch: SL({
            filePath: A,
            fileContents: q,
            edits: [{ old_string: q, new_string: Y, replace_all: !1 }]
        }),
        updatedFile: ""
    };
    for (let w of K) {
        let O = w.old_string.replace(/\n+$/, "");
        for (let H of z)
            if (O !== "" && H.includes(O)) throw Error("Cannot edit file: old_string is substring of previous new_string");
        let $ = Y;
        if (Y = w.old_string === "" ? w.new_string : Em3(Y, w.old_string, w.new_string, w.replace_all), Y === $)
            throw Error("String not found in file. Failed to apply edit.");
        z.push(w.new_string)
    }
    if (Y === q) throw Error("Original and edited file match exactly. Failed to apply edit.");
    return {
        patch: t21({
            filePath: A,
            oldContent: vU(q),
            newContent: vU(Y)
        }),
        updatedFile: Y
    }
}

// READABLE (for understanding):
function applyEditsAndGeneratePatch({ filePath, fileContents, edits }) {
    let updatedContent = fileContents;
    let newStrings = [];

    // Edge case: Empty file with empty edit
    if (!fileContents && edits.length === 1 && edits[0]?.old_string === "" && edits[0].new_string === "") {
        return {
            patch: generateEmptyPatch({ filePath, fileContents, edits }),
            updatedFile: ""
        };
    }

    // Apply each edit in sequence
    for (let edit of edits) {
        let normalizedOldString = edit.old_string.replace(/\n+$/, "");

        // Safety: Check for overlapping edits
        for (let prevNewString of newStrings) {
            if (normalizedOldString !== "" && prevNewString.includes(normalizedOldString)) {
                throw Error("Cannot edit file: old_string is substring of previous new_string");
            }
        }

        let previousContent = updatedContent;

        // Apply the edit
        if (edit.old_string === "") {
            updatedContent = edit.new_string;  // New file creation
        } else {
            updatedContent = applyStringReplacement(
                updatedContent, edit.old_string, edit.new_string, edit.replace_all
            );
        }

        // Verify edit was applied
        if (updatedContent === previousContent) {
            throw Error("String not found in file. Failed to apply edit.");
        }

        newStrings.push(edit.new_string);
    }

    // Verify something changed
    if (updatedContent === fileContents) {
        throw Error("Original and edited file match exactly. Failed to apply edit.");
    }

    return {
        patch: computeUnifiedDiff({
            filePath,
            oldContent: splitLines(fileContents),  // vU
            newContent: splitLines(updatedContent) // vU
        }),
        updatedFile: updatedContent
    };
}

// Mapping: Qx6→applyEditsAndGeneratePatch, A→filePath, q→fileContents, K→edits,
//          Y→updatedContent, z→newStrings, w→edit, O→normalizedOldString,
//          Em3→applyStringReplacement, t21→computeUnifiedDiff, vU→splitLines
```

**Output format:**
```typescript
{
    patch: UnifiedDiff[],  // Array of hunks for display
    updatedFile: string    // Full new file content for writing
}
```

**Key insight:** Two outputs allow the patch to drive the diff view while the updatedFile is written atomically. The UI renders the patch hunks as `- removed` / `+ added` lines.

### adjustNewStringQuotes (hD6) - Quote Preservation

**What it does:** Adjusts quote characters in the new_string to match the quote style used in the old_string.

```javascript
// ============================================
// adjustNewStringQuotes - Preserve quote style in replacements
// Location: chunks.57.mjs:198-207
// ============================================

// ORIGINAL (for source lookup):
function hD6(A, q, K) {
    if (A === q) return K;
    let Y = q.includes(kO8) || q.includes(EO8),
        z = q.includes(VO8) || q.includes(Aw1);
    if (!Y && !z) return K;
    let _ = K;
    if (Y) _ = Vm3(_);
    if (z) _ = km3(_);
    return _
}

// READABLE (for understanding):
function adjustNewStringQuotes(originalOldString, matchedOldString, newString) {
    // If the strings are identical, no adjustment needed
    if (originalOldString === matchedOldString) return newString;

    // Detect quote types in the matched old string
    let hasSmartDoubleQuotes = matchedOldString.includes(SMART_DOUBLE_QUOTE_OPEN) ||
                               matchedOldString.includes(SMART_DOUBLE_QUOTE_CLOSE);
    let hasSmartSingleQuotes = matchedOldString.includes(SMART_SINGLE_QUOTE_OPEN) ||
                               matchedOldString.includes(SMART_SINGLE_QUOTE_CLOSE);

    // If no smart quotes, return unchanged
    if (!hasSmartDoubleQuotes && !hasSmartSingleQuotes) return newString;

    let adjustedNewString = newString;

    // Convert new_string to use matching smart quotes
    if (hasSmartDoubleQuotes) adjustedNewString = convertToSmartDoubleQuotes(adjustedNewString);
    if (hasSmartSingleQuotes) adjustedNewString = convertToSmartSingleQuotes(adjustedNewString);

    return adjustedNewString;
}

// Mapping: hD6→adjustNewStringQuotes, A→originalOldString, q→matchedOldString,
//          K→newString, Vm3→convertToSmartDoubleQuotes, km3→convertToSmartSingleQuotes
```

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
