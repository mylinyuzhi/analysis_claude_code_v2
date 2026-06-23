/**
 * PushNotificationTool — pull the user's attention back to this session. Always emits a desktop
 * notification in the user's terminal and, when Remote Control is connected, also pushes to their
 * phone. The tool is deliberately conservative: it suppresses sending when the user is clearly
 * present (recent keystrokes / focused terminal) or when mobile push is disabled in /config, and
 * reports the suppression as a `disabledReason` rather than failing.
 *
 * No direct v2.1.88 mirror exists (PushNotification is post-2.1.88); reconstructed wholly from the
 * v2.1.183 bundle. Closest convention sibling in 2.1.88 is `tools/BriefTool` / the user-channel
 * tools (proactive `status` literal, `toAutoClassifierInput`, `mapToolResultToToolResultBlockParam`).
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   :220751            G9   = name const "PushNotification"
 *   :220761-220763     KOi  = prompt() (routine-summary append branch)
 *   :220764            OHd  = "<routine_summary>" tag const
 *   :220765-220773     zOi/VOi = description / base prompt consts
 *   :220774,:220779-220781  NHd = routine-summary suffix (declared 220774, assigned 220779-220781)
 *   :431803            pRp  = isEnabled feature-flag cache TTL (300000 ms)
 *   :431815-431834     uRp/dRp = input / output Zod schemas
 *   :431836-431929     fRp  = the tool object (isEnabled, call branches, mapToolResult)
 *   :436566 / :436706  membership in getAllBaseTools (LW) via the lazy slot `oKa`
 * 2.1.88 convention mirror: src/tools/BriefTool (proactive status + user-channel tool shape)
 * 2.1.156 scaffold: 04_tools/README.md (carryover; not re-detailed)
 * Cross-validation: description/base-prompt strings quoted verbatim from the bundle (match
 *   assets/tools/PushNotification.md); the five-way call branch + result strings read at :431884-431928.
 */

import { z } from "zod/v4";
import type { ToolDef, ToolUseContext } from "../Tool";
import { buildTool } from "../Tool";
import { lazySchema } from "../utils/lazySchema";

// helper: yK @bundle — getFeatureValue_CACHED (flag read with a per-call cache TTL).
import { getFeatureValueCached as yK } from "../services/analytics/growthbook";
// helper: st @bundle — parseBooleanEnv; _a @bundle — isRemoteControlSession; hk @bundle — hasNotificationTransport.
import { parseBooleanEnv as st } from "../utils/env";
import { isRemoteControlSession as _a, hasNotificationTransport as hk } from "../services/remoteControl";
// helper: Ec @bundle — getConfigValue (agentPushNotifEnabled); Mtr @bundle — isUserPresent;
//   U0 @bundle — lastKeystrokeTimestamp; VMe @bundle — terminalHasFocus (or undefined if unknown);
//   LKt @bundle — USER_PRESENT_IDLE_THRESHOLD_MS.
import { getConfigValue as Ec } from "../config";
import {
  isUserPresent as Mtr,
  lastKeystrokeTimestamp as U0,
  terminalHasFocus as VMe,
  USER_PRESENT_IDLE_THRESHOLD_MS as LKt,
} from "../services/userPresence";
// helper: wen @bundle — isRoutineSession (scheduled-routine run); G @bundle — logEvent; os @bundle — telemetry redactor.
import { isRoutineSession as wen } from "../services/routines";
import { logEvent as G } from "../services/analytics";
import { renderToolUseMessage, renderToolResultMessage } from "./PushNotificationTool.UI";

// 2.1.183: PUSH_NOTIFICATION_TOOL_NAME = G9 @cli_inner_pretty.js:220751
export const PUSH_NOTIFICATION_TOOL_NAME = "PushNotification";

// Feature-flag cache TTL for isEnabled. 2.1.183: pRp @cli_inner_pretty.js:431803
const PUSH_FLAG_CACHE_MS = 300_000;

// <routine_summary> wrapper tag the model uses inside routines. 2.1.183: OHd @cli_inner_pretty.js:220764
const ROUTINE_SUMMARY_TAG = "<routine_summary>";

// 2.1.183: DESCRIPTION = zOi @cli_inner_pretty.js:220765-220766  (verbatim)
const DESCRIPTION =
  "Send a notification to the user via their terminal and, when Remote Control is connected, also push to their mobile device";

// 2.1.183: BASE_PROMPT = VOi @cli_inner_pretty.js:220767-220773  (verbatim; matches assets/tools/PushNotification.md)
const BASE_PROMPT = `This tool sends a desktop notification in the user's terminal. If Remote Control is connected, it also pushes to their phone. Either way, it pulls their attention from whatever they're doing — a meeting, another task, dinner — to this session. That's the cost. The benefit is they learn something now that they'd want to know now: a long task finished while they were away, a build is ready, you've hit something that needs their decision before you can continue.

Because a notification they didn't need is annoying in a way that accumulates, err toward not sending one. Don't notify for routine progress, or to announce you've answered something they asked seconds ago and are clearly still watching, or when a quick task completes. Notify when there's a real chance they've walked away and there's something worth coming back for — or when they've explicitly asked you to notify them.

Keep the message under 200 characters, one line, no markdown. Lead with what they'd act on — "build failed: 2 auth tests" tells them more than "task done" and more than a status dump.

If the result says the push wasn't sent, that's expected — no action needed.`;

// Appended only inside scheduled routines. 2.1.183: NHd @cli_inner_pretty.js:220779-220781  (verbatim)
const ROUTINE_PROMPT_SUFFIX = `

This is a scheduled routine — the notification is how the run reaches its owner. Wrap the message in ${ROUTINE_SUMMARY_TAG} tags: the first sentence becomes the phone banner, the full text becomes the email body.`;

// 2.1.183: prompt() = KOi @cli_inner_pretty.js:220761-220763
// In a routine run the notification is the only delivery channel, so the model is told to wrap
// the body in <routine_summary> tags; otherwise the base prompt is used unchanged.
function buildPrompt(): string {
  return wen() ? BASE_PROMPT + ROUTINE_PROMPT_SUFFIX : BASE_PROMPT;
}

// 2.1.183: inputSchema = uRp @cli_inner_pretty.js:431815-431818
const inputSchema = lazySchema(() =>
  z.strictObject({
    // @431816
    message: z
      .string()
      .min(1)
      .describe("The notification body. Keep it under 200 characters; mobile OSes truncate."),
    // @431817 — push is always proactive (the model never sends a reactive push).
    status: z.literal("proactive"),
  }),
);
type InputSchema = ReturnType<typeof inputSchema>;
export type Input = z.infer<InputSchema>;

// 2.1.183: outputSchema = dRp @cli_inner_pretty.js:431821-431834
const outputSchema = lazySchema(() =>
  z.object({
    message: z.string(),
    pushSent: z.boolean().optional(),
    localSent: z.boolean().optional(),
    disabledReason: z.enum(["config_off", "user_present", "no_transport"]).optional(),
    idleSec: z.number().optional(),
    hasFocus: z.boolean().optional(),
    // @431828-431831
    sentAt: z
      .string()
      .optional()
      .describe(
        "ISO timestamp captured at tool execution on the emitting process. Optional — resumed sessions replay pre-sentAt outputs verbatim.",
      ),
  }),
);
type OutputSchema = ReturnType<typeof outputSchema>;
export type Output = z.infer<OutputSchema>;

// 2.1.183: PushNotificationTool = fRp @cli_inner_pretty.js:431836-431929
export const PushNotificationTool = buildTool({
  name: PUSH_NOTIFICATION_TOOL_NAME,
  searchHint: "send a notification to the user via terminal and optionally mobile", // @431838
  maxResultSizeChars: 1000, // @431839
  userFacingName: () => "PushNotification", // @431840
  shouldDefer: true, // @431847

  get inputSchema(): InputSchema {
    return inputSchema();
  },
  get outputSchema(): OutputSchema {
    return outputSchema();
  },

  // 2.1.183: isEnabled @cli_inner_pretty.js:431848-431850 — single growthbook flag (cached 5 min).
  isEnabled() {
    return yK("tengu_kairos_push_notifications", false, PUSH_FLAG_CACHE_MS);
  },
  isConcurrencySafe() {
    return true; // @431851
  },
  isReadOnly() {
    return true; // @431854 — sending a notification doesn't mutate workspace state.
  },

  toAutoClassifierInput(input: Input) {
    return input.message; // @431857-431859
  },

  async description() {
    return DESCRIPTION;
  },
  async prompt() {
    return buildPrompt();
  },

  // 2.1.183: mapToolResultToToolResultBlockParam @cli_inner_pretty.js:431866-431881
  // Renders the structured result into one user-facing line per disabledReason.
  mapToolResultToToolResultBlockParam(output: Output, toolUseID: string) {
    let content: string;
    if (output.disabledReason === "config_off") {
      content = "Push not sent — mobile push is disabled in /config."; // @431868
    } else if (output.disabledReason === "user_present") {
      if (output.hasFocus === true) {
        content = "Not sent — terminal has focus. Terminal + mobile suppressed."; // @431871
      } else {
        const thresholdSec = LKt / 1000; // @431872
        const idle = output.idleSec !== undefined ? `${output.idleSec}s` : `<${thresholdSec}s`;
        content = `Not sent — user active (last keystroke ${idle} ago, threshold ${thresholdSec}s). Terminal + mobile suppressed.`; // @431873
      }
    } else if (output.disabledReason === "no_transport") {
      content = output.localSent
        ? "Terminal notification sent. Mobile push not sent (Remote Control inactive)." // @431877
        : "Mobile push not sent (Remote Control inactive)."; // @431878
    } else {
      content = output.localSent
        ? "Terminal notification sent. Mobile push requested." // @431879
        : "Mobile push requested."; // @431879
    }
    return { tool_use_id: toolUseID, type: "tool_result", content };
  },

  renderToolUseMessage,
  renderToolResultMessage,

  // 2.1.183: call @cli_inner_pretty.js:431884-431928
  // `emitOsNotification` is the 5th positional argument (`o` in the bundle) — the harness-provided
  // OS-notification sink, present only on the interactive path.
  async call(
    { message }: Input,
    context: ToolUseContext,
    _canUseTool: unknown,
    _assistantMessage: unknown,
    emitOsNotification?: (event: {
      type: "os_notification";
      message: string;
      notificationType: "push_notification";
    }) => void,
  ) {
    const sentAt = new Date().toISOString(); // @431885
    // is-remote: a CCR/Remote-Control runtime — there a mobile transport always exists.
    const isRemote = st(process.env.CLAUDE_CODE_REMOTE) || _a(); // @431886
    const hasTransport = isRemote || hk(); // @431887

    // @431888-431897 telemetry helper (push/local sent + redacted disabled reason).
    const emit = (pushSent: boolean, localSent: boolean, disabledReason?: string) => {
      G("tengu_push_notification_send", {
        message_length: message.length,
        push_sent: pushSent,
        local_sent: localSent,
        is_remote: isRemote,
        disabled_reason: disabledReason, // redacted in the bundle via os(p)
      });
    };

    // Branch 1: local (non-remote) session with a transport but mobile push disabled in config. @431899
    if (hasTransport && !isRemote && !Ec("agentPushNotifEnabled", false).value) {
      emit(false, false, "config_off");
      return {
        data: { message, pushSent: false, localSent: false, disabledReason: "config_off", sentAt },
      };
    }

    // Branch 2: non-remote AND the user is demonstrably present — suppress entirely. @431903
    if (!isRemote && Mtr()) {
      const idleSec = Math.round((Date.now() - U0()) / 1000);
      const hasFocus = VMe();
      emit(false, false, "user_present");
      return {
        data: {
          message,
          pushSent: false,
          localSent: false,
          disabledReason: "user_present",
          idleSec,
          ...(hasFocus !== undefined && { hasFocus }),
          sentAt,
        },
      };
    }

    // Fire the local OS notification (no-op if the harness didn't provide a sink). @431920
    emitOsNotification?.({ type: "os_notification", message, notificationType: "push_notification" });

    // localSent reflects whether there is an interactive terminal to show it in. @431921
    const localSent = !context.options.isNonInteractiveSession;

    // Branch 3: no mobile transport at all — local only. @431923
    if (!hasTransport) {
      emit(false, localSent, "no_transport");
      return {
        data: { message, pushSent: false, localSent, disabledReason: "no_transport", sentAt },
      };
    }

    // Branch 4: pushed to mobile (+ local if interactive). @431928
    emit(true, localSent);
    return { data: { message, pushSent: true, localSent, sentAt } };
  },
} satisfies ToolDef<InputSchema, Output>);

// Mapping: G9→PUSH_NOTIFICATION_TOOL_NAME, zOi→DESCRIPTION, VOi→BASE_PROMPT, NHd→ROUTINE_PROMPT_SUFFIX,
//   OHd→ROUTINE_SUMMARY_TAG, KOi→buildPrompt, uRp→inputSchema, dRp→outputSchema, fRp→PushNotificationTool,
//   pRp→PUSH_FLAG_CACHE_MS, yK→getFeatureValueCached, st→parseBooleanEnv, _a→isRemoteControlSession,
//   hk→hasNotificationTransport, Ec→getConfigValue, Mtr→isUserPresent, U0→lastKeystrokeTimestamp,
//   VMe→terminalHasFocus, LKt→USER_PRESENT_IDLE_THRESHOLD_MS, wen→isRoutineSession, G→logEvent,
//   o→emitOsNotification
