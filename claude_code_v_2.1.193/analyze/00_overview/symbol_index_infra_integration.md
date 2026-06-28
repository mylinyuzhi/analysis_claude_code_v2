# Symbol Index — Integration Infrastructure (v2.1.183 → v2.1.193)

This index catalogs obfuscated → readable mappings for the **integration infrastructure** symbols that changed between v2.1.183 and v2.1.193 (published sub-versions 2.1.185 / .186 / .187 / .190 / .191 / .193): **Slash Commands**, **Plugins**, **Hooks**, and the CLI/UI surfaces they touch.

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Auto-mode, Background Agents, Compact, Auto Memory, Workflow, Agent Team, Skills
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Model, Prompt, Telemetry

## File:Line Format

For v2.1.193 the canonical source citation is `cli_inner_pretty.js:<line>` — the single pretty-printed bundle at `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines; VERSION `2.1.193`, build `a1938d2a`, BUILD_TIME `2026-06-25T18:18:11Z`). Lines tagged `(183)` / `(156)` are explicitly before-pictures. **Obfuscated names are re-mangled every build** — a 183 token never carries into 193.

## Per-module symbol manifests

This delta tree keeps the full per-symbol mapping table in the **per-module additions file**. This index is the routing layer; the curated tables below carry only the most load-bearing anchors. Consult the additions file for the exhaustive, line-by-line, before/after table:

- [`symbol_additions_v2_1_193_slash_commands.md`](symbol_additions_v2_1_193_slash_commands.md) — `/rewind` before `/clear`, marketplace `renames` auto-follow, hook comma-matcher fix, `/add-dir`/`/btw`/`/review`/retry-cap misc, `/plugin` staleness carryover

> **Routing note.** Per [`/lyz/codespace/analysis_claude_code_v2/CLAUDE.md`](/lyz/codespace/analysis_claude_code_v2/CLAUDE.md), Slash Commands route to this integration index, and for this delta window the Plugins and Hooks deltas are carried by the slash-commands additions file (the `/rewind`, marketplace-renames, and hook-matcher changes ship together as a slash/CLI/plugin/hooks batch), so they are indexed here alongside Slash Commands rather than under Hooks in core_features.

---

## Module: Slash Commands — `/rewind` before `/clear`

NET-NEW (2.1.191) `/rewind` can resume from before a `/clear`: a `rewound` transcript marker, the `tengu_rewind_first_message` first-message gate, and the `XRc` backward anchor resolver. Exhaustive home: [`symbol_additions_v2_1_193_slash_commands.md`](symbol_additions_v2_1_193_slash_commands.md) ("/rewind before /clear").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `hYt` | `rewindAnchorWriter` (appends `type:"last-prompt"` with `rewound:!0`) | cli_inner_pretty.js:582712 | function |
| `MUo` | `rewindAnchorMirror` (remote/SDK mirror variant of `hYt`) | cli_inner_pretty.js:582725 | function |
| `tde` | `readTranscriptChain` (consumes `rewound`/`explicit`/`leafUuid`; rewrites `parentUuid`) | cli_inner_pretty.js:584448 | function |
| `XRc` | `resolveRewindAnchors` (backward walk → `{persistAnchor, precedingAssistantUuid}`) | cli_inner_pretty.js:705599 | function |
| `Jdr` | `resetSessionForClear` (`setCurrentAsParent`; mints new id; emits `"clear"`) | cli_inner_pretty.js:2575 | function |
| `tengu_rewind_first_message` | first-message rewind gate flag (read via `it(...)`) | cli_inner_pretty.js:707201 | constant |
| `zc` | `getTranscriptStore` | cli_inner_pretty.js:582713 | function |
| `it` | `getConfigFlag` (GrowthBook/config flag reader) | cli_inner_pretty.js:707201 | function |

## Module: Plugins — marketplace `renames` auto-follow

NET-NEW (2.1.193) marketplace `renames` auto-follow: an append-only old→current id map, a cycle-safe chain resolver, a settings migrator, loader follow-through, and telemetry. Exhaustive home: [`symbol_additions_v2_1_193_slash_commands.md`](symbol_additions_v2_1_193_slash_commands.md) ("marketplace renames auto-follow").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `renames` | marketplace `renames` schema field (`record(string, string.nullable())`) | cli_inner_pretty.js:55667 | object |
| `s_t` | `resolvePluginRename` (cycle-safe chain walk → `renamed`/`removed`/`unresolved`) | cli_inner_pretty.js:478428 | function |
| `Gdf` | `MAX_RENAME_CHAIN` (`16`; chain-hop cap) | cli_inner_pretty.js:478477 | constant |
| `NHl` | `migrateRenamedPluginsInSettings` (rewrites `enabledPlugins`/`pluginConfigs` keys old→new) | cli_inner_pretty.js:478443 | function |
| `p0o` | `loadPluginsWithRenameFollow` (on not-found with `renames`, follows via `s_t`, rewrites id) | cli_inner_pretty.js:479482 | function |
| `k0n` | `emitPluginRenamedTelemetry` (`tengu_plugin_renamed {outcome, chain_depth, reason}`) | cli_inner_pretty.js:195349 | function |
| `jBe` | `PLUGIN_ID_SCHEMA` (`plugin@marketplace` regex validator) | cli_inner_pretty.js:55675 | constant |
| `S9f` | `findOrphanedConfiguredPlugins` (193 adds the `renames` exclusion; 183 `lTf`) | cli_inner_pretty.js:612532 | function |

## Module: Plugins — `/plugin` staleness & list window (CARRYOVER anchors)

The unused-plugin staleness sweep and the windowed-list "more above"/"more below" indicator the `/plugin` Installed tab reuses — carryover machinery, listed so a reader can locate it without re-deriving. Exhaustive home: [`symbol_additions_v2_1_193_slash_commands.md`](symbol_additions_v2_1_193_slash_commands.md) ("/plugin unused-plugin surfacing").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `G1t` | `getPluginStaleness` (`{sessionsSinceLastUse, daysSinceLastUse}`; carryover) | cli_inner_pretty.js:195014 | function |
| `wAf` | `PLUGIN_STALE_DAYS` (`14`; inlined in 193, was a param in 183) | cli_inner_pretty.js:518436 | constant |
| `CAf` | `PLUGIN_STALE_SESSIONS` (`10`; inlined in 193) | cli_inner_pretty.js:518437 | constant |
| `tKt` | `computeListWindow` (`{windowStart, windowEnd, moreAbove, moreBelow}`; carryover) | cli_inner_pretty.js:517883 | function |

## Module: Hooks — comma-separated matcher fix

FIX (2.1.191): hook matchers now split on `/[|,]/` (comma-aware), gated by a 4th `allowComma` param sourced from the hook-event-names set. Exhaustive home: [`symbol_additions_v2_1_193_slash_commands.md`](symbol_additions_v2_1_193_slash_commands.md) ("Hooks — comma-separated matcher fix").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `s3f` | `hookMatcherMatches` (comma-aware; 4th param `allowComma`; 183 `qyf` pipe-only) | cli_inner_pretty.js:589634 | function |
| `o3f` | `HOOK_EVENT_NAMES` (Set of all hook events; source of `allowComma` via `.has`) | cli_inner_pretty.js:591335 | constant |
| `Kcn` | `resolveAliases` (tool-alias expansion in the matcher path; 183 `wHt`) | cli_inner_pretty.js:589641 | function |
| `KL` | `canonicalToolName` (normalize a matcher segment; 183 `eL`) | cli_inner_pretty.js:589641 | function |

## Module: Slash Commands — `/add-dir`, `/btw` nav, `/review`, retry cap

Misc slash/CLI deltas: the `/add-dir` already-a-working-dir three-message branch (2.1.193), `/btw` ←/→ answer navigation (2.1.187), `/review <pr>` → code-review medium engine (2.1.186), and the `CLAUDE_CODE_MAX_RETRIES` cap-15 + retry-watchdog fix (2.1.186). Exhaustive home: [`symbol_additions_v2_1_193_slash_commands.md`](symbol_additions_v2_1_193_slash_commands.md) ("/add-dir message + /btw nav + /review + retries").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `jot` | `formatAddDirResult` (three-message `alreadyInWorkingDirectory` branch; 183 `VZe`) | cli_inner_pretty.js:177994 | function |
| `xpf` | `BTW_COMMAND_REGEX` (`/^\/btw\b/gi`; 183 `pWp`) | cli_inner_pretty.js:482363 | constant |
| `oRf` | `reviewCommand` (`/review`; `effort:"medium"`, `argumentHint:"[pr number]"`; 183 `Zrf`) | cli_inner_pretty.js:538534 | object |
| `rRf` | `buildPrReviewPrompt` (`gh pr view`/`gh pr diff` PR-scoped prompt + review pipeline) | cli_inner_pretty.js:538510 | function |
| `nRf` | `PR_REVIEW_FALLBACK_HINT` (no-PR-given fallback) | cli_inner_pretty.js:538509 | constant |
| `Hzn` | review pipeline body (medium-effort tier; shared with `/code-review`) | cli_inner_pretty.js:443362 | variable |
| `O5f` | `getMaxRetries` (reads `CLAUDE_CODE_MAX_RETRIES`, clamps to `Ujo`; 183 `vEf` had no cap) | cli_inner_pretty.js:603209 | function |
| `Ujo` | `MAX_RETRIES_CAP` (`15`) | cli_inner_pretty.js:603244 | constant |
| `_5f` | `DEFAULT_MAX_RETRIES` (`10`) | cli_inner_pretty.js:603243 | constant |
| `jHe` | `isRetryWatchdogEnabled` (`CLAUDE_CODE_RETRY_WATCHDOG`; carryover) | cli_inner_pretty.js:602803 | function |

---

For the v2.1.156→v2.1.183 integration baseline, see the v2.1.183 tree's [`symbol_index_infra_integration.md`](../../../claude_code_v_2.1.183/analyze/00_overview/symbol_index_infra_integration.md).
