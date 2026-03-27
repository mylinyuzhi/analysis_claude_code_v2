# UI Interaction Documentation: Tools, MCP, Plan Mode, Task System

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27

---

## Overview

This document provides comprehensive documentation of the UI components and interactions for the four key modules. Each module has specific UI patterns for rendering, state management, and user interaction.

---

## 1. Tools Module UI

### Permission Dialog System

#### Component Hierarchy

```
ToolPermissionDialog
├── PermissionPrompt
│   ├── ToolInfo (name, description, input preview)
│   ├── PermissionOptions (Yes always, Yes once, No once, No always)
│   └── AdvancedOptions (view command details)
├── InputPreview
│   ├── DiffViewer (for Edit tool)
│   ├── FilePreview (for Write tool)
│   └── CommandPreview (for Bash tool)
└── RememberDecisionCheckbox
```

#### State Management

```javascript
// Permission state in toolPermissionContext
{
    mode: "default" | "plan" | "acceptEdits" | "bypassPermissions",
    alwaysAllowRules: { toolName: ruleContent },
    alwaysDenyRules: { toolName: ruleContent },
    prePlanMode: "default",  // Saved mode before entering plan
    hasExitedPlanMode: false,
    needsPlanModeExitAttachment: false
}
```

#### Permission Decision Flow

```
canUseTool(tool, input, context)
    │
    ├─▶ Check hookPermissionResult from pre-tool hook
    │       ├─▶ behavior: "allow" → Skip prompt
    │       └─▶ behavior: "deny" → Return denied
    │
    ├─▶ Check alwaysAllowRules
    │       └─▶ Match → Auto-allow
    │
    ├─▶ Check isReadOnly() && !isDestructive()
    │       └─▶ Auto-allow in safe contexts
    │
    └─▶ Prompt user
            ├─▶ "Yes, always" → Add to alwaysAllowRules
            ├─▶ "Yes, this time" → Allow once
            ├─▶ "No, this time" → Deny once
            └─▶ "No, always" → Add to alwaysDenyRules
```

### Tool Result Visualization

#### Component Hierarchy

```
ToolResultMessage
├── ToolResultHeader
│   ├── ToolName (with icon)
│   ├── ExecutionTime
│   └── StatusIndicator (success/error/cancelled)
├── ToolResultContent
│   ├── TextResult (for text output)
│   ├── FileResult (for file operations)
│   │   ├── FilePath
│   │   ├── LineCount
│   │   └── PreviewToggle
│   ├── DiffResult (for Edit tool)
│   │   ├── DiffViewer
│   │   └── LineNumbers
│   └── ErrorResult (for errors)
│       ├── ErrorMessage
│       ├── ErrorDetails
│       └── RetryButton (if applicable)
└── ToolResultActions
    ├── CopyButton
    ├── OpenInEditorButton
    └── ExpandCollapseToggle
```

### Progress Indicator

```
ToolProgressIndicator
├── SpinnerAnimation
├── ProgressText
└── ProgressBar (if percentage available)
```

---

## 2. MCP Module UI

### Elicitation Dialog System

#### Component Hierarchy

```
ElicitationDialog
├── ElicitationHeader
│   ├── ServerName
│   ├── Message (from MCP server)
│   └── CloseButton
├── FormElicitationDialog (mode: "form")
│   ├── FormField (for each schema property)
│   │   ├── Label
│   │   ├── Input (type based on schema)
│   │   └── ValidationMessage
│   └── FormActions
│       ├── AcceptButton
│       └── DeclineButton
└── UrlElicitationDialog (mode: "url")
    ├── UrlDisplay
    ├── OpenUrlButton
    └── StatusIndicator
```

#### Elicitation Form Rendering

```javascript
// Form schema to React component mapping
function renderFormField(property, name, schema) {
    switch (schema.type) {
        case "string":
            if (schema.enum) {
                return <SelectField options={schema.enum} />;
            }
            if (schema.format === "uri") {
                return <UrlField />;
            }
            return <TextField multiline={schema.maxLength > 100} />;

        case "number":
        case "integer":
            return <NumberField min={schema.minimum} max={schema.maximum} />;

        case "boolean":
            return <CheckboxField />;

        case "array":
            return <ArrayField itemSchema={schema.items} />;

        case "object":
            return <ObjectField properties={schema.properties} />;

        default:
            return <TextField />;
    }
}
```

#### Elicitation Queue Management

```javascript
// Elicitation queue state
{
    queue: [
        {
            id: "uuid",
            serverName: "server-name",
            message: "Please provide credentials",
            mode: "form" | "url",
            requestedSchema: { ... },  // For form mode
            uris: ["https://..."],      // For URL mode
            status: "pending" | "in_progress" | "completed"
        }
    ],
    currentElicitation: null  // Currently displayed
}
```

#### MCP Server Status Display

```
McpServerStatus
├── ServerConnectionIndicator
│   ├── ConnectedIcon (green)
│   ├── DisconnectedIcon (red)
│   └── ConnectingSpinner (yellow)
├── ServerName
├── ToolCount
└── ReconnectButton (if disconnected)
```

### Modal Priority System

```javascript
// Modal priority (highest to lowest)
const MODAL_PRIORITY = [
    "sandbox-permission",     // 1 - Security-sensitive
    "tool-permission",        // 2 - Tool approval
    "worker-sandbox-permission",  // 3 - Teammate sandbox
    "elicitation"             // 4 - MCP server input
];

function getNextModal(state) {
    for (const modalType of MODAL_PRIORITY) {
        if (state[modalType].queue.length > 0) {
            return state[modalType].queue[0];
        }
    }
    return null;
}
```

---

## 3. Plan Mode UI

### Plan Mode Status Bar

```
PlanModeStatusBar
├── ModeIndicator
│   ├── PlanModeIcon
│   └── StatusText: "⏸ Plan Mode on (shift+tab)"
├── PlanFileInfo
│   ├── PlanFilePath
│   └── LastSavedTime
└── ExitPlanModeButton
```

### Plan Approval Dialog

```
PlanApprovalDialog
├── PlanPreview
│   ├── PlanHeader (task description)
│   ├── ContextSection
│   ├── ImplementationPlan
│   ├── FilesToModify
│   └── VerificationSection
├── ApprovalOptions
│   ├── "Ready to code"
│   ├── "Let me refine the plan"
│   └── "Cancel"
└── RememberChoiceCheckbox
```

### Swarm Approval Notification

```
SwarmApprovalNotification
├── TeammateInfo
│   ├── TeammateName
│   └── RequestTime
├── PlanSummary
│   ├── TaskDescription
│   └── FilesAffected
├── ApprovalButtons
│   ├── ApproveButton
│   └── RejectButton (with feedback input)
└── FeedbackInput (if rejected)
```

### Mode Cycling UI

```
// Shift+Tab cycles through modes
ModeCycleIndicator
├── CurrentMode
│   └── ModeName
└── ModeList
    ├── Default
    ├── Plan
    ├── Accept Edits
    └── Bypass Permissions (if available)
```

---

## 4. Task System UI

### Task List Visualization

```
TaskListPanel
├── TaskListHeader
│   ├── Title: "Tasks"
│   ├── AddTaskButton
│   └── FilterDropdown (all/pending/in_progress/completed)
├── TaskList
│   └── TaskItem (for each task)
│       ├── TaskId
│       ├── TaskSubject
│       ├── StatusIndicator
│       │   ├── PendingIcon (yellow)
│       │   ├── InProgressIcon (blue spinner)
│       │   └── CompletedIcon (green check)
│       ├── OwnerBadge (if assigned)
│       ├── DependencyIndicator
│       │   ├── BlockedWarning (if blocked)
│       │   └── BlockingCount (how many tasks this blocks)
│       └── TaskActions
│           ├── ClaimButton
│           ├── UpdateButton
│           └── DeleteButton
└── TaskStats
    ├── TotalCount
    ├── CompletedCount
    └── ProgressPercentage
```

### Task Status Indicators

```javascript
// Status color coding
const STATUS_COLORS = {
    pending: "yellow",
    in_progress: "blue",
    completed: "green"
};

// Status icons
const STATUS_ICONS = {
    pending: "○",          // Empty circle
    in_progress: "◐",      // Half-filled circle (animated)
    completed: "●"         // Filled circle
};
```

### Dependency Graph Display

```
DependencyGraph
├── TaskNode (for each task)
│   ├── TaskId
│   ├── TaskSubject
│   └── StatusColor
└── DependencyEdge (arrow from blocker to blocked)
    ├── EdgeLine
    └── ArrowHead
```

### Owner Assignment UI

```
OwnerAssignment
├── CurrentOwner (if assigned)
│   ├── OwnerName
│   └── UnassignButton
└── AssignDropdown (if unassigned)
    ├── AvailableAgents
    └── AssignButton
```

### Active Form Spinner

```javascript
// Task activeForm shows present continuous status
// Example: { activeForm: "Running tests..." }
// Renders as:
<ActiveFormSpinner>
    <Spinner />
    <Text>{task.activeForm}</Text>
</ActiveFormSpinner>
```

---

## 5. Cross-Module UI Integration

### Global State Structure

```javascript
// App state slice relevant to all four modules
{
    toolPermissionContext: {
        mode: "default" | "plan" | ...,
        alwaysAllowRules: {},
        alwaysDenyRules: {},
        prePlanMode: undefined | "default",
        hasExitedPlanMode: boolean,
        needsPlanModeExitAttachment: boolean
    },
    tasks: {
        expanded: boolean,
        filter: "all" | "pending" | "in_progress" | "completed",
        selectedTaskId: null | string
    },
    elicitation: {
        queue: [],
        current: null
    },
    mcpServers: {
        servers: [
            { name, status, tools, resources }
        ]
    },
    pendingToolRequest: {
        tool: null,
        input: null,
        toolUseId: null,
        status: "pending" | "approved" | "denied"
    }
}
```

### UI Event Flow

```
User Action
    │
    ▼
setAppState(update)
    │
    ├─▶ Updates global state
    │
    └─▶ Triggers re-render
            │
            ├─▶ Mode changes → Update status bar
            ├─▶ Task changes → Update task list
            ├─▶ Elicitation added → Show dialog
            └─▶ Permission needed → Show permission dialog
```

---

## 6. React Component Patterns

### State Management Hook

```javascript
// Custom hook for accessing tool state
function useToolState() {
    const { toolPermissionContext, pendingToolRequest } = useAppState();

    return {
        mode: toolPermissionContext.mode,
        isPlanMode: toolPermissionContext.mode === "plan",
        pendingRequest: pendingToolRequest,
        hasPermission: (toolName) => checkPermission(toolPermissionContext, toolName)
    };
}
```

### Elicitation Hook

```javascript
// Custom hook for elicitation state
function useElicitation() {
    const { elicitation } = useAppState();

    return {
        currentElicitation: elicitation.current,
        queueLength: elicitation.queue.length,
        respond: async (action, content) => {
            await respondToElicitation(elicitation.current.id, action, content);
        }
    };
}
```

### Task List Hook

```javascript
// Custom hook for task state
function useTaskList(taskListId) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        loadAllTasks(taskListId).then(setTasks);
    }, [taskListId]);

    const createTask = async (taskData) => {
        const id = await createTaskAction(taskListId, taskData);
        setTasks([...tasks, { id, ...taskData }]);
        return id;
    };

    const updateTask = async (taskId, updates) => {
        await updateTaskAction(taskListId, taskId, updates);
        setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t));
    };

    return { tasks, createTask, updateTask };
}
```

---

## 7. Accessibility Considerations

### Keyboard Navigation

- **Tab**: Move between interactive elements
- **Enter/Space**: Activate buttons
- **Escape**: Close dialogs
- **Shift+Tab**: Cycle modes (plan mode feature)

### Screen Reader Support

```javascript
// ARIA labels for key components
<ToolPermissionDialog
    role="dialog"
    aria-labelledby="permission-dialog-title"
    aria-describedby="permission-dialog-description"
>
    <h2 id="permission-dialog-title">Tool Permission Request</h2>
    <p id="permission-dialog-description">{toolName} requires your approval</p>
</ToolPermissionDialog>
```

### Focus Management

```javascript
// Focus trap in dialogs
function useFocusTrap(isOpen) {
    const containerRef = useRef();

    useEffect(() => {
        if (isOpen && containerRef.current) {
            const focusableElements = containerRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            focusableElements[0]?.focus();
        }
    }, [isOpen]);

    return containerRef;
}
```

---

## Summary

### Key UI Components by Module

| Module | Primary Components | State Slice |
|--------|-------------------|-------------|
| 05_tools | ToolPermissionDialog, ToolResultMessage, ProgressIndicator | pendingToolRequest, toolPermissionContext |
| 06_mcp | ElicitationDialog, McpServerStatus | elicitation, mcpServers |
| 12_plan_mode | PlanModeStatusBar, PlanApprovalDialog | toolPermissionContext.mode |
| 13_task_system | TaskListPanel, DependencyGraph | tasks |

### Rendering Priority

1. Security-related modals (sandbox permission)
2. Tool permission dialogs
3. Elicitation dialogs
4. Task notifications
5. Status bar updates