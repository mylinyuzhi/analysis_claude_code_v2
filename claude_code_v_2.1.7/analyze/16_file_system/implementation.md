# File System Operations

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

## Overview

Claude Code implements a sophisticated file system abstraction layer that provides:
1. **Read-before-edit enforcement** - Prevents editing files that haven't been read
2. **File state tracking** - Maintains `readFileState` Map to track file reads
3. **File watching** - Monitors settings files for changes via Chokidar
4. **Line ending normalization** - Handles CRLF/LF conversions
5. **Encoding detection** - Auto-detects UTF-16LE vs UTF-8

---

## 1. File System Abstraction Layer (vA/NT9)

### Design Rationale

**Why this approach:**
The file system layer wraps Node.js fs module to provide:
1. **Unified monitoring** - All file operations logged via MW wrapper
2. **Consistent error handling** - Standardized error propagation
3. **Testability** - Can be mocked for testing
4. **Cross-platform safety** - Handles path separators and encodings

### Core Implementation

```javascript
// ============================================
// FileSystemWrapper - File system abstraction layer
// Location: chunks.1.mjs:2929-3040
// ============================================

// ORIGINAL (for source lookup):
DQ = w(() => {
  T1();
  A0();
  C0();
  NT9 = {
    cwd() { return process.cwd() },
    existsSync(A) { return MW(`existsSync(${A})`, () => $6.existsSync(A)) },
    async stat(A) { return CT9(A) },
    statSync(A) { return MW(`statSync(${A})`, () => $6.statSync(A)) },
    lstatSync(A) { return MW(`lstatSync(${A})`, () => $6.lstatSync(A)) },
    readFileSync(A, Q) {
      return MW(`readFileSync(${A})`, () => $6.readFileSync(A, { encoding: Q.encoding }))
    },
    readFileBytesSync(A) {
      return MW(`readFileBytesSync(${A})`, () => $6.readFileSync(A))
    },
    readSync(A, Q) {
      return MW(`readSync(${A}, ${Q.length} bytes)`, () => {
        let B = void 0;
        try {
          B = $6.openSync(A, "r");
          let G = Buffer.alloc(Q.length),
            Z = $6.readSync(B, G, 0, Q.length, 0);
          return { buffer: G, bytesRead: Z }
        } finally {
          if (B) $6.closeSync(B)
        }
      })
    },
    appendFileSync(A, Q, B) { ... },
    copyFileSync(A, Q) { ... },
    unlinkSync(A) { ... },
    renameSync(A, Q) { ... },
    linkSync(A, Q) { ... },
    symlinkSync(A, Q) { ... },
    readlinkSync(A) { ... },
    realpathSync(A) { ... },
    mkdirSync(A, Q) {
      return MW(`mkdirSync(${A})`, () => {
        if (!$6.existsSync(A)) {
          let B = { recursive: !0 };
          if (Q?.mode !== void 0) B.mode = Q.mode;
          $6.mkdirSync(A, B)
        }
      })
    },
    readdirSync(A) {
      return MW(`readdirSync(${A})`, () => $6.readdirSync(A, { withFileTypes: !0 }))
    },
    readdirStringSync(A) { ... },
    isDirEmptySync(A) { ... },
    rmdirSync(A) { ... },
    rmSync(A, Q) { ... },
    createWriteStream(A) { return $6.createWriteStream(A) }
  }, wT9 = NT9
})

// READABLE (for understanding):
initFileSystem = createLazyModule(() => {
  initDependencies();
  FileSystemWrapper = {
    cwd() { return process.cwd() },
    existsSync(path) {
      return monitoringWrapper(`existsSync(${path})`, () => fs.existsSync(path))
    },
    async stat(path) { return getFileStat(path) },
    statSync(path) {
      return monitoringWrapper(`statSync(${path})`, () => fs.statSync(path))
    },
    lstatSync(path) {
      return monitoringWrapper(`lstatSync(${path})`, () => fs.lstatSync(path))
    },
    readFileSync(path, options) {
      return monitoringWrapper(`readFileSync(${path})`, () =>
        fs.readFileSync(path, { encoding: options.encoding }))
    },
    readFileBytesSync(path) {
      return monitoringWrapper(`readFileBytesSync(${path})`, () => fs.readFileSync(path))
    },
    readSync(path, options) {
      return monitoringWrapper(`readSync(${path}, ${options.length} bytes)`, () => {
        let fd = undefined;
        try {
          fd = fs.openSync(path, "r");
          let buffer = Buffer.alloc(options.length),
              bytesRead = fs.readSync(fd, buffer, 0, options.length, 0);
          return { buffer, bytesRead }
        } finally {
          if (fd) fs.closeSync(fd)
        }
      })
    },
    mkdirSync(path, options) {
      return monitoringWrapper(`mkdirSync(${path})`, () => {
        if (!fs.existsSync(path)) {
          let mkdirOptions = { recursive: true };
          if (options?.mode !== undefined) mkdirOptions.mode = options.mode;
          fs.mkdirSync(path, mkdirOptions)
        }
      })
    },
    readdirSync(path) {
      return monitoringWrapper(`readdirSync(${path})`, () =>
        fs.readdirSync(path, { withFileTypes: true }))
    },
    // ... remaining methods
  }
  cachedFileSystem = FileSystemWrapper
})

// Mapping: DQ→initFileSystem, NT9→FileSystemWrapper, MW→monitoringWrapper,
// $6→fs (Node.js fs module), A→path, Q→options, B→fd/mode
```

### Wrapped Methods Table

| Method | Purpose | Monitoring |
|--------|---------|------------|
| `existsSync` | Check file existence | Yes |
| `statSync` | Get file metadata | Yes |
| `lstatSync` | Get symlink metadata | Yes |
| `readFileSync` | Read file with encoding | Yes |
| `readFileBytesSync` | Read raw bytes | Yes |
| `readSync` | Partial read with buffer | Yes |
| `appendFileSync` | Append to file | Yes |
| `copyFileSync` | Copy file | Yes |
| `unlinkSync` | Delete file | Yes |
| `renameSync` | Move/rename file | Yes |
| `linkSync` | Create hard link | Yes |
| `symlinkSync` | Create symbolic link | Yes |
| `readlinkSync` | Read symlink target | Yes |
| `realpathSync` | Resolve real path | Yes |
| `mkdirSync` | Create directory (recursive) | Yes |
| `readdirSync` | List directory (with types) | Yes |
| `rmdirSync` | Remove directory | Yes |
| `rmSync` | Remove recursively | Yes |
| `createWriteStream` | Create write stream | No |

---

## 2. readFileState Data Structure

### Structure Definition

```typescript
interface FileReadRecord {
  content: string;      // File content (text or base64)
  timestamp: number;    // File modification time at read (mtimeMs)
  offset?: number;      // Line offset if partial read (1-based)
  limit?: number;       // Line limit if partial read
}

// Session context maintains:
readFileState: Map<string, FileReadRecord>
```

### Offset/Limit Semantics

**Key insight:** The meaning of `offset` and `limit` values:

| offset | limit | Meaning |
|--------|-------|---------|
| `undefined` | `undefined` | Full file content is known |
| `number` | `undefined` | Partial read from offset to end |
| `number` | `number` | Partial read with limit |

**Why this matters:**
- When `offset` and `limit` are `undefined`, content comparison is reliable
- When defined, only timestamp comparison is used (content may be incomplete)

### State Recording

```javascript
// ============================================
// recordFileRead - Updates readFileState after successful read
// Location: chunks.86.mjs:764-768
// ============================================

// ORIGINAL (for source lookup):
Z.set(D, {
  content: K,
  timestamp: mz(D),
  offset: Q,
  limit: B
})

// READABLE (for understanding):
readFileState.set(resolvedPath, {
  content: fileContent,
  timestamp: getFileModifiedTime(resolvedPath),
  offset: startOffset,
  limit: lineLimit
})

// Mapping: Z→readFileState, D→resolvedPath, K→fileContent,
// mz→getFileModifiedTime, Q→startOffset, B→lineLimit
```

---

## 3. Read-Before-Edit Enforcement

### Design Rationale

**Why this approach:**
Claude Code enforces a "read before edit" pattern to prevent:
1. Editing files that the model hasn't seen (could cause unintended changes)
2. Editing files that have been modified externally since reading (race conditions)
3. Allowing the model to make edits based on stale content

**Trade-offs:**
- Extra latency: Requires explicit read before any edit
- Memory usage: Stores file content in `readFileState` Map
- Benefit: Data integrity and predictable behavior

### Edit Tool Validation

```javascript
// ============================================
// validateEditInput - Edit Tool Pre-Validation
// Location: chunks.115.mjs:850-941
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ file_path: A, old_string: Q, new_string: B, replace_all: G }, Z) {
  let Y = Y4(A), { readFileState: I } = Z, D = vA();

  // Skip validation for new files with empty old_string
  if (!D.existsSync(Y) && Q === "") return { result: !0 };

  // File doesn't exist
  if (!D.existsSync(Y)) {
    let H = C71(Y), E = "File does not exist.", z = o1(), $ = EQ();
    if (z !== $) E += ` Current working directory: ${z}`;
    if (H) E += ` Did you mean ${H}?`;
    return { result: !1, behavior: "ask", message: E, errorCode: 4 }
  }

  // Jupyter notebook redirect
  if (Y.endsWith(".ipynb")) return {
    result: !1, behavior: "ask",
    message: `File is a Jupyter Notebook. Use the ${tq} to edit this file.`,
    errorCode: 5
  };

  // File not read yet
  let D = I.readFileState.get(Y);
  if (!D) return {
    result: !1, behavior: "ask",
    message: "File has not been read yet. Read it first before writing to it.",
    meta: { isFilePathAbsolute: String(a$0(A)) },
    errorCode: 6
  };

  // File modified since read - enhanced check in v2.1.7
  if (D) {
    if (mz(Y) > D.timestamp)
      if (D.offset === void 0 && D.limit === void 0)
        // Full file was read - compare content even if timestamp differs
        if (I.readFileSync(Y, { encoding: RW(Y) })
            .replaceAll(`\r\n`, `\n`) === D.content);
        else return {
          result: !1, behavior: "ask",
          message: "File has been modified since read...",
          errorCode: 7
        };
      else return {
        result: !1, behavior: "ask",
        message: "File has been modified since read...",
        errorCode: 7
      }
  }

  // String matching and validation continues...
}

// READABLE (for understanding):
async validateEditInput({ file_path, old_string, new_string, replace_all }, sessionContext) {
  let resolvedPath = resolvePath(file_path);
  let { readFileState } = sessionContext;
  let fs = getFileSystem();

  // Allow creating new files with empty old_string
  if (!fs.existsSync(resolvedPath) && old_string === "") {
    return { result: true };
  }

  // File doesn't exist
  if (!fs.existsSync(resolvedPath)) {
    let suggestion = findSimilarFileName(resolvedPath);
    let message = "File does not exist.";
    let cwd = getCurrentWorkingDirectory();
    let projectRoot = getProjectRoot();
    if (cwd !== projectRoot) message += ` Current working directory: ${cwd}`;
    if (suggestion) message += ` Did you mean ${suggestion}?`;
    return { result: false, behavior: "ask", message, errorCode: 4 };
  }

  // Jupyter notebook - redirect to NotebookEdit
  if (resolvedPath.endsWith(".ipynb")) {
    return {
      result: false,
      behavior: "ask",
      message: `File is a Jupyter Notebook. Use the NotebookEdit to edit this file.`,
      errorCode: 5
    };
  }

  // Check if file has been read
  let fileReadRecord = readFileState.get(resolvedPath);
  if (!fileReadRecord) {
    return {
      result: false,
      behavior: "ask",
      message: "File has not been read yet. Read it first before writing to it.",
      meta: { isFilePathAbsolute: String(isAbsolutePath(file_path)) },
      errorCode: 6
    };
  }

  // Check if file modified since read
  if (fileReadRecord) {
    let currentTimestamp = getFileModifiedTime(resolvedPath);
    if (currentTimestamp > fileReadRecord.timestamp) {
      // Enhanced v2.1.7: For full reads, compare content even if timestamp differs
      if (fileReadRecord.offset === undefined && fileReadRecord.limit === undefined) {
        let currentContent = fs.readFileSync(resolvedPath, { encoding: detectEncoding(resolvedPath) })
            .replaceAll('\r\n', '\n');
        if (currentContent === fileReadRecord.content) {
          // Content unchanged - allow edit despite timestamp change
        } else {
          return {
            result: false,
            behavior: "ask",
            message: "File has been modified since read...",
            errorCode: 7
          };
        }
      } else {
        // Partial read - can't compare content
        return {
          result: false,
          behavior: "ask",
          message: "File has been modified since read...",
          errorCode: 7
        };
      }
    }
  }

  // Continue with string matching...
}

// Mapping: A→file_path, Q→old_string, B→new_string, G→replace_all,
// Y→resolvedPath, I→sessionContext, D→fs/fileReadRecord,
// mz→getFileModifiedTime, C71→findSimilarFileName, tq→NotebookEditTool
```

### Write Tool Validation

```javascript
// ============================================
// validateWriteInput - Write Tool Pre-Validation
// Location: chunks.115.mjs:1308-1336
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ file_path: A }, Q) {
  let B = Y4(A), G = await Q.getAppState();
  if (AE(B, G.toolPermissionContext, "edit", "deny") !== null) return {
    result: !1,
    message: "File is in a directory that is denied by your permission settings.",
    errorCode: 1
  };
  if (!vA().existsSync(B)) return { result: !0 };
  let J = Q.readFileState.get(B);
  if (!J) return {
    result: !1,
    message: "File has not been read yet. Read it first before writing to it.",
    errorCode: 2
  };
  if (J) {
    if (mz(B) > J.timestamp) return {
      result: !1,
      message: "File has been modified since read...",
      errorCode: 3
    }
  }
  return { result: !0 }
}

// READABLE (for understanding):
async validateWriteInput({ file_path }, sessionContext) {
  let resolvedPath = resolvePath(file_path);
  let appState = await sessionContext.getAppState();

  // Permission check
  if (matchPathRule(resolvedPath, appState.toolPermissionContext, "edit", "deny") !== null) {
    return {
      result: false,
      message: "File is in a directory that is denied by your permission settings.",
      errorCode: 1
    };
  }

  // New file - no validation needed
  if (!getFileSystem().existsSync(resolvedPath)) {
    return { result: true };
  }

  // Check if file has been read
  let fileReadRecord = sessionContext.readFileState.get(resolvedPath);
  if (!fileReadRecord) {
    return {
      result: false,
      message: "File has not been read yet. Read it first before writing to it.",
      errorCode: 2
    };
  }

  // Check if file modified since read
  if (fileReadRecord) {
    if (getFileModifiedTime(resolvedPath) > fileReadRecord.timestamp) {
      return {
        result: false,
        message: "File has been modified since read...",
        errorCode: 3
      };
    }
  }

  return { result: true };
}

// Mapping: A→file_path, Q→sessionContext, B→resolvedPath,
// G→appState, J→fileReadRecord, AE→matchPathRule, mz→getFileModifiedTime
```

### Error Code Reference

| Code | Tool | Condition | Message |
|------|------|-----------|---------|
| 1 | Write | Permission denied | "File is in a directory that is denied..." |
| 2 | Write | File not read | "File has not been read yet" |
| 3 | Write | File modified | "File has been modified since read" |
| 4 | Edit | File doesn't exist | "File does not exist" |
| 5 | Edit | Jupyter notebook | "Use NotebookEdit to edit this file" |
| 6 | Edit | File not read | "File has not been read yet" |
| 7 | Edit | File modified | "File has been modified since read" |
| 8 | Edit | String not found | "String to replace not found in file" |
| 9 | Edit | Multiple matches | "Found N matches...set replace_all to true" |
| 10 | Edit | Invalid settings.json | "Settings edit would produce invalid JSON" |

---

## 4. Read Tool Implementation

### Tool Definition

```javascript
// ============================================
// FileReadTool - Read file content
// Location: chunks.86.mjs:671-795
// ============================================

// READABLE pseudocode:
async call({ file_path, offset = 1, limit = undefined }, sessionContext) {
  let { readFileState, fileReadingLimits } = sessionContext;
  let maxSizeBytes = MAX_FILE_SIZE_BYTES;
  let maxTokens = fileReadingLimits?.maxTokens ?? getMaxTokens();
  let extension = path.extname(file_path).toLowerCase().slice(1);
  let resolvedPath = resolvePath(file_path);

  // Handle Jupyter notebooks
  if (extension === "ipynb") {
    let cells = parseNotebookCells(resolvedPath);
    let content = serializeCells(cells);
    // Check size limits
    if (content.length > maxSizeBytes) throw Error("Notebook too large");
    await validateTokens(content, extension, { maxSizeBytes, maxTokens });
    // Record in readFileState
    readFileState.set(resolvedPath, {
      content,
      timestamp: getFileModifiedTime(resolvedPath),
      offset,
      limit
    });
    return { data: { type: "notebook", file: { filePath: file_path, cells } } };
  }

  // Handle images
  if (IMAGE_EXTENSIONS.has(extension)) {
    let imageResult = await readImageFile(resolvedPath, maxTokens, extension);
    sessionContext.nestedMemoryAttachmentTriggers?.add(resolvedPath);
    logOperation({ operation: "read", tool: "FileReadTool", filePath: resolvedPath });
    return { data: imageResult };
  }

  // Handle PDFs
  if (isPDFEnabled() && isPDFExtension(extension)) {
    let pdfResult = await readPDFFile(resolvedPath);
    return { data: pdfResult };
  }

  // Handle text files
  let startLine = offset === 0 ? 0 : offset - 1;  // Convert to 0-based
  let { content, lineCount, totalLines } = readTextFileWithLineNumbers(resolvedPath, startLine, limit);

  if (content.length > maxSizeBytes) throw Error("File too large");
  await validateTokens(content, extension, { maxSizeBytes, maxTokens });

  // Record in readFileState
  readFileState.set(resolvedPath, {
    content,
    timestamp: getFileModifiedTime(resolvedPath),
    offset,
    limit
  });

  // Notify listeners
  sessionContext.nestedMemoryAttachmentTriggers?.add(resolvedPath);
  for (let listener of fileReadListeners) listener(resolvedPath, content);

  return {
    data: {
      type: "text",
      file: { filePath: file_path, content, numLines: lineCount, startLine: offset, totalLines }
    }
  };
}

// Mapping: gA2→parseNotebookCells, KY0→readImageFile, TEB→readPDFFile,
// L12→readTextFileWithLineNumbers, E71→IMAGE_EXTENSIONS, mz→getFileModifiedTime,
// $b→logOperation
```

---

## 5. Edit Tool Implementation

### String Matching Algorithm

```javascript
// ============================================
// fuzzyStringMatch - Match string with quote normalization
// Location: chunks.115.mjs:909
// ============================================

// ORIGINAL (for source lookup):
let K = k6A(W, Q);
if (!K) return {
  result: !1,
  behavior: "ask",
  message: `String to replace not found in file.\nString: ${Q}`,
  errorCode: 8
};

// READABLE (for understanding):
let matchedString = fuzzyStringMatch(fileContent, searchString);
if (!matchedString) {
  return {
    result: false,
    behavior: "ask",
    message: `String to replace not found in file.\nString: ${searchString}`,
    errorCode: 8
  };
}

// Mapping: k6A→fuzzyStringMatch, W→fileContent, Q→searchString, K→matchedString
```

**How fuzzy matching works:**
1. First try exact match
2. If not found, normalize quotes (smart quotes → straight quotes)
3. Return the matched string from file (preserves original formatting)

### Execution Flow

```javascript
// ============================================
// EditTool.call - Execute file edit
// Location: chunks.115.mjs:960-1024
// ============================================

// READABLE pseudocode:
async call({ file_path, old_string, new_string, replace_all }, sessionContext, options, meta) {
  let resolvedPath = resolvePath(file_path);
  let { readFileState, updateFileHistoryState } = sessionContext;
  let fs = getFileSystem();

  // 1. Read current file content
  let encoding = detectEncoding(resolvedPath);
  let originalContent = fs.readFileSync(resolvedPath, { encoding })
      .replaceAll('\r\n', '\n');

  // 2. Trigger beforeFileEdited hook (gets LSP diagnostics baseline)
  await hooks.beforeFileEdited(resolvedPath);

  // 3. Save to file history if enabled
  if (isFileHistoryEnabled()) {
    await saveToFileHistory(updateFileHistoryState, resolvedPath, meta.uuid);
  }

  // 4. Apply fuzzy match and replacement
  let matchedString = fuzzyStringMatch(originalContent, old_string) || old_string;
  let { patch, updatedFile } = createPatchedContent({
    filePath: resolvedPath,
    fileContents: originalContent,
    oldString: matchedString,
    newString: new_string,
    replaceAll: replace_all
  });

  // 5. Write file with encoding/EOL preservation
  let parentDir = getParentDirectory(resolvedPath);
  fs.mkdirSync(parentDir);
  let lineEnding = fs.existsSync(resolvedPath) ? detectLineEnding(resolvedPath) : "LF";
  let fileEncoding = fs.existsSync(resolvedPath) ? detectEncoding(resolvedPath) : "utf8";
  writeFileWithLineEndings(resolvedPath, updatedFile, fileEncoding, lineEnding);

  // 6. Notify LSP server
  let lspClient = getLSPClient();
  if (lspClient) {
    notifyIDE(`file://${resolvedPath}`);
    lspClient.changeFile(resolvedPath, updatedFile);
    lspClient.saveFile(resolvedPath);
  }

  // 7. Post-edit hooks
  postEditHook(resolvedPath, originalContent, updatedFile);

  // 8. Update readFileState
  readFileState.set(resolvedPath, {
    content: updatedFile,
    timestamp: getFileModifiedTime(resolvedPath),
    offset: undefined,
    limit: undefined
  });

  // 9. Log telemetry for CLAUDE.md
  if (resolvedPath.endsWith(`${pathSep}CLAUDE.md`)) {
    logEvent("tengu_write_claudemd", {});
  }

  // 10. Return structured patch
  logOperation({ operation: "edit", tool: "FileEditTool", filePath: resolvedPath });
  return {
    data: {
      filePath: file_path,
      oldString: matchedString,
      newString: new_string,
      originalFile: originalContent,
      structuredPatch: patch,
      userModified: options.userModified ?? false,
      replaceAll: replace_all
    }
  };
}

// Mapping: nD1→createPatchedContent, ns→writeFileWithLineEndings,
// RW→detectEncoding, _c→detectLineEnding, Rc→getLSPClient,
// ds→postEditHook, ps→saveToFileHistory, vG→isFileHistoryEnabled
```

---

## 6. Write Tool Implementation

### Execution Flow

```javascript
// ============================================
// WriteTool.call - Execute file write
// Location: chunks.115.mjs:1338-1420
// ============================================

// READABLE pseudocode:
async call({ file_path, content }, { readFileState, updateFileHistoryState }, options, meta) {
  let resolvedPath = resolvePath(file_path);
  let parentDir = getParentDirectory(resolvedPath);
  let fs = getFileSystem();

  // 1. Trigger beforeFileEdited hook
  await hooks.beforeFileEdited(resolvedPath);

  // 2. Runtime double-check for modifications
  let fileExists = fs.existsSync(resolvedPath);
  if (fileExists) {
    let currentTimestamp = getFileModifiedTime(resolvedPath);
    let readRecord = readFileState.get(resolvedPath);
    if (!readRecord || currentTimestamp > readRecord.timestamp) {
      // Enhanced check: compare content if full file was read
      if (readRecord && readRecord.offset === undefined && readRecord.limit === undefined) {
        let encoding = detectEncoding(resolvedPath);
        let currentContent = fs.readFileSync(resolvedPath, { encoding })
            .replaceAll('\r\n', '\n');
        if (currentContent !== readRecord.content) {
          throw Error("File has been unexpectedly modified");
        }
      } else {
        throw Error("File has been unexpectedly modified");
      }
    }
  }

  // 3. Detect encoding and line endings
  let encoding = fileExists ? detectEncoding(resolvedPath) : "utf-8";
  let lineEnding = fileExists ? detectLineEnding(resolvedPath) : await getDefaultLineEnding();

  // 4. Save to file history
  if (isFileHistoryEnabled()) {
    await saveToFileHistory(updateFileHistoryState, resolvedPath, meta.uuid);
  }

  // 5. Create parent directory and write file
  fs.mkdirSync(parentDir);
  writeFileWithLineEndings(resolvedPath, content, encoding, lineEnding);

  // 6. Notify LSP server
  let lspClient = getLSPClient();
  if (lspClient) {
    notifyIDE(`file://${resolvedPath}`);
    lspClient.changeFile(resolvedPath, content);
    lspClient.saveFile(resolvedPath);
  }

  // 7. Post-write hooks
  let originalContent = fileExists ? fs.readFileSync(resolvedPath, { encoding }) : null;
  postEditHook(resolvedPath, originalContent, content);

  // 8. Update readFileState
  readFileState.set(resolvedPath, {
    content: content,
    timestamp: getFileModifiedTime(resolvedPath),
    offset: undefined,
    limit: undefined
  });

  // 9. Log telemetry for CLAUDE.md
  if (resolvedPath.endsWith(`${pathSep}CLAUDE.md`)) {
    logEvent("tengu_write_claudemd", {});
  }

  // 10. Return result
  if (originalContent) {
    let patch = createPatch({ filePath: file_path, fileContents: originalContent, edits: [...] });
    return { data: { filePath: file_path, type: "update", content, structuredPatch: patch } };
  }
  return { data: { filePath: file_path, type: "create", content } };
}
```

---

## 7. File Encoding & Line Endings

### Encoding Detection

```javascript
// ============================================
// detectEncoding - Auto-detect file encoding
// Location: chunks.148.mjs:2720-2741
// ============================================

// ORIGINAL (for source lookup):
function RW(A) {
  try {
    let B = vA(),
      { resolvedPath: G } = xI(B, A),
      { buffer: Z, bytesRead: Y } = B.readSync(G, { length: 4096 });
    if (Y === 0) return "utf8";
    if (Y >= 2) {
      if (Z[0] === 255 && Z[1] === 254) return "utf16le"
    }
    if (Y >= 3 && Z[0] === 239 && Z[1] === 187 && Z[2] === 191) return "utf8";
    return "utf8"
  } catch (B) {
    return e(B), "utf8"
  }
}

// READABLE (for understanding):
function detectEncoding(filePath) {
  try {
    let fs = getFileSystem();
    let { resolvedPath } = resolvePath(fs, filePath);
    let { buffer, bytesRead } = fs.readSync(resolvedPath, { length: 4096 });

    // Empty file
    if (bytesRead === 0) return "utf8";

    // Check for UTF-16LE BOM (0xFF 0xFE)
    if (bytesRead >= 2) {
      if (buffer[0] === 0xFF && buffer[1] === 0xFE) return "utf16le";
    }

    // Check for UTF-8 BOM (0xEF 0xBB 0xBF)
    if (bytesRead >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
      return "utf8";
    }

    // Default to UTF-8
    return "utf8";
  } catch (error) {
    logError(error);
    return "utf8";
  }
}

// Mapping: RW→detectEncoding, A→filePath, B→fs/error, G→resolvedPath,
// Z→buffer, Y→bytesRead, xI→resolvePath
```

### Line Ending Detection

```javascript
// ============================================
// detectLineEnding - Count CRLF vs LF
// Location: chunks.148.mjs:2743-2771
// ============================================

// ORIGINAL (for source lookup):
function _c(A, Q = "utf8") {
  try {
    let B = vA(),
      { resolvedPath: G } = xI(B, A),
      { buffer: Z, bytesRead: Y } = B.readSync(G, { length: 4096 }),
      J = Z.toString(Q, 0, Y);
    return XC7(J)
  } catch (B) {
    return e(B), "LF"
  }
}

function XC7(A) {
  let Q = 0, B = 0;
  for (let G = 0; G < A.length; G++)
    if (A[G] === `\n`)
      if (G > 0 && A[G - 1] === "\r") Q++;
      else B++;
  return Q > B ? "CRLF" : "LF"
}

// READABLE (for understanding):
function detectLineEnding(filePath, encoding = "utf8") {
  try {
    let fs = getFileSystem();
    let { resolvedPath } = resolvePath(fs, filePath);
    let { buffer, bytesRead } = fs.readSync(resolvedPath, { length: 4096 });
    let content = buffer.toString(encoding, 0, bytesRead);
    return countLineEndingTypes(content);
  } catch (error) {
    logError(error);
    return "LF";
  }
}

function countLineEndingTypes(content) {
  let crlfCount = 0, lfCount = 0;
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '\n') {
      if (i > 0 && content[i - 1] === '\r') crlfCount++;
      else lfCount++;
    }
  }
  return crlfCount > lfCount ? "CRLF" : "LF";
}

// Mapping: _c→detectLineEnding, XC7→countLineEndingTypes,
// A→filePath/content, Q→encoding/crlfCount, B→fs/lfCount
```

### Write with Line Endings

```javascript
// ============================================
// writeFileWithLineEndings - Write file preserving EOL format
// Location: chunks.148.mjs:2710-2717
// ============================================

// ORIGINAL (for source lookup):
function ns(A, Q, B, G) {
  let Z = Q;
  if (G === "CRLF") Z = Q.split(`\n`).join(`\r\n`);
  yR(A, Z, { encoding: B })
}

// READABLE (for understanding):
function writeFileWithLineEndings(filePath, content, encoding, lineEnding) {
  let processedContent = content;
  // Internal representation uses LF
  // Convert to CRLF if original file used CRLF
  if (lineEnding === "CRLF") {
    processedContent = content.split('\n').join('\r\n');
  }
  writeFileSync(filePath, processedContent, { encoding: encoding });
}

// Mapping: ns→writeFileWithLineEndings, A→filePath, Q→content,
// B→encoding, G→lineEnding, Z→processedContent, yR→writeFileSync
```

---

## 8. Settings File Watcher (Chokidar)

### Watcher Setup

```javascript
// ============================================
// setupSettingsFileWatcher - Initialize Chokidar watcher
// Location: chunks.55.mjs:990-1011
// ============================================

// ORIGINAL (for source lookup):
function cG8() {
  if (hr1 || ur1) return;
  hr1 = !0;
  let A = iG8();
  if (A.length === 0) return;
  k(`Watching for changes in setting files ${A.join(", ")}...`),
  GIA = BIA.watch(A, {
    persistent: !0,
    ignoreInitial: !0,
    depth: 0,
    awaitWriteFinish: {
      stabilityThreshold: gr1?.stabilityThreshold ?? uG8,
      pollInterval: gr1?.pollInterval ?? mG8
    },
    ignored: (Q, B) => {
      if (B && !B.isFile() && !B.isDirectory()) return !0;
      return Q.split(i01.sep).some((G) => G === ".git")
    },
    ignorePermissionErrors: !0,
    usePolling: !1,
    atomic: !0
  }),
  GIA.on("change", nG8),
  GIA.on("unlink", aG8),
  C6(async () => MEB())
}

// READABLE (for understanding):
function setupSettingsFileWatcher() {
  if (isInitialized || isClosing) return;
  isInitialized = true;

  let settingFilePaths = getSettingFilePaths();
  if (settingFilePaths.length === 0) return;

  logger(`Watching for changes in setting files ${settingFilePaths.join(", ")}...`);

  settingsFileWatcher = chokidar.watch(settingFilePaths, {
    persistent: true,           // Keep process alive
    ignoreInitial: true,        // Don't trigger for existing files
    depth: 0,                   // Only watch immediate children
    awaitWriteFinish: {
      stabilityThreshold: config?.stabilityThreshold ?? DEFAULT_STABILITY_THRESHOLD,
      pollInterval: config?.pollInterval ?? DEFAULT_POLL_INTERVAL
    },
    ignored: (path, stats) => {
      // Ignore non-file, non-directory entries
      if (stats && !stats.isFile() && !stats.isDirectory()) return true;
      // Ignore .git directories
      return path.split(pathSeparator).some((part) => part === ".git");
    },
    ignorePermissionErrors: true,  // Continue even if some files unreadable
    usePolling: false,             // Use native FS events (faster)
    atomic: true                   // Handle atomic file operations
  });

  settingsFileWatcher.on("change", handleSettingsChange);
  settingsFileWatcher.on("unlink", handleSettingsDelete);

  registerCleanup(async () => closeWatcher());
}

// Mapping: cG8→setupSettingsFileWatcher, hr1→isInitialized, ur1→isClosing,
// iG8→getSettingFilePaths, GIA→settingsFileWatcher, BIA→chokidar,
// nG8→handleSettingsChange, aG8→handleSettingsDelete, MEB→closeWatcher
```

### Chokidar Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| `persistent` | true | Keep process alive while watching |
| `ignoreInitial` | true | Don't trigger for existing files on start |
| `depth` | 0 | Only watch immediate children |
| `awaitWriteFinish` | object | Wait for file to be fully written |
| `stabilityThreshold` | configurable | How long to wait for file stability |
| `pollInterval` | configurable | How often to check file during write |
| `ignored` | function | Ignore .git directories |
| `ignorePermissionErrors` | true | Continue even if some files unreadable |
| `usePolling` | false | Use native FS events (faster) |
| `atomic` | true | Handle atomic file operations correctly |

### Watcher Cleanup

```javascript
// ============================================
// closeWatcher - Cleanup file watcher
// Location: chunks.55.mjs:1013-1016
// ============================================

// ORIGINAL (for source lookup):
function MEB() {
  if (ur1 = !0, GIA) GIA.close(), GIA = null;
  l01.clear(), ZIA.clear()
}

// READABLE (for understanding):
function closeWatcher() {
  isClosing = true;
  if (settingsFileWatcher) {
    settingsFileWatcher.close();
    settingsFileWatcher = null;
  }
  recentlyModifiedFiles.clear();
  changeCallbacks.clear();
}

// Mapping: MEB→closeWatcher, ur1→isClosing, GIA→settingsFileWatcher,
// l01→recentlyModifiedFiles, ZIA→changeCallbacks
```

---

## 9. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        File System Layer                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │  Read Tool   │    │  Edit Tool   │    │  Write Tool  │               │
│  │  (V$)        │    │  (X$)        │    │  (J$)        │               │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘               │
│         │                   │                   │                        │
│         │ records           │ validates         │ validates              │
│         ▼                   ▼                   ▼                        │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     readFileState Map                            │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │ filePath → { content, timestamp, offset?, limit? }      │    │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                │                                         │
│         ┌──────────────────────┼──────────────────────┐                 │
│         ▼                      ▼                      ▼                 │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────┐          │
│  │  Permission  │    │    Encoding      │    │ Line Ending  │          │
│  │   Check (AE) │    │  Detection (RW)  │    │ Convert (ns) │          │
│  └──────────────┘    └──────────────────┘    └──────────────┘          │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │              File System Abstraction (vA/NT9)                     │   │
│  │  ┌──────────────────────────────────────────────────────────┐    │   │
│  │  │  existsSync, readFileSync, writeFileSync, mkdirSync,...  │    │   │
│  │  │              All wrapped with MW monitoring              │    │   │
│  │  └──────────────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                    Settings File Watcher (Chokidar)                      │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Settings Files Monitoring (persistent, atomic, etc.)            │   │
│  │  Events: change → handleSettingsChange (nG8)                     │   │
│  │          unlink → handleSettingsDelete (aG8)                     │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Key Functions Summary

Key functions in this document:

- `getFileSystem` (vA) - Returns file system abstraction singleton
- `FileSystemWrapper` (NT9) - File system wrapper object with monitoring
- `monitoringWrapper` (MW) - Wraps fs operations with logging
- `detectEncoding` (RW) - Detects UTF-16LE vs UTF-8 via BOM
- `detectLineEnding` (_c) - Counts CRLF vs LF occurrences
- `countLineEndingTypes` (XC7) - Core line ending counting algorithm
- `writeFileWithLineEndings` (ns) - Writes file preserving EOL format
- `resolvePath` (Yr) - Resolves file path with special char handling
- `getFileModifiedTime` (mz) - Gets file mtime in milliseconds
- `readTextFileWithLineNumbers` (L12) - Reads file with line slicing
- `fuzzyStringMatch` (k6A) - Matches string with quote normalization
- `createPatchedContent` (nD1) - Creates patched file with structured diff
- `setupSettingsFileWatcher` (cG8) - Initializes Chokidar watcher
- `closeWatcher` (MEB) - Cleans up file watcher
- `handleSettingsChange` (nG8) - Handles settings file changes
- `handleSettingsDelete` (aG8) - Handles settings file deletion
- `saveToFileHistory` (ps) - Saves file state before modification
- `isFileHistoryEnabled` (vG) - Checks if file history is enabled

---

## 11. Changes from v2.0.59

1. **Enhanced Content Verification** (chunks.115.mjs:884-896)
   - For full reads (`offset`/`limit` undefined), compares actual content even when timestamp differs
   - Handles "false positive" timestamp changes where content is unchanged

2. **Settings.json Validation** (chunks.114.mjs:2913-2929)
   - New errorCode 10 for invalid settings.json edits
   - Pre-validates that edits would produce valid JSON/schema

3. **File History Integration** (chunks.115.mjs:981)
   - Integration with file history for recovery (`vG()` and `ps()`)

4. **Tool Groups Classification** (chunks.144.mjs:1259-1281)
   - Formalized READ_ONLY, EDIT, EXECUTION, MCP, OTHER groups
   - Used for plan mode UI and permissions
