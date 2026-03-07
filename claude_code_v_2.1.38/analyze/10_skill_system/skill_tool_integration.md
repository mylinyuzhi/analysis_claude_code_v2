# Skill Tool Integration - Deep Analysis (Claude Code 2.1.38)

## Overview

The Skill tool (`wt`) is the primary interface for invoking skills programmatically. It bridges the LLM's tool-calling capability with the skill execution system, allowing skills to be triggered either by the user (via `/command` syntax) or by the LLM (via the Skill tool). This document covers the integration between the Skill tool and the broader tool execution pipeline.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skill System section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `SkillTool` (wt) - The tool object for skill invocation - chunks.132.mjs:820-1073
- `SKILL_TOOL_NAME` (NJ) - Constant "Skill" - chunks.132.mjs:821
- `SKILL_PROPERTY_KEYS` (JNY) - Set of allowed skill properties - chunks.132.mjs:1073
- `validateSkillProperties` (XNY) - Validate skill has only allowed properties - chunks.132.mjs:752-761
- `executeForkedSkill` (wNY) - Execute skill in forked context - chunks.132.mjs:693-750
- `recordSkillUsage` (xM6) - Track skill usage for ranking - chunks.130.mjs:1383-1397

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

## Skill Tool Definition (wt)

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

---

## Input Validation

### validateInput Method

**What it does:** Validates the skill name and checks if the skill can be invoked via the Skill tool.

**How it works:**
1. Trims whitespace from skill name
2. Strips leading "/" if present (allows `/name` syntax)
3. Looks up skill in registry
4. Checks `disableModelInvocation` flag
5. Verifies skill is prompt-based

```javascript
// ============================================
// validateInput - Input validation for skill invocation
// Location: chunks.132.mjs:837-873
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ skill: A }, q) {
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
async validateInput({ skill: skillName }, toolUseContext) {
    let trimmed = skillName.trim();

    // Error code 1: Empty or invalid format
    if (!trimmed) {
        return {
            result: false,
            message: `Invalid skill format: ${skillName}`,
            errorCode: 1
        };
    }

    // Handle "/" prefix (allows /name syntax)
    let hasSlashPrefix = trimmed.startsWith("/");
    if (hasSlashPrefix) {
        emitTelemetry("tengu_skill_tool_slash_prefix", {});
    }

    let skillNameWithoutPrefix = hasSlashPrefix
        ? trimmed.substring(1)
        : trimmed;

    // Look up skill in registry
    let registry = await getSkillRegistry();
    if (!skillExists(skillNameWithoutPrefix, registry)) {
        return {
            result: false,
            message: `Unknown skill: ${skillNameWithoutPrefix}`,
            errorCode: 2
        };
    }

    let skillDefinition = lookupSkill(skillNameWithoutPrefix, registry);
    if (!skillDefinition) {
        return {
            result: false,
            message: `Could not load skill: ${skillNameWithoutPrefix}`,
            errorCode: 3
        };
    }

    // Error code 4: Skill disabled for LLM invocation
    if (skillDefinition.disableModelInvocation) {
        return {
            result: false,
            message: `Skill ${skillNameWithoutPrefix} cannot be used with Skill tool due to disable-model-invocation`,
            errorCode: 4
        };
    }

    // Error code 5: Not a prompt-based skill
    if (skillDefinition.type !== "prompt") {
        return {
            result: false,
            message: `Skill ${skillNameWithoutPrefix} is not a prompt-based skill`,
            errorCode: 5
        };
    }

    return { result: true };
}

// Mapping: c→emitTelemetry, cZ→getSkillRegistry, Sd→skillExists, zI→lookupSkill
```

### Error Codes Reference

| Error Code | Meaning | User Message |
|------------|---------|--------------|
| 1 | Invalid format | "Invalid skill format: {input}" |
| 2 | Unknown skill | "Unknown skill: {name}" |
| 3 | Load failure | "Could not load skill: {name}" |
| 4 | Disabled invocation | "Skill {name} cannot be used with Skill tool due to disable-model-invocation" |
| 5 | Wrong type | "Skill {name} is not a prompt-based skill" |

---

## Permission Checking

### checkPermissions Method

**What it does:** Determines whether the skill invocation should be allowed, denied, or require user confirmation.

**How it works:**
1. Check deny rules first (block if matched)
2. Check allow rules (approve if matched)
3. Auto-allow if skill has only safe properties
4. Otherwise, ask user for permission

```javascript
// ============================================
// checkPermissions - Permission flow for skill invocation
// Location: chunks.132.mjs:875-953
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions({ skill: A, args: q }, K) {
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
    let D = [{ type: "addRules", rules: [{ toolName: NJ, ruleContent: z }],
               behavior: "allow", destination: "localSettings" },
             { type: "addRules", rules: [{ toolName: NJ, ruleContent: `${z}:*` }],
               behavior: "allow", destination: "localSettings" }];
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
async checkPermissions({ skill, args }, toolUseContext) {
    let trimmed = skill.trim();
    let skillName = trimmed.startsWith("/") ? trimmed.substring(1) : trimmed;

    let permissionContext = (await toolUseContext.getAppState()).toolPermissionContext;
    let registry = await getSkillRegistry();
    let skillDefinition = lookupSkill(skillName, registry);

    // Helper: Check if a rule pattern matches this skill
    const matchesSkill = (pattern) => {
        let normalizedPattern = pattern.startsWith("/") ? pattern.substring(1) : pattern;

        // Exact match
        if (normalizedPattern === skillName) return true;

        // Wildcard match: "prefix:*"
        if (normalizedPattern.endsWith(":*")) {
            let prefix = normalizedPattern.slice(0, -2);
            return skillName.startsWith(prefix);
        }

        return false;
    };

    // Step 1: Check deny rules (immediate block)
    let denyRules = getRulesForTool(permissionContext, SkillTool, "deny");
    for (let [pattern, rule] of denyRules.entries()) {
        if (matchesSkill(pattern)) {
            return {
                behavior: "deny",
                message: "Skill execution blocked by permission rules",
                decisionReason: { type: "rule", rule: rule }
            };
        }
    }

    // Step 2: Check allow rules (immediate approve)
    let allowRules = getRulesForTool(permissionContext, SkillTool, "allow");
    for (let [pattern, rule] of allowRules.entries()) {
        if (matchesSkill(pattern)) {
            return {
                behavior: "allow",
                updatedInput: { skill, args },
                decisionReason: { type: "rule", rule: rule }
            };
        }
    }

    // Step 3: Auto-allow if skill has only safe properties
    if (skillDefinition?.type === "prompt" && validateSkillProperties(skillDefinition)) {
        return {
            behavior: "allow",
            updatedInput: { skill, args },
            decisionReason: undefined
        };
    }

    // Step 4: Ask user for permission
    let suggestions = [
        {
            type: "addRules",
            rules: [{ toolName: "Skill", ruleContent: skillName }],
            behavior: "allow",
            destination: "localSettings"
        },
        {
            type: "addRules",
            rules: [{ toolName: "Skill", ruleContent: `${skillName}:*` }],
            behavior: "allow",
            destination: "localSettings"
        }
    ];

    return {
        behavior: "ask",
        message: `Execute skill: ${skillName}`,
        decisionReason: undefined,
        suggestions: suggestions,
        updatedInput: { skill, args },
        metadata: { command: skillDefinition }
    };
}

// Mapping: XI→getRulesForTool, XNY→validateSkillProperties
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

## Execution: Inline vs Forked

### Decision Logic

The skill's `context` property determines execution mode:

| context Value | Execution Mode | Description |
|---------------|----------------|-------------|
| `"fork"` | Forked | Spawns a subagent with isolated context |
| undefined/other | Inline | Executes within current conversation context |

### Inline Execution

**What it does:** Returns messages to be added to the current conversation, allowing the skill to influence the ongoing LLM response.

**How it works:**
1. Call `handlePromptCommandFromTool` (Pb4) to process skill
2. Record skill usage for ranking
3. Register hooks if skill defines them
4. Return `newMessages` and `contextModifier`

```javascript
// ============================================
// Inline skill execution (from SkillTool.call)
// Location: chunks.132.mjs:963-1051
// ============================================

// Readable pseudocode for inline execution:
async function executeInlineSkill(skillDefinition, skillName, args, toolUseContext) {
    // Process the skill and get messages
    let result = await handlePromptCommandFromTool(skillName, args || "", registry, toolUseContext);

    if (!result.shouldQuery) {
        throw Error("Command processing failed");
    }

    let allowedTools = result.allowedTools || [];
    let model = result.model;
    let maxThinkingTokens = result.maxThinkingTokens;

    // Record usage for ranking
    recordSkillUsage(skillName);

    // Emit telemetry
    emitTelemetry("tengu_skill_tool_invocation", {
        command_name: isBuiltinSkill(skillName) ? skillName : "custom",
        // ... plugin info if applicable
    });

    // Register hooks if skill has them
    if (skillDefinition?.type === "prompt" && skillDefinition.hooks) {
        let agentId = getCurrentAgentId();
        registerSkillHooks(
            toolUseContext.setAppState,
            agentId,
            skillDefinition.hooks,
            skillName,
            skillDefinition.skillRoot
        );
    }

    // Return result with context modifier
    return {
        data: {
            success: true,
            commandName: skillName,
            allowedTools: allowedTools.length > 0 ? allowedTools : undefined,
            model: model
        },
        newMessages: result.messages,
        contextModifier(ctx) {
            // Apply allowedTools restriction
            if (allowedTools.length > 0) {
                ctx = {
                    ...ctx,
                    async getAppState() {
                        let state = await ctx.getAppState();
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
            if (model) {
                ctx = {
                    ...ctx,
                    options: { ...ctx.options, mainLoopModel: model }
                };
            }

            // Apply thinking tokens limit
            if (maxThinkingTokens !== undefined) {
                ctx = {
                    ...ctx,
                    options: { ...ctx.options, maxThinkingTokens: maxThinkingTokens }
                };
            }

            return ctx;
        }
    };
}
```

### Forked Execution (wNY)

**What it does:** Spawns a subagent to execute the skill in an isolated context.

**How it works:**
1. Create forked execution context
2. Run agent loop with skill's prompt
3. Stream progress messages back
4. Collect and return final result

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

## Tool Result Mapping

### Inline Result

```javascript
{
    type: "tool_result",
    tool_use_id: toolUseId,
    content: `Launching skill: ${commandName}`
}
```

### Forked Result

```javascript
{
    type: "tool_result",
    tool_use_id: toolUseId,
    content: `Skill "${commandName}" completed (forked execution).\n\nResult:\n${result}`
}
```

---

## Design Rationale

### Why Two Execution Modes?

**Inline execution** is simpler and cheaper. The skill's prompt is added to the conversation, and the main agent responds to it. This is appropriate when:
- The skill doesn't need isolated context
- The skill benefits from conversation history
- The user wants to steer the process mid-execution

**Forked execution** provides isolation and independent operation. A subagent handles the skill with its own context. This is appropriate when:
- The skill is self-contained (doesn't need conversation history)
- The skill should operate independently
- The skill might take many turns and shouldn't pollute main context

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