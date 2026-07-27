# `/fork` becomes a background session copy, and `/subtask` inherits the old job

**Module:** `36_background_agents` (part 2 of 2 — see [`README.md`](README.md))
**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
**Baseline:** `…/2.1.193/extract/cli_inner_pretty.js` — every count below is `220=N / 193=M`

> `43_slash_commands` owns `/fork` and `/subtask` **as commands** (registration, argument parsing,
> availability). This document owns the **background-session mechanics**: the transcript snapshot, the
> live-parent protection, the lineage record, the worktree relocation, and the agent-view row the fork
> produces.

---

## 0. The finding that makes this bullet easy to verify

`.212 #1` says: *"`/fork` copies the conversation into a new background session; the old behaviour moved to
`/subtask`."*

That is literally true, and the proof is a **byte-level function move**. 2.1.193's `/fork` handler and
2.1.220's `/subtask` handler are the same body with three strings swapped:

```javascript
// 2.1.193 :550822-550837  — the OLD /fork
var YDf = async (e, t, n) => {
  let r = n.trim();
  if (!r) return (e("Usage: /fork \\<directive\\>", { display: "system" }), null);
  let o = await v0o(r, t, t.canUseTool ?? ZR);
  if (!o)
    return (e(gv() ? "Forking is not available in coordinator sessions. Use /branch instead."
                   : "Cannot fork before the first conversation turn", { display: "system" }), null);
  return (e(`${FJe} forked ${o.name} (${o.agentId.slice(-4)})`, { display: "system" }), null);
};

// 2.1.220 :500547-500562  — the NEW /subtask
var NL_ = async (e, t, r) => {
  let n = r.trim();
  if (!n) return (e("Usage: /subtask \\<task\\>", { display: "system" }), null);
  let o = await Lpn(n, t, t.canUseTool ?? cM);
  if (!o)
    return (e(F_() ? "Subtasks are not available in coordinator sessions. Use /branch instead."
                   : "Cannot start a subtask before the first conversation turn", { display: "system" }), null);
  return (e(`${NO} forked ${o.name} (${o.agentId.slice(-4)})`, { display: "system" }), null);
};
```

| literal | 220 | 193 |
|---|---|---|
| `Usage: /subtask` | 1 | **0** |
| `Cannot start a subtask before the first conversation turn` | 1 | **0** |
| `Subtasks are not available in coordinator sessions` | 1 | **0** |
| `Usage: /fork` | 1 | 1 |
| `Cannot fork before the first conversation turn` | 2 | 2 |

Note the last two rows: the *old* `/fork` strings still exist in 2.1.220 (they moved to the
`Task(subagent_type:"fork")` path), which is exactly why counting `fork` literals cannot resolve this
bullet. What resolves it is the **command descriptor pair**:

```javascript
// 2.1.193 :550848-550853
{ type: "local-jsx", name: "fork",
  description: "Spawn a background agent that inherits the full conversation",
  argumentHint: "<directive>", isEnabled: () => !gv(), load: … }

// 2.1.220 :500537-500543
{ type: "local-jsx", name: "fork",
  description: "Copy this conversation into a new background session and keep working here",
  argumentHint: "[prompt]", isEnabled: () => !F_() }

// 2.1.220 :500572-500579  (new command)
{ type: "local-jsx", name: "subtask",
  description: "Send a subagent off with your full context; its result comes back here",
  argumentHint: "<task>", isEnabled: () => !F_(), load: … }
```

Two changes hide in the descriptor: `argumentHint` went from `<directive>` (**required**) to `[prompt]`
(**optional**) — because a fork with no prompt is meaningful (§4 gives it the name of the parent and
parks it waiting) — and `/fork` lost its `load` thunk because its implementation moved into an
independently-loaded module (`A_f`, exported at `:695432`).

**And the semantics genuinely inverted.** Old `/fork` produced a *subagent whose result came back to the
parent*. New `/fork` produces a *sibling session that the parent forgets about*. The one-word summary of
the whole change is in the two descriptions: `subtask` says "its result comes back here"; `fork` says
"keep working here".

---

## 1. Bullet ledger for this document

| Ver | # | Bullet (gist) | Verdict | Proof | § |
|-----|---|---------------|---------|-------|---|
| .212 | 1 | `/fork` copies the conversation into a new bg session; old behaviour → `/subtask` | NET_NEW | descriptor pair `:500537-500579`; handler move `:500547-500562` ≡ `:550822-550837 (193)` | §0 |
| .212 | 39 | `/fork` names the copy after your prompt when the session has no title | NET_NEW + **FALSE ANCHOR** | naming at `:683674-683676`; **`--fork-name` `:443144` is a `gh repo fork` flag, not ours** | §4, §8 |
| .212 | 24 | `/fork` sessions losing live-parent protection after a write failure | NET_NEW | flush fail-closed `:683699-683712`; env-var re-apply `:335085-335088` | §3, §5 |
| .216 | 30 | `/fork` confirmation to one line with name, `claude attach` id, shared-checkout note | NET_NEW | `uVo` `:643641-643643`; chips `:695495-695500`; `session running`/`session waiting for a prompt` 4/0, 1/0 | §6 |
| — | — | `tengu_session_fork` telemetry | DELTA | 220=2 / 193=1; the new emission is `:695485-695492` with 6 dimensions | §6 |
| — | — | `--fork-session` CLI flag | CARRYOVER | 12/12; the flag pre-existed, the *snapshot it resumes from* is new | §3 |
| — | — | `currently running as a background agent` | CARRYOVER | 3/3, e.g. `:849864` | §8 |

Not a changelog bullet but the largest mechanism here: the **`keepParent` branch** through the shared
background-spawn function (`keepParent` **220=18 / 193=0**). Everything in §2–§5 hangs off it.

---

## 2. One spawner, two modes: `keepParent`

`/fork` does not have its own spawner. It calls the same function the `←` handoff and `/background` call,
with one extra option:

```javascript
// :695476-695479
let hhe = await gGt(G1a, ICn || null, W1a, q1a, V1a, z1a, K1a, "fork_session", rei, {
  keepParent: !0,
  taskFreeInFlight: { tasks: 0, queued: 0, kinds: [] },
});
```

`spawnBackgroundSessionFromConversation` (`gGt`, `:683672-683856`) branches on `keepParent` **nine
times**. The table below is the complete difference between "fork" and "hand off":

| Concern | `keepParent: true` (fork) | `keepParent: false` (`←` / `/background`) | line |
|---|---|---|---|
| coordinator sessions | refuse: `coordinator_mode` | allowed | `:683673` |
| auto-name | `<parent name> ⑂ <prompt≤60>` | none here (async LLM naming later) | `:683674-683676` |
| transcript flush wait | **10,000 ms** | 2,000 ms | `:683700` |
| flush timeout | **refuse**, `flush_incomplete` | continue | `:683702-683711` |
| transcript source | a **private copy** under the child's job dir | the parent's live file | `:683716-683728` |
| appended system prompt | worktree-avoidance paragraph when relocated | none | `:683732-683736` |
| parent's worktree | **left alone**; child relocates to `originalCwd` | **handed over** to the child (`C`) | `:683688`, `:683691`, `:683772-683774` |
| roster isolation field | `bgIsolation: "default"` | inherited | `:683769` |
| lineage fields | `forkSourceAlive/BoundaryAt/SessionId/ParentSessionId` | none | `:683771` |
| post-spawn teardown | none | `Yor(worktreePath, originalCwd)` + `gde()` | `:683828-683831` |
| async LLM naming | **skipped** (it already has a name) | runs | `:683832-683838` |
| `editsIn` in the result | computed | absent | `:683849-683855` |

**Why one function and not two?** Everything downstream of the argv assembly — daemon dispatch, roster
record shape, worktree bookkeeping, failure telemetry, the `left_arrow` queue-for-later recovery path — is
genuinely identical, and that tail is the hard part (`:683738-683838` is ~100 lines of it). The
`keepParent` flag isolates the differences to nine well-marked points. The cost is a function that reads
like a two-mode machine; the alternative (two spawners) would have duplicated the recovery paths, which is
where the `.196`–`.211` bug reports actually clustered.

---

## 3. Live-parent protection is a **file copy**, and it fails closed

This is the mechanism the changelog never names. When the parent session must stay alive, the child cannot
be pointed at the parent's transcript, because both processes append to it.

```javascript
// ============================================
// snapshotParentTranscriptForFork - gives the child its own copy of the parent transcript
// Location: cli_inner_pretty.js:683698-683728
// ============================================

// ORIGINAL (for source lookup):
  try {
    if (c?.keepParent) await RYe(l.at(-1)?.uuid ?? null);
    await Oa(tC(), c?.keepParent ? 1e4 : 2000, "flush timeout");
  } catch {
    if (c?.keepParent)
      return (
        O("tengu_background_spawn_failed", { via: fe(a) }),
        { ok: !1, error: "Couldn't fork — this conversation is still being saved. Try again in a moment.",
          queued: !1, reason: "flush_incomplete" }
      );
  }
  let L = H, P = c?.providedSessionId, M;
  if (c?.keepParent && H !== null) {
    ((P ??= zIa.randomUUID()), (M = rc(P.slice(0, 8))));
    let F = Exr.join(M, "tmp", "parent-transcript.jsonl");
    try {
      (await rje.mkdir(Exr.dirname(F), { recursive: !0, mode: 448 }), await rje.copyFile(H, F), (L = F));
    } catch (G) {
      return (
        await rje.rm(M, { recursive: !0, force: !0 }).catch(() => {}),
        O("tengu_background_spawn_failed", { via: fe(a) }),
        { ok: !1, error: `Couldn't fork — ${le(G)}`, queued: !1, reason: "snapshot_copy_failed" }
      );
    }
  }

// READABLE (for understanding):
  try {
    if (opts?.keepParent) await flushTranscriptThrough(messages.at(-1)?.uuid ?? null);
    await withTimeout(awaitTranscriptWrites(), opts?.keepParent ? 10_000 : 2_000, "flush timeout");
  } catch {
    if (opts?.keepParent)
      return { ok: false, reason: "flush_incomplete", queued: false,
               error: "Couldn't fork — this conversation is still being saved. Try again in a moment." };
    // handoff mode: fall through and spawn anyway
  }
  let resumeFrom = liveTranscriptPath, childSessionId = opts?.providedSessionId, childJobDir;
  if (opts?.keepParent && liveTranscriptPath !== null) {
    childSessionId ??= crypto.randomUUID();
    childJobDir = jobDirFor(childSessionId.slice(0, 8));
    let snapshot = path.join(childJobDir, "tmp", "parent-transcript.jsonl");
    try {
      await fs.mkdir(path.dirname(snapshot), { recursive: true, mode: 0o700 });
      await fs.copyFile(liveTranscriptPath, snapshot);
      resumeFrom = snapshot;                          // child resumes the COPY
    } catch (err) {
      await fs.rm(childJobDir, { recursive: true, force: true }).catch(() => {});
      return { ok: false, reason: "snapshot_copy_failed", queued: false,
               error: `Couldn't fork — ${err}` };
    }
  }

// Mapping: gGt→spawnBackgroundSessionFromConversation, c→opts, l→messages, H→liveTranscriptPath,
//          L→resumeFrom, P→childSessionId, M→childJobDir, RYe→flushTranscriptThrough,
//          Oa→withTimeout, tC→awaitTranscriptWrites, rc→jobDirFor, 448→0o700
```

**How it works:**
1. `flushTranscriptThrough(lastMessageUuid)` asks the transcript writer to persist *at least* up to the
   last message the fork is supposed to inherit. This is not a generic "flush everything" — it names the
   boundary, so a message arriving during the flush does not have to be waited for.
2. `withTimeout(awaitTranscriptWrites(), 10_000)` then waits for the writer to quiesce. **10 seconds for a
   fork versus 2 for a handoff.**
3. **On timeout the fork is refused.** The handoff path deliberately swallows the same failure and
   continues.
4. The child's session id is minted *now* (not by the daemon) so its job directory is known before the
   spawn, and the parent transcript is `copyFile`'d to `<jobdir>/tmp/parent-transcript.jsonl` with
   directory mode `0o700`.
5. The child is launched with `--resume <snapshot> --fork-session` (`:683739`) — so the running child never
   opens the parent's file at all.
6. A failed copy **removes the whole child job directory** before returning, so a half-created job never
   appears in the roster.

**Why the asymmetric timeouts (10 s vs 2 s)?**
- In the **handoff** case the parent is *going away*. Its live transcript file is the child's transcript
  file. If the flush has not finished, the child will still read the same growing file and the data lands
  eventually. Waiting longer buys nothing, so 2 s is a politeness delay.
- In the **fork** case the copy is a **snapshot**: whatever has not been flushed at `copyFile` time is
  *permanently absent from the child's history*. There is no eventual consistency. A fork that silently
  drops the last three turns is worse than a fork that fails, so the wait is 5× longer and the failure is
  surfaced with a retry instruction ("Try again in a moment") rather than absorbed.

**Why a copy instead of a hard link or a read-only handle?** A hard link would share the inode, so the
parent's continued appends would appear in the child's history *after* the fork point — precisely the
thing a fork must not do. A read-only open would have the same problem plus a Windows sharing-violation
risk. `copyFile` is the only option that gives the child an immutable past.

**Failure modes and who sees them:** all three refusals (`coordinator_mode`, `flush_incomplete`,
`snapshot_copy_failed`) come back as `{ ok: false, error, reason }` and are surfaced by the caller at
`:695480-695483` as `pe("repl_session_fork", hhe.reason ?? "spawn_failed")` plus the error text in the
transcript. The outermost `catch` (`:695502-695506`) adds the reassurance the user needs:

> `Couldn't fork: <err>. This session is unaffected; try again.`

That last clause is the entire user-facing contract of `keepParent`.

---

## 4. Naming the fork after the prompt (`.212 #39`)

```javascript
// :683674-683676
let u = c?.keepParent ? ma(mu(Uf(t ?? "")), 60) : "",
  d = e.name ? `${e.name} ${NO}${u ? ` ${u}` : ""}` : u ? `${NO} ${u}` : void 0,
  p = c?.keepParent ? { ...e, name: d, nameSource: d ? "auto" : void 0 } : e,
```

`NO = "⑂"` (`:58422`) is U+2442 OCR FORK — the glyph the `/subtask` confirmation also uses
(`:500561`). Reading the ladder:

| parent has a name? | prompt given? | resulting fork name |
|---|---|---|
| yes | yes | `<parent name> ⑂ <prompt truncated to 60>` |
| yes | no | `<parent name> ⑂` |
| no | yes | `⑂ <prompt truncated to 60>` |
| no | no | `undefined` → falls through to the seed's own name |

`nameSource: "auto"` marks it as machine-generated, which matters because the async LLM namer at
`:683832-683838` is skipped entirely for forks (`&& !c?.keepParent`) — the fork's name is decided
synchronously and never revised.

**Why 60 characters and why the prompt?** The row label renderer (`r8t`, `:802682-802705`) allows 25
display columns and prefers 3 words of `intent`. 60 characters of prompt is generous enough that the
truncation happens at *render* time with the terminal's width in hand, rather than being baked into the
roster record. And the prompt is a better name than the parent's title precisely because a fork exists to
do something *different* from the parent — otherwise the fleet view would show N rows all named after the
same conversation. The `⑂` glyph carries the lineage instead of a text prefix, keeping the 25 columns for
the distinguishing part.

**Where the fallback name comes from.** The `seed` is built before the spawner runs:

```javascript
// ============================================
// buildSpawnSeedFromMessages - derives intent / name / colour / detail for a new bg session
// Location: cli_inner_pretty.js:683968-683999
// ============================================

// ORIGINAL (for source lookup):
function HJe(e, t, r = "(backgrounded)") {
  let n = t, o = !1, i;
  for (let c = e.length - 1; c >= 0; c--) {
    let u = e[c];
    if (u.type === "assistant" && i === void 0) {
      let d = ite(u);
      if (d) i = ma(d.replace(/\s+/g, " ").trim(), 120);
    }
    if (u.type === "user" && !u.isMeta && !cte(u)) {
      let d = iD(u)?.trim();
      if (d && WEe(d)) { if (d.startsWith(`<${ST}>`)) o = !0; continue; }
      if (((o = !0), !n && d)) n = d;
    }
    if (o && n && i !== void 0) break;
  }
  if (!o && !t) return null;
  let s = fA(kt()), a = JUe(kt()), l = g2t();
  return { intent: ma(n || r, 200), name: s ?? a,
           nameSource: s ? "user" : a ? "auto" : void 0,
           color: kMt(l) ? l : void 0, detail: i };
}

// READABLE (for understanding):
function buildSpawnSeedFromMessages(messages, explicitPrompt, fallbackIntent = "(backgrounded)") {
  let intent = explicitPrompt, sawRealUserTurn = false, lastAssistantText;
  for (let i = messages.length - 1; i >= 0; i--) {                     // newest first
    let m = messages[i];
    if (m.type === "assistant" && lastAssistantText === undefined) {
      let text = extractAssistantText(m);
      if (text) lastAssistantText = truncate(collapseWhitespace(text), 120);
    }
    if (m.type === "user" && !m.isMeta && !isToolResultOnly(m)) {
      let text = extractUserText(m)?.trim();
      if (text && isSyntheticUserText(text)) {                          // reminders, injections
        if (text.startsWith(`<${SYSTEM_REMINDER_TAG}>`)) sawRealUserTurn = true;
        continue;                                                       // never use it as the intent
      }
      sawRealUserTurn = true;
      if (!intent && text) intent = text;
    }
    if (sawRealUserTurn && intent && lastAssistantText !== undefined) break;
  }
  if (!sawRealUserTurn && !explicitPrompt) return null;                 // "Nothing to fork yet"
  let userTitle = userSessionTitle(currentSessionId()),
    autoTitle = autoSessionTitle(currentSessionId());
  return {
    intent: truncate(intent || fallbackIntent, 200),
    name: userTitle ?? autoTitle,
    nameSource: userTitle ? "user" : autoTitle ? "auto" : undefined,
    color: isValidColor(sessionColor()) ? sessionColor() : undefined,
    detail: lastAssistantText,
  };
}

// Mapping: HJe→buildSpawnSeedFromMessages, e→messages, t→explicitPrompt, r→fallbackIntent,
//          ite→extractAssistantText, iD→extractUserText, cte→isToolResultOnly,
//          WEe→isSyntheticUserText, ma→truncate, fA→userSessionTitle, JUe→autoSessionTitle
```

Three things worth noting:
- It walks **backwards** and breaks as soon as it has all three fields, so it is O(recent turns) not
  O(conversation).
- Synthetic user turns (system reminders, injected notifications) are skipped as intent candidates but
  **still count as evidence that a real turn happened** (`sawRealUserTurn = true` inside the `continue`
  branch, for the `<system-reminder>` case). That distinction is why a session whose only user-role
  content is injected still forks, but does not get named after the injection.
- The `/fork` caller passes the fallback `"(forked)"` (`:695547`, **220=1 / 193=0**) instead of the default
  `"(backgrounded)"`, and a `null` return becomes
  `Nothing to fork yet. Send a message first.` (`:695548`, **220=1 / 193=0**).
- The seed's `detail` — the last assistant text, truncated to **120** characters — pre-seeds the fork's
  status column so the row is not blank before the first classification. 120 is roughly double the
  classifier's 64-character headline budget (see
  [`agent_view_and_status.md`](agent_view_and_status.md) §3), i.e. deliberately over-long, because it is
  raw prose rather than a written headline.

---

## 5. Fork lineage: a roster record, an env var, and a boundary timestamp

The child needs to know three things forever: *that* it was forked, *from whom*, and *where the parent's
history stops*. 2.1.220 records this twice, in two independent stores.

**Store 1 — the roster record.** `:683771`:

```javascript
...(c?.keepParent && W !== void 0 && {
  forkSourceAlive: !0, forkBoundaryAt: W, forkSessionId: P, forkParentSessionId: kt()
}),
```

`W = l.at(-1)?.timestamp` (`:683761`) — the timestamp of the last inherited message. Counts:
`forkSourceAlive` **220=10 / 193=0**, `forkBoundaryAt` 8/0, `forkParentSessionId` 8/0, `forkSessionId`
10/0. The zod schema slot is `:331164`, the record projection `:330890`, and the roster updater carries
them forward on every write with `C?.forkSourceAlive ?? I?.forkSourceAlive` (`:335905-335908`) — a
two-source merge so a partial write cannot erase them.

**Store 2 — the environment.** `CLAUDE_CODE_RESUME_SOURCE_ALIVE`, packed by `gnd` (`:319489-319491`) as

```
<sessionId>|<boundaryAtISO>[|<parentSessionId>]
```

written into the child's spawn env at `:682558`, and parsed back by `hrn` (`:319492-319497`) /
`Pvo` (`:319498-319508`):

```javascript
function Pvo(e) {
  let t = hrn(e);
  if (t?.sessionId === void 0 || !/^\d{4}-\d{2}-\d{2}T/.test(t.boundaryAt)) return null;
  return { forkSourceAlive: !0, forkBoundaryAt: t.boundaryAt, forkSessionId: t.sessionId,
           ...(t.parentSessionId && { forkParentSessionId: t.parentSessionId }) };
}
```

`hrn` tolerates a **legacy single-field form** (`t.length === 1` → `{ boundaryAt: e }`), which is why
`Pvo` re-validates: a legacy value has no `sessionId` and is rejected, so an old-format env var cannot
half-populate the lineage. The ISO-prefix regex is a cheap sanity check before `Date.parse`, which would
otherwise happily accept garbage as `NaN`.

### The write-failure repair — this is `.212 #24`

```javascript
// :335085-335088, inside the worker's own startup reconciliation
if (!t.forkSourceAlive) {
  let r = Pvo(Z.CLAUDE_CODE_RESUME_SOURCE_ALIVE);
  if (r) (await um(e, { ...t, ...r }), Object.assign(t, r));
}
```

**What it does:** on startup the forked worker reads its own roster record; if the record does not claim
fork lineage but the *environment* does, the worker writes the lineage back into the roster and patches
its in-memory copy.

**Why this exists:** the roster record is written by the **parent** immediately before spawning
(`:683762-683778`). That write can fail — full disk, a concurrent roster rewrite, a daemon restarting
mid-handover. The env var, by contrast, is delivered by the kernel as part of `execve` and cannot be
partially applied. So the env var is the **authoritative** copy and the roster record is a cache;
the child repairs the cache from the authority. The bullet's phrasing ("losing live-parent protection
after a write failure") describes exactly the failure this closes.

Note the direction: the code never repairs the env var from the roster. That asymmetry is the design.

### What the lineage is *for*

`RMr` (`:809097-809113`) is the consumer that makes live-parent protection real:

```javascript
async function RMr(e, t, r, n) {
  let o = hrn(Z.CLAUDE_CODE_RESUME_SOURCE_ALIVE), i = e;
  if (o !== null) {
    if (o.parentSessionId !== void 0 && o.parentSessionId === kt()) return;      // I AM the parent
    if (o.sessionId === void 0 || o.sessionId === kt()) {
      let s = /^\d{4}-\d{2}-\d{2}T/.test(o.boundaryAt) ? Date.parse(o.boundaryAt) : Number.NaN;
      if (Number.isNaN(s)) return;
      i = e.filter((a) => Date.parse(a.timestamp) > s);                          // post-boundary only
    }
  }
  … U7S(i) … // rebuild the background-task registry from the surviving messages
}
```

**How it works:**
1. If the running session **is** the recorded parent, the whole function returns — the parent must not
   have its task registry rebuilt from a fork's perspective.
2. If the running session is the recorded child (or the record predates session ids), messages are
   filtered to those **strictly after the fork boundary**.
3. Only then is the background-task registry rebuilt from the surviving messages (`U7S`,
   `:809118-…`, which scans assistant turns for `tool_use` blocks and summarises agent/shell/workflow
   children).

**Why this is the crux:** the parent's transcript is full of `tool_use` blocks that spawned **still-running**
subagents and background shells. A naive resume would make the fork adopt them — two sessions polling and
replying to the same worker, and (worse) the fork re-dispatching prompts the parent already answered.
Filtering by `> boundaryAt` means the fork inherits the *text* of the parent's history but **none of its
live children**. The `parentSessionId === kt()` early return is the mirror image: it stops a parent that
happens to have the env var in scope (e.g. a re-exec) from applying a child's filter to itself.

`Number.isNaN(s) → return` is the fail-closed branch: an unparseable boundary means *do not filter*
**and do not rebuild** — refusing to rebuild is safer than rebuilding from the wrong set.

`tengu_persistence_suppressed` (**220=2 / 193=0**, emitted at `:749593` with a `cause` dimension,
registered at `:537373`) is the adjacent observability: it reports when persistence was suppressed at all,
which is the failure class the roster-write repair above compensates for. It is *not* itself the fork fix.

---

## 6. The one-line confirmation and the worktree relocation

### The relocation decision

```javascript
// :683687-683696
let T = a_(),                                                       // current worktree entry, if any
  C = !c?.keepParent && Boolean(T && !T.enteredExisting),           // hand the worktree over?
  I = (() => {
    if (!c?.keepParent) return null;
    if (T) return { to: T.originalCwd, from: T.enteredExisting ? "entered" : "owned" };
    if (!Vye(gn())) return null;
    let F = gu(gn());
    return F && zc(F) === F ? { to: F, from: "launched" } : null;
  })(),
  R = I?.to;
```

Three `relocatedFrom` cases, all fork-only:
- **`owned`** — this session created the worktree and is still in it. The fork is relocated to
  `originalCwd`.
- **`entered`** — this session entered a worktree it did not create. Same relocation.
- **`launched`** — no worktree entry, but the cwd *is* a linked worktree (`Vye`), and its main repo root
  (`gu` → `zc` idempotence check) is resolvable. Relocate there.

The `zc(F) === F` test is a self-consistency check: the resolved root must itself resolve to itself,
otherwise the path is not a repository root and relocation is skipped rather than guessed.

**And the child is told about it in words.** `:683732-683736` appends a system prompt:

> `This conversation was forked out of <worktreePath> (branch <b>), a linked worktree another live session is still using — never edit files or run commands in that directory. You are in <to>; isolate with EnterWorktree before making code changes, and start from branch <b> if the task depends on its work.`

(`xpe = "EnterWorktree"`, `:230895`.) This is belt-and-braces: relocating the cwd is the *mechanical*
protection, and the prompt is the *behavioural* one, because a model with a shell can still `cd` back. It
also solves a real usability problem — a fork of worktree work that starts from `main` would silently
diverge — by naming the branch to start from.

### The confirmation line (`.216 #30`)

```javascript
// :695493-695501
let zJk = hhe.name ? Ipa(mu(Uf(hhe.name))) : void 0;
let KJk = ICn ? rEn : Nwr;                                  // "session running" | "session waiting for a prompt"
let qYb = hhe.relocatedTo
  ? "runs in the origin tree"
  : hhe.editsIn === "this-tree"
    ? "edits this checkout"
    : void 0;
let YJk = uVo({ state: KJk, name: zJk, id: hhe.short, chips: qYb ? [qYb] : [] });
HCn(YJk, { display: "system", … });
```

`uVo` (`:643641-643643`) is trivial — `[state, name?, id?, ...chips].join(" · ")` — and this is its **only
caller outside its own shortener** (`:695500`). Every literal is net-new: `session running` 4/0,
`session waiting for a prompt` 1/0, `session waiting` 2/0, `runs in the origin tree` 1/0,
`edits this checkout` 1/0.

So a fork confirms as one of, e.g.:

```
session running · auth-refactor ⑂ fix the retry helper · a1b2c3d4 · runs in the origin tree
session waiting for a prompt · a1b2c3d4
```

The chip is a **shared-checkout warning in three characters of vocabulary**: `runs in the origin tree`
means the fork was relocated out of a worktree someone else is using; `edits this checkout` means the fork
will write to the *user's own* files (computed at `:683851-683854`: the cwd is a worktree, or
`worktree.bgIsolation === "none"`); and **no chip** means the fork got its own worktree. That is the whole
`.216 #30` bullet.

`Lpa` (`:643622-643640`) is the degradation ladder when the line does not fit a width `t`:
1. downgrade `session waiting for a prompt` → `session waiting` (saves 14 columns);
2. drop the id (only if the name is present — an unnamed session's id is all you have);
3. truncate the name, but **never below `l6p = 20` columns** unless it was already shorter
   (`:643636`).

The ordering encodes what is worth keeping: the *state word* is never dropped, the *name* is protected by
a floor, and the *id* is the first casualty because it is recoverable from the agents view.

### Telemetry

`tengu_session_fork` is **220=2 / 193=1** — the gate name pre-existed. The new emission (`:695485-695492`)
carries six dimensions:

```javascript
{ had_prompt: ICn.length > 0, message_count: rei.length, had_worktree: hhe.hadWorktree,
  relocated: hhe.relocatedTo !== void 0,
  ...(hhe.relocatedFrom && { relocated_from: fe(hhe.relocatedFrom) }),
  ...(hhe.sessionId && { child_session_hash: Kc(hhe.sessionId) }) }
```

`child_session_hash` is hashed rather than raw, and `relocated_from` is only present when relocation
happened — so the event can answer "how often does a fork land in a shared checkout" without linking
sessions.

---

## 7. Refusal ladder: five reasons `/fork` says no

`KYb` (`:695530-695550`) runs before any spawning:

| order | test | message | rationale |
|---|---|---|---|
| 1 | `F_()` (coordinator session) | `kJo` = `Forking is not available in coordinator sessions. Use /branch instead.` (`:684209`) | a coordinator's children are already sessions; `/branch` is the right primitive |
| 2 | `w1()` (persistence off) | `Can't fork: session persistence is off, so the new session would have nothing to start from. Run the task here, or fork from a session that saves its transcript.` (1/0) | the whole mechanism is a transcript copy |
| 3 | `ql() \|\| rf() \|\| Vbi()` (safe/bare mode, custom system prompt, tool allowlist, restricted settings) | `Can't fork: this session was started with launch flags … that the copy wouldn't inherit, so it would run with fewer restrictions than this session. …` (1/0) | **a privilege-escalation refusal** |
| 4 | seed is `null` | `Nothing to fork yet. Send a message first.` (1/0) | nothing to copy |
| 5 | any spawner refusal (§3) | `Couldn't fork — …` / `Couldn't fork: …. This session is unaffected; try again.` | |

**Guard 3 deserves emphasis.** The child is spawned through the daemon with a fresh argv assembled at
`:683738-683760`. That argv reconstructs `--add-dir`, `--allowed-tools`, `--disallowed-tools`,
`--model`, `--effort`, `--permission-mode`, `--agent(s)` and `--append-system-prompt` — but it has **no
way to reconstruct** `--strict-mcp-config`-class launch restrictions, a custom system prompt file, or safe
mode. So a fork of a locked-down session would be a *less* locked-down session containing the same
conversation. Rather than approximate the restrictions, `/fork` refuses and says why, and the message
names the workaround ("start a session without those flags and fork from there"). This is the same
fail-closed instinct as the flush timeout in §3, applied to authority instead of data.

The permission surface that *is* carried is narrow and explicit (`:683679-683686`): only
`source === "session"` additional directories, and only the `session` and `cliArg` tiers of the
allow/deny rule sets — `sessionPermissionRules: { allow, deny }` goes into the roster record
(`:683775`) while the `cliArg` tiers go onto the argv. Rules from settings files are *not* copied,
because the child will read the same settings files itself.

---

## 8. False anchors and carryover in this theme

### `--fork-name` is a GitHub CLI flag

The scoping pass and the ground-truth notes both list `--fork-name` (`:443144`) as the anchor for
`.212 #39`. It is not related to `/fork` at all:

```javascript
// :443137-443144, inside the auto-mode / command-analysis rule table
(Fo_ = new RegExp(
  String.raw`\bgh\s+(pr\s+create|pr\s+merge|pr\s+comment|issue\s+create|issue\s+comment|release\s+create|release\s+upload|repo\s+fork)\b${No_}`,
  "g",
)),
…
((Xo_ = new Set(["--org", "--fork-name", "--remote-name"])), (Jo_ = /^[A-Za-z0-9._-]+$/));
```

`--org`, `--fork-name` and `--remote-name` are the three value-taking flags of **`gh repo fork`**, and the
set exists so the shell-command analyser knows which tokens consume the next argument. Both
`--fork-name` (1/0) and `--remote-name` (1/0) are new **only because the `gh repo fork` rule is new** —
`repo\s+fork` in that regex is itself 220=1 / 193=0. Nothing named `--fork-name` is accepted by the
Claude Code CLI: the flag it *does* use for this feature is `--fork-session`, which is **12/12 carryover**
(`:547934`, `:553384`, `:683739`, `:851183`, …).

**Consequence for the ledger:** `.212 #39` must be anchored on `:683674-683676`, not on a flag.

### `currently running as a background agent` — 3/3 carryover

`:849864`:

> `Error: Session <id> is currently running as a background agent (<kind>). Use \`claude agents\` to find and attach to it, or add --fork-session to branch off a copy.`

Identical count in both builds. `.202 #9`'s bullet ("Opening a chat from `claude agents` failing …") is
about *when* this error fires, not about the message. I did not locate the changed predicate.

### `Forking…` — 2/1

The spinner text `Forking…` is 220=2 / 193=1. The new occurrence is the `/fork` progress indicator at
`:695523`; the carryover one belongs to the subagent-fork path that is now `/subtask`.

---

## 9. Not covered

- **`Task(subagent_type: "fork")`** — the in-conversation fork subagent that `/subtask` drives. Its prompt
  surface is at `:397970` and `:397994-397997` ("A fork runs in the background and keeps its tool output
  out of your context. If you are the fork, execute directly — don't re-delegate.") and `:397839`
  ("**Don't peek.** …"). `04_tools` / `53_subagent_limits` own the tool; I only note that the *prompt* for
  it is where the old `/fork` semantics now live.
- **`Lpn`** (`:500337`), the `/subtask` spawner, is not analysed — it is the 2.1.193 `/fork` spawner and
  therefore carryover by construction, but I did not diff it.
- **`Mle`** (`:682403`), the daemon dispatch that `gGt` calls, and the `left_arrow` "queue for later"
  recovery at `:683789-683825` belong to part 1's
  [`daemon_lifecycle.md`](daemon_lifecycle.md) / [`session_store_and_worktrees.md`](session_store_and_worktrees.md).
- **`Kbi()`** (`:2807`), the source of the fork's inherited `appendSystemPrompt` / `agent` / `agents`
  options, was not read.
- I did not verify whether `forkSourceAlive` participates in **compaction** or in the `/resume` picker,
  only in the task-registry rebuild of §5.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_background_agents_view.md](../00_overview/symbol_additions_v2_1_220_background_agents_view.md).

Key functions in this document:
- `spawnBackgroundSessionFromConversation` (`gGt`, `:683672`) - one spawner, nine `keepParent` branch points
- `forkCommandCall` (`KYb`, `:695530`) - the five-guard refusal ladder
- `ForkProgressComponent` (`v_f`, `:695448`) - runs the spawn once and prints the confirmation
- `buildSpawnSeedFromMessages` (`HJe`, `:683968`) - backwards scan for intent / name / colour / detail
- `subtaskCommandCall` (`NL_`, `:500547`) - byte-equivalent to 2.1.193's `/fork` handler
- `packResumeSourceAlive` (`gnd`, `:319489`) - `sessionId|boundaryAt|parentSessionId`
- `parseResumeSourceAlive` (`hrn`, `:319492`) - tolerates the legacy single-field form
- `resolveForkLineageFromEnv` (`Pvo`, `:319498`) - validates, then returns the four roster fields
- `rebuildTaskRegistryPostFork` (`RMr`, `:809097`) - parent early-return + `> boundaryAt` filter
- `formatSessionConfirmationLine` (`uVo`, `:643641`) - `state · name · id · chips`
- `shortenSessionConfirmationLine` (`Lpa`, `:643622`) - downgrade state, drop id, floor the name at 20
- `FORK_GLYPH` (`NO`, `:58422`) - `U+2442` OCR FORK
- `NEEDS_FIRST_PROMPT` (`FH`, `:331045`) - `send a prompt to start`
- `FORK_COORDINATOR_REFUSAL` (`kJo`, `:684209`) - use `/branch` instead
- `ENTER_WORKTREE_TOOL_NAME` (`xpe`, `:230895`) - named in the fork's appended system prompt
