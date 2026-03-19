# Skill System - Overview (Claude Code 2.1.76)

## Introduction

Skills are reusable, user-defined workflows that extend Claude Code's capabilities. They allow users to capture repeatable processes as structured prompts that can be invoked via the Skill tool or slash commands (e.g., `/my-skill`).

The skill system follows a **multi-source loading architecture** where skills are discovered from multiple locations (bundled, user, project, plugin) and merged into a unified registry. Skills are primarily **prompt-based** - they inject context into the conversation rather than executing code directly.

**v2.1.76 additions:**
- `/claude-api` built-in skill added
- `/simplify` and `/batch` bundled commands added
- `${CLAUDE_SKILL_DIR}` environment variable for custom skill directory location
- Fix for skills not discovered from git worktrees
- `InstructionsLoaded` hook event fires when skill instructions are injected

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                     Skill Loading Pipeline                      │
├─────────────────────────────────────────────────────────────────┤
│  loadSkills (JV8)                                                │
│       │                                                         │
│       ├─── Managed Skills: ~/.claude/skills/                    │
│       ├─── User Skills: ~/.claude/skills/                       │
│       ├─── Project Skills: .claude/skills/                      │
│       ├─── ${CLAUDE_SKILL_DIR} (v2.1.76)                       │
│       ├─── Plugin Skills: loaded via loadPluginSkills (B0A)     │
│       └─── Legacy Commands: .claude/commands/ (DEPRECATED)      │
│       │                                                         │
│       ▼                                                         │
│  Deduplication by inode ID → Skill Registry (lPq Array)        │
│       │                                                         │
│       ├─── Unconditional Skills → Immediate availability        │
│       └─── Conditional Skills (paths-based) → Lazy activation   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                     Skill Invocation                            │
├─────────────────────────────────────────────────────────────────┤
│  User: /skill-name or Skill tool invocation                     │
│       │                                                         │
│       ▼                                                         │
│  SkillTool (wt)                                                 │
│       │                                                         │
│       ├─── validateInput: Check skill exists and is invocable   │
│       ├─── checkPermissions: Apply deny/allow rules             │
│       └─── call: Execute inline or forked                       │
│                 │                                               │
│                 └── InstructionsLoaded hook fires (v2.1.76)    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                   Execution Modes                               │
├─────────────────────────────────────────────────────────────────┤
│  Inline (default):     Inject prompt into current conversation  │
│  Forked (context:fork): Launch sub-agent with isolated context  │
└─────────────────────────────────────────────────────────────────┘
```

## Skill Types

| Type | Source | Directory | Use Case |
|------|--------|-----------|----------|
| **Bundled** | Built-in | Registration via `registerPromptSkill` (Sj) | System skills (debug, keybindings-help, claude-api) |
| **Managed** | Policy | `~/.claude/skills/` | Organization/team skills |
| **User** | User config | `~/.claude/skills/` | Personal skills |
| **Project** | Project config | `.claude/skills/` | Project-specific workflows |
| **Custom Dir** | `${CLAUDE_SKILL_DIR}` | Env-var specified path (v2.1.76) | Flexible skill directory |
| **Plugin** | Marketplace | Loaded via plugin system | Third-party extensions |

## SKILL.md Format

Skills are defined in `SKILL.md` files with YAML frontmatter:

```markdown
---
name: my-skill
description: One-line description shown in skill listings
allowed-tools:
  - Bash(gh:*)
  - Read
  - Write
when_to_use: Use when... (trigger phrases and conditions)
argument-hint: "<required-args> [optional-args]"
arguments:
  - arg1
  - arg2
context: fork          # Optional: "fork" for isolated execution
model: sonnet          # Optional: model override
user-invocable: true   # Default: true
disable-model-invocation: false  # Prevent LLM from auto-invoking
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - hook: "echo 'Running bash command'"
  PostToolUse:
    - matcher: "*"
      hooks:
        - hook: "echo 'Tool completed'"
          once: true
paths:
  - "src/**"           # Only activate when touching these paths
---

# Skill Title

Detailed instructions for the skill...

## Inputs
- `$arg1`: Description of this input

## Goal
What this skill accomplishes...

## Steps
### 1. Step Name
Instructions...
**Success criteria**: How to know this step is complete.
```

### Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Display name (defaults to directory name) |
| `description` | string | Recommended | One-line description for skill listings |
| `allowed-tools` | string[] | No | Tool patterns this skill can use |
| `when_to_use` | string | Recommended | When Claude should auto-invoke this skill |
| `argument-hint` | string | No | Placeholder text for arguments |
| `arguments` | string[] | No | Named arguments for template substitution |
| `context` | "fork" | No | Set to "fork" for isolated sub-agent execution |
| `model` | string | No | Model override (e.g., "sonnet", "opus") |
| `user-invocable` | boolean | No | Whether users can invoke via `/skill` (default: true) |
| `disable-model-invocation` | boolean | No | Prevent LLM from auto-invoking (default: false) |
| `hooks` | object | No | Hook definitions for tool events |
| `paths` | string[] | No | Path patterns for conditional activation |
| `version` | string | No | Skill version for tracking |
| `agent` | string | No | Agent type for forked execution |

## Key Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `loadSkillDirCommands` (JV8) - Main skill loading entry point
- `createSkillObject` (v94) - Factory function for skill objects
- `parseSkillHooks` (T94) - Hook extraction from frontmatter
- `registerPromptSkill` (rw) - Bundled skill registration
- `SkillTool` (m66) - Tool for invoking skills
- `registerSkillHooks` (gc4) - Hook registration from skills
- `getInvokedSkillsAttachment` (Tqq) - Compact skill preservation
- `generateSkillListingAttachment` (guY) - System reminder integration
- `activateConditionalSkills` (LW6) - Path-based conditional skill activation

## Related Documents

- [core_architecture.md](./core_architecture.md) - Skill loading and registration details
- [skill_tool.md](./skill_tool.md) - Skill tool implementation
- [integrations.md](./integrations.md) - System reminder, compact, hooks integration
- [verifier_skills.md](./verifier_skills.md) - Verifier skill subsystem
- [builtin_skills_reference.md](./builtin_skills_reference.md) - Built-in skills catalog
- [skill_discovery_loading.md](./skill_discovery_loading.md) - Discovery and loading pipeline
- [skill_reminder_integration.md](./skill_reminder_integration.md) - System reminder integration
