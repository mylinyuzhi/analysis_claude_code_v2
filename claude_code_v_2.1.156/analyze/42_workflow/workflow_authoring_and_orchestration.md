# How the Model Is Taught to Orchestrate — the `Fp6` Authoring Prompt

> Module: `42_workflow` — Dynamic Workflows (FLAGSHIP, new in 2.1.154)
> Build under analysis: Claude Code **v2.1.156**
> Source: `cli_inner_pretty.js` (single pretty-printed bundle; every line citation is a verified read)
> Companion to `workflow_tool_definition.md` (tool anatomy — this doc's §4 names `Fp6` but defers its
> *content* here) and `workflow_runtime_and_subagents.md` (the VM that actually runs what this prompt
> teaches the model to write).

## Related Symbols

> Symbol mappings live in the central index and the per-module additions file (never as tables here):
> - [symbol_additions_v2_1_156_workflow.md](../00_overview/symbol_additions_v2_1_156_workflow.md) — all v2.1.156 workflow symbols.
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (Workflows home).
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (tool factory).
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (UI glyphs).

Key symbols in this document (full table in the additions file):

- `WORKFLOW_DESCRIPTION` (`Fp6`) — the authoring prompt: opt-in policy + DSL reference + orchestration methodology (cli_inner_pretty.js:376077-376235).
- `initWorkflowDescription` (`_44`) — lazy `T(() => {...})` thunk that assigns `Fp6` on first access; invoked at `cli_inner_pretty.js:378130` (cli_inner_pretty.js:376075).
- `NESTED_WORKFLOW_GLYPH` (`bGH`) — `"▸"`, the group prefix the `workflow()` primitive uses in `/workflows` (cli_inner_pretty.js:49151).
- `WORKFLOW_ISOLATION_DESC` (`q0_`) — `"'worktree'"`, the only `isolation` value the prompt advertises (cli_inner_pretty.js:376071).

---

## TL;DR

The `Workflow` tool does not ship with separate "skill" docs explaining how to write a workflow. **The
entire authoring methodology lives inside one tool-description constant, `Fp6`** (cli_inner_pretty.js:376077-376235),
returned by both `prompt()` and `description()` (cli_inner_pretty.js:378223-378228). That single ~160-line
string is three things at once:

1. **An authorization policy** — *when* the model is allowed to call the tool at all (the opt-in gate).
2. **A DSL reference** — the exact signatures of the runtime primitives (`agent()`, `pipeline()`,
   `parallel()`, `phase()`, `log()`, `args`, `budget`, `workflow()`) the model must write against.
3. **An orchestration methodology** — *how to write a good workflow*: the pipeline-vs-parallel decision,
   a catalog of named quality patterns (adversarial verify, judge panel, loop-until-dry, multi-modal
   sweep, completeness critic), worked examples, and a resume contract.

`workflow_tool_definition.md` §4 names `Fp6` and explains *why it is one giant string* and *where it
plugs in*. **This doc walks its content** — quoting the load-bearing parts verbatim with line anchors,
because that content is the spec every author (human or model) is actually working from, and because each
example is itself a documented orchestration pattern.

> **Mental model:** `workflow_tool_definition.md` = the *socket* (how the prompt attaches to the tool);
> `workflow_runtime_and_subagents.md` = the *engine* (what the primitives do); **this doc = the
> *operator's manual* the model reads before it writes a single line of script.**

---

## 1. Where the prompt lives and how it is assembled

`Fp6` is a module-level `var` declared empty at cli_inner_pretty.js:376074 (`Fp6;`) and assigned inside a
lazy initializer thunk so the ~160-line string is built only when first needed.

```javascript
// ============================================
// initWorkflowDescription - lazy thunk that assigns the Fp6 authoring prompt on first access
// Location: cli_inner_pretty.js:376074-376236 (invoked at 378130)
// ============================================

// ORIGINAL (for source lookup):
var Fp6;
var _44 = T(() => {
  m4();
  Fp6 = `Execute a workflow script that orchestrates multiple subagents deterministically. ...`;
});
// ... and in the tool object:
//   get prompt()      { return _44(), Fp6; }   // 378130 area
//   prompt()  -> Fp6  (378224)
//   description() -> Fp6 (378227)

// READABLE (for understanding):
let WORKFLOW_DESCRIPTION;
const initWorkflowDescription = lazyOnce(() => {
  loadDeps();                                   // m4()
  WORKFLOW_DESCRIPTION = `Execute a workflow script that orchestrates ...`;  // 376077-376235
});

// Mapping: Fp6→WORKFLOW_DESCRIPTION, _44→initWorkflowDescription, T→lazyOnce, m4→loadDeps
```

The string carries five `${...}` interpolation slots, four of which are **empty or single-valued in this
build** — the shipped prompt is what you read below:

- `${q0_}` at 376122 → `"'worktree'"` (cli_inner_pretty.js:376071). This is the **only** `isolation` value
  the prompt advertises in the `agent()` signature. It is *not* a coincidence: the runtime throws
  `agent({isolation:'remote'}) is not available in this build` (cli_inner_pretty.js:375083), and the
  description is generated to match — `'remote'` is never offered to the model. (See the `lG_` /
  remote-executor analysis in `workflow_runtime_and_subagents.md` and `gate_caps_lifecycle_relations.md` §3.)
- `${bGH}` at 376129 → `"▸"` (cli_inner_pretty.js:49151), the glyph the nested-`workflow()` group uses in
  the `/workflows` tree.
- `${_0_}` (376103), `${$0_}` (376103), `${K0_}` (376122) → `""` (cli_inner_pretty.js:376072-376073).
  These are build-conditional slots (durability/remote phrasing) that compile to empty in this binary, so
  the prose reads cleanly without them.

**Why lazy:** the prompt is one of the largest tool descriptions in the codebase, and it is only sent to
the model when `isEnabled` (`NZ()`) is true (cli_inner_pretty.js:378222). Building it lazily means a
session that never enables workflows never pays the construction (or token) cost — the same
gating-saves-tokens argument made in `workflow_tool_definition.md` §4.

---

## 2. Part A — The opt-in policy: *when* to orchestrate at all

The prompt opens by framing *what a workflow is for* and then immediately clamps *when it may run*.

> *"A workflow structures work across many agents — to be comprehensive (decompose and cover in
> parallel), to be confident (independent perspectives and adversarial checks before committing), or to
> take on scale one context can't hold (migrations, audits, broad sweeps). The script is where you encode
> that structure: what fans out, what verifies, what synthesizes."* (cli_inner_pretty.js:376079)

### The five accepted opt-in forms (cli_inner_pretty.js:376081-376088)

> *"ONLY call this tool when the user has explicitly opted into multi-agent orchestration. … the user
> must request that scale, not have it inferred."*

1. The literal `"workflow"`/`"workflows"` keyword (a system-reminder confirms it). — 376082
2. **Ultracode is on** (system-reminder confirms). — 376083
3. The user asked in their own words ("run a workflow", "fan out agents"). *"The ask must be in the user's
   words — a task that would merely benefit from a workflow does not count."* — 376084
4. A skill/slash-command instructed it. — 376085
5. The user named a saved/built-in workflow. — 376086

> *"For any other task — even one that would clearly benefit from parallelism — do NOT call this tool. Use
> the Agent tool for individual subagents, or briefly describe what a multi-agent workflow could do and
> how much it would roughly cost, and ask the user whether to run it. Mention they can include 'workflow'
> in a future message to skip the ask."* (cli_inner_pretty.js:376088)

This is the prose counterpart to the **keyword machinery** (`pg6`/`KR_` + the `workflow_keyword_request`
reminder) and the **enablement gate** (`NZ`) dissected in `gate_caps_lifecycle_relations.md` Parts 1–2:
the gate decides whether the tool *exists*; this paragraph decides whether the model *fires* it.

### The hybrid rule — scout inline, then pipeline (cli_inner_pretty.js:376090)

> *"When you do call it, the right move is often **hybrid**: scout inline first (list the files, find the
> channels, scope the diff) to discover the work-list, then call Workflow to pipeline over it. You don't
> need to know the shape before the *task* — only before the *orchestration step*."*

This is the single most operational sentence in the prompt: it tells the model not to guess the fan-out
shape up front but to *discover* the work-list with ordinary tools, then hand the list to a workflow.

### Ultracode — standing opt-in + "token cost is not a constraint" (cli_inner_pretty.js:376101)

> *"When a system-reminder confirms ultracode is on, that opt-in is standing: author and run a workflow
> for every substantive task by default. The goal is the most exhaustive, correct answer you can produce —
> token cost is not a constraint. … Lean toward orchestrating with workflows and adversarially verifying
> your findings … Solo only on conversational turns or trivial mechanical edits."*

Ultracode converts the per-turn keyword opt-in into a per-session standing policy. The runtime side of
this (the `ultracode` setting, `xhigh` effort, the `ultra_effort_enter` reminder) is in
`gate_caps_lifecycle_relations.md` Part 6 and `43_model_opus48/`; here it changes the *default behavior*
the prompt prescribes.

**Why opt-in is in the description and not a gate alone:** a tool that can spend a large fraction of a
user's quota across hundreds of agents must refuse to fire on inference. The gate (`NZ`) can hide the tool
from a whole org; but for an entitled user the *decision to spend* has to be re-litigated in-context every
turn, which is exactly what this paragraph does.

---

## 3. Part B — The `meta` contract (cli_inner_pretty.js:376105-376119)

The prompt mandates the script shape with a worked skeleton:

```javascript
// (verbatim from Fp6, cli_inner_pretty.js:376106-376117)
export const meta = {
  name: 'find-flaky-tests',
  description: 'Find flaky tests and propose fixes',   // one-line, shown in permission dialog
  phases: [                                            // one entry per phase() call
    { title: 'Scan', detail: 'grep test logs for retries' },
    { title: 'Fix', detail: 'one agent per flaky test' },
  ],
}
// script body starts here — use agent()/parallel()/pipeline()/phase()/log()
phase('Scan')
const flaky = await agent('grep CI logs for retry markers', {schema: FLAKY_SCHEMA})
```

> *"The `meta` object must be a PURE LITERAL — no variables, function calls, spreads, or template
> interpolation. Required fields: `name`, `description`. Optional: `whenToUse` (shown in the workflow
> list), `phases`. Use the SAME phase titles in meta.phases as in phase() calls — titles are matched
> exactly … Add `model` to a phase entry when that phase uses a specific model override."* (376119)

This is the **author-facing** statement of the rule that `parseWorkflowMeta` (`FZ`) **enforces**
(`workflow_tool_definition.md` §5): the parser statically evaluates `meta` with Acorn, rejecting any
non-literal node, computed key, or `__proto__`/`constructor`/`prototype` key. The "pure literal" demand in
the prose and the AST walk in the parser are two halves of the same trust boundary — `meta` is the one
part of an untrusted program read *before* the script runs (permission dialog, `/workflows` list,
telemetry, progress grouping).

---

## 4. Part C — The DSL reference (cli_inner_pretty.js:376121-376135)

The prompt gives the model the **full signatures** of every runtime global. These are the *contract* the
model writes against; the *implementations* are dissected in `workflow_runtime_and_subagents.md` §D. The
map below pairs each advertised signature with where its behavior is verified in source.

- **`agent(prompt, opts?)`** (376122) — `opts` = `{label?, phase?, schema?, model?, isolation?: 'worktree',
  agentType?}`. *"Without schema, returns its final text as a string. With schema … the subagent is forced
  to call a StructuredOutput tool and agent() returns the validated object."* `isolation:'worktree'` is
  flagged **EXPENSIVE (~200-500ms + disk)**; `opts.model` *"Default to omitting it — the agent inherits
  the main-loop model."* → runtime: the agent executor `C = BiH(cG_, R)` (cli_inner_pretty.js:375001), the
  `schema`→StructuredOutput forcing via the `gtH` SubagentStop nudge (375221-375236), and the
  worktree/`'remote'`-throws branch (375075/375083).
- **`pipeline(items, stage1, stage2, ...)`** (376123) — *"run each item through all stages independently,
  NO barrier between stages … This is the DEFAULT for multi-stage work. Wall-clock = slowest single-item
  chain … Every stage callback receives `(prevResult, originalItem, index)` … A stage that throws drops
  that item to `null`."* → runtime: `g` (cli_inner_pretty.js:375622), per-item independent stage loop.
- **`parallel(thunks)`** (376124) — *"run tasks concurrently. This is a BARRIER … A thunk that throws …
  resolves to `null` … so `.filter(Boolean)` before using the results."* → runtime: `Q`
  (cli_inner_pretty.js:375598), `Promise.allSettled`.
- **`log(message)`** (376125) / **`phase(title)`** (376126) → runtime: `l`/`I`/`h`
  (cli_inner_pretty.js:374998, 374985).
- **`args`** (376127) — verbatim value; *"Pass arrays/objects as actual JSON values … NOT as a
  JSON-encoded string."*
- **`budget: {total, spent(), remaining()}`** (376128) — *"`budget.total` is null if no target was set …
  `remaining()` returns … `Infinity` if no target. … once `spent()` reaches `total`, further `agent()`
  calls throw."* → runtime: the budget seeded in `call` and `remaining()→Infinity` when `total==null`
  (cli_inner_pretty.js:375977-375979), enforced by `G()`/`fW8` (374974, 375746).
- **`workflow(nameOrRef, args?)`** (376129) — *"run another workflow inline as a sub-step … its agents
  appear under a `▸ name` group … **Nesting is one level only: workflow() inside a child throws.**"* →
  runtime: `QK4` (cli_inner_pretty.js:371875); the `▸` is `bGH` (49151).

Two cross-cutting rules close the section:

> *"Workflow agents can reach all session-connected MCP tools via ToolSearch — schemas load on demand per
> agent."* (376133) — and the **sandbox restriction**: *"Scripts are plain JavaScript, NOT TypeScript …
> Standard JS built-ins … are available — EXCEPT `Date.now()`/`Math.random()`/argless `new Date()`, which
> throw (they would break resume) … No filesystem or Node.js API access."* (376135) → runtime: the
> determinism shim `SZ_` and intrinsic hardening `UtH` (`workflow_runtime_and_subagents.md` §A-§B).

**Key insight:** the description advertises `isolation: 'worktree'` only (`q0_`), never `'remote'` — the
prompt is *generated to match the build*. Authors are never told about a capability the runtime would
reject. This is the cleanest evidence that the prompt and the VM are kept in lockstep.

---

## 5. Part D — pipeline-vs-parallel: the load-bearing decision (cli_inner_pretty.js:376137-376179)

This is the longest argued passage in the prompt, and the single piece of guidance most likely to change
a workflow's wall-clock.

> **"DEFAULT TO pipeline(). Only reach for a barrier (parallel between stages) when you genuinely need ALL
> prior-stage results together."** (376137)

**A barrier is correct ONLY when** (376139-376142): a stage needs cross-item context from *all* of the
prior stage — dedup/merge across the full set, early-exit on zero total, or a prompt that references "the
other findings."

**A barrier is NOT justified by** (376144-376147): "I need to flatten/map/filter first" (do it inside a
pipeline stage), "the stages are conceptually separate" (*"Separate stages ≠ synchronized stages"*), or
"it's cleaner code" (*"barrier latency is real. If 5 finders run and the slowest takes 3× the fastest, a
barrier wastes 2/3 of the fast finders' idle time."*).

**The smell test** (376149-376153):

```javascript
// (verbatim, cli_inner_pretty.js:376150-376152)
const a = await parallel(...)
const b = transform(a)        // flatten, map, filter — no cross-item dependency
const c = await parallel(b.map(...))
// "that middle transform doesn't need the barrier. Rewrite as a pipeline with the transform inside a stage."
```

Followed by the **caps reminder** (376155): *"Concurrent agent() calls are capped at min(16, cpu cores -
2) per workflow … Total agent count … capped at 1000."* — note this confirms there is **one** concurrency
cap (the local `cG_` semaphore), *not* a separate per-pipeline width; see the `lG_` correction in
`gate_caps_lifecycle_relations.md` §3 and `workflow_runtime_and_subagents.md`.

**The canonical multi-stage pattern** (376157-376174) is given as a complete `review-changes` script:
`pipeline(DIMENSIONS, review→schema, review => parallel(findings.map(verify)))` — each dimension's findings
verify *as soon as that dimension's review completes*, with the punch line *"Dimension 'bugs' findings
verify while dimension 'perf' is still reviewing. No wasted wall-clock."* The contrasting **"when a
barrier IS correct"** example (376176-376179) shows `parallel` → `dedupeByFileAndLine(all)` → `parallel`,
where the dedup *"genuinely needs ALL at once."*

This authoring guidance is exactly what the runtime makes true: both `pipeline` and `parallel` fan their
`agent()` calls through the same `cG_`-limited executor, so the *only* reason to choose `parallel` is the
cross-item barrier semantics — never throughput.

---

## 6. Part E — The orchestration pattern catalog

The prompt teaches orchestration by **named, composable patterns**, each with a worked example. These are
the methodology an author is expected to reach for; documenting them here makes the "how to orchestrate"
question concrete.

### Single-phase shapes you can chain across turns (cli_inner_pretty.js:376092-376099)

- **Understand** — parallel readers over subsystems → structured map.
- **Design** — judge panel of N approaches → scored synthesis.
- **Review** — dimensions → find → adversarially verify.
- **Research** — multi-modal sweep → deep-read → synthesize.
- **Migrate** — discover sites → transform each (worktree isolation) → verify.

> *"For larger work, run several in sequence — read each result before deciding the next phase. You stay in
> the loop; each workflow is one well-scoped fan-out."* (376099)

### Loop patterns

- **Loop-until-count** (376181-376187) — accumulate to a target (`while (bugs.length < 10)`).
- **Loop-until-budget** (376189-376195) — scale depth to a `+500k`-style directive, with the explicit
  footgun warning: *"Guard on budget.total: with no target set, remaining() is Infinity and the loop would
  run straight to the 1000-agent cap."* This is the author-facing twin of the `WorkflowAgentCapError`
  diagnostic (`nG_`, cli_inner_pretty.js:375736) analyzed in `gate_caps_lifecycle_relations.md` §3.1.

### The composed "exhaustive review" example (cli_inner_pretty.js:376197-376213)

A full worked harness that chains four patterns: **find → dedup-vs-seen → diverse-lens judge panel →
loop-until-dry**, with a `Set` of seen keys, a 2-round dry counter, and a 3-lens (`correctness`,
`security`, `repro`) majority vote per finding. Its closing comment is a real correctness lesson:

> *"// dedup vs `seen`, NOT `confirmed` — else judge-rejected findings reappear every round and it never
> converges."* (376213)

### The quality-pattern catalog (cli_inner_pretty.js:376215-376225)

> *"Quality patterns — common shapes; pick by task and compose freely:"*

- **Adversarial verify** (376216-376219) — *"spawn N independent skeptics per finding, each prompted to
  REFUTE. Kill if ≥majority refute."* with the 3-vote `Try to refute: … Default to refuted=true if
  uncertain` example.
- **Perspective-diverse verify** (376220) — give each verifier a distinct lens (correctness/security/
  perf/repro) instead of N identical refuters; *"diversity catches failure modes redundancy can't."*
- **Judge panel** (376221) — N independent attempts from different angles, scored by parallel judges,
  synthesize from the winner while grafting runners-up. *"Beats one-attempt-iterated when the solution
  space is wide."*
- **Loop-until-dry** (376222) — keep spawning finders until K consecutive empty rounds; *"Simple counters
  (while count < N) miss the tail."*
- **Multi-modal sweep** (376223) — parallel agents each searching a different way (by-container/by-content/
  by-entity/by-time); *"Each is blind to what the others surface."*
- **Completeness critic** (376224) — a final agent asking *"what's missing — modality not run, claim
  unverified, source unread?"* — *"What it finds becomes the next round of work."*
- **No silent caps** (376225) — *"if a workflow bounds coverage (top-N, no-retry, sampling), `log()` what
  was dropped — silent truncation reads as 'covered everything' when it didn't."*

### Scaling to the request (cli_inner_pretty.js:376227-376229)

> *"Scale to what the user asked for. 'find any bugs' → a few finders, single-vote verify. 'thoroughly
> audit this' or 'be comprehensive' → larger finder pool, 3–5 vote adversarial pass, synthesis stage."*

> *"These patterns aren't exhaustive — compose novel harnesses when the task calls for it (tournament
> brackets, self-repair loops, staged escalation, whatever fits)."* (376229)

**Why a catalog and not a fixed algorithm:** the prompt explicitly hands the model a *toolbox* of harness
shapes and the judgment for when each fits, rather than one prescribed pipeline. The recurring spine —
*find → dedup → verify (diversely) → critic → loop until dry* — is the thread these patterns compose into,
and it is exactly the structure the runtime's `pipeline`/`parallel`/journal primitives are built to
support.

---

## 7. Part F — The resume contract (cli_inner_pretty.js:376233-376235)

> *"## Resume … To resume after a pause, kill, or script edit, relaunch with Workflow({scriptPath,
> resumeFromRunId}) — the longest unchanged prefix of agent() calls returns cached results instantly; the
> first edited/new call and everything after it runs live. Same script + same args → 100% cache hit.
> Date.now()/Math.random()/new Date() are unavailable in scripts (they would break this) … Fallback when
> no journal is available: Read agent-<id>.jsonl files in the transcript directory and hand-author a
> continuation script."*

This is the author-facing statement of the journal/respawn machinery (`bp6`/`x74`/`m74`, the
longest-unchanged-prefix semantics) detailed in `gate_caps_lifecycle_relations.md` Part 4. The prompt ties
the determinism ban *directly* to resume here ("they would break this"), which is why
`validateInput` rejects those calls as errorCode 4 (`workflow_tool_definition.md` §6) and the VM installs
the `SZ_` determinism shim (`workflow_runtime_and_subagents.md` §A).

---

## 8. Key insight — the prompt *is* the orchestration system's API surface

Everything an author needs is co-located in one string because all of it must be in the model's context
*the instant it considers calling the tool*: the **authorization** (may I spend this much?), the **DSL**
(what can I write?), and the **methodology** (how do I write it well?). There is no separate skill, no
external doc the model can fetch mid-decision. That design has a cost — `Fp6` is among the largest tool
descriptions in the build — which is precisely why the feature is gated (`NZ`) and lazily constructed
(`_44`): a user who never enables workflows never pays for the manual.

The three sibling docs map cleanly onto the three roles of this string:
- **Authorization** → `gate_caps_lifecycle_relations.md` Parts 1–2 (the gate + keyword that *enforce* the
  opt-in this prompt *states*).
- **DSL** → `workflow_runtime_and_subagents.md` (the VM that *implements* the signatures this prompt
  *advertises*).
- **Methodology** → this doc (the patterns this prompt *teaches*).

---

## Cross-validation (v2.1.88)

No precursor. `Fp6`, `_44`, the opt-in policy, the DSL signatures, the pattern catalog, and the resume
contract are all new in the v2.1.154 window; none of `Workflow`-tool description text, `pipeline`/
`parallel`/`workflow()` primitive prose, `ultracode`, or the `▸`-grouped nested-workflow phrasing exists
in the readable v2.1.88 tree. Confidence: high. (`bGH = "▸"` predates workflows as a generic UI glyph; its
workflow use is new.)

---

## Pre-completion checklist

- [x] No mapping tables in this module doc — list-format refs only; full table in
  `symbol_additions_v2_1_156_workflow.md` / `symbol_index_core_features.md`.
- [x] New symbols (`_44`, `bGH`, `q0_`) recorded in the additions file for consolidation.
- [x] Every cited `cli_inner_pretty.js:<line>` was read directly; verbatim quotes are exact.
- [x] One dual-version snippet (the `_44`/`Fp6` assignment) with the `====` header + ORIGINAL + READABLE +
  Mapping; the prompt body is quoted verbatim (the value *is* the prompt) per the convention in
  `workflow_tool_definition.md` §4.
- [x] Cross-validation against v2.1.88 stated with confidence (high).
