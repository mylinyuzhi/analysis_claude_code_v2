# CronList — List Active Cron Jobs (with v2.1.136 Qualifier Fix)

> **Tool name:** `CronList`
> **Source:** `cli_inner_pretty.js:385206-385264` (`ne_` declaration)
> **Search hint:** *list active cron jobs*
> **Concurrency-safe:** true · **Read-only:** true

---

## Overview

`CronList` returns all cron jobs scheduled via `CronCreate`, both durable (`.claude/scheduled_tasks.json`) and session-only.

The v2.1.136 fix landed here: the output now includes the `humanSchedule` qualifier (humanized cron expression) and the scheduled `prompt` text — both were missing before, leaving the user unable to identify which job did what without separately consulting the scheduled_tasks.json file.

---

## Schema

```javascript
// ============================================
// cronListOutputSchema - le_ jobs array with full qualifiers
// Location: cli_inner_pretty.js:385192-385205
// ============================================

// ORIGINAL (for source lookup):
le_ = yH(() =>
  y.object({
    jobs: y.array(
      y.object({
        id: y.string(),
        cron: y.string(),
        humanSchedule: y.string(),
        prompt: y.string(),
        recurring: y.boolean().optional(),
        durable: y.boolean().optional(),
      }),
    ),
  }),
);

// READABLE (for understanding):
const cronListOutputSchema = lazySchema(() =>
  z.object({
    jobs: z.array(z.object({
      id: z.string(),
      cron: z.string(),
      humanSchedule: z.string(),     // ← Added in v2.1.136
      prompt: z.string(),             // ← Added in v2.1.136
      recurring: z.boolean().optional(),
      durable: z.boolean().optional(),
    })),
  }),
);

// Mapping: le_→cronListOutputSchema
```

Input: `{}` (no parameters).

---

## Key Behavior

### Teammate filtering

```javascript
// ============================================
// CronList.call - teammate-filtered, qualifier-enriched listing
// Location: cli_inner_pretty.js:385232-385247
// ============================================

// ORIGINAL (for source lookup):
async call() {
  let H = await ht(),
    $ = BW();
  return {
    data: {
      jobs: ($ ? H.filter((_) => _.agentId === $.agentId) : H).map((_) => ({
        id: _.id,
        cron: _.cron,
        humanSchedule: eT(_.cron),
        prompt: _.prompt,
        ...(_.recurring ? { recurring: !0 } : {}),
        ...(_.durable === !1 ? { durable: !1 } : {}),
      })),
    },
  };
}

// READABLE (for understanding):
async function call() {
  const allJobs = await listCronJobs();
  const teammate = getCurrentTeammate();
  const visibleJobs = teammate
    ? allJobs.filter((j) => j.agentId === teammate.agentId)  // only this teammate's jobs
    : allJobs;                                                // all jobs in main session
  return {
    data: {
      jobs: visibleJobs.map((j) => ({
        id: j.id,
        cron: j.cron,
        humanSchedule: humanizeCronExpression(j.cron),  // v2.1.136 qualifier
        prompt: j.prompt,                                // v2.1.136 qualifier
        ...(j.recurring ? { recurring: true } : {}),
        ...(j.durable === false ? { durable: false } : {}),
      })),
    },
  };
}

// Mapping: ht→listCronJobs, BW→getCurrentTeammate, eT→humanizeCronExpression
```

### Result rendering uses all qualifiers

```javascript
content: H.jobs.length > 0
  ? H.jobs.map((q) =>
      `${q.id} — ${q.humanSchedule}${q.recurring ? " (recurring)" : " (one-shot)"}${q.durable === !1 ? " [session-only]" : ""}: ${c7(q.prompt, 80, !0)}`
    ).join("\n")
  : "No scheduled jobs.";
```

Each line shows: **id — human schedule (recurrence) [durability]: prompt (truncated to 80 chars)**. Without `humanSchedule` and `prompt` (pre-v2.1.136), the user only saw a bare id and the raw cron string.

---

## Key Insights

**Why was the v2.1.136 fix needed?** Before 2.1.136, `CronList` output was effectively useless for the model — it could list job IDs and cron expressions but not see what each job was scheduled to *do*. The model would then hallucinate prompt content when explaining a job to the user, or refuse to act on a job ID it couldn't introspect.

**Why is `humanSchedule` computed at list time, not stored?** Cron expressions are static text — humanizing them on each list is cheap (`eT(cron)`), and storing the humanization would couple persistence to a localization or rendering choice. By computing on read, the format can change without migration.

**Why ` durable: false` rendered but `durable: true` omitted?** The optional-field-only-when-deviating pattern: in 2.1.142 the default is durable=false (in-memory), so listing entries with `durable: false` flags "this is session-only despite the default having changed" and listing entries with `durable: true` omitted is implicit ("the new default is durable").

> Note: the conditional `...(_.durable === !1 ? { durable: !1 } : {})` looks backward but is intentional — only flag the deviation from the active default. The active default is gated on `G7H()` (`isDurableCronEnabled`), which when on makes `durable: true` the persistence form.

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.136 (the headline fix):** Added `humanSchedule` and `prompt` to each entry — fixed *"CronList output missing qualifiers and the scheduled prompt"*.
- The teammate-filter behavior was unchanged: a teammate sees only its own jobs; the lead/main session sees everything.
- `c7(prompt, 80, true)` truncates the prompt preview to 80 chars to keep the listing scannable.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Scheduling*

Key functions in this document:
- `CronListTool` (`ne_`) — `isReadOnly: true`, `isConcurrencySafe: true`
- `cronListOutputSchema` (`le_`) — jobs array with humanSchedule + prompt
- `buildCronListPrompt` (`qf6`) — durable-aware prompt builder
- `humanizeCronExpression` (`eT`) — cron-to-human converter
- `listCronJobs` (`ht`) — scheduler list
