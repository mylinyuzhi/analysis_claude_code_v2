# Claude Code v2.1.156 → v2.1.183 — Five-Feature Source Delta + Capability Reconstructions

This tree has **two layers**. The original layer is a **focused delta analysis** of the **v2.1.156 → v2.1.183** window, scoped to **five features the user requested** — not a comprehensive every-module re-analysis. Where the prior tree ([`../../claude_code_v_2.1.156/analyze/`](../../claude_code_v_2.1.156/analyze/)) covered v2.1.143 → v2.1.156 as a broad ~13-module analysis, the delta layer narrows to five subsystems and traces *only* how each one changed across the 27-version (22-published-release) window between 2.1.156 and 2.1.183. The second layer (added later) is a **readable-source restoration** of four core capability subsystems — **tools, system prompt, system reminder, and slash commands** (`/loop` · `/goal` · `/batch` · `/simplify`) — rebuilt as clean TypeScript at v2.1.183 (see "Reconstructed-source capability modules" below).

**The five focus features:**

1. **Agent Team** — the v2.1.178 implicit-team redesign (`TeamCreate`/`TeamDelete` removed; the Agent tool becomes the teammate spawner)
2. **Dynamic Workflows** — the `workflow`→`ultracode` keyword rename + tool-definition/runtime correctness fixes
3. **Background Agents** — the nested-subagent 5-level depth limit, worker provider-env isolation, `agents --json`, and `/bg` lifecycle
4. **Compaction** — `--fallback-model` honored in summarize, the 1M-credits clamp-back, the six-source window resolver
5. **Auto Memory** — team/remote memory stores (`CLAUDE_MEMORY_STORES`) recall + the memory status-line render

**Plus — five reconstructed-source capability modules (a second, deeper pass):**

Beyond the five-feature *delta*, this tree also carries a **readable-source restoration** of five core subsystems **as they exist in v2.1.183** — not a diff, but the *whole machine* rebuilt as clean TypeScript organized like the genuine v2.1.88 `src/` tree (the same approach as [`42_workflow/reconstructed_source/`](42_workflow/reconstructed_source/)):

- **Tools** ([`04_tools/`](04_tools/)) — the `Tool`/`buildTool` framework, the `getAllBaseTools`→`getTools`→`assembleToolPool` registry, `buildToolSchema` wire-serialization + `eager_input_streaming`, the deferred-tool/ToolSearch machine, and **all ~48 built-in tools at contract level** (identity · Zod schema · verbatim description · `validateInput` · `checkPermissions` · `call`).
- **System Prompt** ([`40_system_prompt/`](40_system_prompt/)) — the `buildEffectiveSystemPrompt` assembler + lean/full gate, the identity strings, the three main-loop builders, the environment block, the cacheable-section registry, and the five sub-agent prompt variants.
- **System Reminder** ([`41_system_reminder/`](41_system_reminder/)) — the `<system-reminder>` wrap/strip/extract primitives, the `collectAttachments` generator pool, the `PWn` dispatcher + renderer map, and the exhaustive 25-string reminder catalogue.
- **Slash Commands** ([`43_slash_commands/`](43_slash_commands/)) — four user-facing commands: **`/loop`** (recurring/self-pacing scheduler), **`/goal`** (Stop-hook "keep working until met"), **`/batch`** (5–30 worktree background agents each opening a PR), **`/simplify`** (4 parallel cleanup agents). The shared `registerBundledSkill` (`ap`) registrar + registry, the three bundled skills, and `/goal`'s dual `local-jsx`+`local` `Command`. **Three of the four port a *direct* v2.1.88 named-TS ancestor forward** (`src/skills/bundled/{batch,loop,simplify}.ts`); `/goal` is a 2.1.156-era addition.
- **Agent Team** ([`30_agent_team/`](30_agent_team/)) — the full "swarm" machine **at v2.1.183** (this delta module's source-level companion): the implicit session-team bootstrap (`initializeSessionTeam`), the **Agent-tool-as-spawner** routing, the three spawn backends (in-process / tmux / iTerm2) including the `send-keys`→`respawn-pane` tmux fix, the file mailbox + control-message protocol, **`SendMessage`** (`"main"`/`uds:`/`bridge:` addressing), **coordinator mode**, the leader permission bridge, and the background-task keepalive survival fix. Organized like the genuine v2.1.88 `src/utils/swarm`, `tools/AgentTool`, `tools/SendMessageTool`, `coordinator` tree — and here **the v2.1.88 swarm is a *real* ancestor** (not gated out, unlike Workflow), so carryover parts port real names/logic forward while the v2.1.178 redesign deltas come from the 183 bundle.

The first three modules were built by an **anchor-harvest → reconstruct → adversarial-verify → coherence + cross-validation** pipeline: **42 reconstructed `.ts` files (~23,700 LOC)**, every symbol anchored to a verified `cli_inner_pretty.js:<line>`, **682 obfuscated→readable mappings** catalogued, **27/27 units PASS** under adversarial per-file verification plus **129 anchors independently re-sampled (0 failing)**. The **Slash Commands** module was added by the same pipeline afterward: **13 `.ts`/`.tsx` files (~1,822 LOC)**, **136 mappings**, **5/5 units PASS** + **44 anchors re-sampled (0 failing)** — with the verbatim prompt strings copied byte-for-byte from the bundle and corroborated by the decoded `assets/prompts/*.txt`. The **Agent Team** module was added last by the same pipeline: **31 `.ts`/`.tsx` files (~11,400 LOC)** organized like the v2.1.88 `swarm`/`AgentTool`/`SendMessageTool`/`coordinator` tree, **15/15 reconstruct units PASS** under adversarial per-file verification, then an import-graph/SSOT coherence pass + **two independent adversarial cross-validation passes (677 anchors re-read total; PASS after fixes)** — its cross-val report lives in-module at [`30_agent_team/reconstructed_source/_cross_validation_report.md`](30_agent_team/reconstructed_source/_cross_validation_report.md). Unlike the five-feature layer, these modules are **not deltas** — they reconstruct the full subsystem (carryover included), with 2.1.156→2.1.183 changes called out inline. See the per-module READMEs and the four [`00_overview/cross_validation_report_{tools,system_prompt,system_reminder,slash_commands}.md`](00_overview/).

> **Scope honesty (read this first).** This tree is intentionally **narrow**. Many other subsystems changed in this same window — **Fable 5** (the new Mythos-class flagship model, shipped 2.1.170), plan mode, permissions (`Tool(param:value)` rules, auto-mode git/IaC destructive-action safety), MCP, the model allowlist (`availableModels` / `enforceAvailableModels`), and a very large body of UI / Windows / terminal reliability fixes. **All of that is out of scope** and is named honestly where relevant (see "Scope & what's NOT covered" below) so a reader knows what this tree does *not* cover.

## The build under analysis

The TARGET is the obfuscated **2.1.183** bundle extracted with `claude-code-bomb`:

```
/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/
  ├─ cli_inner_pretty.js          (one pretty-printed bundle, 699,346 lines / ~23.7 MB;
  │                                VERSION:"2.1.183", BUILD_TIME:"2026-06-18T23:04:10Z",
  │                                GIT_SHA:"9d251abdbce0c0a6190d290add83634e0ab481f6" (build_sha 9d251ab),
  │                                Bun 1.4 — cli_inner_pretty.js:848-900)
  ├─ cli_inner_pretty.js.PLACEHOLDER.md   (git-ignored note: regenerate from the binary or reassemble
  │                                from cli_unpack_pretty/ per the deobfuscate-bun-binary skill)
  ├─ cli_unpack_pretty/
  │   ├─ _manifest.json            (~4.0 MB — 38,762 per-decl entries: name + kind + bytes)
  │   └─ decls/
  │       ├─ functions/<id>.js     (15,476 function decls)
  │       ├─ vars/<id>.js          (22,535 var decls)
  │       ├─ classes/<id>.js       (277 class decls)
  │       └─ ExpressionStatement/, IfStatement/   (top-level statement bodies)
  └─ assets/
      ├─ prompts/, prompts_index.json     (428 prompts, ~1.98 MB; index entries: {file,len,offset,headline})
      ├─ system_prompts/                  (12 per-prompt JSON files)
      ├─ tools/                           (49 tool .md + _index.json)
      ├─ slash_commands.json              (123 slash command names)
      └─ env_vars.json, cli_flags.json, feature_gates.json (1,402 keys), endpoints.json
```

**Re-mangle caveat — every symbol was re-derived.** Bun's `--compile` mode preserves obfuscated names *within a build*, so this bundle is a stable grep + decl-read target. But the obfuscated names are **re-mangled between builds**: the v2.1.183 names differ from v2.1.156's. The master agent-swarm gate is `Sl` here but was `R7` in v2.1.156; `initializeSessionTeam` is `j3f` here; the implicit-team gate predicate is byte-identical but renamed. **No v2.1.183 name in this tree was carried over by assumption from v2.1.156** — every symbol was re-derived in the 2.1.183 bundle by string/telemetry anchor and verified at its cited line.

**Citation rule.** Every factual claim cites `cli_inner_pretty.js:<line>`, verified by reading that line in the **v2.1.183** bundle. Line numbers are stable *within this build only* — they shift across versions, so the **string literals / tool names / telemetry events are the stable anchor**. Any line tagged `(v2.1.156)` or `(v2.1.88)` is a deliberate **before-picture** read in the prior bundle, never the target.

---

## Five focus features

Each headline below is source-proven in the v2.1.183 bundle (and 0-count grep-confirmed in v2.1.156 where the change is a removal/introduction). Follow the module link for the full deobfuscated deep-dive.

### 1. Agent Team — the v2.1.178 implicit-team redesign → [`30_agent_team/`](30_agent_team/)

In v2.1.156 an agent team was an *explicit* construct: the model called `TeamCreate` to seat a leader and `TeamDelete` to tear it down, spawning teammates by passing a resolved `team_name` to the Agent tool. **v2.1.178 removes both tools** (`grep -c TeamCreate` and `grep -c TeamDelete` both return **0** over the whole v2.1.183 bundle; both present in v2.1.156). The team is now **implicit and session-scoped**: the CLI bootstrap calls `initializeSessionTeam` (`j3f`, `cli_inner_pretty.js:682765`) at startup behind a three-part gate `if (Sl() && !xr() && !a.agentId)` (`cli_inner_pretty.js:693472`) — swarms enabled, not a background worker, and this process is the main session — deriving the team name `session-<sessionId[:8]>` via `sessionTeamName` (`xic`, `cli_inner_pretty.js:682752`). Teammates now spawn through the **Agent tool's `name` parameter** (route `if(_&&s&&!L)`, `_=Sl()?teamContext`); the old `team_name` parameter is kept only as "Deprecated; ignored." The tmux spawn path swaps `send-keys` for a pane respawn (`a3n`, `cli_inner_pretty.js:421874`) to fix a slow-rc keystroke leak, and the leader↔teammate mailbox / addendum / permission-bridge carryover and live coordinator mode are documented alongside the 2.1.183 teammate background-task survival keepalive.

### 2. Dynamic Workflows / ultracode → [`42_workflow/`](42_workflow/)

The Dynamic Workflows subsystem (the `Workflow` tool + sandboxed-VM orchestration) is **structurally unchanged** in this window — the gate, VM, journal, and Zod schema are the same shape as v2.1.156. What changed is the **trigger and the correctness fixes**: 2.1.160 renames the trigger keyword from `workflow(s)` to `ultracode` (`hho`/`yho`, `cli_inner_pretty.js:464214` / `464261`) with a dedicated violet shimmer, gated behind the **NEW `workflowKeywordTriggerEnabled` /config setting** (`Jyn`, `cli_inner_pretty.js:148797`). On top of that: 2.1.172 adds AST-walk determinism, 2.1.174 adds per-agent `agentContext` attribution (the `agent()` effort/`taskType`/`workflowName` fields and `errorCode 7`), and 2.1.169 makes `/workflows` open immediately. **Two framing traps are debunked in the module docs:** "/effort ultracode xhigh-only" already existed in 2.1.156, and the 2.1.178 "explicit phrase" change is description-only (no new regex).

### 3. Background Agents — the nested-subagent depth limit → [`36_background_agents/`](36_background_agents/)

The headline is the **nested-subagent 5-level depth limit** (`v1i = 5`, `cli_inner_pretty.js:221800`), threaded as a depth parameter through the spawn path and enforced by a gate hoisted *above* the async boundary (`cio`, `cli_inner_pretty.js:371188`: `if (Rc(i,vs)) return s < v1i`) so foreground and background subagents share one ceiling (2.1.181 parity, via `bte`, `cli_inner_pretty.js:371230`). The depth is persisted (`Xut`, `cli_inner_pretty.js:446073`) — a genuine 2.1.172/2.1.181 addition absent from the v2.1.156 team-only gate. The module also covers the 2.1.181 worker **provider-env isolation** rebuilt into a 4-pass auth scrub (`_Fl`, `cli_inner_pretty.js:594705`, vs the v2.1.156 single-pass), the `agents --json` surface gaining `id`/`state`/`waitingFor`/`--all` (`aGf`, `cli_inner_pretty.js:691275`, 2.1.169), and the `/bg` re-mangled command surface. **A scout-dossier correction is recorded here:** the `cliVersion`-equality and cron/routine retire/respawn guards were **carryover, not new** — the docs corrected the dossier and re-verified independently.

### 4. Compaction — fallback-model + 1M clamp + window resolver → [`07_compact/`](07_compact/)

Three in-scope deltas, all driven by Fable 5 making model-unavailability common. **2.1.178 makes summarization honor `--fallback-model`**: the summarize path becomes a fallback while-loop (`del`/`ICn`, `cli_inner_pretty.js:461088` / `461078`) emitting `tengu_model_fallback_triggered` with `query_source=compact`, vs the v2.1.156 single-pass summarize. **2.1.172 adds the 1M-credits clamp-back** (`tH`, `cli_inner_pretty.js:134105`: `if (ARr) return jQ = 200000`, telemetry `tengu_1m_credits_clamp_activated`) so a 1M-context model without the credit entitlement falls back to a 200K window instead of mis-triggering "out of context." And the context-**window resolver** grows from four sources to **six** (`z2`, `cli_inner_pretty.js:226875`, adding client-data + model-default). The context-hint micro-compaction beta is unchanged; note the **massive line-shift** across the window (the threshold ladder and dispatcher both moved by ~200K lines), which is why every line was re-derived rather than offset.

### 5. Auto Memory — team / remote memory stores → [`31_auto_memory/`](31_auto_memory/)

The persistent-memory *runtime engine* is unchanged; what changed is the **store schema and recall routing**. `CLAUDE_MEMORY_STORES` (`bQu`, `cli_inner_pretty.js:150491`) gains `scope` / `promptIndex` / `promptIndexMaxBytes` fields, with a network fetch-and-inject path for the prompt index. Recall (`e0t`, `cli_inner_pretty.js:151847`) routes by `scope` + mode, and a mounted store now enables **team recall** (`Nk`, `cli_inner_pretty.js:151098`) — the mechanism behind the 2.1.172 `CLAUDE_CODE_REMOTE_MEMORY_DIR` "team memory recall in remote sessions" fix. The watcher is split by scope, and the 2.1.181 `Improved N memories` status line (`Svp`, `cli_inner_pretty.js:383399`) stops listing files outside verbose mode.

---

## Layout

```
analyze/
├─ README.md                  ← you are here (front door)
├─ 00_overview/               Navigation + symbol routing + per-feature/-module symbol tables + cross-validation
│
│  ─── Layer 1 · Five-feature delta (v2.1.156 → v2.1.183) ───
├─ 30_agent_team/             Agent Team — implicit-team redesign (5 docs) + reconstructed_source/ (whole-machine TS, 31 files)
├─ 42_workflow/               Dynamic Workflows / ultracode (4 docs) + reconstructed_source/ (whole-machine TS)
├─ 36_background_agents/      Background Agents — nested-subagent depth + lifecycle (5 docs)
├─ 07_compact/                Compaction — fallback-model + 1M clamp + window resolver (5 docs)
├─ 31_auto_memory/            Auto Memory — team stores + recall (3 docs)
│
│  ─── Layer 2 · Reconstructed-source capability modules (readable-source restoration, organized like 2.1.88 src/) ───
├─ 04_tools/                  Tools — framework + registry + serialization + deferral + ~48 tools (contract level); reconstructed_source/ (33 TS files)
├─ 40_system_prompt/          System Prompt — assembler + identity + builders + env + cacheable sections + sub-agents; reconstructed_source/ (6 TS files)
├─ 41_system_reminder/        System Reminder — primitives + generator pool + dispatcher + 25-string catalogue; reconstructed_source/ (3 TS files)
├─ 43_slash_commands/         Slash Commands — /loop · /goal · /batch · /simplify (5 analysis docs); reconstructed_source/ (13 TS files, ports v2.1.88 src/skills/bundled + commands/goal)
│
└─ by_version/                Per-release breadth analysis — one file per published release (22 files) + index
```

### Navigation surface (`00_overview/`)

| Path | Content |
|------|---------|
| [`00_overview/changelog_analysis.md`](00_overview/changelog_analysis.md) | Long-form architectural narrative — the window shape (27 numbers / 22 releases), each of the five features in depth with deobfuscated pseudocode, and §8 the honest out-of-scope inventory |
| [`00_overview/changelog_to_code_map.md`](00_overview/changelog_to_code_map.md) | Per-changelog-bullet traceability — each in-scope bullet → `cli_inner_pretty.js:<line>` + module doc, with an explicit per-version "Out of scope" enumeration |
| [`00_overview/file_index.md`](00_overview/file_index.md) | Inventory of the `cli_unpack_pretty/` decls + the `assets/` payload, with the five features mapped onto line regions |
| [`00_overview/symbol_index_core_execution.md`](00_overview/symbol_index_core_execution.md) | Symbol index — core execution (Agent Loop, Tools, Subagent spawn, depth limit, State) |
| [`00_overview/symbol_index_core_features.md`](00_overview/symbol_index_core_features.md) | Symbol index — core features (Agent Team, Workflow/ultracode, Background Agents, Compact, Auto Memory) |
| [`00_overview/symbol_index_infra_platform.md`](00_overview/symbol_index_infra_platform.md) | Symbol index — platform infra (Model fallback, 1M clamp, window resolver, Telemetry) |
| [`00_overview/symbol_index_infra_integration.md`](00_overview/symbol_index_infra_integration.md) | Symbol index — integration infra (tmux/iTerm2 spawn, status line) |
| [`00_overview/symbol_additions_v2_1_183_*.md`](00_overview/) | Five per-feature exhaustive symbol-addition tables (agent_team, workflow, background_agents, compact, auto_memory) — each with a "Cross-validated against" block |
| [`00_overview/cross_validation_report_*.md`](00_overview/) | Five per-feature adversarial cross-validation logs (PASS/FAIL line-range + readable-name verification) |
| [`00_overview/cross_validation_summary.md`](00_overview/cross_validation_summary.md) | Cross-feature roll-up of the five passes + the tree-wide invariant re-check (forbidden-table scan, link sweep) |

### Per-release breadth analysis (`by_version/`)

`by_version/` holds **one analysis file per published release** (22 files, `2.1.157.md` … `2.1.183.md`) — the *breadth* layer that complements the five depth modules. Each `2.1.NN.md` is a source-cross-validated pass over **everything that release shipped**, across **all** subsystems it touched (permissions, model selection, MCP, hooks, plugins, sandbox, auto-mode, Remote Control, telemetry, UI, Windows/WSL, …); a focus-feature bullet is summarized + anchored + linked to its depth module, while a non-focus bullet gets its primary analysis here. The directory is indexed by [`by_version/README.md`](by_version/README.md) (newest-first table with per-release focus-feature markers + the window facts and the four inflection points), and verified by [`by_version/cross_validation_report.md`](by_version/cross_validation_report.md) (64/64 sampled anchors PASS).

(Never published, absent from the upstream changelog: **.164, .171, .177, .180, .182**. Published-but-empty boilerplate — each still documented with its provenance: **.159, .165, .167, .168**.)

---

## Scope & what's NOT covered

This is a **five-feature delta**, not a module-complete tree. The following subsystems **also changed** in the v2.1.156 → v2.1.183 window and are **intentionally out of scope** — they are named here so the omission is explicit, not silent:

- **Fable 5** — the new Mythos-class flagship model (shipped 2.1.170, `[1m]`-suffix normalization 2.1.173). It is a *cause* of several in-scope fixes (compaction fallback chain, 2.1.176 auto-mode-falls-back-to-Opus) but the model launch itself is not analyzed here.
- **Permissions** — `Tool(param:value)` permission rules, auto-mode destructive-git / IaC safety (2.1.183), deny-rule glob position, cross-session `SendMessage` deauthorization.
- **Plan mode, Hooks, Skills** — Stop/SubagentStop `additionalContext`, `.claude/skills` plugin auto-load, and other deltas not on the five-feature path.
- **MCP** — managed-MCP enforcement fixes, stdio `CLAUDE_CODE_SESSION_ID` on resume, secret redaction, timeout floor.
- **Model allowlist** — `availableModels` / `enforceAvailableModels` managed settings + alias-redirect hardening.
- **UI / Windows / terminal** — a very large body of TUI, WSL2, VS Code, and startup reliability fixes.

For the full per-version enumeration of out-of-scope bullets, see the "Out of scope" rows in [`00_overview/changelog_to_code_map.md`](00_overview/changelog_to_code_map.md).

---

## Cross-validation methodology

Every obfuscated → readable mapping in this tree was cross-checked against three independent references, then audited by an adversarial pass:

1. **Two-bundle self-check.** The primary technique greps the **v2.1.183 bundle** for the same feature from two angles — a tool-name constant + a telemetry event + a prompt/error string — and only accepts a mapping when all anchors converge on the same decl. Every removal/introduction claim is corroborated by a **0-count grep in the v2.1.156 bundle** (`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`, 649,979 lines), which also supplies every `(v2.1.156)` before-picture.
2. **v2.1.88 readable TypeScript** (`/lyz/codespace/3rd/claude-code/src/`) for NEW-vs-evolved lineage — used heavily by the compaction pass to tell a genuine new branch (the fallback while-loop) from an evolved one.
3. **The five `_scout_dossier_<feature>.md` spec dossiers** as the claim source each pass adversarially re-derived from scratch.

**Adversarial outcome.** Five per-feature skeptic passes (default-to-FAIL, re-opening every sampled anchor at its exact cited line) ran a combined **289 discrete checks → 272 pass / 17 fail (94.1%)**: agent_team 53P/1F, workflow 47P/2F, background 37P/7F, compact 90P/4F, auto_memory 45P/3F. **All 17 failures were line-precision / transcription drift** — never a wrong symbol, a fabricated line, or an incorrect delta claim — and all 17 were fixed in place. The background-agents pass independently **corrected the scout dossier** (the `cliVersion`-equality + cron/routine guards are carryover, not delta). Full logs: the five [`00_overview/cross_validation_report_*.md`](00_overview/) and the roll-up [`00_overview/cross_validation_summary.md`](00_overview/cross_validation_summary.md).

---

## How to find a feature in 2.1.183 source

**Workflow:**

1. Identify a unique stable string for the feature — a tool name, a telemetry event (`tengu_*`), a /config key, or an error/prompt fragment. Examples: `"ultracode"`, `"workflowKeywordTriggerEnabled"`, `"CLAUDE_MEMORY_STORES"`, `"tengu_1m_credits_clamp_activated"`, `"tengu_model_fallback_triggered"`, `"--fallback-model"`, `"agentId"`.
2. `grep -n "<string>" /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
3. From the surrounding code, read off the enclosing obfuscated decl id (e.g. `Sl`, `j3f`, `hho`, `v1i`, `tH`, `z2`, `bQu`). **Do not assume it matches v2.1.156** — names are re-mangled per build.
4. Read `cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js` for the isolated decl body when you want just one symbol.
5. Confirm with the self-cross-check rule: two independent anchors must land on the same decl before the mapping is trusted.

**Example (the implicit-team gate):**

```
$ grep -n "initializeSessionTeam" cli_inner_pretty.js | head
682765:function j3f() { ... }            # the initializer
693472:        if (Sl() && !xr() && !a.agentId)   # the three-part bootstrap gate

# → confirm the removal counterpart:
$ grep -c "TeamCreate" cli_inner_pretty.js   # → 0  (was non-zero in v2.1.156)
```

For names that never appear in changelog text (most internal helpers), work backward from string literals — `assets/prompts_index.json` (428 entries) is the fastest route from a prompt fragment to its emit-site, and `assets/feature_gates.json` (1,402 keys) maps gate names to emit sites.

---

## Entry points for readers

| Goal | Start here |
|------|------------|
| Understand the window as one story | [`00_overview/changelog_analysis.md`](00_overview/changelog_analysis.md) — the 27-number / 22-release shape and the four inflection points |
| Understand one of the five features in depth | The matching module — [`30_agent_team/`](30_agent_team/), [`42_workflow/`](42_workflow/), [`36_background_agents/`](36_background_agents/), [`07_compact/`](07_compact/), [`31_auto_memory/`](31_auto_memory/) |
| Understand release-by-release what shipped (all subsystems) | [`by_version/README.md`](by_version/README.md) — the per-release index, then the matching [`by_version/2.1.NN.md`](by_version/) file |
| Trace a single changelog bullet to code | [`00_overview/changelog_to_code_map.md`](00_overview/changelog_to_code_map.md) — find the bullet, follow the decl pointer (or read its "Out of scope" row) |
| Look up an obfuscated identifier (`Sl`, `j3f`, `hho`, `v1i`, `tH`, `z2`, `bQu`, …) | Pick the right `00_overview/symbol_index_*.md` by category, or grep the five [`00_overview/symbol_additions_v2_1_183_*.md`](00_overview/) tables |
| Find which extracted asset/decl contains a feature | [`00_overview/file_index.md`](00_overview/file_index.md), or grep `cli_inner_pretty.js` for a stable string |
| Verify a mapping's confidence | The "Cross-validated against" block in the relevant `00_overview/symbol_additions_v2_1_183_*.md`, the matching [`00_overview/cross_validation_report_*.md`](00_overview/), or the roll-up [`00_overview/cross_validation_summary.md`](00_overview/cross_validation_summary.md) |
| Read the deobfuscated source directly | `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` + `cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js` |

---

## Symbol mapping conventions

This tree follows the project-wide [`../../CLAUDE.md`](../../CLAUDE.md) conventions:

- **No symbol mapping tables in module docs.** The four `00_overview/symbol_index_*.md` files are the canonical mapping tables; the five `00_overview/symbol_additions_v2_1_183_*.md` files hold the per-feature exhaustive tables. Module docs reference symbols as a list (`` `readableName` (`OBF`) — desc (cli_inner_pretty.js:NNN) ``), never duplicating a mapping table.
- **Single source citation.** Every factual claim cites `cli_inner_pretty.js:<line>`, verified by reading that line in the v2.1.183 bundle (or tagged `(v2.1.156)` / `(v2.1.88)` for before-pictures).
- **Dual-version code snippets.** Header (`====` + ReadableName + Location) → ORIGINAL → READABLE → Mapping.

---

## See Also

- [`../../claude_code_v_2.1.156/analyze/`](../../claude_code_v_2.1.156/analyze/) — the prior **v2.1.143 → v2.1.156** tree this window continues from (and the format/depth reference for these docs; its README is the layout template this one is modeled on)
- [`../../CLAUDE.md`](../../CLAUDE.md) — project conventions: the symbol-index routing matrix, the no-mapping-tables-in-module-docs rule, and the dual-version code-snippet template
- [`../CHANGELOG.md`](../CHANGELOG.md) — the upstream changelog this analysis tracks (the bullet source of truth for the 22 published releases)
- The five `analyze/_scout_dossier_<feature>.md` dossiers + `analyze/_asset_anchors.md` — the verified-anchor working notes each module + cross-validation pass was derived from
