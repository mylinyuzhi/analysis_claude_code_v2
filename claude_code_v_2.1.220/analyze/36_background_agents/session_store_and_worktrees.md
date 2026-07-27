# Background agents part 1 — the roster, the session store, worktree locks, and env inheritance

> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (872,596 lines, `VERSION 2.1.220`, `build_sha 4073f595`).
> Every bare `cli_inner_pretty.js:<line>` is a **2.1.220** line I read; baseline lines are tagged
> `(193)`. Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md). Ledger: [`README.md`](./README.md).

---

## 0. Two stores, not one

| Store | Path | Owner | Schema | Purpose |
|---|---|---|---|---|
| **roster** | `<config>/…/roster.json` | the daemon, exclusively | `rosterFileSchema` (`mks`) `:330126` | which worker processes exist, their pids, sockets, auth tokens |
| **session state** | `<config>/jobs/<short>/state.json` | the *worker* writes, everyone reads | `Aad()` (referenced `:330541`) | what the session is doing: state, tempo, needs, intent, worktree, fork lineage |

The split is the reason this subsystem survives daemon restarts at all: the roster is
reconstructible (from live processes) but the session state is not, so they have completely
different durability rules. Sidecar files (`order`, `stateOrder`, `group`, `pinned`) hold
view-only data next to `state.json` so that a UI reorder never rewrites the state document
(`:330494-330496`, stripped on write at `:330465`).

---

## 1. THE central delta of this window: unknown-field preservation

Four separate changelog bullets — `.195` #7, `.200` #8, `.214` #28, `.216` #14 — are symptoms of
one root cause: **a build that did not know a field deleted it on rewrite.** 2.1.220 fixes it in
both stores, and the fix has four interlocking parts.

### 1.1 The roster schema went from strict to loose

```javascript
// 2.1.220  :330106-330125                       // 2.1.193  :486136-486155
fks = Se(() =>                                   // tmf = Ce(() =>
  v.looseObject({                                //   A.object({
    pid: v.number(),                             //     pid: A.number(),
    procStart: v.string().optional(),            //     procStart: A.string().optional(),
    …                                            //     …
    rvAuth: v.string().optional(),               //     rvAuth: A.string().optional(),
    ptyAuth: v.string().optional(),              //     ptyAuth: A.string().optional(),
  }),                                            //   }),
);                                               // );

// 2.1.220  :330126-330133                       // 2.1.193  :486156-486163
mks = Se(() =>                                   // Cvl = Ce(() =>
  v.looseObject({                                //   A.object({
    proto: v.number().int().min($dr).max(Um),    //     proto: A.number().int().min(Y6t).max(np),
    supervisorPid: v.number().catch(0),          //     supervisorPid: A.number(),
    updatedAt: v.number().catch(0),              //     updatedAt: A.number(),
    workers: v.record(v.string().regex(eIe), fks()),
  }),
);
```

`looseObject` is **220=22 / 193=11** across the bundle. Two changes in four lines:

- **`object` → `looseObject`**: unknown keys survive the parse instead of being stripped.
- **`.catch(0)` on the two stamp fields**: a corrupted `supervisorPid` or `updatedAt` no longer
  fails the *entire* roster parse.

### 1.2 The consequence of the old behaviour, stated by the code itself

The worker-adoption path contains a message that only makes sense as a description of the
2.1.193 schema (`:554065-554073`, **`schema-skewed daemon stripped them` 220=1 / 193=0**):

> `[bg] adopt <short>: roster rvAuth/ptyAuth missing for token-era worker — schema-skewed daemon
> stripped them`

A row that has a `cliVersion` *and* a `ptySock` (therefore written by a build that had socket
tokens) but no `rvAuth`/`ptyAuth` can only be explained by an intermediate daemon that parsed the
roster with a narrower schema and rewrote it. That is precisely `A.object`. The recovery is an
immediate `rekeyForAuthMismatch("missing-at-adopt")`.

`.200` #8 lists three items — *"corruption disabling orphan cleanup; field preservation; socket
auth tokens"* — and all three are this one change plus its `.catch(0)` sibling.

### 1.3 Preservation is a round trip, not just a parse flag

`looseObject` alone would keep unknown keys inside the parsed object, but `rosterEntry()`
rebuilds the row from scratch from the handle, so the keys would still be lost. Hence:

```javascript
// ============================================
// extractUnknownRosterFields - capture roster keys this build does not declare
// Location: cli_inner_pretty.js:330031-330036
// ============================================

// ORIGINAL (for source lookup):
function dwo(e) {
  let t = fks().shape, r = {};
  for (let [n, o] of Object.entries(e)) if (!(n in t)) r[n] = o;
  return r;
}

// READABLE (for understanding):
function extractUnknownRosterFields(rosterRow) {
  const declared = workerRecordSchema().shape;      // the field names THIS build knows
  const extras = {};
  for (const [key, value] of Object.entries(rosterRow))
    if (!(key in declared)) extras[key] = value;    // everything else is a newer build's field
  return extras;
}

// Mapping: dwo→extractUnknownRosterFields, fks→workerRecordSchema, e→rosterRow, r→extras
```

`rosterExtras` is **220=4 / 193=0**. It is populated at both adoption sites (`:554002` in `adopt`,
`:554089` in `unverified`) and re-emitted **first** in `rosterEntry()`:

```javascript
rosterEntry() {                       // :554195-554215
  return {
    ...this.rosterExtras,             // <- unknown fields from a newer build, restored
    pid: this.record.pid,             // <- everything this build owns overrides them
    procStart: this.procStart,
    …
  };
}
```

Spreading extras **first** is the whole correctness argument: a field this build declares always
wins, so a newer build's *value* for a field we also own cannot poison us — only fields we have
never heard of come through untouched.

**This is `.195` #7** (*"Background jobs disappearing from `claude agents` when written by a newer
version"*): the newer build wrote `workers[short].someNewField`; the older build stripped it; on
the next handover the newer build read its own row back without the field it needed to recognise
the job, and the job vanished from the list.

### 1.4 The same fix, independently, for `state.json`

`readJobState` (`Da`, `:330492-330573`) does not use `looseObject` — the state schema has
transforms and defaults, so it re-implements preservation by hand (`:330550-330557`):

```javascript
// ============================================
// readJobState - unknown-field preservation for the per-session state document
// Location: cli_inner_pretty.js:330540-330560
// ============================================

// ORIGINAL (for source lookup):
p = Ut(l), f = Aad().safeParse(p);
if (!f.success) return (w(`[jobs] skipping ${mA.basename(e)}: state.json schema validation failed — ${f.error.message}`, { level: "warn" }), nIe.set(e, { mtimeKey: i, state: null }), null);
let m = c !== null ? Number(c) : void 0,
  g = u !== null ? Number(u) : void 0,
  y = Aad().in.shape,
  _ = p !== null && typeof p === "object" ? Object.entries(p).filter(([A]) => !Object.hasOwn(y, A)) : [],
  E = { ...Object.fromEntries(_), ...f.data };
if (Number.isFinite(m)) E = { ...E, sortOrder: m };
if (Number.isFinite(g)) E = { ...E, stateSortOrder: g };
if (d !== null && d.trim()) E = { ...E, group: d.trim() };
if (E.group !== void 0) E = { ...E, group: bks(E.group) };
if (nIe.size > 1000) nIe.clear();
return (nIe.set(e, { mtimeKey: i, state: E }), Lpt.delete(e), E);

// READABLE (for understanding):
const raw = parseJson(stateText);
const parsed = jobStateSchema().safeParse(raw);
if (!parsed.success) { warn(`[jobs] skipping <dir>: state.json schema validation failed — …`);
                       stateCache.set(dir, { mtimeKey, state: null }); return null; }
const orderNum      = orderText      !== null ? Number(orderText)      : undefined;
const stateOrderNum = stateOrderText !== null ? Number(stateOrderText) : undefined;
const declared = jobStateSchema().in.shape;                        // pre-transform shape
const unknownEntries = (raw && typeof raw === "object")
  ? Object.entries(raw).filter(([k]) => !Object.hasOwn(declared, k))
  : [];
let state = { ...Object.fromEntries(unknownEntries), ...parsed.data };   // extras first, parsed wins
if (Number.isFinite(orderNum))      state = { ...state, sortOrder: orderNum };
if (Number.isFinite(stateOrderNum)) state = { ...state, stateSortOrder: stateOrderNum };
if (groupText !== null && groupText.trim()) state = { ...state, group: groupText.trim() };
if (state.group !== undefined)      state = { ...state, group: normalizeGroup(state.group) };
if (stateCache.size > 1000) stateCache.clear();
stateCache.set(dir, { mtimeKey, state });
return state;

// Mapping: Da→readJobState, Aad→jobStateSchema, nIe→stateCache, Lpt→transientErrorSeen,
//          p→raw, f→parsed, y→declared, _→unknownEntries, E→state, bks→normalizeGroup
```

Both anchors are **220=1 / 193=0**: `.in.shape` and `Object.hasOwn(y, A)`. 2.1.193's equivalent
line is simply `f = u.data` (`:193409 (193)`).

**Why `.in.shape` and not `.shape`?** The state schema applies transforms (path normalisation,
enum coercion). `.shape` on a transformed schema is the *output* shape; `.in.shape` is the input
shape, i.e. the set of keys the schema will actually consume from the JSON. Filtering against the
output shape would misclassify any key whose name the transform changes.

The write side (`writeJobState`, `um`, `:330462-330472`) serialises the whole object minus the
four sidecar-backed keys, so the preserved extras round-trip:

```javascript
let { pinned: o, sortOrder: i, stateSortOrder: s, group: a, ...l } = n;
Aks++;
try { await sp(mA.join(e, wks), Ie(l, null, 2), 384); } finally { (Aks--, BE(e)); }
```

`Aks` is an in-flight write counter (exposed as `Had()`, `:330459-330461`) used elsewhere to avoid
reading a state file mid-write, and `BE(e)` invalidates the read cache in a `finally` so a failed
write cannot leave a stale cached value.

### 1.5 The defensive pairing `looseObject` forced

`looseObject` created a new hazard: `readRoster` returns `{ ...emptyRoster(), parseFailed: true }`
in five failure branches (`:330234`, `:330243`, `:330251`, `:330279`). With a loose schema that
in-memory marker could be written back and then *parsed back in* as a legitimate field, making the
roster permanently "failed". So 2.1.220 strips it on both sides:

```javascript
if (r.success) { delete r.data.parseFailed; … }             // :330253-330254  (read)
async function cMy(e) { let { parseFailed: t, ...r } = e; … } // :330294-330295  (write)
```

2.1.193's writer (`Jbf`, `:502557-502560 (193)`) had no such destructure — it did not need one,
because its strict schema would have dropped the key anyway. This is a good example of a
correctness fix creating a new invariant that has to be maintained in two places.

### 1.6 Corruption handling, and what is carryover

`readRoster` (`v6`, `:330213-330280`) is a long function and **most of it is carryover.** The
`lstat` + `isFile` + `size > lMy (8 MiB, :330318)` check, the `E2BIG`/`EFTYPE` telemetry, the
`rename` to `roster.json.corrupt.<ts>` (`pwo`, `:330281-330283`), the `orphaned` worker count and
the redacted `issuePath` are all present at `:502495-502556 (193)` in near-identical form.

The **new** parts are exactly three:

1. `delete r.data.parseFailed` (`:330254`) — §1.5.
2. The healed-stamp observation (`:330255-330264`, **`healed_stamp` 220=1 / 193=0**):

```javascript
let n = t, o = ["supervisorPid", "updatedAt"].filter((i) => !Number.isFinite(n[i]));
if (o.length > 0 && !e?.silent)
  (w(`[daemon] roster.json stamp field(s) healed on read: ${o.join(", ")}`, { level: "warn" }),
    O("tengu_bg_roster_parse_failed", { orphaned: 0, quarantined: 0, issuePath: H5(o), issueCode: Ee("healed_stamp") }));
```

   Note that it inspects the **raw** JSON, not the parsed data — by then `.catch(0)` has already
   replaced the bad value, so the only way to know it happened is to look at the input. And it
   reports `orphaned: 0, quarantined: 0`, i.e. reuses the failure event as a *recovery* event.
3. `redactIssuePath` (`bad`, `:330284-330286`) extracted as a named function with an extended
   known-key allow-list (`aMy`, `:330331-330377`, 43 entries) so that a corrupt-path telemetry
   string cannot leak a session id or a filesystem path — anything not in the allow-list becomes
   `*`.

**Why does `.catch(0)` matter operationally?** `supervisorPid` and `updatedAt` are *bookkeeping*
stamps rewritten on every `mutateRoster` (`:330311`). Before, a single corrupted byte in either
one made `safeParse` fail, which quarantined the roster and **orphaned every worker in it**. Since
the orphan-adoption pass (`adoptRosterOrphans`, §2) is the mechanism that reclaims workers, a
corrupt stamp disabled the very machinery meant to recover from corruption — and, with a
60-second sweep, it did so once a minute. That is `.199` #6: *"Bg daemon on Linux killing itself +
every agent every ~50s after a corrupted worker record."* Coercing two integers to `0` when they
are unparseable costs nothing (they are immediately overwritten) and removes the whole failure
mode.

### 1.7 Roster writes are serialised through a promise chain

```javascript
function rIe(e) {                     // :330307-330314
  let t = Ead.then(async () => {
    let r = await v6(), n = e(r) ?? r;
    ((n.supervisorPid = process.pid), (n.updatedAt = Date.now()), await cMy(n));
  });
  return ((Ead = t.catch(() => {})), t);
}
```

Read-modify-write with no file lock, made safe by the fact that **only the daemon writes the
roster** and it is single-threaded; `Ead` chains successive mutations so two concurrent callers
cannot interleave a read and a write. `Ead = t.catch(() => {})` keeps the chain alive after a
failed mutation — without the `.catch`, one write error would reject every subsequent mutation
forever.

---

## 2. Roster orphans and pruning

`adoptRosterOrphans` (`Nad`, `:330915-330967`) reconciles roster rows that have **no session-state
directory**: a worker exists as a process but the UI cannot see it.

```javascript
let r = new Set(e.map((l) => l.id)),
  n = t.filter((l) => xad.test(l.short) && !r.has(l.short) && l.source !== "spare" && !l.dying);
```

Four filters, each meaningful: a syntactically valid short id (`xad`), not already listed,
not a prewarmed spare (spares are not user-visible sessions), and not already dying.

Liveness is then classified per row:

```javascript
async function gks(e, t) {                    // :330380-330384
  if (!HT(e)) return "dead_pid";
  if (!(await mB(e, t))) return "procstart_mismatch";
  return "live";
}
```

and the roster's `procStart` is only trusted when the roster row and the *live* record agree on
the pid (`:330924`):

```javascript
return gks(l.pid, c?.pid === l.pid ? c.procStart : void 0);
```

Dead rows are pruned with a **de-duplicating** telemetry emitter
(`tengu_bg_roster_orphan_pruned`, **220=1 / 193=0**, `:330930`):

```javascript
if (i[l] !== "live") {
  if ((w(`[adoptRosterOrphans] pruned dead record ${c.short} (${i[l]})`), !Eks.has(c.short)))
    (Eks.add(c.short), O("tengu_bg_roster_orphan_pruned", { reason: fe(i[l] ?? "dead_pid") }));
} else Eks.delete(c.short);
```

`Eks` is a module-level `Set`; the `else` branch removes a short that came back to life, so a
flapping worker re-emits. Without the set, a permanently-dead row that cannot be deleted (a
read-only config dir, say) would emit once per 60-second sweep forever.

Live rows get a synthesised `state.json` written with `flag: "wx"` and `mode: 0o600`
(`:330958-330963`), and `EEXIST` is swallowed — two concurrent adopters both try, one wins, and
that is correct. The synthesised state deliberately downgrades `tempo` (`:330942-330946`): a row
that claims `tempo: "active"` becomes `tempo: "blocked", needs: FH` unless it is a routine, in
which case it becomes `idle`. Reason: the supervisor that was streaming that worker's output is
gone, so "actively producing" is no longer a claim this daemon can make; "blocked, needs
attention" is the honest state.

`reason` values (`dead_pid`, `procstart_mismatch`) also answer `.216` #10 and `.216` #14 in part —
see §3.4 for why a row can be *undeletable* rather than merely orphaned.

---

## 3. Deleting a job: `claude rm`, `Ctrl+X`, and the `evict` protocol field

### 3.1 The protocol field

`evict: v.boolean().optional()` on the `kill` control request (`:330157`) is **220=1 / 193=0**.
It is requested by `deleteJob` (`:681125`) and honoured by the daemon **before** it looks for the
handle:

```javascript
case "kill": {                                          // :679373-679383
  if ((f.delete(A.short), A.evict))
    rIe((T) => { delete T.workers[A.short]; }).catch((T) => xe(T));
  let b = o.get(A.short);
  if (!b) return Th(t, { ok: !1, error: "job not found — it may have already exited", code: "ENOJOB" });
  …
}
```

**The ordering is the fix.** The roster row is deleted first, unconditionally, even if the handle
lookup then fails with `ENOJOB`. If eviction happened after the handle check, a job whose process
had already exited (so no handle) would return `ENOJOB` and leave its roster row behind — where
`adoptRosterOrphans` would resurrect it on the next sweep as a synthesised session. That is
exactly the *"deleted sessions reappearing"* half of `.216` #14 and the whole of `.206` #17
(*"`claude rm` leaving the removed job in the daemon roster"*).

### 3.2 Delete refuses to touch the filesystem until the kill is confirmed

```javascript
let o = await CJe(e, r ?? void 0, { knownGone: t.knownGone, evict: !0 }) …    // :681125
if (!o.confirmed) {
  w(`deleteJob: kill unconfirmed for ${e} — skipping jobdir/worktree removal to avoid stranding a live worker`,
    { level: "warn" });                                                        // :681131-681134
  … return { removed: !1, error: o.error, errorCode: "kill_unconfirmed" };
}
```

Removing the job dir while the worker is still alive would leave a process writing into a deleted
directory — no transcript, no state, no way to stop it from the UI. So an unconfirmed kill is a
*hard stop* on the delete. `kill_unconfirmed` is 220=6 / **193=5**, so the guard itself is largely
carryover; the delta is what `CJe` now does when the daemon is unreachable.

### 3.3 Confirming a kill when the service has gone idle (`.214` #28)

`killJobConfirmed` (`CJe`, `:680761-680800`) handles four control-socket outcomes:

```javascript
for (let s = 0; !i.ok && i.code === "ESTARTING" && s < 10; s++)
  (await vr(200), (i = await tT({ proto: Um, op: "kill", short: e, handoff: n, evict: o })));   // :680768-680769
if (i.ok) return { confirmed: !0 };
if (i.code === "ENOJOB" || i.code === "ENOCONN" || i.code === "ETIMEOUT") {
  let s = await EIa(e);                                     // scan pty hosts for this job
  if (s.anyMatch && i.code === "ENOJOB") return { confirmed: s.confirmed };
  let a = !1;
  if (i.code === "ENOCONN" || i.code === "ETIMEOUT") {
    let l;
    if (s.anyMatch) l = s.confirmed;
    else {
      let c = await v6({ silent: !0 }), u = c.workers[e];
      if (u !== void 0) l = !(await F1t(u.pid, u.procStart));       // roster says: is it alive?
      else ((a = i.code === "ENOCONN" && !s.scanFailed && !c.parseFailed && t?.state !== void 0
                 && dm({ state: t.state, tempo: t.tempo })), (l = a));
    }
    if (o && l && i.code === "ENOCONN" && !a)
      await rIe((c) => { delete c.workers[e]; }).catch((c) => xe(c));      // :680791-680794
    return { confirmed: l };
  }
  return { confirmed: !0 };
}
return { confirmed: !1, error: i.error };
```

**The `ENOCONN` path is the `.214` #28 fix.** `.214` #28: *"Completed background sessions
unremovable via `claude rm` once the service went idle."* With the daemon gone there is nobody to
send `evict` to, so before this change the roster row survived every delete attempt. Now the
client does the daemon's job:

1. Scan pty-host sockets for the job (`EIa`, `:680801-…`).
2. If that is inconclusive, read the roster directly and check `isPidLive(pid, procStart)`.
3. If the worker is provably dead, **the client evicts the roster row itself** (`:680791-680794`).

The `a` flag ("assume settled") is the exclusion: when the roster has *no row* for this job, the
`state.json` says settled, and nothing failed to scan, the delete is confirmed — but there is
nothing to evict, so `!a` suppresses the roster write. That guard prevents a spurious
read-modify-write of the roster on every `claude rm` of an already-clean job.

Note the ten-attempt `ESTARTING` retry at 200 ms: a daemon in the middle of starting up will
answer `ESTARTING`, and giving up immediately would make `claude rm` fail during exactly the
window in which `claude agents` was starting the daemon for you.

### 3.4 `claude rm` now explains why it kept a worktree

`claude rm` string occurrences are **220=9 / 193=4**, and the five new ones are exactly the five
advice strings of one `keptReason`-driven remedy table at `:683251`, `:683254`, `:683257`,
`:683260`, `:683262` (the destructure that feeds it is at `:683236-683242`). The four carryover
occurrences are the usage/one-line-hint strings — 220 `:683202`, `:683208`, `:683215`, `:683219`
against 193 `:577358`, `:577364`, `:577371`, `:577375`.

| `keptReason` | Advice printed |
|---|---|
| `unverified`, `shared_record` | *"if you don't need its contents, remove the directory, then run `claude rm <id>` again"* |
| `identity_changed` | *"retry the delete (the directory's resolution changed while it was being verified), then run `claude rm <id>` again if it recurs"* |
| `records_unreadable` | *"retry once sibling records are readable (see `~/.claude/jobs`), then run `claude rm <id>` again"* |
| `in_use`, `live_lock` | *"wait for that session to finish (or stop it), then run `claude rm <id>` again"* |
| (default) | *"resolve that (commit/push, or remove the worktree), then run `claude rm <id>` again"* |

**Correction to the scoping probe (a false delta I re-measured).**
[`_scope_v206_210.md`](../00_overview/_scope_v206_210.md) line 246 files `.208` #41 with
`keptReason`/`leftWorktreeDir` at 193=0/0. Re-measured directly:

| Anchor | 220 | 193 | verdict |
|---|---:|---:|---|
| `leftWorktreeDir` | 3 (`:683241` + producers) | **0** | genuinely new |
| `keptReason` | 3 (`:681212`, `:683239`, `:803091`) | **3** (`:575654`, `:577390`, `:674782`) | **CARRYOVER** |

So the *field* `keptReason` and the "kept the worktree" return shape already existed in 2.1.193 —
193 returned `{ removed: !0, keptWorktree: o, keptReason: s }` at `:575654 (193)` and threaded it
through `:577390 (193)` and `:674782 (193)`. The delta in this window is (a) the new sibling field
`leftWorktreeDir`, (b) the five per-reason remedy strings, and (c) the `removed: !1` variant at
`:681212` that returns a `keptReason` on a *failed* delete, which is what makes the row explain
itself instead of silently reappearing. This is `.208` #41 (*"Agent view Ctrl+X: renamed-branch
worktrees, unpushed commits, name reuse"*) and the user-visible half of `.211` #18 / `.214` #29.
The design principle is that a refusal must always state the *action that clears it* — every
branch above ends in the same `claude rm <id>` invocation.

---

## 4. Environment inheritance from the dispatching shell

This is the cluster `.203` #8 (stale `PATH` on Windows), `.203` #9 (shell-exported
`ANTHROPIC_BASE_URL` dropped) and `.206` #10 (`CLAUDE_CODE_EXTRA_BODY` ignored). All three are the
**same** change, and it has two halves.

### 4.1 Half one: stop persisting volatile env in the roster

`cappedDispatch()` is what `rosterEntry()` writes into `dispatch` (`:554209`):

```javascript
// ============================================
// cappedDispatch - the roster-safe projection of a dispatch request
// Location: cli_inner_pretty.js:554216-554232
// ============================================

// ORIGINAL (for source lookup):
cappedDispatch() {
  return JSON.parse(
    JSON.stringify(this.dispatch, (e, t) => {
      if (e === "reattachEnv" || e === "attachStallRespawns" || e === "CLAUDE_CODE_HOST_CREDS_FILE" ||
          e === "PATH" || e === "CLAUDE_CODE_EXTRA_BODY" || Sxt.includes(e)) return;
      if (typeof t === "string" && t.length > Bhp) return t.slice(0, Bhp);
      return t;
    }),
  );
}

// READABLE (for understanding):
cappedDispatch() {
  return JSON.parse(JSON.stringify(this.dispatch, (key, value) => {
    if (key === "reattachEnv"                 // per-attach, never reusable
     || key === "attachStallRespawns"          // per-attach counter
     || key === "CLAUDE_CODE_HOST_CREDS_FILE"  // a path to a credentials file
     || key === "PATH"                         // volatile: belongs to the dispatching shell
     || key === "CLAUDE_CODE_EXTRA_BODY"       // volatile: read fresh each spawn
     || AUTH_ENV_KEYS.includes(key))           // ANTHROPIC_BASE_URL, _ASSUME_FIRST_PARTY_BASE_URL, ANTHROPIC_CUSTOM_HEADERS
      return undefined;                        // drop the key entirely
    if (typeof value === "string" && value.length > DISPATCH_STRING_CAP) return value.slice(0, DISPATCH_STRING_CAP);
    return value;
  }));
}

// Mapping: Sxt→AUTH_ENV_KEYS (:57882), Bhp→DISPATCH_STRING_CAP (4096, :554840)
```

2.1.193's version dropped **only** the first two keys:

```javascript
cappedDispatch() {                     // :607504-607514 (193)
  return JSON.parse(JSON.stringify(this.dispatch, (e, t) =>
    e === "reattachEnv" || e === "attachStallRespawns" ? void 0
      : typeof t === "string" && t.length > Tec ? t.slice(0, Tec) : t));
}
```

`Sxt = ["ANTHROPIC_BASE_URL", "_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL", "ANTHROPIC_CUSTOM_HEADERS"]`
at `:57882`.

**Why does not-persisting fix "ignored"?** Because a background session is respawned many times
over its life (crash, upgrade, rekey, adopt), and every respawn rebuilds its env from
`dispatch.env`. A value captured once at dispatch time therefore becomes *permanent*: change
`CLAUDE_CODE_EXTRA_BODY` in your shell, re-dispatch, and the worker uses… whatever the roster
remembered. Deleting the key from the persisted copy means the *live* value is consulted at each
spawn. `CLAUDE_CODE_EXTRA_BODY` is 220=9 / **193=5**, and `:682552` shows the dispatch side
re-reading it from `Z.CLAUDE_CODE_EXTRA_BODY` per dispatch.

### 4.2 Half two: scrub rows that were already written

`static adopt` retroactively removes the same two keys from any roster row it inherits
(`:553982-553985`):

```javascript
if (t.dispatch.env) {
  for (let s of Object.keys(t.dispatch.env))
    if (s.toUpperCase() === "PATH" || s === "CLAUDE_CODE_EXTRA_BODY") delete t.dispatch.env[s];
}
```

Note `s.toUpperCase() === "PATH"` — the *case-insensitive* comparison, which matters entirely on
Windows (§4.3). Without this pass, every worker adopted from a pre-2.1.220 roster would keep its
stale values forever, and the fix would only apply to newly dispatched sessions.

### 4.3 The `PATH` case-collision fix (`.203` #8, Windows)

`buildWorkerEnv` (`jhp`, `:553391-553446`) gained an explicit `PATH` normalisation that 2.1.193's
`wec` (`:606909-606952 (193)`) does not have at all. `toUpperCase() === "PATH"` is
**220=6 / 193=3**.

```javascript
// ============================================
// buildWorkerEnv - PATH normalisation and base-URL-aware auth scrubbing (excerpt)
// Location: cli_inner_pretty.js:553392-553428
// ============================================

// ORIGINAL (for source lookup):
let i = { ...process.env },
  s = { ...i, ...(r && { CLAUDE_BG_AUTH_SNAPSHOT_PATH: r }), …, ...e.env, CLAUDE_CODE_SESSION_KIND: "bg", … },
  a = Object.hasOwn(i, "PATH") ? "PATH" : Object.keys(i).find((c) => c.toUpperCase() === "PATH"),
  l = e.env?.PATH || (a ? i[a] : void 0);
for (let c of Object.keys(s)) if (c.toUpperCase() === "PATH") delete s[c];
if (l) s[a ?? "PATH"] = l;
…
} else if (s.ANTHROPIC_BASE_URL !== i.ANTHROPIC_BASE_URL) {
  for (let c of Sxt) delete s[c];
  if (i.ANTHROPIC_BASE_URL) delete s.ANTHROPIC_AUTH_TOKEN;
}

// READABLE (for understanding):
const daemonEnv = { ...process.env };
let workerEnv = { ...daemonEnv, …, ...request.env, CLAUDE_CODE_SESSION_KIND: "bg", … };

// 1. find the daemon's own spelling of PATH (Windows may have "Path" or "PATH")
const pathKey = Object.hasOwn(daemonEnv, "PATH")
  ? "PATH"
  : Object.keys(daemonEnv).find((k) => k.toUpperCase() === "PATH");
// 2. the dispatching session's PATH wins over the daemon's
const effectivePath = request.env?.PATH || (pathKey ? daemonEnv[pathKey] : undefined);
// 3. remove EVERY case-variant from the merged object, so no shadow copy survives
for (const k of Object.keys(workerEnv)) if (k.toUpperCase() === "PATH") delete workerEnv[k];
// 4. re-insert exactly once, under the daemon's original spelling
if (effectivePath) workerEnv[pathKey ?? "PATH"] = effectivePath;
…
// base URL: if the worker's differs from the daemon's, the daemon's auth env is wrong for it
else if (workerEnv.ANTHROPIC_BASE_URL !== daemonEnv.ANTHROPIC_BASE_URL) {
  for (const k of AUTH_ENV_KEYS) delete workerEnv[k];
  if (daemonEnv.ANTHROPIC_BASE_URL) delete workerEnv.ANTHROPIC_AUTH_TOKEN;
}

// Mapping: jhp→buildWorkerEnv, i→daemonEnv, s→workerEnv, e→request, a→pathKey, l→effectivePath,
//          Sxt→AUTH_ENV_KEYS
```

**How the bug worked.** Windows environment blocks are case-insensitive but a JS object is not.
The daemon's `process.env` typically carries `Path`; a dispatch request from a session carries
`PATH`. `{ ...daemonEnv, ...request.env }` therefore produces an object with **both** keys, and
which one the child process sees depends on iteration order and on how the OS collapses
duplicates — in practice the daemon's stale `Path` won. Deleting *every* case variant and
re-inserting once under the daemon's own spelling removes the ambiguity entirely. Preferring
`request.env.PATH` is the actual behaviour change: the dispatching shell's `PATH` beats the
long-lived daemon's.

**And the base-URL condition inverted.** 2.1.193 (`:606936 (193)`):

```javascript
} else if (s.ANTHROPIC_BASE_URL) delete i.ANTHROPIC_AUTH_TOKEN;
```

— *"if the **daemon** has a base URL, drop the worker's auth token."* 2.1.220 asks a different
question: *"does the worker's base URL **differ** from the daemon's?"* If yes, the daemon's whole
auth-env set (`Sxt`) is wrong for the worker's endpoint and is removed, forcing the worker to
authenticate against the endpoint it was actually given. `ANTHROPIC_BASE_URL !== i.ANTHROPIC_BASE_URL`
is **220=1 / 193=0**, and `ANTHROPIC_BASE_URL` overall is 220=47 / **193=40** — so the literal is
heavily pre-existing and only this comparison is new. That is the honest scope of `.203` #9.

### 4.4 Everything else `buildWorkerEnv` removes

| Rule | Line | Effect |
|---|---|---|
| `CLAUDE_CONFIG_DIR` forced from the daemon | `:553412` | a worker never picks a different config dir |
| `oSr` list dropped unless explicitly requested | `:553413` | |
| `m7s` list dropped unless explicitly requested | `:553415` | includes `CLAUDE_CODE_EXTRA_BODY` (`:554889`), `ANTHROPIC_CUSTOM_HEADERS` (`:554892`) |
| `O4r` **prefix** list dropped | `:553416` | prefix-matched families |
| host-managed provider auth stripped | `:553417-553424` | `Kye`, `Ext(i)`, `Sxt`, plus `CLAUDE_CODE_HOST_CREDS_FILE` forwarding |
| auth snapshot ⇒ drop `CLAUDE_CODE_OAUTH_TOKEN` | `:553430` | the snapshot is the source of truth |
| `exec` mode ⇒ drop **all** `CLAUDE_*`/`OTEL_*` | `:553431-553444` | except `CLAUDE_JOB_DIR`, `CLAUDE_CONFIG_DIR`, `CLAUDE_BG_PTY_AUTH`; sets `CLAUDE_PTY_HOST_EXEC=1` |

The `exec`-mode scrub is the strongest: an `exec` worker runs an arbitrary user command in a pty,
so it must not inherit Claude Code's identity, telemetry or credentials. Only the three variables
the pty host itself needs survive.

And one **removal** worth recording, because it corroborates a ground-truth finding: 2.1.193's
builder set `CLAUDE_ENABLE_STREAM_WATCHDOG: "1"` unconditionally (`:606918 (193)`); 2.1.220's does
not. `CLAUDE_ENABLE_STREAM_WATCHDOG` is **220=2 / 193=4** — the `.196` "watchdog on by default"
flip *deleted* the explicit opt-in here, which is exactly the "count went down" pattern
`_GROUND_TRUTH_verified_anchors.md` §3 warns about.

`applyProcessWrapperToWorkerEnv` (`Ghp`, `:553447-553451`) is the last word on the env:

```javascript
let r = process.env[DN];
if (t.launch.mode === "exec" || r === void 0) delete e[DN];
else e[DN] = r;
```

The launcher is propagated to real Claude Code workers (so *their* self-spawns are wrapped too)
and explicitly **removed** for `exec` workers — a shell command must not be re-launched through
the corporate wrapper.

### 4.5 A claimed prewarmed spare gets the *dispatch's* env, not its own

The spare-worker pool itself is carryover (`tengu_bg_spare_claim` / `tengu_bg_spare_spawn` are in
the 193 allow-list), but it interacts with §4.3 in a way worth stating, because a spare process
was started *minutes earlier from a different shell* and its own `PATH` is therefore exactly the
stale value `.203` #8 is about.

#### Spare-claim env handover

**What it does:** hands an already-booted, idle worker process a complete replacement
`{ cwd, env, argv, sessionId }` for the session it is about to become.

**How it works:**

1. `BackgroundWorker.claim` (`:553936-553965`) constructs the handle around the *spare's* live pid
   and pty socket, stamps `attempt = 1` and this build's `VERSION`, wires the pty and re-reads the
   spare's `procStart` with `skipCache: !0` (`:553958-553962`) so the handle's identity is the
   spare's real one.
2. `buildClaimFrame` (`:553973-553979`) then builds the env **from the dispatch request**:
   `o = jhp(e, n, t, Pdr(e.short), r)` (`:553975`) — the same `buildWorkerEnv` as a cold spawn,
   so the PATH normalisation of §4.3 applies and `e.env?.PATH` (the dispatching shell's) wins.
   It deletes `CLAUDE_BG_PTY_AUTH` from the frame (the spare already has its own), overlays
   `reattachEnv`, and applies the launcher rule via `Ghp` (`:553976-553977`).
3. `eSE` (`:869085-869088`) wraps it as `{ cwd: e.cwd, env: o, argv: i, sessionId: e.sessionId,
   auth: n }` and `tSE` (`:869089-869103`) delivers it over the spare's *claim* socket with a 5 s
   deadline and a ten-step `ENOENT`/`ECONNREFUSED` retry ladder
   `g1m = [50,100,150,200,250,300,400,500,500,500]` (`:869190`) — ~2.95 s of cumulative sleep, so
   the ladder is *guaranteed* to exhaust before the 5 s deadline rather than racing it, and only
   those two errnos retry (a socket that is not there yet vs. a socket that is refusing) while any
   other error propagates immediately.
4. If delivery fails, `$vl` (`:869067-869084`) emits `tengu_bg_sendclaim_failed` and connects to
   the pty socket to send `{ t: "kill", sig: "SIGTERM" }` (`:869079`).

**Why this approach:** the alternative — letting the spare keep the environment it booted with —
is precisely the stale-`PATH` bug, one generation removed: the spare would carry the *daemon's*
env (it was spawned by the daemon) rather than the dispatching session's. Pushing a full frame
also lets the spare receive `cwd` and `argv`, so one prewarmed process can serve any dispatch
regardless of directory or flags. The trade-off is that the claim becomes a second failure point,
which is why the failure path kills the spare instead of degrading: a spare that half-applied a
frame would run a user's session with a mixture of two environments, which is unauditable.

**Key insight:** prewarming is only safe because *nothing session-specific is baked in at spare
spawn time*. The spare is a blank Claude Code process holding a pty; identity, cwd, argv and the
entire environment arrive at claim time, which is why the `.203` #8 / `.206` #10 env fixes did not
need a separate spare-path patch.

---

## 5. Worktrees: locks, sweeps, non-git directories

### 5.1 The liveness lock and who may release it

A Claude-created worktree is locked with a reason string that encodes the owning process:

```javascript
Wlt = /^claude (?:agent|session) .{1,255} \(pid (\d{1,10})(?: start (.{1,255}))?\)$/;   // :226313
```

2.1.193's equivalent was **inlined** at the single use site with unbounded quantifiers
(`/^claude agent .+ \(pid (\d+)(?: start (.+))?\)$/`, `:591964 (193)`). The 220 version is
factored out, bounded (`.{1,255}`, `\d{1,10}`) and also accepts `claude session `. Bounded
quantifiers on a regex applied to file-derived data is straightforward ReDoS hardening.

Three predicates read it, and the difference between them is the whole ownership model:

```javascript
async function ycs(e) {                          // :225063-225068  "is it held by a LIVE other process?"
  let t = e?.match(Wlt); if (!t) return !1;
  let r = Number(t[1]);
  return r !== process.pid && HT(r) && (await mB(r, t[2]));
}
async function RVe(e) {                          // :225069-225073  "may WE release this lock?"
  if (e === void 0) return !0;                   //   no lock at all -> nothing to release
  if (!Wlt.test(e)) return !1;                   //   NOT our format -> never touch it
  return !(await DRu(e));                        //   ours, and the owner is gone
}
function ARu(e) {                                // :226041-226046  "is it a releasable stale lock?"
  if (e === void 0 || e.length > 512) return !1;
  let t = e.match(Wlt); if (!t) return !1;
  return O5r(Number(t[1]));                      //   pid is DEFINITELY gone
}
```

`isPidDefinitelyGone` (`O5r`, `:112329-112336`) is the strictest liveness test in the codebase:

```javascript
function O5r(e) {
  if (!Number.isInteger(e) || e <= 1) return !1;     // pid 0/1 are never "gone"
  try { return (process.kill(e, 0), !1); }           // signalable -> alive
  catch (t) { return Bt(t) === "ESRCH"; }            // ONLY ESRCH counts as gone; EPERM does not
}
```

`EPERM` (a live process owned by another user) returning `false` is the point: releasing a lock
held by another user's live session would let two sessions write one worktree.

The `!Wlt.test(e) → return !1` line in `RVe` is the single most important safety property here:
**a lock Claude Code did not write is never released.** A user's own `git worktree lock -reason
"do not touch"` survives every sweep.

### 5.2 The periodic sweep (`.210` #21)

`releaseStaleClaudeWorktreeLocks` (`WRu`, `:226047-226099`) — `tengu_worktree_stale_lock_released`
is **220=1 / 193=0** — is called at the top of `sweepStaleWorktrees` (`Acs`, `:225962-…`) at
`:225965`, which is itself called from the retention sweep (`:665734`).

Per candidate, in order:

1. Skip our own session's worktree (`:226058`, realpath-normalised).
2. Skip if `_7r(path)` (`:226059`).
3. `ARu(lockReason)` — releasable stale Claude lock, or skip (`:226060`).
4. The directory must still have a `.git` entry (`:226061-226067`) — a lock on a directory that no
   longer exists is `git worktree prune`'s problem, not ours.
5. Per-sweep cap `vRu = 50` (`:226268`), with an explicit log
   (*"remaining stale locks will be reconciled on later sweeps"*, `:226070`).
6. `realpath` the path and **re-run** filters 2 and 1 on the resolved path (`:226076-226081`).
7. **Re-read the worktree registry** and re-check the lock reason *and* `RVe` before unlocking
   (`:226082-226092`).

Step 7 is a deliberate double-check: between the first registry read and the unlock, another
session could have claimed the worktree and rewritten the lock reason with its own live pid.
Unlocking then would hand a live session's worktree to someone else. The re-read costs one `git
worktree list` per release, which is why it is behind the cheap filters and the cap.

**Why cap at 50?** The sweep runs inside the retention pass and shells out to `git worktree unlock`
per release. 50 bounds the worst case (a machine with hundreds of abandoned worktrees) to a
predictable amount of subprocess work, and the next sweep picks up the rest — a stale lock costs
nothing while it waits.

### 5.3 `git no longer recognizes` — worktrees git has forgotten (`.211` #18, `.214` #29)

`removeAgentWorktree`'s failure branch (`:225840-225871`) matches git's stderr against:

```javascript
oZg = /is not a working tree|validation failed|not a git repository: .*[\\/]\.git[\\/]worktrees[\\/]/;   // :226315
```

and on a match runs `git worktree prune`, then:

> `removeAgentWorktree: git no longer recognizes <path> (<stderr>) — pruned the stale
> registration, left the directory in place`

`git no longer recognizes` is **220=2 / 193=0** (`:225854`, `:225855` — the second variant covers
`prune` itself failing). The outcome is `"left_in_place"` with
`tengu_worktree_removed { left_in_place: 1, deregistered_stale: 1 }`.

**Why leave the directory?** Because git having lost the registration says nothing about whether
the *files* are wanted. Deleting them would be an unrecoverable data loss on a guess. Removing
only the stale registration makes the job deletable (which is the bug) while leaving the contents
for the user, and `claude rm`'s advice table (§3.4) tells them how to finish.

### 5.4 Non-git directories: eighteen gates before an `rm -rf` (`.216` #10, `.217` #5)

When no git root resolves at all, `removeRootlessAgentWorktree` (`Vor`, `:225653-225719`) takes
over. It is the most defensive function in the module, and every gate maps to a way an attacker or
an accident could redirect the deletion:

| # | Gate | Line | Refusal |
|---|---|---|---|
| 1 | absolute path | `:225668` | `path is not absolute` |
| 2 | not a UNC/automount path | `:225671` | `network path (UNC or automount)` |
| 3 | no unverifiable symlinked ancestor | `:225672` | `unverifiable symlinked ancestor` |
| 4-6 | same three checks on the *anchor-resolved* path | `:225673-225676` | |
| 7 | `lstat` succeeds; ENOENT/ENOTDIR ⇒ "already gone", success | `:225677-225690` | |
| 8 | is a directory | `:225691` | `not a directory` |
| 9 | `realpath` succeeds | `:225692-225693` | **`could not canonicalize the path`** (220=1 / 193=0) |
| 10 | resolved path is not a network path | `:225694` | |
| 11 | resolved path equals the *verified-ownership* path | `:225695` | `resolution changed since ownership verification` (`HVe`, `:226261`) |
| 12 | parent is `worktrees`, grandparent is `.claude` | `:225697-225698` | `not directly under a .claude/worktrees directory` |
| 13 | does not still resolve to a repository | `:225699` | `still resolves to a repository` |
| 14 | directory is readable | `:225700-225701` | `unreadable directory` |
| 15 | **non-empty ⇒ refuse unless `job_delete_force`** | `:225702-225710` | `has files but no repository to verify them against` (`v7r`, `:226262`), `needsForce: true` |
| 16 | `realpath` **again** | `:225711` | `HVe` |
| 17 | Windows reparse points cleared | `:225712-225716` | `unremovable reparse point in the worktree` (`$Ru`, `:226263`) |
| 18 | `realpath` **a third time** | `:225717` | `HVe` |

Then, and only then, `await ka.rm(u, { recursive: !0, force: !0 })`.

**Why is `realpath` called three times?** Gates 9, 16 and 18 are TOCTOU checkpoints around the two
operations that can themselves change the filesystem: the `readdir` (gate 14) and the reparse-point
clearing (gate 17). Between any two of them an attacker with write access to the parent could swap
the directory for a symlink to `$HOME`. Re-canonicalising immediately before the `rm` is the last
possible moment at which the target can be verified. Gate 18's error handler is subtly different
from gate 16's — `.catch((g) => (qt(g) ? u : null))` treats ENOENT as "still ours" because a
directory that vanished is not a redirection risk.

`canonicaliz*` is 220=14 / **193=5**, so canonicalisation as a concept is pre-existing; *"could
not canonicalize the path"* is the new refusal (`.217` #5, *"Background session isolation not
canonicalizing symlinked working directories"*).

Gate 15 is the policy statement: **files with no repository to verify them against are never
deleted implicitly.** `git worktree remove` can prove a worktree is clean; a rootless directory
cannot be proved anything about, so the user must ask explicitly (`job_delete_force`).

The Windows reparse-point clearing is `.205` #4 (*"Windows worktree removal deleting files outside
it via NTFS junction/symlink"*). `unlinked reparse point before removal` is **220=1 / 193=0**
(`:224251`), inside `gRu` (`:224249-…`), reached from `VNe` (`:224244-224248`) which is a no-op off
Windows. It tries `unlink`, then `rmdir`, and distinguishes a link from a real directory via
`readlink` + errno (`:224259-224262`). Clearing the junction *before* `rm -rf` descends is what
stops the recursive delete from following it out of the worktree.

### 5.5 `extensions.worktreeConfig` restoration (`.207` #8)

`worktreeConfig` is **220=4 / 193=0**. `restoreWorktreeConfig` (`DDt`, `:225888-225921`) runs
after every successful removal (`:225851`, `:225874`) and unsets
`extensions.worktreeConfig` once the *last* Claude-managed linked worktree is gone:

```javascript
if ((await ka.lstat(Ha.join(r, "config.worktree"))).size > 0) return;      // :225894 user has per-worktree config
let n = 0;
for (let i of await Oke(e)) {
  if (_7r(i.worktreePath)) { n++; continue; }
  if ((await ka.lstat(i.worktreePath).then(() => !1, (a) => qt(a) || Bt(a) === "ENOTDIR")) && (await RVe(i.lockReason)))
    continue;                                                              // gone AND releasable -> does not count
  n++;
}
if (n > 1) return;                                                         // main tree + others still present
let o = await Xn(fo(), ["config", "--local", "--unset-all", "extensions.worktreeConfig"], { cwd: e });
if (o.exitCode !== 0 && o.exitCode !== 5) return;                          // 5 == key not present, fine
await Xn(fo(), ["config", "--local", "--unset-all", BRu], { cwd: e });
```

Three careful decisions: a non-empty `config.worktree` means the *user* relies on the extension, so
it is never unset; a registered worktree whose directory is gone **and** whose lock we may release
does not count towards `n`; and `git config` exit code 5 ("key not present") is treated as success.
`n > 1` rather than `n > 0` because the main working tree is itself in the registry.

---

## 6. The retention sweep

`runRetentionSweep` (`rtf`, `:665693-665751`) — `tengu_retention_sweep` is **220=3 / 193=0** — has
a single call site (`:758584`) and runs 28 sub-sweeps plus the worktree cleanup.

Its most interesting part is the **refusal to run** (`retentionSkipReason`, `pAa`,
`:664931-664957`), which has three distinct reasons and is the reverse of what one might expect
from a cleanup task:

| Reason | Condition | Line |
|---|---|---|
| `user_source_disabled` | `userSettings` disabled via `--setting-sources` and no enabled source provides `cleanupPeriodDays` | `:664932-664938` |
| `settings_unknowable` | a settings file could not be read/parsed **and** `cleanupPeriodDays` might be set inside it | `:664942-664948` |
| `settings_invalid_key_set` | settings have validation errors **and** `cleanupPeriodDays` was explicitly set | `:664949-664955` |

The messages spell out the reasoning:

> "Skipping cleanup: a settings file could not be read or parsed, so `cleanupPeriodDays` **may be
> set to a value that cannot be seen**. Fix the settings file (see `/doctor`) to re-enable cleanup."

**Why fail closed on unreadable settings?** Because the operation is *deletion*. If an admin set
`cleanupPeriodDays: 365` in a file that now fails to parse, running with the default of 30
(`etf`, `:665753`) would silently delete eleven months of transcripts. Not running is always
recoverable. Note the escape hatch at `:664939`: if `policySettings` provides
`cleanupPeriodDays` explicitly, the value is known and the sweep proceeds regardless of other
files' errors.

`retentionCutoffDate` (`RG`, `:664959-664965`) returns `null` for `cleanupPeriodDays === 0`
(cleanup disabled) and accepts a caller-supplied *tighter* bound (`e < r`), never a looser one.

---

## 7. Miscellaneous verified findings

- **Job-state read caching.** `nIe` (mtime-keyed) and `Lpt` (transient-error dedupe). The mtime key
  is a composite of `state.json` plus the three sidecars (`:330520`), so touching only `order`
  invalidates the cache without re-reading `state.json`… and vice versa. A *rejected* file gets a
  `rejected:<mtime>:<size>` key (`:330507-330514`) so an oversized state file is not re-lstat'ed
  every tick. Cache is cleared wholesale past 1000 entries (`:330559`) — a crude but adequate
  bound for a per-session map.
- **`tengu_bg_state_read_transient` is carryover** (220=2 / 193=2): a stat/read failure that is not
  ENOENT returns the *cached* state rather than `null`, so a momentary NFS hiccup does not make a
  session look dead. `Lpt` ensures one event per session per outage.
- **`readJobStateFresh`** (`mwo`, `:330574-330580`): invalidate, read, and if the state is not
  terminal wait 50 ms and read once more. Used where a caller needs to see a terminal state that a
  worker may be in the middle of writing.
- **The settle handler skips the terminal write on a handoff kill** (`:869954-869956`):
  `tengu_bg_handoff_settle` (**220=1 / 193=0**) fires when `outcome === "killed" && isHandoffKill`,
  and the whole `Da(a).then(...)` state-writing branch is skipped. A displaced daemon must not
  stamp `stopped` on a session its successor is adopting. This is `.196` #21, `.210` #7 and
  `.214` #26.
- **Post-adopt sweeps are gated on still holding the lock** (`:869720-869733`): if
  `daemon.lock` is absent or held by another pid, the new daemon logs
  *"skipped post-adopt sweeps + roster rewrite — daemon.lock is … (yield/handover in flight)"* and
  does **not** rewrite the roster. Rewriting it would clobber a successor's view.
- **`tengu_bg_orphan_reap`** (`:870126`): pty hosts with no roster row are reaped once per sweep.
  In the allow-list at `:537414`, therefore carryover.

---

## 8. Worktree *creation* through a repository-committed symlink (`.212` #8)

Everything above in §5 is about worktree **removal**. This section is the other half: the guard that
2.1.212 added to worktree **creation**. The changelog bullet is

> *"Fixed worktree creation following a repository-committed symlink at `.claude/worktrees`, which
> could create files outside the repository"* (`CHANGELOG.md`, 2.1.212 #8)

and it is a genuine security fix, not a robustness tidy-up. Anchors, counted with `grep -cF` in both
bundles:

| Literal / telemetry token | 220 | 193 |
|---|---|---|
| `git_worktree_create_symlink_rejected` | 1 (`:224562`) | **0** |
| `git_worktree_create_lstat_failed` | 1 (`:224556`) | **0** |
| `A repository-committed symlink at .claude, .claude/worktrees, or .claude/worktrees/<name>` | 1 (`:224564`) | **0** |
| `could redirect worktree creation outside the repository` | 1 (`:224564`) | **0** |
| `git_worktree_create_containment_failed` | 1 (`:224855`) | **0** |
| `git_worktree_create_realpath_failed` | 1 (`:224859`) | **0** |
| `is not the expected worktree location` | 1 (`:224856`) | **0** |
| `failed to verify containment of` | 1 (`:224861`) | **0** |
| `check ~/.claude/skills and other sensitive locations for unexpected content` | 1 (`:224863`) | **0** |
| `git_worktree_create_hook_ancestry_rejected` | 4 (`:225140`, `:225151`, `:225569`, `:225581`) | **0** |
| `A repository-committed symlink below the checkout root could redirect the worktree outside the repository` | 2 (`:225155`, `:225585`) | **0** |
| `symlink screen cannot verify a dotted spelling` | 2 (`:225143`, `:225572`) | **0** |
| `git_worktree_resume_foreign_repo` | 1 (`:224719`) | **0** |

Every one of these is **NET_NEW**. The whole cluster — leaf guard, containment re-verification,
hook-path screen, foreign-repo resume check — landed in this window.

> ⚠ **Carryover trap, do not fold this in.** `destination escapes worktree via committed symlink` is
> **220=3 / 193=3** (`:224502`, `:224961`, `:224990` vs `:591461`, `:591731`, `:591753 (193)`).
> That is `isWorktreeWriteDestUnsafe` (`Bdo`, `:224465`) screening *file copies into an
> already-created worktree* (`.worktreeinclude` entries, the `settings.local.json` copy, the
> disk-bloat symlinks). It is a different code path with a different verb — it **skips** the
> offending entry and continues, where the `.212` guard **aborts creation**. 193 already had it.
> Counting the two together would make the delta look twice as large as it is.

### 8.1 The trust boundary: who controls the symlink

The managed worktree root is derived purely from the repository root:

```javascript
// ============================================
// managedWorktreesDir / managedWorktreePath / flattenWorktreeSlug - where a managed worktree lands
// Location: cli_inner_pretty.js:224527-224546
// ============================================

// ORIGINAL (for source lookup):
function IVe(e) {
  return Ha.join(e, ".claude", "worktrees");
}
...
function xRu(e) {
  return e.replaceAll("/", "+");
}
function PDt(e) {
  return `worktree-${xRu(e)}`;
}
function kRu(e, t) {
  return Ha.join(IVe(e), xRu(t));
}

// READABLE (for understanding):
function managedWorktreesDir(repoRoot) {
  return path.join(repoRoot, ".claude", "worktrees");
}
...
function flattenWorktreeSlug(name) {
  return name.replaceAll("/", "+");        // "feat/x" -> "feat+x": ONE path component, always
}
function worktreeBranchName(name) {
  return `worktree-${flattenWorktreeSlug(name)}`;
}
function managedWorktreePath(repoRoot, name) {
  return path.join(managedWorktreesDir(repoRoot), flattenWorktreeSlug(name));
}

// Mapping: IVe→managedWorktreesDir, xRu→flattenWorktreeSlug, PDt→worktreeBranchName,
//          kRu→managedWorktreePath, Ha→path, e→repoRoot, t→name
```

`.claude/` is a **tracked directory in the user's repository**. That is the entire problem. Git
stores a symlink as a blob whose contents are the link text plus mode `120000`; on checkout git
recreates it as a real symlink. So:

- **The attacker is whoever can get a commit into the repository you check out.** A pull request to
  an open-source project, a compromised dependency vendored as a subtree, a repo you `git clone`
  from a link in an issue, or a branch you `git checkout` to review. No local code execution is
  required — the payload is *data at rest in the tree*.
- **The victim is the Claude Code process**, which runs `git worktree add` at the attacker-chosen
  path with the user's own filesystem privileges. There is no sandbox boundary here: worktree
  creation is deliberately outside the sandbox because it must write a checkout.
- **The trust boundary that was missing** is the one between "path the repository content told me
  to use" and "path inside the repository". 2.1.193 treated `repoRoot + ".claude" + "worktrees"` as
  a *constructed* path and therefore as trusted, when in fact every component of it is
  attacker-writable content.

The threat is aggravated by the fact that this fires on a workflow the user thinks is read-only-ish:
"review this PR in an isolated worktree". `createAgentWorktree` is reached from the Agent tool
whenever `isolation: "worktree"` is requested (`:398714`), and `createWorktreeForSession` from
`--worktree` (`:225123`). Reviewing hostile code is exactly when you reach for isolation.

### 8.2 The guard

```javascript
// ============================================
// assertNoSymlinkOnWorktreePath - refuse creation if any of the three path levels is a symlink
// Location: cli_inner_pretty.js:224547-224568
// ============================================

// ORIGINAL (for source lookup):
async function ccs(e, t) {
  let r = [Ha.join(e, ".claude"), IVe(e), t];
  for (let n of r) {
    let o;
    try {
      o = await ka.lstat(n);
    } catch (i) {
      if (qt(i)) continue;
      throw (
        pe("git_worktree_create", "git_worktree_create_lstat_failed"),
        new h_(`Cannot create worktree: failed to lstat ${n}: ${le(i)}`)
      );
    }
    if (o.isSymbolicLink())
      throw (
        pe("git_worktree_create", "git_worktree_create_symlink_rejected"),
        new h_(
          `Cannot create worktree: ${n} is a symlink. A repository-committed symlink at .claude, .claude/worktrees, or .claude/worktrees/<name> could redirect worktree creation outside the repository. Remove the symlink and retry.`,
        )
      );
  }
}

// READABLE (for understanding):
async function assertNoSymlinkOnWorktreePath(repoRoot, worktreePath) {
  const levels = [
    path.join(repoRoot, ".claude"),        // level 1
    managedWorktreesDir(repoRoot),         // level 2: <repoRoot>/.claude/worktrees
    worktreePath,                          // level 3: <repoRoot>/.claude/worktrees/<slug>
  ];
  for (const level of levels) {
    let stats;
    try {
      stats = await fsp.lstat(level);      // lstat: does NOT follow the final component
    } catch (err) {
      if (isENOENT(err)) continue;         // absent is fine — it will be created
      emitFeatureBad("git_worktree_create", "git_worktree_create_lstat_failed");
      throw new WorktreeIsolationError(
        `Cannot create worktree: failed to lstat ${level}: ${errorMessage(err)}`);
    }
    if (stats.isSymbolicLink()) {
      emitFeatureBad("git_worktree_create", "git_worktree_create_symlink_rejected");
      throw new WorktreeIsolationError(
        `Cannot create worktree: ${level} is a symlink. A repository-committed symlink at ` +
        `.claude, .claude/worktrees, or .claude/worktrees/<name> could redirect worktree ` +
        `creation outside the repository. Remove the symlink and retry.`);
    }
  }
}

// Mapping: ccs→assertNoSymlinkOnWorktreePath, e→repoRoot, t→worktreePath, r→levels, n→level,
//          o→stats, i/err, ka→fsp, qt→isENOENT, le→errorMessage, pe→emitFeatureBad,
//          h_→WorktreeIsolationError
```

**The check is `lstat`, not `realpath`.** That choice matters and is correct for this job:

- `lstat` does not follow the **final** component, so `stats.isSymbolicLink()` is a direct question
  about the component itself. `stat`/`realpath` would follow it and report the *target's* type — a
  symlink to a directory would answer "directory" and sail through.
- A `realpath`-and-compare design would also have to decide what the expected answer *is*, and on
  macOS `/tmp`→`/private/tmp` and case-insensitive filesystems that comparison is a minefield (the
  build carries `caseFold` (`zI`, `:224238`) and a platform-gated `caseFoldOnCaseInsensitiveFs`
  (`JY`, `:225281-225284`) precisely for this). `lstat` needs no such normalization.
- **ENOENT is `continue`, not failure.** This is the load-bearing edge case: on a fresh clone none
  of the three levels exists, and the *normal* path is three ENOENTs followed by the `mkdir` at
  `:224748`. Treating absence as success is what keeps the guard from breaking every first run.
- Any **other** `lstat` error — EACCES, ELOOP, EIO — is fatal with its own telemetry code
  (`git_worktree_create_lstat_failed`). It **fails closed**: an unreadable ancestor is not silently
  taken as "probably fine". That is the opposite of the copy-path screen in the carryover trap
  above, which merely skips.

### 8.3 Why all three levels, and why exactly three

Checking only the leaf would be useless, because a symlink at any ancestor relocates everything
below it. Walk the attacker's options:

| Symlink planted at | Attacker commits | What `git worktree add` then does | What the attacker gains |
|---|---|---|---|
| `.claude` → `../../outside` (or `~`, or `~/.claude`) | one blob, mode `120000`, named `.claude` | `mkdir -p <repo>/.claude/worktrees` resolves through the link and creates `worktrees/` **inside the target**; the checkout lands at `<target>/worktrees/<slug>` | **Widest reach.** Also poisons every other `.claude` consumer — settings, `skills/`, `agents/`, hooks. This is why the realpath-failure message at `:224863` tells the user to go look at `~/.claude/skills`: a redirected `.claude` is a plausible path to *persistent code execution*, since skills and hooks are executed later. |
| `.claude/worktrees` → `/some/dir` | requires committing a real `.claude/` dir containing the link | checkout lands at `/some/dir/<slug>` | Same write primitive, one level narrower, but **much less conspicuous**: a repo that legitimately ships `.claude/settings.json` looks entirely normal, and the hostile blob is one entry deep inside a directory the user expects to see. |
| `.claude/worktrees/<slug>` → `/some/dir` | must guess or influence the slug | `git worktree add` writes the checkout into `/some/dir` | **Narrowest but most surgical.** The slug is derivable: for the Agent tool it comes from `agentWorktreeSlug` (`vcs`, `:398714`) and for `--worktree` it is the user-supplied name. A PR whose description says *"review this with `--worktree fix-123`"* makes the slug attacker-known. Landing a full checkout on a precise path — a config dir, a `bin/` on `PATH` — is the highest-value variant. |

**Why the list stops at three.** Because the leaf can never be more than one component deeper.
`flattenWorktreeSlug` (`:224538-224540`) rewrites `/` to `+`, so a nested-looking name like
`feat/login` becomes the single component `feat+login`; and `validateWorktreeSlug` (`Kor`,
`:224449-224461`) independently rejects `.`/`..` segments, `.git`, absolute paths and anything
outside `/^[a-zA-Z0-9._-]+$/` (`XQg`, `:226300`). Note that `validateWorktreeSlug` is **carryover** —
`must not contain "." or ".." path segments` is **220=1 / 193=1** — so 193 already prevented the
*name* from escaping. What 193 did not prevent was the *directory it was joined onto* being a link.
The two guards are complementary, and the pre-existing one is exactly why a fixed three-element
list is sufficient rather than a general ancestor walk.

(The general ancestor walk does exist — see §8.6 — but it is needed only where the path is not
constructed by this code.)

### 8.4 Where the guard is called: three sites, three different dangerous verbs

`assertNoSymlinkOnWorktreePath` is invoked three times, and each guards a *different* primitive:

| Site | Enclosing function | Guards | The primitive it protects |
|---|---|---|---|
| `:224695` | `selfHealOrphanedWorktree` (`tZg`, `:224651`) | the `fs.rm(worktreePath, { recursive: true, force: true })` at `:224697` | **Arbitrary directory deletion.** If `.claude` or `.claude/worktrees` is a link, `worktreePath` resolves through it and the recursive delete lands on the target's contents. This is a *destructive* primitive and arguably worse than the write one — the changelog bullet does not mention it. |
| `:224706` | `createManagedWorktree` (`dcs`, `:224702`) | everything downstream, including the `mkdir(managedWorktreesDir(repoRoot), { recursive: true })` at `:224748` | **The `mkdir` itself.** `mkdir -p` follows existing symlinks in the prefix without complaint, so a linked `.claude` silently materializes `worktrees/` inside the target. Placing the guard at the very top of the function, before the resume/stat path, means no syscall touches the path first. |
| `:224810` | `createManagedWorktree`, immediately before the exec at `:224811` | `git worktree add` | **The checkout write.** This is the re-check discussed in §8.5. |

The ordering inside `createManagedWorktree` is worth stating explicitly, because it is the whole
argument for the design: guard (`:224706`) → existence/resume probe (`:224707`) → self-heal, which
re-guards (`:224733` → `:224695`) → `mkdir` (`:224748`) → base-ref resolution and `git fetch`
(`:224752-224806`, potentially *seconds* of network I/O) → **guard again** (`:224810`) → exec
(`:224811`).

The second guard is not redundant boilerplate. Between the first guard and the exec the process may
run a `git fetch` against a remote (`:224786`, `:224793`) — network I/O whose duration is set by the
remote, not by this code. Re-checking *after* that window and immediately before the write is a
deliberate narrowing of the race, and it is the single clearest signal that the author was thinking
about TOCTOU rather than only about the static case.

The minimal diff at that site is striking — the comma operator was used to bolt the guard onto the
existing statement:

```javascript
// ============================================
// createManagedWorktree - the re-check bolted onto the argv assembly, right before the exec
// Location: cli_inner_pretty.js:224807-224811 (220) vs :591624-591628 (193)
// ============================================

// ORIGINAL (for source lookup):
  let d = eo().worktree?.sparsePaths,
    p = ["worktree", "add"];
  if (d?.length) p.push("--no-checkout");
  (p.push("--no-track", "-B", o, n, c), await ccs(e, n));
  let { code: f, stderr: m } = await Xn(fo(), p, { cwd: e, env: { ...process.env, LC_ALL: "C" } });

// ORIGINAL, 2.1.193 baseline (for source lookup) — cli_inner_pretty.js:591624-591628 (193):
  let d = Lr().worktree?.sparsePaths,
    p = ["worktree", "add"];
  if (d?.length) p.push("--no-checkout");
  p.push("--no-track", "-B", o, r, l);
  let { code: f, stderr: m } = await Vr(yo(), p, { cwd: e, env: { ...process.env, LC_ALL: "C" } });

// READABLE (for understanding):
  const sparsePaths = getConfig().worktree?.sparsePaths;
  const argv = ["worktree", "add"];
  if (sparsePaths?.length) argv.push("--no-checkout");
  argv.push("--no-track", "-B", branchName, worktreePath, baseRef);
  await assertNoSymlinkOnWorktreePath(repoRoot, worktreePath);   // ← the only added line
  const { code, stderr } = await execGit(gitBin(), argv,
    { cwd: repoRoot, env: { ...process.env, LC_ALL: "C" } });

// Mapping: d→sparsePaths, p→argv, o→branchName, n/r→worktreePath, c/l→baseRef, e→repoRoot,
//          Xn/Vr→execGit, fo/yo→gitBin, eo/Lr→getConfig, ccs→assertNoSymlinkOnWorktreePath
```

### 8.5 TOCTOU verdict — **not race-free by construction, but the race is detected after the fact**

Stated plainly, because this is the question a reader most needs answered honestly:

**The check is a classic check-then-act and is *not* atomically TOCTOU-safe.**
`assertNoSymlinkOnWorktreePath` does an `lstat` on a *path string*, then returns; the path is
**re-resolved from scratch** by a separate `git` process spawned at `:224811`. Nothing carries a
file descriptor across the boundary. There is no `O_NOFOLLOW`, no `openat`-relative walk, no
`fs.opendir` handle reused for the write, and no attempt to pin the parent directory. Node's
`fs/promises` surface offers no portable way to hand a directory fd to a child process anyway, and
the write is performed by `git`, which will do its own full path resolution. So an attacker who can
replace `.claude` with a symlink **in the window between `:224810` and `git`'s own resolution**
still wins the write.

Three things bound the damage, and they should be read as *defense in depth*, not as a fix:

1. **The window is deliberately minimized.** The re-check at `:224810` sits after all the slow work
   (fetch, rev-parse) and immediately before the spawn. The remaining gap is process-spawn latency,
   not network latency. Contrast the naive placement — a single check at function entry — which
   would have left the entire `git fetch` inside the window.
2. **Winning the race requires local write access to the checkout**, i.e. the attacker must already
   be running code on the machine at the same time. That is a strictly stronger precondition than
   the threat this bullet actually addresses (a *passive* symlink sitting in a cloned tree), and an
   attacker with concurrent local code execution has cheaper paths to the same goal.
3. **A won race is detected immediately afterwards** by the containment re-verification in §8.6,
   which resolves the *actual* result and refuses to proceed.

**Verdict: MEDIUM-strength mitigation.** It fully closes the *static* attack the changelog describes
(a symlink committed in the repo and present at rest — this is now impossible), it does **not**
close an active local race, and the code itself knows this: the realpath-failure branch at
`:224861-224863` tells the user the write *may already have happened*
("the checkout may have been written through a since-removed link to a location outside the
repository — check `~/.claude/skills` and other sensitive locations for unexpected content").
That message is an explicit admission of a residual window, and its presence is good evidence the
authors reasoned about the race rather than overlooking it.

### 8.6 The post-write containment re-verification (how a won race is caught)

```javascript
// ============================================
// createManagedWorktree - post-add containment check; the backstop for a lost TOCTOU race
// Location: cli_inner_pretty.js:224838-224865
// ============================================

// ORIGINAL (for source lookup):
  let g = async (y) => {
    if (await VNe(n))
      (await Xn(fo(), ["worktree", "remove", "--force", n], { cwd: e }),
        await Xn(fo(), ["worktree", "prune"], { cwd: e }));
    else if (
      await ka.readlink(n).then(
        () => !1,
        (_) => Bt(_) === "EINVAL" || qt(_),
      )
    )
      await ka.unlink(Ha.join(n, ".git")).catch(() => {});
    throw new h_(y);
  };
  try {
    let [y, _] = await Promise.all([ka.realpath(n), ka.realpath(e)]),
      E = Ha.join(IVe(_), Ha.basename(n));
    if (JY(y) !== JY(E))
      (pe("git_worktree_create", "git_worktree_create_containment_failed"),
        await g(`Cannot create worktree: ${n} resolved to ${y}, which is not the expected worktree location ${E}.`));
  } catch (y) {
    if (y instanceof h_) throw y;
    (pe("git_worktree_create", "git_worktree_create_realpath_failed"),
      await g(
        `Cannot create worktree: failed to verify containment of ${n}: ${le(y)}. The path no longer resolves, so the checkout may have been written ` +
          "through a since-removed link to a location outside the repository \u2014 " +
          "check ~/.claude/skills and other sensitive locations for unexpected content.",
      ));
  }

// READABLE (for understanding):
  const abortAndUnwind = async (message) => {
    if (await ensureNoReparsePoint(worktreePath)) {
      await execGit(gitBin(), ["worktree", "remove", "--force", worktreePath], { cwd: repoRoot });
      await execGit(gitBin(), ["worktree", "prune"], { cwd: repoRoot });
    } else if (await fsp.readlink(worktreePath).then(
                 () => false,                                     // it IS a link -> don't unlink .git
                 (e) => errorCode(e) === "EINVAL" || isENOENT(e))) // not a link -> safe to detach
      await fsp.unlink(path.join(worktreePath, ".git")).catch(() => {});
    throw new WorktreeIsolationError(message);
  };
  try {
    const [actual, realRepoRoot] = await Promise.all([
      fsp.realpath(worktreePath), fsp.realpath(repoRoot),
    ]);
    const expected = path.join(managedWorktreesDir(realRepoRoot), path.basename(worktreePath));
    if (caseFoldOnCaseInsensitiveFs(actual) !== caseFoldOnCaseInsensitiveFs(expected)) {
      emitFeatureBad("git_worktree_create", "git_worktree_create_containment_failed");
      await abortAndUnwind(
        `Cannot create worktree: ${worktreePath} resolved to ${actual}, ` +
        `which is not the expected worktree location ${expected}.`);
    }
  } catch (err) {
    if (err instanceof WorktreeIsolationError) throw err;          // don't re-wrap our own abort
    emitFeatureBad("git_worktree_create", "git_worktree_create_realpath_failed");
    await abortAndUnwind(
      `Cannot create worktree: failed to verify containment of ${worktreePath}: ` +
      `${errorMessage(err)}. The path no longer resolves, so the checkout may have been written ` +
      `through a since-removed link to a location outside the repository — ` +
      `check ~/.claude/skills and other sensitive locations for unexpected content.`);
  }

// Mapping: g→abortAndUnwind, y→actual/err, _→realRepoRoot, E→expected, n→worktreePath, e→repoRoot,
//          VNe→ensureNoReparsePoint, JY→caseFoldOnCaseInsensitiveFs, IVe→managedWorktreesDir,
//          Bt→errorCode, qt→isENOENT, le→errorMessage, pe→emitFeatureBad, h_→WorktreeIsolationError
```

**How it works:**

1. **`realpath` both sides, then compare.** Here `realpath` is the *right* call, precisely because
   `lstat` was right earlier: the question has changed from "is this component a link?" to "where did
   the write actually land?". Resolving `repoRoot` too (rather than using the raw string) is what
   makes the comparison valid on macOS, where the repo may sit under `/tmp` → `/private/tmp`.
2. **Comparison is case-folded only where the filesystem is** — `caseFoldOnCaseInsensitiveFs`
   (`:225281-225284`) folds on Windows and macOS and is the identity on Linux. Folding
   unconditionally would let `A` and `a` be conflated on a case-sensitive filesystem, which is a
   real (if narrow) bypass; not folding at all would produce false alarms on macOS.
3. **`basename(worktreePath)` is re-derived**, so the expected path is rebuilt from the *resolved*
   repo root rather than trusted from the earlier construction.
4. **Failure unwinds rather than leaving the artifact.** `abortAndUnwind` prefers
   `git worktree remove --force` + `prune`, falling back to unlinking just the `.git` pointer file
   when the path is itself a link (the `readlink` probe deliberately inverts: **success** means it
   *is* a symlink, so removing `.git` "inside" it is refused). It always ends in a throw.
5. **The `catch` re-throws its own error type unchanged** (`if (err instanceof WorktreeIsolationError) throw err`)
   so that an abort raised *inside* `abortAndUnwind` is not recycled as a "realpath failed" report.
6. **A `realpath` failure is treated as an attack indicator, not a glitch** — if the path stopped
   resolving between the write and the check, the most likely explanation is that a link was used
   and then removed. Hence the unusually specific user instruction to inspect `~/.claude/skills`.

**Key insight:** the two checks are deliberately asymmetric — `lstat` *before* (prevent, cheap,
no normalization) and `realpath` *after* (detect, authoritative, normalization-heavy). Neither alone
is sufficient: `lstat` alone loses the race; `realpath` alone would only ever tell you about damage
already done, and could not stop the `rm -rf` at `:224697` at all.

### 8.7 The sibling guard: hook-supplied worktree paths

The `WorktreeCreate` hook lets a user point worktree isolation at another VCS by emitting an
arbitrary path (`:225602`, `:225176`). That path is not constructed by `managedWorktreePath`, so the
fixed three-level list does not apply — and the same release added a **general ancestor walk** for
it, duplicated verbatim in `createWorktreeForSession` (`:225138-225158`) and `createAgentWorktree`
(`:225567-225588`):

```javascript
// ============================================
// findSymlinkedAncestor - walk every component from an ancestor root down to the candidate path
// Location: cli_inner_pretty.js:224569-224590
// ============================================

// ORIGINAL (for source lookup):
async function Gdo(e, t) {
  if (E0(e) || E0(t)) return { component: e, kind: "unverifiable" };
  ((e = Nd(e)), (t = Nd(t)));
  let r = (i) => !i || i === ".." || i.startsWith(`..${Ha.sep}`) || Ha.isAbsolute(i),
    n = Ha.relative(t, e);
  if (r(n)) {
    if (((n = Ha.relative(JY(t), JY(e))), r(n))) return null;
  }
  let o = t;
  for (let i of n.split(Ha.sep)) {
    o = Ha.join(o, i);
    let s;
    try {
      s = await ka.lstat(o);
    } catch (a) {
      if (qt(a)) return null;
      return { component: o, kind: "unverifiable" };
    }
    if (s.isSymbolicLink()) return { component: o, kind: "symlink" };
  }
  return null;
}

// READABLE (for understanding):
async function findSymlinkedAncestor(candidatePath, ancestorRoot) {
  // A dotted spelling cannot be screened component-by-component at all — bail loudly.
  if (hasDotSegment(candidatePath) || hasDotSegment(ancestorRoot))
    return { component: candidatePath, kind: "unverifiable" };

  const escapes = (rel) =>
    !rel || rel === ".." || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel);

  let rel = path.relative(ancestorRoot, candidatePath);
  if (escapes(rel)) {
    // retry case-folded (macOS/Windows); if it still escapes, the path is simply
    // not under this root -> nothing to screen, not an error
    rel = path.relative(caseFoldOnCaseInsensitiveFs(ancestorRoot),
                        caseFoldOnCaseInsensitiveFs(candidatePath));
    if (escapes(rel)) return null;
  }

  let cursor = ancestorRoot;
  for (const segment of rel.split(path.sep)) {
    cursor = path.join(cursor, segment);
    let stats;
    try {
      stats = await fsp.lstat(cursor);
    } catch (err) {
      if (isENOENT(err)) return null;                       // absent -> nothing below it exists
      return { component: cursor, kind: "unverifiable" };   // EACCES etc -> fail closed
    }
    if (stats.isSymbolicLink()) return { component: cursor, kind: "symlink" };
  }
  return null;
}

// Mapping: Gdo→findSymlinkedAncestor, e→candidatePath, t→ancestorRoot, r→escapes, n→rel,
//          o→cursor, i→segment, s→stats, a→err, E0→hasDotSegment, Nd→identity (no-op normalizer),
//          JY→caseFoldOnCaseInsensitiveFs, qt→isENOENT
```

Three design points worth calling out, because they generalize the §8.2 guard rather than repeating
it:

- **Dot segments are rejected outright, not normalized.** `hasDotSegment` (`E0`, `:4170-4172`)
  matches any `.`/`..` component, and the caller refuses with *"the hook emitted a path with dot
  segments … The symlink screen cannot verify a dotted spelling — have the hook emit a normalized
  (dot-free) absolute path and retry"* (`:225142-225144`). The reasoning is sound and worth
  internalizing: `path.normalize` collapses `a/link/../b` to `a/b` **lexically**, but the kernel
  resolves `..` *after* following `link`, so the lexical answer and the real answer differ whenever a
  link is involved. A component walk over a dotted path therefore screens components that will never
  be traversed. Refusing is the only honest option.
- **"Cannot verify" is reported as loudly as "is a symlink."** The `kind` field is rendered into the
  message as *"is a symlink. "* vs *"could not be verified. "* (`:225154`, `:225584`), and **both**
  abort. Fail-closed again.
- **The walk runs from every plausible root** — `for (const root of new Set([gitRoot(cwd), projectRoot(cwd)].filter(Boolean)))`
  (`:225147`, `:225577`) — so a link is caught whichever ancestor the repository is anchored at.
  Returning `null` when the candidate is simply *not under* a given root (rather than erroring) is
  what makes iterating over several roots safe.

A third, adjacent net-new check in the same function guards **resume** rather than creation:
`git_worktree_resume_foreign_repo` (**220=1 / 193=0**, `:224719`) compares the `dev`/`ino` of the
existing worktree's registration directory against the current repo's `worktrees` dir
(`:224712-224723`) and refuses to adopt a directory registered to a different repository. Same family
of bug — "this path is not what it claims to be" — caught by identity rather than by spelling.

### 8.8 What 2.1.193 did: nothing

Read directly in the baseline bundle. `createManagedWorktree`'s 193 ancestor runs the orphan
self-heal (`:591541-591577 (193)`), then:

- `:591578 (193)` — `await eu.mkdir(V7t(e), { recursive: !0 });` — creates
  `<repoRoot>/.claude/worktrees` with **no preceding `lstat` of any kind**. `mkdir` with
  `recursive: true` happily follows an existing symlinked `.claude`.
- `:591572 (193)` — `await eu.rm(r, { recursive: !0, force: !0 })` in the self-heal path, again with
  no symlink screen; the 220 equivalent at `:224697` is preceded by the guard at `:224695`.
- `:591627-591628 (193)` — `p.push("--no-track", "-B", o, r, l);` then straight to the `git worktree add`
  exec. No guard.
- After the exec, 193 goes directly to the sparse-checkout block (`:591646 (193)`) and then
  `return` (`:591659 (193)`). **There is no containment verification at all** — the entire
  `realpath`-compare block that occupies `:224851-224865` in 220 has no counterpart.

The only symlink-awareness 193 had anywhere in this file is `isWorktreeWriteDestUnsafe`
(`:591461`, `:591731`, `:591753 (193)`), which screens *file copies into* a worktree that already
exists — i.e. it protects the contents, never the location. So the answer is unambiguous: **2.1.193
had no guard on the worktree-creation path**, and the bullet is a true NET_NEW security fix rather
than a hardening of something weaker.

### 8.9 What the user sees, and why it refuses instead of relocating

All of these surface as `WorktreeIsolationError` (`h_`, `:226301-226306`), a named `Error` subclass
whose name is registered in the *expected-error* allow-list `mNs` (`:426598-426642`, entry at
`:426641`, alongside `SymlinkWriteRefusedError` and `StagingDirTamperedError`). Membership has two
concrete effects, both read at their consumers: at `:425267-425275` the error is classified as
`tool_expected_error` (or its own `reasonCode`) with `isSad: true` — a *handled refusal*, not an
unexpected crash — and at `:430812` it is **re-thrown intact** rather than being flattened into a
generic failure string. So the specific wording above is what actually reaches the caller, by
design. Nothing catches it on the creation path: `createAgentWorktree` is awaited bare from
the Agent tool's `isolation: "worktree"` branch (`:398714`), so the message reaches the model as a
tool error and the user as CLI output. The telemetry is `tengu_feature_bad` with
`feature_name: "git_worktree_create"` and the `error_code` shown above (`pe`, `:47873-47875`), so
every distinct refusal reason is separately countable in the field.

**Why refuse rather than silently pick a safe path?** Three reasons, all readable from the code:

1. **Silently relocating would hide a compromise indicator.** A committed symlink at `.claude` is
   not a configuration quirk; it is a strong sign the repository is hostile or has been tampered
   with. Quietly working around it would deprive the user of the one moment they are guaranteed to
   look at the problem. The messages are written to be *self-explaining* to a reader who has never
   thought about this attack — `:224564` states the mechanism ("could redirect worktree creation
   outside the repository") and the remedy ("Remove the symlink and retry") in the same breath.
2. **The safe path is not knowable.** If `.claude` is a link, the user may genuinely have intended
   it (a dotfiles-managed `.claude` symlinked into the repo is a real pattern). The code cannot
   distinguish that from an attack, and choosing a different location would break the legitimate
   case as surely as it blocks the hostile one — while *also* silently changing where the user's
   work lands.
3. **It is consistent with the rest of the worktree code, which is uniformly fail-closed.** Compare
   §5.4's eighteen gates before an `rm -rf`, the `unverifiable` kind in §8.7 aborting exactly like
   `symlink`, and the non-ENOENT `lstat` error in §8.2 being fatal. The one place that *skips and
   continues* instead of aborting is the carryover copy-screen — and there the consequence of a skip
   is a missing convenience file, not a misplaced checkout.

**Key insight for the whole section:** the fix is not really "check for a symlink". It is the
recognition that a path assembled from `repoRoot + ".claude" + "worktrees" + slug` is **not a
trusted path just because the program built the string** — three of its four components are content
the repository controls. Every guard in §8.2, §8.6 and §8.7 is a different way of restating that one
observation.

### 8.10 Cross-module note

`49_sandbox` and `53_subagent_limits` both read the `:224562-224564` anchor and each deferred it as
belonging to the other; `42_workflow/README.md` covers only the related `.216` refusal. This section
is the owner of `.212` #8 (deferral **D1** in
[`_xval_contradictions.md`](../00_overview/_xval_contradictions.md) §2b). The path-shape refusals at
`:312384-312396` — *"blocked because its working directory is spelled in a form that cannot be safely
resolved"* — were checked and are a **different mechanism**: they gate a *worktree-isolated agent's
Bash cwd* against escaping into the shared checkout at command-execution time, not worktree creation.
They belong to the sandbox/isolation theme, not here, though they share the "spelling cannot be
trusted" reasoning of §8.7.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_background_agents_daemon.md](../00_overview/symbol_additions_v2_1_220_background_agents_daemon.md).

Key functions in this document:

- `workerRecordSchema` (fks) / `rosterFileSchema` (mks) - `looseObject` + `.catch(0)` stamps
- `extractUnknownRosterFields` (dwo) - captures a newer build's roster fields into `rosterExtras`
- `rosterEntry` (method) - spreads `rosterExtras` first so declared fields still win
- `readRoster` (v6) - corruption handling, `parseFailed` strip, `healed_stamp` observation
- `writeRoster` (cMy) / `mutateRoster` (rIe) - `parseFailed` destructure, serialised promise chain
- `redactIssuePath` (bad) / `redactShort` (A6) - telemetry redaction against a 43-key allow-list
- `readJobState` (Da) - `.in.shape` unknown-field preservation, composite mtime cache key
- `writeJobState` (um) - sidecar-key strip + in-flight write counter
- `readJobStateFresh` (mwo) - invalidate-read-retry for terminal states
- `adoptRosterOrphans` (Nad) - liveness classification, de-duplicated prune telemetry, tempo downgrade
- `classifyPidLiveness` (gks) / `isPidLive` (F1t) - `dead_pid` / `procstart_mismatch` / `live`
- `deleteJob` (Z3e) / `killJobConfirmed` (CJe) - confirm-before-remove, client-side roster eviction
- `cappedDispatch` (method) - the roster-safe dispatch projection that drops PATH/EXTRA_BODY/auth
- `buildWorkerEnv` (jhp) - PATH case-collision fix and base-URL-aware auth scrubbing
- `applyProcessWrapperToWorkerEnv` (Ghp) - propagate the launcher except for `exec` workers
- `buildClaimFrame` (static, mme) - builds a claimed spare's env from the *dispatch*, not the spare
- `buildSpareClaimFrame` (eSE) / `sendSpareClaimFrame` (tSE) / `claimSpareWorker` ($vl) - claim-socket delivery with a kill-on-failure path
- `releaseStaleClaudeWorktreeLocks` (WRu) - capped, double-checked stale-lock release
- `mayReleaseWorktreeLock` (RVe) / `isReleasableClaudeLockReason` (ARu) / `isLockedByLiveSession` (ycs)
- `isPidDefinitelyGone` (O5r) - ESRCH-only liveness test
- `removeRootlessAgentWorktree` (Vor) - eighteen gates and three `realpath` checkpoints
- `restoreWorktreeConfig` (DDt) - unset `extensions.worktreeConfig` after the last linked worktree
- `clearWindowsReparsePoint` (gRu) / `ensureNoReparsePoint` (VNe) - NTFS junction pre-clearing
- `runRetentionSweep` (rtf) / `retentionSkipReason` (pAa) - fail-closed cleanup gating

From §8 (worktree creation, `.212` #8):

- `assertNoSymlinkOnWorktreePath` (ccs) - the three-level `lstat` screen; `git_worktree_create_symlink_rejected`
- `createManagedWorktree` (dcs) - creation flow; guards at entry and again immediately before `git worktree add`
- `selfHealOrphanedWorktree` (tZg) - re-guards before the recursive `rm` of an orphaned worktree dir
- `managedWorktreesDir` (IVe) - `<repoRoot>/.claude/worktrees`, the attacker-controllable prefix
- `managedWorktreePath` (kRu) / `flattenWorktreeSlug` (xRu) - slug flattening (`/`→`+`) is why three levels suffice
- `validateWorktreeSlug` (Kor) - carryover `.`/`..`/`.git`/charset screen on the worktree *name*
- `findSymlinkedAncestor` (Gdo) - general component walk for hook-supplied paths; `symlink` vs `unverifiable`
- `hasDotSegment` (E0) - dotted spellings are refused, never normalized
- `caseFoldOnCaseInsensitiveFs` (JY) / `caseFold` (zI) - platform-gated path comparison
- `createAgentWorktree` (MDt) / `createWorktreeForSession` (E7r) - the two hook-path guard call sites
- `WorktreeIsolationError` (h_) - the refusal type, allow-listed for telemetry at `:426641`
- `emitFeatureBad` (pe) - `tengu_feature_bad` with `feature_name` + `error_code`
- `isWorktreeWriteDestUnsafe` (Bdo) - ⚠ carryover copy-screen, **not** part of this delta
