# Normalization Flow Diagram

> **Module**: System Reminders - Normalization Flow
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.174.mjs:3-469` (normalizeAttachmentForAPI)

---

## Overview

This document visualizes the complete normalization flow, showing how each attachment type is processed through the `normalizeAttachmentForAPI` function and converted into API messages.

---

## High-Level Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ATTACHMENT PRODUCTION                                 │
│                     (_uY - assembleAllAttachments)                          │
│                       chunks.147.mjs:3-18                                    │
│                                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                    │
│  │ User-Depend- │   │ Always-      │   │ Main-Agent-  │                    │
│  │ ent Group    │   │ Computed     │   │ Only Group   │                    │
│  │ (3 producers)│   │ (16+ producers)│  │ (12 producers)│                   │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘                    │
│         │                  │                  │                             │
│         └──────────────────┼──────────────────┘                             │
│                            ▼                                                │
│                    [Attachment Objects]                                     │
│                            │                                                │
└────────────────────────────┼────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      NORMALIZATION LAYER                                     │
│                  (Ui8 - normalizeAttachmentForAPI)                          │
│                     chunks.174.mjs:3-469                                     │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        PRE-SWITCH CHECK                                │  │
│  │                     if (isTeamMode()) { ... }                         │  │
│  │                                                                        │  │
│  │    teammate_mailbox ──────► team_context                              │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                            │                                                │
│                            ▼                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        MAIN SWITCH (57+ cases)                         │  │
│  │                                                                        │  │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │   │ File Types  │  │ IDE Types   │  │ Task Types  │  │ Mode Types  │ │  │
│  │   │ (6 cases)   │  │ (3 cases)   │  │ (4 cases)   │  │ (6 cases)   │ │  │
│  │   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│  │                                                                        │  │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │   │ Memory Types│  │ Hook Types  │  │ Budget Types│  │ Silent Types│ │  │
│  │   │ (5 cases)   │  │ (6 cases)   │  │ (3 cases)   │  │ (9+ cases)  │ │  │
│  │   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                            │                                                │
│                            ▼                                                │
│                    [Message Arrays]                                         │
│                            │                                                │
└────────────────────────────┼────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MESSAGE INJECTION                                    │
│                     (Vf6 - attachmentGenerator)                             │
│                       chunks.147.mjs:822-829                                 │
│                                                                              │
│                    Yield to conversation stream                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Message Construction Patterns

### Pattern A: Tool Call + Result (b5 wrapping)

Used for file/directory types. Creates synthetic tool use messages.

```
Attachment { type: "directory", path: "/src", content: "file1\nfile2" }
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    normalizeAttachmentForAPI                     │
│                                                                  │
│  1. Create tool call message:                                    │
│     nr6(BashTool.name, { command: "ls /src", description: "..."})│
│                                                                  │
│  2. Create tool result message:                                  │
│     ir6(BashTool, { stdout: "file1\nfile2", stderr: "", ... })  │
│                                                                  │
│  3. Wrap both in XML tags:                                       │
│     b5([toolCallMsg, toolResultMsg])                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                    │
                    ▼
[
  {
    type: "user",
    message: { role: "user", content: "Called the Bash tool..." },
    isMeta: true
  },
  {
    type: "user",
    message: { role: "user", content: "Result of calling the Bash tool..." },
    isMeta: true
  }
]
```

### Pattern B: Direct p1 + b5 Wrapping

Used for plan mode, memory types, skill listings.

```
Attachment { type: "nested_memory", path: "MEMORY.md", content: "..." }
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    normalizeAttachmentForAPI                     │
│                                                                  │
│  case "nested_memory":                                           │
│    return b5([p1({                                               │
│      content: `Contents of ${A.content.path}:...`,              │
│      isMeta: true                                                │
│    })])                                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                    │
                    ▼
[
  {
    type: "user",
    message: {
      role: "user",
      content: "<system-reminder>\nContents of MEMORY.md:...\n</system-reminder>"
    },
    isMeta: true
  }
]
```

### Pattern C: Inline af Wrapping

Used for status notifications (token_usage, budget_usd, hook responses).

```
Attachment { type: "token_usage", used: 5000, total: 200000 }
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    normalizeAttachmentForAPI                     │
│                                                                  │
│  case "token_usage":                                             │
│    return [p1({                                                  │
│      content: af(`Token usage: ${A.used}/${A.total}...`),       │
│      isMeta: true                                                │
│    })]                                                           │
│                                                                  │
│  // af() wraps string in <system-reminder> tags inline          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                    │
                    ▼
[
  {
    type: "user",
    message: {
      role: "user",
      content: "<system-reminder>\nToken usage: 5000/200000...\n</system-reminder>"
    },
    isMeta: true
  }
]
```

### Pattern D: Dispatcher Delegation

Used for plan_mode and auto_mode.

```
Attachment { type: "plan_mode", reminderType: "full", ... }
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    normalizeAttachmentForAPI                     │
│                                                                  │
│  case "plan_mode":                                               │
│    return Wzz(A);  // delegate to planModeReminderDispatcher   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                planModeReminderDispatcher (Wzz)                  │
│                                                                  │
│  if (reminderType === "ultraplan-complete")                      │
│    return Zzz(A);  // ultraplanCompleteReminder                 │
│  if (isSubAgent)                                                 │
│    return yzz(A);  // subAgentPlanReminder                      │
│  if (reminderType === "sparse")                                  │
│    return Ezz(A);  // sparsePlanReminder                        │
│  return Nzz(A);     // fullPlanReminder (default)               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                    │
                    ▼
                    [...]
```

---

## Attachment Type Decision Tree

### File Types

```
                    ┌─────────────────────┐
                    │ type: "file"        │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │      content.type?          │
                └──────────────┬──────────────┘
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
    ┌────────────┐      ┌────────────┐      ┌────────────┐
    │ "image"    │      │ "text"     │      │ "notebook" │
    └─────┬──────┘      └─────┬──────┘      └─────┬──────┘
          │                   │                   │
          ▼                   ▼                   ▼
    ┌────────────┐      ┌────────────┐      ┌────────────┐
    │ Synthetic  │      │ Synthetic  │      │ Synthetic  │
    │ Read tool  │      │ Read tool  │      │ Read tool  │
    │ + result   │      │ + result   │      │ + result   │
    │            │      │ + truncate │      │            │
    │ (image in  │      │ msg if     │      │ (notebook  │
    │ result)    │      │ too large) │      │ content)   │
    └────────────┘      └────────────┘      └────────────┘
```

### Plan Mode Types

```
                    ┌─────────────────────┐
                    │ type: "plan_mode"   │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │      reminderType?          │
                └──────────────┬──────────────┘
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
    ┌────────────┐      ┌────────────┐      ┌────────────┐
    │"ultraplan- │      │ "sparse"   │      │ "full"     │
    │ complete"  │      │            │      │ (default)  │
    └─────┬──────┘      └─────┬──────┘      └─────┬──────┘
          │                   │                   │
          ▼                   ▼                   ▼
    ┌────────────┐      ┌────────────┐      ┌────────────┐
    │ Zzz()      │      │ Ezz()      │      │ Nzz()      │
    │ (~150      │      │ (~150      │      │ (~1500     │
    │ tokens)    │      │ tokens)    │      │ tokens)    │
    └────────────┘      └────────────┘      └────────────┘
          │                   │                   │
          │             ┌─────┴─────┐             │
          │             │ isSubAgent│             │
          │             └─────┬─────┘             │
          │                   │                   │
          │                   ▼                   │
          │             ┌────────────┐            │
          │             │ yzz()      │            │
          │             │ (~300      │            │
          │             │ tokens)    │            │
          │             └────────────┘            │
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                              ▼
                       b5([p1({...})])
```

### Hook Response Types

```
                    ┌─────────────────────┐
                    │type: "async_hook_   │
                    │      response"      │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │      response.*?            │
                └──────────────┬──────────────┘
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
    ┌────────────┐      ┌────────────┐      ┌────────────┐
    │systemMessage│     │hookSpecific│      │ (empty)    │
    │            │      │ Output     │      │            │
    └─────┬──────┘      └─────┬──────┘      └─────┬──────┘
          │                   │                   │
          ▼                   ▼                   ▼
    ┌────────────┐      ┌────────────┐      ┌────────────┐
    │ p1({       │      │ p1({       │      │ []         │
    │   content, │      │   content: │      │            │
    │   isMeta   │      │   additional│     │            │
    │ })         │      │   Context  │      │            │
    └────────────┘      └────────────┘      └────────────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                              ▼
                       b5([...])
```

---

## Token Efficiency Analysis

### Plan Mode Reminder Token Costs

| Variant | Function | Approx. Tokens | Use Case |
|---------|----------|----------------|----------|
| Full | Nzz | ~1500 | Initial entry, every 5th reminder |
| Sparse | Ezz | ~150 | Interim reminders |
| Subagent | yzz | ~300 | Subagent in plan mode |
| Ultraplan Complete | Zzz | ~150 | Pre-planned ultraplan session |

### Token Savings with Sparse Reminders

```
Scenario: 20 turns in plan mode

Without sparse:
  20 × 1500 tokens = 30,000 tokens

With sparse (5 full + 15 sparse):
  5 × 1500 + 15 × 150 = 7,500 + 2,250 = 9,750 tokens

Savings: 30,000 - 9,750 = 20,250 tokens (67% reduction)
```

### Silent Types (Zero Token Cost)

These types consume zero tokens because they return `[]`:

| Type | Purpose |
|------|---------|
| `already_read_file` | UI state tracking only |
| `command_permissions` | Internal permission state |
| `edited_image_file` | Binary diff tracking |
| `hook_cancelled` | Hook cancellation logging |
| `hook_error_during_execution` | Error state logging |
| `hook_non_blocking_error` | Non-fatal error logging |
| `hook_system_message` | Internal system messaging |
| `structured_output` | JSON schema validation state |
| `hook_permission_decision` | Permission decision logging |
| `context_efficiency` | Context optimization state |
| `autocheckpointing` | Checkpoint state tracking |
| `background_task_status` | Background process tracking |
| `dynamic_skill` | Skill discovery (no message needed) |

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRODUCER ERROR                            │
│                                                                  │
│  async function Hz(label, producer) {                           │
│    try {                                                         │
│      let result = await producer();                             │
│      // ...telemetry...                                          │
│      return result;                                              │
│    } catch (error) {                                             │
│      // Log error but return []                                  │
│      _6(error);           // Log to error handler                │
│      jV(`Attachment error in ${label}`, error);                  │
│      return [];           // Fail safe: empty array              │
│    }                                                             │
│  }                                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NORMALIZATION ERROR                          │
│                                                                  │
│  Unknown type handling:                                          │
│    default:                                                      │
│      jV("normalizeAttachmentForAPI",                            │
│          Error(`Unknown attachment type: ${type}`));            │
│      return [];           // Forward compatibility              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     TIMEOUT HANDLING                             │
│                                                                  │
│  1-second global timeout:                                        │
│    let abortController = sK();                                   │
│    setTimeout((ctrl) => ctrl.abort(), 1000, abortController);   │
│                                                                  │
│  Producers check abort signal:                                   │
│    if (abortController.signal.aborted) return [];               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Source Locations

| Function | Obfuscated | Location |
|----------|------------|----------|
| `assembleAllAttachments` | _uY | chunks.147.mjs:3-18 |
| `timedAttachmentProducer` | Hz | chunks.147.mjs:20-46 |
| `normalizeAttachmentForAPI` | Ui8 | chunks.174.mjs:3-469 |
| `wrapWithSystemReminderTags` | b5 | chunks.173.mjs:2496-2523 |
| `wrapInXmlTag` | af | chunks.173.mjs:2490-2494 |
| `createUserMessage` | p1 | chunks.173.mjs:1378-1412 |
| `createToolCallMessage` | nr6 | chunks.174.mjs:490-495 |
| `createToolResultMessage` | ir6 | chunks.174.mjs:471-488 |
| `attachmentGenerator` | Vf6 | chunks.147.mjs:822-829 |

---

## Related Documents

- [implementation_details.md](./implementation_details.md) - Core function implementations
- [attachment_producers.md](./attachment_producers.md) - Producer function analysis
- [reminder_types.md](./reminder_types.md) - Complete type catalog
- [quick_reference.md](./quick_reference.md) - Quick lookup index