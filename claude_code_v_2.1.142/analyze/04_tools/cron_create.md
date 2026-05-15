# CronCreate — Recurring / One-Shot Scheduled Prompt

> **Tool name:** `CronCreate`
> **Source:** `cli_inner_pretty.js:385053-385121` (`Fe_` declaration)
> **Search hint:** *schedule a recurring or one-shot prompt*

---

## Overview

`CronCreate` schedules a `prompt` to be re-enqueued at a future time, either:
- **Recurring** (`recurring: true`, default) — fires on every cron match until deleted or auto-expired.
- **One-shot** (`recurring: false`) — fires once at the next match, then auto-deletes.

Two storage tiers:
- **Session-only** (`durable: false`, default) — in-memory only, dies with the process.
- **Durable** (`durable: true`) — persists to `.claude/scheduled_tasks.json`, survives restarts.

---

## Schema

```javascript
// ============================================
// cronCreateInputSchema - pe_ strict input
// Location: cli_inner_pretty.js:385034-385049
// ============================================

// ORIGINAL (for source lookup):
pe_ = yH(() =>
  y.strictObject({
    cron: y.string().describe('Standard 5-field cron expression in local time: "M H DoM Mon DoW" ...'),
    prompt: y.string().describe("The prompt to enqueue at each fire time."),
    recurring: P2(y.boolean().optional()).describe(`true (default) = fire on every cron match ...`),
    durable: P2(y.boolean().optional()).describe("true = persist to .claude/scheduled_tasks.json ..."),
  }),
);

// READABLE (for understanding):
const cronCreateInputSchema = lazySchema(() =>
  z.strictObject({
    cron: z.string().describe('Standard 5-field cron in local time: "M H DoM Mon DoW"'),
    prompt: z.string().describe("The prompt to enqueue at each fire time."),
    recurring: optionalDefault(z.boolean().optional()).describe("true = recurring, false = one-shot"),
    durable: optionalDefault(z.boolean().optional()).describe("true = persist to .claude/scheduled_tasks.json"),
  }),
);

// Mapping: pe_→cronCreateInputSchema, P2→optionalDefault wrapper
```

---

## Key Behavior

### `validateInput` runs four checks before scheduling

1. `vk(H.cron)` — well-formed 5-field cron expression.
2. `ZFH(H.cron, Date.now()) !== null` — does it match any date in the next year? Rejects unreachable expressions like `0 0 31 2 *` (Feb 31).
3. `(await ht()).length < Bn7` (`Bn7 = 50`) — global cap of 50 simultaneously scheduled jobs.
4. `!(H.durable && BW())` — teammates (swarm members) cannot create durable crons (they don't persist).

### Jitter on fire

The scheduler adds deterministic jitter on top of the cron expression:
- **Recurring tasks**: fire up to **10% of their period** late, max **15 min**. ("Hourly" → can fire up to 6 min late.)
- **One-shot tasks landing on :00 or :30**: fire up to **90 s early** — distributes traffic away from clock boundaries.

### `_m = recurringMaxAgeMs / 86400000` days expiry

Recurring tasks auto-expire after `_m` days from creation (one final fire, then delete). This bounds session lifetime so a forgotten daily cron doesn't run forever.

---

## Key Insights

**The "avoid :00 and :30" instruction is load-bearing.** Every user asking for "9am" gets `0 9 * * *`, every user asking for "hourly" gets `0 * * * *` — without this instruction the entire Claude Code fleet would synchronize requests to the same instant. The prompt explicitly tells the model: for approximate requests pick an off-minute (`57 8 * * *`, `7 * * * *`). The 90 s early-fire jitter on :00/:30 is the runtime's safety net for cases the model didn't catch.

**Why two layers of jitter (model + runtime)?** The model can pick smart off-minutes for approximate requests, but explicit "at 9:00 sharp" requests must land on 9:00. The runtime jitter only applies to :00 and :30 (so "9:15 sharp" still hits 9:15), giving the model precise control while still load-balancing the most common collision points.

**`durable: true` requires explicit user consent.** The prompt says: "Only use durable: true when the user explicitly asks for the task to persist." Most "remind me in 5 minutes" requests stay session-only — durable should be reserved for "set this up permanently" intent.

**Returns a job ID** that callers pass to `CronDelete`. The result line is verbose by design: it states the human-readable schedule, durability mode, and (for recurring) the `_m`-day auto-expire — so the user can verify the schedule from the chat without separately querying `CronList`.

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.136:** Output now includes `humanSchedule` (from `eT(cron)`) and `prompt` text — fixed by **CronList** but the response format is shared (`humanSchedule` field appears in both the per-job CronList output and the CronCreate success message).
- **v2.1.114 (related):** Exit confirmation dialog mislabeling one-shot scheduled tasks as recurring — now shows a countdown for one-shots.
- The 50-job cap (`Bn7`) and `_m`-day expiry are version-stable.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Scheduling*

Key functions in this document:
- `CronCreateTool` (`Fe_`) — declaration with `validateInput` chain
- `cronCreateInputSchema` (`pe_`) — strict 5-field cron + prompt + flags
- `buildCronCreatePrompt` (`tY6`) — long-form model prompt with off-minute guidance
- `scheduleCronJob` (`TFH`) — scheduler add (returns job ID)
- `isValidCronExpression` (`vk`) — cron parser/validator
- `computeNextCronFireTime` (`ZFH`) — next-fire lookahead (1-year horizon)
- `humanizeCronExpression` (`eT`) — "0 9 * * 1-5" → "9:00 AM, Mon–Fri"
- `CRON_MAX_JOBS` (`Bn7`) — 50
- `CRON_RECURRING_MAX_AGE_DAYS` (`_m`) — derived from `$m.recurringMaxAgeMs`
