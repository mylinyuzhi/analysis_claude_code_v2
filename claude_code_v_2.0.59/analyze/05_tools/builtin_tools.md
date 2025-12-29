# Built-in Tools

This document catalogs all built-in tools available in Claude Code v2.0.59.

## Overview

Claude Code provides a comprehensive set of built-in tools that enable file operations, code search, web access, task management, and more. Each tool has defined input/output schemas and permission requirements.

## Tool Properties

Each tool implements the following interface:

```typescript
interface Tool {
  name: string;                    // Unique tool identifier
  description(): Promise<string>;  // Tool description for Claude
  prompt(): Promise<string>;       // Detailed usage instructions
  inputSchema: ZodSchema;          // Zod schema for input validation
  outputSchema: ZodSchema;         // Zod schema for output structure
  isEnabled(): boolean;            // Whether tool is currently enabled
  isConcurrencySafe(): boolean;    // Can run in parallel with other tools
  isReadOnly(): boolean;           // Whether tool modifies files
  strict?: boolean;                // Whether to use strict schema validation
  userFacingName?: string;         // Display name for UI
  getPath?(input): string;         // Extract file path from input (for permission checks)
  checkPermissions?(input, context): Promise<PermissionResult>;
  validateInput?(input, context): Promise<ValidationResult>;
  call(input, context, toolUseId, metadata): Promise<ToolResult>;
}
```

---

## File Operation Tools

### Bash

**Name**: `Bash`
**Constant**: `C9 = "Bash"` (chunks.16.mjs:1367)

**Description**: Executes bash commands in a persistent shell session with optional timeout, ensuring proper handling and security measures.

**Input Schema** (chunks.106.mjs):
```typescript
{
  command: string (required)      // The command to execute
  description?: string            // Clear, concise description of what this command does
  timeout?: number                // Optional timeout in milliseconds (max 600000)
  run_in_background?: boolean     // Set to true to run in background
  dangerouslyDisableSandbox?: boolean  // Override sandbox mode
}
```

**Output Schema** (chunks.106.mjs):
```typescript
{
  stdout: string                  // Standard output of the command
  stderr: string                  // Standard error output
  summary?: string                // Summarized output when available
  rawOutputPath?: string          // Path to raw output file when summarized
  interrupted: boolean            // Whether command was interrupted
  isImage?: boolean               // Flag if stdout contains image data
  backgroundTaskId?: string       // ID of background task if running in background
  dangerouslyDisableSandbox?: boolean  // Flag if sandbox mode was overridden
  returnCodeInterpretation?: string    // Semantic interpretation for non-error exit codes
  structuredContent?: any[]       // Structured content blocks from mcp-cli commands
}
```

**Properties**:
- `isConcurrencySafe`: Returns result of `isReadOnly()`
- `isReadOnly`: Returns `true` if command behavior is "allow" (read-only command)
- `strict`: `true`
- `getPath`: Not defined (operates on CWD)

**Key Features**:
- Persistent shell session across tool calls
- Command timeout support (default 2 minutes, max 10 minutes)
- Background execution support
- Sandbox mode (can be disabled with flag)
- Special handling for npm, yarn, python, docker, etc.
- Structured output truncation (limit 20000 chars)

**Implementation** (chunks.106.mjs:775-850):
```javascript
// ============================================
// Bash Tool - call() implementation
// Location: chunks.106.mjs:775-850
// ============================================

// ORIGINAL (for source lookup):
async call(A, Q, B, G, Z) {
  let {
    abortController: I, readFileState: Y, getAppState: J,
    setAppState: W, setToolJSX: X, messages: V
  } = Q, F = new h7A, K = new h7A, D, H = 0, C = !1, E, q = Q.agentId !== e1();
  try {
    let FA = TK5({ input: A, abortController: I, setAppState: W, setToolJSX: X, preventCwdChanges: q }), zA;
    do
      if (zA = await FA.next(), !zA.done && Z) {
        let OA = zA.value;
        Z({ toolUseID: `bash-progress-${H++}`, data: { type: "bash_progress", output: OA.output, fullOutput: OA.fullOutput, elapsedTimeSeconds: OA.elapsedTimeSeconds, totalLines: OA.totalLines } })
      } while (!zA.done);
    if (E = zA.value, LK5(A.command, E.code), F.append((E.stdout || "").trimEnd() + TMA), D = v32(A.command, E.code, E.stdout || "", E.stderr || ""), /* ... error handling ... */)
    C = E.interrupted
  } finally { if (X) X(null) }
  let w = F.toString(), N = K.toString();
  // ... file path extraction and tracking ...
  return { data: { stdout: w, stderr: N, summary: void 0, interrupted: C, isImage: j02(w), backgroundTaskId: E?.backgroundTaskId, structuredContent: /* ... */, returnCodeInterpretation: D?.description } }
}

// READABLE (for understanding):
async call(input, context, toolUseId, metadata, progressCallback) {
  const {
    abortController, readFileState, getAppState,
    setAppState, setToolJSX, messages
  } = context;

  const stdoutBuffer = new StringBuilder();
  const stderrBuffer = new StringBuilder();
  let exitCodeInfo, progressCounter = 0, interrupted = false, result;
  const preventCwdChanges = context.agentId !== mainAgentId();

  try {
    // Step 1: Execute command via generator
    const execution = executeCommandGenerator({
      input, abortController, setAppState, setToolJSX, preventCwdChanges
    });

    // Step 2: Process execution results with progress updates
    let stepResult;
    do {
      stepResult = await execution.next();
      if (!stepResult.done && progressCallback) {
        const progressData = stepResult.value;
        progressCallback({
          toolUseID: `bash-progress-${progressCounter++}`,
          data: {
            type: "bash_progress",
            output: progressData.output,
            fullOutput: progressData.fullOutput,
            elapsedTimeSeconds: progressData.elapsedTimeSeconds,
            totalLines: progressData.totalLines
          }
        });
      }
    } while (!stepResult.done);

    result = stepResult.value;

    // Step 3: Track git operations
    trackGitOperations(input.command, result.code);

    // Step 4: Process output
    stdoutBuffer.append((result.stdout || "").trimEnd());
    exitCodeInfo = interpretExitCode(input.command, result.code, result.stdout, result.stderr);

    interrupted = result.interrupted;
  } finally {
    if (setToolJSX) setToolJSX(null);
  }

  // Step 5: Return result
  return {
    data: {
      stdout: stdoutBuffer.toString(),
      stderr: stderrBuffer.toString(),
      summary: undefined,
      interrupted: interrupted,
      isImage: detectImageData(stdoutBuffer.toString()),
      backgroundTaskId: result?.backgroundTaskId,
      structuredContent: undefined,
      returnCodeInterpretation: exitCodeInfo?.description
    }
  };
}

// Mapping: A→input, Q→context, B→toolUseId, G→metadata, Z→progressCallback
// I→abortController, Y→readFileState, J→getAppState, W→setAppState, X→setToolJSX
// F→stdoutBuffer, K→stderrBuffer, H→progressCounter, C→interrupted, E→result
// TK5→executeCommandGenerator, LK5→trackGitOperations, v32→interpretExitCode
// h7A→StringBuilder, e1→mainAgentId, j02→detectImageData
```

---

### Read

**Name**: `Read`
**Constant**: `d5 = "Read"` (chunks.19.mjs:499)

**Description**: Reads a file from the local filesystem. Can access any file directly.

**Input Schema** (chunks.88.mjs):
```typescript
{
  file_path: string (required)   // The absolute path to the file to read
  limit?: number                  // Number of lines to read
  offset?: number                 // Line number to start reading from
}
```

**Output Schema** (chunks.88.mjs):
```typescript
{
  type: "text" | "image" | "notebook" | "pdf"  // File type
  file: {
    // For text files:
    filePath: string             // The file path
    content: string              // File content
    language: string             // Programming language
    numLines: number             // Total line count
    offsetApplied: number        // Offset used
    limitApplied: number         // Limit used
    startLineNum: number         // Starting line number
    endLineNum: number          // Ending line number

    // For images:
    base64: string              // Base64-encoded image data
    type: string                // MIME type
    originalSize: number        // Original file size in bytes

    // For notebooks:
    filePath: string
    cells: any[]                // Array of notebook cells

    // For PDFs:
    filePath: string
    base64: string              // Base64-encoded PDF data
    originalSize: number        // Original file size in bytes
  }
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `true`
- `strict`: `true`
- `getPath`: Returns `input.file_path`

**Key Features**:
- Reads up to 2000 lines by default (configurable)
- Line length limit: 2000 characters
- Supports text files, images (PNG, JPG, etc.), PDFs, Jupyter notebooks
- Results returned in cat -n format with line numbers starting at 1
- Can read any file on the system (subject to permissions)
- Image and PDF support for multimodal analysis

**Input Examples**:
```json
[
  { "file_path": "/Users/username/project/src/index.ts" },
  { "file_path": "/Users/username/project/README.md", "limit": 100, "offset": 0 }
]
```

**Implementation** (chunks.88.mjs:1258-1373):
```javascript
// ============================================
// Read Tool - call() implementation
// Location: chunks.88.mjs:1258-1373
// ============================================

// ORIGINAL (for source lookup):
async call({ file_path: A, offset: Q = 1, limit: B = void 0 }, G) {
  let { readFileState: Z, fileReadingLimits: I } = G,
    Y = uNA, J = I?.maxTokens ?? Xo1,
    W = Jo1.extname(A).toLowerCase().slice(1), X = Pl(A);

  if (W === "ipynb") {
    let C = gOB(X), E = JSON.stringify(C);
    if (E.length > Y) throw Error(/* ... */);
    Z.set(X, { content: E, timestamp: PD(X), offset: Q, limit: B });
    return { data: { type: "notebook", file: { filePath: A, cells: C } } }
  }

  if (B01.has(W)) {
    let C = await Vo1(X, J, W);
    Z.set(X, { content: C.file.base64, timestamp: PD(X), offset: Q, limit: B });
    return { data: C }
  }

  if (g9A() && lxA(W)) {
    let C = await nd0(X);
    return { data: C, newMessages: [/* PDF document attachment */] }
  }

  let V = Q === 0 ? 0 : Q - 1, { content: F, lineCount: K, totalLines: D } = eeB(X, V, B);
  if (F.length > Y) throw Error(Wo1(F.length, Y));
  Z.set(X, { content: F, timestamp: PD(X), offset: Q, limit: B });
  return { data: { type: "text", file: { filePath: A, content: F, numLines: K, startLine: Q, totalLines: D } } }
}

// READABLE (for understanding):
async call({ file_path, offset = 1, limit = undefined }, context) {
  const { readFileState, fileReadingLimits } = context;
  const maxSize = MAX_FILE_SIZE;
  const maxTokens = fileReadingLimits?.maxTokens ?? DEFAULT_MAX_TOKENS;
  const extension = path.extname(file_path).toLowerCase().slice(1);
  const absolutePath = resolvePath(file_path);

  // Handle Jupyter notebooks
  if (extension === "ipynb") {
    const cells = parseNotebook(absolutePath);
    const content = JSON.stringify(cells);
    if (content.length > maxSize) throw Error("Notebook too large");
    readFileState.set(absolutePath, { content, timestamp: getModTime(absolutePath), offset, limit });
    return { data: { type: "notebook", file: { filePath: file_path, cells } } };
  }

  // Handle images (png, jpg, gif, webp, etc.)
  if (IMAGE_EXTENSIONS.has(extension)) {
    const imageData = await readImageFile(absolutePath, maxTokens, extension);
    readFileState.set(absolutePath, { content: imageData.file.base64, timestamp: getModTime(absolutePath), offset, limit });
    return { data: imageData };
  }

  // Handle PDFs (with native PDF support)
  if (isPDFEnabled() && isPdfExtension(extension)) {
    const pdfData = await readPdfFile(absolutePath);
    return { data: pdfData, newMessages: [/* PDF document attachment */] };
  }

  // Handle text files
  const startOffset = offset === 0 ? 0 : offset - 1;
  const { content, lineCount, totalLines } = readTextFile(absolutePath, startOffset, limit);
  if (content.length > maxSize) throw Error(formatSizeError(content.length, maxSize));
  readFileState.set(absolutePath, { content, timestamp: getModTime(absolutePath), offset, limit });
  return { data: { type: "text", file: { filePath: file_path, content, numLines: lineCount, startLine: offset, totalLines } } };
}

// Mapping: A→file_path, Q→offset, B→limit, G→context, Z→readFileState, I→fileReadingLimits
// Y→maxSize, J→maxTokens, W→extension, X→absolutePath, V→startOffset, F→content, K→lineCount, D→totalLines
// uNA→MAX_FILE_SIZE, Xo1→DEFAULT_MAX_TOKENS, Jo1→path, Pl→resolvePath, PD→getModTime
// gOB→parseNotebook, B01→IMAGE_EXTENSIONS, Vo1→readImageFile, eeB→readTextFile, Wo1→formatSizeError
```

---

### Write

**Name**: `Write`
**Constant**: `wX = "Write"` (chunks.19.mjs:2176)

**Description**: Writes a file to the local filesystem.

**Input Schema** (chunks.122.mjs:3292):
```typescript
{
  file_path: string (required)   // The absolute path to the file to write (must be absolute)
  content: string (required)      // The content to write to the file
}
```

**Output Schema** (chunks.122.mjs:3295):
```typescript
{
  type: "create" | "update"       // Whether new file was created or existing updated
  filePath: string                // Path to the file that was written
  content: string                 // Content that was written
  structuredPatch: StructuredPatch[]  // Diff patch showing the changes
  originalFile: string | null     // Original file content before write (null for new files)
}
```

**Properties**:
- `isConcurrencySafe`: `false`
- `isReadOnly`: `false`
- `strict`: `true`
- `getPath`: Returns `input.file_path`

**Validation**:
- File must be in allowed directory (permission check)
- For existing files: must have been read first
- For existing files: file must not have been modified since read

**Key Features**:
- Overwrites existing file if present
- Must read file first before writing to existing files
- Creates parent directories if needed
- Generates unified diff patches
- Notifies LSP server of file changes
- File history tracking support
- Detects and respects file encoding

**Input Examples**:
```json
{
  "file_path": "/Users/username/project/src/newFile.ts",
  "content": "export function hello() {\n  console.log(\"Hello, World!\");\n}"
}
```

**Implementation** (chunks.122.mjs:3371-3449):
```javascript
// ============================================
// Write Tool - call() implementation
// Location: chunks.122.mjs:3371-3449
// ============================================

// ORIGINAL (for source lookup):
async call({ file_path: A, content: Q }, { readFileState: B, updateFileHistoryState: G, setAppState: Z }, I, Y) {
  let J = b9(A), W = bu5(J), X = RA();
  await Oh.beforeFileEdited(J);
  let V = X.existsSync(J);
  if (V) {
    let E = PD(J), U = B.get(J);
    if (!U || E > U.timestamp) throw Error("File has been unexpectedly modified...")
  }
  let F = V ? CH(J) : "utf-8", K = V ? X.readFileSync(J, { encoding: F }) : null;
  if (EG()) await kYA(G, J, Y.uuid);
  let D = V ? M0A(J) : await m_2();
  X.mkdirSync(W), KWA(J, Q, F, D);
  /* ... LSP notification, file state update, diff generation ... */
  if (K) return { data: { type: "update", filePath: A, content: Q, structuredPatch: E, originalFile: K } }
  return { data: { type: "create", filePath: A, content: Q, structuredPatch: [], originalFile: null } }
}

// READABLE (for understanding):
async call({ file_path, content }, { readFileState, updateFileHistoryState, setAppState }, toolUseId, metadata) {
  const absolutePath = resolvePath(file_path);
  const parentDir = getParentDir(absolutePath);
  const fs = getFS();

  // Step 1: Trigger pre-edit hook
  await hooks.beforeFileEdited(absolutePath);

  // Step 2: Check if file exists and validate modification time
  const fileExists = fs.existsSync(absolutePath);

  // Step 4: Validate file hasn't been modified
  if (fileExists) {
    const currentModTime = getFileModificationTime(absolutePath);
    const fileState = readFileState.get(absolutePath);

    if (!fileState || currentModTime > fileState.timestamp) {
      throw new Error(
        "File has been unexpectedly modified. Read it again before attempting to write it."
      );
    }
  }

  // Step 5: Detect encoding and read original content
  const encoding = fileExists ? detectEncoding(absolutePath) : 'utf-8';
  const originalContent = fileExists
    ? fs.readFileSync(absolutePath, { encoding })
    : null;

  // Step 6: Save to file history (if enabled)
  if (isFileHistoryEnabled()) {
    await saveToFileHistory(updateFileHistoryState, absolutePath, toolUseId);
  }

  // Step 7: Get or create file permissions
  const permissions = fileExists
    ? getFilePermissions(absolutePath)
    : await getDefaultPermissions();

  // Step 8: Create parent directory if needed
  fs.mkdirSync(parentDir, { recursive: true });

  // Step 9: Write file with encoding and permissions
  writeFileWithPermissions(absolutePath, content, encoding, permissions);

  // Step 10: Notify LSP server (if active)
  const lspClient = getLSPClient();
  if (lspClient) {
    trackLSPFile(`file://${absolutePath}`);

    // Notify file change
    lspClient.changeFile(absolutePath, content).catch((error) => {
      logError(`LSP: Failed to notify server of file change: ${error.message}`);
    });

    // Notify file save
    lspClient.saveFile(absolutePath).catch((error) => {
      logError(`LSP: Failed to notify server of file save: ${error.message}`);
    });
  }

  // Step 11: Update read file state
  readFileState.set(absolutePath, {
    content: content,
    timestamp: getFileModificationTime(absolutePath),
    offset: undefined,
    limit: undefined
  });

  // Step 12: Update context file cache
  invalidateContextFileCache(setAppState);

  // Step 13: Track CLAUDE.md writes
  if (absolutePath.endsWith(`${path.sep}CLAUDE.md`)) {
    trackEvent("tengu_write_claudemd", {});
  }

  // Step 14: Generate diff patch and result
  if (originalContent) {
    // File update
    const structuredPatch = generateUnifiedDiff({
      filePath: file_path,
      fileContents: originalContent,
      edits: [{
        old_string: originalContent,
        new_string: content,
        replace_all: false
      }]
    });

    trackDiffMetrics(structuredPatch);

    trackFileOperation({
      operation: "write",
      tool: "FileWriteTool",
      filePath: absolutePath,
      type: "update"
    });

    return {
      data: {
        type: "update",
        filePath: file_path,
        content: content,
        structuredPatch: structuredPatch,
        originalFile: originalContent
      }
    };
  } else {
    // File creation
    trackDiffMetrics([], content);

    trackFileOperation({
      operation: "write",
      tool: "FileWriteTool",
      filePath: absolutePath,
      type: "create"
    });

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

// Helper: Write file with specific encoding and permissions
function writeFileWithPermissions(filePath, content, encoding, permissions) {
  fs.writeFileSync(filePath, content, { encoding, mode: permissions });
}

// Helper: Generate unified diff patch
function generateUnifiedDiff({ filePath, fileContents, edits }) {
  // Apply edits to generate new content
  let newContent = fileContents;
  for (const edit of edits) {
    if (edit.replace_all) {
      newContent = newContent.replaceAll(edit.old_string, edit.new_string);
    } else {
      newContent = newContent.replace(edit.old_string, edit.new_string);
    }
  }

  // Generate diff using diff library
  const patch = diff.createPatch(
    filePath,
    fileContents,
    newContent,
    'original',
    'updated'
  );

  // Parse patch into structured format
  return parsePatchToStructured(patch);
}

// Mapping: A→file_path, Q→content, B→readFileState, G→updateFileHistoryState, Z→setAppState, I→toolUseId, Y→metadata
// J→absolutePath, W→parentDir, X→fs, V→fileExists, F→encoding, K→originalContent, D→permissions
// b9→resolvePath, bu5→getParentDir, RA→getFS, Oh→hooks, PD→getModTime, CH→detectEncoding
// EG→isFileHistoryEnabled, kYA→saveToFileHistory, M0A→getFilePermissions, m_2→getDefaultPermissions
// KWA→writeFileWithPermissions, XWA→getLSPClient, Uq→generateUnifiedDiff, fMA→trackDiffMetrics, Uk→trackFileOperation
```

---

### Edit

**Name**: `Edit`
**Constant**: `$5 = "Edit"` (chunks.19.mjs:449)

**Description**: Performs exact string replacements in files.

**Input Schema** (chunks.123.mjs):
```typescript
{
  file_path: string (required)   // Absolute path to the file to modify
  old_string: string (required)  // The text to replace (must be unique)
  new_string: string (required)  // The text to replace it with (must be different)
  replace_all?: boolean          // Replace all occurrences (default false)
}
```

**Output Schema** (chunks.123.mjs):
```typescript
{
  filePath: string               // Path to the edited file
  content: string                // Updated file content
  structuredPatch: StructuredPatch[]  // Diff patch showing changes
  originalFile: string           // Original file content before edit
}
```

**Properties**:
- `isConcurrencySafe`: `false`
- `isReadOnly`: `false`
- `strict`: `true`
- `getPath`: Returns `input.file_path`

**Validation**:
- Must read file first before editing
- `old_string` must be unique in file (unless `replace_all` is true)
- `old_string` and `new_string` must be different
- File must not have been modified since read

**Key Features**:
- Exact string matching (preserves indentation)
- Line number prefix format: spaces + line number + tab
- Never includes line number prefix in old_string or new_string
- Always prefers editing existing files over writing new files
- Support for rename operations via `replace_all`

---

## Search Tools

### Glob

**Name**: `Glob`
**Constant**: `iK = "Glob"` (chunks.19.mjs:2147)

**Description**: Fast file pattern matching tool that works with any codebase size.

**Input Schema** (chunks.125.mjs:886):
```typescript
{
  pattern: string (required)     // The glob pattern to match files against
  path?: string                  // Directory to search in (defaults to CWD)
}
```

**Output Schema** (chunks.125.mjs:890):
```typescript
{
  durationMs: number             // Time taken to execute search in milliseconds
  numFiles: number               // Total number of files found
  filenames: string[]            // Array of file paths matching the pattern
  truncated: boolean             // Whether results were truncated (limited to 100 files)
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `true`
- `getPath`: Returns `input.path || W0()` (CWD)

**Key Features**:
- Supports glob patterns like `**/*.js` or `src/**/*.ts`
- Returns matching file paths sorted by modification time
- Results limited to 100 files maximum
- Fast performance on large codebases

---

### Grep

**Name**: `Grep`
**Constant**: `xY = "Grep"` (chunks.19.mjs:2172)

**Description**: A powerful search tool built on ripgrep.

**Input Schema** (chunks.125.mjs:529):
```typescript
{
  pattern: string (required)     // The regular expression pattern to search for
  path?: string                  // File or directory to search in (defaults to CWD)
  output_mode?: "content" | "files_with_matches" | "count"  // Output mode
  glob?: string                  // Glob pattern to filter files (e.g. "*.js")
  type?: string                  // File type to search (e.g. "js", "py", "rust")
  "-B"?: number                  // Lines before match (content mode only)
  "-A"?: number                  // Lines after match (content mode only)
  "-C"?: number                  // Lines before and after match (content mode only)
  "-n"?: boolean                 // Show line numbers (content mode, default true)
  "-i"?: boolean                 // Case insensitive search
  head_limit?: number            // Limit output to first N lines/entries
  offset?: number                // Skip first N lines/entries
  multiline?: boolean            // Enable multiline mode (default false)
}
```

**Output Schema** (chunks.125.mjs:546):
```typescript
{
  mode?: "content" | "files_with_matches" | "count"
  numFiles: number               // Number of files with matches
  filenames: string[]            // Array of matching file paths
  content?: string               // Matching lines (content mode only)
  numLines?: number              // Number of matching lines
  numMatches?: number            // Total number of matches
  appliedLimit?: number          // Limit that was applied
  appliedOffset?: number         // Offset that was applied
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `true`
- `strict`: `true`
- `getPath`: Returns `input.path || W0()` (CWD)

**Key Features**:
- Full regex syntax support
- File filtering via glob or type parameters
- Three output modes: content (matching lines), files_with_matches (file paths), count (match counts)
- Context lines support (-A, -B, -C)
- Case-insensitive search
- Multiline pattern matching
- Head limit and offset for pagination
- Uses ripgrep syntax (literal braces need escaping)
- Excludes .git, .svn, .hg, .bzr directories by default

**Input Examples**:
```json
[
  { "pattern": "TODO", "output_mode": "files_with_matches" },
  { "pattern": "function.*export", "glob": "*.ts", "output_mode": "content", "-n": true },
  { "pattern": "error", "-i": true, "type": "js" }
]
```

**Implementation** (chunks.125.mjs:674-812):
```javascript
// ============================================
// Grep Tool - call() implementation
// Location: chunks.125.mjs:674
// ============================================
async function grepToolCall(input, context) {
  const {
    pattern,
    path: searchPath,
    glob,
    type,
    output_mode = "files_with_matches",
    "-B": linesBefore,
    "-A": linesAfter,
    "-C": linesContext,
    "-n": showLineNumbers = true,
    "-i": caseInsensitive = false,
    head_limit: headLimit,
    offset: offsetValue = 0,
    multiline = false
  } = input;

  const { abortController, getAppState } = context;

  // Step 1: Get cap experiment value for default head_limit
  const { cap } = await getExperimentValue("tengu_cap_grep_results", { cap: 0 });
  const effectiveHeadLimit = headLimit !== undefined ? headLimit : (cap > 0 ? cap : undefined);

  // Step 2: Resolve search path
  const searchDir = searchPath ? resolvePath(searchPath) : getCurrentWorkingDirectory();

  // Step 3: Build ripgrep arguments
  const args = ["--hidden"];

  // Exclude common VCS directories
  const excludedDirs = [".git", ".svn", ".hg", ".bzr"];
  for (const dir of excludedDirs) {
    args.push("--glob", `!${dir}`);
  }

  // Max column width
  args.push("--max-columns", "500");

  // Multiline mode
  if (multiline) {
    args.push("-U", "--multiline-dotall");
  }

  // Case sensitivity
  if (caseInsensitive) {
    args.push("-i");
  }

  // Output mode
  if (output_mode === "files_with_matches") {
    args.push("-l");  // List files with matches
  } else if (output_mode === "count") {
    args.push("-c");  // Count matches per file
  }

  // Line numbers (content mode only)
  if (showLineNumbers && output_mode === "content") {
    args.push("-n");
  }

  // Context lines (content mode only)
  if (linesContext !== undefined && output_mode === "content") {
    args.push("-C", linesContext.toString());
  } else if (output_mode === "content") {
    if (linesBefore !== undefined) {
      args.push("-B", linesBefore.toString());
    }
    if (linesAfter !== undefined) {
      args.push("-A", linesAfter.toString());
    }
  }

  // Pattern (add -e flag if pattern starts with -)
  if (pattern.startsWith("-")) {
    args.push("-e", pattern);
  } else {
    args.push(pattern);
  }

  // File type filter
  if (type) {
    args.push("--type", type);
  }

  // Glob patterns
  if (glob) {
    const globPatterns = [];
    const patterns = glob.split(/\s+/);

    for (const pat of patterns) {
      if (pat.includes("{") && pat.includes("}")) {
        // Brace expansion pattern
        globPatterns.push(pat);
      } else {
        // Split by comma
        globPatterns.push(...pat.split(",").filter(Boolean));
      }
    }

    for (const globPattern of globPatterns.filter(Boolean)) {
      args.push("--glob", globPattern);
    }
  }

  // Step 4: Add permission-based exclusions
  const appState = await getAppState();
  const deniedPatterns = getDeniedPaths(
    appState.toolPermissionContext,
    getCurrentWorkingDirectory()
  );

  for (const deniedPattern of deniedPatterns) {
    const globPattern = deniedPattern.startsWith("/")
      ? `!${deniedPattern}`
      : `!**/${deniedPattern}`;
    args.push("--glob", globPattern);
  }

  // Step 5: Execute ripgrep
  const results = await executeRipgrep(args, searchDir, abortController.signal);

  // Step 6: Process results based on output mode
  if (output_mode === "content") {
    // Content mode: return matching lines
    const processedResults = results.map((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        const filePath = line.substring(0, colonIndex);
        const rest = line.substring(colonIndex);
        return makeRelativePath(filePath) + rest;
      }
      return line;
    });

    const slicedResults = sliceResults(processedResults, effectiveHeadLimit, offsetValue);

    return {
      data: {
        mode: "content",
        numFiles: 0,
        filenames: [],
        content: slicedResults.join('\n'),
        numLines: slicedResults.length,
        ...(effectiveHeadLimit !== undefined && { appliedLimit: effectiveHeadLimit }),
        ...(offsetValue > 0 && { appliedOffset: offsetValue })
      }
    };
  }

  if (output_mode === "count") {
    // Count mode: return match counts per file
    const processedResults = results.map((line) => {
      const colonIndex = line.lastIndexOf(":");
      if (colonIndex > 0) {
        const filePath = line.substring(0, colonIndex);
        const count = line.substring(colonIndex);
        return makeRelativePath(filePath) + count;
      }
      return line;
    });

    const slicedResults = sliceResults(processedResults, effectiveHeadLimit, offsetValue);

    // Calculate total matches and files
    let totalMatches = 0;
    let totalFiles = 0;
    for (const line of slicedResults) {
      const colonIndex = line.lastIndexOf(":");
      if (colonIndex > 0) {
        const countStr = line.substring(colonIndex + 1);
        const count = parseInt(countStr, 10);
        if (!isNaN(count)) {
          totalMatches += count;
          totalFiles += 1;
        }
      }
    }

    return {
      data: {
        mode: "count",
        numFiles: totalFiles,
        filenames: [],
        content: slicedResults.join('\n'),
        numMatches: totalMatches,
        ...(effectiveHeadLimit !== undefined && { appliedLimit: effectiveHeadLimit }),
        ...(offsetValue > 0 && { appliedOffset: offsetValue })
      }
    };
  }

  // Default: files_with_matches mode
  // Get file stats for sorting by modification time
  const fileStats = await Promise.all(
    results.map(file => fs.stat(file))
  );

  // Sort by modification time (most recent first), then by name
  const sortedFiles = results
    .map((file, idx) => [file, fileStats[idx]])
    .sort((a, b) => {
      const timeDiff = (b[1].mtimeMs ?? 0) - (a[1].mtimeMs ?? 0);
      if (timeDiff === 0) {
        return a[0].localeCompare(b[0]);
      }
      return timeDiff;
    })
    .map(([file]) => file);

  // Apply offset and limit
  const slicedFiles = sliceResults(sortedFiles, effectiveHeadLimit, offsetValue);

  // Make paths relative
  const relativeFiles = slicedFiles.map(makeRelativePath);

  return {
    data: {
      mode: "files_with_matches",
      filenames: relativeFiles,
      numFiles: relativeFiles.length,
      ...(effectiveHeadLimit !== undefined && { appliedLimit: effectiveHeadLimit }),
      ...(offsetValue > 0 && { appliedOffset: offsetValue })
    }
  };
}

// Helper: Slice results with offset and limit
function sliceResults(array, limit, offset = 0) {
  if (limit === undefined) {
    return array.slice(offset);
  }
  return array.slice(offset, offset + limit);
}

// Helper: Make path relative to CWD
function makeRelativePath(absolutePath) {
  const cwd = getCurrentWorkingDirectory();
  const relative = path.relative(cwd, absolutePath);
  return relative.startsWith("..") ? absolutePath : relative;
}
```

---

## Web Access Tools

### WebFetch

**Name**: `WebFetch`
**Constant**: `$X = "WebFetch"` (chunks.19.mjs:428)

**Description**: Fetches content from a specified URL and processes it using an AI model.

**Input Schema**:
```typescript
{
  url: string (required)         // The URL to fetch content from (must be valid URL)
  prompt: string (required)      // The prompt to run on the fetched content
}
```

**Output Schema**:
```typescript
{
  content: string                // The model's response about the content
  redirectUrl?: string           // If redirected, the target URL
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `true`

**Key Features**:
- Fetches URL content and converts HTML to markdown
- Processes content with AI model using provided prompt
- HTTP URLs automatically upgraded to HTTPS
- Read-only, does not modify files
- Results may be summarized if content is very large
- 15-minute self-cleaning cache
- Handles redirects (returns redirect URL for cross-host redirects)
- Enterprise settings: `skipWebFetchPreflight` option available

---

### WebSearch

**Name**: `WebSearch`
**Constant**: `WS = "WebSearch"` (chunks.19.mjs:2232)

**Description**: Allows Claude to search the web and use results to inform responses.

**Input Schema**:
```typescript
{
  query: string (required)       // The search query to use (min 2 chars)
  allowed_domains?: string[]     // Only include results from these domains
  blocked_domains?: string[]     // Never include results from these domains
}
```

**Output Schema**:
```typescript
{
  results: SearchResult[]        // Array of search results
}

interface SearchResult {
  title: string                  // Result title
  url: string                    // Result URL
  snippet: string                // Result snippet/description
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `true`

**Key Features**:
- Provides up-to-date information beyond Claude's knowledge cutoff
- Domain filtering (allow/block lists)
- Returns search results formatted as blocks with markdown hyperlinks
- Web search only available in the US
- Must include Sources section with all URLs in response

---

## Notebook Tools

### NotebookEdit

**Name**: `NotebookEdit`
**Constant**: `JS = "NotebookEdit"` (chunks.19.mjs:2192)

**Description**: Completely replaces the contents of a specific cell in a Jupyter notebook.

**Input Schema** (chunks.123.mjs:2023):
```typescript
{
  notebook_path: string (required)  // Absolute path to Jupyter notebook file
  cell_id?: string                  // ID of cell to edit
  new_source: string (required)     // New source for the cell
  cell_type?: "code" | "markdown"   // Type of cell (defaults to current type)
  edit_mode?: "replace" | "insert" | "delete"  // Edit mode (defaults to replace)
}
```

**Output Schema** (chunks.123.mjs:2029):
```typescript
{
  new_source: string             // New source code written to cell
  cell_id?: string               // ID of cell that was edited
  cell_type: "code" | "markdown" // Type of the cell
  language: string               // Programming language of notebook
  edit_mode: string              // Edit mode that was used
  error?: string                 // Error message if operation failed
}
```

**Properties**:
- `isConcurrencySafe`: `false`
- `isReadOnly`: `false`
- `getPath`: Returns `input.notebook_path`

**Key Features**:
- Edit mode: replace (default), insert, delete
- When inserting, new cell inserted after specified cell_id (or at beginning)
- Cell type required when using insert mode
- Must use absolute paths, not relative
- Cell numbering is 0-indexed

---

## Task Management Tools

### TodoWrite

**Name**: `TodoWrite`
**Constant**: `QEB = "TodoWrite"` (chunks.60.mjs:1124)

**Description**: Create and manage a structured task list for the current coding session.

**Input Schema** (chunks.60.mjs:1136):
```typescript
{
  todos: Todo[] (required)       // The updated todo list
}

interface Todo {
  content: string (required)     // Imperative form: "Run tests", "Build project"
  status: "pending" | "in_progress" | "completed" (required)
  activeForm: string (required)  // Present continuous: "Running tests", "Building project"
}
```

**Output Schema** (chunks.60.mjs:1138):
```typescript
{
  oldTodos: Todo[]               // Todo list before the update
  newTodos: Todo[]               // Todo list after the update
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `false`
- `strict`: `true`

**Key Features**:
- Tracks progress across multi-step tasks
- Exactly ONE task must be in_progress at any time
- Mark tasks complete IMMEDIATELY after finishing
- Only mark complete when FULLY accomplished (no errors, blockers)
- Break complex tasks into smaller, manageable steps
- Task descriptions must have two forms: content (imperative) and activeForm (present continuous)

**When to Use**:
1. Complex multi-step tasks (3+ steps)
2. Non-trivial complex tasks
3. User explicitly requests todo list
4. User provides multiple tasks (numbered or comma-separated)
5. After receiving new instructions
6. When starting work on a task (mark in_progress)
7. After completing a task (mark completed and add follow-ups)

**When NOT to Use**:
1. Single straightforward task
2. Trivial task (< 3 steps)
3. Task can be completed quickly
4. Purely conversational/informational request

**Input Examples**:
```json
{
  "todos": [
    {
      "content": "Implement user authentication",
      "status": "in_progress",
      "activeForm": "Implementing user authentication"
    },
    {
      "content": "Add password hashing",
      "status": "pending",
      "activeForm": "Adding password hashing"
    },
    {
      "content": "Create login endpoint",
      "status": "completed",
      "activeForm": "Creating login endpoint"
    }
  ]
}
```

---

## Task System Tools (Experimental)

### TaskCreate

**Name**: `TaskCreate`
**Constant**: `jW9 = "TaskCreate"` (chunks.146.mjs:191)

**Description**: Create a new task in the task list.

**Input Schema** (chunks.146.mjs:360):
```typescript
{
  subject: string (required)     // Brief title for the task
  description: string (required) // Detailed description of what needs to be done
}
```

**Output Schema** (chunks.146.mjs:363):
```typescript
{
  task: {
    id: string                   // Generated task ID
    subject: string              // Task title
  }
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `false`
- `isEnabled`: Returns `false` (experimental/disabled)

**Note**: This is part of an experimental task management system that is currently disabled (`isEnabled()` returns `false`).

---

## LSP (Language Server Protocol) Tools

### LSP Operations

**Name**: LSP tool (various operations)
**Constant**: `DW9` (chunks.146.mjs:27)

**Description**: Performs LSP operations for code intelligence.

**Input Schema** (chunks.146.mjs:15):
```typescript
{
  operation: "goToDefinition" | "findReferences" | "hover" | "documentSymbol" | "workspaceSymbol" (required)
  filePath: string (required)    // Absolute or relative path to file
  line: number (required)        // Line number (0-indexed)
  character: number (required)   // Character offset (0-indexed) on the line
}
```

**Output Schema** (chunks.146.mjs:20):
```typescript
{
  operation: string              // The LSP operation that was performed
  result: string                 // Formatted result of the LSP operation
  filePath: string               // File path the operation was performed on
  resultCount?: number           // Number of results (definitions, references, symbols)
  fileCount?: number             // Number of files containing results
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `true`

**Validation**:
- File must exist
- Path must be a file (not directory)
- File must be accessible

**Operations**:
1. **goToDefinition**: Find definition of symbol at cursor
2. **findReferences**: Find all references to symbol
3. **hover**: Get hover information for symbol
4. **documentSymbol**: Get symbols in current document
5. **workspaceSymbol**: Search for symbols in workspace

---

## Tool Metadata

### Common Tool Properties

#### isReadOnly vs isConcurrencySafe

**Read-Only Tools** (can run while file is being edited):
- Bash (for read-only commands)
- Read
- Glob
- Grep
- WebFetch
- WebSearch
- LSP operations

**Concurrency-Safe Tools** (can run in parallel):
- Bash (for read-only commands)
- Read
- Glob
- Grep
- WebFetch
- WebSearch
- TodoWrite
- TaskCreate
- LSP operations

**Not Concurrency-Safe** (must run sequentially):
- Write
- Edit
- NotebookEdit

#### Tool Constants Summary

```typescript
// File operations (chunks.16.mjs, chunks.19.mjs)
C9 = "Bash"           // Bash tool
d5 = "Read"           // Read tool
wX = "Write"          // Write tool
$5 = "Edit"           // Edit tool

// Search tools (chunks.19.mjs)
iK = "Glob"           // Glob tool
xY = "Grep"           // Grep tool

// Web tools (chunks.19.mjs)
$X = "WebFetch"       // WebFetch tool
WS = "WebSearch"      // WebSearch tool

// Notebook tools (chunks.19.mjs)
JS = "NotebookEdit"   // NotebookEdit tool

// Task tools (chunks.19.mjs, chunks.60.mjs, chunks.146.mjs)
A6 = "Task"           // Task tool
QEB = "TodoWrite"     // TodoWrite tool
jW9 = "TaskCreate"    // TaskCreate tool
```

---

## Agent & Subagent Tools

### Task (Subagent Launcher)

**Name**: `Task`
**Constant**: `A6 = "Task"` (chunks.19.mjs:2156)
**Object**: `jn` (chunks.145.mjs:1812-2015)

**Description**: Launch a new agent to handle complex, multi-step tasks autonomously.

**Input Schema** (chunks.145.mjs:1771):
```typescript
{
  description: string (required)    // Short (3-5 word) description of task
  prompt: string (required)         // Detailed task for agent to perform
  subagent_type: string (required)  // Type of specialized agent
  model?: "sonnet" | "opus" | "haiku"  // Optional model override
  run_in_background?: boolean       // Run agent asynchronously
  resume?: string                   // Optional agent ID to resume from
}
```

**Output Schema** (chunks.145.mjs:1803):
```typescript
{
  // Completed task
  result: string                    // Agent's final output
  agentId: string                   // ID of the agent
}
// OR
{
  // Async task launched
  agentId: string                   // ID of background agent
  status: "running"                 // Current status
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `true`
- In `ALWAYS_EXCLUDED_TOOLS` set (not available to subagents)

**Available Subagent Types**:
- `general-purpose`: General agent with all tools
- `Explore`: Fast codebase exploration (quick/medium/thorough)
- `Plan`: Software architect for implementation planning
- `claude-code-guide`: Documentation lookup agent
- `statusline-setup`: Configure status line settings

---

### AgentOutputTool

**Name**: `AgentOutputTool`
**Constant**: `Wa = "AgentOutputTool"` (chunks.139.mjs:1576)

**Description**: Retrieves output from a completed async agent task.

**Input Schema** (chunks.145.mjs:1683):
```typescript
{
  agentId: string (required)        // The agent ID to retrieve results for
  block?: boolean                   // Whether to block until results ready (default true)
  wait_up_to?: number               // Max time to wait in seconds (0-300, default 150)
}
```

**Output Schema**:
```typescript
{
  agentId: string
  status: "running" | "completed" | "failed"
  result?: string                   // Agent output (if completed)
  error?: string                    // Error message (if failed)
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `true`

**Usage Notes**:
- Use `block=false` for immediate status check
- Use `block=true` when waiting for results (blocks execution)
- Agent IDs can be found from Task tool output

---

### AskUserQuestion

**Name**: `AskUserQuestion`
**Constant**: `pJ` (chunks.153.mjs)

**Description**: Ask the user questions during execution for clarification, preferences, or decisions.

**Input Schema**:
```typescript
{
  questions: Question[] (required)  // 1-4 questions to ask
}

interface Question {
  question: string (required)       // The question text (end with ?)
  header: string (required)         // Short label (max 12 chars)
  options: Option[] (required)      // 2-4 options per question
  multiSelect: boolean (required)   // Allow multiple answers
}

interface Option {
  label: string (required)          // Display text (1-5 words)
  description: string (required)    // Explanation of what this option means
}
```

**Output Schema**:
```typescript
{
  answers: Record<string, string>   // User's selected answers
}
```

**Input Examples**:
```json
{
  "questions": [
    {
      "question": "Which authentication method should we use?",
      "header": "Auth method",
      "options": [
        { "label": "JWT tokens", "description": "Stateless authentication using JSON Web Tokens" },
        { "label": "Session cookies", "description": "Server-side sessions with HTTP-only cookies" },
        { "label": "OAuth 2.0", "description": "Third-party authentication via OAuth providers" }
      ],
      "multiSelect": false
    }
  ]
}
```

```json
{
  "questions": [
    {
      "question": "Which features do you want to enable?",
      "header": "Features",
      "options": [
        { "label": "Dark mode", "description": "Add dark theme support to the application" },
        { "label": "Notifications", "description": "Enable push notifications for updates" },
        { "label": "Analytics", "description": "Track user interactions for insights" },
        { "label": "Caching", "description": "Cache API responses for better performance" }
      ],
      "multiSelect": true
    }
  ]
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `true`
- In `ALWAYS_EXCLUDED_TOOLS` set (not available to subagents)

**Usage Notes**:
- Users can always select "Other" for custom input
- Use `multiSelect: true` for non-mutually exclusive choices
- Use when gathering preferences, clarifying ambiguity, or getting decisions

### AskUserQuestion Classification and Plan Mode Integration

#### Classification System

AskUserQuestion uses a **dual classification system** that determines where it can be used:

**1. Context-Based Exclusion (ALWAYS_EXCLUDED_TOOLS)**:

```javascript
// Location: chunks.146.mjs:949
// AskUserQuestion is in ALWAYS_EXCLUDED_TOOLS (CTA)
const ALWAYS_EXCLUDED_TOOLS = new Set([
  // ...
  AskUserQuestionTool.name,   // pJ - "AskUserQuestion"
  // ...
])
```

This means AskUserQuestion is **excluded from ALL subagents**, including:
- Explore agents
- Plan agents
- General-purpose agents
- Async/background agents
- Non-built-in agents

**2. Mode-Based Availability (Plan Mode)**:

AskUserQuestion is **NOT** in the plan mode `disallowedTools` array, which means:
- Main agent CAN use AskUserQuestion in plan mode
- It's designed for clarifying approaches before finalizing the plan

#### Availability Matrix

| Context | AskUserQuestion Available? | Reason |
|---------|---------------------------|--------|
| **Main Agent (normal mode)** | ✅ Yes | Not restricted |
| **Main Agent (plan mode)** | ✅ Yes | Not in plan mode disallowedTools |
| **Explore subagent** | ❌ No | In ALWAYS_EXCLUDED_TOOLS |
| **Plan subagent** | ❌ No | In ALWAYS_EXCLUDED_TOOLS |
| **Async/background agent** | ❌ No | Not in ASYNC_SAFE_TOOLS |
| **Non-built-in agent** | ❌ No | In BUILTIN_ONLY_TOOLS |

#### Design Rationale

**Why AskUserQuestion is excluded from subagents:**

1. **User Interaction Centralization**
   - Only main agent should interact with the user
   - Subagent questions would fragment the conversation

2. **Conversation Coherence**
   - Multiple agents asking questions would confuse the user
   - Main agent coordinates and synthesizes information

3. **Control Flow**
   - Main agent decides what clarifications are needed
   - Subagents should work autonomously with the context provided

4. **Permission Model**
   - Subagents run in restricted context
   - User approval flows through main agent

#### Plan Mode Usage Pattern

```javascript
// In plan mode, main agent CAN use AskUserQuestion:
{
  type: "tool_use",
  name: "AskUserQuestion",
  input: {
    questions: [{
      question: "Which database should we use for the cache layer?",
      header: "Cache DB",
      options: [
        { label: "Redis (Recommended)", description: "Distributed, persistent, supports TTL" },
        { label: "In-memory", description: "Fast, no external dependencies, lost on restart" },
        { label: "SQLite", description: "File-based, simple, good for single-instance" },
        { label: "Memcached", description: "Simple key-value, high performance, no persistence" }
      ],
      multiSelect: false
    }]
  }
}
```

**System Prompt Guidance (from plan mode prompt)**:

```
In plan mode, you should:
...
4. Use AskUserQuestion if you need to clarify the approach
...
```

#### Integration with ExitPlanMode

The ExitPlanMode tool prompt explicitly mentions AskUserQuestion:

```
## Handling Ambiguity in Plans
Before using this tool, ensure your plan is clear and unambiguous. If there are multiple valid approaches or unclear requirements:
1. Use the AskUserQuestion tool to clarify with the user
2. Ask about specific implementation choices (e.g., architectural patterns, which library to use)
3. Clarify any assumptions that could affect the implementation
4. Only proceed with ExitPlanMode after resolving ambiguities
```

This confirms that **AskUserQuestion is intentionally available during plan mode** for resolving ambiguities before implementation.

---

## Plan Mode Tools

### EnterPlanMode

**Name**: `EnterPlanMode`
**Constant**: `A71 = "EnterPlanMode"` (chunks.130.mjs)
**Object**: `cTA` (chunks.130.mjs:2336-2398)

**Description**: Enter plan mode for complex tasks requiring careful planning and exploration before implementation.

**Input Schema** (chunks.130.mjs):
```typescript
{
  // No parameters required - empty object
}
```

**Output Schema**:
```typescript
{
  message: string  // Confirmation that plan mode was entered
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `true`
- In `ALWAYS_EXCLUDED_TOOLS` set (not available to subagents)
- `checkPermissions()`: Returns `{ behavior: "ask", message: "Enter plan mode?" }`

**Full Tool Prompt (Id2)**:

**Location:** `chunks.130.mjs:2199-2272`

```javascript
// ============================================
// EnterPlanMode Tool Description Prompt
// Location: chunks.130.mjs:2199-2272
// ============================================

`Use this tool proactively when you're about to start a non-trivial implementation task. Getting user sign-off on your approach before writing code prevents wasted effort and ensures alignment. This tool transitions you into plan mode where you can explore the codebase and design an implementation approach for user approval.

## When to Use This Tool

**Prefer using EnterPlanMode** for implementation tasks unless they're simple. Use it when ANY of these conditions apply:

1. **New Feature Implementation**: Adding meaningful new functionality
   - Example: "Add a logout button" - where should it go? What should happen on click?
   - Example: "Add form validation" - what rules? What error messages?

2. **Multiple Valid Approaches**: The task can be solved in several different ways
   - Example: "Add caching to the API" - could use Redis, in-memory, file-based, etc.
   - Example: "Improve performance" - many optimization strategies possible

3. **Code Modifications**: Changes that affect existing behavior or structure
   - Example: "Update the login flow" - what exactly should change?
   - Example: "Refactor this component" - what's the target architecture?

4. **Architectural Decisions**: The task requires choosing between patterns or technologies
   - Example: "Add real-time updates" - WebSockets vs SSE vs polling
   - Example: "Implement state management" - Redux vs Context vs custom solution

5. **Multi-File Changes**: The task will likely touch more than 2-3 files
   - Example: "Refactor the authentication system"
   - Example: "Add a new API endpoint with tests"

6. **Unclear Requirements**: You need to explore before understanding the full scope
   - Example: "Make the app faster" - need to profile and identify bottlenecks
   - Example: "Fix the bug in checkout" - need to investigate root cause

7. **User Preferences Matter**: The implementation could reasonably go multiple ways
   - If you would use AskUserQuestion to clarify the approach, use EnterPlanMode instead
   - Plan mode lets you explore first, then present options with context

## When NOT to Use This Tool

Only skip EnterPlanMode for simple tasks:
- Single-line or few-line fixes (typos, obvious bugs, small tweaks)
- Adding a single function with clear requirements
- Tasks where the user has given very specific, detailed instructions
- Pure research/exploration tasks (use the Task tool with explore agent instead)

## What Happens in Plan Mode

In plan mode, you'll:
1. Thoroughly explore the codebase using Glob, Grep, and Read tools
2. Understand existing patterns and architecture
3. Design an implementation approach
4. Present your plan to the user for approval
5. Use AskUserQuestion if you need to clarify approaches
6. Exit plan mode with ExitPlanMode when ready to implement

## Examples

### GOOD - Use EnterPlanMode:
User: "Add user authentication to the app"
- Requires architectural decisions (session vs JWT, where to store tokens, middleware structure)

User: "Optimize the database queries"
- Multiple approaches possible, need to profile first, significant impact

User: "Implement dark mode"
- Architectural decision on theme system, affects many components

User: "Add a delete button to the user profile"
- Seems simple but involves: where to place it, confirmation dialog, API call, error handling, state updates

User: "Update the error handling in the API"
- Affects multiple files, user should approve the approach

### BAD - Don't use EnterPlanMode:
User: "Fix the typo in the README"
- Straightforward, no planning needed

User: "Add a console.log to debug this function"
- Simple, obvious implementation

User: "What files handle routing?"
- Research task, not implementation planning

## Important Notes

- This tool REQUIRES user approval - they must consent to entering plan mode
- If unsure whether to use it, err on the side of planning - it's better to get alignment upfront than to redo work
- Users appreciate being consulted before significant changes are made to their codebase`
```

**Tool Implementation (cTA)**:

**Location:** `chunks.130.mjs:2336-2398`

```javascript
// ============================================
// EnterPlanMode Tool Object
// Location: chunks.130.mjs:2336-2398
// ============================================

cTA = {
  name: "EnterPlanMode",  // A71
  async description() {
    return "Requests permission to enter plan mode for complex tasks requiring exploration and design"
  },
  async prompt() {
    return Id2  // Full description shown above
  },
  inputSchema: j.strictObject({}),     // No parameters
  outputSchema: j.object({
    message: j.string().describe("Confirmation that plan mode was entered")
  }),
  userFacingName() {
    return ""
  },
  isEnabled() {
    return true
  },
  isConcurrencySafe() {
    return true
  },
  isReadOnly() {
    return true  // Plan mode is read-only exploration
  },
  async checkPermissions(input) {
    return {
      behavior: "ask",
      message: "Enter plan mode?",
      updatedInput: input
    }
  },
  async call(A, Q) {
    let sessionId = e1();
    if (Q.agentId !== sessionId) {
      throw Error("EnterPlanMode tool cannot be used in agent contexts");
    }
    return {
      data: {
        message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
      }
    }
  },
  mapToolResultToToolResultBlockParam({ message }, toolUseId) {
    return {
      type: "tool_result",
      content: `${message}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
      tool_use_id: toolUseId
    }
  }
}
```

**Confirmation UI Component (Dd2)**:

**Location:** `chunks.130.mjs:2401-2449`

```javascript
// ============================================
// EnterPlanMode Confirmation UI
// Location: chunks.130.mjs:2401-2449
// ============================================

function Dd2({ toolUseConfirm: A, onDone: Q, onReject: B }) {
  function G(Z) {
    if (Z === "yes") Q(), A.onAllow({}, [{
      type: "setMode",
      mode: "plan",              // Set mode to plan
      destination: "session"     // Session-scoped (not persisted)
    }]);
    else Q(), B(), A.onReject()
  }

  return React.createElement(uJ, {
    color: "planMode",
    title: "Enter plan mode?"
  },
    React.createElement($, null, "Claude wants to enter plan mode to explore and design an implementation approach."),
    React.createElement($, { dimColor: true }, "In plan mode, Claude will:"),
    React.createElement($, { dimColor: true }, " · Explore the codebase thoroughly"),
    React.createElement($, { dimColor: true }, " · Identify existing patterns"),
    React.createElement($, { dimColor: true }, " · Design an implementation strategy"),
    React.createElement($, { dimColor: true }, " · Present a plan for your approval"),
    React.createElement($, { dimColor: true }, "No code changes will be made until you approve the plan.")
  )
}
```

**When to Use**:
- Multiple valid approaches exist
- Significant architectural decisions required
- Large-scale changes (many files)
- Unclear requirements need exploration
- User input needed for approach

---

### ExitPlanMode

**Name**: `ExitPlanMode`
**Constant**: `rRA = "ExitPlanMode"` (chunks.130.mjs)
**Object**: `gq` (chunks.130.mjs:1850-1928)

**Description**: Exit plan mode and proceed with implementation after user approves the plan.

**Input Schema** (chunks.130.mjs):
```typescript
{
  // Empty object - the tool reads plan from file automatically
  // Future extensibility: launchSwarm, teammateCount (not yet implemented)
}
```

**Output Schema**:
```typescript
{
  plan: string        // The plan content that was presented to the user
  isAgent: boolean    // Whether called from agent (vs main conversation)
  filePath?: string   // Path where plan was saved
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `true`
- In `ALWAYS_EXCLUDED_TOOLS` set (not available to subagents)
- **CRITICAL**: Plan file MUST exist before calling this tool

**Full Tool Prompt - Simple Variant (TXZ)**:

**Location:** `chunks.130.mjs:1702-1717`

```javascript
// ============================================
// ExitPlanMode Simple Variant (inline plan)
// Location: chunks.130.mjs:1702-1717
// ============================================

`Use this tool when you are in plan mode and have finished presenting your plan and are ready to code. This will prompt the user to exit plan mode.

IMPORTANT: Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool.

## Handling Ambiguity in Plans
Before using this tool, ensure your plan is clear and unambiguous. If there are multiple valid approaches or unclear requirements:
1. Use the AskUserQuestion tool to clarify with the user
2. Ask about specific implementation choices (e.g., architectural patterns, which library to use)
3. Clarify any assumptions that could affect the implementation
4. Only proceed with ExitPlanMode after resolving ambiguities

## Examples

1. Initial task: "Search for and understand the implementation of vim mode in the codebase" - Do not use the exit plan mode tool because you are not planning the implementation steps of a task.
2. Initial task: "Help me implement yank mode for vim" - Use the exit plan mode tool after you have finished planning the implementation steps of the task.
3. Initial task: "Add a new feature to handle user authentication" - If unsure about auth method (OAuth, JWT, etc.), use AskUserQuestion first, then use exit plan mode tool after clarifying the approach.`
```

**Full Tool Prompt - File-Based Variant (am2)**:

**Location:** `chunks.130.mjs:1717-1741`

```javascript
// ============================================
// ExitPlanMode File-Based Variant (plan in file)
// Location: chunks.130.mjs:1717-1741
// ============================================

`Use this tool when you are in plan mode and have finished writing your plan to the plan file and are ready for user approval.

## How This Tool Works
- You should have already written your plan to the plan file specified in the plan mode system message
- This tool does NOT take the plan content as a parameter - it will read the plan from the file you wrote
- This tool simply signals that you're done planning and ready for the user to review and approve
- The user will see the contents of your plan file when they review it

## When to Use This Tool
IMPORTANT: Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool.

## Handling Ambiguity in Plans
Before using this tool, ensure your plan is clear and unambiguous. If there are multiple valid approaches or unclear requirements:
1. Use the AskUserQuestion tool to clarify with the user
2. Ask about specific implementation choices (e.g., architectural patterns, which library to use)
3. Clarify any assumptions that could affect the implementation
4. Edit your plan file to incorporate user feedback
5. Only proceed with ExitPlanMode after resolving ambiguities and updating the plan file

## Examples

1. Initial task: "Search for and understand the implementation of vim mode in the codebase" - Do not use the exit plan mode tool because you are not planning the implementation steps of a task.
2. Initial task: "Help me implement yank mode for vim" - Use the exit plan mode tool after you have finished planning the implementation steps of the task.
3. Initial task: "Add a new feature to handle user authentication" - If unsure about auth method (OAuth, JWT, etc.), use AskUserQuestion first, then use exit plan mode tool after clarifying the approach.`
```

**Tool Implementation (gq)**:

**Location:** `chunks.130.mjs:1850-1928`

```javascript
// ============================================
// ExitPlanMode Tool Object
// Location: chunks.130.mjs:1850-1928
// ============================================

gq = {
  name: "ExitPlanMode",  // rRA
  inputSchema: j.strictObject({}).passthrough(),  // Accepts any properties (future extensibility)
  outputSchema: j.object({
    plan: j.string().describe("The plan that was presented to the user"),
    isAgent: j.boolean(),
    filePath: j.string().optional().describe("The file path where the plan was saved")
  }),
  async call(A, Q) {
    let sessionId = e1(),
      isAgent = Q.agentId !== sessionId,
      planFilePath = yU(Q.agentId),        // getPlanFilePath()
      planContent = xU(Q.agentId);         // readPlanFile()

    // CRITICAL: Plan file must exist before calling ExitPlanMode
    if (!planContent) {
      throw Error(`No plan file found at ${planFilePath}. Please write your plan to this file before calling ExitPlanMode.`);
    }

    return {
      data: {
        plan: planContent,     // Read plan from file
        isAgent: isAgent,      // Is this being called from agent (vs main conversation)
        filePath: planFilePath
      }
    }
  },
  mapToolResultToToolResultBlockParam({ isAgent, plan, filePath }, toolUseId) {
    if (isAgent) {
      // Sub-agent context - just confirm approval
      return {
        type: "tool_result",
        content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
        tool_use_id: toolUseId
      };
    }

    // Main conversation context - start implementing
    return {
      type: "tool_result",
      content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${filePath}
You can refer back to it if needed during implementation.

## Approved Plan:
${plan}`,
      tool_use_id: toolUseId
    }
  }
}
```

**Exit Confirmation UI - Mode Selection**:

**Location:** `chunks.130.mjs:2065-2085`

```javascript
// ============================================
// ExitPlanMode Confirmation UI - Three exit paths
// Location: chunks.130.mjs:2065-2085
// ============================================

// User can choose from three exit modes:

if (response === "yes-bypass-permissions") {
  analytics("tengu_plan_exit", { outcome: response });
  setHasExitedPlanMode(true);

  // Dispatch mode change
  dispatchAction({
    type: "setMode",
    mode: "bypassPermissions",  // Auto-approve ALL tools
    destination: "session"
  });
}
else if (response === "yes-accept-edits") {
  analytics("tengu_plan_exit", { outcome: response });
  setHasExitedPlanMode(true);

  dispatchAction({
    type: "setMode",
    mode: "acceptEdits",        // Auto-approve file edits only
    destination: "session"
  });
}
else if (response === "yes-default") {
  analytics("tengu_plan_exit", { outcome: response });
  setHasExitedPlanMode(true);

  dispatchAction({
    type: "setMode",
    mode: "default",            // Ask for each action
    destination: "session"
  });
}
```

**Exit Mode Options**:

| Mode | Description | Auto-Approved Tools |
|------|-------------|---------------------|
| `default` | Ask for each action | None (user confirms each) |
| `acceptEdits` | Auto-approve file edits | Write, Edit, NotebookEdit |
| `bypassPermissions` | Auto-approve all tools | All tools |

---

## Background Shell Tools

### BashOutput

**Name**: `BashOutput`
**Object**: `CY1` (chunks.145.mjs:2281-2400)

**Description**: Retrieves output from a running or completed background bash shell.

**Input Schema**:
```typescript
{
  bash_id: string (required)        // ID of background shell
  filter?: string                   // Optional regex to filter output lines
}
```

**Output Schema**:
```typescript
{
  shellId: string
  command: string
  status: "running" | "completed" | "failed" | "killed"
  exitCode: number | null
  stdout: string
  stderr: string
  stdoutLines: number
  stderrLines: number
  timestamp: string                 // ISO timestamp
  filterPattern?: string            // Applied filter (if any)
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `true`

**Usage Notes**:
- Shell IDs from Bash tool with `run_in_background: true`
- Filter param uses regex to filter output lines
- Use to monitor long-running background commands

---

### KillShell

**Name**: `KillShell`
**Object**: `HY1` (chunks.145.mjs)

**Description**: Kills a running background bash shell by its ID.

**Input Schema**:
```typescript
{
  shell_id: string (required)       // ID of background shell to kill
}
```

**Output Schema**:
```typescript
{
  success: boolean
  message?: string
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `false`

**Usage Notes**:
- Use to terminate long-running or stuck background processes
- Shell IDs can be found from Bash tool output or BashOutput results

---

## Extension Tools

### Skill

**Name**: `Skill`
**Object**: `lD` (chunks.146.mjs)

**Description**: Execute a skill within the main conversation.

**Input Schema**:
```typescript
{
  skill: string (required)          // Skill name (no arguments)
}
```

**Output Schema**:
```typescript
{
  result: string                    // Skill execution output
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `true`
- In `ASYNC_SAFE_TOOLS` set (available to async agents)

**Usage Notes**:
- Invoke skills by name (e.g., "pdf", "xlsx")
- Skills provide specialized capabilities
- Only use skills listed in available_skills
- Do not invoke already-running skills

---

### SlashCommand

**Name**: `SlashCommand`
**Object**: `QV` (chunks.146.mjs)

**Description**: Execute a slash command within the main conversation.

**Input Schema**:
```typescript
{
  command: string (required)        // Slash command with arguments (e.g., "/review-pr 123")
}
```

**Output Schema**:
```typescript
{
  result: string                    // Command execution output
}
```

**Properties**:
- `isConcurrencySafe`: `true`
- `isReadOnly`: `true`
- In `ASYNC_SAFE_TOOLS` set (available to async agents)

**Usage Notes**:
- Only use for custom slash commands in Available Commands list
- Do NOT use for built-in CLI commands (/help, /clear)
- Wait for `<command-message>` confirmation before proceeding

---

## Tool Discovery

Tools are defined in the following source files:

- **chunks.106.mjs**: Bash tool
- **chunks.88.mjs**: Read tool
- **chunks.122.mjs**: Write tool
- **chunks.123.mjs**: Edit, NotebookEdit tools
- **chunks.125.mjs**: Glob, Grep tools
- **chunks.60.mjs**: TodoWrite tool
- **chunks.146.mjs**: TaskCreate, LSP operations
- **chunks.94.mjs, chunks.95.mjs**: WebFetch, WebSearch tool references

---

## Tool Classification and Filtering System

### Overview

Claude Code implements a sophisticated tool restriction system that controls which tools are available in different execution contexts. This is crucial for plan mode, subagent execution, and async operations.

### Tool Restriction Sets

Three constant sets control tool availability:

#### ALWAYS_EXCLUDED_TOOLS (CTA)

**Location:** `chunks.146.mjs:949`

Tools that are **NEVER available to subagents**:

```javascript
// ============================================
// ALWAYS_EXCLUDED_TOOLS - Never for subagents
// Location: chunks.146.mjs:949
// ============================================

const ALWAYS_EXCLUDED_TOOLS = new Set([
  ExitPlanModeTool.name,      // gq - "ExitPlanMode"
  ENTER_PLAN_MODE_NAME,       // A71 - "EnterPlanMode"
  TASK_TOOL_NAME,             // A6 - "Task"
  AskUserQuestionTool.name,   // pJ - "AskUserQuestion"
  DY1,                        // (unknown/internal)
])
```

**Rationale:**
- **EnterPlanMode/ExitPlanMode**: Only main agent should control mode transitions
- **Task**: Prevents subagents from spawning more subagents (recursion control)
- **AskUserQuestion**: User interaction should be centralized at main agent level

#### BUILTIN_ONLY_TOOLS (Qf2)

**Location:** `chunks.146.mjs:949`

Inherits from `ALWAYS_EXCLUDED_TOOLS`. Only available to built-in agents (not custom agents).

```javascript
// BUILTIN_ONLY_TOOLS inherits from ALWAYS_EXCLUDED_TOOLS
const BUILTIN_ONLY_TOOLS = new Set([
  ...ALWAYS_EXCLUDED_TOOLS    // All CTA tools
])
```

#### ASYNC_SAFE_TOOLS (Bf2)

**Location:** `chunks.146.mjs:949`

Whitelist of tools that can safely run in async/background agents:

```javascript
// ============================================
// ASYNC_SAFE_TOOLS - Whitelist for async agents
// Location: chunks.146.mjs:949
// ============================================

const ASYNC_SAFE_TOOLS = new Set([
  ReadTool.name,              // n8 - "Read"
  EditTool.name,              // ZSA - "Edit"
  TodoWriteTool.name,         // BY - "TodoWrite"
  GrepTool.name,              // Py - "Grep"
  WebSearchTool.name,         // nV - "WebSearch"
  GlobTool.name,              // zO - "Glob"
  BASH_TOOL_NAME,             // C9 - "Bash"
  SkillTool.name,             // lD - "Skill"
  SlashCommandTool.name,      // QV - "SlashCommand"
  WebFetchTool.name,          // kP - "WebFetch"
])
```

### filterToolsByContext() Implementation

**Location:** `chunks.125.mjs:1116-1128`

This function filters the tool list based on agent context:

```javascript
// ============================================
// filterToolsByContext - Filter tools for subagent context
// Location: chunks.125.mjs:1116-1128
// ============================================

// ORIGINAL (for source lookup):
function bz0({ tools: A, isBuiltIn: Q, isAsync: B }) {
  return A.filter((G) => {
    if (process.env.CLAUDE_CODE_ALLOW_MCP_TOOLS_FOR_SUBAGENTS && G.name.startsWith("mcp__"))
      return !0;
    if (CTA.has(G.name)) return !1;
    if (!Q && Qf2.has(G.name)) return !1;
    if (B && !Bf2.has(G.name)) return !1;
    return !0
  })
}

// READABLE (for understanding):
function filterToolsByContext({ tools, isBuiltIn, isAsync }) {
  return tools.filter((tool) => {
    // Step 1: Allow MCP tools if env var set (special override)
    if (process.env.CLAUDE_CODE_ALLOW_MCP_TOOLS_FOR_SUBAGENTS &&
        tool.name.startsWith("mcp__")) {
      return true
    }

    // Step 2: Exclude always-banned tools (CTA)
    // These are NEVER available to any subagent
    if (ALWAYS_EXCLUDED_TOOLS.has(tool.name)) {
      return false
    }

    // Step 3: Non-built-in agents have restricted tool access (Qf2)
    // Custom agents can't use built-in-only tools
    if (!isBuiltIn && BUILTIN_ONLY_TOOLS.has(tool.name)) {
      return false
    }

    // Step 4: Async agents can only use curated whitelist (Bf2)
    // Background agents have strict tool limitations
    if (isAsync && !ASYNC_SAFE_TOOLS.has(tool.name)) {
      return false
    }

    return true
  })
}

// Mapping: A→tools, Q→isBuiltIn, B→isAsync, G→tool
// CTA→ALWAYS_EXCLUDED_TOOLS, Qf2→BUILTIN_ONLY_TOOLS, Bf2→ASYNC_SAFE_TOOLS
```

### Tool Availability Matrix

| Tool | Main Agent | Subagents | Async Agents | Plan Mode (Main) |
|------|------------|-----------|--------------|------------------|
| **AskUserQuestion** | ✅ Yes | ❌ No (CTA) | ❌ No | ✅ Yes |
| **EnterPlanMode** | ✅ Yes | ❌ No (CTA) | ❌ No | N/A |
| **ExitPlanMode** | ✅ Yes | ❌ No (CTA) | ❌ No | ✅ Yes |
| **Task** | ✅ Yes | ❌ No (CTA) | ❌ No | ❌ No* |
| **Read** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Edit** | ✅ Yes | ✅ Yes (filtered) | ✅ Yes | ❌ No* |
| **Write** | ✅ Yes | ❌ No | ❌ No | ✅ Plan file only* |
| **Glob** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Grep** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Bash** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Read-only only* |
| **WebFetch** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **WebSearch** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **TodoWrite** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **NotebookEdit** | ✅ Yes | ❌ No | ❌ No | ❌ No* |

*Plan mode restrictions are enforced via system prompt, not filterToolsByContext()

### Plan Mode Subagent Tool Restrictions

**Location:** `chunks.125.mjs:1407-1483`

Explore and Plan agents have additional restrictions beyond the standard filtering:

```javascript
// ============================================
// Explore/Plan Agent disallowed tools
// Location: chunks.125.mjs:1407, 1477
// ============================================

disallowedTools: [
  A6,      // "Task" tool - can't spawn more agents
  P51,     // Another variant
  $5,      // "Edit" tool - can't edit files
  wX,      // "Write" tool - can't create files
  JS       // "NotebookEdit" - can't edit notebooks
]

// NOTE: AskUserQuestion is NOT in disallowedTools for Explore/Plan agents
// However, it's already excluded via ALWAYS_EXCLUDED_TOOLS (CTA)
// This is why AskUserQuestion is available to main agent but not subagents
```

### Key Insights

1. **Dual Classification for AskUserQuestion:**
   - Excluded from subagents via `ALWAYS_EXCLUDED_TOOLS`
   - Available to main agent in ALL modes (including plan mode)
   - Not in plan mode's `disallowedTools` array

2. **Plan Mode vs Subagent Restrictions:**
   - Plan mode main agent: System prompt enforces read-only behavior
   - Plan mode subagents: Code-level restrictions via `disallowedTools`

3. **MCP Tools Override:**
   - Can bypass subagent restrictions with `CLAUDE_CODE_ALLOW_MCP_TOOLS_FOR_SUBAGENTS` env var
   - Only applies to tools with `mcp__` prefix

---

## Notes

1. All file paths must be **absolute paths**, not relative paths
2. Tools that modify files require prior read to ensure file state consistency
3. Permission checking is performed via `checkPermissions()` method
4. Input validation is performed via `validateInput()` method
5. Tool results are mapped to Claude API format via `mapToolResultToToolResultBlockParam()`
6. Tools can provide custom rendering for UI via render methods (renderToolUseMessage, etc.)
7. Some tools support strict schema validation (`strict: true`)
8. Tools may define input examples for documentation purposes
