# Scout Dossier — WORKFLOW (Dynamic Workflows / ultracode) — v2.1.156 → v2.1.183

> Feature: Dynamic Workflows (the `Workflow`/`RunWorkflow` tool + the `ultracode` keyword/effort system)
> TARGET: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
> PRIOR:  `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
> BASELINE docs: `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/42_workflow/`
> Every v2.1.183 line below was read directly. Obfuscated names were RE-DERIVED for v2.1.183 (they re-mangle between builds).

---

## 0. Executive summary

The Workflow subsystem is **structurally unchanged** v2.1.156 → v2.1.183 — same 4-layer gate, same VM runtime, same caps (1000 agents, 180s stall, `min(16,cores-2)` concurrency), same journal/resume, same `meta` AST parser, same fire-and-forget launch, same subagent prompts. The deltas are concentrated in **the keyword-trigger UX** and **a handful of correctness fixes**:

1. **Trigger keyword renamed `workflow(s)` → `ultracode`** (2.1.160). The runtime matcher changed from `Bg6(text,"workflows?")` to `hho(text,"ultracode")`; the model-facing tool description, the system-reminder text, and the "ignored" toast all switched to "ultracode".
2. **Violet shimmer for the keyword** (2.1.160). The input-box highlight changed from the rainbow shimmer (shared with ultrathink/ultraplan) to a dedicated violet/purple shimmer (`color:"autoAccept"` = rgb(135,0,255), `shimmerColor:"autoAcceptShimmer"` = rgb(208,180,255)).
3. **New `/config` "Ultracode keyword trigger" setting** (`workflowKeywordTriggerEnabled`, default true) — gates both the model-facing reminder and the input highlight. Did not exist in v2.1.156.
4. **Determinism check rewritten from regex to AST walk** (2.1.172) — the `Date.now()/Math.random()/new Date()` ban no longer false-positives on mentions inside strings/comments.
5. **Per-agent attribution context** (2.1.174) — workflow subagents now spawn with `override:{agentId, agentContext}` carrying parent/depth/session identity (v2.1.156 passed only `agentId`).
6. **`/workflows` opens immediately** (2.1.169) — `immediate:!0` added to the slash command.
7. **Tool-definition hardening**: new `errorCode 7` (server-fallback retraction), two new output-schema fields (`taskType`, `workflowName`), and a new per-agent `effort` opt in the `agent()` DSL signature.

**Framing traps caught:** (a) The "/effort ultracode option only on xhigh-capable models" behavior (changelog 2.1.160) **already existed in v2.1.156** (`Vx`=`NZ() && (m===undefined || ycH(m))`) — NOT a 2.1.156→183 delta. (b) The 2.1.178 "triggers only on explicit phrases (run a workflow / workflow:)" is a **model-facing policy/description** change plus the renamed single-word runtime keyword — there is **NO** runtime regex that matches the phrases "run a workflow"/"workflow:"; those strings live only inside the tool description (`gdo@418177`). (c) The whole subsystem remains NEW-post-2.1.88 (GA'd in 2.1.154) — link to the 2.1.156 baseline, don't re-derive the 2.1.88 verdict.

---

## A. Verified anchor table (v2.1.183 — re-derived)

| Readable name | v2.1.183 obf | v2.1.183 line | v2.1.156 obf | Evidence (read directly) |
|---|---|---|---|---|
| WORKFLOW_TOOL_NAME = "Workflow" | `zk` | 221550 | `mx` | `var zk = "Workflow"` |
| workflowExports / WORKFLOW_TOOL_NAME export | `y1i` | 221549 | `m57` | `gt(y1i,{WORKFLOW_TOOL_NAME:()=>zk, CODE_REVIEW_WORKFLOW_NAME:()=>Utt})` |
| isWorkflowsEnabled (master gate) | `Pw` | 148784 | `NZ` | `function Pw(){ if(Kyn())return!1; if(!aAi())return!1; ... return EJu()??t }` |
| isWorkflowsManagedDisabled | `Kyn` | 148777 | `H48` | `st(process.env.CLAUDE_CODE_DISABLE_WORKFLOWS)||mk()?.settings.disableWorkflows===!0` |
| isWorkflowsPolicyAllowed | `aAi` | 148800 | `r$7` | `return di("allow_workflows")` |
| resolveWorkflowAvailabilityCached | `tNr` | 148806 | `KP6` | memoizes into `Yyn` |
| resolveWorkflowAvailability | `HJu` | 148810 | `SL5` | env/gate/tier → `{available, defaultOn: sa()!=="pro"}` |
| getUserWorkflowSetting (enableWorkflows) | `EJu` | 148803 | `hL5` | `return mk()?.settings.enableWorkflows` |
| getWorkflowDefaultOn | `eNr` | 148791 | `qP6` | `return tNr().defaultOn` |
| **workflowKeywordTriggerEnabled (NEW)** | `Jyn` | 148797 | — | `return mk()?.settings.workflowKeywordTriggerEnabled ?? !0` |
| matchKeyword (code-span-masking) | `hho` | 464214 | `Bg6` | scans delimiter spans, then `\b<kw>\b` |
| findUltracodeKeyword | `yho` | 464261 | `pg6` | `return hho(e,"ultracode")` |
| hasUltracodeKeyword | `Qel` | 464267 | `lj4` | `return yho(e).length>0` |
| findUltraplanKeyword | `zWn` | 464255 | `OG8` | `hho(e,"ultraplan")` |
| findUltrareviewKeyword | `Xel` | 464258 | `dj4` | `hho(e,"ultrareview")` |
| keyword delimiter map | `Yel` | 464280 | `gj4` | `` {"`":"`",'"':'"',"<":">","{":"}","[":"]","(":")","'":"'"} `` |
| makeWorkflowKeywordReminder | `o4p` | 464869 | `KR_` | `G("tengu_workflow_keyword",{}); [{type:"workflow_keyword_request"}]` |
| ultraEffortEnter reminder | `s4p` | 464873 | `_R_` | standing-ultracode reminder injector |
| WORKFLOW_DESCRIPTION (tool prompt) | `gdo` | 418170 | `Fp6` | `Execute a workflow script that orchestrates...` |
| description interpolation slot ('worktree') | `aLp` | 418164 | `q0_` | `var aLp = "'worktree'"` |
| Workflow tool object | `DLp` | 419420 | `n0_` | `DLp = pi({ name: zk, aliases:["RunWorkflow"], ... })` |
| makeTool factory | `pi` | (factory) | `yK` | `DLp = pi({...})` |
| workflowInputSchema | `CLp` | 419334 | `Q0_` | `H.strictObject({script,name,...resumeFromRunId}).refine(...)` |
| workflowOutputSchema | `ILp` | 419372 | `g0_` | `H.object({status,taskId,taskType?,workflowName?,...})` |
| WorkflowInputError | `Vjn` | 419409 | — | `class Vjn extends Error` |
| **server-fallback retraction result (errorCode 7, NEW)** | `r5a` | 419415 | — | `{result:!1, message:"Tool dispatch was retracted by a server fallback...", errorCode:7}` |
| abortSignal-aborted check | `zCe` | 227026 | — | used at top + mid of validateInput |
| resolveWorkflowSource (scriptPath>name>script) | `n5a` | 419272 | `b44` | precedence ladder |
| parseWorkflowMeta | `m0` | 416466 | `FZ` | Acorn parse + `export const meta` first-stmt check |
| **determinismCheck (AST walk, NEW IMPL)** | `rWa` | 416439 | (inline regex) | `acorn-walk` over MemberExpression/NewExpression |
| readWorkflowScriptFile (UNC-reject) | `r0t` | (called 419492) | `Hj$` | `await r0t(e.scriptPath)` |
| resolveNamedWorkflow | `jjt` | (called 419495) | `AT$` | `await jjt(e.name, Pt())` |
| lookupPermissionRules | `Vte` | (called 419482) | `d6H` | `Vte(n, zk, c).get(r)` |
| WORKFLOW_SCRIPT_MAX_BYTES = 524288 | `A2` | 152140 | `jI` | `A2 = 524288` |
| WORKFLOW_AGENT_CAP = 1000 | `_Wa` | 417718 | `F74` | `_Wa = 1000` |
| WorkflowAgentCapError | `bWa` | 417785 | `Q74` | `this.name="WorkflowAgentCapError"` |
| WorkflowBudgetExceededError | `SWa` | 417791 | `fW8` | `this.name="WorkflowBudgetExceededError"` |
| computeWorkflowConcurrency = min(16,max(2,n-2)) | `K0p` | 416892 | `dG_` | identical formula |
| WORKFLOW_STALL_MS_DEFAULT = 180000 | `rLp` | 417739 | `tG_` | `rLp = 180000` |
| WORKFLOW_REMOTE_DEFAULT = 50 | `X0p` | 417717 | `lG_` | `X0p = 50` |
| stall retry count = 5 | `gWa` | 417740 | `p74` | `gWa = 5`; retry loop @417456 |
| subagent system prompt (plain) | `Q0p` | 417723 | `iG_` | `You are a subagent spawned by a workflow orchestration script...` |
| subagent system prompt (StructuredOutput) | `tLp` | 417804 | `aG_` | `...You MUST call the StructuredOutput tool exactly once...` |
| subagent def (plain) | `ddo` | 417811 | `mp6` | `agentType:"workflow-subagent", disallowedTools:[KO,vs,zk]` |
| subagent def (StructuredOutput) | `nLp` | 417820 | `sG_` | `{...ddo, getSystemPrompt:()=>tLp}` |
| StructuredOutput tool name | `Em` | 221489 | `iY` | `Em = "StructuredOutput"` |
| isUltracodeOn (now unpins launch effort) | `nNr` | 148937 | `zP6` | `let t=jr().ultracode===!0; if(t)u2(); return t` |
| supportsXhighEffort | `hTe` | 148878 | `ycH` | xhigh-capable models (fable-5, mythos-5, opus-4-8/4-7) |
| isWorkflowKeywordOrUltracodeEffort | `eZ` | 148901 | `ar` | `n===!0 && Pw() && ZQ(e,t)==="xhigh"` |
| resolveEffort (xhigh downgrade) | `ZQ` | 148967 | `or` | `if(s==="xhigh"&&!hTe(e))return"high"` |
| isUltracodeOption-allowed (xhigh+wf gate) | `T4` | 148898 | `Vx` | `Pw() && (e===void 0 || hTe(e))` |
| /workflows slash command | `jmf`/`Gmf` | 562632 | `Pjz`/`Wjz` | `{type:"local-jsx", name:"workflows", immediate:!0, isEnabled:()=>Pw()}` |
| saveWorkflow | `oHl` | 530752 | `$Q4` | emits `tengu_workflow_saved` |
| reminder renderer (workflow_keyword_request) | (renderer map) | 590606 | (446731) | `'The user included the keyword "ultracode", opting this turn into multi-agent orchestration...'` |
| toggleKeywordIgnored (alt+w) | `el` | 622362 | `UJ` | `tengu_workflow_keyword_dismissed/_restored` |
| keyword spans memo (highlight) | `ji` | 622226 | `o1` | `Pw() && Jyn() ? yho(Tf) : []` |

Subagent worktree isolation message (417137-417143), agent cap message `J0p` (417781), preview truncation `AWa=400` (417722), result preview `XGe` (416899), agent() intrinsic body (416988-417087), executor `U` (417088+) — all read and confirmed structurally identical to v2.1.156.

---

## B. Confirmed deltas

### B1. Trigger keyword renamed `workflow(s)` → `ultracode` (2.1.160) — biggest user-facing delta
**Kind:** renamed / behavior-change. **Confidence: high.**

- **Runtime matcher.** v2.1.183 `yho(e)=hho(e,"ultracode")` (464261-464262); the generic matcher `hho` (464214-464253) is byte-for-byte the same masking logic as v2.1.156 `Bg6`. Before: v2.1.156 `pg6(H)=Bg6(H,"workflows?")` (412173).
- **Reminder text.** v2.1.183 @590606-590612: `'The user included the keyword "ultracode", opting this turn into multi-agent orchestration — use the Workflow tool to fulfill the request.'` Before: v2.1.156 @446735: `'The user included the keyword "workflow" or "workflows", which means you should use the Workflow tool to fulfill their request.'`
- **Tool description opt-in form #1.** v2.1.183 @418175: `- The user included the keyword "ultracode" in their prompt (you'll see a system-reminder confirming it).` Before: v2.1.156 @376082: `- The user included the "workflow" or "workflows" keyword (you'll see a system-reminder confirming it).`
- **Footer hint.** v2.1.183 @418181: `Mention they can ask for one with "use a workflow" in a future message to skip the ask.` Before: v2.1.156 @376088: `Mention they can include "workflow" in a future message to skip the ask.`
- The telemetry event name is **unchanged** (`tengu_workflow_keyword`, `..._dismissed`, `..._restored`) and the reminder *type* string is **unchanged** (`workflow_keyword_request`) — only the human-facing keyword changed.

### B2. The "2.1.178 explicit-phrase" change is a DESCRIPTION/policy edit, not a new regex
**Kind:** behavior-change (model-facing). **Confidence: high.**

There is **no** runtime detector for the phrases "run a workflow" / "workflow:". `grep -nF "run a workflow"` returns only two hits, both inside the tool description `gdo` (418177, 418194). The runtime keyword detector is the single-word `hho(e,"ultracode")`. What changed in the description's natural-language opt-in form #3:
- v2.1.183 @418177: `("use a workflow", "run a workflow", "fan out agents", "orchestrate this with subagents")` — **added "use a workflow"**.
- v2.1.156 @376084: `("run a workflow", "fan out agents", "orchestrate this with subagents")`.

So the model is taught that natural-language phrases like "use a workflow" are the opt-in, and the only single literal keyword is now "ultracode" — matching the changelog's "triggers only on explicit phrases, not any mention" framing. (The reason "any mention of workflow" no longer triggers is simply that the runtime keyword is now "ultracode", which nobody types incidentally.)

### B3. Violet/purple shimmer for the keyword highlight (2.1.160)
**Kind:** behavior-change (UI). **Confidence: high.**

v2.1.183 @622310-622313:
```
if (Pw() && !WA)
  for (let an of ji)
    for (let gr = an.start; gr < an.end; gr++)
      _t.push({ start: gr, end: gr + 1, color: "autoAccept", shimmerColor: "autoAcceptShimmer", priority: 10 });
```
`autoAccept` = `rgb(135,0,255)` (violet) @154110; `autoAcceptShimmer` = `rgb(208,180,255)` @154111.
Before: v2.1.156 @584763-584772 used the rainbow shimmer `color: fI(n6-b8.start), shimmerColor: fI(n6-b8.start,!0)` — the same `fI` rainbow used for ultrathink/ultraplan. So the workflow keyword now has its own **dedicated violet** highlight distinct from the rainbow keywords.

### B4. New `/config` setting "Ultracode keyword trigger" (`workflowKeywordTriggerEnabled`) (2.1.157, renamed 2.1.160)
**Kind:** added. **Confidence: high.**

- Setting reader: `Jyn` @148797-148799 → `mk()?.settings.workflowKeywordTriggerEnabled ?? !0` (default ON).
- Schema: @55997-56011 declares `disableWorkflows`, `enableWorkflows`, and the new `workflowKeywordTriggerEnabled` boolean with describe text @56011: `'Enable the "ultracode" keyword trigger: including the keyword in a prompt opts that turn into the Workflow tool. Set to false to disable the trigger. Default: true.'`
- /config toggle: @479214-479225, `id:"workflowKeywordTriggerEnabled", label:"Ultracode keyword trigger"`, writes `userSettings.workflowKeywordTriggerEnabled` + telemetry `ultracodeKeywordTrigger:"on"/"off"` @479223.
- **Gates both surfaces:** reminder injection now has `&& Jyn()` @464668; input highlight memo `ji` has `Pw() && Jyn()` @622226.
- Before: v2.1.156 `grep -c workflowKeywordTriggerEnabled` = **0**. The reminder injection had no setting gate (`A?.isRegularUserPrompt && !A.suppressWorkflowKeyword` @412713); the highlight memo was `NZ() ? pg6(r1) : []` @584681.

### B5. Determinism check rewritten: regex → AST walk (2.1.172 fix)
**Kind:** fix / refactored. **Confidence: high.**

v2.1.183 `rWa` @416439-416465 parses the script with Acorn and uses `acorn-walk` (`ido()`):
```
MemberExpression(s){ ... if((i==="Date"&&a==="now")||(i==="Math"&&a==="random")) r=!0; }
NewExpression(s){ if(s.callee.name==="Date" && s.arguments.length===0) r=!0; }
```
Called as `e.script && rWa(r.scriptBody)` @419461.
Before: v2.1.156 used a raw regex on the script body @378256-378262: `H.script && /\bDate\s*\.\s*now\b|\bMath\s*\.\s*random\b|\bnew\s+Date\s*\(\s*\)/.test(K.scriptBody)`. That regex matched `Date.now()` even inside string literals and comments → false rejections. The AST walk only flags real member/new expressions, so a *mention* in a prompt string or comment no longer trips errorCode 4. Error message wording is unchanged.

### B6. Per-agent attribution context on subagent spawn (2.1.174 fix)
**Kind:** fix. **Confidence: high.**

v2.1.183 builds a full agent-context object `Dt` @417152-417160 and passes it on spawn @417250: `override: { agentId: dt, agentContext: Dt }`, where
```
Dt = { agentId: dt, parentAgentId: jz(ue)?void 0:ue?.agentId, depth: Gz(ue)+1,
       parentSessionId: a4(), agentType: "subagent", subagentName: pe.agentType, isBuiltIn: ay(pe) }
```
Before: v2.1.156 @375257 passed only `override: { agentId: eH }` — no `agentContext`. Without the parent/depth/session identity, workflow subagents lacked the per-agent attribution headers. (The transcript subdir/`spawnedByWorkflowRunId` plumbing @417248-417249 is unchanged from v2.1.156 @375255-375256.)

### B7. `/workflows` opens immediately (2.1.169 fix)
**Kind:** fix / behavior-change. **Confidence: high.**

v2.1.183 `jmf` @562632-562640 adds `immediate: !0` (562638) and renames the description to `"Browse running and completed workflows"`.
Before: v2.1.156 `Pjz` @538934-538941 had **no** `immediate` flag; description was `"Browse dynamic workflow history (running and completed)"`. The `immediate` flag lets the command open without waiting for the in-progress turn to settle.

### B8. Tool-definition hardening: errorCode 7, new output fields, per-agent effort
**Kind:** added. **Confidence: high.**

- **errorCode 7 (server-fallback retraction).** v2.1.183 `validateInput` starts with `if (zCe(t.abortController.signal)) return r5a;` (419442) and re-checks after source resolution (419457). `r5a` @419415-419419 = `{result:!1, message:"Tool dispatch was retracted by a server fallback; the input may be truncated.", errorCode:7}`. Before: v2.1.156 Workflow `validateInput` had errorCodes 1-6 only (no abort-signal pre-check). (errorCode 7 exists in v2.1.156 for *other* tools like NotebookEdit, not Workflow.)
- **Output schema +`taskType` +`workflowName`.** v2.1.183 `ILp` @419376-419385 adds `taskType: enum(["local_workflow","remote_agent"]).optional()` and `workflowName: string().optional()` (meta.name echo). Before: v2.1.156 `g0_` @378186-378216 had neither field.
- **Per-agent `effort` opt in agent() DSL.** v2.1.183 description @418215 documents `agent(prompt, opts?: {... effort?: string ...})` and the runtime reads it @417123 `le = rB(re?.effort)`. Before: v2.1.156 `agent()` signature @376122 had no `effort` opt.
- Minor: output-schema `warning` describe text changed "remote session will clone" (v2.1.156) → "cloud session will clone" (v2.1.183 @419404).

---

## C. Unchanged carryover (link to 2.1.156 — do NOT re-document)

- **The 4-layer enablement gate** (`Pw`/`Kyn`/`aAi`/`tNr`/`HJu`/`EJu`) — identical logic to v2.1.156 `NZ` chain; env vars `CLAUDE_CODE_WORKFLOWS`/`CLAUDE_CODE_DISABLE_WORKFLOWS`, gate `tengu_workflows_enabled`, policy `allow_workflows`, settings `enableWorkflows`/`disableWorkflows`, `defaultOn = tier!=="pro"`. → baseline `gate_caps_lifecycle_relations.md` Part 1.
- **`/effort ultracode` option gated on xhigh-capable models** — `T4(e)=Pw() && (e===void 0 || hTe(e))` @148898 is functionally identical to v2.1.156 `Vx(H)=NZ() && (H===void 0 || ycH(H))` @184853. The changelog's "2.1.160: ultracode not offered on models that can't run xhigh" describes behavior that **already shipped in v2.1.156**. The `/effort` slider's `ultracode` level with `color:"violet-ripple"` (@551113) also already existed in v2.1.156 (@527109). **Framing trap — not a delta.**
- **Effort resolution xhigh-downgrade** `ZQ` @148967 (`if(s==="xhigh"&&!hTe(e))return"high"`) — same as v2.1.156 `or`.
- **VM runtime / DSL semantics** — `agent()` per-call pipeline, true `parallel()` barrier vs `pipeline()` flow, `phase()`/`log()`, nested `workflow()` one-level, `console`/timers globals, frozen `budget`. Caps `_Wa=1000`/`rLp=180000`/`K0p`/`X0p=50`/`gWa=5` all equal v2.1.156. → baseline `workflow_runtime_and_subagents.md`.
- **Determinism runtime sandbox** (the VM shim making `Math.random`/`Date.now`/`new Date()` throw at runtime) — separate from the validateInput check; unchanged. → baseline §E.
- **Journal / resume protocol** (`journal.jsonl`, SHA-256 cache key `(phase,prompt,canonical opts)`, longest-unchanged-prefix replay, respawn detection, snapshot for `/workflows`) — unchanged. → baseline Part 4.
- **`meta` AST parser** (`m0`/`FZ`): first-statement `export const meta` rule, pure-literal eval, prototype-pollution key ban, field validation — structurally unchanged. → baseline §5.
- **resolveWorkflowSource precedence** (`n5a`/`b44`: scriptPath > name > script), **UNC rejection** (`r0t`/`Hj$`), **512 KiB cap** (`A2`/`jI`=524288), **fire-and-forget persistence**, **script slug path** — unchanged. → baseline §6-8.
- **checkPermissions** ask-by-default + name-scoped allow-suggestion (`DLp.checkPermissions` @419479-419523) — same shape as v2.1.156 `n0_.checkPermissions`. → baseline §7.
- **First-use consent** (`skipWorkflowUsageWarning`, usage-warning prompt, ultracode-implies-consent short-circuit) — unchanged. → baseline Part 2.5.
- **Subagent prompts** (`Q0p`/`tLp` plain + StructuredOutput) and the StructuredOutput-forcing SubagentStop hook + nudge — unchanged text. → baseline §F.
- **`worktree` isolation** as the only advertised isolation (`'remote'` still throws `agent({isolation:'remote'}) is not available in this build` @417061) — unchanged. → baseline.
- **Coordinator NZ-gated Workflow clause** — out of scope here; unchanged.
- **NEW-post-2.1.88 verdict** (GA'd 2.1.154) — already established; link to baseline README, don't re-derive.

---

## D. Open questions / low-confidence items

1. **2.1.161 bg-worktree edit fix** (workflow agents with `isolation:"worktree"` in background sessions blocked from editing their own worktree). I confirmed the worktree plumbing: spawn injects the worktree system-prompt suffix @417133-417143, passes `worktreePath: Ce` into `wj` @417253, which records it in agent metadata @387312 and emits the isolation-redirect message @389687-389688 (`"This session is now isolated in ${worktreePath}. Edit the worktree copy..."`). I did **not** isolate the exact one-line permission-routing change between v2.1.156 and v2.1.183 that fixed the bg block — it appears to be in the write-permission root resolution that now includes `worktreePath`. **Medium confidence** that the fix lives in this plumbing; the precise diff site needs a focused permission-context comparison. Flag for the writer to pin down.
2. The `agentContext: Dt` object (B6) is the most likely seat of the 2.1.174 attribution-header fix, but the actual *rendering* of the per-agent header (where `agentContext`/`subagentName` becomes a visible header) is in the streaming/transcript layer (`Rq`/`wj`/`Uct`), which I did not fully trace. The cause (missing context on spawn) is high-confidence; the exact header render is unconfirmed.
3. The description body (`gdo`) is ~150 lines; I diffed the load-bearing opt-in/keyword/agent-signature parts. There may be additional small wording tweaks in the pattern catalog (Parts D-F) not enumerated here — low impact, worth a full text diff during writing.

---

## E. Proposed docs (for the 42_workflow delta module, v2.1.183)

| Filename | Purpose |
|---|---|
| `42_workflow/README_delta_2.1.183.md` | Delta index: what changed 156→183 (the 7 deltas), what's carryover, the two framing traps; re-derived anchor table; reading order pointing back to the v2.1.156 baseline for unchanged subsystems. |
| `42_workflow/ultracode_keyword_trigger_delta.md` | Deep dive on the keyword UX delta: `workflow(s)`→`ultracode` matcher (`hho`/`yho`/`Qel`), the reminder text + renderer, the violet shimmer (`autoAccept`/`autoAcceptShimmer` vs old rainbow `fI`), the new `workflowKeywordTriggerEnabled` /config setting and its `Jyn()` gate on both reminder + highlight, the renamed "ignored" toast. Includes the B2 framing analysis (no phrase regex; policy lives in `gdo`). |
| `42_workflow/tool_definition_fixes_delta.md` | The tool-object changes: AST-walk determinism (`rWa`, 2.1.172), errorCode 7 server-fallback retraction (`r5a`/`zCe`), new output fields `taskType`/`workflowName`, per-agent `effort` opt, `n5a`/`m0`/`r0t`/`Vte` re-derivation. Links to baseline for the unchanged schema/parser/permission spine. |
| `42_workflow/runtime_fixes_delta.md` | Runtime fixes: per-agent `agentContext` attribution on spawn (2.1.174, `override:{agentId,agentContext:Dt}`), `/workflows` `immediate:!0` (2.1.169), and the worktree bg-edit fix investigation (2.1.161, open item D1). Confirms caps/journal/DSL unchanged → link baseline. |

(Per CLAUDE.md: add all re-derived v2.1.183 symbols to `00_overview/symbol_index_core_features.md` Workflows section — none in these module docs as tables.)
