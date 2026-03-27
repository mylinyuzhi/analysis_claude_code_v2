# UI Interaction Analysis - Tools, MCP, Plan Mode, Task System

> **Complete UI interaction analysis** for all four modules with React component structure, modal priority, and user interaction patterns.

---

## UI Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLI/TUI ARCHITECTURE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         REPL Component                               │    │
│  │  (Main React root - chunks.185.mjs)                                  │    │
│  │                                                                       │    │
│  │  State slices:                                                        │    │
│  │  ├─ messages: Message[]          // Chat history                     │    │
│  │  ├─ toolPermissionContext: {...} // Permission state                 │    │
│  │  ├─ expandedView: string | null  // "tasks" | null                   │    │
│  │  ├─ pendingToolRequest: [...]    // Permission dialogs               │    │
│  │  ├─ elicitation: {...}           // MCP elicitation                  │    │
│  │  └─ modalQueue: Modal[]          // Active modals                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│  Modal Priority (highest → lowest):                                          │
│  1. sandbox-permission       // Sandboxed command approval                 │
│  2. tool-permission          // Tool permission dialog                     │
│  3. worker-sandbox-permission // Background worker sandbox                 │
│  4. elicitation              // MCP elicitation (lowest)                   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Tools UI (05)

### Tool Permission Dialog

**Trigger**: When `canUseTool` returns `behavior: "ask"`

**Component**: `ToolPermissionDialog`

```jsx
// ============================================
// Tool Permission Dialog Component
// Location: chunks.155.mjs (renderToolUseMessage)
// ============================================

function ToolPermissionDialog({ tool, input, onDecision }) {
    return (
        <Box flexDirection="column">
            <Box>
                <Text color="yellow">⚠ Permission Required</Text>
            </Box>
            <Box>
                <Text>Tool: </Text>
                <Text bold>{tool.name}</Text>
            </Box>
            <Box marginTop={1}>
                <Text dimColor>{getPermissionPrompt(tool, input)}</Text>
            </Box>
            <Box marginTop={1}>
                <Text>[Y] Yes, always</Text>
                <Text>  [y] Yes, this time</Text>
                <Text>  [n] No, this time</Text>
                <Text>  [N] No, always</Text>
            </Box>
        </Box>
    );
}
```

### Tool Progress Indicator

**Trigger**: During tool execution via progress callback

**Component**: `ToolProgressMessage`

```jsx
// ============================================
// Tool Progress Message
// ============================================

function ToolProgressMessage({ toolName, toolUseId, progressData }) {
    const spinner = useSpinner();  // Animated spinner

    if (progressData.type === "mcp_progress") {
        return (
            <Box>
                <Text dimColor>{spinner}</Text>
                <Text> {progressData.serverName}: {progressData.toolName}</Text>
                {progressData.status === "completed" && (
                    <Text dimColor> ({progressData.elapsedTimeMs}ms)</Text>
                )}
            </Box>
        );
    }

    return (
        <Box>
            <Text dimColor>{spinner}</Text>
            <Text> {toolName}...</Text>
        </Box>
    );
}
```

### Tool Result Display

**Trigger**: After tool execution completes

**Component**: `ToolResultMessage`

```jsx
// ============================================
// Tool Result Message
// ============================================

function ToolResultMessage({ toolName, result, isError }) {
    const color = isError ? "red" : "green";
    const icon = isError ? "✗" : "✓";

    return (
        <Box flexDirection="column">
            <Box>
                <Text color={color}>{icon} </Text>
                <Text bold={true}>{toolName}</Text>
            </Box>
            <Box marginLeft={2}>
                <Text dimColor={true}>
                    {truncate(result, 200)}
                </Text>
            </Box>
        </Box>
    );
}
```

### Hook Attachment Display

**Trigger**: When hooks add additional context

```jsx
// ============================================
// Hook Additional Context Display
// ============================================

function HookAdditionalContext({ attachment }) {
    return (
        <Box flexDirection="column" borderStyle="round" borderColor="cyan">
            <Box>
                <Text color="cyan">Hook: {attachment.hookName}</Text>
            </Box>
            {attachment.content.map((ctx, i) => (
                <Box key={i}>
                    <Text>{ctx}</Text>
                </Box>
            ))}
        </Box>
    );
}
```

---

## 2. MCP UI (06)

### MCP Server Status Display

**Location**: Status line component

```jsx
// ============================================
// MCP Server Status
// ============================================

function McpServerStatus({ clients }) {
    const connected = clients.filter(c => c.type === "connected").length;
    const failed = clients.filter(c => c.type === "failed").length;
    const needsAuth = clients.filter(c => c.type === "needs-auth").length;

    return (
        <Box>
            <Text dimColor>MCP: </Text>
            <Text color="green">{connected} connected</Text>
            {failed > 0 && <Text color="red"> {failed} failed</Text>}
            {needsAuth > 0 && <Text color="yellow"> {needsAuth} need auth</Text>}
        </Box>
    );
}
```

### Elicitation Form Dialog

**Trigger**: MCP server requests user input via form

**Modal Priority**: 4 (lowest)

```jsx
// ============================================
// Elicitation Form Dialog
// ============================================

function ElicitationFormDialog({ request, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({});

    // Build form from JSON schema
    const fields = buildFieldsFromSchema(request.requestedSchema);

    return (
        <Box flexDirection="column">
            <Box>
                <Text bold color="magenta">Input Required</Text>
            </Box>
            <Box marginTop={1}>
                <Text>{request.message}</Text>
            </Box>

            {/* Form fields */}
            <Box flexDirection="column" marginTop={1}>
                {fields.map(field => (
                    <Box key={field.name}>
                        <Text>{field.label || field.name}: </Text>
                        <TextInput
                            value={formData[field.name] || ""}
                            onChange={val => setFormData({...formData, [field.name]: val})}
                        />
                    </Box>
                ))}
            </Box>

            {/* Actions */}
            <Box marginTop={1}>
                <Text dimColor>[Enter] Submit  [Esc] Cancel</Text>
            </Box>
        </Box>
    );
}

function buildFieldsFromSchema(schema) {
    if (schema.type !== "object" || !schema.properties) return [];

    return Object.entries(schema.properties).map(([name, prop]) => ({
        name,
        label: prop.title || name,
        type: prop.type || "string",
        required: schema.required?.includes(name) ?? false
    }));
}
```

### Elicitation URL Dialog

**Trigger**: MCP server provides URL for OAuth flow

```jsx
// ============================================
// Elicitation URL Dialog
// ============================================

function ElicitationUrlDialog({ request, onDone, onCancel }) {
    return (
        <Box flexDirection="column">
            <Box>
                <Text bold color="magenta">Authentication Required</Text>
            </Box>
            <Box marginTop={1}>
                <Text>{request.message}</Text>
            </Box>

            {/* URL display */}
            {request.uris.map((uri, i) => (
                <Box key={i} marginTop={1}>
                    <Text color="cyan">{uri}</Text>
                </Box>
            ))}

            {/* Actions */}
            <Box marginTop={1}>
                <Text dimColor>[Enter] Done  [Esc] Cancel</Text>
            </Box>
        </Box>
    );
}
```

---

## 3. Plan Mode UI (12)

### Mode Indicator

**Location**: Status line

```jsx
// ============================================
// Plan Mode Indicator
// ============================================

function PlanModeIndicator({ mode, prePlanMode }) {
    if (mode !== "plan") return null;

    return (
        <Box>
            <Text color="yellow">⏸ Plan Mode</Text>
            <Text dimColor> on (shift+tab to cycle)</Text>
        </Box>
    );
}
```

### Plan Approval Dialog

**Trigger**: ExitPlanMode called

```jsx
// ============================================
// Plan Approval Dialog
// ============================================

function PlanApprovalDialog({ planContent, planFilePath, onApprove, onReject }) {
    return (
        <Box flexDirection="column">
            <Box>
                <Text bold color="green">Ready to code?</Text>
            </Box>

            {/* Plan preview */}
            <Box flexDirection="column" marginTop={1} borderStyle="round">
                <Box>
                    <Text dimColor>Plan saved to: </Text>
                    <Text>{planFilePath}</Text>
                </Box>
                <Box marginTop={1}>
                    <Text dimColor>{truncate(planContent, 500)}</Text>
                </Box>
            </Box>

            {/* Actions */}
            <Box marginTop={1}>
                <Text>[Y] Yes, let's implement</Text>
            </Box>
            <Box>
                <Text>[R] Let me refine the plan</Text>
            </Box>
            <Box>
                <Text>[Esc] Cancel</Text>
            </Box>
        </Box>
    );
}
```

### Swarm Plan Approval (Team Lead)

**Trigger**: Teammate sends plan_approval_request

```jsx
// ============================================
// Swarm Plan Approval (Team Lead View)
// ============================================

function SwarmPlanApprovalDialog({ request, onApprove, onReject }) {
    return (
        <Box flexDirection="column">
            <Box>
                <Text bold color="cyan">Plan Approval Request</Text>
            </Box>
            <Box>
                <Text dimColor>From: </Text>
                <Text>{request.from}</Text>
            </Box>

            {/* Plan content */}
            <Box flexDirection="column" marginTop={1} borderStyle="round">
                <Text>{request.planContent}</Text>
            </Box>

            {/* Actions */}
            <Box marginTop={1}>
                <Text>[A] Approve  [R] Reject with feedback</Text>
            </Box>
        </Box>
    );
}
```

### Plan File Editor

**Trigger**: User edits plan file

```jsx
// ============================================
// Plan File Editor
// ============================================

function PlanFileEditor({ planFilePath, content, onSave }) {
    const [editing, setEditing] = useState(false);

    return (
        <Box flexDirection="column">
            <Box>
                <Text bold>Plan: {planFilePath}</Text>
            </Box>
            <Box>
                <Text dimColor>[e] Edit  [v] View full</Text>
            </Box>
        </Box>
    );
}
```

---

## 4. Task System UI (13)

### Task List Panel

**Trigger**: `expandedView: "tasks"`

```jsx
// ============================================
// Task List Panel
// ============================================

function TaskListPanel({ tasks, currentAgentId }) {
    const pending = tasks.filter(t => t.status === "pending");
    const inProgress = tasks.filter(t => t.status === "in_progress");
    const completed = tasks.filter(t => t.status === "completed");

    return (
        <Box flexDirection="column" borderStyle="round" borderColor="blue">
            <Box>
                <Text bold color="blue">Tasks</Text>
                <Text dimColor> ({tasks.length} total)</Text>
            </Box>

            {/* In Progress */}
            {inProgress.length > 0 && (
                <Box flexDirection="column" marginTop={1}>
                    <Text color="yellow">In Progress:</Text>
                    {inProgress.map(task => (
                        <TaskItem key={task.id} task={task} isActive={true} />
                    ))}
                </Box>
            )}

            {/* Pending */}
            {pending.length > 0 && (
                <Box flexDirection="column" marginTop={1}>
                    <Text dimColor>Pending:</Text>
                    {pending.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </Box>
            )}

            {/* Completed */}
            {completed.length > 0 && (
                <Box flexDirection="column" marginTop={1}>
                    <Text color="green" dimColor>Completed:</Text>
                    {completed.slice(-3).map(task => (
                        <TaskItem key={task.id} task={task} isCompleted={true} />
                    ))}
                    {completed.length > 3 && (
                        <Text dimColor>  ... and {completed.length - 3} more</Text>
                    )}
                </Box>
            )}
        </Box>
    );
}
```

### Task Item Component

```jsx
// ============================================
// Task Item
// ============================================

function TaskItem({ task, isActive = false, isCompleted = false }) {
    const statusIcon = isCompleted ? "✓" : isActive ? "►" : "○";
    const color = isCompleted ? "green" : isActive ? "yellow" : "white";

    return (
        <Box>
            <Text color={color}>{statusIcon} </Text>
            <Text dimColor={isCompleted}>
                #{task.id}: {task.subject}
            </Text>
            {task.owner && (
                <Text dimColor color="cyan"> [@{task.owner}]</Text>
            )}
            {task.blockedBy?.length > 0 && (
                <Text dimColor color="red"> ⚠ blocked</Text>
            )}
            {task.activeForm && isActive && (
                <Text dimColor> ({task.activeForm})</Text>
            )}
        </Box>
    );
}
```

### Task Progress Spinner

**Trigger**: Task with `activeForm` field

```jsx
// ============================================
// Task Progress Spinner
// ============================================

function TaskProgressSpinner({ task }) {
    const spinner = useSpinner();

    if (task.status !== "in_progress" || !task.activeForm) {
        return null;
    }

    return (
        <Box>
            <Text dimColor>{spinner} </Text>
            <Text dimColor>{task.activeForm}</Text>
        </Box>
    );
}
```

### Dependency Warning

```jsx
// ============================================
// Dependency Warning
// ============================================

function DependencyWarning({ blockedByTasks, allTasks }) {
    const blockingTaskNames = blockedByTasks.map(id => {
        const task = allTasks.find(t => t.id === id);
        return task ? `#${id}: ${task.subject}` : `#${id}`;
    });

    return (
        <Box flexDirection="column">
            <Text color="red">⚠ Task is blocked by:</Text>
            {blockingTaskNames.map((name, i) => (
                <Box key={i}>
                    <Text dimColor>  • {name}</Text>
                </Box>
            ))}
        </Box>
    );
}
```

---

## Modal Priority System

### Priority Queue

```javascript
// Modal priority constants
const MODAL_PRIORITY = {
    SANDBOX_PERMISSION: 1,        // Highest
    TOOL_PERMISSION: 2,
    WORKER_SANDBOX_PERMISSION: 3,
    ELICITATION: 4                // Lowest
};

// Modal selection logic
function getActiveModal(state) {
    if (state.sandboxPermissionQueue.length > 0) {
        return { type: "sandbox-permission", data: state.sandboxPermissionQueue[0] };
    }
    if (state.pendingToolRequest.length > 0) {
        return { type: "tool-permission", data: state.pendingToolRequest[0] };
    }
    if (state.workerSandboxQueue.length > 0) {
        return { type: "worker-sandbox-permission", data: state.workerSandboxQueue[0] };
    }
    if (state.elicitation.queue.length > 0) {
        return { type: "elicitation", data: state.elicitation.queue[0] };
    }
    return null;
}
```

### Modal Interaction

```
User presses key
    │
    ├─→ If modal active: Handle modal action
    │     ├─→ "Y" → Approve current modal
    │     ├─→ "n" → Reject current modal
    │     └─→ "Esc" → Dismiss modal
    │
    └─→ If no modal: Handle normal input
```

---

## Keybindings Integration

### Mode Cycling (Shift+Tab)

```javascript
// Mode cycling keybinding
const MODE_CYCLE = ["default", "plan", "acceptEdits"];

function handleModeCycle(currentMode) {
    const currentIndex = MODE_CYCLE.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % MODE_CYCLE.length;
    const nextMode = MODE_CYCLE[nextIndex];

    if (nextMode === "plan") {
        // Trigger EnterPlanMode tool
        return { action: "enterPlanMode" };
    }

    return { action: "setMode", mode: nextMode };
}
```

### Task Panel Toggle

```javascript
// Toggle task panel
function handleTaskPanelToggle(state) {
    if (state.expandedView === "tasks") {
        return { expandedView: null };
    }
    return { expandedView: "tasks" };
}
```

---

## State Slices Summary

| State Slice | Module | Purpose |
|-------------|--------|---------|
| `toolPermissionContext` | 05_tools, 12_plan | Permission state, mode |
| `pendingToolRequest` | 05_tools | Permission dialog queue |
| `elicitation` | 06_mcp | MCP elicitation queue |
| `mode` | 12_plan_mode | Current execution mode |
| `hasExitedPlanMode` | 12_plan_mode | Exit flag |
| `tasks` | 13_task_system | Task list |
| `expandedView` | 13_task_system | "tasks" or null |

---

## React Hook Patterns

### useSpinner

```javascript
// Animated spinner hook
function useSpinner() {
    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setFrame(f => (f + 1) % frames.length);
        }, 80);
        return () => clearInterval(timer);
    }, []);

    return frames[frame];
}
```

### useToolPermission

```javascript
// Permission state hook
function useToolPermission() {
    const [state, setState] = useAppState();

    const requestPermission = async (tool, input) => {
        return new Promise((resolve) => {
            setState(prev => ({
                ...prev,
                pendingToolRequest: [...prev.pendingToolRequest, { tool, input, resolve }]
            }));
        });
    };

    return { requestPermission };
}
```

### useTaskProgress

```javascript
// Task progress tracking hook
function useTaskProgress(taskId) {
    const [progress, setProgress] = useState(null);

    useEffect(() => {
        // Subscribe to task progress updates
        const unsubscribe = subscribeToTaskProgress(taskId, setProgress);
        return unsubscribe;
    }, [taskId]);

    return progress;
}
```