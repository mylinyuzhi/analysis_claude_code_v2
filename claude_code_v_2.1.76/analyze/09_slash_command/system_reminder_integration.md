# System Reminder Integration — Skill Listing Injection

## Overview

The slash command system integrates with the system reminder mechanism to provide the LLM with real-time context about available skills. This integration uses delta updates, budget-aware formatting, and cross-turn tracking to efficiently inject skill information without consuming excessive context tokens.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skills, Compact)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands)

Key functions in this document:
- `generateSkillListingAttachment` (guY) - Delta skill listing attachment generator (chunks.147.mjs:700)
- `sentSkillNames` (nT6) - Set tracking sent skill names for deduplication (chunks.147.mjs:1247)
- `formatSkillListing` (fV8) - Budget-aware skill list formatter (chunks.90.mjs:2654)
- `formatSkillDescriptionLine` (GV8) - Single skill description formatter (chunks.90.mjs:2645)
- `registerInvokedSkill` (Uw6) - Track skill invocation (chunks.1.mjs:3037)
- `getInvokedSkillsForAgent` (St6) - Retrieve invoked skills by agent (chunks.1.mjs:3052)
- `getInvokedSkillsAttachment` (Tqq) - Build invoked_skills attachment for compaction (chunks.147.mjs:1896)

---

## Skill Listing Attachment Pipeline

### generateSkillListingAttachment (guY) — Delta Update Algorithm

**What it does:** Creates a skill_listing attachment for the system reminder, using delta updates to minimize token usage.

**Location:** chunks.147.mjs:700-721

```javascript
// ============================================
// generateSkillListingAttachment - Delta skill listing injection
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
    // Step 1: Check if Skill tool is available
    if (!toolUseContext.options.tools.some((t) => isSkillTool(t))) {
        return [];  // No Skill tool, no skill listing
    }

    // Step 2: Get session context and load all visible skills
    let sessionContext = getSessionContext();
    let allVisibleSkills = await getAllSkillsForTool(sessionContext);

    // Step 3: Handle force-initial-load flag (set after /compact)
    if (forceInitialLoad) {
        forceInitialLoad = false;
        // Mark all current skills as sent
        for (let skill of allVisibleSkills) {
            sentSkillNames.add(skill.name);
        }
        return [];  // Skip this turn, full list next turn
    }

    // Step 4: Calculate delta - only skills not yet sent
    let newSkills = allVisibleSkills.filter((s) => !sentSkillNames.has(s.name));
    if (newSkills.length === 0) {
        return [];  // Nothing new to send
    }

    // Step 5: Determine if this is initial or dynamic update
    let isInitial = sentSkillNames.size === 0;

    // Step 6: Mark new skills as sent
    for (let skill of newSkills) {
        sentSkillNames.add(skill.name);
    }

    log(`Sending ${newSkills.length} skills via attachment (${isInitial ? "initial" : "dynamic"}, ${sentSkillNames.size} total sent)`);

    // Step 7: Calculate character budget
    let charBudget = calculateCharBudget(
        toolUseContext.options.mainLoopModel,
        getContextTokens()
    );

    // Step 8: Return formatted attachment
    return [{
        type: "skill_listing",
        content: formatSkillListing(newSkills, charBudget),
        skillCount: newSkills.length,
        isInitial
    }];
}

// Mapping: guY→generateSkillListingAttachment, nT6→sentSkillNames, NR→getAllSkillsForTool,
//          bE1→forceInitialLoad, fV8→formatSkillListing, uM→calculateCharBudget,
//          Zj→getContextTokens, qY→getSessionContext, oH→SKILL_TOOL_NAME
```

**Why this approach:**

- **Delta efficiency**: Only sends new skills after initial turn, saving ~90% tokens
- **Set deduplication**: O(1) lookup for "already sent" check
- **isInitial flag**: Allows LLM to understand context (first time vs update)
- **Graceful degradation**: Returns empty array if nothing to send

**Key insight:** The `forceInitialLoad` flag handles a subtle edge case: after `/compact`, the conversation context is reset but the `sentSkillNames` Set still contains old entries. Setting the flag causes the next turn to repopulate the Set with current skills, ensuring consistency.

---

## sentSkillNames (nT6) Set Lifecycle

### Set Management Functions

```javascript
// Clear the sent skills Set (used after /compact)
function Oc() {
    nT6.clear();
    bE1 = !1;  // Reset force-initial flag
}

// Set force-initial flag (causes next turn to repopulate)
function Vn4() {
    bE1 = !0;
}
```

### Lifecycle States

| Event | Set State | `bE1` Flag | Result |
|-------|-----------|------------|--------|
| Session start | `{}` empty | `false` | Send all skills, `isInitial: true` |
| Turn 2 | `{skill1, skill2, ...}` | `false` | Send only new skills |
| New skill installed | Missing new skill | `false` | Delta includes new skill |
| After `/compact` | Old entries | `false` → `true` | Skip one turn |
| Turn after `/compact` | Repopulated | `false` | Normal delta behavior |

### Set Clear vs Force-Initial

**Two mechanisms with different purposes:**

| Mechanism | Function | When Used |
|-----------|----------|-----------|
| Clear Set | `Oc()` | Full reset, rarely used |
| Force-Initial | `Vn4()` | After compaction, common |

**Why two mechanisms:**
- `clear()` removes all tracking (rarely needed)
- `forceInitialLoad` flag handles compaction gracefully by repopulating

---

## Budget-Aware Formatting

### formatSkillListing (fV8) — Token-Budget Algorithm

**What it does:** Formats skill list within a character budget, prioritizing bundled skills.

**Location:** chunks.90.mjs:2654-2687

```javascript
// ============================================
// formatSkillListing - Budget-aware skill list formatter
// Location: chunks.90.mjs:2654-2687
// ============================================

// ORIGINAL (for source lookup):
function fV8(A, q) {
    if (A.length === 0) return "";
    let K = UP1(q),
        Y = A.map((D) => ({
            cmd: D,
            full: PB9(D)
        }));
    if (Y.reduce((D, X) => D + X.full.length, 0) + (Y.length - 1) <= K) return Y.map((D) => D.full).join(`
`);
    let _ = new Set,
        w = [];
    for (let D = 0; D < A.length; D++) {
        let X = A[D];
        if (X.type === "prompt" && X.source === "bundled") _.add(D);
        else w.push(X)
    }
    let O = Y.reduce((D, X, P) => _.has(P) ? D + X.full.length + 1 : D, 0),
        $ = K - O;
    if (w.length === 0) return Y.map((D) => D.full).join(`
`);
    let H = w.reduce((D, X) => D + X.name.length + 4, 0) + (w.length - 1),
        j = $ - H,
        J = Math.floor(j / w.length);
    if (J < WB9) return A.map((D, X) => _.has(X) ? Y[X].full : `- ${D.name}`).join(`
`);
    let M = w.filter((D) => GV8(D).length > J).length;
    return A.map((D, X) => {
        if (_.has(X)) return Y[X].full;
        let P = GV8(D),
            W = P.length > J ? P.slice(0, J - 1) + "…" : P;
        return `- ${D.name}: ${W}`
    }).join(`
`)
}

// READABLE (for understanding):
function formatSkillListing(skills, charBudget) {
    if (skills.length === 0) return "";

    // Step 1: Convert to character budget (from token budget)
    let budget = tokenLimitToCharLimit(charBudget);

    // Step 2: Build full format for each skill
    let formattedSkills = skills.map((skill) => ({
        cmd: skill,
        full: formatSkillEntry(skill)
    }));

    // Step 3: Check if everything fits
    let totalLength = formattedSkills.reduce((sum, s) => sum + s.full.length, 0)
                    + (formattedSkills.length - 1);  // newlines

    if (totalLength <= budget) {
        return formattedSkills.map((s) => s.full).join("\n");
    }

    // Step 4: Budget exceeded - prioritize bundled skills
    let bundledIndices = new Set();
    let nonBundledSkills = [];

    for (let i = 0; i < skills.length; i++) {
        let skill = skills[i];
        if (skill.type === "prompt" && skill.source === "bundled") {
            bundledIndices.add(i);
        } else {
            nonBundledSkills.push(skill);
        }
    }

    // Step 5: Calculate budget allocation
    let bundledLength = formattedSkills.reduce((sum, fs, idx) =>
        bundledIndices.has(idx) ? sum + fs.full.length + 1 : sum, 0
    );
    let remainingBudget = budget - bundledLength;

    if (nonBundledSkills.length === 0) {
        return formattedSkills.map((s) => s.full).join("\n");
    }

    // Step 6: Calculate per-skill budget for non-bundled
    let namesLength = nonBundledSkills.reduce((sum, s) => sum + s.name.length + 4, 0)
                    + (nonBundledSkills.length - 1);
    let descriptionBudget = remainingBudget - namesLength;
    let perSkillDescription = Math.floor(descriptionBudget / nonBundledSkills.length);

    // Step 7: If too small, show names only
    if (perSkillDescription < MIN_DESCRIPTION_CHARS) {
        return skills.map((s, idx) =>
            bundledIndices.has(idx) ? formattedSkills[idx].full : `- ${s.name}`
        ).join("\n");
    }

    // Step 8: Truncate descriptions to fit
    return skills.map((s, idx) => {
        if (bundledIndices.has(idx)) {
            return formattedSkills[idx].full;
        }

        let description = formatSkillDescriptionLine(s);
        let truncated = description.length > perSkillDescription
            ? description.slice(0, perSkillDescription - 1) + "…"
            : description;

        return `- ${s.name}: ${truncated}`;
    }).join("\n");
}

// Mapping: fV8→formatSkillListing, UP1→tokenLimitToCharLimit, PB9→formatSkillEntry,
//          GV8→formatSkillDescriptionLine, WB9→MIN_DESCRIPTION_CHARS
```

### Budget Calculation Constants

```javascript
// Location: chunks.90.mjs:2720-2726

const SKILL_BUDGET_RATIO = 0.02;     // r94: 2% of context window
const TOKENS_PER_CHAR = 4;           // o94: approximate ratio
const MAX_FALLBACK_CHARS = 16000;    // a94: fallback when no context tokens
const MIN_DESCRIPTION_CHARS = 20;    // WB9: minimum chars before name-only fallback

function tokenLimitToCharLimit(model, contextTokens) {
    // Allow override via environment variable
    if (Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET)) {
        return Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET);
    }
    if (contextTokens) {
        return Math.floor(contextTokens * TOKENS_PER_CHAR * SKILL_BUDGET_RATIO);
    }
    return MAX_FALLBACK_CHARS;
}
```

**Why 2% budget:**
- Skills are guidance, not content
- LLM already has main context
- ~4000 tokens for skills in 200k context is reasonable

### Tiered Truncation Strategy

| Tier | Condition | Format |
|------|-----------|--------|
| Full | All fits within budget | `- name: description - whenToUse` |
| Bundled Full | Budget tight | Bundled skills full, others truncated |
| Name-Only | Severe constraint | `- name` only, no description |

---

## Invoked Skills Preservation

### registerInvokedSkill (Uw6) — Invocation Tracking

**What it does:** Records a skill invocation for the invoked_skills system reminder attachment.

**Location:** chunks.1.mjs:3037

```javascript
// ============================================
// registerInvokedSkill - Track skill invocation for compaction
// Location: chunks.1.mjs:3037
// ============================================

// READABLE (for understanding):
function registerInvokedSkill(skillName, skillPath, content, agentId) {
    // Get current invoked skills map from state
    let invokedSkills = getInvokedSkillsState();

    // Create skill record
    let skillRecord = {
        skillName,
        skillPath,
        content,
        invokedAt: Date.now(),
        agentId
    };

    // Update state with new skill
    setState((prev) => ({
        ...prev,
        invokedSkills: new Map(prev.invokedSkills).set(skillPath, skillRecord)
    }));
}
```

**Why track invoked skills:**
- Skills inject behavioral instructions
- After compaction, LLM should continue following those instructions
- `invoked_skills` attachment re-injects skill content

### getInvokedSkillsForAgent (St6) — Agent-Filtered Retrieval

**What it does:** Returns invoked skills filtered by agent ID.

**Location:** chunks.1.mjs:3052

```javascript
// READABLE (for understanding):
function getInvokedSkillsForAgent(agentId) {
    let allInvokedSkills = getInvokedSkillsState();

    // Filter to skills for this agent (or global skills with null agentId)
    let filtered = new Map();
    for (let [path, skill] of allInvokedSkills) {
        if (skill.agentId === agentId || skill.agentId === null) {
            filtered.set(path, skill);
        }
    }

    return filtered;
}
```

### getInvokedSkillsAttachment (Tqq) — Compaction Attachment

**What it does:** Builds the invoked_skills attachment for system reminder during compaction.

**Location:** chunks.147.mjs:1896

```javascript
// ============================================
// getInvokedSkillsAttachment - Build invoked_skills attachment
// Location: chunks.147.mjs:1896
// ============================================

// READABLE (for understanding):
function getInvokedSkillsAttachment(agentId) {
    let invokedSkills = getInvokedSkillsForAgent(agentId);

    if (invokedSkills.size === 0) return null;

    // Sort by invocation time (most recent first)
    let skillsArray = Array.from(invokedSkills.values())
        .sort((a, b) => b.invokedAt - a.invokedAt)
        .map((skill) => ({
            name: skill.skillName,
            path: skill.skillPath,
            content: skill.content
        }));

    return createAttachment({
        type: "invoked_skills",
        skills: skillsArray,
        continuationMessage: "Continue to follow these guidelines from previously invoked skills."
    });
}
```

**Compaction Flow:**

```
Compaction triggered
        │
        ▼
getInvokedSkillsAttachment(agentId)
        │
        ├─── No invoked skills ──→ null (no attachment)
        │
        └─── Has invoked skills ──→ Create attachment
                │
                ▼
        System reminder with invoked_skills
                │
                ▼
        LLM receives: "Continue to follow these guidelines..."
```

---

## Integration Points

### System Reminder Pipeline

```
Turn N begins
        │
        ▼
buildSystemReminders()
        │
        ├─── generateSkillListingAttachment()
        │    │
        │    ├─── Check Skill tool available
        │    ├─── Load visible skills
        │    ├─── Filter by sentSkillNames
        │    └─── Format within budget
        │
        ├─── getInvokedSkillsAttachment()
        │    │
        │    ├─── Get skills for agent
        │    └─── Build continuation message
        │
        └─── Other attachments (diagnostics, etc.)
                │
                ▼
        System Reminder Message
```

### Cross-Turn State

```
Turn 1:
  sentSkillNames: {} → {skill1, skill2, skill3}
  Output: "- skill1: desc\n- skill2: desc\n- skill3: desc"

Turn 2:
  sentSkillNames: {skill1, skill2, skill3}
  New skill installed: skill4
  Output: "- skill4: desc" (delta only)

Turn 3 (after /compact):
  forceInitialLoad flag set
  sentSkillNames: {} → {skill1, skill2, skill3, skill4}
  Output: (nothing this turn, full list next turn)

Turn 4:
  sentSkillNames: {skill1, skill2, skill3, skill4}
  Output: normal delta behavior
```

---

## Telemetry

### Events Tracked

| Event | When Fired | Data |
|-------|------------|------|
| `tengu_skill_listing_sent` | Skill listing attachment created | `{ count, isInitial, budget }` |
| `tengu_skill_invoked` | Skill invoked via /command or tool | `{ name, source, agentId }` |
| `tengu_invoked_skills_preserved` | Skills preserved through compaction | `{ count, agentId }` |

### Logging

```javascript
// Example log output
log(`Sending 3 skills via attachment (initial, 3 total sent)`);
log(`Sending 1 skills via attachment (dynamic, 4 total sent)`);
log(`Preserving 2 invoked skills through compaction`);
```

---

## InstructionsLoaded Hook Integration

### Hook Event Flow

When a prompt-type command is executed via `handlePromptCommand` (ec4), the skill hooks are registered via `registerSkillHooks` (gc4). One important hook event is `InstructionsLoaded`, which fires after the skill's prompt content is loaded.

```javascript
// From chunks.133.mjs:1435-1438
if (A.hooks) {
    let X = R1();
    gc4(K.setAppState, X, A.hooks, A.name, A.type === "prompt" ? A.skillRoot : void 0)
}
```

### Hook Registration During Prompt Command

**Flow:**

```
handlePromptCommand (ec4) called
        │
        ▼
command.getPromptForCommand(args, context)
        │
        ▼
command.hooks exists?
        │
        ├─── No ──→ Skip hook registration
        │
        └─── Yes ──→ gc4(registerSkillHooks) called
                │
                ▼
        For each hook event type:
            - PreToolUse
            - PostToolUse
            - Notification
            - InstructionsLoaded
            - Stop
                │
                ▼
        Register hooks with session state
```

### InstructionsLoaded Hook Purpose

The `InstructionsLoaded` event fires after skill instructions are loaded into context. This allows skills to:

1. **Run setup code**: Initialize resources when skill is activated
2. **Modify context**: Adjust environment based on skill content
3. **Log activation**: Track when skills are loaded for analytics

**Hook definition in skill frontmatter:**

```yaml
---
name: my-skill
hooks:
  InstructionsLoaded:
    - matcher: ""
      hooks:
        - type: shell
          command: "echo 'Skill loaded'"
          once: false
---
```

---

## CLAUDE_SKILL_DIR Environment Variable

### Dynamic Skill Directory Support

Skills can be loaded from custom directories specified via the `CLAUDE_SKILL_DIR` environment variable:

```javascript
// From chunks.87.mjs (skill loading)
let skillDirs = process.env.CLAUDE_SKILL_DIR
    ? process.env.CLAUDE_SKILL_DIR.split(':')
    : [];

// Also check default locations
let defaultSkillDirs = [
    path.join(projectRoot, '.claude/skills'),
    path.join(userHome, '.claude/skills')
];
```

**Use cases:**
- Shared skill libraries across projects
- Organization-specific skill directories
- CI/CD pipeline skill injection

### Dynamic Skill Directory Triggers

The `dynamicSkillDirTriggers` Set in the tool use context tracks when skill directories are added dynamically:

```javascript
// chunks.148.mjs:1994
nestedMemoryAttachmentTriggers: new Set,
dynamicSkillDirTriggers: new Set,
```

When a new skill directory is detected:
1. `dynamicSkillDirTriggers.add(dirPath)` is called
2. `getAllSkills` cache is invalidated
3. `sentSkillNames` Set is cleared (via `forceInitialLoad`)
4. New skills appear in next `generateSkillListingAttachment` call