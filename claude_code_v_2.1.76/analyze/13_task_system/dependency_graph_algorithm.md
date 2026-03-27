# Task Dependency Graph Algorithm (Claude Code 2.1.76)

> Complete analysis of the task dependency graph implementation - DAG structure, cycle detection, and topological sorting.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Task System section)

Key functions in this document:
- `addTaskDependency` (_T8) - Add edge to dependency graph
- `deleteTask` (sD1) - Remove node and clean all edges
- `claimTaskWithAgentBusyValidation` ($N9) - Claim with busy check
- Dependency graph data structure in task objects

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TASK DEPENDENCY GRAPH                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Task Data Structure                                            │  │
│  │                                                                 │  │
│  │  {                                                              │  │
│  │    id: "1",                                                     │  │
│  │    subject: "Design database schema",                          │  │
│  │    status: "in_progress",                                      │  │
│  │    blocks: ["2", "3"],      // Tasks waiting for this task    │  │
│  │    blockedBy: []            // Tasks this task waits for      │  │
│  │  }                                                             │  │
│  │                                                                 │  │
│  │  {                                                              │  │
│  │    id: "2",                                                     │  │
│  │    subject: "Implement API endpoints",                         │  │
│  │    status: "pending",                                          │  │
│  │    blocks: ["4"],           // Task 4 waits for task 2        │  │
│  │    blockedBy: ["1"]         // Task 2 waits for task 1        │  │
│  │  }                                                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Graph Visualization                                            │  │
│  │                                                                 │  │
│  │       Task 1 (Design DB)                                       │  │
│  │           │                                                     │  │
│  │           ├──────────────┬────────────────┐                    │  │
│  │           ▼              ▼                │                    │  │
│  │       Task 2          Task 3              │                    │  │
│  │       (API)           (Tests)             │                    │  │
│  │           │              │                │                    │  │
│  │           └──────────────┤                │                    │  │
│  │                          ▼                │                    │  │
│  │                      Task 4              │                    │  │
│  │                      (Integration)       │                    │  │
│  │                                                                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Model

### Task Schema

```typescript
interface Task {
  id: string;                    // Auto-increment integer as string
  subject: string;               // Brief title
  description: string;           // Detailed requirements
  activeForm?: string;           // Present continuous status for UI spinner
  status: "pending" | "in_progress" | "completed" | "deleted";
  owner?: string;                // Agent name who owns this task
  blocks: string[];              // Task IDs waiting for this task (outgoing edges)
  blockedBy: string[];           // Task IDs this task is waiting for (incoming edges)
  metadata?: Record<string, unknown>;  // Arbitrary key-value pairs
}
```

### Edge Direction Semantics

```
Task A blocks: [B]    →  A must complete before B can start
Task B blockedBy: [A] →  B cannot start until A completes

Graph edge: A ──► B (A blocks B, B blockedBy A)
```

---

## Dependency Operations

### Add Dependency

```javascript
// ============================================
// addTaskDependency - Add edge to dependency graph
// Location: chunks.84.mjs:1754-1780
// ============================================

// ORIGINAL (for source lookup):
async function _T8(A, q, K) {
    let Y = await DB(A, q);
    if (!Y) return !1;
    let z = await DB(A, K);
    if (!z) return !1;
    if (Y.blocks.includes(K)) return !0;
    if (await OT8(A, K, q)) return !1;
    return await WI(A, q, {
        blocks: [...Y.blocks, K]
    }) && await WI(A, K, {
        blockedBy: [...z.blockedBy, q]
    }), !0
}

// READABLE (for understanding):
async function addTaskDependency(taskManager, blockingTaskId, blockedTaskId) {
  // 1. Load both tasks
  const blockingTask = await loadTask(taskManager, blockingTaskId);
  if (!blockingTask) return false;

  const blockedTask = await loadTask(taskManager, blockedTaskId);
  if (!blockedTask) return false;

  // 2. Check if dependency already exists
  if (blockingTask.blocks.includes(blockedTaskId)) {
    return true;  // Already has dependency
  }

  // 3. Check for cycles (would block the blocked task)
  // OT8 = claimTask which includes cycle detection
  if (await wouldCreateCycle(taskManager, blockedTaskId, blockingTaskId)) {
    return false;  // Prevent cycle
  }

  // 4. Add bidirectional edges
  await updateTask(taskManager, blockingTaskId, {
    blocks: [...blockingTask.blocks, blockedTaskId]
  });

  await updateTask(taskManager, blockedTaskId, {
    blockedBy: [...blockedTask.blockedBy, blockingTaskId]
  });

  return true;
}

// Mapping: _T8→addTaskDependency, A→taskManager, q→blockingTaskId, K→blockedTaskId,
//          DB→loadTask, Y→blockingTask, z→blockedTask, WI→updateTask, OT8→claimTask
```

### Remove Dependency (on Task Deletion)

```javascript
// ============================================
// deleteTask - Remove node and clean all edges
// Location: chunks.84.mjs:1713-1739
// ============================================

// ORIGINAL (for source lookup):
async function sD1(A, q) {
    let K = yF6(A, q);
    try {
        let Y = parseInt(q, 10);
        if (!isNaN(Y)) {
            let _ = await zT8(A);
            if (Y > _) await P84(A, Y)
        }
        try {
            await j84(K)
        } catch (_) {
            if (_.code === "ENOENT") return !1;
            throw _
        }
        let z = await DX(A);
        for (let _ of z) {
            let w = _.blocks.filter(($) => $ !== q),
                O = _.blockedBy.filter(($) => $ !== q);
            if (w.length !== _.blocks.length || O.length !== _.blockedBy.length) await WI(A, _.id, {
                blocks: w,
                blockedBy: O
            })
        }
        return Gt(), !0
    } catch {
        return !1
    }
}

// READABLE (for understanding):
async function deleteTask(taskManager, taskId) {
  const taskFilePath = getTaskFilePath(taskManager, taskId);

  try {
    // 1. Update high watermark if this task ID is higher than current max
    const taskIdInt = parseInt(taskId, 10);
    if (!isNaN(taskIdInt)) {
      const currentHighWaterMark = await readHighWaterMarkFile(taskManager);
      if (taskIdInt > currentHighWaterMark) {
        await writeHighWaterMark(taskManager, taskIdInt);
      }
    }

    // 2. Delete the task file
    try {
      await deleteFile(taskFilePath);
    } catch (err) {
      if (err.code === "ENOENT") return false;  // File doesn't exist
      throw err;
    }

    // 3. Clean up ALL dependency references in other tasks
    const allTasks = await loadAllTasks(taskManager);

    for (const task of allTasks) {
      // Remove deleted task from 'blocks' array
      const newBlocks = task.blocks.filter(id => id !== taskId);

      // Remove deleted task from 'blockedBy' array
      const newBlockedBy = task.blockedBy.filter(id => id !== taskId);

      // If either array changed, update the task
      if (newBlocks.length !== task.blocks.length ||
          newBlockedBy.length !== task.blockedBy.length) {
        await updateTask(taskManager, task.id, {
          blocks: newBlocks,
          blockedBy: newBlockedBy
        });
      }
    }

    // 4. Invalidate cache
    invalidateTaskCache();

    return true;
  } catch (error) {
    return false;
  }
}

// Mapping: sD1→deleteTask, A→taskManager, q→taskId, yF6→getTaskFilePath,
//          zT8→readHighWaterMarkFile, P84→writeHighWaterMark, j84→deleteFile,
//          DX→loadAllTasks, WI→updateTask, Gt→invalidateTaskCache
```

---

## Cycle Detection Algorithm

### Depth-First Search Cycle Check

```javascript
// ============================================
// wouldCreateCycle - Check if adding edge creates cycle
// ============================================

async function wouldCreateCycle(taskManager, sourceId, targetId) {
  // If we add edge: targetId → sourceId
  // We need to check if there's already a path: sourceId → targetId
  // If so, adding targetId → sourceId would create a cycle

  const visited = new Set();
  const stack = [sourceId];

  while (stack.length > 0) {
    const currentId = stack.pop();

    if (currentId === targetId) {
      return true;  // Path exists, adding edge would create cycle
    }

    if (visited.has(currentId)) {
      continue;
    }

    visited.add(currentId);

    const task = await loadTask(taskManager, currentId);
    if (task) {
      // Follow outgoing edges (blocks)
      for (const blockedId of task.blocks) {
        if (!visited.has(blockedId)) {
          stack.push(blockedId);
        }
      }
    }
  }

  return false;  // No path found, safe to add edge
}
```

---

## Topological Sort for Execution Order

### Kahn's Algorithm

```javascript
// ============================================
// getExecutionOrder - Topological sort of tasks
// ============================================

function getExecutionOrder(tasks) {
  // Build in-degree map
  const inDegree = new Map();
  const adjacencyList = new Map();

  // Initialize
  for (const task of tasks) {
    inDegree.set(task.id, task.blockedBy.length);
    adjacencyList.set(task.id, task.blocks);
  }

  // Find all tasks with no dependencies
  const queue = [];
  for (const [taskId, degree] of inDegree) {
    if (degree === 0) {
      queue.push(taskId);
    }
  }

  const result = [];

  while (queue.length > 0) {
    const currentId = queue.shift();
    result.push(currentId);

    // Reduce in-degree for all blocked tasks
    const blockedTasks = adjacencyList.get(currentId) || [];
    for (const blockedId of blockedTasks) {
      const newDegree = inDegree.get(blockedId) - 1;
      inDegree.set(blockedId, newDegree);

      if (newDegree === 0) {
        queue.push(blockedId);
      }
    }
  }

  // If result doesn't contain all tasks, there's a cycle
  if (result.length !== tasks.length) {
    // Cycle detected - return partial order
    console.warn("Cycle detected in task dependencies");
  }

  return result;
}
```

---

## Task Claiming with Busy Validation

```javascript
// ============================================
// claimTaskWithAgentBusyValidation - Claim with busy check
// Location: chunks.84.mjs:1831-1883
// ============================================

// ORIGINAL (for source lookup):
async function $N9(A, q, K, Y) {
    let z = await DB(A, q);
    if (!z) return {
        success: !1,
        error: "Task not found"
    };
    if (z.owner && z.owner !== K) return {
        success: !1,
        error: `Task already claimed by ${z.owner}`
    };
    if (Y) {
        let _ = await DX(A), w = _.filter(($) => $.owner === K && $.status === "in_progress");
        if (w.length > 0) return {
            success: !1,
            error: `Agent ${K} already has ${w.length} in-progress tasks`,
            conflictingTasks: w.map(($) => $.id)
        }
    }
    return await WI(A, q, {
        owner: K,
        status: "in_progress"
    }), {
        success: !0,
        task: await DB(A, q)
    }
}

// READABLE (for understanding):
async function claimTaskWithAgentBusyValidation(taskManager, taskId, agentName, checkBusy) {
  // 1. Load task
  const task = await loadTask(taskManager, taskId);
  if (!task) {
    return {
      success: false,
      error: "Task not found"
    };
  }

  // 2. Check if already claimed
  if (task.owner && task.owner !== agentName) {
    return {
      success: false,
      error: `Task already claimed by ${task.owner}`
    };
  }

  // 3. Check if agent is busy with other tasks
  if (checkBusy) {
    const allTasks = await loadAllTasks(taskManager);
    const inProgressTasks = allTasks.filter(
      t => t.owner === agentName && t.status === "in_progress"
    );

    if (inProgressTasks.length > 0) {
      return {
        success: false,
        error: `Agent ${agentName} already has ${inProgressTasks.length} in-progress tasks`,
        conflictingTasks: inProgressTasks.map(t => t.id)
      };
    }
  }

  // 4. Claim the task
  await updateTask(taskManager, taskId, {
    owner: agentName,
    status: "in_progress"
  });

  return {
    success: true,
    task: await loadTask(taskManager, taskId)
  };
}

// Mapping: $N9→claimTaskWithAgentBusyValidation, A→taskManager, q→taskId,
//          K→agentName, Y→checkBusy, DB→loadTask, DX→loadAllTasks, WI→updateTask
```

---

## Lock Configuration

Task operations use proper locking to prevent race conditions:

```javascript
// ============================================
// Lock configuration for task operations
// Location: chunks.84.mjs
// ============================================

const lockOptions = {
  retries: 10,        // Number of retries
  minTimeout: 5,      // Minimum wait between retries (ms)
  maxTimeout: 100     // Maximum wait between retries (ms)
};

// Usage in createTask:
async function createTask(taskManager, taskData) {
  const lockFilePath = await getLockFilePath(taskManager);
  let unlock;

  try {
    // ACQUIRE LOCK
    unlock = await fileLock.lock(lockFilePath, lockOptions);

    // Perform atomic operation
    const currentMaxId = await getHighWaterMark(taskManager);
    const newId = String(currentMaxId + 1);
    // ...

  } finally {
    // RELEASE LOCK (always)
    if (unlock) await unlock();
  }
}
```

---

## Cross-Feature Integration

### Task System ↔ System Reminder (04)

Task status changes generate attachments:

```javascript
// Task status attachment types
{
  type: "task_status",
  taskId: "1",
  status: "completed",
  owner: "developer-agent",
  timestamp: "2024-01-15T10:30:00Z"
}

// Task assignment notification
{
  type: "task_assignment",
  taskId: "2",
  subject: "Implement API",
  assignedBy: "team-lead",
  timestamp: "2024-01-15T10:00:00Z"
}
```

### Task System ↔ Team Integration (30)

```javascript
// When task owner is set in team mode
if (isTeamMode() && update.owner) {
  // Send notification to owner's mailbox
  await writeToMailbox(update.owner, {
    from: getCurrentAgentName() || "team-lead",
    text: JSON.stringify({
      type: "task_assignment",
      taskId: taskId,
      subject: task.subject,
      description: task.description
    }),
    timestamp: new Date().toISOString(),
    color: getCurrentAgentColor()
  }, taskManager);
}
```

### Task System ↔ Hooks (11)

Task completion triggers hooks:

```javascript
// When status changes to "completed"
if (updates.status === "completed") {
  const hookIterator = executeTaskCompletedHooks(
    taskId,
    task.subject,
    task.description,
    getCurrentAgentName(),
    getCurrentAgentId()
  );

  for await (const hookResult of hookIterator) {
    if (hookResult.blockingError) {
      errors.push(formatHookError(hookResult.blockingError));
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      error: errors.join("\n")
    };
  }
}
```

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Dependency graph with blocks/blockedBy arrays |
| 2.1.32 | Team integration with owner assignment and notifications |
| 2.1.7 | Task system introduced (replaced TodoList) |