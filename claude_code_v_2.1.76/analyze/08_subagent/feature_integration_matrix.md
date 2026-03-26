# Subagent Feature Integration Matrix (Claude Code 2.1.76)

> Complete cross-feature integration analysis for the subagent system.
> Documents all integration points with other Claude Code modules.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

---

## Integration Overview

The subagent system integrates with virtually every major module in Claude Code. This matrix documents all integration points, data flows, and dependencies.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Subagent Integration Ecosystem                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌───────────────────┐                              │
│                          │   08_subagent     │                              │
│                          │   (AgentTool)     │                              │
│                          └─────────┬─────────┘                              │
│                                    │                                        │
│     ┌──────────────────────────────┼──────────────────────────────┐        │
│     │                              │                              │        │
│     ▼                              ▼                              ▼        │
│ ┌─────────────┐            ┌─────────────┐              ┌─────────────┐    │
│ │ 05_tools    │            │04_system_   │              │ 07_compact  │    │
│ │ Tool Filter │            │ reminder    │              │ Transcript  │    │
│ └─────────────┘            └─────────────┘              └─────────────┘    │
│                                                                              │
│     ┌──────────────────────────────┼──────────────────────────────┐        │
│     │                              │                              │        │
│     ▼                              ▼                              ▼        │
│ ┌─────────────┐            ┌─────────────┐              ┌─────────────┐    │
│ │ 17_hooks    │            │ 12_plan_mode│              │30_agent_teams│   │
│ │ Pre/Post    │            │ AskUser     │              │ Teammate    │    │
│ └─────────────┘            └─────────────┘              └─────────────┘    │
│                                                                              │
│     ┌──────────────────────────────┼──────────────────────────────┐        │
│     │                              │                              │        │
│     ▼                              ▼                              ▼        │
│ ┌─────────────┐            ┌─────────────┐              ┌─────────────┐    │
│ │ 06_mcp      │            │ 15_state    │              │ 26_background│   │
│ │ External    │            │ Management  │              │ Async Exec  │    │
│ └─────────────┘            └─────────────┘              └─────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration Matrix

### Matrix Table

| Module | Integration Type | Direction | Key Functions | Purpose |
|--------|-----------------|-----------|---------------|---------|
| 04_system_reminder | Attachment Producer | Subagent → Reminder | `suY`, `Nqq`, `nl4` | Progress/status updates |
| 05_tools | Tool Filtering | AgentTool → Tools | `Xk8`, `_c` | Filter available tools |
| 06_mcp | Tool Access | AgentTool → MCP | `CW6`, `eP1` | MCP tool availability |
| 07_compact | Transcript Filter | Compact → Subagent | `hf6`, `wP6` | Resume from transcript |
| 12_plan_mode | AskUserQuestion | Plan → Subagent | Permission check | User approval flow |
| 15_state_management | State Store | Bidirectional | `Zf`, `i9` | Task registration |
| 17_hooks | Hook Execution | Hooks → Subagent | `r24`, `zZ6` | Pre/Post tool hooks |
| 26_background_agents | Execution Mode | AgentTool → Background | `Qn4`, `Un4` | Background spawning |
| 30_agent_teams | Teammate Spawning | AgentTool → Teams | `qn4`, `pNY` | Team collaboration |

---

## Detailed Integration Analysis

### 1. Integration with 04_system_reminder

**Purpose:** Subagent progress and status communicated via system reminders.

**Data Flow:**
```
Subagent Execution
        │
        ├── Each turn ────────────────┐
        │                              ▼
        │                    updateTaskProgressWithTelemetry (nl4)
        │                    • Update progress.summary
        │                    • Send telemetry
        │
        └── Completion ───────────────┐
                                       ▼
                          markTaskCompleted / Failed / Killed
                          • Update status
                          • Set notified: false

Parent Session (before LLM turn)
        │
        ▼
getTaskStatusAttachments (suY)
        │
        ├── Running ──────────────────┐
        │   (throttled)               ▼
        │                    task_progress attachment
        │                    • taskId, message
        │
        └── Terminal ─────────────────┐
            (not yet notified)         ▼
                          task_status attachment
                          • status, deltaSummary
```

**Key Functions:**
- `nl4` - updateTaskProgressWithTelemetry (chunks.146.mjs:2059)
- `suY` - getTaskStatusAttachments (chunks.147.mjs:1033)
- `Nqq` - getUnretrievedTaskStatuses (chunks.147.mjs:1923)
- `wY4` - pollTaskOutputs (chunks.90.mjs:3058)

**Attachment Types:**

| Type | Trigger | Content |
|------|---------|---------|
| `task_progress` | Running, throttled | taskId, message |
| `task_status` | Terminal state | status, description, deltaSummary |

---

### 2. Integration with 05_tools

**Purpose:** Filter available tools for subagent based on context.

**Tool Filter Flow:**
```
AgentTool.call()
        │
        ▼
filterToolsForSubagent (Xk8)
        │
        ├── Check MCP tools ──────────► Always allow (mcp__ prefix)
        │
        ├── Check excluded set (CW6) ──► Block: TaskOutput, ExitPlanMode, etc.
        │
        ├── Check async allowed (eP1) ─► If async: only allow whitelist
        │
        └── Return filtered tool list
```

**Tool Filter Constants:**

| Set | Content | Usage |
|-----|---------|-------|
| `CW6` | TaskOutput, ExitPlanMode, EnterPlanMode, Agent, AskUserQuestion, TaskStop | Always excluded from background |
| `eP1` | Read, Write, Edit, Bash, Grep, Glob, WebFetch, WebSearch, TodoWrite, etc. | Allowed for async agents |
| `WY4` | TaskCreate, TaskGet, TaskList, TaskUpdate, SendMessage, CronCreate, etc. | Team delegate tools |

**Why This Matters:**
- Prevents infinite loops (TaskOutput polling)
- Prevents blocking (AskUserQuestion in background)
- Enables controlled delegation

---

### 3. Integration with 06_mcp

**Purpose:** MCP tools are always available to subagents unless explicitly blocked.

**Integration Rules:**
```javascript
// MCP tools bypass the filter
if (tool.name.startsWith("mcp__")) return true;
```

**Implications:**
- External tools can be used in subagents
- MCP server availability affects subagent capabilities
- No special handling needed for MCP tools

---

### 4. Integration with 07_compact

**Purpose:** Transcript handling for resume and message filtering.

**Resume Flow:**
```
AgentTool.call({ resume: agentId })
        │
        ▼
loadTranscript (hf6)
        │
        ▼
filterMessagesForFork
        │
        ├── Remove orphaned tool results (wP6)
        │
        ├── Filter whitespace-only (BQ1)
        │
        └── Filter thinking-only (mQ1)
        │
        ▼
Use as initial messages for resumed agent
```

**Key Functions:**
- `hf6` - loadTranscript (chunks.174.mjs:2705)
- `wP6` - stripOrphanedToolResults (chunks.173.mjs:344)
- `BQ1` - filterWhitespaceAssistant (chunks.173.mjs:1388)
- `mQ1` - filterThinkingOnlyAssistant (chunks.173.mjs:1435)

**Why Message Filtering:**
- **Orphaned results** - Tool results without corresponding tool_use
- **Whitespace** - Empty assistant messages waste tokens
- **Thinking-only** - Internal reasoning not needed in fork

---

### 5. Integration with 12_plan_mode

**Purpose:** Plan mode approval flow and tool restrictions.

**Integration Points:**

1. **AskUserQuestion in Plan Mode:**
```javascript
// Allow AskUserQuestion in plan mode
if (isToolNamed(tool, "AskUserQuestion") && permissionMode === "plan") {
    return true;
}
```

2. **Plan Approval for Teammates:**
```javascript
if (plan_mode_required) {
    // Teammate must get plan approval before execution
}
```

3. **ExitPlanMode Blocked:**
- Subagents cannot call ExitPlanMode
- Prevents rogue plan approval

---

### 6. Integration with 15_state_management

**Purpose:** Task registration and state updates.

**State Flow:**
```
createBackgroundAgentTask (Qn4)
        │
        ▼
createTaskEntry (RG)
        │
        ▼
registerTask (Zf) ───────► appState.tasks[taskId] = taskRecord
        │
        │ During execution
        ▼
atomicUpdateTask (i9) ───► Progress updates, status changes
        │
        │ On completion
        ▼
removeTask (VR) ─────────► Remove from appState.tasks
```

**Key Functions:**
- `RG` - createTaskEntry (chunks.41.mjs:2418)
- `Zf` - registerTask (chunks.90.mjs:3019)
- `i9` - atomicUpdateTask (chunks.90.mjs:3003)
- `VR` - removeTask (chunks.90.mjs:3037)

---

### 7. Integration with 17_hooks

**Purpose:** Hook execution in subagent context.

**Hook Integration:**
```
Subagent Tool Execution
        │
        ▼
registerAgentHooks (r24)
        │
        ├── Register PreToolUse hook
        │   └── Validate tool access for background
        │
        └── Register PostToolUse hook
            └── Capture output for background task
        │
        │ On completion
        ▼
deregisterAgentHooks (zZ6)
```

**Key Functions:**
- `r24` - registerAgentHooks (chunks.95.mjs:1842)
- `zZ6` - deregisterAgentHooks (chunks.95.mjs:1830)

**Hook Behavior in Subagents:**
- **Background agents** - Hooks may have different behavior
- **Tool access validation** - PreToolUse can reject disallowed tools
- **Output capture** - PostToolUse captures for output file

---

### 8. Integration with 26_background_agents

**Purpose:** Background execution mode for subagents.

**Execution Mode Selection:**
```
AgentTool.call()
        │
        ├── run_in_background: true
        │   └── createBackgroundAgentTask (Qn4)
        │       • isBackgrounded: true
        │       • Returns immediately
        │
        ├── team_name + name
        │   └── spawnTeammate (qn4)
        │       • Teammate execution
        │       • Mailbox communication
        │
        └── Default
            └── createForegroundAgentTask (Un4)
                • May auto-background after timeout
                • Blocks until completion
```

**Key Differences:**

| Mode | isBackgrounded | Communication | Tool Access |
|------|---------------|---------------|-------------|
| Foreground | false | Direct | Full |
| Background | true | Output file | Filtered (eP1) |
| Teammate | false | Mailbox | Filtered |

---

### 9. Integration with 30_agent_teams

**Purpose:** Teammate spawning and team collaboration.

**Teammate Flow:**
```
AgentTool.call({ name, team_name })
        │
        ▼
spawnTeammateDispatcher (pNY)
        │
        ├── Check: isAgentTeamsAvailable()
        │
        ├── Check: isTeammateAgent() → Error if true
        │
        └── Route to backend:
            ├── In-process (non-interactive)
            ├── Split-pane (iTerm2/tmux)
            └── Tmux-only (fallback)
        │
        ▼
spawnTeammate (qn4)
        │
        ▼
inProcessAgentRunner (XNY)
        │
        └── pollForNextMessage (DNY)
```

**Key Functions:**
- `pNY` - spawnTeammateDispatcher (chunks.135.mjs:1110)
- `qn4` - spawnTeammate (chunks.135.mjs:1116)
- `XNY` - inProcessAgentRunner (chunks.134.mjs:1571)
- `DNY` - pollForNextMessage (chunks.134.mjs:1483)

**Mailbox Integration:**
- `wl` - readMailbox (chunks.132.mjs:3)
- `x3` - writeToMailbox (chunks.132.mjs:22)

---

## Feature Dependency Graph

```
                    ┌─────────────┐
                    │ 08_subagent │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │05_tools     │ │04_system_   │ │15_state_    │
    │(required)   │ │reminder     │ │management   │
    └─────────────┘ │(required)   │ │(required)   │
                    └─────────────┘ └─────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │26_background│ │30_agent_    │ │07_compact   │
    │agents       │ │teams        │ │(optional)   │
    │(optional)   │ │(optional)   │ └─────────────┘
    └─────────────┘ └─────────────┘
                           │
                   ┌───────┴───────┐
                   │               │
                   ▼               ▼
            ┌─────────────┐ ┌─────────────┐
            │17_hooks     │ │12_plan_mode │
            │(optional)   │ │(optional)   │
            └─────────────┘ └─────────────┘
```

---

## Integration Test Checklist

### System Reminder Integration
- [ ] Progress attachment appears after 3 turns
- [ ] Status attachment appears on completion
- [ ] Notification shown in UI on completion

### Tool Filtering
- [ ] Background agents cannot use AskUserQuestion
- [ ] Background agents cannot use TaskOutput
- [ ] MCP tools always available

### Compact Integration
- [ ] Resume loads transcript correctly
- [ ] Orphaned tool results filtered
- [ ] Thinking-only messages filtered

### Hooks Integration
- [ ] PreToolUse hook called in subagent
- [ ] PostToolUse hook captures output
- [ ] Hooks deregistered on completion

### Background Agents
- [ ] Background task returns immediately
- [ ] Output file created and updated
- [ ] Kill signal propagates correctly

### Agent Teams
- [ ] Teammate spawns in correct backend
- [ ] Mailbox messages received
- [ ] Teammate cannot spawn teammate

---

## Related Documents

- [feature_interconnections.md](./feature_interconnections.md) - Detailed integration analysis
- [tools_integration.md](./tools_integration.md) - Tool filtering details
- [system_reminder_deep_integration_source_restored.md](./system_reminder_deep_integration_source_restored.md) - Reminder integration
- [../26_background_agents/feature_integration_matrix.md](../26_background_agents/feature_integration_matrix.md) - Background agents integration