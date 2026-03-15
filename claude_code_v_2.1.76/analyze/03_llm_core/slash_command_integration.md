# Slash Command Integration (Claude Code 2.1.38)

> Complete analysis of the slash command system: how user commands are expanded into prompts, the SkillTool implementation, prompt template resolution, and integration with the LLM request pipeline.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `SkillTool` (wt) - Tool that executes slash commands and skills
- `getSkills` (cZ) - Discovers available skills from directories
- `loadSkill` (zI) - Loads a specific skill's definition
- `agentLoopRunner` (dR) - Runs a subagent for forked skill execution
- `TOOL_NAME_SKILL` (NJ) - Constant "Skill"

---

## Architecture Overview

Slash commands (skills) are user-defined prompts that can be invoked via `/command` syntax:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    SLASH COMMAND INTEGRATION ARCHITECTURE                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  USER INPUT PARSING                                                       │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ User types: "/commit"                                               │  │
│  │      │                                                              │  │
│  │      └──► LLM generates tool_use block:                            │  │
│  │               { name: "Skill", input: { skill: "commit" } }        │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                              │                                            │
│                              ▼                                            │
│  SKILL LOOKUP & RESOLUTION                                               │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ SkillTool.validateInput()                                           │  │
│  │      │                                                              │  │
│  │      ├──► cZ() - Get all available skills                          │  │
│  │      ├──► Sd() - Check if skill exists                             │  │
│  │      └──► zI() - Load skill definition                             │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                              │                                            │
│                              ▼                                            │
│  EXECUTION MODES                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                                                                     │  │
│  │  Mode 1: Inline Execution                                          │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │ - Inject prompt into current context                         │  │  │
│  │  │ - No subagent spawned                                        │  │  │
│  │  │ - Returns new messages for current conversation              │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  │  Mode 2: Forked Execution                                          │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │ - Spawn subagent with skill prompt                           │  │  │
│  │  │ - agentLoopRunner (dR) executes in isolation                 │  │  │
│  │  │ - Returns result to main agent                               │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### SkillTool Definition

**What it does:**
The `SkillTool` (wt) is a tool that allows the LLM to execute user-defined skills. It handles skill lookup, validation, permission checking, and execution.

**How it works:**

```javascript
// ============================================
// SkillTool - Tool definition for skill execution
// Location: chunks.132.mjs:820-950
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
        if (H.disableModelInvocation) return { result: !1, message: `Skill ${z} cannot be used with ${NJ} tool due to disable-model-invocation`, errorCode: 4 };
        if (H.type !== "prompt") return { result: !1, message: `Skill ${z} is not a prompt-based skill`, errorCode: 5 };
        return { result: !0 }
    },
    // ... checkPermissions, call methods ...
}

// READABLE (for understanding):
const SkillTool = {
    name: TOOL_NAME_SKILL,  // "Skill"
    maxResultSizeChars: 100000,

    // Input schema: skill name and optional args
    get inputSchema() {
        return zod.object({
            skill: zod.string().describe('The skill name. E.g., "commit", "review-pr", or "pdf"'),
            args: zod.string().optional().describe("Optional arguments for the skill")
        });
    },

    // Output schema: success + status (inline or forked)
    get outputSchema() {
        return zod.union([
            zod.object({
                success: zod.boolean(),
                commandName: zod.string(),
                allowedTools: zod.array(zod.string()).optional(),
                model: zod.string().optional(),
                status: zod.literal("inline").optional()
            }),
            zod.object({
                success: zod.boolean(),
                commandName: zod.string(),
                status: zod.literal("forked"),
                agentId: zod.string(),
                result: zod.string()
            })
        ]);
    },

    // Dynamic description
    description: async ({ skill }) => `Execute skill: ${skill}`,

    // Dynamic prompt with available skills
    prompt: async () => formatSkillPrompt(getAvailableSkills()),

    userFacingName: () => TOOL_NAME_SKILL,
    isConcurrencySafe: () => false,
    isEnabled: () => true,
    isReadOnly: () => false,

    // Validation logic
    async validateInput({ skill }, context) {
        let trimmedSkill = skill.trim();
        if (!trimmedSkill) {
            return { result: false, message: `Invalid skill format: ${skill}`, errorCode: 1 };
        }

        // Handle /prefix by stripping it
        let hasSlashPrefix = trimmedSkill.startsWith("/");
        if (hasSlashPrefix) {
            logEvent("tengu_skill_tool_slash_prefix", {});
        }
        let skillName = hasSlashPrefix ? trimmedSkill.substring(1) : trimmedSkill;

        // Check skill exists
        let availableSkills = await getSkills(getSkillDirectories());
        if (!skillExists(skillName, availableSkills)) {
            return { result: false, message: `Unknown skill: ${skillName}`, errorCode: 2 };
        }

        // Load skill definition
        let skillDef = loadSkill(skillName, availableSkills);
        if (!skillDef) {
            return { result: false, message: `Could not load skill: ${skillName}`, errorCode: 3 };
        }

        // Check if skill can be invoked by model
        if (skillDef.disableModelInvocation) {
            return { result: false, message: `Skill ${skillName} cannot be used with Skill tool due to disable-model-invocation`, errorCode: 4 };
        }

        // Only prompt-type skills can be used
        if (skillDef.type !== "prompt") {
            return { result: false, message: `Skill ${skillName} is not a prompt-based skill`, errorCode: 5 };
        }

        return { result: true };
    },

    // ... checkPermissions, call ...
};

// Mapping: wt→SkillTool, NJ→TOOL_NAME_SKILL, HNY→skillInputSchema, _NY→skillOutputSchema,
//   cZ→getSkills, Sd→skillExists, zI→loadSkill, ZO→getSkillDirectories, d0A→formatSkillPrompt
```

---

### Skill Discovery

**What it does:**
The skill discovery system scans multiple directories for skill definitions and makes them available to the LLM.

**How it works:**

Skills are discovered from:

1. **Built-in skills**: Bundled with Claude Code
2. **Project skills**: `.claude/skills/` in the project root
3. **User skills**: `~/.claude/skills/` in the user's home directory
4. **Plugin skills**: From installed plugins

```javascript
// ============================================
// Skill Discovery Flow
// ============================================

async function getSkills(skillDirectories) {
    let allSkills = [];

    for (let dir of skillDirectories) {
        try {
            let skillFiles = await listSkillFiles(dir);
            for (let file of skillFiles) {
                let skillDef = await parseSkillFile(file);
                if (skillDef) {
                    allSkills.push(skillDef);
                }
            }
        } catch (error) {
            // Skip directories that don't exist or can't be read
            continue;
        }
    }

    return allSkills;
}

// Skill file format (Markdown with frontmatter):
// ---
// name: commit
// description: Create a git commit
// allowed-tools: Bash, Read, Write
// model: claude-sonnet-4-6
// ---
// [Prompt content here]
```

### Skill Definition Structure

```javascript
// ============================================
// Skill Definition Schema
// ============================================

type SkillDefinition = {
    name: string;                    // e.g., "commit"
    description?: string;            // Brief description
    type: "prompt" | "agent";        // Execution type
    prompt?: string;                 // Prompt content (for prompt type)
    agentType?: string;              // Agent type (for agent type)
    allowedTools?: string[];         // Tool whitelist
    model?: string;                  // Model override
    disableModelInvocation?: boolean; // Prevent Skill tool usage
    // ... other frontmatter fields
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

```javascript
// ============================================
// Inline Skill Execution
// Location: chunks.132.mjs (inferred from call method)
// ============================================

async executeInlineSkill(skillName, args, toolUseContext) {
    let skillDef = loadSkill(skillName, availableSkills);

    // Build the prompt with args substitution
    let prompt = substituteArgs(skillDef.prompt, args);

    // Return as new messages to add to conversation
    let newMessages = [
        createUserMessage({
            content: prompt,
            isMeta: false
        })
    ];

    return {
        success: true,
        commandName: skillName,
        allowedTools: skillDef.allowedTools,
        model: skillDef.model,
        status: "inline",
        newMessages
    };
}
```

### Forked Execution

**What it does:**
Forked execution spawns a subagent to execute the skill in isolation. This is used when the skill requires specific agent configuration or tool restrictions.

**How it works:**

```javascript
// ============================================
// Forked Skill Execution
// Location: chunks.132.mjs:707-746
// ============================================

// ORIGINAL (for source lookup):
let {
    modifiedGetAppState: J,
    baseAgent: X,
    promptMessages: D,
    skillContent: j
} = await mM6(A, K || "", Y), M = [];
h(`SkillTool executing forked skill ${q} with agent ${X.agentType}`);
for await (let G of dR({
    agentDefinition: X,
    promptMessages: D,
    toolUseContext: {
        ...Y,
        // ... context setup ...
    }
})) {
    // Process events from subagent
}
// ... result processing ...

// READABLE (for understanding):
async function executeForkedSkill(skillName, args, toolUseContext) {
    let startTime = Date.now();

    // Prepare skill execution context
    let {
        modifiedGetAppState,
        baseAgent,
        promptMessages,
        skillContent
    } = await prepareSkillExecution(skillName, args || "", toolUseContext);

    let resultMessages = [];
    log(`SkillTool executing forked skill ${skillName} with agent ${baseAgent.agentType}`);

    // Run subagent
    for await (let event of agentLoopRunner({
        agentDefinition: baseAgent,
        promptMessages: promptMessages,
        toolUseContext: {
            ...toolUseContext,
            getAppState: modifiedGetAppState,
            // ... other context fields ...
        }
    })) {
        if (event.type === "assistant") {
            resultMessages.push(event);
        }
        // ... handle other event types ...
    }

    // Build result
    let resultText = buildSkillResult(resultMessages, "Skill execution completed");
    let duration = Date.now() - startTime;
    log(`SkillTool forked skill ${skillName} completed in ${duration}ms`);

    return {
        data: {
            success: true,
            commandName: skillName,
            status: "forked",
            agentId: agentId,
            result: resultText
        }
    };
}

// Mapping: mM6→prepareSkillExecution, dR→agentLoopRunner, FM6→buildSkillResult
```

---

## Permission System

### Skill Permission Checks

**What it does:**
Skills have their own permission system that determines whether a skill can be executed without user approval.

**How it works:**

```javascript
// ============================================
// Skill Permission Check
// Location: chunks.132.mjs:875-949
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
        if (_(j)) return { behavior: "deny", message: "Skill execution blocked by permission rules", ... };
    let X = XI(H, wt, "allow");
    for (let [j, M] of X.entries())
        if (_(j)) return { behavior: "allow", updatedInput: { skill: A, args: q }, ... };
    if (O?.type === "prompt" && XNY(O)) return { behavior: "allow", updatedInput: { skill: A, args: q }, ... };
    // ... ask behavior with suggestions ...
}

// READABLE (for understanding):
async checkPermissions({ skill, args }, context) {
    let skillName = skill.trim();
    let normalizedSkillName = skillName.startsWith("/") ? skillName.substring(1) : skillName;

    let permissionContext = (await context.getAppState()).toolPermissionContext;
    let availableSkills = await getSkills(getSkillDirectories());
    let skillDef = loadSkill(normalizedSkillName, availableSkills);

    // Helper to match skill names with wildcards
    let matchesRule = (rule) => {
        let normalizedRule = rule.startsWith("/") ? rule.substring(1) : rule;
        if (normalizedRule === normalizedSkillName) return true;
        if (normalizedRule.endsWith(":*")) {
            let prefix = normalizedRule.slice(0, -2);
            return normalizedSkillName.startsWith(prefix);
        }
        return false;
    };

    // Check deny rules first
    let denyRules = getPermissionRules(permissionContext, SkillTool, "deny");
    for (let [ruleName, rule] of denyRules.entries()) {
        if (matchesRule(ruleName)) {
            return {
                behavior: "deny",
                message: "Skill execution blocked by permission rules",
                decisionReason: { type: "rule", rule }
            };
        }
    }

    // Check allow rules
    let allowRules = getPermissionRules(permissionContext, SkillTool, "allow");
    for (let [ruleName, rule] of allowRules.entries()) {
        if (matchesRule(ruleName)) {
            return {
                behavior: "allow",
                updatedInput: { skill, args },
                decisionReason: { type: "rule", rule }
            };
        }
    }

    // Auto-approve if skill is marked as safe
    if (skillDef?.type === "prompt" && isAutoApprovedSkill(skillDef)) {
        return {
            behavior: "allow",
            updatedInput: { skill, args }
        };
    }

    // Default: ask user
    let suggestions = [
        {
            type: "addRules",
            rules: [{ toolName: TOOL_NAME_SKILL, ruleContent: normalizedSkillName }],
            behavior: "allow",
            destination: "localSettings"
        },
        {
            type: "addRules",
            rules: [{ toolName: TOOL_NAME_SKILL, ruleContent: `${normalizedSkillName}:*` }],
            behavior: "allow",
            destination: "localSettings"
        }
    ];

    return {
        behavior: "ask",
        message: `Execute skill: ${normalizedSkillName}`,
        suggestions,
        updatedInput: { skill, args }
    };
}

// Mapping: XI→getPermissionRules, XNY→isAutoApprovedSkill
```

---

## Integration with LLM Request Pipeline

### Skill Prompt Generation

**What it does:**
When the LLM has access to the Skill tool, the available skills are included in the system prompt so the LLM knows what skills are available.

**How it works:**

```javascript
// ============================================
// Skill Prompt Integration
// Location: chunks.132.mjs:832 (referenced)
// ============================================

// The prompt() method returns available skills
prompt: async () => formatSkillPrompt(getAvailableSkills())

// Example output:
// Available skills:
// - /commit: Create a git commit with staged changes
// - /review-pr: Review a pull request
// - /pdf: Extract and analyze PDF content
// - /test: Run tests for the current project
//
// To use a skill, call the Skill tool with the skill name.
```

### Tool Schema for Skills

```javascript
// ============================================
// Skill Tool Schema (in API request)
// ============================================

{
    "name": "Skill",
    "description": "Execute a skill by name. Skills are predefined prompts that automate common tasks.",
    "input_schema": {
        "type": "object",
        "properties": {
            "skill": {
                "type": "string",
                "description": "The skill name. E.g., \"commit\", \"review-pr\", or \"pdf\""
            },
            "args": {
                "type": "string",
                "description": "Optional arguments for the skill"
            }
        },
        "required": ["skill"]
    }
}
```

---

## User Input Flow

### From User Input to Skill Execution

```
1. User types: "/commit"
   │
   ▼
2. Input is parsed as user message
   │
   ▼
3. LLM generates tool_use:
   { name: "Skill", input: { skill: "commit" } }
   │
   ▼
4. toolDispatcher routes to SkillTool
   │
   ▼
5. SkillTool.validateInput checks:
   - Skill exists
   - Skill is prompt-type
   - Skill allows model invocation
   │
   ▼
6. SkillTool.checkPermissions checks:
   - Permission rules
   - Auto-approve status
   - User confirmation if needed
   │
   ▼
7. SkillTool.call executes:
   - Inline: Inject prompt into context
   - Forked: Spawn subagent
   │
   ▼
8. Result returned to conversation
```

---

## Dynamic Skill Loading

### Skill File Watching

Skills can be added or modified at runtime:

```javascript
// ============================================
// Skill File Watching (inferred)
// ============================================

// Watch for changes in skill directories
function watchSkillDirectories() {
    let watcher = fs.watch(SKILL_DIRECTORIES, (event, filename) => {
        if (event === 'change' || event === 'rename') {
            // Invalidate cache
            clearSkillCache();

            // Re-scan skills
            getSkills(getSkillDirectories());
        }
    });
}
```

### Skill Cache

```javascript
// ============================================
// Skill Caching
// ============================================

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

## Telemetry Events

```javascript
// Skill tool slash prefix detection
logEvent("tengu_skill_tool_slash_prefix", {});

// Skill execution started
logEvent("tengu_skill_execution_started", {
    skillName: string,
    executionMode: "inline" | "forked"
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

The slash command/skill integration in Claude Code 2.1.38 provides:

1. **Flexible execution modes**: Inline for simple prompts, forked for isolated execution
2. **Permission system**: Fine-grained control over which skills can be auto-approved
3. **Dynamic discovery**: Skills are loaded from multiple directories at runtime
4. **LLM integration**: Available skills are exposed through the Skill tool's schema and prompt
5. **Caching and watching**: Performance optimization for skill loading

The skill system enables users to extend Claude Code's capabilities without modifying the core codebase, making it a powerful customization mechanism.