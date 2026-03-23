# CronCreate/CronDelete/CronList Tools

> **Module**: Loop/Cron Scheduling System - Tools
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.145.mjs:920-1245`, `chunks.91.mjs:186-248`

---

## Overview

Three agent tools provide programmatic access to the cron scheduling system:

| Tool | Purpose | Is Read-Only | Is Concurrency Safe |
|------|---------|--------------|---------------------|
| `CronCreate` | Create a scheduled job | No | No |
| `CronDelete` | Remove a job by ID | No | No |
| `CronList` | List active jobs | Yes | Yes |

---

## Feature Flag

### isCronEnabled (kR)

**What it does:** Checks if the cron scheduling feature is enabled for this session.

**How it works:**
1. Checks environment variable `CLAUDE_CODE_DISABLE_CRON` - if set, disables the feature
2. Queries the feature flag `tengu_kairos_cron` with a 5-minute cache TTL
3. Returns true if both checks pass

**Location:** chunks.91.mjs:186-188

```javascript
// ============================================
// isCronEnabled - Check if cron feature is enabled
// Location: chunks.91.mjs:186-188
// ============================================

// ORIGINAL (for source lookup):
function kR() {
    return !t6(process.env.CLAUDE_CODE_DISABLE_CRON) && lk("tengu_kairos_cron", !0, LB9)
}

// READABLE (for understanding):
function isCronEnabled() {
    // Disabled if CLAUDE_CODE_DISABLE_CRON environment variable is set
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_CRON)) {
        return false;
    }
    // Feature flag with 5-minute cache (LB9 = 300000ms = 5 minutes)
    return getFeatureFlag("tengu_kairos_cron", true, 300000);
}

// Mapping: kR→isCronEnabled, t6→parseBoolean, lk→getFeatureFlag, LB9→300000
```

**Why this approach:**
- Environment variable allows quick disable for debugging
- Feature flag enables gradual rollout and A/B testing
- 5-minute cache prevents excessive flag service queries

---

## Tool Names & Constants

**Location:** chunks.91.mjs:192-208

```javascript
// ============================================
// Cron Tool Constants
// Location: chunks.91.mjs:192-208
// ============================================

// ORIGINAL (for source lookup):
ER = "CronCreate"
ed = "CronDelete"
SW6 = "CronList"
RV8 = "Schedule a prompt to run at a future time — either recurring on a cron schedule, or once at a specific time. Session-only: the job dies when this Claude session ends."
SV8 = "Cancel a scheduled cron job by ID"
CV8 = `Cancel a cron job previously scheduled with ${ER}. Removes it from the in-memory session store.`
IV8 = "List scheduled cron jobs"
bV8 = `List all cron jobs scheduled via ${ER} in this session.`

// READABLE (for understanding):
const TOOL_NAME_CRON_CREATE = "CronCreate";
const TOOL_NAME_CRON_DELETE = "CronDelete";
const TOOL_NAME_CRON_LIST = "CronList";

const CRON_CREATE_DESCRIPTION = "Schedule a prompt to run at a future time — either recurring on a cron schedule, or once at a specific time. Session-only: the job dies when this Claude session ends.";
const CRON_DELETE_DESCRIPTION = "Cancel a scheduled cron job by ID";
const CRON_DELETE_PROMPT = `Cancel a cron job previously scheduled with CronCreate. Removes it from the in-memory session store.`;
const CRON_LIST_DESCRIPTION = "List scheduled cron jobs";
const CRON_LIST_PROMPT = `List all cron jobs scheduled via CronCreate in this session.`;

// Mapping: ER→TOOL_NAME_CRON_CREATE, ed→TOOL_NAME_CRON_DELETE, SW6→TOOL_NAME_CRON_LIST
// Mapping: RV8→CRON_CREATE_DESCRIPTION, SV8→CRON_DELETE_DESCRIPTION, CV8→CRON_DELETE_PROMPT
// Mapping: IV8→CRON_LIST_DESCRIPTION, bV8→CRON_LIST_PROMPT
```

---

## CronCreate Tool

### Tool Definition

**Obfuscated Name**: `TbY`
**Location**: chunks.145.mjs:950-1045

```javascript
// ============================================
// CronCreateTool - Create a scheduled cron job
// Location: chunks.145.mjs:950-1045
// ============================================

// ORIGINAL (for source lookup):
const TbY = {
    name: ER,
    searchHint: "schedule a recurring prompt for this session",
    maxResultSizeChars: 1e5,
    shouldDefer: !0,
    get inputSchema() { return GbY() },
    get outputSchema() { return fbY() },
    userFacingName() { return ER },
    isEnabled() { return kR() },
    isConcurrencySafe() { return !1 },
    isReadOnly() { return !1 },
    toAutoClassifierInput(A) {
        return `${A.cron}: ${A.prompt}`
    },
    async checkPermissions(A) {
        return { behavior: "allow", updatedInput: A }
    },
    async description() { return RV8 },
    async prompt() { return hV8 },
    getPath() { return bl() },
    async validateInput(A) {
        if (!ji6(A.cron)) return {
            result: !1,
            message: `Invalid cron expression '${A.cron}'. Expected 5 fields: M H DoM Mon DoW.`,
            errorCode: 1
        };
        if (IT6(A.cron, Date.now()) === null) return {
            result: !1,
            message: `Cron expression '${A.cron}' does not match any calendar date in the next year.`,
            errorCode: 2
        };
        if ((await bT6()).length >= j7q) return {
            result: !1,
            message: `Too many scheduled jobs (max ${j7q}). Cancel one first.`,
            errorCode: 3
        };
        if (A.durable && iM()) return {
            result: !1,
            message: "durable crons are not supported for teammates (teammates do not persist across sessions)",
            errorCode: 4
        };
        return { result: !0 }
    },
    async call({ cron: A, prompt: q, recurring: K = !0, durable: Y = !1 }) {
        let z = await A7q(A, q, K, Y, iM()?.agentId);
        return dk6(!0), {
            data: { id: z, humanSchedule: CT6(A), recurring: K, durable: Y }
        }
    },
    mapToolResultToToolResultBlockParam(A, q) {
        let K = A.durable ? "Persisted to .claude/scheduled_tasks.json" : "Session-only (not written to disk, dies when Claude exits)";
        return {
            tool_use_id: q,
            type: "tool_result",
            content: A.recurring
                ? `Scheduled recurring job ${A.id} (${A.humanSchedule}). ${K}. Auto-expires after 3 days. Use CronDelete to cancel sooner.`
                : `Scheduled one-shot task ${A.id} (${A.humanSchedule}). ${K}. It will fire once then auto-delete.`
        }
    },
    renderToolUseMessage: z7q,
    renderToolUseProgressMessage: xT6,
    renderToolUseRejectedMessage: uT6,
    renderToolUseErrorMessage: mT6,
    renderToolResultMessage: _7q
}

// READABLE (for understanding):
const CronCreateTool = {
    name: "CronCreate",
    searchHint: "schedule a recurring prompt for this session",
    maxResultSizeChars: 100000,
    shouldDefer: true,  // Deers execution to avoid blocking user input

    get inputSchema() { return cronCreateInputSchema(); },
    get outputSchema() { return cronCreateOutputSchema(); },

    userFacingName() { return "CronCreate"; },

    isEnabled() { return isCronEnabled(); },
    isConcurrencySafe() { return false; },  // Modifies shared state
    isReadOnly() { return false; },          // Creates new resources

    // Used for auto-classification of tool intent
    toAutoClassifierInput(input) {
        return `${input.cron}: ${input.prompt}`;
    },

    // Always allow - no permission check needed
    async checkPermissions(input) {
        return { behavior: "allow", updatedInput: input };
    },

    async description() { return CRON_CREATE_DESCRIPTION; },
    async prompt() { return CRON_CREATE_PROMPT; },
    getPath() { return getScheduledTasksPath(); },

    async validateInput(input) {
        // Error code 1: Invalid cron syntax
        if (!parseCronExpression(input.cron)) {
            return {
                result: false,
                message: `Invalid cron expression '${input.cron}'. Expected 5 fields: M H DoM Mon DoW.`,
                errorCode: 1
            };
        }

        // Error code 2: No matching calendar date
        if (getNextCronMatch(input.cron, Date.now()) === null) {
            return {
                result: false,
                message: `Cron expression '${input.cron}' does not match any calendar date in the next year.`,
                errorCode: 2
            };
        }

        // Error code 3: Too many jobs
        if ((await getAllCronTasks()).length >= MAX_SCHEDULED_JOBS) {
            return {
                result: false,
                message: `Too many scheduled jobs (max ${MAX_SCHEDULED_JOBS}). Cancel one first.`,
                errorCode: 3
            };
        }

        // Error code 4: Durable not allowed for teammates
        if (input.durable && getTeamMode()) {
            return {
                result: false,
                message: "durable crons are not supported for teammates (teammates do not persist across sessions)",
                errorCode: 4
            };
        }

        return { result: true };
    },

    async call({ cron, prompt, recurring = true, durable = false }) {
        const id = await createCronTask(cron, prompt, recurring, durable, getTeamMode()?.agentId);
        setScheduledTasksEnabled(true);
        return {
            data: {
                id,
                humanSchedule: formatCronHumanReadable(cron),
                recurring,
                durable
            }
        };
    },

    mapToolResultToToolResultBlockParam(result, toolUseId) {
        const persistence = result.durable
            ? "Persisted to .claude/scheduled_tasks.json"
            : "Session-only (not written to disk, dies when Claude exits)";

        return {
            tool_use_id: toolUseId,
            type: "tool_result",
            content: result.recurring
                ? `Scheduled recurring job ${result.id} (${result.humanSchedule}). ${persistence}. Auto-expires after 3 days. Use CronDelete to cancel sooner.`
                : `Scheduled one-shot task ${result.id} (${result.humanSchedule}). ${persistence}. It will fire once then auto-delete.`
        };
    },

    // UI rendering functions
    renderToolUseMessage: renderCronCreateUseMessage,
    renderToolUseProgressMessage: renderCronProgressMessage,
    renderToolUseRejectedMessage: renderCronRejectedMessage,
    renderToolUseErrorMessage: renderCronErrorMessage,
    renderToolResultMessage: renderCronCreateResultMessage
};

// Mapping: TbY→CronCreateTool, ER→"CronCreate", GbY→cronCreateInputSchema, fbY→cronCreateOutputSchema
// Mapping: kR→isCronEnabled, ji6→parseCronExpression, IT6→getNextCronMatch, bT6→getAllCronTasks
// Mapping: j7q→MAX_SCHEDULED_JOBS (50), iM→getTeamMode, A7q→createCronTask, CT6→formatCronHumanReadable
// Mapping: dk6→setScheduledTasksEnabled, z7q→renderCronCreateUseMessage, _7q→renderCronCreateResultMessage
// Mapping: xT6→renderCronProgressMessage, uT6→renderCronRejectedMessage, mT6→renderCronErrorMessage
```

### Input Schema

**Location:** chunks.145.mjs:938-944

```javascript
// ============================================
// CronCreate Input/Output Schemas
// Location: chunks.145.mjs:938-950
// ============================================

// ORIGINAL (for source lookup):
ZbY = F6(() => C.strictObject({
    cron: C.string().describe('Standard 5-field cron expression in local time: "M H DoM Mon DoW" (e.g. "*/5 * * * *" = every 5 minutes, "30 14 28 2 *" = Feb 28 at 2:30pm local once).'),
    prompt: C.string().describe("The prompt to enqueue at each fire time."),
    recurring: YX(C.boolean().optional()).describe('true (default) = fire on every cron match until deleted or auto-expired after 3 days. false = fire once at the next match, then auto-delete. Use false for "remind me at X" one-shot requests with pinned minute/hour/dom/month.'),
    durable: YX(C.boolean().optional()).describe("true = persist to .claude/scheduled_tasks.json and survive restarts. false (default) = in-memory only, dies when this Claude session ends. Use true only when the user asks the task to survive across sessions.")
}))
GbY = F6(() => ZbY().omit({ durable: !0 }))
fbY = F6(() => C.object({
    id: C.string(),
    humanSchedule: C.string(),
    recurring: C.boolean(),
    durable: C.boolean().optional()
}))

// READABLE (for understanding):
const fullCronCreateSchema = z.strictObject({
    cron: z.string().describe(
        'Standard 5-field cron expression in local time: "M H DoM Mon DoW" ' +
        '(e.g. "*/5 * * * *" = every 5 minutes, "30 14 28 2 *" = Feb 28 at 2:30pm local once).'
    ),
    prompt: z.string().describe("The prompt to enqueue at each fire time."),
    recurring: z.boolean().optional().default(true).describe(
        'true (default) = fire on every cron match until deleted or auto-expired after 3 days. ' +
        'false = fire once at the next match, then auto-delete. ' +
        'Use false for "remind me at X" one-shot requests with pinned minute/hour/dom/month.'
    ),
    durable: z.boolean().optional().default(false).describe(
        "true = persist to .claude/scheduled_tasks.json and survive restarts. " +
        "false (default) = in-memory only, dies when this Claude session ends. " +
        "Use true only when the user asks the task to survive across sessions."
    )
});

// Agent-facing schema omits 'durable' option
const cronCreateInputSchema = () => fullCronCreateSchema().omit({ durable: true });

const cronCreateOutputSchema = z.object({
    id: z.string(),
    humanSchedule: z.string(),
    recurring: z.boolean(),
    durable: z.boolean().optional()
});

// Mapping: ZbY→fullCronCreateSchema, GbY→cronCreateInputSchema, fbY→cronCreateOutputSchema
// Mapping: F6→z.lazy (schema factory), C→z (Zod), YX→defaultTrue
```

### Tool Prompt

**Location:** chunks.91.mjs:214-248

```javascript
// ============================================
// CronCreate Tool Prompt
// Location: chunks.91.mjs:214-248
// ============================================

// ORIGINAL (for source lookup):
hV8 = `Schedule a prompt to be enqueued at a future time. Use for both recurring schedules and one-shot reminders.

Uses standard 5-field cron in the user's local timezone: minute hour day-of-month month day-of-week. "0 9 * * *" means 9am local — no timezone conversion needed.

## One-shot tasks (recurring: false)

For "remind me at X" or "at <time>, do Y" requests — fire once then auto-delete.
Pin minute/hour/day-of-month/month to specific values:
  "remind me at 2:30pm today to check the deploy" → cron: "30 14 <today_dom> <today_month> *", recurring: false
  "tomorrow morning, run the smoke test" → cron: "57 8 <tomorrow_dom> <tomorrow_month> *", recurring: false

## Recurring jobs (recurring: true, the default)

For "every N minutes" / "every hour" / "weekdays at 9am" requests:
  "*/5 * * * *" (every 5 min), "0 * * * *" (hourly), "0 9 * * 1-5" (weekdays at 9am local)

## Avoid the :00 and :30 minute marks when the task allows it

Every user who asks for "9am" gets \`0 9\`, and every user who asks for "hourly" gets \`0 *\` — which means requests from across the planet land on the API at the same instant. When the user's request is approximate, pick a minute that is NOT 0 or 30:
  "every morning around 9" → "57 8 * * *" or "3 9 * * *" (not "0 9 * * *")
  "hourly" → "7 * * * *" (not "0 * * * *")
  "in an hour or so, remind me to..." → pick whatever minute you land on, don't round

Only use minute 0 or 30 when the user names that exact time and clearly means it ("at 9:00 sharp", "at half past", coordinating with a meeting). When in doubt, nudge a few minutes early or late — the user will not notice, and the fleet will.

## Session-only

Jobs live only in this Claude session — nothing is written to disk, and the job is gone when Claude exits.

## Runtime behavior

Jobs only fire while the REPL is idle (not mid-query). The scheduler adds a small deterministic jitter on top of whatever you pick: recurring tasks fire up to 10% of their period late (max 15 min); one-shot tasks landing on :00 or :30 fire up to 90 s early. Picking an off-minute is still the bigger lever.

Recurring tasks auto-expire after 3 days — they fire one final time, then are deleted. This bounds session lifetime. Tell the user about the 3-day limit when scheduling recurring jobs.

Returns a job ID you can pass to CronDelete.`

// READABLE (for understanding):
const CRON_CREATE_PROMPT = `Schedule a prompt to be enqueued at a future time. Use for both recurring schedules and one-shot reminders.

Uses standard 5-field cron in the user's local timezone: minute hour day-of-month month day-of-week. "0 9 * * *" means 9am local — no timezone conversion needed.

## One-shot tasks (recurring: false)

For "remind me at X" or "at <time>, do Y" requests — fire once then auto-delete.
Pin minute/hour/day-of-month/month to specific values:
  "remind me at 2:30pm today to check the deploy" → cron: "30 14 <today_dom> <today_month> *", recurring: false
  "tomorrow morning, run the smoke test" → cron: "57 8 <tomorrow_dom> <tomorrow_month> *", recurring: false

## Recurring jobs (recurring: true, the default)

For "every N minutes" / "every hour" / "weekdays at 9am" requests:
  "*/5 * * * *" (every 5 min), "0 * * * *" (hourly), "0 9 * * 1-5" (weekdays at 9am local)

## Avoid the :00 and :30 minute marks when the task allows it

Every user who asks for "9am" gets "0 9", and every user who asks for "hourly" gets "0 *" — which means requests from across the planet land on the API at the same instant. When the user's request is approximate, pick a minute that is NOT 0 or 30:
  "every morning around 9" → "57 8 * * *" or "3 9 * * *" (not "0 9 * * *")
  "hourly" → "7 * * * *" (not "0 * * * *")
  "in an hour or so, remind me to..." → pick whatever minute you land on, don't round

Only use minute 0 or 30 when the user names that exact time and clearly means it ("at 9:00 sharp", "at half past", coordinating with a meeting). When in doubt, nudge a few minutes early or late — the user will not notice, and the fleet will.

## Session-only

Jobs live only in this Claude session — nothing is written to disk, and the job is gone when Claude exits.

## Runtime behavior

Jobs only fire while the REPL is idle (not mid-query). The scheduler adds a small deterministic jitter on top of whatever you pick: recurring tasks fire up to 10% of their period late (max 15 min); one-shot tasks landing on :00 or :30 fire up to 90 s early. Picking an off-minute is still the bigger lever.

Recurring tasks auto-expire after 3 days — they fire one final time, then are deleted. This bounds session lifetime. Tell the user about the 3-day limit when scheduling recurring jobs.

Returns a job ID you can pass to CronDelete.`;

// Mapping: hV8→CRON_CREATE_PROMPT
```

**Key insight:** The prompt teaches the LLM about:
1. **Load distribution** - Avoiding :00 and :30 prevents thundering herd on the API
2. **Jitter behavior** - Tasks don't fire at exact times to spread load
3. **Session lifetime** - 3-day auto-expiry bounds resource usage
4. **Idle-only firing** - Jobs only fire when REPL is not processing

### Validation Logic

**Location:** chunks.145.mjs:991-1015

```javascript
// ============================================
// CronCreate Validation Logic
// Location: chunks.145.mjs:991-1015
// ============================================

// ORIGINAL (for source lookup):
async validateInput(A) {
    if (!ji6(A.cron)) return {
        result: !1,
        message: `Invalid cron expression '${A.cron}'. Expected 5 fields: M H DoM Mon DoW.`,
        errorCode: 1
    };
    if (IT6(A.cron, Date.now()) === null) return {
        result: !1,
        message: `Cron expression '${A.cron}' does not match any calendar date in the next year.`,
        errorCode: 2
    };
    if ((await bT6()).length >= j7q) return {
        result: !1,
        message: `Too many scheduled jobs (max ${j7q}). Cancel one first.`,
        errorCode: 3
    };
    if (A.durable && iM()) return {
        result: !1,
        message: "durable crons are not supported for teammates (teammates do not persist across sessions)",
        errorCode: 4
    };
    return { result: !0 }
}

// READABLE (for understanding):
async function validateCronCreateInput(input) {
    // Error Code 1: Invalid cron syntax
    // Must be exactly 5 space-separated fields
    if (!parseCronExpression(input.cron)) {
        return {
            result: false,
            message: `Invalid cron expression '${input.cron}'. Expected 5 fields: M H DoM Mon DoW.`,
            errorCode: 1
        };
    }

    // Error Code 2: No matching date
    // Check if cron will ever fire in the next year (527040 minutes)
    if (getNextCronMatch(input.cron, Date.now()) === null) {
        return {
            result: false,
            message: `Cron expression '${input.cron}' does not match any calendar date in the next year.`,
            errorCode: 2
        };
    }

    // Error Code 3: Too many jobs
    // Maximum 50 concurrent scheduled jobs per session
    const currentJobs = await getAllCronTasks();
    if (currentJobs.length >= MAX_SCHEDULED_JOBS) {
        return {
            result: false,
            message: `Too many scheduled jobs (max ${MAX_SCHEDULED_JOBS}). Cancel one first.`,
            errorCode: 3
        };
    }

    // Error Code 4: Durable not allowed in team mode
    // Teammates share session, don't have persistent storage
    if (input.durable && getTeamMode()) {
        return {
            result: false,
            message: "durable crons are not supported for teammates (teammates do not persist across sessions)",
            errorCode: 4
        };
    }

    return { result: true };
}

// Mapping: ji6→parseCronExpression, IT6→getNextCronMatch, bT6→getAllCronTasks
// Mapping: j7q→MAX_SCHEDULED_JOBS (50), iM→getTeamMode
```

**Error Code Summary:**

| ErrorCode | Condition | Message |
|-----------|-----------|---------|
| 1 | Invalid cron syntax | "Expected 5 fields: M H DoM Mon DoW" |
| 2 | No matching date in next year | "does not match any calendar date" |
| 3 | Too many jobs (≥50) | "Cancel one first" |
| 4 | Durable + team mode | "teammates do not persist across sessions" |

---

## CronDelete Tool

### Tool Definition

**Obfuscated Name**: `VbY`
**Location**: chunks.145.mjs:1066-1145

```javascript
// ============================================
// CronDeleteTool - Cancel a scheduled cron job
// Location: chunks.145.mjs:1066-1145
// ============================================

// ORIGINAL (for source lookup):
const VbY = {
    name: ed,
    searchHint: "cancel a scheduled cron job",
    maxResultSizeChars: 1e5,
    shouldDefer: !0,
    get inputSchema() { return vbY() },
    get outputSchema() { return NbY() },
    userFacingName() { return ed },
    isEnabled() { return kR() },
    isConcurrencySafe() { return !1 },
    isReadOnly() { return !1 },
    toAutoClassifierInput(A) { return A.id },
    async checkPermissions(A) {
        return { behavior: "allow", updatedInput: A }
    },
    async description() { return SV8 },
    async prompt() { return CV8 },
    getPath() { return bl() },
    async validateInput(A) {
        let K = (await bT6()).find((z) => z.id === A.id);
        if (!K) return {
            result: !1,
            message: `No scheduled job with id '${A.id}'`,
            errorCode: 1
        };
        let Y = iM();
        if (Y && K.agentId !== Y.agentId) return {
            result: !1,
            message: `Cannot delete cron job '${A.id}': owned by another agent`,
            errorCode: 2
        };
        return { result: !0 }
    },
    async call({ id: A }) {
        return await yz6([A]), { data: { id: A } }
    },
    mapToolResultToToolResultBlockParam(A, q) {
        return {
            tool_use_id: q,
            type: "tool_result",
            content: `Cancelled job ${A.id}.`
        }
    },
    renderToolUseMessage: w7q,
    renderToolUseProgressMessage: xT6,
    renderToolUseRejectedMessage: uT6,
    renderToolUseErrorMessage: mT6,
    renderToolResultMessage: O7q
}

// READABLE (for understanding):
const CronDeleteTool = {
    name: "CronDelete",
    searchHint: "cancel a scheduled cron job",
    maxResultSizeChars: 100000,
    shouldDefer: true,

    get inputSchema() { return cronDeleteInputSchema(); },
    get outputSchema() { return cronDeleteOutputSchema(); },

    userFacingName() { return "CronDelete"; },
    isEnabled() { return isCronEnabled(); },
    isConcurrencySafe() { return false; },
    isReadOnly() { return false; },

    toAutoClassifierInput(input) { return input.id; },

    async checkPermissions(input) {
        return { behavior: "allow", updatedInput: input };
    },

    async description() { return CRON_DELETE_DESCRIPTION; },
    async prompt() { return CRON_DELETE_PROMPT; },
    getPath() { return getScheduledTasksPath(); },

    async validateInput(input) {
        // Check if job exists
        const allJobs = await getAllCronTasks();
        const job = allJobs.find((j) => j.id === input.id);

        if (!job) {
            return {
                result: false,
                message: `No scheduled job with id '${input.id}'`,
                errorCode: 1
            };
        }

        // Check ownership in team mode
        const teamMode = getTeamMode();
        if (teamMode && job.agentId !== teamMode.agentId) {
            return {
                result: false,
                message: `Cannot delete cron job '${input.id}': owned by another agent`,
                errorCode: 2
            };
        }

        return { result: true };
    },

    async call({ id }) {
        await deleteCronTasks([id]);
        return { data: { id } };
    },

    mapToolResultToToolResultBlockParam(result, toolUseId) {
        return {
            tool_use_id: toolUseId,
            type: "tool_result",
            content: `Cancelled job ${result.id}.`
        };
    },

    renderToolUseMessage: renderCronDeleteUseMessage,
    renderToolUseProgressMessage: renderCronProgressMessage,
    renderToolUseRejectedMessage: renderCronRejectedMessage,
    renderToolUseErrorMessage: renderCronErrorMessage,
    renderToolResultMessage: renderCronDeleteResultMessage
};

// Mapping: VbY→CronDeleteTool, ed→"CronDelete", vbY→cronDeleteInputSchema, NbY→cronDeleteOutputSchema
// Mapping: kR→isCronEnabled, bT6→getAllCronTasks, iM→getTeamMode, yz6→deleteCronTasks
// Mapping: w7q→renderCronDeleteUseMessage, O7q→renderCronDeleteResultMessage
```

### Input Schema

**Location:** chunks.145.mjs:1062-1066

```javascript
// ============================================
// CronDelete Input/Output Schemas
// Location: chunks.145.mjs:1062-1066
// ============================================

// ORIGINAL (for source lookup):
vbY = F6(() => C.strictObject({
    id: C.string().describe("Job ID returned by CronCreate.")
}))
NbY = F6(() => C.object({
    id: C.string()
}))

// READABLE (for understanding):
const cronDeleteInputSchema = z.strictObject({
    id: z.string().describe("Job ID returned by CronCreate.")
});

const cronDeleteOutputSchema = z.object({
    id: z.string()
});

// Mapping: vbY→cronDeleteInputSchema, NbY→cronDeleteOutputSchema
```

### Validation Logic

**Location:** chunks.145.mjs:1107-1123

```javascript
// ============================================
// CronDelete Validation Logic
// Location: chunks.145.mjs:1107-1123
// ============================================

// ORIGINAL (for source lookup):
async validateInput(A) {
    let K = (await bT6()).find((z) => z.id === A.id);
    if (!K) return {
        result: !1,
        message: `No scheduled job with id '${A.id}'`,
        errorCode: 1
    };
    let Y = iM();
    if (Y && K.agentId !== Y.agentId) return {
        result: !1,
        message: `Cannot delete cron job '${A.id}': owned by another agent`,
        errorCode: 2
    };
    return { result: !0 }
}

// READABLE (for understanding):
async function validateCronDeleteInput(input) {
    // Error Code 1: Job not found
    const allJobs = await getAllCronTasks();
    const job = allJobs.find((j) => j.id === input.id);

    if (!job) {
        return {
            result: false,
            message: `No scheduled job with id '${input.id}'`,
            errorCode: 1
        };
    }

    // Error Code 2: Not owner (team mode only)
    const teamMode = getTeamMode();
    if (teamMode && job.agentId !== teamMode.agentId) {
        return {
            result: false,
            message: `Cannot delete cron job '${input.id}': owned by another agent`,
            errorCode: 2
        };
    }

    return { result: true };
}

// Mapping: bT6→getAllCronTasks, iM→getTeamMode
```

**Error Code Summary:**

| ErrorCode | Condition | Message |
|-----------|-----------|---------|
| 1 | Job ID not found | "No scheduled job with id" |
| 2 | Team mode + wrong owner | "owned by another agent" |

---

## CronList Tool

### Tool Definition

**Obfuscated Name**: `ybY`
**Location**: chunks.145.mjs:1173-1244

```javascript
// ============================================
// CronListTool - List all scheduled cron jobs
// Location: chunks.145.mjs:1173-1244
// ============================================

// ORIGINAL (for source lookup):
const ybY = {
    name: SW6,
    searchHint: "list active cron jobs",
    maxResultSizeChars: 1e5,
    shouldDefer: !0,
    get inputSchema() { return kbY() },
    get outputSchema() { return EbY() },
    userFacingName() { return SW6 },
    isEnabled() { return kR() },
    isConcurrencySafe() { return !0 },
    isReadOnly() { return !0 },
    toAutoClassifierInput() { return "" },
    async checkPermissions(A) {
        return { behavior: "allow", updatedInput: A }
    },
    async description() { return IV8 },
    async prompt() { return bV8 },
    async call() {
        let A = await bT6(),
            q = iM();
        return {
            data: {
                jobs: (q ? A.filter((z) => z.agentId === q.agentId) : A).map((z) => ({
                    id: z.id,
                    cron: z.cron,
                    humanSchedule: CT6(z.cron),
                    prompt: z.prompt,
                    ...z.recurring ? { recurring: !0 } : {},
                    ...z.durable === !1 ? { durable: !1 } : {}
                }))
            }
        }
    },
    mapToolResultToToolResultBlockParam(A, q) {
        return {
            tool_use_id: q,
            type: "tool_result",
            content: A.jobs.length > 0
                ? A.jobs.map((K) =>
                    `${K.id} — ${K.humanSchedule}${K.recurring?" (recurring)":" (one-shot)"}${K.durable===!1?" [session-only]":""}: ${R3(K.prompt,80,!0)}`
                  ).join("\n")
                : "No scheduled jobs."
        }
    },
    renderToolUseMessage: $7q,
    renderToolUseProgressMessage: xT6,
    renderToolUseRejectedMessage: uT6,
    renderToolUseErrorMessage: mT6,
    renderToolResultMessage: H7q
}

// READABLE (for understanding):
const CronListTool = {
    name: "CronList",
    searchHint: "list active cron jobs",
    maxResultSizeChars: 100000,
    shouldDefer: true,

    get inputSchema() { return cronListInputSchema(); },  // Empty schema
    get outputSchema() { return cronListOutputSchema(); },

    userFacingName() { return "CronList"; },
    isEnabled() { return isCronEnabled(); },
    isConcurrencySafe() { return true; },  // Safe to run concurrently
    isReadOnly() { return true; },          // No side effects

    toAutoClassifierInput() { return ""; },  // No meaningful classification

    async checkPermissions(input) {
        return { behavior: "allow", updatedInput: input };
    },

    async description() { return CRON_LIST_DESCRIPTION; },
    async prompt() { return CRON_LIST_PROMPT; },

    async call() {
        const allJobs = await getAllCronTasks();
        const teamMode = getTeamMode();

        // Filter to own jobs in team mode
        const visibleJobs = teamMode
            ? allJobs.filter((job) => job.agentId === teamMode.agentId)
            : allJobs;

        return {
            data: {
                jobs: visibleJobs.map((job) => ({
                    id: job.id,
                    cron: job.cron,
                    humanSchedule: formatCronHumanReadable(job.cron),
                    prompt: job.prompt,
                    // Only include recurring/durable if non-default
                    ...(job.recurring ? { recurring: true } : {}),
                    ...(job.durable === false ? { durable: false } : {})
                }))
            }
        };
    },

    mapToolResultToToolResultBlockParam(result, toolUseId) {
        if (result.jobs.length === 0) {
            return {
                tool_use_id: toolUseId,
                type: "tool_result",
                content: "No scheduled jobs."
            };
        }

        const lines = result.jobs.map((job) => {
            const type = job.recurring ? " (recurring)" : " (one-shot)";
            const persistence = job.durable === false ? " [session-only]" : "";
            const truncatedPrompt = truncateText(job.prompt, 80, true);
            return `${job.id} — ${job.humanSchedule}${type}${persistence}: ${truncatedPrompt}`;
        });

        return {
            tool_use_id: toolUseId,
            type: "tool_result",
            content: lines.join("\n")
        };
    },

    renderToolUseMessage: renderCronListUseMessage,
    renderToolUseProgressMessage: renderCronProgressMessage,
    renderToolUseRejectedMessage: renderCronRejectedMessage,
    renderToolUseErrorMessage: renderCronErrorMessage,
    renderToolResultMessage: renderCronListResultMessage
};

// Mapping: ybY→CronListTool, SW6→"CronList", kbY→cronListInputSchema, EbY→cronListOutputSchema
// Mapping: kR→isCronEnabled, bT6→getAllCronTasks, iM→getTeamMode, CT6→formatCronHumanReadable
// Mapping: R3→truncateText, $7q→renderCronListUseMessage, H7q→renderCronListResultMessage
```

### Input Schema

**Location:** chunks.145.mjs:1164-1172

```javascript
// ============================================
// CronList Input/Output Schemas
// Location: chunks.145.mjs:1164-1172
// ============================================

// ORIGINAL (for source lookup):
kbY = F6(() => C.strictObject({}))
EbY = F6(() => C.object({
    jobs: C.array(C.object({
        id: C.string(),
        cron: C.string(),
        humanSchedule: C.string(),
        prompt: C.string(),
        recurring: C.boolean().optional(),
        durable: C.boolean().optional()
    }))
}))

// READABLE (for understanding):
const cronListInputSchema = z.strictObject({});  // No input parameters

const cronListOutputSchema = z.object({
    jobs: z.array(z.object({
        id: z.string(),
        cron: z.string(),
        humanSchedule: z.string(),
        prompt: z.string(),
        recurring: z.boolean().optional(),
        durable: z.boolean().optional()
    }))
});

// Mapping: kbY→cronListInputSchema, EbY→cronListOutputSchema
```

---

## Maximum Jobs Limit

**Location:** chunks.145.mjs:919

```javascript
// ============================================
// MAX_SCHEDULED_JOBS Constant
// Location: chunks.145.mjs:919
// ============================================

// ORIGINAL (for source lookup):
j7q = 50

// READABLE (for understanding):
const MAX_SCHEDULED_JOBS = 50;  // Maximum concurrent scheduled jobs per session

// Mapping: j7q→MAX_SCHEDULED_JOBS
```

**Why 50?** This limit prevents resource exhaustion from too many scheduled timers. Each job consumes:
- Memory for the task object
- A timer slot in the JavaScript event loop
- File system space (if durable)

---

## Error Recovery Guide

### CronCreate Error Recovery

| ErrorCode | User-Facing Message | Recovery Suggestion |
|-----------|---------------------|---------------------|
| 1 | "Invalid cron expression" | LLM should suggest valid 5-field syntax: `M H DoM Mon DoW` |
| 2 | "does not match any calendar date" | LLM should suggest alternative date/time or check for impossible dates (e.g., Feb 30) |
| 3 | "Too many scheduled jobs (max 50)" | LLM should call CronList first, then suggest which jobs to cancel |
| 4 | "durable crons are not supported for teammates" | LLM should explain that teammates have session-only storage |

### CronDelete Error Recovery

| ErrorCode | User-Facing Message | Recovery Suggestion |
|-----------|---------------------|---------------------|
| 1 | "No scheduled job with id" | LLM should call CronList to show available jobs |
| 2 | "owned by another agent" | LLM should explain team mode ownership rules |

### Feature Flag Disabled

When `isCronEnabled()` returns `false`:

**Causes:**
1. Environment variable `CLAUDE_CODE_DISABLE_CRON=true`
2. Feature flag `tengu_kairos_cron` returns `false`

**User message:** The cron scheduling feature is not available in this session.

---

## Team Mode Integration

### CronCreate in Team Mode

When `getTeamMode()` returns a truthy value:

```javascript
// Location: chunks.145.mjs:1007-1011
if (input.durable && getTeamMode()) {
    return {
        result: false,
        message: "durable crons are not supported for teammates",
        errorCode: 4
    };
}
```

**Behavior:**
- `durable: true` is rejected with ErrorCode 4
- `durable: false` (default) works normally
- Task is tagged with `agentId` for ownership tracking

**Task creation with agentId:**
```javascript
// Location: chunks.145.mjs:1022
const id = await createCronTask(cron, prompt, recurring, durable, getTeamMode()?.agentId);
```

### CronDelete in Team Mode

Ownership validation ensures agents can only delete their own tasks:

```javascript
// Location: chunks.145.mjs:1114-1118
const teamMode = getTeamMode();
if (teamMode && job.agentId !== teamMode.agentId) {
    return {
        result: false,
        message: `Cannot delete cron job '${input.id}': owned by another agent`,
        errorCode: 2
    };
}
```

### CronList in Team Mode

Agents only see their own scheduled tasks:

```javascript
// Location: chunks.145.mjs:1213-1216
const visibleJobs = teamMode
    ? allJobs.filter((job) => job.agentId === teamMode.agentId)
    : allJobs;
```

### Orphaned Cron Cleanup

When a teammate task fires but the agent is gone:

```javascript
// Location: chunks.195.mjs:1968-1976
onFireTask: (task) => {
    if (task.agentId) {
        const teammateTask = findTaskById(task.agentId, store.getState().tasks);
        if (teammateTask && !isTaskTerminal(teammateTask.status)) {
            // Route to teammate's task queue
            dispatchTaskPrompt(teammateTask.id, task.prompt, dispatch);
            return;
        }
        // Teammate gone, remove orphaned cron
        log(`[ScheduledTasks] teammate ${task.agentId} gone, removing orphaned cron ${task.id}`);
        deleteCronTasks([task.id]);
        return;
    }
    firePrompt(task.prompt);
}
```

### Team Delegate Tools Set

**Location:** chunks.91.mjs:269

```javascript
// ORIGINAL (for source lookup):
WY4 = new Set([TR, lt, it, ck, hI, ER, ed, SW6])

// READABLE (for understanding):
const TEAM_DELEGATE_TOOLS = new Set([
    "TeamCreate", "TeamDelete", "TeamList",  // Team management
    "TeamChat", "TeamStatus",                 // Team communication
    "CronCreate", "CronDelete", "CronList"    // Cron tools - included!
]);
```

**Key insight:** Cron tools are included in the team delegate set, meaning they can be used by delegate agents in team mode.

---

## TEAM_DELEGATE_TOOLS Constant

**Location:** chunks.91.mjs:269

```javascript
// ============================================
// TEAM_DELEGATE_TOOLS - Tools available to team delegates
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
WY4 = new Set([TR, lt, it, ck, hI, ER, ed, SW6])

// READABLE (for understanding):
const TEAM_DELEGATE_TOOLS = new Set([
    "TeamCreate",   // TR - Create a team
    "TeamDelete",   // lt - Delete a team
    "TeamList",     // it - List teams
    "TeamChat",     // ck - Send team message
    "TeamStatus",   // hI - Get team status
    "CronCreate",   // ER - Create scheduled job
    "CronDelete",   // ed - Delete scheduled job
    "CronList"      // SW6 - List scheduled jobs
]);

// Mapping: WY4→TEAM_DELEGATE_TOOLS
```

**Why cron tools are included:**
- Teammates may need to schedule recurring status checks
- Each teammate can manage their own cron jobs independently
- Ownership is enforced via `agentId` tagging

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `CronCreateTool` (TbY) - Create scheduled job tool
- `CronDeleteTool` (VbY) - Delete scheduled job tool
- `CronListTool` (ybY) - List scheduled jobs tool
- `isKairosCronEnabled` (kR) - Feature flag check
- `parseCronExpression` (ji6) - Parse cron syntax
- `getNextCronMatch` (IT6) - Calculate next fire time
- `formatCronHumanReadable` (CT6) - Format for display
- `createCronTask` (A7q) - Create task in storage
- `deleteCronTasks` (yz6) - Delete tasks from storage
- `getAllCronTasks` (bT6) - Get all tasks
- `TEAM_DELEGATE_TOOLS` (WY4) - Set of tools available to team delegates

---

**Last Updated**: 2026-03-23
**Version**: Claude Code 2.1.76
**Status**: Complete - All symbols verified against source code, includes team mode integration and error recovery guide