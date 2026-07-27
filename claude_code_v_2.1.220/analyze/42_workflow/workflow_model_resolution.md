# Per-agent model and effort configuration in workflow scripts

> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, `build_sha 4073f595`, 872,596 lines).
> BASELINE: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` is a **220** line unless tagged **(193)**.
> Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md)

Companion documents: [workflow_runtime_core.md](workflow_runtime_core.md) ·
[workflow_lifecycle.md](workflow_lifecycle.md) ·
[workflow_state_and_ipc.md](workflow_state_and_ipc.md) ·
[workflow_server_authored_launch.md](workflow_server_authored_launch.md)

---

## TL;DR

The tool prose gives `agent()` two knobs — `opts.model` and `opts.effort` — and tells the model to
usually omit both (`:388988`, `:388988`). Behind those two words sits a five-level precedence chain,
a family-rank cap for the `Explore` agent, a provider-specific 1M-context rewrite, an allowlist
fallback, and — **new in this window** — a per-spawn telemetry audit that reports when the requested
model was not the model that ran.

| Question | Answer | Anchor |
|---|---|---|
| Precedence for `opts.model` | `CLAUDE_CODE_SUBAGENT_MODEL` env → `opts.model` → agent-definition `model` → parent's main-loop model | `tte` `:318799-318832`; enumerated in `Wrd` `:318842-318851` |
| Who resolves it | **twice** — `tte` in the executor for *display*, `Wrd` inside `oG` for *execution* | `:387467` vs `:344319` |
| Are the two guaranteed equal? | **No.** The executor passes `U.options.mainLoopModel`; `oG` passes `WL(r)`, which applies `permissionLayers` of kind `model` | `WL` `:237861-237865` |
| `opts.effort` | `gW` normalises to `low\|medium\|high\|xhigh\|max` or an integer; `undefined` means inherit | `:119487-119496`, `EL` `:119650` |
| Where effort lands | spliced onto the *agent definition*, not the request | `:387459-387460` |
| `meta.phases[].model` | parsed, stored, persisted — and **never read** | `ggy` `:275733`, `:275735`; no consumer |
| NET_NEW in this window | `subagent_model_resolve` audit (**220=7 / 193=0**), `CLAUDE_CODE_DISABLE_EXPLORE_INHERIT_CAP` (**220=2 / 193=0**) | `:318862-318866`, `:269269` |

---

## 1. Where model resolution happens — twice

Reading the executor in isolation is misleading. Two independent resolutions run for every workflow
agent, with different inputs and different purposes.

### 1.1 The display resolution

```javascript
// ============================================
// executeLocalAgent (excerpt) - predict the model for the progress row
// Location: cli_inner_pretty.js:387461-387468
// ============================================

// ORIGINAL (for source lookup):
Me = U.getAppState(),
ze = En(U),
nt = U.options.tools.filter(jL),
at = { ...ze, mode: Ue.permissionMode ?? "acceptEdits" },
Ze = G7(at, xBe(Me.mcp.tools.concat(nt)), { skipReplFilter: !0, skillTools: Me.skillTools }),
He = Ne ? [...Ze.filter((It) => !qa(It, Eg)), Ne] : Ze,
Qe = tte(M9e(Ue, U.options.mainLoopModel), U.options.mainLoopModel, ve?.model, ze.mode),
lt = ze.mode === "auto",

// READABLE (for understanding):
const appState   = ctx.getAppState();
const permCtx    = getPermissionContext(ctx);
const replTools  = ctx.options.tools.filter(isReplTool);
const agentPerm  = { ...permCtx, mode: agentDef.permissionMode ?? "acceptEdits" };
const baseTools  = filterToolsForAgent(agentPerm,
                     dedupeTools(appState.mcp.tools.concat(replTools)),
                     { skipReplFilter: true, skillTools: appState.skillTools });
const tools      = structuredOutputTool
                 ? [...baseTools.filter((t) => !isTool(t, STRUCTURED_OUTPUT_TOOL)), structuredOutputTool]
                 : baseTools;
const displayModel = resolveSubagentModel(                 // ← for the progress row ONLY
  applyExploreInheritCap(agentDef, ctx.options.mainLoopModel),   // frontmatter candidate
  ctx.options.mainLoopModel,                                     // parent model
  opts?.model,                                                   // per-call override
  permCtx.mode,
);
const isAutoMode = permCtx.mode === "auto";

// Mapping: Qe→displayModel, tte→resolveSubagentModel (:318799), M9e→applyExploreInheritCap (:269267),
//          Ue→agentDef, ve→opts, ze→permCtx, En→getPermissionContext, G7→filterToolsForAgent
```

`Qe` is used in exactly three places, all of them presentational or comparative:

- `model: Qe` in every `workflow_agent` progress node emitted by the runner (`:387523`);
- `Pe = Qe ? lo(Qe) : void 0` (`:387509`) — the *family* of the predicted model;
- the fallback detector (`:387624`):

  ```javascript
  // ORIGINAL:  if (Ji && Pe && Ji !== Qe && lo(Ji) !== Pe) we = Ji;
  // READABLE:  if (actualModel && expectedFamily && actualModel !== displayModel
  //                && familyOf(actualModel) !== expectedFamily) fallbackModel = actualModel;
  ```

  i.e. *"the assistant message came back stamped with a model that is neither the one I predicted nor
  even in the same family"* → record it as `fallbackModel` and surface it in the progress node
  (`:387524`). The family comparison is what stops a `[1m]` suffix variant or a minor point-release
  from being reported as a fallback.

### 1.2 The execution resolution

`oG` — the shared subagent query used by Task, Agent, background agents and workflow agents alike —
does its own resolution and ignores `Qe` entirely:

```javascript
// ============================================
// runSubagentQuery (excerpt) - the resolution that actually selects the model
// Location: cli_inner_pretty.js:344315-344320
// ============================================

// ORIGINAL (for source lookup):
let z = En(r), V = z.mode,
  K = W ? r.rootToolSurface.mainLoopModel : WL(r),
  Y = Wrd(M9e(e, K), K, d, V, U, W ? void 0 : u?.replHydration?.kind === "resume" ? "resume" : "spawn"),
  re = Y,

// READABLE (for understanding):
const permCtx = getPermissionContext(ctx);
const mode    = permCtx.mode;
const parentModel = isTeammate ? ctx.rootToolSurface.mainLoopModel : effectiveMainLoopModel(ctx);
const model = resolveSubagentModelAudited(
  applyExploreInheritCap(agentDefinition, parentModel),
  parentModel,
  requestedModel,            // ← `model:` param, which the executor passes as `ve?.model`
  mode,
  onModelRestricted,
  isTeammate ? undefined : (override?.replHydration?.kind === "resume" ? "resume" : "spawn"),
);

// Mapping: WL→effectiveMainLoopModel (:237861), Wrd→resolveSubagentModelAudited (:318835),
//          d→requestedModel, U→onModelRestricted, u→override
```

The executor supplies only `model: ve?.model` to `oG` (`:387588`), i.e. the raw per-call override.
Everything else is re-derived from the tool-use context.

### 1.3 The divergence, and when it bites

```javascript
// ============================================
// effectiveMainLoopModel - the main-loop model AFTER permission layers
// Location: cli_inner_pretty.js:237861-237865
// ============================================

// ORIGINAL (for source lookup):
function WL(e) {
  let t = e.options.mainLoopModel;
  for (let r of e.permissionLayers ?? []) if (r.kind === "model") t = r.mainLoopModel;
  return t;
}

// READABLE (for understanding):
function effectiveMainLoopModel(ctx) {
  let model = ctx.options.mainLoopModel;
  for (const layer of ctx.permissionLayers ?? [])       // last layer wins
    if (layer.kind === "model") model = layer.mainLoopModel;
  return model;
}

// Mapping: WL→effectiveMainLoopModel
```

**The executor's display path reads `U.options.mainLoopModel` directly; `oG`'s execution path reads
`WL(r)`.** When a `model` permission layer is active — the mechanism behind a scoped model override
for a tool surface — the two disagree, and the `/workflows` row shows the *unlayered* model while the
*layered* one runs.

This is not hypothetical bookkeeping: it also poisons the fallback detector. `Pe` is derived from the
unlayered `Qe`, so if a layer switches the family, **every** assistant message comes back with a
family that differs from `Pe`, and `fallbackModel` is set on every agent — reporting a fallback that
never happened. The row would read as though the API had silently downgraded the request.

The narrow fix would be one character — passing `WL(U)` instead of `U.options.mainLoopModel` at
`:387467`. That it is not done is best read as evidence that the display path was written before
`permissionLayers` gained a `model` kind and was never revisited, rather than as a deliberate choice.
**Recorded as a defect, not a delta:** `permissionLayers` is present in both bundles, and the 2.1.193
executor has the same shape at `:423769 (193)`.

---

## 2. The precedence chain

### 2.1 `tte` in full

```javascript
// ============================================
// resolveSubagentModel - five-level precedence with allowlist fallback and Bedrock 1M rewrite
// Location: cli_inner_pretty.js:318799-318832
// ============================================

// ORIGINAL (for source lookup):
function tte(e, t, r, n, o) {
  let i = () => LP({ permissionMode: n ?? "default", mainLoopModel: t, exceeds200kTokens: !1 }),
    s = (p, f = p) => { QRy(p); let m = i();
        if (Qs(vi(f)).toLowerCase() !== Qs(vi(m)).toLowerCase()) o?.(p, m); return m; },
    a = Z.CLAUDE_CODE_SUBAGENT_MODEL;
  if (a && a !== "inherit") { let p = vi(a); if (!Pl(p)) return s(a); return p; }
  let l = Fzn(t),
    c = (p, f) => { if (l && ny(p) === "bedrock") { if (Fzn(f)) return p; return xot(p, l); } return p; };
  if (r) {
    if (r === "inherit") return i();
    if (Grd(r, t)) return t;
    let p = c(jrd(vi(r)), r);
    if (!Pl(p)) return s(r, p);
    return p;
  }
  let u = e ?? JRy();
  if (u === "inherit") return i();
  if (Grd(u, t)) return t;
  let d = c(jrd(vi(u)), u);
  if (!Pl(d)) return s(u, d);
  return d;
}

// READABLE (for understanding):
function resolveSubagentModel(frontmatterModel, parentModel, requestedModel, permissionMode, onRestricted) {
  const inheritParent = () => resolveMainLoopModel({
    permissionMode: permissionMode ?? "default", mainLoopModel: parentModel, exceeds200kTokens: false });

  // Not permitted by the org allowlist → warn, fall back to the parent, and tell the caller
  // *only if* the fallback is actually a different model.
  const fallBackToParent = (requested, normalised = requested) => {
    warnModelNotAllowlisted(requested);
    const parent = inheritParent();
    if (canonical(requested === normalised ? requested : normalised) !== canonical(parent))
      onRestricted?.(requested, parent);
    return parent;
  };

  // ── LEVEL 1: environment override, absolute ────────────────────────────────
  const envModel = env.CLAUDE_CODE_SUBAGENT_MODEL;
  if (envModel && envModel !== "inherit") {
    const normalised = normaliseModelId(envModel);
    return isModelAllowed(normalised) ? normalised : fallBackToParent(envModel);
  }

  // Bedrock 1M-context preservation: if the PARENT is a 1M model and the candidate resolves to a
  // Bedrock id that is not itself 1M, re-apply the parent's 1M variant.
  const parent1m = get1mSuffix(parentModel);
  const preserve1m = (candidate, original) =>
    parent1m && providerOf(candidate) === "bedrock"
      ? (get1mSuffix(original) ? candidate : apply1mSuffix(candidate, parent1m))
      : candidate;

  // ── LEVEL 2: opts.model, per call ──────────────────────────────────────────
  if (requestedModel) {
    if (requestedModel === "inherit") return inheritParent();
    if (isFamilyAliasOfParent(requestedModel, parentModel)) return parentModel;   // "opus" when parent IS opus
    const resolved = preserve1m(maybeUpgradeTo1m(normaliseModelId(requestedModel)), requestedModel);
    return isModelAllowed(resolved) ? resolved : fallBackToParent(requestedModel, resolved);
  }

  // ── LEVEL 3/4: agent-definition model, else the global default ─────────────
  const candidate = frontmatterModel ?? DEFAULT_SUBAGENT_MODEL();      // DEFAULT is the literal "inherit"
  if (candidate === "inherit") return inheritParent();                 // ── LEVEL 5: inherit
  if (isFamilyAliasOfParent(candidate, parentModel)) return parentModel;
  const resolved = preserve1m(maybeUpgradeTo1m(normaliseModelId(candidate)), candidate);
  return isModelAllowed(resolved) ? resolved : fallBackToParent(candidate, resolved);
}

// Mapping: tte→resolveSubagentModel, e→frontmatterModel, t→parentModel, r→requestedModel,
//          n→permissionMode, o→onRestricted, i→inheritParent, s→fallBackToParent,
//          LP→resolveMainLoopModel (:110662-110719), QRy→warnModelNotAllowlisted (:318869),
//          Pl→isModelAllowed (:110218), vi→normaliseModelId (:111232), Qs→canonical (:86605),
//          Fzn→get1mSuffix (:100087), xot→apply1mSuffix (:100092), ny→providerOf (:100331),
//          jrd→maybeUpgradeTo1m (:318874), Grd→isFamilyAliasOfParent (:318879),
//          JRy→DEFAULT_SUBAGENT_MODEL (:318796, returns "inherit")
```

**Why the environment variable is checked first and cannot be overridden by the script.**
`CLAUDE_CODE_SUBAGENT_MODEL` is an operator control — it exists so an organisation or a CI harness can
force every subagent in the process onto a cheap model regardless of what any agent definition or any
model-authored script asks for. A workflow script is model-authored text; if `opts.model` outranked
the env var, the control would be advisory. The one escape hatch is the literal value `"inherit"`,
which means "no opinion, fall through" rather than "use the parent" — a three-way flag encoded in a
string.

**Why `Grd` (family alias) short-circuits to the parent.** `agent({model: 'opus'})` when the parent is
already an Opus model returns the parent id *verbatim* (`:318823`, `:318830`) rather than resolving
`"opus"` to the newest Opus. Otherwise a script asking for "the same class of model as you" would
silently *upgrade* a session deliberately pinned to `claude-opus-4-5`, and would also lose any `[1m]`
suffix. The alias table is only four entries (`fable`, `opus`, `sonnet`, `haiku`, `:318881-318890`)
and matches by substring on the family of the parent.

**Why the 1M preservation is Bedrock-specific** (`:318813-318820`). On the first-party API the 1M
context window is expressed as a model-id suffix (`[1m]`) that `jrd` re-applies automatically
(`:318874-318878`: *if the family includes "opus" and the model supports it and the session is in 1M
mode, append `[1m]`*). Bedrock instead exposes 1M as **distinct inference-profile ids**, so a
subagent resolving to a Bedrock id would silently drop from 1M to 200k. `xot(p, l)` re-applies the
parent's 1M marker to the resolved Bedrock id — but only when the candidate did not already carry one
(`if (Fzn(f)) return p` (`:318816`)), which prevents double-application.

**Why `s` (the allowlist fallback) compares canonicalised ids before invoking `onRestricted`.**
`QRy` always logs the warning, but the *callback* — which is what drives the
`override_dropped` telemetry and the user-visible "model restricted" notice — only fires when the
fallback is genuinely a different model. Requesting `"opus"` in a session already resolving to the
same Opus id is not an override that got dropped; it is a no-op. `Qs(vi(x)).toLowerCase()` normalises
both sides through the id normaliser and the canonicaliser before comparing.

### 2.2 The precedence, stated by the code itself

`Wrd` (`:318835-318868`) wraps `tte` purely to emit telemetry, and in doing so it writes the
precedence table out as data — this is the authoritative enumeration, not an inference:

```javascript
// ============================================
// resolveSubagentModelAudited - resolve, then report requested-vs-resolved
// Location: cli_inner_pretty.js:318835-318868
// ============================================

// ORIGINAL (for source lookup):
function Wrd(e, t, r, n, o, i) {
  if (i === void 0) return tte(e, t, r, n, o);
  let s = !1, a = tte(e, t, r, n, (m, g) => { ((s = !0), o?.(m, g)); }),
    l = Z.CLAUDE_CODE_SUBAGENT_MODEL,
    [c, u] = l && l !== "inherit" ? [l, "env"]
           : r ? (r === "inherit" ? [t, "inherit"] : [r, "tool"])
           : e && e !== "inherit" ? [e, "frontmatter"]
           : [t, "inherit"],
    d = xur(c, lo(c)), p = xur(a, lo(a)),
    f = { source: fe(i), precedence: fe(u), requested_family: fe(d), resolved_family: fe(p),
          requested_model: Bu(c) ?? Ee("none"), resolved_model: Bu(a) ?? Ee("none") };
  if (s) $e("subagent_model_resolve", "override_dropped", f);
  else if (d !== "other" && p !== "other" && d !== p)
    if (u === "inherit") $e("subagent_model_resolve", "inherit_family_mismatch", f);
    else $e("subagent_model_resolve", "family_mismatch", f);
  else be("subagent_model_resolve", f);
  return a;
}

// READABLE (for understanding):
function resolveSubagentModelAudited(frontmatterModel, parentModel, requestedModel, mode, onRestricted, spawnKind) {
  if (spawnKind === undefined) return resolveSubagentModel(...);      // audit is opt-in
  let overrideDropped = false;
  const resolved = resolveSubagentModel(frontmatterModel, parentModel, requestedModel, mode,
    (req, actual) => { overrideDropped = true; onRestricted?.(req, actual); });

  const envModel = env.CLAUDE_CODE_SUBAGENT_MODEL;
  const [requested, precedence] =
      envModel && envModel !== "inherit"          ? [envModel,          "env"]
    : requestedModel                              ? (requestedModel === "inherit"
                                                      ? [parentModel,   "inherit"]
                                                      : [requestedModel,"tool"])
    : frontmatterModel && frontmatterModel !== "inherit" ? [frontmatterModel, "frontmatter"]
    :                                               [parentModel,      "inherit"];

  const fields = {
    source: redact(spawnKind), precedence: redact(precedence),
    requested_family: redact(familyRank(requested, familyOf(requested))),
    resolved_family:  redact(familyRank(resolved,  familyOf(resolved))),
    requested_model: allowlistedModelId(requested) ?? literal("none"),
    resolved_model:  allowlistedModelId(resolved)  ?? literal("none"),
  };

  if (overrideDropped)                       countFailure("subagent_model_resolve", "override_dropped", fields);
  else if (requestedFamily !== "other" && resolvedFamily !== "other" && requestedFamily !== resolvedFamily)
    countFailure("subagent_model_resolve",
                 precedence === "inherit" ? "inherit_family_mismatch" : "family_mismatch", fields);
  else                                       countSuccess("subagent_model_resolve", fields);
  return resolved;
}

// Mapping: Wrd→resolveSubagentModelAudited, i→spawnKind, s→overrideDropped, u→precedence,
//          xur→familyRank (:318785-318792), lo→familyOf (:111141), Bu→allowlistedModelId, fe/Ee→redactors
```

**Verdict: NET_NEW.** `subagent_model_resolve` is **220=7 / 193=0**, `override_dropped`
**220=2 / 193=0**, `inherit_family_mismatch` **220=1 / 193=0**. No changelog bullet in the window
mentions it. It is instrumentation, not behaviour: when `spawnKind` is `undefined` the function is a
straight pass-through (`:318836`), and `tte` is unchanged.

**What the three failure classes mean, and why they are separated:**

| Class | Condition | What it detects |
|---|---|---|
| `override_dropped` | `tte` invoked `onRestricted` | The requested model exists but the **org allowlist** refused it. A policy signal. |
| `family_mismatch` | requested and resolved families both known and different, precedence ≠ `inherit` | Someone explicitly asked for family X and got family Y for a reason *other* than the allowlist — i.e. an alias-table or 1M-rewrite surprise. A **bug** signal. |
| `inherit_family_mismatch` | same, but precedence **is** `inherit` | The parent model's family changed under an agent that asked for nothing. Usually benign (the session switched models), which is why it is not lumped in with the above. |

`requested_model` and `resolved_model` go through `Bu(...)` — an allowlist redactor that emits the
literal `"none"` for anything not on the known-model list, so a custom or gateway model id never
reaches telemetry as free text.

**For a workflow agent, `spawnKind` is always `"spawn"`.** `oG` computes it as
`W ? void 0 : u?.replHydration?.kind === "resume" ? "resume" : "spawn"` (`:344319`); workflow agents
are not teammates (`W` false) and set `override` to `{ agentId, agentContext }` with no
`replHydration` (`:387587`). So every `agent()` call in every workflow emits one
`subagent_model_resolve` datapoint.

### 2.3 The `Explore` family-rank cap

```javascript
// ============================================
// applyExploreInheritCap - Stop the built-in Explore agent from inheriting an above-Opus family
// Location: cli_inner_pretty.js:269267-269276
// ============================================

// ORIGINAL (for source lookup):
function M9e(e, t) {
  if (e.agentType !== FFe.agentType || e.source !== "built-in") return e.model;
  if (Z.CLAUDE_CODE_DISABLE_EXPLORE_INHERIT_CAP) return "inherit";
  return khy(t) ? $Wu : "inherit";
}
function khy(e) {
  if (Hn() !== "firstParty") return !1;
  let t = MWu.slice(0, MWu.indexOf($Wu) + 1);
  return !Fno(e, t);
}
// MWu = ["haiku", "sonnet", "opus"];  $Wu = "opus";   (:269307, :269283)

// READABLE (for understanding):
const FAMILY_RANK = ["haiku", "sonnet", "opus"];       // ascending cost/capability
const EXPLORE_MAX_FAMILY = "opus";

function applyExploreInheritCap(agentDef, parentModel) {
  if (agentDef.agentType !== EXPLORE_AGENT.agentType || agentDef.source !== "built-in")
    return agentDef.model;                              // not the built-in Explore → untouched
  if (env.CLAUDE_CODE_DISABLE_EXPLORE_INHERIT_CAP) return "inherit";   // escape hatch
  return parentFamilyExceedsCap(parentModel) ? EXPLORE_MAX_FAMILY : "inherit";
}

function parentFamilyExceedsCap(parentModel) {
  if (currentProvider() !== "firstParty") return false;          // cap only on the 1P API
  const allowedPrefix = FAMILY_RANK.slice(0, FAMILY_RANK.indexOf(EXPLORE_MAX_FAMILY) + 1);
  return !containsAnyFamily(parentModel, allowedPrefix);         // parent is in NO capped family → exceeds
}

// Mapping: M9e→applyExploreInheritCap, khy→parentFamilyExceedsCap, FFe→EXPLORE_AGENT (:269296),
//          MWu→FAMILY_RANK (:269307), $Wu→EXPLORE_MAX_FAMILY (:269283), Hn→currentProvider (:100302),
//          Fno→containsAnyFamily (:156886)
```

**Verdict: NET_NEW escape hatch.** `CLAUDE_CODE_DISABLE_EXPLORE_INHERIT_CAP` is
**220=2 / 193=0**. The cap itself is carryover in spirit; the env-var bypass is new and undocumented.

**How to read `MWu.slice(0, MWu.indexOf($Wu) + 1)`.** With the current array
`["haiku","sonnet","opus"]` and `$Wu = "opus"`, the slice is the whole array and the expression is a
no-op. It is written this way because it is a **rank prefix**: the array is ordered by
cost/capability, and the slice means *"every family at or below the cap"*. When a family above Opus
is added to `FAMILY_RANK` — and this window did add exactly such a model, `claude-fable-5`
(`:14402`) — the slice automatically excludes it and the cap starts biting without any further edit.
Today the effect is: **a parent model whose id contains none of `haiku`/`sonnet`/`opus`** (Fable-5,
Mythos-5, or any future family) causes the `Explore` agent to be pinned to `"opus"` instead of
inheriting.

**Why only on `firstParty`** (`Hn() !== "firstParty"` → no cap): the string `"opus"` is a first-party
*alias* that `tte` resolves through `Grd`/`vi`. On Bedrock/Vertex/Foundry the family names are
embedded in provider-specific inference-profile ids and the alias would not resolve, so capping would
substitute a model that may not exist on that channel. Better to inherit than to guess.

**Relevance to workflows:** `M9e` is applied on both resolution paths (`:387467`, `:344319`), but its
first line makes it a no-op for anything that is not the built-in `Explore`. The default workflow
subagent is `eMs` with `agentType: "workflow-subagent"` (`:388209`), so the cap is inert for ordinary
`agent()` calls. It fires only for `agent({ agentType: 'Explore' })` — a documented pattern in the
tool prose's own agent-type example (`:388988`).

---

## 3. Effort

```javascript
// ============================================
// normaliseEffort - Coerce opts.effort into a tier name or an integer
// Location: cli_inner_pretty.js:119487-119496; applied at :387459-387460
// ============================================

// ORIGINAL (for source lookup):
function gW(e) {
  if (e === void 0 || e === null || e === "") return;
  if (typeof e === "number" && uBc(e)) return e;
  let t = String(e).toLowerCase(), r = mBc[t] ?? t;
  if (q1e(r)) return r;
  let n = parseInt(t, 10);
  if (!isNaN(n) && uBc(n)) return n;
  return;
}
// EL = ["low", "medium", "high", "xhigh", "max"];   (:119650)
// mBc = { med: "medium" };                          (:119651)
...
Oe = gW(ve?.effort),
Ue = Oe !== void 0 ? { ...ge, effort: Oe } : ge,

// READABLE (for understanding):
const EFFORT_TIERS = ["low", "medium", "high", "xhigh", "max"];
const EFFORT_ALIASES = { med: "medium" };

function normaliseEffort(value) {
  if (value === undefined || value === null || value === "") return undefined;   // → inherit
  if (typeof value === "number" && isValidEffortNumber(value)) return value;     // numeric budget
  const lower = String(value).toLowerCase();
  const named = EFFORT_ALIASES[lower] ?? lower;
  if (EFFORT_TIERS.includes(named)) return named;                                // tier name
  const parsed = parseInt(lower, 10);                                            // "3" → 3
  if (!isNaN(parsed) && isValidEffortNumber(parsed)) return parsed;
  return undefined;                                                              // silently ignored
}
…
const effort = normaliseEffort(opts?.effort);
const agentDef = effort !== undefined ? { ...baseAgentDef, effort } : baseAgentDef;

// Mapping: gW→normaliseEffort, EL→EFFORT_TIERS, mBc→EFFORT_ALIASES, q1e→isEffortTier (:119420),
//          uBc→isValidEffortNumber (:119594), Oe→effort, Ue→agentDef, ge→baseAgentDef
```

Three things worth naming:

- **Effort is spliced onto the agent *definition*, not passed as a request parameter.** `{ ...ge, effort: Oe }`
  produces a synthetic agent definition that flows into `oG` as `agentDefinition`. That is why
  `opts.effort` composes correctly with `opts.agentType`: the custom agent's definition is cloned and
  its `effort` field overwritten, so everything else about the agent (tools, prompt, permission mode)
  survives.
- **`undefined` means inherit, and so does anything unrecognised.** `agent({effort: 'extreme'})` is
  not an error — `normaliseEffort` returns `undefined`, the spread is skipped, and the agent silently
  runs at the session's effort. This matches the tool prose (*"omit to inherit the session effort"*,
  `:388988`) but not a caller's intuition that a typo would be caught. Compare `opts.model`, where an
  unknown id reaches `tte` and produces a warning plus telemetry, and `opts.agentType`, where an
  unknown value **throws** (`:387441-387443`). Three different policies for three adjacent options.
- **Numbers are accepted**, both natively and via `parseInt` of a decimal string. The tool prose
  documents only the five tier names (`:388988`), so numeric effort is an undocumented input path.
  `mBc = { med: "medium" }` is a single-entry alias table — an ergonomic concession to one specific
  abbreviation.

**Verdict: CARRYOVER.** The tier list, the alias table and the splice all exist in 2.1.193; the tool
prose describing `opts.effort` is byte-identical (see [README §3](README.md)).

---

## 4. What the model resolution is *not*

### 4.1 `meta.phases[].model` is inert

`normalisePhases` extracts it (`ggy`, `:275733`, `:275735`):

```javascript
// ORIGINAL:  let { title: n, detail: o, model: i } = r;
//            if (typeof n === "string") t.push({ title: n, detail: typeof o === "string" ? o : void 0,
//                                                model: typeof i === "string" ? i : void 0 });
```

It is carried into the task-registry entry (`phases: a`, `:386480`), written to the snapshot
(`phases: E.phases`, `:388770`), read back on hydration (`phases: e.phases`, `:735182`) — and then
never read. The two phase consumers use `title` and `kind` only:

- `groupAgentsByPhase` (`L9o`, `:650505-650518`) — builds `{ phaseIndex, title, kind, agents }`.
- `buildPhaseGroups` (`pya`, `:651229-651235`) — merges declared phases with observed ones.

A `grep` for `defaultModel` finds 8 sites (`:110504`, `:111372`, `:386463`, `:386485`, `:387014`,
`:388618`, `:388771`, `:735183`) — all of them the *run-level* `defaultModel` (the parent model,
recorded once per run at `:388618`), none of them a phase's.

**Why this matters:** the tool prose instructs the model to populate it — *"Add `model` to a phase
entry when that phase uses a specific model override"* (`:388985`). A reader auditing which model a
phase used would reasonably trust that field; it reflects only what the script's author *claimed*,
never what ran. The authoritative per-agent record is the `model` field on each `workflow_agent`
progress node (§1.1), which is itself the *display* resolution and subject to the §1.3 divergence.

### 4.2 There is no per-phase or per-workflow model default

The only run-level model in the system is `defaultModel: l.options.mainLoopModel` (`:388618`), which
is display metadata for the `/workflows` header. Nothing in the runtime reads it to seed
`opts.model`. A script that wants every agent in a phase on Haiku must pass `{model:'haiku'}` on each
`agent()` call; there is no inherited scope between `phase()` and the agents inside it.

### 4.3 Remote agents resolve differently — and unreachably

The dead remote path (`re`, see [workflow_runtime_core.md §5](workflow_runtime_core.md)) resolves
with a **different argument shape** (`:387947`):

```javascript
// ORIGINAL:  nt = Te.model ? tte(void 0, U.options.mainLoopModel, Te.model, ze.mode) : void 0,
// READABLE:  const model = opts.model
//              ? resolveSubagentModel(undefined, ctx.options.mainLoopModel, opts.model, permCtx.mode)
//              : undefined;      // ← no override means "let the cloud session choose", not "inherit"
```

Note `undefined` for the frontmatter slot and `undefined` as the result when no override is given —
the cloud session picks its own default rather than inheriting the local one. Since the path cannot
execute, this is documented only so that nobody mistakes it for the live behaviour.

---

## 5. End-to-end: what happens to `agent(p, {model: 'haiku'})`

```
script:  agent("find X", { model: "haiku" })
  │
  ├─ V (:387297)  clone opts across the VM boundary → ae = {model:"haiku"}
  ├─ journal key   canonicaliseOpts picks `model` → "haiku" IS part of the cache key
  ├─ progress row  model: ae?.model ?? U.options.mainLoopModel            (:387386)   ← raw override, pre-resolution
  │
  └─ K (:387420)
       ├─ Qe = tte(M9e(eMs, mainLoopModel), mainLoopModel, "haiku", mode)            (:387467)
       │        ├─ CLAUDE_CODE_SUBAGENT_MODEL? → wins outright
       │        ├─ "haiku" === "inherit"? no
       │        ├─ Grd("haiku", parent)? if the parent is already Haiku → return parent verbatim
       │        ├─ jrd(vi("haiku")) → canonical Haiku id, +[1m] if eligible
       │        ├─ Bedrock + parent is 1M → xot(id, "[1m]")
       │        └─ Pl(id)? if not allowlisted → warn + inheritParent() + onRestricted
       │   → Qe used for: progress `model` (:387523), family baseline Pe (:387509), fallback detect (:387624)
       │
       └─ oG({ …, model: "haiku" })                                                   (:387588)
            └─ Wrd(M9e(eMs, WL(ctx)), WL(ctx), "haiku", mode, onRestricted, "spawn")  (:344319)
                 ├─ same tte, but parentModel = WL(ctx)  ← may differ from Qe's input
                 └─ emits subagent_model_resolve { precedence:"tool", requested_family:"haiku", … }
```

Two takeaways for anyone debugging a workflow's model behaviour:

1. **Trust `subagent_model_resolve`, not the progress row.** The row is the display resolution; the
   telemetry event is emitted by the path that actually chose the model, and it names the precedence
   level that won.
2. **`opts.model` is part of the resume cache key** (`canonicaliseOpts` includes `model`,
   `:387049`), so changing a model in a script invalidates that call and everything after it in the
   chain — see [workflow_lifecycle.md §3.3](workflow_lifecycle.md). Changing `opts.label` does not.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_workflow.md](../00_overview/symbol_additions_v2_1_220_workflow.md).

Key functions in this document:
- `resolveSubagentModel` (tte) - `:318799-318832` — the five-level precedence chain
- `resolveSubagentModelAudited` (Wrd) - `:318835-318868` — **NET_NEW** `subagent_model_resolve` audit
- `effectiveMainLoopModel` (WL) - `:237861-237865` — applies `permissionLayers` of kind `model`
- `applyExploreInheritCap` (M9e) - `:269267-269271` and `parentFamilyExceedsCap` (khy) - `:269272-269276`
- `EXPLORE_AGENT` (FFe) - `:269296-269306`, `FAMILY_RANK` (MWu) - `:269307`, `EXPLORE_MAX_FAMILY` ($Wu) - `:269283`
- `DEFAULT_SUBAGENT_MODEL` (JRy) - `:318796-318798` — returns the literal `"inherit"`
- `isFamilyAliasOfParent` (Grd) - `:318879-318893` — the four-entry alias table
- `maybeUpgradeTo1m` (jrd) - `:318874-318878`
- `warnModelNotAllowlisted` (QRy) - `:318869-318873`
- `familyRank` (xur) - `:318785-318792` — the telemetry family bucket, `"other"` for unknown
- `resolveMainLoopModel` (LP) - `:110662-110719` — the `inherit` target, incl. the opusplan/plan-mode upgrade
- `normaliseEffort` (gW) - `:119487-119496`, `EFFORT_TIERS` (EL) - `:119650`, `EFFORT_ALIASES` (mBc) - `:119651`
- `normalisePhases` (ggy) - `:275728-275738` — parses `phases[].model`, which nothing reads
