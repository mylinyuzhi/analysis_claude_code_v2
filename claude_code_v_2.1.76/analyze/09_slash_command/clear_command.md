# `/clear` and `/compact` Commands — Context Management

## Overview

The `/clear` and `/compact` commands manage the conversation context by removing or summarizing message history. Both commands help free up context window space, but they differ in how they preserve information:

- **`/clear`**: Completely removes all messages, starting fresh with an empty conversation
- **`/compact`**: Replaces messages with a generated summary, preserving key information

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Compact, CLI)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `clearCommandHandler` (FiY) - Main `/clear` command handler
- `clearCommandDefinition` (QiY) - `/clear` command definition object
- `clearConversation` (GIA) - Clears all messages from conversation
- `clearSessionCaches` (PIA) - Invalidates session-level caches
- `compactCommandHandler` (PpY) - Main `/compact` command handler
- `compactCommandDefinition` (ZpY) - `/compact` command definition object

---

## `/clear` Command

### Command Definition

**What it does:** Removes all messages from the conversation, starting with a clean slate.

```javascript
// ============================================
// clearCommandDefinition - /clear command definition
// Location: chunks.150.mjs:1308-1321
// ============================================

// ORIGINAL (for source lookup):
_FY = {
    type: "local",
    name: "clear",
    description: "Clear conversation history and free up context",
    aliases: ["reset", "new"],
    isEnabled: () => !0,
    isHidden: !1,
    supportsNonInteractive: !1,
    load: () => Promise.resolve().then(() => (N3q(), v3q)),
    userFacingName() {
        return "clear"
    }
}

// READABLE (for understanding):
const clearCommandDefinition = {
    type: "local",
    name: "clear",
    description: "Clear conversation history and free up context",
    aliases: ["reset", "new"],
    isEnabled: () => true,
    isHidden: false,
    supportsNonInteractive: false,
    load: () => Promise.resolve().then(() => (initializeClearModule(), clearHandlerModule)),
    userFacingName() {
        return "clear"
    }
}

// Mapping: _FY→clearCommandDefinition, N3q→initializeClearModule, v3q→clearHandlerModule
```

**Key features:**
- **Aliases**: `/reset` and `/new` are equivalent to `/clear`
- **Non-interactive restriction**: Cannot be used in `--print` mode or non-interactive sessions
- **Immediate execution**: Type `local` means it runs synchronously without React UI

### Execution Flow

```
/clear
    │
    ▼
parseSlashCommand → { commandName: "clear", args: "" }
    │
    ▼
executeCommand (ifY) → type === "local"
    │
    ▼
clearCommandHandler(args, { setAppState, onDone })
    │
    ├── clearSessionCaches() → Invalidate cached data
    │
    ├── clearConversation() → Remove all messages
    │
    └── onDone("Conversation cleared", { display: "system" })
```

### clearConversation (GIA)

**What it does:** Removes all messages from the conversation state.

**How it works:**
```javascript
async function clearConversation() {
    // Reset message array to empty
    setAppState(prev => ({
        ...prev,
        messages: [],
        // Reset related state
        toolResults: new Map(),
        pendingToolCalls: [],
        lastAssistantMessage: null
    }));
}
```

**Why this approach:**
- Complete reset rather than partial removal ensures no stale references
- Tool results and pending calls must also be cleared to avoid orphaned state
- Memory is immediately freed (no compaction summary overhead)

### clearSessionCaches (PIA)

**What it does:** Invalidates session-level caches that may reference cleared data.

**How it works:**
```javascript
function clearSessionCaches() {
    // Invalidate memoized data that depends on conversation
    clearCommandRegistryCache();
    clearFileCache();
    clearTokenCountCache();
}
```

**Why cache invalidation:** Caches like token counts or file references may point to data that no longer exists after clearing. Invalidating ensures fresh computation on next use.

---

## `/compact` Command

### Command Definition

**What it does:** Replaces the conversation with an AI-generated summary, preserving key information while freeing context space.

```javascript
// ============================================
// compactCommandDefinition - /compact command definition
// Location: chunks.151.mjs:186-200
// ============================================

// ORIGINAL (for source lookup):
ZpY = {
    type: "local",
    name: "compact",
    description: "Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]",
    isEnabled: () => !t6(process.env.DISABLE_COMPACT),
    isHidden: !1,
    supportsNonInteractive: !0,
    argumentHint: "<optional custom summarization instructions>",
    load: () => Promise.resolve().then(() => (T9q(), f9q)),
    userFacingName() {
        return "compact"
    }
}

// READABLE (for understanding):
const compactCommandDefinition = {
    type: "local",
    name: "compact",
    description: "Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]",
    isEnabled: () => !parseBoolean(process.env.DISABLE_COMPACT),
    isHidden: false,
    supportsNonInteractive: true,
    argumentHint: "<optional custom summarization instructions>",
    load: () => Promise.resolve().then(() => (initializeCompactCommand(), compactHandlerModule)),
    userFacingName() {
        return "compact"
    }
}

// Mapping: ZpY→compactCommandDefinition, t6→parseBoolean, T9q→initializeCompactCommand, f9q→compactHandlerModule
```

**Key differences from `/clear`:**
- **DISABLE_COMPACT env var**: Can be disabled via environment variable
- **supportsNonInteractive**: Can be used in `--print` mode for scripting
- **Custom instructions**: Optional argument to guide summarization

### DISABLE_COMPACT Environment Variable

When `DISABLE_COMPACT=true` is set:

1. The `/compact` command shows: `"Compaction is disabled (DISABLE_COMPACT)"`
2. Auto-compaction is also disabled (see [../07_compact/](../07_compact/))
3. Manual `/compact` still works if the env var is not set

**Why this env var:** Enterprise deployments may want to preserve full conversation history for compliance or audit purposes. The env var provides an operator-level control that users cannot override.

### Execution Flow

```
/compact [instructions]
    │
    ▼
parseSlashCommand → { commandName: "compact", args: "instructions" }
    │
    ▼
executeCommand (ifY) → type === "local"
    │
    ▼
compactCommandHandler(instructions, toolUseContext)
    │
    ├── if DISABLE_COMPACT → return error
    │
    ├── buildCompactionContext(messages) → Prepare messages for summary
    │
    ├── generateConversationSummary(messages, instructions) → AI summary
    │
    ├── Replace messages with summary message
    │
    └── Return result with compaction stats
```

### compactCommandHandler (PpY)

**What it does:** Orchestrates the compaction process.

**How it works:**
```javascript
async function compactCommandHandler(customInstructions, toolUseContext) {
    // Check if compaction is disabled
    if (parseBoolean(process.env.DISABLE_COMPACT)) {
        return {
            type: "text",
            value: "Compaction is disabled (DISABLE_COMPACT)"
        };
    }

    // Get current messages
    const messages = getState().messages;

    // Build context for summary generation
    const context = buildCompactionContext(messages);

    // Generate summary via LLM
    const summary = await generateConversationSummary(context, customInstructions);

    // Replace messages with summary
    setAppState(prev => ({
        ...prev,
        messages: [createCompactionSummaryMessage(summary)]
    }));

    return {
        type: "text",
        value: `Compacted ${messages.length} messages into summary.`
    };
}
```

**Why async:** Unlike `/clear`, `/compact` requires an LLM call to generate the summary, making it an async operation.

### Custom Summarization Instructions

Users can provide instructions to guide the summary:

```
/compact Focus on the bug fixes we discussed
/compact Preserve all code snippets
/compact Emphasize the architecture decisions
```

**How instructions are used:**
The instructions string is passed to the summary generation prompt, influencing what the LLM emphasizes in its summary.

---

## Comparison: `/clear` vs `/compact`

| Aspect | `/clear` | `/compact` |
|--------|----------|------------|
| **Result** | Empty conversation | Summary message |
| **Context preserved** | None | Key information retained |
| **Speed** | Instant | Requires LLM call |
| **API cost** | None | One completion |
| **Env var control** | None | DISABLE_COMPACT |
| **Aliases** | `/reset`, `/new` | None |
| **Non-interactive** | No | Yes |

**When to use `/clear`:**
- Starting a completely new task
- Conversation is corrupted or off-track
- No need to preserve any context

**When to use `/compact`:**
- Context is full but work is ongoing
- Need to preserve decisions, findings, or code references
- Want to continue the current task with more context room

---

## Integration with Auto-Compaction

The `/compact` command is related to but separate from the auto-compaction system:

- **Manual `/compact`**: User-triggered, runs immediately
- **Auto-compaction**: Triggered when context reaches threshold (80% by default)

See [../07_compact/](../07_compact/) for details on the auto-compaction system.

**Relationship:**
- Auto-compaction uses the same `compactCommandHandler` internally
- The `DISABLE_COMPACT` env var disables both manual and auto-compaction
- Auto-compaction includes additional safeguards (failure limits, buffer zones)