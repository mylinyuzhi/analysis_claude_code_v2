# 36_loop_cron - Loop/Cron Scheduling System (v2.1.71+)

## Overview

The loop/cron scheduling system provides recurring task execution within Claude Code sessions. The `/loop` slash command enables users to set up recurring prompts or commands, while the `CronCreate`, `CronDelete`, and `CronList` tools provide programmatic access to the same functionality.

## Module Components

### User-Facing Interface
- `/loop [interval] [prompt-or-command]` - Recurring execution of a prompt or slash command
- Example: `/loop 5m /check-status` runs the `/check-status` command every 5 minutes

### Programmatic Tools
- `CronCreate` - Create a recurring job with interval expression
- `CronDelete` - Remove a cron job by ID
- `CronList` - List all active cron jobs in current session

### Source Location
- `/loop` command handler: chunks.188.mjs (REPL command processing)
- CronCreate/CronDelete/CronList tools: chunks.89.mjs, chunks.193.mjs
- Configuration: `CLAUDE_CODE_DISABLE_CRON` environment variable disables all cron behavior

## Key Design Decisions

### 1. Session-Scoped
- Cron jobs exist only within a session (not global)
- Jobs are created and managed per-session
- Makes sense because jobs reference session-specific context (agent state, conversation history)

### 2. Survive Compaction
- Cron job state is preserved through conversation compaction
- When compaction occurs, all active jobs are serialized into session state
- After compaction, jobs are restored with original intervals
- Next execution time is recalculated from current time

### 3. Circuit Breaker for Runaway Loops
- Each job tracks `failureCount` (consecutive execution failures)
- After N consecutive failures, the job is disabled
- Prevents infinite retry loops from blocking the agent
- User can manually delete the job or start a new session

### 4. Interval Parsing
- Human-readable: `5m`, `10s`, `2h`
- Minimum interval enforced (typically 30s or 1m to prevent excessive polling)
- Default: 10 minutes if no interval specified

## Version History

- **v2.1.71** — `/loop` command and CronCreate/Delete/List tools introduced
- **v2.1.76** — No changes (stable feature)

## Related Modules

- [09_slash_command](../09_slash_command/) - Slash command system (includes `/loop` handler)
- [13_task_system](../13_task_system/) - Task management (separate from cron scheduling)
- [03_llm_core](../03_llm_core/) - Agent loop integration (where cron jobs fire)

## Environment Configuration

Set `CLAUDE_CODE_DISABLE_CRON=true` to disable all cron behavior:
```bash
CLAUDE_CODE_DISABLE_CRON=true claude code
```

When disabled:
- CronCreate calls fail with informative error
- `/loop` command shows disabled message
- No cron jobs execute
