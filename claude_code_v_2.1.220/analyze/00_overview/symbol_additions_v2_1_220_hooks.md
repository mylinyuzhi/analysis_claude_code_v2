# Symbol additions — v2.1.220, theme `hooks`

Staged for merge. **Every group below belongs in `symbol_index_core_features.md`** (hooks is a
core-feature theme per [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §6). Merge each `## Module:` block
into the matching module section of that file, creating the section if absent, and keep rows
alphabetical by the Obfuscated column inside each section.

All `File:Line` values are `cli_inner_pretty.js` line numbers in the **2.1.220** bundle
(`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`) that were read during
this pass. Rows tagged `(193)` in a description refer to the baseline bundle and are never used as the
File:Line value.

Readable names marked **[export-table]** were recovered from the bundle's own `tt(...)` export objects
(`:519450-519516` for the hooks module, `:528013` and `:535846-535865` for the permission/trust
helpers, `:516567`, `:55486`, `:2371`, `:2447`) and are therefore the *real* upstream identifiers, not
reconstructions.

Source documents: [`../41_hooks/README.md`](../41_hooks/README.md),
[`../41_hooks/directory_added_hook.md`](../41_hooks/directory_added_hook.md),
[`../41_hooks/matching_and_exit_codes.md`](../41_hooks/matching_and_exit_codes.md),
[`../41_hooks/hook_trust_and_origin.md`](../41_hooks/hook_trust_and_origin.md).

---

## Module: Hooks — registry and event surface

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AF_` | `HOOK_EVENT_REGISTRY` **[export-table]** (event → dispatcher, 31 keys) | cli_inner_pretty.js:519419 | object |
| `auE` | `DIRECTORY_ADDED_HOOK_INPUT_SCHEMA` (SDK zod, `directory` + `source`) | cli_inner_pretty.js:835978 | object |
| `CF_` | `HOOK_PROGRESS_TICK_MS` (`300`) | cli_inner_pretty.js:521999 | constant |
| `Hm` | `DEFAULT_HOOK_TIMEOUT_MS` (`600000`; carryover, `tp` :396991 (193)) | cli_inner_pretty.js:317052 | constant |
| `kF_` | `TOOL_MATCHED_HOOK_EVENTS` (5 events whose match query is a tool name) | cli_inner_pretty.js:522101 | constant |
| `lB` | `HOOK_EVENT_NAMES` (31-entry master enum; `DirectoryAdded` at :49396) | cli_inner_pretty.js:49367 | constant |
| `LF_` | `MAX_HOOK_PLUGIN_METRICS` (`20`) | cli_inner_pretty.js:522002 | constant |
| `o3r` | `HOOK_IF_CONDITION_SCHEMA` (zod; description carryover 1/1) | cli_inner_pretty.js:58703 | object |
| `P2o` | `SESSION_END_HOOK_TIMEOUT_MS_DEFAULT` **[export-table]** (`1500`) | cli_inner_pretty.js:521995 | constant |
| `TCu` | `MAX_INLINE_HOOK_OUTPUT_CHARS` (`1e4`) | cli_inner_pretty.js:215345 | constant |
| `uHh` | `buildHookConfigSchemas` (command/prompt/mcp_tool/http/agent union) | cli_inner_pretty.js:58550 | function |
| `wF_` | `HOOK_HTTP_TIMEOUT_MS` (`60000`) | cli_inner_pretty.js:521996 | constant |
| `xF_` | `LIST_FORM_MATCHER_EVENTS` (19 events; `DirectoryAdded` at :522099) | cli_inner_pretty.js:522080 | constant |
| `_ip` | `ASYNC_REWAKE_FLUSH_TIMEOUT_MS` **[export-table]** (`30000`) | cli_inner_pretty.js:521998 | constant |

## Module: Hooks — dispatchers

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `a2t` | `executeDirectoryAddedHooks` **[export-table]** (NET-NEW `.219`) | cli_inner_pretty.js:518817 | function |
| `Atn` | `executeFileChangedHooks` **[export-table]** | cli_inner_pretty.js:518900 | function |
| `grn` | `executeSessionStartHooks` **[export-table]** | cli_inner_pretty.js:518956 | function |
| `HBe` | `runSessionStartHooks` (orchestrator; `"fork"` source at :320414) | cli_inner_pretty.js:319521 | function |
| `Kon` | `executeSubagentStartHooks` **[export-table]** | cli_inner_pretty.js:518985 | function |
| `oOt` | `executeElicitationHooks` **[export-table]** | cli_inner_pretty.js:518826 | function |
| `slt` | `executeConfigChangeHooks` **[export-table]** | cli_inner_pretty.js:518808 | function |
| `VEe` | `executeStopHooks` **[export-table]** (also `SubagentStop`) | cli_inner_pretty.js:519231 | function |
| `VOt` | `executePreToolHooks` **[export-table]** | cli_inner_pretty.js:317054 | function |
| `vtn` | `executeCwdChangedHooks` **[export-table]** | cli_inner_pretty.js:518896 | function |
| `yrn` | `executeSetupHooks` **[export-table]** | cli_inner_pretty.js:518974 | function |
| `_nd` | `runSetupHooks` (orchestrator; `Pur` call at :319604) | cli_inner_pretty.js:319581 | function |

## Module: Hooks — selection (matcher and `if:`)

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DF_` | `collectHooksForEvent` (managed → settings → plugin → session registry) | cli_inner_pretty.js:520317 | function |
| `E4` | `hasHookForEvent` **[export-table]** | cli_inner_pretty.js:520347 | function |
| `Efn` | `hookDedupKeyPrefix` (`pluginRoot\|skillRoot` + `\x00`) | cli_inner_pretty.js:520261 | function |
| `Eip` | `isBareMcpServerMatcher` **[export-table]** (NET-NEW `.195`) | cli_inner_pretty.js:520197 | function |
| `HF_` | `warnIfBareMcpServerMatcher` (NET-NEW `.195`; `See CHANGELOG v2.1.195` :520215) | cli_inner_pretty.js:520204 | function |
| `ij` | `canonicalToolName` (legacy tool-name alias map `bMi`) | cli_inner_pretty.js:60285 | function |
| `IF_` | `hookMatcherMatches` (list-form vs unanchored-regex; class at :520221) | cli_inner_pretty.js:520219 | function |
| `JEi` | `getBareMcpServerMatchersWarned` **[export-table]** (session Set) | cli_inner_pretty.js:3758 | function |
| `pWn` | `expandToolAliases` (adds the session alias for a tool) | cli_inner_pretty.js:60293 | function |
| `q8s` | `getMatchingHooks` **[export-table]** (match-query switch :520364-520417) | cli_inner_pretty.js:520359 | function |
| `RF_` | `buildRuleContentMatcher` (`undefined` for non-tool events → hook skipped) | cli_inner_pretty.js:520238 | function |
| `S7t` | `reverseSessionAliases` | cli_inner_pretty.js:60297 | function |
| `Tip` | `countHooksByType` | cli_inner_pretty.js:520312 | function |
| `uWn` | `legacyAliasesOf` | cli_inner_pretty.js:60288 | function |
| `V2o` | `isFirstPartyPluginId` (`@`-suffix + `Lw` check) | cli_inner_pretty.js:520264 | function |
| `vip` | `isInternalCallbackHook` | cli_inner_pretty.js:520258 | function |
| `W8s` | `getPluginHookCounts` **[export-table]** | cli_inner_pretty.js:520271 | function |

## Module: Hooks — execution and result handling

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$F_` | `rewritePlaceholdersForPowerShell` (`${VAR}` → `${env:VAR}`) | cli_inner_pretty.js:521987 | function |
| `Afn` | `getUserPromptSubmitHookBlockingMessage` **[export-table]** | cli_inner_pretty.js:520564 | function |
| `bOs` | `getPreToolHookBlockingMessage` **[export-table]** | cli_inner_pretty.js:520536 | function |
| `bVy` | `PRE_TOOL_HOOK_TIMEOUT_STOP_REASON` (NET-NEW `.212`) | cli_inner_pretty.js:401111 | constant |
| `Cke` | `isAsyncHookResponse` | cli_inner_pretty.js:215213 | function |
| `EM` | `executeHooksOutsideREPL` **[export-table]** (batch; trust gate at :521559) | cli_inner_pretty.js:521555 | function |
| `FW` | `hookStatusLabel` (`statusMessage` ?? `describeHook`) | cli_inner_pretty.js:215877 | function |
| `HB` | `isSyncHookResponse` | cli_inner_pretty.js:215210 | function |
| `jYe` | `persistHookOutput` **[export-table]** (spill over `TCu` = 1e4) | cli_inner_pretty.js:519669 | function |
| `lM` | `executeHooks` **[export-table]** (streaming generator) | cli_inner_pretty.js:520573 | function |
| `MF_` | `invokeSdkCallbackHook` | cli_inner_pretty.js:521937 | function |
| `mip` | `hasSurfacedHookSpawnFailure` (once per `<event>:<command>`; NET-NEW) | cli_inner_pretty.js:520567 | function |
| `Mzg` | `HOOK_JSON_OUTPUT_SCHEMA` (zod; `continue`/`stopReason`/`hookSpecificOutput`) | cli_inner_pretty.js:215221 | object |
| `PF_` | `invokeFunctionHook` | cli_inner_pretty.js:521900 | function |
| `Pur` | `getNonBlockableHookErrorMessage` **[export-table]** (NET-NEW `.199`) | cli_inner_pretty.js:520551 | function |
| `pxu` | `salvageAsyncHookJson` (NET-NEW, undocumented; call site :216813) | cli_inner_pretty.js:216665 | function |
| `q2o` | `spawnHookCommand` (env build, exec-vs-shell, `child_process.spawn`) | cli_inner_pretty.js:519921 | function |
| `qUe` | `emitHookMetrics` **[export-table]** | cli_inner_pretty.js:520303 | function |
| `rSe` | `describeHook` (command/prompt/agent/http/mcp_tool renderer) | cli_inner_pretty.js:215859 | function |
| `Sip` | `parseHttpHookBody` (empty body → `{}`) | cli_inner_pretty.js:519710 | function |
| `TN` | `recordHookOutcome` | cli_inner_pretty.js:216615 | function |
| `UAd` | `PRE_TOOL_HOOK_ERROR_STOP_REASON` (NET-NEW `.212`) | cli_inner_pretty.js:401113 | constant |
| `vfn` | `applyHookJsonOutput` (maps validated JSON onto the result record) | cli_inner_pretty.js:519729 | function |
| `W2o` | `parseHookStdout` (JSON parse + zod + expected-schema dump :519700) | cli_inner_pretty.js:519695 | function |
| `wlt` | `getHookJsonOutputSchema` (memoised `Mzg`) | cli_inner_pretty.js:215334 | variable |
| `yan` | `runPreToolUseHooks` (the `.212` error-attribution catch chain :401044-401107) | cli_inner_pretty.js:400931 | function |

## Module: Hooks — trust and origin

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$To` | `hasAnyFrontmatterHooks` (deep emptiness test over `lB`) | cli_inner_pretty.js:342071 | function |
| `Add` | `registerFrontmatterHooks` (byte-identical to `VKa` :382414 (193)) | cli_inner_pretty.js:342080 | function |
| `Edd` | `escapeInvisibles` (C1 / `\p{Cf}` / U+2028-9 → `\uXXXX`) | cli_inner_pretty.js:342039 | function |
| `GYe` | `shouldSkipHookDueToTrust` **[export-table]** (session gate; 7/7 carryover) | cli_inner_pretty.js:519618 | function |
| `gzg` | `ALWAYS_TRUSTED_SETTING_SOURCES` (plugin/policySettings/built-in/builtin/bundled) | cli_inner_pretty.js:214491 | constant |
| `lor` | `wouldSubstituteUserConfig` (fail-closed: bare `catch` returns true) | cli_inner_pretty.js:214417 | function |
| `MTo` | `isAgentHookOriginTrusted` (NET-NEW `.218`) | cli_inner_pretty.js:342023 | function |
| `m_` | `scrubControlChars` (`\p{Cc}\p{Cf}` runs → space) | cli_inner_pretty.js:217537 | function |
| `OTo` | `logAgentHooksOriginUntrusted` (NET-NEW `.218`; gate at :342054) | cli_inner_pretty.js:342046 | function |
| `owt` | `applyMainThreadAgentHooks` (`OTo(e, "mainThread")` at :762237) | cli_inner_pretty.js:762226 | function |
| `sDt` | `substituteUserConfig` (textual replace; throws on unset option) | cli_inner_pretty.js:214407 | function |
| `U$y` | `agentHookTrustKey` | cli_inner_pretty.js:342029 | function |
| `vdd` | `agentTrustRoot` (`<p>/.claude/agents` → `<p>`) | cli_inner_pretty.js:342033 | function |
| `vke` | `isAlwaysTrustedSource` | cli_inner_pretty.js:214485 | function |
| `wip` | `getAnthropicCredentialsForOfficialPluginHook` **[export-table]** | cli_inner_pretty.js:520295 | function |
| `YC` | `isStrictPluginOnlyCustomization` | cli_inner_pretty.js:214479 | function |

## Module: Hooks — `DirectoryAdded` call sites

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Axb` | `addDirectoryCommandCall` (`/add-dir`; hook dispatch :655138) | cli_inner_pretty.js:655118 | function |
| `bs` | `startKeepAlive` (30 s `keep_alive` frames; wraps the SDK hook dispatch) | cli_inner_pretty.js:847193 | function |
| `ke` | `handleRegisterRepoRoot` (3 pre-conditions; hook dispatch :847256) | cli_inner_pretty.js:847216 | function |
| `ZYp` | `addDirectoryErrorView` (`/add-dir` failure JSX) | cli_inner_pretty.js:655097 | function |

## Module: Hooks — shared helpers referenced from hook docs

> Merge into: `symbol_index_core_features.md` (cross-referenced from platform themes)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cv` | `globalConfigPath` (`~/.claude.json` or `CLAUDE_CONFIG_DIR`) | cli_inner_pretty.js:30751 | variable |
| `Cze` | `matchesPathRule` **[export-table]** (hook `if:`; `yap(gap(n), !0)` at :528541) | cli_inner_pretty.js:528537 | function |
| `Dpr` | `isPathPersistedTrusted` **[export-table]** | cli_inner_pretty.js:535961 | function |
| `fg` | `parsePermissionRuleString` (`Tool(content)` → `{toolName, ruleContent}`) | cli_inner_pretty.js:60333 | function |
| `gap` | `sanitizeGitignoreSigils` (collapse `//`; escape BOM-prefixed `!`/`#`) | cli_inner_pretty.js:528448 | function |
| `gu` | `findCanonicalGitRoot` **[export-table]** | cli_inner_pretty.js:56190 | variable |
| `Ip` | `isCancellationError` (4-way: `tl`/`xy`/`AbortError`/`__CANCEL__`) | cli_inner_pretty.js:19577 | function |
| `jon` | `getPersistedTrustKeyForPath` **[export-table]** | cli_inner_pretty.js:535968 | function |
| `qOe` | `normalizePathSeparators` | cli_inner_pretty.js:51883 | function |
| `Txe` | `isProjectScopeTrustAccepted` **[export-table]** (non-interactive ⇒ true) | cli_inner_pretty.js:535955 | function |
| `Va` | `createAttachmentMessage` **[export-table]** | cli_inner_pretty.js:516567 | function |
| `vB` | `isWorkspacePersistedTrusted` **[export-table]** | cli_inner_pretty.js:535958 | function |
| `wW` | `getWorkspacePersistedTrustKey` **[export-table]** | cli_inner_pretty.js:535965 | function |
| `yE` | `ControlStreamClosedError` (`class yE extends tl {}`) | cli_inner_pretty.js:19767 | class |
| `yn` | `isNonInteractiveSession` | cli_inner_pretty.js:3286 | function |

---

## Notes for the merger

- `Va` (`createAttachmentMessage`), `Cze` (`matchesPathRule`), `gap`, and `Ip` are also referenced by
  `38_permissions` and `04_tools`. If a row already exists there under a different readable name, keep
  the **export-table** name (`createAttachmentMessage`, `matchesPathRule`) — it is the upstream one,
  recovered from `:516567` and `:528013`.
- `bs` and `ke` are **locally-scoped function expressions inside the SDK control-request module**
  (`:847188-847285`), not module-level declarations. Their obfuscated names are only meaningful within
  that scope; cite them by line, not by name.
- `Hm` (`600000`) has a 2.1.193 twin under the id `tp` at `:396991 (193)` — the *value* is carryover and
  the *identifier* was re-mangled. Do not record it as a delta (`_CONVENTIONS` trap #1).
- Rows marked `NET-NEW <ver>` were confirmed `220>0 / 193=0` on a distinguishing literal, listed in the
  per-bullet ledger of [`../41_hooks/README.md`](../41_hooks/README.md).
