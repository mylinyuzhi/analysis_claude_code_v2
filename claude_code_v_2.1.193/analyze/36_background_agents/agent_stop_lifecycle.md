# Agent Stop Lifecycle: Stop-Is-Permanent + the Turn-End "Working" Finalizer

> **Type:** NET-NEW persistent stop marker (stop is permanent) + CARRYOVER turn-end finalizer · **Versions:** 2.1.191 (stop-permanent), 2.1.187 (turn-end finalizer — *carryover within the window*) · **Module:** `36_background_agents/` (EXTEND)
> **Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). `cli_inner_pretty.js:<line>` = a **193** line unless tagged *(183)*.

## TL;DR

Two lifecycle items live here:

1. **Stop is permanent (NET-NEW, 2.1.191).** Stopping a background agent from the tasks panel now writes a durable **`stoppedByUser: true`** marker to the agent's on-disk state. *Every* resume/continue path checks that marker and **refuses to resurrect** the agent unless the user explicitly force-resumes — at which point the marker is cleared. The entire `stoppedByUser` mechanism is **absent in 183** (`grep -c "stoppedByUser"` = **0** in 183, **9** in 193). This is the "bg agents no longer resurrect after being stopped" fix.

2. **bg jobs no longer stuck "working" at turn end (2.1.187 — but CARRYOVER within the 183→193 window).** The finalizer that flips a `state:"working" tempo:"active"` job to `tempo:"blocked"` when a resume-replay turn produces no query/structured-output is real, but it is **byte-equivalent to a 183 finalizer** (`Exo`@193:464591 ≡ `pgo`@183:456114) and **its call site already exists in 183** (`:675899`). The only 193-window change at this surface is added debug logging. The 2.1.187 attribution predates the 183 before-edge; it is **not** an isolable 183→193 delta. Documented honestly as carryover below.

---

## 1. Stop is permanent (NET-NEW, 2.1.191)

### What it does

Makes "Stop" from the tasks panel a *terminal* decision for a background agent. Before, a stopped agent could be silently resurrected by any later resume/continuation (a SendMessage to it, an auto-resume, a panel re-open). Now a stop writes a disk marker that all resume paths honor; the agent stays cancelled until the user explicitly asks for it again.

### How it works — write the marker

The panel-stop entry point `markAgentStoppedByUser` (`Mde`, `:431808`) flips the live registry entry's `stoppedByUser` flag, then persists the marker to disk via `persistStopMarker` (`CXp`, `:431816`):

```javascript
// ============================================
// markAgentStoppedByUser + persistStopMarker - record a permanent user-stop
// Location: cli_inner_pretty.js:431808-431826
// ============================================

// ORIGINAL (for source lookup):
function Mde(e, t) {
  t.update(e, (r) => (r.stoppedByUser ? r : { ...r, stoppedByUser: !0 }));
  let n = t.get(e);
  if (n?.type === "local_agent") {
    let r = "agentType" in n && typeof n.agentType === "string" ? n.agentType : "general-purpose";
    CXp(e, r);
  }
}
async function CXp(e, t) {
  try {
    let n = await Hre(Ou(e));
    if (n?.stoppedByUser) return;
    await Tde(Ou(e), { ...(n ?? { agentType: t }), stoppedByUser: !0 });
  } catch (n) { /* warn + swallow */ }
}

// READABLE (for understanding):
function markAgentStoppedByUser(agentId, registry) {
  registry.update(agentId, (rec) => (rec.stoppedByUser ? rec : { ...rec, stoppedByUser: true })); // live flag
  let rec = registry.get(agentId);
  if (rec?.type === "local_agent") {
    let agentType = (typeof rec.agentType === "string" ? rec.agentType : "general-purpose");
    persistStopMarker(agentId, agentType);                       // durable flag
  }
}
async function persistStopMarker(agentId, agentType) {
  try {
    let prev = await readAgentDiskState(agentDiskStatePath(agentId));   // Hre/Ou
    if (prev?.stoppedByUser) return;                                    // idempotent
    await writeAgentDiskState(agentDiskStatePath(agentId),             // Tde
      { ...(prev ?? { agentType }), stoppedByUser: true });
  } catch (e) { /* warn + swallow — a stop must never crash the panel */ }
}

// Mapping: Mde→markAgentStoppedByUser, CXp→persistStopMarker, Hre→readAgentDiskState,
//          Tde→writeAgentDiskState, Ou→agentDiskStatePath, e→agentId, t→registry/agentType
```

The marker is also threaded into the canonical disk-state serializer (`:581883`): `...(t.stoppedByUser && { stoppedByUser: !0 })` — so `stoppedByUser` survives every write of the agent's state file, not just the dedicated `persistStopMarker` write.

### How it works — refuse to resurrect

Three independent resume/continue paths now check the marker:

**(a) Resume of a backgrounded agent** (`:441527`): refuses with `AgentStoppedError` (`Vht`, `:441779`) unless force-resume (`c`) is set; on force-resume it strips the marker and rewrites the disk state:

```javascript
// ============================================
// resumeAgentBackground - refuse a stopped agent unless force-resumed (then clear marker)
// Location: cli_inner_pretty.js:441527-441541
// ============================================

// ORIGINAL (for source lookup):
  if (b?.stoppedByUser) {
    if (!c)
      throw (h(), new Vht(`Agent ${e} was stopped by the user and won't be resumed. Treat its work as cancelled; only launch a new agent if the user explicitly asks.`));
    let { stoppedByUser: re, ...ce } = b;
    try { await Tde(Ou(e), ce); } catch (le) { /* warn */ }
  }

// READABLE (for understanding):
  if (persistedState?.stoppedByUser) {
    if (!forceResume)                                            // c — only an explicit user request resumes
      throw new AgentStoppedError(`Agent ${agentId} was stopped by the user and won't be resumed. ` +
        `Treat its work as cancelled; only launch a new agent if the user explicitly asks.`);
    let { stoppedByUser, ...cleared } = persistedState;          // strip the marker
    await writeAgentDiskState(agentDiskStatePath(agentId), cleared); // and persist the clear
  }

// Mapping: b→persistedState, c→forceResume, Vht→AgentStoppedError, Tde→writeAgentDiskState, Ou→agentDiskStatePath
```

**(b) A second guard on the live registry entry** (`:441645`): `if (!c && Kl(X) && X.stoppedByUser) throw new Vht(...)` — catches the case where the live entry carries the flag even if the disk read above did not.

**(c) SendMessage to another agent** (`:442238`): a queued message to a stopped agent returns a non-resurrecting failure instead of waking it:

```javascript
// (193) cli_inner_pretty.js:442238
            if (p.stoppedByUser)
              return { data: { success: !1, message: `Agent "${e.to}" was stopped by the user and was not resumed. Treat its work as cancelled; only start a new agent for it if the user explicitly asks.` } };
```

### Why this approach

**Why a *persisted* marker, not just a live flag?** A background agent's whole point is that it outlives the in-memory registry — it survives across restarts, panel re-opens, and worker handoff. A live-only flag would be lost the moment the registry was rebuilt from disk, and the agent would resurrect on the next resume. Writing `stoppedByUser` into the durable per-agent state (and into the serializer at `:581883`) makes the stop survive exactly as long as the agent record itself.

**Why force-resume *clears* the marker rather than ignoring it?** The marker means "the user cancelled this." If the user then *explicitly* asks to resume it, the cancellation is rescinded — so the marker must be removed, otherwise the next non-forced touch would re-block an agent the user just chose to revive. Clear-on-force-resume keeps the invariant "marker present ⇔ user wants it stopped."

**Why guard at three sites instead of one chokepoint?** Resurrection can be initiated by genuinely different flows — a direct resume, a live-registry continuation, and an inter-agent SendMessage — and they do not share a single entry. Each is guarded where it would otherwise wake the agent, so there is no path that revives a stopped agent. `persistStopMarker` is idempotent (`if (prev?.stoppedByUser) return`) and swallows errors, so a stop is best-effort-durable and can never crash the panel.

**Key insight.** The fix turns "stop" from an *imperative* (kill the current run) into a *declarative state* (`stoppedByUser` on disk). Resurrection bugs are inherently about *some other code path* not knowing the agent was stopped; a durable, broadly-checked flag is the only way to make every present and future resume path agree — and the clear-on-force-resume keeps it from becoming a one-way trap.

---

## 2. Turn-end "working" finalizer (2.1.187 — CARRYOVER within the window)

### What the finalizer does

When a background session resumes and *replays* its transcript but the replay ends **without** producing a new query / structured output, the job would otherwise be left in `state:"working" tempo:"active"` forever (the "working forever" symptom). The finalizer `markReplayNoOp` (`Exo`, `:464591`) detects exactly that state and flips it to `tempo:"blocked"` with `needs: UG` (`"send a prompt to start"`), so the job correctly reports as *waiting for the user* instead of *working*:

```javascript
// ============================================
// markReplayNoOp - unstick a turn-end working+active bg job to blocked/needs-user
// Location: cli_inner_pretty.js:464591-464598
// ============================================

// ORIGINAL (for source lookup):
async function Exo() {
  let e = Be.CLAUDE_JOB_DIR;
  if (!e || Be.CLAUDE_CODE_SESSION_KIND !== "bg") return;
  let t = await ji(e);
  if (!t || t.state !== "working" || t.tempo !== "active") return;
  (await Bd(e, { ...t, tempo: "blocked", needs: UG, updatedAt: new Date().toISOString() }),
    v5({ type: "state", patch: { tempo: "blocked", needs: UG } }));
}

// READABLE (for understanding):
async function markReplayNoOp() {
  let jobDir = env.CLAUDE_JOB_DIR;
  if (!jobDir || env.CLAUDE_CODE_SESSION_KIND !== "bg") return;     // only bg sessions
  let job = await readJobState(jobDir);                             // ji
  if (!job || job.state !== "working" || job.tempo !== "active") return; // only a still-"working" turn
  await writeJobState(jobDir, { ...job, tempo: "blocked", needs: BG_TURN_END_NEEDS_USER, updatedAt: nowISO() }); // Bd
  emitStatePatch({ tempo: "blocked", needs: BG_TURN_END_NEEDS_USER });
}

// Mapping: Exo→markReplayNoOp, ji→readJobState, Bd→writeJobState, v5→emitStatePatch, UG→BG_TURN_END_NEEDS_USER ("send a prompt to start")
```

It is called from the reply-on-resume replay handler (`:689760`): when the replayed transcript does not lead to `onQuery`, the handler calls `markReplayNoOp` to finalize the job:

```javascript
// (193) cli_inner_pretty.js:689757-689760
            T("[reply-on-resume] → onQuery"); /* ...replay produced a query: continue working... */
          } else (T("[reply-on-resume] → markReplayNoOp"), Exo().catch(() => {})); // ...no query: unstick to blocked
```

### Why this is CARRYOVER, not a 183→193 delta

This is the important honesty point. Re-deriving the same code in 183:

- **The finalizer body is byte-equivalent.** 183 `pgo` (`:456114`) has the identical guard `if (!t || t.state !== "working" || t.tempo !== "active") return;` and the identical `tempo:"blocked", needs: Y4` write (`Y4`→`UG` is just the re-mangled `needs` sentinel). 193 `Exo` (`:464591`) is the same function under a new name.
- **The call site already exists in 183.** 183 calls the finalizer at `:675899` — `} else pgo().catch(() => {});` — the same `else <finalizer>().catch(()=>{})` shape as 193's `:689760`.
- **The only 193-window change at this surface is debug logging.** `grep -c "reply-on-resume"` = **4** in 183 → **8** in 193; the added hits are the `T("[reply-on-resume] → onQuery")` / `T("[reply-on-resume] → markReplayNoOp")` debug strings (`:689757`, `:689760`). The behavioral branch they annotate is unchanged.

So the "bg jobs no longer stuck working" mechanism predates the 183 before-edge: it is fully present in 183 (which is *before* 2.1.187 in version order). The 2.1.187 changelog line therefore does **not** map to an isolable 183→193 source delta at this finalizer — the machinery is carryover, and only diagnostic logging was added in the window.

### Sibling carryover finalizers (also present in 183)

The neighboring startup-state finalizers `resetStartupJobState` (`Gaf`, `:464549`) and `armBgStartupWedge` (`Waf`, `:464561`) are likewise carryover bg-job state machinery (the `state:"working" tempo:"active"/"blocked"`, startup-wedge, and `Cst` startup-state set are all abundant in 183 — `grep -c 'tempo: "blocked", needs'`-style patterns and `tempo: "active"` appear 38× in 183). They are documented here only to bound the locus; none is a 193 delta.

---

## Evidence note

| Signal | 183 | 193 | Class |
|--------|-----|-----|-------|
| `grep -c "stoppedByUser"` | **0** | **9** | **NET-NEW** (stop-permanent) |
| `markAgentStoppedByUser` / `persistStopMarker` | absent | `:431808` / `:431816` | NET-NEW |
| resume refusal `if (b?.stoppedByUser)` | absent | `:441527`, `:441645`, `:442238` | NET-NEW |
| turn-end finalizer body | `pgo` `:456114` | `Exo` `:464591` (byte-equiv) | CARRYOVER |
| finalizer call site `else <fin>().catch()` | `:675899` | `:689760` | CARRYOVER |
| `grep -c "reply-on-resume"` | 4 | 8 (added debug logs) | refinement (logging only) |

**Confidence:** HIGH that stop-permanent is NET-NEW (clean `stoppedByUser` 0→9 with full machinery). HIGH that the turn-end finalizer is CARRYOVER (byte-equivalent body + pre-existing call site in 183). The dossier flagged the finalizer as "low-med / not cleanly isolable"; this doc upgrades that to a definite **carryover, not a window delta** with the grep-diff above.

---

## Cross-links

- Sibling 193 docs: [`subagent_depth_tracking.md`](./subagent_depth_tracking.md) (shares the same `Hre`/`Tde`/`Ou` on-disk agent-state store that now carries both `spawnDepth` and `stoppedByUser` at `:581883`), [`bg_shell_pressure_reap.md`](./bg_shell_pressure_reap.md), [`backgrounding_and_panel_fixes.md`](./backgrounding_and_panel_fixes.md), [`README.md`](./README.md).
- 183 tree (canonical for the unchanged classifier/finalizer engine and `/stop` self-stop): [`../../../claude_code_v_2.1.183/analyze/36_background_agents/README.md`](../../../claude_code_v_2.1.183/analyze/36_background_agents/README.md); classifier baseline [`../../../claude_code_v_2.1.156/analyze/36_background_agents/bg_session_classifier.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/bg_session_classifier.md).

## Related Symbols

> Symbol mappings live in the symbol index files (list format, never a mapping table):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)
> - per-feature additions: [symbol_additions_v2_1_193_background_agents.md](../00_overview/symbol_additions_v2_1_193_background_agents.md)

Key functions/constants in this document:

- `markAgentStoppedByUser` (obf: `Mde`, `:431808`) — flips the live flag + persists the marker; NET-NEW.
- `persistStopMarker` (obf: `CXp`, `:431816`) — idempotent disk write of `stoppedByUser:true`; NET-NEW.
- `readAgentDiskState` (obf: `Hre`, `:581895`) / `writeAgentDiskState` (obf: `Tde`, `:581867`) / `agentDiskStatePath` (obf: `Ou`, `:1792`; identity passthrough — the `.meta.json` join is in `t7l`@581864) — the on-disk agent-state store.
- `AgentStoppedError` (obf: `Vht`, `:441779`) — thrown by the resume guards (`:441527`, `:441645`).
- `markReplayNoOp` / `finalizeStuckWorkingJob` (obf: `Exo`, `:464591`; 183 `pgo`@456114) — turn-end working→blocked finalizer; CARRYOVER.
- `resetStartupJobState` (obf: `Gaf`, `:464549`) / `armBgStartupWedge` (obf: `Waf`, `:464561`) — neighboring startup finalizers; CARRYOVER.
- `BG_TURN_END_NEEDS_USER` (obf: `UG`, `:193813`) — `"send a prompt to start"` needs sentinel.
