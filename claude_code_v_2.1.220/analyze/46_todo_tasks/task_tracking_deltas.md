# Task-tracking layer: what actually changed between 2.1.193 and 2.1.220

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

Current-state description of the todo/task system lives in the 2.1.193 tree
([`../../../claude_code_v_2.1.193/analyze/46_todo_tasks/README.md`](../../../claude_code_v_2.1.193/analyze/46_todo_tasks/README.md)).
This document records **only what moved**, and says plainly which parts did not.

The short answer, and it is not what the changelog suggests: **the entire V1/V2 task machine is
carryover** — the mutual-exclusion gate, the file-backed store, all five tools, the reminder cadence, the
hooks — and the three real deltas are all *around* it, none of them documented:

1. a new **model-targeted remote kill switch** (`tengu_vellum_ash`) that can delete the whole task-tracking
   surface from the model's tool list for a named model family;
2. the V2 task list is now **copied into the forked session** when you press `←` to background a
   conversation — which is the real anchor for `.210`'s "dropping the task tracker" bullet;
3. the agent-name registry moved from **per-eviction pruning to boundary reconciliation**.

---

## 1. `tengu_vellum_ash` — a remote, model-targeted kill switch for the whole task surface

**Verdict: NET_NEW.** `tengu_vellum_ash` is **220=1 (`:403924`) / 193=0**. It is in the 326-new-gate list
in [`../00_overview/_raw_asset_diff_193_to_220.md`](../00_overview/_raw_asset_diff_193_to_220.md).
There is **no changelog bullet for it in the whole 579-bullet window**.

```javascript
// ============================================
// isTaskTrackingSuppressedForModel - remote substring kill switch for todo + task tools
// Location: cli_inner_pretty.js:403922-403931
// ============================================

// ORIGINAL (for source lookup):
function _te() {
  try {
    let e = Ke("tengu_vellum_ash", []);
    if (!Array.isArray(e) || e.length === 0) return !1;
    let t = Oi();
    return e.some((r) => r.length > 0 && t.includes(r));
  } catch {
    return !1;
  }
}

// READABLE (for understanding):
function isTaskTrackingSuppressedForModel() {
  try {
    let suppressedModelSubstrings = getFeatureValue("tengu_vellum_ash", []);   // default [] = feature off
    if (!Array.isArray(suppressedModelSubstrings) || suppressedModelSubstrings.length === 0) return false;
    let resolvedModelId = getCurrentModel();
    return suppressedModelSubstrings.some(
      (needle) => needle.length > 0 && resolvedModelId.includes(needle));      // substring, not equality
  } catch {
    return false;                                                             // fail-open on any throw
  }
}

// Mapping: _te→isTaskTrackingSuppressedForModel, Ke→getFeatureValue (:156667),
//          Oi→getCurrentModel (:110491)
```

### What it switches off

Eight call sites, and the layering is deliberate:

| Layer | Site | Effect when `_te()` is true |
|---|---|---|
| `TodoWrite.isEnabled` | `:404165` — `return !QL() && !_te();` | V1 checklist tool disappears from the model's tool list |
| `TaskCreate.isEnabled` | `:406988` — `return QL() && !_te();` | V2 create tool disappears |
| `TaskGet.isEnabled` | `:407099` | disappears |
| `TaskUpdate.isEnabled` | `:407286` | disappears |
| `TaskList.isEnabled` | `:407509` | disappears |
| reminder **builder** dispatch | `:516619` — `A ??= _te() ? Promise.resolve([]) : QL() ? ZN_(o, t) : JN_(o, t)` | no todo/task reminder attachment is ever *built* |
| `todo_reminder` **renderer** | `:532722` — `if (_te()) return [];` | any already-queued V1 reminder renders as nothing |
| `task_reminder` **renderer** | `:532736` — `if (!QL() \|\| _te()) return [];` | ditto for V2 |

In 2.1.193 the equivalent gates read `return ZH();` / `return !ZH();` (`:437812`, `:437915`, `:438097`,
`:438314`, `:308823 (193)`) with no second conjunct at all. The `&& !_te()` is the entire delta at those
five sites.

### Why a substring match on the model id

**What it does:** decides, per session, whether Claude sees any task-tracking tool at all, keyed on the
model currently in use and controlled from the server.

**How it works:**
1. `Ke(gate, default)` (`:156667`) is the feature-gate value reader. The default is `[]`, so an install that
   never reaches the gate service, or an org that has never had the flag set, behaves exactly like 2.1.193.
2. `Oi()` (`:110491-110494`, body `let e = mj(); if (e !== void 0 && e !== null) return vi(e); return KA();`)
   returns the **resolved** model id — the same accessor used by the Opus 4.7 fast-mode sunset probe
   documented in [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §6.2b.
3. The comparison is `resolvedModelId.includes(needle)`, so a single value `"opus-5"` covers
   `claude-opus-5`, `us.anthropic.claude-opus-5`, `claude-opus-5-1m`, and every provider-prefixed spelling
   at once.
4. Any throw — a malformed payload, a gate service error — is swallowed and returns `false`.

**Why this approach:**
- **Substring over equality is the only maintainable choice** given `_GROUND_TRUTH` §1: the same logical
  model appears in the catalogue under eight `provider_ids` spellings (`first_party`, `bedrock`, `vertex`,
  `foundry`, `anthropic_aws`, `anthropic_google_cloud`, `mantle`, `gateway`) plus `supports_1m_suffix`
  variants. An equality list would need every spelling enumerated and would silently miss a new provider.
  The cost is over-matching: `"opus-4"` would catch 4.0/4.1/4.5/4.6/4.7/4.8, and there is no anchoring, so
  the operator must choose needles carefully.
- **Fail-open (`return !1` on throw, `[]` default)** is the right polarity for a *capability removal*
  switch. A fail-closed version would hide the task tools from every user the moment the gate service
  hiccups. The asymmetry is worth naming: for a *security* gate you fail closed, for a *product
  experiment* you fail open, and this is the second kind.
- **Placing the switch on `isEnabled` rather than on the registry.** `:424964` still reads
  `...(QL() ? [i0d, c0d, f0d, _0d] : [])` — the four V2 tool objects are still constructed and still in the
  built-in array. Only `isEnabled()` returns false. That keeps the tool objects reachable for **name
  resolution** (aliases, `ToolSearch`, tool-result rendering of historic calls) while removing them from
  the model-visible list. Gating the registry instead would break rendering of a resumed transcript that
  already contains `TaskCreate` calls.
- **Three separate layers** (tool availability, reminder construction, reminder rendering) rather than one.
  Each covers a different lifetime: a tool list is rebuilt per turn, a reminder attachment can be built in
  one turn and rendered in another, and a *resumed* transcript can contain reminder attachments built by a
  previous process under a different gate value. Only guarding `isEnabled` would leave a resumed session
  telling the model to use a tool it no longer has.

**Key insight:** this is a **per-model product experiment**, not a bug fix — the natural reading is that
some model is being evaluated with the task-tracking scaffolding removed, on the hypothesis that a
sufficiently capable model plans better without a tool that forces it to serialise its plan. Note what the
gate can and cannot do: it removes the tools and the nudges, but it does **not** touch `:437007`
(`let r = QL() ? a4 : Oj` — the tool name interpolated into an unrelated prompt) or `:517810`/`:578788`.
So under `_te()` the model can still be *told about* a tool it does not have. That is a live inconsistency
worth flagging.

---

## 2. `.210` #19 — the task list now follows a session into its background fork

> *"Fixed pressing ← to open the agents view dropping the task tracker when returning to the session"*

**Verdict: NET_NEW, and this is the anchor the scoping pass did not find.**
`00_overview/_scope_v206_210.md` row `.210` #19 recorded this as `DELTA` anchored on
`tengu_left_arrow_editing_guard` (`:559928`) — that gate is the *keypress* half, already owned by
[`../48_accessibility_ui/vim_and_input.md`](../48_accessibility_ui/vim_and_input.md) §5 and
[`../36_background_agents/agent_view_and_status.md`](../36_background_agents/agent_view_and_status.md) §9.
The **"dropping the task tracker"** half is a different mechanism entirely, and it is in this module.

New literals, all `220 / 193`: `[tasks] carry to fork` **3 / 0**, `task-list carry` **1 / 0**,
`stopped at the cap` **1 / 0**.

### Why the tracker was dropped in the first place

The V2 task list is a **directory keyed by list id**: `v9(listId)` = `<configDir>/tasks/<sanitized-id>`
(`:324856-324858`), and `b6()` (`:324847-324852`) resolves the list id as
`CLAUDE_CODE_TASK_LIST_ID` → teammate team name → current/leader team name → **session id**. That
resolution order is byte-equivalent carryover from `vF()` (`:308341-308346 (193)`).

Pressing `←` to background the conversation does **not** keep the session id. `gpm` (`:808802`) mints a
fresh `d = randomUUID()` and hands it to the new job as `providedSessionId` (`:808899`). So for a solo
session — no team, no env override — the fork's `b6()` returns a *different* id, points at a *different*
directory, and the tracker is empty. Nothing was deleted; the fork was simply looking somewhere else.

### The fix

```javascript
// ============================================
// carryTaskListToFork - copies the session-keyed V2 task directory into a forked session
// Location: cli_inner_pretty.js:808777-808801
// ============================================

// ORIGINAL (for source lookup):
async function M7S(e, t) {
  let r = kt();
  if (Z.CLAUDE_CODE_TASK_LIST_ID || b6() !== r) return;
  let n = qi(),
    o = v9(r),
    i = v9(e),
    s = await n.listEntries(o).catch((a) => {
      if (!qt(a)) w(`[tasks] carry to fork failed: ${a}`, { level: "warn" });
      return null;
    });
  if (s === null) return;
  await inn(e);
  for (let a of s) {
    if (t?.aborted) {
      w("[tasks] carry to fork stopped at the cap", { level: "warn" });
      return;
    }
    if (!a.isFile) continue;
    try {
      await n.copy(bfi.join(o, a.name), bfi.join(i, a.name));
    } catch (l) {
      w(`[tasks] carry to fork skipped ${a.name}: ${l}`, { level: "warn" });
    }
  }
}

// READABLE (for understanding):
async function carryTaskListToFork(forkSessionId, abortSignal) {
  let currentSessionId = getSessionId();
  if (env.CLAUDE_CODE_TASK_LIST_ID          // explicit list id: shared on purpose, do not clone
      || getTaskListId() !== currentSessionId)  // team-scoped list: shared on purpose, do not clone
    return;
  let fs = getFileSystem(),
    sourceDir = getTaskListDir(currentSessionId),
    targetDir = getTaskListDir(forkSessionId),
    entries = await fs.listEntries(sourceDir).catch((err) => {
      if (!isEnoent(err)) log(`[tasks] carry to fork failed: ${err}`, { level: "warn" });
      return null;                          // no task dir at all is the common case, and is silent
    });
  if (entries === null) return;
  await ensureTaskListDir(forkSessionId);
  for (let entry of entries) {
    if (abortSignal?.aborted) {             // the 2 s budget expired mid-copy
      log("[tasks] carry to fork stopped at the cap", { level: "warn" });
      return;                               // partial copy is kept, not rolled back
    }
    if (!entry.isFile) continue;            // skips .lock (and any subdirectory)
    try {
      await fs.copy(join(sourceDir, entry.name), join(targetDir, entry.name));
    } catch (err) {
      log(`[tasks] carry to fork skipped ${entry.name}: ${err}`, { level: "warn" });
    }
  }
}

// Mapping: M7S→carryTaskListToFork, kt→getSessionId (:2669), b6→getTaskListId (:324847),
//          v9→getTaskListDir (:324856), inn→ensureTaskListDir (:324862), qi→getFileSystem,
//          qt→isEnoent, w→log
```

Wired into the `←`-to-background handler at `:808894-808896`:

```javascript
  let L = 2000,
    P = new AbortController();
  await Oa(M7S(d, P.signal), L, "task-list carry").catch(() => P.abort());
```

`Oa(promise, ms, label)` (`:20483-20491`) is `withTimeout` — it races the copy against a timer that
rejects with `label`. Note the pairing: the `.catch` does not just swallow the timeout, it **aborts the
signal**, so the copy loop stops on its next iteration instead of continuing to write into a directory
nobody is waiting for.

### Design decisions worth reading closely

**1. Why refuse to copy when the list id is not the session id.** The two early returns are the whole
correctness argument. If `CLAUDE_CODE_TASK_LIST_ID` is set, or the list is team-derived, then the list is
**deliberately shared** across processes — that is the entire point of the file-backed design (per-task JSON
+ `.lock` + `.highwatermark`, `:324875-324990`). Cloning a shared list into a private directory would fork
the id space: both copies would allocate id `N+1` for different tasks and every teammate reference in a
transcript would become ambiguous. Copying is only safe when the list is *private to this session by
construction*, which is exactly the `b6() === kt()` case.

**2. Why copy rather than re-point.** The alternative — make the fork inherit the parent's list id — was
available and cheaper. It was not taken, and the reason is symmetric to (1): after the `←` the parent
session and the background job both continue to exist and both write. Sharing one directory would give two
independent processes a shared mutable list neither user asked for. Copy-on-fork gives snapshot semantics:
the fork starts with what you could see, and diverges.

**3. Why 2,000 ms and why a partial copy is acceptable.** `←` is an interactive gesture; the user is
watching a handoff. 2 s is the same budget as the sibling `bridge flush` at `:808887` (`2000`, or `5000`
when `replyOnResume`). A per-file copy loop over a task list — normally a handful of small JSON files — is
far inside that. The failure mode chosen is *partial copy, keep what landed*: a truncated task list is a
recoverable annoyance, a 20-second freeze on `←` is not. Contrast the ordering with `.catch(() => P.abort())`
— the deadline is enforced by aborting the producer, not merely by abandoning the promise, so a pathological
task directory cannot keep writing in the background.

**4. `if (!a.isFile) continue;` is load-bearing.** The task directory contains a `.lock` file and a
`.highwatermark` file alongside the per-task JSON. `.highwatermark` *is* a file and so is copied — correct,
because the fork must not reuse ids the parent already handed out. A directory entry is skipped. Copying a
live `.lock` is harmless because `.lock` is a file too and lock ownership is re-established per operation.

**Key insight:** the bug was never in the task store. It was that one identifier — the session id — is
simultaneously the fork boundary and the task-list key, and `←` changes it. The fix does not decouple them;
it copies the data across the seam, and guards the copy with the one predicate that distinguishes a
private list from a shared one.

---

## 3. The agent-name registry moved from per-eviction pruning to boundary reconciliation

**Verdict: NET_NEW structural change, undocumented.** `RDo(` is 220-only (`:448602`, called at `:449503`
and `:821895`); 193's `dCo` (`:446683 (193)`) had three call sites, **all** of them inside task-eviction
reducers (`:446715`, `:446816`, `:446873 (193)`), and none survive.

`agentNameRegistry` is the `Map<agentName, taskId>` that lets one agent refer to another by name. In 2.1.193
every path that removed a task from `state.tasks` also removed its name binding in the same reducer:

```javascript
// 2.1.193 — three sites, all of this shape
return { ...r, tasks: s, transcripts: n in i ? l : i, agentNameRegistry: dCo(r.agentNameRegistry, n) };   // :446715 (193)
```

2.1.220's equivalents (`:341861`, `:341917`) **do not mention `agentNameRegistry` at all**:

```javascript
      let { [e]: i, ...s } = n.tasks,
        a = n.transcripts ?? {},
        { [e]: l, ...c } = a;
      return { ...n, tasks: s, transcripts: e in a ? c : a };          // :341858-341861
```

(The `Bas(c)` call at `:341912` is *not* the replacement — `Bas` (`:216501`) deletes from `Fas`, a
notified-once dedup `Set`, not from the registry.)

Instead the registry is reconciled wholesale at session boundaries:

```javascript
// ============================================
// pruneAgentNameRegistry - drops name bindings whose task is gone or fully terminal
// Location: cli_inner_pretty.js:448602-448616
// ============================================

// ORIGINAL (for source lookup):
function RDo(e, t) {
  return new Map(
    [...e].filter(([, r]) => {
      let n = E$d(t, r);
      if (n === void 0) return !1;
      if (!CE(n.status)) return !0;
      return (
        Gfe(n) &&
        "keepaliveReasons" in n &&
        n.keepaliveReasons !== void 0 &&
        [...n.keepaliveReasons].some((o) => o !== L2e)
      );
    }),
  );
}

// READABLE (for understanding):
function pruneAgentNameRegistry(registry, tasks) {
  return new Map(
    [...registry].filter(([, taskId]) => {
      let task = lookupTaskByIdOrResumableId(tasks, taskId);
      if (task === undefined) return false;              // task gone -> binding gone
      if (!isTerminalStatus(task.status)) return true;   // still running -> keep
      return (                                           // terminal, but kept alive for a real reason
        isCompletedWithKeepalive(task) &&
        "keepaliveReasons" in task &&
        task.keepaliveReasons !== undefined &&
        [...task.keepaliveReasons].some((reason) => reason !== IDLE_WINDOW_KEEPALIVE)
      );
    }),
  );
}

// Mapping: RDo→pruneAgentNameRegistry, E$d→lookupTaskByIdOrResumableId (:448598),
//          CE→isTerminalStatus (:165103, "completed"|"failed"|"killed"), Gfe→isCompletedWithKeepalive
//          (:399368), L2e→IDLE_WINDOW_KEEPALIVE ("flag:idle-window", :399378)
```

**Why the move:**
- **It removes a `Map` clone from a hot path.** The 2.1.193 shape called `dCo` inside the *task-eviction
  reducer*, which runs from the periodic sweeper (`:341895-341919`, `:747940-747970`) on every tick that
  has anything to evict. `dCo` copies the whole registry whenever it finds a match, and — because it is
  inside the `setAppState` updater — it also produces a new `agentNameRegistry` identity, which invalidates
  every `useSyncExternalStore` selector subscribed to it (e.g. `:747883` `u = Ve((te) => te.agentNameRegistry)`).
  Reconciling only at `/clear` (`:449503`) and at resume/fork (`:821895`) means an ordinary task eviction no
  longer touches that reference at all. This is a plausible — but **inferred, not proven** — contributor to
  `.208`'s *"task updates no longer re-render the entire UI"*; see §5 for why I am not claiming it as the
  anchor.
- **It makes stale bindings survivable rather than impossible.** The consumers were rewritten to filter at
  read time: `TAd` (`:399780-399789`) does `let s = t.get(i); if (s?.type === "local_agent") return s;` and
  returns `undefined` for a dangling id; `sVy` (`:399814-399823`) and `oVy` (`:399754-399768`) additionally
  require `status === "running" || Gfe(...)`. A stale entry is therefore inert everywhere it is read.
- **`L2e` (`"flag:idle-window"`) is the interesting exclusion.** A completed teammate whose *only* keepalive
  reason is the idle window is one that nothing actually holds — the 30 s grace timer (`Yse = 30000`,
  `:341922`) is keeping it listed, not a real reference. Excluding it means `/clear` drops the name binding
  for merely-lingering agents while keeping it for agents something still depends on. Any other keepalive
  reason (`agent:` prefixed reasons are counted at `:346158-346159`) keeps the name resolvable.
- `E$d` (`:448598`) also looks the task up by `identity.resumableAgentId`, not just by key — so a task that
  was re-keyed on resume keeps its name.

**Key insight:** the invariant changed from *"the registry never contains a dangling id"* (maintained by
every writer) to *"readers tolerate dangling ids, and a boundary event compacts them"*. That is the standard
trade — cheap writes, slightly more careful reads — and it is the right one here because evictions are
frequent and periodic while `/clear` and resume are rare and already expensive.

---

## 4. What did NOT change (proved, not assumed)

Everything below is the substance of the 2.1.193 module document, and every item was re-checked in both
bundles. **None of it is a delta.**

| Component | Evidence | Verdict |
|---|---|---|
| V1/V2 mutual-exclusion gate | `isTodoV2Enabled` `QL()` `:324814-324817` vs `ZH()` `:308308-308312 (193)` — same shape, same polarity, 13 call sites in each | carryover (see §4.1 for the one cosmetic change) |
| Task-list identity resolution | `b6()` `:324847-324852` vs `vF()` `:308341-308346 (193)` — byte-equivalent modulo `process.env.X` → `Z.X` | carryover |
| Directory layout + sanitiser | `v9` `:324856-324858`, `odr` `:324853-324855`, `idr` `:324859-324861`; `.highwatermark` **220=1 / 193=1** | carryover |
| File-backed store | the five `[Tasks]` log lines are **220=5 / 193=5** and pairwise identical: `:324908`↔`:308402 (193)`, `:324912`↔`:308406`, `:325004`↔`:308501`, `:325027`↔`:308524`, `:325038`↔`:308535` | carryover |
| Dependency edges | `blockedBy` **220=59 / 193=59** | carryover |
| `TaskCreate` input-shape repair | `drop_invalid_activeForm` / `drop_invalid_metadata` at `:406854-406855` vs `:437682-437683 (193)`; alias tables `title`/`name`/`content`/`active_form` at `:406872-406875` | carryover |
| Reminder cadence | `TODO_REMINDER_CONFIG = { TURNS_SINCE_WRITE: 10, TURNS_BETWEEN_REMINDERS: 10 }` — `:518133` vs `:474653 (193)`, identical | carryover |
| Reminder builder | `ZN_` `:517809-517821` vs `Fuf` `:474344-474356 (193)` — statement-for-statement identical | carryover |
| Reminder mode kill switch | `CLAUDE_CODE_TODO_REMINDER_MODE` **220=2 / 193=2**; gate `tengu_soft_slate_nudge` **220=1 / 193=1**; `H8s()` `:516577-516581` vs `Dko()` `:473202-473206 (193)` | carryover — see §5 |
| `TaskCreated` / `TaskCompleted` hooks | **220=14 / 193=14** and **220=19 / 193=19** | carryover |
| `/tasks` slash command | `name: "tasks"`, `aliases: ["bashes"]`, `description: "View and manage everything running in the background"` — `:497733-497736`, **220=1 / 193=1** | carryover |
| Task eviction timings | `Hpr = 3000, Yse = 30000, fdd = 30000` `:341921-341923` vs `omt = 3000, Rde = 30000, hfl = 30000` `:446878-446880 (193)` | carryover |
| Selector subscription hook | `Ve` `:556846-556853` vs `bt` `:178087-178094 (193)` — identical `useSyncExternalStore` wrapper | carryover |

### 4.1 The one cosmetic change to the gate

```javascript
// 2.1.193 :308308-308312            2.1.220 :324814-324817
function ZH() {                      function QL() {
  if (ul(process.env.CLAUDE_CODE_ENABLE_TASKS)) return !1;   |   if (Z.CLAUDE_CODE_ENABLE_TASKS === !1) return !1;
  return !0;                         |   return !0;
}                                    | }
```

193 parsed the raw string through `ul` (the `"0"|"false"|"no"|"off"` recogniser). 220 reads through the
managed env proxy `Z` (`:30900-33000`, see [`../00_overview/file_index.md`](../00_overview/file_index.md) §6)
and compares against the **boolean** `false`, because the proxy accessor has already coerced it —
`CLAUDE_CODE_ENABLE_TASKS: () => Cth` at `:31054`. Same semantics, one fewer parser. The env var is also
now listed in an env allow-list at `:58140`. This is the bundle-wide `process.env` → `Z` migration, not a
task-system change.

---

## 5. False deltas caught in this theme

Four traps, all of which a count-only method gets wrong. Two of them are large.

### 5.1 `activeForm` 220=56 / 193=27 — a **2× count that is 100 % carryover**

This is the most dangerous number in the theme: `activeForm` is the V1 todo field, the count doubled, and the
obvious conclusion ("the todo schema grew") is wrong.

| grep | 220 | 193 |
|---|---|---|
| `activeForm` | **56** | 27 |
| `activeFormattingElements` | **29** | **0** |
| `activeForm\b` (word boundary) | **27** | **27** |

Exactly 29 of the 220 hits are `activeFormattingElements`, the adoption-agency-algorithm field of a
**newly vendored parse5 HTML parser** (`:369783`, `:370044-372137`). `56 − 29 = 27`. The todo field is
untouched. The `\b` is the whole difference between a false introduction and a correct carryover call.

### 5.2 `TaskOutput` 220=28 / 193=9 — a module export table, not new behaviour

The scoping pass recorded this jump as a promising lead. Reading all 28 sites: **17 of the 19 new hits are
one export table** at `:165108-165124` (`repointTaskOutputSymlinks`, `initTaskOutputAsSymlink`,
`getTaskOutputDelta`, `evictTaskOutput`, `cleanupTaskOutput`, `_resetTaskOutputDirForTest`, …) — the
task-output disk module gained an explicit `tt(...)` export map where 2.1.193 exposed the same functions
only through error strings (`:586967-587014 (193)`). Of the remaining hits, `:230912` (`var gee =
"TaskOutput"`) and `:60380-60383` (the alias map) have exact 193 twins. **No new TaskOutput behaviour is
provable from this count.**

### 5.3 `CLAUDE_CODE_TODO_REMINDER_MODE` / `tengu_soft_slate_nudge` look new; both are 2/2 and 1/1

`getTodoReminderMode` reads an env var and falls back to a remote gate — it has exactly the shape of a
2.1.220 addition, and it is not one. `H8s()` (`:516577`) and `Dko()` (`:473202 (193)`) are the same
function. It matters because §1's `tengu_vellum_ash` *is* new and sits three lines away in the same
subsystem; a reader who conflates the two would over-report. The distinguishing test is the count, run
on both bundles, on each gate name separately.

### 5.4 `CLAUDE_CODE_ENABLE_TASKS` and `CLAUDE_CODE_TASK_LIST_ID` are in the "GONE env vars" list — they are live

Both appear in the 163-entry GONE list in
[`../00_overview/_raw_asset_diff_193_to_220.md`](../00_overview/_raw_asset_diff_193_to_220.md). Both are
demonstrably present and read in 2.1.220 (`:31054`/`:324815` and `:32055`/`:324848`/`:808779`) — and
`CLAUDE_CODE_TASK_LIST_ID` actually **gained** a call site. This is the extractor defect already documented
in `file_index.md` §4.2 (124 of the 163 "gone" env vars are still live); recorded here because these two are
the load-bearing env vars of this exact theme.

### 5.5 The one bullet I could not anchor: `.208` "task updates no longer re-render the entire UI"

> *"Improved input responsiveness while agent task lists update — task updates no longer re-render the
> entire UI"*

**Verdict: UNANCHORED.** Recorded honestly rather than attached to the nearest plausible change.

What I checked in both bundles:

| Probe | 220 | 193 | Conclusion |
|---|---|---|---|
| the store selector hook (`Ve` `:556846` / `bt` `:178087 (193)`) | — | — | **byte-identical**; `useSyncExternalStore` with the same `getSnapshot`/`getServerSnapshot` pair. The subscription primitive did not change. |
| `useSyncExternalStore` | 68 | 55 | +13, but every one of the 13 is a *new component* subscribing, not a change to the subscription mechanism |
| `.memo(` | 17 | 16 | +1; the single new site is not in the task-list render path |
| `agentNameRegistry` reducer identity | see §3 | see §3 | genuinely changed, but this is one field of one reducer |

§3 is the only structural change I found in the task-update write path, and it plausibly reduces store-identity
churn — but "one `Map` clone fewer per eviction tick" is a long way from "no longer re-renders the entire
UI", and I could not find a memoisation boundary, a `key` change, or a split selector to point at. The
render-performance theme is owned by [`../48_accessibility_ui/`](../48_accessibility_ui/) and
[`../50_performance/`](../50_performance/); neither has anchored it either. It stays unanchored.

---

## 6. Bullets owned by other modules

| Bullet | Owner | Why not here |
|---|---|---|
| `.203` #15 `TaskStop`/`TaskOutput` failing to find agents spawned by another agent | [`../04_tools/web_and_misc_tools_deltas.md`](../04_tools/web_and_misc_tools_deltas.md) §4 | the fix is the two-namespace resolver `Qko` (`:399713-399747`) inside the `TaskStop` tool, with `AAd`/`wAd`/`oVy`/`dOs` message builders (all `220>0 / 193=0`). It is a *tool* change; `04_tools` documents it in full. The `dead_probe` half is in [`dead_probe_gate_family.md`](dead_probe_gate_family.md) §5 rows 22–23. |
| `.208` #38 completed bg agents stay listed in `/tasks` until cleanup | [`../36_background_agents/bg_notifications_and_reporting.md`](../36_background_agents/bg_notifications_and_reporting.md) §8 | the `evictAfter` / `keepaliveReasons` / `retain` grace machine. Constants confirmed carryover here (§4); the *policy* around them is theirs. |
| `.210` #19 keypress half (`←` gesture arming) | [`../48_accessibility_ui/vim_and_input.md`](../48_accessibility_ui/vim_and_input.md) §5, [`../36_background_agents/agent_view_and_status.md`](../36_background_agents/agent_view_and_status.md) §9 | `tengu_left_arrow_editing_guard` `:559928`. The task-tracker half is §2 above. |
| `.212` #46 agent view / `claude agents --json` "Needs input" | [`../36_background_agents/agent_view_and_status.md`](../36_background_agents/agent_view_and_status.md) | `needsInput` 6/0, but the label `blocked: "Needs input"` is carryover (`:808671` vs `:678802 (193)`) |
| `.208` #33 render performance | [`../48_accessibility_ui/`](../48_accessibility_ui/), [`../50_performance/`](../50_performance/) | see §5.5 — unanchored everywhere so far |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_todo_tasks.md](../00_overview/symbol_additions_v2_1_220_todo_tasks.md).

Key functions in this document:
- `isTaskTrackingSuppressedForModel` (`_te`, `:403922`) - `tengu_vellum_ash` substring kill switch, 8 call sites
- `isTodoV2Enabled` (`QL`, `:324814`) - V1/V2 mutual-exclusion gate, now read through the `Z` env proxy
- `getTaskListId` (`b6`, `:324847`) - env → team → session-id resolution ladder (carryover)
- `getTaskListDir` (`v9`, `:324856`) - `<configDir>/tasks/<sanitized-list-id>`
- `sanitizeTaskListPathComponent` (`odr`, `:324853`) - `[^A-Za-z0-9_-]` → `-`
- `ensureTaskListDir` (`inn`, `:324862`)
- `carryTaskListToFork` (`M7S`, `:808777`) - copies the session-keyed task dir into a `←` background fork
- `openAgentsViewViaLeftArrow` (`gpm`, `:808802`) - the `←` handler; wires the carry at `:808896`
- `withTimeout` (`Oa`, `:20483`) - `Promise.race` + labelled rejection; used with `.catch(() => abort())`
- `pruneAgentNameRegistry` (`RDo`, `:448602`) - boundary reconciler that replaced 193's per-eviction `dCo`
- `lookupTaskByIdOrResumableId` (`E$d`, `:448598`) - key lookup with `identity.resumableAgentId` fallback
- `isTerminalStatus` (`CE`, `:165103`) - `"completed" | "failed" | "killed"`
- `isCompletedWithKeepalive` (`Gfe`, `:399368`) - completed **and** holding at least one keepalive reason
- `IDLE_WINDOW_KEEPALIVE` (`L2e`, `:399378`) - `"flag:idle-window"`, the reason `RDo` refuses to count
- `markTaskNotified` (`Bas`, `:216501`) - deletes from the notified-once `Set`; **not** a registry prune
- `buildTaskReminderAttachments` (`ZN_`, `:517809`) - unchanged from `Fuf` `:474344 (193)`
- `getTodoReminderMode` (`H8s`, `:516577`) - carryover; `CLAUDE_CODE_TODO_REMINDER_MODE` + `tengu_soft_slate_nudge`
- `TODO_REMINDER_CONFIG` (`gfn`, `:518133`) - `{ TURNS_SINCE_WRITE: 10, TURNS_BETWEEN_REMINDERS: 10 }`
- `normalizeToolInput` (`atp`, `:508391`) - hosts the `TaskOutput` legacy-parameter coalescing
- `TASK_OUTPUT_TOOL_NAME` (`gee`, `:230912`) - `"TaskOutput"`
