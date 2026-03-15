# Skill-Reminder Integration - Deep Analysis (Claude Code 2.1.76)

## Overview

The Skill-Reminder Integration describes how skills are discovered and presented to the LLM through system-reminder messages, and how the `InstructionsLoaded` hook fires when skill instructions are injected.

**v2.1.76 additions:**
- `InstructionsLoaded` hook event fires when skill instructions are injected into the conversation

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skill System section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (System Reminder section)

Key functions in this document:
- `getSkillsForLLMInvocation` (hv) - Filters skills visible to LLM - chunks.168.mjs:2307-2308
- `generateSkillListingAttachment` (OIY) - Creates skill_listing attachment - chunks.142.mjs:2381-2395
- `formatSkillListing` (BU7) - Formats skills for display - chunks.87.mjs:2757-2777
- `getSkillRegistry` (cZ) - Gets all registered skills - chunks.168.mjs:2292-2306

---

## Architecture Overview

```
Skill-Reminder Integration Flow
───────────────────────────────

                    ┌──────────────────────────────────┐
                    │         Session Start            │
                    └──────────────────────────────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────────┐
                    │     phY() - Attachment Generator  │
                    │   (chunks.142.mjs:1948)          │
                    └──────────────────────────────────┘
                                    │
                                    ▼
              ┌─────────────────────────────────────────────┐
              │  OIY() - generateSkillListingAttachment()   │
              │  (chunks.142.mjs:2381)                      │
              │                                              │
              │  1. Get registry context (ZO)               │
              │  2. Call hv() to get LLM-visible skills     │
              │  3. Filter already-sent skills (xg1 Set)    │
              │  4. Format with BU7()                       │
              └─────────────────────────────────────────────┘
                                    │
                                    ▼
              ┌─────────────────────────────────────────────┐
              │  Skill Listing Attachment                   │
              │  { type: "skill_listing", content, ... }   │
              └─────────────────────────────────────────────┘

At skill invocation (inline execution):
              ┌─────────────────────────────────────────────┐
              │  handlePromptCommandFromTool (Pb4)          │
              │  - getPromptForCommand() called             │
              │  - Prompt injected into conversation        │
              │  - InstructionsLoaded hook fires (v2.1.76) │
              └─────────────────────────────────────────────┘
```

---

## Implementation Details

### getSkillsForLLMInvocation (hv)

**What it does:** Filters the skill registry to return only skills that should be visible to the LLM for invocation.

```javascript
// ============================================
// getSkillsForLLMInvocation - Filter skills for LLM visibility
// Location: chunks.168.mjs:2307-2308
// ============================================

// ORIGINAL (for source lookup):
hv = KA(async (A) => {
    return (await cZ(A)).filter((K) => K.type === "prompt" && !K.disableModelInvocation && K.source !== "builtin" && (K.loadedFrom === "bundled" || K.loadedFrom === "commands_DEPRECATED" || K.hasUserSpecifiedDescription || K.whenToUse))
})

// READABLE (for understanding):
const getSkillsForLLMInvocation = memoize(async (registryContext) => {
    const allSkills = await getSkillRegistry(registryContext);

    return allSkills.filter(skill =>
        skill.type === "prompt" &&
        !skill.disableModelInvocation &&
        skill.source !== "builtin" &&
        (skill.loadedFrom === "bundled" ||
         skill.loadedFrom === "commands_DEPRECATED" ||
         skill.hasUserSpecifiedDescription ||
         skill.whenToUse)
    );
});

// Mapping: hv→getSkillsForLLMInvocation, KA→memoize, cZ→getSkillRegistry
```

---

### generateSkillListingAttachment (OIY)

**What it does:** Creates a skill_listing attachment for system-reminder messages.

```javascript
// ============================================
// generateSkillListingAttachment - Generate skill listing for system reminder
// Location: chunks.142.mjs:2381-2395
// ============================================

// ORIGINAL (for source lookup):
async function OIY(A) {
    let q = ZO(),
        Y = (await hv(q)).filter(($) => !xg1.has($.name));
    if (Y.length === 0) return [];
    let z = xg1.size === 0;
    for (let $ of Y) xg1.add($.name);
    h(`Sending ${Y.length} skills via attachment (${z?"initial":"dynamic"}, ${xg1.size} total sent)`);
    let w = yG(A.options.mainLoopModel, FP());
    return [{
        type: "skill_listing",
        content: BU7(Y, w),
        skillCount: Y.length,
        isInitial: z
    }]
}

// READABLE (for understanding):
async function generateSkillListingAttachment(toolUseContext) {
    let registryContext = getRegistryContext();
    let newSkills = (await getSkillsForLLMInvocation(registryContext))
        .filter(skill => !sentSkillNames.has(skill.name));

    if (newSkills.length === 0) return [];

    let isInitial = sentSkillNames.size === 0;

    for (let skill of newSkills) {
        sentSkillNames.add(skill.name);
    }

    log(`Sending ${newSkills.length} skills via attachment (${isInitial ? "initial" : "dynamic"}, ${sentSkillNames.size} total sent)`);

    let tokenBudget = getModelContextLimit(toolUseContext.options.mainLoopModel);

    return [{
        type: "skill_listing",
        content: formatSkillListing(newSkills, tokenBudget),
        skillCount: newSkills.length,
        isInitial: isInitial
    }];
}

// Mapping: OIY→generateSkillListingAttachment, ZO→getRegistryContext, hv→getSkillsForLLMInvocation,
// xg1→sentSkillNames, h→log, yG→getModelContextLimit, BU7→formatSkillListing
```

---

## InstructionsLoaded Hook (v2.1.76)

### What it does

A new hook event type introduced in v2.1.76 that fires when a skill's instruction prompt is injected into the conversation. This allows external code to observe exactly when and which skill instructions were applied.

### When it fires

The hook fires in `handlePromptCommandFromTool` (Pb4) after:
1. `getPromptForCommand()` returns the skill's prompt messages
2. The prompt messages are ready to be added to the conversation

The hook fires **before** the messages are returned to the LLM. This allows hooks to:
- Log the skill invocation
- Modify or supplement the prompt (via hook output)
- Cancel the invocation (via hook error)

### Hook event data

```javascript
// InstructionsLoaded hook event structure
{
    type: "InstructionsLoaded",
    skillName: "commit",           // Skill name (without slash prefix)
    skillSource: "project",        // Source tier: bundled/user/project/plugin
    contentLength: 1234,           // Character length of injected instructions
    args: "feat: add login page",  // Arguments passed by user or LLM
    loadedFrom: "skills"           // "skills", "bundled", "plugin", etc.
}
```

### Use cases

- **Audit logging**: Record which skill instructions are used in compliance-sensitive environments
- **Token budget monitoring**: Track how much context skills consume
- **Testing**: Assert that the correct skill was invoked with expected args
- **Custom post-processing**: Run additional logic after specific skills are loaded

### Integration with existing hook system

`InstructionsLoaded` integrates with the existing hook system (`registerSkillHooks` / IM6 and `executeHooksIterator` / NI). Skills can define `InstructionsLoaded` hooks in their own frontmatter:

```yaml
---
hooks:
  InstructionsLoaded:
    - matcher: "*"
      hooks:
        - hook: "echo 'Skill instructions loaded'"
---
```

This allows skills to trigger setup actions when their own instructions are loaded.

---

## Skill Discovery Tracking

### xg1 Set (sentSkillNames)

The global `xg1` Set tracks which skill names have already been sent to the LLM. On each call to `generateSkillListingAttachment`:

1. **Initial call:** `xg1` is empty, all skills are sent, `isInitial: true`
2. **Dynamic additions:** Only newly discovered skills are sent, `isInitial: false`, UI shows "N skills available"
3. **Compaction:** The `xg1` Set is preserved across compaction (it lives in module-level state, not conversation state)

---

## System Prompt Integration

Skills are also referenced in the system prompt (chunks.169.mjs), where a line explains the slash command syntax to the LLM:

```
- /<skill-name> (e.g., /commit) is shorthand for users to invoke a user-invocable skill.
  When executed, the skill gets expanded to a full prompt. Use the Skill tool to execute them.
  IMPORTANT: Only use Skill for skills listed in its user-invocable skills section...
```

---

## Design Rationale

### Why InstructionsLoaded Instead of Existing Hooks?

**Alternative:** Use `PostToolUse` on the Skill tool itself.

**Problem:** `PostToolUse` fires after the skill tool call completes, which is after the LLM has already received and processed the instructions. The `InstructionsLoaded` hook fires at the moment instructions are injected, allowing more precise timing for audit logging.

Additionally, `PostToolUse` does not carry the skill content length or source metadata that `InstructionsLoaded` provides.

### Why Track Sent Skills Globally?

The `xg1` Set is module-level state (not per-session). This means if the module is loaded once per process, skill listings are never re-sent even across different sessions in the same process (rare in practice).

The trade-off accepted is that compaction doesn't reset the skill listing tracker. In practice this is acceptable because:
1. The LLM remembers skill listings from before compaction (they're in the summary)
2. Re-sending would waste tokens
3. Dynamic skill additions still work correctly
