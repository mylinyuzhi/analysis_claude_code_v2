# Read-Before-Edit Enforcement (Claude Code v2.1.7)

This document describes how Claude Code enforces the "read before edit" pattern for file modification tools, with detailed Edit tool implementation.

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

---

## Overview

Claude Code enforces a strict "read before edit" pattern. The model cannot modify a file without first reading it. This prevents:

1. **Blind modifications** - Editing files the model hasn't seen
2. **Stale edits** - Editing files that have been externally modified
3. **Content assumptions** - Making edits based on assumed content
4. **Race conditions** - Concurrent modifications causing data loss

**Note:** Claude Code does NOT have a separate `str_replace` tool. The **Edit tool** is the string replacement tool, using `old_string`/`new_string` parameters (similar to the `str_replace` pattern in other AI coding assistants). The `str_replace_single` reference in the codebase is a UI completion type for rendering, not a separate tool.

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
│  │  3. Record timestamp (mtime)                             │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                     │
│                           ▼                                     │
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
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Edit/Write Tool Validation                   │  │
│  │  1. Check if file in readFileState                       │  │
│  │  2. Compare current mtime vs recorded timestamp          │  │
│  │  3. Optionally compare content (for full reads)          │  │
│  │  4. Reject if not read or modified since read            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## readFileState Data Structure

```typescript
interface FileReadRecord {
  content: string;      // File content at read time (text or base64)
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

## Read Tool: Recording File State

When a file is read, the Read tool records its state:

```javascript
// ============================================
// Read Tool - Recording file state
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
  content: fileContent,              // File content (text or base64)
  timestamp: getFileModifiedTime(resolvedPath),  // mtime at read time
  offset: startOffset,               // Line offset if partial read
  limit: lineLimit                   // Line limit if partial read
});

// Mapping: Z→readFileState, D→resolvedPath, K→fileContent, mz→getFileModifiedTime
```

For different file types:
- **Text files**: Content stored as string
- **Images**: Content stored as base64
- **Notebooks**: Content stored as serialized cells
- **PDFs**: Content stored as base64

---

## Edit Tool: Pre-Validation

The Edit tool validates that the file has been read before allowing edits:

```javascript
// ============================================
// Edit Tool validateInput - Read-before-edit check
// Location: chunks.115.mjs:873-902
// ============================================

// ORIGINAL (for source lookup):
let D = Z.readFileState.get(Y);
if (!D) return {
  result: !1,
  behavior: "ask",
  message: "File has not been read yet. Read it first before writing to it.",
  meta: {
    isFilePathAbsolute: String(a$0(A))
  },
  errorCode: 6
};
if (D) {
  if (mz(Y) > D.timestamp)
    if (D.offset === void 0 && D.limit === void 0)
      if (I.readFileSync(Y, { encoding: RW(Y) }).replaceAll(`\r\n`, `\n`) === D.content);
      else return {
        result: !1,
        behavior: "ask",
        message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
        errorCode: 7
      };
    else return {
      result: !1,
      behavior: "ask",
      message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
      errorCode: 7
    }
}

// READABLE (for understanding):
let fileReadRecord = toolContext.readFileState.get(resolvedPath);

// Check 1: File must have been read
if (!fileReadRecord) {
  return {
    result: false,
    behavior: "ask",
    message: "File has not been read yet. Read it first before writing to it.",
    meta: { isFilePathAbsolute: String(isAbsolutePath(filePath)) },
    errorCode: 6
  };
}

// Check 2: File must not have been modified since reading
if (fileReadRecord) {
  const currentMtime = getFileModifiedTime(resolvedPath);

  if (currentMtime > fileReadRecord.timestamp) {
    // Timestamp changed - file may have been modified

    if (fileReadRecord.offset === undefined && fileReadRecord.limit === undefined) {
      // Full file was read - we can verify by comparing content
      const currentContent = fs.readFileSync(resolvedPath, { encoding: getEncoding(resolvedPath) })
        .replaceAll("\r\n", "\n");

      if (currentContent === fileReadRecord.content) {
        // Content matches despite timestamp change (false positive)
        // This can happen when file is touched without content change
        // Allow the edit to proceed
      } else {
        // Content actually changed
        return {
          result: false,
          behavior: "ask",
          message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
          errorCode: 7
        };
      }
    } else {
      // Partial read - cannot verify content, must reject
      return {
        result: false,
        behavior: "ask",
        message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
        errorCode: 7
      };
    }
  }
}

// Mapping: D→fileReadRecord, Z→toolContext, Y→resolvedPath, mz→getFileModifiedTime
```

**Key insight:** For full reads (no offset/limit), the validation does a content comparison when timestamp differs. This handles cases where file metadata changes but content stays the same.

---

## Write Tool: Same Enforcement

The Write tool has identical enforcement logic:

```javascript
// ============================================
// Write Tool validateInput - Read-before-write check
// Location: chunks.115.mjs:1321-1332
// ============================================

// ORIGINAL (for source lookup):
let J = Q.readFileState.get(B);
if (!J) return {
  result: !1,
  message: "File has not been read yet. Read it first before writing to it.",
  errorCode: 2
};
if (J) {
  if (mz(B) > J.timestamp) return {
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
  if (getFileModifiedTime(resolvedPath) > fileReadRecord.timestamp) {
    return {
      result: false,
      message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
      errorCode: 3
    };
  }
}

// Mapping: J→fileReadRecord, Q→sessionContext, B→resolvedPath, mz→getFileModifiedTime
```

**Note:** Write tool uses simpler timestamp-only check (no content comparison).

---

## Runtime Double-Check

Even after pre-validation passes, there's a runtime check during actual file operations:

```javascript
// ============================================
// Runtime file modification check
// Location: chunks.115.mjs:974-979 (Edit), chunks.115.mjs:1350-1361 (Write)
// ============================================

// READABLE (for understanding):
if (fs.existsSync(resolvedPath)) {
  const currentMtime = getFileModifiedTime(resolvedPath);
  const readRecord = readFileState.get(resolvedPath);

  if (!readRecord || currentMtime > readRecord.timestamp) {
    // Additional check for full reads
    if (readRecord && readRecord.offset === undefined && readRecord.limit === undefined) {
      const currentContent = fs.readFileSync(resolvedPath, { encoding }).replaceAll("\r\n", "\n");
      if (currentContent !== readRecord.content) {
        throw Error("File has been unexpectedly modified. Read it again before attempting to write it.");
      }
    } else {
      throw Error("File has been unexpectedly modified. Read it again before attempting to write it.");
    }
  }
}
```

**Key insight:** This double-check catches race conditions where the file is modified between the pre-validation and the actual write operation.

---

## Post-Write State Update

After a successful write, the `readFileState` is updated with the new content:

```javascript
// ============================================
// Post-write state update
// Location: chunks.115.mjs:1004-1009 (Edit), chunks.115.mjs:1376-1381 (Write)
// ============================================

// ORIGINAL (for source lookup):
Z.set(W, {
  content: H,
  timestamp: mz(W),
  offset: void 0,
  limit: void 0
})

// READABLE (for understanding):
readFileState.set(resolvedPath, {
  content: newContent,                           // The content just written
  timestamp: getFileModifiedTime(resolvedPath),  // New mtime
  offset: undefined,                             // Full file known
  limit: undefined                               // No line limits
});
```

**Key insight:** After writing, `offset` and `limit` are set to `undefined` because the full file content is now known (it was just written), regardless of how the file was originally read.

---

## Error Codes Reference

### Edit Tool Error Codes

| Code | Condition | Message |
|------|-----------|---------|
| 1 | old_string === new_string | "No changes to make: old_string and new_string are exactly the same." |
| 2 | Permission denied | "File is in a directory that is denied by your permission settings." |
| 3 | File exists but old_string empty | "Cannot create new file - file already exists." |
| 4 | File doesn't exist | "File does not exist." |
| 5 | Jupyter notebook | "File is a Jupyter Notebook. Use the NotebookEdit to edit this file." |
| 6 | Not read yet | "File has not been read yet. Read it first before writing to it." |
| 7 | Modified since read | "File has been modified since read, either by the user or by a linter." |
| 8 | String not found | "String to replace not found in file." |
| 9 | Multiple matches | "Found N matches of the string to replace, but replace_all is false." |

### Write Tool Error Codes

| Code | Condition | Message |
|------|-----------|---------|
| 1 | Permission denied | "File is in a directory that is denied by your permission settings." |
| 2 | Not read yet | "File has not been read yet. Read it first before writing to it." |
| 3 | Modified since read | "File has been modified since read, either by the user or by a linter." |

---

## Validation Flow Diagram

```
Model calls Edit/Write tool
        │
        ▼
┌─────────────────────────────────┐
│  1. Pre-Validation              │
│  - Check readFileState.has(path)│
│  - Check mtime ≤ recorded       │
│  - (Edit only) Compare content  │
└─────────────────┬───────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
   [Passes]            [Fails]
        │                   │
        ▼                   ▼
┌───────────────┐    ┌───────────────┐
│ 2. Permission │    │ Return error  │
│    check      │    │ to model      │
└───────┬───────┘    │ (errorCode)   │
        │            └───────────────┘
        ▼
┌───────────────────────────────────┐
│ 3. Runtime Double-check           │
│ - Re-verify mtime/content         │
│ - Throw if modified               │
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│ 4. Execute Operation              │
│ - Read current content            │
│ - Apply changes                   │
│ - Write new content               │
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│ 5. Update readFileState           │
│ - Store new content               │
│ - Update timestamp                │
│ - Clear offset/limit              │
└───────────────────────────────────┘
```

---

## Special Cases

### New File Creation

When creating a new file (Edit with `old_string === ""`):
- No read required
- File must NOT already exist (unless empty)
- readFileState updated after creation

```javascript
// chunks.115.mjs:850-852
if (!fs.existsSync(resolvedPath) && old_string === "") {
  return { result: true };  // Allow creation
}
```

### File History Integration

Before modifying a file, it can be saved to file history for recovery:

```javascript
// chunks.115.mjs:981
if (fileHistoryEnabled()) {
  await saveToFileHistory(updateFileHistoryState, resolvedPath, toolUseId);
}
```

### LSP Notification

After file modifications, LSP servers are notified:

```javascript
// chunks.115.mjs:999-1003
const lspClient = getLSPClient();
if (lspClient) {
  lspClient.changeFile(resolvedPath, newContent).catch(handleError);
  lspClient.saveFile(resolvedPath).catch(handleError);
}
```

---

## Design Rationale

**Why this approach?**

1. **Data Integrity**: Prevents the model from making edits based on assumptions or outdated information
2. **Conflict Detection**: Catches external modifications (by user, linter, or other tools)
3. **Predictable Behavior**: The model always works with current file content
4. **Error Recovery**: Clear error messages guide the model to re-read the file

**Trade-offs:**
- **Extra latency**: Requires explicit read before any edit
- **Memory usage**: File content stored in Map until cleared
- **Benefit**: Strong guarantees about edit correctness

---

## Key Functions Summary

| Function | Location | Purpose |
|----------|----------|---------|
| Read tool state recording | chunks.86.mjs:764-768 | Store file state after read |
| Edit validateInput | chunks.115.mjs:873-902 | Check readFileState before edit |
| Write validateInput | chunks.115.mjs:1321-1332 | Check readFileState before write |
| Edit runtime check | chunks.115.mjs:974-979 | Race condition protection |
| Write runtime check | chunks.115.mjs:1350-1361 | Race condition protection |
| Post-edit state update | chunks.115.mjs:1004-1009 | Update state after edit |
| Post-write state update | chunks.115.mjs:1376-1381 | Update state after write |

---

## Edit Tool Detailed Implementation

### Tool Definition

```javascript
// ============================================
// Edit Tool Object - J$
// Location: chunks.115.mjs:779-1056
// ============================================

J$ = {
  name: I8,                    // "Edit"
  maxResultSizeChars: 100000,
  strict: true,

  async description() {
    return "A tool for editing files"
  },

  async prompt() {
    return KS2  // Full prompt text below
  },

  inputSchema: xy2,            // Zod schema
  outputSchema: KW1,           // Output schema

  isConcurrencySafe() { return false },
  isReadOnly() { return false },

  getPath(input) {
    return input.file_path
  },

  async checkPermissions(input, context) {
    const appState = await context.getAppState();
    return fileWritePermissionCheck(EditTool, input, appState.toolPermissionContext);
  }
}
```

### Input Schema

```javascript
// ============================================
// Edit Input Schema - xy2
// Location: chunks.114.mjs:2693-2697
// ============================================

xy2 = z.strictObject({
  file_path: z.string().describe("The absolute path to the file to modify"),
  old_string: z.string().describe("The text to replace"),
  new_string: z.string().describe("The text to replace it with (must be different from old_string)"),
  replace_all: z.boolean().default(false).optional().describe("Replace all occurences of old_string (default false)")
});
```

### Output Schema

```javascript
// ============================================
// Edit Output Schema - KW1
// Location: chunks.114.mjs:2704-2712
// ============================================

KW1 = z.object({
  filePath: z.string().describe("The file path that was edited"),
  oldString: z.string().describe("The original string that was replaced"),
  newString: z.string().describe("The new string that replaced it"),
  originalFile: z.string().describe("The original file contents before editing"),
  structuredPatch: z.array(patchHunkSchema).describe("Diff patch showing the changes"),
  userModified: z.boolean().describe("Whether the user modified the proposed changes"),
  replaceAll: z.boolean().describe("Whether all occurrences were replaced")
});
```

### Tool Prompt (KS2)

```javascript
// ============================================
// Edit Tool Prompt - KS2
// Location: chunks.113.mjs:1681-1689
// ============================================

KS2 = `Performs exact string replacements in files.

Usage:
- You must use your \`Read\` tool at least once in the conversation before editing. This tool will error if you attempt an edit without reading the file.
- When editing text from Read tool output, ensure you preserve the exact indentation (tabs/spaces) as it appears AFTER the line number prefix. The line number prefix format is: spaces + line number + tab. Everything after that tab is the actual file content to match. Never include any part of the line number prefix in the old_string or new_string.
- ALWAYS prefer editing existing files in the codebase. NEVER write new files unless explicitly required.
- Only use emojis if the user explicitly requests it. Avoid adding emojis to files unless asked.
- The edit will FAIL if \`old_string\` is not unique in the file. Either provide a larger string with more surrounding context to make it unique or use \`replace_all\` to change every instance of \`old_string\`.
- Use \`replace_all\` for replacing and renaming strings across the file. This parameter is useful if you want to rename a variable for instance.`
```

---

## String Matching Algorithm

### Fuzzy String Matching (k6A)

The Edit tool uses fuzzy matching to handle quote character variations:

```javascript
// ============================================
// k6A - Fuzzy string matching with quote normalization
// Location: chunks.113.mjs:1708-1714
// ============================================

// ORIGINAL (for source lookup):
function k6A(A, Q) {
  if (A.includes(Q)) return Q;
  let B = FS2(Q),
    Z = FS2(A).indexOf(B);
  if (Z !== -1) return A.substring(Z, Z + Q.length);
  return null
}

// READABLE (for understanding):
function findStringWithQuoteNormalization(fileContent, searchString) {
  // Step 1: Direct match - try exact match first
  if (fileContent.includes(searchString)) {
    return searchString;
  }

  // Step 2: Normalize quotes and try again
  const normalizedSearch = normalizeQuotes(searchString);
  const normalizedContent = normalizeQuotes(fileContent);
  const matchIndex = normalizedContent.indexOf(normalizedSearch);

  if (matchIndex !== -1) {
    // Return the ORIGINAL substring (not normalized) at the found position
    return fileContent.substring(matchIndex, matchIndex + searchString.length);
  }

  return null;  // No match found
}

// Mapping: k6A→findStringWithQuoteNormalization, A→fileContent, Q→searchString, FS2→normalizeQuotes
```

**Key insight:** This function returns the actual string from the file (with original quotes), not the normalized version. This ensures the replacement preserves the file's original quote style.

### Quote Normalization (FS2)

```javascript
// ============================================
// FS2 - Normalize smart quotes to standard quotes
// Location: chunks.113.mjs:1692-1694
// ============================================

// ORIGINAL (for source lookup):
function FS2(A) {
  return A.replaceAll(Sf5, "'").replaceAll(xf5, "'").replaceAll(yf5, '"').replaceAll(vf5, '"')
}

// READABLE (for understanding):
function normalizeQuotes(text) {
  return text
    .replaceAll("'", "'")   // Left single quote → apostrophe (Sf5)
    .replaceAll("'", "'")   // Right single quote → apostrophe (xf5)
    .replaceAll(""", '"')   // Left double quote → straight quote (yf5)
    .replaceAll(""", '"');  // Right double quote → straight quote (vf5)
}

// This handles copy-paste from formatted documents (Word, web pages, etc.)
```

---

## String Replacement Algorithm

### Core Replacement (iD1)

```javascript
// ============================================
// iD1 - Core string replacement with newline handling
// Location: chunks.113.mjs:1716-1723
// ============================================

// ORIGINAL (for source lookup):
function iD1(A, Q, B, G = !1) {
  let Z = G ? (J, X, I) => J.replaceAll(X, () => I) : (J, X, I) => J.replace(X, () => I);
  if (B !== "") return Z(A, Q, B);
  return !Q.endsWith(`\n`) && A.includes(Q + `\n`) ? Z(A, Q + `\n`, B) : Z(A, Q, B)
}

// READABLE (for understanding):
function replaceString(fileContent, oldString, newString, replaceAll = false) {
  // Choose replace method based on replaceAll flag
  const replaceFn = replaceAll
    ? (content, search, replacement) => content.replaceAll(search, () => replacement)
    : (content, search, replacement) => content.replace(search, () => replacement);

  // If newString is not empty, do normal replacement
  if (newString !== "") {
    return replaceFn(fileContent, oldString, newString);
  }

  // Special handling for deletion (newString === ""):
  // If oldString doesn't end with newline but exists with trailing newline,
  // include the newline in deletion to avoid leaving blank lines
  if (!oldString.endsWith("\n") && fileContent.includes(oldString + "\n")) {
    return replaceFn(fileContent, oldString + "\n", newString);
  }

  return replaceFn(fileContent, oldString, newString);
}

// Mapping: iD1→replaceString, A→fileContent, Q→oldString, B→newString, G→replaceAll
```

**Key insight:** When deleting text (empty `new_string`), the algorithm intelligently removes trailing newlines to avoid leaving blank lines.

### Multi-Edit Patching (QbA)

```javascript
// ============================================
// QbA - Apply multiple edits and generate patch
// Location: chunks.113.mjs:1743-1783
// ============================================

// READABLE (for understanding):
function applyEditsAndGeneratePatch({ filePath, fileContents, edits }) {
  let currentContent = fileContents;
  const appliedNewStrings = [];

  // Handle empty file case
  if (!fileContents && edits.length === 1 && edits[0].old_string === "" && edits[0].new_string === "") {
    return { patch: generatePatch(...), updatedFile: "" };
  }

  for (const edit of edits) {
    const trimmedOldString = edit.old_string.replace(/\n+$/, "");

    // Check for overlapping edits
    for (const previousNewString of appliedNewStrings) {
      if (trimmedOldString !== "" && previousNewString.includes(trimmedOldString)) {
        throw Error("Cannot edit file: old_string is a substring of a new_string from a previous edit.");
      }
    }

    const beforeEdit = currentContent;
    currentContent = edit.old_string === ""
      ? edit.new_string  // Create new file
      : replaceString(currentContent, edit.old_string, edit.new_string, edit.replace_all);

    if (currentContent === beforeEdit) {
      throw Error("String not found in file. Failed to apply edit.");
    }

    appliedNewStrings.push(edit.new_string);
  }

  if (currentContent === fileContents) {
    throw Error("Original and edited file match exactly. Failed to apply edit.");
  }

  return {
    patch: generatePatch({ filePath, fileContents, edits: [{ old_string: fileContents, new_string: currentContent }] }),
    updatedFile: currentContent
  };
}
```

---

## Edit Tool call() Implementation

```javascript
// ============================================
// Edit Tool call() - Main execution
// Location: chunks.115.mjs:960-1024
// ============================================

// READABLE (for understanding):
async call({ file_path, old_string, new_string, replace_all = false }, context, canUseTool, assistantMessage) {
  const fs = getFileSystem();
  const resolvedPath = resolvePath(file_path);

  // Step 1: Trigger pre-edit hook
  await hooks.beforeFileEdited(resolvedPath);

  // Step 2: Read current file content
  const originalContent = fs.existsSync(resolvedPath)
    ? readFileNormalized(resolvedPath)
    : "";

  // Step 3: Runtime double-check (race condition protection)
  if (fs.existsSync(resolvedPath)) {
    const currentMtime = getFileModifiedTime(resolvedPath);
    const readRecord = context.readFileState.get(resolvedPath);

    if (!readRecord || currentMtime > readRecord.timestamp) {
      // Only allow if content actually matches (for full reads)
      if (!(readRecord && readRecord.offset === undefined && readRecord.limit === undefined
            && originalContent === readRecord.content)) {
        throw Error("File has been unexpectedly modified. Read it again.");
      }
    }
  }

  // Step 4: Save to file history (if enabled)
  if (isFileHistoryEnabled()) {
    await saveToFileHistory(context.updateFileHistoryState, resolvedPath, assistantMessage.uuid);
  }

  // Step 5: Find actual old_string with quote normalization
  const actualOldString = findStringWithQuoteNormalization(originalContent, old_string) || old_string;

  // Step 6: Apply edit and generate patch
  const { patch, updatedFile } = applyEditAndPatch({
    filePath: resolvedPath,
    fileContents: originalContent,
    oldString: actualOldString,
    newString: new_string,
    replaceAll: replace_all
  });

  // Step 7: Ensure parent directory exists
  const parentDir = getParentDirectory(resolvedPath);
  fs.mkdirSync(parentDir);

  // Step 8: Detect EOL style and encoding from original file
  const eolStyle = fs.existsSync(resolvedPath) ? detectEOLStyle(resolvedPath) : "LF";
  const encoding = fs.existsSync(resolvedPath) ? getFileEncoding(resolvedPath) : "utf8";

  // Step 9: Write the updated file
  writeFileSafe(resolvedPath, updatedFile, encoding, eolStyle);

  // Step 10: Notify LSP server
  const lspClient = getLSPClient();
  if (lspClient) {
    notifyIDE(`file://${resolvedPath}`);
    lspClient.changeFile(resolvedPath, updatedFile).catch(logError);
    lspClient.saveFile(resolvedPath).catch(logError);
  }

  // Step 11: Trigger post-edit hooks
  triggerPostEditHooks(resolvedPath, originalContent, updatedFile);

  // Step 12: Update readFileState with new content
  context.readFileState.set(resolvedPath, {
    content: updatedFile,
    timestamp: getFileModifiedTime(resolvedPath),
    offset: undefined,  // Full file now known
    limit: undefined
  });

  // Step 13: Log if CLAUDE.md was edited
  if (resolvedPath.endsWith(`${PATH_SEP}CLAUDE.md`)) {
    logEvent("tengu_write_claudemd", {});
  }

  // Step 14: Log operation and return result
  logFileOperation({ operation: "edit", tool: "FileEditTool", filePath: resolvedPath });

  return {
    data: {
      filePath: file_path,
      oldString: actualOldString,
      newString: new_string,
      originalFile: originalContent,
      structuredPatch: patch,
      userModified: context.userModified ?? false,
      replaceAll: replace_all
    }
  };
}
```

---

## Snippet Generation for Result

```javascript
// ============================================
// HS2 - Generate snippet around edit location
// Location: chunks.113.mjs:1797-1810
// ============================================

// READABLE (for understanding):
function getEditSnippet(originalFile, oldString, newString, contextLines = 4) {
  // Find line number where edit starts
  const beforeEdit = (originalFile.split(oldString)[0] ?? "").split(/\r?\n/).length - 1;

  // Apply edit
  const editedLines = replaceString(originalFile, oldString, newString).split(/\r?\n/);

  // Calculate snippet range with context
  const startLine = Math.max(0, beforeEdit - contextLines);
  const endLine = Math.min(editedLines.length, beforeEdit + newString.split(/\r?\n/).length + contextLines);

  return {
    snippet: editedLines.slice(startLine, endLine).join("\n"),
    startLine: startLine + 1  // 1-indexed for display
  };
}
```

---

## Edit Tool Symbol Reference

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| J$ | EditTool | chunks.115.mjs:779 | Edit tool object |
| xy2 | editInputSchema | chunks.114.mjs:2693 | Input schema (Zod) |
| KW1 | editOutputSchema | chunks.114.mjs:2704 | Output schema |
| KS2 | editPrompt | chunks.113.mjs:1681 | Tool prompt text |
| k6A | findStringWithQuoteNormalization | chunks.113.mjs:1708 | Fuzzy string matching |
| FS2 | normalizeQuotes | chunks.113.mjs:1692 | Quote character normalization |
| iD1 | replaceString | chunks.113.mjs:1716 | Core replacement function |
| nD1 | applyEditAndPatch | chunks.113.mjs:1725 | Single edit with patch |
| QbA | applyEditsAndGeneratePatch | chunks.113.mjs:1743 | Multi-edit support |
| HS2 | getEditSnippet | chunks.113.mjs:1797 | Generate result snippet |
| $S2 | areEditsEquivalent | chunks.113.mjs:1937 | Compare two edit inputs |
| uy2 | validateSettingsJsonEdit | chunks.114.mjs:2913 | Validate settings.json edits |
| h$0 | isSettingsJsonFile | chunks.148.mjs:2039 | Check if file is settings.json |
| C71 | findSimilarFileName | chunks.148.mjs:2812 | Suggest similar file names |
| ZRA | FILE_MODIFIED_ERROR | chunks.55.mjs:1151 | Runtime modification error message |

---

## Parameter Restrictions

### Input Parameters

| Parameter | Type | Required | Default | Restrictions |
|-----------|------|----------|---------|--------------|
| `file_path` | string | Yes | - | Must be absolute path; must exist (except for new file creation) |
| `old_string` | string | Yes | - | Must be different from `new_string`; must be unique in file (unless `replace_all=true`) |
| `new_string` | string | Yes | - | Must be different from `old_string` |
| `replace_all` | boolean | No | `false` | When `false`, `old_string` must be unique in file |

### Parameter Validation Rules

#### `old_string` Restrictions

1. **Uniqueness Requirement** (when `replace_all=false`):
   - `old_string` must appear exactly once in the file
   - If multiple matches found, returns errorCode 9
   - Solution: Add more context to make string unique, or set `replace_all=true`

2. **Exact Match vs Fuzzy Match**:
   - Primary: Exact string match
   - Fallback: Quote-normalized match (smart quotes → standard quotes)
   - If neither matches, returns errorCode 8

3. **Empty `old_string` (new file creation)**:
   - `old_string=""` signals new file creation
   - File must NOT exist (or must be empty/whitespace-only)
   - If file exists with content, returns errorCode 3

#### `new_string` Restrictions

1. **Must Differ from `old_string`**:
   - Identical strings return errorCode 1
   - No-op edits are rejected

2. **Empty `new_string` (deletion)**:
   - `new_string=""` deletes the matched text
   - Trailing newline automatically included in deletion when appropriate

#### `replace_all` Behavior

```javascript
// ============================================
// replace_all behavior in validateInput
// Location: chunks.115.mjs:920-931
// ============================================

// Count occurrences
const matchCount = fileContent.split(actualOldString).length - 1;

if (matchCount > 1 && !replace_all) {
  return {
    result: false,
    behavior: "ask",
    message: `Found ${matchCount} matches of the string to replace, but replace_all is false.
To replace all occurrences, set replace_all to true.
To replace only one occurrence, please provide more context to uniquely identify the instance.`,
    errorCode: 9
  };
}
```

---

## Complete Error Codes Reference

### Validation Phase Errors (validateInput)

| Code | Stage | Condition | Message | Recovery Action |
|------|-------|-----------|---------|-----------------|
| 1 | Input Check | `old_string === new_string` | "No changes to make: old_string and new_string are exactly the same." | Use different strings |
| 2 | Permission | Path denied by config | "File is in a directory that is denied by your permission settings." | Check permission settings |
| 3 | File Check | File exists & `old_string=""` | "Cannot create new file - file already exists." | Use non-empty `old_string` to edit existing file |
| 4 | File Check | File doesn't exist | "File does not exist. [Did you mean X?]" | Check path, use suggested file |
| 5 | File Check | Jupyter notebook | "File is a Jupyter Notebook. Use the NotebookEdit to edit this file." | Use NotebookEdit tool |
| 6 | State Check | Not in readFileState | "File has not been read yet. Read it first before writing to it." | Read file first |
| 7 | State Check | Modified since read | "File has been modified since read, either by the user or by a linter." | Re-read file |
| 8 | String Check | String not found | "String to replace not found in file." | Verify string exists in file |
| 9 | String Check | Multiple matches & !replace_all | "Found N matches but replace_all is false." | Add context or set replace_all=true |
| 10 | Settings Check | Invalid settings.json after edit | "Claude Code settings.json validation failed after edit." | Fix JSON syntax/schema |

### Execution Phase Errors (call)

| Error Type | Condition | Message | Recovery |
|------------|-----------|---------|----------|
| Runtime Race | File modified between validation and execution | "File has been unexpectedly modified. Read it again." | Re-read and retry |
| Patch Failed | String not found during patching | "String not found in file. Failed to apply edit." | Re-read and verify content |
| No Change | Original === updated after patching | "Original and edited file match exactly. Failed to apply edit." | Verify edit logic |
| Overlapping Edit | old_string is substring of previous new_string | "Cannot edit file: old_string is a substring of a new_string from a previous edit." | Reorder or separate edits |

---

## Complete validateInput Flow

```javascript
// ============================================
// Complete validateInput implementation
// Location: chunks.115.mjs:814-941
// ============================================

async validateInput({ file_path, old_string, new_string, replace_all = false }, context) {
  // ═══════════════════════════════════════════════════════════
  // STAGE 1: Basic Input Validation
  // ═══════════════════════════════════════════════════════════

  // Check 1.1: No-op detection
  if (old_string === new_string) {
    return { result: false, errorCode: 1,
      message: "No changes to make: old_string and new_string are exactly the same." };
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 2: Permission Check
  // ═══════════════════════════════════════════════════════════

  const resolvedPath = resolvePath(file_path);
  const appState = await context.getAppState();

  // Check 2.1: Deny rules
  if (matchPathRule(resolvedPath, appState.toolPermissionContext, "edit", "deny") !== null) {
    return { result: false, errorCode: 2,
      message: "File is in a directory that is denied by your permission settings." };
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 3: File Existence Handling
  // ═══════════════════════════════════════════════════════════

  const fs = getFileSystem();

  // Check 3.1: Existing file with empty old_string (create attempt)
  if (fs.existsSync(resolvedPath) && old_string === "") {
    const existingContent = fs.readFileSync(resolvedPath, { encoding: getEncoding(resolvedPath) })
      .replaceAll("\r\n", "\n").trim();

    if (existingContent !== "") {
      return { result: false, errorCode: 3,
        message: "Cannot create new file - file already exists." };
    }
    // Empty file - allow creation (overwrite)
    return { result: true };
  }

  // Check 3.2: New file creation (empty old_string, file doesn't exist)
  if (!fs.existsSync(resolvedPath) && old_string === "") {
    return { result: true };  // Allow new file creation
  }

  // Check 3.3: File doesn't exist (non-empty old_string)
  if (!fs.existsSync(resolvedPath)) {
    let message = "File does not exist.";
    const cwd = getCurrentWorkingDirectory();
    const originalCwd = getOriginalWorkingDirectory();

    if (cwd !== originalCwd) {
      message += ` Current working directory: ${cwd}`;
    }

    // Try to suggest similar file name
    const similarFile = findSimilarFileName(resolvedPath);
    if (similarFile) {
      message += ` Did you mean ${similarFile}?`;
    }

    return { result: false, errorCode: 4, message };
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 4: File Type Check
  // ═══════════════════════════════════════════════════════════

  // Check 4.1: Jupyter notebook
  if (resolvedPath.endsWith(".ipynb")) {
    return { result: false, errorCode: 5,
      message: "File is a Jupyter Notebook. Use the NotebookEdit to edit this file." };
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 5: Read State Verification
  // ═══════════════════════════════════════════════════════════

  const readRecord = context.readFileState.get(resolvedPath);

  // Check 5.1: File must have been read
  if (!readRecord) {
    return { result: false, errorCode: 6,
      meta: { isFilePathAbsolute: String(isAbsolutePath(file_path)) },
      message: "File has not been read yet. Read it first before writing to it." };
  }

  // Check 5.2: File modification since read
  if (readRecord) {
    const currentMtime = getFileModifiedTime(resolvedPath);

    if (currentMtime > readRecord.timestamp) {
      // Timestamp changed - check if content actually changed

      if (readRecord.offset === undefined && readRecord.limit === undefined) {
        // Full read - can verify content
        const currentContent = fs.readFileSync(resolvedPath, { encoding: getEncoding(resolvedPath) })
          .replaceAll("\r\n", "\n");

        if (currentContent !== readRecord.content) {
          // Content actually changed
          return { result: false, errorCode: 7,
            message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it." };
        }
        // Content matches - allow (timestamp change was false positive)
      } else {
        // Partial read - cannot verify content, must reject
        return { result: false, errorCode: 7,
          message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it." };
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 6: String Matching
  // ═══════════════════════════════════════════════════════════

  const fileContent = fs.readFileSync(resolvedPath, { encoding: getEncoding(resolvedPath) })
    .replaceAll("\r\n", "\n");

  // Check 6.1: Find old_string in file (with quote normalization fallback)
  const actualOldString = findStringWithQuoteNormalization(fileContent, old_string);

  if (!actualOldString) {
    return { result: false, errorCode: 8,
      meta: { isFilePathAbsolute: String(isAbsolutePath(file_path)) },
      message: `String to replace not found in file.\nString: ${old_string}` };
  }

  // Check 6.2: Uniqueness check
  const matchCount = fileContent.split(actualOldString).length - 1;

  if (matchCount > 1 && !replace_all) {
    return { result: false, errorCode: 9,
      meta: { isFilePathAbsolute: String(isAbsolutePath(file_path)), actualOldString },
      message: `Found ${matchCount} matches of the string to replace, but replace_all is false. To replace all occurrences, set replace_all to true. To replace only one occurrence, please provide more context to uniquely identify the instance.\nString: ${old_string}` };
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 7: Settings.json Validation (Special Case)
  // ═══════════════════════════════════════════════════════════

  // Check 7.1: If editing settings.json, validate result would be valid
  const settingsValidation = validateSettingsJsonEdit(resolvedPath, fileContent, () => {
    return replace_all
      ? fileContent.replaceAll(actualOldString, new_string)
      : fileContent.replace(actualOldString, new_string);
  });

  if (settingsValidation !== null) {
    return settingsValidation;  // Returns errorCode: 10 if invalid
  }

  // ═══════════════════════════════════════════════════════════
  // SUCCESS: All validations passed
  // ═══════════════════════════════════════════════════════════

  return {
    result: true,
    meta: { actualOldString }  // Pass normalized string to call()
  };
}
```

---

## Settings.json Special Validation

```javascript
// ============================================
// validateSettingsJsonEdit - uy2
// Location: chunks.114.mjs:2913-2929
// ============================================

function validateSettingsJsonEdit(filePath, currentContent, getNewContent) {
  // Check if this is a settings file
  if (!isSettingsJsonFile(filePath)) {
    return null;  // Not a settings file, no special validation
  }

  // Validate current content is valid JSON
  if (!validateSettingsJson(currentContent).isValid) {
    return null;  // Current file is invalid, allow edit attempt
  }

  // Get new content after edit
  const newContent = getNewContent();
  const validation = validateSettingsJson(newContent);

  if (!validation.isValid) {
    return {
      result: false,
      message: `Claude Code settings.json validation failed after edit:
${validation.error}

Full schema:
${validation.fullSchema}
IMPORTANT: Do not update the env unless explicitly instructed to do so.`,
      errorCode: 10
    };
  }

  return null;  // Valid
}

// ============================================
// isSettingsJsonFile - h$0
// Location: chunks.148.mjs:2039-2044
// ============================================

function isSettingsJsonFile(filePath) {
  const resolvedPath = resolvePath(filePath);
  const normalizedPath = normalizePath(resolvedPath);

  // Check for user/project settings files
  if (normalizedPath.endsWith("/.claude/settings.json") ||
      normalizedPath.endsWith("/.claude/settings.local.json")) {
    return true;
  }

  // Check for enterprise settings paths
  return getEnterpriseSettingsPaths().some(
    (path) => normalizePath(path) === normalizedPath
  );
}
```

---

## Exception Handling in call()

### Runtime Race Condition Protection

```javascript
// ============================================
// Runtime modification check
// Location: chunks.115.mjs:974-979
// ============================================

async call({ file_path, old_string, new_string, replace_all = false }, context, ...) {
  const resolvedPath = resolvePath(file_path);
  const originalContent = fs.existsSync(resolvedPath) ? readFileNormalized(resolvedPath) : "";

  // Double-check file hasn't been modified since validateInput
  if (fs.existsSync(resolvedPath)) {
    const currentMtime = getFileModifiedTime(resolvedPath);
    const readRecord = context.readFileState.get(resolvedPath);

    if (!readRecord || currentMtime > readRecord.timestamp) {
      // Race condition: file modified between validation and execution
      // Only allow if full read AND content matches
      if (!(readRecord &&
            readRecord.offset === undefined &&
            readRecord.limit === undefined &&
            originalContent === readRecord.content)) {
        throw Error("File has been unexpectedly modified. Read it again before attempting to write it.");
      }
    }
  }

  // ... rest of execution
}
```

### Patch Application Errors

```javascript
// ============================================
// QbA - Patch application with error handling
// Location: chunks.113.mjs:1762-1770
// ============================================

function applyEditsAndGeneratePatch({ filePath, fileContents, edits }) {
  let currentContent = fileContents;
  const appliedNewStrings = [];

  for (const edit of edits) {
    const trimmedOldString = edit.old_string.replace(/\n+$/, "");

    // Error 1: Overlapping edit detection
    for (const previousNewString of appliedNewStrings) {
      if (trimmedOldString !== "" && previousNewString.includes(trimmedOldString)) {
        throw Error("Cannot edit file: old_string is a substring of a new_string from a previous edit.");
      }
    }

    const beforeEdit = currentContent;

    // Apply edit
    currentContent = edit.old_string === ""
      ? edit.new_string  // New file creation
      : replaceString(currentContent, edit.old_string, edit.new_string, edit.replace_all);

    // Error 2: String not found
    if (currentContent === beforeEdit) {
      throw Error("String not found in file. Failed to apply edit.");
    }

    appliedNewStrings.push(edit.new_string);
  }

  // Error 3: No actual change
  if (currentContent === fileContents) {
    throw Error("Original and edited file match exactly. Failed to apply edit.");
  }

  return { patch, updatedFile: currentContent };
}
```

---

## Input Equivalence Checking

The Edit tool uses `inputsEquivalent()` to detect duplicate/equivalent edit requests:

```javascript
// ============================================
// inputsEquivalent - $S2
// Location: chunks.113.mjs:1937-1945
// ============================================

function areEditsEquivalent(editA, editB) {
  // Different file paths = not equivalent
  if (editA.file_path !== editB.file_path) {
    return false;
  }

  // Check if edits match exactly
  if (editA.edits.length === editB.edits.length &&
      editA.edits.every((edit, index) => {
        const other = editB.edits[index];
        return other !== undefined &&
               edit.old_string === other.old_string &&
               edit.new_string === other.new_string &&
               edit.replace_all === other.replace_all;
      })) {
    return true;
  }

  // Fallback: Check if edits would produce same result
  const fileContent = fs.existsSync(editA.file_path)
    ? readFileNormalized(editA.file_path)
    : "";

  return editsProduceSameResult(editA.edits, editB.edits, fileContent);
}
```

This prevents:
- Duplicate edit requests being executed twice
- Model retrying same edit when first attempt failed validation

---

## Similar File Name Suggestion

When file doesn't exist, the tool suggests similar files:

```javascript
// ============================================
// findSimilarFileName - C71
// Location: chunks.148.mjs:2812-2825
// ============================================

function findSimilarFileName(filePath) {
  const fs = getFileSystem();

  try {
    const parentDir = getParentDirectory(filePath);
    const baseName = getFileNameWithoutExtension(filePath, getExtension(filePath));

    if (!fs.existsSync(parentDir)) {
      return undefined;  // Parent directory doesn't exist
    }

    // Find files with same base name (different extension or case)
    const similarFile = fs.readdirSync(parentDir)
      .filter((entry) =>
        getFileNameWithoutExtension(entry.name, getExtension(entry.name)) === baseName &&
        joinPath(parentDir, entry.name) !== filePath
      )[0];

    return similarFile?.name;
  } catch (error) {
    logError(error);
    return undefined;
  }
}
```

Example suggestions:
- `file.js` doesn't exist → "Did you mean file.ts?"
- `README.MD` doesn't exist → "Did you mean README.md?"

---

## Error Recovery Guide

| Error Code | Recovery Steps |
|------------|----------------|
| 1 | Verify `old_string` ≠ `new_string`; make actual changes |
| 2 | Check `.claude/settings.json` permissions; modify deny rules |
| 3 | Use Read tool to get existing content; edit with non-empty `old_string` |
| 4 | Verify file path; check suggested similar files; ensure file exists |
| 5 | Use NotebookEdit tool instead of Edit for .ipynb files |
| 6 | Call Read tool on the file first; then retry Edit |
| 7 | Call Read tool again to get fresh content; then retry Edit |
| 8 | Verify exact string exists in file; check whitespace/quotes; copy from Read output |
| 9 | Add more context to make `old_string` unique; OR set `replace_all=true` |
| 10 | Fix JSON syntax in settings.json edit; ensure valid schema |
| Runtime | File was modified during edit; re-read and retry |

---

## Telemetry Events

Edit tool operations trigger telemetry events:

```javascript
// Success event
l("tengu_tool_use_success", {
  toolName: "Edit",
  durationMs: executionTime,
  toolResultSizeBytes: resultSize
});

// CLAUDE.md special tracking
if (resolvedPath.endsWith("/CLAUDE.md")) {
  l("tengu_write_claudemd", {});
}

// Error events use tengu_tool_use_error with appropriate errorCode
```
