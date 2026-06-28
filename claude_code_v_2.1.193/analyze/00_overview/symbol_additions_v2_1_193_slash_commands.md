# Symbol Additions — v2.1.193 — /rewind, CLI, plugins, hooks (EXTEND)

> These symbols route to **[symbol_index_infra_integration.md](./symbol_index_infra_integration.md)** (the **Slash Commands / Plugins / Hooks** subsystems are indexed there). A few cross-cutting helpers (config-flag reader, retry/watchdog) also touch **[symbol_index_infra_platform.md](./symbol_index_infra_platform.md)**.
>
> Bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`, BUILD_TIME `2026-06-25T18:18:11Z`). Every line below was **re-derived in the live 193 bundle** for this round (grep -n / Read). Obfuscated names are re-mangled per build and are **never** assumed to carry across versions; where a symbol is *carryover* from v2.1.183 with a different obf token, the 183 obf name is noted in the readable column for traceability.
>
> Scope of this round (the 183→193 slash/CLI/plugins/hooks delta): (1) NET-NEW `/rewind` resuming from before `/clear` — the `rewound` transcript marker + `tengu_rewind_first_message` first-message gate + `XRc` anchor resolver (2.1.191); (2) NET-NEW marketplace `renames` auto-follow — schema + `s_t` cycle-safe resolver + `NHl` settings migrator + loader follow + telemetry (2.1.193); (3) FIX hooks comma-separated matchers (`s3f` comma-aware split, 2.1.191); (4) REFINEMENT `/add-dir` already-a-working-dir message (`jot`, 2.1.193); (5) NET-NEW `/btw` ←/→ answer navigation (2.1.187); (6) NEW `/review <pr>` → code-review medium engine (`oRf`/`rRf`, 2.1.186); (7) FIX `CLAUDE_CODE_MAX_RETRIES` cap 15 + `CLAUDE_CODE_RETRY_WATCHDOG` redirect (2.1.186). Carryover items (`/plugin` unused-plugin staleness sweep, the "more above" indicator) are listed with their carryover anchors so a reader can locate the unchanged machinery, not re-derive it.

## Module: Slash Commands — /rewind before /clear (NET-NEW 2.1.191)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `hYt` | `rewindAnchorWriter` (appends `type:"last-prompt"` with `rewound:!0`) | cli_inner_pretty.js:582712 | function |
| `MUo` | `rewindAnchorMirror` (remote/SDK mirror variant of `hYt`) | cli_inner_pretty.js:582725 | function |
| `tde` | `readTranscriptChain` (consumes `rewound`/`explicit`/`leafUuid`; rewrites `parentUuid` across the chain) | cli_inner_pretty.js:584448 | function |
| `XRc` | `resolveRewindAnchors` (backward walk → `{persistAnchor, precedingAssistantUuid}`) | cli_inner_pretty.js:705599 | function |
| `Jdr` | `resetSessionForClear` (`setCurrentAsParent` → `parentSessionId = sessionId`, mints new id, emits `"clear"`) | cli_inner_pretty.js:2575 | function |
| `tengu_rewind_first_message` | first-message rewind gate flag (read via `it(...)`) | cli_inner_pretty.js:707201 | constant |
| `zc` | `getTranscriptStore` (transcript persistence store) | cli_inner_pretty.js:582713 | function |
| `xt` | `getSessionId` | cli_inner_pretty.js:582722 | function |
| `it` | `getConfigFlag` (GrowthBook/config flag reader) | cli_inner_pretty.js:707201 | function |
| (handler region) | rewind-conversation handler — `ka = ra ? go : rs`, then `MUo`/`hYt(ka,{rewound:!0})` | cli_inner_pretty.js:707200-707234 | variable |

## Module: Plugins — marketplace `renames` auto-follow (NET-NEW 2.1.193)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `renames` | marketplace `renames` schema field (`record(string, string.nullable())`, append-only old→current map) | cli_inner_pretty.js:55667 | object |
| `s_t` | `resolvePluginRename` (cycle-safe chain walk → `renamed`/`removed`/`unresolved`) | cli_inner_pretty.js:478428 | function |
| `Gdf` | `MAX_RENAME_CHAIN` (`16`; chain-hop cap) | cli_inner_pretty.js:478477 | constant |
| `NHl` | `migrateRenamedPluginsInSettings` (rewrites `enabledPlugins`/`pluginConfigs` keys old→new across editable scopes) | cli_inner_pretty.js:478443 | function |
| `p0o` | `loadPluginsWithRenameFollow` (loader; on not-found with `renames`, follows via `s_t`, validates target, rewrites id) | cli_inner_pretty.js:479482 | function |
| `k0n` | `emitPluginRenamedTelemetry` (`tengu_plugin_renamed {outcome, chain_depth, reason}`) | cli_inner_pretty.js:195349 | function |
| `jBe` | `PLUGIN_ID_SCHEMA` (`plugin@marketplace` regex validator) | cli_inner_pretty.js:55675 | constant |
| (validation site) | marketplace-schema `renames` parse+validate (`c.data.renames`) | cli_inner_pretty.js:521492 | variable |
| (chain-resolve site) | orphan-detector renames exclusion (`t.renames && s_t(...)?.kind === "renamed"`) | cli_inner_pretty.js:612539 | variable |

## Module: Plugins — /plugin unused-plugin surfacing + "more above" (CARRYOVER, anchors)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `S9f` | `findOrphanedConfiguredPlugins` (configured-but-absent plugin ids; 193 adds the `renames` exclusion; 183 `lTf`) | cli_inner_pretty.js:612532 | function |
| `lTf` *(183)* | `findOrphanedConfiguredPlugins` (183 predecessor, no `renames` arg) | cli_inner_pretty.js:600380 *(183)* | function |
| `G1t` | `getPluginStaleness` (`{sessionsSinceLastUse, daysSinceLastUse}`; carryover) | cli_inner_pretty.js:195014 | function |
| `wAf` | `PLUGIN_STALE_DAYS` (`14`; inlined in 193, was a param in 183) | cli_inner_pretty.js:518436 | constant |
| `CAf` | `PLUGIN_STALE_SESSIONS` (`10`; inlined in 193) | cli_inner_pretty.js:518437 | constant |
| `tKt` | `computeListWindow` (windowed-list helper; `{windowStart, windowEnd, moreAbove, moreBelow}`; carryover; `moreAbove: windowStart` returned at `:517886`) | cli_inner_pretty.js:517883 | function |

## Module: Hooks — comma-separated matcher fix (FIX 2.1.191)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `s3f` | `hookMatcherMatches` (comma-aware; 4th param `allowComma`; splits on `/[|,]/`) | cli_inner_pretty.js:589634 | function |
| `qyf` *(183)* | `hookMatcherMatches` (183 predecessor; 3 params, pipe-only `/^[a-zA-Z0-9_|]+$/`) | cli_inner_pretty.js:577890 *(183)* | function |
| `o3f` | `HOOK_EVENT_NAMES` (Set of all hook events; source of the `allowComma` flag via `.has`) | cli_inner_pretty.js:591335 | constant |
| `Kcn` | `resolveAliases` (tool-alias expansion in the matcher path; 183 `wHt`; used at `s3f` flatMap site) | cli_inner_pretty.js:589641 | function |
| `KL` | `canonicalToolName` (normalize a matcher segment; 183 `eL`; used at `s3f` flatMap site) | cli_inner_pretty.js:589641 | function |
| (allowComma site) | `a = o3f.has(r.hook_event_name)` feeds `s3f(i, x.matcher, a, l)` | cli_inner_pretty.js:589831 | variable |

## Module: Slash Commands — /add-dir message + /btw nav + /review + retries (2.1.193 / 2.1.187 / 2.1.186)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `jot` | `formatAddDirResult` (three-message `alreadyInWorkingDirectory` branch) | cli_inner_pretty.js:177994 | function |
| `isExactMatch` | add-dir result flag (`resolve(workingDir) === target`) | cli_inner_pretty.js:177989 | variable |
| `isOriginalCwd` | add-dir result flag (`workingDir === originalCwd`) | cli_inner_pretty.js:177990 | variable |
| `VZe` *(183)* | `formatAddDirResult` (183 predecessor; single "already accessible within the existing working directory" message) | cli_inner_pretty.js:176903 *(183)* | function |
| `xpf` | `BTW_COMMAND_REGEX` (`/^\/btw\b/gi`) | cli_inner_pretty.js:482363 | constant |
| (btw key handler) | `/btw` ←/→ answer stepping (`key === "left" ? -1 : 1`; selected-index `_.current`) | cli_inner_pretty.js:482757 | variable |
| `pWp` *(183)* | `BTW_COMMAND_REGEX` (183; feature present, no answer selection) | cli_inner_pretty.js:473560 *(183)* | constant |
| `oRf` | `reviewCommand` (`/review`; `effort:"medium"`, `argumentHint:"[pr number]"`, gh-pr prompt) | cli_inner_pretty.js:538534 | object |
| `rRf` | `buildPrReviewPrompt` (`gh pr view`/`gh pr diff` PR-scoped prompt + review pipeline) | cli_inner_pretty.js:538510 | function |
| `nRf` | `PR_REVIEW_FALLBACK_HINT` (no-PR-given fallback) | cli_inner_pretty.js:538509 | constant |
| `Hzn` | review pipeline body (medium-effort tier; shared with `/code-review`; declared at `:443362`, woven into `rRf` at `:538524`) | cli_inner_pretty.js:443362 | variable |
| `Zrf` *(183)* | `reviewCommand` (183 predecessor; `"Review a pull request"`, no `effort`/`argumentHint`) | cli_inner_pretty.js:527336 *(183)* | object |
| `O5f` | `getMaxRetries` (reads `CLAUDE_CODE_MAX_RETRIES`, clamps to `Ujo`) | cli_inner_pretty.js:603209 | function |
| `Ujo` | `MAX_RETRIES_CAP` (`15`) | cli_inner_pretty.js:603244 | constant |
| `_5f` | `DEFAULT_MAX_RETRIES` (`10`) | cli_inner_pretty.js:603243 | constant |
| `pZl` | `maxRetriesWarnedOnce` (one-time clamp-warning flag) | cli_inner_pretty.js:603261 | variable |
| `jHe` | `isRetryWatchdogEnabled` (`CLAUDE_CODE_RETRY_WATCHDOG`; carryover) | cli_inner_pretty.js:602803 | function |
| `vEf` *(183)* | `getMaxRetries` (183 predecessor; NO cap — returns user value verbatim) | cli_inner_pretty.js:591059 *(183)* | function |
| (watchdog gate) | retry-too-long abort guard (`!jHe() && x > T5f`) | cli_inner_pretty.js:603017 | variable |
