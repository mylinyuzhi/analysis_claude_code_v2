# Subagent spawn depth: the `.217`→`.219` flip-flop and the gate that carried it

**Bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js` (`cli_inner_pretty.js` below).
**Baseline:** `2.1.193` — every `(193)` citation is tagged.

Two changelog bullets in this window disagree with each other:

| Version | Bullet |
|---|---|
| `.217` | *"Changed subagents to no longer spawn nested subagents by default; set `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` to allow deeper nesting"* |
| `.219` | *"Subagents can now spawn nested subagents up to depth 3 by default (was 1); set CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1 to disable nesting"* |

Both are true, and the interesting part is what they do **not** say.

---

## 1. Depth limiting is CARRYOVER. The limit's *source* is the delta.

This is the trap the whole doc hangs on. 2.1.193 already refused nested spawns, at the same place, with
almost the same words:

```
193: cli_inner_pretty.js:430478-430483  (193)
        if (g >= FBt)
          throw (Re("subagent_launch", "subagent_depth_cap"),
            new RPe(`Subagent nesting limit reached (depth ${g} of ${FBt}). Complete this task
                     directly using your tools instead of spawning another agent.`))
220: cli_inner_pretty.js:398324-398330
```

And `FBt = 5` at `cli_inner_pretty.js:229871 (193)` — 2.1.193's default nesting depth was **five**, hardcoded,
with **no env override and no gate**. `grep -c 'CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH'` is **220=3 / 193=0**;
`grep -c 'tengu_hazel_trellis'` is **220=1 / 193=0**.

So the correct framing of the window is:

- The **mechanism** (walk the agent-context depth, compare, refuse, emit `subagent_launch` /
  `subagent_depth_cap`) is carryover.
- The **limit source** changed from `const 5` to a three-tier resolver (env → remote gate → `const 3`).
- The **default** moved 5 → 1 (`.217`) → 3 (`.219`).
- The refusal text gained one sentence pointing at the new env var.

A count-only check on `Subagent nesting limit reached` returns **220=1 / 193=1** and would call this
"no change". Read the strings:

```
220 :398328  Subagent nesting limit reached (depth ${m} of ${g}). Complete this task directly using your
             tools instead of spawning another agent. If the user explicitly requested deeper nesting,
             ask them to raise CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH.
193 :430482  Subagent nesting limit reached (depth ${g} of ${FBt}). Complete this task directly using your
             tools instead of spawning another agent.
```

The appended sentence is the entire user-visible delta of the refusal, and it is *addressed to the model*:
it tells the model to escalate to the human rather than retry. That matters because the model cannot raise
the limit itself — `Z.CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` is read from the process environment, so only
the human who launched the CLI can change it.

---

## 2. `getMaxSubagentSpawnDepth` — the three-tier resolver

```javascript
// ============================================
// getMaxSubagentSpawnDepth - resolves the nesting depth cap: env var, then remote gate, then constant 3
// Location: cli_inner_pretty.js:230896-230908
// ============================================

// ORIGINAL (for source lookup):
function hee() {
  let e = Z.CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH;
  if (e !== void 0) return e;
  if (Dus === null) {
    let { getFeatureValue_CACHED_MAY_BE_STALE: t } = (Zr(), en(iRt)),
      r = t(sty, ZDu);
    Dus = typeof r === "number" && Number.isInteger(r) && r >= 1 ? r : ZDu;
  }
  return Dus;
}
var ZDu = 3,
  sty = "tengu_hazel_trellis",
  Dus = null;

// READABLE (for understanding):
function getMaxSubagentSpawnDepth() {
  let fromEnv = env.CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH;      // already coerced to int by the env layer
  if (fromEnv !== undefined) return fromEnv;                   // tier 1: operator override, never memoised
  if (memoisedDepthFromGate === null) {                         // tier 2: remote gate, memoised once
    let { getFeatureValue_CACHED_MAY_BE_STALE: getFeatureValue } = lazyRequire(growthBookModule),
      remote = getFeatureValue(SPAWN_DEPTH_GATE, DEFAULT_SPAWN_DEPTH);
    memoisedDepthFromGate =
      typeof remote === "number" && Number.isInteger(remote) && remote >= 1
        ? remote
        : DEFAULT_SPAWN_DEPTH;                                  // bad payload -> silent fallback
  }
  return memoisedDepthFromGate;                                // tier 3: DEFAULT_SPAWN_DEPTH = 3
}
var DEFAULT_SPAWN_DEPTH = 3,
  SPAWN_DEPTH_GATE = "tengu_hazel_trellis",
  memoisedDepthFromGate = null;

// Mapping: hee→getMaxSubagentSpawnDepth, ZDu→DEFAULT_SPAWN_DEPTH, sty→SPAWN_DEPTH_GATE,
//          Dus→memoisedDepthFromGate, Z→env, Zr/en/iRt→lazy GrowthBook module require
```

### Decision: env → gate → constant, in that order

**What it does:** produces one integer, the maximum agent-context depth at which the Agent tool may still be
called, from three sources of decreasing authority.

**How it works:**

1. `Z.CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` is consulted first and returned raw. `Z` is the typed env
   facade: the var is declared `De.int({ min: 1, digitsOnly: !0 })` at `cli_inner_pretty.js:32641`, registered
   in the accessor table at `cli_inner_pretty.js:32123`. So `Z.<name>` is either `undefined` or an integer
   `>= 1` — the resolver does **not** re-validate it, because the env layer already did. A value of `0`,
   `abc`, or `2.5` never reaches here; it is dropped to `undefined` by the accessor and the resolver falls
   through to the gate. That is why `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=0` is *not* how you disable
   nesting — `.219`'s bullet correctly says `=1`.
2. If there is no env override, the GrowthBook value for `tengu_hazel_trellis` is read **once** and
   memoised into `Dus`. The reader is literally named `getFeatureValue_CACHED_MAY_BE_STALE`
   (`cli_inner_pretty.js:230900`), so the value is already a cached snapshot; `Dus` caches the cache.
3. The gate value is validated `typeof === "number" && Number.isInteger && >= 1` and silently replaced by
   `3` on failure. A gate mis-typed as `"3"`, or set to `0`/`-1`/`2.5`, produces the shipped default with no
   log and no telemetry.

**Why this approach:**

- *Env first, un-memoised* — the operator's intent must win over anything the server says, and re-reading it
  every call costs nothing (it is a property access on a pre-parsed object).
- *Gate second, memoised* — a live gate lookup can change mid-session. If the depth cap could move while
  agents are running, a subagent could be admitted at depth 2 and its sibling refused a second later, and
  the release path (`takeConcurrencySlot`, worktree teardown) would be reasoning about a different limit than
  the admit path. Memoising makes the limit a **per-process constant**, which is the only shape that keeps
  the admit/refuse decisions coherent across a whole session.
- *`>= 1` and not `>= 0`* — depth `0` is the main session. A cap of `0` would mean "the main agent may not
  call the Agent tool", i.e. it would disable delegation entirely rather than nesting. The floor of 1
  encodes "delegation always works; only *re-*delegation is tunable".
- *Silent fallback* — the alternative (throw, or log) would turn a bad server payload into a broken client.
  Fail-safe-to-shipped-default is the right trade here, but the cost is real: a typo'd gate is
  undiagnosable from the client side.

**Key insight:** the memoisation is what makes `tengu_hazel_trellis` a *release-shaped* lever rather than a
runtime one. Anthropic can move the effective default for the whole fleet without shipping a build, but the
change only takes effect in **new processes** — which is behaviourally indistinguishable from shipping a
release, and is exactly why a flip-flop like `.217`→`.219` is cheap to perform.

### Honesty note on the flip-flop

I can prove the two endpoints and the mechanism, and I cannot prove which lever moved `.217`:

- 2.1.193 shipped `FBt = 5` (`:229871 (193)`).
- 2.1.220 ships `ZDu = 3` (`:230906`) plus the `tengu_hazel_trellis` gate.
- `.217` claims an effective default of 1; `.219` claims 3.

Because the `.217` bundle is not in this tree, I cannot tell whether `.217` shipped `ZDu = 1` in code and
`.219` changed it to `3`, or whether `.217` shipped `3` and pushed `tengu_hazel_trellis = 1` remotely, then
`.219` withdrew the gate value. **The code proves the gate exists and is authoritative over the constant; it
does not prove the gate was used.** Anyone claiming otherwise is inferring from the changelog, not the
bundle. What the bundle *does* establish is that `.219`'s parenthetical "(was 1)" cannot be describing a
constant that survives into 2.1.220 — the constant here is 3.

---

## 3. Three enforcement layers, not one

`getMaxSubagentSpawnDepth` has eight call sites in 2.1.220. They fall into three tiers, and understanding why
there are three is the substance of this feature.

| Layer | Site | What it does when the cap is reached |
|---|---|---|
| **Schema** | `cli_inner_pretty.js:345490` | the Agent tool is **removed from the child's tool list** |
| **Prompt** | `:231488`, `:231519`, `:269621`, `:418041`, `:423575` | the fan-out instructions are **omitted from the child's system prompt** |
| **Runtime** | `:398324` (Agent tool), `:342427` (forked skill) | the call is **refused** |

### 3.1 Schema layer — `filterToolsForAgent`

```javascript
// ============================================
// filterToolsForAgent - builds a subagent's tool list; drops the Agent tool at the depth cap
// Location: cli_inner_pretty.js:345484-345499
// ============================================

// ORIGINAL (for source lookup):
function MNy({ tools: e, isBuiltIn: t, isAsync: r = !1, isTeammate: n = !1, permissionMode: o, agentDepth: i = 0 }) {
  let s = e.filter((a) => {
    if (jL(a)) return !0;
    if (qa(a, UP) && o === "plan") return !0;
    if (WVe.has(a.name)) return !1;
    if (!t && jpo.has(a.name)) return !1;
    if (qa(a, qo)) return i < hee();
    if (r && !kir.has(a.name)) {
      if (mc() && n && _Pu.has(a.name)) return !0;
      return !1;
    }
    return !0;
  });
  if (o === "plan" && !s.some((a) => qa(a, UP))) s.push(S6);
  return s;
}

// READABLE (for understanding):
function filterToolsForAgent({ tools, isBuiltIn, isAsync = false, isTeammate = false,
                               permissionMode, agentDepth = 0 }) {
  let kept = tools.filter((tool) => {
    if (isMcpTool(tool)) return true;                                      // MCP always allowed
    if (toolMatchesName(tool, EXIT_PLAN_MODE_V2_TOOL_NAME) && permissionMode === "plan") return true;
    if (ALL_AGENT_DISALLOWED_TOOLS.has(tool.name)) return false;
    if (!isBuiltIn && CUSTOM_AGENT_DISALLOWED_TOOLS.has(tool.name)) return false;
    if (toolMatchesName(tool, AGENT_TOOL_NAME)) return agentDepth < getMaxSubagentSpawnDepth();  // <-- depth gate
    if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
      if (isAgentSwarmsEnabled() && isTeammate && IN_PROCESS_TEAMMATE_ALLOWED_TOOLS.has(tool.name)) return true;
      return false;
    }
    return true;
  });
  if (permissionMode === "plan" && !kept.some((t) => toolMatchesName(t, EXIT_PLAN_MODE_V2_TOOL_NAME)))
    kept.push(EXIT_PLAN_MODE_FALLBACK_TOOL);
  return kept;
}

// Mapping: MNy→filterToolsForAgent, jL→isMcpTool, qa→toolMatchesName, UP→EXIT_PLAN_MODE_V2_TOOL_NAME,
//          WVe→ALL_AGENT_DISALLOWED_TOOLS, jpo→CUSTOM_AGENT_DISALLOWED_TOOLS, qo→AGENT_TOOL_NAME (:162358),
//          kir→ASYNC_AGENT_ALLOWED_TOOLS, mc→isAgentSwarmsEnabled, _Pu→IN_PROCESS_TEAMMATE_ALLOWED_TOOLS,
//          S6→EXIT_PLAN_MODE_FALLBACK_TOOL, hee→getMaxSubagentSpawnDepth
```

Names recovered from the v2.1.88 named tree: `3rd/claude-code/src/tools/AgentTool/agentToolUtils.ts:70`
declares `filterToolsForAgent({ tools, isBuiltIn, isAsync, permissionMode })` with `ALL_AGENT_DISALLOWED_TOOLS`,
`CUSTOM_AGENT_DISALLOWED_TOOLS`, `ASYNC_AGENT_ALLOWED_TOOLS` and `IN_PROCESS_TEAMMATE_ALLOWED_TOOLS` — the
same five predicates in the same order. That tree has **no `agentDepth` parameter at all**; the depth clause
is later. In 2.1.193 it is present as `if (lc(a, is)) return s < FBt;` at `cli_inner_pretty.js:384035 (193)`, so
this layer too is carryover with a new limit source.

**Which depth is passed?** `filterToolsForAgent` is reached through `resolveAgentTools`
(`dte`, `:345528-345532`), called at `:344378` as
`dte(e, m, o, !1, W, DI(u?.agentContext ?? r.agentContext))`. On both Agent-tool spawn paths the override
*does* carry the child's own context — `{ agentId, parentAgentId, depth: ne, … }` at `:398836-398851`
(background) and `:398898-398913` (synchronous), where `ne = DI(l.agentContext) + 1` (`:398577`). So
`agentDepth` is the **child's** depth and the schema predicate `childDepth < limit` is the exact complement of
the runtime predicate `callerDepth >= limit` at `:398324`. The `?? r.agentContext` fallback (the *parent's*
depth) only applies to entry points that pass no override — e.g. `:343203`, `:346680`.

### 3.2 Prompt layer

Three separate prompt builders branch on `hee() > 1` — i.e. "is nesting allowed at all?":

- `:231488` / `:231490` — the coordinator's *worker tool inventory*: `...(r ? [qo] : [])` splices
  `"Agent"` into the advertised tool list only when the cap exceeds 1.
- `:231519-231522` — the prose version: `Workers can fan out further via ${qo}` is appended only when
  `r` is true.
- `:269621-269624` — the worker system prompt's Scope section:
  `- If you have the ${qo} tool, you may use it to fan out (e.g. \`/simplify\`, \`/code-review\`, or your own
  parallel research/verification) — workers at the depth cap don't receive it`.

Two more sites are *conditional phrasing* rather than gating:

- `:418041-418043` — `SendMessage`'s "no such teammate" error tells the caller to spawn one itself
  (`DI(n.agentContext) < hee()`) or to ask the lead, depending on whether the caller could legally spawn.
- `:423575` — `yRo(e)`: `if (e.agentContext && DI(e.agentContext) >= hee()) return !1;` — a
  *can-I-fan-out?* predicate consulted before emitting fan-out instructions into the code-review prompt.

**Why bother, when the runtime check exists?** Three reasons visible in the code:

1. **Token cost.** `:231490` builds a per-worker tool inventory that is injected into every worker's prompt.
   Advertising a tool the worker cannot use wastes tokens on every turn of every worker.
2. **Behavioural cost.** A model that sees the Agent tool in its schema will plan with it. Refusing at call
   time produces a wasted turn plus a recovery turn. Removing it from the schema makes the plan impossible.
3. **Message quality.** `:418043` and `:269622` change what the model is told to do *instead*: message the
   lead, or do the work directly. A bare refusal cannot carry that.

**Key insight:** the depth cap is enforced at the *schema* boundary and merely *back-stopped* at the runtime
boundary. The runtime check at `:398324` is not the enforcement — it is the assertion that the schema
filtering worked, and it is placed **first in the tool's `call`** (before `description` normalisation at
`:398331`, before app-state reads, before every other validation) precisely because reaching it means
something upstream leaked.

### 3.3 Runtime layer, and the forked-skill variant

The Agent tool refuses hard (`throw`). The `context: fork` skill launcher **degrades**:

```javascript
// ============================================
// launchForkedSkillAgent (depth/spawn-cap section) - degrades to inline execution instead of refusing
// Location: cli_inner_pretty.js:342419-342442
// ============================================

// ORIGINAL (for source lookup):
  _ = DI(s.agentContext) + 1,
  ...
  let A = hee();
  if (_ > A) {
    let M = Q7r(),
      $ = m.getTotalAgentSpawns();
    if ($ >= M)
      throw (
        pe("subagent_launch", "forked_skill_depth_chain_cap"),
        new Lr(
          `Subagent spawn limit reached (${$} of ${M}) past the nesting depth cap. Do the skill's work directly in this context instead of invoking further skills.`,
          "forked_skill_depth_chain_cap",
        )
      );
    return (m.incrementTotalAgentSpawns(), $e("subagent_launch", "forked_skill_depth_cap"), null);
  }
  let b = Q7r();
  if (m.getTotalAgentSpawns() >= b) return ($e("subagent_launch", "forked_skill_spawn_cap"), null);

// READABLE (for understanding):
  childDepth = getAgentDepth(ctx.agentContext) + 1,
  ...
  let depthLimit = getMaxSubagentSpawnDepth();
  if (childDepth > depthLimit) {
    let sessionLimit = getMaxSubagentsPerSession(),
      spawnsSoFar = taskRegistry.getTotalAgentSpawns();
    if (spawnsSoFar >= sessionLimit)
      throw (logFeatureBad("subagent_launch", "forked_skill_depth_chain_cap"),
             new ToolError(`Subagent spawn limit reached (${spawnsSoFar} of ${sessionLimit}) past the nesting
                            depth cap. Do the skill's work directly in this context instead of invoking
                            further skills.`, "forked_skill_depth_chain_cap"));
    // charge the session budget even though nothing is spawned, then run the skill INLINE
    return (taskRegistry.incrementTotalAgentSpawns(),
            logFeatureSad("subagent_launch", "forked_skill_depth_cap"),
            null);
  }
  let sessionLimit = getMaxSubagentsPerSession();
  if (taskRegistry.getTotalAgentSpawns() >= sessionLimit)
    return (logFeatureSad("subagent_launch", "forked_skill_spawn_cap"), null);

// Mapping: DI→getAgentDepth, hee→getMaxSubagentSpawnDepth, Q7r→getMaxSubagentsPerSession,
//          m→taskRegistry, pe→logFeatureBad (tengu_feature_bad), $e→logFeatureSad (tengu_feature_sad),
//          Lr→ToolError, returning null→"run the skill in this context instead"
```

### Decision: why the forked skill degrades and the Agent tool refuses

**What it does:** at the depth cap, a `context: fork` skill invocation stops trying to spawn an agent and
returns `null`, which the caller reads as "run this skill inline in the current context".

**How it works:**

1. `_ > A` uses the *child's* depth (`DI+1`) against the same limit; algebraically identical to the Agent
   tool's `DI >= A`, so the two enforcement points agree.
2. Before degrading, it checks the per-session spawn cap. If *both* caps are exhausted it throws — the only
   hard error on this path.
3. On the degrade path it calls `incrementTotalAgentSpawns()` **even though no agent is created**
   (`:342439`).
4. Telemetry splits: `pe` → `tengu_feature_bad` (`:47873`) for the throw, `$e` → `tengu_feature_sad`
   (`:47876`) for the degrade. The event *name* encodes whether the user lost anything.

**Why this approach:**

- A skill invocation has a well-defined fallback (run it here); an Agent-tool call does not — the model asked
  for parallelism and there is no way to silently provide it. So the skill path can be transparent and the
  tool path cannot.
- Step 3 looks like a bug and is a **ratchet**. Without it, a skill that recursively invokes itself at the
  depth cap would degrade to inline forever, free of charge, and loop unbounded. Charging the session budget
  means each degrade costs one of the 200 session spawns, so after at most 200 degrades the *second* check
  fires and the chain gets the hard `forked_skill_depth_chain_cap` error. The comment written into the error
  string — "past the nesting depth cap" — is the giveaway that this combination was designed, not stumbled
  into.
- The `tengu_feature_bad` / `tengu_feature_sad` split means a dashboard can distinguish "we refused a model"
  from "we quietly did something cheaper", which are very different signals when tuning a default like this.

**Key insight:** the depth cap alone cannot terminate a recursive skill; it needs a *monotone* counter to lean
on. That is why the depth cap and the session spawn cap ship together — `.217` and `.212` are one design, not
two.

---

## 4. Where the depth number actually comes from at runtime

```javascript
// ============================================
// getAgentDepth - the depth of an agent context; the main session is depth 0
// Location: cli_inner_pretty.js:111428-111431
// ============================================

// ORIGINAL (for source lookup):
function DI(e) {
  if (e.agentType === "main") return 0;
  return e.depth ?? 0;
}

// READABLE (for understanding):
function getAgentDepth(agentContext) {
  if (agentContext.agentType === "main") return 0;
  return agentContext.depth ?? 0;      // missing depth is treated as the root
}

// Mapping: DI→getAgentDepth
```

`depth` is written once, at spawn, as `DI(parent) + 1` (`:398577`, stored at `:398839` / `:398901`), and the
context travels on an `AsyncLocalStorage` (`Z8(gt, …)` at `:398852`). The `?? 0` is a **fail-open**: an agent
context that somehow lacks `depth` is treated as the root, so it gets the *full* depth budget rather than
none. The v2.1.88 tree documents why the store is ALS and not app state
(`3rd/claude-code/src/utils/agentContext.ts`): *"When agents are backgrounded (ctrl+b), multiple agents can
run concurrently in the same process. AppState is a single shared state that would be overwritten, causing
Agent A's events to incorrectly use Agent B's context."* Note that `SubagentContext` in that tree has no
`depth` field — depth tracking postdates 2.1.88.

**Failure mode worth stating:** the whole depth system is an ALS read. If the store is lost — the same class
of failure that the worktree guard calls `context_lost` (`:314164`) — `DI` returns 0 and the agent silently
regains a full depth budget. There is no telemetry for that on the depth path.

---

## 5. What the caps do *not* constrain

`Explore`, the built-in fan-out search agent, lists the Agent tool in `disallowedTools`
(`:269300`, cross-checked against `3rd/claude-code/src/tools/AgentTool/built-in/exploreAgent.ts:67-72` where
the entry is spelled `AGENT_TOOL_NAME`). Explore is therefore a **leaf by construction**, independent of the
depth cap: raising `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` never lets Explore fan out.

`isolation: "remote"` agents skip the *concurrency* cap entirely (`if (!z)` at `:398532`) but are subject to
depth and session caps like anything else — see
[`concurrency_and_session_caps.md`](concurrency_and_session_caps.md) §5.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New rows for this module are staged in
> [symbol_additions_v2_1_220_subagent_limits.md](../00_overview/symbol_additions_v2_1_220_subagent_limits.md).

Key functions in this document:
- `getMaxSubagentSpawnDepth` (`hee`, `:230896`) - env → `tengu_hazel_trellis` → `3` resolver
- `DEFAULT_SPAWN_DEPTH` (`ZDu`, `:230906`) - the shipped default, `3`
- `SPAWN_DEPTH_GATE` (`sty`, `:230907`) - `"tengu_hazel_trellis"`
- `memoisedDepthFromGate` (`Dus`, `:230908`) - one-shot cache of the gate value
- `getAgentDepth` (`DI`, `:111428`) - main session is depth 0
- `filterToolsForAgent` (`MNy`, `:345484`) - drops the Agent tool at the cap
- `resolveAgentTools` (`dte`, `:345528`) - passes `agentDepth` into the filter
- `runAgent` (`oG`, `:344277`) - builds the child's tool list and system prompt
- `canFanOutViaAgentTool` (`yRo`, `:423574`) - prompt-level fan-out predicate
- `buildWorkerToolInventory` (`Tty`, `:231486`) - splices `Agent` in only when the cap exceeds 1
- `buildWorkerPromptToolProse` (`Cty`, `:231517`) - prose variant of the same branch
- `launchForkedSkillAgent` (depth section, `:342419`) - degrade-to-inline instead of refusing
- `logFeatureBad` (`pe`, `:47873`) / `logFeatureSad` (`$e`, `:47876`) - hard-refusal vs soft-degrade telemetry
- `AGENT_TOOL_NAME` (`qo`, `:162358`) / `LEGACY_AGENT_TOOL_NAME` (`Cj`, `:162359`) - `"Agent"` / `"Task"`
