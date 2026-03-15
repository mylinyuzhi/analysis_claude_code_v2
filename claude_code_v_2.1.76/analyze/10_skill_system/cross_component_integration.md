# Skill System Cross-Component Integration (Claude Code 2.1.76)

## Overview

The Skill System integrates with multiple Claude Code subsystems, creating a cohesive extension mechanism. This document provides a high-level view of all integration points, data flows, and architectural decisions.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skill System section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools, System Prompts)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands)

---

## Integration Architecture

```
                        ┌──────────────────────────────────┐
                        │         SKILL SYSTEM             │
                        │  (10_skill_system/)              │
                        └──────────────────────────────────┘
                                        │
        ┌───────────────┬───────────────┼───────────────┬───────────────┐
        │               │               │               │               │
        ▼               ▼               ▼               ▼               ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ TOOLS SYSTEM  │ │ REMINDER      │ │ COMPACT       │ │ HOOKS SYSTEM  │ │ PERMISSION    │
│               │ │ SYSTEM        │ │ SYSTEM        │ │               │ │ SYSTEM        │
├───────────────┤ ├───────────────┤ ├───────────────┤ ├───────────────┤ ├───────────────┤
│ SkillTool     │ │ skill_listing │ │ invoked_skills│ │ Hook          │ │ Auto-allow    │
│ (wt)          │ │ attachment    │ │ attachment    │ │ Registration  │ │ Rules         │
└───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘
        │               │               │               │               │
        ▼               ▼               ▼               ▼               ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ LLM invokes   │ │ LLM discovers │ │ Skills        │ │ Skills        │ │ Safe skills   │
│ skills        │ │ skills        │ │ preserved     │ │ register      │ │ auto-allowed  │
│ via tool call │ │ via reminder  │ │ across        │ │ lifecycle     │ │ dangerous     │
│               │ │               │ │ compaction    │ │ handlers      │ │ skills ask    │
└───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘
```

---

## Integration 1: Tools System

### Entry Point: SkillTool (wt)

**File:** chunks.132.mjs:820-1073
**Full Analysis:** [skill_tool.md](skill_tool.md)

The Skill tool bridges LLM tool-calling with the skill execution system.

```
LLM Tool Call Flow
──────────────────

LLM calls Skill tool { skill: "commit", args: "..." }
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ validateInput()                                           │
│  • Trim skill name                                       │
│  • Strip "/" prefix (supports /name syntax)              │
│  • Look up in registry (cZ)                              │
│  • Check disableModelInvocation                          │
│  • Verify prompt-based type                              │
└──────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ checkPermissions()                                        │
│  • Check deny rules                                      │
│  • Check allow rules                                     │
│  • Auto-allow if safe properties only (XNY)              │
│  • Otherwise ask user                                   │
└──────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ call()                                                    │
│  • Forked: executeForkedSkill (wNY) → subagent           │
│  • Inline: handlePromptCommandFromTool (Pb4)             │
│  • Register hooks if defined                             │
│  • Return newMessages + contextModifier                  │
└──────────────────────────────────────────────────────────┘
```

### Context Modifier Return

```javascript
// Inline execution returns
{
    data: { success: true, commandName, allowedTools, model },
    newMessages: [...],           // Prompt messages to add
    contextModifier: (ctx) => ctx  // Modifies tool permissions
}
```

---

## Integration 2: System Reminder

### Skill Discovery for LLM

**File:** chunks.142.mjs:2381-2395
**Full Analysis:** [skill_reminder_integration.md](skill_reminder_integration.md)

Skills are injected into system-reminder messages so the LLM knows what's available.

```
Skill Discovery Flow
────────────────────

Session Start
       │
       ▼
generateSkillListingAttachment (OIY)
       │
       ├── getSkillsForLLMInvocation (hv)
       │   • Filter: type === "prompt"
       │   • Filter: !disableModelInvocation
       │   • Filter: source !== "builtin"
       │
       ├── Filter already-sent skills (xg1 Set)
       │
       └── formatSkillListing (BU7)
           • Token budget aware
           • Format: "name: description"
       │
       ▼
skill_listing Attachment
{
    type: "skill_listing",
    content: "commit: Create git commits...",
    skillCount: 5,
    isInitial: true
}
```

### Delta Updates

After initial discovery, only new skills are sent:

```javascript
// Global Set tracks sent skills
const sentSkillNames = new Set();

// In generateSkillListingAttachment
const newSkills = skills.filter(s => !sentSkillNames.has(s.name));
for (const skill of newSkills) {
    sentSkillNames.add(skill.name);
}
```

---

## Integration 3: Compact System

### State Preservation

**File:** chunks.146.mjs:2710-2722
**Full Analysis:** [skill_compact_interaction.md](skill_compact_interaction.md)

When context compaction occurs, invoked skills are preserved via state anchoring.

```
Compaction Flow with Skills
───────────────────────────

Pre-Compaction:
┌─────────────────────────────────────────────────────────┐
│ Conversation History                                      │
│ ├── [Skill invoked: commit]                              │
│ ├── Prompt: "Create a git commit..."                     │
│ ├── ...many messages...                                  │
│ └── [Context threshold exceeded]                         │
└─────────────────────────────────────────────────────────┘
       │
       ▼
collectSkillsToKeep (da4)
       │
       ├── getInvokedSkills (zR6) → Map of invoked skills
       ├── Sort by invocation timestamp
       └── Create invoked_skills attachment
       │
       ▼
Post-Compaction:
┌─────────────────────────────────────────────────────────┐
│ Compacted Conversation                                    │
│ ├── Summary: "User was creating a commit..."             │
│ ├── [Attachment: invoked_skills]                         │
│ │   └── Skills restored: commit                          │
│ ├── [Attachment: files]                                  │
│ └── ...continues...                                       │
└─────────────────────────────────────────────────────────┘
```

### invoked_skills Attachment Structure

```typescript
interface InvokedSkillsAttachment {
    type: "invoked_skills";
    skills: Array<{
        name: string;      // "commit"
        path: string;      // "/project/.claude/skills/commit/SKILL.md"
        content: string;   // Full skill content
    }>;
}
```

---

## Integration 4: Hooks System

### Hook Registration from Skills

**File:** chunks.130.mjs:1361
**Full Analysis:** [skill_context_modifier.md](skill_context_modifier.md#hook-registration)
**Hook System:** [11_hooks/implementation.md](../11_hooks/implementation.md)

Skills can define hooks that are registered upon invocation.

```yaml
# SKILL.md with hooks
---
hooks:
  PreToolUse:
    - match: Bash
      command: ./validate-bash.sh
  PostToolUse:
    - match: Write
      agent: review-agent
---
```

### Registration Flow

```
Skill Invocation
       │
       ▼
SkillTool.call() checks for hooks
       │
       ▼
registerSkillHooks (IM6)
       │
       ├── For each hook event type
       │   ├── Extract matcher
       │   ├── Extract hook config
       │   └── Add to sessionHooks
       │
       ▼
Hooks Active for Session
       │
       ▼
executeHooksIterator (NI) runs hooks on events
```

### Hook Types

| Hook | When Triggered | Skill Use Case |
|------|----------------|----------------|
| `PreToolUse` | Before tool execution | Validate Bash commands |
| `PostToolUse` | After successful tool | Log file changes |
| `PostToolUseFailure` | After failed tool | Error recovery |
| `SessionStart` | Session begins | Initialize environment |
| `SessionEnd` | Session ends | Cleanup |

---

## Integration 5: Permission System

### Auto-Allow vs Ask

**File:** chunks.132.mjs:752-761

Skills with only safe properties are auto-allowed; others require user confirmation.

```
Permission Decision Flow
────────────────────────

checkPermissions() called
       │
       ├── Deny rule matches? → DENY
       │
       ├── Allow rule matches? → ALLOW
       │
       ├── validateSkillProperties (XNY)?
       │   │
       │   ├── All properties in SKILL_PROPERTY_KEYS?
       │   │   └── Yes → ALLOW (auto-allow)
       │   │
       │   └── Has allowedTools, hooks, etc?
       │       └── No → ASK user
       │
       └── Default → ASK user
```

### Safe vs Unsafe Properties

```javascript
// Safe properties (auto-allow if only these present)
SKILL_PROPERTY_KEYS = new Set([
    "type", "name", "description", "version",
    "userInvocable", "isEnabled", "isHidden",
    "context", "agent", "model",
    "getPromptForCommand", "progressMessage",
    ...
]);

// Unsafe properties (require permission)
// - allowedTools: Grants additional tool access
// - hooks: Can execute arbitrary code
```

---

## Integration 6: Slash Command System

### Unified Command Registry

**File:** chunks.168.mjs:2292-2306
**Full Analysis:** [overview.md](overview.md)

Skills and slash commands share the same registry. Every skill is a command.

```
Command Sources
───────────────

┌─────────────────────────────────────────────────────────────┐
│                    getAllCommands (cZ)                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Built-in Commands (type: "local", "local-jsx")             │
│  ├── /help, /clear, /compact                                │
│  └── User-only, never via Skill tool                        │
│                                                              │
│  Project Skills (type: "prompt")                            │
│  ├── .claude/skills/*/SKILL.md                              │
│  └── User + LLM invocable                                   │
│                                                              │
│  Plugin Skills (type: "prompt")                             │
│  ├── {plugin}/skills/*.md                                   │
│  └── With pluginInfo metadata                               │
│                                                              │
│  Bundled Skills (type: "prompt")                            │
│  ├── Registered via Sj (registerPromptSkill)                │
│  └── Built-in prompt skills                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Invocation Paths

```
User types "/commit"                    LLM calls Skill tool
       │                                       │
       ▼                                       ▼
handleSlashInput (Mb4)                 SkillTool.call (wt)
       │                                       │
       ├── parseSlashCommand                   ├── validateInput
       │                                       │
       └── executeCommand (ifY)                └── checkPermissions
               │                                       │
               └───────────────┬───────────────────────┘
                               │
                               ▼
                    handlePromptCommand (Wb4)
                               │
                               ├── getPromptForCommand()
                               │
                               └── Return messages + contextModifier
```

---

## Data Flow Summary

### Session Lifecycle

```
┌──────────────────────────────────────────────────────────────────────────┐
│ SESSION START                                                             │
├──────────────────────────────────────────────────────────────────────────┤
│ 1. loadSkills (ukA) → Discover from all directories                      │
│ 2. loadPluginSkills (B0A) → Load from plugins                            │
│ 3. getAllCommands (cZ) → Merge into registry                             │
│ 4. generateSkillListingAttachment (OIY) → Initial skill discovery        │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ SKILL INVOCATION                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ 1. LLM/User invokes skill                                                │
│ 2. SkillTool validates and checks permissions                            │
│ 3. getPromptForCommand generates prompt                                  │
│ 4. Hooks registered (if defined)                                         │
│ 5. contextModifier applied (allowedTools, model)                         │
│ 6. recordSkillUsage for ranking                                          │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ COMPACTION (if triggered)                                                 │
├──────────────────────────────────────────────────────────────────────────┤
│ 1. collectSkillsToKeep (da4) → Preserve invoked skills                   │
│ 2. Create invoked_skills attachment                                       │
│ 3. Skills restored in post-compaction context                            │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ SESSION END                                                               │
├──────────────────────────────────────────────────────────────────────────┤
│ • Hooks cleaned up                                                        │
│ • Skills cache cleared                                                    │
│ • Usage stats persisted                                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Key Design Principles

### 1. Unified Abstraction
Skills, slash commands, and plugin commands share the same command object structure. The `type` field distinguishes invocation patterns.

### 2. Lazy Discovery
Skills are discovered once (memoized) and filtered on-demand. The `skill_listing` attachment is generated only when needed, respecting token budgets.

### 3. State Anchoring
Skills are preserved across compaction via the state preservation mechanism, not by re-injecting full prompts. This maintains behavior continuity while saving tokens.

### 4. Permission Isolation
Skills with context-modifying capabilities (`allowedTools`, `hooks`) require explicit user approval. Safe skills are auto-allowed for smoother UX.

### 5. Forked Isolation
Skills with `context: "fork"` run in isolated subagents, preventing context pollution while enabling complex multi-step workflows.

---

## Related Documentation

- [overview.md](overview.md) - Architecture and unified abstraction
- [implementation.md](implementation.md) - Detailed code analysis
- [skill_discovery_loading.md](skill_discovery_loading.md) - Loading pipeline
- [skill_context_modifier.md](skill_context_modifier.md) - Context modification and hook registration
- [skill_tool.md](skill_tool.md) - Skill tool details
- [skill_reminder_integration.md](skill_reminder_integration.md) - Reminder system
- [skill_compact_interaction.md](skill_compact_interaction.md) - Compaction
- [plugin_skills.md](plugin_skills.md) - Plugin integration
- [11_hooks/implementation.md](../11_hooks/implementation.md) - Complete hooks system
- [plugin_skills.md](plugin_skills.md) - Plugin integration