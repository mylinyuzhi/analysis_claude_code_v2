# TODO — Claude Code v2.1.220 deobfuscation analysis

**Task:** build `claude_code_v_2.1.220/analyze/` as the **v2.1.193 → v2.1.220 delta tree**,
following the format of `claude_code_v_2.1.193/analyze/`.

**Last session:** 2026-07-27.
**State: ✅ COMPLETE — all four steps done, cross-validated, and repaired.**

```
188 files / 103,932 lines
  111 module docs across 26 themes
   25 by_version release files   (579/579 changelog bullets, every ledger row-count exact)
   47 00_overview files          (4 symbol indexes = 3,402 rows, + alias-conflict register)
QA: 0 forbidden mapping tables · 0 forbidden section names · 136/136 `## Related Symbols`
    0 Chinese · 3,596 relative links / 0 broken · citation error rate 0.25% (symbol index,
    n=400) and 2.08% (module prose, n=289); exhaustive anchor audit 6/2,191 = 0.27%
```

**Coverage-hole closure (final pass).** The circular-deferral register is now
**12 RESCUED / 6 CLOSED / 2 remaining HOLE**. Closed this pass, each with an assigned owner so the
loop cannot re-form: C2 `.219` claude-api skill -> `45_skills` §8 · C9 `.205` `--json-schema` ->
`42_workflow` §8 · C12 `.200` `--plugin-dir` -> `43_slash_commands` §1.6 · D1 `.212` worktree symlink ->
`36_background_agents` §8 · D2 `.218` pre-exit flush -> `50_performance` §6. All cross-module README
pointers repointed.

**Two findings only visible once the holes were filled** (they sat exactly on module boundaries, which
is why nobody saw them):
- **A policy bypass.** `.200`'s fix added a second plugin-load site at `:865021-865023` with **no**
  policy check; `areSideloadFlagsDisabledByPolicy` has just two occurrences bundle-wide (export
  `:237992`, sole consumer `:872446` = the *old* fast path). `disableSideloadFlags` no longer blocks
  `claude agents --plugin-dir`. No changelog bullet.
- **`.218` pre-exit flush is narrowed, not fixed.** 193's flush helper was **test-only**
  (`_flushLogWritersForTesting` **0/1**); 220 wired it into shutdown. But the default `onEpochMismatch`
  is a bare `process.exit(1)` (`:415612-415616`) that skips the drain entirely.

**Still open (deliberately, with reasons recorded):** C8 `/rewind` symlink refusal — the 1/0 literal is
the *describe string of a counter field*, enforcement site untraced; C14 `ExitWorktree` — literal is
genuinely 1/1 with no string surface. Both are labelled HOLE rather than papered over.
- `00_overview/_xval_*.md` (4 audit reports) are deliberately kept as the QA record.

## ⚠️ READ THIS FIRST WHEN RESUMING

### 1. Use **subagents**, NOT the Workflow tool

The Workflow tool was tried and abandoned. **Do not use it for this project.**

| Problem | What happened |
|---|---|
| **Concurrency cap** | `Workflow` caps agents at `min(16, cpu_cores − 2)`. This machine has **4 cores ⇒ cap = 2**. That formula assumes CPU-bound work, but these agents are **API-latency-bound**. Measured ~30–36 min/agent ⇒ remaining work would take **~13 h at cap 2 vs ~3–4 h at 7–9 concurrent**. |
| **`args` marshalling bug** | `Workflow({args:{group:'B'}})` arrived as the JSON **string** `'{"group": "B"}'`, so `args.group` was `undefined` and a `\|\| 'A'` default silently **re-ran the wrong group twice**. |
| **Fork-adoption failure** | A `scriptPath` under the scratchpad was rejected when the background job forked, killing a run mid-flight. |
| **All-or-nothing 529s** | One API-overload event killed **8 of 9** agents in a single run. `resumeFromRunId` did not reliably replay errored agents. |

**The replacement works far better:** launch all N modules as **parallel `Agent` tool calls in one
message**. Group C ran **9 concurrent in ~28 min**; by_version launched **14 concurrent**.

**Recipe:**
1. Point each agent at `analyze/_MODULE_TASK_BRIEF.md` ("read it completely and follow it exactly") —
   it holds the whole contract, so per-agent prompts stay short.
2. Then give: directory, theme slug, symbol-additions suffix, doc list, **seed anchors already
   verified**, and explicit **boundary notes** ("module X owns Y — link, don't duplicate").
3. `subagent_type: "general-purpose"`.
4. **Always verify output on disk yourself** (`ls`/`wc -l`/`grep -c` in BOTH bundles). Do not trust
   agent summaries. This caught every error listed below.

### 2. Verify agent claims — and verify the tree's own ground truth

Agents are strong (each reads 1,500–5,000 bundle lines) but the orchestrator must spot-check.
**This session the agents were right and the tree's own ground-truth file was WRONG twice.**
Both are now fixed in `_GROUND_TRUTH_verified_anchors.md`; see the corrections register below.

**Rule: spot-verify every load-bearing claim in the bundle yourself before accepting or rejecting it.**

---

## Sources (unchanged)

```
TARGET   /lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js   872,596 lines
BASELINE /lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js   718,679 lines  (tag "(193)")
DEEPER   /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js   699,346 lines
NAMES    /lyz/codespace/3rd/claude-code/src/                                            v2.1.88 named TS (132 versions stale)
CHANGELOG /lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.220/CHANGELOG.md     579 bullets, 25 releases
```

Window: `.195 … .220` — **`.194` and `.213` were never published.**

**Verified per-release bullet counts** (use these as hard targets for by_version ledgers):
```
.195=12  .196=27  .197=1   .198=33  .199=24  .200=17  .201=1   .202=18  .203=37
.204=1   .205=23  .206=27  .207=24  .208=46  .209=1   .210=33  .211=37  .212=48
.214=47  .215=1   .216=40  .217=20  .218=36  .219=24  .220=1        TOTAL 579 ✓
```

---

## 🔴 CORRECTIONS REGISTER — errors found in the tree's own reference files

**Read this before trusting any pre-existing anchor.** All fixes are already applied.

| # | What was wrong | Truth | Fixed in |
|---|---|---|---|
| 1 | `_GROUND_TRUTH` **§6.6**: "the compaction dispatcher gained a `failure_breaker_open` circuit breaker, undocumented" — was to be a marquee finding | **RETRACTED. Pure carryover:** `failure_breaker_open` 220=1/**193=1**, `193:470252` is byte-identical, `GMd=3` ≡ `ISl=3` (`193:470357`), gate `tengu_auto_compact_circuit_breaker` 1/1. What fooled it: `consecutiveFailures` 11/6, where the 5 extra sites are an unrelated artifact live-watch backoff | `_GROUND_TRUTH` §6.6 |
| 2 | `_GROUND_TRUTH` **§6.3**: "`.201`'s Sonnet-5 mid-conversation-system change was REVERTED" | **REFINED — half right.** The *role-level* exclusion was reverted, but a Sonnet-5-only **presentation-level** shim survives: `mro` `:150395`, consumed at `:508117` (`Ser(e) && !mro(e) && !$Fc(lo(e))`) and `:531422`. `$Fc` `:118668` = `claude-opus-4-8`. **Three framing states, not two.** `.201` was *replaced*, not undone | `_GROUND_TRUTH` §6.3 |
| 3 | `_raw_asset_diff` NEW **env-var** list treated as reliable | It has **false-new rows too**, not just omissions: `CLAUDE_CODE_REMOTE_SEND_KEEPALIVES` is **3/3** | `_raw_asset_diff` §env_vars |
| 4 | `_scope_v211_214.md:134-135` attributes `tengu_convolute_arcades_retry*` to the `.212` web-search bullets | It is the **silent refusal-fallback continuation retry** (SDK schema `:838180`; `convolute_arcades` is a server-pushed per-account flag key, `idg` `:121244`). The 529-backoff half of that bullet is **UNANCHORED** | `57_api_reliability/retry_policy.md` |
| 5 | `symbol_additions_..._tools.md` `atp` row carried `utp`'s line range | `atp` = `:508391-508471`; `utp` = `:508507-508531` | that file |
| 6 | `05_plan_mode` cited 193 twin at `:460213` | `:460213` is a closing brace; the twin guard is `:460215` (in `Iif`, declared `:460214`) | that doc |
| 7 | `57_api_reliability` README cited `BedrockUnexpectedContentTypeError` as 4/0 | The class-name string is **1/0** (`:150108`); the 3/0 literal is `CLAUDE_CODE_DISABLE_BEDROCK_CONTENT_TYPE_GUARD` | that doc |
| 8 | **`grep -c` treats its pattern as a REGEX** — produced a false **CARRYOVER** | `grep -c 'workflow.run_id'` = 3/2 because the `.` matched 193's `workflow_run_id` (`:424852`, `:424892 (193)`). With `-F`: **1/0 and 1/0 — both net-new.** Direction matters: this trap causes false *negatives*, which the "when in doubt say carryover" bias **conceals** | `_CONVENTIONS.md` §4 **trap 8** (new); ledger row retracted |
| 9 | `_GROUND_TRUTH` **§6.5**: "no fast-mode tier or multiplier anywhere in the pricing code … session cost is under-reported by ~2× in fast mode" | **RETRACTED.** The client *does* price fast mode — not as a multiplier (hence the failed grep) but as a **substituted table**: `Dji` `:109772-109784` returns `a7n` on `speed === "fast"`, and `a7n` `:109843-109850` is `{inputTokens: 10, outputTokens: 50, …}`. The "2× under-reporting" consequence is **false** | `_GROUND_TRUTH` §6.5 |
| 10 | `_GROUND_TRUTH` **§1** implied `claude-mythos-5` is an unannounced **new** family | **It is not new — it was DE-PROVISIONED.** `grep -cF` = 220=25 / **193=31** (count fell). 193 carried it *with* third-party ids (`bedrock: "us.anthropic.claude-mythos-5"`, `vertex` at `:95716-95718 (193)`); 220 nulls every third-party channel and empties `capabilities` | `_GROUND_TRUTH` §1; `by_version/2.1.220.md` §5.1 |
| 11 | `_false_delta_ledger.md` register 1 claimed **61** carryover traps; it contained **51** | The whole **`.211`–`.214` band was missing** — the three largest releases (132 bullets) had no traps to check against, though every brief says "check every bullet against register 1". **Recovered 19 rows** from `_scope_v211_214.md`; register is now **70** (15+15+11+19+10). **5 of the recovered rows were themselves false carryovers** later passes had overturned | `_false_delta_ledger.md` §1 |
| 12 | `_false_delta_ledger.md` register 2 ("125 verified net-new, safe to build on") | **18 of 125 defective.** 3 are **not net-new** (`claude agents --plugin-dir` 2/**1**; the `["userSettings","flagSettings","policySettings"]` array is `JWp` `:386042 (193)` — only the mangled name `a5g` is new; `user_abort` reject byte-identical to `:427383-427386 (193)`). **2 are identifier-reuse collisions** (`jXs` 4/**3** — 193's is the vendored `__exportStar` at `:106549 (193)`). 6 wrong lines, 6 non-zero-193 rows, 3 duplicated anchors ⇒ **122 unique** | `_false_delta_ledger.md` §2 |
| 13 | `36_background_agents/agent_view_and_status.md` release tags; README claimed they were already fixed | **9 of 30 rows mis-tagged** (ordinals all correct). Drift was **not uniform** — 7 forward, 2 backward — so a bulk offset would have been wrong. All fixed; file re-verifies 30/30 against the CHANGELOG | those docs |
| 14 | `.217` #10 (`--resume` TypeError) filed **UNANCHORED** in `by_version/2.1.217.md` *and* `changelog_to_code_map.md` | A **circular deferral** (`07_compact` ↔ `43_slash_commands`) propagated a false verdict into two authoritative files. It **is** anchored: `dropMalformedAttachments` (`Arn`) `:320096-320110` and `isWellFormedAttachmentPayload` (`Qnd`) `:320077-320095`, both **1/0** | both files |

**Scope-file anchors overturned by the module pass: ~15+.** Treat `_scope_v*.md` as **leads, not
conclusions**. Notable: `.214` `modified: new Date(` (3/3 carryover, real writer `Bfo` `:238652`);
`.214` `tengu_cc_memory_tag_stripped` (misattributed — it counts `<cc-memory>` tags);
`.211` `.claude/rules` "+3 loader sites" (those are `/doctor` prompt text);
`.211` file-upload anchor `:663633` (that is the `set_cwd` handler, a `.210` bullet);
`.207` `tengu_team_mem_conflict_recovered` (team-*memory* sync, unreachable from the mailbox);
`.208` Bedrock truncated-event (not flat carryover — a new pre-emptive guard throws first);
`.214` "Socket is closed" (not unanchored — `ERR_SOCKET_CLOSED` 4/0).

---

## ✅ DONE

### Control / reference files (read before anything else)

| File | Purpose |
|---|---|
| `analyze/_CONVENTIONS.md` | Bundles, citation rule, **7 known traps**, doc format, symbol-index routing |
| `analyze/_GROUND_TRUTH_verified_anchors.md` | Hand-verified anchors + resolved discrepancies. **§6.6 retracted, §6.3 refined, §6.7 superseded** |
| `analyze/_MODULE_TASK_BRIEF.md` | The reusable subagent contract |
| `analyze/00_overview/_false_delta_ledger.md` | 61 carryover traps + 125 net-new anchors — the ready-made cross-validation checklist |
| `analyze/00_overview/_raw_asset_diff_193_to_220.md` | Machine diff + **four** accuracy audits |
| `analyze/00_overview/file_index.md` | Build identity, 55-row bundle landmark map |
| `analyze/_specs/{module,byversion}_specs.js` | Reference **data** (docs list / seed anchors / slices). NOT workflows to run |

### Foundation pass — 578 of 579 bullets probed in both bundles
`00_overview/_scope_v195_199.md` · `_scope_v200_205.md` · `_scope_v206_210.md` · `_scope_v211_214.md` ·
`_scope_v215_220.md` (~2,280 lines). **Leads, not conclusions** — see corrections register.

### ✅ Module layer — ALL 26 themes (111 docs / 79,074 lines)

Group A/B (17 themes, 81 docs) plus **group C, completed this session** (9 themes, 30 docs):

| Dir | Files | Notable finding |
|---|---|---|
| `05_plan_mode` | 3 | `.212` bypass = a missing `\|\| tcr(t)` conjunct; 193 twin `:460181` byte-identical without it, and that path tolerated `rm`/`rmdir` |
| `07_compact` | 3 | **Retracted the assigned headline** (see corrections #1); `.217` real delta = `PZr="claude-opus-4-8"` conjunct deleted from 3 predicates |
| `30_agent_team` | 3 | `.207` mailbox quarantine has **no telemetry gate at all**; `{msgV:1,msg_id}` envelope undocumented |
| `31_auto_memory` | 3 | 3 scope anchors overturned; undocumented `<cc-memory>` citation surface (5/0); proved nested `metadata.*` keys still unfixed |
| `40_system_prompt` | 3 | **Challenged §6.3 and won** (corrections #2); `output_config:{effort}` per-turn control channel undocumented |
| `46_todo_tasks` | 3 | **`tengu_dead_probe_*` fully enumerated: 25 gates / 32 sites, 220=32/193=0** — deletion-by-evidence census |
| `54_remote_control` | 4 | **3 of 6 new `tengu_remote_*` gates ship dead** (`cqt = null` is the sole assignment) |
| `56_chrome_ide` | 4 | Corrected its own brief: `tengu_bridge_*` is **three** subsystems; Chrome bridge is 26/26 carryover |
| `57_api_reliability` | 4 | **Cracked `tengu_convolute_arcades_*`**; `.218` doomed loop provably non-terminating in 193 |

Plus **27 `00_overview/symbol_additions_v2_1_220_*.md`** files staged for merge.

**Verified invariants (2026-07-27):**
```
module docs                      111
module doc lines              79,074
whole tree            150 files / 79,973 lines
forbidden '| Obfuscated' tables    0   (4 hits are the rule's own text in control files)
forbidden section names            0
'## Related Symbols'         111/111
files containing Chinese           0
symbol_additions files            27
```

---

## ❌ NOT DONE — remaining work, in order

### 🔄 STEP 2 — `by_version/` (IN FLIGHT: 14 parallel agents)

One file per release (25 files). Each: release narrative, **100%-coverage per-bullet ledger**
(bullet | theme | verdict | re-read anchor | 220/193 | link to the module doc), 2–5 deep-dives, and a
"what the changelog does not say" section. Exemplar: `claude_code_v_2.1.193/analyze/by_version/2.1.187.md`.
Slices: `.195+.196` · `.197+.198` · `.199-.201` · `.202-.204` · `.205+.206` · `.207` · `.208` ·
`.209+.210` · `.211` · `.212` · `.214` · `.215+.216` · `.217+.218` · `.219+.220`.
**On completion: verify each ledger's row count against the table above, then collect `module_gaps`.**

### STEP 3 — Overview layer (~6 agents, some sequential)

| File | How |
|---|---|
| `00_overview/symbol_index_{core_execution,core_features,infra_platform,infra_integration}.md` | Merge the **27** `symbol_additions_*` files; each names its destination index per group |
| `00_overview/changelog_analysis.md` | Narrative of the whole window (model-registry rewrite, MCP fork, delegation budgets, dead_probe census, the contradicted bullets) |
| `00_overview/changelog_to_code_map.md` | Per-bullet → anchor map for all 579, from scope + module + by_version ledgers |
| `00_overview/README.md` + `analyze/README.md` | Indexes; exemplar `claude_code_v_2.1.193/analyze/README.md` |

⚠ The 4 `symbol_index_*.md` do not exist yet, so all 111 module docs carry forward references to them
(per `_CONVENTIONS.md` §5.1 — expected). **Link-check after creating them.**

### STEP 4 — Cross-validation (default-to-FAIL, ~10 agents)

Precedent: the 2.1.193 tree ran **two** passes; the second still found 3 false deltas, because the first
never audited the **aggregator layer** (changelog_analysis / changelog_to_code_map / file_index /
symbol_index / by_version / READMEs), which restates deltas in its own words.

- **Register 1 of `_false_delta_ledger.md` is the checklist** — 61 rows, each a test.
- **Also test the 7 corrections above** — confirm no doc anywhere still asserts the retracted claims
  (especially §6.6's circuit breaker and §6.3's flat "reverted").
- Register 2 (125 anchors) is a re-read list. Expected citation error rate **~2–3%**.
- Re-check: relative-link depth, orphan docs, `## Related Symbols`, no mapping tables, English-only.

---

## Key findings (for continuity — do not re-derive)

1. **Model registry rewritten** — scattered camelCase (`:95560-95724 (193)`) → one declarative
   zod-validated catalogue `:14008-14496`, generated by `bun run generate:model-catalog` (220=2/193=0).
   New 8th provider channel `anthropic_google_cloud` (23/**0**); unannounced `claude-mythos-5` `:14439`;
   aliases are **provider-dependent** (`opus`→4.6 on Foundry, 4.7 on gateway). **No changelog bullet.**
2. **MCP forked into two complete runtime trees** — `v1` default, `v2` opt-in via `MCP_SDK_GENERATION`
   (3/**0**) or gate `tengu_brindle_causeway`. **No bullet.** ⚠ The default path is the **HIGHER** line
   range — grepping the first hit reads the wrong tree. Supersedes `_GROUND_TRUTH` §6.7.
3. **`tengu_dead_probe_*` — 25 gates / 32 sites, 220=32/**193=0**.** Deletion-by-evidence: each probe
   wraps a legacy path with a once-per-process latch, emits a closed-vocabulary payload, and lets the
   branch run unchanged. A falsifiable census (predicted count = 0) before removal. **No bullet.**
4. **Delegation budgets** — depth `3` via env → gate `tengu_hazel_trellis` → `ZDu=3` (`hee` `:230896`);
   `gty=20`/`yty=200`/`_ty=200` at `:231411-231413`. Depth limiting itself is carryover.
5. **Windows sandbox silently rebuilt** — `sandboxUser` 12/**0**, SID-keyed ACLs, WFP egress fence. No bullet.
6. **`.219` "Removed Opus 4.7 from fast mode" is PREMATURE** — still eligible via capability `:14324`
   AND substring `:109473`; the bundle ships a *future-removal warning* (`LIc` `:109491`) whose gate
   default is `2026-07-25` while build_time is `2026-07-24T22:17:45Z` — **~26 h before its own sunset**,
   so 2.1.220 is the last build that can ever display it.
7. **`.201` was replaced, not reverted** — see corrections #2. Three framing states.
8. **Compaction circuit breaker is CARRYOVER** — see corrections #1. Do not resurrect this claim.
9. **Dead-on-arrival gates are a real category** — 3 of 6 new `tengu_remote_*` are unreachable
   (`cqt = null` `:757708` is the sole assignment). A gate being in the "326 new" list proves nothing
   about reachability.
10. **Asset-list audits**: "326 new gates" → **324 real**; "51 new CLI flags" is **~6× over-counted**;
    `env_vars.json` is broken in **both** directions (lost 163 live vars, gained 47 obfuscated ids,
    and its NEW list contains carryover).
11. **Identifier-reuse collisions are the #1 trap.** An equal 220/193 count does **not** prove carryover,
    and an unequal count does not prove a delta (`consecutiveFailures` 11/6 → wrong subsystem).
    Always read the decl in BOTH bundles.

---

## Quick resume checklist

- [ ] Read `_CONVENTIONS.md`, `_GROUND_TRUTH_verified_anchors.md`, `_MODULE_TASK_BRIEF.md`,
      `00_overview/_false_delta_ledger.md`, **and the corrections register above**
- [x] **STEP 1** — module layer, all 26 themes
- [ ] **STEP 2** — `by_version/` 25 files (14 agents in flight); verify row counts on completion
- [ ] **STEP 3** — overview layer: 4 symbol indexes, changelog_analysis, changelog_to_code_map, READMEs
- [ ] **STEP 4** — default-to-FAIL cross-validation, then a completeness critic
- [ ] Re-run invariants (0 mapping tables, `## Related Symbols` everywhere, 0 Chinese, links resolve)
- [ ] **Never use the Workflow tool. Always parallel `Agent` calls. Always verify on disk.**
