# Manual-invocation gating: the window's policy oscillation on model-initiated review work

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). **Baseline:** the same path under `versions/2.1.193/` (718,679 lines), tagged `(193)`.
Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md).

Bullets covered here:

| Release | Bullet |
|---|---|
| `.202` | Changed `/review <pr>` back to a fast single-pass review; use `/code-review <level> <pr#>` for the multi-agent review at a chosen effort level |
| `.215` | Claude no longer runs the `/verify` and `/code-review` skills on its own; invoke them with `/verify` or `/code-review` when you want them |
| `.218` | Changed `/deep-research` to start only when invoked manually; Claude no longer launches it on its own |
| `.196` | Fixed `/deep-research` misreporting verifier failures as "all claims refuted" instead of `unverified` |
| `.207` | Fixed Deep research runs labeling every Fetch-phase agent "unknown" — chips now show the source hostname |

---

## 1. The oscillation, as a table

The 2.1.193 → 2.1.220 window contains a coherent policy arc that no single bullet states: **expensive,
model-initiated, multi-agent work was progressively restrained.** Reading the five relevant releases
in order makes the arc visible, and the code shows each step used a *different* mechanism.

| # | Release | What changed | Direction | Mechanism in 2.1.220 | Anchor | Delta proof |
|---|---|---|---|---|---|---|
| 0 | ≤ `.193` (baseline) | `/review <pr>` reuses the `medium`-effort `/code-review` cell: 8 finder angles via the `Agent` tool, a verify phase, a JSON findings array | *expansion* (pre-window) | 193 only: `/review` prompt embeds `${Hzn}`, `effort: "medium"` | `:538524 (193)`, `:538539 (193)` | — |
| 1 | `.202` | `/review <pr>` reverted to a plain single-pass prose review; the multi-agent path is only reachable by explicitly typing `/code-review <level> <pr#>` | **restrain** | prompt body replaced with static prose; `effort` field deleted | `:497600-497628`, cf. `:538510-538538 (193)` | `single-pass` 220=9 / 193=2 |
| 2 | `.206` | per-model prompt cells for `claude-opus-4-8` at every effort level | *quality, not policy* | `cMr` table | `:774655-774678` | `o48-low-v1` 220=2 / 193=0 |
| 3 | `.215` | Claude no longer runs `/verify` and `/code-review` on its own | **restrain** | `disableModelInvocation: !0` added to both command objects | `:789551` (`verify`), `:774588` (`code-review`) | `disableModelInvocation: !0` 220=13 / 193=8; neither command carries it in 193 |
| 4 | `.218` | `/code-review` runs as a background subagent | *relocate* (softens #3: manual, but no longer costs conversation context) | `getContext → "fork"` + `qTo` background default | `:774594`, `:342396` | `Running in the background as` 220=2 / 193=0 |
| 5 | `.218` | `/deep-research` starts only when invoked manually | **restrain** | workflow registered with `{ disableModelInvocation: MJy }` **plus** an Opus-5-only system-prompt clause | `:424879`, `:508111-508115` | 193 registers with no third argument (`:444099 (193)`); `tengu_sorrel_avocet` 220=1 / 193=0 |

### The five *distinct* mechanisms, and why there are five

| Mechanism | Where it applies | Reversible without a release? |
|---|---|---|
| delete the prompt that asks for fan-out (`.202`) | one command's prompt body | no |
| `disableModelInvocation: !0` on a command object (`.215`) | slash commands the `Skill` tool can reach | no |
| `{ disableModelInvocation: fn }` on a workflow registration (`.218`) | bundled workflows | **yes** — `MJy` reads a gate |
| a system-prompt restraint clause (`.218`) | whichever models carry `opus_5_prompt_bundle` | **yes** — gate + client-data override |
| `shouldRouteToWorkflow`'s remote gate (pre-existing) | the multi-agent code-review path | **yes** — `tengu_review_workflow_routing`, default false |

**Key insight:** the two `.218` restraints are both *remotely reversible* while the `.215` one is not.
That is the tell for how confident the team was in each. `.215` is a settled policy decision baked
into a command object; `.218`'s deep-research restraint ships with an escape hatch
(`tengu_sorrel_avocet`) so it can be un-restrained server-side if the restraint proves too blunt.

**Why restrain at all?** All three restrained things spend real, visible money or context:
`/code-review` at `xhigh` fans out to 6 finder agents plus one verifier per code location plus a
sweep plus a synthesizer; `/deep-research` spends `1 + angles + sources + claims×3 + 1` agent calls
(its own accounting, `:424879`) with `MAX_FETCH = 15` and `VOTES_PER_CLAIM = 3`; `ultra` bills usage
credits. A model that reaches for these on its own initiative turns a cheap question into an
expensive one without the user ever choosing to.

**Why not just make them cheaper?** `.196` and `.202` show they tried: the cleanup-finder merge cut
~25 % of the review's tokens, and `/review` was reverted to a single pass. Restraint came *after*
optimisation, in the same window. The sequence #1 → #3 → #5 is optimise, then gate.

---

## 2. `.202` — `/review` reverted to a single pass

### 2.1 The diff

The `/review` command object is otherwise identical between the builds; two things changed.

```javascript
// ============================================
// reviewPullRequestCommand - /review, after the .202 revert
// Location: cli_inner_pretty.js:497636-497649  (2.1.193 twin at :538533-538548)
// ============================================

// ORIGINAL (for source lookup):
nR_ = {
  type: "prompt",
  name: "review",
  description: "Review a GitHub pull request; for your working diff use /code-review",
  argumentHint: "[pr number]",
  progressMessage: "reviewing pull request",
  contentLength: 0,
  source: "builtin",
  async getPromptForCommand(e) {
    let [t = "", ...r] = e.trim().split(/\s+/), n = t.replaceAll("`", "").replace(/^#/, "");
    return [{ type: "text", text: n ? rR_(n, r.join(" ")) : tR_ }];
  },
};

// 2.1.193 (for contrast) — the only structural difference is one field:
//   oRf = { type: "prompt", name: "review", …, effort: "medium", progressMessage: … }   // :538539 (193)

// Mapping: nR_→reviewPullRequestCommand, rR_→buildReviewPrompt (:497600),
//          tR_→REVIEW_NO_ARG_PROMPT (:497599); 193 twins oRf / rRf / nRf
```

The prompt body is where the revert lives. Diffing `:497599-497628` against `:538509-538538 (193)`
gives exactly three hunks:

| 2.1.193 | 2.1.220 |
|---|---|
| `When an **angle** needs surrounding code, Read the files in this checkout…` | `When **you** need surrounding code, Read the files in this checkout…` |
| `${Hzn}` + `## Present the review` | seven lines of static prose: *"Analyze the changes and provide a thorough code review that includes: an overview of what the PR does / analysis of code quality and style / specific suggestions for improvements / any potential issues or risks"* |
| `After the final phase, do not reply with the raw JSON findings array. Present a readable review: a 2-3 sentence overview…, then the surviving findings most-severe first as \`file:line — summary (failure scenario)\`, or a note that nothing survived verification.` | `Keep your review concise but thorough. Focus on: Code correctness / Following project conventions / Performance implications / Test coverage / Security considerations` + `Format your review with clear sections and bullet points.` |

`Hzn` is the giveaway. In 2.1.193 it is **the same string** used as the `medium` entry of the
`/code-review` effort table (`Ktm = { low: hpl, medium: Hzn, high: ypl, xhigh: bpl, max: Spl }`,
`:650897 (193)`), and it opens with:

```text
`medium effort → 3+5 angles × 6 candidates → 1-vote verify → ≤8 findings`
…
## Phase 1 — Find candidates (3 correctness angles + 3 cleanup angles + 1 altitude angle + 1 conventions angle, up to 6 each)
Run **8 independent finder angles** via the Agent tool.
```

So `/review <pr>` in 2.1.193 **was** the multi-agent review, sharing a prompt with `/code-review
medium`. The `.202` change severs that share. The word "angle" — the multi-agent vocabulary — is
scrubbed even from the surrounding sentence, which is why the "When an angle needs…" hunk exists.

Removing `effort: "medium"` matters too: a command's `effort` field raises the API reasoning effort
for the turn. A single-pass prose review does not need it, and leaving it would have kept `/review`
expensive after making it shallow — the worst combination.

### 2.2 What "single-pass" means in 2.1.220, and why the literal count exploded

`single-pass` is **220=9 / 193=2**, but only one of the nine hits is the `/review` revert (`:424033`,
the workflow's "State clearly in your summary that this was a single-pass review done without…"
clause). Three others (`:423847`, `:423879`, `:423916`) are a *different* feature that shipped in the
same window: an `Agent`-tool-unavailable fallback inside every `/code-review` effort cell.

```javascript
// :423844-423856  the medium cell, now a function of (reportFindingsAvailable, agentToolAvailable)
ZId = (e, t = !0) => {
  if (!t)
    return cNs({
      tag: `medium effort → ${qo} tool unavailable → single-pass inline → ≤8 findings`,
      leadIn: `You are reviewing for **precision** at medium effort: …`,
      angleCount: 8, angles: _Ro, cap: 8, output: e,
    });
  return `\`medium effort → 3+5 angles \xD7 6 candidates → 1-vote verify → ≤8 findings\` …`;
};
```

`cNs` (`:423628`) is the single-pass cell builder; the effort cells now degrade gracefully when the
session has no `Agent` tool instead of instructing the model to call a tool it does not have.
`agent_tool_available` is one of the seven new fields on `tengu_code_review_routed` (`:774418`).

**Two more of the nine hits are `/simplify`** (`:788479`, `:788509`) — the same fallback pattern
applied to the sibling cleanup skill — and the last two are unrelated prose in the bundled
`claude-api` skill (`:796735`, `:797223`). Anyone anchoring the `.202` bullet on the literal count
alone would attribute the `/code-review` fallback work to the `/review` revert. **The correct anchor
for `.202` is the absence of `${Hzn}` from `:497600-497628`, not any `single-pass` occurrence.**

---

## 3. `.215` — `disableModelInvocation` on `/verify` and `/code-review`

### 3.1 The exact set difference

`disableModelInvocation: !0` is **220=13 / 193=8**, and the two sets are strictly nested:

| Command | 193 line | 220 line |
|---|---|---|
| `statusline` | `:561676 (193)` | `:502931` |
| `team-onboarding` | `:574039 (193)` | `:504205` |
| `insights` | `:581409 (193)` | `:507144` |
| `batch` | `:650657 (193)` | `:773602` |
| `debug` | `:652147 (193)` | `:777559` |
| `design` | `:652341 (193)` | `:777755` |
| `design-sync` | `:660250 (193)` | `:785667` |
| `run-skill-generator` | `:673858 (193)` | `:801693` |
| `__remote-workflow` | — | `:502383` |
| `workflow-launch-exec` | — | `:502651` |
| **`code-review`** (`REe`) | — | **`:774588`** |
| `doctor` | — | `:785867` |
| **`verify`** (`Mse`) | — | **`:789551`** |

Five additions; two of them are precisely the two commands `.215` names. (`__remote-workflow` and
`workflow-launch-exec` are internal plumbing commands, and `doctor` is a diagnostic — all three are
"the model should never call this" for the same reason, not for the cost reason.)

`Mse = "verify"` (`:318664`) and `REe = "code-review"` (`:318660`) are declared in the same skill-id block at
`:318657-318668`, and they are the two members of `E$y = new Set([Mse, REe])` (`:340271`) — the set
consumed by `Spr(name)` (`:340263`, `return E$y.has(e) ? "/" + e : null`), which is how other prompts
learn to say "`/verify`" or "`/code-review`" rather than describing them. The pairing is structural,
not coincidental.

### 3.2 How the flag is enforced

The command-object field is normalised into the skill descriptor by `otr()`
(`:270599-270601`, `:438447`/`:438469`), and the same frontmatter pair (`disable-model-invocation` /
`user-invocable`, `disable-model-invocation` 220=11 / 193=7) covers filesystem skills. The scoping
pass noted the count went 7 → 11, consistent with more skills switching to user-invocable-only.

`userInvocable: !0` combined with `disableModelInvocation: !0` is the "human types it, model cannot"
combination, and it composes with the stacked-command parser: `tpd` refuses to stack any command with
`p.userInvocable === !1` (`:343862`) — the *other* direction of the same policy.

### 3.3 Why this is `DELTA`, not `NET_NEW`

The **mechanism** is 2.1.193's (8 commands already used it). The **application to these two commands**
is `.215`'s. Anyone writing this up as "2.1.215 introduced model-invocation gating" would be wrong;
the honest statement is "2.1.215 applied an existing gate to the two review skills".

---

## 4. `.218` — `/deep-research` starts only when invoked manually

> **Round-3 correction and deep dive.** An earlier revision of this section said "Deep research is not
> a slash command; it is a bundled workflow". The second half is right, the first half is not: every
> non-`hidden` registry row is *projected into* a `type: "prompt"` slash command by
> `createWorkflowCommand` (`Lep` `:506513-506557`), which is exactly why `/deep-research` is typable
> and why it carries the `[dynamic workflow]` menu tag (`:744013`, `:744020`). The command's body
> does not run anything — it emits text instructing the model to call
> `Workflow({name:'deep-research', args})` (`:506528-506556`). That is what makes the restraint
> below necessary on the *command projection* rather than in the script.
>
> Full analysis of the harness and its runtime now lives in
> [`../42_workflow/deep_research_harness.md`](../42_workflow/deep_research_harness.md) and
> [`../42_workflow/deep_research_runtime_contract.md`](../42_workflow/deep_research_runtime_contract.md)
> (the latter's §4 enumerates all three enforcement layers of this bullet). This section remains the
> owner of the changelog-bullet routing.

Deep research is a bundled **workflow**, registered by pushing a descriptor onto a module-level array:

```javascript
// registerBundledWorkflow  :385327-385335
function kxo(e, t, r) {
  SSd.push({ source: "built-in", ...t, script: e, hidden: r?.hidden, disableModelInvocation: r?.disableModelInvocation });
}
```

The third parameter is the options bag, and this is the entire `.218` change:

```javascript
// ============================================
// registerDeepResearchWorkflow - registration tail, and its new gate
// Location: cli_inner_pretty.js:424877-424879 (call), :424445-424448 (gate)
// ============================================

// ORIGINAL (for source lookup):
    { name: uRd, description: dRd, whenToUse: pRd, phases: fRd },
    { disableModelInvocation: MJy },
  );
}
…
function MJy() {
  if (Ke(PJy, !1)) return !1;
  return !0;
}
var PJy = "tengu_sorrel_avocet";

// 2.1.193 (for contrast), :444099 (193):
//     { name: wpl, description: Cpl, whenToUse: Ipl, phases: xpl },
//   );                                    <- no third argument at all

// READABLE (for understanding):
registerBundledWorkflow(deepResearchScript,
  { name: "deep-research", description: …, whenToUse: …, phases: … },
  { disableModelInvocation: isDeepResearchModelInvocationDisabled });
…
function isDeepResearchModelInvocationDisabled() {
  if (getFeatureValue("tengu_sorrel_avocet", false)) return false;   // gate ON  -> model MAY invoke
  return true;                                                       // default  -> model may NOT
}

// Mapping: kxo→registerBundledWorkflow, MJy→isDeepResearchModelInvocationDisabled,
//          PJy→DEEP_RESEARCH_MODEL_INVOCATION_GATE, Ke→getFeatureValue, SSd→BUNDLED_WORKFLOWS (:385340)
```

Note the **inverted polarity**: the gate default is `false`, and `false` means *restrained*. Turning
the gate on re-enables model invocation. Written the other way round (gate = "disable it"), the
shipped default would have been permissive, and a gate outage would silently unrestrain the feature.
As written, an unreachable gate service fails **closed**. `tengu_sorrel_avocet` is **220=1 / 193=0**.

For contrast, the sibling `code-review` workflow registers with `{ hidden: !0 }` (`:424406`) and no
`disableModelInvocation` — because the *slash command* in front of it already carries
`disableModelInvocation: !0`, and the workflow is only ever reached through that command's own
`Workflow({name: "code-review", …})` instruction (`:774429`). Two workflows, two different places to
put the same policy, chosen by which surface the model can actually reach.

### 4.1 The second, model-specific enforcement

The hard gate stops the *tool*. A second, softer restraint stops the *intent*, and it is scoped to one
model family:

```javascript
// ============================================
// AGENT_AND_WORKFLOW_RESTRAINT_CLAUSE and its injection site
// Location: cli_inner_pretty.js:508111-508115 (text), :507513 (injection)
// ============================================

// ORIGINAL (for source lookup):
Kep = [
  "Do not call the AgentTool unless the user requested it",
  "Do not use workflows or deep-research unless the user requested it",
].join(`
`);
…
  if (ZXn(e)) return (O("tengu_heron_brook_applied", { len: Kep.length, fromClientData: !1 }), Kep);
  return null;
…
function ZXn(e) {                                   // :118700-118704
  if (e === void 0) return !1;
  if (M$(lo(e), "opus_5_prompt_bundle") !== !0) return !1;
  return !Ke(Qcg, !1);
}

// READABLE (for understanding):
AGENT_AND_WORKFLOW_RESTRAINT_CLAUSE = [
  "Do not call the AgentTool unless the user requested it",
  "Do not use workflows or deep-research unless the user requested it",
].join("\n");
…
function getExtraSystemGuidance(model) {
  …                                                              // 1. per-org client data
  …                                                              // 2. tengu_heron_brook gate string
  if (usesOpus5PromptBundle(model))                              // 3. NEW: model-capability default
    return (logEvent("tengu_heron_brook_applied", { len: CLAUSE.length, fromClientData: false }), CLAUSE);
  return null;
}
function usesOpus5PromptBundle(model) {
  if (model === undefined) return false;
  if (modelHasCapability(normalizeModelId(model), "opus_5_prompt_bundle") !== true) return false;
  return !getFeatureValue(OPUS5_PROMPT_BUNDLE_KILL_GATE, false);
}

// Mapping: Kep→AGENT_AND_WORKFLOW_RESTRAINT_CLAUSE, ZXn→usesOpus5PromptBundle,
//          M$→modelHasCapability, lo→normalizeModelId, Ke→getFeatureValue
```

`Do not call the AgentTool unless the user requested it` is **220=1 / 193=0**. 2.1.193's version of
the same function (`C3f`, `:592544-592555 (193)`) has only the two override paths and returns `null` —
there is no default clause.

**Why gate it on a model capability rather than shipping it for everyone?** `opus_5_prompt_bundle` is
a capability token in the model catalogue (`:14395`, inside the `claude-opus-5` entry; listed in `_GROUND_TRUTH` §1 as 220-only). Prompt
text is model-tuned: a restraint clause that reins in an eagerly-agentic model can suppress useful
behaviour on a less eager one. Attaching the clause to a *catalogue capability* rather than a model-id
list means the next model that needs it opts in by declaring the token — the same data-driven pattern
the catalogue rewrite established. And the kill gate `Qcg = "tengu_fennel_godwit"` (`:118750`) gives a per-org escape.

**So `.218`'s deep-research bullet has two independent implementations**, one hard and one soft, and
the soft one also covers the `Agent` tool, which no bullet mentions at all.

---

## 5. `.196` — the deep-research verifier's three-way outcome

**What it does:** distinguishes "the verifier panel adjudicated this claim and rejected it" from "the
verifier panel never ran".

**The 2.1.193 bug, in two lines** (`:444004`, `:444012 (193)`):

```javascript
const survives = valid.length >= REFUTATIONS_REQUIRED && refuted < REFUTATIONS_REQUIRED
…
const killed = voted.filter(c => !c.survives)          // <- everything that did not survive is "killed"
```

`survives` was already correct and already careful — 193's comment explains that too many abstentions
must not pass into the report, *"otherwise all-abstain → refuted=0 → false survive"*. The bug is the
**complement**. `killed = !survives` folds two very different populations together:

- claims with ≥2 refute votes out of 3 (genuinely refuted), and
- claims where the verifier agents *errored* and fewer than 2 valid votes came back.

With every verifier rate-limited, `voted.length` claims all land in `killed`, and the report reads
`All N claims refuted by adversarial verification. Research inconclusive — sources may be low-quality
or claims overstated.` (`:444018 (193)`) — a research conclusion drawn from an infrastructure outage.

**The 2.1.220 fix:**

```javascript
// ============================================
// deep-research verify fold - three outcomes instead of two
// Location: cli_inner_pretty.js:424757-424794
// ============================================

// ORIGINAL (for source lookup):
    ).then(verdicts => {
      // A vote can be null (user-skip or agent error) — treat as no vote cast.
      // Three outcomes (go/ccissue/69883 — infra failure must not read as "refuted"):
      //   survives  — quorum of valid votes AND fewer than REFUTATIONS_REQUIRED refuting
      //   isRefuted — ≥REFUTATIONS_REQUIRED refute votes (adjudicated against on merit)
      //   otherwise — unverified: too few valid votes to adjudicate (verifier agents errored)
      const valid = verdicts.filter(Boolean)
      const refuted = valid.filter(v => v.refuted).length
      const errored = VOTES_PER_CLAIM - valid.length
      const survives = valid.length >= REFUTATIONS_REQUIRED && refuted < REFUTATIONS_REQUIRED
      const isRefuted = refuted >= REFUTATIONS_REQUIRED
      const mark = survives ? "✓" : isRefuted ? "✗" : "?"
      …
      return { ...claim, verdicts: valid, refutedVotes: refuted, erroredVotes: errored, survives, isRefuted }
    })
…
const confirmed  = voted.filter(c => c.survives)
const killed     = voted.filter(c => c.isRefuted)
const unverified = voted.filter(c => !c.survives && !c.isRefuted)
…
if (confirmed.length === 0) {
  let summary
  if (killed.length === 0 && unverified.length > 0) {
    summary = "Could not verify any claims — all " + unverified.length + " verifier panels failed (likely rate-limiting or API errors). This is an infrastructure failure, not a research finding. Raw extracted claims returned below; retry or verify manually."
  } else if (unverified.length > 0) {
    summary = killed.length + " claims refuted by adversarial verification; " + unverified.length + " could not be verified (verifier agents failed). No claims survived. Research inconclusive."
  } else {
    summary = "All " + killed.length + " claims refuted by adversarial verification. Research inconclusive — sources may be low-quality or claims overstated."
  }
  return { question: QUESTION, summary, findings: [], refuted: killed.map(toRefuted), unverified: unverified.map(toUnverified), … }
}

// READABLE: this is workflow source, not obfuscated. `toUnverified` (:424781) carries
// { claim, erroredVotes, validVotes, source } so the caller can see HOW MANY votes came back.
```

**How it works:**

1. `isRefuted` becomes a *positive* predicate (`refuted >= REFUTATIONS_REQUIRED`), not the negation of
   `survives`. Two independent booleans, three states.
2. `errored = VOTES_PER_CLAIM - valid.length` is retained per claim, so the report can say *how* the
   panel failed. 193 discarded it after using it once in a log line (where it was called
   `abstained` — the rename to `errored` is itself the conceptual fix: an abstention is a vote, an
   error is not).
3. The log mark becomes ternary — `✓` / `✗` / `?` — so a live run shows the third state too.
4. The zero-confirmed return branches three ways, and the *pure-infrastructure* case says so in
   plain words and returns the raw claims for manual checking.
5. The result gains an `unverified` array and `stats.unverified`, alongside the existing `refuted`.

**Why the three-way split rather than retrying:** a retry inside the workflow would multiply the agent
budget under exactly the conditions (rate-limiting) that caused the failure. Reporting honestly and
telling the user to retry pushes the decision to the human, who can see whether the whole session is
degraded.

**Key insight:** the failure mode was not in the vote arithmetic — that was already right and already
commented. It was in the *complement* of a correct predicate. `killed = !survives` is the kind of line
that reads as obviously correct and encodes a false dichotomy. The fix is four extra lines and one
renamed variable.

`claims refuted` is **220=2 / 193=1**; the second occurrence is the new mixed-outcome branch. The
inline comment cites an internal issue (`go/ccissue/69883`), which is the strongest possible evidence
that this specific bullet maps to this specific hunk.

---

## 6. `.207` — Fetch-phase chips show the hostname, not "unknown"

**The 2.1.193 code, in full** (`:443938-443941 (193)`):

```javascript
let host = "unknown"
try { host = new URL(source.url).hostname.replace(/^www\./, "") } catch {}
return agent(FETCH_PROMPT(source, searchResult.angle), { label: "fetch:" + host, phase: "Fetch", … })
```

That looks correct — and it is, *in Node*. The bug is that the workflow script runs inside the
Workflow runtime's sandboxed realm, where `URL` is not necessarily the global constructor the author
expected; the `catch {}` then swallows the failure and every chip renders `fetch:unknown`. The 2.1.220
comment says so explicitly, in passing: *"an IDN homograph like Cyrillic `аmazon.com`, which WebFetch
resolves via **punycode unavailable in this realm**"* (`:424690-424691`).

**The 2.1.220 replacement** does not use `URL` at all — it regex-captures the host and then spends
25 lines making sure the captured string is safe to print:

```javascript
// ============================================
// deep-research Fetch chip label - regex host capture with a strict trust ladder
// Location: cli_inner_pretty.js:424593-424604 (helpers), :424696-424703 (use)
// ============================================

// ORIGINAL (for source lookup):
const LABEL_CAP = 40
const LABEL_STRIP = /[\\x00-\\x1f\\x7f-\\x9f\\u200b-\\u200f\\u202a-\\u202e\\u2066-\\u2069\\ufeff\\u0022\\u201c-\\u201f\\u2033\\u2036\\u275d\\u275e\\u301d\\u301e\\uff02]/g
const STRICT_HOST = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/
const stripLabelChars = s => String(s).replace(LABEL_STRIP, "")
const quotedLabel = s => {
  const cps = Array.from(stripLabelChars(s))
  return '"' + cps.slice(0, LABEL_CAP).join("").trim() + (cps.length > LABEL_CAP ? "…" : "") + '"'
}
…
const capturedHost = String(source.url).match(URL_HOST_PATTERN)?.[1] ?? ""
const host = capturedHost.toLowerCase()
const cleanHost = stripLabelChars(host)
const isCleanBareHost = cleanHost === host && host !== "" && Array.from(host).length <= LABEL_CAP && STRICT_HOST.test(host)
const hostLabel = cleanHost === "" ? "" : isCleanBareHost ? host : quotedLabel(host)
const sourceLabel = hostLabel || (stripLabelChars(source.title).trim() && quotedLabel(source.title)) || "unknown"
return agent(FETCH_PROMPT(source, searchResult.angle), { label: "fetch:" + sourceLabel, phase: "Fetch", schema: EXTRACT_SCHEMA })

// READABLE: workflow source, not obfuscated. The ladder is:
//   bare host (trusted assertion)  ->  "quoted host"  ->  "quoted title"  ->  "unknown"
```

**The four conditions for a bare `fetch:<host>` label**, all required (`:424699`):

1. `cleanHost === host` — sanitisation changed nothing. The comment gives the attack:
   *"deleting a control char would turn `exa<ctrl>mple.com` into `example.com`, which is not the real
   host"*.
2. `host !== ""`.
3. `Array.from(host).length <= LABEL_CAP` — never truncate, because *"a bare prefix could show a
   trusted-looking domain while the real host differs"*.
4. `STRICT_HOST.test(host)` — dot-separated LDH labels only, which rejects non-ASCII IDN homographs.

Anything failing any of the four routes through `quotedLabel`, which strips, caps at 40 **code
points** (`Array.from`, so a surrogate pair is never split), and appends `…` **inside** the quotes so
a truncated value cannot pass for a complete one.

`LABEL_STRIP` deletes three families, and the comment (`:424580-424592`) names why each is there:
C0/C1 controls (the ANSI/CSI introducers — terminal escape injection), Unicode bidi overrides and
zero-width format chars (`U+200B-200F`, `U+202A-202E`, `U+2066-2069`, `U+FEFF` — visual reordering),
and **the entire double-quote lookalike family** (`"`, `U+201C-201F`, `U+2033`, `U+2036`, `U+275D`,
`U+275E`, `U+301D`, `U+301E`, `U+FF02`) *"any of which would visually close the quoted fallback early
and forge host-shaped text after it"*.

That last one is the subtle part and worth restating: the *untrusted* rendering is `"…"`, so a value
containing a quote-lookalike could terminate the quoted region and then print
`amazon.com` outside it, producing a chip that looks like a trusted bare-host label. The mitigation is
not escaping — it is deletion of every glyph that could read as a closing quote.

**One deliberate non-sanitisation:** `normURL` (the dedup key) keeps the raw capture, *"dedup keys are
never rendered, and stripping there could collide distinct URLs"* (`:424590-424592`). Sanitising a
comparison key is a correctness bug; sanitising a display string is a security fix. The code separates
them.

**Verdict.** The chip-label bug is real and the fix is here, but this is a `DELTA`, not a `NET_NEW`:
the `"unknown"` fallback survives as the last rung of the ladder (`:424701`). It now only fires when
the URL has no capturable host **and** the title is empty after stripping — which is the correct
residual meaning of "unknown". The scoping pass's proposed anchor (`deep-research: Scope → …`, 1/1)
is the workflow header comment and proves nothing; the real anchors are `STRICT_HOST` /
`stripLabelChars` / `quotedLabel`, all 220-only inside a script string.

This also sits alongside `.216`'s permission-preview bullet (*"not neutralizing bidirectional-override,
zero-width, and look-alike quote characters"*) — the same three character families, the same window,
a different surface. Whoever wrote one wrote the other.

---

## 7. Verdict table

| Bullet | Verdict | Proof |
|---|---|---|
| `.202` `/review` back to single-pass | **DELTA — prompt body replaced** | `:497600-497628` vs `:538510-538538 (193)`; `${Hzn}` (= `Ktm.medium`, `:650897 (193)`) removed; `effort: "medium"` field deleted. `single-pass` 220=9/193=2 is a **decoy** — 6 of the 9 hits belong to the Agent-unavailable cell fallback and `/simplify` |
| `.215` `/verify` + `/code-review` not model-invocable | **DELTA — existing flag, new subjects** | `disableModelInvocation: !0` 220=13/193=8; the five new subjects are `__remote-workflow` `:502383`, `workflow-launch-exec` `:502651`, `code-review` `:774588`, `doctor` `:785867`, `verify` `:789551` |
| `.218` `/deep-research` manual only | **NET_NEW ×2** | registration third argument `:424879` (absent at `:444099 (193)`); `MJy` `:424445`; `tengu_sorrel_avocet` 220=1/193=0; **plus** `Kep` `:508111` + `ZXn` `:118700`, `Do not call the AgentTool…` 220=1/193=0 |
| `.196` deep-research verifier `unverified` | **NET_NEW** | `:424757-424794` vs `:443995-444023 (193)`; `killed = voted.filter(c => c.isRefuted)` replaces `!c.survives`; `claims refuted` 220=2/193=1; internal issue ref `go/ccissue/69883` in the comment |
| `.207` Fetch chips show hostnames | **DELTA** | `:424593-424604` + `:424696-424703` vs `:443938-443941 (193)`; `URL` constructor replaced by regex capture + a four-condition trust ladder; `"unknown"` survives as the residual rung |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_code_review.md](../00_overview/symbol_additions_v2_1_220_code_review.md).

Key functions and constants in this document:
- `reviewPullRequestCommand` (`nR_`) - the `/review` command object after the `.202` revert, `:497636`
- `buildReviewPrompt` (`rR_`) / `REVIEW_NO_ARG_PROMPT` (`tR_`) - `:497600` / `:497599`
- `registerBundledWorkflow` (`kxo`) - the 3-arg registrar with `hidden` / `disableModelInvocation`, `:385327`
- `isDeepResearchModelInvocationDisabled` (`MJy`) - fail-closed gate wrapper, `:424445`
- `DEEP_RESEARCH_MODEL_INVOCATION_GATE` (`PJy`) - `"tengu_sorrel_avocet"`, `:424888`
- `AGENT_AND_WORKFLOW_RESTRAINT_CLAUSE` (`Kep`) - the two-line system-prompt restraint, `:508111`
- `usesOpus5PromptBundle` (`ZXn`) - capability + kill-gate predicate for that clause, `:118700`
- `slashNameForReviewSkill` (`Spr`) / `REVIEW_SKILL_NAMES` (`E$y`) - `:340263` / `:340271`
- `VERIFY_SKILL_NAME` (`Mse`) / `CODE_REVIEW_SKILL_NAME` (`REe`) - `:318664` / `:318660`
- `buildSinglePassReviewCell` (`cNs`) - the Agent-tool-unavailable fallback builder, `:423628`
- `mediumEffortCell` (`ZId`) - `(reportFindings, agentToolAvailable) => prompt`, `:423844`
