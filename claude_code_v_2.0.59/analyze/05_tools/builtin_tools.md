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
// Location: chunks.106.mjs:775
// ============================================
async function bashToolCall(input, context, toolUseId, metadata) {
  const { command, timeout, run_in_background, dangerouslyDisableSandbox } = input;
  const { abortController, setAppState, setToolJSX, messages } = context;

  // Step 1: Determine execution parameters
  const timeoutMs = timeout || getDefaultTimeout();  // Default 120000ms (2 min)
  const isConcurrencySafe = isReadOnlyCommand(command);
  const shouldSandbox = isSandboxingEnabled() && !dangerouslyDisableSandbox;
  const preventCwdChanges = context.agentId !== mainAgentId();

  // Step 2: Execute command generator
  const execution = executeCommandGenerator({
    input: input,
    abortController: abortController,
    setAppState: setAppState,
    setToolJSX: setToolJSX,
    preventCwdChanges: preventCwdChanges
  });

  // Step 3: Process execution results
  let stdout = "", stderr = "", exitCode = 0;
  let backgroundTaskId = undefined;

  for await (const event of execution) {
    if (event.type === "progress") {
      // Emit progress updates
      yield {
        type: "tool_progress",
        fullOutput: event.fullOutput,
        output: event.output,
        elapsedTimeSeconds: event.elapsedTimeSeconds,
        totalLines: event.totalLines
      };
    } else {
      // Final result
      stdout = event.stdout;
      stderr = event.stderr;
      exitCode = event.code;
      backgroundTaskId = event.backgroundTaskId;
    }
  }

  // Step 4: Track metrics
  trackGitOperations(command, exitCode);  // Track git commits, PR creation

  // Step 5: Handle MCP tool output (if structured content)
  let structuredContent = undefined;
  if (isMCPCommand(command)) {
    const mcpResult = await parseMCPOutput(stdout, command);
    if (mcpResult) {
      structuredContent = mcpResult.structuredContent;
      stdout = mcpResult.stdout;
    }
  }

  // Step 6: Return result
  return {
    data: {
      stdout: stdout,
      stderr: stderr,
      summary: undefined,  // May be populated for large outputs
      interrupted: abortController.signal.aborted,
      isImage: detectImageData(stdout),
      backgroundTaskId: backgroundTaskId,
      structuredContent: structuredContent,
      returnCodeInterpretation: interpretExitCode(exitCode, command)
    }
  };
}

// Helper: Determine if command is read-only
function isReadOnlyCommand(command) {
  const commandType = getCommandType(command);
  return commandBehaviorCheck(command).behavior === "allow";
}

// Helper: Track git operations
function trackGitOperations(command, exitCode) {
  if (exitCode !== 0) return;

  if (command.match(/\bgit\s+commit\b/)) {
    trackEvent("tengu_git_operation", { operation: "commit" });
    if (command.match(/--amend\b/)) {
      trackEvent("tengu_git_operation", { operation: "commit_amend" });
    }
    incrementGitCommitCounter();
  }

  if (command.match(/\bgh\s+pr\s+create\b/) || command.match(/\bglab\s+mr\s+create\b/)) {
    trackEvent("tengu_git_operation", { operation: "pr_create" });
    incrementPRCounter();
  }
}
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

**Implementation** (chunks.88.mjs:1258-1400):
```javascript
// ============================================
// Read Tool - call() implementation
// Location: chunks.88.mjs:1258
// ============================================
async function readToolCall(input, context, toolUseId, metadata) {
  const { file_path, offset = 1, limit = undefined } = input;
  const { readFileState, getAppState } = context;

  // Step 1: Resolve absolute path
  const absolutePath = resolvePath(file_path);

  // Step 2: Check file type
  const fileType = detectFileType(absolutePath);

  // Step 3: Handle different file types
  switch (fileType) {
    case "image": {
      // Read image file
      const imageData = fs.readFileSync(absolutePath);
      const base64 = imageData.toString('base64');
      const mimeType = detectMimeType(absolutePath);
      const originalSize = imageData.length;

      return {
        data: {
          type: "image",
          file: {
            filePath: file_path,
            base64: base64,
            type: mimeType,
            originalSize: originalSize
          }
        }
      };
    }

    case "pdf": {
      // Read PDF file
      const pdfData = fs.readFileSync(absolutePath);
      const base64 = pdfData.toString('base64');
      const originalSize = pdfData.length;

      return {
        data: {
          type: "pdf",
          file: {
            filePath: file_path,
            base64: base64,
            originalSize: originalSize
          }
        }
      };
    }

    case "notebook": {
      // Read Jupyter notebook
      const notebookContent = fs.readFileSync(absolutePath, 'utf-8');
      const notebook = JSON.parse(notebookContent);
      const cells = notebook.cells || [];

      return {
        data: {
          type: "notebook",
          file: {
            filePath: file_path,
            cells: cells
          }
        }
      };
    }

    case "text":
    default: {
      // Read text file
      const encoding = detectEncoding(absolutePath);
      const content = fs.readFileSync(absolutePath, { encoding });

      // Split into lines
      const lines = content.split(/\r?\n/);
      const totalLines = lines.length;

      // Apply offset and limit
      const startIndex = Math.max(0, offset - 1);
      const endIndex = limit ? Math.min(totalLines, startIndex + limit) : totalLines;
      const selectedLines = lines.slice(startIndex, endIndex);

      // Format with line numbers (cat -n style)
      const formattedContent = selectedLines
        .map((line, idx) => {
          const lineNum = startIndex + idx + 1;
          return `${lineNum.toString().padStart(6)}\t${line}`;
        })
        .join('\n');

      // Step 4: Update read file state
      readFileState.set(absolutePath, {
        content: content,
        timestamp: getFileModificationTime(absolutePath),
        offset: offset,
        limit: limit
      });

      // Step 5: Detect language
      const language = detectLanguage(absolutePath);

      // Step 6: Track file operation
      trackFileOperation({
        operation: "read",
        tool: "FileReadTool",
        filePath: absolutePath
      });

      // Step 7: Return result
      return {
        data: {
          type: "text",
          file: {
            filePath: file_path,
            content: formattedContent,
            language: language,
            numLines: totalLines,
            offsetApplied: offset,
            limitApplied: limit || totalLines,
            startLineNum: startIndex + 1,
            endLineNum: endIndex
          }
        }
      };
    }
  }
}

// Helper: Detect file type based on extension
function detectFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  // Image extensions
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'].includes(ext)) {
    return "image";
  }

  // PDF extension
  if (ext === '.pdf') {
    return "pdf";
  }

  // Jupyter notebook extension
  if (ext === '.ipynb') {
    return "notebook";
  }

  // Default to text
  return "text";
}

// Helper: Detect encoding (simplified)
function detectEncoding(filePath) {
  // Check for UTF-8 BOM, UTF-16, etc.
  const buffer = fs.readFileSync(filePath);

  // UTF-8 BOM
  if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
    return 'utf-8';
  }

  // UTF-16 LE BOM
  if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    return 'utf-16le';
  }

  // UTF-16 BE BOM
  if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
    return 'utf-16be';
  }

  // Default to UTF-8
  return 'utf-8';
}
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

**Implementation** (chunks.122.mjs:3371-3450):
```javascript
// ============================================
// Write Tool - call() implementation
// Location: chunks.122.mjs:3371
// ============================================
async function writeToolCall(input, context, toolUseId, metadata) {
  const { file_path, content } = input;
  const { readFileState, updateFileHistoryState, setAppState } = context;

  // Step 1: Resolve absolute path
  const absolutePath = resolvePath(file_path);
  const parentDir = path.dirname(absolutePath);

  // Step 2: Trigger pre-edit hook
  await hooks.beforeFileEdited(absolutePath);

  // Step 3: Check if file exists
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

## Notes

1. All file paths must be **absolute paths**, not relative paths
2. Tools that modify files require prior read to ensure file state consistency
3. Permission checking is performed via `checkPermissions()` method
4. Input validation is performed via `validateInput()` method
5. Tool results are mapped to Claude API format via `mapToolResultToToolResultBlockParam()`
6. Tools can provide custom rendering for UI via render methods (renderToolUseMessage, etc.)
7. Some tools support strict schema validation (`strict: true`)
8. Tools may define input examples for documentation purposes
