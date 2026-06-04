# Overview — v2.1.143 → v2.1.156

This directory holds the cross-cutting foundation for the v2.1.143 → v2.1.156 analysis tree. It is **not** a feature-by-feature deep dive (those live under `../XX_<module>/`); it is the navigation surface — the changelog narrative, the per-bullet code-traceability index, the per-module symbol-addition tables, and the four canonical symbol indexes.

The prior tree [`../../../claude_code_v_2.1.142/analyze/`](../../../claude_code_v_2.1.142/analyze/) covered v2.1.113 → v2.1.142; this one picks up at v2.1.143 and ends at v2.1.156. The source bundle under analysis is `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (`VERSION:"2.1.156"`, `BUILD_TIME:"2026-05-28T18:30:33Z"`, `GIT_SHA:de3d672b…` — `cli_inner_pretty.js:124`). Every factual claim in this tree is cited as `cli_inner_pretty.js:<line>`, verified by reading that line.

## What's Here

### Narrative and traceability

| File | Purpose |
|------|---------|
| `README.md` | This file — overview navigation |
| [`changelog_analysis.md`](changelog_analysis.md) | Long-form architectural narrative — the 11-release cadence, the "Big Three" (Opus 4.8, Dynamic Workflows, lean prompt), cross-cutting design patterns, added settings/env/telemetry |
| [`changelog_to_code_map.md`](changelog_to_code_map.md) | Per-bullet code-traceability index — each changelog bullet (newest-first) → theme + `cli_inner_pretty.js:<line>` decl + implementation hint |
| [`file_index.md`](file_index.md) | Extracted-source inventory — the `cli_unpack_pretty/` decls and `assets/` payload, plus the `cli_inner_pretty.js` line regions for the v2.1.143 → v2.1.156 feature window |

### Cross-validation reports (one per module + roll-up)

| File | Purpose |
|------|---------|
| [`cross_validation_summary.md`](cross_validation_summary.md) | Cross-unit roll-up of the original nine per-module verification passes (375 citation spot-checks, 98.7% first-read pass), the consolidated-index re-check, the forbidden-mapping-table scan, and the broken-relative-link sweep. (Three later modules — `tool_search`, `auto_memory`, and `agent_team` — each carry their own `cross_validation_report_*.md`; twelve per-module reports now exist in total.) |
| [`cross_validation_report_workflow.md`](cross_validation_report_workflow.md) | `42_workflow` — line-range / readable-name PASS-FAIL verification + naming-fix log |
| [`cross_validation_report_model_opus48.md`](cross_validation_report_model_opus48.md) | `43_model_opus48` — incl. the `q48`/`vP`/`Vx` canonical-name unification log |
| [`cross_validation_report_lean_prompt.md`](cross_validation_report_lean_prompt.md) | `44_lean_prompt` — gate/provider/normalization verification |
| [`cross_validation_report_code_review.md`](cross_validation_report_code_review.md) | `45_code_review` — command/registrar/effort-ladder verification |
| [`cross_validation_report_background_agents.md`](cross_validation_report_background_agents.md) | `36_background_agents` — dispatcher/classifier/worker verification |
| [`cross_validation_report_hooks.md`](cross_validation_report_hooks.md) | `11_hooks` — MessageDisplay / SessionStart / Stop-hook verification |
| [`cross_validation_report_permission_policy.md`](cross_validation_report_permission_policy.md) | `37_permission_policy` — classifier / dangerous-path / bypass-closure verification |
| [`cross_validation_report_tools.md`](cross_validation_report_tools.md) | `04_tools` — registration / AskUserQuestion / disallowed-tools / streaming verification |
| [`cross_validation_report_skill_system.md`](cross_validation_report_skill_system.md) | `10_skill_system` — reload / disallowed-tools / fork-guard / effort / bundled-bodies verification |
| [`cross_validation_report_auto_memory.md`](cross_validation_report_auto_memory.md) | `31_auto_memory` — memdir entrypoint-cap / three-writer contract / consolidation-lock / `/dream` scaffold verification |
| [`cross_validation_report_agent_team.md`](cross_validation_report_agent_team.md) | `30_agent_team` — BackendRegistry / in-process-vs-pane / mailbox / lifecycle-tools / permission-bridge citation verification + v2.1.88 corroboration + coordinator-mode re-introduction check (absent in v2.1.142, live in v2.1.156) |

### Symbol indexes — four-file split

The canonical obfuscated → readable symbol mappings are split into four files by category, per [`/lyz/codespace/analysis_claude_code_v2/CLAUDE.md`](/lyz/codespace/analysis_claude_code_v2/CLAUDE.md). Module docs use list-form references, never tables; the mapping **tables** live only in these four files (and, until consolidated, the per-module `symbol_additions_v2_1_156_*.md` files).

| File | Scope (modules covered) | Rows |
|------|-------------------------|-----:|
| [`symbol_index_core_execution.md`](symbol_index_core_execution.md) | Agent Loop, Tools (factory / registration / dispatch / AskUserQuestion / Read / streaming executor), LLM API, Agents, Subagent, State, System Prompts (lean/full assembler + section cache + section builders + tool descriptions + reminder), Workflow **coordinator** prompt + Workflow tool factory/defaults | ~91 |
| [`symbol_index_core_features.md`](symbol_index_core_features.md) | **Dynamic Workflows** (gate family, keyword/consent, caps, journal/respawn, lifecycle, VM, `/workflows`, ultracode, coordinator clause), Background Agents (`--exec` / `! command`), **Agent Team / swarm** (BackendRegistry, in-process vs pane executors, file mailbox, lifecycle tools, permission bridge), Hooks (MessageDisplay, Stop-hook deltas), Skills (reload, disallowed-tools, fork-recursion guard, effort frontmatter, bundled bodies), Compact, Thinking / **Effort** (capability gates, resolver, launch latch, `ultracode`, `/effort` UI), Model-selection feature surface, Plan, Todo, Steering, CLI | ~421 |
| [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) | MCP (managed-policy validation), Permissions (auto-mode safety classifier, dangerous-path, command-parser bypass closures, mode/consent surface), Sandbox (TMPDIR canonicalization), Auth, Model provider mapping / normalization / resolution / pricing / Fast-Mode / 1M-context, Prompt-platform (lean-vs-full gate + provider/env helpers), Telemetry | ~153 |
| [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) | LSP, Chrome/Browser, IDE, UI Components (effort slider, fleet list), Plugin System, Code Indexing, Shell Parser, Slash Commands (`/code-review`, `/simplify`, `/reload-skills`, `/workflows`) | ~52 |

When adding a new symbol, choose the file from the category in this table.

#### Four-file routing matrix

Use this to decide which `symbol_index_*.md` a new mapping belongs in:

```
Core Execution  (symbol_index_core_execution.md):
  Agent Loop · LLM API · System Prompts (assembler/sections/tool-desc)
  Tools (factory/registration/dispatch/Read/streaming) · Agents · Subagent
  State · Workflow coordinator prompt + Workflow tool factory/defaults

Core Features   (symbol_index_core_features.md):
  Dynamic Workflows (gate/caps/journal/keyword/ultracode/viewer/lifecycle/VM)
  Background Agents · Todo · Compact · Hooks · Skills
  Thinking / Effort (xhigh, defaults, launch latch, /effort UI logic)
  Model-selection feature surface · Plan · Steering · CLI

Platform Infra  (symbol_index_infra_platform.md):
  MCP Protocol · Permissions · Sandbox · Auth
  Model Selection (provider map/normalize/resolve/pricing/fast-mode/1M)
  Prompt-platform gate predicates · Telemetry

Integration Infra (symbol_index_infra_integration.md):
  LSP · Chrome/Browser · IDE · UI Components · Plugin System
  Code Indexing · Shell Parser · Slash Commands
```

Edge cases this window forced (recorded in each `symbol_additions_*.md` home-routing note):
- The workflow **tool factory** (`yK`) and **tool defaults** (`P45`) are core-execution; the workflow **gate family / caps / journal / ultracode** are core-features; the **UNC detector** (`tm`) and **permission-rule lookup** (`d6H`) are platform-infra.
- Opus 4.8 **model-resolution / pricing / fast-mode / 1M-context** rows are platform-infra; the **effort capability gates / resolver / launch latch / `ultracode`** are core-features; the **slider-render UI** (`kF`/`mr4`/`lYz`/UltraRipple) is integration-infra.
- The `/code-review` + `/simplify` **command wiring and prompt strings** are integration-infra (Slash Commands); the cloud-`ultra` fleet bridge symbols split between slash-command wiring and the agent/teleport launch path.

### Per-module symbol additions (consolidation in flight)

One file per analysis unit, to avoid merge conflicts during parallel module work. Each file gives the v2.1.156 obfuscated identifier, readable name, `file:line`, and type for that module, plus a **home-index routing note** stating which `symbol_index_*.md` each row migrates into during the consolidation pass. They are retired once merged.

| File | Module | One-line scope |
|------|--------|----------------|
| [`symbol_additions_v2_1_156_workflow.md`](symbol_additions_v2_1_156_workflow.md) | `42_workflow` | `Workflow` tool object + lazy Zod schemas, four-layer enablement gate, opt-in description prompt, `meta` AST parser, six-error-code `validateInput`, script persistence + UNC rejection, telemetry helpers |
| [`symbol_additions_v2_1_156_model_opus48.md`](symbol_additions_v2_1_156_model_opus48.md) | `43_model_opus48` | seven-provider `claude-opus-4-8` config + registry, canonical-id/label/membership/1M/output-token/cost resolvers, matured effort system (`xhigh`, per-model defaults, launch latch), `/effort` Faster/Smarter relabel + `ultracode` rail, fast-mode 2x pricing, thinking-signature 400 hotfix |
| [`symbol_additions_v2_1_156_lean_prompt.md`](symbol_additions_v2_1_156_lean_prompt.md) | `44_lean_prompt` | memoized lean-vs-full gate (`X3`) + model-class allow-list (`c45`), `-eap` bypass, server force-lean override, provider classifier + id normalization, assembler swap + section cache, lean `# Harness` section + six full section builders + within-section lean variants, lean-aware tool descriptions |
| [`symbol_additions_v2_1_156_code_review.md`](symbol_additions_v2_1_156_code_review.md) | `45_code_review` | bundled-prompt-command registrar + registry, `/code-review` arg parser + effort ladder, per-effort prompt compiler (fragment palette + five effort bodies + verify/sweep + output schema), `--comment`/`--fix` blocks, cleanup-only `/simplify`, cloud `ultra` ("bughunter") bridge |
| [`symbol_additions_v2_1_156_agent_team.md`](symbol_additions_v2_1_156_agent_team.md) | `30_agent_team` | master gate (`R7`/`Ru5`) + teammate-mode snapshot, the `BackendRegistry` (`R94`/`y94`/`NS`) detection+dispatch (`isInProcessEnabled`/`getTeammateExecutor`/`detectAndGetBackend`), `InProcessBackend` (`K94`) + runner (`runInProcessTeammate`/6-priority poll loop) + `InProcessTeammateTask` helpers, dual-ALS identity isolation, `PaneBackendExecutor` (`L94`) + `TmuxBackend`/`ITermBackend` + CLI/env replay builders (`X94`/`WT$`/`PT_`), file mailbox (`writeToMailbox` `aA` + builders/parsers), `TeamCreate`/`TeamDelete`/`SendMessage` tools, leader↔teammate permission bridge (`OT_`) |
| [`symbol_additions_v2_1_156_auto_memory.md`](symbol_additions_v2_1_156_auto_memory.md) | `31_auto_memory` | memdir prompt-builder (`loadMemoryPrompt`, `truncateEntrypointContent`, entrypoint-line/byte caps, `getAutoMemPath`/`ensureMemoryDirExists`/`logMemoryDirCounts`), three-writer mutual-exclusion contract (`hasMemoryWritesSince`, `isExtractModeActive`, `createMemorySavedMessage`), auto-dream runtime (`buildDreamPrompt`, hours/session-count gating, `.consolidate-lock` mutex, `pendingMemoryUpdates`), `/dream` scheduled-task scaffold |
| [`symbol_additions_v2_1_156_background_agents.md`](symbol_additions_v2_1_156_background_agents.md) | `36_background_agents` | shell-exec bg sessions (`--bg --exec`, agents-view `! <command>`), unified dispatcher `ol`/`ywz`, four-state session classifier, worker retire/respawn fixes in `BgWorkerHandle`, worktree-isolation guard + `--bg-pty-host` orphan watchdog, daemon stale-exec / binary-takeover / `/bg`-handoff deltas |
| [`symbol_additions_v2_1_156_hooks.md`](symbol_additions_v2_1_156_hooks.md) | `11_hooks` | NEW `MessageDisplay` display-only hook (event arrays, Zod schemas, `forceSyncExecution` executor, per-message streaming engine `OW9`, completed-message rewrite `MW9`, renderer wiring), SessionStart `sessionTitle`+`reloadSkills` touch points, Stop/SubagentStop `background_tasks`+`session_crons`, stop-hook block cap |
| [`symbol_additions_v2_1_156_permission_policy.md`](symbol_additions_v2_1_156_permission_policy.md) | `37_permission_policy` | auto-mode exfiltration HARD-BLOCK rewrite + bulk-repo detection + two-stage XML classifier + could-not-evaluate budget fix, `rm -rf $HOME` trailing-slash + `$TMPDIR` unification, PowerShell `cd` + bare-var-assignment bypass closures, managed-MCP per-entry policy validation, auto-mode consent removal |
| [`symbol_additions_v2_1_156_tools.md`](symbol_additions_v2_1_156_tools.md) | `04_tools` | Workflow tool registration into `getAllBaseTools` + runtime gate chain, AskUserQuestion 2.1.154 model-gated reservation + its eligibility predicate, `disallowed-tools` frontmatter (schema/parser/inline+fork paths/clear-on-next-message), Read PARTIAL-view truncation, always-on streaming exec (`eager_input_streaming`) per-model caps |
| [`symbol_additions_v2_1_156_skill_system.md`](symbol_additions_v2_1_156_skill_system.md) | `10_skill_system` | mid-session reload (`/reload-skills` + SessionStart `reloadSkills` + shared cache-invalidation), `disallowed-tools` skill/command frontmatter, `context: fork` self-reinvoke recursion guard (errorCode 9), `effort:` frontmatter delta (`xhigh`, status-bar fix), three bundled skill bodies (`/simplify`, `/code-review`, `/claude-api`) + registrar |

## Where to Start

- **Trying to understand a single changelog bullet?** → [`changelog_to_code_map.md`](changelog_to_code_map.md)
- **Trying to understand a release theme (Opus 4.8, Workflows, lean prompt, exfiltration hardening)?** → [`changelog_analysis.md`](changelog_analysis.md) + the corresponding module folder under `../`
- **Reading per-version source-diff narratives?** → [`../by_version/`](../by_version/) (`2.1.143.md` … `2.1.156.md`; .146/.151/.155 were never published)
- **Looking up an obfuscated symbol?** → Pick the matching `symbol_index_*.md` file by category (routing matrix above). Until consolidation completes, also grep the `symbol_additions_v2_1_156_*.md` files for the module that touched it
- **Gauging how trustworthy a mapping is?** → Each `symbol_additions_v2_1_156_*.md` opens with a "Cross-validated against" block (v2.1.156 bundle self-cross-check, v2.1.88 readable TypeScript at `/lyz/codespace/3rd/claude-code/src/`, and the v2.1.142 reference module); §13 of `changelog_analysis.md` summarizes where the v2.1.88 trail runs cold (Workflow runtime, Opus 4.8, lean prompt, local `/code-review` finder are all post-2.1.88)

## Narrative Summary

The window spans 14 version numbers but **11 published releases** (v2.1.143, .144, .145, .147, .148, .149, .150, .152, .153, .154, .156; .146/.151/.155 never shipped, .148 was a one-line Bash-exit-code hotfix, .150 was internal-only). Its shape is **bimodal**: a long tail of small reliability releases (143–153) feeding one enormous feature drop (154), then a fast hotfix (156). This is the "stabilize the runway, then land the plane" pattern — every reliability fix in 143–153 (binary-takeover, daemon stale-exec, pinned-session handling, partial-view reads) is a precondition for the 154 features.

### The "Big Three" (all v2.1.154)

**1. Opus 4.8 + thinking-block hotfix (v2.1.156).** A new flagship model registered across all seven provider surfaces (`claude-opus-4-8`, `cli_inner_pretty.js:91826-91832`), defaulting to `high` effort with a new `xhigh` level above it (effort enum `["low","medium","high","xhigh"]`, `cli_inner_pretty.js:51690`). Default-on thinking on 4.8 is exactly what made the v2.1.156 hotfix necessary: when a signed `thinking`/`redacted_thinking` block reached the API modified, it returned a 400 — the fix detects that error, strips every signed thinking block (backfilling `[Thinking removed]`), and retries unsigned (`tengu_thinking_signature_strip_retry`). Deep-dive: [`../43_model_opus48/`](../43_model_opus48/).

**2. Dynamic Workflows.** A single `Workflow` tool (`mx = "Workflow"`, `cli_inner_pretty.js:216291`) that takes a self-contained JavaScript orchestration script, runs it in a sandboxed VM in the background, and fans work out across tens to hundreds of subagents *deterministically*. The control plane is a four-layer enablement gate (`NZ`, `cli_inner_pretty.js:184757-184763`) defaulting ON for everyone except the Pro tier; the data plane's trust boundary is the `export const meta = {...}` literal, statically AST-evaluated by `parseWorkflowMeta` (`FZ`, `cli_inner_pretty.js:371746`) with no `eval`. `/workflows` shows live and completed runs. Deep-dive: [`../42_workflow/`](../42_workflow/).

**3. The Lean System Prompt.** A second, parallel system prompt that collapses six multi-paragraph behavioral sections into one ~6-bullet `# Harness` section, made the default for capable models (the `claude-opus-4-8` case in `isFullPromptModel` `c45` returns false ⇒ lean, `cli_inner_pretty.js:143861`). A bet that capable models behave well from terse guidance, saving context budget every turn. Deep-dive: [`../44_lean_prompt/`](../44_lean_prompt/).

These three are co-designed, not coincidental: **Opus 4.8 is the model that triggers the lean prompt by default**, and **`ultracode`** — the session mode that bundles `xhigh` effort with standing workflow orchestration — is the seam where the effort UI and Dynamic Workflows meet (`ultracode` requires both an xhigh-capable model and workflows enabled, `cli_inner_pretty.js:51700-51706`). Read v2.1.154 as a single launch.

### The supporting cast

- **`/code-review` and `/simplify` (v2.1.147 → .154).** v2.1.147 renamed `/simplify` → `/code-review` with effort levels and `--comment` inline PR comments; v2.1.152 added `/code-review --fix`; v2.1.154 re-split `/simplify` to cleanup-only. `/code-review ultra` is a cloud multi-agent ("bughunter") fleet. Deep-dive: [`../45_code_review/`](../45_code_review/).
- **Background-agent maturation (v2.1.153/.154 + .156 reliability).** `claude --bg --exec` and the agents-view `! <command>` create shell-intent background sessions through the unified dispatcher `ol` (`hwz`, `cli_inner_pretty.js:541956-541985`). v2.1.156 then fixes a cluster of reliability bugs: premature "out of context" on 1M models from completion notifications, the classifier losing the goal when a scheduled `/command` fires, pinned sessions respawning every minute after update, idle sessions not retiring, subagents bypassing worktree isolation, and the `--bg-pty-host` 100%-CPU orphan. Deep-dive: [`../36_background_agents/`](../36_background_agents/).
- **Hooks platform (v2.1.143/.145/.152).** A NEW `MessageDisplay` display-only hook (`cli_inner_pretty.js:49289`) to transform/hide streaming assistant text without touching the transcript or model-visible context; SessionStart `sessionTitle`/`reloadSkills`; Stop/SubagentStop `background_tasks`+`session_crons` input arrays; the stop-hook block cap. Deep-dive: [`../11_hooks/`](../11_hooks/).
- **Skills and Tools deltas.** `/reload-skills` + SessionStart `reloadSkills`, `disallowed-tools` frontmatter (`cli_inner_pretty.js:184492`), `context: fork` self-reinvoke recursion guard, `effort:` frontmatter; on the tools side, AskUserQuestion reservation behavior, Read PARTIAL-view truncation, and always-on streaming tool execution. Deep-dives: [`../10_skill_system/`](../10_skill_system/), [`../04_tools/`](../04_tools/).
- **Permissions / auto-mode hardening (v2.1.149/.152/.156).** Improved exfiltration detection (bulk repo transfers), auto-mode no longer requiring opt-in consent, the `rm -rf $HOME` trailing-slash fix, `$TMPDIR` sandboxed-vs-unsandboxed unification, PowerShell `cd` + bare-var-assignment bypass closures, and managed-MCP per-entry policy validation with a `claude doctor` warning. Deep-dive: [`../37_permission_policy/`](../37_permission_policy/).

See [`changelog_analysis.md`](changelog_analysis.md) for the depth on each theme (§3–§10), the cross-cutting design patterns (§11), and the full settings/env/telemetry inventory (§12); see [`changelog_to_code_map.md`](changelog_to_code_map.md) for the per-bullet pointers.

## Differences from the v2.1.142 Overview Directory

This window's tree mirrors the v2.1.142 overview's file classes, with one format adaptation:

- **`file_index.md`** — present, but adapted to the single-bundle build. The v2.1.156 build ships as a *single* pretty-printed bundle (`cli_inner_pretty.js`) rather than the multi-`chunks.NN.mjs` split of older builds, so `file_index.md` maps the v2.1.143 → v2.1.156 feature window onto `cli_inner_pretty.js:<line>` regions plus the `cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js` isolated-decl files and the `assets/` payload, rather than per-chunk line ranges.
- **`cross_validation_report_*.md` + `cross_validation_summary.md`** — present: twelve per-module reports plus one cross-unit roll-up. Each per-module report carries the PASS/FAIL line-range and readable-name verification log for its module (e.g. `cross_validation_report_model_opus48.md` records the `q48`/`vP`/`Vx` canonical-name unification; `cross_validation_report_agent_team.md` records the `getInProcessBackendInstance`→`getInProcessBackend` naming fix and the coordinator-mode re-introduction finding — absent in v2.1.142, revived/live in v2.1.156); `cross_validation_summary.md` aggregates the original nine (375 citation spot-checks at 98.7% first-read pass) and adds the consolidated-index re-check, the forbidden-mapping-table scan, and the broken-relative-link sweep. Cross-validation is **also** embedded in each `symbol_additions_v2_1_156_*.md` "Cross-validated against" block (v2.1.156 self-cross-check + v2.1.88 readable TypeScript + the v2.1.142 reference module), and §13 of `changelog_analysis.md` rolls up where the readable-source trail runs cold.

## Conventions Note

This tree adheres to the project-wide [`CLAUDE.md`](/lyz/codespace/analysis_claude_code_v2/CLAUDE.md) conventions. In particular:

- **No mapping tables in module docs.** Symbol mappings live only in the four `symbol_index_*.md` files (and, until consolidated, the per-module `symbol_additions_v2_1_156_*.md` files). Module docs use list-form references: `` `readableName` (`OBF`) — desc (cli_inner_pretty.js:NNN) ``.
- **Single source citation.** Every factual claim cites `cli_inner_pretty.js:<line>`, verified by reading that line in the v2.1.156 bundle. Per-decl files (`cli_unpack_pretty/decls/.../<id>.js`) are used only for isolated-decl lookup.
- **Code snippets follow the dual-version format**: header (`====` + ReadableName + Location) → ORIGINAL → READABLE → Mapping.

## See Also

- [`changelog_analysis.md`](changelog_analysis.md) — long-form narrative (§1 cadence … §14 where-to-look)
- [`changelog_to_code_map.md`](changelog_to_code_map.md) — per-bullet code-traceability table (newest-first)
- [`../by_version/`](../by_version/) — per-version source-diff narratives (`2.1.143.md` … `2.1.156.md`)
- [`../../../claude_code_v_2.1.142/analyze/00_overview/`](../../../claude_code_v_2.1.142/analyze/00_overview/) — the equivalent overview for the v2.1.113 → v2.1.142 window
- [`../../../claude_code_v_2.1.142/analyze/00_overview/README.md`](../../../claude_code_v_2.1.142/analyze/00_overview/README.md) — the prior window's overview README (style reference)
