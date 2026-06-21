# `claude agents --json` rework (v2.1.183): three-source merge, `id`/`state`/`waitingFor`, `--all`

> Delta doc: documents the **v2.1.156 → v2.1.183** rework of the `claude agents --json` machine-readable surface (changelog 2.1.169 + 2.1.162).
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). Every `cli_inner_pretty.js:<line>` citation below is a **v2.1.183** line unless it is explicitly tagged `(v2.1.156 before-picture)`.
> BASELINE module: [`../../../claude_code_v_2.1.156/analyze/36_background_agents/`](../../../claude_code_v_2.1.156/analyze/36_background_agents/README.md). Note: the v2.1.156 baseline tree did **not** carry a dedicated `agents --json` doc — `bBz` is unanalyzed there — so the before-picture in this doc is read directly from the v2.1.156 bundle (`bBz` @642728, the command def @646279) rather than linked.
> Obfuscated names were **re-derived** for v2.1.183 — the bundler re-mangles every build, so the v2.1.156 names (`bBz`, `qSH`, `FT9`, `IH`, …) are never reused as v2.1.183 names. Use the [§ Related Symbols](#related-symbols) list as the canonical v2.1.183 map.

---

## TL;DR

`claude agents --json` is the scriptable, non-TTY view of the background-agent fleet — the JSON sibling of the interactive FleetView TUI. In v2.1.156 it was a thin wrapper over the **live-process scanner only**: `bBz` (@642728) iterated `qSH()` (the list of live daemon/interactive/bg PIDs found by scanning the lock-file directory) and printed `{ pid, cwd, kind, startedAt, sessionId, name, status }`. A background job that had just been *dispatched* but had not yet spawned a live process — or a job that was *blocked waiting on the user* with its worker already retired — simply did not appear. That is the exact 2.1.169 bug ("background sessions missing from `claude agents --json`").

v2.1.183's `aGf` (`cli_inner_pretty.js:691275`) fixes this by **merging three sources** — live processes (`m4e`), on-disk job-state records (`QK`), and the daemon's "shorts" roster (`zzn`) — keyed on job id, so just-dispatched and blocked-but-process-less jobs are surfaced. Each merged entry gains three new fields: a stable `id` (the on-disk job id, not the volatile pid), a derived lifecycle `state` (`working` / `blocked` / `done` / `failed` / `stopped`, computed by `lGf` @691342), and a `waitingFor` summary when a process is blocked on input. A new `--all` flag (@695321) flips the default filter from "only running / working / blocked" to "include completed sessions" so scripts can choose between a live view and the full history.

**Confidence: high.** Every field, source, and filter branch below was read in both bundles. The only carryover-not-delta is the CLI guard wrapper (`mQe`/`FM`/`mTe`, formerly `XgH`/`Ap`/`RMH`) and the live-proc scanner (`m4e` is byte-identical to v2.1.156 `qSH`).

---

## 1. The before-picture: v2.1.156 `bBz` — live processes only

### 1.1 What it did

The v2.1.156 printer had exactly one data source and emitted one flat shape per live process.

```javascript
// ============================================
// printAgentsJson (v2.1.156) - live-process-only JSON view
// Location (v2.1.156 before-picture): cli_inner_pretty.js:642728-642753
// ============================================

// ORIGINAL (for source lookup):
async function bBz(H) {
  let $ = H ? await F3(jK$.resolve(H)) : void 0,
    q = [];
  for (let K of await qSH()) {
    if (K.kind !== "interactive" && K.kind !== "bg") continue;
    if ($) {
      let _ = jK$.relative($, K.cwd);
      if (_.split(/[/\\]/, 1)[0] === ".." || jK$.isAbsolute(_)) continue;
    }
    q.push({
      pid: K.pid,
      cwd: K.cwd,
      kind: K.kind === "bg" ? "background" : "interactive",
      startedAt: K.startedAt,
      ...(K.sessionId && { sessionId: K.sessionId }),
      ...(K.name && { name: K.name }),
      ...(K.status && { status: K.status === "idle" ? "idle" : K.status === "waiting" ? "waiting" : "busy" }),
    });
  }
  (process.stdout.write(IH(q, null, 2) + `\n`), SH("cli_agents_json"));
}

// READABLE (for understanding):
async function printAgentsJson_v156(cwdFilter) {
  let baseDir = cwdFilter ? await realpath(resolve(cwdFilter)) : undefined;
  let out = [];
  for (let proc of await scanLiveProcesses()) {            // qSH(): ONLY live PIDs
    if (proc.kind !== "interactive" && proc.kind !== "bg") continue;
    if (baseDir) {                                          // --cwd containment check
      let rel = relative(baseDir, proc.cwd);
      if (rel.split(/[/\\]/, 1)[0] === ".." || isAbsolute(rel)) continue;
    }
    out.push({
      pid: proc.pid,
      cwd: proc.cwd,
      kind: proc.kind === "bg" ? "background" : "interactive",
      startedAt: proc.startedAt,
      ...(proc.sessionId && { sessionId: proc.sessionId }),
      ...(proc.name && { name: proc.name }),
      ...(proc.status && { status: proc.status === "idle" ? "idle" : proc.status === "waiting" ? "waiting" : "busy" }),
    });
  }
  process.stdout.write(stringify(out, null, 2) + "\n");    // synchronous write
  recordTelemetry("cli_agents_json");
}

// Mapping: bBz->printAgentsJson_v156, H->cwdFilter, $->baseDir, q->out, K->proc, qSH->scanLiveProcesses,
//          F3->realpath, jK$->path, IH->stringify(JSON.stringify wrapper), SH->recordTelemetry
```

### 1.2 The single source — `qSH` (live PIDs only)

`qSH` (v2.1.156 @373239) reads the on-disk process registry, probes each pid for liveness, garbage-collects dead lock files, and returns only the survivors:

```javascript
// (v2.1.156 before-picture) cli_inner_pretty.js:373239-373251
async function qSH() {
  let H = await w74(),                                   // read process registry entries
    $ = H.map((z) => Av(z.pid)),                         // is pid alive?
    q = await Promise.all(H.map((z, A) => $[A] && JZ(z.pid, z.procStart))), // verify procStart matches
    K = n$() !== "wsl",
    _ = [];
  for (let z = 0; z < H.length; z++) {
    let { file: A, ...Y } = H[z];
    if (q[z]) _.push(Y);                                 // keep only confirmed-live procs
    else if (K && !$[z]) $SH.unlink(A).catch(() => {});  // GC dead lock file
  }
  return _;
}
```

The architectural limitation is right here: `qSH` is a **liveness scanner**. If a job has been dispatched but its worker process has not registered yet (a window of tens to hundreds of ms over the daemon RPC + fork), or if the job's worker has been *retired* because it finished its turn and is now waiting on the user (the four-state classifier's `blocked` state — see [`../../../claude_code_v_2.1.156/analyze/36_background_agents/bg_session_classifier.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/bg_session_classifier.md)), there is **no live process to scan**, so the job is invisible to `--json`. The on-disk job-state record (which persists across worker retirement) was never consulted.

### 1.3 The command def — `--json` only, no `--all`

The v2.1.156 commander chain declared one machine-readable flag and called the printer with a single argument:

```javascript
// (v2.1.156 before-picture) cli_inner_pretty.js:646306-646314
.option("--json", "Print live sessions as a JSON array and exit (for scripting; does not require a TTY)")
.action(async (z) => {
  if (z.json) {
    if ((await XgH(), !Ap())) { RMH("claude agents --json", void 0); return; }   // env guard
    let { printAgentsJson: A } = await Promise.resolve().then(() => (QT9(), FT9));
    (await A(z.cwd), Hj());                                                       // ← one arg: z.cwd
  }
  ...
}
```

Two before-picture facts to anchor the delta: the flag help reads **"Print live sessions"** (not "active sessions"), and the printer receives only `z.cwd` — there is no second `--all` argument because the flag does not exist.

---

## 2. The after-picture: v2.1.183 `aGf` — three-source merge

### 2.1 Top-level structure

```javascript
// ============================================
// printAgentsJson - merge live procs + disk job states + daemon shorts into one JSON array
// Location: cli_inner_pretty.js:691275-691332
// ============================================

// ORIGINAL (for source lookup):
async function aGf(e, t) {
  let n = e ? await UE(Lgt.resolve(e)) : void 0;
  function r(d) {
    if (!n) return !0;
    let p = Lgt.relative(n, d);
    return p.split(/[/\\]/, 1)[0] !== ".." && !Lgt.isAbsolute(p);
  }
  let [o, s, i] = await Promise.all([m4e(), QK(), zzn()]),
    a = new Map();
  for (let d of o) if (d.kind === "bg" && d.jobId) a.set(d.jobId, d);
  let l = new Set(i.shorts);
  for (let d of a.keys()) l.add(d);
  let c = [],
    u = new Set();
  for (let d of rDt(s, l)) {
    let p = a.get(d.id);
    if (p) u.add(p.pid);
    if (!r(Uwe(d.state))) continue;
    let f = lGf(d.state, p?.status);
    if (!t && !p && f !== "working" && f !== "blocked") continue;
    let m = vcc(p?.name ?? d.state.name ?? zc(d.state.intent));
    c.push({
      ...(p && { pid: p.pid }),
      id: d.id,
      cwd: p?.cwd ?? d.state.cwd,
      kind: "background",
      startedAt: p?.startedAt ?? Date.parse(d.state.createdAt),
      sessionId: p?.sessionId ?? d.state.sessionId,
      ...(m && { name: m }),
      ...(p?.status && { status: Tcc(p.status) }),
      ...(p?.status === "waiting" && p.waitingFor && { waitingFor: p.waitingFor }),
      state: f,
    });
  }
  for (let d of o) {
    if ((d.kind !== "interactive" && d.kind !== "bg") || u.has(d.pid)) continue;
    if (d.kind === "bg" && d.jobId) continue;
    if (!r(d.cwd)) continue;
    let p = d.name && vcc(d.name);
    c.push({
      pid: d.pid,
      cwd: d.cwd,
      kind: d.kind === "bg" ? "background" : "interactive",
      startedAt: d.startedAt,
      ...(d.sessionId && { sessionId: d.sessionId }),
      ...(p && { name: p }),
      ...(d.status && { status: Tcc(d.status) }),
      ...(d.status === "waiting" && d.waitingFor && { waitingFor: d.waitingFor }),
    });
  }
  (c.sort((d, p) => d.startedAt - p.startedAt), await APe(Re(c, null, 2) + `\n`), Le("cli_agents_json"));
}

// READABLE (for understanding):
async function printAgentsJson(cwdFilter, includeAll) {
  let baseDir = cwdFilter ? await realpath(resolve(cwdFilter)) : undefined;
  // --cwd containment test (same logic as v2.1.156, refactored into a closure)
  function withinCwd(dir) {
    if (!baseDir) return true;
    let rel = relative(baseDir, dir);
    return rel.split(/[/\\]/, 1)[0] !== ".." && !isAbsolute(rel);
  }

  // THREE SOURCES, fetched in parallel:
  let [liveProcs, diskStates, roster] = await Promise.all([
    scanLiveProcesses(),   // m4e: live PIDs (same scanner as v2.1.156 qSH)
    readAllJobStates(),    // QK:  on-disk state.json records, survive worker retirement
    listDaemonShorts(),    // zzn: daemon's roster of known short ids ({ shorts, records })
  ]);

  // index live bg procs by their persistent jobId
  let liveByJobId = new Map();
  for (let proc of liveProcs) if (proc.kind === "bg" && proc.jobId) liveByJobId.set(proc.jobId, proc);

  // "known short" set = daemon roster ∪ live-proc job ids (so a freshly-dispatched job
  // whose state.json may not be persisted yet is still treated as live → not failed-out)
  let knownShorts = new Set(roster.shorts);
  for (let id of liveByJobId.keys()) knownShorts.add(id);

  let out = [];
  let consumedPids = new Set();

  // PASS 1: every on-disk job state (reconciled by rDt against knownShorts)
  for (let entry of reconcileStaleStates(diskStates, knownShorts)) {
    let proc = liveByJobId.get(entry.id);          // matching live process, if any
    if (proc) consumedPids.add(proc.pid);          // so PASS 2 doesn't re-emit it
    if (!withinCwd(originCwdOf(entry.state))) continue;   // Uwe: the job's *origin* cwd
    let state = mapJobState(entry.state, proc?.status);   // lGf → working/blocked/done/failed/stopped
    // DEFAULT (no --all): skip terminal/idle jobs unless they are actively working or blocked
    if (!includeAll && !proc && state !== "working" && state !== "blocked") continue;
    let name = sanitize(proc?.name ?? entry.state.name ?? redactSecrets(entry.state.intent));
    out.push({
      ...(proc && { pid: proc.pid }),               // pid present only when a live proc exists
      id: entry.id,                                 // NEW: stable on-disk id
      cwd: proc?.cwd ?? entry.state.cwd,
      kind: "background",
      startedAt: proc?.startedAt ?? Date.parse(entry.state.createdAt),
      sessionId: proc?.sessionId ?? entry.state.sessionId,
      ...(name && { name }),
      ...(proc?.status && { status: normalizeStatus(proc.status) }),
      ...(proc?.status === "waiting" && proc.waitingFor && { waitingFor: proc.waitingFor }), // NEW
      state,                                        // NEW: derived lifecycle state
    });
  }

  // PASS 2: live procs that had NO on-disk state (interactive sessions, or bg with no jobId)
  for (let proc of liveProcs) {
    if ((proc.kind !== "interactive" && proc.kind !== "bg") || consumedPids.has(proc.pid)) continue;
    if (proc.kind === "bg" && proc.jobId) continue; // a bg job *with* a jobId was already handled in PASS 1
    if (!withinCwd(proc.cwd)) continue;
    let name = proc.name && sanitize(proc.name);
    out.push({
      pid: proc.pid, cwd: proc.cwd,
      kind: proc.kind === "bg" ? "background" : "interactive",
      startedAt: proc.startedAt,
      ...(proc.sessionId && { sessionId: proc.sessionId }),
      ...(name && { name }),
      ...(proc.status && { status: normalizeStatus(proc.status) }),
      ...(proc.status === "waiting" && proc.waitingFor && { waitingFor: proc.waitingFor }),
    });
  }

  out.sort((a, b) => a.startedAt - b.startedAt);     // stable chronological order
  await writeStdoutAsync(stringify(out, null, 2) + "\n");  // NOTE: async write now
  recordTelemetry("cli_agents_json");
}

// Mapping: aGf->printAgentsJson, e->cwdFilter, t->includeAll, n->baseDir, r->withinCwd,
//          o->liveProcs, s->diskStates, i->roster, a->liveByJobId, l->knownShorts, c->out, u->consumedPids,
//          d->entry/proc, p->proc, f->state, m->name,
//          m4e->scanLiveProcesses, QK->readAllJobStates, zzn->listDaemonShorts,
//          rDt->reconcileStaleStates, Uwe->originCwdOf, lGf->mapJobState, vcc->sanitize,
//          zc->redactSecrets, Tcc->normalizeStatus, Re->stringify, APe->writeStdoutAsync, Le->recordTelemetry, UE->realpath
```

### 2.2 The three sources

- `scanLiveProcesses` (obfuscated: `m4e`, `cli_inner_pretty.js:360113`) — the live-PID scanner. **Byte-identical** to v2.1.156 `qSH` (read `bAp`/`m4e` body @360113-360124 vs `qSH` @373239-373251 — same `w74`/`MLa` registry read, same liveness + `procStart` probe, same dead-lock-file GC, returns the same `{ pid, kind, cwd, startedAt, sessionId, name, status, jobId, procStart }` shape). This is the *only* source `bBz` had.
- `readAllJobStates` (obfuscated: `QK`, `cli_inner_pretty.js:192363`) — reads every `state.json` under the bg-jobs directory `wL()`, returns `{ id, state }` records, and marks `pinned` jobs from `UFe()`. These records **persist across worker retirement**, so they cover exactly the gap `bBz` had: a dispatched-but-not-yet-live job and a retired-but-blocked job both still have a `state.json` on disk.
- `listDaemonShorts` (obfuscated: `zzn`, `cli_inner_pretty.js:564518`) — asks the daemon over its RPC socket (`Mb({ proto, op: "list" })`) for its roster of `shorts` (short ids of known jobs) plus uncompleted `records`; falls back to a registry scan if the daemon is down. Only `i.shorts` is consumed by `aGf` — it is used to compute the "known/live" set that `rDt` uses to decide whether a stale on-disk state should be auto-failed (see §3).

### 2.3 Why a two-pass merge keyed on jobId

**What it does.** PASS 1 walks the *on-disk job states* (the persistent source of truth for bg jobs) and, for each, looks up a matching live process by `jobId`; PASS 2 then mops up live processes that had no on-disk state (every interactive session, and any bg proc lacking a `jobId`).

**How it works.**
1. Live bg procs are indexed `liveByJobId = jobId → proc` (@691284). The index key is the **persistent** `jobId`, not the volatile `pid`.
2. PASS 1 iterates `reconcileStaleStates(diskStates, knownShorts)` (@691289). For each on-disk `entry`, it finds `proc = liveByJobId.get(entry.id)`. If a proc exists, its pid is added to `consumedPids` (@691291) — this is the de-dup mechanism that stops PASS 2 from emitting the same job twice.
3. The emitted object **prefers live-proc fields when present, falls back to disk-state fields otherwise** (`p?.cwd ?? d.state.cwd`, `p?.startedAt ?? Date.parse(d.state.createdAt)`, `p?.sessionId ?? d.state.sessionId`). So a job with a live worker reports the worker's runtime values; a job whose worker is gone still reports its last-known disk values.
4. PASS 2 (@691309) emits interactive sessions and `jobId`-less bg procs, skipping anything already consumed (`u.has(d.pid)`) and anything that *is* a bg job with a jobId (`d.kind === "bg" && d.jobId` → already in PASS 1).

**Why this approach (vs the v2.1.156 single live-proc pass).** The on-disk record is the only artefact that survives a worker's retire/respawn lifecycle (documented in [`worker_retire_respawn_2156.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/worker_retire_respawn_2156.md)). Making the *disk state* the primary loop and the *live proc* the enrichment guarantees that a job is reported as long as its `state.json` exists — even with no worker — which is precisely the class of jobs (`blocked`, just-dispatched) that `bBz` dropped. Keying the join on `jobId` rather than `pid` is what makes "same logical job, different worker process across a respawn" collapse to one entry instead of churning.

**Key insight.** The merge inverts the v2.1.156 priority. v2.1.156 asked *"which processes are alive?"* and reported those. v2.1.183 asks *"which jobs exist on disk?"*, then decorates each with its live process if one happens to be running. The job, not the process, is now the unit of the report — which is why a job can appear with no `pid` field at all.

---

## 3. Stale-state reconciliation — `reconcileStaleStates` (`rDt`)

`aGf` does not iterate the raw disk states; it pipes them through `rDt` first, which auto-transitions states that have gone stale.

```javascript
// ============================================
// reconcileStaleStates - auto-fail/auto-block on-disk states with no live worker past a grace window
// Location: cli_inner_pretty.js:192384-192404
// ============================================

// ORIGINAL (for source lookup):
function rDt(e, t) {
  let n = Date.now();
  return e.map((r) => {
    if (ph(r.state)) return r;                               // already terminal → leave alone
    if (t.has(r.id)) return r;                               // still known/live → leave alone
    if (n - Date.parse(r.state.createdAt) < RAd) return r;   // within grace window → leave alone
    return { ...r, state: $Ad(r.state) };                    // stale & gone → mark failed/blocked
  });
}
function $Ad(e) {
  if (e.state === "blocked" && !Fwe(e)) return { ...e, tempo: "blocked", inFlight: void 0 };
  return { ...e, state: "failed", tempo: "idle", needs: void 0, block: void 0, inFlight: void 0,
           detail: e.detail.replace(/; respawning$/, "") };
}

// READABLE (for understanding):
function reconcileStaleStates(diskStates, knownShorts) {
  let now = Date.now();
  return diskStates.map((entry) => {
    if (isTerminal(entry.state)) return entry;                          // ph: done/failed/stopped+idle
    if (knownShorts.has(entry.id)) return entry;                       // daemon/live still tracks it
    if (now - Date.parse(entry.state.createdAt) < STALE_GRACE_MS) return entry; // RAd grace
    return { ...entry, state: forceTerminal(entry.state) };            // $Ad
  });
}
function forceTerminal(state) {
  // a non-exec job stuck in "blocked" with no worker → keep it blocked (it's waiting on the user)
  if (state.state === "blocked" && !isExecWithoutRespawn(state)) return { ...state, tempo: "blocked", inFlight: undefined };
  // otherwise → it crashed/vanished → failed
  return { ...state, state: "failed", tempo: "idle", needs: undefined, block: undefined, inFlight: undefined,
           detail: state.detail.replace(/; respawning$/, "") };
}

// Mapping: rDt->reconcileStaleStates, $Ad->forceTerminal, e->diskStates/state, t->knownShorts, r->entry,
//          n->now, RAd->STALE_GRACE_MS, ph->isTerminal, Fwe->isExecWithoutRespawn
```

**What it does.** Decides, per on-disk state, whether a job that *claims* to be running but has no live worker and is not tracked by the daemon should be force-terminated (so `--json` doesn't report a long-dead crash as `working`).

**How it works.** Four guards, short-circuit in order: (1) already terminal (`ph` → `Gk(state)` true and `tempo !== "active"`) — leave it; (2) the daemon roster or a live proc still knows this id (`knownShorts.has(entry.id)`) — leave it; (3) created less than `RAd` ago (the grace window, to avoid racing a just-dispatched job before its worker registers) — leave it; (4) otherwise it is stale and untracked → `$Ad` flips it to `blocked` (if it was a non-exec job blocked on the user) or `failed`.

**Why it matters for `--json`.** This is the missing half of the "Working forever" class of bugs (open question §6 of the [scout dossier]). Without `rDt`, a job whose worker crashed would keep its last persisted `state:"working"` forever and `lGf` would map it to `"working"` in the JSON. `rDt` is what turns "no worker + grace elapsed + not in roster" into a terminal `failed`/`blocked`, so `lGf` can then report `done`/`failed`/`blocked` rather than a permanent `working`. (This is a *contributing* mechanism; the dossier could not pin the 2.1.178 "Working forever" fix to a single line — carried honestly as low-confidence-on-exact-site.)

---

## 4. The state mapper — `lGf` (working/blocked/done/failed/stopped)

The headline new field. v2.1.156 had no such mapper; `bBz` emitted only the live-proc `status` (`idle`/`waiting`/`busy`). v2.1.183 derives a *lifecycle* `state` from the reconciled disk state plus the live-proc status.

```javascript
// ============================================
// mapJobState - derive the JSON `state` (working|blocked|done|failed|stopped) from disk state + live status
// Location: cli_inner_pretty.js:691342-691348
// ============================================

// ORIGINAL (for source lookup):
function lGf(e, t) {
  if (t === "busy") return "working";
  let n = Bie(e.state);
  if (ph(e) && !(n === "success" && jFe(e))) return n === "success" ? "done" : n === "failure" ? "failed" : "stopped";
  if (e.tempo === "blocked" || t === "waiting") return "blocked";
  return "working";
}

// READABLE (for understanding):
function mapJobState(jobState, liveStatus) {
  // 1. A live worker actively executing a turn always reads as "working"
  if (liveStatus === "busy") return "working";

  // 2. Terminal classification of the persisted state ("done"->success, "failed"->failure, "stopped"->stopped, else null)
  let terminalKind = classifyTerminal(jobState.state);   // Bie

  // 3. If the job is in a terminal-AND-settled state (ph), emit the terminal label —
  //    UNLESS it's a "success" that is also a recurring/cron/loop job (jFe), which keeps cycling → not "done"
  if (isTerminal(jobState) && !(terminalKind === "success" && isRecurring(jobState))) {
    return terminalKind === "success" ? "done"
         : terminalKind === "failure" ? "failed"
         : "stopped";
  }

  // 4. Blocked: either the persisted tempo says blocked, or the live worker is parked waiting on input
  if (jobState.tempo === "blocked" || liveStatus === "waiting") return "blocked";

  // 5. Default: still working
  return "working";
}

// Mapping: lGf->mapJobState, e->jobState, t->liveStatus, n->terminalKind,
//          Bie->classifyTerminal, ph->isTerminal, jFe->isRecurring
```

The three predicates this leans on (all read in the bundle):

```javascript
// cli_inner_pretty.js:192481-192492, 192504-192506
function Bie(e) {                          // classifyTerminal
  if (e === "done") return "success";
  if (e === "failed") return "failure";
  if (e === "stopped") return "stopped";
  return null;                             // "working"/"blocked" → not terminal
}
function ph(e) {                           // isTerminal: terminal label AND settled (tempo no longer active)
  return Gk(e.state) && e.tempo !== "active"; // Gk = Bie(state) !== null
}
function jFe(e) {                          // isRecurring: routine OR cron-inflight OR /loop
  return e.routine !== void 0 || (e.inFlight?.kinds.includes("session_cron") ?? !1) || oDt(e);
}
```

### 4.1 Deep analysis of the precedence ladder

**What it does.** Collapses the rich internal job model (the four-state classifier's `state` ∈ {working, blocked, done, failed}, an orthogonal `tempo` ∈ {active, idle, blocked}, plus the live worker's transport status ∈ {busy, idle, waiting}) into one of five flat strings for the JSON consumer.

**How it works — why the order is exactly this.**
1. **`busy` wins first.** If a live worker is mid-turn (`liveStatus === "busy"`), the job is unambiguously `working` regardless of what the (possibly stale) persisted `state` says. This guards against reporting a job that *was* `blocked` last turn but has since been resumed and is now executing.
2. **Terminal-and-settled next, with a recurring-job exception.** `ph(jobState)` is true only when the persisted `state` is a terminal label *and* `tempo !== "active"` (the turn has actually settled, not just transiently flagged). The exception `!(terminalKind === "success" && jFe(...))` is the clever part: a **recurring** job (a `routine`, a `session_cron` inflight, or a `/loop`) that just finished one cycle has `state:"done"` momentarily, but it will respawn and run again — reporting it as `done` would be wrong for a script polling a never-ending loop. So a *successful recurring* job is excluded from the terminal branch and falls through to step 4/5 (it reads as `working`, because the loop continues). A recurring job that *failed* or was *stopped* still reports its terminal label (the `terminalKind === "success"` guard only spares success).
3. **`blocked` is third.** A job blocked on the user (`jobState.tempo === "blocked"`) or a live worker parked waiting for input (`liveStatus === "waiting"`) reads as `blocked` — this is the state that drives the phone push notification (see classifier baseline) and the one a script most wants to surface.
4. **`working` is the default.** Anything not terminal and not blocked is still in flight.

**Why this approach (trade-offs).** The mapper deliberately merges two independent axes (the *classifier* lifecycle state and the *transport* status) so that a single `state` field answers the one question a `--json` consumer actually has: "is this job done, stuck, or running?" The alternative — exposing the raw `{state, tempo, status}` triple — would push the merge logic onto every script author and re-create the same ambiguities the classifier was built to resolve. The recurring-job exception is the only place the model leaks complexity, and it leaks for a real reason: a `/loop`/cron job has no meaningful "done."

**Key insight.** `status` (the live-proc transport state, normalized by `Tcc` to `idle`/`waiting`/`busy`) and `state` (the lifecycle, from `lGf`) are **both** present in the v2.1.183 output and they are **not** the same thing — `status` is "what is the worker process doing right now," `state` is "where is the job in its lifecycle." v2.1.156 had only `status`; that conflation is exactly why a retired-but-blocked job (no process → no `status`) was invisible.

---

## 5. The `--all` flag and the default filter

### 5.1 The filter line

The single line that `--all` controls (@691294):

```javascript
if (!t && !p && f !== "working" && f !== "blocked") continue;
//   ^^^ !includeAll   ^^^ no live proc   ^^^ state is terminal/idle  → SKIP
```

**What it does.** In the default mode (`--json` without `--all`), an on-disk job is dropped from the output when **all** of: `--all` is off, there is **no** live process for it, and its derived `state` is neither `working` nor `blocked` (i.e. it is `done`/`failed`/`stopped`). With `--all`, the guard is bypassed and every on-disk job — including completed ones — is emitted.

**How it works / why these exact conjuncts.** A job is *kept by default* if it is interesting to a live monitor: it has a running worker (`p` truthy), or it is actively `working`, or it is `blocked` and needs attention. It is *dropped by default* only when it is both process-less and terminal — i.e. finished history that a live dashboard does not want. `--all` is the escape hatch for "give me the full agent-view list" (the flag's own help text, @695321: *"With --json: include completed sessions (the full agent view list)"*).

**Why this approach.** The 2.1.169 fix had to thread a needle: surface just-dispatched/blocked jobs (the bug) **without** flooding the default output with every historical completed session (which the on-disk store accumulates). Making the default "running + working + blocked" and gating "everything" behind `--all` keeps the common `claude agents --json` call a *live* view (matching the renamed flag help, "active sessions") while giving scripts that want the full ledger an explicit opt-in. Note `working`/`blocked` are kept *even without a live process* — that is the literal fix for "blocked-but-retired job is invisible."

### 5.2 The command def and handler wiring

```javascript
// ============================================
// agents command def + handler - wire --all through to printAgentsJson
// Location: cli_inner_pretty.js:695320-695325 (def), 691363-691371 (handler)
// ============================================

// ORIGINAL (for source lookup):
.option("--json", "Print active sessions as a JSON array and exit (for scripting; does not require a TTY)")
.option("--all", "With --json: include completed sessions (the full agent view list)")
.action(async (i) => {
  let { agentsCommandHandler: a } = await Promise.resolve().then(() => (Lcc(), kcc));
  await a(i);
}),
// ... handler:
async function cGf(e) {
  if (e.json) {
    if ((await mQe(), !FM())) { mTe("claude agents --json", void 0); return; }
    let { printAgentsJson: t } = await Promise.resolve().then(() => (Ccc(), wcc));
    (await t(e.cwd, e.all === !0), v0());     // ← TWO args now: cwd + all
  }
  if (process.stdout.isTTY) { /* FleetView TUI path (carryover) */ }
}

// READABLE (for understanding):
.option("--json", "Print active sessions as a JSON array and exit (for scripting; does not require a TTY)")
.option("--all", "With --json: include completed sessions (the full agent view list)")
.action(async (opts) => {
  let { agentsCommandHandler } = await import("./agents-command");
  await agentsCommandHandler(opts);
});
async function agentsCommandHandler(opts) {
  if (opts.json) {
    await ensureSettingsLoaded();                         // mQe (was XgH)
    if (!backgroundAgentsAvailable()) {                   // FM = !pQe() (was Ap)
      printUnavailableAndExit("claude agents --json");    // mTe (was RMH)
      return;
    }
    let { printAgentsJson } = await import("./print-agents-json");
    await printAgentsJson(opts.cwd, opts.all === true);   // ← cwd + all
    flushTelemetry();
  }
  if (process.stdout.isTTY) { /* FleetView TUI (unchanged) */ }
}

// Mapping: cGf->agentsCommandHandler, e->opts, mQe->ensureSettingsLoaded, FM->backgroundAgentsAvailable,
//          mTe->printUnavailableAndExit, t->printAgentsJson, v0->flushTelemetry
```

**Delta vs v2.1.156:** two changes in this wiring. (1) the `--json` help text changed from **"Print live sessions"** (v2.1.156 @646306) to **"Print active sessions"** (v2.1.183 @695320) — wording reflecting that the output is no longer literally a list of live processes; (2) the printer is now called with a **second argument** `e.all === !0` (v2.1.156 called `A(z.cwd)` with one arg). The env guard wrapper (`mQe`/`FM`/`mTe`) is **carryover** — same shape as v2.1.156 `XgH`/`Ap`/`RMH`, just re-mangled.

---

## 6. Field-level before/after summary

| JSON field | v2.1.156 `bBz` | v2.1.183 `aGf` | Note |
|---|---|---|---|
| `pid` | always | **only when a live proc exists** | a process-less disk-state job has no `pid` |
| `id` | — | **NEW**: on-disk job id (stable across respawn) | the new primary key |
| `cwd` | live-proc cwd | live-proc cwd, else disk `state.cwd` | |
| `kind` | `background`/`interactive` | same | PASS-1 entries are always `background` |
| `startedAt` | live-proc startedAt | live-proc, else `Date.parse(createdAt)` | |
| `sessionId` | live-proc, if present | live-proc, else disk `state.sessionId` | |
| `name` | live-proc name | sanitized (`vcc`) proc/disk name, secret-redacted (`zc`) intent | name now sanitized/redacted |
| `status` | `idle`/`waiting`/`busy` | same, via `Tcc` | transport status (live proc only) |
| `waitingFor` | — | **NEW**: when `status === "waiting"` and `waitingFor` set | what the worker is parked on |
| `state` | — | **NEW**: `working`/`blocked`/`done`/`failed`/`stopped` via `lGf` | the lifecycle label |
| (sources) | `qSH()` live procs only | `m4e()` + `QK()` + `zzn()` merged | the core fix |
| (sort) | registry order | sorted by `startedAt` asc | deterministic output |
| (write) | sync `process.stdout.write` | async `APe` (awaited) | avoids truncation on large output |

Two smaller, genuinely-new behaviours worth flagging for a verifier: **name sanitization** — v2.1.183 runs every name through `vcc` (`cli_inner_pretty.js:691333`, strips control chars + collapses whitespace) and the *intent*-derived fallback name through `zc` (secret redaction), whereas `bBz` emitted `K.name` raw; and the **async stdout write** `APe` (@565717, awaited) replacing v2.1.156's synchronous `process.stdout.write` — both are defensive output hygiene that rode along with the rework.

---

## 7. Carried-over caveats / open questions (from the scout dossier)

- **"Working forever" (2.1.178).** §3 (`rDt` auto-failing stale states) and §4.1 (`lGf` deriving terminal labels from settled states) are the two mechanisms most plausibly responsible, but the dossier could **not pin the fix to a single patch line** — carry as **low confidence on exact site**. What *is* high-confidence: in v2.1.156, with no `state` field and no `rDt`/`lGf` pipeline, a crashed bg worker's last persisted `working` had no path to become terminal in the `--json` view at all.
- **`--bg -cn <name>` name-not-seeding (2.1.176).** Out of scope for this doc (it lives in the `--bg` arg-parse / dispatch path, not the `--json` printer). The name-sanitization noted in §6 is unrelated.
- **`jFe` recurring-job detection** depends on `e.inFlight?.kinds.includes("session_cron")` and `e.routine` — the same `session_cron`/`routine` markers the daemon retire/respawn path keys on. (Those `retireIfSettled` cron/routine guards are **carryover** from v2.1.156, not a v2.1.183 addition — see [README §5](./README.md) / `bg_command_surface_and_retire_delta.md` §B.0; the cron/routine subsystem was already integrated with eviction in v2.1.156.) The lifecycle-level integration is documented in the [README §5](./README.md); this doc only consumes those markers via `jFe`.

---

## Related Symbols

> Symbol mappings (canonical tables live ONLY in the overview files, never in this module doc):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Agent Loop, Tools, LLM API, Agents, Subagent, State)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (Background Agents, Plan, Todo, Compact, Hooks, Skills)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infrastructure (MCP, Permissions, Sandbox, Auth, Model)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integration infrastructure (LSP, Chrome, IDE, UI, Plugin)
> - [../00_overview/symbol_additions_v2_1_183_background_agents.md](../00_overview/symbol_additions_v2_1_183_background_agents.md) — per-feature v2.1.183 additions for Background Agents

Key functions in this document (v2.1.183 names; `name` (obfuscated, line) — desc):

- `printAgentsJson` (obfuscated: `aGf`, `cli_inner_pretty.js:691275`) — three-source merge (`m4e`+`QK`+`zzn`) two-pass JSON builder; adds `id`/`state`/`waitingFor`; honors `--all`.
- `mapJobState` (obfuscated: `lGf`, `cli_inner_pretty.js:691342`) — derives `working`/`blocked`/`done`/`failed`/`stopped` from disk state + live status, with the recurring-job (`jFe`) success exception.
- `agentsCommandHandler` (obfuscated: `cGf`, `cli_inner_pretty.js:691363`) — wires `--json` + `--all` through to `printAgentsJson`; env guard via `mQe`/`FM`/`mTe`.
- `reconcileStaleStates` (obfuscated: `rDt`, `cli_inner_pretty.js:192384`) — auto-fails/auto-blocks stale process-less on-disk states past the grace window.
- `readAllJobStates` (obfuscated: `QK`, `cli_inner_pretty.js:192363`) — reads every on-disk `state.json` record (the persistent source surviving worker retirement).
- `scanLiveProcesses` (obfuscated: `m4e`, `cli_inner_pretty.js:360113`) — live-PID scanner (byte-identical to v2.1.156 `qSH`).
- `listDaemonShorts` (obfuscated: `zzn`, `cli_inner_pretty.js:564518`) — daemon roster of known short ids (`{ shorts, records }`).
- `classifyTerminal` (obfuscated: `Bie`, `cli_inner_pretty.js:192481`) / `isTerminal` (obfuscated: `ph`, `cli_inner_pretty.js:192490`) / `isRecurring` (obfuscated: `jFe`, `cli_inner_pretty.js:192504`) — the `lGf` predicates.
- `sanitize` (obfuscated: `vcc`, `cli_inner_pretty.js:691333`) / `normalizeStatus` (obfuscated: `Tcc`, `cli_inner_pretty.js:691339`) — output hygiene helpers.
- `originCwdOf` (obfuscated: `Uwe`, `cli_inner_pretty.js:192496`) — resolves a job's origin cwd (de-worktree) for the `--cwd` containment test.
- v2.1.156 before-picture: `printAgentsJson` (obfuscated: `bBz`, `cli_inner_pretty.js:642728`) — live-proc-only printer; `qSH` (`cli_inner_pretty.js:373239`) — its sole source; command def @`cli_inner_pretty.js:646279` (no `--all`).
