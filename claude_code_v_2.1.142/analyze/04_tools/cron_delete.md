# CronDelete — Cancel a Scheduled Cron Job

> **Tool name:** `CronDelete`
> **Source:** `cli_inner_pretty.js:385135-385177` (`de_` declaration)
> **Search hint:** *cancel a scheduled cron job*

---

## Overview

`CronDelete` cancels a previously-scheduled cron job by its `id`. Removes it from `.claude/scheduled_tasks.json` (durable jobs) or the in-memory session store (session-only jobs).

---

## Schema

```javascript
// ============================================
// cronDeleteInputSchema - ge_ strict input
// Location: cli_inner_pretty.js:385133
// ============================================

// ORIGINAL (for source lookup):
ge_ = yH(() => y.strictObject({ id: y.string().describe("Job ID returned by CronCreate.") }));

// READABLE (for understanding):
const cronDeleteInputSchema = lazySchema(() =>
  z.strictObject({ id: z.string().describe("Job ID returned by CronCreate.") }),
);

// Mapping: ge_→cronDeleteInputSchema
```

Output: `{ id: string }`.

---

## Key Behavior

### Two-stage validation

`de_.validateInput` rejects two conditions:

1. **Unknown id** — `(await ht()).find((_) => _.id === H.id)` returns falsy. Error: "No scheduled job with id 'X'".
2. **Ownership mismatch** — If running inside a swarm teammate context (`BW()` returns a teammate), and the job's `agentId !== currentTeammate.agentId`, the delete is rejected. Error: "Cannot delete cron job 'X': owned by another agent".

The owner check prevents one teammate from clobbering another teammate's reminders — each teammate sees and can only delete its own scheduled jobs.

### Single-job, batchable internally

The tool accepts one `id`, but the underlying `yt([H])` API takes an array — easy to extend if a multi-delete tool surface is ever wanted.

---

## Key Insights

**Why pass the **string** id rather than the cron expression?**
- Multiple jobs can share a cron expression (e.g., user schedules "every hour" with two different prompts).
- The id is the only stable identifier even after the job's prompt changes or it migrates between durable/session storage.

**`shouldDefer: true` plus `isEnabled: $V()`.** Both CronCreate and CronDelete defer to tool-search; the `isKairosCronEnabled` gate (`$V`) checks `tengu_kairos_cron` GrowthBook flag with `glK = 300_000` (5 min) cache.

---

## v2.1.112 → v2.1.142 Deltas

- The prompt template (`Hf6`) branches on `G7H()` (`isDurableCronEnabled`): when durable crons are gated off it says "Removes it from the in-memory session store" only; with durable crons it includes the `.claude/scheduled_tasks.json` path.
- Ownership filter for teammates is the long-standing teammate-isolation guarantee — durable crons were never enabled for teammates (errorCode 4 at CronCreate validate).

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Scheduling*

Key functions in this document:
- `CronDeleteTool` (`de_`) — declaration with ownership-aware validation
- `cronDeleteInputSchema` (`ge_`) — just `{ id }`
- `buildCronDeletePrompt` (`Hf6`) — durable-aware prompt builder
- `deleteCronJobs` (`yt`) — scheduler batch-delete
- `listCronJobs` (`ht`) — list for lookup
- `BW` — current teammate context accessor
