# Tool registry, deferred loading, execution, and terminal tools

## Current tool-surface model

A tool definition is a behavioral object, not only a JSON schema. The common contract supplies
enablement, concurrency, read-only classification, permission checking, input parsing/coercion, prompt
generation, execution, result mapping, cancellation, aliases, and optional deferred-loading metadata.
`decorateToolDefinition` (`Ri`, `cli_inner_pretty.js:123749-123750`) overlays defaults without losing
getters from the concrete definition.

The target's surface is materially larger than 2.1.220 because it includes connected-memory tools,
`ProposeGoal`, self-hosted-runner operator tools, scheduling/loop tools, richer cross-session tools, and
new product-host surfaces. This growth is absorbed by the existing deferred-tool architecture rather
than by serializing every schema into every model request.

### Registry lookup and alias caching

**What it does:** Resolves a model-emitted tool name to one canonical tool definition efficiently and
consistently across aliases.

**How it works:**
1. Each concrete tool is passed through `decorateToolDefinition`, which fills conservative defaults:
   enabled, non-concurrent, non-read-only, standard permission behavior, and a user-facing name.
2. `findToolByNameOrAlias` (`yu`, `cli_inner_pretty.js:123734-123744`) first applies any explicit
   request-local name rewrite.
3. It looks up a cached `Map` keyed by the tool-array identity. The map contains the canonical name and
   every alias, with first registration winning on conflicts.
4. If the array has not been indexed, it builds the map once. If an earlier linear miss marked the
   array, it falls back to a direct name-or-alias scan.
5. `runToolUse` then parses/coerces input, checks enablement and permissions, creates an isolated abort
   boundary, and delegates to the tool's async call generator.

**Why this approach:**
- A map avoids repeated linear scans on every streamed tool block while the tool array remains stable.
- Caching by array identity avoids global stale entries when plugins or MCP servers refresh the surface.
- First-registration semantics make precedence deterministic when aliases collide.
- The trade-off is that in-place mutation of a cached array would be unsafe; the surrounding registry
  therefore replaces tool arrays when the surface changes.

**Key insight:** The cache key is the registry object itself, so tool refresh is an identity change,
not a complex invalidation protocol.

### Deferred-tool decision

**What it does:** Keeps large or dynamic schemas out of the initial request while ensuring core tools
and context-sensitive tools remain immediately callable.

**How it works:**
1. `isDeferredTool` (`zse`, `cli_inner_pretty.js:207762-207775`) immediately keeps `alwaysLoad` and
   configured eager tools out of the deferred set.
2. MCP tools are deferred by default because their number and schema size are unbounded.
3. `ToolSearch` itself is never deferred; otherwise no tool could load the deferred schemas.
4. Context-sensitive exceptions keep Agent, task, loop, worktree, and related tools eager when their
   active session mode requires them.
5. Remaining tools defer only when their definition explicitly sets `shouldDefer`.
6. The request builder may insert `DeferredToolPlaceholder` when provider protocol shape requires at
   least one deferred schema marker.

**Why this approach:**
- Sending every MCP/plugin schema wastes prompt-cache space and scales linearly with integrations the
  current task may never use.
- A denylist of eager exceptions protects bootstrapping and mode-critical operations.
- Explicit `shouldDefer` keeps built-in tool authors responsible for whether name-only discovery is
  usable.
- The trade-off is an extra ToolSearch round trip before first use, exchanged for lower recurring
  prompt cost.

**Key insight:** Deferral is a request-serialization policy, not tool unavailability. The full tool
object already exists locally; only its model-visible schema is delayed.

### ToolSearch direct selection and ranking

**What it does:** Converts a model query into complete schemas for a bounded set of deferred tools,
including tools that arrive from MCP during the turn.

**How it works:**
1. `ToolSearchTool` (`SHn`, `cli_inner_pretty.js:378231-378477`) is always read-only and concurrency-safe.
2. A `select:<name>` request performs exact canonical/alias selection and can trigger an MCP refresh
   before declaring the tool missing.
3. Keyword search uses `searchDeferredTools` (`j7d`, `:378105-378173`). Exact names win first; MCP
   prefixes can select a bounded prefix group.
4. A leading `+term` makes that term mandatory. Remaining terms receive weighted scores across tool
   name parts, coarse MCP server/tool names, `searchHint`, and the full generated description.
5. Results are sorted by descending score and capped by `max_results`.
6. The result carries `tool_reference` blocks plus pending or failed MCP server diagnostics. A cache of
   generated descriptions is invalidated when the sorted deferred-name set changes.

**Why this approach:**
- Exact selection is deterministic and cheap when another prompt already named the tool.
- Weighted search tolerates different naming styles without requiring embeddings or a server call.
- MCP server and tool components receive stronger weights because integration names are the most useful
  discriminator in large registries.
- Description caching avoids repeatedly generating expensive dynamic prompts; name-set invalidation
  balances correctness and cost.

**Key insight:** `searchHint` is both discovery metadata and a token-saving substitute for generating a
full dynamic description during ranking.

### ToolSearch enablement policy

**What it does:** Enables deferred schemas only when the selected model, provider deployment, available
tools, and configured operating mode can support `tool_reference` blocks.

**How it works:**
1. `isToolSearchEnabled` (`wHn`, `cli_inner_pretty.js:380696-380762`) rejects models below the supported
   Claude generations.
2. Vertex models with an older serving stack are rejected even when their family name would otherwise
   qualify. This is the boundary changed in 2.1.221: Claude 4.5-generation and newer Vertex models are
   allowed.
3. Foundry requires both deployment capabilities, `tool_search_server` and `tool_search`.
4. The request must actually contain the ToolSearch definition; disallowed-tool policy can remove it.
5. Explicit tool-search mode enables it directly. Auto mode estimates deferred schema characters and
   enables search only above the model-relative threshold.
6. Every decision emits a reason and metrics, making provider or threshold suppression diagnosable.

**Why this approach:**
- Protocol support is model- and provider-specific; sending unsupported beta blocks causes request
  failures rather than graceful degradation.
- Auto mode uses prompt-size economics: small surfaces are cheaper to send eagerly, while large surfaces
  benefit from search.
- Checking actual registry presence respects user/managed disallow rules.
- The trade-off is a multi-factor policy, but reason-coded telemetry prevents a silent mystery.

**Key insight:** ToolSearch is not a global feature toggle. It is a request-by-request capability
decision whose threshold scales with the selected model.

### EndConversation four-layer gate and reflection

**What it does:** Exposes a session-ending model tool only for eligible models, enabled accounts,
supported builds, and allowed entrypoints, then requires a second reflective invocation.

**How it works:**
1. `modelMeetsEndConversationFloor` (`q3p`, `cli_inner_pretty.js:527303-527305`) compares the parsed model
   family/version against a floor: Opus 4.8 or later, and Sonnet/Fable/Mythos 5 or later.
2. `parseEndConversationFlagValue` (`K3p`, `:527314-527320`) accepts either a boolean enablement or an
   object whose `scope` compiles to a case-insensitive full-entrypoint regex.
3. `isEndConversationToolEnabled` (`Rti`, `:527322-527329`) additionally requires a known entrypoint and
   rejects unsupported build variants. The default scope is CLI only.
4. When deferred loading is available, the prompt advertises only a strict deferred hint.
5. The first valid call returns the tool's own criteria and asks the model to reconsider. Only a second
   call after reflection writes the durable ended-by-model marker and locks the session.
6. Forked/background tasks receive a distinct no-op result because they cannot terminate the parent.

**Why this approach:**
- Model floors avoid exposing a high-consequence policy tool to models not evaluated for its use.
- Server-controlled, entrypoint-scoped enablement permits gradual rollout without enabling every host.
- The two-call handshake inserts deliberation and gives the model a direct chance to reverse an
  over-broad first decision.
- The trade-off is additional latency for a rare action, intentionally favoring false negatives over
  an erroneous conversation termination.

**Key insight:** The first tool call is not confirmation from the harness; it is a forced reflection
step whose output becomes the evidence available to the second model decision.

## Tool-specific 2.1.221-2.1.227 changes

- File-not-found suggestion and at-mention size checks moved from synchronous filesystem operations to
  awaited operations; see [`../50_performance/io_stall_reductions.md`](../50_performance/io_stall_reductions.md).
- Cross-session `SendMessage` adds classifier evaluation, transport-aware identity pins, and held
  inbound messages; see [`../30_agent_team/cross_session_messaging_policy_and_pins.md`](../30_agent_team/cross_session_messaging_policy_and_pins.md).
- Connected-memory, goal-proposal, and self-hosted operator tools are target-only additions with their
  own trust and capability boundaries.
- The Bash description now states that command output is reliably shown to the model, not necessarily
  to the user; this is a prompt-contract change, not an execution change.
- The lifetime subagent cap was removed from Agent admission, while the Agent tool retains depth,
  concurrency, budget, topology, and permission checks.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `matchesToolNameOrAlias` (`Ra`) - canonical name/alias predicate.
- `findToolByNameOrAlias` (`yu`) - registry lookup and caching.
- `decorateToolDefinition` (`Ri`) - common tool defaults.
- `isDeferredTool` (`zse`) - eager/deferred decision.
- `searchDeferredTools` (`j7d`) - exact and ranked search.
- `ToolSearchTool` (`SHn`) - schema discovery tool.
- `isToolSearchEnabled` (`wHn`) - request capability policy.
- `modelMeetsEndConversationFloor` (`q3p`) - version-family gate.
- `parseEndConversationFlagValue` (`K3p`) - enabled/scope flag parser.
- `isEndConversationToolEnabled` (`Rti`) - full exposure gate.
