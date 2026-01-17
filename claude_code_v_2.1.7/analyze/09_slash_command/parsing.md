# Slash Command Parsing System

## Overview

Claude Code v2.1.7 implements a comprehensive slash command parsing system that validates, classifies, and routes user input to the appropriate command handler. Since v2.1.3, slash commands and skills have been merged into a unified system.

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

**Key parsing functions:**
- `extractCommandParts` (wP2) - Tokenizes input into command name and args
- `isValidCommandName` (nb5) - Validates command name format
- `commandExists` (Cc) - Checks if command is registered
- `findCommand` (eS) - Retrieves command definition with alias resolution
- `parseSlashCommandInput` (OP2) - Main entry point for slash command processing

---

## Quick Navigation

- [Parsing Pipeline Architecture](#parsing-pipeline-architecture)
- [Step 1: Command Extraction](#step-1-command-extraction)
- [Step 2: Command Name Validation](#step-2-command-name-validation)
- [Step 3: Command Type Classification](#step-3-command-type-classification)
- [Step 4: Command Lookup](#step-4-command-lookup)
- [Step 5: Command Dispatch](#step-5-command-dispatch)

---

## Parsing Pipeline Architecture

```
User Input: "/help args"
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. extractCommandParts (wP2)                                   │
│     - Trim and validate "/" prefix                              │
│     - Split into tokens                                         │
│     - Detect MCP marker "(MCP)"                                 │
│     - Extract commandName, args, isMcp                          │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼ { commandName: "help", args: "args", isMcp: false }
       │
┌─────────────────────────────────────────────────────────────────┐
│  2. isValidCommandName (nb5)                                    │
│     - Validate against regex: /[^a-zA-Z0-9:\-_]/                │
│     - Security: Prevent injection via special chars             │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼ true/false
       │
┌─────────────────────────────────────────────────────────────────┐
│  3. Command Type Classification                                 │
│     - isMcp → "mcp"                                             │
│     - !xs().has(commandName) → "custom"                         │
│     - Otherwise → commandName (built-in)                        │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼ commandType: "mcp" | "custom" | "<command-name>"
       │
┌─────────────────────────────────────────────────────────────────┐
│  4. commandExists (Cc) + findCommand (eS)                       │
│     - Check name, userFacingName, aliases                       │
│     - If not found: File path detection fallback                │
│     - Retrieve full command definition                          │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼ Command object or error
       │
┌─────────────────────────────────────────────────────────────────┐
│  5. executeSlashCommand (ab5)                                   │
│     - Route to handler by type: local-jsx, local, prompt        │
│     - Execute command handler                                   │
│     - Build response messages                                   │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼ { messages, shouldQuery, allowedTools, ... }
```

---

## Step 1: Command Extraction

### extractCommandParts (wP2)

The first step extracts the command name and arguments from user input.

```javascript
// ============================================
// extractCommandParts - Parse input into command name, args, and MCP flag
// Location: chunks.112.mjs:2323-2337 (Ln 327082)
// ============================================

// ORIGINAL (for source lookup):
function wP2(A) {
  let Q = A.trim();
  if (!Q.startsWith("/")) return null;
  let G = Q.slice(1).split(" ");
  if (!G[0]) return null;
  let Z = G[0],
    Y = !1,
    J = 1;
  if (G.length > 1 && G[1] === "(MCP)") Z = Z + " (MCP)", Y = !0, J = 2;
  let X = G.slice(J).join(" ");
  return {
    commandName: Z,
    args: X,
    isMcp: Y
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

// Mapping: wP2→extractCommandParts, A→input, Q→trimmedInput, G→tokens,
//          Z→commandName, Y→isMcp, J→argsStartIndex, X→args
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

### isValidCommandName (nb5)

Security function that validates command names against allowed characters.

```javascript
// ============================================
// isValidCommandName - Validate command name format
// Location: chunks.112.mjs:2478-2479 (Ln 327237)
// ============================================

// ORIGINAL (for source lookup):
function nb5(A) {
  return !/[^a-zA-Z0-9:\-_]/.test(A)
}

// READABLE (for understanding):
function isValidCommandName(commandName) {
  // Returns TRUE if command name contains ONLY allowed characters
  // Regex matches any character NOT in the allowed set
  // If regex matches, name is INVALID (return false)
  return !/[^a-zA-Z0-9:\-_]/.test(commandName);
}

// Mapping: nb5→isValidCommandName, A→commandName
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

After extraction and validation, commands are classified into types.

```javascript
// From parseSlashCommandInput (OP2), chunks.112.mjs:2502
let commandType = isMcp ? "mcp" : !xs().has(commandName) ? "custom" : commandName;
```

**Classification logic:**
1. **MCP commands**: If `(MCP)` marker present → type is `"mcp"`
2. **Custom commands**: If not in built-in set `xs()` → type is `"custom"`
3. **Built-in commands**: Otherwise → type is the command name itself

**Built-in command set (`xs`):**

The `xs()` function returns a Set of all built-in command names (non-skill slash commands). This is generated from the `nY9()` array which contains built-in command objects.

```javascript
// Location: chunks.146.mjs:2447
xs = W0(() => new Set(nY9().map((A) => A.name)));
```

---

## Step 4: Command Lookup

### commandExists (Cc)

Checks if a command exists by matching name, userFacingName, or aliases.

```javascript
// ============================================
// commandExists - Check if command is registered
// Location: chunks.146.mjs:2324-2326 (Ln 435240)
// ============================================

// ORIGINAL (for source lookup):
function Cc(A, Q) {
  return Q.some((B) => B.name === A || B.userFacingName() === A || B.aliases?.includes(A))
}

// READABLE (for understanding):
function commandExists(commandName, commands) {
  return commands.some((cmd) =>
    cmd.name === commandName ||
    cmd.userFacingName() === commandName ||
    cmd.aliases?.includes(commandName)
  );
}

// Mapping: Cc→commandExists, A→commandName, Q→commands, B→cmd
```

### findCommand (eS)

Finds and returns a command object, throwing an error if not found.

```javascript
// ============================================
// findCommand - Find command with error handling
// Location: chunks.146.mjs:2328-2332 (Ln 435244)
// ============================================

// ORIGINAL (for source lookup):
function eS(A, Q) {
  let B = Q.find((G) => G.name === A || G.userFacingName() === A || G.aliases?.includes(A));
  if (!B) throw ReferenceError(`Command ${A} not found. Available commands: ${Q.map((G)=>{let Z=G.userFacingName();return G.aliases?`${Z} (aliases: ${G.aliases.join(", ")})`:Z}).sort((G,Z)=>G.localeCompare(Z)).join(", ")}`);
  return B
}

// READABLE (for understanding):
function findCommand(commandName, commands) {
  let command = commands.find((cmd) =>
    cmd.name === commandName ||
    cmd.userFacingName() === commandName ||
    cmd.aliases?.includes(commandName)
  );

  if (!command) {
    // Build helpful error message listing all available commands
    const availableCommands = commands.map((cmd) => {
      let name = cmd.userFacingName();
      return cmd.aliases
        ? `${name} (aliases: ${cmd.aliases.join(", ")})`
        : name;
    }).sort().join(", ");

    throw ReferenceError(`Command ${commandName} not found. Available commands: ${availableCommands}`);
  }

  return command;
}

// Mapping: eS→findCommand, A→commandName, Q→commands, B/G→cmd, Z→name
```

**How lookup works:**
1. **Priority order**: `name` → `userFacingName()` → `aliases`
2. **Match type**: First match wins (using `find()`)
3. **Error handling**: Provides list of all available commands on failure

**Why this approach:**
- Multiple identifiers support backward compatibility and UX
- `userFacingName()` is dynamically computed (can differ from `name`)
- Aliases enable shortcuts (e.g., `/c` for `/commit`)

---

## Step 5: Command Dispatch

### parseSlashCommandInput (OP2)

The main entry point that orchestrates the entire parsing and dispatch flow.

```javascript
// ============================================
// parseSlashCommandInput - Main slash command dispatcher
// Location: chunks.112.mjs:2482-2570 (Ln 327240)
// ============================================

// READABLE pseudocode:
async function parseSlashCommandInput(
  input,              // Raw user input
  precedingBlocks,    // Prior input blocks
  systemMessages,     // System message context
  context,            // Execution context with commands
  setProcessing,      // UI state callback
  options,            // Additional options
  uuid,               // Message UUID
  ...
) {
  // Step 1: Extract command parts
  const parsed = extractCommandParts(input);
  if (!parsed) {
    return { messages: [error("Commands are in the form `/command [args]`")] };
  }

  const { commandName, args, isMcp } = parsed;

  // Step 2: Classify command type
  const commandType = isMcp ? "mcp" : !builtInSet.has(commandName) ? "custom" : commandName;

  // Step 3: Check if command exists
  if (!commandExists(commandName, context.options.commands)) {
    // Check if it's actually a file path
    const isFilePath = fs.existsSync(`/${commandName}`);

    if (isValidCommandName(commandName) && !isFilePath) {
      // Unknown skill error
      return { messages: [error(`Unknown skill: ${commandName}`)] };
    }

    // Treat as regular user prompt (file path or invalid name)
    return { messages: [userMessage(input)], shouldQuery: true };
  }

  // Step 4: Execute the command
  setProcessing(true);
  telemetry("slash-commands");

  const result = await executeSlashCommand(commandName, args, ...);

  return result;
}
```

**Decision flow:**

```
Input "/help args"
    │
    ├─► extractCommandParts() returns null?
    │   └─► Error: "Commands are in the form `/command [args]`"
    │
    ├─► commandExists() returns false?
    │   ├─► Is valid command name AND not a file path?
    │   │   └─► Error: "Unknown skill: <name>"
    │   └─► Otherwise: Treat as regular user prompt
    │
    └─► Command exists
        └─► Execute via executeSlashCommand()
```

**Key insight:** The parser has a file path fallback - if input looks like `/path/to/file`, it's treated as a user prompt rather than an error. This allows natural interaction with file paths.

---

## Error Handling

### Error Messages

| Scenario | Error Message |
|----------|---------------|
| No "/" prefix or empty command | `Commands are in the form \`/command [args]\`` |
| Unknown command (valid name) | `Unknown skill: <commandName>` |
| Command not found in lookup | `Command <name> not found. Available commands: ...` |

### Telemetry Events

| Event | Trigger |
|-------|---------|
| `tengu_input_slash_missing` | Input doesn't match `/command` format |
| `tengu_input_slash_invalid` | Unknown skill name |
| `tengu_input_prompt` | Input treated as regular prompt |
| `tengu_input_command` | Valid command executed |

---

## Related Modules

- [execution.md](./execution.md) - Command execution flow after parsing
- [builtin_commands.md](./builtin_commands.md) - Built-in slash commands
- [custom_commands.md](./custom_commands.md) - User-defined SKILL.md commands
- [10_skill/architecture.md](../10_skill/architecture.md) - Skill system architecture
