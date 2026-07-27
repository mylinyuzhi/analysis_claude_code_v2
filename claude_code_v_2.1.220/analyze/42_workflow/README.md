# 42_workflow — the Workflow tool and dynamic workflow sizing (2.1.195 → 2.1.220)

> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, `build_sha 4073f595`, `build_time 2026-07-24T22:17:45Z`, 872,596 lines).
> BASELINE: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` is a **220** line unless tagged **(193)**.
> Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md) · Ground truth:
> [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md)

## Documents

### Delta documents (changelog-driven, `.195` → `.220`)

| Doc | Covers |
|---|---|
| [workflow_size_guideline.md](workflow_size_guideline.md) | `.202` `/config` row → `.219` `workflowSizeGuideline` settings key → the `medium` default; the size→prose pipeline; the per-process memo and the mid-session attachment that replaces it; the `/config` row-hiding predicate; the over-size warning where an *explicit* guideline gains teeth; the spinner-tip suppressor |
| [workflow_runtime_and_ui.md](workflow_runtime_and_ui.md) | `workflow.run_id`/`workflow.name` OTel attrs; the unicode-escape repair and the `script` exemption; the parse-error line + caret; SDK/desktop progress publishing (delta → snapshot + 10 s heartbeat); the new agent-fan bridge publisher for late-joining Remote Control clients; the save-dialog `CLAUDE_CONFIG_DIR` path; `assertDirChainReal`; the `/workflows` agent-row layout rewrite; two left-arrow bullets proven carryover; **§8** the `.205` `--json-schema` / `agent({schema})` validator — size caps, `validateFormats: false`, the strict-schema converter, the hard exit, and the safety-classifier's 4 KiB schema cap |

### Full-chain documents (round 2 — the runtime layer §5 previously deferred)

| Doc | Covers |
|---|---|
| [workflow_runtime_core.md](workflow_runtime_core.md) | The script sandbox end to end: the `AB` FIFO semaphore and the `min(16, max(2, cpus−2))` per-run width; the 1,000-call and turn-token caps; the `node:vm` context build order, `hardenVMIntrinsics` (14 deleted globals, the TC39 override-mistake fix, JSC `$vm`), the frozen-`Date` determinism shim; `agent`/`parallel`/`pipeline`/`phase`/`log`/`workflow` semantics; the 7-rung retry ladder and the throttle detector; the six cross-realm marshalling closures; the dead `isolation:'remote'` runner; **the auto-mode hand-off classifier (undocumented DELTA)** |
| [workflow_lifecycle.md](workflow_lifecycle.md) | create → run → resume → adopt. The five `validateInput` gates and the tier-dependent enablement default; `CLAUDE_WORKFLOW_NAME_ONLY`; script resolution precedence and the telemetry redactors; `meta` parsing (first-statement, pure-literal) and the inert `phases[].model`; the await transform and why six syntactic forms must be covered; script persistence; the journal's **chained prefix hash** and the five opts that participate in it; the `scriptSha256` adopt pin and why the tool path does not need one; the four terminal transitions |
| [workflow_model_resolution.md](workflow_model_resolution.md) | The five-level `opts.model` precedence chain (`tte`), the **double resolution** (display vs execution) and the `permissionLayers` divergence that poisons `fallbackModel`; the `Explore` family-rank cap and its new env bypass; the Bedrock 1M rewrite; the **NET_NEW `subagent_model_resolve` audit** and its three failure classes; `opts.effort` normalisation and the three different policies for three adjacent options |
| [workflow_state_and_ipc.md](workflow_state_and_ipc.md) | The one state model (three node kinds, index-keyed upsert, log-only trim) and its **seven** consumers; the batcher's two intervals; the RC `fan` projection; the `/workflows` grouping functions and the always-`null` phase stub; steering (skip/retry/kill); the completion notification's five blocks, the exactly-once claim, and the **NET_NEW `<diagnostics>` block + `agents_empty_result` census** |
| [workflow_server_authored_launch.md](workflow_server_authored_launch.md) | **The largest undocumented workflow change in the window.** The `workflow_launch` carrier event and the `__remote-workflow` env path; the `allow_workflows` carve-out for review-origin sessions; the v1 length-prefixed bundle format and its sha256 pin; the ledger's final-vs-transient failure split; the destructive-read handoff slot and `/workflow-launch-exec`; the single-line result protocol with its injection defence and four-stage degradation ladder |

### Symbol staging

| Doc | Covers |
|---|---|
| [../00_overview/symbol_additions_v2_1_220_workflow.md](../00_overview/symbol_additions_v2_1_220_workflow.md) | every symbol table for this module, staged for merge into the four `symbol_index_*.md` files |

---

## 1. The window's story for this theme

Dynamic workflows were already shipped and mature by 2.1.193 — the tool, the `agent()`/`phase()`/
`pipeline()`/`parallel()` script API, the journal, resume-by-`runId`, the `/workflows` progress view, the
save dialog and the phase-group renderers all exist there. So this window contains **no new workflow
capability**. What it contains is a *governance* layer and a batch of plumbing corrections:

1. **`.202` added the only user-facing control over workflow scale in the product** — and it is
   deliberately advisory. The size guideline never blocks an `agent()` call; it appends an English
   sentence to the Workflow tool's description. Three of the four `tko` call sites generate prose and the
   fourth feeds a UI warning threshold. `.219` then made `medium` the default, gave the key a settings
   surface that beats `/config`, and hid the `/config` row while a settings file provides it.
2. **`.202` also fixed a self-inflicted corruption**: a generic "un-double-escape `\uXXXX`" pass over all
   tool inputs was rewriting JavaScript source. The fix is a one-line exemption for the Workflow tool's
   `script` field, plus a Windows-path bail-out and counters on the shared repair walk.
3. **`.198`/`.208`/`.212` are all the same class of bug**: workflow progress reached the terminal
   correctly and reached *every other consumer* as a delta or not at all. `.198` switched the stream-json
   frame from publishing the current batch to publishing the accumulated snapshot; `.208`/`.212` added a
   change-driven publisher for the Remote Control state file's `fan` array, which previously only got
   written when a task started or stopped.
4. **`.216` is the window's one security bullet here**, and it is a genuine defence gap: the pre-existing
   atomic-write guard checked only the *immediate* parent directory with `O_NOFOLLOW`, so a
   repository-committed symlink at `.claude` (the grandparent of `.claude/workflows/foo.js`) was never
   examined. `assertDirChainReal` walks every component.
5. **`.220` itself contributes nothing to this theme** — its single bullet is "Bug fixes and reliability
   improvements". The build carries `.219`'s behaviour, `cEd = "medium"` included (`:389143`).

The through-line worth remembering: three of the six real deltas in this window are *"the terminal was
right and the other consumer was not"*. As Claude Code grew an SDK channel, a desktop REPL bridge, and a
Remote Control state file, the workflow progress model — an index-keyed array accumulated in the task
registry — had to be re-published to each of them, and each republishing path was got wrong once.

**Round 2 revised the first sentence of this section.** The original claim — *"this window contains no
new workflow capability"* — was derived from the changelog plus `grep`-level spot checks of the runtime,
and it is **wrong**. Re-analysing the runtime layer structurally (see §6) found one entire new
subsystem and four smaller undocumented changes, none of which has a changelog bullet. The corrected
statement is: *the changelog describes only the governance and plumbing work; the capability work in
this window went unannounced.*

---

## 2. Per-bullet ledger

Verdict key: **NET_NEW** = mechanism absent in 2.1.193 · **DELTA** = mechanism existed, narrower real
change identified · **CARRYOVER** = the workflow-side code is byte-identical to 2.1.193 · **ELSEWHERE** =
bullet belongs to another module's doc · **INFERRED** = reasoned from code structure, not provable from the
two bundles.

| # | Ver | Bullet (abridged) | Verdict | Anchor (220) | Doc section |
|---|---|---|---|---|---|
| 1 | .202 | "Dynamic workflow size" setting in `/config` (small/medium/large, advisory) | **NET_NEW** | `workflowSizeGuideline` 220=21/193=0; enum `:389146`; caps `:389147`; row `:451504` | size_guideline §1–§4 |
| 2 | .202 | `workflow.run_id` / `workflow.name` OTel attributes | **NET_NEW** (ground truth over-counted — see §4) | `workflow\.run_id` 220=1/193=0 at `:111461`; consumers `:167360`, `:168127`, `:168218` | runtime §1 |
| 3 | .202 | Workflow scripts with unicode quote escapes corrupted before parsing | **DELTA** — regex carryover, guards + `script` exemption new | `tengu_repair_double_escaped_unicode` 220=1/193=0 `:508476`; `UO_` `:508589`; exemption `:531889` | runtime §2.1–2.2 |
| 4 | .202 | Workflow parse errors show the offending line instead of always blaming TypeScript | **NET_NEW** (formatter); hint string rewritten | `dgy` `:275631-275652`; `Abs=80` `:275740`; 193 had one flat string `:422994 (193)` | runtime §2.3 |
| 5 | .202 | `/workflows` agent list layout: wider titles, time column, shorter models, no tool-call counts | **NET_NEW** (both functions rewritten) | `gvS` `:728539`; `Q9a` `:728557`; `qii` `:728581` (220=1/193=0); `lNf=6` `:729794`; 193 `VRf` `:542006 (193)`, `F2l` `:542027 (193)` | runtime §7.1 |
| 6 | .198 | Workflow progress view dropping the earliest agents while the phase counter stayed correct, in SDK and desktop-app sessions | **NET_NEW** (snapshot publishing) | `onSdkEmit` 220=2/193=0 `:388636`; snapshot `:388655`; heartbeat `l6y=1e4` `:388913`; 193 delta publish `:424807/:424821 (193)` | runtime §3 |
| 7 | .208 | RC clients attaching to a terminal-hosted session not seeing bg agents / workflow progress until a task started or stopped | **NET_NEW** (third bridge subscription) | `bHs.subscribe` `:335476`; `Ocd` `:335489`; 193 had **two** subscriptions `:464880-464906 (193)`, `fan` written only at `:465205 (193)` | runtime §4 |
| 8 | .212 | Workflow agent grid staying empty for RC clients joining mid-run | **NET_NEW** — same mechanism as #7 | as #7; scoping anchors are mis-anchors (§4) | runtime §4 |
| 9 | .208 | Workflow save dialog showing `~/.claude/workflows/` not the `CLAUDE_CONFIG_DIR` location | **DELTA** — display-only; the write was already correct | `~/.claude/workflows` 220=**0**/193=**1** (`:541825 (193)`); 220 label `:728335`; `X$t()` `:388219` | runtime §5 |
| 10 | .216 | Workflow saves and scheduled-task writes following a symlink at `.claude` | **NET_NEW** guard on carryover writer | `assertDirChainReal` 220=2/193=0 `:51990`; `Refusing to write under symlinked or non-directory path` 220=1/193=0 `:52005`; sites `:728206`, `:230135` | runtime §6 |
| 11 | .219 | `workflowSizeGuideline` settings key; `/config` row hidden while a settings file sets it | **NET_NEW** | zod `:60914-60919`; `Q$t` `:389149`; `!Q$t()` at `:452357` and `:668331` | size_guideline §2, §4, §9 |
| 12 | .219 | Dynamic workflows default to a medium size guideline (fewer than 15 agents) | **NET_NEW** (`cEd`), **INFERRED** that `.202` had no default | `cEd = "medium"` `:389143`; `Dft` `:389152-389155` | size_guideline §1, §3, §10 |
| 13 | .219 | Current default workflow size added to the running-workflow status line, with a `/config` pointer | **NET_NEW** — one added child on an otherwise identical line | `kya` `:651528-651549`, mounted at `:651506`; 193 line `:426083-426097 (193)` has no such child | size_guideline §6 |
| 14 | .203 | Left arrow no longer closes bg tasks / diff / workflow **detail** views — press Esc instead | **CARRYOVER** (workflow side) | `de()` `:729536` ≡ `le()` `:542986 (193)`; `left`→step-out `:729625` ≡ `:543075 (193)`; at the `phases` level left **still** closes (`:729545`) | runtime §7.2 |
| 15 | .206 | Left arrow not stepping back out of a phase or agent in the workflow detail view | **CARRYOVER** (workflow side) — scoping anchor is a mis-anchor | as #14; `tengu_left_arrow_editing_guard` `:559928` is the **prompt-input** empty-line guard, not this view | runtime §7.2 |
| 16 | .195 | Duplicate recap lines: a schema-rejected `StructuredOutput` no longer renders with its retry | **ELSEWHERE** — `04_tools` (rendering half only) | strict-schema compiler `fty` `:231103-…`, `tengu_structured_output_strict_schema` `:231113` — the *schema* half is now runtime §8.6 | runtime §8.6 (partial) |
| 17 | .205 | `--json-schema` silently unstructured on an invalid schema; `format` keyword rejected | **NET_NEW** (3 independent changes in `fty`) — **owned here**, was cycle C9 | `fty` `:231103-231141` vs `qVd` `:229472 (193)`; `validateFormats: !1` `:231106`; `schema too large` `:231105` (220=2/193=0); `dty=1e5`/`pty=1e4` `:231148-231149`; hard exit `:829680-829684` vs `:713209 (193)` | runtime §8 |
| 18 | .208 | Deep research labelling every Fetch-phase agent "unknown" | **ELSEWHERE** — `52_code_review` | `deep-research: Scope → pipeline(...Fetch+Extract)` `:424458` (220=1/193=1) | not covered here (§5) |
| 19 | .210 | `ultracode` keyword firing on non-human input (webhooks, relayed PR comments) | **ELSEWHERE** — `40_system_prompt` | `isHumanTypedPrompt` 220=2/193=0 `:516671`; conjuncts `suppressWorkflowKeyword` 7/8 and `preExpansionInput` 4/4 are carryover | not covered here (§5) |
| 20 | .207 | RC sessions hosted by the desktop app not showing bg agent and workflow progress on mobile/web | **ELSEWHERE** — `54_remote_control`; partially explained by runtime §3.3 (the emit gate widened from `isNonInteractive()` to `isNonInteractive() \|\| isReplBridgeActive()`, `:388553`) | `:388553`; 193 gate `!Tr()` `:424806 (193)` | runtime §3.3 (partial) |
| 21 | .196 | Background session reliability: long-running commands and workflows survive process stop/restart/update | **ELSEWHERE** — `36_background_agents` | `tengu_bg_handoff_settle` `:869956` | not covered here (§5) |
| 22 | .196 | `/code-review` workflow: merged five cleanup finders into one, −25% tokens | **ELSEWHERE** — `52_code_review` | — | not covered here (§5) |

**Totals for this theme:** 14 bullets analysed here (12 with a proven code delta, 2 proven carryover),
6 assigned to other modules, 2 partially covered (#16, #20), 1 inference flagged (#12).

---

## 3. Bonus finding: what actually changed in the Workflow tool's description across 27 releases

The seed brief asked for a full diff of the tool description prose (`rMs`, `:388943-389101`) against
2.1.193 (`RTo`, `:425026-425184 (193)`). Both strings are **159 pretty-printed lines**, and the diff is
only **six** hunks — five of which are symbol renames with identical values:

| Hunk | 2.1.193 | 2.1.220 | Effect |
|---|---|---|---|
| binding | `RTo` | `rMs` | rename only |
| Agent-tool referral | `Use the Agent tool for individual subagents` | `Use the ${qo} tool (if available) for individual subagents` | `qo = "Agent"` (`:162358`) — same word, now interpolated, **plus the hedge "(if available)"** |
| script-persistence sentence | `${WYp}` / `${UYp}` | `${h6y}` / `${p6y}` | all four are `""` (`:425019-425022 (193)`, `:388935-388938`) — no change |
| `opts.isolation` type | `${jYp}` = `"'worktree'"` | `${f6y}` = `"'worktree'"` | identical value |
| `opts.agentType` example | `(e.g. 'Explore', 'code-reviewer')` | `(e.g. 'general-purpose', 'code-reviewer')` | example agent type changed |
| child-workflow group prefix | `"${NBe} name"` = `"▸ name"` (`:54179 (193)`) | `"${Txt} name"` = `"▸ name"` (`:58435`) | identical glyph |
| resume paragraph | ends `… 100% cache hit. Date.now()/Math.random()/…` | inserts a new sentence before it (below) | **the one substantive prose addition** |

The added sentence, `:389101`:

> *"Before diagnosing why a completed workflow returned an empty or unexpected result, Read
> `<transcriptDir>/journal.jsonl` — it records each agent's actual return value; do not assume cached
> results are non-empty."*

Three conclusions that matter for anyone reading the tool prose as a spec:

- **`opts.effort` and `opts.isolation` wording is byte-identical carryover.** The effort tier list
  (`'low' | 'medium' | 'high' | 'xhigh' | 'max'`), the *"EXPENSIVE (~200-500ms setup + disk per agent)"*
  worktree warning, and the auto-removal note all predate this window. Do not write them up as new.
- **The size-guideline sentence is not in this string at all.** It is appended at call time by
  `iMs(...)` inside `prompt()`/`description()` (`:389362`, `:389365`) — see
  [workflow_size_guideline.md §5.1](workflow_size_guideline.md).
- **`'Explore' → 'general-purpose'`** is a small but real correction: `Explore` is a *built-in* agent type,
  and the sentence is about *custom* agent types (*"uses a custom subagent type … instead of the default
  workflow subagent"*). Naming a built-in as the example for a custom-type parameter invited the model to
  pass built-ins where the intent was user-defined agents. The v2.1.88 named tree confirms both the name
  and the intent: `3rd/claude-code/src/entrypoints/sdk/coreSchemas.ts:406` describes `agentType` with the
  **identical example pair** — `'Agent type name (e.g., "general-purpose", "code-reviewer")'` — and
  `3rd/claude-code/src/utils/forkedAgent.ts:212` uses `command.agent ?? 'general-purpose'` as the registry
  default. So `.202`-era prose had drifted from the SDK's own documented wording and this hunk realigns it.
  (That tree is 132 versions stale — it corroborates the *name* and *intent*, never current behaviour.)
- **"(if available)"** hedges for sessions where the `Agent` tool is disabled (org policy, tool-search
  deferral, `--allowed-tools`). Previously the prose unconditionally told the model to fall back to a tool
  that might not be present.

---

## 4. Where this module disagrees with the tree's own scoping artefacts

Discrepancies are findings. Four, all verified by re-grepping in both bundles:

1. **`_GROUND_TRUTH_verified_anchors.md` §3 under-reports bullet #2.** It records
   `workflow.run_id` as `220=3 / 193=2` — *"partially pre-existing. Find the one new emission site."* That
   probe used an **unescaped dot**, so it also matched `workflow_run_id`. With a literal dot the OTel
   attribute is `220=1 / 193=0` — **fully net-new**. The two 193 hits are the snake_case fields of
   `tengu_workflow_completed` (`:424852 (193)`) and `tengu_workflow_phase_completed` (`:424892 (193)`),
   a different telemetry channel, and they are carryover. Ground truth's own §3 method note ("always run
   `grep -c` in both") is right; the shell just needs the dot escaped.
2. **`_scope_v211_214.md` #22 and `_scope_v206_210.md` #14/#22 mis-anchor the RC agent-grid bullets.**
   `tengu_frame_publish_context` (`:381716`) gates an **Artifact** publish field (`host: "frame"` at
   `:381722`; consumers `:381809`, `:382719`) — nothing to do with Remote Control frames.
   `tengu_remote_subagent_frame_nested` (`:757401`) sits inside `let ut = null; if (ut !== null) { … }`
   (`:757390-757391`) — **dead code in the shipped bundle**; the event cannot fire in 2.1.220. The real
   mechanism is the third bridge subscription at `:335476`.
3. **`_scope_v215_220.md` #18 mis-anchors the `.216` symlink bullet.** `symlink at` is 220=2/193=2, and
   neither 220 hit is this bullet (`:224564` is the git-worktree guard; `:541406` is the native-installer
   symlink removal log). The real anchor is `assertDirChainReal`, 220=2/193=0.
4. **`_scope_v206_210.md` #19 mis-anchors the `.206` left-arrow bullet.**
   `tengu_left_arrow_editing_guard` (`:559928`) is in the **prompt-input** handler's empty-line branch
   (`if (i && !Me.shift && W.text === "")`, `:559926`), not the workflow detail view. Every line of the
   workflow detail view's left-arrow path is byte-identical to 2.1.193.

Additionally, a **carryover trap** that reads convincingly as this window's fix and is not: the workflow
progress reducer's log-only trim (`qPs` `:386543-386555`) already refused to evict `workflow_agent` /
`workflow_phase` entries in 2.1.193 (`hTo` `:422765-422777 (193)`, byte-identical —
`type === "workflow_log"` is **220=3 / 193=3** and `progressVersion:` is **220=4 / 193=4**). Anyone
matching bullet #6's text to code will land there first. The actual fix is in the *publisher*, not the
reducer.

Six further mechanism-level carryovers, each measured in both bundles, are documented in the docs so that
nobody re-derives them as introductions:

| Mechanism | Proof literal | 220 | 193 |
|---|---|---|---|
| the `\uXXXX` repair regex itself | `[dD][89aAbB]` (regex source) | 1 | 1 |
| the atomic writer's symlink guards | `Refusing to write through symlink` | 4 | 4 |
| " (parent-dir variant) | `Refusing to write into symlinked directory` | 2 | 2 |
| the workflow save telemetry event | `tengu_workflow_saved` | 1 | 1 |
| the running-workflow status line itself | `to monitor and save` | 1 | 1 |
| the agent-row status vocabulary (while both row functions were rewritten) | `push("stopped")` / `push("queued")` | 1 / 1 | 1 / 1 |

---

## 5. Not covered

Honest list of what this module did **not** analyse, and why.

- **Bullet #17 (`--json-schema`) is now COVERED here** — see [runtime §8](workflow_runtime_and_ui.md).
  It was previously routed to `51_headless_sdk` while that module routed it back (cycle **C9** in
  [`../00_overview/_xval_contradictions.md`](../00_overview/_xval_contradictions.md) §2). Ownership was
  reassigned to this module because the validator `wir`/`fty` has three consumers and one of them is the
  Workflow tool's own `agent({ schema })` option (`:387454`, call site byte-identical to
  `:423674 (193)`), plus the second `schema too large` in the bundle (`:387247`) is a workflow-only
  safety-classifier guard. §8 is the owning write-up; nothing about this bullet is deferred.
- **Bullet #16 (`StructuredOutput` recap duplication) is only partially covered.** Runtime §8.6 documents
  the strict-schema derivation `Bpo` and the send-time fallback at `:508171-508180`, which is the
  *schema* half. I did **not** trace the recap-duplication **rendering** path (the transcript component
  that drew a rejected `StructuredOutput` alongside its retry) — that belongs to `04_tools`.
- **Bullet #18 (deep-research Fetch-phase agents labelled "unknown")** — the anchor
  `deep-research: Scope → pipeline(...Fetch+Extract)` is `220=1 / 193=1`, i.e. the built-in workflow script
  is carryover, so the delta is in the label-derivation path. Owned by `52_code_review`; not traced.
- **Bullet #19 (`ultracode` on non-human input)** — `isHumanTypedPrompt` is `220=2 / 193=0` at `:516671`
  and I read that line while tracing the attachment producer (it is the immediate neighbour of the
  size-guideline attachment), but the human-origin propagation chain is `40_system_prompt`'s.
- **Bullets #21, #22** — background-agent durability and `/code-review` finder consolidation; neither
  touches the Workflow tool or its UI.
- **Bullet #20 is only partially covered.** I proved the frame-emit gate widened from
  `isNonInteractive()` (193 `!Tr()` at `:424806 (193)`) to `isNonInteractive() || isReplBridgeActive()`
  (`:388553`), which is the workflow-progress half of the bullet. The background-agent half and the
  desktop-app→mobile/web relay belong to `54_remote_control` and were not traced.
- **Bullet #12's `.202`-vs-`.219` split is an inference.** 2.1.193 predates the entire feature
  (`workflowSizeGuideline` 193=0), so the two available bundles cannot separate `.202` from `.219`. The
  argument from code structure is laid out in [workflow_size_guideline.md §10](workflow_size_guideline.md)
  and explicitly labelled. A 2.1.202-or-later intermediate bundle would settle it.
- **Bullets #14/#15's true location.** I proved the workflow detail view is unchanged; I did **not** find
  which host component's left-arrow handling changed in `.203`/`.206`. Two hypotheses are stated in
  runtime §7.2 without picking one. `48_accessibility_ui` owns the host view and should close this.
- ~~**The Workflow runtime's script sandbox** … was **not** re-analysed.~~ **CLOSED by round 2** — see
  §6 and the five full-chain documents. The deferral's stated justification ("`grep`-level spot checks
  showed no changelog bullet claiming a change there") turned out to be the wrong test: there is no
  bullet, *and* there are five undocumented changes.
- ~~**`tengu_workflow_launch_event`** … left as an open question.~~ **CLOSED by round 2** — it is not a
  gate/event pair in the Workflow tool's launch path at all; it belongs to the server-authored launch
  channel documented in
  [workflow_server_authored_launch.md](workflow_server_authored_launch.md).

Still open after round 2:

- **Whether the `allow_workflows` carve-out for review-origin sessions is intended.**
  ([server_authored_launch §2](workflow_server_authored_launch.md)) A managed setting still stops it, so
  it is not an escape from all policy — but it is a documented-nowhere asymmetry.
- **The `model` permission-layer divergence** ([model_resolution §1.3](workflow_model_resolution.md)) is
  recorded as a defect with the same shape in both bundles. It has not been confirmed against a session
  that actually installs such a layer.
- **`38_permissions` / `54_remote_control` cross-checks.** The `agent({agentType})` gating reuses the
  Agent tool's rule surface, and the carrier ingress reuses the SSE transport's veto path; neither
  module has been asked to confirm this module's reading of its own machinery.

---

## 6. Round 2 — what re-analysing the runtime layer found

Round 1 deferred the runtime (§5) on the strength of a `grep` for changelog-matching literals. Round 2
diffed it **structurally** — parameter arity, in-range literal sets, and per-symbol counts — and found
five changes, **none of which has a changelog bullet**:

| # | Finding | Proof | Doc |
|---|---|---|---|
| A | **A complete server-authored workflow launch channel.** A `workflow_launch` SSE event carries a sha256-pinned binary bundle; the client fetches, verifies, decodes and executes it, then answers on a single `remote-workflow:` line. Plus a second, env-delivered path via `/__remote-workflow`. | `"workflow_launch"` 8/0 · `serverAuthoredCarrier` 5/0 · `artifact_sha256` 4/0 · `/.workflow/` 1/0 · `workflow-launch-exec` 4/0 · `CLAUDE_REMOTE_WORKFLOW_SCRIPT` 4/0 | [server_authored_launch](workflow_server_authored_launch.md) |
| B | **Auto-mode hand-off classifier for workflow subagents.** In `auto` permission mode every subagent's full transcript is retained and reviewed before its result reaches the script; `{schema}` agents route the verdict to `failures` + log instead of the text channel. | in-executor `agentMessages` **220=7 / 193=0**; `isBackgroundAgent: !0` 8/0 | [runtime_core §7.4](workflow_runtime_core.md) |
| C | **`scriptSha256` content pin on the adopt path.** A checkpointed workflow resumed after a fork/restart refuses to run if the script file changed since approval — and refuses outright if the checkpoint predates the pin. | `scriptSha256` **220=7 / 193=0**; both refusal strings 1/0 | [lifecycle §5](workflow_lifecycle.md) |
| D | **`CLAUDE_WORKFLOW_NAME_ONLY` lockdown mode** — restricts the tool (and nested `workflow()`) to bundled, named workflows by rejecting `script` / `scriptPath` / `resumeFromRunId` / `remote`. | `CLAUDE_WORKFLOW_NAME_ONLY` **220=5 / 193=0** | [lifecycle §1.2](workflow_lifecycle.md) |
| E | **Telemetry privacy hardening plus two new audit channels.** `meta.name`/`meta.description` are replaced by `"custom"`/`""` unless the script is byte-identical to a bundled definition; per-phase events are skipped entirely for custom scripts; `subagent_model_resolve` now audits every spawn's requested-vs-resolved model. | `scriptIsVerbatimBuiltIn` 5/0 · `subagent_model_resolve` 7/0 · `workflow_compile`/`workflow_resolve` 2/0 each | [lifecycle §1.3](workflow_lifecycle.md), [model_resolution §2.2](workflow_model_resolution.md) |

Two further NET_NEW items that *are* attributable to documented behaviour but were not previously
traced: `suppressCompletionNotification` (3/0, the server-authored path's notification suppressor) and
the completion notification's `<diagnostics>` block + `agents_empty_result` census (1/0 each) — the
third of three coordinated edits in this window that all push the model toward reading
`journal.jsonl` before diagnosing an empty result. See
[state_and_ipc §5.2](workflow_state_and_ipc.md).

**Three inert-code findings** worth recording so nobody re-derives them as behaviour:

- `agent({isolation:'remote'})` throws unconditionally (`:387393`), so the ~110-line remote runner and
  its width-50 semaphore `G` (`:387223`, referenced exactly once — its own declaration) are dead. This
  is true in **both** bundles (`:423617 (193)`).
- `meta.phases[].model` is parsed, stored, persisted and re-hydrated — and never read. The tool prose
  instructs the model to set it (`:388985`).
- `kvn` (`:651236-651238`) is `return null`. Both of its arguments are computed on every render of the
  workflow list — including a full walk of the progress array — and discarded, so the over-size
  warning's `phase` field is permanently `null`.

**Method note for future rounds.** Round 1's deferral was reasonable and still wrong, for a reason
worth generalising: **a string-literal diff of a function body measures its prose surface, not its
behaviour.** The executor's literal set changed by five entries between 2.1.193 and 2.1.220, which
reads as "unchanged". The same body gained two parameters, a new field on its derived tool-use
context, and a whole security review step. Structural probes — parameter arity, per-range symbol
counts, and `awk`-scoped `grep -cF` inside the function's line range — found all three. Add them to
the standard passes.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> All new symbols discovered by this module are staged in
> [symbol_additions_v2_1_220_workflow.md](../00_overview/symbol_additions_v2_1_220_workflow.md),
> grouped by the `symbol_index_*.md` file each group must be merged into.

Key entry points for this module:
- `WorkflowTool` (S6y) - `:389355` — the tool definition; `prompt()`/`description()` both return prose + size suffix
- `WORKFLOW_TOOL_PROSE` (rMs) - `:388943-389101` — the 159-line description diffed in §3
- `WORKFLOW_TOOL_NAME` (dk) - `:231211` — `"Workflow"`, with alias `"RunWorkflow"` at `:389357`
- `resolveWorkflowSizeGuideline` (Dft) - `:389152` — the settings → `/config` → `medium` chain
- `buildGuidelineSuffix` (iMs) - `:389160` — what the model actually reads
- `buildWorkflowOtelAttrs` (D5r) - `:111459` — `workflow.run_id` / `workflow.name`
- `createProgressBatcher` (c6y) - `:388538` — the batcher whose `onSdkEmit` is the `.198` fix
- `publishAgentFan` (Ocd) - `:335489` — the `.208`/`.212` fix
- `assertDirChainReal` (jGn) - `:51990` — the `.216` fix
- `saveWorkflowScript` (oVa) - `:728199` — save path, guard, atomic write
- `buildAgentRowCells` (gvS) - `:728539` — the `.202` `/workflows` row rewrite

Runtime-layer entry points (round 2):
- `createWorkflowHostObjects` (zSd) - `:387149-388105` — the runtime; every counter, semaphore and cap
- `buildWorkflowVMContext` (eEd) - `:388358-388429` and `runWorkflowScript` (rEd) - `:388439-388529`
- `launchWorkflow` (Osn) - `:388585-388864` — the join point for all four entry paths
- `computeAgentConcurrency` (zWy) - `:387140-387142` — `min(16, max(2, cpus−2))`, bound at `:388177`
- `createLimiter` (AB) - `:162762-162781` — the FIFO semaphore behind the cap
- `LocalFileJournal` (JPs) - `:387081-387116` and `deriveJournalKey` (FSd) - `:387077-387080`
- `resumeAdoptedWorkflow` (sEd) - `:388865-388906` — the `scriptSha256`-pinned adopt path
- `applyWorkflowProgressEvents` (qPs) - `:386523-386572` — the state reducer
- `notifyWorkflowCompletion` (qxo) - `:386655-386762` — the main agent's only inbound channel
- `resolveSubagentModelAudited` (Wrd) - `:318835-318868` — the new `subagent_model_resolve` audit
- `handleWorkflowLaunchEvent` (OD_) - `:502491-502583` — the server-authored carrier path
- `runServerAuthoredWorkflow` (bBo) - `:502211-502303` — its executor
