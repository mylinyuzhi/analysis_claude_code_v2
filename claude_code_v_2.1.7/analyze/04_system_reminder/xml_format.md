# System Reminder XML Format Specification

## Overview

System reminders in Claude Code v2.1.7 use XML-style tags to wrap metadata and contextual information injected into the conversation. This document catalogs all XML formats used for system reminders.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `wrapSystemReminderText` (Yh) - Wrap text in XML tags
- `wrapInSystemReminder` (q5) - Wrap message array contents
- `createMetaBlock` (H0) - Create metadata message block

---

## Core XML Wrapper Functions

### 1. Yh() - System Reminder Text Wrapper

**Location:** `chunks.147.mjs:3212-3216`

**Obfuscated Name:** `Yh`

**Readable Name:** `wrapSystemReminderText`

**Purpose:** Wraps text content in `<system-reminder>` XML tags

```javascript
// ============================================
// wrapSystemReminderText - Wrap text in XML tags
// Location: chunks.147.mjs:3212-3216
// ============================================

// ORIGINAL (for source lookup):
function Yh(A) {
  return `<system-reminder>
${A}
</system-reminder>`
}

// READABLE (for understanding):
function wrapSystemReminderText(text) {
  return `<system-reminder>
${text}
</system-reminder>`
}

// Mapping: Yh→wrapSystemReminderText, A→text
```

**Output Format:**
```xml
<system-reminder>
[Content text here]
</system-reminder>
```

---

### 2. q5() - System Reminder Array Wrapper

**Location:** `chunks.147.mjs:3218-3245`

**Obfuscated Name:** `q5`

**Readable Name:** `wrapInSystemReminder`

**Purpose:** Wraps an array of message objects, applying `<system-reminder>` tags to all text content

```javascript
// ============================================
// wrapInSystemReminder - Wrap message array contents
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
        if (G.type === "text") return { ...G, text: Yh(G.text) };
        return G
      });
      return { ...Q, message: { ...Q.message, content: B } }
    }
    return Q
  })
}

// READABLE (for understanding):
function wrapInSystemReminder(messages) {
  return messages.map((message) => {
    // Case 1: String content - wrap directly
    if (typeof message.message.content === "string") {
      return {
        ...message,
        message: {
          ...message.message,
          content: wrapSystemReminderText(message.message.content)
        }
      };
    }
    // Case 2: Array content - wrap each text block
    else if (Array.isArray(message.message.content)) {
      let wrappedContent = message.message.content.map((block) => {
        if (block.type === "text") {
          return { ...block, text: wrapSystemReminderText(block.text) };
        }
        return block;  // non-text blocks unchanged (image, etc.)
      });
      return { ...message, message: { ...message.message, content: wrappedContent } };
    }
    return message;
  });
}

// Mapping: q5→wrapInSystemReminder, A→messages, Q→message, B→wrappedContent,
//          G→block, Yh→wrapSystemReminderText
```

**Key Behavior:**
- Iterates through all messages in array
- Wraps string content directly with `Yh()` (wrapSystemReminderText)
- For array content, wraps only `type: "text"` blocks
- Leaves image and other block types unchanged

---

### 3. H0() - Meta Block Creator

**Location:** `chunks.147.mjs:2410-2440`

**Obfuscated Name:** `H0`

**Readable Name:** `createMetaBlock`

**Purpose:** Creates a user-role message with `isMeta: true` flag

```javascript
// ============================================
// createMetaBlock - Create metadata message block
// Location: chunks.147.mjs:2410-2440
// ============================================

// ORIGINAL (for source lookup):
function H0({
  content: A,
  isMeta: Q,
  isVisibleInTranscriptOnly: B,
  isCompactSummary: G,
  toolUseResult: Z,
  uuid: Y,
  thinkingMetadata: J,
  timestamp: X,
  todos: I,
  imagePasteIds: D,
  sourceToolAssistantUUID: W
}) {
  return {
    type: "user",
    message: { role: "user", content: A || JO },
    isMeta: Q,
    isVisibleInTranscriptOnly: B,
    isCompactSummary: G,
    uuid: Y ?? GM(),
    timestamp: X ?? new Date().toISOString(),
    toolUseResult: Z,
    thinkingMetadata: J,
    todos: I,
    imagePasteIds: D,
    sourceToolAssistantUUID: W
  }
}

// READABLE (for understanding):
function createMetaBlock({
  content,
  isMeta,
  isVisibleInTranscriptOnly,
  isCompactSummary,
  toolUseResult,
  uuid,
  thinkingMetadata,
  timestamp,
  todos,
  imagePasteIds,
  sourceToolAssistantUUID
}) {
  return {
    type: "user",
    message: { role: "user", content: content || EMPTY_PLACEHOLDER },
    isMeta: isMeta,
    isVisibleInTranscriptOnly: isVisibleInTranscriptOnly,
    isCompactSummary: isCompactSummary,
    uuid: uuid ?? generateUUID(),
    timestamp: timestamp ?? new Date().toISOString(),
    toolUseResult: toolUseResult,
    thinkingMetadata: thinkingMetadata,
    todos: todos,
    imagePasteIds: imagePasteIds,
    sourceToolAssistantUUID: sourceToolAssistantUUID
  }
}

// Mapping: H0→createMetaBlock, A→content, Q→isMeta, B→isVisibleInTranscriptOnly,
//          G→isCompactSummary, Z→toolUseResult, Y→uuid, J→thinkingMetadata,
//          X→timestamp, I→todos, D→imagePasteIds, W→sourceToolAssistantUUID,
//          JO→EMPTY_PLACEHOLDER, GM→generateUUID
```

**Key Properties:**
- `isMeta: true` - Indicates this is metadata, not user content
- `type: "user"` - Sent as user role in API
- `content` - Can be string or content block array
- New in v2.1.7: `imagePasteIds`, `sourceToolAssistantUUID` fields

---

## XML Tag Formats

### 1. `<system-reminder>` - Primary Wrapper

**Usage:** Most system reminders

**Format:**
```xml
<system-reminder>
[Reminder content - instructions, warnings, or metadata]
</system-reminder>
```

**Examples:**

**Warning Reminder:**
```xml
<system-reminder>
Warning: the file exists but the contents are empty.
</system-reminder>
```

**Context Reminder:**
```xml
<system-reminder>
As you answer the user's questions, you can use the following context:
# claudeMd
[CLAUDE.md content here]

IMPORTANT: this context may or may not be relevant to your tasks.
You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
```

**Malware Warning:**
```xml
<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware.
You CAN and SHOULD provide analysis of malware, what it is doing.
But you MUST refuse to improve or augment the code.
You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

---

### 2. `<new-diagnostics>` - Diagnostic Issues

**Location:** `chunks.148.mjs:167-175`

**Usage:** New diagnostic issues detected by LSP or diagnostic system

**Format:**
```xml
<new-diagnostics>The following new diagnostic issues were detected:

[Formatted diagnostics summary]
</new-diagnostics>
```

**Example:**
```xml
<new-diagnostics>The following new diagnostic issues were detected:

File: /path/to/file.ts
Line 10: [error] Type 'string' is not assignable to type 'number'
Line 25: [warning] Variable 'foo' is declared but never used
</new-diagnostics>
```

---

### 3. `<session-memory>` - Past Session Summaries

**Location:** `chunks.148.mjs:287-307`

**Usage:** Previous session memory content

**Format:**
```xml
<session-memory>
These session summaries are from PAST sessions that might not be related to the current task and may have outdated info. Do not assume the current task is related to these summaries, until the user's messages indicate so or reference similar tasks. Only a preview of each memory is shown - use the Read tool with the provided path to access full session memory when a session is relevant.

## Previous Session ([date])
Full session notes: [path] ([N] more lines in full file)

[preview content]

---

## Previous Session ([date])
[...]
</session-memory>
```

---

### 4. `<mcp-resource>` - MCP Resource Content

**Location:** `chunks.148.mjs:221-254`

**Usage:** Content from MCP (Model Context Protocol) resources

**Format:**

**With Content:**
```
Full contents of resource:

[resource content]

Do NOT read this resource again unless you think it may have changed, since you already have the full contents.
```

**Empty Resource:**
```xml
<mcp-resource server="[server]" uri="[uri]">(No content)</mcp-resource>
```

**No Displayable Content:**
```xml
<mcp-resource server="[server]" uri="[uri]">(No displayable content)</mcp-resource>
```

---

## New XML Formats in v2.1.7

### 5. Task Status Format

**Location:** `chunks.148.mjs:261-268`

**Usage:** Unified task status notifications (replaces background_shell_status, async_agent_status)

**Format:**
```xml
<system-reminder>
Task [taskId] (type: [taskType]) (status: [status]) (description: [description]) [Delta: deltaSummary] You can check its output using the TaskOutput tool.
</system-reminder>
```

**Example:**
```xml
<system-reminder>
Task task-123 (type: shell) (status: completed) (description: npm test) Delta: All tests passed. You can check its output using the TaskOutput tool.
</system-reminder>
```

---

### 6. Task Progress Format

**Location:** `chunks.148.mjs:269-273`

**Usage:** Task progress updates

**Format:**
```xml
<system-reminder>
[progress message]
</system-reminder>
```

---

### 7. Plan Mode Exit Format (NEW)

**Location:** `chunks.148.mjs:198-206`

**Usage:** Notification when exiting plan mode

**Format:**
```xml
<system-reminder>
## Exited Plan Mode

You have exited plan mode. You can now make edits, run tools, and take actions. The plan file is located at [planFilePath] if you need to reference it.
</system-reminder>
```

---

### 8. Delegate Mode Exit Format (NEW)

**Location:** `chunks.148.mjs:209-215`

**Usage:** Notification when exiting delegate mode

**Format:**
```xml
<system-reminder>
## Exited Delegate Mode

You have exited delegate mode. You can now use all tools (Bash, Read, Write, Edit, etc.) and take actions directly. Continue with your tasks.
</system-reminder>
```

---

### 9. Invoked Skills Format (NEW)

**Location:** `chunks.148.mjs:88-104`

**Usage:** Skills invoked during session

**Format:**
```xml
<system-reminder>
The following skills were invoked in this session. Continue to follow these guidelines:

### Skill: [skill-name]
Path: [skill-path]

[skill-content]

---

### Skill: [skill-name-2]
[...]
</system-reminder>
```

---

### 10. Collaboration Notification Format (NEW)

**Location:** `chunks.148.mjs:343-350`

**Usage:** Collaboration message notifications

**Format:**
```xml
<system-reminder>
You have [N] unread collab message(s) from: @[handle1] ([X] new), @[handle2] ([Y] new). Use the CollabRead tool to read these messages.
</system-reminder>
```

---

### 11. Verify Plan Reminder Format (NEW)

**Location:** `chunks.148.mjs:351-357`

**Usage:** Reminder to verify plan completion

**Format:**
```xml
<system-reminder>
You have completed implementing the plan. Please call the "" tool directly (NOT the Task tool or an agent) to verify that all plan items were completed correctly.
</system-reminder>
```

---

## Processing Pipeline

```
Attachment Object
      │
      ▼
q$7() - convertAttachmentToSystemMessage (chunks.148.mjs:3-371)
      │
      ├─────────────────────────────────────┐
      │                                     │
      ▼                                     ▼
┌─────────────────┐              ┌─────────────────┐
│  q5() Wrapping  │              │  H0(Yh()) Direct│
│                 │              │                 │
│  Most types:    │              │  Some types:    │
│  - file         │              │  - task_status  │
│  - directory    │              │  - task_progress│
│  - todo_reminder│              │  - token_usage  │
│  - plan_mode    │              │  - budget_usd   │
│  - diagnostics  │              │  - hook_*       │
│  - etc.         │              │                 │
└────────┬────────┘              └────────┬────────┘
         │                                 │
         ▼                                 ▼
┌──────────────────────────────────────────────────┐
│          System Message with isMeta: true         │
│                                                  │
│  {                                               │
│    type: "user",                                 │
│    message: {                                    │
│      role: "user",                               │
│      content: "<system-reminder>...</system-reminder>"
│    },                                            │
│    isMeta: true,                                 │
│    uuid: "...",                                  │
│    timestamp: "..."                              │
│  }                                               │
└──────────────────────────────────────────────────┘
      │
      ▼
Inserted into conversation before API call
```

---

## Quick Symbol Lookup

When reading obfuscated source code, use this quick reference:

### Message Creation Pattern

```javascript
// Obfuscated:
return q5([H0({ content: "text", isMeta: !0 })]);

// Deobfuscated:
return wrapInSystemReminder([createMetaBlock({ content: "text", isMeta: true })]);
```

### Tool Simulation Pattern

```javascript
// Obfuscated:
return q5([MuA(o2.name, {...}), OuA(o2, {...})]);

// Deobfuscated:
return wrapInSystemReminder([
  createToolUseMessage(BashTool.name, {...}),
  createToolResultMessage(BashTool, {...})
]);
```

### Direct Wrap Pattern

```javascript
// Obfuscated:
return [H0({ content: Yh("text"), isMeta: !0 })];

// Deobfuscated:
return [createMetaBlock({ content: wrapSystemReminderText("text"), isMeta: true })];
```

### Common Obfuscated Values

| Code | Meaning |
|------|---------|
| `!0` | `true` |
| `!1` | `false` |
| `void 0` | `undefined` |
| `A.type` | `attachment.type` |
| `Q.message` | `message.message` |
| `G.text` | `block.text` |
| `eA()` | `JSON.stringify()` |

---

## Key Function Mapping (v2.1.7)

| Obfuscated | Readable | File:Line | Purpose |
|------------|----------|-----------|---------|
| `Yh` | `wrapSystemReminderText` | chunks.147.mjs:3212 | XML tag wrapper |
| `q5` | `wrapInSystemReminder` | chunks.147.mjs:3218 | Array message wrapper |
| `H0` | `createMetaBlock` | chunks.147.mjs:2410 | Create isMeta message |
| `q$7` | `convertAttachmentToSystemMessage` | chunks.148.mjs:3 | Main converter |
| `MuA` | `createToolUseMessage` | chunks.148.mjs:392 | Simulate tool use |
| `OuA` | `createToolResultMessage` | chunks.148.mjs:373 | Simulate tool result |
| `O27` | `generateAllAttachments` | chunks.131.mjs:3121 | Main orchestrator |
| `fJ` | `wrapWithErrorHandling` | chunks.131.mjs:3140 | Error wrapper |

---

## Plan Mode Content Generation (z$7)

The plan mode attachment has three different content generators based on context. This section documents the complete content for each variant.

### 12. Plan Mode Router (z$7)

**Location:** `chunks.147.mjs:3247-3251`

**Purpose:** Routes to appropriate plan mode content generator

```javascript
// ============================================
// generatePlanModeInstructions - Router function
// Location: chunks.147.mjs:3247-3251
// ============================================

// ORIGINAL (for source lookup):
function z$7(A) {
  if (A.isSubAgent) return U$7(A);
  if (A.reminderType === "sparse") return C$7(A);
  return $$7(A)
}

// READABLE (for understanding):
function generatePlanModeInstructions(attachment) {
  if (attachment.isSubAgent) {
    return generateSubAgentPlanModeInstructions(attachment);  // U$7
  }
  if (attachment.reminderType === "sparse") {
    return generateSparsePlanModeInstructions(attachment);    // C$7
  }
  return generateFullPlanModeInstructions(attachment);         // $$7
}

// Mapping: z$7→generatePlanModeInstructions, $$7→generateFullPlanModeInstructions,
//          C$7→generateSparsePlanModeInstructions, U$7→generateSubAgentPlanModeInstructions
```

---

### 13. Full Plan Mode Instructions ($$7)

**Location:** `chunks.147.mjs:3253-3330`

**Usage:** First reminder and every N-th reminder for main agent

**Complete Content Template:**

```markdown
Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
[If plan exists:]
A plan file already exists at {planFilePath}. You can read it and make incremental edits using the Edit tool.

[If no plan:]
No plan file exists yet. You should create your plan at {planFilePath} using the Write tool.

You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.

## Plan Workflow

### Phase 1: Initial Understanding
Goal: Gain a comprehensive understanding of the user's request by reading through code and asking them questions. Critical: In this phase you should only use the Explore subagent type.

1. Focus on understanding the user's request and the code associated with their request

2. **Launch up to {maxExploreAgents} Explore agents IN PARALLEL** (single message, multiple tool calls) to efficiently explore the codebase.
   - Use 1 agent when the task is isolated to known files, the user provided specific file paths, or you're making a small targeted change.
   - Use multiple agents when: the scope is uncertain, multiple areas of the codebase are involved, or you need to understand existing patterns before planning.
   - Quality over quantity - {maxExploreAgents} agents maximum, but you should try to use the minimum number of agents necessary (usually just 1)
   - If using multiple agents: Provide each agent with a specific search focus or area to explore. Example: One agent searches for existing implementations, another explores related components, a third investigates testing patterns

3. After exploring the code, use the AskUserQuestion tool to clarify ambiguities in the user request up front.

### Phase 2: Design
Goal: Design an implementation approach.

Launch Plan agent(s) to design the implementation based on the user's intent and your exploration results from Phase 1.

You can launch up to {maxPlanAgents} agent(s) in parallel.

**Guidelines:**
- **Default**: Launch at least 1 Plan agent for most tasks - it helps validate your understanding and consider alternatives
- **Skip agents**: Only for truly trivial tasks (typo fixes, single-line changes, simple renames)
[If maxPlanAgents > 1:]
- **Multiple agents**: Use up to {maxPlanAgents} agents for complex tasks that benefit from different perspectives

Examples of when to use multiple agents:
- The task touches multiple parts of the codebase
- It's a large refactor or architectural change
- There are many edge cases to consider
- You'd benefit from exploring different approaches

Example perspectives by task type:
- New feature: simplicity vs performance vs maintainability
- Bug fix: root cause vs workaround vs prevention
- Refactoring: minimal change vs clean architecture

In the agent prompt:
- Provide comprehensive background context from Phase 1 exploration including filenames and code path traces
- Describe requirements and constraints
- Request a detailed implementation plan

### Phase 3: Review
Goal: Review the plan(s) from Phase 2 and ensure alignment with the user's intentions.
1. Read the critical files identified by agents to deepen your understanding
2. Ensure that the plans align with the user's original request
3. Use AskUserQuestion to clarify any remaining questions with the user

### Phase 4: Final Plan
Goal: Write your final plan to the plan file (the only file you can edit).
- Include only your recommended approach, not all alternatives
- Ensure that the plan file is concise enough to scan quickly, but detailed enough to execute effectively
- Include the paths of critical files to be modified
- Include a verification section describing how to test the changes end-to-end (run the code, use MCP tools, run tests)

### Phase 5: Call ExitPlanMode
At the very end of your turn, once you have asked the user questions and are happy with your final plan file - you should always call ExitPlanMode to indicate to the user that you are done planning.
This is critical - your turn should only end with either using the AskUserQuestion tool OR calling ExitPlanMode. Do not stop unless it's for these 2 reasons

**Important:** Use AskUserQuestion ONLY to clarify requirements or choose between approaches. Use ExitPlanMode to request plan approval. Do NOT ask about plan approval in any other way - no text questions, no AskUserQuestion. Phrases like "Is this plan okay?", "Should I proceed?", "How does this plan look?", "Any changes before we start?", or similar MUST use ExitPlanMode.

NOTE: At any point in time through this workflow you should feel free to ask the user questions or clarifications using the AskUserQuestion tool. Don't make large assumptions about user intent. The goal is to present a well researched plan to the user, and tie any loose ends before implementation begins.
```

---

### 14. Sparse Plan Mode Instructions (C$7) - NEW in v2.1.7

**Location:** `chunks.147.mjs:3332-3338`

**Usage:** Intermediate reminders between full reminders (to save tokens)

**Complete Content Template:**

```markdown
Plan mode still active (see full instructions earlier in conversation). Read-only except plan file ({planFilePath}). Follow 5-phase workflow. End turns with AskUserQuestion (for clarifications) or ExitPlanMode (for plan approval). Never ask about plan approval via text or AskUserQuestion.
```

**Key Insight:** This is a condensed version that reminds the model of key constraints without repeating the full instructions, significantly reducing token usage on subsequent turns.

---

### 15. Sub-Agent Plan Mode Instructions (U$7)

**Location:** `chunks.147.mjs:3340-3351`

**Usage:** When a subagent operates in plan mode

**Complete Content Template:**

```markdown
Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received (for example, to make edits). Instead, you should:

## Plan File Info:
[If plan exists:]
A plan file already exists at {planFilePath}. You can read it and make incremental edits using the Edit tool if you need to.

[If no plan:]
No plan file exists yet. You should create your plan at {planFilePath} using the Write tool if you need to.

You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.
Answer the user's query comprehensively, using the AskUserQuestion tool if you need to ask the user clarifying questions. If you do use the AskUserQuestion, make sure to ask all clarifying questions you need to fully understand the user's intent before proceeding.
```

**Key Differences from Full ($$7):**
- Simplified workflow (no 5-phase structure)
- No agent launching instructions
- Focus on answering queries and asking clarifications
- Still READ-ONLY except for plan file

---

### 16. Plan Mode Reentry Format

**Location:** `chunks.148.mjs:179-196`

**Usage:** When re-entering plan mode after previously exiting

**Complete Content Template:**

```markdown
## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at {planFilePath} from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ExitPlanMode

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.
```

---

## Plan Mode Symbol Mapping

| Obfuscated | Readable | File:Line | Purpose |
|------------|----------|-----------|---------|
| `z$7` | `generatePlanModeInstructions` | chunks.147.mjs:3247 | Router function |
| `$$7` | `generateFullPlanModeInstructions` | chunks.147.mjs:3253 | Full instructions |
| `C$7` | `generateSparsePlanModeInstructions` | chunks.147.mjs:3332 | Sparse reminder |
| `U$7` | `generateSubAgentPlanModeInstructions` | chunks.147.mjs:3340 | SubAgent instructions |
| `V$` | `ExitPlanModeTool` | - | Tool reference |
| `J$` | `EditTool` | - | Tool reference |
| `X$` | `WriteTool` | - | Tool reference |
| `MS` | `ExploreAgent` | - | Agent type |
| `UY1` | `PlanAgent` | - | Agent type |
| `zY` | `AskUserQuestionTool` | - | Tool reference |
| `LJ9` | `getMaxPlanAgents` | - | Config getter |
| `OJ9` | `getMaxExploreAgents` | - | Config getter |

---

## See Also

- [mechanism.md](./mechanism.md) - Complete attachment generation pipeline
- [types.md](./types.md) - All attachment type catalog
- [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
- [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
- [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
- [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
