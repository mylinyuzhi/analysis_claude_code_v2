# Claude Code v2.1.143 → v2.1.156 — Source Diff Analysis

This directory continues the deobfuscation analysis from v2.1.142 (in [`../../claude_code_v_2.1.142/analyze/`](../../claude_code_v_2.1.142/analyze/)) and covers the delta from **v2.1.143** through **v2.1.156**. The build under analysis is the obfuscated 2.1.156 bundle extracted with `claude-code-bomb`:

```
/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/
  ├─ cli_inner_pretty.js          (one ~650K-line pretty-printed bundle; VERSION:"2.1.156",
  │                                BUILD_TIME:"2026-05-28T18:30:33Z", GIT_SHA:de3d672b…  — cli_inner_pretty.js:124)
  ├─ cli_inner_pretty.js.PLACEHOLDER.md   (the bundle itself is not committed; regenerate from the binary
  │                                or reassemble from cli_unpack_pretty/ per the deobfuscate-bun-binary skill)
  ├─ cli_unpack_pretty/
  │   ├─ _manifest.json / _summary.json
  │   └─ decls/
  │       ├─ functions/<id>.js    (13,790 function decls)
  │       ├─ vars/<id>.js         (20,617 var decls)
  │       ├─ classes/<id>.js      (275 class decls)
  │       ├─ ExpressionStatement/ , IfStatement/   (top-level statement bodies)
  └─ assets/
      ├─ prompts/, prompts_index.json     (372 prompts)
      ├─ slash_commands.json               (115 slash commands)
      ├─ tools/, tools_index.json
      ├─ system_prompts/, long_strings/
      └─ env_vars.json, cli_flags.json, feature_gates.json, endpoints.json
```

**Important format note.** The 2.1.156 build ships as a *single* pretty-printed bundle (`cli_inner_pretty.js`) rather than the multi-`chunks.NN.mjs` split of older builds. As a result, all line citations in this tree are stable `cli_inner_pretty.js:<line>` references — there is no per-chunk file map. The per-decl files under `cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js` give an isolated-decl view when you only want one symbol's body (e.g. `decls/functions/hwz.js` is the entire body of the `--exec` handler).

## Layout

### Top-level overview and indexes (`00_overview/`)

| Path | Content |
|------|---------|
| [`00_overview/README.md`](00_overview/README.md) | Overview navigation surface — what each index/addition file is, the four-file routing matrix, the "Big Three" (Opus 4.8, Dynamic Workflows, lean prompt) and supporting-cast narrative summary, and how this tree differs from the v2.1.142 overview |
| [`00_overview/changelog_analysis.md`](00_overview/changelog_analysis.md) | Long-form architectural narrative — the 11-release cadence, the "Big Three" co-design, cross-cutting design patterns, and the full added settings/env/telemetry inventory |
| [`00_overview/changelog_to_code_map.md`](00_overview/changelog_to_code_map.md) | Per-bullet code-traceability index — each changelog bullet (newest-first) → theme + `cli_inner_pretty.js:<line>` decl + implementation hint |
| [`00_overview/file_index.md`](00_overview/file_index.md) | Inventory of the `cli_unpack_pretty/` decls and the `assets/` payload |
| [`00_overview/symbol_index_core_execution.md`](00_overview/symbol_index_core_execution.md) | Symbol index — core execution (Agent Loop, Tools, LLM API, Agents, Subagent, State, System Prompts, Workflow **coordinator** prompt + Workflow tool factory/defaults) |
| [`00_overview/symbol_index_core_features.md`](00_overview/symbol_index_core_features.md) | Symbol index — core features (Dynamic Workflows gate/caps/journal/keyword/ultracode/viewer/VM, Background Agents, Todo, Compact, Hooks, Skills, Thinking/Effort, Model-selection feature surface, Plan, Steering, CLI) |
| [`00_overview/symbol_index_infra_platform.md`](00_overview/symbol_index_infra_platform.md) | Symbol index — platform infra (MCP, Permissions, Sandbox, Auth, Model provider mapping/normalization/resolution/pricing/Fast-Mode/1M, Prompt-platform gate predicates, Telemetry) |
| [`00_overview/symbol_index_infra_integration.md`](00_overview/symbol_index_infra_integration.md) | Symbol index — integration infra (LSP, Chrome, IDE, UI Components, Plugin System, Code Indexing, Shell Parser, Slash Commands) |
| [`00_overview/symbol_additions_v2_1_156_*.md`](00_overview/) | Per-module symbol additions (nine files — one per analysis unit), transitional until consolidated into the four `symbol_index_*.md` files. Each carries a "Cross-validated against" block and a home-index routing note |

**Cross-validation is doubly recorded.** `00_overview/` carries nine per-module `cross_validation_report_*.md` files (the PASS/FAIL line-range + readable-name verification logs — e.g. `cross_validation_report_model_opus48.md` records the `q48`/`vP`/`Vx` canonical-name unification) plus a cross-unit roll-up `cross_validation_summary.md` (375 citation spot-checks at 98.7% first-read pass, the consolidated-index re-check, the forbidden-mapping-table scan, and the broken-relative-link sweep), and each `symbol_additions_v2_1_156_*.md` also opens with its own "Cross-validated against" block (v2.1.156 self-cross-check + v2.1.88 readable TypeScript + the v2.1.142 reference module). §13 of `changelog_analysis.md` rolls up where the readable-source trail runs cold (Workflow runtime, Opus 4.8, lean prompt, and the local `/code-review` finder are all post-2.1.88, so only partial/scaffold matches exist there).

### Per-version delta files (`by_version/`)

11 files cover the 11 published releases in this window (.146, .151, and .155 were never published):

```
by_version/2.1.143.md   (background-agent reliability + plugin dependency graph)
by_version/2.1.144.md   (bg sessions first-class in /resume, bg subagent completion)
by_version/2.1.145.md   (OTEL agent_id trace fidelity, Read PARTIAL-view, Stop-hook bg arrays)
by_version/2.1.147.md   (pinned bg sessions Ctrl+T, self-update in place, /simplify → /code-review)
by_version/2.1.148.md   (single-bullet Bash exit-code 127 hotfix for the 2.1.147 regression)
by_version/2.1.149.md   (cost legibility + PowerShell/sandbox permission hardening)
by_version/2.1.150.md   (internal infrastructure only — no user-facing changes)
by_version/2.1.152.md   (hooks/skills session-mutation surface, /code-review --fix applies findings, auto-mode consent)
by_version/2.1.153.md   (plugin/marketplace ergonomics, install-health, claude agents / bg polish)
by_version/2.1.154.md   (THE FLAGSHIP — Opus 4.8 + dynamic workflows + lean prompt + supporting cast)
by_version/2.1.156.md   (Opus 4.8 thinking-block modification → API-error hotfix)
```

### Module deep-dives (9 modules)

```
00_overview/             Navigation surface — narrative, traceability, four symbol indexes, per-module additions
04_tools/                Workflow tool registration, AskUserQuestion reservation, disallowed-tools frontmatter,
                         Read PARTIAL-view truncation, always-on streaming tool execution
10_skill_system/         /reload-skills + SessionStart reloadSkills, disallowed-tools frontmatter,
                         context:fork recursion guard, effort: frontmatter, three bundled skill bodies
11_hooks/                NEW MessageDisplay display-only hook (+ streaming engine), SessionStart sessionTitle/reloadSkills,
                         Stop/SubagentStop background_tasks + session_crons, stop-hook block cap
36_background_agents/    claude --bg --exec / agents-view ! <command>, unified dispatcher ol, four-state classifier,
                         worker retire/respawn fixes, worktree-isolation guard + --bg-pty-host orphan watchdog
37_permission_policy/    auto-mode exfiltration HARD-BLOCK rewrite + bulk-repo detection, rm -rf $HOME trailing-slash,
                         $TMPDIR unification, PowerShell cd + bare-assignment bypass closures, managed-MCP per-entry validation
42_workflow/             Dynamic Workflows (FLAGSHIP) — Workflow tool object + Zod schemas, four-layer enablement gate,
                         meta AST parser, six-error-code validateInput, script persistence + UNC rejection, telemetry
43_model_opus48/         claude-opus-4-8 seven-provider config + resolvers, matured effort system (xhigh, per-model defaults,
                         launch latch), /effort Faster/Smarter relabel + ultracode rail, fast-mode 2x pricing, thinking-sig hotfix
44_lean_prompt/          Memoized lean-vs-full gate + model-class allow-list, lean # Harness section vs six full builders,
                         assembler swap + section cache, lean-aware tool descriptions, rollout rationale
45_code_review/          /code-review + /simplify bundled prompt commands, five-level effort ladder, multi-angle finder →
                         verify → sweep prompt, --comment / --fix blocks, cleanup-only /simplify, cloud ultra ("bughunter") bridge
```

**Four modules are NEW in this window vs the v2.1.142 tree:** `42_workflow/`, `43_model_opus48/`, `44_lean_prompt/`, and `45_code_review/`. The other five (`04_tools/`, `10_skill_system/`, `11_hooks/`, `36_background_agents/`, `37_permission_policy/`) continue from the v2.1.142 baseline and document the v2.1.143 → v2.1.156 *delta* on top of it — each cross-links its v2.1.142 predecessor.

## Cross-Validation Methodology

Each unit cross-validates obfuscated → readable mappings against two independent sources:

1. **v2.1.156 deobfuscated bundle** — `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` plus the per-decl `cli_unpack_pretty/decls/.../<id>.js` files. Bun's `--compile` mode preserves obfuscated names, so the extracted bundle is a stable grep + decl-read target. The *self-cross-check* technique greps the bundle for the same feature from two angles — e.g. a tool-name constant (`mx = "Workflow"`, `cli_inner_pretty.js:216291`) plus a telemetry event (`tengu_workflow_launched`) plus a prompt fragment — and only accepts a mapping when all anchors converge on the same decl.
2. **v2.1.88 readable TypeScript** — `/lyz/codespace/3rd/claude-code/src/**/*.ts(x)`, the last fully-readable build before obfuscation hardened. Many 2.1.156 symbols still trace back to functions whose v2.1.88 readable name + line range is known. **Honest caveat:** the four flagship surfaces — Workflow runtime, Opus 4.8, the lean system prompt, and the *local* `/code-review` finder — are all *post-2.1.88*, so only partial/scaffold matches exist there (e.g. `components/WorkflowMultiselectDialog.tsx`, `utils/swarm/`, `coordinator/`). Where the readable trail runs cold the mapping rests on bundle self-cross-check + string anchors alone, and the relevant `symbol_additions_*.md` says so explicitly.

A third reference is the prior tree's matching module (`../../claude_code_v_2.1.142/analyze/<module>/`), which anchors the *delta* framing: each continuing module documents only what changed on top of its v2.1.142 predecessor. Confidence is recorded per mapping (high if the bundle self-cross-check and a readable source agree, medium if only one source is conclusive, low if inferred from string anchors alone) in each unit's "Cross-validated against" block.

## Key Themes (v2.1.143 → v2.1.156)

The window spans 14 version numbers but **11 published releases** (.146/.151/.155 never shipped; .148 was a one-line Bash-exit-code hotfix; .150 was internal-only). Its shape is **bimodal** — a long tail of small reliability releases (143–153) feeding one enormous feature drop (154), then a fast hotfix (156): "stabilize the runway, then land the plane."

### The "Big Three" (all v2.1.154, co-designed as a single launch)

1. **Opus 4.8 + effort maturation (hotfixed in v2.1.156).** A new flagship model registered across all seven provider surfaces (`claude-opus-4-8`, `cli_inner_pretty.js:91826-91832`), defaulting to `high` effort with a new `xhigh` level above it (effort enum `["low","medium","high","xhigh"]`, `cli_inner_pretty.js:51691`). Default-on thinking on 4.8 is exactly what made the v2.1.156 hotfix necessary: a signed `thinking`/`redacted_thinking` block reaching the API modified returned a 400, so the fix detects that error, strips signed thinking blocks (backfilling `[Thinking removed]`), and retries unsigned. `/effort` slider labels were relabeled "Faster"/"Smarter" (was "Speed"/"Intelligence"); fast mode lands at 2× rate / 2.5× speed; `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` is deprecated (removal 06/01). Deep-dive: [`43_model_opus48/`](43_model_opus48/).
2. **Dynamic Workflows.** A single `Workflow` tool (`mx = "Workflow"`, `cli_inner_pretty.js:216291`) that takes a self-contained JavaScript orchestration script, runs it in a sandboxed VM in the background, and fans work across tens to hundreds of subagents deterministically. The control plane is a four-layer enablement gate (`NZ`, `cli_inner_pretty.js:184757-184763`) defaulting ON for everyone except the Pro tier; the data plane's trust boundary is the `export const meta = {...}` literal, statically AST-evaluated with no `eval`. `/workflows` shows live and completed runs. Deep-dive: [`42_workflow/`](42_workflow/).
3. **The Lean System Prompt.** A second, parallel system prompt that collapses six multi-paragraph behavioral sections into one ~6-bullet `# Harness` section, made the default for capable models — everything except Haiku, Sonnet, and Opus 4.7-and-earlier. A bet that capable models behave well from terse guidance, saving context budget every turn. Deep-dive: [`44_lean_prompt/`](44_lean_prompt/).

These three are co-designed: **Opus 4.8 is the model that triggers the lean prompt by default**, and **`ultracode`** — the session mode bundling `xhigh` effort with standing workflow orchestration — is the seam where the effort UI and Dynamic Workflows meet (`ultracode` requires both an xhigh-capable model and workflows enabled, `cli_inner_pretty.js:51700-51706`).

### The supporting cast

4. **`/code-review` and `/simplify` (v2.1.147 → .154).** v2.1.147 renamed `/simplify` → `/code-review` (`Y18 = "code-review"`, `cli_inner_pretty.js:211646`) with effort levels and `--comment` inline PR comments; v2.1.152 added `/code-review --fix`; v2.1.154 re-split `/simplify` to cleanup-only. `/code-review ultra` is a cloud multi-agent ("bughunter") fleet. Deep-dive: [`45_code_review/`](45_code_review/).
5. **Background-agent maturation (v2.1.153/.154 + .156 reliability).** `claude --bg --exec` and the agents-view `! <command>` create shell-intent background sessions through the unified dispatcher `ol` (`hwz`, `cli_inner_pretty.js:541956-541985`). v2.1.156 fixes a cluster of reliability bugs: premature "out of context" on 1M models from completion notifications, the classifier losing the goal when a scheduled `/command` fires, pinned sessions respawning every minute after update, idle sessions not retiring, subagents bypassing worktree isolation, and the `--bg-pty-host` 100%-CPU orphan. Deep-dive: [`36_background_agents/`](36_background_agents/).
6. **Hooks platform (v2.1.143/.145/.152).** A NEW `MessageDisplay` display-only hook (`cli_inner_pretty.js:49289`) to transform/hide streaming assistant text without touching the transcript or model-visible context; SessionStart `sessionTitle`/`reloadSkills`; Stop/SubagentStop `background_tasks` + `session_crons` input arrays; the stop-hook block cap. Deep-dive: [`11_hooks/`](11_hooks/).
7. **Skills and Tools deltas.** `/reload-skills` + SessionStart `reloadSkills`, `disallowed-tools` frontmatter (`cli_inner_pretty.js:184492`), `context: fork` self-reinvoke recursion guard, `effort:` frontmatter; on the tools side, AskUserQuestion reservation behavior (`ez = "AskUserQuestion"`, `cli_inner_pretty.js:143388`), Read PARTIAL-view truncation, and always-on streaming tool execution. Deep-dives: [`10_skill_system/`](10_skill_system/), [`04_tools/`](04_tools/).
8. **Permissions / auto-mode hardening (v2.1.149/.152/.156).** Improved exfiltration detection (bulk repo transfers), auto-mode no longer requiring opt-in consent, the `rm -rf $HOME` trailing-slash fix, `$TMPDIR` sandboxed-vs-unsandboxed unification, PowerShell `cd` + bare-var-assignment bypass closures, and managed-MCP per-entry policy validation with a `claude doctor` warning. Deep-dive: [`37_permission_policy/`](37_permission_policy/).

See [`00_overview/changelog_analysis.md`](00_overview/changelog_analysis.md) for theme-by-theme depth and [`00_overview/changelog_to_code_map.md`](00_overview/changelog_to_code_map.md) for per-bullet pointers.

## How to Find a Feature in 2.1.156 Source

**Workflow:**

1. Identify a unique string from the changelog (e.g. `"Workflow"`, `"code-review"`, `"MessageDisplay"`, `"--exec"`, `"claude-opus-4-8"`, `"xhigh"`).
2. `grep -n "<string>" /lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
3. From the surrounding code, identify the enclosing obfuscated decl id (e.g. `mx`, `hwz`, `NZ`, `Y18`).
4. Read `cli_unpack_pretty/decls/functions/<id>.js` (or `decls/vars/<id>.js`) for the isolated decl when you want just one symbol's body.

**Example:**

```
$ grep -n "Workflow" cli_inner_pretty.js | head
216290:X$(m57, { WORKFLOW_TOOL_NAME: () => mx });
216291:var mx = "Workflow";

$ cat cli_unpack_pretty/decls/vars/mx.js
mx = "Workflow";

# → tool-name constant; the Workflow tool factory + coordinator prompt are around cli_inner_pretty.js:216290-216700
```

For names that don't show up in changelog text (most internal helpers), work backward from string literals — error messages, telemetry events (`tengu_workflow_launched`, `tengu_thinking_signature_strip_retry`, `tengu_background*`), or prompt fragments. The `assets/prompts_index.json` (372 entries) is the fastest route from a prompt fragment to its emit-site, and `assets/feature_gates.json` maps gate names (`tengu_workflows_enabled`) to emit sites. Confirm every candidate with the self-cross-check rule: two independent anchors must land on the same decl before the mapping is trusted.

## Symbol Mapping Conventions

This tree follows the project-wide [`/lyz/codespace/analysis_claude_code_v2/CLAUDE.md`](/lyz/codespace/analysis_claude_code_v2/CLAUDE.md) conventions:

- **No symbol mapping tables in module docs.** The four `symbol_index_*.md` files in `00_overview/` are the canonical mapping tables; module docs reference them as a list (`` `readableName` (`OBF`) — desc (cli_inner_pretty.js:NNN) ``), never duplicating tables. Until consolidation completes, the per-module `00_overview/symbol_additions_v2_1_156_*.md` files also hold tables.
- **Single source citation.** Every factual claim cites `cli_inner_pretty.js:<line>`, verified by reading that line.
- **Dual-version code snippets.** Header (`====` + ReadableName + Location) → ORIGINAL → READABLE → Mapping.

The category-to-file routing matrix (which `symbol_index_*.md` a new mapping belongs in) lives in [`/lyz/codespace/analysis_claude_code_v2/CLAUDE.md`](/lyz/codespace/analysis_claude_code_v2/CLAUDE.md) and is reproduced with this window's edge cases in [`00_overview/README.md`](00_overview/README.md).

## Entry Points for Readers

Pick a starting file based on what you're trying to do:

| Goal | Start here |
|------|------------|
| Understand release-by-release what changed | [`by_version/2.1.<NN>.md`](by_version/) for the version, then jump to the relevant module folder |
| Understand a single changelog bullet | [`00_overview/changelog_to_code_map.md`](00_overview/changelog_to_code_map.md) — find the bullet, follow the decl pointer |
| Understand a feature theme (Opus 4.8, Workflows, lean prompt, exfiltration hardening) | [`00_overview/changelog_analysis.md`](00_overview/changelog_analysis.md) then the matching module (e.g. [`42_workflow/`](42_workflow/)) |
| Understand the flagship release as one event | [`by_version/2.1.154.md`](by_version/2.1.154.md) then the four new modules ([`42_workflow/`](42_workflow/), [`43_model_opus48/`](43_model_opus48/), [`44_lean_prompt/`](44_lean_prompt/), [`45_code_review/`](45_code_review/)) |
| Look up an obfuscated identifier (`mx`, `hwz`, `NZ`, `Y18`, …) | Pick the right `symbol_index_*.md` file by category (routing matrix in `00_overview/README.md`), or grep all four. Until consolidation completes, also grep the `00_overview/symbol_additions_v2_1_156_*.md` for the module that touched it |
| Find which extracted asset/decl contains a feature | [`00_overview/file_index.md`](00_overview/file_index.md), or grep `cli_inner_pretty.js` for a stable string |
| Verify a mapping's confidence | The "Cross-validated against" block at the top of the relevant `00_overview/symbol_additions_v2_1_156_*.md`; §13 of `changelog_analysis.md` for where the v2.1.88 trail runs cold |
| Read the deobfuscated source directly | `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` and `cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js` |

## See Also

- [`../../claude_code_v_2.1.142/analyze/`](../../claude_code_v_2.1.142/analyze/) — the v2.1.113 → v2.1.142 tree this one extends (and the format/depth reference for these docs)
- [`/lyz/codespace/analysis_claude_code_v2/CLAUDE.md`](/lyz/codespace/analysis_claude_code_v2/CLAUDE.md) — project conventions, symbol-index routing matrix, and the dual-version code-snippet template
- [`../CHANGELOG.md`](../CHANGELOG.md) — the upstream changelog this analysis tracks (the bullet source of truth)
- [`../_scout_dossier.md`](../_scout_dossier.md) — confirmed anchors, paths, and conventions shared across the analysis agents
