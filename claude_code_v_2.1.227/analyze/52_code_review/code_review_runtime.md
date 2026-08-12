# Code Review Runtime Architecture in 2.1.227

## Scope

The 2.1.227 review subsystem is one feature with three execution surfaces:

1. Local inline review for contexts that must remain in the active turn.
2. Local fork or workflow-backed review for isolated, broader analysis.
3. `ultra` cloud review, which validates and packages a PR or branch before launching a remote task.

[`review_alias_and_effort_memory.md`](./review_alias_and_effort_memory.md) proves the post-2.1.220 alias
and remembered-effort changes. This document analyzes the entire current decision pipeline, including
model-specific prompt selection, adaptive concurrency advice, structured finding lifecycle, cloud scope
validation, empty-tree recovery, and opt-in PR posting.

## Local review algorithms

### Single-parse command state

**What it does:** Converts `/code-review` or its `/review` alias into one normalized state shared by all
later routing, prompt, telemetry, and UI decisions.

**How it works:**
1. `registerCodeReviewCommand` (`dyh`, `:865096-865132`) registers `/code-review`, aliases `/review`, and
   maps the `ultra` subcommand to the cloud-review command.
2. `parseCodeReviewArgs` (`GYn`, `:864770-864807`) extracts `--comment`, `--fix`, `--post`, and
   `--no-post` before interpreting positional tokens.
3. A leading `ultra` becomes an explicit `ultraFallback` state rather than a normal effort value.
4. A recognized first positional token becomes the explicit effort. `normalizeReviewTarget` (`j3l`) then
   removes wrapping backticks and a leading PR hash from the remaining target.
5. A token that resembles an effort prefix but is not valid is saved as `unrecognizedLevel`; unrelated
   branch/path text remains target text.
6. The resulting object is reused by effective-effort resolution, route selection, prompt construction,
   telemetry, and user notices.

**Why this approach:**
- Parsing once prevents small differences between command registration, telemetry, and the generated
  prompt from changing the meaning of the same invocation.
- Flags are orthogonal to target and effort, so extracting them first permits combinations such as
  `high --fix <branch>` without maintaining separate grammars.
- Treating `ultra` as a route request rather than an effort preserves a local maximum-effort fallback
  when cloud review is unavailable.
- The parser is permissive about unknown words because valid git refs and paths are open-ended. The cost
  is delayed validation, mitigated by an explicit notice for effort-like mistakes.

**Key insight:** The alias is safe because it shares typed state, not merely a similar prompt. Every
downstream branch sees exactly the same normalized invocation.

### Persisted effort with policy-aware resolution

**What it does:** Reuses the last effort the user explicitly typed while allowing session defaults,
model capabilities, and organization restrictions to determine the effective runtime effort.

**How it works:**
1. `getLastCodeReviewEffort` (`aBv`) reads persisted `codeReviewLastEffort` and rejects values no longer
   accepted by the current validator.
2. `setLastCodeReviewEffort` (`lBv`) runs only from `onUserTypedArgs` and only when the parser found an
   explicit level. Defaults and fallbacks never overwrite user intent.
3. `getReusableCodeReviewEffort` (`q3l`) suppresses reuse during skill preload and `ultra` fallback.
4. `resolveCodeReviewEffort` (`G3l`) applies precedence: `ultra` maps to `max`; otherwise explicit level,
   remembered level, session level, then `medium`.
5. Host/model policy can step that value to an allowed level before final normalization.
6. The command's default-effort callback reports both the remembered and effective values when they
   differ, and the prompt notice explains how to change the stored preference.

**Why this approach:**
- Remembering only explicit input prevents an automatic downgrade or environmental fallback from becoming
  a surprising future default.
- Revalidation provides forward compatibility if an effort level is removed or renamed.
- Policy is applied after intent selection, preserving the user's preference whenever allowed without
  bypassing managed restrictions.
- Persistent convenience makes omitted arguments less self-evident, so visibility through notices is an
  essential part of the design rather than decorative UI.

**Key insight:** The state stores requested intent; the resolver computes permitted execution. Keeping
those two values distinct makes persistence compatible with changing models and policies.

### Model-family review-cell selection

**What it does:** Selects a review prompt strategy and model effort that have been tuned for the active
model family rather than assuming one prompt scales uniformly across models.

**How it works:**
1. The frozen `CODE_REVIEW_MODEL_MATRIX` (`YVr`, `:865192-865218`) maps the default family, Sonnet 5,
   Opus 4.8, and Opus 5 across low, medium, high, xhigh, and max review efforts.
2. Each matrix cell names a prompt cell, says whether model effort follows the typed value, and can enable
   a finder-budget hint or mark a strategy as externally measured.
3. `buildCodeReviewPrompt` (`dBv`) derives the canonical model family, falling back to `default` for
   unsupported preload contexts.
4. `selectReviewPromptCell` (`rBv`, `:864700-864724`) dispatches the selected cell to a concrete prompt
   generator.
5. Low Sonnet, Opus 4.8 variants, and the Opus 5 bounded-minimum cell can therefore use different prompt
   shapes even when the user-facing effort label is the same.
6. The matrix and its cells are frozen after initialization to prevent plugins or later runtime code from
   mutating review semantics mid-session.

**Why this approach:**
- Agent count, decomposition instructions, and effort wording interact with model behavior. A universal
  prompt is simpler but can over-coordinate one model and under-search another.
- A data matrix isolates calibration from routing code and makes fallbacks explicit.
- Freezing provides determinism, but updating calibration requires a release rather than live mutation.
- Family normalization avoids exploding the matrix for every dated model ID while retaining targeted
  behavior where evidence supports it.

**Key insight:** “High review effort” is a product-level request, not a literal prompt. The matrix compiles
that request into a model-specific execution cell.

### Capability-gated inline, fork, and workflow routing

**What it does:** Places review work in the cheapest execution context that still provides the required
isolation and tools.

**How it works:**
1. Registration keeps review inline for forced-inline surfaces and when structured findings already bind
   the review to the current interactive context.
2. `canRouteCodeReviewWorkflow` (`uyh`, `:864996-865003`) requires high-or-above effort, a normal
   interactive session, workflow availability, a Skill tool, and the routing gate.
3. If workflow routing is selected, `buildCodeReviewPrompt` emits a Skill invocation containing effective
   effort and target, plus any review constraints from the conversation.
4. If workflow routing is unavailable and inline is not required, `getContext` returns `fork`, isolating
   the review's large search transcript from the parent context.
5. Inline/fork prompt construction uses the selected model cell and appends only compatible instructions
   for `--comment`, `--fix`, findings reporting, artifact publication, and optional post-review verification.
6. Route, effort source, model family, tool availability, flags, and finder budget are recorded together
   in the routing event.

**Why this approach:**
- Small or tool-bound reviews avoid workflow startup overhead, while broad reviews gain isolation and
  parallel orchestration.
- Routing checks actual capabilities rather than trusting configuration alone, preventing prompts that
  name unavailable tools.
- Forking is a robust fallback because it needs less infrastructure than a workflow while still protecting
  the main conversation's context window.
- The decision matrix is more complex than always forking, but it reduces latency for small work and
  produces better failure behavior in headless/preload contexts.

**Key insight:** Effort doubles as a scheduling hint. The same resolved value controls model behavior and
whether coordination overhead is worth paying.

### Diff-proportional finder budget

**What it does:** Suggests a bounded number of finder subagents based on the measured diff size for review
cells that benefit from adaptive parallel search.

**How it works:**
1. `buildFinderBudgetHint` (`fBv`, `:864921-864939`) returns immediately unless the selected model cell
   enables `finderBudgetHint`.
2. `measureReviewDiffLines` (`mBv`, `:864940-864988`) accepts the default upstream range or a narrowly
   validated explicit git range; arbitrary prose/paths are not executed as refs.
3. Git runs with hooks, fsmonitor, prompts, credential helpers, and lazy fetching disabled, a five-second
   timeout, and `--no-ext-diff --no-textconv`.
4. Numeric additions and deletions from `--numstat` are summed; binary rows and malformed output do not
   inflate the number.
5. The hint computes `ceil(lines / 150)`, clamps it to two through eight finders, and labels the default
   committed-diff measurement as a floor because uncommitted scope may be discovered later.
6. Measurement failure silently removes the hint; it never blocks the review itself.

**Why this approach:**
- A fixed large fleet wastes startup and synthesis work on tiny diffs; a single finder undersamples large
  changes.
- A coarse linear heuristic is predictable and cheap. It is guidance rather than a hard concurrency limit,
  allowing the review agent to adjust after discovering actual scope.
- Disabling external diff drivers makes the measurement repository-independent and avoids executing local
  configuration during a read-only sizing probe.
- Best-effort failure preserves review availability in unusual repositories, at the cost of falling back
  to the prompt's non-adaptive default.

**Key insight:** Parallelism is sized from evidence but not enforced from incomplete evidence. The initial
diff statistic seeds the plan without pretending it describes all later-discovered work.

### Structured findings and outcome reconciliation

**What it does:** Chooses between prose findings and the `ReportFindings` tool, then keeps each finding's
UI state synchronized when `--fix` or later work resolves it.

**How it works:**
1. `isExplicitReportFindingsMode` (`W3l`, `:864726-864731`) enables the tool when the environment variable
   requests it, the output is interactive, and the tool is actually present.
2. `canUseReportFindings` (`nBv`, `:864732-864741`) otherwise requires tool presence, interactive output,
   non-low effort, and the feature gate.
3. `buildCodeReviewPrompt` selects a structured-findings or prose synthesis instruction based on that
   result and the execution route.
4. Structured reporting requires severity-sorted findings and a short summary no longer than 60 characters;
   no surviving issues are represented by an empty array rather than omitted output.
5. With `--fix`, the prompt applies safe findings and then calls `ReportFindings` again with each finding
   marked `fixed`, `no_change_needed`, or `skipped`.
6. A standing instruction repeats that reconciliation if findings are fixed later in the session, because
   prose alone does not update the host's per-finding state.

**Why this approach:**
- Structured results let the UI render, track, and update findings; prose remains the universal fallback
  for headless output and unavailable tools.
- Tool availability is checked independently from the gate so a prompt never invents an unusable call.
- Excluding low effort avoids coordination overhead when the review is intentionally narrow.
- A second reconciliation call duplicates some data but makes state transitions explicit and idempotent,
  instead of trying to infer fixes from later prose or diffs.

**Key insight:** Reporting a finding and resolving a finding are separate state transitions. The second
tool call is not redundant output; it is the commit step for the review UI's lifecycle.

## Cloud review algorithms

### PR-or-branch scope classifier and recovery ladder

**What it does:** Determines whether `ultra` should review a GitHub pull request or bundle a local branch,
while turning ambiguous input into actionable recovery instead of silently choosing the wrong scope.

**How it works:**
1. `resolveUltrareviewScope` (`PXo`, `:471415-471868`) first requires a git repository because cloud
   execution must clone or bundle source.
2. It normalizes PR URLs, `#123`, `PR 123`, and bare numbers. A URL is accepted only when host, owner, and
   repository match the current remote.
3. PR scope requires a GitHub remote and optionally queries `gh pr view` for changed-file and line counts.
4. Non-PR input is tested as a local/origin ref. Prose containing an embedded PR hint is refused with the
   exact normalized command the user should run.
5. `tryFetchBranchFromOrigin` (`f4b`, `:471883-471938`) probes a narrowly validated remote branch without
   credentials or prompts, then fetches only that ref when present.
6. If fetch cannot recover the ref, the resolver asks `suggestClosestBranchName` (`m4b`) for a bounded
   edit-distance suggestion and returns a typed `base_ref_not_found` result.
7. Descriptive multiword input that is neither a ref nor PR is retained as review instructions while the
   branch defaults normally.

**Why this approach:**
- Numeric and URL PR references are common enough to normalize, but cross-repository URLs must fail closed
  or the review could inspect a different checkout than the user intended.
- Automatic single-ref fetch repairs stale local refs without running a broad `git fetch`; disabling
  credential helpers prevents a validation probe from opening an authentication interaction.
- Typed reasons support targeted UI feedback and telemetry while a single resolver still owns scope.
- Treating unmatched prose as instructions is convenient, but only after explicit PR/ref shapes have been
  ruled out to avoid turning a typo into a different review.

**Key insight:** Input recovery is conservative: the runtime fixes representations and stale refs, but
never changes repository identity or silently guesses a different branch.

### Merge-base, empty-tree, and no-ref decision tree

**What it does:** Finds a meaningful branch comparison and distinguishes valid unrelated-history review
from shallow-clone, unborn-branch, detached-only, and empty-diff failures.

**How it works:**
1. The resolver chooses an explicit base, the detected default branch, or `main`, preferring `origin/base`
   when it resolves.
2. It asks git for the merge base with `HEAD`; success establishes the normal diff boundary.
3. On failure it independently checks whether `HEAD` exists, whether the repository is shallow, and whether
   any refs exist.
4. In a complete repository with refs, it attempts a diff against the git empty-tree SHA. A non-empty,
   bounded result becomes a valid branch scope marked `unrelated_history` or `base_ref_missing`.
5. An unborn branch is refused because there is no committed head. A shallow clone receives a deepen or
   unshallow hint. A repository with no refs receives a create-a-branch instruction.
6. For a valid merge base, an empty diff reports both the chosen base ref and abbreviated merge-base SHA,
   making an already-merged or wrong-base diagnosis possible.

**Why this approach:**
- “No merge base” is not one error. Unrelated complete histories can still be reviewed meaningfully against
  the empty tree, while shallow history may simply be missing locally.
- Checking repository facts before suggesting `--unshallow` avoids incorrect advice for already complete
  clones, which is the post-2.1.220 reliability improvement named in 2.1.223.
- Empty-tree review can represent an entire repository and therefore must pass the same size limits before
  launch.
- Typed branches make corrective messages precise at the cost of several git probes; these run once during
  cloud launch, not on the interactive rendering hot path.

**Key insight:** The empty tree is a correctness-preserving fallback only after proving the history is
complete enough that a missing merge base is real rather than an artifact of a shallow clone.

### Diff-bound enforcement with largest-file diagnostics

**What it does:** Prevents cloud review launch for scopes too large for the service while explaining how
to narrow the request.

**How it works:**
1. PR mode uses GitHub's additions, deletions, and changed-file metadata when available and compares them
   with the current service limits.
2. Branch mode runs a raw shortstat diff with external diff drivers and text conversion disabled.
3. File count and total changed lines are checked for normal merge-base and empty-tree scopes.
4. On overflow, a second raw `--numstat` query is bounded by timeout and output buffer.
5. `formatLargestChangedFiles` (`k$p`, `:471870-471878`) parses every numeric row, sorts descending by
   additions plus deletions, and reports the top three non-empty files.
6. The error names measured values, configured limits, largest contributors when available, and the exact
   closer-base or split-PR recovery.
7. A repository-pack preflight separately rejects a local repository too large to bundle, recommending a
   pushed PR instead.

**Why this approach:**
- Rejecting before upload avoids wasting network and remote compute on a task the service cannot finish.
- Shortstat is cheap for the success path; detailed numstat runs only after a failure needs explanation.
- Raw git blob semantics prevent repository-configured diff drivers from executing or distorting the size
  calculation.
- Reporting largest files turns a hard limit into a scope-editing decision, at the cost of one extra git
  command only on rejected reviews.

**Key insight:** The second measurement is diagnostic work paid only on failure. Fast admission and useful
rejection do not have to share the same data path.

### Consent-bound, sanitized single-comment posting

**What it does:** Optionally publishes completed cloud-review findings to a GitHub PR through a narrowly
constrained routine without granting the review task general GitHub write authority.

**How it works:**
1. Posting is available only for an explicitly requested GitHub PR review and remains tied to the launching
   session's consent.
2. `prepareUltrareviewPostPayload` (`A2b`, `:464974-464998`) parses only an array, projects an allowlisted
   set of finding fields, sanitizes payload delimiters and dedupe markers, and sorts by severity.
3. The serialized payload is capped at 60 KiB by removing least-severe tail findings and recording the
   omitted count; a random run ID supports deduplication.
4. `ensureUltrareviewPostRoutine` (`v2b`, `:464887-464920`) verifies a stored routine's name and version,
   updates an old routine, replaces stale/mismatched routines, or creates a new one in a cloud environment.
5. The routine's system instructions allow exactly one `add_issue_comment` call and prohibit reviews,
   approvals, merges, pushes, edits, and following instructions embedded in findings or PR content.
6. A missing routine during fire causes one cache clear and recreation retry; other HTTP/auth/routine
   failures become explicit “not posted” results.
7. `postUltrareviewFindings` (`lXo`, `:465041-465100`) races setup/fire against a 90-second deadline and
   warns that an ambiguous timeout may still have reached GitHub, preventing unsafe blind retry advice.

**Why this approach:**
- A separate posting routine isolates write authority from the analysis task and limits both tool set and
  operation count.
- Treating remote findings as untrusted data prevents prompt injection in code or finding text from
  expanding the routine's authority.
- Versioning cached routines permits security/instruction changes without silently reusing an older shape.
- At-least-once network ambiguity cannot be eliminated without a server idempotency key. The embedded run
  marker and “check before manual retry” warning reduce duplicate-comment risk.

**Key insight:** Posting is a second, consent-scoped transaction. The cloud review produces data; a
separately constrained actor is allowed to perform one specific write with that data.

## Current-build assessment

The current implementation retains the core 2.1.220 decomposition and cloud precondition concepts but
has substantially evolved around them. In 2.1.227, `/review` is no longer a shallow alternate entry point;
effort is persisted; model families select calibrated cells; some broad reviews size their finder fleet
from the diff; structured findings have a resolution lifecycle; no-merge-base advice distinguishes shallow
and complete repositories; and cloud PR posting is a dedicated least-authority workflow.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions and objects in this document:
- `registerCodeReviewCommand` (`dyh`) - unified command and route registration.
- `resolveCodeReviewEffort` (`G3l`) - intent/default/policy precedence.
- `CODE_REVIEW_MODEL_MATRIX` (`YVr`) - model-family prompt-cell calibration.
- `buildCodeReviewPrompt` (`dBv`) - local/workflow prompt assembler.
- `buildFinderBudgetHint` (`fBv`) - diff-proportional parallelism hint.
- `canUseReportFindings` (`nBv`) - structured result capability gate.
- `resolveUltrareviewScope` (`PXo`) - PR/branch validation and recovery ladder.
- `tryFetchBranchFromOrigin` (`f4b`) - narrow remote-ref recovery.
- `formatLargestChangedFiles` (`k$p`) - rejection diagnostic builder.
- `prepareUltrareviewPostPayload` (`A2b`) - allowlisted, bounded posting payload.
- `ensureUltrareviewPostRoutine` (`v2b`) - versioned least-authority routine lifecycle.
- `postUltrareviewFindings` (`lXo`) - bounded routine fire and outcome handling.
