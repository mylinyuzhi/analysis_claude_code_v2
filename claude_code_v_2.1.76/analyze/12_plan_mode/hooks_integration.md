# Plan Mode - Hooks Integration (Claude Code 2.1.76)

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
│  │ • PostCompact - After compaction completes                  ││
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
        newCustomInstructions: w.length > 0 ? w.join(`\n\n`) : void 0,
        userDisplayMessage: H.length > 0 ? H.join(`\n`) : void 0
    }
}

// READABLE (for understanding):
async function executePreCompactHooks(hookInput, signal, timeoutMs = DEFAULT_TIMEOUT) {
    let payload = {
        ...buildBaseHookPayload(undefined),
        hook_event_name: "PreCompact",
        trigger: hookInput.trigger,
        custom_instructions: hookInput.customInstructions
    };

    let hookResults = await executeHooks({
        hookInput: payload,
        matchQuery: hookInput.trigger,
        signal: signal,
        timeoutMs: timeoutMs
    });

    if (hookResults.length === 0) return {};

    let newCustomInstructions = hookResults
        .filter((result) => result.succeeded && result.output.trim().length > 0)
        .map((result) => result.output.trim());

    let userMessages = [];
    for (let result of hookResults) {
        if (result.succeeded) {
            if (result.output.trim()) {
                userMessages.push(`PreCompact [${result.command}] completed successfully: ${result.output.trim()}`);
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

    return {
        newCustomInstructions: newCustomInstructions.length > 0 ? newCustomInstructions.join("\n\n") : undefined,
        userDisplayMessage: userMessages.length > 0 ? userMessages.join("\n") : undefined
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

## 4. Other Hooks in Plan Mode

### PreToolUse Hooks

PreToolUse hooks fire before each tool call in plan mode. Plan mode's read-only restriction applies before the hook's permission decision, so hooks cannot override the read-only restriction to allow writes.

### PostCompact Hook (v2.1.76)

The new PostCompact hook fires after compaction completes. This is useful for:
- Restoring state that was lost during compaction
- Logging that compaction occurred
- Injecting context into the new context window

### SessionStart and Setup Hooks

These hooks fire when entering plan mode via `EnterPlanMode`:

| Hook Event | When It Fires | Plan Mode Context |
|------------|---------------|-------------------|
| `SessionStart` | New session begins | Before mode is set |
| `Setup` | Agent initialization | Before mode is set |
| `UserPromptSubmit` | User sends message | With current mode context |

---

## 5. Hook Filtering in Plan Mode

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

## 6. Summary: Hooks in Plan Mode

| Hook Event | Fires in Plan Mode? | Special Behavior |
|------------|---------------------|------------------|
| `PreToolUse` | Yes | Read-only enforcement applies |
| `PostToolUse` | Yes | Normal behavior |
| `PostToolUseFailure` | Yes | Normal behavior |
| `UserPromptSubmit` | Yes | Normal behavior |
| `PreCompact` | Yes | Can provide custom instructions |
| `PostCompact` | Yes | Post-compaction restoration (v2.1.76) |
| `SessionEnd` | Yes | Normal behavior |
| `Notification` | Yes | Normal behavior |
| `TaskCompleted` | Yes | Normal behavior |
| `SubagentStart` | Yes | Normal behavior |
| `SubagentStop` | Yes | Normal behavior |
| `Setup` | Yes | Fires before mode is set |
| `SessionStart` | Yes | Fires before mode is set |

### Key Integration Points

1. **PreCompact**: Most significant hook for plan mode - allows injecting context before compaction
2. **PostCompact** (v2.1.76): New hook for post-compaction restoration in plan mode
3. **Tool Filtering**: PreToolUse hooks still fire but read-only enforcement applies
4. **Mode Transitions**: Hooks fire before and after mode changes
5. **Background Tasks**: TaskCompleted hooks fire even during plan mode
