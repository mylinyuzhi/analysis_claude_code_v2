# Disk, transcript and startup footprint (2.1.193 → 2.1.220)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`. Every bare `cli_inner_pretty.js:<line>` is a **220** line I read.

Where §1's session store overlaps the background-agent work, this document links to
[`36_background_agents/session_store_and_worktrees.md`](../36_background_agents/session_store_and_worktrees.md)
rather than restating it: **that module owns the roster, the worktrees and the daemon's view of the
session store; this one owns the transcript's on-disk size and the caches that resume populates.**

---

## 1. Transcript size "up to 79x" — snapshot writes became delta writes

> `.208`: *"Reduced session transcript size (up to 79x in edit-heavy sessions) and bounded checkpoint
> disk usage by pruning superseded file-history backups."*

**Verdict: NET_NEW, two independent mechanisms in one bullet.** `file-history-delta` is
**220=5 / 193=0**; `recordFileHistoryDelta` 220=1 / 193=0; `failed to delete evicted backup`
220=1 / 193=0.

### 1.1 The `O(D²)` write pattern in 2.1.193

File checkpointing keeps a **snapshot** per assistant message boundary. Between snapshots, each
first-time edit of a file "tracks" it — records a backup reference so the edit can be rewound. The
reducer handles this in its `"track"` arm:

```javascript
// :370610-370612 (193), inside gDe (reduceFileHistoryState), case "track"
        return (
          l9a(i),
          LWt(t.messageId, s, !0).catch((a) => {
            ke(Error(`FileHistory: Failed to record snapshot: ${a}`));
          }),
```

with, three lines earlier,

```javascript
// :370600 (193)
          s = { ...n, trackedFileBackups: { ...n.trackedFileBackups, [t.trackingPath]: t.backup } },
```

`LWt` is `recordFileHistorySnapshot(messageId, snapshot, isSnapshotUpdate)`. So **every tracked edit
appends a transcript entry containing the backup record of every file tracked so far**, not just the
one that changed.

Because the arm short-circuits on an already-tracked path
(`if (n.trackedFileBackups[t.trackingPath]) return { ...e, trackSequence: r };`, `:370598 (193)`),
one entry is written per *distinct* file. Let `D` be the number of distinct files edited in a session
and `B` the size of one backup record in JSON. Total bytes written:

```
193:  B·1 + B·2 + … + B·D  =  B·D(D+1)/2
220:  B·1 + B·1 + … + B·1  =  B·D
ratio = (D+1)/2
```

Setting the ratio to the changelog's **79** gives **D ≈ 157** — a session that touched about 157
distinct files. That is a large refactor, and it is exactly what "up to 79x in edit-heavy sessions"
should mean. The arithmetic corroborating the headline number to one significant figure is strong
evidence that this is the mechanism the bullet describes.

### 1.2 The 2.1.220 delta write

```javascript
// ============================================
// reduceFileHistoryState (case "track") - one delta entry per edit instead of a full snapshot
// Location: cli_inner_pretty.js:308875-308883
// ============================================

// ORIGINAL (for source lookup):
        return (
          dZu(s),
          Hws(t.messageId, r.messageId, t.trackingPath, t.backup).catch((a) => {
            xe(Error(`FileHistory: Failed to record delta: ${a}`));
          }),
          O("tengu_file_history_track_edit_success", { isNewFile: t.isAddingFile, version: t.backup.version }),
          w(`FileHistory: Tracked file modification for ${t.filePath}`),
          s
        );

// READABLE (for understanding):
        return (
          debugDumpState(nextState),
          recordFileHistoryDelta(action.messageId,      // this edit's message
                                 baseSnapshot.messageId, // the snapshot this delta rebases on
                                 action.trackingPath,     // the ONE file that changed
                                 action.backup)           // its ONE backup record
            .catch((err) => reportError(Error(`FileHistory: Failed to record delta: ${err}`))),
          telemetry("tengu_file_history_track_edit_success", { ... }),
          logDebug(`FileHistory: Tracked file modification for ${action.filePath}`),
          nextState
        );

// Mapping: UHe→reduceFileHistoryState (:308856), Hws→recordFileHistoryDelta (:524337),
//          fEo→recordFileHistorySnapshot (:524334), r→baseSnapshot, t→action, s→nextState,
//          193 twin: gDe (:370591 (193)) / LWt (:582774 (193))
```

and the entry it writes:

```javascript
// :524337-524346
async function Hws(e, t, r, n) {
  await Rd().insertFileHistoryDelta({
    type: "file-history-delta",
    messageId: e,
    snapshotMessageId: t,          // back-pointer to the base snapshot
    trackingPath: r,
    backup: n,
    timestamp: new Date().toISOString(),
  });
}
```

**How it works:**

1. `"track"` writes a `file-history-delta` — `{messageId, snapshotMessageId, trackingPath, backup}`,
   constant size — instead of the whole snapshot.
2. `"snapshot"` still writes a full `file-history-snapshot` (`fEo`, `:308921`), which is the periodic
   base every delta rebases on. The pair is a classic base-plus-journal layout.
3. Replay is symmetric and appears at **two** readers, so both the in-process transcript loader and
   the log enricher can rebuild state:

   ```javascript
   // :523838-523839 and :526280-526281
             if (D.type === "file-history-snapshot") E.set(D.messageId, f);
             else if (D.type === "file-history-delta") { … }
   ```
4. Both types are registered in the two policy tables at `:527535-527536` (append policy: `"always"`)
   and `:527557-527558` (local-GC retention class: `"boundary-cleared"`, see §2).

**Why base+journal rather than "write only the changed file and reconstruct by scanning":** the
`snapshotMessageId` back-pointer means a reader can find the base without scanning the whole file, and
the `"boundary-cleared"` retention class can drop an entire (base, deltas) generation atomically at a
context boundary. A pure journal with no bases would make rewind an O(session) replay.

**Key insight:** the fix is not compression and not truncation — it is recognising that an
append-only log was being used to store *state* rather than *transitions*. The 193 code had already
computed the single changed entry (`t.backup`); it just serialised the accumulated object around it.

### 1.3 The second half: pruning superseded backup files

Snapshots are capped at `dCt = 100` (`:24774`) in both builds. 193 dropped overflow snapshots from
memory and **left their backup files on disk forever**:

```javascript
// :370635 (193)
          a = { ...e, snapshots: i.length > a9a ? i.slice(-a9a) : i, snapshotSequence: (e.snapshotSequence ?? 0) + 1 };
```

(`a9a = 100` at `:371076 (193)`.) The backup files are whole copies of edited files under
`<configDir>/file-history/<sessionId>/`, so an unbounded number of them accumulated per session, which
is the bullet's *"bounded checkpoint disk usage"* half.

```javascript
// ============================================
// deleteEvictedBackupFiles - unlink backups of snapshots evicted from the ring buffer
// Location: cli_inner_pretty.js:308915 (call) and :308937-308953 (definition)
// ============================================

// ORIGINAL (for source lookup):
        if (a.length > dCt) ((l = a.slice(-dCt)), bxy(a.slice(0, a.length - dCt), l).catch(xe));
...
async function bxy(e, t) {
  let r = kt(),
    n = new Set();
  for (let i of t)
    for (let s of Object.values(i.trackedFileBackups)) if (s.backupFileName !== null) n.add(s.backupFileName);
  let o = new Set();
  for (let i of e)
    for (let s of Object.values(i.trackedFileBackups))
      if (s.backupFileName !== null && !n.has(s.backupFileName) && s.version !== 1 && Txy.test(s.backupFileName))
        o.add(s.backupFileName);
  for (let i of o)
    try {
      await yy.unlink(Ldt(i, r));
    } catch (s) {
      if (!qt(s)) w(`FileHistory: failed to delete evicted backup ${i}: ${s}`, { level: "error" });
    }
}

// READABLE (for understanding):
        if (allSnapshots.length > MAX_SNAPSHOTS /* 100 */) {
          retained = allSnapshots.slice(-MAX_SNAPSHOTS);
          deleteEvictedBackupFiles(allSnapshots.slice(0, allSnapshots.length - MAX_SNAPSHOTS), retained)
            .catch(reportError);
        }
...
async function deleteEvictedBackupFiles(evictedSnapshots, retainedSnapshots) {
  let sessionId = getSessionId(),
    stillReferenced = new Set();
  for (let snap of retainedSnapshots)                                  // (1) build the live set
    for (let backup of Object.values(snap.trackedFileBackups))
      if (backup.backupFileName !== null) stillReferenced.add(backup.backupFileName);

  let deletable = new Set();
  for (let snap of evictedSnapshots)                                   // (2) candidates
    for (let backup of Object.values(snap.trackedFileBackups))
      if (backup.backupFileName !== null
          && !stillReferenced.has(backup.backupFileName)               //   not still needed
          && backup.version !== 1                                      //   never the pristine original
          && BACKUP_FILENAME_RE.test(backup.backupFileName))           //   name-shape allow-list
        deletable.add(backup.backupFileName);

  for (let name of deletable)                                          // (3) unlink, tolerating ENOENT
    try { await fsp.unlink(resolveBackupPath(name, sessionId)); }
    catch (err) { if (!isEnoent(err)) logError(`FileHistory: failed to delete evicted backup ${name}: ${err}`); }
}

// Mapping: bxy→deleteEvictedBackupFiles, dCt→MAX_SNAPSHOTS, Txy→BACKUP_FILENAME_RE (:309674),
//          Ldt→resolveBackupPath (:309258), kt→getSessionId, qt→isEnoent
```

**Three guards, each load-bearing:**

1. **`!stillReferenced.has(name)`** — a backup can be referenced by more than one snapshot (the
   snapshot arm at `:308892-308896` carries forward every still-tracked file's backup into the new
   snapshot). Deleting on eviction alone would break rewind for retained snapshots. Building the live
   set *first* makes this a mark-and-sweep rather than a refcount, which is the right choice: refcounts
   would have to survive process restarts.
2. **`backup.version !== 1`** — version 1 is the pristine pre-session content of the file. It is the
   only thing that can restore a file to its original state, so it is **never** collectable, even when
   no live snapshot references it. This is a deliberate correctness-over-space carve-out.
3. **`BACKUP_FILENAME_RE.test(name)`** where `Txy = /^[0-9a-f]{16}@v\d+$/` (`:309674`) — a
   shape allow-list before an `unlink`. Combined with `resolveBackupPath`'s own two validations
   (`:309259-309261`: the name must match `FGn`, and the session id must not contain `/` or `\` or
   reduce to empty after trailing-dot/space stripping), a corrupted or attacker-influenced snapshot
   record cannot make the CLI delete an arbitrary path. Note the paranoia level: three independent
   checks guarding one `unlink`.

`ENOENT` is swallowed (the file is already gone — success); any other error is logged and the sweep
continues, so one undeletable file cannot abort the rest.

---

## 2. Transcript local GC — shipped, gated **off**

The same release added a second, larger transcript-size mechanism that the changelog does **not**
mention, and it is disabled by default.

```javascript
// ============================================
// isTranscriptLocalGcEnabled - env override, then a remote gate defaulting to FALSE
// Location: cli_inner_pretty.js:840677-840679
// ============================================

// ORIGINAL (for source lookup):
function kCm() {
  return Z.CLAUDE_CODE_TRANSCRIPT_LOCAL_GC ?? Ke("tengu_transcript_local_gc", !1);
}

// READABLE (for understanding):
function isTranscriptLocalGcEnabled() {
  return env.CLAUDE_CODE_TRANSCRIPT_LOCAL_GC        // 1. explicit opt-in/out wins
      ?? getFeatureValue("tengu_transcript_local_gc", false);   // 2. remote gate, default OFF
}

// Mapping: kCm→isTranscriptLocalGcEnabled, Z→managedEnvProxy, Ke→getFeatureValue (:156667),
//          EVs (:523003)→setTranscriptLocalGcEnabled (export table :522854)
```

`CLAUDE_CODE_TRANSCRIPT_LOCAL_GC` is **220=2 / 193=0** (accessor `:30992`, read `:840678`).
It is consumed at exactly one place — `:849846`, `EVs(kCm())`, on the remote/SDK session bootstrap
path — which pushes the flag into the session-store module.

The policy it enables is a **retention-class table**, `nB_` (`:527551-527583`), read through
`oB_(entryType)` (`:523006-523008`) with a fail-open default of `"accumulate"`:

| Class | Entry types | Meaning |
|---|---|---|
| `transcript` | `user`, `assistant`, `system`, `attachment` | the conversation itself — never collected |
| `boundary-cleared` | `progress`, `file-history-snapshot`, `file-history-delta`, `last-prompt`, the three `marble-origami-*` | droppable once a context boundary (compaction) has passed |
| `accumulate` | `content-replacement`, `fork-context-ref`, `frame-link` | keep every one; they are a log, not a state |
| `last-wins` | the ~18 metadata types (`summary`, `custom-title`, `mode`, `pr-link`, `worktree-state`, …) | only the newest matters |

`boundary-cleared` is **220=7 / 193=0** — the class did not exist in the baseline.

**Why gate it off:** every class here is a claim about what a *future* reader will need, and getting
one wrong means an unrecoverable transcript. `file-history-delta` is `boundary-cleared`, so switching
the GC on silently makes pre-boundary rewind impossible. Shipping the machinery dark behind
`Ke(gate, false)` lets Anthropic enable it per-cohort without a release — the same pattern
`_GROUND_TRUTH` §2 documents for `tengu_hazel_trellis` and the subagent depth cap.

**Consequence for the `.208` bullet:** the 79× reduction is delivered entirely by §1's delta writes,
which are **unconditional**. The GC is additional, undocumented, and off. Do not attribute the
headline number to `tengu_transcript_local_gc`.

---

## 3. Resuming with no new messages no longer grows the transcript

> `.199`: *"Fixed opening or resuming a session with no new messages needlessly growing the transcript
> file."*

**Verdict: NET_NEW — and the obvious anchor is a trap.** `normalizeLastPrompt` 220=3 / 193=0;
`extractFieldFromLastEntryOfTypeStrict` 220=1 / 193=0.

### 3.1 The trap: the dedup already existed

On resume, the session store re-appends its metadata (title, mode, tag, PR link, …) so that the tail
of the file always carries current state. The obvious suspect is the deduplication that suppresses a
re-append when nothing changed — and **it is carryover**:

```javascript
// :582398-582405 (193) — the tail of planReAppendSessionMetadata
    let d = (p) => { let { timestamp: f, ...m } = p; return Le(m); };
    return {
      sessionFile: o,
      entries: a.filter((p) => {
        let f = c.get(p.type);
        return !f || d(p) !== d(f);
      }),
    };
```

The 220 twin at `:523693-523703` is structurally identical (`p` strips `timestamp`, the filter compares
serialised forms). The backward scan that builds `c`/`u` — bounded to half a chunk by
`if (((d += Buffer.byteLength(m, "utf8") + 1), d > xI / 2)) break;` — is also identical
(`:523676-523692` ↔ `:582376-582396 (193)`). **Anchoring this bullet on the dedup produces a false
"this is new" verdict.**

### 3.2 The real delta: the planner now *recovers* `last-prompt` before comparing

The dedup can only suppress an entry if the value it plans matches the value on disk. In 193 one field
was never recovered from disk, so its planned entry never matched:

```javascript
// ============================================
// planReAppendSessionMetadata (excerpt) - the two new on-disk recoveries
// Location: cli_inner_pretty.js:523620-523638
// ============================================

// ORIGINAL (for source lookup):
    let a = lxt(e, "relocated", "relocatedCwd");
    if (a) this.currentSessionRelocatedCwd ??= a;
    if (this.currentSessionLeafUuid !== void 0) {
      let f = lxt(e, "last-prompt", "lastPrompt");
      if (f) this.currentSessionLastPrompt ??= this.normalizeLastPrompt(f);
    }
    let l = [];
    if (this.currentSessionLastPrompt !== void 0 || this.currentSessionLeafUuid !== void 0)
      l.push({
        type: "last-prompt",
        ...(this.currentSessionLastPrompt && { lastPrompt: this.currentSessionLastPrompt }),
        ...(this.currentSessionLeafUuid && { leafUuid: this.currentSessionLeafUuid }),
        sessionId: n,
      });
    ...
    if (this.currentSessionRelocatedCwd && e !== "")
      l.push({ type: "relocated", relocatedCwd: this.currentSessionRelocatedCwd, sessionId: n });

// READABLE (for understanding):
    let relocatedCwd = extractFieldFromLastEntryOfTypeStrict(fileText, "relocated", "relocatedCwd");
    if (relocatedCwd) this.currentSessionRelocatedCwd ??= relocatedCwd;      // NEW in 220
    if (this.currentSessionLeafUuid !== undefined) {                         // NEW in 220
      let onDiskPrompt = extractFieldFromLastEntryOfTypeStrict(fileText, "last-prompt", "lastPrompt");
      if (onDiskPrompt) this.currentSessionLastPrompt ??= this.normalizeLastPrompt(onDiskPrompt);
    }
    let planned = [];
    if (this.currentSessionLastPrompt !== undefined || this.currentSessionLeafUuid !== undefined)
      planned.push({ type: "last-prompt",
                     ...(this.currentSessionLastPrompt && { lastPrompt: this.currentSessionLastPrompt }),
                     ...(this.currentSessionLeafUuid  && { leafUuid:   this.currentSessionLeafUuid }),
                     sessionId });
    ...
    if (this.currentSessionRelocatedCwd && fileText !== "")                  // `!== ""` guard NEW in 220
      planned.push({ type: "relocated", relocatedCwd: this.currentSessionRelocatedCwd, sessionId });

// Mapping: lxt→extractFieldFromLastEntryOfTypeStrict (:51379, export name at :51300),
//          e→fileText, l→planned, n→sessionId
```

**How the bug worked in 193, step by step:**

1. Resume restores `currentSessionLeafUuid` (from the resume argument) but leaves
   `currentSessionLastPrompt` **`undefined`** — nothing read it back from the file
   (`currentSessionLastPrompt` in 193 is only ever *written*, at `:582546 (193)`, when a new prompt is
   submitted).
2. The `push` at `:582332 (193)` fires because `currentSessionLeafUuid !== undefined`, producing
   `{type:"last-prompt", leafUuid, sessionId}` — **with no `lastPrompt` key**, because of the
   `...(x && {…})` spread.
3. The last `last-prompt` entry on disk **does** have `lastPrompt`. The timestamp-stripped
   serialisations therefore differ, the dedup passes it through, and a line is appended.
4. Open and close the session ten times and you get ten identical-but-for-timestamp lines. That is
   "needlessly growing the transcript file", exactly.

220 closes it by reading the on-disk value back with `??=` (recover only if not already set from this
process's own activity) before the planned entry is built — so with no new messages the planned entry
is byte-identical to the last one on disk and the existing dedup suppresses it.

**Two smaller repairs in the same block:**

- `relocated` gets the same recovery treatment (`:523620-523621`), fixing the same
  append-every-resume shape for relocated sessions.
- `if (this.currentSessionRelocatedCwd && e !== "")` (`:523637`) — never write a `relocated` marker into
  an *empty* transcript. A fresh file has nothing to relocate from, and the entry would otherwise be
  the very first line of a brand-new session.

**Why `normalizeLastPrompt` matters here:** the recovered value must be normalised the same way the
originally-written one was, or the comparison fails and the fix does nothing. 220 extracts the
normalisation into a method (`:523586-523595`) called from **both** the write path (`:524052`) and the
new recovery path (`:523624`); 193 had the logic inlined at the single write site
(`:582546 (193)`: `p.length > 200 ? p.slice(0, 200).trim() + "…" : p`). Note the method also switched
`p.slice(0, 200)` to `ma(t, 200)` — the surrogate-safe, parent-releasing truncator from
[`memory_bounds_and_leaks.md`](./memory_bounds_and_leaks.md) §6.

---

## 4. Resuming with background agents or forks from a large conversation

> `.208`: *"Reduced memory usage when resuming sessions with background agents or forks spawned from
> large conversations."*

**Verdict: NET_NEW.** `hydrateForkContext` 220=1 / 193=0;
`resetForkContextHydrationCacheForTests` 220=1 / 193=0. (Rated UNANCHORED by the scoping pass, which
probed `tengu_precomputed_compact_rehydrated` — a *different* mechanism, the compaction sidecar at
`:328512`, which belongs to `07_compact`.)

A `fork-context-ref` entry says "this agent's conversation begins with the parent session's messages
up to UUID X". Hydrating it means loading the parent transcript and materialising the prefix chain.

### 4.1 What 193 did

```javascript
// :582742-582763 (193)
async function $jf(e) {
  let t = mze.get(e.parentLastUuid);
  if (t) return (mze.delete(e.parentLastUuid), mze.set(e.parentLastUuid, t), t);   // LRU touch
  let n = sk(e.parentSessionId), { messages: r } = await tde(n), o = r.get(e.parentLastUuid);
  if (!o) return (T(`[fork-context-ref] parent uuid … not found …`), []);
  let s = wSe(r, o).filter((i) => !i.isSidechain).map(({ isSidechain: i, parentUuid: a, ...l }) => l);
  if (mze.size >= Mjf) { let i = mze.keys().next().value; if (i !== void 0) mze.delete(i); }
  return (mze.set(e.parentLastUuid, s), s);
}
```

`Mjf = 4` (`:585522 (193)`). Two problems:

1. **No byte budget.** Four cached prefixes, each an arbitrary slice of an arbitrary conversation.
   Four forks from a 500 k-token session is four full prefix arrays resident.
2. **No in-flight coalescing.** Resuming a session that owns K background agents/forks hydrates them
   concurrently. If several share a `parentLastUuid` — the common case, since forks are usually taken
   from the same point — each `await tde(n)` loads and parses the entire parent transcript
   independently, and each builds its own prefix array. Peak is `K × (parsed transcript + prefix)`
   even though `K−1` of them will be thrown away by the last `mze.set` wins.

### 4.2 The 220 version

```javascript
// ============================================
// hydrateForkContext - in-flight coalescing over a byte-bounded LRU of parent prefixes
// Location: cli_inner_pretty.js:524292-524323
// ============================================

// ORIGINAL (for source lookup):
async function Csp(e, t = bB_) {
  let r = fRe.get(e.parentLastUuid);
  if (r) return (fRe.delete(e.parentLastUuid), fRe.set(e.parentLastUuid, r), r.slice);
  let n = Q2o.get(e.parentLastUuid);
  if (n) return n;
  let o = EB_(e, t).finally(() => Q2o.delete(e.parentLastUuid));
  return (Q2o.set(e.parentLastUuid, o), o);
}
async function EB_(e, t) {
  let r = tD(e.parentSessionId),
    { messages: n } = await PBe(r),
    o = n.get(e.parentLastUuid);
  if (!o) return (w(`[fork-context-ref] parent uuid ${e.parentLastUuid} not found in ${r}; returning empty prefix`,
                    { level: "warn" }), []);
  let i = Bze(n, o).filter((l) => !l.isSidechain).map(({ isSidechain: l, parentUuid: c, ...u }) => u),
    s = i.reduce((l, c) => l + eCi(c).length, 0);
  (fRe.delete(e.parentLastUuid), fRe.set(e.parentLastUuid, { slice: i, bytes: s }));
  let a = 0;
  for (let l of fRe.values()) a += l.bytes;
  for (let [l, c] of fRe) {
    if (fRe.size <= 1 || (fRe.size <= _B_ && a <= t)) break;
    ((a -= c.bytes), fRe.delete(l));
  }
  return i;
}

// READABLE (for understanding):
async function hydrateForkContext(forkRef, byteBudget = FORK_CONTEXT_CACHE_MAX_BYTES /* 16 MiB */) {
  let cached = forkPrefixCache.get(forkRef.parentLastUuid);
  if (cached) {                                   // LRU touch on hit
    forkPrefixCache.delete(forkRef.parentLastUuid);
    forkPrefixCache.set(forkRef.parentLastUuid, cached);
    return cached.slice;
  }
  let inFlight = forkPrefixInFlight.get(forkRef.parentLastUuid);
  if (inFlight) return inFlight;                  // <- the coalescing: share one load
  let promise = loadForkContextPrefix(forkRef, byteBudget)
                  .finally(() => forkPrefixInFlight.delete(forkRef.parentLastUuid));
  forkPrefixInFlight.set(forkRef.parentLastUuid, promise);
  return promise;
}

async function loadForkContextPrefix(forkRef, byteBudget) {
  let parentPath = getTranscriptPathForSession(forkRef.parentSessionId),
    { messages } = await loadTranscriptFile(parentPath),
    leaf = messages.get(forkRef.parentLastUuid);
  if (!leaf) { logWarn(`[fork-context-ref] parent uuid … not found in ${parentPath}; returning empty prefix`); return []; }
  let prefix = buildConversationChain(messages, leaf)
                 .filter((m) => !m.isSidechain)
                 .map(({ isSidechain, parentUuid, ...rest }) => rest),
    bytes = prefix.reduce((sum, m) => sum + serializeEntry(m).length, 0);   // <- byte accounting
  forkPrefixCache.delete(forkRef.parentLastUuid);
  forkPrefixCache.set(forkRef.parentLastUuid, { slice: prefix, bytes });
  let total = 0;
  for (let e of forkPrefixCache.values()) total += e.bytes;
  for (let [uuid, entry] of forkPrefixCache) {                              // oldest-first eviction
    if (forkPrefixCache.size <= 1                                           //   never evict the last one
        || (forkPrefixCache.size <= FORK_CONTEXT_CACHE_MAX_ENTRIES /* 4 */
            && total <= byteBudget)) break;
    total -= entry.bytes;
    forkPrefixCache.delete(uuid);
  }
  return prefix;
}

// Mapping: Csp→hydrateForkContext, EB_→loadForkContextPrefix, fRe→forkPrefixCache (:527595),
//          Q2o→forkPrefixInFlight (:527595), _B_→FORK_CONTEXT_CACHE_MAX_ENTRIES (:527423),
//          bB_→FORK_CONTEXT_CACHE_MAX_BYTES (:527424), eCi→serializeEntry (:19819),
//          Bze→buildConversationChain, PBe→loadTranscriptFile, tD→getTranscriptPathForSession,
//          SB_ (:524289)→resetForkContextHydrationCacheForTests
```

**How it works, and why each piece is there:**

1. **In-flight promise map (`Q2o`).** The single most important change for the bullet's scenario.
   K forks sharing a parent now await **one** promise: one transcript read, one parse, one prefix
   array. Peak drops from `K × (parse + prefix)` to `1 × (parse + prefix)`.
   The `.finally(() => Q2o.delete(...))` is what prevents the map from becoming a second, unbounded
   cache — it self-cleans on both fulfil and reject, so a failed hydration is retried rather than
   permanently memoised as a rejection.
2. **Cache-then-in-flight ordering.** The completed cache is checked first, then the in-flight map.
   Reversing it would return a promise where a value is available, adding a microtask for no reason.
3. **Byte accounting.** `bytes` is `Σ JSON.stringify(entry).length` — the serialised size, a good proxy
   for the retained object graph and cheap to compute once at insert. The 193 cache had no notion of
   size at all.
4. **Dual eviction criterion.** `size <= 4 && total <= 16 MiB` must *both* hold before the loop stops;
   `size <= 1` is an unconditional floor. So one 40 MiB prefix is kept (you cannot evict below one
   entry, and the caller needs it) but a second one immediately evicts the first.
   `_B_ = 4` matches 193's `Mjf = 4` exactly — **the entry cap is carryover; the byte cap is the delta.**
5. `resetForkContextHydrationCacheForTests` (`:524289`) clears both maps together, which is the tell
   that they are one logical unit.

**Careful:** `bB_ = 16777216` is the **second** distinct 16 MiB budget introduced in this window; the
other is the edit read cache's `tky` (see [`memory_bounds_and_leaks.md`](./memory_bounds_and_leaks.md)
§4). Grepping `16777216` will land on the wrong one.

**Related, not duplicated:** the roster/session-store side of resume — which sessions are listed, how
worktree state survives a schema-skewed daemon — is in
[`36_background_agents/session_store_and_worktrees.md`](../36_background_agents/session_store_and_worktrees.md).

---

## 5. The process-exit stdout drain became byte-scaled (`.214`)

> `.214`: *"Fixed stream-json output truncation at exit for slow-reading SDK/pipeline consumers; the
> exit drain now scales with queued bytes instead of a flat 2s cap."*

**Verdict: NET_NEW.** `scaleBudgetToQueue` 220=3 / 193=0; `stdout drain timeout (exit)` 220=1 / 193=0;
`drainStdoutBeforeExit` (export name) 220=1 / 193=0.

The bullet's primary theme is `headless_sdk`, and the stream-json semantics belong to
[`51_headless_sdk/`](../51_headless_sdk/). What is *this* module's business is the budget constant and
its scaling rule, because a flat timeout on an unbounded queue is a resource-bound bug.

```javascript
// ============================================
// getStdoutDrainBudgetMs / drainStdoutBeforeExit - exit drain scaled by queued bytes
// Location: cli_inner_pretty.js:20552-20580
// ============================================

// ORIGINAL (for source lookup):
async function jzt(e = 2000, { scaleBudgetToQueue: t = !0 } = {}) {
  let r = process.stdout;
  if (lCi === void 0) {
    if (r.isTTY || r.destroyed || r.writableEnded || !pIl) return;
    lCi = new Promise((o) => r.end(o));
  }
  let n = Promise.all([lCi, g9m()]);
  await Oa(t ? Promise.race([n, p9m(e)]) : n, t ? OUn(e) : e, "stdout drain timeout (exit)").catch(() => {});
}
...
function gIl() {
  return process.stdout.destroyed || pCi ? 0 : fIl - mIl;
}
...
function OUn(e = 2000) {
  return Math.min(m9m, Math.max(e, Math.ceil((gIl() * 1000) / f9m)));
}

// READABLE (for understanding):
async function drainStdoutBeforeExit(minBudgetMs = 2000, { scaleBudgetToQueue = true } = {}) {
  let stdout = process.stdout;
  if (endPromise === undefined) {
    if (stdout.isTTY || stdout.destroyed || stdout.writableEnded || !anythingWasWritten) return;
    endPromise = new Promise((done) => stdout.end(done));
  }
  let settled = Promise.all([endPromise, awaitDownstreamClose()]);
  await withTimeout(
    scaleBudgetToQueue ? Promise.race([settled, awaitExternalClock(minBudgetMs)]) : settled,
    scaleBudgetToQueue ? getStdoutDrainBudgetMs(minBudgetMs) : minBudgetMs,
    "stdout drain timeout (exit)",
  ).catch(() => {});
}
...
function getPendingStdoutBytes() {
  return process.stdout.destroyed || stdoutErrorLatched ? 0 : bytesWritten - bytesFlushed;
}
...
function getStdoutDrainBudgetMs(minBudgetMs = 2000) {
  return Math.min(
    DRAIN_BUDGET_CEILING_MS,                                         // 30_000
    Math.max(minBudgetMs,                                            // floor 2_000
             Math.ceil((getPendingStdoutBytes() * 1000) / ASSUMED_PIPE_THROUGHPUT_BPS)),  // 262_144 B/s
  );
}

// Mapping: jzt→drainStdoutBeforeExit, OUn→getStdoutDrainBudgetMs, gIl→getPendingStdoutBytes,
//          Js (:20542)→writeToStdout, fIl→bytesWritten (:20641), mIl→bytesFlushed (:20642),
//          pIl→anythingWasWritten (:20639), pCi→stdoutErrorLatched (:20648),
//          f9m→ASSUMED_PIPE_THROUGHPUT_BPS (:20646), m9m→DRAIN_BUDGET_CEILING_MS (:20647),
//          fWe (:20561)→markStdoutDrainExternallyClocked
```

**How the byte accounting works:** `writeToStdout` (`:20542-20551`) adds the chunk's byte length to
`bytesWritten` *before* the write and, in the write callback, adds the same amount to `bytesFlushed`.
`getPendingStdoutBytes()` is the difference — the bytes Node has accepted but not yet handed to the
OS. It returns 0 if the stream is destroyed or an EPIPE has been latched (`:20533-20535`), so a dead
pipe never buys a 30-second wait.

**The formula:** `clamp(pendingBytes / 262144 × 1000 ms, 2000, 30000)`.

- **`f9m = 262144` (256 KiB/s)** is a deliberately *pessimistic* pipe throughput. A real pipe to a
  local process does tens of MB/s; 256 KiB/s models a slow consumer (a Python script doing work per
  line, a network relay). Being pessimistic is the right bias: the cost of over-estimating is waiting
  a bit longer at exit, the cost of under-estimating is truncated output — the exact bug being fixed.
- **floor 2000 ms** preserves the old behaviour for small outputs, so nothing regresses.
- **`m9m = 30000` ceiling** bounds the worst case. At 256 KiB/s, 30 s corresponds to ~7.5 MB of queue;
  beyond that the CLI gives up rather than hanging a CI job forever.

**The `Promise.race` with `awaitExternalClock`:** when scaling is on, the drain also races against
`p9m(minBudgetMs)` = "the external clock fired, then wait `minBudgetMs`". `markStdoutDrainExternallyClocked`
(`fWe`, `:20561`) resolves that clock, letting a caller that *knows* the consumer has finished
short-circuit the generous budget. Without it, every exit of a large-output run would pay the full
scaled budget even when the reader is already done.

**Opt-outs.** Two callers pass `scaleBudgetToQueue: false`: `:522216` (`jzt(500, …)`, the session-store
flush, which must not delay shutdown) and `:840582` (`jzt(Math.max(0, t - Date.now()), …)`, which is
already working to a hard deadline). Both are cases where a *caller-owned* deadline outranks the
queue-derived one.

---

## 6. The pre-exit flush registry — `.218` "PR events lost when the process exits immediately"

> `.218`: *"Fixed PR events occasionally being lost when a session exited right after creating or
> linking a PR."*

**Verdict: NET_NEW, and the bullet under-sells it.** What shipped is not a patch to the PR code path —
it is **a second process-wide shutdown registry** and a two-phase split of remote-control teardown.
`44_telemetry` recorded this bullet as UNANCHORED because it searched for a PR-shaped literal; there
isn't one. The anchor is structural.

Every count below was taken with `grep -cF` in both bundles during this pass:

| Anchor | 220 | 193 |
|---|---|---|
| `registerPreExitFlush` | **2** | **0** |
| `registerShutdownCleanup` | **2** | **0** |
| `closeExceptInternalEvents` | **3** | **0** |
| `flushErrorLogWriters` | **1** | **0** |
| `pre-exit flush timeout (relaunch)` | **1** | **0** |
| `EXIT_HANDOFF_FAILSAFE_MS` | **1** | **0** |
| `_flushLogWritersForTesting` | **0** | **1** |

The last row is the tell: 2.1.193 had a flush-all-log-writers helper that was **exported for tests
only**. In 2.1.220 it is renamed `flushErrorLogWriters` and wired into the production exit path.

**Scope note.** [`54_remote_control/transport_and_session_lifecycle.md` §2.5](../54_remote_control/transport_and_session_lifecycle.md)
owns the `CCRClient` side (why *internal* events specifically must outlive the other three uploaders).
This section owns the **registry mechanism and the exit ladder**: what the second registry is, where it
is drained from, what the sync/async boundary is, and whether the bullet is actually fixed.

### 6.1 Why 2.1.193 lost the events — the discard is in `close()`

The uploader used for internal events is a generic batching queue (`oln`, `:415372`). Its `close()`
does not drain; it **throws the queue away and resolves any outstanding `flush()` as if it had
succeeded**:

```javascript
// ============================================
// BatchedUploader.close - discards pending, resolves flush waiters anyway
// Location: cli_inner_pretty.js:415411-415422
// ============================================

// ORIGINAL (for source lookup):
  close() {
    if (this.closed) return;
    ((this.closed = !0),
      (this.pendingAtClose = this.pending.length),
      (this.pending = []),
      this.sleepResolve?.(),
      (this.sleepResolve = null));
    for (let e of this.backpressureResolvers) e();
    this.backpressureResolvers = [];
    for (let e of this.flushResolvers) e();
    this.flushResolvers = [];
  }

// READABLE (for understanding):
  close() {
    if (this.closed) return;
    this.closed = true;
    this.pendingAtClose = this.pending.length;   // kept only for the pendingCount getter
    this.pending = [];                           // <- the batch is dropped, never sent
    this.sleepResolve?.();                       // wake a retry sleep so drain() can exit
    this.sleepResolve = null;
    for (let resolve of this.backpressureResolvers) resolve();
    this.backpressureResolvers = [];
    for (let resolve of this.flushResolvers) resolve();   // <- flush() resolves *successfully*
    this.flushResolvers = [];
  }

// Mapping: oln→BatchedUploader, pendingAtClose→pendingCountAtClose, sleepResolve→retrySleepResolver
```

Two properties make this silent rather than loud: `enqueue()` returns immediately once `closed`
(`:415392`), and `drain()` early-returns on `this.closed` (`:415424`). After close the subsystem
accepts writes and discards them without an error.

In 2.1.193 that `close()` was reached **early in shutdown**, because the whole client was registered
into the one and only cleanup registry:

```javascript
// ============================================
// 2.1.193 shutdown wiring - the full client close ran in the early cleanup phase
// Location: cli_inner_pretty.js:702560 (193), 621227-621240 (193)
// ============================================

// ORIGINAL (for source lookup):
        Si(async () => this.ccrClient.close()),
...
  close() {
    if (((this.closed = !0), this.stopHeartbeat(), efl(), this.streamEventTimer))
      (clearTimeout(this.streamEventTimer), (this.streamEventTimer = null));
    ((this.streamEventBuffer = []),
      (this.pendingProcessingAcks = []),
      this.workerState.close(),
      this.eventUploader.close(),
      this.internalEventUploader.close(),
      this.deliveryUploader.close());
  }

// READABLE (for understanding):
        registerCleanup(async () => this.ccrClient.close()),
...
  close() {
    this.closed = true;
    this.stopHeartbeat();
    stopSessionKeepalive();
    if (this.streamEventTimer) { clearTimeout(this.streamEventTimer); this.streamEventTimer = null; }
    this.streamEventBuffer = [];
    this.pendingProcessingAcks = [];
    this.workerState.close();
    this.eventUploader.close();
    this.internalEventUploader.close();   // <- same discard, four uploaders at once
    this.deliveryUploader.close();
  }

// Mapping (193): Si→registerCleanup, efl→stopSessionKeepalive, ccrClient→remoteControlClient
```

That registry is drained by `NYe()` at `:310175 (193)` — **step 2 of an eleven-step shutdown**, before
the session-end hooks, before the analytics flush, before the stdout drain. The PR path is an ordinary
producer: linking a PR sets `currentSessionPrNumber` / `currentSessionPrUrl` /
`currentSessionPrRepository` on the session store (`:525514` in 220), which emits a metadata entry
through `internalEventWriter` → `CCRClient.writeInternalEvent` → `internalEventUploader.enqueue`.
The uploader batches (`maxBatchSize: 100`, `maxQueueSize: 200`, `baseDelayMs: 500`, `:415700-415723`),
so a PR linked in the last second before exit is still in `pending` when step 2 empties the array.

**That is the whole bug.** "Exits right after creating a PR" is not a race in the PR code; it is a
shutdown *ordering* defect that happens to be observable through the shortest-lived producer.

### 6.2 The mechanism: one registry class, now instantiated twice

**What it does:** provides a disposable-aware set of teardown callbacks that an exit orchestrator can
drain at a chosen point. 2.1.193 had one instance; 2.1.220 has two — a *cleanup* phase and a *pre-exit
flush* phase.

```javascript
// ============================================
// DisposerRegistry + the two phase singletons - process teardown registry
// Location: cli_inner_pretty.js:4342-4384
// ============================================

// ORIGINAL (for source lookup):
function cUm(e) {
  if (typeof e === "function") return e;
  if (Symbol.asyncDispose in e) return () => e[Symbol.asyncDispose]();
  return () => e[Symbol.dispose]();
}
function Aa(e) {
  return N0l.register(e);
}
async function X9t() {
  await N0l.drain();
}
function kFn(e) {
  return F0l.register(e);
}
async function HFn() {
  await F0l.drain();
}
var vvi, N0l, F0l;
var Cf = S(() => {
  vvi = class vvi {
    #e = new Set();
    register(e) {
      let t = cUm(e);
      this.#e.add(t);
      let r = () => {
        this.#e.delete(t);
      };
      return Object.assign(r, { [Symbol.dispose]: r });
    }
    async drain() {
      let e = Array.from(this.#e);
      (this.#e.clear(), await Promise.all(e.map(async (t) => t())));
    }
    async [Symbol.asyncDispose]() {
      await this.drain();
    }
    get sizeForTesting() {
      return this.#e.size;
    }
  };
  N0l = new vvi();
  F0l = new vvi();
});

// READABLE (for understanding):
function toTeardownThunk(target) {
  if (typeof target === "function") return target;
  if (Symbol.asyncDispose in target) return () => target[Symbol.asyncDispose]();
  return () => target[Symbol.dispose]();
}
function registerCleanup(target)       { return cleanupRegistry.register(target); }        // phase 1
async function drainCleanup()          { await cleanupRegistry.drain(); }
function registerPreExitFlush(target)  { return preExitFlushRegistry.register(target); }   // phase 2
async function drainPreExitFlush()     { await preExitFlushRegistry.drain(); }

class DisposerRegistry {
  #thunks = new Set();
  register(target) {
    let thunk = toTeardownThunk(target);
    this.#thunks.add(thunk);
    let unregister = () => { this.#thunks.delete(thunk); };
    return Object.assign(unregister, { [Symbol.dispose]: unregister });  // `using` support
  }
  async drain() {
    let snapshot = Array.from(this.#thunks);
    this.#thunks.clear();                                   // clear BEFORE awaiting -> idempotent
    await Promise.all(snapshot.map(async (thunk) => thunk()));  // concurrent, no ordering
  }
  async [Symbol.asyncDispose]() { await this.drain(); }
  get sizeForTesting() { return this.#thunks.size; }
}
const cleanupRegistry       = new DisposerRegistry();   // N0l — drained early
const preExitFlushRegistry  = new DisposerRegistry();   // F0l — drained last (220-only)

// Mapping: cUm→toTeardownThunk, vvi→DisposerRegistry, N0l→cleanupRegistry, F0l→preExitFlushRegistry,
//          Aa→registerCleanup, X9t→drainCleanup, kFn→registerPreExitFlush, HFn→drainPreExitFlush
```

**The class body is byte-identical to 2.1.193's** (`sYo`, `:3907-3927 (193)`, with `G1c`→`cUm`,
`Si`→`Aa`, `NYe`→`X9t`). The entire delta is the two lines `F0l = new vvi();` (`:4383`) and its
register/drain pair — **the fix is a second instantiation of an existing primitive plus a re-ordering
of who registers where.** That is why no literal moves and why a count-based diff misses it.

**Population asymmetry.** `grep -nF "Aa"`-style boundary-aware counting gives phase 1 roughly **50**
registration sites; `grep -nF "kFn"` returns exactly **three lines in the whole bundle** (`:4353` the
definition, `:416193` the injected default, `:538578` the one direct call). Phase 2 has **two**
registrants. The registry is deliberately near-empty — it is a privileged last-chance slot, not a
general dumping ground, and that is what keeps its cost bounded.

### 6.3 Registrant 1 — the remote-control client (`:416193-416202`)

```javascript
// ============================================
// CCRClient.registerShutdownCleanup - splits teardown across both phases
// Location: cli_inner_pretty.js:416193-416202
// ============================================

// ORIGINAL (for source lookup):
  registerShutdownCleanup(e = { registerCleanup: Aa, registerPreExitFlush: kFn }) {
    (e.registerCleanup(() => this.closeExceptInternalEvents()),
      e.registerPreExitFlush(async () => {
        try {
          await DBr(this.flushInternalEvents(), k7y);
        } finally {
          this.close();
        }
      }));
  }

// READABLE (for understanding):
  registerShutdownCleanup(registries = { registerCleanup, registerPreExitFlush }) {
    registries.registerCleanup(() => this.closeExceptInternalEvents());   // phase 1: stop producing
    registries.registerPreExitFlush(async () => {                         // phase 2: drain, then close
      try {
        await withDeadline(this.flushInternalEvents(), INTERNAL_EVENT_FLUSH_DEADLINE_MS); // 3000
      } finally {
        this.close();                       // full close, incl. internalEventUploader.close()
      }
    });
  }

// Mapping: DBr→withDeadline (:20492, exported as `withDeadline` at :20456), k7y→INTERNAL_EVENT_FLUSH_DEADLINE_MS (3000, :416223)
```

The default-parameter object is a **test seam** — the only reason to inject `Aa`/`kFn` rather than call
them is so a test can pass fakes. Combined with `sizeForTesting` on the registry, this subsystem was
built to be asserted on. You cannot inject `process.on`.

**The `finally { this.close() }` is load-bearing and slightly dangerous.** `DBr` (`withDeadline`) is
`Promise.race([work, timer])` that **resolves** on timeout — it neither rejects nor cancels the
underlying work (`:20492-20500`). So if the POST to `/worker/internal-events` has not completed within
3 s, `withDeadline` resolves, `finally` runs, and `close()` discards whatever is still queued. The
deadline converts an unbounded hang into a bounded, silent loss. That is a defensible trade — an
interactive CLI cannot hang 30 s at exit for telemetry — but it is a *cap*, not a guarantee.

### 6.4 Registrant 2 — the error/MCP log writers (`:538578`), and why it exists at all

This one is not a bug fix; it is **the price of a different performance change**, and reading the two
versions side by side makes that unmistakable.

```javascript
// ============================================
// getOrCreateLogWriter + flushErrorLogWriters - async log appends need a pre-exit flush
// Location: cli_inner_pretty.js:538540-538580 (220), 563386-563415 (193)
// ============================================

// ORIGINAL (for source lookup):
// --- 2.1.193: synchronous appends, cleanup-phase dispose only ---
function C1f() {
  for (let e of IYt.values()) e.flush();
}
...
      writeFn: (o) => {
        try {
          try {
            Gt().appendFileSync(e, o);
          } catch {
            (Gt().mkdirSync(n), Gt().appendFileSync(e, o));
          }
        } catch (s) { ... }
      },
      flushIntervalMs: 1000,
      maxBufferSize: 50,
    })),
      IYt.set(e, t),
      Si(async () => t?.dispose()));

// --- 2.1.220: asynchronous appends on a keyed queue, registered into both phases ---
async function Gcp() {
  for (let e of wmn.values()) e.flush();
  await Tmn.settle();
}
...
      writeFn: (o) => {
        Tmn.run(e, async () => {
          try {
            await K3_(r, e, o);
          } catch (i) {
            if (!n) ((n = !0), w(`Dropping log batch for ${e}: ${i instanceof Error ? i.message : String(i)}`));
          }
        });
      },
      flushIntervalMs: 1000,
      maxBufferSize: 50,
    })),
      wmn.set(e, t),
      Aa(async () => {
        (t?.dispose(), await Tmn.settle());
      }),
      kFn(Gcp));

// READABLE (for understanding):  [the 2.1.220 side]
async function flushErrorLogWriters() {
  for (let writer of logWritersByPath.values()) writer.flush();  // sync: buffer -> writeFn -> queue
  await logWriteQueue.settle();                                  // async: await the appendFile calls
}
...
      writeFn: (chunk) => {
        logWriteQueue.run(path, async () => {                    // serialised per file path
          try { await appendCreatingParent(dir, path, chunk); }
          catch (err) { if (!warned) { warned = true; logDebug(`Dropping log batch for ${path}: …`); } }
        });
      },
      flushIntervalMs: 1000,
      maxBufferSize: 50,
    });
    logWritersByPath.set(path, writer);
    registerCleanup(async () => { writer?.dispose(); await logWriteQueue.settle(); });  // phase 1
    registerPreExitFlush(flushErrorLogWriters);                                          // phase 2

// Mapping: Gcp→flushErrorLogWriters (export name at :538516), Wzs→getOrCreateLogWriter,
//          wmn→logWritersByPath (:538642), Tmn→logWriteQueue (keyed serial queue, W5 at :48955),
//          K3_→appendCreatingParent, C1f (193)→_flushLogWritersForTesting, IYt (193)→logWritersByPath
```

**The 193 writer called `appendFileSync`.** A synchronous append cannot be pending at exit, so a
`dispose()` in the cleanup phase was sufficient and no pre-exit slot was needed. 2.1.220 moved these
appends off the event loop (`await appendFile` inside `logWriteQueue.run`), which is the right call for
a CLI that writes MCP error logs during a turn — but it **created** a class of in-flight writes that
`dispose()` alone cannot wait for. `kFn(Gcp)` is the compensating mechanism.

**Why `flush()` is not awaited inside `flushErrorLogWriters`.** `flush` on the buffered writer
(`z9t`, `:4104`) is *synchronous*: `d()` at `:4123-4127` joins the buffer and calls `writeFn(...)`
inline through `u()` (`:4118`). Its only async effect is scheduling work on `logWriteQueue`. So the
loop synchronously moves every buffer into the queue, and the single `await logWriteQueue.settle()`
afterwards covers all of them. Awaiting each `flush()` would be a no-op with extra microtasks.

`settle()` (`:48978`) awaits a snapshot of the queue's current tail promises — one pass. The same
object also offers `drain()` (`:48981`, up to `e0h = 5` passes) for work that enqueues more work.
`settle()` is correct here because a log append never schedules another append.

### 6.5 The crux — the drain is asynchronous, and it is deliberately **not** in `process.on("exit")`

**This is the part that decides whether the fix works.** An `exit` listener runs synchronously on a
dying event loop; it can call `fs.appendFileSync` and nothing else. A network POST is impossible there.

The bundle demonstrates that the authors know this, because it uses **both** patterns and picks each
one correctly:

- `process.on("exit", xVs)` at `:523315` — `xVs` (`:523292`) is a *synchronous* session-metadata
  re-append with a `gVs` re-entrancy latch. Sync work, sync hook.
- `HFn()` — never registered on `exit` at all. I checked all 14 `process.on("exit"` sites and all 5
  `process.on("beforeExit"` sites in 2.1.220; **none** references `HFn`, `X9t`, `N0l` or `F0l`.

Instead the drain is an ordinary `await` inside an async shutdown orchestrator that runs *before*
anybody calls `process.exit`. The orchestrator is `Ds` (`:522314-522372`), reached from every signal
handler and from the uncaught-exception path:

| # | Line | Step |
|---|---|---|
| 0 | `:522315` | `if (kht) return;` — the shutdown latch; a second signal is a no-op |
| 1 | `:522319` | arm forced-exit failsafe: `max(5000, hookTimeout + 3500)` ms |
| 2 | `:522324` | **`await X9t()`** — phase-1 cleanup drain, raced against a 2000 ms timer (`:522327-522333`, timer at `:522330`) |
| 3 | `:522337` | if exit handoffs are pending, **re-arm** the failsafe to `max(15000, hookTimeout + 3500)` |
| 4 | `:522339` | `await Vou()` — await registered exit handoffs |
| 5 | `:522342` | `await Aau()` |
| 6 | `:522345` | session-end hooks, under `AbortSignal.timeout(hookTimeout)` |
| 7 | `:522353` | `await hoe()` (write-queue drain), `await yht()` (analytics sinks) |
| 8 | `:522363` | `await a4r()` — diagnostics flush |
| 9 | `:522366` | `await gWe()` — debug-log flush |
| 10 | `:522369` | **`await HFn()`** — phase-2 pre-exit flush drain |
| 11 | `:522371` | `await Uip(e)` (re-arm to stdout budget + 1500 ms, drain stdout) then `eVs(e)` → `process.exit` |

**How it works, step by step:**

1. Phase 1 (step 2) runs `closeExceptInternalEvents()` — heartbeat stopped, keepalive stopped, stream
   buffer cleared, three of four uploaders closed. The producer side goes quiet immediately, which is
   what you want: no new work is created while the ladder descends.
2. The internal-event queue is deliberately **left open**, so anything the intervening steps emit
   (session-end hooks can still write metadata) is still accepted.
3. Phase 2 (step 10) is the last `await` before exit. By then hooks have run, analytics have flushed,
   diagnostics and debug logs are on disk — so the pre-exit flush sees the *final* contents of the
   queue, not a mid-shutdown snapshot.
4. Only step 11 calls `process.exit`.

**Why this ordering rather than "flush everything in phase 1":** because several later steps are
themselves producers. Session-end hooks (step 6) can emit; `emitScrollTelemetrySummary`
(`gBo`, export name at `:522121`) and the cache-eviction hint (`:522352`) emit telemetry after step 2.
Flushing before them would flush the wrong set. The two-phase split exists precisely so that "stop
producing" and "drain what was produced" can be separated by the rest of the shutdown ladder.

**Key insight:** the bug was never that a flush was missing — 193 could have called
`flushInternalEvents()` too. The bug was that the *close* was scheduled at the wrong point in the
ladder. The fix is a scheduling fix expressed as a second registry.

**Two other drain sites, and one that is missing:**

- `PQd` (`:501855-501864`), the relaunch pre-spawn flush, runs four flushes concurrently, each wrapped
  in `Oa(..., 2000, "<label> timeout (relaunch)")`: `gWe`, `a4r`, **`HFn`** and `hoe`. Here the
  pre-exit drain *does* carry an explicit 2000 ms timeout — stricter than `Ds`, because a relaunch
  must hand the terminal over promptly.
- `YOy` (`:335025-335040`), the bridge/detach `shutdown` frame handler, pushes **`X9t()` only** into a
  `Promise.race([Promise.all(tasks), sleep(5000)]).finally(() => process.exit(0))`. **It never drains
  `F0l`.** A session torn down by a detach-shutdown frame still loses pending internal events. This
  looks like an oversight rather than a decision: the same function already awaits three other
  teardown tasks, so adding `HFn()` would have cost one array push.

### 6.6 Ordering, idempotency, and races

**Idempotent by construction.** `drain()` snapshots into an array and calls `this.#thunks.clear()`
**before** the `await`. A second `drain()` therefore sees an empty set and resolves on the next tick.
This matters concretely: `PQd` is called twice in the relaunch path (`:501834` and `:501836`), so the
second call is guaranteed to be a no-op rather than a double POST.

**No ordering guarantee between callbacks.** `Promise.all(snapshot.map(async t => t()))` starts every
thunk in registration order but awaits them concurrently. With two registrants that touch disjoint
resources (an HTTPS POST and `fs.appendFile`) this is fine and is in fact the point — the two flushes
overlap instead of serialising. **If a future third registrant depends on another's completion, this
registry cannot express that**, and the natural mistake would be to assume registration order implies
run-to-completion order. It does not.

**No error isolation.** `Promise.all` rejects on the first rejection, and the remaining thunks keep
running unobserved. Neither registrant can reject in practice — registrant 1 wraps everything in
`try/finally` over a non-rejecting `withDeadline`, registrant 2 catches inside `writeFn` — but the
registry itself provides no `allSettled` safety net. `Ds` compensates crudely: `await HFn()` sits in a
bare `try {} catch {}` (`:522368-522370`).

**Signal racing normal exit** is handled one level up, not in the registry:

- `Ds` latches on `kht` (`:522315`) and `claimShutdown` (`Dpn`, `:522275`) sets it out of band, so a
  SIGTERM arriving during a SIGINT shutdown is dropped.
- The SIGINT and SIGTERM handlers additionally check the suppression flag `X2o` (`:522441` and
  `:522456` respectively).
- The forced-exit failsafe `Q8s` (`:522210`) clears and re-arms a single `unref`'d timer, so the three
  re-arms (steps 1, 3, 11) never stack.

**The failsafe can kill the flush.** This is the sharpest residual race. `Q8s` fires
`drainStdoutBeforeExit(500).then(() => exitProcessHard(code))` — it does **not** consult `F0l`. If the
ladder is slow (a 10 s session-end hook, a wedged `hoe()`), the failsafe expires while `await HFn()` is
still in flight and the process is killed with events pending. `EXIT_HANDOFF_FAILSAFE_MS = 15000`
(`$ip`, `:522405`, **220=1 / 193=0**) exists to widen this window, but only when `qou()` is true —
i.e. only when an exit *handoff* is registered (`Yoo`, `:162891-162898`), which is not the same
condition as "a remote-control session with queued internal events". A plain interactive session keeps
the `max(5000, hookTimeout + 3500)` budget from step 1 for the entire ladder.

### 6.7 Why a registry instead of each subsystem installing its own exit hook

**Four concrete reasons, each visible in this bundle:**

1. **`process.on("exit")` cannot await.** The whole point of registrant 1 is an HTTPS POST. A
   per-subsystem `exit` hook could not perform it at all; a `beforeExit` hook would not fire, because
   `beforeExit` is skipped when the process ends via an explicit `process.exit()` — which is exactly
   how `eVs` (`:522156-522167`) terminates.
2. **A per-subsystem listener would be silently destroyed.** The relaunch path does
   `process.removeAllListeners("beforeExit"), process.removeAllListeners("exit")` at `:501838`, and
   neuters the three signals at `:501835`. Anything a subsystem had installed on those events is gone.
   A registry lives in module state that `removeAllListeners` cannot reach, and the relaunch path
   instead *chooses* to drain it explicitly at `:501859`.
3. **Ordering control.** `exit` hooks give exactly one scheduling point: "after everything, no async".
   The registry lets the orchestrator place the drain at step 10 of 11 — after hooks and analytics,
   before the stdout drain. That placement *is* the fix; an exit hook could not express it.
4. **Reuse across exit routes.** Three different routes need teardown (`Ds`, `PQd` relaunch, `YOy`
   bridge shutdown). With per-subsystem hooks each route would re-implement the set. With a registry
   each route is one call — which is also why `YOy`'s omission of `HFn()` is a one-line bug rather
   than a structural one.

**What centralising did *not* buy, honestly.** The shutdown ladder still hard-codes four other
bespoke `Set`-of-callbacks singletons drained at fixed points: `hoe`/`x5l` (`:57553`), `Aau`/`BZi`
(`:165974`), `Vou`/`Yoo` (`:162897`), and the analytics sinks behind `yht`. None of them is a
`DisposerRegistry`; none returns an unregister handle. So `vvi` is a good primitive with two instances,
not yet the single mechanism the phrase "registry" implies. A reader extending this should expect to
find teardown in five places, not one.

### 6.8 Does this actually fix the bullet?

**It narrows the window substantially; it does not close it.** Being precise about which parts are
guaranteed:

**Genuinely fixed** — the deterministic, reproducible case the bullet describes. In 193, *any* pending
internal event at shutdown was lost, because the discard happened at step 2 with certainty. In 220 the
queue survives to step 10 and gets a real network flush. The failure mode changed from "always loses
the last batch" to "loses it only under a timeout or a bypass".

**Four residual holes, all read in the 2.1.220 bundle:**

1. **The 3 s deadline is a cap, not a guarantee** (`k7y`, `:416223`). `withDeadline` resolves rather
   than rejects, and `finally { this.close() }` then discards. One slow or retrying POST — `baseDelayMs`
   is 500 ms with up to 30 s backoff (`:415722-415724`) — and the events are dropped exactly as before,
   silently, with no telemetry on the drop.
2. **The forced-exit failsafe does not know about phase 2** (§6.6). It can fire mid-flush.
3. **The bridge shutdown path never drains `F0l`** (`YOy`, `:335037`).
4. **A 409 epoch mismatch bypasses the ladder entirely.** `CCRClient`'s default `onEpochMismatch` is a
   bare `process.exit(1)` (`:415612-415616`) — no `Ds`, no drain, no flush. The bridge REPL overrides
   it with a `close()`-then-throw (`:416822-416829`), which calls the *full* `close()` and therefore
   discards pending internal events too. "Superseded by a newer worker" is not a rare event in the
   remote-control lifecycle, and it is precisely a session ending abruptly.

**So the honest verdict:** the bullet's *mechanism* is real, correctly placed, and well engineered —
a second registry drained as the last await before `process.exit`, with the drain kept asynchronous by
never putting it in an `exit` handler. But "PR events lost when the process exits immediately" is only
fully fixed for exits that go through `Ds` and complete within budget. Hole 4 in particular means the
bullet's own scenario — a short-lived session that ends right after doing something — still has an
unflushed path.

---

## 7. Two bullets I could not anchor

### 7.1 `.203` binary size −7 MB and startup memory −7 MB

> *"Reduced binary size by ~7 MB and startup memory by ~7 MB by loading a large bundled dependency
> lazily instead of inlining it."*

**Verdict: UNANCHORED, and structurally unanchorable from this pair of bundles.** The
`_false_delta_ledger` records `image-processor.node` 1/1 and `audio-capture.node` 2/2; I re-confirmed
both. Neither native addon changed.

Three reasons this cannot be settled here:

1. `cli_inner_pretty.js` **grew +21.4 %** (718,679 → 872,596 lines) across the window. A 7 MB removal
   is invisible against +5.3 MB of net growth in this one file, and the changelog's "binary size" is
   the *compiled Bun binary*, which includes assets not in this extract.
2. If a dependency was moved to a lazy `await import()`, the module body is still in the bundle — the
   saving is in the Bun snapshot / startup heap, not in the source text.
3. `S(() => {…})` lazy-init wrappers are everywhere in both builds (it is the bundler's standard
   `__esm` idiom), so their presence proves nothing about which dependency moved.

I decline to name a dependency.

### 7.2 `.202` resume-by-name and the resume picker in many-worktree repos

> *"Fixed resuming a session by name, or opening the resume picker, taking minutes and using a large
> amount of memory in repositories with many git worktrees."*

**Verdict: CARRYOVER at every anchor I could find.** `worktrees exceeds fanout cap` is
**220=1 (`:545665`) / 193=1 (`:568798`)** — byte-identical bridge-pointer fanout cap, so it is *not*
this fix (the `_false_delta_ledger` reached the same conclusion independently). I additionally
confirmed that all four session-enumeration entry points are 1/1 in both builds:
`getSessionFilesLite`, `getSessionFilesWithMtime`, `loadSameRepoMessageLogsProgressive`,
`loadAllProjectsMessageLogsProgressive`. The progressive loaders — the obvious "don't load everything"
mechanism — already existed.

The worktree-enumeration side of resume is owned by
[`36_background_agents/session_store_and_worktrees.md`](../36_background_agents/session_store_and_worktrees.md);
if an anchor exists it is there, not in the transcript layer.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_performance.md](../00_overview/symbol_additions_v2_1_220_performance.md).

Key functions and constants in this document:
- `reduceFileHistoryState` (`UHe`, `:308856`) - `"track"` now writes a delta; 193 twin `gDe` (`:370591 (193)`)
- `recordFileHistoryDelta` (`Hws`, `:524337`) - the new `file-history-delta` writer, called from `:308877`
- `recordFileHistorySnapshot` (`fEo`, `:524334`) - the base writer, called from `:308921`; 193 twin `LWt` (`:582774 (193)`)
- `deleteEvictedBackupFiles` (`bxy`, `:308937`) - mark-and-sweep unlink of superseded backups, called at `:308915`
- `MAX_SNAPSHOTS` (`dCt`, `:24774`) - `100`; 193 twin `a9a = 100` (`:371076 (193)`) — carryover
- `BACKUP_FILENAME_RE` (`Txy`, `:309674`) - `/^[0-9a-f]{16}@v\d+$/`, the unlink allow-list
- `resolveBackupPath` (`Ldt`, `:309258`) - two-guard path builder for `file-history/<sessionId>/<name>`
- `notifySnapshotContentChanges` (`Hxy`, `:309602`) - snapshot-diff notifier; 193 twin `z2p` (`:371040 (193)`)
- `isTranscriptLocalGcEnabled` (`kCm`, `:840677`) - `CLAUDE_CODE_TRANSCRIPT_LOCAL_GC` ?? gate `tengu_transcript_local_gc` (default **false**)
- `setTranscriptLocalGcEnabled` (`EVs`, `:523003`) - single caller `:849846`
- `TRANSCRIPT_GC_RETENTION_CLASS` (`nB_`, `:527551`) - the four-class table; reader `oB_` (`:523006`)
- `ENTRY_APPEND_POLICY` (`psp`, `:527516`; export name at `:522995`)
- `planReAppendSessionMetadata` (method, `:523596`) - the `.199` fix at `:523620-523625`; 193 twin `:582307 (193)`
- `normalizeLastPrompt` (method, `:523586`) - 220-only; uses `ma(t, 200)`
- `extractFieldFromLastEntryOfTypeStrict` (`lxt`, `:51379`, export name `:51300`) - 220-only recovery helper
- `reAppendSessionMetadataAtExit` (`xVs`, `:523292`) - `process.on("exit")` hook registered at `:523315`
- `hydrateForkContext` (`Csp`, `:524292`) - cache + in-flight coalescing; 193 twin `$jf` (`:582742 (193)`)
- `loadForkContextPrefix` (`EB_`, `:524300`) - byte-accounted insert and dual-criterion eviction
- `forkPrefixCache` (`fRe`, `:527595`) / `forkPrefixInFlight` (`Q2o`, `:527595`)
- `FORK_CONTEXT_CACHE_MAX_ENTRIES` (`_B_`, `:527423`) - `4`; 193 twin `Mjf = 4` (`:585522 (193)`) — carryover

Pre-exit flush registry (§6):
- `DisposerRegistry` (`vvi`, `:4361`) - the teardown-callback set; class body byte-identical to 193's `sYo` (`:3907 (193)`)
- `cleanupRegistry` (`N0l`, `:4382`) / `preExitFlushRegistry` (`F0l`, `:4383`) - phase-1 and the **220-only** phase-2 instance
- `registerCleanup` (`Aa`, `:4347`) / `drainCleanup` (`X9t`, `:4350`) - phase 1; 193 twins `Si` (`:3899 (193)`) / `NYe` (`:3902 (193)`)
- `registerPreExitFlush` (`kFn`, `:4353`) / `drainPreExitFlush` (`HFn`, `:4356`) - phase 2, **220-only**; only 3 mentions in the bundle
- `toTeardownThunk` (`cUm`, `:4342`) - function | `Symbol.asyncDispose` | `Symbol.dispose` normaliser
- `gracefulShutdown` (`Ds`, `:522314`) - the 11-step exit ladder; `await HFn()` at `:522369` is the last await before exit
- `armForcedExitWatchdog` (`Q8s`, `:522210`) - single re-armable `unref`'d failsafe; does **not** consult `F0l`
- `EXIT_HANDOFF_FAILSAFE_MS` (`$ip`, `:522405`) - `15000`, **220=1 / 193=0**; applied only when `qou()` (`:162894`) is true
- `flushStdoutAndArmFinalFailsafe` (`Uip`, `:522373`) - step 11, re-arms to `getStdoutDrainBudgetMs() + GF_` (`1500`, `:522406`)
- `flushBeforeRelaunch` (`PQd`, `:501855`) - the relaunch drain; wraps `HFn()` in an explicit 2000 ms `withTimeout`
- `handleBridgeShutdownFrame` (`YOy`, `:335025`) - drains `X9t()` only at `:335037`; **never drains `F0l`**
- `CCRClient.registerShutdownCleanup` (`:416193`) - registrant 1; test seam via default-parameter injection
- `INTERNAL_EVENT_FLUSH_DEADLINE_MS` (`k7y`, `:416223`) - `3000`; `withDeadline` resolves on timeout, then `close()` discards
- `BatchedUploader` (`oln`, `:415372`) - generic upload queue; `close()` (`:415411`) drops `pending` and resolves flush waiters
- `flushErrorLogWriters` (`Gcp`, `:538540`, export name `:538516`) - registrant 2; 193 twin `C1f` (`:563386 (193)`) was `_flushLogWritersForTesting`
- `getOrCreateLogWriter` (`Wzs`, `:538556`) - registers into **both** phases at `:538574-538578`
- `logWriteQueue` (`Tmn`, `:538642`) - keyed serial queue from `W5` (`:48955`); `settle()` `:48978`, `drain()` `:48981`
- `createBufferedWriter` (`z9t`, `:4104`) - `flush` is **synchronous** (`d()`, `:4124`), which is why `Gcp` does not await it
- `withDeadline` (`DBr`, `:20492`) - resolves on timeout, never rejects, never cancels
- `withTimeout` (`Oa`, `:20483`) - rejects on timeout (contrast with `DBr`)
- `FORK_CONTEXT_CACHE_MAX_BYTES` (`bB_`, `:527424`) - `16777216` — the delta
- `serializeEntry` (`eCi`, `:19819`) - `JSON.stringify(e) + "\n"`, the byte estimator
- `MAX_TRANSCRIPT_READ_BYTES` (`AVs`, `:527411`) - `52428800`; export name at `:522990`
- `OBSERVER_REF_TAIL_SCAN_BYTES` (`Tsp`, `:527422`) - `1048576`
- `drainStdoutBeforeExit` (`jzt`, `:20552`, export name `:20513`) - byte-scaled exit drain
- `getStdoutDrainBudgetMs` (`OUn`, `:20578`, export name `:20512`)
- `getPendingStdoutBytes` (`gIl`, `:20572`)
- `ASSUMED_PIPE_THROUGHPUT_BPS` (`f9m`, `:20646`) - `262144`
- `DRAIN_BUDGET_CEILING_MS` (`m9m`, `:20647`) - `30000`
- `markStdoutDrainExternallyClocked` (`fWe`, `:20561`, export name `:20507`)
