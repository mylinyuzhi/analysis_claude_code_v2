# CLI Argument Parsing

> Related Symbols:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI Module

## Overview

Claude Code v2.1.38 supports a rich set of command-line arguments managed by `commander` (obfuscated as `UT6`). These arguments control execution modes, configuration, permissions, and debugging.

### Argument Definition Location
The arguments are defined in `commanderSetup` (`aGz`) in `chunks.190.mjs`.

---

## 1. Execution Modes

| Flag | Description |
|------|-------------|
| `-p, --print` | Non-interactive mode. Prints response and exits. Skips trust dialogs. |
| `--init` | Run Setup hooks with `init` trigger, then continue. |
| `--init-only` | Run Setup and SessionStart hooks, then exit. |
| `--maintenance` | Run Setup hooks with `maintenance` trigger. |
| `-c, --continue` | Continue the most recent conversation in the current directory. |
| `-r, --resume [value]` | Resume a conversation by Session ID or open interactive picker. |
| `--fork-session` | When resuming, create a new Session ID (fork) instead of reusing the original. |
| `--from-pr [value]` | Resume a session linked to a specific PR. |
| `--teleport [session]` | Resume a "teleport" session (remote). |
| `--remote [description]` | Create a remote session via SSH/Tunnel. |

## 2. Configuration & Models

| Flag | Description |
|------|-------------|
| `--model <model>` | Specify model alias (e.g., `sonnet`, `opus`) or full ID. |
| `--fallback-model <model>` | Automatic fallback model if primary is overloaded (Print mode only). |
| `--effort <level>` | Reasoning effort: `low`, `medium`, `high`, or `max`. |
| `--settings <file>` | Path to a settings JSON file or JSON string. |
| `--setting-sources <src>` | Sources to load: `user`, `project`, `local`. |
| `--agent <agent>` | Agent type to use (overrides settings). |
| `--agents <json>` | JSON object defining custom agents. |
| `--system-prompt <prompt>` | Set the system prompt. |
| `--system-prompt-file <file>` | Read system prompt from file. |

## 3. Input/Output Formats

| Flag | Description |
|------|-------------|
| `--output-format <fmt>` | `text` (default), `json`, or `stream-json`. |
| `--input-format <fmt>` | `text` (default) or `stream-json`. |
| `--json-schema <schema>` | JSON Schema for structured output validation. |
| `--include-partial-messages` | Include partial chunks in `stream-json` output. |

## 4. Tools & MCP

| Flag | Description |
|------|-------------|
| `--tools <tools...>` | Allow specific built-in tools (or `""` for none, `"default"` for all). |
| `--allowed-tools <tools...>` | Whitelist specific tools. |
| `--disallowed-tools <tools...>` | Blacklist specific tools. |
| `--mcp-config <configs...>` | Load MCP servers from JSON files/strings. |
| `--strict-mcp-config` | Only use `--mcp-config` servers (ignore config files). |
| `--chrome` | Enable Claude in Chrome integration. |
| `--no-chrome` | Disable Claude in Chrome integration. |

## 5. Debugging & Permissions

| Flag | Description |
|------|-------------|
| `-d, --debug [filter]` | Enable debug mode. Optional filter (e.g., `api,hooks`). |
| `-d2e, --debug-to-stderr` | Write debug logs to stderr. |
| `--debug-file <path>` | Write debug logs to file. |
| `--verbose` | Enable verbose logging. |
| `--permission-mode <mode>` | Permission strategy (e.g., `bypassPermissions`). |
| `--dangerously-skip-permissions` | Bypass all permission checks (Sandbox only). |
| `--permission-prompt-tool <tool>` | Specific MCP tool for permission prompts. |

## 6. Constraints & Limits

| Flag | Description |
|------|-------------|
| `--max-thinking-tokens <n>` | Limit thinking tokens (Print mode). |
| `--max-turns <n>` | Limit agent turns (Print mode). |
| `--max-budget-usd <amount>` | Dollar limit on API spend (Print mode). |

## 7. Teammates / Swarm (New in 2.1.32)

| Flag | Description |
|------|-------------|
| `--agent-id <id>` | Teammate Agent ID. |
| `--agent-name <name>` | Teammate Display Name. |
| `--team-name <name>` | Team name for swarm coordination. |
| `--teammate-mode <mode>` | Spawn mode: `auto`, `tmux`, `in-process`. |

---

## Code Reference

```javascript
// ============================================
// commanderSetup - Argument Definitions
// Location: chunks.190.mjs:1017
// ============================================

// ORIGINAL:
// q.name("claude").description(...).option("-d, --debug [filter]", ...)

// READABLE:
program.name("claude")
       .option("-d, --debug [filter]", "Enable debug mode...")
       .option("--max-budget-usd <amount>", "Maximum dollar amount...", (val) => {
           // Custom parser
           let num = Number(val);
           if (isNaN(num) || num <= 0) throw Error("...");
           return num;
       })
```
