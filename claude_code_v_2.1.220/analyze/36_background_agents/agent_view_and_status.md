# The `claude agents` view: status state machine, headlines, PR links, peeks and keys

**Module:** `36_background_agents` (part 2 of 2 — see [`README.md`](README.md) for the daemon/worker/store half)
**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js` (872,596 lines)
**Baseline:** `…/2.1.193/extract/cli_inner_pretty.js` — every count below is `220=N / 193=M`

---

## 0. The one-paragraph story

Across `.195`→`.220` the agents view did **not** get a new list of state words. `Working`, `Needs input`,
`Ready for review` and `Completed` all sit in a label map that is **byte-identical to 2.1.193**
(`:808671` vs `:678802 (193)`). What is new is *everything that decides which of those words a row gets*:
a second **layout mode** built out of `simple:*` section ids (`220=1 / 193=0` for every one of them), a
**four-classifier stack** where live process truth outranks the LLM's opinion, a **column allocator** that
gives the status text the leftover width of the terminal, a **worded staleness clock** whose tick rate
changes at the one-minute mark, and a **band-dependent `Ctrl+X`** that means *stop* on a running row and
*delete* on a finished one. The classifier prompt itself is 99 % carryover — its single delta is a
**64-character hard budget on the headline**, and the bundle contains the six rewritten few-shot examples
that prove it.

Three of the anchors the changelog points at are **false anchors**, documented in §12.

---

## 1. Bullet ledger for this document

`NET_NEW` = literal/mechanism absent from 2.1.193. `DELTA` = literal existed, mechanism changed.
`CARRYOVER` = present and equivalent in 2.1.193. `DISCREPANCY` = code contradicts the bullet.

| Ver | # | Bullet (gist) | Verdict | Proof | § |
|-----|---|---------------|---------|-------|---|
| .195 | 11 | Completed list fills vertical space; header compacts on short terminals | NET_NEW | `tengu_fleetview_simple` 1/0 `:804433`; `rfi` `:802912-802916`; `YKS` `:802008` | §4 |
| .196 | 9 | Agents side panel: focus stuck, subagent types lost, wrong status while running | NET_NEW (gate) | `tengu_fleetview_stdin_contention` 1/0 `:804439`; `nfi` busy-first `:802919` | §2, §11 |
| .196 | 19 | Status Done / Needs-your-input flapping; "Needs attention"; clickable PR link | DELTA + FALSE ANCHOR | flap fix = `nfi` ladder `:802918-802935`; **`Needs attention` `:712396` is the plugin manager, not this view** | §2, §12 |
| .196 | 27 | Agents view from a foreground session now needs one `←` press, not two | NET_NEW + DEAD CODE | `tengu_left_arrow_editing_guard` 1/0 `:559928`; `LXr` stubbed `return !1` `:239750` | §9 |
| .199 | 24 | Session rows show PR links as bare `#N` without a "PR" label | CARRYOVER | `` `#${e.prNumber}` `` `:160555` = `:11182 (193)`, 1/1 | §12 |
| .200 | 10 | Control bytes from bg output reaching the terminal in the agent view | NET_NEW (literal) | `sanitizeForTerminal` 1/0 | §11 |
| .203 | 16 | Agents composer discarding your message when a slash command is absent | NET_NEW | `tengu_slash_command_unavailable` 2/0 `:593858`, `:806776` | §10 |
| .203 | 18 | "Needs input" shown after the question was already answered | DELTA | `nfi` `busy → working` first `:802919`; `lxr` optimistic patch `:680848-680859` | §2 |
| .203 | 34 | Empty agents view always shows the organized sections | NET_NEW | `tengu_fleetview_empty_state_shown` 1/0 `:806152`; `Nothing running in the background.` 1/0 `:807591` | §4 |
| .203 | 36 | Removed a redundant navigation hint from the footer | UNANCHORED | footer list `:808091-808102`; no removed literal identifiable | — |
| .203 | 6 | Returning to the view stopped running subagents; work now carries over | NET_NEW | `so the work carries over` 1/0 `:413946` | §9 |
| .205 | 6 | Jobs flipping "needs input" → "working" when the turn had no readable text | NET_NEW | `no-text-turn` branch `:335787-335796` (source tag 2/2, guard is the delta) | §2 |
| .205 | 14 | Agent view rendering one line too high and clipping its header | DELTA | `rfi` compact-header path `:802915-802916` | §4 |
| .205 | 20 | Rows: colored state word + classifier headline; peek with the exact ask | **DELTA, not new** | classifier prompt is carryover; the delta is the 64-char headline budget `:334649`, `:334651` | §3 |
| .206 | 26 | Status column uses full terminal width (was 64 chars) | **DISCREPANCY** | column = leftover width `:802792`; text clamp = `clamp(24,72,0.55×cols)` `:807250`; **no 64 anywhere** | §5 |
| .206 | 27 | `Ctrl+X` permanently removes a completed session; no double rows | NET_NEW | band-scoped actions `:803027` / `:803077`; `Z3e(id,{force:!0})` `:803087` | §8 |
| .207 | 11 | Plan-auto-named bg sessions not showing that name on the row | NET_NEW | `rosterName: p.name \|\| p.intent \|\| q.short` 1/0 `:683848` | §5 |
| .207 | 17 | Re-pasting expands the collapsed `[Pasted text #N]` placeholder | CARRYOVER | 3/3 | — |
| .206 | 16 | Keyboard ignored in the view after a setup prompt (Windows) | NET_NEW (gate) | `tengu_fleetview_stdin_contention` `:804439` | §11 |
| .207 | 18 | Blocked peeks lead with the question + worded staleness clock | DELTA | one new `needs your input` site `:802111` (5/4); `sfi` `:802677`; tick cadence `:808131` | §6 |
| .208 | 43 / .209 1 | `/mcp` `/install-github-app` blocked, then `/model` unblocked with a notice | NET_NEW | `unavailable_in_agent_view` `:806780`; `qWf` notice `:748982-748998`; `tengu_agent_view_leader_command_notice` 1/0 `:753903` | §10 |
| .210 | 19 | Pressing `←` to open the view dropping the task tracker | DELTA | `Nyp`/`Fyp` gesture FSM `:559650-559683` | §9 |
| .210 | 31 | Footer hint shows how many bg agents await your input, with emphasis | DELTA | one new site `:802111`; `EGe` footer `:750106-750153` | see [`bg_notifications_and_reporting.md`](bg_notifications_and_reporting.md) §4 |
| .210 | 32 | The session you pressed `←` from stays visibly marked | CARRYOVER + FALSE ANCHOR | `keepInPlaceIds` 2/2 and **both sites are the plugin manager** `:710562`, `:711140` | §12 |
| .212 | 6 | `/resume` in the view opens a past-session picker | NET_NEW (gate) | `tengu_fleet_past_sessions` 1/0 `:157288`; `tengu_fleetview_earlier_open` 1/0 `:805974` | §4 |
| .212 | 14 | `Ctrl+J` newline in the dispatch input; surfaced in `?` | NET_NEW | `ctrl+j for newline` 1/0 `:808095` | §8 |
| .212 | 46 | Sandbox/MCP/managed-settings waits show "Needs input" | NET_NEW | `needsInput` 6/0 (`:749956`, `:808871`); label `Needs input` 2/**2** carryover | §2, §10 |
| .212 | 37 | Cold-attaching instantly shows the formatted transcript | DELTA | `Session is starting — showing its transcript until it appears` 1/0 | §7 |
| .216 | 37 | `/mcp` and `/install-github-app` park a "needs input" request | NET_NEW | 3 new `needs input` strings `:701705`, `:705885`, `:714220` (6/3) | §10 |
| .218 | 4 | Left arrow discarding the conversation with no undo; confirm + Esc returns | NET_NEW | `Press ← again` 7/0 `:559934`; `arm`/`fire` FSM | §9 |
| .217 | 14 | Transcript preview flush against the input area when attaching | UNANCHORED | pure layout; no literal | — |

---

## 2. The status state machine — four classifiers, deliberately layered

The single most important thing to understand about this view is that **four different functions** answer
four different questions about the same job, and they are *not* interchangeable. All four live within
900 lines of each other and all four are net-new shapes in this build.

| Function | Question | Domain | Consumer |
|---|---|---|---|
| `classifyRowGroupByState` (`nfi`, `:802918`) | which **section** does this row belong in? | `working` / `blocked` / `done` / `review` | grouped layout + `Rwt` label lookup |
| `classifyRowLane` (`$Pn`, `:801986`) | is this row **live**, does it **need me**, or is it **done**? | `live` / `needs` / `done` | simple layout + footer counts |
| `resolveStateWord` (`kMr`, `:803153`) | which **word and colour** to print? | `Done`/`Failed`/`Stopped`/`Working`/`Needs input`/`Idle` | row renderer |
| `classifyNotificationBand` (`jGe`, `:802903`) | should this transition **notify**? | `active` / `blocked` / `completed` | `JKS` notifier, terminal title |

### The ordering inside `classifyRowGroupByState` is the whole flapping fix

```javascript
// ============================================
// classifyRowGroupByState - decides which state section a fleet row belongs to
// Location: cli_inner_pretty.js:802918-802936
// ============================================

// ORIGINAL (for source lookup):
function nfi(e, t, r) {
  if (r === "busy") return "working";
  if (e.activity === "failure") return "done";
  if (e.activity === "stopped") return "done";
  if (r === "waiting") return "blocked";
  if (
    !FEe(e.state) &&
    HMr(e.state.children).some((o) => {
      let i = t?.get(o.href);
      if (i?.state !== "OPEN") return !1;
      let s = rvo(i);
      return s === "error" || (s === "warning" && i.review !== "APPROVED");
    })
  )
    return "review";
  if (e.activity === "success") return "done";
  if (e.state.tempo === "blocked") return "blocked";
  return "working";
}

// READABLE (for understanding):
function classifyRowGroupByState(row, prStatusByUrl, liveProcessState) {
  if (liveProcessState === "busy") return "working";        // 1. a real process is computing NOW
  if (row.activity === "failure") return "done";            // 2. terminal outcomes are sticky
  if (row.activity === "stopped") return "done";
  if (liveProcessState === "waiting") return "blocked";     // 3. a real process is at a prompt
  if (
    !isSelfDriving(row.state) &&                            // 4. an unhealthy linked PR outranks "done"
    prLinks(row.state.children).some((link) => {
      let pr = prStatusByUrl?.get(link.href);
      if (pr?.state !== "OPEN") return false;
      let health = prHealth(pr);
      return health === "error" || (health === "warning" && pr.review !== "APPROVED");
    })
  )
    return "review";
  if (row.activity === "success") return "done";
  if (row.state.tempo === "blocked") return "blocked";      // 5. the LLM classifier's opinion, LAST
  return "working";
}

// Mapping: nfi→classifyRowGroupByState, e→row, t→prStatusByUrl, r→liveProcessState,
//          FEe→isSelfDriving, HMr→prLinks, rvo→prHealth
```

**What it does:** turns a roster record plus a live daemon probe into one of four section ids, which are
then rendered through the carryover label map `Rwt` (`:808671`) as `Working` / `Needs input` /
`Ready for review` / `Completed`.

**How it works:**
1. **`liveProcessState === "busy"` is checked before anything else.** This value comes from the daemon's
   own view of the worker process, not from a language model. If the worker is executing right now, the
   row says `Working` — full stop.
2. Terminal `activity` values (`failure`, `stopped`) short-circuit next, so a stopped job can never be
   dragged back into `blocked` by a stale `tempo`.
3. `waiting` — a live process parked on an interactive prompt — is the only *third-party* source of
   `blocked`.
4. The PR-review band is inserted **between** the live signals and `activity === "success"`. A job whose
   own turn finished successfully but that left an open PR with red checks (or `CHANGES_REQUESTED` and no
   approval) is pulled out of `Completed` into `Ready for review`. `isSelfDriving` exempts jobs that
   manage their own PRs.
5. Only at position **5** — dead last — does the row consult `state.tempo === "blocked"`, which is the
   asynchronous LLM classifier's verdict from `§3`.

**Why this approach:** the classifier (`§3`) is an out-of-band LLM call that costs a round trip and lands
*after* the turn it describes. In 2.1.193 the row's status was assembled from a nested-ternary expression
over `state.tempo` / `state.detail` / `state.needs` (`:675748-675762 (193)`) with no live-process input at
all. That is why `.198 #19` reports **flapping**: reply to a blocked job, the worker resumes instantly,
but `tempo` still says `blocked` until the next classification completes, so the row bounced
`Needs input → Working → Needs input`. Putting the daemon's `busy` probe first makes the transition
monotonic: the moment a real process starts, the label is `Working`, and the classifier can only ever
*confirm* it later.

The alternative — debouncing the label — was clearly available and clearly rejected: debouncing hides
real transitions for a fixed delay, whereas priority ordering hides nothing and is stateless.

**Key insight:** the four states are a *presentation* vocabulary, not a state machine. The actual state
machine is the priority ladder, and its axis is **trustworthiness of the signal source**, from OS-level
process facts down to a model's guess.

### `classifyRowLane` — the same idea with a coarser domain

```javascript
// ============================================
// classifyRowLane - live / needs-you / done, the axis the simple layout and the footer count on
// Location: cli_inner_pretty.js:801986-801992
// ============================================

// ORIGINAL (for source lookup):
function $Pn(e, t) {
  if (t === "busy") return "live";
  if (dm(e) && !(oD(e.state) === "success" && FEe(e))) return "done";
  if (t === "waiting") return "needs";
  if (e.tempo === "blocked" && e.needs && e.needs !== FH) return "needs";
  return "live";
}

// READABLE (for understanding):
function classifyRowLane(jobState, liveProcessState) {
  if (liveProcessState === "busy") return "live";
  if (isTerminal(jobState) && !(outcomeOf(jobState.state) === "success" && isSelfDriving(jobState)))
    return "done";
  if (liveProcessState === "waiting") return "needs";
  if (jobState.tempo === "blocked" && jobState.needs && jobState.needs !== NEEDS_FIRST_PROMPT)
    return "needs";
  return "live";
}

// Mapping: $Pn→classifyRowLane, dm→isTerminal, oD→outcomeOf, FEe→isSelfDriving,
//          FH→NEEDS_FIRST_PROMPT ("send a prompt to start", :331045)
```

Two details carry real weight:

- **`needs !== FH`** — `FH = "send a prompt to start"` (`:331045`) is a sentinel `needs` value written for
  a session that was created but never prompted. A freshly dispatched, empty session is technically
  `tempo: "blocked"` with a `needs`, and without this guard it would inflate the "N agents awaiting
  input" footer count on every new row. The same sentinel is re-tested in the footer predicate
  (`vMS`, `:749877`) and in the notification band map (`:802106`), i.e. **three independent consumers all
  special-case it** rather than the writer normalising it — a small design smell, but it means the
  sentinel survives round-trips through the roster file.
- **`success && isSelfDriving`** is *not* `done`. A self-driving (loop/cron) job that succeeded is still
  `live`, because it will wake itself again. This is the same exemption `nfi` applies to the review band.

### The `no-text-turn` guard (`.205 #6`)

`:335787` in the roster updater:

```javascript
if (!/[\p{L}\p{N}]/u.test(F) && d > q) { … source: "no-text-turn" … }
```

When the newly appended messages contain **no letter or digit at all** (tool-only turn, an image, a bare
diff) the updater *does not call the classifier*. It re-emits the previous state verbatim, with `tempo`
forced to `blocked`/`idle` rather than `active`. Without this, an LLM asked to classify a whitespace tail
falls through to the `_Hs` heuristic (`:334403-334412`) which returns `state: "working"` unconditionally —
which is exactly the reported bug, "flipping needs input → working when the turn had no readable text".

---

## 3. The classifier headline — the delta is a 64-character budget, and the examples prove it

**This is the bullet most likely to be written up wrongly.** `.205 #20` announces "colored state word +
classifier headline". The classifier is *carryover*: `A user kicked off a Claude Code agent…` is
**220=1 / 193=1**, and so are `THE FOUR STATES` (1/1), `CONTRASTIVE PAIRS` (1/1), the telemetry event
`tengu_bg_classify` (2/2), every branch tag (`preclassify`, `blocked-disclaimed`, `result-then-next`,
`wait-external`, `verdict-marker`, `stopping-here` — all 1/1) and the state-description map
(`wOy`, `:334671-334679`).

A line-by-line diff of the two prompt strings (220 `:334480-334658`, 193 `:416618-416796`) returns
**eight changed lines and nothing else**. Two are the output contract:

```
- {"state":"…","detail":"<one line>","tempo":"…",…}                              (193 :416787)
+ {"state":"…","detail":"<one line, ≤64 chars>","tempo":"…",…}                   (220 :334649)

- "detail" is what shows on the user's phone lock screen — write it like a colleague's Slack
  message: …                                                                     (193 :416789)
+ "detail" is what shows on the user's phone lock screen **and as the one-line status column in a
  session list** — … Hard budget: about 64 characters (ten words). It is the HEADLINE, not the
  report — the concrete noun and what happened to it; no parentheticals, no URLs, no second clause
  of explanation. Everything else belongs in output.result, which may run longer. …  (220 :334651)
```

The other six changed lines are **few-shot examples whose `detail` fields were rewritten to obey the new
budget**, and the pattern is exact — every one was over 60 characters and every one is now under 60:

| 193 `detail` | len | 220 `detail` | len |
|---|---|---|---|
| `analysis: dedicated column cheaper than composite index at 30-40k rows` | 70 | `dedicated column beats a composite index at 30-40k rows` | 55 |
| `confirmed ~16K/min notif drop from pod capacity; recommend seek+scale` | 69 | `~16K/min notif drop confirmed; recommend seek+scale` | 51 |
| `both PRs bot-clean; localhost:4000 restarted pointing at local CCR` | 66 | `both PRs bot-clean; localhost:4000 restarted on local CCR` | 57 |
| `analytics enum + conditional added at .withScreenAnalyticsLogging` | 65 | `analytics enum + conditional added at the logging call site` | 59 |
| `venn chart written to plots/venn.png (script: scripts/venn.R)` | 61 | `venn chart written to plots/venn.png + scripts/venn.R` | 53 |
| `recommend option B (reuses existing table, avoids migration)` | 60 | `recommend option B: reuses the table, avoids the migration` | 58 |

The last two also drop the **parenthetical**, matching the new "no parentheticals" instruction; the
shorter examples elsewhere in the prompt (`reading config files to map the setup`, 37 chars) were left
untouched. Note the *reason* the budget exists is stated in the new text: `detail` acquired a **second
consumer** — "the one-line status column in a session list" — and a phone lock screen tolerates a longer
line than a terminal column does.

**Why 64 and not the actual column width?** Because the prompt is written once and the column width is
not known until render time (§5). 64 is the widest value that fits comfortably in the smallest column
`n7S` will allocate on a plausible terminal, and it doubles as the "ten words" rule of thumb given in the
same sentence. It is also **advisory only**: the hard cap in code is `Tg(x, hA)` with `hA = 800`
(`:334461`), applied on every branch. A 300-character `detail` is truncated by the *renderer*, not
rejected by the parser — a deliberate fail-soft, because the alternative (re-prompting on over-length)
would double the classifier's cost for a cosmetic problem.

### How the classifier is actually invoked

`runClassifier` (`kHs`, `:335956-336042`) is a three-tier ladder, and only tier 3 costs money:

1. **`preclassify`** — `lcd(tail)` (`:334282-334401`) is a 17-branch deterministic parser over the last
   800 characters. It looks for explicit markers (`result:`, `failed:`, `blocked:`, `I'm blocked:`),
   a trailing `?`, auth-error prose, "I'll check back", "Giving up", `Pushed to`/`Committed as`,
   `VERDICT: PASS|FAIL`, `Please <verb>`, `Stopping here`. Each returns a `{branch, state, tempo, detail}`
   tuple. If any matches, **no LLM call happens at all**.
2. **`heuristic`** — when `engine === "heuristic"` (LLM classification disabled), `_Hs` takes the last
   non-empty line and calls it `working`.
3. **`llm`** — at most **two** attempts (`for (let T = 0; T < 2 && !b; T++)`, `:335975`), the second one
   appending `Previous response was not valid JSON. Respond with ONLY the JSON object, nothing else.`
   Tail is capped at `icd = 2000` characters (`:334462`). On both failing, it silently falls back to the
   heuristic (`:336017`). Prompt caching is on (`cache_control: y`, `:335985`) with a `1h` TTL when the
   `agent_classifier` gate says so (`:335970`).

Every path emits `tengu_bg_classify` with `path`, `branch`, `closingShape`, `prevState`, `newState`,
`stateChanged`, `minsInPrevState`, `durationMs`, `tailChars` and — LLM path only — token counts
(`:336020-336038`). `closingShape` (`acd`, `:334269-334281`) buckets the tail independently as
`empty`/`code-fence`/`result-line`/`failed-line`/`trailing-q`/`list-or-table`/`declarative`, so the
telemetry can measure preclassifier coverage per tail shape without trusting the classifier's own output.

**Mid-turn upgrade — the one genuinely new knob.** `midTurnLlmDebounceMs` is **220=2 / 193=0**
(`:335739`). During a *running* turn the row would otherwise show a heuristic detail. The updater now
optionally re-runs the LLM classifier mid-turn on an **exponential backoff**: first interval
`max(debounce, Hcd)`, then doubling up to `max(u1y, interval)` (`:335741-335746`), default debounce
60,000 ms. An epoch counter (`e.midturnLlmEpoch`, `:335747`, checked again at `:335772`) discards a
late-arriving result if the turn moved on. A mid-turn classification can only ever change `detail`,
never `state` — `:335810-335811` forces `state` back to the previous value and `tempo` to `active`
whenever the mid-turn flag is set. That asymmetry is the point: mid-turn text is unreliable evidence of
*state* but perfectly good evidence of *what is happening*.

---

## 4. Sections layout, the done fold, and the compacting header

There are **two** layouts in 2.1.220, chosen by `On`:

```javascript
yI = On === "state",      // :805544  — state sections (Rwt labels)
qF = On === "group",      // :805545  — user groups (ctrl+e)
```

plus a **third**, gate-only "simple" mode:

```javascript
A = Z.CLAUDE_CODE_FLEETVIEW_SIMPLE || Ke("tengu_fleetview_simple", !1),   // :804433
b = !A || !!t?.startsWith("remote-");                                     // :804434
```

`tengu_fleetview_simple` is **220=1 / 193=0** and defaults to `false`; `CLAUDE_CODE_FLEETVIEW_SIMPLE` is
its env escape hatch. When simple mode is on and the origin is not a remote id, the legacy row list is
initialised empty (`:804449-804453`) and the view is built by `buildSimpleRows` instead.

### `buildSimpleRows` — a fixed five-band layout with a height-aware fold

`kum` (`:802011-802067`) is net-new: every band id it emits is `220=1 / 193=0`
(`simple:new-session`, `simple:pinned`, `simple:needs`, `simple:live`, `simple:done`, `simple:finished`).

**How it works:**
1. One pass over all jobs calls `classifyRowLane` and tallies `needsCount` (`u`), `liveCount` (`d`) and
   `workingCount` (`p` — the subset of live rows whose process is `busy` or `shell`). `needsCount` and
   `workingCount` are **220=3 / 193=0**; `liveCount` is 6/3.
2. Pinned rows are pulled out first regardless of lane (`:802026-802029`), then the remaining rows are
   split into `needs` / `live` / `done`.
3. `done` is sorted by `mostRecentTerminalTimestamp` (`kcl`, `:801993-801999` — tries
   `firstTerminalAt`, then `updatedAt`, then `createdAt`, taking the first parseable one).
4. Row order is fixed: `new session`, pinned, **needs**, live, done. There is no user control over it.
5. The **height budget**:
   ```javascript
   y = 1 + (l.length * WKS + (s.length + a.length) * GKS)
         + (u + d === 0 ? VKS : 0) + (c.length > 0 ? 1 + zKS : 0);   // :802048
   _ = YKS(i, y);                                                     // :802049  doneCap
   ```
   with `WKS = 2` (rows per live entry), `GKS = 3` (rows per pinned/needs entry — they are taller because
   they carry the question), `VKS = 4` (the empty-state block), `zKS = 1` — all five declared together at
   `:802082-802088` — and `YKS(rows, used) = max(0, rows - jKS(3) - Dpi(4) - used)` (`:802008`). So the fold
   reserves **7 rows of chrome** and gives the rest to finished sessions.
6. Two independent reasons to fold a finished row: it is **older than `UKS = 172,800,000 ms` (48 hours)**
   (`UKS` declared `:802082`; used as `E = pr(c, (I) => r - kcl(I.state) > UKS)` at `:802050`), or it simply
   does not fit (`A`, `:802051`). The fold only appears if the hidden count reaches `qKS = 2` (`:802086`;
   `T = b >= qKS ? b : 0`, `:802053`) — hiding a single row behind a "… show all (1 more)" line would cost a
   row to save a row.
7. The fold row counts how many hidden entries **failed** (`C`, `:802054`) so the label can warn:
   `… show all (${hidden} more · ${failed} failed)` (`:807549`, `220=1 / 193=0`).

**Why 48 hours?** It is the "since I last looked" horizon: anything from the last two days is plausibly
still interesting, anything older is archaeology. Note it is applied *before* the height check, so on a
tall terminal old rows still fold — the age rule is a statement about relevance, not about space.

### The compacting header (`.195 #11`, `.205 #14`)

```javascript
// ============================================
// resolveDoneCapAndHeader - trades header height for finished-list rows on short terminals
// Location: cli_inner_pretty.js:802912-802917
// ============================================

// ORIGINAL (for source lookup):
function rfi(e, t) {
  let r = (o) => e - s7S - o - t,
    n = r(Dpi);
  if (n >= Vdm) return { doneCap: n, compactHeader: !1 };
  return { doneCap: Math.max(0, r(a7S)), compactHeader: !0 };
}

// READABLE (for understanding):
function resolveDoneCapAndHeader(terminalRows, rowsUsedByOtherSections) {
  let capacityWith = (headerRows) => terminalRows - CHROME_ROWS - headerRows - rowsUsedByOtherSections;
  let withFullHeader = capacityWith(FULL_HEADER_ROWS);
  if (withFullHeader >= MIN_DONE_ROWS) return { doneCap: withFullHeader, compactHeader: false };
  return { doneCap: Math.max(0, capacityWith(COMPACT_HEADER_ROWS)), compactHeader: true };
}

// Mapping: rfi→resolveDoneCapAndHeader, e→terminalRows, t→rowsUsedByOtherSections,
//          s7S→CHROME_ROWS (8, :808499), Dpi→FULL_HEADER_ROWS (4, :808500),
//          a7S→COMPACT_HEADER_ROWS (2, :808501), Vdm→MIN_DONE_ROWS (3, :808496)
```

**Why the threshold is 3 and not 1:** a finished list showing one row is worse than no list — the user
cannot tell whether it is the only finished session or the first of thirty. Three rows is the smallest
number from which "there are more, folded" reads naturally. And the fallback is `max(0, …)`, so on a
genuinely tiny terminal the finished list disappears entirely rather than going negative — the header,
which contains the navigation affordances, wins.

### Empty state (`.203 #34`)

When `buildSimpleRows` produces no `job` rows at all (`:807584-807596`), the view prints
`Nothing running in the background.` (**220=1 / 193=0**) plus
`Hand off a task and it keeps working while you do something else — even if you close this terminal.`
(1/0), and fires `tengu_fleetview_empty_state_shown` with `{skeleton, has_origin}` (`:806152`, 1/0).
The four **section descriptions** shown in the first-run overlay (`o7S`, `:808672-808677`) are, by
contrast, **carryover** — `Sessions that have a question or need your decision land here` is 1/1. So the
bullet's "always shows the organized sections" is about *when* the section chrome renders, not about new
copy.

`/resume`'s past-session picker (`.212 #6`) is gated by `tengu_fleet_past_sessions`
(`:157288`, 1/0, also readable via `CLAUDE_CODE_FLEET_PAST_SESSIONS`), and the two telemetry points
around it — `tengu_fleetview_earlier_loaded` (`:804655`, counts how many past sessions were found) and
`tengu_fleetview_earlier_open` (`:805974`, `{ms_since_mount, via}`) — are both 1/0.

---

## 5. Column allocation and the status width — where the changelog is wrong

`.206 #26` says: *"Agents view status column uses full terminal width (was 64 chars)."*

**There is no 64 in either bundle's fleet-view code.** `grep '\b64\b'` over `:800000-810000` in 2.1.220
returns one hit and it is a memo-cache index; over `:674000-679500` in 2.1.193 it returns one hit and it
is `lKe.c(64)`, a compiler-generated cache size. The only new `64` in this whole story is the classifier
prompt's headline budget from §3 (`:334649`). Two possibilities remain — the old cap lived in a build
before `.193`, or the bullet is describing the *prompt* budget as if it were a column width. Either way
the claim cannot be verified against `.193`, and the *current* behaviour is not "full terminal width".

What 2.1.220 actually does is **two** independent budgets:

```javascript
// ============================================
// allocateFleetColumns - splits the terminal row between age / label / artifact / detail
// Location: cli_inner_pretty.js:802788-802794
// ============================================

// ORIGINAL (for source lookup):
function n7S(e, t, r, n) {
  let o = Math.max(QYS, ...e.map((l) => Ft(sfi(l, t(l))))),
    i = Math.min(Math.max(40, Math.floor(n / 3)), Math.max(12, ...e.map((l) => Ft(r8t(l.state, l.id === r))))),
    s = Math.max(0, ...e.map((l) => r7S(l.state))),
    a = Math.max(8, n - (i + 2) - 2 - (s + 2) - (o + 2) - 2);
  return { age: o, label: i, artifact: s, detail: a };
}

// READABLE (for understanding):
function allocateFleetColumns(rows, ageTextFor, originRowId, terminalCols) {
  let age = Math.max(MIN_AGE_COL, ...rows.map((r) => width(sessionAgeText(r, ageTextFor(r)))));
  let label = Math.min(
    Math.max(40, Math.floor(terminalCols / 3)),            // never more than a third of the line
    Math.max(12, ...rows.map((r) => width(rowLabel(r.state, r.id === originRowId)))),
  );
  let artifact = Math.max(0, ...rows.map((r) => prBadgeWidth(r.state)));
  let detail = Math.max(8, terminalCols - (label + 2) - 2 - (artifact + 2) - (age + 2) - 2);
  return { age, label, artifact, detail };
}

// Mapping: n7S→allocateFleetColumns, Ft→width, sfi→sessionAgeText, r8t→rowLabel,
//          r7S→prBadgeWidth, QYS→MIN_AGE_COL (3, :808484)
```

1. **Age** takes exactly what it needs, floor 3 characters.
2. **Label** (the session name) is content-sized but hard-capped at `max(40, cols/3)` — the name may
   never eat more than a third of the line on a wide terminal, and never less than 40 columns on a narrow
   one. Floor 12.
3. **Artifact** (the PR badge, §7) takes what it needs, or 0.
4. **Detail (the status column) gets everything left over**, floor 8, after 5 inter-column gaps
   (`+2` four times plus a trailing `-2`).

That last line *is* the "uses full terminal width" claim — the status column is the **flex** column, so on
a 200-column terminal it really is ~140 characters wide. But the *text* placed in it is separately
truncated:

```javascript
let qr = kL() ? 1 / 0 : Math.max(24, Math.min(72, Math.floor(J * 0.55))),   // :807250
  An = (Tl) => (qr === 1 / 0 ? Tl : gi(Tl, qr));
```

`kL()` is `isScreenReaderModeEnabled` (`:156221-156223`, delegating to the `--ax-screen-reader` /
`CLAUDE_AX_SCREEN_READER` / `axScreenReader` resolver at `:156201-156213`). **In screen-reader mode the
budget is `Infinity` — the status text is never truncated**, because a screen reader has no column to
overflow. Otherwise the text is clamped to `clamp(24, 72, 0.55 × cols)`.

So the honest statement of the delta is: **the status column became the flex column and its text budget
became terminal-relative with a 72-character ceiling and a screen-reader bypass.** "Full terminal width"
is true of the column and false of the text.

### What actually goes in the status column

```javascript
// ============================================
// resolveStatusText - chooses what the status column says for one row
// Location: cli_inner_pretty.js:807249-807260
// ============================================

// ORIGINAL (for source lookup):
v5e = (qe, Er, Br) => {
  let qr = kL() ? 1 / 0 : Math.max(24, Math.min(72, Math.floor(J * 0.55))),
    An = (Tl) => (qr === 1 / 0 ? Tl : gi(Tl, qr));
  if ($Pn(qe.state, Br) === "done") return;
  let di = qe.state.needs && qe.state.needs !== FH ? qe.state.needs : void 0;
  if (di) return An(lO(di));
  if (!qe.state.pinned && Er.word !== Rwt.working) return;
  let es = Hum(qe.state);
  if (es) return es;
  let Es = qe.state.detail;
  return Es && !tdl(Es) ? An(lO(Es)) : void 0;
},

// READABLE (for understanding):
resolveStatusText = (row, stateWord, liveProcessState) => {
  let budget = isScreenReaderModeEnabled() ? Infinity
             : Math.max(24, Math.min(72, Math.floor(terminalCols * 0.55)));
  let fit = (s) => (budget === Infinity ? s : truncate(s, budget));
  if (classifyRowLane(row.state, liveProcessState) === "done") return undefined;   // 1. finished: silent
  let ask = row.state.needs && row.state.needs !== NEEDS_FIRST_PROMPT ? row.state.needs : undefined;
  if (ask) return fit(sanitizeForTerminal(ask));                                   // 2. the exact ask wins
  if (!row.state.pinned && stateWord !== LABELS.working) return;                   // 3. idle rows stay quiet
  let fanProgress = summarizeFan(row.state);
  if (fanProgress) return fanProgress;                                             // 4. "3/5 agents"
  let detail = row.state.detail;
  return detail && !isPlaceholderDetail(detail) ? fit(sanitizeForTerminal(detail)) : undefined;  // 5.
};

// Mapping: v5e→resolveStatusText, qe→row, Er→stateWord, Br→liveProcessState, J→terminalCols,
//          gi→truncate, lO→sanitizeForTerminal, Hum→summarizeFan, tdl→isPlaceholderDetail
```

**Ordering rationale:** `needs` (the literal question the agent asked) outranks `detail` (the model's
self-summary), because a blocked row's job is to tell you what to type, not what happened. Fan progress
(`summarizeFan`, `:802069-802075`) outranks `detail` only for *working* rows, and prefers todo counts
(`3/7`) over agent counts (`2/5 agents`) — a todo ratio is a finer-grained progress signal than a
subagent count. Note fan progress is **not** truncated: `3/7` cannot overflow.

`sanitizeForTerminal` is **220=1 / 193=0** — this is `.202 #10`, "control bytes from bg output reaching
the terminal in the agent view". Both `needs` and `detail` are attacker-influenced text (they are
produced by a model reading tool output), so both are laundered before printing.

`rosterName` (`.207 #11`) is **220=1 / 193=0** at `:683848`:
`rosterName: p.name || p.intent || q.short` — a three-level fallback for the row label, so a session that
a plan step auto-named surfaces that name instead of falling back to its 8-character id.

---

## 6. The worded staleness clock

`sessionAgeText` (`sfi`, `:802677-802681`) has two modes:

```javascript
function sfi(e, t) {
  let r = Date.now();
  if (t != null && t > r) return `in ${ra(t - r, { mostSignificantOnly: !0 })}`;   // scheduled next wake
  return t7S(e);                                                                   // elapsed age
}
```

- If the job has a **future** `nextAt` (a self-waking loop/cron), the column shows `in 5m` — a countdown.
  The caller passes it as `E5e = (qe) => sfi(qe, Z2.has(qe.id) ? j.get(qe.state.sessionId)?.nextAt : void 0)`
  (`:807247`), i.e. only for rows known to be self-driving.
- Otherwise `elapsedSince` (`t7S`, `:802672-802676`) measures from `createdAt` to **either** the terminal
  timestamp (`firstTerminalAt ?? updatedAt`) if the job is done, **or** `Date.now()` if it is not. So a
  finished row's age freezes at its duration and stops ticking, while a running row keeps counting.

Both go through `ra(ms, { mostSignificantOnly: true })` — the worded formatter, `mostSignificantOnly`
is 15/12 — which is why the column reads `3m` and not `3m 12s`.

**The tick cadence is the interesting part** (`:808131`):

```javascript
Rc(GYS, !KTe ? null : jYS - UYS < 60000 ? 1000 : 30000)
```

The clock re-renders every **1 second while the value is under one minute**, then every **30 seconds**.
With `mostSignificantOnly`, a value over a minute only changes once a minute, so a 1 Hz timer would do 59
useless repaints per minute across every visible row. Below a minute the display is in seconds and 1 Hz
is exactly right. This is the cheapest possible correct answer, and it is per-row: `dpm` takes a single
`job` prop, so a list of 40 rows where 39 are hours old runs one fast timer and 39 slow ones.

### The blocked peek (`.208 #18`)

`needs your input` is **220=5 / 193=4**, and the one new site is `:802111`:

```javascript
message: i.needs ? `${i.label} needs your input: ${Tg(i.needs, XKS)}` : `${i.label} needs your input`,
```

`XKS = 120` (`:802144`) — the ask is truncated to 120 characters here, roughly double the 64-character
status-column headline budget, because this string is a *notification body*, not a column. The four
carryover sites are unrelated subsystems (`Claude needs your input` for elicitation dialogs `:740186`,
`:740589`; `ultraplan needs your input` `:519037`; the `AskUserQuestion` display name `:414482`) — so the
"blocked peeks lead with the question" behaviour anchors to exactly one new line, not to a rewritten
subsystem. The peek's own body reuses `resolveStatusText`'s rule 2 (§5): `needs` first, everything else
after.

---

## 7. PR link detection and the review band

`.205 #19` ("Agent view links PRs it edits, merges, comments on, or pushes to") and `.198 #19`
("clickable PR link") both land on the same machinery, and none of the strings are new — but the
*plumbing* is worth documenting because it is what makes the `review` band of §2 possible.

**Where links come from.** The roster updater tails the session's own transcript file for link markers:
`:336075-336078` scans each appended line for `"pr-link"`, `"worktree-state"` or `"frame-link"` and keeps
a byte offset (`linkScanOffset`, `linkScanPath`) so re-reads are incremental and bounded
(`i - o > HHs` clamps the window, `:336065`). That is how a PR the agent merely *commented on* gets
attached to the row without the agent being asked to report it.

**Where PR health comes from.** Two backends, chosen by a gate:

```javascript
async function Ktd() {                                   // :316054-316059
  if (!(await UA())) return null;
  let [t, r] = await Promise.all([AT(), bU()]);
  if (t === r) return null;                              // on the default branch: no PR to show
  return (() => (Mtn() ? AIy(t) : _Iy(r)))();            // Mtn() = Ke("tengu_harbor_prism", !1)
}
```

- `_Iy` (`:316063-316078`) shells out to `gh pr view --json number,url,reviewDecision,isDraft,headRefName,state`
  and discards `MERGED`/`CLOSED` and default-branch results.
- `AIy` (`:316083-316164`) is the direct-REST path: it resolves the upstream repo
  (`git config --get remote.upstream.url` first, `:316211-316217`, falling back to the GitHub `parent`
  field, `:316218-316239`), then `GET /repos/{o}/{r}/pulls?head=owner:branch&state=open&per_page=1` with
  **ETag caching** (`If-None-Match`, `:316114`; a `304` is a no-op, `:316122`) and **manual redirect
  handling pinned to the same origin** (`:316119-316121` — a cross-origin redirect is dropped, which is
  the whole point of `redirect: "manual"`). The `reviewDecision` needs a second GraphQL call
  (`:316165-316188`) that is rate-limited to once per `bIy` (`:316155`).

**Auth-state reporting.** `Btd` (`:316079-316082`) is an edge-triggered emitter: it fires
`tengu_gh_pr_status_auth_state` **only when the state changes**, with `auth_state ∈
{gh_missing, needs_auth, token_present}`. The user-facing consequence is `mur` (`:316035-316042`):

```javascript
case "needs-auth": return "gh auth login for PR status";
case "gh-missing": return "install gh for PR status";
```

Both strings are the actionable hint the `.198 #19` bullet refers to; they tell you *why* the PR column is
empty rather than silently omitting it.

**The badge.** `Zdm` (`:803190-803213`) renders check counts as `✗ 2/7` (red), `5/7` (amber), `✓`
(green), plus a review word (`approved` / `✗` / `needs review`), and falls back to the lowercased PR state
for anything else. `prBadgeWidth` (`r7S`, `:802777-802787`) pre-measures it for the column allocator:
`N PRs` for multiple links, `#123` for one with a parsable number, else the generic PR word.

**The bare `#N` format is CARRYOVER.** `.199 #24` says rows "show PR links as bare `#N` without the 'PR'
label". `:160555`:

```javascript
if (e.prNumber) r.push(e.prRepository ? `${e.prRepository}#${e.prNumber}` : `#${e.prNumber}`);
```

is byte-identical to `:11182 (193)`, and the literal `` `#${ `` count is 1/1 for this site. Whatever
changed in `.199`, it was not this format string.

### Attach / cold-attach transcript rendering (`.214 #37`, `.208 #39`)

`Session is starting — showing its transcript until it appears` is **220=1 / 193=0**. `coldAttach` as a
literal is **0/0** in both builds, so there is no symbol to hang the "cold attach" name on — the
mechanism is the string plus the transcript-preview path, and `tengu_bg_attach_wake_after_reap` (1/0) is
the gate the scoping pass found adjacent to it. I did **not** trace the preview renderer end to end;
see "Not covered".

The `?` overlay's job panel (`dpm`, `:808120-808265`) is where an attach is diagnosed:
`backend <daemon|peer|…>`, `dir <jobdir>`, `cwd <worktreePath ?? cwd>`, `shell claude attach <id>`
(daemon backend only, `:808183`), `session <uuid>`, `version …`, `updated <age> ago`. The version row
compares the job's recorded `cliVersion` against the running build's `VERSION` constant and renders a
**warning-coloured mismatch** with `· current 2.1.220` appended (`:808216-808235`) — the user-visible
surface of the version-skew handling that part 1 documents.

---

## 8. `Ctrl+X` is band-dependent, and that is the `.206 #27` fix

The row action table (`p7S`, `:803022-803123`) contains **two entries with `key: "x"`**:

| entry | line | `bands` | label | effect |
|---|---|---|---|---|
| stop | `:803025-803027` | `["active", "blocked"]` | `stop` | kill the worker, write `state:"stopped"`, `firstTerminalAt` |
| delete | `:803075-803077` | `["completed"]` | `delete` | `Z3e(id, {force: !0})` — evict from the roster |

The footer renders `` `ctrl+x to ${Eul}` `` (`:808099`) where `Eul` is whichever label the focused row's
band selects, so the same key is honestly advertised as two different verbs.

**Why band-scoping instead of two keys?** Because the two actions are the same *intent* — "get this row
out of my way" — and the safe one is automatically selected while the job can still be harmed. You cannot
delete a running session with `Ctrl+X`; you first stop it (turning it into a `completed` row), then press
`Ctrl+X` again. That is the `.215 #14` bullet's "Ctrl+X twice in the agent list" behaviour falling out of
the design rather than being special-cased.

**The double-row fix.** Both handlers remove the row *optimistically* before awaiting the daemon
(`:803079` `n(o.id, null)` then `:803080` `r((d) => d.filter((p) => p.id !== o.id), o.id)`), and both restore it by
throwing `FleetActionUnconfirmedError` (`:808679-808683`, 1/1 carryover) when the daemon does not
confirm. Without the optimistic removal the row persists until the next roster poll, and a second press
issues a second delete — which is how you get two rows for one job.

**Worktree outcomes are surfaced, not swallowed.** `deleteJob` returns
`{removed, keptWorktree, keptReason, keptErrorSummary, leftWorktreeDir}`. `keptReason` is 3/3 carryover
but `leftWorktreeDir` and `announceKeptOn` are **220=3 / 193=0** — the `.208 #41` delta. The two
non-fatal outcomes get distinct sentences:

```
:803118  `Worktree kept at ${a} — ${p}; the session was not deleted`
:803120  `Worktree directory left at ${u} — git no longer recognized it; the session was deleted`
```

The first means *delete refused*; the second means *delete succeeded but a directory survived*. Telemetry
distinguishes them too: `$e("fleet_view_delete_job", "worktree_left_in_place")` (`:803105`) versus
`` $e("fleet_view_delete_job", `worktree_kept_${d}`) `` (`:803116`).

Other keys, all read from the footer builder (`:808091-808102`):
`shift+↑↓` reorder, `ctrl+r` rename, `ctrl+e` set group, `ctrl+s` switch views, **`ctrl+j` newline**
(`ctrl+j for newline`, **220=1 / 193=0** — `.212 #14`), `@` mention, `ctrl+t` pin/unpin,
`alt+1`–`alt+N` open, `ctrl+x` stop/delete, `←` go back, `esc` close (`esc again quits` outside the
composer), `?` close.

---

## 9. The `←` gesture: an FSM plus a permanently disabled branch

`tengu_left_arrow_gesture` is **220=0 / 193=2** — a gate that was *removed*. Its replacement
`tengu_left_arrow_editing_guard` is **220=1 / 193=0**, read at `:559928` with default `true`.

```javascript
// ============================================
// classifyLeftArrowGesture - decides whether ← fires, arms a confirmation, or is swallowed
// Location: cli_inner_pretty.js:559650-559663
// ============================================

// ORIGINAL (for source lookup):
function Nyp(e, t, r, n, o = LXr(t), i = Vke()) {
  if (r !== !0) return "reject";
  let s = (l) => l !== 0 && l >= i;
  if (o) {
    if (s(e.lastLeftPressMs) && t - e.lastLeftPressMs < Oyp) return "attach-absorb";
    if (s(e.attachConfirmArmedAtMs) && t - e.attachConfirmArmedAtMs <= 3000)
      return t - e.attachConfirmArmedAtMs >= GV_ ? "fire" : "attach-absorb";
    return "attach-arm";
  }
  if (!n) return "fire";
  if (s(e.lastLeftPressMs) && t - e.lastLeftPressMs < Oyp) return "absorb";
  if (s(e.armedAtMs) && t - e.armedAtMs <= 3000) return "fire";
  return s(e.editedEmptyAtMs) && t - e.editedEmptyAtMs < 2000 ? "arm" : "fire";
}

// READABLE (for understanding):
function classifyLeftArrowGesture(g, now, isSoloKeypress, guardEnabled,
                                  inAttachQuietWindow = isInAttachQuietWindow(now),
                                  quietStampMs = attachQuietStamp()) {
  if (isSoloKeypress !== true) return "reject";              // part of a paste / escape sequence
  let freshEnough = (t) => t !== 0 && t >= quietStampMs;      // ignore stamps from before the last attach
  if (inAttachQuietWindow) { /* … see below: dead in 2.1.220 … */ }
  if (!guardEnabled) return "fire";                          // gate off -> single press always fires
  if (freshEnough(g.lastLeftPressMs) && now - g.lastLeftPressMs < REPEAT_MS) return "absorb";
  if (freshEnough(g.armedAtMs) && now - g.armedAtMs <= 3000) return "fire";
  return freshEnough(g.editedEmptyAtMs) && now - g.editedEmptyAtMs < 2000 ? "arm" : "fire";
}

// Mapping: Nyp→classifyLeftArrowGesture, e→g, t→now, r→isSoloKeypress, n→guardEnabled,
//          LXr→isInAttachQuietWindow, Vke→attachQuietStamp, Oyp→REPEAT_MS (1000, :559685),
//          GV_→ATTACH_CONFIRM_MIN_MS (150, :559686)
```

**What it does:** turns one `←` keypress plus four timestamps into one of six outcomes, applied by
`Fyp` (`:559664-559683`) which is the only writer of the timestamps.

**How it works (non-attach path):**
1. `isSoloKeypress !== true` → `reject`. A `←` that arrived inside a paste or a multi-byte escape
   sequence never counts. This is the anti-`^[[D` guard.
2. Gate off → `fire` immediately. The gate is a kill switch that restores pre-`.198` behaviour.
3. **`absorb`** — a second `←` within `REPEAT_MS = 1000` of the last one is swallowed. This is key-repeat
   suppression: holding the arrow down must not fire twice.
4. **`fire`** — a press within 3,000 ms of `armedAtMs` confirms an armed prompt.
5. **`arm`** — otherwise, if the composer was emptied by editing within the last **2,000 ms**, arm and
   show `Press ← again` (`220=7 / 193=0`) for `UXs = 3000` ms, and log
   `tengu_left_arrow_blocked` with `reason: "editing-quiet"` (`:559935`).
6. Anything else → `fire`.

**Why 2,000 ms for "just edited"?** The bug being fixed (`.216 #4`, "Left arrow discarding the
conversation with no undo") is the user backspacing their draft to empty and then reaching for `←` to
move the cursor — muscle memory from a text field. Two seconds is long enough to cover the
backspace-then-arrow motion and short enough that a deliberate `←` after reading the screen fires on the
first press. `.198 #27` is the other half of the same trade: *only* the recently-edited case costs two
presses, so the common path (open the agents view from an untouched prompt) is one press again.

**The attach branch is dead code in 2.1.220.** `LXr` — `isInAttachQuietWindow` — is:

```javascript
function LXr(e) { return !1; }        // :239750-239752
```

an unconditional `false`. So `attach-arm`, `attach-absorb`, the
`Ambiguous ←, press again to detach` banner (`:559945`, `220=1 / 193=0`), and both
`tengu_left_arrow_blocked` reasons `attach-quiet-hint` / `attach-quiet` (`:559949`, `:559955`) are
unreachable, and the drain loop `Qfo` (`:239753-239759`) returns on its first iteration. The
`attachQuietStamp` plumbing (`Rps`/`Jfo`/`Vke`, `:239736-239748`) still runs and still feeds
`freshEnough`, so the *stamp* matters even though the *window* never opens.

That is almost certainly how `.208 #19` ("Pressing `←` inside `claude attach <id>` exiting to the shell
instead of opening the agent view") was fixed: rather than tuning the ambiguity heuristic, the predicate
was stubbed to `false`, which routes attach sessions down the ordinary `fire`/`arm` path. Report it as
**disabled, not removed** — the code is one line away from coming back.

**Subagent carryover (`.203 #6`).** When `←` fires while subagents are running, the session does not
detach immediately; `:413946` (**220=1 / 193=0**):

> `Still backgrounding after the current tool — waiting for ${n} running ${plural} so the work carries over. Press ← again to skip ahead and restart ${n === 1 ? "it" : "them"} from the beginning.`

The second press is an explicit opt-in to losing the in-flight subagent work. The message states the
cost ("restart them from the beginning") rather than just warning.

---

## 10. Composer guards: what a slash command means inside the agent view

Three separate mechanisms, and the changelog treats them as one story across `.203 #16`, `.208 #43`,
`.209 #1`, `.212 #32` and `.216 #37`.

**(a) Command not available at all** — `tengu_slash_command_unavailable` is **220=2 / 193=0**. The
agent-view site is `:806776-806780` and carries `reason: Ee("unavailable_in_agent_view")`; the other is
`:593858`. `.203 #16`'s bug was that the composer *discarded* the typed text on this path; the fix is that
the guard now runs before the buffer is cleared.

**(b) Command available but scoped to the wrong session** — this is the `.209 #1` revert. `/model` was
blocked in `.208` and unblocked in `.209`, but unblocking alone would be misleading, so a notice was
added:

```javascript
// ============================================
// getLeaderScopedCommandNotice - explains that /model and /fast target the parent, not this agent
// Location: cli_inner_pretty.js:748982-748998
// ============================================

// ORIGINAL (for source lookup):
function qWf(e, { isTeammate: t }) {
  let r = t ? "the team lead" : "the main conversation",
    n = t ? "teammate" : "agent",
    o = e.name,
    i;
  switch (o) {
    case "model":
      i = "model";
      break;
    case "fast":
      i = "fast mode";
      break;
    default:
      return;
  }
  return `/${o} changes ${r}'s ${i}, not this ${n}'s`;
}

// READABLE (for understanding):
function getLeaderScopedCommandNotice(command, { isTeammate }) {
  let ownerPhrase = isTeammate ? "the team lead" : "the main conversation",
    subjectPhrase = isTeammate ? "teammate" : "agent";
  let thing;
  switch (command.name) {
    case "model": thing = "model"; break;
    case "fast":  thing = "fast mode"; break;
    default: return;                                  // every other command: no notice
  }
  return `/${command.name} changes ${ownerPhrase}'s ${thing}, not this ${subjectPhrase}'s`;
}

// Mapping: qWf→getLeaderScopedCommandNotice, e→command, t→isTeammate
```

The call site (`:753893-753912`) reaches it only when `lfn(state).type !== "leader"` — i.e. the composer
is aimed at a viewed teammate/agent — and only after checking that the command is not `local`/`local-jsx`
(`:753896`), because those run in-process and are genuinely harmless. It then fires
`tengu_agent_view_leader_command_notice` (**220=1 / 193=0**) and shows the notice as an
`priority: "immediate"` feedback banner for **8,000 ms** (`:753909`) *instead of* submitting. Note the
`switch`'s `default: return` — exactly two commands are covered, and adding a third requires a code
change. That is a deliberate whitelist: a generic "this may not apply here" warning on every command
would be noise.

**(c) Command parks a "needs input" request** — the `.216 #37` mechanism. `needs input` is
**220=6 / 193=3**, and the three new sites are all this pattern:

```
:701705  Can't run /install-github-app while no terminal is attached to this background session.
         This session now shows "needs input" in agent view — open it and run the command again.
:714220  Can't open MCP settings while no terminal is attached to this background session.
         This session now shows "needs input" in agent view — open it and run /mcp to manage
         servers, or use `/mcp enable|disable|reconnect <server>` to steer without the panel.
:705885  … It now shows "needs input" in agent view.
```

The other three `needs input` occurrences are pure carryover in unrelated prompts (the classifier's state
description `:334675`, its regex `:334683`, and a system-prompt instruction `:269685`). So the delta here
is precisely: **a command that needs a TTY no longer fails silently in a headless background session; it
flips the row to `Needs input` and tells you which command to re-run.** `:714220` even offers the
non-interactive alternative, which is the difference between a dead end and a workaround.

`needsInput` (the *field*) is **220=6 / 193=0** — see [`bg_notifications_and_reporting.md`](bg_notifications_and_reporting.md) §4 for the footer counter it feeds. `.212 #46` claims sandbox / MCP /
managed-settings waits show "Needs input"; the **label** is carryover (`:808671` vs `:678802 (193)`) and
the **wait registry** that produces them is the six-slot table at `:334738`:
`["sandbox", "worker-sandbox", "elicitation", "managed-settings", "permission", "dialog"]`, resolved
first-match in that fixed priority order (`:334750-334759`) — sandbox before permission before dialog.

---

## 11. Windows stdin contention and the "wrong status while running" bug

`tengu_fleetview_stdin_contention` (**220=1 / 193=0**) is a diagnostic, not a fix:

```javascript
Jc(() => {
  if (!E) return;                                     // raw mode unsupported: nothing to contend for
  let qe = _.listenerCount("readable");
  if (qe > 1) O("tengu_fleetview_stdin_contention", { listeners: qe });
}, 1500, []);                                          // :804435-804443
```

It samples `process.stdin`'s `readable` listener count **once, 1,500 ms after mount**, and reports it only
when more than one listener is attached. Two listeners means two components both think they own the
keyboard — the observable symptom in `.208 #16` ("keyboard ignored in the agents view after a setup
prompt") and `.198 #9` ("focus stuck"). The 1,500 ms delay is there to let mount-time listeners settle;
sampling at mount would report every transient overlap.

Note this is the pattern used throughout this window's fleet-view work: **the changelog claims a bugfix,
and the anchorable artefact is a telemetry probe.** Treat "NET_NEW (gate only)" verdicts in the ledger as
exactly that — proof that Anthropic instrumented the failure, not proof of what they changed.

---

## 12. False anchors caught in this theme

| Bullet | The anchor it looks like | What the code actually says |
|---|---|---|
| `.198 #19` "Needs attention" | `Needs attention` `220=1 / 193=1` | `:712396` is a **section header in the plugin / MCP / skills manager**, whose sibling headers are `Not used recently` and `Favorites` and whose membership predicate is `SsS` (`:710533-710545`: enabled plugin with errors, failed plugin, flagged plugin, or an MCP server that is `needs-auth`/`failed`). Nothing in the agents view emits it. The label is carryover **and in a different subsystem**. |
| `.210 #32` "the session you pressed ← from stays visibly marked" | `keepInPlaceIds` `220=2 / 193=2` | Both sites (`:710562` parameter, `:711140` call) are in the **same plugin manager**, where it prevents a just-toggled entry from jumping into the disabled section. The agents view's equivalent is `r8t(state, isOrigin, …)` returning `"session you came from"` / `"current session"` (`:802689`, `220=1 / 193=0`). |
| `.199 #24` bare `#N` PR label | `` `#${e.prNumber}` `` `220=1 / 193=1` | `:160555` is byte-identical to `:11182 (193)`. |
| `.206 #26` "was 64 chars" | the number `64` | No `64` exists in either build's fleet-view region. The only relevant 64 is the classifier prompt's new headline budget (§3). |

The general lesson, consistent with `_GROUND_TRUTH_verified_anchors.md` §3: **a label string is the worst
possible anchor for a UI bullet**, because UI vocabulary is shared across screens. Anchor on the
*classifier*, the *layout function*, or the *gate*.

---

## 13. Not covered

- **The transcript-preview renderer for cold attach** (`.214 #37`, `.218 #14`). I confirmed the string
  `Session is starting — showing its transcript until it appears` is `220=1 / 193=0` but did not read the
  preview component or the layout code that `.218 #14` blames, so I cannot describe the padding fix.
- **`.203 #36`** "Removed a redundant navigation hint from the footer" — the 2.1.220 footer list is at
  `:808091-808102`; I did not diff it against 2.1.193's footer to identify the removed entry.
- **`.203 #24`** "`@` directory picker not showing registered git worktrees" — the `@`-mention resolver is
  at `:802992-803001` but the directory-suggestion source is elsewhere and I did not trace it.
- **Pasted-image retention** (`.208 #28`, `.210 #20`) — a `50_performance` concern; both are `0/0`
  unanchored in the scoping pass and I found nothing better.
- The **legacy group layout** (`qF`, `ctrl+e` groups, group rename) is described only where it touches
  the state sections. Its own delta was not measured.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_background_agents_view.md](../00_overview/symbol_additions_v2_1_220_background_agents_view.md).

Key functions in this document:
- `classifyRowGroupByState` (`nfi`, `:802918`) - the four-state section ladder; live process first, LLM last
- `classifyRowLane` (`$Pn`, `:801986`) - live / needs / done, with the `send a prompt to start` sentinel
- `resolveStateWord` (`kMr`, `:803153`) - word + colour + dim for a row
- `classifyNotificationBand` (`jGe`, `:802903`) - active / blocked / completed, feeds the notifier
- `buildSimpleRows` (`kum`, `:802011`) - the `simple:*` sections layout with the 48-hour done fold
- `resolveDoneCapAndHeader` (`rfi`, `:802912`) - trades header rows for finished rows
- `allocateFleetColumns` (`n7S`, `:802788`) - age / label / artifact / **flex detail**
- `resolveStatusText` (`v5e`, `:807249`) - needs > fan > detail, clamped `clamp(24,72,0.55×cols)`
- `sessionAgeText` (`sfi`, `:802677`) - `in 5m` countdown or frozen elapsed age
- `runClassifier` (`kHs`, `:335956`) - preclassify → heuristic → 2-attempt LLM
- `preclassifyTail` (`lcd`, `:334282`) - 17 deterministic branches that skip the LLM
- `classifyTailShape` (`acd`, `:334269`) - independent closing-shape bucket for telemetry
- `classifyLeftArrowGesture` (`Nyp`, `:559650`) - fire / arm / absorb / reject FSM
- `applyLeftArrowGesture` (`Fyp`, `:559664`) - the only writer of the gesture timestamps
- `isInAttachQuietWindow` (`LXr`, `:239750`) - **stubbed `return !1`; the attach branch is dead**
- `isScreenReaderModeEnabled` (`kL`, `:156221`) - makes the status budget `Infinity`
- `getLeaderScopedCommandNotice` (`qWf`, `:748982`) - `/model` and `/fast` only
- `resolvePrStatusDirect` (`AIy`, `:316083`) - ETag-cached REST path with same-origin redirects
- `resolvePrStatusViaGhCli` (`_Iy`, `:316063`) - the `gh pr view` path
- `prAuthHintText` (`mur`, `:316035`) - `gh auth login for PR status` / `install gh for PR status`
- `reportPrAuthState` (`Btd`, `:316079`) - edge-triggered `tengu_gh_pr_status_auth_state`
- `renderPrBadge` (`Zdm`, `:803190`) - `✗ 2/7` / `5/7` / `✓` plus a review word
- `summarizeFan` (`Hum`, `:802069`) - todo ratio preferred over agent ratio
- `rowLabel` (`r8t`, `:802682`) - name → 3-word intent → `untitled session` / `session you came from`
- `mostRecentTerminalTimestamp` (`kcl`, `:801993`) - `firstTerminalAt` → `updatedAt` → `createdAt`
