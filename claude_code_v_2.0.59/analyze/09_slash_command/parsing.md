# Slash Command Parsing and Registration

## Overview

Claude Code v2.0.59 implements a comprehensive slash command system that supports built-in commands, custom commands from `.claude/commands/`, and plugin-provided commands. This document describes the parsing logic, command registration mechanism, and command loading.

---

## Command Parsing

### Entry Point: `_P2()`

Main function for parsing user input and determining if it's a slash command:

```typescript
async function _P2(
  input: string,                    // User input
  precedingInputBlocks: Block[],   // Previous input blocks
  attachments: Attachment[],       // File attachments
  historyMessages: Message[],      // Conversation history
  toolUseContext: ToolUseContext,  // Tool execution context
  setCommandRunning: (running: boolean) => void,
  cwd: string,                     // Current working directory
  uuid: string,                    // Message UUID
  skipCompact: boolean             // Skip compaction flag
): Promise<ParseResult>
```

### Parsing Flow

#### 1. Extract Command Name

Function: `rJA(input: string)`

Extracts command name and arguments from input:

```typescript
let parsed = rJA(input);
if (!parsed) {
  // Not a valid slash command
  return {
    messages: [/* error message */],
    shouldQuery: false
  };
}

let {
  commandName: string,
  args: string,
  isMcp: boolean
} = parsed;
```

**Expected Format:**
```
/command arg1 arg2 ...
```

**Examples:**
- `/help` → `{ commandName: "help", args: "", isMcp: false }`
- `/model claude-sonnet-4` → `{ commandName: "model", args: "claude-sonnet-4", isMcp: false }`
- `/mcp:server::tool` → `{ commandName: "mcp:server::tool", args: "", isMcp: true }`

#### 2. Validate Command Name

Function: `if5(commandName: string)`

Validates command name format:

```typescript
function if5(commandName: string): boolean {
  return !/[^a-zA-Z0-9:\-_]/.test(commandName);
}
```

**Valid Characters:**
- Letters: `a-z`, `A-Z`
- Numbers: `0-9`
- Special: `:`, `-`, `_`

#### 3. Command Type Classification

Determines command source:

```typescript
let commandType =
  isMcp ? "mcp" :
  !Ny().has(commandName) ? "custom" :
  commandName;  // Built-in command name
```

**Types:**
- `"mcp"`: MCP server tool invocation
- `"custom"`: Custom command from `.claude/commands/`
- `<name>`: Built-in command (e.g., "help", "model")

#### 4. Command Existence Check

Function: `ph(commandName: string, commands: Command[])`

Checks if command exists in registry:

```typescript
if (!ph(commandName, toolUseContext.options.commands)) {
  // Check if it's a valid file path (special case)
  let isFilePath = fs.existsSync(`/${commandName}`);

  if (if5(commandName) && !isFilePath) {
    // Unknown command error
    telemetry("tengu_input_slash_invalid", { input: commandName });
    return {
      messages: [/* "Unknown slash command" error */],
      shouldQuery: false
    };
  }

  // Treat as regular prompt if looks like file path
  telemetry("tengu_input_prompt", {});
  return {
    messages: [/* Regular user message */],
    shouldQuery: true
  };
}
```

#### 5. Command Execution

Function: `nf5(commandName, args, cwd, context, ...)`

Executes the matched command:

```typescript
setCommandRunning(true);

let {
  messages,
  shouldQuery,
  allowedTools,
  skipHistory,
  maxThinkingTokens,
  model,
  command
} = await nf5(commandName, args, cwd, toolUseContext, ...);
```

### Parse Result Structure

```typescript
{
  messages: Message[],          // Messages to add to conversation
  shouldQuery: boolean,         // Whether to send to LLM
  allowedTools?: string[],      // Restricted tool list (if any)
  skipHistory?: boolean,        // Skip saving to history
  maxThinkingTokens?: number,   // Extended thinking tokens
  model?: string                // Model override
}
```

---

## Command Execution: `nf5()`

Main function for executing a command after parsing:

```typescript
async function nf5(
  commandName: string,
  args: string,
  cwd: string,
  context: ToolUseContext,
  precedingInputBlocks: Block[],
  attachments: Attachment[],
  skipCompact: boolean
): Promise<ExecutionResult>
```

### Execution by Command Type

#### 1. Local JSX Commands (`type: "local-jsx"`)

Commands that render interactive UI components:

```typescript
case "local-jsx":
  return new Promise((resolve) => {
    command.call(
      (output, displayOptions) => {
        // Handle completion
        if (displayOptions?.display === "skip") {
          resolve({
            messages: [],
            shouldQuery: false,
            skipHistory: true,
            command
          });
          return;
        }

        resolve({
          messages: [
            /* User message with command */,
            /* Output message */
          ],
          shouldQuery: false,
          command
        });
      },
      context,
      args
    ).then((jsx) => {
      if (context.options.isNonInteractiveSession) {
        // Skip JSX in non-interactive mode
        resolve({
          messages: [],
          shouldQuery: false,
          skipHistory: true,
          command
        });
        return;
      }

      // Render JSX component
      setLocalCommandJSX({
        jsx: jsx,
        shouldHidePromptInput: true,
        showSpinner: false,
        isLocalJSXCommand: false
      });
    });
  });
```

**Examples:** `/help`, `/config`, `/context`, `/ide`

#### 2. Local Commands (`type: "local"`)

Commands that return text or perform actions synchronously:

```typescript
case "local": {
  let userMessage = createUserMessage(command, args);

  try {
    let systemMessage = createSystemMessage();
    let result = await command.call(args, context);

    if (result.type === "skip") {
      return {
        messages: [],
        shouldQuery: false,
        skipHistory: true,
        command
      };
    }

    if (result.type === "compact") {
      // Handle compaction result
      let {
        boundaryMarker,
        summaryMessages,
        attachments,
        hookResults
      } = result.compactionResult;

      return {
        messages: [
          boundaryMarker,
          ...summaryMessages,
          systemMessage,
          userMessage,
          ...(result.displayText ? [createOutputMessage(result.displayText)] : []),
          ...attachments,
          ...hookResults
        ],
        shouldQuery: false,
        command
      };
    }

    // Regular text result
    return {
      messages: [
        systemMessage,
        userMessage,
        createOutputMessage(result.value)
      ],
      shouldQuery: false,
      command
    };
  } catch (error) {
    // Handle error
    return {
      messages: [
        userMessage,
        createErrorMessage(error)
      ],
      shouldQuery: false,
      command
    };
  }
}
```

**Examples:** `/cost`, `/memory`, `/doctor`

#### 3. Prompt Commands (`type: "prompt"`)

Commands that invoke LLM with specific prompts:

```typescript
case "prompt":
  return await processPromptSlashCommand(
    command,
    args,
    context,
    precedingInputBlocks,
    cwd,
    skipCompact
  );
```

See [Prompt Command Processing](#prompt-command-processing) below.

**Examples:** Plugin-provided commands, custom prompts

---

## Prompt Command Processing

Function: `processPromptSlashCommand()`

Handles commands that invoke the LLM with custom prompts:

```typescript
async function processPromptSlashCommand(
  command: PromptCommand,
  args: string,
  context: ToolUseContext,
  precedingInputBlocks: Block[],
  cwd: string,
  skipCompact: boolean
): Promise<{
  messages: Message[],
  shouldQuery: boolean,
  allowedTools?: string[],
  maxThinkingTokens?: number,
  model?: string,
  command: Command
}>
```

### Processing Steps

#### 1. Build Prompt Content

```typescript
let promptParts = [];

// Add description
if (command.description) {
  promptParts.push(command.description);
}

// Add prompt template
promptParts.push(command.prompt);

// Replace placeholders
let promptContent = promptParts
  .join("\n\n")
  .replace("$ARGS", args)
  .replace("$CWD", cwd);
```

#### 2. Process Attachments

```typescript
let attachmentMessages = [];
let textAttachments = [];

if (command.attachments) {
  for (let attachment of command.attachments) {
    // Process each attachment (files, images, etc.)
    let processed = await processAttachment(attachment, context);
    textAttachments.push(processed);
  }
}
```

#### 3. Combine Content

```typescript
let combinedContent = [
  ...precedingInputBlocks,
  ...textAttachments,
  ...promptParts
];

// Calculate thinking tokens if needed
let maxThinkingTokens = calculateThinkingTokens(
  combinedContent,
  context,
  command.maxThinkingTokens
);
```

#### 4. Build Messages Array

```typescript
let messages = [
  createUserMessage({ content: precedingInputBlocks }),
  createUserMessage({
    content: combinedContent,
    isMeta: true
  }),
  ...processedAttachments,
  ...additionalMessages
];

// Add command permissions if tools restricted
if (command.allowedTools?.length || command.model) {
  messages.push(createCommandPermissionsMessage({
    allowedTools: command.allowedTools,
    model: command.useSmallFastModel ? getSmallFastModel() : command.model
  }));
}
```

#### 5. Return Result

```typescript
return {
  messages: messages,
  shouldQuery: true,
  allowedTools: command.allowedTools,
  maxThinkingTokens: maxThinkingTokens > 0 ? maxThinkingTokens : undefined,
  model: command.useSmallFastModel ? getSmallFastModel() : command.model,
  command: command
};
```

### Prompt Command Schema

```typescript
{
  type: "prompt",
  name: string,
  description?: string,
  prompt: string,              // Prompt template
  allowedTools?: string[],     // Restricted tools
  model?: string,              // Model override
  useSmallFastModel?: boolean, // Use small fast model
  attachments?: Attachment[],  // Files/images to include
  maxThinkingTokens?: number,  // Extended thinking
  pluginInfo?: {               // If from plugin
    pluginManifest: Manifest,
    repository: string
  }
}
```

---

## Command Registration

### Built-in Command Registry

Function: `Ny()`

Returns a Set of built-in command names:

```typescript
function Ny(): Set<string> {
  return new Set([
    "help",
    "config",
    "context",
    "cost",
    "doctor",
    "ide",
    "init",
    "memory",
    // ... more built-in commands
  ]);
}
```

### Command Lookup

Function: `Pq(commandName: string, commands: Command[])`

Retrieves command definition from registry:

```typescript
function Pq(
  commandName: string,
  commands: Command[]
): Command {
  // Find exact match
  let command = commands.find(c => c.name === commandName);

  if (command) return command;

  // Check aliases
  command = commands.find(c =>
    c.aliases && c.aliases.includes(commandName)
  );

  if (command) return command;

  // Not found - will be caught by ph() check
  throw new Error(`Command not found: ${commandName}`);
}
```

### Command Existence Check

Function: `ph(commandName: string, commands: Command[])`

Checks if command exists (including aliases):

```typescript
function ph(
  commandName: string,
  commands: Command[]
): boolean {
  return commands.some(c =>
    c.name === commandName ||
    (c.aliases && c.aliases.includes(commandName))
  );
}
```

---

## Custom Command Loading

### Location

Custom commands are loaded from:
```
.claude/commands/
```

### Directory Structure

```
.claude/
└── commands/
    ├── my-command.json
    ├── analyze.json
    └── review/
        └── code-review.json
```

### Custom Command Format

```json
{
  "name": "my-command",
  "description": "Description of what the command does",
  "type": "prompt",
  "prompt": "Prompt template with $ARGS placeholder",
  "allowedTools": ["Read", "Grep"],
  "model": "claude-sonnet-4-5-20250929"
}
```

### Loading Process

1. **Scan Directory:**
   - Recursively scan `.claude/commands/`
   - Find all `.json` files

2. **Parse Command Files:**
   - Read each JSON file
   - Validate against command schema
   - Extract command definition

3. **Register Commands:**
   - Add to command registry
   - Check for name conflicts
   - Merge with built-in commands

4. **Validation:**
   - Ensure unique names (no conflicts with built-ins)
   - Validate required fields
   - Check tool names in `allowedTools`

### Custom Command Example

File: `.claude/commands/analyze.json`

```json
{
  "name": "analyze",
  "description": "Analyze code quality and suggest improvements",
  "type": "prompt",
  "prompt": "Analyze the following code for quality, performance, and best practices:\n\n$ARGS\n\nProvide specific suggestions for improvement.",
  "allowedTools": ["Read", "Grep", "Glob"],
  "maxThinkingTokens": 5000
}
```

Usage:
```
/analyze src/main.js
```

---

## Plugin Command Integration

### Plugin Command Loading

Plugins can contribute commands through manifests:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "commands": [
    {
      "name": "plugin-command",
      "description": "Command provided by plugin",
      "type": "prompt",
      "prompt": "Plugin-specific prompt..."
    }
  ]
}
```

### Plugin Command Registration

1. **Load Plugin Manifest:**
   - Read plugin's manifest file
   - Extract commands array

2. **Add Plugin Context:**
   ```typescript
   {
     ...command,
     pluginInfo: {
       pluginManifest: manifest,
       repository: repositoryUrl
     }
   }
   ```

3. **Register with Namespace:**
   - Optionally namespace: `/plugin:command`
   - Or use plain name: `/command`

4. **Track Source:**
   - Commands know their source plugin
   - Used for telemetry and debugging

### MCP Command Integration

MCP (Model Context Protocol) servers can provide tools that appear as commands:

Format: `/mcp:server_name::tool_name`

Example: `/mcp:filesystem::read_file path/to/file.txt`

Parsing:
```typescript
{
  commandName: "mcp:filesystem::read_file",
  args: "path/to/file.txt",
  isMcp: true
}
```

---

## Command Aliases

Commands can define aliases for convenience:

```typescript
{
  name: "config",
  aliases: ["theme", "settings"],
  // ...
}
```

Usage:
- `/config` - Primary name
- `/theme` - Alias
- `/settings` - Alias

All resolve to the same command.

---

## Special Command Handling

### Bash Input Detection

If input starts with `!`, it's treated as bash command:

```typescript
if (input.startsWith("!")) {
  let bashCommand = input.substring(1);
  return await executeBashCommand(bashCommand, ...);
}
```

Example:
```
!npm install
!git status
```

### File Path Detection

If command name looks like absolute file path, treat as regular input:

```typescript
let isFilePath = fs.existsSync(`/${commandName}`);

if (!if5(commandName) || isFilePath) {
  // Treat as regular prompt, not command
  return {
    messages: [createUserMessage(input)],
    shouldQuery: true
  };
}
```

Example:
```
/var/log/app.log  → Treated as regular input
/tmp/test.txt     → Treated as regular input
```

---

## Error Handling

### Unknown Command

```typescript
telemetry("tengu_input_slash_invalid", {
  input: commandName
});

return {
  messages: [
    createSystemMessage(),
    createUserMessage(`Unknown slash command: ${commandName}`)
  ],
  shouldQuery: false
};
```

### Command Execution Error

```typescript
try {
  result = await command.call(args, context);
} catch (error) {
  return {
    messages: [
      createUserMessage(command, args),
      createErrorMessage(error)
    ],
    shouldQuery: false,
    command
  };
}
```

### Invalid Command Format

```typescript
if (!rJA(input)) {
  return {
    messages: [
      createErrorMessage("Commands are in the form `/command [args]`")
    ],
    shouldQuery: false
  };
}
```

---

## Telemetry

Command parsing emits telemetry events:

```typescript
// Unknown command
telemetry("tengu_input_slash_invalid", {
  input: commandName
});

// Missing slash
telemetry("tengu_input_slash_missing", {});

// Valid command
telemetry("tengu_input_command", {
  input: commandType,
  plugin_repository?: string,
  plugin_name?: string,
  plugin_version?: string
});

// Regular prompt
telemetry("tengu_input_prompt", {
  prompt_length: string,
  prompt: string
});
```

---

## Command Definition Types

### LocalJSXCommand

```typescript
{
  type: "local-jsx",
  name: string,
  description: string,
  isEnabled: () => boolean,
  isHidden: boolean,
  async call(
    onComplete: (output: string, options?: DisplayOptions) => void,
    context: ToolUseContext,
    args: string
  ): Promise<JSX.Element>,
  userFacingName(): string
}
```

### LocalCommand

```typescript
{
  type: "local",
  name: string,
  description: string,
  isEnabled: () => boolean,
  isHidden?: boolean,
  supportsNonInteractive?: boolean,
  async call(
    args: string,
    context: ToolUseContext
  ): Promise<CommandResult>,
  userFacingName(): string
}
```

### PromptCommand

```typescript
{
  type: "prompt",
  name: string,
  description?: string,
  prompt: string,
  allowedTools?: string[],
  model?: string,
  useSmallFastModel?: boolean,
  attachments?: Attachment[],
  maxThinkingTokens?: number,
  pluginInfo?: PluginInfo,
  isEnabled?: () => boolean,
  isHidden?: boolean,
  userFacingName(): string
}
```

---

## Best Practices

### 1. Command Naming

- Use lowercase with hyphens: `/my-command`
- Avoid special characters except `:`, `-`, `_`
- Keep names short and descriptive
- Use aliases for common variations

### 2. Custom Commands

- Place in `.claude/commands/` for project-wide use
- Use descriptive filenames matching command name
- Include clear descriptions
- Test with various arguments

### 3. Prompt Templates

- Use `$ARGS` placeholder for arguments
- Use `$CWD` placeholder for current directory
- Provide clear instructions in prompt
- Specify allowed tools to reduce context

### 4. Error Handling

- Validate arguments before execution
- Provide helpful error messages
- Use try-catch for async operations
- Return appropriate shouldQuery flag

### 5. Plugin Commands

- Namespace commands to avoid conflicts
- Include plugin metadata
- Document command usage
- Test in isolation

---

## See Also

- [Built-in Commands](./builtin_commands.md) - All built-in slash commands
- [Plugin System](../10_skill/overview.md) - Plugin development and integration
- [Command Permissions](../05_tools/permissions.md) - Tool restriction system
