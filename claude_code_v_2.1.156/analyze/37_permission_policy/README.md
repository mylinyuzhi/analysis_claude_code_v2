# Module 37 — Permission Policy: v2.1.156 Changes (v2.1.143 → v2.1.156)

**Scope:** Permission-policy deltas accumulated across the v2.1.143 → v2.1.156 window. This module
documents the *delta* on top of the [v2.1.142 baseline](../../../claude_code_v_2.1.142/analyze/37_permission_policy/v2_1_142_README.md)
(which itself covered v2.1.113 → v2.1.142). Every claim is cited as `cli_inner_pretty.js:<line>` in
the v2.1.156 bundle and verified by reading that line.

Unlike the 2.1.142 window — which was a broad expressivity-and-correctness pass across the rule
grammar, settings tiers, and bash classifier — the 2.1.156 window is **narrow and surgical**. It
introduces **no new policy primitive**. Instead it lands two coherent kinds of change:

1. **Auto-mode safety-classifier hardening + a correctness fix.** The model-graded auto-mode
   classifier's **Data Exfiltration** HARD BLOCK rule is rewritten from a one-sentence,
   destination-centric rule into a three-check provenance-and-scale decision procedure whose
   centerpiece is *"bulk relocation of a repo/tree is exfiltration regardless of destination
   trust."* Co-designed with it, the stage-2 thinking budget is doubled (4096 → 8192) so the longer
   rule can be reasoned through without false "could not evaluate" blocks. Separately, the auto-mode
   **opt-in consent** stops being a blocking gate.
2. **Parser- and path-level bypass closures.** Four places where the *static analyzer* lost an
   effect the *real shell/filesystem* keeps: `rm -rf $HOME` with a trailing slash, `$TMPDIR`
   diverging between sandboxed and unsandboxed Bash, PowerShell bareword `cd` forms, and Bash bare
   variable assignments. Plus one settings-resilience fix: a single bad managed-MCP policy entry no
   longer discards the whole managed policy.

The unifying discipline is the same as the prior window: when a bypass is found the code path
**fails closed** (deny/ask, or scrub-the-offender), and a new check is *added* rather than an
existing check weakened.

---

## 1. The Window in One Diagram

```
                ┌──────────────────────────────────────────────────────┐
                │  v2.1.142 baseline (37_permission_policy)            │
                │  $defaults / hard_deny grammar, drive-root + skill   │
                │  wildcard fixes, wrapper deny, two-stage classifier  │
                │  (introduced ~2.1.136), sandbox auto-allow safety    │
                └───────────────────────────┬──────────────────────────┘
                                            │
         ┌──────────────────────────────────┼──────────────────────────────────┐
         ▼                                  ▼                                  ▼
  Auto-mode classifier            Dangerous-path / sandbox          Parser bypass closures
  ──────────────────────          ──────────────────────────        ───────────────────────
  • Data Exfiltration HARD         • rm -rf $HOME trailing-slash      • PowerShell built-in cd
    rule rewrite + Bulk-repo         + case fix (PlH, OJ)               (cd.. / cd\ / cd/ / cd~
    detection (276986)             • $TMPDIR sandboxed==unsandboxed     / X:)  (_v$, 2.1.149)
  • stage-2 budget 4096→8192         (hx realpath, same-dir env)      • PWD/OLDPWD/DIRSTACK stale
    (277501) — could-not-           (550128 / 341411 / 341544)         tracking on cd/pushd/popd
    evaluate fix                                                      • Bash bare var-assignment
  • SandboxNetworkAccess /                                             auto-approve (bareAssignment
    iron-gate (aY8, hE6)                                               Names, 2.1.145)

         │                                                                       │
         ▼                                                                       ▼
  Consent ergonomics                                          Managed-settings resilience
  ──────────────────────                                      ──────────────────────────────
  • opt-in consent no longer                                   • per-entry validation of
    blocks (800ms debounce,                                      allowed/deniedMcpServers
    in-flow dialog)  (ym, F_, hm)                                (V71) — one bad entry dropped
  • VSCode opt-in→enabled bridge                                 with a claude doctor warning
    (y97, 211682)                                                instead of poisoning all policy
```

**Two-axis theme:**
- **Vertical** (defense-in-depth): the auto-mode classifier's strongest rule gets stronger; the
  dangerous-path predicate canonicalizes both operands; the static command analyzers learn the
  shell effects they were missing.
- **Horizontal** (correctness/UX): the budget bump removes false blocks; consent stops blocking;
  one malformed managed-MCP entry no longer flips an enterprise lockdown open.

---

## 2. Module Structure

| Doc | Topic | Changelog version | Confidence |
|-----|-------|-------------------|-----------|
| [`data_exfiltration_classifier.md`](./data_exfiltration_classifier.md) | The Data Exfiltration HARD BLOCK rule rewrite (one sentence → lead paragraph + three ordered provenance/path/destination checks + "Bulk scale is its own red flag"); wiring into stage 1 of the two-stage classifier; the pre-existing Exfil Scouting / Sandbox Network Callback / Unverified Destination soft rules it escalates into; the `SandboxNetworkAccess` injected-action + iron-gate path; the co-designed 4096→8192 budget bump. Honestly separates what is genuinely new in 2.1.156 from rule text that existed verbatim in 2.1.142. | 2.1.156 ("Improved the auto-mode classifier's detection of data exfiltration, particularly bulk transfers of repository contents") | **high** (delta is a prose diff in a template string, read directly + cross-checked vs 2.1.142) |
| [`classifier_token_budget_could_not_evaluate.md`](./classifier_token_budget_could_not_evaluate.md) | The could-not-evaluate fix: the auto-mode classifier's stage-2 (thinking) output budget doubled from `max_tokens 4096` to `8192` (277501) so the model finishes reasoning and emits its `<block>` verdict instead of being truncated mid-`<thinking>`. The parser (`ZE7`/`BE7`), the failure-mode guard, and the `rY8` reason message are verified byte-for-byte unchanged vs 2.1.142; only the budget (and a "think for as long as needed" prompt extension) changed. | 2.1.156 ("Fixed auto mode incorrectly blocking actions with 'could not evaluate this action' when the safety classifier ran out of output tokens while reasoning") | **high** on the 4096→8192 delta; **medium** that the budget is the *sole* fix (prompt extension shipped alongside) |
| [`dangerous_path_home_tmpdir.md`](./dangerous_path_home_tmpdir.md) | Two dangerous-path/sandbox-path fixes: the `rm -rf $HOME` trailing-slash gap (`PlH` now trailing-slash-normalizes BOTH candidate and homedir and compares case-insensitively via `OJ`, vs 2.1.142 `nUH` which stripped only the candidate and compared raw); and TMPDIR unification (`hx` realpath-canonicalizes the per-uid sandbox tmp dir, `g24` substitutes the canonical dir for the `$TMPDIR` token, and both shell env-override adapters — `type:"bash"` (`Gs7`, override at 341411) and `type:"powershell"` (`Es7`, override at 341544), the only two TMPDIR override sites — set `TMPDIR=CLAUDE_CODE_TMPDIR` to the same dir for both sandboxed and unsandboxed commands). | 2.1.156 ("Fixed `rm -rf $HOME` not being blocked … when `HOME` has a trailing slash"; "Fixed `$TMPDIR` resolving to different directories in sandboxed vs unsandboxed Bash …") | **high** for HOME, **medium** for TMPDIR (pre-fix divergence reconstructed from 2.1.142 `X = Y ? vL() : void 0`) |
| [`powershell_cd_and_bare_assignment_bypass.md`](./powershell_cd_and_bare_assignment_bypass.md) | Two parser-level auto-approve bypass closures: the PowerShell built-in `cd` directory-change detector (`_v$`) now recognizing bareword (`cd..`/`cd\`/`cd/`/`cd~`) and drive-switch (`X:`) forms, plus the companion `PWD`/`OLDPWD`/`DIRSTACK` stale-tracking fix; and the Bash bare variable-assignment auto-approve bypass closed via a new `bareAssignmentNames` parser field routing non-allowlisted assignments to `passthrough` → prompt. | 2.1.149 (PowerShell `cd` + `PWD`/`OLDPWD`/`DIRSTACK`); 2.1.145 (bare var-assignment) | **high** for the PowerShell `_v$` delta (form list explicit, 2.1.142 precursor `JP$` provably lacks it); **medium** for the bare-assignment closure (resolver, the `bareAssignmentNames` producer `tT5` at 208439/208590, and both enforcement points all verified — **medium** applies only to the reconstructed pre-fix bypass *route*, since `LF_`/`jA5`'s regex predated the fix) |
| [`mcp_server_policy_partial_validation.md`](./mcp_server_policy_partial_validation.md) | Per-entry validation of managed `allowedMcpServers`/`deniedMcpServers`: a new `validateMcpServerPolicyEntries` (`V71`) runs before the whole-settings Zod `safeParse`, `safeParse`s each entry, keeps the valid ones, writes the filtered array back in place, and emits a per-entry `severity:"warning"` (`Invalid entry was ignored: …`) for each bad one. Surfaces via `claude doctor` / the startup `InvalidSettingsDialog` as a non-blocking *Settings Warning*. Closes the worst-case enterprise failure where one typo reverted `allowedMcpServers` to `undefined` = "all allowed." | 2.1.156 ("Fixed a single invalid `allowedMcpServers`/`deniedMcpServers` entry in managed settings discarding all managed-settings policy; the bad entry is now dropped with a `claude doctor` warning") | **high** (per-entry `safeParse`, keep-valid push, write-back, and the literal `Invalid entry was ignored` string all explicit; absent in 2.1.142 and 2.1.88) |
| [`auto_mode_consent_removed.md`](./auto_mode_consent_removed.md) | The removal of auto-mode opt-in consent as a blocking gate: the tri-state config resolver `kV5` (default `opt-in`), the VSCode `experiment_gates` bridge `y97` that promotes `opt-in` → `enabled` for `tengu_auto_mode_state` (so the mode-picker surfaces auto mode without bypass-permissions), and the 800ms consent-debounce that makes the in-flow opt-in dialog non-blocking (`onSubmit` short-circuit, `handleAutoModeOptInDecline` clearing pending consent). Cross-validated against the 2.1.88 blocking startup gate (`interactiveHelpers.tsx`). | 2.1.152 ("Auto mode no longer requires opt-in consent"); 2.1.156 (VSCode surfacing) | **high** that consent no longer blocks / surfaces without bypass-permissions; **medium** on the literal "the blocking gate was deleted" (inferred from absence-plus-replacement, not a single deleted `if`) |

---

## 3. Cross-Cutting Themes

### 3.1 "The static analyzer lost an effect the real system keeps"

Four of the six fixes share one root-cause shape: the permission engine's *static model* of the
world diverged from what the *real shell or filesystem* would do, and the gap was the bypass.

| Fix | What the analyzer missed | Doc |
|-----|--------------------------|-----|
| `rm -rf $HOME` trailing slash | The trusted reference value (`os.homedir()`) could be in non-canonical form too — only the candidate was normalized (asymmetric normalization) | `dangerous_path_home_tmpdir.md` |
| `$TMPDIR` divergence | Two values that should have *been* the same directory weren't (one realpath'd/canonical, one ambient/symlinked) | `dangerous_path_home_tmpdir.md` |
| PowerShell `cd..` / `X:` | `cd..` is a single command token, not `cd` + `..`; alias resolution never maps it to `Set-Location`, so the cwd change went undetected | `powershell_cd_and_bare_assignment_bypass.md` |
| Bash bare `FOO=bar` | An assignment-only command resolved to an *empty* command list, which downstream logic treated as trivially read-only — even though it mutates the env for every later command | `powershell_cd_and_bare_assignment_bypass.md` |

The discipline the patches encode: **canonicalize both operands of any security comparison to one
identical form, and make the static model invalidate the moment the real shell would change state.**
The PowerShell side fixes *detecting* the chdir; the Bash `PWD`/`OLDPWD`/`DIRSTACK` companion fixes
*propagating* it into the variable model.

### 3.2 Fail-closed, in two flavors

- **Hard fail-closed (deny on uncertainty):** The auto-mode classifier blocks on any uncertainty —
  the could-not-evaluate path returns `shouldBlock: true`, and the sandbox-network iron-gate
  (`hE6`/`tengu_iron_gate_closed`) *denies* outbound egress when the classifier is unavailable. The
  budget bump in `classifier_token_budget_could_not_evaluate.md` was deliberately chosen over
  "fall back to allow on truncation," precisely because auto-allow on cutoff would open a hole at
  the highest-risk cases.
- **Soft fail-closed (scrub-the-offender + warn):** The MCP per-entry validator drops only the bad
  entry and keeps the rest of the policy, surfacing a non-blocking warning. This is the
  generalization of the 2.1.88 `filterInvalidPermissionRules` idea ("don't let one bad rule poison
  the whole file") applied to the two managed-MCP arrays — and it matters *more* for managed
  settings because the old failure direction was *open* (`allowedMcpServers` → `undefined` = "all
  allowed").

### 3.3 The classifier is the boundary; consent is ergonomics

The consent-removal change (`auto_mode_consent_removed.md`) is safe **because consent was never the
safety boundary** — the per-tool-call safety classifier (with its HARD-deny rules, evaluated in
stage 1 with no user-intent override) is. The opt-in dialog was friction; friction that blocks
discovery (a startup gate, or a "you must consent before the picker even shows it" model in VSCode)
is counterproductive. So consent went from a *blocking precondition* to a *non-blocking, debounced,
in-flow confirmation* in the terminal and to *silently available* in VSCode — while the classifier
keeps hard-denying dangerous actions on every call. This is why the same release that *relaxed*
consent also *hardened* the classifier's Data Exfiltration rule: the protection that matters got
stronger as the friction that didn't got removed.

### 3.4 Centralized leaf predicates pay off

The PowerShell `cd` fix is a **one-line addition at a shared leaf** (`isCwdChangingCmdlet`, `_v$`)
that simultaneously hardens five distinct guard sites (read-only compound gate, acceptEdits
validator, compound path validator, and two `git` bare-repo guards). The alternative — inlining a
name check at each guard — would have left the same gap in four other places. The same pattern
holds for `isDangerousRemovalTarget` (`PlH`), consulted by both the Bash and PowerShell recursive-
delete paths: normalizing both operands *inside* the predicate means every caller inherits the fix
for free.

---

## 4. Reading Order

1. Start with [`data_exfiltration_classifier.md`](./data_exfiltration_classifier.md) — the headline
   2.1.156 change and the richest illustration of how the model-graded classifier's rules work
   (HARD vs SOFT, stage 1 vs stage 2, the three-check decision procedure).
2. Then [`classifier_token_budget_could_not_evaluate.md`](./classifier_token_budget_could_not_evaluate.md)
   — the co-designed correctness fix for the same subsystem (the verdict parser, the failure-mode
   guard, and why doubling the budget — not retrying or allowing — was the right call).
3. [`auto_mode_consent_removed.md`](./auto_mode_consent_removed.md) — completes the auto-mode picture
   (why the classifier-as-boundary makes relaxing consent safe).
4. [`dangerous_path_home_tmpdir.md`](./dangerous_path_home_tmpdir.md) — the two
   canonicalize-both-operands fixes; read this before the parser doc for the "asymmetric
   normalization" framing.
5. [`powershell_cd_and_bare_assignment_bypass.md`](./powershell_cd_and_bare_assignment_bypass.md) —
   the two static-analyzer bypass closures (PowerShell `cd` + Bash bare assignment) that share the
   same "model lost an effect" root cause.
6. [`mcp_server_policy_partial_validation.md`](./mcp_server_policy_partial_validation.md) — the
   settings-resilience fix; independent of the rest, read last.

---

## 5. Why This Matters

The v2.1.143 → v2.1.156 window does **not** add a new permission primitive — `permissions.{allow,
deny,ask}`, `autoMode.{allow,soft_deny,hard_deny}`, the safety classifier, the sandbox, and the
managed-MCP allow/deny lists all predate it. What it delivers is:

| Class of fix | Versions | Why it matters |
|---|---|---|
| **Classifier rule strength** (Data Exfiltration rewrite + bulk-repo detection) | 2.1.156 | Closes the self-provisioned-destination + bulk-relocation exfiltration gap the one-sentence rule could not see |
| **Classifier correctness** (stage-2 budget 4096→8192) | 2.1.156 | Stops the model being blocked because it was *cut off while thinking* on a safe-but-hard action |
| **Dangerous-path correctness** (HOME trailing slash + case; `$TMPDIR` unification) | 2.1.156 | A "delete your home directory?" check can no longer be bypassed by a stray slash; temp state is portable across the sandbox boundary |
| **Parser bypass closures** (PowerShell `cd`, Bash bare assignment) | 2.1.149, 2.1.145 | Auto-approve no longer misses cwd changes or env mutations that alter every later command |
| **Managed-settings resilience** (per-entry MCP validation) | 2.1.156 | One admin typo no longer flips an enterprise MCP lockdown from "deny all" to "allow all" |
| **Consent ergonomics** (non-blocking opt-in, VSCode surfacing) | 2.1.152, 2.1.156 | Auto mode is discoverable/usable without a startup-blocking gate, with the classifier still the real boundary |

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_156_permission_policy.md`](../00_overview/symbol_additions_v2_1_156_permission_policy.md) — Symbols introduced/touched in this module (the deduplicated, alphabetized table for the 2.1.143–156 delta)
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Existing platform/permission/sandbox/MCP symbols
> - [`symbol_index_core_features.md`](../00_overview/symbol_index_core_features.md) — Auto-mode / steering / mode-cycle symbols
> - [`symbol_index_infra_integration.md`](../00_overview/symbol_index_infra_integration.md) — UI-component / VSCode-bridge symbols

Key functions, constants, and settings keys discussed across these documents (full table in the
additions file above):

- `dataExfiltrationHardDenyRule` (template slot `<user_hard_deny_rules_to_replace>`) — rewritten HARD BLOCK Data Exfiltration rule body (cli_inner_pretty.js:276986)
- `runTwoStageClassifier` (`en5`) — two-stage XML classifier; holds the stage-2 `max_tokens: 8192 + V` budget (cli_inner_pretty.js:277392, 277501)
- `parseBlockDecision` (`ZE7`) / `stripUnterminatedThinking` (`BE7`) — the verdict parser, unchanged vs 2.1.142 (cli_inner_pretty.js:277340, 277337)
- `classifierCouldNotEvaluateReason` (`rY8`) — the fail-closed could-not-evaluate reason string (cli_inner_pretty.js:277918)
- `runSandboxNetworkClassifier` (`aY8`) + `SANDBOX_NETWORK_ACTION` (`NE7`) + `IRON_GATE_TTL` (`hE6`) — the injected `SandboxNetworkAccess` action and fail-closed egress gate (cli_inner_pretty.js:277969, 277997, 277998)
- `isDangerousRemovalTarget` (`PlH`) + `toLowerCase` (`OJ`) — the `rm -rf $HOME` trailing-slash + case fix (cli_inner_pretty.js:211484, 549400)
- `canonicalSandboxTmpDir` (`hx`) + `sandboxTmpDir` (`VL`) + `buildSandboxPromptSection` (`g24`) — the `$TMPDIR` unification chain (cli_inner_pretty.js:550128, 176754, 438967)
- `createBashShellAdapter` (`Gs7`) + `createPowershellShellAdapter` (`Es7`) — the only two TMPDIR override adapters (`type:"bash"`/`type:"powershell"`), each writing `TMPDIR=CLAUDE_CODE_TMPDIR` to the same dir (cli_inner_pretty.js:341341, 341512; overrides at 341411, 341544)
- `isCwdChangingCmdlet` (`_v$`) + `resolveToCanonical` (`EY`) — the PowerShell built-in `cd` detector and alias resolver (cli_inner_pretty.js:417684, 417677)
- `findCommandNode` (`UcH`) + `getCommandPrefixStatic` (`kI8`) + `classifySimpleReadOnly` (`nz8`) — the bare-assignment resolution chain and its new `bareAssignmentNames` guard (cli_inner_pretty.js:190389, 595513, 242978)
- `analyzeCommandEffects` (`tT5`) — the per-command effect walker that POPULATES `bareAssignmentNames` (bare-assignment-only branch at 208439, surfaced at 208590) and recomputes `PWD`/`OLDPWD`/`DIRSTACK` on `cd` (cli_inner_pretty.js:208413)
- `validateMcpServerPolicyEntries` (`V71`) + `mcpServerPolicyKeys` (`T71`) + `collectSettingsWarnings` (`kb`) — the per-entry managed-MCP validator (cli_inner_pretty.js:52367, 52417, 52403)
- `resolveAutoModeEnabledState` (`kV5`) + `sendVscodeExperimentGates` (`y97`) + `handleCycleMode` (`ym`) + `handleAutoModeOptInDecline` (`hm`) — the consent tri-state resolver, VSCode `opt-in → enabled` bridge, and 800ms non-blocking debounce (cli_inner_pretty.js:211657, 211664, 585340, 585448)
