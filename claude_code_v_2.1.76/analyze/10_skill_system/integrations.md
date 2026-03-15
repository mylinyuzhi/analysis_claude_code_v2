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
- `generateSkillListingAttachment` (OIY) - System reminder integration, chunks.142.mjs:2381-2395
- `formatSkillListing` (BU7) - Format skills for LLM context, chunks.87.mjs
- `collectSkillsToKeep` (da4) - Compact skill preservation, chunks.146.mjs:2710-2722
- `getInvokedSkills` (zR6) - Get invoked skills for preservation, chunks.1.mjs
- `registerSkillHooks` (IM6) - Hook registration from skills, chunks.130.mjs:1361-1375
- `trackSkillUsage` (xM6) - Usage tracking, chunks.130.mjs:1383-1397
- `computeSkillScore` (bM6) - Score for skill ranking, chunks.130.mjs:1399-1405

---

## System Reminder Integration

### generateSkillListingAttachment (OIY)

**What it does:** Generates a skill listing attachment to be included in the system reminder sent to the LLM.

**How it works:**
1. Get session context and load all skills via `hv`
2. Filter out skills already in the `xg1` Set (previously sent)
3. Add new skill names to `xg1` for tracking
4. Format skills using `BU7` based on model capabilities
5. Return attachment object with skill listing content

**Why this approach:**
- **Deduplication** prevents sending the same skills multiple times
- **Initial vs dynamic** - tracks whether this is the first skill send or an update
- **Model-aware formatting** - different models may get different formatting

**Key insight:** Skills are only sent once per session unless the cache is cleared. This reduces token usage while ensuring the LLM always knows available skills.

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
    let sessionContext = getSessionContext();

    // Get all skills, filter out already-sent ones
    let newSkills = (await getAllSkills(sessionContext)).filter(
        skill => !sentSkillNames.has(skill.name)
    );

    if (newSkills.length === 0) return [];

    // Track whether this is initial or dynamic load
    let isInitial = sentSkillNames.size === 0;

    // Mark skills as sent
    for (let skill of newSkills) {
        sentSkillNames.add(skill.name);
    }

    log(`Sending ${newSkills.length} skills via attachment (${isInitial ? "initial" : "dynamic"}, ${sentSkillNames.size} total sent)`);

    // Format based on model capabilities
    let formatOptions = getFormatOptions(toolUseContext.options.mainLoopModel, getModelProvider());

    return [{
        type: "skill_listing",
        content: formatSkillListing(newSkills, formatOptions),
        skillCount: newSkills.length,
        isInitial
    }];
}

// Mapping: OIY→generateSkillListingAttachment, A→toolUseContext, q→sessionContext,
// Y→newSkills, z→isInitial, w→formatOptions, hv→getAllSkills, xg1→sentSkillNames,
// BU7→formatSkillListing, yG→getFormatOptions, ZO→getSessionContext, FP→getModelProvider
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

### collectSkillsToKeep (da4)

**What it does:** Collects invoked skills that should be preserved during conversation compaction.

**How it works:**
1. Get all invoked skills via `zR6`
2. Sort by invocation time (most recent first)
3. Map to compact format with name, path, and content
4. Return as attachment object for compaction output

**Why this approach:**
- **Skill context preservation** - skills remain available after compaction
- **Recent-first ordering** - most recently used skills appear first
- **Content inclusion** - skill content is included in compacted output

**Key insight:** Without skill preservation, the LLM would lose context about which skills are available and what they do. This integration ensures skills remain usable after compaction.

```javascript
// ============================================
// collectSkillsToKeep - Collect skills to preserve during compaction
// Location: chunks.146.mjs:2710-2722
// ============================================

// ORIGINAL (for source lookup):
function da4() {
    let A = zR6();
    if (A.size === 0) return null;
    let q = Array.from(A.values()).sort((K, Y) => Y.invokedAt - K.invokedAt).map((K) => ({
        name: K.skillName,
        path: K.skillPath,
        content: K.content
    }));
    return kq({
        type: "invoked_skills",
        skills: q
    })
}

// READABLE (for understanding):
function collectSkillsToKeep() {
    let invokedSkills = getInvokedSkills();
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

// Mapping: da4→collectSkillsToKeep, A→invokedSkills, q→sortedSkills, K→skill,
// zR6→getInvokedSkills, kq→createAttachment
```

### getInvokedSkills (zR6)

**What it does:** Returns a Map of all skills that have been invoked in this session.

**How it works:**
- Maintained internally by the skill system
- Updated when skills are executed via the Skill tool
- Returns Map keyed by skill name with invocation metadata

```javascript
// ============================================
// getInvokedSkills - Get all invoked skills
// Location: chunks.1.mjs:2964 (referenced)
// ============================================

// READABLE pseudocode:
function getInvokedSkills() {
    // Returns Map<skillName, { skillName, skillPath, content, invokedAt }>
    return invokedSkillsRegistry;
}
```

---

## Hooks Integration

### registerSkillHooks (IM6)

**What it does:** Registers hooks defined in a skill's frontmatter with the global hook system.

**How it works:**
1. Iterate over all hook event types (`ax` - PreToolUse, PostToolUse, etc.)
2. For each event, get hooks defined in skill
3. For each hook definition:
   - Create removal callback if `once: true`
   - Register hook via `Mw6` with matcher pattern
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
// Location: chunks.130.mjs:1361-1375
// ============================================

// ORIGINAL (for source lookup):
function IM6(A, q, K, Y, z) {
    let w = 0;
    for (let H of ax) {
        let $ = K[H];
        if (!$) continue;
        for (let O of $)
            for (let _ of O.hooks) {
                let J = _.once ? () => {
                    h(`Removing one-shot hook for event ${H} in skill '${Y}'`);
                    hk7(A, q, H, _)
                } : void 0;
                Mw6(A, q, H, O.matcher || "", _, J, z), w++
            }
    }
    if (w > 0) h(`Registered ${w} hooks from skill '${Y}'`)
}

// READABLE (for understanding):
function registerSkillHooks(setAppState, sessionId, skillHooks, skillName, skillRoot) {
    let hookCount = 0;

    // Iterate over all hook event types
    for (let eventType of HOOK_EVENT_TYPES) {
        let eventHooks = skillHooks[eventType];
        if (!eventHooks) continue;

        for (let hookGroup of eventHooks) {
            for (let hookDef of hookGroup.hooks) {
                // Create removal callback for one-shot hooks
                let removeCallback = hookDef.once ? () => {
                    log(`Removing one-shot hook for event ${eventType} in skill '${skillName}'`);
                    removeHook(setAppState, sessionId, eventType, hookDef);
                } : undefined;

                // Register hook with matcher pattern
                registerHook(
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

// Mapping: IM6→registerSkillHooks, A→setAppState, q→sessionId, K→skillHooks, Y→skillName,
// z→skillRoot, w→hookCount, H→eventType, $→eventHooks, O→hookGroup, _→hookDef, J→removeCallback,
// ax→HOOK_EVENT_TYPES, Mw6→registerHook, hk7→removeHook
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

### trackSkillUsage (xM6)

**What it does:** Records skill invocation for usage scoring and analytics.

**How it works:**
1. Get current usage count from global config
2. Increment count and update timestamp
3. Update global config via `jA`

```javascript
// ============================================
// trackSkillUsage - Track skill invocation
// Location: chunks.130.mjs:1383-1397
// ============================================

// ORIGINAL (for source lookup):
function xM6(A) {
    let K = f6().skillUsage?.[A],
        Y = Date.now(),
        z = (K?.usageCount ?? 0) + 1;
    if (!K || K.usageCount !== z || K.lastUsedAt !== Y) jA((w) => ({
        ...w,
        skillUsage: {
            ...w.skillUsage,
            [A]: {
                usageCount: z,
                lastUsedAt: Y
            }
        }
    }))
}

// READABLE (for understanding):
function trackSkillUsage(skillName) {
    let currentUsage = getGlobalConfig().skillUsage?.[skillName];
    let now = Date.now();
    let newCount = (currentUsage?.usageCount ?? 0) + 1;

    if (!currentUsage || currentUsage.usageCount !== newCount || currentUsage.lastUsedAt !== now) {
        updateGlobalConfig(config => ({
            ...config,
            skillUsage: {
                ...config.skillUsage,
                [skillName]: {
                    usageCount: newCount,
                    lastUsedAt: now
                }
            }
        }));
    }
}

// Mapping: xM6→trackSkillUsage, A→skillName, K→currentUsage, Y→now, z→newCount,
// f6→getGlobalConfig, jA→updateGlobalConfig
```

### computeSkillScore (bM6)

**What it does:** Computes a weighted score for skill ranking based on usage.

**How it works:**
1. Get usage record for skill
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
// Location: chunks.130.mjs:1399-1405
// ============================================

// ORIGINAL (for source lookup):
function bM6(A) {
    let K = f6().skillUsage?.[A];
    if (!K) return 0;
    let Y = (Date.now() - K.lastUsedAt) / 86400000,
        z = Math.pow(0.5, Y / 7);
    return K.usageCount * Math.max(z, 0.1)
}

// READABLE (for understanding):
function computeSkillScore(skillName) {
    let usage = getGlobalConfig().skillUsage?.[skillName];
    if (!usage) return 0;

    let daysSinceUse = (Date.now() - usage.lastUsedAt) / 86400000; // ms per day
    let decayFactor = Math.pow(0.5, daysSinceUse / 7); // Half-life of 7 days

    return usage.usageCount * Math.max(decayFactor, 0.1);
}

// Mapping: bM6→computeSkillScore, A→skillName, K→usage, Y→daysSinceUse, z→decayFactor
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