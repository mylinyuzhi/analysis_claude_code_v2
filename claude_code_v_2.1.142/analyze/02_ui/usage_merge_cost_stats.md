# `/usage` Merge of `/cost` and `/stats` (v2.1.118)

## What changed

Before v2.1.118, three distinct commands existed:

- `/cost` — show session cost summary (USD, durations, lines
  added/removed).
- `/stats` — show usage statistics (per-tier rate limits, daily/weekly
  utilization).
- (no unified entry point combining both)

v2.1.118 merges these into a single `/usage` command with `/cost` and
`/stats` as aliases. The unified UI shows session cost, plan usage,
and activity stats in one dashboard.

The legacy commands work as aliases — typing `/cost` or `/stats`
launches the same `/usage` dialog. This preserves muscle memory and
avoids "command not found" errors during the transition.

## Source: command definition

```javascript
// ============================================
// usageCommandDef - unified /usage with /cost /stats aliases
// Location: cli_inner_pretty.js:481069-481090
// ============================================

// ORIGINAL (for source lookup):
nB6 = {
  type: "local-jsx",
  name: "usage",
  aliases: ["cost", "stats"],
  description: "Show session cost, plan usage, and activity stats",
  thinClientDispatch: "control-request",
  immediate: !0,
  requires: { ink: !0 },
  load: () => Promise.resolve().then(() => (aX4(), oX4)),
};
iB6 = {
  type: "local",
  name: "usage",
  aliases: ["cost", "stats"],
  supportsNonInteractive: !0,
  description: "Show the total cost and duration of the current session",
  isEnabled: () => T6(),
  get isHidden() { return !T6(); },
  load: () => Promise.resolve().then(() => (tX4(), sX4)),
};

// READABLE (for understanding):
const usageCommandDef = {
  type: "local-jsx",
  name: "usage",
  aliases: ["cost", "stats"],        // ← legacy commands route here
  description: "Show session cost, plan usage, and activity stats",
  thinClientDispatch: "control-request",   // remote sessions dispatch via control-request
  immediate: true,                          // don't suspend the input box while loading
  requires: { ink: !0 },                    // needs the Ink renderer (TUI)
  load: () => Promise.resolve().then(() => (loadUsageCommand(), usageCommandExports)),
};

const usageCommandDefHeadless = {
  type: "local",                            // headless / non-interactive variant
  name: "usage",
  aliases: ["cost", "stats"],
  supportsNonInteractive: true,             // works in --print mode, no terminal
  description: "Show the total cost and duration of the current session",
  isEnabled: () => isUsageHeadlessEnabled(),
  get isHidden() { return !isUsageHeadlessEnabled(); },
  load: () => Promise.resolve().then(() => (loadUsageHeadlessCommand(), usageHeadlessExports)),
};

// Mapping: nB6→usageCommandDef, iB6→usageCommandDefHeadless,
//          aX4/oX4→usage TUI module exports,
//          tX4/sX4→usage headless module exports,
//          T6→isUsageHeadlessEnabled
```

The dual definition (TUI + headless) lets `/usage` work in both
interactive and non-interactive modes:

- **Interactive (`local-jsx`)**: opens the dashboard UI.
- **Headless (`local`, `supportsNonInteractive`)**: prints
  cost+duration summary to stdout. Used by `claude --print /usage` and
  by SDK calls that don't have a terminal.

## Source: usage tab system

The unified UI uses tabs to organize content. From the rendering
side, the relevant ink-tabs structure (cli_inner_pretty.js:440678):

```javascript
const tabs = [
  /* …Plan, Activity, Rate Limits tabs… */
  /* The original /cost content lives in this "Usage" tab */
  React.createElement(Tab, { key: "usage", title: "Usage" },
    React.createElement(UsageTabContent, null)
  ),
];
```

Inside `UsageTabContent`, the same data that `/cost` historically showed
is rendered as a structured table:

- Session cost (USD, total)
- Duration (total wall-clock + API time)
- Lines added / removed
- Cache hit ratio (when caching is on)

The Plan tab pulls from the same data source as the legacy `/stats`:

- 5-hour bucket utilization
- 7-day bucket utilization
- Reset times

## Source: status line `rate_limits` shape (paired data source)

The dashboard's "Plan usage" tab reads from the same backend data that
populates the status line JSON's optional `rate_limits` field:

```javascript
// ============================================
// statusLine rate_limits payload
// Location: cli_inner_pretty.js:535623-535630 (within buildStatusLinePayload)
// ============================================

const rateLimitsRaw = getRateLimitsRaw();
const rateLimits = {
  ...(rateLimitsRaw.five_hour && {
    five_hour: {
      used_percentage: rateLimitsRaw.five_hour.utilization * 100,
      resets_at:       rateLimitsRaw.five_hour.resets_at,
    },
  }),
  ...(rateLimitsRaw.seven_day && {
    seven_day: {
      used_percentage: rateLimitsRaw.seven_day.utilization * 100,
      resets_at:       rateLimitsRaw.seven_day.resets_at,
    },
  }),
};
```

`/usage` reads the same `rateLimitsRaw` source — there's no
duplication.

## Why this approach

### Why merge into `/usage` rather than keep three commands?

**What:** Pre-2.1.118 had `/cost` and `/stats` as separate commands.
v2.1.118 introduces `/usage` and demotes the original two to aliases.

**Why:**

- The two commands' content was tightly related. Users opening `/cost`
  also wanted to see rate-limit status; vice versa. A unified dashboard
  reduces friction.
- Aliases preserve muscle memory — typing `/cost` still works.
- The new name `/usage` is more discoverable: it doesn't lock the
  command into a single dimension (cost) when the dashboard covers
  cost + rate limits + activity.
- One command to maintain. The aliases route to the same lazy-loaded
  module.

### Why preserve aliases rather than alias-and-deprecate?

**What:** `aliases: ["cost", "stats"]` — both old names still work,
and they're documented.

**Why:**

- Removing them would break scripts, documentation, and muscle memory.
- The alias mechanism is zero-cost — the command dispatcher resolves
  aliases at registration time.
- New documentation can mention `/usage` first; old documentation
  still works.

### Why a headless variant alongside the TUI variant?

**What:** Two registrations: `local-jsx` (TUI) and `local` (headless),
both with `name: "usage"` and the same aliases.

**Why:**

- `claude --print /usage` should work — no terminal, just dump the
  summary.
- SDK callers might fetch usage as a JSON or text body without
  spinning up a renderer.
- The two variants share command name + aliases, so the user typing
  the command doesn't think about which mode they're in — the
  framework picks based on terminal/non-terminal detection.

### Why `thinClientDispatch: "control-request"` for the TUI variant?

**What:** The TUI variant has `thinClientDispatch: "control-request"`.

**Why:**

- Remote sessions (where the client is a thin renderer talking to a
  daemon) need a way to tell the daemon to *show* the usage dialog
  rather than fetch data and render locally.
- The control-request dispatch sends the command intent to the daemon
  via the control channel; the daemon constructs the dashboard and
  pushes back the render directives.
- This is the same pattern used by other dashboard-shaped commands
  (`/skills`, `/mcp`, etc.).

### Why `immediate: true`?

**What:** The TUI variant has `immediate: true` — the dispatcher
doesn't wait for any inflight model turn to finish before showing the
dialog.

**Why:**

- The usage dashboard is *passive* — it doesn't modify session state,
  it just reads stats.
- Forcing the user to wait for a long-running model turn to finish
  before viewing their cost would defeat the purpose ("is this
  request going to put me over budget? let me check").
- The dashboard's data is read-only and doesn't conflict with an
  inflight request.

## Cross-validation: pre-2.1.118 vs 2.1.118

| Aspect | Pre-2.1.118 | v2.1.118+ |
|--------|-------------|-----------|
| `/cost` command | Standalone | Alias to `/usage` |
| `/stats` command | Standalone | Alias to `/usage` |
| `/usage` command | n/a | New unified entry |
| Dashboard tabs | n/a | Cost, Plan usage, Activity |
| Headless mode | `--print /cost` only | `--print /usage` (also `/cost`/`/stats`) |
| Remote dispatch | Local-only | Control-request for TUI variant |
| Data sources | Two parallel | Same backend, unified consumer |

## Cross-references

- The Plan tab consumes the same `rate_limits` data the status line
  exposes (see
  [../19_think_level/status_line_effort_thinking.md](../19_think_level/status_line_effort_thinking.md)).
  Both surfaces share `getRateLimitsRaw()`.
- The Activity tab reads from the session message counts and tokens
  used — same source as `cost.total_*`.

## Related symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Slash Commands
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions/objects in this document:
- `usageCommandDef` (`nB6`) — TUI variant; cli_inner_pretty.js:481069-481078
- `usageCommandDefHeadless` (`iB6`) — non-interactive variant; cli_inner_pretty.js:481079-481090
- `isUsageHeadlessEnabled` (`T6`) — gate for the headless variant
- `getRateLimitsRaw` (`LY$`) — shared data source
- `buildStatusLinePayload` (`mU5` surrounds) — parallel consumer of `rate_limits`
