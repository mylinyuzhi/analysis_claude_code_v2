# Hooks & Slash Commands Integration

## Overview

Slash commands are user-invoked operations (e.g., `/clear`, `/compact`, `/help`) that can trigger hooks as side effects. This document analyzes the integration between slash commands and the hooks system, focusing on which commands trigger which hook events and how the trigger context is conveyed.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks, Skills)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands)

Key functions in this document:
- `executeSessionStartHooks` (Qu8) - SessionStart hook dispatcher
- `executePreCompactHooks` (sT6) - PreCompact hook dispatcher
- `handleSlashInput` (Mb4) - Slash command router
- `parseSlashCommand` (Db4) - Parses `/command args` syntax

---

## Slash Commands That Trigger Hooks

### Summary Table

| Slash Command | Hook Event | Source/Trigger | Purpose |
|---------------|------------|----------------|---------|
| `/clear` | SessionStart | `source: "clear"` | Re-initialize session context |
| `/compact` | PreCompact | `trigger: "manual"` | Prepare for compaction |
| `/compact` | SessionStart | `source: "compact"` | Post-compaction initialization |
| Session resume | SessionStart | `source: "resume"` | Restore session context |
| Fresh start | SessionStart | `source: "startup"` | Initialize new session |

---

## `/clear` → SessionStart Hook

### Trigger Flow

```
User types "/clear"
       │
       ▼
parseSlashCommand() identifies "clear" command
       │
       ▼
handleSlashInput() routes to clear handler
       │
       ▼
Clear operation:
  • Reset conversation history
  • Clear state
  • Reset UI
       │
       ▼
executeSessionStartHooks("clear", {...})
       │
       ▼
SessionStart hooks run with source="clear"
```

### Hook Payload

```json
{
  "session_id": "<session UUID>",
  "transcript_path": "<path to transcript>",
  "cwd": "<current working directory>",
  "hook_event_name": "SessionStart",
  "source": "clear",
  "agent_type": "<agent type (optional)>",
  "model": "<model name (optional)>"
}
```

### Use Cases for `/clear` Triggered Hooks

1. **Environment refresh**: Reload environment variables, check for config changes
2. **Workspace state update**: Refresh git status, check for new files
3. **Notification**: Log that user cleared the session (audit trail)
4. **Cache invalidation**: Clear any cached data from previous context

### Key Insight

The `/clear` command provides a **clean slate** trigger. Unlike `startup` (new session) or `resume` (restore session), `clear` represents a user-initiated reset within the same session. Hooks can use this to:

- Distinguish between first-time setup (`startup`) and mid-session reset (`clear`)
- Preserve certain state across clears (e.g., project configuration)
- Clear caches that should not persist across context resets

---

## `/compact` → PreCompact & SessionStart Hooks

### Trigger Flow

```
User types "/compact"
       │
       ▼
parseSlashCommand() identifies "compact" command
       │
       ▼
handleSlashInput() routes to compact handler
       │
       ▼
┌──────────────────────────────────────────────┐
│ PHASE 1: PreCompact Hook                      │
│                                              │
│ executePreCompactHooks({                      │
│   trigger: "manual",                          │
│   customInstructions: null                    │
│ })                                           │
│                                              │
│ Hook can:                                    │
│ • Return custom instructions for summary     │
│ • Provide user feedback messages             │
└────────────────────┬─────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│ PHASE 2: LLM Summarization                    │
│                                              │
│ • Generate conversation summary              │
│ • Collect state from tools                   │
│ • Build new context window                   │
└────────────────────┬─────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│ PHASE 3: SessionStart Hook                    │
│                                              │
│ executeSessionStartHooks("compact", {...})   │
│                                              │
│ Hook can:                                    │
│ • Inject additional context                  │
│ • Perform post-compaction setup              │
└──────────────────────────────────────────────┘
```

### PreCompact Hook Payload

```json
{
  "session_id": "<session UUID>",
  "transcript_path": "<path to transcript>",
  "cwd": "<current working directory>",
  "hook_event_name": "PreCompact",
  "trigger": "manual",
  "custom_instructions": null
}
```

### SessionStart Hook Payload (Post-Compact)

```json
{
  "session_id": "<session UUID>",
  "transcript_path": "<path to transcript>",
  "cwd": "<current working directory>",
  "hook_event_name": "SessionStart",
  "source": "compact",
  "agent_type": "<agent type>",
  "model": "<model name>"
}
```

### Use Cases for `/compact` Triggered Hooks

**PreCompact hooks:**
1. **Context injection**: Add project-specific information to be preserved in summary
2. **Warning injection**: Alert about important state that shouldn't be lost
3. **Conditional compaction**: Block compaction if certain conditions not met

**SessionStart hooks (post-compact):**
1. **Environment revalidation**: Check that environment is still valid after context reset
2. **State restoration**: Re-inject state that was lost during compaction
3. **Logging**: Record compaction completion for analytics

### Match Query for Manual vs Auto

Hooks can match on the trigger type:

```json
{
  "hooks": [
    {
      "event": "PreCompact",
      "matcher": "manual",
      "type": "command",
      "command": "echo 'User-initiated compaction detected'"
    },
    {
      "event": "PreCompact",
      "matcher": "auto",
      "type": "command",
      "command": "echo 'Auto-compaction triggered'"
    }
  ]
}
```

---

## Session Start Sources

### Four Trigger Sources

SessionStart hooks distinguish between four sources:

| Source | Trigger | Context |
|--------|---------|---------|
| `startup` | Fresh session start | New Claude Code process |
| `resume` | Session restored | `--resume` flag or auto-recovery |
| `clear` | `/clear` command | User-initiated context reset |
| `compact` | After compaction | Compaction created new context window |

### Source Detection in Code

```javascript
// ============================================
// SessionStart Source Types
// Location: chunks.129.mjs:755 (schema definition)
// ============================================

// ORIGINAL (for source lookup):
source: u.enum(["startup", "resume", "clear", "compact"])

// READABLE (for understanding):
// The source field is an enum with four possible values:
// - "startup": Fresh session (new process)
// - "resume": Restored from previous session
// - "clear": After /clear command
// - "compact": After compaction completes
```

### Hook Matching by Source

Hooks can target specific sources:

```json
{
  "hooks": [
    {
      "event": "SessionStart",
      "matcher": "startup",
      "type": "command",
      "command": "./scripts/on-first-start.sh"
    },
    {
      "event": "SessionStart",
      "matcher": "clear",
      "type": "command",
      "command": "./scripts/on-clear.sh"
    }
  ]
}
```

---

## Other Slash Commands & Hooks

### Commands That Do NOT Trigger Hooks

Most slash commands do not trigger hooks directly:

| Command | Behavior | Hooks? |
|---------|----------|--------|
| `/help` | Display help text | No |
| `/review` | Start review mode | No |
| `/init` | Initialize project | No |
| `/permissions` | Manage permissions | No |
| `/doctor` | Run diagnostics | No |
| `/bug` | Report a bug | No |
| `/terminal-setup` | Configure terminal | No |
| `/mcp` | Manage MCP servers | No |
| `/cost` | Show token usage | No |
| `/model` | Change model | No |
| `/config` | Show configuration | No |

### Why These Don't Trigger Hooks

1. **Informational commands**: `/help`, `/cost`, `/config` - read-only display operations
2. **Configuration commands**: `/permissions`, `/model`, `/mcp` - settings changes, not lifecycle events
3. **Utility commands**: `/doctor`, `/bug` - diagnostic/reporting tools
4. **Mode changes**: `/review` - changes agent mode, but not a lifecycle event

### Potential Future Hook Events

The hooks system is extensible. Future versions might add:

- **PreSlashCommand** / **PostSlashCommand**: Before/after any slash command
- **ModelChange**: When model is changed via `/model`
- **McpServerStart** / **McpServerStop**: MCP server lifecycle
- **PermissionChange**: When permissions are modified

---

## Practical Examples

### Example 1: Clear Hook for Workspace Status

```json
{
  "hooks": [
    {
      "event": "SessionStart",
      "matcher": "clear",
      "type": "command",
      "command": "bash -c 'git status --short 2>/dev/null | head -10'",
      "timeout": 5000
    }
  ]
}
```

**Effect:** After `/clear`, inject current git status as context. The LLM sees what files have changed even after the conversation is cleared.

### Example 2: Compact Hook for Context Preservation

```json
{
  "hooks": [
    {
      "event": "PreCompact",
      "matcher": "manual",
      "type": "command",
      "command": "bash -c 'echo \"CRITICAL: Remember to preserve the database migration state in your summary.\"'"
    }
  ]
}
```

**Effect:** Before manual compaction, inject a reminder for the summarization process to preserve critical state.

### Example 3: Startup Hook for Environment Setup

```json
{
  "hooks": [
    {
      "event": "SessionStart",
      "matcher": "startup",
      "type": "command",
      "command": "bash -c 'node --version && npm --version && git --version'"
    }
  ]
}
```

**Effect:** On fresh session start, check and report tool versions. LLM can verify environment compatibility.

### Example 4: Resume Hook for State Recovery

```json
{
  "hooks": [
    {
      "event": "SessionStart",
      "matcher": "resume",
      "type": "command",
      "command": "bash -c 'cat ~/.claude/session-state.json 2>/dev/null || echo \"No saved state\"'"
    }
  ]
}
```

**Effect:** When resuming a session, load any saved state from a file.

---

## Integration Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    SLASH COMMAND → HOOK TRIGGER FLOW                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Input: "/clear"                                                        │
│       │                                                                      │
│       ▼                                                                      │
│  ┌──────────────────────────────────────┐                                    │
│  │ parseSlashCommand()                   │                                    │
│  │ • Parse command name: "clear"         │                                    │
│  │ • Parse arguments: (none)             │                                    │
│  └─────────────────┬────────────────────┘                                    │
│                    ▼                                                         │
│  ┌──────────────────────────────────────┐                                    │
│  │ handleSlashInput()                    │                                    │
│  │ • Route to clear handler              │                                    │
│  │ • Execute clear operation             │                                    │
│  └─────────────────┬────────────────────┘                                    │
│                    ▼                                                         │
│  ┌──────────────────────────────────────┐                                    │
│  │ Clear Operation                       │                                    │
│  │ • Reset conversation history          │                                    │
│  │ • Clear tool state                    │                                    │
│  │ • Reset UI state                      │                                    │
│  └─────────────────┬────────────────────┘                                    │
│                    ▼                                                         │
│  ┌──────────────────────────────────────┐                                    │
│  │ executeSessionStartHooks("clear")     │                                    │
│  │ • source: "clear"                     │                                    │
│  │ • Collect hook results                │                                    │
│  │ • Inject context into conversation    │                                    │
│  └──────────────────────────────────────┘                                    │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Input: "/compact"                                                      │
│       │                                                                      │
│       ▼                                                                      │
│  ┌──────────────────────────────────────┐                                    │
│  │ parseSlashCommand()                   │                                    │
│  │ • Parse command name: "compact"       │                                    │
│  │ • Parse arguments: (optional)         │                                    │
│  └─────────────────┬────────────────────┘                                    │
│                    ▼                                                         │
│  ┌──────────────────────────────────────┐                                    │
│  │ handleSlashInput()                    │                                    │
│  │ • Route to compact handler            │                                    │
│  └─────────────────┬────────────────────┘                                    │
│                    ▼                                                         │
│  ┌──────────────────────────────────────┐                                    │
│  │ PHASE 1: executePreCompactHooks()     │                                    │
│  │ • trigger: "manual"                   │                                    │
│  │ • Collect custom instructions         │                                    │
│  └─────────────────┬────────────────────┘                                    │
│                    ▼                                                         │
│  ┌──────────────────────────────────────┐                                    │
│  │ PHASE 2: Compaction Process           │                                    │
│  │ • LLM summarization                   │                                    │
│  │ • State collection                    │                                    │
│  │ • Context window rebuild              │                                    │
│  └─────────────────┬────────────────────┘                                    │
│                    ▼                                                         │
│  ┌──────────────────────────────────────┐                                    │
│  │ PHASE 3: executeSessionStartHooks()   │                                    │
│  │ • source: "compact"                   │                                    │
│  │ • Inject post-compact context         │                                    │
│  └──────────────────────────────────────┘                                    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary

### Slash Commands with Hook Triggers

| Command | Hook Chain | Purpose |
|---------|------------|---------|
| `/clear` | SessionStart(source="clear") | Post-clear reinitialization |
| `/compact` | PreCompact(trigger="manual") → SessionStart(source="compact") | Pre/post compaction |

### SessionStart Source Values

| Source | When | Match Query |
|--------|------|-------------|
| `startup` | Fresh session | `SessionStart:startup` |
| `resume` | Restored session | `SessionStart:resume` |
| `clear` | After `/clear` | `SessionStart:clear` |
| `compact` | After compaction | `SessionStart:compact` |

### Key Integration Points

1. **`/clear`** triggers SessionStart with `source: "clear"` - enables mid-session reset hooks
2. **`/compact`** triggers PreCompact with `trigger: "manual"` - enables pre-summarization injection
3. **`/compact`** triggers SessionStart with `source: "compact"` - enables post-compact reinitialization
4. Other slash commands do not currently trigger hooks

### Best Practices

1. **Use match queries** to target specific sources: `SessionStart:clear` vs `SessionStart:startup`
2. **Keep clear hooks fast** - user expects immediate response after `/clear`
3. **Use PreCompact for context injection** - add important state to be preserved in summary
4. **Use SessionStart:compact for reinitialization** - restore state after context reset