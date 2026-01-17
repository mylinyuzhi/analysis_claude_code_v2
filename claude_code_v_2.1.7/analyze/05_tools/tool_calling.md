# Tool Calling System (Claude Code v2.1.7)

This document describes how Claude Code implements tool calling, including the message cycle, tool use requests, result formatting, and execution patterns.

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

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
  content: "<tool_use_error>File not found: /path/to/missing.ts</tool_use_error>",
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
  };
  strict?: boolean;           // NEW: Strict schema validation
  input_examples?: object[];  // NEW: Example inputs
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
      },
      strict: true  // Enable strict validation
    }
  ]
}
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

## Tool Registration and API Conversion

### Converting Tools for API

Tools are converted from internal definitions to Anthropic API format:

```javascript
// ============================================
// convertToolForAPI - Serialize tool for API
// Location: chunks.146.mjs (estimated from v2.0.59)
// ============================================

// READABLE (for understanding):
async function convertToolForAPI(tool, context) {
  // Check if strict mode experiment is enabled
  const isStrictModeEnabled = getStatsigFlag("tengu_tool_pear")

  // Build base tool definition
  const toolDef = {
    name: tool.name,

    // Call tool's prompt() to get dynamic description
    description: await tool.prompt({
      getToolPermissionContext: context.getToolPermissionContext,
      tools: context.tools,
      agents: context.agents
    }),

    // Use pre-computed JSON schema or convert Zod schema
    input_schema: "inputJSONSchema" in tool && tool.inputJSONSchema
      ? tool.inputJSONSchema
      : zodToJsonSchema(tool.inputSchema)
  }

  // Add strict mode if supported by tool and model
  if (isStrictModeEnabled && tool.strict === true &&
      context.model && modelSupportsStrictMode(context.model)) {
    toolDef.strict = true
  }

  // Add input examples if beta is enabled
  if (context.betas?.includes(INPUT_EXAMPLES_BETA) && tool.input_examples) {
    toolDef.input_examples = tool.input_examples
  }

  return toolDef
}
```

**Key insight:** The `prompt()` method generates dynamic descriptions that can include context-specific information (available agents, permission context, etc.).

---

## Tool Restriction Sets

Three constant sets control tool availability in different contexts:

```javascript
// ============================================
// Tool Restriction Sets
// ============================================

// ALWAYS_EXCLUDED_TOOLS - Never available to subagents
const ALWAYS_EXCLUDED_TOOLS = new Set([
  "ExitPlanMode",
  "EnterPlanMode",
  "Task",
  "AskUserQuestion",
])

// BUILTIN_ONLY_TOOLS - Only available to built-in agents
const BUILTIN_ONLY_TOOLS = new Set([
  ...ALWAYS_EXCLUDED_TOOLS    // Inherits from above
])

// ASYNC_SAFE_TOOLS - Tools that can run in async/background agents
const ASYNC_SAFE_TOOLS = new Set([
  "Read",
  "Edit",
  "TodoWrite",
  "Grep",
  "WebSearch",
  "Glob",
  "Bash",
  "Skill",
  "SlashCommand",
  "WebFetch",
])
```

### Subagent Tool Filtering

```javascript
// ============================================
// filterToolsByContext - Filter tools for subagent context
// ============================================

// READABLE (for understanding):
function filterToolsByContext({ tools, isBuiltIn, isAsync }) {
  return tools.filter((tool) => {
    // Allow MCP tools in subagents if env var set
    if (process.env.CLAUDE_CODE_ALLOW_MCP_TOOLS_FOR_SUBAGENTS &&
        tool.name.startsWith("mcp__")) {
      return true
    }

    // Exclude always-banned tools
    if (ALWAYS_EXCLUDED_TOOLS.has(tool.name)) {
      return false
    }

    // Non-built-in agents have restricted tool access
    if (!isBuiltIn && BUILTIN_ONLY_TOOLS.has(tool.name)) {
      return false
    }

    // Async agents can only use curated whitelist
    if (isAsync && !ASYNC_SAFE_TOOLS.has(tool.name)) {
      return false
    }

    return true
  })
}
```

---

## Result Formatting and Return

### Tool Result Mapping

Each tool implements `mapToolResultToToolResultBlockParam()` to convert internal results to the API format:

#### Read Tool Result Mapping (chunks.86.mjs:796-826)

```javascript
mapToolResultToToolResultBlockParam(A, Q) {
  switch (A.type) {
    case "image":
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: [{
          type: "image",
          source: {
            type: "base64",
            data: A.file.base64,
            media_type: A.file.type
          }
        }]
      };
    case "notebook":
      return notebookCellsToResult(A.file.cells, Q);
    case "pdf":
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: `PDF file read: ${A.file.filePath} (${formatBytes(A.file.originalSize)})`
      };
    case "text": {
      let content;
      if (A.file.content) {
        content = formatWithLineNumbers(A.file) + SUFFIX;
      } else {
        content = A.file.totalLines === 0
          ? "<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>"
          : `<system-reminder>Warning: the file exists but is shorter than the provided offset...</system-reminder>`;
      }
      return { tool_use_id: Q, type: "tool_result", content };
    }
  }
}
```

#### Write Tool Result Mapping (chunks.115.mjs:1424-1441)

```javascript
mapToolResultToToolResultBlockParam({ filePath, content, type }, toolUseId) {
  switch (type) {
    case "create":
      return {
        tool_use_id: toolUseId,
        type: "tool_result",
        content: `File created successfully at: ${filePath}`
      };
    case "update":
      return {
        tool_use_id: toolUseId,
        type: "tool_result",
        content: `The file ${filePath} has been updated. Here's the result of running \`cat -n\` on a snippet of the edited file:\n${formatWithLineNumbers({content, startLine: 1})}`
      };
  }
}
```

#### Edit Tool Result Mapping (chunks.115.mjs:1026-1055)

```javascript
mapToolResultToToolResultBlockParam({ filePath, originalFile, oldString, newString, userModified, replaceAll }, toolUseId) {
  let modifiedNote = userModified
    ? ".  The user modified your proposed changes before accepting them. "
    : "";

  if (replaceAll) {
    return {
      tool_use_id: toolUseId,
      type: "tool_result",
      content: `The file ${filePath} has been updated${modifiedNote}. All occurrences of '${oldString}' were successfully replaced with '${newString}'.`
    };
  }

  // Show snippet of edited file with context
  const { snippet, startLine } = getEditSnippet(originalFile || "", oldString, newString);
  return {
    tool_use_id: toolUseId,
    type: "tool_result",
    content: `The file ${filePath} has been updated${modifiedNote}. Here's the result of running \`cat -n\` on a snippet of the edited file:\n${formatWithLineNumbers({content: snippet, startLine})}`
  };
}
```

#### Bash Tool Result Mapping (chunks.124.mjs:1566-1613)

```javascript
mapToolResultToToolResultBlockParam({
  interrupted, stdout, stderr, isImage, backgroundTaskId, backgroundedByUser, structuredContent
}, toolUseId) {
  // Handle structured content from MCP tools
  if (structuredContent && structuredContent.length > 0) {
    return { tool_use_id: toolUseId, type: "tool_result", content: structuredContent };
  }

  // Handle image output (base64)
  if (isImage) {
    const match = stdout.trim().match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      return {
        tool_use_id: toolUseId,
        type: "tool_result",
        content: [{
          type: "image",
          source: { type: "base64", media_type: match[1] || "image/jpeg", data: match[2] || "" }
        }]
      };
    }
  }

  // Standard text output
  let out = stdout ? stdout.replace(/^(\s*\n)+/, "").trimEnd() : "";
  let err = stderr.trim();

  if (interrupted) {
    err += err ? "\n" : "";
    err += "<error>Command was aborted before completion</error>";
  }

  let bgMessage = backgroundTaskId
    ? `Command ${backgroundedByUser ? "was manually backgrounded by user" : "running in background"} with ID: ${backgroundTaskId}. Output is being written to: ${formatOutputPath(backgroundTaskId)}`
    : "";

  return {
    tool_use_id: toolUseId,
    type: "tool_result",
    content: [out, err, bgMessage].filter(Boolean).join("\n"),
    is_error: interrupted
  };
}
```

---

## Multi-Content Tool Results

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

## Error Result Format

When validation or execution fails, errors are formatted consistently:

```javascript
// ============================================
// Error Tool Result Creation
// Location: chunks.134.mjs:790-829
// ============================================

// Error format
{
  message: createMessage({
    content: [{
      type: "tool_result",
      content: `<tool_use_error>${validationError.message}</tool_use_error>`,
      is_error: true,
      tool_use_id: toolUseId
    }],
    toolUseResult: `Error: ${validationError.message}`,
    sourceToolAssistantUUID: assistantMessage.uuid
  })
}
```

### Error Detection in Results

```javascript
// chunks.147.mjs:2693 - Check if result has error
const hasError = message.content[0].is_error ?? false;

// chunks.133.mjs:3023-3026 - Error handling in execution
if (output.message.type === "user" &&
    Array.isArray(output.message.message.content) &&
    output.message.message.content.some((content) =>
      content.type === "tool_result" && content.is_error === true
    )) {
  this.hasErrored = true;
}
```

---

## Tool Chaining Best Practices

From the system prompt, Claude is instructed on tool chaining:

**Parallel (Independent Operations)**:
```
"If the commands are independent and can run in parallel, make multiple
tool calls in a single message. For example, if you need to run
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

### WebFetch Caching

```
- 15-minute self-cleaning cache
- Same URL within 15 minutes returns cached result
- Avoids redundant network requests
```

---

## Summary

The tool calling system in Claude Code follows these principles:

1. **Standard Anthropic Format** - Uses `tool_use` and `tool_result` blocks
2. **Unique IDs** - Each tool use has a unique ID for result matching
3. **Error Flagging** - `is_error: true` marks failed tool executions
4. **Multi-Content** - Results can contain text, images, or structured data
5. **Dynamic Descriptions** - Tool descriptions generated via `prompt()` method
6. **Schema Validation** - Zod schemas converted to JSON Schema for API
7. **Strict Mode** - Optional strict schema validation for compatible models
