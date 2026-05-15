# `/model` Mid-Conversation Switch Warning (v2.1.110)

## What changed

v2.1.88 had no mid-conversation safety warning for `/model`: typing
`/model claude-sonnet-4-6` mid-conversation would silently switch the
model. The user's next message would then trigger a full
context-rebuild on the new model (because Anthropic's prompt cache is
**model-scoped** — each model has its own cache namespace, so switching
forces a fresh cache write on the new model).

v2.1.110 added an interactive confirmation dialog. When the user picks
a different model in the picker (or types `/model <other>` with an
active conversation), a **"Switch model?"** modal appears with the
text:

> This conversation is cached for the current model. Switching to
> **<NewModel>** means the full history gets re-read on your next
> message.
>
> Yes, switch to <NewModel>
> No, go back
>
> Your next response will be slower and use more tokens

The user must explicitly confirm. Cancel/Esc returns to the picker
without changing models.

## Source: v2.1.88 baseline

v2.1.88's `/model` command was a straight-through "set and apply":

- Parse arg → resolve to canonical model ID → write to app config →
  refresh the main-loop model state → emit a telemetry event → close.
- No interstitial UI.
- No mention of cache invalidation cost in any user-facing copy.

The reason it was tolerable in v2.1.88: prompt caching was less
aggressive — the 5-minute TTL was shorter and the typical
conversation-length-vs-cache-cost trade-off was different.

By v2.1.110, the 1-hour TTL cache had become standard, and conversations
routinely amortized a cache-write across many turns. A surprise cache
flush mid-conversation could turn a $0.01 next-message into a $0.30
next-message — large enough to surprise even sophisticated users.

## Source: v2.1.112 obfuscated chunks

### The confirmation dialog component

```javascript
// ============================================
// ModelSwitchConfirmationDialog - "Switch model?" modal with cache warning
// Location: chunks.188.mjs:2206-2266
// ============================================

// ORIGINAL (for source lookup):
function taK(q) {
    let K = s(24),
        { toModel: _, onConfirm: z, onCancel: Y } = q,
        A;
    if (K[0] !== _) A = fL(_), K[0] = _, K[1] = A;
    else A = K[1];
    let O;
    if (K[2] !== A) O = gJ.createElement(T, null,
        "This conversation is cached for the current model. Switching to", " ",
        gJ.createElement(T, { bold: !0 }, A),
        " means the full history gets re-read on your next message."
    ), K[2] = A, K[3] = O;
    else O = K[3];
    let w;
    if (K[4] !== _) w = fL(_), K[4] = _, K[5] = w;
    else w = K[5];
    let $ = `Yes, switch to ${w}`, j;
    if (K[6] !== $) j = { label: $, value: "yes" }, K[6] = $, K[7] = j;
    else j = K[7];
    let H;
    if (K[8] === Symbol.for("react.memo_cache_sentinel"))
        H = { label: "No, go back", value: "no" }, K[8] = H;
    else H = K[8];
    let J;
    if (K[9] !== j) J = [j, H], K[9] = j, K[10] = J;
    else J = K[10];
    let X;
    if (K[11] !== Y || K[12] !== z)
        X = (D) => D === "yes" ? z() : Y(), K[11] = Y, K[12] = z, K[13] = X;
    else X = K[13];
    // …(picker render, container with title "Switch model?" + subtitle)…
    let W;
    if (K[21] !== Y || K[22] !== P)
        W = gJ.createElement(R1, {
            title: "Switch model?",
            subtitle: "Your next response will be slower and use more tokens",
            color: "warning",
            onCancel: Y,
            hideInputGuide: !0
        }, P),
        K[21] = Y, K[22] = P, K[23] = W;
    else W = K[23];
    return W
}

// READABLE (for understanding):
function ModelSwitchConfirmationDialog({ toModel, onConfirm, onCancel }) {
  // Resolve the new model to its display name (e.g. "Sonnet 4.6").
  const newModelDisplay = formatModelName(toModel);

  const warningText = (
    <Text>
      This conversation is cached for the current model. Switching to{" "}
      <Text bold>{newModelDisplay}</Text>{" "}
      means the full history gets re-read on your next message.
    </Text>
  );

  // Yes/No picker.
  const yesOption = { label: `Yes, switch to ${newModelDisplay}`, value: "yes" };
  const noOption  = { label: "No, go back", value: "no" };

  const handleSelect = (value) => {
    if (value === "yes") onConfirm();
    else onCancel();
  };

  return (
    <DialogContainer
      title="Switch model?"
      subtitle="Your next response will be slower and use more tokens"
      color="warning"
      onCancel={onCancel}
      hideInputGuide
    >
      <Box flexDirection="column" gap={1}>
        {warningText}
        <SelectInput
          options={[yesOption, noOption]}
          onChange={handleSelect}
          onCancel={onCancel}
        />
      </Box>
    </DialogContainer>
  );
}

// Mapping: taK→ModelSwitchConfirmationDialog, fL→formatModelName,
//          gJ→React, T→Text, u→Box, A1→SelectInput, R1→DialogContainer
```

### Trigger point: `/model` slash command + picker

The dialog is triggered from two paths:
1. **`/model <name>` typed**: After parsing the arg, the handler checks
   whether the current session has a transcript (i.e. a conversation
   is in progress). If yes, it routes through the confirmation dialog
   before applying.
2. **Model picker (interactive `/model` with no arg)**: When the user
   selects a different model in the picker, the same dialog appears
   before committing.

The cache-invalidation check is purely "did the user pick a different
model?" — it does not inspect actual cache state (the system has no
direct visibility into the upstream cache TTL).

### Related: `frY` — the `/model` no-arg "current" path

```javascript
// ============================================
// ShowCurrentModelFC - /model with no args, shows current model + effort
// Location: chunks.188.mjs:2286-2294
// ============================================

// ORIGINAL (for source lookup):
function frY(q) {
    let { onDone: K } = q,
        _ = M8(TrY), z = M8(vrY), Y = M8(GrY),
        A = fL(_),
        O = Y !== void 0 ? ` (effort: ${Y})` : "";
    if (z) K(`Current model: ${Y8.bold(fL(z))} (session override from plan mode)
Base model: ${A}${O}`);
    else K(`Current model: ${A}${O}`);
    return null
}

// READABLE (for understanding):
function ShowCurrentModelFC({ onDone }) {
  const baseModel    = useAppState(s => s.mainLoopModel);
  const sessionOverride = useAppState(s => s.mainLoopModelForSession);
  const effortValue  = useAppState(s => s.effortValue);

  const baseDisplay  = formatModelName(baseModel);
  const effortSuffix = effortValue !== undefined ? ` (effort: ${effortValue})` : "";

  if (sessionOverride) {
    onDone(`Current model: ${chalk.bold(formatModelName(sessionOverride))} (session override from plan mode)
Base model: ${baseDisplay}${effortSuffix}`);
  } else {
    onDone(`Current model: ${baseDisplay}${effortSuffix}`);
  }
  return null;
}

// Mapping: frY→ShowCurrentModelFC, M8→useAppState, fL→formatModelName, Y8→chalk
```

This path doesn't switch models, so no warning. It's the read-only
inspect.

### Related: 1M-context warnings (`DrY`, `ZrY`)

```javascript
// ============================================
// needsOpus1mWarning / needsSonnet1mWarning - 1M-context tier gate
// Location: chunks.188.mjs:2276-2284
// ============================================

// ORIGINAL (for source lookup):
function DrY(q) {
    let K = q.toLowerCase();
    return !Ql() && !YX() && K.includes("opus") && K.includes("[1m]")
}
function ZrY(q) {
    let K = q.toLowerCase();
    return !rt() && (K.includes("sonnet[1m]") || K.includes("sonnet-4-6[1m]"))
}

// READABLE (for understanding):
function needsOpus1mWarning(modelArg) {
  const lc = modelArg.toLowerCase();
  // User asked for opus[1m] but isn't on Max-tier (or 1M not available).
  return !is1MUsageGranted() && !isOpus47LaunchEligibleTier()
         && lc.includes("opus") && lc.includes("[1m]");
}

function needsSonnet1mWarning(modelArg) {
  const lc = modelArg.toLowerCase();
  // User asked for sonnet[1m]/sonnet-4-6[1m] but isn't on the right tier.
  return !is1MContextAllowed() && (lc.includes("sonnet[1m]") || lc.includes("sonnet-4-6[1m]"));
}

// Mapping: DrY→needsOpus1mWarning, ZrY→needsSonnet1mWarning,
//          Ql→is1MUsageGranted, YX→isOpus47LaunchEligibleTier, rt→is1MContextAllowed
```

These are separate warnings (1M-context gating) but live in the same
file as the model-switch warning and follow the same pattern (warn,
let the user confirm/cancel).

## Why this approach

### Why warn at all instead of just doing the switch?

**What:** A confirmation dialog is shown before the model switch
commits.

**Why:**
- **Anthropic's prompt cache is model-scoped**: each model
  (`claude-opus-4-7`, `claude-sonnet-4-6`, etc.) has its own cache
  namespace. Switching invalidates the cache *only on the new model* —
  the next request to that new model needs the full conversation
  rebuilt as a cache write.
- **The cost differential is significant**: a 100k-token conversation
  that was being served at cache-read pricing (~$0.001/1k tokens for
  read) suddenly costs cache-write pricing (~$0.003/1k tokens for write,
  $0.01/1k for output) plus the *full input cost* (~$0.015/1k tokens
  for Opus). A $0.01 turn can become a $1+ turn.
- **The latency differential is also significant**: cache reads are
  fast (~50ms per 10k tokens). Cache writes are slow (~500ms per 10k
  tokens). On a long conversation, this can be the difference between
  3-second and 30-second response latency.

**Why a dialog, not a flag:**
- A flag (`--no-warn-on-model-switch`) would let power users disable
  the warning, but it adds discoverability problems for new users.
- A dialog forces a deliberate confirmation, ensuring the user has
  understood the trade-off at least once.

### The wording: "the full history gets re-read"

**What:** The dialog says "the full history gets re-read on your next
message," not "the cache is invalidated."

**Why:**
- "Cache" is a technical term most users don't know.
- "History gets re-read" is concrete and tied to the user's intent
  ("my full conversation is being processed").
- Saying "your next response will be slower and use more tokens" in the
  subtitle ties the abstract concept to user-visible consequences
  (latency, cost).

**Trade-off:** Power users who understand caching might want more
explicit "cache invalidation" wording for clarity. The team chose to
optimize for accessibility (most users) rather than technical precision.

### The "Yes, switch to X" / "No, go back" framing

**What:** The picker shows two specific options with model name in the
"Yes" label and clear cancellation in the "No" label.

**Why:**
- **Naming the destination in the Yes option** prevents accidental
  confirmations. The user can't accidentally hit "Yes" without seeing
  what model they're switching to.
- **"No, go back" is more reassuring than "Cancel"** — it indicates
  the user can recover their previous state, which matches the
  technical reality (the model hasn't been switched yet).

### Why color "warning" (and not "destructive")?

**What:** The dialog uses `color: "warning"` (typically yellow/amber),
not `color: "destructive"` (red).

**Why:**
- The action isn't destructive — no data is lost; conversation is
  preserved.
- The action does have *cost consequences* — the next response uses
  more tokens.
- "Warning" yellow signals "be careful" without signaling "you might
  lose work."

### Why only on model switch, not on effort switch?

**What:** `/effort` does not produce a similar warning, even though
changing effort *also* affects the cache (because the system prompt
includes the effort-suffix indicator).

**Why:**
- **Effort changes are cheap**: the system prompt is small, so the
  cache write overhead is dominated by the larger conversation cache
  (which stays valid).
- **Effort is a smaller change**: effort affects thinking budget, not
  model identity. The cache impact is at most an extra system-prompt
  write, not the entire conversation.
- **Effort changes are more frequent**: users iterate on effort within
  a session more often than on model. A warning on every effort change
  would be UX noise.

### Why no automatic post-switch caching pre-warm?

**What:** After confirming the switch, the system just commits the
model change. It doesn't pre-emptively send a request to warm up the
cache on the new model.

**Why:**
- A pre-warm would add a synthetic request that the user didn't ask
  for. This would violate the user's mental model ("I told you to
  switch; you should switch, not also send a request").
- The cache warm-up happens naturally on the next user message.
- An eager pre-warm could double-up costs in cases where the user
  switches but then doesn't message that model.

### The picker integration

**What:** Both `/model <name>` typed and the interactive picker route
through the same `ModelSwitchConfirmationDialog`.

**Why:**
- A single dialog component reused across entry points avoids
  inconsistency.
- The picker's "Yes" → commit → close-and-relaunch flow uses the same
  state mutation as the typed-arg path.

**Key insight:** The dialog is **stateless** — it accepts `toModel`
and renders the warning + picker. It doesn't know whether the trigger
was typed or interactive. This decoupling means future entry points
(e.g. plan-mode model overrides) can reuse the dialog without changes.

## Cross-validation: v2.1.88 → v2.1.112

| Aspect | v2.1.88 | v2.1.112 | Δ |
|--------|---------|----------|---|
| `/model <name>` | Direct switch | Warning dialog if conversation active | New behavior |
| Picker confirm | Direct switch | Routed through `ModelSwitchConfirmationDialog` | New |
| Dialog wording | (n/a) | "full history gets re-read on your next message" | New |
| Subtitle | (n/a) | "Your next response will be slower and use more tokens" | New |
| Cancel path | (n/a — nothing to cancel) | "No, go back" + Esc/Ctrl+C all work | New |
| Color | (n/a) | warning yellow | New |
| 1M-context warnings | (n/a) | `DrY`/`ZrY` for Opus/Sonnet 1M tier gates | New (related) |
| `/model` no-arg | Prints current model | Prints current model + effort + session override info | Enhanced |

## Related symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) - scoped diff index
> - [symbol_additions_unit_16.md](../00_overview/symbol_additions_unit_16.md) - new symbols from this unit

Key functions in this document:
- `ModelSwitchConfirmationDialog` (taK) — "Switch model?" modal; chunks.188.mjs:2206-2266
- `ShowCurrentModelFC` (frY) — `/model` no-arg current display; chunks.188.mjs:2286-2294
- `needsOpus1mWarning` (DrY) — Opus 1M gate warning predicate; chunks.188.mjs:2276-2279
- `needsSonnet1mWarning` (ZrY) — Sonnet 1M gate warning predicate; chunks.188.mjs:2281-2284
- `isModelPickerCommand` (WrY) — filters known --model aliases; chunks.188.mjs:2272-2274
- `resolveModelOrInitialForPicker` (aaK) — `/model` picker model resolver; chunks.188.mjs:2268-2270
- `formatModelName` (fL) — pretty model display name
- `chalkStyles` (Y8) — ANSI bold/color writer
