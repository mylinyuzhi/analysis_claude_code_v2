# Plan Mode - Task System Integration (Claude Code 2.1.38)

> Analysis of how the Task system integrates with plan mode, including task creation during planning and task preservation across compaction.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `ca4` (chunks.146.mjs:2724) - `collectTasksToKeep` - Task preservation during compaction
- `TaskCreate` (Nh) - Task creation tool
- `TaskList` (TK1) - Task listing tool
- `TaskGet` - Task retrieval tool
- `TaskUpdate` (DR) - Task update tool

---

## 1. Overview: Tasks in Plan Mode Context

Tasks can be created and managed during plan mode. The task system is orthogonal to plan mode - tasks exist independently but can be part of the planning workflow.

```
┌─────────────────────────────────────────────────────────────────┐
│                Task System Integration with Plan Mode            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Plan Mode Workflow with Tasks:                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 1. Agent enters plan mode                                   ││
│  │ 2. Agent explores codebase (read-only)                      ││
│  │ 3. Agent identifies implementation steps                    ││
│  │ 4. Agent MAY create tasks to track steps                    ││
│  │    • TaskCreate tool available in plan mode                 ││
│  │    • Tasks persist through plan approval                    ││
│  │ 5. Agent writes plan to plan file                           ││
│  │ 6. Agent calls ExitPlanMode for approval                    ││
│  │ 7. After approval, agent executes tasks                     ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Task Preservation:                                            │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ • Tasks survive compaction via ca4()                        ││
│  │ • Task state preserved: completed, failed, killed           ││
│  │ • Background agent status included as attachments          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Task Collection During Compaction (`ca4`)

The `ca4` function preserves task state during conversation compaction:

```javascript
// ============================================
// ca4 - collectTasksToKeep
// Location: chunks.146.mjs:2724-2741
// ============================================

// ORIGINAL (for source lookup):
async function ca4(A) {
    let q = await A.getAppState();
    return Object.values(q.tasks).filter((Y) => Y.type === "local_agent").flatMap((Y) => {
        if (Y.retrieved) return [];
        let {
            status: z
        } = Y;
        if (z === "completed" || z === "failed" || z === "killed") return [kq({
            type: "task_status",
            taskId: Y.agentId,
            taskType: "local_agent",
            description: Y.description,
            status: z,
            deltaSummary: Y.error ?? null
        })];
        return []
    })
}

// READABLE (for understanding):
async function collectTasksToKeep(context) {
    // Step 1: Get current app state containing all tasks
    let appState = await context.getAppState();

    // Step 2: Filter to only local_agent tasks (background agents)
    return Object.values(appState.tasks)
        .filter((task) => task.type === "local_agent")
        .flatMap((task) => {
            // Skip tasks that have already been retrieved
            if (task.retrieved) {
                return [];
            }

            let { status } = task;

            // Only preserve terminal state tasks
            // Running tasks are not preserved (they're still active)
            if (status === "completed" || status === "failed" || status === "killed") {
                return [createAttachmentMessage({
                    type: "task_status",
                    taskId: task.agentId,
                    taskType: "local_agent",
                    description: task.description,
                    status: status,
                    deltaSummary: task.error ?? null
                })];
            }

            // Running or pending tasks - not preserved
            return [];
        });
}

// Mapping: ca4→collectTasksToKeep, A→context, q→appState, Y→task
//          z→status, kq→createAttachmentMessage
```

### Key Decision: Why Only Terminal Tasks?

**What it does:** Only preserves `completed`, `failed`, or `killed` tasks.

**Why this approach:**
1. **Running tasks are active**: They're still executing and will report status when done
2. **Terminal tasks are history**: Without preservation, their status would be lost
3. **Context efficiency**: Only completed work matters for post-compact context

**Key insight:** Running background agents continue executing during compaction. When they finish, they'll update state normally. Only completed/failed tasks need preservation because their final state is part of the conversation history.

---

## 3. Task Status Attachment Schema

```typescript
// TypeScript representation of the task_status attachment
interface TaskStatusAttachment {
    type: "task_status";
    taskId: string;           // Agent ID of the background agent
    taskType: "local_agent";  // Currently only local_agent supported
    description: string;      // Task description from creation
    status: "completed" | "failed" | "killed";
    deltaSummary: string | null;  // Error message or result summary
}

// Full attachment message structure
interface AttachmentMessage {
    attachment: TaskStatusAttachment;
    type: "attachment";
    uuid: string;
    timestamp: string;
}
```

---

## 4. Task Tools Availability in Plan Mode

### Tools Allowed in Plan Mode

| Tool | Available? | Reason |
|------|------------|--------|
| `TaskCreate` | Yes | Creates metadata, doesn't modify code |
| `TaskList` | Yes | Read-only operation |
| `TaskGet` | Yes | Read-only operation |
| `TaskUpdate` | Yes* | Updates task state, not code |

### TaskCreate in Plan Mode

```javascript
// ============================================
// TaskCreate tool - isReadOnly check
// Location: chunks.140.mjs:2806+
// ============================================

// TaskCreate is a read-only tool because it only creates task metadata
// It doesn't modify any files or execute any code

// READABLE (for understanding):
const TaskCreateTool = {
    name: "TaskCreate",
    // ... schema definitions ...

    isReadOnly(input) {
        // Task creation is always considered read-only
        // It only creates a task record in app state
        return true;
    },

    async call(input, context) {
        // Create task in app state
        let taskId = generateTaskId();
        let task = {
            id: taskId,
            subject: input.subject,
            description: input.description,
            status: "pending",
            type: "local_agent",
            createdAt: new Date().toISOString()
        };

        // Update app state
        await context.updateAppState((state) => ({
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: task
            }
        }));

        return { taskId, status: "pending" };
    }
};
```

### TaskUpdate in Plan Mode

Task updates are allowed because they modify task state, not code:

```javascript
// ============================================
// TaskUpdate tool - Updates task state
// Location: chunks.141.mjs:32+
// ============================================

// READABLE (for understanding):
const TaskUpdateTool = {
    name: "TaskUpdate",

    isReadOnly(input) {
        // Task updates are considered read-only from a code perspective
        // They only modify internal task state
        return true;
    },

    async call(input, context) {
        let { taskId, status, description } = input;

        await context.updateAppState((state) => ({
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: {
                    ...state.tasks[taskId],
                    ...(status && { status }),
                    ...(description && { description })
                }
            }
        }));

        return { success: true };
    }
};
```

---

## 5. Task Creation During Planning Workflow

When an agent is in plan mode and creates tasks:

```
Plan Mode Active
    │
    ├─ Agent explores codebase
    │   └─ Uses Glob, Grep, Read tools
    │
    ├─ Agent identifies implementation steps
    │   └─ "Need to modify X, Y, Z files"
    │
    ├─ Agent MAY create tasks
    │   ├─ TaskCreate called
    │   ├─ Tasks created with status: "pending"
    │   └─ Tasks stored in appState.tasks
    │
    ├─ Agent writes plan to plan file
    │   └─ Plan includes task references
    │
    ├─ Agent calls ExitPlanMode
    │   └─ Approval requested
    │
    └─ After approval:
        ├─ Mode changes to "default"
        ├─ Agent can execute tasks
        └─ Tasks transition: pending → in_progress → completed
```

---

## 6. Task Preservation Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   Compaction Triggered                           │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Check: Any terminal-state tasks?                                │
│                                                                 │
│ ca4(context) → filter for completed/failed/killed              │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ For each terminal task:                                         │
│                                                                 │
│ • taskId: agent identifier                                     │
│ • taskType: "local_agent"                                      │
│ • description: original task description                       │
│ • status: terminal state                                       │
│ • deltaSummary: error or summary                               │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Create attachment:                                              │
│                                                                 │
│ kq({                                                           │
│     type: "task_status",                                       │
│     taskId: "agent-abc123",                                    │
│     taskType: "local_agent",                                   │
│     description: "Analyze authentication flow",                │
│     status: "completed",                                       │
│     deltaSummary: "Found 3 auth issues"                        │
│ })                                                              │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Add to post-compact attachments:                               │
│                                                                 │
│ attachments = [                                                │
│     ...files,                                                  │
│     ...tasks,  ← task_status attachments added here            │
│     todoAttachment,                                            │
│     planAttachment,                                            │
│     skillsAttachment                                           │
│ ]                                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Task State Transitions

```
┌─────────────────────────────────────────────────────────────────┐
│                    Task State Machine                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐                                                   │
│  │ PENDING  │ ← Created via TaskCreate                         │
│  └────┬─────┘                                                   │
│       │                                                         │
│       │ Agent starts work on task                               │
│       │                                                         │
│       ▼                                                         │
│  ┌──────────┐                                                   │
│  │IN_PROGRESS│ ← NOT preserved during compaction               │
│  └────┬─────┘   (still running, will report when done)         │
│       │                                                         │
│       ├─────────────────────┬─────────────────────┐            │
│       │                     │                     │            │
│       ▼                     ▼                     ▼            │
│  ┌──────────┐         ┌──────────┐         ┌──────────┐       │
│  │COMPLETED │         │  FAILED  │         │  KILLED  │       │
│  └──────────┘         └──────────┘         └──────────┘       │
│       │                     │                     │            │
│       └─────────────────────┴─────────────────────┘            │
│                             │                                   │
│                             ▼                                   │
│                    Preserved during compaction                  │
│                    via ca4() → task_status attachment           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Interaction with Plan Approval Flow

### Tasks Created During Planning

When tasks are created during plan mode:

1. **Task exists in app state** with `status: "pending"`
2. **Plan file may reference tasks** (manually written by agent)
3. **ExitPlanMode approval** does NOT automatically affect tasks
4. **After approval**, agent can start working on tasks

### Task References in Plan File

The agent may write task IDs in the plan file:

```markdown
# Implementation Plan

## Tasks Created

1. Task `task-abc123`: Analyze authentication flow
2. Task `task-def456`: Update user model
3. Task `task-ghi789`: Add tests

## Execution Order

1. Complete `task-abc123` first (blocking)
2. Then `task-def456` and `task-ghi789` in parallel
```

After plan approval, the agent reads the plan file and works through the tasks.

---

## 9. Background Agents and Plan Mode

### Background Agents Spawned Before Plan Mode

If background agents are running when entering plan mode:

```
Background Agent Running (status: in_progress)
    │
    ├─ User enters plan mode
    │   └─ Background agent continues running
    │
    ├─ Plan mode active
    │   └─ Background agent finishes
    │       └─ Status changes to "completed"
    │
    └─ ca4() collects task_status on next compaction
```

### Background Agents Spawned During Plan Mode

The `Agent` tool can be used in plan mode for exploration:

```javascript
// Agent tool with agentType: "Explore" is read-only
const AgentTool = {
    name: "Agent",

    isReadOnly(input) {
        // Explore agents are read-only
        if (input.agent_type === "Explore") {
            return true;
        }
        // Other agent types may not be read-only
        return false;
    }
};
```

When an Explore agent finishes during plan mode:

1. Its result is collected normally
2. Task status becomes "completed"
3. If compaction occurs, `ca4()` preserves the task status

---

## 10. Task System vs Todo System

| Aspect | Task System | Todo System |
|---------|-------------|-------------|
| Storage | `appState.tasks` | Todo file |
| Tool names | TaskCreate, TaskList, TaskGet, TaskUpdate | TodoWrite |
| Plan mode | Fully available | Fully available |
| Compaction | `ca4()` preserves status | `pa4()` preserves todos |
| Background agents | Yes | No |
| Dependencies | Yes | No |

### When to Use Each

- **Task System**: Complex workflows, background agents, dependencies
- **Todo System**: Simple checklists, no dependencies needed

Both can be used together during planning.

---

## 11. Edge Cases

### Edge Case 1: Task Created But Plan Rejected

If tasks are created during planning but the plan is rejected:

```
Agent creates tasks (pending)
    │
    └─ Plan rejected
        └─ Tasks remain in appState.tasks
        └─ Agent can modify plan and re-submit
        └─ Or agent can delete tasks if no longer needed
```

Tasks are NOT automatically deleted on plan rejection.

### Edge Case 2: Task Running During Plan Approval

If a background agent is running when ExitPlanMode is called:

```
Background agent running (in_progress)
    │
    └─ ExitPlanMode called
        └─ Approval dialog shown
        └─ Background agent continues
        └─ If approved: mode changes, background agent unaffected
        └─ If rejected: mode stays plan, background agent unaffected
```

Background agents are independent of plan mode state.

### Edge Case 3: Compaction While Tasks Pending

If compaction occurs with pending tasks:

```
Pending tasks exist
    │
    └─ Compaction triggered
        └─ ca4() checks: pending → not terminal → skipped
        └─ Pending tasks NOT preserved
        └─ Tasks still exist in appState.tasks (not affected by compaction)
```

Only terminal-state tasks are preserved as attachments. Pending tasks remain in app state.

---

## 12. Integration with Other Systems

### Compact Integration

From `compact_integration.md`:
- Tasks are collected after files but before todos
- Only terminal-state tasks preserved

### Hooks Integration

From `hooks_integration.md`:
- `TaskCompleted` hook fires when background agent finishes
- Hook fires even during plan mode

### State Management

From `state_management.md`:
- Tasks stored in `appState.tasks`
- Independent of plan mode state variables

---

## Summary: Task-Plan Integration

| Aspect | Behavior |
|--------|----------|
| **TaskCreate in plan mode** | Allowed (read-only) |
| **TaskList in plan mode** | Allowed (read-only) |
| **TaskGet in plan mode** | Allowed (read-only) |
| **TaskUpdate in plan mode** | Allowed (metadata update) |
| **Task preservation** | Only terminal-state tasks via `ca4()` |
| **Running tasks during plan mode** | Continue unaffected |
| **Task after plan rejection** | Remain in app state |
| **Background agents in plan mode** | Explore type is read-only |

### Key Invariants

1. Tasks are **orthogonal** to plan mode - they exist independently
2. Only **terminal-state** tasks are preserved during compaction
3. **Background agents** continue running regardless of plan mode state
4. Task tools are **read-only** from a code modification perspective
5. Tasks created during planning **persist** through plan approval