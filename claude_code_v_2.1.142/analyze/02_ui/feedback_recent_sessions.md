# `/feedback` Recent-Sessions Scope (v2.1.141)

## What changed

Pre-v2.1.141, `/feedback` submitted a bundle containing **only the
current session's transcript**. Bugs that spanned multiple sessions
(e.g. "this issue keeps happening after I restart") were hard to
report — the relevant context wasn't in the current session.

v2.1.141 adds a scope picker to the feedback flow:

- **This session only** (default — same as pre-v2.1.141).
- **This session + this project's other sessions from the last 24 hours**.
- **This session + this project's other sessions from the last 7 days**.

Selecting a wider scope includes those past sessions' transcripts in
the feedback bundle, after the standard redaction pipeline.

## Source: scope options

```javascript
// ============================================
// FEEDBACK_TRANSCRIPT_SCOPE_OPTIONS - radio choices
// Location: cli_inner_pretty.js:429613-429621
// ============================================

// ORIGINAL (for source lookup):
(Vf5 = {
  session: "this session only",
  day: "this session + this project's other sessions from the last 24 hours",
  week: "this session + this project's other sessions from the last 7 days",
}),
(vf5 = [
  { label: "This session only", value: "session" },
  { label: "This session + the last 24 hours", value: "day" },
  { label: "This session + the last 7 days", value: "week" },
]);

// READABLE (for understanding):
const FEEDBACK_TRANSCRIPT_SCOPE_LABELS = {                        // Vf5
  session: "this session only",
  day:     "this session + this project's other sessions from the last 24 hours",
  week:    "this session + this project's other sessions from the last 7 days",
};

const FEEDBACK_TRANSCRIPT_SCOPE_OPTIONS = [                       // vf5
  { label: "This session only",                value: "session" },
  { label: "This session + the last 24 hours", value: "day"     },
  { label: "This session + the last 7 days",   value: "week"    },
];

// Mapping: Vf5→FEEDBACK_TRANSCRIPT_SCOPE_LABELS, vf5→FEEDBACK_TRANSCRIPT_SCOPE_OPTIONS
```

The two structures differ:

- `FEEDBACK_TRANSCRIPT_SCOPE_LABELS` is a `value → human-text` map
  used for confirmation messaging.
- `FEEDBACK_TRANSCRIPT_SCOPE_OPTIONS` is the radio button list with
  `label`/`value` pairs for the picker.

## Source: feedback command + component

```javascript
// ============================================
// renderFeedbackComponent - mounts the feedback UI
// Location: cli_inner_pretty.js:429623-429640
// ============================================

// ORIGINAL (for source lookup):
function Z74(H, $, q, K = "", _ = {}, A = "post") {
  return zC6.createElement(P74, {
    abortSignal: $,
    messages: q,
    initialDescription: K,
    onDone: H,
    backgroundTasks: _,
    mode: A,
  });
}

async function Ef5(H, $, q) {
  let K = KC6();
  if (K.kind === "disabled") return (H(K.reason), null);
  let _ = q || "";
  return Z74(H, $.abortController.signal, $.messages, _, {}, K.kind);
}

// READABLE (for understanding):
function renderFeedbackComponent(onDone, abortSignal, messages, initialDescription = "", backgroundTasks = {}, mode = "post") {
  return React.createElement(FeedbackComponent, {
    abortSignal,
    messages,
    initialDescription,
    onDone,
    backgroundTasks,
    mode,                     // "post" = submit; "disabled" = show reason and exit
  });
}

async function feedbackCommandEntrypoint(onDone, ctx, query) {
  const availability = getFeedbackAvailability();
  if (availability.kind === "disabled") {
    onDone(availability.reason);
    return null;
  }
  return renderFeedbackComponent(
    onDone,
    ctx.abortController.signal,
    ctx.messages,
    query || "",
    /* backgroundTasks */ {},
    availability.kind,
  );
}

// Mapping: Z74→renderFeedbackComponent, P74→FeedbackComponent,
//          Ef5→feedbackCommandEntrypoint, KC6→getFeedbackAvailability,
//          zC6→React
```

The `FeedbackComponent` is the multi-step UI:
1. Description text area (with optional `initialDescription` from
   `/feedback <text>`).
2. Scope picker (new in v2.1.141) — choose `session`/`day`/`week`.
3. Submit confirmation showing what's in the bundle:
   `- Session transcript: this session + the last 24 hours`.
4. Network submission via authenticated API call to
   `api.anthropic.com/api/claude_cli_feedback`.

## Source: scope label in submit confirmation

```javascript
// ============================================
// Submit confirmation row showing scope choice
// Location: cli_inner_pretty.js:429295 (within FeedbackComponent render)
// ============================================

// ORIGINAL (for source lookup):
b6.createElement(k, null, "- Session transcript:", " ", b6.createElement(k, { dimColor: !0 }, Vf5[B])),

// READABLE (for understanding):
const scopeLabel = FEEDBACK_TRANSCRIPT_SCOPE_LABELS[selectedScope];
<Text>
  - Session transcript:{" "}
  <Text dimColor>{scopeLabel}</Text>
</Text>

// Mapping: b6→React, k→Text, Vf5→FEEDBACK_TRANSCRIPT_SCOPE_LABELS, B→selectedScope
```

So the confirmation step shows:

- `- Session transcript: this session only`
- `- Session transcript: this session + this project's other sessions from the last 24 hours`
- `- Session transcript: this session + this project's other sessions from the last 7 days`

The dim styling on the scope text mirrors the v2.1.136 unified dialog
pattern (chrome dim, content full color).

## Source: feedback command definition

```javascript
// ============================================
// feedbackCommandDef + alias
// Location: cli_inner_pretty.js:429647-429660
// ============================================

// ORIGINAL (for source lookup):
yf5 = {
  aliases: ["bug"],
  type: "local-jsx",
  name: "feedback",
  description: "Submit feedback about Claude Code",
  argumentHint: "[report]",
  isEnabled: () => !0,
  requires: { ink: !0 },
  load: () => Promise.resolve().then(() => (T74(), G74)),
};

// READABLE (for understanding):
const feedbackCommandDef = {
  aliases: ["bug"],
  type: "local-jsx",
  name: "feedback",
  description: "Submit feedback about Claude Code",
  argumentHint: "[report]",
  isEnabled: () => true,
  requires: { ink: true },
  load: () => Promise.resolve().then(() => (loadFeedbackModule(), feedbackExports)),
};

// Mapping: yf5→feedbackCommandDef
```

The `/bug` alias preserves the older command name; `/feedback [report
text]` lets the user start typing the report from the command line
(the text is piped into `initialDescription`).

## Why this approach

### Why include past sessions rather than make the user attach them manually?

**What:** The user selects a time window; the framework auto-includes
matching transcripts.

**Why:**

- Manual attachment would require the user to know where transcripts
  live on disk and how to bundle them. Most users don't know either.
- Auto-inclusion respects the user's intent ("the bug spans multiple
  sessions") without making them do the file munging.
- The redaction pipeline runs on all included transcripts identically
  — manual attachment would risk inconsistent redaction.

### Why time-window scoping rather than per-session selection?

**What:** Two-tier choice (24h / 7d) rather than a checkbox list of
sessions.

**Why:**

- Most bugs that span sessions are about *recent* behavior. A time
  window naturally selects "the relevant recent context."
- A per-session checkbox list would be UX-hostile for users with
  many sessions per day. They'd have to remember which session was
  the problematic one — but if they could, they'd have included it
  in the description.
- The two-tier choice covers the common cases:
  - 24h: "this happened a few times today."
  - 7d: "this has been happening on and off this week."

### Why "this project's other sessions" rather than all sessions?

**What:** The scope is project-local — only sessions started in the
same working directory.

**Why:**

- Cross-project transcripts likely have unrelated content; including
  them adds noise to the report.
- Privacy: a bug report about a work project shouldn't include
  transcripts from a personal project.
- The project boundary (cwd-based) matches how users organize work —
  one bug is usually within one project.

### Why three options rather than two?

**What:** session / day / week, not just session / extended.

**Why:**

- Two granularities (24h vs 7d) give different signal-to-noise tradeoffs.
  Some users want the broader 7d for recurring issues; others want
  the tighter 24h for today-specific issues.
- Three is the discoverable sweet spot — a slider would obscure the
  exact thresholds, more options would induce decision fatigue.

### Why is the scope choice mandatory (not silent default)?

**What:** The feedback flow surfaces the choice; pre-v2.1.141 there
was no choice (always session-only).

**Why:**

- Including transcripts has privacy implications. Asking explicitly
  gives the user agency.
- The summary step shows which scope was chosen, reinforcing
  awareness.
- Defaulting to session-only is the conservative choice; users who
  pick wider scopes have actively opted in.

### Why string-keyed values (`"session"`/`"day"`/`"week"`) rather than numeric?

**What:** The value field uses string keys, not e.g. `0`/`1`/`2`.

**Why:**

- The string values are self-documenting in logs/telemetry.
- Adding new options (e.g. `"month"`) is non-breaking — new strings
  just extend the union.
- Numeric keys would invite encoding bugs (does 0 mean session or
  reset?).

### Why is the new field mounted on `FeedbackComponent` rather than as a separate dialog?

**What:** The scope picker is a step within the existing feedback
flow, not a separate slash command.

**Why:**

- The user's intent is "submit feedback." The scope is a *parameter*
  of that intent, not a separate operation.
- A separate command would force discovery (`/feedback-scope`?),
  multi-command workflow.
- Mounting in `FeedbackComponent` keeps the flow linear: describe →
  scope → submit.

## Cross-validation: pre-2.1.141 vs 2.1.141

| Aspect | Pre-2.1.141 | v2.1.141+ |
|--------|-------------|-----------|
| Feedback bundle scope | Current session only | session / day / week |
| Scope picker UI | Not present | Radio with 3 options |
| Summary step | "- Session transcript: this session" | "- Session transcript: <scope label>" |
| Default scope | session (implicit) | session (explicit default) |
| Cross-session inclusion | n/a | Project-local (cwd match) |
| Redaction | Per-bundle | Same pipeline, applied across all included transcripts |
| Telemetry on scope | n/a | Captured in feedback API call body |

## Related symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Slash Commands
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions/objects in this document:
- `FEEDBACK_TRANSCRIPT_SCOPE_LABELS` (`Vf5`) — value→label map; cli_inner_pretty.js:429613-429616
- `FEEDBACK_TRANSCRIPT_SCOPE_OPTIONS` (`vf5`) — radio options; cli_inner_pretty.js:429617-429621
- `renderFeedbackComponent` (`Z74`) — mounts UI; cli_inner_pretty.js:429625-429634
- `feedbackCommandEntrypoint` (`Ef5`) — async wrapper; cli_inner_pretty.js:429635-429640
- `feedbackCommandDef` (`yf5`) — slash command + `/bug` alias; cli_inner_pretty.js:429647-429660
- `getFeedbackAvailability` (`KC6`) — disabled/post/etc. resolver
- `FeedbackComponent` (`P74`) — multi-step UI
