# File Index — v2.1.112 Source Chunks

This index lists which `chunks.NN.mjs` files contain the v2.1.88 → v2.1.112 changes cited in the per-version analyses. Use this as a starting point for further investigation.

The `cli.chunks.mjs` file is the entry point that re-exports symbols from individual chunks.

---

## Where the new features live

| Feature | Version | Primary chunk | Notes |
|---------|---------|---------------|-------|
| PreToolUse `defer` hook | v2.1.89 | `chunks.193.mjs:34-130` | Permission decision dispatch |
| `CLAUDE_CODE_NO_FLICKER` (alt-screen) | v2.1.89 | `chunks.65.mjs:1491-1505` | `isFullscreenMode` cascade |
| Autocompact dual circuit-breakers | v2.1.89 | `chunks.159.mjs:1379-1428` (`QkK`) | `wLK=3` consecutive failures + `jLK=3` rapid refills in `a_7=3` turn window |
| `/buddy` companion | v2.1.89 | `chunks.180.mjs`, `chunks.220.mjs` | Easter egg (pre-built in v2.1.88) |
| `/powerup` lessons | v2.1.90 | `chunks.180.mjs:961, 1396-1403` | JSX lessons + state |
| Plugin marketplace cache | v2.1.90 | `chunks.157.mjs` | Plugin loader |
| Edit/format-on-save race | v2.1.90 | `chunks.16.mjs` | File state cache |
| MCP `_meta["anthropic/maxResultSizeChars"]` | v2.1.91 | `chunks.162.mjs:578-617` | MCP tool wrapper |
| `Vg1 = 500000` ceiling | v2.1.91 | `chunks.83.mjs` | Hard cap |
| `disableSkillShellExecution` | v2.1.91 | `chunks.19.mjs` | Settings schema |
| `forceRemoteSettingsRefresh` | v2.1.92 | `chunks.19.mjs` | Settings schema |
| Bedrock setup wizard | v2.1.92 | (login screens) `chunks.18X.mjs` | JSX onboarding |
| Mantle env vars | v2.1.94 | `chunks.116.mjs:297-298` | Env-var allowlists |
| Default effort medium→high | v2.1.94 | `chunks.80.mjs` | `getDefaultEffortForModel` |
| Slack MCP "Slacked" renderer | v2.1.94 | `chunks.161.mjs:777-797` | Custom MCP tool renderer |
| `keep-coding-instructions` (plugin) | v2.1.94 | `chunks.156.mjs:420`, `chunks.165.mjs:485-494` | Plugin output style frontmatter |
| Cedar grammar | v2.1.97 | `chunks.102.mjs` | Syntax highlighter |
| Bash classifier hardening | v2.1.97-2.1.98 | `chunks.83.mjs`, `chunks.149.mjs` | Permission rules |
| `CLAUDE_CODE_PERFORCE_MODE` | v2.1.98 | `chunks.16.mjs:3070-3076`, `chunks.16.mjs:3320` | Edit/Write gate |
| Vertex setup wizard | v2.1.98 | `chunks.214.mjs` | JSX onboarding |
| Monitor tool | v2.1.98 | `chunks.101.mjs:1288-1339` | Deferred tool |
| `/team-onboarding` | v2.1.101 | `chunks.190.mjs:195-210` | Prompt-type command |
| OS CA cert resolver | v2.1.101 | `chunks.19.mjs:2150-2167` | TLS bootstrap |
| `/ultraplan` cloud env auto-create | v2.1.101 | `chunks.180.mjs` (or ultraplan handler) | `useDefaultEnvironment: true` |
| `EnterWorktree` `path` param | v2.1.105 | EnterWorktree tool chunk | Worktree switch |
| PreCompact blocking hook | v2.1.105 | `chunks.101.mjs:1568`, `chunks.155.mjs:116`, `chunks.159.mjs:535` | Compact dispatcher checks `blockedBy` |
| Plugin `monitors` manifest | v2.1.105 | `chunks.18.mjs:2251` | Plugin schema |
| WebFetch style/script strip | v2.1.105 | WebFetch tool chunk | Pre-injection cleanup |
| `ENABLE_PROMPT_CACHING_1H` | v2.1.108 | `chunks.194.mjs:1034-1043` | `is1HourCacheEligible` |
| `/recap` slash command | v2.1.108 | `chunks.189.mjs:2782-2792` | Wraps awaySummary |
| `/undo` alias for `/rewind` | v2.1.108 | `chunks.188.mjs` | aliases array |
| `/tui` command | v2.1.110 | `chunks.185.mjs:397-454` | Renderer switcher |
| `tui` setting | v2.1.110 | `chunks.19.mjs:547` | Settings schema |
| `/focus` command | v2.1.110 | `chunks.189.mjs:1450-1475` | Brief transcript toggle |
| Push notification tool | v2.1.110 | `chunks.101.mjs:1261-1271` | Deferred tool |
| `autoScrollEnabled` | v2.1.110 | `chunks.151.mjs:2323-2327` | Config |
| Opus 4.7 effort levels | v2.1.111 | `chunks.80.mjs:2835` | `EFFORT_LEVELS` array |
| `modelSupportsXhigh` | v2.1.111 | `chunks.80.mjs:2708-2712` | `bt6` |
| `xhigh` downgrade logic | v2.1.111 | `chunks.80.mjs:2746-2755` | `wy6` |
| `getDefaultEffortForModel` | v2.1.111 | `chunks.80.mjs:2811-2819` | `IF1` |
| Effort slider keybindings | v2.1.111 | `chunks.168.mjs:740-750` | `modelPicker:decreaseEffort/increaseEffort` |
| Welcome banner | v2.1.111 | `chunks.181.mjs:1672, 1685, 1687` | `pdK` |
| `--effort` CLI option | v2.1.111 | `chunks.222.mjs:42-46` | argParser |
| `/ultrareview` | v2.1.111 | `chunks.183.mjs:2170` | Local-jsx, cloud invocation |
| `/less-permission-prompts` | v2.1.111 | `chunks.211.mjs:1403` | Skill |

---

## Chunk → topical role (rough)

The chunks aren't strictly one-feature-per-file (rollup splits by import graph), but here's a rough mapping:

| Chunk | Likely role | Notable symbols |
|-------|-------------|-----------------|
| `chunks.1.mjs` | Bootstrap utilities, common helpers | `MP5`, `qD7`, `K6`, `B7`, `s07` |
| `chunks.16.mjs` | File system helpers, Edit/Write internals, EOL handling, Perforce | `mY1` (isPerforceMode), `gf6` (isPerforceProtected), `Ff6` (error string), `S16` (writeFileWithEol) |
| `chunks.18.mjs` | Plugin manifest schema | `wi5` (MonitorEntrySchema), `XO1` (MonitorArraySchema), `IQ6` (PluginManifestSchema), `xQ6` (MarketplaceSourceSchema) |
| `chunks.19.mjs` | Settings schema (zod), CA cert resolver | `Mr5` (resolveCaStores), `NU7` (DEFAULT_STORES), `forceRemoteSettingsRefresh` field |
| `chunks.61.mjs` | Subscriber-tier helpers | `MK` (getCurrentTier), `JB` (isProPlan), `ch` (isMaxPlan) |
| `chunks.65.mjs` | Fullscreen renderer detection | `lq` (isFullscreenMode) |
| `chunks.80.mjs` | Effort levels, model resolver | `UI` (EFFORT_LEVELS), `bt6`, `Ct6`, `wy6`, `IF1`, `Ps`, `c8z` (MAX_EFFORT_BLOCKLIST) |
| `chunks.83.mjs` | Constants, Bash permission rules | `Vg1` (= 500_000) |
| `chunks.101.mjs` | Tool definitions: Monitor, PushNotification, compact stage | `ic`, `cI4`, `lI4`, `_0`, `$r1`, `e56`, `wr1`, `oc` |
| `chunks.102.mjs` | Syntax highlighting grammars (incl. Cedar) | `xZz` (Cedar grammar) |
| `chunks.116.mjs` | Provider env vars (Bedrock/Vertex/Foundry/Mantle) | `aNz`, `BR6` |
| `chunks.137.mjs` | Remote-task env passthrough | `g7Y` |
| `chunks.149.mjs` | Bash permission rules (additional) | (Bash classifier helpers) |
| `chunks.151.mjs` | Settings descriptions, EnterWorktree, autoScrollEnabled | `WvK`, `DvK`, `bjY` (EnterWorktree); `autoScrollEnabled` field |
| `chunks.153.mjs` | PermissionDenied retry message handling | (PermissionDenied wiring) |
| `chunks.154.mjs` | (autocompact state plumbing) | `consecutiveFailures` reads |
| `chunks.155.mjs` | In-process subagent runner | (PreCompact-blocked log) |
| `chunks.156.mjs`, `chunks.165.mjs` | Output-style + plugin loader (`keep-coding-instructions`) | `ht6` parser |
| `chunks.157.mjs` | Plugin marketplace + plugin loader | (plugin install) |
| `chunks.159.mjs` | **Autocompact dispatcher**, chain hooks | `QkK` (dispatcher), `gDY` (shouldCompact), `wLK=3`, `a_7=3`, `jLK=3`, `GI6` (PreCompact-blocked prefix) |
| `chunks.161.mjs` | MCP renderers (Slack "Slacked", others) | `FhK`, `iGY`, `lGY` |
| `chunks.162.mjs` | MCP tool wrapper (`_meta` annotations) | `Zz7`, `M98` |
| `chunks.168.mjs` | Keybindings (effort slider, etc.) | `KhY`, `modelPicker:decreaseEffort/increaseEffort` |
| `chunks.180.mjs` | `/powerup`, lessons, /release-notes (now local-jsx) | `KQK`, `qQK`, `Xg`, `pFY` (release-notes) |
| `chunks.181.mjs` | Welcome banner | `pdK`, `qUY` ("Welcome to Opus 4.7 xhigh!") |
| `chunks.183.mjs` | `/ultrareview` | `ulK`, `wW6`, ultrareview preflight |
| `chunks.185.mjs` | `/tui` command | `bcY`, `IcY`, `n$7` (validTuiModes) |
| `chunks.188.mjs` | `/rewind` and aliases | aliases: ["checkpoint","undo"] |
| `chunks.189.mjs` | `/focus`, `/recap`, slash commands | `FoY` (focus), `LaY` (recap), `OtK` |
| `chunks.190.mjs` | `/team-onboarding` | `jsY` |
| `chunks.193.mjs` | Hook permission-decision dispatch | (defer case + 2 switches) |
| `chunks.194.mjs` | Prompt cache | `o85` (is1HourCacheEligible) |
| `chunks.211.mjs` | Skills (registrations + skills) | `p25` (less-permission-prompts), `WjA` (full prompt) |
| `chunks.214.mjs` | Vertex setup wizard | (Vertex wizard JSX) |
| `chunks.220.mjs` | (more skills) | |
| `chunks.222.mjs` | CLI options/argParser | `--effort` argParser |

(Roles inferred from the searches done in the per-version analyses. Some chunks may host more than one feature.)

---

## How to find a feature in 2.1.112 source

**Workflow:**
1. Identify a unique string from the changelog (e.g. `"xhigh"`, `"Slacked"`, `"PreCompact hook"`)
2. `grep -l "<string>" .../source/*.mjs`
3. Read the matching chunk for the surrounding code
4. Cross-reference with this index for the readable name

**Example:**
```
$ grep -l "Slacked" source/*.mjs
chunks.161.mjs

$ grep -n "Slacked" source/chunks.161.mjs
780:            return "Slacked"

# → context: Slack MCP custom renderer (v2.1.94)
```

For obfuscated function names that don't show up in changelog text, work backward from string literals (error messages, telemetry events, descriptions).

---

## See also

- [`changelog_analysis.md`](changelog_analysis.md) — the long-form narrative
- [`symbol_index.md`](symbol_index.md) — obfuscated → readable mapping
- [`../by_version/`](../by_version/) — per-version detailed analyses
