# Cross-Feature Linkages Complete (Claude Code 2.1.76)

> Complete documentation of integration points between subagents/background agents and other Claude Code features.

---

## Overview

Subagents and background agents are deeply integrated with nearly every major subsystem in Claude Code. This document provides a comprehensive analysis of cross-feature linkages.

---

## Integration Matrix

| Feature | Subagent Integration | Background Agent Integration |
|---------|---------------------|------------------------------|
| 04_system_reminder | Task status attachments, hook context | Output polling, progress telemetry |
| 05_tools | AgentTool, TaskOutput, TaskStop | Tool filtering, tool execution |
| 07_compact | Transcript filtering, memory | Task preservation, output retention |
| 08_subagent | Agent spawning, mailbox | Background execution, state |
| 13_task_system | Task tools for delegates | Task creation, state updates |
| 17_hooks | SubagentStart, SubagentEnd | PreToolUse, PostToolUse |
| 26_background_agents | Background spawn, kill | Core functionality |
| 01_cli | Ctrl+C, Ctrl+F, /tasks | Task list, notifications |
| 30_agent_teams | Teammate spawning | In-process teammates |

---

## Integration 1: System Reminder (04_system_reminder)

### Subagent Integration

```
┌─────────────────────────────────────────────────────────────────────┐
│           SUBAGENT → SYSTEM REMINDER INTEGRATION                     │
└─────────────────────────────────────────────────────────────────────┘

SubagentStart Hook
    │
    ├── Additional context injection (f4)
    │   └── Hook returns context → System reminder attachment
    │
    └── SubagentEnd Hook
        └── Capture results → Task notification

Agent Loop
    │
    └── getUnifiedTasksAttachment (suY)
        └── Build task status → LLM context
```

### Background Agent Integration

```
┌─────────────────────────────────────────────────────────────────────┐
│       BACKGROUND AGENTS → SYSTEM REMINDER INTEGRATION               │
└─────────────────────────────────────────────────────────────────────┘

Task State Changes
    │
    ├── Task completed → markTaskCompleted ($m8)
    │   └── Creates notification attachment
    │
    ├── Task failed → markTaskFailed (Hm8)
    │   └── Creates error notification
    │
    └── Task killed → markTaskKilled (d4q)
        └── Creates kill notification

Progress Updates
    │
    └── updateTaskProgressWithTelemetry (nl4)
        └── Emits telemetry event
        └── Updates progress.summary
```

---

## Integration 2: Tools System (05_tools)

### AgentTool Integration

```
┌─────────────────────────────────────────────────────────────────────┐
│              AGENTTOOL → SUBAGENT INTEGRATION                        │
└─────────────────────────────────────────────────────────────────────┘

AgentTool.call({
    prompt: "...",
    subagent_type: "Explore",
    run_in_background: true,
    description: "Search codebase"
})
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Tool Input Validation                                                │
│   • aVY (agentInputSchema) validates input                          │
│   • eVY (agentOutputSchema) validates output                        │
└─────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Task Creation                                                         │
│   • Qn4 (createBackgroundAgentTask) for background                  │
│   • Un4 (createForegroundAgentTask) for foreground                  │
└─────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Tool Filtering                                                        │
│   • Xk8 (filterToolsForSubagent) applies rules                      │
│   • _c (applyToolFilters) applies whitelist/blacklist               │
└─────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Execution                                                             │
│   • qh (agentLoopRunner) runs agent loop                            │
│   • Yh (llmMessageLoop) processes messages                          │
└─────────────────────────────────────────────────────────────────────┘
```

### TaskOutput/TaskStop Integration

```
┌─────────────────────────────────────────────────────────────────────┐
│          TASKOUTPUT/TASKSTOP → BACKGROUND INTEGRATION                │
└─────────────────────────────────────────────────────────────────────┘

TaskOutput.call({ task_id: "a3k7m9p2" })
    │
    └── Reads output file via Z97 (readOutputFileDelta)
    └── Returns current output + status

TaskStop.call({ task_id: "a3k7m9p2" })
    │
    └── Calls x66 (triggerAbortSignal)
    └── Updates task status via d4q (markTaskKilled)
```

---

## Integration 3: Compact (07_compact)

### Subagent Transcript Handling

```
┌─────────────────────────────────────────────────────────────────────┐
│            COMPACT → SUBAGENT INTEGRATION                            │
└─────────────────────────────────────────────────────────────────────┘

Compact triggered
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Message Filtering                                                     │
│   • TvY (isMessageRecordable) determines which messages to keep     │
│   • Filter: assistant, user, progress, compact_boundary             │
└─────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Memory Preservation                                                   │
│   • Agent definition memory preserved                               │
│   • Subagent context maintained                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Background Agent Preservation

```
Background agent running during compact
    │
    └── Task state NOT affected
    └── Output file persists
    └── Agent continues independently
```

---

## Integration 4: Task System (13_task_system)

### Teammate Task Tools

```
┌─────────────────────────────────────────────────────────────────────┐
│            TASK SYSTEM → TEAMMATE INTEGRATION                        │
└─────────────────────────────────────────────────────────────────────┘

Teammate has access to task tools:
    │
    ├── TaskCreate - Create structured task
    ├── TaskGet - Get task by ID
    ├── TaskList - List all tasks
    └── TaskUpdate - Update task

Available when:
    └── isTeamMode() && isInProcessTeammate()
    └── Tools in WY4 (TEAM_DELEGATE_TOOLS)
```

---

## Integration 5: Hooks (17_hooks)

### Subagent Hook Events

```
┌─────────────────────────────────────────────────────────────────────┐
│              HOOKS → SUBAGENT INTEGRATION                            │
└─────────────────────────────────────────────────────────────────────┘

SubagentStart Hook
    │
    ├── Fires when subagent begins execution
    ├── Can inject additional context
    │   └── f4 (createAttachmentMessage)
    └── Logged with agent_id, agent_type

SubagentEnd Hook
    │
    ├── Fires when subagent completes/fails
    ├── Captures final result
    └── Logged with status, duration
```

### Background Agent Hook Events

```
PreToolUse Hook (in background context)
    │
    ├── Can block tool usage
    └── Has isAsync context flag

PostToolUse Hook
    │
    ├── Captures tool output
    └── Can modify result
```

---

## Integration 6: CLI (01_cli)

### Keyboard Shortcuts

```
┌─────────────────────────────────────────────────────────────────────┐
│              CLI → SUBAGENT/BACKGROUND INTEGRATION                   │
└─────────────────────────────────────────────────────────────────────┘

Ctrl+C Handler
    │
    ├── If foreground task running:
    │   └── x66 (triggerAbortSignal)
    │   └── d4q (markTaskKilled)
    │
    └── Else: Exit session

Ctrl+F Handler (v2.1.76)
    │
    └── U4q (killAllLocalAgents)
        └── Kills ALL running background agents

/tasks Command
    │
    └── Opens TaskListModal
        └── Shows all tasks from appState.tasks
```

### Status Line Integration

```
Status Line Display
    │
    ├── Running agent count
    │   └── Count of local_agent with status "running"
    │
    └── Kill hint
        └── "Ctrl+C to cancel" (interactive)
```

---

## Integration 7: Agent Teams (30_agent_teams)

### Teammate Spawning

```
┌─────────────────────────────────────────────────────────────────────┐
│          AGENT TEAMS → SUBAGENT INTEGRATION                          │
└─────────────────────────────────────────────────────────────────────┘

AgentTool.call({
    name: "worker1",
    team_name: "my_team",
    mode: "spawn"
})
    │
    ▼
pNY (spawnTeammateDispatcher)
    │
    ├── Check Rb() - In-process mode?
    │   └── Yes: FNY (in-process spawn)
    │
    ├── Check use_splitpane
    │   └── Yes: BNY (split-pane spawn)
    │
    └── Else: gNY (tmux spawn)
    │
    ▼
XNY (inProcessAgentRunner) - for in-process teammates
    │
    └── DNY (pollForNextMessage) - Message polling
    └── Mailbox: wl (readMailbox), x3 (writeToMailbox)
```

### Mailbox Communication

```
┌─────────────────────────────────────────────────────────────────────┐
│              TEAMMATE MAILBOX COMMUNICATION                          │
└─────────────────────────────────────────────────────────────────────┘

SendMessage.call({ to: "worker1", text: "..." })
    │
    └── x3 (writeToMailbox)
        └── Writes to .claude/teams/{team}/{agent}.json

Teammate polls mailbox
    │
    └── wl (readMailbox)
    └── DNY (pollForNextMessage)
        └── Returns new messages
        └── Vc6 (markMessageAsReadByIndex)
```

---

## Data Flow Summary

### Cross-Feature Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CROSS-FEATURE DATA FLOW                           │
└─────────────────────────────────────────────────────────────────────┘

User Input (01_cli)
    │
    ▼
Tool Call (05_tools) ─────────────────────┐
    │                                      │
    ├── AgentTool → Subagent (08_subagent) │
    │       │                              │
    │       ├── Tool Filtering             │
    │       ├── Task Creation              │
    │       └── Agent Execution            │
    │                                      │
    └── TaskOutput/TaskStop                │
            │                              │
            └── Background (26_background) │
                    │                      │
                    ├── Output Polling ────┤
                    ├── State Updates      │
                    └── Kill Handling      │
                                           │
Hooks (17_hooks) ◄─────────────────────────┤
    │                                      │
    ├── SubagentStart                      │
    └── SubagentEnd                        │
                                           │
System Reminders (04_system_reminder) ◄────┘
    │
    ├── Task Status Attachments
    ├── Progress Updates
    └── Notifications
```

---

## Key Integration Patterns

### Pattern 1: Event-Driven Integration

```
Event: Task completion
    │
    ├── Trigger: $m8 (markTaskCompleted)
    │
    └── Side Effects:
        ├── State update (i9)
        ├── Notification creation
        └── Telemetry emission
```

### Pattern 2: Polling-Based Integration

```
Poll: Agent turn
    │
    ├── Trigger: Each LLM call
    │
    └── Actions:
        ├── wY4 (pollTaskOutputs)
        ├── suY (getUnifiedTasksAttachment)
        └── OY4 (updateTaskState)
```

### Pattern 3: Hook-Based Integration

```
Hook: SubagentStart
    │
    ├── Trigger: Subagent begins
    │
    └── Actions:
        ├── Hook execution
        ├── Context injection (f4)
        └── Logging
```

---

## Summary

The cross-feature linkages demonstrate:

1. **Deep integration** - Subagents/background agents touch nearly every module
2. **Event-driven design** - Changes propagate through events
3. **Loose coupling** - Features communicate through well-defined interfaces
4. **Shared state** - appState.tasks is the single source of truth
5. **File-based communication** - Output files and mailboxes for persistence

The architecture enables complex multi-agent workflows while maintaining clean separation of concerns.