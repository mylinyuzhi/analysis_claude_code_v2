# System Reminder Integration Complete (Claude Code 2.1.76)

> Complete source-level restoration of subagent and background agent integration with the system reminder system, including attachment generation, polling mechanism, and state management.

**Updated: 2026-03-27**

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `_uY` - Assemble all attachments — `chunks.147.mjs:3`
- `suY` - Get unified tasks attachment — `chunks.147.mjs:1033`
- `wY4` - Poll task outputs — `chunks.90.mjs:3058`
- `OY4` - Update task state — `chunks.90.mjs:3087`
- `Hz` - Wrap attachment producer — `chunks.147.mjs:20`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER INTEGRATION ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌──────────────────────────────┐
                         │     LLM Message Loop (Yh)     │
                         │   Before each API call:      │
                         │   _uY (assembleAttachments)   │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        assembleAllAttachments (_uY)                          │
│                        Location: chunks.147.mjs:3-18                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Group 1: Lead agent only (H=false)                                         │
│  ├─ at_mentioned_files (RuY)                                                │
│  ├─ mcp_resources (SuY)                                                     │
│  └─ agent_mentions (huY)                                                    │
│                                                                              │
│  Group 2: All agents                                                         │
│  ├─ date_change (fuY)                                                       │
│  ├─ ultrathink_effort (TuY)                                                 │
│  ├─ deferred_tools_delta (xE1)                                              │
│  ├─ mcp_instructions_delta (uE1)                                            │
│  ├─ changed_files (CuY)                                                     │
│  ├─ nested_memory (IuY)                                                     │
│  ├─ dynamic_skill (BuY)                                                     │
│  ├─ skill_listing (guY)                                                     │
│  ├─ ultra_claude_md (VuU)                                                   │
│  ├─ plan_mode (DuY)                                                         │
│  ├─ plan_mode_exit (XuY)                                                    │
│  ├─ auto_mode (ZuY)                                                         │
│  ├─ auto_mode_exit (GuY)                                                    │
│  ├─ todo_reminders (auY/ruY)                                                │
│  ├─ teammate_mailbox (euY) [if session_memory]                              │
│  ├─ team_context (AmY) [if session_memory]                                  │
│  ├─ agent_pending_messages ($uY)                                            │
│  └─ critical_system_reminder (vuY)                                          │
│                                                                              │
│  Group 3: Lead agent only (H=true)                                          │
│  ├─ ide_selection (kuY)                                                     │
│  ├─ ide_opened_file (LuY)                                                   │
│  ├─ output_style (NuY)                                                      │
│  ├─ diagnostics (cuY)                                                       │
│  ├─ lsp_diagnostics (luY)                                                   │
│  ├─ unified_tasks (suY) ← BACKGROUND AGENT INTEGRATION                      │
│  ├─ async_hook_responses (tuY)                                              │
│  ├─ token_usage (qmY)                                                       │
│  ├─ budget_usd (YmY)                                                        │
│  ├─ output_token_usage (KmY)                                                │
│  ├─ verify_plan_reminder (_mY)                                              │
│  └─ queued_commands (OuY)                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │  Attachment Array for LLM    │
                         │  Each attachment is injected │
                         │  as system reminder content  │
                         └──────────────────────────────┘
```

---

## Core Function: assembleAllAttachments (_uY)

**What it does:** Orchestrates all attachment producers and returns a flattened array of attachments for the LLM context.

**How it works:**

```javascript
// ============================================
// _uY - assembleAllAttachments - Main attachment orchestrator
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(),
        O = setTimeout((W) => W.abort(), 1000, w),
        $ = {
            ...q,
            abortController: w
        },
        H = !q.agentId,
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)), Hz("mcp_resources", () => SuY(A, $)), Hz("agent_mentions", () => Promise.resolve(huY(A, q.options.agentDefinitions.activeAgents))), ...[]] : [],
        J = await Promise.all(j),
        M = [Hz("date_change", () => Promise.resolve(fuY())), Hz("ultrathink_effort", () => Promise.resolve(TuY(A))), Hz("deferred_tools_delta", () => Promise.resolve(xE1(q.options.tools, q.options.mainLoopModel, z))), Hz("mcp_instructions_delta", () => Promise.resolve(uE1(q.options.mcpClients, q.options.tools, q.options.mainLoopModel, z))), Hz("changed_files", () => CuY($)), Hz("nested_memory", () => IuY($)), Hz("dynamic_skill", () => BuY($)), Hz("skill_listing", () => guY($)), Hz("ultra_claude_md", async () => VuU(z)), Hz("plan_mode", () => DuY(z, q)), Hz("plan_mode_exit", () => XuY(q)), Hz("auto_mode", () => ZuY(z, q)), Hz("auto_mode_exit", () => GuY(q)), Hz("todo_reminders", () => r$() ? auY(z, q) : ruY(z, q)), ...E7() ? [..._ === "session_memory" ? [] : [Hz("teammate_mailbox", async () => euY(q))], Hz("team_context", async () => AmY(z ?? []))] : [], Hz("agent_pending_messages", async () => $uY(q)), Hz("critical_system_reminder", () => Promise.resolve(vuY(q)))],
        D = H ? [Hz("ide_selection", async () => kuY(K, q)), Hz("ide_opened_file", async () => LuY(K, q)), Hz("output_style", async () => Promise.resolve(NuY())), Hz("diagnostics", async () => cuY(q)), Hz("lsp_diagnostics", async () => luY(q)), Hz("unified_tasks", async () => suY(q)), Hz("async_hook_responses", async () => tuY()), Hz("token_usage", async () => Promise.resolve(qmY(z ?? [], q.options.mainLoopModel))), Hz("budget_usd", async () => Promise.resolve(YmY(q.options.maxBudgetUsd))), Hz("output_token_usage", async () => Promise.resolve(KmY())), Hz("verify_plan_reminder", async () => _mY(z, q)), Hz("queued_commands", () => OuY(Y))] : [],
        [X, P] = await Promise.all([Promise.all(M), Promise.all(D)]);
    return clearTimeout(O), [...J.flat(), ...X.flat(), ...P.flat()].filter((W) => W !== void 0 && W !== null)
}

// READABLE (for understanding):
async function assembleAllAttachments(
    atMentionedFiles,     // Files mentioned with @
    toolUseContext,       // Context for tool execution
    ideContext,           // IDE-specific context
    queuedCommands,       // Commands waiting to be processed
    messages,             // Message history
    sessionMemoryType     // Type of session memory
) {
    // Step 1: Check if attachments are disabled
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // Step 2: Create timeout abort controller (1 second limit)
    let abortController = new AbortController();
    let timeoutId = setTimeout((ac) => ac.abort(), 1000, abortController);

    // Step 3: Create derived context with abort controller
    let derivedContext = {
        ...toolUseContext,
        abortController: abortController
    };

    // Step 4: Determine if this is the lead agent
    // Lead agent = no agentId (main conversation)
    let isLeadAgent = !toolUseContext.agentId;

    // Step 5: Group 1 - At-mentioned files (lead agent only with files)
    let group1 = atMentionedFiles ? [
        wrapProducer("at_mentioned_files", () => getAtMentionedFilesAttachments(atMentionedFiles, derivedContext)),
        wrapProducer("mcp_resources", () => getMcpResourcesAttachments(atMentionedFiles, derivedContext)),
        wrapProducer("agent_mentions", () => Promise.resolve(getAgentMentionsAttachments(atMentionedFiles, toolUseContext.options.agentDefinitions.activeAgents)))
    ] : [];

    // Step 6: Execute Group 1 first (allows at-mentions to load MCP servers)
    let group1Results = await Promise.all(group1);

    // Step 7: Group 2 - All agents get these attachments
    let group2 = [
        wrapProducer("date_change", () => Promise.resolve(getDateChangeAttachment())),
        wrapProducer("ultrathink_effort", () => Promise.resolve(getUltrathinkEffortAttachment(atMentionedFiles))),
        wrapProducer("deferred_tools_delta", () => Promise.resolve(getDeferredToolsDelta(toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages))),
        wrapProducer("mcp_instructions_delta", () => Promise.resolve(getMcpInstructionsDelta(toolUseContext.options.mcpClients, toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages))),
        wrapProducer("changed_files", () => getChangedFilesAttachments(derivedContext)),
        wrapProducer("nested_memory", () => getNestedMemoryAttachments(derivedContext)),
        wrapProducer("dynamic_skill", () => getDynamicSkillAttachments(derivedContext)),
        wrapProducer("skill_listing", () => getSkillListingAttachments(derivedContext)),
        wrapProducer("ultra_claude_md", async () => getUltraClaudeMdAttachment(messages)),
        wrapProducer("plan_mode", () => getPlanModeAttachment(messages, toolUseContext)),
        wrapProducer("plan_mode_exit", () => getPlanModeExitAttachment(toolUseContext)),
        wrapProducer("auto_mode", () => getAutoModeAttachment(messages, toolUseContext)),
        wrapProducer("auto_mode_exit", () => getAutoModeExitAttachment(toolUseContext)),
        wrapProducer("todo_reminders", () => isSessionMemory() ? getSessionMemoryTodos(messages, toolUseContext) : getStandardTodos(messages, toolUseContext)),
        // Teammate mailbox (if session_memory mode and not in session_memory itself)
        ...(isSessionMemoryMode() ? [
            ...(sessionMemoryType === "session_memory" ? [] : [wrapProducer("teammate_mailbox", async () => getTeammateMailboxAttachments(toolUseContext))]),
            wrapProducer("team_context", async () => getTeamContextAttachments(messages ?? []))
        ] : []),
        wrapProducer("agent_pending_messages", async () => getAgentPendingMessages(toolUseContext)),
        wrapProducer("critical_system_reminder", () => Promise.resolve(getCriticalSystemReminder(toolUseContext)))
    ];

    // Step 8: Group 3 - Lead agent only attachments
    let group3 = isLeadAgent ? [
        wrapProducer("ide_selection", async () => getIdeSelectionAttachments(ideContext, toolUseContext)),
        wrapProducer("ide_opened_file", async () => getIdeOpenedFileAttachments(ideContext, toolUseContext)),
        wrapProducer("output_style", async () => Promise.resolve(getOutputStyleAttachment())),
        wrapProducer("diagnostics", async () => getDiagnosticsAttachments(toolUseContext)),
        wrapProducer("lsp_diagnostics", async () => getLspDiagnosticsAttachments(toolUseContext)),
        wrapProducer("unified_tasks", async () => getUnifiedTasksAttachment(toolUseContext)),  // ← BACKGROUND AGENTS
        wrapProducer("async_hook_responses", async () => getAsyncHookResponseAttachments()),
        wrapProducer("token_usage", async () => Promise.resolve(getTokenUsageAttachment(messages ?? [], toolUseContext.options.mainLoopModel))),
        wrapProducer("budget_usd", async () => Promise.resolve(getBudgetUsdAttachment(toolUseContext.options.maxBudgetUsd))),
        wrapProducer("output_token_usage", async () => Promise.resolve(getOutputTokenUsageAttachment())),
        wrapProducer("verify_plan_reminder", async () => getVerifyPlanReminderAttachment(messages, toolUseContext)),
        wrapProducer("queued_commands", () => getQueuedCommandsAttachments(queuedCommands))
    ] : [];

    // Step 9: Execute Groups 2 and 3 in parallel
    let [group2Results, group3Results] = await Promise.all([
        Promise.all(group2),
        Promise.all(group3)
    ]);

    // Step 10: Clear timeout and return flattened results
    clearTimeout(timeoutId);
    return [...group1Results.flat(), ...group2Results.flat(), ...group3Results.flat()]
        .filter((attachment) => attachment !== undefined && attachment !== null);
}

// Mapping: _uY→assembleAllAttachments, A→atMentionedFiles, q→toolUseContext, K→ideContext,
//          Y→queuedCommands, z→messages, _→sessionMemoryType, w→abortController,
//          H→isLeadAgent, Hz→wrapProducer, suY→getUnifiedTasksAttachment
```

**Why this approach:**
- **Parallel execution**: Groups 2 and 3 run in parallel for performance
- **Timeout protection**: 1-second timeout prevents hanging on slow attachment producers
- **Lead agent distinction**: Only the lead agent gets UI-related attachments
- **Conditional attachments**: Teammate mailbox only in session memory mode

---

## Core Function: wrapProducer (Hz)

**What it does:** Wraps attachment producers with timing, error handling, and telemetry.

```javascript
// ============================================
// Hz - wrapProducer - Wrap attachment producer with telemetry
// Location: chunks.147.mjs:20-46
// ============================================

// ORIGINAL (for source lookup):
async function Hz(A, q) {
    let K = Date.now();
    try {
        let Y = await q(),
            z = Date.now() - K;
        if (Math.random() < 0.05) {
            let _ = Y.filter((w) => w !== void 0 && w !== null).reduce((w, O) => {
                return w + B6(O).length
            }, 0);
            d("tengu_attachment_compute_duration", {
                label: A,
                duration_ms: z,
                attachment_size_bytes: _,
                attachment_count: Y.length
            })
        }
        return Y
    } catch (Y) {
        let z = Date.now() - K;
        if (Math.random() < 0.05) d("tengu_attachment_compute_duration", {
            label: A,
            duration_ms: z,
            error: !0
        });
        return _6(Y), jV(`Attachment error in ${A}`, Y), []
    }
}

// READABLE (for understanding):
async function wrapProducer(label, producer) {
    let startTime = Date.now();

    try {
        let attachments = await producer();
        let duration = Date.now() - startTime;

        // 5% sampling for telemetry
        if (Math.random() < 0.05) {
            // Calculate total size of attachments
            let totalSize = attachments
                .filter((a) => a !== undefined && a !== null)
                .reduce((sum, a) => sum + JSON.stringify(a).length, 0);

            sendTelemetry("tengu_attachment_compute_duration", {
                label: label,
                duration_ms: duration,
                attachment_size_bytes: totalSize,
                attachment_count: attachments.length
            });
        }

        return attachments;

    } catch (error) {
        let duration = Date.now() - startTime;

        // 5% sampling for error telemetry
        if (Math.random() < 0.05) {
            sendTelemetry("tengu_attachment_compute_duration", {
                label: label,
                duration_ms: duration,
                error: true
            });
        }

        // Log error and return empty array (don't fail the entire attachment assembly)
        logError(error);
        logAttachmentError(`Attachment error in ${label}`, error);
        return [];
    }
}

// Mapping: Hz→wrapProducer, A→label, q→producer, K→startTime, Y→attachments,
//          z→duration, d→sendTelemetry, B6→JSON.stringify, _6→logError, jV→logAttachmentError
```

**Why this approach:**
- **Graceful degradation**: Errors don't break other attachment producers
- **Telemetry sampling**: 5% sampling reduces overhead while providing insights
- **Timing metrics**: Helps identify slow attachment producers

---

## Core Function: getUnifiedTasksAttachment (suY)

**What it does:** Polls all background tasks and returns task_status attachments for the LLM context.

```javascript
// ============================================
// suY - getUnifiedTasksAttachment - Build task attachments
// Location: chunks.147.mjs:1033-1048
// ============================================

// ORIGINAL (for source lookup):
async function suY(A) {
    let q = A.getAppState(),
        {
            attachments: K,
            updatedTaskOffsets: Y,
            evictedTaskIds: z
        } = await wY4(q);
    return OY4(A.setAppState, Y, z), K.map((_) => ({
        type: "task_status",
        taskId: _.taskId,
        taskType: _.taskType,
        status: _.status,
        description: _.description,
        deltaSummary: _.deltaSummary
    }))
}

// READABLE (for understanding):
async function getUnifiedTasksAttachment(toolUseContext) {
    // Step 1: Get current app state
    let appState = toolUseContext.getAppState();

    // Step 2: Poll all task outputs
    let {
        attachments,           // Task status attachments to add
        updatedTaskOffsets,    // Tasks with new output (offset changed)
        evictedTaskIds        // Tasks to remove (terminal + notified)
    } = await pollTaskOutputs(appState);  // wY4

    // Step 3: Update task state (offsets and evictions)
    updateTaskState(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);  // OY4

    // Step 4: Map attachments to LLM-friendly format
    return attachments.map((attachment) => ({
        type: "task_status",
        taskId: attachment.taskId,
        taskType: attachment.taskType,
        status: attachment.status,
        description: attachment.description,
        deltaSummary: attachment.deltaSummary
    }));
}

// Mapping: suY→getUnifiedTasksAttachment, A→toolUseContext, q→appState,
//          K→attachments, Y→updatedTaskOffsets, z→evictedTaskIds,
//          wY4→pollTaskOutputs, OY4→updateTaskState
```

**Why this approach:**
- **Single poll operation**: Reads all task outputs in one pass
- **State update side effect**: Updates offsets and evictions atomically
- **Attachment transformation**: Converts internal format to LLM-friendly format

---

## Core Function: pollTaskOutputs (wY4)

**What it does:** Iterates all tasks, reads output deltas for running tasks, and identifies tasks to evict.

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll output files for all running tasks
// Location: chunks.90.mjs:3058-3085
// ============================================

// ORIGINAL (for source lookup):
async function wY4(A) {
    let q = [],
        K = {},
        Y = [],
        z = A.tasks ?? {};
    for (let _ of Object.values(z)) {
        if (_.notified) switch (_.status) {
            case "completed":
            case "failed":
            case "killed":
                Y.push(_.id);
                continue;
            case "pending":
                continue;
            case "running":
                break
        }
        if (_.status === "running") {
            let w = await Z97(_.id, _.outputOffset);
            if (w.content) K[_.id] = w.newOffset
        }
    }
    return {
        attachments: q,
        updatedTaskOffsets: K,
        evictedTaskIds: Y
    }
}

// READABLE (for understanding):
async function pollTaskOutputs(appState) {
    let attachments = [];              // Status attachments (currently unused here)
    let updatedTaskOffsets = {};       // Tasks with new output
    let evictedTaskIds = [];           // Tasks to remove from state
    let tasks = appState.tasks ?? {};

    for (let task of Object.values(tasks)) {
        // PHASE 1: Check for eviction candidates
        // A task is evictable if: notified AND terminal status
        if (task.notified) {
            switch (task.status) {
                case "completed":
                case "failed":
                case "killed":
                    // Terminal + notified → evict
                    evictedTaskIds.push(task.id);
                    continue;  // Skip to next task
                case "pending":
                    // Pending tasks are not processed
                    continue;
                case "running":
                    // Running tasks continue to output reading
                    break;
            }
        }

        // PHASE 2: Read output delta for running tasks
        if (task.status === "running") {
            let result = await readOutputFileDelta(task.id, task.outputOffset);  // Z97

            // Only record if there's new content
            if (result.content) {
                updatedTaskOffsets[task.id] = result.newOffset;
            }
        }
    }

    return {
        attachments: attachments,
        updatedTaskOffsets: updatedTaskOffsets,
        evictedTaskIds: evictedTaskIds
    };
}

// Mapping: wY4→pollTaskOutputs, A→appState, q→attachments, K→updatedTaskOffsets,
//          Y→evictedTaskIds, z→tasks, _→task, w→result, Z97→readOutputFileDelta
```

**Why this approach:**
- **Single pass**: Processes all tasks in one iteration
- **Eviction detection**: Identifies tasks ready for removal (terminal + notified)
- **Incremental reading**: Only reads new output since last offset
- **Memory efficient**: Only stores offset changes, not full content

---

## Core Function: updateTaskState (OY4)

**What it does:** Applies polling results to state atomically with optimization.

```javascript
// ============================================
// OY4 - updateTaskState - Apply polling results to state
// Location: chunks.90.mjs:3087-3109
// ============================================

// ORIGINAL (for source lookup):
function OY4(A, q, K) {
    let Y = Object.keys(q);
    if (Y.length === 0 && K.length === 0) return;
    A((z) => {
        let _ = !1,
            w = {
                ...z.tasks
            };
        for (let O of Y) {
            let $ = w[O];
            if ($?.status === "running") w[O] = {
                ...$,
                outputOffset: q[O]
            }, _ = !0
        }
        for (let O of K)
            if (w[O]) delete w[O], _ = !0;
        return _ ? {
            ...z,
            tasks: w
        } : z
    })
}

// READABLE (for understanding):
function updateTaskState(setAppState, updatedTaskOffsets, evictedTaskIds) {
    let offsetTaskIds = Object.keys(updatedTaskOffsets);

    // Early exit if nothing to update
    if (offsetTaskIds.length === 0 && evictedTaskIds.length === 0) {
        return;
    }

    setAppState((state) => {
        let hasChanges = false;
        let tasks = { ...state.tasks };  // Shallow copy

        // PHASE 1: Update offsets for running tasks
        for (let taskId of offsetTaskIds) {
            let task = tasks[taskId];
            // Double-check task is still running (could have changed during poll)
            if (task?.status === "running") {
                tasks[taskId] = {
                    ...task,
                    outputOffset: updatedTaskOffsets[taskId]
                };
                hasChanges = true;
            }
        }

        // PHASE 2: Remove evicted tasks
        for (let taskId of evictedTaskIds) {
            if (tasks[taskId]) {
                delete tasks[taskId];
                hasChanges = true;
            }
        }

        // Only return new state if changes were made
        // This prevents unnecessary re-renders
        return hasChanges
            ? { ...state, tasks: tasks }
            : state;  // Same reference = no re-render
    });
}

// Mapping: OY4→updateTaskState, A→setAppState, q→updatedTaskOffsets, K→evictedTaskIds,
//          Y→offsetTaskIds, z→state, _→hasChanges, w→tasks, O→taskId, $→task
```

**Why this approach:**
- **Reference equality optimization**: Returns same state if no changes (prevents re-renders)
- **Double-check status**: Verifies task is still running before updating offset
- **Atomic updates**: All changes applied in single state update
- **Early exit**: Avoids unnecessary state updates

---

## Attachment Types

### task_status

**When injected:** When a task reaches terminal state (completed, failed, killed).

**Structure:**
```typescript
interface TaskStatusAttachment {
    type: "task_status";
    taskId: string;        // Unique task ID (e.g., "ab3k7m9p2")
    taskType: string;      // "local_agent", "local_bash", etc.
    status: string;        // "completed" | "failed" | "killed"
    description: string;   // Human-readable description
    deltaSummary?: string; // Summary of what was accomplished
}
```

**Example LLM context:**
```xml
<attachment type="task_status">
  <task_id>a5x2k9m3</task_id>
  <task_type>local_agent</task_type>
  <status>completed</status>
  <description>Search codebase for createTaskId usages</description>
  <delta_summary>Found 15 files with createTaskId references, including core ID generation in chunks.41.mjs</delta_summary>
</attachment>
```

### task_progress (Future)

**Note:** Current implementation does not generate task_progress attachments. The `attachments` array from `pollTaskOutputs` is currently empty and would need enhancement to support progress attachments.

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER DATA FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

LLM Message Loop (Yh)
        │
        ├── Before each API call ───────────────────────────────────────────────┐
        │                                                                       ▼
        │                                               assembleAllAttachments (_uY)
        │                                                       │
        │                                                       ├── Group 1 (at-mentions)
        │                                                       ├── Group 2 (all agents)
        │                                                       └── Group 3 (lead agent)
        │                                                                    │
        │                                                                    ▼
        │                                                getUnifiedTasksAttachment (suY)
        │                                                        │
        │                                                        ├── pollTaskOutputs (wY4)
        │                                                        │   │
        │                                                        │   ├── For running tasks:
        │                                                        │   │   └─ readOutputFileDelta (Z97)
        │                                                        │   │       → updatedTaskOffsets
        │                                                        │   │
        │                                                        │   └── For terminal+notified:
        │                                                        │       → evictedTaskIds
        │                                                        │
        │                                                        └── updateTaskState (OY4)
        │                                                            • Update outputOffset
        │                                                            • Remove evicted tasks
        │
        ▼
LLM receives task_status attachments in system reminder
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `_uY` | assembleAllAttachments | chunks.147.mjs:3 | ✓ **VERIFIED** |
| `Hz` | wrapProducer | chunks.147.mjs:20 | ✓ **VERIFIED** |
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | ✓ **VERIFIED** |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ **VERIFIED** |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | ✓ **VERIFIED** |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325 | ✓ **VERIFIED** |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✓ **VERIFIED** |
| `$O` | flushOutputBuffer | chunks.41.mjs:2320 | ✓ **VERIFIED** |

---

## Related Documents

- [ui_interaction_complete.md](./ui_interaction_complete.md) - UI interaction
- [key_algorithms_deep_dive.md](./key_algorithms_deep_dive.md) - Algorithm analysis
- [cross_feature_linkages_complete.md](./cross_feature_linkages_complete.md) - Feature integrations
- [../04_system_reminder/attachment_producers.md](../04_system_reminder/attachment_producers.md) - Attachment producers