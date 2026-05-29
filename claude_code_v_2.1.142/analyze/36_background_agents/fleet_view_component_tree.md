# FleetView Dashboard Component Tree & State Flow — v2.1.142

## Scope

This document is the *insides* of [agent_view.md](./agent_view.md). It catalogs the **React/Ink component tree** of the fleet-view dashboard, traces **how data flows from the daemon to the screen**, and explains the **state hooks** (`useState`, `useRef`, `useEffect`, `useMemo`) that hold the dashboard's reactive state. It also documents the **keyboard handler hierarchy** because input dispatch is non-trivial — there are several overlapping focus regions, each with its own keymap.

The single root component is `FleetViewDashboard` (`EQ4`, cli_inner_pretty.js:567084-568873) — a ~1800-line functional component. It's mounted by `mountFleetView` (`ao5`, cli_inner_pretty.js:569079-569207) inside an Ink `render(...)` call.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Ink UI

Key components / hooks:
- `mountFleetView` (`ao5`) — the outer loop that wraps render-loop-and-attach (cli_inner_pretty.js:569079-569207)
- `FleetViewDashboard` (`EQ4`) — root component (cli_inner_pretty.js:567084-568873)
- `JobRow` (`Fo5`) — one row per worker, with status / age / log tail (cli_inner_pretty.js:~568656)
- `ExpandedJobPanel` (`bo5`) — overlay panel for focused job (cli_inner_pretty.js:~568815)
- `HelpFooter` (`co5`) — shortcuts cheatsheet (cli_inner_pretty.js:568882)
- `RecordingCursor` (`do5`) — voice-recording cursor animation (cli_inner_pretty.js:568874)
- `STATE_LABELS` (`og4`) — `{review,blocked,working,done}` → display strings (cli_inner_pretty.js:569355)
- `STATE_ORDER` (`rg4`) — `["review","blocked","working","done"]` (cli_inner_pretty.js:569354)
- `classifyState` (`byH`) — maps a job's state.state + tempo + needs → bucket (cli_inner_pretty.js:565759)
- `groupKeyForJob` (`eZ8`) — chooses group key in `state` group mode (cli_inner_pretty.js:565768)
- `groupByCwd` (`En6`) — chooses group key in `cwd` group mode (cli_inner_pretty.js:566060)

## High-Level Mount Flow (`mountFleetView` / `ao5`)

```javascript
// Conceptual flow at cli_inner_pretty.js:569107-569207:
async function mountFleetView(rootRenderer, opts) {
  emit("tengu_bg_agent_action", { action: "list_open" });
  let stdinBuffer = [];                            // drained input before mount
  process.stdin.on("readable", () => { ... drain into stdinBuffer ... });
  let cwdFilter = opts?.cwdFilter ? await realpath(...) : undefined;
  let dispatchDefaults = coerceDispatchDefaults(opts?.dispatchDefaults);   // gg4

  let renderer = rootRenderer, initialJobId = process.env.CLAUDE_AGENTS_SELECT;
  let { q, collapsed } = await readPersistedFleetState(cwd);   // rB4

  for (;;) {  // outer attach/dispatch loop
    let action = await new Promise(resolve => {
      renderer.render(
        <ThemeProvider>
          <AppStateContext initialState={…} onChangeAppState={…}>
            <FullScreenInkRoot>
              <NotificationsProvider>
                <FleetViewDashboard
                  onAction={resolve}
                  initialJobId={initialJobId}
                  enteredViaLeftArrow={!!process.env.CLAUDE_AGENTS_SELECT}
                  initialQuery={q}
                  initialCollapsed={collapsed}
                  initialError={lastError}
                  initialGroupMode={lastGroupMode}
                  cwdFilter={cwdFilter}
                  dispatchDefaults={dispatchDefaults}
                />
              </NotificationsProvider>
            </FullScreenInkRoot>
          </AppStateContext>
        </ThemeProvider>
      );
    });

    // Action returned from inside FleetView (open/done/etc.)
    if (action.type === "open") T_.get(stdout)?.handoffAltScreen();      // Linux/macOS
    if (os === "windows" && action.type === "open") T_.get(stdout)?.handoffRawMode();
    renderer.unmount();
    if (action.type === "done") break;

    // Attach to selected job (PTY hand-off to attachJob)
    let respawn = action.respawnResult ?? await respawnIfNeeded(action.job.id, ...);
    if (respawn.ok || respawn.alive) {
      let attachResult = await attachJob(respawn.short ?? action.job.id, { alreadyInAlt: true });
      // attachJob handles ENOJOB/disconnect/recovery internally (see rv_socket_protocol.md)
      if (attachResult.kind === "error" && !attachResult.ended) lastError = attachResult.msg;
    } else lastError = respawn.error;

    // Loop: remount dashboard after detach
    renderer = await createRoot({ exitOnCtrlC: false });
  }
}
```

### The "outer loop" idea

The dashboard is **not** the foreground UI continuously. It's mounted, the user picks a job, the dashboard unmounts, the user is dropped into the attached worker's session via PTY hand-off, and when they `Ctrl+Z` to detach, the dashboard is **remounted** with preserved state. The state-preservation pieces:

- `initialJobId` — the just-attached job (used to highlight it on remount)
- `initialQuery` — the search/filter input the user had typed
- `initialCollapsed` — collapsed-group set
- `initialError` — error from last attach attempt
- `initialGroupMode` — `"state"` vs `"cwd"` grouping choice

The persisted state (`q`, `collapsed`) lives in `~/.claude/fleet-view-state/<cwdHash>.json` and is read/written via `rB4`/`lB4`. The 300ms debounce on writes prevents thrash on each keystroke.

### `handoffAltScreen` vs `handoffRawMode`

The Ink renderer holds the terminal's alt-screen buffer. When the user opens a worker, we **don't unmount and re-mount the alt-screen** — that would trigger flicker. Instead `handoffAltScreen()` (cli_inner_pretty.js:164874-164876) pauses the renderer and marks the alt-screen as "owned" by whoever the next consumer is (the worker's PTY). On Windows, raw-mode handling is also explicit (`handoffRawMode`).

When the user detaches and we remount, we `forceRedraw()` (cli_inner_pretty.js:164838) to repaint the dashboard's frame.

## `FleetViewDashboard` State Hooks

The component has ~30 `useState`/`useRef` calls. The important ones, grouped by purpose:

### Job list and polling

```javascript
let [jobs, setJobs] = useState(IN_MEMORY_JOBS_CACHE);     // In6 — list of all known jobs
let [peerJobs, setPeerJobs] = useState([]);               // jobs from peer (non-bg) processes
let [logTails, setLogTails] = useState({});                // sessionId → 200-char tail
let [prStatuses, setPrStatuses] = useState(GLOBAL_PR_CACHE);   // PR url → checks/state
let [loopKicks, setLoopKicks] = useState(GLOBAL_LOOP_KICKS);   // session-cron schedule data
```

The polling driver is `p9()` (a `useCallback` at cli_inner_pretty.js:567446). It:
1. Reads disk: `oKH()` (job records) + `HN4()` (shorts metadata).
2. Joins them via `H56(HBK(d8, X6.records), X6.shorts)`.
3. Filters out *killed-in-UI* jobs (`gK.current`) — these are jobs the user just killed but the disk record may not yet reflect.
4. Computes `activity` (`qG8`) for each from prStatuses.
5. Compares to prior list and **skips setState if identical** (deep equals on a small field set: `id`, `updatedAt`, `state`, `pinned`, `activity`).
6. For jobs that have `output` (the `HT$` predicate), reads the output snapshot file's mtime — only re-parses if mtime changed.
7. Extracts PR URLs from `state.children` and batches a single GitHub API call to refresh PR statuses (rate-limited per `Ug4`).

The polling loop runs every **2000ms** via `T1(p9, 2000)` (cli_inner_pretty.js:567599). `T1` is the project's `useInterval` analog — it auto-cleans the timer on unmount.

### Search/filter input

```javascript
let { query, queryRef, setQuery, cursorOffset, setCursorOffset,
      handleKeyDown, handlePaste } = AG({ initialQuery: K, isActive, multiline, ... });
```

`AG` is the project's text-input hook (used in many places). It returns a controlled-input bundle. The search query feeds three derived computations:

- **Direct filter (`DQ4`)**: parses tokens like `template:bg state:working` and matches against jobs.
- **Suggestion match (`Tn6`)**: looks for `@mention` / `/skill` / template-name completions.
- **Exact-match (`Zn6`/`Gn6`)**: matches a PR/frame URL exactly to a single job for click-through.

The query and the collapsed-set are persisted via a 300ms debounced effect (`lM(...)` at cli_inner_pretty.js:567262-567270).

### Group mode and collapsed state

```javascript
let [groupMode, setGroupMode] = useState(() => initialGroupMode ?? readConfig("fleetViewGroupMode") ?? "state");
let [collapsed, setCollapsed] = useState(() => new Set(_));   // collapsed group keys
let [recentlyExpanded, setRecentlyExpanded] = useState(() => new Set());  // M$
let toggleCollapsed = (group) => setCollapsed(d => {
  let next = new Set(d);
  if (next.has(group)) next.delete(group);
  else { next.add(group); setRecentlyExpanded(...); }
  return next;
});
```

`groupMode` is either `"state"` (group by review/blocked/working/done) or `"cwd"` (group by working directory). Persisted in user config so it survives restarts. The collapsed set is **per-cwd** in localStorage but **session-only** in memory — the `lB4`/`rB4` pair persists it under the current `cwd` key.

### Focus and selection

```javascript
let [focusedIdx, setFocusedIdx] = useState(0);        // a — index into the rendered list
let [focusedJobId, setFocusedJobId] = useState(null); // MH — derived for stable identity
let [expanded, setExpanded] = useState(false);        // e — full-screen panel mode
let [renamingJobId, setRenamingJobId] = useState(null);  // FH — currently renaming
let [deleteArmed, setDeleteArmed] = useState(null);   // N4 — ctrl+x first press
let [editingError, setEditingError] = useState(null); // I9 — last error to show
```

The focus model:
- The list is virtualized only by `EB` (a `<Box>` with `stickyScroll`), not by index.
- `focusedIdx` indexes into the **flat rendered list** (`QH` after sort + dedup + group-headers + fold-rows).
- Hover (mouse enter) triggers `qK()` which sets `focusedJobId` AND `focusedIdx`. Click triggers `LW(job)`.
- The `expanded` panel (`bo5`) is opened on space-on-empty, and renders the full job log + reply input.
- `renamingJobId` puts the job in inline-rename mode, with a separate text-input bundle (the `AG({ isActive: FH !== null })` instance).
- `deleteArmed` holds the just-armed-delete state (Ctrl+X first press); a 2-second `lM(...)` auto-disarms.

### Reply drafts

```javascript
let replyDrafts = useRef({});       // $H — { jobId: draft text }
let [replyError, setReplyError] = useState(null);    // zH — {id, error}
```

When the user enters reply mode on a focused job, the text is held in `replyDrafts.current[jobId]`. This survives focus switches — switching to another job and back preserves the draft. The reply is sent via `kP8(jobId, text, state)`, which writes to the messaging socket (see [rv_socket_protocol.md](./rv_socket_protocol.md) §"Control Socket Ops").

### Auto-relaunch on upgrade

```javascript
let { columns: LH, rows: BH } = s8();        // terminal size
let { autoUpdateSucceeded: d$ } = appState;
let lastAutoRelaunchAt = Number(process.env.CLAUDE_AGENTS_AUTO_RELAUNCHED_AT) || 0;

T1(() => {
  if (Date.now() - lastAutoRelaunchAt < OQ4 /* 6h */) return;
  if (Date.now() - lastForegroundUseAt() < tZ8 /* 1h */) return;
  Lw("auto");   // exec the new binary
}, d$ && !terminalFocused ? tZ8 : null);   // only when terminal blurred + autoupdate done
```

The dashboard auto-relaunches to the new binary when:
- An auto-update has completed in the background.
- The user's not actively using the terminal (window unfocused).
- ≥1h since last foreground use.
- ≥6h since last auto-relaunch (prevents thrash).

This is what makes "fleet view always runs the latest" work — the next time you alt-tab away, the dashboard re-execs.

## Rendered Tree

The render output is roughly:

```
<Box ref onKeyDown={Yv} onPaste={SS} onWheel={...}>
  <ScrollView ref={VH} flexGrow=1 stickyScroll>
    <Box gap=2 marginBottom=1>
      {LH >= 70 && <LogoBlock />}                           {/* LQ */}
      <Box flexDirection="column">
        <Text><Text bold>Claude Code</Text> <Text dim>v{ZJ}</Text></Text>
        <Text dim>{model} · {cwdShort}</Text>
        <Text dim>{N awaiting input · M working · K completed}</Text>
      </Box>
    </Box>

    {QH.map(item => {                                       /* flat list of headers/folds/jobs */
      if (item.kind === "header") return <GroupHeader />;
      if (item.kind === "fold")   return <FoldRow />;       /* "… N more" */
      return <JobRow job={item.job} isFocused logTail={…} status childRows … />;
    })}

    {emptyState && <EmptyStateHint />}
    {noMatch  && <Text dim>no sessions match</Text>}
  </ScrollView>

  <Box flexShrink=0 flexDirection="column" marginTop=1>
    <Box position="absolute" marginTop=-1 ...>              {/* update-banner overlay */}
      <UpdateBanner />
    </Box>
    {suggestions && <SuggestionList />}                     {/* @-mention popover */}
    <Box flexDirection="column" borderStyle="round" ...>
      <TextInput query={CH} ... placeholder="start a task in the background" />
    </Box>
  </Box>

  {showHelp        ? <HelpFooter ... />
   : showInspector ? <InspectorBar job={AK} />
   : <Box flexShrink=0 paddingLeft=2 height=1>{statusLine}</Box>}

  <AutoUpdaterBanner ... />

  {expanded && AK && (
    <Box position="absolute" bottom=0 left=0 right=0 flexDirection="column" opaque>
      <ExpandedJobPanel job={AK} renaming replyDrafts onBack onAttach onReply childRows ... />
    </Box>
  )}
</Box>
```

### `JobRow` (`Fo5`)

Per worker. Props:
```typescript
{
  job, isFocused, isOrigin, logTail, cols, status, loopKickCount, age, childRows,
  renaming?: { draft, cursor }, deleteArmed?: { justKilled }, attaching: boolean,
}
```

Renders (left to right):
- Status dot (colored by `og4[bucket]`)
- Name or intent (truncated to `cols - ~30`)
- A live log-tail mini-stream (200 chars, truncated to fit)
- Age timestamp (`yn6` = relative duration formatter)
- Pin glyph if `state.pinned`
- Child rows (sub-tasks like cron schedules) below the main line

The component subscribes to `state.children?.[].href` hyperlinks via the Ink hyperlink protocol (`onHyperlinkClick` registered at cli_inner_pretty.js:567696-567709). Clicking a PR URL inside a row opens it in the browser (via `s4(url)`) — `file:` URLs open the editor via `rMH(filePath)`.

### `ExpandedJobPanel` (`bo5`)

A full-screen overlay shown when the user presses `space` on an empty search. Props:
```typescript
{
  job, renaming, replyDrafts, replyError, onReplyError, status, isPending, deleteArmed,
  onBack, onAttach, onReply, childRows, isTerminalFocused
}
```

Renders the job's last ~50 lines of output, the child tasks tree, a status footer, and an integrated reply input. The reply input is bound to `onReply`, which calls the messaging-socket bridge (`kP8`) and refreshes state.

The optimistic-update pattern is visible in the reply handler (cli_inner_pretty.js:568830-568867): on send, the local state is updated *before* the daemon confirms, so the UI feels immediate. If the send fails, the state is rolled back; if it succeeds, the next poll cycle replaces the optimistic value with the daemon's authoritative value.

## Keyboard Dispatch Hierarchy

Input is routed through three layers, all defined on the root `<Box onKeyDown>`:

1. **`Y6`** (`Dn6` voice-handler) — handles voice-recording keys (push-to-talk, etc.). Sits at `onKeyDownCapture` (capture phase). Forwards to the next layer if not handled.
2. **`Yv` / `_8H`** (the main dashboard handler) — handles arrows, Enter, Ctrl+X, Ctrl+R, Ctrl+T, Ctrl+S, `?`, Space-on-empty, etc.
3. **`K8`** (the input's own `handleKeyDown`) — fallback for typing characters into the search/query input.

The chain `Y6 → Yv → K8` means voice has priority, then dashboard shortcuts, then character input. Each layer can `return` early to consume the event.

### Key bindings (selection)

| Key | Action | Where (line) |
|-----|--------|-------------|
| `↑`/`↓` | Move focus | `Yv` arrow handler |
| `←` | Quit dashboard (return `{type:"done"}`) | `hH = _I(NH, JH)` |
| `→` | Attach to focused (if origin job) | implicit in `LW` |
| `Enter` | Open/create/resume — depends on context | `LW(AK)` or dispatch |
| `Space` | Toggle expanded panel (if no input) | `onSpaceOnEmpty` in `AG` config |
| `Ctrl+X` | Delete (armed); double-press confirms | inside `Yv` `L$.ctrl && L$.key === "x"` |
| `Ctrl+R` | Rename focused job | sets `setRenamingJobId(AK.id)` |
| `Ctrl+T` | Pin/unpin focused | toggles `state.pinned` and persists |
| `Ctrl+S` | Switch group mode (state ↔ cwd) | toggles `groupMode` and persists |
| `Ctrl+C` (2x) | Exit | confirm via `setExitConfirmActive` |
| `?` | Toggle help footer | `setShowHelp(h => !h)` |
| `@` | Show mentions popover | feeds `R8` suggestion list |
| `/` | Show skills popover | same |
| `Alt+1..9` | Quick-attach to origin job | `altOpenCount` in footer |
| `Esc` | Cancel rename / clear query / quit panel | layered |

## Grouping and Sorting Logic

The flat render list (`QH`) is computed via:

```javascript
let allJobs = bgJobs.concat(peerJobs);                     // TD
let filtered = cwdFilter ? allJobs.filter(...) : allJobs;  // Av
let matched = filtered.filter(j => queryPredicates.every(p => p(j)));  // zv
let combined = recentlyDeleted.length
  ? deduplicateById([...recentlyDeleted, ...matched])
  : matched;                                                // Z9

let groupKeys = new Map(combined.map(j => [j.id, computeGroupKey(j)]));  // Q1
let sortedJobs = combined.sort((a, b) => {
  // pinned first
  // by group order
  // by group-specific sort key (recency, etc.)
  // by createdAt desc as tiebreak
});

// Then fold groups whose collapsed=true → emit a "fold" row instead of all members
// Then inject "header" row before each group's first member
```

The "fold" behavior triggers when a group has more rows than the viewport can show *and* the user hasn't expanded it. The threshold is `aH + ag4` rows (cli_inner_pretty.js:567774-567780), where `ag4 = 3` is the minimum fold-savings.

### State-bucket mapping (`byH` / `classifyState`)

```javascript
// Conceptual:
function classifyState(state, statusOverride) {
  if (statusOverride === "busy") return "working";
  if (state.tempo === "blocked") return "blocked";
  if (state.state === "review")  return "review";
  if (state.state === "done" || state.state === "settled") {
    if (state.inFlight?.tasks > 0 && !state.inFlight.kinds.every(k => isBgShell(k))) return "working";
    return "done";                 // v2.1.141 completed-classification
  }
  if (state.state === "working")  return "working";
  return "working";
}
```

The v2.1.141 completed-vs-working classification (see [completed_vs_working.md](./completed_vs_working.md)) lives in this function — a job with `state=done` and only background shells running goes to "Completed" rather than "Working."

## Cross-Validation with v2.1.88

v2.1.88 **has no equivalent component**. There's no fleet-view dashboard. The remote-agent UI (`RemoteAgentTask`) renders inline within the main REPL as a regular tool block; there's no separate dashboard surface.

The closest precedent in v2.1.88 is `src/screens/` with various headless screens for tasks like history, status, etc. — but they're single-shot pickers, not interactive dashboards with live polling and PTY hand-off.

The fleet-view dashboard is **entirely new in v2.1.139** (mid-rollout v2.1.115–v2.1.139, finalized as a "Research Preview" in v2.1.139). Subsequent v2.1.140–v2.1.142 changes were polish (color palette segregation, completed-classification, empty-idle retire, worktree recognition, attacher-caps).

## Performance Notes

The dashboard is performance-sensitive — it polls every 2s, can show 50+ jobs, and runs alongside the user's main session. Optimizations:

1. **Identity-stable poll**: `p9()` skips `setState` if the joined list is equal field-by-field. Avoids reconciliation when nothing changed.
2. **Log-tail mtime check**: re-parses output snapshot only when the file's mtime changed.
3. **PR batch fetcher**: gathers all `child.href` URLs once per `Ug4` interval (varies with network freshness) and issues one batched GraphQL request.
4. **Render memoization** (`useMemo`): `vM` (token parse), `Q1` (group keys), `Az`/`VM` (template lookups).
5. **`useReducer((x) => x + 1, 0)`**: tracks "force refresh" — used by mention-popover updates that need to re-render without state change.
6. **Cache pollution avoidance**: spare-worker fetch and PR fetch both check `tengu_fleetview_pr_batch` gate before running the batch path.
7. **Sticky scroll**: the scrollview's `stickyScroll` keeps the focused item in view without manual scroll-into-view code.

The mount logs `[PERF:bg-remount-start]` and `[PERF:bg-remount-end]` (cli_inner_pretty.js:567594-567595) so end-to-end mount time can be measured. Mount times >100ms are typically caused by `oKH()` reading a large `~/.claude/bg-sessions/` tree — the system tolerates this because mount happens at most ~once per attach cycle.

## Failure Modes

| Failure | Surface |
|---------|---------|
| Daemon not responding to attach | `attachJob` returns `{ kind: "error", msg }`; banner `D` shows it next mount |
| Worker crashed mid-attach | `respawnIfNeeded` returns `{ alive: false }`; banner shows "press Enter to respawn" |
| State file unreadable | `p9` returns no jobs; dashboard shows empty state |
| PR API rate-limited | PR status shows `null`; row renders without checks badge |
| Cwd disappeared | Cwd-filter mismatch silently — job hidden |
| Worktree branch mismatched | Job kept, marked with cwd column annotation |
| Auto-update mid-mount | Dashboard re-execs into new binary at next idle (`Lw("auto")`) |
| Output snapshot truncated | Log-tail shows partial; next mtime change re-fetches |
