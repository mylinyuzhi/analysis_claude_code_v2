# Loop Command (/loop)

## Overview

The `/loop` slash command (introduced in v2.1.71) creates a recurring execution of a prompt or slash command at a set interval. It is the primary user-facing interface for the loop/cron scheduling system documented in [../36_loop_cron/](../36_loop_cron/).

The command creates a session-scoped cron job that fires at each interval, injecting the specified prompt or command into the conversation as if the user had typed it. This enables recurring tasks such as:
- Polling for new GitHub issues every 5 minutes
- Checking build status every 2 minutes
- Summarizing log output every hour

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (CLI)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent Loop

Key functions in this document:
- `loopCommand` - The `/loop` command definition object
- `parseLoopArgs` - Parses interval and command from raw args string
- `parseIntervalExpression` - Converts human-readable intervals (5m, 1h) to milliseconds
- `CronCreate` tool - Programmatic cron job creation (see [../36_loop_cron/cron_tools.md](../36_loop_cron/cron_tools.md))
- `validateCronInterval` - Enforces minimum interval to prevent excessive polling

---

## Syntax

```
/loop [interval] [prompt-or-command]
```

**Examples:**
```
/loop 5m /check-status
/loop 10m Check for new GitHub issues and summarize them
/loop 1h Analyze the error logs and suggest fixes
/loop       (with no args: shows current cron jobs, same as /cron)
```

**Interval formats:**
- `5s` - 5 seconds (minimum: 30s enforced to prevent runaway polling)
- `10m` - 10 minutes
- `2h` - 2 hours
- `1d` - 1 day

**Default interval:** If no interval is specified, defaults to `10m`.

---

## How It Works

### parseLoopArgs — Argument Parsing

**What it does:** Extracts the interval and command/prompt from the raw `/loop` argument string.

**How it works:**
```javascript
// ============================================
// parseLoopArgs - Extract interval and command from /loop args
// Location: chunks.188.mjs (loop command section)
// ============================================

// READABLE (for understanding):
function parseLoopArgs(args) {
    if (!args.trim()) {
        return { interval: null, command: null };  // no args: show cron list
    }

    // Match leading interval token: digits followed by s/m/h/d
    let intervalMatch = args.trim().match(/^(\d+[smhd])\s+([\s\S]+)$/);
    if (intervalMatch) {
        return {
            interval: intervalMatch[1],   // e.g., "5m"
            command: intervalMatch[2].trim()  // everything after the interval
        };
    }

    // No interval token: use default
    return {
        interval: "10m",
        command: args.trim()
    };
}
```

**Why greedy command capture (`[\s\S]+`):** The command/prompt portion may span multiple words and may even contain newlines (in multi-line input mode). The greedy pattern ensures the full prompt is captured.

### parseIntervalExpression — Interval to Milliseconds

**What it does:** Converts a human-readable interval string to a millisecond integer for use in the scheduler.

**How it works:**
```javascript
function parseIntervalExpression(intervalStr) {
    const unitMultipliers = {
        's': 1000,
        'm': 60 * 1000,
        'h': 60 * 60 * 1000,
        'd': 24 * 60 * 60 * 1000
    };
    const match = intervalStr.match(/^(\d+)([smhd])$/);
    if (!match) throw new Error(`Invalid interval: "${intervalStr}"`);

    const value = parseInt(match[1], 10);
    const unit = match[2];
    return value * unitMultipliers[unit];
}
```

**Minimum interval enforcement:**
```javascript
const MINIMUM_INTERVAL_MS = 30 * 1000;  // 30 seconds

function validateCronInterval(intervalMs) {
    if (intervalMs < MINIMUM_INTERVAL_MS) {
        throw new Error(
            `Interval too short (${intervalMs}ms). Minimum: 30 seconds.`
        );
    }
}
```

**Why 30 seconds minimum:** Intervals shorter than 30 seconds would create excessive API calls, especially with complex prompts that trigger multiple tool uses. The minimum prevents accidental runaway API usage while still supporting rapid iteration use cases.

### Execution Path

When the user runs `/loop 5m /check-status`:

```
/loop 5m /check-status
    │
    ▼
parseSlashCommand → { commandName: "loop", args: "5m /check-status" }
    │
    ▼
executeCommand (ifY) → type === "local-jsx"
    │
    ▼
loopCommand.call("5m /check-status", { onDone, ... })
    │
    ▼
parseLoopArgs("5m /check-status")
    → { interval: "5m", command: "/check-status" }
    │
    ▼
parseIntervalExpression("5m") → 300000 ms
validateCronInterval(300000) → ok
    │
    ▼
cronManager.create({
    interval: 300000,
    command: "/check-status",
    name: "loop-1"        // auto-generated name
})
    │
    ▼
cronJob stored in session state:
    { id: "cron_abc123", interval: 300000, command: "/check-status",
      lastRun: null, nextRun: Date.now() + 300000, failureCount: 0 }
    │
    ▼
onDone("Loop created: every 5m → /check-status (ID: cron_abc123)", { display: "system" })
```

---

## State Management

### Session-Scoped Storage

Cron jobs created by `/loop` are stored in the session's `cronJobs` map in app state:

```typescript
type CronJob = {
    id: string;           // unique identifier (e.g., "cron_abc123")
    interval: number;     // milliseconds between executions
    command: string;      // prompt or slash command to execute
    name: string;         // human-readable name
    lastRun: number | null;   // timestamp of last execution
    nextRun: number;          // timestamp of next scheduled execution
    failureCount: number;     // consecutive failure count (for circuit breaker)
    createdAt: number;        // when this job was created
}

type AppState = {
    // ...
    cronJobs: Map<string, CronJob>;
}
```

### Survival Through Compaction

Cron jobs survive context compaction because:
1. The compaction process includes a snapshot of `cronJobs` in the compaction metadata
2. After compaction, `cronJobs` is restored from the metadata
3. `nextRun` is recalculated from `Date.now() + interval` after restoration (since the original timestamp may be in the past)
4. `failureCount` is reset to 0 after compaction (fresh start)

**Why recalculate `nextRun`:** If a 1-hour job was scheduled to run at 3pm but compaction happened at 2:55pm, the job's next run should be ~1 hour from when it was restored, not 5 minutes from now (which would create an artificial burst of executions right after compaction).

---

## Circuit Breaker

### Failure Handling

If the executed prompt or command fails (e.g., tool errors, LLM errors), the failure is tracked:

```javascript
// After each cron execution:
if (executionFailed) {
    cronJob.failureCount += 1;

    // Circuit breaker: disable after 3 consecutive failures
    const MAX_CONSECUTIVE_FAILURES = 3;
    if (cronJob.failureCount >= MAX_CONSECUTIVE_FAILURES) {
        cronManager.disable(cronJob.id);
        showNotification({
            message: `Loop "${cronJob.name}" stopped after ${MAX_CONSECUTIVE_FAILURES} failures. Use /cron to re-enable.`,
            level: "warning"
        });
        return;
    }
}

// Success: reset failure count
if (executionSucceeded) {
    cronJob.failureCount = 0;
}
```

**Why circuit breaker:** Without a circuit breaker, a broken loop command could repeatedly fire failing requests, consuming API quota and creating noisy error messages. Three consecutive failures is a reasonable signal that the command needs human attention.

**Why not exponential backoff:** The `/loop` use case is typically polling-based (check status, check for updates). Backing off would defeat the purpose. The circuit breaker-style full-stop is more appropriate: the user is notified and must explicitly re-enable the job.

---

## CLAUDE_CODE_DISABLE_CRON Environment Variable

When `CLAUDE_CODE_DISABLE_CRON` is set to any truthy value:

1. All `CronCreate` tool calls fail with: `"Cron scheduling is disabled (CLAUDE_CODE_DISABLE_CRON)"`
2. `/loop` shows: `"Loop scheduling is disabled. Unset CLAUDE_CODE_DISABLE_CRON to enable."`
3. Existing cron jobs that were restored from state are not executed (the scheduler checks the env var on each tick)
4. `/cron` (or CronList) still shows existing jobs, but marks them as `[disabled by env]`

**Why this env var:** Enterprise deployments may wish to disable all scheduled/automated executions to maintain tighter control over when Claude Code sends API requests. The env var provides an operator-level kill switch that users cannot override.

---

## Integration with CronCreate/Delete/List Tools

The `/loop` command is syntactic sugar over the `CronCreate` tool. Users and agents can interact with cron jobs programmatically:

```
/loop 5m /check-status
    ≡
CronCreate({ name: "loop-1", interval: "5m", command: "/check-status" })
```

**Direct tool usage (for agent-created loops):**
The LLM agent can call `CronCreate` directly to set up loops on behalf of the user, without needing the `/loop` slash command. This is useful for agents that want to schedule their own monitoring tasks.

**Managing existing loops:**
- `CronList` (or `/cron`): Lists all active cron jobs with their IDs, intervals, and status
- `CronDelete`: Removes a cron job by ID
- `/loop` with no args: Equivalent to CronList — shows the current cron job list

**See:** [../36_loop_cron/cron_tools.md](../36_loop_cron/cron_tools.md) for the full tool schema and implementation details.

---

## UI Integration

### Status Line Display

When a cron job fires, the status line shows:
```
[⟳ loop: /check-status running...]
```

After the execution completes:
```
[⟳ loop: /check-status · last run 2m ago]
```

This lets the user see at a glance that their loop is active without cluttering the conversation.

### Conversation Integration

When a cron job fires, it injects its command into the conversation as if the user typed it:
```
▶  /check-status     ← appears as a user message (from the cron scheduler)
                      (with a small ⟳ clock icon indicating it's from a loop)
```

The LLM then responds normally. The response is added to the conversation history.

**Why inject as user message:** This keeps the conversation coherent — each loop execution produces a visible input/output pair that the user can scroll back and review. It also means the loop gets the full conversation context, not an isolated sub-agent.
