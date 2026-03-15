# Plan Mode - Hooks Integration (Claude Code 2.1.38)

> Analysis of how hooks interact with plan mode, including PreCompact hook execution and hook filtering during planning.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `mW6` (chunks.141.mjs:3011) - `executePreCompactHooks` - PreCompact hook execution
- `JZY` (chunks.129.mjs:774) - `PreCompactPayloadSchema` - Hook event schema
- `AyA` (chunks.141.mjs:2691) - `executeHooks` - Generic hook execution
- `aX` (chunks.129.mjs) - `buildBaseHookPayload` - Base payload builder

---

## 1. Overview: Hooks in Plan Mode Context

Hooks can fire during plan mode, but some have special behavior. The most significant is the PreCompact hook, which runs before conversation compaction regardless of mode.

```
┌─────────────────────────────────────────────────────────────────┐
│                  Hooks Interaction with Plan Mode                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Hook Types That Fire in Plan Mode:                            │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ • PreToolUse - Before each tool call                        ││
│  │ • PostToolUse - After tool succeeds                         ││
│  │ • PostToolUseFailure - After tool fails                     ││
│  │ • UserPromptSubmit - When user sends message                ││
│  │ • PreCompact - Before conversation compaction               ││
│  │ • SessionEnd - When session ends                            ││
│  │ • Notification - For notification events                    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Plan Mode Specific Behavior:                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ • Tool filtering applies to PreToolUse hooks               ││
│  │ • Read-only enforcement may block hook actions             ││
│  │ • ExitPlanMode requires approval before hooks run          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. PreCompact Hook Execution (`mW6`)

The PreCompact hook is executed before any compaction, whether manual or automatic:

```javascript
// ============================================
// mW6 - executePreCompactHooks
// Location: chunks.141.mjs:3011-3040
// ============================================

// ORIGINAL (for source lookup):
async function mW6(A, q, K = MP) {
    let Y = {
            ...aX(void 0),
            hook_event_name: "PreCompact",
            trigger: A.trigger,
            custom_instructions: A.customInstructions
        },
        z = await AyA({
            hookInput: Y,
            matchQuery: A.trigger,
            signal: q,
            timeoutMs: K
        });
    if (z.length === 0) return {};
    let w = z.filter(($) => $.succeeded && $.output.trim().length > 0).map(($) => $.output.trim()),
        H = [];
    for (let $ of z)
        if ($.succeeded)
            if ($.output.trim()) H.push(`PreCompact [${$.command}] completed successfully: ${$.output.trim()}`);
            else H.push(`PreCompact [${$.command}] completed successfully`);
    else if ($.output.trim()) H.push(`PreCompact [${$.command}] failed: ${$.output.trim()}`);
    else H.push(`PreCompact [${$.command}] failed`);
    return {
        newCustomInstructions: w.length > 0 ? w.join(`

`) : void 0,
        userDisplayMessage: H.length > 0 ? H.join(`
`) : void 0
    }
}

// READABLE (for understanding):
async function executePreCompactHooks(hookInput, signal, timeoutMs = DEFAULT_TIMEOUT) {
    // Step 1: Build the hook payload
    let payload = {
        ...buildBaseHookPayload(undefined),  // Base fields (session_id, etc.)
        hook_event_name: "PreCompact",
        trigger: hookInput.trigger,          // "manual" or "auto"
        custom_instructions: hookInput.customInstructions
    };

    // Step 2: Execute all matching PreCompact hooks
    let hookResults = await executeHooks({
        hookInput: payload,
        matchQuery: hookInput.trigger,  // Match hooks on trigger type
        signal: signal,
        timeoutMs: timeoutMs
    });

    // Step 3: If no hooks configured, return empty
    if (hookResults.length === 0) {
        return {};
    }

    // Step 4: Collect successful outputs for custom instructions
    let newCustomInstructions = hookResults
        .filter((result) => result.succeeded && result.output.trim().length > 0)
        .map((result) => result.output.trim());

    // Step 5: Build user display messages
    let userMessages = [];
    for (let result of hookResults) {
        if (result.succeeded) {
            if (result.output.trim()) {
                userMessages.push(
                    `PreCompact [${result.command}] completed successfully: ${result.output.trim()}`
                );
            } else {
                userMessages.push(`PreCompact [${result.command}] completed successfully`);
            }
        } else {
            if (result.output.trim()) {
                userMessages.push(`PreCompact [${result.command}] failed: ${result.output.trim()}`);
            } else {
                userMessages.push(`PreCompact [${result.command}] failed`);
            }
        }
    }

    // Step 6: Return combined results
    return {
        newCustomInstructions: newCustomInstructions.length > 0
            ? newCustomInstructions.join("\n\n")
            : undefined,
        userDisplayMessage: userMessages.length > 0
            ? userMessages.join("\n")
            : undefined
    };
}

// Mapping: mW6→executePreCompactHooks, A→hookInput, q→signal, K→timeoutMs
//          aX→buildBaseHookPayload, AyA→executeHooks, z→hookResults
//          w→newCustomInstructions, H→userMessages
```

### Key Decision: Why Return Custom Instructions?

**What it does:** Returns `newCustomInstructions` from hook output.

**Why this approach:**
1. **Flexibility**: Hooks can inject context into the compaction prompt
2. **User control**: Custom instructions let users guide summarization
3. **Dynamic behavior**: Hooks can change behavior based on session state

**Key insight:** The `newCustomInstructions` output allows hooks to provide additional context that should be considered during compaction, such as emphasizing certain topics or preserving specific details.

---

## 3. PreCompact Payload Schema (`JZY`)

```javascript
// ============================================
// JZY - PreCompactPayloadSchema
// Location: chunks.129.mjs:774-778
// ============================================

// ORIGINAL (for source lookup):
JZY = gZ.and(u.object({
    hook_event_name: u.literal("PreCompact"),
    trigger: u.enum(["manual", "auto"]),
    custom_instructions: u.string().nullable()
}))

// READABLE (for understanding):
const PreCompactPayloadSchema = baseSchema.and(z.object({
    hook_event_name: z.literal("PreCompact"),
    trigger: z.enum(["manual", "auto"]),
    custom_instructions: z.string().nullable()
}));

// Mapping: JZY→PreCompactPayloadSchema, gZ→baseSchema, u→zod
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `hook_event_name` | `"PreCompact"` | Event type identifier |
| `trigger` | `"manual" \| "auto"` | What triggered compaction |
| `custom_instructions` | `string \| null` | User-provided instructions |

### Trigger Types

| Trigger | When It Occurs |
|---------|----------------|
| `manual` | User ran `/compact` command |
| `auto` | System triggered due to context limit |

---

## 4. PreCompact Hook Execution in Compaction Flow

```javascript
// ============================================
// Compaction flow with PreCompact hooks
// Location: chunks.146.mjs:2447-2456
// ============================================

// ORIGINAL (for source lookup):
K.onCompactProgress?.({
    type: "hooks_start",
    hookType: "pre_compact"
}), K.setSDKStatus?.("compacting");
let O = await mW6({
        trigger: "manual",
        customInstructions: null
    }, K.abortController.signal),
    _;
if (O.newCustomInstructions && z) _ = `${O.newCustomInstructions}

User context: ${z}`;
else if (O.newCustomInstructions) _ = O.newCustomInstructions;
else if (z) _ = `User context: ${z}`;

// READABLE (for understanding):
async function performPartialCompaction(context, customInstructions) {
    // Step 1: Notify UI that hooks are starting
    context.onCompactProgress?.({
        type: "hooks_start",
        hookType: "pre_compact"
    });

    // Step 2: Update SDK status
    context.setSDKStatus?.("compacting");

    // Step 3: Execute PreCompact hooks
    let hookResults = await executePreCompactHooks({
        trigger: "manual",
        customInstructions: null
    }, context.abortController.signal);

    // Step 4: Merge custom instructions
    let mergedInstructions;
    if (hookResults.newCustomInstructions && customInstructions) {
        mergedInstructions = `${hookResults.newCustomInstructions}\n\nUser context: ${customInstructions}`;
    } else if (hookResults.newCustomInstructions) {
        mergedInstructions = hookResults.newCustomInstructions;
    } else if (customInstructions) {
        mergedInstructions = `User context: ${customInstructions}`;
    }

    // Step 5: Continue with compaction using merged instructions...
}

// Mapping: mW6→executePreCompactHooks, O→hookResults, _→mergedInstructions, z→customInstructions
```

---

## 5. PreCompact Hook in Plan Mode

### When PreCompact Fires During Plan Mode

```
Plan Mode Active
    │
    ├─ Context limit reached
    │   │
    │   └─ Auto-compact triggered
    │       │
    │       ├─ mW6() called with trigger: "auto"
    │       │
    │       ├─ Hooks execute
    │       │   └─ Hook output can include plan-specific instructions
    │       │
    │       └─ Compaction proceeds
    │           └─ jZ6() preserves plan file
    │
    └─ User runs /compact
        │
        └─ Manual compact triggered
            │
            ├─ mW6() called with trigger: "manual"
            │
            └─ Compaction proceeds
```

### Hook Output Impact on Plan Mode

Hook output can affect compaction behavior:

| Hook Output | Impact |
|-------------|--------|
| `newCustomInstructions` | Added to compaction prompt |
| `userDisplayMessage` | Shown to user in UI |

**Example hook output for plan mode:**

```javascript
// Hook script could output:
console.log("Preserve the planning context and emphasize any uncommitted decisions.");

// This becomes newCustomInstructions, which influences the summary generation
```

---

## 6. Other Hooks in Plan Mode

### PreToolUse Hooks

PreToolUse hooks fire before each tool call in plan mode:

```javascript
// ============================================
// PreToolUse hook flow in plan mode
// ============================================

// Pseudocode of the flow:
async function handleToolCall(tool, input, context) {
    // Step 1: Check if tool is allowed in plan mode
    if (context.mode === "plan" && !tool.isReadOnly(input)) {
        // Tool blocked by plan mode
        return { blocked: true, reason: "plan_mode_read_only" };
    }

    // Step 2: Execute PreToolUse hooks
    let hookResult = await executePreToolUseHooks(tool.name, input);

    // Step 3: Handle hook decisions
    if (hookResult.permissionDecision === "deny") {
        return { blocked: true, reason: hookResult.message };
    }

    // Step 4: Execute tool
    let result = await tool.call(input, context);

    // Step 5: Execute PostToolUse hooks
    await executePostToolUseHooks(tool.name, input, result);

    return result;
}
```

### SessionStart and Setup Hooks

These hooks fire when entering plan mode via `EnterPlanMode`:

| Hook Event | When It Fires | Plan Mode Context |
|------------|---------------|-------------------|
| `SessionStart` | New session begins | Before mode is set |
| `Setup` | Agent initialization | Before mode is set |
| `UserPromptSubmit` | User sends message | With current mode context |

### Notification Hooks

Can be triggered during plan mode for status updates:

```javascript
// ============================================
// Notification hook in plan mode
// Location: chunks.141.mjs:2877-2886
// ============================================

// ORIGINAL (for source lookup):
let w = {
    ...aX(void 0),
    hook_event_name: "Notification",
    message: K,
    title: Y,
    notification_type: z
};
await AyA({
    hookInput: w,
    timeoutMs: q,
    matchQuery: z
})

// READABLE (for understanding):
async function triggerNotificationHook(message, title, notificationType) {
    let payload = {
        ...buildBaseHookPayload(undefined),
        hook_event_name: "Notification",
        message: message,
        title: title,
        notification_type: notificationType
    };

    await executeHooks({
        hookInput: payload,
        timeoutMs: DEFAULT_TIMEOUT,
        matchQuery: notificationType
    });
}
```

---

## 7. Hook Filtering in Plan Mode

### Read-Only Enforcement for Hooks

Hooks that attempt to modify state during plan mode may be blocked:

| Hook Action | Blocked in Plan Mode? | Reason |
|-------------|----------------------|--------|
| Read file content | No | Read-only |
| Write to file | Yes | Modification blocked |
| Execute shell command | Depends | Only read-only commands allowed |
| Update permission rules | No | Metadata update, not code change |

### Hook Configuration Example

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "auto",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Preserve planning decisions'"
          }
        ]
      }
    ]
  }
}
```

---

## 8. PreCompact Hook Response Schema

The hook can return specific outputs that affect behavior:

```javascript
// ============================================
// PreCompact hook response types
// Location: chunks.129.mjs:791-841
// ============================================

// READABLE (for understanding):
const HookResponseSchema = z.object({
    // Continue or stop the operation
    continue: z.boolean().optional(),
    // Suppress output from display
    suppressOutput: z.boolean().optional(),
    // Custom stop reason
    stopReason: z.string().optional(),
    // Decision (for approval hooks)
    decision: z.enum(["approve", "block"]).optional(),
    // System message to inject
    systemMessage: z.string().optional(),
    // Reason for the decision
    reason: z.string().optional(),
    // Hook-specific output
    hookSpecificOutput: z.union([
        PreToolUseOutput,
        UserPromptSubmitOutput,
        SessionStartOutput,
        SetupOutput,
        SubagentStartOutput,
        PostToolUseOutput,
        PostToolUseFailureOutput,
        NotificationOutput,
        PermissionRequestOutput
    ]).optional()
});
```

### PreCompact-Specific Behavior

PreCompact hooks don't have a specific `hookSpecificOutput` type. Instead, they use the standard output:

```
Hook stdout → newCustomInstructions (if non-empty)
Hook exit code → success/failure status
Hook stderr → error message
```

---

## 9. Hook Execution During Plan Mode Exit

When `ExitPlanMode` is called, hooks fire in this order:

```
ExitPlanMode called
    │
    ├─ PreToolUse hook (if hook configuration exists)
    │
    ├─ Permission check
    │   └─ May require user/swarm approval
    │
    ├─ If approved:
    │   ├─ Mode changes from "plan" to target mode
    │   ├─ PostToolUse hook fires
    │   └─ Plan mode exit attachment generated
    │
    └─ If rejected:
        ├─ PostToolUseFailure hook fires
        └─ Mode stays as "plan"
```

---

## 10. Interaction with Other Plan Mode Systems

### Plan Mode Reminder System

Hooks can interact with the reminder system:

```javascript
// During ihY() - buildPlanModeAttachments
// Hooks are NOT directly involved, but hook output from
// earlier turns may have added context that affects
// what the reminder contains
```

### Task System Integration

When tasks are created during plan mode:

```javascript
// TaskCompleted hook fires when a background agent finishes
// This happens even in plan mode, as background agents
// may have been spawned before entering plan mode

// From chunks.129.mjs:782-789
DZY = gZ.and(u.object({
    hook_event_name: u.literal("TaskCompleted"),
    task_id: z.string(),
    task_subject: z.string(),
    task_description: z.string().optional(),
    teammate_name: z.string().optional(),
    team_name: z.string().optional()
}));
```

---

## Summary: Hooks in Plan Mode

| Hook Event | Fires in Plan Mode? | Special Behavior |
|------------|---------------------|------------------|
| `PreToolUse` | Yes | Read-only enforcement applies |
| `PostToolUse` | Yes | Normal behavior |
| `PostToolUseFailure` | Yes | Normal behavior |
| `UserPromptSubmit` | Yes | Normal behavior |
| `PreCompact` | Yes | Can provide custom instructions |
| `SessionEnd` | Yes | Normal behavior |
| `Notification` | Yes | Normal behavior |
| `TaskCompleted` | Yes | Normal behavior |
| `SubagentStart` | Yes | Normal behavior |
| `SubagentStop` | Yes | Normal behavior |
| `Setup` | Yes | Fires before mode is set |
| `SessionStart` | Yes | Fires before mode is set |

### Key Integration Points

1. **PreCompact**: Most significant hook for plan mode - allows injecting context before compaction
2. **Tool Filtering**: PreToolUse hooks still fire but read-only enforcement applies
3. **Mode Transitions**: Hooks fire before and after mode changes
4. **Background Tasks**: TaskCompleted hooks fire even during plan mode