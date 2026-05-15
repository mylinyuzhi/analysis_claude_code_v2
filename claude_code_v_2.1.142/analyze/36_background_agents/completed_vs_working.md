# "Completed" vs "Working" Classification — v2.1.141

## TL;DR

In v2.1.141, an agent that **finished its primary task** but **left a background shell running** (e.g., `npm run dev` started via `run_in_background: true` in Bash) is now classified as **`Completed`** in the agent view, not **`Working`**. The classifier (`byH`) reads the persistent state's `state`, `tempo`, `inFlight`, and routine markers and projects onto the four-bucket display set `{review, blocked, working, done}`.

This is a UX refinement, not a state-machine change: workers still self-report the same way, but the dashboard's interpretation now treats lingering background-shell activity as "task done" rather than "still working."

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md)

Key items:
- `STATE_LABELS` (`og4`): `{review:"Ready for review", blocked:"Needs input", working:"Working", done:"Completed"}` (cli_inner_pretty.js:569355)
- `STATE_BUCKET_ORDER` (`rg4`): `["review","blocked","working","done"]` (cli_inner_pretty.js:569354)
- `JOB_KIND_LABELS` (`So5`): `{agent:"background", repo:"repo", skill:"skill", routine:"routine"}` (cli_inner_pretty.js:569361)
- `classifyJobState` (`byH`) — projects state→bucket
- `isJobSettled` (`Qj`) — does `state.state` indicate terminal?
- `isJobTerminalState` (`cT`) — same predicate from a different call site
- `OG8.isJobLongLivedRoutine` — routine/cron/loop → never "done" (cli_inner_pretty.js:566150-566152)
- `HT$.isLoopJob` — `/loop` jobs (cli_inner_pretty.js:566146-566149)

---

## State / Tempo / Display Cascade

A bg worker writes three orthogonal signals to its `state.json`:

| Field | Domain | Meaning |
|-------|--------|---------|
| `state` | `working`, `blocked`, `done`, `failed`, `bedrock_done`, `vertex_done`, `gateway_done`, `wait-external` | The semantic outcome of the most recent assistant turn. |
| `tempo` | `active`, `idle`, `blocked` | The agent-loop's runtime liveness. |
| `inFlight` | `{ tasks: number, queued: number, kinds: string[] }` | Pending tasks (background shells, queued user messages, session_cron). |

The dashboard's `byH.classifyJobState` reads these and emits one of four display buckets:

```
                    ┌──────────────────────────────────────────┐
                    │ state.json + inFlight                    │
                    └──────────────────────────────────────────┘
                                       │
                                       ▼
        ┌─────────────────────────────────────────────────────────┐
        │ if (HT$ /* /loop */ || state.routine || cron in kinds): │
        │     bucket = "working" or "done" based on tempo         │
        │ elif state.state in {bedrock_done, vertex_done, …}:     │
        │     bucket = "done"                                     │
        │ elif state.tempo == "blocked":                          │
        │     bucket = "blocked"                                  │
        │ elif state.state == "done" || state.state == "failed":  │
        │     # NEW IN v2.1.141:                                  │
        │     # if inFlight.kinds has only "background_shell"     │
        │     # (no in-progress agent tasks):                     │
        │     bucket = "done"     ← was "working" pre-v2.1.141    │
        │ elif state.tempo == "active":                           │
        │     bucket = "working"                                  │
        │ else:                                                    │
        │     bucket = "done"                                     │
        └─────────────────────────────────────────────────────────┘
                                       │
                                       ▼
                    ┌──────────────────────────────────────────┐
                    │ "Ready for review" | "Needs input" |     │
                    │  "Working" | "Completed"                  │
                    └──────────────────────────────────────────┘
```

(The actual code is not single linear branch; this is the logical structure.)

---

## The Branch Decision in `BranchDetect`

The worker decides its `state.state` via a tagged classifier — `BranchDetect` patterns at cli_inner_pretty.js:390150-390250 — that examines the latest assistant message and tool outputs:

| Branch tag | Trigger | `state` | `tempo` |
|------------|---------|---------|---------|
| `result-then-next` | Has a result marker AND a "next steps" pattern | `working` | `idle` |
| `result-marker` | Just a result marker | `done` | `idle` |
| `failed-marker` | Failure pattern in assistant output | `failed` | `idle` |
| `blocked-marker` | Asks user for something | `blocked` | `blocked` |
| `blocked-disclaimed` | Marked blocked but assistant disclaimed | `done` | `idle` |
| `trailing-q` | Ends with a question | `blocked` | `blocked` |
| `wait-external` | External wait predicate matched | `working` | `idle` |
| `awaiting-user` | Asks for user input | `blocked` | `blocked` |
| `ask-verb` | Imperative verb pattern | `blocked` | `blocked` |
| `working-verb` | Active verb at end | `working` | `active` |

Crucially: **`state = "done"` does not mean "all background shells have exited"**. The worker is reporting only the *foreground task's* status. Background shells launched via `Bash { run_in_background: true }` continue independently, tracked in `state.inFlight.kinds` (alongside `session_cron` etc).

---

## Pre-v2.1.141 Behavior (the Bug)

Before v2.1.141, the dashboard's classifier saw `inFlight.tasks > 0` (because the bg-shell was running) and bucketed the job as `working`. The user looking at the agent view saw a "Working" indicator on a job that was, semantically, done — the agent had finished, written its result, and was now just *babysitting a dev server*. That's misleading.

## Post-v2.1.141 Behavior

The classifier now distinguishes the *kind* of in-flight task. A pending **agent task** or **session_cron** keeps a job in `working`. But pending **background shells alone** don't override `state = "done"`. The job rolls to the `done` bucket; the agent view labels it `Completed`.

The user can still see the bg shell is running — it surfaces in the per-job detail panel. The list-level summary is just no longer hiding the fact that the *agent loop* is done.

---

## Distinct from Auto-Retire

This classification fix is separate from the v2.1.141 empty-idle auto-retire (`pB5 = 300000`). The two interact: a session that's `Completed` *and* has no meaningful state (no name, no intent, no worktree, plus tempo=blocked) becomes eligible for auto-retire after 5 minutes.

But a session that's `Completed` *with* a running bg shell isn't auto-retired — it has live state (`inFlight.tasks > 0`). It stays in the dashboard's "Completed" bucket until the user explicitly closes it or until the bg shell finishes.

---

## The Routine/Loop Carve-Out

```javascript
// cli_inner_pretty.js:566150-566152
function OG8(H) {
  return H.routine !== void 0 || (H.inFlight?.kinds.includes("session_cron") ?? !1) || HT$(H);
}

function HT$(H) {
  let $ = (q) => q?.trim().toLowerCase().startsWith("/loop") ?? !1;
  return $(H.intent) || $(H.initialPrompt);
}
```

Jobs that are routines (scheduled or `/loop`-based) never appear as `done` even when the current iteration finishes — they immediately roll back to `working` (or wait for the next cron tick). The classifier respects this by short-circuiting the routine check before the done-with-shells branch.

---

## Display Layer

```javascript
// cli_inner_pretty.js:569354-569355
rg4 = ["review", "blocked", "working", "done"];
og4 = {
  review:  "Ready for review",
  blocked: "Needs input",
  working: "Working",
  done:    "Completed",
};
```

The buckets are ordered by `rg4`. The dashboard renders four groups in this order. Within each group, jobs are sorted by `s0$.stateSortOrder` (line 566070-566072), which prefers `firstTerminalAt` for `done` jobs (so most-recently-completed appear first within the Completed group) and `updatedAt` for others (so most-active appears first).

---

## Edge: A Done Job That Then Errors Out Its Background Shell

Sequence:
1. Agent finishes task. `state.state = "done"`. Bg shell still running.
2. Dashboard shows job as `Completed`.
3. Bg shell exits with an error. The worker's `BashOutput` watcher catches this.
4. Worker re-enters its agent loop to react to the shell error.
5. `state.state` flips to `working`, `tempo` to `active`. Maybe later to `blocked` if it needs user input.
6. Dashboard re-classifies. Job moves from Completed back to Working (or Needs input).

The dashboard polls `state.json` and re-renders, so the user sees the transition. There's no "sticky" classification — every render is a fresh projection from current state.

---

## Validation

| Claim | Source |
|-------|--------|
| Bucket order is review → blocked → working → done | cli_inner_pretty.js:569354 |
| Labels: `Ready for review`, `Needs input`, `Working`, `Completed` | cli_inner_pretty.js:569355 |
| Routine/loop jobs are exempted from `done` | cli_inner_pretty.js:566146-566152 |
| `state.inFlight.kinds` tracks task types | cli_inner_pretty.js:180882, 527950 |
| `session_cron` keeps a job non-retirable | cli_inner_pretty.js:527950 |
