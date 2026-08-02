# 53 — Subagent orchestration limits (v2.1.193 → v2.1.220)

Bundles, citation rules and traps: [`_CONVENTIONS.md`](../_CONVENTIONS.md).
Hand-verified skeleton this module builds on: [`_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §2, §6.1.

```
TARGET   /lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js   (872,596 lines)
BASELINE /lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js   (718,679 lines)
NAMES    /lyz/codespace/3rd/claude-code/src/                                            (v2.1.88, 132 versions stale)
```

---

## The window's story for this theme

In 2.1.193 a subagent could nest **five** deep (`FBt = 5`, `cli_inner_pretty.js:229871 (193)`) and there was no
other budget on delegation at all: no concurrency ceiling, no per-session spawn count, no web-search count, no
spawn-time budget check, and no containment on shell commands issued from a worktree-isolated agent. The only
"limit" in the code was the depth constant, and the only containment was a `startsWith` prefix test on file
edits (`:377318 (193)`).

Across the 25 releases in this window that turned into a **layered budget system**, and the ordering of the
releases tells you what the team learned:

1. **`.198`** made subagents background-by-default and let the built-in Explore agent inherit the session's
   model. Both *increase* fan-out and cost.
2. **`.203`** tried to fix runaway delegation with **prose** — one appended line in the general-purpose agent's
   system prompt telling it not to re-delegate its whole assignment. It also added the first real containment
   guard, on shell exec from worktree-isolated agents.
3. **`.210`/`.216`** hardened containment further: a git-redirect analyzer that fails closed, and an
   instruction-shaped-pattern scrubber on subagent output (the trust boundary, not the filesystem one).
4. **`.212`** added the first *counters*: per-session spawns (200) and per-session web searches (200), reset by
   `/clear`. It also deprecated the Task tool's `mode` parameter, taking the child's permission posture out of
   the model's hands.
5. **`.217`** added the concurrency ceiling (20), wired `--max-budget-usd` to actually halt running background
   agents, and **cut nesting to 1** — the prose nudge from `.203` evidently had not been enough.
6. **`.219`** put nesting back to **3**, and the code shows how that was possible without an emergency:
   the depth cap alone of the four is resolved through a remote GrowthBook gate.

The shape of the final system is the interesting finding. Four caps, and they are deliberately **not**
symmetric:

| Cap | Default | Source | Settable from `settings.json`? | Escape hatch |
|---|---|---|---|---|
| spawn depth | 3 | env → gate `tengu_hazel_trellis` → const | no | remote gate value |
| concurrent subagents | 20 | env → const | no | gate `tengu_amber_kestrel` (off switch) + xhigh-effort exemption + `isolation: remote` |
| subagents / session | 200 | env → const | **yes** (`:58164`) | `/clear` |
| web searches / session | 200 | env → const | **yes** (`:58166`) | `/clear` |

Two are repo-policy knobs, two are machine/safety knobs; one is remotely tunable, three are not; two are
monotone counters, one is a live gauge, one is a stack depth. None of that asymmetry appears in the changelog.

**The three biggest under-reported facts:**

- **Depth limiting is carryover**, and the 2.1.193 default was **5**, not 1. `.219`'s "(was 1)" describes an
  intermediate state that does not exist in either bundle in this tree.
- **`/clear` also resets the web-search budget** (`:449516`), and the reset is **conditional** on no agent task
  surviving the clear. `/compact` resets nothing.
- **The Explore-model change was a gate graduating**, not a new feature: 2.1.193 already contained the whole
  inherit path behind `tengu_quartz_heron` (default off). 2.1.220 deleted the gate and added an env kill switch.

---

## Documents

| Doc | Covers |
|---|---|
| [`spawn_depth_gate.md`](spawn_depth_gate.md) | the `.217`→`.219` flip-flop; the three-tier `env → tengu_hazel_trellis → 3` resolver and its memoisation; the three enforcement layers (tool-schema filter, prompt text, runtime refusal); the forked-skill degrade-to-inline variant and its spawn-counter ratchet; `getAgentDepth`'s fail-open |
| [`concurrency_and_session_caps.md`](concurrency_and_session_caps.md) | the three plain-constant caps; the complete 14-site env-var inventory; the settings-`env` allow-list asymmetry; the task-registry counter surface (closure counters vs app-state gauge, idempotent slot lease); check ordering and the TOCTOU double-check with worktree teardown; the two concurrency bypasses; the WebSearch soft refusal; `/clear`'s conditional reset |
| [`budget_and_delegation_hardening.md`](budget_and_delegation_hardening.md) | `--max-budget-usd` spawn denial + running-agent halt; the one-line `.203` re-delegation prompt delta; the Explore-inherit three-stage rollout; `isolation: 'worktree'` shell/git containment (four refusal reasons, the fail-closed git-redirect analyzer); the indirect-prompt-injection scrubber and its flag/neutralize/neutralize-silent taxonomy; the Task `mode` deprecation |
| [`agent_tool_runtime.md`](agent_tool_runtime.md) | the 2.1.220 Agent tool end to end: route selection, worker tool/context construction, zero-tool refusal, foreground/background ownership, transcript/cleanup lifecycle, API-error termination, partial recovery, sanitization, and 193/readable-source verification |

Nothing was merged away — all three planned docs had ample source substance. Symbol tables are staged in
[`../00_overview/symbol_additions_v2_1_220_subagent_limits.md`](../00_overview/symbol_additions_v2_1_220_subagent_limits.md).

---

## Per-bullet ledger

Every changelog bullet in this window that any scoping file tagged `subagent_limits` (primary or secondary).
Verdicts: **NET_NEW** = literal `220>0 / 193=0` and I read the 220 site; **DELTA** = literal exists in both,
narrower real change identified; **CARRYOVER-TRAP** = the literal is unchanged and the bullet over-claims;
**UNANCHORED** = no literal found; **NOT_RE_VERIFIED** = I accepted the scoping pass's anchor but did not read
it (only used where the bullet is out of this module's scope).

| # | Bullet (abridged) | Ver | Verdict | Anchor (2.1.220 unless tagged) | Doc section |
|---|---|---|---|---|---|
| 1 | Subagents now run in the background by default (previously gradual rollout) | `.198` | NET_NEW | `:397986` prose + `:398208` `run_in_background` description ("Agents run in the background by default…"); 193's description at `:430376 (193)` is "Set to true to run this agent in the background." | not covered here — see the window story; owned by `36_background_agents`. Verified by reading both descriptions |
| 2 | Built-in Explore agent inherits the session model (capped at opus) instead of haiku | `.198` | **DELTA** (gate graduated) | descriptor `:269303` `model:"inherit"` vs `:384851 (193)` `model:"haiku"`; resolver `:269267`; gate `tengu_quartz_heron` **220=0/193=1** (`:384817 (193)`); kill switch `CLAUDE_CODE_DISABLE_EXPLORE_INHERIT_CAP` **220=2/193=0** (`:32695`, `:269269`) | `budget_and_delegation_hardening.md` §3 |
| 3 | Removed the `/agents` wizard | `.198` | NET_NEW | `:500583` `The /agents wizard has been removed.` (220=1/193=0) | not covered — a UI removal, no limit mechanism. Anchor read |
| 4 | Subagents cut off by a rate limit or server error return their partial work | `.199` | NET_NEW | `:345902` cutoffNote "…PARTIAL output recovered from the agent…"; builder `jNy` `:345891` | `agent_tool_runtime.md` §6 |
| 5 | Subagents no longer report API errors as successful results | `.199` | NET_NEW | `:346122-346131` rejects the terminal API-error assistant; `AgentApiErrorTerminationError` `:346382-346388` (220=1/193=0) | `agent_tool_runtime.md` §6 |
| 6 | Subagent rate-limited before any text returned an empty result | `.200` | DELTA (shared mechanism with `.199`) | `jNy` requires prior text at `:345895`; `Apd` rethrows API errors/no-text at `:345909-345912`; 193 finalized immediately at `:384564-384570 (193)` | `agent_tool_runtime.md` §6 |
| 7 | Returning to `claude agents` stopped running subagents; work now carries over | `.203` | NET_NEW | `:413945-413946` `…waiting for ${n} running subagent(s) so the work carries over…`; consumed by the ← deferral at `:823534` with `tengu_defer_cap_refused_restartable` (`:823533`), cap `tengu_defer_cap_ms` default `1e4` (`:823520`), queue refusal `:823527` — all three gates **220>0/193=0** | not covered — see "Chased and reclassified" below; owned by `36_background_agents` |
| 8 | Worktree-isolated subagents running shell commands in the parent checkout | `.203` | NET_NEW | `tengu_agent_worktree_cwd_escape_blocked` **220=4/193=0**, reasons `context_lost` `:314164`, `worktree_gone` `:314192`, `shared_checkout` `:314210` | `budget_and_delegation_hardening.md` §4 |
| 9 | Subagents less likely to re-delegate their entire task | `.203` | NET_NEW | `:269324` `…do not re-delegate your entire assignment…` (`already the dedicated agent` **220=1/193=0**); rest of the prompt byte-identical to `:396327-396342 (193)` | `budget_and_delegation_hardening.md` §2 |
| 10 | Agent tool launching with no tools when `tools` resolves to nothing | `.208` | NET_NEW | `:344423-344460`; `tengu_subagent_zero_tools` (220=1/193=0), with intent-sensitive refusal predicate | `agent_tool_runtime.md` §2 |
| 11 | `isolation:'worktree'` subagents running git-mutating commands on the main repo | `.210` | NET_NEW (not separable from #8) | same gate; I could not isolate `.210` from `.203` by any literal — both map to `context_lost`/`worktree_gone`/`shared_checkout` | `budget_and_delegation_hardening.md` §4, with the non-separability stated |
| 12 | Agent tool hardened against indirect prompt injection via read content | `.210` | NET_NEW | `:345393` marker prefix; pattern table `:345398-345460`; scrubber `:345363`; telemetry `tengu_subagent_output_flagged` `:345381` — `neutralize-silent`/`escalation-pattern`/`control-tag`/`marker-prefix-forgery` all **193=0** | `budget_and_delegation_hardening.md` §5 |
| 13 | `--forward-subagent-text` + `CLAUDE_CODE_FORWARD_SUBAGENT_TEXT` for stream-json | `.211` | NOT_RE_VERIFIED | scoping pass: `:829537` (220=2/193=0) | not covered — owned by `51_headless_sdk` |
| 14 | Subagents with an explicit model override revert to parent model on resume | `.211` | DELTA (unpinned) | `modelOverride` 220=28/193=16; specific resume path not isolated by the scoping pass and I did not pursue it | not covered — owned by `47_models` |
| 15 | Session-wide WebSearch cap (200, `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`) | `.212` | NET_NEW | accessor `:32122`, settings allow-list `:58166`, reader `:231406` (`?? _ty = 200` at `:231413`), refusal `:403669`, counter `:341737-341744` | `concurrency_and_session_caps.md` §§1,2,5,6 |
| 16 | Per-session subagent-spawn cap (200, `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION`); `/clear` resets | `.212` | NET_NEW | accessor `:32124`, allow-list `:58164`, reader `:231403` (`?? yty = 200` at `:231412`), refusal `:398397`, charge `:398400`, reset `:449516` | `concurrency_and_session_caps.md` §§1,2,4,6 |
| 17 | Worktree creation following a repo-committed symlink at `.claude/worktrees` | `.212` | NET_NEW | `:224562-224564` `git_worktree_create_symlink_rejected` + `A repository-committed symlink at .claude, .claude/worktrees, or .claude/worktrees/<name>…` (220=1/193=0) | owned by [`../36_background_agents/session_store_and_worktrees.md`](../36_background_agents/session_store_and_worktrees.md) §8 — worktree *creation*, not subagent containment; adjacent to `budget_and_delegation_hardening.md` §4. *(Cycle D1 resolved.)* |
| 18 | `ExitWorktree` failing "no active EnterWorktree session" after `--continue`/`--resume` | `.212` | CARRYOVER-TRAP | `no active EnterWorktree session` 220=1/193=1; `ExitWorktree` 8/7 | not covered; recorded as a carryover trap |
| 19 | Task tool `mode` parameter deprecated/ignored; subagents inherit the parent permission mode | `.212` | NET_NEW (verified removal) | 220 `:398226-398230` description `Deprecated; ignored.…` vs 193 `:430392-430394 (193)` `Permission mode for spawned teammate…`; `mode` gone from the `call` destructuring (`:398314` vs `:430466 (193)`); resolver `Lcn` `:54240 (193)` has no 220 counterpart; `mode parameter` **220=0/193=2** | `budget_and_delegation_hardening.md` §6 |
| 20 | Worktree-isolated subagents redirecting git via `git -C`, `--git-dir`, `GIT_DIR`/`GIT_WORK_TREE` | `.216` | NET_NEW | reason `command_redirect` `:314220`; analyzer `fed` `:312423`; env set `:312756-312763` (`GIT_WORK_TREE` **220=2/193=0**); flags `:312764-312765`; fail-closed default `:312428` (**220=1/193=0**) | `budget_and_delegation_hardening.md` §4 |
| 21 | Background subagents cancelled when a high-priority message arrives during startup | `.216` | UNANCHORED | `high-priority` 220=0/193=0; `tengu_bg_revival_guard` 1/0 (gate only) | not covered; recorded as unanchored |
| 22 | Cap on concurrently-running subagents (default 20, `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`) | `.217` | NET_NEW | accessor `:32125`, reader `:231400` (`?? gty = 20` at `:231411`), gate closure `:398402-398414`, refusal `:398411`, gauge `:341746-341761`, bypasses `tengu_amber_kestrel` `:398405` and `bY` `:119417` | `concurrency_and_session_caps.md` §§1-4 |
| 23 | Subagents no longer spawn nested subagents by default; `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` | `.217` | **DELTA** — depth limiting is carryover | resolver `:230896-230908`; 193's constant `FBt = 5` `:229871 (193)`; refusal `:398328` vs `:430482 (193)` (one appended sentence) | `spawn_depth_gate.md` §§1,2 |
| 24 | `--max-budget-usd` not stopping background subagents; running agents halted at the cap | `.217` | **DELTA** — flag carryover, enforcement new | predicate `:308540`; spawn denial `:398384-398390` (`New agents cannot be started` **220=1/193=0**); halt predicate `:843431`; halt site `:846937-846945` + `print_budget_halt` **220=1/193=0**; flag `:851083` vs `:712348 (193)`, terminal message `:845498` vs `:705547 (193)` both identical | `budget_and_delegation_hardening.md` §1 |
| 25 | Skills with `context: fork` run in the background by default; opt out `background: false` | `.218` | NET_NEW (default flip), secondary tag | `:342396-342399` `shouldRunForkedSkillInBackground` = `return e.background ?? !0;` — the literal `background ?? ` is **220=1 / 193=0**; callers `:343078`, `:346629` | mechanism anchored here while reading the forked-skill launcher; the *skill-frontmatter* side is owned by `45_skills`. The forked-skill **spawn caps** at `:342419-342442` are covered in `spawn_depth_gate.md` §3.3 |
| 26 | Nested subagent forwarding in stream-json at depth-2+ with `--forward-subagent-text` | `.219` | NOT_RE_VERIFIED (secondary tag) | scoping pass: `tengu_remote_subagent_frame_nested`, `:757401` | not covered — owned by `51_headless_sdk` |
| 27 | Subagents can spawn nested subagents up to depth 3 by default (was 1) | `.219` | NET_NEW value, carryover mechanism | `ZDu = 3` `:230906`; gate `sty = "tengu_hazel_trellis"` `:230907` (**220=1/193=0**, in the 326-new-gate list); memo `Dus` `:230908` | `spawn_depth_gate.md` §2, including an explicit statement of what the bundle **cannot** prove about `.217` |

**Totals for this theme:** 27 bullets — **15 NET_NEW**, **5 DELTA**, **1 CARRYOVER-TRAP**, **1 UNANCHORED**,
**2 NOT_RE_VERIFIED** (secondary tags owned elsewhere), plus **3 NET_NEW-but-out-of-scope** (anchors read in the
2.1.220 bundle, but the bullet carries no limit mechanism). Every one of the 25 anchored rows cites a line I
read in the 2.1.220 bundle; the 2 NOT_RE_VERIFIED rows are labelled as inherited from the scoping pass.
**15 of the 27 are covered in depth in this module's four docs.**

---

## False deltas caught in this theme

| Bullet | Reads as | Actually | Proof |
|---|---|---|---|
| `.217` "Changed subagents to no longer spawn nested subagents by default" | a new nesting limit | the limit, the refusal, the telemetry code and the tool-list filter all existed in 2.1.193 with a hardcoded default of **5** | `Subagent nesting limit reached` **220=1 / 193=1**; `FBt = 5` `:229871 (193)`; filter clause `:384035 (193)` |
| `.219` "up to depth 3 by default (was 1)" | the shipped constant was 1, now 3 | 2.1.220 ships `3`; no bundle in this tree contains `1` as the depth default. The "(was 1)" state is unobservable here | `ZDu = 3` `:230906` |
| `.198` "Explore agent inherits the session model (capped at opus)" | new inherit behaviour | 2.1.193 contained the entire inherit path plus the opus ceiling; it was dark-launched behind `tengu_quartz_heron` (default `!1`) and returned `"haiku"` | `:384815-384824 (193)`; gate **220=0 / 193=1** |
| `.198` "capped at opus" (the ceiling itself) | a new constant | `$Wu = "opus"` greps `220=1 / 193=0` **only because the identifier was re-mangled** — it is `DYa = "opus"` at `:384831 (193)`, with the same ladder `["haiku","sonnet","opus"]` at `:384855 (193)` | `_CONVENTIONS.md` trap #1 |
| `.217` "`--max-budget-usd` not stopping background subagents" | new flag or new plumbing | flag declaration, parser error text, subprocess propagation and the terminal `Error: Exceeded USD budget (…)` message are byte-identical carryover; only the two enforcement points are new | `max-budget-usd` **220=5 / 193=4**; `:851083`/`:851087`/`:547886`/`:845498` vs `:712348`/`:712352`/`:563710`/`:705547 (193)` |
| `.203`/`.210` worktree bullets | two distinct fixes | the entire shell-exec guard is `193=0`, so `.203`, `.210` and `.216` all landed in-window on one guard; only `.216` is separable (its reason string is `command_redirect`) | `tengu_agent_worktree_cwd_escape_blocked` **220=4 / 193=0** |
| worktree file-edit refusal | new containment | `This agent is isolated in the worktree … Edit the worktree copy of this file instead of the shared-checkout path.` is **220=2 / 193=2**; the *message* is carryover, the resolution behind it was rewritten (`Gcr` `:307807` + `RQu`/`pws`/`fws` verdicts vs `Hmt`'s raw `startsWith` at `:377318 (193)`) | read both sites |
| `.212` "`/clear` resets the budget" | unconditional reset of the subagent budget | resets **two** budgets (spawns *and* web searches) and only when no agent task survived the clear | `:449516` guarded by `_ === 0` from `:449493` |
| `.203` "agents are now less likely to re-delegate" | a mechanism | one appended line of prompt text; `re-delegat` is **220=3 / 193=2** and the two old hits are unrelated fork sentences | `:269324`; prompt otherwise byte-identical to `:396327-396342 (193)` |

Also corrected against the pre-pass material: the scoping files and
[`_false_delta_ledger.md`](../00_overview/_false_delta_ledger.md) record **three** reasons for
`tengu_agent_worktree_cwd_escape_blocked` (`context_lost` / `worktree_gone` / `shared_checkout`). There are
**four** — `command_redirect` at `:314220` is the fourth and it is the one `.216`'s bullet describes.

---

## Chased and reclassified

The task brief asked me to chase `tengu_defer_cap_{ms,refused_queued,refused_restartable}` on the assumption
they were spawn-budget gates. They are not: they are the **`←` open-agents-view deferral cap**
(`:823518-823556`). When you press `←` mid-turn, the harness arms a `tengu_defer_cap_ms` timer (default
`1e4` = 10 s, `:823520`); on expiry it refuses the fast path if commands are queued
(`tengu_defer_cap_refused_queued`, `:823527`) or if restartable subagents are still running
(`tengu_defer_cap_refused_restartable`, `:823533`), otherwise it force-forks with
`deferCapFired: !0` (`:823552`). The refusal message it shows is
`ukd` (`:413945`): *"Still backgrounding after the current tool — waiting for N running subagent(s) so the work
carries over…"*.

That string is the anchor for ledger row 7 (`.203` *"Fixed returning to `claude agents` silently stopping
running subagents … their work now carries over"*), so these three gates belong to that bullet and to
`36_background_agents`, not to the spawn caps. Recording it here so the next reader does not re-derive it.

---

## Not covered

Honestly and specifically:

- **Ledger rows 1, 3, 4, 5, 10, 17** — anchored and read, but they are error-reporting / UI / worktree-creation
  paths with no limit mechanism. Each row above carries its verified anchor so another module can pick them up.
  Row 1 (background-by-default) and row 7 (`claude agents` carry-over) belong to `36_background_agents`;
  row 17 (worktree-creation symlink) is owned by [`../36_background_agents/session_store_and_worktrees.md`](../36_background_agents/session_store_and_worktrees.md) §8 (cycle D1 resolved; it was previously pointed at `38_permissions`/`49_sandbox`, neither of which claimed it).
- **Ledger rows 13 and 26** — secondary `subagent_limits` tags whose primary owner is `51_headless_sdk`
  (`--forward-subagent-text`, nested stream-json forwarding). I did **not** re-verify their anchors in the
  2.1.220 bundle and have marked them NOT_RE_VERIFIED rather than presenting the scoping pass's numbers as mine.
- **Ledger row 14** (subagent model override lost on resume) — `47_models` owns it; the scoping pass could not
  pin the resume path either, and I did not pursue it.
- **Ledger rows 6, 18, 21** — unanchored or carryover-trap; no 220 site found, so nothing to write up beyond
  the negative result.
- **The `.203`/`.210` split** — stated as non-separable rather than guessed at.
- **What `.217` actually shipped as its depth default** — unobservable from the two bundles available.
  `spawn_depth_gate.md` §2 says so explicitly instead of inferring it from the changelog.
- **The full worktree-escape path canonicaliser** (`mBe`, `zen`, `eEo`, `Rky`, `Ken`, `RQu`, `pws`, `fws`) and
  the git-redirect analyzer's argv walker (`:312429-312740`, roughly 300 lines: `hed`, `ced`, `ued`, `ded`,
  `ged`, `qky`, `Vky`, `zky`, `_tn`). I documented the analyzer's *vectors, ordering and fail-closed policy*
  and read its entry point and refusal messages, but I did not trace every argv-walking helper. It is large
  enough to deserve its own doc, most naturally in `49_sandbox`.
- **`tengu_shale_finch`** (`:345464`) — a *carryover* gate (**220=1 / 193=1**) that filters a tool set `ipd`
  out of a subagent's tools at `:344380`. Adjacent to the tool-list filtering in `spawn_depth_gate.md` §3.1 but
  not part of any bullet in this window, so left alone.
- **`tengu_amber_kestrel`'s rollout state** — I can prove it exists and what it bypasses; I cannot see its
  server-side value.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New rows discovered by this module are staged for merge in
> [symbol_additions_v2_1_220_subagent_limits.md](../00_overview/symbol_additions_v2_1_220_subagent_limits.md).

Key entry points for this module:
- `getMaxSubagentSpawnDepth` (`hee`, `:230896`) - depth resolver, gate-backed
- `getMaxConcurrentSubagents` (`gPu`, `:231399`) / `getMaxSubagentsPerSession` (`Q7r`, `:231402`) / `getMaxWebSearchesPerSession` (`yPu`, `:231405`) - the three plain-constant caps
- `chargeSessionBudget` (`$`, `:398378`) / `checkConcurrencyCeiling` (`D`, `:398402`) / `acquireConcurrencySlot` (`U`, `:398415`) - the Agent tool's spawn gates
- `AgentTool` (`Wko`, `:398293`) / `runAgent` (`oG`, `:344277`) / `runAsyncAgentLifecycle` (`hIe`, `:345920`) - the launch, worker, and task-lifecycle layers
- `finalizeAgentTool` (`XIs`, `:345677`) / `recoverSyncAgentError` (`Apd`, `:345905`) - safe terminal result construction
- `filterToolsForAgent` (`MNy`, `:345484`) - schema-level depth enforcement
- `clearConversation` (`kcn`, `:449427`) - the only budget reset path
- `shouldHaltRunningAgentsForBudget` (`$xm`, `:843431`) / `stopAllRunningAgentTasks` (`gmr`, `:399888`) - the `--max-budget-usd` halt
- `analyzeGitRedirectOutsideWorktree` (`fed`, `:312423`) / `worktreeEscapeMessage` (`ied`, `:312384`) - worktree containment
- `scrubInstructionShapedText` (`bpd`, `:345363`) / `INJECTION_PATTERNS` (`LNy`, `:345398`) - injection hardening
- `resolveExploreAgentModel` (`M9e`, `:269267`) - Explore model inheritance
