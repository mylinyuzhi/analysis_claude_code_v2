# Background-Session State Classifier - four-state prompt, regex fast-paths, goal snapshot

> **Module:** 36_background_agents · **Build:** v2.1.156 · **Status:** the four-state classifier prompt is NEW post-2.1.88 (2.1.142's `completed_vs_working.md` is the display-layer precursor)
> **Source:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`

## Related Symbols

> Symbol mappings live ONLY in the central index files:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents lives here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions/objects in this document (list format, per project rules):

- `CLAUDE_AGENT_DEF` (`IV6`) — built-in catch-all agent whose `getSystemPrompt` teaches the narrate/restate/`result:`/`needs input:`/`failed:` conventions the classifier depends on (cli_inner_pretty.js:236184-236208)
- `classifierPrompt` (`r04`) — the full four-state classifier system prompt (cli_inner_pretty.js:449361-449539)
- `classifyState` (`JT4`) — the classifier dispatcher: fast-path → heuristic → LLM (cli_inner_pretty.js:450335-450419)
- `fastPathClassify` (`i04`) — regex fast-path battery; returns a tagged branch or `null` (cli_inner_pretty.js:449166-449285)
- `scanExplicitMarkers` (`Pd_`) — scans `failed:`/`needs input:`/`blocked:` line markers, code-fence aware (cli_inner_pretty.js:449139-449152)
- `isInsideCodeFence` (`KPH`) — fenced-region detector that voids markers inside ``` blocks (cli_inner_pretty.js:449087-449113)
- `truncateWithEllipsis` (`sZ`) — surrogate-safe one-line truncator, cap `iL`=800 (cli_inner_pretty.js:449078-449083)
- `isTerminalState` (`jd_`) — `Md_.has(state)` terminal-state predicate (cli_inner_pretty.js:449075-449077)
- `TERMINAL_STATES` (`Md_`) — `Set(["done","failed","stopped"])` (cli_inner_pretty.js:449562)
- `STATE_DEFINITIONS` (`fd_`) — long-form working/blocked/done/failed definitions for the LLM-output reconciler (cli_inner_pretty.js:449552-449560)
- `OUTPUT_FIELDS` (`Od_`) — `{ result: "…" }` allow-list for `output.*` keys (cli_inner_pretty.js:449561)
- explicit-marker regexes (each on its own declaration line): `MARKER_FAILED` (`Dd_`, cli_inner_pretty.js:449563), `MARKER_NEEDS_INPUT` (`Jd_`, cli_inner_pretty.js:449564), `MARKER_BLOCKED` (`Xd_`, cli_inner_pretty.js:449565), `MARKER_IM_BLOCKED` (`Ld_`, cli_inner_pretty.js:449566)
- tail-shape regexes (each on its own declaration line; multi-line bodies noted): `RX_FORWARD_INTENT` (`Wd_`, cli_inner_pretty.js:449567, body 449568), `RX_PASSIVE_WAIT` (`Zd_`, cli_inner_pretty.js:449569, body 449570), `RX_AGENTS_STATUS` (`Gd_`, cli_inner_pretty.js:449571), `RX_WILL_CHECK_BACK` (`Td_`, cli_inner_pretty.js:449573), `RX_CANT_PROCEED` (`Vd_`, cli_inner_pretty.js:449575), `RX_GIVING_UP` (`vd_`, cli_inner_pretty.js:449576), `RX_PUSHED_COMMITTED` (`kd_`, cli_inner_pretty.js:449577), `RX_READY_FOR` (`Nd_`, cli_inner_pretty.js:449579), `RX_VERDICT` (`Ed_`, cli_inner_pretty.js:449580), `RX_PLEASE_DO_X` (`yd_`, cli_inner_pretty.js:449581), `RX_STOPPING_HERE` (`hd_`, cli_inner_pretty.js:449583)
- `buildClassifierUserMsg` (`o04`) — assembles `Current state / Tool calls / User's ask / tail` user message (cli_inner_pretty.js:449295-449307)
- `parseClassifierJson` (`a04`) — strips fences, slices `{…}`, zod-validates (cli_inner_pretty.js:449308-449321)
- `reconcileClassifierResult` (`yk$`) — fills/validates `{state,detail,tempo,needs,output}` against prior state (cli_inner_pretty.js:449325-449339)
- `heuristicLastLine` (`Qi6`) — last-non-empty-line "working" fallback (cli_inner_pretty.js:449286-449294)
- `summarizeToolCallsDeterministic` (`ci6`) — cheap top-5 tool-name tally for the classifier user message (cli_inner_pretty.js:450322-450334)
- `EXCLUDED_TOOLS` (`Hc_`) — tools omitted from the tally: `Set([df, rP, MJ])` (cli_inner_pretty.js:450512)
- `generateToolUseSummary` (`z04`) — LLM "git-commit-subject" tool-summary generator (cli_inner_pretty.js:447331-447382)
- `TOOL_SUMMARY_PROMPT` (`Zg_`) — the label-writing system prompt for `z04` (cli_inner_pretty.js:447393-447402)
- `createClassifierJobState` (`Bd_`) — per-session classifier scratch state (cli_inner_pretty.js:449816-449834)
- `findLatestRealUserAsk` (`dd_`) — last non-meta string user turn (cli_inner_pretty.js:449875-449880)
- `SessionStateTracker` (`nS$`) — class with `hasTerminalGoalSnapshot`, `notifyStateChanged`, goal-clear-on-running (cli_inner_pretty.js:623957-623995)
- `addGoalStopHook` (`j$$`) — `/goal` activation: registers Stop hook + sets `activeGoal` (cli_inner_pretty.js:447943-447957)
- `clearGoalStopHook` (`w$$`) — `/goal clear`: removes Stop hook + clears `activeGoal` (cli_inner_pretty.js:447958-447969)
- `goalSentinelMessage` (`L04`) — emits a `goal_status` sentinel attachment (cli_inner_pretty.js:447971-447977)
- `restoreGoalFromTranscript` (`Zyz`) / `findGoalToRestore` (`Rf9`) — resume-time goal recovery (cli_inner_pretty.js:598861-598881)

---

## TL;DR

A background Claude session has no human watching it, so the product needs to answer one question after every assistant turn: **does the user need to come back right now?** That decision drives a phone push notification. v2.1.156 answers it with a dedicated classifier that reads **only the assistant's message text** — not tool output, not subagent reports, not human replies — and projects it onto four states: `working`, `blocked`, `done`, `failed`. Only `blocked` pushes a notification.

The classifier is a two-tier engine:

1. **A regex fast-path battery** (`fastPathClassify` `i04`, cli_inner_pretty.js:449166) that recognizes ~18 unambiguous tail shapes (`result:` markers, "Now let me…", "Reply `go`", auth errors, "Giving up", etc.) deterministically — no LLM call, sub-millisecond.
2. **An LLM side-query** (`classifyState` `JT4`, cli_inner_pretty.js:450335) using the long prompt `classifierPrompt` (`r04`, cli_inner_pretty.js:449361) on a small fast model with thinking disabled, only when the fast-path returns `null`.

Because the classifier sees only text, the built-in agent prompt `CLAUDE_AGENT_DEF` (`IV6`, cli_inner_pretty.js:236184) *coaches the agent* to write the markers the classifier looks for ("Restate.", "write `result:` on its own line", "`needs input:`", "`failed:`"). The two prompts are a matched pair: one trains the writer, the other reads the writing.

Orthogonally, a `/goal` session keeps a **goal snapshot** in `SessionStateTracker` (`nS$`, cli_inner_pretty.js:623957). The 2.1.156 fix in this doc's title — *"classifier losing the user's goal when a scheduled `/command` fires"* (CHANGELOG.md:33) — is rooted in `notifyStateChanged("running")` clearing the goal snapshot (cli_inner_pretty.js:623973-623975); a cron-injected command turn transitions the session to `running`, which can wipe the on-the-phone goal display unless the goal is re-derived from `activeGoal.condition`.

**Confidence:** high for the prompt, regex battery, and goal/state-tracker mechanics (all read verbatim below). Medium for the exact cron-goal-loss patch site — the *mechanism* is pinpointed (running-clears-snapshot at 623975; condition-match at 450792/450850), but the precise scheduled-command injection turn that triggered the regression is not isolated to a single line; it is marked (unverified) where I cannot pin it.

---

## 1. The two-prompt contract: writer prompt `IV6` ↔ reader prompt `r04`

The whole design rests on a separation: the **classifier never sees tool output**. It reads the assistant's *prose tail*. So the assistant must be told to put everything important into prose. That is exactly what the built-in agent prompt does.

### 1.1 `CLAUDE_AGENT_DEF` (`IV6`) — the writer-side conventions

```javascript
// ============================================
// CLAUDE_AGENT_DEF - built-in bg agent prompt teaching the classifier conventions
// Location: cli_inner_pretty.js:236184-236208
// ============================================

// ORIGINAL (for source lookup):
IV6 = {
  agentType: "claude",
  whenToUse: "Catch-all for any task that doesn't fit a more specific agent. FleetView's default when no agent name is typed.",
  tools: ["*"], source: "built-in", baseDir: "built-in", appendSystemPrompt: !0,
  getSystemPrompt: () => `This session is a background job. The user may be live or away — respond naturally either way. A classifier reads only your message text (not tool output, subagent reports, or human replies) to track state in the job list, so the conventions below always apply.

**Narrate.** One line on your approach before acting. After each chunk: what happened, what's next.

**Restate.** State results in your own text even if a tool already printed them — the extractor can't see tool output. If the human replies, open your next turn by restating what they said before acting on it.
...
**Completed.** ... Then write \`result:\` on its own line with a self-contained one-line headline ... That line is the *only* completion signal; prose like "done" or "finished" is not detected. ...

**Needs input.** ... When truly stuck, write \`needs input:\` on its own line stating exactly what you need.

**Failed.** ... Write \`failed:\` on its own line with the reason.

Everything else: keep working.`,
};

// READABLE (for understanding):
const CLAUDE_AGENT_DEF = {
  agentType: "claude",
  whenToUse: "Catch-all … FleetView's default when no agent name is typed.",
  tools: ["*"], source: "built-in", baseDir: "built-in", appendSystemPrompt: true,
  getSystemPrompt: () => /* prose telling the agent: Narrate, Restate, emit `result:`/`needs input:`/`failed:` on their own lines, because a classifier reads ONLY message text */,
};

// Mapping: IV6→CLAUDE_AGENT_DEF
```

This is the `qKH` (`claudeAgentTemplate`) default-dispatch template's source (`qKH = Ce4(IV6)`, cli_inner_pretty.js:541290) — see the sibling `shell_exec_sessions.md`. The three load-bearing lines for *this* doc:

- **"A classifier reads only your message text (not tool output, subagent reports, or human replies)"** (cli_inner_pretty.js:236193) — this is the literal design constraint that the reader prompt `r04` repeats from the other side ("Read the tail of what the agent just said").
- **"write `result:` on its own line … That line is the *only* completion signal; prose like 'done' or 'finished' is not detected"** (cli_inner_pretty.js:236201) — directly mirrors the fast-path `result:` matcher in `i04` (cli_inner_pretty.js:449171) and the `r04` explicit-marker rule (cli_inner_pretty.js:449393).
- **`needs input:` / `failed:` on their own lines** (cli_inner_pretty.js:236203-236205) — mirror the `Jd_`/`Dd_` explicit-marker regexes (cli_inner_pretty.js:449563-449564).

**Why this approach:** The classifier could have been given the full transcript including tool output. That was rejected for two reasons inferable from the code:
1. **Cost/latency.** The classifier runs after *every* turn on a small fast model with thinking disabled (`AT4` → `useSmallFastModel:!0, disableThinking:!0`, cli_inner_pretty.js:449836). Feeding it tool output (often kilobytes of grep results, file contents, CI logs) would blow the token budget and slow every turn.
2. **Signal quality.** Tool output is noisy and ambiguous; a finished `npm test` exit-0 doesn't say *whether the agent considers the ask delivered*. Only the agent's own prose carries intent. So the design forces intent into prose via `IV6`, then reads only prose via `r04`.

**Key insight:** This is a *cooperative* protocol, not a parser. The agent is a willing participant taught to emit machine-readable markers in otherwise-human prose. The markers (`result:`, `needs input:`, `failed:`) are the high-confidence ground truth; everything else is classified heuristically. The cost of the contract is one extra constraint on the agent's writing; the payoff is a cheap, reliable, text-only classifier.

### 1.2 `classifierPrompt` (`r04`) — the reader-side four-state spec

`r04` (cli_inner_pretty.js:449361-449539) is a ~180-line prompt. Its structure:

```
┌──────────────────────────────────────────────────────────────────────┐
│ r04  classifier prompt                                                 │
├──────────────────────────────────────────────────────────────────────┤
│ Framing      "user walked away … read the TAIL … decide which of 4"    │  449361
│ Stakes       false "blocked" = annoying ping; false "done" = idle      │  449363
│ THE FOUR STATES      done / working / blocked / failed (definitions)   │  449365-449373
│ THE HARD BOUNDARIES                                                     │  449375
│   · done vs working    (explicit forward intent vs declarative close)  │  449377
│   · done vs blocked    optional-offers-vs-gates test                   │  449379-449381
│   · working/done/blocked when "waiting" mentioned (who acts next?)     │  449383-449387
│   · Stickiness         don't move done→working without restart         │  449389
│ EXPLICIT MARKERS     "No response requested." / result: / blocked: …   │  449391-449397
│ API/AUTH/INFRA ERRORS → always "blocked", never "failed"               │  449399-449403
│ OTHER DISAMBIGUATION  retrying→working, names missing thing→blocked …  │  449405-449410
│ EXAMPLES (tail → JSON)        ~22 worked examples                       │  449412-449509
│ CONTRASTIVE PAIRS    same surface shape, different state                │  449511-449527
│ OUTPUT  JSON schema + detail/tempo/needs/output.result rules            │  449529-449538
└──────────────────────────────────────────────────────────────────────┘
```

The four state definitions (cli_inner_pretty.js:449367-449373), verbatim-summarized:

- **`done`** — "answered the ask or delivered the thing, and isn't planning to do anything else unprompted. … There doesn't have to be a PR, commit, or file" (cli_inner_pretty.js:449367). Explanations, analyses, recommendations, "here's what I found", "files at <path>" are all done.
- **`working`** — "intends to keep going without being asked: 'now let me…', 'next I'll…', 'running…', 'checking…', or it's waiting on something it kicked off (CI, build, subagent, deploy, timer)" (cli_inner_pretty.js:449369).
- **`blocked`** — "cannot continue without the user. … a direct question the agent NEEDS answered …, a request to provide something …, an instruction the user must execute …, or an auth/API error the user can fix. Test: would the user replying or acting unblock it?" (cli_inner_pretty.js:449371).
- **`failed`** — "gave up because the task is structurally impossible as framed … If the agent names a specific missing resource, that's 'blocked', not 'failed'" (cli_inner_pretty.js:449373).

### The "done vs blocked" optional-offers test (core decision)

**What it does:** Disambiguates the single hardest case — an agent that *delivered* but closes with a question.

**How it works (cli_inner_pretty.js:449379-449381):** The prompt names the discriminator explicitly:

> "if the user ignores the closing question, is the original ask still satisfied? Yes → done. No → blocked."

Then it carves the exception: a question about **whether or how to ship the asked-for work** ("which PR to put it in, apply it or not, push or hold, which approach") flips to `blocked` because "the deliverable isn't landed without the answer." The contrastive pair (cli_inner_pretty.js:449521-449523) nails it:

- "Want me to also clean up the old helper?" → **done** (tangential extra after delivery)
- "Want me to apply this fix or just report it?" → **blocked** (how to deliver the asked-for work)

**Why this approach:** A naive "ends with `?` → blocked" rule produces a flood of false notifications, because polite agents end nearly every turn with an offer to do more. The product's stated cost model (cli_inner_pretty.js:449363) is asymmetric but *both sides hurt*: a false `blocked` is "an annoying interruption for nothing," a false `done` means "the work sits idle until they happen to check." The optional-offers test resolves the ambiguity by asking about the *original ask's* satisfaction, not the surface grammar.

**Key insight:** The discriminating question is counterfactual ("if the user ignores the closing question…"). That is a semantic judgment a regex cannot make reliably — which is precisely why questions that survive the fast-path's narrow trailing-`?` rule (cli_inner_pretty.js:449201) fall through to the LLM, where `r04`'s contrastive pairs are the training signal.

### The "who acts next?" waiting discriminator

**What it does:** Resolves the three-way ambiguity when the closing mentions *waiting on something*.

**How it works (cli_inner_pretty.js:449383-449387):** The discriminator is **"whether the AGENT ITSELF will do more"**:
- Agent will act ("I'll report when X lands", "next check in 5 min", "shepherding CI") → **working** — the agent owns the next step *regardless of what it's waiting on*.
- Agent won't act + user-addressed gate, no re-poll ("reply `go` to merge", "awaiting your approval") → **blocked**.
- Agent won't act + wait on third party / passive trigger ("auto-merge armed, awaiting stamp", "CI will run") → **done** — the agent's part is over.

The tie-breaker for a closing with *both* signals: "Awaiting your `go`. Next check in 20m" → **working**, because the agent re-checks on its own; `go` is "an optional accelerator, not a hard gate" (cli_inner_pretty.js:449387). This is reinforced by the example at cli_inner_pretty.js:449427-449429.

**Why this approach:** "Waiting" is the most overloaded closing in agent prose. Anchoring on the *actor of the next step* (agent vs user vs nobody) collapses the ambiguity into a single, checkable question and aligns perfectly with the notification goal: only a user-owned next step needs a ping.

### The API/AUTH/INFRA → blocked override (never failed)

**What it does:** Forces every auth/API/infra error to `blocked`, never `failed`, and sets `needs` to the fix (cli_inner_pretty.js:449399-449403).

**How it works:** A long enumerated list covers Anthropic API (`401`, `Invalid API key`, `Please run /login`, `rate limited`, `overloaded`, `529`, `credit balance too low`, `usage limit reached`), MCP servers (OAuth expired/revoked, vault credential missing), and external services (`gh auth login`, `gcloud auth login`, `aws sso login`, GitLab/GitHub PAT, Stripe/Slack 401). "Any prose naming a specific re-auth or re-login step" is blocked.

**Why this approach:** These errors are *transient or user-fixable* (cli_inner_pretty.js:449399). Classifying them as `failed` would (a) suppress the notification the user needs to fix the auth, and (b) mark the job dead when it could resume after one `/login`. The override is duplicated in the fast-path's `auth-prose` branch (cli_inner_pretty.js:449245-449257) so the common case never reaches the LLM, and in the API-error mapper `l04` (cli_inner_pretty.js:449114-449137) for when the *classifier itself* hits an API error. Note `l04`'s `default`/`unknown` falls to `failed` (cli_inner_pretty.js:449135-449136) — that path is for a genuinely unknown error class, not a named re-auth step.

### Output schema and the `detail`/`needs`/`output.result` contract

```
// cli_inner_pretty.js:449529-449530
OUTPUT — respond with ONLY this JSON, no code fences:
{"state":"<working|blocked|done|failed>","detail":"<one line>","tempo":"<active|idle|blocked>",
 "needs":"<when blocked: the exact ask; omit otherwise>",
 "output":{"result":"<one-sentence deliverable headline, ≤180 chars; omit when working>"}}
```

- **`detail`** is "what shows on the user's phone lock screen — write it like a colleague's Slack message" (cli_inner_pretty.js:449532): name the concrete thing (file, function, error, number) and what happened. "fixed auth race in middleware.ts, tests green," not "completed task."
- **`tempo`**: `active`=computing, `idle`=waiting on external (CI/timer/reviewer), `blocked`=waiting on user (cli_inner_pretty.js:449534).
- **`needs`**: when blocked, the exact action copied from the tail "as closely as possible — they'll act on this text without reading the transcript" (cli_inner_pretty.js:449536).
- **`output.result`**: one-sentence deliverable headline; if the tail has `result:` on its own line, that line *is* the result; omit when working (cli_inner_pretty.js:449538).

The output is validated by `parseClassifierJson` (`a04`, cli_inner_pretty.js:449308): strip a ```json fence if present, slice from first `{` to last `}`, `JSON.parse`, then zod-validate against a nullish-everything schema (`Yd_`, cli_inner_pretty.js:449544-449550). If parse fails, the dispatcher retries once with an appended "Previous response was not valid JSON" nudge (cli_inner_pretty.js:450370-450372).

---

## 2. The regex fast-path battery (`fastPathClassify` `i04`)

**What it does:** Classifies the unambiguous tail shapes deterministically, returning a `{branch, state, tempo, detail, needs?, output?}` object, or `null` to defer to the LLM.

**How it works:** `i04` (cli_inner_pretty.js:449166-449285) operates on the **last 800 chars** of the trimmed text (`q = $.slice(-800)`, cli_inner_pretty.js:449169) and is *code-fence aware* throughout — every match is gated by `!isInsideCodeFence(...)` so a `result:` line inside a ``` block doesn't trigger. The branches, in priority order:

```
i04(text)                                                              449166
 ├─ empty → (caller returns "empty"; i04 returns null)
 ├─ scan for `result:` line  (449171)         → capture K
 ├─ scanExplicitMarkers Pd_  (449179)         → A = last of {failed:/needs input:/blocked:/I'm blocked:}
 │    ├─ result + no later marker:
 │    │     next: present?  → branch "result-then-next"  working   449182-449183
 │    │     else            → branch "result-marker"     done      449184
 │    ├─ A.state==="failed"  → branch "failed-marker"    failed    449186-449187
 │    └─ A.state==="blocked" → (≥3 non-empty paras after? → null; "nothing needed from you"? → done)
 │                            → branch "blocked-marker"  blocked   449188-449200
 ├─ trailing `?` (≥4 non-? chars)  → branch "trailing-q"  blocked  449201-449213
 ├─ last sentence f:
 │    ├─ /waiting (for|on)|pending CI|build|tests|reviewer|deploy/  → "wait-external"   working  449224-449228
 │    ├─ /awaiting your feedback|input|… you|the user/              → "awaiting-user"   blocked  449229-449236
 │    ├─ /please run|let me know which|which option|should I proceed/ → "ask-verb"      blocked  449237-449244
 │    ├─ /not logged in|/login|invalid api key|oauth …|401|gh auth …/ → "auth-prose"    blocked  449245-449257
 │    ├─ Wd_ forward-intent && !Zd_ passive-wait  → "working-verb"   working/active     449258-449259
 │    ├─ Gd_ agents-status                        → "agents-status"  working/idle       449260
 │    ├─ Td_ will-check-back                      → "will-check-back" working/idle      449261
 │    ├─ Vd_ can't-proceed                        → "cant-proceed"   blocked            449262-449265
 │    ├─ vd_ giving-up                            → "giving-up"      failed             449266
 │    ├─ kd_ pushed/committed/opened-PR           → "pushed-committed" done             449267-449270
 │    ├─ Nd_ ready-for-review                     → "ready-for"      done               449271
 │    ├─ Ed_ VERDICT: PASS|FAIL                   → "verdict-marker" done               449272-449275
 │    ├─ yd_ please-do-x                          → "please-do-x"    blocked            449276-449279
 │    └─ hd_ stopping-here                        → "stopping-here"  blocked            449280-449283
 └─ no match → null  (449284)  → caller goes to LLM
```

### The explicit-marker scanner `Pd_`

```javascript
// ============================================
// scanExplicitMarkers - find last failed:/needs input:/blocked: marker outside code fences
// Location: cli_inner_pretty.js:449139-449152
// ============================================

// ORIGINAL (for source lookup):
function Pd_(H, $, q) {
  let K;
  for (let [_, z] of [["failed", Dd_], ["blocked", Jd_], ["blocked", Xd_], ["blocked", Ld_]])
    for (let A of $.matchAll(z)) {
      if (KPH(H, q + A.index)) continue;
      if (!K || A.index > K.index) K = { state: _, capture: A[1].trim(), index: A.index, end: A.index + A[0].length };
    }
  return K;
}

// READABLE (for understanding):
function scanExplicitMarkers(fullText, slice, sliceOffset) {
  let best;
  for (let [state, rx] of [["failed", MARKER_FAILED], ["blocked", MARKER_NEEDS_INPUT],
                            ["blocked", MARKER_BLOCKED], ["blocked", MARKER_IM_BLOCKED]])
    for (let m of slice.matchAll(rx)) {
      if (isInsideCodeFence(fullText, sliceOffset + m.index)) continue;   // skip fenced markers
      if (!best || m.index > best.index)                                  // keep the LAST marker
        best = { state, capture: m[1].trim(), index: m.index, end: m.index + m[0].length };
    }
  return best;
}

// Mapping: Pd_→scanExplicitMarkers, H→fullText, $→slice, q→sliceOffset, Dd_→MARKER_FAILED,
//          Jd_→MARKER_NEEDS_INPUT, Xd_→MARKER_BLOCKED, Ld_→MARKER_IM_BLOCKED, KPH→isInsideCodeFence
```

The marker regexes all share the same shape — anchored at start-of-line, the keyword, a `:` / em-dash / en-dash / hyphen separator, then a 3-200-char capture up to EOL:

```javascript
// cli_inner_pretty.js:449563-449566
Dd_ = /(?:^|\n)\s*failed\s*[:—–-]\s*(.{3,200}?)(?=\n|$)/gi;       // MARKER_FAILED
Jd_ = /(?:^|\n)\s*needs input\s*[:—–-]\s*(.{3,200}?)(?=\n|$)/gi;  // MARKER_NEEDS_INPUT
Xd_ = /(?:^|\n)\s*blocked\s*[:—–-]\s*(.{3,200}?)(?=\n|$)/gi;      // MARKER_BLOCKED
Ld_ = /\bI'?m blocked\s*[:—–-]\s*(.{3,200}?)(?=\n|$)/gi;          // MARKER_IM_BLOCKED
```

**Why scan for the LAST marker (`m.index > best.index`):** A turn may mention "I was blocked earlier but found a workaround" then close with `result:`. Taking the *last* marker (and `result:` is scanned separately, later in the text) honors the agent's most recent state. The `result:` + no-later-marker check at cli_inner_pretty.js:449180 ensures a `result:` followed by a `blocked:` correctly yields blocked, not done.

### The tail-shape regexes `Wd_` … `hd_`

The most important pair is forward-intent vs passive-wait, because they jointly decide `working`:

```javascript
// ============================================
// RX_FORWARD_INTENT / RX_PASSIVE_WAIT - the working-verb discriminator
// Location: Wd_ decl cli_inner_pretty.js:449567 (body 449568) / Zd_ decl 449569 (body 449570)
// ============================================

// ORIGINAL (for source lookup):
Wd_ = /^(?:(?:Now|Next|Then|Alright|OK|Okay|Right|Good|First|Also),?\s+)?(?:Let me (?!know\b)|(?:I(?:'?ll| will) |I'?m going to |Going to )(?!need\b|require\b|wait\b|leave\b|hold\b|skip\b|stop\b)|Proceeding |Moving (?:on|to)\b|Continuing |Starting |Trying |Checking |Looking |Searching |Reading |Investigating |Running |Re-?running |Building |…|Analyzing |Tracing |Exploring )/i;
Zd_ = /\b(?:once |when |after |until |as soon as )(?:you|it|the|that|this|they)\b|\bagain in\b|\bcheck back\b|\bin ~?\d+\s*(?:s…|m…|h…)\b|\bthen\.?\s*$|…|\bif (?:you…|that…|useful|needed|helpful|desired)\b|…/i;

// READABLE (for understanding):
const RX_FORWARD_INTENT =  // an active verb opening the last sentence, with negative look-aheads
  /^(?:(?:Now|Next|Then|…),?\s+)?(?:Let me (?!know\b)|(?:I'?ll |I will |I'?m going to )(?!need|wait|hold|stop…)|Proceeding |Checking |Running |Building |…)/i;
const RX_PASSIVE_WAIT =    // a temporal/conditional clause that means "not the agent's own next step"
  /\b(?:once|when|after|until|as soon as) (?:you|it|the…)\b|\bcheck back\b|\bin ~?\d+\s*(?:s|m|h)\b|\bif (?:you…|useful|needed)\b|…/i;

// Mapping: Wd_→RX_FORWARD_INTENT, Zd_→RX_PASSIVE_WAIT
```

The branch is `if (!O && Wd_.test(f) && !Zd_.test(f))` (cli_inner_pretty.js:449258): an active verb *and not* a passive-wait clause → `working` with `tempo:"active"`. The negative look-aheads inside `Wd_` are surgical: `Let me (?!know\b)` excludes "let me know if you want X" (an *offer*, which is `done`, not forward intent); `I'?ll …(?!need\b|wait\b|hold\b|stop\b)` excludes "I'll need your input" / "I'll wait for you" (which are `blocked`). `Zd_` then strips "I'll re-pull metrics **when** you confirm" (user-owned → not working).

The remaining single-purpose regexes (cli_inner_pretty.js:449571-449584):

- `Gd_` (`RX_AGENTS_STATUS`) — "N agents in flight", "Loop active", "Waiting for the cron/fork" → working/idle.
- `Td_` (`RX_WILL_CHECK_BACK`) — "I'll check back/re-check/poll … (when not your…) " → working/idle. The `(?!your?\b)` look-ahead is what separates "I'll re-check when **it** lands" (working) from "I'll re-check when **your** approval comes" (which should be blocked).
- `Vd_` (`RX_CANT_PROCEED`) — "I can't/cannot proceed/continue/make progress" → blocked.
- `vd_` (`RX_GIVING_UP`) — "Giving up" / "The task is not actionable" → failed.
- `kd_` (`RX_PUSHED_COMMITTED`) — "Pushed to `…`", "Committed as `<sha>`", "Opened PR #…" → done.
- `Nd_` (`RX_READY_FOR`) — "Ready for review / to merge / ship / land" → done.
- `Ed_` (`RX_VERDICT`) — "VERDICT: PASS|FAIL" → done (used by review/judge agents).
- `yd_` (`RX_PLEASE_DO_X`) — "Please start/run/provide/grant/export/install/set `ENV_VAR`…" → blocked.
- `hd_` (`RX_STOPPING_HERE`) — "Stopping here / Parked the branch / Paused here" → blocked.

**Why a fast-path at all:** Three reasons inferable from the code:
1. **Latency** — the classifier runs after every turn; a regex match is sub-millisecond versus a network round-trip to an LLM.
2. **Determinism** — explicit markers (`result:`, `failed:`) are *ground truth* per the writer contract; running them through an LLM risks the LLM second-guessing an unambiguous signal.
3. **Cost** — `tengu_bg_classify` telemetry (cli_inner_pretty.js:450398) tracks `path: "preclassify"` vs `"llm"`; the fast-path keeps the LLM call rate (and token spend) down for the common shapes.

**Key insight — the `!O` gate (code-fence guard) everywhere:** Nearly every fast-path branch is `if (!O && …)`, where `O = isInsideCodeFence(text, lastSentenceOffset)` (cli_inner_pretty.js:449223). The classifier reads agent prose, and agents paste shell snippets and diffs that *contain* the trigger words ("Stopping here", "result:", "Reply `go`"). The fence detector `isInsideCodeFence` (`KPH`, cli_inner_pretty.js:449087) walks ``` / ~~~ open/close runs (handling indentation up to 3 spaces and matching fence lengths) and returns whether a given offset sits inside an open fence. Without it, a tail that ends with a pasted example command would be wildly misclassified.

### The terminal-state predicate and the state maps

```javascript
// ============================================
// isTerminalState + the state-definition maps (TERMINAL_STATES, STATE_DEFINITIONS, OUTPUT_FIELDS)
// Location: cli_inner_pretty.js:449075-449077 (jd_), 449552-449562 (fd_/Od_/Md_)
// ============================================

// ORIGINAL (for source lookup):
function jd_(H) { return Md_.has(H); }
fd_ = { working: "actively progressing on the task …; no pending question for the user",
        blocked: 'the last message ends on a direct question or explicit request …',
        done:    'the task the user asked for is fully delivered …; not "almost done"',
        failed:  "the agent has given up or hit something unrecoverable …" };
Od_ = { result: "one short sentence naming the finished deliverable — no sub-clauses or bullet summaries" };
Md_ = new Set(["done", "failed", "stopped"]);

// READABLE (for understanding):
function isTerminalState(state) { return TERMINAL_STATES.has(state); }
const STATE_DEFINITIONS = { working: "…", blocked: "…", done: "…", failed: "…" };  // fd_
const OUTPUT_FIELDS      = { result: "one short sentence naming the finished deliverable" };  // Od_
const TERMINAL_STATES    = new Set(["done", "failed", "stopped"]);                  // Md_

// Mapping: jd_→isTerminalState, Md_→TERMINAL_STATES, fd_→STATE_DEFINITIONS, Od_→OUTPUT_FIELDS
```

- `TERMINAL_STATES` (`Md_`) is consulted by `isTerminalState` (`jd_`), which the reconciler `yk$` uses to force `tempo:"idle"` for any terminal state (cli_inner_pretty.js:449329) — a `done`/`failed`/`stopped` job is never `active`.
- `STATE_DEFINITIONS` (`fd_`) is the allow-list the reconciler validates LLM output against (`Object.hasOwn(fd_, K)`, cli_inner_pretty.js:449327): an LLM hallucinating a fifth state falls back to the prior state `$`.
- `OUTPUT_FIELDS` (`Od_`) is the allow-list for `output.*` keys (cli_inner_pretty.js:449335): only `result` survives reconciliation; any other key the LLM invents is dropped.

---

## 3. The dispatcher `classifyState` (`JT4`)

**What it does:** Orchestrates fast-path → heuristic → LLM, then emits `tengu_bg_classify` telemetry.

```javascript
// ============================================
// classifyState - fast-path → heuristic → LLM classifier dispatcher
// Location: cli_inner_pretty.js:450335-450419
// ============================================

// ORIGINAL (for source lookup):
async function JT4(H, $, q, K, _, z, A = new Set()) {
  let Y = Date.now(), f = i04(H), O, M = { input_tokens:0, … }, j = 0, w;
  if (f) ((O = "preclassify"), (w = { ...yk$({}, $, f), source: O }));
  else if (z === "heuristic") ((O = "heuristic"), (w = { ...yk$({}, $, Qi6(H)), source: O }));
  else {
    let D = H.slice(-c04), J = o04({ tail: D, prev: $, latestAsk: q, toolSummary: K, minsInState: _ }),
        X = lo({ ttl: REH("agent_classifier") ? "1h" : void 0, scope: WMH() ? "global" : void 0 }),
        L = YT4(), [P, Z] = fT4(L);
    O = "apiError"; let W = null;
    for (let G = 0; G < 2 && !W; G++) {
      j = G + 1; let V;
      try { V = await Au({ querySource: "agent_classifier", model: L, thinking: P, max_tokens: 1024 + Z,
                           maxRetries: 3, skipSystemPromptPrefix: !0,
                           system: [{ type: "text", text: r04, cache_control: X }],
                           messages: [{ role: "user", content: G === 0 ? J : `${J}\n\nPrevious response was not valid JSON. …` }] }); }
      catch (h) { N(`[classifier] sideQuery failed: ${h}`); break; }
      O = "llm"; /* accumulate usage */ let E = V.content.find((h) => h.type === "text"), S = E?.text?.trim() ?? "";
      if (!S) continue;
      W = a04(S);
    }
    w = W ? { ...yk$(W, $, null), source: "llm" } : { ...yk$({}, $, Qi6(H)), source: "heuristic" };
  }
  return (d("tengu_bg_classify", { path: O, engine: z, …, branch: f?.branch ?? …, closingShape: n04(H),
                                   prevState: $, newState: w?.state ?? "null", stateChanged: w !== null && w.state !== $,
                                   minsInPrevState: Math.round(_), durationMs: Date.now()-Y, tailChars: H.length, … }), w);
}

// READABLE (for understanding):
async function classifyState(tail, prevState, latestAsk, toolSummary, minsInState, engine, surfaces = new Set()) {
  let started = Date.now(), fast = fastPathClassify(tail), path, result;
  if (fast) { path = "preclassify"; result = { ...reconcileClassifierResult({}, prevState, fast), source: path }; }
  else if (engine === "heuristic") { path = "heuristic"; result = { ...reconcileClassifierResult({}, prevState, heuristicLastLine(tail)), source: path }; }
  else {
    let tailSlice = tail.slice(-2000),                                   // c04 = 2000
        userMsg = buildClassifierUserMsg({ tail: tailSlice, prev: prevState, latestAsk, toolSummary, minsInState }),
        cacheControl = promptCache({ ttl: gate("agent_classifier") ? "1h" : undefined, scope: isManaged() ? "global" : undefined }),
        model = pickClassifierModel(), [thinking, extraTokens] = classifierThinkingConfig(model);
    path = "apiError"; let parsed = null;
    for (let attempt = 0; attempt < 2 && !parsed; attempt++) {
      let resp;
      try { resp = await sideQuery({ querySource: "agent_classifier", model, thinking, max_tokens: 1024 + extraTokens,
                                     maxRetries: 3, skipSystemPromptPrefix: true,
                                     system: [{ type: "text", text: classifierPrompt, cache_control: cacheControl }],
                                     messages: [{ role: "user", content: attempt === 0 ? userMsg : `${userMsg}\n\nPrevious response was not valid JSON. Respond with ONLY the JSON object, nothing else.` }] }); }
      catch (e) { log(`[classifier] sideQuery failed: ${e}`); break; }
      path = "llm"; /* accumulate token usage */
      let text = resp.content.find((c) => c.type === "text")?.text?.trim() ?? "";
      if (!text) continue;
      parsed = parseClassifierJson(text);
    }
    result = parsed ? { ...reconcileClassifierResult(parsed, prevState, null), source: "llm" }
                    : { ...reconcileClassifierResult({}, prevState, heuristicLastLine(tail)), source: "heuristic" };
  }
  emit("tengu_bg_classify", { path, engine, branch: fast?.branch ?? (path === "heuristic" ? "heuristic" : "none"),
                              closingShape: closingTailShape(tail), prevState, newState: result?.state ?? "null",
                              stateChanged: result !== null && result.state !== prevState, … });
  return result;
}

// Mapping: JT4→classifyState, H→tail, $→prevState, q→latestAsk, K→toolSummary, _→minsInState, z→engine,
//          i04→fastPathClassify, Qi6→heuristicLastLine, o04→buildClassifierUserMsg, a04→parseClassifierJson,
//          yk$→reconcileClassifierResult, r04→classifierPrompt, Au→sideQuery, c04→2000, n04→closingTailShape
```

Key dispatcher facts:

- **Tail truncation to 2000 chars for the LLM** (`c04`, cli_inner_pretty.js:450345) — the LLM gets twice the fast-path's 800-char window, because it has to reason over more context (and the prompt caches the 180-line `r04` so the marginal cost is the tail + completion).
- **Small fast model, thinking disabled** — `pickClassifierModel` (`YT4`) returns `kP()` (the small fast model) when `useSmallFastModel` is set (cli_inner_pretty.js:449838-449839), and `classifierThinkingConfig` (`fT4`) returns `[!1, 0]` (no thinking) when `disableThinking` is set (cli_inner_pretty.js:449841-449843). The classifier is a high-frequency, low-stakes-per-call judgment, so it deliberately uses the cheapest, fastest config.
- **Prompt caching with `cache_control`** (cli_inner_pretty.js:450363) — `r04` is marked cacheable (1h TTL when the `agent_classifier` gate is on, global scope when managed). Since `r04` is identical on every call, the cache hit makes the per-turn cost just the (≤2000-char) tail plus the small JSON completion.
- **One retry on bad JSON** (cli_inner_pretty.js:450352, 450370-450372) — then it gives up and falls to the heuristic.
- **Triple fallback ladder:** fast-path → (if `engine==="heuristic"` or LLM unavailable/invalid) → `heuristicLastLine` (`Qi6`, cli_inner_pretty.js:449286), which just takes the last non-empty line and calls it `working`/`idle`. There is *always* an answer; the classifier never throws.

The `tengu_bg_classify` event (cli_inner_pretty.js:450398-450417) records `path` (preclassify/heuristic/llm/apiError), `branch` (which fast-path rule fired), `closingShape` (from `closingTailShape` `n04`, cli_inner_pretty.js:449153 — one of empty/code-fence/result-line/failed-line/trailing-q/list-or-table/declarative), `prevState`→`newState`, `stateChanged`, `minsInPrevState`, and (for LLM) token counts. This is the dataset that lets the team tune the fast-path coverage versus LLM call rate over time.

---

## 4. The classifier user message — context the model sees

```javascript
// ============================================
// buildClassifierUserMsg - the per-turn user message for the LLM classifier
// Location: cli_inner_pretty.js:449295-449307
// ============================================

// ORIGINAL (for source lookup):
function o04(H) {
  let { tail: $, prev: q, latestAsk: K, toolSummary: _, minsInState: z } = H;
  return `Current state: ${q} (for ${z}m)
Tool calls so far: ${_ || "none"}${K ? `\nUser's most recent ask: "${K}"` : ""}

Assistant message tail (last ${$.length} chars):
${$}`;
}

// READABLE (for understanding):
function buildClassifierUserMsg({ tail, prev, latestAsk, toolSummary, minsInState }) {
  return `Current state: ${prev} (for ${minsInState}m)
Tool calls so far: ${toolSummary || "none"}${latestAsk ? `\nUser's most recent ask: "${latestAsk}"` : ""}

Assistant message tail (last ${tail.length} chars):
${tail}`;
}

// Mapping: o04→buildClassifierUserMsg, $→tail, q→prev, K→latestAsk, _→toolSummary, z→minsInState
```

The classifier is given four context signals beyond the tail:
1. **`prev` + `minsInState`** — the prior state and how long it's been there. This powers the prompt's **Stickiness** rule (cli_inner_pretty.js:449389): "Don't move done→working or failed→working unless the agent explicitly restarted." Without the prior state the LLM couldn't enforce stickiness.
2. **`toolSummary`** — a *summary* of tool calls (not the output). This is the only tool-derived signal, and it's deliberately a short tally/label, not the raw output (which the classifier is forbidden to see). Two summarizers feed it (§5).
3. **`latestAsk`** — the user's most recent real ask, from `findLatestRealUserAsk` (`dd_`, cli_inner_pretty.js:449875), which finds the last non-meta string user turn. This anchors the "is the original ask satisfied?" optional-offers test (cli_inner_pretty.js:449379) on the *actual* ask.

`latestAsk` and the per-session scratch state live in `createClassifierJobState` (`Bd_`, cli_inner_pretty.js:449816): `prevState`, `prevStateSince`, `accumulatedOutputs`, `lastClassifyAt`, `capturedIntent`, `latestAsk`, `lastResult`, etc. — the classifier is stateful per bg session.

---

## 5. Tool-use summary generators

The classifier user message's `toolSummary` field can be produced two ways.

### 5.1 Cheap deterministic tally `ci6` (`summarizeToolCallsDeterministic`)

```javascript
// ============================================
// summarizeToolCallsDeterministic - top-5 tool-name tally (no LLM)
// Location: cli_inner_pretty.js:450322-450334
// ============================================

// ORIGINAL (for source lookup):
function ci6(H) {
  let $ = new Map();
  for (let q of H)
    if (Array.isArray(q.message.content))
      for (let K of q.message.content)
        if (K.type === "tool_use" && !Hc_.has(K.name)) $.set(K.name, ($.get(K.name) ?? 0) + 1);
  return [...$].sort((q, K) => K[1] - q[1]).slice(0, 5)
              .map(([q, K]) => (K > 1 ? `${q}\xD7${K}` : q)).join(", ");
}

// READABLE (for understanding):
function summarizeToolCallsDeterministic(messages) {
  let counts = new Map();
  for (let m of messages)
    if (Array.isArray(m.message.content))
      for (let block of m.message.content)
        if (block.type === "tool_use" && !EXCLUDED_TOOLS.has(block.name))
          counts.set(block.name, (counts.get(block.name) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 5)         // top 5 by frequency
                    .map(([name, n]) => (n > 1 ? `${name}×${n}` : name)).join(", ");
}

// Mapping: ci6→summarizeToolCallsDeterministic, Hc_→EXCLUDED_TOOLS
```

This produces strings like `Read×4, Grep×2, Edit` — a frequency-sorted top-5 tally, excluding the tools in `EXCLUDED_TOOLS` (`Hc_ = new Set([df, rP, MJ])`, cli_inner_pretty.js:450512) so noise tools don't dominate the label. It's used inline in the bg dispatch path at cli_inner_pretty.js:450310-450311 to derive a fallback job name when no assistant text is available.

### 5.2 LLM "git-commit-subject" generator `z04` (`generateToolUseSummary`)

```javascript
// ============================================
// generateToolUseSummary - LLM tool-call → ≤30-char commit-subject label
// Location: cli_inner_pretty.js:447331-447382
// ============================================

// ORIGINAL (for source lookup):
async function z04({ tools: H, signal: $, isNonInteractiveSession: q, lastAssistantText: K }) {
  if (H.length === 0) return null;
  try {
    let _ = H.map((f) => { let O = _04(f.input, 300), M = _04(f.output, 300);
                            return `Tool: ${f.name}\nInput: ${O}\nOutput: ${M}`; }).join(`\n\n`),
      z = K ? `User's intent (from assistant's last message): ${K.slice(0,200)}\n\n` : "",
      Y = (await Uh({ systemPrompt: Z9([Zg_]), userPrompt: `${z}Tools completed:\n\n${_}\n\nLabel:`,
                      signal: $, options: { querySource: "tool_use_summary_generation", enablePromptCaching: !1, … } }))
            .message.content.filter((f) => f.type === "text").map((f) => f.type === "text" ? f.text : "").join("").trim();
    if (!Y) return (t$("summary_tool_use_generate", "empty_response"), null);
    return (SH("summary_tool_use_generate"), Y);
  } catch (_) { if ($.aborted) return null; /* … */ return (uH("summary_tool_use_generate", "api_failed"), null); }
}

// READABLE (for understanding):
async function generateToolUseSummary({ tools, signal, isNonInteractiveSession, lastAssistantText }) {
  if (tools.length === 0) return null;
  try {
    let toolBlock = tools.map((t) => `Tool: ${t.name}\nInput: ${truncateJson(t.input, 300)}\nOutput: ${truncateJson(t.output, 300)}`).join("\n\n"),
        intent = lastAssistantText ? `User's intent (from assistant's last message): ${lastAssistantText.slice(0,200)}\n\n` : "",
        label = (await sideQuery({ systemPrompt: buildSystemPrompt([TOOL_SUMMARY_PROMPT]),
                                   userPrompt: `${intent}Tools completed:\n\n${toolBlock}\n\nLabel:`,
                                   signal, options: { querySource: "tool_use_summary_generation", enablePromptCaching: false, … } }))
                  .message.content.filter((c) => c.type === "text").map((c) => c.text).join("").trim();
    if (!label) { emitFeatureSad("summary_tool_use_generate", "empty_response"); return null; }
    emitFeatureOk("summary_tool_use_generate"); return label;
  } catch (e) { if (signal.aborted) return null; emitFeatureBad("summary_tool_use_generate", "api_failed"); return null; }
}

// Mapping: z04→generateToolUseSummary, Zg_→TOOL_SUMMARY_PROMPT, _04→truncateJson, Uh→sideQuery
```

The system prompt `TOOL_SUMMARY_PROMPT` (`Zg_`, cli_inner_pretty.js:447393-447402) tells the model to "Write a short summary label … truncates around 30 characters, so think git-commit-subject, not sentence. Keep the verb in past tense and the most distinctive noun." Examples: `Searched in auth/`, `Fixed NPE in UserService`, `Created signup endpoint`. Inputs/outputs are truncated to 300 chars by `truncateJson` (`_04`, cli_inner_pretty.js:447384). This is the *mid-turn progress label* that surfaces as the `task_summary` row in the mobile app — distinct from the classifier's `detail` (which is the end-of-turn phone-notification line).

**Why two summarizers:** `ci6` is free (a tally) and feeds the classifier context every turn; `z04` is an LLM call reserved for the human-readable progress row. The classifier reads the cheap one because it just needs a hint of "what kind of work happened," not a polished label.

---

## 6. The goal snapshot and the 2.1.156 scheduled-`/command` fix

### 6.1 `SessionStateTracker` (`nS$`) — where the goal lives

```javascript
// ============================================
// SessionStateTracker - session state + goal snapshot, goal-clear-on-running
// Location: cli_inner_pretty.js:623957-623995
// ============================================

// ORIGINAL (for source lookup):
class nS$ {
  onStateChanged; onMetadataChanged; onInternalMetadataChanged; onPermissionModeChanged;
  currentState = "idle"; hasPendingAction = !1; hasTaskSummary = !1; hasTerminalGoalSnapshot = !1;
  getState() { return this.currentState; }
  notifyStateChanged(H, $) {
    if (((this.currentState = H), this.onStateChanged?.(H, $), H === "requires_action" && $))
      ((this.hasPendingAction = !0), this.onMetadataChanged?.({ pending_action: $ }));
    else if (this.hasPendingAction) ((this.hasPendingAction = !1), this.onMetadataChanged?.({ pending_action: null }));
    if (H === "running") {
      if ((this.onMetadataChanged?.({ post_turn_summary: null }), this.hasTerminalGoalSnapshot))
        ((this.hasTerminalGoalSnapshot = !1), this.onMetadataChanged?.({ goal: null }));   // ← goal-clear-on-running
    }
    if (H === "idle" && this.hasTaskSummary)
      ((this.hasTaskSummary = !1), this.notifyMetadataChanged({ task_summary: null }));
    if (xH(process.env.CLAUDE_CODE_EMIT_SESSION_STATE_EVENTS))
      $E({ type: "system", subtype: "session_state_changed", state: H });
  }
  notifyMetadataChanged(H) {
    if ((this.onMetadataChanged?.(H), "goal" in H)) this.hasTerminalGoalSnapshot = H.goal?.met === !0;   // ← snapshot armed only when met
    if ("task_summary" in H) { if (H.task_summary != null) this.hasTaskSummary = !0; $E({ type:"system", subtype:"task_summary", detail: H.task_summary ?? null }); }
  }
  notifyPermissionModeChanged(H) { this.onPermissionModeChanged?.(H); }
  notifyInternalMetadataChanged(H) { this.onInternalMetadataChanged?.(H); }
}

// READABLE (for understanding):
class SessionStateTracker {
  currentState = "idle"; hasPendingAction = false; hasTaskSummary = false; hasTerminalGoalSnapshot = false;
  notifyStateChanged(state, details) {
    this.currentState = state; this.onStateChanged?.(state, details);
    if (state === "requires_action" && details) { this.hasPendingAction = true; this.onMetadataChanged?.({ pending_action: details }); }
    else if (this.hasPendingAction) { this.hasPendingAction = false; this.onMetadataChanged?.({ pending_action: null }); }
    if (state === "running") {
      this.onMetadataChanged?.({ post_turn_summary: null });
      if (this.hasTerminalGoalSnapshot) { this.hasTerminalGoalSnapshot = false; this.onMetadataChanged?.({ goal: null }); }
    }
    if (state === "idle" && this.hasTaskSummary) { this.hasTaskSummary = false; this.notifyMetadataChanged({ task_summary: null }); }
    if (isEnvTruthy(process.env.CLAUDE_CODE_EMIT_SESSION_STATE_EVENTS)) enqueueSdkEvent({ type:"system", subtype:"session_state_changed", state });
  }
  notifyMetadataChanged(meta) {
    this.onMetadataChanged?.(meta);
    if ("goal" in meta) this.hasTerminalGoalSnapshot = meta.goal?.met === true;   // only a MET goal arms the snapshot
    if ("task_summary" in meta) { if (meta.task_summary != null) this.hasTaskSummary = true; enqueueSdkEvent({ type:"system", subtype:"task_summary", detail: meta.task_summary ?? null }); }
  }
}

// Mapping: nS$→SessionStateTracker, H→state, $→details, $E→enqueueSdkEvent, xH→isEnvTruthy
```

The crucial fields/logic:
- `hasTerminalGoalSnapshot` is armed (`= true`) **only when a `goal` metadata write has `met === true`** (cli_inner_pretty.js:623983). It marks "the phone is currently showing a *Goal achieved* card."
- On transition to `running`, if `hasTerminalGoalSnapshot` is set, the tracker pushes `{ goal: null }` to clear that card (cli_inner_pretty.js:623973-623975). The intent: when a new turn starts, a stale "Goal achieved" banner should disappear.

### 6.2 The goal lifecycle: set, evaluate, condition-match

A `/goal` registers a session-scoped Stop hook and stamps `activeGoal` into app state:

```javascript
// ============================================
// addGoalStopHook - /goal sets a Stop-hook + activeGoal snapshot
// Location: cli_inner_pretty.js:447943-447957
// ============================================

// ORIGINAL (for source lookup):
function j$$(H, $) {
  let q = Si6(); if (q !== null) return (t$("goal_set", q.code), q.message);
  let K = E$();
  for (let z of M$$($.getAppState(), K)) $.sessionHooksRegistry.remove(K, "Stop", z);
  $.sessionHooksRegistry.add(K, "Stop", "", { type: "prompt", prompt: H });
  let _ = { condition: H, iterations: 0, setAt: Date.now(), tokensAtStart: UD() };
  return ($.setAppState((z) => ({ ...z, activeGoal: _ })),
          $.applyMessageOp({ type: "append", messages: [L04(!1, H)] }),
          d("tengu_stop_hook_added", { promptLength: H.length, via: "goal" }), SH("goal_set"), null);
}

// READABLE (for understanding):
function addGoalStopHook(condition, ctx) {
  let gate = goalGateCheck(); if (gate !== null) { emitFeatureSad("goal_set", gate.code); return gate.message; }
  let sessionId = currentSessionId();
  for (let h of goalStopHooks(ctx.getAppState(), sessionId)) ctx.sessionHooksRegistry.remove(sessionId, "Stop", h);  // replace
  ctx.sessionHooksRegistry.add(sessionId, "Stop", "", { type: "prompt", prompt: condition });
  let activeGoal = { condition, iterations: 0, setAt: Date.now(), tokensAtStart: tokenCount() };
  ctx.setAppState((s) => ({ ...s, activeGoal }));
  ctx.applyMessageOp({ type: "append", messages: [goalSentinelMessage(false, condition)] });   // L04 sentinel
  return null;
}

// Mapping: j$$→addGoalStopHook, H→condition, $→ctx, Si6→goalGateCheck, E$→currentSessionId,
//          M$$→goalStopHooks, UD→tokenCount, L04→goalSentinelMessage
```

`activeGoal` carries `{ condition, iterations, setAt, tokensAtStart }`. The **`condition` string is the join key** between the Stop hook and the goal snapshot. When the goal evaluator runs at end-of-turn (in the Stop-hook handler around cli_inner_pretty.js:450762-450852), it matches the *fired hook's prompt* against `activeGoal.condition`:

```javascript
// at cli_inner_pretty.js:450788-450834 — goal MET path (Stop hook success)
let Q = v(x.hook);                                 // the fired Stop hook
if (U.hookEvent === "Stop" && Q) {
  z.sessionHooksRegistry.remove(E$(), "Stop", Q);
  let g = z.getAppState().activeGoal;
  if (g?.condition === Q.prompt) {                 // ← condition match: this hook IS the active goal
    /* … iterations/duration/tokens … */
    yield { type: "active_goal", value: void 0 };  // clear activeGoal
    if (x.impossible) /* goal_failed */ else {
      yield VK({ type: "goal_status", met: !0, condition: Q.prompt, … });
      z.sessionState?.notifyMetadataChanged({ goal: { condition: Q.prompt, set_at: g.setAt, iterations: l, last_reason: null, met: !0 } });  // ← arms hasTerminalGoalSnapshot
    }
  }
}

// at cli_inner_pretty.js:450845-450853 — goal NOT-YET-MET path (Stop hook blocked continuation)
if (x.blockingError) {
  let Q = v(x.hook), g = z.getAppState().activeGoal;
  if (Q && g?.condition === Q.prompt)
    yield { type: "active_goal", value: { ...g, iterations: g.iterations + 1, lastReason: x.stopReason } },
    yield VK({ type: "goal_status", met: !1, condition: Q.prompt, reason: x.stopReason });
}
```

So the goal display on the phone is driven entirely by `activeGoal.condition === firedHook.prompt`. A *met* goal triggers `notifyMetadataChanged({ goal: { …, met: true } })` (cli_inner_pretty.js:450832-450834), which arms `hasTerminalGoalSnapshot` (cli_inner_pretty.js:623983).

### 6.3 The 2.1.156 regression and fix — "classifier losing the goal when a scheduled `/command` fires"

**The symptom (CHANGELOG.md:33):** A bg session has an active `/goal`. A scheduled `/command` (a cron/`/loop` job — the `/loop` prompt instructs "Then immediately execute the parsed prompt now … If it's a slash command, invoke it via the Skill tool," cli_inner_pretty.js:602498/602542) fires. The user's goal disappears from the job list / phone display.

**The mechanism (verified):**

```
/goal set → activeGoal = { condition:"all tests green", … }
          → (later) goal met → notifyMetadataChanged({goal:{…,met:true}})
                             → hasTerminalGoalSnapshot = true   (623983)   phone shows "Goal achieved"
   ── cron fires a scheduled /command ──
          → new turn begins → session transitions to "running"
          → notifyStateChanged("running")                       (623973)
              → hasTerminalGoalSnapshot? yes → push {goal:null}  (623975)   phone goal card CLEARED
```

The intent of the `running`-clears-snapshot logic (cli_inner_pretty.js:623975) is benign: when the user *themselves* starts a new turn, a stale "Goal achieved" card should clear. The regression is that a **cron-injected command turn** is indistinguishable from a user turn at the `notifyStateChanged` level — it also flips the session to `running`, so it clears the goal card even though the user never asked to start new work and the goal context should persist for the phone display.

**What guards goal persistence (verified):**
1. **`hasTerminalGoalSnapshot` only arms on `met === true`** (cli_inner_pretty.js:623983). An *in-progress* goal (`met:false`, the `notifyMetadataChanged` path at cli_inner_pretty.js:564881-564890 with `met:!1`) does **not** arm the snapshot, so a running goal is never auto-cleared by a state transition — only a *completed* goal card is.
2. **`activeGoal` is the durable source of truth**, separate from the phone-display snapshot. It is mirrored to phone metadata on any change via the app-state diff at cli_inner_pretty.js:564879-564891, and re-derived on resume by `restoreGoalFromTranscript` (`Zyz`, cli_inner_pretty.js:598870) / `findGoalToRestore` (`Rf9`, cli_inner_pretty.js:598861), which walk the transcript's last non-sentinel `goal_status` attachment and re-stamp `activeGoal` if the goal isn't met/failed (cli_inner_pretty.js:598866). So even if the phone card is cleared, the goal itself survives in `activeGoal` and the transcript.
3. **The goal evaluator defers while background work runs** (cli_inner_pretty.js:450754-450760): if `activeGoal` is set and `Ck$(tasks) || $V8(tasks)` (background shells / delegated subagents still running), the Stop hook is removed for *this* tick and evaluation is deferred — "evaluation deferred — background work still running" (cli_inner_pretty.js:450759). This is the separate 2.1.156 fix "/goal evaluator firing while background shells or delegated subagents are still running" (CHANGELOG.md:290), and it prevents a cron turn from prematurely marking the goal met/failed mid-background-work.

**The fix site (medium confidence / partially unverified):** The CHANGELOG line 33 is a *classifier* fix, and the verified mechanism that loses the *phone goal card* is the `running`-clears-`hasTerminalGoalSnapshot` branch (cli_inner_pretty.js:623973-623975). The guard that makes a *met* goal the only thing that arms the snapshot (cli_inner_pretty.js:623983) and the resume-time re-derivation from `activeGoal.condition`/transcript (cli_inner_pretty.js:598861-598881) are the persistence guards. **What I could not pin to a single line** is the exact code that distinguishes a *cron-injected* command turn from a user turn so that the goal snapshot is preserved across the scheduled fire — the scheduled-command injection path (the cron tick that enqueues the `/command` and drives the `running` transition) is not isolated to one site in this region. **The scheduled-command-to-`running` interaction is therefore marked (unverified)** as to its precise patch; the four candidate touch points are (a) suppressing the goal-clear when the turn originates from a cron, (b) not arming/re-arming `hasTerminalGoalSnapshot` for cron turns, (c) re-deriving the goal from `activeGoal.condition` after the cron turn, and (d) the `restoreGoalFromTranscript` recovery. Confidence is **high** that the loss flows through `notifyStateChanged("running")` → `{goal:null}` (623975) and that `activeGoal.condition` (cli_inner_pretty.js:450792/450850/447949) is the join key that persistence relies on; **medium** on which of those four sites carries the actual 2.1.156 patch.

---

## 7. End-to-end: one bg turn through the classifier

```
bg worker finishes an assistant turn
        │
        ▼  assistant message text (no tool output)
   tail = lastAssistantText
        │
        ▼  classifyState(tail, prevState, latestAsk, toolSummary, minsInState, engine)   JT4 450335
   fastPathClassify(tail)  i04 449166
        │
   ┌────┴───────────────────────────────────────────────┐
   │ match?                                              │
   ▼ yes (preclassify)                ▼ no               │
 {branch,state,tempo,detail}   engine==="heuristic"?     │
   │                            ▼ yes        ▼ no         │
   │                       Qi6 last-line   LLM side-query │
   │                       working/idle    system: r04 (cached)  450363
   │                                       user:  o04(tail,prev,toolSummary,latestAsk)  450346
   │                                       small fast model, no thinking  449836-449843
   │                                       parse a04 → retry once on bad JSON  450352
   │                                       fallback Qi6 if still invalid  450395
   └────────────────────────┬────────────────────────────┘
                            ▼  reconcileClassifierResult yk$ 449325 (validate vs prev, force idle if terminal)
              { state, detail, tempo, needs?, output:{result?} }
                            │
        ┌───────────────────┼───────────────────────────────┐
        ▼                   ▼                                ▼
 write state.json   timeline.jsonl append           tengu_bg_classify telemetry  450398
 (drives job list)  (state/detail/text history)     (path, branch, closingShape, stateChanged, tokens)
        │
        ▼  state === "blocked" / tempo === "blocked"  →  PHONE PUSH NOTIFICATION
```

---

## 8. Cross-validation against v2.1.88 and version history

**Confidence: high. The four-state classifier prompt and the regex battery are NEW post-2.1.88; the goal snapshot in the state tracker is NEW; the session-state tracker itself has a clear precursor.**

- **Session-state tracker — precursor exists (refactored).** v2.1.88's `src/utils/sessionState.ts` is a module-level singleton (`notifySessionStateChanged` / `notifySessionMetadataChanged`) over the same `SessionState = 'idle'|'running'|'requires_action'` union with `pending_action`, `post_turn_summary`, and `task_summary` clearing (sessionState.ts:1, 85-134). v2.1.156's `nS$` (cli_inner_pretty.js:623957) is that same logic *promoted to a class* with one substantive addition: the `goal` field, `hasTerminalGoalSnapshot`, the `met === true` arming (cli_inner_pretty.js:623983), and the `running`-clears-goal branch (cli_inner_pretty.js:623973-623975). The 2.1.88 tracker has **no** `goal`, **no** `hasTerminalGoalSnapshot`, and **no** goal-clear-on-running. So the entire goal-snapshot mechanism — and therefore the bug class this doc describes — is post-2.1.88.
- **The four-state bg classifier (`r04`, the fast-path battery, `JT4`) is NEW.** Grepping the 2.1.88 source for the prompt's distinctive phrases ("walked away", "tail of what", "A classifier reads only your message text", "phone notification") finds **nothing** in the classifier sense. There is no `i04`-equivalent regex battery, no `tengu_bg_classify`, no `agent_classifier` query source. The 2.1.88 background subsystem (`src/utils/background/remote/`) only handed sessions to a daemon; it did not classify per-turn state for phone notifications.
- **The 2.1.142 precursor is the *display* layer, not the classifier.** `../../../claude_code_v_2.1.142/analyze/36_background_agents/completed_vs_working.md` documents `classifyJobState` (`byH`) projecting the worker's already-decided `state`/`tempo`/`inFlight` onto four *display buckets* (`review`/`blocked`/`working`/`done`). That is downstream of *this* doc: `JT4` decides `state`/`tempo`/`detail` from text; `byH` then renders them. The `working`/`blocked`/`done`/`failed` vocabulary is shared, but the 2.1.142 doc never covers *how* `state` is derived from message text — that is the new material here.
- **The `IV6` writer prompt is NEW.** The built-in `claude` catch-all agent with its narrate/restate/`result:`/`needs input:`/`failed:` coaching (cli_inner_pretty.js:236184) has no 2.1.88 equivalent; the agent-definition system and the classifier conventions co-evolved with FleetView.

---

## 9. Key design takeaways

1. **A cooperative text protocol, not a parser.** The writer prompt `IV6` and reader prompt `r04` form a contract: the agent emits machine-readable markers (`result:`/`needs input:`/`failed:`) inside human prose, and the classifier reads only that prose. This keeps the classifier cheap (text only, small model, no thinking) and reliable (explicit markers are ground truth).
2. **Two-tier classification optimizes the common case.** The regex fast-path (`i04`) handles ~18 unambiguous tail shapes deterministically and sub-millisecond; only genuinely ambiguous closings reach the LLM. `tengu_bg_classify` telemetry tracks the split so the fast-path coverage can be tuned over time.
3. **The notification cost model drives the prompt's hardest rules.** A false `blocked` is an annoying ping; a false `done` leaves work idle. The optional-offers test ("is the original ask still satisfied if the user ignores the closing question?") and the who-acts-next waiting discriminator both exist to minimize *both* error modes, not just one.
4. **Code-fence awareness is pervasive.** Every fast-path branch is gated by `!isInsideCodeFence(...)` because agents paste shell commands and diffs containing the very trigger words the classifier hunts for. The fence detector (`KPH`) is the unsung hero of precision.
5. **The goal snapshot is display state derived from durable `activeGoal`.** The phone "Goal achieved" card (`hasTerminalGoalSnapshot`) is cleared on a `running` transition, but the goal itself lives in `activeGoal.condition` and the transcript's `goal_status` attachments, and is re-derivable on resume. The 2.1.156 fix hardens this against cron-injected command turns that flip the session to `running` without the user starting new work.

---

## Cross-references

- Shell-exec bg sessions and the `qKH`/`IV6` template adapter: `shell_exec_sessions.md` in this module.
- Display-bucket projection downstream of this classifier (`classifyJobState` `byH`): `../../../claude_code_v_2.1.142/analyze/36_background_agents/completed_vs_working.md`.
- Worker state machine / retire / respawn (which consumes the `state`/`tempo` this classifier writes): `worker_state_machine.md`, `daemon_lifecycle.md` in this module.
- Stop/SubagentStop hook `background_tasks`/`session_crons` input (the cron-turn surface): `../../../claude_code_v_2.1.142/analyze/11_hooks/` and CHANGELOG.md:210.
