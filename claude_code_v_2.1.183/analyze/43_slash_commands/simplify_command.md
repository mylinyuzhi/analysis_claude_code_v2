# `/simplify` — Deep Analysis (Claude Code v2.1.183)

> `/simplify` is the **quality-only fan-out** slash command: it reviews the
> *changed* code for cleanups — never for correctness bugs — by launching **4
> independent review agents in parallel**, each carrying a single review "angle"
> (Reuse / Simplification / Efficiency / Altitude), then deduplicates and applies
> the findings. Like `/loop` and `/batch`, it is a *bundled skill*
> (`type:'prompt'`, `source:'bundled'`): it ships **no deterministic
> orchestration code**. The entire 3-phase protocol lives in one generated prompt
> string; the *model* is what enters the diff, spawns the four agents via the
> `Agent` tool, and edits the files, guided by that prompt.
>
> - **Reconstructed readable source (primary input):** [`reconstructed_source/skills/bundled/simplify.ts`](reconstructed_source/skills/bundled/simplify.ts)
> - **Anchor dossier:** [`reconstructed_source/_anchors_simplify.md`](reconstructed_source/_anchors_simplify.md)
> - **Conventions:** [`reconstructed_source/_conventions.md`](reconstructed_source/_conventions.md)
> - **PRIMARY truth (183 bundle):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (cited as `cli_inner_pretty.js:NNN`)
> - **Before-picture:** v2.1.156 bundle (tagged `(v2.1.156)`); v2.1.88 named-TS ancestor `src/skills/bundled/simplify.ts` (tagged `(v2.1.88)`)

---

## 1. What `/simplify` is

`/simplify` is registered by `registerSimplifySkill` (`OKl`), which calls the
bundled-skill registrar `ap` (= v2.1.88's `registerBundledSkill`) with
`name: BUt` where `BUt = "simplify"` (`cli_inner_pretty.js:647978-648000`,
name const at `cli_inner_pretty.js:372051`). The registrar emits a `Command` of
`type:"prompt"`, `source:"bundled"` (`cli_inner_pretty.js:546990`,
`cli_inner_pretty.js:547005`). Its `getPromptForCommand(args)` does **one** cheap
thing — optionally prepend a target line — and returns a single
`[{ type:"text", text:<prompt> }]` block. It **does not orchestrate anything
itself** (`cli_inner_pretty.js:647986-647999`):

```javascript
async getPromptForCommand(e) {
  let t = e.trim();
  return [{ type: "text", text: `${t ? `Review target: \`${t}\`\n\n` : ""}${ZOf}` }];
}
```

The real work — reading the diff, launching the four `Agent`-tool review agents,
deduplicating findings, and editing files — is performed by the *model* following
`SIMPLIFY_PROMPT` (`ZOf`)'s instructions. This "behavior-as-prompt" design is the
same pattern used by `/loop` and `/batch`; see [batch_command.md](batch_command.md)
§1 for the shared rationale (the skill ships a prompt, not orchestration code).

The registration carries four user-facing metadata fields plus the
implicit guard flag `isHidden:!userInvocable` (`cli_inner_pretty.js:647979-647985`):

- `menuDescription`: `"Clean up the changed code without changing behavior"` — **NEW in 2.1.183** (`cli_inner_pretty.js:647981`; see §6).
- `description`: `"Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use /code-review for that."` (`cli_inner_pretty.js:647982-647983`).
- `argumentHint`: `"[<target>]"` (`cli_inner_pretty.js:647984`).
- `userInvocable: true` (`cli_inner_pretty.js:647985`).

Note what is **absent**: unlike `/batch`, there is **no** `disableModelInvocation`
flag and **no** `whenToUse`. `/simplify` *is* model-invocable
(`userInvocable: true` only flips `isHidden`); the asset inventory records it as
"model-invocable-but-not-listed" in `assets/slash_commands.json`, consistent with
the registration carrying a `description` (which doubles as the model-facing
`whenToUse`) but no separate menu listing beyond `menuDescription`.

---

## 2. The 4-angle fan-out (core algorithm)

### `SIMPLIFY_PROMPT` (`ZOf`) — the 3-phase quality-review prompt

**What it does:** Assembles a single prompt that drives a Phase 0 → Phase 1 →
Phase 2 pipeline: gather the diff, fan out into four single-angle review agents
that run concurrently, then converge by deduplicating and applying their
findings. It is declared at `cli_inner_pretty.js:648003` and assigned inside the
lazy module-init `NKl` at `cli_inner_pretty.js:648004`; the template body spans
`cli_inner_pretty.js:648007-648036`.

**How it works (step by step):**

1. **Header + framing (`cli_inner_pretty.js:648007-648011`).** The prompt opens
   with the literal title `` `/simplify → 4 cleanup agents in parallel → apply
   the fixes` `` and the framing sentence: *"You are improving the quality of the
   changed code, not hunting for bugs… Do not look for correctness bugs — that is
   what `/code-review` is for."* This framing is load-bearing — it is the
   division-of-labor contract analysed in §3.

2. **Phase 0 — Gather the diff (`${_dt}`, `cli_inner_pretty.js:648013`).** The
   `DIFF_PREAMBLE` (`_dt`, body at `cli_inner_pretty.js:435519`) instructs the
   model to run `git diff @{upstream}...HEAD` (falling back to `git diff
   main...HEAD` / `git diff HEAD~1`), and — crucially — to *also* run `git diff
   HEAD` and fold in working-tree changes when the range diff is empty or there
   are uncommitted edits, "because the review often runs before the commit." If a
   PR number / branch / file path was passed as an argument it reviews that target
   instead. This establishes the **review scope** that every agent shares.

3. **Phase 1 — Fan out 4 agents (`cli_inner_pretty.js:648014-648027`).** The
   prompt tells the model to *"Launch **4 independent review agents** via the
   `${vs}` tool, all in a single message so they run concurrently"* — `${vs}` is
   `AGENT_TOOL_NAME = "Agent"` (`cli_inner_pretty.js:149939`). Each agent is
   handed the diff plus exactly one of the four angle blocks
   (`${bdt}`/`${fLe}`/`${mLe}`/`${ALe}`), and each is required to return findings
   shaped as `file`, `line`, a one-line `summary`, and **the concrete cost** —
   "what is duplicated, wasted, or harder to maintain." Note the `### Reuse`
   header is hardcoded inline in `ZOf` while only the Reuse *body* (`bdt`) is
   interpolated; the other three angle constants carry their own `###` headers.

4. **Phase 2 — Converge and apply (`cli_inner_pretty.js:648028-648035`).** The
   model waits for all four agents, **dedups findings that point at the same line
   or mechanism**, and fixes each survivor directly. It is told to **skip** any
   finding whose fix would (a) change intended behavior, (b) require changes well
   outside the reviewed diff, or (c) be a likely false positive — "note the skip
   rather than arguing with it" — and to finish with a short summary of what was
   fixed vs skipped (or confirm the code was already clean).

**Why this approach (parallel single-angle agents instead of one reviewer):**

- **Recall through specialization.** Splitting into four *single-concern* agents
  gives each a narrow, exhaustive mandate. One generalist reviewer reading the
  whole diff tends to surface only the most salient issue per region; four
  specialists each sweeping for one class of problem raise recall on the long
  tail (a reuse duplication and an efficiency regression on the same function are
  both found, because two different agents are looking).
- **Independence avoids anchoring.** Because the agents run concurrently and do
  not see each other's output, none anchors on another's framing. The price is
  redundant findings on the same line — paid down explicitly by the Phase 2
  dedup-by-line-or-mechanism step.
- **Single-message launch is the concurrency lever.** The "all in a single
  message so they run concurrently" instruction is what makes this a *fan-out*
  rather than four serial reviews — the model issues four `Agent` tool calls in
  one assistant turn so the harness runs them in parallel. This is the same lever
  `/batch` pulls for its worktree agents.
- **Convergence is deterministic-by-prompt, not by code.** All the dedup/apply/
  skip logic lives in prose, not in a reducer — consistent with the bundled-skill
  "behavior-as-prompt" philosophy. The trade-off: no hard guarantee the model
  dedups perfectly, bought back by keeping zero orchestration code to maintain.

**Key insight:** `/simplify` is a *map-reduce over review angles*. The map step
is "four agents, one angle each, concurrent, structured findings"; the reduce
step is "dedup by line/mechanism, apply, skip-with-note." The angle blocks are
the only thing that varies between the four mapped agents — which is exactly why
they are factored into shared constants (§4).

---

## 3. Quality-only vs bugs — the division-of-labor decision

**What it does:** `/simplify` *deliberately excludes* correctness review. Its own
prompt says so twice — once in the framing sentence (*"not hunting for bugs… Do
not look for correctness bugs — that is what `/code-review` is for"*,
`cli_inner_pretty.js:648009-648011`) and once in the `description` field
(*"Quality only — it does not hunt for bugs; use /code-review for that."*,
`cli_inner_pretty.js:647982-647983`).

**How it works:** The four angles are all *quality* dimensions — duplication,
complexity, waste, depth. None asks "is this correct?" Correctness is routed to a
sibling command, `/code-review`, which (verified in the same shared angle block,
§4) runs angles framed around *"reviewing for **recall**… catch every real bug"*
(`cli_inner_pretty.js:435680`). The two commands draw from the **same** pool of
module-level angle constants but compose **different** subsets:

- `/simplify` (`ZOf`) wires **Reuse + Simplification + Efficiency + Altitude**.
- `/code-review` family wires bug-recall angles **plus** the `Conventions
  (CLAUDE.md)` angle `Sdt` (`${Sdt}` interpolated at
  `cli_inner_pretty.js:435697`, `:435769`, `:435795` — never inside `ZOf`).

**Why this approach (split quality from correctness):**

- **Different failure modes need different precision/recall trade-offs.** A
  correctness bug is high-cost-if-missed, so `/code-review` is tuned for *recall*
  ("catch every real bug", even uncertain ones). A quality cleanup is
  low-cost-if-missed but high-cost-if-wrong (a "simplification" that subtly
  changes behavior is a regression), so `/simplify` is tuned for *precision* — its
  Phase 2 explicitly skips anything that "would change intended behavior" or is a
  "false positive." Putting both mandates in one command would force a single
  precision/recall setting that is wrong for one half.
- **Composability via shared angles.** Because the angles are independent
  constants, the team can offer *two products* (cleanup vs bug-hunt) from one
  angle library without duplicating prompt text — change the Efficiency wording
  once and both consumers inherit it.
- **User mental model.** "Run `/simplify` to tidy; run `/code-review` to find
  bugs" is a clean two-tool contract. The explicit cross-pointer in both the
  prompt and the description means the model itself redirects users who ask
  `/simplify` to find a bug.

**Key insight:** The honest scope boundary is *enforced in the prompt, twice*,
precisely because the model would otherwise drift into bug-hunting (the diff is
right there, and bugs are tempting to report). The redundant statement is a
guardrail, not an accident.

---

## 4. The shared angle constants — the reuse insight

All five review angles live in **one shared `var` declaration block** at
`cli_inner_pretty.js:435519-435559`, *not* co-located with `OKl`. They are reused
across the entire review family (`/simplify` and the `/code-review` prompts both
interpolate from this block). The four wired into `/simplify`:

- `DIFF_PREAMBLE` (`_dt`) — Phase 0 diff-gathering preamble (`cli_inner_pretty.js:435519`).
- `REUSE_ANGLE_BODY` (`bdt`) — *"Flag new code that re-implements something the codebase already has — Grep shared/utility modules and files adjacent to the change, and name the existing helper to call instead."* (`cli_inner_pretty.js:435521`).
- `SIMPLIFICATION_ANGLE` (`fLe`) — *"Flag unnecessary complexity the diff adds: redundant or derivable state, copy-paste with slight variation, deep nesting, dead code left behind. Name the simpler form that does the same job."* (`cli_inner_pretty.js:435525`).
- `EFFICIENCY_ANGLE` (`mLe`) — wasted work: *"redundant computation or repeated I/O, independent operations run sequentially, blocking work added to startup or hot paths"* **plus** the new closure/memory-leak paragraph (§6) (`cli_inner_pretty.js:435531`).
- `ALTITUDE_ANGLE` (`ALe`) — *"Check that each change is implemented at the right depth, not as a fragile bandaid…"* (`cli_inner_pretty.js:435554`).

**Why factor the angles into shared module-level constants:**

- **Single source of truth across reviewers.** The Efficiency angle is identical
  whether you `/simplify` or `/code-review`; storing it once means the two
  consumers cannot drift. This is the same DRY discipline the codebase preaches
  for tool-name constants (`AGENT_TOOL_NAME = "Agent"`, imported, never
  literalized).
- **Composition over duplication.** `ZOf` is *assembled* from `${_dt} … ${bdt}
  ${fLe} ${mLe} ${ALe}` rather than written as one monolith. Adding/removing an
  angle from a reviewer is a one-token interpolation edit, not a copy-paste —
  exactly how the 4th angle was added without touching the other three (§6).
- **Trade-off — locality lost for sharing gained.** The cost is that the angle
  text lives ~212k lines away from `OKl` in the bundle, so reading `/simplify`'s
  behavior requires chasing five symbols. The reconstruction deliberately
  **co-locates** the angle consts with the skill in the `.ts` (matching the
  v2.1.88 idiom) for readability, while the anchor comments preserve the true
  shared-block locations.

**Key insight:** The angle list *is* the review product. Because angles are data
(constants) not code (branches), the difference between "cleanup review" and "bug
review" is a different **selection** of the same data — the cleanest possible
expression of the §3 division of labor.

---

## 5. The 4th angle 'Altitude' (`ALe`), and the unused 5th 'Conventions' (`Sdt`)

### Altitude — what "right depth vs bandaid" means

The Altitude angle (`ALe`, `cli_inner_pretty.js:435554`) reads in full:

> ### Altitude
>
> Check that each change is implemented at the right depth, not as a fragile
> bandaid. Special cases layered on shared infrastructure are a sign the fix
> isn't deep enough — prefer generalizing the underlying mechanism over adding
> special cases.

**What it does:** It is a *meta-quality* angle. Where Reuse/Simplification/
Efficiency look at the *shape* of the code, Altitude looks at the *level of
abstraction at which the change was made* — is the fix addressing the root
mechanism, or papering over a symptom with a special case?

**Why it is its own angle (and post-2.1.88):** The v2.1.88 ancestor launched
**three** agents — *Code Reuse*, *Code Quality*, *Efficiency* (see the named-TS
`src/skills/bundled/simplify.ts`). "Altitude" has **no** v2.1.88 ancestor; it is a
genuinely new review dimension introduced after 2.1.88 (already present by
2.1.156 as `nq$`, `cli_inner_pretty.js:600293` (v2.1.156)). The reason it warrants
a *separate* agent rather than a bullet inside "Simplification" is that altitude
is an *architectural* judgement that is easy to miss when you are hunting for
local complexity — a special-case bandaid can be perfectly simple, well-named,
and non-redundant while still being at the wrong altitude. Giving it a dedicated
agent with a single mandate is the only way the fan-out reliably surfaces it.

**Key insight:** "Altitude" is the angle that catches *the right fix done at the
wrong layer* — a class of problem invisible to the other three precisely because
those three reward locally-clean code, and a bandaid can be locally clean.

### The unused 5th angle — `Sdt` "Conventions (CLAUDE.md)" (honest scope note)

A **fifth** angle, `CONVENTIONS_ANGLE` (`Sdt`, `cli_inner_pretty.js:435541`),
lives in the *same shared block* as the other four. It instructs an agent to find
the governing `CLAUDE.md` files (user-level `~/.claude/CLAUDE.md`, repo-root, plus
any ancestor-directory `CLAUDE.md`/`CLAUDE.local.md`) and flag *quotable* rule
violations only.

**It is NOT wired into `/simplify`.** Verified two ways:

1. `ZOf` interpolates only `_dt`, `bdt`, `fLe`, `mLe`, `ALe` — `Sdt` never appears
   in the `ZOf` body (`cli_inner_pretty.js:648007-648036`).
2. Every `${Sdt}` interpolation in the bundle (`cli_inner_pretty.js:435697`,
   `:435769`, `:435795`) sits inside a *bug-recall* prompt — the one at
   `:435680` opens *"You are reviewing for **recall** … catch every real bug"* —
   i.e. the `/code-review` family, **not** `/simplify`.

So `Sdt` belongs to the `/code-review` family and is intentionally omitted from
`/simplify`. It is recorded here as an adjacent constant for completeness, not as
part of `/simplify`'s behavior — an honest scope boundary the reconstruction
preserves.

---

## 6. `getPromptForCommand` — arg handling (prepend, not append)

**What it does:** When the user passes an argument (a PR number, branch, or file
path to focus on), `getPromptForCommand` **prepends** a `` `Review target:
`<arg>`` `` line before the prompt; with no argument it emits `SIMPLIFY_PROMPT`
unchanged (`cli_inner_pretty.js:647986-647999`):

```javascript
async getPromptForCommand(e) {
  let t = e.trim();
  return [{ type: "text", text: `${t ? `Review target: \`${t}\`\n\n` : ""}${ZOf}` }];
}
```

**Why prepend (delta vs the v2.1.88 ancestor's append):** The v2.1.88 ancestor
*appended* a `## Additional Focus\n\n${args}` block at the **end** of the prompt.
v2.1.183 instead *prepends* `Review target: \`<arg>\`` at the **start**. The
rationale is operational ordering: Phase 0 (`_dt`) tells the model *"If a PR
number, branch name, or file path was passed as an argument, review that target
instead."* For that instruction to bind, the target must already be in context
when the model reads Phase 0. A trailing "Additional Focus" block is read *after*
the model has already chosen a diff range; a leading "Review target" line scopes
the entire review from the first token. The semantic shift from "additional
focus" (an extra lens) to "review target" (the *scope selector*) is the
substantive change — the arg now *selects what to review*, not merely *what to
emphasize*.

**Key insight:** Moving the arg from suffix to prefix converts it from a hint into
a scope directive that Phase 0 can act on — wording and *position* together change
the behavior.

---

## 7. Evolution

### v2.1.88 → v2.1.183 (carried-in changes, NOT a 156→183 delta)

These changes predate this build (already present by 2.1.156); listed for the
full lineage:

- **3 → 4 agents.** v2.1.88 launched three agents (Reuse / Quality / Efficiency);
  the line gained the 4th **Altitude** angle (§5). Already 4-agent in v2.1.156
  (`nq$`, `cli_inner_pretty.js:600293` (v2.1.156)).
- **Quality-only framing + `/code-review` pointer** added to both the prompt and
  the `description`.
- **Arg handling moved from append (`## Additional Focus`) to prepend (`Review
  target:`)** (§6) — already prepending in v2.1.156
  (`cli_inner_pretty.js:601357-601370` (v2.1.156)).
- **Angles factored into shared module-level constants** reused by the
  `/code-review` family (§4).

### v2.1.156 → v2.1.183 (the only changes in this build)

The skill was **already 4-agent** in v2.1.156, so the structure is unchanged. The
delta is exactly two prompt-text/registration changes (everything else is
re-mangled symbols + line shifts: prompt `Ehz`→`ZOf`, module-init `kO9`→`NKl`,
angles `dq$`→`_dt` / `BI8`→`bdt` / `cq$`→`fLe` / `lq$`→`mLe` / `nq$`→`ALe`,
registrar `bA`→`ap`, tool `sq`→`vs`):

1. **NEW `menuDescription` field.** v2.1.183 registration adds
   `menuDescription: "Clean up the changed code without changing behavior"`
   (`cli_inner_pretty.js:647981`). The v2.1.156 registration `vO9` went **straight
   from `name:"simplify"` to `description:`** with no `menuDescription` at all —
   verified at `cli_inner_pretty.js:601350-601372` (v2.1.156).

2. **Efficiency angle gained a closure / memory-leak paragraph.** The v2.1.156
   Efficiency angle `lq$` ended *"…blocking work added to startup or hot paths.
   Name the cheaper alternative."* (`cli_inner_pretty.js:600288-600291`
   (v2.1.156)). v2.1.183 `mLe` inserts a new paragraph before that closing
   sentence (`cli_inner_pretty.js:435535-435539`):

   > Also flag long-lived objects built from closures or captured environments —
   > they keep the entire enclosing scope alive for the object's lifetime (a
   > memory leak when that scope holds large values); prefer a class/struct that
   > copies only the fields it needs.

   This adds a JS-specific leak pattern (a closure that captures a large enclosing
   scope and outlives the work) to the Efficiency mandate, with a concrete remedy
   (a class/struct that copies only the needed fields).

3. `description`, `argumentHint`, `userInvocable`, the `Review target:` arg-prefix,
   and the Phase 0 / Phase 1 / Phase 2 body text are otherwise **byte-identical**
   156↔183. (`menuDescription` is the only registration-field change.)

```javascript
// ============================================
// registerSimplifySkill — the 156->183 deltas: new menuDescription + Efficiency leak paragraph
// Location: cli_inner_pretty.js:647978-647985 (183); :601350-601356 (v2.1.156)
// ============================================

// ORIGINAL (for source lookup):
function OKl() { ap({ name: BUt, menuDescription: "Clean up the changed code without changing behavior", description: "Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use /code-review for that.", argumentHint: "[<target>]", userInvocable: !0, async getPromptForCommand(e) { /* prepend Review target: */ } }); }
//   (v2.1.156) function vO9() { bA({ name: "simplify", description: "...same text...", argumentHint: "[<target>]", ... }); }  // <- NO menuDescription

// READABLE (for understanding):
function registerSimplifySkill(): void {
  registerBundledSkill({
    name: 'simplify',
    menuDescription: 'Clean up the changed code without changing behavior', // NEW in 2.1.183
    description: 'Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use /code-review for that.',
    argumentHint: '[<target>]',
    userInvocable: true,
    async getPromptForCommand(args) {
      const target = args.trim()
      const prefix = target ? `Review target: \`${target}\`\n\n` : ''
      return [{ type: 'text', text: `${prefix}${SIMPLIFY_PROMPT}` }]
    },
  })
}

// Mapping: OKl→registerSimplifySkill, ap→registerBundledSkill, BUt→"simplify", ZOf→SIMPLIFY_PROMPT, vO9(v2.1.156)→registerSimplifySkill, bA(v2.1.156)→registerBundledSkill
```

---

## Related Symbols

> Symbol mappings live only in the central index files, never as tables here.
> Slash Commands route to the **Integrations** index per project conventions:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure (LSP, Chrome, IDE, UI, Plugin, Slash Commands)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent tool, subagents)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (review family, code-review)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure (Telemetry, Model)

Key functions in this document:
- `registerSimplifySkill` (`OKl`) — registers the `simplify` bundled skill via `ap`; gained `menuDescription` in 2.1.183 (cli_inner_pretty.js:647978, :647981)
- `SIMPLIFY_PROMPT` (`ZOf`) — the 3-phase quality-review prompt (Phase 0 diff → Phase 1 fan out 4 agents → Phase 2 dedup+apply); assembled in module-init `NKl` (cli_inner_pretty.js:648003, body :648007-648036, init `NKl`:648004)
- `registerBundledSkill` (`ap`) — bundled-skill registrar (= v2.1.88 `registerBundledSkill`); emits `type:"prompt"`/`source:"bundled"`, forwards `menuDescription` (cli_inner_pretty.js:546973, :546993, :547005)
- skill name `"simplify"` (`BUt`) — the slash-command name const (cli_inner_pretty.js:372051)
- `DIFF_PREAMBLE` (`_dt`) — Phase 0 diff-gathering preamble, shared across the review family (cli_inner_pretty.js:435519)
- `REUSE_ANGLE_BODY` (`bdt`) — Reuse angle body (header hardcoded in `ZOf`) (cli_inner_pretty.js:435521)
- `SIMPLIFICATION_ANGLE` (`fLe`) — full Simplification angle (cli_inner_pretty.js:435525)
- `EFFICIENCY_ANGLE` (`mLe`) — full Efficiency angle; **gained the closure/memory-leak paragraph in 2.1.183** (cli_inner_pretty.js:435531)
- `CONVENTIONS_ANGLE` (`Sdt`) — Conventions (CLAUDE.md) angle; **defined but NOT wired into `/simplify`** (used by the `/code-review` family) (cli_inner_pretty.js:435541, consumed :435697/:435769/:435795)
- `ALTITUDE_ANGLE` (`ALe`) — the new 4th angle (right-depth-vs-bandaid); no v2.1.88 ancestor (cli_inner_pretty.js:435554)
- `AGENT_TOOL_NAME` (`vs`) = `"Agent"` — interpolated as `${vs}` in Phase 1 to launch the four review agents (cli_inner_pretty.js:149939)
