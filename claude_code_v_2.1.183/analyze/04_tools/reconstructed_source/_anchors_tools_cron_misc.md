# Anchors: CRON / REMOTE / STRUCTURED / ONBOARDING / MISC tool group — v2.1.183

Bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
All line numbers below are `cli_inner_pretty.js:<line>` in the 2.1.183 bundle (verified by Read).
Verbatim tool prompt/description text lives in `…/extract/assets/tools/<Name>.md`.

## Shared infrastructure / how to read this group

- **Tool factory:** every tool object is built by `pi(...)` (the tool-definition wrapper). Schemas are wrapped in `we(() => …)` (a memoize-once lazy initializer) so the Zod object is created on first access. `H` is the Zod namespace.
- **getAllBaseTools = `LW`** at `cli_inner_pretty.js:436517-436576`. It returns the array of all base tool objects. Notable conditional spreads inside `LW`: `...w$p` (the three Cron tools), `...(Zza ? [Zza] : [])` (RemoteTrigger), `x$p` (SendUserFile), `...(oKa ? [oKa] : [])` (PushNotification), `...(dKa ? [dKa] : [])` (Artifact), `...(iKa ? [iKa] : [])` (Projects — only present when env-gated), `Cfo()` (SendMessage), `Y9a` (ScheduleWakeup), `Eqa` (ShowOnboardingRolePicker), `o9a` (SendUserMessage), `...(_Ka ? [_Ka] : [])` (ShareOnboardingGuide), `k$p` (DesignSync).
- **getEnabledBaseToolNames = `kfo`** at `436512-436516`: maps `LW()` → `isEnabled()` filter → `.name`.
- **Tool-object module bindings** assigned at `436700-436713` (these resolve the lazy module getters):
  - `cli_inner_pretty.js:436700` `w$p = [CronCreateTool, CronDeleteTool, CronListTool]`
  - `436702` `Zza = RemoteTriggerTool`
  - `436705` `x$p = SendUserFileTool`
  - `436706` `oKa = PushNotificationTool`
  - `436707` `k$p = DesignSyncTool`
  - `436708` `iKa = Ge.CLAUDE_PROJECT_TOOL ? ProjectsTool : null` ← **Projects is env-gated at the array level**
  - `436709` `dKa = ArtifactTool`
  - `436711` `_Ka = ShareOnboardingGuideTool`
- **StructuredOutput is in `LW()` but filtered OUT of the standard agent tool set.** The tool-list filter `zR` at `cli_inner_pretty.js:436622-436652` builds `let n = new Set([_G.name, kG.name, Em])` (line `436634`) and excludes those names: `r = LW().filter((c) => !n.has(c.name))`. `Em` = `"StructuredOutput"`. So StructuredOutput is never a normal model tool; it is injected per-call by the schema-forcing path (see §StructuredOutput below).

---

## CronCreate

- **Name const** `rI = "CronCreate"` — `cli_inner_pretty.js:221670`. (Also exported `CRON_CREATE_TOOL_NAME: () => rI` at `221591`.)
- **Input Zod schema** `YMp` (lazy) — defined `cli_inner_pretty.js:431131-431144`. Fields:
  - `cron: H.string()` desc (`431133-431135`): `'Standard 5-field cron expression in local time: "M H DoM Mon DoW" (e.g. "*/5 * * * *" = every 5 minutes, "30 14 28 2 *" = Feb 28 at 2:30pm local once).'`
  - `prompt: H.string()` desc (`431136`): `"The prompt to enqueue at each fire time."`
  - `recurring: n0(H.boolean().optional())` desc (`431137-431139`): default true → fire every match until deleted/auto-expired after `${ree}` days; false → fire once then auto-delete.
  - `durable: n0(H.boolean().optional())` desc (`431140-431142`): true → persist to `.claude/scheduled_tasks.json`; false (default) → in-memory only.
  - `n0(...)` = nullable-coerce wrapper; `H.strictObject` (no extra keys).
- **Output schema** `XMp` — `431145-431147`: `{ id, humanSchedule, recurring, durable? }`.
- **Tool object** `JMp = pi({ name: rI, … })` — `cli_inner_pretty.js:431148-431216`. Search hint `"schedule a recurring or one-shot prompt"` (`431150`); `maxResultSizeChars: 1e5`; `shouldDefer: !0`.
- **isEnabled** (`431159-431161`): `IB()`. `IB` at `cli_inner_pretty.js:221593-221595`: `return !st(process.env.CLAUDE_CODE_DISABLE_CRON) && yK("tengu_kairos_cron", !0, b1i)` (`b1i = 300000` cache TTL, `221668`).
- **isReadOnly:** not declared → defaults to mutating.
- **description()** (`431165-431167`): `g5r(qAe())` — `g5r` at `221599-221603` returns durable-aware text: durable → `"Schedule a prompt to run at a future time — either recurring on a cron schedule, or once at a specific time. Pass durable: true to persist to .claude/scheduled_tasks.json; otherwise session-only."` else session-only variant. `qAe()` (`221596-221598`) = `yK("tengu_kairos_cron_durable", !0, b1i)` (durable feature gate).
- **prompt()** (`431168-431170`): `h5r(qAe())` (the long cron-authoring prompt; verbatim in `assets/tools/CronCreate.md`). `ree` = recurring auto-expire days = `U9.recurringMaxAgeMs / 86400000` (`221680`); `yv` = Monitor tool name referenced in "Not for live watching" section.
- **getPath()** (`431171-431173`): `FAe()` (path to scheduled_tasks.json).
- **validateInput** (`cli_inner_pretty.js:431174-431196`): 4 error codes —
  1. `!zO(e.cron)` → `Invalid cron expression '${e.cron}'. Expected 5 fields: M H DoM Mon DoW.` errorCode 1.
  2. `Dtt(e.cron, Date.now()) === null` → `Cron expression '${e.cron}' does not match any calendar date in the next year.` errorCode 2.
  3. `(await pae()).length >= xVa` → `Too many scheduled jobs (max ${xVa}). Cancel one first.` errorCode 3.
  4. `e.durable && Pk()` → `durable crons are not supported for teammates (teammates do not persist across sessions)` errorCode 4. (`Pk()` = current teammate/agent context.)
- **call** (`431197-431201`): `o = r && qAe()` (durable only if both flag and gate); `s = await Mtt(e, t, n, o, Pk()?.agentId)` schedules; returns `{ data: { id, humanSchedule: pR(e), recurring, durable } }`; `AJ(!0)` flags state dirty.
- **mapToolResult** (`431202-431213`): recurring → `Scheduled recurring job ${id} (${humanSchedule}). ${persistNote}. Auto-expires after ${ree} days. Use CronDelete to cancel sooner.`; one-shot → `Scheduled one-shot task …`. persistNote = `"Persisted to .claude/scheduled_tasks.json"` or `"Session-only (not written to disk, dies when Claude exits)"`.
- **In getAllBaseTools:** yes (`w$p[0]`, `436700`).
- **NEW vs 2.1.156:** carryover (name present in 2.1.156 before-picture).
- **Confidence:** high (name const + schema + tool object + isEnabled all converge).

## CronDelete

- **Name const** `U2 = "CronDelete"` — `cli_inner_pretty.js:221671`. (`CRON_DELETE_TOOL_NAME: () => U2` at `221589`.) Description const `y5r = "Cancel a scheduled cron job by ID"` (`221673`).
- **Input schema** `QMp` (lazy) — `cli_inner_pretty.js:431228`: `H.strictObject({ id: H.string().describe("Job ID returned by CronCreate.") })`. Output `ZMp` (`431229`): `{ id }`.
- **Tool object** `eRp = pi({ name: U2, … })` — `cli_inner_pretty.js:431230-431272`. searchHint `"cancel a scheduled cron job"` (`431232`); shouldDefer true.
- **isEnabled** (`431241-431243`): `IB()` (same cron gate).
- **description()** returns `y5r`; **prompt()** = `_5r(qAe())` (durable-aware: removes from `.claude/scheduled_tasks.json` or in-memory store).
- **validateInput** (`431256-431262`): not-found → `No scheduled job with id '${e.id}'` errorCode 1; owned-by-other-agent → `Cannot delete cron job '${e.id}': owned by another agent` errorCode 2.
- **call** (`431264-431266`): `await dae([e]); return { data: { id } }`.
- **mapToolResult** (`431267-431269`): `Cancelled job ${e.id}.`
- **In getAllBaseTools:** yes (`w$p[1]`). **isReadOnly:** not declared. **NEW:** carryover. **Confidence:** high.

## CronList

- **Name const** `OPt = "CronList"` — `cli_inner_pretty.js:221672`. (`CRON_LIST_TOOL_NAME: () => OPt` at `221587`.) Description const `b5r = "List scheduled cron jobs"` (`221674`).
- **Input schema** `tRp` (lazy) — `cli_inner_pretty.js:431286`: `H.strictObject({})` (no args). Output `nRp` (`431287-431299`): `{ jobs: array of { id, cron, humanSchedule, prompt, recurring?, durable? } }`.
- **Tool object** `rRp = pi({ name: OPt, … })` — `cli_inner_pretty.js:431301-431358`. searchHint `"list active cron jobs"` (`431303`).
- **isEnabled** (`431312-431314`): `IB()`. **isConcurrencySafe** → `!0` (`431315`). **isReadOnly** → `!0` (`431318`).
- **description()** = `b5r`; **prompt()** = `S5r(qAe())` (`221663-221667`): durable variant lists both durable + session-only; session variant lists only this session.
- **call** (`431327-431342`): `e = await pae()`; if teammate (`t = Pk()`) filter to `o.agentId === t.agentId`; map each to `{ id, cron, humanSchedule: pR(o.cron), prompt, recurring?, durable? }`.
- **mapToolResult** (`431343-431355`): joins `${id} — ${humanSchedule}${recurring?" (recurring)":" (one-shot)"}${durable===false?" [session-only]":""}: ${Va(prompt,80,true)}` or `"No scheduled jobs."`.
- **In getAllBaseTools:** yes (`w$p[2]`). **NEW:** carryover. **Confidence:** high.

---

## ScheduleWakeup

- **Name const** `$g = "ScheduleWakeup"` — `cli_inner_pretty.js:220800`.
- **Input schema** `nMp` (lazy) — defined `cli_inner_pretty.js:427810-427819`. Fields:
  - `delaySeconds: GB(H.number())` desc (`427812`): `"Seconds from now to wake up. Clamped to [60, 3600] by the runtime."` (`GB` = coercer wrapper.)
  - `reason: H.string()` desc (`427813-427815`): `"One short sentence explaining the chosen delay. Goes to telemetry and is shown to the user. Be specific."`
  - `prompt: H.string()` desc (`427816-427818`): the `/loop` input to fire on wake-up; for autonomous loop pass sentinel `${wCe}` (the `<<autonomous-loop-dynamic>>` variant), not the CronCreate-mode `${Rtt}` (`<<autonomous-loop>>`).
  - `H.strictObject`.
- **Output schema** `rMp` — `427821-427827`: `{ scheduledFor (epoch ms), clampedDelaySeconds, wasClamped }`.
- **Tool object** `Y9a = pi({ name: $g, … })` — `cli_inner_pretty.js:427828-427879`. searchHint `"self-pace next iteration: pick a delay before resuming work or running the next /loop tick"` (`427830`); `maxResultSizeChars: 1000`; `shouldDefer: !0`; `userFacingName()` → `""`.
- **isEnabled:** NOT declared on the tool object → tool always loaded; the runtime gate is checked inside `call`. The gate fn is `jAe()` at `cli_inner_pretty.js:221035-221037`: `return ct("tengu_kairos_loop_dynamic", !1)`.
- **isReadOnly:** not declared.
- **checkPermissions** (`427848-427850`): always `{ behavior: "allow", updatedInput: e }`.
- **description()** = `XOi` (`220804`); **prompt()** = `YOi` (`220807`, the `/loop` dynamic-mode prompt; verbatim in assets).
- **call** (`427854-427861`): `if (!jAe()) { Ott("gate_off"); return { data:{scheduledFor:0,…} } }`; else `r = i1i(e, n, t)` (schedules; `i1i` at `221042-221044`); null → no schedule.
- **mapToolResult** (`427862-427878`): `scheduledFor === 0` → `"Wakeup not scheduled. Either the /loop dynamic runtime gate is off or the loop reached its maximum duration — the loop has ended; do not re-issue."`; else `Next wakeup scheduled for ${HH:MM:SS} (in ${s}s)${clampNote}. Nothing more to do this turn — the harness re-invokes you when the wakeup fires or a task-notification arrives.`
- **In getAllBaseTools:** yes (`Y9a` directly in `LW`, `436556`). **NEW:** carryover. **Confidence:** high.

---

## RemoteTrigger

- **Name const** `dWe = "RemoteTrigger"` — `cli_inner_pretty.js:431370`.
- **Description const** `OVa` (`431371-431372`): `"Manage scheduled remote Claude Code agents (routines) via the claude.ai CCR API. Auth is handled in-process — the token never reaches the shell."`
- **Prompt const** `NVa` (`431373-431382`): the actions table (`list/get/create/update/run` against `/v1/code/triggers`). Verbatim in assets.
- **Input schema** `oRp` (lazy) — `cli_inner_pretty.js:431450-431459`:
  - `action: H.enum(["list","get","create","update","run"])`
  - `trigger_id: H.string().regex(/^[\w-]+$/).optional()` desc `"Required for get, update, and run"`
  - `body: H.record(H.string(), H.unknown()).optional()` desc `"Required for create and update; optional for run"`
  - `H.strictObject`.
- **Output schema** `sRp` (`431460`): `{ status, json, summary? }`. **Trigger-response parse schema** `jVa` (`431461-431470`): `{ id (coerced str), enabled, next_run_at, cron_expression, run_once_at }.partial()`.
- **Tool object** `iRp = pi({ name: dWe, … })` — `cli_inner_pretty.js:431471-431580`. searchHint `"manage scheduled cloud agent routines"` (`431473`); shouldDefer true.
- **isEnabled** (`cli_inner_pretty.js:431482-431490`): `Ac() && Co() && !st(process.env.CLAUDE_CODE_REMOTE) && ct("tengu_surreal_dali", !1) && di("allow_remote_sessions")`.
- **isConcurrencySafe** → `!0` (`431491`). **isReadOnly(e)** (`431494-431496`): `e.action === "list" || e.action === "get"`.
- **call** (`cli_inner_pretty.js:431506-431567`): switch on action → builds method+path+body:
  - list → GET `/v1/code/triggers`; get → GET `/v1/code/triggers/${trigger_id}` (throws `"get requires trigger_id"`); create → POST `/v1/code/triggers` (throws `"create requires body"`); update → POST `/v1/code/triggers/${trigger_id}` (throws on missing id/body); run → POST `/v1/code/triggers/${trigger_id}/run` (strips `trigger_id` from body).
  - HTTP via `si.get/post` with `auth: "teleport-org"`, header `"anthropic-beta": Gpo` (`Gpo = "ccr-triggers-2026-01-30"`, `431366`), `timeout: 20000`, `validateStatus: () => !0`.
  - not-ok → throws `"Not authenticated with a claude.ai account. Run /login and try again."` (no-auth) or `Remote triggers unavailable: ${reason}`.
  - create/update success → emits `tengu_remote_trigger` (`431554`) and parses with `jVa`, builds summary via `GVa` (`buildScheduleSummary`, `431415-431433`) → `→ Scheduled: …`, `→ View/manage: ${CLAUDE_AI_ORIGIN}/code/routines/${id}`.
- **mapToolResult** (`431568-431577`): `HTTP ${status}\n${json}\n\n${summary}` (or without summary).
- **In getAllBaseTools:** yes (`Zza`, `436557` / assigned `436702`). **NEW:** carryover (present in 2.1.156). **Confidence:** high.

---

## PushNotification

- **Name const** `G9 = "PushNotification"` — `cli_inner_pretty.js:220751`. (`userFacingName: () => "PushNotification"` at `431840`.)
- **Description const** `zOi` (`220765-220766`): `"Send a notification to the user via their terminal and, when Remote Control is connected, also push to their mobile device"`.
- **Prompt:** `KOi()` fn at `cli_inner_pretty.js:220761-220763`: `return wen() ? VOi + NHd : VOi`. Base prompt `VOi` (`220767+`): the "This tool sends a desktop notification…" text (verbatim in assets). `wen()` appends a routine-summary block `NHd` when in routine mode.
- **Input schema** `uRp` (lazy) — `cli_inner_pretty.js:431815-431819`:
  - `message: H.string().min(1)` desc `"The notification body. Keep it under 200 characters; mobile OSes truncate."`
  - `status: H.literal("proactive")` — push is always proactive.
  - `H.strictObject`.
- **Output schema** `dRp` (`431821-431834`): `{ message, pushSent?, localSent?, disabledReason? (enum config_off|user_present|no_transport), idleSec?, hasFocus?, sentAt? }`.
- **Tool object** `fRp = pi({ name: G9, … })` — `cli_inner_pretty.js:431836-431929`. searchHint `"send a notification to the user via terminal and optionally mobile"` (`431838`); `maxResultSizeChars: 1000`; shouldDefer true.
- **isEnabled** (`431848-431850`): `yK("tengu_kairos_push_notifications", !1, pRp)` (`pRp = 300000` cache TTL, `431803`).
- **isConcurrencySafe** → `!0`; **isReadOnly** → `!0` (`431851-431856`).
- **call** (`cli_inner_pretty.js:431884-431928`): captures ISO `sentAt`; `i = st(CLAUDE_CODE_REMOTE)||_a()` (is-remote); `a = i || hk()` (has-transport). Branches:
  - local+not-remote+config off (`!Ec("agentPushNotifEnabled",!1).value`) → `disabledReason:"config_off"`.
  - not-remote + user present (`Mtr()`) → computes idle sec + focus → `disabledReason:"user_present"`.
  - emits OS notification `o?.({ type:"os_notification", message:e, notificationType:"push_notification" })`.
  - no transport → `disabledReason:"no_transport"`, localSent depends on interactivity.
  - else → `{ pushSent:true, localSent:c, sentAt }`.
  - Telemetry `tengu_push_notification_send` (`431889`) with push_sent/local_sent/is_remote/disabled_reason.
- **mapToolResult** (`431866-431881`): result strings e.g. `"Push not sent — mobile push is disabled in /config."`, `"Not sent — terminal has focus. Terminal + mobile suppressed."`, `"Mobile push requested."`, etc.
- **In getAllBaseTools:** yes (`oKa`, `436566` / assigned `436706`). **NEW:** carryover. **Confidence:** high.

---

## StructuredOutput  (schema-forcing tool — special)

- **Name const** `Em = "StructuredOutput"` — `cli_inner_pretty.js:221489`.
- **Base input schema** `lvd` (lazy) — `cli_inner_pretty.js:221498`: `H.object({}).passthrough()` (permissive base; the *real* schema is injected per-call). Output `cvd` (`221499`): `H.string().describe("Structured output tool result")`.
- **Base tool object** `A5r = pi({ … name: Em … })` — `cli_inner_pretty.js:221500-221544`. `isMcp:!1`; `isEnabled()→!0`; `isConcurrencySafe()→!0`; `isReadOnly()→!0`; `isOpenWorld()→!1`; searchHint `"return the final response as structured JSON"` (`221515`).
  - **description()** (`221517-221519`): `"Return structured output in the requested format"`.
  - **prompt()** (`221520-221522`): `"Use this tool to return your final response in the requested structured format. You MUST call this tool exactly once at the end of your response to provide the structured output."`
  - **call(e)** (`221529-221531`): `return { data: "Structured output provided successfully", structured_output: e }`.
  - **checkPermissions** (`221532-221534`): always `{ behavior:"allow", updatedInput:e }`.
  - **renderToolUseMessage** (`221535-221540`): shows up to 3 field names.
- **Per-call schema forcing — `Ftt` / `uvd`** (THE Agent `{schema}` path):
  - `Ftt(e)` at `cli_inner_pretty.js:221457-221462`: memoizes (`A1i` = WeakMap, `221545`) and delegates to `uvd(e)`.
  - `uvd(e)` at `cli_inner_pretty.js:221463-221485`: compiles the caller-supplied **JSON schema** `e` with Ajv (`new g1i.Ajv({ allErrors:true })`); on invalid schema returns `{ error: t.errorsText(...) }`. Otherwise returns `{ tool: { ...A5r, inputJSONSchema: e, async call(o) { … } } }`. The custom `call` (`221472-221479`): validates `o` against compiled schema; on mismatch `throw new Bl('Output does not match required schema: ${i}', 'StructuredOutput schema mismatch: ${a}')` (`221476`); on success `return { data:"Structured output provided successfully", structured_output:o }`.
  - **Wiring into the agent run** at `cli_inner_pretty.js:694019-694041`: `Jn = Ftt(An)` (where `An` is the agent's JSON schema). If `"tool" in Jn` → `Js = Jn.tool`; in background mode wraps `call` to also `stashBgStructuredResult`; then `zr = [...zr, Js]` appends it to the tool set, and emits `tengu_structured_output_enabled` (`694036-694039`) with `schema_property_count` + `has_required_fields`. Else (`"error" in Jn`) emits `tengu_structured_output_failure` with `Invalid JSON schema` (`694040`).
  - Another specialized clone `U$l()` at `cli_inner_pretty.js:575776-575789` spreads `...A5r` with a fixed `{ ok, reason }` JSON schema (used as a condition-checker tool, `alwaysLoad:!0`).
- **Excluded from normal agent tools:** `zR` filter `Set([_G.name, kG.name, Em])` at `cli_inner_pretty.js:436634` — StructuredOutput is dropped from `LW()` unless injected per-call.
- **In getAllBaseTools:** yes (`Em`/`A5r` indirectly in `LW` via the spread but always filtered by `zR`). **NEW:** carryover. **Confidence:** high.

---

## TestingPermission  (test-only, isEnabled false)

- **Name const** `i8a = "TestingPermission"` — `cli_inner_pretty.js:428772`.
- **Input schema** `gMp` (lazy) — `cli_inner_pretty.js:428778`: `H.strictObject({})` (no args).
- **Tool object** `xky = pi({ name: i8a, … })` — `cli_inner_pretty.js:428779-428830`.
  - **description()** (`428782-428784`): `"Test tool that always asks for permission"`.
  - **prompt()** (`428785-428787`): `"Test tool that always asks for permission before executing. Used for end-to-end testing."`
  - **userFacingName()** → `"TestingPermission"`.
  - **isEnabled()** (`428794-428796`): `return !1` ← **always disabled** (never reaches the model except in E2E tests that force-enable).
  - **isConcurrencySafe** → `!0`; **isReadOnly** → `!0`.
  - **checkPermissions()** (`428803-428805`): always `{ behavior:"ask", message:"Run test?" }`.
  - **call()** (`428824-428826`): `{ data: "${i8a} executed successfully" }`.
  - All render* methods return null.
- **In getAllBaseTools:** the tool object `xky` is built by module `a8a` (registered in `zL` deps), but `isEnabled()===false` means it is filtered out by `kfo`/`zR`. **NEW:** carryover. **Confidence:** high.

---

## Artifact

- **Name const** `VAe = "Artifact"` — `cli_inner_pretty.js:221750`. (`ARTIFACT_TOOL_NAME: () => VAe` at `221707`.) `ArtifactInputError` class at `221759-221763`.
- **Prompt const** `hza` — `cli_inner_pretty.js:434986-435004`: long design/CSP/favicon prompt. Verbatim in assets (`assets/tools/Artifact.md`). References `${nFn}` design skill at `434990`.
- **Input schema** `yza` (lazy) — `cli_inner_pretty.js:435005-435036`:
  - `file_path: H.string()` desc (`435007-435009`): `"Path to an .html or .md file to render. Use a short, distinctive basename — it is the fallback title if the HTML has no <title>."`
  - `favicon: H.string().min(1).max(32)` desc (`435010-435015`): one-or-two emoji tab icon, keep stable.
  - `label: H.string().max(60).optional()` desc (`435016-435021`): version label.
  - `url: H.string().optional()` desc (`435022-435026`): existing artifact URL to redeploy to.
  - conditional `force` (only when `vjt()`, `435027-435033`): overwrite without conflict check (after a 409).
  - conditional `mcp` (only when `vye?.isFrameMcpEnabled()`, `435034`): frame-MCP input schema.
  - `H.strictObject`.
- **Output schema** `A$p` (`435037-435045`): `{ url, path, title?, version?, mcpDropped? }`.
- **Tool object** `bza = pi({ name: VAe, … })` — `cli_inner_pretty.js:435046+`. searchHint `"render an HTML or Markdown file to a claude.ai web page"` (`435048`); `briefStandalone:!0`; `shouldDefer:!1`; `maxResultSizeChars:1000`; `userFacingName()→"Artifact"`.
- **isEnabled** (`435061-435063`): `DCe()`. `DCe` at `cli_inner_pretty.js:221839-221851`: false if `w1i()`, or `!Co()`, or `Ir()!=="firstParty"`, or entrypoint `local-agent`/`claude-coworker*`, or `ra()` (sub-agent), or `yl(Ge.CLAUDE_CODE_ARTIFACT)`; then `t = st(Ge.CLAUDE_CODE_ARTIFACT)`; if `!t && C1i()` → false; require `ct("tengu_cobalt_plinth", !1)`; finally `I1i()`.
- **isConcurrencySafe** → `!1`; **isReadOnly** → `!1`; `ruleContentField:"file_path"`; **getPath** → `Ds(e.file_path)`.
- **checkPermissions** (`cli_inner_pretty.js:435074+`): runs rule eval `_te(bza, e, n)`; deny passes through; probes share-status of the target artifact URL (via `parseArtifactUrl` `NPt`); same-session redeploy of an already-published, non-shared artifact returns `{ behavior:"allow", … reason:"Redeploy of an artifact already published this session" }`; otherwise reads the .html file for review.
- **In getAllBaseTools:** yes (`dKa`, `436540` / assigned `436709`). **NEW vs 2.1.156:** the exact prompt text is new (0 hits for `"Render an HTML or Markdown"` in 2.1.156), but the Artifact tool concept existed earlier in some form; treat the schema/prompt as evolved. **Confidence:** high.

---

## DesignSync  (NEW in 2.1.183)

- **Name const** `XOt = "DesignSync"` — `cli_inner_pretty.js:298052`.
- **Description/prompt const** `wXr` — `cli_inner_pretty.js:298053`: starts `"Read and update the user's claude.ai/design design-system projects through their claude.ai login (or, for sessions without one, a dedicated design authorization from /design-login)…"` (full method dispatch doc; verbatim in assets). description() and prompt() both return `wXr` (`433033-433038`).
- **Input schema** `wRp` (lazy) — defined `cli_inner_pretty.js:432872-432953`:
  - `method: H.enum(["list_projects","get_project","list_files","get_file","finalize_plan","write_files","delete_files","register_assets","unregister_assets","create_project","report_validate"])` (`432874-432886`).
  - `projectId?` (`432887-432890`): required for all except list_projects/create_project.
  - `path?` (`432891`): get_file path.
  - `writes?: array<string>.max(256)` (`432892-432899`): finalize_plan write paths/globs.
  - `deletes?: array<string>.max(256)` (`432900-432905`): finalize_plan delete paths/globs.
  - `planId?` (`432906-432911`): token from finalize_plan.
  - `files?: array<vRp()>.max(256)` (`432912-432918`): write_files contents. `vRp` schema (`432834-432853`): `{ path, localPath?, data?, encoding?("base64"), mimeType? }`.
  - `paths?: array<string>.max(256)` (`432919-432926`): delete_files / unregister_assets paths.
  - `name?` (`432927`): create_project name.
  - `assets?: array<TRp()>.max(256)` (`432928-432933`): register_assets cards. `TRp` schema (`432854-432871`): `{ name, path, subtitle?, viewport?, group? }`.
  - `localDir?` (`432934-432939`): finalize_plan source dir (defaults cwd).
  - `counts?` (`432940-432951`): report_validate aggregate.
  - `H.strictObject`. `mWe` = max path length.
- **Per-method required-keys table** `CRp` — `cli_inner_pretty.js:432954-432966` (`{ present:[…], nonEmpty:[…] }` per method).
- **Output schema** `xRp` (discriminated union on `method`) — `cli_inner_pretty.js:432968-433017`.
- **Tool object** `RRp = pi({ name: XOt, … })` — `cli_inner_pretty.js:433025+`. searchHint `"sync local design system components to a claude.ai/design project"` (`433027`); `shouldDefer:!0`; `maxResultSizeChars:300000`.
- **isEnabled** (`433030-433032`): `fdt()`. `fdt` at `cli_inner_pretty.js:432337-432342`: false if `!di("allow_design_sync")` or `ra()`; true if `Ac()`; else `ct("tengu_slate_quill", !1)`.
- **isConcurrencySafe** → `!1`; **isReadOnly(e)** → `kRp(e.method)` (read methods only); **isDestructive(e)** (`433051-433053`): write_files/delete_files/unregister_assets; **userFacingName(e)** → `Design: ${efo(e)}`.
- **validateInput** (`cli_inner_pretty.js:433077-433099`): missing-keys → `${method} requires: ${…}.` errorCode 1; finalize_plan with no writes/deletes → `finalize_plan needs at least one write or delete path.`; write_files file must have exactly one of `data`/`localPath` → `Each file needs exactly one of "data" or "localPath" (offending path: ${path}).`; `encoding` only on inline data.
- **checkPermissions** (`cli_inner_pretty.js:433101-433200+`): branches —
  - scope-expansion ask (`I6a()`): `"DesignSync needs design-system access added to your claude.ai login (user:design:read, user:design:write). Approving refreshes your token with these scopes…"` (decisionReason "scope expansion").
  - design-login ask (`Zpo()&&T3t()&&!Kpo()`): `"DesignSync needs design-system authorization for your claude.ai account. Approving opens your browser to authorize read and write access…"`.
  - finalize_plan ask: validates `localDir` (deny if `D6a` throws → `localDir does not exist or is not accessible: …`), then builds a structured permission message (`To project: …`, `From folder: …`, `Upload N file(s): …`, `Delete …`).
  - create_project ask: `Create design-system project "${name}" on claude.ai/design. The new project will be visible to your whole org…`.
- **In getAllBaseTools:** yes (`k$p`, `436536` / assigned `436707`).
- **NEW vs 2.1.156:** **YES — entirely new** (0 occurrences of `"DesignSync"` / `list_projects` / `design-system projects` in the 2.1.156 before-picture). **Confidence:** high.

---

## Projects  (NEW in 2.1.183, env-gated)

- **Name const** `R6a = "Projects"` — `cli_inner_pretty.js:433248`.
- **Description/prompt const** `nfo` — `cli_inner_pretty.js:433249`: starts `"Read and write the claude.ai Project attached to this session. A Project is a shared knowledge container on claude.ai…"` (full method dispatch + budget doc; verbatim in assets). description() and prompt() both return `nfo` (`433685-433690`).
- **Input schema** `BRp` (lazy) — defined `cli_inner_pretty.js:433576-433607`:
  - `method: H.enum(["project_info","project_read","project_search","project_write","project_delete"])` (`433578`).
  - `path?: .min(1).max(255)` (`433579-433585`): read/write/delete doc path; bare filename namespaced to `claude/<name>`.
  - `content?` (`433586-433590`): inline write text (mutually exclusive with local_path).
  - `local_path?` (`433591-433598`): file on disk to upload (contents never enter context).
  - `force?: boolean` (`433599-433603`): bypass chat-injection budget guard.
  - `query?: .min(1)` (`433604`): project_search query.
  - `n?: int.min(1).max(15)` (`433605`): search hit count (default 5).
  - `H.strictObject`.
- **Per-method required-keys** `URp` — `cli_inner_pretty.js:433664-433670`.
- **Output schema** `FRp` (discriminated union on `method`) — `cli_inner_pretty.js:433618-433663`; knowledge sub-schema `$6a` (`433609-433617`): `{ knowledge_size, max_knowledge_size, search_threshold, rag_active, remaining_budget }`.
- **Tool object** `VRp = pi({ name: R6a, … })` — `cli_inner_pretty.js:433677+`. searchHint `"read and write the session's attached claude.ai project"` (`433679`); `maxResultSizeChars:300000`; `persistenceThresholdCeiling:300000`.
- **isEnabled** (`433682-433684`): `di("allow_projects_tool") && O6a() !== void 0`. `O6a` at `cli_inner_pretty.js:433310-433312`: `return process.env.CLAUDE_PROJECT_UUID?.trim() || void 0` (must have an attached project UUID).
- **Array-level gate:** `iKa = Ge.CLAUDE_PROJECT_TOOL ? ProjectsTool : null` (`436708`) — only added to `LW()` when env `CLAUDE_PROJECT_TOOL` is set.
- **isConcurrencySafe** → `!1`; **isReadOnly(e)** → `jRp(e.method)`; **isDestructive(e)** (`433703-433705`): project_write/project_delete; **userFacingName(e)** → `Project: ${a4n(e)}`.
- **validateInput** (`cli_inner_pretty.js:433718+`): checks required keys per `URp`.
- **In getAllBaseTools:** conditionally (`iKa`, `436537`). **NEW vs 2.1.156:** **YES — entirely new** (0 hits for `"allow_projects_tool"` / `"attached claude.ai project"` / `project_search` in 2.1.156). **Confidence:** high.

---

## SendUserFile

- **Name const** `RPt = "SendUserFile"` — `cli_inner_pretty.js:221302`. Description const `d5r = "Send one or more files to the user"` (`221303`). Prompt const `p5r` (`221304+`, verbatim in assets).
- **Input schema** `aRp` (lazy) — `cli_inner_pretty.js:431621-431631`:
  - `files: H.preprocess((e)=> typeof e==="string"?[e]:e, H.array(H.string()).min(1))` desc (`431623-431625`): `"File paths (absolute or relative to cwd) to send to the user. Always pass an array, even for a single file."`
  - `caption: H.string().optional()` (`431626`): `"Optional short caption for the file(s)."`
  - `status: H.enum(["normal","proactive"])` desc (`431627-431629`).
  - `H.strictObject`.
- **Output schema** `lRp` (`431632-431645`): `{ caption?, attachments: array<{ path, size, isImage, file_uuid?, media_type? }> }`.
- **Tool object** `cRp = pi({ name: RPt, … })` — `cli_inner_pretty.js:431646-431710`. searchHint `"deliver files (screenshots, reports, artifacts) to the user"` (`431648`); `briefStandalone:!0`; `userFacingName()→""`.
- **isEnabled** (`cli_inner_pretty.js:431660-431666`): false if `Ir()!=="firstParty"` or `ra()`; false if `!ct("tengu_send_user_file", !0)`; then `return (hk() || !!process.env.CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE || st(process.env.CLAUDE_CODE_REMOTE)) && !lWe()`.
- **isConcurrencySafe** → `!0`; **isReadOnly** → `!0`.
- **validateInput** (`431676-431678`): `C3n(e.files)` (verifies files exist).
- **call** (`431704-431709`): emits `tengu_send_user_file` (`431705`) with proactive+file_count; resolves attachments via `I3n(...)`; returns `{ data: { caption, attachments } }`.
- **mapToolResult** (`431685-431701`): `${n} ${file(s)} delivered to user.` plus per-attachment `file_uuid` lines.
- **In getAllBaseTools:** yes (`x$p`, `436565` / assigned `436705`). **NEW:** carryover. **Confidence:** high.

---

## SendUserMessage

- **Name const** `KO = "SendUserMessage"` — `cli_inner_pretty.js:221278`. **Alias** `MPt = "Brief"` (`221279`); tool sets `aliases: [MPt]` (`425383`). Sentinel `ivd = "You ended the turn without calling SendUserMessage."` (`221280`).
- **Descriptions:** `l5r = "Send a message to the user"` (`221281`). Two prompt variants: `c5r` (full, `221282`) and `u5r` (brief, `221284`) — both verbatim in assets.
- **Message-field desc const** `r9a = "The message for the user. Supports markdown formatting."` (`425320`).
- **Input schemas (two, selected by gate):** full schema `iPp` (`cli_inner_pretty.js:425346-425358`) — `{ message (r9a), attachments?: array<string | sPp()>, status: enum["normal","proactive"] }`; brief schema `aPp` (`425359`) — `{ message (r9a) }` only. `sPp` (`425335-425344`): pre-resolved uploaded-file object `{ file_uuid, file_name, size, is_image, media_type? }`. The tool's `inputSchema` getter (`425390-425392`): `return lWe() ? iPp() : aPp()`.
- **Output schema** `lPp` (`425360-425380`): `{ message, attachments?, sentAt? }`.
- **Tool object** `o9a = pi({ name: KO, aliases:[MPt], … })` — `cli_inner_pretty.js:425381-425440+`. searchHint `"send a message to the user — your primary visible output channel"` (`425384`); `briefStandalone:!0`; `userFacingName()→""`.
- **isEnabled** (`425396-425398`): `lWe() || Kve()`. `lWe` at `cli_inner_pretty.js:425220-425221`: `(Cre() && u3t()) || yRr()`. `Kve` at `134338-134341`: `Ge.CLAUDE_CODE_PEWTER_OWL_TOOL ?? gRr("pewter_owl_tool")`.
- **isConcurrencySafe** → `!0`; **isReadOnly** → `!0`.
- **description()** = `l5r`; **prompt()** (`425415-425417`): `lWe() ? c5r : u5r`.
- **validateInput** (`425408-425411`): if attachments present, `C3n(e.attachments)`.
- **call** (`425425+`): emits `tengu_brief_send` (`425430`) with proactive+attachment_count; delivers message + attachments.
- **In getAllBaseTools:** yes (`o9a`, `436564`). **NEW:** carryover. **Confidence:** high.

---

## ShareOnboardingGuide

- **Name const** `M3t = "ShareOnboardingGuide"` — `cli_inner_pretty.js:435353`.
- **Description/prompt const** `gfo` — `cli_inner_pretty.js:435354-435356`: `"Upload the ONBOARDING.md in the current directory and return a share link teammates can open in Claude Code. Call this after the user has confirmed the final content.\n\nWhen called with the default mode='check': if a local ONBOARDING.md is present, uploads it to the most-recently-updated org guide (or creates one if none exist) and returns a fresh link. If no local file is present, returns the existing link without uploading (status: has_existing)."` (description() and prompt() both return `gfo`, `435417-435440`).
- **Input schema** `h$p` (lazy) — `cli_inner_pretty.js:435390-435404`:
  - `mode: H.enum(["check","update","create","delete"]).default("check")` desc (`435392-435396`): check/update/create/delete behavior.
  - `short_code: H.string().regex(/^[A-Za-z0-9_-]{1,64}$/).optional()` desc (`435397-435402`): target a specific guide.
  - `H.strictObject`.
- **Output schema** `y$p` (`435405-435412`): `{ status: enum["created","updated","deleted","has_existing","unavailable"], share_url?, short_code?, message }`.
- **Tool object** `_$p = pi({ name: M3t, … })` — `cli_inner_pretty.js:435413+`. searchHint `"upload ONBOARDING.md and get a team share link"` (`435415`); `maxResultSizeChars:1000`.
- **isEnabled** (`435420-435422`): `hdt()`. `hdt` at `cli_inner_pretty.js:435302-435307`: false if `ra()` or `!di("allow_team_onboarding")` or `!iH()`; else `ct("tengu_flint_harbor_share", !1)`.
- **isConcurrencySafe** → `!1`; **isReadOnly** → `!1`; **isDestructive(e)** (`435444-435446`): `e.mode === "delete"`.
- **validateInput** → always `{ result:!0 }`.
- **call** (`cli_inner_pretty.js:435450+`): delete → looks up short_code (own or `hfo()` most-recent), `vza(s)` deletes → `Guide ${s} deleted.`; check → finds guide, stats local `ONBOARDING.md` (`R3t = "ONBOARDING.md"`, `435379`), uploads or returns existing link. Upload via `Hza` (`POST /api/organizations/:orgUUID/claude_code/onboarding`, `435373-435377`); emits `tengu_team_onboarding_share_created`.
- **In getAllBaseTools:** yes (`_Ka`, `436550` / assigned `436711`). **NEW:** carryover (name present in 2.1.156). **Confidence:** high.

---

## ShowOnboardingRolePicker  (NEW in 2.1.183)

- **Name const** `A3n = "ShowOnboardingRolePicker"` — `cli_inner_pretty.js:424336`.
- **Description const** `bqa` (`424337-424338`): `"Render a clickable role-picker chip row during Cowork onboarding so the user can pick their role and get a matching plugin installed."`
- **Prompt const** `Sqa` (`424339-424343`): the full "Render a clickable role-picker chip row…" prompt (resolution paths, `{"role":…}`/`{"dismissed":true}`/`{}`; "Do NOT call this in normal conversation"). Verbatim in assets.
- **Input schema** `kDp` (lazy) — `cli_inner_pretty.js:424356`: `H.strictObject({})` (call with no args). Output `LDp` (`424357`): `{ role?, dismissed? }`.
- **Tool object** `Eqa = pi({ name: A3n, … })` — `cli_inner_pretty.js:424358-424412`. searchHint `"show the Cowork onboarding role picker"` (`424360`); `maxResultSizeChars:1e4`.
- **isEnabled** (`424368`): `DDp`. `DDp` at `cli_inner_pretty.js:424344-424346`: `return Ge.CLAUDE_CODE_REMOTE` (only in remote/Cowork sessions).
- **isConcurrencySafe** → `!0`; **isReadOnly** → `!0`; **requiresUserInteraction()** → `!0` (`424375-424377`).
- **checkPermissions** (`424387-424389`): `{ behavior:"ask", message:"Pick your role?", updatedInput:{} }`.
- **call** (`424390-424398`): echoes `{ role? , dismissed? }` from the picker result (blocks until user responds — handled by the harness/UI).
- **In getAllBaseTools:** yes (`Eqa`, `436560`). **NEW vs 2.1.156:** **YES — entirely new** (0 occurrences of `"ShowOnboardingRolePicker"` in 2.1.156). **Confidence:** high.

---

## explain_command  (INTERNAL — Anthropic-API tool definition, NOT a base tool)

- **NOT in `getAllBaseTools`.** It is a raw Anthropic `tools` entry (wire-format, `input_schema`, not a `pi()` tool object) used only by the **permission explainer** sub-LLM call.
- **Tool definition object** `FMf` — `cli_inner_pretty.js:633098-633118`: `{ name: "explain_command", description: "Provide an explanation of a shell command", input_schema: { type:"object", properties: { explanation, reasoning, risk, riskLevel }, required:[…] } }`. Verbatim field descs (`633104-633113`):
  - `explanation`: `"What this command does (1-2 sentences)"`
  - `reasoning`: `'Why YOU are running this command. Start with "I" - e.g. "I need to check the file contents"'`
  - `risk`: `"What could go wrong, under 15 words"`
  - `riskLevel`: enum `["LOW","MEDIUM","HIGH"]`, desc `"LOW (safe dev workflows), MEDIUM (recoverable changes), HIGH (dangerous/irreversible)"`.
- **Result-parse Zod** `UMf` (`633119-633126`): `{ riskLevel: enum, explanation, reasoning, risk }`.
- **Usage:** in the permission-explainer call at `cli_inner_pretty.js:633027-633056`: `EW({ model: Gs(), system: BMf, messages:[…], tools:[FMf], tool_choice:{ type:"tool", name:"explain_command" }, querySource:"permission_explainer" })`. System prompt `BMf = "Analyze shell commands and explain what they do, why you're running them, and potential risks."` (`633082`). On success emits `tengu_permission_explainer_generated`; on parse failure `tengu_permission_explainer_error`.
- **NEW:** carryover (present in 2.1.156). **Confidence:** high — it is eval/internal, not exposed to the agent.

---

## eval_registered__*  (INTERNAL — REPL-registered tool factory, NOT a base tool)

- **NOT in `getAllBaseTools`.** This is a per-registered-tool factory used by the REPL (`registerTool`) feature; the wire name is templated.
- **Factory** `pPp(e, t)` — `cli_inner_pretty.js:425569-425632`. Returns `pi({ name: \`eval_registered__${e.name}\`, … })` (`425572`). The name string lives only at the template site (`425572`); related strings: `425557 uPp`/`425569`. Other anchors: `425572`, and the name-prefix guards at `377614` (`n.name.startsWith("eval_registered__")`) and `426825` (registerTool validation: `name must match ^[a-zA-Z0-9_-]{1,111}$ (wire name is prefixed with 'eval_registered__')`).
- **Input schema** (`425570`/`425580`): `inputSchema = H.object({}).passthrough()` (permissive); `inputJSONSchema: e.schema` (caller-supplied JSON schema).
- **Tool object fields:** `prompt()`→`e.description`; `description()`→`e.description`; `isEnabled()`→`!0`; `isConcurrencySafe()`→`!1`; `isReadOnly()`→`!1`; `checkPermissions()` (`425595-425597`): `{ behavior:"ask", message: \`Execute registered tool "${e.name}"\` }`; `call(o)` (`425598-425600`): `{ data: await e.handler(o) }`; `userFacingName()`→`e.displayName ?? e.name`.
- **Collected via** `c9a(e, t)` (`425552-425556`) which maps registered tools `for (let [,r] of e) n.push(pPp(r, t))` — only present when the REPL eval/registration surface is active (Bun transpiler `fPp`, `425643+`).
- **NEW:** carryover (present in 2.1.156). **Confidence:** high — internal REPL-eval mechanism, never in `getAllBaseTools`.

---

## Summary: NEW vs carryover (verified against 2.1.156 before-picture)

| Tool | 2.1.183 status | Evidence |
|------|----------------|----------|
| DesignSync | **NEW** | `"DesignSync"` / `list_projects` / `design-system projects` → 0 in 2.1.156 |
| Projects | **NEW** | `"allow_projects_tool"` / `"attached claude.ai project"` / `project_search` → 0 in 2.1.156 |
| ShowOnboardingRolePicker | **NEW** | `"ShowOnboardingRolePicker"` → 0 in 2.1.156 |
| Artifact | evolved | tool existed; the `"Render an HTML or Markdown"` prompt text is 0 in 2.1.156 |
| CronCreate/Delete/List, ScheduleWakeup, RemoteTrigger, PushNotification, StructuredOutput, TestingPermission, SendUserFile, SendUserMessage, ShareOnboardingGuide | carryover | name strings present in 2.1.156 |
| explain_command, eval_registered__* | carryover, internal/eval-only | present in 2.1.156; never in getAllBaseTools |

## Membership recap (in getAllBaseTools `LW`, `cli_inner_pretty.js:436517-436576`)

- In `LW()`: CronCreate, CronDelete, CronList (`w$p`), RemoteTrigger (`Zza`), SendUserFile (`x$p`), PushNotification (`oKa`), DesignSync (`k$p`), Artifact (`dKa`), ScheduleWakeup (`Y9a`), ShowOnboardingRolePicker (`Eqa`), SendUserMessage (`o9a`), ShareOnboardingGuide (`_Ka`), StructuredOutput (`Em`/`A5r`, but filtered out of agent set by `zR`@436634).
- Conditionally in `LW()`: Projects (`iKa`, only when env `CLAUDE_PROJECT_TOOL` set).
- Built but always disabled: TestingPermission (`isEnabled()===false`).
- NOT base tools (internal): explain_command (`FMf`, permission-explainer API tool), eval_registered__* (`pPp` REPL factory).
