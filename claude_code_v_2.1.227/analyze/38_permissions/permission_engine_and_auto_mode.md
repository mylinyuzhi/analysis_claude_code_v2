# Permission engine, shell analysis, and auto-mode adjudication

## Scope and version assessment

This is a current-state reconstruction from the 2.1.227 target. The core layered design remains from
2.1.220, but the target includes later protections for background tasks, PowerShell paths, worktree
isolation, MCP ceilings, same-turn classifier context, permission-mode races, and safety-refusal
accounting.

The 2.1.223 release notes name two important fixes—hidden Bash command parts and tab/invisible-Unicode
approval rendering—but the available endpoint bundles cannot isolate their exact patch sites. Those
two attributions remain explicitly unanchored in the changelog ledger. This document does not invent a
line-level delta; it explains the verifiable 2.1.227 decision system and identifies the endpoint
hardening that surrounds those fixes.

### Permission context and effective-mode overlay

**What it does:** Maintains one explicit policy context while allowing narrowly scoped mode overrides
for individual MCP/browser tool families.

**How it works:**
1. The context stores the active mode, allow/ask/deny rules by source, extra working directories,
   pre-plan state, stripped dangerous rules, prompt availability, auto-mode availability, and
   classifier floors.
2. `applyPermissionUpdate` (`UH`, `cli_inner_pretty.js:332829-332885`) immutably applies `setMode`,
   add/replace/remove rules, and directory changes. It rejects a `bypassPermissions` transition unless
   the session was launched with that capability.
3. Durable permission updates are persisted separately; session-only bypass is deliberately never
   written as a default mode.
4. `effectiveModeForTool` (`hrt`, `:301060-301076`) starts from the session mode, then applies a
   tighten-only MCP-server override (`default`, `auto`, or cleared) only when the global mode would
   otherwise auto-allow.
5. Browser/preview servers may receive an auto-classifier floor under global bypass/auto/contained-plan
   modes. If the classifier cannot run, that floor becomes `default`, not bypass.
6. Plan mode records its preceding mode and dangerous-rule state; its separate exit transaction
   revalidates auto capability before restoration.

**Why this approach:**
- Explicit context makes permission decisions replayable and lets each result explain whether a rule,
  mode, safety check, hook, classifier, or working-directory boundary decided it.
- Tighten-only per-server overrides let an integration demand more review without creating a hidden
  privilege escalation channel.
- Launch-time capability for bypass prevents a settings file or runtime tool from silently enabling
  the most permissive mode.
- The trade-off is that “current mode” is tool-dependent. Centralizing the overlay in one resolver
  keeps that complexity out of individual tool implementations.

**Key insight:** Permission mode is a baseline, not always the final per-tool mode. Overrides may raise
the review floor but cannot widen capability beyond the session launch contract.

### Provenance-aware deterministic precedence

**What it does:** Resolves hard policy before any UI prompt or model classifier can approve an action.

**How it works:**
1. Rules retain both behavior and source: managed policy, feature policy, user/project/local settings,
   CLI arguments, command narrowing, session decisions, tool narrowing, and MCP-server policy.
2. `checkRuleBasedPermissions` (`JHt`, `cli_inner_pretty.js:343191-343254`) checks a whole-tool deny,
   then input-field deny, before calling the tool's own `checkPermissions` implementation.
3. A whole-tool or input-specific ask rule forces at least `ask`. An ask returned by the tool carries
   its safety/working-directory reason forward rather than being replaced with a generic message.
4. A tool declaring `requiresUserInteraction` cannot be made noninteractive by an ordinary allow rule.
   An organization `effectiveMaxPermission: ask` is also a hard ceiling.
5. `evaluateToolPermission` (`yK_`, `:343255-343339`) repeats the deny floor in the full execution path,
   applies the plan-mode floor to mutating MCP calls, then evaluates bypass, safe whole-tool grants, and
   residual ask behavior.
6. Non-deniable terminal tools are excluded from ordinary deny matching unless explicitly granted
   semantics require otherwise, preventing rules from trapping the loop without a completion path.
7. Permission decisions retain structured reasons; nested Bash decisions aggregate per-subcommand
   reasons instead of flattening them to one opaque boolean.

**Why this approach:**
- Deny-first evaluation ensures an allow from a lower-trust source cannot mask administrative policy.
- Keeping rule provenance supports truthful UI messages and prevents deleting read-only managed rules.
- Tool-owned safety checks understand semantic input better than a generic matcher; rules and tool
  checks therefore form intersecting constraints rather than one replacing the other.
- The trade-off is duplicate-looking checks in the fast and full paths. Rechecking the deny floor
  protects updated hook input and headless resolution paths.

**Key insight:** The engine computes a policy lattice, not “first matching rule wins.” Deny, mandatory
ask, safety, interaction, mode, and allow occupy different precedence levels.

### PreToolUse hook arbitration

**What it does:** Lets hooks deny, ask, allow, defer, or rewrite a tool input without allowing hook
output to bypass stronger rules or safety invariants.

**How it works:**
1. PreToolUse hooks run before ordinary permission resolution and may emit progress, context, a stop
   reason, updated input, or a permission behavior.
2. Updated input is parsed against the tool schema. Recognized-field failures become a denial; unknown
   extra keys can be tolerated by the schema's passthrough contract.
3. `arbitratePreToolHook` (`VSn`, `cli_inner_pretty.js:344395-344430`) treats a hook deny as final, but
   re-runs `checkRuleBasedPermissions` for hook allow/ask using the rewritten input.
4. A deny rule always overrides a hook allow. A safety or ask rule sends the call through the full
   pipeline.
5. When the hook itself returned `ask`, `hookAskFloor` is set. If the auto classifier later allows the
   action, the engine resurfaces the hook's ask instead of silently approving it.
6. A hook allow can bypass the prompt only when `requireCanUseTool` is false and no stronger rule,
   safety, or required-interaction condition remains.
7. Hook timeout, transport failure, or cancellation stops execution when no prior safe decision exists;
   deferred hooks are re-emitted through PreToolUse when their tool resumes.

**Why this approach:**
- Hooks are extensibility points and may be repository-controlled; they must not outrank managed deny
  rules or tool safety checks.
- Validating rewritten input prevents a hook from smuggling malformed values around the normal schema.
- Preserving the hook ask floor gives administrators a reliable “human must see this” mechanism even
  in auto mode.
- The trade-off is a second permission pass after hooks, but it closes time-of-check/input-rewrite
  gaps.

**Key insight:** A hook may propose a permission outcome, but deterministic policy adjudicates the
hook's actual post-rewrite input.

### Bash permission analysis and fail-closed aggregation

**What it does:** Decomposes shell text into commands, matches exact/prefix rules, detects destructive
or ambiguous behavior, and generates the smallest safe persistent suggestions.

**How it works:**
1. `checkBashPermissions` (`EV_`, `cli_inner_pretty.js:337556-337813`) parses the command into an AST
   and semantic command list. Parser “too complex” and semantic-gap results first run special safety
   analyzers; unresolved structure falls back to ask.
2. `matchBashRules` (`Vbn`, `:336851-336915`) produces several canonical candidates: redirection-free,
   wrapper-stripped, environment-stripped, exact, prefix, wildcard, and `xargs` forms. Deny/ask
   matching may be broader than allow matching.
3. Exact deny and ask rules are evaluated before prefix allows. Compound commands are checked both as
   a whole and per subcommand, so allowing one visible prefix cannot cover an unrelated second action.
4. Redirects, environment assignments, `/dev/tcp`, command/process substitutions, ambiguous shell
   parameter expansion, background `&`, and directory changes alter or invalidate automatic approval.
5. Catastrophic removal analysis resolves current/extra workspace directories, variables that collapse
   to root, glob traversal, command substitutions, and `cd` plus deletion. Unresolvable targets require
   approval and cannot be converted into broad allow suggestions.
6. Repeated identical subcommand strings retain the strongest outcome (`deny > ask > passthrough >
   allow`), preferring a safety reason when severities tie.
7. Suggested allow rules are deduplicated and capped; only unresolved subcommands contribute, avoiding
   a grant broader than the command the user reviewed.

**Why this approach:**
- Shell text is a program, so display-prefix matching alone is insufficient.
- Conservative parser gaps protect against dialect changes and deliberately crafted syntax; the cost
  is occasional prompts for benign complex commands.
- Per-subcommand aggregation yields useful explanations and narrow grants while preserving the worst
  result.
- Static destructive analysis blocks known catastrophic shapes before the model classifier, whose
  probabilistic reasoning is inappropriate for filesystem-root guarantees.

**Key insight:** An allow rule applies to a verified semantic span, not merely a character prefix. Any
part the parser cannot faithfully expose moves the call toward ask, never hidden allow.

### PowerShell accept-edits boundary

**What it does:** Allows a constrained set of filesystem cmdlets in `acceptEdits` mode while rejecting
PowerShell constructs that make paths or command effects non-static.

**How it works:**
1. `checkPowerShellAcceptEdits` (`y6s`, `cli_inner_pretty.js:347920-348026`) is inactive for bypass and
   dont-ask and only attempts automatic approval in `acceptEdits`.
2. Parse failure, subexpressions, script blocks, member calls, splatting, assignments, stop-parsing,
   expandable strings, expression pipeline sources, and path-resolved applications fall through to
   approval.
3. Directory-changing commands combined with writes are rejected from the fast path because later path
   validation would use a stale current directory.
4. `New-Item` link/junction/hardlink creation is excluded because a subsequently validated path could
   traverse the newly created link.
5. Quote-like characters—including smart Unicode quotes—and the historical U+180E separator mark
   path arguments as unsafe for static resolution in the target helper at `:348052-348089`.
6. Only recognized write cmdlets with statically resolvable, protected-path-safe arguments return
   `allow` for accept-edits mode.

**Why this approach:**
- PowerShell's expression-rich grammar makes token text alone unreliable; AST element types provide a
  stronger boundary.
- Explicitly rejecting lookalike quotes addresses a class of visual/parser differentials.
- Link creation and current-directory changes can invalidate a correct path check after the fact, so
  the fast path refuses those time-of-check/time-of-use shapes.
- The trade-off is prompting for legitimate scripts that use variables or richer pipelines.

**Key insight:** “File-writing cmdlet” is not sufficient for auto-approval. The target also requires a
static path and stable filesystem topology.

### Auto-mode admission and fast paths

**What it does:** Applies a model classifier only to residual, eligible asks and avoids the classifier
when deterministic execution policy already establishes safety.

**How it works:**
1. Auto availability requires no circuit breaker or managed disable, a supported model, and a provider
   that permits classification (`isAutoModeAvailable`, `aU`, `cli_inner_pretty.js:579806-579810`).
2. `decideToolPermission` (`fK_`, `:343400-343806`) begins with deterministic evaluation. A direct
   allow resets the consecutive-denial counter.
3. Dont-ask mode converts residual asks to deny. Auto/eligible plan/browser floors continue only if no
   non-approvable safety check, sandbox override, user ask rule, organization ceiling, plan floor,
   required interaction, or workflow-consent prompt blocks classification.
4. Before calling a model, the engine simulates `acceptEdits` with dangerous whole-tool grants removed.
   If the tool would then be allowed, it records a high-confidence fast-path allow.
5. A small explicit safe allowlist provides a second deterministic fast path.
6. Remaining calls are serialized per agent by `AutoModeClassifierQueue` (`G4d`,
   `:339852-339896`). Same-turn sibling tool calls are included so parallel decisions share causal
   context and can reuse the cached transcript prefix.
7. After queue wait, the engine re-resolves effective mode and auto-active state. A changed mode
   invalidates the queued verdict and falls back to the new mode's prompt/deny behavior.

**Why this approach:**
- Deterministic fast paths reduce cost and latency and are easier to audit than a model decision.
- Per-agent serialization prevents concurrent calls from each assuming the others do not exist;
  same-turn context preserves parallel-call intent.
- Revalidation after the queue closes the race fixed in the post-2.1.220 window: a verdict derived
  under one mode cannot commit after the user changes modes.
- The trade-off is queue latency, mitigated by cache-safe transcript reuse and deterministic bypasses.

**Key insight:** The classifier is a residual adjudicator. It never replaces rules, safety checks, or
mode state, and its verdict is commit-checked after waiting.

### Classifier transcript, staged decision, and failure semantics

**What it does:** Builds a compact causal transcript, performs staged classification, and distinguishes
policy blocks from infrastructure/refusal failures.

**How it works:**
1. `classifyAutoModeAction` (`Iqt`, `cli_inner_pretty.js:383389-383527`) serializes user intent,
   relevant assistant narration, tool calls, structured outcomes, queued human/peer origins, and the
   current action. Tool-specific serializers remove irrelevant or secret-bearing fields.
2. Previous outcomes say whether a call ran, failed, was interrupted, or was denied; an earlier `ok`
   is explicitly not treated as safety precedent for a later action.
3. Optional repository visibility and git-status facts are added for destination-aware actions. The
   stable transcript prefix receives cache control before the current action.
4. Stage 1 is a small fast severity/block probe. A clear allow returns immediately; a possible block
   or parse ambiguity escalates to the full reasoning stage, depending on configured mode.
5. Primary model unavailability or a safeguard refusal can invoke a bounded fallback classifier with
   the remaining timeout. Usage and duration are combined without confusing primary and fallback
   provenance.
6. Unavailable or unparsable classification fails closed with retry guidance. A safety-filter refusal
   is also denied, but marked `noVerdict` and excluded from the consecutive policy-block counter.
7. Genuine blocks increment consecutive/total counters. At the threshold, interactive sessions fall
   back to human prompting; headless sessions abort to avoid an infinite retry loop.

**Why this approach:**
- Causal tool outcomes and agent narration let the classifier judge delayed effects rather than one
  isolated command string.
- A fast stage reduces average cost; the full stage preserves reasoning quality for ambiguous or
  high-severity actions.
- Infrastructure failure must not become allow, but counting it as a policy block would incorrectly
  trip retry limits. The same distinction implements the 2.1.225 safeguard-refusal fix.
- The trade-off is a complex taxonomy (`blocked`, `unavailable`, `refused`, parse failure), necessary
  for safe retry and accurate telemetry.

**Key insight:** “Denied now” and “classifier judged unsafe” are different facts. Only an actual policy
verdict advances the consecutive-block circuit.

### Headless and background-agent resolution

**What it does:** Ensures an action that requires human approval cannot run merely because the current
execution context lacks a dialog.

**How it works:**
1. When `shouldAvoidPermissionPrompts` is true, the engine first offers the `PermissionRequest` hook/
   host control path (`resolveHeadlessPermission`, `pK_`, `cli_inner_pretty.js:343064-343101`).
2. An allow with updated input is run through deterministic deny/ask checks again. Updated permissions
   are applied and persisted only after validation.
3. A hook denial is final and may abort the parent when requested.
4. If no host decision is available, residual ask becomes a structured async-agent deny; it is not
   converted to allow.
5. Background summaries, compaction, renames, and similar agent tasks retain tool restrictions even
   when a PreToolUse hook returns allow, matching the 2.1.222 hardening.
6. Worktree-isolated sessions apply their isolation policy to Bash as well as file tools, preventing a
   subagent from using git commands against the main checkout.

**Why this approach:**
- Absence of a UI is not consent.
- Rechecking host-rewritten input closes the same hook mutation gap as the interactive path.
- Host hooks provide a deliberate noninteractive approval channel without granting every headless
  action.
- The trade-off is that unattended work may stop on an action an interactive user would approve; this
  is the required fail-closed behavior.

**Key insight:** Headless changes the resolution surface, not the permission standard.

## Post-2.1.220 hardening map

- **2.1.221:** zsh `[[ ]]` regex execution and PowerShell quote-containing paths now fall out of static
  auto-approval; auto-mode queue revalidation and cached-prefix reuse are visible in the current
  engine.
- **2.1.222:** worktree isolation covers Bash, background-task hooks cannot bypass restrictions, and
  cross-session `SendMessage` is routed through auto-mode classification.
- **2.1.223:** organization bypass-disable policy applies to agent definitions. The two release-note
  fixes for hidden Bash parts and tab/invisible-Unicode prompt rendering remain endpoint-unanchored in
  `changelog_to_code_map.md`; the target's parser-first and display-control validation are consistent
  with the hardened outcome but do not prove the exact intermediate patch.
- **2.1.224:** sandbox deny-path normalization and violation reporting strengthen the enforcement layer
  after permission approval; see `49_sandbox`.
- **2.1.225:** classifier safeguard refusal denies the action but is explicitly excluded from the
  consecutive-block limit.
- **2.1.227:** the GitHub Action `allowed_non_write_users` repair is action/runtime-specific; it does
  not replace this core policy pipeline.

## 2.1.220 to 2.1.227 conclusion

- The provenance-aware rule lattice, shell static analysis, PreToolUse arbitration, staged classifier,
  and fail-closed headless posture remain the core architecture and are re-anchored here.
- The target tightens commit-time validation: queued classifier results, hook-updated inputs,
  worktree context, and per-server mode floors are checked at the point where they can still affect
  execution.
- Classifier outcome taxonomy is more precise: policy block, safeguard refusal, unavailability, parse
  failure, and transcript overflow lead to different retry/counter behavior.
- Exact intermediate-release attribution is kept separate from endpoint proof, especially for the two
  2.1.223 rendering/parser bullets.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `applyPermissionUpdate` (`UH`) - permission-context reducer.
- `effectiveModeForTool` (`hrt`) - per-tool mode resolution.
- `checkRuleBasedPermissions` (`JHt`) - deterministic policy floor.
- `evaluateToolPermission` (`yK_`) - mode/allow decision.
- `decideToolPermission` (`fK_`) - classifier and headless coordinator.
- `resolveHeadlessPermission` (`pK_`) - noninteractive host hook path.
- `arbitratePreToolHook` (`VSn`) - hook-versus-policy reconciliation.
- `matchBashRules` (`Vbn`) - canonical Bash rule matching.
- `checkBashPermissions` (`EV_`) - Bash permission state machine.
- `checkPowerShellAcceptEdits` (`y6s`) - PowerShell static fast path.
- `AutoModeClassifierQueue` (`G4d`) - per-agent classifier serialization.
- `enqueueAutoModeClassifier` (`W4d`) - queue entry point.
- `classifyAutoModeAction` (`Iqt`) - staged classifier and fallback.
- `isAutoModeAvailable` (`aU`) - availability gates.
