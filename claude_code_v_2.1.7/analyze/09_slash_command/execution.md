# Command Execution Flow

## Overview

After parsing validates a slash command, the execution system routes it to the appropriate handler based on command type. This document details the execution flow, message creation, and display options.

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

**Key execution functions:**
- `executeSlashCommand` (ab5) - Main dispatcher for command execution
- `processPromptSlashCommand` (RP2) - Handle prompt-type commands
- `executeForkedSlashCommand` (ib5) - Handle forked context commands
- `formatCommandMetadata` (ckA) - Format command metadata for display
- `formatSkillMetadata` (ob5) - Format skill metadata string
- `createUserMessage` (H0) - Create user message objects

---

## Quick Navigation

- [Execution Architecture](#execution-architecture)
- [Main Dispatcher: executeSlashCommand](#main-dispatcher-executeslashcommand)
- [Command Types](#command-types)
- [Prompt Command Processing](#prompt-command-processing)
- [Message Format](#message-format)
- [Error Handling](#error-handling)

---

## Execution Architecture

```
Command (parsed)
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│  executeSlashCommand (ab5)                                       │
│                                                                  │
│  1. Lookup command: eS(commandName, commands)                    │
│  2. Track skill usage: MD1() for prompt-type                     │
│  3. Check userInvocable flag                                     │
│                                                                  │
│  switch (command.type) {                                         │
│    case "local-jsx":  → Promise-based, render JSX component      │
│    case "local":      → Sync execution, text output              │
│    case "prompt":     → LLM invocation with custom prompt        │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
       │
       ├─── "local-jsx" ───┐
       │                   ▼
       │    ┌─────────────────────────────────┐
       │    │ command.call(callback, ctx, args)│
       │    │ Render React/Ink component       │
       │    │ (Interactive UI: config, help)   │
       │    └─────────────────────────────────┘
       │
       ├─── "local" ───────┐
       │                   ▼
       │    ┌─────────────────────────────────┐
       │    │ command.call(args, context)      │
       │    │ Return: skip | compact | value   │
       │    │ (cost, clear, compact)           │
       │    └─────────────────────────────────┘
       │
       └─── "prompt" ──────┐
                           ▼
           ┌─────────────────────────────────┐
           │ context === "fork"?             │
           │   → executeForkedSlashCommand() │
           │   → processPromptSlashCommand() │
           │ (Skills, plugins, bundled)      │
           └─────────────────────────────────┘
```

---

## Main Dispatcher: executeSlashCommand

### ab5 - Main command execution dispatcher

```javascript
// ============================================
// executeSlashCommand - Main command execution dispatcher
// Location: chunks.112.mjs:2597-2747 (Ln 327353)
// ============================================

// ORIGINAL (for source lookup):
async function ab5(A, Q, B, G, Z, Y, J, X) {
  let I = eS(A, G.options.commands);
  if (I.type === "prompt" && I.userInvocable !== !1) MD1(A);
  if (I.userInvocable === !1) return {
    messages: [H0({
      content: IU({ inputString: `/${A}`, precedingInputBlocks: Z })
    }), H0({
      content: `This skill can only be invoked by Claude, not directly by users. Ask Claude to use the "${A}" skill for you.`
    })],
    shouldQuery: !1,
    command: I
  };
  try {
    switch (I.type) {
      case "local-jsx": // ... JSX rendering
      case "local":     // ... text output
      case "prompt":    // ... LLM invocation
    }
  } catch (D) {
    // ... error handling
  }
}

// READABLE (for understanding):
async function executeSlashCommand(
  commandName,          // Name of command to execute
  args,                 // Command arguments
  setCommandJSX,        // Callback to set JSX component
  toolUseContext,       // Tool execution context
  precedingInputBlocks, // Previous input blocks
  attachments,          // File attachments
  messages,             // Conversation messages
  outputWriter          // Output stream writer
) {
  // 1. Lookup command definition
  let command = findCommand(commandName, toolUseContext.options.commands);

  // 2. Track usage for prompt-type, user-invocable skills
  if (command.type === "prompt" && command.userInvocable !== false) {
    trackSkillUsage(commandName);
  }

  // 3. Block non-user-invocable skills
  if (command.userInvocable === false) {
    return {
      messages: [
        createUserMessage({ content: `/${commandName}` }),
        createUserMessage({
          content: `This skill can only be invoked by Claude, not directly by users. Ask Claude to use the "${commandName}" skill for you.`
        })
      ],
      shouldQuery: false,
      command: command
    };
  }

  // 4. Route by command type
  switch (command.type) {
    case "local-jsx": return handleLocalJSXCommand(...);
    case "local":     return handleLocalCommand(...);
    case "prompt":    return handlePromptCommand(...);
  }
}

// Mapping: ab5→executeSlashCommand, A→commandName, Q→args, B→setCommandJSX,
//          G→toolUseContext, Z→precedingInputBlocks, Y→attachments,
//          J→messages, X→outputWriter, I→command
```

**How it works:**

1. **Command lookup**: Uses `eS()` to find command by name/alias
2. **Usage tracking**: Calls `MD1()` for prompt-type skills to track usage frequency
3. **User-invocable check**: Returns helpful message if skill is Claude-only
4. **Type dispatch**: Routes to appropriate handler by command type

**Why this approach:**

- **Centralized dispatch**: Single entry point for all command types
- **Usage tracking**: Enables skill usage analytics and recommendations
- **Permission model**: Supports Claude-only skills (e.g., internal tools)

---

## Command Types

### local-jsx - Interactive UI Commands

JSX commands render React/Ink components for interactive UI.

```javascript
// From ab5, chunks.112.mjs:2614-2655
case "local-jsx":
  return new Promise((resolve) => {
    command.call(
      // onComplete callback
      (output, displayOptions) => {
        if (displayOptions?.display === "skip") {
          resolve({ messages: [], shouldQuery: false, command });
          return;
        }
        // Build messages based on display option
        resolve({
          messages: displayOptions?.display === "system"
            ? [systemMessage(metadata), systemMessage(output)]
            : [userMessage(metadata), userMessage(output)],
          shouldQuery: displayOptions?.shouldQuery ?? false,
          command
        });
      },
      toolUseContext,
      args
    ).then((jsxElement) => {
      // Non-interactive: skip rendering
      if (toolUseContext.options.isNonInteractiveSession) {
        resolve({ messages: [], shouldQuery: false, command });
        return;
      }
      // Render JSX component
      setCommandJSX({ jsx: jsxElement, shouldHidePromptInput: true });
    });
  });
```

**Display options:**
- `"skip"` - Don't add to transcript
- `"system"` - Add as system messages
- Default - Add as user messages

**Examples:** `/config`, `/help`, `/mcp`

### local - Text Output Commands

Local commands execute synchronously and return text output.

```javascript
// From ab5, chunks.112.mjs:2656-2701
case "local": {
  let userMsg = createUserMessage({ content: formatMetadata(command, args) });

  try {
    let result = await command.call(args, toolUseContext);

    if (result.type === "skip") {
      return { messages: [], shouldQuery: false, command };
    }

    if (result.type === "compact") {
      // Handle compaction result with messagesToKeep
      return { messages: buildCompactMessages(result), shouldQuery: false, command };
    }

    // Normal result
    return {
      messages: [userMsg, createUserMessage({ content: `<local-command-stdout>${result.value}</local-command-stdout>` })],
      shouldQuery: false,
      command
    };
  } catch (error) {
    return {
      messages: [userMsg, createUserMessage({ content: `<local-command-stderr>${error}</local-command-stderr>` })],
      shouldQuery: false,
      command
    };
  }
}
```

**Result types:**
- `{ type: "skip" }` - No transcript entry
- `{ type: "compact", compactionResult: {...} }` - Conversation compaction
- `{ type: "value", value: "..." }` - Normal text output

**Examples:** `/cost`, `/clear`, `/compact`

### prompt - LLM Invocation Commands

Prompt commands build a custom prompt and send to the LLM.

```javascript
// From ab5, chunks.112.mjs:2703-2732
case "prompt":
  try {
    // Fork context: Run in separate agent
    if (command.context === "fork") {
      return await executeForkedSlashCommand(command, args, ...);
    }
    // Normal: Process in main thread
    return await processPromptSlashCommand(command, args, ...);
  } catch (error) {
    if (error instanceof AbortError) {
      return { messages: [...], shouldQuery: false, command };
    }
    return {
      messages: [userMsg, errorMsg],
      shouldQuery: false,
      command
    };
  }
```

**Context modes:**
- `"fork"` - Execute in separate agent (subagent)
- Default - Execute in main conversation

**Examples:** `/commit`, `/review`, custom SKILL.md commands

---

## Prompt Command Processing

### processPromptSlashCommand (RP2)

```javascript
// ============================================
// processPromptSlashCommand - Execute prompt-type slash command
// Location: chunks.112.mjs:2778-2818 (Ln 327533)
// ============================================

// ORIGINAL (for source lookup):
async function RP2(A, Q, B, G = [], Z = []) {
  let Y = await A.getPromptForCommand(Q, B);
  if (A.hooks) {
    let F = q0();
    OD1(B.setAppState, F, A.hooks, A.name)
  }
  let J = ob5(A, Q);
  k(`Metadata string for ${A.userFacingName()}:`);
  let X = (J.match(/<command-message>/g) || []).length;
  let I = Uc(A.allowedTools ?? []),
    D = Z.length > 0 || G.length > 0 ? [...Z, ...G, ...Y] : Y,
    W = Hm([H0({ content: D })], void 0),
    K = await QY1(VHA(...)),
    V = [H0({ content: J }), H0({ content: D, isMeta: !0 }), ...K,
         X4({ type: "command_permissions", allowedTools: I, model: A.model })];
  return {
    messages: V,
    shouldQuery: !0,
    allowedTools: I,
    maxThinkingTokens: W > 0 ? W : void 0,
    model: A.model,
    command: A
  }
}

// READABLE (for understanding):
async function processPromptSlashCommand(
  command,              // Command object
  args,                 // Command arguments
  context,              // Execution context
  precedingBlocks = [], // Previous input blocks
  attachments = []      // File attachments
) {
  // 1. Get the prompt content from command
  let promptContent = await command.getPromptForCommand(args, context);

  // 2. Register hooks if command defines them
  if (command.hooks) {
    let hookId = generateHookId();
    registerSkillHooks(context.setAppState, hookId, command.hooks, command.name);
  }

  // 3. Format metadata string for display
  let metadataString = formatSkillMetadata(command, args);

  // 4. Parse allowed tools from command
  let allowedTools = parseAllowedTools(command.allowedTools ?? []);

  // 5. Build combined content (attachments + preceding + prompt)
  let combinedContent = attachments.length > 0 || precedingBlocks.length > 0
    ? [...attachments, ...precedingBlocks, ...promptContent]
    : promptContent;

  // 6. Calculate thinking tokens
  let thinkingTokens = calculateThinkingTokens([createUserMessage({ content: combinedContent })]);

  // 7. Build message array
  let messages = [
    createUserMessage({ content: metadataString }),              // Command metadata
    createUserMessage({ content: combinedContent, isMeta: true }), // Prompt content (meta)
    ...await getSystemReminders(...),                            // System reminders
    createPermissionMessage({                                     // Tool permissions
      type: "command_permissions",
      allowedTools: allowedTools,
      model: command.model
    })
  ];

  return {
    messages: messages,
    shouldQuery: true,           // Triggers LLM query
    allowedTools: allowedTools,
    maxThinkingTokens: thinkingTokens > 0 ? thinkingTokens : undefined,
    model: command.model,        // Optional model override
    command: command
  };
}

// Mapping: RP2→processPromptSlashCommand, A→command, Q→args, B→context,
//          G→precedingBlocks, Z→attachments, Y→promptContent, J→metadataString,
//          I→allowedTools, D→combinedContent, V→messages
```

**Key steps:**

1. **Get prompt content**: Calls `command.getPromptForCommand(args, context)`
2. **Register hooks**: If command has hooks, register them with the session
3. **Format metadata**: Creates display string for transcript
4. **Parse tools**: Extracts allowed tools from command definition
5. **Build messages**: Assembles full message array with permissions
6. **Return with shouldQuery: true**: Signals LLM should process this

**Why this approach:**

- **Separation of concerns**: Command defines prompt, execution handles messaging
- **Hook integration**: Skills can register hooks for tool execution
- **Tool scoping**: Commands can restrict which tools are available
- **Model override**: Skills can specify a different model

---

## Message Format

### formatCommandMetadata (ckA)

```javascript
// ============================================
// formatCommandMetadata - Format command metadata for display
// Location: chunks.112.mjs:2749-2752 (Ln 327506)
// ============================================

// ORIGINAL (for source lookup):
function ckA(A, Q) {
  return `<${mC}>/${A.userFacingName()}</${mC}>
            <${fz}>${A.userFacingName()}</${fz}>
            <command-args>${Q}</command-args>`
}

// READABLE (for understanding):
function formatCommandMetadata(command, args) {
  return `<command-name>/${command.userFacingName()}</command-name>
            <command-message>${command.userFacingName()}</command-message>
            <command-args>${args}</command-args>`;
}

// Mapping: ckA→formatCommandMetadata, A→command, Q→args,
//          mC→"command-name", fz→"command-message"
```

### formatSkillMetadata (ob5)

```javascript
// ============================================
// formatSkillMetadata - Format skill metadata string
// Location: chunks.112.mjs:2765-2768 (Ln 327522)
// ============================================

// ORIGINAL (for source lookup):
function ob5(A, Q) {
  if (A.userInvocable !== !1) return LP2(A.userFacingName(), Q);
  if (A.loadedFrom === "skills" || A.loadedFrom === "plugin") return xz0(A.userFacingName(), A.progressMessage);
  return LP2(A.userFacingName(), Q)
}

// READABLE (for understanding):
function formatSkillMetadata(command, args) {
  // User-invocable commands: standard format
  if (command.userInvocable !== false) {
    return formatUserInvocableMetadata(command.userFacingName(), args);
  }

  // Model-only skills from skills dir or plugins: skill format
  if (command.loadedFrom === "skills" || command.loadedFrom === "plugin") {
    return formatSkillFormatMetadata(command.userFacingName(), command.progressMessage);
  }

  // Default: standard format
  return formatUserInvocableMetadata(command.userFacingName(), args);
}

// Mapping: ob5→formatSkillMetadata, A→command, Q→args
```

**Format differentiation:**

| Command Type | Format | Example |
|--------------|--------|---------|
| User-invocable | `/name` with args | `<command-name>/commit</command-name>` |
| Model-only skill | Skill format | `<skill-format>true</skill-format>` |

---

## Error Handling

### Error Types

| Error | Handling |
|-------|----------|
| `AbortError` (aG) | Return abort message, no query |
| `CommandNotFoundError` (ny) | Return error message with input |
| General Error | Return stderr message, log error |

### Error Message Format

```javascript
// Error output format
{
  messages: [
    createUserMessage({ content: formatMetadata(command, args) }),
    createUserMessage({ content: `<local-command-stderr>${errorMessage}</local-command-stderr>` })
  ],
  shouldQuery: false,
  command: command
}
```

---

## Skill Usage Tracking

### MD1 - Track Skill Usage

```javascript
// ============================================
// trackSkillUsage - Track skill usage for analytics
// Location: chunks.112.mjs:2362-2376 (Ln 327120)
// ============================================

// ORIGINAL (for source lookup):
function MD1(A) {
  let B = L1().skillUsage?.[A],
    G = Date.now(),
    Z = (B?.usageCount ?? 0) + 1;
  if (!B || B.usageCount !== Z || B.lastUsedAt !== G) S0((Y) => ({
    ...Y,
    skillUsage: {
      ...Y.skillUsage,
      [A]: {
        usageCount: Z,
        lastUsedAt: G
      }
    }
  }))
}

// READABLE (for understanding):
function trackSkillUsage(skillName) {
  let existingUsage = getAppState().skillUsage?.[skillName];
  let currentTime = Date.now();
  let newCount = (existingUsage?.usageCount ?? 0) + 1;

  // Update state if changed
  if (!existingUsage || existingUsage.usageCount !== newCount || existingUsage.lastUsedAt !== currentTime) {
    updateAppState((state) => ({
      ...state,
      skillUsage: {
        ...state.skillUsage,
        [skillName]: {
          usageCount: newCount,
          lastUsedAt: currentTime
        }
      }
    }));
  }
}

// Mapping: MD1→trackSkillUsage, A→skillName, B→existingUsage, G→currentTime, Z→newCount
```

**Why track usage:**
- Analytics for skill popularity
- Time-weighted recommendations
- Debugging skill adoption

---

## Related Modules

- [parsing.md](./parsing.md) - Command parsing before execution
- [builtin_commands.md](./builtin_commands.md) - Built-in slash commands
- [custom_commands.md](./custom_commands.md) - User-defined SKILL.md commands
- [10_skill/execution.md](../10_skill/execution.md) - Skill execution details
