# Loop/Cron Integration

## Overview

The loop/cron system integrates with multiple subsystems within Claude Code:

1. **Agent Loop** - Main execution loop checks for pending cron jobs
2. **Tool System** - CronCreate/Delete/List registered as agent tools
3. **Session State** - Job state persisted through compaction
4. **Background Agents** - Cron jobs in background agents managed separately
5. **Slash Commands** - `/loop` command provides user-facing interface

## Integration with Agent Loop

### Cron Job Scheduling (chunks.149.mjs)

The main agent loop (`mainAgentLoop` function) includes a cron scheduler that fires pending jobs:

```javascript
// Pseudo-code: Main agent loop structure
async function mainAgentLoop(sessionState, messages) {
  while (agentActive) {
    // ... normal message processing ...

    // Check for pending cron jobs
    if (isIdleAndNoOutstandingTools()) {
      const now = Date.now();
      for (const [jobId, job] of sessionState.cronJobs.entries()) {
        if (job.enabled && now >= job.nextRun) {
          // Inject cron command as user message
          const cronMessage = {
            role: 'user',
            content: job.prompt
          };
          messages.push(cronMessage);
          job.lastRun = now;
          job.nextRun = calculateNextRun(job.interval, now);
          jobExecuted = true;
        }
      }
    }

    // ... continue normal loop ...
  }
}
```

### Execution Timing

- Cron jobs execute **when agent is idle**
- If agent is processing a user message or tool result, cron waits
- Next check happens after current message completes
- Prevents cron jobs from interrupting active conversations

### Failure Handling

- If cron command fails (exception during execution):
  - `failureCount` incremented
  - If `failureCount >= MAX_AUTO_COMPACT_FAILURES` (typically 3):
    - Job disabled (`enabled = false`)
    - User notified in conversation
    - User can delete job or investigate error
  - On success: `failureCount` reset to 0

## Integration with Tool System

### CronCreate/Delete/List Registration

The tools are registered in the standard tool registry (chunks.89.mjs):

```javascript
// Tool registry entry
{
  name: 'CronCreate',
  description: 'Create a recurring scheduled task',
  schema: { /* JSON Schema */ },
  handler: cronCreateHandler
}
```

### Tool Invocation in Agents

Agents can programmatically create/manage cron jobs:

```
Agent thinks: "I should check the system status every 5 minutes"
↓
Agent calls: CronCreate({cron: "*/5 * * * *", prompt: "/check-status"})
↓
Job created and added to session.cronJobs
↓
Agent receives confirmation with job ID
```

### Tool Results

- Tool results included in conversation context (visible to user)
- Job metadata (ID, next run time) returned for reference
- User can verify job creation, delete if needed, etc.

## Integration with Session State

### State Serialization

When conversation compaction occurs:

1. **Before Compaction**: All active cron jobs in `sessionState.cronJobs` Map
2. **Compaction**: Message history reduced, state preserved
3. **After Compaction**: `cronJobs` Map restored with same jobs
4. **Timing Adjustment**: All `nextRun` timestamps recalculated from current time

Example:
```javascript
// Before compaction
sessionState.cronJobs = Map {
  "cron-abc123" => {
    interval: "5m",
    nextRun: 1710500400000,  // Old timestamp
    ...
  }
}

// During compaction, state is serialized

// After compaction
sessionState.cronJobs = Map {
  "cron-abc123" => {
    interval: "5m",
    nextRun: 1710505000000,  // Recalculated: now + 5 minutes
    ...
  }
}
```

### Failure Counter Reset

After compaction, `failureCount` is reset to 0 for all jobs:
- Gives jobs a fresh start
- Prevents permanent disabling due to transient errors before compaction

## Integration with Background Agents

### Background Agent Cron Isolation

Background agents have their own isolated cron job sets:

- **Parent Session**: Cron jobs run in parent session context
- **Background Agent**: Inherits parent's job definitions (read-only)
- **Kill Signal**: When background agent killed, pending job executions abandoned
- **Partial Results**: If background agent killed mid-job-execution, partial results preserved in conversation

### Job Inheritance

When a background agent spawns:
```javascript
{
  tool: 'Agent',
  params: {
    type: 'EXPLORE_AGENT',
    // ... other params ...
  },
  // Cron jobs NOT automatically inherited
  // Each agent has its own cronJobs Map
}
```

Background agents can create their own cron jobs independent of parent.

## Integration with Slash Commands

### /loop Command Handler

The `/loop` slash command (chunks.188.mjs - REPL handler) is a convenience layer:

```
User input: /loop 5m /check-status
↓
REPL handler parses:
  - interval: "5m"
  - command: "/check-status"
↓
Calls CronCreate internally:
  CronCreate({ cron: "*/5 * * * *", prompt: "/check-status" })
↓
Returns: "Cron job created: xyz123, next run in 5 minutes"
```

### /cron Listing Command (potential future feature)

Could implement `/cron list` as shorthand for `CronList()`:
- Show active jobs in friendly format
- Filter by job type
- Show timing info

Currently, users must use the `CronList` tool directly.

## Integration with Compaction State Preservation

### How Plan Mode State is Preserved

(Related: 07_compact module)

After compaction, cron job state is included in the minimal state snapshot:

```javascript
// State snapshot during compaction
{
  conversationLength: 150,      // Reduced messages
  tokenCount: 35000,            // Reduced tokens
  lastCompactedAt: timestamp,
  cronJobs: [...],              // ← Preserved!
  planState: {...},             // ← Also preserved
  sessionName: "...",           // ← Also preserved
}
```

The `cronJobs` Map is a top-level key in session state, so it survives compaction.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Loop/Cron System section
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent Loop, Tools sections

Key functions/features:
- `mainAgentLoop` (ZR) - Main agent loop with cron scheduler
- `cronScheduler` - Cron job firing logic (part of main loop)
- `CronCreate`, `CronDelete`, `CronList` tools - Programmatic interfaces
- `/loop` command handler - User-facing slash command

## Environment Variables

### CLAUDE_CODE_DISABLE_CRON

When set to any truthy value (`true`, `1`, `yes`):
- `CronCreate` and `/loop` reject with error
- Existing jobs are NOT executed
- Job state still tracked (can be re-enabled by unsetting env var)

```bash
# Disable cron scheduling
CLAUDE_CODE_DISABLE_CRON=true claude code

# Or in session:
export CLAUDE_CODE_DISABLE_CRON=1
```

Use case: Prevent resource-intensive polling in resource-constrained environments.
