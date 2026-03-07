# Skill-Compact Interaction - Summary (Claude Code 2.1.38)

## Overview

Skills interact with the context compaction system through the **State Preservation** mechanism. When compaction occurs, invoked skills are preserved and re-injected into the post-compaction conversation, ensuring the LLM maintains awareness of active skill behaviors.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skill System, Compact sections)
> - [07_compact/state_preservation.md](../07_compact/state_preservation.md) - Full compaction state preservation

Key functions:
- `collectSkillsToKeep` (da4) - Preserves invoked skills - chunks.146.mjs:2710-2722
- `getInvokedSkills` (zR6) - Get invoked skills map - chunks.1.mjs:2964-2973
- `recordSkillInvocation` - Records skill invocation for preservation

---

## Key Insight

**Skill prompts are NOT compacted like regular messages.** Instead, skill invocations are tracked in a separate `invokedSkills` Map and preserved across compaction boundaries via the State Anchoring pattern.

---

## Skill Preservation During Compaction

### How It Works

```
Before Compaction:
┌─────────────────────────────────────────────────────────┐
│ Conversation History                                      │
│ ├── System prompt                                        │
│ ├── User: "Create a commit"                              │
│ ├── Assistant: [invokes /commit skill]                   │
│ ├── Tool: Skill "commit"                                 │
│ │   └── Prompt: "Create a git commit..."                 │
│ ├── Assistant: [commit message]                          │
│ ├── ...many more messages...                             │
│ └── [Context full]                                       │
└─────────────────────────────────────────────────────────┘
        │
        ▼
Compaction Triggered
        │
        ▼
State Collection Phase:
┌─────────────────────────────────────────────────────────┐
│ collectSkillsToKeep() is called:                        │
│                                                          │
│ 1. getInvokedSkills() returns Map of invoked skills     │
│ 2. Sort by invocation timestamp (most recent first)     │
│ 3. Create attachment: { type: "invoked_skills", skills }│
└─────────────────────────────────────────────────────────┘
        │
        ▼
After Compaction:
┌─────────────────────────────────────────────────────────┐
│ New Conversation History                                  │
│ ├── Summary: "User worked on creating a commit..."      │
│ ├── [Attachment: invoked_skills]                         │
│ │   └── Skills restored (commit)                        │
│ ├── [Attachment: files]                                  │
│ │   └── Files recently read...                          │
│ └── ...continues from summary...                         │
└─────────────────────────────────────────────────────────┘
```

### invoked_skills Attachment Structure

```typescript
interface InvokedSkillsAttachment {
    type: "invoked_skills";
    skills: Array<{
        name: string;      // Skill name (e.g., "commit")
        path: string;      // Path to SKILL.md file
        content: string;   // Full skill content
    }>;
}
```

### Rendering in System Reminder

The `invoked_skills` attachment is rendered in chunks.173.mjs:823-827:

```javascript
case "invoked_skills": {
    if (A.skills.length === 0) return null;
    let w = A.skills.map((H) => H.name).join(", ");
    return React.createElement(CompactText, null, "Skills restored (", w, ")")
}
```

---

## Invocation Tracking

### Recording Skill Invocation

When a skill is invoked (via SkillTool or slash command), it's recorded in the global `invokedSkills` Map:

```javascript
// chunks.1.mjs:2964-2973
function recordSkillInvocation(skillId, skillName, skillPath, content) {
    globalState.invokedSkills.set(skillId, {
        skillName,
        skillPath,
        content,
        invokedAt: Date.now()
    });
    return globalState.invokedSkills;
}

function getInvokedSkills() {
    return globalState.invokedSkills;
}

function clearInvokedSkills() {
    globalState.invokedSkills.clear();
}
```

### When Skills Are Recorded

Skills are recorded when:
1. **SkillTool.call()** is executed (LLM invokes skill)
2. **Slash command** is processed (user invokes skill)
3. **Skill invocation succeeds** (not on validation failure)

---

## Design Rationale

### Why Preserve Skills Separately?

1. **Behavior Continuity:** Skills define custom behaviors; losing them would cause inconsistent behavior
2. **Token Efficiency:** Only skill metadata is preserved, not the entire conversation about the skill
3. **Re-invocation:** LLM can suggest re-invoking skills based on preserved context

### Why Full Content?

The skill content is preserved (not just name/path) because:
1. **Reference:** LLM can explain skill behavior without re-reading file
2. **Execution:** Enables context-aware suggestions
3. **Debugging:** User can see what skill was active

### Why Recency Sorting?

Most recently invoked skills are likely most relevant to current work, helping the LLM:
1. Understand current workflow context
2. Suggest relevant follow-up actions
3. Maintain conversation continuity

---

## Comparison with Other State Types

| State Type | Collector | Budget | Preservation |
|------------|-----------|--------|--------------|
| Files | `collectFilesToKeep` | 50k tokens | Top 5 most recent |
| Tasks | `collectTasksToKeep` | Unlimited | All active/recent |
| Plans | `collectPlanToKeep` | Unlimited | Active plan file |
| **Skills** | `collectSkillsToKeep` | **Unlimited** | **All invoked** |
| Todos | `collectTodosToKeep` | Unlimited | All items |

**Key difference:** Skills have no token budget limit and preserve all invoked skills. This is because:
1. Skill invocations are typically small in number
2. Skill content is critical for behavior consistency
3. The Map deduplicates by skill ID

---

## Interaction with Other Features

### Skill Tool Integration

When the SkillTool is invoked:
1. Skill is added to `invokedSkills` Map
2. Skill content is stored for preservation
3. On compaction, skill is preserved via `collectSkillsToKeep()`

### Hook Mechanism

Skills with hooks are preserved, and their hooks remain active after compaction because:
1. Hooks are registered in session state
2. Session state survives compaction
3. Hook registration is separate from conversation history

### System Reminder

After compaction, the `invoked_skills` attachment appears as a system reminder, showing:
```
Skills restored (commit, review-pr)
```

---

## References

- **Full documentation:** [07_compact/state_preservation.md](../07_compact/state_preservation.md)
- **File tracker:** [07_compact/file_tracker.md](../07_compact/file_tracker.md)
- **Standard compaction:** [07_compact/standard_compaction.md](../07_compact/standard_compaction.md)

---

## Summary

The skill-compact interaction follows the **State Anchoring** pattern:

1. **Tracking:** Skill invocations are recorded in `invokedSkills` Map
2. **Preservation:** `collectSkillsToKeep()` collects all invoked skills
3. **Re-injection:** Skills are added as `invoked_skills` attachment post-compaction
4. **Continuity:** LLM maintains awareness of active skill behaviors

This ensures that skill-based custom behaviors persist across compaction boundaries, maintaining session continuity and behavior consistency.