# Complete UI Analysis for Tools, MCP, Plan Mode, and Task System (Claude Code 2.1.76)

> Comprehensive UI design and interaction analysis for the four key modules.

---

## Overview

This document analyzes the UI components and interactions for:
- **05_tools** - Tool permission dialogs, progress tracking, result rendering
- **06_mcp** - Elicitation dialogs, server connection status
- **12_plan_mode** - Plan approval dialogs, mode indicator
- **13_task_system** - Task list visualization, status indicators

---

## 1. Modal Priority System

Claude Code uses a priority-based modal system to determine which dialog to show when multiple are pending.

### Priority Order (Highest → Lowest)

| Priority | Modal Type | Source Module |
|----------|------------|---------------|
| 1 | `sandbox-permission` | Bash tool sandbox |
| 2 | `tool-permission` | Tools module (canUseTool) |
| 3 | `worker-sandbox-permission` | Background agent sandbox |
| 4 | `elicitation` | MCP module |
| 5 | `ask-user-question` | Plan Mode |

### Priority Resolution Algorithm

```javascript
// Modal priority resolution
function getActiveModal(state) {
    if (state.sandboxPermissionQueue[0]) return "sandbox-permission";
    if (state.pendingToolRequest[0]) return "tool-permission";
    if (state.workerSandboxQueue[0]) return "worker-sandbox-permission";
    if (state.elicitation.queue[0]) return "elicitation";
    if (state.askUserQuestionQueue[0]) return "ask-user-question";
    return null;
}
```

---

## 2. Tools Module UI

### 2.1 Tool Permission Dialog

**When shown:** When `canUseTool` returns `{ behavior: "ask" }`

**UI Components:**
```
┌─────────────────────────────────────────────────────────────┐
│  🔧 Tool Permission Request                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Allow tool to execute?                                      │
│                                                              │
│  Tool: {toolName}                                            │
│  Input: {inputPreview}                                       │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ Yes, always     │  │ Yes, this time  │                   │
│  └─────────────────┘  └─────────────────┘                   │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ No, this time   │  │ No, always      │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
│  ⚠️ {riskWarning}                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Options:**
1. **Yes, always** - Add to allowed tools, save to settings
2. **Yes, this time** - Allow once for this session
3. **No, this time** - Deny once for this session
4. **No, always** - Add to denied tools, save to settings

**Hook Integration:**
```javascript
// Pre-tool hooks can provide permission bypass
if (hookPermissionResult?.behavior === "allow") {
    // Skip user prompt entirely
    return { behavior: "allow", decisionReason: { type: "hook" } };
}
```

### 2.2 Tool Progress Tracking

**Progress Event Structure:**
```javascript
{
    toolUseID: string,
    parentToolUseID: string,  // For nested tools
    data: {
        type: "progress" | "mcp_progress",
        status: "started" | "running" | "completed" | "failed",
        message?: string,
        elapsedTimeMs?: number
    }
}
```

**UI Display:**
- Progress spinner with tool name
- Elapsed time display
- Status updates (for long-running operations)
- MCP-specific: server name and tool name

### 2.3 Tool Result Rendering

**Result Types:**

| Result Type | UI Rendering |
|-------------|--------------|
| Text content | Formatted with syntax highlighting |
| Image content | Inline image display |
| File diff | Diff viewer component |
| Error | Red error box with message |
| Structured output | JSON tree view |

---

## 3. MCP Module UI

### 3.1 Elicitation Dialog

**Form Mode:**
```
┌─────────────────────────────────────────────────────────────┐
│  📝 {serverName} requires information                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  {message}                                                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ {fieldName}: [________________]                       │   │
│  │ {fieldName}: [________________]                       │   │
│  │ {fieldName}: [________________]                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ Submit          │  │ Cancel          │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**URL Mode:**
```
┌─────────────────────────────────────────────────────────────┐
│  🔗 Authentication Required                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  {serverName} needs you to authenticate.                     │
│                                                              │
│  Open this URL in your browser:                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ {authUrl}                                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [Open URL] [Copy URL] [Cancel]                              │
│                                                              │
│  Waiting for authentication...                               │
│  ⏳                                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Elicitation Schema Mapping:**
```javascript
// JSON Schema to form fields
function schemaToFormFields(requestedSchema) {
    return Object.entries(requestedSchema.properties).map(([name, schema]) => ({
        name,
        type: schema.type,
        label: schema.title || name,
        description: schema.description,
        required: requestedSchema.required?.includes(name),
        default: schema.default,
        enum: schema.enum  // Dropdown if present
    }));
}
```

### 3.2 MCP Server Connection Status

**Status Indicators:**
- 🟢 Connected - Server is active
- 🟡 Connecting - Establishing connection
- 🔴 Failed - Connection error
- ⚪ Disabled - Server disabled in config

---

## 4. Plan Mode UI

### 4.1 Plan Approval Dialog

```
┌─────────────────────────────────────────────────────────────┐
│  📋 Plan Review                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Ready to implement the plan?                                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ## Plan: {task description}                           │   │
│  │                                                        │   │
│  │ ### Context                                            │   │
│  │ {context}                                              │   │
│  │                                                        │   │
│  │ ### Implementation Steps                               │   │
│  │ 1. {step1}                                             │   │
│  │ 2. {step2}                                             │   │
│  │ ...                                                    │   │
│  │                                                        │   │
│  │ ### Files to Modify                                    │   │
│  │ - {file1}                                              │   │
│  │ - {file2}                                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ ✅ Yes, let's    │  │ ↩️ Let me       │                   │
│  │    implement    │  │    refine       │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                       ┌─────────────────┐                   │
│                       │ ❌ Cancel       │                   │
│                       └─────────────────┘                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Mode Indicator (Status Line)

```
┌─────────────────────────────────────────────────────────────┐
│  ⏸ Plan Mode on (shift+tab)                                  │
│  📝 Plan file: ~/.claude_api/plans/example-plan.md           │
│  ⚠️ Read-only mode - only plan file can be edited            │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Swarm Plan Approval (Team Lead View)

```
┌─────────────────────────────────────────────────────────────┐
│  👥 Team Plan Approval Request                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  From: {agentName}                                           │
│  Team: {teamName}                                            │
│  Request ID: {requestId}                                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ {planContent}                                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ ✅ Approve       │  │ ❌ Reject       │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
│  Feedback (optional):                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [________________________________]                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Task System UI

### 5.1 Task List Visualization

```
┌─────────────────────────────────────────────────────────────┐
│  📋 Tasks                               [+ New Task]         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ⏳ In Progress                                              │
│  ├─ #1: Implement login UI (owner: agent-1)                 │
│  │   └─ Blocked by: none                                     │
│  │                                                           │
│  ⏸ Pending                                                   │
│  ├─ #2: Add authentication tests                             │
│  │   └─ Blocked by: #1                                       │
│  │                                                           │
│  ✅ Completed                                                 │
│  ├─ #3: Set up project structure                             │
│  │   └─ Completed by: agent-1 at 10:30                       │
│  │                                                           │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Task Status Indicators

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| `pending` | ⏸ | Gray | Not started |
| `in_progress` | ⏳ | Blue | Currently being worked on |
| `completed` | ✅ | Green | Finished |

### 5.3 Task Claim UI

```
┌─────────────────────────────────────────────────────────────┐
│  🔒 Claim Task #{taskId}                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Subject: {task.subject}                                     │
│  Owner: {task.owner || "Unclaimed"}                          │
│  Status: {task.status}                                       │
│                                                              │
│  Dependencies:                                               │
│  ├─ ✅ #3 (completed)                                        │
│  └─ ⏸ #5 (pending - blocking)                                │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ ✅ Claim Task   │  │ ❌ Cancel       │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
│  ⚠️ This task has incomplete dependencies.                   │
│     Cannot claim until #5 is completed.                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Cross-Module UI Interactions

### 6.1 Tool Execution → Permission Dialog → System Reminder

```
Tool execution requested
        │
        ▼
┌───────────────────┐
│ Check pre-hooks   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐     ┌───────────────────┐
│ Hook provided     │──No─▶│ Show Permission   │
│ permission?       │     │ Dialog            │
└─────────┬─────────┘     └─────────┬─────────┘
          │                         │
         Yes                        │
          │                         │
          ▼                         ▼
┌───────────────────┐     ┌───────────────────┐
│ Skip user prompt  │     │ User decision     │
│ Use hook result   │     │ (allow/deny)      │
└─────────┬─────────┘     └─────────┬─────────┘
          │                         │
          └───────────┬─────────────┘
                      │
                      ▼
          ┌───────────────────┐
          │ Generate          │
          │ permission_decision│
          │ attachment        │
          └─────────┬─────────┘
                    │
                    ▼
          ┌───────────────────┐
          │ Inject as         │
          │ System Reminder   │
          └───────────────────┘
```

### 6.2 Plan Mode → Tools → Task System Flow

```
┌─────────────┐     Tool Filtering      ┌─────────────┐
│ Plan Mode   │────────────────────────▶│ Read-only   │
│ Entered     │                         │ Tools Only  │
└──────┬──────┘                         └─────────────┘
       │
       │ Write to plan file
       │
       ▼
┌─────────────┐     ExitPlanMode        ┌─────────────┐
│ Plan        │────────────────────────▶│ User        │
│ Completed   │                         │ Approval    │
└──────┬──────┘                         └──────┬──────┘
       │                                       │
       │                                       │ Approved
       │                                       │
       │                                       ▼
       │                              ┌─────────────┐
       └─────────────────────────────▶│ Create Tasks│
                                      │ from Plan   │
                                      └─────────────┘
```

---

## 7. React Component Hierarchy

```
<REPL>
  ├── <StatusBar>
  │     ├── <ModeIndicator />  // Plan mode status
  │     ├── <TaskSummary />    // Task counts
  │     └── <McpStatus />      // Server connection status
  │
  ├── <MessageList>
  │     ├── <ToolUseMessage>
  │     │     ├── <ToolProgressIndicator />
  │     │     └── <ToolResult />
  │     └── <AssistantMessage />
  │
  ├── <ModalStack>
  │     ├── <PermissionDialog />      // Tools
  │     ├── <ElicitationDialog />     // MCP
  │     ├── <PlanApprovalDialog />    // Plan Mode
  │     └── <TaskClaimDialog />       // Task System
  │
  └── <ExpandedView>
        └── <TaskListView />          // Task list visualization
```

---

## 8. State Management

### Tool Permission State

```typescript
interface ToolPermissionContext {
    mode: "default" | "plan" | "auto" | "acceptEdits" | "delegate" | "bypassPermissions" | "dontAsk";
    prePlanMode?: string;
    allowedTools: Set<string>;
    deniedTools: Set<string>;
    toolDecisions: Map<string, { decision: string; source: string }>;
}
```

### Task State

```typescript
interface TaskState {
    tasks: Map<string, Task>;
    expandedView: "tasks" | null;
    selectedTaskId: string | null;
}
```

### MCP State

```typescript
interface McpState {
    clients: McpClient[];
    elicitation: {
        queue: ElicitationRequest[];
    };
    resources: McpResource[];
}
```

---

## Cross-Reference

- [tool_ui_interaction_complete.md](../05_tools/tool_ui_interaction_complete.md) - Tool UI details
- [tool_permission_ui_complete.md](../05_tools/tool_permission_ui_complete.md) - Permission dialogs
- [elicitation_ui_complete.md](../06_mcp/elicitation_ui_complete.md) - Elicitation UI
- [plan_mode_ui_complete_v2.md](../12_plan_mode/plan_mode_ui_complete_v2.md) - Plan mode UI
- [task_ui_complete.md](../13_task_system/task_ui_complete.md) - Task UI