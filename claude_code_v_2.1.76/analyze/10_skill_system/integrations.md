# Skill System - Integrations (Claude Code 2.1.76)

## Overview

The skill system integrates with several core Claude Code subsystems:
- **System Reminder** - Skill listings attached to LLM context
- **Compact** - Skill content preservation during conversation compaction
- **Hooks** - Skill-defined hooks for tool event interception
- **Plugin System** - Skill loading from plugins

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `generateSkillListingAttachment` (guY) - System reminder integration, chunks.147.mjs:700-721
- `formatSkillListing` (fV8) - Format skills for LLM context, chunks.90.mjs:2654
- `getInvokedSkillsAttachment` (Tqq) - Compact skill preservation, chunks.147.mjs:1896-1908
- `getInvokedSkillsForAgent` (St6) - Get invoked skills for agent, chunks.1.mjs:3052
- `registerSkillHooks` (gc4) - Hook registration from skills, chunks.133.mjs:862-876
- `trackSkillUsage` (ON1) - Usage tracking, chunks.133.mjs:884
- `computeSkillScore` (ux8) - Score for skill ranking, chunks.133.mjs:900

---

## System Reminder Integration

### generateSkillListingAttachment (guY)

**What it does:** Generates a skill listing attachment to be included in the system reminder sent to the LLM.

**How it works:**
1. Check if Skill tool is available in context
2. Get session context and load LLM-visible skills via `NR`
3. On first call, populate `nT6` Set but return empty (skills already in initial prompt)
4. Filter out skills already in the `nT6` Set (previously sent)
5. Add new skill names to `nT6` for tracking
6. Format skills using `fV8` based on model capabilities
7. Return attachment object with skill listing content

**Why this approach:**
- **Deduplication** prevents sending the same skills multiple times
- **Initial vs dynamic** - first call populates Set, subsequent calls send new skills
- **Model-aware formatting** - different models may get different formatting

**Key insight:** Skills are only sent once per session unless the cache is cleared. The first call populates the sent Set without sending anything because skills are already included in the initial system prompt's tool definition.

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

    // Track whether this is initial or dynamic load
    let isInitial = sentSkillNames.size === 0;

    // Mark skills as sent
    for (let skill of newSkills) {
        sentSkillNames.add(skill.name);
    }

    log(`Sending ${newSkills.length} skills via attachment (${isInitial ? "initial" : "dynamic"}, ${sentSkillNames.size} total sent)`);

    // Format based on model capabilities
    let formatOptions = getModelContextLimit(toolUseContext.options.mainLoopModel);

    return [{
        type: "skill_listing",
        content: formatSkillListing(newSkills, formatOptions),
        skillCount: newSkills.length,
        isInitial
    }];
}

// Mapping: guY→generateSkillListingAttachment, A→toolUseContext, q→sessionContext,
// K→allSkills, Y→newSkills, z→isInitial, _→formatOptions, NR→getAllSkillsForTool, nT6→sentSkillNames,
// fV8→formatSkillListing, qY→getSessionContext, oH→SKILL_TOOL_NAME, bE1→isInitialSend
```

### Skill Listing Format

The skill listing format shows available skills with their descriptions and usage hints:

```
The following skills are available for use with the Skill tool:

- skill-name: Use when... (trigger phrases)
- another-skill: Description of what this skill does

To invoke a skill, use the Skill tool with the skill name.
```

**Conditional display:** Skills with `user-invocable: false` are hidden from listings but can still be invoked programmatically by the LLM if `disable-model-invocation` is not set.

---

## Compact Integration

### getInvokedSkillsAttachment (Tqq)

**What it does:** Creates an `invoked_skills` attachment that preserves invoked skills during conversation compaction.

**How it works:**
1. Get invoked skills for current agent via `St6`
2. If no invoked skills, return null
3. Sort by invocation time (most recent first)
4. Map to compact format with name, path, and content
5. Return as attachment object for compaction output

**Why this approach:**
- **Skill context preservation** - skills remain available after compaction
- **Recent-first ordering** - most recently used skills appear first
- **Content inclusion** - skill content is included in compacted output

**Key insight:** Without skill preservation, the LLM would lose context about which skills are available and what they do. This integration ensures skills remain usable after compaction.

```javascript
// ============================================
// getInvokedSkillsAttachment - Collect skills to preserve during compaction
// Location: chunks.147.mjs:1896-1908
// ============================================

// ORIGINAL (for source lookup):
function Tqq(A) {
    let q = St6(A);
    if (q.size === 0) return null;
    let K = Array.from(q.values()).sort((Y, z) => z.invokedAt - Y.invokedAt).map((Y) => ({
        name: Y.skillName,
        path: Y.skillPath,
        content: Y.content
    }));
    return f4({
        type: "invoked_skills",
        skills: K
    })
}

// READABLE (for understanding):
function getInvokedSkillsAttachment(agentId) {
    let invokedSkills = getInvokedSkillsForAgent(agentId);
    if (invokedSkills.size === 0) return null;

    // Sort by invocation time (most recent first)
    let sortedSkills = Array.from(invokedSkills.values())
        .sort((a, b) => b.invokedAt - a.invokedAt)
        .map(skill => ({
            name: skill.skillName,
            path: skill.skillPath,
            content: skill.content
        }));

    return createAttachment({
        type: "invoked_skills",
        skills: sortedSkills
    });
}

// Mapping: Tqq→getInvokedSkillsAttachment, A→agentId, q→invokedSkills, K→sortedSkills, Y→skill,
// St6→getInvokedSkillsForAgent, f4→createAttachment
```

### getInvokedSkillsForAgent (St6)

**What it does:** Returns a Map of all skills that have been invoked for a specific agent in this session.

**How it works:**
1. Get agentId filter (null for main thread)
2. Iterate over all invoked skills in session state
3. Filter by agentId match
4. Return Map keyed by skill name with invocation metadata

```javascript
// ============================================
// getInvokedSkillsForAgent - Get invoked skills for specific agent
// Location: chunks.1.mjs:3052-3058
// ============================================

// ORIGINAL (for source lookup):
function St6(A) {
    let q = A ?? null,
        K = new Map;
    for (let [Y, z] of v1.invokedSkills)
        if (z.agentId === q) K.set(Y, z);
    return K
}

// READABLE (for understanding):
function getInvokedSkillsForAgent(agentId) {
    let targetAgentId = agentId ?? null;  // null for main thread
    let result = new Map();

    for (let [skillName, skillData] of sessionState.invokedSkills) {
        if (skillData.agentId === targetAgentId) {
            result.set(skillName, skillData);
        }
    }

    return result;
}

// Mapping: St6→getInvokedSkillsForAgent, A→agentId, q→targetAgentId, K→result,
// Y→skillName, z→skillData, v1→sessionState
```

---

## Hooks Integration

### registerSkillHooks (gc4)

**What it does:** Registers hooks defined in a skill's frontmatter with the global hook system.

**How it works:**
1. Iterate over all hook event types (`Fu` - PreToolUse, PostToolUse, etc.)
2. For each event, get hooks defined in skill
3. For each hook definition:
   - Create removal callback if `once: true`
   - Register hook via `JW1` with matcher pattern
4. Log total hooks registered

**Hook events supported:**
- `PreToolUse` - Before tool execution
- `PostToolUse` - After tool execution (success)
- `PostToolUseFailure` - After tool execution (failure)
- `Notification` - On notification events
- `Stop` - On session stop

**Why this approach:**
- **Per-skill hook isolation** - hooks are scoped to the skill that defined them
- **One-shot hooks** - automatically removed after firing
- **Matcher patterns** - hooks can target specific tools or patterns

**Key insight:** Hook registration happens lazily when the skill is invoked, not when the skill is loaded. This prevents unused skills from registering hooks unnecessarily.

```javascript
// ============================================
// registerSkillHooks - Register hooks from skill frontmatter
// Location: chunks.133.mjs:862-876
// ============================================

// ORIGINAL (for source lookup):
function gc4(A, q, K, Y, z) {
    let _ = 0;
    for (let w of Fu) {
        let O = K[w];
        if (!O) continue;
        for (let $ of O)
            for (let H of $.hooks) {
                let j = H.once ? () => {
                    k(`Removing one-shot hook for event ${w} in skill '${Y}'`), l24(A, q, w, H)
                } : void 0;
                JW1(A, q, w, $.matcher || "", H, j, z), _++
            }
    }
    if (_ > 0) k(`Registered ${_} hooks from skill '${Y}'`)
}

// READABLE (for understanding):
function registerSkillHooks(setAppState, sessionId, skillHooks, skillName, skillRoot) {
    let hookCount = 0;

    // Iterate over all hook event types
    for (let eventType of HOOK_EVENT_NAMES) {
        let eventHooks = skillHooks[eventType];
        if (!eventHooks) continue;

        for (let hookGroup of eventHooks) {
            for (let hookDef of hookGroup.hooks) {
                // Create removal callback for one-shot hooks
                let removeCallback = hookDef.once ? () => {
                    log(`Removing one-shot hook for event ${eventType} in skill '${skillName}'`);
                    removeSessionHook(setAppState, sessionId, eventType, hookDef);
                } : undefined;

                // Register hook with matcher pattern
                addSkillHook(
                    setAppState,
                    sessionId,
                    eventType,
                    hookGroup.matcher || "",
                    hookDef,
                    removeCallback,
                    skillRoot
                );
                hookCount++;
            }
        }
    }

    if (hookCount > 0) {
        log(`Registered ${hookCount} hooks from skill '${skillName}'`);
    }
}

// Mapping: gc4→registerSkillHooks, A→setAppState, q→sessionId, K→skillHooks, Y→skillName,
// z→skillRoot, _→hookCount, w→eventType, O→eventHooks, $→hookGroup, H→hookDef, j→removeCallback,
// Fu→HOOK_EVENT_NAMES, JW1→addSkillHook, l24→removeSessionHook, k→log
```

### Hook Schema

Skills define hooks in frontmatter:

```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - hook: "echo 'Running bash command'"
    - matcher: "*"
      hooks:
        - hook: "echo 'Tool starting'"
          once: true
  PostToolUse:
    - matcher: "Write"
      hooks:
        - hook: "echo 'File written'"
```

**Matcher patterns:**
- Exact tool name: `"Bash"` matches only Bash tool
- Wildcard: `"*"` matches all tools
- Prefix pattern: `"Bash(git:*)"` matches Bash with git commands

---

## Usage Tracking

### trackSkillUsage (ON1)

**What it does:** Records skill invocation for usage scoring and analytics.

**How it works:**
1. Get current session state
2. Get existing usage record for skill
3. Increment count and update timestamp
4. Update session state with new usage data

```javascript
// ============================================
// trackSkillUsage - Track skill invocation
// Location: chunks.133.mjs:884-899
// ============================================

// ORIGINAL (for source lookup):
function ON1(A) {
    let K = X1(),
        Y = K.skillUsage?.[A],
        z = (Y?.usageCount ?? 0) + 1;
    d1((w) => ({
        ...w,
        skillUsage: {
            ...w.skillUsage,
            [A]: {
                usageCount: z,
                lastUsedAt: Date.now()
            }
        }
    }))
}

// READABLE (for understanding):
function trackSkillUsage(skillName) {
    let sessionState = getSessionState();
    let currentUsage = sessionState.skillUsage?.[skillName];
    let newCount = (currentUsage?.usageCount ?? 0) + 1;

    updateSessionState(state => ({
        ...state,
        skillUsage: {
            ...state.skillUsage,
            [skillName]: {
                usageCount: newCount,
                lastUsedAt: Date.now()
            }
        }
    }));
}

// Mapping: ON1→trackSkillUsage, A→skillName, K→sessionState, Y→currentUsage, z→newCount,
// X1→getSessionState, d1→updateSessionState
```

### computeSkillScore (ux8)

**What it does:** Computes a weighted score for skill ranking based on usage.

**How it works:**
1. Get usage record for skill from session state
2. Calculate days since last use
3. Apply exponential decay: `count * 0.5^(days/7)`
4. Floor decay at 0.1 (10% minimum weight)

**Why this approach:**
- **Recent usage weighted higher** - recently used skills score higher
- **7-day half-life** - usage loses half its weight each week
- **Minimum floor** - prevents skills from disappearing completely

**Key insight:** This scoring enables intelligent skill ordering in listings - frequently used, recently used skills appear first.

```javascript
// ============================================
// computeSkillScore - Compute weighted skill score
// Location: chunks.133.mjs:900-907
// ============================================

// ORIGINAL (for source lookup):
function ux8(A) {
    let K = X1().skillUsage?.[A];
    if (!K) return 0;
    let Y = (Date.now() - K.lastUsedAt) / 86400000,
        z = Math.pow(0.5, Y / 7);
    return K.usageCount * Math.max(z, 0.1)
}

// READABLE (for understanding):
function computeSkillScore(skillName) {
    let usage = getSessionState().skillUsage?.[skillName];
    if (!usage) return 0;

    let daysSinceUse = (Date.now() - usage.lastUsedAt) / 86400000; // ms per day
    let decayFactor = Math.pow(0.5, daysSinceUse / 7); // Half-life of 7 days

    return usage.usageCount * Math.max(decayFactor, 0.1);
}

// Mapping: ux8→computeSkillScore, A→skillName, K→usage, Y→daysSinceUse, z→decayFactor,
// X1→getSessionState
```

---

## Plugin Skills

### loadPluginSkills (B0A)

**What it does:** Loads skills from installed plugins.

**How it works:**
1. Get installed plugins from plugin registry
2. For each plugin with skills:
   - Read skill directory from plugin manifest
   - Load skills using standard `loadSkillsFromDirectory`
3. Merge with main skill registry

**Plugin skill directory structure:**
```
plugin-directory/
├── manifest.json
├── skills/
│   ├── skill-name/
│   │   └── SKILL.md
│   └── another-skill/
│       └── SKILL.md
```

**Why this approach:**
- **Plugin isolation** - skills are scoped to plugin namespace
- **Marketplace support** - skills can be distributed via plugins
- **Version management** - plugins can update skills independently

---

## Design Rationale

### Why Lazy Hook Registration?

Hooks are registered when skills are invoked, not when loaded:
- **Performance** - avoids registering hooks for unused skills
- **Isolation** - hooks are scoped to active skill's session
- **Cleanup** - hooks are automatically removed when skill session ends

### Why Usage Tracking with Decay?

Usage tracking with exponential decay enables:
- **Relevant ordering** - frequently used skills appear first
- **Temporal relevance** - recent usage weighted higher
- **Adaptive UX** - skill ordering adapts to user behavior

### Why Separate System Reminder Integration?

Skill listings are attached to system reminders rather than being sent separately:
- **Atomic delivery** - skills arrive with other context
- **Token efficiency** - batched with other attachments
- **Consistency** - same delivery mechanism as other context