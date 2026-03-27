# AskUserQuestion Tool Complete Analysis (Claude Code 2.1.76)

> Complete analysis of the AskUserQuestion tool for gathering user input during planning and execution.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)

Key symbols:
- `Fw` = "AskUserQuestion" - Tool name constant - chunks.90.mjs:3123
- `AskUserQuestionTool` - Tool object definition

---

## Overview

AskUserQuestion is a specialized tool for interactive clarification during planning and execution. It presents multi-choice questions to users and collects their responses.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                  ASKUSERQUESTION FLOW                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Agent calls AskUserQuestion                                         │
│       │                                                               │
│       ▼                                                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Input Schema Validation                                        │  │
│  │                                                                 │  │
│  │  questions: [                                                  │  │
│  │    {                                                           │  │
│  │      question: "Which approach?",                              │  │
│  │      header: "Approach",                                       │  │
│  │      options: [                                                │  │
│  │        { label: "OAuth", description: "..." },                 │  │
│  │        { label: "JWT", description: "..." }                    │  │
│  │      ],                                                        │  │
│  │      multiSelect: false                                        │  │
│  │    }                                                           │  │
│  │  ]                                                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│       │                                                               │
│       ▼                                                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ UI Rendering (chunks.196.mjs)                                  │  │
│  │                                                                 │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ Which approach?                                         │  │  │
│  │  │                                                         │  │  │
│  │  │ [1] OAuth - Recommended for social login               │  │  │
│  │  │ [2] JWT - Simple token-based auth                       │  │  │
│  │  │                                                         │  │  │
│  │  │ [Enter] to select                                       │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│       │                                                               │
│       ▼                                                               │
│  Response returned to agent                                          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Input Schema

```javascript
// ============================================
// AskUserQuestion input schema
// ============================================

const askUserQuestionSchema = z.object({
    questions: z.array(z.object({
        question: z.string().min(1).describe("The complete question to ask"),
        header: z.string().max(12).describe("Short label displayed as chip/tag"),
        options: z.array(z.object({
            label: z.string().describe("Display text for the option"),
            description: z.string().optional().describe("Explanation of the option"),
            preview: z.string().optional().describe("Preview content when focused")
        })).min(2).max(4),
        multiSelect: z.boolean().describe("Allow multiple selections")
    })).min(1).max(4)
});
```

---

## Response Format

```javascript
// User response structure
{
    answers: {
        "Which approach?": "OAuth"  // question → selected option
    },
    annotations: {
        "Which approach?": {
            notes: "User added custom notes",
            preview: "Preview content if available"
        }
    }
}
```

---

## Usage in Plan Mode

### When to Use

1. **Clarify ambiguity** - Multiple valid approaches exist
2. **Gather preferences** - User preferences affect implementation
3. **Make decisions** - Need user input before proceeding
4. **Offer choices** - Present options to the user

### When NOT to Use

- Asking "Is this plan okay?" - Use ExitPlanMode instead
- Simple yes/no questions - Use natural language
- Information gathering - Use Read/Grep tools

---

## Integration Points

### Plan Mode (12)

- Primary tool for interview phase
- Used before finalizing plan
- Can be called multiple times

### System Reminder (04)

- Question state tracked in session
- Response stored for context

### UI (02)

- Rendered as modal dialog
- Priority 4 in modal stack

---

## Quick Reference

### Tool Name

```javascript
TOOL_NAME_ASK_USER_QUESTION = "AskUserQuestion"  // Fw
```

### Modal Priority

| Priority | Modal |
|----------|-------|
| 3 | `tool-permission` |
| **4** | **`prompt` (AskUserQuestion)** |
| 5 | `worker-sandbox-permission` |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Preview support, annotations |
| 2.1.72 | Multi-question support |
| 2.1.18 | Initial implementation |