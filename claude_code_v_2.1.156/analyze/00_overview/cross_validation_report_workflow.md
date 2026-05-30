# Cross-Validation Report — Module 42_workflow (Dynamic Workflows)

- **Module:** `42_workflow` — Dynamic Workflows (FLAGSHIP, new in 2.1.154)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/42_workflow`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/00_overview/symbol_additions_v2_1_156_workflow.md`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- **v2.1.88 xval source:** `/lyz/codespace/3rd/claude-code/src`
- **Markdown files scanned:** 4 (`README.md`, `workflow_tool_definition.md`, `gate_caps_lifecycle_relations.md`, `symbol_additions_v2_1_156_workflow.md`)
- **Samples checked (verified reads in the bundle + xval):** 38
- **Overall verdict: PASS (confidence: high)**

---

## C1 — Symbol existence (verified reads)

Every sampled obfuscated identifier was found at its cited line by directly reading the bundle.
38 distinct citations verified; **0 missing**, **0 mismatched**.

Gate / enablement (all read at `cli_inner_pretty.js`):
- `H48` @ 184750 — PASS (`xH(...CLAUDE_CODE_DISABLE_WORKFLOWS) || UV()?.settings.disableWorkflows === !0`)
- `NZ` @ 184757 — PASS (4-layer AND; calls `KP6()` at 184760)
- `qP6` @ 184764 — PASS (`return KP6().defaultOn`)
- `i$7` @ 184767 — PASS (`r$7() && !xH(...DISABLE_WORKFLOWS) && KP6().available`)
- `r$7` @ 184770 — PASS (`return k7("allow_workflows")`)
- `hL5` @ 184773 — PASS (`return UV()?.settings.enableWorkflows`)
- `KP6` @ 184776 — PASS (memoizes `SL5()` into `$48`)
- `SL5` @ 184780 — PASS (env → `tengu_workflows_enabled` gate → tier; `defaultOn = _4() !== "pro"`)
- `var $48;` @ 184789 — PASS (the memo, declared after `SL5`)

Tool object / schema / parser / persistence:
- `m57` @ 216289, `X$(m57,…)` @ 216290, `mx="Workflow"` @ 216291, `n18="ListAgents"` @ 216292 — PASS
- `yK` @ 143482, `P45` @ 143499 (`isEnabled:()=>!0`, `checkPermissions` default allow) — PASS
- `b44` @ 378081 (precedence `scriptPath > name > script`) — PASS
- `d0_` @ 378099, `l0_` @ 378103, `c0_=200` @ 378111 — PASS
- `Q0_` (input schema) @ 378140, `...!1` @ 378182, `g0_` (output schema) @ 378186 — PASS
- `n0_=yK({…})` @ 378217, `aliases:["RunWorkflow"]` @ 378219, `searchHint` @ 378220, `isEnabled:()=>NZ()` @ 378222 — PASS
- `validateInput` @ 378238 (errorCodes 5/6/1/2/4/3), determinism regex on `H.script` @ 378256, resume-conflict @ 378263 — PASS
- `checkPermissions` @ 378274, key `K=H.scriptPath?void 0:H.name` @ 378276, `d6H` deny/ask/allow + `addRules` suggestion @ 378307 — PASS
- `FZ` @ 371746, `IZ_` @ 371779, `pK4` @ 371786, `UK4` @ 371813, `CZ_` @ 371824, `bZ_` @ 371832, `xZ_` @ 371842 — PASS
- `var RZ_;` @ 371853, `RZ_ = new Set(["__proto__","constructor","prototype"])` @ 371856 — PASS
- `Fp6;` declared @ 376074, assigned `Fp6 = \`Execute a workflow script…\`` @ 376077 — PASS
- `BP8` @ 367468 (wraps body in `(async () => {…})()`) — PASS
- `d9H` @ 145267, `O68` @ 145274, `Y95` @ 145277, `xFK` @ 145280 (mode 448/384), `Hj$` @ 145294 (`tm(H)` UNC @ 145295), `jI=524288` @ 145308 — PASS
- `tm` @ 8587 (`/^[\\/]{2}/.test(H)`) — PASS
- `d6H` @ 442061 (`Map<ruleContent, rule>` filtered by `toolName`) — PASS

Caps / journal / lifecycle / UI / consent / ultracode / coordinator:
- `dG_` @ 374930 (`Math.min(16, Math.max(2, H-2))`), `lG_=50` @ 375677, `F74=1000` @ 375678, `tG_=180000` @ 375699 — PASS
- `x74` @ 374835, `gG_` @ 374847 (keys `schema/model/isolation/agentType`, recursive sort), `m74` @ 374867, `bp6` @ 374871 (`journal.jsonl`) — PASS
- `C74` @ 374771, `b74` @ 374781 — PASS
- `q44` @ 376007 — PASS; `TrH` @ 278050 — PASS; `gtH` @ 372079 — PASS
- `$Q4` @ 507621 (save) — PASS; `Pjz` @ 538934 (`/workflows`, `isEnabled:()=>NZ()`) — PASS; `gt4` @ 538403 (viewer) — PASS
- `r0_` @ 378645 (consent gate; `ar(...)` short-circuit @ 378651), `o0_` @ 378654 (`tengu_workflow_usage_warning_accepted`), `sF$` @ 53591 (4 settings scopes) — PASS
- `pg6` @ 412172 (`Bg6(H,"workflows?")`), `Bg6` @ 412125, `OG8` @ 412166, `dj4` @ 412169, `lj4` @ 412178, `KR_` @ 412916 — PASS
- `ultracode` setting @ 51695-51703, `ycH` @ 184834, `ar` @ 184856, `zP6` @ 184884, `or` @ 184909 (`if (z==="xhigh" && !ycH(H)) return "high"` @ 184917) — PASS
- `Dk5` @ 216506 (NZ-gated Workflow clause `q` @ 216511-216514) — PASS

**C1 result: 38 PASS / 0 FAIL.**

---

## C2 — Line/symbol pairing

For each sampled pair `(symbol, line)` the obfuscated identifier appears at (or is declared/assigned at)
the cited line. Two pairs are split declaration/assignment — the docs already document this correctly:

- `Fp6` — declared `Fp6;` @ 376074, assigned @ 376077. The additions-file line-note and both module
  docs cite the assignment (376077) consistently. PASS.
- `mx`/`m57` — `m57={}` @ 216289, lazy getter `X$(m57,…)` @ 216290, `mx="Workflow"` @ 216291. Docs cite
  216291 for `mx` and 216289-216290 for the namespace re-export. PASS.
- `RZ_` — `var RZ_;` @ 371853, `Set([...])` assigned @ 371856; additions-file note matches. PASS.
- `$48` — `var $48;` @ 184789 (declared after `SL5`), populated lazily by `KP6`; additions-file note matches. PASS.

**C2 result: all sampled pairs PASS / 0 FAIL.**

---

## C3 — Line-range sanity

All sampled multi-line ranges are well-formed (start ≤ end) and the function/object that opens the range
actually spans it:

- `NZ` 184757-184763 — function body is exactly 184757-184763. PASS.
- `SL5` 184780-184788 — function body 184780-184788. PASS.
- `Q0_`/`g0_` 378140-378216 — both lazy schemas span this range. PASS.
- `validateInput` 378238-378273 — PASS.
- `FZ` 371746-371778 — PASS.
- `xFK` 145280-145293 / `Hj$` 145294-145305 — PASS.
- `bp6` 374871-374906 — class body spans this. PASS.
- `Dk5` 216506-216517+ — coordinator builder opens at 216506. PASS.

**C3 result: 8/8 ranges sane / 0 FAIL.**

---

## C4 — v2.1.88 cross-check (precursor claims)

The docs make four falsifiable claims about the readable v2.1.88 tree. All four are confirmed against
`/lyz/codespace/3rd/claude-code/src`:

1. **`WorkflowMultiselectDialog.tsx` is a GitHub Actions installer, not workflow runtime** — CONFIRMED.
   `components/WorkflowMultiselectDialog.tsx` exists and imports
   `type { Workflow } from '../commands/install-github-app/types.js'`.
2. **`WORKFLOW_SCRIPTS`-gated scaffolding exists but source files are stripped** — CONFIRMED.
   `feature('WORKFLOW_SCRIPTS')` references at `tools.ts:129`, `tasks.ts:9`, `commands.ts:86`,
   `components/permissions/PermissionRequest.tsx:38-39` (require `tools/WorkflowTool/WorkflowTool.js` +
   `WorkflowPermissionRequest.js`), `components/tasks/BackgroundTasksDialog.tsx:105-110` (with the comment
   "WORKFLOW_SCRIPTS is ant-only (build_flags.yaml)"). The required `.js` files are not present.
3. **No gate/runtime precursor strings** — CONFIRMED. `resumeFromRunId`, `tengu_workflows_enabled`,
   `CLAUDE_CODE_WORKFLOWS`, `enableWorkflows`, `allow_workflows` are absent from the entire readable tree.
4. **`coordinator/coordinatorMode.ts` is a precursor to `Dk5`** — CONFIRMED. The file exists; only the
   `NZ()`-gated Workflow clause is new in 2.1.156.

**C4 result: 4/4 CONFIRMED.** "GA of an internal-only prototype" verdict is accurate.

---

## C5 — Mapping conflicts (one-symbol-one-readable-name)

**3 conflicts found and FIXED** (same obfuscated symbol carried two readable names across the module's
docs vs. its additions table). The additions file is the single source of truth (per CLAUDE.md), and
`workflow_tool_definition.md` already agreed with it; the deviant file was
`gate_caps_lifecycle_relations.md`, which was realigned:

| Symbol | Additions + tool_definition (canonical) | gate_caps (was) | Resolution |
|--------|------------------------------------------|-----------------|------------|
| `KP6` | `resolveWorkflowAvailabilityCached` | `getWorkflowAvailabilityCached` | gate_caps → `resolveWorkflowAvailabilityCached` |
| `r$7` | `isWorkflowsPolicyAllowed` | `getWorkflowGateRaw` | gate_caps → `isWorkflowsPolicyAllowed` |
| `hL5` | `getUserWorkflowSetting` | `getWorkflowUserToggle` | gate_caps → `getUserWorkflowSetting` |

After the fix, `grep` for the three deviant names across `42_workflow/` and the additions file returns
nothing. `SL5` was already consistently `resolveWorkflowAvailability` in all three docs — so the
**availability-resolver naming is now uniform**: `SL5` is the resolver, `KP6` the cache wrapper that
`NZ()` calls. A clarifying sentence was added to §1.2 stating exactly that.

**C5 result: 3 conflicts, all resolved.**

---

## S1 — Semantic spot-checks (code samples)

### Sample 1 — `NZ` (gate) @ cli_inner_pretty.js:184757-184763

```js
function NZ() {
  if (H48()) return !1;
  if (!r$7()) return !1;
  let { available: H, defaultOn: $ } = KP6();   // <-- calls the CACHED wrapper, not SL5 directly
  if (!H) return !1;
  return hL5() ?? $;
}
```
**Verdict: PASS.** Matches the docs' 4-layer description exactly. Confirms the task's note that `NZ`
calls `KP6` (not `SL5`); the docs now name `KP6` `resolveWorkflowAvailabilityCached` consistently.

### Sample 2 — `SL5` (availability resolver) @ cli_inner_pretty.js:184780-184788

```js
function SL5() {
  if (xH(process.env.CLAUDE_CODE_WORKFLOWS)) { let $ = V$("tengu_workflows_enabled", !0); return { available: $, defaultOn: $ }; }
  if (k4(process.env.CLAUDE_CODE_WORKFLOWS)) return { available: !1, defaultOn: !1 };
  if (!V$("tengu_workflows_enabled", !0)) return { available: !1, defaultOn: !1 };
  return { available: !0, defaultOn: _4() !== "pro" };
}
```
**Verdict: PASS.** `defaultOn = (tier !== "pro")` matches the dossier anchor and both docs.

### Sample 3 — `validateInput` error codes @ cli_inner_pretty.js:378238-378273

```js
if (H48()) return { result:!1, …, errorCode: 5 };          // managed-off
if (!NZ()) return { result:!1, …, errorCode: 6 };          // not enabled
let q = await b44(H); if ("error" in q) return { …errorCode: 1 };   // source resolve
let K = FZ(q.script); if ("error" in K) return { …errorCode: 2 };   // meta parse
if (H.script && /\bDate\s*\.\s*now\b|…/.test(K.scriptBody)) return { …errorCode: 4 };  // determinism
if (H.resumeFromRunId) { … z.status === "running" … errorCode: 3 }  // resume conflict
```
**Verdict: PASS.** All six codes and the inline-script-only determinism regex match §6 of
`workflow_tool_definition.md`.

### Sample 4 — `Hj$` + `tm` UNC rejection @ cli_inner_pretty.js:145294-145305 / 8587-8589

```js
function tm(H) { return /^[\\/]{2}/.test(H); }
async function Hj$(H) {
  if (tm(H)) return { error: `UNC paths are not allowed for workflow scriptPath: ${H}` };
  let $ = bgH.resolve(C$(), H);
  let q = await U$().readFileBytes($, jI + 1);   // +1 byte over the 512 KiB cap
  …
}
```
**Verdict: PASS.** UNC two-leading-slash detector and `jI+1` bounded read match §8.

### Sample 5 — `m74` journal cache key @ cli_inner_pretty.js:374867-374870

```js
function m74(H, $, q) {
  let K = u74.createHash("sha256").update(q).update("\x00").update(H).update("\x00").update(gG_($)).digest("hex");
  return `${QG_}:${K}`;
}
```
**Verdict: PASS.** Hash order `(q=phase, H=prompt, gG_($)=canonical opts)` and `gG_` opt-allowlist
(`schema/model/isolation/agentType`, recursive key sort) match Part 4.5. `H/$/q → prompt/opts/phaseTitle`
naming in the doc is consistent with the call positions.

---

## Confidence roll-up

| Check | Result | Confidence |
|-------|--------|------------|
| C1 Symbol existence (38 sampled) | 38 PASS / 0 FAIL | high |
| C2 Line/symbol pairing | all PASS (decl/assign splits documented) | high |
| C3 Range sanity (8 ranges) | 8 PASS / 0 FAIL | high |
| C4 v2.1.88 precursor claims (4) | 4 CONFIRMED | high |
| C5 Mapping conflicts | 3 found → 3 fixed | high |
| S1 Semantic spot-checks (5) | 5 PASS | high |

**Overall verdict: PASS (high confidence).** The module is accurate end-to-end: every sampled citation
reads true in the bundle, the line numbers (including the declaration-vs-assignment splits for `Fp6`,
`mx`/`m57`, `RZ_`, `$48`) are correct, the v2.1.88 "GA of an internal `WORKFLOW_SCRIPTS` prototype"
verdict is verified, and the 82209-is-Bedrock disambiguation is sound. The only defect was a readable-name
drift for three gate helpers (`KP6`, `r$7`, `hL5`) in `gate_caps_lifecycle_relations.md`; it is now
reconciled to the additions-file canon, so each symbol carries exactly one readable name module-wide and
the availability-resolver naming (`SL5` resolver / `KP6` cache wrapper) is uniform. No mapping tables were
introduced into module docs.
