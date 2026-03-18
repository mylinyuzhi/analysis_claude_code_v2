# Context Building - Subagent System (Claude Code 2.1.76)

## Overview

This document covers how the subagent's initial conversation context is built, including the fork context message sequence and how the tool use context is derived from the parent.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `buildForkContextMessages` (Nn7) - Build three-message context sequence - chunks.90.mjs:2529
- `deriveToolUseContext` (vQ1) - Clone/share parent context fields - chunks.149.mjs:2589
- `agentLoopRunner` (qh) - Main agent execution loop - chunks.133.mjs:1565
- `criticalSystemReminder_EXPERIMENTAL` - Injected system content field

---

## Fork Context Messages (Nn7)

### What it does

`buildForkContextMessages` (Nn7) creates the initial three-message sequence that establishes the subagent's context before its task prompt.

### How it works

The three messages establish a conversation baseline:

**Message 1: User message establishing context**
```
You are a subagent working on behalf of the main Claude Code session.
Session ID: {sessionId}
Parent task: {parentTaskDescription}
```

**Message 2: Assistant acknowledgment**
```
I understand. I am a subagent working on the delegated task.
```

**Message 3: User message with the actual task**
```
{taskDescription}
```

This three-message pattern mirrors how a real human would establish context before giving instructions. The LLM responds more coherently when given this warm-up sequence.

### criticalSystemReminder_EXPERIMENTAL

If the agent definition includes `criticalSystemReminder_EXPERIMENTAL`, its content is injected into the system prompt as a critical reminder block. This is used for agent definitions that require specific behavioral constraints:

```javascript
// Agent definition with critical system reminder
{
    agentType: "secure-agent",
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: Never write secrets to disk or logs.",
    getSystemPrompt: (ctx) => buildSecureAgentPrompt(ctx)
}
```

The reminder is appended to the end of the system prompt with special formatting to ensure the LLM treats it as high-priority.

---

## deriveToolUseContext (vQ1)

### What it does

Creates a new tool use context for the subagent by selectively cloning or sharing fields from the parent context.

### Clone vs Share Decision Table

| Field | Strategy | Reason |
|-------|----------|--------|
| `readFileState` | Clone (new Map) | Subagent file reads are independent |
| `getAppState` | Share (same getter) | Subagent reads global app state |
| `setAppState` | Share (same setter) | Subagent updates affect session |
| `options` | Clone (spread) | Subagent may have different model/tools |
| `options.mainLoopModel` | Override (v2.1.76) | Per-invocation model applied here |
| `abortSignal` | Derived (chained) | Subagent abort is chained to parent |
| `sessionId` | Same | Subagent belongs to same session |
| `toolPermissionContext` | Filtered | Apply agent whitelist/blacklist |

```javascript
// ============================================
// deriveToolUseContext - Create subagent context
// Location: chunks.149.mjs:2589
// ============================================

// READABLE (for understanding):
function deriveToolUseContext(parentContext, agentDefinition) {
    return {
        ...parentContext,

        // Clone mutable state
        readFileState: new Map(parentContext.readFileState),

        // Clone options, apply overrides
        options: {
            ...parentContext.options,
            // v2.1.76: per-invocation model override applied here
            mainLoopModel: agentDefinition.resolvedModel ?? parentContext.options.mainLoopModel,
            // Apply tool whitelist/blacklist from agent definition
            tools: filterTools(parentContext.options.tools, agentDefinition)
        },

        // Derive abort signal from parent
        abortSignal: AbortSignal.any([
            parentContext.abortSignal,
            agentDefinition.abortController.signal
        ]),

        // Filter permissions for subagent
        toolPermissionContext: filterPermissions(
            parentContext.toolPermissionContext,
            agentDefinition
        )
    };
}

// Mapping: vQ1→deriveToolUseContext
```

---

## Design Rationale

### Why Three Fork Context Messages?

A single user message with the task description works for simple cases but causes issues with:
1. **Context-dependent tools** - Some tools check conversation history to determine context
2. **System prompt alignment** - The assistant acknowledgment message aligns the LLM with its subagent role
3. **Task clarity** - Separating "who you are" from "what to do" reduces instruction confusion

### Why Clone readFileState Instead of Empty Map?

Starting with an empty `readFileState` would cause the subagent to re-read files it should already know about (because the parent read them in building the task description). Starting with a clone of the parent's state gives the subagent the correct starting knowledge without inheriting future file reads.

### Why Shared setAppState?

If the subagent used an isolated `setAppState`, its hook registrations, skill activations, and permission changes would be lost when it completes. By sharing `setAppState`, the subagent's contributions to session state persist after it terminates. This is intentional - skills invoked in a subagent should remain available in the parent session.
