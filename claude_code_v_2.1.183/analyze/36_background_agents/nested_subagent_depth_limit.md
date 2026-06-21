# Nested Subagents & the 5-Level Depth Limit (v2.1.156 → v2.1.183)

## TL;DR

This is the headline cross-cutting delta of the v2.1.157 → v2.1.183 window (changelog **2.1.172** "nested subagents" + **2.1.181** "foreground subagents now respect the same depth limit as background subagents"). In v2.1.156 there was **no notion of agent depth at all** — `grep -c agentDepth` and `grep -c spawnDepth` both return **0** in the v2.1.156 bundle. A subagent could only re-spawn the **Agent**/Task tool when *team mode* was on: the v2.1.156 async-tool filter `uE6` (`cli_inner_pretty.js:278956`, v2.1.156) let the Agent tool through to an **async** subagent **only inside `R7() && mG()`** (agent-teams-enabled AND in-process-teams-enabled). There was no cap and no recursion for ordinary subagents.

v2.1.183 replaces that team-only boolean with a **universal numeric gate**. It introduces:

1. a constant `SUBAGENT_DEPTH_LIMIT` (obfuscated: `v1i`, `cli_inner_pretty.js:221800`) hard-coded to **5**;
2. a depth reader `getAgentDepth` (obfuscated: `Gz`, `:103152`) — `main` is depth `0`, every other context returns its stored `depth ?? 0`;
3. an enforcement line inside the **universal** tool filter `cio` (obfuscated, `:371188`): `if (Rc(i, vs)) return s < v1i;` — the Agent tool survives the filter **iff `agentDepth < 5`**;
4. a depth parameter threaded through the resolved-tools builder `bte` (`:371230`) and supplied by the subagent runner as `Gz(parent)+1` at **every** spawn surface (regular Agent-tool spawn `:423722`, resume `:434085`, built-in fork `:473587`, workflow agent `:417155`);
5. persistence of that depth into the local-agent task registry as `spawnDepth` (`Xut`, `:446073`) and into telemetry as `agent_depth`.

The two design facts that make this the "2.1.181 fix" are: (a) the `if (Rc(i, vs))` Agent-tool line **precedes** the `if (n && …)` async block in `cio`, so the gate is **not** async/team-specific — it applies to foreground and background subagents alike; and (b) the **single** `bte(…, Gz(ctx))` chokepoint builds the toolset for *both* the synchronous subagent path and the async/background path, so foreground and background subagents literally **share one limit**. Enforcement is **by tool removal**: a depth-5 agent simply does not receive the Agent tool in its toolset — there is no error string, no "maximum depth exceeded" message (which is why grep for such a string over the Agent path returns nothing).

> Scope: this doc covers the depth-limit mechanism end-to-end (constant → reader → gate → threading → persistence → telemetry) and the full v2.1.156 before-picture (`uE6` team-only gate). The unchanged `/bg` flow, the unified dispatcher, the worker env-isolation rework, and the `agents --json` surface are sibling deltas linked at the end. The Agent-tool *teammate-routing* rewrite (implicit team, `name`-param routing) is a different v2.1.178 delta documented in the agent_team module — linked, not re-derived here.

---

## 0. The before-picture: depth did not exist in v2.1.156

Before reading the new mechanism you have to hold the v2.1.156 model precisely, because the change is structural, not cosmetic.

In v2.1.156 the toolset that a subagent received was computed by `no` (the resolved-tools builder, v2.1.156 `cli_inner_pretty.js:278972`), which delegated filtering to `uE6` (v2.1.156 `:278956`). The signature of `uE6` is the proof that depth was absent:

```javascript
// ============================================
// uE6 — v2.1.156 async-tool filter (team-only Agent gate, NO depth)
// Location (v2.1.156): cli_inner_pretty.js:278956-278971
// ============================================

// ORIGINAL (for source lookup):
function uE6({ tools: H, isBuiltIn: $, isAsync: q = !1, permissionMode: K }) {
  return H.filter((_) => {
    if (eP(_)) return !0;
    if (h1(_, wv) && K === "plan") return !0;
    if (xwH.has(_.name)) return !1;
    if (!$ && wG6.has(_.name)) return !1;
    if (q && !xJ$.has(_.name)) {
      if (R7() && mG()) {
        if (h1(_, sq)) return !0;
        if (U57.has(_.name)) return !0;
      }
      return !1;
    }
    return !0;
  });
}

// READABLE (for understanding):
function filterAsyncTools({ tools, isBuiltIn, isAsync = false, permissionMode }) {
  return tools.filter((tool) => {
    if (isAlwaysAvailable(tool)) return true;                    // eP
    if (matchesName(tool, EXIT_PLAN_TOOL) && permissionMode === "plan") return true; // h1(_, wv)
    if (HARD_DISALLOWED_SET.has(tool.name)) return false;        // xwH
    if (!isBuiltIn && NON_BUILTIN_BLOCKED_SET.has(tool.name)) return false; // wG6
    // The ONLY recursion door: an ASYNC subagent
    if (isAsync && !ASYNC_ALLOWED_SET.has(tool.name)) {          // xJ$
      if (isAgentTeamsEnabled() && isInProcessTeamsEnabled()) {  // R7() && mG()
        if (matchesName(tool, AGENT_TOOL)) return true;          // h1(_, sq) → Agent tool
        if (TEAM_ASYNC_EXTRA_SET.has(tool.name)) return true;    // U57
      }
      return false;                                              // otherwise drop the async-disallowed tool
    }
    return true;
  });
}

// Mapping (v2.1.156): uE6→filterAsyncTools, H→tools, $→isBuiltIn, q→isAsync, K→permissionMode,
//   eP→isAlwaysAvailable, wv→EXIT_PLAN_TOOL, h1→matchesName, xwH→HARD_DISALLOWED_SET,
//   wG6→NON_BUILTIN_BLOCKED_SET, xJ$→ASYNC_ALLOWED_SET, R7→isAgentTeamsEnabled, mG→isInProcessTeamsEnabled,
//   sq→AGENT_TOOL ("Agent"), U57→TEAM_ASYNC_EXTRA_SET
```

Three facts from this snippet define the v2.1.156 world:

- **No `agentDepth`/`spawnDepth` parameter exists.** The destructure is `{ tools, isBuiltIn, isAsync, permissionMode }` — four fields, none about depth. The builder `no(H, $, q=!1, K=!1)` (v2.1.156 `:278972`) likewise takes four positional args. Confirmed by `grep -c agentDepth` = `0` and `grep -c spawnDepth` = `0` over the entire v2.1.156 bundle.
- **The Agent tool is gated *inside* the `isAsync` branch.** The only way `h1(_, sq)` (the Agent-tool match) returns `true` is the path `isAsync && R7() && mG()`. A *synchronous* subagent never reached this branch — so foreground subagents simply could not re-spawn the Agent tool at all, regardless of any limit.
- **The gate is a boolean (team mode), not a count.** `R7() && mG()` is "is the team feature on?" There is no comparison against any cap. A team in v2.1.156 could in principle nest without a depth ceiling at this layer; ordinary (non-team) subagents could not nest *at all*.

The Agent-tool name constant in v2.1.156 was `sq = "Agent"` (v2.1.156 `:185637`), matched by `h1` (`e.name === t || aliases.includes(t)`). Both are re-mangled in v2.1.183 (to `vs` and `Rc`) — verify by line, never reuse the old obf names.

**Net before-picture:** recursive subagent spawning in v2.1.156 was a *team-mode privilege*, gated by a boolean, with no depth concept and no shared fg/bg limit. Everything below is new.

---

## 1. The constant: `SUBAGENT_DEPTH_LIMIT = 5`

**What it does.** Defines the maximum nesting depth at which an agent is still allowed to hold the Agent tool. At depth `5` an agent's toolset is built *without* the Agent tool, so it cannot spawn a 6th level.

**How it works.** It is a plain module-scoped `var` initialized to `5`, declared in the same comma-list as the tool-filter sets that surround the gate:

```javascript
// ============================================
// SUBAGENT_DEPTH_LIMIT — the nested-subagent depth cap (= 5)
// Location: cli_inner_pretty.js:221797-221802
// ============================================

// ORIGINAL (for source lookup):
var LCe,
  T5r,
  UPt,
  v1i = 5,
  T1i,
  w5r;

// READABLE (for understanding):
var HARD_DISALLOWED_SET,          // LCe — tools always dropped
  NON_BUILTIN_BLOCKED_SET,        // T5r — tools dropped for non-built-in callers
  ASYNC_ALLOWED_SET,              // UPt — tools an async subagent may keep
  SUBAGENT_DEPTH_LIMIT = 5,       // v1i — the depth cap
  TEAMMATE_ASYNC_EXTRA_SET,       // T1i — extra tools a teammate async ctx keeps
  TEAMMATE_TOOL_SET;              // w5r

// Mapping: v1i→SUBAGENT_DEPTH_LIMIT, LCe→HARD_DISALLOWED_SET, T5r→NON_BUILTIN_BLOCKED_SET,
//   UPt→ASYNC_ALLOWED_SET, T1i→TEAMMATE_ASYNC_EXTRA_SET, w5r→TEAMMATE_TOOL_SET
```

The siblings are populated in the module initializer at `:221821-221822` (`LCe = fvd("external")`, `T5r = new Set([...LCe])`, `UPt = mvd("external")`, `T1i = new Set([Vw, g7, IL, dP, zh, rI, U2, OPt])`, `w5r = new Set([vs, uP, zh, Em, zk])`); these are the filter's allow/deny sets and are not the focus here — they are listed only so the reader understands `v1i` lives in the tool-filter compilation unit.

**Why a constant 5 (not configurable).** The depth ceiling is a hard literal, not an env-var-tunable threshold. The trade-off:

- **Predictability over flexibility.** Five is deep enough for realistic delegation trees (a coordinator → specialist → sub-specialist chain is rarely > 3) yet shallow enough to bound the worst-case fan-out and token/cost blow-up of a runaway recursion. A user-tunable limit would invite pathological configs and make support harder to reason about.
- **The recursion driver is gated separately.** Whether nested subagents are *even allowed* is a different switch — `CLAUDE_CODE_FORK_SUBAGENT` / `getForkSubagentSource` (obfuscated: `L1i`, `:222216`) controls the fork-subagent feature; `v1i` is purely the ceiling once recursion is permitted. (Note: `CLAUDE_CODE_FORK_SUBAGENT` already existed in v2.1.156 at v2.1.156 `:216773`/`:389421`, so the env var is *not* new — only the depth mechanism is.)

**Key insight.** Making the cap a single literal means there is exactly one number to reason about, and the comparison `s < v1i` reads as "you may spawn while your own depth is < 5", i.e. the spawning agent is at level 0–4 and the child it spawns is at 1–5; the level-5 child is built without the Agent tool. Five spawnable levels below `main`.

---

## 2. The depth reader: `getAgentDepth` (`Gz`)

**What it does.** Returns the integer depth of an `agentContext`. `main` is the root at depth `0`; any other context returns its persisted `depth` (defaulting to `0` if somehow unset).

**How it works.**

```javascript
// ============================================
// getAgentDepth — read the nesting depth of an agentContext
// Location: cli_inner_pretty.js:103152-103155
// ============================================

// ORIGINAL (for source lookup):
function Gz(e) {
  if (e.agentType === "main") return 0;
  return e.depth ?? 0;
}

// READABLE (for understanding):
function getAgentDepth(agentContext) {
  if (agentContext.agentType === "main") return 0; // root conversation is depth 0
  return agentContext.depth ?? 0;                   // every spawned context carries its own depth
}

// Mapping: Gz→getAgentDepth, e→agentContext
```

It sits beside its siblings `jz` (`isMainAgent`, `:103149`) and `$Cr` (`isSubagent`, `:103156`), reusing the same `agentType` discriminator. The `?? 0` guard is defensive: if a context were ever constructed without `depth` (e.g. a legacy serialized record), the reader treats it as root-level rather than throwing, so an old record degrades to "no nesting" rather than crashing the filter.

**Why read depth from the context (not from a global counter).** Depth is a *per-branch* property, not a global state. Two sibling subagents spawned from the same parent are both at the same depth; a global "current recursion depth" counter would be wrong under the concurrent/async fan-out this subsystem allows (multiple async subagents alive at once). By storing `depth` on each `agentContext` and reading it locally, the limit is computed correctly for each independent branch of the spawn tree.

**Key insight.** `Gz(parent) + 1` is the universal "child depth" expression you will see at every spawn site below. `Gz` is the single read; the `+1` is the single increment; both are co-located at each spawn so there is no drift.

---

## 3. The enforcement gate: `cio` drops the Agent tool when `depth >= 5`

**What it does.** `cio` is the **universal** subagent tool filter (the v2.1.183 successor to v2.1.156's `uE6`). It decides which tools a subagent's toolset keeps. The new line `if (Rc(i, vs)) return s < v1i;` is the depth gate: the Agent tool is kept **iff** the caller's depth `s` is `< 5`.

**How it works (step-by-step).**

```javascript
// ============================================
// cio — universal subagent tool filter with the depth gate on the Agent tool
// Location: cli_inner_pretty.js:371188-371201
// ============================================

// ORIGINAL (for source lookup):
function cio({ tools: e, isBuiltIn: t, isAsync: n = !1, isTeammate: r = !1, permissionMode: o, agentDepth: s = 0 }) {
  return e.filter((i) => {
    if (Lx(i)) return !0;
    if (Rc(i, WM) && o === "plan") return !0;
    if (LCe.has(i.name)) return !1;
    if (!t && T5r.has(i.name)) return !1;
    if (Rc(i, vs)) return s < v1i;
    if (n && !UPt.has(i.name)) {
      if (Sl() && r && T1i.has(i.name)) return !0;
      return !1;
    }
    return !0;
  });
}

// READABLE (for understanding):
function filterSubagentTools({
  tools,
  isBuiltIn,
  isAsync = false,
  isTeammate = false,
  permissionMode,
  agentDepth = 0,                                  // ← NEW vs v2.1.156
}) {
  return tools.filter((tool) => {
    if (isAlwaysAvailable(tool)) return true;                        // Lx
    if (matchesName(tool, EXIT_PLAN_TOOL) && permissionMode === "plan") return true; // Rc(i, WM)
    if (HARD_DISALLOWED_SET.has(tool.name)) return false;           // LCe
    if (!isBuiltIn && NON_BUILTIN_BLOCKED_SET.has(tool.name)) return false; // T5r
    // ── THE DEPTH GATE ── (precedes the async/team branch, so it is UNIVERSAL)
    if (matchesName(tool, AGENT_TOOL)) return agentDepth < SUBAGENT_DEPTH_LIMIT; // Rc(i, vs) → s < v1i
    // async (background) branch: an async subagent only keeps async-allowed tools …
    if (isAsync && !ASYNC_ALLOWED_SET.has(tool.name)) {
      if (isAgentSwarmsEnabled() && isTeammate && TEAMMATE_ASYNC_EXTRA_SET.has(tool.name)) return true; // Sl()&&r
      return false;
    }
    return true;
  });
}

// Mapping: cio→filterSubagentTools, e→tools, t→isBuiltIn, n→isAsync, r→isTeammate, o→permissionMode,
//   s→agentDepth, i→tool, Lx→isAlwaysAvailable, WM→EXIT_PLAN_TOOL, Rc→matchesName, vs→AGENT_TOOL ("Agent"),
//   v1i→SUBAGENT_DEPTH_LIMIT, LCe→HARD_DISALLOWED_SET, T5r→NON_BUILTIN_BLOCKED_SET, UPt→ASYNC_ALLOWED_SET,
//   Sl→isAgentSwarmsEnabled, T1i→TEAMMATE_ASYNC_EXTRA_SET
```

Walking the filter for the Agent tool specifically:

1. `Lx(i)` (always-available short-circuit) — the Agent tool is not in this set, so this does not fire for it.
2. The plan-mode exit-tool exception — not the Agent tool.
3. `LCe.has` (hard disallow) / `!t && T5r.has` (non-built-in block) — the Agent tool is not in these sets in normal operation.
4. **`if (Rc(i, vs)) return s < v1i;`** — *this* line decides the Agent tool. It returns the boolean `agentDepth < 5`. If the caller is at depth 0–4, the Agent tool is **kept**; at depth ≥ 5, the Agent tool is **dropped from the toolset**. Because this `return` is unconditional for the Agent tool, the tool **never falls through** to the async/team branch below.
5. The async branch (`if (n && …)`) is now reached only by *non-Agent* tools.

**The two critical placement facts:**

- **The Agent line precedes the async block.** In v2.1.156 the Agent tool was decided *inside* `if (q && …)` (the async branch), so only async subagents in team mode could keep it. In v2.1.183 the decision is hoisted *above* the async branch, keyed purely on `agentDepth`. This is the structural change that makes the limit apply to **foreground** subagents too (they no longer skip the Agent decision by not being async). This is the literal mechanism of the **2.1.181 "foreground subagents now respect the same depth limit"** fix.
- **The gate is `return`, not `if (... ) return false`.** Returning the boolean `s < v1i` both *admits* the tool at low depth and *removes* it at high depth in one expression — there is no separate "if too deep, drop" branch and no error path.

**Why enforce by tool removal rather than a runtime refusal.** When the deepest agent's toolset is built, the Agent tool is simply absent. The model at depth 5 therefore *cannot even attempt* a spawn — the tool is not in its tool list, so the model never emits an Agent tool_use for it. The alternative (admit the tool, then throw "max depth exceeded" when called) was *not* chosen. Trade-offs:

- **No wasted model turn / no error to recover from.** A removed tool means the model's policy never considers spawning; a refusal would mean the model spends a turn emitting a tool call that then fails, and must recover from the error text.
- **Consistent with the rest of `cio`.** Every other limit in this filter (hard-disallow, non-built-in block, async restriction) is *also* expressed as tool removal. Enforcing depth the same way keeps the filter a single declarative pass with no special error machinery.
- **Cost:** the model gets no explicit signal that it *hit* a depth limit (vs. having no reason to delegate). In practice this is acceptable because a depth-5 leaf agent doing real work rarely needs to delegate further, and the absence is silent-by-design.

**Key insight.** The entire 5-level limit is a *one-line filter predicate over one tool*. There is no depth-checking control flow anywhere in the agent loop — the loop just runs whatever tools it was handed, and the toolset it was handed already encodes the limit. The cleverness is moving the policy entirely into toolset construction.

---

## 4. Threading the depth: `bte` passes it; `Gz(parent)+1` stamps it

The gate only works if the *correct* depth reaches `cio`. That is the job of `bte` (the resolved-tools builder) and the spawn sites that call it.

### 4.1 `bte` — the single chokepoint that forwards depth

**What it does.** `bte` is the v2.1.183 successor to v2.1.156's `no`. It resolves a caller's requested tools against the available toolset, applying `cio` as its filter. The new sixth positional parameter is `agentDepth`, forwarded straight into `cio`.

```javascript
// ============================================
// bte — resolved-tools builder; forwards agentDepth into the universal filter
// Location: cli_inner_pretty.js:371230-371234
// ============================================

// ORIGINAL (for source lookup):
function bte(e, t, n = !1, r = !1, o = !1, s = 0) {
  let { tools: i, disallowedTools: a, source: l, permissionMode: c } = e,
    u = r
      ? t
      : cio({ tools: t, isBuiltIn: l === "built-in", isAsync: n, isTeammate: o, permissionMode: c, agentDepth: s }),
    ...

// READABLE (for understanding):
function buildResolvedTools(
  options,                  // e — { tools, disallowedTools, source, permissionMode }
  candidateTools,           // t
  isAsync = false,          // n
  skipFilter = false,       // r — when true, bypass cio entirely (already filtered)
  isTeammate = false,       // o
  agentDepth = 0,           // s — ← NEW vs v2.1.156's 4-arg `no`
) {
  let { tools, disallowedTools, source, permissionMode } = options,
    filtered = skipFilter
      ? candidateTools
      : filterSubagentTools({
          tools: candidateTools,
          isBuiltIn: source === "built-in",
          isAsync,
          isTeammate,
          permissionMode,
          agentDepth,        // ← forwarded to the depth gate
        }),
    ...

// Mapping: bte→buildResolvedTools, e→options, t→candidateTools, n→isAsync, r→skipFilter,
//   o→isTeammate, s→agentDepth, cio→filterSubagentTools, l→source, c→permissionMode
```

Compare directly with the v2.1.156 builder `no(H, $, q=!1, K=!1)` (v2.1.156 `:278972`): four params, no `agentDepth`, no `isTeammate`. The two **added** trailing params (`o`/`isTeammate` and `s`/`agentDepth`) are the v2.1.183 footprint.

**Why one builder for fg and bg.** `bte` is called from the subagent runner to construct the child's toolset regardless of whether the child runs synchronously (foreground) or async (background) — the `isAsync` flag distinguishes them, but the *same function with the same agentDepth argument* builds both. This is what guarantees the limit is **shared**: there is no separate "background toolset builder" that could drift to a different cap.

### 4.2 The subagent runner reads the parent's depth

The runner that actually invokes `bte` supplies the *parent's* depth, read via `Gz`:

```javascript
// ============================================
// subagent runner — builds the child toolset with the parent's depth
// Location: cli_inner_pretty.js:387154
// ============================================

// ORIGINAL (for source lookup):
Ae = y ? f : bte(e, f, o, !1, D, Gz(c?.agentContext ?? n.agentContext)).resolvedTools,

// READABLE (for understanding):
resolvedTools = isPreResolved
  ? candidateTools
  : buildResolvedTools(
      options,
      candidateTools,
      isAsync,
      /*skipFilter*/ false,
      isTeammate,
      getAgentDepth(child?.agentContext ?? loop.agentContext), // ← parent depth feeds the gate
    ).resolvedTools,

// Mapping: bte→buildResolvedTools, Gz→getAgentDepth, c?.agentContext ?? n.agentContext → the active agentContext,
//   y→isPreResolved, o→isAsync, D→isTeammate
```

So the depth that the gate compares against `v1i` is `Gz(activeContext)` — the depth of the agent *whose toolset is being built*. If that agent is itself at depth 4, `4 < 5` is true → it keeps the Agent tool → it may spawn a depth-5 child. If it is at depth 5, `5 < 5` is false → no Agent tool → it is a leaf.

### 4.3 Every spawn surface stamps `depth = Gz(parent) + 1`

The child context must carry the *incremented* depth so that *its* future toolset build sees the next level. v2.1.183 stamps this at **four** distinct spawn surfaces, all using the identical `Gz(parent) + 1` expression. Co-locating the increment at each site (rather than a single helper) keeps it impossible to spawn a child without bumping its depth.

**(a) Regular Agent-tool spawn** — the Agent tool's `call` computes the child depth once and reuses it for telemetry, the async branch, and the sync branch:

```javascript
// ============================================
// Agent tool call — child spawn depth z = Gz(parent) + 1
// Location: cli_inner_pretty.js:423722 (compute), 423733/423825 (telemetry+agentDepth), 423933/423990 (depth)
// ============================================

// ORIGINAL (for source lookup):
let V = q === "remote",
  Q = V || ((o === !0 || P.background === !0 || F || W || !1) && !o3t),
  z = Gz(c.agentContext) + 1;                 // child depth
// ... telemetry:  agent_depth: z,            (@423733)
// ... async meta: agentDepth: z,             (@423825)
// ... async ctx:  depth: z,                  (@423933)
// ... sync ctx:   depth: z,                  (@423990)

// READABLE (for understanding):
let isRemote = launchMode === "remote",
  isAsync = isRemote || ((explicitBackground === true || params.background === true || forced || warned) && !syncOnly),
  childDepth = getAgentDepth(parentCtx.agentContext) + 1;  // ← parent depth + 1
// telemetry "tengu_agent_tool_selected": { …, agent_depth: childDepth, … }
// async-spawn agentMeta:   { …, agentDepth: childDepth, … }
// async child agentContext:{ agentId, parentAgentId, depth: childDepth, agentType: "subagent", … }
// sync  child agentContext:{ agentId, parentAgentId, depth: childDepth, agentType: "subagent", … }

// Mapping: z→childDepth, Gz→getAgentDepth, c.agentContext→parentCtx.agentContext, Q→isAsync
```

Note `z` is computed **once** (`:423722`) and then stamped into *both* the async child context (`depth: z` @`:423933`) and the sync child context (`depth: z` @`:423990`), plus the `agentDepth: z` async metadata (`:423825`) and the `agent_depth: z` telemetry (`:423733`). One compute, four uses — fg and bg children from the same call get the identical depth.

**(b) Resume path** — a resumed local-agent task either reuses its *persisted* `spawnDepth`, or (first run) computes `Gz(parent)+1`:

```javascript
// ============================================
// resume path — reuse persisted spawnDepth, else Gz(parent)+1
// Location: cli_inner_pretty.js:434085 (compute), 434205 (stamp depth)
// ============================================

// ORIGINAL (for source lookup):
g = u.get(e),
y = (od(g) ? g.spawnDepth : void 0) ?? Gz(o.agentContext) + 1,
// ... later: depth: y,   (@434205)

// READABLE (for understanding):
let existingTask = taskRegistry.get(agentId),
  resumeDepth =
    (isLocalAgentTask(existingTask) ? existingTask.spawnDepth : undefined) // reuse what was persisted
    ?? getAgentDepth(parentCtx.agentContext) + 1;                          // else derive fresh
// child agentContext: { agentId, parentAgentId, depth: resumeDepth, agentType: "subagent", … }

// Mapping: y→resumeDepth, od→isLocalAgentTask, g.spawnDepth→persisted depth, Gz→getAgentDepth, o.agentContext→parent
```

`od` (`:445761`) is the predicate `type === "local_agent"`. The `?? ` means: if this is a known local-agent task with a recorded `spawnDepth`, **honor the recorded value** so a resumed agent keeps its original depth across resumes; only a brand-new spawn derives `Gz(parent)+1`. This is why depth had to be *persisted* (§5) — resume must not re-base the tree.

**(c) Built-in fork** — the fork registrar reads the parent depth and stamps it on both the task record and the child context:

```javascript
// ============================================
// built-in fork — d = Gz(parent); spawnDepth: d (registry) + depth: d (context)
// Location: cli_inner_pretty.js:473586 (compute), 473590 (spawnDepth), 473606 (agentDepth), 473612 (depth)
// ============================================

// ORIGINAL (for source lookup):
d = Gz(t.agentContext),
p = Xut({ agentId: l, ownerAgentId: Ls(), spawnDepth: d, description: a, prompt: e,
          selectedAgent: j2, taskRegistry: c, toolUseId: t.toolUseId }),
// ... agentMeta: agentDepth: d,   (@473606)
// ... child ctx: depth: d,        (@473612)

// READABLE (for understanding):
let forkDepth = getAgentDepth(parentCtx.agentContext),
  taskRecord = registerLocalAgentTask({
    agentId, ownerAgentId: currentAgentId(), spawnDepth: forkDepth, // persist
    description, prompt, selectedAgent, taskRegistry, toolUseId,
  });
// agentMeta:   { …, agentDepth: forkDepth, … }
// child ctx:   { agentId, parentAgentId, depth: forkDepth, agentType: "subagent", isBuiltIn: true, … }

// Mapping: d→forkDepth, Gz→getAgentDepth, t.agentContext→parentCtx, Xut→registerLocalAgentTask, Ls→currentAgentId
```

Note this site uses `Gz(parent)` **without** the `+1`. That is deliberate: a *fork* is a continuation/sibling of the same conceptual unit at the *same* depth (it forks the parent's session rather than nesting under it), whereas the Agent-tool spawn and workflow agent are *children* one level deeper. (Confidence: medium — this is the consistent reading of the four sites, but the precise fork-vs-spawn depth semantics were inferred from the `+1`/no-`+1` split, not from an explicit comment in source.)

**(d) Workflow agent** — stamps `Gz(parent)+1` on the workflow-spawned agent context:

```javascript
// ============================================
// workflow agent — depth: Gz(parent) + 1
// Location: cli_inner_pretty.js:417155
// ============================================

// ORIGINAL (for source lookup):
let Dt = {
  agentId: dt,
  parentAgentId: jz(ue) ? void 0 : ue?.agentId,
  depth: Gz(ue) + 1,
  parentSessionId: a4(),
  agentType: "subagent",
  subagentName: pe.agentType,
  isBuiltIn: ay(pe),
};

// READABLE (for understanding):
let childCtx = {
  agentId,
  parentAgentId: isMainAgent(parentCtx) ? undefined : parentCtx?.agentId,
  depth: getAgentDepth(parentCtx) + 1,           // workflow agents nest one level deeper
  parentSessionId: currentSessionId(),
  agentType: "subagent",
  subagentName: agentDef.agentType,
  isBuiltIn: isBuiltInAgent(agentDef),
};

// Mapping: Dt→childCtx, dt→agentId, jz→isMainAgent, ue→parentCtx, Gz→getAgentDepth, a4→currentSessionId, ay→isBuiltInAgent
```

**Why stamp at the spawn site, not in a constructor.** Each spawn surface already builds the child `agentContext` literal (with `agentId`, `parentAgentId`, `agentType`, etc.), so adding `depth:` there is one field on an object that *must* be constructed anyway. There is no shared "make child context" factory to add it to without refactoring all four call sites; stamping inline keeps each path self-contained and makes the depth source obvious when reading any one spawn site. The cost is the `Gz(parent) (+1)` expression is repeated four times, but that is two tokens of duplication for zero cross-site coupling.

---

## 5. Persisting depth: `spawnDepth` in the task registry (`Xut`)

**What it does.** `Xut` (the local-agent task registrar) writes a task record into the registry. v2.1.183 adds `spawnDepth` to that record so a backgrounded/resumable agent's depth survives across the worker lifecycle (so a resume — §4.3(b) — reads it back instead of re-deriving).

```javascript
// ============================================
// Xut — local-agent task registrar; persists spawnDepth into the record
// Location: cli_inner_pretty.js:446073-446111
// ============================================

// ORIGINAL (for source lookup):
function Xut({ agentId: e, ownerAgentId: t, parentAgentId: n, spawnDepth: r, description: o, prompt: s,
              selectedAgent: i, taskRegistry: a, parentAbortController: l, toolUseId: c, cwd: u }) {
  AWe(e, mP(If(e)));
  let d = l ? ZO(l) : Xl(),
    p = {
      ...c0(e, "local_agent", o, c),
      type: "local_agent",
      status: "running",
      agentId: e,
      ownerAgentId: t,
      parentAgentId: n,
      spawnDepth: r,
      prompt: s,
      cwd: u,
      selectedAgent: i,
      agentType: i.agentType ?? "general-purpose",
      abortController: d,
      ...
      keepaliveReasons: new Set(),
    };
  return (a.register(p), p);
}

// READABLE (for understanding):
function registerLocalAgentTask({ agentId, ownerAgentId, parentAgentId, spawnDepth, description, prompt,
                                  selectedAgent, taskRegistry, parentAbortController, toolUseId, cwd }) {
  bindTaskAbortHandle(agentId, taskFilePath(formatAgentId(agentId)));
  let abortController = parentAbortController ? deriveAbortController(parentAbortController) : newAbortController(),
    record = {
      ...baseTaskFields(agentId, "local_agent", description, toolUseId),
      type: "local_agent",
      status: "running",
      agentId, ownerAgentId, parentAgentId,
      spawnDepth,                              // ← persisted depth, read back on resume
      prompt, cwd, selectedAgent,
      agentType: selectedAgent.agentType ?? "general-purpose",
      abortController,
      ...
      keepaliveReasons: new Set(),
    };
  return (taskRegistry.register(record), record);
}

// Mapping: Xut→registerLocalAgentTask, e→agentId, t→ownerAgentId, n→parentAgentId, r→spawnDepth, o→description,
//   s→prompt, i→selectedAgent, a→taskRegistry, l→parentAbortController, c→toolUseId, u→cwd
```

**Why persist in the registry.** Background/local agents outlive a single in-process tool call — they are tracked by a registry that survives across resume/handoff. If depth lived only on the transient in-memory `agentContext`, a resume would have to **re-derive** it from the (possibly different) resuming parent, which would corrupt the tree depth (a resumed depth-3 agent resumed from `main` would become depth 1). Persisting `spawnDepth` in the durable record and preferring it on resume (`g.spawnDepth ?? Gz(parent)+1`, §4.3(b)) keeps every agent's depth stable for its entire life. **Key insight:** the persisted `spawnDepth` is the *authoritative* depth for a local/background agent; the live-context `depth` is a mirror, and the `??` in the resume path is what makes the persisted value win.

---

## 6. Telemetry: `agent_depth`

Depth is surfaced in two analytics events so the limit's real-world distribution is observable:

- `tengu_agent_tool_selected` carries `agent_depth: z` at spawn time (`:423733`) — the depth of the child being launched.
- `tengu_agent_tool_terminated` carries `agent_depth: r.agentDepth` (`:371803`) — read back from the agent's metadata when it ends.

There is **no** telemetry event for "depth limit hit" — consistent with §3's enforcement-by-removal: there is no hit event because there is no refusal; the deepest agent simply never had the tool. `agent_depth` therefore measures *how deep agents actually run*, not how often the cap is reached.

---

## 7. End-to-end trace: what happens at depth 5

Putting it together, here is the lifecycle of a spawn at the boundary:

1. An agent at depth `4` runs. When its loop builds its toolset, the runner (`:387154`) calls `bte(…, Gz(ctx))` = `bte(…, 4)` → `cio({…, agentDepth: 4})`. The gate evaluates `Rc(i, vs) → 4 < 5 = true` → the agent **keeps** the Agent tool.
2. That depth-4 agent's model emits an Agent tool_use. The Agent `call` (`:423505`) computes `z = Gz(parent)+1 = 4+1 = 5` (`:423722`) and stamps `depth: 5` on the child context (`:423933`/`:423990`), persisting `spawnDepth: 5` if it is a local/background agent (`:446073`). Telemetry logs `agent_depth: 5`.
3. The new depth-5 agent runs. Its toolset build calls `bte(…, Gz(ctx))` = `bte(…, 5)` → `cio({…, agentDepth: 5})`. The gate evaluates `5 < 5 = false` → the Agent tool is **filtered out**. The depth-5 agent's model never sees the Agent tool, so it cannot delegate further. It is a **leaf**.

The cap of "5 spawnable levels under `main`" is therefore: `main`(0) → child(1) → child(2) → child(3) → child(4) → leaf(5). The depth-5 agent works but cannot spawn; an attempt to go deeper is impossible because the tool is absent, not refused.

---

## 8. Why this is genuinely "fg and bg share one limit" (the 2.1.181 fix)

The changelog phrasing — *"foreground subagents now respect the same 5-level depth limit as background subagents"* — maps to two concrete code facts already shown:

1. **One filter for both.** `cio` is reached by *every* subagent toolset build via the single `bte` chokepoint (`:387154`), whether the child is `isAsync` (background) or synchronous (foreground). The `isAsync` flag steers only the *async-allowed-tools* branch; the **Agent-tool depth decision sits above it** (`:371194`), so both paths hit the identical `s < v1i` comparison with the identical `agentDepth`.
2. **One increment for both.** At the Agent `call`, `z` is computed once (`:423722`) and stamped on both the async child context and the sync child context (`:423933` and `:423990`). A foreground and a background child spawned at the same level get the *same* depth, so they are subject to the *same* cap on their own future spawns.

In v2.1.156 neither was true: the Agent tool was only reachable via the async/team branch, so a synchronous (foreground) subagent never even got the Agent tool, and there was no depth to share. The v2.1.183 change is precisely the hoist of the Agent decision out of the async branch plus the universal `agentDepth` threading.

---

## 9. Confidence & open questions (carried from the dossier)

- **High confidence:** the `v1i = 5` constant, `Gz` reader, the `cio` gate line `if (Rc(i, vs)) return s < v1i;` and its placement above the async branch, the `bte` sixth param, the four spawn-site stampings (`:423722`, `:434085`, `:473586`, `:417155`), `spawnDepth` persistence in `Xut`, the `agent_depth` telemetry, and the v2.1.156 `uE6` team-only before-picture (incl. `grep -c agentDepth/spawnDepth = 0` in v2.1.156). All read directly at the cited v2.1.183 lines.
- **Medium confidence — fork uses `Gz(parent)` without `+1`** (§4.3(c)): the read at `:473586` is `d = Gz(t.agentContext)` with no increment, unlike the spawn/resume/workflow sites that use `+1`. The interpretation that a fork is a *same-depth* continuation while a spawn is a *deeper* child is inferred from the `+1`/no-`+1` split, not from an explicit source comment. Flagged for the verifier.
- **Open question — "Working forever" (2.1.178) and `--bg -cn` name-seeding (2.1.176):** the dossier could not isolate these to distinct lines; they are not part of the depth mechanism and are documented (as far as they could be located) in the sibling `agents --json` / `/bg` deltas, not here.
- **`CLAUDE_CODE_FORK_SUBAGENT` is NOT new:** it already existed in v2.1.156 (v2.1.156 `:216773`, `:389421`). Only the *depth* mechanism (`v1i`, `agentDepth`, `spawnDepth`, the `cio`/`bte` threading) is new in v2.1.183. The env var governs *whether* nested subagent forking is enabled; `v1i` is the ceiling once it is.

---

## Related Symbols

> Symbol mappings live in the central index, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Tools, Subagent, State — the depth gate/threading lives here)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, Model)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - per-feature additions: [symbol_additions_v2_1_183_background_agents.md](../00_overview/symbol_additions_v2_1_183_background_agents.md)

Related deltas (this tree): the `/bg` command surface re-derivation, worker env-isolation, and `agents --json` rework are sibling docs in this module ([README.md](./README.md)). The Agent-tool *teammate-routing* rewrite (implicit team, `name`-param routing) is [../30_agent_team/implicit_team_and_agent_tool_spawn.md](../30_agent_team/implicit_team_and_agent_tool_spawn.md). v2.1.156 carryover for the `/bg` flow and the worker lifecycle: [../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md](../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md), [../../../claude_code_v_2.1.156/analyze/36_background_agents/worker_retire_respawn_2156.md](../../../claude_code_v_2.1.156/analyze/36_background_agents/worker_retire_respawn_2156.md).

Key functions/constants in this document (list format, per CLAUDE.md):

- `SUBAGENT_DEPTH_LIMIT` (obfuscated: `v1i`, `cli_inner_pretty.js:221800`) — hard-coded `5`; the nested-subagent depth cap.
- `getAgentDepth` (obfuscated: `Gz`, `cli_inner_pretty.js:103152`) — returns `0` for `main`, else `agentContext.depth ?? 0`.
- `filterSubagentTools` (obfuscated: `cio`, `cli_inner_pretty.js:371188`) — universal subagent tool filter; depth gate at `:371194` (`if (Rc(i, vs)) return s < v1i;`); v2.1.156 predecessor `uE6` (v2.1.156 `:278956`).
- `buildResolvedTools` (obfuscated: `bte`, `cli_inner_pretty.js:371230`) — resolved-tools builder; new 6th param `agentDepth (s=0)`; v2.1.156 predecessor `no` (4-arg, v2.1.156 `:278972`).
- `AGENT_TOOL` name const (obfuscated: `vs`, `cli_inner_pretty.js:149939`) — `"Agent"`; sibling `c9 = "Task"`; v2.1.156 `sq` (v2.1.156 `:185637`).
- `matchesName` (obfuscated: `Rc`, `cli_inner_pretty.js:149965`) — `e.name === t || aliases.includes(t)`; v2.1.156 `h1`.
- `Agent tool def` (obfuscated: `f3n`, `cli_inner_pretty.js:423505`) — the Agent tool; child depth `z = Gz(parent)+1` at `:423722`, stamped `agentDepth: z` `:423825`, `depth: z` `:423933`/`:423990`.
- `subagent runner` (resolved-tools call, `cli_inner_pretty.js:387154`) — `bte(e, f, o, !1, D, Gz(c?.agentContext ?? n.agentContext))`.
- `resume-path depth` (local `y`, `cli_inner_pretty.js:434085`) — `(od(g) ? g.spawnDepth : void 0) ?? Gz(o.agentContext)+1`; stamped `depth: y` `:434205`.
- `fork-path depth` (local `d`, `cli_inner_pretty.js:473586`) — `Gz(t.agentContext)` (no `+1`); `spawnDepth: d` `:473590`, `depth: d` `:473612`.
- `workflow-agent depth` (`cli_inner_pretty.js:417155`) — `depth: Gz(ue) + 1`.
- `registerLocalAgentTask` (obfuscated: `Xut`, `cli_inner_pretty.js:446073`) — persists `spawnDepth` into the task record (`:446095`).
- `isLocalAgentTask` (obfuscated: `od`, `cli_inner_pretty.js:445761`) — `type === "local_agent"`; gates the persisted-depth read on resume.
- `isMainAgent` (obfuscated: `jz`, `cli_inner_pretty.js:103149`) / `isSubagent` (obfuscated: `$Cr`, `cli_inner_pretty.js:103156`) — `agentType` discriminators beside `Gz`.
- `getForkSubagentSource` (obfuscated: `L1i`, `cli_inner_pretty.js:222216`) — `CLAUDE_CODE_FORK_SUBAGENT` source resolver (pre-existing in v2.1.156); enables nested forking, separate from the `v1i` ceiling.
- v2.1.156 before-picture: `uE6` (filter, v2.1.156 `:278956`), `no` (builder, v2.1.156 `:278972`), `sq` (`"Agent"`, v2.1.156 `:185637`), `h1` (matcher), `R7`/`mG` (team gates) — `agentDepth`/`spawnDepth` grep = 0 in the v2.1.156 bundle.
