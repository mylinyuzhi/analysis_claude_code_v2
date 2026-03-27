# Cross-Module Integration Matrix (Claude Code 2.1.76)

> Complete mapping of integration points between the Tools, MCP, Plan Mode, Task System, System Reminder, and UI modules.

---

## Integration Matrix Overview

| From \ To | Tools (05) | MCP (06) | Plan Mode (12) | Task System (13) | System Reminder (04) | UI (02) |
|-----------|------------|----------|----------------|------------------|----------------------|---------|
| **Tools (05)** | - | Tool delegation | Permission filtering | Task tools | Attachments | Rendering |
| **MCP (06)** | Tool registry | - | MCP in plan mode | - | Elicitation | Server status |
| **Plan Mode (12)** | Tool filtering | MCP allowed | - | Task integration | Attachments | Status display |
| **Task System (13)** | Task tools | - | Task in plan | - | Status updates | Task list |
| **System Reminder (04)** | Hook attachments | Elicitation | Plan variants | Task status | - | isMeta flag |
| **UI (02)** | Modal priority | Elicitation dialog | Mode indicator | Task visualization | Message filter | - |

---

## Detailed Integration Points

### Tools ↔ MCP

**Integration Type:** Tool Delegation

**Key Functions:**
- `fetchMcpTools` (JE) - Discovers MCP tools and registers in tool set
- `callMcpTool` (pC) - Executes MCP tool through standard pipeline
- `executeMcpToolCall` (F3z) - Low-level execution with retry

**Data Flow:**
```
MCP Server connects
       │
       ├─→ tools/list request
       │
       ├─→ For each tool:
       │     ├─→ Prefix name: mcp__<server>__<tool>
       │     ├─→ Extract annotations
       │     └─→ Create tool object
       │
       └─→ Register in session tool set
```

**Documentation:**
- [05_tools/dynamic_tools.md](../05_tools/dynamic_tools.md)
- [06_mcp/mcp_connection_lifecycle_complete.md](../06_mcp/mcp_connection_lifecycle_complete.md)

---

### Tools ↔ Plan Mode

**Integration Type:** Permission Filtering

**Key Functions:**
- `filterToolsByMode` (Xk8) - Filters available tools based on mode
- `isReadOnly()` - Tool method checked for plan mode allowance

**Allowed Tools in Plan Mode:**
- All tools where `isReadOnly() === true`
- `EnterPlanMode` (for re-entry)
- `ExitPlanMode` (only programmatic exit)
- `AskUserQuestion` (for clarification)
- `Write`/`Edit` (restricted to plan file path only)

**Documentation:**
- [12_plan_mode/tool_filtering_complete.md](../12_plan_mode/tool_filtering_complete.md)

---

### Tools ↔ Task System

**Integration Type:** Tool Definitions

**Key Tools:**
- `TaskCreate` - Create new task
- `TaskUpdate` - Update status, owner, dependencies
- `TaskGet` - Retrieve task details
- `TaskList` - List all tasks

**Data Flow:**
```
Agent calls TaskCreate
       │
       ├─→ aD1 (createTask)
       │     ├─→ Lock file
       │     ├─→ Get high watermark
       │     ├─→ Write task JSON
       │     └─→ Release lock
       │
       └─→ task_status attachment generated
```

**Documentation:**
- [05_tools/task_management_tools.md](../05_tools/task_management_tools.md)
- [13_task_system/implementation.md](../13_task_system/implementation.md)

---

### Tools ↔ System Reminder

**Integration Type:** Attachment Generation

**Attachment Types Generated:**
| Type | Trigger | Content |
|------|---------|---------|
| `progress` | Tool progress callback | Current operation status |
| `hook_additional_context` | Pre-hook returns context | Additional context data |
| `hook_blocking_error` | Pre-hook denies execution | Error message |
| `hook_permission_decision` | Permission decision made | Decision details |
| `task_status` | Task state change | Task update info |

**Documentation:**
- [05_tools/tool_reminder_integration.md](../05_tools/tool_reminder_integration.md)
- [05_tools/cross_system_integration_v3.md](../05_tools/cross_system_integration_v3.md)

---

### Tools ↔ UI

**Integration Type:** Rendering & Modals

**Key Functions:**
- `renderToolUseMessage` - Per-tool rendering
- `renderToolResultMessage` - Result display
- `determineActiveModal` (ra6) - Modal priority

**Modal Priority for Tools:**
| Priority | Modal | Condition |
|----------|-------|-----------|
| 3 | sandbox-permission | Pending sandbox request |
| 4 | tool-permission | Tool permission queue |
| 5 | prompt | Prompt dialog |

**Documentation:**
- [05_tools/tool_ui_interaction_complete.md](../05_tools/tool_ui_interaction_complete.md)
- [05_tools/tool_permission_ui_complete.md](../05_tools/tool_permission_ui_complete.md)

---

### MCP ↔ System Reminder

**Integration Type:** Elicitation & Resources

**Attachment Types:**
| Type | Trigger | Content |
|------|---------|---------|
| `elicitation` | MCP server requests input | Form schema or URL |
| `mcp_resource` | Resource content fetched | Resource data |
| `mcp_instructions` | Server instructions | Usage guidance |

**Elicitation Flow:**
```
MCP Server calls elicitation/create
       │
       ├─→ Check mode (form/URL)
       │
       ├─→ Enqueue in elicitation.queue
       │
       ├─→ UI shows elicitation modal (priority 7)
       │
       └─→ User response → elicitation_result attachment
```

**Documentation:**
- [06_mcp/elicitation_complete.md](../06_mcp/elicitation_complete.md)
- [06_mcp/mcp_reminder_integration.md](../06_mcp/mcp_reminder_integration.md)

---

### MCP ↔ UI

**Integration Type:** State Display

**UI Elements:**
- MCP server connection status
- Tool count per server
- Elicitation dialog (form/URL modes)
- Error notifications

**State Slice:**
```typescript
interface McpStateSlice {
  clients: McpClient[];
  tools: Tool[];
  resources: Resource[];
  pluginReconnectKey: number;
}
```

**Documentation:**
- [06_mcp/ui_linkage.md](../06_mcp/ui_linkage.md)
- [06_mcp/elicitation_ui_complete.md](../06_mcp/elicitation_ui_complete.md)

---

### Plan Mode ↔ System Reminder

**Integration Type:** Mode Attachments

**Attachment Types:**
| Type | Trigger | Content |
|------|---------|---------|
| `plan_mode` | Entered plan mode | Full workflow instructions |
| `plan_mode_reentry` | Subsequent turn in plan | Brief reminder |
| `plan_mode_exit` | Exited plan mode | Confirmation |
| `plan_file_reference` | After compaction | Plan file content |

**Variant Selection:**
```javascript
function planModeReminderDispatcher(attachment) {
  if (attachment.isSubAgent) return formatSubagentPlanReminder();
  if (attachment.reminderType === "sparse") return formatSparsePlanReminder();
  if (attachment.iterativeMode) return formatIterativePlanReminder();
  return formatFullPlanReminder();
}
```

**Documentation:**
- [12_plan_mode/reminder_system.md](../12_plan_mode/reminder_system.md)

---

### Plan Mode ↔ UI

**Integration Type:** Mode Display

**UI Elements:**
- Status line: "⏸ Plan Mode on (shift+tab)"
- Color theme: planMode (cyan)
- Plan approval dialog
- Mode cycling indicator

**Color Definitions:**
```javascript
const planModeColors = {
  light: "rgb(0,102,102)",
  ansi: "ansi:cyan",
  dark: "rgb(51,102,102)"
};
```

**Documentation:**
- [12_plan_mode/plan_mode_ui_complete_v2.md](../12_plan_mode/plan_mode_ui_complete_v2.md)
- [12_plan_mode/ui_linkage.md](../12_plan_mode/ui_linkage.md)

---

### Task System ↔ System Reminder

**Integration Type:** Status Updates

**Attachment Types:**
| Type | Trigger | Content |
|------|---------|---------|
| `task_status` | Task create/update/delete | Task change info |
| `task_claimed` | Task assigned to agent | Assignment notification |
| `task_progress` | Task progress update | Progress percentage |
| `task_reminder` | Periodic reminder | All task summary |

**Documentation:**
- [13_task_system/task_reminder_integration.md](../13_task_system/task_reminder_integration.md)

---

### Task System ↔ UI

**Integration Type:** Task Visualization

**UI Elements:**
- Task list in expanded view
- Status indicators (pending/in_progress/completed)
- Owner display
- Dependency graph visualization

**State Management:**
```typescript
interface TaskStateSlice {
  expandedView: "tasks" | "messages";
  tasks: Task[];
  selectedTaskId: string | null;
}
```

**Documentation:**
- [13_task_system/task_ui_complete.md](../13_task_system/task_ui_complete.md)

---

### Task System ↔ Agent Teams (30)

**Integration Type:** Multi-Agent Coordination

**Key Functions:**
- `claimTask` (OT8) - Claim with validation
- `claimTaskWithAgentBusyValidation` ($N9) - Check agent workload
- `unassignTeammateTasks` (ft) - Cleanup on shutdown

**Claim Flow:**
```
Agent requests task claim
       │
       ├─→ Lock task file
       │
       ├─→ Validate:
       │     ├─→ Task exists
       │     ├─→ Not claimed by other
       │     ├─→ Not completed
       │     ├─→ Not blocked
       │     └─→ Agent not busy (optional)
       │
       ├─→ Update task owner
       │
       └─→ Release lock
```

**Documentation:**
- [13_task_system/task_locking_complete.md](../13_task_system/task_locking_complete.md)
- [13_task_system/team_integration.md](../13_task_system/team_integration.md)

---

## Summary Statistics

| Integration Pair | Attachment Types | Key Functions | Documentation Files |
|------------------|------------------|---------------|---------------------|
| Tools ↔ MCP | - | JE, pC, F3z | 3 |
| Tools ↔ Plan Mode | - | Xk8, isReadOnly | 2 |
| Tools ↔ Task System | task_status | TaskCreate, TaskUpdate | 3 |
| Tools ↔ System Reminder | 5 types | y4q, k4q | 2 |
| Tools ↔ UI | - | ra6, render* | 2 |
| MCP ↔ System Reminder | 3 types | Elicitation handlers | 2 |
| MCP ↔ UI | - | McpStateSlice | 2 |
| Plan Mode ↔ System Reminder | 4 types | Wzz, Nzz, Ezz | 1 |
| Plan Mode ↔ UI | - | Dp, color config | 2 |
| Task System ↔ System Reminder | 4 types | OT8, WI | 1 |
| Task System ↔ UI | - | TaskStateSlice | 1 |
| Task System ↔ Teams | - | OT8, $N9, ft | 2 |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Complete integration matrix for Tools, MCP, Plan Mode, Task System |

---

**Last Updated:** 2026-03-27
**Version:** Claude Code 2.1.76