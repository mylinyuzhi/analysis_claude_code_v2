# Skill System - Skill Tool Implementation (Claude Code 2.1.38)

## Overview

The Skill tool (`wt`) is the primary mechanism for invoking skills programmatically. It validates skill existence, checks permissions, and executes skills either inline (injecting prompts into the current conversation) or forked (launching a sub-agent with isolated context).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `SkillTool` (wt) - Tool definition object, chunks.132.mjs:820-1073
- `validateSkillInput` - Input validation logic, chunks.132.mjs:837-873
- `checkSkillPermissions` - Permission checking, chunks.132.mjs:875-953
- `executeSkillCall` - Skill execution, chunks.132.mjs:955-1051
- `executeForkedSkill` (cfY) - Forked skill execution, chunks.130.mjs:1411-1459
- `getSkillRegistry` (cZ) - Get skill registry, chunks.168.mjs
- `findSkill` (zI) - Find skill by name, chunks.168.mjs
- `skillExists` (Sd) - Check skill exists, chunks.168.mjs

---

## Tool Definition

### Input Schema

```javascript
// ============================================
// SkillTool - Tool definition
// Location: chunks.132.mjs:820-1073
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

**Error codes:**
| Code | Meaning |
|------|---------|
| 1 | Invalid skill format (empty name) |
| 2 | Unknown skill (not in registry) |
| 3 | Could not load skill |
| 4 | Skill has `disableModelInvocation: true` |
| 5 | Skill is not prompt-based |

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
4. Check if skill has `allowedTools` configured - auto-allow
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

    // Auto-allow if skill has allowedTools configured (already trusted)
    if (skillDef?.type === "prompt" && hasAllowedTools(skillDef)) {
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
// wt→SkillTool, NJ→TOOL_NAME_SKILL, XNY→hasAllowedTools
```

---

## Execution

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

### Forked Execution

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
// Location: chunks.130.mjs:1411-1459
// ============================================

// ORIGINAL (for source lookup):
async function cfY(A, q, K, Y, z, w, H) {
    let $ = NR(); // Generate agent ID
    c("tengu_slash_command_forked", { command_name: A.name });
    let { skillContent: O, modifiedGetAppState: _, baseAgent: J, promptMessages: X } = await mM6(A, q, K),
        D = [], j = [], M = `forked-command-${A.name}`, P = 0,
        W = (N) => {
            return P++, {
                type: "progress",
                data: { message: N, normalizedMessages: j, type: "agent_progress", prompt: O, agentId: $ },
                parentToolUseID: M,
                toolUseID: `${M}-${P}`,
                timestamp: new Date().toISOString(),
                uuid: dfY()
            }
        },
        G = () => {
            H({
                jsx: rP1(D, { tools: K.options.tools, verbose: !1 }),
                shouldHidePromptInput: !1,
                shouldContinueAnimation: !0,
                showSpinner: !0
            })
        };
    G();
    try {
        for await (let N of dR({
            agentDefinition: J,
            promptMessages: X,
            toolUseContext: { ...K, ... },
            ...
        })) {
            // Process agent loop events...
        }
    } catch (N) { /* Error handling */ }
    // Return forked result
}

// READABLE (for understanding):
async function executeForkedSkill(skillDef, skillName, args, toolUseContext, abortSignal, agentContext, progressCallback) {
    let agentId = generateAgentId();

    telemetry("tengu_slash_command_forked", { command_name: skillDef.name });

    // Prepare fork context
    let { skillContent, modifiedGetAppState, baseAgent, promptMessages } = await setupForkedCommandContext(
        skillDef, args, toolUseContext
    );

    let messageLog = [];
    let normalizedMessages = [];
    let progressId = `forked-command-${skillDef.name}`;
    let progressCount = 0;

    // Progress callback for UI updates
    let reportProgress = (message) => {
        progressCount++;
        return {
            type: "progress",
            data: {
                message,
                normalizedMessages,
                type: "agent_progress",
                prompt: skillContent,
                agentId
            },
            parentToolUseID: progressId,
            toolUseID: `${progressId}-${progressCount}`,
            timestamp: new Date().toISOString(),
            uuid: generateUUID()
        };
    };

    let updateUI = () => {
        progressCallback({
            jsx: renderMessages(messageLog, { tools: toolUseContext.options.tools, verbose: false }),
            shouldHidePromptInput: false,
            shouldContinueAnimation: true,
            showSpinner: true
        });
    };

    updateUI();

    try {
        // Run agent loop in isolated context
        for await (let event of agentLoopRunner({
            agentDefinition: baseAgent,
            promptMessages,
            toolUseContext: { ...toolUseContext, ... },
            ...
        })) {
            // Process events and update UI
        }
    } catch (error) {
        // Error handling
    }

    // Return forked result with agent ID and output
    return {
        success: true,
        commandName: skillName,
        status: "forked",
        agentId,
        result: finalOutput
    };
}

// Mapping: cfY→executeForkedSkill, A→skillDef, q→skillName, K→args, Y→toolUseContext,
// z→abortSignal, w→agentContext, H→progressCallback, NR→generateAgentId, mM6→setupForkedCommandContext,
// dR→agentLoopRunner, rP1→renderMessages, dfY→generateUUID
```

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