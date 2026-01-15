# Claude Code v2.1.7 - Subagent System Integration

## Overview

This document covers how the subagent system integrates with other Claude Code features: compact (context summarization), plan mode, TodoWrite, and background tasks.

> Symbol mappings: [symbol_index_core.md](../00_overview/symbol_index_core.md)

Key findings:
- **Compact**: YES, subagents DO execute compact independently
- **Plan Mode**: BLOCKED for subagents (explicit check)
- **TodoWrite**: Agent-specific (blocked for most agents)
- **Background Tasks**: Full integration with hooks and notifications

---

## Compact Integration

### Key Finding: Subagents DO Execute Compact

**Important**: Subagents run their own compact process independently.

```javascript
// ============================================
// autoCompactDispatcher - Auto-compact entry point
// Location: chunks.107.mjs (referenced from execution loop)
// ============================================

// The autoCompactDispatcher function has NO special handling for subagents.
// It treats all contexts equally, meaning subagents will compact their own
// message history when threshold is exceeded.

// Key flow:
// 1. O$ (mainAgentLoop) is called by executeAgent for subagents
// 2. O$ calls autoCompactDispatcher
// 3. autoCompactDispatcher has NO `isSubAgent` check to skip compaction
// 4. Subagents have their own `agentId` for compact tracking
```

### Compact Flow in Subagents

```
Subagent executes via executeAgent
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ Creates subagent context                                         │
│   - agentId: unique ID                                          │
│   - isSubAgent: true                                            │
│   - messages: own message array                                 │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ Calls mainAgentLoop with subagent context                        │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ During Execution                                                │
│   - If tokens exceed threshold, triggers autoCompactDispatcher  │
│   - Subagent's messages are compacted                           │
│   - Summary generated for subagent's context                    │
└─────────────────────────────────────────────────────────────────┘
```

### Implications

| Aspect | Behavior |
|--------|----------|
| Token counting | Per-subagent (subagent has own messages) |
| Compact trigger | Same threshold as main agent |
| Summary generation | Independent - summarizes subagent's work |
| Session log | Subagent compact tracked under its agentId |

**Practical Impact:**
- Long-running subagents may compact their own context
- Subagent summaries are independent of main agent's summaries
- Compact boundaries appear in subagent transcript

---

## Plan Mode Integration

### Key Finding: EnterPlanMode is BLOCKED for Subagents

Plan mode tools are blocked via system-wide blocked tools:

```javascript
// ============================================
// System-wide blocked tools for subagents
// Location: chunks.93.mjs:222, 292
// ============================================

// Explore agent:
disallowedTools: [f3, CY1, I8, BY, tq]
// f3 = Task, CY1 = ExitPlanMode, I8 = EnterPlanMode, BY = AskUserQuestion, tq = KillShell

// Plan agent:
disallowedTools: [f3, CY1, I8, BY, tq]
// Same restrictions
```

**Why Blocked:**
- Plan mode is a main conversation feature
- Subagent's job is to complete assigned task, not enter new modes
- Plan file is tied to main session, not subagent

### System Prompt Differences

Subagents may use a different system prompt context for plan mode:

| Mode | Main Agent | Subagent |
|------|------------|----------|
| Normal | Full system prompt | Agent-specific prompt |
| Plan mode | Plan mode instructions | N/A (blocked) |

### Plan Mode Tool Access

| Tool | Main Agent | Subagent |
|------|------------|----------|
| EnterPlanMode | ✅ Available | ❌ Blocked (system-wide) |
| ExitPlanMode | ✅ Available | ❌ Blocked (system-wide) |
| Read | ✅ | ✅ |
| Glob | ✅ | ✅ |
| Other tools | ✅ | Per-agent restrictions |

---

## TodoWrite Integration

### Key Finding: Agent-Specific Access

TodoWrite is NOT in system-wide blocked tools, but IS blocked for most agents via their specific tool restrictions:

### TodoWrite Access Matrix

| Agent | TodoWrite Access | Reason |
|-------|-----------------|--------|
| **Bash** | ❌ Blocked | Only has Bash tool |
| **general-purpose** | ✅ Allowed | Full capabilities (tools: ["*"]) |
| **Explore** | ❌ Blocked | Limited read-only tools |
| **Plan** | ❌ Blocked | Read-only, no task tracking |
| **statusline-setup** | ❌ Blocked | Limited tools (Read, Edit only) |
| **claude-code-guide** | ❌ Blocked | Limited tools (Glob, Grep, Read, WebFetch, WebSearch) |

### Why Block TodoWrite for Most Agents?

1. **Explore Agent**: Read-only by design - shouldn't modify anything
2. **Plan Agent**: Task is to plan, not track todos
3. **Specialized Agents**: Focused tool sets for specific purposes
4. **Bash Agent**: Command execution only

### What If Subagent Creates Todos?

For agents that CAN use TodoWrite (e.g., general-purpose):
- Todos are written to the session's todo file
- Same file as main agent uses
- Main agent can see subagent's todos
- Subagent should be careful not to duplicate main agent's tracking

**Best Practice:**
- Main agent should handle todo management
- Subagents should report findings, let main agent organize

---

## Background Tasks Integration

### Key Finding: Full Integration with Task System

Background subagents integrate with the broader task management system:

### Task Lifecycle Functions

```javascript
// ============================================
// Background Task Lifecycle
// Location: chunks.91.mjs
// ============================================

// Task creation:
L32 (createFullyBackgroundedAgent) → Creates background task entry
O32 (createBackgroundableAgent) → Creates backgroundable task entry

// Task state updates:
RI0 (updateTaskProgress) → Updates progress during execution
_I0 (markTaskCompleted) → Marks task as completed
jI0 (markTaskFailed) → Marks task as failed
$4A (killBackgroundTask) → Kills background task

// Notifications:
C4A (createTaskNotification) → Creates completion notification
```

### SubagentStart/SubagentStop Hooks

Background agents trigger hooks for monitoring:

```javascript
// ============================================
// Subagent Hooks
// Location: chunks.91.mjs (kz0)
// ============================================

// SubagentStart hook emitted when subagent begins
eventEmitter.emit("SubagentStart", { agentId, agentType, ... });

// SubagentStop hook emitted when subagent completes
eventEmitter.emit("SubagentStop", { agentId, status, ... });
```

**Hook Configuration (in CLAUDE.md or settings):**
```yaml
hooks:
  SubagentStart:
    - command: "echo 'Subagent started: $AGENT_TYPE'"
  SubagentStop:
    - command: "echo 'Subagent stopped: $STATUS'"
```

### Output File Management

Background agents write progress to output files:

```javascript
// ============================================
// Output File Functions
// Location: chunks.86.mjs
// ============================================

aY (formatOutputPath) → Generates output file path
g9A (appendToOutputFile) → Appends content to output file
K71 (getOutputPath) → Gets output path for task ID
OKA (registerOutputFile) → Registers output file (creates symlink)
```

**Output File Path Format:**
```
~/.claude/projects/{project-hash}/{session-id}/output-{agent-id}.md
```

**Symlink Structure:**
```
output-{agent-id}.md → actual transcript file
```

### Task State Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Subagent Task States                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                        ┌─────────┐                              │
│                        │ pending │                              │
│                        └────┬────┘                              │
│                             │                                    │
│            L32/O32 creates task entry                           │
│                             │                                    │
│                             ▼                                    │
│                       ┌──────────┐                              │
│                       │ running  │◄────── RI0 (progress updates)│
│                       └────┬─────┘                              │
│                            │                                     │
│         ┌──────────────────┼──────────────────┐                 │
│         │                  │                  │                 │
│         ▼                  ▼                  ▼                 │
│   ┌───────────┐     ┌──────────┐      ┌──────────┐             │
│   │ completed │     │  failed  │      │  killed  │             │
│   │   (_I0)   │     │  (jI0)   │      │  ($4A)   │             │
│   └───────────┘     └──────────┘      └──────────┘             │
│         │                  │                  │                 │
│         └──────────────────┼──────────────────┘                 │
│                            │                                     │
│                            ▼                                     │
│                   C4A (notification)                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Feature Comparison Table

| Feature | Main Agent | Subagent |
|---------|------------|----------|
| **Compact** | ✅ Yes | ✅ Yes (independent) |
| **EnterPlanMode** | ✅ Available | ❌ Blocked (system-wide) |
| **ExitPlanMode** | ✅ Available | ❌ Blocked (system-wide) |
| **TodoWrite** | ✅ Available | Agent-specific |
| **Task (spawn subagent)** | ✅ Available | ❌ Blocked (system-wide) |
| **AskUserQuestion** | ✅ Available | ❌ Blocked (system-wide) |
| **KillShell** | ✅ Available | ❌ Blocked (system-wide) |
| **Background execution** | ✅ Via Task | ✅ Full support |
| **Output file** | N/A | ✅ For background agents |
| **Hooks** | All hooks | SubagentStart/Stop |

---

## Integration Flow Diagram

```
Main Agent Context
    │
    │ (Task tool call)
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ Subagent Context Created                                        │
│   - isSubAgent: true                                            │
│   - Own agentId                                                 │
│   - Tool restrictions applied (system-wide + agent-specific)    │
│   - No EnterPlanMode/ExitPlanMode/Task                         │
│   - TodoWrite: per-agent                                        │
└─────────────────────────────────────────────────────────────────┘
    │
    │ (Subagent executes via mainAgentLoop)
    │
    │ ◄──── SubagentStart hook emitted
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ During Execution                                                │
│   - Compact: ✅ Runs if tokens exceed threshold                 │
│   - Plan tools: ❌ Blocked                                      │
│   - TodoWrite: Per-agent restrictions                           │
│   - Output file: ✅ Updated for background agents               │
│   - Progress: ✅ Tracked via RI0                               │
└─────────────────────────────────────────────────────────────────┘
    │
    │ (Subagent completes)
    │
    │ ◄──── SubagentStop hook emitted
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ Result Returned to Main Agent                                   │
│   - Final report only                                           │
│   - Compact summaries in subagent transcript                    │
│   - Todos (if created) in shared session file                   │
│   - Notification created (for background)                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## isSubAgent Flag Usage

```javascript
// ============================================
// isSubAgent Flag in Context
// Location: Various files
// ============================================

// Used for:
// 1. Tool filtering - system-wide blocked tools apply
// 2. Permission handling - shouldAvoidPermissionPrompts may be set
// 3. Hook configuration - SubagentStart/Stop hooks
// 4. UI callback handling - may be disabled for subagents
// 5. Compact tracking - independent per-agent compaction
```

---

## Summary

### Compact
- ✅ **Subagents DO run compact**
- Independent tracking per agentId
- Same threshold and logic as main agent
- Compact summaries saved to subagent transcript

### Plan Mode
- ❌ **EnterPlanMode/ExitPlanMode are BLOCKED** for subagents
- Blocked via system-wide blocked tools
- Subagents use simplified system prompts
- Plan mode is main agent's responsibility

### TodoWrite
- **Agent-specific** - not universally blocked
- ❌ Blocked for: Bash, Explore, Plan, statusline-setup, claude-code-guide
- ✅ Allowed for: general-purpose
- Writes to shared session todo file

### Background Tasks
- ✅ **Full integration** with task management system
- SubagentStart/SubagentStop hooks for monitoring
- Output file for progress tracking
- State machine: pending → running → completed/failed/killed
- Notification system for completion alerts

### Design Philosophy
- Subagents complete **specific tasks**, not manage sessions
- Plan mode is **main agent's responsibility**
- Todo management should be **main agent's job**
- Compact runs independently to manage **subagent's own context**
- Background execution is **first-class citizen** with full lifecycle management

---

## Related Symbols

> Symbol mappings: [symbol_index_core.md](../00_overview/symbol_index_core.md)

Key symbols in this document:
- `L32` (createFullyBackgroundedAgent) - Create background task
- `O32` (createBackgroundableAgent) - Create backgroundable task
- `RI0` (updateTaskProgress) - Update task progress
- `_I0` (markTaskCompleted) - Mark task completed
- `jI0` (markTaskFailed) - Mark task failed
- `$4A` (killBackgroundTask) - Kill background task
- `C4A` (createTaskNotification) - Create notification
- `aY` (formatOutputPath) - Format output file path
- `g9A` (appendToOutputFile) - Append to output file
- `kz0` (eventEmitter) - Hook event emitter

---

## See Also

- [architecture.md](./architecture.md) - Agent system architecture
- [execution.md](./execution.md) - Execution flow and patterns
- [builtin_agents.md](./builtin_agents.md) - Built-in agent details
- [communication.md](./communication.md) - Communication patterns
- [error_handling.md](./error_handling.md) - Error handling patterns
- [../26_background_agents/background_agents.md](../26_background_agents/background_agents.md) - Background task details
