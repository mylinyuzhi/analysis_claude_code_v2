# Remote Control client surfaces — and three gates that never fire

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

This document covers what a *client* — a phone, `claude.ai/code`, the VS Code extension, the desktop
app — sees, and it opens with the most important finding in the module: **half of the new
`tengu_remote_*` gates in this window are unreachable in the shipped binary**, and three changelog
bullets were anchored on them by the scoping pass.

Almost everything below lives in one 500-line React hook, `useRemoteSession` (`:757100-757600`), whose
`onMessage` frame handler (`:757217-757500`) is the client-side demultiplexer.

---

## 1. Dead and false anchors

[`../00_overview/_raw_asset_diff_193_to_220.md`](../00_overview/_raw_asset_diff_193_to_220.md) already
warns that "a gate can be genuinely new AND unreachable" and gives
`tengu_remote_subagent_frame_nested` as the example. That warning **understates the situation for this
theme**. The six new `tengu_remote_*` gates split as follows:

| Gate | 220 | 193 | Line | Reachable? |
|---|---|---|---|---|
| `tengu_remote_active_goal_adopted` | 3 | 0 | `:757214`, `:757334`, `:757958` | **yes** |
| `tengu_remote_bootstrap_cycle_hidden` | 1 | 0 | `:757247` | **yes** |
| `tengu_remote_model_picker` | 2 | 0 | `:715357`, `:715363` | **yes** |
| `tengu_remote_reply_channel_init` | 2 | 0 | `:757204`, `:757208` | **NO** — `cqt` sentinel |
| `tengu_remote_reply_channel_frame` | 1 | 0 | `:757388` | **NO** — `cqt` sentinel |
| `tengu_remote_subagent_frame_nested` | 1 | 0 | `:757401` | **NO** — `ut` sentinel |

### 1.1 The reply channel is a complete, shipped, dark feature (new finding)

The known dead-gate pattern is a *local* sentinel: `let ut = null; if (ut !== null) { … }` at
`:757390-757391`. The reply channel uses a **module-level** one, which is harder to spot because the
guard and the declaration are 500 lines apart.

```javascript
// ============================================
// replyChannelAdapter - the module-level sentinel that darkens the whole reply channel
// Location: cli_inner_pretty.js:757706-757711
// ============================================

// ORIGINAL (for source lookup):
var yzf,
  xp,
  cqt = null,
  cNS = 60000,
  uNS = 180000,
  gzf = 3;

// READABLE (for understanding):
var reactRuntimeA,
  React,
  replyChannelAdapter = null,      // <- never assigned anything else, anywhere in the bundle
  SOME_TIMEOUT_MS = 60000,
  SOME_LONGER_TIMEOUT_MS = 180000,
  SOME_RETRY_CAP = 3;

// Mapping: cqt→replyChannelAdapter
```

`cqt` occurs **exactly 8 times in the whole 872,596-line bundle**: the declaration at `:757708`, four
`cqt !== null` guards (`:757198`, `:757199`, `:757303`, `:757364`, `:757377`) and three member accesses
that only execute inside those guards (`cqt.hasReplyChannelInit` `:757304`,
`cqt.replyChannelBlockKind` `:757379`). **There is no assignment other than the declaration.**

The consequence is that a fully-built feature is inert:

- `Wr()` (`:757201-757210`), the function that emits `tengu_remote_reply_channel_init` and flips
  `hasRemoteReplyChannel` to `true`, has exactly three call sites — `:757304`, `:757383`, `:757388` —
  and all three are inside `cqt !== null` blocks. **`hasRemoteReplyChannel` can never become true.**
- `$.current = cqt !== null && F.getState().hasRemoteReplyChannel;` (`:757199`) is therefore always
  `false`, and `Tr` (`:757198`) — the seeded reply-channel tool-use id set — is always empty.
- Two UI selectors subscribe to the dead state anyway: `:691732`
  (`G = Ve((we) => we.hasRemoteReplyChannel)`) and `:821784`
  (`BMe = Ve((_t) => _t.hasRemoteReplyChannel)`). Both branches are unreachable.
- The supporting surface is all present and all **220>0 / 193=0**: `hasRemoteReplyChannel` 9/0,
  `seedReplyChannelToolUseIds` 3/0, `replyChannelBlockKind` 3/0, `hasReplyChannelInit` 2/0.

**Why it matters for this tree:** a literal-count audit scores this feature as a large, confident
NET_NEW addition — five distinct 220-only anchors, two telemetry gates, a store field and two UI
consumers. It is dark. The `cqt`-sentinel pattern is the *same* dark-launch idiom as `ut`, one scope
level up, and the lesson generalises: **when a new feature's entry condition is a bare identifier
compared against `null`, resolve that identifier's declaration before writing a word.**

### 1.2 `.207` "desktop-hosted sessions not showing bg agents" — right bullet, dead anchor, real fix elsewhere

> *`.207`: "Fixed Remote Control sessions hosted by the desktop app not showing background agent and
> workflow progress on mobile and web."*

The recorded anchor is `tengu_remote_subagent_frame_nested` (`:757401`), inside the `ut` dead block.
Nothing in that block runs, so it cannot be the fix.

The mechanism that *does* fix it is the `background_tasks_changed` level event
([`transport_and_session_lifecycle.md`](transport_and_session_lifecycle.md) §4), specifically its
**connect-time emission from the SDK/headless host** at `:848974`:

```javascript
lA({ type: "system", subtype: "background_tasks_changed", tasks: aEr(a()) }),
```

That statement sits in the success arm of `initReplBridge(...)` on the non-TUI host path
(`:848850-848979`) — the path a desktop-app-hosted session takes. Its TUI twin is `:738593`. Both are
new (`background_tasks_changed` **220=11 / 193=0**), and the pairing is exactly the bullet's shape: the
TUI host and the desktop host each learned to push the full live-task set the moment a client attaches,
instead of leaving the client to infer it from edges it may have missed.

### 1.3 `.208` / `.212` — `tengu_frame_publish_context` is a FALSE ANCHOR

> *`.208`: "Fixed Remote Control clients attaching to a terminal-hosted session not seeing background
> agents and workflow progress until a task started or stopped."*
> *`.212`: "Fixed the workflow agent grid staying empty for Remote Control clients that join a session
> mid-run."*

The scoping pass recorded `tengu_frame_publish_context` (**220=1 / 193=0**, `:381716`) for both. It has
nothing to do with Remote Control.

```javascript
function wbd() {                                   // isFramePublishContextEnabled
  return Ke("tengu_frame_publish_context", !1);
}
```

Its two consumers are `:381809` and `:382719`, both of the form
`...(wbd() && e.publishContext && { publish_context: e.publishContext })` — i.e. it decides whether a
`publish_context` field rides an **Artifact publish request**. The enclosing module's export table
(`:381645-381687`) settles it: `publishArtifact`, `publishPlanArtifact`, `artifactViewerUrl`,
`composeArtifactPage`, `MAX_ARTIFACT_BYTES`, `ARTIFACT_LIST_SCOPES`, `isFrameLiveSubscribeEnabled`.
"Frame" here is the Artifact runtime's word for a hosted page, not a Remote Control wire frame.

`.208`'s real fix is the same `background_tasks_changed` connect-time emission as §1.2, on the TUI host
(`:738593`) — note the bullet's own wording, *"until a task started or stopped"*, which is a precise
description of an **edge-only** protocol and of exactly what a level signal repairs.

`.212`'s workflow-agent-grid bullet I leave **UNANCHORED**: the grid is workflow state, not task state,
and both anchors recorded for it (this gate and the nested-frame gate) are disproven above. See
[`../42_workflow/`](../42_workflow/) for the workflow side.

---

## 2. Fast mode over the wire (`.218` announcement, `.219` stale status)

> *`.219`: "Fixed Remote Control clients keeping a stale fast-mode status after a model switch,
> reconnect, or failed org check."*
> *`.218`: "Added an announcement when fast mode changes as a result of switching models via
> `/config model=<x>` or Remote Control."* (primary theme: [`../47_models/`](../47_models/))

**Verdict: NET_NEW.** `remote_wire_adopt` **220=1 / 193=0**; `fast_mode_disabled_reason` **220=18 /
193=0**; `fastModeDisabledReason` **220=5 / 193=0**.

### 2.1 2.1.193 published fast-mode state but never adopted it back

`fast_mode_state` is **220=21 / 193=18** — the field was already on the wire in 2.1.193 (18 emission
sites, e.g. `:703118 (193)`, `:704016 (193)`, `:708596 (193)`). What 2.1.193 lacked was a **consumer on
the remote-client side**: `tengu_fast_mode_toggled` has only two sites in 193 (`:547966 (193)`,
`:548014 (193)`), both local — the toggle function and the picker. A phone that connected mid-session,
or reconnected after the terminal had switched models, kept whatever fast-mode badge it had.

2.1.220 adds the adopter at `:757316-757330`:

```javascript
// ============================================
// adoptFastModeFromWire - re-syncs the client's fast-mode badge from init AND result frames
// Location: cli_inner_pretty.js:757316-757330
// ============================================

// ORIGINAL (for source lookup):
        if (
          ((we.type === "system" && we.subtype === "init") || we.type === "result") &&
          we.fast_mode_state !== void 0
        ) {
          let it = we.fast_mode_state !== "off",
            ft = !1;
          if (
            (q((cr) => {
              if (!!cr.fastMode === it) return cr;
              return ((ft = !0), { ...cr, fastMode: it });
            }),
            ft)
          )
            O("tengu_fast_mode_toggled", { enabled: it, source: Ee("remote_wire_adopt"), remote: !0 });
        }

// READABLE (for understanding):
        if (
          ((frame.type === "system" && frame.subtype === "init") || frame.type === "result") &&
          frame.fast_mode_state !== undefined
        ) {
          let wireSaysOn = frame.fast_mode_state !== "off",
            changed = false;
          setAppState((prev) => {
            if (!!prev.fastMode === wireSaysOn) return prev;   // idempotent: no-op when already in sync
            changed = true;
            return { ...prev, fastMode: wireSaysOn };
          });
          if (changed)
            emitTelemetry("tengu_fast_mode_toggled",
              { enabled: wireSaysOn, source: enumTag("remote_wire_adopt"), remote: true });
        }

// Mapping: we→frame, q→setAppState, O→emitTelemetry, Ee→enumTag, it→wireSaysOn, ft→changed
```

**Why two frame types, and why `result` specifically?** The bullet names three triggers and the pair
covers all of them:

| Trigger | Frame that repairs it |
|---|---|
| **reconnect** | `system/init` — sent on every (re)connect handshake |
| **model switch** | `result` — emitted at the end of every turn, so the badge is correct by the next turn boundary at the latest |
| **failed org check** | `result` — the org/entitlement layer (`xji`, `:109461-109466`) can revoke fast mode *asynchronously*, with no user action to hang an event on; the turn boundary is the only reliable re-assert point |

Choosing `result` rather than "any frame carrying the field" is a deliberate rate limit: `stream_event`
frames arrive dozens of times per second and are coalesced into 100 ms batches (`w7y`, `:416216`);
adopting from them would mean a store write per streamed token.

The `!!prev.fastMode === wireSaysOn` early-return is what keeps the telemetry honest — the gate fires
only on an actual flip, so `source: "remote_wire_adopt"` counts *repairs*, not heartbeat-rate re-asserts.

### 2.2 `fast_mode_disabled_reason` — a new wire field with a documented negative space

The `.218`/`.219` work also introduced a *reason* channel alongside the state, **220=18 / 193=0**. Its
schema `.describe()` (`:838271`) is unusually careful about what it does **not** cover:

> `Why fast mode can't serve right now. Absent when nothing blocks it (a request may still choose
> standard speed). A paused-after-rate-limit run is not here; it rides fast_mode_state as 'cooldown'.`

Two design decisions are encoded in one sentence:

1. **Absent ≠ "fast mode is on."** The field answers "is something *blocking* it", not "is it active";
   a client that renders "fast" whenever the reason is absent will be wrong for every standard-speed
   request. Splitting state from reason this way is what lets a UI say *"Fast mode unavailable: your
   organization has disabled it"* rather than just greying a toggle.
2. **Cooldown is state, not a reason.** A rate-limit pause is temporary and self-clearing, so it is
   modelled as a value of `fast_mode_state` (`"cooldown"`); reasons are for conditions the user must
   act on. Putting cooldown in the reason field would have made every transient pause look like a
   configuration problem.

The producers are `:593626` and `:849530`, both of the same shape —
`(n.fast_mode_state = e.fastModeState), (n.fast_mode_disabled_reason = e.fastModeDisabledReason)` —
and the resolver is `z8(...)` at `:849530`. `:738017-738018` puts both onto the periodic `system/init`
frame described in [`security_and_enablement.md`](security_and_enablement.md) §5.

Finally, `tengu_fast_mode_toggled` gained a `remote:` dimension at every site: `remote: CS()` at
`:499814` and `:695246` (the local toggle and the picker, so a local toggle *made from a phone* is
attributable) and `remote: !0` at `:757329`. The `.218` "announcement" bullet is
[`../47_models/`](../47_models/)'s to document; the RC-side contribution is this dimension plus the
adopter above.

---

## 3. Command dispatch from mobile/web

> *`.202`: "Fixed commands sent from Remote Control (mobile/web) into an interactive session failing
> with 'Unknown command'."*

**Verdict: the literal is CARRYOVER; the delta is in the ingress path, and I can bound it but not pin
it to a line.**

`Unknown command` is **220=3 / 193=3** and all three 2.1.220 sites have structurally identical 2.1.193
twins:

| 220 | 193 | What it is |
|---|---|---|
| `:343373` | `:397887 (193)` | the dispatcher's not-found message, with a `Did you mean /X?` suffix from `bpt` (`:343359`) |
| `:343462` | `:397977 (193)` | a `startsWith("Unknown command:")` re-check on the produced messages |
| `:343955` | `:398321 (193)` | `throw new gye(\`Unknown command: ${e}\`)` in the command-object lookup |

What *is* new is the ingress guard the remote message passes through before reaching the dispatcher
(`:414701-414721`). It is a four-stage filter and two of its stages are inside the module's new
uuid-dedup budget (`uuid_dedup_buffer_size`, default 2000, `:415333`):

1. `d7y(s)` → an inbound **control request**, forwarded to a different handler (`i?.(s)`).
2. `!h$s(s)` → not a recognised ingress shape at all; dropped silently.
3. `t.has(uuid)` → *echo* of a message this CLI itself sent; `Ignoring echo`.
4. `r.has(uuid)` → *re-delivery* of an inbound already processed; `Ignoring re-delivered inbound`.
5. Only `s.type === "user"` proceeds (`tengu_bridge_message_received`, `bridge_message_receive`);
   anything else logs `Ignoring non-user inbound message: type=…`.

Both the echo and re-delivery caches are **necessary** because the transport replays
([`transport_and_session_lifecycle.md`](transport_and_session_lifecycle.md) §4 and
[`security_and_enablement.md`](security_and_enablement.md) §4.2 both rely on at-least-once delivery), and
because `--replay-user-messages` is on the worker's own argv (`:545436`).

Since the message literal, the dispatcher and the "did you mean" helper are all byte-equivalent between
builds, **citing `Unknown command` proves nothing for this bullet** — a point the false-delta ledger
already makes. The honest verdict is CARRYOVER at the literal level with the fix somewhere in the
ingress/dispatch handoff that carries no new string.

Note that `.206`'s superficially identical bullet is a *different* and fully anchorable bug — see
[`security_and_enablement.md`](security_and_enablement.md) §3.

---

## 4. `.195` — the provisioning checklist

> *"Improved Remote session startup with a provisioning checklist while the container starts."*

**Verdict: NET_NEW.** `hasStructuredSteps` **220=5 / 193=0**; `sawLiveFrame` 3/0; `hadLiveCycle` 3/0;
`expected_steps` 2/0; `step_status` 1/0; `start_cc` 3/0; `Cloud container provisioning failed`
**220=1 / 193=0**; the metric family `remote_bootstrap` **220=4 / 193=0**.

The transport is a pre-existing frame type — `env_manager_log` is **220=5 / 193=5** — carrying free
text from the container's provisioner. 2.1.220 turns that text stream into a state machine.

**What it does:** builds a four-step checklist from `env_manager_log` frames and renders it while the
cloud container boots, instead of showing a scrolling log line.

**How it works:**

1. `pui(now)` (`:755280-755292`) seeds the state with the default step list
   `M$S = ["provision", "clone", "setup_script", "start_cc"]` (`:755416`), all `pending`, plus five
   bookkeeping flags (`hasStructuredSteps`, `terminal`, `dismissed`, `sawLiveFrame`, `hadLiveCycle`).
2. `X9f(state, frame, line, now, sessionStart)` (`:755293-755330`) folds each frame in. It reads
   `extra.step_id` / `extra.step_status`, and three optional refinements:
   - `extra.session_mode` — one of `new | resume | resume-cached | setup-only` (`:755304`), which is
     what lets the UI say "resuming" rather than "provisioning";
   - `extra.expected_steps` — a comma list that **replaces** the default step list, deduplicated,
     truncated to 64 chars per id and capped at `K9f = 32` steps (`:755307-755319`). Steps already
     progressed but absent from the new list are kept ahead of it (`:755317`), so a server that
     re-announces a shorter plan mid-flight cannot erase visible progress;
   - a bare log line with no `step_id`, which is attached as `detail` to whichever step is currently
     `running` (`:755322-755327`).
3. `F$S` (`:755331-755365`) is the per-step transition table: `started` (pending→running),
   `completed`, `failed` (carrying the log line as `error`), `skipped` (only from pending/running).
   Every arm is guarded against a no-op re-application, and the function returns the *identical object*
   when nothing changed (`if (a === e.steps) return e;`) so React never re-renders on a duplicate frame.
4. `start_cc` completing is the terminal transition: `yrl(state, now)` (`:755366-…`) marks every
   remaining `pending` step `skipped` and every `running` step done.

**The three time constants** (`:755410-755413`) are what make it robust against a replayed log:

| Const | Value | Role |
|---|---|---|
| `P$S` | 300000 (5 min) | `Y9f` (`:755268-755273`): a frame whose `data.timestamp` is more than 5 minutes old is **stale**; on a viewer-only/attach session (`te.current`) it is dropped outright (`:757232`) rather than rewinding the checklist |
| `O$S` | 60000 (1 min) | `N$S` (`:755274-755279`): a frame is a **live** frame only if its timestamp is within ±60 s of now |
| `$$S` | 5000 | …**and** not more than 5 s before this session started — the second half of the live test |

**Why two independent freshness tests?** They answer different questions. `Y9f` (stale) protects the
*display*: an attaching viewer replays the container's whole log, and without the cut-off it would
watch a five-minute-old provisioning sequence play out as if live. `N$S` (live) sets `sawLiveFrame`,
which is what distinguishes "this container is booting right now" from "this container booted earlier
and I am reading history" — the flag that decides whether the checklist is a *progress* UI or a
*record*. The asymmetry (5 minutes vs 1 minute) follows: you can safely *show* something up to five
minutes old, but you may only claim it is happening *now* within one.

**The cycle-hidden probe.** `tengu_remote_bootstrap_cycle_hidden` (`:757247`) fires when a checklist
that was `terminal` becomes non-terminal-and-dismissed again — i.e. the container restarted its
provisioning cycle while the user was attached, and the UI chose to hide it rather than flash a second
checklist. `X9f` implements that reset explicitly at `:755297-755300`:
`e.terminal && step_id && step_status ? { ...pui(now), dismissed: e.hadLiveCycle, hadLiveCycle: e.hadLiveCycle } : e`
— a fresh checklist that starts **already dismissed** if the user has seen one complete. The gate is
the instrumentation for how often that happens.

**The failure path** (`:757250-757266`): the first frame that moves any step to `failed` emits
`pe("remote_bootstrap", "step_failed")`, resets five refs, and — only if the checklist was dismissed —
pushes a chat warning `Cloud container provisioning failed — reconnect or check the session logs`.
The "only if dismissed" condition avoids saying it twice: an undismissed checklist already shows the
red step.

---

## 5. IDE and extension surfaces (both UNANCHORED in this bundle)

> *`.203`: "[VSCode] Added a Settings toggle for 'Enable Remote Control for all sessions'."*
> *`.211`: "[VSCode] Updated the Remote Control banner to describe what it does."*

Neither is a CLI delta.

- `Enable Remote Control for all sessions` is **220=1 / 193=1** — `:452049` in 2.1.220,
  `:488493 (193)` in the baseline, and in both it is a `label:` inside the CLI's own `/config` row
  list. The VS Code *Settings* toggle lives in the extension package, which is not in this bundle.
- `Remote Control lets` (the banner's opening words) is **0/0**. `Remote Control` overall is 108/90,
  which is bundle growth, not evidence.

What the CLI *does* contribute is the data the extension renders, and that part is real and new. Three
fields were added to the `initialize` response schema (`:838496-838513`), all **220>0 / 193=0**, and
their `.describe()` text is written *at the IDE host*:

| Field | 220 | Purpose (from its own schema text) |
|---|---|---|
| `remote_control_auto_enable` | 4 | *"Whether the CLI resolver says Remote Control should auto-enable at session start (explicit setting → policy default → GB rollout), so IDE hosts can mirror TUI behavior. Absent (older CLI) → treat as false."* |
| `remote_control_auto_on_by_default` | 2 | *"True when remote_control_auto_enable is true because of the org/GB default rather than an explicit remoteControlAtStartup setting — mirrors replBridgeAutoOnByDefault so IDE hosts can render the same disclosure notice."* |
| `ide_rc_auto_enable_gate` | 2 | *"IDE-side rollout kill-switch for RC auto-enable (`tengu_ide_rc_auto_enable`), independent of remote_control_auto_enable. Carried on the init response (not experimentGates) because the host reads it at init time, before the first-prompt-triggered gate refresh. Absent (older CLI) → treat as false."* |

Three things are worth extracting from that table:

1. **The resolution order is stated as a contract**: explicit setting → policy default → GrowthBook
   rollout. `remoteControlAtStartup` is **220=23 / 193=17**; `replBridgeAutoOnByDefault` is
   **220=7 / 193=5** — both grew rather than appeared, so the *resolver* is carryover and the *wire
   projection of it* is new.
2. **`auto_on_by_default` exists solely so the IDE can show the same disclosure the TUI shows.** This
   is the same explicit-vs-default distinction that fixes the "session ready" push in
   [`security_and_enablement.md`](security_and_enablement.md) §4.1 — the same bug class, surfaced twice
   in one window, fixed once in the TUI and once by exporting the fact.
3. **`ide_rc_auto_enable_gate` rides the init response rather than the normal gate bundle, and the
   schema says why**: the host needs it *before* the first-prompt-triggered gate refresh. That is a
   real ordering constraint being paid for with schema surface — the alternative (blocking init on a
   gate fetch) would put a network round-trip in front of every IDE session start.
   `tengu_ide_rc_auto_enable` is **220=2 / 193=0** (`:838512`, `:849528`).

See [`../56_chrome_ide/`](../56_chrome_ide/) for the host side.

---

## 6. Bullets that stay unanchored

### 6.1 `.199` — flapping between Working and Idle

> *"Fixed remote sessions briefly flapping between Working and Idle in the agent view when a background
> agent completes."*

The scoping pass offered `tengu_remote_bootstrap_cycle_hidden` and `tengu_bg_result_seen`. Neither fits:

- `tengu_remote_bootstrap_cycle_hidden` (`:757247`) is the *provisioning checklist* restart probe (§4),
  not a Working/Idle state machine.
- `tengu_bg_result_seen` (**220=1 / 193=0**, `:802466`) is emitted by `edm` (`:802458-802475`), which
  walks `visibleFinished` in the **agent-view renderer** and reports `trigger: "list_open" | "render"`,
  `seen_latency_ms`, and `overlap`. It measures how long a finished result waited before a human saw
  it. It is [`../36_background_agents/`](../36_background_agents/) instrumentation, not a flap fix.

The mechanism most likely responsible is the `background_tasks_changed` level signal (§1.2 and
[`transport_and_session_lifecycle.md`](transport_and_session_lifecycle.md) §4) — a level with REPLACE
semantics is precisely the cure for a counter that briefly hits zero between a completion edge and the
next start edge — but `.199` predates that event's `.205` bullet, so I am not asserting it. **UNANCHORED.**

### 6.2 `.202` — uncaptioned images and files silently dropped

> *"Fixed images and files sent from the Remote Control mobile or web app without a caption being
> silently dropped."*

**UNANCHORED, and the obvious grep is pure noise.** `caption` is **220=95 / 193=52**, and every 2.1.220
hit I sampled is unrelated: the vendored HTML parser's element tables and insertion modes
(`:354202`, `:354214`, `:360522-360872`, `:366530`, `:372718`), `<figcaption>` in the bundled
design-system skill payloads (`:364359`, `:364527`, `:364613-364632`), the dataviz skill's JSON schema
examples (`:363369-363374`, `:364008-364013`), and `<track kind="captions">` (`:353216`). The +43 delta
is the embedded-skill corpus doubling, which
[`../00_overview/file_index.md`](../00_overview/file_index.md) already measures
(`SKILL_MD:` 220=12 / 193=6).

`uncaptioned`, `image_placeholder` and `attachment_only` are all **0/0**. The mechanism would be in the
ingress content-block normaliser (§3, `h$s`/`KPe`), where a `user` message whose `content` array holds
only image/document blocks and no text block could fail a shape test — but no literal marks it, so I am
not claiming it.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_remote_control.md](../00_overview/symbol_additions_v2_1_220_remote_control.md).

Key functions in this document:
- `replyChannelAdapter` (`cqt`, `:757708`) - the module-level `null` sentinel that darkens the reply channel
- `markReplyChannelActive` (`Wr`, `:757201`) - unreachable emitter of `tengu_remote_reply_channel_init`
- `isFramePublishContextEnabled` (`wbd`, `:381715`) - **Artifact publisher**, not Remote Control
- `remoteModelPickerLoader` (`hkf`, `:715334`) - `list_models` over the control channel, `tengu_remote_model_picker`
- `seedRemoteBootstrapState` (`pui`, `:755280`) - provisioning-checklist seed
- `foldRemoteBootstrapFrame` (`X9f`, `:755293`) - checklist reducer, incl. `expected_steps` replacement
- `applyBootstrapStepTransition` (`F$S`, `:755331`) - per-step transition table
- `finalizeBootstrapChecklist` (`yrl`, `:755366`) - `start_cc` terminal sweep
- `isStaleBootstrapFrame` (`Y9f`, `:755268`) - 5-minute display cut-off
- `isLiveBootstrapFrame` (`N$S`, `:755274`) - ±60 s / −5 s liveness test
- `DEFAULT_BOOTSTRAP_STEPS` (`M$S`, `:755416`) - `["provision","clone","setup_script","start_cc"]`
- `MAX_BOOTSTRAP_STEPS` (`K9f`, `:755409`) - 32
- `emitBackgroundResultSeen` (`edm`, `:802458`) - agent-view latency probe (NOT a flap fix)
