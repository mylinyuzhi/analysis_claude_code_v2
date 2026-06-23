/**
 * RemoteTriggerTool — manage scheduled remote Claude Code agents ("routines") via the
 * claude.ai CCR (Claude Code Routines) API. Auth is in-process: the OAuth token is added
 * to the request automatically and never reaches the shell. The model drives a small REST
 * surface (`/v1/code/triggers`) through a single `action` switch.
 *
 * Logic-equivalent to the v2.1.88 `tools/RemoteTriggerTool/RemoteTriggerTool.ts`; re-derived
 * and substantially extended for v2.1.183 (the 2.1.183 build adds: the `run`-action body strip,
 * the `summary` output field + `buildScheduleSummary`, the `tengu_remote_trigger` telemetry,
 * the `Ac()/Co()/CLAUDE_CODE_REMOTE/allow_remote_sessions` enablement chain, and the
 * "Run /login and try again." no-auth message).
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   :431366            Gpo  = TRIGGERS_BETA = "ccr-triggers-2026-01-30"
 *   :431370-431382     dWe/OVa/NVa = name / description / prompt consts
 *   :431415-431433     GVa  = buildScheduleSummary
 *   :431450-431470     oRp/sRp/jVa = input / output / trigger-response Zod schemas
 *   :431471-431580     iRp  = the tool object (isEnabled, isReadOnly, call switch, mapToolResult)
 *   :436557 / :436702  membership in getAllBaseTools (LW) via the lazy slot `Zza`
 * 2.1.88 convention mirror: src/tools/RemoteTriggerTool/{RemoteTriggerTool.ts,prompt.ts}
 * 2.1.156 scaffold: 04_tools/README.md (delta doc; RemoteTrigger is a carryover, not re-detailed there)
 * Cross-validation: name/description/prompt strings quoted verbatim from the bundle (and match
 *   assets/tools/RemoteTrigger.md); the call switch, header beta tag, and no-auth message were
 *   read line-for-line at :431506-431567.
 */

import { z } from "zod/v4";
import type { ToolDef, ToolUseContext } from "../Tool";
import { buildTool } from "../Tool";
import { lazySchema } from "../utils/lazySchema";

// helper: si.get/si.post @bundle — the in-process authenticated claude.ai HTTP client.
//   `auth: "teleport-org"` injects the org-scoped OAuth token; returns { ok, status, data, reason, detail }.
import { claudeApi as si } from "../services/claudeApi";
// helper: ct @bundle — getFeatureValue_CACHED_MAY_BE_STALE (growthbook flag read).
import { getFeatureValue_CACHED_MAY_BE_STALE as ct } from "../services/analytics/growthbook";
// helper: di @bundle — isPolicyAllowed (managed-policy gate).
import { isPolicyAllowed as di } from "../services/policyLimits";
// helper: Ac @bundle — isClaudeAiAuthed; Co @bundle — isFirstPartyApi-ish auth-mode predicate.
import { isClaudeAiOauthed as Ac, isOauthAuthEligible as Co } from "../utils/auth";
// helper: st @bundle — parseBooleanEnv; Re @bundle — jsonStringify; Ne/os @bundle — telemetry redactors.
import { parseBooleanEnv as st } from "../utils/env";
import { jsonStringify } from "../utils/slowOperations";
import { logEvent } from "../services/analytics";
// helper: Rs().CLAUDE_AI_ORIGIN @bundle — OAuth/runtime config (claude.ai origin for /code/routines links).
import { getRuntimeConfig as Rs } from "../constants/oauth";
// helper: Nre @bundle — humanizeRelativeTime ("in 3 hours", "5 minutes ago").
import { humanizeRelativeTime as Nre } from "../utils/time";
import { renderToolUseMessage, renderToolResultMessage } from "./RemoteTriggerTool.UI";

// 2.1.183: REMOTE_TRIGGER_TOOL_NAME = dWe @cli_inner_pretty.js:431370
export const REMOTE_TRIGGER_TOOL_NAME = "RemoteTrigger";

// 2.1.183: TRIGGERS_BETA = Gpo @cli_inner_pretty.js:431366
// Anthropic-beta header value pinning the CCR triggers wire version.
const TRIGGERS_BETA = "ccr-triggers-2026-01-30";

// 2.1.183: DESCRIPTION = OVa @cli_inner_pretty.js:431371-431372  (verbatim)
const DESCRIPTION =
  "Manage scheduled remote Claude Code agents (routines) via the claude.ai CCR API. Auth is handled in-process — the token never reaches the shell.";

// 2.1.183: PROMPT = NVa @cli_inner_pretty.js:431373-431382  (verbatim; matches assets/tools/RemoteTrigger.md)
const PROMPT = `Call the claude.ai remote-trigger API. Use this instead of curl — the OAuth token is added automatically in-process and never exposed.

Actions:
- list: GET /v1/code/triggers
- get: GET /v1/code/triggers/{trigger_id}
- create: POST /v1/code/triggers (requires body)
- update: POST /v1/code/triggers/{trigger_id} (requires body, partial update)
- run: POST /v1/code/triggers/{trigger_id}/run (optional body)

The response is the raw JSON from the API. For create/update, a summary line is appended with the server-parsed run time and the routine's claude.ai URL — relay both to the user so they can confirm the time is right and know where the result will appear.`;

// 2.1.183: inputSchema = oRp @cli_inner_pretty.js:431450-431459
const inputSchema = lazySchema(() =>
  z.strictObject({
    // @431452
    action: z.enum(["list", "get", "create", "update", "run"]),
    // @431453-431456
    trigger_id: z
      .string()
      .regex(/^[\w-]+$/)
      .optional()
      .describe("Required for get, update, and run"),
    // @431457
    body: z
      .record(z.string(), z.unknown())
      .optional()
      .describe("Required for create and update; optional for run"),
  }),
);
type InputSchema = ReturnType<typeof inputSchema>;
export type Input = z.infer<InputSchema>;

// 2.1.183: outputSchema = sRp @cli_inner_pretty.js:431460
const outputSchema = lazySchema(() =>
  z.object({
    status: z.number(),
    json: z.string(),
    summary: z.string().optional(),
  }),
);
type OutputSchema = ReturnType<typeof outputSchema>;
export type Output = z.infer<OutputSchema>;

// 2.1.183: triggerResponseSchema = jVa @cli_inner_pretty.js:431461-431470
// Lenient parse of a single trigger record returned by create/update — used only to render
// the human "→ Scheduled: …" summary; every field is optional (`.partial()`).
const triggerResponseSchema = lazySchema(() => {
  const emptyToUndefined = z.string().transform((s) => s || undefined); // @431463
  return z
    .object({
      id: z.coerce.string(),
      enabled: z.boolean(),
      next_run_at: z.string(),
      cron_expression: emptyToUndefined,
      run_once_at: emptyToUndefined,
    })
    .partial();
});
type TriggerResponse = z.infer<ReturnType<typeof triggerResponseSchema>>;

/**
 * buildScheduleSummary — turns a parsed trigger record into the user-relayed schedule blurb.
 * 2.1.183: GVa @cli_inner_pretty.js:431415-431433
 *
 * What it does: renders one or two `→ …` lines so the model can confirm the server-parsed run
 * time and hand the user a claude.ai management URL. Returns undefined when there is nothing
 * worth saying (no parseable next_run_at and no id).
 *
 * Branches:
 *  - enabled + valid next_run_at → "→ Scheduled: <runs once|next run (cron …)|next run> <rel> (<iso> UTC)"
 *    and, if a one-shot run is already in the past, a "⚠ next_run_at is in the past …" warning.
 *  - disabled + valid next_run_at → "→ Disabled (next run would be <rel>, <iso> UTC)"
 *  - id present → always append "→ View/manage: <CLAUDE_AI_ORIGIN>/code/routines/<id>"
 */
function buildScheduleSummary(t: TriggerResponse, now: Date = new Date()): string | undefined {
  const enabled = t.enabled ?? true;
  const lines: string[] = [];
  const next = t.next_run_at ? new Date(t.next_run_at) : undefined;
  if (next && !Number.isNaN(next.getTime())) {
    const rel = Nre(next, { now });
    const iso = next.toISOString().replace(/\.\d{3}Z$/, "Z");
    const kind = t.run_once_at // @431423
      ? "runs once"
      : t.cron_expression
        ? `next run (cron ${t.cron_expression})`
        : "next run";
    if (enabled) {
      lines.push(`→ Scheduled: ${kind} ${rel} (${iso} UTC)`); // @431425
      if (t.run_once_at && next.getTime() < now.getTime())
        lines.push("⚠ next_run_at is in the past — confirm the date/timezone is intended."); // @431426
    } else {
      lines.push(`→ Disabled (next run would be ${rel}, ${iso} UTC)`); // @431427
    }
  }
  if (t.id) lines.push(`→ View/manage: ${Rs().CLAUDE_AI_ORIGIN}/code/routines/${t.id}`); // @431429
  return lines.length ? lines.join("\n") : undefined;
}

// 2.1.183: RemoteTriggerTool = iRp @cli_inner_pretty.js:431471-431580
export const RemoteTriggerTool = buildTool({
  name: REMOTE_TRIGGER_TOOL_NAME,
  searchHint: "manage scheduled cloud agent routines", // @431473
  maxResultSizeChars: 100_000, // @431474
  shouldDefer: true, // @431475 — kept out of the default tool-list, surfaced via ToolSearch

  get inputSchema(): InputSchema {
    return inputSchema();
  },
  get outputSchema(): OutputSchema {
    return outputSchema();
  },

  // 2.1.183: isEnabled @cli_inner_pretty.js:431482-431490
  // Gate chain: must be a claude.ai OAuth session (Ac), with an eligible auth mode (Co),
  // NOT itself a remote/CCR runtime (the env kill `CLAUDE_CODE_REMOTE`), the `tengu_surreal_dali`
  // growthbook flag on, AND the managed-policy `allow_remote_sessions` allowed.
  isEnabled() {
    return (
      Ac() &&
      Co() &&
      !st(process.env.CLAUDE_CODE_REMOTE) &&
      ct("tengu_surreal_dali", false) &&
      di("allow_remote_sessions")
    );
  },

  isConcurrencySafe() {
    return true; // @431491
  },

  // 2.1.183: isReadOnly @cli_inner_pretty.js:431494-431496 — only the two GET actions are read-only.
  isReadOnly(input: Input) {
    return input.action === "list" || input.action === "get";
  },

  // @431497-431499
  toAutoClassifierInput(input: Input) {
    return `RemoteTrigger ${input.action}${input.trigger_id ? ` ${input.trigger_id}` : ""}`;
  },

  async description() {
    return DESCRIPTION;
  },
  async prompt() {
    return PROMPT;
  },

  // 2.1.183: call @cli_inner_pretty.js:431506-431567
  // Maps `action` → (method, path, body), performs the authenticated request, and — for
  // create/update — emits telemetry and appends a human schedule summary to the output.
  async call(input: Input, context: ToolUseContext) {
    const { action, trigger_id, body } = input;
    let method: "get" | "post";
    let path: string;
    let data: unknown;

    switch (action) {
      case "list": // @431512
        method = "get";
        path = "/v1/code/triggers";
        break;
      case "get": // @431515
        if (!trigger_id) throw new Error("get requires trigger_id"); // @431516
        method = "get";
        path = `/v1/code/triggers/${trigger_id}`;
        break;
      case "create": // @431519
        if (!body) throw new Error("create requires body"); // @431520
        method = "post";
        path = "/v1/code/triggers";
        data = body;
        break;
      case "update": // @431523
        if (!trigger_id) throw new Error("update requires trigger_id"); // @431524
        if (!body) throw new Error("update requires body"); // @431525
        method = "post";
        path = `/v1/code/triggers/${trigger_id}`;
        data = body;
        break;
      case "run": { // @431528
        if (!trigger_id) throw new Error("run requires trigger_id"); // @431529
        method = "post";
        path = `/v1/code/triggers/${trigger_id}/run`;
        // strip a stray trigger_id out of the run body so it isn't double-sent @431531
        const { trigger_id: _omit, ...rest } = body ?? {};
        data = rest;
        break;
      }
    }

    // @431535-431541 — in-process auth, beta header, permissive status so non-2xx returns to the model.
    const opts = {
      auth: "teleport-org" as const,
      headers: { "anthropic-beta": TRIGGERS_BETA },
      timeout: 20_000,
      signal: context.abortController.signal,
      validateStatus: () => true,
    };
    const res = method === "get" ? await si.get(path, opts) : await si.post(path, data, opts);

    // @431542-431548 — transport-level failure (no HTTP status). Distinguish missing auth.
    if (!res.ok) {
      throw new Error(
        res.reason === "no-auth"
          ? "Not authenticated with a claude.ai account. Run /login and try again."
          : `Remote triggers unavailable: ${res.reason}`,
      );
    }

    let summary: string | undefined;
    if (action === "create" || action === "update") {
      const success = res.status >= 200 && res.status < 300;
      // @431554 telemetry — redacted action, whether a one-shot/cron schedule was requested, success.
      logEvent("tengu_remote_trigger", {
        action,
        has_run_once_at: typeof body?.run_once_at === "string" && body.run_once_at !== "",
        has_cron: typeof body?.cron_expression === "string" && body.cron_expression !== "",
        success,
      });
      if (success) {
        const parsed = triggerResponseSchema().safeParse(res.data); // @431562
        summary = parsed.success ? buildScheduleSummary(parsed.data) : undefined;
      }
    }

    return { data: { status: res.status, json: jsonStringify(res.data), summary } };
  },

  // 2.1.183: mapToolResultToToolResultBlockParam @cli_inner_pretty.js:431568-431577
  mapToolResultToToolResultBlockParam(output: Output, toolUseID: string) {
    const content = output.summary
      ? `HTTP ${output.status}\n${output.json}\n\n${output.summary}`
      : `HTTP ${output.status}\n${output.json}`;
    return { tool_use_id: toolUseID, type: "tool_result", content };
  },

  renderToolUseMessage,
  renderToolResultMessage,
} satisfies ToolDef<InputSchema, Output>);

// Mapping: dWe→REMOTE_TRIGGER_TOOL_NAME, OVa→DESCRIPTION, NVa→PROMPT, Gpo→TRIGGERS_BETA,
//   oRp→inputSchema, sRp→outputSchema, jVa→triggerResponseSchema, GVa→buildScheduleSummary,
//   iRp→RemoteTriggerTool, si→claudeApi, ct→getFeatureValue_CACHED_MAY_BE_STALE,
//   di→isPolicyAllowed, Ac→isClaudeAiOauthed, Co→isOauthAuthEligible, st→parseBooleanEnv,
//   Re→jsonStringify, Nre→humanizeRelativeTime, Rs→getRuntimeConfig, G→logEvent
