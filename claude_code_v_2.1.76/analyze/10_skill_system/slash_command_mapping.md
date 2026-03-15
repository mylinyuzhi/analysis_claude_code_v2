# Slash Command Mapping - Deep Analysis (Claude Code 2.1.76)

## Overview

Slash commands (`/name`) are the user-facing interface for invoking skills. The system parses `/`-prefixed input, looks up the corresponding skill in the command registry, and executes it. This document covers the mapping between slash commands and skills, including user-invocable flags, aliases, and error handling.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skill System section)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands section)

Key functions in this document:
- `handleSlashInput` (Mb4) - Parse and route slash command input
- `executeCommand` (ifY) - Execute a resolved command
- `skillExists` (Sd) - Check if skill exists in registry
- `lookupSkill` (zI) - Get skill definition by name

---

## Architecture Overview

```
Slash Command Flow
──────────────────

User types "/commit -m 'fix bug'"
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                 Input Processing                           │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 1. Detect "/" prefix                               │   │
│  │ 2. Extract command name: "commit"                  │   │
│  │ 3. Parse arguments: "-m 'fix bug'"                 │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                 Command Lookup                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 1. Check skill registry (cZ)                       │   │
│  │ 2. Check built-in commands                         │   │
│  │ 3. Check aliases                                   │   │
│  │ 4. Check userInvocable flag                        │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                 Execution Decision                         │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Found & userInvocable?                             │   │
│  │   → executeCommand()                               │   │
│  │                                                     │   │
│  │ Found but not userInvocable?                       │   │
│  │   → Error: "Skill cannot be invoked by user"       │   │
│  │                                                     │   │
│  │ Not found?                                         │   │
│  │   → Error: "Unknown command"                       │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## Command Sources

### 1. User-Invocable Skills

Skills with `userInvocable: true` in their frontmatter or registration can be invoked via `/name`. These appear in the autocomplete dropdown.

**Built-in User-Invocable Skills:**
| Skill | Registration | Status |
|-------|--------------|--------|
| `keybindings-help` | fjq | Active |
| `debug` | kjq | Active |
| `claude-in-chrome` | jjq | Active (conditional) |

**Custom Skills:**
Skills in `.claude/skills/<name>/SKILL.md` with `userInvocable: true` (or omitted, defaults to true).

### 2. LLM-Only Skills

Skills with `userInvocable: false` can only be invoked by the LLM via the Skill tool. Users cannot directly call these via `/name`.

Example:
```yaml
---
name: internal-validator
userInvocable: false
---
```

### 3. Built-in Commands

Commands that are not skills (type: "local" or "local-jsx"). These are hardcoded and cannot be invoked by the LLM.

| Command | Type | Description |
|---------|------|-------------|
| `/help` | local | Show help |
| `/clear` | local | Clear conversation |
| `/compact` | local | Compact context |
| `/doctor` | local | Run diagnostics |
| `/cost` | local | Show token usage |
| `/config` | local | Configuration management |
| `/permissions` | local | Permission settings |
| `/terminal-setup` | local | Terminal setup |
| `/bug` | local | Report bug |
| `/logout` | local | Logout |
| `/init` | local | Initialize CLAUDE.md |
| `/mcp` | local | MCP management |
| `/review` | local | Code review (placeholder) |
| `/pr-comments` | local | PR comments (placeholder) |
| `/security-review` | local | Security review (placeholder) |
| `/vim` | local | Vim mode toggle |
| `/usage` | local | Usage statistics |

---

## Lookup Algorithm

### skillExists (Sd)

```javascript
// ============================================
// skillExists - Check if skill exists in registry
// Location: chunks.134.mjs
// ============================================

// READABLE (for understanding):
function skillExists(skillName, registry) {
    // Check direct name match
    if (registry.has(skillName)) return true;

    // Check aliases
    for (let skill of registry.values()) {
        if (skill.aliases?.includes(skillName)) return true;
    }

    return false;
}
```

### lookupSkill (zI)

```javascript
// ============================================
// lookupSkill - Get skill definition by name
// Location: chunks.134.mjs
// ============================================

// READABLE (for understanding):
function lookupSkill(skillName, registry) {
    // Try direct lookup
    let skill = registry.get(skillName);
    if (skill) return skill;

    // Try alias lookup
    for (let skill of registry.values()) {
        if (skill.aliases?.includes(skillName)) return skill;
    }

    return null;
}
```

### Alias Resolution

Skills can define aliases in their frontmatter:

```yaml
---
name: commit
aliases:
  - ci
  - create-commit
---
```

When the user types `/ci`, the system resolves to the `commit` skill.

---

## Execution Modes

### Inline Execution (Default)

Most skills execute inline - their prompt is added to the conversation and the main LLM responds.

```
User: /keybindings-help rebind ctrl+s
        │
        ▼
Skill lookup: keybindings-help
        │
        ▼
getPromptForCommand("rebind ctrl+s")
        │
        ▼
Prompt added to conversation
        │
        ▼
Main LLM responds with keybinding instructions
```

### Forked Execution

Skills with `context: fork` execute in a subagent:

```
User: /my-automated-workflow
        │
        ▼
Skill lookup: my-automated-workflow
        │
        ▼
Check context: fork
        │
        ▼
Spawn subagent with skill's prompt
        │
        ▼
Subagent runs independently
        │
        ▼
Result returned to main conversation
```

---

## Telemetry Events

### tengu_skill_tool_slash_prefix

Emitted when the LLM invokes a skill using `/name` syntax via the Skill tool (rather than just the skill name).

```javascript
// Location: chunks.132.mjs:847
if (Y) c("tengu_skill_tool_slash_prefix", {});
```

This tracks how often the LLM uses slash syntax vs. bare skill names.

---

## Error Handling

### Unknown Command

When a user types an unknown command:

```
User: /nonexistent-skill
        │
        ▼
Error: "Unknown command: nonexistent-skill"
        │
        ▼
Suggestion: "Type /help for available commands"
```

### Non-User-Invocable

When a user tries to invoke a skill marked as not user-invocable:

```
User: /internal-validator
        │
        ▼
Error: "Skill 'internal-validator' cannot be invoked by user"
```

### Skill Load Failure

When a skill exists but fails to load:

```
User: /broken-skill
        │
        ▼
Error: "Could not load skill: broken-skill"
```

---

## Autocomplete Integration

### Skill Discovery for Autocomplete

The autocomplete system queries the skill registry to show available commands:

```javascript
// Pseudocode for autocomplete
function getSlashCompletions(partialInput) {
    let completions = [];

    // Add user-invocable skills
    for (let skill of skillRegistry.values()) {
        if (skill.userInvocable !== false) {
            completions.push({
                name: skill.name,
                description: skill.description,
                aliases: skill.aliases
            });
        }
    }

    // Add built-in commands
    for (let cmd of builtinCommands) {
        completions.push({
            name: cmd.name,
            description: cmd.description
        });
    }

    // Filter by partial input
    return completions.filter(c => c.name.startsWith(partialInput));
}
```

---

## Design Rationale

### Why Separate userInvocable Flag?

Not all skills are meant for direct user invocation. Some skills are:
1. **Internal helpers** - Used by other skills or the system
2. **LLM-triggered only** - Designed for automatic invocation based on context
3. **Experimental/Unstable** - Not ready for direct user use

The `userInvocable` flag provides a clean separation without needing separate registries.

### Why Aliases?

Aliases provide:
1. **Shortcuts** - `/ci` instead of `/commit`
2. **Familiar names** - Different users prefer different naming conventions
3. **Migration** - Rename a skill but keep old name working

### Why Both Skills and Commands?

Built-in commands (`type: "local"`) are not skills because:
1. They often have special UI integration (e.g., `/clear` clears the screen)
2. They don't need prompt text
3. They execute immediately without LLM involvement

This separation keeps the skill system focused on prompt-based extensions while allowing built-in functionality to work differently.

---

## Debugging Tips

### Check if Skill is Registered

```javascript
// In browser console or debug session
let registry = await getSkillRegistry();
console.log(registry.get('skill-name'));
```

### Check userInvocable Status

```javascript
let skill = registry.get('skill-name');
console.log('User invocable:', skill.userInvocable !== false);
```

### Check Aliases

```javascript
let skill = registry.get('skill-name');
console.log('Aliases:', skill.aliases);
```

### List All User-Invocable Skills

```javascript
let userSkills = [...registry.values()]
    .filter(s => s.userInvocable !== false);
console.table(userSkills.map(s => ({
    name: s.name,
    description: s.description?.slice(0, 50),
    type: s.type
})));
```