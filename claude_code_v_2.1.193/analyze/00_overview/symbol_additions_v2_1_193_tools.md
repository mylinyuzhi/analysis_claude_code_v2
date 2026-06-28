# Symbol Additions — v2.1.193 — Tools (EXTEND)

> Primary route: **[symbol_index_core_execution.md](./symbol_index_core_execution.md)** (the **Tools** module section is the home for the tool-registry / tool-permission / bash-mode-input symbols below).
> The four MCP-dir-tool symbols (`iX`, `_ne`, `dlp`, `plp`, `D_a`) are tool-surface objects but their protocol home is the **MCP** section of **[symbol_index_infra_platform.md](./symbol_index_infra_platform.md)** — they are listed here because the tool *surface* delta is owned by `04_tools/`, and cross-referenced from `00_overview/symbol_additions_v2_1_193_mcp.md`.
>
> Bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). Every line was re-read in the live 193 bundle this round; obfuscated names are re-mangled per build and are **never** assumed to carry across versions. Where a symbol is *carryover* (present byte-identically in 183 under a different obf token), the 183 token + line is noted for traceability.
>
> **Drift fixed vs the scout dossier** (dossier → verified 193):
> - `dKr`/isPathLikeToken classified NET-NEW by the dossier → it is **CARRYOVER** (byte-identical to 183 `Yki`@187417); only the bash-mode *wiring* (`"bash-path"` branch) is net-new. The dossier's `startsWith("~/")` +1 count was not the predicate.
> - `processBashCommand` lines: function `617575`/read `617575`/return `617606` → **`y6f`@617562, read@617564, telemetry@617565, gate@617604, `shouldQuery: S`@617611**.
> - `QOd`/scanDirectoryForCompletion `188597` → **188593**.
> - `oYf`/runShellCompletion `628303` → **628299**.
> - `--tools` flag def `712387` → **712389**.
> - `a$` exclusion +1 was flagged "most likely unrelated refinement" → the new entry is **`_ne.name`** = the new `ReadMcpResourceDirTool` object (`_ne`@283585), i.e. the `a$` change *is* the new tool being hidden from the default available list (a deferred tool). Not unrelated.

## Module: Tools — bash-mode live path autocomplete (NET-NEW wiring 2.1.193; machinery CARRYOVER)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `se` | `liveSuggestionCallback` (useCallback; the new `mode==="bash"` path-completion branch is `:629382-629401`, accept handlers `:629693-629707`/`:629874-629882`) | cli_inner_pretty.js:629382 | function |
| (str) | `"bash-path"` suggestion-kind marker (NET-NEW; 183=0) | cli_inner_pretty.js:629396 | constant |
| `te` | `suggestionKind` ref (`.current` ∈ `"bash-path"`/`"at-path"`/`"directory"`/…) | cli_inner_pretty.js:629396 | variable |
| `dKr` | `isPathLikeToken` (CARRYOVER; 183 `Yki`@187417, byte-identical) | cli_inner_pretty.js:188582 | function |
| `pKr` | `getPathCompletions` (CARRYOVER; 183 `Xki`@187447) | cli_inner_pretty.js:188612 | function |
| `QOd` | `scanDirectoryForCompletion` (cached readdir, dirs-first sort; CARRYOVER; 183 `Amd`@187428) | cli_inner_pretty.js:188593 | function |
| `m4i` | `DIRECTORY_SCAN_CAP` (= 5000) | cli_inner_pretty.js:188641 | constant |
| `d4i` | `directoryScanCache` (LRU `max:500 ttl:300000`) | cli_inner_pretty.js:188651 | variable |
| `Zic` | `bashHistoryGhostText` (history ghost-text fallback after the path branch; CARRYOVER) | cli_inner_pretty.js:628803 | function |
| `Wpt` | `detectUserShell` (env `SHELL`→bash/zsh/fish; CARRYOVER re-mangled, 183 `bat`) | cli_inner_pretty.js:351210 | function |
| `Uic` | `getShellCompletions` (compgen/zsh Tab-completion; CARRYOVER) | cli_inner_pretty.js:628313 | function |
| `oYf` | `runShellCompletion` (CARRYOVER) | cli_inner_pretty.js:628299 | function |
| `nYf` | `buildBashCompgenCommand` (`compgen -f … | head -15 …`; CARRYOVER) | cli_inner_pretty.js:628283 | function |
| `rYf` | `buildZshCompletionCommand` (CARRYOVER) | cli_inner_pretty.js:628291 | function |
| `DYf` | `requestShellCompletion` (accept-time Tab dispatch; CARRYOVER) | cli_inner_pretty.js:629143 | function |
| `MGo` | `SHELL_COMPLETION_LIMIT` (= 15) | cli_inner_pretty.js:628324 | constant |

## Module: Tools — `!` bash command auto-respond (NET-NEW 2.1.186)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `y6f` | `processBashCommand` (body change; 183 `Owf`@604506 always `shouldQuery:!1`) | cli_inner_pretty.js:617562 | function |
| `Mrc` | `bashModeModule` (`gt(Mrc,{ processBashCommand: () => y6f })`) | cli_inner_pretty.js:617560 | object |
| `respondToBashCommands` | settings schema field (`A.boolean().optional()`, default `?? !0`) | cli_inner_pretty.js:56492 | constant |
| `respondToBashCommands` | read site in `y6f` (`Lr().respondToBashCommands ?? !0`) | cli_inner_pretty.js:617564 | constant |
| `respondToBashCommands` | persisted-preferences key list entry | cli_inner_pretty.js:691999 | constant |
| (field) | `respond: s` telemetry field on `tengu_input_bash` (NET-NEW; 183=0) | cli_inner_pretty.js:617565 | constant |
| `Lr` | `getSettings` | cli_inner_pretty.js:58428 | function |
| `Psr` | `getDefaultShell` (reads `defaultShell`; CARRYOVER) | cli_inner_pretty.js:617550 | function |
| `Sre` | `noResponseCaveatMarker` (CARRYOVER; 183 `Rte`) | cli_inner_pretty.js:599656 | function |
| `dBe` | `LOCAL_COMMAND_CAVEAT_TAG` (`"local-command-caveat"`, wraps the `Sre` caveat) | cli_inner_pretty.js:45931 | constant |

## Module: Tools — tool-surface delta: ReadMcpResourceDirTool + registry/permission carryover

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `iX` | `ReadMcpResourceDirToolName` (`"ReadMcpResourceDirTool"`; NET-NEW, 183=0) | cli_inner_pretty.js:283504 | constant |
| `_ne` | `ReadMcpResourceDirTool` (tool object; `shouldDefer:!0`, `name:iX`) — also the new `a$` exclusion entry | cli_inner_pretty.js:283585 | object |
| `dlp` | `readMcpResourceDirInputSchema` (Zod `{ server, uri }`) | cli_inner_pretty.js:283549 | function |
| `plp` | `readMcpResourceDirOutputSchema` (Zod `{ resources[], error }`) | cli_inner_pretty.js:283549 | function |
| `D_a` | `readMcpResourceDirDescription` (`"List the direct children… not recursive."`) | cli_inner_pretty.js:283505 | constant |
| `Xs` | `defineTool` (the tool-object wrapper that builds `_ne`) | cli_inner_pretty.js:151125 | function |
| `b4` | `getBuiltinToolRegistry` (CARRYOVER; 183 @436518, gate-conditional entries unchanged) | cli_inner_pretty.js:444127 | function |
| `a$` | `getAvailableTools` (body change: exclusion set 3→4 names, `+_ne.name`; 183 `zR`@436622) | cli_inner_pretty.js:444225 | function |
| `Ep` | `"StructuredOutput"` (tool-name string in the `a$` exclusion set) | cli_inner_pretty.js:229498 | constant |
| `Sjo` | `initializeToolPermissionContext` (the `--tools` deny-universe builder; CARRYOVER) | cli_inner_pretty.js:598509 | function |
| `classifyAllShell` | `autoMode.classifyAllShell` setting schema (NET-NEW 2.1.193; routes to permissions/auto-mode — NOT a tool-surface change) | cli_inner_pretty.js:55814 | constant |
| `classifyAllShell` | `classifyAllShell` reader (`autoMode?.classifyAllShell === !0`) | cli_inner_pretty.js:58759 | function |
