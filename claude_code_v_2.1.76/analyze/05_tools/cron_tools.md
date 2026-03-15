# Cron Tools - Deep Analysis (Claude Code 2.1.76)

> New in v2.1.76. Complete analysis of CronCreate, CronDelete, and CronList tools — session-scoped scheduled task execution that survives compaction and integrates with the /loop slash command.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents section)

Key functions in this document:
- `CronCreateTool` - CronCreate tool definition - chunks.89.mjs
- `CronDeleteTool` - CronDelete tool definition - chunks.89.mjs
- `CronListTool` - CronList tool definition - chunks.89.mjs
- `cronScheduler` - Internal cron scheduler implementation - chunks.193.mjs
- `registerCronJob` - Registers a cron job in session state - chunks.193.mjs
- `executeCronJob` - Executes a scheduled cron job - chunks.193.mjs
- `parseCronExpression` - Parses cron schedule strings - chunks.193.mjs

---

## Architecture Overview

```
/loop slash command                LLM tool_use
    │                                   │
    │ Creates recurring schedule        │ CronCreate tool
    ▼                                   ▼
CronCreate(schedule, prompt, ...)
    │
    ▼
cronScheduler.register(jobId, schedule, prompt)
    │
    ├── Session state: cronJobs Map
    │     jobId → { schedule, prompt, lastRun, nextRun, status }
    │
    └── Survives compaction via system reminder injection
           │
           ▼
       Scheduled trigger fires
           │
           ▼
       executeCronJob(jobId)
           │
           ├── [type: agent] → spawn subagent with prompt
           └── [type: bash]  → run bash command
                   │
                   ▼
               TaskOutput (jobId, result)
                       │
                       ▼
                   Next scheduled run registered
```

---

## 1. Why Cron Tools

### Problem they solve

Before cron tools, recurring tasks required either:
1. Manual user re-invocation each time
2. A background agent that sleeps in a loop (wasteful, fragile under compaction)
3. External cron + `claude` CLI (requires separate infrastructure)

**Cron tools** provide session-scoped recurring execution that:
- Survives context compaction (the schedule is preserved in system reminder state)
- Runs at wall-clock intervals without a polling loop
- Integrates naturally with the agent loop (fires as tool calls, not external signals)
- Cancels automatically when the session ends

### /loop Command Integration

The `/loop` slash command is the primary user-facing interface for cron tools:

```
/loop 5m /review-prs
/loop 30s check build status
/loop 1h summarize today's work
```

Internally, `/loop` calls `CronCreate` with the appropriate interval and prompt. The LLM can also call `CronCreate` directly for programmatic scheduling.

---

## 2. CronCreate Tool

### CronCreateTool - Register a Recurring Schedule

**What it does:** Creates a new scheduled cron job that fires at the specified interval. Returns a `jobId` that can be used to cancel the job later.

**Input schema:**

```javascript
// ============================================
// CronCreateTool - Schedule registration
// Location: chunks.89.mjs
// ============================================

// READABLE (for understanding):
const CronCreateTool = {
    name: "CronCreate",
    isConcurrencySafe: true,
    isReadOnly: false,

    get inputSchema() {
        return z.strictObject({
            schedule: z.string()
                .describe([
                    "Cron schedule expression OR simple interval string.",
                    "Examples:",
                    "  '5m'        → every 5 minutes",
                    "  '30s'       → every 30 seconds",
                    "  '1h'        → every hour",
                    "  '0 * * * *' → standard cron (every hour at minute 0)",
                    "  '*/5 * * * *' → every 5 minutes via cron syntax"
                ].join("\n")),

            prompt: z.string()
                .describe("The prompt or command to execute on each scheduled run."),

            type: z.enum(["agent", "bash"])
                .optional()
                .default("agent")
                .describe([
                    "Execution type:",
                    "  'agent' → spawn a subagent with the prompt (default)",
                    "  'bash'  → run the prompt as a bash command"
                ].join("\n")),

            name: z.string()
                .optional()
                .describe("Human-readable name for this cron job. Shown in CronList output."),

            max_runs: z.number()
                .optional()
                .describe("Maximum number of times to run. Omit for unlimited recurring execution."),

            start_at: z.string()
                .optional()
                .describe("ISO 8601 timestamp for first run. If omitted, runs immediately at first interval."),
        });
    },

    get outputSchema() {
        return z.object({
            jobId: z.string().describe("Unique identifier for this cron job. Use with CronDelete."),
            nextRun: z.string().describe("ISO 8601 timestamp of the next scheduled run."),
            schedule: z.string().describe("The parsed schedule string.")
        });
    },

    async checkPermissions() {
        // Cron tools auto-approve — same trust model as Agent tool
        return { allowed: true };
    },

    async call({ schedule, prompt, type, name, max_runs, start_at }, context) {
        let jobId = generateUUID();
        let parsedSchedule = parseCronExpression(schedule);
        let nextRun = computeNextRun(parsedSchedule, start_at ? new Date(start_at) : new Date());

        // Register in session state
        await cronScheduler.register({
            jobId,
            schedule: parsedSchedule,
            prompt,
            type: type ?? "agent",
            name: name ?? `cron-${jobId.slice(0, 8)}`,
            maxRuns: max_runs ?? Infinity,
            runsCompleted: 0,
            nextRun,
            status: "active"
        });

        return {
            data: {
                jobId,
                nextRun: nextRun.toISOString(),
                schedule: parsedSchedule.humanReadable
            }
        };
    }
};
```

**Key design decisions:**

1. **Simple interval strings** (`5m`, `30s`, `1h`) — Users and LLMs don't need to know cron syntax for common cases. The parser handles both formats.

2. **agent vs bash type** — Agent runs spawn a full subagent with tool access. Bash runs are simpler and faster for commands that don't need tool calls.

3. **max_runs** — Supports one-time deferred execution (`max_runs: 1`) as well as infinite recurring tasks.

---

## 3. CronDelete Tool

### CronDeleteTool - Cancel a Scheduled Job

**What it does:** Cancels a cron job by its `jobId`. The job stops firing on its next scheduled occurrence.

```javascript
// ============================================
// CronDeleteTool - Job cancellation
// Location: chunks.89.mjs
// ============================================

// READABLE (for understanding):
const CronDeleteTool = {
    name: "CronDelete",
    isConcurrencySafe: true,
    isReadOnly: false,

    get inputSchema() {
        return z.strictObject({
            jobId: z.string()
                .describe("The job ID returned by CronCreate. Use CronList to find job IDs.")
        });
    },

    get outputSchema() {
        return z.object({
            success: z.boolean(),
            jobId: z.string(),
            message: z.string()
        });
    },

    async call({ jobId }, context) {
        let deleted = await cronScheduler.delete(jobId);

        if (!deleted) {
            return {
                data: {
                    success: false,
                    jobId,
                    message: `Job ${jobId} not found or already completed.`
                }
            };
        }

        return {
            data: {
                success: true,
                jobId,
                message: `Cron job ${jobId} cancelled.`
            }
        };
    }
};
```

---

## 4. CronList Tool

### CronListTool - List All Active Jobs

**What it does:** Returns all active cron jobs in the current session, including their schedule, status, last run time, and next run time.

```javascript
// ============================================
// CronListTool - Job listing
// Location: chunks.89.mjs
// ============================================

// READABLE (for understanding):
const CronListTool = {
    name: "CronList",
    isConcurrencySafe: true,
    isReadOnly: true,

    get inputSchema() {
        return z.strictObject({
            include_completed: z.boolean()
                .optional()
                .default(false)
                .describe("If true, include completed/cancelled jobs in the output.")
        });
    },

    get outputSchema() {
        return z.object({
            jobs: z.array(z.object({
                jobId: z.string(),
                name: z.string(),
                schedule: z.string(),
                type: z.enum(["agent", "bash"]),
                status: z.enum(["active", "completed", "cancelled", "error"]),
                runsCompleted: z.number(),
                maxRuns: z.number().nullable(),
                nextRun: z.string().nullable(),
                lastRun: z.string().nullable(),
                lastResult: z.string().nullable()
            }))
        });
    },

    async call({ include_completed }, context) {
        let allJobs = await cronScheduler.listJobs();

        let jobs = include_completed
            ? allJobs
            : allJobs.filter(job => job.status === "active");

        return {
            data: {
                jobs: jobs.map(job => ({
                    jobId: job.jobId,
                    name: job.name,
                    schedule: job.schedule.humanReadable,
                    type: job.type,
                    status: job.status,
                    runsCompleted: job.runsCompleted,
                    maxRuns: job.maxRuns === Infinity ? null : job.maxRuns,
                    nextRun: job.nextRun?.toISOString() ?? null,
                    lastRun: job.lastRun?.toISOString() ?? null,
                    lastResult: job.lastResult ?? null
                }))
            }
        };
    }
};
```

---

## 5. Schedule Expression Parser

### parseCronExpression - Dual-format schedule parsing

**What it does:** Accepts either simple interval strings (`5m`, `30s`, `1h`) or standard 5-field cron expressions and normalizes them to an internal representation.

```javascript
// ============================================
// parseCronExpression - Schedule parsing
// Location: chunks.193.mjs
// ============================================

// READABLE (for understanding):
function parseCronExpression(schedule) {
    // === Simple interval format ===
    let simpleMatch = schedule.match(/^(\d+)(s|m|h|d)$/);
    if (simpleMatch) {
        let value = parseInt(simpleMatch[1]);
        let unit = simpleMatch[2];

        let intervalMs = {
            's': value * 1000,
            'm': value * 60 * 1000,
            'h': value * 60 * 60 * 1000,
            'd': value * 24 * 60 * 60 * 1000,
        }[unit];

        let unitNames = { 's': 'second', 'm': 'minute', 'h': 'hour', 'd': 'day' };
        let unitName = unitNames[unit];

        return {
            type: 'interval',
            intervalMs,
            humanReadable: `every ${value} ${unitName}${value !== 1 ? 's' : ''}`
        };
    }

    // === Standard cron format ===
    let fields = schedule.split(/\s+/);
    if (fields.length !== 5) {
        throw new Error(`Invalid schedule: "${schedule}". Expected "5m", "1h", or 5-field cron expression.`);
    }

    // Validate each field (minute, hour, day, month, weekday)
    let [minute, hour, day, month, weekday] = fields;
    validateCronField(minute, 0, 59, 'minute');
    validateCronField(hour, 0, 23, 'hour');
    validateCronField(day, 1, 31, 'day');
    validateCronField(month, 1, 12, 'month');
    validateCronField(weekday, 0, 6, 'weekday');

    return {
        type: 'cron',
        fields: { minute, hour, day, month, weekday },
        humanReadable: describeCronSchedule(minute, hour, day, month, weekday)
    };
}
```

---

## 6. Session State Persistence (Survives Compaction)

### How cron jobs survive context compaction

**The problem:** When the context window is compacted, tool state is not preserved in the conversation history. A polling loop implemented as a bash `while` loop inside an agent would be killed during compaction.

**The solution:** Cron jobs are stored in a dedicated session state map that is:
1. Persisted outside the conversation history
2. Injected into the system reminder after compaction
3. Restored to the scheduler when the session resumes

```javascript
// ============================================
// Cron state survival across compaction
// Location: chunks.193.mjs
// ============================================

// READABLE (for understanding):

// When compaction occurs, cron state is included in the survival payload:
function buildCompactionSurvivalState(sessionState) {
    return {
        // ... other survival state (todos, tasks, etc.)
        cronJobs: Array.from(sessionState.cronJobs.values())
            .filter(job => job.status === "active")
            .map(job => ({
                jobId: job.jobId,
                name: job.name,
                schedule: job.schedule,
                type: job.type,
                prompt: job.prompt,
                maxRuns: job.maxRuns,
                runsCompleted: job.runsCompleted,
                nextRun: job.nextRun.toISOString()
            }))
    };
}

// After compaction, the system reminder re-injects active cron state:
function buildSystemReminderAfterCompaction(survivalState) {
    let parts = [];

    if (survivalState.cronJobs.length > 0) {
        parts.push("## Active Cron Jobs");
        for (let job of survivalState.cronJobs) {
            parts.push(`- **${job.name}** (${job.jobId}): ${job.schedule.humanReadable}, next run: ${job.nextRun}`);
        }
    }

    return parts.join("\n");
}

// The scheduler restores from the system reminder state on session resume:
async function restoreCronJobsFromState(cronJobsState) {
    for (let jobState of cronJobsState) {
        let nextRun = new Date(jobState.nextRun);
        let now = new Date();

        // If the job was scheduled to run while compaction was happening, run it now
        if (nextRun < now) {
            nextRun = computeNextRun(jobState.schedule, now);
        }

        await cronScheduler.register({
            ...jobState,
            nextRun,
            status: "active"
        });
    }
}
```

**Key insight:** The cron scheduler is not persisted as conversation history — it's stored as separate session state. This means compaction (which summarizes conversation history) doesn't affect cron job registration. The only information that might be lost is the specific outputs of past cron runs, but the schedule itself is preserved.

---

## 7. Job Execution Flow

### executeCronJob - How scheduled jobs run

**What it does:** When a cron job's scheduled time arrives, this function executes the job's prompt in either agent or bash mode and records the result.

```javascript
// ============================================
// executeCronJob - Scheduled job execution
// Location: chunks.193.mjs
// ============================================

// READABLE (for understanding):
async function executeCronJob(job, sessionContext) {
    // Update job state
    job.status = "running";
    job.lastRun = new Date();

    try {
        let result;

        if (job.type === "agent") {
            // Spawn subagent with the job's prompt
            result = await spawnCronSubagent({
                prompt: job.prompt,
                jobId: job.jobId,
                parentSession: sessionContext
            });
        } else {
            // Run bash command
            result = await executeBashCommand(job.prompt, {
                timeout: 60000,  // 1 minute timeout for cron bash jobs
                cwd: sessionContext.cwd
            });
        }

        job.runsCompleted++;
        job.lastResult = summarizeResult(result);
        job.status = "active";

        // Check if max_runs reached
        if (job.runsCompleted >= job.maxRuns) {
            job.status = "completed";
            return;
        }

        // Schedule next run
        job.nextRun = computeNextRun(job.schedule, new Date());

    } catch (error) {
        job.status = "error";
        job.lastResult = `Error: ${error.message}`;

        // Re-schedule unless max failures reached
        job.nextRun = computeNextRun(job.schedule, new Date());
        job.status = "active";  // Retry on error
    }
}
```

---

## 8. Integration with Tool Registry

### Tool registry entries (v2.1.76)

```javascript
// CronCreate, CronDelete, CronList are included in the standard tool set
// when cron is enabled (feature flag or configuration)

const CRON_TOOLS = [
    CronCreateTool,
    CronDeleteTool,
    CronListTool,
];

// Added to the session tool set via assembleSessionToolSet:
function assembleSessionToolSet(config) {
    let tools = [...BASE_TOOLS];

    if (config.enableCron) {
        tools.push(...CRON_TOOLS);
    }

    return tools;
}
```

---

## 9. Usage Examples

### Example 1: Recurring PR review via /loop

```
User: /loop 10m /review-prs

Internally: CronCreate({
    schedule: "10m",
    prompt: "/review-prs",
    type: "agent",
    name: "PR review every 10 minutes"
})

Response: Created cron job cron-abc12345. Next run in 10 minutes.
```

### Example 2: LLM creates a monitoring job

```
LLM: I'll set up a build monitor that checks every 5 minutes.

CronCreate({
    schedule: "5m",
    prompt: "Check if the build is passing by running 'npm test' and report failures",
    type: "bash",
    name: "build-monitor"
})
```

### Example 3: One-time deferred execution

```
CronCreate({
    schedule: "30m",
    prompt: "Summarize the code review session so far",
    type: "agent",
    max_runs: 1,
    name: "session-summary"
})
```

### Example 4: Listing and cancelling jobs

```
CronList()
→ [
    { jobId: "abc-123", name: "build-monitor", schedule: "every 5 minutes", status: "active", runsCompleted: 3 },
    { jobId: "def-456", name: "PR review", schedule: "every 10 minutes", status: "active", runsCompleted: 1 }
  ]

CronDelete({ jobId: "abc-123" })
→ { success: true, message: "Cron job abc-123 cancelled." }
```

---

## 10. Cron vs. Background Agents vs. TaskCreate

| Capability | Cron Tools | Background Agent | TaskCreate |
|-----------|-----------|-----------------|------------|
| Recurring execution | Yes (native) | Manual sleep loop | No |
| Survives compaction | Yes | No (loses state) | Partial |
| Session lifetime | Yes, auto-cleanup | Until process exits | Until complete |
| Interval precision | ~seconds | Depends on sleep | N/A |
| User-facing | /loop command | Tool invocation | Tool invocation |
| Parallel execution | Yes | Yes | Depends on config |
| Max runs | Configurable | Manual tracking | 1 |

---

## 11. Related Documents

- [task_management_tools.md](./task_management_tools.md) - TaskGet/TaskList for monitoring agent tasks
- [agent_tool.md](./agent_tool.md) - Agent tool (used for cron job execution in agent mode)
- [tool_registry.md](./tool_registry.md) - Complete tool registry including cron entries
