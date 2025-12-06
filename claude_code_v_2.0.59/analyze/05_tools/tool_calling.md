# Tool Calling System

This document describes how Claude Code implements tool calling, including the message cycle, tool use requests, result formatting, and execution patterns.

## Overview

Claude Code uses the Anthropic Messages API tool calling system. The basic flow is:

1. **User Message** → Claude receives user request with available tools
2. **Assistant Message with tool_use** → Claude requests one or more tool executions
3. **User Message with tool_result** → Tool results are sent back to Claude
4. **Assistant Message** → Claude responds based on tool results
5. Repeat as needed

---

## Tool Use / Tool Result Message Cycle

### Message Flow

```
┌──────────────┐
│ User Message │  Initial request
└──────┬───────┘
       │
       ▼
┌────────────────────────┐
│ Assistant Message      │  Claude's response
│ - Text content         │  May contain:
│ - tool_use blocks      │  - Thinking
│                        │  - Text
└──────┬─────────────────┘  - One or more tool_use
       │
       ▼
┌─────────────────────────┐
│ User Message            │  Tool results
│ - tool_result blocks    │  One tool_result per tool_use
└──────┬──────────────────┘
       │
       ▼
┌────────────────────────┐
│ Assistant Message      │  Claude's final response
│ - Text content         │  Based on tool results
└────────────────────────┘
```

### Tool Use Block Structure

When Claude wants to use a tool, it includes `tool_use` content blocks in its assistant message:

```typescript
{
  type: "assistant",
  content: [
    {
      type: "text",
      text: "I'll help you read that file."
    },
    {
      type: "tool_use",
      id: "toolu_01A1B2C3D4E5F6",      // Unique tool use ID
      name: "Read",                      // Tool name
      input: {                           // Tool input (validated against inputSchema)
        file_path: "/path/to/file.ts"
      }
    }
  ]
}
```

### Tool Result Block Structure

Claude Code executes the tool and returns the result in a user message with `tool_result` content blocks:

```typescript
{
  type: "user",
  content: [
    {
      type: "tool_result",
      tool_use_id: "toolu_01A1B2C3D4E5F6",  // Matches tool_use.id
      content: "File content here...",       // Tool output (string or array)
      is_error?: false                       // Optional error flag
    }
  ]
}
```

### Error Handling in Tool Results

When a tool encounters an error, the result includes `is_error: true`:

```typescript
{
  type: "tool_result",
  tool_use_id: "toolu_01A1B2C3D4E5F6",
  content: "File not found: /path/to/missing.ts",
  is_error: true
}
```

---

## How Claude Requests Tool Use

### Tool Definitions in API Request

Tools are provided to Claude in the API request via the `tools` parameter:

```typescript
interface AnthropicToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  }
}

// Example API request
{
  model: "claude-opus-4-5",
  messages: [...],
  tools: [
    {
      name: "Read",
      description: "Reads a file from the local filesystem...",
      input_schema: {
        type: "object",
        properties: {
          file_path: {
            type: "string",
            description: "The absolute path to the file to read"
          },
          limit: {
            type: "number",
            description: "The number of lines to read"
          }
        },
        required: ["file_path"]
      }
    }
  ]
}
```

### System Prompt with Tool Instructions

Claude receives detailed tool usage instructions in the system prompt, which includes:

1. **Tool descriptions** - What each tool does
2. **Usage guidelines** - When and how to use tools
3. **Best practices** - Parallel execution, error handling, etc.
4. **Constraints** - File paths must be absolute, read before write, etc.

Example system prompt excerpt:

```
You have access to a set of tools you can use to answer the user's question.

## Read Tool
Reads a file from the local filesystem.

Usage:
- The file_path parameter must be an absolute path, not a relative path
- By default, it reads up to 2000 lines starting from the beginning
- You can optionally specify a line offset and limit
- Results are returned using cat -n format, with line numbers starting at 1

IMPORTANT: You MUST read a file before editing or writing to it.
```

### Tool Choice

Claude Code can control tool usage via the `tool_choice` parameter:

```typescript
// Auto (default) - Claude decides whether to use tools
tool_choice: { type: "auto" }

// Any - Claude must use at least one tool
tool_choice: { type: "any" }

// Specific tool - Claude must use this specific tool
tool_choice: { type: "tool", name: "Read" }
```

---

## Result Formatting and Return

### Tool Call Execution Flow

```typescript
// ============================================
// Tool Execution Flow
// Source: Extracted from chunks.106.mjs, chunks.88.mjs, chunks.122.mjs
// ============================================

// 1. Tool is called with validated input
async function executeTool(toolUse, context) {
  const tool = getToolByName(toolUse.name);

  // 2. Validate input against schema (Zod validation)
  const validationResult = await tool.validateInput?.(toolUse.input, context);
  if (validationResult && !validationResult.result) {
    return {
      type: "tool_result",
      tool_use_id: toolUse.id,
      content: validationResult.message,
      is_error: true
    };
  }

  // 3. Check permissions
  const permissionResult = await tool.checkPermissions?.(toolUse.input, context);
  if (permissionResult.behavior === "deny") {
    return {
      type: "tool_result",
      tool_use_id: toolUse.id,
      content: "Permission denied",
      is_error: true
    };
  }

  // 3a. Handle prompt behavior (interactive mode)
  if (permissionResult.behavior === "prompt") {
    const userChoice = await promptUser({
      toolName: tool.name,
      input: toolUse.input,
      message: permissionResult.promptMessage
    });

    if (userChoice === "deny" || userChoice === "always_deny") {
      return {
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: "Permission denied by user",
        is_error: true
      };
    }

    // Update input if permissions modified it
    if (permissionResult.updatedInput) {
      toolUse.input = permissionResult.updatedInput;
    }
  }

  // 4. Execute tool
  const result = await tool.call(
    toolUse.input,
    context,
    toolUse.id,
    metadata
  );

  // 5. Map to tool result format
  return tool.mapToolResultToToolResultBlockParam(result.data, toolUse.id);
}

// ============================================
// Tool Dispatch System
// Handles concurrent and sequential execution
// ============================================
async function dispatchToolCalls(toolUses, context) {
  // Group tools by concurrency safety
  const concurrentTools = [];
  const sequentialTools = [];

  for (const toolUse of toolUses) {
    const tool = getToolByName(toolUse.name);

    if (tool.isConcurrencySafe(toolUse.input)) {
      concurrentTools.push(toolUse);
    } else {
      sequentialTools.push(toolUse);
    }
  }

  // Execute concurrent tools in parallel
  const concurrentResults = await Promise.all(
    concurrentTools.map(toolUse => executeTool(toolUse, context))
  );

  // Execute sequential tools one by one
  const sequentialResults = [];
  for (const toolUse of sequentialTools) {
    const result = await executeTool(toolUse, context);
    sequentialResults.push(result);
  }

  // Combine results in original order
  return [...concurrentResults, ...sequentialResults];
}
```

### Tool Result Mapping

Each tool implements `mapToolResultToToolResultBlockParam()` to convert internal results to the API format:

#### Example: Read Tool

```typescript
// Internal result from Read.call()
{
  data: {
    type: "text",
    file: {
      filePath: "/path/to/file.ts",
      content: "const x = 1;\nconst y = 2;",
      language: "typescript",
      numLines: 2,
      startLineNum: 1,
      endLineNum: 2
    }
  }
}

// Mapped to tool result
{
  type: "tool_result",
  tool_use_id: "toolu_01A1B2C3D4E5F6",
  content: "     1\tconst x = 1;\n     2\tconst y = 2;"
}
```

#### Example: Write Tool

```typescript
// Internal result from Write.call()
{
  data: {
    type: "create",
    filePath: "/path/to/newfile.ts",
    content: "export const x = 1;",
    structuredPatch: [],
    originalFile: null
  }
}

// Mapped to tool result (create)
{
  type: "tool_result",
  tool_use_id: "toolu_01A1B2C3D4E5F6",
  content: "File created successfully at: /path/to/newfile.ts"
}

// Mapped to tool result (update)
{
  type: "tool_result",
  tool_use_id: "toolu_01A1B2C3D4E5F6",
  content: "The file /path/to/file.ts has been updated. Here's the result of running `cat -n` on a snippet of the edited file:\n     1\texport const x = 2;"
}
```

#### Example: Bash Tool

```typescript
// Internal result from Bash.call()
{
  data: {
    stdout: "total 8\n-rw-r--r--  1 user  staff  123 Dec  7 10:00 file.txt",
    stderr: "",
    interrupted: false
  }
}

// Mapped to tool result
{
  type: "tool_result",
  tool_use_id: "toolu_01A1B2C3D4E5F6",
  content: "total 8\n-rw-r--r--  1 user  staff  123 Dec  7 10:00 file.txt"
}
```

### Multi-Content Tool Results

Some tool results can include multiple content blocks (e.g., text + image):

```typescript
{
  type: "tool_result",
  tool_use_id: "toolu_01A1B2C3D4E5F6",
  content: [
    {
      type: "text",
      text: "Here is the generated diagram:"
    },
    {
      type: "image",
      source: {
        type: "base64",
        media_type: "image/png",
        data: "iVBORw0KGgoAAAANS..."
      }
    }
  ]
}
```

---

## Parallel vs Sequential Tool Execution

### Parallel Execution

Claude can request multiple tools in a single assistant message. Claude Code can execute these in parallel when:

1. **All tools are concurrency-safe** (`isConcurrencySafe()` returns `true`)
2. **No dependencies between tools** (one doesn't need the result of another)
3. **No conflicting file operations** (different files or read-only)

Example parallel execution:

```typescript
// Claude's request
{
  type: "assistant",
  content: [
    {
      type: "tool_use",
      id: "toolu_01A",
      name: "Read",
      input: { file_path: "/path/to/file1.ts" }
    },
    {
      type: "tool_use",
      id: "toolu_01B",
      name: "Read",
      input: { file_path: "/path/to/file2.ts" }
    },
    {
      type: "tool_use",
      id: "toolu_01C",
      name: "Grep",
      input: { pattern: "TODO", output_mode: "files_with_matches" }
    }
  ]
}

// All three can execute in parallel (all are read-only and concurrency-safe)
const results = await Promise.all([
  executeTool(toolUse1, context),
  executeTool(toolUse2, context),
  executeTool(toolUse3, context)
]);
```

### Sequential Execution

Tools must execute sequentially when:

1. **Tool is not concurrency-safe** (`isConcurrencySafe()` returns `false`)
2. **Tools operate on the same file** (e.g., Write then Edit)
3. **Tools have dependencies** (e.g., Read then Write)

Example sequential execution:

```typescript
// Claude's request
{
  type: "assistant",
  content: [
    {
      type: "tool_use",
      id: "toolu_01A",
      name: "Read",
      input: { file_path: "/path/to/file.ts" }
    },
    {
      type: "tool_use",
      id: "toolu_01B",
      name: "Write",
      input: {
        file_path: "/path/to/file.ts",
        content: "updated content"
      }
    }
  ]
}

// Must execute sequentially
const result1 = await executeTool(toolUse1, context);  // Read first
const result2 = await executeTool(toolUse2, context);  // Then Write
```

### Concurrency Safety by Tool

**Concurrency-Safe Tools** (can run in parallel):
- Bash (for read-only commands)
- Read
- Glob
- Grep
- WebFetch
- WebSearch
- TodoWrite
- TaskCreate (disabled)
- LSP operations

**Not Concurrency-Safe** (must run sequentially):
- Bash (for write commands)
- Write
- Edit
- NotebookEdit

---

## Tool Progress Tracking

### Tool Progress Events

During tool execution, Claude Code can emit progress events:

```typescript
// Progress event structure
{
  type: "tool_progress",
  tool_use_id: "toolu_01A1B2C3D4E5F6",
  tool_name: "Bash",
  parent_tool_use_id?: string,          // For nested tool calls
  elapsed_time_seconds: 2.5,
  session_id: "session-123",
  uuid: "uuid-456"
}
```

### Background Task Execution

The Bash tool supports background execution:

```typescript
// Request background execution
{
  type: "tool_use",
  id: "toolu_01A",
  name: "Bash",
  input: {
    command: "npm install",
    run_in_background: true
  }
}

// Result includes background task ID
{
  type: "tool_result",
  tool_use_id: "toolu_01A",
  content: {
    stdout: "",
    stderr: "",
    backgroundTaskId: "bg-task-123",
    interrupted: false
  }
}

// Later, check output with BashOutput tool
{
  type: "tool_use",
  id: "toolu_01B",
  name: "BashOutput",
  input: {
    task_id: "bg-task-123"
  }
}
```

---

## Tool Validation and Error Handling

### Input Validation

Before execution, tools validate input:

```typescript
// ============================================
// Input Validation Interface
// Source: All tools implement this pattern
// ============================================
interface ValidationResult {
  result: boolean;           // Whether validation passed
  message?: string;          // Error message if validation failed
  errorCode?: number;        // Numeric error code
}

// ============================================
// Write Tool Validation Implementation
// Source: chunks.122.mjs:3341-3370
// ============================================
async validateInput({ file_path }, context) {
  // Step 1: Resolve absolute path
  const absolutePath = resolvePath(file_path);
  const appState = await context.getAppState();

  // Step 2: Check if path is denied by permission settings
  const denyMatch = findPathMatch(
    absolutePath,
    appState.toolPermissionContext.deniedPaths,
    "edit",
    "deny"
  );

  if (denyMatch !== null) {
    return {
      result: false,
      message: "File is in a directory that is denied by your permission settings.",
      errorCode: 1
    };
  }

  // Step 3: If file doesn't exist, validation passes (new file creation)
  if (!fs.existsSync(absolutePath)) {
    return { result: true };
  }

  // Step 4: Check if file was read before writing
  const fileState = context.readFileState.get(absolutePath);
  if (!fileState) {
    return {
      result: false,
      message: "File has not been read yet. Read it first before writing to it.",
      errorCode: 2
    };
  }

  // Step 5: Check if file was modified since it was read
  const currentModTime = getFileModificationTime(absolutePath);
  if (currentModTime > fileState.timestamp) {
    return {
      result: false,
      message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
      errorCode: 3
    };
  }

  return { result: true };
}

// ============================================
// Grep Tool Validation Implementation
// Source: chunks.125.mjs:594-609
// ============================================
async validateInput({ path }) {
  // Only validate if path is provided
  if (path) {
    const fs = getFileSystem();
    const absolutePath = resolvePath(path);

    // Check if path exists
    if (!fs.existsSync(absolutePath)) {
      return {
        result: false,
        message: `Path does not exist: ${path}`,
        errorCode: 1
      };
    }
  }

  return { result: true };
}

// ============================================
// Edit Tool Validation Implementation
// Similar pattern to Write, with additional old_string checks
// ============================================
async validateInput({ file_path, old_string, new_string, replace_all }, context) {
  const absolutePath = resolvePath(file_path);

  // Step 1: File must exist
  if (!fs.existsSync(absolutePath)) {
    return {
      result: false,
      message: `File does not exist: ${file_path}`,
      errorCode: 1
    };
  }

  // Step 2: Must have been read first
  const fileState = context.readFileState.get(absolutePath);
  if (!fileState) {
    return {
      result: false,
      message: "File has not been read yet. Read it first before editing.",
      errorCode: 2
    };
  }

  // Step 3: File must not have been modified
  const currentModTime = getFileModificationTime(absolutePath);
  if (currentModTime > fileState.timestamp) {
    return {
      result: false,
      message: "File has been modified since read. Read it again before editing.",
      errorCode: 3
    };
  }

  // Step 4: old_string and new_string must be different
  if (old_string === new_string) {
    return {
      result: false,
      message: "old_string and new_string must be different.",
      errorCode: 4
    };
  }

  // Step 5: old_string must be unique (unless replace_all is true)
  if (!replace_all) {
    const content = fileState.content;
    const occurrences = content.split(old_string).length - 1;

    if (occurrences === 0) {
      return {
        result: false,
        message: `old_string not found in file: ${old_string}`,
        errorCode: 5
      };
    }

    if (occurrences > 1) {
      return {
        result: false,
        message: `old_string appears ${occurrences} times in file. It must be unique. Use replace_all: true to replace all occurrences.`,
        errorCode: 6
      };
    }
  }

  return { result: true };
}
```

### Common Validation Rules

1. **File paths must be absolute** (not relative)
2. **Files must exist** (for Read, Edit, NotebookEdit)
3. **Files must be read first** (for Write, Edit on existing files)
4. **Files must not have been modified** (for Write, Edit)
5. **Edit old_string must be unique** (unless replace_all is true)
6. **Edit old_string and new_string must be different**

### Error Result Format

When validation or execution fails:

```typescript
{
  type: "tool_result",
  tool_use_id: "toolu_01A1B2C3D4E5F6",
  content: "File has been modified since read. Read it again before attempting to write it.",
  is_error: true
}
```

---

## Tool State Management

### File Read State Tracking

Claude Code tracks which files have been read and their timestamps:

```typescript
interface FileState {
  content: string;          // File content
  timestamp: number;        // File modification timestamp
  offset?: number;          // Offset used in read
  limit?: number;           // Limit used in read
}

// Stored in context.readFileState Map
readFileState: Map<string, FileState>
```

This enables validation that files haven't been modified between Read and Write/Edit operations.

### File History State

For file edits, Claude Code can track file history:

```typescript
// Before editing, save to history
await saveToFileHistory(
  fileHistoryState,
  filePath,
  toolUseId
);

// File history allows restoration if needed
```

---

## Special Tool Behaviors

### Bash Tool Sandboxing

The Bash tool has special sandboxing behavior:

```typescript
// Sandbox mode (default)
- Restricts certain commands
- Limits file system access
- Prevents dangerous operations

// Can be disabled per-call
{
  type: "tool_use",
  name: "Bash",
  input: {
    command: "rm -rf node_modules",
    dangerouslyDisableSandbox: true  // Override sandbox
  }
}
```

### Read Tool Special File Types

The Read tool handles different file types:

1. **Text files** - Returned with line numbers, language detection
2. **Images** - Base64 encoded, includes MIME type and size
3. **PDFs** - Base64 encoded, page-by-page extraction
4. **Jupyter notebooks** - Parsed cells with code and outputs

### Tool Chaining Best Practices

From the system prompt, Claude is instructed on tool chaining:

**Parallel (Independent Operations)**:
```
"If the commands are independent and can run in parallel, make multiple
Bash tool calls in a single message. For example, if you need to run
'git status' and 'git diff', send a single message with two Bash tool
calls in parallel."
```

**Sequential (Dependent Operations)**:
```
"If the commands depend on each other and must run sequentially, use a
single Bash call with '&&' to chain them together (e.g.,
`git add . && git commit -m 'message' && git push`)."
```

---

## Tool Result Caching

Some tools implement caching:

### WebFetch Caching

```
- 15-minute self-cleaning cache
- Same URL within 15 minutes returns cached result
- Avoids redundant network requests
```

### Statsig/Feature Flag Caching

```
- Dynamic configuration cached
- Gate checks cached
- Periodic refresh (21600000ms = 6 hours)
```

---

## Summary

The tool calling system in Claude Code follows these principles:

1. **Strict validation** - All inputs validated before execution
2. **Permission checking** - User controls what tools can access
3. **State tracking** - File read state ensures consistency
4. **Parallel when possible** - Concurrency-safe tools run in parallel
5. **Error recovery** - Clear error messages with `is_error` flag
6. **Type safety** - Zod schemas for input/output validation
7. **Progress tracking** - Real-time updates during long operations
8. **Result formatting** - Consistent tool result structure

This design ensures reliable, safe, and efficient tool execution while giving Claude maximum flexibility to accomplish user goals.
