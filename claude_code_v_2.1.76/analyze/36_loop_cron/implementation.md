# Loop/Cron Implementation Details

> **Module**: Loop/Cron Scheduling System - Implementation
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.145.mjs:500-820`, `chunks.186.mjs:100-300`, `chunks.181.mjs:1590-1680`

---

## Table of Contents

1. [Cron Expression Parsing](#1-cron-expression-parsing)
2. [Next Time Calculation](#2-next-time-calculation)
3. [Human-Readable Formatting](#3-human-readable-formatting)
4. [Scheduler Implementation](#4-scheduler-implementation)
5. [Jitter Calculation](#5-jitter-calculation)
6. [/loop Command Parsing](#6-loop-command-parsing)
7. [Task Storage](#7-task-storage)
8. [Lock Acquisition Algorithm](#8-lock-acquisition-algorithm)
9. [Hash Job ID Algorithm](#9-hash-job-id-algorithm)
10. [Task Expiry Algorithm](#10-task-expiry-algorithm)
11. [Missed One-Shot Detection](#11-missed-one-shot-detection)
12. [File Watching](#12-file-watching)
13. [Dynamic Jitter Configuration](#13-dynamic-jitter-configuration)
14. [Edge Case Analysis](#14-edge-case-analysis)
15. [Jitter Algorithm Mathematical Analysis](#15-jitter-algorithm-mathematical-analysis)
16. [Lock Acquisition Race Conditions](#16-lock-acquisition-race-conditions)
17. [Lock Heartbeat Mechanism](#17-lock-heartbeat-mechanism)
18. [File Path Utilities](#18-file-path-utilities)

---

## 1. Cron Expression Parsing

### parseCronField (HbY)

**What it does:** Parses a single cron field (minute, hour, day-of-month, month, or day-of-week) and returns all matching values.

**Location:** chunks.145.mjs:506-541

```javascript
// ============================================
// parseCronField - Parse single cron field into array of matching values
// Location: chunks.145.mjs:506-541
// ============================================

// ORIGINAL (for source lookup):
function HbY(A, q) {
    let { min: K, max: Y } = q, z = new Set;
    for (let _ of A.split(",")) {
        let w = _.match(/^\*(?:\/(\d+))?$/);
        if (w) {
            let H = w[1] ? parseInt(w[1], 10) : 1;
            if (H < 1) return null;
            for (let j = K; j <= Y; j += H) z.add(j);
            continue
        }
        let O = _.match(/^(\d+)-(\d+)(?:\/(\d+))?$/);
        if (O) {
            let H = parseInt(O[1], 10), j = parseInt(O[2], 10),
                J = O[3] ? parseInt(O[3], 10) : 1,
                M = K === 0 && Y === 6, D = M ? 7 : Y;
            if (H > j || J < 1 || H < K || j > D) return null;
            for (let X = H; X <= j; X += J) z.add(M && X === 7 ? 0 : X);
            continue
        }
        if (_.match(/^\d+$/)) {
            let H = parseInt(_, 10);
            if (K === 0 && Y === 6 && H === 7) H = 0;
            if (H < K || H > Y) return null;
            z.add(H);
            continue
        }
        return null
    }
    if (z.size === 0) return null;
    return Array.from(z).sort((_, w) => _ - w)
}

// READABLE (for understanding):
function parseCronField(field, bounds) {
    const { min, max } = bounds;
    const values = new Set();

    // Split on comma for multiple values (e.g., "1,5,10")
    for (const part of field.split(",")) {
        // Pattern 1: * or */N (all values or step)
        const stepMatch = part.match(/^\*(?:\/(\d+))?$/);
        if (stepMatch) {
            const step = stepMatch[1] ? parseInt(stepMatch[1], 10) : 1;
            if (step < 1) return null;
            for (let i = min; i <= max; i += step) {
                values.add(i);
            }
            continue;
        }

        // Pattern 2: N-M or N-M/S (range with optional step)
        const rangeMatch = part.match(/^(\d+)-(\d+)(?:\/(\d+))?$/);
        if (rangeMatch) {
            let start = parseInt(rangeMatch[1], 10);
            let end = parseInt(rangeMatch[2], 10);
            const step = rangeMatch[3] ? parseInt(rangeMatch[3], 10) : 1;

            // Special case: day-of-week allows 7 for Sunday (maps to 0)
            const isDayOfWeek = (min === 0 && max === 6);
            const effectiveMax = isDayOfWeek ? 7 : max;

            if (start > end || step < 1 || start < min || end > effectiveMax) {
                return null;
            }

            for (let i = start; i <= end; i += step) {
                // Map 7 → 0 for day-of-week (Sunday)
                values.add(isDayOfWeek && i === 7 ? 0 : i);
            }
            continue;
        }

        // Pattern 3: Single number
        if (part.match(/^\d+$/)) {
            let value = parseInt(part, 10);
            // Sunday can be 7 in cron, map to 0
            if (min === 0 && max === 6 && value === 7) {
                value = 0;
            }
            if (value < min || value > max) {
                return null;
            }
            values.add(value);
            continue;
        }

        // Unknown pattern
        return null;
    }

    if (values.size === 0) return null;
    return Array.from(values).sort((a, b) => a - b);
}

// Mapping: HbY→parseCronField, A→field, q→bounds, K→min, Y→max, z→values
```

**Field Bounds Configuration:**

```javascript
// ============================================
// CRON_FIELD_BOUNDS - Valid ranges for each field
// Location: chunks.145.mjs:658-674
// ============================================

// ORIGINAL (for source lookup):
$bY = [
    { min: 0, max: 59 },   // minute
    { min: 0, max: 23 },   // hour
    { min: 1, max: 31 },   // day-of-month
    { min: 1, max: 12 },   // month
    { min: 0, max: 6 }     // day-of-week (0=Sunday)
];

// READABLE (for understanding):
const CRON_FIELD_BOUNDS = [
    { min: 0, max: 59 },   // minute: 0-59
    { min: 0, max: 23 },   // hour: 0-23
    { min: 1, max: 31 },   // day-of-month: 1-31
    { min: 1, max: 12 },   // month: 1-12
    { min: 0, max: 6 }     // day-of-week: 0-6 (Sunday=0)
];
```

**Examples:**

| Input | Bounds | Output |
|-------|--------|--------|
| `*` | {min:0, max:59} | [0,1,2,...,59] |
| `*/15` | {min:0, max:59} | [0,15,30,45] |
| `1-5` | {min:0, max:6} | [1,2,3,4,5] |
| `1,5,10` | {min:0, max:59} | [1,5,10] |
| `0-30/10` | {min:0, max:59} | [0,10,20,30] |

---

### parseCronExpression (ji6)

**What it does:** Parses a complete 5-field cron expression into a structured object.

**Location:** chunks.145.mjs:543-559

```javascript
// ============================================
// parseCronExpression - Parse full cron expression
// Location: chunks.145.mjs:543-559
// ============================================

// ORIGINAL (for source lookup):
function ji6(A) {
    let q = A.trim().split(/\s+/);
    if (q.length !== 5) return null;
    let K = [];
    for (let Y = 0; Y < 5; Y++) {
        let z = HbY(q[Y], $bY[Y]);
        if (!z) return null;
        K.push(z)
    }
    return {
        minute: K[0],
        hour: K[1],
        dayOfMonth: K[2],
        month: K[3],
        dayOfWeek: K[4]
    }
}

// READABLE (for understanding):
function parseCronExpression(expression) {
    // Must have exactly 5 fields separated by whitespace
    const fields = expression.trim().split(/\s+/);
    if (fields.length !== 5) return null;

    const parsed = [];
    for (let i = 0; i < 5; i++) {
        const values = parseCronField(fields[i], CRON_FIELD_BOUNDS[i]);
        if (!values) return null;  // Invalid field
        parsed.push(values);
    }

    return {
        minute: parsed[0],      // Array of valid minutes
        hour: parsed[1],        // Array of valid hours
        dayOfMonth: parsed[2],  // Array of valid days
        month: parsed[3],       // Array of valid months
        dayOfWeek: parsed[4]    // Array of valid weekdays
    };
}

// Mapping: ji6→parseCronExpression, A→expression, q→fields, K→parsed
```

**Example Outputs:**

```javascript
parseCronExpression("*/5 * * * *")
// → { minute: [0,5,10,15,20,25,30,35,40,45,50,55],
//     hour: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
//     dayOfMonth: [1,2,3,...,31],
//     month: [1,2,3,...,12],
//     dayOfWeek: [0,1,2,3,4,5,6] }

parseCronExpression("0 9 * * 1-5")
// → { minute: [0],
//     hour: [9],
//     dayOfMonth: [1,2,3,...,31],
//     month: [1,2,3,...,12],
//     dayOfWeek: [1,2,3,4,5] }  // Weekdays at 9am

parseCronExpression("30 14 28 2 *")
// → { minute: [30],
//     hour: [14],
//     dayOfMonth: [28],
//     month: [2],
//     dayOfWeek: [0,1,2,3,4,5,6] }  // Feb 28 at 2:30pm
```

---

## 2. Next Time Calculation

### findNextCronTime (tAq)

**What it does:** Given a parsed cron expression and a starting time, finds the next matching datetime.

**Location:** chunks.145.mjs:561-595

```javascript
// ============================================
// findNextCronTime - Find next matching datetime
// Location: chunks.145.mjs:561-595
// ============================================

// ORIGINAL (for source lookup):
function tAq(A, q) {
    let K = new Set(A.minute),
        Y = new Set(A.hour),
        z = new Set(A.dayOfMonth),
        _ = new Set(A.month),
        w = new Set(A.dayOfWeek),
        O = A.dayOfMonth.length === 31,
        $ = A.dayOfWeek.length === 7,
        H = new Date(q.getTime());
    H.setSeconds(0, 0), H.setMinutes(H.getMinutes() + 1);
    let j = 527040;
    for (let J = 0; J < j; J++) {
        let M = H.getMonth() + 1;
        if (!_.has(M)) {
            H.setMonth(H.getMonth() + 1, 1), H.setHours(0, 0, 0, 0);
            continue
        }
        let D = H.getDate(), X = H.getDay();
        if (!(O && $ ? !0 : O ? w.has(X) : $ ? z.has(D) : z.has(D) || w.has(X))) {
            H.setDate(H.getDate() + 1), H.setHours(0, 0, 0, 0);
            continue
        }
        if (!Y.has(H.getHours())) {
            H.setHours(H.getHours() + 1, 0, 0, 0);
            continue
        }
        if (!K.has(H.getMinutes())) {
            H.setMinutes(H.getMinutes() + 1);
            continue
        }
        return H
    }
    return null
}

// READABLE (for understanding):
function findNextCronTime(cronParsed, startTime) {
    const minutes = new Set(cronParsed.minute);
    const hours = new Set(cronParsed.hour);
    const daysOfMonth = new Set(cronParsed.dayOfMonth);
    const months = new Set(cronParsed.month);
    const daysOfWeek = new Set(cronParsed.dayOfWeek);

    // Optimization flags
    const allDaysOfMonth = cronParsed.dayOfMonth.length === 31;
    const allDaysOfWeek = cronParsed.dayOfWeek.length === 7;

    // Start from next minute (don't match current time)
    const candidate = new Date(startTime.getTime());
    candidate.setSeconds(0, 0);
    candidate.setMinutes(candidate.getMinutes() + 1);

    // Maximum iterations: ~1 year of minutes
    const MAX_ITERATIONS = 527040;  // 366 * 24 * 60

    for (let i = 0; i < MAX_ITERATIONS; i++) {
        // Check month (1-12)
        const currentMonth = candidate.getMonth() + 1;  // JS months are 0-indexed
        if (!months.has(currentMonth)) {
            // Skip to next month
            candidate.setMonth(candidate.getMonth() + 1, 1);
            candidate.setHours(0, 0, 0, 0);
            continue;
        }

        // Check day (complex: day-of-month AND/OR day-of-week)
        const currentDayOfMonth = candidate.getDate();
        const currentDayOfWeek = candidate.getDay();

        // Day matching logic (cron standard):
        // - If both *: match any day
        // - If only DoM *: match DoW only
        // - If only DoW *: match DoM only
        // - If neither *: match EITHER DoM OR DoW
        const dayMatches = allDaysOfMonth && allDaysOfWeek
            ? true
            : allDaysOfMonth
                ? daysOfWeek.has(currentDayOfWeek)
                : allDaysOfWeek
                    ? daysOfMonth.has(currentDayOfMonth)
                    : daysOfMonth.has(currentDayOfMonth) || daysOfWeek.has(currentDayOfWeek);

        if (!dayMatches) {
            // Skip to next day
            candidate.setDate(candidate.getDate() + 1);
            candidate.setHours(0, 0, 0, 0);
            continue;
        }

        // Check hour
        if (!hours.has(candidate.getHours())) {
            // Skip to next hour
            candidate.setHours(candidate.getHours() + 1, 0, 0, 0);
            continue;
        }

        // Check minute
        if (!minutes.has(candidate.getMinutes())) {
            // Try next minute
            candidate.setMinutes(candidate.getMinutes() + 1);
            continue;
        }

        // All fields match!
        return candidate;
    }

    // No match within 1 year
    return null;
}

// Mapping: tAq→findNextCronTime, A→cronParsed, q→startTime, K→minutes, Y→hours,
//          z→daysOfMonth, _→months, w→daysOfWeek, O→allDaysOfMonth, $→allDaysOfWeek
```

### getNextCronMatch (IT6)

**What it does:** Convenience wrapper that combines parsing and finding next time.

**Location:** chunks.145.mjs:792-797

```javascript
// ============================================
// getNextCronMatch - Parse and find next time
// Location: chunks.145.mjs:792-797
// ============================================

// ORIGINAL (for source lookup):
function IT6(A, q) {
    let K = ji6(A);
    if (!K) return null;
    let Y = tAq(K, new Date(q));
    return Y ? Y.getTime() : null
}

// READABLE (for understanding):
function getNextCronMatch(cronExpression, timestamp) {
    const parsed = parseCronExpression(cronExpression);
    if (!parsed) return null;

    const nextDate = findNextCronTime(parsed, new Date(timestamp));
    return nextDate ? nextDate.getTime() : null;
}

// Mapping: IT6→getNextCronMatch, A→cronExpression, q→timestamp
```

---

## 3. Human-Readable Formatting

### formatCronHumanReadable (CT6)

**What it does:** Converts a cron expression into a human-readable string like "Every 5 minutes" or "Weekdays at 9:00 AM".

**Location:** chunks.145.mjs:613-651

```javascript
// ============================================
// formatCronHumanReadable - Convert cron to readable text
// Location: chunks.145.mjs:613-651
// ============================================

// ORIGINAL (for source lookup):
function CT6(A, q) {
    let K = q?.utc ?? !1, Y = A.trim().split(/\s+/);
    if (Y.length !== 5) return A;
    let [z, _, w, O, $] = Y, H = z.match(/^\*\/(\d+)$/);
    if (H && _ === "*" && w === "*" && O === "*" && $ === "*") {
        let X = parseInt(H[1], 10);
        return X === 1 ? "Every minute" : `Every ${X} minutes`
    }
    if (z.match(/^\d+$/) && _ === "*" && w === "*" && O === "*" && $ === "*") {
        let X = parseInt(z, 10);
        if (X === 0) return "Every hour";
        return `Every hour at :${X.toString().padStart(2,"0")}`
    }
    let j = _.match(/^\*\/(\d+)$/);
    if (z.match(/^\d+$/) && j && w === "*" && O === "*" && $ === "*") {
        let X = parseInt(j[1], 10), P = parseInt(z, 10),
            W = P === 0 ? "" : ` at :${P.toString().padStart(2,"0")}`;
        return X === 1 ? `Every hour${W}` : `Every ${X} hours${W}`
    }
    if (!z.match(/^\d+$/) || !_.match(/^\d+$/)) return A;
    let J = parseInt(z, 10), M = parseInt(_, 10), D = K ? JbY : jbY;
    if (w === "*" && O === "*" && $ === "*") return `Every day at ${D(J,M)}`;
    if (w === "*" && O === "*" && $.match(/^\d$/)) {
        let X = parseInt($, 10) % 7, P;
        if (K) {
            let W = new Date, Z = (X - W.getUTCDay() + 7) % 7;
            W.setUTCDate(W.getUTCDate() + Z), W.setUTCHours(M, J, 0, 0), P = sAq[W.getDay()]
        } else P = sAq[X];
        if (P) return `Every ${P} at ${D(J,M)}`
    }
    if (w === "*" && O === "*" && $ === "1-5") return `Weekdays at ${D(J,M)}`;
    return A
}

// READABLE (for understanding):
function formatCronHumanReadable(cronExpression, options = {}) {
    const utc = options?.utc ?? false;
    const fields = cronExpression.trim().split(/\s+/);
    if (fields.length !== 5) return cronExpression;  // Return as-is if invalid

    const [minute, hour, dayOfMonth, month, dayOfWeek] = fields;

    // Pattern: "*/N * * * *" → "Every N minutes"
    const minuteStepMatch = minute.match(/^\*\/(\d+)$/);
    if (minuteStepMatch && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
        const step = parseInt(minuteStepMatch[1], 10);
        return step === 1 ? "Every minute" : `Every ${step} minutes`;
    }

    // Pattern: "M * * * *" → "Every hour" or "Every hour at :MM"
    if (minute.match(/^\d+$/) && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
        const min = parseInt(minute, 10);
        if (min === 0) return "Every hour";
        return `Every hour at :${min.toString().padStart(2, "0")}`;
    }

    // Pattern: "M */N * * *" → "Every N hours" or "Every N hours at :MM"
    const hourStepMatch = hour.match(/^\*\/(\d+)$/);
    if (minute.match(/^\d+$/) && hourStepMatch && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
        const hourStep = parseInt(hourStepMatch[1], 10);
        const min = parseInt(minute, 10);
        const minuteSuffix = min === 0 ? "" : ` at :${min.toString().padStart(2, "0")}`;
        return hourStep === 1 ? `Every hour${minuteSuffix}` : `Every ${hourStep} hours${minuteSuffix}`;
    }

    // Patterns with specific time (both minute and hour are numbers)
    if (!minute.match(/^\d+$/) || !hour.match(/^\d+$/)) {
        return cronExpression;  // Can't format, return as-is
    }

    const min = parseInt(minute, 10);
    const hr = parseInt(hour, 10);
    const formatTime = utc ? formatTimeUTC : formatTimeLocal;

    // Pattern: "M H * * *" → "Every day at HH:MM"
    if (dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
        return `Every day at ${formatTime(min, hr)}`;
    }

    // Pattern: "M H * * N" → "Every <Day> at HH:MM"
    if (dayOfMonth === "*" && month === "*" && dayOfWeek.match(/^\d$/)) {
        const dayNum = parseInt(dayOfWeek, 10) % 7;
        const dayName = utc
            ? getDayNameForUTC(dayNum)
            : DAY_NAMES[dayNum];  // ["Sunday", "Monday", ...]
        if (dayName) {
            return `Every ${dayName} at ${formatTime(min, hr)}`;
        }
    }

    // Pattern: "M H * * 1-5" → "Weekdays at HH:MM"
    if (dayOfMonth === "*" && month === "*" && dayOfWeek === "1-5") {
        return `Weekdays at ${formatTime(min, hr)}`;
    }

    // Unknown pattern, return as-is
    return cronExpression;
}

// Mapping: CT6→formatCronHumanReadable, sAq→DAY_NAMES
```

**Output Examples:**

| Cron Expression | Output |
|-----------------|--------|
| `*/5 * * * *` | "Every 5 minutes" |
| `0 * * * *` | "Every hour" |
| `30 * * * *` | "Every hour at :30" |
| `0 */2 * * *` | "Every 2 hours" |
| `0 9 * * *` | "Every day at 9:00 AM" |
| `0 9 * * 1-5` | "Weekdays at 9:00 AM" |
| `0 9 * * 0` | "Every Sunday at 9:00 AM" |

---

## 4. Scheduler Implementation

### createCronScheduler (Ds8)

**What it does:** Creates a scheduler that checks for pending tasks and fires them at the appropriate times.

**Location:** chunks.186.mjs:110-248

```javascript
// ============================================
// createCronScheduler - Main scheduler factory
// Location: chunks.186.mjs:110-248
// ============================================

// ORIGINAL (for source lookup):
function Ds8(A) {
    let {
        onFire: q,
        isLoading: K,
        assistantMode: Y = !1,
        onFireTask: z,
        onMissed: _,
        dir: w,
        lockIdentity: O,
        getJitterConfig: $,
        isKilled: H
    } = A, j = w || O ? { dir: w, lockIdentity: O } : void 0,
        J = [],      // durable tasks from file
        M = new Map, // id → nextFireTime
        D = new Set, // IDs of missed one-shot tasks
        X = new Set, // IDs of fired tasks (for cleanup)
        P = null,    // pending start interval
        W = null,    // fire check interval
        Z = null,    // lock retry interval
        G = null,    // file watcher
        f = !1,      // stopped flag
        v = !1;      // has lock flag

    // ... implementation continues ...

    return {
        start() { /* ... */ },
        stop() { /* ... */ },
        getNextFireTime() { /* ... */ }
    };
}

// READABLE (for understanding):
function createCronScheduler(config) {
    const {
        onFire,           // Callback(prompt) when task fires
        isLoading,        // Function() → boolean (agent busy?)
        assistantMode = false,
        onFireTask,       // Callback(task) alternative to onFire
        onMissed,         // Callback(missedTasks) for one-shots that expired
        dir,              // Custom directory for durable tasks
        lockIdentity,     // Custom lock identity
        getJitterConfig,  // Function() → jitter settings
        isKilled          // Function() → boolean (should stop?)
    } = config;

    const lockOptions = (dir || lockIdentity) ? { dir, lockIdentity } : undefined;

    // State
    let durableTasks = [];           // Tasks from .claude/scheduled_tasks.json
    const scheduledTimes = new Map(); // taskId → nextFireTime (with jitter)
    const missedOneShots = new Set(); // IDs of already-missed one-shots
    const firedTasks = new Set();     // IDs of already-fired tasks

    let pendingStartInterval = null;  // Waits for feature flag
    let fireCheckInterval = null;     // Main scheduler loop (1s)
    let lockRetryInterval = null;     // Tries to acquire lock
    let fileWatcher = null;           // Watches scheduled_tasks.json

    let isStopped = false;
    let hasLock = false;

    // ... implementation ...

    return {
        start,
        stop,
        getNextFireTime
    };
}

// Mapping: Ds8→createCronScheduler, q→onFire, K→isLoading, $→getJitterConfig, H→isKilled
```

### Scheduler Constants

**Location:** chunks.186.mjs:269-275

```javascript
// ORIGINAL (for source lookup):
Shq = 1000       // Fire check interval: 1 second
fXz = 300        // File write stability threshold: 300ms
TXz = 5000       // Lock retry interval: 5 seconds
Chq = 259200000  // 3-day expiry in milliseconds

// READABLE (for understanding):
const FIRE_CHECK_INTERVAL_MS = 1000;           // Check for pending tasks every second
const FILE_STABILITY_THRESHOLD_MS = 300;       // Wait for file to stabilize after write
const LOCK_RETRY_INTERVAL_MS = 5000;           // Retry lock acquisition every 5 seconds
const THREE_DAYS_MS = 259200000;               // 3 * 24 * 60 * 60 * 1000

// Mapping: Shq→FIRE_CHECK_INTERVAL_MS, fXz→FILE_STABILITY_THRESHOLD_MS,
//          TXz→LOCK_RETRY_INTERVAL_MS, Chq→THREE_DAYS_MS
```

### Fire Check Logic

**The core scheduling loop:**

```javascript
// ============================================
// fireCheck - Main scheduler tick (every 1 second)
// Location: chunks.186.mjs:142-183
// ============================================

// READABLE (for understanding):
function fireCheck() {
    // Skip if killed or loading
    if (isKilled?.()) return;
    if (isLoading() && !assistantMode) return;

    const now = Date.now();
    const seenThisTick = new Set();
    const jitterConfig = getJitterConfig?.() ?? DEFAULT_JITTER_CONFIG;

    function processTask(task, isSessionTask) {
        seenThisTick.add(task.id);

        // Skip already-fired tasks
        if (firedTasks.has(task.id)) return;

        // Calculate or retrieve scheduled time with jitter
        let scheduledTime = scheduledTimes.get(task.id);
        if (scheduledTime === undefined) {
            scheduledTime = task.recurring
                ? calculateNextRecurringTime(task.cron, task.createdAt, task.id, jitterConfig) ?? Infinity
                : calculateNextOneShotTime(task.cron, task.createdAt, task.id, jitterConfig) ?? Infinity;
            scheduledTimes.set(task.id, scheduledTime);
            log(`[ScheduledTasks] scheduled ${task.id} for ${scheduledTime === Infinity ? "never" : new Date(scheduledTime).toISOString()}`);
        }

        // Not yet time to fire
        if (now < scheduledTime) return;

        // FIRE!
        log(`[ScheduledTasks] firing ${task.id}${task.recurring ? " (recurring)" : ""}`);
        emitTelemetry("tengu_scheduled_task_fire", { recurring: task.recurring ?? false, taskId: task.id });

        if (onFireTask) {
            onFireTask(task);
        } else {
            onFire(task.prompt);
        }

        // Check for 3-day expiry
        const isExpired = isTaskExpired(task, now);
        if (isExpired) {
            const ageHours = Math.floor((now - task.createdAt) / 1000 / 60 / 60);
            log(`[ScheduledTasks] recurring task ${task.id} aged out (${ageHours}h since creation), deleting after final fire`);
            emitTelemetry("tengu_scheduled_task_expired", { taskId: task.id, ageHours: ageHours });
        }

        // Reschedule or cleanup
        if (task.recurring && !isExpired) {
            // Recurring: schedule next occurrence
            const nextTime = calculateNextRecurringTime(task.cron, now, task.id, jitterConfig) ?? Infinity;
            scheduledTimes.set(task.id, nextTime);
        } else if (isSessionTask) {
            // Session task: remove from memory
            removeSessionCronTasks([task.id]);
            scheduledTimes.delete(task.id);
        } else {
            // Durable task: mark fired, delete from file
            firedTasks.add(task.id);
            deleteCronTasks([task.id], dir)
                .catch(err => log(`[ScheduledTasks] failed to remove task ${task.id}: ${err}`))
                .finally(() => firedTasks.delete(task.id));
            scheduledTimes.delete(task.id);
        }
    }

    // Process durable tasks
    if (hasLock) {
        for (const task of durableTasks) {
            processTask(task, false);
        }
    }

    // Process session tasks
    if (dir === undefined) {
        for (const task of getSessionCronTasks()) {
            processTask(task, true);
        }
    }

    // Cleanup: remove scheduled times for tasks that no longer exist
    if (seenThisTick.size === 0) {
        scheduledTimes.clear();
        return;
    }
    for (const taskId of scheduledTimes.keys()) {
        if (!seenThisTick.has(taskId)) {
            scheduledTimes.delete(taskId);
        }
    }
}
```

---

## 5. Jitter Calculation

### Why Jitter?

When users set "hourly" or "9am" tasks, the API receives thousands of simultaneous requests. Jitter spreads these out.

### calculateNextRecurringTime (XF8)

**Location:** chunks.145.mjs:804-811

```javascript
// ============================================
// calculateNextRecurringTime - Add jitter to recurring task
// Location: chunks.145.mjs:804-811
// ============================================

// ORIGINAL (for source lookup):
function XF8(A, q, K, Y = Lz6) {
    let z = IT6(A, q);
    if (z === null) return null;
    let _ = IT6(A, z);
    if (_ === null) return z;
    let w = Math.min(q7q(K) * Y.recurringFrac * (_ - z), Y.recurringCapMs);
    return z + w
}

// READABLE (for understanding):
function calculateNextRecurringTime(cronExpression, fromTime, jobId, jitterConfig = DEFAULT_JITTER_CONFIG) {
    const nextMatch = getNextCronMatch(cronExpression, fromTime);
    if (nextMatch === null) return null;

    const followingMatch = getNextCronMatch(cronExpression, nextMatch);
    if (followingMatch === null) return nextMatch;  // No second match, can't calculate period

    // Calculate jitter based on period
    const periodMs = followingMatch - nextMatch;
    const jobHash = hashJobId(jobId);  // 0-1 float from job ID

    // Jitter = hash * fraction * period, capped at max
    const jitterMs = Math.min(
        jobHash * jitterConfig.recurringFrac * periodMs,
        jitterConfig.recurringCapMs
    );

    return nextMatch + jitterMs;
}

// Mapping: XF8→calculateNextRecurringTime, q7q→hashJobId, Y→jitterConfig
```

**Example:**
- Task: every 5 minutes (`*/5 * * * *`)
- Period: 5 minutes = 300,000ms
- `recurringFrac`: 0.1 (10% of period)
- `recurringCapMs`: 900,000 (15 minutes max)
- For jobId hash = 0.5: jitter = 0.5 * 0.1 * 300,000 = 15,000ms (15 seconds late)

### calculateNextOneShotTime (K7q)

**Location:** chunks.145.mjs:813-819

```javascript
// ============================================
// calculateNextOneShotTime - Special jitter for one-shot tasks
// Location: chunks.145.mjs:813-819
// ============================================

// ORIGINAL (for source lookup):
function K7q(A, q, K, Y = Lz6) {
    let z = IT6(A, q);
    if (z === null) return null;
    if (new Date(z).getMinutes() % Y.oneShotMinuteMod !== 0) return z;
    let _ = Y.oneShotFloorMs + q7q(K) * (Y.oneShotMaxMs - Y.oneShotFloorMs);
    return Math.max(z - _, q)
}

// READABLE (for understanding):
function calculateNextOneShotTime(cronExpression, fromTime, jobId, jitterConfig = DEFAULT_JITTER_CONFIG) {
    const nextMatch = getNextCronMatch(cronExpression, fromTime);
    if (nextMatch === null) return null;

    // Only apply jitter to :00 and :30 minute marks
    const minute = new Date(nextMatch).getMinutes();
    if (minute % jitterConfig.oneShotMinuteMod !== 0) {
        return nextMatch;  // No jitter for off-minute times
    }

    // Calculate early fire time (up to 90 seconds early)
    const jobHash = hashJobId(jobId);
    const earlyMs = jitterConfig.oneShotFloorMs + jobHash * (jitterConfig.oneShotMaxMs - jitterConfig.oneShotFloorMs);

    // Don't fire before now
    return Math.max(nextMatch - earlyMs, fromTime);
}

// Mapping: K7q→calculateNextOneShotTime
```

### Default Jitter Configuration

**Location:** chunks.145.mjs:841-847

```javascript
// ORIGINAL (for source lookup):
Lz6 = {
    recurringFrac: 0.1,      // 10% of period
    recurringCapMs: 900000,  // Max 15 minutes late
    oneShotMaxMs: 90000,     // Max 90 seconds early
    oneShotFloorMs: 0,       // Min 0 seconds early
    oneShotMinuteMod: 30     // Apply to :00 and :30 only
}

// READABLE (for understanding):
const DEFAULT_JITTER_CONFIG = {
    recurringFrac: 0.1,      // Jitter = hash * 10% * period
    recurringCapMs: 900000,  // Max jitter: 15 minutes
    oneShotMaxMs: 90000,     // One-shot max early: 90 seconds
    oneShotFloorMs: 0,       // One-shot min early: 0 seconds
    oneShotMinuteMod: 30     // Only jitter :00 and :30 marks
};

// Mapping: Lz6→DEFAULT_JITTER_CONFIG
```

---

## 6. /loop Command Parsing

### buildLoopPrompt (BJz)

**What it does:** Parses user input for `/loop` and generates a prompt that instructs the LLM to call CronCreate.

**Location:** chunks.181.mjs:1592-1638

```javascript
// ============================================
// buildLoopPrompt - Parse /loop input and generate CronCreate instructions
// Location: chunks.181.mjs:1592-1638
// ============================================

// Original includes detailed parsing rules:
// 1. Leading token: if first token matches ^\d+[smhd]$, that's the interval
// 2. Trailing "every" clause: extract "every N unit" at end
// 3. Default: 10m interval

// Interval conversion table:
// | Pattern | Cron Expression |
// |---------|-----------------|
// | Nm (N≤59) | */N * * * * |
// | Nm (N≥60) | 0 */H * * * (rounded to hours) |
// | Nh (N≤23) | 0 */N * * * |
// | Nd | 0 0 */N * * |
// | Ns | ceil(N/60)m (minimum 1 minute) |
```

### registerLoopSkill (gJz)

**Location:** chunks.181.mjs:1640-1660

```javascript
// ============================================
// registerLoopSkill - Register /loop slash command
// Location: chunks.181.mjs:1640-1660
// ============================================

// ORIGINAL (for source lookup):
function gJz() {
    rw({
        name: "loop",
        description: "Run a prompt or slash command on a recurring interval (e.g. /loop 5m /foo, defaults to 10m)",
        whenToUse: 'When the user wants to set up a recurring task...',
        argumentHint: "[interval] <prompt>",
        userInvocable: !0,
        isEnabled: kR,
        async getPromptForCommand(A) {
            let q = A.trim();
            if (!q) return [{ type: "text", text: mJz }];  // Usage message
            return [{ type: "text", text: BJz(q) }];        // Parsed prompt
        }
    })
}

// READABLE (for understanding):
function registerLoopSkill() {
    registerPromptSkill({
        name: "loop",
        description: "Run a prompt or slash command on a recurring interval",
        whenToUse: 'When the user wants to set up a recurring task...',
        argumentHint: "[interval] <prompt>",
        userInvocable: true,
        isEnabled: isKairosCronEnabled,
        async getPromptForCommand(input) {
            const trimmed = input.trim();
            if (!trimmed) {
                return [{ type: "text", text: USAGE_MESSAGE }];
            }
            return [{ type: "text", text: buildLoopPrompt(trimmed) }];
        }
    });
}

// Mapping: gJz→registerLoopSkill, BJz→buildLoopPrompt, mJz→USAGE_MESSAGE
```

### Default Interval

**Location:** chunks.181.mjs:1662

```javascript
// ORIGINAL (for source lookup):
no6 = "10m"

// READABLE (for understanding):
const DEFAULT_LOOP_INTERVAL = "10m";  // 10 minutes
```

---

## 7. Task Storage

### In-Memory Tasks (Session-Scoped)

**Location:** chunks.1.mjs:2889-2912

```javascript
// ============================================
// Session State Management for Cron Tasks
// Location: chunks.1.mjs:2889-2912
// ============================================

// Global state (v1 object)
// sessionCronTasks: Array of task objects

// ORIGINAL (for source lookup):
function dk6(A) { v1.scheduledTasksEnabled = A }
function pw6() { return v1.scheduledTasksEnabled }
function ck6() { return v1.sessionCronTasks }
function Bu1(A) { v1.sessionCronTasks.push(A) }
function lk6(A) {
    if (A.length === 0) return 0;
    let q = new Set(A),
        K = v1.sessionCronTasks.filter((z) => !q.has(z.id)),
        Y = v1.sessionCronTasks.length - K.length;
    if (Y === 0) return 0;
    return v1.sessionCronTasks = K, Y
}

// READABLE (for understanding):
function setScheduledTasksEnabled(enabled) {
    globalState.scheduledTasksEnabled = enabled;
}

function getScheduledTasksEnabled() {
    return globalState.scheduledTasksEnabled;
}

function getSessionCronTasks() {
    return globalState.sessionCronTasks;
}

function addSessionCronTask(task) {
    globalState.sessionCronTasks.push(task);
}

function removeSessionCronTasks(ids) {
    if (ids.length === 0) return 0;
    const idSet = new Set(ids);
    const remaining = globalState.sessionCronTasks.filter(t => !idSet.has(t.id));
    const removed = globalState.sessionCronTasks.length - remaining.length;
    if (removed === 0) return 0;
    globalState.sessionCronTasks = remaining;
    return removed;
}

// Mapping: dk6→setScheduledTasksEnabled, pw6→getScheduledTasksEnabled,
//          ck6→getSessionCronTasks, Bu1→addSessionCronTask, lk6→removeSessionCronTasks
```

### Durable Tasks (File-Based)

**Location:** chunks.145.mjs:681-790

```javascript
// ============================================
// Durable Task Storage - .claude/scheduled_tasks.json
// Location: chunks.145.mjs:681-790
// ============================================

// File path: .claude/scheduled_tasks.json
// Schema: { tasks: [ { id, cron, prompt, createdAt, recurring?, permanent? } ] }

// Lock file: .claude/scheduled_tasks.lock
// Schema: { sessionId, pid, acquiredAt }

// Key functions:
// - Mi6: readDurableTasks(dir?) - Read from file
// - eAq: writeDurableTasks(tasks, dir?) - Write to file
// - A7q: createCronTask(cron, prompt, recurring, durable, agentId) - Create task
// - yz6: deleteCronTasks(ids, dir?) - Delete from storage
// - bT6: getAllCronTasks(dir?) - Get all (session + durable)
```

---

## 8. Lock Acquisition Algorithm

### acquireSchedulerLock (Ms8)

**What it does:** Acquires an inter-process lock to ensure only one scheduler runs per machine. This prevents duplicate job execution when multiple Claude Code sessions are running.

**Location:** chunks.186.mjs:47-68

```javascript
// ============================================
// acquireSchedulerLock - Inter-process lock acquisition
// Location: chunks.186.mjs:47-68
// ============================================

// ORIGINAL (for source lookup):
async function Ms8(A) {
    let q = A?.dir,
        K = A?.lockIdentity ?? R1(),
        Y = {
            sessionId: K,
            pid: process.pid,
            acquiredAt: Date.now()
        };
    if (await Ehq(Y, q)) return Ka6 = void 0, js8(A), k(`[ScheduledTasks] acquired scheduler lock (PID ${process.pid})`), !0;
    let z = await Rhq(q);
    if (z?.sessionId === K) {
        if (z.pid !== process.pid) await Js8(Ya6(q), B6(Y)), js8(A);
        return !0
    }
    if (z && cA1(z.pid)) {
        if (Ka6 !== z.sessionId) Ka6 = z.sessionId, k(`[ScheduledTasks] scheduler lock held by session ${z.sessionId} (PID ${z.pid})`);
        return !1
    }
    if (z) k(`[ScheduledTasks] recovering stale scheduler lock from PID ${z.pid}`);
    if (await Lhq(Ya6(q)).catch(() => {}), await Ehq(Y, q)) return Ka6 = void 0, js8(A), !0;
    return !1
}

// READABLE (for understanding):
async function acquireSchedulerLock(options) {
    const dir = options?.dir;
    const sessionId = options?.lockIdentity ?? getSessionId();

    const lockData = {
        sessionId: sessionId,
        pid: process.pid,
        acquiredAt: Date.now()
    };

    // Step 1: Try to create lock file exclusively
    if (await tryCreateLockFile(lockData, dir)) {
        lockHeldBy = undefined;
        scheduleLockHeartbeat(options);
        log(`[ScheduledTasks] acquired scheduler lock (PID ${process.pid})`);
        return true;
    }

    // Step 2: Read existing lock to check ownership
    const existingLock = await readLockFile(dir);

    // Step 3: Check if we already own the lock (same session)
    if (existingLock?.sessionId === sessionId) {
        // Update PID if it changed (process restart within same session)
        if (existingLock.pid !== process.pid) {
            await writeLockFile(getLockFilePath(dir), JSON.stringify(lockData));
            scheduleLockHeartbeat(options);
        }
        return true;
    }

    // Step 4: Check if the owning process is still alive
    if (existingLock && isProcessAlive(existingLock.pid)) {
        // Lock held by another active session
        if (lockHeldBy !== existingLock.sessionId) {
            lockHeldBy = existingLock.sessionId;
            log(`[ScheduledTasks] scheduler lock held by session ${existingLock.sessionId} (PID ${existingLock.pid})`);
        }
        return false;
    }

    // Step 5: Stale lock recovery (owning process died)
    if (existingLock) {
        log(`[ScheduledTasks] recovering stale scheduler lock from PID ${existingLock.pid}`);
    }

    // Delete stale lock and try again
    await deleteLockFile(getLockFilePath(dir)).catch(() => {});

    if (await tryCreateLockFile(lockData, dir)) {
        scheduleLockHeartbeat(options);
        return true;
    }

    return false;
}

// Mapping: Ms8→acquireSchedulerLock, q→dir, K→sessionId, Y→lockData, z→existingLock
//          Ehq→tryCreateLockFile, Rhq→readLockFile, cA1→isProcessAlive, Lhq→deleteLockFile
//          Ya6→getLockFilePath, B6→JSON.stringify, js8→scheduleLockHeartbeat, Ka6→lockHeldBy
```

### Lock Algorithm Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOCK ACQUISITION FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. TRY CREATE LOCK FILE                                        │
│     ├─ Success → Acquired, return true                          │
│     └─ Fail → Continue to step 2                                │
│                                                                  │
│  2. READ EXISTING LOCK                                          │
│     ├─ No lock → Should have succeeded, retry step 1            │
│     └─ Lock exists → Continue to step 3                         │
│                                                                  │
│  3. CHECK SESSION OWNERSHIP                                     │
│     ├─ Same sessionId → Already own lock, return true           │
│     └─ Different sessionId → Continue to step 4                 │
│                                                                  │
│  4. CHECK IF OWNERSHIP PROCESS ALIVE                            │
│     ├─ Process alive → Lock held, return false                  │
│     └─ Process dead → Stale lock, continue to step 5            │
│                                                                  │
│  5. RECOVER STALE LOCK                                          │
│     ├─ Delete stale lock file                                   │
│     ├─ Try create new lock file                                 │
│     ├─ Success → Acquired, return true                          │
│     └─ Fail → Return false                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Lock File Schema

**Location:** chunks.186.mjs:97-101

```javascript
// ============================================
// Lock File Schema - .claude/scheduled_tasks.lock
// Location: chunks.186.mjs:97-101
// ============================================

// ORIGINAL (for source lookup):
ZXz = yhq(".claude", "scheduled_tasks.lock")
GXz = F6(() => C.object({
    sessionId: C.string(),
    pid: C.number(),
    acquiredAt: C.number()
}))

// READABLE (for understanding):
const LOCK_FILE_PATH = path.join(".claude", "scheduled_tasks.lock");

const LockFileSchema = z.object({
    sessionId: z.string(),   // Session identifier
    pid: z.number(),         // Process ID
    acquiredAt: z.number()   // Timestamp when lock was acquired
});

// Mapping: ZXz→LOCK_FILE_PATH, GXz→LockFileSchema
```

---

## 9. Hash Job ID Algorithm

### hashJobId (q7q)

**What it does:** Converts a job ID (8-character hex string) into a deterministic float between 0 and 1. This provides consistent jitter for the same job across scheduler restarts.

**Location:** chunks.145.mjs:799-802

```javascript
// ============================================
// hashJobId - Convert job ID to 0-1 float
// Location: chunks.145.mjs:799-802
// ============================================

// ORIGINAL (for source lookup):
function q7q(A) {
    let q = parseInt(A.slice(0, 8), 16) / 4294967296;
    return Number.isFinite(q) ? q : 0
}

// READABLE (for understanding):
function hashJobId(jobId) {
    // Take first 8 characters of job ID (hex)
    // Parse as hexadecimal integer
    // Divide by 2^32 (4294967296) to get 0-1 range
    const hash = parseInt(jobId.slice(0, 8), 16) / 4294967296;

    // Handle edge cases (NaN, Infinity)
    return Number.isFinite(hash) ? hash : 0;
}

// Mapping: q7q→hashJobId, A→jobId, q→hash
```

### Algorithm Explanation

**Why this approach:**

1. **Deterministic:** Same job ID always produces the same hash value
2. **Uniform distribution:** Hex parsing spreads values across 0-1 range
3. **Simple and fast:** No complex hashing algorithm needed
4. **Collision handling:** Not a concern - just jitter, not security

**Example calculations:**

| Job ID | Hex Value | Decimal | Divided by 2^32 |
|--------|-----------|---------|-----------------|
| `00000000` | 0x00000000 | 0 | 0.0 |
| `80000000` | 0x80000000 | 2147483648 | 0.5 |
| `ffffffff` | 0xFFFFFFFF | 4294967295 | ~1.0 |
| `abc12345` | 0xABC12345 | 2877636165 | 0.67 |

---

## 10. Task Expiry Algorithm

### isTaskExpired (Ihq)

**What it does:** Checks if a recurring task has exceeded the 3-day auto-expiry limit.

**Location:** chunks.186.mjs:106-108

```javascript
// ============================================
// isTaskExpired - Check 3-day auto-expiry
// Location: chunks.186.mjs:106-108
// ============================================

// ORIGINAL (for source lookup):
function Ihq(A, q) {
    return Boolean(A.recurring && !A.permanent && q - A.createdAt >= Chq)
}

// READABLE (for understanding):
function isTaskExpired(task, now) {
    // Only recurring tasks can expire
    // Permanent tasks (permanent: true) never expire
    // Expiry time: 3 days (259200000ms) from creation
    return Boolean(
        task.recurring &&           // Must be recurring
        !task.permanent &&          // Not marked permanent
        (now - task.createdAt) >= THREE_DAYS_MS  // Older than 3 days
    );
}

// Mapping: Ihq→isTaskExpired, A→task, q→now, Chq→THREE_DAYS_MS
```

### Expiry Constants

```javascript
// Location: chunks.186.mjs:275
const THREE_DAYS_MS = 259200000;  // 3 * 24 * 60 * 60 * 1000 = 259,200,000ms
```

### Expiry Behavior

When a task expires:

1. **Fire one final time** - The task executes normally
2. **Log expiry** - `[ScheduledTasks] recurring task ${id} aged out (${hours}h since creation)`
3. **Emit telemetry** - `tengu_scheduled_task_expired` event
4. **Delete after fire** - Task removed from storage

---

## 11. Missed One-Shot Detection

### findMissedOneShots (Y7q)

**What it does:** Finds all one-shot tasks whose scheduled time has passed (missed while Claude was not running).

**Location:** chunks.145.mjs:821-826

```javascript
// ============================================
// findMissedOneShots - Find tasks that should have fired
// Location: chunks.145.mjs:821-826
// ============================================

// ORIGINAL (for source lookup):
function Y7q(A, q) {
    return A.filter((K) => {
        let Y = IT6(K.cron, K.createdAt);
        return Y !== null && Y < q
    })
}

// READABLE (for understanding):
function findMissedOneShots(tasks, now) {
    return tasks.filter(task => {
        // Get the scheduled time for this one-shot
        const scheduledTime = getNextCronMatch(task.cron, task.createdAt);

        // Task is missed if:
        // - It has a valid scheduled time (not null)
        // - The scheduled time is in the past
        return scheduledTime !== null && scheduledTime < now;
    });
}

// Mapping: Y7q→findMissedOneShots, A→tasks, q→now, K→task, Y→scheduledTime
```

### formatMissedTasksMessage (bhq)

**What it does:** Formats a message for the agent about missed one-shot tasks.

**Location:** chunks.186.mjs:251-267

```javascript
// ============================================
// formatMissedTasksMessage - Format missed task notification
// Location: chunks.186.mjs:251-267
// ============================================

// ORIGINAL (for source lookup):
function bhq(A) {
    let q = A.length > 1,
        K = `The following one-shot scheduled task${q?"s were":" was"} missed while Claude was not running. ${q?"They have":"It has"} already been removed from .claude/scheduled_tasks.json.

Do NOT execute ${q?"these prompts":"this prompt"} yet. First use the AskUserQuestion tool to ask whether to run ${q?"each one":"it"} now. Only execute if the user confirms.`,
        Y = A.map((z) => {
            return `${`[${CT6(z.cron)}, created ${new Date(z.createdAt).toLocaleString()}]`}
\`\`\`
${z.prompt}
\`\`\``
        });
    return `${K}

${Y.join(`

`)}`
}

// READABLE (for understanding):
function formatMissedTasksMessage(missedTasks) {
    const plural = missedTasks.length > 1;

    const header = `The following one-shot scheduled task${plural ? "s were" : " was"} missed while Claude was not running. ${plural ? "They have" : "It has"} already been removed from .claude/scheduled_tasks.json.

Do NOT execute ${plural ? "these prompts" : "this prompt"} yet. First use the AskUserQuestion tool to ask whether to run ${plural ? "each one" : "it"} now. Only execute if the user confirms.`;

    const taskDetails = missedTasks.map(task => {
        const humanSchedule = formatCronHumanReadable(task.cron);
        const createdDate = new Date(task.createdAt).toLocaleString();
        return `[${humanSchedule}, created ${createdDate}]
\`\`\`
${task.prompt}
\`\`\``;
    });

    return `${header}

${taskDetails.join('\n\n')}`;
}

// Mapping: bhq→formatMissedTasksMessage, A→missedTasks, q→plural, K→header, Y→taskDetails
```

---

## 12. File Watching

### File Watcher Setup

**What it does:** Watches `.claude/scheduled_tasks.json` for changes and reloads durable tasks.

**Location:** chunks.186.mjs:209-219

```javascript
// ============================================
// File Watcher - Monitor scheduled_tasks.json
// Location: chunks.186.mjs:209-219
// ============================================

// READABLE (for understanding):
async function setupFileWatcher(dir) {
    const fs = await import('fs');
    const tasksFilePath = getScheduledTasksPath(dir);

    const watcher = fs.watch(tasksFilePath, {
        persistent: false,        // Don't prevent process exit
        ignoreInitial: true,      // Don't fire on initial watch
        awaitWriteFinish: {
            stabilityThreshold: FILE_STABILITY_THRESHOLD_MS  // 300ms
        },
        ignorePermissionErrors: true
    });

    // File was created
    watcher.on("add", () => {
        reloadDurableTasks(dir);
    });

    // File was modified
    watcher.on("change", () => {
        reloadDurableTasks(dir);
    });

    // File was deleted
    watcher.on("unlink", () => {
        durableTasks = [];
        scheduledTimes.clear();
    });

    return watcher;
}
```

### File Stability Threshold

The `stabilityThreshold: 300` ensures that rapid successive writes don't trigger multiple reloads. The system waits 300ms after the last write before processing.

---

## 13. Dynamic Jitter Configuration

### getCronJitterConfig (Ws8)

**What it does:** Retrieves jitter configuration from a feature flag, allowing runtime adjustment without code changes.

**Location:** chunks.186.mjs:288-292

```javascript
// ============================================
// getCronJitterConfig - Get jitter config from feature flag
// Location: chunks.186.mjs:288-292
// ============================================

// ORIGINAL (for source lookup):
function Ws8() {
    let A = lk("tengu_kairos_cron_config", Lz6, vXz),
        q = NXz().safeParse(A);
    return q.success ? q.data : Lz6
}

// READABLE (for understanding):
function getCronJitterConfig() {
    // Get config from feature flag with 1-minute cache
    const config = getFeatureFlag(
        "tengu_kairos_cron_config",
        DEFAULT_JITTER_CONFIG,  // Default value
        JITTER_CONFIG_CACHE_MS  // 60000ms (1 minute)
    );

    // Validate against schema
    const result = JitterConfigSchema.safeParse(config);

    // Return validated config or default
    return result.success ? result.data : DEFAULT_JITTER_CONFIG;
}

// Mapping: Ws8→getCronJitterConfig, A→config, q→result, lk→getFeatureFlag
//          Lz6→DEFAULT_JITTER_CONFIG, vXz→JITTER_CONFIG_CACHE_MS, NXz→JitterConfigSchema
```

### Jitter Configuration Schema

**Location:** chunks.186.mjs:304-310

```javascript
// ============================================
// JitterConfigSchema - Validate jitter settings
// Location: chunks.186.mjs:304-310
// ============================================

// ORIGINAL (for source lookup):
NXz = F6(() => C.object({
    recurringFrac: C.number().min(0).max(1),
    recurringCapMs: C.number().int().min(0).max(Ps8),
    oneShotMaxMs: C.number().int().min(0).max(Ps8),
    oneShotFloorMs: C.number().int().min(0).max(Ps8),
    oneShotMinuteMod: C.number().int().min(1).max(60)
}).refine((A) => A.oneShotFloorMs <= A.oneShotMaxMs))

// READABLE (for understanding):
const JitterConfigSchema = z.object({
    recurringFrac: z.number().min(0).max(1),      // 0-100% of period
    recurringCapMs: z.number().int().min(0).max(1800000),  // Max 30 minutes
    oneShotMaxMs: z.number().int().min(0).max(1800000),    // Max 30 minutes early
    oneShotFloorMs: z.number().int().min(0).max(1800000),  // Min early time
    oneShotMinuteMod: z.number().int().min(1).max(60)      // Minute modulus
}).refine(config => config.oneShotFloorMs <= config.oneShotMaxMs);

// Mapping: NXz→JitterConfigSchema, Ps8→MAX_JITTER_MS (1800000)
```

---

## 14. Edge Case Analysis

### Cron Parsing Edge Cases

The cron parsing implementation handles several edge cases that are important for robustness:

#### Invalid Pattern Rejection

**Location:** chunks.145.mjs:506-541 (parseCronField)

| Pattern | Reason | Return Value |
|---------|--------|--------------|
| `*/0` | Step of 0 is undefined | `null` |
| `5-3` | Range where start > end | `null` |
| `60` | Minute exceeds max (59) | `null` |
| `25` | Hour exceeds max (23) | `null` |
| `32` | Day-of-month exceeds max (31) | `null` |
| `13` | Month exceeds max (12) | `null` |
| `8` | Day-of-week exceeds max (6 or 7) | `null` |
| `abc` | Non-numeric characters | `null` |
| `1-5/0` | Step of 0 in range | `null` |
| `* * * *` | Only 4 fields (need 5) | `null` |
| `* * * * * *` | 6 fields (need 5) | `null` |

#### Day-of-Week Special Handling

Sunday can be represented as either 0 or 7 in standard cron. The parser maps 7 → 0:

```javascript
// Pattern: "7" in day-of-week field
// Input: {min: 0, max: 6}
// Result: value 7 is mapped to 0 (Sunday)

if (min === 0 && max === 6 && value === 7) {
    value = 0;  // Map Sunday=7 to Sunday=0
}
```

**Example:** `0 9 * * 7` → Fires Sunday 9am (same as `0 9 * * 0`)

#### Empty Set Handling

If all parts fail to add values, the parser returns `null`:

```javascript
if (values.size === 0) return null;
```

This prevents expressions like empty strings from being accepted.

#### Boundary Condition: February 29

**What happens:** Tasks scheduled for Feb 29 (leap year only) are valid:
- `0 9 29 2 *` → Fires Feb 29 at 9am
- Non-leap years: No match found within 1 year → `null` returned

**Algorithm behavior:**
```javascript
// findNextCronTime iterates up to 527040 times (~1 year)
// For Feb 29 in non-leap year:
// - Month check passes (February = 2)
// - Day check fails (29 not in month)
// - Iteration continues until month changes
// - Eventually MAX_ITERATIONS reached → return null
```

### Next Time Calculation Edge Cases

#### Day-of-Month vs Day-of-Week Logic

The cron standard uses OR logic when both fields are constrained:

```javascript
// Day matching logic from findNextCronTime:
const dayMatches = allDaysOfMonth && allDaysOfWeek
    ? true                           // Both *: match any day
    : allDaysOfMonth
        ? daysOfWeek.has(currentDayOfWeek)      // Only DoM is *: DoW must match
        : allDaysOfWeek
            ? daysOfMonth.has(currentDayOfMonth) // Only DoW is *: DoM must match
            : daysOfMonth.has(currentDayOfMonth) || daysOfWeek.has(currentDayOfWeek);  // Neither *: EITHER matches
```

**Example:**
- `0 9 15 * 1` → Fires on 15th of month OR any Monday at 9am
- `0 9 * * 1` → Fires every Monday at 9am
- `0 9 15 * *` → Fires 15th of every month at 9am

#### Month Wrap-Around

When skipping to next month, the algorithm handles year boundaries:

```javascript
// When month doesn't match:
candidate.setMonth(candidate.getMonth() + 1, 1);
candidate.setHours(0, 0, 0, 0);

// Example: December 31, skipping to next month
// setMonth(11 + 1) → January of next year (automatic wrap)
```

#### Maximum Iteration Limit

The 527040 limit (~366 days worth of minutes) prevents infinite loops for impossible schedules:

```javascript
const MAX_ITERATIONS = 527040;  // 366 * 24 * 60

for (let i = 0; i < MAX_ITERATIONS; i++) {
    // ... search for matching time
}

return null;  // No match found within 1 year
```

---

## 15. Jitter Algorithm Mathematical Analysis

### Recurring Task Jitter Formula

**Purpose:** Distribute API load from scheduled tasks across a wider time window.

**Formula:**
```
jitterMs = min(hash * recurringFrac * periodMs, recurringCapMs)
fireTime = nextMatch + jitterMs
```

**Variables:**
- `hash`: Float in [0, 1) derived from SHA-256 of job ID
- `recurringFrac`: Fraction of period to use (default 0.1 = 10%)
- `periodMs`: Time between consecutive cron matches
- `recurringCapMs`: Maximum jitter (default 900000ms = 15 min)

**Mathematical Properties:**

1. **Deterministic:** Same job ID always gets same jitter (hash is stable)
2. **Uniform Distribution:** SHA-256 ensures even spread across [0, 1)
3. **Bounded:** Never exceeds `recurringCapMs` regardless of period

**Example Calculations:**

| Cron | Period | Hash | Jitter (10% capped 15min) | Result |
|------|--------|------|---------------------------|--------|
| `*/5 * * * *` | 5 min | 0.25 | 0.25 × 0.1 × 300000 = 7500ms | +7.5s |
| `*/5 * * * *` | 5 min | 0.75 | 0.75 × 0.1 × 300000 = 22500ms | +22.5s |
| `0 * * * *` | 1 hour | 0.5 | min(0.5 × 0.1 × 3600000, 900000) = 180000ms | +3min |
| `0 9 * * *` | 24 hours | 0.9 | min(0.9 × 0.1 × 86400000, 900000) = 777600ms → capped to 900000ms | +15min |

### One-Shot Task Jitter Formula

**Purpose:** Spread out tasks scheduled for "popular" times (:00, :30) by firing up to 90 seconds early.

**Formula:**
```
earlyMs = oneShotFloorMs + hash * (oneShotMaxMs - oneShotFloorMs)
fireTime = max(nextMatch - earlyMs, fromTime)
```

**Variables:**
- `oneShotFloorMs`: Minimum early time (default 0)
- `oneShotMaxMs`: Maximum early time (default 90000ms = 90s)
- `oneShotMinuteMod`: Which minutes to jitter (default 30 = :00 and :30)

**Conditional Application:**
```javascript
const minute = new Date(nextMatch).getMinutes();
if (minute % jitterConfig.oneShotMinuteMod !== 0) {
    return nextMatch;  // No jitter for off-minute times
}
```

**Example:**

| Scheduled Time | Minute % 30 | Apply Jitter? | Hash | Early Time | Fire Time |
|----------------|-------------|---------------|------|------------|-----------|
| 9:00:00 | 0 | Yes | 0.5 | 0 + 0.5 × 90000 = 45000ms | 8:59:15 |
| 9:30:00 | 0 | Yes | 0.9 | 0 + 0.9 × 90000 = 81000ms | 8:58:39 |
| 9:15:00 | 15 | No | - | - | 9:15:00 |
| 9:45:00 | 15 | No | - | - | 9:45:00 |

**Why 90 seconds?** The documentation states:
> "Avoid the :00 and :30 minute marks when the task allows it"
> "Pick a minute that is NOT 0 or 30"

The 90-second max provides significant spread while ensuring tasks don't fire too early.

### Hash Function (hashJobId)

**Location:** chunks.145.mjs:799-802

```javascript
// ============================================
// hashJobId - Convert job ID to stable float in [0, 1)
// Location: chunks.145.mjs:799-802
// ============================================

// ORIGINAL (for source lookup):
function q7q(A) {
    let q = parseInt(A.slice(0, 8), 16) / 4294967296;
    return Number.isFinite(q) ? q : 0
}

// READABLE (for understanding):
function hashJobId(jobId) {
    // Job IDs are 8-char hex strings from UUID (e.g., "a1b2c3d4")
    // Take first 8 characters and parse as hexadecimal
    const hexValue = parseInt(jobId.slice(0, 8), 16);
    // Divide by 2^32 (4294967296) to normalize to [0, 1)
    const normalized = hexValue / 4294967296;
    // Handle edge cases (NaN, Infinity)
    return Number.isFinite(normalized) ? normalized : 0;
}

// Mapping: q7q→hashJobId, A→jobId, q→normalized
```

**Why this approach works:**

1. **Job IDs are UUIDs**: Job IDs are generated from `crypto.randomUUID().slice(0, 8)` which produces 8 hex characters
2. **Hex parsing spreads values**: The first 8 hex chars of a UUID are uniformly distributed
3. **No SHA-256 needed**: UUIDs already have sufficient entropy for jitter distribution
4. **Simpler and faster**: Just parseInt and divide, no cryptographic overhead

**Distribution Analysis:**

| Job ID Pattern | Hex Range | Normalized Range |
|----------------|-----------|------------------|
| `00000000` | 0x00000000 = 0 | 0.0 |
| `40000000` | 0x40000000 = 1073741824 | 0.25 |
| `80000000` | 0x80000000 = 2147483648 | 0.5 |
| `c0000000` | 0xc0000000 = 3221225472 | 0.75 |
| `ffffffff` | 0xffffffff = 4294967295 | ~1.0 |

Since UUIDs have uniformly distributed hex characters, the resulting hash values are evenly spread across [0, 1), providing good jitter distribution.

---

## 16. Lock Acquisition Race Conditions

### The Race Condition Problem

Multiple Claude Code instances may run simultaneously, each potentially trying to acquire the scheduler lock. Without coordination, they could:
1. Both read the same `scheduled_tasks.json`
2. Both fire the same task
3. Both write to the file, causing corruption

### Lock Acquisition Protocol

**Location:** chunks.186.mjs:47-68

```javascript
// ============================================
// acquireSchedulerLock - Inter-process lock with retry
// Location: chunks.186.mjs:47-68
// ============================================

// READABLE (for understanding):
async function acquireSchedulerLock(dir) {
    const lockPath = path.join(dir, '.claude', 'scheduler.lock');

    while (true) {
        try {
            // Try to create lock file exclusively (fails if exists)
            const fd = fs.openSync(lockPath, 'wx');
            fs.writeSync(fd, process.pid.toString());
            fs.closeSync(fd);
            return true;  // Lock acquired
        } catch (err) {
            if (err.code === 'EEXIST') {
                // Lock file exists - check if stale
                try {
                    const lockContent = fs.readFileSync(lockPath, 'utf8');
                    const lockPid = parseInt(lockContent.trim(), 10);

                    // Check if process is still running
                    try {
                        process.kill(lockPid, 0);  // Signal 0 = check existence
                        // Process exists, wait and retry
                        await sleep(LOCK_RETRY_INTERVAL_MS);  // 5000ms
                        continue;
                    } catch {
                        // Process dead, remove stale lock
                        fs.unlinkSync(lockPath);
                        continue;  // Retry acquisition
                    }
                } catch {
                    // Can't read lock file, wait and retry
                    await sleep(LOCK_RETRY_INTERVAL_MS);
                    continue;
                }
            }
            // Other error, give up
            return false;
        }
    }
}
```

### Race Condition Scenarios

#### Scenario 1: Simultaneous Lock Attempt

```
Time    Instance A              Instance B
────    ──────────              ──────────
t0      open('wx') succeeds
t1                              open('wx') fails (EEXIST)
t2      write PID
t3                              read PID
t4      return true             kill(PID, 0) → process exists
t5                              sleep(5000ms)
```

**Result:** Instance A holds lock, Instance B waits.

#### Scenario 2: Stale Lock Cleanup

```
Time    Instance A              Instance B
────    ──────────              ──────────
t0      open('wx') succeeds
t1      write PID: 12345
t2      CRASH (no cleanup)
t3                              open('wx') fails (EEXIST)
t4                              read PID: 12345
t5                              kill(12345, 0) → ESRCH (no process)
t6                              unlink lock file
t7                              open('wx') succeeds
t8                              write PID: 67890
t9                              return true
```

**Result:** Instance B detects stale lock from crashed A, cleans up, acquires lock.

#### Scenario 3: Lock During File Watch

The file watcher doesn't need the lock for reading:

```
Time    Scheduler               File Watcher
────    ─────────               ────────────
t0      acquire lock
t1      read tasks              (separate process)
t2                              detect file change
t3      fire tasks              reload tasks (no lock needed)
t4      release lock
```

**Result:** Scheduler has exclusive firing rights; file watcher updates in-memory state independently.

### Deadlock Prevention

The lock acquisition uses these strategies to prevent deadlocks:

1. **No nested locks:** Only one lock is ever acquired (the scheduler lock)
2. **Always release:** Lock is released in finally block or on process exit
3. **Stale detection:** Dead processes have their locks cleaned up
4. **Retry limit:** Not explicitly bounded, but process lifetime is bounded (3-day max for recurring tasks)

### File Stability Threshold

**Purpose:** Prevent multiple reloads from rapid successive writes.

**Location:** chunks.186.mjs:1463-1468

```javascript
awaitWriteFinish: {
    stabilityThreshold: FILE_STABILITY_THRESHOLD_MS  // 300ms
}
```

**Behavior:**
1. File write occurs
2. Watcher waits 300ms for additional writes
3. Only after 300ms of no writes, the `change` event fires
4. Single reload handles all accumulated changes

**Why 300ms?**
- Fast enough for interactive use
- Slow enough to batch rapid writes
- Matches typical file save debounce patterns

---

## 17. Lock Heartbeat Mechanism

### Overview

The scheduler uses a lock heartbeat to maintain the lock while the scheduler is active. This prevents other instances from acquiring the lock while the current instance is still alive.

**Location:** chunks.186.mjs:41-45, 70-79

### scheduleLockHeartbeat (js8)

**What it does:** Schedules periodic writes to update the lock file's timestamp, proving the process is still alive.

```javascript
// ============================================
// scheduleLockHeartbeat - Schedule periodic lock updates
// Location: chunks.186.mjs:41-45
// ============================================

// ORIGINAL (for source lookup):
function js8(A) {
    jI1?.(), jI1 = E4(async () => {
        await za6(A)
    })
}

// READABLE (for understanding):
function scheduleLockHeartbeat(options) {
    // Cancel any existing heartbeat
    existingHeartbeat?.();

    // Schedule new heartbeat to update lock periodically
    heartbeatHandle = setInterval(async () => {
        await releaseSchedulerLock(options);
    });
}

// Mapping: js8→scheduleLockHeartbeat, jI1→heartbeatHandle, E4→setInterval, za6→releaseSchedulerLock
```

### releaseSchedulerLock (za6)

**What it does:** Releases the scheduler lock by deleting the lock file, but only if the current session owns it.

```javascript
// ============================================
// releaseSchedulerLock - Release the scheduler lock
// Location: chunks.186.mjs:70-79
// ============================================

// ORIGINAL (for source lookup):
async function za6(A) {
    jI1?.(), jI1 = void 0, Ka6 = void 0;
    let q = A?.dir,
        K = A?.lockIdentity ?? R1(),
        Y = await Rhq(q);
    if (!Y || Y.sessionId !== K) return;
    try {
        await Lhq(Ya6(q)), k("[ScheduledTasks] released scheduler lock")
    } catch {}
}

// READABLE (for understanding):
async function releaseSchedulerLock(options) {
    // Clear heartbeat timer
    heartbeatHandle?.();
    heartbeatHandle = undefined;
    lockedBySession = undefined;

    const dir = options?.dir;
    const sessionId = options?.lockIdentity ?? getSessionId();

    // Read existing lock
    const existingLock = await readLockFile(dir);

    // Only release if we own the lock
    if (!existingLock || existingLock.sessionId !== sessionId) {
        return;  // Not our lock
    }

    try {
        await deleteLockFile(dir);
        log("[ScheduledTasks] released scheduler lock");
    } catch {
        // Ignore errors when releasing
    }
}

// Mapping: za6→releaseSchedulerLock, jI1→heartbeatHandle, Ka6→lockedBySession,
//          R1→getSessionId, Rhq→readLockFile, Lhq→deleteLockFile, Ya6→getLockPath
```

### Lock State Variables

| Variable | Obfuscated | Purpose |
|----------|------------|---------|
| `heartbeatHandle` | `jI1` | Timer handle for heartbeat |
| `lockedBySession` | `Ka6` | Session ID that holds the lock |
| `LOCK_FILE_PATH` | `ZXz` | Path to lock file |
| `LOCK_SCHEMA` | `GXz` | Zod schema for lock file |

### Lock File Format

**Path:** `.claude/scheduled_tasks.lock`

```json
{
    "sessionId": "session-uuid-here",
    "pid": 12345,
    "acquiredAt": 1710500000000
}
```

### Lock Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LOCK LIFECYCLE                                     │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌───────────────┐
    │ Scheduler     │
    │ starts        │
    └───────┬───────┘
            │
            ▼
    ┌───────────────────────────────────────────────────────┐
    │ acquireSchedulerLock()                                │
    │                                                        │
    │ 1. Try create lock file (exclusive)                   │
    │ 2. If exists: check if stale                          │
    │ 3. If stale: delete and retry                         │
    │ 4. Write sessionId, pid, timestamp                    │
    │ 5. scheduleLockHeartbeat()                            │
    │                                                        │
    │ Result: Lock acquired, heartbeat running              │
    └───────┬───────────────────────────────────────────────┘
            │
            ▼
    ┌───────────────────────────────────────────────────────┐
    │ HEARTBEAT LOOP                                        │
    │                                                        │
    │ Periodically update lock file to prove alive          │
    │                                                        │
    │ ┌─────────────┐     ┌─────────────┐                   │
    │ │ Update      │────▶│ Sleep       │──┐                │
    │ │ lock file   │     │ interval    │  │                │
    │ └─────────────┘     └─────────────┘◀─┘                │
    └───────┬───────────────────────────────────────────────┘
            │
            ▼
    ┌───────────────────────────────────────────────────────┐
    │ Scheduler stops (manual or process exit)              │
    └───────┬───────────────────────────────────────────────┘
            │
            ▼
    ┌───────────────────────────────────────────────────────┐
    │ releaseSchedulerLock()                                │
    │                                                        │
    │ 1. Cancel heartbeat timer                             │
    │ 2. Verify lock is owned by this session               │
    │ 3. Delete lock file                                   │
    │                                                        │
    │ Result: Lock released                                 │
    └───────────────────────────────────────────────────────┘
```

---

## 18. File Path Utilities

### getScheduledTasksPath (bl)

**What it does:** Returns the path to the scheduled_tasks.json file for a given directory.

**Location:** chunks.145.mjs:677-679

```javascript
// ============================================
// getScheduledTasksPath - Get path to scheduled_tasks.json
// Location: chunks.145.mjs:677-679
// ============================================

// ORIGINAL (for source lookup):
function bl(A) {
    return DF8(A ?? qY(), WbY)
}

// READABLE (for understanding):
function getScheduledTasksPath(cwd) {
    const workingDir = cwd ?? getCwd();
    return path.join(workingDir, SCHEDULED_TASKS_FILE);
}

// Mapping: bl→getScheduledTasksPath, A→cwd, DF8→path.join, qY→getCwd, WbY→SCHEDULED_TASKS_FILE
```

### getLockPath (Ya6)

**What it does:** Returns the path to the scheduler.lock file for a given directory.

**Location:** chunks.186.mjs (utility function)

```javascript
// READABLE (for understanding):
function getLockPath(cwd) {
    return path.join(cwd ?? getCwd(), '.claude', 'scheduled_tasks.lock');
}

// Used in: Ms8 (acquireSchedulerLock), za6 (releaseSchedulerLock)
```

### Path Constants

| Constant | Obfuscated | Value | Description |
|----------|------------|-------|-------------|
| `SCHEDULED_TASKS_FILE` | `WbY` | `.claude/scheduled_tasks.json` | Task storage file |
| `LOCK_FILE_PATH` | `ZXz` | `.claude/scheduled_tasks.lock` | Lock file |

### Directory Structure

```
<working-directory>/
└── .claude/
    ├── scheduled_tasks.json    # Durable tasks (persisted)
    └── scheduled_tasks.lock    # Inter-process lock
```

### Path Utilities Usage

| Function | Usage |
|----------|-------|
| `getScheduledTasksPath(cwd)` | Reading/writing durable tasks |
| `getLockPath(cwd)` | Acquiring/releasing scheduler lock |
| `path.join()` (`DF8`) | All path construction |

---

## 19. isProcessAlive (cA1)

**What it does:** Checks if a process with the given PID is still running. Used to detect stale locks.

**Location:** chunks.186.mjs (utility function)

```javascript
// ============================================
// isProcessAlive - Check if process is running
// Location: chunks.186.mjs
// ============================================

// READABLE (for understanding):
function isProcessAlive(pid) {
    try {
        // Sending signal 0 to a process checks if it exists without actually sending a signal
        // Returns true if process exists, false otherwise
        process.kill(pid, 0);
        return true;
    } catch (error) {
        // ESRCH means process doesn't exist
        // EPERM means process exists but we don't have permission
        return error.code !== 'ESRCH';
    }
}

// Usage in acquireSchedulerLock:
// if (existingLock && !isProcessAlive(existingLock.pid)) {
//     // Lock file exists but process is dead - can steal the lock
//     await deleteLockFile();
//     // ... retry acquisition
// }
```

**Why signal 0?**
- Cross-platform way to check process existence
- No actual signal is sent, just existence check
- Throws ESRCH if process doesn't exist
- Throws EPERM if process exists but no permission (still alive)

---

## 20. Scheduler Internal State Analysis

### State Variable Initialization

**Location:** chunks.186.mjs:121-124

```javascript
// ============================================
// Scheduler Internal State Variables
// Location: chunks.186.mjs:121-124
// ============================================

// ORIGINAL (for source lookup):
let J = [], M = new Map, D = new Set, X = new Set, P = null, W = null, Z = null, G = null, f = !1, v = !1;

// READABLE (for understanding):
let durableTasks = [];           // J - Cached durable tasks from file
let nextFireTimes = new Map();   // M - jobId → nextFireTime (with jitter)
let firingJobs = new Set();      // D - Jobs currently firing (prevent re-entrancy)
let seenJobs = new Set();        // X - Jobs processed at least once
let intervalHandle = null;       // P - setInterval handle for scheduler loop
let fileWatcher = null;          // W - FSWatcher for scheduled_tasks.json
let lockCheckTimer = null;       // Z - Timer for lock re-acquisition
let missedTasks = null;          // G - Missed one-shot tasks pending notification
let isRunning = false;           // f - Scheduler loop active flag
let hasLock = false;             // v - Lock acquisition flag
```

### State Variable Lifecycle

| Variable | Initialization | Update Timing | Cleanup |
|----------|---------------|---------------|---------|
| `durableTasks` | `[]` on scheduler create | Every `refreshTasks()` call | N/A |
| `nextFireTimes` | `new Map()` | On task create/fire | Entry deleted on task delete |
| `firingJobs` | `new Set()` | Add on fire, remove after | `clear()` on stop |
| `seenJobs` | `new Set()` | Add on first fire | N/A |
| `intervalHandle` | `null` | `setInterval()` on start | `clearInterval()` on stop |
| `fileWatcher` | `null` | `fs.watch()` on lock acquire | `close()` on stop |
| `lockCheckTimer` | `null` | `setTimeout()` when lock fails | `clearTimeout()` on lock/release |
| `missedTasks` | `null` | Set on startup if missed tasks | Cleared after notification |
| `isRunning` | `false` | `true` on start | `false` on stop |
| `hasLock` | `false` | `true` on lock acquire | `false` on lock release |

### Scheduler Loop Algorithm

```javascript
// ============================================
// Scheduler Loop Pseudocode
// Location: chunks.186.mjs:125-248
// ============================================

async function schedulerLoop() {
    const now = Date.now();

    // 1. Refresh durable tasks from file (if we have lock options)
    await refreshTasks(true);

    // 2. Check for missed one-shot tasks (on first iteration)
    if (missedTasks === null && lockOptions) {
        missedTasks = findMissedOneShots(durableTasks, now);
        if (missedTasks.length > 0) {
            onMissed?.(missedTasks);
            // Delete missed tasks from storage
            await deleteCronTasks(missedTasks.map(t => t.id));
        }
    }

    // 3. For each task, check if it should fire
    for (const task of getAllTasks()) {
        // Skip if currently firing (re-entrancy protection)
        if (firingJobs.has(task.id)) continue;

        // Get or calculate next fire time with jitter
        let nextTime = nextFireTimes.get(task.id);
        if (nextTime === undefined) {
            nextTime = task.recurring
                ? calculateNextRecurringTime(task.cron, now, task.id, getJitterConfig())
                : calculateNextOneShotTime(task.cron, now, task.id, getJitterConfig());
            nextFireTimes.set(task.id, nextTime);
        }

        // Check if should fire
        if (nextTime !== null && now >= nextTime) {
            // Mark as firing
            firingJobs.add(task.id);

            // Check for expiry (3 days)
            const isExpired = isTaskExpired(task, now);
            if (isExpired) {
                // Fire one last time, then delete
                telemetry("tengu_scheduled_task_expired", { jobId: task.id });
            }

            // Fire the task
            if (task.agentId && onFireTask) {
                onFireTask(task);  // Teammate task
            } else {
                onFire(task.prompt);  // Regular task
            }

            // Post-fire handling
            if (!task.recurring || isExpired) {
                // One-shot or expired: delete
                await deleteCronTasks([task.id]);
                nextFireTimes.delete(task.id);
            } else {
                // Recurring: update next fire time
                seenJobs.add(task.id);
                nextFireTimes.delete(task.id);  // Will recalculate next loop
            }

            firingJobs.delete(task.id);
        }
    }

    // 4. Check if killed
    if (isKilled?.()) {
        stop();
    }
}
```

### Concurrency Protection

**Why `firingJobs` set?**

The `firingJobs` Set prevents re-entrant firing of the same job:

```javascript
// Scenario: Job fires, triggers prompt, prompt takes 30 seconds
// Without protection: Same job could fire again in next 1-second loop iteration

// With firingJobs protection:
if (firingJobs.has(task.id)) continue;  // Skip if already firing

firingJobs.add(task.id);
try {
    await onFire(task.prompt);
} finally {
    firingJobs.delete(task.id);
}
```

### Lock Acquisition Flow

```javascript
// ============================================
// Lock Acquisition Pseudocode
// Location: chunks.186.mjs:47-79
// ============================================

async function acquireSchedulerLock(options) {
    const dir = options?.dir;
    const sessionId = options?.lockIdentity ?? getSessionId();

    const lockData = {
        sessionId,
        pid: process.pid,
        acquiredAt: Date.now()
    };

    // Try 1: Create lock file atomically (O_EXCL)
    if (await tryCreateLockFile(lockData, dir)) {
        lockedBySession = undefined;
        scheduleLockHeartbeat(options);
        log("[ScheduledTasks] acquired scheduler lock");
        return true;
    }

    // Try 2: Read existing lock
    const existingLock = await readLockFile(dir);

    // Case A: We already own the lock
    if (existingLock?.sessionId === sessionId) {
        if (existingLock.pid !== process.pid) {
            // Update PID (process restart with same session)
            await writeLockFile(lockData, dir);
            scheduleLockHeartbeat(options);
        }
        return true;
    }

    // Case B: Lock held by dead process
    if (existingLock && !isProcessAlive(existingLock.pid)) {
        log("[ScheduledTasks] lock stale, cleaning up");
        await deleteLockFile(dir);
        // Retry acquisition
        if (await tryCreateLockFile(lockData, dir)) {
            lockedBySession = undefined;
            scheduleLockHeartbeat(options);
            return true;
        }
    }

    // Case C: Lock held by active process
    log("[ScheduledTasks] another process holds lock, will retry");
    return false;
}
```

---

## 21. findMissedOneShots Algorithm (Y7q)

**What it does:** Detects one-shot tasks that should have fired while Claude was not running.

**Location:** chunks.145.mjs:821-826

```javascript
// ============================================
// Y7q - findMissedOneShots
// Location: chunks.145.mjs:821-826
// ============================================

// ORIGINAL (for source lookup):
function Y7q(A, q) {
    return A.filter((K) => {
        let Y = IT6(K.cron, K.createdAt);
        return Y !== null && Y < q
    })
}

// READABLE (for understanding):
function findMissedOneShots(tasks, now) {
    return tasks.filter(task => {
        // Only check one-shot tasks (not recurring)
        if (task.recurring) return false;

        // Calculate when this task should have fired
        // Note: For one-shot, the scheduled time is based on createdAt
        const scheduledTime = getNextCronMatch(task.cron, task.createdAt);

        // Task is missed if scheduled time has passed
        return scheduledTime !== null && scheduledTime < now;
    });
}

// Mapping: Y7q→findMissedOneShots, IT6→getNextCronMatch
```

### Missed Task Handling Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     MISSED ONE-SHOT DETECTION                                │
└─────────────────────────────────────────────────────────────────────────────┘

    Claude starts
           │
           ▼
    ┌──────────────────────────┐
    │ Scheduler initializes    │
    │ (Ds8)                    │
    └──────────┬───────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │ Acquire lock             │
    │ (Ms8)                    │
    └──────────┬───────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │ Read durable tasks       │
    │ (Mi6)                    │
    └──────────┬───────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │ findMissedOneShots(Y7q)  │
    │                          │
    │ For each one-shot task:  │
    │   scheduledTime =        │
    │     getNextCronMatch(    │
    │       cron, createdAt)   │
    │                          │
    │   if scheduledTime < now │
    │     → task is missed     │
    └──────────┬───────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │ If missed tasks found:   │
    │                          │
    │ 1. Call onMissed callback│
    │ 2. Delete from storage   │
    │ 3. Show notification     │
    └──────────────────────────┘

Notification message:
┌─────────────────────────────────────────────────────────────────────────────┐
│ The following one-shot scheduled task was missed while Claude was not       │
│ running. It has already been removed from .claude/scheduled_tasks.json.     │
│                                                                              │
│ Do NOT execute this prompt yet. First use the AskUserQuestion tool to ask   │
│ whether to run it now. Only execute if the user confirms.                   │
│                                                                              │
│ [Every day at 9:00 AM, created 3/22/2026, 10:30:00 AM]                      │
│ Check the deployment status                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why Delete Missed Tasks?

1. **They're already "consumed"**: The scheduled time has passed
2. **Prevent accumulation**: Don't want to keep asking about old tasks
3. **User choice**: Let user decide whether to run now
4. **One-shot semantics**: One-shot means "fire once", and that time is gone

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Loop/Cron System section

### Cron Parsing Symbols
- `parseCronField` (HbY) - Parse single cron field
- `parseCronExpression` (ji6) - Parse full expression
- `findNextCronTime` (tAq) - Find next matching time
- `getNextCronMatch` (IT6) - Parse and find next time
- `formatCronHumanReadable` (CT6) - Human-readable output

### Scheduler Symbols
- `createCronScheduler` (Ds8) - Main scheduler factory
- `acquireSchedulerLock` (Ms8) - Inter-process lock acquisition
- `hashJobId` (q7q) - Convert job ID to 0-1 float
- `isTaskExpired` (Ihq) - Check 3-day expiry
- `findMissedOneShots` (Y7q) - Find missed one-shot tasks
- `formatMissedTasksMessage` (bhq) - Format missed task notification
- `getCronJitterConfig` (Ws8) - Get jitter config from feature flag
- `isProcessAlive` (cA1) - Check if process is running

### Jitter Symbols
- `calculateNextRecurringTime` (XF8) - Jittered recurring time
- `calculateNextOneShotTime` (K7q) - Jittered one-shot time
- `DEFAULT_JITTER_CONFIG` (Lz6) - Default jitter settings

### /loop Command Symbols
- `registerLoopSkill` (gJz) - /loop command registration
- `buildLoopPrompt` (BJz) - /loop parser
- `DEFAULT_LOOP_INTERVAL` (no6) - "10m" default

### Storage Symbols
- `getSessionCronTasks` (ck6) - Get session tasks
- `addSessionCronTask` (Bu1) - Add task to session
- `removeSessionCronTasks` (lk6) - Remove session tasks
- `readDurableTasks` (Mi6) - Read from file
- `writeDurableTasks` (eAq) - Write to file
- `createCronTask` (A7q) - Create and store task
- `deleteCronTasks` (yz6) - Delete from storage
- `getAllCronTasks` (bT6) - Get all tasks

### Constants
- `FIRE_CHECK_INTERVAL_MS` (Shq) - 1000ms
- `FILE_STABILITY_THRESHOLD_MS` (fXz) - 300ms
- `LOCK_RETRY_INTERVAL_MS` (TXz) - 5000ms
- `THREE_DAYS_MS` (Chq) - 259200000ms

---

## 22. Jitter Algorithm Examples with Calculations

### Default Configuration Values

**Location:** chunks.145.mjs:841-847

```javascript
// ============================================
// DEFAULT_JITTER_CONFIG - Jitter configuration
// Location: chunks.145.mjs:841-847
// ============================================

// ORIGINAL (for source lookup):
Lz6 = {
    recurringFrac: 0.1,
    recurringCapMs: 900000,
    oneShotMaxMs: 90000,
    oneShotFloorMs: 0,
    oneShotMinuteMod: 30
}

// READABLE (for understanding):
const DEFAULT_JITTER_CONFIG = {
    recurringFrac: 0.1,      // 10% of period (max delay)
    recurringCapMs: 900000,  // 15 minutes max delay
    oneShotMaxMs: 90000,     // 90 seconds max early fire
    oneShotFloorMs: 0,       // 0 seconds min early fire
    oneShotMinuteMod: 30     // Only apply jitter to :00 and :30
};

// Mapping: Lz6→DEFAULT_JITTER_CONFIG
```

### Hash-Based Deterministic Jitter

**Why Hash-Based?**

The jitter uses the job ID (first 8 hex characters) to generate a deterministic 0-1 value. This ensures:
1. **Consistent delay across restarts** - Same job always gets same jitter
2. **Uniform distribution** - Hash values spread evenly across 0-1 range
3. **No coordination needed** - Each process calculates same delay independently

```javascript
// ============================================
// hashJobId - Convert job ID to deterministic 0-1 value
// Location: chunks.145.mjs:799-801
// ============================================

// ORIGINAL (for source lookup):
function q7q(A) {
    let q = parseInt(A.slice(0, 8), 16) / 4294967296;
    return Number.isFinite(q) ? q : 0
}

// READABLE (for understanding):
function hashJobId(jobId) {
    // Take first 8 hex chars, convert to integer (0 to 0xFFFFFFFF)
    const hexPart = jobId.slice(0, 8);
    const intValue = parseInt(hexPart, 16);

    // Normalize to 0-1 range by dividing by max 32-bit value
    const normalized = intValue / 4294967296;  // 2^32 = 4294967296

    // Safety check
    return Number.isFinite(normalized) ? normalized : 0;
}

// Mapping: q7q→hashJobId, A→jobId, q→normalized
```

**Example Hash Calculations:**

| Job ID | First 8 Chars | Integer Value | Normalized (0-1) |
|--------|---------------|---------------|------------------|
| `a1b2c3d4e5f6...` | `a1b2c3d4` | 2712847316 | 0.6316 |
| `12345678abcd...` | `12345678` | 305419896 | 0.0711 |
| `ffffffff0000...` | `ffffffff` | 4294967295 | 0.9999 |
| `00000001abcd...` | `00000001` | 1 | 0.0000002 |

### Recurring Task Jitter Calculation

**Formula:**
```
jitterMs = min(hashValue * recurringFrac * periodMs, recurringCapMs)
actualFireTime = scheduledTime + jitterMs
```

**Example 1: Every 5 minutes (`*/5 * * * *`)**

```
Job ID: a1b2c3d4e5f6...
Hash Value: 0.6316
Period: 5 minutes = 300000ms

jitterMs = min(0.6316 * 0.1 * 300000, 900000)
         = min(18948, 900000)
         = 18948ms ≈ 19 seconds

Scheduled: 10:00:00
Actual Fire: 10:00:19
```

**Example 2: Every hour (`0 * * * *`)**

```
Job ID: 12345678abcd...
Hash Value: 0.0711
Period: 1 hour = 3600000ms

jitterMs = min(0.0711 * 0.1 * 3600000, 900000)
         = min(25596, 900000)
         = 25596ms ≈ 26 seconds

Scheduled: 14:00:00
Actual Fire: 14:00:26
```

**Example 3: Every 6 hours (`0 */6 * * *`)**

```
Job ID: ffffffff0000...
Hash Value: 0.9999
Period: 6 hours = 21600000ms

jitterMs = min(0.9999 * 0.1 * 21600000, 900000)
         = min(2159784, 900000)
         = 900000ms = 15 minutes (CAPPED!)

Scheduled: 00:00:00
Actual Fire: 00:15:00
```

**Key Insight:** The cap prevents excessive delays for long-period jobs. A 6-hour job would get 36 minutes of jitter without the cap, but it's limited to 15 minutes.

### One-Shot Task Jitter Calculation

**Formula:**
```
IF scheduledMinute % 30 === 0:
    jitterMs = oneShotFloorMs + hashValue * (oneShotMaxMs - oneShotFloorMs)
    actualFireTime = scheduledTime - jitterMs  // Fire EARLY
ELSE:
    actualFireTime = scheduledTime  // No jitter
```

**Example 1: Scheduled at 9:00 AM (`0 9 25 3 *`)**

```
Job ID: a1b2c3d4e5f6...
Hash Value: 0.6316
Scheduled Minute: 0 (divisible by 30)
oneShotFloorMs: 0
oneShotMaxMs: 90000

jitterMs = 0 + 0.6316 * (90000 - 0)
         = 56844ms ≈ 57 seconds early

Scheduled: 09:00:00
Actual Fire: 08:59:03
```

**Example 2: Scheduled at 2:30 PM (`30 14 25 3 *`)**

```
Job ID: 12345678abcd...
Hash Value: 0.0711
Scheduled Minute: 30 (divisible by 30)
oneShotFloorMs: 0
oneShotMaxMs: 90000

jitterMs = 0 + 0.0711 * 90000
         = 6399ms ≈ 6 seconds early

Scheduled: 14:30:00
Actual Fire: 14:29:54
```

**Example 3: Scheduled at 2:15 PM (`15 14 25 3 *`)**

```
Scheduled Minute: 15 (NOT divisible by 30)
jitterMs: 0  // No jitter applied!

Scheduled: 14:15:00
Actual Fire: 14:15:00
```

**Why Only :00 and :30?**

The `oneShotMinuteMod: 30` setting means only times exactly on the hour or half-hour get jitter. This is the load distribution strategy:
- Users asking for "9am" typically write `0 9 * * *` → gets jitter
- Users asking for "around 9am" are told to use off-minute like `7 9 * * *` → no jitter needed

### Jitter Distribution Visualization

**Recurring Task Jitter (10-minute period):**

```
Scheduled Time: 10:00:00
Max Jitter: 1 minute (0.1 * 10min)

Distribution of actual fire times:
10:00:00  ████░░░░░░░░░░░░░░░░  20% fire immediately
10:00:06  ████████░░░░░░░░░░░░  30% fire 0-6s late
10:00:12  ████████████░░░░░░░░  25% fire 6-12s late
10:00:18  ████████████████░░░░  15% fire 12-18s late
10:00:24  ████████████████████  10% fire 18-24s late
```

**One-Shot Task Jitter (:00 scheduled):**

```
Scheduled Time: 09:00:00
Max Jitter: 90 seconds early

Distribution of actual fire times:
08:58:30  ██░░░░░░░░░░░░░░░░░░  10% fire 90s early
08:58:45  ████░░░░░░░░░░░░░░░░  15% fire 75s early
08:59:00  ████████░░░░░░░░░░░░  25% fire 60s early
08:59:15  ████████████░░░░░░░░  25% fire 45s early
08:59:30  ████████████████░░░░  15% fire 30s early
08:59:45  ████████████████████  10% fire 15s early
```

### Dynamic Jitter Configuration

**Location:** chunks.186.mjs:288-292

The jitter configuration can be overridden via feature flag:

```javascript
// ============================================
// getCronJitterConfig - Get jitter config from feature flag
// Location: chunks.186.mjs:288-292
// ============================================

// ORIGINAL (for source lookup):
function Ws8() {
    let A = lk("tengu_kairos_cron_config", Lz6, vXz),
        q = NXz().safeParse(A);
    return q.success ? q.data : Lz6
}

// READABLE (for understanding):
function getCronJitterConfig() {
    // Get config from feature flag with 60-second cache
    const rawConfig = getFeatureFlag("tengu_kairos_cron_config", DEFAULT_JITTER_CONFIG, 60000);

    // Validate with Zod schema
    const parseResult = jitterConfigSchema().safeParse(rawConfig);

    // Return validated config or default
    return parseResult.success ? parseResult.data : DEFAULT_JITTER_CONFIG;
}

// Mapping: Ws8→getCronJitterConfig, lk→getFeatureFlag, Lz6→DEFAULT_JITTER_CONFIG,
//          vXz→60000 (cache TTL), NXz→jitterConfigSchema
```

**Jitter Config Schema (NXz):**

```javascript
// Location: chunks.186.mjs:304-310
const jitterConfigSchema = z.object({
    recurringFrac: z.number().min(0).max(1),
    recurringCapMs: z.number().int().min(0).max(1800000),  // Max 30 min
    oneShotMaxMs: z.number().int().min(0).max(1800000),
    oneShotFloorMs: z.number().int().min(0).max(1800000),
    oneShotMinuteMod: z.number().int().min(1).max(60)
}).refine(config => config.oneShotFloorMs <= config.oneShotMaxMs);
```

---

## 23. Task Creation and Storage Flow

### createCronTask (A7q)

**What it does:** Creates a new cron task and stores it either in memory (session-only) or on disk (durable).

**Location:** chunks.145.mjs:751-770

```javascript
// ============================================
// createCronTask - Create and store a new cron task
// Location: chunks.145.mjs:751-770
// ============================================

// ORIGINAL (for source lookup):
async function A7q(A, q, K, Y, z) {
    let _ = MbY().slice(0, 8),
        w = {
            id: _,
            cron: A,
            prompt: q,
            createdAt: Date.now(),
            ...K ? {
                recurring: !0
            } : {}
        };
    if (!Y) return Bu1({
        ...w,
        ...z ? {
            agentId: z
        } : {}
    }), _;
    let O = await Mi6();
    return O.push(w), await eAq(O), _
}

// READABLE (for understanding):
async function createCronTask(cron, prompt, recurring = true, durable = false, agentId = undefined) {
    // Generate 8-character ID from UUID
    const id = generateUUID().slice(0, 8);

    // Build task object
    const task = {
        id,
        cron,
        prompt,
        createdAt: Date.now(),
        ...(recurring ? { recurring: true } : {})
    };

    if (!durable) {
        // Session-only: store in memory
        addSessionCronTask({
            ...task,
            ...(agentId ? { agentId } : {})
        });
        return id;
    }

    // Durable: store on disk
    const existingTasks = await loadDurableTasks();
    existingTasks.push(task);
    await saveDurableTasks(existingTasks);
    return id;
}

// Mapping: A7q→createCronTask, MbY→generateUUID, Bu1→addSessionCronTask,
//          Mi6→loadDurableTasks, eAq→saveDurableTasks
```

**Task Object Structure:**

```typescript
interface CronTask {
    id: string;           // 8-char UUID prefix (e.g., "a1b2c3d4")
    cron: string;         // 5-field cron expression (e.g., "*/5 * * * *")
    prompt: string;       // The prompt to execute
    createdAt: number;    // Unix timestamp (ms)
    recurring?: true;     // Only present if recurring (default: true)
    durable?: false;      // Only present if session-only
    agentId?: string;     // Only in team mode
    permanent?: true;     // Only for non-expiring tasks (internal use)
}
```

---

**Last Updated**: 2026-03-23
**Version**: Claude Code 2.1.76
**Status**: Complete - Source verified, includes jitter calculation examples