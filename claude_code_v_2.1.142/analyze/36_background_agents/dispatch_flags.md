# Dispatch Flags — Companion View

## Scope

This file mirrors `30_agent_team/v2_1_142_dispatch_flags.md` for the background-agents module. It's a quick cross-reference for anyone exploring the agent-view dispatcher who hasn't read the agent-team module yet. For the full deep-dive (with every code snippet, validation flow, and edge case), see:

→ **`/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.142/analyze/30_agent_team/v2_1_142_dispatch_flags.md`**

## What the Flags Do

`claude agents` accepts:

| Flag | Source schema | Stored where | Used when |
|------|---------------|--------------|-----------|
| `--cwd <path>` | CLI arg | `mountFleetView({ cwdFilter })` | Filters the displayed job list by `spawnOrigin` directory |
| `--add-dir <dir...>` | repeatable | dispatchExtraArgs → `OG$` | Prepended to every new dispatched worker's argv |
| `--settings <file-or-json>` | scalar | dispatchExtraArgs → `OG$` | Prepended to every new dispatched worker's argv |
| `--mcp-config <file...>` | repeatable | dispatchExtraArgs → `OG$` | Prepended to every new dispatched worker's argv |
| `--plugin-dir <dir>` | repeatable | dispatchExtraArgs → `OG$` | Prepended to every new dispatched worker's argv |
| `--strict-mcp-config` | boolean | dispatchExtraArgs → `OG$` | Prepended (no value) to every new dispatched worker's argv |
| `--permission-mode <mode>` | scalar | dispatchDefaults | Default for new dispatches (user can override per-task) |
| `--dangerously-skip-permissions` | boolean alias | dispatchDefaults.permissionMode = `"bypassPermissions"` | Same |
| `--model <model>` | scalar | dispatchDefaults | Default model for new dispatches |
| `--effort <level>` | scalar | dispatchDefaults | Default effort for new dispatches |

The first six (the extras) are configuration that follows every dispatched worker. The last four are *defaults* visible in the dispatch UI's chip strip, which the user can change per-task.

## Two Wiring Paths

```
claude agents --add-dir /foo --model opus
                │
                ▼
   Commander .command("agents").action(opts)
                │
                ├─ hV$(yV$({ addDir:["/foo"] })) = ["--add-dir", "/foo"]
                │              │
                ▼              ▼
   mountFleetView(root, { dispatchExtraArgs, dispatchDefaults })
                │
                ▼
   MN4(extras)  →  OG$ = ["--add-dir", "/foo"]   (module global)
                │
                ▼
   FleetViewDashboard renders, user types "fix the bug"
                │
                ▼
   coldDispatchFromTemplate(template, "fix the bug", defaults)
                │
                │  argv tail = [...OG$, "--agent", template.name, "--model", "opus"]
                │
                ▼
   I$H.spawnBgSession(argv)  →  bg worker launched
```

## The Three Key Functions

- **`parseAgentsDispatchFlags`** (`Go6`, cli_inner_pretty.js:65-103) — pre-Commander scan for `--cwd`/`--add-dir`/`--settings`/`--mcp-config`/`--plugin-dir`/`--strict-mcp-config`. Used in the lazy bootstrap paths (`--bg` and `←←`) where Commander hasn't run yet.
- **`coerceDispatchDefaults`** (`gg4`, cli_inner_pretty.js:565469-565478) — validates and gates `--permission-mode bypassPermissions`/`auto` on prior opt-in.
- **`serializeDispatchExtraArgs`** (`hV$`, cli_inner_pretty.js:114-122) — turns the typed extras bag back into an argv array for the spawned worker.

## See Also

- `30_agent_team/v2_1_142_dispatch_flags.md` — full deep-dive with original/readable snippets for `Go6`, `yV$`, `hV$`, `gg4`, `qg6`.
- `cwd_filter.md` — the `--cwd` flag in detail.
- `keep_dangerous_skip.md` — `--dangerously-skip-permissions` persistence across retire/wake.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md)
