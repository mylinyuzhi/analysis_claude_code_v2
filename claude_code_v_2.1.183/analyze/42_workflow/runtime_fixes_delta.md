# Workflow Runtime Fixes — DELTA v2.1.156 → v2.1.183

> Module: `42_workflow` (DELTA tree) — the **runtime / spawn-path correctness fixes** in Dynamic Workflows between Claude Code **v2.1.156** and **v2.1.183**.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). Every `cli_inner_pretty.js:<line>` citation is a **v2.1.183** line unless explicitly labelled *(v2.1.156 before-picture)* or *(v2.1.88 …)*.
> BEFORE-PICTURE bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines).
> BASELINE (the authoritative description of everything unchanged — link, do not re-derive): [`../../../claude_code_v_2.1.156/analyze/42_workflow/`](../../../claude_code_v_2.1.156/analyze/42_workflow/README.md).
> Obfuscated names were **re-derived** for v2.1.183 — the bundler re-mangles every build, so a v2.1.156 obf name is never reused. The per-feature additions file is the canonical map.

---

## Scope of this doc

This is the deep-dive companion to the [delta README](./README.md). It covers the three **runtime / subagent-spawn-path** fixes, all of which live in the same per-agent spawn closure (`Tt`, cli_inner_pretty.js:417149) or the `/workflows` slash command, and all of which are *zero-behavior-change to the VM/DSL/caps* — they fix how a spawned subagent is **attributed**, how its **worktree isolation** is enforced, and how the **viewer** opens:

| # | Delta | Kind | v2.1.183 anchor | Confidence |
|---|-------|------|-----------------|:----------:|
| R1 | Per-agent **attribution context** on subagent spawn — the spawn now (a) builds an `agentContext` object `Dt`, (b) wraps the subagent query in the agent-context `AsyncLocalStorage` via `Rq(Dt, …)`, and (c) adds `agentContext: Dt` to `override` | fix (2.1.174) | `Dt` cli_inner_pretty.js:417152; `Rq(Dt,…)` cli_inner_pretty.js:417238; spawn override cli_inner_pretty.js:417250 | **high** |
| R2 | The **2.1.161 bg-worktree edit fix** — the workflow query now threads `worktreePath: Ce` (cli_inner_pretty.js:417253) so the spawned subagent's `agentWorktree` is populated and the **agent-level** write-isolation guard fires instead of the **session-level** one | fix (2.1.161) | query field `worktreePath: Ce` cli_inner_pretty.js:417253; guard `Xct` cli_inner_pretty.js:389676 | **high** (exact diff site isolated; see [§R2 — confidence note](#r2-confidence-update-the-exact-diff-site-is-isolated)) |
| R3 | `/workflows` opens **immediately** (`immediate:!0`) + reworded description | fix (2.1.169) | `jmf` cli_inner_pretty.js:562632 | **high** |

The rest of the runtime — **caps**, the **journal/resume** protocol, the **VM/DSL** semantics, the **runtime determinism sandbox**, and the **subagent prompts** — is byte-/logic-identical to v2.1.156 and is confirmed unchanged in [§ Carryover](#carryover--the-runtime-spine-is-unchanged), with links to the baseline.

> **Important separation of concerns.** R1 and R2 are *two different single-field additions to the very same `wj` query call* (cli_inner_pretty.js:417239-417254). The whole 156→183 change to that call is exactly two fields: `override` grew `agentContext: Dt`, and a new `worktreePath: Ce` field was added. Everything else in the query options list is identical (verified field-by-field below). The matching VM-internal **retry wrapper** (`wpe`, cli_inner_pretty.js:46250) and the **caps** are untouched.

---

## R1 — Per-agent attribution context on subagent spawn (2.1.174)

**What it does:** When a workflow spawns a subagent, v2.1.183 supplies that subagent's run with a full **agent-context object** — its own id, its parent agent, its depth in the agent tree, the parent session, its subagent name, and whether it is a built-in agent type — so that everything running *inside* the subagent's turn (transcript metadata, telemetry tagging, attribution headers) can correctly identify *which* subagent produced *which* output, at what depth, under which parent. v2.1.156 passed only the bare `agentId`, leaving workflow subagents invisible to the attribution machinery that every *non-workflow* subagent already participated in.

### What changed at the spawn site — three coordinated edits in `Tt`

The per-agent spawn closure is `Tt(Ue, Xe, Ct, Ht)` (cli_inner_pretty.js:417149; v2.1.156 ancestor `tH` at cli_inner_pretty.js:375171). Three things changed inside it.

```javascript
// ============================================
// agentContext (Dt) build + AsyncLocalStorage run + override.agentContext - the 2.1.174 attribution fix
// Location: cli_inner_pretty.js:417149-417160 (build), :417238 (Rq run wrapper), :417250 (override)
// ============================================

// ORIGINAL (for source lookup):
async function Tt(Ue, Xe, Ct, Ht) {
  let dt = dM();
  oe(dt);
  let Dt = {
      agentId: dt,
      parentAgentId: jz(ue) ? void 0 : ue?.agentId,
      depth: Gz(ue) + 1,
      parentSessionId: a4(),
      agentType: "subagent",
      subagentName: pe.agentType,
      isBuiltIn: ay(pe),
    },
    // ... ~80 lines of progress/abort/stall wiring (unchanged) ...
  try {
    await Rq(Dt, async () => {                               // <-- NEW: run query inside the agent-context ALS
      for await (let $n of wj({
        agentDefinition: pe,
        promptMessages: [Rn({ content: Ue })],
        toolUseContext: mt,
        canUseTool: t,
        isAsync: !1,
        querySource: Lxe(pe.agentType, ay(pe)),
        spawnedBySkill: k.options.spawnedBySkill ?? k.options.activeSkill,
        availableTools: he,
        transcriptSubdir: r ? `workflows/${r}` : void 0,     // unchanged
        spawnedByWorkflowRunId: r,                           // unchanged
        override: { agentId: dt, agentContext: Dt },         // <-- NEW: agentContext field
        model: re?.model,
        onQueryProgress: We,
        worktreePath: Ce,                                    // <-- NEW (R2, see below)
      })) { /* ... stream handling, unchanged ... */ }
    });
  } /* catch ... */
}

// READABLE (for understanding):
async function spawnWorkflowAgent(prompt, label, attempt, lastAttemptReason) {
  const newAgentId = mintAgentId();                          // dM()
  reportAgentId(newAgentId);                                 // oe(dt) — records id for journal/snapshot
  const agentContext = {
    agentId: newAgentId,
    // parent is undefined when the workflow context IS the root (main loop), else the parent agent's id:
    parentAgentId: isRootContext(parentCtx) ? undefined : parentCtx?.agentId,   // jz()=agentType==="main"
    depth: contextDepth(parentCtx) + 1,                       // Gz(): 0 for main, else ctx.depth
    parentSessionId: currentSessionId(),                      // a4()
    agentType: "subagent",
    subagentName: chosenAgentDef.agentType,                   // pe = nLp/ddo/custom def
    isBuiltIn: isBuiltInAgentDef(chosenAgentDef),             // ay()
  };
  // ... progress/abort/stall wiring (unchanged from v2.1.156) ...
  try {
    // NEW: run the entire subagent query inside the agent-context AsyncLocalStorage,
    // so every getStore()-reading consumer (attribution builder, PostToolUse tagger)
    // sees THIS subagent's identity for the duration of its turn.
    await runInAgentContext(agentContext, async () => {       // Rq = pwt.run
      for await (const event of subagentQuery({
        agentDefinition: chosenAgentDef,
        promptMessages: [makeMessage({ content: prompt })],
        /* ...unchanged options... */
        override: { agentId: newAgentId, agentContext },       // NEW agentContext field
        worktreePath: agentWorktreePath,                       // NEW (R2)
      })) { /* ...stream handling... */ }
    });
  } /* catch */
}

// Mapping: Tt->spawnWorkflowAgent, Dt->agentContext, dt->newAgentId, dM->mintAgentId, oe->reportAgentId,
//          ue->parentCtx, pe->chosenAgentDef, jz->isRootContext, Gz->contextDepth, a4->currentSessionId,
//          ay->isBuiltInAgentDef, Rq->runInAgentContext, wj->subagentQuery, Ce->agentWorktreePath
// v2.1.156 before-picture @375171-375260: tH() built NO context object; the query was a bare
//   `for await (let L$ of WS({ ... override:{ agentId: eH } ... }))` with NO Rq/Lg wrapper.
```

### How it works (step by step)

1. **Mint the id, then build the context.** `dt = dM()` (cli_inner_pretty.js:417150) mints a fresh agent id; `oe(dt)` (cli_inner_pretty.js:417151) reports it to the journal/snapshot tracker (unchanged from v2.1.156 `eH = HS(); DH(eH)`). The genuinely new code is the `Dt` object literal at cli_inner_pretty.js:417152-417160.

2. **`parentAgentId` with an is-root guard.** `jz(ue) ? void 0 : ue?.agentId` (cli_inner_pretty.js:417154). `jz(e)` is `e.agentType === "main"` (cli_inner_pretty.js:103149). So when the workflow's surrounding context is the **root** (the main loop, whose `agentType` is `"main"` — see `Am() = { agentType: "main", agentId: xt() }` at cli_inner_pretty.js:103146), the subagent has **no meaningful parent agent** (its parent is the main loop, not another agent), and `parentAgentId` is `undefined`. For a **nested** workflow (a `workflow()` call inside a workflow, one level deep) the surrounding context is itself an agent, so `parentAgentId` is that agent's id.

3. **`depth: Gz(ue) + 1`.** `Gz(e)` (cli_inner_pretty.js:103152) returns `0` for the main context and `e.depth ?? 0` otherwise. So a top-level workflow agent is `depth 1`; a nested-workflow agent is `depth 2`. This is the value a tree-rendering UI uses to indent/group.

4. **`parentSessionId: a4()`** (cli_inner_pretty.js:103436) — the current session id, so a backgrounded workflow agent can be tied back to the session that launched it.

5. **`subagentName: pe.agentType` and `isBuiltIn: ay(pe)`.** `pe` is the chosen subagent definition (plain `ddo`, StructuredOutput `nLp`, or a custom `agentType`-resolved def — see [the runtime carryover](#carryover--the-runtime-spine-is-unchanged)). `ay(e)` (cli_inner_pretty.js:472399) is the built-in predicate. These two feed `M2s` (below), which decides whether to surface the real subagent name or mask it as `"user-defined"`.

6. **The `Rq(Dt, async () => { … })` wrapper (the load-bearing change).** This is the mechanism, not just a payload. `Rq` (cli_inner_pretty.js:103143) is `pwt.run(e, t)`, and `pwt` is `new (require("async_hooks").AsyncLocalStorage)()` (cli_inner_pretty.js:103170). Wrapping the entire `for await … of wj({…})` loop in `Rq(Dt, …)` means: **for the whole duration of the subagent's streaming turn, `pwt.getStore()` returns `Dt`.** Every consumer that reads the agent-context store therefore sees *this* subagent's identity.

7. **`override: { agentId: dt, agentContext: Dt }`** (cli_inner_pretty.js:417250). The `agentContext` is *also* threaded explicitly into the query options (so the inner query machinery can re-seed the context for any nested re-entry — see `agentContext: t?.agentContext ?? e.agentContext` at cli_inner_pretty.js:460219, where the inner context-builder picks it up). This is belt-and-suspenders with the ALS wrapper.

### The consumers — what reads the store (resolving the README's open item)

The README carried an honest caveat that the *render site* consuming `agentContext`/`subagentName` was "not fully traced." Reading the two `pwt.getStore()` call sites resolves it: the consumers are **pre-existing and unchanged** — the fix is purely that workflow subagents now *populate* the store the consumers already read.

```javascript
// ============================================
// vXu - the per-agent attribution builder that reads the agent-context store (UNCHANGED logic)
// Location: cli_inner_pretty.js:145447-145468
// ============================================

// ORIGINAL (for source lookup):
function vXu() {
  let e = pwt.getStore();
  if (e) {
    let a = { agentId: e.agentId, parentSessionId: e.parentSessionId, agentType: e.agentType };
    if (e.parentAgentId) a.parentAgentId = e.parentAgentId;
    if (e.agentType === "teammate") a.teamName = e.teamName;
    return a;
  }
  // ... fallback path when no store (standalone/teammate detection) ...
}

// READABLE (for understanding):
function getAgentAttribution() {
  const ctx = agentContextStore.getStore();        // pwt.getStore()
  if (ctx) {
    // When a workflow subagent is running (now wrapped in Rq(Dt,…)), this branch fires
    // and returns the subagent's identity for headers/telemetry — which it could NOT in v2.1.156.
    const attribution = { agentId: ctx.agentId, parentSessionId: ctx.parentSessionId, agentType: ctx.agentType };
    if (ctx.parentAgentId) attribution.parentAgentId = ctx.parentAgentId;
    if (ctx.agentType === "teammate") attribution.teamName = ctx.teamName;
    return attribution;
  }
  // ... fallback path (unchanged) ...
}

// Mapping: vXu->getAgentAttribution, pwt->agentContextStore
// v2.1.156 before-picture @139990 (X75): byte-for-byte the same builder, reading $D()=t3K.getStore().
```

```javascript
// ============================================
// M2s + hFp.getStore - PostToolUse telemetry tagging uses subagentName from the store (UNCHANGED logic)
// Location: M2s cli_inner_pretty.js:103159; hFp read @449494-449496
// ============================================

// ORIGINAL (for source lookup):
function M2s(e) {
  if (!$Cr(e) || !e.subagentName) return;
  return e.isBuiltIn ? e.subagentName : "user-defined";
}
// ... inside the PostToolUse hook hFp:
let o = pwt.getStore(),
  s = o ? M2s(o) : void 0,
  i = s ? { subagent_name: s } : {};
// ... G("tengu_memdir_accessed", { tool: e.tool_name, ...i }) etc.

// READABLE (for understanding):
function resolveSubagentNameForTelemetry(ctx) {
  if (!isSubagentContext(ctx) || !ctx.subagentName) return undefined;   // $Cr = agentType==="subagent"
  // built-in subagent name is surfaced verbatim; a user-defined agent is masked as "user-defined".
  return ctx.isBuiltIn ? ctx.subagentName : "user-defined";
}
// ... PostToolUse memory/transcript telemetry now carries subagent_name for workflow subagents
//     because the store is populated by Rq(Dt,…); in v2.1.156 it was absent for workflow agents.

// Mapping: M2s->resolveSubagentNameForTelemetry, $Cr->isSubagentContext, hFp->postToolUseMemoryHook
// v2.1.156 before-picture @98983 (e3K): byte-for-byte the same name-resolver reading $D().
```

So the chain is: **`Rq(Dt, …)` populates the store → `vXu` returns the subagent's `{agentId, parentAgentId, depth-via-context, agentType}` for attribution headers/telemetry → `M2s` returns `subagentName` (or `"user-defined"`) for PostToolUse memory/transcript tagging.** All three consumers existed verbatim in v2.1.156 (`X75` at cli_inner_pretty.js:139990, `e3K` at cli_inner_pretty.js:98983, the same `getStore`-and-build pattern); the only thing missing was the producer on the workflow path.

### The before-picture, precisely

In v2.1.156 the agent-context `AsyncLocalStorage` was `t3K` (cli_inner_pretty.js:98995), its reader was `$D() = t3K.getStore()` (cli_inner_pretty.js:98975), and its **run wrapper** was `Lg(H, $) = t3K.run(H, $)` (cli_inner_pretty.js:98977) — the exact ancestor of v2.1.183 `Rq = pwt.run`. Crucially, **`Lg` was already used at every *non-workflow* spawn site** — e.g. the regular subagent spawn at cli_inner_pretty.js:379834 *(v2.1.156 before-picture)*:

```javascript
// v2.1.156 before-picture @379834 — a REGULAR (non-workflow) subagent spawn already wrapped its query:
return Lg(Z, async () => {            // <-- agent-context ALS run wrapper present
  ua(q, (fH) => ({ ...fH, status: "running", isIdle: !1 }), L);
  for await (let fH of WS({ agentDefinition: HH, ... })) { ... }
});
```

but the **workflow** spawn at cli_inner_pretty.js:375246 *(v2.1.156 before-picture)* was a **bare `for await`** with **no `Lg` wrapper** and `override: { agentId: eH }` only (cli_inner_pretty.js:375257). The set of `Lg(` call sites in v2.1.156 (379834, 398679, 398729, 398812, 406912, 407132, 454249) **excludes** the workflow spawn; the corresponding `Rq(` set in v2.1.183 (417238, 421147, 423942, 423999, 433833, 434215, 473621) **adds** it (417238). That single addition — plus the `Dt` build and the `agentContext` override field — *is* the 2.1.174 fix.

### Why this approach

- **Why `AsyncLocalStorage` instead of threading the context through every call?** The attribution data (`agentId`/`parent`/`depth`/`subagentName`) needs to be visible to code arbitrarily deep inside the subagent's turn — telemetry emitters in tool handlers, the transcript writer, the PostToolUse memory hook — none of which take an "agent context" parameter. Passing it explicitly down every call path would be invasive and fragile. ALS is the idiomatic Node mechanism for *ambient request-scoped context*: set it once at the turn boundary (`Rq(Dt, …)`), and any descendant reads it via `getStore()` with zero plumbing. This is exactly why the *non-workflow* spawns already used `Lg`/`Rq` — the workflow path was simply never wired in, and the fix brings it into the same well-trodden mechanism.

- **Why was the workflow path the exception in the first place?** The workflow runtime is a relatively young subsystem (GA'd 2.1.154 — see the [baseline README](../../../claude_code_v_2.1.156/analyze/42_workflow/README.md)) and it hand-rolls its own per-agent spawn loop (`Tt`) with bespoke stall/retry/progress wiring, rather than going through the common subagent-spawn helper that already wrapped in `Lg`. It got the `override.agentId` right but missed the ALS wrapper that the common path had. The fix is a targeted graft of the existing mechanism onto the bespoke loop.

- **Why also put `agentContext` in `override` if the ALS already carries it?** The ALS scopes the *current* async chain, but the inner query (`wj`) may construct fresh nested contexts (e.g. for a nested query re-entry), and those re-builders read `t?.agentContext ?? e.agentContext` (cli_inner_pretty.js:460219) to re-seed. Carrying it explicitly in `override` guarantees the identity survives a context rebuild that the ALS alone wouldn't propagate.

- **Trade-off accepted:** ALS has a small per-async-hop cost, and the `Dt` build allocates an object per spawn. Both are negligible against the cost of launching a full subagent turn (model calls, tool execution). The correctness win — every workflow subagent's transcript/telemetry is now correctly attributed instead of falling into the anonymous fallback branch of `vXu` — is decisive.

### Key insight

The 2.1.174 fix is **not** new attribution logic — `vXu`/`M2s`/the agent-context ALS all existed and were unchanged. The fix is *enrolling the workflow subagent spawn into the attribution mechanism the rest of the agent system already used*: build the `Dt` context, wrap the query in `Rq(Dt, …)` so `getStore()` resolves to it, and add `agentContext` to `override`. The README's open item ("exact render site unconfirmed") is now closed: the render/tag sites are `vXu` (cli_inner_pretty.js:145447, headers/telemetry attribution) and `M2s` via the PostToolUse hook `hFp` (cli_inner_pretty.js:449494, memory/transcript `subagent_name` tagging) — both pre-existing, both previously starved of a populated store on the workflow path.

---

## R2 — The 2.1.161 background-session worktree edit fix

**What it does:** A workflow `agent({ isolation: "worktree" })` running inside a **background session** was blocked from editing files in *its own* worktree — the write-isolation guard redirected it to the *session's* worktree (or the shared checkout) instead. The fix threads the agent's `worktreePath` into the subagent query so the spawned agent's tool-use context carries `agentWorktree`, which makes the **agent-level** isolation branch of the write guard fire (using the *agent's* worktree) instead of falling through to the **session-level** branch (which uses the *session's* worktree).

### R2 confidence update: the exact diff site IS isolated

> The dossier and the [delta README](./README.md#open-questions--lowmedium-confidence-carried-from-the-dossier) carried this as **medium confidence** with the caveat "the exact one-line permission-routing diff was not isolated." A field-by-field comparison of the workflow query call between the two bundles **isolates it precisely**: the v2.1.156 workflow query (cli_inner_pretty.js:375246-375259 *before-picture*) and the v2.1.183 workflow query (cli_inner_pretty.js:417239-417253) have **identical option lists except for two added fields** — `override.agentContext` (R1) and **`worktreePath: Ce`** (R2, cli_inner_pretty.js:417253). The write-isolation *guard* itself (`Xct`, below) was **unchanged**; the bug was that the guard's agent-level branch could never fire for workflow subagents because their `agentWorktree` was never populated. Adding `worktreePath: Ce` to the query is the fix. I therefore upgrade this item to **high confidence on the diff site.** (One residual caveat remains: I have not reproduced the *background-session blocking* end-to-end, so the precise interaction of `CLAUDE_CODE_SESSION_KIND === "bg"` with the now-populated `agentWorktree` is reasoned from the guard code, not from a live repro.)

### The data path: `Ce` → query → `agentWorktree` → write guard

**Step 1 — compute the worktree path (unchanged).** Inside `Tt`'s parent scope, `Ce = Ie?.worktreePath` (cli_inner_pretty.js:417137), where `Ie` is the worktree handle created when `re?.isolation === "worktree"` (cli_inner_pretty.js:417133-417135). This is identical to v2.1.156 `OH = vH?.worktreePath` (cli_inner_pretty.js:375159 *before-picture*).

**Step 2 — the query now carries it (NEW).** v2.1.183 passes `worktreePath: Ce` as the final option of the `wj({…})` call (cli_inner_pretty.js:417253). v2.1.156's `WS({…})` call had **no** `worktreePath` field — its last option was `onQueryProgress: p$` (cli_inner_pretty.js:375259 *before-picture*). Verified field-by-field:

```text
v2.1.183 wj() options (417239-417253)        v2.1.156 WS() options (375247-375259)
  agentDefinition                              agentDefinition
  promptMessages                               promptMessages
  toolUseContext                               toolUseContext
  canUseTool                                   canUseTool
  isAsync                                      isAsync
  querySource                                  querySource
  spawnedBySkill                               spawnedBySkill
  availableTools                               availableTools
  transcriptSubdir                             transcriptSubdir
  spawnedByWorkflowRunId                       spawnedByWorkflowRunId
  override (+agentContext)  <-- R1             override (agentId only)
  model                                        model
  onQueryProgress                              onQueryProgress
  worktreePath              <-- R2 (NEW)       (absent)
```

**Step 3 — the query records `agentWorktree` into the agent's context (existing plumbing, now reachable).** The `wj` query destructures `worktreePath: _` from its options (cli_inner_pretty.js:387088) and (a) writes it into the agent's metadata `…(_ && { worktreePath: _ })` (cli_inner_pretty.js:387312) and (b) sets `jt.agentWorktree = _` on the tool-use context when `_` is truthy (cli_inner_pretty.js:387267). That `agentWorktree` then propagates into the permission/tool context (`agentWorktree: e.agentWorktree`, cli_inner_pretty.js:460220).

**Step 4 — the write-isolation guard consumes `agentWorktree` (UNCHANGED).** The guard is `Xct(e, t)` (cli_inner_pretty.js:389676): given a target path `e` and the tool context `t`, it returns a redirect message when the write would land outside the correct worktree.

```javascript
// ============================================
// Xct - write-isolation guard: agent-level branch (existing) now reachable for workflow subagents
// Location: cli_inner_pretty.js:389676-389694
// ============================================

// ORIGINAL (for source lookup):
function Xct(e, t) {
  {
    if (t.agentWorktree) {                                   // <-- AGENT-level branch, checked FIRST
      let o = Ar();
      return e.startsWith(o + Yct.sep) && !e.startsWith(t.agentWorktree + Yct.sep)
        ? `This agent is isolated in the worktree ${t.agentWorktree}. Edit the worktree copy of this file instead of the shared-checkout path.`
        : null;
    }
    if (process.env.CLAUDE_CODE_SESSION_KIND !== "bg") return null;   // <-- SESSION-level branch
    let n = aA();
    if (n)
      return e.startsWith(n.originalCwd + Yct.sep) && !e.startsWith(n.worktreePath + Yct.sep)
        ? `This session is now isolated in ${n.worktreePath}. Edit the worktree copy of this file instead of the shared-checkout path.`
        : null;
    // ... non-bg fallthrough (unchanged) ...
  }
}

// READABLE (for understanding):
function checkWorktreeWriteIsolation(targetPath, toolCtx) {
  // (A) AGENT-level: if THIS agent has its own worktree, enforce against the AGENT's worktree.
  if (toolCtx.agentWorktree) {
    const repoRoot = repoRootDir();                          // Ar()
    return targetPath.startsWith(repoRoot + sep) && !targetPath.startsWith(toolCtx.agentWorktree + sep)
      ? `This agent is isolated in the worktree ${toolCtx.agentWorktree}. Edit the worktree copy ...`
      : null;                                                // path is already inside the agent worktree -> allow
  }
  // (B) SESSION-level: only reached when the agent has NO agentWorktree.
  if (process.env.CLAUDE_CODE_SESSION_KIND !== "bg") return null;
  const sessionIso = currentSessionIsolation();              // aA()
  if (sessionIso)
    return targetPath.startsWith(sessionIso.originalCwd + sep) && !targetPath.startsWith(sessionIso.worktreePath + sep)
      ? `This session is now isolated in ${sessionIso.worktreePath}. Edit the worktree copy ...`
      : null;
  // ... unchanged ...
}

// Mapping: Xct->checkWorktreeWriteIsolation, Ar->repoRootDir, Yct.sep->sep, aA->currentSessionIsolation
// v2.1.156 before-picture @346662: the IDENTICAL agent-level branch existed (`if ($.agentWorktree) { ... }`).
//   The guard did not change; what changed is that workflow subagents now SET agentWorktree.
```

### Why the bug existed, and why threading `worktreePath` fixes it

**What it does (the bug):** Read the guard's control flow. Branch **(A)** `if (t.agentWorktree)` is checked **first** and, when present, *fully decides* the answer (it `return`s in both arms). Only if `agentWorktree` is **absent** does control fall through to branch **(B)**, the session-level check keyed on `CLAUDE_CODE_SESSION_KIND === "bg"` and the *session's* `worktreePath`.

In v2.1.156, a workflow `agent({isolation:"worktree"})` *did* run in its own git worktree (created at cli_inner_pretty.js:375155-375157 *before-picture*), but because the workflow query never passed `worktreePath`, the spawned subagent's tool context had **no `agentWorktree`**. So when that agent tried to edit a file inside its *own* worktree while the surrounding session was a background session, branch (A) was skipped (no `agentWorktree`), and branch (B) fired — comparing the edit path against the **session's** worktree. The agent's worktree ≠ the session's worktree, so the edit looked like it was outside "the" isolated worktree and got redirected/blocked. Net effect: a backgrounded workflow agent could not edit its own worktree copy.

The fix threads `worktreePath: Ce` into the query, which populates `agentWorktree` on the subagent's context, so branch (A) — the agent-level check against the *agent's* worktree — is now the one that fires. The agent's edits inside its own worktree return `null` (allowed); edits outside it are correctly redirected to the agent's worktree. The session-level branch (B) is bypassed entirely for worktree-isolated agents.

**Why this approach:** The guard already had the *correct* logic (the agent-level branch existed verbatim in v2.1.156 — cli_inner_pretty.js:346662 *before-picture*). The problem was purely a **missing input**: the agent ran in a worktree but its context didn't *know* it. The minimal, correct fix is to supply that input at the one place the workflow path diverged from every other spawn path — the query call — rather than to special-case the guard for background sessions. This keeps a single, uniform write-isolation policy: *an agent with a worktree is always judged against its own worktree, independent of whether the surrounding session is foreground or background.* Special-casing the guard would have duplicated worktree-resolution logic and left the agent-context blind spot in place for any other consumer of `agentWorktree`.

**Trade-off / scope:** This is a one-field query addition with no new code paths. It does change behavior for *every* worktree-isolated workflow agent (foreground too) — but identically, because branch (A) is also the desired behavior in the foreground (judge against the agent's own worktree). There is no regression surface: before the fix, foreground worktree agents that weren't in a bg session hit the non-bg fallthrough (which uses the repo root / per-agent root); now they hit the explicit agent-level branch keyed on the same `agentWorktree`, which is strictly more correct.

### Key insight

R2 and R1 are *the same two-field edit to one query call*. The worktree write-isolation **guard** (`Xct`) and its agent-level branch were **already correct and unchanged since v2.1.156** — the bug was that workflow subagents never populated `agentWorktree`, so the guard's correct branch could not fire and the **session-level** branch wrongly took over inside background sessions. Adding `worktreePath: Ce` to the workflow query (cli_inner_pretty.js:417253) is the entire fix; the matching VM-side **retry cwd wrapper** `wpe(e,t) = e7c(e ?? Pt(), t)` (cli_inner_pretty.js:46250; v2.1.156 ancestor `x7H(H,$) = E81(H ?? C$(), $)` at cli_inner_pretty.js:42224) is structurally identical and unrelated to the permission fix — it only sets the *cwd* for the retry, never the agent's write-isolation root.

---

## R3 — `/workflows` opens immediately (2.1.169)

**What it does:** The `/workflows` slash command — the live/completed workflow browser (a read-only local-jsx panel) — now opens right away instead of waiting for the in-progress turn to settle. Its one-line description was also reworded.

```javascript
// ============================================
// /workflows slash command - immediate:!0 + reworded description
// Location: cli_inner_pretty.js:562632-562641
// ============================================

// ORIGINAL (for source lookup):
((jmf = {
  type: "local-jsx",
  name: "workflows",
  aliases: [],
  description: "Browse running and completed workflows",
  isEnabled: () => Pw(),
  immediate: !0,
  load: () => Promise.resolve().then(() => (CPl(), wPl)),
}),
  (Gmf = jmf));

// READABLE (for understanding):
workflowsCommand = {
  type: "local-jsx",
  name: "workflows",
  aliases: [],
  description: "Browse running and completed workflows",
  isEnabled: () => isWorkflowsEnabled(),    // Pw — the 4-layer master gate (unchanged)
  immediate: true,                          // NEW: mount the panel without waiting for the current turn to settle
  load: () => lazyLoadWorkflowsViewer(),
};

// Mapping: jmf/Gmf->workflowsCommand, Pw->isWorkflowsEnabled
// v2.1.156 before-picture @538934 (Pjz): NO immediate flag;
//   description "Browse dynamic workflow history (running and completed)"; isEnabled: () => NZ().
```

**Before (v2.1.156, before-picture cli_inner_pretty.js:538934-538942):** `Pjz` had **no** `immediate` flag and the description was `"Browse dynamic workflow history (running and completed)"`; the gate was the v2.1.156 `NZ()` (= v2.1.183 `Pw()`).

**How it works:** `immediate` is a generic slash-command property consumed by the command dispatcher: a non-`immediate` `local-jsx` command waits for the active turn to finish streaming before its panel mounts; an `immediate` one mounts its JSX instantly. The body (`load`) is unchanged in shape — a lazy import of the viewer module.

**Why this approach:** `/workflows` is a **read-only viewer**, so there is no correctness reason to serialize it behind the current turn. And the access pattern is precisely adversarial to deferral: because workflows run **in the background** (fire-and-forget launch — see the [baseline](../../../claude_code_v_2.1.156/analyze/42_workflow/gate_caps_lifecycle_relations.md)), a user typically opens `/workflows` *during* a busy turn to watch live progress. Deferring the panel until the turn settles defeats the entire purpose of a live progress viewer. The `immediate:!0` flag makes the panel pop instantly. The description reword (dropping "dynamic … history") is cosmetic — the subsystem is no longer branded "dynamic" in user-facing text.

**Key insight:** A two-line change (`immediate:!0` + a string) with an outsized UX payoff for a *background*-feature viewer: you can pop the panel mid-run instead of waiting for the turn to end. There is no risk because the panel is read-only.

---

## Carryover — the runtime spine is unchanged

Everything below was **read and confirmed identical** to v2.1.156 (logic-equivalent; obfuscated names re-derived where useful). Do not re-derive — read the cited baseline section.

| Unchanged runtime subsystem | v2.1.183 anchor (verified) | Baseline to read |
|---|---|---|
| **Concurrency formula** `min(16, max(2, cores-2))` | `K0p(e){ return Math.min(16, Math.max(2, e-2)) }` cli_inner_pretty.js:416892 | [`gate_caps_lifecycle_relations.md` Part 3](../../../claude_code_v_2.1.156/analyze/42_workflow/gate_caps_lifecycle_relations.md) |
| **Caps**: agent ceiling `_Wa = 1000`, stall `rLp = 180000`, remote-default `X0p = 50`, stall-retry `gWa = 5`, preview `AWa = 400`, script cap `A2 = 524288` | cli_inner_pretty.js:417718, :417739, :417717, :417740, :417722, :152140 | [`gate_caps_lifecycle_relations.md` Part 3](../../../claude_code_v_2.1.156/analyze/42_workflow/gate_caps_lifecycle_relations.md) |
| **Per-agent spawn loop** `Tt` (progress/abort/stall wiring, `wpe` cwd retry wrapper, SubagentStop StructuredOutput nudge) — *only* the two query fields (R1, R2) changed; the stall timer, throttle-retry, and `gWa`-bounded retry loop (cli_inner_pretty.js:417456-417475) are identical | spawn loop cli_inner_pretty.js:417088-417480; `wpe` cli_inner_pretty.js:46250 | [`workflow_runtime_and_subagents.md` §A–D](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_runtime_and_subagents.md) |
| **VM / DSL semantics** (`agent()` per-call pipeline, true `parallel()` barrier vs `pipeline()` flow, `phase()`/`log()`, nested `workflow()` one level, `console`/timers globals, frozen `budget`) | runtime body cli_inner_pretty.js:416988+ | [`workflow_runtime_and_subagents.md` §A–D](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_runtime_and_subagents.md) |
| **Runtime determinism sandbox** (the VM shim that makes `Math.random`/`Date.now`/`new Date()` *throw at execution time*) — distinct from the *pre-launch* AST check (that one was rewritten regex→AST; see [`tool_definition_fixes_delta.md`](./tool_definition_fixes_delta.md) / README B5) | VM shim (unchanged) | [`workflow_runtime_and_subagents.md` §E](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_runtime_and_subagents.md) |
| **Journal / resume protocol** (`journal.jsonl`, SHA-256 cache key over `(phase, prompt, canonical opts)`, longest-unchanged-prefix replay, respawn detection, snapshot for `/workflows`) | journal subsystem (unchanged) | [`gate_caps_lifecycle_relations.md` Part 4](../../../claude_code_v_2.1.156/analyze/42_workflow/gate_caps_lifecycle_relations.md) |
| **Subagent system prompts** (plain `Q0p` cli_inner_pretty.js:417723, StructuredOutput `tLp` cli_inner_pretty.js:417804) + StructuredOutput forcing SubagentStop hook & nudge (cli_inner_pretty.js:417213-417228) | defs `ddo`/`nLp` cli_inner_pretty.js:417811/:417820 | [`workflow_runtime_and_subagents.md` §F](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_runtime_and_subagents.md) |
| **`worktree` isolation prompt suffix** (the "running in an isolated git worktree at …" text, cli_inner_pretty.js:417137-417143) — identical wording to v2.1.156 (cli_inner_pretty.js:375159-375164 *before-picture*); only the *query threading* of `worktreePath` (R2) changed | suffix cli_inner_pretty.js:417137-417143 | [`workflow_authoring_and_orchestration.md`](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_authoring_and_orchestration.md) |
| **`worktree` as the only advertised isolation** (`agent({isolation:'remote'})` still throws "not available in this build") | runtime throw (unchanged) | [`workflow_authoring_and_orchestration.md`](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_authoring_and_orchestration.md) |
| **NEW-post-2.1.88 verdict** (the whole subsystem GA'd 2.1.154 — already established) | n/a | [baseline `README.md` TL;DR](../../../claude_code_v_2.1.156/analyze/42_workflow/README.md) |

> **Note on the `agent()` DSL `effort` opt** (B8c in the README): that is a *tool-definition / DSL-signature* change documented in [`tool_definition_fixes_delta.md`](./tool_definition_fixes_delta.md). The runtime read of it (`le = rB(re?.effort); pe = le !== void 0 ? { ...se, effort: le } : se`, cli_inner_pretty.js:417123-417124) lives in the same `U` spawn function as this doc's fixes but is conceptually a DSL feature, so it is covered there to avoid duplication.

---

## Open questions / residual caveats

1. **R2 background-session blocking not reproduced end-to-end.** I isolated the *exact diff site* (the new `worktreePath: Ce` query field at cli_inner_pretty.js:417253) and traced the full data path into the unchanged write-isolation guard `Xct`, upgrading the dossier's **medium** confidence to **high on the diff site**. The one residual caveat is that I reasoned the *background-session* failure mode from the guard's control flow (branch (A) skipped → branch (B) keyed on `CLAUDE_CODE_SESSION_KIND === "bg"` wrongly fires) rather than from a live repro. The logic is unambiguous, but a hands-on bg-session repro would fully close it.

2. **R1 consumer set may be broader than the two traced sites.** I confirmed the two `pwt.getStore()` consumers — `vXu` (attribution, cli_inner_pretty.js:145447) and the PostToolUse memory hook `hFp`→`M2s` (cli_inner_pretty.js:449494) — which fully explains the missing-attribution symptom and *closes* the README's "render site unconfirmed" open item. There may be additional `getStore()` readers elsewhere in the telemetry/OTEL layer (the v2.1.156 before-picture showed several OTEL attribute writers reading `parentAgentId`, e.g. cli_inner_pretty.js:276469 *before-picture*) that also benefit; I did not enumerate every such reader. Low impact — the *cause* (populate the store on spawn) and the two *primary* consumers are solid.

---

## Related Symbols

> Symbol mappings live in the central index and the per-feature additions file (never as tables in module docs):
> - [symbol_additions_v2_1_183_workflow.md](../00_overview/symbol_additions_v2_1_183_workflow.md) — **All re-derived v2.1.183 Workflow symbols for this delta** (the comprehensive table; add new rows there).
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (Workflows is the home module).
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (the subagent spawn / query `wj`, the agent-context `AsyncLocalStorage` `Rq`/`pwt`, the attribution builder `vXu`).
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (the write-isolation guard `Xct`, permission context `agentWorktree`, session-isolation `aA`).
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (the `/workflows` slash command + viewer panel).

Key functions in this delta doc (re-derived v2.1.183 names):

- `spawnWorkflowAgent` (`Tt`, cli_inner_pretty.js:417149) — the per-agent workflow spawn closure (v2.1.156 ancestor `tH` cli_inner_pretty.js:375171); R1 + R2 both edit its query call.
- `agentContext` (`Dt`, cli_inner_pretty.js:417152) — **NEW** per-agent attribution object `{agentId, parentAgentId, depth, parentSessionId, agentType, subagentName, isBuiltIn}`.
- `runInAgentContext` (`Rq`, cli_inner_pretty.js:103143) — `pwt.run` agent-context `AsyncLocalStorage` run wrapper (v2.1.156 ancestor `Lg` cli_inner_pretty.js:98977); the workflow spawn is **newly** enrolled (cli_inner_pretty.js:417238).
- `isRootContext` (`jz`, cli_inner_pretty.js:103149) / `contextDepth` (`Gz`, cli_inner_pretty.js:103152) / `currentSessionId` (`a4`, cli_inner_pretty.js:103436) / `isBuiltInAgentDef` (`ay`, cli_inner_pretty.js:472399) — the context-field helpers.
- `getAgentAttribution` (`vXu`, cli_inner_pretty.js:145447) — reads `pwt.getStore()` to build the attribution header/telemetry object (UNCHANGED; v2.1.156 `X75` cli_inner_pretty.js:139990).
- `resolveSubagentNameForTelemetry` (`M2s`, cli_inner_pretty.js:103159) — `subagentName`/`"user-defined"` resolver used by the PostToolUse memory hook `hFp` (cli_inner_pretty.js:449494) (UNCHANGED; v2.1.156 `e3K` cli_inner_pretty.js:98983).
- `subagentQuery` (`wj`, cli_inner_pretty.js destructured @387088) — the subagent query; **newly** receives `worktreePath` (R2) and `override.agentContext` (R1).
- `checkWorktreeWriteIsolation` (`Xct`, cli_inner_pretty.js:389676) — write-isolation guard; agent-level branch (cli_inner_pretty.js:389678) **unchanged** but now reachable for workflow subagents (v2.1.156 cli_inner_pretty.js:346662).
- `worktreeCwdRetryWrapper` (`wpe`, cli_inner_pretty.js:46250) — cwd-scoped retry wrapper `e7c(e ?? Pt(), t)` (UNCHANGED; v2.1.156 ancestor `x7H` cli_inner_pretty.js:42224) — unrelated to the permission fix.
- `workflowsCommand` (`jmf`/`Gmf`, cli_inner_pretty.js:562632) — the `/workflows` slash command, now `immediate:!0` (v2.1.156 `Pjz` cli_inner_pretty.js:538934).
- `computeWorkflowConcurrency` (`K0p`, cli_inner_pretty.js:416892) / caps `_Wa`/`rLp`/`X0p`/`gWa`/`AWa`/`A2` — UNCHANGED runtime caps.
- `isWorkflowsEnabled` (`Pw`, cli_inner_pretty.js:148784) — the 4-layer master gate (logic-equivalent to v2.1.156 `NZ`), the `/workflows` `isEnabled`.
