# Context Building - Subagent Context Derivation (Claude Code 2.1.38)

> Deep analysis of how subagent context is built, including fork context messages and critical system reminders

---

## Table of Contents

1. [Overview](#overview)
2. [Fork Context Building](#fork-context-building)
3. [Critical System Reminders](#critical-system-reminders)
4. [Context Derivation](#context-derivation)
5. [Cross-References](#cross-references)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `buildForkContextMessages` (Nn7) - Creates context-aware messages from parent history
- `deriveToolUseContext` (vQ1) - Derives a new tool use context from parent context
- `criticalSystemReminder_EXPERIMENTAL` - Agent-specific critical reminders
- `createUserMessage` (c6) - Creates a user message object

---

## 1. Overview

When a subagent is spawned with `forkContext: true`, it needs visibility into the parent conversation. The context building system constructs a carefully crafted message sequence that:

1. **Provides parent context** - The conversation history from the main thread
2. **Sets boundaries** - Clear markers indicating where parent context ends
3. **Injects reminders** - Agent-specific critical system reminders
4. **Maintains isolation** - The subagent cannot access tools mentioned in parent context that it doesn't have

This document explains how `buildForkContextMessages` (Nn7) constructs these context messages and how the subagent's tool use context is derived.

---

## 2. Fork Context Building

### `buildForkContextMessages` (Nn7)

**What it does:** Given a prompt and the parent's assistant message, constructs a three-message sequence that provides the subagent with context from the parent conversation while clearly marking the boundary between parent context and subagent execution.

**How it works:**

```javascript
// ============================================
// buildForkContextMessages - Attach parent context to subagent prompt
// Location: chunks.90.mjs:2529-2574
// ============================================

// ORIGINAL (for source lookup):
function Nn7(A, q) {
    let K = c6({
            content: A
        }),
        Y = q.message.content.find((O) => {
            if (O.type !== "tool_use" || O.name !== fK) return !1;
            let _ = O.input;
            return "prompt" in _ && _.prompt === A
        });
    if (!Y) return h(`Could not find matching AgentTool tool use for prompt: ${A.slice(0,50)}...`, {
        level: "error"
    }), [K];
    let z = {
            ...q,
            uuid: gL9(),
            message: {
                ...q.message,
                content: [Y]
            }
        },
        w = `### FORKING CONVERSATION CONTEXT ###
### ENTERING SUB-AGENT ROUTINE ###
Entered sub-agent context

PLEASE NOTE:
- The messages above this point are from the main thread prior to sub-agent execution. They are provided as context only.
- Context messages may include tool_use blocks for tools that are not available in the sub-agent context. You should only use the tools specifically provided to you in the system prompt.
- Only complete the specific sub-agent task you have been assigned below.`,
        H = {
            status: "sub_agent_entered",
            description: "Entered sub-agent context",
            message: w
        },
        $ = c6({
            content: [{
                type: "tool_result",
                tool_use_id: Y.id,
                content: [{
                    type: "text",
                    text: w
                }]
            }],
            toolUseResult: H
        });
    return [z, $, K]
}

// READABLE (for understanding):
function buildForkContextMessages(prompt, parentAssistantMessage) {
    // Step 1: Create the final user message containing the prompt
    let userMessage = createUserMessage({ content: prompt });

    // Step 2: Find the matching tool_use block in parent's assistant message
    // The parent's message contains tool_use blocks, one of which should match
    // the Task tool with this exact prompt
    let matchingToolUse = parentAssistantMessage.message.content.find((block) => {
        if (block.type !== "tool_use" || block.name !== TOOL_NAME_AGENT) return false;
        let input = block.input;
        return "prompt" in input && input.prompt === prompt;
    });

    // Step 3: If no matching tool_use found, log error and return just the user message
    if (!matchingToolUse) {
        logError(`Could not find matching AgentTool tool use for prompt: ${prompt.slice(0,50)}...`);
        return [userMessage];
    }

    // Step 4: Create the cloned parent message with ONLY the matching tool_use
    // This provides context without all the other tool uses in the parent's message
    let clonedParentMessage = {
        ...parentAssistantMessage,
        uuid: generateUUID(),
        message: {
            ...parentAssistantMessage.message,
            content: [matchingToolUse]  // Only the relevant tool_use
        }
    };

    // Step 5: Build the fork context reminder text
    let forkContextText = `### FORKING CONVERSATION CONTEXT ###
### ENTERING SUB-AGENT ROUTINE ###
Entered sub-agent context

PLEASE NOTE:
- The messages above this point are from the main thread prior to sub-agent execution. They are provided as context only.
- Context messages may include tool_use blocks for tools that are not available in the sub-agent context. You should only use the tools specifically provided to you in the system prompt.
- Only complete the specific sub-agent task you have been assigned below.`;

    // Step 6: Create tool result metadata
    let toolResultMetadata = {
        status: "sub_agent_entered",
        description: "Entered sub-agent context",
        message: forkContextText
    };

    // Step 7: Create the tool_result message that appears to "respond" to the tool_use
    let toolResultMessage = createUserMessage({
        content: [{
            type: "tool_result",
            tool_use_id: matchingToolUse.id,
            content: [{
                type: "text",
                text: forkContextText
            }]
        }],
        toolUseResult: toolResultMetadata
    });

    // Step 8: Return the three-message sequence
    return [clonedParentMessage, toolResultMessage, userMessage];
}

// Mapping: Nn7→buildForkContextMessages, A→prompt, q→parentAssistantMessage,
//          K→userMessage, Y→matchingToolUse, z→clonedParentMessage,
//          w→forkContextText, H→toolResultMetadata, $→toolResultMessage,
//          c6→createUserMessage, fK→TOOL_NAME_AGENT, gL9→generateUUID,
//          h→logError
```

### Why This Approach

**Three-message sequence:**

| Message | Purpose | Content |
|---------|---------|---------|
| `clonedParentMessage` | Provides context | Parent's assistant message with only the relevant tool_use |
| `toolResultMessage` | Boundary marker | Fork context text as a "tool_result" to the tool_use |
| `userMessage` | The actual prompt | The user's message containing the subagent task |

**Key insight:** The fork context text is injected as a `tool_result` to the parent's `tool_use`. This creates a coherent conversation flow:
1. Parent assistant said "I'll use the Task tool" (tool_use)
2. System responds with "Entering sub-agent context" (tool_result)
3. User provides the task (user message)

This maintains message coherence and provides clear context boundaries.

### Fork Context Message Format

```
### FORKING CONVERSATION CONTEXT ###
### ENTERING SUB-AGENT ROUTINE ###
Entered sub-agent context

PLEASE NOTE:
- The messages above this point are from the main thread prior to sub-agent execution. They are provided as context only.
- Context messages may include tool_use blocks for tools that are not available in the sub-agent context. You should only use the tools specifically provided to you in the system prompt.
- Only complete the specific sub-agent task you have been assigned below.
```

**Why this format:**
1. **Visual markers** - `###` headers create clear visual separation
2. **Explicit context boundary** - "The messages above this point are from the main thread"
3. **Tool availability warning** - "tool_use blocks for tools that are not available" prevents confusion
4. **Task focus** - "Only complete the specific sub-agent task" prevents scope creep

### When Fork Context is Used

Fork context is enabled via `agentDefinition.forkContext: true`:

```javascript
// In AgentTool.call(), before launching agentLoopRunner:
let forkContextMessages = agentDefinition.forkContext ? toolUseContext.messages : null;

// Then in the prompt building phase:
if (forkContextMessages) {
    let [clonedParent, toolResult, userMsg] = buildForkContextMessages(prompt, forkContextMessages);
    messages.push(...[clonedParent, toolResult, userMsg]);
}
```

**Typical use cases:**
- **Explore agent** - Needs to understand what files the user has already discussed
- **Plan agent** - Needs full context of requirements and constraints
- **Custom agents** - When context awareness is important for task completion

---

## 3. Critical System Reminders

### `criticalSystemReminder_EXPERIMENTAL`

Some agent definitions include a `criticalSystemReminder_EXPERIMENTAL` field that injects a high-priority reminder into the subagent's system prompt.

**Explore Agent Reminder:**

```javascript
// ============================================
// Explore agent critical reminder
// Location: chunks.90.mjs:2816
// ============================================

criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
```

**Plan Agent Reminder:**

```javascript
// ============================================
// Plan agent critical reminder
// Location: chunks.90.mjs:2887
// ============================================

criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
```

### How Reminders Are Injected

The `criticalSystemReminder_EXPERIMENTAL` is extracted and injected into the system prompt during context building:

```javascript
// ============================================
// Critical reminder extraction
// Location: chunks.142.mjs:2093 (referenced)
// ============================================

// During system prompt building:
if (agentDefinition.criticalSystemReminder_EXPERIMENTAL) {
    // Inject as a high-priority system reminder block
    systemPrompt += `\n\n${agentDefinition.criticalSystemReminder_EXPERIMENTAL}`;
}
```

**Why "EXPERIMENTAL" suffix:** This field name indicates it's part of an experimental feature that may change in future versions. The reminders are designed to strongly influence agent behavior in safety-critical scenarios.

### Impact on Agent Behavior

| Agent Type | Disallowed Tools | Critical Reminder | Effect |
|------------|------------------|-------------------|--------|
| Explore | Task, NotebookEdit, Edit, Write | READ-ONLY task | Cannot modify anything |
| Plan | Task, NotebookEdit, Edit, Write | READ-ONLY task | Cannot modify anything |
| Bash | (only Bash tool) | None | Can execute commands |
| general-purpose | ["*"] (all tools) | None | Full capabilities |

---

## 4. Context Derivation

### `deriveToolUseContext` (vQ1)

**What it does:** Creates a new `toolUseContext` object for the subagent, deriving values from the parent context while maintaining isolation for certain state.

**Location:** chunks.149.mjs:2589-2632

The full analysis of `deriveToolUseContext` is in [tools_integration.md](./tools_integration.md#3-context-derivation).

### What Is Cloned vs Shared

| Property | Behavior | Rationale |
|----------|----------|-----------|
| `messages` | **Shared reference** | Subagent needs visibility into message history for context |
| `readFileState` | **Cloned (Map copy)** | Each subagent tracks its own file reads independently |
| `mcpClients` | **Shared reference** | MCP client connections are process-global |
| `toolPermissionContext` | **Derived** | Subagent may have different permission mode |
| `agentDefinitions` | **Shared reference** | Registry is global; subagent shouldn't modify it |
| `abortController` | **New instance** | Subagent needs independent cancellation control |

### readFileState Isolation

**Why `readFileState` must be cloned:**

```javascript
// ============================================
// readFileState cloning for isolation
// Location: chunks.130.mjs:2076-2078
// ============================================

// ORIGINAL (for source lookup):
let T = new Map(K.readFileState);

// READABLE (for understanding):
let clonedReadFileState = new Map(parentToolUseContext.readFileState);

// Mapping: T→clonedReadFileState, K→parentToolUseContext
```

**The problem it solves:**
- The `readFileState` Map tracks which files have been read by the agent
- This state affects how the Edit tool validates changes (prevents concurrent edits)
- If subagent shares parent's `readFileState`, file reads by the subagent would pollute the parent's state
- Cloning ensures each agent maintains independent file tracking

**Example scenario:**
1. Parent reads `config.json`
2. Parent spawns subagent to analyze `config.json`
3. Subagent reads `config.json` - this should NOT affect parent's file state
4. If shared, parent would incorrectly think someone else modified the file
5. With cloning, subagent has its own independent tracking

---

## 5. Cross-References

### Related Documentation

- **[tools_integration.md](./tools_integration.md)** - Tool set assembly and detailed `deriveToolUseContext` analysis
- **[execution_flow_deep_dive.md](./execution_flow_deep_dive.md)** - How context is used in the agent loop
- **[agent_tool.md](./agent_tool.md)** - Agent tool schema and permission filtering
- **[agent_definitions.md](./agent_definitions.md)** - Built-in agent definitions and merging

### Symbol References

| Symbol | Location | Description |
|--------|----------|-------------|
| `Nn7` | chunks.90.mjs:2529 | Build fork context messages |
| `vQ1` | chunks.149.mjs:2589 | Derive tool use context |
| `c6` | chunks.149.mjs:340 | Create user message |
| `fK` | chunks.89.mjs | TOOL_NAME_AGENT ("Task") |
| `gL9` | chunks.90.mjs | Generate UUID |

---

## Summary

Context building in the subagent system ensures:

1. **Clear boundaries** - Fork context messages explicitly mark where parent context ends
2. **Tool availability warnings** - Subagent knows that parent tool_uses may reference unavailable tools
3. **Task focus** - Reminders keep the subagent focused on its specific task
4. **State isolation** - Cloned `readFileState` prevents state pollution between agents
5. **Critical reminders** - Agent-specific reminders enforce read-only modes where appropriate

This design enables subagents to benefit from parent context while maintaining proper isolation and safety constraints.