# Claude Code v2.1.193 → v2.1.220 — a 26-theme source delta

This tree is a **line-anchored source delta** of the **v2.1.193 → v2.1.220** window: **25 published
releases** (`2.1.195 … 2.1.220`; `2.1.194` and `2.1.213` were never published) and **579 changelog
bullets**, the largest window analysed in this project so far. Every claim is anchored to a line that
was read in the 2.1.220 bundle, and every "this is new" claim is backed by a grep count in **both**
bundles.

It is a **delta tree**, not a module-complete re-analysis. Where a mechanism did not change, this tree
says so explicitly and links to the [`../../claude_code_v_2.1.193/analyze/`](../../claude_code_v_2.1.193/analyze/)
tree rather than restating it.

```
window     v2.1.193 → v2.1.220 · 25 published releases · 579 changelog bullets
bundle     872,596 lines / build_sha 4073f595 / build_time 2026-07-24T22:17:45Z
           (2.1.193 was 718,679 lines — the bundle grew +153,917 lines, +21.4%)
tree       26 module themes · 111 module docs · 25 by_version files · 4 symbol indexes
verdicts   NET_NEW 340 · UNANCHORED 99 · DELTA 85 · CARRYOVER 48 · SERVER_SIDE 3 · GATE_REMOVAL 2
coverage   509 / 579 bullets (87.9%) link to a module document
symbols    3,402 unique rows across 216 module sections in 4 indexes
```

---

## The window's story

**Two default models shipped, and both were one-line changes.** Claude Sonnet 5 arrived in `.197` as a
*single-bullet release*; Claude Opus 5 arrived in `.219`. A model launch is normally the loudest kind of
release and the quietest kind of diff — weights, routing and billing all live server-side — but these two
were quiet for a specific, undocumented reason: **the entire model registry was rewritten during this
window**, from roughly fifteen hand-written camelCase provider objects plus a dozen scattered
`if/else-if` ladders into one declarative, zod-validated, build-generated catalogue at
`cli_inner_pretty.js:14008-14496`. The catalogue carries its own maintenance contract in a `"//"` key at
`:14009` — *"On model launch add one entry to `models` below"* — and `.197` is the first release in the
window to exercise it. **No changelog bullet mentions the rewrite.** It is the single best example in
this tree of a changelog that under-reports, and it drags three more unannounced findings with it: an
eighth provider channel (`anthropic_google_cloud`, 23 sites / 193=0), an unannounced model family
(`claude-mythos-5` at `:14439`, every `provider_ids` value `null`), and the fact that **alias resolution
is provider-dependent** — so `.219`'s "now the default Opus model" is *first-party only*; Foundry and
gateway users still get Opus 4.6 / 4.7 from the bare word `opus`. See
[`47_models/model_catalogue_rewrite.md`](47_models/model_catalogue_rewrite.md).

**MCP forked in two, also with no bullet.** 2.1.220 ships **two complete MCP runtime trees** — `v1`
(default) and `v2` (opt-in via `MCP_SDK_GENERATION` or the gate `tengu_brindle_causeway`) — selected at
runtime through eight accessor functions guarded by an `MCP_TREE_ID` tripwire. This is why so many MCP
literals count exactly 2× their 2.1.193 value, and it has a practical consequence that changes how you
read the bundle: **the default MCP code path is the *higher* line range**, so reading the first hit of an
MCP literal means reading the non-default tree. See
[`39_mcp/dual_mcp_runtime_trees.md`](39_mcp/dual_mcp_runtime_trees.md).

**Delegation got a budget and a boundary.** In 2.1.193 a subagent could nest five deep and there was no
other limit on delegation at all — no concurrency ceiling, no per-session spawn count, no web-search
count. Across this window that became a four-cap system, and the caps are deliberately *asymmetric*:
per-session spawns (200) and web searches (200) are settable from `settings.json` and reset by `/clear`;
concurrency (20) is a machine-safety knob; and **spawn depth alone is resolved through a remote
GrowthBook gate** (`tengu_hazel_trellis`, default 3). That asymmetry is the mechanism behind the
`.217`→`.219` flip-flop in the changelog — the depth default was the one Anthropic expected to change
without shipping a release, and it did. See
[`53_subagent_limits/spawn_depth_gate.md`](53_subagent_limits/spawn_depth_gate.md).

**`.214` was a 47-bullet security sweep on mature machinery.** Almost every bullet in it resolves to a
single line: the over-length Bash guard is one added `if`; the `file -m` fix is three *deleted* map keys;
the docker fix is seven new strings in a list. The lesson the tree kept re-learning here is that a
literal count of 3/3 does not mean carryover — `.208`'s Edit fix was implemented by *deleting* a feature
gate (`tengu_cedar_sundial`, 220=0 / 193=1), so every one of its error strings is unchanged. See
[`38_permissions/security_hardening_214.md`](38_permissions/security_hardening_214.md).

**And the recurring pattern of the whole window is "shipped ≠ reachable".** Over and over, this tree
found code that is present, correct, and cannot execute:

- **A dead-code census.** `tengu_dead_probe_*` — 25 gates across 32 emission sites, 193=0 — instruments
  code Anthropic *believes* is already unreachable. Each fires once per process, reports a payload, and
  then lets the legacy path run unchanged. It is deletion-by-evidence, and it is entirely undocumented.
  ([`46_todo_tasks/dead_probe_gate_family.md`](46_todo_tasks/dead_probe_gate_family.md))
- **Dead remote gates.** Three of the six new `tengu_remote_*` gates are unreachable in the shipped
  binary; the whole "remote reply channel" sits behind a module-level `null` sentinel. And
  `tengu_remote_subagent_frame_nested` — the anchor two scoping rows leaned on — lives inside
  `let ut = null; if (ut !== null) { … }`. ([`54_remote_control/client_surfaces.md`](54_remote_control/client_surfaces.md))
- **A disarmed migration.** The `alias_migration` runner executes on every first-party startup, its
  table is `{}`, the catalogue's own `alias_migration` field is schema-validated and read by nothing.
  Fully plumbed, entirely inert. ([`47_models/model_catalogue_rewrite.md`](47_models/model_catalogue_rewrite.md))
- **A notice with a 1h42m life.** The Opus 4.7 fast-mode sunset banner defaults to `2026-07-25`; this
  build's `build_time` is `2026-07-24T22:17:45Z`. 2.1.220 is the last build that can ever display it —
  and the `.219` bullet claiming the removal already happened is **not implemented client-side** at all.
  ([`47_models/fast_mode.md`](47_models/fast_mode.md))

Alongside those, several bullets describe things the code contradicts: `.201`'s Sonnet-5 change was
reverted *at the role level* and replaced by a presentation-level shim
([`40_system_prompt/mid_conversation_system_role.md`](40_system_prompt/mid_conversation_system_role.md)),
`.208` "added" a screen reader mode that had already shipped dark in 2.1.193 with a byte-identical
settings description ([`48_accessibility_ui/screen_reader_mode.md`](48_accessibility_ui/screen_reader_mode.md)),
and the Windows sandbox backend was rebuilt around a provisioned low-privilege user with a kernel WFP
egress fence — with no bullet at all ([`49_sandbox/windows_user_sandbox.md`](49_sandbox/windows_user_sandbox.md)).

That is the shape of the window: **a changelog that simultaneously over-claims and under-reports, on top
of a codebase that grew 21.4% in 29 days.**

---

## The 26 themes

Doc counts are deep-dive documents plus the module `README.md` (which always carries the theme's
per-bullet ledger).

| Theme | Covers | Docs | The finding worth knowing | Link |
|---|---|---:|---|---|
| Tools | Tool surface 50 → 65, `EndConversation`, Bash/PowerShell, file+search, web+misc | 5+R | `EndConversation` is guarded by **four independent gates** (model version floor, entrypoint regex, enable flag, flag-value parse) and its session lockout leaves exactly five slash commands alive | [`04_tools/`](04_tools/) |
| Plan mode | Read-only auto-allow, Bash bypasses, classifier adjudication | 2+R | Every plan-mode bullet is the same bug six times: permission fast paths never asked *"but are we in plan mode?"*. One two-line predicate, seven insertion sites, no rewrites | [`05_plan_mode/`](05_plan_mode/) |
| Compact | Dispatcher and breakers, context accounting, `/context` | 2+R | The assigned headline was a **false delta** — the compaction failure breaker is byte-for-byte carryover. The real `.217` fix is a model-pinned conjunct *deleted* from three predicates at once | [`07_compact/`](07_compact/) |
| Agent team | Mailbox transport, teammate lifecycle and notifications | 2+R | `teammate` grew 385→426 while `mailbox` grew 19→48: the team surface barely moved and the *message transport* was hardened 2.5×, validated at both ends of the wire | [`30_agent_team/`](30_agent_team/) |
| Auto memory | Frontmatter rewrite safety, memory-index size budget | 2+R | An undocumented `<cc-memory>` citation surface (5 / 193=0) ships behind a default-off gate — prompt side, strip side, extract side and telemetry side, with no bullet anywhere | [`31_auto_memory/`](31_auto_memory/) |
| Background agents | Daemon, worker respawn, session store, agent view, `/fork`, notifications | 6+R | The densest theme (112 of 579 bullets). Daemon handover stopped judging recency by semver and now parses an **embedded build timestamp**; `CLAUDE_CODE_PROCESS_WRAPPER` adds a corporate launcher prefix to every self-spawn | [`36_background_agents/`](36_background_agents/) |
| Permissions | Auto-mode availability, classifier adjudication, rule matching, `.214` hardening | 5+R | Auto mode stopped being opt-in via **one line** — a provider predicate that read an env var became `return !0`. Everything else in `.207`/`.210`/`.212` is the consequence | [`38_permissions/`](38_permissions/) |
| MCP | Dual runtime trees, auto-backgrounding, errors, OAuth/timeouts, roots and managed config | 5+R | Two complete MCP runtime trees ship in one bundle, chosen at runtime — the largest MCP change in the window and it has **no bullet at all** | [`39_mcp/`](39_mcp/) |
| System prompt | Mid-conversation system role, reminder framing and human origin | 2+R | There are **three** framing states, not two: Sonnet 5, Opus 4.8, and everything else. `.201`'s role-level exclusion was reverted and a presentation-level shim replaced it | [`40_system_prompt/`](40_system_prompt/) |
| Hooks | `DirectoryAdded`, matching and exit codes, trust and origin | 3+R | One new event and nine repairs — and seven of the nine repairs are **single-expression edits**: one added conjunct, one added argument, one added character in a regex class | [`41_hooks/`](41_hooks/) |
| Workflow | Size guideline, workflow runtime and UI | 2+R | No new workflow capability shipped. Three of the six real deltas are *"the terminal was right and the other consumer was not"* — each new output channel got its progress republishing wrong once | [`42_workflow/`](42_workflow/) |
| Slash commands / CLI | `/fork` and `/subtask`, `/doctor` and diagnostics, command and flag deltas | 3+R | `/fork` has **two descriptors** in 2.1.220 and a runtime gate picks one — the changelog calls it a rename, the code implements a conditional swap. Also: the "51 new CLI flags" list is ~6× over-counted | [`43_slash_commands/`](43_slash_commands/) |
| Telemetry / OTel | Attributes and correlation, truncation and exporters, cost metering, feature flags | 4+R | Nothing new was *measured* — the OTel event count is 39 in both builds — and almost everything became **joinable**, through one emission function gaining a third parameter | [`44_telemetry/`](44_telemetry/) |
| Skills / plugins | `context: fork` backgrounding, skill loading and stacking, plugin config and security | 3+R | A **failure-direction discipline**: every new limit fails in the least destructive direction available. Only two sites in the whole theme throw, and both would otherwise run attacker-controlled text in a shell | [`45_skills/`](45_skills/) |
| Todo / tasks | Dead-probe gate family, task-tracking deltas | 2+R | The task machine did not change at all — and the theme surfaced the tree's biggest *mechanism* find: the 25-gate `tengu_dead_probe_*` census staged for a future deletion | [`46_todo_tasks/`](46_todo_tasks/) |
| Models | Catalogue rewrite, Opus 5 + Sonnet 5, fast mode, org defaults and picker, Google Cloud channel | 5+R | The undocumented headline of the whole window: the model registry became a declarative catalogue, and provider-dependent alias resolution means *"the default Opus"* is first-party only | [`47_models/`](47_models/) |
| Accessibility / UI | Screen reader mode, vim and input, emoji completion, terminal rendering | 4+R | The Ink renderer core is **byte-equivalent** between the builds (ten identifiers, identical counts), so the window's "rendering performance" bullets are component work, not core work | [`48_accessibility_ui/`](48_accessibility_ui/) |
| Sandbox | `strictAllowlist`, `filesystem.disabled` and paths, credentials masking, Windows user sandbox | 4+R | The same shape three times: build a capability **dark**, then attach a settings field and a scope rule and call it "Added". The enabling refactor — a reusable trusted-scope primitive — is invisible in the changelog | [`49_sandbox/`](49_sandbox/) |
| Performance | Memory bounds and leaks, CPU and caching, disk and transcript | 3+R | `flattenString` breaks V8's `SlicedString` parent pointer and is wired into a truncator with **65 call sites**; the `.217` MCP memory bullet is one symptom of a class fix | [`50_performance/`](50_performance/) |
| Headless / SDK | stream-json init and output, control requests, subagent text forwarding | 3+R | The process-IO module rewrite is *"four bullets in a trench coat"* — and its enabling change (the stdout guard finally forwarding the write callback) has no bullet at all | [`51_headless_sdk/`](51_headless_sdk/) |
| Code review | `/code-review` as a background subagent, `/ultrareview` arguments, manual-invocation gating | 3+R | The `/ultrareview` precondition function went from **123 lines to 422**, and eight separate bullets all land inside it — each one a recovery path bolted onto a refusal that used to be terminal | [`52_code_review/`](52_code_review/) |
| Subagent limits | Spawn-depth gate, concurrency and session caps, budget and delegation hardening | 3+R | Four caps, and only the depth cap is gate-backed — which is exactly how the default moved from "no nesting" to "depth 3" without an emergency release | [`53_subagent_limits/`](53_subagent_limits/) |
| Remote control | Transport and session lifecycle, security and enablement, client surfaces | 3+R | 21 of 23 bullets are repairs to a transport that already existed. Three of the six new `tengu_remote_*` gates are **unreachable in the shipped binary** | [`54_remote_control/`](54_remote_control/) |
| Auth / providers | Login and credentials, AWS and provider plumbing, transport settings | 3+R | *"Every AWS literal is unchanged"* is true and misleading: a whole caching, timeout and invalidation layer was inserted between Claude Code and the AWS SDK, and no bullet mentions it | [`55_auth_providers/`](55_auth_providers/) |
| Chrome / IDE | Bridge transport, Chrome GA and hardening, IDE and desktop | 3+R | **"Bridge" names three unrelated transports** (Chrome extension, environment/work bridge, REPL bridge). Anyone who greps `bridge` will conflate them; this module separates them first | [`56_chrome_ide/`](56_chrome_ide/) |
| API reliability | Retry policy, streaming and watchdog, transport errors | 3+R | Nothing was rewritten; everything was **reclassified** — a set gained members, a set was split, or a gate was deleted. Two headline bullets therefore have literal counts that go *down* | [`57_api_reliability/`](57_api_reliability/) |

---

## The build under analysis

```
TARGET     /lyz/codespace/claude-code-bomb/versions/2.1.220/extract/
  cli_inner_pretty.js        872,596 lines / 29,422,342 bytes
                             VERSION 2.1.220 · build_sha 4073f595… · build_time 2026-07-24T22:17:45Z
                             Bun 1.4.0 (f6d0fcd24) · linux-x64
  cli_unpack_pretty/         49,263 decls (20,588 fn / 13,929 var / 13,824 var-empty /
                             611 ExpressionStatement / 310 class / 1 IfStatement)
  assets/                    578 prompts · 11 system_prompts · 65 tools · 1,731 feature gates ·
                             934 cli_flags · 470 endpoints / 136 hosts

BASELINE   /lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js
                             718,679 lines · build_sha a1938d2a…   (cited as "(193)")
DEEPER     /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js  (optional)
NAMES      /lyz/codespace/3rd/claude-code/src/   v2.1.88 readable TypeScript — 132 versions stale;
                                                 corroborates NAMES and INTENT, never behaviour
```

Full inventory, per-asset trust notes and a 55-row map of *which line region holds which feature*:
[`00_overview/file_index.md`](00_overview/file_index.md).

---

## Navigation

| I want to know… | Go to |
|---|---|
| …what a specific release shipped, end to end | [`by_version/`](by_version/) — one file per published release, each with a release narrative and a **100%-coverage per-bullet ledger** (e.g. [`by_version/2.1.212.md`](by_version/2.1.212.md), the 48-bullet delegation release) |
| …how one feature changed | the matching module directory in the table above — start at its `README.md`, which carries the theme narrative and the per-bullet ledger, then follow the ledger's "Doc section" column |
| …what an obfuscated symbol means | the four indexes: [core execution](00_overview/symbol_index_core_execution.md) · [core features](00_overview/symbol_index_core_features.md) · [platform infra](00_overview/symbol_index_infra_platform.md) · [integrations](00_overview/symbol_index_infra_integration.md) |
| …whether a changelog bullet is real | [`00_overview/changelog_to_code_map.md`](00_overview/changelog_to_code_map.md) — all 579 bullets with a verdict, an anchor and a module link — then [`00_overview/_false_delta_ledger.md`](00_overview/_false_delta_ledger.md) for the 61 known carryover traps |
| …which bullets nobody could anchor | the **Gap register** in [`00_overview/changelog_to_code_map.md`](00_overview/changelog_to_code_map.md) §4, and the "Not covered" section every module README ends with |
| …where a feature lives in the bundle | [`00_overview/file_index.md`](00_overview/file_index.md) §6, or grep the bundle for a stable string |
| …the rules this tree was written under | [`_CONVENTIONS.md`](_CONVENTIONS.md) (bundles, citation rule, the eight traps, doc format) and [`_MODULE_TASK_BRIEF.md`](_MODULE_TASK_BRIEF.md) |
| …what was hand-verified before any agent ran | [`_GROUND_TRUTH_verified_anchors.md`](_GROUND_TRUTH_verified_anchors.md) — **read its ⚠ blocks**, several of its own claims were later retracted or refined |
| …what the previous window looked like | [`../../claude_code_v_2.1.193/analyze/`](../../claude_code_v_2.1.193/analyze/) — the v2.1.183 → v2.1.193 tree this one continues from, and the reference for every mechanism this window did not change |

Full guide to the navigation layer itself: [`00_overview/README.md`](00_overview/README.md).

---

## How to trust this tree

**The citation rule.** Every factual claim cites `cli_inner_pretty.js:<line>`, and that line was read in
the **2.1.220** bundle by the agent making the claim. Line numbers are stable only within one build, so
the durable anchor is always the string literal, tool name, telemetry gate, env-var name or settings key
cited alongside. Any line quoted from the baseline is explicitly tagged `(193)`.

**The both-bundles rule.** To call something net-new, the grep count is shown in both bundles
(`220=N / 193=0`). To call it carryover, both counts are shown *and both sites are read* — because
identifiers are re-mangled between builds and old ids get reused for unrelated declarations. A matching
count is not proof; `cOt`, `BEy`, `OKt`, `yBc` and `lor` are all confirmed collisions in this window.

**The traps that produced real errors here**, all documented in [`_CONVENTIONS.md`](_CONVENTIONS.md) §4:

- `grep -c` treats its argument as a **regex**. An unescaped `.` in `workflow.run_id` matched 2.1.193's
  unrelated snake_case `workflow_run_id` and produced a **false carryover** verdict. Use `grep -cF`.
  Note the direction: this trap creates false *negatives*, so a "when in doubt, say carryover" bias
  actively conceals it.
- The extracted asset lists lie in both directions. `env_vars.json` lost 163 live entries and gained 47
  that are obfuscated identifiers; the top-level `tools_index.json` has one entry; `slash_commands.json`
  is full of filesystem paths; the "51 new CLI flags" list is ~6× over-counted (19 of them are CSS
  custom properties and substring artefacts); `feature_gates.json` both lists two gates that are really
  carryover and *omits* two live `tengu_dead_probe_*` names.
- **Presence is not reachability.** A gate can be genuinely new (193=0) and sit in statically dead code.
  Read far enough up the guard chain before writing it up.

**QA.** Each of the 25 per-release ledgers was checked against its changelog bullet count and **all 25
match exactly**. A random 400-row sample of citations across the tree was re-opened in the bundle; the
**measured citation error rate is 0.25%**, and the errors found were line-precision drifts, never a
fabricated line or an inverted verdict.

**And several claims in this tree's own reference files were retracted or refined during the build.**
That is worth stating plainly, because it is the strongest available evidence that the method works:

- **`_GROUND_TRUTH` §6.6 is retracted.** It asked `07_compact` to write up a compaction failure breaker
  as the window's undocumented headline. The `07_compact` pass proved it is **pure carryover** — guard
  line, threshold, incrementer, reset, gate and log string all present in 2.1.193 — and the orchestrator
  re-verified it against both bundles. The mechanism is still documented, as carryover, in
  [`07_compact/dispatcher_and_failure_breakers.md`](07_compact/dispatcher_and_failure_breakers.md).
- **§6.3 is refined, not simply reversed.** `40_system_prompt` showed that `.201`'s *role-level*
  exclusion was reverted while a **Sonnet-5-only carve-out survives at the presentation level**, so the
  correct picture is three framing states rather than two:
  [`40_system_prompt/mid_conversation_system_role.md`](40_system_prompt/mid_conversation_system_role.md).
- **§6.7 is superseded.** The doubled MCP literal counts were originally filed as a bundling artefact;
  `39_mcp` proved they are a deliberate dual-generation runtime. The practical advice survived; the
  explanation did not: [`39_mcp/dual_mcp_runtime_trees.md`](39_mcp/dual_mcp_runtime_trees.md).
- **§6.5 is contradicted with source by two independent modules.** Fast-mode pricing *is* implemented
  client-side — not as a multiplier but as a cost-table substitution keyed on `usage.speed` — so session
  cost is **not** under-reported in fast mode ([`44_telemetry/cost_and_usage_metering.md`](44_telemetry/cost_and_usage_metering.md),
  [`47_models/fast_mode.md`](47_models/fast_mode.md)).
- **One false-carryover row was retracted outright.** `workflow.run_id` / `workflow.name` were written
  off as "partially pre-existing" on a regex-artefact count; with `grep -cF` both are **1/0, fully
  net-new** ([`44_telemetry/otel_attributes_and_correlation.md`](44_telemetry/otel_attributes_and_correlation.md)).

Beyond the reference files, the module passes disproved **dozens of anchors proposed during scoping** —
in several cases by reading the proposed site and showing it belongs to an entirely different feature.
Those negative results are recorded in the module READMEs rather than quietly dropped, because a
correct "this is carryover, and here is the proof" beats a plausible-sounding invented delta. False
delta inflation was the #1 defect in previous trees' cross-validation, and this tree was built to
fail loudly in that direction.

---

## Layout

```
analyze/
├─ README.md                       ← you are here (front door)
├─ _CONVENTIONS.md                 bundles · citation rule · the 8 traps · doc format (read first)
├─ _MODULE_TASK_BRIEF.md           the shared contract every module agent worked under
├─ _GROUND_TRUTH_verified_anchors.md   hand-verified anchors + the ⚠ retraction/refinement blocks
├─ _specs/                         module + by_version agent specs (reference data, not workflows)
│
├─ 00_overview/                    navigation, provenance and symbol routing — see its README
├─ by_version/                     25 per-release files, one per published release, each with a
│                                  100%-coverage per-bullet ledger
│
│  ─── the 26 theme deltas ───
├─ 04_tools/                 05_plan_mode/          07_compact/          30_agent_team/
├─ 31_auto_memory/           36_background_agents/  38_permissions/      39_mcp/
├─ 40_system_prompt/         41_hooks/              42_workflow/         43_slash_commands/
├─ 44_telemetry/             45_skills/             46_todo_tasks/       47_models/
├─ 48_accessibility_ui/      49_sandbox/            50_performance/      51_headless_sdk/
├─ 52_code_review/           53_subagent_limits/    54_remote_control/   55_auth_providers/
└─ 56_chrome_ide/            57_api_reliability/
```

Every module directory has the same shape: a `README.md` carrying the theme narrative, a **per-bullet
ledger** with a verdict and anchor for every changelog bullet in that theme, a false-delta table, and an
explicit **"Not covered"** section; plus two to six deep-dive documents.

---

## How to find a feature in v2.1.220 source

1. Pick a **stable string** for the feature — a tool name, a `tengu_*` gate, an env var, a settings key,
   or a fragment of an error or prompt. Not an obfuscated identifier: those are re-mangled every build.
2. `grep -nF '<string>' /lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
3. `grep -cF '<string>' $TARGET $BASELINE` — **both files, always, before writing a sentence.**
4. Read the enclosing declaration, its callers and its gate. Then read the *2.1.193 twin* before
   concluding anything about what changed.
5. For a single symbol in isolation, `cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js` holds
   the decl body; `_manifest.json` carries name + kind + bytes for all 49,263 of them.

Worked examples of this loop — including the ones that went wrong and how they were caught — are in
[`_GROUND_TRUTH_verified_anchors.md`](_GROUND_TRUTH_verified_anchors.md) §6.4 and in every module
README's "False deltas caught" table.

---

## See also

- [`../CHANGELOG.md`](../CHANGELOG.md) — the upstream changelog this tree tracks; the source of all 579 bullets
- [`../../claude_code_v_2.1.193/analyze/`](../../claude_code_v_2.1.193/analyze/) — the prior v2.1.183 → v2.1.193 tree, and the current-state reference for everything this window did not change
- [`../../CLAUDE.md`](../../CLAUDE.md) — project conventions: symbol-index routing, the no-mapping-tables-in-module-docs rule, the dual-version code-snippet template

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](00_overview/symbol_index_infra_integration.md) - Integrations
>
> Per-theme staging files (the authoritative sources the four indexes were merged from) live in
> [`00_overview/`](00_overview/) as `symbol_additions_v2_1_220_<theme>.md`.

The symbols that most repay knowing before reading anything else in this tree:

- `BAKED_CATALOGUE` (`Skl`, `:14008-14496`) - the declarative model catalogue; the window's biggest undocumented change
- `getMcpSdkGeneration` (`o9`, `:262846`) - which of the two MCP runtime trees is live
- `getMaxSubagentSpawnDepth` (`hee`, `:230896`) - the only gate-backed delegation cap; source-proof of the `.217`→`.219` flip
- `isFastModeEligibleModel` (`mv`, `:109467`) - the predicate that contradicts `.219`'s Opus 4.7 removal bullet
- `supportsMidConversationSystem` (`Ser`, `:150505`) / `isSonnet5` (`mro`, `:150395`) - the reverted-and-shimmed `.201` pair
- `autoCompactDispatcher` (`FHs`, `:441115`) - the `{kind}` union, unchanged in shape since 2.1.193
- `emitOtelLogEvent` (`Ac`, `:167354`) - the one function whose new third parameter is five telemetry bullets
- `isTaskTrackingSuppressedForModel` (`_te`, `:403922`) - the undocumented model-targeted tool kill switch
- `getTrustedSettingsSources` (`YLt`, `:204062`) - the scope primitive the whole sandbox-settings window turns on
- `getOpus47FastModeSunsetDate` (`LIc`, `:109491`) - the notice whose live window was one hour and 42 minutes
