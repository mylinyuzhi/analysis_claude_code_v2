# Read Tool - Deep Analysis (Claude Code 2.1.76)

> Complete analysis of the Read file system tool: file reading, PDF support, image handling, notebook parsing, and encoding detection.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `FileReadTool` (L9) - Read tool definition object - chunks.90.mjs:2052
- `TOOL_NAME_READ` (s7) - Tool name constant "Read" - chunks.56.mjs:173
- `fileReadInputSchema` (tm9) - Input schema definition - chunks.90.mjs:2000
- `resolvePath` (L4) - Path resolution function - chunks.10.mjs
- `checkReadPermissions` (gt) - Permission checking - chunks.90.mjs:2113
- `detectEncoding` (AX) - Encoding detection - chunks.134.mjs
- `readFileSyncWithEncoding` ($J) - Encoding-aware file reading - chunks.134.mjs
- `analyzeConversationMemoryUsage` - Memory usage analysis
- `MAX_FILE_SIZE_BYTES` - File size limit constant
- `MAX_PDF_PAGES_PER_REQUEST` (P36) - PDF page limit constant (20) - chunks.85.mjs:2470
- `MIN_PAGES_FOR_PAGE_RANGE_PROMPT` (TX1) - Min pages threshold (10) - chunks.85.mjs:2472
- `getPdfPageCount` (GP1) - PDF page count - chunks.90.mjs
- `extractPdfPages` (UN8) - PDF page extraction - chunks.90.mjs
- `readPdfAsBase64` (N34) - PDF base64 encoding - chunks.90.mjs

---

## Architecture Overview

```
LLM generates Read tool_use { file_path, offset?, limit?, pages? }
         │
         ▼
 validateInput()
 ├── Path resolution (g4)
 ├── Permission check (ro)
 ├── File existence check
 └── File type detection
         │
         ▼
 call() execution
 ├── Determine content type
 │   ├── Image (.png, .jpg, .gif, etc.)
 │   ├── PDF (.pdf)
 │   ├── Notebook (.ipynb)
 │   └── Text (default)
 │
 ├── Content extraction
 │   ├── Image → base64 encoding
 │   ├── PDF → pdf-parse library
 │   ├── Notebook → cell parsing
 │   └── Text → encoding-aware read
 │
 ├── Line range handling (offset/limit)
 ├── Memory usage analysis (Ia4)
 └── Update readFileState cache
         │
         ▼
 Return { data: { content, type, ... } }
         │
         ▼
 UI Rendering (line-numbered display)
```

---

## 1. Tool Definition Object

### FileReadTool - Main file reading tool

**What it does:** Provides the primary interface for reading files from the local filesystem, with support for multiple content types (text, images, PDFs, Jupyter notebooks) and intelligent encoding detection.

**How it works:**

```javascript
// ============================================
// FileReadTool - Main file reading tool definition
// Location: chunks.146.mjs:1706-1900
// ============================================

// ORIGINAL (for source lookup):
i5 = {
    name: Jq,  // "Read"
    maxResultSizeChars: 1e5,
    strict: !0,
    async description() { return "Reads a file from the local filesystem" },
    async prompt() { return getReadToolPrompt() },
    userFacingName: getReadToolUserFacingName,
    getToolUseSummary: getReadToolSummary,
    getActivityDescription(A) {
        let q = getReadToolSummary(A);
        return q ? `Reading ${q}` : "Reading file"
    },
    isEnabled() { return !0 },
    get inputSchema() { return OmY() },  // fileReadInputSchema
    get outputSchema() { return getReadOutputSchema() },
    isConcurrencySafe() { return !0 },  // Read is concurrency-safe
    isReadOnly() { return !0 },          // Does not mutate filesystem
    getPath(A) { return A.file_path },
    async checkPermissions(A, q) {
        let K = await q.getAppState();
        return checkReadPermissions(i5, A, K.toolPermissionContext)
    },
    renderToolUseMessage: renderReadToolUseMessage,
    renderToolResultMessage: renderReadToolResult,
    // ... other render methods
}

// READABLE (for understanding):
const FileReadTool = {
    name: "Read",
    maxResultSizeChars: 100000,
    strict: true,
    isConcurrencySafe: true,   // Multiple reads can run in parallel
    isReadOnly: true,           // Never modifies the filesystem

    async validateInput({ file_path, offset, limit, pages }, context) {
        // Resolve to absolute path
        let absolutePath = resolvePath(file_path);

        // Check permissions
        if (!checkReadPermissions(absolutePath, context)) {
            return { result: false, message: "Permission denied" };
        }

        // Check file existence
        if (!fs.existsSync(absolutePath)) {
            let suggestion = findSimilarFile(absolutePath);
            return { result: false, message: `File not found${suggestion ? `. Did you mean ${suggestion}?` : ""}` };
        }

        // Validate PDF pages parameter
        if (pages && !absolutePath.endsWith('.pdf')) {
            return { result: false, message: "pages parameter only valid for PDF files" };
        }

        return { result: true };
    },

    async call({ file_path, offset, limit, pages }, context) {
        let absolutePath = resolvePath(file_path);
        let extension = path.extname(absolutePath).toLowerCase();

        // Route to appropriate handler based on file type
        if (isImageFile(extension)) {
            return handleImageRead(absolutePath);
        } else if (extension === '.pdf') {
            return handlePdfRead(absolutePath, pages);
        } else if (extension === '.ipynb') {
            return handleNotebookRead(absolutePath, offset, limit);
        } else {
            return handleTextRead(absolutePath, offset, limit, context);
        }
    }
}

// Mapping: i5→FileReadTool, s7→TOOL_NAME_READ, OmY→fileReadInputSchema,
//          g4→resolvePath, ro→checkReadPermissions
```

**Key properties:**
- `isConcurrencySafe: true` — Multiple Read operations can run in parallel without conflicts
- `isReadOnly: true` — Never modifies filesystem, safe for automatic permission allow
- `maxResultSizeChars: 100000` — Caps output to prevent context overflow

---

## 2. Input Schema Definition

### readInputSchema (tm9) - Zod schema for Read tool

**What it does:** Defines the complete input interface for the Read tool, including optional line range and PDF page parameters.

```javascript
// ============================================
// readInputSchema - Zod input schema definition
// Location: chunks.90.mjs:2000-2004
// ============================================

// ORIGINAL (for source lookup):
tm9 = F6(() => C.strictObject({
    file_path: C.string().describe("The absolute path to the file to read"),
    offset: C.number().optional().describe("The line number to start reading from. Only provide if the file is too large to read at once"),
    limit: C.number().optional().describe("The number of lines to read. Only provide if the file is too large to read at once."),
    pages: C.string().optional().describe(`Page range for PDF files (e.g., "1-5", "3", "10-20"). Only applicable to PDF files. Maximum ${P36} pages per request.`)
}))

// READABLE (for understanding):
const readInputSchema = z.strictObject({
    file_path: z.string()
        .describe("The absolute path to the file to read"),

    offset: z.number().optional()
        .describe("The line number to start reading from. Only provide if the file is too large to read at once"),

    limit: z.number().optional()
        .describe("The number of lines to read. Only provide if the file is too large to read at once"),

    pages: z.string().optional()
        .describe(`Page range for PDF files (e.g., "1-5", "3", "10-20"). Only applicable to PDF files. Maximum 20 pages per request.`)
});

// Mapping: tm9→readInputSchema, F6→lazySchema, C→z, P36→MAX_PDF_PAGES_PER_REQUEST
```

**Why strictObject:** Prevents typos in parameter names from being silently ignored. The LLM must use exact parameter names.

---

## 3. Output Schema - Discriminated Union

### readOutputSchema (em9) - Multiple output types

**What it does:** Defines a discriminated union of output types based on file content type, enabling type-safe handling of different file formats.

```javascript
// ============================================
// readOutputSchema - Zod discriminated union
// Location: chunks.90.mjs:2005-2051
// ============================================

// ORIGINAL (for source lookup):
em9 = F6(() => {
    let A = C.enum(["image/jpeg", "image/png", "image/gif", "image/webp"]);
    return C.discriminatedUnion("type", [
        C.object({
            type: C.literal("text"),
            file: C.object({
                filePath: C.string(),
                content: C.string(),
                numLines: C.number(),
                startLine: C.number(),
                totalLines: C.number(),
                resultWasTruncated: C.boolean().optional()
            })
        }),
        C.object({
            type: C.literal("image"),
            file: C.object({
                base64: C.string(),
                type: A,  // MIME type
                originalSize: C.number(),
                dimensions: C.object({
                    originalWidth: C.number().optional(),
                    originalHeight: C.number().optional(),
                    displayWidth: C.number().optional(),
                    displayHeight: C.number().optional()
                }).optional()
            })
        }),
        C.object({
            type: C.literal("notebook"),
            file: C.object({
                filePath: C.string(),
                cells: C.array(C.any())
            })
        }),
        C.object({
            type: C.literal("pdf"),
            file: C.object({
                filePath: C.string(),
                base64: C.string(),
                originalSize: C.number()
            })
        }),
        C.object({
            type: C.literal("parts"),
            file: C.object({
                filePath: C.string(),
                originalSize: C.number(),
                count: C.number(),
                outputDir: C.string()
            })
        })
    ])
})

// READABLE (for understanding):
const readOutputSchema = z.discriminatedUnion("type", [
    // Type 1: Text file output
    z.object({
        type: z.literal("text"),
        file: z.object({
            filePath: z.string(),
            content: z.string(),
            numLines: z.number(),
            startLine: z.number(),
            totalLines: z.number(),
            resultWasTruncated: z.boolean().optional()
        })
    }),

    // Type 2: Image file output
    z.object({
        type: z.literal("image"),
        file: z.object({
            base64: z.string(),
            type: z.enum(["image/jpeg", "image/png", "image/gif", "image/webp"]),
            originalSize: z.number(),
            dimensions: z.object({
                originalWidth: z.number().optional(),
                originalHeight: z.number().optional(),
                displayWidth: z.number().optional(),
                displayHeight: z.number().optional()
            }).optional()
        })
    }),

    // Type 3: Jupyter notebook output
    z.object({
        type: z.literal("notebook"),
        file: z.object({
            filePath: z.string(),
            cells: z.array(z.any())
        })
    }),

    // Type 4: PDF file output (full)
    z.object({
        type: z.literal("pdf"),
        file: z.object({
            filePath: z.string(),
            base64: z.string(),
            originalSize: z.number()
        })
    }),

    // Type 5: PDF page extraction output (parts)
    z.object({
        type: z.literal("parts"),
        file: z.object({
            filePath: z.string(),
            originalSize: z.number(),
            count: z.number(),          // Number of pages extracted
            outputDir: z.string()       // Directory containing page images
        })
    })
]);

// Mapping: em9→readOutputSchema, A→IMAGE_MIME_TYPES
```

**Why discriminated union:**
- Type-safe handling of different file formats
- Each type has its own specific fields
- The `type` field acts as discriminator for type narrowing
- Enables proper TypeScript inference when processing results

---

## 3. Text File Reading

### handleTextRead - Primary text file handling

**What it does:** Reads text files with encoding detection, line range support, and caching for subsequent edits.

**How it works:**

```javascript
// ============================================
// handleTextRead - Text file reading with encoding detection
// Location: chunks.146.mjs:1800-1900
// ============================================

// READABLE (for understanding):
async function handleTextRead(absolutePath, offset, limit, context) {
    let fs = getFileSystem();

    // Step 1: File size check
    let stats = fs.statSync(absolutePath);
    if (stats.size > MAX_FILE_SIZE_BYTES) {  // OU1
        return {
            data: {
                content: `File too large (${stats.size} bytes). Use offset/limit or Grep to read portions.`,
                type: "error"
            }
        };
    }

    // Step 2: Encoding detection
    let encoding = detectEncoding(absolutePath);  // AX

    // Step 3: Read with detected encoding
    let content = readFileSyncWithEncoding(absolutePath, encoding);  // $J

    // Step 4: Normalize line endings to LF
    content = content.replaceAll('\r\n', '\n');

    // Step 5: Line range extraction
    if (offset !== undefined || limit !== undefined) {
        let lines = content.split('\n');
        let startLine = (offset ?? 1) - 1;  // Convert 1-indexed to 0-indexed
        let numLines = limit ?? lines.length;
        content = lines.slice(startLine, startLine + numLines).join('\n');
    }

    // Step 6: Update readFileState cache (for subsequent Edit/Write validation)
    context.readFileState.set(absolutePath, {
        content: content,
        timestamp: getModificationTime(absolutePath),
        offset: offset,
        limit: limit
    });

    // Step 7: Analyze memory usage
    let memoryUsage = analyzeConversationMemoryUsage(content);  // Ia4

    return {
        data: {
            content: content,
            type: "text",
            lineCount: content.split('\n').length,
            ...memoryUsage
        }
    };
}

// Mapping: OU1→MAX_FILE_SIZE_BYTES, AX→detectEncoding, $J→readFileSyncWithEncoding,
//          Ia4→analyzeConversationMemoryUsage
```

**Why encoding detection matters:**
- UTF-8 is the modern standard, but legacy files may use UTF-16, Latin-1, or system default encodings
- Reading a UTF-16 file as UTF-8 produces garbage characters
- The `detectEncoding` function uses BOM (Byte Order Mark) detection and statistical analysis

---

## 4. Image File Handling

### handleImageRead - Image file base64 encoding

**What it does:** Reads image files and returns them as base64-encoded data URLs for display in the conversation.

```javascript
// ============================================
// handleImageRead - Image file handling
// Location: chunks.146.mjs:1950-2000
// ============================================

// READABLE (for understanding):
async function handleImageRead(absolutePath) {
    let fs = getFileSystem();
    let extension = path.extname(absolutePath).toLowerCase();

    // Supported image formats
    const IMAGE_MIME_TYPES = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.bmp': 'image/bmp',
        '.ico': 'image/x-icon'
    };

    let mimeType = IMAGE_MIME_TYPES[extension];
    if (!mimeType) {
        return { data: { content: "Unsupported image format", type: "error" } };
    }

    // Read as binary and encode to base64
    let buffer = fs.readFileSync(absolutePath);
    let base64 = buffer.toString('base64');

    // Return as data URL
    return {
        data: {
            content: `data:${mimeType};base64,${base64}`,
            type: "image",
            mimeType: mimeType,
            size: buffer.length
        }
    };
}
```

**Key insight:** Images are returned as data URLs (`data:image/png;base64,...`) which can be directly rendered in the UI without additional HTTP requests.

---

## 5. PDF File Handling

### handlePdfRead - PDF document reading

**What it does:** Extracts text content from PDF files with page range support and metadata extraction. Supports both full PDF reading (Anthropic API only) and page extraction via poppler-utils.

**How it works:**

```javascript
// ============================================
// handlePdfRead - PDF file handling
// Location: chunks.90.mjs:1770-1818
// ============================================

// ORIGINAL (for source lookup):
// P36 = 20 (MAX_PDF_PAGES_PER_REQUEST)
// TX1 = 10 (MIN_PAGES_FOR_PAGE_RANGE_PROMPT)
// XA4 = 3145728 (3MB - MAX_SIZE_FOR_PAGE_EXTRACTION)
let u = await GP1(K);
if (u !== null && u > TX1) throw Error(`This PDF has ${u} pages, which is too many to read at once. Use the pages parameter to read specific page ranges (e.g., pages: "1-5"). Maximum ${P36} pages per request.`);
let g = await $1().stat(K);
if (!yx6() || g.size > XA4) {
    let Q = await UN8(K);
    if (Q.success) d("tengu_pdf_page_extraction", {
        success: !0,
        pageCount: Q.data.file.count,
        fileSize: Q.data.file.originalSize
    });
}
if (!yx6()) throw Error(`Reading full PDFs is only supported with the Anthropic API...`);
let b = await N34(K);
if (!b.success) throw Error(b.error.message);
let p = b.data;
return RC({
    operation: "read",
    tool: "FileReadTool",
    filePath: q,
    content: p.file.base64
}), {
    data: p,
    newMessages: [p1({
        content: [{
            type: "document",
            source: {
                type: "base64",
                media_type: "application/pdf",
                data: p.file.base64
            }
        }],
        isMeta: !0
    })]
}

// READABLE (for understanding):
async function handlePdfRead(absolutePath, inputPath, context) {
    const MAX_PDF_PAGES = 20;  // P36
    const MIN_PAGES_THRESHOLD = 10;  // TX1 - prompt for page range if more pages
    const MAX_SIZE_FOR_EXTRACTION = 3145728;  // XA4 - 3MB

    // Step 1: Get PDF page count
    let pageCount = await getPdfPageCount(absolutePath);
    if (pageCount !== null && pageCount > MIN_PAGES_THRESHOLD) {
        throw Error(`This PDF has ${pageCount} pages, which is too many to read at once. ` +
            `Use the pages parameter to read specific page ranges (e.g., pages: "1-5"). ` +
            `Maximum ${MAX_PDF_PAGES} pages per request.`);
    }

    // Step 2: Check file size for extraction strategy
    let fileStats = await getFileSystem().stat(absolutePath);
    if (!isAnthropicApi() || fileStats.size > MAX_SIZE_FOR_EXTRACTION) {
        // Try poppler-based page extraction
        let extractionResult = await extractPdfPages(absolutePath);
        if (extractionResult.success) {
            telemetry("tengu_pdf_page_extraction", {
                success: true,
                pageCount: extractionResult.data.file.count,
                fileSize: extractionResult.data.file.originalSize
            });
        } else {
            telemetry("tengu_pdf_page_extraction", {
                success: false,
                available: extractionResult.error.reason !== "unavailable",
                fileSize: fileStats.size
            });
        }
    }

    // Step 3: Full PDF read (Anthropic API only)
    if (!isAnthropicApi()) {
        throw Error(`Reading full PDFs is only supported with the Anthropic API. ` +
            `Use the pages parameter to read specific page ranges (e.g., pages: "1-5", ` +
            `maximum ${MAX_PDF_PAGES} pages per request). This requires poppler-utils: ` +
            `install with \`brew install poppler\` on macOS or \`apt-get install poppler-utils\` on Debian/Ubuntu.`);
    }

    // Step 4: Read PDF and return as base64 document
    let pdfResult = await readPdfAsBase64(absolutePath);
    if (!pdfResult.success) throw Error(pdfResult.error.message);

    let pdfData = pdfResult.data;
    recordFileOperation({
        operation: "read",
        tool: "FileReadTool",
        filePath: inputPath,
        content: pdfData.file.base64
    });

    // Return document with PDF as base64
    return {
        data: pdfData,
        newMessages: [createUserMessage({
            content: [{
                type: "document",
                source: {
                    type: "base64",
                    media_type: "application/pdf",
                    data: pdfData.file.base64
                }
            }],
            isMeta: true
        })]
    };
}

// Mapping: P36→MAX_PDF_PAGES_PER_REQUEST, TX1→MIN_PAGES_FOR_PAGE_RANGE_PROMPT,
//          XA4→MAX_SIZE_FOR_PAGE_EXTRACTION, GP1→getPdfPageCount, UN8→extractPdfPages,
//          N34→readPdfAsBase64, yx6→isAnthropicApi, RC→recordFileOperation
```

**PDF reading strategy:**

| Condition | Strategy | Why |
|-----------|----------|-----|
| `pageCount > 10` | Reject, require `pages` parameter | Prevents context overflow |
| `fileSize > 3MB` && non-Anthropic API | Use poppler extraction | Large files need page-by-page |
| Anthropic API | Full PDF as base64 | Native PDF support in API |
| Non-Anthropic API | poppler-utils required | Fallback extraction method |

**Why 20 page limit:**
- PDFs can be thousands of pages, which would overwhelm the context window
- The limit forces targeted reading of specific sections
- Multiple Read calls can be made for different page ranges

---

## 6. Jupyter Notebook Handling

### handleNotebookRead - .ipynb file parsing

**What it does:** Parses Jupyter notebook JSON structure and extracts cell content with proper formatting.

```javascript
// ============================================
// handleNotebookRead - Jupyter notebook handling
// Location: chunks.146.mjs:2100-2200
// ============================================

// READABLE (for understanding):
async function handleNotebookRead(absolutePath, offset, limit) {
    let fs = getFileSystem();
    let content = fs.readFileSync(absolutePath, { encoding: 'utf-8' });
    let notebook = JSON.parse(content);

    // Validate notebook format
    if (notebook.nbformat < 4) {
        return { data: { content: "Notebook format version < 4 not supported", type: "error" } };
    }

    // Extract cells
    let cells = notebook.cells || [];
    let cellOutputs = [];

    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];

        // Skip if outside requested range
        if (offset && i + 1 < offset) continue;
        if (limit && i >= offset + limit) break;

        let cellContent = {
            type: cell.cell_type,  // "code" or "markdown"
            source: Array.isArray(cell.source) ? cell.source.join('') : cell.source,
            executionCount: cell.execution_count,
            outputs: cell.outputs?.map(formatOutput) ?? []
        };

        cellOutputs.push(cellContent);
    }

    return {
        data: {
            content: formatNotebookForDisplay(cellOutputs),
            type: "notebook",
            cellCount: cells.length,
            kernel: notebook.metadata?.kernelspec?.display_name
        }
    };
}
```

**Key insight:** Notebooks are parsed and formatted for readability, with code cells showing execution counts and outputs. This provides a cleaner view than raw JSON.

---

## 7. readFileState Cache Management

### Cache for Edit/Write Validation

**What it does:** Maintains a cache of read files to validate subsequent Edit and Write operations, preventing blind overwrites.

```javascript
// ============================================
// readFileState - Cache management for file integrity
// Location: chunks.146.mjs (referenced in context)
// ============================================

// READABLE (for understanding):
// The readFileState is a Map stored in the tool use context:

// After reading a file:
context.readFileState.set(absolutePath, {
    content: fileContent,           // Full file content
    timestamp: mtime,               // Modification time
    offset: offset,                 // If partial read
    limit: limit                    // If partial read
});

// Before editing/writing:
let cached = context.readFileState.get(absolutePath);

// Check 1: Has file been read?
if (!cached) {
    return error("File has not been read yet. Read it first before writing to it.");
}

// Check 2: Has file been modified externally?
if (getModificationTime(absolutePath) > cached.timestamp) {
    // Content comparison for mtime-only changes (formatter)
    if (fullContent === cached.content) {
        // Safe to proceed - only mtime changed
    } else {
        return error("File has been modified since read. Read it again before writing.");
    }
}
```

**Why this matters:**
- Prevents "blind" edits where the LLM might overwrite external changes
- Ensures the LLM has current knowledge of file content
- Catches race conditions with formatters, linters, or other tools

---

## 8. Memory Usage Analysis

### analyzeConversationMemoryUsage (Ia4) - Context window awareness

**What it does:** Analyzes the memory footprint of the file content to inform context management decisions.

```javascript
// ============================================
// analyzeConversationMemoryUsage - Memory footprint analysis
// Location: chunks.146.mjs:2147
// ============================================

// READABLE (for understanding):
function analyzeConversationMemoryUsage(content) {
    let lines = content.split('\n');

    // Token estimation (rough: ~4 chars per token)
    let estimatedTokens = Math.ceil(content.length / 4);

    // Large file threshold
    let isLargeFile = lines.length > 1000 || content.length > 50000;

    // Recommendation for partial reading
    let recommendation = null;
    if (isLargeFile) {
        recommendation = "Consider using offset/limit or Grep for targeted reading to conserve context.";
    }

    return {
        lineCount: lines.length,
        charCount: content.length,
        estimatedTokens: estimatedTokens,
        isLargeFile: isLargeFile,
        recommendation: recommendation
    };
}

// Mapping: Ia4→analyzeConversationMemoryUsage
```

---

## 9. Complete Execution Timeline

```
T+0ms  LLM produces tool_use { type: "Read", file_path: "/path/to/file.ts" }
T+0ms  validateInput() begins
T+1ms  resolvePath() converts to absolute path
T+1ms  checkReadPermissions() verifies access
T+1ms  File existence check
T+2ms  validateInput() returns { result: true }
T+2ms  Permission check (auto-allowed for read-only tool)
T+3ms  call() begins
T+3ms  File type detection by extension
T+4ms  [Branch: text file]
       ├── detectEncoding() analyzes file
       ├── readFileSyncWithEncoding() reads content
       ├── Line ending normalization
       └── [Optional] Line range extraction
T+5ms  readFileState cache updated
T+5ms  Memory usage analyzed
T+6ms  Result { content, type, ... } returned
T+6ms  UI renders line-numbered content
```

---

## 10. Key Security Properties

| Property | Implementation | Why |
|----------|---------------|-----|
| Path traversal prevention | `resolvePath()` normalizes `..` sequences | Prevents accessing files outside intended directory |
| Permission checking | `checkReadPermissions()` against deny rules | Respects user-defined access boundaries |
| File size limits | `MAX_FILE_SIZE_BYTES` constant | Prevents context overflow from large files |
| PDF page limits | `MAX_PDF_PAGES_PER_REQUEST` (20) | Prevents reading entire large PDFs |
| Encoding safety | BOM detection + statistical analysis | Prevents decoding errors from misidentified encoding |
| Concurrency safety | Read operations don't conflict | Multiple parallel reads are safe |

---

## 11. Validation Error Codes

### Read Tool Error Codes (from validateInput)

| Code | Condition | Message |
|------|-----------|---------|
| 1 | Path denied by permission rules | "File is in a directory that is denied by your permission settings." |
| 4 | Binary file detection | "This tool cannot read binary files. The file appears to be a binary ${ext} file." |
| 7 | Invalid pages parameter format | "Invalid pages parameter: Use formats like '1-5', '3', or '10-20'." |
| 8 | Pages exceed maximum | "Page range exceeds maximum of 20 pages per request." |
| 9 | Device file blocked | "Cannot read '${path}': this device file would block or produce infinite output." |

**Binary file detection:**
```javascript
// ============================================
// Binary file detection logic
// Location: chunks.90.mjs:2150-2155
// ============================================

// p31(Y) - isBinaryFile check
// JD6(O) - isPdfExtension check (PDFs handled specially)
// R94 - IMAGE_EXTENSIONS_SET (images handled specially)

if (isBinaryFile(absolutePath) && !isPdfExtension(extension) && !IMAGE_EXTENSIONS.has(extension)) {
    return {
        result: false,
        message: `This tool cannot read binary files. The file appears to be a binary ${extension} file.`,
        errorCode: 4
    };
}
```

**Device file protection:**
```javascript
// ============================================
// Device file check (nm9)
// Location: chunks.90.mjs:2156-2159
// ============================================

// Blocks reading from /dev/null, /dev/zero, /dev/random, etc.
// These would block or produce infinite output
if (isDeviceFile(absolutePath)) {
    return {
        result: false,
        message: `Cannot read '${file_path}': this device file would block or produce infinite output.`,
        errorCode: 9
    };
}
```

---

## 12. Related Constants

| Symbol | Value | Purpose |
|--------|-------|---------|
| P36 (MAX_PDF_PAGES_PER_REQUEST) | 20 | Maximum pages per PDF read |
| TX1 (MIN_PAGES_FOR_PDF_PROMPT) | 10 | Threshold to prompt for page range |
| XA4 (MAX_SIZE_FOR_PDF_EXTRACTION) | 3145728 (3MB) | Max size for poppler extraction |
| Lx6 (DEFAULT_READ_LINES) | 2000 | Default lines returned without offset/limit |
| R94 (IMAGE_EXTENSIONS_SET) | ["png", "jpg", "jpeg", "gif", "webp"] | Supported image formats |