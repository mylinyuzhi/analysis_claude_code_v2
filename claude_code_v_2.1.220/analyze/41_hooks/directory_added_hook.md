# The `DirectoryAdded` hook (2.1.219) — a whole new event, end to end

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

> `2.1.219`: *"Added `DirectoryAdded` hook that fires after `/add-dir` or the SDK `register_repo_root`
> control request registers a new working directory mid-session"*

**Verdict: NET_NEW.** `DirectoryAdded` is **220=20 / 193=0**. This is the only genuinely new *event* in
the hook system in the whole `.195`→`.220` window, which makes it the best available specimen of
**what it costs to add one hook event to Claude Code**: twenty sites, in seven distinct registries.

**One correction to the bullet up front:** `register_repo_root` is **220=15 / 193=3**. The SDK control
request is *not* new — it shipped with a single validation check in 2.1.193 (`:701207 (193)` schema,
`:706932 (193)` the lone `is not a subdirectory of cwd` throw, `:707272 (193)` dispatch). Only the *hook
firing* (and, incidentally, a three-way rewrite of its validation) is new. See
[`../51_headless_sdk/`](../51_headless_sdk/) for the control-request surface itself.

---

## 1. The registration surface: what "one new hook event" actually costs

`DirectoryAdded` had to be inserted into **seven independent tables**, five of which are hand-maintained
lists in event order. Every one was read in the 2.1.220 bundle.

| # | Registry | Line | What breaks if you forget it |
|---|---|---|---|
| 1 | `HOOK_EVENT_NAMES` — the master enum `lB` (31 entries) | `:49396` | frontmatter/settings hooks for the event are never iterated (`$To`, `Add` both loop `lB`) |
| 2 | Plugin hooks-config projection (empty-slot object) | `:271032` | plugin `hooks/hooks.json` entries for the event are dropped by `if (!t[o]) continue` (`:271039`) |
| 3 | Managed/dedup plugin projection (second empty-slot object) | `:271149` | same, on the `allowManagedHooksOnly` path |
| 4 | `HOOK_EVENT_REGISTRY` — event → dispatcher map `AF_` | `:519444` (`DirectoryAdded: a2t`) | SDK/programmatic dispatch by event name finds no executor |
| 5 | `q8s`'s match-query `switch` | `:520412` (`case "DirectoryAdded": a = n.source;`) | every hook with a `matcher` silently matches nothing |
| 6 | `xF_` — the list-form-matcher event set | `:522099` | `matcher: "slash_command, register_repo_root"` would be compiled as a **regex** instead of a comma list (see [`matching_and_exit_codes.md`](matching_and_exit_codes.md) §1) |
| 7 | `/hooks` UI catalogue (`summary` + `description` + `matcherMetadata`) | `:696697-696704` | the event is invisible in the configuration UI and has no matcher picker |

Plus the SDK wire surface: the stream-json hook-event-name enum `:835561` and the payload schema
`auE` at `:835980-835988`.

**Why so many lists rather than one?** Each list is consumed by a different module that is code-split
away from the others (`lB` lives in the settings-schema chunk, `AF_` in the hooks chunk, the UI
catalogue in the REPL chunk). A single source of truth would force those chunks to depend on each
other. The cost is paid in exactly the way you would predict: the empty-slot objects at `:271032` and
`:271149` are *byte-identical copies of the same 31 keys*, and the `if (!t[o]) continue` at `:271039`
means a missing key is a **silent** drop, not an error.

### Table 5 in detail — the match query is `source`, not the directory

```javascript
// ============================================
// getMatchingHooks - the per-event match-query switch (DirectoryAdded arm)
// Location: cli_inner_pretty.js:520360-520417
// ============================================

// ORIGINAL (for source lookup):
async function q8s(e, t, r, n, o, i) {
  try {
    let s = DF_(e, t, r, i),
      a = void 0;
    switch (n.hook_event_name) {
      ...
      case "ConfigChange":
        a = n.source;
        break;
      case "DirectoryAdded":
        a = n.source;
        break;
      case "InstructionsLoaded":
        a = n.load_reason;
        break;
      case "FileChanged":
        a = gip.basename(n.file_path);
        break;
      ...
    }
    let l = xF_.has(n.hook_event_name);
    ...
}

// READABLE (for understanding):
async function getMatchingHooks(appState, agentId, eventName, hookInput, tools, opts) {
  let candidates = collectHooksForEvent(appState, agentId, eventName, opts),
    matchQuery = undefined;
  switch (hookInput.hook_event_name) {
    ...
    case "DirectoryAdded":
      matchQuery = hookInput.source;      // "slash_command" | "register_repo_root"
      break;
    case "FileChanged":
      matchQuery = path.basename(hookInput.file_path);
      break;
    ...
  }
  let allowsListForm = LIST_FORM_MATCHER_EVENTS.has(hookInput.hook_event_name);
  ...
}

// Mapping: q8s→getMatchingHooks, DF_→collectHooksForEvent, xF_→LIST_FORM_MATCHER_EVENTS,
//          n→hookInput, a→matchQuery, l→allowsListForm
```

**Why `source` and not `directory`?** `FileChanged` (`:520415`) is the counter-example that proves the
design rule: it matches on `basename(file_path)` because "watch `.envrc`" is the natural user intent.
For `DirectoryAdded` the natural intent is *provenance* — "run my reindexer only when a human typed
`/add-dir`, not when an SDK harness registered a repo root". Matching on the path would have been
useless anyway, because the path is by construction one the user has never seen before; you cannot
write a matcher for it in advance. The shipped `matcherMetadata` at `:696703` makes this contract
explicit and drives the UI's matcher picker:

```javascript
matcherMetadata: { fieldToMatch: "source", values: ["slash_command", "register_repo_root"] }
```

---

## 2. The dispatcher `executeDirectoryAddedHooks`

```javascript
// ============================================
// executeDirectoryAddedHooks - builds the payload and returns results + systemMessages
// Location: cli_inner_pretty.js:518817-518823
// ============================================

// ORIGINAL (for source lookup):
async function a2t(e, t, r = Hm) {
  let n = { ...Kf(void 0), hook_event_name: "DirectoryAdded", directory: e, source: t },
    o = await EM({ hookInput: n, matchQuery: t, timeoutMs: r }),
    i = o.map((s) => s.systemMessage).filter((s) => !!s);
  return { results: o, systemMessages: i };
}

// READABLE (for understanding):
async function executeDirectoryAddedHooks(directory, source, timeoutMs = DEFAULT_HOOK_TIMEOUT_MS /* 600000 */) {
  let hookInput = {
      ...createBaseHookInput(/* permissionMode */ undefined),   // session_id, transcript_path, cwd, prompt_id, …
      hook_event_name: "DirectoryAdded",
      directory,                                                 // absolute path
      source,                                                    // "slash_command" | "register_repo_root"
    },
    results = await executeHooksOutsideREPL({ hookInput, matchQuery: source, timeoutMs }),
    systemMessages = results.map((r) => r.systemMessage).filter(Boolean);
  return { results, systemMessages };
}

// Mapping: a2t→executeDirectoryAddedHooks, Kf→createBaseHookInput, EM→executeHooksOutsideREPL,
//          Hm→DEFAULT_HOOK_TIMEOUT_MS (600000, :317052), e→directory, t→source
```

Three design choices worth naming:

1. **`EM` (`executeHooksOutsideREPL`, `:521555`), not `lM` (`executeHooks`, `:520573`).** `lM` is an
   async *generator* that streams progress messages into the REPL transcript as each hook runs. `EM`
   awaits the whole set and returns an array. `DirectoryAdded` uses the batch form because both call
   sites dispatch it **outside** a turn, where there is no message stream to interleave with. The same
   choice is made by `ConfigChange` (`:518808`), `CwdChanged` (`:518896`), `FileChanged` (`:518900`) —
   the whole "ambient session event" family.
2. **`Kf(void 0)`** — the permission mode is passed as `undefined`, and no `toolUseContext` is supplied,
   so the payload carries no `agent_id`, no `agent_type` beyond the process default, and no `effort`
   (`Kf`, `:519620-519637`). The event is a *session-level* fact, not an agent-level one.
3. **The return shape splits `results` from `systemMessages`.** `systemMessage` is the one hook-output
   field designed to reach the user/model as prose; separating it lets each call site decide whether to
   surface it, and the two call sites decide **differently** (§5).

`EM` itself is where the trust gate fires — `if (GYe()) return (w("Skipping ... hook execution -
workspace trust not accepted"), [])` at `:521559`. See
[`hook_trust_and_origin.md`](hook_trust_and_origin.md) §1.

---

## 3. Call site A — `/add-dir`

`/add-dir` is a `local-jsx` slash command (`:226501`). Its `call` implementation is `Axb`
(`:655118-655190`); the hook dispatch is at `:655138-655167`.

```javascript
// ============================================
// addDirectoryCommand.onAddDirectory - the /add-dir accept path with its three hook failure routes
// Location: cli_inner_pretty.js:655121-655168
// ============================================

// ORIGINAL (for source lookup):
    i = async (a, l = !1) => {
      let u = { type: "addDirectories", directories: [a], destination: l ? "localSettings" : "session" };
      t.setToolPermissionContext((g) => YS(g, u));
      let d = eB();
      if (!d.includes(a)) (pOe([...d, a]), BB(), yse(), Sse(), k7.emit());
      (Oo.refreshConfig(), CVs(a), Pad("--add-dir", a));
      let p;
      ...
      e(f);
      let m = QYp.randomUUID();
      a2t(a, "slash_command")
        .then(async ({ results: g, systemMessages: y }) => {
          for (let A of g)
            if (!A.succeeded && A.output) w(`DirectoryAdded hook failed: ${A.output}`, { level: "error" });
          let _ = pr(g, (A) => !A.succeeded),
            E = [
              ...(await Promise.all(
                y.map((A, b) => jYe(A, `add-dir-${m}-${b}`, "systemMessage").then((T) => `DirectoryAdded hook: ${T}`)),
              )),
              ...(_ > 0
                ? [`${_} DirectoryAdded ${Et(_, "hook")} failed; output is in the debug log, not shown here`]
                : []),
            ];
          if (E.length > 0)
            dp({ value: E.join(`\n`), mode: "task-notification", agentId: Si(), isMeta: !0 });
        })
        .catch((g) => {
          dp({
            value: `DirectoryAdded hook execution failed: ${g instanceof Error ? g.message : String(g)}`,
            mode: "task-notification",
            agentId: Si(),
            isMeta: !0,
          });
        });
    };

// READABLE (for understanding):
    onAddDirectory = async (absPath, persistToLocalSettings = false) => {
      // 1. permission context, config file, skills/plugins reload, SANDBOX REFRESH — all before the hook
      applyPermissionUpdate({ type: "addDirectories", directories: [absPath],
                              destination: persistToLocalSettings ? "localSettings" : "session" });
      if (!additionalDirs().includes(absPath)) { persistAdditionalDirs([...additionalDirs(), absPath]);
                                                 reloadSkills(); /* … */ }
      sandboxConfig.refreshConfig(); registerWatchRoot(absPath); recordFlagUsage("--add-dir", absPath);
      printResult(successLine);                                   // <- user is told "added" BEFORE hooks run

      let dispatchId = crypto.randomUUID();
      executeDirectoryAddedHooks(absPath, "slash_command")        // <- NOT awaited: fire-and-forget
        .then(async ({ results, systemMessages }) => {
          // FAILURE ROUTE 1: per-hook stderr -> debug log only
          for (let r of results)
            if (!r.succeeded && r.output) logForDebugging(`DirectoryAdded hook failed: ${r.output}`, { level: "error" });
          let failureCount = countWhere(results, (r) => !r.succeeded),
            lines = [
              // SUCCESS ROUTE: each systemMessage, size-capped via persistHookOutput
              ...(await Promise.all(systemMessages.map((msg, i) =>
                    persistHookOutput(msg, `add-dir-${dispatchId}-${i}`, "systemMessage")
                      .then((bounded) => `DirectoryAdded hook: ${bounded}`)))),
              // FAILURE ROUTE 2: an aggregate count reaches the model; the text does not
              ...(failureCount > 0
                ? [`${failureCount} DirectoryAdded ${plural(failureCount, "hook")} failed; output is in the debug log, not shown here`]
                : []),
            ];
          if (lines.length > 0)
            queueTaskNotification({ value: lines.join("\n"), mode: "task-notification",
                                    agentId: currentAgentId(), isMeta: true });
        })
        // FAILURE ROUTE 3: the dispatch itself threw (trust gate, spawn setup, matcher crash)
        .catch((err) => queueTaskNotification({
          value: `DirectoryAdded hook execution failed: ${err instanceof Error ? err.message : String(err)}`,
          mode: "task-notification", agentId: currentAgentId(), isMeta: true }));
    };

// Mapping: Axb→addDirectoryCommandCall, i→onAddDirectory, a2t→executeDirectoryAddedHooks,
//          jYe→persistHookOutput, dp→queueTaskNotification, pr→countWhere, Et→plural,
//          w→logForDebugging, Si→currentAgentId, Oo.refreshConfig→sandboxConfig.refreshConfig
```

### The three failure routes, and why they differ

| Route | Trigger | Where the text goes | Where the *fact* goes |
|---|---|---|---|
| 1 | one hook exited non-zero, with output | debug log, `level: "error"` | nowhere on its own |
| 2 | ≥1 hook exited non-zero | — | model, as `N DirectoryAdded hook(s) failed; output is in the debug log, not shown here` |
| 3 | `a2t` itself rejected | model, verbatim `err.message` | model |

**Why is route 1's text withheld from the model while route 3's is not?** Route 1's text is *hook
stdout/stderr* — attacker-influenceable content from a program the repository may have configured. Route
3's text is an *exception message produced by the CLI itself*. The split is a provenance boundary: the
model is told **that** N hooks failed (a fact the harness owns) and never **what** they printed (content
the harness does not own). The shipped documentation states this contract verbatim at `:696702`:

> `Other exit codes - stderr is debug-logged on both paths; for /add-dir, a failure count is summarized to
> Claude and hook systemMessage output reaches Claude as bounded context; for register_repo_root,
> everything is debug-logged only`

**"bounded context"** is `jYe` = `persistHookOutput` (`:519669-519695`): if the string exceeds
`TCu = 1e4` characters (`:215345`) it is written to a side file and replaced by a reference, emitting
`tengu_hook_output_persisted` with `originalSizeBytes`/`persistedSizeBytes`; if the disk write fails it
falls back to a hard truncation with an inline `[Hook systemMessage truncated at 10000 chars …]` marker.
So a `DirectoryAdded` hook cannot flood the context window through `systemMessage`.

### The dispatch is deliberately not awaited

`e(f)` (the "Added `<dir>` as a working directory" line) is printed at `:655136`, *before* the hook
promise is even created at `:655138`. The `.then` body posts a **separate** `task-notification` message
later.

**Why fire-and-forget?** The default hook timeout is `Hm = 600000` ms — **ten minutes** (`:317052`).
`/add-dir` is an interactive command whose whole point is to be instantaneous. Awaiting a hook set that
may legitimately take ten minutes (a reindex, a `git fetch`) would freeze the REPL on a command the user
experiences as a config toggle. The trade-off is that **hook output arrives out of band**, as an
`isMeta` task notification attributed to the current agent, possibly several turns after the command —
which is exactly what `mode: "task-notification"` is for.

The corollary, and it is a real one: **a `DirectoryAdded` hook cannot veto the directory.** The
registration has already been applied to the permission context, persisted, and pushed through
`Oo.refreshConfig()` before the hook is even spawned. There is no `permissionDecision`, no
`continue: false` handling, no blocking-error consumption at either call site. Contrast `PreToolUse`,
where the whole point of the event is that it can deny.

---

## 4. Call site B — the SDK `register_repo_root` control request

`:847210-847285`. The control request pre-existed; `.219` gave it the hook plus a three-way validation
rewrite.

```javascript
// ============================================
// handleRegisterRepoRoot - the SDK control-request handler (validation + hook dispatch)
// Location: cli_inner_pretty.js:847216-847265
// ============================================

// ORIGINAL (for source lookup):
  async function ke(ur, sn) {
    try {
      let dt = await rVt.realpath(Ht()),
        oo = await rVt.realpath(sn.directory),
        po = await yxm(oo);
      if (!po.allowed)
        throw new Lr(`register_repo_root: ${sn.directory} ${po.reason}`,
                     "register_repo_root: target is not a directory");
      let fi = await gxm(a().toolPermissionContext.additionalWorkingDirectories),
        vs = hxm(oo, dt,
                 fi.filter((fs) => fs.source === "cliArg").map((fs) => fs.resolved),
                 fi.map((fs) => fs.resolved));
      if (!vs.allowed)
        throw new Lr(`register_repo_root: ${sn.directory} ${vs.reason}`,
                     "register_repo_root: directory is outside the allowed registration scope");
      if (a().toolPermissionContext.additionalWorkingDirectories.has(oo))
        throw new Lr(`register_repo_root: ${sn.directory} is already a registered working directory`,
                     "register_repo_root: directory is already a registered working directory");
      l((fs) => ({ ...fs, toolPermissionContext: YS(fs.toolPermissionContext,
                  { type: "addDirectories", directories: [oo], destination: "session" }) }));
      let As = eB();
      if (!As.includes(oo)) pOe([...As, oo]);
      Oo.refreshConfig();
      let ji = bs();
      if (
        (a2t(oo, "register_repo_root")
          .then(({ results: fs, systemMessages: Qo }) => {
            for (let Fs of Qo) w(`DirectoryAdded hook: ${Fs}`);
            for (let Fs of fs)
              if (!Fs.succeeded && Fs.output) w(`DirectoryAdded hook failed: ${Fs.output}`, { level: "error" });
          })
          .catch((fs) => { w(`DirectoryAdded hook exec failed: ${fs}`, { level: "error" }); })
          .finally(ji),
        sn.reload_claude_md)
      ) { ... }
      ...
      Pn(ur, { directory: oo });
    } catch (dt) { mr(ur, le(dt)); }
  }

// READABLE (for understanding):
  async function handleRegisterRepoRoot(request, params) {
    try {
      let sessionCwdReal = await fs.realpath(getSessionCwd()),
        targetReal = await fs.realpath(params.directory),
        isDirCheck = await assertIsDirectory(targetReal);
      if (!isDirCheck.allowed) throw new ControlError(…, "register_repo_root: target is not a directory");

      let knownRoots = await resolveWorkingDirectories(state().toolPermissionContext.additionalWorkingDirectories),
        scopeCheck = isWithinRegistrationScope(
          targetReal, sessionCwdReal,
          knownRoots.filter((r) => r.source === "cliArg").map((r) => r.resolved),   // --add-dir / SDK additionalDirectories
          knownRoots.map((r) => r.resolved));
      if (!scopeCheck.allowed) throw new ControlError(…, "…outside the allowed registration scope");

      if (state().toolPermissionContext.additionalWorkingDirectories.has(targetReal))
        throw new ControlError(…, "…is already a registered working directory");   // idempotency is a DENY

      setState((s) => ({ ...s, toolPermissionContext: applyPermissionUpdate(s.toolPermissionContext,
                        { type: "addDirectories", directories: [targetReal], destination: "session" }) }));
      if (!additionalDirs().includes(targetReal)) persistAdditionalDirs([...additionalDirs(), targetReal]);
      sandboxConfig.refreshConfig();                                  // same ordering guarantee as /add-dir

      let stopKeepAlive = startKeepAlive();                           // 30 s `keep_alive` frames, :847193
      executeDirectoryAddedHooks(targetReal, "register_repo_root")
        .then(({ results, systemMessages }) => {
          for (let msg of systemMessages) logForDebugging(`DirectoryAdded hook: ${msg}`);        // debug ONLY
          for (let r of results)
            if (!r.succeeded && r.output) logForDebugging(`DirectoryAdded hook failed: ${r.output}`, { level: "error" });
        })
        .catch((e) => logForDebugging(`DirectoryAdded hook exec failed: ${e}`, { level: "error" }))
        .finally(stopKeepAlive);
      … reload_claude_md / reload_skills / reload_plugins …
      respondSuccess(request, { directory: targetReal });
    } catch (e) { respondError(request, formatError(e)); }
  }

// Mapping: ke→handleRegisterRepoRoot, a2t→executeDirectoryAddedHooks, bs→startKeepAlive (:847193),
//          Lr→ControlError, Oo.refreshConfig→sandboxConfig.refreshConfig, Pn→respondSuccess, mr→respondError
```

### `startKeepAlive` around the hook dispatch — the `.204` lesson, applied

`bs()` (`:847193-847203`) starts a 30-second `setInterval` that enqueues `{ type: "keep_alive" }` frames
onto the SDK output stream and returns the `clearInterval` closure; `.finally(ji)` releases it when the
hooks settle. This is the same failure mode `.204` fixed for `SessionStart`
(`CLAUDE_RUNNER_ACTIVITY_FD`, 220=3 / 193=0, `:840835`): **a remote runner that sees no traffic on the
stream for long enough idle-reaps the worker.** A hook set with a ten-minute budget is exactly the
window in which that happens, so the new dispatch had to be wrapped in a liveness signal from day one.
Note that `/add-dir` needs no equivalent: an interactive REPL has a terminal, not an idle reaper.

### Why the SDK path debug-logs `systemMessage` instead of surfacing it

`/add-dir` routes `systemMessage` into the transcript; `register_repo_root` writes it to the debug log
(`:847258`) and stops. The reason is in the control protocol's shape: `handleRegisterRepoRoot` answers a
*request* with `Pn(ur, { directory: oo })` — a `control_response`. There is no user turn in progress and
no guarantee a transcript consumer exists; the SDK client that issued the request is the natural
recipient, and it is not listening on the message stream for this. Rather than invent a delivery
channel, `.219` shipped the narrow thing and documented the asymmetry in the hook's own help text.

### The three pre-conditions are all *deny* paths, and the hook never runs on any of them

1. `!po.allowed` — the target does not resolve to a directory (`:847221-847225`).
2. `!vs.allowed` — the target is not a strict subdirectory of cwd, nor of any launch-time `--add-dir` /
   SDK `additionalDirectories` root (`:847233-847237`).
3. already registered (`:847238-847242`).

Check 3 is the interesting one because it is an **idempotency-as-error** decision, and the shipped tool
description at `:839246` calls it out explicitly:

> `A directory that is already a registered working directory (including a duplicate of an earlier
> request) is denied with an error; the registration pipeline and DirectoryAdded hooks do not re-run.`

**Why deny rather than no-op?** The alternative — return success and skip the hooks — makes the hook's
firing depend on invisible session history, so an SDK harness could not tell whether its reindexer ran.
Denying makes the caller's model of the session provably correct: one accepted `register_repo_root`
equals exactly one `DirectoryAdded` dispatch. The cost is that a naively-retrying client sees errors;
the docs pre-empt that by naming "a duplicate of an earlier request" as a denied case.

2.1.193 had a single check here (`:706932 (193)`, `register_repo_root: ${ir.directory} is not a
subdirectory of cwd`) and threw a bare `Error`. 2.1.220 throws `new Lr(detailedMessage, stableReason)` —
a two-argument error carrying a stable machine-readable reason string alongside the human text. That
split (detail for the log, stable string for the wire) is what makes the three failure modes
distinguishable by an SDK client.

---

## 5. The two call sites side by side

| | `/add-dir` (`:655138`) | `register_repo_root` (`:847256`) |
|---|---|---|
| `source` value | `"slash_command"` | `"register_repo_root"` |
| awaited? | no | no |
| liveness signal during hooks | none needed | `startKeepAlive()` / `.finally` |
| `systemMessage` destination | transcript, via `persistHookOutput` (10 KB cap) | debug log |
| per-hook failure output | debug log | debug log |
| aggregate failure count | task notification to the model | nothing |
| dispatch rejection | task notification to the model | debug log |
| pre-conditions before the hook | interactive validation + confirmation dialog (`:655169-655190`) | three throws (`:847221-847242`) |
| ordering guarantee | permission ctx → persist → skills/plugins reload → `refreshConfig()` → hook | permission ctx → persist → `refreshConfig()` → hook → optional reloads |

**The ordering guarantee is the part worth stating loudly**, because it is the one thing a hook author
must be able to rely on and it is stated in the shipped docs at `:696699`:

> `Fires after /add-dir or the register_repo_root SDK control request registers a new working directory,
> after the sandbox configuration has been refreshed — so sandboxed tools and permission state already
> see the new directory (hook commands themselves run unsandboxed).`

Both call sites honour it: `Oo.refreshConfig()` at `:655126` and `:847253` precedes the `a2t` call at
`:655138` / `:847256`. A hook that shells out to `rg` inside the new directory therefore cannot be
denied by a stale sandbox profile. The parenthetical is the security note: **hook commands are not
sandboxed at all** — they are spawned by `q2o` (`:519921`) through `child_process.spawn` with a plain
env, which is why the trust gate in [`hook_trust_and_origin.md`](hook_trust_and_origin.md) matters as
much as it does.

Note the one ordering divergence: `/add-dir` reloads skills/plugins **before** the hook
(`BB(), yse(), Sse(), k7.emit()` at `:655125`), while `register_repo_root` does its
`reload_claude_md` / `reload_skills` / `reload_plugins` work **after** dispatching (`:847266-847283`),
because those are opt-in request parameters. A `register_repo_root` hook therefore runs *concurrently*
with a plugin reload it asked for, and must not assume the new plugin's binaries are on disk yet.

---

## 6. Not covered

- The `Lr` two-argument control error class and the rest of the `register_repo_root` wire contract —
  owned by [`../51_headless_sdk/`](../51_headless_sdk/).
- `yxm` / `gxm` / `hxm` (the directory-scope validators) — read only at their call sites; the scope rule
  they implement (`strict subdirectory of cwd or of a launch-time root`) is quoted from `:839246`, not
  re-derived from their bodies.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_hooks.md](../00_overview/symbol_additions_v2_1_220_hooks.md).

Key functions in this document:
- `executeDirectoryAddedHooks` (`a2t`, `:518817`) - builds the `DirectoryAdded` payload, dispatches via `EM`, splits `results` from `systemMessages`
- `HOOK_EVENT_NAMES` (`lB`, `:49367-49398`) - the 31-entry master event enum; `DirectoryAdded` at `:49396`
- `HOOK_EVENT_REGISTRY` (`AF_`, `:519419-519449`) - event → dispatcher map; `DirectoryAdded: a2t` at `:519444`
- `getMatchingHooks` (`q8s`, `:520359`) - per-event match-query switch; `DirectoryAdded` arm at `:520412`
- `LIST_FORM_MATCHER_EVENTS` (`xF_`, `:522080-522100`) - 19-event set; `DirectoryAdded` at `:522099`
- `collectHooksForEvent` (`DF_`, `:520317`) - merges managed / settings / plugin / session-registry hooks
- `executeHooksOutsideREPL` (`EM`, `:521555`) - batch (non-streaming) hook runner; holds the trust gate at `:521559`
- `executeHooks` (`lM`, `:520573`) - the streaming generator form used inside a turn
- `createBaseHookInput` (`Kf`, `:519620`) - session_id / transcript_path / cwd / prompt_id / permission_mode envelope
- `persistHookOutput` (`jYe`, `:519669`) - 10 KB (`TCu`, `:215345`) spill-to-disk bound on hook text
- `addDirectoryCommandCall` (`Axb`, `:655118`) - `/add-dir` implementation; hook dispatch at `:655138`
- `handleRegisterRepoRoot` (`ke`, `:847216`) - SDK control-request handler; hook dispatch at `:847256`
- `startKeepAlive` (`bs`, `:847193`) - 30 s `keep_alive` frame emitter wrapped around the SDK hook dispatch
- `DIRECTORY_ADDED_HOOK_INPUT_SCHEMA` (`auE`, `:835978-835988`) - SDK zod schema for the payload
- `DEFAULT_HOOK_TIMEOUT_MS` (`Hm`, `:317052`) - `600000`; carryover (`tp`, `:396991 (193)`)
