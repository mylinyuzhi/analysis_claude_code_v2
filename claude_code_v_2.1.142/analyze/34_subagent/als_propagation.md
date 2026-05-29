# AsyncLocalStorage Agent-Context Propagation — v2.1.142

## What ALS Solves

When the user backgrounds a subagent (`ctrl+b` from the REPL, or `run_in_background: true` from the Agent tool), **multiple subagents run concurrently inside the same Node.js process**. Each subagent generates HTTP requests, fires hooks, writes telemetry, and reads `agent_id` from somewhere to attribute those events.

The naive choice — a module-level `currentAgentId` global — fails immediately: Agent A's `fetch()` and Agent B's `fetch()` interleave on the event loop and one would clobber the other. The right answer is `async_hooks.AsyncLocalStorage`, which gives each async-chain its own store that survives `await`, `setTimeout`, and `Promise.then`.

The v2.1.88 source has a comment that names the alternative directly:

> WHY AsyncLocalStorage (not AppState): When agents are backgrounded (ctrl+b), multiple agents can run concurrently in the same process. AppState is a single shared state that would be overwritten, causing Agent A's events to incorrectly use Agent B's context. AsyncLocalStorage isolates each async execution chain, so concurrent agents don't interfere with each other.
> — `src/utils/agentContext.ts:16-22` (v2.1.88)

v2.1.142 keeps the same design, deobfuscated.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_subagent.md](../00_overview/symbol_additions_v2_1_142_subagent.md)
> - [symbol_additions_v2_1_142_agent_team_arch.md](../00_overview/symbol_additions_v2_1_142_agent_team_arch.md)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)

Key symbols:
- `getAgentContext` (`RD`) — `Atq.getStore()` (cli_inner_pretty.js:97620-97622)
- `runWithAgentContext` (`RU`) — `Atq.run(ctx, fn)` (cli_inner_pretty.js:97623-97625)
- `Atq` (the `AsyncLocalStorage<AgentContext>` instance) — cli_inner_pretty.js:97641
- `isSubagentContext` (`Cz1`) — `ctx?.agentType === "subagent"` (cli_inner_pretty.js:97626-97628)
- `getSubagentLogName` (`ztq`) — built-in name or literal `"user-defined"` (cli_inner_pretty.js:97629-97633)
- `consumeInvokingRequestId` (`Ni8`) — one-shot spawn/resume edge emitter (cli_inner_pretty.js:97634-97638)

## The Store Shape

`AgentContext` is a discriminated union (`agentType: "subagent" | "teammate"`):

```typescript
// SubagentContext (the Agent-tool / fork / --agent path):
{ agentId, agentType: "subagent", subagentName?, isBuiltIn?,
  parentSessionId?, invokingRequestId?, invocationKind?, invocationEmitted? }

// TeammateAgentContext (the agent-teams path):
{ agentId, agentName, teamName, agentType: "teammate", agentColor?,
  planModeRequired, parentSessionId, isTeamLead,
  invokingRequestId?, invocationKind?, invocationEmitted? }
```

The `invokingRequestId` family is the *sparse spawn/resume edge*: it appears on **exactly one** `tengu_api_success`/`tengu_api_error` per spawn/resume, so a non-NULL value in BigQuery marks a topology boundary. `consumeInvokingRequestId` is the one-shot reader that flips `invocationEmitted=true` after the first read.

## Where `RU` (`runWithAgentContext`) Is Called

The spawn path wraps the subagent generator in `RU(ctx, () => Vb(...))`. From that point on, every `await` inside the subagent — every HTTP call, every hook execution, every tool handler — sees the same `agentId` via `RD()`.

```javascript
// Conceptual call structure (the actual call site is in the Agent tool wrapper / teammate runner):
const ctx = {
  agentId,
  agentType: "subagent",
  subagentName: agentDef.agentType,
  isBuiltIn: agentDef.source === "built-in",
  parentSessionId: parentSession,
  invokingRequestId,
  invocationKind,            // "spawn" or "resume"
  invocationEmitted: false,
};
yield* RU(ctx, () => runAgent({ /* ... */ }));
```

The two consumer surfaces:

| Consumer | Where it reads | What it does with the result |
|----------|----------------|------------------------------|
| HTTP request headers | `RD()` in the `fetch` wrapper | Adds `x-claude-code-agent-id` and `x-claude-code-parent-agent-id` (since v2.1.139, cli_inner_pretty.js:128061-128062) |
| OTel spans | `RD()` in `claude_code.llm_request` builder | Adds `agent_id` and `parent_agent_id` attributes (since v2.1.139, cli_inner_pretty.js:241778-241779) |
| Telemetry events | `consumeInvokingRequestId()` + `getSubagentLogName()` | Emits `subagent_name` and `invoking_request_id` on the first `tengu_api_success`/`tengu_api_error` of the invocation |
| Hook input shape | `RD()` reads `agentId` | Hooks fired *inside* a subagent see `agent_id` and `agent_type` keys in their input JSON (cli_inner_pretty.js:237697-237703) |
| Tool handlers | `RD()` for slice-of-state lookups | E.g. todo writes namespace by `agentId`; transcript writes route to the right `<agentId>.jsonl` |

## Why ALS, Not Just Parameter Drilling

The runtime alternative is to pass `agentId` through every layer:

```javascript
// Hypothetical parameter-drilling alternative
fetch(url, { agentId, ...rest })
runHook(event, { agentId, ...rest })
writeTodo(todo, { agentId })
```

This would touch ~50 call sites, including third-party imports (e.g. the `fetch` polyfill, the OTel SDK, the MCP transport). ALS pushes that plumbing into the runtime: the call-tree below `RU(ctx, fn)` automatically inherits `ctx`, including indirect ones like a `setTimeout(...)` that fires inside a hook.

The cost: ALS introduces overhead on every async boundary (Node's `async_hooks` adds bookkeeping at every `Promise` creation). On modern Node this is tens of nanoseconds per await — invisible at agent loop scale.

## Concurrency Model: Spawning Inside a Subagent

When a subagent spawns its *own* subagent (nested invocation), the new `RU(...)` call **shadows the parent's context for the inner generator's lifetime**. Inside the nested subagent:
- `RD()` returns the nested context.
- HTTP headers and OTel spans carry the nested `agentId` *and* the parent's `agentId` (via `parentAgentId` on the new context).
- When the nested generator finishes, the outer subagent resumes — `RD()` returns the outer context again, automatically.

`parentSessionId` here is **not** the immediate parent's `agentId`; it's the *root session's id* (the user-facing REPL session). The nested topology is preserved separately via `parent_agent_id` headers / span attributes (v2.1.139). This split exists because some downstream consumers care about "which user session billed this" (parentSessionId) versus "what's the immediate spawn-edge" (parent_agent_id).

## The `invokingRequestId` Edge

The `invokingRequestId` field is the **request_id of the parent's API call that emitted the `tool_use` that spawned this subagent**. It's distinct from `parent_agent_id` because:
- `parent_agent_id` answers "whose agent loop am I in?"
- `invokingRequestId` answers "which specific API turn invoked me?"

A subagent could be resumed (e.g. via `SendMessage` in agent teams) — each resume creates a new `invokingRequestId` and `invocationKind: "resume"`. The `invocationEmitted` flag ensures the edge is logged **exactly once per invocation**:

```javascript
// ============================================
// consumeInvokingRequestId — one-shot spawn/resume edge
// Location: cli_inner_pretty.js:97634-97638
// ============================================

// ORIGINAL:
function Ni8() {
  let H = RD();
  if (!H?.invokingRequestId || H.invocationEmitted) return;
  return ((H.invocationEmitted = !0), { invokingRequestId: H.invokingRequestId, invocationKind: H.invocationKind });
}

// READABLE:
function consumeInvokingRequestId() {
  let ctx = getAgentContext();
  if (!ctx?.invokingRequestId || ctx.invocationEmitted) return undefined;
  ctx.invocationEmitted = true;
  return { invokingRequestId: ctx.invokingRequestId, invocationKind: ctx.invocationKind };
}

// Mapping: Ni8→consumeInvokingRequestId, RD→getAgentContext, H→ctx
```

The mutation of `ctx.invocationEmitted` is **safe across async** because ALS guarantees the same store reference is returned to every async-chain that descended from the same `RU(...)` call. Two parallel HTTP calls in the same subagent will race for the flag; one wins and emits the edge, the other gets `undefined`. This is the desired behavior — we want one edge log per invocation, not per terminal request.

## Cross-Validation with v2.1.88

The shape of `SubagentContext` and `TeammateAgentContext` is **identical** between v2.1.88 (`src/utils/agentContext.ts:32-85`) and v2.1.142 — same fields, same comments, same semantics. The two type guards (`isSubagentContext`, `isTeammateAgentContext`) translate directly; the v2.1.142 version of `isTeammateAgentContext` has been collapsed into `Cz1`-style equality checks because the swarm-enabled gate has migrated to a different layer (the GrowthBook check is hoisted out to the caller).

The `tengu_amber_flint` feature flag mentioned in [README.md](./README.md) gates teammate spawning; ALS itself is unconditional. Even on a deployment with teammates disabled, the subagent context still lives in `Atq` — and `RD()` returns `undefined` on the main REPL thread.

## Failure Modes

1. **Forgetting to wrap with `RU`** — symptom: subagent emits no `agent_id` header, OTel spans show only the main session. The wrap is done in the Agent-tool entry, the fork entry, and the teammate runner; if you add a new subagent entry path and forget `RU`, observability silently degrades.
2. **`RD()` outside any subagent** — returns `undefined`. Callers must defensive-null-check. The HTTP-header builder does (`if (ctx) headers["x-claude-code-agent-id"] = ctx.agentId`).
3. **Stale capture in a `setTimeout`** — if a callback is captured *before* `RU(...)` runs, it sees the outer context. Mitigation: capture inside the `RU` body, or use `RD()` at fire time.
4. **`invocationEmitted` race in tests** — if a test resets the agent context object but doesn't reset `invocationEmitted`, the edge is silently swallowed. The fix is to set `invocationEmitted: false` at every spawn/resume.

## Why This Belongs in 34_subagent

The same ALS instance is used by both subagents and teammates (the union type). But teammates have their own ALS-aware helpers (`getTeamName`, `getAgentName`, `isTeammate`) in `30_agent_team/` that wrap the union. This document describes the *underlying* propagation that both paths rely on; the teammate-specific wrappers are described in [30_agent_team/teammate_runner_loop.md](../30_agent_team/teammate_runner_loop.md).
