# Unified `/review` alias and remembered code-review effort

## Version result

This is a direct 2.1.220-to-2.1.227 implementation delta matching the two 2.1.223 changelog entries:

- 2.1.220 registers a separate built-in `review` prompt at `cli_inner_pretty.js:497637-497648`. It
  accepts a pull-request number and explicitly sends working-diff users to `/code-review`.
- 2.1.227 registers `aliases: ["review"]` on `/code-review` at `:865096-865132`; both spellings now enter
  the same parser and routing pipeline.
- `codeReviewLastEffort`, its validated reader, and its update callback are present in the target command
  path, supplying the persisted default described in the changelog.

The release attribution is supplied by the changelog because intermediate bundles are unavailable. The
replacement of the standalone command is independently visible across the two available bundles.

### Unified Command Registration and Parsing

**What it does:** Sends `/review` and `/code-review` through one grammar that can review the current diff,
a pull request, a branch/range/path target, or request an ultra cloud review.

**How it works:**
1. `registerCodeReviewCommand` (`dyh`, `:865096-865132`) registers the canonical command name and the
   single `review` alias, so aliases cannot drift into a separate prompt implementation.
2. `parseCodeReviewArgs` (`GYn`, `:864770-864807`) first extracts the orthogonal flags `--comment`,
   `--fix`, `--post`, and `--no-post`.
3. A leading `ultra` is represented as `ultraFallback: true`, not as an ordinary effort enum. This keeps
   cloud availability and local fallback handling explicit.
4. A recognized effort token becomes `explicit`; the remaining tokens are normalized into a target by
   `normalizeReviewTarget` (`j3l`, `:864766-864768`). Backticks and a leading PR `#` are removed.
5. A token that looks like an effort word but is not valid is recorded as `unrecognizedLevel`; otherwise
   it remains part of the target. This prevents a branch such as `feature/highlight` from being consumed
   as a malformed level.
6. The parsed object is reused by effort, context, telemetry, and prompt construction instead of each
   consumer reparsing the raw command.

**Why this approach:**
- One registered command makes `/review` a compatibility spelling rather than a second feature whose
  accepted targets and safety behavior can diverge.
- Parsing flags separately makes them composable with every effort and target form.
- Keeping `ultra` outside the normal enum preserves a reliable local fallback when cloud review is not
  available.
- The permissive target fallback favors valid branch/path syntax. Its trade-off is that malformed effort
  text must be surfaced later by a notice rather than rejected during tokenization.

**Key insight:** The important change is not the alias string itself. The alias collapses two formerly
different semantic entry points into one typed command state that every downstream decision shares.

### Remembered Effort Selection

**What it does:** Reuses the last effort explicitly typed by the user only when the next invocation omits
an effort, while preserving session and organization policy.

**How it works:**
1. `getLastCodeReviewEffort` (`aBv`, `:864809-864811`) reads `codeReviewLastEffort` from persisted state and
   validates it with the current effort validator. Stale or unknown values become absent.
2. `setLastCodeReviewEffort` (`lBv`, `:864813-864814`) performs an idempotent state update.
3. The command's `onUserTypedArgs` callback stores a value only when `parseCodeReviewArgs` found an
   explicit effort. A default or fallback never overwrites remembered user intent.
4. `getReusableCodeReviewEffort` (`q3l`, `:864816-864818`) returns the saved value only when no effort was
   typed, the command is not an `ultra` fallback, and this is not skill preloading.
5. `resolveCodeReviewEffort` (`G3l`, `:864989-864996`) applies precedence: ultra maps to `max`; otherwise
   explicit effort wins, then remembered effort, then the session effort, then `medium`.
6. Host/model policy may translate the chosen effort before normalization. The UI default callback and
   prompt notice report both the remembered value and the effective value if policy changed it.

**Why this approach:**
- Persisting only explicit input prevents an automatic fallback from silently becoming the user's new
  preference.
- Re-validating stored state lets future releases remove or rename effort levels safely.
- Applying policy after user/default precedence respects intent without bypassing host restrictions.
- Persistence improves repetitive review workflows, but can make an omitted argument less obvious. The
  command therefore emits a notice and says how to change the value.

**Key insight:** Remembering a default is safe because the implementation remembers intent, not outcome:
only a level the user actually typed is stored.

### Execution-context Routing

**What it does:** Chooses whether the review is expressed inline, handed to a workflow, or run in a forked
context, then builds a prompt consistent with that route.

**How it works:**
1. The command registration's `getContext` keeps review inline for forced-inline surfaces and working
   modes that cannot fork.
2. `canRouteCodeReviewWorkflow` (`uyh`, `:864996-865003`) permits workflow routing only for high-or-above
   efforts, interactive sessions, an available Skill tool, and an enabled experiment.
3. Remaining eligible invocations use fork context so review work does not crowd the parent conversation.
4. `buildCodeReviewPrompt` (`dBv`, `:864832-864941`) resolves provider/model policy, decides whether a
   findings-report tool is available, and records the route and effort source in telemetry.
5. Workflow routing emits a Skill invocation with the effort and target. Inline/fork routing emits the
   matching review prompt and optional `--comment`/`--fix` instructions.
6. `buildCodeReviewEffortNotice` (`hBv`, `:865004-865092`) explains invalid levels, reused effort, ultra
   fallback, and ignored cloud-only flags. Notices are shaped so they still reach the user when the review
   runs in a fork.

**Why this approach:**
- Expensive broad reviews benefit from isolation or a background workflow, while small reviews avoid that
  coordination overhead.
- Capability checks are performed before routing so the generated prompt never asks for an unavailable
  tool or cloud operation.
- Route-specific notices make fallbacks observable instead of silently changing execution quality.
- The trade-off is a larger decision matrix, offset by deriving all branches from the same parsed state
  and effective-effort resolver.

**Key insight:** Effort is both a quality preference and a scheduling signal. The resolved level controls
not only model behavior but whether the review stays inline, forks, or enters a workflow.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `registerCodeReviewCommand` (`dyh`) - canonical registration and alias.
- `parseCodeReviewArgs` (`GYn`) - command grammar.
- `getLastCodeReviewEffort` (`aBv`) - validated persisted preference.
- `setLastCodeReviewEffort` (`lBv`) - idempotent preference update.
- `resolveCodeReviewEffort` (`G3l`) - precedence and policy resolution.
- `buildCodeReviewPrompt` (`dBv`) - route-specific prompt construction.
