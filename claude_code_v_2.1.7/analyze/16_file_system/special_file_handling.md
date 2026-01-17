# Special File Type Handling

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

## Overview

Claude Code handles several special file types beyond plain text:
- **Jupyter Notebooks (.ipynb)** - Parsed cell-by-cell with outputs
- **Images** (PNG, JPG, GIF, WebP) - Base64 encoded for multimodal processing
- **PDFs** - Page-by-page extraction with text and visual content
- **Binary files** - Detected and rejected for text-based operations

---

## 1. Jupyter Notebooks (.ipynb)

### Read Handling

```javascript
// ============================================
// parseNotebookCells - Parse Jupyter notebook cells
// Location: chunks.85.mjs:2845-2858
// ============================================

// ORIGINAL (for source lookup):
function gA2(A, Q) {
  let B = Y4(A),
    G = vA().readFileSync(B, { encoding: "utf-8" }),
    Z = AQ(G),
    Y = Z.metadata.language_info?.name ?? "python";
  if (Q) {
    let J = Z.cells.find((X) => X.id === Q);
    if (!J) throw Error(`Cell with ID "${Q}" not found in notebook`);
    return [hA2(J, Z.cells.indexOf(J), Y, !0)]
  }
  return Z.cells.map((J, X) => hA2(J, X, Y, !1))
}

// READABLE (for understanding):
function parseNotebookCells(filePath, cellId) {
  let resolvedPath = resolvePath(filePath);
  let fileContent = getFileSystem().readFileSync(resolvedPath, { encoding: "utf-8" });
  let notebook = parseJSON(fileContent);
  let language = notebook.metadata.language_info?.name ?? "python";

  // If specific cell ID requested
  if (cellId) {
    let cell = notebook.cells.find((c) => c.id === cellId);
    if (!cell) {
      throw Error(`Cell with ID "${cellId}" not found in notebook`);
    }
    return [formatCell(cell, notebook.cells.indexOf(cell), language, true)];
  }

  // Return all cells
  return notebook.cells.map((cell, index) => formatCell(cell, index, language, false));
}

// Mapping: gA2→parseNotebookCells, A→filePath, Q→cellId,
// B→resolvedPath, G→fileContent, Z→notebook, Y→language,
// AQ→parseJSON, hA2→formatCell, Y4→resolvePath
```

### Read Tool Notebook Handling

```javascript
// ============================================
// Read Tool - Notebook handling
// Location: chunks.86.mjs:680-711
// ============================================

// READABLE pseudocode:
if (extension === "ipynb") {
  let cells = parseNotebookCells(resolvedPath);
  let content = serializeCells(cells);

  // Size limit check
  if (content.length > MAX_FILE_SIZE_BYTES) {
    throw Error(`Notebook content (${formatSize(content.length)}) exceeds maximum.
      Use Bash with jq to read specific portions:
      cat "${filePath}" | jq '.cells[:20]' # First 20 cells
      cat "${filePath}" | jq '.cells[100:120]' # Cells 100-120
      cat "${filePath}" | jq '.cells | length' # Count total cells`);
  }

  // Token validation
  await validateTokens(content, extension, { maxSizeBytes, maxTokens });

  // Record in readFileState
  readFileState.set(resolvedPath, {
    content,
    timestamp: getFileModifiedTime(resolvedPath),
    offset,
    limit
  });

  // Add to memory attachment triggers
  sessionContext.nestedMemoryAttachmentTriggers?.add(resolvedPath);

  return {
    data: {
      type: "notebook",
      file: { filePath, cells }
    }
  };
}
```

### Edit Redirection

When trying to edit a notebook with the Edit tool, it redirects to NotebookEdit:

```javascript
// ============================================
// Edit Tool - Notebook redirection
// Location: chunks.115.mjs:867-872
// ============================================

// ORIGINAL (for source lookup):
if (Y.endsWith(".ipynb")) return {
  result: !1,
  behavior: "ask",
  message: `File is a Jupyter Notebook. Use the ${tq} to edit this file.`,
  errorCode: 5
};

// READABLE (for understanding):
if (resolvedPath.endsWith(".ipynb")) {
  return {
    result: false,
    behavior: "ask",
    message: `File is a Jupyter Notebook. Use the NotebookEdit to edit this file.`,
    errorCode: 5
  };
}

// Mapping: Y→resolvedPath, tq→"NotebookEdit"
```

### NotebookEdit Tool

The NotebookEdit tool validates that the file is actually a notebook:

```javascript
// ============================================
// NotebookEdit - File type validation
// Location: chunks.115.mjs:2316-2319
// ============================================

// ORIGINAL (for source lookup):
if (Su5(Z) !== ".ipynb") return {
  result: !1,
  message: "File must be a Jupyter notebook (.ipynb file). For editing other file types, use the FileEdit tool.",
  errorCode: 1
};

// READABLE (for understanding):
if (getExtension(resolvedPath) !== ".ipynb") {
  return {
    result: false,
    message: "File must be a Jupyter notebook (.ipynb file). For editing other file types, use the FileEdit tool.",
    errorCode: 1
  };
}

// Mapping: Su5→getExtension, Z→resolvedPath
```

---

## 2. Images

### Supported Extensions

```javascript
// ============================================
// IMAGE_EXTENSIONS - Supported image formats
// Location: chunks.86.mjs:468
// ============================================

// E71 is a Set containing supported image extensions
E71 = new Set(["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico", "tiff", "tif"])

// READABLE (for understanding):
IMAGE_EXTENSIONS = new Set([
  "png",    // PNG images
  "jpg",    // JPEG images
  "jpeg",   // JPEG alternate extension
  "gif",    // GIF images (including animated)
  "webp",   // WebP images
  "bmp",    // Bitmap images
  "ico",    // Icon files
  "tiff",   // TIFF images
  "tif"     // TIFF alternate extension
])
```

### Read Handling

```javascript
// ============================================
// readImageFile - Read and encode image
// Location: chunks.86.mjs:456-459
// ============================================

// ORIGINAL (for source lookup):
async function KY0(A, Q = WY0(), B = A.split(".").pop()?.toLowerCase() || "png") {
  let G = await ye8(A, B);
  if (Math.ceil(G.file.base64.length * 0.125) > Q) return await xe8(A, Q);
  return G
}

// READABLE (for understanding):
async function readImageFile(filePath, maxTokens = getMaxTokens(), extension = getExtension(filePath)) {
  // Read and encode image
  let imageResult = await readImageAsBase64(filePath, extension);

  // Check if encoded size exceeds token limit
  // Base64 is ~33% larger, so actual byte count is length * 0.125
  let byteCount = Math.ceil(imageResult.file.base64.length * 0.125);

  if (byteCount > maxTokens) {
    // Resize image to fit within limits
    return await resizeImageForTokenLimit(filePath, maxTokens);
  }

  return imageResult;
}

// Mapping: KY0→readImageFile, A→filePath, Q→maxTokens, B→extension,
// WY0→getMaxTokens, ye8→readImageAsBase64, xe8→resizeImageForTokenLimit
```

### Read Tool Image Handling

```javascript
// ============================================
// Read Tool - Image handling
// Location: chunks.86.mjs:713-730
// ============================================

// READABLE pseudocode:
if (IMAGE_EXTENSIONS.has(extension)) {
  let imageResult = await readImageFile(resolvedPath, maxTokens, extension);

  // Add to memory attachment triggers
  sessionContext.nestedMemoryAttachmentTriggers?.add(resolvedPath);

  // Log operation
  logOperation({
    operation: "read",
    tool: "FileReadTool",
    filePath: resolvedPath,
    content: imageResult.file.base64
  });

  // Get dimension info for system message
  let dimensionMessage = imageResult.file.dimensions
    ? formatDimensions(imageResult.file.dimensions)
    : null;

  return {
    data: imageResult,
    // Add dimension info as system message if available
    ...(dimensionMessage && {
      newMessages: [createMessage({ content: dimensionMessage, isMeta: true })]
    })
  };
}
```

### Image Tool Result Format

```javascript
// ============================================
// mapToolResultToToolResultBlockParam - Image result
// Location: chunks.86.mjs:798-808
// ============================================

// READABLE (for understanding):
case "image":
  return {
    tool_use_id: toolUseId,
    type: "tool_result",
    content: [{
      type: "image",
      source: {
        type: "base64",
        data: result.file.base64,
        media_type: result.file.type  // e.g., "image/png"
      }
    }]
  };
```

---

## 3. PDFs

### Capability Check

```javascript
// ============================================
// PDF capability and extension check
// Location: chunks.55.mjs:1170-1172, 1197
// ============================================

// ORIGINAL (for source lookup):
function a01(A) {
  let Q = A.startsWith(".") ? A.slice(1) : A;
  return sG8.has(Q.toLowerCase())
}

sG8 = new Set(["pdf"])

// READABLE (for understanding):
function isPDFExtension(extension) {
  let ext = extension.startsWith(".") ? extension.slice(1) : extension;
  return PDF_EXTENSIONS.has(ext.toLowerCase());
}

PDF_EXTENSIONS = new Set(["pdf"])

// Mapping: a01→isPDFExtension, sG8→PDF_EXTENSIONS
```

### Read Handling

```javascript
// ============================================
// readPDFFile - Read PDF as base64
// Location: chunks.55.mjs:1174-1188
// ============================================

// ORIGINAL (for source lookup):
async function TEB(A) {
  let Q = vA(),
    G = Q.statSync(A).size;
  if (G === 0) throw Error(`PDF file is empty: ${A}`);
  if (G > mr1) throw Error(`PDF file exceeds maximum allowed size of ${xD(mr1)}.`);
  let Y = Q.readFileBytesSync(A).toString("base64");
  return {
    type: "pdf",
    file: {
      filePath: A,
      base64: Y,
      originalSize: G
    }
  }
}

// READABLE (for understanding):
async function readPDFFile(filePath) {
  let fs = getFileSystem();
  let fileSize = fs.statSync(filePath).size;

  // Validate file is not empty
  if (fileSize === 0) {
    throw Error(`PDF file is empty: ${filePath}`);
  }

  // Check against maximum allowed size
  if (fileSize > MAX_PDF_SIZE) {
    throw Error(`PDF file exceeds maximum allowed size of ${formatSize(MAX_PDF_SIZE)}.`);
  }

  // Read file as base64
  let base64Content = fs.readFileBytesSync(filePath).toString("base64");

  return {
    type: "pdf",
    file: {
      filePath: filePath,
      base64: base64Content,
      originalSize: fileSize
    }
  };
}

// Mapping: TEB→readPDFFile, A→filePath, Q→fs, G→fileSize,
// mr1→MAX_PDF_SIZE, Y→base64Content, xD→formatSize
```

### Read Tool PDF Handling

```javascript
// ============================================
// Read Tool - PDF handling
// Location: chunks.86.mjs:732-752
// ============================================

// READABLE pseudocode:
if (isPDFEnabled() && isPDFExtension(extension)) {
  let pdfResult = await readPDFFile(resolvedPath);

  // Log operation
  logOperation({
    operation: "read",
    tool: "FileReadTool",
    filePath: resolvedPath,
    content: pdfResult.file.base64
  });

  return {
    data: pdfResult,
    // Add document content block for visual processing
    newMessages: [createMessage({
      content: [{
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: pdfResult.file.base64
        }
      }],
      isMeta: true
    })]
  };
}
```

### PDF Tool Result Format

```javascript
// ============================================
// mapToolResultToToolResultBlockParam - PDF result
// Location: chunks.86.mjs:811-814
// ============================================

// READABLE (for understanding):
case "pdf":
  return {
    tool_use_id: toolUseId,
    type: "tool_result",
    content: `PDF file read: ${result.file.filePath} (${formatSize(result.file.originalSize)})`
  };
```

---

## 4. Binary File Detection

### Binary Extension Set

```javascript
// ============================================
// BINARY_EXTENSIONS - Known binary file types
// Location: chunks.86.mjs:470
// ============================================

// Re8 is a Set containing known binary extensions
Re8 = new Set([
  "exe", "dll", "so", "dylib",        // Executables/libraries
  "zip", "tar", "gz", "rar", "7z",    // Archives
  "bin", "dat", "db", "sqlite",       // Data files
  "mp3", "wav", "flac", "aac",        // Audio
  "mp4", "avi", "mkv", "mov",         // Video
  "woff", "woff2", "ttf", "otf",      // Fonts
  "pyc", "pyo",                       // Python bytecode
  "class", "jar",                     // Java
  // ... more binary extensions
])
```

### Validation

```javascript
// ============================================
// Binary file validation in Read Tool
// Location: chunks.86.mjs:642-646
// ============================================

// ORIGINAL (for source lookup):
if (Re8.has(D.slice(1)) && !(IIA() && a01(D))) return {
  result: !1,
  message: `This tool cannot read binary files. The file appears to be a binary ${D} file. Please use appropriate tools for binary file analysis.`,
  errorCode: 4
};

// READABLE (for understanding):
if (BINARY_EXTENSIONS.has(extension.slice(1)) && !(isPDFEnabled() && isPDFExtension(extension))) {
  return {
    result: false,
    message: `This tool cannot read binary files. The file appears to be a binary ${extension} file. Please use appropriate tools for binary file analysis.`,
    errorCode: 4
  };
}

// Mapping: Re8→BINARY_EXTENSIONS, D→extension, IIA→isPDFEnabled, a01→isPDFExtension
```

**Key insight:** PDFs are technically binary but are explicitly handled when PDF support is enabled.

---

## 5. Large File Handling

### Size Limits

```javascript
// ============================================
// File size constants
// Location: chunks.148.mjs:2949, chunks.86.mjs:464
// ============================================

// Maximum file size in bytes (256 KB)
AxA = 262144

// Maximum tokens for file reading
Me8 = 25000

// READABLE (for understanding):
MAX_FILE_SIZE_BYTES = 262144  // 256 KB
MAX_FILE_TOKENS = 25000

// Mapping: AxA→MAX_FILE_SIZE_BYTES, Me8→MAX_FILE_TOKENS
```

### Token Validation

```javascript
// ============================================
// validateTokens - Check file content against token limit
// Location: chunks.86.mjs:387-395
// ============================================

// READABLE pseudocode:
async function validateTokens(content, extension, { maxSizeBytes = MAX_FILE_SIZE_BYTES, maxTokens }) {
  let tokenLimit = maxTokens ?? getMaxTokens();

  // Skip size check for images (handled separately)
  if (!IMAGE_EXTENSIONS.has(extension) && content.length > maxSizeBytes) {
    throw Error(getFileSizeError(content.length, maxSizeBytes));
  }

  // Token counting would happen here for certain file types
}
```

### Size Error Message

```javascript
// ============================================
// getFileSizeError - Format size error message
// Location: chunks.86.mjs:487
// ============================================

// ORIGINAL (for source lookup):
DY0 = (A, Q = AxA) => `File content (${xD(A)}) exceeds maximum allowed size (${xD(Q)}). Please use offset and limit parameters to read specific portions of the file, or use the GrepTool to search for specific content.`

// READABLE (for understanding):
getFileSizeError = (actualSize, maxSize = MAX_FILE_SIZE_BYTES) =>
  `File content (${formatSize(actualSize)}) exceeds maximum allowed size (${formatSize(maxSize)}). ` +
  `Please use offset and limit parameters to read specific portions of the file, ` +
  `or use the GrepTool to search for specific content.`

// Mapping: DY0→getFileSizeError, A→actualSize, Q→maxSize, xD→formatSize
```

### Token Limit Error

```javascript
// ============================================
// MaxFileReadTokenExceededError - Token limit error
// Location: chunks.86.mjs:511-519
// ============================================

// ORIGINAL (for source lookup):
$71 = class $71 extends Error {
  tokenCount;
  maxTokens;
  constructor(A, Q) {
    super(`File content (${A} tokens) exceeds maximum allowed tokens (${Q}). Please use offset and limit parameters to read specific portions of the file, or use the GrepTool to search for specific content.`);
    this.tokenCount = A;
    this.maxTokens = Q;
    this.name = "MaxFileReadTokenExceededError"
  }
}

// READABLE (for understanding):
MaxFileReadTokenExceededError = class extends Error {
  tokenCount;
  maxTokens;

  constructor(tokenCount, maxTokens) {
    super(`File content (${tokenCount} tokens) exceeds maximum allowed tokens (${maxTokens}). ` +
          `Please use offset and limit parameters to read specific portions of the file, ` +
          `or use the GrepTool to search for specific content.`);
    this.tokenCount = tokenCount;
    this.maxTokens = maxTokens;
    this.name = "MaxFileReadTokenExceededError";
  }
}

// Mapping: $71→MaxFileReadTokenExceededError, A→tokenCount, Q→maxTokens
```

---

## 6. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Special File Type Handling                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                       Read Tool                                  │    │
│  │                                                                  │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │    │
│  │  │ Text Files  │  │  Notebooks  │  │   Images    │             │    │
│  │  │ L12()       │  │  gA2()      │  │   KY0()     │             │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘             │    │
│  │                                                                  │    │
│  │  ┌─────────────┐  ┌─────────────┐                              │    │
│  │  │    PDFs     │  │   Binary    │                              │    │
│  │  │   TEB()     │  │  (reject)   │                              │    │
│  │  └─────────────┘  └─────────────┘                              │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Extension Sets                                │    │
│  │                                                                  │    │
│  │  E71 (Images)     Re8 (Binary)      sG8 (PDFs)                  │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │    │
│  │  │ png, jpg,   │  │ exe, dll,   │  │    pdf      │             │    │
│  │  │ gif, webp,  │  │ zip, mp3,   │  │             │             │    │
│  │  │ bmp, ico... │  │ mp4, pyc... │  │             │             │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘             │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Size Limits                                   │    │
│  │                                                                  │    │
│  │  AxA (Max Bytes)     Me8 (Max Tokens)     mr1 (Max PDF)         │    │
│  │  ┌─────────────┐    ┌─────────────┐      ┌─────────────┐       │    │
│  │  │  262144     │    │   25000     │      │ (configured)│       │    │
│  │  │  (256 KB)   │    │  tokens     │      │             │       │    │
│  │  └─────────────┘    └─────────────┘      └─────────────┘       │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                  NotebookEdit Tool                               │    │
│  │                                                                  │    │
│  │  - Only allows .ipynb files                                     │    │
│  │  - Cell-based editing                                           │    │
│  │  - Validates notebook structure                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Error Codes Summary

| Code | Context | Condition | Message |
|------|---------|-----------|---------|
| 1 | Read | Permission denied | "File is in a directory that is denied..." |
| 2 | Read | File not found | "File does not exist" |
| 4 | Read | Binary file | "This tool cannot read binary files" |
| 5 | Read | Empty image | "Empty image files cannot be processed" |
| 6 | Read | File too large | Size/token exceeded |
| 5 | Edit | Notebook file | "Use NotebookEdit to edit this file" |
| 1 | NotebookEdit | Not .ipynb | "File must be a Jupyter notebook" |

---

## 8. Key Functions Summary

Key functions in this document:

- `parseNotebookCells` (gA2) - Parse Jupyter notebook cells
- `readImageFile` (KY0) - Read and optionally resize image
- `readPDFFile` (TEB) - Read PDF as base64
- `isPDFExtension` (a01) - Check if extension is PDF
- `isPDFEnabled` (IIA) - Check if PDF support is enabled
- `getFileSizeError` (DY0) - Format size error message
- `MaxFileReadTokenExceededError` ($71) - Token limit error class
- `getMaxTokens` (WY0) - Get maximum allowed tokens
- `IMAGE_EXTENSIONS` (E71) - Set of supported image extensions
- `BINARY_EXTENSIONS` (Re8) - Set of known binary extensions
- `PDF_EXTENSIONS` (sG8) - Set of PDF extensions
- `MAX_FILE_SIZE_BYTES` (AxA) - Maximum file size (256KB)

---

## 9. Cross-References

- [implementation.md](./implementation.md) - Core file system operations
- [tool_integration.md](./tool_integration.md) - Tool integration details
- [../05_tools/builtin_tools.md](../05_tools/builtin_tools.md) - Tool definitions
