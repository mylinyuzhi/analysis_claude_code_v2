# `workflowSizeGuideline` — advisory workflow sizing, from `/config` row to model prompt

> **Type/version:** NET-NEW feature, introduced `.202` as a `/config` row, promoted `.219` to a settings
> key with a `medium` default and a status-line hint. `workflowSizeGuideline` is **220=21 / 193=0**.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, `build_sha 4073f595`, `build_time 2026-07-24T22:17:45Z`).
> Every `cli_inner_pretty.js:<line>` below is a **220** line unless tagged **(193)**.

---

## TL;DR

Dynamic workflows are scripts the model writes that spawn *dozens* of subagents. There is no client-side
cap on how many — the Workflow tool never counts `agent()` calls against a limit. Instead, 2.1.202
introduced a purely **rhetorical** control surface: a four-value enum (`unrestricted | small | medium |
large`) that gets rendered into English and appended to the Workflow tool's description, where the model
reads it as guidance.

The whole feature is ~70 lines at `cli_inner_pretty.js:389111-389185`, and the interesting parts are all
about *plumbing a preference into a prompt without breaking prompt caching*:

1. The size→agent-count table is `{ small: 5, medium: 15, large: 50 }` (`:389147`) and is used **only to
   generate prose** — grep every use of it and none of them gate execution (§7).
2. The resolved value is **memoised once per process** (`:389156-389159`) so the tool description is
   byte-stable for the whole session. Mid-session `/config` changes are delivered by a *separate*
   system-reminder attachment (§5) rather than by mutating the tool description.
3. `.219` added a `settings.workflowSizeGuideline` key that beats the `/config` choice, and hid the
   `/config` row while a settings file provides it — a one-expression predicate, `!Q$t()` (§4).
4. `.219` also made `medium` the *default* rather than "no guideline". The default/explicit distinction is
   threaded through five separate surfaces, each of which words itself differently (§3, §6, §8).

---

## 1. The four-value enum and the two constants

```javascript
// ============================================
// WORKFLOW_SIZE_VALUES / DEFAULT_WORKFLOW_SIZE / WORKFLOW_SIZE_AGENT_CAPS
// Location: cli_inner_pretty.js:389142-389148
// ============================================

// ORIGINAL (for source lookup):
var nMs,
  cEd = "medium",
  tko;
var Yfr = S(() => {
  nMs = ["unrestricted", "small", "medium", "large"];
  tko = { small: 5, medium: 15, large: 50 };
});

// READABLE (for understanding):
var WORKFLOW_SIZE_VALUES,
  DEFAULT_WORKFLOW_SIZE = "medium",
  WORKFLOW_SIZE_AGENT_CAPS;
var initWorkflowSizeModule = lazyModuleInit(() => {
  WORKFLOW_SIZE_VALUES = ["unrestricted", "small", "medium", "large"];
  WORKFLOW_SIZE_AGENT_CAPS = { small: 5, medium: 15, large: 50 };
});

// Mapping: nMs→WORKFLOW_SIZE_VALUES, cEd→DEFAULT_WORKFLOW_SIZE, tko→WORKFLOW_SIZE_AGENT_CAPS,
//          S→lazyModuleInit (the bundler's once-per-module initialiser), Yfr→initWorkflowSizeModule
```

### Why 5 / 15 / 50 and why `medium` is the default

**What it does.** Maps a size name to the agent count the model is told to stay under.

**How it works.** The numbers are a ~3.3× geometric ladder (5 → 15 → 50). They are never compared against
a live agent count in this module; they only ever appear inside a template string (§3).

**Why these numbers.**
- `5` is roughly the point at which a fan-out stops being cheaper than doing the work inline: a
  five-agent `parallel()` is one phase and fits in one screen of the `/workflows` progress box (which
  shows the last 8 agents flat, `Azp = 8` at `:650879`).
- `15` matches the *concurrency* cap the runtime actually enforces elsewhere:
  `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` defaults to `20` (`gty = 20`, `:231411`). A 15-agent workflow
  therefore fits inside one concurrency window — nothing queues — while 50 deliberately does not.
- `50` sits well under the session cap of `200`
  (`CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION`, `yty = 200`, `:231412`), so even "large" leaves headroom for
  several workflows plus ordinary `Agent` calls in one session.
- `unrestricted` is deliberately **not** a number: it is the *absence* of a sentence (§3), not a large
  cap. That matters because the guideline is advisory — a very large number would still bias the model
  downward, whereas an empty string is genuinely neutral.

**Key insight.** The ladder is calibrated against the *enforced* caps that live in a different module
(`53_subagent_limits`). `medium = 15` is the largest size that never contends for the concurrency
semaphore, which is exactly the size a user would pick if they wanted a workflow to feel fast. Choosing
it as the `.219` default is therefore a *latency* decision dressed as a token-cost decision.

---

## 2. Resolution: settings file beats `/config` beats default

```javascript
// ============================================
// isWorkflowSizeSetBySettings / resolveWorkflowSizeGuideline
// Location: cli_inner_pretty.js:389149-389155
// ============================================

// ORIGINAL (for source lookup):
function Q$t() {
  return SI()?.settings.workflowSizeGuideline !== void 0;
}
function Dft(e) {
  let t = $sn(SI()?.settings.workflowSizeGuideline) ?? $sn(e);
  return t === void 0 ? { size: cEd, isDefault: !0 } : { size: t, isDefault: !1 };
}

// READABLE (for understanding):
function isWorkflowSizeSetBySettings() {
  return getLoadedSettings()?.settings.workflowSizeGuideline !== undefined;
}
function resolveWorkflowSizeGuideline(configStoreValue) {
  let resolved =
    coerceToKnownSize(getLoadedSettings()?.settings.workflowSizeGuideline) ??
    coerceToKnownSize(configStoreValue);
  return resolved === undefined
    ? { size: DEFAULT_WORKFLOW_SIZE, isDefault: true }
    : { size: resolved, isDefault: false };
}

// Mapping: Q$t→isWorkflowSizeSetBySettings, Dft→resolveWorkflowSizeGuideline,
//          SI→getLoadedSettings, $sn→coerceToKnownSize, cEd→DEFAULT_WORKFLOW_SIZE
```

`$sn` (`:389111-389113`) is the validator, and it is a `find` rather than a `Set.has`:

```javascript
function $sn(e) { return nMs.find((t) => t === e); }
```

### The precedence chain and its three failure modes

**What it does.** Produces `{ size, isDefault }` from two independent stores.

**How it works.**
1. `SI()` (`:1861-1863`) returns the process-wide cache of *merged settings files* — the object built by
   the settings loader and installed via `ANn` at `:62595` / `:63187`. This covers
   `userSettings`, `projectSettings`, `localSettings`, `policySettings` and `flagSettings`, so **managed
   settings win automatically**; no extra code was needed for that clause of the changelog bullet.
2. The argument `configStoreValue` is always passed as `xt().workflowSizeGuideline` by every caller
   (`:389362`, `:389365`, `:451295`, `:516676`, `:651531`, `:747617`, `:814921`). `xt()` (`:536338-536343`)
   is the mutable `.claude.json` config store — the thing `/config` writes.
3. Both are funnelled through `$sn`, so an *unknown* string is treated as absent.
4. Absent on both sides ⇒ `{ size: "medium", isDefault: true }`.

This is the house idiom: compare `n4o()` at `:536345`
(`SI()?.settings.remoteControlAtStartup ?? xt().remoteControlAtStartup`) — same shape, same order.

**Failure modes, in order of subtlety.**
- **Garbage in the settings file** (`workflowSizeGuideline: "huge"`): `$sn` returns `undefined`, so
  resolution *falls through to the `/config` value*. But `Q$t()` still returns `true`, because it tests
  `!== void 0` on the raw value, not on the validated one. Net effect: the `/config` row is **hidden**
  (§4) while the `/config` value is still in force. The user loses the UI for a setting that is being
  used. This is a real, reachable inconsistency, and it is why `whm()` (§8) needs its apparently
  redundant `Q$t() ||` disjunct.
- **`unrestricted` set explicitly**: resolves to `{ size: "unrestricted", isDefault: false }`, and every
  prose generator short-circuits to `""` (§3). Distinguishable from "no guideline configured" only via
  `isDefault`.
- **Config accessed too early**: `xt()` throws `Error("Config accessed before allowed.")` (`:536341`) if
  the config store has not been primed. Every call site is inside a React render or an async tool
  handler, so this is a programming-error guard, not a runtime path.

**Key insight.** `isDefault` is not cosmetic. It is the *only* signal that distinguishes "the product
picked medium for you" from "you picked medium", and five separate surfaces branch on it: the prompt prose
(§3), the `/config` row label (§4), the status line (§6), the tip suppressor (§8), and — most
consequentially — the size-warning threshold (§7).

---

## 3. Turning the enum into prose: four nested formatters

Four tiny functions compose into the sentence the model actually reads.

```javascript
// ============================================
// describeSizeWithCap / guidelineCaveat / buildGuidelineSentence
// Location: cli_inner_pretty.js:389124-389137
// ============================================

// ORIGINAL (for source lookup):
function dEd(e) {
  if (!(e in tko)) return e;
  return `${e} — keep workflows under ${tko[e]} agents`;
}
function pEd() {
  return "This is a guideline, not a hard limit — follow it unless the user's prompt calls for a different scale.";
}
function fEd(e, t) {
  let r = t
      ? "This session has the default workflow size guideline:"
      : "A workflow size guideline is configured for this session:",
    n = t ? ' The user can raise or remove it with "Dynamic workflow size" in /config.' : "";
  return `${r} ${dEd(e)}. ${pEd()}${n}`;
}

// READABLE (for understanding):
function describeSizeWithCap(size) {
  if (!(size in WORKFLOW_SIZE_AGENT_CAPS)) return size;          // "unrestricted" passes through bare
  return `${size} — keep workflows under ${WORKFLOW_SIZE_AGENT_CAPS[size]} agents`;
}
function guidelineCaveat() {
  return "This is a guideline, not a hard limit — follow it unless the user's prompt calls for a different scale.";
}
function buildGuidelineSentence(size, isDefault) {
  let lead = isDefault
      ? "This session has the default workflow size guideline:"
      : "A workflow size guideline is configured for this session:",
    escapeHatch = isDefault
      ? ' The user can raise or remove it with "Dynamic workflow size" in /config.'
      : "";
  return `${lead} ${describeSizeWithCap(size)}. ${guidelineCaveat()}${escapeHatch}`;
}

// Mapping: dEd→describeSizeWithCap, pEd→guidelineCaveat, fEd→buildGuidelineSentence,
//          tko→WORKFLOW_SIZE_AGENT_CAPS
```

### Why the default and the explicit case are worded differently

**What it does.** Emits one of two sentences, differing in lead-in *and* in whether it tells the model that
the user can change the setting.

**How it works.**
- `isDefault: true` → *"This session has the **default** workflow size guideline: medium — keep workflows
  under 15 agents. This is a guideline, not a hard limit … The user can raise or remove it with "Dynamic
  workflow size" in /config."*
- `isDefault: false` → *"A workflow size guideline **is configured** for this session: large — keep
  workflows under 50 agents. This is a guideline, not a hard limit …"* — and **no** `/config` pointer.

**Why this asymmetry.** The escape-hatch sentence is a licence to *argue with the constraint*. If the user
deliberately chose `small`, telling the model "the user can raise it in /config" invites the model to
propose overriding a decision the user already made — annoying at best, and a small
instruction-hierarchy leak at worst. If nobody chose anything, the same sentence is genuinely useful: it
lets the model explain, when a user asks for a 30-agent sweep and gets 15, *why* and *how to change it*.
The word "default" in the lead-in does the same job for the model's own reasoning: it marks the constraint
as low-authority.

**Trade-off.** Two lead-ins mean the tool description is not byte-identical across users, which costs a
prompt-cache partition between default-config users and configured users. Given the tool description is
~9 KB of prose (`rMs`, `:388943-389101`) this is not free — but it is the same partition the size value
itself already creates, so the marginal cost is zero.

**Key insight.** The `unrestricted` path in `describeSizeWithCap` uses `!(e in tko)` rather than
`e === "unrestricted"`. That is a *table-driven* fallthrough: adding an `xlarge` size to `nMs` without
adding it to `tko` would silently produce `"xlarge"` with no cap sentence rather than
`"xlarge — keep workflows under undefined agents"`. Defensive, and cheap.

---

## 4. The `/config` row and the "hidden while settings provide it" rule

```javascript
// ============================================
// buildConfigRows - the workflowSizeGuideline row (gating + label + write path)
// Location: cli_inner_pretty.js:451295, :451501-451521
// ============================================

// ORIGINAL (for source lookup):
let W = Dft(t.workflowSizeGuideline);
// ...
...(E && (_ || M0())
  ? [
      {
        id: "workflowSizeGuideline",
        label: "Dynamic workflow size",
        value: W.size,
        isDefaultValue: W.isDefault,
        options: [...nMs],
        type: "enum",
        onChange(F) {
          let G = $sn(F) ?? "unrestricted";
          (hr((j) => {
            if (j.workflowSizeGuideline === G) return j;
            return { ...j, workflowSizeGuideline: G };
          }),
            R((j) => ({ ...j, workflowSizeGuideline: G })),
            L((j) => ({ ...j, workflowSizeGuideline: G })));
        },
      },
    ]
  : []),

// READABLE (for understanding):
let resolved = resolveWorkflowSizeGuideline(globalConfig.workflowSizeGuideline);
// ...
...(workflowSizeGuidelineToggleable && (workflowsToggleable || areWorkflowsEnabled())
  ? [
      {
        id: "workflowSizeGuideline",
        label: "Dynamic workflow size",
        value: resolved.size,
        isDefaultValue: resolved.isDefault,
        options: [...WORKFLOW_SIZE_VALUES],
        type: "enum",
        onChange(picked) {
          let size = coerceToKnownSize(picked) ?? "unrestricted";
          updateGlobalConfigOnDisk((cfg) =>
            cfg.workflowSizeGuideline === size ? cfg : { ...cfg, workflowSizeGuideline: size },
          );
          setGlobalConfigState((cfg) => ({ ...cfg, workflowSizeGuideline: size }));
          recordPendingChange((changes) => ({ ...changes, workflowSizeGuideline: size }));
        },
      },
    ]
  : []),

// Mapping: W→resolved, E→workflowSizeGuidelineToggleable, _→workflowsToggleable,
//          M0→areWorkflowsEnabled, hr→updateGlobalConfigOnDisk, R→setGlobalConfigState,
//          L→recordPendingChange, F→picked, G→size
```

### The gate `E && (_ || M0())` — why three conditions, in this order

**What it does.** Decides whether the row exists at all.

**How it works.** `E` = `workflowSizeGuidelineToggleable`, computed identically in two places:

| Site | Expression | Component |
|---|---|---|
| `:452357` | `l = !Q$t()` | headless / non-interactive `/config` row builder (`oUs`) |
| `:668331` | `et = !Q$t()` | the interactive `/config` React view |

So the `.219` clause *"the `/config` row is hidden while one does [set it from a settings file]"* is
literally the single expression `!isWorkflowSizeSetBySettings()`. The second conjunct
`(_ || M0())` requires that workflows are either user-toggleable (`_`, computed at `:452353-452356` from
`disableWorkflows`/`enableWorkflows` source precedence) **or** currently enabled (`M0()`).

**Why this order.** `Q$t()` is a pure property read on an already-loaded object — cheapest, and the one
that can hide the row outright. `M0()` is the workflows-enablement predicate that consults org policy and
a launch gate, so it is evaluated last and only when needed. Short-circuiting matters here because
`buildConfigRows` runs on every keystroke in the `/config` search box.

**Why hide rather than disable.** A greyed-out row would have to explain *which* settings file won, which
means surfacing settings-source provenance in a UI that has no vocabulary for it. Hiding is the honest
minimum: the setting is not user-editable here, so it is not offered here. The cost is discoverability —
a user who set `workflowSizeGuideline` in `~/.claude/settings.json` and then forgot will find the `/config`
row simply gone, with no hint why. The settings-schema `.describe()` at `:60918` is the only place that
documents the interaction, and it is not surfaced in the TUI.

### The write path writes three places

`onChange` fans out to (a) the on-disk global config, (b) React state, (c) the pending-changes recorder
that drives the `/config` "changed" summary. Note `$sn(F) ?? "unrestricted"` — an unrecognised pick
becomes `unrestricted`, i.e. *fail-open to no guideline* rather than fail-closed to `small`. Given the
options list is generated from `nMs` this is unreachable in practice; the choice of fallback still tells
you the designers considered an over-restrictive guideline the worse error.

`workflowSizeGuideline` was also appended to `GLOBAL_CONFIG_KEYS` (`t4o`, exported under that name at
`:535898`) as the **last** entry, `:537152`. In 2.1.193 the same list ends at `"remoteDialogSeen"`
(`:604997 (193)`). That registration is what makes the key user-global rather than per-project — a
workflow-size preference is about the human, not the repository.

### Rendering: `medium (default)` vs `medium (aim for <15 agents)`

```javascript
// ============================================
// formatSizeRowValue / formatSizeWithInlineCap
// Location: cli_inner_pretty.js:389114-389120
// ============================================

// ORIGINAL (for source lookup):
function g6y(e) {
  let t = e === "small" || e === "medium" || e === "large" ? tko[e] : void 0;
  return t === void 0 ? e : `${e} (aim for <${t} agents)`;
}
function rko(e, t) {
  return t && e !== "unrestricted" ? `${e} (default)` : g6y(e);
}

// READABLE (for understanding):
function formatSizeWithInlineCap(size) {
  let cap = size === "small" || size === "medium" || size === "large"
    ? WORKFLOW_SIZE_AGENT_CAPS[size] : undefined;
  return cap === undefined ? size : `${size} (aim for <${cap} agents)`;
}
function formatSizeRowValue(size, isDefault) {
  return isDefault && size !== "unrestricted" ? `${size} (default)` : formatSizeWithInlineCap(size);
}

// Mapping: g6y→formatSizeWithInlineCap, rko→formatSizeRowValue
```

Consumed by the `/config` enum-value renderer at `:669180-669189` and by the plain-text/announcement
value formatter `tof` at `:669397`. The branch is *exclusive*: the default state shows `medium (default)`
and deliberately **omits** the agent count, while an explicit choice shows `large (aim for <50 agents)`.
Reading the row therefore answers the question the user is actually asking in each state — "am I on a
default?" vs "what does the size I picked mean?" — instead of always showing both and being twice as wide
in a `wrap: "truncate-end"` cell.

---

## 5. Reaching the model: one memoised suffix, plus a mid-session attachment

### 5.1 The suffix on the tool description

```javascript
// ============================================
// memoiseSessionWorkflowSize / buildGuidelineSuffix - appended to the Workflow tool prose
// Location: cli_inner_pretty.js:389156-389166
// ============================================

// ORIGINAL (for source lookup):
function Nsn(e) {
  if (oMs === void 0) oMs = Dft(e);
  return oMs;
}
function iMs(e) {
  let { size: t, isDefault: r } = Nsn(e);
  if (t === "unrestricted") return "";
  return `

${fEd(t, r)}`;
}

// READABLE (for understanding):
function memoiseSessionWorkflowSize(configStoreValue) {
  if (sessionWorkflowSize === undefined) sessionWorkflowSize = resolveWorkflowSizeGuideline(configStoreValue);
  return sessionWorkflowSize;                                   // frozen for the process lifetime
}
function buildGuidelineSuffix(configStoreValue) {
  let { size, isDefault } = memoiseSessionWorkflowSize(configStoreValue);
  if (size === "unrestricted") return "";                       // no sentence at all
  return `\n\n${buildGuidelineSentence(size, isDefault)}`;
}

// Mapping: Nsn→memoiseSessionWorkflowSize, iMs→buildGuidelineSuffix, oMs→sessionWorkflowSize (:389181)
```

Both `prompt()` and `description()` on the Workflow tool return the same value:

```javascript
// ============================================
// WorkflowTool - the two prompt-injection sites for the size guideline
// Location: cli_inner_pretty.js:389355-389372
// ============================================

// ORIGINAL (for source lookup):
S6y = Bi({
  name: dk,
  aliases: ["RunWorkflow"],
  searchHint: "orchestrate subagents with deterministic JavaScript workflow",
  maxResultSizeChars: 1e5,
  isEnabled: () => M0(),
  async prompt() {
    return rMs + iMs(xt().workflowSizeGuideline);
  },
  async description() {
    return rMs + iMs(xt().workflowSizeGuideline);
  },
  ...

// READABLE (for understanding):
WorkflowTool = defineTool({
  name: WORKFLOW_TOOL_NAME,                    // "Workflow"  (:231211)
  aliases: ["RunWorkflow"],
  searchHint: "orchestrate subagents with deterministic JavaScript workflow",
  maxResultSizeChars: 100_000,
  isEnabled: () => areWorkflowsEnabled(),
  async prompt()      { return WORKFLOW_TOOL_PROSE + buildGuidelineSuffix(getConfig().workflowSizeGuideline); },
  async description() { return WORKFLOW_TOOL_PROSE + buildGuidelineSuffix(getConfig().workflowSizeGuideline); },
  ...

// Mapping: S6y→WorkflowTool, Bi→defineTool, dk→WORKFLOW_TOOL_NAME, rMs→WORKFLOW_TOOL_PROSE,
//          iMs→buildGuidelineSuffix, xt→getConfig, M0→areWorkflowsEnabled
```

### Why memoise, and why the memo is a module global with no invalidator

**What it does.** Freezes the resolved size the first time anything asks for it, for the life of the
process.

**How it works.** `oMs` (`:389181`) is a bare `var`. Nothing in the bundle assigns it except `Nsn`. There
is no reset function, no cache-bust on `/config` write, and `hr(...)`/`R(...)` in the `/config`
`onChange` (§4) do not touch it.

**Why this approach.** The suffix lands in `description()`, and `description()` is serialised into the
**tool-definitions block of the system prompt** — the single largest cacheable prefix in the request. If
the string could change between turns of one conversation, every `/config` toggle would invalidate the
prompt cache for the rest of the session and re-bill the full tool block. Freezing at first read makes the
tool block immutable per process, so a `/config` change costs nothing until the next `claude` invocation.

**The alternative they explicitly took instead.** Rather than let the description drift, mid-session
changes are delivered as a *message-level* system reminder (§5.2). Message-level content sits after the
cached prefix, so it costs one short block and invalidates nothing.

**Failure mode.** The memo is keyed on nothing — the first caller's `configStoreValue` wins. If the first
reader ran before the config store was populated, the session would be pinned to `medium`/`isDefault`
for good. In practice all readers pass `xt().workflowSizeGuideline` and `xt()` throws rather than return
a half-initialised object (`:536341`), so the pin is either correct or the process has already failed.

**Key insight.** `prompt()` and `description()` returning the *same 9 KB string* is unusual: in most
tool definitions `description()` is the schema-visible blurb and `prompt()` is the long form. Here the
full 159-line prose (`rMs`, `:388943-389101`) is both. The consequence is that the guideline sentence
reaches the model through whichever path the current request shape uses, with no chance of the two
disagreeing — at the price of paying for the long prose twice in any code path that reads both.

### 5.2 Mid-session change: the `workflow_size_guideline_change` attachment

```javascript
// ============================================
// diffWorkflowSizeAgainstTranscript - emit a reminder iff the effective size moved
// Location: cli_inner_pretty.js:389167-389180
// ============================================

// ORIGINAL (for source lookup):
function hEd(e, t) {
  let r = Dft(t).size,
    n;
  for (let i = e.length - 1; i >= 0; i--) {
    let s = e[i];
    if (s?.type === "attachment" && s.attachment.type === "workflow_size_guideline_change") {
      n = s.attachment.size;
      break;
    }
  }
  let o = n ?? Nsn(t).size;
  if (r !== o) return [{ type: "workflow_size_guideline_change", size: r }];
  return [];
}

// READABLE (for understanding):
function diffWorkflowSizeAgainstTranscript(transcript, configStoreValue) {
  let liveSize = resolveWorkflowSizeGuideline(configStoreValue).size,
    lastAnnounced;
  for (let i = transcript.length - 1; i >= 0; i--) {                 // newest-first scan
    let entry = transcript[i];
    if (entry?.type === "attachment" && entry.attachment.type === "workflow_size_guideline_change") {
      lastAnnounced = entry.attachment.size;
      break;
    }
  }
  let modelBelieves = lastAnnounced ?? memoiseSessionWorkflowSize(configStoreValue).size;
  if (liveSize !== modelBelieves) return [{ type: "workflow_size_guideline_change", size: liveSize }];
  return [];
}

// Mapping: hEd→diffWorkflowSizeAgainstTranscript, e→transcript, t→configStoreValue,
//          r→liveSize, n→lastAnnounced, o→modelBelieves
```

Wiring:

| Stage | Line | What |
|---|---|---|
| Attachment producer | `:516675-516677` | `K_("workflow_size_guideline_change", () => s?.isRegularUserPrompt ? hEd(FE(o ?? []), xt().workflowSizeGuideline) : [])`, inside the `M0()`-gated block next to `workflow_keyword_request` and `ultra_effort_enter` |
| Attachment renderer | `:534378` | `workflow_size_guideline_change: ({ size: e }) => pm([zr({ content: mEd(e), isMeta: !0 })])` |
| Reminder text | `:389138-389141` | `mEd` — `"Workflow size is now unrestricted — no size guideline applies."` or `"The workflow size guideline for this session changed: <prose>. <caveat>"` |
| Invisible-in-UI set | `:687163` | `"workflow_size_guideline_change"` is a member of the attachment-type set consumed by `_Qo` (`:687119-687124`), which the unseen-count walker (`:690198`) and the transcript filter (`:691796`) use to skip non-user-visible entries |

### Why diff against the transcript rather than against a mutable variable

**What it does.** Decides whether to inject a "your guideline changed" reminder on this turn.

**How it works.**
1. Compute the **live** value (un-memoised — note it calls `Dft`, not `Nsn`).
2. Scan the transcript **backwards** for the most recent `workflow_size_guideline_change` attachment. That
   is the model's last-known value.
3. If none was ever sent, fall back to the **memoised** value — i.e. what the tool description said at
   session start.
4. Emit only on a mismatch.

**Why this approach.** The transcript *is* the model's memory. Deriving "what does the model currently
believe" from the transcript rather than from a client-side flag makes the reminder correct across the
cases a flag would get wrong: session resume from a `.jsonl`, compaction (the attachment survives as an
ordinary message), forks, and a second UI attached to the same session. It is idempotent by construction —
recomputing on every turn yields `[]` once the model has been told.

**Why gate on `isRegularUserPrompt`.** Injecting the reminder on synthetic turns (tool-result
continuations, hook-driven turns) would burn a reminder slot without a human in the loop to have caused
the change.

**Ordering note.** `mEd("unrestricted")` gets a bespoke sentence — *"no size guideline applies"* — because
the ordinary formatter would render the bare word `unrestricted` with no cap clause, which reads like a
truncation rather than a removal.

**Key insight.** This is the exact complement of the memo in §5.1: the *cacheable* surface is frozen and
the *cheap* surface carries the delta. Reading either function alone makes the other look wrong; together
they are a deliberate split between a prompt-prefix value and a prompt-suffix delta.

---

## 6. The running-workflow status line (`.219`)

`.219`: *"Added the current default workflow size to the running-workflow status line, with a pointer to
`/config` for changing it."*

```javascript
// ============================================
// WorkflowSizeStatusHint - " · medium size (/config)" suffix on the running-workflow line
// Location: cli_inner_pretty.js:651528-651549
// ============================================

// ORIGINAL (for source lookup):
function kya() {
  let x0b = z9o.c(2),
    k0b;
  if (x0b[0] === X) ((k0b = Nsn(xt().workflowSizeGuideline)), (x0b[0] = k0b));
  else k0b = x0b[0];
  let { size: H0b, isDefault: ltk } = k0b;
  if (!ltk || H0b === "unrestricted") {
    return null;
  }
  ...
  Sp.jsxs(h, { dimColor: !0, children: [" \xB7 ", H0b, " size ("] }),
  Sp.jsx(h, { color: "suggestion", children: "/config" }),
  Sp.jsx(h, { dimColor: !0, children: ")" }),
  ...
}

// READABLE (for understanding):
function WorkflowSizeStatusHint() {
  let memoCache = useMemoCache(2), resolved;
  if (memoCache[0] === MEMO_SENTINEL) (resolved = memoiseSessionWorkflowSize(getConfig().workflowSizeGuideline)),
    (memoCache[0] = resolved);
  else resolved = memoCache[0];
  let { size, isDefault } = resolved;
  if (!isDefault || size === "unrestricted") return null;     // shown ONLY in the default state
  return <>
    <Text dimColor> · {size} size (</Text>
    <Text color="suggestion">/config</Text>
    <Text dimColor>)</Text>
  </>;
}

// Mapping: kya→WorkflowSizeStatusHint, Nsn→memoiseSessionWorkflowSize, xt→getConfig,
//          X→MEMO_SENTINEL (react.memo_cache_sentinel), H0b→size, ltk→isDefault
```

The delta is one child added to an otherwise byte-identical status line:

| | 2.1.193 | 2.1.220 |
|---|---|---|
| Site | `:426083-426097 (193)` | `:651498-651513` |
| Children | `"Running in background · "`, `/workflows`, `" to monitor and save"` | the same three **plus** `Sp.jsx(kya, {})` at `:651506` |
| `to monitor and save` count | 1 | 1 (byte-identical string) |

### Why only in the default state

**What it does.** Appends ` · medium size (/config)` to *Running in background · /workflows to monitor and
save*.

**How it works.** `if (!isDefault || size === "unrestricted") return null` — the hint is suppressed the
moment the user has expressed a preference, and suppressed for `unrestricted` because there is nothing to
report.

**Why this approach.** It is the same authority logic as §3, rendered for humans instead of for the model.
A user who chose `small` does not need to be told what they chose every time a workflow starts; a user who
never chose gets told exactly once per workflow launch, at the moment the information is actionable (a
workflow is running and they can see how big it is). The `/config` word is themed `"suggestion"` — the
same treatment slash commands get elsewhere — so it reads as a clickable affordance rather than prose.

**Trade-off.** The hint is inside a React-compiler memo cell keyed on the sentinel only, so it is computed
once per mount and *never* recomputed. Combined with the `Nsn` memo this means the status line cannot
disagree with the tool description — but it also cannot reflect a `/config` change made while a workflow
is running. Given §5.2 handles the model side, the residual inconsistency is UI-only and lasts until the
component unmounts.

---

## 7. The guideline is advisory — and the one place it *does* have teeth

Grep every use of the cap table: `:389115` (`formatSizeWithInlineCap`), `:389122` (`uEd`), `:389125-389126`
(`describeSizeWithCap`). Two produce prose; the third, `uEd`, has exactly one caller — and it is not an
enforcement point either, it is a **warning threshold**.

```javascript
// ============================================
// computeWorkflowSizeWarning - the /workflows over-size banner, and where the guideline gains teeth
// Location: cli_inner_pretty.js:747613-747639
// ============================================

// ORIGINAL (for source lookup):
function z5f({ scheduledAgents: e, startedAgents: t, totalTokens: r, ultracodeActive: n }) {
  if (n) return;
  let o = Ke("tengu_ochre_gantry", {});
  if (o?.enabled === !1) return;
  let i = Dft(xt().workflowSizeGuideline),
    s = i.isDefault ? void 0 : uEd(i.size),
    a = Kli(Z.CLAUDE_CODE_WORKFLOW_SIZE_WARNING_AGENTS),
    l = a ?? s ?? Kli(o?.agents) ?? VLS,
    c = Kli(Z.CLAUDE_CODE_WORKFLOW_SIZE_WARNING_TOKENS) ?? Kli(o?.tokens) ?? zLS,
    u = t > 0 ? r / t : KLS,
    d = Math.max(r, Math.round(u * e)),
    p = e > l,
    f = r > c || d > c;
  if (!p && !f) return;
  return {
    axis: p && f ? "both" : p ? "agents" : "tokens",
    scheduledAgents: e, totalTokens: r, projectedTokens: d,
    agentCap: l, tokenCap: c,
    capFromGuideline: p && a === void 0 && s !== void 0,
  };
}
var VLS = 25, zLS = 1500000, KLS = 70000;

// READABLE (for understanding):
function computeWorkflowSizeWarning({ scheduledAgents, startedAgents, totalTokens, ultracodeActive }) {
  if (ultracodeActive) return;                                     // ultracode opted into scale already
  let gate = getFeatureValue("tengu_ochre_gantry", {});
  if (gate?.enabled === false) return;                             // remote kill switch
  let resolved = resolveWorkflowSizeGuideline(getConfig().workflowSizeGuideline),
    guidelineCap = resolved.isDefault ? undefined : sizeToAgentCap(resolved.size),
    envAgentCap = positiveFiniteOrUndefined(env.CLAUDE_CODE_WORKFLOW_SIZE_WARNING_AGENTS),
    agentCap = envAgentCap ?? guidelineCap ?? positiveFiniteOrUndefined(gate?.agents) ?? DEFAULT_AGENT_WARN_CAP,
    tokenCap = positiveFiniteOrUndefined(env.CLAUDE_CODE_WORKFLOW_SIZE_WARNING_TOKENS)
      ?? positiveFiniteOrUndefined(gate?.tokens) ?? DEFAULT_TOKEN_WARN_CAP,
    tokensPerAgent = startedAgents > 0 ? totalTokens / startedAgents : ASSUMED_TOKENS_PER_AGENT,
    projectedTokens = Math.max(totalTokens, Math.round(tokensPerAgent * scheduledAgents)),
    overAgents = scheduledAgents > agentCap,
    overTokens = totalTokens > tokenCap || projectedTokens > tokenCap;
  if (!overAgents && !overTokens) return;
  return {
    axis: overAgents && overTokens ? "both" : overAgents ? "agents" : "tokens",
    scheduledAgents, totalTokens, projectedTokens, agentCap, tokenCap,
    capFromGuideline: overAgents && envAgentCap === undefined && guidelineCap !== undefined,
  };
}
var DEFAULT_AGENT_WARN_CAP = 25, DEFAULT_TOKEN_WARN_CAP = 1_500_000, ASSUMED_TOKENS_PER_AGENT = 70_000;

// Mapping: z5f→computeWorkflowSizeWarning, Kli→positiveFiniteOrUndefined (:747610), uEd→sizeToAgentCap,
//          Ke→getFeatureValue, Z→env, VLS→DEFAULT_AGENT_WARN_CAP, zLS→DEFAULT_TOKEN_WARN_CAP,
//          KLS→ASSUMED_TOKENS_PER_AGENT
```

Every literal in this function is **220-only**: `tengu_ochre_gantry`,
`CLAUDE_CODE_WORKFLOW_SIZE_WARNING_AGENTS` (accessor `:30983`),
`CLAUDE_CODE_WORKFLOW_SIZE_WARNING_TOKENS` (accessor `:30982`), `capFromGuideline` —
combined `grep -c` is **220=6 / 193=0**.

### `s = i.isDefault ? undefined : uEd(i.size)` — the single most interesting line in the module

**What it does.** Makes an *explicitly chosen* guideline double as the warning threshold, while an
*implicit* default does not.

**How it works.** The cap resolution is a four-level `??` chain:
`env override → explicit guideline → remote gate value → hardcoded 25`.
When the guideline is at its `.219` default (`medium`, `isDefault: true`), `s` is `undefined` and the chain
falls through to `25`. When the user picks `medium` by hand, the threshold *drops from 25 to 15*.

**Why this asymmetry.** If the default fed the threshold, the `.219` change of default from "no guideline"
to `medium` would have silently lowered the warning threshold from 25 to 15 for **every user on earth**,
turning a prose nudge into a wave of new banners. Excluding the default keeps the two changes independent:
`.219` altered what the model is *told*, not what the user is *warned about*. Conversely, a user who
deliberately says "small" has expressed an intent the UI should hold the model to — so their choice does
move the threshold.

`capFromGuideline` (`:747634`) exists precisely to measure this split in telemetry: it is true only when
the agent axis fired **and** there was no env override **and** the cap came from an explicit guideline.

**Why `25` rather than `15`?** `25` is the pre-existing warning threshold's natural home: it is above
`medium` (15) and below `large` (50), i.e. it warns about workflows that exceed what a "medium" user would
have asked for without warning about ones a "large" user would consider normal. It also sits just above
the enforced concurrency cap of 20 (`:231411`), so the banner fires roughly when agents actually start
queueing.

**The token projection is the non-obvious part.** `tokensPerAgent = totalTokens / startedAgents` is the
*observed* per-agent burn for this workflow so far; `projectedTokens = max(totalTokens, tokensPerAgent ×
scheduledAgents)` extrapolates it over the whole plan. Before any agent has finished, `startedAgents` is 0
and the estimator seeds with `ASSUMED_TOKENS_PER_AGENT = 70_000` — a number that produces the 1.5 M token
cap at ≈21 agents, i.e. deliberately calibrated so the token axis and the agent axis fire at
approximately the same workflow size on a typical run. The `max()` guard prevents a projection *below*
already-spent tokens when the plan shrinks mid-run.

**Failure modes.** `Kli` (`:747610-747612`) requires `typeof === "number" && isFinite && > 0`, so a
malformed env var or gate payload is discarded rather than producing `NaN` comparisons (`NaN > x` is
`false`, which would silently disable the warning). `o?.enabled === !1` is an exact `false` test, so a
gate that returns `{}` — the default — leaves the warning on.

### Emission

`z5f` is called per running workflow at `:747903-747908`, and a `Set` ref
(`R.current`, `:747913-747931`) makes `tengu_workflow_size_warning_shown` fire **at most once per workflow
id**, with `axis`, `scheduled_agents`, `total_tokens`, `projected_tokens`, `agent_cap`, `token_cap`,
`cap_from_guideline` (`:747921-747929`). The set is pruned when a task stops being a `local_workflow`
(`:747915`), so an id can re-arm if the registry is rebuilt.

**Note the guideline still enforces nothing.** The warning is a banner in the `/workflows` footer; no
branch in the Workflow runtime consults `tko`, `Dft` or `uEd` to refuse an `agent()` call. `.202`'s
changelog wording — *"an advisory guideline, not an enforced cap"* — is exactly right, and provable by
exhaustion of the three `tko` call sites.

---

## 8. Tips: `hasExplicitWorkflowSizeGuideline`

```javascript
// ============================================
// hasExplicitWorkflowSizeGuideline - suppresses the two workflow-size prompting tips
// Location: cli_inner_pretty.js:814920-814922
// ============================================

// ORIGINAL (for source lookup):
function whm() {
  return Q$t() || !Dft(xt().workflowSizeGuideline).isDefault;
}

// READABLE (for understanding):
function hasExplicitWorkflowSizeGuideline() {
  return isWorkflowSizeSetBySettings() || !resolveWorkflowSizeGuideline(getConfig().workflowSizeGuideline).isDefault;
}

// Mapping: whm→hasExplicitWorkflowSizeGuideline, Q$t→isWorkflowSizeSetBySettings,
//          Dft→resolveWorkflowSizeGuideline
```

Two spinner tips consume it (`:815616-815637`):

- `workflow-size-prompting` (priority 1, cooldown 5 sessions) — shown only if the user has already used the
  Workflow tool this session: `e?.toolsUsed?.has(dk)`.
- `workflow-size-prompting-ambient` (cooldown 12 sessions) — the complement, for users who have *not*.

Both require `M0() && !whm()` — workflows enabled and no explicit preference — and both mutually exclude
each other via `Ahm(...)` (`:814917`), a "has a sibling tip been shown recently" check.

### Why the apparently redundant `Q$t() ||`

`Dft` already consults settings first, so `!isDefault` should cover the settings case. It does not cover
one case: a settings file containing a value `$sn` rejects. Then `Q$t()` is `true` (the key exists) but
`Dft` returns `isDefault: true` (the value was discarded). Without the first disjunct, a user who typed
`"huge"` into `settings.json` would be nagged to configure a setting they had already tried to
configure — and, per §4, would have no `/config` row to do it in. The extra disjunct is a targeted patch
for exactly the inconsistency identified in §2.

**Note the asymmetry with `kya` (§6):** the status-line hint keys off `isDefault` alone, so the same
malformed-settings user *does* still see ` · medium size (/config)` while having no `/config` row. That
is an unfixed edge of the same bug.

---

## 9. The settings-schema entry — the only complete documentation of the precedence rule

```javascript
// ============================================
// workflowSizeGuideline settings field - schema + the canonical precedence prose
// Location: cli_inner_pretty.js:60914-60919
// ============================================

// ORIGINAL (for source lookup):
workflowSizeGuideline: v
  .enum(["unrestricted", "small", "medium", "large"])
  .optional()
  .describe(
    'Advisory size guideline for the dynamic workflows Claude writes: "small" aims for fewer than 5 agents, "medium" (the default) fewer than 15, "large" fewer than 50, and "unrestricted" sends no guideline. A value here — including from managed settings — takes precedence over the "Dynamic workflow size" choice in /config, and that /config row is hidden while a settings file provides the key. This is a guideline, not an enforced limit.',
  ),

// READABLE (for understanding):
workflowSizeGuideline: zod
  .enum(["unrestricted", "small", "medium", "large"])
  .optional()
  .describe(
    'Advisory size guideline for the dynamic workflows Claude writes: "small" aims for fewer than 5 '
    + 'agents, "medium" (the default) fewer than 15, "large" fewer than 50, and "unrestricted" sends no '
    + 'guideline. A value here — including from managed settings — takes precedence over the "Dynamic '
    + 'workflow size" choice in /config, and that /config row is hidden while a settings file provides '
    + 'the key. This is a guideline, not an enforced limit.',
  ),

// Mapping: v→zod (the zod namespace alias in this build)
```

Every clause of that string maps to code verified above: the thresholds to `tko` (`:389147`), *"the
default"* to `cEd` (`:389143`), *"including from managed settings"* to `SI()` returning already-merged
settings (`:62595`, `:63187`), *"the /config row is hidden"* to `!Q$t()` (`:452357`, `:668331`), and
*"not an enforced limit"* to the total absence of an enforcement branch (§7). It is the tightest
schema-description-to-implementation correspondence in this module tree.

Neighbouring workflow settings for context: `enableWorkflows` `:60908`, `workflowKeywordTriggerEnabled`
`:60920` (the `ultracode` keyword trigger).

---

## 10. Reconciling `.202` / `.219` / `.220`

The seed question: `.220` is a single "Bug fixes and reliability improvements" bullet, `.219` claims the
`medium` default — which build carries it?

**2.1.220 carries it.** `cEd = "medium"` is at `:389143` in the 2.1.220 bundle, `Dft` returns
`{ size: cEd, isDefault: !0 }` for an unconfigured session (`:389154`), and `iMs` therefore appends the
default-flavoured sentence for every user who has touched nothing. There is no `.220`-specific
workflow-size code and no gate that could disable the default — it is an unconditional constant.

**What `.202` most likely shipped, and why this is an inference and not a claim.** 2.1.193 predates the
whole feature (`workflowSizeGuideline` 193=0), so the bundles cannot separate `.202` from `.219`. But the
code carries strong internal evidence that `.202` had **no** default:

1. The `isDefault` flag has no purpose in a world where an absent setting means "no guideline" — the two
   states would be indistinguishable and every consumer's `isDefault` branch would be dead.
2. `fEd`'s default-flavoured lead-in (*"This session has the **default** … The user can raise or remove
   it with …"*) only makes sense once the product started asserting a guideline the user never asked for.
3. `z5f`'s `i.isDefault ? void 0 : uEd(i.size)` (§7) is precisely the patch you need when a default
   appears and you do not want it to move an existing warning threshold. It has no reason to exist
   otherwise.
4. `kya` (§6) is `.219`-dated by the changelog and renders **only** in the default state.

So: `.202` = the enum, the `/config` row, the prose generators, the memo, and the mid-session attachment,
with an unset value meaning silence. `.219` = `cEd = "medium"`, the `settings` key, the `!Q$t()` row
hiding, the `isDefault` threading, and the status-line hint. **Labelled inference.** The one thing the
bundle proves outright is that `.220` behaves as `.219` describes.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_workflow.md](../00_overview/symbol_additions_v2_1_220_workflow.md).

Key functions in this document:
- `isWorkflowSizeSetBySettings` (Q$t) - `:389149` — the "hide the `/config` row" predicate
- `resolveWorkflowSizeGuideline` (Dft) - `:389152` — settings → `/config` → `medium` precedence
- `coerceToKnownSize` (\$sn) - `:389111` — enum validator; unknown values are treated as absent
- `memoiseSessionWorkflowSize` (Nsn) - `:389156` — freezes the size for the process, protecting the prompt cache
- `buildGuidelineSuffix` (iMs) - `:389160` — the string appended to the Workflow tool prose
- `buildGuidelineSentence` (fEd) - `:389131` — default vs explicit wording, with/without the `/config` hint
- `describeSizeWithCap` (dEd) - `:389124` — `"medium — keep workflows under 15 agents"`
- `formatSizeWithInlineCap` (g6y) - `:389114` — `"medium (aim for <15 agents)"`
- `formatSizeRowValue` (rko) - `:389118` — `/config` row value; `"medium (default)"` when unset
- `guidelineCaveat` (pEd) - `:389128` — the "guideline, not a hard limit" clause
- `buildSizeChangeReminder` (mEd) - `:389138` — mid-session change reminder text
- `diffWorkflowSizeAgainstTranscript` (hEd) - `:389167` — transcript-derived idempotent change detector
- `WorkflowSizeStatusHint` (kya) - `:651528` — ` · medium size (/config)` status-line suffix
- `computeWorkflowSizeWarning` (z5f) - `:747613` — the over-size banner; where an explicit guideline gains teeth
- `sizeToAgentCap` (uEd) - `:389121` — size → number, used only by the warning
- `positiveFiniteOrUndefined` (Kli) - `:747610` — env/gate numeric sanitiser
- `hasExplicitWorkflowSizeGuideline` (whm) - `:814920` — suppresses the two size-prompting tips
- `WorkflowTool` (S6y) - `:389355` — the tool definition whose `prompt()`/`description()` carry the suffix
- `WORKFLOW_TOOL_PROSE` (rMs) - `:388943` — the 159-line base description
- `WORKFLOW_SIZE_AGENT_CAPS` (tko) - `:389147` — `{ small: 5, medium: 15, large: 50 }`
- `DEFAULT_WORKFLOW_SIZE` (cEd) - `:389143` — `"medium"`
- `WORKFLOW_SIZE_VALUES` (nMs) - `:389146` — the enum order used for the `/config` options list
- `GLOBAL_CONFIG_KEYS` (t4o) - `:537104` — `workflowSizeGuideline` appended at `:537152`
- `getLoadedSettings` (SI) - `:1861` — merged settings-file cache
- `getConfig` (xt) - `:536338` — the `.claude.json` config store
