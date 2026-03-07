# Skill-Reminder Integration - Deep Analysis (Claude Code 2.1.38)

## Overview

The Skill-Reminder Integration describes how skills are discovered and presented to the LLM through system-reminder messages. This mechanism ensures the LLM is aware of available skills without consuming token budget for every skill definition upfront.

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
              │  hv() - getSkillsForLLMInvocation()         │
              │  (chunks.168.mjs:2307)                      │
              │                                              │
              │  Filters:                                    │
              │  - type === "prompt"                        │
              │  - !disableModelInvocation                  │
              │  - source !== "builtin"                     │
              │  - (loadedFrom conditions)                  │
              └─────────────────────────────────────────────┘
                                    │
                                    ▼
              ┌─────────────────────────────────────────────┐
              │  Skill Listing Attachment                   │
              │  {                                          │
              │    type: "skill_listing",                  │
              │    content: "skill descriptions...",       │
              │    skillCount: N,                          │
              │    isInitial: true/false                   │
              │  }                                          │
              └─────────────────────────────────────────────┘
                                    │
                                    ▼
              ┌─────────────────────────────────────────────┐
              │  System Reminder Message                     │
              │  "The following skills are available..."    │
              └─────────────────────────────────────────────┘
```

---

## Implementation Details

### getSkillsForLLMInvocation (hv)

**What it does:** Filters the skill registry to return only skills that should be visible to the LLM for invocation.

**How it works:**
1. Calls `getSkillRegistry` (cZ) to get all registered skills
2. Applies filter criteria:
   - `type === "prompt"` - Only prompt-based skills
   - `!disableModelInvocation` - Not blocked from LLM use
   - `source !== "builtin"` - Excludes internal built-in skills
   - Loaded from valid sources with description or whenToUse

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
        // Must be prompt-based (not local/local-jsx)
        skill.type === "prompt" &&
        // Must not be disabled for LLM invocation
        !skill.disableModelInvocation &&
        // Exclude internal built-in skills
        skill.source !== "builtin" &&
        // Must have visible metadata
        (skill.loadedFrom === "bundled" ||
         skill.loadedFrom === "commands_DEPRECATED" ||
         skill.hasUserSpecifiedDescription ||
         skill.whenToUse)
    );
});

// Mapping: hv→getSkillsForLLMInvocation, KA→memoize, cZ→getSkillRegistry
```

**Why this approach:**
- **Prompt-based only:** Local/local-jsx skills are UI-only (user commands like `/help`)
- **disableModelInvocation:** Some skills (like `/clear`) shouldn't be invoked by LLM
- **source !== "builtin":** Internal skills like `Sleep` are infrastructure
- **Description requirement:** Skills need user-facing info to be useful

### generateSkillListingAttachment (OIY)

**What it does:** Creates a skill_listing attachment for system-reminder messages.

**How it works:**
1. Gets registry context
2. Calls `hv()` to get LLM-visible skills
3. Filters out skills already sent (tracked in `xg1` Set)
4. Formats with `BU7()` respecting token limits
5. Returns attachment object

```javascript
// ============================================
// generateSkillListingAttachment - Create skill listing for reminder
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
    // Get registry context
    let registryContext = getRegistryContext();

    // Get LLM-visible skills, excluding already-sent ones
    let skillsToSend = (await getSkillsForLLMInvocation(registryContext))
        .filter(skill => !sentSkillNames.has(skill.name));

    if (skillsToSend.length === 0) return [];

    // Track if this is the first batch
    let isInitial = sentSkillNames.size === 0;

    // Mark these skills as sent
    for (let skill of skillsToSend) {
        sentSkillNames.add(skill.name);
    }

    debug(`Sending ${skillsToSend.length} skills via attachment (${isInitial ? "initial" : "dynamic"}, ${sentSkillNames.size} total sent)`);

    // Get token budget for this model
    let tokenBudget = getModelContextLimit(toolUseContext.options.mainLoopModel);

    return [{
        type: "skill_listing",
        content: formatSkillListing(skillsToSend, tokenBudget),
        skillCount: skillsToSend.length,
        isInitial: isInitial
    }];
}

// Mapping: OIY→generateSkillListingAttachment, ZO→getRegistryContext, hv→getSkillsForLLMInvocation,
// xg1→sentSkillNames, h→debug, yG→getModelContextLimit, BU7→formatSkillListing
```

**Key insight:** The `xg1` Set is a global tracker that prevents re-sending skill listings. This ensures:
1. Initial load sends all discovered skills
2. Dynamically discovered skills (from `@` mentions) are added incrementally
3. Token budget is not wasted on repeated skill listings

### formatSkillListing (BU7)

**What it does:** Formats a list of skills into a readable string, respecting token limits.

**How it works:**
1. If total length fits within budget, return full descriptions
2. Otherwise, truncate descriptions to fit budget evenly
3. If even names don't fit, return names only

```javascript
// ============================================
// formatSkillListing - Format skills with token budget
// Location: chunks.87.mjs:2757-2777
// ============================================

// ORIGINAL (for source lookup):
function BU7(A, q) {
    if (A.length === 0) return "";
    let K = YT9(q),
        Y = A.map((O) => ({
            cmd: O,
            full: zT9(O)
        }));
    if (Y.reduce((O, _) => O + _.full.length, 0) + (Y.length - 1) <= K) return Y.map((O) => O.full).join(`
`);
    let w = A.reduce((O, _) => O + _.name.length + 4, 0) + (A.length - 1),
        H = K - w,
        $ = Math.floor(H / A.length);
    if ($ < wT9) return A.map((O) => `- ${O.name}`).join(`
`);
    return A.map((O) => {
        let _ = uU7(O),
            J = _.length > $ ? _.slice(0, $ - 1) + "…" : _;
        return `- ${O.name}: ${J}`
    }).join(`
`)
}

// READABLE (for understanding):
function formatSkillListing(skills, tokenBudget) {
    if (skills.length === 0) return "";

    let charBudget = tokensToChars(tokenBudget);

    // Calculate full descriptions
    let formattedSkills = skills.map(skill => ({
        cmd: skill,
        full: formatSkillFull(skill)  // "- name: description"
    }));

    // If all fit, return full
    let totalLength = formattedSkills.reduce((sum, s) => sum + s.full.length, 0) + (skills.length - 1);
    if (totalLength <= charBudget) {
        return formattedSkills.map(s => s.full).join("\n");
    }

    // Calculate space for descriptions
    let nameChars = skills.reduce((sum, s) => sum + s.name.length + 4, 0) + (skills.length - 1);
    let remainingChars = charBudget - nameChars;
    let charsPerDescription = Math.floor(remainingChars / skills.length);

    // If too small, return names only
    if (charsPerDescription < MIN_DESCRIPTION_CHARS) {
        return skills.map(s => `- ${s.name}`).join("\n");
    }

    // Truncate descriptions to fit
    return skills.map(skill => {
        let desc = getSkillDescription(skill);
        let truncated = desc.length > charsPerDescription
            ? desc.slice(0, charsPerDescription - 1) + "…"
            : desc;
        return `- ${skill.name}: ${truncated}`;
    }).join("\n");
}

// Mapping: BU7→formatSkillListing, YT9→tokensToChars, zT9→formatSkillFull, uU7→getSkillDescription,
// wT9→MIN_DESCRIPTION_CHARS
```

**Why this approach:**
- **Adaptive formatting:** Balances completeness vs token budget
- **Fair distribution:** Divides remaining budget evenly among descriptions
- **Graceful degradation:** Falls back to names-only if budget is tight

---

## Integration Points

### Attachment Generation (phY)

The `phY` function (chunks.142.mjs:1948) is the main attachment generator. It calls `OIY` alongside other attachment generators:

```javascript
// ============================================
// Attachment Generation - Main entry point
// Location: chunks.142.mjs:1961
// ============================================

// From phY function - attachment generators array
let X = [
    gw("changed_files", () => ...),
    gw("nested_memory", () => ...),
    gw("dynamic_skill", () => ...),
    gw("skill_listing", () => OIY(toolUseContext)),  // <-- Skill listing
    gw("ultra_claude_md", async () => ...),
    // ... other attachments
];
```

### System Reminder Rendering

The `skill_listing` attachment is rendered in chunks.173.mjs:880-888:

```javascript
// ============================================
// skill_listing - System reminder rendering
// Location: chunks.173.mjs:880-888
// ============================================

// ORIGINAL (for source lookup):
case "skill_listing": {
    if (!A.content) return [];
    return _9([c6({
        content: `The following skills are available for use with the Skill tool:

${A.content}`,
        isMeta: !0
    })])
}

// READABLE (for understanding):
case "skill_listing": {
    if (!attachment.content) return [];

    return createMessages([createContentBlock({
        content: `The following skills are available for use with the Skill tool:

${attachment.content}`,
        isMeta: true  // Marks as system-reminder
    })]);
}
```

### UI Display

The UI component in chunks.129.mjs:2619-2624 shows the skill count:

```javascript
// ============================================
// skill_listing - UI display
// Location: chunks.129.mjs:2619-2624
// ============================================

// ORIGINAL (for source lookup):
case "skill_listing": {
    if (A.isInitial) return null;
    return S4.default.createElement(oX, null, S4.default.createElement(V, {
        bold: !0
    }, A.skillCount), " skill", A.skillCount !== 1 ? "s" : "", " available")
}

// READABLE (for understanding):
case "skill_listing": {
    // Don't show UI element for initial load (too noisy)
    if (attachment.isInitial) return null;

    return React.createElement(CompactText, null,
        React.createElement(Text, { bold: true }, attachment.skillCount),
        " skill", attachment.skillCount !== 1 ? "s" : "",
        " available"
    );
}
```

**Key insight:** Initial skill listings don't show a UI indicator to avoid visual noise. Only dynamically discovered skills show "N skills available".

---

## Skill Discovery Tracking

### xg1 Set (sentSkillNames)

The global `xg1` Set tracks which skill names have already been sent to the LLM:

```
Session Start
    │
    ▼
xg1 = {} (empty)
    │
    ▼
First OIY() call
    │
    ├── hv() returns: ["commit", "review-pr", "pdf", ...]
    │
    ├── Filter by xg1: all skills (xg1 is empty)
    │
    ├── Add all to xg1: {"commit", "review-pr", "pdf", ...}
    │
    └── isInitial = true
    │
    ▼
Later, user mentions @"skill-dir"
    │
    ▼
Dynamic skill load adds "new-skill"
    │
    ▼
Second OIY() call
    │
    ├── hv() returns: ["commit", "review-pr", "pdf", "new-skill", ...]
    │
    ├── Filter by xg1: only "new-skill"
    │
    ├── Add to xg1: {"commit", ..., "new-skill"}
    │
    └── isInitial = false
    │
    ▼
UI shows: "1 skill available"
```

---

## System Prompt Integration

Skills are also referenced in the system prompt generation (chunks.169.mjs:242-245):

```javascript
// ============================================
// System Prompt - Skill reference
// Location: chunks.169.mjs:242-245
// ============================================

// ORIGINAL (for source lookup):
let [H, $, O] = await Promise.all([hv(w), rBA(), nBA(q, K)]),
    // ...
    D = H.map((P) => `/${P.userFacingName()}`).length > 0 && J.has(NJ)
        ? `- /<skill-name> (e.g., /commit) is shorthand for users to invoke a user-invocable skill...`
        : "";

// READABLE (for understanding):
let [llmVisibleSkills, ...] = await Promise.all([
    getSkillsForLLMInvocation(registryContext),
    // ...
]);

let slashCommandHelp = llmVisibleSkills
    .map(s => `/${s.userFacingName()}`).length > 0 &&
    toolNames.has("Skill")
    ? `- /<skill-name> (e.g., /commit) is shorthand for users to invoke a user-invocable skill. When executed, the skill gets expanded to a full prompt. Use the Skill tool to execute them. IMPORTANT: Only use Skill for skills listed in its user-invocable skills section - do not guess or use built-in CLI commands.`
    : "";
```

This adds context to the system prompt explaining the `/<skill-name>` syntax.

---

## Design Rationale

### Why Track Sent Skills?

**Token efficiency:** Skills can have long descriptions. Sending them repeatedly would:
1. Waste token budget
2. Dilute context with repeated information
3. Slow down LLM responses

**Trade-off:** The global tracker means skills aren't re-announced after certain events (like compaction). This is acceptable because:
1. The LLM already knows about them from earlier in the conversation
2. The user can re-invoke skills explicitly
3. Compaction preserves recent messages which likely include skill invocations

### Why Filter Built-in Skills?

Built-in skills like `Sleep` (cBA) are infrastructure, not user-facing features:
- They don't need to be advertised
- The LLM discovers them through tool descriptions
- They would clutter the skill listing

### Why Token Budget?

Different models have different context limits:
- Claude 3.5 Sonnet: 200K tokens
- Claude 3 Haiku: 200K tokens
- Different models have different prompt cache budgets

The `yG()` function calculates the appropriate budget based on the model.

---

## Debugging

### Check Sent Skills

```javascript
// In browser console
console.log(sentSkillNames);  // xg1 Set
```

### Force Re-send All Skills

```javascript
// Clear the sent tracker
xg1.clear();
// Next OIY() call will send all skills again
```

### Check LLM-Visible Skills

```javascript
// Get filtered skill list
let skills = await getSkillsForLLMInvocation(getRegistryContext());
console.log(skills.map(s => s.name));
```