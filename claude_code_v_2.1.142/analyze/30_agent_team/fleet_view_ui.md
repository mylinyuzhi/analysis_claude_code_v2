# FleetView Dashboard UI — v2.1.142

## TL;DR

`claude agents` boots into a full-screen Ink dashboard called **FleetView**.
It's the only first-class UI surface devoted to the agent-team subsystem.
Three render layers stack into a single screen:

1. **Mount layer (`mountFleetView` / `ao5`)** — an outer `for(;;)` loop
   that owns process.stdin handoff, alt-screen toggling, dispatch-extras
   stashing, and the per-iteration job-attach dance. It is *not* a
   single-mount component; it remounts after each attach/detach cycle.
2. **Dashboard component (`FleetView` / `EQ4`)** — a ~600-line React/Ink
   functional component that holds *all* dashboard state: the job list, the
   query string, the group mode, the per-job status map, the rename mode,
   the voice-input handler, the dispatch-defaults chip. It uses
   `r6.useState` + `r6.useRef` heavily and forwards user keystrokes through
   a custom input router (`Dn6 / wn6 / AG`).
3. **Per-row renderers** — type-specific cells that project an individual
   bg session's state into a status chip + label + age + model + intent.

The same dashboard component is reached via two entry points:

- **`claude agents` CLI subcommand** — invokes `mountFleetView` directly
  with `dispatchExtraArgs` and `dispatchDefaults` resolved by Commander
  options. See `v2_1_142_dispatch_flags.md` for the upstream flag parser.
- **The `←←` (double-left-arrow) shortcut from an interactive REPL** —
  invokes `mountFleetViewFromLeftArrow` (`yQ4`) which lazy-imports the
  FleetView module bundle and seeds it with the user's last-known job set
  via `seedLastJobs` (`jo5`).

A second UI surface — the **background-task dialog** (`←` from a REPL) —
shows the same `AppState.tasks` set but in a smaller modal overlay.
FleetView's audience is the *daemon-supervised bg workers* (where each row
is a separate `claude` process), while the bg-task dialog's audience is the
*in-process tasks* (the eight `task.type` variants from
`task_taxonomy.md`). The two share visual primitives but render different
data sources.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Background Agents, Agent View & Dispatch Surface
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md) — Full v2.1.142 agents mapping

Key functions in this document:
- `mountFleetView` (`ao5`) — main `for(;;)` mount/remount loop (cli_inner_pretty.js:569079-569208)
- `FleetView` (`EQ4`) — the dashboard React/Ink component (cli_inner_pretty.js:567084-…)
- `mountFleetViewFromLeftArrow` (`yQ4`) — `←←` entry-point (cli_inner_pretty.js:569366-569381)
- `seedLastJobs` (`jo5`) — lazy-loaded "what was on screen last time" prefiller (cli_inner_pretty.js, in MG8 module)
- `lazyLoadFleetView` (`xn6`) — `Promise.all([reactCreateRootImport, fleetViewModuleImport])` (cli_inner_pretty.js, near 569375)
- `dispatchDefaultsChips` (`Qg4`) — renders permission-mode + model + effort chips (cli_inner_pretty.js:565479-565503)
- `inputHandoffWrapper` (`oo5`) — wraps the dashboard with mouse-tracking when in alt-screen (cli_inner_pretty.js:569065-569078)
- `consumeAgentViewRelaunchMarker` (`Cq6`) — reads the `CLAUDE_AGENTS_AUTO_RELAUNCHED_AT` env-var on resume (cli_inner_pretty.js:139921-139924)
- `MoH` — `shouldAcceptLeftArrowToAgentView` (cli_inner_pretty.js:435227-435228)
- `$1H` — `setHasUsedAgentsFleet` (cli_inner_pretty.js:435230-435233)
- `pillLabelFromBackgroundTasks` (`LnH`) — type-bucketed pill label (cli_inner_pretty.js:348780-348822)
- `pillNeedsCta` (`bx7`) — ultraplan-attention CTA gate (cli_inner_pretty.js:348823-348827)
- `bgTaskTypeRenderers` (the per-`type` switch around `cli_inner_pretty.js:477940-478060`)
- `bgTaskDialogBucketsMemo` (the bucket-sort `useMemo` at `cli_inner_pretty.js:479660-479687`)
- Constants: `AUTO_RELAUNCH_UNFOCUSED_MS` (`tZ8` = 3,600,000 ms), `AUTO_RELAUNCH_MIN_INTERVAL_MS` (`OQ4` = 21,600,000 ms), `AUTO_RELAUNCH_ENV_KEY` (`Pn6` = `"CLAUDE_AGENTS_AUTO_RELAUNCHED_AT"`)

---

## Layer 1: The Mount Loop (`mountFleetView` / `ao5`)

```javascript
// ============================================
// mountFleetView - Outer attach/detach orchestrator
// Location: cli_inner_pretty.js:569079-569208
// ============================================

// ORIGINAL (for source lookup):
async function ao5(H, $) {
  (MN4($?.dispatchExtraArgs ?? []), d("tengu_bg_agent_action", { action: "list_open" }));
  let q = [];
  function K() { /* swallow stdin while no UI is mounted */ }
  process.stdin.on("readable", K);
  let _ = $?.cwdFilter ? await R3(xr.resolve($.cwdFilter)) : void 0,
    A = gg4($?.dispatchDefaults);
  (CK(JN4), CK(_j8("claude agents")));
  let z = H, Y = process.env.CLAUDE_AGENTS_SELECT, f = !!Y;
  delete process.env.CLAUDE_AGENTS_SELECT;
  let O = await rB4(await R3(I$())), M = O?.q || void 0, w = O?.collapsed;
  GZ8();
  let D, j, J;
  process.stdin.off("readable", K);
  while (q.length) process.stdin.unshift(q.pop());
  for (;;) {
    let X = await new Promise((G) => {
      z.render(N$.createElement(oo5, null,
        N$.createElement(sw, { initialState: J && { ...J, notifications: { current: null, queue: [] } },
                              onChangeAppState: ({ newState: V }) => { J = V; } },
          N$.createElement(wa$, null, N$.createElement(nD, null,
            N$.createElement(EQ4, {
              onAction: G, initialJobId: Y, enteredViaLeftArrow: f,
              initialQuery: M, initialCollapsed: w, initialError: D, initialGroupMode: j,
              cwdFilter: _, dispatchDefaults: A,
            }))))));
    }), L = vr$();
    /* ...handoff alt-screen + raw-mode for Windows ... */
    if (X.type === "done") break;
    /* ...attach to selected job, capture telemetry, remount on detach... */
    (z = await sA$({ exitOnCtrlC: !1 }));
  }
}

// READABLE (for understanding):
async function mountFleetView(stdinAdapter, options) {
  // (1) Stash dispatch-extras so coldDispatchFromTemplate can read them later.
  setDispatchExtraArgsForSession(options?.dispatchExtraArgs ?? []);
  emitTelemetry("tengu_bg_agent_action", { action: "list_open" });

  // (2) Pre-render: catch stdin until we've finished bootstrap.
  const stdinBuffer = [];
  function captureStdin() {
    let chunk;
    while ((chunk = process.stdin.read()) !== null) {
      const bytes = typeof chunk === "string" ? Buffer.from(chunk, "utf8") : chunk;
      if (bytes.includes(3)) { process.emit("SIGINT"); return; }   // Ctrl-C → bail
      stdinBuffer.push(chunk);
    }
  }
  process.stdin.on("readable", captureStdin);

  // (3) Resolve options.
  const cwdFilter = options?.cwdFilter ? await realpath(pathResolve(options.cwdFilter)) : undefined;
  const dispatchDefaults = coerceDispatchDefaults(options?.dispatchDefaults);

  setProcessTitle(AGENT_VIEW_TITLE_CONST);
  setProcessTitle(buildAgentViewTitle("claude agents"));

  let term = stdinAdapter;
  const initialJobId = process.env.CLAUDE_AGENTS_SELECT;
  const enteredViaLeftArrow = !!initialJobId;
  delete process.env.CLAUDE_AGENTS_SELECT;

  // (4) Restore persisted query / collapsed set for this cwd.
  const persisted = await readPersistedFleetState(await realpath(cwd()));
  let initialQuery = persisted?.q;
  let initialCollapsed = persisted?.collapsed;

  hideCursor();

  let initialError, initialGroupMode, savedAppState;

  // (5) Replay stdin into the adapter so the dashboard sees what arrived during bootstrap.
  process.stdin.off("readable", captureStdin);
  while (stdinBuffer.length) process.stdin.unshift(stdinBuffer.pop());

  // (6) Outer mount loop: render → wait for action → attach/detach → remount.
  for (;;) {
    const action = await new Promise((resolveAction) => {
      term.render(
        <InputHandoffWrapper>
          <AppStateRoot initialState={savedAppState && { ...savedAppState, notifications: { current: null, queue: [] } }}
                        onChangeAppState={({ newState }) => { savedAppState = newState; }}>
            <UnknownProvider>
              <ThirdProvider>
                <FleetView
                  onAction={resolveAction}
                  initialJobId={initialJobId}
                  enteredViaLeftArrow={enteredViaLeftArrow}
                  initialQuery={initialQuery}
                  initialCollapsed={initialCollapsed}
                  initialError={initialError}
                  initialGroupMode={initialGroupMode}
                  cwdFilter={cwdFilter}
                  dispatchDefaults={dispatchDefaults}
                />
              </ThirdProvider>
            </UnknownProvider>
          </AppStateRoot>
        </InputHandoffWrapper>
      );
    });

    const isAltScreen = isAltScreenActive();    // vr$()
    if (isAltScreen && action.type === "open") {
      terminalRegistry.get(process.stdout)?.handoffAltScreen();
    }
    if (osKind() === "windows" && action.type === "open") {
      terminalRegistry.get(process.stdout)?.handoffRawMode();
    }
    if (!isAltScreen) term.render(null);

    term.unmount();
    initialError = undefined;

    if (action.type === "done") break;          // user dismissed dashboard

    if (osKind() === "windows" && process.stdin.isTTY && "setRawMode" in process.stdin) {
      process.stdin.setRawMode(true);
      process.stdin.ref();
    }

    const restoreScreen = isAltScreen ? deferOnFirstFlush(() => process.stdout.write(resetAltScreen())) : () => {};

    // (7) Carry forward state across the remount.
    initialJobId = action.job.id;
    initialQuery = action.query;
    initialCollapsed = action.collapsed;
    initialGroupMode = action.groupMode;
    moduleGlobalJobsCache = action.jobs;
    moduleGlobalLoopKicks = action.loopKicks;
    moduleGlobalStatuses = action.statuses;
    moduleGlobalStatusesTs = action.statusesTs;
    moduleGlobalPrStatuses = action.prStatuses;
    needsHydration = true;

    const remountStartedAt = Date.now();
    // (8) Respawn / attach the selected job.
    const respawnResult = action.respawnResult ?? await respawnOrCheckJob(
      action.job.id,
      action.freshDispatch ? undefined : {
        knownState: action.job.state,
        knownAlive: (Date.now() - action.statusesTs < 1500
                  && action.statuses.get(action.job.state.resumeSessionId ?? action.job.state.sessionId) !== undefined)
          ? true : undefined,
      },
    );
    /* ...attach success/failure handling, telemetry, error message capture... */

    // (9) Allocate a fresh stdin adapter; the new mount writes into the (possibly altscreen-handed-back) terminal.
    term = await acquireStdin({ exitOnCtrlC: false });
    log("[PERF:bg-remount-start]");
    restoreScreen();
  }
}

// Mapping: ao5→mountFleetView, H→stdinAdapter, $→options, q→stdinBuffer, K→captureStdin,
//          _→cwdFilter, A→dispatchDefaults, z→term, Y→initialJobId, f→enteredViaLeftArrow,
//          O→persisted, M→initialQuery, w→initialCollapsed, D→initialError, j→initialGroupMode,
//          J→savedAppState, X→action, L→isAltScreen, P→restoreScreen, Z→remountStartedAt,
//          W→respawnResult, G→remountTimer, V→attachCallback, v→attachResult, E→retried,
//          MN4→setDispatchExtraArgsForSession, gg4→coerceDispatchDefaults,
//          sA$→acquireStdin, rB4→readPersistedFleetState, AG8→respawnOrCheckJob,
//          oo5→InputHandoffWrapper, EQ4→FleetView
```

### Why an outer remount loop?

**What it does:** Each iteration mounts the dashboard, waits for the user to
pick a job, **unmounts entirely**, attaches the user to the chosen job's
PTY, then waits for them to detach and remounts the dashboard.

**Why this approach:**

- **Alt-screen handoff is non-resumable.** When the user attaches to a bg
  worker, that worker takes over the alt-screen. The dashboard cannot
  remain partially rendered behind a child PTY — Ink's diff-based renderer
  would corrupt the attached child's output. So a full unmount/remount is
  the cleanest contract.
- **State is preserved via closure.** The outer loop variables
  (`initialJobId`, `initialQuery`, `initialCollapsed`, `initialGroupMode`,
  `savedAppState`) survive across mounts. When the user detaches and the
  dashboard remounts, they land back on the same row with the same query
  pre-filled. This is the "I came back to where I was" UX.
- **Telemetry boundaries.** Each iteration corresponds to one
  `tengu_bg_agent_action` event family + one `attach/detach` pair. The mount
  loop naturally separates these events.

**Alternative considered:** Keep the dashboard mounted, render the child
PTY into a sub-region. Rejected because Ink's renderer doesn't compose with
opaque child terminals, and because the attached agent might use Ink itself
(nested alt-screens would be irrecoverable).

**Key insight:** The dashboard is *stateless* across iterations. All
state lives in the outer closure. This makes the inner React tree
remountable without bootstrapping the heavy state again — just pass the
saved state back in via `initialState`.

### `oo5` — the Input Handoff Wrapper

```javascript
function oo5(H) {
  let $ = o$H.c(3), { children: q } = H;
  if (vr$()) {                        // isAltScreenActive
    let K;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) ((K = HA$()), ($[0] = K));
    else K = $[0];
    let _;
    if ($[1] !== q) ((_ = N$.createElement(o0$, { mouseTracking: K }, q)), ($[1] = q), ($[2] = _));
    else _ = $[2];
    return _;
  }
  return q;
}
```

The wrapper conditionally enables xterm mouse-tracking *only* when the
terminal is already in alt-screen mode. This is because the standard
terminal mode doesn't reliably handle mouse-tracking sequences without
visual artifacts, but alt-screen does (alt-screen is what xterm-mouse-events
were designed for). Outside alt-screen, the children render unwrapped.

The React `memo_cache_sentinel` boilerplate is the React Compiler's
optimization tag — `o$H.c(3)` allocates a 3-slot cache and the surrounding
checks short-circuit re-renders when inputs are unchanged.

---

## Layer 2: The `FleetView` Dashboard (`EQ4`)

The component declaration starts at `cli_inner_pretty.js:567084` and runs
~600 lines. Its overall structure (transcribed from a structural read of
567084-568200) is:

```jsx
function FleetView({
  onAction,                     // resolver for the outer mount loop's Promise
  initialJobId,                 // job to highlight on first render
  enteredViaLeftArrow,          // boolean: was this entered via ←←?
  initialQuery,                 // search box prefill
  initialCollapsed,             // Set<string> of collapsed group keys
  initialError,                 // top-bar error message
  initialGroupMode,             // 'state' | 'cwd' | 'effort'
  cwdFilter,                    // resolved cwd path to filter jobs by
  dispatchDefaults,             // { permissionMode?, model?, effort? }
}) {
  const [jobs,        setJobs]      = useState(In6);        // load shared module global
  const [extraJobs,   setExtraJobs] = useState([]);
  const [statuses,    setStatuses]  = useState({});
  const [prStatuses,  setPrStatuses]= useState(() => vn6); // module global
  /* prStatuses refresh-from-disk on mount (jx7) */

  const [loopKicks,   setLoopKicks] = useState(() => new Map(jQ4));
  const [intentMap,   setIntentMap] = useState(() => new Map(kn6));

  // cwd resolution + repoGroupLabel (En6)
  const cwd = currentCwd(), repoGroup = En6({ cwd });
  const [resolvedCwd, setResolvedCwd] = useState(cwd);
  // resolves realpath asynchronously to handle symlinked .claude dirs

  // group mode (persisted in user settings)
  const [groupMode, setGroupMode] = useState(() => initialGroupMode ?? settings().fleetViewGroupMode ?? 'state');

  // collapsed group keys (persisted per-cwd query string)
  const [collapsedKeys, setCollapsedKeys] = useState(() => new Set(initialCollapsed));

  // search input (uses the standard AG input-handler with multi-line on)
  const { query, queryRef, setQuery, cursorOffset, handleKeyDown, handlePaste } = AG({
    initialQuery, isActive: /* dashboard is active */, multiline: true,
    onCancel: jobs === null ? maybeShowDoneDialog : undefined,
    onSpaceOnEmpty: () => /* toggle expanded selection */,
  });

  // voice input (Vh / Mq)
  const voiceHandlers = wn6({ setInputValueRaw: setQuery, inputValueRef: queryRef, ... });
  const voiceKeyHandler = Dn6({ ... });   // routes Esc/Space/Enter to voice when active

  // job lookup cache, claim-spare warning state, modal state (rename, confirm-kill, … )
  // ... ~200 lines of useRef/useEffect plumbing ...

  // poll loop (every Mo5 = 60s by default; faster wo5 = 30s when ant flag set)
  // → fetches roster from daemon, updates statuses + loopKicks

  // big rendering tree (~150 lines)
  return (
    <Box>
      <Header /* shows query input, dispatch chips, group-mode toggle, error banner */ />
      <JobsList /* per-job rows grouped + collapsed + filtered + ordered */ />
      <Footer /* shows key hints, persist hints, version */ />
      {/* Modal overlays: rename mode, confirm-kill, voice indicator, … */}
    </Box>
  );
}
```

### State Categories

Six categories of state inside the component:

1. **Job data** — `jobs`, `extraJobs`, `statuses`, `prStatuses`,
   `loopKicks`, `intentMap`. Driven by polls to the daemon's `aB`-roster
   reader. The module-global initial values (`In6`, `jQ4`, `kn6`, `vn6`,
   `PQ4`, `Nn6`) let the next mount in the `ao5` loop see the *previous*
   mount's last snapshot before the first refresh arrives.
2. **Search / filter** — `query`, `cursorOffset`, `groupMode`,
   `collapsedKeys`, `resolvedCwd`. Persisted to `~/.claude/agents/state/<cwd-hash>.json`
   via `lB4(C, {q, collapsed})`.
3. **Modal mode** — `renameSession` (rename mode), `confirmKillId`,
   `voiceState`, `voiceWarmingUp`, `donePromptOpen`. Mutually-exclusive
   blocking overlays.
4. **Input plumbing** — `query` + `queryRef` from the standard `AG`
   hook, voice handlers from `wn6`/`Dn6`/`Mq`, "double-tap submit" disabled.
5. **Layout** — `{columns, rows} = s8()`, `aH = wQ4(rows)` ("done cap for
   rows"), `AH = columns >= 120 ? 1 : 0` (wide-mode flag).
6. **Performance** — `useRef`s shadowing `useState`s so handlers can read
   latest values without re-binding. The `D.current = M` / `W.current = P`
   / `E.current = V` pattern recurs throughout.

### Group Modes

| Mode | What's grouped by | When useful |
|------|-------------------|-------------|
| `state` (default) | `working`, `paused`, `blocked`, `done`, … | The natural "what's actionable?" view |
| `cwd` | Repository root path | "Show me everything in `~/work/X`" |
| `effort` | High/medium/low effort tags | Match by load-class |

`groupMode` is persisted to user settings under `fleetViewGroupMode` so it
survives across `claude agents` invocations.

### Search

The search box is a standard multi-line `AG` input. It filters jobs by
substring against multiple keys (`name`, `intent`, `description`,
`outputFile`'s tail, `state.sessionId`). The persistence write is debounced
500 ms via `lM(...300, [query, collapsedKeys, resolvedCwd])`.

### Selection & Actions

The dashboard's job is to let the user pick **one** job and resolve the
mount-loop's promise. The actions it can return:

```typescript
type FleetViewAction =
  | { type: 'open',  job, query, collapsed, groupMode, jobs, loopKicks, statuses, statusesTs, prStatuses, freshDispatch?, respawnResult? }
  | { type: 'done' }  // user dismissed dashboard
```

The `open` action carries all the data the next iteration needs to know:
which job, what the dashboard looked like (for the eventual remount), and
optionally a pre-computed respawn result (for the freshly-dispatched-from-
within-the-dashboard case where the respawn already ran).

### Lazy-Load Pattern

The FleetView module is lazy-loaded — it's not imported by the entry-point
binary, only fetched when actually needed. The lazy pattern lives at
`cli_inner_pretty.js:569363-569364`:

```javascript
async function xn6() {
  return Promise.all([
    import("./somePath/createRoot..."),   // React createRoot
    import("./somePath/fleetView..."),    // mountFleetView, seedLastJobs
  ]);
}
```

This costs ~50ms on first invocation but keeps the cold-start binary
smaller and the eager imports of common code paths faster (a typical
`claude` REPL never opens FleetView).

---

## Layer 3: Per-Row Renderers (the `case "type":` switch)

The cell renderer at `cli_inner_pretty.js:477940-478060` is a giant
`switch (q.type)` that projects each task type into its row representation
*for the background-task dialog*. Sketch of the structure:

```javascript
switch (q.type) {
  case "local_bash":           // (omitted here)
  case "local_agent":          // (omitted here)
  case "in_process_teammate":  // (omitted here)
  case "local_workflow": {
    const labelText = q.workflowName ?? q.summary ?? q.description;
    const labelEl = lazyRenderLabel(labelText, query, /*highlight=*/true);
    const statusLabel = q.status === "running" ? `${q.agentCount} ${pluralize(q.agentCount, "agent")}`
                      : q.status === "completed" ? "done"
                      : undefined;
    const suffix = q.status === "completed" && !q.notified ? ", unread" : undefined;
    const chip = createElement(StatusChip, { status: q.status, label: statusLabel, suffix });
    return createElement(Text, null, labelEl, " ", chip);
  }
  case "mcp_task": { /* shows `serverName/toolName · <shortId> · <status>` */ }
  case "monitor_mcp": { /* shows `description ${StatusChip}` */ }
  case "dream": { /* shows `· {phase} · {filesTouched|sessionsReviewing}` */ }
  /* ... */
}
```

Each renderer:
1. Resolves a human label (often via `c7(text, query, true)` which
   highlights the search query inside the label).
2. Computes a per-status label string (`"3 agents"`, `"done"`, etc.).
3. Adds `", unread"` suffix if the task is terminal and the model hasn't
   seen the notification yet (`!q.notified`).
4. Wraps everything in a `StatusChip` (`N1H`) with the type-appropriate
   color.

The `StatusChip` itself is a separate component (`N1H`) that maps `status`
to a color via `statusColor(status)` — `"running" → primary`,
`"completed" → success`, `"failed" → error`, `"killed" → warning`, etc.

### The Background-Task Dialog (`←` from REPL)

A different surface from FleetView. Triggered by the `←` (single
left-arrow) shortcut in an interactive REPL. Shows a *small modal* listing
in-process tasks (not bg workers).

The bucket-sort `useMemo` at `cli_inner_pretty.js:479660-479687`:

```javascript
let bashTasks       = MH.filter(t => t.type === "local_bash"),
    remoteSessions  = MH.filter(t => t.type === "remote_agent"),
    agentTasks      = MH.filter(t => t.type === "local_agent" && t.id !== currentAgentId),
    workflowTasks   = MH.filter(t => t.type === "local_workflow"),
    mcpMonitors     = MH.filter(t => t.type === "monitor_mcp"),
    mcpTasks        = MH.filter(t => t.type === "mcp_task"),
    dreamTasks      = MH.filter(t => t.type === "dream"),
    teammateTasks   = z ? [] : MH.filter(t => t.type === "in_process_teammate");

let leaderPseudo = teammateTasks.length > 0
                 ? [{ id: "__leader__", type: "leader", label: `@${LEAD_NAME}`, status: "running" }]
                 : [];

return {
  bashTasks, remoteSessions, agentTasks, workflowTasks,
  mcpMonitors, mcpTasks, dreamTasks,
  teammateTasks: [...leaderPseudo, ...teammateTasks],
  allSelectableItems: [...leaderPseudo, ...teammateTasks,
                       ...bashTasks, ...mcpMonitors, ...mcpTasks,
                       ...remoteSessions, ...agentTasks,
                       ...workflowTasks, ...dreamTasks],
};
```

The order in `allSelectableItems` is the user's ↓-arrow traversal order.
The leader pseudo-row is *only* added when there's at least one teammate
(so a non-team session doesn't show a phantom "view leader" row).

### Per-Type Key Handlers

| Key | Action |
|-----|--------|
| `↑` / `↓` | Move selection |
| `←` | Dismiss dialog |
| `x` | Kill selected (per-type kill function) |
| `f` | "View" — Shift to teammate view (in_process_teammate) or leader view (leader pseudo-row) |
| Enter | Open detail panel (`{mode: 'detail', itemId}`) for any non-mcp_task |

The per-type kill functions at lines 479730-479744:

```javascript
function R(id) { return q38.kill(id, getAppState, setAppState); }  // local_bash
function B(id) { return $38.kill(id, getAppState, setAppState); }  // local_agent
function u(id) { return oO$.kill(id, getAppState, setAppState); }  // in_process_teammate
function S(id) { return ef8.kill(id, getAppState, setAppState); }  // dream
function x(id) { return uvH.kill(id, getAppState, setAppState); }  // remote_agent
// workflow/monitor_mcp/mcp_task have their own kill paths (NX8, EX8, vX4)
```

Each calls into the `Task.kill` implementation for that type (see
`task_taxonomy.md`).

---

## Dispatch-Defaults Chips (`Qg4`)

The chip row that surfaces the *currently-active dispatch defaults* — the
flags carried over from the `claude agents --model X --effort Y
--permission-mode Z` invocation.

```javascript
// ============================================
// dispatchDefaultsChips - Render permission/model/effort chips in the dashboard header
// Location: cli_inner_pretty.js:565479-565503
// ============================================

// ORIGINAL (for source lookup):
function Qg4(H) {
  let $ = Fg4.c(11), { defaults: q } = H, { permissionMode: K, model: _, effort: A } = q,
    z = K && K !== "default";
  if (!z && !_ && !A) return null;
  let Y;
  if ($[0] !== K || $[1] !== z)
    ((Y = z && a0$.default.createElement(k, { color: Cv(K) }, wPH(K), " ", zAH(K).toLowerCase())),
      ($[0] = K), ($[1] = z), ($[2] = Y));
  else Y = $[2];
  let f;
  if ($[3] !== _) ((f = _ && a0$.default.createElement(k, { dimColor: !0 }, _)), ($[3] = _), ($[4] = f));
  else f = $[4];
  let O;
  if ($[5] !== A) ((O = A && a0$.default.createElement(k, { dimColor: !0 }, A)), ($[5] = A), ($[6] = O));
  else O = $[6];
  let M;
  if ($[7] !== Y || $[8] !== f || $[9] !== O)
    ((M = a0$.default.createElement($8, null, Y, f, O)), ($[7] = Y), ($[8] = f), ($[9] = O), ($[10] = M));
  else M = $[10];
  return M;
}

// READABLE (for understanding):
function dispatchDefaultsChips({ defaults }) {
  const cache = chipCache.c(11);                        // React Compiler 11-slot memo cache
  const { permissionMode, model, effort } = defaults;
  const showPermissionChip = permissionMode && permissionMode !== "default";

  if (!showPermissionChip && !model && !effort) return null;

  // Permission chip — colored by mode (Cv returns hex for the mode's identity color).
  let permissionChip;
  if (cache[0] !== permissionMode || cache[1] !== showPermissionChip) {
    permissionChip = showPermissionChip
      ? React.createElement(Text, { color: getPermissionModeColor(permissionMode) },
          getPermissionModeGlyph(permissionMode), " ", getPermissionModeLabel(permissionMode).toLowerCase())
      : undefined;
    cache[0] = permissionMode; cache[1] = showPermissionChip; cache[2] = permissionChip;
  } else permissionChip = cache[2];

  // Model chip — dimmed (these are "informational, not active").
  let modelChip;
  if (cache[3] !== model) {
    modelChip = model && React.createElement(Text, { dimColor: true }, model);
    cache[3] = model; cache[4] = modelChip;
  } else modelChip = cache[4];

  // Effort chip — dimmed.
  let effortChip;
  if (cache[5] !== effort) {
    effortChip = effort && React.createElement(Text, { dimColor: true }, effort);
    cache[5] = effort; cache[6] = effortChip;
  } else effortChip = cache[6];

  // Composition row.
  let row;
  if (cache[7] !== permissionChip || cache[8] !== modelChip || cache[9] !== effortChip) {
    row = React.createElement(ChipsRow, null, permissionChip, modelChip, effortChip);
    cache[7] = permissionChip; cache[8] = modelChip; cache[9] = effortChip; cache[10] = row;
  } else row = cache[10];

  return row;
}

// Mapping: Qg4→dispatchDefaultsChips, H→props, q→defaults, K→permissionMode, _→model, A→effort,
//          z→showPermissionChip, Y→permissionChip, f→modelChip, O→effortChip, M→row,
//          Cv→getPermissionModeColor, wPH→getPermissionModeGlyph, zAH→getPermissionModeLabel,
//          Fg4→chipCache, $8→ChipsRow
```

### Why Three Different Style Treatments?

- **Permission mode chip uses an explicit color** because mode is the most
  semantically charged: `bypassPermissions` is red, `acceptEdits` is yellow,
  `auto` is blue, `plan` is purple. The color is a peripheral-vision cue.
- **Model and effort chips are dimmed** because they're informational — the
  user already typed them on the CLI, they're not "active" the way mode is.
- **Returns null entirely if no defaults set** to keep the header row
  clean.

### React Compiler Optimization

The `Fg4.c(11)` allocation and the per-slot cache reads/writes are
React Compiler-generated memoization. The compiler analyzed the JSX and
inserted slot checks to skip allocating chip elements when the inputs are
unchanged. This is a Bun-bundled artifact; the source is presumably written
in pre-compiler JSX and the obfuscator preserved the compiler output.

The 11 slots are: 3 for permission inputs/output, 2 for model, 2 for
effort, 3 for composition (final row computed from the three chips), plus
slot 10 for the cached row.

---

## Pill Label & CTA (Footer Surface)

The compact footer pill — the one-line "N background tasks · ↓ to view"
hint at the bottom of the leader REPL — uses `pillLabelFromBackgroundTasks`
(`LnH`) and `pillNeedsCta` (`bx7`).

```javascript
// ============================================
// pillLabelFromBackgroundTasks - Compact label for the footer pill
// Location: cli_inner_pretty.js:348780-348822
// ============================================

// (Already extensively documented in task_taxonomy.md; see there for the full body.)
```

The label algorithm:

1. If all tasks share a type, render the type-specific label
   (e.g., "2 shells, 1 monitor", "1 team", "3 local agents", "◇ ultraplan
   needs your input").
2. If they're mixed, render the generic "N background tasks".

The CTA helper:

```javascript
function pillNeedsCta(tasks) {
  if (tasks.length !== 1) return false;
  const t = tasks[0];
  return t.type === "remote_agent" && t.isUltraplan === true && t.ultraplanPhase !== undefined;
}
```

The footer pill shows the dimmed `· ↓ to view` suffix **only** when an
ultraplan needs attention (plan ready or needs input). For ordinary work,
the diamond/text label alone is sufficient cue; for ultraplan attention
states, the CTA explicitly invites action because the user can't progress
without acting.

---

## What FleetView Doesn't Show

For completeness, several pieces of state that are *not* surfaced in the
dashboard:

- **Per-job permission mode** — the chip-row shows the *defaults*, not
  each job's current effective mode. To see a specific job's mode the user
  must attach.
- **Mailbox traffic** — the dashboard doesn't surface in-process teammate
  messages. Use `←` (bg-task dialog) → `f` (view teammate) for that.
- **Identity tree** — agent/parent-agent relationships are not visualized.
  Server-side tooling consumes the headers and span attributes for that.
- **Skill/MCP server activity** — only the task type and high-level status
  are shown; the in-flight tool calls are not.

The dashboard's design contract is *"let the user find a session quickly
and attach"*, not *"let the user fully inspect a session without
attaching"*. The latter is the attached view's responsibility.

---

## v2.1.142 Telemetry Surface

The FleetView mount fires these telemetry events (a curated subset; the
full list is in `symbol_additions_v2_1_142_agents.md`):

| Event | When |
|-------|------|
| `tengu_bg_agent_action: list_open` | Dashboard opened |
| `tengu_fleetview` (with `viaCommander` / `relaunch` flags) | Subcommand action fires |
| `tengu_fleetview_fold_expand` | User toggles a group expand/collapse |
| `tengu_fleetview_fold_shown` | A group's row count first surfaces |
| `tengu_fleetview_pr_batch` | PR-status batch fetch completes |
| `tengu_daemon_self_restart_on_upgrade` | Daemon noticed binary changed (logged after self-restart) |

The `relaunch: Cq6()` flag captures whether the dashboard was opened
because a previous instance auto-relaunched after `brew upgrade`
(`Cq6 / consumeAgentViewRelaunchMarker`); used to attribute the
relaunch-driven mount versus user-initiated.

---

## Auto-Relaunch on Binary Upgrade

When the daemon detects a binary upgrade (see
`coordinator_process_model.md`), it sets the env var
`CLAUDE_AGENTS_AUTO_RELAUNCHED_AT` and re-execs `claude agents`. The new
process reads the marker, fires `tengu_fleetview {relaunch: true}`, and
mounts fresh. The marker is consumed (one-shot) so subsequent mounts in
the same process don't re-attribute.

Constants:
- `AUTO_RELAUNCH_UNFOCUSED_MS` (`tZ8` = 3,600,000 ms) — only relaunch if
  the agent view has been *unfocused* for at least an hour. Prevents
  surprise re-execs while the user is actively interacting.
- `AUTO_RELAUNCH_MIN_INTERVAL_MS` (`OQ4` = 21,600,000 ms = 6 hours) —
  cap on relaunch frequency. Prevents a flapping binary from causing a
  relaunch loop.
- `AUTO_RELAUNCH_ENV_KEY` (`Pn6`) — the marker env-var name.

---

## See Also

- [task_taxonomy.md](./task_taxonomy.md) — the eight `type` values rendered in the per-row switch
- [v2_1_142_dispatch_flags.md](./v2_1_142_dispatch_flags.md) — how `--add-dir` / `--model` / `--permission-mode` flow into `dispatchDefaults`
- [coordinator_process_model.md](./coordinator_process_model.md) — what each row in FleetView represents on the daemon side
- [teammate_runner_loop.md](./teammate_runner_loop.md) — the in-process teammate runtime surfaced by the bg-task dialog
- [team_lifecycle_tools.md](./team_lifecycle_tools.md) — the model-side tools that produce the rows
- v2.1.112 baseline: `30_agent_team/` had no dashboard; agent view was added in v2.1.139 and matured through v2.1.142
