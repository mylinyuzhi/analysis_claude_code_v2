# `/loop` — Deep Analysis (Claude Code v2.1.183)

> The richest of the four reconstructed slash commands. `/loop` runs a prompt or
> slash command on a recurring interval — or, with no interval, lets the model
> **self-pace**. It is a *bundled skill* (`type:'prompt'`, `source:'bundled'`),
> not deterministic scheduling code: the model parses the input, converts intervals
> to cron, and drives the wakeup loop, guided entirely by a generated prompt.
>
> - **Reconstructed readable source (primary input):** [`reconstructed_source/skills/bundled/loop.ts`](reconstructed_source/skills/bundled/loop.ts)
> - **Anchor dossier:** [`reconstructed_source/_anchors_loop.md`](reconstructed_source/_anchors_loop.md)
> - **Conventions:** [`reconstructed_source/_conventions.md`](reconstructed_source/_conventions.md)
> - **PRIMARY truth (183 bundle):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (cited as `cli_inner_pretty.js:NNN`)
> - **Before-picture:** v2.1.156 bundle (tagged `(v2.1.156)`); v2.1.88 named-TS ancestor `src/skills/bundled/loop.ts` (tagged `(v2.1.88)`)

---

## 1. What `/loop` is

`/loop` is registered by `registerLoopSkill` (`_1f`) which calls the bundled-skill
registrar `ap` (= v2.1.88's `registerBundledSkill`) with `name:"loop"` and
`aliases:["proactive"]` (`cli_inner_pretty.js:649251-649254`). The registrar emits a
`Command` of `type:"prompt"`; its `getPromptForCommand(args, ctx)` does **not** schedule
anything itself — it returns a `[{ type:"text", text:<prompt> }]` block that *instructs the
model* how to parse, convert, schedule (or self-pace), and execute. The actual scheduling
happens when the model calls the `CronCreate` / `ScheduleWakeup` / `Monitor` tools named in
that prompt.

The skill exposes three feature-gated surfaces, all read at call time:

- `isLoopEnabled` (`IB`) — the master `isEnabled` gate:
  `!parseBoolean(env.CLAUDE_CODE_DISABLE_CRON) && featureFlag("tengu_kairos_cron", true, …)` (`cli_inner_pretty.js:221593-221594`).
- `isDynamicLoopEnabled` (`jAe`) — `featureFlag("tengu_kairos_loop_dynamic", false)` (`cli_inner_pretty.js:221035-221036`); toggles the self-pacing branch.
- `isLoopDefaultPromptEnabled` (`o5r`, exported as `_9e.isLoopDefaultPromptEnabled`) — `featureFlag("tengu_kairos_loop_prompt", false)` (`cli_inner_pretty.js:220891-220892`); toggles the empty-input "default" path (loop.md / autonomous).

Both `description` and `argumentHint` are **getters** that read these flags live, so the
slash-menu text shifts as the flags flip (`cli_inner_pretty.js:649256-649266`): when dynamic
is on, `argumentHint` relaxes from `"[interval] <prompt>"` (prompt required) to
`"[interval] [prompt]"` (prompt optional), reflecting that an empty `/loop` now does
something useful.

---

## 2. THE DISPATCH ALGORITHM

This is the core of the command. `getPromptForCommand` is a **3-way dispatch** whose
top-level structure is: *first try the empty-input "default" path; if that's not applicable,
fall through to dynamic mode; if dynamic is off, fall through to legacy fixed-interval mode.*

**What it does:** Maps `(input, dynamicFlag, defaultPromptFlag, everyMatch, isEmpty)` to one
of seven leaf prompts (or two usage messages), selecting which of three execution models the
model will be told to drive.

**How it works** — step by step (`cli_inner_pretty.js:649269-649359`, readable mirror in
[`loop.ts:518-568`](reconstructed_source/skills/bundled/loop.ts#L518)):

1. **Parse.** Trim the input (`n = args.trim()`). Compute three predicates
   (`cli_inner_pretty.js:649272-649274`):
   - `everyMatch = trimmed.match(EVERY_RE)` — does the input *end* with a `every <N><unit>` clause?
   - `isEmpty = !trimmed` — is the input blank?
   - `isIntervalOrEvery = INTERVAL_RE.test(trimmed) || everyMatch !== null` — is the input *only* an interval (`5m`) or an `every …` clause, with **no prompt body**?

   `INTERVAL_RE` (`u1f`) is `/^\d+[smhd]$/` and `EVERY_RE` (`d1f`) is
   `/^every\s+(\d+)\s*(s|sec|…|d|day|days)\s*$/i` (`cli_inner_pretty.js:649383-649384`). Note
   `EVERY_RE` is anchored `^…$`: it only matches when the *whole trimmed input* is an `every`
   clause — i.e. when there's no prompt left over.

2. **Branch (A) — the empty-input default-prompt path.** `if (isEmpty || isIntervalOrEvery)`
   (`cli_inner_pretty.js:649275`): the user typed nothing, or just an interval/cadence with no
   task. *Only* in this case, and *only* if `isLoopDefaultPromptEnabled()`
   (`cli_inner_pretty.js:649276`), build a "default" prompt. The displayed interval is
   `intervalFromEveryMatch(everyMatch) || trimmed || DEFAULT_INTERVAL` (so a bare `30m` keeps
   `30m`, a bare `every 2 hours` becomes `2h`, a blank input becomes `10m`). Read the loop.md
   file (`loopFile = readLoopFile()`, `cli_inner_pretty.js:649347`), then split on the dynamic flag:
   - `if (isEmpty && isDynamicLoopEnabled())` → `buildEmptyInputDefaultPrompt(loopFile, interval, dynamic=true)` (`cli_inner_pretty.js:649348`)
   - else → `buildEmptyInputDefaultPrompt(loopFile, interval, dynamic=false)` (`cli_inner_pretty.js:649349`)

   **Critical subtlety:** the `dynamic=true` leg requires `isEmpty` *specifically* (not
   `isIntervalOrEvery`). A bare interval like `/loop 30m` has an explicit cadence, so even with
   dynamic on it takes the **cron-scheduled default** (`dynamic=false`) — you only self-pace
   when you gave no cadence at all.

3. **Fall-through.** If `isLoopDefaultPromptEnabled()` is *false*, branch (A)'s inner `if`
   does nothing and control **falls out** of the `if (isEmpty || isIntervalOrEvery)` block to
   the branches below (`cli_inner_pretty.js:649350-649352`). This is easy to misread: entering
   the empty-input region does not *commit* to it — the default-prompt flag is the real gate.

4. **Branch (B) — dynamic mode.** `if (isDynamicLoopEnabled())` (`cli_inner_pretty.js:649353`):
   empty input → `buildDynamicUsageMessage()` (`h1f`); non-empty → `buildDynamicLoopPrompt(trimmed)`
   (`y1f`). This prompt carries *both* a fixed-interval section (rules 1 & 2) and a dynamic-mode
   section (rule 3 = no interval → self-pace).

5. **Branch (C) — legacy fixed-interval mode.** Else (`cli_inner_pretty.js:649357`): empty →
   `LEGACY_USAGE_MESSAGE` (`f1f`); non-empty → `buildFixedIntervalLoopPrompt(trimmed)` (`g1f`).
   This is the direct descendant of v2.1.88's `buildPrompt(args)`.

### The decision tree

```
input.trim()
│
├─ everyMatch  = EVERY_RE.match(input)            // trailing "every 20m" / "every 5 minutes"
├─ isEmpty     = input === ""
├─ isIntervalOrEvery = INTERVAL_RE.test(input) || everyMatch != null   // bare "5m" / "every 2h"
│
├─ (A) if (isEmpty || isIntervalOrEvery):
│        if isLoopDefaultPromptEnabled():                 // tengu_kairos_loop_prompt
│            interval = intervalFromEveryMatch | input | "10m"
│            loopFile = readLoopFile()                    // <root>/.claude/loop.md → <cwd>/loop.md
│            ├─ isEmpty && isDynamicLoopEnabled()  → default(loopFile, dynamic=true)   ─┐
│            └─ else                               → default(loopFile, dynamic=false)  ─┤  4 leaf prompts:
│                                                                                       │   loopFile×{dyn,cron}
│        else:  fall through ↓                                                          │   autonomous×{dyn,cron}
│                                                                                      ─┘
├─ (B) if isDynamicLoopEnabled():                         // tengu_kairos_loop_dynamic
│        isEmpty → buildDynamicUsageMessage()    ; else → buildDynamicLoopPrompt(input)
│
└─ (C) legacy (dynamic off):
         isEmpty → LEGACY_USAGE_MESSAGE          ; else → buildFixedIntervalLoopPrompt(input)
```

**Why this approach (cascade-with-fall-through rather than a single switch):** The three flags
are *independent rollout knobs*. `tengu_kairos_loop_prompt` (default prompt) can be on while
`tengu_kairos_loop_dynamic` (self-pacing) is off, and vice-versa. A flat `switch` on a single
mode enum couldn't express "empty input takes the default path, but a typed prompt still takes
dynamic/legacy." The cascade lets each capability layer in on top of the legacy command
without rewriting the lower layers — branch (C) is exactly v2.1.88's behavior, (B) wraps it,
and (A) front-runs it for the empty-input case. The trade-off is that the fall-through in (A)
is invisible at a glance (no `else` after the inner `if`); the reconstruction documents it
explicitly at [`loop.ts:552`](reconstructed_source/skills/bundled/loop.ts#L552) because it's
the single most error-prone line to read.

**Key insight:** *Branch order encodes precedence, and the empty-input branch is "opt-in, not
committal."* Entering `if (isEmpty || isIntervalOrEvery)` does not mean you'll return a default
prompt — only the inner `isLoopDefaultPromptEnabled()` decides that. If that flag is off, an
empty `/loop` falls all the way through to a usage message (dynamic or legacy). This is why the
reconstruction places a `// (falls through …)` comment and not an `else`.

---

## 3. THE THREE EXECUTION MODELS

The seven leaf prompts collapse into three *execution models* — three distinct ways the loop
keeps itself alive between iterations. Understanding these is understanding `/loop`.

### 3.1 Fixed-interval cron (legacy / explicit cadence)

**What it does:** Converts an interval to a 5-field cron expression and schedules a *recurring*
job via `CronCreate`; the cron runtime re-injects the prompt each tick.

**How it works:** `buildFixedIntervalLoopPrompt` (`g1f`) and the fixed-interval half of
`buildDynamicLoopPrompt` (`y1f`) instruct the model to:
1. Parse `[interval] <prompt>` (rules 1–3).
2. Convert the interval using the **cron table** `CRON_TABLE` (`m1f`,
   `cli_inner_pretty.js:649367-649368`) — `Nm where N≤59 → */N * * * *`, `Nm where N≥60 →
   0 */H * * *`, `Nh → 0 */N * * *`, `Nd → 0 0 */N * *`, `Ns → ceil(N/60)m`. The table itself
   tells the model what to do when an interval doesn't cleanly divide its unit (`7m`, `90m`):
   round to the nearest clean interval and tell the user.
3. Call `CronCreate` with `cron`, `prompt` (verbatim), `recurring:true`
   (`fixedIntervalActionBlock` `A1f`, `cli_inner_pretty.js:649134-649137`).
4. Confirm — including that recurring tasks **auto-expire after `DEFAULT_MAX_AGE_DAYS`**
   (`ree = recurringMaxAgeMs / 86400000`, `cli_inner_pretty.js:221680`) and can be cancelled
   sooner with `CronDelete`.
5. **Execute the prompt now** — "don't wait for the first cron fire."

**Why this approach:** Cron is the right fit when the user *gave* a cadence: the cadence is
fixed, deterministic, and cheap to express as a crontab line. The cost is rigidity — cron has a
1-minute floor (hence `Ns → ceil(N/60)m`) and can't express non-dividing intervals (`90m`).

**Key insight:** The model, not the code, performs the interval→cron conversion. The prompt
hands the model a lookup table and edge-case rules; this is deliberate (see §6).

### 3.2 Dynamic self-pacing (`ScheduleWakeup` + `Monitor`)

**What it does:** Instead of a fixed cadence, the model *decides each turn* how long to wait
(or which event to wait for) and re-arms itself. There is no cron job; the loop is a chain of
self-scheduled wakeups.

**How it works** (dynamic-mode body `t` inside `buildDynamicLoopPrompt`,
`cli_inner_pretty.js:649203-649237`; readable at
[`loop.ts:300-310`](reconstructed_source/skills/bundled/loop.ts#L300)):
1. **Run the parsed prompt now.**
2. **If the next run is gated on an observable event** (CI finishing, a log line, a file
   change, a PR comment) and no `Monitor` is already running, arm one with `persistent:true`.
   Its events arrive as `<task-notification>` messages and **wake the loop immediately** — the
   model does not wait for the `ScheduleWakeup` deadline. Arm *once*; on later iterations call
   `TaskList` first and skip if a monitor is already running.
3. **Briefly confirm** (in text, *before* the wakeup call — the turn ends the instant
   `ScheduleWakeup` returns).
4. **As the last action of the turn, call `ScheduleWakeup`** with `delaySeconds`, `reason`, and
   `prompt` = the full original `/loop` input prefixed with `/loop ` so the next firing
   **re-enters this skill** and continues the loop.
5. **If woken by a `<task-notification>`** (not the scheduled prompt): handle the event, then
   re-arm `ScheduleWakeup` with the same prompt and the same 1200–1800s `delaySeconds` — the
   `Monitor` stays the primary signal; this only resets the safety net.
6. **To stop:** omit the `ScheduleWakeup` call and `TaskStop` any `Monitor` you armed (use
   `TaskList` to find the task ID if it's no longer in context).

The two wake mechanisms compose: `Monitor` is the *event-gated, immediate* signal; the
`ScheduleWakeup` `delaySeconds` is the **fallback heartbeat** — a safety net so the loop
recovers even if the event never fires.

#### The 1200–1800s heartbeat / 5-minute cache rationale

This is the cleverest tuning in the file. The `delaySeconds` guidance reads (verbatim,
`cli_inner_pretty.js:649223`):

> with a `Monitor` armed this is the **fallback heartbeat** — how long to wait if no event
> fires (lean 1200–1800s; idle ticks past the 5-minute cache window are pure overhead).

**What it does:** Steers the model toward a 20–30 minute fallback delay rather than a tight
poll.

**Why this approach:** Anthropic's prompt cache has a ~5-minute TTL. Within that window,
re-entering the loop reuses the cached message-prefix (system prompt + the long, static loop
instructions), so a wakeup is cheap. Past 5 minutes the cache has expired anyway, so the prefix
must be re-sent regardless — meaning *any* wakeup after the cache window costs a full prefix
re-read. Given that, polling every few minutes buys you nothing the `Monitor` doesn't already
provide (the `Monitor` wakes you *immediately* on a real event), while burning tokens on idle
ticks. So once you're paying the cache-miss cost anyway, you may as well wait a *long* time
(20–30 min) for the safety net to fire — hence "idle ticks past the 5-minute cache window are
pure overhead." The `Monitor` handles *responsiveness*; the heartbeat handles *liveness*.

**Trade-off:** A long heartbeat means that if the `Monitor` silently dies, recovery is delayed
up to ~30 minutes. The design accepts that latency in exchange for not torching tokens on a
poll loop — appropriate because event-gated work (CI, PRs) is naturally bursty, not
millisecond-sensitive.

**Key insight:** *Self-pacing exists to make event-driven loops cheap.* A naïve recurring cron
would have to poll at the granularity of the fastest event you care about; `Monitor` +
heartbeat decouples *responsiveness* (immediate, via `Monitor`) from *cost* (a sparse heartbeat
tuned to the cache boundary). The prompt even tells the model to read `ScheduleWakeup`'s own
tool description for "cache-aware delay guidance," pushing the fine-grained tuning to the place
that knows the live cache state.

### 3.3 Autonomous / loop.md default (sentinel-driven, cached-prefix)

**What it does:** When the user typed *nothing* (and the default-prompt flag is on), `/loop`
runs a "default" body — either the tasks in their `loop.md` file, or a built-in *autonomous*
check — and keeps it alive via cron **or** dynamic pacing, depending on `dynamic`.

**How it works** (`buildEmptyInputDefaultPrompt`, the inner closure `a(loopFile, dynamic)` in
`_1f`, `cli_inner_pretty.js:649278-649345`; readable at
[`loop.ts:367-470`](reconstructed_source/skills/bundled/loop.ts#L367)). It's a 2×2 matrix:

| | `loopFile` present | `loopFile` null (autonomous) |
|---|---|---|
| **`dynamic=true`** | run loop.md now, then `ScheduleWakeup` with sentinel `LOOP_FILE_DYNAMIC_SENTINEL` | run autonomous check now, then `ScheduleWakeup` with `AUTONOMOUS_LOOP_DYNAMIC_SENTINEL` |
| **`dynamic=false`** | recurring `CronCreate` with sentinel `LOOP_FILE_SENTINEL` | recurring `CronCreate` with `AUTONOMOUS_LOOP_SENTINEL` |

- `loopFile` comes from `readLoopFile` (`r1i`), which probes `<root>/.claude/loop.md` then
  `<cwd>/loop.md`, returning `{path, content}` or `null`; content >25 000 bytes is truncated
  (`cli_inner_pretty.js:220942`).
- The autonomous body comes from `getAutonomousLoopPreamble` (`t5r`), which returns the
  *persistent* preamble `qOi` or the *non-persistent* `JWr` depending on
  `isLoopPersistentPreambleEnabled` (`YTn` = `parseBool(env.CLAUDE_CODE_LOOP_PERSISTENT) ||
  featureFlag("tengu_kairos_loop_persistent", false)`, `cli_inner_pretty.js:220859-220865`).
  On first activation, `logAutonomousLoopActivation` (`n5r`) fires
  `tengu_kairos_loop_persistent_activated` with the chosen variant
  (`cli_inner_pretty.js:220866-220868`).

**The sentinel mechanism** is the key design move. Rather than passing the full (possibly
25 KB) loop.md content or the long autonomous preamble back through `CronCreate`/`ScheduleWakeup`
as the recurring `prompt`, the model passes back a tiny **sentinel string** —
`"<<loop.md>>"` / `"<<loop.md-dynamic>>"` / `"<<autonomous-loop>>"` /
`"<<autonomous-loop-dynamic>>"` (`cli_inner_pretty.js:221013-221014, 220801-220802`). At fire
time the runtime *expands* the sentinel:

- **first delivery** (and, for loop.md, whenever the file changed since last fire, or first fire
  post-compact) → the **full** instructions;
- **subsequent unchanged fires** → a **short reminder**.

The prompt explains this verbatim (`cli_inner_pretty.js:649325`): *"it expands at fire time to
the full loop.md contents on first delivery … and to a short reminder on subsequent unchanged
fires. The long instructions stay in the cached message-prefix."*

**Why this approach (sentinel vs. inlining):** The recurring `prompt` field is stored and
re-injected every tick. If it carried the full body, every fire would re-inject (and re-tokenize)
the whole 25 KB — and worse, it would *change* the cached message-prefix on each edit, busting
the prompt cache. By storing a stable 12-character sentinel and expanding it *at the runtime
boundary*, the long static content lives in the **cached prefix** (shared, free on cache hits)
while only the tiny sentinel travels through the scheduling tools. The "full on first / changed,
short on subsequent" expansion is exactly the prompt-cache-friendly pattern: the heavyweight
text is sent once to seed the cache, then never again unless it actually changed.

**Key insight:** *The sentinel is an indirection that keeps the prompt cache stable.* It
separates "what the loop should do" (big, static, cached) from "wake me again to keep looping"
(tiny, dynamic, the only thing that flows through `CronCreate`/`ScheduleWakeup`). This is the
same cache-economy reasoning as the 1200–1800s heartbeat, applied to the *prompt body* instead
of the *cadence*.

---

## 4. Conditional sections: cloud-offer (`a7l`) and session-only footer (`l7l`)

Two interpolated sections are spliced into the fixed-interval prompts. Both exist because a
local `/loop` **dies when the session closes**, whereas `/schedule` runs durably in Anthropic's
cloud — so for long/daily cadences `/loop` actively *redirects the user to `/schedule`*.

### `cloudOfferSection` (`a7l`, `cli_inner_pretty.js:649098-649123`)

**What it does:** Injects a "## Offer cloud first" block that tells the model to ask the user —
via `AskUserQuestion` — whether to set the task up as a durable **cloud schedule** instead, when
either (a) the parsed interval is **≥60 minutes**, or (b) the input uses **daily phrasing**
("every morning", "daily", "every weekday", …). If the user picks Cloud schedule, the model
invokes the `schedule` skill (via the `Skill` tool) with the original input verbatim and
**stops** — no `CronCreate`, no `ScheduleWakeup`, no execute-now.

**The gate** (`cli_inner_pretty.js:649100-649104`):
```
!parseBoolean(env.CLAUDE_CODE_REMOTE)        // not already a remote session
&& !isBackgroundSession()                    // not a bg session
&& isFeatureFlagEnabled("tengu_surreal_dali")// the cloud-offer feature flag
&& isFeatureAllowed("allow_remote_sessions") // entitlement
&& getAllowedChannels().length === 0         // NO remote channels currently connected
```

### `sessionOnlyFooterLine` (`l7l`, `cli_inner_pretty.js:649126-649132`)

**What it does:** Appends an italic confirmation footer —
`_Runs until you close this session · For durable cloud-based loops, use /schedule_` — to make
the session-only nature explicit. Two branches share the *same gate minus the channels check*:
- **channels already connected** (`getAllowedChannels().length > 0`) → *always* append the line.
- **no channels** → append it **only if** the cloud-offer question was *not* already shown
  (i.e. neither ≥60min nor daily trigger applied), to avoid nagging a user who already answered.

**Why this approach — why `/loop` offers `/schedule` for ≥60min/daily cadences:** A local loop
is bounded by the session lifetime. A 5-minute poll is fine — you're sitting there. But a
"check the deploy every morning" loop is almost certainly meant to outlive the terminal, and a
*daily* local loop literally **can't fire** before a normal session ends (the cloud-offer's
"This session only" branch even tells the model to explain this and refuse to schedule a
useless daily local cron, `cli_inner_pretty.js:649120`). So the ≥60min/daily heuristic is a
proxy for "the user probably wants durability," and the command steers them to `/schedule`
*before* committing a local cron that would silently never run. The `tengu_surreal_dali` flag +
`allow_remote_sessions` entitlement gate it to environments where cloud scheduling is actually
available; the `channels===0` check on the *offer* (but not the *footer*) avoids offering cloud
to someone who already has a remote channel wired up — they get the footnote instead of a full
interruption.

**Key insight:** These two sections are the "don't lose the user's automation" safety layer.
They encode the product decision that `/loop` and `/schedule` are *complementary* — `/loop` for
ephemeral session work, `/schedule` for durable cloud routines — and they nudge across that
boundary at exactly the cadence threshold where ephemerality becomes a footgun.

### Push-notification outcome suffix (`i7l`, `cli_inner_pretty.js:649085-649088`)

A smaller conditional: `pushNotifOutcomeSuffix` appends "before you stop, send a one-line
outcome via `PushNotification`" to the dynamic-mode "to stop the loop" instruction, but only
when `isAgentPushNotifEnabled` (`TCe` = push-notif feature && `agentPushNotifEnabled`
entitlement, `cli_inner_pretty.js:220758`). Rationale: a self-pacing loop may run while the user
is away; the suffix ensures they hear the result. It's suppressed when the user themselves just
told the model to stop ("they're already here").

---

## 5. EVOLUTION

### vs v2.1.88 (fixed-interval ONLY)

The v2.1.88 named ancestor `src/skills/bundled/loop.ts` is *only* the fixed-interval command:
a `DEFAULT_INTERVAL = '10m'`, a `USAGE_MESSAGE`, a single `buildPrompt(args)` (the cron-table
parser/scheduler), and a `getPromptForCommand` that does just `empty → USAGE; else → buildPrompt`.
A grep of that file for `ScheduleWakeup`, `dynamic`, `autonomous`, `loop.md`, `menuDescription`,
or `self-pace` returns **zero** matches — none of the dynamic/autonomous machinery existed.

The 2.1.183 `buildFixedIntervalLoopPrompt` (`g1f`) is the byte-for-byte descendant of that
`buildPrompt`, with exactly two interpolations added: `${cloudOfferSection()}` and
`${sessionOnlyFooterLine()}`. The cron table, parsing rules, examples, and action block are
unchanged from v2.1.88.

Everything else — branches (A) and (B), `ScheduleWakeup`/`Monitor` self-pacing, the
loop.md/autonomous defaults, the four sentinels, the persistent preamble, the cloud-offer — is
**post-2.1.88** and was reconstructed directly from the 183 bundle.

### Which capabilities predate 2.1.156 (and which is the actual delta)

**This is the precise part.** The entire dynamic/loop.md/autonomous/persistent machine
**already shipped in 2.1.156.** Verified by grep over the 2.1.156 bundle:
`tengu_kairos_loop_dynamic` (1 hit), `tengu_kairos_loop_prompt` (1), `tengu_kairos_loop_persistent`
(2), `tengu_surreal_dali` (5), `<<autonomous-loop-dynamic>>` (2), `<<loop.md-dynamic>>` (1) — all
present. So self-pacing, the default prompt, the autonomous preamble (persistent + non-persistent),
the cloud-offer section, and the sentinels are **not** new in 183.

**The single behavioral delta 2.1.156 → 2.1.183 is the new `menuDescription` field.** Grep for
`menuDescription` returns **0 hits in the 2.1.156 bundle** and **18 in 2.1.183**. The registrar
`ap` now forwards it (`menuDescription: e.menuDescription`, `cli_inner_pretty.js:546993`), and
`_1f` sets it to `"Repeat a prompt or command on an interval (e.g. /loop 5m /foo)"`
(`cli_inner_pretty.js:649254`). `menuDescription` is the short slash-menu label;
`description` remains the (dynamic-aware) model-invocation text. Everything else between 156 and
183 is re-mangling noise (`_1f`←`nhz`, `ap`←`bA`, `IB`←`ch`, `jAe`←`hwH`, `_9e`←`_bH`, …) — not a
behavior change.

---

## 6. Why a PROMPT command, not deterministic code

**The decision:** `/loop` ships as a bundled *skill* (`type:"prompt"`) — `getPromptForCommand`
returns *instructions* and the **model** does the parsing, the interval→cron arithmetic, the
event-vs-time pacing decision, and the tool calls. The host code only assembles the prompt and
plugs in flags/sentinels.

**Why this approach:**

1. **Parsing is fuzzy, and the model is the natural fuzzy parser.** The parse must handle
   `5m /babysit-prs` (leading token), `check the deploy every 20m` (trailing clause),
   `run tests every 5 minutes` (word units), and `check every PR` (the word "every" *not*
   followed by a time — no interval). The `INTERVAL_RE`/`EVERY_RE` regexes pre-classify the
   *empty/bare* cases for dispatch, but the *meaningful* split of "interval vs prompt body,"
   including the `check every PR` false-positive, is left to the model via worked examples in the
   prompt. Encoding all of natural-language cadence ("every morning", "each night", "every
   weekday") in deterministic code would be brittle; the model does it robustly.

2. **The cron conversion has judgement calls.** Non-dividing intervals (`7m` → uneven gaps,
   `90m` → 1.5h which cron can't express) require *rounding to the nearest clean interval and
   telling the user what changed.* That's a conversational decision, not a pure function — so the
   table is handed to the model along with the rounding rule.

3. **The pacing decision is genuinely a reasoning task.** Branch (B)/(3.2) asks the model to
   decide "is the next run gated on an event or a passage of time?" and to pick a fallback
   heartbeat "based on what you observed this turn." No static interval can do this; it requires
   looking at the live state (CI in flight? quiet branch?). A prompt is the only way to put that
   decision where the context is.

4. **Cheap evolvability behind flags.** Because the whole command is a string template, the
   product can A/B-roll dynamic mode, the default prompt, and the persistent preamble purely via
   feature flags — exactly what `isDynamicLoopEnabled`/`isLoopDefaultPromptEnabled`/
   `isLoopPersistentPreambleEnabled` do — without shipping new control-flow code. The 2.1.88 →
   2.1.183 history (a fixed-interval parser growing into a self-pacing engine) is almost entirely
   *prompt growth*, which is far cheaper to ship and reason about than equivalent deterministic
   scheduling logic.

**The trade-off:** Correctness is now *probabilistic* — the model can mis-round a cron, mis-split
a prompt, or pick a bad delay. The design mitigates this with worked examples, an explicit cron
table, the "tell the user what you rounded to" rule, and by pushing fine-grained delay tuning to
the `ScheduleWakeup` tool description. The alternative — a deterministic parser + scheduler —
would be exact but rigid, unable to handle daily-phrasing redirection, event-gated pacing, or
the cloud-offer judgement, and far costlier to evolve. For a feature whose whole value is
*flexible, judgement-driven recurrence*, the prompt-command trade is the right one.

**Key insight:** `/loop`'s host code is deliberately thin — three feature gates, two regexes for
dispatch, a sentinel table, and a pile of string templates. *All the intelligence lives in the
prompt because all the hard parts (fuzzy parsing, cron judgement, event-vs-time pacing) are
reasoning tasks, and the only things that must be deterministic (which flag is on, which sentinel
to emit, whether to show the cloud offer) are exactly what the code keeps for itself.*

---

## 7. Representative code snippet

```javascript
// ============================================
// dispatch — getPromptForCommand 3-way branch (registerLoopSkill)
// Location: cli_inner_pretty.js:649269-649359
// ============================================

// ORIGINAL (for source lookup):
async getPromptForCommand(e, t) {
  let n = e.trim();
  { let r = n.match(d1f), o = !n, s = u1f.test(n) || r !== null;
    if (o || s) { if (_9e.isLoopDefaultPromptEnabled()) {
      let i = r ? p1f(r) : n || agt, a = (c, u) => { /* …loopFile×{dyn,cron} / autonomous×{dyn,cron}… */ },
        l = _9e.readLoopFile();
      if (o && jAe()) return [{ type: "text", text: a(l, !0) }];
      return [{ type: "text", text: a(l, !1) }]; } } }
  if (jAe()) { if (!n) return [{ type: "text", text: h1f() }]; return [{ type: "text", text: y1f(n) }]; }
  if (!n) return [{ type: "text", text: f1f }];
  return [{ type: "text", text: g1f(n) }];
}

// READABLE (for understanding):
async getPromptForCommand(args /* , ctx */) {
  const trimmed = args.trim();
  const everyMatch = trimmed.match(EVERY_RE);                 // d1f
  const isEmpty = !trimmed;
  const isIntervalOrEvery = INTERVAL_RE.test(trimmed) || everyMatch !== null; // u1f

  if (isEmpty || isIntervalOrEvery) {                         // branch (A): empty-input default
    if (isLoopDefaultPromptEnabled()) {                       // o5r / tengu_kairos_loop_prompt
      const interval = everyMatch ? intervalFromEveryMatch(everyMatch) : trimmed || DEFAULT_INTERVAL;
      const loopFile = readLoopFile();                        // r1i
      if (isEmpty && isDynamicLoopEnabled())                  // jAe / tengu_kairos_loop_dynamic
        return [{ type: 'text', text: buildEmptyInputDefaultPrompt(loopFile, interval, true) }];
      return [{ type: 'text', text: buildEmptyInputDefaultPrompt(loopFile, interval, false) }];
    }
    // else: FALL THROUGH (no else) — default-prompt flag off
  }
  if (isDynamicLoopEnabled()) {                               // branch (B): self-pacing
    if (!trimmed) return [{ type: 'text', text: buildDynamicUsageMessage() }];   // h1f
    return [{ type: 'text', text: buildDynamicLoopPrompt(trimmed) }];            // y1f
  }
  if (!trimmed) return [{ type: 'text', text: LEGACY_USAGE_MESSAGE }];           // branch (C): f1f
  return [{ type: 'text', text: buildFixedIntervalLoopPrompt(trimmed) }];        // g1f
}

// Mapping: e→args, n→trimmed, r→everyMatch, o→isEmpty, s→isIntervalOrEvery, i→interval,
//   a→buildEmptyInputDefaultPrompt(closure), l→loopFile, d1f→EVERY_RE, u1f→INTERVAL_RE,
//   p1f→intervalFromEveryMatch, agt→DEFAULT_INTERVAL, _9e.isLoopDefaultPromptEnabled→o5r,
//   _9e.readLoopFile→r1i, jAe→isDynamicLoopEnabled, h1f→buildDynamicUsageMessage,
//   y1f→buildDynamicLoopPrompt, f1f→LEGACY_USAGE_MESSAGE, g1f→buildFixedIntervalLoopPrompt
```

---

## Related Symbols

> Symbol mappings live only in the central index files, never as tables here.
> Slash Commands route to the **Integrations** index per project conventions:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure (LSP, Chrome, IDE, UI, Plugin, Slash Commands)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents / scheduling adjacent)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure (Telemetry, Model)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `registerLoopSkill` (`_1f`) — registers the `loop` bundled skill via `ap` (cli_inner_pretty.js:649251)
- `registerBundledSkill` (`ap`) — bundled-skill registrar; now forwards `menuDescription` (cli_inner_pretty.js:546973, :546993)
- `isLoopEnabled` (`IB`) — master gate: `!DISABLE_CRON && tengu_kairos_cron` (cli_inner_pretty.js:221593)
- `isDynamicLoopEnabled` (`jAe`) — `tengu_kairos_loop_dynamic` flag; toggles self-pacing (cli_inner_pretty.js:221035)
- `isLoopDefaultPromptEnabled` (`o5r`) — `tengu_kairos_loop_prompt` flag; toggles default path (cli_inner_pretty.js:220891)
- `isLoopPersistentPreambleEnabled` (`YTn`) — selects persistent vs non-persistent autonomous preamble (cli_inner_pretty.js:220859)
- `readLoopFile` (`r1i`) — reads `.claude/loop.md` / `loop.md`, truncates >25 KB (cli_inner_pretty.js:220942)
- `getAutonomousLoopPreamble` (`t5r`) — returns persistent `qOi` or non-persistent `JWr` (cli_inner_pretty.js:220863)
- `logAutonomousLoopActivation` (`n5r`) — logs `tengu_kairos_loop_persistent_activated` (cli_inner_pretty.js:220866)
- `buildFixedIntervalLoopPrompt` (`g1f`) — legacy fixed-interval prompt (v2.1.88 descendant) (cli_inner_pretty.js:649139)
- `buildDynamicLoopPrompt` (`y1f`) — dynamic prompt with fixed + self-pace sections (cli_inner_pretty.js:649202)
- `buildDynamicUsageMessage` (`h1f`) — dynamic-mode empty-input usage (cli_inner_pretty.js:649187)
- `buildEmptyInputDefaultPrompt` (inner `a` in `_1f`) — loop.md/autonomous × cron/dynamic default (cli_inner_pretty.js:649278)
- `cloudOfferSection` (`a7l`) — conditional "## Offer cloud first" block (cli_inner_pretty.js:649098)
- `sessionOnlyFooterLine` (`l7l`) — conditional session-only `/schedule` footer (cli_inner_pretty.js:649126)
- `fixedIntervalActionBlock` (`A1f`) — CronCreate + confirm + execute-now block (cli_inner_pretty.js:649134)
- `pushNotifOutcomeSuffix` (`i7l`) — PushNotification outcome suffix when entitled (cli_inner_pretty.js:649085)
- `intervalFromEveryMatch` (`p1f`) — normalizes `EVERY_RE` match to `Ns/Nm/Nh/Nd` (cli_inner_pretty.js:649090)
- `CRON_TABLE` (`m1f`) — interval→cron markdown table (cli_inner_pretty.js:649367)
- `INTERVAL_RE` (`u1f`) `/^\d+[smhd]$/` · `EVERY_RE` (`d1f`) · `DEFAULT_INTERVAL` (`agt`)=`"10m"` (cli_inner_pretty.js:649383, :649384, :649363)
- `LEGACY_USAGE_MESSAGE` (`f1f`) — legacy empty-input usage (cli_inner_pretty.js:649386)
- Sentinels: `LOOP_FILE_SENTINEL` (`n1i`), `LOOP_FILE_DYNAMIC_SENTINEL` (`LPt`) (cli_inner_pretty.js:221013, :221014); `AUTONOMOUS_LOOP_SENTINEL` (`Rtt`), `AUTONOMOUS_LOOP_DYNAMIC_SENTINEL` (`wCe`) (cli_inner_pretty.js:220801, :220802)
- `DEFAULT_MAX_AGE_DAYS` (`ree`) — recurring-task auto-expiry days (cli_inner_pretty.js:221680)
- `isAgentPushNotifEnabled` (`TCe`) — push-notif feature + entitlement gate (cli_inner_pretty.js:220758)
