# Slash Command Integration (Claude Code 2.1.76)

> Complete analysis of the slash command system: how user commands are expanded into prompts, the SkillTool implementation, prompt template resolution, and integration with the LLM request pipeline.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `SkillTool` (m66) - Tool that executes slash commands and skills (VERIFIED: chunks.137.mjs:46-250)
- `getSkills` (I0) - Discovers available skills from directories
- `loadSkill` (zI) - Loads a specific skill's definition
- `findSkillByName` (G66) - Finds a skill by name from the skill set
- `agentLoopRunner` (dR) - Runs a subagent for forked skill execution
- `TOOL_NAME_SKILL` (oH) - Constant "Skill"
- `isSafePromptSkill` ($kY) - Checks if skill is safe for auto-approval
- `processPromptSlashCommand` (j) - Processes inline skill execution

---

## Architecture Overview

Slash commands (skills) are user-defined prompts that can be invoked via `/command` syntax:

```
USER INPUT PARSING
User types: "/commit"
      └──► LLM generates tool_use block:
             { name: "Skill", input: { skill: "commit" } }

SKILL LOOKUP & RESOLUTION
SkillTool.validateInput()
      ├──► cZ() - Get all available skills
      ├──► Sd() - Check if skill exists
      └──► zI() - Load skill definition

EXECUTION MODES
├── Mode 1: Inline Execution (inject prompt into context)
└── Mode 2: Forked Execution (spawn subagent with skill prompt)
```

---

## Core Components

### SkillTool Definition (m66) - VERIFIED

**What it does:**
The `SkillTool` (m66) is a tool that allows the LLM to execute user-defined skills. It handles skill lookup, validation, permission checking, and execution with both inline and forked modes.

**Source Code (VERIFIED):**

```javascript
// ============================================
// SkillTool - Tool for executing slash commands and skills
// Location: chunks.137.mjs:46-250
// ============================================

// ORIGINAL (for source lookup):
m66 = {
    name: oH,
    searchHint: "invoke a slash-command skill",
    maxResultSizeChars: 1e5,
    get inputSchema() {
        return _kY()
    },
    get outputSchema() {
        return wkY()
    },
    description: async ({
        skill: A
    }) => `Execute skill: ${A}`,
    prompt: async () => dP1(qY()),
    userFacingName: () => oH,
    isConcurrencySafe: () => !1,
    isEnabled: () => !0,
    isReadOnly: () => !1,
    toAutoClassifierInput: () => "",
    async validateInput({
        skill: A
    }, q) {
        let K = A.trim();
        if (!K) return {
            result: !1,
            message: `Invalid skill format: ${A}`,
            errorCode: 1
        };
        let Y = K.startsWith("/");
        if (Y) d("tengu_skill_tool_slash_prefix", {});
        let z = Y ? K.substring(1) : K,
            _ = await I0(qY()),
            w = G66(z, _);
        if (!w) return {
            result: !1,
            message: `Unknown skill: ${z}`,
            errorCode: 2
        };
        if (w.disableModelInvocation) return {
            result: !1,
            message: `Skill ${z} cannot be used with ${oH} tool due to disable-model-invocation`,
            errorCode: 4
        };
        if (w.type !== "prompt") return {
            result: !1,
            message: `Skill ${z} is not a prompt-based skill`,
            errorCode: 5
        };
        return {
            result: !0
        }
    },
    async checkPermissions({
        skill: A,
        args: q
    }, K) {
        let Y = A.trim(),
            z = Y.startsWith("/") ? Y.substring(1) : Y,
            w = K.getAppState().toolPermissionContext,
            O = await I0(qY()),
            $ = G66(z, O),
            H = (D) => {
                let X = D.startsWith("/") ? D.substring(1) : D;
                if (X === z) return !0;
                if (X.endsWith(":*")) {
                    let P = X.slice(0, -2);
                    return z.startsWith(P)
                }
                return !1
            },
            j = Sb(w, m66, "deny");
        for (let [D, X] of j.entries())
            if (H(D)) return {
                behavior: "deny",
                message: "Skill execution blocked by permission rules",
                decisionReason: {
                    type: "rule",
                    rule: X
                }
            };
        let J = Sb(w, m66, "allow");
        for (let [D, X] of J.entries())
            if (H(D)) return {
                behavior: "allow",
                updatedInput: {
                    skill: A,
                    args: q
                },
                decisionReason: {
                    type: "rule",
                    rule: X
                }
            };
        if ($?.type === "prompt" && $kY($)) return {
            behavior: "allow",
            updatedInput: {
                skill: A,
                args: q
            },
            decisionReason: void 0
        };
        // ... ask user for permission ...
    },
    async call({
        skill: A,
        args: q
    }, K, Y, z, _) {
        let w = A.trim(),
            O = w.startsWith("/") ? w.substring(1) : w,
            $ = await I0(qY()),
            H = G66(O, $);
        if (ON1(O), H?.type === "prompt" && H.context === "fork")
            return zkY(H, O, q, K, Y, z, _);  // Forked execution
        let {
            processPromptSlashCommand: j
        } = await Promise.resolve().then(() => (MN1(), JN1)),
            J = await j(O, q || "", $, K);  // Inline execution
        if (!J.shouldQuery) throw Error("Command processing failed");
        // ... return result with contextModifier ...
    }
}

// READABLE (for understanding):
const SkillTool = {
    name: "Skill",
    searchHint: "invoke a slash-command skill",
    maxResultSizeChars: 100000,

    get inputSchema() {
        return getSkillInputSchema();
    },

    get outputSchema() {
        return getSkillOutputSchema();
    },

    description: async ({ skill }) => `Execute skill: ${skill}`,

    prompt: async () => buildSkillPrompt(getAllSkillDirectories()),

    userFacingName: () => "Skill",

    isConcurrencySafe: () => false,  // Skills can modify state
    isEnabled: () => true,
    isReadOnly: () => false,
    toAutoClassifierInput: () => "",

    async validateInput({ skill }, context) {
        let skillName = skill.trim();

        // 1. Check for empty skill name
        if (!skillName) {
            return {
                result: false,
                message: `Invalid skill format: ${skill}`,
                errorCode: 1
            };
        }

        // 2. Handle "/" prefix (e.g., "/commit")
        let hasSlashPrefix = skillName.startsWith("/");
        if (hasSlashPrefix) {
            logEvent("tengu_skill_tool_slash_prefix", {});
        }
        let skillNameWithoutSlash = hasSlashPrefix
            ? skillName.substring(1)
            : skillName;

        // 3. Look up skill in available skills
        let skills = await getSkills(getAllSkillDirectories());
        let skillDefinition = findSkillByName(skillNameWithoutSlash, skills);

        // 4. Check if skill exists
        if (!skillDefinition) {
            return {
                result: false,
                message: `Unknown skill: ${skillNameWithoutSlash}`,
                errorCode: 2
            };
        }

        // 5. Check if skill allows model invocation
        if (skillDefinition.disableModelInvocation) {
            return {
                result: false,
                message: `Skill ${skillNameWithoutSlash} cannot be used with Skill tool due to disable-model-invocation`,
                errorCode: 4
            };
        }

        // 6. Check if skill is prompt-based
        if (skillDefinition.type !== "prompt") {
            return {
                result: false,
                message: `Skill ${skillNameWithoutSlash} is not a prompt-based skill`,
                errorCode: 5
            };
        }

        return { result: true };
    },

    async checkPermissions({ skill, args }, context) {
        let skillName = skill.trim();
        let skillNameWithoutSlash = skillName.startsWith("/")
            ? skillName.substring(1)
            : skillName;

        let permissionContext = context.getAppState().toolPermissionContext;
        let skills = await getSkills(getAllSkillDirectories());
        let skillDefinition = findSkillByName(skillNameWithoutSlash, skills);

        // Match function for rule patterns (supports wildcards)
        let matchesRule = (rulePattern) => {
            let pattern = rulePattern.startsWith("/")
                ? rulePattern.substring(1)
                : rulePattern;

            // Exact match
            if (pattern === skillNameWithoutSlash) return true;

            // Wildcard match (e.g., "commit:*" matches "commit:amend")
            if (pattern.endsWith(":*")) {
                let prefix = pattern.slice(0, -2);
                return skillNameWithoutSlash.startsWith(prefix);
            }

            return false;
        };

        // 1. Check deny rules first
        let denyRules = getPermissionRules(permissionContext, SkillTool, "deny");
        for (let [rulePattern, rule] of denyRules.entries()) {
            if (matchesRule(rulePattern)) {
                return {
                    behavior: "deny",
                    message: "Skill execution blocked by permission rules",
                    decisionReason: { type: "rule", rule }
                };
            }
        }

        // 2. Check allow rules
        let allowRules = getPermissionRules(permissionContext, SkillTool, "allow");
        for (let [rulePattern, rule] of allowRules.entries()) {
            if (matchesRule(rulePattern)) {
                return {
                    behavior: "allow",
                    updatedInput: { skill, args },
                    decisionReason: { type: "rule", rule }
                };
            }
        }

        // 3. Auto-approve safe skills
        if (skillDefinition?.type === "prompt" && isSafePromptSkill(skillDefinition)) {
            return {
                behavior: "allow",
                updatedInput: { skill, args },
                decisionReason: undefined
            };
        }

        // 4. Ask user with suggestions to add rules
        let suggestions = [
            {
                type: "addRules",
                rules: [{ toolName: "Skill", ruleContent: skillNameWithoutSlash }],
                behavior: "allow",
                destination: "localSettings"
            },
            {
                type: "addRules",
                rules: [{ toolName: "Skill", ruleContent: `${skillNameWithoutSlash}:*` }],
                behavior: "allow",
                destination: "localSettings"
            }
        ];

        return {
            behavior: "ask",
            message: `Execute skill: ${skillNameWithoutSlash}`,
            decisionReason: undefined,
            suggestions,
            updatedInput: { skill, args },
            metadata: skillDefinition ? { command: skillDefinition } : undefined
        };
    },

    async call({ skill, args }, context, progressCallback, abortSignal, hookContext) {
        let skillName = skill.trim();
        let skillNameWithoutSlash = skillName.startsWith("/")
            ? skillName.substring(1)
            : skillName;

        let skills = await getSkills(getAllSkillDirectories());
        let skillDefinition = findSkillByName(skillNameWithoutSlash, skills);

        // Record skill invocation for telemetry
        recordSkillInvocation(skillNameWithoutSlash);

        // Forked execution: spawn a subagent
        if (skillDefinition?.type === "prompt" && skillDefinition.context === "fork") {
            return executeForkedSkill(
                skillDefinition,
                skillNameWithoutSlash,
                args,
                context,
                progressCallback,
                abortSignal,
                hookContext
            );
        }

        // Inline execution: inject prompt into current context
        let { processPromptSlashCommand } = await importSkillProcessor();
        let result = await processPromptSlashCommand(
            skillNameWithoutSlash,
            args || "",
            skills,
            context
        );

        if (!result.shouldQuery) {
            throw new Error("Command processing failed");
        }

        // Log telemetry
        logEvent("tengu_skill_tool_invocation", {
            command_name: isBuiltInSkill(skillNameWithoutSlash)
                ? skillNameWithoutSlash
                : "custom",
            // ... additional telemetry ...
        });

        return {
            data: {
                success: true,
                commandName: skillNameWithoutSlash,
                allowedTools: result.allowedTools?.length > 0
                    ? result.allowedTools
                    : undefined,
                model: result.model
            },
            newMessages: result.messages,
            contextModifier(originalContext) {
                // Apply tool restrictions if specified
                if (result.allowedTools?.length > 0) {
                    return {
                        ...originalContext,
                        getAppState() {
                            let state = originalContext.getAppState();
                            return {
                                ...state,
                                toolPermissionContext: {
                                    ...state.toolPermissionContext,
                                    alwaysAllowRules: {
                                        ...state.toolPermissionContext.alwaysAllowRules,
                                        command: [
                                            ...new Set([
                                                ...(state.toolPermissionContext.alwaysAllowRules.command || []),
                                                ...result.allowedTools
                                            ])
                                        ]
                                    }
                                }
                            };
                        }
                    };
                }
                return originalContext;
            }
        };
    }
};

// Mapping: m66→SkillTool, oH→TOOL_NAME_SKILL, _kY→getSkillInputSchema,
//   wkY→getSkillOutputSchema, dP1→buildSkillPrompt, qY→getAllSkillDirectories,
//   I0→getSkills, G66→findSkillByName, $kY→isSafePromptSkill, Sb→getPermissionRules,
//   zkY→executeForkedSkill, ON1→recordSkillInvocation, d→logEvent
```

**Key insight:** The SkillTool is more than a simple command executor - it's a sophisticated system that:
1. **Validates skill existence and type** before execution
2. **Enforces permission rules** with wildcard pattern support
3. **Auto-approves safe skills** to reduce friction
4. **Supports two execution modes**: inline (inject prompt) and forked (spawn subagent)
5. **Applies context modifiers** to restrict tool access for the skill's execution

### Skill Discovery

**What it does:**
The skill discovery system scans multiple directories for skill definitions.

**Skill Directories (in order):**
1. Built-in skills (bundled with Claude Code)
2. `.claude/skills/` in project root
3. `~/.claude/skills/` in user home
4. Plugin skills from installed plugins

### Skill Definition Structure

```javascript
type SkillDefinition = {
    name: string;                    // e.g., "commit"
    description?: string;            // Brief description
    type: "prompt" | "agent";        // Execution type
    prompt?: string;                 // Prompt content (for prompt type)
    agentType?: string;              // Agent type (for agent type)
    allowedTools?: string[];         // Tool whitelist
    model?: string;                  // Model override
    disableModelInvocation?: boolean; // Prevent Skill tool usage
};
```

---

## Execution Modes

### Inline Execution

**What it does:**
Inline execution injects the skill's prompt directly into the current conversation context. No subagent is spawned.

**How it works:**

1. **Prompt Injection**: The skill's prompt content is added as a user message.
2. **Context Continuation**: The LLM continues the conversation with the skill prompt as guidance.
3. **Result Return**: The LLM's response becomes part of the normal conversation flow.

### Forked Execution

**What it does:**
Forked execution spawns a subagent to execute the skill in isolation. Used when the skill requires specific agent configuration or tool restrictions.

**How it works:**

1. **Prepare skill execution context** via `mM6` (prepareSkillExecution)
2. **Spawn subagent** via `dR` (agentLoopRunner)
3. **Run subagent** with:
   - Restricted tool set (from `allowedTools`)
   - Isolated context
   - Custom model override if specified
4. **Collect results** from subagent execution
5. **Return summary** to main agent

---

## Permission System

### Skill Permission Checks

**What it does:**
Skills have their own permission system that determines whether a skill can be executed without user approval.

**How it works:**

1. **Deny Rules First**: Check if skill matches a deny rule pattern
   - Supports wildcards: `"commit:*"` denies all skills starting with "commit"
2. **Allow Rules**: Check if skill matches an allow rule
3. **Auto-Approve**: Built-in safe skills can auto-approve without rules
4. **Default**: Ask user with suggestions to add rules

---

## Integration with LLM Request Pipeline

### Skill Prompt Generation

When the LLM has access to the Skill tool, available skills are included in the system prompt so the LLM knows what skills are available.

**Example output:**
```
Available skills:
- /commit: Create a git commit with staged changes
- /review-pr: Review a pull request
- /pdf: Extract and analyze PDF content
- /test: Run tests for the current project

To use a skill, call the Skill tool with the skill name.
```

---

## User Input Flow

### From User Input to Skill Execution

```
1. User types: "/commit"
2. Input is parsed as user message
3. LLM generates tool_use:
   { name: "Skill", input: { skill: "commit" } }
4. toolDispatcher routes to SkillTool
5. SkillTool.validateInput checks:
   - Skill exists
   - Skill is prompt-type
   - Skill allows model invocation
6. SkillTool.checkPermissions checks:
   - Permission rules
   - Auto-approve status
   - User confirmation if needed
7. SkillTool.call executes:
   - Inline: Inject prompt into context
   - Forked: Spawn subagent
8. Result returned to conversation
```

---

## Dynamic Skill Loading

### Skill File Watching

Skills can be added or modified at runtime. The system:
1. Watches skill directories for changes
2. Invalidates cache on file change
3. Re-scans skills on next access

### Skill Cache

```javascript
let skillCache = new Map();

async function getSkills(directories) {
    if (skillCache.has('all')) {
        return skillCache.get('all');
    }
    let skills = await discoverSkills(directories);
    skillCache.set('all', skills);
    return skills;
}

function clearSkillCache() {
    skillCache.clear();
}
```

---

## Permission Checking (VERIFIED)

> **Source:** `chunks.137.mjs:98-176` (m66.checkPermissions)

The SkillTool's permission check follows a deny → allow → auto-allow → ask pipeline:

```javascript
// ============================================
// m66.checkPermissions — SkillTool permission evaluation
// Location: chunks.137.mjs:98-176
// ============================================

// READABLE:
async checkPermissions(input, canUseTool, toolUseContext) {
    let skillName = normalizeSkillName(input.skill);  // Strip leading "/"

    // Stage 1: Check deny rules
    let denyRules = getSettingsRules(canUseTool, SkillTool, "deny");
    for (let rule of denyRules) {
        if (matchesSkillPattern(rule, skillName))  // Supports ":*" wildcard suffix
            return { behavior: "deny", reason: `Denied by rule: ${rule}` };
    }

    // Stage 2: Check allow rules
    let allowRules = getSettingsRules(canUseTool, SkillTool, "allow");
    for (let rule of allowRules) {
        if (matchesSkillPattern(rule, skillName))
            return { behavior: "allow" };
    }

    // Stage 3: Auto-allow if skill has only known/filtered properties
    if (isAutoAllowableSkill(skill))
        return { behavior: "allow" };

    // Stage 4: Prompt user for approval
    return {
        behavior: "ask",
        suggestions: [
            { label: `Allow "${skillName}"`, pattern: skillName },
            { label: `Allow "${skillName}:*"`, pattern: `${skillName}:*` }
        ]
    };
}

// Mapping: Sb→getSettingsRules, $kY→isAutoAllowableSkill
```

### Inline vs Forked Execution Decision (VERIFIED)

> **Source:** `chunks.137.mjs:178-252` (m66.call), `chunks.136.mjs:2447-2514` (zkY)

```
m66.call(input, context)
  │
  ├── context === "fork"?
  │   └── YES → zkY(skill, name, args, toolUseContext, canUseTool, message, onProgress)
  │       └── Spawns isolated sub-agent via qh()
  │       └── Returns { success, commandName, status: "forked", agentId, result }
  │
  └── NO (inline)
      └── processPromptSlashCommand(skill, args, ...)
          ├── shouldQuery === false → return early
          └── shouldQuery === true → return {
                  success: true,
                  commandName: skillName,
                  allowedTools: [...],  // Optional tool overrides
                  model: modelOverride, // Optional model override
                  status: "inline"
              }
```

### Skill Source Priority (VERIFIED)

> **Source:** `chunks.137.mjs:193-197`

| Priority | Source | Check | Telemetry `command_name` |
|----------|--------|-------|--------------------------|
| 1 | Bundled | `source === "bundled"` | `"bundled"` |
| 2 | Plugin (official) | `tn4(skill)` — checks plugin registry | `"plugin"` |
| 3 | Known standard | `Qg().has(name)` — well-known skill set | `"known"` |
| 4 | Custom (user/project) | Default | `"custom"` |

### Forked Execution Details (zkY)

```javascript
// Location: chunks.136.mjs:2447-2514 (VERIFIED)

// READABLE:
async function forkSkillExecution(skill, name, args, toolUseContext, canUseTool, message, onProgress) {
    let agentId = generateId();          // bI()
    // Prepare sub-agent context
    let { modifiedGetAppState, baseAgent, promptMessages, skillContent } =
        prepareSkillAgent(skill, args || "", toolUseContext);   // DN1()

    // Spawn isolated sub-agent
    let result = await spawnAgent({      // qh()
        agentDefinition: baseAgent,
        isAsync: false,
        querySource: "agent:custom",
        override: { agentId }
    });

    // Report progress for tool uses
    for (let msg of result.messages) {
        onProgress({ type: "skill_progress", message: msg });
    }

    return {
        success: true,
        commandName: name,
        status: "forked",
        agentId,
        result: formatResult(result, "Skill execution completed")  // XN1()
    };
}
```

---

## Telemetry Events

```javascript
// Skill tool slash prefix detection
logEvent("tengu_skill_tool_slash_prefix", {});

// Skill execution started
logEvent("tengu_skill_execution_started", {
    skillName: string,
    executionMode: "inline" | "forked",
    command_name: "bundled" | "plugin" | "known" | "custom"
});

// Skill execution completed
logEvent("tengu_skill_execution_completed", {
    skillName: string,
    executionMode: "inline" | "forked",
    durationMs: number,
    success: boolean
});
```

---

## Summary

The slash command/skill integration in Claude Code 2.1.76 provides:

1. **Flexible execution modes**: Inline for simple prompts, forked for isolated sub-agent execution
2. **Permission system**: 4-stage pipeline (deny → allow → auto-allow → ask) with wildcard patterns
3. **Dynamic discovery**: Skills loaded from multiple directories with priority: bundled > plugin > known > custom
4. **LLM integration**: Available skills exposed through the Skill tool's schema and prompt
5. **Caching and watching**: Performance optimization for skill loading
6. **Isolated execution**: Forked skills run in their own agent context with `querySource: "agent:custom"`

The skill system enables users to extend Claude Code's capabilities without modifying the core codebase, making it a powerful customization mechanism.
