# `/workflows` Detail View — `f`-Key Status Filter (v2.1.183 → v2.1.193)

> Type: NET-NEW UI-state delta (filter state + cycle + key handler + footer hint) on an otherwise CARRYOVER detail component. Version: **2.1.186**.
> TARGET: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`. Lines are **193** unless tagged *(183)*.
> CANONICAL for the detail component (unchanged shell): [`../../../claude_code_v_2.1.183/analyze/42_workflow/README.md`](../../../claude_code_v_2.1.183/analyze/42_workflow/README.md).

## TL;DR

The `/workflows` agent-detail view (the Ink/React component that lists a workflow run's agents with `j`/`k`/`x`/`r`/`p`/`s`/`esc` controls) is carryover. 2.1.186 layers a single new control on top: pressing **`f`** in the agents view cycles a **status filter** through `all → running → queued → failed → done → skipped → interrupted → all`, **skipping any status no agent currently has**, and reflects the active filter in the footer (`f filter: running`). The filter narrows the rendered agent list via a `useMemo`; everything else about the component is unchanged.

---

## The delta: filter state, filtered list, cycle, key, hint

**What it does.** Adds a `statusFilter` piece of component state (`"all"` by default), a memoized filtered agent list, a `f`-key handler that cycles the filter, and a footer hint showing the active filter.

**How it works (the five pieces).**

### 1. State + filtered list

```javascript
// ============================================
// workflowDetail status filter - state + memoized filtered agent list
// Location: cli_inner_pretty.js:542947 (state), 542951-542954 (filtered useMemo)
// ============================================

// ORIGINAL (for source lookup):
    [P, O] = sP.useState("all"),
    // ... D = clampedSelectionIndex, M = currentModel, U = isRunning ...
    F = sP.useMemo(() => {
      if (!M || P === "all" || S === "phases") return M;
      return { ...M, agents: M.agents.filter((Ke) => D$e(Ke, U) === P) };
    }, [M, P, S, U]),

// READABLE (for understanding):
    [statusFilter, setStatusFilter] = useState("all"),                  // P / O
    // ...
    filteredModel = useMemo(() => {
      if (!model || statusFilter === "all" || view === "phases") return model; // no filter in phases view / "all"
      return { ...model, agents: model.agents.filter(a => agentStatus(a, isRunning) === statusFilter) };
    }, [model, statusFilter, view, isRunning]),

// Mapping: P→statusFilter, O→setStatusFilter, F→filteredModel, M→model, S→view, U→isRunning,
//          D$e→agentStatus, Ke→agent
```

`D$e` (`agentStatus`, `cli_inner_pretty.js:541975`) derives a single status token (`running`/`queued`/`failed`/`done`/`skipped`/`interrupted`) for an agent given the run's `isRunning` flag. The filter is a no-op when `statusFilter === "all"` or when the user is in the `"phases"` sub-view (filtering only makes sense over the flat agent list), in which case the unfiltered `model` is returned. Everywhere else the rendered list uses `filteredModel` instead of `model`.

### 2. The cycle function — skip statuses with no agents

```javascript
// ============================================
// cycleStatusFilter - advance the filter to the next status that some agent actually has
// Location: cli_inner_pretty.js:543007-543021
// ============================================

// ORIGINAL (for source lookup):
  function pe() {
    if (!M || v) return;
    let Ke = new Set(M.agents.map((Dt) => D$e(Dt, U)));
    (O((Dt) => {
      let Qt = eYt.indexOf(Dt);
      for (let Xn = 0; Xn < eYt.length; Xn++) {
        Qt = (Qt + 1) % eYt.length;
        let dt = eYt[Qt];
        if (dt === "all" || Ke.has(dt)) break;
      }
      return eYt[Qt];
    }),
      _(0),
      te());
  }

// READABLE (for understanding):
  function cycleStatusFilter() {
    if (!model || transcriptOpen) return;                              // v = a modal/transcript is open → ignore f
    let present = new Set(model.agents.map(a => agentStatus(a, isRunning))); // statuses that actually occur now
    setStatusFilter(prev => {
      let idx = FILTER_ORDER.indexOf(prev);                           // eYt
      for (let step = 0; step < FILTER_ORDER.length; step++) {
        idx = (idx + 1) % FILTER_ORDER.length;                        // advance, wrapping
        let candidate = FILTER_ORDER[idx];
        if (candidate === "all" || present.has(candidate)) break;     // stop on "all" or a non-empty status
      }
      return FILTER_ORDER[idx];
    });
    resetScroll(0);          // _(0)
    resetSelection();        // te()
  }

// Mapping: pe→cycleStatusFilter, M→model, v→transcriptOpen, U→isRunning, D$e→agentStatus,
//          O→setStatusFilter, eYt→FILTER_ORDER, _→resetScroll, te→resetSelection
```

The cycle order is the constant `eYt` (`cli_inner_pretty.js:543272`):

```javascript
// ============================================
// FILTER_ORDER - the f-key status cycle order
// Location: cli_inner_pretty.js:543272
// ============================================

// ORIGINAL (for source lookup):
  eYt = ["all", "running", "queued", "failed", "done", "skipped", "interrupted"];

// READABLE (for understanding):
  FILTER_ORDER = ["all", "running", "queued", "failed", "done", "skipped", "interrupted"];

// Mapping: eYt→FILTER_ORDER
```

### 3. The key handler + footer hint

```javascript
// ============================================
// workflowDetail - f key binding (agents view only) + footer hint
// Location: cli_inner_pretty.js:543081 (key), 543117 (label), 543128 (hint)
// ============================================

// ORIGINAL (for source lookup):
      else if (Ke.key === "f" && S === "agents") (Ke.preventDefault(), pe());
      // ...
  let rt = P !== "all" && S !== "phases" ? XOo[P].toLowerCase() : void 0,
    _t = [];
      // ... other footer items pushed ...
  if (S === "agents" && nt) _t.push(rt ? `f filter: ${rt}` : "f filter");

// READABLE (for understanding):
      else if (key.name === "f" && view === "agents") { key.preventDefault(); cycleStatusFilter(); }
      // ...
  let activeFilterLabel = statusFilter !== "all" && view !== "phases" ? STATUS_LABELS[statusFilter].toLowerCase() : undefined, // XOo
    footer = [];
      // ... select / x stop / r restart / p pause / esc back / s save ...
  if (view === "agents" && hasAgents) footer.push(activeFilterLabel ? `f filter: ${activeFilterLabel}` : "f filter");

// Mapping: Ke.key→key.name, S→view, pe→cycleStatusFilter, P→statusFilter, XOo→STATUS_LABELS, rt→activeFilterLabel, nt→hasAgents
```

`XOo` (`STATUS_LABELS`, `cli_inner_pretty.js:543273`) maps each status to a display label — `{ queued:"Queued", running:"Running", done:"Completed", failed:"Failed", skipped:"Skipped", interrupted:"Stopped" }` — and the footer shows `f filter: <label>` when a non-`all` filter is active, otherwise the bare hint `f filter`. The `f` binding is gated to `view === "agents"`, so it does nothing in the phases sub-view.

**Why this approach.**

- **Cycle that skips empty statuses.** Rather than a multi-key menu or a free-text filter, `f` is a single cycle key — minimal UI surface for a TUI. The clever part is the inner loop computing the `present` set first and `break`ing only on `"all"` or a status that *some agent currently has*: this means `f` never lands on a filter that would show an empty list (e.g. it skips `skipped` if no agent was skipped). `"all"` is always reachable (the explicit `candidate === "all"` allow), so the user can always cycle back to the unfiltered view. The loop bound `FILTER_ORDER.length` guarantees termination even if `present` is empty (it lands back on the current value or `"all"`).
- **Filter as a `useMemo` over a derived list, not a mutation.** The component keeps `model` immutable and derives `filteredModel` — so selection-index clamping, scroll, and rendering all consume one filtered view, and the filter recomputes only when `model`/`statusFilter`/`view`/`isRunning` change. Cycling also resets scroll and selection (`_(0)`, `te()`) so the cursor never points past the (now shorter) filtered list.
- **Footer reflects state.** Surfacing the active filter in the footer (`f filter: running`) is the only affordance telling the user the list is filtered — important because a filtered empty-ish list could otherwise look like "no agents."

**Key insight.** This is a thin, self-contained presentation-layer delta: a piece of `useState`, a `useMemo`, a cycle function, one key binding, and one footer string. It does not touch the workflow runtime, agent status derivation (`D$e` is carryover), or any of the existing controls — it only changes *which* agents the existing list renders.

---

## Evidence note (NET-NEW filter on a CARRYOVER host)

The host detail component existed in 183 with identical `j`/`k`/`x`/`r`/`p`/`s`/`esc` handlers and the same status-label map (`done:"Completed"`, `interrupted:"Stopped"`). The filter is purely additive. Grep-count diff (whole-bundle `grep -c`, 183 → 193):

| Token | 183 | 193 | Verdict |
|-------|----:|----:|---------|
| cycle array `["all","running","queued",…]` | 0 | 1 | NET-NEW |
| `key === "f" && S === "agents"` handler | 0 | 1 | NET-NEW |
| `"f filter"` footer hint | 0 | present | NET-NEW |
| `useState("all")` (the filter state) | 1 | 2 | +1 (the new filter state) |
| `agents.filter` | 3 | 4 | +1 (the new filtered `useMemo`) |
| `D$e` / `agentStatus` derivation | present | present | CARRYOVER |
| detail component shell (j/k/x/r/p/s/esc, label map) | present | present | CARRYOVER |

The 183 key handler had `j`/`k`/`x`/`p`/`s` but **no `f`**. Confirmed: NET-NEW filter, carryover host component.

## Cross-links

- Sibling 193 doc: [`structured_output_call_control.md`](./structured_output_call_control.md) (bullets 1 + 2).
- Module overview: [`README.md`](./README.md).
- 183 canonical workflow tree (detail-component shell, runtime): [`../../../claude_code_v_2.1.183/analyze/42_workflow/README.md`](../../../claude_code_v_2.1.183/analyze/42_workflow/README.md).

## Related Symbols

> Symbol mappings live in the central index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Workflow** is indexed here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (UI components)
> - per-feature additions: [symbol_additions_v2_1_193_workflow.md](../00_overview/symbol_additions_v2_1_193_workflow.md)

Key functions/constants in this document:

- `workflowDetailFilterOrder` (`eYt`, `:543272`) — `["all","running","queued","failed","done","skipped","interrupted"]`; the `f`-key cycle order (NET-NEW; 0 in 183).
- `cycleStatusFilter` (`pe`, `:543007`) — advances `statusFilter`, skipping statuses no agent currently has; resets scroll/selection.
- `agentStatus` (`D$e`, `:541975`) — derives an agent's status token from `(agent, isRunning)` (CARRYOVER).
- `STATUS_LABELS` (`XOo`, `:543273`) — status → display label map (`done→"Completed"`, `interrupted→"Stopped"`).
- filter state `[statusFilter, setStatusFilter]` (`[P, O]`, `:542947`) and filtered list `filteredModel` (`F`, `:542951`); `f` key binding at `:543081`; footer hint at `:543128`.
