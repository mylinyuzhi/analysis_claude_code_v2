# Runtime Lifecycle — From Emit to Model (v2.1.156)

> How a `<system-reminder>` travels from the place it is generated, through the attachment pipeline, into the API request body, and what each transformation guarantees. Every 2.1.156 claim below cites a verified `cli_inner_pretty.js:LINE` from `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`. Cross-validated by readable name against the 2.1.88 TS baseline at `/lyz/codespace/3rd/claude-code/src`.

## Pipeline stages

```
                  ┌──────────────────────────────────────────────┐
                  │   Stage 0: collectAttachments (Aw4)           │
                  │   • Master gate @412662: env-disabled →        │
                  │     ONLY queued-command attachments survive    │
                  │   • Otherwise: 30+ generators run in 2 parallel│
                  │     waves under a 1s abort budget, each wrapped │
                  │     by runAttachmentGenerator (E3) for          │
                  │     per-generator error isolation + telemetry. │
                  │   Result: Attachment[] each {type:"…", …}      │
                  │   cli_inner_pretty.js:412660-412738            │
                  └──────────────┬───────────────────────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────────────────────┐
                  │   Stage 1: normalizeAttachmentForAPI (kc6)    │
                  │   3-tier dispatch:                             │
                  │     (a) agent-team early-exit (R7 gated)       │
                  │     (b) per-type renderer map (DG4)            │
                  │     (c) big switch + noop allow-list + throw   │
                  │   Each case wraps via C_/S0 → List<UserMessage>│
                  │   with isMeta=true.                            │
                  │   cli_inner_pretty.js:445425-445808           │
                  └──────────────┬───────────────────────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────────────────────┐
                  │   Stage 2: request normalizer D0 (444461)     │
                  │   walks the rendered message stream and:       │
                  │   • mid-conv-system path (model supports beta):│
                  │     extract reminder bodies (RQ_) → api_system │
                  │     (role:"system") flush helper w().          │
                  │   • in-band path (default/fallback): re-wrap    │
                  │     via ensureSystemReminderWrap (DQ_) when     │
                  │     tengu_chair_sermon ON, then smoosh-merge    │
                  │     into the prior user msg via WQ_.            │
                  │   smooshSystemReminderSiblings (hG4) folds SR  │
                  │   text into the LAST tool_result (Ai6).         │
                  └──────────────┬───────────────────────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────────────────────┐
                  │   Stage 3: dual-build + send (557037-557043)  │
                  │   Primary build b uses model arg (api_system   │
                  │   reminders); fallback B pre-built WITHOUT model│
                  │   (in-band <system-reminder> bodies). On a 400 │
                  │   role:"system" rejection (xP6) → swap to B,    │
                  │   sticky-reject the beta (aI$). Tagged text      │
                  │   reaches the model verbatim.                   │
                  │   cli_inner_pretty.js:557428-557438            │
                  └──────────────┬───────────────────────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────────────────────┐
                  │   Stage 4: Side surfaces (UI / telemetry)     │
                  │   • UI render: isMeta filters reminders out.   │
                  │   • Sticky-prompt: stripLeadingReminders (PG4) │
                  │   • Transcript search: indexOf strip-all (Nm4) │
                  │   • Preview/activity: regex strip-all (OD9)    │
                  │   • Telemetry: split SR bodies into the        │
                  │     system_reminders span (Uc5 + iv7).          │
                  └──────────────────────────────────────────────┘
```

## Stage 0 — `collectAttachments` (`Aw4`) and the master gate

This is where reminders are *born*. The function runs a pool of generators, each of which may or may not emit a typed `Attachment`. The first executable line is the master gate.

```javascript
// ============================================
// collectAttachments - generator pool entry + master gate
// Location: cli_inner_pretty.js:412660-412668
// ============================================

// ORIGINAL (for source lookup):
async function Aw4(H, $, q, K, _, z, A) {
  let Y = Bf($.options.mainLoopModel);
  if (xH(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || xH(process.env.CLAUDE_CODE_SIMPLE)) return gV$(K, Y);
  let f = C4(), O = setTimeout((Z) => Z.abort(), 1000, f),
    M = { ...$, abortController: f }, j = !$.agentId,
    w = H ? [ /* at_mentioned_files, mcp_resources, agent_mentions */ ] : [],
    ...
}

// READABLE (for understanding):
async function collectAttachments(hasUserPrompt, ctx, q, queuedCommands, messages, z, A) {
  const model = resolveModel(ctx.options.mainLoopModel);

  // MASTER GATE: if attachments are disabled by env, emit ONLY queued-command
  // attachments — everything else (todo nudges, diagnostics, plan banners …) is
  // suppressed. Queued commands MUST survive because --bare/coworker mode depends
  // on the queued task-notification path even when attachments are off.
  if (isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE))
    return getQueuedCommandAttachments(queuedCommands, model);

  const abort = newAbortController();
  const abortTimer = setTimeout((c) => c.abort(), 1000, abort);  // 1s total generator budget
  const genCtx = { ...ctx, abortController: abort };
  const isMainAgent = !ctx.agentId;                              // subagents get a reduced set
  ...
}

// Mapping: Aw4→collectAttachments, $→ctx, K→queuedCommands, gV$→getQueuedCommandAttachments,
//          xH→isEnvTruthy, Bf→resolveModel, j→isMainAgent
```

**The two parallel waves** (verified at `cli_inner_pretty.js:412660-412738`): an always-run wave (`J` — queued commands, date change, ultrathink, deferred-tools delta, agent-listing delta, MCP-instructions delta, changed files, nested memory, skills, plan/auto banners, todo/task reminders, agent-team) and a main-agent-only wave (`X` — IDE selection/opened file, output style, diagnostics, LSP, unified tasks, async hook responses, memory_update, token/budget usage, verify-plan). Both run concurrently via `Promise.all([Promise.all(J), Promise.all(X)])`, capped at 1 second by the abort timer. A slow generator (git walk, LSP, CLAUDE.md traversal) is aborted rather than blocking the whole request.

### Why the master gate keeps queued commands

The gate at `cli_inner_pretty.js:412662` returns `getQueuedCommandAttachments` (`gV$`, `cli_inner_pretty.js:412764-412798`) even when `CLAUDE_CODE_DISABLE_ATTACHMENTS`/`CLAUDE_CODE_SIMPLE` is set. The 2.1.88 baseline has the identical carve-out at `attachments.ts:752-761` with the explanatory comment: a coworker running with `--bare` depends on the queued `task-notification` to receive work. Suppressing *that* would break the headless agent, so the one attachment that is *transport*, not *context*, survives the gate.

### Per-generator isolation — `runAttachmentGenerator` (`E3`)

Each generator is wrapped by `E3` (`cli_inner_pretty.js:412739-412763`): it `try/catch`-es the generator, returns `[]` on failure (so one broken generator does not lose the entire reminder set), and samples timing + byte-size telemetry 5% of the time via the `tengu_attachment_compute_duration` event. This is the resilience boundary — the reminder pipeline is designed so a single faulty generator degrades to "no reminder" rather than "no request."

## Stage 1 — `normalizeAttachmentForAPI` (`kc6`) deep dive

This is the **central case-dispatch table** that turns a typed attachment into reminder-wrapped user messages. It is a 3-tier router.

```javascript
// ============================================
// normalizeAttachmentForAPI - typed attachment → wrapped user messages
// Location: cli_inner_pretty.js:445425-445808
// ============================================

// ORIGINAL (for source lookup):
function kc6(H) {
  if (R7()) {
    if (H.type === "teammate_mailbox") return [T8({ content: _Q_().formatTeammateMessages(H.messages), isMeta: !0 })];
    if (H.type === "team_context") return [T8({ content: `<system-reminder>…</system-reminder>`, isMeta: !0 })];
  }
  if (H.type in DG4) return DG4[H.type](H);   // per-type renderer map
  switch (H.type) {
    case "file": …
    case "todo_reminder": …            // @445511, text @445514
    case "task_reminder": …            // @445524 (gated if(!OD())return[]), text @445528
    case "relevant_memories": …        // @445538
    case "plan_mode": return IQ_(H);   // @445573
    case "memory_update": …            // @445768
    case "verify_plan_reminder": …     // @445786
    … // many more
  }
  if ([ "autocheckpointing","background_task_status","todo","task_progress",
        "ultramemory","compaction_reminder","current_session_memory",
        "thinking_reminder","companion_intro","pen_mode_enter","pen_mode_exit",
        "ultrawork_request" ].includes(H.type)) return [];   // @445791-445806 legacy noop allow-list
  return (em("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${H.type}`)), []);  // @445808
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
  // Tier (a): agent-team early-exit, only when the swarm feature is enabled.
  if (isAgentSwarmsEnabled()) {
    if (attachment.type === "teammate_mailbox")
      return [makeUserMessage({ content: getTeammateMailbox().formatTeammateMessages(attachment.messages), isMeta: true })];
    if (attachment.type === "team_context")
      return [makeUserMessage({ content: `<system-reminder>\n# Team Coordination\n…\n</system-reminder>`, isMeta: true })];
  }
  // Tier (b): per-type renderer map (simple cases — file/IDE/hook/usage/etc.).
  if (attachment.type in PER_TYPE_RENDERERS) return PER_TYPE_RENDERERS[attachment.type](attachment);
  // Tier (c): inline switch for complex multi-branch cases.
  switch (attachment.type) {
    case "todo_reminder": …            // TodoWrite nudge
    case "task_reminder": …            // TaskCreate/TaskUpdate nudge (feature-gated)
    case "relevant_memories": …        // auto-memory recall
    case "plan_mode": return planModeReminder(attachment);
    case "memory_update": …            // memory directory changed
    case "verify_plan_reminder": …     // post-plan verify nudge
    … // file / invoked_skills / queued_command / diagnostics / plan_mode_reentry /
      // auto_mode / mcp_resource / task_status / async_hook_response / hook_success /
      // context_efficiency / deferred_tools_delta / agent_listing_delta /
      // mcp_instructions_delta
  }
  // Legacy noop allow-list — these types exist in the union for transcript-load
  // compatibility but no longer emit. Returning [] keeps an old transcript loadable.
  if (LEGACY_NOOP_TYPES.includes(attachment.type)) return [];
  // Unknown type: log structured error but DO NOT throw — a malformed attachment
  // must never block the next message from being sent.
  reportError("normalizeAttachmentForAPI", new Error(`Unknown attachment type: ${attachment.type}`));
  return [];
}

// Mapping: kc6→normalizeAttachmentForAPI, H→attachment, R7→isAgentSwarmsEnabled,
//          _Q_→getTeammateMailbox, T8→makeUserMessage, DG4→PER_TYPE_RENDERERS,
//          IQ_→planModeReminder, em→reportError
```

Verified anchors: entry + agent-team early-exit at `cli_inner_pretty.js:445425-445427`; per-type map dispatch `if (H.type in DG4) return DG4[H.type](H)` at `cli_inner_pretty.js:445461`; switch start at `cli_inner_pretty.js:445462`; noop allow-list at `cli_inner_pretty.js:445791-445806`; unknown-type fallthrough at `cli_inner_pretty.js:445808`.

### Why a map (`DG4`) *and* a switch (`kc6`)

The split is intentional. The **per-type renderer map** (`DG4`, `cli_inner_pretty.js:446557-446767`) holds the *simple* cases — each is a `(attachment) => UserMessage[]` that wraps one string. The **inline switch** holds the *complex* cases that branch internally (e.g. `task_status` has killed/running/other branches; `mcp_resource` has text/blob branches; `plan_mode` delegates to a sparse/full/subagent selector). Keeping the multi-branch cases as switch arms keeps their full text side-by-side in one source location so a reviewer can audit "does adding this attachment break compaction?" by reading one block, while the trivial one-liner renderers live in a flat lookup table. The 2.1.88 baseline (`normalizeAttachmentForAPI`, `messages.ts:3453`) had the same dual map+switch shape; 2.1.156 only refactored the map out to a top-level const (`DG4`).

### The "legacy noop" allow-list

Verified at `cli_inner_pretty.js:445791-445806`: `autocheckpointing`, `background_task_status`, `todo`, `task_progress`, `ultramemory`, `compaction_reminder`, `current_session_memory`, `thinking_reminder`, `companion_intro`, `pen_mode_enter`, `pen_mode_exit`, `ultrawork_request` → `[]`. These types exist for **transcript-load compatibility**: earlier versions wrote them to `transcript.jsonl`, and loading an old transcript would otherwise hit the "Unknown attachment type" error path on every replay. The empty-array return makes them invisible to the model and the UI without polluting the typed-attachment union with text-building code paths. The `em(...)` call on the fallthrough logs but never throws — a malformed attachment is degraded to silence, never an exception that drops the user's turn.

### How each case wraps — the canonical idiom

Nearly every case ends in `C_([T8({content, isMeta:!0})])` (e.g. the todo_reminder case at `cli_inner_pretty.js:445522`). `T8` (`makeUserMessage`, `cli_inner_pretty.js:443846-443883`) builds the `{type:"user", message:{role:"user",content}, isMeta:true}` envelope; `C_` (`wrapMessagesAsReminders`, `cli_inner_pretty.js:445299-445312`) wraps the content string in `<system-reminder>\n…\n</system-reminder>` via `S0`. `isMeta:true` is the UI-suppression flag every reminder carries.

## The three wrap layers — and why idempotency matters

A reminder's text can be wrapped at **three distinct points**, and the design is explicitly **idempotent** so that running all three never double-wraps. This is the core of the runtime lifecycle.

| Layer | Function | Location | When it runs |
|-------|----------|----------|--------------|
| 1. emit-time wrap | `C_`/`S0` | `cli_inner_pretty.js:445299-445312` / `445237-445241` | inside each `normalizeAttachmentForAPI` case |
| 2. ensure-wrap safety net | `DQ_` | `cli_inner_pretty.js:444371-444383` | in `D0`, gated by `tengu_chair_sermon` |
| 3. smoosh-into-tool_result | `hG4`/`Ai6` | `cli_inner_pretty.js:444384-444402` / `444756-444785` | folds SR siblings into the last tool_result |

### Layer 1 — emit-time wrap (`S0` / `C_`)

```javascript
// ============================================
// wrapStringMultiline / wrapMessagesAsReminders - the canonical envelope
// Location: cli_inner_pretty.js:445237-445241 (S0), 445299-445312 (C_)
// ============================================

// ORIGINAL (for source lookup):
function S0(H) {
  return `<system-reminder>
${H}
</system-reminder>`;
}
function C_(H) {
  return H.map(($) => {
    if (typeof $.message.content === "string")
      return { ...$, message: { ...$.message, content: S0($.message.content) } };
    else if (Array.isArray($.message.content)) {
      let q = $.message.content.map((K) => K.type === "text" ? { ...K, text: S0(K.text) } : K);
      return { ...$, message: { ...$.message, content: q } };
    }
    return $;
  });
}

// READABLE (for understanding):
function wrapStringMultiline(text) {
  // VERBATIM envelope: newline before AND after the body.
  return `<system-reminder>\n${text}\n</system-reminder>`;
}
function wrapMessagesAsReminders(messages) {
  return messages.map((msg) => {
    if (typeof msg.message.content === "string")
      return { ...msg, message: { ...msg.message, content: wrapStringMultiline(msg.message.content) } };
    if (Array.isArray(msg.message.content)) {
      // Wrap each text block; image/document/tool_use blocks pass untouched.
      const wrapped = msg.message.content.map((b) => b.type === "text" ? { ...b, text: wrapStringMultiline(b.text) } : b);
      return { ...msg, message: { ...msg.message, content: wrapped } };
    }
    return msg;
  });
}

// Mapping: S0→wrapStringMultiline, C_→wrapMessagesAsReminders, H→text/messages
```

This is unchanged from the 2.1.88 baseline (`wrapInSystemReminder` at `messages.ts:3097-3099`, `wrapMessagesInSystemReminder` at `messages.ts:3101` — byte-identical envelope).

### Layer 2 — `ensureSystemReminderWrap` (`DQ_`), the idempotent safety net

```javascript
// ============================================
// ensureSystemReminderWrap - idempotent re-wrap (identity-preserving)
// Location: cli_inner_pretty.js:444371-444383
// ============================================

// ORIGINAL (for source lookup):
function DQ_(H) {
  let $ = H.message.content;
  if (typeof $ === "string") {
    if ($.startsWith("<system-reminder>")) return H;
    return { ...H, message: { ...H.message, content: S0($) } };
  }
  let q = !1,
    K = $.map((_) => {
      if (_.type === "text" && !_.text.startsWith("<system-reminder>")) return ((q = !0), { ..._, text: S0(_.text) });
      return _;
    });
  return q ? { ...H, message: { ...H.message, content: K } } : H;
}

// READABLE (for understanding):
function ensureSystemReminderWrap(userMessage) {
  const content = userMessage.message.content;
  // String fast path
  if (typeof content === "string") {
    if (content.startsWith("<system-reminder>")) return userMessage;        // already wrapped — identity
    return { ...userMessage, message: { ...userMessage.message, content: wrapStringMultiline(content) } };
  }
  // Array content — wrap each text block individually
  let mutated = false;
  const newContent = content.map((block) => {
    if (block.type === "text" && !block.text.startsWith("<system-reminder>")) {
      mutated = true;
      return { ...block, text: wrapStringMultiline(block.text) };
    }
    return block;
  });
  // Return the SAME object if nothing changed — preserves referential identity.
  return mutated ? { ...userMessage, message: { ...userMessage.message, content: newContent } } : userMessage;
}

// Mapping: DQ_→ensureSystemReminderWrap, H→userMessage, $→content, S0→wrapStringMultiline, q→mutated, K→newContent
```

It is applied in the request normalizer `D0` at `cli_inner_pretty.js:444604`: `let V = V$("tengu_chair_sermon", !1) ? G.map(DQ_) : G`. The `startsWith("<system-reminder>")` test is what makes layer 2 **idempotent with respect to layer 1** — a text block already wrapped at emit time is returned untouched, so the double-wrap `<system-reminder><system-reminder>…` never occurs.

**Why the identity return matters (cache-prefix stability):** The normalized message list feeds the API request, whose content bytes participate in the server-side prompt cache key. If `ensureSystemReminderWrap` always returned a fresh object even on a no-op, downstream `===` checks and byte-stability would break. The two-pass `mutated` boolean returns the original object when the wrap is a no-op, keeping the serialized layout identical turn-over-turn.

**Why it is gated by `tengu_chair_sermon`:** The re-wrap is a safety net that fires only when the gate is on (`V$("tengu_chair_sermon", !1)`, default false). Statsig gating lets the fix roll out gradually — a generator that *forgot* to wrap (or one added late and not retrofitted) would otherwise leak raw text as plain user input. Applying the re-wrap unconditionally to legacy transcripts could reshape historical content, so it is gated.

### Layer 3 — `smooshSystemReminderSiblings` (`hG4`) + `smooshIntoToolResult` (`Ai6`)

```javascript
// ============================================
// smooshSystemReminderSiblings - fold SR text into the LAST tool_result
// Location: cli_inner_pretty.js:444384-444402
// ============================================

// ORIGINAL (for source lookup):
function hG4(H) {
  return H.map(($) => {
    if ($.type !== "user") return $;
    let q = $.message.content;
    if (!Array.isArray(q)) return $;
    if (!q.some((M) => M.type === "tool_result")) return $;
    let _ = [], z = [];
    for (let M of q)
      if (M.type === "text" && M.text.startsWith("<system-reminder>")) _.push(M);
      else z.push(M);
    if (_.length === 0) return $;
    let A = z.findLastIndex((M) => M.type === "tool_result"), Y = z[A], f = Ai6(Y, _);
    if (f === null) return $;
    let O = [...z.slice(0, A), f, ...z.slice(A + 1)];
    return { ...$, message: { ...$.message, content: O } };
  });
}

// READABLE (for understanding):
function smooshSystemReminderSiblings(messages) {
  return messages.map((msg) => {
    if (msg.type !== "user") return msg;
    const content = msg.message.content;
    if (!Array.isArray(content)) return msg;
    if (!content.some((b) => b.type === "tool_result")) return msg;     // only act on tool-result turns

    // Partition: SR-prefixed text blocks → reminderBlocks, everything else → kept
    const reminderBlocks = [], kept = [];
    for (const block of content) {
      if (block.type === "text" && block.text.startsWith("<system-reminder>")) reminderBlocks.push(block);
      else kept.push(block);
    }
    if (reminderBlocks.length === 0) return msg;

    // Fold into the LAST tool_result — positionally adjacent in the rendered prompt
    const lastTrIdx = kept.findLastIndex((b) => b.type === "tool_result");
    const folded = smooshIntoToolResult(kept[lastTrIdx], reminderBlocks);
    if (folded === null) return msg;     // tool_reference constraint — leave alone

    const newContent = [...kept.slice(0, lastTrIdx), folded, ...kept.slice(lastTrIdx + 1)];
    return { ...msg, message: { ...msg.message, content: newContent } };
  });
}

// Mapping: hG4→smooshSystemReminderSiblings, H→messages, $→msg, q→content, _→reminderBlocks,
//          z→kept, A→lastTrIdx, Y→lastTr, Ai6→smooshIntoToolResult, f→folded, O→newContent
```

`smooshIntoToolResult` (`Ai6`, `cli_inner_pretty.js:444756-444785`) performs the actual fold — joining into the tool_result's string content with `\n\n` separators, or coalescing text blocks. Critically, it returns `null` if the target tool_result's content contains a `tool_reference` block (detected via the `q.some($s)` predicate): the API rejects mixing `tool_reference` with other types, so folding would 400 the request. On `null`, the caller leaves the reminder as a sibling.

**The "fold into LAST tool_result" rule:** A user turn can carry multiple tool_results (parallel tool calls returning together). The reminder folds into the *last* one because it was generated *after* all results returned — it is most relevant to the final-position result, and folding there keeps the message a single logical result.

**Why fold at all (the stop-sequence anomaly):** Without the fold, the model sees `[tool_result][text "<system-reminder>…"]` as adjacent siblings. Some API endpoints emit a "Human:" boundary marker before the SR-text block, which over repetitions trains the model to emit a stop sequence after every tool result ("tool_result followed by a human turn ⇒ my turn ended"). Folding the reminder *into* the tool_result removes the boundary marker — the reminder just looks like extra content the tool returned. The 2.1.88 baseline carries the same fix (`smooshIntoToolResult`, `messages.ts:2534`, with the tool_reference-exclusion comment at `messages.ts:2524-2531`).

### Why three layers instead of one

The three layers exist because the wrap can be *lost* at different points:

1. **Layer 1** is the happy path — every well-behaved generator wraps at emit time.
2. **Layer 2** catches generators that *didn't* wrap (legacy or buggy), guaranteeing no raw text block reaches the model labeled as user input. It is the "belt" to layer 1's "suspenders."
3. **Layer 3** is not about *whether* text is wrapped but *where it sits structurally*: a wrapped SR text block adjacent to a tool_result must be folded *into* the tool_result to avoid the stop-sequence training anomaly above.

All three are idempotent via the same `startsWith("<system-reminder>")` test, so running them in sequence (layer 1 at emit, layers 2+3 in `D0` at request time) is safe and never double-wraps. The merge driver `WQ_` (used at `cli_inner_pretty.js:444607` in the `O[O.length-1] = V.reduce((E,S) => WQ_(E,S), v)` fold, defined at `cli_inner_pretty.js:444626-444630`; gated form `VQ_` at `cli_inner_pretty.js:444787-444803`) reduces the ensure-wrapped messages into the prior user message, applying the smoosh at merge time.

## Stage 2 — the request normalizer `D0` and the dual representation

`D0` (`cli_inner_pretty.js:444461`) is the function that walks the rendered message stream and decides, per reminder, whether it goes out as a real `role:"system"` message or as in-band `<system-reminder>` user text.

```javascript
// ============================================
// flush helper w() inside D0 - the dual-representation switch
// Location: cli_inner_pretty.js:444492-444505
// ============================================

// ORIGINAL (for source lookup):
function w() {
  if (M.length === 0) return;
  let W = M.join("\n\n"); M.length = 0;
  let G = Tx(O);
  if (G?.type === "api_system") G.message.content += `\n\n${W}`;
  else if (G?.type === "user") ((j = !0), O.push(SQ_(W)));
  else O.push(T8({ content: S0(W), isMeta: !0 }));
}

// READABLE (for understanding):
function flushAccumulatedReminders() {
  if (reminderBuffer.length === 0) return;
  const joined = reminderBuffer.join("\n\n");
  reminderBuffer.length = 0;
  const prev = lastOf(outputMessages);
  if (prev?.type === "api_system")
    prev.message.content += `\n\n${joined}`;                 // coalesce into prior role:"system" message
  else if (prev?.type === "user")
    (emittedApiSystem = true, outputMessages.push(makeApiSystemMessage(joined)));   // NEW role:"system" message
  else
    outputMessages.push(makeUserMessage({ content: wrapStringMultiline(joined), isMeta: true }));  // FALLBACK in-band
}

// Mapping: w→flushAccumulatedReminders, M→reminderBuffer, O→outputMessages, Tx→lastOf,
//          SQ_→makeApiSystemMessage, S0→wrapStringMultiline, T8→makeUserMessage
```

The accumulator `M` is filled only when the model supports the mid-conversation-system beta. The attachment branch at `cli_inner_pretty.js:444595-444603` shows the decision:

```javascript
// ORIGINAL (for source lookup):
case "attachment": {
  let G = kc6(W.attachment);
  if (K) {                                  // K = model supports mid-conv-system
    let E = RQ_(G);                          // extract reminder bodies (unwrapped)
    if (E !== null) { M.push(E); continue; } // → accumulate for role:"system" emission
  }
  let V = V$("tengu_chair_sermon", !1) ? G.map(DQ_) : G,   // else: in-band path, ensure-wrap
    ...
}
```

`RQ_` (`extractReminderBodiesForApiSystem`, `cli_inner_pretty.js:445282-445298`) unwraps each reminder's text via `fi6` (the multiline extract regex) and joins them, returning the raw body for re-emission as `role:"system"` content — or `null` if any block is non-text or the result is empty (in which case the attachment falls through to the in-band wrap path). When `D0` is called WITHOUT a model argument (`q === void 0`, so `K=false`), `XH8` is never consulted and reminders **always** take the in-band `S0`-wrapped path. This is exactly what the fallback build does (Stage 3).

## Stage 3 — dual-build, send, and the `role:"system"` rejection fallback

This is the largest NEW machinery in the subsystem; there is **no counterpart in the 2.1.88 baseline**. The harness optimistically delivers reminders as real `role:"system"` messages under the `mid-conversation-system-2026-04-07` beta on supporting models, and pre-builds an in-band fallback so a server rejection costs only one retry.

```javascript
// ============================================
// dual-build at request time - primary (api_system) + pre-built fallback
// Location: cli_inner_pretty.js:557037-557043
// ============================================

// ORIGINAL (for source lookup):
I = am8(), C = !1;
if (_h != null && g3q(I, _h)) ((C = !0), (M = M.filter((BH) => BH !== _h)));
let b = D0(E, X, C ? void 0 : z.model);
($D$(b, Bf(z.model).maxBase64Size), b_("query_message_normalization_end"), (b = h(b)));
let B = null;
if (_h && !C && M.includes(_h)) B = b.some((BH) => BH.type === "api_system") ? h(D0(E, X)) : b;

// READABLE (for understanding):
const stickyBetas = getStickyBetaState();             // {sent, rejected} sets
let betaAlreadyRejected = false;
if (midConvSystemBeta != null && isBetaRejected(stickyBetas, midConvSystemBeta)) {
  betaAlreadyRejected = true;
  betaList = betaList.filter((b) => b !== midConvSystemBeta);   // drop the beta header
}
// PRIMARY build: pass model arg ONLY if the beta is not already rejected → reminders
// that fit go out as role:"system" (api_system) messages.
let primary = normalizeRequest(messages, toolNames, betaAlreadyRejected ? undefined : model);
validateAndFinalize(primary);
// Pre-build the FALLBACK: D0 with NO model arg → every reminder folded into
// <system-reminder> user bodies. Only needed if primary actually used api_system.
let fallback = null;
if (midConvSystemBeta && !betaAlreadyRejected && betaList.includes(midConvSystemBeta))
  fallback = primary.some((m) => m.type === "api_system") ? finalize(normalizeRequest(messages, toolNames)) : primary;

// Mapping: am8→getStickyBetaState, g3q→isBetaRejected, _h→midConvSystemBeta,
//          C→betaAlreadyRejected, D0→normalizeRequest, z.model→model, B→fallback, b→primary
```

```javascript
// ============================================
// the [mid-conv-system] rejection handler - swap to fallback + sticky-reject
// Location: cli_inner_pretty.js:557428-557438
// ============================================

// ORIGINAL (for source lookup):
if (B && xP6(m8)) {
  if (((M = M.filter((C6) => C6 !== _h)), (b = B), (B = null), _h)) aI$(I, _h);
  return (
    N('[mid-conv-system] server rejected role:"system" — falling back to <system-reminder> body, sticky-rejecting beta until /clear or /compact', { level: "warn" }),
    d("tengu_mid_conv_system_fallback_retry", {}),
    "retry:mid-conv-system"
  );
}

// READABLE (for understanding):
if (fallback && isRoleSystemRejection(error)) {
  betaList = betaList.filter((b) => b !== midConvSystemBeta);  // drop beta
  primary = fallback;                                          // swap to in-band build
  fallback = null;
  if (midConvSystemBeta) stickyRejectBeta(stickyBetas, midConvSystemBeta);  // .sent.delete + .rejected.add
  logWarn('[mid-conv-system] server rejected role:"system" — falling back to <system-reminder> body, sticky-rejecting beta until /clear or /compact');
  emitTelemetry("tengu_mid_conv_system_fallback_retry", {});
  return "retry:mid-conv-system";
}

// Mapping: xP6→isRoleSystemRejection, aI$→stickyRejectBeta, _h→midConvSystemBeta,
//          B→fallback, b→primary, N→logWarn, d→emitTelemetry
```

The rejection detector `xP6` (`cli_inner_pretty.js:186567-186574`) recognizes three 400-error shapes: the beta header not being recognized (`message includes _h.header && "anthropic-beta"`), an `"Unexpected role"`/`"input message role"` error, and a `"not supported … role system"` error. `aI$` (`cli_inner_pretty.js:1938-1940`) marks the beta rejected for the rest of the session (`sent.delete($); rejected.add($)`).

**Sticky reject — why:** Once a server/model rejects the beta, every subsequent reminder would otherwise re-try it, get rejected, fall back — wasting one round-trip per reminder *and* reshaping the message array each turn (busting the prompt cache). Sticky-rejecting until `/clear` or `/compact` resets state keeps both the retry budget and the cache prefix stable. The `tengu_mid_conv_system_fallback_retry` telemetry event lets Anthropic measure how often the beta is rejected in the wild.

**Why retry rather than skip:** The reminder text *must* reach the model — skipping would silently drop important context (a memory recall, a plan-mode banner). The pre-built fallback (`B`) lets the message go through with model-visible in-band wrapping instead, at the cost of exactly one retry.

## Stage 4 — side surfaces (UI / telemetry strip)

Once the tagged text is in the request body, the **same text** must be hidden from every human-facing surface. The strip primitives are unchanged in behavior from 2.1.88; only the obfuscated names moved.

- **UI render** keys on `isMeta`: a reminder-bearing user message has `isMeta:true`, so the Ink renderer filters it from the transcript view (predicate `if (msg.isMeta || msg.isVisibleInTranscriptOnly) return null;`, e.g. sticky extractor at `cli_inner_pretty.js:499732-499755`).
- **Sticky-prompt / last-user-prompt:** `stripLeadingReminders` (`PG4`, `cli_inner_pretty.js:443733-443740`) peels leading `<system-reminder>…</system-reminder>` blocks (the literal `18` = `"</system-reminder>".length`) so the breadcrumb shows what the user actually typed.
- **Transcript search index:** an indexOf-based strip-ALL loop using the close-tag constant `Nm4 = "</system-reminder>"` (`cli_inner_pretty.js:495652`, loop init at `cli_inner_pretty.js:495599`, `while (K >= 0)` body `495600-495603`, `return q` at `495605`) removes reminder blocks anywhere (including mid-message dense memory reminders), without inserting a space.
- **Preview / activity log / fuzzy search:** the regex strip-all `OD9` (`cli_inner_pretty.js:614580-614582`) replaces every `<system-reminder>…</system-reminder>` OR `<task-notification>…</task-notification>` slice with a single space (the trailing `|$` nukes an unterminated tag too).
- **Telemetry split:** `JN6` (`cli_inner_pretty.js:271456-271458`) extracts a wholly-wrapped reminder body, and `Uc5` (`cli_inner_pretty.js:271459-271492`) partitions the message tail into `{contextParts, systemReminders}`, with a NEW first branch `if (K.type === "api_system") { q.push(K.message.content); continue; }` so a reminder delivered as a real `role:"system"` message still lands in the `systemReminders` bucket. The span setter `iv7` emits `system_reminders` / `system_reminders_count` separately from `new_context` / `new_context_message_count` (`cli_inner_pretty.js:271583-271584`). Counts are always emitted; bodies require the `OTEL_LOG_USER_PROMPTS` gate.

## How the model is taught to read reminders

The raw tagged text reaches the model verbatim. The system prompt establishes the convention so the model knows these are harness-injected context, not user words. Verified at `cli_inner_pretty.js:555453`:

> "Tool results and user messages may include `<system-reminder>` or other tags. Tags contain information from the system. They bear no direct relation to the specific tool results or user messages in which they appear."

This is the contract that makes folding a reminder into a tool_result (Stage 2, layer 3) semantically safe — the model is told the tag's content "bear[s] no direct relation" to the result it rides on.

## Compaction interaction

When the conversation is compacted (`/compact` or auto-triggered):

1. **Pre-compact** — the summariser reads the transcript including prior reminders; most are stripped before summarisation (via the extract/strip-all paths) so the summary captures *what happened* without reminder noise.
2. **Compact boundary** — emitted as a `system` message with `subtype:"compact_boundary"` (verified at `cli_inner_pretty.js:43787` and `337739`). Reminders firing *after* a boundary are re-emitted with full (not sparse) text because the summary may have evicted the prior context that established them.
3. **Post-compact replay** — `invoked_skills`, `compact_file_reference`, and `relevant_memories` replay through `normalizeAttachmentForAPI` — all reminders too.

See `07_compact/` for the broader compaction analysis.

## Statsig gates / env that affect this pipeline

| Gate / env | Effect when ON |
|------------|----------------|
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` / `CLAUDE_CODE_SIMPLE` | Master gate (`cli_inner_pretty.js:412662`) — suppress all attachments except queued commands |
| `tengu_chair_sermon` | Enables `ensureSystemReminderWrap` (`DQ_`, applied at `cli_inner_pretty.js:444604`) re-wrap + the universal smoosh in `WQ_`/`VQ_` (`WQ_` defined at `cli_inner_pretty.js:444626-444630`, `VQ_` at `444787-444803`) |
| `mid-conversation-system-2026-04-07` beta | Enables `role:"system"` reminder delivery on supporting models; pre-built fallback + sticky-reject on 400 |
| `CLAUDE_CODE_FORCE_MID_CONVERSATION_SYSTEM` | Force-enables the mid-conv-system capability check (`XH8`, `cli_inner_pretty.js:130520`) |
| `OTEL_LOG_USER_PROMPTS` | Emits reminder *bodies* (not just counts) into the `system_reminders` span attribute |
| `tengu_attachment_compute_duration` | (telemetry) 5% sample of per-generator timing/size in `E3` |
| `tengu_mid_conv_system_fallback_retry` | (telemetry) counts how often the beta-reject retry path fires |

## Putting it together — a concrete trace

Suppose the model just used `/remember` two turns ago and `pendingMemoryUpdates` is non-empty. The next request preparation pipeline runs:

1. **`collectAttachments` (`Aw4`, `cli_inner_pretty.js:412660`)** runs all generators in two parallel waves under the 1s budget. The `memory_update` generator (main-agent wave) emits one `memory_update` attachment.
2. **`normalizeAttachmentForAPI` (`kc6`)** routes the `memory_update` attachment to its switch case at `cli_inner_pretty.js:445768`. The case builds a multi-line text block ("…updated your memory directory…" + the ambient-context trailer `yT8`) and wraps via `C_([T8({content, isMeta:true})])`, returning one wrapped user message (layer 1).
3. **`D0` (`cli_inner_pretty.js:444461`)** walks the stream. If the model supports the mid-conv-system beta (`K=true`), `RQ_` extracts the reminder body and accumulates it for an `api_system` flush (`w()` → `SQ_`). Otherwise the in-band path runs: `DQ_` ensure-wraps (idempotent — already starts with `<system-reminder>`, identity return), then the smoosh-merge `WQ_` folds it into the prior user message; if that message has a tool_result, `hG4`/`Ai6` folds the SR text into the last tool_result.
4. **Dual-build (`cli_inner_pretty.js:557037`)** produces `b` (primary, possibly using `api_system`) and `B` (pre-built in-band fallback).
5. **Send.** If the server 400s on `role:"system"` (`xP6`), swap to `B`, sticky-reject the beta (`aI$`), emit `tengu_mid_conv_system_fallback_retry`, return `"retry:mid-conv-system"`. Otherwise the model sees the reminder verbatim.
6. **UI render** — the message is `isMeta:true`; the Ink renderer filters it out. The user sees only the model's response.
7. **Telemetry** — `Uc5` extracts the SR body into the `system_reminders` span attribute (separated from `new_context`); dashboards see "1 reminder fired" without inflating the user-content metric.

## Confirmed slimming facts (re-verified in this lifecycle)

- **Per-Read malware `<system-reminder>` FULLY REMOVED.** The 2.1.88 `FileReadTool.ts:730` constant that appended a `CYBER_RISK_MITIGATION` malware reminder to EVERY Read result is gone — `grep -c "malware"` over the 2.1.156 bundle returns 0. (The separate `CYBER_RISK_INSTRUCTION` system-prompt clause is a different, still-present thing — out of this lifecycle's scope.)
- **`todo_reminder` / `task_reminder` trailing sentence dropped.** Verified at `cli_inner_pretty.js:445514` (todo) and `445528` (task): both now end at "…ignore if not applicable." with NO trailing "Make sure that you NEVER mention this reminder to the user." (2.1.88 `messages.ts:3668`/`3688` had it). Both still wrap via the canonical `C_([T8({content, isMeta:!0})])` (todo at `cli_inner_pretty.js:445522`).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `collectAttachments` (obfuscated: `Aw4`) - Generator pool entry + master gate (`cli_inner_pretty.js:412660`)
- `runAttachmentGenerator` (obfuscated: `E3`) - Per-generator error isolation + telemetry (`cli_inner_pretty.js:412739`)
- `getQueuedCommandAttachments` (obfuscated: `gV$`) - Only generator that survives the master gate (`cli_inner_pretty.js:412764`)
- `normalizeAttachmentForAPI` (obfuscated: `kc6`) - 3-tier dispatch table (`cli_inner_pretty.js:445425`)
- `PER_TYPE_RENDERERS` (obfuscated: `DG4`) - Simple-case renderer map (`cli_inner_pretty.js:446557`)
- `makeUserMessage` (obfuscated: `T8`) - isMeta-carrying user-message factory (`cli_inner_pretty.js:443846`)
- `wrapStringMultiline` (obfuscated: `S0`) - String → `<system-reminder>\n…\n</system-reminder>` (`cli_inner_pretty.js:445237`)
- `wrapMessagesAsReminders` (obfuscated: `C_`) - List wrap helper (`cli_inner_pretty.js:445299`)
- `ensureSystemReminderWrap` (obfuscated: `DQ_`) - Idempotent re-wrap, identity-preserving (`cli_inner_pretty.js:444371`)
- `smooshSystemReminderSiblings` (obfuscated: `hG4`) - Fold SR siblings into last tool_result (`cli_inner_pretty.js:444384`)
- `smooshIntoToolResult` (obfuscated: `Ai6`) - Per-block folder; returns null on tool_reference constraint (`cli_inner_pretty.js:444756`)
- `mergeUserMessagesAndToolResults` (obfuscated: `VQ_`) - Smoosh driver at merge time (`cli_inner_pretty.js:444787`)
- `normalizeRequest` (obfuscated: `D0`) - Request normalizer; chooses api_system vs in-band (`cli_inner_pretty.js:444461`)
- `makeApiSystemMessage` (obfuscated: `SQ_`) - role:"system" message factory (`cli_inner_pretty.js:445274`)
- `extractReminderBodiesForApiSystem` (obfuscated: `RQ_`) - Unwrap reminder text for api_system (`cli_inner_pretty.js:445282`)
- `extractSystemReminderContent` (obfuscated: `fi6`) - Multiline unwrap regex (`cli_inner_pretty.js:445242`)
- `stripLeadingReminders` (obfuscated: `PG4`) - Peel leading reminders, sticky-prompt (`cli_inner_pretty.js:443733`)
- `stripAllReminders` (obfuscated: `OD9`) - Regex strip-all, preview/search (`cli_inner_pretty.js:614580`)
- `splitContextAndReminders` (obfuscated: `Uc5`) - Telemetry split, has new api_system branch (`cli_inner_pretty.js:271459`)
- `isRoleSystemRejection` (obfuscated: `xP6`) - 400 role:"system" rejection detector (`cli_inner_pretty.js:186567`)
- `SYSTEM_REMINDER_CLOSE` (obfuscated: `Nm4`) - `"</system-reminder>"` const (`cli_inner_pretty.js:495652`)
