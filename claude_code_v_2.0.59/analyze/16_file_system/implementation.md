# File System Operations

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

## Overview

Claude Code implements a sophisticated file system abstraction layer that provides:
1. **Read-before-edit enforcement** - Prevents editing files that haven't been read
2. **File state tracking** - Maintains `readFileState` Map to track file reads
3. **File watching** - Monitors settings files for changes via Chokidar
4. **Line ending normalization** - Handles CRLF/LF conversions
5. **Encoding detection** - Auto-detects UTF-16LE vs UTF-8

---

## 1. Read-Before-Edit Enforcement Mechanism

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
// validateEditToolInput - Edit Tool Pre-Validation
// Location: chunks.123.mjs:1708-1725
// ============================================

// ORIGINAL (for source lookup):
let X = Z.readFileState.get(I);
if (!X) return {
  result: !1,
  behavior: "ask",
  message: "File has not been read yet. Read it first before writing to it.",
  meta: {
    isFilePathAbsolute: String(R51(A))
  },
  errorCode: 6
};
if (X) {
  if (PD(I) > X.timestamp) return {
    result: !1,
    behavior: "ask",
    message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
    errorCode: 7
  }
}

// READABLE (for understanding):
let fileReadRecord = sessionContext.readFileState.get(resolvedPath);
if (!fileReadRecord) {
  return {
    result: false,
    behavior: "ask",
    message: "File has not been read yet. Read it first before writing to it.",
    meta: {
      isFilePathAbsolute: String(isAbsolutePath(userPath))
    },
    errorCode: 6
  };
}
if (fileReadRecord) {
  if (getFileModifiedTime(resolvedPath) > fileReadRecord.timestamp) {
    return {
      result: false,
      behavior: "ask",
      message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
      errorCode: 7
    };
  }
}

// Mapping: Z→sessionContext, X→fileReadRecord, I→resolvedPath,
// PD→getFileModifiedTime, R51→isAbsolutePath, A→userPath
```

### Write Tool Validation

```javascript
// ============================================
// validateWriteToolInput - Write Tool Pre-Validation
// Location: chunks.122.mjs:3354-3367
// ============================================

// ORIGINAL (for source lookup):
let Y = Q.readFileState.get(B);
if (!Y) return {
  result: !1,
  message: "File has not been read yet. Read it first before writing to it.",
  errorCode: 2
};
if (Y) {
  if (PD(B) > Y.timestamp) return {
    result: !1,
    message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
    errorCode: 3
  }
}

// READABLE (for understanding):
let fileReadRecord = sessionContext.readFileState.get(resolvedPath);
if (!fileReadRecord) {
  return {
    result: false,
    message: "File has not been read yet. Read it first before writing to it.",
    errorCode: 2
  };
}
if (fileReadRecord) {
  if (getFileModifiedTime(resolvedPath) > fileReadRecord.timestamp) {
    return {
      result: false,
      message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
      errorCode: 3
    };
  }
}

// Mapping: Q→sessionContext, Y→fileReadRecord, B→resolvedPath, PD→getFileModifiedTime
```

### Error Code Reference

| Error Code | Tool | Condition | Message |
|------------|------|-----------|---------|
| 6 | Edit | File not in readFileState | "File has not been read yet" |
| 7 | Edit | File modified since read | "File has been modified since read" |
| 2 | Write | File not in readFileState | "File has not been read yet" |
| 3 | Write | File modified since read | "File has been modified since read" |
| 5 | Edit | Jupyter notebook | "Use NotebookEdit to edit this file" |
| 8 | Edit | String not found | "String to replace not found in file" |
| 9 | Edit | Multiple matches | "Found N matches...set replace_all to true" |

---

## 2. readFileState Data Structure

### Structure Definition

```typescript
interface FileReadRecord {
  content: string;      // File content (text or base64)
  timestamp: number;    // File modification time at read
  offset?: number;      // Line offset if partial read
  limit?: number;       // Line limit if partial read
}

// Session context maintains:
readFileState: Map<string, FileReadRecord>
```

### Read Tool State Recording

```javascript
// ============================================
// recordFileRead - Updates readFileState after successful read
// Location: chunks.88.mjs:1278-1283
// ============================================

// ORIGINAL (for source lookup):
Z.set(X, {
  content: E,
  timestamp: PD(X),
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

// Mapping: Z→readFileState, X→resolvedPath, E→fileContent,
// PD→getFileModifiedTime, Q→startOffset, B→lineLimit
```

### Write Tool State Update

After writing a file, the `readFileState` is updated with the new content:

```javascript
// ============================================
// updateReadFileStateAfterWrite - Updates state after file write
// Location: chunks.122.mjs:3402-3407
// ============================================

// ORIGINAL (for source lookup):
B.set(J, {
  content: Q,
  timestamp: PD(J),
  offset: void 0,
  limit: void 0
})

// READABLE (for understanding):
readFileState.set(resolvedPath, {
  content: newContent,
  timestamp: getFileModifiedTime(resolvedPath),
  offset: undefined,
  limit: undefined
})

// Mapping: B→readFileState, J→resolvedPath, Q→newContent, PD→getFileModifiedTime
```

**Key insight:** After writing, `offset` and `limit` are set to `undefined` because the full file content is now known (it was just written).

---

## 3. File Write Operations

### Generic File Writer

```javascript
// ============================================
// KWA - writeFileWithLineEndings
// Location: chunks.154.mjs:1995-2003
// ============================================

// ORIGINAL (for source lookup):
function KWA(A, Q, B, G) {
  let Z = Q;
  if (G === "CRLF") Z = Q.split(`\n`).join(`\r\n`);
  L_(A, Z, {
    encoding: B
  })
}

// READABLE (for understanding):
function writeFileWithLineEndings(filePath, content, encoding, lineEnding) {
  let processedContent = content;
  if (lineEnding === "CRLF") {
    processedContent = content.split('\n').join('\r\n');
  }
  writeFileSync(filePath, processedContent, {
    encoding: encoding
  })
}

// Mapping: A→filePath, Q→content, B→encoding, G→lineEnding,
// Z→processedContent, L_→writeFileSync
```

**How it works:**
1. Takes content with LF line endings (internal representation)
2. If original file had CRLF, converts back to CRLF before writing
3. Uses detected encoding to write file

### Write Tool Complete Flow

```javascript
// ============================================
// WriteTool.call - Complete file write operation
// Location: chunks.122.mjs:3379-3407
// ============================================

// READABLE pseudocode:
async function writeToolCall({ file_path, content }, sessionContext) {
  let resolvedPath = resolvePath(file_path);
  let parentDir = getParentDirectory(resolvedPath);
  let fs = getFileSystem();

  // 1. Trigger beforeFileEdited hook
  await hooks.beforeFileEdited(resolvedPath);

  // 2. Double-check file hasn't been modified (runtime check)
  let fileExists = fs.existsSync(resolvedPath);
  if (fileExists) {
    let currentModTime = getFileModifiedTime(resolvedPath);
    let readRecord = readFileState.get(resolvedPath);
    if (!readRecord || currentModTime > readRecord.timestamp) {
      throw Error("File has been unexpectedly modified");
    }
  }

  // 3. Detect encoding and line endings
  let encoding = fileExists ? detectEncoding(resolvedPath) : "utf-8";
  let lineEnding = fileExists ? getLineEnding(resolvedPath) : await getDefaultLineEnding();

  // 4. Create parent directory and write file
  fs.mkdirSync(parentDir);
  writeFileWithLineEndings(resolvedPath, content, encoding, lineEnding);

  // 5. Notify LSP server of file change
  let lspServer = getLanguageServer();
  if (lspServer) {
    markFileAsOpen(`file://${resolvedPath}`);
    lspServer.changeFile(resolvedPath, content);
    lspServer.saveFile(resolvedPath);
  }

  // 6. Update readFileState with new content
  readFileState.set(resolvedPath, {
    content: content,
    timestamp: getFileModifiedTime(resolvedPath),
    offset: undefined,
    limit: undefined
  });
}
```

---

## 4. File Watching (Chokidar)

### Settings File Watcher Setup

```javascript
// ============================================
// setupSettingsFileWatcher - Initialize Chokidar watcher
// Location: chunks.19.mjs:307-324
// ============================================

// ORIGINAL (for source lookup):
function k64() {
  if (gd0 || md0) return;
  gd0 = !0;
  let A = v64();
  if (A.length === 0) return;
  g(`Watching for changes in setting files ${A.join(", ")}...`);
  h9A = fd0.watch(A, {
    persistent: !0,
    ignoreInitial: !0,
    awaitWriteFinish: {
      stabilityThreshold: j64,
      pollInterval: S64
    },
    ignored: (Q) => Q.split(ud0.sep).some((B) => B === ".git"),
    ignorePermissionErrors: !0,
    usePolling: !1,
    atomic: !0
  });
  h9A.on("change", b64);
  h9A.on("unlink", f64);
  PG(async () => dd0())
}

// READABLE (for understanding):
function setupSettingsFileWatcher() {
  if (isInitialized || isClosing) return;
  isInitialized = true;

  let settingFiles = getSettingFilePaths();
  if (settingFiles.length === 0) return;

  logger(`Watching for changes in setting files ${settingFiles.join(", ")}...`);

  fileWatcher = chokidar.watch(settingFiles, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: WRITE_STABILITY_THRESHOLD,
      pollInterval: POLL_INTERVAL
    },
    ignored: (path) => path.split(pathSeparator).some((part) => part === ".git"),
    ignorePermissionErrors: true,
    usePolling: false,
    atomic: true
  });

  fileWatcher.on("change", handleSettingsChange);
  fileWatcher.on("unlink", handleSettingsDelete);

  registerCleanup(async () => closeWatcher());
}

// Mapping: k64→setupSettingsFileWatcher, gd0→isInitialized, md0→isClosing,
// A→settingFiles, v64→getSettingFilePaths, h9A→fileWatcher, fd0→chokidar,
// j64→WRITE_STABILITY_THRESHOLD, S64→POLL_INTERVAL, b64→handleSettingsChange,
// f64→handleSettingsDelete, dd0→closeWatcher, PG→registerCleanup
```

### Chokidar Configuration Options

| Option | Value | Purpose |
|--------|-------|---------|
| `persistent` | true | Keep process alive while watching |
| `ignoreInitial` | true | Don't trigger for existing files on start |
| `awaitWriteFinish` | object | Wait for file to be fully written |
| `stabilityThreshold` | configurable | How long to wait for file stability |
| `pollInterval` | configurable | How often to check file during write |
| `ignored` | .git filter | Ignore .git directory changes |
| `ignorePermissionErrors` | true | Continue even if some files unreadable |
| `usePolling` | false | Use native FS events (faster) |
| `atomic` | true | Handle atomic file operations correctly |

### Watcher Cleanup

```javascript
// ============================================
// closeWatcher - Cleanup file watcher
// Location: chunks.19.mjs:326-329
// ============================================

// ORIGINAL (for source lookup):
function dd0() {
  if (md0 = !0, h9A) h9A.close(), h9A = null;
  pxA.clear(), wKA.clear()
}

// READABLE (for understanding):
function closeWatcher() {
  isClosing = true;
  if (fileWatcher) {
    fileWatcher.close();
    fileWatcher = null;
  }
  recentlyModifiedFiles.clear();
  changeCallbacks.clear();
}

// Mapping: dd0→closeWatcher, md0→isClosing, h9A→fileWatcher,
// pxA→recentlyModifiedFiles, wKA→changeCallbacks
```

---

## 5. Encoding Detection

```javascript
// ============================================
// detectEncoding - Auto-detect file encoding
// Location: chunks.154.mjs:2005-2019
// ============================================

// ORIGINAL (for source lookup):
function CH(A) {
  try {
    let B = RA(),
      {
        resolvedPath: G
      } = fK(B, A),
      {
        buffer: Z,
        bytesRead: I
      } = B.readSync(G, {
        length: 4096
      });
    if (I >= 2) {
      if (Z[0] === 255 && Z[1] === 254) return "utf16le"
    }
    // ... more encoding detection
  }
}

// READABLE (for understanding):
function detectEncoding(filePath) {
  try {
    let fs = getFileSystem();
    let { resolvedPath } = resolvePath(fs, filePath);
    let { buffer, bytesRead } = fs.readSync(resolvedPath, {
      length: 4096
    });

    // Check for UTF-16LE BOM (0xFF 0xFE)
    if (bytesRead >= 2) {
      if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
        return "utf16le";
      }
    }

    // Default to UTF-8
    return "utf-8";
  }
}

// Mapping: CH→detectEncoding, A→filePath, RA→getFileSystem,
// fK→resolvePath, Z→buffer, I→bytesRead
```

**How it works:**
1. Reads first 4096 bytes of file
2. Checks for UTF-16LE BOM (byte order mark: 0xFF 0xFE)
3. Returns "utf16le" if BOM found, otherwise "utf-8"

---

## 6. Permission Checks

### Edit Tool Permission Check

```javascript
// Location: chunks.123.mjs:1697-1701
if (jD(I, Y.toolPermissionContext, "edit", "deny") !== null) {
  return {
    result: false,
    message: "File is in a directory that is denied by your permission settings.",
    errorCode: 2
  };
}
```

### Read Tool Permission Check

```javascript
// Location: chunks.88.mjs:1207
if (jD(I, Y.toolPermissionContext, "read", "deny") !== null) {
  return {
    result: false,
    message: "File is in a directory that is denied by your permission settings.",
    errorCode: 1
  };
}
```

**Key insight:** The `jD` function checks if a file path matches any denied patterns in the permission configuration. The third parameter ("edit"/"read") specifies the operation type, and "deny" indicates checking against deny rules.

---

## 7. Special File Type Handling

### Jupyter Notebooks (.ipynb)

Edit tool redirects to NotebookEdit tool:
```javascript
// Location: chunks.123.mjs:1702-1707
if (resolvedPath.endsWith(".ipynb")) {
  return {
    result: false,
    behavior: "ask",
    message: `File is a Jupyter Notebook. Use the NotebookEdit to edit this file.`,
    errorCode: 5
  };
}
```

### Images and PDFs

Read tool handles binary files specially:
- Images: Converted to base64, returned with `type: "image"`
- PDFs: Processed page-by-page, returned with document content block
- Notebooks: Parsed as JSON, cells extracted

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     File System Layer                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  Read Tool   │    │  Edit Tool   │    │  Write Tool  │      │
│  │  (FileRead)  │    │  (Edit)      │    │  (Write)     │      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                   │                   │               │
│         │ records           │ validates         │ validates     │
│         ▼                   ▼                   ▼               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   readFileState Map                      │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │ filePath → { content, timestamp, offset, limit }  │  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│         ┌────────────────────┼────────────────────┐            │
│         ▼                    ▼                    ▼            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  Permission  │    │   Encoding   │    │  Line Ending │      │
│  │   Check      │    │  Detection   │    │  Conversion  │      │
│  │   (jD)       │    │    (CH)      │    │   (KWA)      │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                     Chokidar File Watcher                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Settings Files Monitoring (persistent, atomic, etc.)  │    │
│  │  Events: change → handleSettingsChange                 │    │
│  │          unlink → handleSettingsDelete                 │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Functions Summary

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| validateEditInput | - | chunks.123.mjs:1708-1725 | Check readFileState before edit |
| validateWriteInput | - | chunks.122.mjs:3354-3367 | Check readFileState before write |
| writeFileWithLineEndings | KWA | chunks.154.mjs:1995-2003 | Write file with CRLF conversion |
| detectEncoding | CH | chunks.154.mjs:2005-2019 | Auto-detect UTF-16LE vs UTF-8 |
| setupSettingsFileWatcher | k64 | chunks.19.mjs:307-324 | Initialize Chokidar watcher |
| closeWatcher | dd0 | chunks.19.mjs:326-329 | Cleanup file watcher |
| getFileModifiedTime | PD | various | Get file mtime for comparison |
| checkPermission | jD | various | Check file against deny rules |
