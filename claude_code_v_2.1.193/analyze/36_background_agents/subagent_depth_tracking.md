# Subagent Depth Tracking: Resume-Restore + Forks Count Toward the Cap

> **Type:** NET-NEW spawn-time throw + body-change on the resume path · **Version:** 2.1.187 (continuation of the v2.1.172 / v2.1.181 nested-subagent depth work) · **Module:** `36_background_agents/` (EXTEND)
> **Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). `cli_inner_pretty.js:<line>` = a **193** line unless tagged *(183)*.

## TL;DR

The v2.1.183 tree established the depth model end-to-end (constant `5`, a `getAgentDepth` reader, a `cio`/`bte` tool-filter gate that drops the **Agent** tool once `agentDepth >= 5`, `Gz(parent)+1` stamping at every spawn surface, and `spawnDepth` persistence). See [`../../../claude_code_v_2.1.183/analyze/36_background_agents/nested_subagent_depth_limit.md`](../../../claude_code_v_2.1.183/analyze/36_background_agents/nested_subagent_depth_limit.md) for that full machinery (it is **carryover** in 193, re-mangled). The **2.1.187 delta** adds two correctness fixes on top of it:

1. **Resume restores the original spawn depth (body-change).** On 183 the resume path fell back to `void 0` when there was no live registry entry, recomputing depth from the *resumer's* context and **losing** the original depth. 193 inserts `b?.spawnDepth` — the **persisted on-disk `spawnDepth`** is honored, so a resumed subagent keeps the depth it was spawned at.
2. **A spawn-time depth-cap *throw* (NET-NEW), so forks count toward the cap.** 183 enforced depth only by *tool removal* (a depth-5 agent simply didn't receive the Agent tool). 193 adds an explicit `if (depth >= 5) throw …` at the Agent-tool call entry that **every** spawn path — including forks — passes through, with a new `subagent_depth_cap` telemetry reason. `grep -c "subagent_depth_cap"` / `"Subagent nesting limit reached"` = **0** in 183, present in 193.

The depth *value* itself (`5`) and the depth *reader* are carryover — re-derived here under their 193 obf names so the 183 doc stays usable.

---

## 0. The carryover spine (re-derived 193 names)

The 183 tree's symbols are all re-mangled in 193. The load-bearing carryover pieces, re-derived by line:

**The constant — `SUBAGENT_DEPTH_LIMIT = 5`** (obf `FBt`, 193 `:229871`; was `v1i` 183 `:221800`):

```javascript
// ============================================
// SUBAGENT_DEPTH_LIMIT - the nested-subagent depth cap (= 5; carryover value)
// Location: cli_inner_pretty.js:229871
// ============================================

// ORIGINAL (for source lookup):
  FBt = 5,

// READABLE (for understanding):
  SUBAGENT_DEPTH_LIMIT = 5,   // unchanged value; 183 obf v1i, 193 obf FBt

// Mapping: FBt→SUBAGENT_DEPTH_LIMIT  (183: v1i)
```

**The depth reader — `getAgentDepth`** (obf `K3`, 193 `:103808`; was `Gz` 183 `:103152`), byte-equivalent body:

```javascript
// ============================================
// getAgentDepth - nesting depth of an agentContext (0 for main)
// Location: cli_inner_pretty.js:103808-103811
// ============================================

// ORIGINAL (for source lookup):
function K3(e) {
  if (e.agentType === "main") return 0;
  return e.depth ?? 0;
}

// READABLE (for understanding):
function getAgentDepth(agentContext) {
  if (agentContext.agentType === "main") return 0; // root conversation is depth 0
  return agentContext.depth ?? 0;                   // every spawned context carries its own depth
}

// Mapping: K3→getAgentDepth  (183: Gz)
```

The `cio` tool-filter gate (`if (Rc(i, vs)) return s < v1i;`) and the `bte` resolved-tools builder that threads `agentDepth` are likewise carryover under re-mangled names. They are *not* re-derived here — they are fully analyzed in the 183 doc; this doc covers only the two **new** 187 behaviors.

---

## 1. Resume restores the original spawn depth (body-change)

**What it does:** Ensures a subagent that is *resumed* — e.g. after a process restart, when there is no live in-memory registry entry — keeps the depth it was originally spawned at, instead of being re-based to `resumerDepth + 1`.

**How it works.** Inside `resumeAgentBackground` (the resume path), the depth used for the resumed agent's registry entry and rebuilt `agentContext` is computed from three sources in priority order: live registry entry → persisted on-disk state → fresh recompute.

```javascript
// ============================================
// resume-path depth - prefer live entry, else persisted spawnDepth, else recompute
// Location: cli_inner_pretty.js:441543-441544
// ============================================

// ORIGINAL (for source lookup):
  let _ = f.get(e),
    H = (Kl(_) ? _.spawnDepth : b?.spawnDepth) ?? K3(i.agentContext) + 1,

// READABLE (for understanding):
  let liveEntry = registry.get(agentId),                    // f.get(e)
    resumeDepth =
      (isLocalAgentTask(liveEntry) ? liveEntry.spawnDepth    // 1) live registry entry wins
                                   : persistedState?.spawnDepth) // 2) ← NEW: else the on-disk spawnDepth
      ?? getAgentDepth(resumerCtx.agentContext) + 1;         // 3) else recompute from the resumer (last resort)

// Mapping: _→liveEntry, H→resumeDepth, Kl→isLocalAgentTask, _.spawnDepth→live depth,
//          b→persistedState (= await readAgentDiskState(...)), K3→getAgentDepth, i.agentContext→resumerCtx
```

Where `b` is the persisted disk state (`b = await Hre(Ou(e))`, read earlier in the same function), and `Kl` (`:453726`) is `isLocalAgentTask` (`type === "local_agent"`). The restored `resumeDepth` then flows into both the registry entry's `spawnDepth` and the rebuilt child `agentContext.depth`, so the resumed agent's *future* toolset builds see the correct level.

**The 183 before-picture** (`:434085`, *183*):

```javascript
// (183) cli_inner_pretty.js:434085
  y = (od(g) ? g.spawnDepth : void 0) ?? Gz(o.agentContext) + 1,
```

The else-branch was **`void 0`**. So in 183, resuming an agent with no live registry entry (`g` absent) made the `??` fall straight through to `Gz(resumer)+1` — the original depth was **lost** and the agent was re-based one level under whoever resumed it. A depth-3 agent resumed from `main` would silently become depth-1.

**Why this approach.** Depth has to be *authoritative on disk* for a background/resumable agent, because such an agent outlives the in-memory registry across restarts. 183 already *persisted* `spawnDepth` into the task record but did not *read it back* on the no-live-entry resume path — the persistence existed, the restore did not. 187 closes that gap by inserting the `b?.spawnDepth` read between the live-entry check and the recompute fallback. The priority order (live → disk → recompute) is deliberate: the live entry is freshest, the disk value is the durable truth, and the recompute is only a degraded last resort for an agent that was never persisted at all.

**Key insight.** This is a one-token structural fix — `void 0` → `b?.spawnDepth` — but it is the difference between "resume preserves the spawn tree" and "resume flattens it." The persisted `spawnDepth` was *already being written* (carryover); 187 simply makes the resume path *trust it* instead of throwing it away.

---

## 2. Spawn-time depth-cap throw — forks now count toward the cap (NET-NEW)

**What it does:** Adds a hard, explicit refusal at the Agent-tool call entry when the spawning agent is already at the depth limit, with a model-facing error message and a `subagent_depth_cap` telemetry reason. Because this check sits at the single Agent-tool `call` entry that *all* spawn variants (regular spawn, background, **fork**) flow through, forked subagents are now counted by and blocked at the cap — not just regular spawns.

**How it works.** At the top of the Agent-tool call body, after computing the spawning context's depth, 193 throws if it has reached the limit:

```javascript
// ============================================
// spawn-time depth cap - explicit throw at the Agent-tool call entry (forks counted)
// Location: cli_inner_pretty.js:430477-430484
// ============================================

// ORIGINAL (for source lookup):
        let g = K3(c.agentContext);
        if (g >= FBt)
          throw (
            Re("subagent_launch", "subagent_depth_cap"),
            new RPe(
              `Subagent nesting limit reached (depth ${g} of ${FBt}). Complete this task directly using your tools instead of spawning another agent.`,
            )
          );

// READABLE (for understanding):
        let spawnerDepth = getAgentDepth(callerCtx.agentContext);          // K3
        if (spawnerDepth >= SUBAGENT_DEPTH_LIMIT) {                        // >= 5
          logFeatureError("subagent_launch", "subagent_depth_cap");       // Re — emits tengu_feature_bad; subagent_depth_cap is the NEW error_code
          throw new SubagentLaunchError(                                  // RPe
            `Subagent nesting limit reached (depth ${spawnerDepth} of ${SUBAGENT_DEPTH_LIMIT}). ` +
            `Complete this task directly using your tools instead of spawning another agent.`,
          );
        }

// Mapping: g→spawnerDepth, K3→getAgentDepth, FBt→SUBAGENT_DEPTH_LIMIT, Re→logFeatureError (tengu_feature_bad logger @44848),
//          RPe→SubagentLaunchError (Error subclass @430357), c.agentContext→callerCtx
```

The same `call` body then computes the child depth for a permitted spawn the carryover way (`X = K3(c.agentContext) + 1`, `:430685`), used for telemetry, the async metadata, and the child `agentContext.depth`. Fork metadata (`isFork`) is recorded on the same path, so a fork takes the identical depth-computation route — which is precisely why the up-front `>= FBt` throw now covers forks.

### Why a throw *and* the tool-removal gate (belt and braces)

183 enforced depth purely by **tool removal** in `cio`: a depth-5 agent's toolset was built *without* the Agent tool, so its model never even saw the tool and could not emit a spawn. That is clean for the *normal* spawn surface (the agent's own toolset) but has a gap: a path that reaches the Agent-tool `call` **without** going through that agent's `cio`-filtered toolset — notably a **fork** invoked through a different entry — could slip past an availability check that was never applied to it. 187 closes this by moving enforcement to the **call entry itself**: regardless of how a spawn request arrived, the first thing the Agent-tool call does is `getAgentDepth(caller) >= 5 → throw`. The two mechanisms compose:

- `cio` tool-removal (carryover) keeps a depth-5 agent's *model* from ever trying to spawn (no wasted turn, the common case).
- the call-entry throw (NET-NEW) is the *backstop* that counts every actual spawn attempt — including forks and any non-toolset-mediated path — and refuses it with a recoverable error string.

### Why an error string here when 183 had none

183 deliberately had **no** "max depth" message (enforcement-by-removal is silent). The 187 throw reintroduces a message — but only on the backstop path, for a spawn attempt that *did* reach the call. The message is model-facing and prescriptive ("Complete this task directly using your tools instead of spawning another agent"), so a model that somehow attempted a too-deep spawn gets an actionable recovery instruction rather than an opaque failure. The `subagent_depth_cap` telemetry reason makes cap-hits *observable* for the first time (183 had no hit event, by design).

**Key insight.** The headline of 187 is the word **"count."** 183's number `5` is unchanged and the cap was always *5 levels*; what changed is *which spawns are counted against it*. By relocating the decision from "is the Agent tool in this agent's toolset?" (a property of how the toolset was built) to "what is the caller's depth at the moment of the call?" (a property of the call itself), forks — which share the `getAgentDepth(parent)`/`+1` computation but could bypass the toolset-build gate — are now first-class members of the depth accounting.

---

## Evidence note (NET-NEW + body-change vs CARRYOVER)

| Signal | 183 | 193 | Class |
|--------|-----|-----|-------|
| `grep -c "subagent_depth_cap"` | **0** | 1 (`:430480`) | **NET-NEW** |
| `grep -c "Subagent nesting limit reached"` | **0** | 1 (`:430482`) | **NET-NEW** |
| resume else-branch | `void 0` (`:434085`) | `b?.spawnDepth` (`:441544`) | **body-change** |
| depth limit value | `v1i = 5` (`:221800`) | `FBt = 5` (`:229871`) | CARRYOVER (re-mangle) |
| depth reader | `Gz` (`:103152`) | `K3` (`:103808`) | CARRYOVER (byte-equiv) |
| `cio`/`bte` tool-filter gate | present | present (re-mangled) | CARRYOVER |

**False-delta guard:** do **not** call `5` a 193 change — it is the same literal as 183's `v1i = 5`. The depth *reader* and the *tool-filter* gate are carryover too. The genuine 187 deltas are exactly the resume-restore (`void 0` → `b?.spawnDepth`) and the net-new call-entry `subagent_depth_cap` throw. **Confidence: HIGH** — both pinned by line, both with a clean 183 grep-diff.

**88 ancestor note:** the v2.1.88 named-TS tree predates the persisted-`spawnDepth` / disk-resume model entirely, so both the resume-restore and the on-disk depth are post-88 machinery; there is nothing to map back to in 88.

---

## Cross-links

- 183 canonical depth machinery (constant → reader → `cio`/`bte` gate → threading → persistence → telemetry): [`../../../claude_code_v_2.1.183/analyze/36_background_agents/nested_subagent_depth_limit.md`](../../../claude_code_v_2.1.183/analyze/36_background_agents/nested_subagent_depth_limit.md).
- Sibling 193 docs: [`bg_shell_pressure_reap.md`](./bg_shell_pressure_reap.md) (the `agentId`/top-level model), [`agent_stop_lifecycle.md`](./agent_stop_lifecycle.md) (the same on-disk `Hre`/`Tde` agent-state store, where `spawnDepth` is persisted alongside `stoppedByUser`), [`backgrounding_and_panel_fixes.md`](./backgrounding_and_panel_fixes.md), [`README.md`](./README.md).

## Related Symbols

> Symbol mappings live in the symbol index files (list format, never a mapping table):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)
> - per-feature additions: [symbol_additions_v2_1_193_background_agents.md](../00_overview/symbol_additions_v2_1_193_background_agents.md)

Key functions/constants in this document:

- `SUBAGENT_DEPTH_LIMIT` (obf: `FBt`, `:229871`; 183 `v1i`) — the cap `5`; carryover value.
- `getAgentDepth` (obf: `K3`, `:103808`; 183 `Gz`) — `0` for `main`, else `agentContext.depth ?? 0`; carryover.
- `isLocalAgentTask` (obf: `Kl`, `:453726`; 183 `od`) — `type === "local_agent"`; gates the live-entry vs persisted-`spawnDepth` choice on resume.
- resume-restore depth expr (`:441544`) — `(Kl(_) ? _.spawnDepth : b?.spawnDepth) ?? K3(i.agentContext)+1`; the `b?.spawnDepth` is the 187 insert (183 had `void 0`).
- spawn-time depth-cap throw (`:430477-430484`) — `if (K3(c.agentContext) >= FBt) { Re("subagent_launch","subagent_depth_cap"); throw new RPe(...) }`; NET-NEW.
- `SubagentLaunchError` (obf: `RPe`, `:430357`) — Error subclass thrown by the depth cap.
- fresh-spawn child depth (`:430685`) — `X = K3(c.agentContext) + 1`; carryover stamping used for all permitted spawns including forks.
