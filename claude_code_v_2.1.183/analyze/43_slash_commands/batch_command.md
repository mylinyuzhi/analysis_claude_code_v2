# `/batch` — Deep Analysis (Claude Code v2.1.183)

> `/batch` is the **coordinator/worker fan-out** slash command: it takes one
> sweeping instruction (a migration, a bulk rename, a mechanical refactor),
> researches and decomposes it into 5–30 independently-mergeable units in plan
> mode, then spawns **one background agent per unit** — each in its own git
> worktree — and tracks the resulting PRs in a live status table. Like `/loop`
> and `/simplify`, it is a *bundled skill* (`type:'prompt'`, `source:'bundled'`):
> it ships **no deterministic orchestration code**. The entire 3-phase protocol
> lives in a single generated prompt string; the model is what actually enters
> plan mode, spawns agents, and renders the table, guided by that prompt.
>
> - **Reconstructed readable source (primary input):** [`reconstructed_source/skills/bundled/batch.ts`](reconstructed_source/skills/bundled/batch.ts)
> - **Anchor dossier:** [`reconstructed_source/_anchors_batch.md`](reconstructed_source/_anchors_batch.md)
> - **Conventions:** [`reconstructed_source/_conventions.md`](reconstructed_source/_conventions.md)
> - **PRIMARY truth (183 bundle):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (cited as `cli_inner_pretty.js:NNN`)
> - **Before-picture:** v2.1.156 bundle (tagged `(v2.1.156)`); v2.1.88 named-TS ancestor `src/skills/bundled/batch.ts` (tagged `(v2.1.88)`)

---

## 1. What `/batch` is

`/batch` is registered by `registerBatchSkill` (`pzl`) which calls the
bundled-skill registrar `ap` (= v2.1.88's `registerBundledSkill`) with
`name:"batch"` (`cli_inner_pretty.js:637828-637845`). The registrar emits a
`Command` of `type:"prompt"`. Its `getPromptForCommand(args)` performs two cheap
guards and then returns a single `[{ type:"text", text:<prompt> }]` block — it
**does not orchestrate anything itself**:

```javascript
async getPromptForCommand(e) {
  let t = e.trim();
  if (!t) return [{ type: "text", text: _$f }];          // no instruction -> usage help
  if (!(await T_())) return [{ type: "text", text: y$f }]; // not a git repo -> refuse
  return [{ type: "text", text: h$f(t) }];                // emit the 3-phase coordinator prompt
}
```

(`cli_inner_pretty.js:637839-637844`.) The real work — entering plan mode,
launching subagents, decomposing, spawning worktree agents, and tracking PRs —
is performed by the *model* following `buildBatchPrompt` (`h$f`)'s instructions
and calling the tools named in that prompt (`EnterPlanMode`, `AskUserQuestion`,
`ExitPlanMode`, `Agent`, `Skill`). This "behavior-as-prompt" design is the same
pattern used by `/loop` and `/simplify`; see [loop_command.md](loop_command.md)
§1 for the shared rationale.

The registration carries five user-facing metadata fields plus two guard flags
(`cli_inner_pretty.js:637829-637838`):

- `menuDescription`: `"Plan a large change; background agents each open a PR"` — **NEW in 2.1.183** (`cli_inner_pretty.js:637831`).
- `description`: `"Research and plan a large-scale change, then execute it in parallel across 5–30 isolated worktree agents that each open a PR."`
- `whenToUse`: `"Use when the user wants to make a sweeping, mechanical change across many files (migrations, refactors, bulk renames) that can be decomposed into independent parallel units."`
- `argumentHint`: `"<instruction>"`
- `userInvocable: true`, `disableModelInvocation: true` (the second is load-bearing — see §5).

---

## 2. The coordinator/worker pattern (core algorithm)

### `buildBatchPrompt` — the 3-phase coordinator prompt

**What it does:** `buildBatchPrompt` (`h$f`, `cli_inner_pretty.js:637757-637827`)
interpolates the user's instruction into a fixed `# Batch: Parallel Work
Orchestration` template and returns it as the prompt the model will execute. The
template defines a strict three-phase protocol: **research-and-plan**, **spawn
workers**, **track progress**.

**How it works:**

**Phase 1 — Research and Plan (Plan Mode)** (`cli_inner_pretty.js:637766-637795`).
The model is told to call the `EnterPlanMode` tool *first* — `Call the
`${A7}` tool now to enter plan mode` (`cli_inner_pretty.js:637768`) where
`A7 = "EnterPlanMode"` (`cli_inner_pretty.js:221314`) — then run four sub-steps
inside the read-only plan sandbox:

1. **Understand the scope** — *"Launch one or more subagents (in the foreground —
   you need their results)"* to map every file, pattern, and call site the
   instruction touches (`cli_inner_pretty.js:637770`). Note the explicit
   *foreground* qualifier: research subagents are blocking because their results
   feed the decomposition, unlike the Phase-2 workers which are detached.
2. **Decompose into independent units** — break the work into
   `${uzl}–${dzl}` (= `5–30`, `cli_inner_pretty.js:637847-637848`) self-contained
   units (`cli_inner_pretty.js:637772`), each of which **must** be
   (`cli_inner_pretty.js:637773-637775`):
   - independently implementable in an isolated git worktree (no shared state),
   - mergeable on its own without depending on a sibling unit's PR landing first,
   - roughly uniform in size (split large, merge trivial).

   The prompt also gives a sizing heuristic: *"few files → closer to `${uzl}`;
   hundreds of files → closer to `${dzl}`. Prefer per-directory or per-module
   slicing over arbitrary file lists."* (`cli_inner_pretty.js:637777`).
3. **Determine the e2e test recipe** — figure out how a worker can verify its
   change *end-to-end*, not just via unit tests, scanning for a `claude-in-chrome`
   skill (UI), a `tmux`/CLI-verifier skill (CLI), a dev-server+curl pattern (API),
   or an existing e2e suite (`cli_inner_pretty.js:637779-637783`). **If no concrete
   path is found**, the model must call the `AskUserQuestion` tool
   (`Ff = "AskUserQuestion"`, `cli_inner_pretty.js:221315`) offering 2–3 concrete
   options, *"Do not skip this — the workers cannot ask the user themselves."*
   (`cli_inner_pretty.js:637785`). This is the single point in the whole flow where
   user input is solicited mid-orchestration; it exists precisely because the
   detached Phase-2 workers are headless.
4. **Write the plan** — the plan file must contain the research summary, the
   numbered unit list (title + files + one-line description each), the e2e recipe
   (or a `"skip e2e because …"` justification), and *"the exact worker instructions
   you will give each agent (the shared template)"* (`cli_inner_pretty.js:637789-637793`).

   Phase 1 closes by calling `ExitPlanMode` (`yx = "ExitPlanMode"`,
   `cli_inner_pretty.js:152252`) to present the plan for approval
   (`cli_inner_pretty.js:637795`).

**Phase 2 — Spawn Workers (After Plan Approval)** (`cli_inner_pretty.js:637797-637812`).
Once the plan is approved, the model spawns **one background agent per unit**
using the `Agent` tool (`vs = "Agent"`, `cli_inner_pretty.js:149939`). The prompt
is emphatic and specific about the isolation contract:

> *"**All agents must use `isolation: "worktree"` and `run_in_background: true`.**
> Launch them all in a single message block so they run in parallel."*
> (`cli_inner_pretty.js:637799`)

Each agent's prompt must be **fully self-contained** — the model is told to embed
the overall goal, this unit's specific task (copied verbatim from the plan), the
discovered conventions, the e2e recipe, and *"The worker instructions below,
copied verbatim:"* followed by `${g$f}` — the `WORKER_INSTRUCTIONS` block
interpolated inside a fenced code block (`cli_inner_pretty.js:637801-637810`).
The default `subagent_type` is `"general-purpose"` unless a more specific type
fits (`cli_inner_pretty.js:637812`).

**Phase 3 — Track Progress** (`cli_inner_pretty.js:637814-637825`). After
launching, the model renders an initial markdown status table (one row per unit,
`Status: running`, `PR: —`). As **background-agent completion notifications
arrive**, the model parses the `PR: <url>` line out of each agent's result and
re-renders the table with `done`/`failed` status and the PR link, keeping a brief
failure note for any agent that produced no PR. When all agents report, it renders
the final table plus a one-line summary (`"22/24 units landed as PRs"`).

**Why this approach (coordinator/worker over a single mega-task):**

- **Bounded parallelism via worktree isolation.** Each unit must be
  *independently-mergeable* and run in its own git worktree, so N agents can edit
  the tree concurrently without stepping on each other — a single agent rewriting
  hundreds of files would be one giant unreviewable PR with no parallelism. The
  `5–30` band caps fan-out: below 5 the coordination overhead isn't worth it; above
  30 you flood the background-agent pool and the PR table becomes unmanageable.
- **Plan-gate before spend.** Phase 1 is mandatory plan mode with a human approval
  step (`ExitPlanMode`). Because Phase 2 spawns up to 30 background agents that each
  create a PR — a genuinely expensive, hard-to-undo action — the design forces the
  user to approve the decomposition *before* any code is written. The alternative
  (decompose-and-spawn in one shot) was rejected in favor of this human checkpoint.
- **Result-passing via a text protocol, not a data structure.** Workers report
  through a single `PR: <url>` line and the coordinator parses it. Since this is a
  prompt-driven skill with no shared runtime object, a line-grammar is the only
  channel that survives the detached-agent boundary; it degrades gracefully to
  `PR: none — <reason>` on failure.

**Key insight:** `/batch` is a *plan-mode-fronted, worktree-isolated map/reduce*.
Phase 1 is the **map decomposition** (under human approval), Phase 2 is the
**parallel map** (detached worktree agents), Phase 3 is the **reduce** (parse
`PR:` lines into a status table). The whole thing is encoded as instructions
because the registrar can only return a prompt — the cleverness is that an
otherwise-imperative orchestration is expressed as a self-executing recipe the
model carries out by calling tools.

---

## 3. The worker protocol — `WORKER_INSTRUCTIONS`

**What it does:** `WORKER_INSTRUCTIONS` (`g$f`) is the 5-step checklist embedded
verbatim into every spawned worker's prompt. It is declared at
`cli_inner_pretty.js:637849` and assigned inside the lazy module-init thunk `fzl`
(`E(() => {…})`) at `cli_inner_pretty.js:637858-637868`. The lazy init exists
because the string interpolates `${mH}` (`SKILL_TOOL_NAME = "Skill"`,
`cli_inner_pretty.js:221449`), which is resolved at module-load time, not at
parse time.

**The 5 steps** (`cli_inner_pretty.js:637863-637868`):

1. **Code review** — *"Invoke the `Skill` tool with `skill: "code-review"` to find
   correctness bugs (it reports findings; it does not edit code). Fix any findings
   it surfaces before continuing."*
2. **Run unit tests** — run the project's suite (package.json scripts, Makefile,
   or `npm test`/`bun test`/`pytest`/`go test`); if they fail, fix them.
3. **Test end-to-end** — follow the coordinator's e2e recipe (or skip if the recipe
   says to).
4. **Commit and push** — commit with a clear message, push the branch, and create a
   PR with `gh pr create`; note it in the final message if `gh` is unavailable or
   the push fails.
5. **Report** — end with a single line `PR: <url>`, or `PR: none — <reason>` if no
   PR was created.

### Why step 1 is **code-review** (and not `simplify`)

**What changed:** in the v2.1.88 ancestor (`src/skills/bundled/batch.ts`) worker
step 1 read *"**Simplify** — Invoke the `${SKILL_TOOL_NAME}` tool with
`skill: "simplify"` to review and clean up your changes."* In v2.1.183 it reads
*"**Code review** … `skill: "code-review"` to find correctness bugs (it reports
findings; it does not edit code). Fix any findings it surfaces before continuing."*
This was **already the case in v2.1.156** (`cli_inner_pretty.js:600238` (v2.1.156)
has `skill:"code-review"`), so it predates this build and is *carried in*, not a
156→183 change.

**Why the swap matters (orchestration trade-off):** the worker's job ends in an
irreversible landing action — `gh pr create`. The right gate immediately before
landing is a **correctness gate**, not a cosmetic one. `code-review` *finds
correctness bugs and reports them* so the worker can fix them before opening the
PR; `simplify` is *quality-only — it does not hunt for bugs* (see
[simplify_command.md](simplify_command.md)). Putting `simplify` first would have
let a worker open a clean-but-broken PR. The two skills are complementary, and
`/batch` correctly chose the bug-finding one for the pre-merge slot. (The worker's
verification ladder — review → unit tests → e2e → PR — is a defense-in-depth
sequence: each rung catches a different failure class before the change lands.)

**Key insight:** the worker protocol is itself a mini-pipeline, and the choice of
*which sibling skill* fronts it is a deliberate quality-vs-correctness decision.
`/batch` wires `code-review` (correctness) into workers, while the *standalone*
`/simplify` command wires four quality angles — the same primitives, composed
differently for different jobs.

---

## 4. Guards and edge cases

`getPromptForCommand` runs three guards in order before producing the coordinator
prompt:

### 4.1 Missing instruction → usage help

`if (!t) return [{ type: "text", text: _$f }]` (`cli_inner_pretty.js:637841`). When
`args.trim()` is empty, the skill returns `MISSING_INSTRUCTION_MESSAGE` (`_$f`,
`cli_inner_pretty.js:637852-637857`) — a usage block with three worked examples
(`/batch migrate from react to vue`, `… replace all uses of lodash with native
equivalents`, `… add type annotations to all untyped function parameters`). This
short-circuits *before* the (more expensive, telemetry-emitting) git check, so an
accidental bare `/batch` costs nothing.

### 4.2 Not a git repo → refuse (`getIsGit` gate)

`if (!(await T_())) return [{ type: "text", text: y$f }]`
(`cli_inner_pretty.js:637842`). `getIsGit` (`T_`) is a *memoized* async check
(`wn(async () => …)`, `cli_inner_pretty.js:51962-51966`) that resolves the git root
via `Du(Pt())` and emits `is_git_check_started` / `is_git_check_completed`
telemetry. When false, the skill returns `NOT_A_GIT_REPO_MESSAGE` (`y$f`,
`cli_inner_pretty.js:637850-637851`):

> *"This is not a git repository. The `/batch` command requires a git repo because
> it spawns agents in isolated git worktrees and creates PRs from each. Initialize
> a repo first, or run this from inside an existing one."*

**Why this guard is structural, not cosmetic:** the entire Phase-2 contract is
`isolation: "worktree"` + `gh pr create`. Both are git operations. Without a repo
there are no worktrees to isolate into and no branches to PR from, so the command
is *physically impossible* — the gate fails fast with a message that explains the
causal dependency rather than letting the model discover it mid-orchestration. The
memoization means repeated `/batch` invocations in the same session pay the
filesystem walk once.

### 4.3 `disableModelInvocation: true` — user-only

The registration sets `disableModelInvocation: true`
(`cli_inner_pretty.js:637838`) alongside `userInvocable: true`. This means the main
agent **can never auto-invoke `/batch`** in the middle of a conversation; only a
human typing `/batch …` can trigger it.

**Why:** `/batch` is the most *sweeping and expensive* of the bundled skills — a
single invocation can spawn up to 30 background agents that each open a real PR
against the repo. Letting the model decide to fire that on its own would be a
foot-gun (runaway spend, a flood of PRs, surprise worktrees). Gating it behind
explicit user intent is the conservative choice; the same flag protects
`/simplify` and is the bundled-skill convention for actions with large blast
radius. The corroborating `extract/assets/slash_commands.json` lists `/batch` as a
user-invocable command, consistent with `userInvocable:!0` + `disableModelInvocation:!0`.

---

## 5. Relationships to other systems

- **Background agents / worktree isolation.** Phase 2's `isolation: "worktree"` +
  `run_in_background: true` is exactly the background-agent surface analyzed in
  [36_background_agents/](../36_background_agents/README.md). `/batch` is a *consumer*
  of that machinery: it is the canonical fan-out producer of detached worktree
  agents, and Phase 3's "as background-agent completion notifications arrive"
  depends on the background-agent completion/notification path. The per-worker
  environment isolation that makes parallel worktree edits safe is documented in
  [36_background_agents/worker_env_isolation_2181.md](../36_background_agents/worker_env_isolation_2181.md).
- **`code-review` and `simplify` skills.** Worker step 1 invokes the `code-review`
  bundled skill via the `Skill` tool; `/batch` and `/simplify` are siblings in
  `skills/bundled/`. See [simplify_command.md](simplify_command.md) for why
  `code-review` (correctness) and `simplify` (quality) are deliberately distinct,
  and why `/batch` picks the former for its pre-merge gate.
- **Workflow / `/workflow`.** `/batch` is a fan-out *orchestration* command in the
  same family as the workflow surface in [42_workflow/](../42_workflow/README.md):
  both decompose a large request and drive subagents, but `/batch` specializes in
  the worktree+PR landing pattern whereas the workflow surface is the general
  multi-step driver.
- **Registrar.** All four slash commands route through `registerBundledSkill`
  (`ap`), which in 2.1.183 forwards the new `menuDescription` field
  (`cli_inner_pretty.js:546993`). See
  [registration_and_dispatch.md](registration_and_dispatch.md) for the shared
  registration/dispatch path.

---

## 6. Evolution

### v2.1.88 → v2.1.183 (carried-in changes, NOT a 156→183 delta)

- **Worker step 1 rewritten** from `**Simplify** … skill:"simplify"` to
  `**Code review** … skill:"code-review"`. This already shipped in **v2.1.156**
  (`cli_inner_pretty.js:600238` (v2.1.156)), so it predates this build (analyzed in
  §3). Everything else — the coordinator prompt body, both guard messages,
  `MIN_AGENTS=5`/`MAX_AGENTS=30`, the `getIsGit` gate, and the registration flags —
  is otherwise unchanged from the v2.1.88 ancestor.

### v2.1.156 → v2.1.183 (the only change in this build)

**`menuDescription` field ADDED** to the batch registration:
`menuDescription: "Plan a large change; background agents each open a PR"`
(`cli_inner_pretty.js:637831`). The 2.1.156 registration has **no
`menuDescription`** — confirmed by reading the before-picture, whose
`name:"batch"` registration jumps straight from `name` to `description` with no
menu field (`cli_inner_pretty.js:600204-600219` (v2.1.156)). This is a systematic
2.1.183 schema addition across bundled skills (e.g. `claude-in-chrome` also gained
a `menuDescription` in the same region), and `registerBundledSkill` was updated to
forward it (`cli_inner_pretty.js:546993`).

**Prompt bodies are byte-identical 156→183.** A normalized diff that masked the
`${…}` interpolation variables found *only* the renamed function/const lines
(`gyz`→`h$f`, `Qyz`→`g$f`); every word of the coordinator prompt, the worker
checklist, and both guard messages is unchanged. The verbatim 183 strings were
read directly from `cli_inner_pretty.js:637757-637868` (decoded from the bundle's
`–`/`—`/`…`/`→` escapes to `–`/`—`/`…`/`→`).

**Code snippet — the menuDescription delta:**

```javascript
// ============================================
// registerBatchSkill — the 156->183 delta is the new menuDescription field
// Location: cli_inner_pretty.js:637828-637832 (183); :600204-600207 (v2.1.156)
// ============================================

// ORIGINAL (for source lookup):
function pzl() { ap({ name: "batch", menuDescription: "Plan a large change; background agents each open a PR", description: "Research and plan a large-scale change, then execute it in parallel across 5–30 isolated worktree agents that each open a PR.", /* ... */ }); }
//   (v2.1.156) bA({ name: "batch", description: "Research and plan a large-scale change, ...", ... });  // <- NO menuDescription

// READABLE (for understanding):
function registerBatchSkill(): void {
  registerBundledSkill({
    name: 'batch',
    menuDescription: 'Plan a large change; background agents each open a PR', // NEW in 2.1.183
    description: 'Research and plan a large-scale change, then execute it in parallel across 5–30 isolated worktree agents that each open a PR.',
    // ...
  })
}

// Mapping: pzl→registerBatchSkill, ap→registerBundledSkill, bA(v2.1.156)→registerBundledSkill
```

---

## Related Symbols

> Symbol mappings live only in the central index files, never as tables here.
> Slash Commands route to the **Integrations** index per project conventions:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure (LSP, Chrome, IDE, UI, Plugin, Slash Commands)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents / scheduling adjacent)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure (Telemetry, Model)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent tool, subagents)

Key functions in this document:
- `registerBatchSkill` (`pzl`) — registers the `batch` bundled skill via `ap`; gained `menuDescription` in 2.1.183 (cli_inner_pretty.js:637828, :637831)
- `buildBatchPrompt` (`h$f`) — the 3-phase coordinator prompt builder (Research/Plan → Spawn → Track) (cli_inner_pretty.js:637757)
- `WORKER_INSTRUCTIONS` (`g$f`) — 5-step worker checklist injected verbatim into each agent; step 1 = `code-review` (cli_inner_pretty.js:637849, assigned :637863-637868 inside init `fzl` :637858)
- `MISSING_INSTRUCTION_MESSAGE` (`_$f`) — usage help returned on empty args (cli_inner_pretty.js:637852)
- `NOT_A_GIT_REPO_MESSAGE` (`y$f`) — refusal message when not in a git repo (cli_inner_pretty.js:637850)
- `MIN_AGENTS` (`uzl`) = `5` · `MAX_AGENTS` (`dzl`) = `30` — unit decomposition band (cli_inner_pretty.js:637847, :637848)
- `getIsGit` (`T_`) — memoized async git-repo check; emits `is_git_check_started`/`is_git_check_completed` (cli_inner_pretty.js:51962)
- `registerBundledSkill` (`ap`) — bundled-skill registrar; forwards `menuDescription` (cli_inner_pretty.js:546973, :546993)
- Tool-name constants interpolated into the prompt: `ENTER_PLAN_MODE_TOOL_NAME` (`A7`)=`"EnterPlanMode"` (cli_inner_pretty.js:221314) · `ASK_USER_QUESTION_TOOL_NAME` (`Ff`)=`"AskUserQuestion"` (cli_inner_pretty.js:221315) · `EXIT_PLAN_MODE_TOOL_NAME` (`yx`)=`"ExitPlanMode"` (cli_inner_pretty.js:152252) · `AGENT_TOOL_NAME` (`vs`)=`"Agent"` (cli_inner_pretty.js:149939) · `SKILL_TOOL_NAME` (`mH`)=`"Skill"` (cli_inner_pretty.js:221449)
