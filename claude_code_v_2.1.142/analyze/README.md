# Claude Code v2.1.113 → v2.1.142 — Source Diff Analysis

This directory continues the deobfuscation analysis from v2.1.112 (in `../../claude_code_v_2.1.112/analyze/`) and covers the delta from **v2.1.113** through **v2.1.142**. The baseline is the obfuscated build extracted with `claude-code-bomb`; per-decl files live at:

```
/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/
  ├─ cli_inner_pretty.js         (one giant ~20 MB pretty-printed bundle)
  ├─ cli_unpack_pretty/
  │   ├─ unknown/<id>.js          (1224 decls that don't fingerprint to a known package)
  │   ├─ decls/functions/<id>.js  (12,982 function decls)
  │   ├─ decls/vars/<id>.js       (18,201 var decls)
  │   ├─ decls/classes/<id>.js    (272 class decls)
  │   ├─ fingerprint/             (decls that match third-party packages)
  │   └─ node-builtin/            (node stdlib polyfills)
  └─ assets/
      ├─ prompts/, prompts_index.json     (343 prompts, 993 KB)
      ├─ tools_index.json                  (tool offsets — empty in current build)
      ├─ slash_commands.json               (117 slash commands)
      ├─ env_vars.json, cli_flags.json, feature_gates.json
      └─ endpoints.json, system_prompts/
```

**Important format note.** Unlike v2.1.112 (which referenced `chunks.NN.mjs:line`), v2.1.142 was extracted from a Bun-compiled native binary and decls are stored per-file as `cli_unpack_pretty/unknown/<symbol>.js` (one decl per file). The line index is therefore stable across builds — `unknown/EQ4.js` is the entire body of the `EQ4` function.

## Layout

### Top-level overview and indexes

| Path | Content |
|------|---------|
| `00_overview/README.md` | High-level narrative of v2.1.113 → v2.1.142 |
| `00_overview/changelog_analysis.md` | Long-form architectural analysis — major themes, breaking changes |
| `00_overview/changelog_to_code_map.md` | Per-bullet code-traceability index (changelog → obfuscated decl) |
| `00_overview/file_index.md` | Inventory of `cli_unpack_pretty/` decls and `assets/` |
| `00_overview/symbol_index_core_execution.md` | Symbol index — core execution (Agent Loop, Tools, LLM API, Agents, Subagent, State) |
| `00_overview/symbol_index_core_features.md` | Symbol index — core features (Plan, Background Agents, /goal, Todo, Compact, Hooks, Skills, Thinking, Steering, CLI) |
| `00_overview/symbol_index_infra_platform.md` | Symbol index — platform infra (MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry) |
| `00_overview/symbol_index_infra_integration.md` | Symbol index — integration infra (LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands) |
| `00_overview/symbol_additions_v2_1_142_*.md` | Per-unit symbol additions, transitional until consolidated into the four `symbol_index_*.md` files |
| `00_overview/cross_validation_report_*.md` | Per-unit cross-validation reports comparing v2.1.142 deobfuscation against v2.1.88 source (`claude-code-kim`) and the standalone deobfuscated bundle (`cli_inner_pretty.js`) |
| `00_overview/cross_validation_summary.md` | Cross-unit validation roll-up — random-sample spot-check, broken-link sweep, module-README sanity, symbol-index ordering check, v2.1.112 drift sample |

### Per-version delta files (`by_version/`)

19 files cover the 23 numbered releases shipped in this window (some grouped where the deltas are small):

```
by_version/v2.1.113-114.md    (native binary cutover + permission dialog hotfix)
by_version/v2.1.116.md        (resume perf, thinking spinner, embedded bfs/ugrep prep)
by_version/v2.1.117.md        (Pro/Max default high, Glob/Grep → bfs/ugrep, Opus 4.7 1M fix)
by_version/v2.1.118.md        (Vim visual mode, /usage, custom themes, MCP hook type)
by_version/v2.1.119.md        (/config persistence, OTel tool_use_id, prUrlTemplate)
by_version/v2.1.120.md        (claude ultrareview, ${CLAUDE_EFFORT}, AI_AGENT env)
by_version/v2.1.121.md        (alwaysLoad MCP, plugin prune, themes/dictation)
by_version/v2.1.122.md        (Bedrock service tier, OTel @-mention)
by_version/v2.1.123.md        (auth 401 retry-loop hotfix)
by_version/v2.1.126.md        (gateway /v1/models, claude project purge, OAuth paste)
by_version/v2.1.128.md        (/mcp tool counts, OTEL_* not inherited, MCP reserved name)
by_version/v2.1.129.md        (--plugin-url, FORCE_SYNC_OUTPUT, plugin themes/monitors → experimental)
by_version/v2.1.131-132.md    (VS Code Windows hotfix, DISABLE_ALTERNATE_SCREEN, SESSION_ID)
by_version/v2.1.133.md        (worktree.baseRef, bwrapPath/socatPath, effort.level)
by_version/v2.1.136-138.md    (autoMode.hard_deny, plan-mode + Edit-allow fix)
by_version/v2.1.139.md        (claude agents, /goal, /scroll-speed, hook args/continueOnBlock)
by_version/v2.1.140.md        (Agent subagent_type insensitive, /goal hooks-disabled error)
by_version/v2.1.141.md        (terminalSequence hook, ANTHROPIC_WORKSPACE_ID, claude agents --cwd)
by_version/v2.1.142.md        (claude agents dispatch flags, Fast Mode Opus 4.7, /claude-api, /routines)
```

### Module deep-dives (18 modules)

```
02_ui/                  Renderer, themes, fullscreen/alt-screen, vim mode, keybindings
04_tools/               Tool factory rename Y9→XK, SendUserFile (NEW v2.1.142), bfs/ugrep wrappers
06_mcp/                 MCP token refresh, SSE frame caps, workspace reserved, alwaysLoad
07_compact/             Reactive compaction, "preserve sensitive instructions", Summarize-up-to-here
10_skill_system/        skillOverrides, plugin SKILL.md root, /claude-api skill body (NEW v2.1.142)
11_hooks/               args/continueOnBlock/terminalSequence, mcp_tool type, effort.level input
12_plan_mode/           /plan on existing plan, --permission-mode resume, Edit-allow bypass fix
18_sandbox/             deniedDomains, bwrapPath/socatPath, dangerously-skip safety net
19_think_level/         Inline-progressive spinner, amber warmup, Bedrock IP ARN quirks
23_prompt_cache/        TTL ordering, 1-hour cache silent downgrade, subagent summary cache
30_agent_team/          Multi-agent collaboration extensions, in-process runner
31_auto_memory/         Auto-memory injection, sub-agent summary memory dedup
34_subagent/            x-claude-code-agent-id headers, sub-agent transcript hash, Skill tool inheritance (NEW module v2.1.142)
36_background_agents/   `claude agents` daemon + dashboard + dispatcher (NEW module v2.1.142)
37_permission_policy/   autoMode.hard_deny, $defaults merge, Skill(name *) wildcard
38_shell_snapshot/      bash startup snapshotting, SESSION_ID env, find descriptor budget
39_goal/                /goal command, active_goal event, Stop-hook-as-loop (NEW module v2.1.142)
41_system_reminder/     <system-reminder> cross-cutting subsystem (wrap/strip/dispatch, UI, telemetry, catalogue)
```

Five modules are new in this window vs the v2.1.112 baseline tree: `04_tools/`, `34_subagent/`, `36_background_agents/`, `39_goal/`, `41_system_reminder/`.

### `40_ant_promoted/` (planned cross-cutting pool)

`40_ant_promoted/` is the **promotion pool for cross-cutting Anthropic-promoted features** — top-level concepts that don't fit cleanly under a single feature module because they span Agents, Skills, Hooks, and Prompts. It is being populated in a parallel work stream and is not yet present in this tree; until it lands, the same content lives inline in the deep-dive modules below. When created it will hold:

- `/claude-api` skill body anchors (currently in `10_skill_system/`)
- `/routines` slash command (currently in `30_agent_team/` and `36_background_agents/`)
- Fast Mode default flip (currently in `02_ui/` plus model-selection notes in `00_overview/changelog_analysis.md` §7)
- Anthropic-supplied skill upgrades that are listed in the changelog but cross multiple modules

Read this directory after the per-module deep dives if you want the cross-cutting Anthropic-first surfaces in one place. Until then, follow the inline cross-references from each per-module README.

## How to Read This Tree

This analysis tree is structured as a series of **delta units** numbered 01..NN. Each unit owns one feature theme (e.g. claude agents, /goal, plan mode fixes, hooks, MCP). Within a unit:

1. The unit's module folder (e.g. `30_agent_team/` for claude agents, `36_background_agents/` for the daemon/dashboard, `39_goal/` for `/goal`) holds the deep-dive markdown.
2. Symbols newly identified during the unit's work are recorded in `00_overview/symbol_additions_v2_1_142_<unit>.md` (separate file per unit to avoid merge conflicts) and migrated into the four `symbol_index_*.md` files during the consolidation pass.
3. A cross-validation report (`00_overview/cross_validation_report_*.md`) is produced per unit to verify obfuscated→readable mappings against the deobfuscated bundle and the v2.1.88 reference source.

For per-decl code lookup, read `cli_unpack_pretty/unknown/<symbol>.js`. The decl name is the obfuscated symbol from the build (e.g. `EQ4` is the React component for the claude agents dashboard).

## Symbol Index — Four-File Split (vs v2.1.112's Single File)

The v2.1.112 tree uses a single `00_overview/symbol_index.md`. For v2.1.142 the index is split into four files (listed in the Layout table above) to keep each under control as the symbol pool grew. The category-to-file routing matrix lives in [`/lyz/codespace/analysis_claude_code_v2/CLAUDE.md`](/lyz/codespace/analysis_claude_code_v2/CLAUDE.md); 00_overview/README.md also shows which feature modules each index covers.

## Analysis Methodology

Each unit cross-validates obfuscated → readable mappings against two independent sources:

1. **v2.1.88 reference source** — `claude-code-kim/src/*.ts`/`*.tsx`. This is the last fully-readable build before obfuscation was hardened. Many symbols in v2.1.142 still trace back to functions whose v2.1.88 readable name + line range is known.
2. **v2.1.142 deobfuscated source** — `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` and per-decl `cli_unpack_pretty/unknown/<id>.js` files. Bun's `--compile` mode preserves obfuscated names; the extracted bundle is therefore a stable target for grep + decl reads.

Cross-validation reports document each unit's confidence level per mapping (high if both sources agree, medium if only one source is conclusive, low if inferred from string anchors alone). The reports live at `00_overview/cross_validation_report_*.md`.

## Key Themes (v2.1.113 → v2.1.142)

The window spans 30 version numbers but **23 published releases** (v2.1.115, .124, .125, .127, .130, .134, .135 were skipped; v2.1.138 was internal-only). Coverage spreads across:

1. **claude agents (background sessions)** — v2.1.139 introduced `claude agents` dashboard as Research Preview; v2.1.140–v2.1.142 hardened it with `--cwd`, daemon clock-jump detection, browser-shim fixes, crash-loop guards, and added the new flags `--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`, `--permission-mode`, `--model`, `--effort`, `--dangerously-skip-permissions` to scope dispatched sessions.
2. **/goal command** — v2.1.139 added `/goal <condition>`: a session-scoped Stop hook that keeps Claude working across turns until the condition is met. Shows live elapsed/turns/tokens overlay. v2.1.140 fixed silent hangs under `disableAllHooks`/`allowManagedHooksOnly`.
3. **/claude-api skill + /routines slash command** — v2.1.142 added `/claude-api` (build LLM-powered apps via Anthropic SDK) and exposed `/routines` for managing scheduled remote agent routines via `claude.ai/code/routines`.
4. **Native binary transition** — v2.1.113 changed the CLI from bundled JavaScript to a per-platform native binary. Subsequent versions added `bfs`/`ugrep` embedded shell helpers, fixed musl/glibc dual install, native crash recovery.
5. **Plan mode hardening** — v2.1.119 fixed `/plan` on existing plans; v2.1.132 fixed `--permission-mode` resume; v2.1.136 fixed `Edit(...)` allow rules bypassing plan mode.
6. **Hooks platform expansion** — v2.1.118 added `type: "mcp_tool"` hooks; v2.1.119 added `duration_ms` to PostToolUse; v2.1.121 added `hookSpecificOutput.updatedToolOutput` for non-MCP tools; v2.1.133 added `effort.level`/`$CLAUDE_EFFORT`; v2.1.139 added `args: string[]` exec form and `continueOnBlock`; v2.1.141 added `terminalSequence`. v2.1.142 ships a clear error for prompt/agent hooks misconfigured on SessionStart/Setup/SubagentStart.
7. **MCP improvements** — `workspace` reserved (v2.1.128), `alwaysLoad` for skip-tool-search (v2.1.121), 16 MB SSE frame cap (v2.1.139), `MCP_TOOL_TIMEOUT` respected end-to-end (v2.1.142), step-up auth scope handling (v2.1.118).
8. **Permissions & Sandbox** — v2.1.113: `sandbox.network.deniedDomains`, `find -exec`/`-delete`, env/sudo/watch wrappers; v2.1.116: dangerous-path check no longer bypassed by sandbox auto-allow; v2.1.126: catastrophic-removal safety net for `--dangerously-skip-permissions`; v2.1.130: `sandbox.bwrapPath`/`sandbox.socatPath`, `parentSettingsBehavior`; v2.1.139: `Skill(name *)` wildcard prefix match.
9. **Compaction maturity** — v2.1.139 added "preserve sensitive instructions" prompt; v2.1.141 added "Summarize up to here" rewind option; v2.1.142 improved reactive compaction (seed summarize from overflow size).
10. **Prompt cache & 1M context** — v2.1.117 fixed Opus 4.7 sessions falsely computing against 200K; v2.1.129 fixed 1-hour cache being silently downgraded; v2.1.116 fixed cache control TTL ordering races.
11. **Thinking spinner & extended thinking** — v2.1.116 made the thinking spinner inline-progressive; v2.1.117 fixed Opus 4.7 + Bedrock IP ARN + thinking disabled 400; v2.1.136 fixed 400 on redacted thinking blocks after tool calls; v2.1.141 added 10-sec amber warmup.
12. **UI / Themes / Renderer** — v2.1.118 added named custom themes (incl. plugin-shipped themes); v2.1.132 added `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN`; v2.1.116/132 fixed scrollback duplication in non-fullscreen and post-sleep blanking; v2.1.139 rotating amber spinner.
13. **Telemetry / OTel** — v2.1.121 added `stop_reason`, `gen_ai.response.finish_reasons`, `user_system_prompt`; v2.1.126 added `invocation_trigger`; v2.1.128 stopped subprocess `OTEL_*` inheritance; v2.1.139 added `x-claude-code-agent-id`/`parent-agent-id` headers + OTel attributes; v2.1.141 fixed early-span-loss race.
14. **Fast mode default change** — v2.1.142 switches Fast Mode default from Opus 4.6 to Opus 4.7. Override with `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1`.

See `00_overview/changelog_analysis.md` for theme-by-theme depth and `00_overview/changelog_to_code_map.md` for per-bullet pointers.

## How to Find a Feature in 2.1.142 Source

**Workflow:**

1. Identify a unique string from the changelog (e.g. `"/goal"`, `"SendUserFile"`, `"active_goal"`, `"claude agents"`).
2. `grep -n "<string>" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`
3. From the surrounding code, identify the enclosing obfuscated decl id (e.g. `EQ4`, `NH8`).
4. Read `cli_unpack_pretty/unknown/<id>.js` for the isolated decl, or `cli_unpack_pretty/decls/functions/<id>.js` for the dependency-resolved view.

**Example:**

```
$ grep -n "SendUserFile" cli_inner_pretty.js
211424:var NH8 = "SendUserFile",
385778:J$(wi7, { SendUserFileTool: () => fH5 });

$ cat cli_unpack_pretty/decls/vars/NH8.js
NH8 = "SendUserFile";

# → tool-name constant; the tool factory is around cli_inner_pretty.js:385778
```

For names that don't show up in changelog text (most internal helpers), work backward from string literals (error messages, telemetry events, prompt fragments). The 343-entry `assets/prompts_index.json` is the fastest route from a prompt fragment to its emit-site.

## Symbol Mapping Conventions

This tree follows the project-wide CLAUDE.md conventions: the four `symbol_index_*.md` files in `00_overview/` are the canonical mapping tables, module docs reference them as a list (never duplicate tables), and code snippets use the dual-version format (header → ORIGINAL → READABLE → Mapping). See [`/lyz/codespace/analysis_claude_code_v2/CLAUDE.md`](/lyz/codespace/analysis_claude_code_v2/CLAUDE.md) for the routing matrix and snippet template.

## Entry Points for Readers

Pick a starting file based on what you're trying to do:

| Goal | Start here |
|------|------------|
| Understand release-by-release what changed | `by_version/v2.1.<NN>.md` for the version, then jump to the relevant module folder |
| Understand a single changelog bullet | `00_overview/changelog_to_code_map.md` — find the bullet, follow the decl pointer |
| Understand a feature theme (e.g. how `claude agents` evolved) | `00_overview/changelog_analysis.md` then the matching module (e.g. `36_background_agents/`) |
| Look up an obfuscated identifier (`EQ4`, `T6A`, `NH8`, …) | Pick the right `symbol_index_*.md` file by category (see routing matrix above), or grep all four. Until consolidation completes, also check `00_overview/symbol_additions_v2_1_142_*.md` |
| Find which extracted file contains a feature | `00_overview/file_index.md` — start from the asset listing or grep for a stable string |
| Verify a mapping's confidence | `00_overview/cross_validation_report_*.md` for the relevant unit, or `00_overview/cross_validation_summary.md` for the cross-unit roll-up |
| Read the deobfuscated source directly | `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` and `cli_unpack_pretty/unknown/<id>.js` |

For the cross-cutting Anthropic-promoted features that span multiple modules (`/claude-api`, `/routines`, Fast Mode flip), `40_ant_promoted/` is the entry point once it's populated.

## See Also

- `../../claude_code_v_2.1.112/analyze/` — the v2.1.88 → v2.1.112 baseline this tree extends
- `/lyz/codespace/analysis_claude_code_v2/CLAUDE.md` — project conventions and code-snippet format
- `/lyz/codespace/claude-code-bomb/versions/2.1.142/README.md` — extraction notes and delta vs v2.1.132
- `../CHANGELOG.md` — the upstream changelog this analysis tracks
