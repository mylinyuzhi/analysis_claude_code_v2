# VerifyPlan: the `VerifyPlanExecution` tool & the `verify_plan_reminder` (v2.1.88 → v2.1.156)

> **Scope / Source.** This document traces a single feature — *post-plan execution verification* —
> from its fully-built form in the **v2.1.88 unobfuscated TypeScript precursor**
> (`/lyz/codespace/3rd/claude-code/src/...`) to its **vestigial / dead-code** state in shipped
> **Claude Code v2.1.156**. Every v2.1.156 claim is grounded in the pretty-printed obfuscated bundle
> `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (cited as
> `cli_inner_pretty.js:<line>`; all line numbers were read and verified in this build). The v2.1.88
> precursor is used for **readable-name recovery and behavioral cross-validation only** — it is NOT
> evidence for v2.1.156 behavior. Where the two disagree, the v2.1.156 bundle wins and the
> disagreement is the finding.
>
> This document answers the specific question: *does `CLAUDE_CODE_VERIFY_PLAN` and the `VerifyPlan`
> feature still exist in v2.1.156?* **Short answer: the env var and the tool are gone; the reminder
> plumbing survives as unreachable dead code with a neutered generator.**

---

## TL;DR — what happened to VerifyPlan

| Layer | v2.1.88 precursor | v2.1.156 shipped |
|-------|-------------------|------------------|
| **Env flag `CLAUDE_CODE_VERIFY_PLAN`** | gates the whole feature; `=== 'true'` enables it | **0 occurrences** in the bundle — flag fully removed |
| **`VerifyPlanExecutionTool`** (a real tool) | conditionally `require()`-ed and added to the tool list when env is true | **0 occurrences** — tool deleted, never registered |
| **ExitPlanMode "IMPORTANT: When you have finished implementing the plan…" instruction** | appended to the implement-message when env is true | **0 occurrences** — string deleted |
| **`verify_plan_reminder` attachment type** | emitted every 10 turns by `getVerifyPlanReminderAttachment` while verification is pending | **type still registered, but generator `bR_` returns `[]` unconditionally** → never emitted |
| **Reminder renderer** (the user-message text) | renders `…call the "VerifyPlanExecution" tool…` | **survives** but tool name is the empty string `""` → would render `…call the "" tool…` (and is unreachable anyway) |
| **`getVerifyPlanReminderTurnCount`** (turn counter) | drives the every-10-turns cadence | **survives** (`kw4`), still functional, but **has no caller** that reaches emission |
| **`VERIFY_PLAN_REMINDER_CONFIG`** | `{TURNS_BETWEEN_REMINDERS: 10}` | **survives** (`zw4` = `{TURNS_BETWEEN_REMINDERS: 10}`), unused |
| **`appState.pendingPlanVerification`** | tri-state `{plan, verificationStarted, verificationCompleted}` driving the reminder | gutted (the generator that read it is a stub; see §3.4) |

**The shape of the change is "de-flagging by gutting, not by deleting."** Rather than removing the
attachment type from the reminder switch (which would risk crashes on `--resume`'d sessions carrying
old attachments), v2.1.156 keeps the *type binding and renderer* alive but replaces the **generator
body with `return []`**. The feature is therefore impossible to trigger, yet the bundle never throws
on the dangling type. This is the same pattern v2.1.156 applies to two sibling reminders
(`teammate_mailbox` / `hR_` and `output_token_usage` / `IR_`) — see
[../41_system_reminder/attachment_catalogue.md](../41_system_reminder/attachment_catalogue.md).

---

## 1. What VerifyPlan *was* (v2.1.88 precursor)

VerifyPlan was an **internal-only ("ant") experiment** that closed the loop on plan mode: after the
model exited plan mode and implemented the plan, the system would (a) nudge it periodically, and
(b) hand it a dedicated tool to kick off a *background* verification pass that checked every plan
item was actually completed. It had four cooperating pieces.

### 1.1 The conditional tool import (dead-code-elimination gate)

The tool was imported behind a top-level `process.env` check written precisely so that
**Bun's static string-replacement could tree-shake it out of external builds**. When
`CLAUDE_CODE_VERIFY_PLAN !== 'true'` at build time, the `require()` (and the whole tool) is
eliminated.

```javascript
// ============================================
// VerifyPlanExecutionTool conditional import - DCE-gated tool registration
// Location (v2.1.88 precursor): src/tools.ts:89-96, 231
// ============================================

// ORIGINAL (v2.1.88 precursor — verbatim):
// Dead code elimination: conditional import for CLAUDE_CODE_VERIFY_PLAN
const VerifyPlanExecutionTool =
  process.env.CLAUDE_CODE_VERIFY_PLAN === 'true'
    ? require('./tools/VerifyPlanExecutionTool/VerifyPlanExecutionTool.js')
        .VerifyPlanExecutionTool
    : null
// ...later, inside getTools():
    ...(VerifyPlanExecutionTool ? [VerifyPlanExecutionTool] : []),

// READABLE (for understanding):
// When CLAUDE_CODE_VERIFY_PLAN==='true', pull in the VerifyPlanExecution tool and append it to
// the live tool list; otherwise the symbol is null and the spread contributes nothing. The
// `=== 'true'` literal (not isEnvTruthy) is deliberate: it lets the bundler replace the whole
// ternary with `null` when the env is statically known false, deleting the require() entirely.

// Mapping: VerifyPlanExecutionTool→(verify tool), CLAUDE_CODE_VERIFY_PLAN→build-time feature flag
```

**Key insight.** The `=== 'true'` comparison is not sloppy env-parsing — it is the *mechanism* of
removal. `isEnvTruthy(...)` would be opaque to the bundler; a literal `process.env.X === 'true'`
compiles to `'false' === 'true'` → `false` → the dead branch is dropped. This is why the feature can
vanish from a build without any source line being deleted.

### 1.2 The reminder generator (every-10-turns nudge)

While the model was implementing (i.e. *after* the `plan_mode_exit` marker), the attachment system
emitted a `verify_plan_reminder` on a cadence, but only for internal users and only while a
verification was genuinely pending.

```javascript
// ============================================
// getVerifyPlanReminderAttachment - cadence-gated post-plan verify nudge
// Location (v2.1.88 precursor): src/utils/attachments.ts:3894-3929
// ============================================

// ORIGINAL (v2.1.88 precursor — verbatim core):
async function getVerifyPlanReminderAttachment(messages, toolUseContext) {
  if (process.env.USER_TYPE !== 'ant' || !isEnvTruthy(process.env.CLAUDE_CODE_VERIFY_PLAN)) return []
  const appState = toolUseContext.getAppState()
  const pending = appState.pendingPlanVerification
  if (!pending || pending.verificationStarted || pending.verificationCompleted) return []
  if (messages && messages.length > 0) {
    const turnCount = getVerifyPlanReminderTurnCount(messages)
    if (turnCount === 0 || turnCount % VERIFY_PLAN_REMINDER_CONFIG.TURNS_BETWEEN_REMINDERS !== 0) return []
  }
  return [{ type: 'verify_plan_reminder' }]
}

// READABLE (for understanding):
// Four AND-ed gates before a reminder is emitted:
//   1. internal user (USER_TYPE==='ant') AND build flag on (CLAUDE_CODE_VERIFY_PLAN truthy)
//   2. a pendingPlanVerification record exists in app state
//   3. verification has NOT already started AND NOT already completed
//   4. exactly every TURNS_BETWEEN_REMINDERS (=10) human turns since plan_mode_exit
// Only when all four hold does it produce the (data-less) attachment record.

// Mapping: getVerifyPlanReminderAttachment→(reminder generator), pending→appState.pendingPlanVerification
```

### 1.3 The turn counter (cadence denominator)

The cadence in §1.2 counts **human turns since the `plan_mode_exit` attachment** — the marker that
records "the model just left plan mode and started implementing." It deliberately counts human turns
(not tool-result messages) so the 10-turn interval tracks *conversation* progress, not tool churn.

```javascript
// ============================================
// getVerifyPlanReminderTurnCount - human turns since plan_mode_exit marker
// Location (v2.1.88 precursor): src/utils/attachments.ts:3872-3889
// ============================================

// ORIGINAL (v2.1.88 precursor — verbatim):
export function getVerifyPlanReminderTurnCount(messages) {
  let turnCount = 0
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (message && isHumanTurn(message)) turnCount++
    if (message?.type === 'attachment' && message.attachment.type === 'plan_mode_exit') return turnCount
  }
  return 0
}

// READABLE (for understanding):
// Walk messages newest→oldest, counting human turns, and STOP at the first plan_mode_exit
// attachment (that marks when implementation began). If no plan_mode_exit is ever found, return 0
// — which the caller treats as "not implementing a plan yet → no reminder."

// Mapping: getVerifyPlanReminderTurnCount→kw4 (v2.1.156), isHumanTurn→BV$ (v2.1.156)
```

### 1.4 The reminder text (rendered user message)

When the attachment in §1.2 reached the renderer, it became a `<system-reminder>`-wrapped user
message instructing the model to call the verification tool **directly** — explicitly *not* via the
Agent/subagent tool (so the verification runs inline rather than being delegated).

```javascript
// ============================================
// verify_plan_reminder renderer - tells the model to call VerifyPlanExecution directly
// Location (v2.1.88 precursor): src/utils/messages.ts:4240-4251
// ============================================

// ORIGINAL (v2.1.88 precursor — verbatim):
case 'verify_plan_reminder': {
  const toolName = process.env.CLAUDE_CODE_VERIFY_PLAN === 'true' ? 'VerifyPlanExecution' : ''
  const content = `You have completed implementing the plan. Please call the "${toolName}" tool directly (NOT the ${AGENT_TOOL_NAME} tool or an agent) to verify that all plan items were completed correctly.`
  return wrapMessagesInSystemReminder([createUserMessage({ content, isMeta: true })])
}

// Mapping: AGENT_TOOL_NAME→sq ("Agent") in v2.1.156, wrapMessagesInSystemReminder→C_, createUserMessage→T8
```

### 1.5 The ExitPlanMode hand-off instruction

The same feature also injected a one-time instruction into the *implement-the-plan* message produced
when the user approved a plan, so the model knew up-front it would have to verify.

```javascript
// ============================================
// ExitPlanMode verification instruction - one-time "you MUST call VerifyPlanExecution" hand-off
// Location (v2.1.88 precursor): src/components/permissions/ExitPlanModePermissionRequest/ExitPlanModePermissionRequest.tsx:367
// ============================================

// ORIGINAL (v2.1.88 precursor — verbatim; note the env was already partially DCE'd to `undefined`):
const verificationInstruction = undefined === 'true'
  ? `\n\nIMPORTANT: When you have finished implementing the plan, you MUST call the "VerifyPlanExecution" tool directly (NOT the ${AGENT_TOOL_NAME} tool or an agent) to trigger background verification.`
  : '';
// ...spliced into: `Implement the following plan:\n\n${currentPlan}${verificationInstruction}${transcriptHint}...`

// READABLE (for understanding):
// On approval, the implement-message normally reads "Implement the following plan: <plan>".
// When the feature was live, the IMPORTANT verification clause was concatenated in. The
// `undefined === 'true'` you see is the build-time replacement of process.env.CLAUDE_CODE_VERIFY_PLAN
// → always false → empty string. So even this precursor snapshot already ships the clause OFF.
```

**Lifecycle (v2.1.88, feature ON).** Approve plan → implement-message carries the IMPORTANT clause →
`appState.pendingPlanVerification` set → model implements → every 10 human turns a
`verify_plan_reminder` nudges it → model calls `VerifyPlanExecution` → `verificationStarted=true`
silences the reminder → background verification runs → `verificationCompleted=true`.

---

## 2. What survives in v2.1.156 (bundle evidence)

### 2.1 Hard absences (the env, the tool, the strings — all gone)

Every grep below was run against the v2.1.156 bundle and returned **zero** hits:

| Probe | Hits in `cli_inner_pretty.js` |
|-------|-------------------------------|
| `CLAUDE_CODE_VERIFY_PLAN` | **0** |
| `VerifyPlanExecution` (tool name string) | **0** |
| `When you have finished implementing` (ExitPlanMode clause) | **0** |

So the question "does `CLAUDE_CODE_VERIFY_PLAN` still exist in v2.1.156?" is answered directly by the
bundle: **no.** The env flag, the tool class, and the ExitPlanMode hand-off instruction were all
removed at build/source time. There is no code path — flagged or otherwise — that can register a
`VerifyPlanExecution` tool in v2.1.156.

### 2.2 What *does* survive: the reminder skeleton

Four artifacts of the reminder pipeline remain in the bundle, all confirmed by the module's
`__esModule` export block at `cli_inner_pretty.js:412628-412654`:

- `getVerifyPlanReminderTurnCount` exported as `kw4` — `cli_inner_pretty.js:412628`
- `VERIFY_PLAN_REMINDER_CONFIG` exported as `zw4` — `cli_inner_pretty.js:412654`
- the `verify_plan_reminder` generator registration (`bR_`) — `cli_inner_pretty.js:412732`
- the `verify_plan_reminder` renderer case — `cli_inner_pretty.js:445786-445789`

### 2.3 The generator is NEUTERED → `return []`

The registration is real, but the generator it points at is a two-statement stub that returns an
empty array regardless of input.

```javascript
// ============================================
// emitVerifyPlanReminder - NEUTERED generator (unconditional empty result)
// Location: cli_inner_pretty.js:413895-413897 (registered at 412732)
// ============================================

// ORIGINAL (for source lookup):
E3("verify_plan_reminder", async () => bR_(_, $)),
// ...
async function bR_(H, $) {
  return [];
}

// READABLE (for understanding):
runAttachmentGenerator("verify_plan_reminder", async () => emitVerifyPlanReminder(messages, ctx));
// ...
async function emitVerifyPlanReminder(messages, ctx) {
  return [];   // <- all cadence/appState/pending logic from v2.1.88 §1.2 is gone
}

// Mapping: E3→runAttachmentGenerator, bR_→emitVerifyPlanReminder, _→messages, $→ctx
```

**Why this is decisive.** The `E3("verify_plan_reminder", ...)` call *fixes* the attachment-type ⇄
generator binding by construction — the first string arg is both the telemetry label and the type.
So this is not "a function that happens to return `[]`"; it is specifically the `verify_plan_reminder`
producer, and it produces nothing. The `await` result is `[]`, which the collector's
`.filter(Z => Z !== void 0 && Z !== null)` at `cli_inner_pretty.js:412738` flattens to no
attachment. **The reminder can never appear at runtime.**

### 2.4 The turn counter still works (but is orphaned)

The cadence denominator survives intact and still correctly counts human turns since the
`plan_mode_exit` attachment — it just has no consumer that reaches emission (since §2.3 ignores it).

```javascript
// ============================================
// getVerifyPlanReminderTurnCount - human-turn counter since plan_mode_exit (SURVIVES, orphaned)
// Location: cli_inner_pretty.js:413886-413894
// ============================================

// ORIGINAL (for source lookup):
function kw4(H) {
  let $ = 0;
  for (let q = H.length - 1; q >= 0; q--) {
    let K = H[q];
    if (K && BV$(K)) $++;
    if (K?.type === "attachment" && K.attachment.type === "plan_mode_exit") return $;
  }
  return 0;
}

// READABLE (for understanding):
function getVerifyPlanReminderTurnCount(messages) {
  let turnCount = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m && isHumanTurn(m)) turnCount++;
    if (m?.type === "attachment" && m.attachment.type === "plan_mode_exit") return turnCount;
  }
  return 0;
}

// Mapping: kw4→getVerifyPlanReminderTurnCount, BV$→isHumanTurn, H→messages, plan_mode_exit→implementation-start marker
```

This is **byte-for-byte equivalent** to the v2.1.88 precursor (§1.3) — confirming the readable name
and confirming nothing about *this* function changed; only its caller (the generator) was gutted.

### 2.5 The config constant still exists (unused)

```javascript
// ============================================
// VERIFY_PLAN_REMINDER_CONFIG - cadence constant (SURVIVES, unused)
// Location: cli_inner_pretty.js:414018 (export at 412654)
// ============================================

// ORIGINAL (for source lookup):
(zw4 = { TURNS_BETWEEN_REMINDERS: 10 });

// READABLE (for understanding):
VERIFY_PLAN_REMINDER_CONFIG = { TURNS_BETWEEN_REMINDERS: 10 };  // no live reader

// Mapping: zw4→VERIFY_PLAN_REMINDER_CONFIG
```

Same value (`10`) as the v2.1.88 precursor. It is still constructed alongside its sibling configs
(`TODO_REMINDER_CONFIG`/`QV$`, `PLAN_MODE_ATTACHMENT_CONFIG`/`lg6`, …) at `cli_inner_pretty.js:414014-414018`,
but with `bR_` neutered there is no code that reads `TURNS_BETWEEN_REMINDERS`.

### 2.6 The renderer survives — with an empty tool name

The renderer case is still present in the attachment switch. Crucially, the tool-name interpolation
that was `process.env.CLAUDE_CODE_VERIFY_PLAN === 'true' ? 'VerifyPlanExecution' : ''` in the
precursor has been **fully constant-folded to the empty string** — the bundle hard-codes `""`.

```javascript
// ============================================
// verify_plan_reminder renderer - SURVIVES but unreachable; tool name folded to ""
// Location: cli_inner_pretty.js:445786-445789
// ============================================

// ORIGINAL (for source lookup):
case "verify_plan_reminder": {
  let K = `You have completed implementing the plan. Please call the "" tool directly (NOT the ${sq} tool or an agent) to verify that all plan items were completed correctly.`;
  return C_([T8({ content: K, isMeta: !0 })]);
}

// READABLE (for understanding):
case "verify_plan_reminder": {
  const content = `You have completed implementing the plan. Please call the "" tool directly (NOT the ${AGENT_TOOL_NAME} tool or an agent) to verify that all plan items were completed correctly.`;
  return wrapMessagesAsReminders([makeUserMessage({ content, isMeta: true })]);
}

// Mapping: sq→AGENT_TOOL_NAME ("Agent", def @ cli_inner_pretty.js:185637), C_→wrapMessagesAsReminders, T8→makeUserMessage
```

**Two tells that the feature is dead, frozen into the artifact:**
1. The literal `""` in `call the "" tool directly` — the ternary collapsed to its false branch, so
   if this case ever *did* render, it would emit a grammatically broken instruction naming no tool.
2. `${sq}` resolves to `"Agent"` (`var sq = "Agent"` at `cli_inner_pretty.js:185637`) — the
   Agent/subagent tool name, confirming this is the precursor's `${AGENT_TOOL_NAME}` slot. The
   "(NOT the Agent tool or an agent)" clause is the only meaningful text left.

The case is retained (rather than deleted) for the same reason the legacy-attachment fall-through
list exists right below it (the `LEGACY_ATTACHMENT_TYPES` silent-drop list, §3.5): a `--resume`'d
session could carry an old `verify_plan_reminder` attachment, and an unhandled type in the switch
would throw. **Note the nuance:** `verify_plan_reminder` is *not* in that legacy silent-drop list —
it still has a real, rendering `case` in the switch (just with the neutered generator upstream and a
folded-empty tool name). So it sits one step "more alive" than a fully retired type: the schema and
renderer are intact, only emission is severed. Keeping the case is crash-insurance, not a live
feature.

---

## 3. Deep analysis

### Why de-flag by gutting the generator instead of deleting the type?

**What it does:** Removes a feature from the running product while leaving the attachment *type*
nominally supported.

**How it works:**
1. The env flag and tool (§1.1) are removed at source — these are the *capabilities*, and capabilities
   are safe to delete because nothing persists a reference to them across sessions.
2. The generator body (§2.3) is replaced with `return []` — this severs *emission* without touching
   the registration array shape in `Aw4` (so the parallel-wave indices and telemetry labels stay
   stable).
3. The renderer case (§2.6) and the type in `normalizeAttachmentForAPI`'s switch are **kept** — these
   are the *deserialization* surface, and old transcripts can still contain the type.

**Why this approach:**
- *Resume safety.* `--resume` replays a stored transcript whose attachments were serialized by an
  older build. If `verify_plan_reminder` were dropped from the renderer switch, replaying such a
  transcript would hit the "unknown attachment type" path. The precursor documents this exact hazard
  in its `LEGACY_ATTACHMENT_TYPES` comment ("if you remove an attachment type … add it here to avoid
  errors from old --resume'd sessions"). Keeping the case is cheaper and safer than migrating it to
  the legacy list.
- *Telemetry/array stability.* The generators are registered positionally inside two
  `Promise.all([...])` waves in `Aw4` (`cli_inner_pretty.js:412660-412738`). Neutering the body keeps
  the registration in place; deleting it would reshuffle the wave and the 5%-sampled
  `tengu_attachment_compute_duration` labels.
- *Reversibility.* A `return []` stub is a one-line re-enable away. The feature reads as
  *experiment-staged-off*, not *abandoned*.

**Key insight:** v2.1.156 distinguishes **capability removal** (env + tool: deleted outright,
because they are build-time/runtime constructs with no persistence) from **schema removal**
(attachment type + renderer: retained, because they are serialization constructs that outlive a
single process). The generator sits between the two and is the cheapest cut point — gut it and the
capability is unreachable while the schema stays intact.

### 3.4 Where did `pendingPlanVerification` go?

In the precursor, the reminder's real gate was `appState.pendingPlanVerification` — a tri-state
record (`{plan, verificationStarted, verificationCompleted}`, `AppStateStore.ts:413-417`) set on plan
exit and cleared by the tool. In v2.1.156 the *reader* of that state was the generator (`bR_`), and
since `bR_` is now `return []`, the state is never consulted on the reminder path. The whole
verification state machine — set-on-exit, silence-on-start, stop-on-complete — is therefore inert.
This is consistent with the tool (the only writer of `verificationStarted`/`verificationCompleted`)
having been removed in §2.1.

### 3.5 The `LEGACY_ATTACHMENT_TYPES` silent-drop list (full list + diff)

The renderer function (`normalizeAttachmentForAPI`, obfuscated `kc6`, `cli_inner_pretty.js:445425`)
ends its `switch (H.type)` with a final guard: any attachment whose `type` is in a hard-coded
**legacy list** is silently dropped (`return []`); anything *else* unrecognized logs an
`Unknown attachment type: ${type}` error. This is the resume-safety mechanism referenced in §2.6/§3 —
removed attachment types are demoted into this list so old `--resume`'d transcripts don't crash.

```javascript
// ============================================
// LEGACY_ATTACHMENT_TYPES - silent-drop list at the tail of normalizeAttachmentForAPI
// Location: cli_inner_pretty.js:445791-445808 (inside kc6, switch tail)
// ============================================

// ORIGINAL (for source lookup):
if (
  [
    "autocheckpointing", "background_task_status", "todo", "task_progress", "ultramemory",
    "compaction_reminder", "current_session_memory", "thinking_reminder", "companion_intro",
    "pen_mode_enter", "pen_mode_exit", "ultrawork_request",
  ].includes(H.type)
)
  return [];
return (em("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${H.type}`)), []);

// READABLE (for understanding):
// Retired attachment types are dropped to [] (no API text, no crash). Genuinely-unknown types
// fall through to logAntError. This is "schema removal with backward-compat" — the opposite end
// of the spectrum from verify_plan_reminder, which kept a *rendering* case.

// Mapping: kc6→normalizeAttachmentForAPI, em→logAntError, H→attachment
```

**Full v2.1.156 `LEGACY_ATTACHMENT_TYPES` list (12 entries):**

| # | Type | Notes |
|---|------|-------|
| 1 | `autocheckpointing` | present in v2.1.88 list |
| 2 | `background_task_status` | present in v2.1.88 list |
| 3 | `todo` | present in v2.1.88 list |
| 4 | `task_progress` | present in v2.1.88 list (removed in PR #19337) |
| 5 | `ultramemory` | present in v2.1.88 list (removed in PR #23596) |
| 6 | `compaction_reminder` | **NEW** vs v2.1.88 — retired since |
| 7 | `current_session_memory` | **NEW** vs v2.1.88 |
| 8 | `thinking_reminder` | **NEW** vs v2.1.88 (the thinking-mode nudge, now retired) |
| 9 | `companion_intro` | **NEW** vs v2.1.88 |
| 10 | `pen_mode_enter` | **NEW** vs v2.1.88 |
| 11 | `pen_mode_exit` | **NEW** vs v2.1.88 |
| 12 | `ultrawork_request` | **NEW** vs v2.1.88 |

**Diff against the v2.1.88 precursor.** The precursor list (`messages.ts:4268-4274`) had only **5**
entries — `autocheckpointing`, `background_task_status`, `todo`, `task_progress`, `ultramemory`.
v2.1.156 grew it to **12**, adding 7 more retired types as features were removed between the versions.

**Where `verify_plan_reminder` sits relative to this list.** It is deliberately **NOT** in
`LEGACY_ATTACHMENT_TYPES`. The codebase has three tiers of "deadness":

| Tier | What's kept | What's gone | Example in v2.1.156 |
|------|-------------|-------------|---------------------|
| **A — fully retired** | nothing (silent-drop only) | generator + renderer | the 12 types above |
| **B — neutered (this feature)** | renderer `case` + type | generator emission (gutted to `[]`) | `verify_plan_reminder` (also `teammate_mailbox`, `output_token_usage`) |
| **C — live** | generator + renderer + type | — | `plan_mode`, `plan_mode_exit`, `memory_update`, … |

`verify_plan_reminder` is Tier B: it kept a rendering `case` (with a folded-empty tool name) but lost
emission. If/when the renderer case is finally deleted, the type would be expected to migrate into the
Tier-A legacy list — it has not yet.

---

## 4. Cross-validation matrix (v2.1.88 ↔ v2.1.156)

| Aspect | v2.1.88 precursor (`3rd/claude-code/src`) | v2.1.156 (`cli_inner_pretty.js`) | Verdict |
|--------|-------------------------------------------|----------------------------------|---------|
| Env flag `CLAUDE_CODE_VERIFY_PLAN` | `tools.ts:92`, `messages.ts:4244`, `attachments.ts:3900` | grep = 0 hits | **REMOVED** |
| `VerifyPlanExecutionTool` registration | `tools.ts:91-95, 231` | grep = 0 hits | **REMOVED** |
| ExitPlanMode "IMPORTANT…finished implementing" clause | `ExitPlanModePermissionRequest.tsx:367` | grep = 0 hits | **REMOVED** |
| Generator `getVerifyPlanReminderAttachment` (4 gates) | `attachments.ts:3894-3929` | `bR_` @ 413895-413897 = `return []` | **NEUTERED** |
| Turn counter `getVerifyPlanReminderTurnCount` | `attachments.ts:3872-3889` | `kw4` @ 413886-413894 | **UNCHANGED** (byte-equivalent) |
| Config `VERIFY_PLAN_REMINDER_CONFIG` | `attachments.ts:291` `{TURNS_BETWEEN_REMINDERS:10}` | `zw4` @ 414018 `{TURNS_BETWEEN_REMINDERS:10}` | **UNCHANGED** (orphaned) |
| Renderer case text | `messages.ts:4246-4250` (`"VerifyPlanExecution"`) | 445787 (tool name folded to `""`) | **UNREACHABLE** (string frozen) |
| `appState.pendingPlanVerification` consumer | reminder generator + tool | no live reader | **INERT** |
| `${AGENT_TOOL_NAME}` in text | `AGENT_TOOL_NAME` | `sq = "Agent"` @ 185637 | **MATCH** |

### Confidence assessment

- **VerifyPlan tool & env removed in v2.1.156 — CERTAIN.** Triangulated by three independent zero-hit
  greps (env, tool-name string, ExitPlanMode clause) against the full bundle.
- **Reminder generator neutered — CERTAIN.** The `E3("verify_plan_reminder", …)` call site fixes the
  type binding and the `bR_` body is `return []`; both halves read directly from the bundle.
- **Counter/config survive unused — CERTAIN.** Definitions present and byte-equivalent to the
  precursor; the only live caller (the generator) ignores them.
- **Renderer retained for resume-safety — HIGH (inferred).** The retention pattern matches the
  adjacent `LEGACY_ATTACHMENT_TYPES` mechanism and the sibling neutered reminders; the empty-string
  tool name proves the rendering path is no longer meaningfully reachable.

---

## 5. Is there *any* surviving plan-check reminder in v2.1.156?

Short answer: **there is no live reminder/prompt that asks the model to verify a plan was *implemented
correctly* after execution.** That concept (the VerifyPlan loop) is dead. But the bundle does contain
plan-related "verify/review" language in two places — neither of which is execution verification.
This section disambiguates them so the conclusion is not over- or under-stated.

A grep for plan-verification phrasing in the v2.1.156 bundle returns exactly these live strings:

| Phrase | Hits | Where | Is it post-implementation verification? |
|--------|------|-------|------------------------------------------|
| `verify that all plan` / `all plan items` / `completed correctly` / `implementing the plan` | 1 each | the **dead** `verify_plan_reminder` renderer (`445787`) | No — unreachable (§2.3, §2.6) |
| `verify the plan` | 1 | Ultraplan `visual_plan` reminder (`SU4`, `503333`) | No — *pre-approval* plan-quality guidance |
| `review the plan` | 1 | Ultraplan `three_subagents_with_critique` reminder (`RU4`, `503359`) | No — *pre-approval* critique-agent step |

### 5.1 The two surviving "verify/review" strings are PRE-approval plan-*quality* reminders

Both live hits belong to the **remote Ultraplan reminder set** (`hU4`/`SU4`/`RU4` =
`simple_plan`/`visual_plan`/`three_subagents_with_critique`, `cli_inner_pretty.js:503302-503377`;
deep-dived in [`remote_and_ultraplan.md`](./remote_and_ultraplan.md) §3). They fire **only in remote
(CCR) plan-mode sessions** and **before** `ExitPlanMode` is called — i.e. while the model is still
*producing* the plan:

- **`visual_plan` (`SU4`, `503333`):** "*A plan should be easy for someone to inspect and verify… a
  diagram is what allows them to verify the plan at a glance.*" → asks the model to write a plan a
  human **reviewer** can verify, optionally with a mermaid/ascii diagram. This is about plan
  *legibility*, not execution.
- **`three_subagents_with_critique` (`RU4`, `503359`):** "*Use the Task tool to spawn a critique agent
  to **review the plan** for missing steps, risks, and mitigations… then call ExitPlanMode.*" → a
  pre-approval critique loop run by a subagent, the opposite of the dead VerifyPlan rule (which
  insisted verification be done **directly, NOT** via the Agent/subagent tool).

So these are conceptually distinct from VerifyPlan on every axis: **timing** (before approval vs after
implementation), **scope** (plan quality vs execution correctness), **executor** (subagent critique
vs direct in-line tool call), and **availability** (remote-only vs all sessions).

### 5.2 What is *gone*: the post-implementation verification nudge

There is **no** v2.1.156 attachment, system-reminder, or tool that, after the model exits plan mode
and starts coding, periodically reminds it to confirm every plan item was actually completed. The
only machinery that ever did this was VerifyPlan, and §1–§4 show it is fully removed (env + tool) or
neutered (reminder generator). The `## Exited Plan Mode` notice (the `plan_mode_exit` renderer at
`cli_inner_pretty.js:446663`) merely says "*You have exited plan mode. You can now make edits, run
tools, and take actions.*" with an optional plan-file path — it contains **no** instruction to verify
the implementation afterward.

**Bottom line:** v2.1.156 reminds the model to write a *verifiable* plan (remote Ultraplan, pre-approval)
and, optionally, to have a subagent *critique* it before approval — but it has **no** surviving feature
that reminds the model to *verify the implementation matched the plan* after the fact.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (Plan Mode, Compact, Hooks, Skills)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (Permissions, Model, Prompt)
> - [symbol_additions_v2_1_156_system_reminder.md](../00_overview/symbol_additions_v2_1_156_system_reminder.md) — System-reminder generator pool & configs (full `Aw4`/`E3` map)

Key functions/constants in this document:
- `emitVerifyPlanReminder` (`bR_`) — NEUTERED `verify_plan_reminder` generator, `return []` (`cli_inner_pretty.js:413895-413897`)
- `getVerifyPlanReminderTurnCount` (`kw4`) — human-turn counter since `plan_mode_exit`; survives, orphaned (`cli_inner_pretty.js:413886-413894`)
- `VERIFY_PLAN_REMINDER_CONFIG` (`zw4`) — `{TURNS_BETWEEN_REMINDERS:10}`; survives, unused (`cli_inner_pretty.js:414018`)
- `runAttachmentGenerator` (`E3`) — per-generator wrapper; binds type label at call site (`cli_inner_pretty.js:412739`)
- `getAttachmentMessages` (`Aw4`) — collectAttachments master gate hosting the `verify_plan_reminder` registration (`cli_inner_pretty.js:412660-412738`)
- `isHumanTurn` (`BV$`) — human-turn predicate used by the counter (`cli_inner_pretty.js:412122`)
- `wrapMessagesAsReminders` (`C_`) / `makeUserMessage` (`T8`) — reminder render primitives
- `AGENT_TOOL_NAME` (`sq` = `"Agent"`) — subagent tool name in the reminder text (`cli_inner_pretty.js:185637`)
- `normalizeAttachmentForAPI` (`kc6`) — attachment→API renderer; hosts the `verify_plan_reminder` case and the `LEGACY_ATTACHMENT_TYPES` silent-drop tail (`cli_inner_pretty.js:445425`; legacy list `445791-445808`)
- `logAntError` (`em`) — error sink for genuinely-unknown attachment types (def `cli_inner_pretty.js:10176`; called at `445808`)
- `REMOTE_PLAN_REMINDER_VISUAL` (`SU4`, id `visual_plan`) / `REMOTE_PLAN_REMINDER_MULTIAGENT` (`RU4`, id `three_subagents_with_critique`) — the surviving *pre-approval* plan-quality reminders (`cli_inner_pretty.js:503323-503377`; see [`remote_and_ultraplan.md`](./remote_and_ultraplan.md) §3)

v2.1.88 precursor anchors (cross-validation only, NOT v2.1.156 evidence):
- `VerifyPlanExecutionTool` conditional import — `3rd/claude-code/src/tools.ts:89-96, 231`
- `getVerifyPlanReminderAttachment` — `3rd/claude-code/src/utils/attachments.ts:3894-3929`
- `verify_plan_reminder` renderer — `3rd/claude-code/src/utils/messages.ts:4240-4251`
- ExitPlanMode verification instruction — `3rd/claude-code/src/components/permissions/ExitPlanModePermissionRequest/ExitPlanModePermissionRequest.tsx:367`
- `pendingPlanVerification` app-state — `3rd/claude-code/src/state/AppStateStore.ts:413-417`
