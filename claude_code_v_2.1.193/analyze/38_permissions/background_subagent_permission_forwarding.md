# Background-subagent permission forwarding (CARRYOVER) + Agent named-spawn upfront deny (REFINEMENT)

> **Type/version:** Two items grouped here. (1) Background-subagent permission forwarding (`rdc`/`pendingWorkerRequest`/`M8n`) is **CARRYOVER** — byte-for-byte present in 183 (the changelog lists it under 2.1.186, but the implementation predates the 183 snapshot). (2) The `Agent(type)` upfront deny + `allowedAgentTypes` allow-list check on the named-subagent spawn path is a **REFINEMENT (changelog 2.1.186)** — the matcher machinery is carryover, only the *enforcement site* is net-new.
> TARGET: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (build `a1938d2a`). `<line>` is **193** unless tagged **(183)**.

---

## TL;DR

This doc exists to be **honest about two thin/negative findings** so the module's claim of net-new surface is not inflated:

- **Worker→leader permission forwarding** (a background subagent's permission prompt surfacing in the main session, with the asking agent's name/color, and Esc denying only that one tool) is **entirely carryover** from 183. I cannot point to a 193-bundle line that changed. `grep` counts match 183 exactly.
- **`Agent(type)` permission enforcement for named spawns** is *mostly* carryover (the `p9e`/`wPe`/`Wil` matcher, the `allowedAgentTypes` allow-list, the deny message) — the one genuine 193 delta is an **upfront** deny+allowlist check inserted into the Task/Agent spawn path so a denied named type fails *immediately* with a precise "denied by permission rule … from <source>" error.

---

## 1. CARRYOVER — worker→leader permission forwarding

**What it is.** When a background subagent (worker) needs a permission decision, it forwards the request to the leader (main) session, which renders the permission prompt — annotated with *which* agent is asking (name + color). The state is held in `pendingWorkerRequest`; Esc/abort denies just that one tool.

**Why it is carryover (the grep evidence).** Every load-bearing symbol matches 183 exactly:

| Item | 193 anchor | 183 status | grep diff |
|------|-----------|------------|-----------|
| Worker→leader forward `rdc` (sets `pendingWorkerRequest`) | `:640151` | present | carryover |
| State field `pendingWorkerRequest` | `:303749`,`:390172`,`:687702`,… | present | `grep -c` **183=7, 193=7** |
| Telemetry `permission_swarm_forward` | `:640198`/`:640200` | present | `grep -c` **183=2, 193=2** |
| Request builder w/ identity `M8n` (`workerName`,`workerColor`) | `:426557` | present | `grep -c workerColor` **183=7, 193=7** |
| Esc/abort → deny just this tool | `:640189` | present | carryover |

The forward path (`rdc`, `forwardWorkerPermissionRequest`) and the request builder (`M8n`, `buildWorkerPermissionRequest`) are shown below as the canonical 193 names, but the *behavior* is identical to 183 — this is a re-mangle, not a delta:

```javascript
// ============================================
// rdc (forwardWorkerPermissionRequest) - forward a worker's permission ask to the leader (CARRYOVER)
// Location: cli_inner_pretty.js:640151-640200 (excerpt)
// ============================================

// ORIGINAL (for source lookup):
async function rdc(e) {
  if (!Ja() || !pht()) return null;
  let { ctx: t, description: n, updatedInput: r, suggestions: o } = e, s = r ?? t.input, i = null;
  if (i) return i;
  try {
    let a = () => t.toolUseContext.setAppState((c) => ({ ...c, pendingWorkerRequest: null })),
      l = await new Promise((c) => {
        let { resolve: u, claim: d } = t8n(c),
          p = M8n({ toolName: t.tool.name, toolUseId: t.toolUseID, input: s, description: n, ... });
        ...
      });
    ...
  } ...
}

// READABLE (for understanding):
async function forwardWorkerPermissionRequest(req) {
  if (!isWorkerSession() || !leaderReachable()) return null;            // Ja / pht
  let { ctx, description, updatedInput, suggestions } = req, input = updatedInput ?? ctx.input;
  // set pendingWorkerRequest on the leader's app state, build the request with the asking worker's identity,
  // await the leader's decision; Esc/abort denies only this tool (cancelAndAbort).
  let clear = () => ctx.toolUseContext.setAppState((s) => ({ ...s, pendingWorkerRequest: null }));
  let decision = await new Promise((resolve) => {
    let { resolve: settle, claim } = registerWorkerRequest(resolve);     // t8n
    let request = buildWorkerPermissionRequest({ toolName: ctx.tool.name, toolUseId: ctx.toolUseID, input, description, ... }); // M8n
    ...
  });
  ...
}

// Mapping: rdc→forwardWorkerPermissionRequest, M8n→buildWorkerPermissionRequest, t→ctx,
//          Ja→isWorkerSession, pht→leaderReachable, t8n→registerWorkerRequest
```

`M8n` (`:426557`) builds the request including `workerName: e.workerName || Sh()` and `workerColor: e.workerColor || KT()` (`:426560-426568`) — i.e. the "which agent is asking" identity. This existed in 183.

**Verdict (adversarial).** The changelog attributes background-agent permission UX to 2.1.186, but the implementation is already in the 183 snapshot (`pendingWorkerRequest`=7, `permission_swarm_forward`=2, `workerColor`=7 in *both* bundles). There is **no 193 line I can cite as changed**. Reported as carryover, not a 193 delta. For the full background-agents subsystem analysis (worker lifecycle, dispatcher, the request/decision protocol), see [36_background_agents](../36_background_agents/README.md).

---

## 2. REFINEMENT — `Agent(type)` upfront deny + `allowedAgentTypes` allow-list on named spawns

**What it does.** When a subagent is spawned by an *explicit named type* `t` (a Task/Agent spawn that is not a fork), 193 inserts an **upfront** check: if an `Agent(type)` **deny** rule matches the requested type, throw a precise "denied by permission rule … from <source>" error immediately; else if an `allowedAgentTypes` allow-list (`Agent(x,y)`) exists and does not include `t`, throw "not found" with the available types.

**The matcher machinery is carryover.** `p9e` (`findDenyRuleForTool`, `:597589`), `wPe` (`filterAgentsByDenyRules`, `:597592`), `Wil` (`resolveForkAgentAvailability`, `:430268`), and the `allowedAgentTypes` narrowing (`grep -c allowedAgentTypes` = **19 in both** 183 and 193) all pre-existed. The 193 delta is purely *where* they run.

**How it works — the inserted block.**

```javascript
// ============================================
// Agent named-spawn upfront deny+allowlist check (REFINEMENT)
// Location: cli_inner_pretty.js:430515-430532
// ============================================

// ORIGINAL (for source lookup):
let O = k && R;                                   // O = fork available (carryover; 183 had `let L = x && I`)
if (t !== void 0 && !k) {                          // ← NET-NEW BLOCK: explicit named type requested (not a fork)
  let Se = p9e(y, is, t);                           // Agent(type) DENY rule for the requested type?
  if (Se)
    throw (Re("subagent_launch", "subagent_type_denied"),
      new E9e(`Agent type '${t}' has been denied by permission rule '${is}(${t})' from ${Se.source}.`));
  if (I && !I.includes(t)) {                        // allowedAgentTypes (Agent(x,y)) restriction
    Re("subagent_launch", "subagent_type_not_found");
    let ye = wPe(x.filter((fe) => I.includes(fe.agentType)), y, is).map((fe) => fe.agentType);
    throw new E9e(`Agent type '${t}' not found. Available agents: ${ye.join(", ")}`);
  }
}

// READABLE (for understanding):
let forkAvailable = isForkRequested && forkResolvedAvailable;            // O
if (requestedType !== undefined && !isForkRequested) {                   // a real named type, not a fork
  let denyRule = findDenyRuleForTool(permCtx, AGENT_TOOL, requestedType); // p9e
  if (denyRule) {
    emit("subagent_launch", "subagent_type_denied");
    throw new SubagentSpawnError(`Agent type '${requestedType}' has been denied by permission rule '${AGENT_TOOL}(${requestedType})' from ${denyRule.source}.`);
  }
  if (allowedAgentTypes && !allowedAgentTypes.includes(requestedType)) { // Agent(x,y) allow-list
    emit("subagent_launch", "subagent_type_not_found");
    let available = filterAgentsByDenyRules(agents.filter((a) => allowedAgentTypes.includes(a.agentType)), permCtx, AGENT_TOOL).map((a) => a.agentType);
    throw new SubagentSpawnError(`Agent type '${requestedType}' not found. Available agents: ${available.join(", ")}`);
  }
}

// Mapping: p9e→findDenyRuleForTool, wPe→filterAgentsByDenyRules, is→AGENT_TOOL ("Agent"),
//          t→requestedType, I→allowedAgentTypes, k→isForkRequested, E9e→SubagentSpawnError, Re→emit
```

**The 183 before-picture.** The 183 spawn body (**(183)** `:423565-423575`) goes straight from the *fork*-deny check to `let L = x && I;` (fork available) and then to the teammate-spawn path — there is **no** upfront block for the requested named type:

```javascript
// (183) cli_inner_pretty.js:423565-423575 — fork-deny, then straight to L = x && I (no named-type check)
let { activeAgents: T, allowedAgentTypes: C } = c.options.agentDefinitions,
  x = t !== void 0 && Yut(t) === _7,
  { available: I, denyRule: k } = gqa(T, C, { toolPermissionContext: g });
if (x && k)                                          // this is the FORK type _7, not the requested type t
  throw (Me("subagent_launch", "subagent_type_denied"),
    new r3t(`Agent type '${_7}' has been denied by permission rule '${vs}(${_7})' from ${k.source}.`));
let L = x && I;                                       // 183: jumps straight here — no upfront named-type deny
```

In 183 a denied *named* type was only caught later (via the ambiguous-resolution branch at **(183)** `:423640`, the 2nd "denied" message) or fell through to a generic "not found." 193 makes the deny explicit and immediate for any named type.

**Evidence.** `grep -c "has been denied by permission rule"` is **183=2, 193=3** (the +1 is the new upfront throw); `grep -c subagent_type_denied` is **183=2, 193=3** (the +1 is the new telemetry emit). Both confirm exactly one new enforcement site.

**Why hoist the check upfront.** In 183, the deny for a named type was *implicit* — discovered during name resolution, producing a generic or ambiguous error. Running the `Agent(type)` deny rule and `allowedAgentTypes` allow-list **before** resolution means (a) a denied type fails fast with a message that names the rule and its source (actionable for the user), and (b) the allow-list narrowing produces "Available agents: …" so the user sees what they *can* spawn. The behavioral delta is *where* the carryover matcher runs, not new matching logic.

---

## Evidence note (overall)

| Item | Verdict | Key grep |
|------|---------|----------|
| `rdc`/`pendingWorkerRequest`/`M8n` worker forwarding | **CARRYOVER** | `pendingWorkerRequest` 183=7/193=7; `permission_swarm_forward` 183=2/193=2; `workerColor` 183=7/193=7 |
| `p9e`/`wPe`/`Wil` Agent-type matcher + `allowedAgentTypes` | **CARRYOVER** | `allowedAgentTypes` 19 in both |
| Upfront named-spawn deny+allowlist block | **REFINEMENT (net-new site)** | `has been denied by permission rule` 183=2/193=3; `subagent_type_denied` 183=2/193=3 |

---

## Cross-links

- The background-agents subsystem (worker lifecycle, dispatcher, the permission request/decision protocol the carryover `rdc`/`M8n` ride on): [36_background_agents/README.md](../36_background_agents/README.md) and its nested-subagent depth doc [36_background_agents/nested_subagent_depth_limit.md](../36_background_agents/nested_subagent_depth_limit.md) (the depth gate that bounds these spawns).
- The agent-team / named-spawn routing rewrite is in [30_agent_team](../30_agent_team/) — the `Agent(x,y)` allow-list and named routing are documented there; this doc only covers the *permission-deny* enforcement on that path.
- Sibling 193 doc: [README.md](./README.md).

---

## Related Symbols

> Symbol mappings live in the symbol index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Subagent/Agent spawn (home for `p9e`/`wPe`/`Wil`/the spawn block)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Background Agents (home for `rdc`/`M8n`/`pendingWorkerRequest`)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Permissions
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)
> - per-feature additions: [symbol_additions_v2_1_193_permissions.md](../00_overview/symbol_additions_v2_1_193_permissions.md)

Key functions in this document:

- `forwardWorkerPermissionRequest` (obf: `rdc`, `:640151`) — CARRYOVER; sets `pendingWorkerRequest`, awaits leader decision.
- `buildWorkerPermissionRequest` (obf: `M8n`, `:426557`) — CARRYOVER; includes `workerName`/`workerColor` identity.
- `pendingWorkerRequest` (state field, `:303749`+) — CARRYOVER; `{toolName, toolUseId, description}`.
- `findDenyRuleForTool` (obf: `p9e`, `:597589`) — CARRYOVER matcher; reused at the new upfront site.
- `filterAgentsByDenyRules` (obf: `wPe`, `:597592`) — CARRYOVER; builds "Available agents" list.
- `resolveForkAgentAvailability` (obf: `Wil`, `:430268`) — CARRYOVER fork-availability helper (183 `gqa`).
- Agent named-spawn upfront block (`:430515`) — REFINEMENT; new `Agent(type)` deny + `allowedAgentTypes` enforcement site.
- `AGENT_TOOL` name (obf: `is`, `:150806`) — `"Agent"`.
