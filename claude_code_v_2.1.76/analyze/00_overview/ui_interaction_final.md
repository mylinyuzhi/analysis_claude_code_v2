# UI Interaction Deep Dive (Claude Code 2.1.76)

> **Comprehensive UI interaction analysis** for Tools, MCP, Plan Mode, and Task System.
> **Final Version** - React components, state management, and modal handling.

---

## Overview

This document provides a comprehensive analysis of the UI interaction patterns used across the Tools, MCP, Plan Mode, and Task System modules.

---

## UI Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           REACT UI ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          REPL Component                              │   │
│  │  ├─ Message List                                                    │   │
│  │  ├─ Input Field                                                     │   │
│  │  └─ Expanded Views                                                  │   │
│  │      ├─ tools → Tool permission dialogs                             │   │
│  │      ├─ mcp → MCP server status, Elicitation dialogs                │   │
│  │      ├─ plan → Plan approval, Interview phase UI                    │   │
│  │      └─ tasks → Task list visualization                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        Modal Priority Queue                          │   │
│  │  1. sandbox-permission (highest)                                    │   │
│  │  2. tool-permission                                                 │   │
│  │  3. worker-sandbox-permission                                       │   │
│  │  4. elicitation (lowest)                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         State Slices                                 │   │
│  │  ├─ toolPermissionContext                                           │   │
│  │  ├─ mcpState                                                        │   │
│  │  ├─ elicitation                                                     │   │
│  │  ├─ planModeState                                                   │   │
│  │  └─ taskState                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Tools UI Components

### Tool Permission Dialog

```javascript
// Location: chunks.155.mjs (permission dialog component)

// ============================================
// ToolPermissionDialog - Permission request UI
// ============================================

function ToolPermissionDialog({ toolName, input, onDecision }) {
    return React.createElement(Box, { flexDirection: "column" },
        React.createElement(Text, { bold: true }, `Tool: ${toolName}`),
        React.createElement(Text, { dimColor: true }, getInputSummary(input)),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Select, {
                options: [
                    { label: "Yes, always", value: "always" },
                    { label: "Yes, this time", value: "once" },
                    { label: "No, this time", value: "deny-once" },
                    { label: "No, always", value: "deny-always" }
                ],
                onSelect: onDecision
            })
        )
    );
}
```

### Tool Progress Display

```javascript
// ============================================
// ToolProgressDisplay - Progress streaming UI
// ============================================

function ToolProgressDisplay({ toolUseId, progressData }) {
    const { type, status, message, percentage, elapsedTimeMs } = progressData;

    return React.createElement(Box, { flexDirection: "row" },
        React.createElement(Spinner, { type: "dots" }),
        React.createElement(Text, null, ` ${message}`),
        percentage && React.createElement(Text, { dimColor: true },
            ` (${percentage}%)`
        ),
        elapsedTimeMs && React.createElement(Text, { dimColor: true },
            ` [${formatDuration(elapsedTimeMs)}]`
        )
    );
}
```

### Tool Result Rendering

```javascript
// ============================================
// renderToolResultMessage - Result display
// ============================================

function renderToolResultMessage(toolResult, toolUseId) {
    if (toolResult.is_error) {
        return React.createElement(Box, { flexDirection: "column" },
            React.createElement(Text, { color: "red" }, "❌ Error"),
            React.createElement(Text, null, toolResult.content)
        );
    }

    // Success result
    return React.createElement(Box, { flexDirection: "column" },
        React.createElement(Text, { color: "green" }, "✓ Success"),
        React.createElement(Text, { dimColor: true },
            truncateContent(toolResult.content, 200)
        )
    );
}
```

---

## 2. MCP UI Components

### Elicitation Dialog (Form Mode)

```javascript
// Location: chunks.190.mjs

// ============================================
// ElicitationDialog - MCP server input request
// ============================================

function ElicitationDialog({ elicitation, onRespond }) {
    const { serverName, params } = elicitation;
    const mode = detectElicitationMode(params);

    if (mode === "url") {
        return React.createElement(UrlElicitationDialog, {
            url: params.url,
            elicitationId: params.elicitationId,
            onRespond
        });
    }

    // Form mode
    return React.createElement(FormElicitationDialog, {
        message: params.message,
        requestedSchema: params.requestedSchema,
        onRespond
    });
}

// ============================================
// FormElicitationDialog - Structured form input
// ============================================

function FormElicitationDialog({ message, requestedSchema, onRespond }) {
    const [formData, setFormData] = useState({});

    return React.createElement(Box, { flexDirection: "column" },
        React.createElement(Text, { bold: true }, "MCP Server Request"),
        React.createElement(Text, null, message),
        React.createElement(Box, { marginTop: 1 },
            // Render form fields based on JSON schema
            renderSchemaForm(requestedSchema, formData, setFormData)
        ),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Button, {
                onPress: () => onRespond({ action: "accept", content: formData })
            }, "Submit"),
            React.createElement(Button, {
                onPress: () => onRespond({ action: "cancel" })
            }, "Cancel")
        )
    );
}
```

### MCP Server Status Display

```javascript
// ============================================
// McpServerStatus - Connection status indicator
// ============================================

function McpServerStatus({ mcpClients }) {
    return React.createElement(Box, { flexDirection: "column" },
        React.createElement(Text, { bold: true }, "MCP Servers"),
        mcpClients.map(client =>
            React.createElement(Box, { key: client.name, flexDirection: "row" },
                React.createElement(Text, null, client.name),
                React.createElement(StatusIndicator, { status: client.type }),
                client.tools.length > 0 &&
                    React.createElement(Text, { dimColor: true },
                        ` (${client.tools.length} tools)`
                    )
            )
        )
    );
}

function StatusIndicator({ status }) {
    const colors = {
        "connected": "green",
        "needs-auth": "yellow",
        "failed": "red",
        "disabled": "gray"
    };
    return React.createElement(Text, { color: colors[status] },
        status === "connected" ? "●" : "○"
    );
}
```

---

## 3. Plan Mode UI Components

### Plan Approval Dialog

```javascript
// ============================================
// PlanApprovalDialog - User approval for plan
// ============================================

function PlanApprovalDialog({ planContent, onDecision }) {
    return React.createElement(Box, { flexDirection: "column" },
        React.createElement(Text, { bold: true }, "Plan Approval"),
        React.createElement(Box, {
            borderStyle: "round",
            padding: 1
        },
            React.createElement(Text, null, truncateContent(planContent, 500))
        ),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Select, {
                options: [
                    { label: "Yes, let's implement", value: "approve" },
                    { label: "Let me refine the plan", value: "reject" },
                    { label: "Cancel", value: "cancel" }
                ],
                onSelect: onDecision
            })
        )
    );
}
```

### Interview Phase UI

```javascript
// ============================================
// InterviewPhaseUI - Multi-round clarification
// ============================================

function InterviewPhaseUI({ questions, onAnswer }) {
    return React.createElement(Box, { flexDirection: "column" },
        React.createElement(Text, { bold: true }, "Planning Interview"),
        React.createElement(Text, { dimColor: true },
            "I need to clarify a few things before planning:"
        ),
        questions.map((question, index) =>
            React.createElement(Box, { key: index, marginTop: 1 },
                React.createElement(Text, null, `${index + 1}. ${question}`),
                React.createElement(Input, {
                    placeholder: "Your answer...",
                    onSubmit: (answer) => onAnswer(index, answer)
                })
            )
        )
    );
}
```

### Plan Mode Status Indicator

```javascript
// ============================================
// PlanModeStatus - Mode indicator in status line
// ============================================

function PlanModeStatus({ mode, prePlanMode }) {
    if (mode !== "plan") return null;

    return React.createElement(Box, null,
        React.createElement(Text, { color: "yellow" }, "⏸ Plan Mode on"),
        React.createElement(Text, { dimColor: true }, " (shift+tab)")
    );
}
```

---

## 4. Task System UI Components

### Task List Visualization

```javascript
// ============================================
// TaskListUI - Task list display
// ============================================

function TaskListUI({ tasks, expandedView }) {
    if (expandedView !== "tasks") return null;

    return React.createElement(Box, { flexDirection: "column" },
        React.createElement(Text, { bold: true }, "Tasks"),
        tasks.map(task =>
            React.createElement(TaskItem, {
                key: task.id,
                task
            })
        )
    );
}

function TaskItem({ task }) {
    const statusColors = {
        "pending": "gray",
        "in_progress": "yellow",
        "completed": "green"
    };

    const statusIcons = {
        "pending": "○",
        "in_progress": "◐",
        "completed": "●"
    };

    return React.createElement(Box, { flexDirection: "row" },
        React.createElement(Text, {
            color: statusColors[task.status]
        }, statusIcons[task.status]),
        React.createElement(Text, null, ` ${task.id}. ${task.subject}`),
        task.owner && React.createElement(Text, { dimColor: true },
            ` [${task.owner}]`
        ),
        task.blockedBy.length > 0 && React.createElement(Text, { color: "red" },
            ` ⚠ blocked`
        )
    );
}
```

### Task Dependency Graph

```javascript
// ============================================
// TaskDependencyGraph - Visual dependency display
// ============================================

function TaskDependencyGraph({ tasks }) {
    // Build dependency tree
    const tree = buildDependencyTree(tasks);

    return React.createElement(Box, { flexDirection: "column" },
        React.createElement(Text, { bold: true }, "Dependency Graph"),
        renderTree(tree, 0)
    );
}

function renderTree(node, depth) {
    const indent = "  ".repeat(depth);
    return React.createElement(Box, { flexDirection: "column" },
        React.createElement(Text, null,
            `${indent}${node.task.id}: ${node.task.subject}`
        ),
        node.children.map(child =>
            renderTree(child, depth + 1)
        )
    );
}
```

---

## 5. Modal Priority System

### Priority Queue Handling

```javascript
// ============================================
// Modal Priority Queue Management
// ============================================

function getActiveModal(state) {
    // Priority 1: Sandbox permission (highest)
    if (state.sandboxPermissionQueue?.length > 0) {
        return {
            type: "sandbox-permission",
            data: state.sandboxPermissionQueue[0]
        };
    }

    // Priority 2: Tool permission
    if (state.pendingToolRequest?.length > 0) {
        return {
            type: "tool-permission",
            data: state.pendingToolRequest[0]
        };
    }

    // Priority 3: Worker sandbox permission
    if (state.workerSandboxQueue?.length > 0) {
        return {
            type: "worker-sandbox-permission",
            data: state.workerSandboxQueue[0]
        };
    }

    // Priority 4: Elicitation (lowest)
    if (state.elicitation?.queue?.length > 0) {
        // Filter out completed elicitations
        const pending = state.elicitation.queue.filter(e => !e.completed);
        if (pending.length > 0) {
            return {
                type: "elicitation",
                data: pending[0]
            };
        }
    }

    return null;
}
```

---

## 6. State Management

### State Slice Structure

```typescript
// Global state structure
interface AppState {
    // Tools state
    toolPermissionContext: {
        mode: "default" | "plan" | "acceptEdits" | "delegate" | "bypassPermissions" | "dontAsk";
        prePlanMode?: string;
        alwaysAllowRules: Record<string, unknown>;
        alwaysDenyRules: Record<string, unknown>;
    };

    // MCP state
    mcpState: {
        servers: McpServer[];
        connectedCount: number;
    };

    // Elicitation state
    elicitation: {
        queue: ElicitationRequest[];
    };

    // Plan mode state
    planModeState: {
        hasExitedPlanMode: boolean;
        needsPlanModeExitAttachment: boolean;
        planFilePath?: string;
    };

    // Task state
    taskState: {
        tasks: Task[];
        expandedView: "tasks" | null;
    };

    // UI state
    pendingToolRequest: ToolRequest[];
    sandboxPermissionQueue: SandboxRequest[];
    workerSandboxQueue: WorkerRequest[];
}
```

### State Update Patterns

```javascript
// Pattern: Functional state update
setAppState((prevState) => ({
    ...prevState,
    elicitation: {
        ...prevState.elicitation,
        queue: [...prevState.elicitation.queue, newRequest]
    }
}));

// Pattern: Conditional state update
setAppState((prevState) => {
    if (prevState.toolPermissionContext.mode !== "plan") {
        return prevState;  // No change
    }

    return {
        ...prevState,
        toolPermissionContext: {
            ...prevState.toolPermissionContext,
            mode: prevState.toolPermissionContext.prePlanMode ?? "default",
            prePlanMode: undefined
        }
    };
});
```

---

## 7. Event Handling

### Tool Permission Decision

```javascript
async function handleToolPermissionDecision(decision, toolName, input) {
    switch (decision) {
        case "always":
            await addToAllowedTools(toolName);
            return { behavior: "allow" };
        case "once":
            return { behavior: "allow" };
        case "deny-once":
            return { behavior: "deny" };
        case "deny-always":
            await addToDeniedTools(toolName);
            return { behavior: "deny" };
    }
}
```

### Elicitation Response

```javascript
function handleElicitationResponse(elicitation, response) {
    // Remove from queue
    setAppState((state) => ({
        ...state,
        elicitation: {
            queue: state.elicitation.queue.filter(
                e => e.requestId !== elicitation.requestId
            )
        }
    }));

    // Call respond callback
    elicitation.respond(response);
}
```

---

## 8. Component Integration Matrix

| Module | UI Component | State Slice | Events |
|--------|-------------|-------------|--------|
| Tools | ToolPermissionDialog | toolPermissionContext | onDecision |
| Tools | ToolProgressDisplay | - | progressCallback |
| Tools | ToolResultDisplay | - | - |
| MCP | McpServerStatus | mcpState | - |
| MCP | ElicitationDialog | elicitation | onRespond |
| MCP | FormElicitationDialog | elicitation | onRespond |
| Plan Mode | PlanApprovalDialog | planModeState | onDecision |
| Plan Mode | InterviewPhaseUI | - | onAnswer |
| Plan Mode | PlanModeStatus | toolPermissionContext.mode | - |
| Task System | TaskListUI | taskState | - |
| Task System | TaskItem | - | - |
| Task System | TaskDependencyGraph | taskState | - |

---

## 9. Rendering Patterns

### Conditional Rendering

```javascript
// Expanded view rendering
function ExpandedView({ expandedView, state }) {
    switch (expandedView) {
        case "tasks":
            return React.createElement(TaskListUI, { tasks: state.taskState.tasks });
        case "mcp":
            return React.createElement(McpServerStatus, { mcpClients: state.mcpState.servers });
        default:
            return null;
    }
}
```

### Modal Rendering

```javascript
function ModalRenderer({ state }) {
    const modal = getActiveModal(state);

    if (!modal) return null;

    switch (modal.type) {
        case "sandbox-permission":
            return React.createElement(SandboxPermissionDialog, modal.data);
        case "tool-permission":
            return React.createElement(ToolPermissionDialog, modal.data);
        case "elicitation":
            return React.createElement(ElicitationDialog, modal.data);
        default:
            return null;
    }
}
```

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Complete UI interaction analysis |
| 2.1.72 | Elicitation UI for MCP |
| 2.1.32 | Task list visualization |
| 2.1.18 | Plan mode status indicator |