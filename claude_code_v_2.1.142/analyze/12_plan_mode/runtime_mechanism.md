# Plan Mode Runtime Mechanism (v2.1.142)

> Step-by-step walk-through of *what actually runs* during plan mode: how the attachment loader injects per-turn reminders, what text gets injected, how the cadence is throttled, and how the model's tool calls flow through gating. Complements `implementation.md` (lifecycle) and `approval_flow.md` (post-approval state machine) — this document is about the **per-turn engine** that keeps the model anchored to plan-mode constraints.
>
> Cross-validates with `/lyz/codespace/3rd/claude-code/src/utils/attachments.ts` (`getPlanModeAttachments`, `getPlanModeExitAttachment`) and the runtime renderer at `cli_inner_pretty.js:424762-425124` (attachment → system-reminder text).

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_plan_mode.md](../00_overview/symbol_additions_v2_1_142_plan_mode.md) — Symbol discoveries for this unit
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Plan Mode section
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Agent loop, attachments

Key functions in this document:
- `buildPlanModeAttachment` (obfuscated: `d65`) — per-turn dispatcher, `cli_inner_pretty.js:397726`
- `buildPlanModeExitAttachment` (obfuscated: `c65`) — one-shot exit attachment, `cli_inner_pretty.js:397750`
- `countTurnsSinceLastPlanAttachment` (obfuscated: `bs7`) — turn-throttle counter, `cli_inner_pretty.js:397699`
- `countPlanModeAttachmentsSinceExit` (obfuscated: `Q65`) — full/sparse counter, `cli_inner_pretty.js:397715`
- `dispatchPlanModeReminder` (obfuscated: `Gz5`) — full/sparse/sub-agent router, `cli_inner_pretty.js:424762`
- `buildPlanModeFullReminder_5Phase` (obfuscated: `Vz5`) — 5-phase workflow text, `cli_inner_pretty.js:424773`
- `buildPlanModeFullReminder_Iterative` (obfuscated: `kz5`) — interview-phase iterative workflow, `cli_inner_pretty.js:424867`
- `buildPlanModeSparseReminder` (obfuscated: `Nz5`) — short reminder, `cli_inner_pretty.js:424918`
- `buildPlanModeSubAgentReminder` (obfuscated: `Ez5`) — sub-agent-scoped reminder, `cli_inner_pretty.js:424927`
- `getEndOfTurnInstruction` (obfuscated: `Gq4`) — terminal-call enforcement text, `cli_inner_pretty.js:424767`
- `getReadOnlyToolsList` (obfuscated: `vz5`) — `Read`/`Glob`/`Grep` list (variables `Bq`, `d1`, `v9`), `cli_inner_pretty.js:424861`
- `PLAN_MODE_PREAMBLE` (obfuscated: `Zq4`) — top-of-reminder boilerplate, `cli_inner_pretty.js:425992`
- `PLAN_PHASE_4_PROMPT` (obfuscated: `Tz5`) — plan-file structure bullets, `cli_inner_pretty.js:425984`
- `PLAN_MODE` (obfuscated: `Is7`) — cadence config, `cli_inner_pretty.js:398822`
- `attachmentRegistrar` (obfuscated: `aY`) — attachment callback wrapper, `cli_inner_pretty.js:397620`
- `attachmentRenderer.plan_mode_exit` — exit-reminder text, `cli_inner_pretty.js:426170`
- `REJECTED_PLAN_TOOL_RESULT_SENTINEL` (obfuscated: `MV6`) — synthetic rejection-prefix, `cli_inner_pretty.js:425970`

---

## 1. Where Plan-Mode Attachments Are Registered

The per-turn attachment loader is a registry of `(name, builder)` pairs. Each builder is invoked on every turn and returns an array of attachments (or `[]` if not applicable). Registration happens at `cli_inner_pretty.js:397567-397617` inside the attachment-loader factory; plan-mode entries are at lines 397588-397589:

```javascript
// ============================================
// Attachment Loader Registration (excerpt) - Plan-mode hooks into the loader
// Location: cli_inner_pretty.js:397584-397595
// ============================================

// ORIGINAL (for source lookup):
aY("changed_files", () => Yq5(M)),
aY("nested_memory", () => fq5(M)),
aY("dynamic_skill", () => Jq5(M)),
aY("skill_listing", () => Ty6(M)),
aY("plan_mode", () => d65(H, _, $, z)),       // <- per-turn plan reminder
aY("plan_mode_exit", () => c65(_, $)),         // <- one-shot exit reminder
aY("auto_mode", () => n65(_, $)),
aY("auto_mode_exit", () => i65(_, $)),
aY("todo_reminders", () => (nw() ? kq5(_, $) : Vq5(_, $))),
...

// READABLE (for understanding):
registerAttachment('changed_files', () => buildChangedFilesAttachment(messages)),
registerAttachment('nested_memory', () => buildNestedMemoryAttachment(messages)),
registerAttachment('dynamic_skill', () => buildDynamicSkillAttachment(messages)),
registerAttachment('skill_listing', () => buildSkillListingAttachment(messages)),
registerAttachment('plan_mode', () => buildPlanModeAttachment(prompt, messages, context, options)),
registerAttachment('plan_mode_exit', () => buildPlanModeExitAttachment(messages, context)),
registerAttachment('auto_mode', () => buildAutoModeAttachment(messages, context)),
registerAttachment('auto_mode_exit', () => buildAutoModeExitAttachment(messages, context)),
registerAttachment('todo_reminders', () =>
  isUnifiedTodosEnabled() ? buildUnifiedTodoReminder(messages, context) : buildLegacyTodoReminder(messages, context)),
...

// Mapping: aY→registerAttachment, d65→buildPlanModeAttachment, c65→buildPlanModeExitAttachment,
//          n65→buildAutoModeAttachment, i65→buildAutoModeExitAttachment, kq5→buildUnifiedTodoReminder,
//          Vq5→buildLegacyTodoReminder, nw→isUnifiedTodosEnabled, H→prompt, _→messages,
//          $→context, z→options, M→messages-alias
```

### Why `aY` wraps every builder

`aY` (`cli_inner_pretty.js:397620-397642`) wraps the builder in a try/catch + telemetry shell. **No plan-mode-specific logic lives there**, but it explains why a buggy builder can never crash the loop:

```javascript
async function aY(H, $) {
  let q = Date.now();
  try {
    let K = await $(),
      _ = Date.now() - q;
    if (Math.random() < 0.05) {                            // <- 5% sampling
      let A = K.filter(z => z !== void 0 && z !== null)
              .reduce((z, Y) => z + SH(Y).length, 0);
      d("tengu_attachment_compute_duration", {
        label: H,
        duration_ms: _,
        attachment_size_bytes: A,
        attachment_count: K.length,
      });
    }
    return K;
  } catch (K) {
    let _ = Date.now() - q;
    if (Math.random() < 0.05)
      d("tengu_attachment_compute_duration", { label: H, duration_ms: _, error: !0 });
    return (EH(K), vx(`Attachment error in ${H}`, K), []);  // <- always returns []
  }
}
```

**Key insight:** Plan-mode reminders are *fire-and-forget*. A bug in `d65` (e.g. a missing plan file) silently drops the reminder for that turn instead of breaking the conversation. The model would proceed without a plan-mode anchor for one turn — annoying but not fatal — and the next turn's `d65` invocation would retry.

---

## 2. Per-Turn Dispatcher: `d65` (`buildPlanModeAttachment`)

The full body lives at `cli_inner_pretty.js:397726-397748` and is reproduced in [implementation.md §Lifecycle Phase 2](./implementation.md#lifecycle-phase-2-reminder-cycle--slug-fixation). Here we focus on the **decision graph**:

```
                    ┌─────────────────────────────────────┐
                    │ d65(prompt, messages, ctx, options) │
                    └──────────────┬──────────────────────┘
                                   │
                  ┌────────────────┴────────────────┐
                  ▼                                 │
        ┌──────────────────┐                        │
        │ mode === 'plan'? │ — NO ──→  return []    │
        └────────┬─────────┘                        │
                 │ YES                              │
                 ▼                                  │
        ┌─────────────────────────────────────────┐ │
        │ messages?  AND  hadPriorPlanModeAttach  │ │
        │   AND  turnsSinceLast < 5  (Is7.TBA)?   │ │
        └─────────┬───────────────────────────────┘ │
                  │ YES → throttle, return []       │
                  │                                 │
                  │ NO                              │
                  ▼                                 │
        ┌─────────────────────────────────────────┐ │
        │ PDH(sessionId, seed) — slug fixation     │ │
        │   (first call wins; idempotent after)   │ │
        └─────────┬───────────────────────────────┘ │
                  │                                 │
                  ▼                                 │
        ┌─────────────────────────────────────────┐ │
        │ planFilePath = v2(agentId)              │ │
        │ planContent  = HW(agentId)              │ │
        └─────────┬───────────────────────────────┘ │
                  │                                 │
                  ▼                                 │
        ┌─────────────────────────────────────────┐ │
        │ HH$()===true AND planContent!==null ?   │ │
        └─────────┬───────────────────────────────┘ │
                  │ YES                             │
                  ▼                                 │
        ┌─────────────────────────────────────────┐ │
        │ push {type:'plan_mode_reentry',...}     │ │
        │ OT(false)  — reset sticky re-entry flag │ │
        └─────────┬───────────────────────────────┘ │
                  │                                 │
                  ▼                                 │
        ┌─────────────────────────────────────────┐ │
        │ countAttachmentsSinceExit + 1 mod 5     │ │
        │ === 1  →  'full'  else  'sparse'        │ │
        └─────────┬───────────────────────────────┘ │
                  │                                 │
                  ▼                                 │
        ┌─────────────────────────────────────────┐ │
        │ push {type:'plan_mode', reminderType,   │ │
        │       isSubAgent, planFilePath,         │ │
        │       planExists, customInstructions}   │ │
        └─────────────────────────────────────────┘
```

### Algorithm: Cadence Throttling — Why 5 turns?

**What it does:** Suppresses the `plan_mode` attachment when the last one was fewer than `PLAN_MODE.TURNS_BETWEEN_ATTACHMENTS` (= 5) human turns ago.

**How it works:**

1. `bs7(messages)` iterates backwards. For each entry:
   - **Human turn** (non-meta `user` message with no tool_result content) → `turnCount++`
   - **`plan_mode` or `plan_mode_reentry` attachment** found → `foundPlanModeAttachment = true`, break
   - **`plan_mode_exit` attachment** found → break with `foundPlanModeAttachment = false`
2. If found AND `turnCount < 5`, return `[]` (no reminder this turn).

**Why count HUMAN turns, not assistant turns?**
- The agent loop calls `getAttachmentMessages` on every *tool round*. A single user message that triggers 100 tool calls would generate ~20 reminders if we counted assistant messages.
- Plan mode's target use case is long agentic sessions; counting human turns keeps the reminder cadence aligned with the user's *intent* boundary, not the model's tool-call cadence.
- v2.1.88 source comment in `getAutoModeAttachmentTurnCount` (parallel function): *"Count HUMAN turns ... — the tool loop in query.ts calls getAttachmentMessages on every tool round, so a single human turn with 100 tool calls would fire ~20 reminders"*.

**Why 5 (`Is7.TURNS_BETWEEN_ATTACHMENTS`)?**
- The full reminder is ~2K-3K tokens; injecting on every human turn would burn ~500K tokens per 100-turn session.
- 5 turns is empirically the *forgetting horizon* — long enough that the model's working memory of the constraint starts to fade, short enough to refresh before drift.
- The first-turn case is special: when `messages` is `undefined`/`[]` OR no prior `plan_mode` attachment exists, the throttle is bypassed (line 397728-397731's outer `if` guard). The model gets a reminder immediately on entry.

**Key insight:** The `plan_mode_exit` attachment **resets the throttle window** (break with `foundPlanModeAttachment = false`). After exit-and-re-entry, the next `d65` call is treated as if no prior plan attachment ever existed — guaranteeing a fresh reminder.

### Algorithm: Full/Sparse Alternation — `Q65`

```javascript
// ============================================
// countPlanModeAttachmentsSinceExit - counts plan_mode attachments since last exit
// Location: cli_inner_pretty.js:397715-397724
// ============================================

// ORIGINAL (for source lookup):
function Q65(H) {
  let $ = 0;
  for (let q = H.length - 1; q >= 0; q--) {
    let K = H[q];
    if (K?.type === "attachment") {
      if (K.attachment.type === "plan_mode_exit") break;
      if (K.attachment.type === "plan_mode") $++;
    }
  }
  return $;
}

// READABLE (for understanding):
function countPlanModeAttachmentsSinceExit(messages) {
  let count = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message?.type === 'attachment') {
      if (message.attachment.type === 'plan_mode_exit') break;
      if (message.attachment.type === 'plan_mode') count++;
    }
  }
  return count;
}

// Mapping: Q65→countPlanModeAttachmentsSinceExit, H→messages
```

**Computation:** `reminderType = (countSinceExit + 1) % 5 === 1 ? 'full' : 'sparse'`.

| Plan attachments since exit | Computed mod | Type |
|---|---|---|
| 0 (first one) | (0+1)%5 = 1 | **full** |
| 1 | (1+1)%5 = 2 | sparse |
| 2 | 3 | sparse |
| 3 | 4 | sparse |
| 4 | 0 | sparse |
| 5 (after 5 sparse) | (5+1)%5 = 1 | **full** |

So the model sees a full reminder every **5 throttled attachments**, which (because of `bs7` 5-turn throttling) translates to roughly every **25 human turns**. Each plan-mode session typically only emits 1-3 full reminders.

**Why alternate?**
- The full reminder is 2K-3K tokens; injecting it every cycle would dominate context.
- The sparse reminder (`Nz5`, ~75 tokens) is a quick anchor: "you're still in plan mode; here's the plan file; end your turn with AskUserQuestion or ExitPlanMode".
- The full reminder re-injects the workflow guidance (5-phase or iterative interview-phase), useful when the model has wandered.

---

## 3. Attachment → System Reminder Text

The attachment objects emitted by `d65`/`c65` are converted to actual `tool_use`-compatible system messages by the **attachment renderer** at `cli_inner_pretty.js:425108-425124` (per-type switch) and `cli_inner_pretty.js:426170-426180` (alternate switch for terminal attachments). The path is:

```
d65 returns [{type:'plan_mode', reminderType:'full', isSubAgent, planFilePath, planExists, customInstructions}]
         │
         ▼
attachment-renderer switch (cli_inner_pretty.js:425108):
  case "plan_mode":         return Gz5(H);            // → text content
  case "plan_mode_reentry": return inline string;     // → text content (no separate fn)
  case "plan_mode_exit":    handled in alternate switch at 426170 → inline text
         │
         ▼
o_([w8({ content: <text>, isMeta: true })])         // wrap as meta user message
         │
         ▼
appears in the prompt as a synthetic user-role message with isMeta=true
```

### `Gz5` — Full/Sparse/SubAgent Router

```javascript
// ============================================
// dispatchPlanModeReminder - routes attachment to the right text builder
// Location: cli_inner_pretty.js:424762-424766
// ============================================

// ORIGINAL (for source lookup):
function Gz5(H) {
  if (H.isSubAgent) return Ez5(H);
  if (H.reminderType === "sparse") return Nz5(H);
  return Vz5(H);
}

// READABLE (for understanding):
function dispatchPlanModeReminder(attachment) {
  if (attachment.isSubAgent) return buildPlanModeSubAgentReminder(attachment);
  if (attachment.reminderType === 'sparse') return buildPlanModeSparseReminder(attachment);
  return buildPlanModeFullReminder(attachment);
}

// Mapping: Gz5→dispatchPlanModeReminder, Ez5→buildPlanModeSubAgentReminder,
//          Nz5→buildPlanModeSparseReminder, Vz5→buildPlanModeFullReminder, H→attachment
```

### Algorithm: Routing Priority

The **sub-agent check comes FIRST** — even a sub-agent that "should" be in sparse mode gets the simpler `Ez5` text instead. Why? Sub-agents (Task tool teammates) inherit plan mode from their leader but have a stripped-down workflow:

| Routing branch | Text variant | Length | Purpose |
|----------------|-------------|--------|---------|
| `isSubAgent` | `Ez5` (sub-agent reminder) | ~10 lines | Tells the sub-agent: "you're in plan mode, write to plan file, use AskUserQuestion for clarification, no other writes" — no 5-phase workflow because sub-agents are scoped delegations |
| `reminderType === 'sparse'` | `Nz5` (short) | ~3 lines | One-sentence anchor: "Plan mode still active. Read-only except plan file. End turns with AskUserQuestion or ExitPlanMode." |
| else | `Vz5` (full 5-phase OR iterative) | ~70 lines | Full workflow: Phase 1 explore, Phase 2 design, Phase 3 review, Phase 4 final plan, Phase 5 ExitPlanMode |

### The Full Reminder: 5-Phase vs Interview-Phase

`Vz5` branches on `bf()` (= `isPlanModeInterviewPhaseEnabled`):

```javascript
function Vz5(H) {
  if (H.isSubAgent) return [];  // <- redundant guard (Gz5 already routed sub-agents)
  let $ = H.planExists
    ? `A plan file already exists at ${H.planFilePath}. You can read it and make incremental edits using the ${_D.name} tool.`
    : `No plan file exists yet. You should create your plan at ${H.planFilePath} using the ${Yw.name} tool.`;
  if (H.customInstructions) {
    // Custom-instruction path (overrides default workflow)
    let A = `${Zq4}                                  // PLAN_MODE_PREAMBLE
\n## Plan File Info:\n${$}\nYou should build your plan incrementally...
\n## Plan Workflow\n\n${H.customInstructions}      // <- user-supplied workflow
\n### Call ${V2.name}\n${Gq4()}`;                  // <- end-of-turn enforcement
    return o_([w8({ content: A, isMeta: !0 })]);
  }
  if (bf()) return kz5(H);                          // <- interview-phase branch
  // ... else: 5-phase default workflow (Phase 1 explore, Phase 2 design, ...)
}
```

**Three text variants for full plan-mode reminder:**

| Variant | When | Source | Workflow style |
|---------|------|--------|---------------|
| Custom instructions | `options.planModeInstructions` is set (SDK) | inline `Vz5` | User-supplied workflow, framed by `Zq4` preamble and `Gq4` end-of-turn instruction |
| 5-phase (default) | `bf() === false` | `Vz5` continuation | Explore → Design → Review → Final Plan → Call ExitPlanMode |
| Iterative (interview phase) | `bf() === true` (Ant or GrowthBook gate) | `kz5` | "Explore, update plan file, ask user" loop |

### Algorithm: Why customInstructions Bypasses Both Workflows

**Decision:** When `customInstructions` is set, **neither** the 5-phase **nor** the iterative workflow is rendered. The custom instructions become the sole workflow.

**Rationale:**
- SDK consumers (CCR remote sessions, programmatic Agent SDK use) often want a domain-specific plan workflow (e.g. "first, identify the API endpoints; second, propose schema changes; third, ...").
- Mixing custom + default would create conflicting guidance ("Phase 1: explore" vs the custom Phase 1).
- The preamble (`Zq4`) and end-of-turn enforcement (`Gq4`) are still injected so the read-only constraint and the "end with ExitPlanMode" rule still apply — only the *steps* change.

**Trade-off:** Custom workflows lose the parallelism guidance ("Launch up to N agents") that the 5-phase default provides. Users with parallel exploration needs must re-add this to their `customInstructions`.

### Text Constants (Boilerplate)

The constants `Zq4`, `Tz5`, and `Gq4`'s return values are the boilerplate that wraps every full reminder:

```javascript
// PLAN_MODE_PREAMBLE - cli_inner_pretty.js:425992
Zq4 = "Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.";

// PLAN_PHASE_4_PROMPT - cli_inner_pretty.js:425984
Tz5 = `### Phase 4: Final Plan
Goal: Write your final plan to the plan file (the only file you can edit).
- Begin with a **Context** section: explain why this change is being made...
- Include only your recommended approach, not all alternatives
- Ensure that the plan file is concise enough to scan quickly, but detailed enough to execute effectively
- Include the paths of critical files to be modified
- Reference existing functions and utilities you found that should be reused, with their file paths
- Include a verification section describing how to test the changes end-to-end`;

// getEndOfTurnInstruction - cli_inner_pretty.js:424767-424772
function Gq4() {
  return `At the very end of your turn, once you have asked the user questions and are happy with your final plan file - you should always call ${V2.name} to indicate to the user that you are done planning.
This is critical - your turn should only end with either using the ${Gz} tool OR calling ${V2.name}. Do not stop unless it's for these 2 reasons

**Important:** Use ${Gz} ONLY to clarify requirements or choose between approaches. Use ${V2.name} to request plan approval. Do NOT ask about plan approval in any other way - no text questions, no AskUserQuestion. Phrases like "Is this plan okay?", "Should I proceed?", "How does this plan look?", "Any changes before we start?", or similar MUST use ${V2.name}.`;
}
```

`Gz` (`AskUserQuestion`) and `V2` (`ExitPlanModeV2Tool`) are referenced by `.name`, so the actual tool names are substituted (`"AskUserQuestion"`, `"ExitPlanMode"`).

### The Sparse Reminder

`Nz5` returns a single-paragraph reminder optimized for token efficiency:

```javascript
function Nz5(H) {
  let $ = H.customInstructions
      ? "Follow the plan workflow described earlier."
      : bf()
        ? "Follow iterative workflow: explore codebase, interview user, write to plan incrementally."
        : "Follow 5-phase workflow.";
  let q = `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${H.planFilePath}). ${$} End turns with ${Gz} (for clarifications) or ${V2.name} (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;
  return o_([w8({ content: q, isMeta: !0 })]);
}
```

**Total: ~75 tokens.** This is the per-turn "you are still constrained" anchor — significantly cheaper than re-injecting the full workflow.

### The Sub-Agent Reminder

`Ez5` is used when the plan_mode attachment runs inside a Task-tool sub-agent:

```javascript
function Ez5(H) {
  let q = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received (for example, to make edits). Instead, you should:

## Plan File Info:
${H.planExists ? `A plan file already exists at ${H.planFilePath}. You can read it and make incremental edits using the ${_D.name} tool if you need to.` : `No plan file exists yet. You should create your plan at ${H.planFilePath} using the ${Yw.name} tool if you need to.`}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.
Answer the user's query comprehensively, using the ${Gz} tool if you need to ask the user clarifying questions. If you do use the ${Gz}, make sure to ask all clarifying questions you need to fully understand the user's intent before proceeding.`;
  return o_([w8({ content: q, isMeta: !0 })]);
}
```

**Key insight:** Sub-agents do NOT see the 5-phase workflow guidance. They get a stripped-down "answer the user's query, write to plan file, ask clarifying questions" prompt. The 5-phase explore/design/review workflow is a *leader-only* workflow because Phase 1 and Phase 2 themselves call sub-agents — telling a sub-agent to "launch parallel sub-agents" would create unbounded recursion. The leader is responsible for parallelism; sub-agents are scoped responders.

---

## 4. The Re-entry Attachment

When `d65` detects `HH$() === true && planContent !== null`, it appends an additional attachment **before** the standard `plan_mode` attachment:

```javascript
case "plan_mode_reentry": {
  let q = `## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at ${H.planFilePath} from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ${V2.name}

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.`;
  return o_([w8({ content: q, isMeta: !0 })]);
}
```

### Algorithm: Why "evaluate against current request" instead of "resume planning"?

**Trade-off considered:** A naïve re-entry would say "you previously planned X, continue from there". This was rejected because:

1. **The user's *current* prompt may be unrelated** to the prior plan. Plan mode re-entry happens for ANY new `EnterPlanMode` call within the same session — there's no semantic link to the prior plan.
2. **Stale plans accrete cruft.** If the model just appends to the prior plan, sessions that re-enter plan mode N times produce an N-section plan file that no longer matches any single task.
3. **The disk plan-file path is fixed per session.** Without explicit "overwrite vs continue" guidance, the model would default to appending — and the plan file would grow without bound.

The re-entry attachment forces an explicit choice: **different task → overwrite, same task → edit**. This keeps the plan file aligned with the *current* planning intent.

**One-shot semantics:** `OT(false)` is called immediately after pushing the attachment, so subsequent `d65` calls in the same plan-mode session see `HH$() === false` and skip the re-entry attachment. The sticky flag is only re-set when the *next* `ExitPlanMode` runs.

---

## 5. The Exit Attachment: `c65`

The exit attachment is one-shot and only fires when:
- `needsPlanModeExitAttachment` flag is true (set by `qh(true)` in `ExitPlanMode.call`), **OR**
- The current message history contains a `plan_mode` attachment that hasn't been sealed

```javascript
// Body reproduced from cli_inner_pretty.js:397750-397758:
async function c65(H, $) {
  if ($.getAppState().toolPermissionContext.mode === "plan") return (qh(!1), []);
  let { foundPlanModeAttachment: K } = bs7(H ?? []);
  if (!Cv8() && !K) return [];
  qh(!1);
  let _ = v2($.agentId), A = HW($.agentId) !== null;
  return [{ type: "plan_mode_exit", planFilePath: _, planExists: A }];
}
```

### Decision tree for `c65`

```
                ┌──────────────────────────────┐
                │ c65(messages, ctx) called    │
                └──────────────┬───────────────┘
                               │
                               ▼
                  ┌────────────────────────────┐
                  │  Currently in plan mode?   │
                  └─┬──────────────────────────┘
                    │
        YES ────────┘                  └──── NO
        │                                     │
        ▼                                     ▼
   qh(false)                  ┌─────────────────────────────┐
   return []                  │ Has needsExitAttachment OR  │
   (suppress: re-entered      │  is there a prior plan_mode │
    immediately, no exit      │  attachment?                │
    reminder needed)          └──────────┬──────────────────┘
                                         │
                            NO ──────────┘──────── YES
                            │                       │
                            ▼                       ▼
                       return []           qh(false)  // one-shot
                                           emit plan_mode_exit
```

### Algorithm: The "Still in plan mode" Guard

**What it does:** If `c65` runs but we're STILL in plan mode (the user/model re-entered immediately after exit), clear the flag and return `[]`.

**When does this happen?**
- The model calls `ExitPlanMode` and the user approves → `qh(true)` fires.
- Before the next turn, the user types `/plan` to re-enter → `mode` is set back to `'plan'`.
- `c65` runs and sees `mode === 'plan'`. Without this guard, it would emit a "you exited plan mode" reminder while the model is actually back inside plan mode — confusing.

The guard clears the flag and skips the emission, so the model never sees the contradiction.

### Algorithm: The "Prior plan_mode attachment" Fallback

**What it does:** Even if `needsPlanModeExitAttachment` is false, if the message history contains a `plan_mode` attachment (i.e. the prior reminders were emitted), still emit the exit notification.

**Why:** This handles the **CCR / SDK exit path** where the agent leaves plan mode via mechanisms other than `ExitPlanModeV2Tool.call` (e.g. CCR's `set_permission_mode` control request). In those cases `qh(true)` is never set, but the model still has `plan_mode` reminders in its context that need to be sealed.

**Implication:** The model is guaranteed to see exactly one `plan_mode_exit` per plan-mode session, regardless of the exit mechanism.

### Exit Attachment Text (Inline)

The renderer at `cli_inner_pretty.js:426170-426180`:

```javascript
plan_mode_exit: (H) => {
  let $ = H.planExists
    ? ` The plan file is located at ${H.planFilePath} if you need to reference it.`
    : "";
  return o_([
    w8({
      content: `## Exited Plan Mode

You have exited plan mode. You can now make edits, run tools, and take actions.${$}`,
      isMeta: !0,
    }),
  ]);
}
```

**Trade-off — why include `planFilePath`?** The model just received the full plan inline via the `ExitPlanMode.call` `tool_result`. Strictly speaking it doesn't need to re-read the file. But:
- The plan may be longer than what fits comfortably in working context.
- The user may invoke `/clear` mid-implementation; the file persists.
- Hooks may have transformed the on-disk plan in ways the tool_result didn't capture.

Surfacing the path costs ~10 tokens and provides a known fallback.

---

## 6. Reminder Cadence: Worked Example

Suppose the model runs through this sequence (each line is one human turn):

| Turn | What happens | Attachment emitted | Why |
|------|--------------|---------------------|-----|
| T0 | User types: "Help me redesign the auth system" | (no plan attachment yet) | Not yet in plan mode |
| T1 | Model calls `EnterPlanMode` → mode='plan' | `plan_mode` (full) | First entry; throttle bypassed |
| T2 | Model uses Grep, Read, AskUserQuestion | (suppressed) | turnCount=1 < 5 |
| T3 | Model uses Grep, AskUserQuestion | (suppressed) | turnCount=2 < 5 |
| T4 | User answers | (suppressed) | turnCount=3 < 5 |
| T5 | Model uses Read | (suppressed) | turnCount=4 < 5 |
| T6 | User clarifies | `plan_mode` (sparse) | turnCount=5; emit; Q65=1 → sparse |
| T7-T10 | (4 more user turns, mixed tools) | (suppressed × 4) | turnCount < 5 each |
| T11 | User: "now write the plan" | `plan_mode` (sparse) | turnCount=5; Q65=2 → sparse |
| T12-T15 | model writes plan | (suppressed) | |
| T16 | User: "include rate-limiting too" | `plan_mode` (sparse) | Q65=3 → sparse |
| T17-T20 | model updates plan | (suppressed) | |
| T21 | User: "looks good" | `plan_mode` (sparse) | Q65=4 → sparse |
| T22-T25 | model finalizes | (suppressed) | |
| T26 | Model: more polish needed | `plan_mode` (sparse) | Q65=5; (5+1)%5=1 → wait that's full |

Wait — the algorithm is `(countSinceExit + 1) % 5 === 1`. Let me recount:

- After T1 attachment fires, countSinceExit = 1, so (1+1)%5=2 → sparse for T6.
- Hmm, but T1 itself counts. Let me re-examine: `Q65($)` is called *before* the new attachment is pushed. So at T1, Q65 returns 0 (no prior plan_mode attachments). (0+1)%5=1 → **full**.
- At T6, Q65 returns 1 (T1 was the only prior). (1+1)%5=2 → sparse.
- At T11, Q65=2 → 3 → sparse.
- At T16, Q65=3 → 4 → sparse.
- At T21, Q65=4 → 0 → sparse.
- At T26, Q65=5 → (5+1)%5=1 → **full** (the 6th plan attachment is the next full one).

So the cadence is: **full** at T1, **full** at T26, **full** at T51, ... — every 5 sparse-or-full attachments, the next one is full.

### Key takeaway

In a typical 50-human-turn plan session, the model sees **2 full reminders** and **~8 sparse reminders**. Total reminder tokens: ~6K (2 × 3K) + ~600 (8 × 75) = ~6.6K. This is the *steady-state cost* of plan mode being active.

---

## 7. The Rejected-Plan Synthetic Message

When the user rejects the plan via the approval dialog ("No, keep planning"), the tool returns `behavior: "deny"`. The agent loop then emits a synthetic `tool_result` with content prefixed by `MV6` (`REJECTED_PLAN_TOOL_RESULT_SENTINEL`):

```javascript
// cli_inner_pretty.js:425970
MV6 = `The agent proposed a plan that was rejected by the user. The user chose to stay in plan mode rather than proceed with implementation.

Rejected plan:
`;
```

When the conversation log is later replayed for UI rendering, `nx7` (`cli_inner_pretty.js:349469-349478`) detects this prefix and routes to `tz8` (`RejectedPlanMessage`) instead of the generic rejection text:

```javascript
// Excerpt from nx7:
if (typeof A.content === "string" && A.content.startsWith(MV6)) {
  let O = A.content.substring(MV6.length);
  let M = O;
  return ak.createElement(tz8, { plan: M });
}
```

`tz8` renders a styled box ("User rejected Claude's plan:") followed by the plan content inside a rounded `planMode`-colored border. The model, when re-reading its own history, sees the literal text prefix instructing it that the plan was rejected and the user chose to stay in plan mode — so the model knows to continue planning, not to retry.

### Decision: Why a string sentinel instead of a structured tag?

- The tool_result content schema is `string | ContentBlock[]` and content blocks are heavily typed in the Anthropic SDK.
- The sentinel approach piggybacks on the existing string content, requires no schema changes, and stays compatible with the broader auto-mode classifier that already inspects `result.message`.
- **Trade-off:** A future formatter that inadvertently strips or modifies the prefix would break the UI routing AND mislead the model. The constant is referenced by both writer and reader, so any change requires touching both sides — which is the safety net.

---

## 8. Cross-Validation Notes (v2.1.88 → v2.1.142)

| Behavior | v2.1.88 source | v2.1.142 obfuscated | Status |
|----------|---------------|---------------------|--------|
| Plan-mode attachment dispatcher signature | `getPlanModeAttachments(messages, context)` — 2 args | `d65(prompt, messages, context, options)` — 4 args | **Extended:** v2.1.142 adds `prompt` (slug seed) + `options` (`planSlugSeed`) for prompt-driven naming |
| 5-turn throttle (`TURNS_BETWEEN_ATTACHMENTS`) | `PLAN_MODE_ATTACHMENT_CONFIG.TURNS_BETWEEN_ATTACHMENTS` = 5 | `Is7.TURNS_BETWEEN_ATTACHMENTS` = 5 | Identical |
| Full reminder every Nth | `PLAN_MODE_ATTACHMENT_CONFIG.FULL_REMINDER_EVERY_N_ATTACHMENTS` = 5 | `Is7.FULL_REMINDER_EVERY_N_ATTACHMENTS` = 5 | Identical |
| `bs7` / `Q65` traversal | Same backwards-iteration logic | Same | Identical |
| `plan_mode_reentry` attachment | Present | Present | Identical |
| `plan_mode_exit` "still in plan" guard | Present | Present | Identical |
| Sub-agent text variant | `getPlanModeSubAgentReminder` (similar 10-line text) | `Ez5` | Identical text |
| Sparse reminder text | `getPlanModeSparseReminder` | `Nz5` | Identical |
| 5-phase workflow text | `getPlanPhase1Section` ... `getPlanPhase5Section` | `Vz5` continuation (inline) | Identical (just inlined into one function) |
| Interview-phase iterative workflow | `getInterviewPhasePlanModeReminder` | `kz5` | Identical |
| `customInstructions` SDK override | Present in `getPlanPhase4Section` and surrounding | Present in `Vz5` | Identical |
| `PLAN_PHASE_4_PROMPT` (`Tz5`) experimentation (pewter_ledger GrowthBook) | Yes (variants: `trim`, `cut`, `cap`) | Inlined in `Tz5` (static; control arm only — variant code lives in `planModeV2.ts` `getPewterLedgerVariant`) | Identical control text; variants resolved at PR-prompt time |
| Rejected-plan sentinel | `PLAN_REJECTION_PREFIX` in `messages.ts:220` | `MV6` at `cli_inner_pretty.js:425970` | Identical text |
| Renderer prefix detection | `UserToolResultMessage` checks `PLAN_REJECTION_PREFIX` | `nx7` checks `MV6` | Identical behavior |

**No behavioral changes** to the attachment cycle between v2.1.88 and v2.1.142 — only the **slug-seed pipeline extension** (v2.1.111+) carries new logic. Everything else is just renames and inline-merging.

---

## 9. Performance Notes

- `d65` is async but does no IO (HW reads from a cached in-memory map; `v2` is a memoized path concat).
- The full reminder text is built fresh per emission (no caching). Text size: ~2.5K chars (~600 tokens for 5-phase, ~700 for iterative).
- The sparse reminder text: ~300 chars (~75 tokens).
- Total per-turn cost when active: **2 ms compute, 75-700 tokens injected** (varies by sparse/full).
- The renderer (`Gz5`/`Vz5`/`Nz5`/`Ez5`/`kz5`) is pure-functional and could be memoized, but isn't — fresh string concatenation each time. The cost is negligible compared to a single LLM call.

---

## Related

- [implementation.md](./implementation.md) — full lifecycle, slug fixation, state machine
- [enter_plan_mode_tool.md](./enter_plan_mode_tool.md) — `EnterPlanMode.call` body (state mutation, not text)
- [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) — `ExitPlanModeV2Tool.call` body (state mutation, not text)
- [ui_components.md](./ui_components.md) — React/Ink components for the user-facing dialogs
- [tool_interaction_matrix.md](./tool_interaction_matrix.md) — what tools are blocked/allowed in plan mode
- [hooks_integration.md](./hooks_integration.md) — hook touchpoints that intersect the attachment cycle
- [permission_mode_persistence.md](./permission_mode_persistence.md) — v2.1.119/132/136 deltas
