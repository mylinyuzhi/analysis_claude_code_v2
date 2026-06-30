# Overview — v2.1.183 → v2.1.193 (twelve-theme autonomy-hardening delta)

This directory is the **navigation surface** for the v2.1.183 → v2.1.193 analysis tree. It is **not** where features get explained in depth (those live under `../XX_<module>/`); it is the routing layer — the changelog narrative, the per-bullet code-traceability index, the source/file inventory, the twelve per-theme symbol-addition tables, the four canonical symbol indexes, the twelve adversarial delta cross-validation reports plus their roll-up, and the Plan Mode current-state validation report. Unlike the prior (v2.1.156 → v2.1.183) tree, **this window has no Layer-2 readable-source reconstructions** — it is a pure delta tree, because almost every change here is a small surgical edit on machinery that the 183 trees already reconstructed and that this tree links to rather than re-derives.

## What this tree IS (read this first)

This tree is a **FOCUSED delta analysis** of the **v2.1.183 → v2.1.193** window, scoped to **twelve themes** — not a comprehensive every-module re-analysis. Where the prior window *introduced whole features* (the implicit agent-team redesign, the `ultracode` keyword, nested subagents), this window is overwhelmingly **maturation of the autonomy surface already shipped**, plus exactly two genuinely new surfaces (`autoMode.classifyAllShell` and `/rewind`-before-`/clear`). The single through-line is **harden the autonomy surface**: auto mode gets stricter and more transparent, MCP gets more resilient, the background/subagent lifecycle gets more correct, and observability deepens — each via a surgical edit, not a new subsystem.

| # | Theme | Module dir | Headline delta(s) |
|---|-------|-----------|-------------------|
| 1 | **Permissions / auto-mode** | [`../38_permissions/`](../38_permissions/) | `autoMode.classifyAllShell` (193), denial-reason surfacing (193), `sandbox.credentials` (187), org model restrictions (187), recent-denied approve-persists + session-host remember (191), `Agent(type)` named-spawn deny (186) |
| 2 | **Background agents** | [`../36_background_agents/`](../36_background_agents/) | bg-shell memory-pressure reaping (193), fork-aware depth cap + resume-restore (187), permanent stop (191), backgrounding/panel fixes (193/191) |
| 3 | **MCP** | [`../39_mcp/`](../39_mcp/) | `claude mcp login/logout` CLI (186), headersHelper 401/403 re-auth (193), discovery/OAuth retries (191), idle timeout (187), name suggestions + retired-tool notice (186) |
| 4 | **Telemetry / OTEL** | [`../44_telemetry/`](../44_telemetry/) | `claude_code.assistant_response` event + the `OTEL_LOG_USER_PROMPTS` inheritance gotcha (193) |
| 5 | **Workflow / StructuredOutput** | [`../42_workflow/`](../42_workflow/) | StructuredOutput post-success lockout (187) + `agent({schema})` 5-attempt abort (186), `/workflows` status filter (186) |
| 6 | **Agent team** | [`../30_agent_team/`](../30_agent_team/) | `teammateMode:"iterm2"` (186), `--effort` inheritance (186), stop attribution (187) |
| 7 | **Skills** | [`../45_skills/`](../45_skills/) | frontmatter case-tolerance (186), malformed-YAML diagnostics (186), `/plugin` Skills section (186) |
| 8 | **Tools / CLI input** | [`../04_tools/`](../04_tools/) | `!` bash auto-respond (186), bash-mode path autocomplete (193), 50→51 tool surface |
| 9 | **Slash commands / plugins** | [`../43_slash_commands/`](../43_slash_commands/) | `/rewind` before `/clear` (191), plugin `renames` auto-follow (193), hook comma matcher (191), `/add-dir`/`/btw`/`/review`/retry-cap miscellany, current-version voice input deep dive |
| 10 | **System prompt** | [`../40_system_prompt/`](../40_system_prompt/) | env-block agent-proxy line, reminder-catalogue delta (one add, one remove vs 183) |
| 11 | **Auto memory** | [`../31_auto_memory/`](../31_auto_memory/) | `tengu_billiard_aviary` immutable-memory removal; MEMORY.md compact reminder (carryover) |
| 12 | **Compaction** | [`../07_compact/`](../07_compact/) | `Ego`→`Rxo` discriminated-union dispatcher refactor (behavior-preserving) |

**Current-state appendix:** [`../05_plan_mode/`](../05_plan_mode/) covers Plan Mode tools, reminders, prompts, approval UI, compact carryover, and remote Ultraplan scaffolding. It is not counted as a delta theme because the local `EnterPlanMode` / `ExitPlanMode` machinery is mostly carryover, but its symbols are routed through [`symbol_index_core_features.md`](symbol_index_core_features.md).

**Everything else is intentionally out of scope.** Many other subsystems changed in this same window — the large UI / terminal / Windows reliability tail, streaming-perf internals (~37% CPU drop), remote-control / update / share plumbing, model-picker stale-after-login, retry-cap tuning, and `claude agents` CLI-UX cosmetics — and they are **not** inventoried here. Each in-scope changelog bullet gets a `cli_inner_pretty.js:<line>` anchor; the out-of-scope bullets are named honestly (per-version "Out of scope" lines in [`changelog_to_code_map.md`](changelog_to_code_map.md), §13 of [`changelog_analysis.md`](changelog_analysis.md)) so nothing is silently dropped.

The source bundle under analysis is `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (`VERSION:"2.1.193"`, `cli_inner_pretty.js:211`; **718,679 lines**; build SHA `a1938d2a…`, build_time 2026-06-25, bun 1.4.0). Every factual claim is cited as `cli_inner_pretty.js:<line>`, verified by reading that line; citations tagged `(183)` (the before-picture bundle, 699,346 lines, build `9d251abd…`, 2026-06-18) or `(156)` (the deeper baseline, 649,979 lines) are deliberate before-pictures read in the prior bundles. **Obfuscated names are re-mangled every build** — every v2.1.193 name here was re-derived in the 2.1.193 bundle, never carried over by assumption. (The canonical trap: `$Cr` was `isSubagent` in 183 but is `isClassifyAllShellEnabled` in 193 — same token, different meaning. Always resolve by line, never by token across versions.)

## What's Here

### Narrative and traceability

| File | Purpose |
|------|---------|
| `README.md` | This file — overview navigation surface |
| [`changelog_analysis.md`](changelog_analysis.md) | Long-form architectural narrative — the 15-section read of the 2.1.185…2.1.193 cadence through the lens of the twelve themes; the deep-analysis of each headline delta (with dual-version code where load-bearing); §12 cross-cutting patterns; the §13 honest out-of-scope inventory; §14 settings/env/telemetry adds |
| [`changelog_to_code_map.md`](changelog_to_code_map.md) | Per-bullet code-traceability index — each in-scope changelog bullet → theme + `cli_inner_pretty.js:<line>` decl + module-doc link, with a per-version **"Out of scope (not analyzed in this tree)"** line enumerating the un-analyzed bullets |
| [`file_index.md`](file_index.md) | Extracted-source inventory — maps the twelve themes onto concrete `cli_inner_pretty.js:<line>` regions, plus the `assets/` extract directories (`feature_gates.json`, `env_vars.json`, `tools/_index.json` (50 tools), `prompts/`, `system_prompts/`, …); the entry point for "I want to read the code for one of the twelve themes" |
| [`changelog_delta_scoping.md`](changelog_delta_scoping.md) | The changelog-derived **planning** document — the entry point that categorized the published v2.1.185 → v2.1.193 delta by subsystem (§2), proposed the twelve-theme deep-analysis scope (§3), and laid out the scout→write→cross-validate pipeline (§4) **before** any source verification. Useful for "why was this theme chosen / where did the scope come from?" (marked PREPARATION; the source-cited truth lives in the three files above) |

### Symbol indexes — four-file routing layer

The canonical obfuscated → readable symbol mappings are split into four files by category, per [`/lyz/codespace/analysis_claude_code_v2/CLAUDE.md`](/lyz/codespace/analysis_claude_code_v2/CLAUDE.md). In this delta tree these four files are deliberately **thin**: they are a **routing layer** that records the most load-bearing shared anchors and points at the per-theme additions files, where the exhaustive line-by-line before/after tables actually live. Module docs use list-form `## Related Symbols` references, never tables; the mapping **tables** live only in these four files and the twelve `symbol_additions_v2_1_193_*.md` files.

| File | Scope (in this delta tree) |
|------|----------------------------|
| [`symbol_index_core_execution.md`](symbol_index_core_execution.md) | Tools framework / registry / surface (50→51, the `ReadMcpResourceDirTool` deferred add, the `!` bash-mode input path) + the **Agent named-spawn enforcement** and **Subagent spawn / depth-cap throw** primitives that the 187 fork-aware depth work routes through |
| [`symbol_index_core_features.md`](symbol_index_core_features.md) | The feature-level themes — **Auto-mode**, **Background Agents**, **Compact**, **Auto Memory**, **Workflow / StructuredOutput**, **Agent Team**, **Skills**. Carries the per-feature manifest links and feature-local anchors |
| [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) | **MCP** (login/logout, re-auth, retries, idle timeout), **Permissions / Sandbox / Model** (the shell-suspend predicate + gate, `sandbox.credentials`, the session-host cache, org entitlement gate), **Prompt** building (env-block agent-proxy line), **Telemetry / OTEL** (`assistant_response` + the tri-state gate) |
| [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) | **Slash Commands / Plugins / Hooks / Voice Input** and the CLI/UI surfaces they touch — `/rewind` markers, plugin `renames` resolver + settings migrator, the hooks comma matcher, `/voice` command/state/recording/STT integration, the `/plugin` Skills-section render |

When adding a new symbol, choose the file from its category in the routing matrix below.

#### Four-file routing matrix

Use this to decide which `symbol_index_*.md` a new mapping belongs in:

```
Core Execution  (symbol_index_core_execution.md):
  Agent Loop · LLM API · System Prompts · State
  Tools (framework/registry/surface/serialization/bash-mode input) · Agents · Subagent
  → in this tree: the 50→51 tool-surface delta + the Agent named-spawn enforcement
    and the subagent depth-cap throw (a property of the call entry, counted against the cap)

Core Features   (symbol_index_core_features.md):
  Auto-mode · Background Agents · Compact · Auto Memory · Workflow/StructuredOutput
  Agent Team · Skills
  (also: Todo · Hooks · Thinking/Effort · Plan · Steering · CLI — baseline only)

Platform Infra  (symbol_index_infra_platform.md):
  MCP Protocol · Permissions · Sandbox · Auth · Remote Control
  Model resolution/entitlement · Prompt building · Telemetry/OTEL
  → in this tree: MCP self-healing; the shell-suspend oracle + sandbox.credentials;
    the org model gate; the assistant_response event + its tri-state redaction gate

Integration Infra (symbol_index_infra_integration.md):
  LSP · Chrome/Browser · IDE · UI Components · Plugin System
  Code Indexing · Shell Parser · Slash Commands · Hooks
  → in this tree: /rewind markers, plugin renames auto-follow, hook comma matcher,
    /voice command/state/recording/STT integration, the /plugin Installed-tab Skills section
```

Routing edge cases this window forced (recorded in each additions file's home-routing note):
- **Permissions** rows split two ways: the shell-suspend predicate/gate, `sandbox.credentials`, the session-host cache, and the org model gate are **platform-infra**; the auto-mode allow-layer wiring and denial-reason render are **core-features (Auto-mode)**.
- **Tools**: the four MCP-dir-tool objects (`ReadMcpResourceDirTool` and siblings) are tool-surface objects owned by `04_tools/` (core-execution) but their protocol home is the **MCP** section of platform-infra — listed in tools' additions, cross-referenced from MCP's.
- **System prompt** rows route to platform-infra **Prompt**; the two model-switch-replay symbols may be cross-listed in core-execution but their canonical home is Prompt.
- **Skills**: the `/plugin` Installed-tab render touches the plugin-UI surface in integration-infra, but its primary home for this delta is the Skills feature index (core-features).

### Per-theme symbol additions (the exhaustive tables)

One file per theme. Each gives the v2.1.193 obfuscated identifier, readable name, `cli_inner_pretty.js:<line>`, and type for every symbol the theme touches, with the **before/after** picture (the v2.1.183 obfuscated name or a 0-count grep proving the symbol is new — often re-checked in 156 too) and a **home-index routing note** stating which `symbol_index_*.md` each row belongs to. These are the canonical mapping-table home for this tree. Several open with a **"Drift fixed vs the scout dossier"** note recording where the writing pass corrected a preliminary line cite.

| File | Theme | One-line scope |
|------|-------|----------------|
| [`symbol_additions_v2_1_193_permissions.md`](symbol_additions_v2_1_193_permissions.md) | Permissions / Auto-mode | `classifyAllShell` suspend-oracle gate (`$Cr`), denial-reason render, `sandbox.credentials` resolver (`Rqi`/`Yjd`) + session-host cache + sandbox controller (`ko`), org entitlement gate (`Uge`/`u_n`), `Agent(type)` named-spawn hoist, dark `toolDenialKind` taxonomy, worker-forwarding carryover |
| [`symbol_additions_v2_1_193_background_agents.md`](symbol_additions_v2_1_193_background_agents.md) | Background Agents | memory-pressure bg-shell reaper (`Mgl`, `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP`, `BG_SHELL_IDLE_REAP_MS`=30 min), fork-aware depth-cap throw + resume-restore, permanent-stop marker (`Mde`/`CXp`), phantom-resumed + carry-over-aware cancel fixes, bg-job cwd/resume metadata refresh (`k3i`/`R3i`/`$Kr`), stop-attribution (`killedBy`) |
| [`symbol_additions_v2_1_193_mcp.md`](symbol_additions_v2_1_193_mcp.md) | MCP | login/logout handlers (`L9f`/`D9f`), `callToolWithWatchdog` idle timeout + headersHelper 401/403 re-auth (in-flight reconnect map `pao`), discovery retry (`P1n`) + OAuth retry (`AOn`) + backoffs, name suggestions (`t3o`) + `RETIRED_TOOL_NAMES` guard |
| [`symbol_additions_v2_1_193_telemetry.md`](symbol_additions_v2_1_193_telemetry.md) | Telemetry / OTEL | `assistant_response` emit inside `recordApiRequestTelemetry` (`cSl`), the tri-state redaction gate `isAssistantResponseLoggingEnabled` (`dGi`), `OTEL_LOG_ASSISTANT_RESPONSES` (`FZc`, `Fe.triBool()`) + its `?? OTEL_LOG_USER_PROMPTS` inheritance, 60 KB cap |
| [`symbol_additions_v2_1_193_workflow.md`](symbol_additions_v2_1_193_workflow.md) | Workflow / StructuredOutput | success-guard + `requiresStructuredOutput` inline enforcement replacing the 183 Stop hook, the `agent({schema})` 5-failure cap (`NYp`) in the `wt` runner, the `/workflows` `f` status filter (`eYt`) — VM/contract carryover |
| [`symbol_additions_v2_1_193_agent_team.md`](symbol_additions_v2_1_193_agent_team.md) | Agent Team | `teammateMode:"iterm2"` enum + `detectAndGetBackend` branch (`uhs`/`kPe`), `--effort` inheritance into pane-spawned teammates, stop-attribution wording + idle banner — implicit-team spine is byte-identical carryover |
| [`symbol_additions_v2_1_193_skills.md`](symbol_additions_v2_1_193_skills.md) | Skills | schema/canonical-key recognition adds (`tVr`/`zEd`) with the **vestigial normalizer** gotcha (`KEd`/`uIh` built-but-unread, `Gm` ignores `normalizeKeys`), malformed-YAML `parseError` surfacing + `skill_load_yaml_failed`, `/plugin` Skills section (`OAf`/`In`) |
| [`symbol_additions_v2_1_193_tools.md`](symbol_additions_v2_1_193_tools.md) | Tools / CLI input | `!` auto-respond (`processBashCommand` `y6f`, `respondToBashCommands` default-true), `"bash-path"` autocomplete wiring (scanner carryover), `ReadMcpResourceDirTool` (`iX`/`_ne`) 50→51 deferred add |
| [`symbol_additions_v2_1_193_slash_commands.md`](symbol_additions_v2_1_193_slash_commands.md) | Slash Commands / Plugins / Hooks | `/rewind` `rewound` marker (`hYt`) + first-message gate + `XRc` resolver, plugin `renames` resolver (`s_t`) + settings migrator (`NHl`) + telemetry, hooks comma matcher (`s3f`), `/add-dir`/`/btw`/`/review`-medium/`MAX_RETRIES`-cap miscellany |
| [`symbol_additions_v2_1_193_system_prompt.md`](symbol_additions_v2_1_193_system_prompt.md) | System Prompt | env-block agent-proxy diagnostic line, the reminder-catalogue set-diff (exactly one add + one remove vs 183), model-switch-replay reminders — assembler/identity carryover |
| [`symbol_additions_v2_1_193_auto_memory.md`](symbol_additions_v2_1_193_auto_memory.md) | Auto Memory | the `tengu_billiard_aviary` immutable-memory / `tiny_memory` experiment **removal** (dream firing collapses 2-way → single `buildConsolidationPrompt` `$_l`), MEMORY.md compact-reminder proven **carryover** — runtime engine unchanged |
| [`symbol_additions_v2_1_193_compact.md`](symbol_additions_v2_1_193_compact.md) | Compaction | the `Ego`→`Rxo` auto-compact dispatcher return-shape refactor (flat `{wasCompacted}` → discriminated `{kind}` union), `CSl`/`VDn` helper extractions, circuit-breaker emit 2→1 — behaviorally byte-for-byte carryover |

### Cross-validation reports (one per delta theme + Plan Mode appendix + roll-up)

Each theme received an independent **default-to-FAIL adversarial pass**: every sampled `cli_inner_pretty.js:<line>` was re-opened at the exact line in the cited bundle and matched against the claim; every **NET-NEW** classification was proven by a 0-count grep in *both* the 183 and 156 bundles; every **CARRYOVER** claim was proven by a present-in-183 grep; and each doc was format-audited (forbidden mapping tables, `## Related Symbols` presence, dual-version snippet template, relative-link depth, English-only). The false-delta hunt deliberately diffs **both** baselines, because "new vs the old tree" is often carryover, not a v2.1.193 change.

| File | Theme module | 193 anchors re-read | Verdict |
|------|--------------|--------------------:|---------|
| [`cross_validation_summary.md`](cross_validation_summary.md) | roll-up | **625** | **12 / 12 PASS (HIGH confidence)** — aggregate across the twelve reports: **2 false deltas** caught and fixed (`user_kill_async` in agent-team, `mcp_headers_helper` in MCP — both pre-date the window), **42 line-precision / mislabel fixes** applied in place, **0 FAIL**. No fabricated anchors, no wrong tokens, no inflated deltas survived |
| [`cross_validation_report_permissions.md`](cross_validation_report_permissions.md) | `38_permissions` | ~85 | PASS (HIGH) — 0 false deltas; 4 ±1–2 line drifts fixed |
| [`cross_validation_report_background_agents.md`](cross_validation_report_background_agents.md) | `36_background_agents` | 95 | PASS (HIGH) — 0 false deltas (all 3 NET-NEW + metadata refresh + bounded panel-render/channel-status mechanisms + the carryover finalizer confirmed); 6 anchor defects fixed |
| [`cross_validation_report_mcp.md`](cross_validation_report_mcp.md) | `39_mcp` | 85+ | PASS (HIGH) — 1 false delta fixed (`mcp_headers_helper` is a pre-existing feature_name; only `reauth_retry` is new) + mapping/cite fixes |
| [`cross_validation_report_telemetry.md`](cross_validation_report_telemetry.md) | `44_telemetry` | 33 | PASS (HIGH) — all 3 NET-NEW proven 0-in-183/0-in-156; 1 trivial prose-count fix |
| [`cross_validation_report_workflow.md`](cross_validation_report_workflow.md) | `42_workflow` | 46 | PASS (HIGH) — 0 false deltas; 1 cite drift + 1 "byte-equivalent"→"logic-equivalent" wording fix |
| [`cross_validation_report_agent_team.md`](cross_validation_report_agent_team.md) | `30_agent_team` | 33 | PASS (HIGH) — 1 false delta fixed (`user_kill_async` pre-dates window) + grep-count + 2 decl-cite fixes |
| [`cross_validation_report_skills.md`](cross_validation_report_skills.md) | `45_skills` | ~45 | PASS (HIGH) — the vestigial-normalizer gotcha confirmed exact; 3 small cite drifts fixed |
| [`cross_validation_report_tools.md`](cross_validation_report_tools.md) | `04_tools` | 49 | PASS (HIGH) — all 3 headline deltas + both disambiguations classified against 183 **and** 156; 1 cite drift fixed |
| [`cross_validation_report_slash_commands.md`](cross_validation_report_slash_commands.md) | `43_slash_commands` | 80+ | PASS (HIGH) — 0 false deltas in the original delta set; 3 citation drifts fixed; voice input addendum verified as current-version subsystem analysis |
| [`cross_validation_report_system_prompt.md`](cross_validation_report_system_prompt.md) | `40_system_prompt` | 35 | PASS (HIGH) — reminder set-diff confirmed exactly one add + one remove; 2 mislabels + 3 cite drifts fixed |
| [`cross_validation_report_auto_memory.md`](cross_validation_report_auto_memory.md) | `31_auto_memory` | 30 | PASS (HIGH) — experiment-removal → 0 greps reproduced exactly; MEMORY.md reminder proven carryover; 3 fixes |
| [`cross_validation_report_compact.md`](cross_validation_report_compact.md) | `07_compact` | 30 | PASS (HIGH) — discriminated-union refactor + full carryover ledger reproduced byte-for-byte; 2 ±1 cite drifts fixed |
| [`cross_validation_report_plan_mode.md`](cross_validation_report_plan_mode.md) | `05_plan_mode` | 45+ | PASS (HIGH) — current-state appendix validated against 193 anchors, 183 before-picture, and 2.1.88 named-source mirror; correctly classified as carryover, not a thirteenth delta theme |

> The **625** roll-up is the sum of the distinct v2.1.193 anchors each delta-theme report re-read at their exact cited lines (independent of the additional 150+ before-pictures re-read in the 183/156 bundles and the 230+ grep-count diffs re-run across all three). Every one of the twelve delta reports closes **PASS WITH FIXES** — meaning the load-bearing analysis was sound and the only corrections were line-precision drift or two carryover-vs-delta mislabels, all fixed in place. `cross_validation_report_plan_mode.md` is intentionally outside that 12-theme roll-up because it validates a current-state appendix rather than a changelog delta. `cross_validation_summary.md` is the cross-theme roll-up + the tree-wide invariant re-check (forbidden-table scan, `## Related Symbols` presence, relative-link resolution sweep).

## Where to Start

- **Trying to understand one in-scope changelog bullet?** → [`changelog_to_code_map.md`](changelog_to_code_map.md) (and the per-version "Out of scope" lines if your bullet isn't there — it may be deliberately un-analyzed).
- **Trying to understand a theme (classifyAllShell, the bg-shell reaper, MCP self-healing, the `assistant_response` event, fork-aware depth)?** → [`changelog_analysis.md`](changelog_analysis.md) + the matching module folder under `../`.
- **Reading release-by-release what shipped (all subsystems, not just the twelve)?** → [`../by_version/README.md`](../by_version/README.md) — the index to the **per-release breadth files** (`2.1.185.md`, `2.1.186.md`, `2.1.187.md`, `2.1.190.md`, `2.1.191.md`, `2.1.193.md`), each a source-cross-validated pass over everything that release shipped or an explicit no-isolable-surface finding.
- **Want to read the actual code for a theme?** → [`file_index.md`](file_index.md) maps each theme onto `cli_inner_pretty.js:<line>` regions and the `assets/` extracts.
- **Looking up an obfuscated symbol?** → Pick the matching `symbol_index_*.md` by category (routing matrix above), then jump from there to the per-theme `symbol_additions_v2_1_193_*.md` for the exhaustive before/after row.
- **Gauging how trustworthy a mapping is?** → [`cross_validation_summary.md`](cross_validation_summary.md) for the aggregate; the per-theme `cross_validation_report_*.md` for the line-by-line PASS/FAIL log. Each additions file also opens with its before-picture / 0-count-grep evidence.
- **Where did the twelve-theme scope come from?** → [`changelog_delta_scoping.md`](changelog_delta_scoping.md) — the planning doc that categorized the published delta and proposed the scope before source verification.

## Narrative Summary

The window spans **10 version numbers** (2.1.184 … 2.1.193) but **6 published releases** — **.184, .188, .189, .192** never shipped (absent from the changelog entirely). The bundle grew ~19,300 lines (699,346 → 718,679). The cadence is a **single dense release punctuated by hardening tails**: 2.1.186 lands a large batch (33 items), then .187/.191/.193 each ship a focused mid-sized cluster, with .185/.190 as one-line reliability patches.

The four inflection points, in order:

- **2.1.186 — the reliability + MCP-CLI watershed.** The densest release. It adds `claude mcp login/logout` (auth a server from the CLI without the interactive menu), makes `!` bash commands auto-trigger a model response (`respondToBashCommands`, **default-on** — an upgrade-behavior change), closes a long tail of background-agent UX bugs, hoists `Agent(type)` enforcement to the named-spawn site, caps the workflow schema-retry loop at 5, makes skills frontmatter case-tolerant, gracefully loads malformed `SKILL.md` YAML, and pins `teammateMode:"iterm2"`. Most of this window's *new capabilities* are here.
- **2.1.187 — permissions + subagent-depth correctness.** `sandbox.credentials` blocks reading credential files / unsets secret env. Org entitlement model restrictions reach the picker, `--model`, `/model`, and `ANTHROPIC_MODEL`. **Subagent depth tracking is corrected** so resumed subagents restore their original spawn depth and **forked** subagents count toward the 5-level cap — a direct continuation of the v2.1.172/.181 nested-subagent work analyzed in the 183 tree. The remote MCP idle timeout and stop attribution (`killedBy`) land here too.
- **2.1.191 — MCP reliability + streaming perf + `/rewind`.** Capability discovery, OAuth, and token requests gain retry/backoff; streaming CPU drops ~37% by coalescing text updates to 100 ms; `/rewind` learns to resume from before `/clear`; the Recently-denied approve persists on close; stopping a bg agent becomes permanent; sandbox network "Yes" hosts are remembered for the session; the `"Bash,PowerShell"` hooks comma matcher finally fires.
- **2.1.193 — auto-mode safety surfacing + telemetry.** `autoMode.classifyAllShell` routes *all* Bash/PowerShell through the auto-mode classifier (not just arbitrary-code patterns); auto-mode denial reasons now reach the transcript, the toast, and `/permissions`; the `claude_code.assistant_response` OTEL event ships (with the `OTEL_LOG_USER_PROMPTS` inheritance gotcha); idle bg shells are reaped under memory pressure; MCP `headersHelper` self-heals on 401/403; plugin marketplace `renames` are auto-followed.

The maturation framing is exact: every feature touched here was *introduced in or before 2.1.183*. Nested subagents needed forks to count against the cap; the agent-team backends needed an explicit iTerm2 pin and effort inheritance; MCP needed to survive an expired token mid-call; the auto-mode classifier needed to explain *why* it denied. Reading the twelve deltas together, the same maturation instincts recur (detailed in §12 of [`changelog_analysis.md`](changelog_analysis.md)): **demote trust as one line** (`classifyAllShell` is a single prepended `if` in an existing suspend oracle), **reactive self-healing over proactive guards** (the MCP re-auth, the idle-timeout, the bg-shell reaper all *react* to a real 401 / silence / `memoryPressure` signal), **record-then-surface** (the denial reason was always recorded — 193 only renders it), **call-site enforcement over runtime refusal** (the depth cap composes tool-removal with a call-entry throw — belt and braces), and — the recurring operator hazard — **the upgrade-behavior gotcha**: three independent defaults flip behavior silently on upgrade (`assistant_response` inheriting `OTEL_LOG_USER_PROMPTS`, `respondToBashCommands` defaulting true, the bg-shell reaper defaulting on), each escapable by one explicit env/setting.

Two of the twelve themes are deliberately *thin*: **Compaction** is byte-for-byte behavioral carryover (the only change is the `Ego`→`Rxo` discriminated-union dispatcher refactor — **no compaction upgrade gotcha exists this window**), and **Auto Memory**'s one delta is a *removal* (the gate-off `tengu_billiard_aviary` immutable-memory experiment), so default-config users see zero behavior change. Both are documented to correct attribution and to give an analyst the `Ego`→`Rxo` / experiment-removal grep signatures.

See [`changelog_analysis.md`](changelog_analysis.md) for the depth on each theme and the §13 honest out-of-scope inventory; see [`changelog_to_code_map.md`](changelog_to_code_map.md) for the per-bullet pointers.

## Differences from the prior (v2.1.183) Overview Directory

This tree mirrors the v2.1.183 overview's file classes, with the adaptations a focused twelve-theme delta forces:

- **Twelve `symbol_additions_v2_1_193_*.md`, not five.** This window touched twelve themes (the 183 window scoped to five), so there are twelve per-theme additions tables. Each carries the **before-picture** (v2.1.183 obfuscated name or a 0-count grep, frequently re-checked in 156) inline, because the whole point of a delta tree is the change, not the static snapshot.
- **No Layer-2 reconstructions.** The v2.1.183 tree carried full readable-source reconstructions of six subsystems (tools / system prompt / system reminder / slash commands / agent team / auto memory) at v2.1.183. **This window adds none** — nearly every change is a surgical edit on machinery already reconstructed in the 183 trees, so this tree *links* the unchanged foundations rather than re-deriving them.
- **Thin four-file symbol indexes acting as a routing layer.** Because the exhaustive tables live in the per-theme additions files, the four `symbol_index_*.md` files here are deliberately compact — they record the most load-bearing shared anchors and route the reader to the additions file.
- **Twelve delta `cross_validation_report_*.md`, one Plan Mode current-state report, and one `cross_validation_summary.md`.** One adversarial report per delta theme plus the cross-theme roll-up (12/12 PASS HIGH, 625 anchors re-read, 2 false deltas caught, 42 fixes, 0 FAIL). `cross_validation_report_plan_mode.md` separately validates the Plan Mode appendix against 193 anchors, the 183 before-picture, and the 2.1.88 named-source mirror.
- **Per-version `by_version/` set, one file per published release.** [`../by_version/`](../by_version/) carries one breadth-analysis file for each published release (`2.1.185.md`, `2.1.186.md`, `2.1.187.md`, `2.1.190.md`, `2.1.191.md`, `2.1.193.md`), indexed by [`../by_version/README.md`](../by_version/README.md). The `.185` and `.190` files are intentionally thin: `.185` analyzes the stream-stall hint string/timer delta, while `.190` documents the no-isolable-surface maintenance placeholder.
- **Single-bundle build.** Like 183, the v2.1.193 build ships as one pretty-printed bundle (`cli_inner_pretty.js`, 718,679 lines) rather than a multi-`chunks.NN.mjs` split, so `file_index.md` maps the theme window onto `cli_inner_pretty.js:<line>` regions plus the `assets/` extract directories.

## Conventions Note

This tree adheres to the project-wide [`CLAUDE.md`](/lyz/codespace/analysis_claude_code_v2/CLAUDE.md) conventions. In particular:

- **No mapping tables in module docs.** Obfuscated → readable mapping **tables** live only in the four `symbol_index_*.md` files and the twelve `symbol_additions_v2_1_193_*.md` files. Module docs use list-form `## Related Symbols` references: `` `readableName` (`OBF`) — desc (cli_inner_pretty.js:NNN) ``. Before/after comparison tables and summary tables (like the theme, file, routing, and cross-validation tables above) are explicitly **not** obfuscated→readable mapping tables and are allowed.
- **Single source citation.** Every factual claim cites `cli_inner_pretty.js:<line>` in the **v2.1.193** bundle, verified by reading that line; `(183)` / `(156)` tags mark deliberate before-pictures read in the prior bundles. Obfuscated names are **re-mangled between builds** — every v2.1.193 name here was re-derived in the 2.1.193 bundle, never carried over by assumption (canonical trap: `$Cr` = `isSubagent` in 183 vs `isClassifyAllShellEnabled` in 193).
- **Code snippets follow the dual-version format**: header (`====` + ReadableName + Location) → ORIGINAL → READABLE → Mapping.

## See Also

- [`changelog_analysis.md`](changelog_analysis.md) — long-form twelve-theme narrative + §13 honest out-of-scope inventory + §14 settings/env/telemetry adds
- [`changelog_to_code_map.md`](changelog_to_code_map.md) — per-bullet code-traceability index, with per-version out-of-scope lines
- [`file_index.md`](file_index.md) — extracted-source inventory mapping the twelve themes onto `cli_inner_pretty.js` regions + `assets/`
- [`changelog_delta_scoping.md`](changelog_delta_scoping.md) — the changelog-derived planning / scoping document
- [`../by_version/README.md`](../by_version/README.md) — index to the per-release breadth files (`2.1.186.md` … `2.1.193.md`)
- [`../../CHANGELOG.md`](../../CHANGELOG.md) — the upstream v2.1.185 → v2.1.193 changelog (bullet source of truth)
- [`../../../claude_code_v_2.1.183/analyze/00_overview/README.md`](../../../claude_code_v_2.1.183/analyze/00_overview/README.md) — the prior window's overview README (style reference; v2.1.156 → v2.1.183, five-feature + reconstruction tree)
</content>
</invoke>
