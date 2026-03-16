# Write Tool - Deep Analysis (Claude Code 2.1.76)

> Complete analysis of the Write file system tool: file creation, overwrite protection, encoding preservation, and LSP integration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `FileWriteTool` (xX) - Write tool definition object - chunks.139.mjs:45
- `TOOL_NAME_WRITE` (_K) - Tool name constant "Write" - chunks.56.mjs:1234
- `fileWriteInputSchema` (_LY) - Input schema definition - chunks.139.mjs
- `writeFileWithEncoding` (ft) - Encoding-aware file write - chunks.134.mjs
- `detectLineEnding` (Qd) - Line ending detection - chunks.134.mjs
- `detectEncoding` (AX) - Encoding detection - chunks.134.mjs
- `checkEditPermissions` (Xz6) - Permission checking - chunks.139.mjs
- `diagnosticsManager` (Fd) - LSP diagnostics manager - chunks.134.mjs
- `updateGitWatcherCache` (_t) - Git cache update - chunks.134.mjs
- `resolvePath` (L4) - Path resolution - chunks.10.mjs

---

## Architecture Overview

```
LLM generates Write tool_use { file_path, content }
         │
         ▼
 validateInput() - 4 checks
 ├── Permission deny rule check
 ├── Network path detection (UNC)
 ├── File existence check
 └── readFileState validation
     ├── Must have read file first
     └── Must have current timestamp
         │
         ▼
 call() execution
 ├── Skill dir trigger detection (TW1)
 ├── File watcher cache clear (EW1)
 ├── beforeFileEdited hook (Fd)
 ├── Read original content (if exists)
 ├── External modification check
 ├── File history save (if enabled)
 ├── Detect encoding + line endings
 ├── Create parent directory
 ├── Write file (ft)
 ├── Notify LSP server
 ├── Update git watcher cache
 ├── Update readFileState cache
 ├── CLAUDE.md telemetry
 └── Compute git diff (remote mode)
         │
         ▼
 Return { data: { type, filePath, content, structuredPatch, ... } }
         │
         ▼
 UI Rendering (diff view or content preview)
```

---

## 1. Tool Definition Object

### FileWriteTool - Main file writing tool

**What it does:** Provides the primary interface for writing files to the local filesystem, with overwrite protection, encoding preservation, and automatic LSP notification.

**How it works:**

```javascript
// ============================================
// FileWriteTool - Main file writing tool definition
// Location: chunks.139.mjs:45-145
// ============================================

// ORIGINAL (for source lookup):
xX = {
    name: _K,  // "Write"
    searchHint: "create or overwrite files",
    maxResultSizeChars: 1e5,
    strict: !0,
    input_examples: [{ file_path: "/Users/username/project/src/newFile.ts", content: "Hello, World!" }],
    async description() { return "Write a file to the local filesystem." },
    userFacingName: ga4,
    getToolUseSummary: em8,
    getActivityDescription(A) { let q = em8(A); return q ? `Writing ${q}` : "Writing file" },
    async prompt() { return bG7() },
    isEnabled() { return !0 },
    get inputSchema() { return _LY() },
    inputParamAliases: { filePath: "file_path", filepath: "file_path", path: "file_path" },
    get outputSchema() { return wLY() },
    isConcurrencySafe() { return !1 },  // File writes are NOT concurrency-safe
    isReadOnly() { return !1 },          // Mutates filesystem
    toAutoClassifierInput(A) { return `${A.file_path}: ${A.content}` },
    getPath(A) { return A.file_path },
    async checkPermissions(A, q) { let K = q.getAppState(); return Xz6(xX, A, K.toolPermissionContext) },
    renderToolUseRejectedMessage: pa4,
    renderToolUseErrorMessage: Qa4,
    renderToolUseProgressMessage: Ua4,
    renderToolResultMessage: da4,
    async validateInput({ file_path: A, content: q }, K) { ... }
}

// READABLE (for understanding):
const FileWriteTool = {
    name: "Write",
    searchHint: "create or overwrite files",
    maxResultSizeChars: 100000,
    strict: true,
    isConcurrencySafe: false,   // Only one Write per file at a time
    isReadOnly: false,           // Requires permission check

    inputParamAliases: {
        filePath: "file_path",
        filepath: "file_path",
        path: "file_path"
    },

    userFacingName(input) {
        // Show "Updated plan" for CLAUDE.md plan files
        if (input?.file_path?.startsWith(getPlanFilePrefix())) return "Updated plan";
        return "Write";
    },

    async validateInput({ file_path, content }, context) {
        let absolutePath = resolvePath(file_path);
        // Validation: permission deny, UNC path, file existence, readFileState
        // ...
    },

    async checkPermissions(input, context) {
        let appState = context.getAppState();
        return checkEditPermissions(FileWriteTool, input, appState.toolPermissionContext);
    }
}

// Mapping: xX→FileWriteTool, _K→TOOL_NAME_WRITE, _LY→fileWriteInputSchema,
//          wLY→fileWriteOutputSchema, Xz6→checkEditPermissions, ga4→getWriteUserFacingName,
//          em8→getWriteSummary, L4→resolvePath
```

---

## 2. Input Schema Definition

### fileWriteInputSchema (dBY) - Zod schema for Write tool

```javascript
// ============================================
// fileWriteInputSchema - Zod input schema
// Location: chunks.146.mjs:419
// ============================================

// ORIGINAL (for source lookup):
dBY = z7(() => u.strictObject({
    file_path: u.string().describe("The absolute path to the file to write (must be absolute, not relative)"),
    content: u.string().describe("The content to write to the file")
}))

// READABLE (for understanding):
const fileWriteInputSchema = z.strictObject({
    file_path: z.string()
        .describe("The absolute path to the file to write (must be absolute, not relative)"),
    content: z.string()
        .describe("The content to write to the file")
});

// Mapping: dBY→fileWriteInputSchema, z7→lazySchema, u→z
```

**Why strictObject with only two fields:**
- Simplicity: Write is a straightforward operation - path + content
- No line range parameters like Read (Write is always complete file)
- No encoding parameter - auto-detected from existing file or defaults to UTF-8

---

## 3. Output Schema Definition

### fileWriteOutputSchema (cBY) - Structured result

```javascript
// ============================================
// fileWriteOutputSchema - Zod output schema
// Location: chunks.146.mjs:422-436
// ============================================

// ORIGINAL (for source lookup):
cBY = z7(() => u.object({
    type: u.enum(["create", "update"]).describe("Whether a new file was created or an existing file was updated"),
    filePath: u.string().describe("The path to the file that was written"),
    content: u.string().describe("The content that was written to the file"),
    structuredPatch: u.array(xOA).describe("Diff patch showing the changes"),
    originalFile: u.string().nullable().describe("The original file content before the write (null for new files)"),
    gitDiff: u.object({
        filename: u.string(),
        status: u.enum(["modified", "added"]),
        additions: u.number(),
        deletions: u.number(),
        changes: u.number(),
        patch: u.string()
    }).optional()
}))

// READABLE (for understanding):
const fileWriteOutputSchema = z.object({
    type: z.enum(["create", "update"])
        .describe("Whether a new file was created or an existing file was updated"),
    filePath: z.string()
        .describe("The path to the file that was written"),
    content: z.string()
        .describe("The content that was written to the file"),
    structuredPatch: z.array(PatchHunk)
        .describe("Diff patch showing the changes"),
    originalFile: z.string().nullable()
        .describe("The original file content before the write (null for new files)"),
    gitDiff: z.object({
        filename: z.string(),
        status: z.enum(["modified", "added"]),
        additions: z.number(),
        deletions: z.number(),
        changes: z.number(),
        patch: z.string()
    }).optional()  // Only in remote mode
});

// Mapping: cBY→fileWriteOutputSchema, xOA→PatchHunkSchema
```

---

## 4. Input Validation Pipeline

### validateInput - 4 safety checks

```javascript
// ============================================
// validateInput - 4-step validation for Write
// Location: chunks.139.mjs:101-144
// ============================================

// ORIGINAL (for source lookup):
async validateInput({
    file_path: A,
    content: q
}, K) {
    let Y = L4(A),  // resolvePath
        z = cV1(Y, q);  // content validation
    if (z) return {
        result: !1,
        message: z,
        errorCode: 0
    };
    let _ = K.getAppState();
    if (ZX(Y, _.toolPermissionContext, "edit", "deny") !== null) return {
        result: !1,
        message: "File is in a directory that is denied by your permission settings.",
        errorCode: 1
    };
    if (Y.startsWith("\\\\") || Y.startsWith("//")) return {
        result: !0
    };
    let O = $1(),  // getFileSystem
        $;
    try {
        $ = (await O.stat(Y)).mtimeMs
    } catch (J) {
        if (J.code === "ENOENT") return {
            result: !0
        };  // New file creation allowed
        throw J
    }
    let H = K.readFileState.get(Y);
    if (!H || H.isPartialView) return {
        result: !1,
        message: "File has not been read yet. Read it first before writing to it.",
        errorCode: 2
    };
    if (Math.floor($) > H.timestamp) return {
        result: !1,
        message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
        errorCode: 3
    };
    return {
        result: !0
    }
}

// READABLE (for understanding):
async function validateInput({ file_path, content }, context) {
    let absolutePath = resolvePath(file_path);

    // [Check 0] Content validation (e.g., CLAUDE.md format)
    let contentError = validateFileContent(absolutePath, content);
    if (contentError) {
        return {
            result: false,
            message: contentError,
            errorCode: 0
        };
    }

    let appState = await context.getAppState();

    // [Check 1] Permission deny rule
    if (checkPathDenyRule(absolutePath, appState.toolPermissionContext, "edit", "deny")) {
        return {
            result: false,
            message: "File is in a directory that is denied by your permission settings.",
            errorCode: 1
        };
    }

    // [Check 2] Network/UNC paths - allow without further checks
    if (absolutePath.startsWith("\\\\") || absolutePath.startsWith("//")) {
        return { result: true };
    }

    // [Check 3] New file creation - allow without readFileState check
    let fs = getFileSystem();
    let mtime;
    try {
        mtime = (await fs.stat(absolutePath)).mtimeMs;
    } catch (err) {
        if (err.code === "ENOENT") {
            return { result: true };  // New file - no read required
        }
        throw err;
    }

    // [Check 4] Existing file - must have been read first
    let fileState = context.readFileState.get(absolutePath);
    if (!fileState || fileState.isPartialView) {
        return {
            result: false,
            message: "File has not been read yet. Read it first before writing to it.",
            errorCode: 2
        };
    }

    // [Check 5] External modification detection
    if (Math.floor(mtime) > fileState.timestamp) {
        return {
            result: false,
            message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
            errorCode: 3
        };
    }

    return { result: true };
}

// Mapping: A→file_path, q→content, K→context, Y→absolutePath, z→contentError,
//          L4→resolvePath, cV1→validateFileContent, ZX→checkPathDenyRule,
//          $1→getFileSystem, H→fileState
```

---

## 5. Execution Method

### call - Complete write operation with all side effects

```javascript
// ============================================
// call - Execute file write operation
// Location: chunks.146.mjs:516-624
// ============================================

// ORIGINAL (for source lookup):
async call({ file_path: A, content: q }, {
    readFileState: K,
    updateFileHistoryState: Y,
    dynamicSkillDirTriggers: z
}, w, H) {
    let $ = g4(A),
        O = gBY($),  // getParentDirectory
        _ = b1(),    // getFileSystem
        J = h6(),    // getCwd
        X = TW1([$], J);  // findSkillDirTriggers
    if (X.length > 0) {
        for (let Z of X) z?.add(Z);
        vW1(X).catch(() => {})  // refreshSkillDirs
    }
    EW1([$], J), await Fd.beforeFileEdited($);  // clearFileWatcherCache, diagnosticsManager
    let D = _.existsSync($);
    if (D) {
        let Z = aW($), N = K.get($);
        if (!N || Z > N.timestamp)
            if (N && N.offset === void 0 && N.limit === void 0) {
                let k = AX($);
                if (_.readFileSync($, { encoding: k }).replaceAll(`\r\n`, `\n`) !== N.content)
                    throw Error(ty1)  // CONCURRENT_EDIT_ERROR_MESSAGE
            } else throw Error(ty1)
    }
    let j = D ? AX($) : "utf-8",
        M = D ? _.readFileSync($, { encoding: j }) : null;
    if (z2()) await Xt(Y, $, H.uuid);  // isFileHistoryEnabled, saveFileHistoryEntry
    let P = D ? Qd($) : await $a4();  // detectLineEnding or getDefaultLineEnding
    _.mkdirSync(O), ft($, q, j, P);  // mkdir, writeFileWithEncoding
    let W = md();  // getLspManager
    if (W) NP6(`file://${$}`), W.changeFile($, q).catch(...), W.saveFile($).catch(...);
    _t($, M, q);  // updateGitWatcherCache
    K.set($, { content: q, timestamp: aW($), offset: void 0, limit: void 0 });
    if ($.endsWith(`${UBY}CLAUDE.md`)) c("tengu_write_claudemd", {});  // telemetry
    // ... git diff and return
}

// READABLE (for understanding):
async function call({ file_path, content }, context, toolContext, invocationContext) {
    let absolutePath = resolvePath(file_path);
    let parentDir = getParentDirectory(absolutePath);
    let fs = getFileSystem();
    let cwd = getCwd();

    // === Step 1: Skill directory triggers ===
    let skillDirs = findSkillDirTriggers([absolutePath], cwd);
    if (skillDirs.length > 0) {
        for (let dir of skillDirs) context.dynamicSkillDirTriggers?.add(dir);
        refreshSkillDirs(skillDirs).catch(() => {});
    }

    // === Step 2: Clear file watcher cache ===
    clearFileWatcherCache([absolutePath], cwd);

    // === Step 3: Pre-edit LSP hook ===
    await diagnosticsManager.beforeFileEdited(absolutePath);

    // === Step 4: Read original content if file exists ===
    let fileExists = fs.existsSync(absolutePath);
    if (fileExists) {
        // Double-check external modification
        let modTime = getModificationTime(absolutePath);
        let fileState = context.readFileState.get(absolutePath);
        if (!fileState || modTime > fileState.timestamp) {
            if (fileState && fileState.offset === undefined && fileState.limit === undefined) {
                // Content comparison for mtime-only changes
                let currentContent = fs.readFileSync(absolutePath, { encoding: detectEncoding(absolutePath) });
                if (currentContent.replaceAll('\r\n', '\n') !== fileState.content) {
                    throw Error(CONCURRENT_EDIT_ERROR_MESSAGE);
                }
            } else {
                throw Error(CONCURRENT_EDIT_ERROR_MESSAGE);
            }
        }
    }

    // === Step 5: Detect encoding and line endings ===
    let encoding = fileExists ? detectEncoding(absolutePath) : "utf-8";
    let originalContent = fileExists ? fs.readFileSync(absolutePath, { encoding }) : null;

    // === Step 6: Save file history (undo support) ===
    if (isFileHistoryEnabled()) {
        await saveFileHistoryEntry(context.updateFileHistoryState, absolutePath, invocationContext.uuid);
    }

    // === Step 7: Detect line ending (preserve original or use default) ===
    let lineEnding = fileExists ? detectLineEnding(absolutePath) : await getDefaultLineEnding();

    // === Step 8: Create parent directory if needed ===
    fs.mkdirSync(parentDir, { recursive: true });

    // === Step 9: Write file ===
    writeFileWithEncoding(absolutePath, content, encoding, lineEnding);

    // === Step 10: Notify LSP server ===
    let lspManager = getLspManager();
    if (lspManager) {
        clearDeliveredDiagnosticsForUri(`file://${absolutePath}`);
        lspManager.changeFile(absolutePath, content).catch(logLspError);
        lspManager.saveFile(absolutePath, content).catch(logLspError);
    }

    // === Step 11: Update git watcher cache ===
    updateGitWatcherCache(absolutePath, originalContent, content);

    // === Step 12: Update readFileState cache ===
    context.readFileState.set(absolutePath, {
        content: content,
        timestamp: getModificationTime(absolutePath),
        offset: undefined,
        limit: undefined
    });

    // === Step 13: CLAUDE.md telemetry ===
    if (absolutePath.endsWith(`${PATH_SEP}CLAUDE.md`)) {
        telemetry("tengu_write_claudemd", {});
    }

    // === Step 14: Return result ===
    if (originalContent) {
        // Update existing file
        let patch = generateUnifiedDiff(originalContent, content);
        return {
            data: {
                type: "update",
                filePath: file_path,
                content: content,
                structuredPatch: patch,
                originalFile: originalContent
            }
        };
    } else {
        // Create new file
        return {
            data: {
                type: "create",
                filePath: file_path,
                content: content,
                structuredPatch: [],
                originalFile: null
            }
        };
    }
}

// Mapping: A→file_path, q→content, K→readFileState, Y→updateFileHistoryState,
//          z→dynamicSkillDirTriggers, w→toolContext, H→invocationContext,
//          $→absolutePath, O→parentDir, _→fs, J→cwd, D→fileExists,
//          j→encoding, M→originalContent, P→lineEnding, ft→writeFileWithEncoding,
//          Fd→diagnosticsManager, _t→updateGitWatcherCache
```

---

## 6. Encoding and Line Ending Preservation

### Why This Matters

**Problem:** If a file was originally written with CRLF line endings (Windows) and the Write tool uses LF (Unix), the entire file shows as changed in git diff even if content is identical.

**Solution:** Detect and preserve the original line ending style.

```javascript
// ============================================
// detectLineEnding - CRLF/LF detection
// Location: chunks.134.mjs
// ============================================

// READABLE (for understanding):
function detectLineEnding(filePath) {
    let content = fs.readFileSync(filePath, { encoding: 'utf-8' });

    // Check for CRLF first (Windows)
    if (content.includes('\r\n')) {
        return 'CRLF';
    }

    // Check for CR only (old Mac)
    if (content.includes('\r') && !content.includes('\n')) {
        return 'CR';
    }

    // Default to LF (Unix)
    return 'LF';
}

// ============================================
// writeFileWithEncoding - Encoding-aware write
// Location: chunks.134.mjs
// ============================================

// READABLE (for understanding):
function writeFileWithEncoding(filePath, content, encoding, lineEnding) {
    // Apply line ending conversion
    let normalizedContent = content;
    if (lineEnding === 'CRLF') {
        normalizedContent = content.replace(/\r?\n/g, '\r\n');
    } else if (lineEnding === 'CR') {
        normalizedContent = content.replace(/\r?\n/g, '\r');
    }
    // LF is default, no conversion needed

    // Write with detected encoding
    if (encoding === 'utf-8') {
        fs.writeFileSync(filePath, normalizedContent, { encoding: 'utf-8' });
    } else if (encoding === 'utf-16le' || encoding === 'utf-16be') {
        // Handle UTF-16 with BOM
        let bom = encoding === 'utf-16le' ? '\uFEFF' : '\uFFFE';
        fs.writeFileSync(filePath, bom + normalizedContent, { encoding: 'utf-16le' });
    } else {
        // Fallback for other encodings (Latin-1, etc.)
        fs.writeFileSync(filePath, normalizedContent, { encoding: encoding || 'utf-8' });
    }
}

// Mapping: ft→writeFileWithEncoding, Qd→detectLineEnding, AX→detectEncoding
```

---

## 7. LSP Integration

### Automatic LSP Notification

**What it does:** After writing a file, the Write tool notifies the Language Server Protocol server about the change, enabling real-time diagnostics.

```javascript
// ============================================
// LSP Notification Flow
// Location: chunks.146.mjs:556-560
// ============================================

// READABLE (for understanding):
async function notifyLspServer(absolutePath, content) {
    let lspManager = getLspManager();  // md()
    if (!lspManager) return;

    // Clear cached diagnostics for this file
    clearDeliveredDiagnosticsForUri(`file://${absolutePath}`);  // NP6

    // Notify LSP of file change
    await lspManager.changeFile(absolutePath, content).catch(logLspError);

    // Notify LSP of file save (triggers diagnostics refresh)
    await lspManager.saveFile(absolutePath).catch(logLspError);
}

// The beforeFileEdited hook captures pre-edit diagnostics
// The post-save change triggers new diagnostics calculation
// The diff between pre and post shows errors introduced by the edit
```

---

## 8. UI Rendering

### renderToolResultMessage - Display based on operation type

```javascript
// ============================================
// renderToolResultMessage (za4) - Result display
// Location: chunks.146.mjs:315-359
// ============================================

// ORIGINAL (for source lookup):
function za4({ filePath: A, content: q, structuredPatch: K, type: Y, originalFile: z }, w, { style: H, verbose: $ }) {
    switch (Y) {
        case "create": {
            if (A.startsWith(UM()) && !$) {
                if (H !== "condensed") return sK.createElement(HA, null, sK.createElement(V, { dimColor: !0 }, "/plan to preview"))
            } else if (H === "condensed" && !$) {
                let _ = q.split(so4).length;
                return sK.createElement(V, null, "Wrote ", sK.createElement(V, { bold: !0 }, _), " lines to", " ", sK.createElement(V, { bold: !0 }, to4(h6(), A)))
            }
            return sK.createElement(QBY, { filePath: A, content: q, verbose: $ })
        }
        case "update": {
            let O = A.startsWith(UM());
            return sK.createElement(SP6, {
                filePath: A, structuredPatch: K, firstLine: q.split(`\n`)[0] ?? null,
                fileContent: z ?? void 0, style: H, verbose: $,
                previewHint: O ? "/plan to preview" : void 0
            })
        }
    }
}

// READABLE (for understanding):
function renderWriteResult({ filePath, content, structuredPatch, type, originalFile }, unused, { style, verbose }) {
    switch (type) {
        case "create": {
            // Plan file (CLAUDE.md) - show special hint
            if (filePath.startsWith(getPlanFilePrefix()) && !verbose) {
                if (style !== "condensed") {
                    return <Box><Text dimColor>/plan to preview</Text></Box>;
                }
            }

            // Condensed mode - show line count summary
            if (style === "condensed" && !verbose) {
                let lineCount = content.split('\n').length;
                return <Text>Wrote <Text bold>{lineCount}</Text> lines to <Text bold>{relativePath}</Text></Text>;
            }

            // Full display - show content preview
            return <WriteResultDisplay filePath={filePath} content={content} verbose={verbose} />;
        }

        case "update": {
            // Show diff viewer for updates
            let isPlanFile = filePath.startsWith(getPlanFilePrefix());
            return <DiffViewer
                filePath={filePath}
                structuredPatch={structuredPatch}
                firstLine={content.split('\n')[0]}
                fileContent={originalFile}
                style={style}
                verbose={verbose}
                previewHint={isPlanFile ? "/plan to preview" : undefined}
            />;
        }
    }
}

// Mapping: za4→renderWriteResult, A→filePath, q→content, K→structuredPatch,
//          Y→type, z→originalFile, H→style, $→verbose,
//          UM→getPlanFilePrefix, SP6→DiffViewer, QBY→WriteResultDisplay
```

---

## 9. Complete Execution Timeline

```
T+0ms  LLM produces tool_use { type: "Write", file_path: "/path/to/file.ts", content: "..." }
T+0ms  validateInput() begins
T+1ms  resolvePath() converts to absolute
T+1ms  Permission deny rule check
T+1ms  [New file] Skip readFileState check
       [Existing file] Check readFileState + timestamp
T+2ms  validateInput() returns { result: true }
T+2ms  Permission check (user prompted for non-auto-allow)
T+?ms  User approves
T+?ms  call() begins
T+?ms  Skill directory trigger detection
T+?ms  File watcher cache clear
T+?ms  beforeFileEdited LSP hook
T+?ms  Read original content (if exists)
T+?ms  External modification double-check
T+?ms  File history save (if enabled)
T+?ms  Encoding + line ending detection
T+?ms  Parent directory creation
T+?ms  File write
T+?ms  LSP notification
T+?ms  Git watcher cache update
T+?ms  readFileState cache update
T+?ms  CLAUDE.md telemetry (if applicable)
T+?ms  Result { type, filePath, content, structuredPatch } returned
T+?ms  UI renders diff (update) or content preview (create)
```

---

## 10. Key Security Properties

| Property | Implementation | Why |
|----------|---------------|-----|
| Must read before write | `readFileState` check | Prevents blind overwrites |
| External modification detection | `timestamp` + content comparison | Catches race conditions |
| Permission checking | `checkEditPermissions` | Respects user-defined boundaries |
| Path traversal prevention | `resolvePath()` normalization | Blocks `..` attacks |
| Encoding preservation | `detectEncoding` + `writeFileWithEncoding` | Prevents file corruption |
| Line ending preservation | `detectLineEnding` | Prevents spurious git diffs |
| Parent directory creation | `mkdirSync({ recursive: true })` | Handles new nested files |
| LSP integration | `changeFile` + `saveFile` notifications | Enables real-time diagnostics |
| File history | Optional undo support | Enables recovery from mistakes |