# Plan Mode reminders, prompt contract, and compaction carryover in 2.1.220

Plan Mode does not rely on the model remembering one `EnterPlanMode` tool result. The 2.1.220 message
pipeline periodically reconstructs a structured `plan_mode` attachment, renders the full or sparse
contract, restores a full reminder after compaction, and emits one-shot re-entry/exit boundaries.

This report anchors that machinery directly in
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`. The 2.1.193 report is a
comparison baseline; the named `src/utils/attachments.ts` and `src/utils/messages.ts` files are
semantic cross-checks only.

---

## 1. Attachment pipeline

The normal attachment batch registers two independent Plan Mode producers at
`cli_inner_pretty.js:516647-516648`:

- the `plan_mode` lane invokes `buildPlanModeAttachments` (`HN_`, `:516849`);
- the `plan_mode_exit` lane invokes `buildPlanModeExitAttachment` (`yop`, `:516887`).

Keeping these lanes separate matters. The first describes a continuing restrictive mode; the second
describes a completed transition. `handlePlanModeTransition` and the builder guards ensure a rapid
toggle cannot inject both contradictory instructions into the same active planning state.

The attachment objects are internal metadata. `renderAttachment` dispatches `plan_mode` through
`renderPlanModeAttachment` (`AU_`, `:532458`) and handles `plan_mode_reentry` and `plan_mode_exit` as
separate branches. The rendered messages are meta user messages, so they guide the model without being
misrepresented as new human instructions.

---

## 2. Reminder cadence

### Human-turn throttle

**What it does:** Prevents Plan Mode reminders from being injected on every tool round while still
refreshing the contract after meaningful user interaction.

**How it works:**
1. Scan messages backward from newest to oldest.
2. Count only non-meta user messages whose content is not a tool result.
3. Stop at the most recent `plan_mode` or `plan_mode_reentry` attachment and report that a prior plan
   reminder was found.
4. Stop at a `plan_mode_exit` boundary without reporting an active prior reminder; older planning
   cycles must not throttle a new cycle.
5. In `buildPlanModeAttachments`, suppress output only if a prior active-cycle reminder exists and
   fewer than five qualifying human turns have occurred.
6. If no prior reminder is found, always emit immediately—even when the current transcript contains
   no new human turn after entry.

**Why this approach:** The agent loop may perform dozens of assistant/tool rounds for one user turn.
Counting loop rounds would repeatedly inject the same large prompt. Human turns are a better proxy for
scope change and for the chance that the planning contract has fallen out of attention.

**Trade-offs:** A long autonomous exploration under one human turn receives no cadence refresh until
compaction or a later user message. The permission layer still enforces plan restrictions, so reminder
throttling cannot grant write authority.

**Key insight:** The throttle optimizes prompt attention and tokens; it is not the security boundary.

### Full versus sparse rotation

**What it does:** Periodically repeats the complete planning workflow while using a small reminder for
intermediate refreshes.

**How it works:**
1. Scan backward and count only `plan_mode` attachments.
2. Stop at `plan_mode_exit`, which resets the cycle.
3. Add one for the pending attachment.
4. Choose `full` when `count % 5 === 1`; otherwise choose `sparse`.
5. Consequently the 1st, 6th, 11th, and every fifth later attachment in the same cycle are full.
6. `plan_mode_reentry` is not included in this rotation count; it is an additional one-shot warning,
   followed by the normal full/sparse attachment.

**Why this approach:** The full prompt carries the complete workflow and file constraints, but paying
its token cost every time is unnecessary. A deterministic modulo schedule is transparent, cheap, and
resets at a semantic exit boundary.

**Trade-offs:** Fixed cadence is not adaptive to context pressure or task complexity. Compaction
compensates by unconditionally rebuilding a full reminder when the older full prompt may have been
summarized away.

**Key insight:** Two independent fives are involved: five human turns between attachments and one full
attachment per five attachments. A full prompt therefore normally occurs after much more than five
human turns.

```javascript
// ============================================
// countPlanReminderCadence - Count human turns and active-cycle plan attachments
// Location: cli_inner_pretty.js:516816-516843
// ============================================

// ORIGINAL (for source lookup):
function I8s(e) {
  let t = 0,
    r = !1;
  for (let n = e.length - 1; n >= 0; n--) {
    let o = e[n];
    if (o?.type === "user" && !o.isMeta && !Top(o.message.content)) t++;
    else if (
      o?.type === "attachment" &&
      (o.attachment.type === "plan_mode" || o.attachment.type === "plan_mode_reentry")
    ) {
      r = !0;
      break;
    } else if (o?.type === "attachment" && o.attachment.type === "plan_mode_exit") break;
  }
  return { turnCount: t, foundPlanModeAttachment: r };
}
function kN_(e) {
  let t = 0;
  for (let r = e.length - 1; r >= 0; r--) {
    let n = e[r];
    if (n?.type === "attachment") {
      if (n.attachment.type === "plan_mode_exit") break;
      if (n.attachment.type === "plan_mode") t++;
    }
  }
  return t;
}

// READABLE (for understanding):
function countHumanTurnsSinceLastPlanAttachment(messages) {
  let turnCount = 0;
  let foundPlanModeAttachment = false;
  for (let index = messages.length - 1; index >= 0; index--) {
    const message = messages[index];
    if (isHumanNonToolResult(message)) turnCount++;
    else if (isPlanOrReentryAttachment(message)) {
      foundPlanModeAttachment = true;
      break;
    } else if (isPlanExitAttachment(message)) break;
  }
  return { turnCount, foundPlanModeAttachment };
}
function countPlanModeAttachmentsSinceLastExit(messages) {
  let count = 0;
  for (let index = messages.length - 1; index >= 0; index--) {
    if (isPlanExitAttachment(messages[index])) break;
    if (isPlanModeAttachment(messages[index])) count++;
  }
  return count;
}

// Mapping: I8s→countHumanTurnsSinceLastPlanAttachment, kN_→countPlanModeAttachmentsSinceLastExit, e→messages, t→turnCount/count, r→foundPlanModeAttachment/index, Top→containsToolResult
```

---

## 3. Attachment construction

### Active Plan Mode attachment builder

**What it does:** Produces the current planning reminder, optional re-entry warning, and 2.1.220
workshop metadata.

**How it works:**
1. Return nothing unless the current permission mode is exactly `plan`.
2. Apply the five-human-turn throttle described above.
3. Seed the plan slug/path from the session ID and optional slug seed.
4. Read the agent-specific plan path and current file content.
5. If the session previously exited Plan Mode and the plan file still exists, emit
   `plan_mode_reentry` and clear the global flag.
6. Compute the full/sparse reminder type from the active-cycle attachment count.
7. On the first full top-level reminder, when no custom instructions or Ultraplan mode applies and the
   workshop skill is available, attach a workshop-offer path.
8. If a workshop is already active, attach its document path, mark the plan/workshop files for
   snapshotting, and record workshop telemetry only once per transcript.
9. Emit the main `plan_mode` attachment with subagent status, plan path/existence, custom workflow, and
   optional workshop metadata.

**Edge cases and special handling:**
- Re-entry is emitted only when an actual plan file exists. An exit flag without an artifact does not
  generate stale-plan instructions.
- Custom `--plan-mode-instructions` replaces the default implementation-design phases but not the
  read-only preamble or ExitPlanMode protocol footer.
- The workshop offer is top-level only; a subagent never receives the interactive workshop path.
- Workshop activation checks the existing transcript to avoid duplicating activation telemetry.

**Why this approach:** A small data attachment separates cadence/state decisions from large prompt
rendering. Optional fields extend the workflow without forking the scheduler into multiple competing
builders.

**Trade-offs:** The builder reads the plan on each eligible attachment computation. That guarantees
fresh `planExists` state but adds filesystem work to the message pipeline. Five-turn throttling limits
the cost during normal operation.

**Key insight:** Re-entry and the ordinary reminder are intentionally emitted together: one says “do
not trust the old artifact blindly,” and the other reasserts the current planning rules.

```javascript
// ============================================
// buildPlanModeAttachments - Build throttled re-entry, workflow, and workshop metadata
// Location: cli_inner_pretty.js:516849-516885
// ============================================

// ORIGINAL (for source lookup):
async function HN_(e, t, r, n) {
  if (En(r).mode !== "plan") return [];
  if (t && t.length > 0) {
    let { turnCount: p, foundPlanModeAttachment: f } = I8s(t);
    if (f && p < x8s.TURNS_BETWEEN_ATTACHMENTS) return [];
  }
  xIe(kt(), n?.planSlugSeed ?? e ?? void 0);
  let i = VB(r.agentId),
    s = v4(r.agentId),
    a = [];
  if (fNr() && s !== null) (a.push({ type: "plan_mode_reentry", planFilePath: i }), EK(!1));
  let l = kN_(t ?? []) + 1,
    c = l % x8s.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse",
    u =
      l === 1 &&
      c === "full" &&
      !r.agentId &&
      r.options.planModeInstructions === void 0 &&
      !r.getAppState().isUltraplanMode &&
      Wst(),
    d = !r.agentId && Wst() && ccn();
  if (u) be("plan_workshop_offer");
  if (d && !OLo(t ?? [])) be("plan_workshop_active");
  if (d) Kze();
  return (
    a.push({
      type: "plan_mode",
      reminderType: c,
      isSubAgent: !!r.agentId,
      planFilePath: i,
      planExists: s !== null,
      customInstructions: r.options.planModeInstructions,
      ...(u && { workshopOfferDocPath: GKe() }),
      ...(d && { workshopActiveDocPath: GKe() }),
    }),
    a
  );
}

// READABLE (for understanding):
async function buildPlanModeAttachments(slugSeed, messages, context, options) {
  if (getPermissionContext(context).mode !== "plan") return [];
  if (shouldThrottlePlanReminder(messages, 5)) return [];
  seedPlanPath(getSessionId(), options?.planSlugSeed ?? slugSeed);
  const planFilePath = getPlanFilePath(context.agentId);
  const plan = readPlanFile(context.agentId);
  const attachments = [];
  if (hasExitedPlanMode() && plan !== null) {
    attachments.push({ type: "plan_mode_reentry", planFilePath });
    setHasExitedPlanMode(false);
  }
  const count = countPlanModeAttachmentsSinceLastExit(messages ?? []) + 1;
  const reminderType = count % 5 === 1 ? "full" : "sparse";
  const workshopOffer = shouldOfferWorkshop(count, reminderType, context);
  const workshopActive = isWorkshopActiveForTopLevelSession(context);
  if (workshopActive) schedulePlanFileSnapshot();
  attachments.push({
    type: "plan_mode",
    reminderType,
    isSubAgent: Boolean(context.agentId),
    planFilePath,
    planExists: plan !== null,
    customInstructions: context.options.planModeInstructions,
    ...(workshopOffer && { workshopOfferDocPath: getWorkshopDocumentPath() }),
    ...(workshopActive && { workshopActiveDocPath: getWorkshopDocumentPath() }),
  });
  return attachments;
}

// Mapping: HN_→buildPlanModeAttachments, e→slugSeed, t→messages, r→context, n→options, En→getPermissionContext, I8s→countHumanTurnsSinceLastPlanAttachment, x8s→PLAN_MODE_ATTACHMENT_CONFIG, xIe→seedPlanPath, kt→getSessionId, VB→getPlanFilePath, v4→readPlanFile, fNr→hasExitedPlanMode, EK→setHasExitedPlanMode, kN_→countPlanModeAttachmentsSinceLastExit, Wst→isWorkshopAvailable, ccn→isWorkshopActive, Kze→schedulePlanFileSnapshot, GKe→getWorkshopDocumentPath
```

---

## 4. Prompt renderer and write boundaries

### Full, sparse, and subagent render selection

**What it does:** Turns attachment metadata into the minimum appropriate model instruction.

**How it works:**
1. `renderPlanModeAttachment` sends all subagent attachments to the subagent renderer regardless of
   reminder type.
2. Top-level sparse attachments use a single compact line containing the plan path, read-only rule,
   workflow reference, and valid end-turn actions.
3. Other top-level attachments use the full renderer.
4. The full renderer chooses between custom phases and the default five-phase workflow while always
   prepending the same read-only contract and appending the same `ExitPlanMode` protocol.
5. Every rendered instruction is normalized as a meta user message.

**Why this approach:** A subagent has no local approval UI and should return analysis to its caller;
giving it the top-level multi-agent workflow would encourage nested coordination. Sparse messages save
tokens after the full contract has already appeared.

**Trade-offs:** The renderer depends on prior full context when emitting sparse reminders. Compaction
must therefore force a full reminder, and custom workflows must not replace the safety preamble/footer.

**Key insight:** Custom Plan Mode instructions replace the *middle workflow*, never the enforcement
contract or approval protocol.

The full 2.1.220 prompt adds a workshop-aware branch:

- Before activation, the plan file remains the only write target; the prompt may offer an interactive
  workshop exactly once when substantive user decisions exist.
- After activation, the known workshop document becomes an explicitly granted second write target and
  may be published through the Artifact tool.
- The plan file remains canonical: resolved workshop decisions must be folded back into it.
- Publication becomes a third valid end-turn action while user decisions are pending; otherwise turns
  must end with `AskUserQuestion` for clarification or `ExitPlanMode` for approval.

This is a narrowly scoped capability grant. It does not weaken the permission floor for arbitrary
files.

### Re-entry renderer

The one-shot `plan_mode_reentry` message at `:532814` requires the model to:

1. read the existing plan;
2. compare the current request with the old task;
3. overwrite for a different task or cleanly revise for an explicit continuation;
4. edit the artifact before invoking `ExitPlanMode` again.

The design prevents an old approved plan from being treated as authorization for a superficially
similar new request.

### Exit renderer

The `plan_mode_exit` renderer at `:534287` explicitly says that edits, tools, and actions are now
allowed and includes the saved plan path if it exists. This message is operationally important: the
permission context changes what the runtime permits, while the attachment changes what the model
believes it should do.

---

## 5. One-shot exit attachment

### Exit-boundary generation

**What it does:** Emits exactly one transcript notice after leaving Plan Mode, including cases where a
mode transition occurred outside the ordinary `ExitPlanMode` result flow.

**How it works:**
1. If mode is still `plan`, clear a stale exit flag and emit nothing.
2. Scan for a prior active Plan Mode attachment.
3. If neither the explicit exit flag nor a prior Plan Mode attachment exists, emit nothing.
4. Clear the flag before producing the attachment, making it one-shot.
5. Resolve the current plan path and existence bit.
6. Return `plan_mode_exit` for the renderer.

**Why this approach:** The explicit flag covers normal mode crossings; transcript detection recovers
when state and message timing are out of phase. Checking current mode first prevents a stale flag from
injecting “you may edit” into an active plan.

**Trade-offs:** Transcript fallback may emit an exit notice after a restored session even when the
original flag was lost. That conservative reminder is safer than leaving the model under an obsolete
read-only belief after permissions have opened.

**Key insight:** The builder validates both runtime state and transcript history before announcing a
permission boundary.

```javascript
// ============================================
// buildPlanModeExitAttachment - Emit a one-shot exit boundary only outside plan mode
// Location: cli_inner_pretty.js:516887-516895
// ============================================

// ORIGINAL (for source lookup):
async function yop(e, t) {
  if (En(t).mode === "plan") return (Sue(!1), []);
  let { foundPlanModeAttachment: r } = I8s(e ?? []);
  if (!qEi() && !r) return [];
  Sue(!1);
  let n = VB(t.agentId),
    o = v4(t.agentId) !== null;
  return [{ type: "plan_mode_exit", planFilePath: n, planExists: o }];
}

// READABLE (for understanding):
async function buildPlanModeExitAttachment(messages, context) {
  if (getPermissionContext(context).mode === "plan") {
    setNeedsPlanModeExitAttachment(false);
    return [];
  }
  const { foundPlanModeAttachment } = countHumanTurnsSinceLastPlanAttachment(messages ?? []);
  if (!needsPlanModeExitAttachment() && !foundPlanModeAttachment) return [];
  setNeedsPlanModeExitAttachment(false);
  const planFilePath = getPlanFilePath(context.agentId);
  const planExists = readPlanFile(context.agentId) !== null;
  return [{ type: "plan_mode_exit", planFilePath, planExists }];
}

// Mapping: yop→buildPlanModeExitAttachment, e→messages, t→context, En→getPermissionContext, Sue→setNeedsPlanModeExitAttachment, I8s→countHumanTurnsSinceLastPlanAttachment, qEi→needsPlanModeExitAttachment, VB→getPlanFilePath, v4→readPlanFile
```

---

## 6. Compaction reconstruction

### Full Plan Mode reminder after compact

**What it does:** Recreates the active planning contract when compaction has summarized or removed the
earlier attachment history.

**How it works:**
1. Return `null` unless current mode is `plan`.
2. Resolve the plan path and existence state from disk, not from pre-compact messages.
3. Detect an active top-level workshop. If present, record activation only when the compacted message
   slice has no prior workshop attachment and snapshot the writable artifacts.
4. Copy optional custom Plan Mode instructions.
5. Return a serialized `plan_mode` attachment with `reminderType: "full"`, never sparse.
6. Preserve subagent identity and the active workshop path in the rebuilt metadata.

**Why this approach:** Sparse reminders are only safe when a full prompt remains in context. Compaction
breaks that assumption, so reconstruction deliberately ignores the normal modulo cadence.

**Trade-offs:** A full prompt consumes tokens immediately after compaction, but omitting it would make
the new condensed context depend on rules that may no longer be present.

**Key insight:** Mode state survives outside the transcript, but model-visible policy does not. The
compact path bridges those two kinds of persistence.

```javascript
// ============================================
// buildPlanModeAttachmentAfterCompact - Rebuild a full current-state reminder after compaction
// Location: cli_inner_pretty.js:440904-440922
// ============================================

// ORIGINAL (for source lookup):
async function rks(e, t) {
  if (En(e).mode !== "plan") return null;
  let r = VB(e.agentId),
    n = v4(e.agentId) !== null,
    o = !e.agentId && Wst() && ccn();
  if (o) {
    if (!OLo(t)) be("plan_workshop_active");
    Kze();
  }
  let i = e.options?.planModeInstructions;
  return Va({
    type: "plan_mode",
    reminderType: "full",
    isSubAgent: !!e.agentId,
    planFilePath: r,
    planExists: n,
    ...(i !== void 0 && { customInstructions: i }),
    ...(o && { workshopActiveDocPath: GKe() }),
  });
}

// READABLE (for understanding):
async function buildPlanModeAttachmentAfterCompact(context, compactedMessages) {
  if (getPermissionContext(context).mode !== "plan") return null;
  const planFilePath = getPlanFilePath(context.agentId);
  const planExists = readPlanFile(context.agentId) !== null;
  const workshopActive = !context.agentId && isWorkshopAvailable() && isWorkshopActive();
  if (workshopActive) {
    if (!hasWorkshopAttachment(compactedMessages)) recordWorkshopActive();
    schedulePlanFileSnapshot();
  }
  return serializeAttachment({
    type: "plan_mode",
    reminderType: "full",
    isSubAgent: Boolean(context.agentId),
    planFilePath,
    planExists,
    ...(context.options?.planModeInstructions !== undefined && { customInstructions: context.options.planModeInstructions }),
    ...(workshopActive && { workshopActiveDocPath: getWorkshopDocumentPath() }),
  });
}

// Mapping: rks→buildPlanModeAttachmentAfterCompact, e→context, t→compactedMessages, En→getPermissionContext, VB→getPlanFilePath, v4→readPlanFile, Wst→isWorkshopAvailable, ccn→isWorkshopActive, OLo→hasWorkshopAttachment, Kze→schedulePlanFileSnapshot, Va→serializeAttachment, GKe→getWorkshopDocumentPath
```

---

## 7. Cross-version verification

| Concern | 2.1.220 bundle | 2.1.193 bundle | Readable tree | Conclusion |
|---|---|---|---|---|
| Human-turn throttle | `I8s`, threshold 5 | same backward scan and threshold | `getPlanModeAttachmentTurnCount` matches | Stable and cross-validated |
| Full/sparse cadence | `kN_`, modulo 5 | same 1st/6th/11th rule | `countPlanModeAttachmentsSinceLastExit` matches | Stable and cross-validated |
| Re-entry/exit boundaries | `HN_` + `yop` | same core flags and attachments | `attachments.ts` names the behavior | Stable core |
| Workshop write path | offer/active metadata in `HN_`, `TU_`, and `rks` | no equivalent in the 193 current-state report | readable tree contains workshop-aware current semantics | 220 report must include it explicitly |
| Custom workflow | copied into attachment; safety preamble/footer retained | flag and replacement semantics already present | `messages.ts` corroborates renderer split | Carryover contract |
| Compact reconstruction | `rks` always emits full and preserves workshop | prior compact builder emits full without workshop metadata | named attachments path corroborates full rebuild | Stable rule, 220 extension |

The 2.1.193 report correctly captured the base cadence. The 2.1.220 source adds enough state to require
a new current-state document: workshop offer/activation, artifact snapshotting, and the second scoped
write target now participate in both normal and compact reminder construction.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `countHumanTurnsSinceLastPlanAttachment` (`I8s`) - reminder throttle scanner
- `countPlanModeAttachmentsSinceLastExit` (`kN_`) - full/sparse rotation counter
- `buildPlanModeAttachments` (`HN_`) - active reminder, re-entry, and workshop builder
- `buildPlanModeExitAttachment` (`yop`) - one-shot post-exit builder
- `buildPlanModeAttachmentAfterCompact` (`rks`) - full reminder reconstruction after compaction
- `renderPlanModeAttachment` (`AU_`) - full/sparse/subagent dispatcher
- `renderFullPlanModeAttachment` (`TU_`) - complete workflow and workshop prompt
- `renderSparsePlanModeAttachment` (`CU_`) - compact active-mode reminder
- `renderSubagentPlanModeAttachment` (`xU_`) - child-specific read-only prompt
- `PLAN_MODE_ATTACHMENT_CONFIG` (`x8s`) - five-turn/five-attachment cadence
- `getPlanFilePath` (`VB`) / `readPlanFile` (`v4`) - live artifact state
- `scheduleFileSnapshot` (`Kze`) - plan/workshop remote snapshot scheduling
