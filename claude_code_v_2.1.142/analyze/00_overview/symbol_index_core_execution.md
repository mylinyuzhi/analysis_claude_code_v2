# Symbol Index — Core Execution (v2.1.113 → v2.1.142)

> Symbol additions for v2.1.142 are tracked in 00_overview/symbol_additions_v2_1_142_*.md files. Consolidation into this index is a future pass.

This index catalogs obfuscated → readable mappings for the **core execution** symbols introduced or changed between v2.1.113 and v2.1.142. Scope: Agent Loop, LLM API, System Prompts, Tools, Agents, Subagent, State.

For other categories see:

- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Plan, Background Agents, /goal, Todo, Compact, Hooks, Skills, Thinking, Steering, CLI
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome/Browser, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands

## File:Line Format

For v2.1.142, the canonical source citation is:

```
cli_unpack_pretty/unknown/<obfuscated>.js    (per-decl isolated file — preferred)
cli_inner_pretty.js:<line>                   (the giant pretty-printed bundle — when context matters)
```

The cli_unpack_pretty per-decl files are stable: line counts inside each decl file don't shift as Bun reorganizes the bundle. Use `unknown/<id>.js` for the "what is this function" lookup and `cli_inner_pretty.js:<line>` only when you need surrounding context.

---

## Module: Agent Loop

The main per-turn dispatcher, message-stream consumer, tool-use orchestrator, and abort/retry plumbing.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

---

## Module: LLM API

The HTTP/streaming layer: request build, retry, prompt cache, beta header negotiation, provider-specific quirks (Bedrock, Vertex, Foundry, Mantle), OAuth refresh.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- 1-hour cache silent-downgrade fix (v2.1.129)
- Opus 4.7 `thinking.type.enabled is not supported` 400 on Bedrock IP ARN (v2.1.117)
- Cache control TTL ordering races (v2.1.116)
- Stream idle timeout watchdog clear on cancel (v2.1.139)
- Native binary musl/glibc dual install (v2.1.141)

---

## Module: System Prompts

The composition of system prompts: identity, tools section, environment description, CLAUDE.md injection, output-style overlay, plan-mode preamble.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- Plugin SKILL.md at root surfaces as a skill (v2.1.142)
- Compaction prompt asks model to preserve sensitive user instructions (v2.1.139)
- `/context all` per-skill token estimates account for tokenizer (v2.1.139)

---

## Module: Tools

Built-in tool definitions (Bash, Read, Write, Edit, Grep, Glob, WebFetch, WebSearch, Monitor, PushNotification, etc.), parameter schemas, tool-result formatters, and the tool factory.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- **Tool factory renamed**: `Y9({...})` → `XK({...})` (per extraction notes)
- **Tool definitions reference identifiers for `name`**: e.g. `name: Bq` where `Bq = "Read"` (resolved via decl map)
- New tool: **SendUserFile** (decl: `NH8 = "SendUserFile"`, registered via `wi7` namespace)
- Embedded `bfs`/`ugrep` for Glob/Grep on native macOS/Linux builds (v2.1.117)
- Bash `dangerouslyDisableSandbox` permission-prompt fix (v2.1.113)
- WebFetch HTML truncation before markdown conversion (v2.1.117)
- Read tool offset validation: accept whitespace/`+`-prefix strings (v2.1.140)
- Bash tool surfaces `gh` API rate-limit hint (v2.1.116)
- PowerShell tool auto-approve parity with Bash (v2.1.119)

---

## Module: Agents (CLI subcommand surface)

The `claude agents` background-sessions subcommand: dashboard, dispatcher, daemon lifecycle, attach/detach, completion-state.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new symbols (preliminary, full mapping pending):

- `EQ4` — agents dashboard React component (cli_unpack_pretty/decls/functions/EQ4.js)
- `In6` — initial dashboard state
- `vn6`, `kn6`, `jQ4` — preloaded dispatcher defaults/recents
- `jx7`, `Dx7` — dashboard state persistence read/write
- `HG8` — cwd-filter predicate
- `EQ4`'s sibling helpers (`H$9`, `Lg6`, `KG$`, `O44`, `RC5`, `T$A`, `T7A`, `W7A`, `WKA`, `ao5`, `bP8`, `qm8`) — found by grepping `"claude agents"` in cli_unpack_pretty/decls/functions

Known new themes:

- `--cwd` flag scopes session list (v2.1.141)
- Daemon clock-jump detection vs. idle elapsed-time (v2.1.142)
- Pre-existing worktree recognition (v2.1.142)
- Empty placeholder cleanup, 5-min idle retire of `←` sessions (v2.1.141)
- "v to open in editor" uses `$EDITOR`/`$VISUAL` (v2.1.142)
- New dispatch flags: `--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`, `--permission-mode`, `--model`, `--effort`, `--dangerously-skip-permissions` (v2.1.142)
- Headless browser shim disabled while attached (v2.1.142)
- Crash-loop on missing-cwd resilience (v2.1.141)
- Background-color bleed on 256-color terminals (v2.1.142)

---

## Module: Subagent

The subagent runner: in-process spawn, transcript bridging, cwd preservation, tool-permission inheritance, agent-tool dispatcher.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- Subagents resumed via `SendMessage` not restoring spawn cwd (v2.1.118 fix)
- `subagent_type` accepts case- and separator-insensitive values (v2.1.140)
- Forked subagents enabled on external builds via `CLAUDE_CODE_FORK_SUBAGENT=1` (v2.1.117)
- `x-claude-code-agent-id` / `x-claude-code-parent-agent-id` headers (v2.1.139)
- OTel `agent_id`/`parent_agent_id` span attributes (v2.1.139)
- Sub-agent progress summaries cache-miss fix (v2.1.128 — ~3× cache_creation reduction)

---

## Module: State

Session state primitives: AppState, mutable hook results, in-flight tool registry, plan state, transcript buffers, abort flags.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- `transcript_path` after `EnterWorktree` cwd switch (v2.1.141 fix)
- Idle re-render loop reduction (v2.1.117)
- Background-tasks orphan notification (v2.1.117)
- Stale view-preference / blank assistant messages (v2.1.121)

---

## See Also

- [`changelog_analysis.md`](changelog_analysis.md) — long-form narrative
- [`changelog_to_code_map.md`](changelog_to_code_map.md) — per-bullet pointers
- [`file_index.md`](file_index.md) — extracted-file inventory
- The v2.1.112 baseline lives at `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index.md` (single-file index in that version)
