# Real-Time Steering Mechanism (Claude Code 2.1.7)

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

## Overview

Claude Code implements multiple mechanisms to guide and steer the model's behavior during execution. These mechanisms inject context, reminders, and instructions at various points in the conversation without the user seeing them directly.

**Key insight:** Messages marked with `isMeta: true` are visible to the model but hidden from the user interface, allowing the system to guide model behavior without cluttering the user's view.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        Real-Time Steering Layers                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  Layer 1: System Reminder Injection                                      │ │
│  │  - <system-reminder> XML tags                                           │ │
│  │  - mI0 (extractSystemReminder), SG5 (filterSystemReminderMessages)      │ │
│  │  - User context (claudeMd, gitStatus)                                   │ │
│  └─────────────────────────────────┬───────────────────────────────────────┘ │
│                                    │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  Layer 2: isMeta Property (Hidden Messages)                              │ │
│  │  - Messages with isMeta: true                                           │ │
│  │  - Visible to model, hidden from user transcript                        │ │
│  │  - H0 (createMetaBlock), q5 (wrapInSystemReminder)                      │ │
│  └─────────────────────────────────┬───────────────────────────────────────┘ │
│                                    │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  Layer 3: Context Modifiers                                              │ │
│  │  - Tool-triggered context updates                                       │ │
│  │  - KM0 (serialExecutionContextFlow)                                     │ │
│  │  - Concurrent vs serial execution handling                              │ │
│  └─────────────────────────────────┬───────────────────────────────────────┘ │
│                                    │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  Layer 4: Append System Prompt (CLI)                                     │ │
│  │  - --append-system-prompt "<text>"                                      │ │
│  │  - --append-system-prompt-file "<path>"                                 │ │
│  └─────────────────────────────────┬───────────────────────────────────────┘ │
│                                    │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  Layer 5: Hook-Based Injection                                           │ │
│  │  - additionalContext from 5 hook events                                 │ │
│  │  - UserPromptSubmit, SessionStart, SubagentStart                        │ │
│  │  - PostToolUse, PostToolUseFailure                                      │ │
│  └─────────────────────────────────┬───────────────────────────────────────┘ │
│                                    │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  Layer 6: Plan Mode Steering                                             │ │
│  │  - z$7 (buildPlanModeSystemReminder) - router                           │ │
│  │  - $$7 (fullReminder), C$7 (sparseReminder), U$7 (subAgentReminder)     │ │
│  │  - Tool restrictions, read-only enforcement                             │ │
│  └─────────────────────────────────┬───────────────────────────────────────┘ │
│                                    │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  Layer 7: Permission Mode Context                                        │ │
│  │  - Modes: acceptEdits, bypassPermissions, default, dontAsk, plan        │ │
│  │  - Auto-allow in plan mode when bypass available                        │ │
│  └─────────────────────────────────┬───────────────────────────────────────┘ │
│                                    │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  Layer 8: readFileState Tracking                                         │ │
│  │  - VzA (buildReadFileStateMapping)                                      │ │
│  │  - File validation before Write/Edit                                    │ │
│  │  - MKA (mergeReadFileState)                                             │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. System Reminder Injection

The primary steering mechanism uses `<system-reminder>` XML tags to inject context that is visible to the model but processed specially.

### System Reminder Regex Pattern

```javascript
// ============================================
// SYSTEM_REMINDER_REGEX - Pattern for extracting system reminders
// Location: chunks.91.mjs:3581
// ============================================

// ORIGINAL (for source lookup):
PG5 = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/

// READABLE (for understanding):
const SYSTEM_REMINDER_REGEX = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/;

// Mapping: PG5→SYSTEM_REMINDER_REGEX
```

### System Reminder Extractor

```javascript
// ============================================
// extractSystemReminder - Extract content from system-reminder tags
// Location: chunks.91.mjs:3368-3371
// ============================================

// ORIGINAL (for source lookup):
function mI0(A) {
  let Q = A.trim().match(PG5);
  return Q && Q[1] ? Q[1].trim() : null
}

// READABLE (for understanding):
function extractSystemReminder(content) {
  // Match against system-reminder pattern
  let match = content.trim().match(SYSTEM_REMINDER_REGEX);
  // Return extracted inner content or null
  return match && match[1] ? match[1].trim() : null;
}

// Mapping: mI0→extractSystemReminder, A→content, Q→match, PG5→SYSTEM_REMINDER_REGEX
```

**What it does:** Extracts the inner text from `<system-reminder>` tags.

**Why this approach:** XML-like tags are easily parseable and clearly delineate system instructions from user content.

### System Reminder Filter

```javascript
// ============================================
// filterSystemReminderMessages - Separate system reminders from regular messages
// Location: chunks.91.mjs:3373-3403
// ============================================

// ORIGINAL (for source lookup):
function SG5(A) {
  let Q = [],
    B = [];
  for (let G of A) {
    let Z = G.message.content;
    if (typeof Z === "string") {
      let Y = mI0(Z);
      if (Y) B.push(Y);
      else Q.push(`[USER]\n${Z}`)
    } else if (Array.isArray(Z)) {
      for (let Y of Z)
        if (Y.type === "text") {
          let J = mI0(Y.text);
          if (J) B.push(J);
          else Q.push(`[USER]\n${Y.text}`)
        } else if (Y.type === "tool_result") {
        let J = typeof Y.content === "string" ? Y.content : eA(Y.content),
          X = mI0(J);
        if (X) B.push(X);
        else Q.push(`[TOOL RESULT: ${Y.tool_use_id}]\n${J}`)
      }
    }
  }
  return {
    contextParts: Q,
    systemReminders: B
  }
}

// READABLE (for understanding):
function filterSystemReminderMessages(messages) {
  let contextParts = [];       // Regular message content
  let systemReminders = [];    // Extracted system reminders

  for (let message of messages) {
    let content = message.message.content;

    if (typeof content === "string") {
      let extracted = extractSystemReminder(content);
      if (extracted) {
        systemReminders.push(extracted);
      } else {
        contextParts.push(`[USER]\n${content}`);
      }
    } else if (Array.isArray(content)) {
      for (let block of content) {
        if (block.type === "text") {
          let extracted = extractSystemReminder(block.text);
          if (extracted) {
            systemReminders.push(extracted);
          } else {
            contextParts.push(`[USER]\n${block.text}`);
          }
        } else if (block.type === "tool_result") {
          let toolContent = typeof block.content === "string"
            ? block.content
            : stringify(block.content);
          let extracted = extractSystemReminder(toolContent);
          if (extracted) {
            systemReminders.push(extracted);
          } else {
            contextParts.push(`[TOOL RESULT: ${block.tool_use_id}]\n${toolContent}`);
          }
        }
      }
    }
  }

  return {
    contextParts: contextParts,
    systemReminders: systemReminders
  };
}

// Mapping: SG5→filterSystemReminderMessages, A→messages, Q→contextParts, B→systemReminders
```

**What it does:** Separates messages into two categories:
1. `contextParts` - Regular user/tool messages for context
2. `systemReminders` - Extracted system instructions

**Why this approach:** Allows compact mode to preserve system reminders while summarizing regular content.

### User Context Injection

```javascript
// ============================================
// injectUserContext - Inject user context as system reminder
// Location: chunks.133.mjs:2585-2599
// ============================================

// ORIGINAL (for source lookup):
function _3A(A, Q) {
  if (Object.entries(Q).length === 0) return A;
  return [H0({
    content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(Q).map(([B,G])=>`# ${B}
${G}`).join(`
`)}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`,
    isMeta: !0
  }), ...A]
}

// READABLE (for understanding):
function injectUserContext(messages, userContext) {
  // Skip if no context to inject
  if (Object.entries(userContext).length === 0) {
    return messages;
  }

  // Build context sections from key-value pairs
  let contextSections = Object.entries(userContext)
    .map(([key, value]) => `# ${key}\n${value}`)
    .join('\n');

  // Create system reminder message
  let reminderMessage = createMetaBlock({
    content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${contextSections}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`,
    isMeta: true  // Marked as metadata, not shown to user
  });

  // Prepend to message stream
  return [reminderMessage, ...messages];
}

// Mapping: _3A→injectUserContext, A→messages, Q→userContext, H0→createMetaBlock
```

**What gets injected:**
- `claudeMd` - Contents of CLAUDE.md file
- `gitStatus` - Current git status output
- Other context fields as configured

---

## 2. isMeta Property (Hidden Messages)

Messages with `isMeta: true` are visible to the model but hidden from the user interface.

### Where isMeta is Set

| File | Line | Purpose |
|------|------|---------|
| chunks.147.mjs | 2467 | System context injection |
| chunks.147.mjs | 3328, 3336, 3349 | Plan mode reminders |
| chunks.133.mjs | 2597 | User context injection |
| chunks.134.mjs | 306, 438, 515, 2791 | Tool execution messages |
| chunks.148.mjs | 18-395 | Attachment conversions |

### System Reminder Wrapper

```javascript
// ============================================
// wrapSystemReminderText - Wrap text in system-reminder tags
// Location: chunks.147.mjs:3212-3216
// ============================================

// ORIGINAL (for source lookup):
function Yh(A) {
  return `<system-reminder>
${A}
</system-reminder>`
}

// READABLE (for understanding):
function wrapSystemReminderText(content) {
  return `<system-reminder>
${content}
</system-reminder>`;
}

// Mapping: Yh→wrapSystemReminderText, A→content
```

### Wrap Messages with System Reminder

```javascript
// ============================================
// wrapInSystemReminder - Wrap all message content in system-reminder tags
// Location: chunks.147.mjs:3218-3245
// ============================================

// ORIGINAL (for source lookup):
function q5(A) {
  return A.map((Q) => {
    if (typeof Q.message.content === "string") return {
      ...Q,
      message: {
        ...Q.message,
        content: Yh(Q.message.content)
      }
    };
    else if (Array.isArray(Q.message.content)) {
      let B = Q.message.content.map((G) => {
        if (G.type === "text") return {
          ...G,
          text: Yh(G.text)
        };
        return G
      });
      return {
        ...Q,
        message: {
          ...Q.message,
          content: B
        }
      }
    }
    return Q
  })
}

// READABLE (for understanding):
function wrapInSystemReminder(messages) {
  return messages.map((msg) => {
    // Handle string content
    if (typeof msg.message.content === "string") {
      return {
        ...msg,
        message: {
          ...msg.message,
          content: wrapSystemReminderText(msg.message.content)
        }
      };
    }
    // Handle array content (multimodal)
    else if (Array.isArray(msg.message.content)) {
      let wrappedContent = msg.message.content.map((block) => {
        if (block.type === "text") {
          return {
            ...block,
            text: wrapSystemReminderText(block.text)
          };
        }
        return block;  // Leave non-text blocks unchanged
      });
      return {
        ...msg,
        message: {
          ...msg.message,
          content: wrappedContent
        }
      };
    }
    return msg;
  });
}

// Mapping: q5→wrapInSystemReminder, Yh→wrapSystemReminderText
```

**Why this approach:** Ensures all injected content is properly tagged for extraction and filtering.

---

## 3. Context Modifiers

Context modifiers allow tools to update the execution context in real-time during streaming.

### Context Modifier Flow (Concurrent Execution)

```javascript
// ============================================
// serialExecutionContextFlow - Execute tools with context modifier collection
// Location: chunks.134.mjs:571-610
// ============================================

// ORIGINAL (for source lookup):
async function* KM0(A, Q, B, G) {
  let Z = G;
  for (let {
      isConcurrencySafe: Y,
      blocks: J
    }
    of S77(A, Z))
    if (Y) {
      let X = {};
      for await (let I of y77(J, Q, B, Z)) {
        if (I.contextModifier) {
          let {
            toolUseID: D,
            modifyContext: W
          } = I.contextModifier;
          if (!X[D]) X[D] = [];
          X[D].push(W)
        }
        yield {
          message: I.message,
          newContext: Z
        }
      }
      for (let I of J) {
        let D = X[I.id];
        if (!D) continue;
        for (let W of D) Z = W(Z)
      }
      yield {
        newContext: Z
      }
    } else
      for await (let X of x77(J, Q, B, Z)) {
        if (X.newContext) Z = X.newContext;
        yield {
          message: X.message,
          newContext: Z
        }
      }
}

// READABLE (for understanding):
async function* serialExecutionContextFlow(toolUses, assistantMessages, canUseTool, initialContext) {
  let currentContext = initialContext;

  // Group tools by concurrency safety
  for (let { isConcurrencySafe, blocks: toolBlock } of groupByConcurrencySafety(toolUses, currentContext)) {

    if (isConcurrencySafe) {
      // CONCURRENT EXECUTION: collect all context modifiers first
      let contextModifiersByToolId = {};

      // Execute tools concurrently, collect their modifiers
      for await (let toolResult of executeConcurrentTools(toolBlock, assistantMessages, canUseTool, currentContext)) {
        if (toolResult.contextModifier) {
          let { toolUseID, modifyContext } = toolResult.contextModifier;
          if (!contextModifiersByToolId[toolUseID]) {
            contextModifiersByToolId[toolUseID] = [];
          }
          contextModifiersByToolId[toolUseID].push(modifyContext);
        }
        yield { message: toolResult.message, newContext: currentContext };
      }

      // Apply all context modifiers AFTER concurrent execution completes
      for (let tool of toolBlock) {
        let modifiers = contextModifiersByToolId[tool.id];
        if (!modifiers) continue;
        for (let modifierFn of modifiers) {
          currentContext = modifierFn(currentContext);  // Apply modifier
        }
      }

      yield { newContext: currentContext };

    } else {
      // SERIAL EXECUTION: apply context updates immediately
      for await (let toolResult of executeSerialTools(toolBlock, assistantMessages, canUseTool, currentContext)) {
        if (toolResult.newContext) {
          currentContext = toolResult.newContext;
        }
        yield { message: toolResult.message, newContext: currentContext };
      }
    }
  }
}

// Mapping: KM0→serialExecutionContextFlow, A→toolUses, Q→assistantMessages, B→canUseTool,
//          G→initialContext, Z→currentContext, Y→isConcurrencySafe, J→toolBlock,
//          X→contextModifiersByToolId, S77→groupByConcurrencySafety,
//          y77→executeConcurrentTools, x77→executeSerialTools
```

**How it works:**

1. **Tool Grouping (S77)**: Tools are grouped by whether they're concurrency-safe
2. **Concurrent Block**: Multiple tools execute in parallel, modifiers collected into map
3. **Deferred Application**: After concurrent tools complete, modifiers applied sequentially
4. **Serial Block**: Tools execute one at a time, context updates applied immediately

**Why this approach:**
- Prevents race conditions on context during parallel tool execution
- Allows atomic context updates after batch completes
- Maintains order of modifier application

### Tool Result with Context Modifier

```javascript
// ============================================
// Tool result structure with contextModifier
// Location: chunks.134.mjs:1039-1042
// ============================================

// ORIGINAL (for source lookup):
contextModifier: n ? {
  toolUseID: Q,
  modifyContext: n
} : void 0

// READABLE (for understanding):
// Tool results can include a contextModifier object:
{
  message: toolResultMessage,
  contextModifier: hasModifier ? {
    toolUseID: toolUseId,
    modifyContext: contextModifierFunction  // (context) => newContext
  } : undefined
}

// Mapping: n→contextModifierFunction, Q→toolUseId
```

---

## 4. Append System Prompt (CLI)

The CLI supports injecting additional system prompts via flags.

### CLI Flag Processing

```javascript
// ============================================
// appendSystemPrompt CLI processing
// Location: chunks.157.mjs:103-116
// ============================================

// ORIGINAL (for source lookup):
let xA = I.appendSystemPrompt;
if (I.appendSystemPromptFile) {
  if (I.appendSystemPrompt) process.stderr.write(I1.red(`Error: Cannot use both --append-system-prompt and --append-system-prompt-file. Please use only one.
`)), process.exit(1);
  try {
    let PQ = Ny0(I.appendSystemPromptFile);
    if (!XU1(PQ)) process.stderr.write(I1.red(`Error: Append system prompt file not found: ${PQ}
`)), process.exit(1);
    xA = HL9(PQ, "utf8")
  } catch (PQ) {
    process.stderr.write(I1.red(`Error reading append system prompt file: ${PQ instanceof Error?PQ.message:String(PQ)}
`)), process.exit(1)
  }
}

// READABLE (for understanding):
let appendedPrompt = options.appendSystemPrompt;

if (options.appendSystemPromptFile) {
  // Mutual exclusion check
  if (options.appendSystemPrompt) {
    process.stderr.write(chalk.red(`Error: Cannot use both --append-system-prompt and --append-system-prompt-file.`));
    process.exit(1);
  }

  try {
    let filePath = resolvePath(options.appendSystemPromptFile);

    if (!fileExists(filePath)) {
      process.stderr.write(chalk.red(`Error: Append system prompt file not found: ${filePath}`));
      process.exit(1);
    }

    appendedPrompt = readFileSync(filePath, "utf8");
  } catch (error) {
    process.stderr.write(chalk.red(`Error reading append system prompt file: ${error.message}`));
    process.exit(1);
  }
}

// Mapping: xA→appendedPrompt, I→options, PQ→filePath, I1→chalk, Ny0→resolvePath,
//          XU1→fileExists, HL9→readFileSync
```

### CLI Flags

| Flag | Purpose |
|------|---------|
| `--append-system-prompt "<text>"` | Inline text appended to system prompt |
| `--append-system-prompt-file "<path>"` | File content appended to system prompt |

**Key constraint:** Mutually exclusive - cannot use both flags simultaneously.

---

## 5. Hook-Based Injection

Hooks can inject additional context at various points in the execution lifecycle.

### Hook additionalContext Handling

```javascript
// ============================================
// Hook additionalContext extraction by event type
// Location: chunks.120.mjs:1276-1290
// ============================================

// ORIGINAL (for source lookup):
case "UserPromptSubmit":
  D.additionalContext = A.hookSpecificOutput.additionalContext;
  break;
case "SessionStart":
  D.additionalContext = A.hookSpecificOutput.additionalContext;
  break;
case "SubagentStart":
  D.additionalContext = A.hookSpecificOutput.additionalContext;
  break;
case "PostToolUse":
  if (D.additionalContext = A.hookSpecificOutput.additionalContext, A.hookSpecificOutput.updatedMCPToolOutput) D.updatedMCPToolOutput = A.hookSpecificOutput.updatedMCPToolOutput;
  break;
case "PostToolUseFailure":
  D.additionalContext = A.hookSpecificOutput.additionalContext;
  break;

// READABLE (for understanding):
switch (hookEvent) {
  case "UserPromptSubmit":
    output.additionalContext = hookResult.additionalContext;
    break;
  case "SessionStart":
    output.additionalContext = hookResult.additionalContext;
    break;
  case "SubagentStart":
    output.additionalContext = hookResult.additionalContext;
    break;
  case "PostToolUse":
    output.additionalContext = hookResult.additionalContext;
    // PostToolUse can also update MCP tool output
    if (hookResult.updatedMCPToolOutput) {
      output.updatedMCPToolOutput = hookResult.updatedMCPToolOutput;
    }
    break;
  case "PostToolUseFailure":
    output.additionalContext = hookResult.additionalContext;
    break;
}

// Mapping: D→output, A.hookSpecificOutput→hookResult
```

### Hook Events Supporting additionalContext

| Event | When Triggered | Use Case |
|-------|----------------|----------|
| `UserPromptSubmit` | After user sends message | Inject context based on user input |
| `SessionStart` | At session initialization | Inject startup instructions |
| `SubagentStart` | When spawning subagent | Inject agent-specific context |
| `PostToolUse` | After tool execution | Inject based on tool results |
| `PostToolUseFailure` | After tool failure | Inject error context/guidance |

**Cross-reference:** See [11_hook/](../11_hook/) for hook system details.

---

## 6. Plan Mode Steering

Plan mode injects specialized instructions that constrain the model to read-only operations.

### Plan Mode Reminder Router

```javascript
// ============================================
// buildPlanModeSystemReminder - Route to appropriate reminder type
// Location: chunks.147.mjs:3247-3251
// ============================================

// ORIGINAL (for source lookup):
function z$7(A) {
  if (A.isSubAgent) return U$7(A);
  if (A.reminderType === "sparse") return C$7(A);
  return $$7(A)
}

// READABLE (for understanding):
function buildPlanModeSystemReminder(attachmentData) {
  // Subagents get read-only focused instructions
  if (attachmentData.isSubAgent) {
    return buildSubAgentPlanReminder(attachmentData);
  }

  // Subsequent turns get abbreviated reminder
  if (attachmentData.reminderType === "sparse") {
    return buildSparsePlanReminder(attachmentData);
  }

  // First turn gets full 5-phase workflow
  return buildFullPlanReminder(attachmentData);
}

// Mapping: z$7→buildPlanModeSystemReminder, A→attachmentData,
//          U$7→buildSubAgentPlanReminder, C$7→buildSparsePlanReminder, $$7→buildFullPlanReminder
```

### Three Reminder Types

| Type | Function | When Used |
|------|----------|-----------|
| **Full** | `$$7` (buildFullPlanReminder) | First turn in plan mode |
| **Sparse** | `C$7` (buildSparsePlanReminder) | Subsequent turns |
| **SubAgent** | `U$7` (buildSubAgentPlanReminder) | For Plan/Explore agents |

### Full Plan Mode Reminder (First Turn)

```javascript
// ============================================
// buildFullPlanReminder - Complete 5-phase workflow instructions
// Location: chunks.147.mjs:3253-3330
// ============================================

// Key excerpt from full reminder:
let fullReminder = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
${planExists
  ? `A plan file already exists at ${planFilePath}. You can read it and make incremental edits using the Edit tool.`
  : `No plan file exists yet. You should create your plan at ${planFilePath} using the Write tool.`}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.

## Plan Workflow

### Phase 1: Initial Understanding
Launch up to ${maxExploreAgents} Explore agents IN PARALLEL...

### Phase 2: Design
Launch Plan agent(s) to design the implementation...

### Phase 3: Review
Review the plan(s) and ensure alignment...

### Phase 4: Final Plan
Write your final plan to the plan file...

### Phase 5: Call ExitPlanMode
At the very end of your turn, call ExitPlanMode to indicate you are done planning.`;
```

**Key steering constraint:** "This supercedes any other instructions you have received" - explicit override.

### Sparse Plan Mode Reminder (Subsequent Turns)

```javascript
// ============================================
// buildSparsePlanReminder - Abbreviated reminder for ongoing plan mode
// Location: chunks.147.mjs:3332-3338
// ============================================

// ORIGINAL (for source lookup):
function C$7(A) {
  let Q = `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${A.planFilePath}). Follow 5-phase workflow. End turns with ${zY} (for clarifications) or ${V$.name} (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;
  return q5([H0({
    content: Q,
    isMeta: !0
  })])
}

// READABLE (for understanding):
function buildSparsePlanReminder(attachmentData) {
  let sparseContent = `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${attachmentData.planFilePath}). Follow 5-phase workflow. End turns with AskUserQuestion (for clarifications) or ExitPlanMode (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;

  return wrapInSystemReminder([createMetaBlock({
    content: sparseContent,
    isMeta: true
  })]);
}

// Mapping: C$7→buildSparsePlanReminder, zY→AskUserQuestion, V$→ExitPlanMode
```

**Why sparse reminders:** Reduces token usage on subsequent turns while maintaining key constraints.

### SubAgent Plan Mode Reminder

```javascript
// ============================================
// buildSubAgentPlanReminder - Read-only instructions for subagents
// Location: chunks.147.mjs:3340-3351
// ============================================

// ORIGINAL (for source lookup):
function U$7(A) {
  let B = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received (for example, to make edits). Instead, you should:

## Plan File Info:
${A.planExists?`A plan file already exists at ${A.planFilePath}. You can read it and make incremental edits using the ${J$.name} tool if you need to.`:`No plan file exists yet. You should create your plan at ${A.planFilePath} using the ${X$.name} tool if you need to.`}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.
Answer the user's query comprehensively, using the ${zY} tool if you need to ask the user clarifying questions.`;
  return q5([H0({
    content: B,
    isMeta: !0
  })])
}

// READABLE (for understanding):
function buildSubAgentPlanReminder(attachmentData) {
  let subAgentContent = `Plan mode is active. You MUST NOT make any edits, run any non-readonly tools... This supercedes any other instructions you have received.

## Plan File Info:
${attachmentData.planExists
  ? `A plan file exists at ${attachmentData.planFilePath}.`
  : `No plan file exists. Create at ${attachmentData.planFilePath}.`}

NOTE: This is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.`;

  return wrapInSystemReminder([createMetaBlock({
    content: subAgentContent,
    isMeta: true
  })]);
}

// Mapping: U$7→buildSubAgentPlanReminder, J$→Edit, X$→Write, zY→AskUserQuestion
```

**Cross-reference:** See [12_plan_mode/](../12_plan_mode/) for complete plan mode analysis.

---

## 7. Permission Mode Context

The permission mode affects how the model approaches tool usage.

### Permission Decision Handler

```javascript
// ============================================
// handleToolPermissionDecision - Auto-allow in plan mode
// Location: chunks.147.mjs:1574-1581
// ============================================

// ORIGINAL (for source lookup):
if (Z = await B.getAppState(), Z.toolPermissionContext.mode === "bypassPermissions" || Z.toolPermissionContext.mode === "plan" && Z.toolPermissionContext.isBypassPermissionsModeAvailable) return {
  behavior: "allow",
  updatedInput: Q,
  decisionReason: {
    type: "mode",
    mode: Z.toolPermissionContext.mode
  }
};

// READABLE (for understanding):
let appState = await getAppState();

// Auto-allow in bypass or plan mode (when bypass available)
if (appState.toolPermissionContext.mode === "bypassPermissions" ||
    (appState.toolPermissionContext.mode === "plan" &&
     appState.toolPermissionContext.isBypassPermissionsModeAvailable)) {
  return {
    behavior: "allow",
    updatedInput: input,
    decisionReason: {
      type: "mode",
      mode: appState.toolPermissionContext.mode
    }
  };
}

// Mapping: Z→appState, Q→input, B.getAppState→getAppState
```

### Valid Permission Modes

| Mode | Description |
|------|-------------|
| `acceptEdits` | Auto-accept edit operations |
| `bypassPermissions` | Bypass all permission checks |
| `default` | Standard interactive permission flow |
| `dontAsk` | Don't ask for permissions (deny silently) |
| `plan` | Plan mode (read-only steering) |

**Key insight:** In plan mode with bypass available, read-only tools are auto-allowed for efficient codebase exploration.

---

## 8. readFileState Tracking

Tracks file content state for validation before Write/Edit operations.

### Build File State Mapping

```javascript
// ============================================
// buildReadFileStateMapping - Map read files to steering context
// Location: chunks.135.mjs:519-576
// ============================================

// ORIGINAL (for source lookup):
function VzA(A, Q, B = BG7) {
  let G = Id(B),
    Z = new Map,
    Y = new Map;
  for (let J of A)
    if (J.type === "assistant" && Array.isArray(J.message.content)) {
      for (let X of J.message.content)
        if (X.type === "tool_use" && X.name === z3) {
          let I = X.input;
          if (I?.file_path && I?.offset === void 0 && I?.limit === void 0) {
            let D = Y4(I.file_path, Q);
            Z.set(X.id, D)
          }
        } else if (X.type === "tool_use" && X.name === BY) {
        let I = X.input;
        if (I?.file_path && I?.content) {
          let D = Y4(I.file_path, Q);
          Y.set(X.id, {
            filePath: D,
            content: I.content
          })
        }
      }
    } for (let J of A)
    if (J.type === "user" && Array.isArray(J.message.content)) {
      for (let X of J.message.content)
        if (X.type === "tool_result" && X.tool_use_id) {
          let I = Z.get(X.tool_use_id);
          if (I && typeof X.content === "string") {
            let V = X.content.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "").split(`
`).map((F) => {
              let H = F.match(/^\s*\d+→(.*)$/);
              return H ? H[1] : F
            }).join(`
`).trim();
            if (J.timestamp) {
              let F = new Date(J.timestamp).getTime();
              G.set(I, {
                content: V,
                timestamp: F,
                offset: void 0,
                limit: void 0
              })
            }
          }
          let D = Y.get(X.tool_use_id);
          if (D && J.timestamp) {
            let W = new Date(J.timestamp).getTime();
            G.set(D.filePath, {
              content: D.content,
              timestamp: W,
              offset: void 0,
              limit: void 0
            })
          }
        }
    } return G
}

// READABLE (for understanding):
function buildReadFileStateMapping(messages, cwd, maxCacheSize = 10) {
  let fileStateCache = createLRUCache(maxCacheSize);
  let readToolUseMap = new Map();   // Maps Read tool use IDs to file paths
  let writeToolUseMap = new Map();  // Maps Write tool use IDs to (filePath, content)

  // PASS 1: Collect all Read and Write tool uses from assistant messages
  for (let message of messages) {
    if (message.type === "assistant" && Array.isArray(message.message.content)) {
      for (let content of message.message.content) {
        // Collect Read tool uses (full file reads only, no offset/limit)
        if (content.type === "tool_use" && content.name === "Read") {
          let input = content.input;
          if (input?.file_path && input?.offset === undefined && input?.limit === undefined) {
            let absolutePath = resolvePath(input.file_path, cwd);
            readToolUseMap.set(content.id, absolutePath);
          }
        }
        // Collect Write tool uses
        else if (content.type === "tool_use" && content.name === "Write") {
          let input = content.input;
          if (input?.file_path && input?.content) {
            let absolutePath = resolvePath(input.file_path, cwd);
            writeToolUseMap.set(content.id, { filePath: absolutePath, content: input.content });
          }
        }
      }
    }
  }

  // PASS 2: Match tool results with tool uses from user messages
  for (let message of messages) {
    if (message.type === "user" && Array.isArray(message.message.content)) {
      for (let content of message.message.content) {
        if (content.type === "tool_result" && content.tool_use_id) {
          // Handle Read tool results
          let readFilePath = readToolUseMap.get(content.tool_use_id);
          if (readFilePath && typeof content.content === "string") {
            // Clean content: remove system reminders and line number prefixes
            let cleanedContent = content.content
              .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
              .split('\n')
              .map((line) => {
                let match = line.match(/^\s*\d+→(.*)$/);  // Remove "123→" prefix
                return match ? match[1] : line;
              })
              .join('\n')
              .trim();

            if (message.timestamp) {
              let timestamp = new Date(message.timestamp).getTime();
              fileStateCache.set(readFilePath, {
                content: cleanedContent,
                timestamp: timestamp,
                offset: undefined,
                limit: undefined
              });
            }
          }

          // Handle Write tool results
          let writeData = writeToolUseMap.get(content.tool_use_id);
          if (writeData && message.timestamp) {
            let timestamp = new Date(message.timestamp).getTime();
            fileStateCache.set(writeData.filePath, {
              content: writeData.content,
              timestamp: timestamp,
              offset: undefined,
              limit: undefined
            });
          }
        }
      }
    }
  }

  return fileStateCache;
}

// Mapping: VzA→buildReadFileStateMapping, A→messages, Q→cwd, B→maxCacheSize,
//          G→fileStateCache, Z→readToolUseMap, Y→writeToolUseMap, z3→"Read", BY→"Write"
```

**How it works:**

1. **Two-pass algorithm:**
   - Pass 1: Extract Read/Write tool uses from assistant messages
   - Pass 2: Match tool results and populate file state cache

2. **Content cleaning:** Removes system reminders and line number prefixes

3. **Timestamp tracking:** Records when each file was last read/written

### Merge File State

```javascript
// ============================================
// mergeReadFileState - Merge new file state with previous
// Location: chunks.86.mjs:851-858
// ============================================

// ORIGINAL (for source lookup):
function MKA(A, Q) {
  let B = m9A(A);
  for (let [G, Z] of Q.entries()) {
    let Y = B.get(G);
    if (!Y || Z.timestamp > Y.timestamp) B.set(G, Z)
  }
  return B
}

// READABLE (for understanding):
function mergeReadFileState(newFileState, previousFileState) {
  let mergedState = cloneMap(newFileState);

  // Merge with previous state, keeping newer timestamps
  for (let [filePath, fileData] of previousFileState.entries()) {
    let existingData = mergedState.get(filePath);

    // Keep data with newer timestamp
    if (!existingData || fileData.timestamp > existingData.timestamp) {
      mergedState.set(filePath, fileData);
    }
  }

  return mergedState;
}

// Mapping: MKA→mergeReadFileState, A→newFileState, Q→previousFileState, m9A→cloneMap
```

**Why merge:** Handles SDK mode where messages are re-processed, ensuring latest state is preserved.

**Cross-reference:** See [05_tools/](../05_tools/) for tool integration details.

---

## Steering Flow Diagram

```
User Message Submitted
         │
         ▼
┌─────────────────────────────────────┐
│  1. Hook: UserPromptSubmit          │
│  → additionalContext injection      │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  2. Load User Context               │
│  (claudeMd, gitStatus, etc.)        │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  3. Inject System Reminders (_3A)   │
│  <system-reminder>...</system-reminder>
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  4. Plan Mode Steering (z$7)        │
│  - Full/Sparse/SubAgent reminders   │
│  - Read-only constraints            │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  5. Combine System Prompt           │
│  Base + Append + Context            │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  6. Permission Mode Check           │
│  (bypass/plan mode auto-allow)      │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  7. Send to API                     │
│  (Model receives steered context)   │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  8. Tool Execution (KM0)            │
│  - Context modifiers collected      │
│  - Applied after batch completion   │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  9. Hook: PostToolUse               │
│  → additionalContext injection      │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  10. readFileState Update (VzA)     │
│  → File content tracking            │
└─────────────────────────────────────┘
```

---

## Key Functions Summary

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| **System Reminder Core** | | | |
| extractSystemReminder | mI0 | chunks.91.mjs:3368-3371 | Extract content from system-reminder tags |
| filterSystemReminderMessages | SG5 | chunks.91.mjs:3373-3403 | Separate reminders from regular messages |
| SYSTEM_REMINDER_REGEX | PG5 | chunks.91.mjs:3581 | Regex pattern for system-reminder tags |
| wrapSystemReminderText | Yh | chunks.147.mjs:3212-3216 | Wrap text in system-reminder tags |
| wrapInSystemReminder | q5 | chunks.147.mjs:3218-3245 | Wrap message content in reminders |
| createMetaBlock | H0 | chunks.147.mjs:2410-2440 | Create message with isMeta: true |
| **Context Injection** | | | |
| injectUserContext | _3A | chunks.133.mjs:2585-2599 | Inject user context as system reminder |
| combineSystemContext | fA9 | chunks.133.mjs:2580-2583 | Combine system context entries |
| **Context Modifiers** | | | |
| serialExecutionContextFlow | KM0 | chunks.134.mjs:571-610 | Execute tools with context modifiers |
| groupByConcurrencySafety | S77 | chunks.134.mjs:612-624 | Group tools by concurrency |
| executeSerialTools | x77 | chunks.134.mjs:626-639 | Serial tool execution |
| **Plan Mode Steering** | | | |
| buildPlanModeSystemReminder | z$7 | chunks.147.mjs:3247-3251 | Route to plan mode reminder type |
| buildFullPlanReminder | $$7 | chunks.147.mjs:3253-3330 | Full 5-phase plan instructions |
| buildSparsePlanReminder | C$7 | chunks.147.mjs:3332-3338 | Abbreviated plan reminder |
| buildSubAgentPlanReminder | U$7 | chunks.147.mjs:3340-3351 | Read-only subagent instructions |
| **File State Tracking** | | | |
| buildReadFileStateMapping | VzA | chunks.135.mjs:519-576 | Build file state from messages |
| mergeReadFileState | MKA | chunks.86.mjs:851-858 | Merge file state by timestamp |
| **Attachment Pipeline** | | | |
| generateAllAttachments | O27 | chunks.131.mjs:3121-3138 | Generate all steering attachments |
| convertAttachmentToSystemMessage | q$7 | chunks.148.mjs:3-371 | Convert attachment to isMeta message |
| wrapWithErrorHandling | fJ | chunks.131.mjs:3140-3163 | Wrap attachment generator with error handling |

---

## Steering vs User-Visible Messages

| Aspect | User-Visible | Steering (Hidden) |
|--------|--------------|-------------------|
| Display | Shown in UI | Hidden from user |
| Purpose | User communication | Model guidance |
| `isMeta` flag | `false` | `true` |
| Examples | User input, assistant output | System reminders, context injection |

---

## 9. Attachment System (Core Steering Pipeline)

The attachment system is the **core steering pipeline** that generates and converts context into system reminders.

### Attachment Generation Pipeline

```javascript
// ============================================
// generateAllAttachments - Main attachment generation function
// Location: chunks.131.mjs:3121-3138
// ============================================

// ORIGINAL (for source lookup):
async function O27(A, Q, B, G, Z, Y) {
  if (a1(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS)) return [];
  let J = c9();
  setTimeout(() => { J.abort() }, 1000);
  let X = { ...Q, abortController: J },
    I = !Q.agentId,
    D = A ? [fJ("at_mentioned_files", () => h27(A, X)),
             fJ("mcp_resources", () => u27(A, X)),
             fJ("agent_mentions", () => Promise.resolve(g27(A, Q.options.agentDefinitions.activeAgents)))] : [],
    W = await Promise.all(D),
    K = [fJ("changed_files", () => m27(X)),
         fJ("nested_memory", () => d27(X)),
         fJ("ultra_claude_md", async () => v27(Z)),
         fJ("plan_mode", () => j27(Z, Q)),
         fJ("plan_mode_exit", () => T27(Q)),
         fJ("delegate_mode", () => P27(Q)),
         fJ("delegate_mode_exit", () => Promise.resolve(S27())),
         fJ("todo_reminders", () => t27(Z, Q)),
         fJ("collab_notification", async () => B97()),
         fJ("critical_system_reminder", () => Promise.resolve(x27(Q)))],
    V = I ? [fJ("ide_selection", async () => k27(B, Q)),
             fJ("ide_opened_file", async () => f27(B, Q)),
             fJ("output_style", async () => Promise.resolve(y27())),
             fJ("queued_commands", async () => M27(G)),
             fJ("diagnostics", async () => o27()),
             fJ("lsp_diagnostics", async () => r27()),
             fJ("unified_tasks", async () => A97(Q, Z)),
             fJ("async_hook_responses", async () => Q97()),
             fJ("memory", async () => mr2(Q, Z, Y)),
             fJ("token_usage", async () => Promise.resolve(G97(Z ?? []))),
             fJ("budget_usd", async () => Promise.resolve(Z97(Q.options.maxBudgetUsd))),
             fJ("verify_plan_reminder", async () => J97(Z, Q))] : [],
    [F, H] = await Promise.all([Promise.all(K), Promise.all(V)]);
  return [...W.flat(), ...F.flat(), ...H.flat()]
}

// READABLE (for understanding):
async function generateAllAttachments(userPrompt, toolUseContext, ideClient, queuedCommands, messages, additionalContext) {
  if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS)) return [];

  let abortController = createAbortController();
  setTimeout(() => abortController.abort(), 1000);  // 1s timeout

  let context = { ...toolUseContext, abortController };
  let isMainAgent = !toolUseContext.agentId;

  // User prompt attachments (only if prompt provided)
  let userPromptAttachments = userPrompt ? [
    wrap("at_mentioned_files", () => generateAtMentionedFilesAttachment(userPrompt, context)),
    wrap("mcp_resources", () => generateMcpResourcesAttachment(userPrompt, context)),
    wrap("agent_mentions", () => generateAgentMentionsAttachment(userPrompt, context))
  ] : [];

  // Core attachments (always generated)
  let coreAttachments = [
    wrap("changed_files", () => generateChangedFilesAttachment(context)),
    wrap("nested_memory", () => generateNestedMemoryAttachment(context)),
    wrap("ultra_claude_md", () => generateClaudeMdAttachment(messages)),
    wrap("plan_mode", () => generatePlanModeAttachment(messages, toolUseContext)),
    wrap("plan_mode_exit", () => generatePlanModeExitAttachment(toolUseContext)),
    wrap("delegate_mode", () => generateDelegateModeAttachment(toolUseContext)),
    wrap("delegate_mode_exit", () => generateDelegateModeExitAttachment()),
    wrap("todo_reminders", () => generateTodoRemindersAttachment(messages, toolUseContext)),
    wrap("collab_notification", () => generateCollabNotificationAttachment()),
    wrap("critical_system_reminder", () => generateCriticalSystemReminderAttachment(toolUseContext))
  ];

  // Main-agent-only attachments
  let mainAgentAttachments = isMainAgent ? [
    wrap("ide_selection", () => generateIdeSelectionAttachment(ideClient, toolUseContext)),
    wrap("ide_opened_file", () => generateIdeOpenedFileAttachment(ideClient, toolUseContext)),
    wrap("output_style", () => generateOutputStyleAttachment()),
    wrap("queued_commands", () => generateQueuedCommandsAttachment(queuedCommands)),
    wrap("diagnostics", () => generateDiagnosticsAttachment()),
    wrap("lsp_diagnostics", () => generateLspDiagnosticsAttachment()),
    wrap("unified_tasks", () => generateUnifiedTasksAttachment(toolUseContext, messages)),
    wrap("async_hook_responses", () => generateAsyncHookResponsesAttachment()),
    wrap("memory", () => generateMemoryAttachment(toolUseContext, messages, additionalContext)),
    wrap("token_usage", () => generateTokenUsageAttachment(messages)),
    wrap("budget_usd", () => generateBudgetUsdAttachment(toolUseContext.options.maxBudgetUsd)),
    wrap("verify_plan_reminder", () => generateVerifyPlanReminderAttachment(messages, toolUseContext))
  ] : [];

  let [core, mainOnly] = await Promise.all([
    Promise.all(coreAttachments),
    Promise.all(mainAgentAttachments)
  ]);

  return [...userPromptAttachments.flat(), ...core.flat(), ...mainOnly.flat()];
}

// Mapping: O27→generateAllAttachments, fJ→wrap, h27→generateAtMentionedFilesAttachment,
//          u27→generateMcpResourcesAttachment, g27→generateAgentMentionsAttachment, etc.
```

### Attachment Type Conversion

The `q$7` function converts attachments to system messages with `isMeta: true`.

```javascript
// ============================================
// convertAttachmentToSystemMessage - Convert attachment to hidden message
// Location: chunks.148.mjs:3-371
// ============================================

// ORIGINAL (for source lookup):
function q$7(A) {
  switch (A.type) {
    case "directory":
      return q5([MuA(o2.name, { command: `ls ${m6([A.path])}`, description: `Lists files in ${A.path}` }),
                 OuA(o2, { stdout: A.content, stderr: "", interrupted: !1 })]);
    case "edited_text_file":
      return q5([H0({
        content: `Note: ${A.filename} was modified...`,
        isMeta: !0
      })]);
    // ... 36+ more cases
  }
}

// READABLE (for understanding):
function convertAttachmentToSystemMessage(attachment) {
  switch (attachment.type) {
    case "directory":
      // Convert to Bash tool use/result pair
      return wrapInSystemReminder([...]);

    case "edited_text_file":
      return wrapInSystemReminder([createMetaBlock({
        content: `Note: ${attachment.filename} was modified...`,
        isMeta: true
      })]);

    case "plan_mode":
      return buildPlanModeSystemReminder(attachment);  // Delegates to z$7

    // ... etc
  }
}

// Mapping: q$7→convertAttachmentToSystemMessage
```

### Complete Attachment Type Reference

| Attachment Type | Purpose | Steering Content |
|-----------------|---------|------------------|
| **File & Directory** | | |
| `directory` | Directory listing | Converts to Bash tool use/result |
| `file` | File content (text/image/notebook/pdf) | Converts to Read tool use/result |
| `edited_text_file` | File modification notification | "Note: {filename} was modified..." |
| `compact_file_reference` | Summarized file reference | "File too large, use Read tool" |
| **IDE Integration** | | |
| `selected_lines_in_ide` | IDE selection context | "User selected lines X-Y from {file}" |
| `opened_file_in_ide` | IDE opened file | "User opened {file} in IDE" |
| **Todo & Tasks** | | |
| `todo` | Todo list state | Current todo list content |
| `todo_reminder` | Todo list reminder | "Consider using TodoWrite tool" |
| `task_status` | Background task status | Task ID, type, status, description |
| `task_progress` | Task progress update | Progress message |
| **Plan Mode** | | |
| `plan_mode` | Plan mode steering | Full/Sparse/SubAgent reminders |
| `plan_mode_reentry` | Re-entering plan mode | "You are returning to plan mode..." |
| `plan_mode_exit` | Exited plan mode | "You can now make edits..." |
| `plan_file_reference` | Plan file content | Plan file path and contents |
| `verify_plan_reminder` | Plan verification | "Please verify plan items completed" |
| **Delegate Mode** | | |
| `delegate_mode` | Delegate mode active | (empty - handled elsewhere) |
| `delegate_mode_exit` | Exited delegate mode | "You can now use all tools..." |
| **Memory & Context** | | |
| `memory` | Session memory | Past session summaries |
| `nested_memory` | Nested memory file | Memory file contents |
| `ultramemory` | Ultra memory content | Direct content injection |
| **Skills & Agents** | | |
| `invoked_skills` | Skill guidelines | Skill name, path, content |
| `agent_mention` | Agent invocation | "User wants to invoke {agent}" |
| **MCP Resources** | | |
| `mcp_resource` | MCP resource content | Resource URI and contents |
| **Hooks** | | |
| `hook_blocking_error` | Hook blocking error | Error message from hook |
| `hook_success` | Hook success | Success message (SessionStart/UserPromptSubmit only) |
| `hook_additional_context` | Hook context injection | Additional context from hook |
| `hook_stopped_continuation` | Hook stopped | Stop message from hook |
| `async_hook_response` | Async hook response | System message + additional context |
| **Notifications** | | |
| `collab_notification` | Collab messages | Unread message counts |
| `queued_command` | Queued user command | "User sent: {message}" |
| **Resource Tracking** | | |
| `token_usage` | Token usage | "Token usage: X/Y; Z remaining" |
| `budget_usd` | Budget usage | "USD budget: $X/$Y; $Z remaining" |
| **Diagnostics** | | |
| `diagnostics` | Code diagnostics | New diagnostic issues detected |
| **Misc** | | |
| `output_style` | Output style active | Style-specific guidelines |
| `critical_system_reminder` | Critical reminder | Direct content injection |

### Attachment Generator Functions

| Function | Obfuscated | Location | Generates |
|----------|------------|----------|-----------|
| generateAllAttachments | O27 | chunks.131.mjs:3121-3138 | All attachments |
| generateAtMentionedFilesAttachment | h27 | chunks.131.mjs:3372-3409 | @ mentioned files |
| generateMcpResourcesAttachment | u27 | chunks.131.mjs:3425-3456 | MCP resources |
| generateAgentMentionsAttachment | g27 | chunks.131.mjs:3411-3423 | Agent mentions |
| generateChangedFilesAttachment | m27 | chunks.131.mjs:3458-3508 | Changed files |
| generateNestedMemoryAttachment | d27 | chunks.131.mjs:3510-3521 | Nested memory |
| generateClaudeMdAttachment | v27 | chunks.131.mjs:3283-3285 | CLAUDE.md |
| generatePlanModeAttachment | j27 | chunks.131.mjs:3207-3231 | Plan mode |
| generatePlanModeExitAttachment | T27 | chunks.131.mjs:3233-3244 | Plan mode exit |
| generateTodoRemindersAttachment | t27 | chunks.132.mjs:TBD | Todo reminders |
| generateIdeSelectionAttachment | k27 | chunks.131.mjs:3287-3300 | IDE selection |
| generateIdeOpenedFileAttachment | f27 | chunks.131.mjs:3362-3370 | IDE opened file |
| generateQueuedCommandsAttachment | M27 | chunks.131.mjs:3166-3174 | Queued commands |
| generateMemoryAttachment | mr2 | chunks.131.mjs:TBD | Session memory |
| generateTokenUsageAttachment | G97 | chunks.131.mjs:TBD | Token usage |
| generateBudgetUsdAttachment | Z97 | chunks.131.mjs:TBD | Budget USD |

---

## 10. Subsystem Interconnections

This section documents how steering integrates with other subsystems and the complete data flow through the system.

### 10.1 Main Agent Loop Integration

The main agent loop (`aN` / `mainAgentLoop`) is the central orchestrator that coordinates steering injection at multiple points.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    Main Agent Loop Steering Injection Points                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Message Received                                                       │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  1. VHA (prepareToolUseContext)                                       │   │
│  │     - Initialize tool use context with cwd, options, permissions      │   │
│  │     - Set up agentId for subagent identification                      │   │
│  │     Location: chunks.133.mjs:2650-2690                                │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  2. oHA (prepareMessagesForApi)                                       │   │
│  │     - Filter messages for API consumption                             │   │
│  │     - Apply isMeta filtering rules                                    │   │
│  │     Location: chunks.135.mjs:480-511                                  │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  3. O27 (generateAllAttachments)                                      │   │
│  │     - Generate ALL steering attachments (36+ types)                   │   │
│  │     - Includes plan_mode, todo, memory, diagnostics, etc.             │   │
│  │     Location: chunks.131.mjs:3121-3138                                │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  4. q$7 (convertAttachmentToSystemMessage)                            │   │
│  │     - Convert each attachment to isMeta: true message                 │   │
│  │     - Wrap in <system-reminder> tags                                  │   │
│  │     Location: chunks.148.mjs:3-371                                    │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  5. fA9 (combineSystemContext)                                        │   │
│  │     - Merge all context entries                                       │   │
│  │     Location: chunks.133.mjs:2580-2583                                │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  6. _3A (injectUserContext)                                           │   │
│  │     - Inject claudeMd, gitStatus as system reminder                   │   │
│  │     - Prepend to message stream                                       │   │
│  │     Location: chunks.133.mjs:2585-2599                                │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  7. BJ9 (buildFinalApiMessages)                                       │   │
│  │     - Assemble final message array for API call                       │   │
│  │     - Include all steering messages                                   │   │
│  │     Location: chunks.133.mjs:2765-2800                                │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  8. T77 (sendApiRequest)                                              │   │
│  │     - Send to Claude API with steered context                         │   │
│  │     Location: chunks.87.mjs (API layer)                               │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  9. KM0 (serialExecutionContextFlow)                                  │   │
│  │     - Execute tools with context modifiers                            │   │
│  │     - Collect and apply context changes                               │   │
│  │     Location: chunks.134.mjs:571-610                                  │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  10. H0 (createMetaBlock)                                             │   │
│  │     - Create isMeta messages for tool results                         │   │
│  │     - Used throughout for hidden message creation                     │   │
│  │     Location: chunks.147.mjs:2410-2440                                │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Hook-Tool-Steering Integration

The hook system integrates with steering at multiple points, enabling external code to modify tool behavior and inject context.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    Hook-Tool-Steering Integration Flow                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Tool Use Request                                                            │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  PreToolUse Hook (oG0)                                                │   │
│  │                                                                       │   │
│  │  Hook can return:                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │  │ • allow: Tool executes normally                                 │ │   │
│  │  │ • deny: Tool blocked, error returned                            │ │   │
│  │  │ • ask: User prompted for permission                             │ │   │
│  │  │ • updatedInput: Modified tool input                             │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                       │   │
│  │  Location: chunks.120.mjs:1165-1210                                   │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                     ┌────────────┴────────────┐              │
│                                     ▼                         ▼              │
│                              ┌──────────────┐          ┌──────────────┐      │
│                              │    allow     │          │  deny/ask    │      │
│                              └──────┬───────┘          └──────┬───────┘      │
│                                     │                         │              │
│                                     ▼                         ▼              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Permission Decision (tO9 handleToolPermissionDecision)               │   │
│  │                                                                       │   │
│  │  Steering affects permission:                                         │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │  │ • bypassPermissions mode → auto-allow                           │ │   │
│  │  │ • plan mode + bypass available → auto-allow read-only           │ │   │
│  │  │ • default mode → interactive prompt                             │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                       │   │
│  │  Location: chunks.147.mjs:1570-1598                                   │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Tool Execution                                                       │   │
│  │  (Uses potentially modified input from PreToolUse hook)               │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  PostToolUse Hook (QG0)                                               │   │
│  │                                                                       │   │
│  │  Hook can inject:                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │  │ • additionalContext: Inject steering messages                   │ │   │
│  │  │ • updatedMCPToolOutput: Modify MCP tool results                 │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                       │   │
│  │  Location: chunks.120.mjs:1245-1295                                   │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Context Modifier Application (KM0)                                   │   │
│  │                                                                       │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │  │ Concurrent tools: Collect modifiers → apply after batch         │ │   │
│  │  │ Serial tools: Apply modifiers immediately                       │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                       │   │
│  │  Location: chunks.134.mjs:571-610                                     │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 10.3 Inter-Module Communication Map

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     Steering Inter-Module Communication                       │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                        ┌─────────────────────┐                               │
│                        │    Main Agent Loop  │                               │
│                        │        (aN)         │                               │
│                        └─────────┬───────────┘                               │
│                                  │                                           │
│          ┌───────────────────────┼───────────────────────┐                   │
│          │                       │                       │                   │
│          ▼                       ▼                       ▼                   │
│  ┌───────────────┐      ┌───────────────┐      ┌───────────────┐            │
│  │  Hook System  │      │  Attachment   │      │  Tool System  │            │
│  │   (oG0/QG0)   │◄────►│   System      │◄────►│    (KM0)      │            │
│  └───────┬───────┘      │   (O27/q$7)   │      └───────┬───────┘            │
│          │              └───────┬───────┘              │                     │
│          │                      │                      │                     │
│          │    ┌─────────────────┼─────────────────┐    │                     │
│          │    │                 │                 │    │                     │
│          ▼    ▼                 ▼                 ▼    ▼                     │
│  ┌───────────────┐      ┌───────────────┐      ┌───────────────┐            │
│  │  Permission   │      │   Plan Mode   │      │  File State   │            │
│  │   System      │◄────►│   Steering    │◄────►│   Tracking    │            │
│  │   (tO9)       │      │  (z$7/$$7)    │      │    (VzA)      │            │
│  └───────────────┘      └───────────────┘      └───────────────┘            │
│          │                      │                      │                     │
│          │                      │                      │                     │
│          ▼                      ▼                      ▼                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        System Reminder Layer                         │    │
│  │              (mI0, SG5, PG5, q5, Yh, H0, _3A)                        │    │
│  │                                                                      │    │
│  │  Common functions used by all steering subsystems:                   │    │
│  │  • extractSystemReminder (mI0) - Parse <system-reminder> tags        │    │
│  │  • filterSystemReminderMessages (SG5) - Separate from regular msgs   │    │
│  │  • wrapInSystemReminder (q5) - Wrap content in tags                  │    │
│  │  • createMetaBlock (H0) - Create hidden messages                     │    │
│  │  • injectUserContext (_3A) - Inject user context                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 10.4 Data Flow: User Message to API Call

This diagram shows the complete data flow with all steering injection points.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│              Complete Steering Data Flow (User Message → API)                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐                                                             │
│  │ User Input  │                                                             │
│  └──────┬──────┘                                                             │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ STEP 1: UserPromptSubmit Hook                                         │   │
│  │                                                                       │   │
│  │ • Hook scripts execute (configured in settings.json)                  │   │
│  │ • Can inject additionalContext                                        │   │
│  │ • Can block/modify user input                                         │   │
│  │                                                                       │   │
│  │ Input:  Raw user message                                              │   │
│  │ Output: User message + additionalContext                              │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ STEP 2: Attachment Generation (O27)                                   │   │
│  │                                                                       │   │
│  │ Parallel generation of 36+ attachment types:                          │   │
│  │ ┌────────────────────────────────────────────────────────────────┐   │   │
│  │ │ User-dependent:     @mentions, MCP resources, agent mentions   │   │   │
│  │ │ Core:               changed_files, nested_memory, claude_md    │   │   │
│  │ │ Mode-specific:      plan_mode, delegate_mode, todo_reminders   │   │   │
│  │ │ IDE:                selection, opened_file, diagnostics        │   │   │
│  │ │ Resource tracking:  token_usage, budget_usd, memory            │   │   │
│  │ └────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                       │   │
│  │ Input:  User prompt, toolUseContext, messages                         │   │
│  │ Output: Array of Attachment objects                                   │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ STEP 3: Attachment → System Message Conversion (q$7)                  │   │
│  │                                                                       │   │
│  │ Each attachment is converted to messages with:                        │   │
│  │ • isMeta: true (hidden from user UI)                                  │   │
│  │ • <system-reminder> tags wrapping content                             │   │
│  │                                                                       │   │
│  │ Special handling:                                                     │   │
│  │ • file/directory → Read/Bash tool use/result pairs                    │   │
│  │ • plan_mode → delegates to z$7 for full/sparse/subagent               │   │
│  │ • todo → current todo list state                                      │   │
│  │                                                                       │   │
│  │ Input:  Attachment objects                                            │   │
│  │ Output: isMeta messages with system-reminder tags                     │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ STEP 4: User Context Injection (_3A)                                  │   │
│  │                                                                       │   │
│  │ Injects configured user context:                                      │   │
│  │ • claudeMd: CLAUDE.md file contents                                   │   │
│  │ • gitStatus: Current git status output                                │   │
│  │ • Custom context from hooks                                           │   │
│  │                                                                       │   │
│  │ Format:                                                               │   │
│  │ <system-reminder>                                                     │   │
│  │ As you answer the user's questions...                                 │   │
│  │ # claudeMd                                                            │   │
│  │ [contents]                                                            │   │
│  │ </system-reminder>                                                    │   │
│  │                                                                       │   │
│  │ Input:  Messages array, userContext object                            │   │
│  │ Output: Messages with context prepended                               │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ STEP 5: Message Filtering for API (oHA)                               │   │
│  │                                                                       │   │
│  │ Filters and prepares messages:                                        │   │
│  │ • Removes messages that shouldn't go to API                           │   │
│  │ • Applies isMeta visibility rules                                     │   │
│  │ • Formats for Claude API consumption                                  │   │
│  │                                                                       │   │
│  │ Input:  All messages including steering                               │   │
│  │ Output: API-ready message array                                       │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ STEP 6: System Prompt Building (rc / buildSystemPrompt)               │   │
│  │                                                                       │   │
│  │ Assembles complete system prompt:                                     │   │
│  │ • Base system prompt (tool definitions, instructions)                 │   │
│  │ • Appended system prompt (--append-system-prompt)                     │   │
│  │ • Dynamic context from environment                                    │   │
│  │                                                                       │   │
│  │ Location: chunks.146.mjs:2467-2605                                    │   │
│  │                                                                       │   │
│  │ Input:  Base prompt, append text, context                             │   │
│  │ Output: Complete system prompt string                                 │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ STEP 7: API Request (T77)                                             │   │
│  │                                                                       │   │
│  │ Final API payload structure:                                          │   │
│  │ {                                                                     │   │
│  │   system: [system prompt with steering],                              │   │
│  │   messages: [                                                         │   │
│  │     { role: "user", content: [steering messages...] },                │   │
│  │     { role: "user", content: [actual user message] },                 │   │
│  │     ...                                                               │   │
│  │   ]                                                                   │   │
│  │ }                                                                     │   │
│  │                                                                       │   │
│  │ Model receives: Steered system prompt + steered messages              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 10.5 Key Integration Functions

| Function | Obfuscated | Location | Role in Integration |
|----------|------------|----------|---------------------|
| **Main Loop Orchestration** | | | |
| mainAgentLoop | aN | chunks.133.mjs:2900+ | Central orchestrator for all steering |
| prepareToolUseContext | VHA | chunks.133.mjs:2650-2690 | Initialize context for tool execution |
| prepareMessagesForApi | oHA | chunks.135.mjs:480-511 | Filter messages for API consumption |
| buildFinalApiMessages | BJ9 | chunks.133.mjs:2765-2800 | Assemble final message array |
| **Hook Integration** | | | |
| runPreToolUseHook | oG0 | chunks.120.mjs:1165-1210 | Execute PreToolUse hooks |
| runPostToolUseHook | QG0 | chunks.120.mjs:1245-1295 | Execute PostToolUse hooks |
| handleToolPermissionDecision | tO9 | chunks.147.mjs:1570-1598 | Permission decision with mode awareness |
| **Attachment Pipeline** | | | |
| generateAllAttachments | O27 | chunks.131.mjs:3121-3138 | Generate all steering attachments |
| convertAttachmentToSystemMessage | q$7 | chunks.148.mjs:3-371 | Convert attachments to messages |
| wrapWithErrorHandling | fJ | chunks.131.mjs:3140-3163 | Wrap generators with error handling |
| **Context Manipulation** | | | |
| serialExecutionContextFlow | KM0 | chunks.134.mjs:571-610 | Tool execution with context modifiers |
| injectUserContext | _3A | chunks.133.mjs:2585-2599 | Inject user context as system reminder |
| combineSystemContext | fA9 | chunks.133.mjs:2580-2583 | Merge system context entries |

### 10.6 Steering State Machine

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        Steering State Machine                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                           ┌──────────────┐                                   │
│                           │    IDLE      │                                   │
│                           │  (No active  │                                   │
│                           │   steering)  │                                   │
│                           └──────┬───────┘                                   │
│                                  │                                           │
│                    User message or tool request                              │
│                                  │                                           │
│                                  ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      ATTACHMENT_GENERATION                            │   │
│  │                                                                       │   │
│  │  Current mode checked:                                                │   │
│  │  • default → standard attachments                                     │   │
│  │  • plan → plan mode attachments + read-only constraints               │   │
│  │  • bypassPermissions → reduced permission checking                    │   │
│  │                                                                       │   │
│  │  Attachment types enabled/disabled based on:                          │   │
│  │  • isMainAgent vs subagent                                            │   │
│  │  • Current permission mode                                            │   │
│  │  • Available resources (IDE, MCP, etc.)                               │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        CONTEXT_INJECTION                              │   │
│  │                                                                       │   │
│  │  Injection order (critical for override behavior):                    │   │
│  │  1. User context (claudeMd, gitStatus) - lowest priority              │   │
│  │  2. Attachment-generated messages                                     │   │
│  │  3. Plan mode steering - highest priority (explicit override)         │   │
│  │                                                                       │   │
│  │  Note: Plan mode says "This supercedes any other instructions"        │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         TOOL_EXECUTION                                │   │
│  │                                                                       │   │
│  │  Hook lifecycle:                                                      │   │
│  │  1. PreToolUse (oG0) - can modify input, block, or allow              │   │
│  │  2. Permission check (tO9) - mode-aware decision                      │   │
│  │  3. Tool execution - with potentially modified input                  │   │
│  │  4. Context modifier collection (if concurrent)                       │   │
│  │  5. PostToolUse (QG0) - can inject additionalContext                  │   │
│  │  6. Context modifier application (deferred if concurrent)             │   │
│  └──────────────────────────────────────────────┬───────────────────────┘   │
│                                                  │                           │
│                                                  ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                       STATE_UPDATE                                    │   │
│  │                                                                       │   │
│  │  Updates tracked state:                                               │   │
│  │  • readFileState (VzA) - file content tracking                        │   │
│  │  • toolUseContext - updated execution context                         │   │
│  │  • Permission decisions cached                                        │   │
│  │                                                                       │   │
│  │  Transitions back to IDLE or continues with next tool                 │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 10.7 Steering Priority and Override Rules

When multiple steering sources provide conflicting instructions, the following priority order applies:

| Priority | Source | Override Behavior |
|----------|--------|-------------------|
| 1 (Highest) | Plan Mode Reminders | Explicit: "This supercedes any other instructions" |
| 2 | Critical System Reminders | Direct injection, bypasses other processing |
| 3 | Hook additionalContext | Injected after user prompts, high visibility |
| 4 | Tool Context Modifiers | Applied during/after tool execution |
| 5 | Attachment-generated Messages | Generated per-turn based on state |
| 6 (Lowest) | User Context (claudeMd) | Background context, can be overridden |

**Key insight:** Plan mode steering explicitly claims override priority with the phrase "This supercedes any other instructions you have received." This is critical for enforcing read-only constraints during planning phases.

---

## Cross-Reference Index

- **System Reminders:** [04_system_reminder/](../04_system_reminder/)
- **Tools Integration:** [05_tools/](../05_tools/)
- **Hook System:** [11_hook/](../11_hook/)
- **Plan Mode:** [12_plan_mode/](../12_plan_mode/)
- **Permissions & Sandbox:** [18_sandbox/](../18_sandbox/)
- **Todo List:** [13_todo_list/](../13_todo_list/)
