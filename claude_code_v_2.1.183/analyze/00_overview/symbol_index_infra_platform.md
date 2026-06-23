# Symbol Index — Platform Infrastructure (v2.1.156 → v2.1.183)

This index catalogs obfuscated → readable mappings for **platform infrastructure** symbols that changed between v2.1.156 and v2.1.183: MCP, Permissions, Sandbox, Auth, Model resolution/selection, Prompt building, Telemetry, and Remote Control.

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Compact, Auto Memory, Background Agents, Workflow, Agent Team / swarm
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands

## File:Line Format

For v2.1.183, the canonical source citation is `cli_inner_pretty.js:<line>` — `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). v2.1.156 / v2.1.88 citations are tagged as before-pictures.

## Per-feature symbol manifests

The exhaustive per-symbol tables live in the per-feature additions files (linked from [`symbol_index_core_features.md`](symbol_index_core_features.md)).

---

## Module: Agent Team — Backend Registry & Permission Bridge (platform-side)

The in-process-vs-pane execution-mode split and the permission bridge are platform infrastructure the agent-team feature depends on. The abstraction is **carried over unchanged** from v2.1.156 (only the tmux spawn mechanic changed — see [`symbol_index_core_features.md`](symbol_index_core_features.md), `a3n`). The exhaustive table is in [`symbol_additions_v2_1_183_agent_team.md`](symbol_additions_v2_1_183_agent_team.md) section 5.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `rWe` | `isInProcessEnabled` (in-process vs pane decision; v2.1.156 `ma`) | cli_inner_pretty.js:422425 | function |
| `Aje` | `getTeammateMode` (mode snapshot; `Hxe ?? "in-process"`) | cli_inner_pretty.js:293813 | function |
| `eLe` | `detectBackend` (tmux-inside / iTerm2 detection; emits `swarm_backend_detect`; v2.1.156 `jLH`) | cli_inner_pretty.js:422314 | function |
| `Wdo` | `markInProcessFallback` (sticky pane-failure fallback bit) | cli_inner_pretty.js:422419 | function |
| `_F` | `backendRegistry` (BackendRegistry singleton; v2.1.156 `NS`) | cli_inner_pretty.js:422467 | variable |
| `Ndo` | `TmuxBackend` (`type="tmux"`; pane create/respawn/kill; v2.1.156 `ZU6`) | cli_inner_pretty.js:421879 | class |
| `eDp` | `createTeammateCanUseTool` (permission bridge; ask→dialog-or-mailbox; v2.1.156 `OT_`) | cli_inner_pretty.js:420713 | function |
| `Vdo` | `getCurrentBackend` (`(await eLe()).backend` resolver; NEW name, carryover behavior) | cli_inner_pretty.js:422480 | function |
| `rqa` | `injectCommandIntoPane` (delegate onto `backend.sendCommandToPane(paneId, command, !insideTmux)`) | cli_inner_pretty.js:422493 | function |

## Module: Compact — Model Context Window / Rate-Limit / Fallback-Model (1M-credits clamp)

The model-cap, rate-limit-mapper, and fallback-model-chain symbols the compaction delta cross-links to the Model/rate-limit platform surface. Canonical exhaustive home: [`symbol_additions_v2_1_183_compact.md`](symbol_additions_v2_1_183_compact.md) (DELTA 1 / DELTA 2). The threshold/window/precompute/dispatcher rows stay under **Module: Compact** in [`symbol_index_core_features.md`](symbol_index_core_features.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ati` | `getMaxContextTokensOverride` (`CLAUDE_CODE_MAX_CONTEXT_TOKENS`, honored only when `DISABLE_COMPACT` truthy; extracted from v2.1.156 `Ov`) | cli_inner_pretty.js:134111 | function |
| `DFi` | `is1mCreditsApiError` (NEW DELTA 2: reactive-lane detector for a 1M-credits summarize failure; anchors reactive token gap at `jQ`) | cli_inner_pretty.js:229611 | function |
| `MBn` | `isThinkingEnabledForModel` (clientdata `cedar_lagoon` per-model thinking gate consulted inside the `del` fallback loop) | cli_inner_pretty.js:368570 | function |
| `Ot.longContext1mCreditsBlocked` | `SESSION.longContext1mCreditsBlocked` (NEW DELTA 2: session-global boolean; true once a credits-required 1M 429 is seen; init @2624) | cli_inner_pretty.js:2624 | variable |
| `SAi` | `resolveFallbackModelChain` (resolves `--fallback-model`/`settings.fallbackModel` into a deduped chain capped at `xJu`=3; the 2.1.166 setting the compact loop honors) | cli_inner_pretty.js:149264 | function |
| `XHe` | `isSmallerWindow` (window-size comparator used by `ICn`'s chain filter; calls `tH`) | cli_inner_pretty.js:102376 | function |
| `gti` | `rawModelWindow` (raw per-model window — `1e6` for `[1m]`/header/family, else `mxt`; extracted from v2.1.156 `Ov`) | cli_inner_pretty.js:134121 | function |
| `mxt` | `DEFAULT_WINDOW` (`200000` default model context window; numerically equal to `jQ`, distinct meaning) | cli_inner_pretty.js:134191 | constant |
| `x_` | `displayModelName` (model display formatter; used in the `tengu_model_fallback_triggered` payload) | cli_inner_pretty.js:145276 | function |
| `xJu` | `MAX_FALLBACK_MODELS` (`3` — cap on the `--fallback-model` chain length) | cli_inner_pretty.js:149325 | constant |

## Module: Workflow — Effort / Permissions / Server-Fallback Classification

The effort-system, permission-rule-lookup, write-isolation guard, and server-fallback abort-classification helpers the Workflow tool consumes. Canonical exhaustive home: [`symbol_additions_v2_1_183_workflow.md`](symbol_additions_v2_1_183_workflow.md) ("Effort / ultracode system", "Runtime spawn / attribution fixes"). The `/effort ultracode` xhigh gating (`T4`) is a **framing trap** — pre-existing as v2.1.156 `Vx`, NOT a 156→183 delta.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `T4` | `isUltracodeOption` (`Pw() && (e === void 0 \|\| hTe(e))`; gates `/effort ultracode`; FRAMING TRAP, v2.1.156 `Vx`) | cli_inner_pretty.js:148898 | function |
| `Vte` | `lookupPermissionRules` (collect allow/deny/ask rules for a tool into `Map<ruleContent, rule>`; v2.1.156 `d6H`) | cli_inner_pretty.js:585562 | function |
| `Xct` | `checkWorktreeWriteIsolation` (write-isolation guard; agent-level branch now reachable for workflow subagents; v2.1.156 @346662) | cli_inner_pretty.js:389676 | function |
| `ZQ` | `resolveEffort` (resolves effort; downgrades `"xhigh"`→`"high"` on non-xhigh models; v2.1.156 `or`) | cli_inner_pretty.js:148967 | function |
| `eZ` | `isWorkflowKeywordOrUltracodeEffort` (`n === true && Pw() && ZQ(e,t) === "xhigh"`; v2.1.156 `ar`) | cli_inner_pretty.js:148901 | function |
| `hTe` | `supportsXhighEffort` (xhigh-capable model check; fable-5/mythos-5/opus-4-8/4-7; v2.1.156 `ycH`) | cli_inner_pretty.js:148878 | function |
| `rB` | `parseEffort` / `normalizeEffort` (effort normalizer; NEW use: read by `agent()`'s per-call `effort` opt @417123) | cli_inner_pretty.js:148923 | function |
| `wpe` | `worktreeCwdRetryWrapper` (`e7c(e ?? Pt(), t)` cwd-scoped retry wrapper; UNCHANGED; v2.1.156 `x7H`) | cli_inner_pretty.js:46250 | function |
| `zCe` | `isRetractedByServerFallback` (`signal.aborted && uMt(signal.reason) === Hqr`; the errorCode-7 abort-reason predicate) | cli_inner_pretty.js:227026 | function |

## Module: Background Agents — Provider-Auth / Model-Override env lists (worker env-isolation)

The provider auth/config env-var lists and host-auth classifier the 2.1.181 worker-env scrub (`_Fl`) deletes. Canonical exhaustive home: [`symbol_additions_v2_1_183_background_agents.md`](symbol_additions_v2_1_183_background_agents.md) ("Worker env-isolation"). The builders `_Fl`/`YGf`/`WLo` and the scrub lists `jLo`/`GLo` stay under **Module: Background Agents** in [`symbol_index_core_features.md`](symbol_index_core_features.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `C3r` | `PROVIDER_BASE_URLS` (the eight provider base-URL vars; composes into `GLo`) | cli_inner_pretty.js:191662 | variable |
| `I3r` | `PROVIDER_SKIP_AUTH_FLAGS` (five `CLAUDE_CODE_SKIP_*_AUTH` flags; composes into `GLo`) | cli_inner_pretty.js:191681 | variable |
| `JLt` | `VERTEX_REGION_PREFIXES` (NEW: `["VERTEX_REGION_CLAUDE_"]`; pass-3 prefix scrub) | cli_inner_pretty.js:191730 | variable |
| `X0i` | `isHostAuthVar` (general host-auth-var classifier reusing the `JLt` vertex prefix) | cli_inner_pretty.js:191641 | function |
| `XLt` | `HOST_AUTH_TOKEN_SET` (NEW: resolved-token class deleted unconditionally under host-managed auth) | cli_inner_pretty.js:191672 | variable |
| `Y0i` | `CUSTOM_MODEL_OPTION_VARS` (`ANTHROPIC_CUSTOM_MODEL_OPTION[...]` family; constituent of `k3r`) | cli_inner_pretty.js:191710 | variable |
| `YLt` | `PROVIDER_SELECT_VARS` (provider-selection flags + resource ids; composes into `GLo`) | cli_inner_pretty.js:191650 | variable |
| `k3r` | `MODEL_OVERRIDE_VARS` (`[...x3r, ...Y0i]` — model-name override family; composes into `GLo`) | cli_inner_pretty.js:192032 | variable |
| `st` | `parseBoolean` (`"1"/"true"/"yes"/"on"` truthiness helper used by `isHostManagedAuth`) | cli_inner_pretty.js:163 | function |
| `x3r` | `MODEL_DEFAULT_VARS` (`ANTHROPIC_DEFAULT_*_MODEL[...]` / `ANTHROPIC_SMALL_FAST_MODEL` / `CLAUDE_CODE_SUBAGENT_MODEL` family; constituent of `k3r`) | cli_inner_pretty.js:191688 | variable |

## Module: Compact — Telemetry / Tracing helpers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `D$t` | `openTracingSpan` (starts the `'claude_code.compaction'` OTEL span; no-op unless telemetry enabled; call site @460682; v2.1.156 `xP$`) | cli_inner_pretty.js:278166 | function |
| `Rt` | `logFeatureSad` (emits `tengu_feature_sad{feature_name, error_code, …}`; used by the `Yjp` overflow probe + rapid-refill breaker; v2.1.156 `t$`) | cli_inner_pretty.js:44575 | function |

## Module: Remote Control (coordinator cross-session peers)

Coordinator mode's cross-session peers use the Remote Control transport (`uds:` same-machine, `bridge:` cross-machine). The socket-address parsing/validation symbols are catalogued under the Agent Team module in [`symbol_index_core_features.md`](symbol_index_core_features.md) (`LLa`, `Lhe`). For the v2.1.143→v2.1.156 platform baseline, see the v2.1.156 tree's [`symbol_index_infra_platform.md`](../../../claude_code_v_2.1.156/analyze/00_overview/symbol_index_infra_platform.md).
