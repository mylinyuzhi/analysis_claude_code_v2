# Multi-Angle Finder/Verifier Sweep Algorithm by Effort

> Module 45 — `/code-review` and `/simplify` prompt construction in Claude Code v2.1.156.
> This doc covers the **prompt-template assembly machine**: how one `git diff` is fed
> through N independent "finder" angles, deduped and put through a 3-state verifier, then
> swept for gaps, with the count of angles / candidates / findings and the verifier bias
> all chosen by *effort level*. It also covers the sibling `/simplify` command (cleanup-only)
> and the cloud "ultra" bridge.

## Related Symbols

> Symbol mappings live in the central index — do not duplicate tables here:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent tool `sq`)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (effort levels)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (slash commands)

Key symbols in this document:

Prompt fragments (the building blocks, all in one `var` cluster):
- `gatherDiffPhase` (`dq$`) — "## Phase 0 — Gather the diff" shared preamble (cli_inner_pretty.js:600275)
- `reuseAngleBody` (`BI8`) — Reuse cleanup angle ("re-implements something the codebase already has") (cli_inner_pretty.js:600277)
- `simplificationAngle` (`cq$`) — "### Simplification" cleanup angle (cli_inner_pretty.js:600281)
- `efficiencyAngle` (`lq$`) — "### Efficiency" cleanup angle (cli_inner_pretty.js:600287)
- `altitudeAngle` (`nq$`) — "### Altitude" cleanup angle (cli_inner_pretty.js:600293)
- `correctnessAnglesABC` (`p1q`) — Angles A/B/C (line scan, removed-behavior, cross-file tracer) (cli_inner_pretty.js:600300)
- `correctnessAnglesDE` (`nyz`) — A/B/C + Angle D (language-pitfall) + Angle E (wrapper/proxy) (cli_inner_pretty.js:600421)
- `reuseAngleIntro` (`U1q`) — "### Reuse" header wrapping `BI8` (cli_inner_pretty.js:600438)
- `cleanupOutputNote` (`F1q`) — cleanup/altitude reuse the file/line/summary shape AND the rule "correctness bugs always outrank cleanup/altitude when the output cap forces a cut" (cli_inner_pretty.js:600325)
- `verifyPhasePrecision` (`af9`) — "## Phase 2 — Verify (1-vote, 3-state)" precision-biased (cli_inner_pretty.js:600442)
- `verifyPhaseRecall` (`iyz`) — "## Phase 2 — Verify (1-vote, recall-biased)" (cli_inner_pretty.js:600458)
- `sweepPhase` (`ryz`) — "## Phase 3 — Sweep for gaps" (one more finder) (cli_inner_pretty.js:600329)
- `buildFindingsOutputSchema` (`Q1q`) — output JSON-array spec, parameterized by max-finding cap (cli_inner_pretty.js:600342)

Per-level prompt templates:
- `lowEffortPrompt` (`sf9`) — low effort: 1 diff pass, no verify, ≤4 findings (cli_inner_pretty.js:600360)
- `mediumEffortPrompt` (`tf9`) — medium: 3+4 angles × 6, precision verify, ≤8 (cli_inner_pretty.js:600478)
- `highEffortPrompt` (`ef9`) — high: 3+4 angles × 6, recall verify, ≤10 (cli_inner_pretty.js:600502)
- `buildHighRecallEffortPrompt` (`HO9`) — factory for xhigh/max: 5+4 angles × 8 + sweep, ≤15 (cli_inner_pretty.js:600389)
- `xhighEffortPrompt` (`$O9`) — `HO9("xhigh")` (cli_inner_pretty.js:600527)
- `maxEffortPrompt` (`qO9`) — `HO9("max")` (cli_inner_pretty.js:600528)
- `effortPromptMap` (`oyz`) — `{low,medium,high,xhigh,max}` → template (cli_inner_pretty.js:600659)

Command wiring:
- `CODE_REVIEW_NAME` (`Y18`) — `"code-review"` command name constant (cli_inner_pretty.js:211646)
- `parseCodeReviewArgs` (`_O9`) — parse first token / `--fix` / `--comment` / `ultra` (cli_inner_pretty.js:600530)
- `getCodeReviewDescription` (`eyz`) — `/code-review` description string (cli_inner_pretty.js:600558)
- `getCodeReviewArgumentHint` (`Hhz`) — `[low|medium|...|ultra] [--fix] [--comment] [<target>]` (cli_inner_pretty.js:600561)
- `buildCodeReviewPrompt` (`$hz`) — assembles final prompt from level + flags + target (cli_inner_pretty.js:600564)
- `buildEffortFallbackPreamble` (`qhz`) — banner text when cloud ultra unavailable (cli_inner_pretty.js:600578)
- `registerCodeReview` (`zO9`) — registers the `code-review` command via `bA` (cli_inner_pretty.js:600612)
- `COMMENT_SUFFIX_BLOCK` (`ayz`) — "## Posting to GitHub (--comment)" appendix (cli_inner_pretty.js:600626)
- `FIX_SUFFIX_BLOCK` (`syz`) — "## Applying fixes (--fix)" appendix (cli_inner_pretty.js:600638)
- `EFFORT_LEVELS_LOCAL` (`pI8`) — the list of selectable levels (= `dN`) (cli_inner_pretty.js:600660)
- `EFFORT_PREFIX_RE` (`tyz`) — fuzzy match for "looked like a level" (cli_inner_pretty.js:600661)
- `registerSimplify` (`vO9`) — registers the `simplify` command (cli_inner_pretty.js:601350)
- `SIMPLIFY_PROMPT` (`Ehz`) — `/simplify` prompt body (4 cleanup agents) (cli_inner_pretty.js:601378)

Shared infra:
- `AGENT_TOOL_NAME` (`sq`) — `"Agent"`; the tool finders/verifiers are dispatched through (cli_inner_pretty.js:185637)
- `EFFORT_LEVELS` (`dN`) — `["low","medium","high","xhigh","max"]` (cli_inner_pretty.js:185009)
- `EFFORT_ALIASES` (`s$7`) — `{ med: "medium" }` (cli_inner_pretty.js:185010)
- `normalizeEffortToken` (`_kH`) — string → canonical level or `undefined` (cli_inner_pretty.js:184865)
- `clampEffortLevel` (`E1H`) — coerce any value to a valid level (default "high") (cli_inner_pretty.js:184960)
- `resolveEffortForModel` (`or`) — model + requested → effective level, with clamp (cli_inner_pretty.js:184909)
- `modelSupportsMax` (`ow$`) — does this model allow `max`? (cli_inner_pretty.js:184816)
- `modelSupportsXhigh` (`ycH`) — does this model allow `xhigh`? (cli_inner_pretty.js:184834)
- `tokenizeFlags` (`BN8`) — split first token / `--flag`s / remaining args (cli_inner_pretty.js:502812)
- `isCloudReviewAvailable` (`WF`) — is the cloud ultra path usable here? (cli_inner_pretty.js:502747)
- `resolveUltraScope` (`re6`) — resolve PR#/branch scope for cloud review (cli_inner_pretty.js:502833)
- `fetchUltrareviewPreflight` (`WU4`) — `/v1/ultrareview/preflight` billing/eligibility check (cli_inner_pretty.js:502758)
- `registerBundledPromptCommand` (`bA`) — generic bundled prompt-command registrar (cli_inner_pretty.js:524187)

---

## TL;DR

`/code-review` is not a single prompt. It is a **prompt compiler**: a handful of reusable
text fragments (one per review "angle", one per phase) are concatenated in different
combinations to produce five distinct review playbooks, one per effort level. The effort
level controls four knobs at once:

1. **How many finder angles** run (1 inline pass → 7 → 9).
2. **How many candidates** each angle may surface (none → 6 → 8).
3. **Whether there is a verify pass**, and if so whether it is **precision-biased**
   ("when in doubt, REFUTE") or **recall-biased** ("PLAUSIBLE by default").
4. **Whether a final gap-sweep** runs, and the **cap** on emitted findings (4 → 8 → 10 → 15).

Each finder and verifier is a **separate subagent** dispatched through the `Agent` tool
(`sq`, cli_inner_pretty.js:185637). The orchestrating Claude only deduplicates, sequences
the phases, and renders the JSON output. `/simplify` is the same machinery stripped down to
the three cleanup angles + altitude, with bug-hunting explicitly removed. `ultra` bridges to
a cloud multi-agent review (`re6`/`WU4`).

This whole architecture is **NEW after v2.1.88** (high confidence). In 2.1.88 `/review` was a
one-shot "run `gh pr diff` and write a prose review" command and `/ultrareview` was the only
multi-agent path (it ran in the cloud). The angle/verify/sweep effort machine did not exist —
see [Cross-validation](#cross-validation-vs-v2188) below.

---

## The fragment palette (the compiler's "tokens")

All review text lives in one big `var` cluster at cli_inner_pretty.js:600266-600418, plus a
second cluster that fills in the late-bound fragments inside the `KO9` initializer
(cli_inner_pretty.js:600419-600529). Reading them as a palette makes the rest obvious.

### Shared preamble — `gatherDiffPhase` (`dq$`)

```javascript
// ============================================
// gatherDiffPhase - "Phase 0 — Gather the diff": how every (non-low) level acquires the diff
// Location: cli_inner_pretty.js:600275-600276
// ============================================

// ORIGINAL (for source lookup):
var dq$ =
    "## Phase 0 — Gather the diff\n\nRun `git diff @{upstream}...HEAD` (or `git diff main...HEAD` / `git diff HEAD~1`\nif there's no upstream) to get the unified diff under review. If there are\nuncommitted changes, or the range diff is empty, also run `git diff HEAD` and\ninclude the working-tree changes in scope — the review often runs before the\ncommit. If a PR number, branch name, or file path was passed as an argument,\nreview that target instead. Treat this diff as the review scope.\n",

// READABLE (for understanding):
const gatherDiffPhase =
  "## Phase 0 — Gather the diff\n\n" +
  "Run `git diff @{upstream}...HEAD` (or `git diff main...HEAD` / `git diff HEAD~1`\n" +
  "if there's no upstream) ... If there are uncommitted changes, or the range diff\n" +
  "is empty, also run `git diff HEAD` and include the working-tree changes ...\n" +
  "If a PR number, branch name, or file path was passed as an argument, review that\n" +
  "target instead. Treat this diff as the review scope.\n";

// Mapping: dq$→gatherDiffPhase
```

Notice the deliberate "review often runs before the commit" line: the diff acquisition is
designed to catch **working-tree** changes, not just committed ones. This is why both the
range diff *and* `git diff HEAD` are requested. The low-effort template inlines its own
copy of this instruction instead of referencing `dq$` (see below).

### Correctness angles A/B/C — `correctnessAnglesABC` (`p1q`)

```javascript
// ============================================
// correctnessAnglesABC - The 3 baseline bug-finding angles used at medium/high
// Location: cli_inner_pretty.js:600300-600322
// ============================================

// ORIGINAL (for source lookup):
var p1q = `### Angle A — line-by-line diff scan

Read every hunk in the diff, line by line. Then Read the enclosing function for
each hunk — bugs in unchanged lines of a touched function are in scope ...
Look for inverted/wrong conditions, off-by-one, null/undefined deref, missing \`await\`,
falsy-zero checks, wrong-variable copy-paste, error swallowed in catch, unescaped regex metachars.

### Angle B — removed-behavior auditor
For every line the diff DELETES or replaces, name the invariant or behavior it
enforced, then search the new code for where that invariant is re-established ...

### Angle C — cross-file tracer
For each function the diff changes, find its callers (Grep for the symbol) and
check whether the change breaks any call site ... Also check callees ...`;

// READABLE (for understanding):
const correctnessAnglesABC = [
  "Angle A — line-by-line diff scan: read each hunk + enclosing function; classic local bugs",
  "Angle B — removed-behavior auditor: every deleted line had an invariant; find where it's re-established or flag it",
  "Angle C — cross-file tracer: changed functions → check callers AND callees for broken contracts",
].join("\n\n");

// Mapping: p1q→correctnessAnglesABC
```

Each "angle" is a *role* given to a separate finder subagent. The key design choice is that
the three angles attack the diff from **orthogonal directions** — one stares at the changed
lines (A), one stares at the *deleted* lines (B), one zooms out to the call graph (C). This
diversity is what justifies running them as independent agents rather than one big prompt:
**a single agent tends to fixate on the most obvious angle and stop.**

### Correctness angles D/E (only at xhigh/max) — `correctnessAnglesDE` (`nyz`)

`nyz` is **late-bound** (declared empty at cli_inner_pretty.js:600323, filled at 600421). It
prepends A/B/C and adds two more specialized angles:

```javascript
// ============================================
// correctnessAnglesDE - A/B/C + Angle D (language pitfalls) + Angle E (wrapper/proxy correctness)
// Location: cli_inner_pretty.js:600421-600437
// ============================================

// ORIGINAL (for source lookup):
((nyz = `${p1q}
### Angle D — language-pitfall specialist
Scan for the classic pitfalls of the diff's language/framework — for example:
JS falsy-zero, \`==\` coercion, closure-captured loop var; Python mutable default
args, late-binding closures; Go nil-map write, range-var capture; SQL injection;
timezone/DST drift; float equality. Flag any instance the diff introduces.

### Angle E — wrapper/proxy correctness
When the PR adds or modifies a type that wraps another (cache, proxy, decorator,
adapter): check that every method routes to the wrapped instance and not back
through a registry/session/global ... Also check that the wrapper forwards all
the methods the callers actually use.
`), ... )

// READABLE (for understanding):
correctnessAnglesDE = correctnessAnglesABC + "\n" +
  "Angle D — language-pitfall specialist: per-language footguns (JS falsy-zero/==, Py mutable defaults, Go range capture, SQLi, TZ, float eq)\n" +
  "Angle E — wrapper/proxy correctness: delegate routing, re-entrancy/recursion, method-forwarding completeness";

// Mapping: nyz→correctnessAnglesDE, p1q→correctnessAnglesABC
```

So the "5 correctness angles" at xhigh/max = A,B,C (from `p1q`) + D,E (added here).

### The four cleanup angles — `reuseAngleBody` (`BI8`), `simplificationAngle` (`cq$`), `efficiencyAngle` (`lq$`), `altitudeAngle` (`nq$`)

These four (cli_inner_pretty.js:600277-600299) are the *quality* angles, shared verbatim by
`/code-review` (as the "+4" half of "3+4 angles") and by `/simplify` (which uses *only* these
four). `reuseAngleBody` (`BI8`) is the raw body; at code-review time it gets wrapped by
`reuseAngleIntro` (`U1q`, cli_inner_pretty.js:600438) which prepends the "### Reuse" header and
the sentence "The angles above hunt for bugs; this one and the next two hunt for cleanup".

```javascript
// ============================================
// reuseAngleBody / simplificationAngle / efficiencyAngle / altitudeAngle - the 4 cleanup angles
// Location: cli_inner_pretty.js:600277-600299
// ============================================

// ORIGINAL (for source lookup):
  BI8 = `Flag new code that re-implements something the codebase
already has — Grep shared/utility modules and files adjacent to the change,
and name the existing helper to call instead.
`,
  cq$ = `### Simplification

Flag unnecessary complexity the diff adds: redundant or derivable state,
copy-paste with slight variation, deep nesting, dead code left behind. Name
the simpler form that does the same job.
`,
  lq$ = `### Efficiency

Flag wasted work the diff introduces: redundant computation or repeated I/O,
independent operations run sequentially, blocking work added to startup or
hot paths. Name the cheaper alternative.
`,
  nq$ = `### Altitude

Check that each change is implemented at the right depth, not as a fragile
bandaid. Special cases layered on shared infrastructure are a sign the fix
isn't deep enough — prefer generalizing the underlying mechanism over adding
special cases.
`;

// READABLE (for understanding):
const reuseAngleBody     = "Reuse: flag re-implementations of existing helpers; Grep utils/adjacent files; name the helper to call instead.";
const simplificationAngle = "Simplification: redundant/derivable state, copy-paste variants, deep nesting, dead code → name the simpler form.";
const efficiencyAngle     = "Efficiency: redundant compute/IO, serial independent ops, startup/hot-path blocking → name the cheaper alternative.";
const altitudeAngle       = "Altitude: is the fix at the right depth? special cases on shared infra ⇒ generalize the mechanism instead of bandaging.";

// Mapping: BI8→reuseAngleBody, cq$→simplificationAngle, lq$→efficiencyAngle, nq$→altitudeAngle
```

### The two verify phases — precision vs recall

The verifier is **always 1-vote, 3-state** (CONFIRMED / PLAUSIBLE / REFUTED). What changes
with effort is the *prior*:

- `verifyPhasePrecision` (`af9`, cli_inner_pretty.js:600442-600457) — used at **medium**.
  Neutral framing: CONFIRMED needs named inputs + wrong output; PLAUSIBLE = real mechanism,
  uncertain trigger; REFUTED = factually wrong or guarded. Keep CONFIRMED+PLAUSIBLE.
- `verifyPhaseRecall` (`iyz`, cli_inner_pretty.js:600458-600477) — used at **high/xhigh/max**.
  Same three states, but the instruction flips the default: **"PLAUSIBLE by default — do not
  refute a candidate for being speculative ... when the state is realistic"**, and REFUTED is
  only allowed when "constructible from the code" (quote the actual line, prove impossibility,
  cite the guard, or pure style). This is the single most important effort knob: at high+ the
  verifier is told to *let borderline findings through*.

```javascript
// ============================================
// verifyPhaseRecall - recall-biased verifier (high/xhigh/max): PLAUSIBLE by default
// Location: cli_inner_pretty.js:600458-600477
// ============================================

// ORIGINAL (for source lookup):
    (iyz = `## Phase 2 — Verify (1-vote, recall-biased)

Dedup near-duplicates (same defect, same location, same reason → keep one). For
each remaining candidate, run **one verifier** via the ${sq} tool:
give it the diff, the relevant file(s), and the candidate; it returns exactly
one of **CONFIRMED / PLAUSIBLE / REFUTED**.

**PLAUSIBLE by default** — do not refute a candidate for being "speculative" or
"depends on runtime state" when the state is realistic: concurrency races,
nil/undefined on a rare-but-reachable path ... falsy-zero treated as missing,
off-by-one on a boundary the code does not exclude, retry storms / partial
failures, regex/allowlist that lost an anchor. These are PLAUSIBLE.

**REFUTED** only when constructible from the code: factually wrong (quote the
actual line); provably impossible ...; already handled in this diff (cite the
guard); or pure style with no observable effect.

Keep **CONFIRMED and PLAUSIBLE**. Drop REFUTED.
`), ... )

// READABLE (for understanding):
verifyPhaseRecall = `## Phase 2 — Verify (1-vote, recall-biased)
Dedup near-dups. Run one verifier subagent via the Agent tool per candidate → CONFIRMED/PLAUSIBLE/REFUTED.
Bias: PLAUSIBLE by default (realistic race/nil/falsy-zero/off-by-one/retry/regex-anchor states are NOT refutable as "speculative").
REFUTED only if provable from code. Keep CONFIRMED+PLAUSIBLE.`;

// Mapping: iyz→verifyPhaseRecall, ${sq}→Agent tool name
```

### The gap sweep — `sweepPhase` (`ryz`)

Only xhigh/max use Phase 3. After verification, **one more finder** runs as a fresh reviewer
who is *handed the already-verified list* and told to look ONLY for what the first pass
missed — moved/extracted code that dropped a guard, "second-tier footguns" (dataclass default
evaluated once, `hash()` non-determinism, lock-scope shrink, predicate methods with side
effects), setup/teardown asymmetry in tests, flipped config defaults. Caps at **8 additional
candidates** and explicitly says "if nothing new, return an empty sweep — do not pad"
(cli_inner_pretty.js:600329-600341).

### The output contract — `buildFindingsOutputSchema` (`Q1q`)

`Q1q` is a **function** of the finding cap `H` (cli_inner_pretty.js:600342-600359). It emits
the JSON-array schema (`file`, `line`, `summary`, `failure_scenario`), the rule "ranked
most-severe first", and the truncation rule "if more than `${H}` survive, keep the `${H}` most
severe". The cap is the per-level number: `Q1q(8)` for medium, `Q1q(10)` for high, `Q1q(15)`
for xhigh/max. (Low uses a different, plain-text one-line-per-finding output, capped at 4 —
it does not call `Q1q`.)

`F1q` (`cleanupOutputNote`, cli_inner_pretty.js:600325-600326) does **two** things, both
load-bearing:

1. **Output shape for cleanups.** Cleanup and altitude findings reuse the same
   `file`/`line`/`summary` shape, but their `failure_scenario` must state a concrete *cost*
   ("what is duplicated, wasted, or harder to maintain") rather than a crash — because a
   cleanup never crashes, it just costs.
2. **A cross-type priority rule under the cap.** Verbatim: *"Correctness bugs always outrank
   cleanup and altitude findings when the output cap forces a cut."* This couples F1q to
   `Q1q(n)`: since the cap truncates to the `n` *most-severe survivors* (the
   "keep the `${H}` most severe" rule above), F1q guarantees the cap is spent on **bugs
   first**. So the four cleanup angles (Reuse/Simplification/Efficiency/Altitude) can never
   crowd a verified correctness finding out of a capped result — a noisy cleanup pass cannot
   push a real bug below the cut line. This is the *why* behind running cleanup angles in the
   same pipeline as correctness angles without diluting the bug output: the priority rule, not
   a separate cap, keeps the two finding types from competing.

---

## How the five effort levels are compiled

This is the heart of the module. Each level is a different concatenation of the palette above.

### Low — `lowEffortPrompt` (`sf9`)

```javascript
// ============================================
// lowEffortPrompt - low effort: 1 diff pass, no subagents, no verify, ≤4 findings
// Location: cli_inner_pretty.js:600360-600386
// ============================================

// ORIGINAL (for source lookup):
  sf9 = `\`low effort → 1 diff pass → no verify → ≤4 findings\`

## Turn 1 — read
One tool call: read the unified diff (\`git diff @{upstream}...HEAD; git diff HEAD\`
... or the target passed as an argument). Skip test/fixture
hunks (\`test/\`, \`spec/\`, \`__tests__/\`, ...) — ...
No subagents, no full-file reads.

## Turn 2 — findings
Flag runtime-correctness bugs visible from the hunk alone: inverted/wrong
condition, off-by-one, null/undefined deref ... removed guard, falsy-zero check,
missing \`await\`, wrong-variable copy-paste, error swallowed in a catch ...
Also flag ... new code that duplicates an existing helper visible in the diff
context, and dead code the diff leaves behind.

Do **not** flag style, naming, perf, missing tests, or anything outside the hunk.
Output at most **4 findings**, most-severe first, one line each:
\`path/to/file.ext:123 — what's wrong and the concrete failure\`. If nothing
qualifies, output exactly \`(none)\`.`;

// READABLE (for understanding):
const lowEffortPrompt =
  "low effort → 1 diff pass → no verify → ≤4 findings\n" +
  "Turn 1: one tool call to read the diff (skip test/fixture hunks); no subagents, no full-file reads.\n" +
  "Turn 2: flag hunk-visible correctness bugs + obvious dup/dead-code; no style/perf/tests/out-of-hunk.\n" +
  "Output ≤4 one-line findings, severe-first, or '(none)'.";

// Mapping: sf9→lowEffortPrompt
```

**Low is the only level that does no subagent work at all.** It is a two-turn inline pass:
read the diff in one tool call, then emit at most 4 hunk-local findings. It even inlines its
own diff command instead of reusing `dq$`, and it deliberately *skips test/fixture hunks* and
forbids full-file reads — this is the "cheap and quiet" tier.

### Medium — `mediumEffortPrompt` (`tf9`) — precision

Medium is the first level with the full Phase pipeline. It is **precision-biased**:

```
mediumEffortPrompt =
  "`medium effort → 3+4 angles × 6 candidates → 1-vote verify → ≤8 findings`"
  + "...reviewing for precision: every finding should be one a maintainer would act on."
  + gatherDiffPhase            // dq$
  + "Phase 1 — 7 finder angles (3 correctness + 3 cleanup + 1 altitude), ≤6 each, via Agent tool"
  + correctnessAnglesABC       // p1q  (A,B,C)
  + reuseAngleIntro            // U1q  (Reuse header + BI8)
  + simplificationAngle        // cq$
  + efficiencyAngle            // lq$
  + altitudeAngle              // nq$
  + cleanupOutputNote          // F1q (output shape + correctness>cleanup ranking-under-cap rule)
  + "Pass every candidate with a nameable failure scenario through ..."
  + verifyPhasePrecision       // af9  (neutral 3-state)
  + buildFindingsOutputSchema(8)   // Q1q(8)
```

Verbatim assembly at cli_inner_pretty.js:600478-600501. Note "3+4 angles" = 3 correctness
(A,B,C) + 4 cleanup (Reuse, Simplification, Efficiency, Altitude). The header text says
"3 correctness angles + 3 cleanup angles + 1 altitude angle" — they count Altitude separately
from the other three cleanup angles, but the body still emits all four. Each angle: ≤6
candidates.

### High — `highEffortPrompt` (`ef9`) — same angles, recall verifier

High is **byte-for-byte identical to medium's angle set** (still `p1q` + the four cleanup
fragments, still ≤6 candidates) with exactly two differences:

1. The framing flips from "precision" to "recall" ("catch every real bug a careful reviewer
   would catch in one sitting ... Err on the side of surfacing").
2. The verify phase swaps `verifyPhasePrecision` (`af9`) → `verifyPhaseRecall` (`iyz`).
3. The cap rises 8 → 10 via `buildFindingsOutputSchema(10)` (`Q1q(10)`).

Verbatim at cli_inner_pretty.js:600502-600526. This is the cleanest illustration of the design:
**the *finders* are the same; only the *verifier's prior* and the *cap* change.** Going from
medium to high does not look harder; it looks *less skeptical*.

### xhigh / max — `buildHighRecallEffortPrompt` (`HO9`)

xhigh and max share one factory. `HO9(level)` returns the prompt; `$O9 = HO9("xhigh")` and
`qO9 = HO9("max")` (cli_inner_pretty.js:600527-600528). The only place the parameter is used
is the human-readable severity framing ("maximum" vs "extra-high").

```javascript
// ============================================
// buildHighRecallEffortPrompt - factory for xhigh/max: 5+4 angles × 8 + sweep, recall verifier, ≤15
// Location: cli_inner_pretty.js:600389-600416
// ============================================

// ORIGINAL (for source lookup):
  HO9 = (
    H,
  ) => `\`${H} effort → 5+4 angles \xD7 8 candidates → 1-vote verify → sweep → ≤15 findings\`

You are reviewing for **recall** at ${H === "max" ? "maximum" : "extra-high"} effort: catch every real bug. ...

${dq$}
## Phase 1 — Find candidates (5 correctness angles + 3 cleanup angles + 1 altitude angle, up to 8 each)

Run **9 independent finder angles** via the ${sq} tool. Each
surfaces **up to 8 candidate findings**. Do NOT let one angle's conclusions
suppress another's ...

${nyz}
${U1q}
${cq$}
${lq$}
${nq$}
${F1q}
${af9}
This is recall mode — a single non-REFUTED vote carries the finding. Do NOT
drop on uncertainty.

${ryz}
${Q1q(15)}`;

// READABLE (for understanding):
const buildHighRecallEffortPrompt = (level) =>
  `${level} effort → 5+4 angles × 8 candidates → 1-vote verify → sweep → ≤15 findings\n` +
  `Reviewing for recall at ${level === "max" ? "maximum" : "extra-high"} effort.\n` +
  gatherDiffPhase +                         // dq$
  "Phase 1: 9 finder angles (5 correctness + 3 cleanup + 1 altitude), ≤8 each, via Agent tool\n" +
  correctnessAnglesDE +                     // nyz = A,B,C,D,E
  reuseAngleIntro + simplificationAngle + efficiencyAngle + altitudeAngle +  // U1q,cq$,lq$,nq$
  cleanupOutputNote +                       // F1q (output shape + correctness>cleanup ranking-under-cap rule)
  verifyPhasePrecision +                    // af9 (note: xhigh/max use af9, NOT iyz)
  "recall mode — one non-REFUTED vote carries the finding\n" +
  sweepPhase +                              // ryz
  buildFindingsOutputSchema(15);            // Q1q(15)

// Mapping: HO9→buildHighRecallEffortPrompt, H→level, dq$→gatherDiffPhase, nyz→correctnessAnglesDE,
//          af9→verifyPhasePrecision, ryz→sweepPhase, Q1q→buildFindingsOutputSchema, ${sq}→Agent
```

Three things jump out relative to high:

- **Angle count 7 → 9**: adds Angle D (language pitfalls) and Angle E (wrapper/proxy) via
  `nyz`/`correctnessAnglesDE` instead of plain `p1q`.
- **Candidate budget 6 → 8** per angle.
- **A Phase-3 sweep** (`ryz`) is appended — the only levels that re-scan after verification.
- **Cap 10 → 15** via `Q1q(15)`.

One subtlety worth flagging: xhigh/max embed `af9` (the *neutral* verify phase) and then add a
trailing line "This is recall mode — a single non-REFUTED vote carries the finding. Do NOT
drop on uncertainty." So the recall bias at xhigh/max is achieved by **the surrounding framing
plus that extra line**, not by swapping in `iyz`. High effort, by contrast, swaps in the full
`iyz` recall verifier body. (Verified: `ef9` references `${iyz}` at 600525, while `HO9`
references `${af9}` at 600411.) Confidence: high — both are read directly.

### The level → prompt map — `effortPromptMap` (`oyz`)

```javascript
// ============================================
// effortPromptMap - dispatch table from canonical effort level to its compiled prompt
// Location: cli_inner_pretty.js:600659-600661
// ============================================

// ORIGINAL (for source lookup):
((oyz = { low: sf9, medium: tf9, high: ef9, xhigh: $O9, max: qO9 }),
  (pI8 = dN),
  (tyz = new RegExp(`^(${pI8.map((H) => H.slice(0, 3)).join("|")})[a-z]*$`, "i")));

// READABLE (for understanding):
effortPromptMap = { low: lowEffortPrompt, medium: mediumEffortPrompt, high: highEffortPrompt,
                    xhigh: xhighEffortPrompt, max: maxEffortPrompt };
selectableLevels = EFFORT_LEVELS;                 // ["low","medium","high","xhigh","max"]
unrecognizedLevelRegex = /^(low|med|hig|xhi|max)[a-z]*$/i;  // "looks like a level" matcher

// Mapping: oyz→effortPromptMap, pI8→selectableLevels(=dN), tyz→unrecognizedLevelRegex
```

`tyz` is a clever "did the user *mean* a level?" detector: it takes the first 3 letters of each
level name (`low`, `med`, `hig`, `xhi`, `max`) and matches any word starting with them. So
`/code-review highish` or `/code-review maximum` is recognized as a fumbled level and triggers
the "Ignoring unrecognized effort" banner rather than being treated as a review *target*.

### ASCII: the compiler at a glance

```
                 ┌──────────────── shared fragment palette ────────────────┐
                 │ dq$  diff   p1q A/B/C   nyz A..E   BI8/cq$/lq$/nq$ cleanup│
                 │ af9 verify(neutral)  iyz verify(recall)  ryz sweep  Q1q(N)│
                 └─────────────────────────────────────────────────────────┘
                                          │  concatenated per level
       ┌───────────┬──────────────┬──────────────┬───────────────────────┐
       ▼           ▼              ▼              ▼                       ▼
     low         medium          high          xhigh                   max
  1 pass       7 angles×6     7 angles×6     9 angles×8              9 angles×8
  no verify    verify:af9     verify:iyz     verify:af9+recall-line  verify:af9+recall-line
  no sweep     no sweep       no sweep       + sweep ryz             + sweep ryz
  ≤4 (text)    ≤8 Q1q(8)      ≤10 Q1q(10)    ≤15 Q1q(15)             ≤15 Q1q(15)
       │           │              │              │                       │
       └───────────┴──────────────┴────► oyz[level] ◄──────────────────┘
```

---

## Argument parsing and final assembly (`/code-review`)

### Parsing — `parseCodeReviewArgs` (`_O9`)

```javascript
// ============================================
// parseReviewArgs - parse `/code-review` args: level token, --fix/--comment, ultra, target
// Location: cli_inner_pretty.js:600530-600557
// ============================================

// ORIGINAL (for source lookup):
function _O9(H) {
  let { rawFirstToken: $, flags: q, rest: K } = BN8(H, ["comment", "fix"]),
    _ = q.has("comment"),
    z = q.has("fix"),
    A = K.split(/\s+/).filter(Boolean),
    Y = A[0] ?? "";
  if ($.toLowerCase() === "ultra")
    return { explicit: void 0, target: A.slice(1).join(" "), comment: _, fix: z,
             unrecognizedLevel: void 0, ultraFallback: !0 };
  let f = Y.toLowerCase() === "ultra" ? void 0 : _kH(Y);
  if (f !== void 0)
    return { explicit: f, target: A.slice(1).join(" "), comment: _, fix: z,
             unrecognizedLevel: void 0, ultraFallback: !1 };
  let O = tyz.test(Y);
  return { explicit: void 0, target: K, comment: _, fix: z, unrecognizedLevel: O ? Y : void 0, ultraFallback: !1 };
}

// READABLE (for understanding):
function parseReviewArgs(rawArgs) {
  const { rawFirstToken, flags, rest } = parseFlagsAndRest(rawArgs, ["comment", "fix"]);
  const comment = flags.has("comment"), fix = flags.has("fix");
  const words = rest.split(/\s+/).filter(Boolean);
  const first = words[0] ?? "";
  if (rawFirstToken.toLowerCase() === "ultra")          // `/code-review ultra ...`
    return { explicit: undefined, target: words.slice(1).join(" "), comment, fix,
             unrecognizedLevel: undefined, ultraFallback: true };
  const level = first.toLowerCase() === "ultra" ? undefined : parseEffortLevel(first);
  if (level !== undefined)                              // first word is a real level → consume it
    return { explicit: level, target: words.slice(1).join(" "), comment, fix,
             unrecognizedLevel: undefined, ultraFallback: false };
  const looksLikeLevel = unrecognizedLevelRegex.test(first);
  return { explicit: undefined, target: rest, comment, fix,
           unrecognizedLevel: looksLikeLevel ? first : undefined, ultraFallback: false };
}

// Mapping: _O9→parseReviewArgs, BN8→parseFlagsAndRest, _kH→parseEffortLevel, tyz→unrecognizedLevelRegex
```

The order of checks matters: `--fix`/`--comment` are stripped first (so they can appear
anywhere), then `ultra` is detected (sets `ultraFallback`), then a real level is consumed off
the front (and the *rest* becomes the review target), and finally a "looks-like-a-level"
typo is recorded so the banner can complain. If none of those, the whole remainder is the
target (e.g. a PR number or branch name).

### Choosing the effective level — `buildCodeReviewPrompt` (`$hz`)

```javascript
// ============================================
// getReviewPrompt - resolve effort vs model, then assemble level prompt + flag appendices
// Location: cli_inner_pretty.js:600564-600577
// ============================================

// ORIGINAL (for source lookup):
async function $hz(H, $) {
  let { explicit: q, target: K, comment: _, fix: z, unrecognizedLevel: A, ultraFallback: Y } = _O9(H),
    f = Y ? "max" : q,
    O = $.options?.mainLoopModel,
    M = O ? (or(O, f ?? k3($)) ?? f) : (f ?? k3($)),
    j = M === void 0 ? "medium" : E1H(M),
    w = qhz({ ultraFallback: Y, fix: z, unrecognizedLevel: A, level: j, context: $ }),
    D = K ? `Review target: \`${K}\`\n\n` : "";
  return [{ type: "text", text: `${w}${D}${oyz[j]}${_ ? ayz : ""}${z ? syz : ""}` }];
}

// READABLE (for understanding):
async function getReviewPrompt(rawArgs, ctx) {
  const { explicit, target, comment, fix, unrecognizedLevel, ultraFallback } = parseReviewArgs(rawArgs);
  const requested = ultraFallback ? "max" : explicit;              // local fallback for `ultra` = max
  const model = ctx.options?.mainLoopModel;
  const resolved = model
    ? (resolveEffortForModel(model, requested ?? defaultEffort(ctx)) ?? requested)
    : (requested ?? defaultEffort(ctx));
  const level = resolved === undefined ? "medium" : canonicalEffort(resolved);
  const banner = ultraFallbackBanner({ ultraFallback, fix, unrecognizedLevel, level, context: ctx });
  const targetLine = target ? `Review target: \`${target}\`\n\n` : "";
  return [{ type: "text",
            text: `${banner}${targetLine}${effortPromptMap[level]}${comment ? commentFlagBlock : ""}${fix ? fixFlagBlock : ""}` }];
}

// Mapping: $hz→getReviewPrompt, _O9→parseReviewArgs, or→resolveEffortForModel, k3→defaultEffort,
//          E1H→canonicalEffort, qhz→ultraFallbackBanner, oyz→effortPromptMap, ayz→commentFlagBlock, syz→fixFlagBlock
```

The final prompt string is a simple concatenation:

```
[banner?] + [Review target line?] + effortPromptMap[level] + [--comment block?] + [--fix block?]
```

Two model-aware twists deserve a deep look.

### Effort clamping against the model — `resolveEffortForModel` (`or`) + gates

When the user asks for `max` or `xhigh` but the model can't support it, the level is silently
clamped to `high`. This happens in `or` (cli_inner_pretty.js:184909-184919):

```javascript
// ============================================
// resolveEffortForModel - reconcile requested effort against model capability, clamp max/xhigh→high
// Location: cli_inner_pretty.js:184909-184919
// ============================================

// ORIGINAL (for source lookup):
function or(H, $) {
  if (!A2(H)) return;
  let q = AkH(H), K = q48(H), _ = zkH();
  if (_ === null) return q ? K : void 0;
  let z = _ ?? (q ? K : void 0) ?? $ ?? K;
  if (z === "max" && !ow$(H)) return "high";
  if (z === "xhigh" && !ycH(H)) return "high";
  return z;
}

// READABLE (for understanding):
function resolveEffortForModel(model, requested) {
  if (!modelSupportsEffort(model)) return undefined;
  const launchPinned = isLaunchEffortPinned(model);     // opus-4-7/4-8 launch effort behavior
  const launchEffort = getDefaultEffortForModel(model);
  const envEffort = effortFromEnv();                    // CLAUDE_CODE_EFFORT_LEVEL
  if (envEffort === null) return launchPinned ? launchEffort : undefined;
  let level = envEffort ?? (launchPinned ? launchEffort : undefined) ?? requested ?? launchEffort;
  if (level === "max"   && !maxEffortGate(model))   return "high";   // clamp
  if (level === "xhigh" && !xhighEffortGate(model)) return "high";   // clamp
  return level;
}

// Mapping: or→resolveEffortForModel, ow$→maxEffortGate, ycH→xhighEffortGate, zkH→effortFromEnv, q48→getDefaultEffortForModel
```

`modelSupportsMax` (`ow$`, cli_inner_pretty.js:184816-184832) returns true for Opus 4.6/4.7/4.8
and Sonnet 4.6 (and honors `CLAUDE_CODE_ALWAYS_ENABLE_EFFORT`); `modelSupportsXhigh` (`ycH`,
184834-184851) is narrower — only Opus 4.7/4.8. So on an older model, `/code-review max`
quietly becomes a high-effort review. This is *why* the per-level prompts can assume the model
can actually reason at that depth: the gate guarantees max/xhigh only reach capable models.

If no model is in context, the fallback is `medium` (the `M === void 0 ? "medium"` branch).
`clampEffortLevel` (`E1H`, 184960-184963) is the last line of defense: any non-level string
coerces to `"high"`.

### The banner — `buildEffortFallbackPreamble` (`qhz`)

When the user typed `ultra` but the cloud path is unavailable, or when an unrecognized level
was given, a parenthetical note is prepended to the prompt (cli_inner_pretty.js:600578-600611).
The interesting branch is the `ultra`-fallback tree: it checks `isCloudReviewAvailable` (`WF`,
502747) and whether an `ultrareview` command is registered+enabled, and tailors the message —
e.g. *"type `/code-review ultra` to run it"* vs *"run `claude ultrareview` from a terminal"* —
and, under `--fix`, *"review in the cloud and apply the findings locally when it completes"*.
For an unrecognized level it emits `(Ignoring unrecognized effort "X"; valid: low, medium, ...;
Using <level>.)`.

### Command registration — `registerCodeReview` (`zO9`)

```javascript
// ============================================
// registerCodeReview - wires up the `code-review` slash command with `ultra` subcommand alias
// Location: cli_inner_pretty.js:600612-600624
// ============================================

// ORIGINAL (for source lookup):
function zO9() {
  bA({
    name: Y18,
    subcommands: { ultra: "ultrareview" },
    description: eyz,
    argumentHint: Hhz,
    userInvocable: !0,
    getEffort(H) { return _O9(H).explicit; },
    getPromptForCommand: $hz,
  });
}

// READABLE (for understanding):
function registerCodeReview() {
  registerBundledPromptCommand({
    name: CODE_REVIEW_NAME,                 // "code-review"
    subcommands: { ultra: "ultrareview" },  // `/code-review ultra` → cloud `ultrareview`
    description: reviewDescription,
    argumentHint: reviewArgumentHint,
    userInvocable: true,
    getEffort: (args) => parseReviewArgs(args).explicit,
    getPromptForCommand: getReviewPrompt,
  });
}

// Mapping: zO9→registerCodeReview, Y18→CODE_REVIEW_NAME, eyz→reviewDescription, Hhz→reviewArgumentHint,
//          _O9→parseReviewArgs, $hz→getReviewPrompt, bA→registerBundledPromptCommand
```

`getCodeReviewArgumentHint` (`Hhz`, 600561-600563) renders `[low|medium|high|xhigh|max|ultra] [--fix]
[--comment] [<target>]` — but only includes `ultra` when `WF()` says the cloud path is live.
`getEffort` lets the harness know the chosen effort *before* the prompt is built (used for
selecting the model's reasoning budget).

---

## `/simplify` — the cleanup-only sibling

`/simplify` is the same fragment palette with **all bug-hunting removed**. It is a fixed
prompt (`Ehz`) — no effort levels, no verify phase, no sweep.

```javascript
// ============================================
// simplifyPrompt - /simplify body: 4 cleanup agents in parallel, then apply fixes
// Location: cli_inner_pretty.js:601378-601407
// ============================================

// ORIGINAL (for source lookup):
Ehz = `\`/simplify → 4 cleanup agents in parallel → apply the fixes\`

You are improving the quality of the changed code, not hunting for bugs. Review
it for reuse, simplification, efficiency, and altitude issues, then fix what you
find. Do not look for correctness bugs — that is what \`/code-review\` is for.

${dq$}
## Phase 1 — Review (4 cleanup agents in parallel)

Launch **4 independent review agents** via the ${sq} tool, all in a
single message so they run concurrently. Pass each agent the diff and one of
the four angles below. ...

### Reuse
${BI8}
${cq$}
${lq$}
${nq$}
## Phase 2 — Apply the fixes

Wait for all four agents to complete, dedup findings that point at the same
line or mechanism, and fix each remaining one directly. Skip any finding whose
fix would change intended behavior ... Finish with a brief summary ...`;

// READABLE (for understanding):
simplifyPrompt =
  "/simplify → 4 cleanup agents in parallel → apply the fixes\n" +
  "Quality only — do NOT hunt for correctness bugs (that's /code-review).\n" +
  gatherDiffPhase +                                   // dq$
  "Phase 1: launch 4 cleanup agents concurrently via the Agent tool (one angle each):\n" +
  reuseAngleBody + simplificationAngle + efficiencyAngle + altitudeAngle +   // BI8,cq$,lq$,nq$
  "Phase 2: await all, dedup, apply each fix directly; skip behavior-changing/out-of-scope/false-positive; summarize.";

// Mapping: Ehz→simplifyPrompt, dq$→gatherDiffPhase, BI8→reuseAngleBody, cq$→simplificationAngle,
//          lq$→efficiencyAngle, nq$→altitudeAngle, ${sq}→Agent
```

Registration is plain (`registerSimplify`/`vO9`, cli_inner_pretty.js:601350-601372): name
`"simplify"`, an optional `[<target>]`, and the description *"Review the changed code for
reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only —
it does not hunt for bugs; use /code-review for that."* If a target is given it is prepended as
a `Review target:` line, exactly like `/code-review`.

The key structural difference from `/code-review`: `/simplify` runs its 4 cleanup angles
**in parallel in a single message** ("all in a single message so they run concurrently") and
then **always applies** the fixes. There is no verifier and no severity cap — cleanups are
low-risk and the command's contract is "fix what you find". This matches the changelog: 2.1.154
made `/simplify` cleanup-only (it used to be `/code-review --fix`).

---

## The cloud "ultra" bridge

`/code-review ultra` (and the deprecated `/code-review` → `ultrareview` subcommand alias) route
to a **cloud multi-agent review** ("Claude Code on the web") instead of the local angle machine.
The local command cannot launch it directly; it can only *guide* the user there (the banner
text) or fall back to a local `max`-effort review (`ultraFallback ? "max" : explicit` in
`buildCodeReviewPrompt`). The actual cloud machinery:

- `isCloudReviewAvailable` (`WF`, cli_inner_pretty.js:502747-502749) — gate:
  `x8$()?.enabled === true && dtH() && !d6()` (feature enabled, web-eligible, not a
  third-party/data-residency provider). Drives whether `ultra` even appears in the arg hint.
- `resolveUltraScope` (`re6`, cli_inner_pretty.js:502833-502895) — turns the argument
  into a cloud-review scope. If the arg is all-digits it's a **PR number** (needs a GitHub
  remote → `{mode:"pr", prNumber, repo}`); otherwise it resolves a **branch** scope by finding
  the merge-base with the base branch and shortstat-diffing it (`{mode:"branch", headBranch,
  baseBranch, mergeBaseSha, diffStat}`). Each precondition failure emits
  `tengu_review_remote_precondition_failed` with a tailored remediation message (no git repo,
  repo too large to bundle, unknown branch, empty diff, etc.).
- `fetchUltrareviewPreflight` (`WU4`, cli_inner_pretty.js:502758-502792) — hits
  `GET /v1/ultrareview/preflight` (auth `teleport-org`, 5 s timeout) and classifies the result:
  `essential-traffic-only`, `data-residency`, and `no-auth` each map to a blocked message;
  otherwise the validated payload drives billing/confirm. The wrapper `oe6`
  (cli_inner_pretty.js:502896-502915) turns the preflight into `proceed | blocked | needs-confirm`
  and, when `action === "confirm"`, asks the user to accept usage-credit billing unless a prior
  consent flag (`GU4`) is set.

So the local command is a thin **redirector**: it validates that a cloud review *could* run,
explains the billing, and otherwise degrades to a local max review.

---

## Why this approach

**Why a fragment compiler instead of five hand-written prompts?**
The five playbooks share ~80% of their text (diff gathering, the four cleanup angles, the
output schema). Hand-writing five copies would drift: a wording fix to "Angle B" would have to
be made five times. By factoring every angle and phase into a single `var` and concatenating,
a change to `BI8` (reuse) instantly propagates to medium, high, xhigh, max *and* `/simplify`.
The cost is indirection (you must trace the late-bound `nyz`/`U1q`/`af9`/`iyz` fills in `KO9`),
but the payoff is one source of truth per concept.

**Why dispatch finders/verifiers as separate `Agent` subagents instead of one mega-prompt?**
Three reasons visible in the prompt text itself: (1) *angle independence* — "Do NOT let one
angle's conclusions suppress another's"; a single context lets the model rationalize away the
second angle once the first "explains" a line. (2) *fresh-eyes verification* — a verifier that
never saw the finder's reasoning is harder to anchor; it must reconstruct the bug from the code.
(3) *fresh-eyes sweep* — Phase 3 explicitly hands the sweeper the verified list precisely so it
hunts only gaps. This is a classic generator/critic decomposition, scaled by effort.

**Why bake precision vs recall into the *verifier*, not the *finder*?**
Finders are cheap and their false positives are caught downstream; the expensive decision is
"does this finding ship to the user?" Putting the precision/recall dial on the verifier
(neutral `af9` at medium → recall-biased `iyz` at high, plus the recall framing at xhigh/max)
means the same broad finder net is used everywhere and only the *gate* tightens or loosens.
That is why high effort doesn't add angles over medium — it just *believes the finders more*.

**Why clamp max/xhigh to high on weak models?**
A `max`-effort prompt asks for 9 angles × 8 candidates + a sweep — a huge amount of reasoning.
On a model that can't sustain that, the output degrades into noise. The gates (`ow$`/`ycH`)
ensure the heaviest playbooks only reach Opus-class models, so the prompt can safely assume the
reasoning budget exists.

---

## Key insight

The effort level is not "try harder" — it is a **structured trade between false negatives and
false positives, expressed as four coupled prompt knobs**:

| level  | finder angles | candidates/angle | verify bias            | sweep | cap |
|--------|---------------|------------------|------------------------|-------|-----|
| low    | 0 (inline)    | —                | none                   | no    | 4   |
| medium | 7 (3+4)       | 6                | neutral (`af9`)        | no    | 8   |
| high   | 7 (3+4)       | 6                | recall (`iyz`)         | no    | 10  |
| xhigh  | 9 (5+4)       | 8                | neutral + recall line  | yes   | 15  |
| max    | 9 (5+4)       | 8                | neutral + recall line  | yes   | 15  |

(Counts read directly from the per-level templates at cli_inner_pretty.js:600360-600528.) The
"3+4" counts 3 correctness angles + the 4 cleanup angles; xhigh/max bump the *correctness* set
to 5 (adding D and E) while keeping the same 4 cleanup angles. Moving up the ladder
simultaneously widens the net (more angles, more candidates), loosens the gate (recall bias),
and adds a safety re-scan (sweep) — and the cap rises to let the extra survivors through. The
machine never just "reads more carefully"; it reorganizes the *whole pipeline shape*.

---

## Cross-validation vs v2.1.88

Checked `/lyz/codespace/3rd/claude-code/src/commands/review.ts` and `commands/review/`:

- 2.1.88 `/review` was a single prompt: *"You are an expert code reviewer ... run `gh pr list`
  / `gh pr view` / `gh pr diff` ... provide a thorough code review"* (`LOCAL_REVIEW_PROMPT`).
  No angles, no verify, no effort levels, no `--fix`/`--comment`, no `/simplify`.
- 2.1.88 `/ultrareview` (`commands/review/ultrareviewCommand.tsx`, `reviewRemote.ts`,
  `ultrareviewEnabled.ts`) was the *only* multi-agent path, and it ran **in the cloud** — the
  ancestor of today's `ultra` bridge. The `isUltrareviewEnabled()` gate and the
  preflight/overage-dialog flow map directly onto 2.1.156's `WF`/`WU4`/`oe6`.

Conclusion (high confidence): the **local multi-angle finder/verifier/sweep effort machine and
`/code-review`/`/simplify` commands are NEW after v2.1.88.** Only the cloud `ultrareview`
bridge has a genuine precursor. Per the changelog, the local machine arrived as `/simplify`
(2.1.147 renamed it `/code-review`), `--fix` landed 2.1.152, and 2.1.154 split `/simplify` back
out as cleanup-only — which is exactly the two-command shape we see in 2.1.156.
