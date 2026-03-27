# Task Dependency Resolution (Claude Code 2.1.76)

> Complete analysis of the dependency graph system, cycle detection, and parallel execution planning.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Task System section

Key concepts:
- `blocks` - Task IDs that this task is blocking
- `blockedBy` - Task IDs that are blocking this task
- Dependency graph traversal for status checks

---

## Overview

The Task System supports a directed acyclic graph (DAG) of task dependencies. Tasks can declare what they block (`blocks`) and what blocks them (`blockedBy`), enabling complex parallel workflows.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DEPENDENCY GRAPH SYSTEM                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Task Model                                                          │
│     ├─ blocks: string[]     - Tasks waiting for this task           │
│     └─ blockedBy: string[]  - Tasks this task waits for             │
│                                                                       │
│  Dependency Graph                                                    │
│     │                                                                 │
│     ├─→ Task 1 (completed)                                           │
│     │      │                                                          │
│     │      └─→ blocks: [Task 2, Task 3]                             │
│     │                                                                 │
│     ├─→ Task 2 (in_progress) ← blockedBy: [Task 1]                  │
│     │      │                                                          │
│     │      └─→ blocks: [Task 4]                                      │
│     │                                                                 │
│     ├─→ Task 3 (pending) ← blockedBy: [Task 1]                      │
│     │      │                                                          │
│     │      └─→ blocks: [Task 4]                                      │
│     │                                                                 │
│     └─→ Task 4 (pending) ← blockedBy: [Task 2, Task 3]              │
│                                                                       │
│  Status Propagation                                                  │
│     └─→ Task can start when all blockedBy tasks are completed        │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Dependency Operations

### Adding Dependencies

```javascript
// ============================================
// addTaskDependency - Add a dependency between tasks
// Location: chunks.84.mjs:1754-1780
// ============================================

async function addTaskDependency(taskManager, blockingTaskId, blockedTaskId) {
  // 1. Load both tasks
  const blockingTask = await loadTask(taskManager, blockingTaskId);
  const blockedTask = await loadTask(taskManager, blockedTaskId);

  if (!blockingTask || !blockedTask) {
    throw new Error("Task not found");
  }

  // 2. Check for cycle
  if (wouldCreateCycle(blockingTaskId, blockedTaskId, taskManager)) {
    throw new Error("Cannot add dependency: would create cycle");
  }

  // 3. Update blocking task's blocks array
  if (!blockingTask.blocks.includes(blockedTaskId)) {
    blockingTask.blocks.push(blockedTaskId);
    await updateTask(taskManager, blockingTaskId, {
      blocks: blockingTask.blocks
    });
  }

  // 4. Update blocked task's blockedBy array
  if (!blockedTask.blockedBy.includes(blockingTaskId)) {
    blockedTask.blockedBy.push(blockingTaskId);
    await updateTask(taskManager, blockedTaskId, {
      blockedBy: blockedTask.blockedBy
    });
  }
}
```

### Cycle Detection

```javascript
// ============================================
// wouldCreateCycle - Check if adding edge creates a cycle
// Uses DFS from blockedTask to see if it can reach blockingTask
// ============================================

async function wouldCreateCycle(blockingTaskId, blockedTaskId, taskManager) {
  // If we're adding A→B, check if B can already reach A
  // (meaning there's already a path from A to B)
  const visited = new Set();
  const stack = [blockedTaskId];

  while (stack.length > 0) {
    const currentId = stack.pop();

    if (currentId === blockingTaskId) {
      return true;  // Found a cycle!
    }

    if (visited.has(currentId)) {
      continue;  // Already processed
    }
    visited.add(currentId);

    // Get tasks that current task blocks
    const task = await loadTask(taskManager, currentId);
    if (task?.blocks) {
      stack.push(...task.blocks);
    }
  }

  return false;  // No cycle found
}
```

---

## Status Propagation

### Checking if Task is Ready

A task can only start when all its dependencies are completed:

```javascript
async function isTaskReady(taskManager, taskId) {
  const task = await loadTask(taskManager, taskId);
  if (!task) return false;

  // Check all blocking tasks
  for (const blockingTaskId of task.blockedBy) {
    const blockingTask = await loadTask(taskManager, blockingTaskId);
    if (!blockingTask || blockingTask.status !== "completed") {
      return false;  // Still blocked
    }
  }

  return true;  // All dependencies satisfied
}
```

### Getting Blocked Tasks

Find all tasks blocked by a given task:

```javascript
async function getBlockedTasks(taskManager, taskId) {
  const task = await loadTask(taskManager, taskId);
  if (!task) return [];

  const blockedTasks = [];
  for (const blockedId of task.blocks) {
    const blockedTask = await loadTask(taskManager, blockedId);
    if (blockedTask) {
      blockedTasks.push({
        task: blockedTask,
        isReady: await isTaskReady(taskManager, blockedId)
      });
    }
  }

  return blockedTasks;
}
```

---

## Parallel Execution Planning

### Finding Parallelizable Tasks

```javascript
async function findParallelizableTasks(taskManager) {
  const allTasks = await loadAllTasks(taskManager);

  // Group tasks by dependency level
  const levels = [];
  const assigned = new Set();

  while (assigned.size < allTasks.length) {
    const level = [];

    for (const task of allTasks) {
      if (assigned.has(task.id)) continue;

      // Check if all dependencies are in previous levels
      const depsComplete = task.blockedBy.every(depId =>
        assigned.has(depId)
      );

      if (depsComplete) {
        level.push(task);
      }
    }

    if (level.length === 0) {
      // No progress - possible cycle
      throw new Error("Cycle detected in task dependencies");
    }

    levels.push(level);
    level.forEach(t => assigned.add(t.id));
  }

  return levels;
}
```

### Example Execution Plan

```
Level 0 (can start immediately):
  - Task 1: Setup database
  - Task 5: Create API documentation

Level 1 (after Level 0 completes):
  - Task 2: Implement user model (depends on Task 1)
  - Task 3: Implement product model (depends on Task 1)

Level 2 (after Level 1 completes):
  - Task 4: Implement order system (depends on Task 2, Task 3)

Level 3:
  - Task 6: Integration tests (depends on Task 4)
```

---

## Swarm Integration

### Claiming Available Tasks

Teammates can claim tasks that are ready:

```javascript
// ============================================
// findNextAvailableTask - Find a task ready to be claimed
// Location: chunks.134.mjs:1445
// ============================================

async function findNextAvailableTask(taskManager, agentName) {
  const allTasks = await loadAllTasks(taskManager);

  for (const task of allTasks) {
    // Skip non-pending tasks
    if (task.status !== "pending") continue;

    // Skip tasks owned by others
    if (task.owner && task.owner !== agentName) continue;

    // Check if all dependencies are complete
    const depsComplete = await checkDependenciesComplete(
      taskManager,
      task.blockedBy
    );

    if (depsComplete) {
      return task;  // Found an available task
    }
  }

  return null;  // No available tasks
}
```

### Auto-Claim for Idle Teammates

```javascript
// When a teammate goes idle, auto-claim next available task
async function handleIdleTeammate(agentName) {
  const task = await findNextAvailableTask(taskManager, agentName);

  if (task) {
    await claimTask(taskManager, task.id, agentName);

    // Send task assignment notification
    const prompt = generatePromptFromTask(task);  // PVY
    return { claimed: true, task, prompt };
  }

  return { claimed: false, reason: "No available tasks" };
}
```

---

## Dependency Removal

### Removing Dependencies

```javascript
async function removeTaskDependency(taskManager, blockingTaskId, blockedTaskId) {
  const blockingTask = await loadTask(taskManager, blockingTaskId);
  const blockedTask = await loadTask(taskManager, blockedTaskId);

  if (!blockingTask || !blockedTask) return;

  // Remove from blocking task's blocks
  blockingTask.blocks = blockingTask.blocks.filter(id => id !== blockedTaskId);
  await updateTask(taskManager, blockingTaskId, {
    blocks: blockingTask.blocks
  });

  // Remove from blocked task's blockedBy
  blockedTask.blockedBy = blockedTask.blockedBy.filter(id => id !== blockingTaskId);
  await updateTask(taskManager, blockedTaskId, {
    blockedBy: blockedTask.blockedBy
  });
}
```

### Cascading Delete

When a task is deleted, clean up all dependency references:

```javascript
async function deleteTaskWithCleanup(taskManager, taskId) {
  const task = await loadTask(taskManager, taskId);
  if (!task) return;

  // Remove from all tasks that this task blocks
  for (const blockedId of task.blocks) {
    const blockedTask = await loadTask(taskManager, blockedId);
    if (blockedTask) {
      blockedTask.blockedBy = blockedTask.blockedBy.filter(id => id !== taskId);
      await updateTask(taskManager, blockedId, {
        blockedBy: blockedTask.blockedBy
      });
    }
  }

  // Remove from all tasks that block this task
  for (const blockingId of task.blockedBy) {
    const blockingTask = await loadTask(taskManager, blockingId);
    if (blockingTask) {
      blockingTask.blocks = blockingTask.blocks.filter(id => id !== taskId);
      await updateTask(taskManager, blockingId, {
        blocks: blockingTask.blocks
      });
    }
  }

  // Finally, delete the task
  await deleteTask(taskManager, taskId);
}
```

---

## Visualization

### Text-Based Graph

```
Task Dependency Graph:
=======================

[T1: Setup DB] ────────────┬──→ [T2: User Model]
                            │
                            └──→ [T3: Product Model]
                                      │
[T5: API Docs]                        │
      │                               │
      └───────────────────────────────┴──→ [T4: Orders]
                                                  │
                                                  └──→ [T6: Tests]

Legend:
  [X] = pending    [X✓] = completed    [X●] = in_progress
```

### JSON Graph Export

```javascript
function exportDependencyGraph(taskManager) {
  const tasks = loadAllTasks(taskManager);

  return {
    nodes: tasks.map(t => ({
      id: t.id,
      label: t.subject,
      status: t.status
    })),
    edges: tasks.flatMap(t =>
      t.blocks.map(blockedId => ({
        source: t.id,
        target: blockedId,
        type: "blocks"
      }))
    )
  };
}
```

---

## Quick Reference

### Dependency Fields

| Field | Type | Meaning |
|-------|------|---------|
| `blocks` | string[] | Tasks waiting for this task |
| `blockedBy` | string[] | Tasks this task waits for |

### Status Rules

| Condition | Can Start? |
|-----------|------------|
| No `blockedBy` | Yes |
| All `blockedBy` completed | Yes |
| Any `blockedBy` pending/in_progress | No |

### API

| Function | Purpose |
|----------|---------|
| `addTaskDependency` | Add dependency edge |
| `removeTaskDependency` | Remove dependency edge |
| `isTaskReady` | Check if all deps complete |
| `findNextAvailableTask` | Find claimable task |
| `wouldCreateCycle` | Cycle detection |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Enhanced cycle detection |
| 2.1.32 | Dependency graph support |
| 2.1.7 | Initial task system |