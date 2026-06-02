# Workflow Gate, Keyword, Caps, Journal, Lifecycle, Ultracode & Coordinator

> Module: `42_workflow` — Dynamic Workflows (FLAGSHIP, new in 2.1.154)
> Build under analysis: Claude Code **v2.1.156**
> Source: `cli_inner_pretty.js` (single pretty-printed bundle; every line citation is a verified read)
> Companion to `workflow_tool_definition.md` (tool object / schema / description / meta parser). This doc
> covers everything *around* the tool: the enablement gate, the keyword opt-in, the runtime resource caps,
> the resume journal, the launch→flush→completion lifecycle + telemetry, the `/workflows` UI and save flow,
> the `ultracode` standing-orchestration mode, and the coordinator-prompt integration.

## Related Symbols

> Symbol mappings live in the central index (never in this doc):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Tools, LLM API)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (**Workflows**, Plan, Hooks, Skills, Compact)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP, Permissions, Sandbox, Auth)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (LSP, IDE, UI, Plugin)

Key symbols in this document (full table is in `symbol_index_core_features.md`):

**Gate / enablement**
- `isWorkflowsEnabled` (`NZ`) — session-level enabled predicate, gates tool/command/UI/coordinator (cli_inner_pretty.js:184757-184763)
- `isWorkflowsManagedDisabled` (`H48`) — hard-off via env or managed `disableWorkflows` (cli_inner_pretty.js:184750-184752)
- `resolveWorkflowAvailabilityCached` (`KP6`) — memoizes `SL5()` into `$48` (cli_inner_pretty.js:184776-184778)
- `resolveWorkflowAvailability` (`SL5`) — `{available, defaultOn}` from env + Statsig gate + tier (cli_inner_pretty.js:184780-184788)
- `getWorkflowDefaultOn` (`qP6`) — `KP6().defaultOn` (cli_inner_pretty.js:184764-184766)
- `isWorkflowsPolicyAllowed` (`r$7`) — Statsig `allow_workflows` gate check (cli_inner_pretty.js:184770-184772)
- `getUserWorkflowSetting` (`hL5`) — user `enableWorkflows` setting override (cli_inner_pretty.js:184773-184775)
- `WORKFLOW_TOOL_NAME` (`mx`) — the string `"Workflow"` (cli_inner_pretty.js:216291)

**Keyword opt-in**
- `findWorkflowKeyword` (`pg6`) — match `workflows?` outside code spans (cli_inner_pretty.js:172-… via `Bg6`) (cli_inner_pretty.js:412172-412174)
- `matchKeyword` (`Bg6`) — generic keyword matcher with code-span masking (cli_inner_pretty.js:412125-412165)
- `hasWorkflowKeyword` (`lj4`) — `pg6(text).length > 0` (cli_inner_pretty.js:412178-412180)
- `makeWorkflowKeywordReminder` (`KR_`) — emits `tengu_workflow_keyword` + `workflow_keyword_request` (cli_inner_pretty.js:412916-412919)

**Consent / usage warning**
- `workflowNeedsUsageConsentPrompt` (`r0_`) — gate for showing the one-time usage warning (cli_inner_pretty.js:378645-378653)
- `recordWorkflowUsageConsent` (`o0_`) — persists `skipWorkflowUsageWarning`, emits accept event (cli_inner_pretty.js:378654-378662)
- `hasWorkflowUsageConsent` (`sF$`) — checks `skipWorkflowUsageWarning` across settings scopes (cli_inner_pretty.js:53591-53598)

**Resource caps**
- `WORKFLOW_AGENT_CAP` (`F74`) — `1000` agent-call ceiling (cli_inner_pretty.js:375678)
- `WorkflowAgentCapError` (`Q74`) — error thrown at the agent cap (cli_inner_pretty.js:375740-375745)
- `WorkflowBudgetExceededError` (`fW8`) — error thrown when the token budget is spent (cli_inner_pretty.js:375746-375753)
- `computeWorkflowConcurrency` (`dG_`) — `min(16, max(2, cores-2))` (cli_inner_pretty.js:374930-374932)
- `WORKFLOW_STALL_MS_DEFAULT` (`tG_`) — `180000` (3 min) per-agent stall timeout (cli_inner_pretty.js:375699)
- `WORKFLOW_PARALLEL_DEFAULT` (`cG_`) — concurrency limit (semaphore width) for the **local** agent executor `R`, seeded from CPU count (cli_inner_pretty.js:375676, 375735)
- `WORKFLOW_REMOTE_DEFAULT` (`lG_`) — `50`; semaphore width for the **remote** agent executor `U` (`b = BiH(lG_, U)`, 375002), which throws "not available in this build" (375083). It is **not** a pipeline knob (see Part 3.3 correction) (cli_inner_pretty.js:375677)

**Journal / respawn / snapshot**
- `LocalFileJournal` (`bp6`) — append-only `journal.jsonl` per run (cli_inner_pretty.js:374871-374906)
- `indexJournal` (`x74`) — folds journal lines into `{results, started}` maps (cli_inner_pretty.js:374835-374846)
- `journalKey` (`m74`) — SHA-256 cache key of `(prompt, opts, phase)` (cli_inner_pretty.js:374867-374870)
- `canonicalizeAgentOpts` (`gG_`) — stable JSON of cache-relevant opts (cli_inner_pretty.js:374847-374866)
- `writeWorkflowSnapshot` (`C74`) — writes the run snapshot JSON for `/workflows` (cli_inner_pretty.js:374771-374780)
- `listWorkflowSnapshots` (`b74`) — reads + sorts run snapshots (cli_inner_pretty.js:374781-374826)
- `registerSessionHook` (`gtH`) — generic session-hook registrar used for the StructuredOutput nudge (cli_inner_pretty.js:372079-372083)

**Lifecycle / telemetry / UI**
- `workflowTool.call` (anonymous `call`) — launches the background run, emits launched/completed (cli_inner_pretty.js:378336-378561)
- `runWorkflowScript` (`q44`) — executes the VM script, returns result/agentCount/logs (cli_inner_pretty.js:376007-376061)
- `emitTaskProgress` (`TrH`) — flushes a `task_progress` system message to the UI (cli_inner_pretty.js:278050-278063)
- `getBuiltinWorkflows` (`o74`) — built-in workflow list (`r74`, empty in this build) (cli_inner_pretty.js:375876-375882)
- `saveWorkflow` (`$Q4`) — persists a named workflow, emits `tengu_workflow_saved` (cli_inner_pretty.js:507621-507643)
- `workflowsCommand` (`Pjz`) — `/workflows` local-jsx slash command (cli_inner_pretty.js:538934-538942)
- `WorkflowHistoryDialog` (`gt4`) — `/workflows` viewer component (cli_inner_pretty.js:538403-538797)

**Ultracode / effort**
- `isUltracodeOn` (`zP6`) — reads `i6().ultracode === true`, unpins launch effort (cli_inner_pretty.js:184884-184888)
- `supportsXhighEffort` (`ycH`) — model supports `xhigh` effort (Opus 4.8 / 4.7) (cli_inner_pretty.js:184834-184852)
- `isWorkflowKeywordOrUltracodeEffort` (`ar`) — `q && NZ() && resolveEffort()==="xhigh"` (cli_inner_pretty.js:184856-184858)
- `resolveEffort` (`or`) — effort resolution chain returning `"xhigh"` etc. (cli_inner_pretty.js:184909-184919)

**Coordinator**
- `getCoordinatorSystemPrompt` (`Dk5`) — coordinator system prompt with NZ-gated Workflow clause (cli_inner_pretty.js:216506-216514+)

---

## TL;DR

This document maps the **control plane** of Dynamic Workflows — everything that decides *whether* a workflow may run, *when* the model is allowed to call the tool, *how* a running script is bounded, *how* it survives a restart, and *how* its progress reaches the user.

```
                       ┌──────────────────────────────────────────────┐
   ENABLEMENT GATE     │ NZ() = !H48() && r$7() && KP6().available     │
   (per session)       │        && (hL5() ?? defaultOn)                │
                       └──────────────────────────────────────────────┘
                                          │ true
                                          ▼
   OPT-IN (per turn)   keyword "workflow(s)" → KR_ → workflow_keyword_request reminder
                       OR ultracode on (standing) OR explicit user ask OR skill/command
                                          │
                                          ▼
   CONSENT (first use) r0_? → one-time usage warning → o0_ persists skipWorkflowUsageWarning
                                          │
                                          ▼
   LAUNCH              workflowTool.call → tengu_workflow_launched → q44(VM) in background
                                          │
                       ┌──────────────────┴──────────────────┐
   RUNTIME CAPS        │ agent-cap F74=1000 → Q74             │
                       │ token budget → fW8                   │  + journal bp6 (resume)
                       │ local concurrency cG_=min(16,cores-2)│  + stall tG_=180s
                       │ (remote lG_=50 — remote disabled)    │
                       └──────────────────┬──────────────────┘
                                          ▼
   FLUSH              TrH(task_progress) ~16ms-batched → UI progress tree + /workflows
                                          ▼
   COMPLETION         tengu_workflow_completed (+ per-phase tengu_workflow_phase_completed)
                      C74 snapshot → /workflows history; <task-notification> to the model
```

**NEW-post-2.1.88 verdict (confidence: high, with one nuance):** The *runtime* — `agent()`/`pipeline()`/`parallel()` execution VM, the `LocalFileJournal` resume protocol, the agent/budget/stall caps, `ultracode`, the keyword opt-in, the `/workflows` viewer and the consent warning — is entirely new in 2.1.154. **However**, scaffolding existed in 2.1.88 behind the ant-only `WORKFLOW_SCRIPTS` build feature gate: `src/tools/WorkflowTool/WorkflowTool.js`, `WorkflowPermissionRequest.js` and `src/components/tasks/WorkflowDetailDialog.js` are referenced via `feature('WORKFLOW_SCRIPTS') ? require(...) : null` (e.g. `src/components/permissions/PermissionRequest.tsx:38-39`, `src/tools.ts:129`, `src/commands.ts:86`, `src/tasks.ts:9`), but the actual source files are stripped from the public tree. So 2.1.156 is the **GA of an internal-only prototype**, not a from-scratch feature. The **coordinator** (`Dk5`) has a clear precursor — `src/coordinator/coordinatorMode.ts` — but its Workflow clause is new.

---

# Part 1 — The Enablement Gate

## 1.1 `isWorkflowsEnabled` (`NZ`) — the master switch

**What it does:** `NZ()` is the single predicate every workflow surface keys off: the tool's `isEnabled`, the `/workflows` command's `isEnabled`, the keyword reminder, the input highlighter, and the coordinator's Workflow clause all call it. If it returns false, dynamic workflows are invisible.

**How it works (step-by-step):**

```javascript
// ============================================
// isWorkflowsEnabled - Master per-session predicate gating every workflow surface
// Location: cli_inner_pretty.js:184757-184763
// ============================================

// ORIGINAL (for source lookup):
function NZ() {
  if (H48()) return !1;
  if (!r$7()) return !1;
  let { available: H, defaultOn: $ } = KP6();
  if (!H) return !1;
  return hL5() ?? $;
}

// READABLE (for understanding):
function isWorkflowsEnabled() {
  if (isWorkflowsManagedDisabled()) return false;        // env/managed hard-off wins
  if (!isWorkflowsPolicyAllowed()) return false;         // Statsig allow_workflows gate
  let { available, defaultOn } = resolveWorkflowAvailabilityCached();
  if (!available) return false;                          // env/gate/tier says unavailable
  return getUserWorkflowSetting() ?? defaultOn;          // user setting overrides, else default
}

// Mapping: NZ→isWorkflowsEnabled, H48→isWorkflowsManagedDisabled, r$7→isWorkflowsPolicyAllowed,
//          KP6→resolveWorkflowAvailabilityCached, hL5→getUserWorkflowSetting
```

The order is deliberate — it is a **precedence ladder**, evaluated cheapest-and-most-authoritative first:

1. `isWorkflowsManagedDisabled()` (`H48`, cli_inner_pretty.js:184750-184752) — `xH(process.env.CLAUDE_CODE_DISABLE_WORKFLOWS) || UV()?.settings.disableWorkflows === true`. This is the **enterprise kill switch**: a managed/policy setting or the env var hard-disables workflows and nothing downstream can re-enable them.
2. `isWorkflowsPolicyAllowed()` (`r$7`, cli_inner_pretty.js:184770-184772) — `k7("allow_workflows")`, the server-controlled Statsig gate. If the org isn't entitled, stop.
3. `resolveWorkflowAvailabilityCached().available` — env/launch-gate/tier availability (see `SL5` below).
4. `getUserWorkflowSetting() ?? defaultOn` — the user's `enableWorkflows` setting (the "Dynamic workflows" toggle in `/config`) takes precedence; if unset, fall back to the tier-derived default.

**Why this approach:** Splitting "managed hard-off", "org gate", "availability", and "user preference" into four separate predicates means each layer is independently auditable and a higher layer can never be silently overridden by a lower one. The `?? defaultOn` at the end is the key UX nuance: a Pro user gets workflows *available but off by default*; everyone else gets them *on by default* (see `SL5`), and either can be flipped explicitly.

**Key insight:** `NZ()` is the choke point. Because the tool's `isEnabled: () => NZ()` (cli_inner_pretty.js:378222), the command's `isEnabled: () => NZ()` (cli_inner_pretty.js:538939), and `validateInput` re-checking `!NZ()` (cli_inner_pretty.js:378245) all funnel through it, there's no surface where a workflow can leak past the gate.

## 1.2 `resolveWorkflowAvailability` (`SL5`) and the memo (`KP6`)

**What it does:** `resolveWorkflowAvailability` (`SL5`) computes `{available, defaultOn}` once, then `resolveWorkflowAvailabilityCached` (`KP6`) memoizes it in module-level `$48` so the env/gate/tier decision is stable for the session. `SL5` is the *availability resolver*; `KP6` is the thin caching wrapper that `NZ()` actually calls.

```javascript
// ============================================
// resolveWorkflowAvailability - {available, defaultOn} from env + Statsig + tier
// Location: cli_inner_pretty.js:184780-184788
// ============================================

// ORIGINAL (for source lookup):
function SL5() {
  if (xH(process.env.CLAUDE_CODE_WORKFLOWS)) {
    let $ = V$("tengu_workflows_enabled", !0);
    return { available: $, defaultOn: $ };
  }
  if (k4(process.env.CLAUDE_CODE_WORKFLOWS)) return { available: !1, defaultOn: !1 };
  if (!V$("tengu_workflows_enabled", !0)) return { available: !1, defaultOn: !1 };
  return { available: !0, defaultOn: _4() !== "pro" };
}

// READABLE (for understanding):
function resolveWorkflowAvailability() {
  if (isEnvTrue(process.env.CLAUDE_CODE_WORKFLOWS)) {
    let gateOn = checkGate("tengu_workflows_enabled", true);   // env-true still respects the gate
    return { available: gateOn, defaultOn: gateOn };
  }
  if (isEnvFalse(process.env.CLAUDE_CODE_WORKFLOWS)) return { available: false, defaultOn: false };
  if (!checkGate("tengu_workflows_enabled", true)) return { available: false, defaultOn: false };
  return { available: true, defaultOn: getTier() !== "pro" };   // GA: on by default except Pro
}

// Mapping: SL5→resolveWorkflowAvailability, xH→isEnvTrue, k4→isEnvFalse, V$→checkGate, _4→getTier
```

**How it works — the four branches:**
1. **`CLAUDE_CODE_WORKFLOWS` explicitly true** → availability AND defaultOn both equal the Statsig `tengu_workflows_enabled` gate. The env var forces *opt-in intent* but still defers to the org gate for the kill-switch — you can't override an org that disabled the feature.
2. **`CLAUDE_CODE_WORKFLOWS` explicitly false** → `{false, false}`. Hard local opt-out.
3. **env unset + gate off** → `{false, false}`.
4. **env unset + gate on** → `{available: true, defaultOn: tier !== "pro"}`. This is the GA path: everyone with the gate gets workflows available; **Pro accounts default OFF**, all other tiers default ON.

**Why memoize (`KP6`):** `SL5` reads env vars, a Statsig gate, and the subscription tier — none of which change mid-session. Memoizing into `$48` (cli_inner_pretty.js:184776-184778, `var $48` at 184789) avoids re-hitting the gate cache on every `NZ()` call (which fires on every turn for the keyword reminder and the input highlighter). The tradeoff: a mid-session gate flip won't take effect until restart — acceptable because availability is a launch-time entitlement, not a runtime toggle.

**Why Pro defaults off:** Workflows can spawn up to 1000 agents (see Part 3). For the cheapest tier the team chose *available-but-explicit*; for higher tiers the orchestration affordance is on by default. The user toggle `enableWorkflows` (read by `getUserWorkflowSetting`, `hL5`, cli_inner_pretty.js:184773-184775) lets a Pro user opt in or a higher-tier user opt out, and it wins over `defaultOn` via the `??` in `NZ`.

---

# Part 2 — Keyword Opt-In, Reminder, Dismiss/Restore & Consent

## 2.1 Why a keyword at all

The Workflow tool description (cli_inner_pretty.js:376081) is blunt: *"ONLY call this tool when the user has explicitly opted into multi-agent orchestration … the user must request that scale, not have it inferred."* The team's central design decision is that a tool that can spend a *large* amount of tokens across hundreds of agents must never fire on inference alone. Opt-in is one of: the literal keyword `workflow`/`workflows`, ultracode being on, the user asking in their own words, or a skill/command instructing it.

The keyword path is the lightweight, per-turn version of that opt-in — and it's surfaced **three ways** for one user action: a system-reminder to the model, a shimmer highlight on the keyword in the input box, and a dismissible toast.

## 2.2 `findWorkflowKeyword` (`pg6`) — matching `workflows?` without false positives

`pg6(text)` (cli_inner_pretty.js:412172-412174) is `Bg6(text, "workflows?")` — the generic keyword matcher `Bg6` (cli_inner_pretty.js:412125-412165) applied to the regex `workflows?` (matches both "workflow" and "workflows"). `Bg6` is shared with `ultraplan` (`OG8`, 412166) and `ultrareview` (`dj4`, 412169).

**How `Bg6` avoids false positives (the clever part):**

```javascript
// ============================================
// matchKeyword - Find a keyword in user text, ignoring code spans and path-like contexts
// Location: cli_inner_pretty.js:412125-412165
// ============================================

// ORIGINAL (for source lookup):
function Bg6(H, $) {
  if (!new RegExp($, "i").test(H)) return [];
  if (H.startsWith("/")) return [];
  let K = [], _ = null, z = 0, A = (M) => !!M && /[\p{L}\p{N}_]/u.test(M);
  for (let M = 0; M < H.length; M++) { /* …scan & record code-span ranges in K… */ }
  let Y = [], f = new RegExp(`\\b${$}\\b`, "gi"), O = H.matchAll(f);
  for (let M of O) {
    let j = M.index, w = j + M[0].length;
    if (K.some((X) => j >= X.start && j < X.end)) continue;        // inside a code span → skip
    let D = H[j - 1], J = H[w];
    if (D === "/" || D === "\\" || D === "-") continue;            // path/flag prefix → skip
    if (J === "/" || J === "\\" || J === "-" || J === "?") continue; // path/flag suffix → skip
    if (J === "." && A(H[w + 1])) continue;                        // "workflow.foo" → skip
    Y.push({ word: M[0], start: j, end: w });
  }
  return Y;
}

// READABLE (for understanding):
function matchKeyword(text, keywordRegex) {
  if (!new RegExp(keywordRegex, "i").test(text)) return [];
  if (text.startsWith("/")) return [];                             // slash commands are not prose
  let codeSpans = scanCodeSpansAndQuotes(text);                    // `…`, "…", <…>, {…}, […], (…), '…'
  let matches = [];
  for (let m of text.matchAll(new RegExp(`\\b${keywordRegex}\\b`, "gi"))) {
    if (insideAny(codeSpans, m.index)) continue;
    let before = text[m.index - 1], after = text[m.index + m[0].length];
    if (isPathOrFlagChar(before) || isPathOrFlagChar(after)) continue;
    matches.push({ word: m[0], start: m.index, end: m.index + m[0].length });
  }
  return matches;
}

// Mapping: Bg6→matchKeyword, $→keywordRegex, K→codeSpans, A→isWordChar
```

**Why this approach:** A naive `\bworkflows?\b` would fire on `.github/workflows/ci.yml`, on `<workflow>` XML, on a fenced code block containing the word, or on `--workflow-id`. `Bg6` first masks all bracketed/quoted/backticked spans (the `gj4` delimiter map at 412191: `` ` `` "" `` <> {} [] () '' ``), then rejects matches adjacent to `/ \ -` (paths and flags) or followed by `.word` (member access / filename). The result is that only the *word used as English prose* triggers the opt-in.

**Key insight:** The shared `Bg6` engine is why `workflow`, `ultraplan`, and `ultrareview` all behave identically w.r.t. code-span masking — one matcher, three keywords. The single-quote handling (only treat `'` as a quote when not surrounded by word chars, 412140/412144) is there so contractions like "don't" don't open a phantom string span.

## 2.3 The reminder: `KR_` → `workflow_keyword_request`

When the user's prompt contains the keyword, the system-reminder pipeline injects a meta message telling the model to use the tool:

```javascript
// ============================================
// makeWorkflowKeywordReminder - Emit telemetry + workflow_keyword_request reminder
// Location: cli_inner_pretty.js:412916-412919
// ============================================

// ORIGINAL (for source lookup):
function KR_(H) {
  if (!H || !lj4(H)) return [];
  return (d("tengu_workflow_keyword", {}), [{ type: "workflow_keyword_request" }]);
}

// READABLE (for understanding):
function makeWorkflowKeywordReminder(promptText) {
  if (!promptText || !hasWorkflowKeyword(promptText)) return [];
  logEvent("tengu_workflow_keyword", {});
  return [{ type: "workflow_keyword_request" }];
}

// Mapping: KR_→makeWorkflowKeywordReminder, lj4→hasWorkflowKeyword, d→logEvent
```

This reminder is registered in the reminder pipeline only when `NZ()` is true and the turn is a *regular user prompt* that hasn't suppressed the keyword (cli_inner_pretty.js:412709-412715):

```javascript
...(NZ() ? [E3("workflow_keyword_request", () =>
    Promise.resolve(A?.isRegularUserPrompt && !A.suppressWorkflowKeyword
      ? KR_(A.preExpansionInput ?? H) : [])), …] : [])
```

Note it matches against `preExpansionInput` — the *raw* text the user typed, before slash-command/skill expansion — so an expanded macro can't accidentally inject or strip the keyword. The reminder text the model finally sees (the renderer for `workflow_keyword_request`, cli_inner_pretty.js:446731-446738) is:

> *"The user included the keyword "workflow" or "workflows", which means you should use the Workflow tool to fulfill their request."*

## 2.4 Input highlight + dismiss/restore (`alt+w`)

Inside the prompt editor, `o1 = useMemo(() => NZ() ? pg6(r1) : [], [r1])` (cli_inner_pretty.js:584681) computes the keyword spans, and `[__ , C3] = useState(false)` plus `nK = useRef(false)` hold the per-prompt **ignored** flag (cli_inner_pretty.js:584682-584683). `D_ = u1("chat:workflowKeywordToggle", "Chat", "alt+w")` (cli_inner_pretty.js:584684) is the configurable keybinding shown in the toast.

When not ignored, every character of the keyword gets the shimmer treatment (cli_inner_pretty.js:584763-584772) — the same shimmer used for ultrathink/ultraplan — and a toast says *"Dynamic workflow requested for this turn · alt+w to ignore"* with a 30s timeout (cli_inner_pretty.js:584806-584814).

The toggle handler implements **dismiss → restore** with telemetry on both edges:

```javascript
// ============================================
// toggleWorkflowKeywordIgnored - alt+w dismiss/restore of the per-prompt workflow keyword
// Location: cli_inner_pretty.js:584818-584830
// ============================================

// ORIGINAL (for source lookup):
let UJ = Jq.useCallback(() => {
  if (o1.length === 0) return;
  let k$ = !nK.current;
  if ((C3(k$), (nK.current = k$), k$))
    (d("tengu_workflow_keyword_dismissed", {}),
      S5({ key: "workflow-keyword-ignored",
           text: `Workflow keyword ignored for this prompt${D_ ? ` · ${D_} to undo` : ""}`,
           priority: "immediate", timeoutMs: 5000 }));
  else (d("tengu_workflow_keyword_restored", {}), N9("workflow-keyword-ignored"));
}, [o1.length, D_, S5, N9]);

// READABLE (for understanding):
let toggleWorkflowKeywordIgnored = useCallback(() => {
  if (keywordSpans.length === 0) return;                  // nothing to toggle
  let nextIgnored = !ignoredRef.current;
  setIgnored(nextIgnored); ignoredRef.current = nextIgnored;
  if (nextIgnored) {
    logEvent("tengu_workflow_keyword_dismissed", {});
    addNotification({ key: "workflow-keyword-ignored",
      text: `Workflow keyword ignored for this prompt${shortcut ? ` · ${shortcut} to undo` : ""}`,
      priority: "immediate", timeoutMs: 5000 });
  } else {
    logEvent("tengu_workflow_keyword_restored", {});
    removeNotification("workflow-keyword-ignored");       // back to the "requested" shimmer
  }
}, [keywordSpans.length, shortcut, addNotification, removeNotification]);

// Mapping: UJ→toggleWorkflowKeywordIgnored, o1→keywordSpans, __→ignored (state), nK→ignoredRef,
//          C3→setIgnored, D_→shortcut, S5→addNotification, N9→removeNotification
```

A reset effect (cli_inner_pretty.js:584815-584817) clears the ignored flag when the keyword spans disappear (`o1.length === 0 && __`) — i.e. if the user deletes the word, the ignore state is forgotten so the next typing of "workflow" starts fresh.

**Why a per-prompt dismiss exists:** A user might legitimately *talk about* workflows ("our CI workflow is broken") without wanting to launch one. Rather than make the matcher even more conservative, the team made the highlight **cheap to dismiss** (one keybind) and **reversible**, with telemetry on both `dismissed` and `restored` so they can measure false-positive rate. Critically, dismissing only suppresses the *highlight/toast*; the actual suppression of the model-facing reminder is the separate `suppressWorkflowKeyword` flag on the prompt (412713).

## 2.5 First-use consent — `r0_` / `o0_`

The keyword/opt-in gets the model to *call* the tool; a separate **one-time usage warning** gets the human's informed consent the first time. `workflowNeedsUsageConsentPrompt` (`r0_`) decides whether to show it:

```javascript
// ============================================
// workflowNeedsUsageConsentPrompt - Whether to show the one-time workflow usage warning
// Location: cli_inner_pretty.js:378645-378653
// ============================================

// ORIGINAL (for source lookup):
function r0_(H, $) {
  if (H !== mx) return !1;
  if ($.options.isNonInteractiveSession) return !1;
  if (T6($).shouldAvoidPermissionPrompts) return !1;
  if (v7()) return !1;
  if (XhH()) return !1;
  if (ar($.options.mainLoopModel, k3($), WW8($))) return !1;
  return !sF$();
}

// READABLE (for understanding):
function workflowNeedsUsageConsentPrompt(toolName, ctx) {
  if (toolName !== WORKFLOW_TOOL_NAME) return false;          // only for Workflow calls
  if (ctx.options.isNonInteractiveSession) return false;      // no prompts in -p/headless
  if (toolPermissionContext(ctx).shouldAvoidPermissionPrompts) return false;
  if (isBypassPermissionsMode()) return false;
  if (isSomeWarningSuppressedState()) return false;
  if (isWorkflowKeywordOrUltracodeEffort(ctx.options.mainLoopModel, …)) return false; // ultracode already implies consent
  return !hasWorkflowUsageConsent();                          // not yet accepted
}

// Mapping: r0_→workflowNeedsUsageConsentPrompt, mx→WORKFLOW_TOOL_NAME, ar→isWorkflowKeywordOrUltracodeEffort, sF$→hasWorkflowUsageConsent
```

Acceptance is persisted by `recordWorkflowUsageConsent` (`o0_`, cli_inner_pretty.js:378654-378662): it writes `skipWorkflowUsageWarning: true` to `userSettings` and emits `tengu_workflow_usage_warning_accepted`. The check `hasWorkflowUsageConsent` (`sF$`, cli_inner_pretty.js:53591-53598) reads that flag across `userSettings`/`localSettings`/`flagSettings`/`policySettings`, so an org can pre-accept it via policy.

**Why two consent layers:** Opt-in (keyword/ultracode) answers *"does the user want orchestration this turn?"*; the usage warning answers *"does the user understand workflows spend a lot of tokens?"* — a one-time education prompt. The `ar(...) ` short-circuit at 378651 is the tell that **ultracode is itself a consent**: if the session is in ultracode (xhigh + standing orchestration), the user has already opted into expensive runs, so the warning is skipped.

---

# Part 3 — Runtime Resource Caps

All four caps live in the VM bridge factory `g74` (cli_inner_pretty.js:374939+) and its constants block (cli_inner_pretty.js:375675-375700). They exist because a *deterministic JavaScript script* can trivially contain an unbounded loop, and each `agent()` iteration spends real tokens.

## 3.1 Agent-call cap — `F74 = 1000` → `Q74`

```javascript
// ============================================
// enforceAgentCap - Hard ceiling of 1000 agent() calls per workflow run
// Location: cli_inner_pretty.js:374969-374973 (constant 375678; error class 375740-375745)
// ============================================

// ORIGINAL (for source lookup):
function W() {
  if (O < F74) return;
  if (!D) ((D = !0), d("tengu_workflow_agent_cap_exceeded", { agentCount: O }));
  throw new Q74();
}
// …
F74 = 1000,
Q74 = class Q74 extends Error {
  constructor() { super(nG_); this.name = "WorkflowAgentCapError"; }
};

// READABLE (for understanding):
function enforceAgentCap() {
  if (agentCount < WORKFLOW_AGENT_CAP) return;                       // 1000
  if (!agentCapEventEmitted) { agentCapEventEmitted = true;
    logEvent("tengu_workflow_agent_cap_exceeded", { agentCount }); }
  throw new WorkflowAgentCapError();
}

// Mapping: W→enforceAgentCap, O→agentCount, F74→WORKFLOW_AGENT_CAP, D→agentCapEventEmitted,
//          Q74→WorkflowAgentCapError, nG_→agentCapErrorMessage
```

The error message `nG_` (cli_inner_pretty.js:375736-375739) is diagnostic gold: *"Workflow agent() call cap reached (1000). This usually means a loop using budget.remaining() never terminates because no token budget was set — remaining() returns Infinity when budget.total is null. Add a hard iteration cap to the loop, or pass a token budget."* — i.e. the cap exists precisely to catch the common `while (budget.remaining() > 0)` infinite loop when no budget was set.

`W()` (the cap check) and `G()` (the budget check) are both called at the top of every `agent()` invocation (cli_inner_pretty.js:375006: `(W(), G())`), and the telemetry `D`/`J` guards ensure the cap/budget event fires **once** per run, not once per over-limit call.

## 3.2 Token budget — `fW8`

```javascript
// ============================================
// enforceTokenBudget - Stop new agent() calls once the run's output-token budget is spent
// Location: cli_inner_pretty.js:374974-374980 (error class 375746-375753)
// ============================================

// ORIGINAL (for source lookup):
function G() {
  if (A?.total == null || A.total <= 0) return;
  let c = A.getTurnSpent();
  if (c < A.total) return;
  if (!J) ((J = !0), d("tengu_workflow_budget_cap_exceeded", { spent: c, budget: A.total, agentCount: O }));
  throw new fW8(c, A.total);
}
// …
fW8 = class fW8 extends Error {
  constructor(H, $) {
    super(`Workflow token budget exceeded (${H.toLocaleString()} / ${$.toLocaleString()} output tokens). ` +
          `Stopping further agent() calls. In-flight agents will complete; their results are preserved.`);
    this.name = "WorkflowBudgetExceededError";
  }
};

// READABLE (for understanding):
function enforceTokenBudget() {
  if (budget?.total == null || budget.total <= 0) return;            // no budget set → no cap
  let spent = budget.getTurnSpent();
  if (spent < budget.total) return;
  if (!budgetCapEventEmitted) { budgetCapEventEmitted = true;
    logEvent("tengu_workflow_budget_cap_exceeded", { spent, budget: budget.total, agentCount }); }
  throw new WorkflowBudgetExceededError(spent, budget.total);
}

// Mapping: G→enforceTokenBudget, A→budget, fW8→WorkflowBudgetExceededError, J→budgetCapEventEmitted
```

The budget object is seeded in the tool's `call` from the session's turn-spend accounting: `E = UD() - Wu8()` (turn start) and `S = { total: Zu8(), getTurnSpent: () => UD() - E }` (cli_inner_pretty.js:378391-378392; `Wu8` 2501-2503, `Zu8` 2504-2506). The VM exposes this to scripts as `budget.total` / `budget.spent` / `budget.remaining()`, where `remaining()` returns `Infinity` when `total` is null (cli_inner_pretty.js:375977-375979) — exactly the footgun the agent-cap message warns about.

**Why throw rather than silently stop:** Throwing `Q74`/`fW8` unwinds the script's call stack, which means in-flight `agent()` promises already running are left to settle (their results are preserved via the journal), while no *new* agents start. The error message explicitly reassures: *"In-flight agents will complete; their results are preserved."*

## 3.3 Concurrency — `dG_ = min(16, max(2, cores-2))`

```javascript
// ============================================
// computeWorkflowConcurrency - Default parallel-agent limit from CPU count
// Location: cli_inner_pretty.js:374930-374932 (seeded at 375735)
// ============================================

// ORIGINAL (for source lookup):
function dG_(H) { return Math.min(16, Math.max(2, H - 2)); }
// …
((cG_ = dG_(U74.cpus().length)), …)

// READABLE (for understanding):
function computeWorkflowConcurrency(coreCount) {
  return Math.min(16, Math.max(2, coreCount - 2));   // leave 2 cores for the host, cap at 16
}
let WORKFLOW_PARALLEL_DEFAULT = computeWorkflowConcurrency(os.cpus().length);

// Mapping: dG_→computeWorkflowConcurrency, H→coreCount, cG_→WORKFLOW_PARALLEL_DEFAULT, U74→os
```

`cG_` is the default semaphore width for **all** `agent()` fan-out (whether issued directly, from `parallel()`, or from `pipeline()`). The VM bridge wraps the **local** executor `R` in a `BiH` semaphore of width `cG_`: `let C = BiH(cG_, R)` (cli_inner_pretty.js:375001), and *every* `agent()` call routes through `C` (cli_inner_pretty.js:375086 `await C(...)`). The formula reserves two cores for the host process and the UI, floors at 2 (always allow *some* parallelism), and **caps at 16** so a 64-core machine doesn't open 62 simultaneous subagents and overwhelm the API/rate limits.

**Correction — `lG_ = 50` is the REMOTE width, not a pipeline knob.** A prior pass labeled `lG_ = 50` (cli_inner_pretty.js:375677) as "the wider default for `pipeline()` stages." That is wrong. `lG_` is the semaphore width for the **remote** executor `U`: `let b = BiH(lG_, U)` (cli_inner_pretty.js:375002). `U` is the `agent({isolation:'remote'})` path — and that path is disabled in this build: the `agent()` body throws `agent({isolation:'remote'}) is not available in this build` (cli_inner_pretty.js:375083) *before* `b`/`U` is ever invoked, so `lG_` has no observable effect here. The real `pipeline()`-vs-`parallel()` distinction is at the **DSL function level** (single `Promise.allSettled` barrier vs. per-item flow), not the semaphore choice — both DSL primitives dispatch agents through the *same* `cG_`-bounded local executor `C`. See [`workflow_runtime_and_subagents.md` §D](./workflow_runtime_and_subagents.md) for the full DSL semantics.

**Why a CPU-derived default:** Each subagent is a full query loop with its own tool execution; concurrency is bounded by local CPU for tool work (grep/read/bash) more than by the API. `min(16, cores-2)` is a pragmatic balance — enough fan-out to be fast, capped low enough to stay within typical API concurrency and to keep the progress tree legible.

## 3.4 Per-agent stall timeout — `tG_ = 180000`

`tG_ = 180000` (3 minutes, cli_inner_pretty.js:375699) is the default `stallMs`. Each agent call reads `DH = r?.stallMs != null ? Number(r.stallMs) : tG_` (cli_inner_pretty.js:375015) and arms a watchdog `F$` that aborts the agent with reason `"stalled"` if no progress arrives within the window (cli_inner_pretty.js:375211-375217). Progress resets the watchdog, but only at most every `min(stallMs*0.1, 1000)` ms (`v$`, 375210) to avoid thrash. A stalled agent is aborted, not the whole run — its slot frees for the next.

**Key insight on the cap suite:** Three of the four caps (agent-count, token-budget, stall) are *failure-mode guards* for the fact that scripts are arbitrary code; only concurrency is a *performance* knob. Together they make "the model wrote a buggy infinite-loop workflow" a bounded, recoverable event rather than a runaway token burn.

---

# Part 4 — Journal, Respawn & Snapshot (Resume)

## 4.1 Why a journal

`resumeFromRunId` is a first-class workflow feature: edit a script, re-invoke, and *unchanged* `agent()` calls return cached results instantly while only edited/new calls re-run. The tool description states the contract (cli_inner_pretty.js:376235): *"the longest unchanged prefix of agent() calls returns cached results instantly … Same script + same args → 100% cache hit."* This is **only possible because scripts must be deterministic** — `validateInput` rejects `Date.now()`/`Math.random()`/`new Date()` (cli_inner_pretty.js:378256-378262), so the same inputs always produce the same `agent()` call sequence and the same cache keys.

## 4.2 `LocalFileJournal` (`bp6`) — append-only `journal.jsonl`

```javascript
// ============================================
// LocalFileJournal - Append-only JSONL journal of agent started/result events per run
// Location: cli_inner_pretty.js:374871-374906
// ============================================

// ORIGINAL (for source lookup):
class bp6 {
  path; dirReady = !1;
  constructor(H) { this.path = AW8.join(atH(H), "journal.jsonl"); }
  async load() {
    let H;
    try { H = await stH.readFile(this.path, "utf8"); }
    catch (q) { if (P8(q)) return x74([]); throw q; }
    let $ = [];
    for (let q of H.split("\n")) { if (!q) continue;
      try { $.push(JSON.parse(q)); } catch (K) { N(`LocalFileJournal: skipping unparseable line …`); } }
    return x74($);
  }
  async append(H) {
    if (!this.dirReady) (await stH.mkdir(AW8.dirname(this.path), { recursive: !0 }), (this.dirReady = !0));
    await stH.appendFile(this.path, `${JSON.stringify(H)}\n`, "utf8");
  }
}

// READABLE (for understanding):
class LocalFileJournal {
  constructor(runId) { this.path = path.join(workflowSubagentDir(runId), "journal.jsonl"); }
  async load() {
    let raw;
    try { raw = await fs.readFile(this.path, "utf8"); }
    catch (e) { if (isENOENT(e)) return indexJournal([]); throw e; }  // no journal yet → empty index
    let entries = [];
    for (let line of raw.split("\n")) { if (!line) continue;
      try { entries.push(JSON.parse(line)); }
      catch { /* tolerate a torn last line */ } }
    return indexJournal(entries);
  }
  async append(entry) { /* lazy-mkdir then append one JSON line */ }
}

// Mapping: bp6→LocalFileJournal, x74→indexJournal, atH→workflowSubagentDir, stH→fs, P8→isENOENT
```

The journal stores two entry types — `{type:"started", key, agentId}` and `{type:"result", key, agentId, result}` — appended at the agent's start and completion (cli_inner_pretty.js:375052 and 375058). JSONL is chosen so a crash mid-run leaves a valid prefix: `load()` tolerates an unparseable (torn) last line and just skips it.

## 4.3 `indexJournal` (`x74`) — folding lines into a cache

```javascript
// ============================================
// indexJournal - Fold journal lines into results map + started-attempts map
// Location: cli_inner_pretty.js:374835-374846
// ============================================

// ORIGINAL (for source lookup):
function x74(H) {
  let $ = new Map(), q = new Map();
  for (let K of H)
    if (K.type === "result") $.set(K.key, K);
    else if (K.type === "started") { let _ = q.get(K.key); if (_) _.push(K); else q.set(K.key, [K]); }
  return { results: $, started: q };
}

// READABLE (for understanding):
function indexJournal(entries) {
  let results = new Map(), started = new Map();
  for (let e of entries)
    if (e.type === "result") results.set(e.key, e);                  // last write wins → cached result
    else if (e.type === "started") { (started.get(e.key) ?? started.set(e.key, []).get(e.key)).push(e); }
  return { results, started };
}

// Mapping: x74→indexJournal, $→results, q→started
```

`results` is the cache (key → result); `started` accumulates *every* start attempt for a key (an array), which is how respawn is detected.

## 4.4 The cache hit path & respawn detection

Inside each `agent()` call, when a journal `Y` exists (cli_inner_pretty.js:375019-375048):

1. Compute the key `KH = m74(prompt, opts, phase)`.
2. If a `result` exists for that key *and we haven't already started replaying live* (`!w`), return the cached result immediately — emit a `workflow_agent` progress event with `cached: true, state: "done"` and return `AP(result)` (cli_inner_pretty.js:375021-375044). No subagent is spawned.
3. The first key with **no** cached result sets `w = true` ("we've passed the cached prefix"); from here on everything runs live. Before running, it checks `started`: if this key was previously *started but never produced a result*, that's a **respawn** — the prior run crashed mid-agent — and it emits `tengu_workflow_journal_started_hit_respawn` with the attempt count (cli_inner_pretty.js:375046-375047).

```javascript
// ============================================
// agentJournalCacheHit - Return cached result for an unchanged agent() call; detect respawn
// Location: cli_inner_pretty.js:375019-375048
// ============================================

// ORIGINAL (for source lookup):
if (Y) {
  ((KH = m74(o, r, j)), (j = KH));
  let MH = w ? void 0 : f?.results.get(KH);
  if (MH !== void 0)
    return (q({ type:"progress", toolUseID:`workflow_agent_${a}_cached`,
      data:{ type:"workflow_agent", …, state:"done", cached:!0, resultPreview:YSH(MH.result), … } }), AP(MH.result));
  w = !0;
  let wH = f?.started.get(KH);
  if (wH && wH.length > 0) d("tengu_workflow_journal_started_hit_respawn", { attempts: wH.length });
}

// READABLE (for understanding):
if (journalIndex) {
  cacheKey = journalKey(prompt, opts, phaseTitle);
  let cached = passedCachedPrefix ? undefined : journalIndex.results.get(cacheKey);
  if (cached !== undefined) {
    emitProgress({ state: "done", cached: true, resultPreview: truncate(cached.result), … });
    return wrapResult(cached.result);                 // instant — no subagent spawned
  }
  passedCachedPrefix = true;                          // first miss: everything after runs live
  let priorStarts = journalIndex.started.get(cacheKey);
  if (priorStarts?.length) logEvent("tengu_workflow_journal_started_hit_respawn", { attempts: priorStarts.length });
}

// Mapping: Y→journalIndex, KH→cacheKey, m74→journalKey, w→passedCachedPrefix, MH→cached, wH→priorStarts
```

The `w` ("passed cached prefix") flag is the heart of the **longest-unchanged-prefix** semantics: once any call misses the cache, the contract guarantees that everything after it re-runs live (because a changed call invalidates all downstream state), so the code stops consulting `results` entirely after the first miss.

## 4.5 The cache key — `journalKey` (`m74`)

```javascript
// ============================================
// journalKey - Deterministic SHA-256 cache key from (phase, prompt, canonical opts)
// Location: cli_inner_pretty.js:374867-374870 (opts canonicalizer 374847-374866)
// ============================================

// ORIGINAL (for source lookup):
function m74(H, $, q) {
  let K = u74.createHash("sha256").update(q).update("\x00").update(H).update("\x00").update(gG_($)).digest("hex");
  return `${QG_}:${K}`;
}

// READABLE (for understanding):
function journalKey(prompt, opts, phaseTitle) {
  let hex = crypto.createHash("sha256")
    .update(phaseTitle).update("\x00").update(prompt).update("\x00").update(canonicalizeAgentOpts(opts))
    .digest("hex");
  return `${JOURNAL_KEY_VERSION}:${hex}`;               // "v2:<sha256>"
}

// Mapping: m74→journalKey, H→prompt, $→opts, q→phaseTitle, gG_→canonicalizeAgentOpts, QG_→JOURNAL_KEY_VERSION ("v2")
```

`canonicalizeAgentOpts` (`gG_`, cli_inner_pretty.js:374847-374866) is the subtle part: it includes **only** the cache-relevant opts — `schema`, `model`, `isolation`, `agentType` — and recursively sorts object keys so `{model:'x', schema:S}` and `{schema:S, model:'x'}` hash identically. Display-only opts like `label`/`phase` are deliberately excluded, so relabeling an agent doesn't bust its cache. The `"v2"` prefix (`QG_`, cli_inner_pretty.js:374910) lets the team invalidate all journals on a format change.

## 4.6 Snapshot — `writeWorkflowSnapshot` (`C74`) — and the `/workflows` history

Separate from the journal (which enables *resume*), the **snapshot** enables the *history viewer*. On completion the `call` handler invokes `C74(runId, {...})` (cli_inner_pretty.js:378497-378518), which writes a single `<runId>.json` under the `workflows` dir:

```javascript
// ============================================
// writeWorkflowSnapshot - Persist a completed run's full record for /workflows history
// Location: cli_inner_pretty.js:374771-374780
// ============================================

// ORIGINAL (for source lookup):
async function C74(H, $) {
  try {
    let q = { runId: H, timestamp: new Date().toISOString(), ...$ }, K = FG_(H);
    (await $LH.mkdir(ASH.dirname(K), { recursive: !0, mode: 448 }),
      await $LH.writeFile(K, IH(q), { encoding: "utf8", mode: 384 }));
  } catch (q) { N(`Failed to write workflow snapshot ${H}: …`); }
}

// READABLE (for understanding):
async function writeWorkflowSnapshot(runId, record) {
  try {
    let snapshot = { runId, timestamp: new Date().toISOString(), ...record };
    let file = workflowSnapshotPath(runId);
    await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    await fs.writeFile(file, stringify(snapshot), { encoding: "utf8", mode: 0o600 });
  } catch (e) { logError(`Failed to write workflow snapshot ${runId}: …`); }
}

// Mapping: C74→writeWorkflowSnapshot, FG_→workflowSnapshotPath, $LH→fs, ASH→path
```

`listWorkflowSnapshots` (`b74`, cli_inner_pretty.js:374781-374826) reads them all back, tolerating malformed files, defaulting missing fields, and sorting newest-first by `startTime` — this is what feeds the `/workflows` viewer's completed-runs list (Part 5).

## 4.7 The StructuredOutput nudge — `registerSessionHook` (`gtH`)

When an agent has a `schema` (forced StructuredOutput), the runtime registers a `SubagentStop` session hook (cli_inner_pretty.js:375221-375236) that re-nudges the subagent if it tries to stop without calling the `StructuredOutput` tool. `gtH` is the generic registrar:

```javascript
// ============================================
// registerSessionHook - Register a transient function hook on a session event
// Location: cli_inner_pretty.js:372079-372083
// ============================================

// ORIGINAL (for source lookup):
function gtH(H, $, q, K, _, z, A) {
  let Y = A?.id || `function-hook-${Date.now()}-${Math.random()}`,
    f = { type: "function", id: Y, timeout: A?.timeout || 5000, callback: _, errorMessage: z };
  return (aK4(H, $, q, K, f), Y);
}

// READABLE (for understanding):
function registerSessionHook(setAppState, agentId, event, matcher, callback, errorMessage, opts) {
  let hookId = opts?.id || `function-hook-${Date.now()}-${Math.random()}`;
  let hook = { type: "function", id: hookId, timeout: opts?.timeout || 5000, callback, errorMessage };
  addSessionHook(setAppState, agentId, event, matcher, hook);
  return hookId;
}

// Mapping: gtH→registerSessionHook, $→agentId, q→event, _→callback, z→errorMessage, aK4→addSessionHook
```

In the workflow use (375221-375236) the callback allows the stop only after 2 attempts (`A8 >= 2`) or once the transcript contains a StructuredOutput call (`OW8(L$, iY)`, where `iY = "StructuredOutput"` at cli_inner_pretty.js:212132), with the error message *"You did not call StructuredOutput. You MUST call StructuredOutput to return your answer — the tool input IS your answer. Call it now."* This guarantees `schema`-typed `agent()` calls return a validated object rather than free text.

> The hook is only one half of StructuredOutput forcing. The other half is the **subagent system-prompt variant** (`aG_`/`oG_`) selected for `schema`-typed calls, and the StructuredOutput **tool injection** into the subagent's `availableTools`. Both are analyzed in [`workflow_runtime_and_subagents.md` §F](./workflow_runtime_and_subagents.md).

---

# Part 5 — Launch → Flush → Completion Lifecycle, Telemetry & UI

## 5.1 The `call` handler — fire-and-forget background launch

The Workflow tool's `call` (cli_inner_pretty.js:378336-378561) is structured as: validate/compile synchronously, emit `tengu_workflow_launched`, register the background task, then **return immediately** with `{status: "async_launched", taskId, runId, …}` while an IIFE drives the actual run. This is why the tool result says *"Workflow launched in background … You will be notified when it completes."*

**Launch telemetry** (cli_inner_pretty.js:378358-378368):

```javascript
// ============================================
// emitWorkflowLaunched - tengu_workflow_launched at the start of every run
// Location: cli_inner_pretty.js:378358-378368
// ============================================

// ORIGINAL (for source lookup):
d("tengu_workflow_launched", {
  invocation_mode: H.scriptPath ? "scriptPath" : H.name ? "named" : "inline",
  workflow_source: Z, workflow_name: W, workflow_description: G,
  phase_count: O.meta.phases?.length ?? 0,
  has_args: H.args != null, is_resume: H.resumeFromRunId != null,
  script_size_chars: A.length,
});

// READABLE (for understanding):
logEvent("tengu_workflow_launched", {
  invocation_mode: input.scriptPath ? "scriptPath" : input.name ? "named" : "inline",
  workflow_source: source, workflow_name, workflow_description,
  phase_count: meta.phases?.length ?? 0,
  has_args: input.args != null, is_resume: input.resumeFromRunId != null,
  script_size_chars: script.length,
});

// Mapping: d→logEvent, H→input, Z→source, W→workflow_name, G→workflow_description, O→parsed meta
```

If resuming (`resumeFromRunId != null`), the handler first prunes any non-running task with the same run ID from the registry (cli_inner_pretty.js:378371-378374) so the resumed run replaces the old one in the UI.

## 5.2 The 16ms-batched progress flush — `TrH`

Progress events from the VM (`onProgress`) are not flushed one-by-one; the handler buffers them and coalesces on a 16ms (`I = 16`) timer (cli_inner_pretty.js:378395-378422). On each flush `b()`:
- accumulated events are written to the task registry via `lB6` (the persistent progress log),
- if the task is still `running`, it calls `TrH` (`emitTaskProgress`) with the latest snapshot — description derived from the most recent `workflow_agent` event, total tokens, tool counts, and the full `workflowProgress` array.

```javascript
// ============================================
// emitTaskProgress - Flush a task_progress system message to the UI/progress tree
// Location: cli_inner_pretty.js:278050-278063
// ============================================

// ORIGINAL (for source lookup):
function TrH(H) {
  $E({ type:"system", subtype:"task_progress", task_id:H.taskId, tool_use_id:H.toolUseId,
       description:H.description, subagent_type:H.subagentType,
       usage:{ total_tokens:H.totalTokens, tool_uses:H.toolUses, duration_ms:Date.now()-H.startTime },
       last_tool_name:H.lastToolName, summary:H.summary, workflow_progress:H.workflowProgress });
}

// READABLE (for understanding):
function emitTaskProgress(p) {
  emitSystemMessage({ type:"system", subtype:"task_progress", task_id:p.taskId, tool_use_id:p.toolUseId,
    description:p.description, subagent_type:p.subagentType,
    usage:{ total_tokens:p.totalTokens, tool_uses:p.toolUses, duration_ms:Date.now()-p.startTime },
    last_tool_name:p.lastToolName, summary:p.summary, workflow_progress:p.workflowProgress });
}

// Mapping: TrH→emitTaskProgress, $E→emitSystemMessage, H→progress
```

**Why batch at 16ms:** A 1000-agent fan-out emits a torrent of progress events; flushing each would re-render the Ink progress tree thousands of times. 16ms (~60fps) coalesces them into at most one render per frame. The flush also filters out `workflow_log` entries when deciding whether to emit (cli_inner_pretty.js:378402-378403) so a chatty `log()` call doesn't force UI churn on its own. (This batching/inline-progress consolidation is the subject of the 2.1.152 changelog *"Simplified the Workflow tool's inline progress display"*; the 2.1.156 fix for the *"stray unselectable 'main' row when only a workflow is running"* lives in the task-panel renderer that consumes these `task_progress` messages.)

## 5.3 Completion telemetry — `tengu_workflow_completed` + per-phase

After `q44` returns, status is derived as `"killed" | "failed" | "completed"` (cli_inner_pretty.js:378441) and `tengu_workflow_completed` fires with agent count, total tokens, tool calls, and duration (cli_inner_pretty.js:378442-378453). For **built-in** workflows only, it then aggregates per-phase stats from the `workflow_progress` stream and emits one `tengu_workflow_phase_completed` per phase (cli_inner_pretty.js:378454-378496) — capturing tokens, tool calls, agent count, error count, and `skipCount` (agents the user skipped mid-run, distinguished by `error === "skipped by user"`, cli_inner_pretty.js:378479).

Finally it writes the snapshot (`C74`), routes the result/failure into the task registry (`nB6`/`CP8`), and posts the completion notification (`bP8`) that becomes the `<task-notification>` the model sees (cli_inner_pretty.js:378497-378557). A top-level `.catch` (378539-378557) ensures even an unexpected throw still records a `failed` task and notifies.

## 5.4 `runWorkflowScript` (`q44`) — the VM executor

`q44` (cli_inner_pretty.js:376007-376061) is the bridge between the `call` handler and the sandboxed VM. It loads the journal, builds the VM context via `H44` (which exposes `agent/parallel/pipeline/phase/log/workflow/args/budget/console`, cli_inner_pretty.js:375973-375997), runs the compiled script in the `vm` context with a sync timeout (`K.syncTimeoutMs ?? mP8`, where `mP8 = 30000` ms, cli_inner_pretty.js:367489, 376019), races it against the abort signal, and returns `{result, agentCount, logs, failures, durationMs, error?}`. Logs are capped at `H0_ = 1000` lines (declared `var H0_ = 1000` at cli_inner_pretty.js:376062, enforced at the `z.length < H0_` push at 376011).

> The compile (`BP8`), the VM-context builder (`H44`), the runner internals (`q44`), the **DSL primitive semantics** (`agent()`/`parallel()`/`pipeline()`/`phase()`/`log()`/`workflow()`), the **determinism runtime shim** (`SZ_` via `uP8` — far stronger than the `validateInput` regex), and the **workflow subagent system prompts** are all analyzed in depth in the companion doc [`workflow_runtime_and_subagents.md`](./workflow_runtime_and_subagents.md).

## 5.5 Save & the `/workflows` command/UI

**Save** — `saveWorkflow` (`$Q4`, cli_inner_pretty.js:507621-507643) writes a named workflow to `~/.claude/workflows/` (user scope) or `<project>/.claude/workflows/` (project scope, via `_1z`, 507616-507620), refuses to clobber unless `overwrite` (EEXIST → friendly error), invalidates the workflow/command caches, and emits `tengu_workflow_saved` with `{scope, overwrite, script_size_chars}`.

**Command** — `workflowsCommand` (`Pjz`, cli_inner_pretty.js:538934-538942):

```javascript
// ============================================
// workflowsCommand - /workflows local-jsx slash command, gated on NZ()
// Location: cli_inner_pretty.js:538934-538942
// ============================================

// ORIGINAL (for source lookup):
Pjz = {
  type: "local-jsx", name: "workflows", aliases: [],
  description: "Browse dynamic workflow history (running and completed)",
  isEnabled: () => NZ(),
  load: () => Promise.resolve().then(() => (lt4(), ct4)),
};

// READABLE (for understanding):
let workflowsCommand = {
  type: "local-jsx", name: "workflows", aliases: [],
  description: "Browse dynamic workflow history (running and completed)",
  isEnabled: () => isWorkflowsEnabled(),
  load: () => import("./workflowHistoryDialog"),     // lazily renders gt4 via Ljz
};

// Mapping: Pjz→workflowsCommand, NZ→isWorkflowsEnabled
```

**Viewer** — `WorkflowHistoryDialog` (`gt4`, cli_inner_pretty.js:538403-538797; the function's closing brace is at 538797, immediately before `function Ajz` at 538798). It merges two sources: **live** runs from app-state tasks (filtered to local-workflow tasks via `Djz`/`wjz`) and **completed** runs from `listWorkflowSnapshots` (`b74`, called in the mount effect at 538422), de-duplicated by `runId`, sorted newest-first (cli_inner_pretty.js:538436-538441). It has `list`/`detail` modes and auto-opens detail when there's exactly one run (538450-538453). This is the surface the 2.1.154 changelog promises: *"Run /workflows to view your runs."*

---

# Part 6 — Ultracode (Standing Orchestration)

## 6.1 What ultracode is

`ultracode` is a session-scoped boolean setting (cli_inner_pretty.js:51695-51703) described as *"xhigh effort plus standing dynamic-workflow orchestration … Requires workflows to be enabled and an xhigh-capable model."* It is deliberately **not persisted by interactive toggles** — it's provided via `--settings` or the `apply_flag_settings` control request — because it changes the agent's default behavior wholesale.

```javascript
// ============================================
// isUltracodeOn - Read session ultracode flag; unpin launch effort when on
// Location: cli_inner_pretty.js:184884-184888
// ============================================

// ORIGINAL (for source lookup):
function zP6() {
  let H = i6().ultracode === !0;
  if (H) SI();
  return H;
}

// READABLE (for understanding):
function isUltracodeOn() {
  let on = sessionSettings().ultracode === true;
  if (on) unpinLaunchEffort();        // ultracode forces xhigh, so clear any opus-4-7/4-8 launch pin
  return on;
}

// Mapping: zP6→isUltracodeOn, i6→sessionSettings, SI→unpinLaunchEffort
```

## 6.2 Two effects: effort and standing opt-in

**(a) Effort.** Ultracode implies `xhigh` effort, supported by `supportsXhighEffort` (`ycH`, cli_inner_pretty.js:184834-184852) — true only for Opus 4.8 and 4.7. The effort resolver `resolveEffort` (`or`, cli_inner_pretty.js:184909-184919) clamps `xhigh` down to `high` if the model can't do it (`if (z === "xhigh" && !ycH(H)) return "high"`). `isWorkflowKeywordOrUltracodeEffort` (`ar`, cli_inner_pretty.js:184856-184858) is the predicate `q === true && NZ() && resolveEffort(...) === "xhigh"` used to detect the ultracode condition (it's what short-circuits the consent prompt at 378651).

**(b) Standing orchestration opt-in.** When ultracode is on, a `ultra_effort_enter` reminder is injected (generated by `_R_`, cli_inner_pretty.js:412920-412953) whose text (cli_inner_pretty.js:446739-446748) makes the Workflow opt-in *standing*:

> *"Ultracode is on: optimize for the most exhaustive, correct answer — not the fastest or cheapest. Use the Workflow tool on every substantive task; token cost is not a constraint…"*

This mirrors the **Ultracode** section of the tool description itself (cli_inner_pretty.js:376101): *"When a system-reminder confirms ultracode is on, that opt-in is standing: author and run a workflow for every substantive task by default."* When ultracode turns off, `ultra_effort_exit` (cli_inner_pretty.js:446749-446752) reverts: *"Ultracode is off — the Workflow tool's standard opt-in rule applies again."*

The `_R_` generator also throttles the reminder: it fires the `full` reminder on enter, then a `sparse` reminder only every `Kw4.TURNS_BETWEEN_MAINTENANCE` turns (cli_inner_pretty.js:412945-412949) so it doesn't spam the context on every turn.

**Key insight:** Ultracode converts the per-turn keyword opt-in into a per-session standing policy, *and* raises effort, *and* pre-grants the usage-warning consent (via `ar` in `r0_`). It's the "I want maximum-quality multi-agent orchestration as my default" switch — which is why it's flag-only and gated on both `NZ()` and an xhigh-capable model.

---

# Part 7 — Coordinator Integration (`Dk5`)

## 7.1 The NZ-gated Workflow clause

The coordinator system prompt builder `getCoordinatorSystemPrompt` (`Dk5`, cli_inner_pretty.js:216506+) describes a *separate* orchestration mode where Claude is a "coordinator" directing workers via `SpawnAgent`/`SendMessage`/`StopAgent`. When workflows are enabled, it injects one extra tool bullet:

```javascript
// ============================================
// getCoordinatorSystemPrompt - Coordinator prompt with NZ-gated Workflow clause
// Location: cli_inner_pretty.js:216506-216517
// ============================================

// ORIGINAL (for source lookup):
function Dk5() {
  let H = [...(K1() ? [gq] : []), ...(gI() ? [BK] : [])].join("/"),
    $ = xH(process.env.CLAUDE_CODE_SIMPLE) ? `Workers have access to ${H}, …` : "Workers have access to standard tools, …",
    q = NZ()
      ? `- **${mx}** (if available) - Run a multi-step subagent pipeline; prefer it over hand-orchestrating ${sq} calls when a matching workflow exists\n`
      : "";
  return (SH("coordinator_mode_start"),
    `You are Claude Code, an AI assistant that orchestrates software engineering tasks across multiple workers.
…
## 2. Your Tools
- **${sq}** - Spawn a new worker
- **${cf}** - Continue an existing worker …
- **${nT}** - Stop a running worker
${q}- **subscribe_pr_activity / unsubscribe_pr_activity** (if available) …`);
}

// READABLE (for understanding):
function getCoordinatorSystemPrompt() {
  let workflowClause = isWorkflowsEnabled()
    ? `- **${WORKFLOW_TOOL_NAME}** (if available) - Run a multi-step subagent pipeline; prefer it over hand-orchestrating ${SPAWN_AGENT} calls when a matching workflow exists\n`
    : "";
  logEvent("coordinator_mode_start");
  return `…## 2. Your Tools\n- **${SPAWN_AGENT}** …\n${workflowClause}- **subscribe_pr_activity …`;
}

// Mapping: Dk5→getCoordinatorSystemPrompt, NZ→isWorkflowsEnabled, mx→WORKFLOW_TOOL_NAME (216291),
//          sq→SPAWN_AGENT, cf→SEND_MESSAGE/continue, nT→STOP_AGENT
```

The clause `q` is empty string when `NZ()` is false, so a coordinator session with workflows disabled never even mentions the tool. When enabled, the guidance is explicit: *"prefer it over hand-orchestrating SpawnAgent calls when a matching workflow exists"* — i.e. a saved deterministic workflow beats ad-hoc fan-out of `SpawnAgent` calls.

## 7.2 Why the coordinator pre-dates the workflow

**Cross-validation (confidence: high):** `src/coordinator/coordinatorMode.ts` exists in the readable 2.1.88 tree with the same `## 4. Task Workflow` section, the same Research/Synthesis/Implementation/Verification phase table, and the `INTERNAL_WORKER_TOOLS` worker model — so the coordinator prompt is a direct precursor of `Dk5`. What's **new** in 2.1.156 is the `NZ()`-gated Workflow bullet: the coordinator predates dynamic workflows and was retrofitted to recommend the new tool when available. This is the one place where the two orchestration models (interactive coordinator-of-workers vs. scripted Workflow tool) explicitly cross-reference each other.

---

## Cross-Validation Summary (vs. v2.1.88)

| Subsystem | 2.1.88 status | 2.1.156 | Confidence |
|-----------|---------------|---------|------------|
| Workflow tool runtime (`agent`/`pipeline`/`parallel`/journal/caps) | Gated behind ant-only `WORKFLOW_SCRIPTS` feature; source files stripped from public tree | Full GA implementation | high (NEW/GA) |
| Enablement gate `NZ`/`SL5` | No equivalent in readable tree | New | high (NEW) |
| Keyword opt-in `pg6`/`KR_` + dismiss/restore | No equivalent | New | high (NEW) |
| Caps (`F74`/`Q74`/`fW8`/`dG_`/`tG_`) | No equivalent | New | high (NEW) |
| Journal/respawn (`bp6`/`x74`/`m74`) | No equivalent | New | high (NEW) |
| Ultracode | No `ultracode`/`xhigh` in readable tree | New | high (NEW) |
| `/workflows` command + viewer | `feature('WORKFLOW_SCRIPTS')` lazy-`require` references only | Full UI | high (GA) |
| Coordinator prompt (`Dk5`) | `src/coordinator/coordinatorMode.ts` precursor exists | Retrofitted with NZ-gated Workflow clause | high (precursor + new clause) |

**Bottom line:** Dynamic Workflows is the GA of an internal-only 2.1.88 prototype. The *gate, keyword, caps, journal, ultracode, and history UI* are all new; only the *coordinator prompt* has a readable precursor, and even there the Workflow integration is new.

---

## Pre-Completion Checklist

- [x] No mapping tables in this module doc — list-format symbol refs only
- [x] All new symbols returned via StructuredOutput for `symbol_index_core_features.md`
- [x] Dual-version snippets with header (ReadableName + Location) → ORIGINAL → READABLE → Mapping
- [x] Every cited `cli_inner_pretty.js:<line>` was read during analysis
- [x] Cross-validated against v2.1.88; NEW-vs-precursor stated explicitly with confidence
