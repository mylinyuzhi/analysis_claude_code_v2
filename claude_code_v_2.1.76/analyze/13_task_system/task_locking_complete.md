# Task Locking Complete Analysis (Claude Code 2.1.76)

> Complete source-level analysis of task file locking, concurrency control, and atomic operations.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Task System section)

Key functions in this document:
- `claimTask` (OT8) - Atomic task claim with locking - chunks.84.mjs:1781
- `claimTaskWithAgentBusyValidation` ($N9) - Claim with busy check - chunks.84.mjs:1831
- `unassignTeammateTasks` (ft) - Cleanup on agent shutdown - chunks.84.mjs:1883
- `lockOptions` (nD1) - Lock configuration - chunks.84.mjs:1916

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TASK LOCKING ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① Lock Acquisition                                                   │
│     ├─ EF6.lock(path, options) - proper-lockfile module             │
│     ├─ Options: retries=10, minTimeout=5ms, maxTimeout=100ms        │
│     └─ Returns unlock function to call in finally block              │
│                                                                       │
│  ② Critical Section                                                   │
│     ├─ Read task file (loadTask/DB)                                  │
│     ├─ Validate state (owner, status, dependencies)                  │
│     ├─ Update task (updateTask/WI)                                   │
│     └─ Write high watermark if needed                                │
│                                                                       │
│  ③ Lock Release                                                       │
│     ├─ Always in finally block                                       │
│     └─ Ensures lock released even on error                           │
│                                                                       │
│  ④ Concurrency Scenarios                                             │
│     ├─ Multiple agents claiming same task                            │
│     ├─ Task creation with ID generation                              │
│     └─ Dependency updates with reference cleanup                     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Lock Configuration

### Lock Options Object (nD1)

**What it does:**
Configures the proper-lockfile retry behavior for acquiring file locks.

**Why these values:**
- `retries: 10` - Reasonable retry count for transient conflicts
- `minTimeout: 5ms` - Quick initial retry
- `maxTimeout: 100ms` - Backoff ceiling to prevent long waits

```javascript
// ============================================
// nD1 - lockOptions
// Location: chunks.84.mjs:1916
// ============================================

// ORIGINAL (for source lookup):
nD1 = {
    retries: 10,
    minTimeout: 5,
    maxTimeout: 100
}

// READABLE (for understanding):
const lockOptions = {
    retries: 10,        // Retry up to 10 times
    minTimeout: 5,      // Initial retry delay: 5ms
    maxTimeout: 100     // Maximum retry delay: 100ms
};

// This means total wait time is at most ~550ms (exponential backoff)
// Before failing with lock acquisition error

// Mapping: nD1→lockOptions
```

---

## claimTask Function (OT8)

### Atomic Task Claim with Locking

**What it does:**
Atomically claims a task for an agent, ensuring no race conditions when multiple agents try to claim the same task.

**How it works:**
1. Acquire file lock on task file
2. Read current task state
3. Validate: task exists, not claimed, not completed, not blocked
4. Update task with new owner
5. Release lock (always in finally block)

**Key insight:**
The lock ensures atomic read-modify-write operations, preventing race conditions in multi-agent scenarios.

```javascript
// ============================================
// OT8 - claimTask
// Location: chunks.84.mjs:1781-1828
// ============================================

// ORIGINAL (for source lookup):
async function OT8(A, q, K, Y = {}) {
    let z = yF6(A, q);
    if (!await DB(A, q)) return {
        success: !1,
        reason: "task_not_found"
    };
    if (Y.checkAgentBusy) return $N9(A, q, K);
    let w;
    try {
        w = await EF6.lock(z, nD1);
        let O = await DB(A, q);
        if (!O) return {
            success: !1,
            reason: "task_not_found"
        };
        if (O.owner && O.owner !== K) return {
            success: !1,
            reason: "already_claimed",
            task: O
        };
        if (O.status === "completed") return {
            success: !1,
            reason: "already_resolved",
            task: O
        };
        let $ = await DX(A),
            H = new Set($.filter((M) => M.status !== "completed").map((M) => M.id)),
            j = O.blockedBy.filter((M) => H.has(M));
        if (j.length > 0) return {
            success: !1,
            reason: "blocked",
            task: O,
            blockedByTasks: j
        };
        return {
            success: !0,
            task: await WI(A, q, {
                owner: K
            })
        }
    } catch (O) {
        return k(`[Tasks] Failed to claim task ${q}: ${_1(O)}`), _6(O), {
            success: !1,
            reason: "task_not_found"
        }
    } finally {
        if (w) await w()
    }
}

// READABLE (for understanding):
async function claimTask(taskManager, taskId, owner, options = {}) {
    const taskFilePath = getTaskFilePath(taskManager, taskId);

    // Quick check without lock first
    if (!await loadTask(taskManager, taskId)) {
        return {
            success: false,
            reason: "task_not_found"
        };
    }

    // Route to busy-check variant if requested
    if (options.checkAgentBusy) {
        return claimTaskWithAgentBusyValidation(taskManager, taskId, owner);
    }

    let unlock;
    try {
        // ACQUIRE LOCK
        unlock = await fileLock.lock(taskFilePath, lockOptions);

        // Re-read task while holding lock (double-check pattern)
        const task = await loadTask(taskManager, taskId);
        if (!task) {
            return {
                success: false,
                reason: "task_not_found"
            };
        }

        // VALIDATION 1: Already claimed by another agent
        if (task.owner && task.owner !== owner) {
            return {
                success: false,
                reason: "already_claimed",
                task: task
            };
        }

        // VALIDATION 2: Task already completed
        if (task.status === "completed") {
            return {
                success: false,
                reason: "already_resolved",
                task: task
            };
        }

        // VALIDATION 3: Task blocked by incomplete dependencies
        const allTasks = await loadAllTasks(taskManager);
        const incompleteTaskIds = new Set(
            allTasks
                .filter(t => t.status !== "completed")
                .map(t => t.id)
        );
        const blockingDependencies = task.blockedBy.filter(id => incompleteTaskIds.has(id));

        if (blockingDependencies.length > 0) {
            return {
                success: false,
                reason: "blocked",
                task: task,
                blockedByTasks: blockingDependencies
            };
        }

        // ALL VALIDATIONS PASSED: Claim the task
        return {
            success: true,
            task: await updateTask(taskManager, taskId, {
                owner: owner
            })
        };

    } catch (error) {
        console.debug(`[Tasks] Failed to claim task ${taskId}: ${formatError(error)}`);
        logError(error);
        return {
            success: false,
            reason: "task_not_found"
        };
    } finally {
        // ALWAYS RELEASE LOCK
        if (unlock) await unlock();
    }
}

// Mapping: OT8→claimTask, A→taskManager, q→taskId, K→owner, Y→options,
//          yF6→getTaskFilePath, DB→loadTask, EF6.lock→fileLock.lock,
//          nD1→lockOptions, DX→loadAllTasks, WI→updateTask, k→console.debug,
//          _1→formatError, _6→logError, $N9→claimTaskWithAgentBusyValidation
```

---

## claimTaskWithAgentBusyValidation Function ($N9)

### Claim with Agent Busy Check

**What it does:**
Extended claim function that also checks if the agent is already busy with other tasks. Used in team mode to prevent one agent from accumulating too many tasks.

**How it works:**
1. Lock the task list directory (not just the task file)
2. Load all tasks to check agent's current workload
3. Validate: task exists, not claimed, not completed, not blocked
4. Additional validation: agent not busy with other tasks
5. Update task with new owner

**Key insight:**
Uses directory-level lock instead of file-level lock because it needs to atomically check all tasks for agent busy status.

```javascript
// ============================================
// $N9 - claimTaskWithAgentBusyValidation
// Location: chunks.84.mjs:1831-1880
// ============================================

// ORIGINAL (for source lookup):
async function $N9(A, q, K) {
    let Y = await wT8(A),
        z;
    try {
        z = await EF6.lock(Y, nD1);
        let _ = await DX(A),
            w = _.find((J) => J.id === q);
        if (!w) return {
            success: !1,
            reason: "task_not_found"
        };
        if (w.owner && w.owner !== K) return {
            success: !1,
            reason: "already_claimed",
            task: w
        };
        if (w.status === "completed") return {
            success: !1,
            reason: "already_resolved",
            task: w
        };
        let O = new Set(_.filter((J) => J.status !== "completed").map((J) => J.id)),
            $ = w.blockedBy.filter((J) => O.has(J));
        if ($.length > 0) return {
            success: !1,
            reason: "blocked",
            task: w,
            blockedByTasks: $
        };
        let H = _.filter((J) => J.status !== "completed" && J.owner === K && J.id !== q);
        if (H.length > 0) return {
            success: !1,
            reason: "agent_busy",
            task: w,
            busyWithTasks: H.map((J) => J.id)
        };
        return {
            success: !0,
            task: await WI(A, q, {
                owner: K
            })
        }
    } catch (_) {
        return k(`[Tasks] Failed to claim task ${q} with busy check: ${_1(_)}`), _6(_), {
            success: !1,
            reason: "task_not_found"
        }
    } finally {
        if (z) await z()
    }
}

// READABLE (for understanding):
async function claimTaskWithAgentBusyValidation(taskManager, taskId, owner) {
    const lockFilePath = await getLockFilePath(taskManager);
    let unlock;

    try {
        // ACQUIRE DIRECTORY-LEVEL LOCK
        unlock = await fileLock.lock(lockFilePath, lockOptions);

        // Load all tasks for busy check
        const allTasks = await loadAllTasks(taskManager);
        const targetTask = allTasks.find(t => t.id === taskId);

        if (!targetTask) {
            return {
                success: false,
                reason: "task_not_found"
            };
        }

        // VALIDATION 1: Already claimed by another agent
        if (targetTask.owner && targetTask.owner !== owner) {
            return {
                success: false,
                reason: "already_claimed",
                task: targetTask
            };
        }

        // VALIDATION 2: Task already completed
        if (targetTask.status === "completed") {
            return {
                success: false,
                reason: "already_resolved",
                task: targetTask
            };
        }

        // VALIDATION 3: Task blocked by incomplete dependencies
        const incompleteTaskIds = new Set(
            allTasks
                .filter(t => t.status !== "completed")
                .map(t => t.id)
        );
        const blockingDependencies = targetTask.blockedBy.filter(id => incompleteTaskIds.has(id));

        if (blockingDependencies.length > 0) {
            return {
                success: false,
                reason: "blocked",
                task: targetTask,
                blockedByTasks: blockingDependencies
            };
        }

        // VALIDATION 4: Agent already busy with other tasks
        const agentCurrentTasks = allTasks.filter(t =>
            t.status !== "completed" &&
            t.owner === owner &&
            t.id !== taskId
        );

        if (agentCurrentTasks.length > 0) {
            return {
                success: false,
                reason: "agent_busy",
                task: targetTask,
                busyWithTasks: agentCurrentTasks.map(t => t.id)
            };
        }

        // ALL VALIDATIONS PASSED: Claim the task
        return {
            success: true,
            task: await updateTask(taskManager, taskId, {
                owner: owner
            })
        };

    } catch (error) {
        console.debug(`[Tasks] Failed to claim task ${taskId} with busy check: ${formatError(error)}`);
        logError(error);
        return {
            success: false,
            reason: "task_not_found"
        };
    } finally {
        // ALWAYS RELEASE LOCK
        if (unlock) await unlock();
    }
}

// Mapping: $N9→claimTaskWithAgentBusyValidation, A→taskManager, q→taskId, K→owner,
//          wT8→getLockFilePath, EF6.lock→fileLock.lock, nD1→lockOptions,
//          DX→loadAllTasks, WI→updateTask, k→console.debug, _1→formatError, _6→logError
```

---

## Claim Result Types

### ClaimResult Interface

```typescript
interface ClaimResult {
    success: boolean;
    reason?: ClaimFailureReason;
    task?: Task;
    blockedByTasks?: string[];      // Present when reason = "blocked"
    busyWithTasks?: string[];       // Present when reason = "agent_busy"
}

type ClaimFailureReason =
    | "task_not_found"
    | "already_claimed"
    | "already_resolved"
    | "blocked"
    | "agent_busy";
```

### Reason Meanings

| Reason | Meaning | Recovery Action |
|--------|---------|-----------------|
| `task_not_found` | Task doesn't exist | Check task ID or create task |
| `already_claimed` | Another agent owns it | Wait for release or reassign |
| `already_resolved` | Task is completed | No action needed |
| `blocked` | Dependencies incomplete | Complete blocking tasks first |
| `agent_busy` | Agent has other tasks | Complete current tasks first |

---

## unassignTeammateTasks Function (ft)

### Cleanup on Agent Shutdown

**What it does:**
When an agent terminates, this function unassigns all tasks owned by that agent, returning them to pending status.

**How it works:**
1. Find all incomplete tasks owned by the agent
2. Update each task: clear owner, set status to pending
3. Return notification message for team notification

```javascript
// ============================================
// ft - unassignTeammateTasks
// Location: chunks.84.mjs:1883-1901
// ============================================

// ORIGINAL (for source lookup):
async function ft(A, q, K, Y) {
    let _ = (await DX(A)).filter(($) => $.status !== "completed" && ($.owner === q || $.owner === K));
    for (let $ of _) await WI(A, $.id, {
        owner: void 0,
        status: "pending"
    });
    if (_.length > 0) k(`[Tasks] Unassigned ${_.length} task(s) from ${K}`);
    let O = `${K} ${Y==="terminated"?"was terminated":"has shut down"}.`;
    if (_.length > 0) {
        let $ = _.map((H) => `#${H.id} "${H.subject}"`).join(", ");
        O += ` ${_.length} task(s) were unassigned: ${$}. Use TaskList to check availability and TaskUpdate with owner to reassign them to idle teammates.`
    }
    return {
        unassignedTasks: _.map(($) => ({
            id: $.id,
            subject: $.subject
        })),
        notificationMessage: O
    }
}

// READABLE (for understanding):
async function unassignTeammateTasks(taskManager, agentName, agentId, shutdownReason) {
    // Find all incomplete tasks owned by this agent
    const allTasks = await loadAllTasks(taskManager);
    const ownedTasks = allTasks.filter(t =>
        t.status !== "completed" &&
        (t.owner === agentName || t.owner === agentId)
    );

    // Unassign each task
    for (const task of ownedTasks) {
        await updateTask(taskManager, task.id, {
            owner: undefined,
            status: "pending"
        });
    }

    if (ownedTasks.length > 0) {
        console.debug(`[Tasks] Unassigned ${ownedTasks.length} task(s) from ${agentId}`);
    }

    // Build notification message
    let message = `${agentId} ${shutdownReason === "terminated" ? "was terminated" : "has shut down"}.`;

    if (ownedTasks.length > 0) {
        const taskList = ownedTasks
            .map(t => `#${t.id} "${t.subject}"`)
            .join(", ");
        message += ` ${ownedTasks.length} task(s) were unassigned: ${taskList}. Use TaskList to check availability and TaskUpdate with owner to reassign them to idle teammates.`;
    }

    return {
        unassignedTasks: ownedTasks.map(t => ({
            id: t.id,
            subject: t.subject
        })),
        notificationMessage: message
    };
}

// Mapping: ft→unassignTeammateTasks, A→taskManager, q→agentName, K→agentId,
//          Y→shutdownReason, DX→loadAllTasks, WI→updateTask, k→console.debug
```

---

## High Watermark Functions

### getHighWatermarkFilePath, readHighWaterMarkFile, writeHighWaterMark

```javascript
// ============================================
// High Watermark Functions
// Location: chunks.84.mjs:1565-1583
// ============================================

// ORIGINAL (for source lookup):
function X84(A) {
    return kF6(wR(A), _N9)
}
async function zT8(A) {
    let q = X84(A);
    try {
        let K = (await H84(q, "utf-8")).trim(),
            Y = parseInt(K, 10);
        return isNaN(Y) ? 0 : Y
    } catch {
        return 0
    }
}
async function P84(A, q) {
    let K = X84(A);
    await iD1(K, String(q))
}

// READABLE (for understanding):
// Get path to .highwatermark file
function getHighWatermarkFilePath(taskManager) {
    return pathJoin(getTaskDirectory(taskManager), ".highwatermark");
}

// Read current high watermark (max task ID)
async function readHighWaterMarkFile(taskManager) {
    const filePath = getHighWatermarkFilePath(taskManager);
    try {
        const content = (await readFile(filePath, "utf-8")).trim();
        const id = parseInt(content, 10);
        return isNaN(id) ? 0 : id;
    } catch {
        return 0;  // File doesn't exist or invalid
    }
}

// Write new high watermark
async function writeHighWaterMark(taskManager, value) {
    const filePath = getHighWatermarkFilePath(taskManager);
    await writeFile(filePath, String(value));
}

// Mapping: X84→getHighWatermarkFilePath, zT8→readHighWaterMarkFile,
//          P84→writeHighWaterMark, A→taskManager, _N9→".highwatermark",
//          wR→getTaskDirectory, kF6→pathJoin, H84→readFile, iD1→writeFile
```

---

## Cross-Module Integration

### Task System ↔ Agent Teams (30)

- Team-isolated task storage
- `claimTaskWithAgentBusyValidation` for team mode
- `unassignTeammateTasks` on agent shutdown

### Task System ↔ Tools (05)

- TaskCreate, TaskUpdate, TaskGet, TaskList tools
- File locking for concurrent access
- High watermark for ID generation

### Task System ↔ System Reminder (04)

- `task_status` attachment on status changes
- `task_claimed` attachment on claim
- `task_progress` attachment for updates

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Agent busy validation, high watermark persistence |
| 2.1.32 | Team task isolation, claim protocol |
| 2.1.7 | Initial structured task system |

---

## Symbol Validation Status

**Last validated:** 2026-03-27

| Symbol | Validated Location | Status |
|--------|-------------------|--------|
| OT8 (claimTask) | chunks.84.mjs:1781 | ✅ Correct |
| $N9 (claimTaskWithAgentBusyValidation) | chunks.84.mjs:1831 | ✅ Correct |
| ft (unassignTeammateTasks) | chunks.84.mjs:1883 | ✅ Correct |
| nD1 (lockOptions) | chunks.84.mjs:1916 | ✅ Correct |
| _N9 (HIGHWATERMARK_FILENAME) | chunks.84.mjs:1914 | ✅ Correct |
| X84 (getHighWatermarkFilePath) | chunks.84.mjs:1565 | ✅ Correct |
| zT8 (readHighWaterMarkFile) | chunks.84.mjs:1569 | ✅ Correct |
| P84 (writeHighWaterMark) | chunks.84.mjs:1580 | ✅ Correct |