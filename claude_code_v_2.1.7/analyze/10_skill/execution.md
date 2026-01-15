# Skill Execution Flow

## Overview

When a skill is invoked (either by the LLM or user), it goes through a specific execution flow that builds the prompt, registers hooks, and creates the message array for the LLM. This document details the skill execution process.

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

**Key execution functions:**
- `processPromptSlashCommand` (RP2) - Execute prompt-type command
- `executeForkedSlashCommand` (ib5) - Execute in forked context
- `executeSkillFromTool` (MP2) - Execute skill via Skill Tool
- `registerSkillHooks` (OD1) - Register skill hooks
- `formatSkillMetadata` (ob5) - Format metadata string

---

## Quick Navigation

- [Execution Architecture](#execution-architecture)
- [Prompt Command Processing](#prompt-command-processing)
- [Forked Execution](#forked-execution)
- [Skill Tool Invocation](#skill-tool-invocation)
- [Hook Registration](#hook-registration)
- [Message Assembly](#message-assembly)

---

## Execution Architecture

```
Skill Invocation
       │
       ├─── User: /skill-name args
       │          │
       │          ▼
       │    executeSlashCommand (ab5)
       │          │
       │          ▼
       │    ┌─────────────────┐
       │    │ command.type?   │
       │    └────────┬────────┘
       │             │
       │             ▼ "prompt"
       │    ┌─────────────────┐
       │    │context === fork?│
       │    └────────┬────────┘
       │        │         │
       │   fork │         │ main
       │        ▼         ▼
       │    ib5()      RP2()
       │
       └─── LLM: Skill Tool
                    │
                    ▼
              executeSkillFromTool (MP2)
                    │
                    ▼
              processPromptSlashCommand (RP2)
```

---

## Prompt Command Processing

### processPromptSlashCommand (RP2)

The main execution function for prompt-type skills.

```javascript
// ============================================
// processPromptSlashCommand - Execute prompt-type skill
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
  k(`Metadata string for ${A.userFacingName()}:`), k(`  ${J.substring(0,200)}`);
  let X = (J.match(/<command-message>/g) || []).length;
  k(`  command-message tags in metadata: ${X}`);
  let I = Uc(A.allowedTools ?? []),
    D = Z.length > 0 || G.length > 0 ? [...Z, ...G, ...Y] : Y,
    W = Hm([H0({ content: D })], void 0),
    K = await QY1(VHA(Y.filter((F) => F.type === "text").map((F) => F.text).join(" "), B, null, [], B.messages, "repl_main_thread")),
    V = [
      H0({ content: J }),
      H0({ content: D, isMeta: !0 }),
      ...K,
      X4({ type: "command_permissions", allowedTools: I, model: A.model })
    ];
  return k(`processPromptSlashCommand creating ${V.length} messages for ${A.userFacingName()}`), {
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
  command,              // Skill/command object
  args,                 // User arguments
  context,              // Execution context
  precedingBlocks = [], // Prior input blocks
  attachments = []      // File attachments
) {
  // Step 1: Get prompt content from skill
  const promptContent = await command.getPromptForCommand(args, context);

  // Step 2: Register hooks if skill defines them
  if (command.hooks) {
    const hookId = generateHookId();
    registerSkillHooks(context.setAppState, hookId, command.hooks, command.name);
  }

  // Step 3: Format metadata string for transcript
  const metadataString = formatSkillMetadata(command, args);
  log(`Metadata string for ${command.userFacingName()}:`);
  log(`  ${metadataString.substring(0, 200)}`);

  // Count command-message tags
  const commandMessageCount = (metadataString.match(/<command-message>/g) || []).length;
  log(`  command-message tags in metadata: ${commandMessageCount}`);

  // Step 4: Parse allowed tools from command
  const allowedTools = parseAllowedTools(command.allowedTools ?? []);

  // Step 5: Build combined content
  const combinedContent = attachments.length > 0 || precedingBlocks.length > 0
    ? [...attachments, ...precedingBlocks, ...promptContent]
    : promptContent;

  // Step 6: Calculate thinking tokens
  const thinkingTokens = calculateThinkingTokens([createUserMessage({ content: combinedContent })]);

  // Step 7: Get system reminders
  const systemReminders = await getSystemReminders(
    extractTextContent(promptContent),
    context,
    null,
    [],
    context.messages,
    "repl_main_thread"
  );

  // Step 8: Build message array
  const messages = [
    createUserMessage({ content: metadataString }),              // Command metadata
    createUserMessage({ content: combinedContent, isMeta: true }), // Prompt content (hidden)
    ...systemReminders,                                           // System reminders
    createPermissionMessage({                                     // Tool permissions
      type: "command_permissions",
      allowedTools: allowedTools,
      model: command.model
    })
  ];

  log(`processPromptSlashCommand creating ${messages.length} messages for ${command.userFacingName()}`);

  return {
    messages: messages,
    shouldQuery: true,           // Trigger LLM query
    allowedTools: allowedTools,
    maxThinkingTokens: thinkingTokens > 0 ? thinkingTokens : undefined,
    model: command.model,        // Model override
    command: command
  };
}

// Mapping: RP2→processPromptSlashCommand, A→command, Q→args, B→context,
//          G→precedingBlocks, Z→attachments, Y→promptContent, J→metadataString,
//          I→allowedTools, D→combinedContent, V→messages
```

**Execution steps:**

1. **Get prompt**: Call `getPromptForCommand(args, context)` on skill
2. **Register hooks**: If skill has hooks, register them with session
3. **Format metadata**: Create display string for transcript
4. **Parse tools**: Extract allowed tools from skill definition
5. **Build content**: Combine attachments + preceding blocks + prompt
6. **Calculate thinking**: Determine thinking token budget
7. **Get reminders**: Fetch relevant system reminders
8. **Build messages**: Assemble final message array

---

## Forked Execution

### executeForkedSlashCommand (ib5)

For skills with `context: "fork"`, execution happens in a separate agent.

```javascript
// ============================================
// executeForkedSlashCommand - Execute skill in forked context
// Location: chunks.112.mjs:2390-2475 (Ln 327149)
// ============================================

// READABLE pseudocode:
async function executeForkedSlashCommand(
  command,
  args,
  context,
  precedingBlocks,
  setCommandJSX,
  outputWriter
) {
  const sessionId = generateSessionId();
  telemetry("tengu_slash_command_forked", { command_name: command.name });

  // Prepare skill execution
  const {
    skillContent,
    modifiedGetAppState,
    baseAgent,
    promptMessages
  } = await prepareSkillExecution(command, args, context);

  log(`Executing forked slash command /${command.name} with agent ${baseAgent.agentType}`);

  // Progress tracking
  const progressMessages = [];
  let progressCount = 0;
  const createProgress = (message) => ({
    type: "progress",
    data: { message, count: ++progressCount }
  });

  // Run the agent
  const result = await runForkedAgent(
    baseAgent,
    promptMessages,
    context,
    createProgress
  );

  // Format output
  const outputText = formatOutput(result, "Command completed");

  log(`Forked slash command /${command.name} completed with agent ${sessionId}`);

  return {
    messages: [
      createUserMessage({ content: buildInputString(`/${command.userFacingName()} ${args}`.trim(), precedingBlocks) }),
      createUserMessage({ content: `<local-command-stdout>\n${outputText}\n</local-command-stdout>` })
    ],
    shouldQuery: false,
    command: command,
    resultText: outputText
  };
}
```

**Fork vs Main execution:**

| Aspect | Main (`RP2`) | Fork (`ib5`) |
|--------|--------------|--------------|
| Context | Same conversation | New agent |
| Output | `shouldQuery: true` | `shouldQuery: false` |
| Messages | Prompt for LLM | Final result |
| Use case | Interactive skills | Background tasks |

---

## Skill Tool Invocation

### executeSkillFromTool (MP2)

When the LLM calls the Skill Tool, this function handles the invocation.

```javascript
// ============================================
// executeSkillFromTool - Execute skill from Skill Tool
// Location: chunks.112.mjs:2771-2776 (Ln 327527)
// ============================================

// ORIGINAL (for source lookup):
async function MP2(A, Q, B, G, Z = []) {
  if (!Cc(A, B)) throw new ny(`Unknown command: ${A}`);
  let Y = eS(A, B);
  if (Y.type !== "prompt") throw Error(`Unexpected ${Y.type} command. Expected 'prompt' command. Use /${A} directly in the main conversation.`);
  return RP2(Y, Q, G, [], Z)
}

// READABLE (for understanding):
async function executeSkillFromTool(
  skillName,    // Name of skill to execute
  args,         // Arguments
  commands,     // Available commands list
  context,      // Execution context
  attachments = []
) {
  // Verify skill exists
  if (!commandExists(skillName, commands)) {
    throw new CommandNotFoundError(`Unknown command: ${skillName}`);
  }

  // Find skill
  const skill = findCommand(skillName, commands);

  // Must be prompt type
  if (skill.type !== "prompt") {
    throw Error(`Unexpected ${skill.type} command. Expected 'prompt' command. Use /${skillName} directly in the main conversation.`);
  }

  // Execute via standard prompt processing
  return processPromptSlashCommand(skill, args, context, [], attachments);
}

// Mapping: MP2→executeSkillFromTool, A→skillName, Q→args, B→commands,
//          G→context, Z→attachments
```

---

## Hook Registration

### registerSkillHooks (OD1)

Skills can define hooks that execute during tool use.

```javascript
// ============================================
// registerSkillHooks - Register hooks from skill
// Location: chunks.112.mjs:2340-2354 (Ln 327099)
// ============================================

// ORIGINAL (for source lookup):
function OD1(A, Q, B, G) {
  let Z = 0;
  for (let Y of _b) {
    let J = B[Y];
    if (!J) continue;
    for (let X of J)
      for (let I of X.hooks) {
        let D = I.once ? () => {
          k(`Removing one-shot hook for event ${Y} in skill '${G}'`), g32(A, Q, Y, I)
        } : void 0;
        pZ1(A, Q, Y, X.matcher || "", I, D), Z++
      }
  }
  if (Z > 0) k(`Registered ${Z} hooks from skill '${G}'`)
}

// READABLE (for understanding):
function registerSkillHooks(setAppState, hookId, hooksConfig, skillName) {
  let registeredCount = 0;

  // Iterate through hook event types
  for (const eventType of HOOK_EVENT_TYPES) {
    const eventHooks = hooksConfig[eventType];
    if (!eventHooks) continue;

    // Register each hook
    for (const hookGroup of eventHooks) {
      for (const hook of hookGroup.hooks) {
        // Create cleanup function for one-shot hooks
        const cleanup = hook.once
          ? () => {
              log(`Removing one-shot hook for event ${eventType} in skill '${skillName}'`);
              removeHook(setAppState, hookId, eventType, hook);
            }
          : undefined;

        // Register the hook
        registerHook(setAppState, hookId, eventType, hookGroup.matcher || "", hook, cleanup);
        registeredCount++;
      }
    }
  }

  if (registeredCount > 0) {
    log(`Registered ${registeredCount} hooks from skill '${skillName}'`);
  }
}

// Mapping: OD1→registerSkillHooks, A→setAppState, Q→hookId, B→hooksConfig,
//          G→skillName, _b→HOOK_EVENT_TYPES, pZ1→registerHook, g32→removeHook
```

**Hook types:**

| Event | Description |
|-------|-------------|
| `PreToolUse` | Before tool execution |
| `PostToolUse` | After tool execution |
| `Notification` | On notifications |

---

## Message Assembly

### Message Structure

The final message array includes:

```javascript
[
  // 1. Command metadata (visible in transcript)
  {
    type: "user",
    message: {
      content: "<command-name>/skill-name</command-name>..."
    }
  },

  // 2. Prompt content (isMeta: true, hidden from user)
  {
    type: "user",
    message: {
      content: [/* skill prompt content */]
    },
    isMeta: true
  },

  // 3. System reminders
  {
    type: "user",
    message: {
      content: "<system-reminder>...</system-reminder>"
    }
  },

  // 4. Permission message (tool access control)
  {
    type: "command_permissions",
    allowedTools: ["Read", "Grep", "..."],
    model: "sonnet"  // optional
  }
]
```

### formatSkillMetadata (ob5)

```javascript
// ============================================
// formatSkillMetadata - Format metadata for display
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
  // User-invocable commands: slash command format
  if (command.userInvocable !== false) {
    return formatSlashCommandMetadata(command.userFacingName(), args);
  }

  // Model-only skills: skill format with progress
  if (command.loadedFrom === "skills" || command.loadedFrom === "plugin") {
    return formatSkillFormat(command.userFacingName(), command.progressMessage);
  }

  // Default: slash command format
  return formatSlashCommandMetadata(command.userFacingName(), args);
}
```

---

## Return Value

### Execution Result

```typescript
interface ExecutionResult {
  messages: Message[];           // Messages to add to conversation
  shouldQuery: boolean;          // Whether to query LLM
  allowedTools?: string[];       // Tool access for this execution
  maxThinkingTokens?: number;    // Thinking token budget
  model?: string;                // Model override
  command: Command;              // The executed command
  resultText?: string;           // For fork execution
}
```

---

## Related Modules

- [architecture.md](./architecture.md) - Skill system architecture
- [loading.md](./loading.md) - Skill loading pipeline
- [09_slash_command/execution.md](../09_slash_command/execution.md) - Command execution
- [11_hook/execution.md](../11_hook/execution.md) - Hook execution
