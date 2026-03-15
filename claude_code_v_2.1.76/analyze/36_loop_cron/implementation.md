# Loop Command Implementation

## Overview

The `/loop` slash command enables users to create recurring tasks that execute at specified intervals. The command is processed by the REPL command handler and delegates to `CronCreate` tool internally.

## Interval Parsing

The loop command accepts human-readable interval strings:

- Seconds: `30s`, `5s`
- Minutes: `5m`, `10m` (default)
- Hours: `1h`, `2h`

### Default Interval
If no interval is specified, defaults to 10 minutes: `/loop /check-status` → every 10 minutes

### Validation
- Minimum interval enforced (typically 30 seconds to 1 minute)
- Prevents excessive polling that would consume resources
- Invalid intervals rejected with helpful error message

## State Management

### Session-Scoped Cron Jobs

Cron jobs are stored in session state:
```javascript
// Session state structure
{
  cronJobs: Map<id, {
    id: string,
    name: string,
    interval: string,        // "5m", "10s", etc.
    command: string,         // user prompt or slash command
    createdAt: timestamp,
    lastRun: timestamp | null,
    nextRun: timestamp,
    failureCount: number,
    enabled: boolean
  }>
}
```

### Persistence Through Compaction

When conversation compaction occurs:
1. All cronJob entries are serialized into session state
2. Compaction reduces conversation messages
3. After compaction, cronJobs Map is restored
4. Next execution times are recalculated from current time
5. Failure counters reset to 0 (fresh start)

## Execution Flow

### 1. User Issues Command
```
/loop 5m /check-status
```

### 2. REPL Handler Parses Command
- Extracts interval: `5m`
- Extracts command: `/check-status`
- Validates interval format
- Generates unique job ID

### 3. CronCreate Tool Invoked
- Creates cronJob entry in session state
- Sets nextRun = now + 5 minutes
- Returns jobId and confirmation to user

### 4. Agent Loop Scheduler Checks Jobs
- Main agent loop checks cronJobs Map periodically
- For jobs where now >= nextRun:
  - If agent is idle: inject command as new user message
  - If agent busy: queue for next check cycle

### 5. Execution and Tracking
- Command executes in conversation
- Results appended to conversation context
- lastRun timestamp updated
- nextRun recalculated: lastRun + interval
- failureCount reset to 0 on success, incremented on failure

## Error Handling

### Circuit Breaker Pattern

After N consecutive failures:
1. Job is disabled (enabled = false)
2. Error message shown in conversation
3. User can manually delete job with `CronDelete` tool
4. Or start new session to reset

### Specific Errors

- **Invalid interval format** → CronCreate fails, helpful error shown
- **Command execution error** → Job continues, failure count incremented
- **Agent loop blocked** → Job waits for next check cycle
- **Session compaction** → Job state preserved, nextRun recalculated

## Environment Configuration

### CLAUDE_CODE_DISABLE_CRON

When set to `true`:
- `CronCreate` calls fail immediately
- `/loop` command shows: "Cron scheduling is disabled (CLAUDE_CODE_DISABLE_CRON=true)"
- Existing cron jobs are NOT executed
- Job state still preserved (can re-enable by unsetting env var)

## Integration Points

### With Agent Loop
The main agent loop (chunks.149.mjs - mainAgentLoop) includes cron check:
```javascript
// Pseudo-code
while (agentActive) {
  // ... normal message processing ...

  // Check for pending cron jobs
  if (isIdle && now >= nextCronRun) {
    for (const job of cronJobs.values()) {
      if (job.enabled && now >= job.nextRun) {
        injectCronCommandAsUserMessage(job.command);
      }
    }
  }
}
```

### With Conversation State
Cron jobs are part of the conversation state schema:
- Serialized on compaction
- Restored after compaction
- Included in session persistence

### With Tools
`CronCreate`, `CronDelete`, `CronList` are registered agent tools:
- Agent can create/manage its own cron jobs programmatically
- Can query active jobs with `CronList`
- Can cancel jobs with `CronDelete`

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Loop/Cron System section
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools section

Key functions in this document:
- `cronCreate` (N/A) - CronCreate tool handler
- `cronDelete` (N/A) - CronDelete tool handler
- `cronList` (N/A) - CronList tool handler
- Loop interval parser - Parses human-readable intervals
- Cron job scheduler - Main scheduling loop in agent loop
