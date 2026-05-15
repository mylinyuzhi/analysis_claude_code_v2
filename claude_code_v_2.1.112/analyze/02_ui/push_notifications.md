# Push Notification Tool (v2.1.110) — v2.1.112

## Overview

v2.1.110 added a **deferred tool** called `PushNotification` that lets the model send a notification to the user's terminal and — when Remote Control is connected and the per-user "Push when Claude decides" config is enabled — also push to their mobile device.

The intent: a long-running task can finish or hit a blocker, and the model can proactively alert the user who has walked away.

This is the **second** tool that ships as deferred (after `Monitor` in v2.1.98). Both load lazily via `ToolSearch` to keep the default tool set small while still letting the model reach for them when needed.

## Tool Definition

```javascript
// ============================================
// PushNotificationTool - deferred tool for terminal + mobile alerts
// Location: chunks.152.mjs:2184-2295
// ============================================

// Tool name constant (chunks.101.mjs:1261):
ic = "PushNotification"

// Default rollout interval (chunks.152.mjs):
YJY = 300000  // 5 minutes (feature-flag refresh interval)

// READABLE (synthesized from chunks.152):
const PushNotificationTool = createTool({
  name: "PushNotification",
  searchHint: "send a notification to the user via terminal and optionally mobile",
  maxResultSizeChars: 1000,
  userFacingName: () => "PushNotification",
  inputSchema: z.strictObject({
    message: z.string().min(1).describe("The notification body. Keep it under 200 characters; mobile OSes truncate."),
    status: z.literal("proactive")           // forces the model to commit "this is a proactive alert"
  }),
  outputSchema: z.object({
    message: z.string(),
    pushSent: z.boolean().optional(),
    localSent: z.boolean().optional(),
    disabledReason: z.enum(["config_off", "user_present", "bridge_inactive"]).optional(),
    idleSec: z.number().optional(),
    hasFocus: z.boolean().optional(),
    sentAt: z.string().optional().describe("ISO timestamp captured at tool execution on the emitting process. Optional — resumed sessions replay pre-sentAt outputs verbatim.")
  }),
  shouldDefer: true,                           // load via ToolSearch on first use
  isEnabled: () => XD("tengu_kairos_push_notifications", false, 300000),  // feature gate, 5min cache
  isConcurrencySafe: () => true,
  isReadOnly: () => true,                       // does NOT modify the filesystem
  toAutoClassifierInput: (input) => input.message,
  description: async () => PUSH_DESCRIPTION,
  prompt: async () => PUSH_FULL_PROMPT,
  mapToolResultToToolResultBlockParam: (result, toolUseId) => {
    // Translate structured result back into a human-readable tool_result string for the model
    let text;
    if (result.disabledReason === "config_off") {
      text = "Push not sent — mobile push is disabled in /config.";
    } else if (result.disabledReason === "user_present") {
      if (result.hasFocus === true) {
        text = "Not sent — terminal has focus. Terminal + mobile suppressed.";
      } else {
        const threshold = USER_IDLE_THRESHOLD_MS / 1000;
        text = `Not sent — user active (last keystroke ${result.idleSec !== undefined ? `${result.idleSec}s` : `<${threshold}s`} ago, threshold ${threshold}s). Terminal + mobile suppressed.`;
      }
    } else if (result.disabledReason === "bridge_inactive") {
      text = result.localSent
        ? "Terminal notification sent. Mobile push not sent (Remote Control inactive)."
        : "Mobile push not sent (Remote Control inactive).";
    } else {
      text = result.localSent
        ? "Terminal notification sent. Mobile push requested."
        : "Mobile push requested.";
    }
    return { tool_use_id: toolUseId, type: "tool_result", content: text };
  },
  call: pushNotificationCall                   // see below
});

// Mapping: AJY→PushNotificationTool, ic→PUSH_NOTIFICATION_TOOL_NAME,
//          cI4→PUSH_DESCRIPTION, lI4→PUSH_FULL_PROMPT, YJY→USER_IDLE_THRESHOLD_MS,
//          XD→getFeatureFlagWithCache
```

### Tool `call` Implementation

```javascript
// ============================================
// pushNotificationCall - decides terminal/mobile send paths
// Location: chunks.152.mjs:2233-2294
// ============================================

// READABLE (synthesized from chunks.152):
async function pushNotificationCall({ message }, ctx) {
  const sentAt = new Date().toISOString();
  const config = getAppConfig();
  const bridgeActive = isRemoteControlBridgeActive();

  // Gate 1: User config opt-in for *mobile* push.
  if (bridgeActive && !(config.agentPushNotifEnabled ?? false)) {
    return {
      data: { message, pushSent: false, localSent: false, disabledReason: "config_off", sentAt }
    };
  }

  const logSend = (pushSent, localSent) => {
    logEvent("tengu_push_notification_send", {
      message_length: message.length,
      push_sent: pushSent,
      local_sent: localSent
    });
  };

  // Gate 2: User actively at the keyboard? Don't disturb them.
  if (isUserActivelyPresent()) {
    const idleSec = Math.round((Date.now() - lastKeystrokeAt()) / 1000);
    const hasFocus = getTerminalFocus();
    logSend(false, false);
    return {
      data: {
        message, pushSent: false, localSent: false,
        disabledReason: "user_present",
        idleSec,
        ...(hasFocus !== undefined && { hasFocus }),
        sentAt
      }
    };
  }

  // Local OS notification path — always try if the harness supports it.
  const canSendOSNotification = ctx.sendOSNotification !== undefined;
  if (canSendOSNotification) {
    ctx.sendOSNotification?.({ message, notificationType: "push_notification" });
  }

  // No bridge? Local was best we could do.
  if (!bridgeActive) {
    logSend(false, canSendOSNotification);
    return {
      data: { message, pushSent: false, localSent: canSendOSNotification, disabledReason: "bridge_inactive", sentAt }
    };
  }

  // Bridge active → mobile push is requested (actual sending happens out-of-band).
  logSend(true, canSendOSNotification);
  return {
    data: { message, pushSent: true, localSent: canSendOSNotification, sentAt }
  };
}

// Mapping: q11→isRemoteControlBridgeActive, n61→isUserActivelyPresent,
//          AV→lastKeystrokeAt, vD6→getTerminalFocus, H8→getAppConfig,
//          d→logEvent, ctx.sendOSNotification - injected via tool-use-context
```

## The Tool Prompt — Discipline-via-Prompt

```javascript
// ============================================
// PUSH_FULL_PROMPT (lI4) - tool description with behavioral guardrails
// Location: chunks.152.mjs (assigned by JVK module init)
// ============================================

const PUSH_FULL_PROMPT = `This tool sends a desktop notification in the user's terminal. If Remote Control is connected, it also pushes to their phone. Either way, it pulls their attention from whatever they're doing — a meeting, another task, dinner — to this session. That's the cost. The benefit is they learn something now that they'd want to know now: a long task finished while they were away, a build is ready, you've hit something that needs their decision before you can continue.

Because a notification they didn't need is annoying in a way that accumulates, err toward not sending one. Don't notify for routine progress, or to announce you've answered something they asked seconds ago and are clearly still watching, or when a quick task completes. Notify when there's a real chance they've walked away and there's something worth coming back for — or when they've explicitly asked you to notify them.

Keep the message under 200 characters, one line, no markdown. Lead with what they'd act on — "build failed: 2 auth tests" tells them more than "task done" and more than a status dump.

If the result says the push wasn't sent, that's expected — no action needed.`
```

### Why a long prose prompt (not just an input schema)

The prompt is unusually long — over 200 words — because it's doing two jobs:

1. **Spec** — input format, output expectations.
2. **Behavioral guidance** — when *not* to use the tool.

The behavioral guidance is what makes this tool useful in practice. Without it, a chatbot trained on "use available tools" would push for every routine status update, accumulating annoyance until users disable notifications altogether.

The guidance is **concrete**:

- "err toward not sending one" — bias framing
- "Don't notify for routine progress" — anti-pattern (one)
- "to announce you've answered something they asked seconds ago" — anti-pattern (two)
- "when a quick task completes" — anti-pattern (three)
- `"build failed: 2 auth tests"` tells them more than `"task done"` — example of *good* message
- `"task done"`, `"a status dump"` — examples of *bad* messages
- `"If the result says the push wasn't sent, that's expected — no action needed"` — handles the failure path gracefully (so the model doesn't try to "fix" the not-sent result by escalating)

This is more effective than a separate system prompt for two reasons:

1. **Proximity** — the guidance is right next to where the model decides whether to call the tool. The model doesn't need to retrieve a system-prompt rule; it reads the rule and the spec together.
2. **Per-call relevance** — only sessions that have the tool loaded (which requires the feature gate AND user opt-in) see this prompt. Sessions without it aren't paying tokens for irrelevant guidance.

### System-prompt augmentation (separate path)

When push is enabled per-config, an additional sentence is injected into the system prompt:

```javascript
function wr1() {
  return e56() ?
    "\n\nWhen an event lands that the user would want to act on now — an error appeared, the status they were waiting on flipped — send a PushNotification. Not every event is worth a push; the ones that change what they'd do next are." :
    "";
}

function e56() {
  return I18() && H8().agentPushNotifEnabled === true;
}
```

The tool description teaches *how*; the system-prompt augmentation teaches *when*. Together they form a discipline layer.

## Triple-Gated Activation

The tool only "lights up" when **three** conditions all hold:

| Gate | Source | Check |
|------|--------|-------|
| 1. Feature flag | `tengu_kairos_push_notifications` | Anthropic-side rollout via GrowthBook |
| 2. User opt-in | `config.agentPushNotifEnabled === true` | Per-user `/config` toggle |
| 3. Bridge active | Remote Control bridge connected | Required for mobile delivery (terminal-only delivery still possible without it) |

The first gate determines whether the *tool* is loaded at all (governs `isEnabled()`). The other two determine whether each `call()` actually delivers.

### Why so many gates

Push notifications are intrusive in a way that's hard to reverse. Default-off + multiple opt-in gates ensures:

1. No surprise pushes for users who haven't asked.
2. Anthropic can roll back the feature server-side without a release.
3. Bridge-inactive users still get a usable terminal-only notification without the mobile failure mode.

## Behavior When Suppressed

The `disabledReason` enum and `mapToolResultToToolResultBlockParam` are how the model learns "I tried to send, here's what happened." Important: the model is told the suppression **happened gracefully**:

- `config_off` → "Push not sent — mobile push is disabled in /config."
- `user_present` → "Not sent — terminal has focus. Terminal + mobile suppressed." or `"Not sent — user active (last keystroke 3s ago, threshold 5s). Terminal + mobile suppressed."`
- `bridge_inactive` → "Terminal notification sent. Mobile push not sent (Remote Control inactive)." (if local was sent) or "Mobile push not sent (Remote Control inactive)." (if not)

The tool prompt explicitly addresses these in the last line: *"If the result says the push wasn't sent, that's expected — no action needed."* This prevents the model from chasing the result by trying alternate notification methods or apologizing — both common LLM failure modes.

## Why `shouldDefer: true`

Deferred tools are not in the default tool list. They're discovered via `ToolSearch` when the model decides "I might need a push tool now" and queries for it. Trade-offs:

| Aspect | If in default set | Deferred |
|--------|-------------------|----------|
| Tokens consumed per request | Full tool spec every turn | Zero until model searches |
| Latency to first use | Zero | One ToolSearch round-trip |
| Discoverability | Always visible | Requires the model to know it exists or look |

For a tool that's used rarely (push notifications are by design rare), deferred is the right tradeoff. The model can always find it via `ToolSearch("push notification")`.

The `searchHint: "send a notification to the user via terminal and optionally mobile"` is what `ToolSearch` indexes for keyword retrieval.

## Telemetry

- `tengu_push_notification_send` — Fired on every `call()` with `{ message_length, push_sent, local_sent }`.

The team tracks `push_sent / total` and `local_sent / total` to gauge: (a) how often the gating actually suppresses sends and (b) whether bridge connectivity is the bottleneck.

## Cross-Validation with v2.1.88

```bash
$ grep -rln "PushNotification\|push_notification" /lyz/codespace/3rd/claude-code/src/
/lyz/codespace/3rd/claude-code/src/tools.ts
```

The v2.1.88 source `src/tools.ts` references the name but as a **stub registration** (the tool itself didn't exist yet). The full tool implementation is a v2.1.110 addition; v2.1.88's `src/tools.ts` shows scaffolding without the runtime.

The v2.1.88 source has **no `wr1`/`e56`** system-prompt augmentation, no `agentPushNotifEnabled` config field, and no `tengu_kairos_push_notifications` feature flag. All of these are v2.1.110 additions.

## Related Symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) - Canonical
> - [symbol_additions_unit_11.md](../00_overview/symbol_additions_unit_11.md) - This unit

Key functions and constants:
- `PushNotificationTool` (`AJY`) - The deferred tool wrapper (chunks.152.mjs:2184-2295)
- `PUSH_NOTIFICATION_TOOL_NAME` (`ic`) - The string `"PushNotification"` (chunks.101.mjs:1261)
- `PUSH_DESCRIPTION` (`cI4`) - Short tool description (chunks.152.mjs)
- `PUSH_FULL_PROMPT` (`lI4`) - Long behavior-guidance prompt (chunks.152.mjs)
- `pushInputSchema` (`_JY`) - Zod schema for input (chunks.152.mjs:2173-2175)
- `pushOutputSchema` (`zJY`) - Zod schema for output (chunks.152.mjs:2176-2183)
- `USER_IDLE_THRESHOLD_MS` (`YJY`) - 300000 (5 min) for feature-flag cache (chunks.152.mjs:2160)
- `getPushSystemPromptAugment` (`wr1`) - System-prompt sentence when push is enabled (chunks.101.mjs)
- `isPushNotificationEnabled` (`e56`) - `I18() && config.agentPushNotifEnabled` (chunks.101.mjs)
- `isRemoteControlBridgeActive` (`q11`) - Remote Control bridge status (chunks.* utility)
- `isUserActivelyPresent` (`n61`) - Heuristic — last-keystroke vs threshold (chunks.* utility)

v2.1.88 cross-reference: only the *name* `PushNotification` exists in `src/tools.ts` as a stub; the implementation, the prompt, the gating, the schemas, and the config field are all v2.1.110 additions.
