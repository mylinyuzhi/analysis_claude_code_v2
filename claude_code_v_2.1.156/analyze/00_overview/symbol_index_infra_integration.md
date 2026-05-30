# Symbol Index — Integration Infrastructure (v2.1.143 → v2.1.156)

This index catalogs obfuscated → readable mappings for the **integration infrastructure** symbols introduced or changed between v2.1.143 and v2.1.156. Scope: LSP, Chrome/Browser, IDE, UI Components, Plugin System, Code Indexing, Shell Parser, Slash Commands.

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Plan, Background Agents, Workflows, Todo, Compact, Hooks, Skills, Thinking, Effort, Steering, CLI
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry

## File:Line Format

For v2.1.156 the canonical source citation is the single pretty-printed bundle, cited as `cli_inner_pretty.js:<line>` (path: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`). Every line below was verified by reading the bundle at that location.

---

## Module: LSP

Language Server Protocol client, diagnostic queue, server lifecycle, plugin LSP server discovery.

*(No new mapped symbols this window — the v2.1.143 → v2.1.156 delta touched LSP only indirectly. No v2.1.156 symbols route here yet.)*

---

## Module: Chrome / Browser

Claude-in-Chrome extension integration, headless browser shim for background agents, shared-tab handling.

*(No new mapped symbols this window — no v2.1.156 symbols route here yet.)*

---

## Module: IDE

VS Code / Cursor / Windsurf / JetBrains integration, in-chat mic, voice mode, diff view, shell integration lock files, editor launching from TUI.

*(No new mapped symbols this window — no v2.1.156 symbols route here yet.)*

---

## Module: UI Components

React/Ink components: the `/effort` Faster/Smarter slider render path (v2.1.154/156), the `/workflows` history viewer (v2.1.154), and the workflow run-snapshot helpers that feed it.

### `/effort` Slider Render Path (v2.1.154/156 — Faster/Smarter relabel)

These are the slider-render UI components and geometry/ripple constants. The effort *logic* (capability gates, resolver, `ultracode` rail predicate, `/effort` arg parsing, help text) is filed in `symbol_index_core_features.md` (Effort) / `symbol_index_infra_platform.md` (Model). This section holds the React render and its layout constants only.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cYz` | `DEFAULT_SLIDER_INDEX` (`3` → slider opens on `xhigh`) | cli_inner_pretty.js:527511 | constant |
| `Fr4` | `rippleLevel` (cosine ripple intensity for a distance) | cli_inner_pretty.js:527199-527203 | function |
| `G8q` | `BASE_SLIDER_SPACERS` (`[5,5,5,6]` inter-tick padding) | cli_inner_pretty.js:527554 | variable |
| `Ir4` | `BASE_SLIDER_TRIANGLE_POSITIONS` (`[1,10,20,30,40]` caret columns) | cli_inner_pretty.js:527553 | variable |
| `K3z` | `EffortPickerSlider` (the `/effort` slider React component; Faster/Smarter end-labels, env-reflected initial position) | cli_inner_pretty.js:527265-527493 | function (React) |
| `kF` | `UltraRippleText` (per-character ripple-colored text for the `ultracode` rail) | cli_inner_pretty.js:527205-527238 | function (React) |
| `lYz` | `LevelLabelRenderer` (renders one slider tick label: color/shimmer/rainbow/ripple) | cli_inner_pretty.js:527132-527172 | function (React) |
| `mr4` | `getSliderGeometry` (5-tick base ladder + optional 6th `ultracode` rail when `Vx()`) | cli_inner_pretty.js:527105-527131 | function |
| `qy$` | `RIPPLE_RAMP` (8-step violet ripple color ramp, RGB (62,22,118)→(140,80,240)) | cli_inner_pretty.js:527565-527569 | variable |
| `T8q` | `BASE_SLIDER_LEVELS` (the 5 base slider ticks low/medium/high/xhigh/max) | cli_inner_pretty.js:527555-527561 | variable |
| `Ur4` | `rippleDistance` (euclidean distance to ripple origin, ×2 aspect correction) | cli_inner_pretty.js:527194-527197 | function |

### `/workflows` History Viewer (v2.1.154)

The `/workflows` viewer dialog and the run-snapshot persistence/listing helpers that feed its completed-runs list. The `/workflows` slash command itself (`Pjz`) is in the Slash Commands module below; the workflow runtime/gate/caps live in `symbol_index_core_features.md` (Dynamic Workflows).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `b74` | `listWorkflowSnapshots` (read back all run snapshots, tolerate malformed files, sort newest-first by `startTime`; feeds the viewer's completed-runs list) | cli_inner_pretty.js:374781-374826 | function |
| `C74` | `writeWorkflowSnapshot` (persist a completed run's full record JSON for `/workflows` history) | cli_inner_pretty.js:374771-374780 | function |
| `gt4` | `WorkflowHistoryDialog` (`/workflows` viewer React component; merges live tasks + completed snapshots, de-dup by `runId`, list/detail modes) | cli_inner_pretty.js:538403+ | function (React) |

---

## Module: Plugin System

Plugin manifest schema, marketplace, cache cleanup, dependency resolution, plugin-loader, plugin component types.

*(No new mapped symbols this window — no v2.1.156 symbols route here yet.)*

---

## Module: Code Indexing

`@`-file mentions, fuzzy file picker, project file scan, ignore-list, virtual scroller.

*(No new mapped symbols this window — no v2.1.156 symbols route here yet.)*

---

## Module: Shell Parser

Bash command parser (for permission classification), PowerShell parser, shell expansion handling, dangerous-rm detector.

*(No new mapped symbols this window — the v2.1.156 shell/permission work is filed under `symbol_index_infra_platform.md` (Permissions). No symbols route here yet.)*

---

## Module: Slash Commands

Slash command parser, bundled prompt-command registrar/registry, `/code-review` + `/simplify` + `/workflows` command wiring, argument parsing, prompt assembly and effort-ladder UI text.

### Bundled Prompt-Command Registry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bA` | `registerBundledPromptCommand` (generic bundled prompt-command registrar; normalizes the spec, installs lazy getters, pushes onto `Ji4`) | cli_inner_pretty.js:524187 | function |
| `Ji4` | `BUNDLED_COMMANDS` (the bundled-prompt-command registry array; initialized to `[]` in a comma-expression) | cli_inner_pretty.js:524295 | variable |

### `/code-review` Command (v2.1.147 onward; v2.1.152 `--fix`, v2.1.154 cleanup-only split)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$hz` | `buildCodeReviewPrompt` (`getPromptForCommand`: parse args → resolve+clamp effort → assemble preamble + target line + effort body + `--comment`/`--fix` blocks) | cli_inner_pretty.js:600564 | function |
| `_O9` | `parseCodeReviewArgs` (state machine: strip flags, classify first token as `ultra` / effort / unrecognized-level / target) | cli_inner_pretty.js:600530 | function |
| `ayz` | `COMMENT_SUFFIX_BLOCK` ("## Posting to GitHub (--comment)"; inline PR comments via `mcp__github_inline_comment__create_inline_comment`, falls back to `gh api` then stdout) | cli_inner_pretty.js:600626 | constant |
| `BN8` | `tokenizeFlags` (strip named `--flags` with word-boundary regex; return `{rawFirstToken, flags, rest}`) | cli_inner_pretty.js:502812 | function |
| `eyz` | `getCodeReviewDescription` (dynamic description; appends the "ultra: cloud" clause only when `WF()` is true) | cli_inner_pretty.js:600558 | function |
| `Hhz` | `getCodeReviewArgumentHint` (dynamic hint; appends `\|ultra` to the level list only when `WF()` is true) | cli_inner_pretty.js:600561 | function |
| `HO9` | `buildHighRecallEffortPrompt` (factory for the xhigh/max 9-angle body; `$O9 = HO9("xhigh")`, `qO9 = HO9("max")`) | cli_inner_pretty.js:600389 | function |
| `oyz` | `effortPromptMap` (`{low,medium,high,xhigh,max}` → effort-specific prompt body) | cli_inner_pretty.js:600659 | object |
| `pI8` | `EFFORT_LEVELS_LOCAL` (the code-review module's re-bind of the effort ladder: `pI8 = dN`) | cli_inner_pretty.js:600660 | variable |
| `Q1q` | `buildFindingsOutputSchema` (function of the finding cap `n` → the `## Output` JSON-array schema; `Q1q(8)`/`Q1q(10)`/`Q1q(15)`) | cli_inner_pretty.js:600342 | function |
| `qhz` | `buildEffortFallbackPreamble` (cloud-fallback / model-can't-self-launch / unrecognized-effort notice prepended to the body) | cli_inner_pretty.js:600578 | function |
| `syz` | `FIX_SUFFIX_BLOCK` ("## Applying fixes (--fix)"; apply findings to the working tree, with three explicit skip conditions) | cli_inner_pretty.js:600638 | constant |
| `TU4` | `parseFixCommentFlags` (`BN8(H, ["fix","comment"])` → `{scopeArgs, applyFixes}`) | cli_inner_pretty.js:502829 | function |
| `tyz` | `EFFORT_PREFIX_RE` (`/^(low\|med\|hig\|xhi\|max)[a-z]*$/i` "did you mean an effort?" matcher, built from the first 3 letters of each level) | cli_inner_pretty.js:600661 | variable |
| `vR` | `escapeRegex` (escape regex metacharacters in a dynamically-built flag-name `RegExp`; called inside `BN8`) | cli_inner_pretty.js:9649 | function |
| `Y18` | `CODE_REVIEW_NAME` (`"code-review"` command-name constant) | cli_inner_pretty.js:211646 | constant |
| `zO9` | `registerCodeReview` (registers `/code-review` via `bA`; wires `subcommands: { ultra: "ultrareview" }` and `getEffort`) | cli_inner_pretty.js:600612 | function |

### `/simplify` Command (v2.1.154 — cleanup-only)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ehz` | `SIMPLIFY_PROMPT` (`/simplify` body: 4 cleanup agents in parallel + apply fixes; quality-only, no bug hunting) | cli_inner_pretty.js:601378 | variable |
| `kO9` | `simplifyPromptInit` (module-init thunk that calls `Ff()` then assigns `Ehz`/`SIMPLIFY_PROMPT`) | cli_inner_pretty.js:601375 | function |
| `vO9` | `registerSimplify` (registers the cleanup-only `/simplify` bundled command via `bA`) | cli_inner_pretty.js:601350 | function |

### `/workflows` Command (v2.1.154)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Pjz` | `workflowsCommand` (`/workflows` local-jsx slash command; gated on `NZ()`, renders `WorkflowHistoryDialog`) | cli_inner_pretty.js:538934-538942 | object |

---

## Module: Background Agents View (agents-view UI routing)

The `claude agents` (FleetView) input-routing surface. The background-agents runtime/daemon/classifier symbols live in `symbol_index_core_features.md` (Background Agents); only the agents-view input parser routes here.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `q5q` | `parseFleetDispatchInput` (agents-view input parser; leading `!` → shell-exec intent; returns `{template, intent, matched, exec?, cwd?, routine?}`) | cli_inner_pretty.js:614290-614318 | function |

---

## Relocations & verification notes

- **`vR` line corrected.** The seed `symbol_additions_v2_1_156_code_review.md` row cited `vR` (`escapeRegex`) at `cli_inner_pretty.js:502812`, but 502812 is `BN8` (`tokenizeFlags`). The real `vR` definition is `function vR(H){ return H.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); }` at **cli_inner_pretty.js:9649**; this index cites 9649. (`vR` is *called* from inside `BN8` at 502818.)
- **`dq$` relocated out of this index.** The code-review seed header listed `dq$` (`gatherDiffPhase`) under infra_integration, but that file's own "Notes & gaps" resolves it to a single `var dq$` (cli_inner_pretty.js:600275) filed in `symbol_index_core_features.md` with the other review-angle fragment vars. It is **not** included here.
- **`TU4` resolved from the bundle.** It was named in the code-review home-index routing list (infra_integration) but had no seed row; read at `cli_inner_pretty.js:502829` (`parseFixCommentFlags`) and added above.
- **Effort logic vs. effort UI split.** From `symbol_additions_v2_1_156_model_opus48.md`, only the slider-render symbols (`kF`/`mr4`/`lYz`/`K3z`/`Fr4`/`Ur4`/`T8q`/`G8q`/`Ir4`/`cYz`/`qy$`) route here. The effort capability gates/resolver/`ultracode`/help-text/arg-parser (`A2`/`or`/`ycH`/`ow$`/`Vx`/`eE8`/`xYz`/`RL5`/`YP6`/`q48`/`dN`/`s$7`/…) go to `symbol_index_core_features.md` / `symbol_index_infra_platform.md` and are **not** duplicated here.
- **Workflow viewer vs. runtime split.** Only the `/workflows` viewer (`gt4`), the snapshot persistence/listing (`C74`/`b74`), and the `/workflows` command (`Pjz`) route here. The workflow tool, gate, caps, journal, and coordinator symbols are in `symbol_index_core_features.md` (Dynamic Workflows).
- **Spot-verified (11 lines):** `Y18`@211646, `bA`@524187, `Ji4`@524295, `_O9`@600530, `BN8`@502812, `TU4`@502829, `vR`@9649, `q5q`@614290, `Pjz`@538934, `gt4`@538403, `kF`@527205, `mr4`@527105, `lYz`@527132, `K3z`@527265, `T8q`@527555, `cYz`@527511 — all confirmed in the bundle.

---

## See Also

- [`symbol_additions_v2_1_156_code_review.md`](symbol_additions_v2_1_156_code_review.md) — per-module seed table for `/code-review` + `/simplify`
- [`symbol_additions_v2_1_156_workflow.md`](symbol_additions_v2_1_156_workflow.md) — per-module seed table for Dynamic Workflows
- [`symbol_additions_v2_1_156_model_opus48.md`](symbol_additions_v2_1_156_model_opus48.md) — per-module seed table for Opus 4.8 + effort slider UI
- [`symbol_additions_v2_1_156_background_agents.md`](symbol_additions_v2_1_156_background_agents.md) — per-module seed table for bg `--exec` / agents-view routing
- The v2.1.142 integration index lives at `../../../claude_code_v_2.1.142/analyze/00_overview/symbol_index_infra_integration.md`

---

**Status**: Integration-infrastructure symbols consolidated for the v2.1.143 → v2.1.156 delta. LSP, Chrome, IDE, Plugin, Code Indexing, and Shell Parser have no symbols routed in this window; UI Components (effort slider + `/workflows` viewer) and Slash Commands (`/code-review`, `/simplify`, `/workflows`) carry the v2.1.156 additions, plus the agents-view input parser.
