# Background Agents Feature Integration Matrix (Claude Code 2.1.76)

> Complete cross-feature integration analysis for the background agent system.
> Documents all integration points with other Claude Code modules.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

---

## Integration Overview

Background agents integrate deeply with multiple systems for task execution, output capture, progress tracking, and user notification.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Background Agents Integration Ecosystem                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌───────────────────┐                              │
│                          │ 26_background_    │                              │
│                          │ agents            │                              │
│                          └─────────┬─────────┘                              │
│                                    │                                        │
│     ┌──────────────────────────────┼──────────────────────────────┐        │
│     │                              │                              │        │
│     ▼                              ▼                              ▼        │
│ ┌─────────────┐            ┌─────────────┐              ┌─────────────┐    │
│ │ 04_system_  │            │ 05_tools    │              │ 01_cli      │    │
│ │ reminder    │            │ BashTool    │              │ /tasks      │    │
│ │ Attachments │            │ AgentTool   │              │ Ctrl+C/F    │    │
│ └─────────────┘            └─────────────┘              └─────────────┘    │
│                                                                              │
│     ┌──────────────────────────────┼──────────────────────────────┐        │
│     │                              │                              │        │
│     ▼                              ▼                              ▼        │
│ ┌─────────────┐            ┌─────────────┐              ┌─────────────┐    │
│ │ 07_compact  │            │ 17_hooks    │              │ 15_state    │    │
│ │ Transcript  │            │ Pre/Post    │              │ Management  │    │
│ │ Filtering   │            │ Tool Hooks  │              │ Task Store  │    │
│ └─────────────┘            └─────────────┘              └─────────────┘    │
│                                                                              │
│     ┌──────────────────────────────┼──────────────────────────────┐        │
│     │                              │                              │        │
│     ▼                              ▼                              ▼        │
│ ┌─────────────┐            ┌─────────────┐              ┌─────────────┐    │
│ │ 08_subagent │            │ 32_keybinds │              │ 17_telemetry│    │
│ │ Spawn       │            │ Kill Ctrl+F │              │ Progress    │    │
│ └─────────────┘            └─────────────┘              └─────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration Matrix

### Matrix Table

| Module | Integration Type | Direction | Key Functions | Purpose |
|--------|-----------------|-----------|---------------|---------|
| 04_system_reminder | Attachment Producer | Background → Reminder | `suY`, `Nqq`, `nl4`, `wY4` | Progress/status attachments |
| 05_tools | Tool Execution | Tools → Background | `h4`, `rj1` | BashTool, AgentTool background modes |
| 01_cli | User Interface | CLI → Background | `U4q`, `d4q` | Task list, kill commands |
| 07_compact | Transcript Filter | Compact → Background | `wP6`, `BQ1` | Message filtering for output |
| 15_state_management | State Store | Bidirectional | `Zf`, `i9`, `VR` | Task state management |
| 17_hooks | Hook Execution | Hooks → Background | `r24`, `zZ6` | Pre/Post tool hooks |
| 08_subagent | Spawn Mechanism | AgentTool → Background | `Qn4`, `Un4` | Background task creation |
| 32_keybindings | Keyboard Shortcuts | Keys → Background | Ctrl+C, Ctrl+F | Kill all agents |
| 17_telemetry | Progress Telemetry | Background → Telemetry | `nl4`, `c36` | Usage tracking |

---

## Detailed Integration Analysis

### 1. Integration with 04_system_reminder

**Purpose:** Background task status communicated via system reminder attachments.

**Attachment Flow:**
```
Background Task Execution
        │
        ├── Progress Update (nl4)
        │   │
        │   └── task_progress attachment
        │       <task_progress>
        │         <task_id>a3f4b2</task_id>
        │         <task_type>local_agent</task_type>
        │         <message>Running Grep for "pattern"...</message>
        │       </task_progress>
        │
        └── Completion (markTaskCompleted/Failed/Killed)
            │
            └── task_status attachment
                <task_status>
                  <task_id>a3f4b2</task_id>
                  <status>completed</status>
                  <description>Search codebase</description>
                  <delta_summary>Found 15 occurrences...</delta_summary>
                </task_status>
```

**Throttle Mechanism:**
- Progress attachments throttled to every 3+ assistant turns
- Status attachments sent once (guarded by `notified` flag)

**Key Functions:**
- `nl4` - updateTaskProgressWithTelemetry (chunks.146.mjs:2059)
- `suY` - getTaskStatusAttachments (chunks.147.mjs:1033)
- `Nqq` - getUnretrievedTaskStatuses (chunks.147.mjs:1923)
- `wY4` - pollTaskOutputs (chunks.90.mjs:3058)

---

### 2. Integration with 05_tools

**Purpose:** Tool execution modes that support background operation.

**BashTool Background Modes:**

```javascript
// BashTool supports three backgrounding modes:
// 1. Explicit: run_in_background: true
// 2. Timeout: Long-running command + timeout exceeded
// 3. Interrupt: User Ctrl+C during command

// Mode 1: Explicit background
BashTool.call({
    command: "npm run build",
    run_in_background: true  // Explicit background
});

// Mode 2: Timeout-based backgrounding
BashTool.call({
    command: "npm run test",
    timeout: 60000  // If exceeds timeout, auto-background
});

// Mode 3: Interrupt-based backgrounding
// User presses Ctrl+C → Command backgrounds instead of killing
```

**AgentTool Background Mode:**

```javascript
// AgentTool supports run_in_background parameter
AgentTool.call({
    prompt: "Search the codebase for all uses of...",
    description: "Find API usages",
    run_in_background: true  // Spawn background agent
});

// Returns immediately:
// { status: "async_launched", agentId: "a3f4b2", outputFile: "..." }
```

**Tool Access Control:**

| Tool | Background Access | Reason |
|------|------------------|--------|
| `TaskOutput` | ❌ Blocked | Prevent polling loops |
| `ExitPlanMode` | ❌ Blocked | Requires user approval |
| `EnterPlanMode` | ❌ Blocked | Requires user approval |
| `Agent` | ❌ Blocked | Prevent nested background |
| `AskUserQuestion` | ❌ Blocked | Would block indefinitely |
| `Read` | ✅ Allowed | Read-only |
| `Write` | ✅ Allowed | File creation |
| `Edit` | ✅ Allowed | File modification |
| `Bash` | ✅ Allowed | Shell commands |
| `Grep` | ✅ Allowed | Content search |
| `Glob` | ✅ Allowed | File search |

---

### 3. Integration with 01_cli

**Purpose:** User interface for task management.

**Slash Commands:**

| Command | Purpose | Implementation |
|---------|---------|---------------|
| `/tasks` | List all background tasks | Task list modal |
| `/clear` | Clear notifications | Includes task notifications |

**Keyboard Shortcuts:**

| Shortcut | Action | Condition |
|----------|--------|-----------|
| `Ctrl+C` | Show kill confirmation | Agents running |
| `Ctrl+F` | Execute kill all | After Ctrl+C |
| `x` (in task list) | Kill selected task | Running task |
| `f` (in task list) | Foreground teammate | Teammate task |

**Kill Flow:**
```
User presses Ctrl+C
        │
        ▼
hasRunningAgents check
        │
        ├── No running agents ──► Normal Ctrl+C (cancel stream)
        │
        └── Has running agents ──► Show confirmation
                │
                ▼
        User presses Ctrl+F (within timeout)
                │
                ▼
        killAllLocalAgents (U4q)
                │
                ├── For each local_agent task:
                │   └── triggerAbortSignal (x66)
                │       └── markTaskKilled (d4q)
                │
                └── Show notification
```

---

### 4. Integration with 07_compact

**Purpose:** Transcript handling and message filtering for background tasks.

**Compact Interaction:**

```javascript
// Background task messages stored in output file
// Not included in main conversation for compaction

// When compact runs:
// 1. Background task messages are NOT in main transcript
// 2. Output files persist independently
// 3. Task state preserved across compaction

// On resume:
// 1. Load transcript from output file
// 2. Filter messages for fork:
//    - Remove orphaned tool results
//    - Remove whitespace-only messages
//    - Remove thinking-only messages
```

**Message Filtering:**
- Background tasks don't pollute main conversation
- Output files act as secondary transcript storage
- Compact doesn't affect running background tasks

---

### 5. Integration with 15_state_management

**Purpose:** Task state registration and updates.

**State Flow:**
```
Task Creation
        │
        ▼
createTaskEntry (RG)
        │
        ▼
registerTask (Zf) ──► appState.tasks[taskId] = taskRecord
        │
        │ During execution
        ▼
atomicUpdateTask (i9)
        │
        ├── Progress updates (nl4)
        ├── Status changes
        └── Notification flags
        │
        │ On completion
        ▼
Task cleanup
        │
        ├── Keep task in state for notification
        └── Remove after notified: true
```

**Task Record Fields:**
```javascript
{
    id: "a3f4b2",
    type: "local_agent",
    status: "running" | "completed" | "failed" | "killed",
    description: "Search codebase",
    prompt: "Search for...",
    startTime: 1711459200000,
    endTime: null,
    outputFile: "~/.claude/tasks/a3f4b2.output",
    outputOffset: 1024,
    notified: false,
    progress: {
        toolUseCount: 5,
        tokenCount: 1234,
        summary: "Running Grep..."
    },
    abortController: AbortController,
    isBackgrounded: true,
    pendingMessages: []
}
```

---

### 6. Integration with 17_hooks

**Purpose:** Hook execution in background agent context.

**Hook Registration:**
```javascript
// When background agent starts:
registerAgentHooks(agentContext)

// PreToolUse hook:
// - Validates tool access for background agents
// - Can reject disallowed tools

// PostToolUse hook:
// - Captures tool output
// - Writes to output file
// - Updates progress

// When background agent ends:
deregisterAgentHooks(agentContext)
```

**Background-Specific Hook Behavior:**
- PreToolUse checks against `eP1` (allowed tools)
- PostToolUse writes to output file via `appendToOutputFile`
- Hooks may be suppressed for certain tools

---

### 7. Integration with 08_subagent

**Purpose:** Subagent spawning mechanism for background execution.

**Spawn Decision Tree:**
```
AgentTool.call()
        │
        ├── run_in_background: true
        │   │
        │   └── createBackgroundAgentTask (Qn4)
        │       • Create task record
        │       • Initialize output file
        │       • Create abort controller
        │       • Register cleanup handler
        │       • Return immediately with agentId
        │
        ├── run_in_background: false
        │   │
        │   └── createForegroundAgentTask (Un4)
        │       • May auto-background after timeout
        │       • Blocks until completion
        │
        └── name + team_name
            │
            └── spawnTeammate (qn4)
                • Teammate mode (not background)
```

**Key Differences:**

| Aspect | Foreground | Background |
|--------|------------|------------|
| Return | Blocks until done | Returns immediately |
| Output | In conversation | Output file |
| Progress | Real-time | System reminders |
| Tools | Full access | Filtered |
| Kill | Ctrl+C cancels | Ctrl+C → Ctrl+F kills |

---

### 8. Integration with 32_keybindings

**Purpose:** Keyboard shortcuts for background agent management.

**Keybinding Definitions:**

```javascript
// Ctrl+C with running agents → Show kill confirmation
// Ctrl+F after confirmation → Execute kill all

// In task list modal:
// x → Kill selected task
// f → Foreground teammate
// ↑/↓ → Navigate tasks
// Enter → View details
// Esc → Close modal
```

**Kill All Binding (v2.1.76):**
- New `Ctrl+F` shortcut for explicit kill all
- Two-stage confirmation prevents accidents
- Partial results preserved in output files

---

### 9. Integration with 17_telemetry

**Purpose:** Progress and usage telemetry for background tasks.

**Telemetry Events:**

| Event | Trigger | Data |
|-------|---------|------|
| `task_progress` | Each progress update | taskId, usage, summary |
| `task_completed` | Task finishes successfully | taskId, duration, tokens |
| `task_failed` | Task fails with error | taskId, error |
| `task_killed` | User kills task | taskId, partial results |
| `tengu_cancel` | Kill all triggered | source: "kill_agents" |

**Progress Telemetry:**
```javascript
// In nl4 (updateTaskProgressWithTelemetry):
if (isTelemetryEnabled()) {
    sendTelemetry({
        type: "system",
        subtype: "task_progress",
        task_id: taskId,
        usage: {
            total_tokens: tokenCount,
            tool_uses: toolUseCount,
            duration_ms: duration
        },
        summary: summary
    });
}
```

---

## Feature Dependency Graph

```
                    ┌─────────────────┐
                    │26_background_   │
                    │agents           │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │05_tools     │   │04_system_   │   │15_state_    │
    │(required)   │   │reminder     │   │management   │
    └─────────────┘   │(required)   │   │(required)   │
                      └─────────────┘   └─────────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │01_cli       │   │08_subagent  │   │17_telemetry │
    │(optional)   │   │(required)   │   │(optional)   │
    └─────────────┘   └─────────────┘   └─────────────┘
                             │
                     ┌───────┴───────┐
                     │               │
                     ▼               ▼
              ┌─────────────┐ ┌─────────────┐
              │07_compact   │ │17_hooks     │
              │(optional)   │ │(optional)   │
              └─────────────┘ └─────────────┘
```

---

## Output File System

### File Structure
```
~/.claude/
└── tasks/
    ├── a3f4b2c1.output    # local_agent output
    ├── b7d8e9f2.output    # local_bash output
    ├── t2a3b4c5.output    # in_process_teammate output
    └── r9d8c7b6.output    # remote_agent output
```

### File Operations

| Operation | Function | Purpose |
|-----------|----------|---------|
| Get path | `g2` | Resolve task ID to file path |
| Initialize | `initOutputFile` | Create empty output file |
| Append | `appendToOutputFile` | Write incremental output |
| Read delta | `readOutputFileDelta` | Read new bytes since offset |
| Read full | `readFullOutput` | Read complete output file |

---

## Integration Test Checklist

### System Reminder Integration
- [ ] Progress attachment appears in LLM context
- [ ] Status attachment on completion
- [ ] Notification shown to user

### Tool Integration
- [ ] BashTool backgrounds correctly
- [ ] AgentTool returns immediately for background
- [ ] Disallowed tools blocked in background

### CLI Integration
- [ ] `/tasks` shows task list
- [ ] Ctrl+C shows confirmation
- [ ] Ctrl+F kills all agents
- [ ] Task list keyboard shortcuts work

### State Management
- [ ] Tasks register in state
- [ ] Progress updates correctly
- [ ] Tasks cleanup after completion

### Hooks Integration
- [ ] Hooks execute in background context
- [ ] Output captured to file
- [ ] Hooks deregister on completion

### Telemetry Integration
- [ ] Progress events sent
- [ ] Completion events sent
- [ ] Kill events tracked

---

## Related Documents

- [feature_interconnections.md](./feature_interconnections.md) - Detailed integration
- [system_reminder_producers_complete.md](./system_reminder_producers_complete.md) - Reminder producers
- [output_capture_source_restored.md](./output_capture_source_restored.md) - Output file system
- [kill_handlers_source_restored.md](./kill_handlers_source_restored.md) - Kill handlers
- [../08_subagent/feature_integration_matrix.md](../08_subagent/feature_integration_matrix.md) - Subagent integration