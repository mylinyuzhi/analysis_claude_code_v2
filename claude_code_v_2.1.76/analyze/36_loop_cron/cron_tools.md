# CronCreate/CronDelete/CronList Tools

## Overview

Three agent tools provide programmatic access to the cron scheduling system:

1. **CronCreate** - Create a recurring job
2. **CronDelete** - Remove a job by ID
3. **CronList** - List all active jobs in session

## CronCreate Tool

Creates a recurring scheduled task that executes at a specified interval.

### Input Schema

```json
{
  "type": "object",
  "properties": {
    "cron": {
      "type": "string",
      "description": "Standard 5-field cron expression or human-readable interval (e.g., '5m', '1h', '*/5 * * * *')"
    },
    "prompt": {
      "type": "string",
      "description": "The prompt or slash command to execute at each interval"
    },
    "recurring": {
      "type": "boolean",
      "description": "true (default) = fire on every cron match; false = fire once at next match then auto-delete"
    }
  },
  "required": ["cron", "prompt"]
}
```

### Output

```json
{
  "id": "cron-2026-03-15T05:30:00Z-abc123",
  "nextRun": "2026-03-15T05:35:00Z",
  "recurring": true,
  "message": "Cron job created: will run every 5 minutes starting at 05:35"
}
```

### Behavior

- **Interval Parsing**: Accepts human-readable intervals (`5m`, `10s`, `1h`) or standard 5-field cron expressions
- **Session-Scoped**: Job exists only in current session
- **Survives Compaction**: Job state preserved through conversation compaction
- **Non-Blocking**: Returns immediately; doesn't wait for first execution

### Error Conditions

- **Invalid cron expression** → Returns error with parsing help
- **`CLAUDE_CODE_DISABLE_CRON` set** → Fails with message: "Cron scheduling is disabled (CLAUDE_CODE_DISABLE_CRON=true)"
- **Minimum interval violated** → Returns error: "Interval too frequent (min 30s)"

## CronDelete Tool

Removes a cron job by ID. The job will no longer execute.

### Input Schema

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "The cron job ID returned by CronCreate"
    }
  },
  "required": ["id"]
}
```

### Output

```json
{
  "success": true,
  "message": "Cron job deleted: cron-2026-03-15T05:30:00Z-abc123"
}
```

### Behavior

- **Idempotent**: Deleting a non-existent job returns success=false with informative message
- **Immediate**: Job stops executing immediately
- **No State Cleanup**: Job entry removed from cronJobs Map

## CronList Tool

Lists all active cron jobs in the current session.

### Input Schema

```json
{
  "type": "object",
  "properties": {}
}
```

No input required.

### Output

```json
{
  "count": 3,
  "jobs": [
    {
      "id": "cron-2026-03-15T05:30:00Z-abc123",
      "interval": "5m",
      "prompt": "/check-status",
      "lastRun": "2026-03-15T05:30:00Z",
      "nextRun": "2026-03-15T05:35:00Z",
      "failureCount": 0,
      "enabled": true
    },
    {
      "id": "cron-2026-03-15T05:25:00Z-def456",
      "interval": "10m",
      "prompt": "Summarize recent conversations",
      "lastRun": null,
      "nextRun": "2026-03-15T05:35:00Z",
      "failureCount": 0,
      "enabled": true
    },
    {
      "id": "cron-2026-03-15T05:20:00Z-ghi789",
      "interval": "5m",
      "prompt": "/check-memory",
      "lastRun": "2026-03-15T05:30:00Z",
      "nextRun": "2026-03-15T05:35:00Z",
      "failureCount": 3,
      "enabled": false,
      "disabledReason": "Exceeded max consecutive failures (3)"
    }
  ]
}
```

### Behavior

- **Read-Only**: Does not modify any jobs
- **All Jobs Shown**: Both enabled and disabled jobs listed
- **Failure Tracking Visible**: Shows failureCount for diagnosing issues
- **Empty Result**: Returns `count: 0, jobs: []` if no active jobs

## Design Rationale

### Why Session-Scoped?

Cron jobs are session-specific because:
1. They reference session context (conversation history, agent state)
2. Jobs should not persist across sessions without explicit recreation
3. Simpler state management (no need for cross-session persistence)

### Why Survive Compaction?

- Users expect long-running monitoring jobs to continue after compaction
- Job state is lightweight (just metadata + interval)
- Preserved transparently through session state serialization

### Why Circuit Breaker?

- Without it: failing command executed repeatedly → infinite errors
- With it: job disabled after N failures, requires user action to re-enable
- Typical limit: 3 consecutive failures before auto-disable

## Integration with /loop Command

`CronCreate` is the programmatic backend for the `/loop` slash command:

```
User: /loop 5m /check-status
↓
REPL handler parses: interval="5m", command="/check-status"
↓
CronCreate called: { cron: "*/5 * * * *", prompt: "/check-status", recurring: true }
↓
Job ID returned and displayed to user
```

The `/loop` command is purely a user-facing convenience layer over CronCreate.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools section
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Loop/Cron System section

Key functions:
- `CronCreateTool` - CronCreate tool object definition
- `CronDeleteTool` - CronDelete tool object definition
- `CronListTool` - CronList tool object definition
