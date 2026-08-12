# Admission and resource limits

The resource controls are intentionally independent. A successful agent launch must pass recursive
depth, policy, abort, USD-budget, and concurrency checks, but it is no longer charged against a
monotone lifetime quota.

### Three-tier depth resolution

**What it does:** Resolves the maximum child-agent nesting depth once per process while preserving an
explicit operator override.

**How it works:**
1. `getMaxSubagentSpawnDepth` (`v6`, `cli_inner_pretty.js:206060-206068`) first reads
   `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` from the parsed environment object.
2. A defined environment value returns immediately and therefore wins over experimentation.
3. Otherwise the function reads `tengu_hazel_trellis` with default `3`.
4. Only an integer greater than or equal to one is accepted; every other feature value falls back to
   `3`.
5. The accepted value is cached in `mIs`, avoiding repeated feature-service reads during prompt and
   tool construction.

**Why this approach:**
- Environment precedence gives operators a deterministic emergency and testing control.
- Validating only the remotely delivered value relies on typed environment parsing upstream while
  defending against malformed experiment payloads.
- A process cache keeps all gates internally consistent; the trade-off is that a feature refresh
  cannot change nesting depth mid-session.
- A minimum of one guarantees the main conversation can still create a first-level worker.

**Key insight:** The cache is a consistency mechanism, not merely an optimization: prompt text,
available tools, and runtime admission all observe the same ceiling for the process lifetime.

### Layered depth enforcement

**What it does:** Prevents agents at the cap from advertising, receiving, or successfully invoking
the Agent tool.

**How it works:**
1. `getAgentDepth` (`nk`, `cli_inner_pretty.js:109718-109721`) maps the main agent to zero and reads a
   child's stored `depth`, defaulting missing legacy values to zero.
2. Worker prompt builders include the Agent tool and fan-out prose only when the global ceiling is
   greater than one (`207338-207374`, `244562-244565`).
3. `filterToolsForAgent` (`K5b`, `483076-483091`) retains Agent only while the child's depth is less
   than the ceiling.
4. The Agent call checks the caller depth before agent-type resolution, MCP waits, worktree creation,
   or task registration (`550853-550864`).
5. Forked skills independently refuse when their computed child depth exceeds the same ceiling
   (`479911-479913`).
6. Reachability hints and auxiliary analyst agents use the same resolver, avoiding suggestions that
   would fail at invocation time (`566454-566456`, `569996-570097`, `577637-577642`).

**Why this approach:**
- Prompt suppression reduces invalid model choices but cannot be the security boundary.
- Tool filtering removes the capability from normal child schemas.
- Runtime enforcement covers stale schemas, exact-tool hosts, and crafted direct calls.
- Reusing one resolver avoids off-by-one drift, at the cost of repeated checks across layers.

**Key insight:** The schema predicate evaluates the **child** (`childDepth < limit`), while runtime
admission evaluates the **caller** (`callerDepth >= limit`). They are complementary views of the same
boundary rather than contradictory comparisons.

### Live concurrency semaphore

**What it does:** Limits simultaneously running subagents without limiting how many completed agents
a long session may create.

**How it works:**
1. `getMaxConcurrentSubagents` (`V7u`, `cli_inner_pretty.js:206854-206856`) returns the environment
   override or default `20`.
2. Agent admission compares the task registry's `runningSubagents` gauge with that ceiling
   (`550923-550935`).
3. A feature override (`tengu_amber_kestrel`) and the high-effort/model predicate may bypass the
   refusal; ordinary callers receive a terminal instruction not to retry.
4. After all preflight work, `takeConcurrencySlot` increments app state and returns a release closure
   (`352596-352607`, `550936-550939`).
5. The release closure has a private boolean, so repeated cleanup paths decrement at most once.
6. Decrement clamps at zero, preventing a cleanup bug from producing negative capacity.
7. Forked skills and resumed background agents also take slots; observer activity deliberately uses
   a no-op slot (`484151`, `566100`).

**Why this approach:**
- App state makes the gauge visible to all execution routes and UI/state consumers.
- An idempotent closure localizes ownership and survives exceptions, auto-backgrounding, and layered
  cleanup.
- Checking before acquisition is simple in the single event loop, though it is not a general
  multi-process semaphore.
- Bypasses preserve high-effort fan-out experiments but make the nominal ceiling policy-dependent.

**Key insight:** `runningSubagents` is a gauge, not a historical count. Slot lifetime follows the
actual run, even if its presentation changes from foreground to background.

### Lifetime spawn-cap removal

**What it does:** Removes the 2.1.220 limit that rejected the 201st subagent created during a session,
while leaving live-load and recursive-safety controls intact.

**How it works:**
1. In 2.1.220, the bundle exported/read `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION`, defaulted it to 200,
   incremented a task-registry closure counter, and refused at Agent admission (`2.1.220:32124`,
   `58164`, `231403`, `398397`).
2. In 2.1.227, the environment name appears only in the recognized-settings allowlist at line 55013.
3. There is no accessor, no task-registry lifetime counter, no increment, and no Agent refusal text.
4. `/clear` no longer resets a subagent lifetime count; it only resets WebSearch accounting when no
   tasks survive (`405066-405070`).
5. Depth, concurrency, USD budget, and task cleanup remain separate and active.

**Why this approach:**
- A lifetime count conflates cumulative useful work with resource pressure: 200 sequential finished
  agents consume little simultaneous capacity but were permanently blocked.
- Removing it supports long-running sessions without weakening controls on recursion or current load.
- Retaining the allowlist string is compatibility residue; removing it could make an existing managed
  setting fail validation even though it has no runtime effect.
- The trade-off is that total agent churn is no longer bounded by this local mechanism; economic and
  concurrency budgets carry that responsibility.

**Key insight:** The changelog means “no cumulative spawn quota,” not “unlimited fan-out.” Twenty
default live slots and the depth ceiling still bound the shape of active work.

### WebSearch session budget

**What it does:** Caps WebSearch calls per conversation epoch and turns excess calls into model-readable
results instead of execution errors.

**How it works:**
1. `getMaxWebSearchesPerSession` (`K7u`, `cli_inner_pretty.js:206857-206858`) returns the environment
   value or default `200`.
2. WebSearch reads the registry count before incrementing (`554337-554342`).
3. If `count >= limit`, it records telemetry and returns a synthetic zero-result payload that tells
   the model to continue or ask the user to raise the limit.
4. Only an admitted search increments the count (`554363`), before selecting proxy/native execution.
5. `/clear` resets the counter only when the reset left zero surviving tasks (`405070`).

**Why this approach:**
- Check-before-increment makes exactly `limit` searches admissible.
- Returning ordinary tool data prevents the model from treating a budget boundary as transient
  infrastructure failure and retrying automatically.
- Counting attempts before network completion prevents repeated failed requests from bypassing the
  budget; the trade-off is that a provider error still consumes one unit.
- Conditional reset avoids changing shared accounting while old tasks are still alive.

**Key insight:** This is a behavioral steering budget. Its refusal shape is designed to alter the
model's next decision, not to throw control back to the generic tool-error recovery loop.

### USD-budget admission and print-mode halt

**What it does:** Stops new delegation after the monetary cap and actively terminates eligible
background work in headless print mode.

**How it works:**
1. Agent preflight reads `maxBudgetUsd` and calls the global exhaustion predicate before launch
   (`550909-550921`).
2. Exhaustion throws a precondition error instructing the model to finish directly with existing
   tools/results.
3. The print drain loop calls `hasBudgetExceededWithRunningAgents` (`OUh`, `938380-938383`) only when
   cost is exhausted and at least one eligible running task exists.
4. Eligible work excludes observer agents, user-stopped tasks, and non-background/non-agent task
   kinds.
5. On a hit, the loop emits stderr/telemetry once per drain iteration and calls
   `stopAllBackgroundAgents` (`hPr`, `552190-552199`).
6. The stopper persists a stopped marker, invokes the task-type kill adapter, and emits terminal
   status for local agents (`552200-552225`).

**Why this approach:**
- Spawn-time refusal prevents increasing future cost.
- Drain-loop enforcement observes globally aggregated usage at a stable coordination point, rather
  than coupling every token-accounting update to task cancellation.
- Explicit task-kind filtering avoids killing ambient observers or unrelated work.
- Detection may lag until the next drain cycle, but lifecycle ordering and user-visible diagnostics
  are clearer.

**Key insight:** The budget has two phases: admission control for future agents and coordinated
shutdown for already-running background agents.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getMaxSubagentSpawnDepth` (`v6`) - resolves and caches the depth ceiling.
- `filterToolsForAgent` (`K5b`) - removes Agent at the child-depth boundary.
- `getMaxConcurrentSubagents` (`V7u`) - resolves the live-agent ceiling.
- `getMaxWebSearchesPerSession` (`K7u`) - resolves the search-call ceiling.
- `createTaskRegistry` (`y5`) - owns the search counter and concurrency gauge.
- `hasBudgetExceededWithRunningAgents` (`OUh`) - detects budget exhaustion with cancellable work.
- `stopAllBackgroundAgents` (`hPr`) - terminates eligible running background tasks.
