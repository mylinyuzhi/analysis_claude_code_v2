# Pre-warmed Worker (Spare) Fallback — v2.1.141

## TL;DR

The daemon pre-warms one background worker (a "spare") and parks it ready-to-go so the next user dispatch lands on a sub-second-latency `claim` instead of a multi-second cold spawn. v2.1.141 added a fallback path: if the spare exists but the claim fails (the worker crashed, the socket is gone, the state file is corrupted), the dispatch transparently falls back to a fresh cold spawn instead of erroring out. The user sees a slightly slower dispatch but no failure.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md)

Key items:
- `claimSpareOrColdDispatch` (`jN4`) — Entry point (cli_inner_pretty.js:509877-509921)
- `discardPendingSpare` (`JN4`) — Cleanup on shutdown (cli_inner_pretty.js:509922-509926)
- `coldDispatchFromTemplate` (`yP8`) — The fresh-spawn fallback (cli_inner_pretty.js:509781-509834)
- `kP8` — RPC: ask the spare to start working on this prompt (referenced near 509909)
- `pendingSpareDescriptor` (`l1H`) — Module-global holding the spare's descriptor
- `SPARE_BG_AGENT_TEMPLATE` (`c1H`) — The synthetic template the spare uses while idle
- `tengu_bg_spare_enable` feature flag (cli_inner_pretty.js:609280)
- Telemetry: `tengu_bg_spare_claim`, `tengu_bg_spare_claim_fail`

---

## Why Pre-warm?

Spawning a worker requires:
1. `Bun.spawn(execPath, ["--bg-pty-host", …, "--", execPath, …, "--bg-spare", short])` — fork+exec.
2. PTY host initializes a unix socket pair.
3. Bun loads ~30 MB of bundle code into V8.
4. Cwd resolution, settings load, plugin scan, MCP-config parse.
5. Auth snapshot; auth-token decryption if applicable.
6. The worker's session loop initializes and idles waiting for its first prompt.

Total: ~2–4 seconds on a typical laptop. For UX, this is a long "thinking" period between the user pressing Enter and getting their first response.

Pre-warming runs all six steps proactively at daemon-idle time so the worker is ready to receive a prompt. When the user dispatches, the daemon hands the spare's descriptor to the dispatcher, which sends a "start working on X" RPC. The worker takes that prompt and goes from idle to running in ~100 ms.

The trade-off: one worker's worth of RAM (~150 MB RSS) is parked. If the user never dispatches, that's wasted resident memory. The daemon mitigates this by:
- Only spawning *one* spare at a time.
- Retiring stale spares older than `gKA = 1h` (the regular retire path with state=`stale-spare`).
- Skipping spare spawn entirely when system memory is low (line 609263-609266).

The `tengu_bg_spare_enable` flag (default true in v2.1.142) controls the whole subsystem. Disabling it reverts to always-cold-dispatch.

---

## The Claim Path

```javascript
// ============================================
// claimSpareOrColdDispatch - Try the spare; fall back to cold dispatch on any failure
// Location: cli_inner_pretty.js:509877-509921
// ============================================

// ORIGINAL (for source lookup):
async function jN4(H) {
  N("[PERF:bg-claim-start]");
  let $ = l1H;
  l1H = null;
  let q = async (_, A) => {
    if ((N(`[bg-spare] claim miss (${_})${A ? `: ${A}` : ""}`), d("tengu_bg_spare_claim_fail", { reason: _ }), $)) {
      let { removed: z, error: Y } = await h$H($.jobId, { internal: !0 });
      if (!z)
        return (uH("job_claim_spare", "job_claim_spare_delete_failed"),
          N(`[bg-spare] deleteJob unconfirmed (${Y ?? "unknown"}) — cold-dispatching with fresh sessionId; spare ${$.jobId} dir preserved`, { level: "warn" }),
          yP8(c1H, H, void 0, $.cwd, void 0, $.defaults));
    }
    return (J8("job_claim_spare", _), yP8(c1H, H, $?.sessionId, $?.cwd, void 0, $?.defaults));
  };
  if (!$) return q("no-spare");
  let K = DsH(aKH({
      template: c1H,
      respawnFlags: [...OG$, "--agent", c1H.name, ...qg6($.defaults)],
      intent: H,
      sessionId: $.sessionId,
      cwd: $.cwd,
      originCwd: $.cwd,
    }), H);
  try {
    let _ = await kP8($.jobId, H, void 0, K);
    if (_) return q(_ === jsH ? "enojob" : "reply", _);
  } catch (_) {
    return q("reply-throw", ZH(_));
  }
  return (await gz(k9($.jobId), K).catch(EH),
    N("[PERF:bg-claim-end]"),
    RH("job_claim_spare"),
    RH("fleet_view_dispatch"),
    { ok: !0, jobId: $.jobId, sessionId: $.sessionId });
}

// READABLE (for understanding):
async function claimSpareOrColdDispatch(prompt) {
  perfMark("[PERF:bg-claim-start]");
  const spare = pendingSpareDescriptor;
  pendingSpareDescriptor = null;     // consume — won't be reused

  // Fallback function — used whenever the spare path fails for any reason
  const fallbackToColdDispatch = async (reason, detail) => {
    log(`[bg-spare] claim miss (${reason})${detail ? `: ${detail}` : ""}`);
    tlm("tengu_bg_spare_claim_fail", { reason });

    if (spare) {
      // Try to clean up the spare's state file before re-dispatching
      const { removed, error: delError } = await deleteJobAndState(spare.jobId, { internal: true });
      if (!removed) {
        bumpErr("job_claim_spare", "job_claim_spare_delete_failed");
        log(`[bg-spare] deleteJob unconfirmed (${delError ?? "unknown"}) — ` +
            `cold-dispatching with fresh sessionId; spare ${spare.jobId} dir preserved`, { level: "warn" });
        // Fresh sessionId to avoid colliding with the orphaned spare's dir
        return coldDispatchFromTemplate(
          SPARE_BG_AGENT_TEMPLATE, prompt, /*forcedSessionId=*/undefined,
          spare.cwd, /*forcedShort=*/undefined, spare.defaults
        );
      }
    }
    // Spare's state file removed (or no spare at all) — reuse spare's sessionId
    sometimesErr("job_claim_spare", reason);
    return coldDispatchFromTemplate(
      SPARE_BG_AGENT_TEMPLATE, prompt, spare?.sessionId, spare?.cwd, /*short=*/undefined, spare?.defaults
    );
  };

  if (!spare) return fallbackToColdDispatch("no-spare");

  // Build the state record the spare should adopt
  const stateRecord = composeJobStateRecord(seedJobStateRecord({
    template: SPARE_BG_AGENT_TEMPLATE,
    respawnFlags: [...dispatchExtraArgsState, "--agent", SPARE_BG_AGENT_TEMPLATE.name, ...dispatchDefaultsToArgv(spare.defaults)],
    intent: prompt,
    sessionId: spare.sessionId,
    cwd: spare.cwd,
    originCwd: spare.cwd,
  }), prompt);

  try {
    // RPC the spare worker: "switch into running mode with this prompt + state"
    const errCode = await sendClaimRpc(spare.jobId, prompt, /*…*/undefined, stateRecord);
    if (errCode) return fallbackToColdDispatch(errCode === JOB_NOT_FOUND ? "enojob" : "reply", errCode);
  } catch (err) {
    return fallbackToColdDispatch("reply-throw", formatErr(err));
  }

  // Spare claimed successfully — persist its state and report success
  await writeJobStateAtomic(jobStateDir(spare.jobId), stateRecord).catch(logErr);
  perfMark("[PERF:bg-claim-end]");
  RH("job_claim_spare");
  RH("fleet_view_dispatch");
  return { ok: true, jobId: spare.jobId, sessionId: spare.sessionId };
}

// Mapping: jN4→claimSpareOrColdDispatch, H→prompt, $→spare, q→fallbackToColdDispatch,
//          _→reason/errCode, A→detail, z→removed, Y→delError,
//          K→stateRecord, kP8→sendClaimRpc, jsH→JOB_NOT_FOUND,
//          l1H→pendingSpareDescriptor, c1H→SPARE_BG_AGENT_TEMPLATE,
//          yP8→coldDispatchFromTemplate, h$H→deleteJobAndState, gz→writeJobStateAtomic,
//          k9→jobStateDir, DsH→composeJobStateRecord, aKH→seedJobStateRecord
```

### The Three Failure Reasons

1. **`no-spare`** — `pendingSpareDescriptor` was null. No spare was ever warmed (`tengu_bg_spare_enable` disabled, or one was claimed/retired and no new one warmed yet).
2. **`enojob`** — `kP8` returned `JOB_NOT_FOUND`. The spare worker still exists in the descriptor but the daemon side has already cleaned it up (race condition: the worker exited just before our claim arrived).
3. **`reply`** — `kP8` returned some other error code. The RPC reached the worker but the worker couldn't transition (e.g., its session was mid-write to disk and is locked).
4. **`reply-throw`** — `kP8` threw (e.g., the rendezvous socket is dead, ECONNREFUSED).

### Fresh Session ID Handling

If the spare's state directory cleanup *fails* (`!removed`), the fallback uses an **undefined** sessionId so a fresh UUID is generated for the cold-dispatched worker. This avoids the new worker colliding with the orphaned spare's state directory. The orphan is left on disk (a small leak), but the user's dispatch succeeds.

If the cleanup *succeeds*, the fallback re-uses the spare's `sessionId` — the slot is empty and the user gets a worker with the expected ID.

### Telemetry

- `tengu_bg_spare_claim_fail { reason }` — emitted on every failure path.
- `tengu_bg_spare_claim_fail` with `reason: "no-spare"` is special — it's not a *failure* per se, it just means no warming happened. This signal is used to tune the warming policy.
- `job_claim_spare` ("RH" success) — emitted on successful claim.
- `job_claim_spare_delete_failed` — sub-bucket of failures, when state-dir cleanup itself errored out.
- `PERF:bg-claim-start` / `PERF:bg-claim-end` — performance trace markers (~100 ms gap on success).

---

## How Warming Happens

In the daemon's poll loop (around cli_inner_pretty.js:609280-609313):

```javascript
// Excerpt — daemon dispatch handler
if (f && !I && f.cliVersion === CURRENT_VERSION && Z$("tengu_bg_spare_enable", !0)) {
  let pendingSpare = f;
  f = null;
  try {
    let handle = wrapSpareAsHandle(dispatch, pendingSpare, …);
    handles.set(dispatch.short, handle);
    installHandleListeners(handles, handle, …);
    onLeaseChange();
    d("tengu_bg_spare_claim", { age_ms: Date.now() - pendingSpare.startedAt });
    log(`bg claimed-spare ${dispatch.short} (${dispatch.source})`);
    RH("daemon_bg_session_create");
    notifyChange();
    return;
  } catch (err) {
    let kind = errKind(err);
    let reason = kind === "ENOENT" ? "enoent" : kind === "ECONNREFUSED" ? "econnrefused" : err instanceof Error ? "error" : "unknown";
    d("tengu_bg_spare_claim_fail", { reason });
    pendingSpare.dispose();
  }
}
// Fall through to cold spawn:
let handle = BgWorkerHandle.spawn(dispatch, …, … , afterUpgrade ? { afterUpgrade } : undefined);
handles.set(dispatch.short, handle);
```

There are *two* claim paths:
- **Daemon-internal** (the excerpt above): when a dispatch arrives and the daemon has a pre-allocated `f` (the daemon's pending-spare descriptor for handles), claim it directly into the handle map. Failure → fall through to `BgWorkerHandle.spawn`.
- **Foreground-process** (`jN4` shown earlier): when the foreground dashboard wants to dispatch and has a `l1H` pending-spare descriptor for its side, claim via RPC. Failure → call `yP8.coldDispatchFromTemplate`.

The two paths exist because warming happens *before the user types*: the daemon and the foreground each maintain their own "I have a spare" descriptor. When the user dispatches, whichever path is reached first claims.

---

## Memory-pressure Bypass

```javascript
// cli_inner_pretty.js:609263-609266
if (v.source === "spare" && R > 0 && C < R) {
  H(`bg: low memory — skipping spare dispatch ${v.short}`);
  return;
}
```

When the daemon is asked to dispatch *a spare* (not a real worker — the spare-warming path itself), and memory is below the threshold, skip the warm. The reasoning: a spare consumes ~150 MB. If we're already low, parking that proactively makes things worse. Better to let cold dispatch be slow than to OOM the user.

---

## Cleanup on Daemon Shutdown

```javascript
// cli_inner_pretty.js:509922-509926
async function JN4() {
  if (((EP8 = !0), JsH)) await JsH.catch(() => {});
  let H = l1H;
  if (((l1H = null), H)) await h$H(H.jobId, { internal: !0 });
}
```

On daemon shutdown, the pending spare's state directory is deleted. This prevents stale state files from accumulating on disk after restarts. The flag `EP8` is set to true so any in-progress warm doesn't proceed.

---

## Why `seedJobStateRecord` (`aKH`) for the Spare?

The spare worker, when warming, doesn't have a user-supplied prompt or session intent. It writes a stub state record:

```json
{
  "template": { "name": "bg", "description": "" },
  "intent": "",
  "tempo": "blocked",
  "detail": "(idle — send a prompt to start)",
  "needs": "send a prompt to start",
  "sessionId": "<uuid>",
  "cwd": "<dispatch-time cwd>",
  "createdAt": "<ISO 8601>"
}
```

The `tempo: "blocked"`, `detail: "(idle — send a prompt to start)"`, and `needs` fields make the spare appear in the dashboard's "Needs input" bucket *if* the user happens to open agent view while the spare is still parked. The user can interact with it like any other waiting bg session, which is exactly what `kP8` (the claim RPC) does internally — sends a prompt to a worker that's waiting for one.

This is part of why the v2.1.141 empty-idle auto-retire is interesting: a spare that's never claimed accrues `pB5 = 5 min` of idle and then auto-retires itself. The `state` predicate (no name, no intent, no worktree, `state="working"`, `tempo="blocked"`, `template="bg"`) intentionally matches the spare's seed record, so spares get retired by the same logic.

---

## Validation

| Claim | Source |
|-------|--------|
| `jN4` falls back to `yP8.coldDispatchFromTemplate` on every failure path | cli_inner_pretty.js:509881-509894 |
| Failure reasons: `no-spare`, `enojob`, `reply`, `reply-throw` | cli_inner_pretty.js:509896, 509910, 509912 |
| Spare warming is gated by `tengu_bg_spare_enable` (default true) | cli_inner_pretty.js:609280 |
| Low memory bypass: skip spare dispatch when free < threshold | cli_inner_pretty.js:609263-609266 |
| Telemetry: `tengu_bg_spare_claim`, `tengu_bg_spare_claim_fail`, `tengu_bg_spare_claim_fail.reason` | cli_inner_pretty.js:509882, 609289, 609304 |
| Seed-state record produced by `aKH.seedJobStateRecord` | cli_inner_pretty.js (constants in 510550, 509795, 509897) |
