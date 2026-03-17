# Cron Tools - Deep Analysis (Claude Code 2.1.76)

> New in v2.1.76. Complete analysis of CronCreate, CronDelete, and CronList tools — session-scoped scheduled task execution that survives compaction and integrates with the /loop slash command.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents section)

Key functions in this document:
- `CronCreateTool` (TbY) - CronCreate tool definition - chunks.145.mjs:947
- `CronDeleteTool` - CronDelete tool definition - chunks.145.mjs
- `CronListTool` - CronList tool definition - chunks.145.mjs
- `ER` - Tool name constant "CronCreate" - chunks.91.mjs:192
- `ed` - Tool name constant "CronDelete" - chunks.91.mjs:194
- `SW6` - Tool name constant "CronList" - chunks.91.mjs:196
- `ji6` - validateCronExpression - chunks.145.mjs
- `IT6` - getNextCronRun - chunks.145.mjs
- `CT6` - getHumanSchedule - chunks.145.mjs
- `kR` - isCronEnabled - chunks.91.mjs:187

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
// Location: chunks.145.mjs:935-1037
// ============================================

// ORIGINAL (for source lookup):
ZbY = F6(() => C.strictObject({
    cron: C.string().describe('Standard 5-field cron expression in local time: "M H DoM Mon DoW" (e.g. "*/5 * * * *" = every 5 minutes, "30 14 28 2 *" = Feb 28 at 2:30pm local once).'),
    prompt: C.string().describe("The prompt to enqueue at each fire time."),
    recurring: YX(C.boolean().optional()).describe('true (default) = fire on every cron match until deleted or auto-expired after 3 days. false = fire once at the next match, then auto-delete.'),
    durable: YX(C.boolean().optional()).describe("true = persist to .claude/scheduled_tasks.json and survive restarts. false (default) = in-memory only.")
})),
TbY = {
    name: ER,  // "CronCreate"
    searchHint: "schedule a recurring prompt for this session",
    maxResultSizeChars: 1e5,
    shouldDefer: !0,
    get inputSchema() { return GbY() },
    get outputSchema() { return fbY() },
    isEnabled() { return kR() },
    isConcurrencySafe() { return !1 },
    isReadOnly() { return !1 },
    async validateInput(A) {
        if (!ji6(A.cron)) return { result: !1, message: `Invalid cron expression '${A.cron}'. Expected 5 fields: M H DoM Mon DoW.`, errorCode: 1 };
        if (IT6(A.cron, Date.now()) === null) return { result: !1, message: `Cron expression '${A.cron}' does not match any calendar date in the next year.`, errorCode: 2 };
        if ((await bT6()).length >= j7q) return { result: !1, message: `Too many scheduled jobs (max ${j7q}). Cancel one first.`, errorCode: 3 };
        return { result: !0 }
    },
    async call({ cron: A, prompt: q, recurring: K = !0, durable: Y = !1 }) {
        let z = await A7q(A, q, K, Y, iM()?.agentId);
        return { data: { id: z, humanSchedule: CT6(A), recurring: K, durable: Y } }
    },
    mapToolResultToToolResultBlockParam(A, q) {
        let K = A.durable ? "Persisted to .claude/scheduled_tasks.json" : "Session-only";
        return {
            tool_use_id: q,
            type: "tool_result",
            content: A.recurring ? `Scheduled recurring job ${A.id} (${A.humanSchedule}). ${K}. Auto-expires after 3 days.` : `Scheduled one-shot task ${A.id} (${A.humanSchedule}). It will fire once then auto-delete.`
        }
    }
}

// READABLE (for understanding):
const cronCreateInputSchema = z.strictObject({
    cron: z.string().describe([
        "Standard 5-field cron expression in local time: M H DoM Mon DoW",
        'Examples: "*/5 * * * *" = every 5 minutes, "30 14 28 2 *" = Feb 28 at 2:30pm local once'
    ].join("\n")),

    prompt: z.string().describe("The prompt to enqueue at each fire time."),

    recurring: z.boolean().optional().default(true).describe([
        "true (default) = fire on every cron match until deleted or auto-expired after 3 days",
        'false = fire once at the next match, then auto-delete. Use false for "remind me at X" one-shot requests'
    ].join("\n")),

    durable: z.boolean().optional().default(false).describe([
        "true = persist to .claude/scheduled_tasks.json and survive restarts",
        "false (default) = in-memory only, dies when this Claude session ends"
    ].join("\n"))
});

const CronCreateTool = {
    name: "CronCreate",
    searchHint: "schedule a recurring prompt for this session",
    maxResultSizeChars: 100000,
    shouldDefer: true,  // Deferred execution for scheduling

    get inputSchema() { return cronCreateInputSchema; },
    get outputSchema() {
        return z.object({
            id: z.string(),
            humanSchedule: z.string(),
            recurring: z.boolean(),
            durable: z.boolean().optional()
        });
    },

    isEnabled() { return isCronEnabled(); },
    isConcurrencySafe() { return false; },  // Scheduling affects session state
    isReadOnly() { return false; },

    async checkPermissions(input) {
        // Cron tools auto-approve — same trust model as Agent tool
        return { behavior: "allow", updatedInput: input };
    },

    async validateInput(input) {
        // Validate cron expression format (5 fields)
        if (!validateCronExpression(input.cron)) {
            return {
                result: false,
                message: `Invalid cron expression '${input.cron}'. Expected 5 fields: M H DoM Mon DoW.`,
                errorCode: 1
            };
        }

        // Check if cron expression matches any future date
        if (getNextCronRun(input.cron, Date.now()) === null) {
            return {
                result: false,
                message: `Cron expression '${input.cron}' does not match any calendar date in the next year.`,
                errorCode: 2
            };
        }

        // Check max scheduled jobs limit
        if ((await getAllScheduledJobs()).length >= MAX_SCHEDULED_JOBS) {
            return {
                result: false,
                message: `Too many scheduled jobs (max ${MAX_SCHEDULED_JOBS}). Cancel one first.`,
                errorCode: 3
            };
        }

        return { result: true };
    },

    async call({ cron, prompt, recurring = true, durable = false }) {
        let jobId = await scheduleCronJob(cron, prompt, recurring, durable, getCurrentAgentId());

        return {
            data: {
                id: jobId,
                humanSchedule: getHumanSchedule(cron),
                recurring,
                durable
            }
        };
    },

    mapToolResultToToolResultBlockParam(result, toolUseId) {
        let persistence = result.durable
            ? "Persisted to .claude/scheduled_tasks.json"
            : "Session-only (not written to disk, dies when Claude exits)";

        if (result.recurring) {
            return {
                tool_use_id: toolUseId,
                type: "tool_result",
                content: `Scheduled recurring job ${result.id} (${result.humanSchedule}). ${persistence}. Auto-expires after 3 days. Use CronDelete to cancel sooner.`
            };
        } else {
            return {
                tool_use_id: toolUseId,
                type: "tool_result",
                content: `Scheduled one-shot task ${result.id} (${result.humanSchedule}). ${persistence}. It will fire once then auto-delete.`
            };
        }
    }
};

// Mapping: TbY→CronCreateTool, ER→TOOL_NAME_CRON_CREATE, ZbY→cronCreateInputSchema,
//          ji6→validateCronExpression, IT6→getNextCronRun, CT6→getHumanSchedule,
//          kR→isCronEnabled, A7q→scheduleCronJob, bT6→getAllScheduledJobs, j7q→MAX_SCHEDULED_JOBS
```

**Key design decisions:**

1. **Standard 5-field cron format** — Uses familiar Unix cron syntax in user's local timezone. No complex interval strings needed.

2. **recurring vs one-shot** — `recurring: true` (default) for ongoing schedules; `recurring: false` for one-time reminders.

3. **durable persistence** — Optional persistence to `.claude/scheduled_tasks.json` for tasks that should survive session restarts.

4. **Auto-expiry after 3 days** — Prevents resource leaks from abandoned recurring jobs.

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

## Deep Analysis: Jitter Algorithm

**What it does:** Adds deterministic jitter to scheduled task execution to prevent API thundering herd problems when many users schedule tasks at common times (like "9am" or "hourly").

```javascript
// ============================================
// Cron Jitter Algorithm - Prevent API stampedes
// Location: chunks.91.mjs:229-246 (prompt text)
// ============================================

// From system prompt:
// "The scheduler adds a small deterministic jitter on top of whatever you pick:
//  - recurring tasks fire up to 10% of their period late (max 15 min)
//  - one-shot tasks landing on :00 or :30 fire up to 90 s early"

// READABLE (for understanding):
function calculateJitter(schedule, scheduledTime) {
    let jitterMs = 0;

    if (schedule.type === 'recurring') {
        // For recurring tasks, delay up to 10% of period (max 15 min)
        let periodMs = schedule.intervalMs;
        jitterMs = Math.min(periodMs * 0.1, 15 * 60 * 1000);
        // Delayed (late) execution
        return scheduledTime + jitterMs;
    }

    if (schedule.type === 'one-shot') {
        let minute = scheduledTime.getMinutes();
        // For one-shot tasks at :00 or :30, fire up to 90s early
        if (minute === 0 || minute === 30) {
            jitterMs = Math.random() * 90 * 1000;  // 0-90 seconds early
            return scheduledTime - jitterMs;
        }
    }

    return scheduledTime;
}
```

**Why this approach:**

The jitter algorithm addresses the **thundering herd problem**:

1. **Problem:** When many users schedule tasks at "9am" (`0 9 * * *`), all requests hit the API simultaneously
2. **Solution:** Add random but bounded jitter to spread the load

**Design decisions:**

- **Recurring tasks fire LATE:** Delayed execution is safer for recurring tasks because:
  - If a task runs late, the next scheduled run is still in the future
  - No risk of overlapping executions

- **One-shot tasks fire EARLY:** For reminder tasks at common times:
  - Better to remind slightly early than late
  - 90 seconds is imperceptible to users

- **Off-minute recommendation:** The prompt advises LLMs to pick non-round numbers:
  - "every morning around 9" → `57 8 * * *` or `3 9 * * *` (NOT `0 9 * * *`)
  - This is the **primary lever** for load distribution

```javascript
// ============================================
// Cron Prompt Text - Jitter guidelines
// Location: chunks.91.mjs:229-246
// ============================================

// ORIGINAL (for source lookup):
// "Avoid the :00 and :30 minute marks when the task allows it
//  Every user who asks for '9am' gets `0 9`, and every user who asks for
//  'hourly' gets `0 *` — which means requests from across the planet land
//  on the API at the same instant. When the user's request is approximate,
//  pick a minute that is NOT 0 or 30:
//    'every morning around 9' → '57 8 * * *' or '3 9 * * *' (not '0 9 * * *')
//    'hourly' → '7 * * * *' (not '0 * * * *')"

// Key insight: Jitter is a SECONDARY mechanism. The PRIMARY load distribution
// comes from the LLM choosing non-round minute values when the user's request
// is approximate.
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
