# Skill System - Skill Tool Implementation (Claude Code 2.1.76)

## Overview

The Skill tool (`wt`) is the primary interface for invoking skills programmatically. It bridges the LLM's tool-calling capability with the skill execution system, allowing skills to be triggered either by the user (via `/command` syntax) or by the LLM (via the Skill tool). This document covers the complete implementation details of the Skill tool.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skill System section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `SkillTool` (wt) - Tool definition object, chunks.132.mjs:820-1073
- `SKILL_TOOL_NAME` (NJ) - Constant "Skill", chunks.132.mjs:821
- `SKILL_PROPERTY_KEYS` (JNY) - Set of allowed skill properties, chunks.132.mjs:1073
- `validateSkillProperties` (XNY) - Validate skill has only allowed properties, chunks.132.mjs:752-761
- `executeForkedSkill` (wNY) - Execute skill in forked context, chunks.132.mjs:693-750
- `trackSkillUsage` (xM6) - Track skill usage for ranking, chunks.130.mjs:1383-1397

---

## Architecture Overview

```
Skill Tool Integration Flow
───────────────────────────

LLM calls Skill tool with { skill: "name", args: "..." }
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                      validateInput                         │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 1. Trim skill name                                 │   │
│  │ 2. Strip "/" prefix if present                     │   │
│  │ 3. Look up skill in registry (cZ)                  │   │
│  │ 4. Check disableModelInvocation flag               │   │
│  │ 5. Verify skill is prompt-based                    │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                   checkPermissions                         │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 1. Check deny rules for skill                      │   │
│  │ 2. Check allow rules for skill                     │   │
│  │ 3. Auto-allow if safe properties only (XNY)        │   │
│  │ 4. Otherwise ask user for permission               │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                       call                                 │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Forked Execution (context: "fork"):                │   │
│  │   → wNY() → spawns subagent                         │   │
│  │                                                     │   │
│  │ Inline Execution (default):                         │   │
│  │   → Pb4() → returns newMessages                     │   │
│  │   → Register hooks if skill has hooks               │   │
│  │   → Return contextModifier for allowedTools/model   │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## Tool Definition

### Complete Tool Object Structure

```javascript
// ============================================
// SkillTool - Main tool object for skill invocation
// Location: chunks.132.mjs:820-1073
// ============================================

// ORIGINAL (for source lookup):
wt = {
    name: NJ,
    maxResultSizeChars: 1e5,
    get inputSchema() { return HNY() },
    get outputSchema() { return _NY() },
    description: async ({ skill: A }) => `Execute skill: ${A}`,
    prompt: async () => d0A(ZO()),
    userFacingName: () => NJ,
    isConcurrencySafe: () => !1,
    isEnabled: () => !0,
    isReadOnly: () => !1,
    async validateInput({ skill: A }, q) { ... },
    async checkPermissions({ skill: A, args: q }, K) { ... },
    async call({ skill: A, args: q }, K, Y, z, w) { ... },
    mapToolResultToToolResultBlockParam(A, q) { ... },
    renderToolResultMessage: bu4,
    renderToolUseMessage: uu4,
    renderToolUseProgressMessage: HP6,
    renderToolUseRejectedMessage: Bu4,
    renderToolUseErrorMessage: mu4
}

// READABLE (for understanding):
const SkillTool = {
    name: "Skill",
    maxResultSizeChars: 100000,

    // Lazily evaluated schemas
    get inputSchema() {
        return z.strictObject({
            skill: z.string().describe('The skill name. E.g., "commit", "review-pr", or "pdf"'),
            args: z.string().optional().describe("Optional arguments for the skill")
        });
    },

    get outputSchema() {
        return z.union([
            // Inline execution result
            z.object({
                success: z.boolean(),
                commandName: z.string(),
                allowedTools: z.array(z.string()).optional(),
                model: z.string().optional(),
                status: z.literal("inline").optional()
            }),
            // Forked execution result
            z.object({
                success: z.boolean(),
                commandName: z.string(),
                status: z.literal("forked"),
                agentId: z.string(),
                result: z.string()
            })
        ]);
    },

    isEnabled: () => true,
    isConcurrencySafe: () => false,  // Skills can have side effects
    isReadOnly: () => false,

    // ... methods detailed below
};

// Mapping: wt→SkillTool, NJ→SKILL_TOOL_NAME, HNY→skillInputSchema, _NY→skillOutputSchema
```

### Input Schema

```javascript
// ============================================
// skillInputSchema - Input schema for Skill tool
// Location: chunks.132.mjs:820-836
// ============================================

// ORIGINAL (for source lookup):
HNY = z7(() => u.object({
    skill: u.string().describe('The skill name. E.g., "commit", "review-pr", or "pdf"'),
    args: u.string().optional().describe("Optional arguments for the skill")
}))

// READABLE (for understanding):
skillInputSchema = lazySchema(() => z.object({
    skill: z.string().describe('The skill name. E.g., "commit", "review-pr", or "pdf"'),
    args: z.string().optional().describe("Optional arguments for the skill")
}))

// Mapping: HNY→skillInputSchema, z7→lazySchema, u→z (zod)
```

### Output Schema

The output schema supports two modes: **inline** and **forked**.

```javascript
// ORIGINAL (for source lookup):
$NY = u.object({
    success: u.boolean().describe("Whether the skill is valid"),
    commandName: u.string().describe("The name of the skill"),
    allowedTools: u.array(u.string()).optional().describe("Tools allowed by this skill"),
    model: u.string().optional().describe("Model override if specified"),
    status: u.literal("inline").optional().describe("Execution status")
})

ONY = u.object({
    success: u.boolean().describe("Whether the skill completed successfully"),
    commandName: u.string().describe("The name of the skill"),
    status: u.literal("forked").describe("Execution status"),
    agentId: u.string().describe("The ID of the sub-agent that executed the skill"),
    result: u.string().describe("The result from the forked skill execution")
})

_NY = z7(() => u.union([$NY, ONY]))

// READABLE (for understanding):
inlineResultSchema = z.object({
    success: z.boolean().describe("Whether the skill is valid"),
    commandName: z.string().describe("The name of the skill"),
    allowedTools: z.array(z.string()).optional().describe("Tools allowed by this skill"),
    model: z.string().optional().describe("Model override if specified"),
    status: z.literal("inline").optional().describe("Execution status")
})

forkedResultSchema = z.object({
    success: z.boolean().describe("Whether the skill completed successfully"),
    commandName: z.string().describe("The name of the skill"),
    status: z.literal("forked").describe("Execution status"),
    agentId: z.string().describe("The ID of the sub-agent that executed the skill"),
    result: z.string().describe("The result from the forked skill execution")
})

skillOutputSchema = lazySchema(() => z.union([inlineResultSchema, forkedResultSchema]))
```

---

## Input Validation

**What it does:** Validates that the skill exists, is of type "prompt", and can be invoked by the LLM.

**How it works:**
1. Trim and strip slash prefix from skill name
2. Load skill registry via `cZ`
3. Check skill exists via `Sd`
4. Load skill definition via `zI`
5. Check `disableModelInvocation` flag
6. Verify skill type is "prompt"

### Error Codes Reference

| Error Code | Meaning | User Message |
|------------|---------|--------------|
| 1 | Invalid format | "Invalid skill format: {input}" |
| 2 | Unknown skill | "Unknown skill: {name}" |
| 3 | Load failure | "Could not load skill: {name}" |
| 4 | Disabled invocation | "Skill {name} cannot be used with Skill tool due to disable-model-invocation" |
| 5 | Wrong type | "Skill {name} is not a prompt-based skill" |

```javascript
// ============================================
// validateInput - Skill validation logic
// Location: chunks.132.mjs:837-873
// ============================================

// ORIGINAL (for source lookup):
async function validateInput({ skill: A }, q) {
    let K = A.trim();
    if (!K) return { result: !1, message: `Invalid skill format: ${A}`, errorCode: 1 };
    let Y = K.startsWith("/");
    if (Y) c("tengu_skill_tool_slash_prefix", {});
    let z = Y ? K.substring(1) : K,
        w = await cZ(ZO());
    if (!Sd(z, w)) return { result: !1, message: `Unknown skill: ${z}`, errorCode: 2 };
    let H = zI(z, w);
    if (!H) return { result: !1, message: `Could not load skill: ${z}`, errorCode: 3 };
    if (H.disableModelInvocation) return {
        result: !1,
        message: `Skill ${z} cannot be used with ${NJ} tool due to disable-model-invocation`,
        errorCode: 4
    };
    if (H.type !== "prompt") return {
        result: !1,
        message: `Skill ${z} is not a prompt-based skill`,
        errorCode: 5
    };
    return { result: !0 }
}

// READABLE (for understanding):
async function validateInput({ skill }, toolUseContext) {
    let trimmedName = skill.trim();
    if (!trimmedName) {
        return { result: false, message: `Invalid skill format: ${skill}`, errorCode: 1 };
    }

    // Strip optional slash prefix
    let hasSlashPrefix = trimmedName.startsWith("/");
    if (hasSlashPrefix) {
        telemetry("tengu_skill_tool_slash_prefix", {});
    }
    let skillName = hasSlashPrefix ? trimmedName.substring(1) : trimmedName;

    // Load skill registry
    let registry = await getSkillRegistry(getSessionContext());

    // Check skill exists
    if (!skillExists(skillName, registry)) {
        return { result: false, message: `Unknown skill: ${skillName}`, errorCode: 2 };
    }

    // Load skill definition
    let skillDef = findSkill(skillName, registry);
    if (!skillDef) {
        return { result: false, message: `Could not load skill: ${skillName}`, errorCode: 3 };
    }

    // Check if model invocation is disabled
    if (skillDef.disableModelInvocation) {
        return {
            result: false,
            message: `Skill ${skillName} cannot be used with Skill tool due to disable-model-invocation`,
            errorCode: 4
        };
    }

    // Verify skill type
    if (skillDef.type !== "prompt") {
        return {
            result: false,
            message: `Skill ${skillName} is not a prompt-based skill`,
            errorCode: 5
        };
    }

    return { result: true };
}

// Mapping: validateInput remains same, A→skill, q→toolUseContext, K→trimmedName, Y→hasSlashPrefix,
// z→skillName, w→registry, H→skillDef, cZ→getSkillRegistry, ZO→getSessionContext, Sd→skillExists,
// zI→findSkill, NJ→TOOL_NAME_SKILL, c→telemetry
```

---

## Permission Handling

**What it does:** Checks deny/allow rules for the skill and prompts for user permission if needed.

**How it works:**
1. Get tool permission context from app state
2. Check deny rules - if matched, block immediately
3. Check allow rules - if matched, allow immediately
4. Check if skill has only safe properties - auto-allow
5. If no rules match, prompt user with suggestions

**Permission matching rules:**
- Exact match: `/skill-name` matches only that skill
- Wildcard match: `/prefix:*` matches all skills starting with `prefix`

```javascript
// ============================================
// checkPermissions - Permission checking
// Location: chunks.132.mjs:875-953
// ============================================

// ORIGINAL (for source lookup):
async function checkPermissions({ skill: A, args: q }, K) {
    let Y = A.trim(),
        z = Y.startsWith("/") ? Y.substring(1) : Y,
        H = (await K.getAppState()).toolPermissionContext,
        $ = await cZ(ZO()),
        O = zI(z, $),
        _ = (j) => {
            let M = j.startsWith("/") ? j.substring(1) : j;
            if (M === z) return !0;
            if (M.endsWith(":*")) {
                let P = M.slice(0, -2);
                return z.startsWith(P)
            }
            return !1
        },
        J = XI(H, wt, "deny");
    for (let [j, M] of J.entries())
        if (_(j)) return {
            behavior: "deny",
            message: "Skill execution blocked by permission rules",
            decisionReason: { type: "rule", rule: M }
        };
    let X = XI(H, wt, "allow");
    for (let [j, M] of X.entries())
        if (_(j)) return {
            behavior: "allow",
            updatedInput: { skill: A, args: q },
            decisionReason: { type: "rule", rule: M }
        };
    if (O?.type === "prompt" && XNY(O)) return {
        behavior: "allow",
        updatedInput: { skill: A, args: q },
        decisionReason: void 0
    };
    let D = [{
        type: "addRules",
        rules: [{ toolName: NJ, ruleContent: z }],
        behavior: "allow",
        destination: "localSettings"
    }, {
        type: "addRules",
        rules: [{ toolName: NJ, ruleContent: `${z}:*` }],
        behavior: "allow",
        destination: "localSettings"
    }];
    return {
        behavior: "ask",
        message: `Execute skill: ${z}`,
        decisionReason: void 0,
        suggestions: D,
        updatedInput: { skill: A, args: q },
        metadata: { command: O }
    }
}

// READABLE (for understanding):
async function checkPermissions({ skill, args }, toolUseContext) {
    let trimmedName = skill.trim();
    let skillName = trimmedName.startsWith("/") ? trimmedName.substring(1) : trimmedName;

    let permissionContext = (await toolUseContext.getAppState()).toolPermissionContext;
    let registry = await getSkillRegistry(getSessionContext());
    let skillDef = findSkill(skillName, registry);

    // Matcher function for rule matching
    let matchesRule = (rulePattern) => {
        let pattern = rulePattern.startsWith("/") ? rulePattern.substring(1) : rulePattern;
        if (pattern === skillName) return true;
        if (pattern.endsWith(":*")) {
            let prefix = pattern.slice(0, -2);
            return skillName.startsWith(prefix);
        }
        return false;
    };

    // Check deny rules first
    let denyRules = getRulesForTool(permissionContext, SkillTool, "deny");
    for (let [rulePattern, rule] of denyRules.entries()) {
        if (matchesRule(rulePattern)) {
            return {
                behavior: "deny",
                message: "Skill execution blocked by permission rules",
                decisionReason: { type: "rule", rule }
            };
        }
    }

    // Check allow rules
    let allowRules = getRulesForTool(permissionContext, SkillTool, "allow");
    for (let [rulePattern, rule] of allowRules.entries()) {
        if (matchesRule(rulePattern)) {
            return {
                behavior: "allow",
                updatedInput: { skill, args },
                decisionReason: { type: "rule", rule }
            };
        }
    }

    // Auto-allow if skill has only safe properties
    if (skillDef?.type === "prompt" && validateSkillProperties(skillDef)) {
        return {
            behavior: "allow",
            updatedInput: { skill, args },
            decisionReason: undefined
        };
    }

    // Generate suggestions for user
    let suggestions = [{
        type: "addRules",
        rules: [{ toolName: TOOL_NAME_SKILL, ruleContent: skillName }],
        behavior: "allow",
        destination: "localSettings"
    }, {
        type: "addRules",
        rules: [{ toolName: TOOL_NAME_SKILL, ruleContent: `${skillName}:*` }],
        behavior: "allow",
        destination: "localSettings"
    }];

    return {
        behavior: "ask",
        message: `Execute skill: ${skillName}`,
        decisionReason: undefined,
        suggestions,
        updatedInput: { skill, args },
        metadata: { command: skillDef }
    };
}

// Mapping: A→skill, q→args, K→toolUseContext, Y→trimmedName, z→skillName, H→permissionContext,
// $→registry, O→skillDef, _→matchesRule, J→denyRules, X→allowRules, XI→getRulesForTool,
// wt→SkillTool, NJ→TOOL_NAME_SKILL, XNY→validateSkillProperties
```

### Safe Properties Check (XNY)

**What it does:** Validates that a skill only contains properties from the allowed set.

**Why this approach:** Skills with only safe properties (like `name`, `description`, `getPromptForCommand`) are considered safe to auto-allow because they don't modify execution context in dangerous ways.

```javascript
// ============================================
// validateSkillProperties - Check if skill has only safe properties
// Location: chunks.132.mjs:752-761
// ============================================

// ORIGINAL (for source lookup):
function XNY(A) {
    for (let q of Object.keys(A)) {
        if (JNY.has(q)) continue;
        let K = A[q];
        if (K === void 0 || K === null) continue;
        if (Array.isArray(K) && K.length === 0) continue;
        if (typeof K === "object" && !Array.isArray(K) && Object.keys(K).length === 0) continue;
        return !1
    }
    return !0
}

// READABLE (for understanding):
function validateSkillProperties(skill) {
    for (let key of Object.keys(skill)) {
        // Skip if key is in allowed set
        if (SKILL_PROPERTY_KEYS.has(key)) continue;

        let value = skill[key];

        // Ignore empty/null/undefined values
        if (value === undefined || value === null) continue;
        if (Array.isArray(value) && value.length === 0) continue;
        if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) continue;

        // Found a non-allowed property with a value
        return false;
    }
    return true;
}

// Mapping: XNY→validateSkillProperties, JNY→SKILL_PROPERTY_KEYS
```

### SKILL_PROPERTY_KEYS Constant

```javascript
// ============================================
// SKILL_PROPERTY_KEYS - Allowed skill properties for auto-allow
// Location: chunks.132.mjs:1073
// ============================================

// ORIGINAL (for source lookup):
JNY = new Set(["type", "progressMessage", "contentLength", "argNames", "model", "source",
    "pluginInfo", "disableNonInteractive", "skillRoot", "context", "agent", "getPromptForCommand",
    "frontmatterKeys", "name", "description", "hasUserSpecifiedDescription", "isEnabled",
    "isHidden", "aliases", "isMcp", "argumentHint", "whenToUse", "version", "disableModelInvocation",
    "userInvocable", "loadedFrom", "immediate", "userFacingName"])

// READABLE (for understanding):
const SKILL_PROPERTY_KEYS = new Set([
    // Core properties
    "type", "name", "description", "version",
    "userFacingName", "userInvocable", "isEnabled", "isHidden",

    // Execution context
    "context", "agent", "model", "source", "skillRoot", "loadedFrom",
    "disableNonInteractive", "disableModelInvocation", "immediate",

    // Prompt generation
    "getPromptForCommand", "progressMessage", "contentLength",
    "argNames", "argumentHint", "whenToUse", "frontmatterKeys",

    // Discovery
    "aliases", "isMcp", "hasUserSpecifiedDescription",

    // Plugin integration
    "pluginInfo"
]);

// Mapping: JNY→SKILL_PROPERTY_KEYS
```

**Key insight:** Properties like `allowedTools` and `hooks` are NOT in this set because they modify the execution context in ways that require user confirmation. Skills with `allowedTools` could gain access to tools the user hasn't approved, and skills with `hooks` could execute arbitrary code.

---

## Execution

### Decision Logic

The skill's `context` property determines execution mode:

| context Value | Execution Mode | Description |
|---------------|----------------|-------------|
| `"fork"` | Forked | Spawns a subagent with isolated context |
| undefined/other | Inline | Executes within current conversation context |

### Inline Execution (Default)

**What it does:** Injects the skill's prompt into the current conversation and returns messages for the LLM to process.

**How it works:**
1. Load skill definition
2. Track skill usage via `xM6`
3. If skill has `context: "fork"`, delegate to forked execution
4. Build prompt messages via `Pb4`
5. Register skill hooks via `IM6`
6. Return messages with `contextModifier` for permission injection

```javascript
// ============================================
// call - Skill execution
// Location: chunks.132.mjs:955-1051
// ============================================

// ORIGINAL (for source lookup):
async function call({ skill: A, args: q }, K, Y, z, w) {
    let H = A.trim(),
        $ = H.startsWith("/") ? H.substring(1) : H,
        O = await cZ(ZO()),
        _ = zI($, O);
    if (xM6($), _?.type === "prompt" && _.context === "fork") return wNY(_, $, q, K, Y, z, w);
    let J = await Pb4($, q || "", O, K);
    if (!J.shouldQuery) throw Error("Command processing failed");
    let X = J.allowedTools || [],
        D = J.model,
        j = J.maxThinkingTokens,
        M = Cd().has($),
        P = _?.type === "prompt" && Uu4(_);
    c("tengu_skill_tool_invocation", {
        command_name: M || P ? $ : "custom",
        ..._?.type === "prompt" && _.pluginInfo && {
            plugin_name: P ? _.pluginInfo.pluginManifest.name : "third-party",
            plugin_repository: P ? _.pluginInfo.repository : "third-party"
        }
    });
    // ... message processing ...
    if (_?.type === "prompt" && _.hooks) {
        let T = U6();
        IM6(K.setAppState, T, _.hooks, $, _.skillRoot)
    }
    return {
        data: {
            success: !0,
            commandName: $,
            allowedTools: X.length > 0 ? X : void 0,
            model: D
        },
        newMessages: f,
        contextModifier(T) {
            let k = T;
            if (X.length > 0) {
                let y = k.getAppState;
                k = {
                    ...k,
                    async getAppState() {
                        let B = await y();
                        return {
                            ...B,
                            toolPermissionContext: {
                                ...B.toolPermissionContext,
                                alwaysAllowRules: {
                                    ...B.toolPermissionContext.alwaysAllowRules,
                                    command: [...new Set([...B.toolPermissionContext.alwaysAllowRules.command || [], ...X])]
                                }
                            }
                        }
                    }
                }
            }
            if (D) k = { ...k, options: { ...k.options, mainLoopModel: D } };
            if (j !== void 0) k = { ...k, options: { ...k.options, maxThinkingTokens: j } };
            return k
        }
    }
}

// READABLE (for understanding):
async function call({ skill, args }, toolUseContext, abortSignal, agentContext, progressCallback) {
    let trimmedName = skill.trim();
    let skillName = trimmedName.startsWith("/") ? trimmedName.substring(1) : trimmedName;

    let registry = await getSkillRegistry(getSessionContext());
    let skillDef = findSkill(skillName, registry);

    // Track usage for skill scoring
    trackSkillUsage(skillName);

    // Check if forked execution is needed
    if (skillDef?.type === "prompt" && skillDef.context === "fork") {
        return executeForkedSkill(skillDef, skillName, args, toolUseContext, abortSignal, agentContext, progressCallback);
    }

    // Build prompt messages
    let commandResult = await buildCommandMessages(skillName, args || "", registry, toolUseContext);
    if (!commandResult.shouldQuery) {
        throw new Error("Command processing failed");
    }

    let allowedTools = commandResult.allowedTools || [];
    let modelOverride = commandResult.model;
    let maxThinkingTokens = commandResult.maxThinkingTokens;
    let isBuiltin = isBuiltinSkill(skillName);
    let isPluginSkill = skillDef?.type === "prompt" && isPluginSkillSource(skillDef);

    // Telemetry
    telemetry("tengu_skill_tool_invocation", {
        command_name: isBuiltin || isPluginSkill ? skillName : "custom",
        ...(skillDef?.type === "prompt" && skillDef.pluginInfo && {
            plugin_name: isPluginSkill ? skillDef.pluginInfo.pluginManifest.name : "third-party",
            plugin_repository: isPluginSkill ? skillDef.pluginInfo.repository : "third-party"
        })
    });

    // Register hooks if skill has them
    if (skillDef?.type === "prompt" && skillDef.hooks) {
        let sessionId = getSessionId();
        registerSkillHooks(toolUseContext.setAppState, sessionId, skillDef.hooks, skillName, skillDef.skillRoot);
    }

    return {
        data: {
            success: true,
            commandName: skillName,
            allowedTools: allowedTools.length > 0 ? allowedTools : undefined,
            model: modelOverride
        },
        newMessages: processedMessages,
        contextModifier(originalContext) {
            let modifiedContext = originalContext;

            // Inject allowed tools into permission context
            if (allowedTools.length > 0) {
                let originalGetAppState = modifiedContext.getAppState;
                modifiedContext = {
                    ...modifiedContext,
                    async getAppState() {
                        let state = await originalGetAppState();
                        return {
                            ...state,
                            toolPermissionContext: {
                                ...state.toolPermissionContext,
                                alwaysAllowRules: {
                                    ...state.toolPermissionContext.alwaysAllowRules,
                                    command: [...new Set([
                                        ...(state.toolPermissionContext.alwaysAllowRules.command || []),
                                        ...allowedTools
                                    ])]
                                }
                            }
                        };
                    }
                };
            }

            // Apply model override
            if (modelOverride) {
                modifiedContext = {
                    ...modifiedContext,
                    options: { ...modifiedContext.options, mainLoopModel: modelOverride }
                };
            }

            // Apply thinking tokens override
            if (maxThinkingTokens !== undefined) {
                modifiedContext = {
                    ...modifiedContext,
                    options: { ...modifiedContext.options, maxThinkingTokens }
                };
            }

            return modifiedContext;
        }
    };
}

// Mapping: A→skill, q→args, K→toolUseContext, Y→abortSignal, z→agentContext, w→progressCallback,
// H→trimmedName, $→skillName, O→registry, _→skillDef, xM6→trackSkillUsage, cZ→getSkillRegistry,
// zI→findSkill, wNY→executeForkedSkill, Pb4→buildCommandMessages, IM6→registerSkillHooks,
// U6→getSessionId, Cd→isBuiltinSkill, Uu4→isPluginSkillSource, c→telemetry
```

### Forked Execution (wNY)

**What it does:** Launches a sub-agent with isolated context to execute the skill, returning results asynchronously.

**How it works:**
1. Generate unique agent ID
2. Prepare fork context (skill content, modified app state, base agent)
3. Run agent loop in isolated context
4. Stream progress back to main conversation
5. Return result when complete

**Why forked execution:**
- **Isolation** - skill runs in fresh context, not cluttering main conversation
- **Self-contained** - skill can have its own tool calls without affecting main session
- **Async capability** - skill can run while main conversation continues

```javascript
// ============================================
// executeForkedSkill - Forked skill execution
// Location: chunks.132.mjs:693-750
// ============================================

// ORIGINAL (for source lookup):
async function wNY(A, q, K, Y, z, w, H) {
    let $ = Date.now(),
        O = NR(),
        _ = Uu4(A);
    c("tengu_skill_tool_invocation", {
        command_name: "custom",
        execution_context: "fork",
        ...!1,
        ...A.pluginInfo && {
            plugin_name: _ ? A.pluginInfo.pluginManifest.name : "third-party",
            plugin_repository: _ ? A.pluginInfo.repository : "third-party"
        }
    });
    let { modifiedGetAppState: J, baseAgent: X, promptMessages: D, skillContent: j }
        = await mM6(A, K || "", Y), M = [];
    h(`SkillTool executing forked skill ${q} with agent ${X.agentType}`);
    for await (let G of dR({
        agentDefinition: X,
        promptMessages: D,
        toolUseContext: { ...Y, getAppState: J },
        canUseTool: z,
        isAsync: !1,
        querySource: "agent:custom",
        model: A.model,
        availableTools: Y.options.tools
    })) {
        if (M.push(G), (G.type === "assistant" || G.type === "user") && H) {
            let f = iO(M);
            for (let Z of iO([G]))
                if (Z.message.content.some((T) => T.type === "tool_use" || T.type === "tool_result"))
                    H({
                        toolUseID: `skill_${w.message.id}`,
                        data: {
                            message: Z,
                            normalizedMessages: f,
                            type: "skill_progress",
                            prompt: j,
                            agentId: O
                        }
                    })
        }
    }
    let P = FM6(M, "Skill execution completed"),
        W = Date.now() - $;
    return h(`SkillTool forked skill ${q} completed in ${W}ms`), {
        data: {
            success: !0,
            commandName: q,
            status: "forked",
            agentId: O,
            result: P
        }
    }
}

// READABLE (for understanding):
async function executeForkedSkill(skillDefinition, skillName, args, toolUseContext, canUseTool, parentMessage, reportProgress) {
    let startTime = Date.now();
    let agentId = generateAgentId();

    // Check if plugin skill
    let isPluginSkill = isPluginFirstParty(skillDefinition);

    // Emit telemetry
    emitTelemetry("tengu_skill_tool_invocation", {
        command_name: "custom",
        execution_context: "fork",
        ...skillDefinition.pluginInfo && {
            plugin_name: isPluginSkill ? skillDefinition.pluginInfo.pluginManifest.name : "third-party",
            plugin_repository: isPluginSkill ? skillDefinition.pluginInfo.repository : "third-party"
        }
    });

    // Setup forked context
    let { modifiedGetAppState, baseAgent, promptMessages, skillContent } =
        await setupForkedCommandContext(skillDefinition, args || "", toolUseContext);

    let messages = [];

    debug(`SkillTool executing forked skill ${skillName} with agent ${baseAgent.agentType}`);

    // Run the agent loop
    for await (let event of runAgentLoop({
        agentDefinition: baseAgent,
        promptMessages: promptMessages,
        toolUseContext: { ...toolUseContext, getAppState: modifiedGetAppState },
        canUseTool: canUseTool,
        isAsync: false,
        querySource: "agent:custom",
        model: skillDefinition.model,
        availableTools: toolUseContext.options.tools
    })) {
        messages.push(event);

        // Report progress if callback provided
        if ((event.type === "assistant" || event.type === "user") && reportProgress) {
            let normalizedMessages = normalizeMessages(messages);

            for (let normalizedEvent of normalizeMessages([event])) {
                if (normalizedEvent.message.content.some(
                    content => content.type === "tool_use" || content.type === "tool_result"
                )) {
                    reportProgress({
                        toolUseID: `skill_${parentMessage.message.id}`,
                        data: {
                            message: normalizedEvent,
                            normalizedMessages: normalizedMessages,
                            type: "skill_progress",
                            prompt: skillContent,
                            agentId: agentId
                        }
                    });
                }
            }
        }
    }

    // Extract result
    let result = extractForkedCommandResult(messages, "Skill execution completed");
    let duration = Date.now() - startTime;

    debug(`SkillTool forked skill ${skillName} completed in ${duration}ms`);

    return {
        data: {
            success: true,
            commandName: skillName,
            status: "forked",
            agentId: agentId,
            result: result
        }
    };
}

// Mapping: wNY→executeForkedSkill, NR→generateAgentId, Uu4→isPluginFirstParty,
// mM6→setupForkedCommandContext, dR→runAgentLoop, FM6→extractForkedCommandResult
```

---

## Progress Message Handling

### skill_progress Attachment Type

When a skill executes in forked mode, progress messages are sent via the `reportProgress` callback. These appear as attachments in the UI.

```javascript
// Progress message structure
{
    toolUseID: `skill_${parentMessageId}`,
    data: {
        message: normalizedEvent,          // The assistant/user message
        normalizedMessages: [...],          // Full conversation so far
        type: "skill_progress",             // Attachment type identifier
        prompt: skillContent,               // The skill's prompt text
        agentId: agentId                    // Subagent ID
    }
}
```

**Key insight:** Progress messages are only sent when the subagent performs a tool operation (tool_use or tool_result in content). This prevents noise from pure text responses.

---

## Result Mapping

The tool maps results differently based on execution mode:

```javascript
// ============================================
// mapToolResultToToolResultBlockParam - Result mapping
// Location: chunks.132.mjs:1053-1067
// ============================================

// ORIGINAL (for source lookup):
mapToolResultToToolResultBlockParam(A, q) {
    if ("status" in A && A.status === "forked") return {
        type: "tool_result",
        tool_use_id: q,
        content: `Skill "${A.commandName}" completed (forked execution).\n\nResult:\n${A.result}`
    };
    return {
        type: "tool_result",
        tool_use_id: q,
        content: `Launching skill: ${A.commandName}`
    }
}

// READABLE (for understanding):
mapToolResultToToolResultBlockParam(result, toolUseId) {
    if ("status" in result && result.status === "forked") {
        return {
            type: "tool_result",
            tool_use_id: toolUseId,
            content: `Skill "${result.commandName}" completed (forked execution).\n\nResult:\n${result.result}`
        };
    }
    return {
        type: "tool_result",
        tool_use_id: toolUseId,
        content: `Launching skill: ${result.commandName}`
    };
}
```

**Key insight:** For inline execution, the result message is brief ("Launching skill: X") because the actual skill content is injected into the conversation via `newMessages`. For forked execution, the result includes the full output from the sub-agent.

---

## Telemetry Events

### Event Types

| Event Name | When Fired | Data |
|------------|------------|------|
| `tengu_skill_tool_invocation` | Skill tool is invoked | `command_name`, `execution_context`, plugin info |
| `tengu_skill_tool_slash_prefix` | Skill name starts with "/" | `{}` |

### command_name Logic

```javascript
// Builtin skills: actual skill name
// Custom skills: "custom"

let commandName = (isBuiltinSkill(skillName) || isPluginFirstParty(skillDefinition))
    ? skillName
    : "custom";
```

---

## Design Rationale

### Why Two Execution Modes?

**Inline (default):**
- **Lower latency** - no sub-agent overhead
- **Shared context** - skill can reference earlier conversation
- **Simpler debugging** - all messages in one place

**Forked (context: fork):**
- **Isolation** - skill doesn't pollute main conversation
- **Independent tool calls** - skill can make extensive tool use
- **Parallel capability** - multiple forked skills can run concurrently

### Why Permission Injection via contextModifier?

The `contextModifier` function allows the skill's `allowedTools` to be injected into the permission context without modifying global state:
- **Scoped permissions** - tools are only allowed during skill execution
- **Clean separation** - skill permissions don't leak to other operations
- **Dynamic injection** - works for inline execution where context is shared

### Why Track Skill Usage?

The `trackSkillUsage` function (`xM6`) records when skills are invoked:
- **Usage scoring** - enables skill ranking in listings
- **Popularity metrics** - telemetry for improving skill recommendations
- **Decay function** - older usage counts less (half-life of 7 days)

### Why Safe Properties Auto-Allow?

The `SKILL_PROPERTY_KEYS` set identifies properties that don't change execution behavior in security-relevant ways. Skills with only these properties are safe to auto-allow because:

1. They can't gain access to additional tools (`allowedTools` not in set)
2. They can't execute code via hooks (`hooks` not in set)
3. They only provide prompt text that the LLM can choose to follow or ignore

**Trade-off:** This is a heuristic. A skill with only `getPromptForCommand` could still provide malicious instructions. The assumption is that if the user loaded the skill, they trust its prompts.

### Why Permission Suggestions?

When asking for permission, the tool provides suggestions to:
1. Allow this specific skill (`skillName`)
2. Allow this skill and its variants (`skillName:*`)

This reduces friction for future invocations of the same skill while maintaining explicit user consent.