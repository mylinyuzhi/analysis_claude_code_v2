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
- `getAllSkillsForTool` (NR) - Filters skills visible to LLM - chunks.168.mjs:2029
- `generateSkillListingAttachment` (guY) - Creates skill_listing attachment - chunks.147.mjs:700
- `formatSkillListing` (fV8) - Formats skills for display - chunks.90.mjs:2654
- `getSkills` (z5z) - Aggregates all skill sources - chunks.168.mjs:1815
- `sentSkillNames` (nT6) - Set tracking which skills were already sent - chunks.147.mjs:1247

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
                    │  Attachment Generation Pipeline  │
                    │   (chunks.147.mjs)               │
                    └──────────────────────────────────┘
                                    │
                                    ▼
              ┌─────────────────────────────────────────────┐
              │  guY() - generateSkillListingAttachment()   │
              │  (chunks.147.mjs:700)                       │
              │                                              │
              │  1. Get session context (qY)                │
              │  2. Call NR() to get LLM-visible skills     │
              │  3. Filter already-sent skills (nT6 Set)    │
              │  4. Format with fV8()                       │
              └─────────────────────────────────────────────┘
                                    │
                                    ▼
              ┌─────────────────────────────────────────────┐
              │  Skill Listing Attachment                   │
              │  { type: "skill_listing", content, ... }   │
              └─────────────────────────────────────────────┘

At skill invocation (inline execution):
              ┌─────────────────────────────────────────────┐
              │  SkillTool.call (m66)                       │
              │  - getPromptForCommand() called             │
              │  - Prompt injected into conversation        │
              │  - InstructionsLoaded hook fires (v2.1.76) │
              └─────────────────────────────────────────────┘
```

---

## Implementation Details

### getAllSkillsForTool (NR)

**What it does:** Filters the skill registry to return only skills that should be visible to the LLM for invocation.

```javascript
// ============================================
// getAllSkillsForTool - Filter skills for LLM visibility
// Location: chunks.168.mjs:2029-2031
// ============================================

// ORIGINAL (for source lookup):
NR = e1(async (A) => {
    return (await I0(A)).filter((K) => K.type === "prompt" && !K.disableModelInvocation && K.source !== "builtin" && (K.loadedFrom === "bundled" || K.loadedFrom === "skills" || K.loadedFrom === "commands_DEPRECATED" || K.hasUserSpecifiedDescription || K.whenToUse))
})

// READABLE (for understanding):
const getAllSkillsForTool = memoize(async (sessionContext) => {
    const allSkills = await getAllSkills(sessionContext);

    return allSkills.filter(skill =>
        skill.type === "prompt" &&
        !skill.disableModelInvocation &&
        skill.source !== "builtin" &&
        (skill.loadedFrom === "bundled" ||
         skill.loadedFrom === "skills" ||
         skill.loadedFrom === "commands_DEPRECATED" ||
         skill.hasUserSpecifiedDescription ||
         skill.whenToUse)
    );
});

// Mapping: NR→getAllSkillsForTool, e1→memoize, I0→getAllSkills
```

**Filter criteria explained:**
- `type === "prompt"` - Only prompt-based skills (not executable/code skills)
- `!disableModelInvocation` - Skill must allow LLM to auto-invoke it
- `source !== "builtin"` - Exclude built-in tools masquerading as skills
- One of: bundled, skills, commands_DEPRECATED, hasUserSpecifiedDescription, or whenToUse

---

### generateSkillListingAttachment (guY)

**What it does:** Creates a skill_listing attachment for system-reminder messages, tracking which skills have been sent.

```javascript
// ============================================
// generateSkillListingAttachment - Generate skill listing for system reminder
// Location: chunks.147.mjs:700-721
// ============================================

// ORIGINAL (for source lookup):
async function guY(A) {
    if (!A.options.tools.some((O) => z3(O, oH))) return [];
    let q = qY(),
        K = await NR(q);
    if (bE1) {
        bE1 = !1;
        for (let O of K) nT6.add(O.name);
        return []
    }
    let Y = K.filter((O) => !nT6.has(O.name));
    if (Y.length === 0) return [];
    let z = nT6.size === 0;
    for (let O of Y) nT6.add(O.name);
    k(`Sending ${Y.length} skills via attachment (${z?"initial":"dynamic"}, ${nT6.size} total sent)`);
    let _ = uM(A.options.mainLoopModel, Zj());
    return [{
        type: "skill_listing",
        content: fV8(Y, _),
        skillCount: Y.length,
        isInitial: z
    }]
}

// READABLE (for understanding):
async function generateSkillListingAttachment(toolUseContext) {
    // Skip if Skill tool is not available
    if (!toolUseContext.options.tools.some(tool => isSkillTool(tool))) {
        return [];
    }

    let sessionContext = getSessionContext();
    let allSkills = await getAllSkillsForTool(sessionContext);

    // On first call, populate sentSkillsSet but don't send anything
    // This ensures skills are known but not duplicated in initial system prompt
    if (isInitialSend) {
        isInitialSend = false;
        for (let skill of allSkills) {
            sentSkillNames.add(skill.name);
        }
        return [];  // No attachment on first call
    }

    // Filter to only new skills not yet sent
    let newSkills = allSkills.filter(skill => !sentSkillNames.has(skill.name));

    if (newSkills.length === 0) return [];

    let isInitial = sentSkillNames.size === 0;

    // Mark these skills as sent
    for (let skill of newSkills) {
        sentSkillNames.add(skill.name);
    }

    log(`Sending ${newSkills.length} skills via attachment (${isInitial ? "initial" : "dynamic"}, ${sentSkillNames.size} total sent)`);

    // Get token budget for skill listing
    let tokenBudget = getModelContextLimit(toolUseContext.options.mainLoopModel);

    return [{
        type: "skill_listing",
        content: formatSkillListing(newSkills, tokenBudget),
        skillCount: newSkills.length,
        isInitial: isInitial
    }];
}

// Mapping: guY→generateSkillListingAttachment, qY→getSessionContext, NR→getAllSkillsForTool,
// nT6→sentSkillNames, bE1→isInitialSend, k→log, fV8→formatSkillListing, oH→SKILL_TOOL_NAME
```

**Key insight:** The `isInitialSend` flag prevents skills from being sent on the very first call. This is because skills are already included in the initial system prompt's tool definition. The first call to this function just populates the `sentSkillNames` Set so subsequent dynamic additions are correctly identified as new.

---

### formatSkillListing (fV8)

**What it does:** Formats a list of skills into a human-readable string with budget-aware truncation.

**Algorithm:**
1. Calculate total character budget from model's context limit
2. If all skill descriptions fit within budget, output full descriptions
3. Otherwise, truncate descriptions while preserving bundled skill full text
4. Apply minimum description length threshold

```javascript
// ============================================
// formatSkillListing - Budget-aware skill formatting
// Location: chunks.90.mjs:2654-2687
// ============================================

// ORIGINAL (for source lookup):
function fV8(A, q) {
    if (A.length === 0) return "";
    let K = UP1(q),  // Token budget → char budget
        Y = A.map((D) => ({
            cmd: D,
            full: PB9(D)  // "- name: description"
        }));
    // If total fits within budget, return all full descriptions
    if (Y.reduce((D, X) => D + X.full.length, 0) + (Y.length - 1) <= K) return Y.map((D) => D.full).join("\n");

    // Separate bundled (keep full) from others (may truncate)
    let _ = new Set, w = [];
    for (let D = 0; D < A.length; D++) {
        let X = A[D];
        if (X.type === "prompt" && X.source === "bundled") _.add(D);
        else w.push(X)
    }

    // Calculate space for non-bundled skills
    let O = Y.reduce((D, X, P) => _.has(P) ? D + X.full.length + 1 : D, 0),
        $ = K - O;  // Remaining budget for non-bundled
    if (w.length === 0) return Y.map((D) => D.full).join("\n");

    let H = w.reduce((D, X) => D + X.name.length + 4, 0) + (w.length - 1),
        j = $ - H,  // Budget for descriptions after names
        J = Math.floor(j / w.length);  // Per-skill description budget

    // If per-skill budget too small, just show names
    if (J < WB9) return A.map((D, X) => _.has(X) ? Y[X].full : `- ${D.name}`).join("\n");

    let M = w.filter((D) => GV8(D).length > J).length;
    return A.map((D, X) => {
        if (_.has(X)) return Y[X].full;
        let P = GV8(D),
            W = P.length > J ? P.slice(0, J - 1) + "…" : P;
        return `- ${D.name}: ${W}`
    }).join("\n")
}

// READABLE (for understanding):
function formatSkillListing(skills, modelContextLimit) {
    if (skills.length === 0) return "";

    // Convert token budget to character budget
    let charBudget = tokenLimitToCharLimit(modelContextLimit);

    // Build full entries: "- name: description"
    let entries = skills.map(skill => ({
        skill,
        fullText: formatSkillEntry(skill)  // "- name: description"
    }));

    // If all fit within budget, return full descriptions
    let totalLength = entries.reduce((sum, e) => sum + e.fullText.length, 0) + (entries.length - 1);
    if (totalLength <= charBudget) {
        return entries.map(e => e.fullText).join("\n");
    }

    // Strategy: Keep bundled skills full, truncate others
    let bundledIndices = new Set();
    let otherSkills = [];
    for (let i = 0; i < skills.length; i++) {
        if (skills[i].type === "prompt" && skills[i].source === "bundled") {
            bundledIndices.add(i);
        } else {
            otherSkills.push(skills[i]);
        }
    }

    // Calculate space needed for bundled skills
    let bundledSpace = entries.reduce((sum, e, i) =>
        bundledIndices.has(i) ? sum + e.fullText.length + 1 : sum, 0);
    let remainingBudget = charBudget - bundledSpace;

    if (otherSkills.length === 0) {
        return entries.map(e => e.fullText).join("\n");
    }

    // Calculate per-skill description budget for non-bundled
    let namesSpace = otherSkills.reduce((sum, s) => sum + s.name.length + 4, 0) + (otherSkills.length - 1);
    let descriptionsBudget = remainingBudget - namesSpace;
    let perSkillBudget = Math.floor(descriptionsBudget / otherSkills.length);

    // If budget too small, just show names
    if (perSkillBudget < MIN_DESCRIPTION_LENGTH) {
        return skills.map((s, i) =>
            bundledIndices.has(i) ? entries[i].fullText : `- ${s.name}`
        ).join("\n");
    }

    // Truncate descriptions that exceed budget
    return skills.map((skill, i) => {
        if (bundledIndices.has(i)) return entries[i].fullText;
        let description = formatSkillDescriptionLine(skill);
        let truncated = description.length > perSkillBudget
            ? description.slice(0, perSkillBudget - 1) + "…"
            : description;
        return `- ${skill.name}: ${truncated}`;
    }).join("\n");
}

// Mapping: fV8→formatSkillListing, UP1→tokenLimitToCharLimit, PB9→formatSkillEntry,
// GV8→formatSkillDescriptionLine, WB9→MIN_DESCRIPTION_LENGTH
```

**Key insight:** Bundled skills (those registered via `registerPromptSkill`) are given priority and always shown in full. Other skills (project, user, plugin) may have their descriptions truncated to fit within the token budget. This ensures critical built-in functionality is always visible.

---

## InstructionsLoaded Hook (v2.1.76)

### What it does

A new hook event type introduced in v2.1.76 that fires when a skill's instruction prompt is injected into the conversation. This allows external code to observe exactly when and which skill instructions were applied.

### When it fires

The hook fires in `ec4` (handlePromptCommand) at chunks.133.mjs:1433-1438 after:
1. `getPromptForCommand()` returns the skill's prompt messages
2. If skill has hooks defined, `gc4` (registerSkillHooks) is called

### Implementation

```javascript
// ============================================
// ec4 - Handle prompt command execution with hook registration
// Location: chunks.133.mjs:1433-1438
// ============================================

// ORIGINAL (for source lookup):
async function ec4(A, q, K, Y = [], z = [], _) {
    let w = await A.getPromptForCommand(q, K);
    if (A.hooks) {
        let X = R1();
        gc4(K.setAppState, X, A.hooks, A.name, A.type === "prompt" ? A.skillRoot : void 0)
    }
    // ... rest of processing
}

// READABLE (for understanding):
async function handlePromptCommand(skill, args, toolUseContext, extraMessages = [], extraFiles = [], options) {
    // Get the skill's prompt content
    let promptMessages = await skill.getPromptForCommand(args, toolUseContext);

    // Register hooks if skill defines them
    if (skill.hooks) {
        let sessionId = getSessionId();
        registerSkillHooks(
            toolUseContext.setAppState,
            sessionId,
            skill.hooks,
            skill.name,
            skill.type === "prompt" ? skill.skillRoot : undefined
        );
    }

    // ... rest of processing
}

// Mapping: ec4→handlePromptCommand, A→skill, q→args, K→toolUseContext, Y→extraMessages,
// z→extraFiles, w→promptMessages, X→sessionId, gc4→registerSkillHooks, R1→getSessionId
```

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

`InstructionsLoaded` integrates with the existing hook system (`registerSkillHooks` / gc4). Skills can define `InstructionsLoaded` hooks in their own frontmatter:

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

### nT6 Set (sentSkillNames)

The global `nT6` Set tracks which skill names have already been sent to the LLM. On each call to `generateSkillListingAttachment`:

1. **Initial call:** `bE1` flag is true, skills are added to `nT6` but no attachment is returned (skills already in initial prompt)
2. **Dynamic additions:** Only newly discovered skills are sent, `isInitial: false`, UI shows "N skills available"
3. **Compaction:** The `nT6` Set is preserved across compaction (it lives in module-level state, not conversation state)

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

The `nT6` Set is module-level state (not per-session). This means if the module is loaded once per process, skill listings are never re-sent even across different sessions in the same process (rare in practice).

The trade-off accepted is that compaction doesn't reset the skill listing tracker. In practice this is acceptable because:
1. The LLM remembers skill listings from before compaction (they're in the summary)
2. Re-sending would waste tokens
3. Dynamic skill additions still work correctly
