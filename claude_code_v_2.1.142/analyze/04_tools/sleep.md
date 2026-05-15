# Sleep — Wait For a Specified Duration (Legacy, Replaced by ScheduleWakeup in v2.1.142)

> **Tool name:** `Sleep` (legacy; not registered as a tool in the v2.1.142 bundle)
> **Source:** `/lyz/codespace/3rd/claude-code/src/tools/SleepTool/prompt.ts` (2.1.88 TypeScript baseline)
> **Status in v2.1.142:** Replaced by `ScheduleWakeup` for self-paced loop iterations; not present in v2.1.142 tool registry.

---

## Overview

`Sleep` was a 2.1.88-era tool that took a duration and waited. It was meant for cases where:
- The user explicitly told Claude to "sleep" or "rest".
- There was nothing else to do and waiting was the safer behavior than spinning.
- Claude was waiting for an external event (a CI run, a process to finish).

In v2.1.142 the role is split:
- **Self-paced loops** → `ScheduleWakeup` with `delaySeconds` + reason + prompt.
- **One-shot timed reminders** → `CronCreate` with `recurring: false`.
- **Long external waits** → return to user, let them check back.

---

## Legacy Schema (2.1.88)

```typescript
// From: src/tools/SleepTool/prompt.ts

export const SLEEP_TOOL_NAME = 'Sleep'
export const DESCRIPTION = 'Wait for a specified duration'

export const SLEEP_TOOL_PROMPT = `Wait for a specified duration. The user can interrupt the sleep at any time.

Use this when the user tells you to sleep or rest, when you have nothing to do, or when you're waiting for something.

You may receive <${TICK_TAG}> prompts — these are periodic check-ins. Look for useful work to do before sleeping.

You can call this concurrently with other tools — it won't interfere with them.

Prefer this over \`Bash(sleep ...)\` — it doesn't hold a shell process.

Each wake-up costs an API call, but the prompt cache expires after 5 minutes of inactivity — balance accordingly.`
```

The schema would have included `duration_seconds` or similar; the rest of the prompt warned the model about the same prompt-cache 5-minute TTL trade-off later inherited by `ScheduleWakeup`.

---

## Why It Was Removed / Replaced

**`Bash(sleep ...)` was the natural foothold for "wait" semantics**, but it has a real cost: holding a shell process during the sleep keeps a PID alive, occupies a sandbox slot, and may consume the parallel-shell quota. The Sleep tool was designed to avoid that by being process-free.

**But Sleep itself was eclipsed by two finer-grained primitives:**

1. **`ScheduleWakeup`** — for self-paced *loop iterations* in dynamic `/loop` mode. It returns a tool result, ends the turn, and the runtime re-invokes the model at the scheduled time. No "blocking" tool call needed.
2. **`Monitor`** — for event-driven waits. Where Sleep would wait for X seconds and check, Monitor watches a stream and pushes notifications as events occur. More efficient and more responsive.

Direct "Wait N seconds, then continue this turn" semantics are no longer supported because:
- They block the conversation UI for the user.
- They consume context window cost paying for the cached prompt during the wait.
- The right pattern is "end turn, schedule wakeup, re-enter" — which `ScheduleWakeup` formalizes.

The 5-minute prompt-cache guidance from Sleep's prompt now lives in `ScheduleWakeup`'s prompt with much more elaborate reasoning (see [schedule_wakeup.md](./schedule_wakeup.md)).

---

## Key Insights

**Why retain the documentation when the tool is gone?**
- Older session transcripts may reference `Sleep` — readers may search for "Sleep tool" expecting docs.
- The decision *why* Sleep was removed is itself useful — it documents Claude Code's evolution toward event-driven loop primitives over time-based waits.
- The cache-window guidance is the load-bearing constant; its migration to `ScheduleWakeup` is the architectural story.

**The pattern in the new world:**
```
User: "Check the deploy in 5 minutes"
Old (Sleep):     Sleep(300) → still in this turn → check
New (ScheduleWakeup): ScheduleWakeup(delaySeconds: 270, reason: "checking deploy", prompt: "<<...>>") → end turn → wakeup re-enters → check
```

The new flow is more user-friendly: the conversation isn't blocked, the spinner doesn't hang for 5 minutes, and the user can interrupt or change their mind during the wait.

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.142:** Sleep is not registered as a tool in the bundle (`_index.json` does not list it).
- The functional role split between `ScheduleWakeup` (for `/loop` dynamic mode) and `CronCreate` (for one-shot reminders) has matured across releases.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Inactive Legacy*

Key references in this document:
- 2.1.88 TS source: `src/tools/SleepTool/prompt.ts`
- v2.1.142 replacement: `ScheduleWakeup` ([schedule_wakeup.md](./schedule_wakeup.md))
- v2.1.142 related: `CronCreate` ([cron_create.md](./cron_create.md)), `Monitor` (separate doc)
