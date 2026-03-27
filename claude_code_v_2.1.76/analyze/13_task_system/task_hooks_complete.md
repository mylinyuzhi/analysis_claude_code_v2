# Task Hooks Complete Analysis (Claude Code 2.1.76)

> Complete analysis of TaskCompleted hooks for pre-completion validation.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Task System section)

Key functions:
- `executeTaskCompletedHooks` (Hi6) - Hook execution - chunks.175.mjs:2594
- `getTaskCompletedHookMessage` ($i6) - Hook message - chunks.175.mjs:1602

---

## Overview

TaskCompleted hooks run before a task is marked as completed, allowing validation, verification, and custom logic to block or approve completion.

---

## Hook Execution Flow

```
TaskUpdate(status: "completed") called
  │
  ├─→ Load task from disk
  │
  ├─→ Execute TaskCompleted hooks (Hi6)
  │     ├─→ Hook 1: Validation check
  │     ├─→ Hook 2: Verification check
  │     └─→ Hook N: Custom logic
  │
  ├─→ If any hook fails:
  │     └─→ Return error, task stays in_progress
  │
  └─→ If all hooks pass:
        └─→ Update task status to completed
```

---

## Hook Implementation

```javascript
// ============================================
// Hi6 (executeTaskCompletedHooks) - Hook execution
// Location: chunks.175.mjs:2594
// ============================================

async function* executeTaskCompletedHooks(
    taskId,
    subject,
    description,
    toolUseContext,
    canUseTool,
    signal,
    options,
    sessionContext
) {
    // Get all registered TaskCompleted hooks
    const hooks = getHooksForEvent("TaskCompleted");

    for (const hook of hooks) {
        if (signal?.aborted) {
            yield { type: "cancelled" };
            return;
        }

        try {
            const result = await hook.handler({
                taskId,
                subject,
                description,
                toolUseContext
            });

            // Hook can block completion
            if (result.block) {
                yield {
                    type: "blocked",
                    message: result.message,
                    hookName: hook.name
                };
                return;
            }

            // Hook can add context
            if (result.message) {
                yield {
                    type: "message",
                    message: result.message
                };
            }

        } catch (error) {
            yield {
                type: "error",
                error: error,
                hookName: hook.name
            };
        }
    }

    // All hooks passed
    yield { type: "passed" };
}
```

---

## Hook Return Values

```javascript
// Hook can return:
{
    // Block completion with message
    block: true,
    message: "Tests must pass before task completion"
}

// Or just add context
{
    message: "Running validation..."
}

// Or allow completion
{} // Empty object = passed
```

---

## Integration Points

### Hooks (11)

- TaskCompleted event registration
- Handler execution with context

### Task System (13)

- Hook execution before status change
- Error handling and rollback

### System Reminder (04)

- Hook messages as attachments
- Blocking errors displayed

---

## Quick Reference

### Hook Event

```javascript
{
    event: "TaskCompleted",
    handler: async (context) => {
        const { taskId, subject, description } = context;
        // Validation logic
        return { block: false }; // or { block: true, message: "..." }
    }
}
```

### Key Symbols

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| Hi6 | executeTaskCompletedHooks | Execute hooks |
| $i6 | getTaskCompletedHookMessage | Format message |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Enhanced hook context |
| 2.1.32 | Initial TaskCompleted hooks |