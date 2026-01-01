# Edit Tool Forced Read Enforcement

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

## Overview

Claude Code enforces a strict "read before edit" pattern. The model cannot modify a file without first reading it. This prevents:
1. Editing files the model hasn't seen (blind modifications)
2. Editing files that have been externally modified (stale edits)
3. Making assumptions about file content

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                Read-Before-Edit Enforcement                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Read Tool                              │  │
│  │  1. Read file content                                    │  │
│  │  2. Store in readFileState Map                           │  │
│  │  3. Record timestamp                                     │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              readFileState Map                            │  │
│  │  {                                                       │  │
│  │    "/path/to/file.js": {                                 │  │
│  │      content: "...",                                     │  │
│  │      timestamp: 1704067200000,                           │  │
│  │      offset: undefined,                                  │  │
│  │      limit: undefined                                    │  │
│  │    }                                                     │  │
│  │  }                                                       │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Edit/Write Tool Validation                   │  │
│  │  1. Check if file in readFileState                       │  │
│  │  2. Compare current mtime vs recorded timestamp          │  │
│  │  3. Reject if not read or modified since read            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Read Tool: Recording File State

When a file is read, the Read tool records its state in `readFileState`:

```javascript
// ============================================
// recordFileRead - Store file state after reading
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
  content: fileContent,              // File content (text or base64)
  timestamp: getFileModifiedTime(resolvedPath),  // mtime at read time
  offset: startLine,                 // Line offset if partial read
  limit: lineLimit                   // Line limit if partial read
});

// Mapping: Z→readFileState, X→resolvedPath, E→fileContent,
// PD→getFileModifiedTime, Q→startLine, B→lineLimit
```

---

## 2. Edit Tool: Pre-Validation

The Edit tool validates that the file has been read before allowing edits:

```javascript
// ============================================
// validateEditToolInput - Pre-validation for Edit tool
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

// Check 1: File must have been read
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

// Check 2: File must not have been modified since reading
if (fileReadRecord) {
  let currentModTime = getFileModifiedTime(resolvedPath);
  if (currentModTime > fileReadRecord.timestamp) {
    return {
      result: false,
      behavior: "ask",
      message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
      errorCode: 7
    };
  }
}

// Mapping: Z→sessionContext, X→fileReadRecord, I→resolvedPath,
// PD→getFileModifiedTime, R51→isAbsolutePath
```

---

## 3. Write Tool: Same Enforcement

The Write tool has identical enforcement:

```javascript
// ============================================
// validateWriteToolInput - Pre-validation for Write tool
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

// Check 1: File must have been read
if (!fileReadRecord) {
  return {
    result: false,
    message: "File has not been read yet. Read it first before writing to it.",
    errorCode: 2
  };
}

// Check 2: File must not have been modified since reading
if (fileReadRecord) {
  let currentModTime = getFileModifiedTime(resolvedPath);
  if (currentModTime > fileReadRecord.timestamp) {
    return {
      result: false,
      message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
      errorCode: 3
    };
  }
}

// Mapping: Q→sessionContext, Y→fileReadRecord, B→resolvedPath, PD→getFileModifiedTime
```

---

## 4. Runtime Double-Check

Even after pre-validation passes, there's a runtime check during actual file write:

```javascript
// ============================================
// runtimeFileCheck - Double-check during write execution
// Location: chunks.122.mjs:3384-3388
// ============================================

// ORIGINAL (for source lookup):
if (V) {
  let E = PD(J),
    U = B.get(J);
  if (!U || E > U.timestamp)
    throw Error("File has been unexpectedly modified. Read it again before attempting to write it.")
}

// READABLE (for understanding):
if (fileExists) {
  let currentModTime = getFileModifiedTime(resolvedPath);
  let readRecord = readFileState.get(resolvedPath);

  // Race condition check - file may have changed between validation and execution
  if (!readRecord || currentModTime > readRecord.timestamp) {
    throw Error("File has been unexpectedly modified. Read it again before attempting to write it.");
  }
}

// Mapping: V→fileExists, PD→getFileModifiedTime, J→resolvedPath, B→readFileState
```

**Key insight:** This double-check catches race conditions where the file is modified between the pre-validation and the actual write operation.

---

## 5. Post-Write State Update

After a successful write, the `readFileState` is updated with the new content:

```javascript
// ============================================
// updateReadFileStateAfterWrite - Update state after successful write
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
  content: newContent,                           // The content just written
  timestamp: getFileModifiedTime(resolvedPath),  // New mtime
  offset: undefined,                             // Full file was written
  limit: undefined                               // No line limits
});

// Mapping: B→readFileState, J→resolvedPath, Q→newContent, PD→getFileModifiedTime
```

**Key insight:** After writing, `offset` and `limit` are set to `undefined` because the full file content is now known (it was just written), regardless of how the file was originally read.

---

## 6. Error Codes Reference

### Edit Tool Errors

| Code | Condition | Message |
|------|-----------|---------|
| 2 | Permission denied | "File is in a directory that is denied by your permission settings." |
| 5 | Jupyter notebook | "File is a Jupyter Notebook. Use the NotebookEdit to edit this file." |
| 6 | Not read yet | "File has not been read yet. Read it first before writing to it." |
| 7 | Modified since read | "File has been modified since read, either by the user or by a linter." |
| 8 | String not found | "String to replace not found in file." |
| 9 | Multiple matches | "Found N matches of the string to replace, but replace_all is false." |

### Write Tool Errors

| Code | Condition | Message |
|------|-----------|---------|
| 1 | Permission denied | "File is in a directory that is denied by your permission settings." |
| 2 | Not read yet | "File has not been read yet. Read it first before writing to it." |
| 3 | Modified since read | "File has been modified since read, either by the user or by a linter." |

---

## 7. readFileState Data Structure

```typescript
interface FileReadRecord {
  content: string;      // File content (text or base64)
  timestamp: number;    // File mtime at read time (milliseconds)
  offset?: number;      // Starting line if partial read (1-indexed)
  limit?: number;       // Number of lines if partial read
}

// Session context maintains:
type ReadFileState = Map<string, FileReadRecord>;
// Key: Absolute resolved file path
// Value: FileReadRecord
```

---

## 8. Enforcement Flow

```
Model calls Edit tool
        │
        ▼
┌─────────────────────────────────┐
│  1. Pre-Validation              │
│  Check readFileState.has(path)  │
│  Check mtime ≤ recorded         │
└─────────────────┬───────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
   [Passes]            [Fails]
        │                   │
        ▼                   ▼
┌───────────────┐    ┌───────────────┐
│ 2. Runtime    │    │ Return error  │
│ Double-check  │    │ to model      │
└───────┬───────┘    └───────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ 3. Execute Edit                   │
│ Read current content              │
│ Apply string replacement          │
│ Write new content                 │
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│ 4. Update readFileState           │
│ Store new content and timestamp   │
└───────────────────────────────────┘
```

---

## 9. Design Rationale

**Why this approach?**

1. **Data Integrity**: Prevents the model from making edits based on assumptions or outdated information
2. **Conflict Detection**: Catches external modifications (by user, linter, or other tools)
3. **Predictable Behavior**: The model always works with current file content
4. **Error Recovery**: Clear error messages guide the model to re-read the file

**Trade-offs:**
- Extra latency: Requires explicit read before any edit
- Memory usage: File content stored in Map until cleared
- Benefit: Strong guarantees about edit correctness

---

## Key Functions Summary

| Function | Location | Purpose |
|----------|----------|---------|
| Read tool recording | chunks.88.mjs:1278-1283 | Store file state after read |
| Edit pre-validation | chunks.123.mjs:1708-1725 | Check readFileState before edit |
| Write pre-validation | chunks.122.mjs:3354-3367 | Check readFileState before write |
| Runtime double-check | chunks.122.mjs:3384-3388 | Race condition protection |
| Post-write update | chunks.122.mjs:3402-3407 | Update state after write |
