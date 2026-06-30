# 04 — Tools (v2.1.193 EXTEND): bash-mode input deltas + the tool-surface diff

> Delta module: `04_tools/` documents the **v2.1.183 → v2.1.193** changes to the tool surface and the bash-mode (`!`) input stack.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (build `a1938d2a`, `tools_extracted = 51`). Every `cli_inner_pretty.js:<line>` is a **v2.1.193** line unless tagged `(183)`.
> BEFORE-PICTURE: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (50 tools). Obfuscated names are re-mangled per build — a 183 obf name is **never** reused; all 193 symbols were re-derived and re-read this round.

---

## TL;DR — three real deltas, one un-isolable fix, one false delta

The tool subsystem in v2.1.193 is mostly carryover. There are **three genuine deltas** plus one un-isolable changelog fix and one false delta to disambiguate:

1. **NET-NEW (2.1.193): live file-path autocomplete in bash mode.** Typing a path-like token after `!` now shows an inline directory dropdown — *but the path scanner is reused carryover from the `@`-mention feature*; only the bash-mode wiring (a new branch + the `"bash-path"` marker, 193=5 / 183=0) is new. Deep-dive: [`bash_mode_autocomplete.md`](./bash_mode_autocomplete.md).
2. **NET-NEW (2.1.186): `!` bash commands auto-trigger a Claude response.** `processBashCommand` now reads a new `respondToBashCommands` setting (default **true**) and returns `shouldQuery: true` unless the command was interrupted/backgrounded/aborted. 183 was always silent. Upgrade gotcha: the default changes behavior. Deep-dive: [`bash_input_respond.md`](./bash_input_respond.md).
3. **NET-NEW (in window): one tool added — `ReadMcpResourceDirTool`** (50 → 51). Zero removals; **zero** description/schema changes to existing tools. The new tool is deferred (`shouldDefer:!0`) and is exactly the `+1` entry the `getAvailableTools` exclusion set gained. Deep-dive: [`tool_surface_delta_193.md`](./tool_surface_delta_193.md).
4. **REFINEMENT (2.1.186), un-isolable: the `--tools` cold-launch feature-gate fix.** The deny-list builder (`Sjo`), built-in registry (`b4`), and visible `SendUserMessage` opt-in latch (`FXp`/`Jfe`) are carryover-equivalent, and the explicit `gb-before-tools` await is after `Sjo` in both 183 and 193. Low confidence; recommend a `38_permissions/` follow-up. Covered in [`tool_surface_delta_193.md`](./tool_surface_delta_193.md) §3.
5. **FALSE DELTA: `classifyAllShell`.** Net-new setting (193=2 / 183=0) but it routes Bash/PowerShell through the auto-mode classifier — a **permissions/auto-mode** concern. The Bash/PowerShell tool *descriptions* are byte-identical 183↔193. Disambiguated in [`tool_surface_delta_193.md`](./tool_surface_delta_193.md) §4; owned by `38_permissions/`.

**Confidence:** high for deltas 1–3 and 5 (each proved with a before/after read this round); low for delta 4 (un-isolable by design).

---

## What changed at a glance

| # | Delta | Kind | 193 anchor | 183 before | Confidence |
|---|-------|------|-----------|------------|:----------:|
| T1 | Live bash-mode path dropdown (`"bash-path"`) | **NET-NEW (wiring)** | `se` branch :629382-629401; `"bash-path"` :629396 | path branch guarded `i!=="bash"`; `"bash-path"`=0 | high |
| T2 | `!` auto-respond (`respondToBashCommands`) | **NET-NEW (body change)** | `y6f` :617562; setting :56492; gate :617604 | `Owf` :604506 always `shouldQuery:!1` | high |
| T3 | `ReadMcpResourceDirTool` add (50→51) | **NET-NEW (tool)** | `iX` :283504; `_ne` decl :283549 / object :283584-283585 | tool absent (grep=0) | high |
| T4 | `--tools` cold-launch gate fix | refinement (un-isolable) | `Sjo` :598509 / `b4` :444127 / `FXp` :432268 / `Jfe` :2098 (carryover) | machinery and opt-in latch already present | low |
| T5 | `classifyAllShell` (Bash/PS auto-mode routing) | NET-NEW but → permissions | :55814 / :58759 | grep=0; tool descriptions identical | high (false delta) |

Carryover (re-mangled, NOT deltas): `getBuiltinToolRegistry` (`b4`), `initializeToolPermissionContext` (`Sjo`), the compgen/zsh Tab completion (`Uic`/`oYf`/`nYf`/`rYf`/`DYf`), the path scanner (`dKr`/`pKr`/`QOd`), `detectUserShell` (`Wpt`), `noResponseCaveatMarker` (`Sre`).

---

## Document index

- [`bash_mode_autocomplete.md`](./bash_mode_autocomplete.md) — T1. The live inline path dropdown in bash mode: the new `mode==="bash"` branch in the live-suggestion callback, the reused (carryover) `@`-mention path scanner, the file-vs-directory accept logic, and the carryover compgen Tab completion it sits alongside. **Includes the drift fix:** `isPathLikeToken` (`dKr`) is carryover, not net-new.
- [`bash_input_respond.md`](./bash_input_respond.md) — T2. `processBashCommand`'s auto-respond gate, the `respondToBashCommands` default-true upgrade gotcha, the `noResponseCaveatMarker`/`shouldQuery` inverse, and the three suppressors (interrupted/backgrounded/aborted).
- [`tool_surface_delta_193.md`](./tool_surface_delta_193.md) — T3+T4+T5. The 50→51 tool diff (`ReadMcpResourceDirTool`), the protocol-vs-tool boundary, the `getAvailableTools` exclusion `+1` that *is* the new tool, the un-isolable `--tools` cold-launch fix, and the `classifyAllShell` false-delta disambiguation.

---

## Method & adversarial notes

Every load-bearing claim cites a re-read `cli_inner_pretty.js:<line>` in the 193 bundle and is grep-classified against 183 (net-new / body-change / carryover). Two adversarial guards applied this round:

- **The path-completion machinery is carryover, not a new engine.** The headline `bash-path` autocomplete reuses the at-mention scanner verbatim (`"Failed to scan directory for path completion"` 1=1; `dKr`/`Yki` byte-identical). Counting the scanner functions as 193-new would be a false delta — only the wiring is new. (This corrected a scout-dossier overclaim; see [`bash_mode_autocomplete.md`](./bash_mode_autocomplete.md) §2.)
- **Re-mangle artifacts are not deltas.** `detectUserShell` (`Wpt`) shows 193=4/183=0 purely because the bundler renamed `bat`→`Wpt`; the body is identical. Likewise the `*.md` tool assets that "changed" differ only in `Offset:`/schema-token re-mangling.

---

## Cross-links to sibling 193 modules

- `39_mcp/` + [`../00_overview/symbol_additions_v2_1_193_mcp.md`](../00_overview/symbol_additions_v2_1_193_mcp.md) — the MCP-protocol side of `ReadMcpResourceDirTool` (`resources/directory/read`, capability gate, connector classification).
- `38_permissions/` — the `--tools` cold-launch gate-ordering fix (T4) and `classifyAllShell` auto-mode routing (T5).
- `00_overview/changelog_delta_scoping.md` — the window-wide changelog scoping.

## 183 tree references (before-pictures)

- The `@`-mention path navigation the bash dropdown reuses: 183 callers at `cli_inner_pretty.js:615555` (183).
- 183 `processBashCommand` (`Owf`, 183 `cli_inner_pretty.js:604506`) — always-silent baseline.

## v2.1.88 named-TS lineage snapshot

### Tools Lineage Classification

**What it does:** Separates features that already existed in the named TypeScript ancestor from features added later in the 183→193 window.

**How it works:**
1. Read `/lyz/codespace/3rd/claude-code/src/tools.ts` to establish the named registry baseline: v2.1.88 already had `BashTool`, `ListMcpResourcesTool`, `ReadMcpResourceTool`, conditional `TeamCreateTool`/`TeamDeleteTool`, and conditional `ToolSearchTool`.
2. Read the v2.1.88 hidden-tool exclusion set in `tools.ts:300-307`: it excluded `ListMcpResourcesTool`, `ReadMcpResourceTool`, and `SyntheticOutput`, but not a directory-read MCP resource tool.
3. Read `processUserInput/processBashCommand.tsx`: v2.1.88 logged `tengu_input_bash` with only the `powershell` field and returned `shouldQuery: false` on success, interrupted-shell errors, shell errors, and generic errors.
4. Read `hooks/useTypeahead.tsx`: v2.1.88 already used path completion for non-bash `@` suggestions, but both team/member `@` suggestions and file/resource `@` suggestions skipped `mode === "bash"`.
5. Grep the named source for stable 193 tokens: `respondToBashCommands`, `"bash-path"`, `ReadMcpResourceDirTool`, `ReadMcpResourceDir`, and `resources/directory/read` are absent from the v2.1.88 source tree.

**Why this approach:**
- The named TypeScript tree gives semantic anchors for old surfaces (`BashTool`, `ReadMcpResourceTool`, `ToolSearchTool`) that the bundled 183/193 obfuscated names cannot preserve.
- Absence checks use stable strings rather than obfuscated identifiers, avoiding remangle false positives.
- The trade-off is that v2.1.88 is not the immediate before-picture for this delta; it is lineage evidence, while the 183 bundle remains the authoritative window baseline.

**Key insight:** The 193 Tools deltas are narrow wiring/surface additions, not a wholesale tool-system rewrite. Bash execution, MCP resource listing/reading, ToolSearch, Team tools, and the non-bash path-completion machinery all existed in v2.1.88; what appears later is bash-mode live path wiring, `!` auto-respond behavior, and the directory-read MCP resource tool.

---

## Related Symbols

> Symbol mappings live in the central index files, never in this README:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Tools)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (CLI/input)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (MCP/Permissions)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (UI/shell parser)
> - per-feature additions: [symbol_additions_v2_1_193_tools.md](../00_overview/symbol_additions_v2_1_193_tools.md)

Headline symbols (full list-format references are in each deep doc):
- `liveSuggestionCallback` (`se`) — bash-mode path branch `:629382`; `"bash-path"` marker `:629396`.
- `processBashCommand` (`y6f`, :617562) — `respondToBashCommands` gate `:617604`; 183 `Owf`@604506.
- `ReadMcpResourceDirTool` name (`iX`, :283504) / object (`_ne`, decl :283549 / object :283584-283585).
- `getBuiltinToolRegistry` (`b4`, :444127) / `getAvailableTools` (`a$`, :444225) / `initializeToolPermissionContext` (`Sjo`, :598509) — CARRYOVER + one body change.
