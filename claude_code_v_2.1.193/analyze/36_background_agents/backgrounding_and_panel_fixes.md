# Backgrounding & Agent-Panel Fixes (2.1.193 / 2.1.191)

> **Type:** mixed — one isolable carry-over-aware count fix, one prompt body-change, one partially-isolable adoption fix, three honestly-flagged non-isolable UI items · **Versions:** 2.1.193 / 2.1.191 · **Module:** `36_background_agents/` (EXTEND)
> **Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). `cli_inner_pretty.js:<line>` = a **193** line unless tagged *(183)*.

This doc covers the cluster of backgrounding/panel UX fixes. Each item is tagged with how cleanly it isolates to source; the three UI-only items are flagged honestly rather than given fabricated anchors.

---

## 1. Spurious "N tasks would be abandoned" when all tasks carry over (ISOLABLE, 2.1.193)

### What it does

When the user double-taps `←←` to background a session, the interstitial used to warn "N background task(s) would be abandoned" and demand a second confirmation — *even when every active task was adoptable and would actually be carried over* into the detached job. The fix makes the warned count subtract the carry-over set, so when all tasks carry over the count is `0` and the second-confirm prompt is skipped.

### How it works

The warn-count is `countAbandonedBgTasks` (`oUo`, `:578073`) = total bg tasks **minus** tasks that carry over:

```javascript
// ============================================
// countAbandonedBgTasks - tasks that would truly be lost = total − carried-over
// Location: cli_inner_pretty.js:578073-578075
// ============================================

// ORIGINAL (for source lookup):
function oUo(e, t = fze(e)) {
  return y_t(e).count - H7t(e, t);
}

// READABLE (for understanding):
function countAbandonedBgTasks(tasks, carryOverMap = computeCarryOverMap(tasks)) {
  return countBackgroundTasks(tasks).count - countCarryOverTasks(tasks, carryOverMap);
}

// Mapping: oUo→countAbandonedBgTasks, fze→computeCarryOverMap, y_t→countBackgroundTasks, H7t→countCarryOverTasks
```

The carry-over set is built by `computeCarryOverMap` (`fze`, `:578006`), which walks the task tree from roots (`parentAgentId === void 0`) and marks a subtree as carrying over **only if every node in it is adoptable** — an adoptable node is a backgrounded *running* agent with an `abortController` (and not the `main-session` sentinel), or a detachable backgrounded running shell (not a `monitor`), or a running workflow with `scriptPath` + `workflowRunId`:

```javascript
// ============================================
// computeCarryOverMap - per-subtree "carries over?" map; a subtree carries iff ALL its nodes are adoptable
// Location: cli_inner_pretty.js:578019-578052 (adoptable predicate + tree walk)
// ============================================

// ORIGINAL (for source lookup):
  let o = (i) => {
      if (Kl(i)) return (i.agentType !== "main-session" && i.status === "running" && i.isBackgrounded && i.abortController !== void 0);
      if (iT(i)) return (i.kind !== "monitor" && i.status === "running" && i.isBackgrounded && i.shellCommand !== null && i.shellCommand.detach !== void 0);
      if (Aqt(i)) return (i.status === "running" && i.scriptPath !== void 0 && i.workflowRunId !== void 0 && i.abortController !== void 0);
      return !1;
    },
    s = (i, a) => { a.push(i.id); let l = o(i); for (let c of r.get(i.id) ?? []) l = s(c, a) && l; return l; };

// READABLE (for understanding):
  let isAdoptable = (task) => {
      if (isLocalAgentTask(task)) return task.agentType !== "main-session" && task.status === "running" && task.isBackgrounded && task.abortController !== undefined;
      if (isLocalShellTask(task)) return task.kind !== "monitor" && task.status === "running" && task.isBackgrounded && task.shellCommand?.detach !== undefined;
      if (isWorkflowTask(task))   return task.status === "running" && task.scriptPath !== undefined && task.workflowRunId !== undefined && task.abortController !== undefined;
      return false;
    },
    walkSubtree = (node, ids) => { ids.push(node.id); let carries = isAdoptable(node); for (let child of childrenOf(node.id)) carries = walkSubtree(child, ids) && carries; return carries; };

// Mapping: o→isAdoptable, s→walkSubtree, Kl→isLocalAgentTask, iT→isLocalShellTask, Aqt→isWorkflowTask, r→childrenOf
```

`countCarryOverTasks` (`H7t`, `:578070`) then counts the marked tasks across local tasks and the remote roster. The interstitial guard is `if (FI > 0 || (!confirmedInterstitial && Qo > 0))` (`:689571`) where `Qo = countAbandonedBgTasks(...)`; the warning string is `${Qo} background ${pluralize(Qo,"task")} would be abandoned` (`:689578`). When **all** active tasks are adoptable, `countCarryOverTasks === countBackgroundTasks` ⇒ `Qo === 0` ⇒ the guard is false ⇒ no warning, and `←←` backgrounds immediately.

### Why this approach

The bug was a *category error*: the interstitial counted *active* tasks as *abandoned* tasks, but backgrounding **adopts** active work into the detached job rather than killing it. The fix computes the precise subset that truly cannot be carried (e.g. a `monitor` shell, a non-running task, a task without an abort handle) and warns only about *that*. The per-subtree "all-or-nothing" rule (`walkSubtree` ANDs the children's results) is the subtle part: a subtree carries over only if its *entire* descendant chain is adoptable, because adopting a parent without its children would orphan the children — so a single non-adoptable leaf taints its whole ancestry's carry-over eligibility, and those tasks correctly count as abandoned.

### Evidence

`grep -c "would be abandoned"` = **0** in 183, present in 193 (`:689578`, plus the skip-ahead variant `:690133`). The granular, carry-over-aware count UI is net-new in the 183→193 window. **Confidence: HIGH** on the mechanism (isolable in 193); the specific "spurious when all carry over" fix is the `- H7t(...)` subtraction inside `oUo`. (183's only bg-cancel string was a single generic "Backgrounding cancelled" with no per-task count.)

---

## 2. Background launch result no longer says "end your response" (ISOLABLE, body-change, 2.1.193)

### What it does

After an **async (background)** subagent launch, the tool-result text injected back to the model used to instruct it to *stop* ("…and end your response. Do not generate any other text…"). 193 drops that directive, so after launching a background subagent the model is free to keep working on other tasks instead of halting.

### The diff

```javascript
// ============================================
// async_launched tool-result text - 183 vs 193 (the "end your response" drop)
// Location: cli_inner_pretty.js:431256-431261 (193) ; 424285-424290 (183)
// ============================================

// ORIGINAL 183 (async_launched, both branches end with the stop directive):
//   canReadOutputFile ? "...Work on non-overlapping tasks, or briefly tell the user what you launched and end your response.\noutput_file: ..."
//                     : "Briefly tell the user what you launched and end your response. Do not generate any other text — agent results will arrive in a subsequent message."

// ORIGINAL 193 (async_launched, both branches drop the stop directive):
              ? `Do not duplicate this agent's work — avoid working with the same files or topics it is using.
output_file: ${e.outputFile}
Do NOT ${Ls} or tail this file via the shell tool — it is the full subagent JSONL transcript ...`
              : "Briefly tell the user what you launched. Agent results will arrive in a subsequent message.",

// READABLE (for understanding):
//   193 removes "...and end your response. Do not generate any other text..." from BOTH the
//   canReadOutputFile and the plain async_launched branches → the model keeps working after a bg launch.
```

### False-delta guard (scope)

The **Cloud / remote** launch result (`remote_launched`) still says "end your response" in **both** versions (193 `:431248`, 183 identical): `…You will be notified automatically when it completes.\nBriefly tell the user what you launched and end your response.` So this change is **scoped to async/background launches only**, not cloud — do not claim the cloud path changed. (Separately, the `async_launched` agentId hint also gained a `summary:'<5-10 word recap>'` arg at `:431255` vs 183 `:424284` — that is the 2.1.191 SendMessage-summary work, not this item.) **Confidence: HIGH** — exact before/after located in both bundles.

---

## 3. Phantom "general-purpose (resumed)" subagent on bg main turn (PARTIALLY ISOLABLE, 2.1.193)

### What it does

Backgrounding the *main* turn used to spawn a phantom "general-purpose (resumed)" subagent card that re-ran the conversation. The locus is the **job-adoption loop** that re-registers persisted agents when a session attaches/resumes, combined with the `main-session` sentinel that must keep the top-level session from being treated as a subagent.

### How it works

When a session attaches, the adoption loop iterates persisted agents from the job dir (`readJobDir` `JKl` `:577927`, sorted by `spawnDepth`) and re-registers each via `registerCompletedResumedAgent` (`Lgl`, `:454100`):

```javascript
// ============================================
// registerCompletedResumedAgent - re-register a persisted agent as a completed card
// Location: cli_inner_pretty.js:454100-454123 ; adoption loop :688699
// ============================================

// ORIGINAL (for source lookup):
function Lgl(e, t) {
  let n = jw(e.agentId, "local_agent", e.description ?? "(resumed agent)", e.toolUseId),
    r = { ...n, type: "local_agent", status: "completed", agentId: e.agentId, /* ... */
          agentType: e.agentType ?? "general-purpose", /* ... */ };
  t.register(r);
}
// adoption loop (:688699): (await QKl(ho), Lgl(ho, Ye), zt.add(ho.agentId), gn.push(ho));

// READABLE (for understanding):
function registerCompletedResumedAgent(entry, registry) {
  let base = baseTaskFields(entry.agentId, "local_agent", entry.description ?? "(resumed agent)", entry.toolUseId);
  let record = { ...base, type: "local_agent", status: "completed", agentId: entry.agentId, /* ... */
                 agentType: entry.agentType ?? "general-purpose", /* ... */ };
  registry.register(record);
}

// Mapping: Lgl→registerCompletedResumedAgent, jw→baseTaskFields, QKl→linkAdoptedAgentTranscript, e→entry, t→registry
```

`Lgl`'s `agentType: e.agentType ?? "general-purpose"` and `description: e.description ?? "(resumed agent)"` defaults are exactly what produce a "general-purpose (resumed)" card when those fields are missing — which is what happens if the **main session** is fed through this adoption path without being recognized as `main-session`.

### The isolable signal: the `main-session` guard count 9 → 10

The top-level session is tagged `agentType:"main-session"` (`:441096`) precisely so it is **excluded** from subagent treatment. The filters that exclude it (`Kl(n) && n.agentType !== "main-session"`, `:453732`/`:453735`; and inside the carry-over predicate `fze`, `:578022`) gained one site in the window: `grep -c '"main-session"'` = **9** in 183 → **10** in 193. The added guard is consistent with the fix — recognizing the main session via `agentType:"main-session"` so backgrounding the main turn does **not** re-adopt/register it as a `general-purpose` subagent that re-runs the conversation.

### Honest limitation

The adoption machinery (`:688699` loop + `Lgl`) and the `main-session` sentinel are the right locus, and the 9→10 guard delta is real and isolable. But I could **not** byte-diff the exact added guard line against 183 (re-mangling), so the attribution is *corroborating*, not conclusive. **Confidence: MED** — anchors + count delta solid; exact patched line not pinned.

---

## 4. Pinned bg agents re-prompted "Continue from where you left off" after auto-update (NOT ISOLABLE, 2.1.193)

The resume prompt is `getResumePrompt` (`WWn`, `:371461`) — `process.env.CLAUDE_CODE_RESUME_PROMPT || "Continue from where you left off."`. It is injected on interrupted-turn resume (`:371503`, guarded by `kind === "interrupted_turn"`) and on auto-resume of a deferred tool in the print/headless path (`:706889`, which runs after `/update`). **`WWn` and both injection sites are carryover** — the function and the long-standing resume-prompt are unchanged.

The bullet describes a *guard* fix: pinned background agents should not have the resume prompt re-injected on every auto-update cycle. I could **not** isolate a clean `isPinned`/`pin`-keyed guard adjacent to the `WWn` injection in 193 vs 183 (the `pinned` symbol space is dominated by notification-pin and model-pin code, not bg-agent pin). The fix is most likely a small conditional in the auto-update/resume orchestration that does not surface as a net-new symbol. **Confidence: LOW** — site located, fix not isolable; flagged honestly rather than inventing an anchor.

---

## 5. Agent panel hiding siblings / jumping a row (UI-ONLY, NOT ISOLABLE; 2.1.193 / 2.1.191)

The "agent panel hides sibling agents when viewing a subagent" (2.1.193) and "panel jumps a row past the overflow cap" (2.1.191) fixes live in the agents-panel React component's row-selection / visible-window computation (the per-subagent status line is at `:56569`). These are **presentational** changes (which rows render), not behavioral/data deltas, and they do not isolate to a single net-new symbol via grep on the pretty-printed bundle. **Confidence: LOW (UI-only).** No fabricated anchor.

---

## 6. Channel connections dropping after `/bg` `/tui` `/update` (NOT ISOLABLE; false-delta caution, 2.1.187)

The "channel" is the live status channel for `claude agents` / remote-agent updates. The agents-view toggle and the `/tui` / `/bg` slash handling are present, but the actual agents-channel teardown/reconnect on view navigation could not be isolated to a clean 193-specific patch.

**False-delta caution:** the obvious `EventSource` sites in the bundle are the **feature-gate / StatSig streaming SDK** (`/sub/<clientKey>`, `backgroundSync`), which is **unrelated** to the agents channel and **identical in 183** (`EventSource` count 4 = 4). Do **not** attribute the channel-drop fix to the feature-gate EventSource — that would be a false delta. **Confidence: LOW** — not isolable.

---

## Evidence summary

| # | Item | Version | 183→193 signal | Class | Confidence |
|---|------|---------|----------------|-------|:----------:|
| 1 | carry-over-aware abandoned count | 2.1.193 | "would be abandoned" 0→present; `oUo = total − H7t` | ISOLABLE | HIGH |
| 2 | bg launch result drops "end your response" | 2.1.193 | both async_launched branches lose the directive (cloud unchanged) | ISOLABLE body-change | HIGH |
| 3 | phantom "general-purpose (resumed)" subagent | 2.1.193 | `main-session` guard 9→10; `Lgl` defaults | PARTIAL | MED |
| 4 | pinned re-prompt after auto-update | 2.1.193 | `WWn` carryover; guard not isolable | NOT ISOLABLE | LOW |
| 5 | panel hides siblings / jumps a row | 2.1.193/191 | UI render only | UI-ONLY | LOW |
| 6 | channel drops after `/bg /tui /update` | 2.1.187 | EventSource = feature-gate SDK (false delta) | NOT ISOLABLE | LOW |

---

## Cross-links

- Sibling 193 docs: [`bg_shell_pressure_reap.md`](./bg_shell_pressure_reap.md), [`subagent_depth_tracking.md`](./subagent_depth_tracking.md), [`agent_stop_lifecycle.md`](./agent_stop_lifecycle.md), [`README.md`](./README.md).
- 183 tree (canonical for the unchanged `/bg` flow, dispatcher, classifier, and agents-view): [`../../../claude_code_v_2.1.183/analyze/36_background_agents/README.md`](../../../claude_code_v_2.1.183/analyze/36_background_agents/README.md); `/bg` flow baseline [`../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md).

## Related Symbols

> Symbol mappings live in the symbol index files (list format, never a mapping table):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)
> - per-feature additions: [symbol_additions_v2_1_193_background_agents.md](../00_overview/symbol_additions_v2_1_193_background_agents.md)

Key functions/constants in this document:

- `countAbandonedBgTasks` (obf: `oUo`, `:578073`) — `countBackgroundTasks − countCarryOverTasks`; the spurious-warning fix.
- `computeCarryOverMap` (obf: `fze`, `:578006`) — per-subtree all-or-nothing adoptability map.
- `countCarryOverTasks` (obf: `H7t`, `:578070`) / `countBackgroundTasks` (obf: `y_t`, `:485964`) — the two count inputs.
- `registerCompletedResumedAgent` (obf: `Lgl`, `:454100`) — source of the "general-purpose (resumed)" card defaults.
- `readJobDir` (obf: `JKl`, `:577927`) / `linkAdoptedAgentTranscript` (obf: `QKl`, `:577951`) — the adoption loop helpers (`:688699`).
- `getResumePrompt` (obf: `WWn`, `:371461`) — `"Continue from where you left off."`; carryover (pinned-guard not isolable).
- `main-session` sentinel (`:441096`; filters `:453732`/`:453735`/`:578022`) — guard count 9→10 across the window.
