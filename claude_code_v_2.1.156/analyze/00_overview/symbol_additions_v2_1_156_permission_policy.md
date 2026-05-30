# Symbol Additions — v2.1.156 Permission Policy (module 37_permission_policy)

These mappings cover every obfuscated identifier introduced, touched, or load-bearing in the
v2.1.156 **Permission Policy** delta (the 2.1.143 → 2.1.156 window). Six themes are documented in
the module:

1. **Auto-mode safety classifier** — the Data-Exfiltration HARD BLOCK rule rewrite + Bulk-repo
   detection, the two-stage XML classifier, the stage-2 token-budget could-not-evaluate fix, the
   `SandboxNetworkAccess` injected-action / iron-gate path, and the verdict parser.
2. **Dangerous-path correctness** — the `rm -rf $HOME` trailing-slash + case fix and the TMPDIR
   sandboxed-vs-unsandboxed unification (realpath canonicalization + same-dir env override).
3. **Command-parser bypass closures** — PowerShell built-in `cd` (bareword/drive-switch) detection
   and the Bash bare variable-assignment auto-approve closure.
4. **Managed-MCP policy resilience** — per-entry validation of `allowedMcpServers`/`deniedMcpServers`
   with `claude doctor` warnings.
5. **Auto-mode consent removal** — tri-state config resolver, the VSCode `opt-in → enabled` bridge,
   and the 800ms non-blocking consent debounce.

Each row gives the v2.1.156 obfuscated identifier, the readable name, `file:line`, and type.
Every line was verified by reading
`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` at that location.

Cross-validated against:
- v2.1.156 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- v2.1.142 bundle (nearest precursor for the classifier/dangerous-path/parser deltas)
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/` — the rule-based permission engine and
  the effective-command resolver have readable precursors; the LLM safety classifier
  (two-stage XML, `SandboxNetworkAccess`, HARD/SOFT split), the per-entry MCP validator, the
  `bareAssignmentNames` guard, and the non-blocking consent debounce / VSCode opt-in→enabled bridge
  are all **NEW post-2.1.88**.
- Module docs: `claude_code_v_2.1.156/analyze/37_permission_policy/{data_exfiltration_classifier,
  classifier_token_budget_could_not_evaluate,dangerous_path_home_tmpdir,
  powershell_cd_and_bare_assignment_bypass,mcp_server_policy_partial_validation,
  auto_mode_consent_removed}.md`

> **Home-index placement (single source of truth).** Every row in this module belongs in
> **`symbol_index_infra_platform.md`** under the Permissions / Auto-mode-classifier / Sandbox /
> MCP-policy sections — permission policy is platform infrastructure. The generic-utility rows
> (`OJ`, `aq`, `w9`, `McH`) are shared helpers consulted by the policy paths; they are listed here
> for this module's completeness and may already be (or be filed) in the shared platform index.

> **Line-number notes (single source of truth):**
> - `rY8` appears in two docs (`data_exfiltration_classifier.md` as `classifierCouldNotEvaluateReason`
>   and `auto_mode_consent_removed.md` as `autoModeCouldNotEvaluateMessage`). It is **one** function
>   at cli_inner_pretty.js:277918; listed once below under `classifierCouldNotEvaluateReason`.
> - `ZE7` is named both `parseVerdict` and `parseBlockDecision` across the two classifier docs — it
>   is **one** function at 277340. Listed once as `parseBlockDecision` (the primary name in the
>   token-budget doc).
> - `pE7` is named `getThinkingBudget` / `thinkingBudgetForModel` — one function at 277389. Listed
>   once as `thinkingBudgetForModel`.
> - `en5` (`runTwoStageClassifier`) is a 10-arg function declared at 277392; the stage-2
>   `max_tokens: 8192 + V` budget lives in its body at 277501.
> - `UE7` is `twoStageClassifierConfig` / `getTwoStageClassifierSetting` (one function at 277908);
>   listed once as `getTwoStageClassifierSetting`.
> - `NE7` (`SandboxNetworkAccess`), `hE6` (`IRON_GATE_TTL` = 1800000ms), and the reminder constants
>   `in5`/`rn5`/`on5` sit in one declaration cluster at 277991-277998.
> - `WV5` and `ZV5` are assigned together in one comma-expression at 211576.

---

## Module: Permission Policy — 2.1.143–156 delta

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `<user_hard_deny_rules_to_replace>` | `dataExfiltrationHardDenyRule` (rewritten HARD BLOCK Data Exfiltration rule body: lead paragraph + 3 ordered provenance/path/destination checks + "Bulk scale is its own red flag") | cli_inner_pretty.js:276986 | constant |
| `aq` | `dedupe` (`[...new Set(H)]`; used by `g24` to dedupe the sandbox write-allowlist before `$TMPDIR` token substitution) | cli_inner_pretty.js:40716 | function |
| `aY8` | `runSandboxNetworkClassifier` (wraps a `{host,port}` outbound attempt into a synthetic `SandboxNetworkAccess` assistant tool-use and classifies it; iron-gate fallback on unavailability) | cli_inner_pretty.js:277969 | function |
| `an5` | `parseThinking` (extracts the first well-formed `<thinking>…</thinking>` body for telemetry; non-global, non-dangling regex) | cli_inner_pretty.js:277350 | function |
| `BE7` | `stripUnterminatedThinking` (strips both closed `<thinking>…</thinking>` pairs and a trailing unterminated `<thinking>` to EOF before block parsing) | cli_inner_pretty.js:277337 | function |
| `BP$` | `runSingleStageToolUseClassifier` (single-stage `tool_use`/`classify_result` classifier path; `max_tokens: 4096 + E`, unchanged in 2.1.156) | cli_inner_pretty.js:277689 | function |
| `consentDebounceCancelRef` (`H1`) | `consentDebounceCancelRef` (`useRef` holding the 800ms opt-in-dialog timer's cancel function) | cli_inner_pretty.js:584571 | variable |
| `en5` | `runTwoStageClassifier` (two-stage XML auto-mode classifier; stage 1 = hard_deny gate, stage 2 = soft_deny + ALLOW + user intent; holds the stage-2 `max_tokens: 8192 + V` budget at 277501) | cli_inner_pretty.js:277392 | function |
| `EY` | `resolveToCanonical` (strips a trailing `.exe/.cmd/.bat/.com` suffix and resolves a PowerShell alias to its canonical Verb-Noun cmdlet name) | cli_inner_pretty.js:417677 | function |
| `GE7` | `parseBlockReason` (extracts `<reason>…</reason>` text for the user-facing block message) | cli_inner_pretty.js:277345 | function |
| `GJ5` | `assertSafeTmpDir` (owner/mode/symlink guard on the per-uid tmp dir: must be a real directory owned by the current uid; forces `0700`) | cli_inner_pretty.js:176739 | function |
| `g24` | `buildSandboxPromptSection` (builds the "Command sandbox" system-prompt section; substitutes the canonical tmp dir for the `$TMPDIR` token; carries the "for both sandboxed and unsandboxed commands" note) | cli_inner_pretty.js:438967 | function |
| `gG8` | `extractPowershellRemovalPath` (resolves a PowerShell `Remove-Item` argument to an absolute path, then defers to `isDangerousRemovalTarget`) | cli_inner_pretty.js:418371 | function |
| `h0` | `isAutoModeGateEnabled` (runtime auto-mode gate: circuit-breaker + settings-disable + model support; does NOT consult opt-in consent) | cli_inner_pretty.js:443051 | function |
| `hE6` | `IRON_GATE_TTL` (`1800000` ms = 30 min TTL for the `tengu_iron_gate_closed` fail-closed sandbox-egress gate) | cli_inner_pretty.js:277998 | constant |
| `hm` | `handleAutoModeOptInDecline` (decline handler: clears pending consent, tears down the dialog/timer, does NOT exit the process) | cli_inner_pretty.js:585448 | function |
| `hx` | `canonicalSandboxTmpDir` (memoized `realpathSync`-canonicalized per-uid sandbox tmp dir with trailing separator) | cli_inner_pretty.js:550128 | function |
| `IL5` | `isAutoModeConfigDisabled` (circuit-breaker check; true only when config `enabled === "disabled"`, using the `H87` sentinel to distinguish cold cache) | cli_inner_pretty.js:185018 | function |
| `in5` | `stage1HardDenyReminderFast` (stage-1 reminder for the fast path: "Err on the side of blocking. `<block>` immediately.") | cli_inner_pretty.js:277991 | constant |
| `iC` | `handleAutoModeAccept` (accept handler: clears dialog, commits `toolPermissionContext` mode `auto`, emits `mode_auto_enter`) | cli_inner_pretty.js:585430 | function |
| `kb` | `collectSettingsWarnings` (aggregator that concatenates the permission, hooks, and MCP-policy sanitizer warnings; runs before whole-settings `safeParse`) | cli_inner_pretty.js:52403 | function |
| `kI8` | `getCommandPrefixStatic` (builds the auto-approve command prefix; returns `{ commandPrefix: null }` for an assignment-only command) | cli_inner_pretty.js:595513 | function |
| `kV5` | `resolveAutoModeEnabledState` (tri-state config resolver returning `enabled`/`disabled`/`opt-in`; default `opt-in`) | cli_inner_pretty.js:211657 | function |
| `KW5` | `collectLeadingAssignments` (collects leading `variable_assignment` text on a `command` node into `envVars`, stopping at the first `command_name`/`word`) | cli_inner_pretty.js:190408 | function |
| `LF_` | `hasNonAllowlistedAssignment` (leading-assignment env-var detector used by the read-only auto-allow gate; present byte-identical in 2.1.142 as `jA5`) | cli_inner_pretty.js:440619 | function |
| `McH` | `tmpFilePath` (builds a tmp file path under the sandbox tmp dir, hashing content or using a random UUID) | cli_inner_pretty.js:176767 | function |
| `MC_` | `validateCompoundPaths` (per-statement PowerShell path validator that pre-seeds an `ask` verdict when the compound changes cwd) | cli_inner_pretty.js:418618 | function |
| `MqH` | `powershellAliasMap` (alias→canonical PowerShell cmdlet lookup table consulted by `resolveToCanonical`) | cli_inner_pretty.js:417169 | variable |
| `NE7` | `SANDBOX_NETWORK_ACTION` (`"SandboxNetworkAccess"` — the synthetic action name injected for sandboxed outbound connections) | cli_inner_pretty.js:277997 | constant |
| `NN7` | `isMcpServerDenied` (denylist matcher; consulted first so deny precedes allow) | cli_inner_pretty.js:275185 | function |
| `nT5` | `parseSimpleCommandTree` (simple-command classifier; now emits `{ kind:"simple", commands, bareAssignmentNames }`) | cli_inner_pretty.js:207803 | function |
| `nUH` | `isDangerousRemovalTarget_2_1_142` (PRECURSOR, separate build) — pre-fix predicate that stripped the trailing slash from the candidate only and compared raw (2.1.142 cli_inner_pretty.js:207091) | 2.1.142 cli_inner_pretty.js:207091 | function |
| `nz8` | `classifySimpleReadOnly` (read-only classifier; now routes a non-allowlisted bare assignment to `passthrough` → prompt) | cli_inner_pretty.js:242978 | function |
| `OJ` | `toLowerCase` (`H.toLowerCase()` — case-folder used for case-insensitive path comparison in the dangerous-removal predicate and PowerShell cwd checks) | cli_inner_pretty.js:549400 | function |
| `on5` | `stage2ThinkingReminder` (stage-2 reminder; the 2.1.156 "Think for as long as needed … do not cut your reasoning short on hard cases" extension) | cli_inner_pretty.js:277995 | constant |
| `Oo8` | `mcpDenyEntrySchema` (lazily-built Zod schema for one `deniedMcpServers` entry; exactly one of serverName/serverCommand/serverUrl) | cli_inner_pretty.js:52043 | function |
| `PH$` | `denyProtectedSystemPath` (builds the `behavior:"deny"` verdict for a protected removal target) | cli_inner_pretty.js:418378 | function |
| `PlH` | `isDangerousRemovalTarget` (predicate flagging a resolved path as a protected delete target; 2.1.156 trailing-slash-normalizes BOTH candidate and homedir and compares via `OJ`) | cli_inner_pretty.js:211484 | function |
| `PR8` | `canCycleToAuto` (gate for whether Shift+Tab can reach auto mode; `isAutoModeAvailable && h0() && !i4q()`, no consent precondition) | cli_inner_pretty.js:578696 | function |
| `QCH` | `cycleNextMode` (Shift+Tab mode-cycle state machine: default → acceptEdits → plan → (bypass\|auto) → default) | cli_inner_pretty.js:578712 | function |
| `r4q` | `AutoModeOptInDialog` (the in-flow opt-in dialog component; four actions, each emitting a `tengu_auto_mode_opt_in_dialog_*` event) | cli_inner_pretty.js:578742 | function |
| `rY8` | `classifierCouldNotEvaluateReason` (fail-closed reason builder: always returns "Auto mode could not evaluate this action and is blocking it for safety — run with --debug for details"; params ignored) | cli_inner_pretty.js:277918 | function |
| `rn5` | `stage1HardDenyReminderTwoStage` (stage-1 reminder for the 2-stage "both" path: "Stage 1 does NOT apply user intent or ALLOW exceptions") | cli_inner_pretty.js:277993 | constant |
| `T71` | `mcpServerPolicyKeys` (`[{key:"allowedMcpServers",schema:fo8},{key:"deniedMcpServers",schema:Oo8}]` table driving `validateMcpServerPolicyEntries`) | cli_inner_pretty.js:52417 | variable |
| `UcH` | `findCommandNode` (descends through a `variable_assignment` node to the following real command; returns `null` for an assignment-only command) | cli_inner_pretty.js:190389 | function |
| `UE7` | `getTwoStageClassifierSetting` (reads `tengu_auto_mode_config.twoStageClassifier`, default `true`) | cli_inner_pretty.js:277908 | function |
| `V5H` | `isAllowlistedEnvVar` (membership test against the static safe env-var set `safeEnvVarSet`) | cli_inner_pretty.js:440527 | function |
| `V71` | `validateMcpServerPolicyEntries` (NEW per-entry validator filtering invalid `allowedMcpServers`/`deniedMcpServers` entries in place before whole-settings validation, emitting a per-entry warning) | cli_inner_pretty.js:52367 | function |
| `vc` | `emitClassifierOutcome` (telemetry emitter: maps outcome → SLI counters + the `tengu_auto_mode_outcome` event, carrying `failureKind`) | cli_inner_pretty.js:277921 | function |
| `vd` | `rawTmpDirRoot` (`CLAUDE_CODE_TMPDIR` env override or `os.tmpdir()`) | cli_inner_pretty.js:176735 | function |
| `vE6` | `classifierRequestWithStallMonitor` (classifier request wrapper that drives the stall watchdog and counts fetch attempts) | cli_inner_pretty.js:277677 | function |
| `VL` | `sandboxTmpDir` (creates/returns the per-uid `claude-<uid>` tmp directory, created `0700` and ownership/symlink-checked via `assertSafeTmpDir`) | cli_inner_pretty.js:176754 | function |
| `w9` | `extractTextBlocks` (concatenates the `text` blocks of a response's content array; non-empty whenever the model emitted prose) | cli_inner_pretty.js:445034 | function |
| `wD$` | `extractCommandArguments` (extracts the effective `[cmd, ...args]` from a command/declaration node; skips `variable_assignment` children) | cli_inner_pretty.js:190416 | function |
| `wJH` | `isMcpServerAllowed` (allowlist matcher; returns false up-front if denied — denylist precedence) | cli_inner_pretty.js:275201 | function |
| `WV5` | `driveRootRegex` (`/^[A-Za-z]:\/?$/` — matches `C:` / `C:/` Windows drive roots) | cli_inner_pretty.js:211576 | variable |
| `xE7` | `toClassifierInput` (renders a transcript entry, including injected actions, into classifier input via the per-action descriptor map) | cli_inner_pretty.js:277203 | function |
| `y97` | `sendVscodeExperimentGates` (VSCode bridge pushing `experiment_gates`; maps `opt-in` → `enabled` for `tengu_auto_mode_state` so the picker surfaces auto mode without bypass-permissions) | cli_inner_pretty.js:211664 | function |
| `yE6` | `makeAssistantToolUse` (builds an `{role:"assistant", content:[{type:"tool_use", name, input}]}` synthetic action for the classifier) | cli_inner_pretty.js:277966 | function |
| `ym` | `handleCycleMode` (PromptInput Shift+Tab handler; arms the 800ms consent debounce before showing the opt-in dialog) | cli_inner_pretty.js:585340 | function |
| `ZE7` | `parseBlockDecision` (parses `<block>yes\|no` after stripping thinking; returns `null` when no block tag is present — fail-closed) | cli_inner_pretty.js:277340 | function |
| `ZV5` | `driveRootChildRegex` (`/^[A-Za-z]:\/[^/]+$/` — matches `C:/Users`, `D:/data` single-segment drive-root children) | cli_inner_pretty.js:211576 | variable |
| `_v$` | `isCwdChangingCmdlet` (PowerShell cwd-change detector; 2.1.149 adds bareword `cd..`/`cd\`/`cd/`/`cd~` and drive-switch `X:` forms before alias resolution) | cli_inner_pretty.js:417684 | function |
| `$i5` | `isTwoStageClassifierEnabled` (predicate: `getTwoStageClassifierSetting()` is `true` / `"fast"` / `"thinking"`) | cli_inner_pretty.js:277911 | function |
| `pE7` | `thinkingBudgetForModel` (returns `[false, 0]` for the classifier — no API extended-thinking, so the additive budget term `V`/`E` is always 0) | cli_inner_pretty.js:277389 | function |
| `dP6` | `parseCommand` (async tree-sitter parse returning `{ rootNode, envVars, commandNode, originalCommand }`) | cli_inner_pretty.js:190366 | function |

---

## Notes & gaps

- **Deduplications applied vs the seed table:** `en5`/`runTwoStageClassifier`, `ZE7`
  (`parseVerdict`≡`parseBlockDecision`), `rY8` (`classifierCouldNotEvaluateReason`≡
  `autoModeCouldNotEvaluateMessage`), `pE7` (`getThinkingBudget`≡`thinkingBudgetForModel`), `in5`,
  `rn5`, `on5`, and `UE7` (`twoStageClassifierConfig`≡`getTwoStageClassifierSetting`) appeared more
  than once in the collected seed. Each is listed exactly once above under its primary readable name.
- **`fo8` (`mcpAllowEntrySchema`)** is documented in `mcp_server_policy_partial_validation.md` and is
  the allow-entry companion to `Oo8`. It is at cli_inner_pretty.js:52016. It is **not** in the seed
  set but belongs to this module; it should be added to `symbol_index_infra_platform.md` (MCP policy)
  in the same pass and is noted here for completeness. (Verified at 52016 by reading the bundle in
  the source doc.)
- **`W71` (`filterInvalidPermissionRules`)** and **`G71` (`filterInvalidHooks`)** are the two
  pre-existing sanitizers concatenated by `kb`; they predate 2.1.156 (permission sanitizer since
  2.1.88, hooks sanitizer added in the 2.1.142 window) and so are documented as context in the MCP
  doc rather than added here as 2.1.156 deltas.
- **`nUH`** is a 2.1.142-bundle PRECURSOR (the pre-fix `isDangerousRemovalTarget`), included as a
  single row for cross-version traceability; its `File:Line` is explicitly tagged `2.1.142
  cli_inner_pretty.js:207091` so it is not mistaken for a 2.1.156 line.
- **VSCode/consent UI symbols** (`r4q`, `ym`, `iC`, `hm`, `QCH`, `PR8`, `consentDebounceCancelRef`)
  are React/PromptInput-layer symbols that interact with the permission *mode* surface; they are
  filed here because the consent gate is a permission-policy behavior, but a future pass may prefer
  to mirror the UI-component ones into `symbol_index_infra_integration.md` (UI Components).
- **State-only consent vars** documented in `auto_mode_consent_removed.md` (`Hz`/`T1`
  showAutoModeOptIn, `kz`/`$f` autoModeOptInPrevMode, `H87` NO_CACHED_AUTO_MODE_CONFIG, `n19`
  AUTO_MODE_DESCRIPTION, `i4q` isAutoModeOptInDismissed, `kl` getAutoModeUnavailableReason, `vE7`
  getAutoModeModel, `kE7` isJsonlTranscriptEnabled) are intentionally **omitted** from the table
  above to keep it to the load-bearing policy symbols; they are fully cross-referenced in the module
  doc and can be promoted into the shared index later if needed.
