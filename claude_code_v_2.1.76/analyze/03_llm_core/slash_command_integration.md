# Slash Command Integration (Claude Code 2.1.76)

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

### SkillTool Definition

**What it does:**
The `SkillTool` (wt) is a tool that allows the LLM to execute user-defined skills. It handles skill lookup, validation, permission checking, and execution.

**How it works:**

1. **Input Schema**: Takes `{ skill: string, args?: string }`
2. **Description Generation**: Dynamic description based on skill name
3. **Output Schema**: Union of inline vs forked execution results

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

The slash command/skill integration in Claude Code 2.1.76 provides:

1. **Flexible execution modes**: Inline for simple prompts, forked for isolated execution
2. **Permission system**: Fine-grained control over which skills can be auto-approved
3. **Dynamic discovery**: Skills are loaded from multiple directories at runtime
4. **LLM integration**: Available skills are exposed through the Skill tool's schema and prompt
5. **Caching and watching**: Performance optimization for skill loading

The skill system enables users to extend Claude Code's capabilities without modifying the core codebase, making it a powerful customization mechanism.
