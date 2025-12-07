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

## Tool Registration and Selection System

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this section:
- `getBuiltinTools` (wY1) - Returns all built-in tool objects
- `getEnabledTools` (LC) - Filters tools by permissions and enabled status
- `convertToolForAPI` (r51) - Converts tool to Anthropic API format

### Tool Registry: getBuiltinTools (wY1)

All built-in tools are registered in a single function that returns an array of tool objects:

```javascript
// ============================================
// getBuiltinTools - Central tool registry
// Location: chunks.146.mjs:891-893
// ============================================

// ORIGINAL (for source lookup):
function wY1() {
  return [jn, D9, zO, Py, gq, n8, lD, QV, kP, nV, BY, ZSA, CY1, HY1, Y71, ln, nn, cTA,
    ...[], ...[], ...[],
    ...Dx() ? [dW9, tW9, WX9, UX9] : [],
    ...[],
    ...process.env.ENABLE_LSP_TOOL ? [FV0] : [],
    ...[], ...[], Wh, Xh]
}

// READABLE (for understanding):
function getBuiltinTools() {
  return [
    TaskTool,           // jn - Launch subagents
    BashTool,           // D9 - Execute shell commands
    GlobTool,           // zO - File pattern matching
    GrepTool,           // Py - Content search
    ExitPlanModeTool,   // gq - Exit plan mode
    ReadTool,           // n8 - Read files
    SkillTool,          // lD - Invoke skills
    SlashCommandTool,   // QV - Custom commands
    WebFetchTool,       // kP - Fetch web content
    WebSearchTool,      // nV - Search the web
    TodoWriteTool,      // BY - Task management
    EditTool,           // ZSA - Edit files
    BashOutputTool,     // CY1 - Monitor background shells
    KillShellTool,      // HY1 - Terminate shells
    WriteTool,          // Y71 - Write files
    NotebookEditTool,   // ln - Edit Jupyter notebooks
    AgentOutputTool,    // nn - Get agent results
    EnterPlanModeTool,  // cTA - Enter plan mode

    // Conditional: Task system tools (experimental)
    ...(isTaskSystemEnabled() ? [TaskCreateTool, TaskGetTool, TaskListTool, TaskUpdateTool] : []),

    // Conditional: LSP tool
    ...(process.env.ENABLE_LSP_TOOL ? [LSPTool] : []),

    // IDE-specific tools (always last)
    IDEExecuteTool,     // Wh
    IDEDiagnosticsTool  // Xh
  ]
}

// Mapping: jn→TaskTool, D9→BashTool, n8→ReadTool, BY→TodoWriteTool, etc.
```

**Key insight:** Tools are conditionally included based on environment variables and feature flags. IDE-specific tools are excluded from CLI mode.

### Tool Filtering: getEnabledTools (LC)

This function filters the tool list based on permissions and enabled status:

```javascript
// ============================================
// getEnabledTools - Permission-aware tool filtering
// Location: chunks.146.mjs:903-912
// ============================================

// ORIGINAL (for source lookup):
LC = (A) => {
  let Q = new Set([Wh.name, Xh.name, Az]),
    B = wY1().filter((Y) => !Q.has(Y.name)),
    G = KVA(A),
    Z = B.filter((Y) => {
      return !G.some((J) => J.ruleValue.toolName === Y.name && J.ruleValue.ruleContent === void 0)
    }),
    I = Z.map((Y) => Y.isEnabled());
  return Z.filter((Y, J) => I[J])
}

// READABLE (for understanding):
function getEnabledTools(permissionContext) {
  // Step 1: Exclude IDE-specific tools (not available in CLI)
  const excludedTools = new Set([IDEExecuteTool.name, IDEDiagnosticsTool.name, Az])

  // Step 2: Get all built-in tools except excluded
  const allBuiltinTools = getBuiltinTools().filter((tool) => !excludedTools.has(tool.name))

  // Step 3: Get denial rules from permissions (KVA)
  const denialRules = getDenialRules(permissionContext)

  // Step 4: Filter out tools that have blanket deny rules
  // (ruleContent === undefined means the entire tool is denied)
  const notDenied = allBuiltinTools.filter((tool) => {
    return !denialRules.some(
      (rule) => rule.ruleValue.toolName === tool.name &&
                rule.ruleValue.ruleContent === undefined
    )
  })

  // Step 5: Check isEnabled() for each remaining tool
  const enabledFlags = notDenied.map((tool) => tool.isEnabled())

  // Step 6: Return only enabled tools
  return notDenied.filter((tool, index) => enabledFlags[index])
}

// Mapping: A→permissionContext, Q→excludedTools, B→allBuiltinTools,
//          G→denialRules, Z→notDenied, I→enabledFlags
```

**How it works:**
1. Excludes IDE-specific tools (not available in CLI mode)
2. Queries permission context for blanket deny rules
3. Filters out tools completely denied by permissions
4. Checks each tool's `isEnabled()` method
5. Returns only tools that pass all checks

### API Conversion: convertToolForAPI (r51)

Converts internal tool definitions to Anthropic API format:

```javascript
// ============================================
// convertToolForAPI - Serialize tool for API
// Location: chunks.146.mjs:952-966
// ============================================

// ORIGINAL (for source lookup):
async function r51(A, Q) {
  let B = o2("tengu_tool_pear"),
    G = {
      name: A.name,
      description: await A.prompt({
        getToolPermissionContext: Q.getToolPermissionContext,
        tools: Q.tools,
        agents: Q.agents
      }),
      input_schema: "inputJSONSchema" in A && A.inputJSONSchema
        ? A.inputJSONSchema
        : sRA(A.inputSchema)
    };
  if (B && A.strict === !0 && Q.model && BU1(Q.model)) G.strict = !0;
  if (Q.betas?.includes(abA) && A.input_examples) G.input_examples = A.input_examples;
  return G
}

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

// Mapping: A→tool, Q→context, B→isStrictModeEnabled, G→toolDef, sRA→zodToJsonSchema
```

**Key insight:** The `prompt()` method generates dynamic descriptions that can include context-specific information (available agents, permission context, etc.).

### Tool Restriction Sets

Three constant sets control tool availability in different contexts:

```javascript
// ============================================
// Tool Restriction Sets
// Location: chunks.146.mjs:949
// ============================================

// ALWAYS_EXCLUDED_TOOLS (CTA) - Never available to subagents
const ALWAYS_EXCLUDED_TOOLS = new Set([
  ExitPlanModeTool.name,      // gq
  ENTER_PLAN_MODE_NAME,       // A71
  TASK_TOOL_NAME,             // A6
  AskUserQuestionTool.name,   // pJ
  DY1,                        // (unknown)
])

// BUILTIN_ONLY_TOOLS (Qf2) - Only available to built-in agents
const BUILTIN_ONLY_TOOLS = new Set([
  ...ALWAYS_EXCLUDED_TOOLS    // Inherits from CTA
])

// ASYNC_SAFE_TOOLS (Bf2) - Tools that can run in async/background agents
const ASYNC_SAFE_TOOLS = new Set([
  ReadTool.name,              // n8
  EditTool.name,              // ZSA
  TodoWriteTool.name,         // BY
  GrepTool.name,              // Py
  WebSearchTool.name,         // nV
  GlobTool.name,              // zO
  BASH_TOOL_NAME,             // C9
  SkillTool.name,             // lD
  SlashCommandTool.name,      // QV
  WebFetchTool.name,          // kP
])

// Mapping: CTA→ALWAYS_EXCLUDED_TOOLS, Qf2→BUILTIN_ONLY_TOOLS, Bf2→ASYNC_SAFE_TOOLS
```

**How subagent tool filtering works:**

```javascript
// ============================================
// filterToolsByContext - Filter tools for subagent context
// Location: chunks.125.mjs:1116-1128
// ============================================

// READABLE (for understanding):
function filterToolsByContext({ tools, isBuiltIn, isAsync }) {
  return tools.filter((tool) => {
    // Allow MCP tools in subagents if env var set
    if (process.env.CLAUDE_CODE_ALLOW_MCP_TOOLS_FOR_SUBAGENTS &&
        tool.name.startsWith("mcp__")) {
      return true
    }

    // Exclude always-banned tools (CTA)
    if (ALWAYS_EXCLUDED_TOOLS.has(tool.name)) {
      return false
    }

    // Non-built-in agents have restricted tool access (Qf2)
    if (!isBuiltIn && BUILTIN_ONLY_TOOLS.has(tool.name)) {
      return false
    }

    // Async agents can only use curated whitelist (Bf2)
    if (isAsync && !ASYNC_SAFE_TOOLS.has(tool.name)) {
      return false
    }

    return true
  })
}
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

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this section:
- `groupToolsByConcurrency` (mk3) - Partitions tools into parallel/serial groups
- `executeToolsInParallel` (ck3) - Runs safe tools concurrently
- `executeToolsSerially` (dk3) - Runs unsafe tools one-by-one
- `executeToolsByGroup` (VX0) - Main orchestrator
- `parallelGeneratorWithLimit` (SYA) - Bounded concurrency mechanism

### Concurrency Decision Algorithm

The system determines execution mode by grouping consecutive tools based on their `isConcurrencySafe()` method:

```javascript
// ============================================
// groupToolsByConcurrency - Partition tools into execution groups
// Location: chunks.146.mjs:2154-2166
// ============================================

// ORIGINAL (for source lookup):
function mk3(A, Q) {
  return A.reduce((B, G) => {
    let Z = Q.options.tools.find((J) => J.name === G.name),
      I = Z?.inputSchema.safeParse(G.input),
      Y = I?.success ? Boolean(Z?.isConcurrencySafe(I.data)) : !1;
    if (Y && B[B.length - 1]?.isConcurrencySafe) B[B.length - 1].blocks.push(G);
    else B.push({
      isConcurrencySafe: Y,
      blocks: [G]
    });
    return B
  }, [])
}

// READABLE (for understanding):
function groupToolsByConcurrency(toolUseBlocks, context) {
  return toolUseBlocks.reduce((groups, toolUse) => {
    // Step 1: Find tool definition
    const toolDef = context.options.tools.find((tool) => tool.name === toolUse.name)

    // Step 2: Parse input and validate
    const parsedInput = toolDef?.inputSchema.safeParse(toolUse.input)

    // Step 3: Determine if safe for parallel execution
    // If parsing fails, default to NOT safe (sequential)
    const isSafe = parsedInput?.success
      ? Boolean(toolDef?.isConcurrencySafe(parsedInput.data))
      : false

    // Step 4: Group consecutive safe tools together
    if (isSafe && groups[groups.length - 1]?.isConcurrencySafe) {
      // Add to existing parallel group
      groups[groups.length - 1].blocks.push(toolUse)
    } else {
      // Create new group (either parallel or serial)
      groups.push({
        isConcurrencySafe: isSafe,
        blocks: [toolUse]
      })
    }

    return groups
  }, [])
}

// Mapping: A→toolUseBlocks, Q→context, B→groups, G→toolUse, Z→toolDef, I→parsedInput, Y→isSafe
```

**Algorithm complexity:** O(n) single pass through tool list.

**Why this approach:**
- Consecutive safe tools form a batch → maximizes parallelism
- A non-safe tool creates a boundary → ensures order when needed
- If input parsing fails → defaults to sequential (safe fallback)

### Parallel Execution: executeToolsInParallel (ck3)

Safe tools are executed concurrently with bounded parallelism:

```javascript
// ============================================
// executeToolsInParallel - Run safe tools with bounded concurrency
// Location: chunks.146.mjs:2183-2187
// ============================================

// ORIGINAL (for source lookup):
async function* ck3(A, Q, B, G) {
  yield* SYA(A.map(async function*(Z) {
    G.setInProgressToolUseIDs((I) => new Set([...I, Z.id])),
    yield* OY1(Z, Q.find((I) => I.message.content.some((Y) => Y.type === "tool_use" && Y.id === Z.id)), B, G),
    pX9(G, Z.id)
  }), hk3())
}

// READABLE (for understanding):
async function* executeToolsInParallel(toolUseBlocks, messages, canUseTool, context) {
  // Create generator for each tool, then run with bounded concurrency
  yield* parallelGeneratorWithLimit(
    toolUseBlocks.map(async function*(toolUse) {
      // Mark tool as in-progress
      context.setInProgressToolUseIDs((ids) => new Set([...ids, toolUse.id]))

      // Execute tool via generator (streams results)
      yield* executeSingleTool(
        toolUse,
        messages.find((msg) => msg.message.content.some(
          (block) => block.type === "tool_use" && block.id === toolUse.id
        )),
        canUseTool,
        context
      )

      // Remove from in-progress set
      removeFromInProgressSet(context, toolUse.id)
    }),
    getMaxToolConcurrency()  // hk3() returns max concurrent tools (default: 10)
  )
}

// Mapping: A→toolUseBlocks, Q→messages, B→canUseTool, G→context, Z→toolUse
```

### Bounded Concurrency: parallelGeneratorWithLimit (SYA)

The core concurrency mechanism uses Promise.race with a sliding window:

```javascript
// ============================================
// parallelGeneratorWithLimit - Bounded async generator concurrency
// Location: chunks.107.mjs:2626-2659
// ============================================

// ORIGINAL (for source lookup):
async function* SYA(A, Q = 1 / 0) {
  let B = (I) => {
    let Y = I.next().then(({ done: J, value: W }) => ({
      done: J, value: W, generator: I, promise: Y
    }));
    return Y
  },
  G = [...A],
  Z = new Set;
  while (Z.size < Q && G.length > 0) {
    let I = G.shift();
    Z.add(B(I))
  }
  while (Z.size > 0) {
    let { done: I, value: Y, generator: J, promise: W } = await Promise.race(Z);
    if (Z.delete(W), !I) {
      if (Z.add(B(J)), Y !== void 0) yield Y
    } else if (G.length > 0) {
      let X = G.shift();
      Z.add(B(X))
    }
  }
}

// READABLE (for understanding):
async function* parallelGeneratorWithLimit(generators, maxConcurrency = Infinity) {
  // Helper: Wraps generator.next() to return self-reference for tracking
  const wrapGenerator = (generator) => {
    const promise = generator.next().then(({ done, value }) => ({
      done,
      value,
      generator,
      promise  // Self-reference for Set deletion
    }))
    return promise
  }

  const remainingGenerators = [...generators]
  const activePromises = new Set()

  // Step 1: Fill initial concurrency window
  while (activePromises.size < maxConcurrency && remainingGenerators.length > 0) {
    const generator = remainingGenerators.shift()
    activePromises.add(wrapGenerator(generator))
  }

  // Step 2: Process results as they complete (Promise.race pattern)
  while (activePromises.size > 0) {
    const { done, value, generator, promise } = await Promise.race(activePromises)

    // Remove completed promise from set
    activePromises.delete(promise)

    if (!done) {
      // Generator still has values → continue it
      activePromises.add(wrapGenerator(generator))
      if (value !== undefined) yield value
    } else if (remainingGenerators.length > 0) {
      // Generator exhausted → start next one
      const nextGenerator = remainingGenerators.shift()
      activePromises.add(wrapGenerator(nextGenerator))
    }
  }
}

// Mapping: A→generators, Q→maxConcurrency, B→wrapGenerator, G→remainingGenerators, Z→activePromises
```

**Key insight:** This pattern maintains exactly N concurrent operations, filling new slots as generators complete. Results are yielded immediately, enabling streaming UI updates.

### Max Concurrency Configuration

```javascript
// ============================================
// getMaxToolConcurrency - Returns max concurrent tool limit
// Location: chunks.146.mjs:1697-1699
// ============================================

// ORIGINAL (for source lookup):
function hk3() {
  return parseInt(process.env.CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY || "", 10) || 10
}

// READABLE (for understanding):
function getMaxToolConcurrency() {
  return parseInt(process.env.CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY || "", 10) || 10
}
// Default: 10 concurrent tools
// Override: Set CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY env var
```

### Serial Execution: executeToolsSerially (dk3)

Non-safe tools are executed one at a time with immediate context updates:

```javascript
// ============================================
// executeToolsSerially - Run non-safe tools sequentially
// Location: chunks.146.mjs:2168-2181
// ============================================

// ORIGINAL (for source lookup):
async function* dk3(A, Q, B, G) {
  let Z = G;
  for (let I of A) {
    G.setInProgressToolUseIDs((Y) => new Set([...Y, I.id]));
    for await (let Y of OY1(I, Q.find((J) => J.message.content.some((W) => W.type === "tool_use" && W.id === I.id)), B, Z)) {
      if (Y.contextModifier) Z = Y.contextModifier.modifyContext(Z);
      yield {
        message: Y.message,
        newContext: Z
      }
    }
    pX9(G, I.id)
  }
}

// READABLE (for understanding):
async function* executeToolsSerially(toolUseBlocks, messages, canUseTool, context) {
  let updatedContext = context

  for (const toolUse of toolUseBlocks) {
    // Mark as in-progress
    context.setInProgressToolUseIDs((ids) => new Set([...ids, toolUse.id]))

    // Execute tool (streams results via generator)
    for await (const result of executeSingleTool(toolUse, messages, canUseTool, updatedContext)) {
      // Apply context modifications IMMEDIATELY (key difference from parallel)
      if (result.contextModifier) {
        updatedContext = result.contextModifier.modifyContext(updatedContext)
      }

      yield {
        message: result.message,
        newContext: updatedContext
      }
    }

    // Remove from in-progress
    removeFromInProgressSet(context, toolUse.id)
  }
}

// Mapping: A→toolUseBlocks, Q→messages, B→canUseTool, G→context, Z→updatedContext, I→toolUse
```

**Key difference from parallel:** Context modifiers are applied immediately after each tool, so subsequent tools see the updated state.

### Main Orchestrator: executeToolsByGroup (VX0)

This function coordinates parallel and serial execution:

```javascript
// ============================================
// executeToolsByGroup - Main tool execution orchestrator
// Location: chunks.146.mjs:2113-2152
// ============================================

// READABLE (for understanding):
async function* executeToolsByGroup(toolUses, messages, canUseTool, context) {
  let currentContext = context

  // Process each group (parallel or serial)
  for (const { isConcurrencySafe, blocks: toolGroup } of groupToolsByConcurrency(toolUses, context)) {

    if (isConcurrencySafe) {
      // === PARALLEL EXECUTION ===
      const contextModifiers = {}  // Accumulate changes

      for await (const result of executeToolsInParallel(toolGroup, messages, canUseTool, currentContext)) {
        // Collect context modifiers (don't apply yet)
        if (result.contextModifier) {
          const { toolUseID, modifyContext } = result.contextModifier
          if (!contextModifiers[toolUseID]) contextModifiers[toolUseID] = []
          contextModifiers[toolUseID].push(modifyContext)
        }

        yield { message: result.message, newContext: currentContext }
      }

      // Apply all context modifications AFTER parallel batch completes
      for (const tool of toolGroup) {
        const modifiers = contextModifiers[tool.id]
        if (!modifiers) continue

        for (const modifier of modifiers) {
          currentContext = modifier(currentContext)
        }
      }

      yield { newContext: currentContext }

    } else {
      // === SERIAL EXECUTION ===
      for await (const result of executeToolsSerially(toolGroup, messages, canUseTool, currentContext)) {
        if (result.newContext) {
          currentContext = result.newContext
        }
        yield { message: result.message, newContext: currentContext }
      }
    }
  }
}
```

**Context modification handling:**
- **Parallel:** Collect all modifiers, apply after batch completes (order preserved by tool order)
- **Serial:** Apply immediately after each tool (next tool sees updated state)

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

## StreamingToolExecutor (EV0)

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key symbol: `StreamingToolExecutor` (EV0) - chunks.146.mjs:1335-1449

An alternative execution path that enables real-time streaming as tools are generated by the LLM.

### Class Structure

```javascript
// ============================================
// StreamingToolExecutor - Concurrent tool execution with streaming
// Location: chunks.146.mjs:1335-1449
// ============================================

// ORIGINAL (for source lookup):
class EV0 {
  toolDefinitions;
  canUseTool;
  tools = [];
  toolUseContext;
  hasErrored = !1;

  constructor(A, Q, B) {
    this.toolDefinitions = A;
    this.canUseTool = Q;
    this.toolUseContext = B
  }

  addTool(A, Q) { ... }
  canExecuteTool(A) { ... }
  async processQueue() { ... }
  createSyntheticErrorMessage(A, Q) { ... }
  getAbortReason() { ... }
  async executeTool(A) { ... }
  *getCompletedResults() { ... }
  async *getRemainingResults() { ... }
  hasCompletedResults() { ... }
  hasExecutingTools() { ... }
  hasUnfinishedTools() { ... }
  getUpdatedContext() { ... }
}

// READABLE (for understanding):
class StreamingToolExecutor {
  toolDefinitions;     // Array of tool definitions
  canUseTool;          // Permission check function
  tools = [];          // Tool execution queue with state
  toolUseContext;      // Execution context
  hasErrored = false;  // Error flag for sibling abort

  constructor(toolDefinitions, canUseTool, toolUseContext) {
    this.toolDefinitions = toolDefinitions
    this.canUseTool = canUseTool
    this.toolUseContext = toolUseContext
  }
}
```

### Tool State Machine

Each tool in the queue progresses through states:

```
┌─────────┐     ┌───────────┐     ┌───────────┐     ┌─────────┐
│ queued  │ ──▶ │ executing │ ──▶ │ completed │ ──▶ │ yielded │
└─────────┘     └───────────┘     └───────────┘     └─────────┘
```

### Adding Tools to Queue

```javascript
// ============================================
// addTool - Queue a tool for execution
// Location: chunks.146.mjs:1346-1358
// ============================================

// READABLE (for understanding):
addTool(toolUseBlock, assistantMessage) {
  // Find tool definition
  const toolDef = this.toolDefinitions.find((t) => t.name === toolUseBlock.name)
  if (!toolDef) return

  // Parse input and determine concurrency safety
  const parsedInput = toolDef.inputSchema.safeParse(toolUseBlock.input)
  const isConcurrencySafe = parsedInput?.success
    ? toolDef.isConcurrencySafe(parsedInput.data)
    : false

  // Add to queue
  this.tools.push({
    id: toolUseBlock.id,
    block: toolUseBlock,
    assistantMessage: assistantMessage,
    status: "queued",
    isConcurrencySafe: isConcurrencySafe
  })

  // Immediately try to process queue
  this.processQueue()
}
```

### Execution Decision Logic

```javascript
// ============================================
// canExecuteTool - Determines if tool can start now
// Location: chunks.146.mjs:1359-1362
// ============================================

// READABLE (for understanding):
canExecuteTool(isConcurrencySafe) {
  const executing = this.tools.filter((t) => t.status === "executing")

  // Can execute if:
  // 1. No tools currently executing, OR
  // 2. This tool is concurrency-safe AND all executing tools are also safe
  return executing.length === 0 ||
         (isConcurrencySafe && executing.every((t) => t.isConcurrencySafe))
}
```

### Error Propagation and Abort

```javascript
// ============================================
// Error handling and sibling abort
// Location: chunks.146.mjs:1370-1386, 1397-1410
// ============================================

// READABLE (for understanding):
createSyntheticErrorMessage(toolUseId, reason) {
  const message = reason === "user_interrupted"
    ? "Interrupted by user"
    : "Sibling tool call errored"

  return createUserMessage({
    content: [{
      type: "tool_result",
      content: `<tool_use_error>${message}</tool_use_error>`,
      is_error: true,
      tool_use_id: toolUseId
    }],
    toolUseResult: message
  })
}

getAbortReason() {
  if (this.hasErrored) return "sibling_error"
  if (this.toolUseContext.abortController.signal.aborted) return "user_interrupted"
  return null
}

// Inside executeTool():
// When a tool result has is_error: true
if (result.message.content.some((c) => c.type === "tool_result" && c.is_error)) {
  this.hasErrored = true
  this.toolUseContext.abortController.abort()  // Signal all siblings to abort
}
```

### Streaming Results

```javascript
// ============================================
// getRemainingResults - Async generator for streaming results
// Location: chunks.146.mjs:1426-1436
// ============================================

// READABLE (for understanding):
async *getRemainingResults() {
  while (this.hasUnfinishedTools()) {
    await this.processQueue()

    // Yield completed results
    for (const result of this.getCompletedResults()) {
      yield result
    }

    // Wait for at least one tool to complete if none ready
    if (this.hasExecutingTools() && !this.hasCompletedResults()) {
      const promises = this.tools
        .filter((t) => t.status === "executing" && t.promise)
        .map((t) => t.promise)

      if (promises.length > 0) {
        await Promise.race(promises)  // Wait for fastest
      }
    }
  }

  // Final yield of any remaining completed results
  for (const result of this.getCompletedResults()) {
    yield result
  }
}
```

**Key insight:** Results are yielded as soon as available, enabling real-time UI updates. The generator continues until all tools are in "yielded" state.

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

### Bash Tool Progress Streaming

The Bash tool yields progress events during command execution:

```javascript
// ============================================
// bashProgressGenerator - Yields progress during command execution
// Location: chunks.106.mjs:514-545
// ============================================

// READABLE (for understanding):
async function* bashProgressGenerator(commandPromise, options) {
  let startTime = Date.now()
  let timeoutDeadline = startTime + commandTimeout

  while (true) {
    let currentTime = Date.now()
    let remainingMs = Math.max(0, timeoutDeadline - currentTime)

    // Race between command completion and timeout interval
    let result = await Promise.race([
      commandPromise,
      new Promise((resolve) => setTimeout(() => resolve(null), remainingMs))
    ])

    if (result !== null) {
      return result  // Command completed
    }

    // If backgrounding triggered, return immediately
    if (backgroundTaskId) {
      return {
        stdout: "",
        stderr: "",
        code: 0,
        interrupted: false,
        backgroundTaskId: backgroundTaskId
      }
    }

    let elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)

    // Show "Background" button UI after threshold
    if (elapsedSeconds >= longRunningThreshold) {
      setToolJSX({
        jsx: BackgroundPromptComponent,
        shouldHidePromptInput: false,
        shouldContinueAnimation: true,
        showSpinner: true
      })
    }

    // Yield progress event (enables real-time output streaming)
    yield {
      type: "progress",
      fullOutput: fullCommandOutput,
      output: incrementalOutput,
      elapsedTimeSeconds: elapsedSeconds,
      totalLines: lineCount
    }

    // Update deadline for next poll cycle
    timeoutDeadline = Date.now() + pollIntervalMs
  }
}
```

### Progress Event Structure

```javascript
// ============================================
// bashProgressCallback - Receives progress from generator
// Location: chunks.106.mjs:794-805
// ============================================

// Progress callback invocation:
progressCallback({
  toolUseID: `bash-progress-${progressCounter++}`,
  data: {
    type: "bash_progress",
    output: progressData.output,           // New output since last progress
    fullOutput: progressData.fullOutput,   // Complete output so far
    elapsedTimeSeconds: progressData.elapsedTimeSeconds,
    totalLines: progressData.totalLines
  }
})
```

### Background Task Execution

The Bash tool supports background execution for long-running commands:

```javascript
// ============================================
// createBackgroundShell - Creates trackable background shell
// Location: chunks.88.mjs:1408-1470
// ============================================

// READABLE (for understanding):
function createBackgroundShell(command, shellCommand, description, updateBackgroundTasks) {
  const shellId = generateShellId()

  const shellState = {
    id: shellId,
    command: command,
    description: description,
    status: "running",
    startTime: Date.now(),
    shellCommand: shellCommand,
    completionStatusSentInAttachment: false,
    stdout: "",
    stderr: "",
    unregisterCleanup: registerCleanup(cleanup),
    type: "shell"
  }

  // Register this shell in app state
  updateBackgroundTasks(shellId, () => shellState)

  // Start background execution
  const backgroundProcess = shellCommand.background(shellId)

  // Stream stdout updates
  backgroundProcess.stdoutStream.on("data", (chunk) => {
    updateBackgroundTasks(shellId, (shell) => ({
      ...shell,
      stdout: shell.stdout + chunk.toString()
    }))
  })

  // Stream stderr updates
  backgroundProcess.stderrStream.on("data", (chunk) => {
    updateBackgroundTasks(shellId, (shell) => ({
      ...shell,
      stderr: shell.stderr + chunk.toString()
    }))
  })

  // Handle completion
  backgroundProcess.result.then((result) => {
    updateBackgroundTasks(shellId, (shell) => ({
      ...shell,
      status: result.code === 0 ? "completed" : "failed",
      result: { code: result.code, interrupted: result.interrupted }
    }))
  })

  return shellId
}
```

**Background shell lifecycle:**
1. User requests `run_in_background: true` in Bash tool
2. Shell ID returned immediately to Claude
3. Output streams to app state in real-time
4. Claude uses BashOutput tool to check status/output

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
  content: "Command running in background with ID: shell_abc123"
}

// Later, check output with BashOutput tool
{
  type: "tool_use",
  id: "toolu_01B",
  name: "BashOutput",
  input: {
    bash_id: "shell_abc123",
    filter: "error"  // Optional regex filter
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

## Timeout and Retry Mechanisms

### Bash Tool Timeout

The Bash tool implements timeout with configurable values:

```javascript
// ============================================
// Bash Timeout Configuration Functions
// Location: chunks.71.mjs:624-650
// ============================================

// ORIGINAL (for source lookup):
function ErA() {
  let A = process.env.BASH_DEFAULT_TIMEOUT_MS;
  if (A) {
    let Q = parseInt(A, 10);
    if (!isNaN(Q) && Q > 0) return Q
  }
  return 120000
}

function COB() {
  let A = process.env.BASH_MAX_TIMEOUT_MS;
  if (A) {
    let Q = parseInt(A, 10);
    if (!isNaN(Q) && Q > 0) return Math.max(Q, ErA())
  }
  return Math.max(600000, ErA())
}

function ZGA() {
  return ErA()
}

// READABLE (for understanding):
function getDefaultBashTimeout() {
  const envValue = process.env.BASH_DEFAULT_TIMEOUT_MS;
  if (envValue) {
    const parsed = parseInt(envValue, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return 120000;  // Default: 2 minutes
}

function getMaxBashTimeout() {
  const envValue = process.env.BASH_MAX_TIMEOUT_MS;
  if (envValue) {
    const parsed = parseInt(envValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return Math.max(parsed, getDefaultBashTimeout());
    }
  }
  return Math.max(600000, getDefaultBashTimeout());  // Default: 10 minutes (or default if higher)
}

function getBashTimeout() {
  return getDefaultBashTimeout();
}

// Mapping: ErA→getDefaultBashTimeout, COB→getMaxBashTimeout, ZGA→getBashTimeout
```

**Timeout values:**
- Default timeout: `120000ms` (2 minutes) - configurable via `BASH_DEFAULT_TIMEOUT_MS`
- Max timeout: `600000ms` (10 minutes) - configurable via `BASH_MAX_TIMEOUT_MS`

**Timeout behavior:**
1. If command completes before timeout → return result
2. If timeout reached → show "Background" button UI
3. If user clicks "Background" → convert to background task
4. Command continues running, Claude gets shell ID for later checking

### No Explicit Tool Retry

**Key finding:** Claude Code does NOT implement automatic retry for failed tools.

```javascript
// Tool error flow:
// 1. Tool fails → is_error: true returned
// 2. Error message sent to Claude
// 3. Claude decides whether to retry (via new tool call)
// 4. No automatic retry loop in tool execution

// Example error result:
{
  type: "tool_result",
  tool_use_id: "toolu_01A",
  content: "<tool_use_error>File not found: /path/to/missing.ts</tool_use_error>",
  is_error: true
}
```

**Why no automatic retry:**
- LLM is better at deciding appropriate recovery action
- Some errors require different approach (e.g., creating file vs retrying read)
- Prevents infinite loops on persistent failures

### API Call Retry (t61)

While tools don't retry, the **API call** layer has retry logic:

```javascript
// ============================================
// withRetry - API call retry wrapper
// Location: chunks.121.mjs:1988-2046
// ============================================

// READABLE (for understanding):
async function withRetry(apiCall, options) {
  const maxRetries = options.maxRetries ?? 3
  const initialDelay = options.initialDelay ?? 1000

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall()
    } catch (error) {
      if (isRetryableError(error) && attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt)  // Exponential backoff
        await sleep(delay)
        continue
      }
      throw error
    }
  }
}

// Retryable errors:
// - 429 Too Many Requests (rate limit)
// - 500+ Server errors
// - Network timeouts
// - Connection resets
```

---

## Design Pattern Analysis

### ToolCollaborationInterface Pattern

Based on code analysis, Claude Code implements a simplified version:

| Aspect | Implementation |
|--------|---------------|
| **Dependencies** | No explicit prerequisite/concurrent/exclusive declarations |
| **State Sharing** | Via `toolUseContext` object and `readFileState` Map |
| **Error Handling** | Via `abortController` signal and `hasErrored` flag |

```javascript
// State sharing mechanism
interface ToolUseContext {
  getAppState(): Promise<AppState>
  setInProgressToolUseIDs: (updater) => void
  abortController: AbortController
  queryTracking?: { chainId: string, depth: number }
  options: {
    tools: Tool[]
    model: string
    // ...
  }
}

// Error propagation: StreamingToolExecutor.hasErrored
// When one tool fails with is_error: true, all siblings are aborted
```

### Tool Atomic Design

Each tool is self-contained with standard lifecycle:

```
┌──────────────────────────────────────────────────────────────┐
│                        Tool Lifecycle                        │
├──────────────────────────────────────────────────────────────┤
│  1. inputSchema.safeParse(input)    → Schema validation      │
│  2. validateInput(input, context)   → Tool-specific checks   │
│  3. checkPermissions(input, context)→ Permission check       │
│  4. call(input, context, id, meta)  → Execute operation      │
│  5. mapToolResultToToolResultBlock  → Format result          │
└──────────────────────────────────────────────────────────────┘
```

**No cross-tool transactions:** Each tool succeeds or fails independently.

### High Performance Design

| Technique | Implementation |
|-----------|---------------|
| **Bounded Concurrency** | `hk3()` returns max concurrent tools (default: 10) |
| **Promise.race** | `SYA()` for non-blocking parallel execution |
| **Async Generators** | Streaming results without buffering all at once |
| **Early Abort** | `abortController.abort()` cancels sibling tools on error |

```javascript
// Performance configuration via environment:
CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY=10  // Max parallel tools
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
