# Slash Command Integration - Subagent System (Claude Code 2.1.76)

## Overview

This document covers the integration between the subagent system and slash commands, including the `/loop` command (CronCreate tool), `/compact` command integration, and skill invocation via the SkillTool.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `CronCreateTool` (ER) - Create scheduled tasks - chunks.91.mjs:192
- `CronDeleteTool` (ed) - Delete scheduled tasks - chunks.91.mjs:194
- `CronListTool` (SW6) - List scheduled tasks - chunks.91.mjs:196
- `SkillTool` (wt) - Invoke skills - chunks.132.mjs:820
- `TOOL_NAME_SKILL` (oH) - "Skill" constant - chunks.90.mjs:2596

---

## /loop Command Integration

### Overview

The `/loop` command enables recurring task execution through the CronCreate tool. When a user invokes `/loop`, it creates a scheduled job that periodically enqueues a prompt for execution.

### CronCreate Tool (ER)

```javascript
// ============================================
// CronCreate - Create scheduled recurring task
// Location: chunks.91.mjs:192-250
// ============================================

// ORIGINAL (for source lookup):
ER = "CronCreate"

// Tool input schema:
{
  "name": "CronCreate",
  "description": "Schedule a prompt to be enqueued at a future time...",
  "input_schema": {
    "type": "object",
    "properties": {
      "cron": {
        "type": "string",
        "description": "Standard 5-field cron expression in local time"
      },
      "prompt": {
        "type": "string",
        "description": "The prompt to enqueue at each fire time"
      },
      "recurring": {
        "type": "boolean",
        "default": true,
        "description": "true = fire on every cron match; false = fire once then delete"
      }
    },
    "required": ["cron", "prompt"]
  }
}
```

### How /loop Works

```
┌─────────────────────────────────────────────────────────────┐
│                    /loop Command Flow                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User types: /loop 5m /foo                                  │
│                                                              │
│  1. Slash command parser recognizes /loop                   │
│     └─ Expands to: "Use CronCreate to schedule..."          │
│                                                              │
│  2. Agent invokes CronCreate tool:                          │
│     {                                                        │
│       cron: "*/5 * * * *",  // every 5 minutes              │
│       prompt: "/foo",                                        │
│       recurring: true                                        │
│     }                                                        │
│                                                              │
│  3. CronCreate stores job in session memory:                │
│     Map<jobId, {cron, prompt, recurring}>                   │
│                                                              │
│  4. Scheduler fires when cron matches:                      │
│     └─ Enqueues prompt into agent's message queue           │
│                                                              │
│  5. Agent processes prompt when REPL is idle                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Cron Expression Format

Uses standard 5-field cron in local timezone:

```
┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12)
│ │ │ │ ┌───────────── day of week (0-6, Sunday=0)
│ │ │ │ │
* * * * *
```

**Examples:**
- `*/5 * * * *` - Every 5 minutes
- `0 9 * * *` - Every day at 9am local
- `0 9 * * 1-5` - Weekdays at 9am local
- `30 14 28 2 *` - Feb 28 at 2:30pm local (one-shot with recurring: false)

### Runtime Behavior

**Session-only:** Jobs live only in the current session memory. They are not persisted to disk and are lost when Claude exits.

**Idle execution:** Jobs only fire when the REPL is idle (not mid-query). This prevents interrupting active work.

**Jitter:** The scheduler adds deterministic jitter:
- Recurring tasks: up to 10% of period late (max 15 min)
- One-shot tasks on :00 or :30: up to 90s early

**Auto-expiry:** Recurring tasks expire after 3 days, fire one final time, then delete.

### CronDelete and CronList

```javascript
// ============================================
// CronDelete - Cancel a scheduled job
// Location: chunks.91.mjs:194
// ============================================

// Tool input schema:
{
  "name": "CronDelete",
  "input_schema": {
    "properties": {
      "id": { "type": "string", "description": "Job ID returned by CronCreate" }
    },
    "required": ["id"]
  }
}

// ============================================
// CronList - List all scheduled jobs
// Location: chunks.91.mjs:196
// ============================================

// Returns array of {id, cron, prompt, recurring}
```

---

## /compact Command Integration

### Overview

The `/compact` command triggers the conversation compaction system to reduce token usage while preserving essential context.

### Integration with Subagents

When a subagent runs, the parent's compaction state affects the fork context:

```
┌─────────────────────────────────────────────────────────────┐
│                 Compaction & Subagents                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Parent Agent:                                               │
│  ┌─────────────────────────────────────────────┐            │
│  │ Conversation History (potentially compacted) │            │
│  │ - System prompts                            │            │
│  │ - User messages                             │            │
│  │ - Assistant messages (possibly summarized)  │            │
│  │ - Tool results                              │            │
│  └─────────────────────────────────────────────┘            │
│                       │                                      │
│                       ▼                                      │
│  buildForkContextMessages (Nn7):                            │
│  ┌─────────────────────────────────────────────┐            │
│  │ Filters and prepares context for subagent   │            │
│  │ - Removes or summarizes old messages        │            │
│  │ - Preserves recent conversation             │            │
│  │ - Includes current task context             │            │
│  └─────────────────────────────────────────────┘            │
│                       │                                      │
│                       ▼                                      │
│  Subagent receives:                                          │
│  ┌─────────────────────────────────────────────┐            │
│  │ Forked context (reduced token footprint)    │            │
│  └─────────────────────────────────────────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Auto-Compact Trigger

Subagents can trigger auto-compaction when their token usage approaches limits:

```javascript
// ============================================
// Auto-Compact Decision
// Location: chunks.107.mjs:1707-1731
// ============================================

// Compaction triggers when:
// currentTokens > threshold * 0.8

// The 20% buffer ensures:
// 1. Room for next user message
// 2. Space for system prompts
// 3. Margin for token estimation inaccuracies
```

---

## Skill Invocation Integration

### Overview

Skills are specialized capabilities that can be invoked through the SkillTool. They integrate with the subagent system through tool whitelists and agent definitions.

### SkillTool (wt)

```javascript
// ============================================
// SkillTool - Invoke specialized capabilities
// Location: chunks.132.mjs:820
// ============================================

// ORIGINAL:
wt = SkillTool  // tool object
oH = "Skill"    // TOOL_NAME_SKILL constant

// Tool input schema:
{
  "name": "Skill",
  "description": "Execute a skill within the main conversation...",
  "input_schema": {
    "properties": {
      "skill": {
        "type": "string",
        "description": "The skill name"
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

### Skill Execution Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Skill Execution Flow                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Agent invokes Skill tool:                               │
│     { skill: "commit", args: "-m 'Fix bug'" }               │
│                                                              │
│  2. SkillTool validates skill exists:                       │
│     └─ Checks skill directory for matching skill            │
│                                                              │
│  3. Skill is loaded and executed:                           │
│     └─ Skill prompt is injected into context                │
│     └─ Agent follows skill instructions                     │
│                                                              │
│  4. For subagents with restricted tools:                    │
│     └─ Skill must be in allowed tools list (eP1)           │
│     └─ Skill tools are filtered by agent definition         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Skill Integration with Agent Definitions

Agent definitions can include skills in their tool whitelists:

```javascript
// Agent definition with skill support
{
  name: "code-reviewer",
  tools: ["Read", "Grep", "Glob", "Skill"],  // Skill tool allowed
  disallowedTools: ["Bash", "Write"],        // Cannot execute or write
  prompt: "Review code for quality issues..."
}
```

### Built-in Skills

From the tool schema description, available built-in skills include:

| Skill | Description |
|-------|-------------|
| `simplify` | Review code for reuse, quality, efficiency |
| `loop` | Run prompt/command on recurring interval |
| `claude-api` | Build apps with Claude API or Anthropic SDK |

---

## Integration with Tool Whitelists

### Where Skills and Cron Tools Appear

The tool whitelists for subagents include these integrations:

**eP1 (ASYNC_AGENT_ALLOWED_TOOLS):**
- Includes `Skill` (oH) - Skills can be invoked by async agents
- Includes `ToolSearch` (HZ) - Agents can search for available tools

**WY4 (TEAM_DELEGATE_TOOLS):**
- Includes `CronCreate` (ER) - Delegates can schedule tasks
- Includes `CronDelete` (ed) - Delegates can cancel schedules
- Includes `CronList` (SW6) - Delegates can view schedules

```javascript
// From chunks.91.mjs:269
eP1 = new Set([..., oH, ..., HZ, ...])  // Skill, ToolSearch
WY4 = new Set([..., ER, ed, SW6])        // CronCreate, CronDelete, CronList
```

---

## Design Rationale

### Why Cron Tools for Delegates?

Delegate agents are orchestrators that coordinate work across multiple agents. They need scheduling capabilities to:
1. Set up periodic monitoring tasks
2. Schedule follow-up reminders
3. Coordinate time-sensitive workflows

### Why Skills for Async Agents?

Async/background agents run autonomously. Skills provide:
1. Pre-packaged expertise for common tasks
2. Consistent execution patterns
3. Reduced need for complex prompting

### Why Session-Only Cron Jobs?

Cron jobs are session-only because:
1. **Security** - No persistent code execution without user intent
2. **Simplicity** - No state management across sessions
3. **User control** - Jobs stop when session ends
4. **Resource management** - Automatic cleanup prevents runaway jobs

---

## Symbol Reference

| Obfuscated | Readable | Location | Description |
|------------|----------|----------|-------------|
| ER | TOOL_NAME_CRON_CREATE | chunks.91.mjs:192 | "CronCreate" |
| ed | TOOL_NAME_CRON_DELETE | chunks.91.mjs:194 | "CronDelete" |
| SW6 | TOOL_NAME_CRON_LIST | chunks.91.mjs:196 | "CronList" |
| wt | SkillTool | chunks.132.mjs:820 | Skill tool object |
| oH | TOOL_NAME_SKILL | chunks.90.mjs:2596 | "Skill" constant |
| HZ | TOOL_NAME_TOOL_SEARCH | chunks.90.mjs:2285 | "ToolSearch" constant |
| dM | TOOL_NAME_TOOL_SEARCH | chunks.89.mjs:652 | Alternate constant |