# Plugin Skills and Commands Integration (Claude Code 2.1.76)

> Deep analysis of how plugins contribute skills and slash commands,
> including loading mechanisms, discovery patterns, and object creation.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `getPluginCommands` (YK1) - Load all slash commands from enabled plugins
- `getPluginSkills` (B0A) - Load all skills from enabled plugins
- `loadCommandsFromDir` (TU7) - Load commands from a plugin directory
- `loadSkillsFromDir` (vU7) - Load skills from a plugin directory
- `createCommandObject` (uu1) - Create command/skill object from parsed file
- `loadPluginManifest` (Pn4) - Discover plugin components including commands/skills

---

## Overview

Plugins can contribute two types of prompt-based capabilities:
1. **Slash Commands** - User-invocable via `/command-name` syntax
2. **Skills** - Agent-activatable capabilities with `loadedFrom: "plugin"` marker

Both use the same underlying file format (Markdown with frontmatter) but differ in how they're discovered and invoked.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PLUGIN COMMANDS/SKILLS LOADING FLOW                       │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────────────────┐
                    │    Plugin Manager Initialization  │
                    │    iY() - getLoadedPlugins()      │
                    └──────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
    ┌─────────────────────────────┐   ┌─────────────────────────────┐
    │    getPluginCommands (YK1)  │   │    getPluginSkills (B0A)    │
    │    Memoized loader          │   │    Memoized loader          │
    └─────────────────────────────┘   └─────────────────────────────┘
                    │                               │
                    ▼                               ▼
    ┌─────────────────────────────┐   ┌─────────────────────────────┐
    │  For each enabled plugin:    │   │  For each enabled plugin:    │
    │  - commandsPath (default)    │   │  - skillsPath (default)      │
    │  - commandsPaths (custom)    │   │  - skillsPaths (custom)      │
    │  - commandsMetadata (inline) │   └─────────────────────────────┘
    └─────────────────────────────┘                   │
                    │                                 ▼
                    ▼                 ┌─────────────────────────────┐
    ┌─────────────────────────────┐   │  loadSkillsFromDir (vU7)    │
    │  loadCommandsFromDir (TU7)  │   │  - Look for SKILL.md in dir  │
    │  - Scan for .md files       │   │  - Or SKILL.md in subdirs    │
    │  - Parse frontmatter        │   │  - isSkillMode: true         │
    └─────────────────────────────┘   └─────────────────────────────┘
                    │                                 │
                    └───────────────┬─────────────────┘
                                    ▼
                    ┌──────────────────────────────────┐
                    │  createCommandObject (uu1)       │
                    │  Creates unified object with:    │
                    │  - type: "prompt"                │
                    │  - source: "plugin"              │
                    │  - pluginInfo: {...}             │
                    │  - getPromptForCommand()         │
                    └──────────────────────────────────┘
```

---

## Slash Commands

### `getPluginCommands` (YK1) - Command Loader

**What it does:** Loads all slash commands from all enabled plugins. Memoized so it only runs once per session.

**Naming convention:** Plugin commands appear as `/plugin-name:command-name` to prevent collisions with built-in commands and other plugins.

**Discovery pattern:**
```
commands/
├── my-command.md          → /plugin-name:my-command
├── deploy.md              → /plugin-name:deploy
└── setup/
    └── config.md          → /plugin-name:setup/config (nested)
```

### Command Frontmatter Format

```markdown
---
description: Deploy the current project to production
allowed-tools:
  - Bash
  - Read
requires-confirmation: true
---

Deploy the project by running the following steps:
1. Run tests: `npm test`
2. Build: `npm run build`
3. Deploy: `npm run deploy`
```

| Frontmatter Field | Type | Description |
|------------------|------|-------------|
| `description` | string | Shown in slash command help |
| `allowed-tools` | string[] | Tools this command can use |
| `requires-confirmation` | boolean | Show confirmation before executing |

---

## Skills

### `getPluginSkills` (B0A) - Skill Loader

**What it does:** Loads all skills from all enabled plugins. Skills are SKILL.md files within plugin directories.

**Key difference from commands:** Skills are invoked by the agent based on context, not directly by the user with a slash. They appear in the skill system's discovery mechanism.

**Discovery pattern:**
```
skills/
├── SKILL.md               → plugin-name skill (direct)
└── code-review/
    └── SKILL.md           → plugin-name:code-review skill
```

### SKILL.md Format

```markdown
---
name: code-review
description: Review code for security vulnerabilities and best practices
triggers:
  - "review my code"
  - "check for security issues"
  - "code review"
---

When performing a code review, analyze the code for:
1. Security vulnerabilities (SQL injection, XSS, etc.)
2. Best practices violations
3. Performance issues
4. Code clarity

Focus especially on input validation and authentication flows.
```

---

## `createCommandObject` (uu1) - Unified Object Factory

**What it does:** Creates a unified command/skill object from a parsed markdown file, regardless of whether it's a command or skill.

**Key properties:**
- `type: "prompt"` - Both commands and skills use prompt-based execution
- `source: "plugin"` - Marks as plugin-contributed (not built-in)
- `pluginInfo: { pluginManifest, repository }` - Plugin attribution
- `getPromptForCommand()` - Returns the rendered prompt text with argument substitution

**Why unified:** Both commands and skills share the same execution path (Skill tool or slash command handler). The `createCommandObject` function ensures consistent object shape regardless of which category the file falls into.

---

## Integration with Core Systems

### Slash Command System (Module 09)

Plugin commands are merged with built-in commands in the slash command registry:

```
Built-in commands + Plugin commands → Combined registry
    │
    └─ User types /my-plugin:deploy → matches plugin command
           └─ Execute via Skill tool or direct prompt injection
```

### Skill System (Module 10)

Plugin skills are merged with built-in skills:

```
Built-in skills + Plugin skills → Skill registry
    │
    └─ Agent invokes Skill tool with name "my-plugin:code-review"
           └─ Executes skill's SKILL.md prompt content
```

### System Reminder (Module 04)

Plugin commands appear in the skills/commands section of the system reminder, informing the LLM of available capabilities:

```
Available skills:
- code-review (from my-plugin): Review code for security vulnerabilities...
- deploy (from my-plugin): Deploy the current project to production...
```
