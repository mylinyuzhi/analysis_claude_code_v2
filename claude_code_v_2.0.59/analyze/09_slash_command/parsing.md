# Slash Command Parsing System

## Overview

Claude Code v2.0.59 implements a comprehensive slash command parsing system that validates, classifies, and routes user input to the appropriate command handler. This document provides deep analysis of the parsing pipeline with pseudocode and source code snippets.

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

**Key parsing functions:**
- `parseSlashCommandInput` (_P2) - Main entry point for parsing
- `extractCommandParts` (rJA) - Tokenizes input into command name and args
- `isValidCommandName` (if5) - Validates command name format
- `commandExists` (ph) - Checks if command is registered
- `lookupCommand` (Pq) - Retrieves command definition with alias resolution

---

## Parsing Pipeline Architecture

```
User Input: "/help args"
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. extractCommandParts (rJA)                                    │
│     - Trim and validate "/" prefix                               │
│     - Split into tokens                                          │
│     - Detect MCP marker "(MCP)"                                  │
│     - Extract commandName, args, isMcp                           │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼ { commandName: "help", args: "args", isMcp: false }
       │
┌─────────────────────────────────────────────────────────────────┐
│  2. isValidCommandName (if5)                                     │
│     - Validate against regex: /[^a-zA-Z0-9:\-_]/                 │
│     - Security: Prevent injection via special chars              │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼ true/false
       │
┌─────────────────────────────────────────────────────────────────┐
│  3. Command Type Classification                                  │
│     - isMcp → "mcp"                                              │
│     - !Ny().has(commandName) → "custom"                          │
│     - Otherwise → commandName (built-in)                         │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼ commandType: "mcp" | "custom" | "<command-name>"
       │
┌─────────────────────────────────────────────────────────────────┐
│  4. commandExists (ph) + lookupCommand (Pq)                      │
│     - Check name, userFacingName, aliases                        │
│     - If not found: File path detection fallback                 │
│     - Retrieve full command definition                           │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼ Command object or error
       │
┌─────────────────────────────────────────────────────────────────┐
│  5. executeCommand (nf5)                                         │
│     - Route to handler by type: local-jsx, local, prompt         │
│     - Execute command.call()                                     │
│     - Build response messages                                    │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼ { messages, shouldQuery, allowedTools, ... }
```

---

## Step 1: Command Extraction

### extractCommandParts (rJA)

The first step extracts the command name and arguments from user input.

```javascript
// ============================================
// extractCommandParts - Parse input into command name, args, and MCP flag
// Location: chunks.121.mjs:862-877
// ============================================

// ORIGINAL (for source lookup):
function rJA(A) {
  let Q = A.trim();
  if (!Q.startsWith("/")) return null;
  let G = Q.slice(1).split(" ");
  if (!G[0]) return null;
  let Z = G[0],
    I = !1,
    Y = 1;
  if (G.length > 1 && G[1] === "(MCP)") Z = Z + " (MCP)", I = !0, Y = 2;
  let J = G.slice(Y).join(" ");
  return {
    commandName: Z,
    args: J,
    isMcp: I
  }
}

// READABLE (for understanding):
function extractCommandParts(input) {
  let trimmedInput = input.trim();

  // Must start with "/" to be a slash command
  if (!trimmedInput.startsWith("/")) return null;

  // Split by space, skip the leading "/"
  let tokens = trimmedInput.slice(1).split(" ");

  // Command name is required
  if (!tokens[0]) return null;

  let commandName = tokens[0];
  let isMcp = false;
  let argsStartIndex = 1;

  // Detect MCP marker: "/toolname (MCP) args..."
  if (tokens.length > 1 && tokens[1] === "(MCP)") {
    commandName = commandName + " (MCP)";
    isMcp = true;
    argsStartIndex = 2;  // Skip "(MCP)" token
  }

  // Join remaining tokens as args
  let args = tokens.slice(argsStartIndex).join(" ");

  return {
    commandName: commandName,
    args: args,
    isMcp: isMcp
  };
}

// Mapping: rJA→extractCommandParts, A→input, Q→trimmedInput, G→tokens,
//          Z→commandName, I→isMcp, Y→argsStartIndex, J→args
```

**How it works:**
1. Trim whitespace and verify "/" prefix
2. Split on spaces to get tokens
3. First token is the command name
4. Check for "(MCP)" marker as second token (MCP tool invocation)
5. Remaining tokens join to form the args string

**Examples:**

| Input | Result |
|-------|--------|
| `/help` | `{ commandName: "help", args: "", isMcp: false }` |
| `/model claude-sonnet-4` | `{ commandName: "model", args: "claude-sonnet-4", isMcp: false }` |
| `/fetch (MCP) url` | `{ commandName: "fetch (MCP)", args: "url", isMcp: true }` |
| `help` (no slash) | `null` |

---

## Step 2: Command Name Validation

### isValidCommandName (if5)

Security function that validates command names against allowed characters.

```javascript
// ============================================
// isValidCommandName - Validate command name format
// Location: chunks.121.mjs:909-911
// ============================================

// ORIGINAL (for source lookup):
function if5(A) {
  return !/[^a-zA-Z0-9:\-_]/.test(A)
}

// READABLE (for understanding):
function isValidCommandName(commandName) {
  // Returns TRUE if command name contains ONLY allowed characters
  // Regex matches any character NOT in the allowed set
  // If regex matches, name is INVALID (return false)
  return !/[^a-zA-Z0-9:\-_]/.test(commandName);
}

// Mapping: if5→isValidCommandName, A→commandName
```

**Allowed characters:**
- Letters: `a-z`, `A-Z`
- Numbers: `0-9`
- Colon: `:` (for MCP namespacing, e.g., `mcp:server::tool`)
- Hyphen: `-` (for kebab-case, e.g., `my-command`)
- Underscore: `_` (for snake_case, e.g., `my_command`)

**Why this approach:**
- **Security:** Prevents command injection through special characters like `;`, `|`, `&`
- **Simplicity:** Single regex test is fast and unambiguous
- **Flexibility:** Supports multiple naming conventions (kebab-case, snake_case, namespacing)

**Key insight:** The regex uses a negated character class `[^...]` to match ANY disallowed character. If the test succeeds (match found), the name is invalid.

---

## Step 3: Command Type Classification

Commands are classified into three types based on their source:

```javascript
// Classification logic (inline in parseSlashCommandInput):
let commandType = isMcp
  ? "mcp"                           // MCP tool command
  : !Ny().has(commandName)
    ? "custom"                      // Custom command (not in built-in set)
    : commandName;                  // Built-in command name
```

### Type Classification Table

| Condition | Type | Description |
|-----------|------|-------------|
| `isMcp === true` | `"mcp"` | MCP server tool invocation |
| `!Ny().has(commandName)` | `"custom"` | Custom command from `.claude/commands/` or plugins |
| Otherwise | `<command-name>` | Built-in command (e.g., "help", "config") |

### Built-in Command Registry (Ny)

The `Ny()` function returns a cached Set of all built-in command names:

```javascript
// ============================================
// getBuiltinCommandNames - Get Set of built-in command names
// Location: chunks.152.mjs:2265
// ============================================

// ORIGINAL (for source lookup):
Ny = s1(() => new Set(KE9().map((A) => A.name)));

// READABLE (for understanding):
const getBuiltinCommandNames = memoize(() => {
  // Get all built-in command objects
  const builtinCommands = getAllBuiltinCommands();
  // Extract just the names into a Set for O(1) lookup
  return new Set(builtinCommands.map(cmd => cmd.name));
});

// Mapping: Ny→getBuiltinCommandNames, s1→memoize, KE9→getAllBuiltinCommands, A→cmd
```

**Why this approach:**
- **Performance:** Memoized Set provides O(1) lookup
- **Separation of concerns:** Built-in check before custom command lookup
- **Telemetry categorization:** Different events for different command types

---

## Step 4: Command Existence and Lookup

### commandExists (ph)

Checks if a command exists in the registry by name, userFacingName, or aliases:

```javascript
// ============================================
// commandExists - Check if command is registered
// Location: chunks.152.mjs:2174-2176
// ============================================

// ORIGINAL (for source lookup):
function ph(A, Q) {
  return Q.some((B) => B.name === A || B.userFacingName() === A || B.aliases?.includes(A))
}

// READABLE (for understanding):
function commandExists(commandName, commands) {
  return commands.some(cmd =>
    cmd.name === commandName ||                    // Exact name match
    cmd.userFacingName() === commandName ||        // Display name match
    cmd.aliases?.includes(commandName)             // Alias match
  );
}

// Mapping: ph→commandExists, A→commandName, Q→commands, B→cmd
```

**Three-way matching:**
1. **name**: Internal command identifier (e.g., "config")
2. **userFacingName()**: Display name, may include namespacing (e.g., "plugin:command")
3. **aliases**: Alternative names (e.g., `/theme` → `/config`)

### lookupCommand (Pq)

Retrieves the full command definition, throwing descriptive error if not found:

```javascript
// ============================================
// lookupCommand - Find command with error details
// Location: chunks.152.mjs:2178-2182
// ============================================

// ORIGINAL (for source lookup):
function Pq(A, Q) {
  let B = Q.find((G) => G.name === A || G.userFacingName() === A || G.aliases?.includes(A));
  if (!B) throw ReferenceError(`Command ${A} not found. Available commands: ${Q.map((G)=>{let Z=G.userFacingName();return G.aliases?`${Z} (aliases: ${G.aliases.join(", ")})`:Z}).sort((G,Z)=>G.localeCompare(Z)).join(", ")}`);
  return B
}

// READABLE (for understanding):
function lookupCommand(commandName, commands) {
  // Find command by name, userFacingName, or alias
  let command = commands.find(cmd =>
    cmd.name === commandName ||
    cmd.userFacingName() === commandName ||
    cmd.aliases?.includes(commandName)
  );

  if (!command) {
    // Build helpful error message listing all available commands
    const availableCommands = commands
      .map(cmd => {
        const name = cmd.userFacingName();
        return cmd.aliases
          ? `${name} (aliases: ${cmd.aliases.join(", ")})`
          : name;
      })
      .sort((a, b) => a.localeCompare(b))
      .join(", ");

    throw ReferenceError(
      `Command ${commandName} not found. Available commands: ${availableCommands}`
    );
  }

  return command;
}

// Mapping: Pq→lookupCommand, A→commandName, Q→commands, B→command, G→cmd, Z→name
```

**Error handling design:**
- Lists ALL available commands alphabetically
- Includes alias information for discoverability
- ReferenceError type caught by caller for special handling

---

## Step 5: Main Parsing Entry Point

### parseSlashCommandInput (_P2)

The main orchestrator function that combines all parsing steps:

```javascript
// ============================================
// parseSlashCommandInput - Main entry point for slash command parsing
// Location: chunks.121.mjs:913-1016
// ============================================

// ORIGINAL (for source lookup):
async function _P2(A, Q, B, G, Z, I, Y, J, W) {
  let X = rJA(A);
  if (!X) return GA("tengu_input_slash_missing", {}), {
    messages: [cV(), ...G, R0({
      content: Y$({
        inputString: "Commands are in the form `/command [args]`",
        precedingInputBlocks: Q
      })
    })],
    shouldQuery: !1
  };
  let {
    commandName: V,
    args: F,
    isMcp: K
  } = X, D = K ? "mcp" : !Ny().has(V) ? "custom" : V;
  if (!ph(V, Z.options.commands)) {
    let y = RA().existsSync(`/${V}`);
    if (if5(V) && !y) return GA("tengu_input_slash_invalid", {
      input: V
    }), {
      messages: [cV(), ...G, R0({
        content: Y$({
          inputString: `Unknown slash command: ${V}`,
          precedingInputBlocks: Q
        })
      })],
      shouldQuery: !1
    };
    return GA("tengu_input_prompt", {}), HO("user_prompt", {
      prompt_length: String(A.length),
      prompt: n61(A)
    }), {
      messages: [R0({
        content: Y$({
          inputString: A,
          precedingInputBlocks: Q
        }),
        uuid: J
      }), ...G],
      shouldQuery: !0
    }
  }
  I(!0);
  let {
    messages: H,
    shouldQuery: C,
    allowedTools: E,
    skipHistory: U,
    maxThinkingTokens: q,
    model: w,
    command: N
  } = await nf5(V, F, Y, Z, Q, B, W);
  // ... (result processing continues)
}

// READABLE (for understanding):
async function parseSlashCommandInput(
  input,                    // Raw user input string
  precedingInputBlocks,     // Previous input blocks in conversation
  attachments,              // File attachments
  historyMessages,          // Conversation history
  toolUseContext,           // Tool execution context with commands list
  setCommandRunning,        // Callback to set command running state
  cwd,                      // Current working directory
  uuid,                     // Message UUID
  skipCompact               // Skip compaction flag
) {
  // Step 1: Extract command parts
  let parsed = extractCommandParts(input);

  if (!parsed) {
    // Input doesn't look like a command (no "/" prefix or empty)
    telemetry("tengu_input_slash_missing", {});
    return {
      messages: [
        createSystemMessage(),
        ...historyMessages,
        createUserMessage({
          content: buildMessageContent({
            inputString: "Commands are in the form `/command [args]`",
            precedingInputBlocks: precedingInputBlocks
          })
        })
      ],
      shouldQuery: false
    };
  }

  let { commandName, args, isMcp } = parsed;

  // Step 2: Classify command type for telemetry
  let commandType = isMcp
    ? "mcp"
    : !getBuiltinCommandNames().has(commandName)
      ? "custom"
      : commandName;

  // Step 3: Check if command exists
  if (!commandExists(commandName, toolUseContext.options.commands)) {
    // Special case: Check if it's actually a file path like /var/log/...
    let isFilePath = fs.existsSync(`/${commandName}`);

    if (isValidCommandName(commandName) && !isFilePath) {
      // Invalid command with valid name format
      telemetry("tengu_input_slash_invalid", { input: commandName });
      return {
        messages: [
          createSystemMessage(),
          ...historyMessages,
          createUserMessage({
            content: buildMessageContent({
              inputString: `Unknown slash command: ${commandName}`,
              precedingInputBlocks: precedingInputBlocks
            })
          })
        ],
        shouldQuery: false
      };
    }

    // Looks like a file path, treat as regular user prompt
    telemetry("tengu_input_prompt", {});
    logOtel("user_prompt", {
      prompt_length: String(input.length),
      prompt: truncatePrompt(input)
    });
    return {
      messages: [
        createUserMessage({
          content: buildMessageContent({
            inputString: input,
            precedingInputBlocks: precedingInputBlocks
          }),
          uuid: uuid
        }),
        ...historyMessages
      ],
      shouldQuery: true
    };
  }

  // Step 4: Execute the command
  setCommandRunning(true);

  let {
    messages,
    shouldQuery,
    allowedTools,
    skipHistory,
    maxThinkingTokens,
    model,
    command
  } = await executeCommand(
    commandName,
    args,
    cwd,
    toolUseContext,
    precedingInputBlocks,
    attachments,
    skipCompact
  );

  // Step 5: Process result and emit telemetry
  // ... (result processing, telemetry emission)

  return {
    messages: messages,
    shouldQuery: shouldQuery,
    allowedTools: allowedTools,
    maxThinkingTokens: maxThinkingTokens,
    model: model
  };
}

// Mapping: _P2→parseSlashCommandInput, A→input, Q→precedingInputBlocks,
//          B→attachments, G→historyMessages, Z→toolUseContext, I→setCommandRunning,
//          Y→cwd, J→uuid, W→skipCompact, X→parsed, V→commandName, F→args, K→isMcp,
//          D→commandType, rJA→extractCommandParts, ph→commandExists, if5→isValidCommandName,
//          nf5→executeCommand, Ny→getBuiltinCommandNames, GA→telemetry
```

### Parsing Flow Pseudocode

```
FUNCTION parseSlashCommandInput(input, context, ...):

    // Step 1: Extract command parts
    parsed = extractCommandParts(input)

    IF parsed IS NULL:
        EMIT telemetry("tengu_input_slash_missing")
        RETURN error message "Commands are in the form `/command [args]`"

    { commandName, args, isMcp } = parsed

    // Step 2: Classify command type
    commandType =
        IF isMcp: "mcp"
        ELSE IF NOT builtinCommands.has(commandName): "custom"
        ELSE: commandName

    // Step 3: Check existence
    IF NOT commandExists(commandName, registeredCommands):

        // Special case: File path detection
        isFilePath = fs.existsSync("/" + commandName)

        IF isValidCommandName(commandName) AND NOT isFilePath:
            EMIT telemetry("tengu_input_slash_invalid", commandName)
            RETURN error message "Unknown slash command: {commandName}"

        // Treat as regular prompt (e.g., "/var/log/app.log")
        EMIT telemetry("tengu_input_prompt")
        RETURN { messages: [userMessage], shouldQuery: true }

    // Step 4: Execute command
    setCommandRunning(true)
    result = AWAIT executeCommand(commandName, args, context, ...)

    // Step 5: Emit telemetry
    EMIT telemetry("tengu_input_command", { type: commandType, pluginInfo? })

    RETURN result
```

---

## File Path Detection

A key edge case: input like `/var/log/app.log` looks like a command but is actually a file path.

### Detection Logic

```javascript
// File path detection (inline in parseSlashCommandInput):
let isFilePath = fs.existsSync(`/${commandName}`);

if (isValidCommandName(commandName) && !isFilePath) {
  // Valid command name format but command doesn't exist
  // This is an error
  return { messages: [/* error */], shouldQuery: false };
}

// Either invalid format OR is a file path
// Treat as regular user prompt, send to LLM
return { messages: [/* user message */], shouldQuery: true };
```

**Why this approach:**
1. **User intent preservation:** User typing `/var/log/app.log` likely wants to reference the file
2. **Minimal false positives:** Only checks paths starting with common system prefixes
3. **Graceful fallback:** If ambiguous, send to LLM for interpretation

**Special path prefixes handled:**
- `/var` - Variable data files
- `/tmp` - Temporary files
- `/private` - macOS private directory

---

## Telemetry Events

The parsing system emits several telemetry events for monitoring and debugging:

### Event Types

| Event Name | When Emitted | Data |
|------------|--------------|------|
| `tengu_input_slash_missing` | Input starts with "/" but invalid format | `{}` |
| `tengu_input_slash_invalid` | Command name valid but not found | `{ input: commandName }` |
| `tengu_input_prompt` | Input treated as regular prompt | `{ prompt_length, prompt }` |
| `tengu_input_command` | Valid command executed | `{ input: type, plugin_*? }` |

### Telemetry Data Structure

```javascript
// For command execution:
telemetry("tengu_input_command", {
  input: commandType,                    // "mcp", "custom", or command name
  plugin_repository?: string,            // For plugin commands
  plugin_name?: string,
  plugin_version?: string
});

// For invalid commands:
telemetry("tengu_input_slash_invalid", {
  input: commandName                     // The attempted command name
});
```

---

## Parse Result Structure

The final result from parsing contains everything needed for execution:

```typescript
interface ParseResult {
  messages: Message[];           // Messages to add to conversation
  shouldQuery: boolean;          // Whether to invoke LLM
  allowedTools?: string[];       // Restricted tool list (if any)
  skipHistory?: boolean;         // Skip saving to conversation history
  maxThinkingTokens?: number;    // Extended thinking token budget
  model?: string;                // Model override for this command
}
```

### Result Scenarios

| Scenario | shouldQuery | messages | Notes |
|----------|-------------|----------|-------|
| Invalid format | `false` | Error message | User sees format hint |
| Unknown command | `false` | Error message | User sees command not found |
| File path input | `true` | User message | Sent to LLM for interpretation |
| Local command | `false` | Command output | Direct text response |
| Local-JSX command | `false` | Empty or formatted | JSX UI rendered separately |
| Prompt command | `true` | Prompt messages | Sent to LLM with custom prompt |

---

## Allowed Tools Parsing

Commands can specify restricted tools via `allowedTools` property. The parsing handles comma-separated lists with parentheses:

```javascript
// ============================================
// parseAllowedTools - Parse comma-separated tool list
// Location: chunks.153.mjs:1569-1600
// ============================================

// ORIGINAL (for source lookup):
function w0A(A) {
  if (A.length === 0) return [];
  let Q = [];
  for (let B of A) {
    if (!B) continue;
    let G = "",
      Z = !1;
    for (let I of B) switch (I) {
      case "(":
        Z = !0, G += I;
        break;
      case ")":
        Z = !1, G += I;
        break;
      case ",":
        if (Z) G += I;
        else {
          if (G.trim()) Q.push(G.trim());
          G = ""
        }
        break;
      case " ":
        if (Z) G += I;
        else if (G.trim()) Q.push(G.trim()), G = "";
        break;
      default:
        G += I
    }
    if (G.trim()) Q.push(G.trim())
  }
  return Q
}

// READABLE (for understanding):
function parseAllowedTools(allowedToolStrings) {
  if (allowedToolStrings.length === 0) return [];

  let result = [];

  for (let toolString of allowedToolStrings) {
    if (!toolString) continue;

    let currentToken = "";
    let insideParentheses = false;

    for (let char of toolString) {
      switch (char) {
        case "(":
          insideParentheses = true;
          currentToken += char;
          break;
        case ")":
          insideParentheses = false;
          currentToken += char;
          break;
        case ",":
          if (insideParentheses) {
            // Comma inside parens is part of token (e.g., "Bash(ls,-la)")
            currentToken += char;
          } else {
            // Comma outside parens is delimiter
            if (currentToken.trim()) {
              result.push(currentToken.trim());
            }
            currentToken = "";
          }
          break;
        case " ":
          if (insideParentheses) {
            currentToken += char;
          } else if (currentToken.trim()) {
            // Space outside parens also delimits
            result.push(currentToken.trim());
            currentToken = "";
          }
          break;
        default:
          currentToken += char;
      }
    }

    // Don't forget the last token
    if (currentToken.trim()) {
      result.push(currentToken.trim());
    }
  }

  return result;
}

// Mapping: w0A→parseAllowedTools, A→allowedToolStrings, Q→result, B→toolString,
//          G→currentToken, Z→insideParentheses, I→char
```

**Why this approach:**
- **Handles complex tool specs:** `Bash(ls:*, grep:*)` keeps parenthetical content together
- **Multiple delimiters:** Both comma and space work as separators
- **State machine pattern:** Tracks parentheses nesting for correct parsing

**Examples:**

| Input | Output |
|-------|--------|
| `["Read, Write"]` | `["Read", "Write"]` |
| `["Bash(ls:*, grep:*)"]` | `["Bash(ls:*, grep:*)"]` |
| `["Read Write Grep"]` | `["Read", "Write", "Grep"]` |

---

## Error Handling

### Error Types

| Error | Handler | User Feedback |
|-------|---------|---------------|
| Invalid format | Return error message | "Commands are in the form `/command [args]`" |
| Unknown command | Return error message | "Unknown slash command: {name}" |
| Lookup failure | ReferenceError | Lists available commands with aliases |
| Execution error | Catch and format | `<local-command-stderr>` tag |

### Command Not Found Error

The `lookupCommand` function provides helpful error messages:

```
Command mycommand not found. Available commands:
clear (aliases: reset, new), compact, config (aliases: theme, settings),
context, cost, doctor, help, ide, init, memory, ...
```

---

## Command Registry Loading

All commands (built-in, custom, plugin) are merged into a single registry:

```javascript
// ============================================
// getAllEnabledCommands - Merge all command sources
// Location: chunks.152.mjs:2266-2272
// ============================================

// ORIGINAL (for source lookup):
sE = s1(async () => {
  let [A, { skillDirCommands: Q, pluginSkills: B }, G, Z] =
    await Promise.all([fC9(), Sv3(), PQA(), jv3()]);
  return [...A, ...Q, ...G, ...B, ...Z, ...KE9()].filter((I) => I.isEnabled())
});

// READABLE (for understanding):
const getAllEnabledCommands = memoize(async () => {
  // Load commands from all sources in parallel
  const [
    customCommands,          // From .claude/commands/
    { skillDirCommands, pluginSkills },  // From skills and plugins
    mcpCommands,             // From MCP servers
    policyCommands           // From policy configuration
  ] = await Promise.all([
    loadCustomCommandsForExecution(),
    getSkillsFromPluginsAndDirectories(),
    getMcpCommands(),
    getPolicyCommands()
  ]);

  // Merge all sources, add built-in commands last
  return [
    ...customCommands,
    ...skillDirCommands,
    ...mcpCommands,
    ...pluginSkills,
    ...policyCommands,
    ...getAllBuiltinCommands()
  ].filter(cmd => cmd.isEnabled());  // Only enabled commands
});

// Mapping: sE→getAllEnabledCommands, s1→memoize, fC9→loadCustomCommandsForExecution,
//          Sv3→getSkillsFromPluginsAndDirectories, KE9→getAllBuiltinCommands
```

**Loading order matters:**
1. Custom commands loaded first (can override)
2. Skill and plugin commands
3. MCP commands
4. Policy commands
5. Built-in commands (lowest priority)

**Key insight:** The `isEnabled()` filter runs after merging, allowing commands to be conditionally disabled based on runtime state.

---

## See Also

- [Command Execution](./execution.md) - How commands execute after parsing
- [Built-in Commands](./builtin_commands.md) - All built-in command definitions
- [Custom Commands](./custom_commands.md) - Custom command loading system
- [Streaming and Errors](./streaming_errors.md) - Streaming support and error handling
