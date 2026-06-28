# Symbol Index — Core Execution (v2.1.183 → v2.1.193)

This index catalogs obfuscated → readable mappings for the **core execution** symbols that changed between v2.1.183 and v2.1.193 (published sub-versions 2.1.185 / .186 / .187 / .190 / .191 / .193): the **Tools** framework / registry / surface and the **Agent named-spawn enforcement + Subagent spawn** primitives.

For other categories see:

- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Auto-mode, Background Agents, Compact, Auto Memory, Workflow, Agent Team, Skills
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Model, Prompt, Telemetry
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — Slash Commands, Plugins, Hooks, UI surfaces

## File:Line Format

For v2.1.193 the canonical source citation is `cli_inner_pretty.js:<line>` — the single pretty-printed bundle at `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines; VERSION `2.1.193`, build `a1938d2a`, BUILD_TIME `2026-06-25T18:18:11Z`). Lines tagged `(183)` / `(156)` are explicitly before-pictures. **Obfuscated names are re-mangled every build** — a 183 token never carries into 193.

## Per-module symbol manifests

This delta tree keeps the full per-symbol mapping tables in the **per-module additions files**. This index is the routing layer; the curated tables below carry only the most load-bearing anchors. Consult the additions file for the exhaustive, line-by-line, before/after table:

- [`symbol_additions_v2_1_193_tools.md`](symbol_additions_v2_1_193_tools.md) — Tools (bash-mode live path autocomplete, `!` bash auto-respond, tool-surface delta incl. `ReadMcpResourceDirTool`, registry/permission carryover)

> The **named-spawn enforcement** rows below (`is`/`p9e`/`wPe`/`Wil` + the Agent-tool upfront deny block) are borrowed from [`symbol_additions_v2_1_193_permissions.md`](symbol_additions_v2_1_193_permissions.md); that file's manifest bullet lives in [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) (its Sandbox/Model/denial-store rows), and its Auto-mode + worker-forwarding rows route to [`symbol_index_core_features.md`](symbol_index_core_features.md).

---

## Module: Tools — bash-mode live path autocomplete

NET-NEW (2.1.193) wiring of live path completion into bash mode (the `"bash-path"` suggestion kind), riding on carryover path-completion / shell-completion machinery (re-mangled). Exhaustive home: [`symbol_additions_v2_1_193_tools.md`](symbol_additions_v2_1_193_tools.md) ("bash-mode live path autocomplete").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `se` | `liveSuggestionCallback` (the new `mode==="bash"` path-completion branch `:629382-629401`) | cli_inner_pretty.js:629382 | function |
| `te` | `suggestionKind` ref (`.current` ∈ `"bash-path"`/`"at-path"`/`"directory"`…) | cli_inner_pretty.js:629396 | variable |
| `dKr` | `isPathLikeToken` (CARRYOVER; 183 `Yki`, byte-identical) | cli_inner_pretty.js:188582 | function |
| `pKr` | `getPathCompletions` (CARRYOVER; 183 `Xki`) | cli_inner_pretty.js:188612 | function |
| `QOd` | `scanDirectoryForCompletion` (cached readdir, dirs-first; CARRYOVER; 183 `Amd`) | cli_inner_pretty.js:188593 | function |
| `m4i` | `DIRECTORY_SCAN_CAP` (=5000) | cli_inner_pretty.js:188641 | constant |
| `d4i` | `directoryScanCache` (LRU `max:500 ttl:300000`) | cli_inner_pretty.js:188651 | variable |
| `Wpt` | `detectUserShell` (env `SHELL`→bash/zsh/fish; CARRYOVER; 183 `bat`) | cli_inner_pretty.js:351210 | function |
| `Uic` | `getShellCompletions` (compgen/zsh Tab-completion; CARRYOVER) | cli_inner_pretty.js:628313 | function |
| `oYf` | `runShellCompletion` (CARRYOVER) | cli_inner_pretty.js:628299 | function |
| `DYf` | `requestShellCompletion` (accept-time Tab dispatch; CARRYOVER) | cli_inner_pretty.js:629143 | function |

## Module: Tools — `!` bash command auto-respond

NET-NEW (2.1.186) `respondToBashCommands` setting: a `!`-prefixed bash command now auto-responds (the `processBashCommand` body now sets `shouldQuery` true; 183 `Owf` always `shouldQuery:!1`). Exhaustive home: [`symbol_additions_v2_1_193_tools.md`](symbol_additions_v2_1_193_tools.md) ("`!` bash command auto-respond").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `y6f` | `processBashCommand` (body change; 183 `Owf` always `shouldQuery:!1`) | cli_inner_pretty.js:617562 | function |
| `Mrc` | `bashModeModule` (`gt(Mrc,{ processBashCommand: () => y6f })`) | cli_inner_pretty.js:617560 | object |
| `respondToBashCommands` | settings schema field (`A.boolean().optional()`, default `?? !0`) | cli_inner_pretty.js:56492 | constant |
| `Lr` | `getSettings` | cli_inner_pretty.js:58428 | function |
| `Psr` | `getDefaultShell` (reads `defaultShell`; CARRYOVER) | cli_inner_pretty.js:617550 | function |
| `Sre` | `noResponseCaveatMarker` (CARRYOVER; 183 `Rte`) | cli_inner_pretty.js:599656 | function |
| `dBe` | `LOCAL_COMMAND_CAVEAT_TAG` (`"local-command-caveat"`) | cli_inner_pretty.js:45931 | constant |

## Module: Tools — tool-surface delta (`ReadMcpResourceDirTool` + registry)

NET-NEW (2.1.193) deferred `ReadMcpResourceDirTool` (added to the `a$` exclusion set, surfaced via ToolSearch) plus carryover registry/permission builders. The tool's MCP *protocol* home is the MCP section of [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md); the tool *surface* delta is owned here by `04_tools/`. Exhaustive home: [`symbol_additions_v2_1_193_tools.md`](symbol_additions_v2_1_193_tools.md) ("tool-surface delta").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `iX` | `ReadMcpResourceDirToolName` (`"ReadMcpResourceDirTool"`; NET-NEW) | cli_inner_pretty.js:283504 | constant |
| `_ne` | `ReadMcpResourceDirTool` (tool object; `shouldDefer:!0`; the new `a$` exclusion entry) | cli_inner_pretty.js:283585 | object |
| `dlp` | `readMcpResourceDirInputSchema` (Zod `{ server, uri }`) | cli_inner_pretty.js:283549 | function |
| `plp` | `readMcpResourceDirOutputSchema` (Zod `{ resources[], error }`) | cli_inner_pretty.js:283549 | function |
| `D_a` | `readMcpResourceDirDescription` ("List the direct children… not recursive.") | cli_inner_pretty.js:283505 | constant |
| `Xs` | `defineTool` (the tool-object wrapper that builds `_ne`) | cli_inner_pretty.js:151125 | function |
| `b4` | `getBuiltinToolRegistry` (CARRYOVER; gate-conditional entries unchanged) | cli_inner_pretty.js:444127 | function |
| `a$` | `getAvailableTools` (exclusion set 3→4 names, `+_ne.name`; includes `Ep` "StructuredOutput", tabled in core_features; 183 `zR`) | cli_inner_pretty.js:444225 | function |
| `Sjo` | `initializeToolPermissionContext` (the `--tools` deny-universe builder; CARRYOVER) | cli_inner_pretty.js:598509 | function |

> The `classifyAllShell` setting referenced in the tools additions routes to auto-mode, **not** the tool surface — it is tabled under **Module: Permissions / Auto-mode** in [`symbol_index_core_features.md`](symbol_index_core_features.md).

## Module: Subagent / Agent spawn — named-spawn enforcement

REFINEMENT (2.1.193): an upfront `Agent(type)` deny + allowlist check now gates named-teammate spawns before dispatch (riding carryover deny-rule matchers). The carryover worker-permission forwarding (`rdc`/`M8n`/`pendingWorkerRequest`) that the permissions additions note routes to the Background/Auto-mode surface is tabled under **Module: Permissions / Auto-mode** in [`symbol_index_core_features.md`](symbol_index_core_features.md). Exhaustive home: [`symbol_additions_v2_1_193_permissions.md`](symbol_additions_v2_1_193_permissions.md) ("Subagent/Agent spawn — named-spawn enforcement").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `is` | `AGENT_TOOL` name (`"Agent"`; carryover) | cli_inner_pretty.js:150806 | constant |
| `p9e` | `findDenyRuleForTool` (carryover matcher) | cli_inner_pretty.js:597589 | function |
| `wPe` | `filterAgentsByDenyRules` (carryover; "Available agents" list) | cli_inner_pretty.js:597592 | function |
| `Wil` | `resolveForkAgentAvailability` (carryover; 183 `gqa`) | cli_inner_pretty.js:430268 | function |
| `allowedAgentTypes` | `Agent(x,y)` allow-list (carryover; 19 hits both) | cli_inner_pretty.js:430268 | object |
| named-spawn block | upfront `Agent(type)` deny + allowlist check (REFINEMENT; 183 `:423565` absent) | cli_inner_pretty.js:430515 | object |
| `E9e` | `SubagentSpawnError` (class decl; runtime `name="AgentTypeError"`; thrown by the named-spawn deny block at `:430513`/`:430521`/`:430530`) | cli_inner_pretty.js:430345 | class |

---

For the v2.1.156→v2.1.183 core-execution baseline, see the v2.1.183 tree's [`symbol_index_core_execution.md`](../../../claude_code_v_2.1.183/analyze/00_overview/symbol_index_core_execution.md).
