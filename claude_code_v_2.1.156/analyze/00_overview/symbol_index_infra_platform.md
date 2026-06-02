# Symbol Index — Platform Infrastructure (v2.1.143 → v2.1.156)

This index catalogs obfuscated → readable mappings for the **platform infrastructure** symbols introduced or changed between v2.1.143 and v2.1.156. Scope: MCP (managed-policy validation), Permissions (auto-mode safety classifier, dangerous-path correctness, command-parser bypass closures, mode/consent surface), Sandbox (TMPDIR canonicalization), Auth, Model provider mapping / normalization / resolution / pricing / Fast-Mode / 1M-context, Prompt-platform (lean-vs-full gate + shared provider/env helpers), Telemetry.

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State, System Prompts (assembler / section cache / section builders / tool descriptions), Workflow coordinator + tool factory
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Plan, Background Agents, Todo, Compact, Hooks, Skills, Thinking / **Effort** (capability gates, resolver, launch latch, `ultracode`, `/effort` UI), Steering, CLI, **Dynamic Workflows**
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome/Browser, IDE, UI Components, Plugin, Code Indexing, Shell Parser, Slash Commands

## File:Line Format

For v2.1.156 the canonical source citation is the single pretty-printed bundle:

```
cli_inner_pretty.js:<line>    (/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js)
```

Unlike the v2.1.142 tree (which also exposed stable per-decl `cli_unpack_pretty/decls/.../<id>.js` files), every row here cites the bundle line that was read to verify the mapping. Bun reorganizes the bundle between builds, so line numbers can shift — always re-grep the identifier if a line looks stale. Rows tagged `2.1.142 cli_inner_pretty.js:<line>` are cross-version precursors and intentionally point at the older bundle.

---

## Module: MCP — Managed-Server Policy Validation

NEW in v2.1.156: a single invalid `allowedMcpServers`/`deniedMcpServers` entry no longer drops all policy. Each entry is validated and filtered in place before whole-settings `safeParse`, with a per-entry `claude doctor` warning. Deny precedes allow in matching.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `fo8` | `mcpAllowEntrySchema` (lazily-built Zod schema for one `allowedMcpServers` entry; allow-entry companion to `Oo8`) | cli_inner_pretty.js:52016 | function |
| `kb` | `collectSettingsWarnings` (aggregator concatenating permission, hooks, and MCP-policy sanitizer warnings; runs before whole-settings `safeParse`) | cli_inner_pretty.js:52403 | function |
| `NN7` | `isMcpServerDenied` (denylist matcher; consulted first so deny precedes allow) | cli_inner_pretty.js:275185 | function |
| `Oo8` | `mcpDenyEntrySchema` (lazily-built Zod schema for one `deniedMcpServers` entry; exactly one of serverName/serverCommand/serverUrl) | cli_inner_pretty.js:52043 | function |
| `T71` | `mcpServerPolicyKeys` (`[{key:"allowedMcpServers",schema:fo8},{key:"deniedMcpServers",schema:Oo8}]` table driving `validateMcpServerPolicyEntries`) | cli_inner_pretty.js:52417 | variable |
| `V71` | `validateMcpServerPolicyEntries` (NEW per-entry validator filtering invalid `allowedMcpServers`/`deniedMcpServers` entries in place before whole-settings validation, emitting a per-entry warning) | cli_inner_pretty.js:52367 | function |
| `wJH` | `isMcpServerAllowed` (allowlist matcher; returns false up-front if denied — denylist precedence) | cli_inner_pretty.js:275201 | function |

`W71` (`filterInvalidPermissionRules`, permission sanitizer since 2.1.88) and `G71` (`filterInvalidHooks`, hooks sanitizer added in the 2.1.142 window) are the two pre-existing sanitizers concatenated by `kb`; they predate 2.1.156 and are documented as context in the module doc rather than added here.

---

## Module: Permissions — Auto-Mode Safety Classifier

NEW/changed in v2.1.156: the Data-Exfiltration HARD BLOCK rule rewrite + bulk-repo detection, the two-stage XML classifier (stage 1 = hard_deny gate, stage 2 = soft_deny + ALLOW + user intent), the stage-2 token-budget "could-not-evaluate" fix, the `SandboxNetworkAccess` injected-action / iron-gate path, the thinking-stripping verdict parser, and the telemetry/outcome emitters.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `<user_hard_deny_rules_to_replace>` | `dataExfiltrationHardDenyRule` (rewritten HARD BLOCK Data Exfiltration rule body: lead paragraph + 3 ordered provenance/path/destination checks + "Bulk scale is its own red flag") | cli_inner_pretty.js:276986 | constant |
| `$i5` | `isTwoStageClassifierEnabled` (predicate: `getTwoStageClassifierSetting()` is `true` / `"fast"` / `"thinking"`) | cli_inner_pretty.js:277911 | function |
| `an5` | `parseThinking` (extracts the first well-formed `<thinking>…</thinking>` body for telemetry; non-global, non-dangling regex) | cli_inner_pretty.js:277350 | function |
| `aY8` | `runSandboxNetworkClassifier` (wraps a `{host,port}` outbound attempt into a synthetic `SandboxNetworkAccess` assistant tool-use and classifies it; iron-gate fallback on unavailability) | cli_inner_pretty.js:277969 | function |
| `BE7` | `stripUnterminatedThinking` (strips both closed `<thinking>…</thinking>` pairs and a trailing unterminated `<thinking>` to EOF before block parsing) | cli_inner_pretty.js:277337 | function |
| `BP$` | `runSingleStageToolUseClassifier` (single-stage `tool_use`/`classify_result` classifier path; `max_tokens: 4096 + E`, unchanged in 2.1.156) | cli_inner_pretty.js:277689 | function |
| `en5` | `runTwoStageClassifier` (two-stage XML auto-mode classifier; holds the stage-2 `max_tokens: 8192 + V` budget at 277501) | cli_inner_pretty.js:277392 | function |
| `GE7` | `parseBlockReason` (extracts `<reason>…</reason>` text for the user-facing block message) | cli_inner_pretty.js:277345 | function |
| `hE6` | `IRON_GATE_TTL` (`1800000` ms = 30 min TTL for the `tengu_iron_gate_closed` fail-closed sandbox-egress gate) | cli_inner_pretty.js:277998 | constant |
| `in5` | `stage1HardDenyReminderFast` (stage-1 reminder for the fast path: "Err on the side of blocking. `<block>` immediately.") | cli_inner_pretty.js:277991 | constant |
| `NE7` | `SANDBOX_NETWORK_ACTION` (`"SandboxNetworkAccess"` — synthetic action name injected for sandboxed outbound connections) | cli_inner_pretty.js:277997 | constant |
| `on5` | `stage2ThinkingReminder` (stage-2 reminder; the 2.1.156 "Think for as long as needed … do not cut your reasoning short on hard cases" extension) | cli_inner_pretty.js:277995 | constant |
| `pE7` | `thinkingBudgetForModel` (returns `[false, 0]` for the classifier — no API extended-thinking, so the additive budget term `V`/`E` is always 0) | cli_inner_pretty.js:277389 | function |
| `rn5` | `stage1HardDenyReminderTwoStage` (stage-1 reminder for the 2-stage "both" path: "Stage 1 does NOT apply user intent or ALLOW exceptions") | cli_inner_pretty.js:277993 | constant |
| `rY8` | `classifierCouldNotEvaluateReason` (fail-closed reason builder: always returns "Auto mode could not evaluate this action and is blocking it for safety — run with --debug for details"; params ignored) | cli_inner_pretty.js:277918 | function |
| `UE7` | `getTwoStageClassifierSetting` (reads `tengu_auto_mode_config.twoStageClassifier`, default `true`) | cli_inner_pretty.js:277908 | function |
| `vc` | `emitClassifierOutcome` (telemetry emitter: maps outcome → SLI counters + the `tengu_auto_mode_outcome` event, carrying `failureKind`) | cli_inner_pretty.js:277921 | function |
| `vE6` | `classifierRequestWithStallMonitor` (classifier request wrapper that drives the stall watchdog and counts fetch attempts) | cli_inner_pretty.js:277677 | function |
| `xE7` | `toClassifierInput` (renders a transcript entry, including injected actions, into classifier input via the per-action descriptor map) | cli_inner_pretty.js:277203 | function |
| `yE6` | `makeAssistantToolUse` (builds an `{role:"assistant", content:[{type:"tool_use", name, input}]}` synthetic action for the classifier) | cli_inner_pretty.js:277966 | function |
| `ZE7` | `parseBlockDecision` (parses `<block>yes\|no` after stripping thinking; returns `null` when no block tag is present — fail-closed; also seen named `parseVerdict`) | cli_inner_pretty.js:277340 | function |

---

## Module: Permissions — Auto-Mode Gate & State

The runtime auto-mode gate (no longer consults opt-in consent in v2.1.152+) and the circuit-breaker / config-disable checks. Tri-state resolver, the VSCode `opt-in → enabled` bridge, and the Shift+Tab cycle gate.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `h0` | `isAutoModeGateEnabled` (runtime auto-mode gate: circuit-breaker + settings-disable + model support; does NOT consult opt-in consent) | cli_inner_pretty.js:443051 | function |
| `IL5` | `isAutoModeConfigDisabled` (circuit-breaker check; true only when config `enabled === "disabled"`, using the `H87` sentinel to distinguish cold cache) | cli_inner_pretty.js:185018 | function |
| `kV5` | `resolveAutoModeEnabledState` (tri-state config resolver returning `enabled`/`disabled`/`opt-in`; default `opt-in`) | cli_inner_pretty.js:211657 | function |
| `PR8` | `canCycleToAuto` (gate for whether Shift+Tab can reach auto mode; `isAutoModeAvailable && h0() && !i4q()`, no consent precondition) | cli_inner_pretty.js:578696 | function |
| `y97` | `sendVscodeExperimentGates` (VSCode bridge pushing `experiment_gates`; maps `opt-in` → `enabled` for `tengu_auto_mode_state` so the picker surfaces auto mode without bypass-permissions) | cli_inner_pretty.js:211664 | function |

---

## Module: Permissions — Mode / Consent UI Surface

The in-flow opt-in dialog and the Shift+Tab mode-cycle state machine + 800ms consent debounce. (These are React/PromptInput-layer symbols that drive the permission *mode* surface; filed here because the consent gate is a permission-policy behavior. A future pass may mirror the pure-UI components into `symbol_index_infra_integration.md`.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `consentDebounceCancelRef` (`H1`) | `consentDebounceCancelRef` (`useRef` holding the 800ms opt-in-dialog timer's cancel function) | cli_inner_pretty.js:584571 | variable |
| `hm` | `handleAutoModeOptInDecline` (decline handler: clears pending consent, tears down the dialog/timer, does NOT exit the process) | cli_inner_pretty.js:585448 | function |
| `iC` | `handleAutoModeAccept` (accept handler: clears dialog, commits `toolPermissionContext` mode `auto`, emits `mode_auto_enter`) | cli_inner_pretty.js:585430 | function |
| `QCH` | `cycleNextMode` (Shift+Tab mode-cycle state machine: default → acceptEdits → plan → (bypass\|auto) → default) | cli_inner_pretty.js:578712 | function |
| `r4q` | `AutoModeOptInDialog` (the in-flow opt-in dialog component; four actions, each emitting a `tengu_auto_mode_opt_in_dialog_*` event) | cli_inner_pretty.js:578742 | function |
| `ym` | `handleCycleMode` (PromptInput Shift+Tab handler; arms the 800ms consent debounce before showing the opt-in dialog) | cli_inner_pretty.js:585340 | function |

---

## Module: Permissions — Dangerous-Path Correctness

CHANGED in v2.1.156: `rm -rf $HOME` trailing-slash + case fix. The predicate now trailing-slash-normalizes BOTH the candidate and the homedir and compares case-folded.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `gG8` | `extractPowershellRemovalPath` (resolves a PowerShell `Remove-Item` argument to an absolute path, then defers to `isDangerousRemovalTarget`) | cli_inner_pretty.js:418371 | function |
| `nUH` | `isDangerousRemovalTarget_2_1_142` (PRECURSOR, separate build — pre-fix predicate that stripped the trailing slash from the candidate only and compared raw) | 2.1.142 cli_inner_pretty.js:207091 | function |
| `OJ` | `toLowerCase` (`H.toLowerCase()` — case-folder used for case-insensitive path comparison in the dangerous-removal predicate and PowerShell cwd checks; shared util) | cli_inner_pretty.js:549400 | function |
| `PH$` | `denyProtectedSystemPath` (builds the `behavior:"deny"` verdict for a protected removal target) | cli_inner_pretty.js:418378 | function |
| `PlH` | `isDangerousRemovalTarget` (predicate flagging a resolved path as a protected delete target; 2.1.156 trailing-slash-normalizes BOTH candidate and homedir and compares via `OJ`) | cli_inner_pretty.js:211484 | function |

---

## Module: Permissions — Command-Parser Bypass Closures

CHANGED in v2.1.149/v2.1.145: PowerShell built-in `cd` (bareword/drive-switch) detection and the Bash bare variable-assignment auto-approve closure. A bare `VAR=val` no longer slips through the read-only auto-allow gate; PowerShell `cd..`/`cd\`/`X:` forms are caught before alias resolution.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_v$` | `isCwdChangingCmdlet` (PowerShell cwd-change detector; 2.1.149 adds bareword `cd..`/`cd\`/`cd/`/`cd~` and drive-switch `X:` forms before alias resolution) | cli_inner_pretty.js:417684 | function |
| `dP6` | `parseCommand` (async tree-sitter parse returning `{ rootNode, envVars, commandNode, originalCommand }`) | cli_inner_pretty.js:190366 | function |
| `EY` | `resolveToCanonical` (strips a trailing `.exe/.cmd/.bat/.com` suffix and resolves a PowerShell alias to its canonical Verb-Noun cmdlet name) | cli_inner_pretty.js:417677 | function |
| `kI8` | `getCommandPrefixStatic` (builds the auto-approve command prefix; returns `{ commandPrefix: null }` for an assignment-only command) | cli_inner_pretty.js:595513 | function |
| `KW5` | `collectLeadingAssignments` (collects leading `variable_assignment` text on a `command` node into `envVars`, stopping at the first `command_name`/`word`) | cli_inner_pretty.js:190408 | function |
| `LF_` | `hasNonAllowlistedAssignment` (leading-assignment env-var detector used by the read-only auto-allow gate; present byte-identical in 2.1.142 as `jA5`) | cli_inner_pretty.js:440619 | function |
| `MC_` | `validateCompoundPaths` (per-statement PowerShell path validator that pre-seeds an `ask` verdict when the compound changes cwd) | cli_inner_pretty.js:418618 | function |
| `MqH` | `powershellAliasMap` (alias→canonical PowerShell cmdlet lookup table consulted by `resolveToCanonical`) | cli_inner_pretty.js:417169 | variable |
| `nT5` | `parseSimpleCommandTree` (simple-command classifier; now emits `{ kind:"simple", commands, bareAssignmentNames }`) | cli_inner_pretty.js:207803 | function |
| `nz8` | `classifySimpleReadOnly` (read-only classifier; now routes a non-allowlisted bare assignment to `passthrough` → prompt) | cli_inner_pretty.js:242978 | function |
| `UcH` | `findCommandNode` (descends through a `variable_assignment` node to the following real command; returns `null` for an assignment-only command) | cli_inner_pretty.js:190389 | function |
| `V5H` | `isAllowlistedEnvVar` (membership test against the static safe env-var set `safeEnvVarSet`) | cli_inner_pretty.js:440527 | function |
| `wD$` | `extractCommandArguments` (extracts the effective `[cmd, ...args]` from a command/declaration node; skips `variable_assignment` children) | cli_inner_pretty.js:190416 | function |
| `WV5` | `driveRootRegex` (`/^[A-Za-z]:\/?$/` — matches `C:` / `C:/` Windows drive roots) | cli_inner_pretty.js:211576 | variable |
| `ZV5` | `driveRootChildRegex` (`/^[A-Za-z]:\/[^/]+$/` — matches `C:/Users`, `D:/data` single-segment drive-root children) | cli_inner_pretty.js:211576 | variable |

---

## Module: Permissions — Workflow scriptPath Security & Rule Lookup

Two platform-infra rows routed from the Workflow module: the shared UNC-path detector that hardens the workflow `scriptPath` read, and the generic per-tool permission-rule collector.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `d6H` | `lookupPermissionRules` (collect allow/deny/ask rules for a tool into a `Map<ruleContent, rule>`) | cli_inner_pretty.js:442061 | function |
| `tm` | `isUncPath` (`/^[\\/]{2}/` two-leading-slash UNC detector — shared path util, load-bearing for workflow `scriptPath` security) | cli_inner_pretty.js:8587 | function |

---

## Module: Sandbox — TMPDIR Canonicalization

CHANGED in v2.1.156: the `$TMPDIR` sandboxed-vs-unsandboxed unification. The per-uid tmp dir is realpath-canonicalized and the canonical path is substituted for the `$TMPDIR` token in the "Command sandbox" prompt section so sandboxed and unsandboxed commands resolve to the same directory.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aq` | `dedupe` (`[...new Set(H)]`; used by `g24` to dedupe the sandbox write-allowlist before `$TMPDIR` token substitution; shared util) | cli_inner_pretty.js:40716 | function |
| `g24` | `buildSandboxPromptSection` (builds the "Command sandbox" system-prompt section; substitutes the canonical tmp dir for the `$TMPDIR` token; carries the "for both sandboxed and unsandboxed commands" note) | cli_inner_pretty.js:438967 | function |
| `GJ5` | `assertSafeTmpDir` (owner/mode/symlink guard on the per-uid tmp dir: must be a real directory owned by the current uid; forces `0700`) | cli_inner_pretty.js:176739 | function |
| `hx` | `canonicalSandboxTmpDir` (memoized `realpathSync`-canonicalized per-uid sandbox tmp dir with trailing separator) | cli_inner_pretty.js:550128 | function |
| `McH` | `tmpFilePath` (builds a tmp file path under the sandbox tmp dir, hashing content or using a random UUID; shared util) | cli_inner_pretty.js:176767 | function |
| `uP8` | `runDeterminismShim` (`vm.runInContext(SZ_, ctx)` — injects the workflow `DETERMINISM_SHIM` program into a VM context; the workflow-VM sandbox hardening counterpart that disables `Math.random`/`Date`. Workflow-specific but filed under Sandbox; `SZ_`/`UtH`/`xK4`/`uK4` live in `symbol_index_core_features.md` Dynamic Workflows) | cli_inner_pretty.js:367442 | function |
| `vd` | `rawTmpDirRoot` (`CLAUDE_CODE_TMPDIR` env override or `os.tmpdir()`) | cli_inner_pretty.js:176735 | function |
| `VL` | `sandboxTmpDir` (creates/returns the per-uid `claude-<uid>` tmp directory, created `0700` and ownership/symlink-checked via `assertSafeTmpDir`) | cli_inner_pretty.js:176754 | function |
| `w9` | `extractTextBlocks` (concatenates the `text` blocks of a response's content array; non-empty whenever the model emitted prose; shared util consulted by the classifier paths) | cli_inner_pretty.js:445034 | function |

---

## Module: Model Selection — Provider Mapping, Normalization & Registry

The seven-provider `claude-opus-4-8` config object + registry wiring, the canonical-id reverse maps, the provider classifiers, and the model-id normalization waterfall. (Effort capability gates, the effort resolver, the launch latch, `ultracode`, and the `/effort` UI live in `symbol_index_core_features.md`; the slider-render UI helpers live in `symbol_index_infra_integration.md`.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `a3K` | `getBestModel` (`"best"` alias resolver; delegates to `TT`) | cli_inner_pretty.js:98717-98719 | function |
| `c7K` | `CANONICAL_ID_TO_KEY` (reverse map firstParty id → short registry key) | cli_inner_pretty.js:91851 | variable |
| `C0H` | `isOpus4xFamily` (membership over the opus-4-0/4-1/4-5/4-6/4-7/4-8 canonical set) | cli_inner_pretty.js:98690-98699 | function |
| `d7K` | `CANONICAL_MODEL_IDS` (`Object.values(j3).map(c => c.firstParty)`) | cli_inner_pretty.js:91850 | variable |
| `Gi$` | `resolveModelOverrideAlias` (reverse-map a user `modelOverrides` value back to its short key; used by `O7`/`normalizeModelId`) | cli_inner_pretty.js:91967-91977 | function |
| `HD` | `canonicalizeOpusModelId` (substring waterfall: any vendor/dated id → canonical `claude-…`; tolerates `[1m]`, strips trailing `-YYYYMMDD`) | cli_inner_pretty.js:98751-98769 | function |
| `j3` | `MODEL_CONFIG_REGISTRY` (short-key → config map; `opus48: Xi$` is the new key) | cli_inner_pretty.js:91835-91849 | object |
| `Ji$` | `OPUS_47_MODEL_CONFIG` (the 4.7 seven-provider block 4.8 was cloned from) | cli_inner_pretty.js:91815-91824 | object |
| `NN` | `getDefaultSonnetModel` (default Sonnet selector; `sonnet45` fallback on `!UA()`, else `sonnet46`) | cli_inner_pretty.js:98726-98730 | function |
| `O7` | `resolveModelCanonicalId` (a.k.a. `normalizeModelId`: override-alias `Gi$` → inference-profile ARN → `HD`) | cli_inner_pretty.js:98770-98778 | function |
| `oR` | `providerDefaultsEffortOn` (a.k.a. `isFirstPartyOrFoundryMantle`; provider class `{firstParty, anthropicAws, foundry, mantle}`) | cli_inner_pretty.js:91894-91896 | function |
| `rm8` | `getInferenceProfileBackingModel` (read cached Bedrock application-inference-profile → backing model) | cli_inner_pretty.js:3258-3260 | function |
| `Sh9` | `VERTEX_REGION_TABLE` (canonical id → Vertex region env-var; `claude-opus-4-8` row ordered newest-first) | cli_inner_pretty.js:3618-3632 | variable |
| `si` | `get3PModelCapabilityOverride` (memoized `ANTHROPIC_*_MODEL_SUPPORTED_CAPABILITIES` env reader; `undefined` for 1P) | cli_inner_pretty.js:130257-130275 | variable |
| `TT` | `getDefaultOpusModel` (default Opus: opus48 on firstParty, opus47 on anthropicAws/gateway, opus46 on 3P) | cli_inner_pretty.js:98720-98725 | function |
| `UA` | `isFirstPartyProvider` (provider class `{firstParty, anthropicAws, gateway}`; behind the lean gate's unknown-id fall-through and the launch-tier eligibility) | cli_inner_pretty.js:91891-91893 | function |
| `wZ` | `getCurrentModelId` (session-effective model id; threads `TT() + (VP()?"[1m]":"")`) | cli_inner_pretty.js:98741-98747 | function |
| `Xi$` | `OPUS_48_MODEL_CONFIG` (seven-provider id map for `claude-opus-4-8` + `eagerInputStreaming`) | cli_inner_pretty.js:91825-91833 | object |
| `Yz` | `getResolvedModelMap` (registry after applying user `modelOverrides`) | cli_inner_pretty.js:91986-91990 | function |
| `Zq` | `currentProvider` (resolves provider from env: bedrock/foundry/anthropicAws/mantle/vertex else firstParty) | cli_inner_pretty.js:91853-91864 | function |

---

## Module: Model Selection — Cost, Fast-Mode & 1M-Context

The per-Mtok cost tables, the dual-tier (2x / 6x) fast-mode pricing, the Fast-Mode availability machinery, and the per-model output-token ceilings. (Routed here per the `43_model_opus48` home-index note: model-resolution / pricing / fast-mode / 1M-context belong to Model Selection in the platform index.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BB` | `OPUS_STANDARD_COST` (input 5 / output 25 per Mtok — baseline 1x) | cli_inner_pretty.js:98526-98532 | constant |
| `bx1` | `OPUS_48_FAST_COST` (input 10 / output 50 — exactly 2x standard, Opus 4.8 fast) | cli_inner_pretty.js:98540-98546 | constant |
| `Cx1` | `OPUS_LEGACY_FAST_COST` (input 30 / output 150 — 6x standard, Opus 4.6/4.7 fast) | cli_inner_pretty.js:98533-98539 | constant |
| `I9` | `isFastModeEnabled` (firstParty provider AND `!CLAUDE_CODE_DISABLE_FAST_MODE` kill-switch) | cli_inner_pretty.js:98189-98192 | function |
| `jZ` | `isFastModeAvailable` (`I9() && Ne() === null`) | cli_inner_pretty.js:98196-98199 | function |
| `ki` | `isOpus46FastModeOverride` (reads deprecated `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE`, removal 06/01) | cli_inner_pretty.js:98240-98242 | function |
| `LMH` | `getMaxOutputTokens` (per-model `{default, upperLimit}`; Opus 4.8 → 64K/128K) | cli_inner_pretty.js:130194-130218 | function |
| `m76` | `getInitialFastModeSetting` (session-start fast-mode resolution; honors `fastModePerSessionOptIn`; calls `Wj`) | cli_inner_pretty.js:98249-98256 | function |
| `mUH` | `getFastModeModelId` (`"claude-opus-4-6"`/`"opus"` + optional `[1m]`) | cli_inner_pretty.js:98246-98248 | function |
| `mx1` | `resolveModelCost` (map model id + request speed → per-Mtok cost table; routes current Opus to fast pricing) | cli_inner_pretty.js:98467-98480 | function |
| `Ne` | `getFastModeUnavailableReason` (layered org/SDK/network reason string, or null = available) | cli_inner_pretty.js:98216-98238 | function |
| `S0H` | `selectFastModePricing` (fast on + `claude-opus-4-8` → `bx1`; else `Cx1`; else `BB`) | cli_inner_pretty.js:98451-98457 | function |
| `uB` | `getFastModeModelLabel` (`ki() ? "Opus 4.6" : "Opus 4.8"`) | cli_inner_pretty.js:98243-98245 | function |
| `Wj` | `isFastModeEligibleModel` (opus-4-6/4-7/4-8; narrowed to 4-6 under the override; guarded by `I9()`) | cli_inner_pretty.js:98257-98263 | function |
| `yx1` | `disabledReasonMessage` (org-status reason code → user-facing fast-mode string; `/usage-credits` rename) | cli_inner_pretty.js:98200-98215 | function |
| `zv` | `formatCost` (format a cost table as `"$X/$Y per Mtok"`) | cli_inner_pretty.js:98501-98503 | function |

---

## Module: Auth

OAuth login/logout/refresh, `apiKeyHelper`, Bedrock/Vertex/Foundry/Mantle provider auth.

*(No net-new Auth-only symbols surfaced in the v2.1.143 → v2.1.156 delta units routed to this index. The provider classifiers (`UA`, `oR`, `Zq`) and canonical-id resolvers (`O7`, `HD`) that auth paths consume are catalogued under **Model Selection — Provider Mapping** above. MCP-side OAuth refresh symbols are unchanged from the v2.1.142 tree; see that tree's `MCP — OAuth Refresh Defense` section.)*

Known themes for this window:

- Opus 4.8 provider id map adds the `mantle` / `gateway` / `anthropicAws` provider keys alongside firstParty/bedrock/vertex/foundry (`Xi$`).
- Bedrock application-inference-profile backing-model resolution (`rm8`) feeds canonical-id resolution before capability gating.

---

## Module: Prompt Building — Lean-vs-Full Gate

NEW in the v2.1.154 window: a per-model lean-vs-full system-prompt gate (the lean prompt is the default for all models EXCEPT Haiku, Sonnet, and Opus 4.7-and-earlier). The gate / provider-classifier / normalization / env-parser / memoize helpers are platform-infra; the assembler / section-cache / section-builder / tool-description / reminder rows live in `symbol_index_core_execution.md` (System Prompts).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `c45` | `isFullPromptModel` (static allow-list; `true` ⇒ keep FULL prompt: claude-3-*/haiku/sonnet/opus-4-0..4-7; `false` ⇒ lean for opus-4-8; unknown id → `!UA()`) | cli_inner_pretty.js:143847-143862 | function |
| `cKq` | `isSimplePromptMode` (`CLAUDE_CODE_SIMPLE` hard short-circuit → CWD+Date only; predates lean) | cli_inner_pretty.js:555588-555590 | function |
| `cx8` | `memoize` (lodash memoize definition; default cache key = first arg; shared util used to wrap `X3`) | cli_inner_pretty.js:1475-1486 | function |
| `d45` | `isForcedLeanModel` (server/growthbook force-lean: `clientDataCache.simple_system_prompt` OR `tengu_velvet_cascade.models`; additive-only) | cli_inner_pretty.js:143839-143845 | function |
| `Dv` | `initLeanPromptModule` (lazy module init that assigns the memoized `X3`) | cli_inner_pretty.js:143865-143877 | variable |
| `gM6` | `isEarlyAccessModel` (`/-eap($|\[)/i` raw-id test; checked before normalization to force lean-eligibility) | cli_inner_pretty.js:143836-143838 | function |
| `k4` | `parseBoolFalse` (explicit-false env parser: `0/false/no/off`; NOT the complement of `xH`; shared util) | cli_inner_pretty.js:1801-1806 | function |
| `v8` | `memoize` (alias `v8 = cx8`; the form actually used to wrap `X3`) | cli_inner_pretty.js:1492 | variable |
| `X3` | `isLeanSystemPrompt` (memoized top-level gate; `true` ⇒ lean: `!c45(model) || d45(model)`, env override first) | cli_inner_pretty.js:143864, 143872-143877 | variable |
| `xH` | `parseBoolTrue` (explicit-true env parser: `1/true/yes/on`, case-insensitive trimmed; shared util) | cli_inner_pretty.js:1795-1799 | function |

`UA` (`isFirstPartyProvider`), `Zq` (`currentProvider`), `O7` (`normalizeModelId`), `HD` (`canonicalizeOpusModelId`), and `Gi$` (`resolveModelOverrideAlias`) are consumed by the lean gate but catalogued once under **Model Selection — Provider Mapping** above.

---

## Module: Telemetry

OpenTelemetry spans, metrics, log events, and the auto-mode / fast-mode / bg-daemon analytics taxonomy.

The auto-mode classifier emitter `vc` (`emitClassifierOutcome`, cli_inner_pretty.js:277921) is catalogued under **Permissions — Auto-Mode Safety Classifier** above.

Telemetry events newly fired or modified in this window:

| Event name | Fired by | When |
|------------|----------|------|
| `tengu_auto_mode_outcome` | `emitClassifierOutcome` (`vc`) | auto-mode classifier verdict; carries `failureKind` |
| `tengu_auto_mode_opt_in_dialog_*` | `AutoModeOptInDialog` (`r4q`) | one event per dialog action (accept/decline/etc.) |
| `tengu_auto_mode_state` | VSCode bridge (`y97`) | `opt-in` mapped → `enabled` for the picker |
| `tengu_iron_gate_closed` | sandbox-egress fail-closed path | classifier unavailable; 30-min TTL `hE6` |
| `tengu_fast_mode_toggled` | `applyFastMode` (`/fast`) | fast-mode on/off |
| `tengu_thinking_signature_strip_retry` | thinking-signature 400 recovery | modified/invalid thinking-block signature stripped + retried (NEW 2.1.156) |
| `tengu_filtered_trailing_thinking_block` | `pQ_` (`filterTrailingThinkingBlocks`) | trailing thinking dropped from last assistant turn |
| `tengu_bg_daemon_service_stale_exec` | `ensureDaemonRunning` | service exec deleted; transient fallback (cli_inner_pretty.js:540130) |
| `tengu_bg_daemon_binary_takeover` | `takeoverStaleDaemon` | client SIGKILL of stale transient daemon (cli_inner_pretty.js:540288) |
| `tengu_bg_binary_takeover` | feature gate | default-true gate for binary takeover (cli_inner_pretty.js:540247) |
| `tengu_workflows_enabled` | workflow availability gate | workflow availability resolution |

Known themes for this window:

- Auto-mode telemetry split into SLI counters + a single `tengu_auto_mode_outcome` event carrying a `failureKind` discriminant (`vc`).
- The thinking-signature 400 hotfix adds `tengu_thinking_signature_strip_retry` and the strip primitives (`cG4`/`HF6`/`gG4`/`pQ_`, catalogued in `symbol_index_core_execution.md` / `symbol_index_core_features.md` as appropriate to the LLM-API request-build path).

---

## Module: Background Agents — Dispatch Policy Gate

Routed here from the Background Agents module: the bg-dispatch permission/policy gate. (The Background Agents home module is `symbol_index_core_features.md`; only the daemon-dispatch *policy* gate is mirrored here per the platform scope.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bwz` | `bgDispatchGate` (block bypass/auto bg dispatch unless previously opted in; parses pre-`--` argv) | cli_inner_pretty.js:542514-542529 | function |

`gy$` (`shellExecGate`, cli_inner_pretty.js:541028-541030) is the shell-exec bang-command kill-switch (returns `true` in 2.1.156); it is a feature kill-switch rather than a permission/policy rule and is catalogued in `symbol_index_core_features.md` (Background Agents). `pwz` (`RESPAWN_BOOLEAN_FLAGS`, cli_inner_pretty.js:542669) keeps `--dangerously-skip-permissions` across respawn replay but is a respawn-plumbing constant (Background Agents home module).

---

## See Also

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — System Prompts assembler, section cache, section builders, tool descriptions, thinking-strip primitives on the request-build path
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Effort capability gates / resolver / launch latch / `ultracode` / `/effort` UI, Background Agents home module
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — `/effort` slider-render UI helpers, consent-dialog UI components
- The v2.1.142 platform index (covering v2.1.113 → v2.1.142) lives at `../../../claude_code_v_2.1.142/analyze/00_overview/symbol_index_infra_platform.md`
