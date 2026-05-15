# Overview — v2.1.113 → v2.1.142

This directory holds the cross-cutting foundation for the v2.1.113 → v2.1.142 analysis tree. It is **not** a feature-by-feature deep dive (those live under `../XX_<module>/`); it is the navigation surface.

## What's Here

| File | Purpose | Owner |
|------|---------|-------|
| `README.md` | This file — overview navigation | unit 01 |
| `changelog_analysis.md` | Long-form architectural narrative — themes, breaking changes | unit 01 |
| `changelog_to_code_map.md` | Per-bullet code-traceability index | unit 01 |
| `file_index.md` | Extracted-file inventory (`cli_unpack_pretty/`, `assets/`) | unit 01 |
| `symbol_index_core_execution.md` | Skeleton: Agent Loop, LLM API, System Prompts, Tools, Agents, Subagent, State | unit 01 |
| `symbol_index_core_features.md` | Skeleton: Plan, Background Agents, /goal, Todo, Compact, Hooks, Skills, Thinking, Steering, CLI | unit 01 |
| `symbol_index_infra_platform.md` | Skeleton: MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry | unit 01 |
| `symbol_index_infra_integration.md` | Skeleton: LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands | unit 01 |
| `symbol_additions_v2_1_142_<unit>.md` | Per-unit symbol additions (added by other units) | other units |

## Where to Start

- **Trying to understand a single changelog bullet?** → `changelog_to_code_map.md`
- **Trying to understand a release theme (e.g. how claude agents matures)?** → `changelog_analysis.md` + the corresponding module folder
- **Looking up an obfuscated symbol?** → `symbol_additions_v2_1_142_*.md` (per-unit) or the four `symbol_index_*.md` skeletons (later, after consolidation)
- **Trying to find which file contains a given feature?** → `file_index.md`

## Narrative Summary

v2.1.113 marked a watershed: the CLI flipped from "bundled JavaScript shipped via npm" to "native Bun-compiled per-platform binary published with optional dependencies." The rest of the window (v2.1.116 → v2.1.142) is largely the consequences of that flip plus three big new product surfaces:

### 1. The Native-Binary Transition (v2.1.113)

`Changed the CLI to spawn a native Claude Code binary (via a per-platform optional dependency) instead of bundled JavaScript`.

This is the single most consequential change in the window. Downstream effects observed across later versions:

- v2.1.117: `Glob` and `Grep` tools replaced by embedded `bfs`/`ugrep` for macOS/Linux native builds (Windows + npm-installed builds unchanged).
- v2.1.117: idle re-render loop fix to reduce memory growth on Linux (only relevant under the long-running native process).
- v2.1.121: Bash tool becomes "permanently unusable" when its starting directory is deleted (the native process holds a CWD handle).
- v2.1.131/v2.1.137: VS Code extension failed to activate on Windows due to hardcoded build paths in the bundled SDK (`createRequire` polyfill bug).
- v2.1.141: SDK error "Claude Code native binary not found" on Linux when both glibc and musl platform packages are installed.

The native binary is what makes `claude agents`/the background daemon viable — node-installed CLIs had no clean way to run a privileged long-running daemon across reboots.

### 2. claude agents — Background Sessions, the Daemon, and the Dashboard

`claude agents` debuted in v2.1.139 as a Research Preview: a single list of every Claude Code session you have running (locally backgrounded, blocked-on-you, or done). It was rapidly hardened across v2.1.140–v2.1.142.

The architecture is **daemon + dashboard + dispatcher**:

- A **background daemon** (managed by `claude daemon` subcommands) hosts running sessions across terminal closes and machine reboots.
- The **dashboard** (`EQ4` in unknown/) is the React component that lists agents, supports filtering, dispatching, attaching.
- **Dispatch flags** added in v2.1.142 (`--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`, `--permission-mode`, `--model`, `--effort`, `--dangerously-skip-permissions`) let you configure new sessions without entering them first.

Notable hardenings:

- v2.1.140: empty placeholder cleanup, idle 5-minute retire of bare `←` sessions, "v to open in editor" honors `$EDITOR`/`$VISUAL`.
- v2.1.142: daemon detects clock jumps (was treating macOS sleep/wake as idle time → killing sessions); daemon exits cleanly on `brew upgrade` (was crash-looping orphaned dispatches); pre-existing git worktrees recognized (Edit/EnterWorktree no longer deadlock); Apple Terminal 256-color bleed fixed when attaching.

### 3. /goal — Stop-Hook-as-Loop

v2.1.139 added `/goal <condition>` — a session-scoped Stop hook that keeps Claude working across turns until the condition holds. The implementation is elegant: instead of building a new "keep going" loop primitive, it composes existing pieces — a hook that blocks Stop, with a UI overlay (`active_goal` event type, visible in `cli_inner_pretty.js` at lines 242763, 386552, 391751) that surfaces live elapsed/turns/tokens.

Key edge cases hardened in v2.1.140:

- Silent hang when `disableAllHooks` or `allowManagedHooksOnly` is set → now shows a clear error.
- Works in interactive, `-p`, and Remote Control.

`/goal clear` exits early; auto-clears on success.

### 4. /claude-api Skill and /routines (v2.1.142)

The new `/claude-api` skill walks you through building LLM-powered apps via the Anthropic SDK — explicitly Claude-only (refuses to mix with OpenAI/etc.). The skill prompt is at `cli_inner_pretty.js:593195` and is one of the largest skill bodies in the build.

`/routines` is the slash command surface for managing scheduled remote Claude Code agents (cloud routines via `claude.ai/code/routines`). It complements the existing `CronCreate`/`CronDelete`/`CronList` tools that fire prompts locally.

### 5. Fast Mode Default Switch (v2.1.142)

`Fast mode now uses Opus 4.7 by default (previously Opus 4.6). Set CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1 to pin fast mode to Opus 4.6.`

This is a quiet capability shift — Fast Mode now spends more thinking tokens by default, since Opus 4.7 has higher per-turn cost than 4.6 even at the same effort level. The override env var is intended for users who specifically wanted 4.6's behavior.

### 6. The Long Tail

The remaining ~600 changelog bullets across v2.1.113 → v2.1.142 fall into the now-familiar pattern:

- **Permissions hardening passes** — each version closes a few specific bypass classes: exec wrappers (v2.1.113), sandbox dangerous-path (v2.1.116), catastrophic-removal safety net (v2.1.126), `Skill(name *)` wildcard (v2.1.139), managed-settings sandbox block fallthrough (v2.1.126).
- **MCP reliability** — token-rotation handling, OAuth multi-server refresh races, `${var%pattern}` parameter expansion miss-detection, `MCP_TOOL_TIMEOUT` end-to-end.
- **Plugin surface widening** — `claude plugin tag`/`prune`/`details`, `themes`/`monitors` under `experimental:`, SKILL.md as root (v2.1.142), LSP server declaration shown in details pane.
- **UI minutiae** — fullscreen vs inline rendering edge cases, kitty/ghostty/iTerm key-event handling, focus mode, autoscroll, redraw races.

See `changelog_analysis.md` for the depth on each theme and `changelog_to_code_map.md` for the per-bullet pointers.

## Conventions Note

This tree adheres to the project-wide CLAUDE.md conventions. In particular:

- **No mapping tables in module docs.** Symbol mappings live only in the four `symbol_index_*.md` files (and, until consolidated, the per-unit `symbol_additions_*.md`).
- **Code references use `cli_unpack_pretty/unknown/<id>.js`** as the canonical source citation. Per-line citations into `cli_inner_pretty.js` are used when the surrounding context matters.
- **Code snippets follow the dual-version format**: header → ORIGINAL → READABLE → Mapping. See `/lyz/codespace/analysis_claude_code_v2/CLAUDE.md`.

## See Also

- [`../README.md`](../README.md) — top-level README
- [`../../claude_code_v_2.1.112/analyze/README.md`](../../../claude_code_v_2.1.112/analyze/README.md) — the equivalent doc for the v2.1.88 → v2.1.112 window
- [`../../claude_code_v_2.1.112/analyze/00_overview/`](../../../claude_code_v_2.1.112/analyze/00_overview) — baseline overview directory
