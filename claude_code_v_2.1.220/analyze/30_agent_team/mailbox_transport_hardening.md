# The teammate mailbox: transport, wire format, and the `.207` crash-loop fix

> Bundles per [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §1. Every line number below was read in
> `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`; baseline lines are
> tagged `(193)`.

**The bullet this document answers** (2.1.207):

> *Fixed a crash loop in agent teams where a malformed teammate mailbox message caused repeated errors
> every second until the mailbox file was manually deleted*

That is the single richest agent-team change in this window. The fix is **~90 lines of net-new
validation and repair code** bolted onto a module that was otherwise carried over byte-for-byte. This
document reconstructs the transport, shows exactly how a bad entry produced a once-per-poll error
forever, and explains what 2.1.220 does instead — and, importantly, what it still does *not* do.

---

## 0. The machine being patched

Agent teams talk over a **file-per-recipient JSON mailbox on local disk**. There is no socket, no
daemon, and no broker between a leader and a teammate in the same team: the sender appends an object to
the recipient's inbox file under an advisory lock, and the recipient polls that file.

### 0.1 Path layout

```javascript
// ============================================
// getInboxPath - resolves <configDir>/teams/<team>/inboxes/<agent>.json
// Location: cli_inner_pretty.js:325229-325236
// ============================================

// ORIGINAL (for source lookup):
function y1t(e, t) {
  let r = t || om() || "default",
    n = odr(r),
    o = odr(e),
    i = bAo.join(H0t(), n, "inboxes"),
    s = bAo.join(i, `${o}.json`);
  return (w(`[TeammateMailbox] getInboxPath: agent=${e}, team=${r}, fullPath=${s}`), s);
}

// READABLE (for understanding):
function getInboxPath(agentName, teamName) {
  let team = teamName || getCurrentTeamName() || "default",
    safeTeam = sanitizeForFilename(team),
    safeAgent = sanitizeForFilename(agentName),
    inboxDir = path.join(getTeamsRootDir(), safeTeam, "inboxes"),
    inboxFile = path.join(inboxDir, `${safeAgent}.json`);
  return (debug(`[TeammateMailbox] getInboxPath: agent=${agentName}, team=${team}, fullPath=${inboxFile}`), inboxFile);
}

// Mapping: y1t→getInboxPath, om→getCurrentTeamName, odr→sanitizeForFilename,
//          H0t→getTeamsRootDir, bAo→path, w→debug
```

`getTeamsRootDir` (`H0t`, `:14679-14681`) is `path.join(getClaudeConfigDir(), "teams")`, so a concrete
inbox is `~/.claude/teams/<team>/inboxes/<agent>.json`. The path is also on the standard ignore list
(`"**/.claude/mailbox/"`, `:820023`) — that literal is **220=1 / 193=1**, pure carryover, and note it
points at a *different* directory name than the one the code actually writes to, which is worth
flagging as a stale ignore entry.

### 0.2 The entry schema

```javascript
// ============================================
// MailboxEntrySchema - the zod shape every inbox entry must satisfy
// Location: cli_inner_pretty.js:325698-325708
// ============================================

// ORIGINAL (for source lookup):
(jid = Se(() =>
  v.looseObject({
    type: v.string().optional(),
    from: v.string(),
    text: v.string(),
    timestamp: v.string(),
    read: v.boolean().optional(),
    color: v.string().optional(),
    summary: v.string().optional(),
  }),
));

// READABLE (for understanding):
mailboxEntrySchema = memoize(() =>
  z.looseObject({
    type: z.string().optional(),        // "message" is stamped in if absent
    from: z.string(),                   // sender display name
    text: z.string(),                   // payload: plain text OR a JSON protocol frame
    timestamp: z.string(),              // ISO-8601
    read: z.boolean().optional(),       // "delivered"; entries are DELETED, not flipped
    color: z.string().optional(),       // sender's assigned ink colour
    summary: z.string().optional(),     // optional short label rendered in the UI
  }),
);

// Mapping: jid→mailboxEntrySchema, Se→memoize, v→zod
```

Two structural points matter for everything below:

1. **`text` is a string, always** — even for structured control traffic. Every protocol frame
   (`permission_request`, `shutdown_request`, `idle_notification`, `mode_set_request`,
   `plan_approval_*`, …) is `JSON.stringify`-ed into `text` and re-parsed by a `try { Ut(e) } catch {}`
   predicate on receipt (`:325418-325424`, `:325452-325465`, `:325486-325499`, `:325528-325580`).
   The mailbox is therefore a **double-encoded** channel: JSON array of objects, one field of which is
   itself JSON. That doubles the number of places a shape can go wrong, and it is the reason a bad
   `text` is so damaging: it is *dereferenced as a string* (`.substring`, XML wrapping) in code paths
   that never re-validate.
2. **`looseObject`** — unknown keys pass. So the schema is a floor, not a contract; a sender can add
   fields (and 2.1.220 does: see §4).

### 0.3 The read side is a poll loop, and that is the crash-loop amplifier

```javascript
// ============================================
// waitForNextTeammateInput - the teammate's 500 ms poll loop (abbreviated)
// Location: cli_inner_pretty.js:396353-396405
// ============================================

// ORIGINAL (for source lookup):
async function k8y(e, t, r, n, o, i, s, a = !1) {
  ...
  while (!t.signal.aborted) {
    if (d > 0) await vr(500);
    d++;
    ...
    if (s) continue;
    w(`[inProcessRunner] ${e.agentName} poll #${d}: checking mailbox`);
    try {
      let _ = await Yvd(e, r, o);
      if (_) return _;
    } catch (_) {
      w(`[inProcessRunner] ${e.agentName} poll error: ${_}`);
    }
    let y = await Kvd(i, e.agentName);
    if (y) return { type: "new_message", message: y, from: "task-list" };
  }
  ...
}

// READABLE (for understanding):
async function waitForNextTeammateInput(identity, abortCtl, taskId, getAppState, taskRegistry,
                                        parentSessionId, standalone, holdEvict = false) {
  ...
  while (!abortCtl.signal.aborted) {
    if (pollCount > 0) await sleep(500);          // fixed 500 ms cadence, NO backoff
    pollCount++;
    ...
    if (standalone) continue;                     // headless leads never poll a mailbox
    debug(`[inProcessRunner] ${identity.agentName} poll #${pollCount}: checking mailbox`);
    try {
      let drained = await drainMailbox(identity, taskId, taskRegistry);
      if (drained) return drained;
    } catch (err) {
      debug(`[inProcessRunner] ${identity.agentName} poll error: ${err}`);   // swallow, keep polling
    }
    let claimed = await claimNextOpenTask(parentSessionId, identity.agentName);
    if (claimed) return { type: "new_message", message: claimed, from: "task-list" };
  }
  ...
}

// Mapping: k8y→waitForNextTeammateInput, vr→sleep, Yvd→drainMailbox, Kvd→claimNextOpenTask,
//          w→debug, s→standalone, a→holdEvict
```

### The `.207` crash loop, derived

**What it does (the bug):** a single malformed entry in an inbox file makes the teammate log an error
roughly twice a second, forever, and never make progress — with no self-repair and no way out except
deleting the file.

**How it works:**

1. The loop sleeps **500 ms** (`vr(500)`, `:396359`) and calls the drain function. There is **no
   exponential backoff and no failure counter** — the cadence is constant regardless of outcome. (The
   changelog says "every second"; the code says every 500 ms plus the cost of one file read, which is
   the same thing to a human watching a terminal.)
2. In 2.1.193 the entire drain body was **inline inside the `try`** (`:427768-427820 (193)`), so any
   throw inside it was caught by the loop's own `catch` and reduced to one `poll error:` debug line.
3. The drain walks unread entries and, for anything that parses as a structured frame but is not a
   recognised one, logs `dropping protocol frame from ${c.from}: ${c.text.substring(0, 80)}`
   (`:396338`, and its 193 twin). **`.substring` on a non-string `text` throws a `TypeError`.**
4. The throw happens *before* `markMessagesAsRead` (`fpt`, `:325345`) runs — the delivered-message
   prune is the **last** statement of each drain branch (`:325342`, `:325348`). So the poison entry is
   never removed.
5. Next tick: same file, same entry, same throw. The system is a fixpoint.

**Why the shape was `text`:** you do not have to guess. The 2.1.220 fix's own error taxonomy enumerates
the failure modes it was written for, and **three of its four named cases are about `text`**:
`missing text`, `null text`, `non-string text` (`:325167-325169`). That is a direct fingerprint of the
production incident.

**Why it was unrecoverable:** the mailbox has no quarantine, no dead-letter file and no TTL. `read`
never becomes `true` — `markMessagesAsRead` *deletes* delivered entries (`:325362-325363`) — so the only
mechanism that could have evicted the entry is the very code path that was throwing.

**Key insight:** the crash loop is not caused by a parser that is too strict; it is caused by a
**parser that is too permissive combined with a consumer that is not**. `Ut` (JSON.parse) happily
returns `5` or `null` for a `text` field, and every downstream string operation then explodes. The
2.1.220 fix does not make the loop more resilient — it makes the *data* conform, at both ends.

---

## 1. What 2.1.220 added: skip + background prune, not quarantine

The answer to "quarantine? skip? delete? backoff?" is: **skip on read, delete asynchronously, refuse on
write, and de-duplicate the telemetry.** No quarantine file, no rename-aside, no backoff.

The whole of this is net-new. Delta proof for every literal in the cluster:

| Literal / export | 220 | 193 |
|---|---|---|
| `dropped schema-invalid inbox entry` | 1 (`:325163`) | **0** |
| `refused mailbox write` | 4 (`:325275`, `:325279` ×2 contexts) | **0** |
| `inbox file is not an array` | 1 (`:325181`) | **0** |
| `pruneInvalidMailboxEntries` (export) | 1 (`:325091`) | **0** |
| `flushPendingMailboxPrunes` (export) | 1 (`:325116`) | **0** |
| `msg_id` | 10 (`:325306` et al.) | **0** |
| `FAILURE_REASON_MAX_LENGTH` (export) | 1 (`:325135`) | **0** |

…while the rest of the module's export table is untouched carryover — `messageIdentityKey`,
`markMessagesAsReadByPredicate`, `getLastPeerDmSummary`, `isHeadlessLeadDisplayableMessage`,
`TeammateTerminatedMessageSchema`, `TaskCompletedMessageSchema` are each **220=1 / 193=1**. This is a
surgical patch to a mature module, exactly the pattern `_GROUND_TRUTH` §6.4 describes for this window.

### 1.1 The validating reader

```javascript
// ============================================
// partitionValidMailboxEntries - splits a parsed inbox into valid entries + a dropped count
// Location: cli_inner_pretty.js:325185-325199
// ============================================

// ORIGINAL (for source lookup):
function qid(e, t) {
  if (!Array.isArray(e)) return (VDy(t, e), { valid: [], droppedCount: 1 });
  let r = [],
    n = 0;
  for (let o of e) {
    let i = jid().safeParse(o);
    if (i.success) r.push(o);
    else {
      n++;
      let s = Gid(o, i.error.issues);
      if (qDy(t, o, s)) w(`[TeammateMailbox] dropping schema-invalid inbox entry (${s})`, { level: "warn" });
    }
  }
  return { valid: r, droppedCount: n };
}

// READABLE (for understanding):
function partitionValidMailboxEntries(parsed, inboxPath) {
  if (!Array.isArray(parsed)) {
    reportNonArrayInboxOnce(inboxPath, parsed);
    return { valid: [], droppedCount: 1 };          // whole file counts as ONE drop
  }
  let valid = [], droppedCount = 0;
  for (let entry of parsed) {
    let result = mailboxEntrySchema().safeParse(entry);
    if (result.success) valid.push(entry);
    else {
      droppedCount++;
      let shapeDigest = describeEntryShape(entry, result.error.issues);
      if (reportDroppedEntryOnce(inboxPath, entry, shapeDigest))       // dedup gate
        warn(`[TeammateMailbox] dropping schema-invalid inbox entry (${shapeDigest})`);
    }
  }
  return { valid, droppedCount };
}

// Mapping: qid→partitionValidMailboxEntries, VDy→reportNonArrayInboxOnce, jid→mailboxEntrySchema,
//          Gid→describeEntryShape, qDy→reportDroppedEntryOnce, w→warn
```

`readMailbox` now routes every read through it:

```javascript
// ============================================
// readMailbox - reads + validates an inbox, scheduling a background prune when anything was dropped
// Location: cli_inner_pretty.js:325243-325261
// ============================================

// ORIGINAL (for source lookup):
async function qze(e, t) {
  let r = y1t(e, t);
  w(`[TeammateMailbox] readMailbox: path=${r}`);
  try {
    let n = await qi().read(r),
      { valid: o, droppedCount: i } = qid(Ut(n), r);
    if (i > 0) KDy(r);
    for (let s of o) if (s.type === void 0) s.type = "message";
    return (
      w(`[TeammateMailbox] readMailbox: read ${o.length} message(s)` + (i > 0 ? `, dropped ${i} invalid` : "")),
      o
    );
  } catch (n) {
    if (Bt(n) === "ENOENT") return (w("[TeammateMailbox] readMailbox: file does not exist"), []);
    if (n instanceof SyntaxError)
      return (w(`[TeammateMailbox] readMailbox: unparseable inbox, treating as empty: ${n}`), []);
    return (w(`Failed to read inbox for ${e}: ${n}`), xe(n), []);
  }
}

// READABLE (for understanding):
async function readMailbox(agentName, teamName) {
  let inboxPath = getInboxPath(agentName, teamName);
  debug(`[TeammateMailbox] readMailbox: path=${inboxPath}`);
  try {
    let raw = await fs().read(inboxPath),
      { valid, droppedCount } = partitionValidMailboxEntries(jsonParse(raw), inboxPath);
    if (droppedCount > 0) schedulePruneOnce(inboxPath);      // fire-and-forget repair
    for (let entry of valid) if (entry.type === undefined) entry.type = "message";
    debug(`[TeammateMailbox] readMailbox: read ${valid.length} message(s)`
          + (droppedCount > 0 ? `, dropped ${droppedCount} invalid` : ""));
    return valid;
  } catch (err) {
    if (errnoOf(err) === "ENOENT") return [];                       // no inbox yet
    if (err instanceof SyntaxError) return [];                      // corrupt JSON -> empty
    reportError(err);
    return [];
  }
}

// Mapping: qze→readMailbox, y1t→getInboxPath, qi→fs, Ut→jsonParse,
//          qid→partitionValidMailboxEntries, KDy→schedulePruneOnce, Bt→errnoOf, xe→reportError
```

Note the one-line difference in the type back-fill loop: 193 wrote
`for (let s of o) if (s && s.type === void 0)` (`:374689 (193)`) — a defensive null guard. 220 wrote
`for (let s of o) if (s.type === void 0)` (`:325250`) — the guard was **removed** because the schema now
guarantees an object. That is a small but telling sign that the author considered the validation
authoritative rather than belt-and-braces.

### 1.2 The background prune

```javascript
// ============================================
// pruneInvalidMailboxEntries - rewrites an inbox with only schema-valid entries, under the file lock
// Location: cli_inner_pretty.js:325210-325228
// ============================================

// ORIGINAL (for source lookup):
async function Vid(e) {
  let t = `${e}.lock`,
    r;
  try {
    r = await fb(e, { lockfilePath: t, ...cdr });
    let n = await qi().read(e),
      { valid: o, droppedCount: i } = qid(Ut(n), e);
    if (i === 0) return;
    (await qi().atomicWrite(e, Ie(o, null, 2)),
      w(`[TeammateMailbox] pruned ${i} schema-invalid entr${i === 1 ? "y" : "ies"} at ${e}`));
  } catch (n) {
    w(`[TeammateMailbox] invalid-entry prune skipped: ${n}`);
  } finally {
    if (r) try { await r(); } catch {}
  }
}

// READABLE (for understanding):
async function pruneInvalidMailboxEntries(inboxPath) {
  let lockfilePath = `${inboxPath}.lock`, release;
  try {
    release = await acquireFileLock(inboxPath, { lockfilePath, ...MAILBOX_LOCK_OPTIONS });
    let raw = await fs().read(inboxPath),
      { valid, droppedCount } = partitionValidMailboxEntries(jsonParse(raw), inboxPath);
    if (droppedCount === 0) return;                          // re-check under the lock
    await fs().atomicWrite(inboxPath, jsonStringify(valid, null, 2));
    debug(`[TeammateMailbox] pruned ${droppedCount} schema-invalid entr${droppedCount === 1 ? "y" : "ies"} at ${inboxPath}`);
  } catch (err) {
    debug(`[TeammateMailbox] invalid-entry prune skipped: ${err}`);   // best-effort only
  } finally {
    if (release) try { await release(); } catch {}
  }
}

// Mapping: Vid→pruneInvalidMailboxEntries, fb→acquireFileLock, cdr→MAILBOX_LOCK_OPTIONS,
//          qi→fs, Ut→jsonParse, Ie→jsonStringify, qid→partitionValidMailboxEntries
```

and the single-flight wrapper:

```javascript
// ============================================
// schedulePruneOnce / flushPendingMailboxPrunes - one in-flight prune per inbox path
// Location: cli_inner_pretty.js:325200-325209
// ============================================

// ORIGINAL (for source lookup):
async function zDy() { await Promise.all(Array.from(_Ao.values())); }
function KDy(e) {
  if (_Ao.has(e)) return;
  let t = Vid(e).finally(() => { _Ao.delete(e); });
  _Ao.set(e, t);
}

// READABLE (for understanding):
async function flushPendingMailboxPrunes() { await Promise.all(Array.from(inFlightPrunes.values())); }
function schedulePruneOnce(inboxPath) {
  if (inFlightPrunes.has(inboxPath)) return;                 // collapse concurrent requests
  let promise = pruneInvalidMailboxEntries(inboxPath).finally(() => { inFlightPrunes.delete(inboxPath); });
  inFlightPrunes.set(inboxPath, promise);
}

// Mapping: zDy→flushPendingMailboxPrunes, KDy→schedulePruneOnce, Vid→pruneInvalidMailboxEntries,
//          _Ao→inFlightPrunes (Map<path, Promise>)
```

### Design decision: why prune in the background instead of during the read?

**What it does:** `readMailbox` returns the *valid* entries immediately and repairs the file on a
detached promise nobody awaits.

**How it works:**
1. The read path itself takes **no lock** — it is a plain `fs.read` + parse. That is what keeps a
   500 ms poll cheap.
2. When something was dropped, `schedulePruneOnce` starts a *separate* task that **does** take the
   `<inbox>.lock` (`:325211`, `:325214`) and re-reads the file **under the lock** (`:325215`) before
   deciding to rewrite. The `if (i === 0) return` re-check at `:325217` is the double-checked-locking
   arm: between the unlocked read and the lock acquisition, a concurrent prune may already have
   cleaned the file, and rewriting it would clobber messages written in the interim.
3. The `_Ao` map (`:325710`) makes it single-flight **per path**: at a 500 ms poll cadence, a poison
   entry would otherwise queue up hundreds of prunes before the first finished.
4. Every failure is swallowed into a debug line (`:325221`). A prune that cannot take the lock is
   simply skipped and re-attempted on the next poll that still sees a bad entry.

**Why this approach:**
- **Alternative A — validate-and-rewrite inside `readMailbox`.** Rejected: it would put a lock
  acquisition on the hot poll path of every teammate in the team, on every tick, forever.
- **Alternative B — quarantine by rename** (the pattern background agents use for job transcripts:
  `.orphaned-` at `:51506`). Rejected here, presumably because an inbox is a *stream* rather than a
  document: renaming the whole file to save one bad entry would discard the good entries queued behind
  it, and the sender has no way to learn it must resend.
- **Alternative C — mark the entry `read: true`.** Impossible in this schema: `read` is only ever used
  as a filter before deletion (`:325327`, `:325362`), so a "read" poison entry is functionally the same
  as a deleted one but leaves the file growing.
- **Trade-off accepted:** progress is decoupled from repair. If the prune never succeeds (lock always
  contended, read-only filesystem), the teammate still makes progress — it just re-drops and
  re-warns each tick. That is strictly better than 2.1.193, where it made *no* progress at all.

**Key insight:** the crash-loop fix is not the prune. **The fix is `partitionValidMailboxEntries`
returning `valid` instead of everything** — the loop stops crashing the moment bad entries stop
reaching the consumer. The prune is a *hygiene* pass that stops the warning spam and bounds file
growth. Distinguishing the two matters, because the prune is best-effort and can silently never run.

### 1.3 Telemetry de-duplication, and why it needs a cap

```javascript
// ============================================
// reportDroppedEntryOnce - reports each distinct bad entry once, globally capped
// Location: cli_inner_pretty.js:325150-325172
// ============================================

// ORIGINAL (for source lookup):
function WDy(e, t) {
  try {
    let r = Ie(t);
    return `${e}\x00${r.length}:${r.slice(0, GDy)}`;
  } catch { return `${e}\x00(unserializable)`; }
}
function qDy(e, t, r) {
  if (adr.size >= Wid) return !1;
  let n = WDy(e, t);
  if (adr.has(n)) return !1;
  adr.add(n);
  let o = `[TeammateMailbox] dropped schema-invalid inbox entry (${r})`;
  if (t === null || typeof t !== "object" || Array.isArray(t))
    return (xe(new Lr(o, "TeammateMailbox: dropped inbox entry that is not an object")), !0);
  let i = t.text;
  if (i === void 0) xe(new Lr(o, "TeammateMailbox: dropped inbox entry with missing text"));
  else if (i === null) xe(new Lr(o, "TeammateMailbox: dropped inbox entry with null text"));
  else if (typeof i !== "string") xe(new Lr(o, "TeammateMailbox: dropped inbox entry with non-string text"));
  else xe(new Lr(o, "TeammateMailbox: dropped inbox entry failing schema validation"));
  return !0;
}

// READABLE (for understanding):
function dropDedupKey(inboxPath, entry) {
  try {
    let json = jsonStringify(entry);
    return `${inboxPath}\x00${json.length}:${json.slice(0, DROP_KEY_MAX_CHARS)}`;
  } catch { return `${inboxPath}\x00(unserializable)`; }     // cyclic / BigInt payloads
}
function reportDroppedEntryOnce(inboxPath, entry, shapeDigest) {
  if (seenDrops.size >= MAX_TRACKED_DROPS) return false;     // hard stop at 100 distinct drops
  let key = dropDedupKey(inboxPath, entry);
  if (seenDrops.has(key)) return false;                      // already reported this exact entry
  seenDrops.add(key);
  let logMessage = `[TeammateMailbox] dropped schema-invalid inbox entry (${shapeDigest})`;
  if (entry === null || typeof entry !== "object" || Array.isArray(entry))
    return (reportError(new TelemetrySafeError(logMessage, "TeammateMailbox: dropped inbox entry that is not an object")), true);
  let text = entry.text;
  if (text === undefined)        reportError(new TelemetrySafeError(logMessage, "TeammateMailbox: dropped inbox entry with missing text"));
  else if (text === null)        reportError(new TelemetrySafeError(logMessage, "TeammateMailbox: dropped inbox entry with null text"));
  else if (typeof text !== "string") reportError(new TelemetrySafeError(logMessage, "TeammateMailbox: dropped inbox entry with non-string text"));
  else                           reportError(new TelemetrySafeError(logMessage, "TeammateMailbox: dropped inbox entry failing schema validation"));
  return true;
}

// Mapping: WDy→dropDedupKey, qDy→reportDroppedEntryOnce, adr→seenDrops (Set),
//          Wid→MAX_TRACKED_DROPS (100, :325662), GDy→DROP_KEY_MAX_CHARS (2048, :325663),
//          Ie→jsonStringify, xe→reportError, Lr→TelemetrySafeError
```

and the shape digest that the log line carries:

```javascript
// ============================================
// describeEntryShape - builds a PII-free "field:issueCode:actualType" digest of a rejected entry
// Location: cli_inner_pretty.js:325137-325149
// ============================================

// ORIGINAL (for source lookup):
function Gid(e, t) {
  if (e === null || typeof e !== "object" || Array.isArray(e))
    return `entry is ${e === null ? "null" : Array.isArray(e) ? "an array" : typeof e}`;
  return t.map((r) => {
      let n = r.path[0], o = typeof n === "string" ? n : String(n), i = e[o],
        s = i === void 0 ? (o in e ? "undefined" : "missing") : i === null ? "null" : typeof i;
      return `${o}:${r.code}:${s}`;
    }).join(", ");
}

// READABLE (for understanding):
function describeEntryShape(entry, zodIssues) {
  if (entry === null || typeof entry !== "object" || Array.isArray(entry))
    return `entry is ${entry === null ? "null" : Array.isArray(entry) ? "an array" : typeof entry}`;
  return zodIssues.map((issue) => {
      let field = typeof issue.path[0] === "string" ? issue.path[0] : String(issue.path[0]),
        value = entry[field],
        actual = value === undefined ? (field in entry ? "undefined" : "missing")
               : value === null ? "null" : typeof value;
      return `${field}:${issue.code}:${actual}`;             // e.g. "text:invalid_type:number"
    }).join(", ");
}

// Mapping: Gid→describeEntryShape
```

### Design decision: three layers of privacy and volume control on one diagnostic

**What it does:** turns "an inbox entry was bad" into a bounded, content-free signal.

**How it works, and why each constant is what it is:**

1. **`describeEntryShape` never emits a value.** It emits `field:zodIssueCode:typeof`. A message body,
   a filename, a secret pasted into a teammate DM — none of it can reach the log line or the error
   report. This is the same discipline as the `TelemetrySafeError` class (`Lr`, `:19800-19807`), whose
   whole purpose is to carry a **fixed** `telemetryMessage` next to a variable `message`; only the
   fixed one is meant to leave the machine.
2. **Five fixed `telemetryMessage` constants**, not one. `not an object` / `missing text` /
   `null text` / `non-string text` / `failing schema validation`. That is a deliberately coarse
   histogram: it is enough to tell whether a fleet-wide regression is a serialiser bug (non-string
   `text`), a partial write (missing `text`), or a schema drift (generic) — without a free-text field
   anyone could accidentally fill with user data.
3. **`dropDedupKey` keys on `path + payload length + first 2048 chars`**, not on the whole payload.
   Length is included so that two entries sharing a 2048-char prefix but differing later still count
   as distinct. `GDy = 2048` (`:325663`) bounds the memory a single key can pin; with the 100-entry
   cap that is a **~200 KB worst case** for the dedup set, which is the actual reason the cap exists.
4. **`Wid = 100` (`:325662`) is a process-lifetime cap on *distinct* drops, and it fails closed:**
   `if (adr.size >= Wid) return !1` runs **before** the `has()` check, so once 100 distinct bad entries
   have been seen, `reportDroppedEntryOnce` returns `false` for *everything* — including entries it has
   already recorded. Reporting stops entirely; **dropping does not**. A reader debugging a
   large-scale corruption must know that silence after 100 distinct shapes is expected behaviour, not
   evidence the problem stopped.
5. `adr` and `_Ao` are module-level (`:325709-325710`) and never cleared, so all of this is
   per-process, not per-team and not per-session.

**Why this approach:** the ordering `cap → dedup → classify → report` is chosen so the *cheapest*
rejection happens first. The expensive step is `dropDedupKey`, which `JSON.stringify`s the offending
entry; putting the size cap ahead of it means a machine in a pathological state does no serialisation
work at all.

**Key insight:** every one of these constants exists to make the *fix* safe at the same 500 ms cadence
that made the *bug* unbearable. A naive fix — log a warning and skip — would have replaced a crash loop
with a log-spam loop and an unbounded error-reporting bill.

---

## 2. The write side: refuse the poison at the source

The read side alone would have left senders free to keep minting bad entries. 2.1.220 also validates on
write:

```javascript
// ============================================
// writeToMailbox - appends one message to a recipient inbox, refusing schema-invalid payloads
// Location: cli_inner_pretty.js:325267-325314
// ============================================

// ORIGINAL (for source lookup):
async function VT(e, t, r) {
  let n = jid().safeParse(t);
  if (!n.success) {
    let a = Gid(t, n.error.issues);
    (w(`[TeammateMailbox] writeToMailbox: refusing schema-invalid message for ${e} (${a})`, { level: "warn" }),
      xe(
        typeof t.text !== "string"
          ? new Lr(`[TeammateMailbox] refused mailbox write (${a})`, "TeammateMailbox: refused mailbox write with non-string text")
          : new Lr(`[TeammateMailbox] refused mailbox write (${a})`, "TeammateMailbox: refused mailbox write failing schema validation"),
      ));
    return;
  }
  await YDy(r);
  let o = y1t(e, r), i = `${o}.lock`;
  ...
  let s;
  try {
    s = await fb(o, { lockfilePath: i, ...cdr });
    let a = await qze(e, r),
      l = { ...t, ...t1t(), type: "message", read: !1 };
    return (a.push(l), await qi().atomicWrite(o, Ie(a, null, 2)),
      w(`[TeammateMailbox] Wrote message to ${e}'s inbox from ${t.from}`), l.msg_id);
  } catch (a) { (w(`Failed to write to inbox for ${e}: ${a}`), xe(a)); return; }
  finally { if (s) await s(); }
}

// READABLE (for understanding):
async function writeToMailbox(recipientName, message, teamName) {
  let parsed = mailboxEntrySchema().safeParse(message);
  if (!parsed.success) {                                     // NET-NEW in 2.1.220
    let shapeDigest = describeEntryShape(message, parsed.error.issues);
    warn(`[TeammateMailbox] writeToMailbox: refusing schema-invalid message for ${recipientName} (${shapeDigest})`);
    reportError(new TelemetrySafeError(
      `[TeammateMailbox] refused mailbox write (${shapeDigest})`,
      typeof message.text !== "string"
        ? "TeammateMailbox: refused mailbox write with non-string text"
        : "TeammateMailbox: refused mailbox write failing schema validation"));
    return;                                                  // silently returns undefined
  }
  await ensureInboxDir(teamName);
  let inboxPath = getInboxPath(recipientName, teamName), lockfilePath = `${inboxPath}.lock`;
  ...
  let release;
  try {
    release = await acquireFileLock(inboxPath, { lockfilePath, ...MAILBOX_LOCK_OPTIONS });
    let entries = await readMailbox(recipientName, teamName),
      stamped = { ...message, ...newMessageEnvelope(), type: "message", read: false };
    entries.push(stamped);
    await fs().atomicWrite(inboxPath, jsonStringify(entries, null, 2));
    debug(`[TeammateMailbox] Wrote message to ${recipientName}'s inbox from ${message.from}`);
    return stamped.msg_id;                                   // NET-NEW return value
  } catch (err) { reportError(err); return; }
  finally { if (release) await release(); }
}

// Mapping: VT→writeToMailbox, jid→mailboxEntrySchema, Gid→describeEntryShape, YDy→ensureInboxDir,
//          y1t→getInboxPath, fb→acquireFileLock, qze→readMailbox, t1t→newMessageEnvelope,
//          Ie→jsonStringify, xe→reportError, Lr→TelemetrySafeError
```

The 2.1.193 twin (`Jm`, `:374703-374729 (193)`) has **no validation at all** and its append line is
`let a = { ...t, type: "message", read: !1 };` (`:374720 (193)`) — no envelope, no return value.

### Failure modes the write path still has

These are honest observations from the code, not defects the changelog claims to have fixed:

1. **A refused write is invisible to the caller.** `writeToMailbox` `return`s `undefined` on refusal —
   the same value it returns on an I/O failure (`:325294`, `:325310`) and structurally the same as a
   *successful* write in 2.1.193, which returned nothing. Callers such as the `SendMessage` tool
   (`:418059`) put the result in `msg_id` and still report `success: !0` with `Message sent to …`
   (`:418065`). **A schema-invalid send is reported to the model as sent.** Only telemetry knows.
2. **Syntactically corrupt JSON is a silent black hole that self-heals destructively.** `readMailbox`
   maps `SyntaxError` to `[]` (`:325257-325258`) and the prune's own `Ut(n)` throws into
   `invalid-entry prune skipped` (`:325221`), so a truncated file is never repaired by the prune. But
   `writeToMailbox` reads via `readMailbox` (`:325300`) — getting `[]` — then `atomicWrite`s the array.
   The next send therefore **overwrites the corrupt file with exactly one message**, discarding every
   undelivered message that was in it. Progress is restored; data is lost; nothing is reported.
3. **The lock is advisory and retry-bounded**, not a mutex: `cdr = { retries: { retries: 10,
   minTimeout: 5, maxTimeout: 100 }, onCompromised: (e) => xe(e) }` (`:325697`). Worst case ~1 s of
   retries before the write throws. `onCompromised` reports but does not abort the operation.
4. **`markMessagesAsRead(agent, team, undefined)`** (`fpt`, `:325345`) computes
   `l = r === void 0 ? null : new Set(...)` and then `c = s.filter(u => !u.read && l !== null && …)`
   (`:325361-325362`), so an `undefined` third argument deletes **every unread message**. That is
   carryover behaviour (identical at `:374776-374778 (193)`), but it is a live foot-gun in a module
   whose other entry points are now defensive.
5. **`flushPendingMailboxPrunes` has no in-bundle caller** — it is exported at `:325116` and defined at
   `:325200`, and `grep -n 'zDy' ` returns only those two lines. It is a test/SDK seam. There is
   therefore **no shutdown barrier**: a prune in flight when the process exits is simply lost.

---

## 3. `msg_id` / `msgV`: an undocumented message envelope shared with the peer transport

Nothing in the 579-bullet changelog mentions this. It is 220-only:

```javascript
// ============================================
// newMessageEnvelope - stamps a wire-protocol version and a UUID on every outbound message
// Location: cli_inner_pretty.js:319761-319767
// ============================================

// ORIGINAL (for source lookup):
function SLy() { return A0e.randomUUID(); }
function t1t() { return { msgV: bLy, msg_id: SLy() }; }
var bLy = 1;

// READABLE (for understanding):
function newMessageId() { return crypto.randomUUID(); }
function newMessageEnvelope() { return { msgV: MESSAGE_WIRE_VERSION, msg_id: newMessageId() }; }
var MESSAGE_WIRE_VERSION = 1;

// Mapping: SLy→newMessageId, t1t→newMessageEnvelope, bLy→MESSAGE_WIRE_VERSION, A0e→crypto
```

**Delta proof:** `msg_id` **220=10 / 193=0**.

### Where it is used

| Site | What it stamps |
|---|---|
| `:325301` | every teammate-mailbox entry, inside `writeToMailbox` |
| `:319868`, `:319878` | `sendToUdsSocket` — cross-*session* peer DMs over a Unix domain socket, returning `{ msgId }` |
| `:319882` | `sendControlToUdsSocket` — control frames on the same socket |
| `:418066` | the `SendMessage` tool result (`msg_id: d`) |
| `:419019` | `msg_id: v.string().optional()` in a zod schema on the receive side |
| `:418808`, `:418846`, `:419224`, `:419316` | bridge/peer delivery acknowledgements |

**Why this matters more than its size suggests:** it is the first time the **local file mailbox** and
the **UDS peer-session transport** (`uds:` / `bridge:` addresses, `:319823-319843`) share an envelope.
Both now emit `{msgV: 1, msg_id: <uuid>}`, which makes end-to-end correlation and receiver-side
idempotency possible across two transports that previously had nothing in common. `msgV` being an
integer rather than a semver string implies the intended migration story is "branch on an integer",
which only works if it is stamped everywhere from the start — hence the shotgun rollout in one release.

The mailbox side does **not yet dedupe on `msg_id`**: no read path in the module consults it. So in
2.1.220 the field is *emitted and stored* but only *consumed* on the peer/bridge side (`:418846`,
`:419316`). That is normal for a rollout — writers ship a version ahead of readers — and it is exactly
the kind of claim that would be wrong if you inferred it from the field's existence instead of grepping
its consumers.

---

## 4. Bonus delta in the same module: `failureReason` is now sanitised and bounded

```javascript
// ============================================
// createIdleNotification - builds the idle/failed frame a teammate sends its leader
// Location: cli_inner_pretty.js:325406-325417
// ============================================

// ORIGINAL (for source lookup):
function ddr(e, t) {
  return {
    type: "idle_notification", from: e, timestamp: new Date().toISOString(),
    idleReason: t?.idleReason, summary: t?.summary,
    completedTaskId: t?.completedTaskId, completedStatus: t?.completedStatus,
    failureReason: t?.failureReason ? gp(t.failureReason).slice(0, ann) : void 0,
  };
}

// READABLE (for understanding):
function createIdleNotification(fromAgentName, opts) {
  return {
    type: "idle_notification", from: fromAgentName, timestamp: new Date().toISOString(),
    idleReason: opts?.idleReason, summary: opts?.summary,
    completedTaskId: opts?.completedTaskId, completedStatus: opts?.completedStatus,
    failureReason: opts?.failureReason
      ? collapseNewlines(opts.failureReason).slice(0, FAILURE_REASON_MAX_LENGTH) : undefined,
  };
}

// Mapping: ddr→createIdleNotification, gp→collapseNewlines (:20753, replaces "\n" runs),
//          ann→FAILURE_REASON_MAX_LENGTH (200, :325666)
```

2.1.193's twin (`l5t`, `:374821-374832 (193)`) passed `failureReason: t?.failureReason` **raw**. Two
things changed:

- `gp` (`:20753-20759`) strips newlines, so a multi-line API error cannot break the single-line frame
  rendering on the leader's side;
- `.slice(0, 200)` bounds it. `FAILURE_REASON_MAX_LENGTH = 200` (`:325666`) is exported from the module
  (`:325135`), **220=1 / 193=0**.

Why 200 and not, say, 2000? The value lands in a JSON string inside a mailbox entry that the leader
injects into its own context as text. 200 characters is roughly the length of a single-sentence API
error (`"Overloaded"`, `"500 Internal Server Error"`, a rate-limit blurb) and is small enough that a
flapping teammate cannot meaningfully grow the leader's prompt. It is a **prompt-budget** constant
disguised as a string-length constant.

Who produces `failureReason` is covered in
[`teammate_lifecycle_and_notifications.md`](teammate_lifecycle_and_notifications.md) §1.

---

## 5. What the `.207` bullet's proposed anchor gets wrong

[`../00_overview/_scope_v206_210.md`](../00_overview/_scope_v206_210.md) row 10 lists the anchors for
this bullet as `mailbox` (48/19) and **`tengu_team_mem_conflict_recovered`**, pointing at `:435325`.

The `mailbox` count is right and is the useful signal. **`tengu_team_mem_conflict_recovered` is a
mis-anchor.** It is 220=1 / 193=0, so it *is* net-new, but `:435325` sits inside the **team-memory
sync** subsystem (`tengu_team_mem_*`, 220=18 / 193=23 — a subsystem that *shrank*), which synchronises
`MEMORY.md`-style stores between team members. It has nothing to do with the inbox transport: no
`tengu_team_mem_*` gate is reachable from `readMailbox`, `writeToMailbox`, or the poll loop.

The correct anchors for the `.207` bullet are the ones in §1's table — and note that **the fix carries
no telemetry gate at all**; it reports through `reportError` + `TelemetrySafeError`, not through
`tengu_*`. Searching the new-gate list for this bullet was always going to fail.

---

## 6. Summary of the mailbox delta

| Concern | 2.1.193 | 2.1.220 |
|---|---|---|
| Entry validation on read | none | `safeParse` per entry, invalid skipped (`:325185-325199`) |
| Non-array top level | `for…of` over a non-array → throw | reported once, treated as empty (`:325173-325186`) |
| Repair | none | background single-flight prune under the lock (`:325200-325228`) |
| Validation on write | none | `safeParse` + refuse (`:325267-325284`) |
| Diagnostic volume | n/a | dedup Set, cap 100, key ≤ 2048 chars (`:325150-325172`) |
| Diagnostic content | n/a | `field:code:typeof` digest only (`:325137-325149`) |
| Message identity | none | `{msgV: 1, msg_id: uuid}` (`:319761-319767`) |
| `failureReason` | raw, unbounded | newline-collapsed, 200 chars (`:325415`) |
| Poll cadence on failure | 500 ms, forever | 500 ms, forever *(unchanged — no backoff was added)* |
| Rest of the module | — | byte-equivalent carryover |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [`symbol_additions_v2_1_220_agent_team.md`](../00_overview/symbol_additions_v2_1_220_agent_team.md).

Key functions in this document:
- `getInboxPath` (`y1t`, `:325229`) - `<configDir>/teams/<team>/inboxes/<agent>.json`
- `getTeamsRootDir` (`H0t`, `:14679`) - config-dir + `teams`
- `mailboxEntrySchema` (`jid`, `:325698`) - the `looseObject` inbox-entry shape
- `partitionValidMailboxEntries` (`qid`, `:325185`) - **net-new**; splits valid from dropped
- `describeEntryShape` (`Gid`, `:325137`) - **net-new**; PII-free `field:code:typeof` digest
- `dropDedupKey` (`WDy`, `:325150`) - **net-new**; path + length + 2048-char prefix
- `reportDroppedEntryOnce` (`qDy`, `:325158`) - **net-new**; capped, deduped, 4-way classified report
- `reportNonArrayInboxOnce` (`VDy`, `:325173`) - **net-new**; top-level-shape report
- `pruneInvalidMailboxEntries` (`Vid`, `:325210`) - **net-new**; locked rewrite with re-check
- `schedulePruneOnce` (`KDy`, `:325203`) - **net-new**; single-flight per inbox path
- `flushPendingMailboxPrunes` (`zDy`, `:325200`) - **net-new**; exported, no in-bundle caller
- `readMailbox` (`qze`, `:325243`) - validating read; schedules a prune when anything was dropped
- `writeToMailbox` (`VT`, `:325267`) - validating write; returns the new `msg_id`
- `markMessagesAsRead` (`fpt`, `:325345`) - deletes delivered entries; `undefined` list deletes all
- `markSingleMessageAsRead` (`SAo`, `:325315`) - removes one targeted entry
- `createIdleNotification` (`ddr`, `:325406`) - now sanitises + truncates `failureReason`
- `newMessageEnvelope` (`t1t`, `:319764`) - **net-new**; `{msgV: 1, msg_id: uuid}`
- `waitForNextTeammateInput` (`k8y`, `:396353`) - the 500 ms poll loop that amplified the bug
- `drainMailbox` (`Yvd`, `:396288`) - **net-new as a standalone function**; shutdown-first drain
- `TelemetrySafeError` (`Lr`, `:19800`) - carries a fixed `telemetryMessage` beside a variable message
