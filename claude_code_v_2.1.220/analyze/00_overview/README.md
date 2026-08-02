# `00_overview/` — the navigation and provenance layer

This directory holds everything in the v2.1.193 → v2.1.220 tree that is **not** a theme analysis: the
bullet-to-code map, the bundle map, the four symbol indexes, and the working registers the module
agents were built on. The release-delta analyses live in 26 numbered module directories; the
current-state query-loop baseline lives in [`../03_llm_core/`](../03_llm_core/); and per-release
analyses live in [`../by_version/`](../by_version/). Start at the tree front door,
[`../README.md`](../README.md), if you have not already.

**49 files, four content kinds plus this guide:**

| Kind | Files | Use it when |
|---|---:|---|
| **Consolidated outputs** — the answers | 3 | You want a verdict, an anchor, or a line region |
| **Symbol indexes** — the merged lookup tables | 4 | You have an obfuscated identifier and need its meaning |
| **Symbol staging** — the per-theme sources those were merged from | 29 | You want a theme's exhaustive symbol list, gate census or collision notes |
| **Provenance and validation registers** — how the tree was built and checked | 12 | You are auditing a claim, or a verdict looks wrong |

> ⚠ **The provenance registers are not conclusions.** The five `_scope_v*.md` files and
> `_raw_asset_diff_193_to_220.md` were produced by the *foundation pass*, before any module agent read
> a line of code. The module passes and the `by_version/` passes subsequently **overturned dozens of
> their proposed anchors** — in several cases by reading the proposed site and showing it belongs to a
> completely different feature. Where a scoping row and a module doc disagree, **the module doc wins**,
> and each module README lists the corrections it makes. Treat the scoping files as a record of what was
> probed, never as a citation.

---

## Reading order for a newcomer

1. **[`../_CONVENTIONS.md`](../_CONVENTIONS.md) first** — it is not in this directory but nothing here
   parses correctly without it: the two bundles, the citation rule, the eight known traps, and the
   document format. §4 in particular explains why a matching grep count proves nothing.
2. **[`file_index.md`](file_index.md) §1–§2** — what the build actually is (872,596 lines, `build_sha
   4073f595`, `build_time 2026-07-24T22:17:45Z`) and how much it grew.
3. **[`file_index.md`](file_index.md) §4** — which extracted asset lists lie to you, and in which
   direction. Read this before you trust any list of "new env vars", "new tools" or "new flags".
4. **[`changelog_to_code_map.md`](changelog_to_code_map.md) §1–§2** — the six-verdict vocabulary
   (`NET_NEW` / `DELTA` / `CARRYOVER` / `GATE_REMOVAL` / `SERVER_SIDE` / `UNANCHORED`) that every ledger
   in this tree uses, and the window totals.
5. **[`_false_delta_ledger.md`](_false_delta_ledger.md) register 1** — the 61 bullets whose headline
   literal already exists in 2.1.193. If you are about to write one of these up as an introduction, stop.
6. **[`file_index.md`](file_index.md) §6** — the 55-row map from feature to bundle line region. This is
   how you start from a line range instead of from scratch.
7. Then jump: to a **module README** for a feature, to a **[`../by_version/`](../by_version/) file** for
   a release, or to a **symbol index** for an identifier.

---

## 1. Consolidated outputs

### [`changelog_to_code_map.md`](changelog_to_code_map.md) — every bullet, every verdict

**894 lines.** All **579 changelog bullets** of the 25 published releases, mapped to the 2.1.220 anchor
that implements them or to an explicit statement that no anchor was found. Mechanically consolidated
from the 25 per-release ledgers in [`../by_version/`](../by_version/), which remain the authoritative
sources — this file reorders their claims and adds none of its own.

- §1 — how to read a verdict (the six-value vocabulary)
- §2 — window totals: **NET_NEW 340 · UNANCHORED 99 · DELTA 85 · CARRYOVER 48 · SERVER_SIDE 3 ·
  GATE_REMOVAL 2**, and the coverage figure: **509 / 579 bullets (87.9%)** link to a module document
- §3 — the per-release map, newest first, one table per release: bullet, theme, verdict, anchor,
  `220/193` counts, and the module doc that analyses it
- §4 — the **gap register**: the 70 bullets with no module-doc link, each still covered by its
  per-release file, each with its verdict and the reason it was left where it is

**Use it to answer:** *"is this bullet real, and who analysed it?"* — the single most useful entry point
in the tree if you are starting from the changelog rather than from the code.

### [`file_index.md`](file_index.md) — what is in the build, and where

**464 lines.** The bundle map. Every number in it was measured by its author (`wc -l`, `stat`,
`grep -c`, `json.load`) rather than copied from another tree.

- §1 build identity and the three-build comparison · §2 bundle sizes and growth rates
- §3 the 49,263-entry decl inventory in `cli_unpack_pretty/`
- §4 **asset inventory and how much to trust it** — the section that saves the most time
- §5 the tool surface (authoritative list: `assets/tools/_index.json`, 65 entries — *not* the broken
  top-level `tools_index.json`, which has one)
- §6 **where the interesting regions are** — 55 rows of feature → line range
- §7 how to navigate · §8 see also

> **Caveat, stated in the file itself:** it was written while the 26 theme directories were still empty,
> so it is a **bundle map, not a document map**. For "which doc covers X", use
> [`changelog_to_code_map.md`](changelog_to_code_map.md) or the module READMEs.

---

## 2. Symbol indexes

Four merged lookup tables, four columns each (obfuscated name, readable name, `File:Line`, and type ∈
`function` / `constant` / `class` / `object` / `variable`), sorted by obfuscated name inside each module
section. **3,624 table rows across 228 module sections.** Every `File:Line` is a
2.1.220 line; a `(193)` tag inside a description refers to the baseline and is never used as a
`File:Line` value.

| File | Scope | Rows about |
|---|---|---|
| [`symbol_index_core_execution.md`](symbol_index_core_execution.md) | Agent loop, LLM API, tools, agent/subagent plumbing, state, system prompts | the query loop, the tool registry, spawn gates, message assembly |
| [`symbol_index_core_features.md`](symbol_index_core_features.md) | Plan mode, background agents, todo/tasks, compact, hooks, skills, thinking, steering, CLI, workflow, agent team, auto memory | the biggest of the four — the daemon, the hook registry, the task store, the workflow runtime |
| [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) | MCP, permissions, sandbox, auth, model selection, prompt building, telemetry | the model catalogue, the permission classifier, the sandbox backends, the OTel emitters |
| [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) | LSP, Chrome, IDE, UI components, plugins, code indexing, shell parser, slash commands | the renderer, the input hooks, the bridges, the command registry |

**Routing rule** (from [`../../../CLAUDE.md`](../../../CLAUDE.md) and [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §6):
mapping tables live *only* here and in the staging files below. Module documents reference symbols in
list format and never duplicate a table.

> ⚠ **Never reconcile these against a 2.1.193 index by name.** Identifiers are re-mangled between builds
> and ids get **reused for unrelated declarations** — the #1 trap in this tree. Confirmed collisions in
> this window: `cOt`, `BEy`, `OKt`, `yBc`, `lor`. Each staging file lists its own theme's collisions.

---

## 3. Symbol staging — `symbol_additions_v2_1_220_<theme>.md`

**29 files.** Each analysis pass wrote one; the four indexes above were mechanically merged from them.
They remain the **authoritative sources**, and they carry material the merge deliberately drops:
per-theme feature-gate and env-var censuses, symbol-collision warnings, and a merge-routing table naming
which `symbol_index_*.md` each group belongs in.

The count exceeds the 26 release themes because `36_background_agents` was split into daemon and view
passes, `42_workflow` has a separate deep-research follow-up, and `03_llm_core` is the current-state
architecture pass added after the delta tree.

Complete list, grouped by the module directory that produced each file:

| Module | Staging file |
|---|---|
| [`../03_llm_core/`](../03_llm_core/README.md) | [`symbol_additions_v2_1_220_llm_core.md`](symbol_additions_v2_1_220_llm_core.md) |
| [`../04_tools/`](../04_tools/README.md) | [`symbol_additions_v2_1_220_tools.md`](symbol_additions_v2_1_220_tools.md) |
| [`../05_plan_mode/`](../05_plan_mode/README.md) | [`symbol_additions_v2_1_220_plan_mode.md`](symbol_additions_v2_1_220_plan_mode.md) |
| [`../07_compact/`](../07_compact/README.md) | [`symbol_additions_v2_1_220_compact.md`](symbol_additions_v2_1_220_compact.md) |
| [`../30_agent_team/`](../30_agent_team/README.md) | [`symbol_additions_v2_1_220_agent_team.md`](symbol_additions_v2_1_220_agent_team.md) |
| [`../31_auto_memory/`](../31_auto_memory/README.md) | [`symbol_additions_v2_1_220_auto_memory.md`](symbol_additions_v2_1_220_auto_memory.md) |
| [`../36_background_agents/`](../36_background_agents/README.md) | [`symbol_additions_v2_1_220_background_agents_daemon.md`](symbol_additions_v2_1_220_background_agents_daemon.md) · [`symbol_additions_v2_1_220_background_agents_view.md`](symbol_additions_v2_1_220_background_agents_view.md) |
| [`../38_permissions/`](../38_permissions/README.md) | [`symbol_additions_v2_1_220_permissions.md`](symbol_additions_v2_1_220_permissions.md) |
| [`../39_mcp/`](../39_mcp/README.md) | [`symbol_additions_v2_1_220_mcp.md`](symbol_additions_v2_1_220_mcp.md) |
| [`../40_system_prompt/`](../40_system_prompt/README.md) | [`symbol_additions_v2_1_220_system_prompt.md`](symbol_additions_v2_1_220_system_prompt.md) |
| [`../41_hooks/`](../41_hooks/README.md) | [`symbol_additions_v2_1_220_hooks.md`](symbol_additions_v2_1_220_hooks.md) |
| [`../42_workflow/`](../42_workflow/README.md) | [`symbol_additions_v2_1_220_workflow.md`](symbol_additions_v2_1_220_workflow.md) · [`symbol_additions_v2_1_220_deep_research.md`](symbol_additions_v2_1_220_deep_research.md) |
| [`../43_slash_commands/`](../43_slash_commands/README.md) | [`symbol_additions_v2_1_220_slash_cli.md`](symbol_additions_v2_1_220_slash_cli.md) |
| [`../44_telemetry/`](../44_telemetry/README.md) | [`symbol_additions_v2_1_220_telemetry.md`](symbol_additions_v2_1_220_telemetry.md) |
| [`../45_skills/`](../45_skills/README.md) | [`symbol_additions_v2_1_220_skills_plugins.md`](symbol_additions_v2_1_220_skills_plugins.md) |
| [`../46_todo_tasks/`](../46_todo_tasks/README.md) | [`symbol_additions_v2_1_220_todo_tasks.md`](symbol_additions_v2_1_220_todo_tasks.md) |
| [`../47_models/`](../47_models/README.md) | [`symbol_additions_v2_1_220_models.md`](symbol_additions_v2_1_220_models.md) |
| [`../48_accessibility_ui/`](../48_accessibility_ui/README.md) | [`symbol_additions_v2_1_220_accessibility_ui.md`](symbol_additions_v2_1_220_accessibility_ui.md) |
| [`../49_sandbox/`](../49_sandbox/README.md) | [`symbol_additions_v2_1_220_sandbox.md`](symbol_additions_v2_1_220_sandbox.md) |
| [`../50_performance/`](../50_performance/README.md) | [`symbol_additions_v2_1_220_performance.md`](symbol_additions_v2_1_220_performance.md) |
| [`../51_headless_sdk/`](../51_headless_sdk/README.md) | [`symbol_additions_v2_1_220_headless_sdk.md`](symbol_additions_v2_1_220_headless_sdk.md) |
| [`../52_code_review/`](../52_code_review/README.md) | [`symbol_additions_v2_1_220_code_review.md`](symbol_additions_v2_1_220_code_review.md) |
| [`../53_subagent_limits/`](../53_subagent_limits/README.md) | [`symbol_additions_v2_1_220_subagent_limits.md`](symbol_additions_v2_1_220_subagent_limits.md) |
| [`../54_remote_control/`](../54_remote_control/README.md) | [`symbol_additions_v2_1_220_remote_control.md`](symbol_additions_v2_1_220_remote_control.md) |
| [`../55_auth_providers/`](../55_auth_providers/README.md) | [`symbol_additions_v2_1_220_auth_providers.md`](symbol_additions_v2_1_220_auth_providers.md) |
| [`../56_chrome_ide/`](../56_chrome_ide/README.md) | [`symbol_additions_v2_1_220_chrome_ide.md`](symbol_additions_v2_1_220_chrome_ide.md) |
| [`../57_api_reliability/`](../57_api_reliability/README.md) | [`symbol_additions_v2_1_220_api_reliability.md`](symbol_additions_v2_1_220_api_reliability.md) |

**Use a staging file when** the merged index tells you *what* a symbol is but you need *why the module
believed it* — the staging files keep the surrounding evidence (counts in both bundles, the gate that
guards it, the sibling symbols it was derived alongside).

---

## 4. Provenance registers

### [`_false_delta_ledger.md`](_false_delta_ledger.md) — the trap list

**343 lines, two registers.**

1. **Carryover traps (61 bullets)** — every bullet whose headline literal already exists in 2.1.193.
   Each row gives the probe, both counts, and either the narrower true delta or a plain statement that
   none was isolated. Every row is a *test*: grep the tree for the bullet's subject and confirm no module
   doc calls it new.
2. **Verified net-new anchors (125)** — confirmed `220>0 / 193=0` with the 2.1.220 line read. Safe to
   build on, and each is a citation worth re-opening during an audit.

The file opens with the warning that produced the most corrections in this tree: **a `220=N / 193=N`
count match does not prove carryover**, because ids are reused across builds. Its own `yBc` row was wrong
for exactly that reason and is corrected in place — 2.1.193's `yBc` is an unrelated vendored helper.

### [`_raw_asset_diff_193_to_220.md`](_raw_asset_diff_193_to_220.md) — the machine asset diff

**818 lines.** A mechanical diff of the two extracts' `assets/` directories: 326 claimed-new feature
gates, 42 gone, +15 tool entries, 51 claimed-new CLI flags, env-var and endpoint deltas. **Provenance
only — nothing here is source-verified.**

Two accuracy audits were added on top of it after the module pass, and they are the reason to read the
header before the tables:

- **The new-gate list is 99.4% reliable** — 324 of 326 are genuinely absent from 2.1.193. The two
  false-new entries are `gate_denied` and `tengu_session_fork`, both present in the 193 bundle.
- **The new-flag list is ~6× over-counted** — only about 8 are real new Claude Code flags; ~21 are argv
  Claude Code constructs for other binaries (git, gh, ripgrep, docker, the sandbox helper); and **~19 are
  not flags at all** — CSS custom properties from bundled skill payloads, an embedded argparse script,
  and substring artefacts such as `--hand` ⊂ `--handle-uri`.
- **Presence is not reachability.** The header carries the worked example: `tengu_remote_subagent_frame_nested`
  is genuinely new *and* sits inside `let ut = null; if (ut !== null) { … }`. A narrow window around the
  gate site looks perfectly live — read far enough up to find the guard.

### `_scope_v195_199.md` · `_scope_v200_205.md` · `_scope_v206_210.md` · `_scope_v211_214.md` · `_scope_v215_220.md`

**5 files, 2,300 lines.** The foundation pass's per-bullet probe. Between them they cover **578 of the
579 bullets**, one row each: bullet text, theme, kind, the literal probed, `220 / 193` counts, a best
2.1.220 line, a provisional verdict and a depth rating. Each file also opens with a narrative on the
shape of its release range and closes with the richest anchors it found.

- [`_scope_v195_199.md`](_scope_v195_199.md) — the window opens: Sonnet 5 and a large background-agent hardening push
- [`_scope_v200_205.md`](_scope_v200_205.md) — the auto-mode default flip and the permission-mode rename
- [`_scope_v206_210.md`](_scope_v206_210.md) — the `.208` performance/memory batch and the auth/AWS cluster
- [`_scope_v211_214.md`](_scope_v211_214.md) — the delegation caps and the `.214` security sweep
- [`_scope_v215_220.md`](_scope_v215_220.md) — Opus 5, `DirectoryAdded`, the settings-surface promotions

**These are working notes, not findings.** They are the fastest way to see *what was tried* for a
bullet — including the probes that came back empty — and they are the reason the module ledgers can say
"the scoping pass proposed X; reading X disproves it". A module README's correction table always
supersedes the scoping row it names.

---

## 5. What is deliberately *not* here

- **Theme analyses** — the 26 numbered module directories, each with its own `README.md`, per-bullet
  ledger, false-delta table and "Not covered" section.
- **Per-release analyses** — [`../by_version/`](../by_version/), 25 files, one per published release.
  Each carries a release narrative and a **100%-coverage per-bullet ledger**; every one of the 25 was
  verified to match its changelog bullet count exactly.
- **The rules** — [`../_CONVENTIONS.md`](../_CONVENTIONS.md) (bundles, citation rule, traps, format) and
  [`../_MODULE_TASK_BRIEF.md`](../_MODULE_TASK_BRIEF.md) (the contract every module agent worked under).
- **Hand-verified anchors** — [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md),
  written before any module agent ran. **Read its ⚠ blocks**: §6.6 was retracted (the compaction
  breaker it nominated as the window's headline is carryover), §6.3 was refined (the `.201` change was
  reverted at the role level while a presentation-level shim survives), §6.7 was superseded (the doubled
  MCP counts are a deliberate dual runtime, not a bundling artefact), and §6.5's fast-mode pricing
  conclusion was contradicted with source by two independent modules.
- **The agent specs** — [`../_specs/README.md`](../_specs/README.md), reference data describing how the
  26 module passes and the 25 release passes were scoped and launched.
- **The prior window** — [`../../../claude_code_v_2.1.193/analyze/`](../../../claude_code_v_2.1.193/analyze/),
  which remains the current-state reference for every mechanism this window did not change.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](symbol_index_infra_integration.md) - Integrations
>
> The 29 `symbol_additions_v2_1_220_<theme>.md` files in this directory are the authoritative sources
> those four were merged from; §3 above maps each one to the module that produced it.

This file cites no code of its own. The symbols worth knowing before using the indexes — because they
are the ones this window's biggest undocumented changes hang from:

- `BAKED_CATALOGUE` (`Skl`, `:14008-14496`) - the declarative model catalogue (routed to `symbol_index_infra_platform.md`)
- `getModelCatalogue` (`yQ`, `:14653`) - the memoised, zod-validated accessor over it
- `getMcpSdkGeneration` (`o9`, `:262846`) - selects the v1 or v2 MCP runtime tree
- `getMaxSubagentSpawnDepth` (`hee`, `:230896`) - the gate-backed delegation cap
- `emitOtelLogEvent` (`Ac`, `:167354`) - every `claude_code.*` OTel log record
- `logEvent` (`O`, `:4083`) - the emitter behind all 32 `tengu_dead_probe_*` sites
- `getTrustedSettingsSources` (`YLt`, `:204062`) - the sandbox scope primitive with five call sites
- `supportsMidConversationSystem` (`Ser`, `:150505`) - the mid-conversation system-role resolver
- `runQueryTurns` (`xud`, `:337348`) - the central explicit-state agent loop
- `StreamingToolExecutor` (`Wks`, `:331761`) - the model-stream-overlapped tool scheduler
