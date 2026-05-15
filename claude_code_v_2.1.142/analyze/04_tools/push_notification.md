# PushNotification — Terminal + Mobile (Remote Control) Notification

> **Tool name:** `PushNotification`
> **Source:** `cli_inner_pretty.js:386004-386094` (`DH5` declaration)
> **Search hint:** *send a notification to the user via terminal and optionally mobile*
> **Concurrency-safe:** true · **Read-only:** true

---

## Overview

`PushNotification` sends a desktop notification via the terminal (OSC escape sequences) and, when Remote Control is active, also pushes to the user's phone via claude.ai's notification channel. The tool's `status: "proactive"` literal is hard-required — it has no `"normal"` status because notifications are by definition proactive interruptions.

The tool ships disabled in most non-Kairos contexts (`xT("tengu_kairos_push_notifications", false, 300_000)` 5-min cache); when active it's gated through several runtime suppressors before any notification actually leaves the process.

---

## Schema

```javascript
// ============================================
// pushNotificationInputSchema - OH5
// Location: cli_inner_pretty.js:385982-385987
// ============================================

// ORIGINAL (for source lookup):
OH5 = yH(() =>
  y.strictObject({
    message: y.string().describe("The notification body. Keep it under 200 characters; mobile OSes truncate."),
    status: y.literal("proactive"),
  }),
);

// READABLE (for understanding):
const pushNotificationInputSchema = lazySchema(() =>
  z.strictObject({
    message: z.string().describe("The notification body. Keep it under 200 characters; mobile OSes truncate."),
    status: z.literal("proactive"),
  }),
);

// Mapping: OH5→pushNotificationInputSchema
```

Output includes `pushSent`, `localSent`, `disabledReason` (`config_off | user_present | no_transport`), `idleSec`, `hasFocus`, and `sentAt`.

---

## Key Behavior

### Three suppression paths

```javascript
// ============================================
// PushNotification.call - tri-state suppression with telemetry
// Location: cli_inner_pretty.js:386052-386094
// ============================================

// READABLE (logic):
async function call({ message }, context) {
  const sentAt = new Date().toISOString();
  const isRemote = isInRemoteEnv() || isInteractiveRemote();
  const inAgentMode = isRemote || isInBackgroundAgent();

  // (1) Config opt-out — except when running as remote/background.
  if (inAgentMode && !isRemote && !getConfig("agentPushNotifEnabled", false).value)
    return { data: { ..., disabledReason: "config_off" } };

  // (2) User-present guard — terminal has focus, OR recent keystroke.
  if (isUserPresent()) {
    const idleSec = Math.round((Date.now() - lastKeystrokeAt()) / 1000);
    const hasFocus = getTerminalFocus();
    return { data: { ..., disabledReason: "user_present", idleSec, hasFocus } };
  }

  // (3) Transport check — push only if Remote Control connected.
  const localOnly = !context.sendOSNotification ? false : true;
  if (localOnly) context.sendOSNotification?.({ message, notificationType: "push_notification" });
  // ... HTTP push to claude.ai if Remote Control connected ...
}
```

The "user present" guard considers two signals:
- **Idle time** — if `Date.now() - fT()` (last-keystroke timestamp) is under `Nv$ / 1000` seconds, user is "present".
- **Terminal focus** — `yXH()` returns OSC-1004 focus state; if the terminal has focus the user is also "present".

A "present" user gets no notification (push or local).

### Result rendering

The tool's result message is intentionally *visible to the model* even when the push wasn't actually sent:

| disabledReason | Result message |
|----------------|---------------|
| (none)         | "Terminal notification sent. Mobile push requested." |
| `config_off`   | "Push not sent — mobile push is disabled in /config." |
| `user_present` + focus | "Not sent — terminal has focus. Terminal + mobile suppressed." |
| `user_present` + idle | "Not sent — user active (last keystroke Xs ago, threshold Ys ago). ..." |
| `no_transport` | "Mobile push not sent (Remote Control inactive)." |

The model is told via prompt: "If the result says the push wasn't sent, that's expected — no action needed." This stops the model from re-trying or apologizing about the suppression.

---

## Key Insights

**The 200-character mobile-truncate limit and `"under 200 characters"` instruction is load-bearing.** iOS and Android both truncate notification bodies aggressively; pushing 500 chars wastes API quota and the user only sees the first ~50. The prompt explicitly says: *"Lead with what they'd act on — 'build failed: 2 auth tests' tells them more than 'task done' and more than a status dump."*

**Why `status: literal("proactive")` is required (not `enum(["proactive"])`)?** The literal type makes it impossible to provide *any* other value — there's no "normal" notification because a notification that *isn't* proactive is just chat output, which goes through SendUserMessage instead. The literal also ensures the tool's auto-classifier input has a stable shape.

**`isUserPresent()` is the cost-control gate.** Without it, the model could notify on every minor event and accumulate annoying mobile pushes. The user-present check assumes: "if the user is sitting at the terminal, they don't need a notification." This is conservative — a user can be near but looking away — but errs in the safer direction.

**Tool gives the model *both* `idleSec` and `hasFocus` in its result.** This lets the model decide whether to call PushNotification again later if the user goes idle. The model isn't supposed to use these to re-notify proactively, but they're available for follow-up decisions.

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.142:** Background agents crash-loop fixes for Chrome extension-related notification paths.
- **v2.1.139:** Remote Control disabled when `ANTHROPIC_API_KEY` is set — `claudeAuthEnabled` requirement extends to PushNotification.
- **v2.1.121:** `agentPushNotifEnabled` config is now honored even on Remote Control re-enrollment.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Notification / User Channel*

Key functions in this document:
- `PushNotificationTool` (`DH5`) — declaration with proactive-only literal
- `pushNotificationInputSchema` (`OH5`) — strict { message, status: "proactive" }
- `isUserPresent` (`xV8`) — idle + focus suppression
- `getLastUserKeystroke` (`fT`) — for idleSec computation
- `getTerminalFocus` (`yXH`) — OSC-1004 focus state
- `PUSH_USER_PRESENT_THRESHOLD_MS` (`Nv$`) — idle-window cutoff
