# Cross-Validation Report — Module 38_permissions (v2.1.193 delta)

- **Module:** 38_permissions (Permissions / Auto-mode / Sandbox / Model-entitlement delta, v2.1.183 → v2.1.193)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/38_permissions/`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/00_overview/symbol_additions_v2_1_193_permissions.md`
- **TARGET bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build `a1938d2a`)
- **Before-picture bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines, build `9d251ab`)
- **Earlier baseline:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
- **Markdown files audited (7):** `README.md`, `classify_all_shell.md`, `denial_reasons_surfacing.md`, `sandbox_credentials.md`, `org_model_restrictions.md`, `recent_denied_overlay.md`, `background_subagent_permission_forwarding.md` + the 1 additions file.

**Verdict (one line):** PASS WITH FIXES. The permissions delta analysis is exceptionally well-grounded. Every load-bearing v2.1.193 declaration, body, readable rewrite, and every NET-NEW / CARRYOVER / REFINEMENT classification was re-verified against the live bundles and **holds**. The false-delta hunt — re-running 18 grep-count diffs in *both* the 183 and 156 bundles — found **zero false deltas**: every "NET-NEW" symbol is genuinely 183=0 and every "CARRYOVER" symbol genuinely matches 183 counts. The only defects were **four ±1–2 line citation drifts** (each pointing at the right declaration region), all fixed in place. No fabricated lines, no wrong tokens, no mislabeled mappings, no inflated deltas.

**Sample:** ~85 distinct v2.1.193 anchors re-read at their exact lines in the TARGET bundle + ~15 before-pictures re-read in the 183/156 bundles (9 named 183 declarations read in full + 156 grep-decls) + 18 grep-count diffs re-run across all three bundles (54 individual counts).

---

## C1 — Citation spot-check (v2.1.193 TARGET bundle)

Every line opened at its exact cited line and the declaration/body/string confirmed against the doc claim.

### classify_all_shell.md

| Cited | Doc claim | Verified at line | Result |
|---|---|---|---|
| 55814 | `classifyAllShell` schema field + describe string | `classifyAllShell: A.boolean().optional().describe("When true, every Bash/PowerShell allow rule is suspended … higher safety, more classifier calls. Default: false.")` — verbatim | PASS |
| 58758 | `$Cr` = isClassifyAllShellEnabled (OR across sources, `=== !0`) | `function $Cr() { for (let e of Uys) if (_n(e)?.autoMode?.classifyAllShell === !0) return !0; return !1; }` | PASS |
| 58827 | `Uys` four-source array | `(Uys = ["userSettings","localSettings","flagSettings","policySettings"])` | PASS |
| 416260 | `sTo` wrapper → `$Cr` | `function sTo() { return $Cr(); }` | PASS |
| 416263 / 416264 | `r9e` predicate; **bypass line** | `function r9e(e,t){` @416263; `if ((e===Io||e===Ss)&&sTo()) return !0;` @416264 (precedes `Orl.get`) | PASS |
| 416257 | `oTo` resolvesToAgentTool | `function oTo(e,t){ return KL(e)===is; }` | PASS |
| 416162 / 416208 | `mqt` / `hqt` dangerous-prefix | `function mqt(e,t){ if(e!==Io)…}` / `function hqt(e,t){ if(e!==Ss)…}` | PASS |
| 146006 / 229433 | `Io="Bash"` / `Ss="PowerShell"` | `var Io = "Bash"` / `var Ss = "PowerShell"` | PASS |
| 597459 / 597462 | `dQl` isAutoMode / `NEe` buildAutoModeAllowLayers | `function dQl(e){ return e==="auto"||(e==="plan"&&(oWf?.isAutoModeActive()??!1)); }` / `function NEe(e){ if(dQl(e.mode)){…ajo…ug…r9e…}}` | PASS |
| 597471 / 597964 / 598268 / 598279 | 4 callers of `r9e` | all four sites consume `r9e(...)` at the exact lines (NEe loop / pre-checkPermissions filter `!r9e` / `yjo` display / `--allowed-tools` cliArg) | PASS |

> Note: `yjo` *declaration* is at 598265; the cited 598268 is the `r9e(...)` consumption line inside it (the load-bearing line). Acceptable.

### denial_reasons_surfacing.md

| Cited | Doc claim | Verified | Result |
|---|---|---|---|
| 640262 | `recordDenial` call stores `reason` | `r({ toolName:d.name, display:I, inputKey:sdc(d.name,p), reason:v.decisionReason.reason??"", timestamp:Date.now() })` (`r({` at 640263, within the 640262–640269 header range) | PASS |
| 640271 | toast truncation + reason line | `if(((k=v.decisionReason.reason??""),k.length>80)) k=`${k.slice(0,79)}…`` @640271; `k ? OOe.jsxs(w,{dimColor:!0,children:[" · ",k]}) : null` reason child | PASS |
| 546589 | recent-denied reason spread | `...(M.reason ? { description: M.reason, dimDescription: !0 } : {})` — exact line | PASS |
| 382614 / 382624 | `XKa` 5-way taxonomy / `USe` `return !1` | `function XKa(e){ if(e.behavior==="ask") return "user-rejected"; … return "permission-rule"; }` / `function USe(){ return !1; }` | PASS |
| 382627 | `aSo` parse-fail prefix | `var aSo = "Auto mode could not evaluate this action and is blocking it for safety"` | PASS |
| 383163 | `qGp` consumes `toolDenialKind` | `qGp(e.resultInfo.isError, e.resultInfo.toolUseResult, r, e.resultInfo.toolDenialKind)` | PASS |
| 395284 / 395293 | `dQa`/`pQa` approval map (carryover) | `function dQa(e,t,n){…r.approvals…}` / `function pQa(e,t){…classifierApprovals.approvals…}` | PASS |
| 546166 / 546192 / 546199 | `r4l`/`oSt`/`VLf=20` store | `function r4l(e){` / `function oSt(){ return rSt.useContext(n4l); }` / `VLf = 20` | PASS |
| 382990,382991,445167,462587,599612,599637 | `toolDenialKind` write/struct sites (`USe()?…:void 0`) | all present; 7 grep lines total (incl. 383163) | PASS |

### sandbox_credentials.md

| Cited | Doc claim | Verified | Result |
|---|---|---|---|
| 54048 / 54058 / 54069 / 54079 | `kwr` / `Rwr` / `IEu` / `Lwr` schema decls | `(kwr = Ce(()=>…` @54048; `(Rwr = Ce(()=>…` @**54058** (was cited 54059 — fixed); `(IEu = Ce(()=>…` @54069; `(Lwr = Ce(()=>…` @54079 | PASS (1 fix) |
| 54095 | `credentials: IEu()` wired into root | `credentials: IEu(),` @**54095** (was cited 54096 — fixed) | PASS (fix) |
| 219468–219476 | credentials assembly over `jT`, `p3e` per-source | `let C=[],x=[],I=!1; for(let $ of jT){ … p3e(G.path,$) …}` (`jT`@219471, `p3e`@219474 exact) | PASS |
| 211660 | `Rqi` resolveCredentialProtection | `function Rqi(e,t){ if(!e) return {denyReadPaths:[],unsetEnvVars:[],setEnvVars:{}}; …}` verbatim incl. deny/mask branches | PASS |
| 211667 / 211671 | mask branch / `FRn.register` call | `else if(i.mode==="mask")` @211667; `s[i.name]=FRn.register(i.name,a,l)` @211671 | PASS |
| 211677 | `Yjd` folds credential deny-read | `function Yjd(){ … let e=[...new Set([...Ya.filesystem.denyRead, ...Rqi(Ya.credentials,Ya.network.allowedDomains).denyReadPaths])] …}` | PASS |
| 209627 / 209631 | `v7r` registry class / `register` method | `class v7r {` @209627; `register(e,t,n){ … let o=fVi+mVi.randomUUID(); … return …,o }` @**209631** (was cited 209633 — fixed) | PASS (fix) |
| 211560 | `allowPlaintextInject` gate | `mutateHeadersPlaintext: Ya?.credentials?.allowPlaintextInject ? r : void 0` | PASS |
| 212031 | `FRn` instantiation | `(FRn = new v7r())` | PASS |

### org_model_restrictions.md

| Cited | Doc claim | Verified | Result |
|---|---|---|---|
| 102806 / 102809 / 102814 / 102820 | `u7u` / `d7u` / `NFe` / `Uge` | `function u7u(e){ return to(Fa(e.trim().toLowerCase())); }` / `function d7u(e){ … if(!n.entitled) t.add(u7u(n.apiName)); …}` / `function NFe(e,t){ if(t.size===0) return !1; …}` / `function Uge(){ let e=_r(); if(e!=="firstParty"&&e!=="gateway") return new Set(); return d7u(kOr()); }` | PASS |
| 102873 / 102880 | `Ia` decl / `NFe` clause | `function Ia(e,t){…}` @102873; `if (NFe(e,Uge())) return !1;` @102880 (inside `if(t?.allowlist===void 0)`) | PASS |
| 103166 / 103185 | default-model filters | `if(!((dB(a)??Ia(a)) && !NFe(a,Uge())))` @103166; same `…(i)…` @103185 | PASS |
| 103207 / 103212 | `aw` / `u_n` | `function aw(){ … return u_n(r)??r; }` @103207; `function u_n(e){ let t=Uge(); …}` @**103212** (was cited 103211 = aw's `}` — fixed) | PASS (fix) |
| 487243 / 487247 / 487250 | `tzt` decl / `denied_by_entitlement` / "Run /model…" | `async function tzt(e){…}`; `Re("model_switch","denied_by_entitlement")` @487247; `…Run /model to choose a different model.` @487250 | PASS |
| 559212 / 560675 / 560710 | `tzt` callers | `await tzt(n)` / `tzt(n).then(...)` ×2 — all present | PASS |
| 374018 / 374023 | `Qft` / `rre` (carryover warning) | `function Qft(e){…}` / `function rre(e,t){ return `Model "${Qft(e)}" is restricted by your organization's settings. Using ${Qft(t)} instead.`; }` | PASS |

### recent_denied_overlay.md

| Cited | Doc claim | Verified | Result |
|---|---|---|---|
| 547100 | `H4l` PermissionsOverlay | `function H4l(e){…}` | PASS |
| 547334 / 547339 / 547353 | close handler / retry branch / **approved branch removeDenial** | `let Ke=b.current` @547334; `Qt=Dt(Ke.retry); if(Qt.length>0){…o(dt)…metaMessages…}`; approved: `if(Xn.length>0||d.length>0){ for(let Sn of Xn) i(Sn); …metaMessages… }` @547353 | PASS |
| 219238 | `_Wd` addSessionAllowedHost | `function _Wd(e){ if(BLn.has(e)) return; (BLn.add(e), hJr()); }` | PASS |
| 219287 / 219748 / 219833 | `BLn` merge / clear / decl | `for(let $ of BLn) s.push($)` @219287; `BLn.clear()` @219748; `BLn = new Set()` @219833 | PASS |
| 218789 | `Wb="WebFetch"` (domain-rule check) | `var Wb = "WebFetch"` | PASS |

### background_subagent_permission_forwarding.md

| Cited | Doc claim | Verified | Result |
|---|---|---|---|
| 430515 / 430516 | `let O=k&&R` / upfront named-spawn block | `let O = k && R;` @430515; `if (t!==void 0 && !k){ let Se=p9e(y,is,t); if(Se) throw(Re("subagent_launch","subagent_type_denied"), new E9e(`Agent type '${t}' has been denied by permission rule '${is}(${t})' from ${Se.source}.`)); if(I && !I.includes(t)){…wPe…}}` — verbatim | PASS |
| 597589 / 597592 | `p9e` / `wPe` matchers | `function p9e(e,t,n){ return i6(e).find(...)||null; }` / `function wPe(e,t,n){…}` | PASS |
| 430268 | `Wil` resolveForkAgentAvailability | `function Wil(e,t,{toolPermissionContext:n}){ if(!R7()||e.some((o)=>vht(o.agentType)===L7)||…)…}` | PASS |
| 150806 | `is="Agent"` | `var is = "Agent"` | PASS |
| 640151 / 426557 | `rdc` / `M8n` (carryover) | `async function rdc(e){ if(!Ja()||!pht()) return null; …}`; `function M8n(e){ let t=e.teamName||dp(), n=e.workerId||tD(), r=e.workerName||Sh(), o=e.workerColor||KT(); …}` (workerName@426560, workerColor@426561) | PASS |

**C1 result:** ~85/85 cited v2.1.193 anchors verified. Zero fabricated lines, zero wrong-token / wrong-decl FAILs. Four cites carried a ±1–2 line drift (each pointing at the right declaration region) — all corrected in place (see "Defects fixed").

---

## C2 — Before-picture spot-check (183 / 156 bundles)

| 183 cited line | Doc claim | Verified in 183 | Result |
|---|---|---|---|
| 409907 | `WGe` (183 r9e predecessor) had **no** classifyAllShell bypass | `function WGe(e,t){ let n=…; let o=Ijt(e,t)||kjt(e,t)||zuo(e,t); return (EGa.set(n,o),o); }` — no `sTo()`/Io/Ss clause | PASS |
| 627443–627470 | 183 toast middle child literally `null`; `k` assigned, never rendered | `let k=""` then `rde.createElement(rde.Fragment,null, …" denied by auto mode"), null, …" · /permissions")` — `null` middle child; recordDenial already stores `reason` | PASS |
| 535619 (range 535601–535621) | 183 recent-denied option had empty `...{}` spread | `...{}` present @535619, inside the cited option-builder range | PASS |
| 536356 / 536369 | 183 overlay close: retry branch carryover; approved branch **cosmetic** (no removeDenial/metaMessages) | retry: `o(An)`+"Permission granted for:" @536356; approved: `n([...An,...u].join("\n"))` only @536369 | PASS |
| 362631 | 183 `rre` "Using X instead" warning (carryover) | `…is restricted by your organization's settings. Using ${hlt(t)} instead.` (uses `hlt`, 193 uses `Qft`) | PASS |
| 423564–423576 (cited 423565) | 183 spawn: fork-deny then `let L=x&&I`, **no** upfront named-type block | `x=t!==void 0&&Yut(t)===_7; {available:I,denyRule:k}=gqa(...); if(x&&k) throw(… `${_7}` …); let L=x&&I;` | PASS |
| 103156 | `$Cr` was **isSubagent** in 183 (re-mangle proof) | `function $Cr(e){ return e.agentType==="subagent"; }` | PASS |
| 383739 | `dQa` was `PNa` in 183 (carryover approval map) | `function PNa(e,t,n){ … r.approvals … s.set(t,{classifier:"auto-mode",reason:n}) …}` — byte-identical to 193 `dQa` | PASS |

**C2 result:** 8/8 named 183 before-pictures reproduced verbatim. The re-mangle cautions (`$Cr`=isSubagent→isClassifyAllShellEnabled; `PNa`→`dQa`; `WGe`→`r9e`; `gqa`→`Wil`) are all substantiated by reading the 183 declarations.

---

## C3 — False-delta hunt (grep counts re-run in 193 / 183 / 156)

The highest-value check. Each pattern run with `grep -c` (or `-cF` for strings) in **all three** bundles.

| Pattern | 193 | 183 | 156 | Doc claim | Verdict |
|---|---|---|---|---|---|
| `classifyAllShell` | 2 | 0 | 0 | NET-NEW (0→2) | **CONFIRMED net-new** |
| `toolDenialKind` | 7 | 0 | 0 | NET-NEW but dark (0→7) | **CONFIRMED net-new** |
| `k.length > 80` | 2 | 1 | 0 | toast adds 2nd (1→2) | **CONFIRMED** |
| `denyReadPaths` | 4 | 0 | 0 | NET-NEW (0→4) | **CONFIRMED net-new** |
| `unsetEnvVars` | 6 | 0 | 0 | NET-NEW (0→6) | **CONFIRMED net-new** |
| `denied_by_entitlement` | 1 | 0 | 0 | NET-NEW (0→1) | **CONFIRMED net-new** |
| `Run /model to choose a different model` | 1 | 0 | 0 | NET-NEW string | **CONFIRMED net-new** |
| `restricted by your organization's settings` | 2 | 1 | 0 | 183=1 (rre carryover), 193=+1 (tzt) | **CONFIRMED** (warning IS carryover) |
| `addSessionAllowedHost` | 5 | 0 | 0 | NET-NEW (0→5) | **CONFIRMED net-new** |
| `Permission granted for` | 2 | 1 | 1 | 183 retry carryover, 193 +approved | **CONFIRMED** |
| `has been denied by permission rule` | 3 | 2 | 1 | REFINEMENT (2→3, +1 upfront site) | **CONFIRMED** |
| `subagent_type_denied` | 3 | 2 | 1 | REFINEMENT (2→3) | **CONFIRMED** |
| `pendingWorkerRequest` | 7 | 7 | 7 | CARRYOVER (7=7) | **CONFIRMED carryover** |
| `permission_swarm_forward` | 2 | 2 | 2 | CARRYOVER (2=2) | **CONFIRMED carryover** |
| `workerColor` | 7 | 7 | 8 | CARRYOVER (7=7 vs 183) | **CONFIRMED carryover** |
| `allowedAgentTypes` | 19 | 19 | 17 | CARRYOVER (19=19 matcher) | **CONFIRMED carryover** |

Additional supporting greps: 183 `dimDescription`=13 (the *token* pre-exists — the doc correctly claims only the recent-denied per-row **reason render** is new, not the token); 183 `function $Cr`=isSubagent; 183 `function PNa` body identical to 193 `dQa`.

**False deltas caught: 0.** Every NET-NEW symbol is genuinely absent in 183 *and* 156. Every CARRYOVER symbol's 183 count matches 193 exactly. Every REFINEMENT shows the claimed +1 enforcement site. The single most important adversarial trap — the `rre` "restricted by your organization's settings" phrase, which exists in 183 (count 1) — is **correctly disclosed by the docs as carryover**, with the genuinely-new string isolated as `…Run /model to choose a different model.` (183=0). No claim is inflated.

---

## C4 — Mapping / readable-rewrite correctness

Every obf→readable mapping was checked by reading the decl body, not the token:

- `$Cr`→isClassifyAllShellEnabled (body iterates `Uys`, reads `autoMode.classifyAllShell===!0`) — correct; the doc's repeated re-mangle caution (`$Cr`=isSubagent in 183) is verified at 183:103156.
- `r9e`→isShellAllowRuleSuspended, `sTo`→shouldSuspendAllShellAllowRules, `mqt`/`hqt`/`oTo`/`$rl`/`Orl` — all bodies match the readable names.
- `XKa`→classifyToolDenialKind (5 string returns), `USe`→isToolDenialKindEnabled (`return !1`), `aSo`=parse-fail prefix string — correct.
- `Rqi`→resolveCredentialProtection (deny→unset / mask→register-sentinel), `Yjd`→buildSandboxFsDenyRead, `FRn`/`v7r`→secretInjectionRegistry (`register` returns sentinel) — correct.
- `d7u`/`NFe`/`Uge`/`u_n`/`aw`/`Ia`/`tzt`/`rre`/`Qft` — every body matches; `Uge` is genuinely empty unless `firstParty`/`gateway` (the inert-for-non-org safety property is real).
- `_Wd`/`BLn`/`hJr`, `H4l`/`f4l`/`wt`, `p9e`/`wPe`/`Wil`/`is`, `rdc`/`M8n`/`pendingWorkerRequest` — all confirmed.

No mislabels found.

---

## Defects fixed in place

All four defects were ±1–2 line citation drifts (the cite named a declaration whose exact line was 1–2 off; the snippet *bodies* and the *range* headers were already correct). No substantive content was wrong.

1. **`credentials: IEu()` wiring cited `:54096` → actual `:54095`.** Fixed 5 occurrences (`sandbox_credentials.md` §1 header + ORIGINAL comment + evidence-note row + Related-Symbols line; `symbol_additions` `Lwr` row). `grep -n 'credentials: IEu()'` = 54095.
2. **`Rwr` (secretEnvEntry) decl cited `:54059` → actual `:54058`.** The `(Rwr = Ce(() =>` declaration line is 54058 (54059 is its inner `A.object({`); 54058 is consistent with how `kwr`@54048 / `IEu`@54069 / `Lwr`@54079 are cited. Fixed 3 occurrences (`sandbox_credentials.md` evidence note + Related Symbols; `symbol_additions` `Rwr` row).
3. **`FRn.register` cited `:209633` → register method decl `:209631`.** 209633 is 2 lines into the `register` method body; the method header is `register(e,t,n) {` @209631, and the actual `FRn.register(...)` *call* is @211671. Fixed 4 occurrences in `sandbox_credentials.md` and clarified the `symbol_additions` `FRn` row to `209631 (register method; call site :211671)`.
4. **`u_n` (resolveRestrictedModelFallback) decl cited `:103211` → actual `:103212`.** 103211 is `aw`'s closing `}`; `function u_n(e) {` is 103212. Fixed 5 occurrences (`org_model_restrictions.md` evidence note + Related Symbols; `README.md` delta table + Related Symbols; `symbol_additions` `u_n` row).

Post-fix grep confirms zero stale `:54096` / `54059` / `209633` / `:103211` cites remain and the new cites are present.

---

## Residuals (honest, non-blocking)

- **`toolDenialKind` enumeration vs count.** The docs correctly state the grep count is 7 (183=0→193=7) but enumerate 5 write sites + the `qGp` consumer = 6 named anchors; the 7th line (382991, the `t.set(..., {…, toolDenialKind: i})` struct write paired with 382990's `i = o ? n.toolDenialKind : void 0`) is implicitly folded into the "382990" reference. The count is accurate; the enumeration is one-short by treating the read/write pair as one site. Not corrected (defensible).
- **`Ia` NFe clause context.** The org-model §4 snippet shows `if (NFe(e, Uge())) return !1;` without the enclosing `if (t?.allowlist === void 0) {` guard. The clause only fires when no explicit allowlist override is passed — which the picker/default paths satisfy — so the doc's conclusion holds; the simplification is acceptable.
- **`## Related Symbols` links to `../00_overview/symbol_index_*.md`.** Present in list format (CLAUDE.md-compliant) in every doc, but those four central index files do not yet exist under `claude_code_v_2.1.193/analyze/00_overview/` (only `symbol_additions_*` + `cross_validation_report_*`). This is the identical tree-wide consolidation gap flagged by the 183 reports; the docs are template-compliant. Deferred to Consolidate (not a permissions-specific defect).
- **Format compliance:** No obf→readable mapping TABLES appear in any module doc (only the central `symbol_additions` file has them). The cross-version re-mangle notes (`$Cr` 183/193, `WGe`→`r9e`, `gqa`→`Wil`, `PNa`→`dQa`) are stated inline in list/prose form — the allowed exception. Dual-version snippets keep the single-`====` header → ORIGINAL → READABLE → Mapping shape. English-only (the `·`/`…`/`\xB7` glyphs are verbatim source-string literals).

---

## Verdict

**PASS WITH FIXES** — confidence **HIGH**. The 38_permissions v2.1.193 delta analysis is among the most accurate audited: ~85/85 TARGET anchors verified at their exact lines with correct readable rewrites; 8/8 named 183 before-pictures reproduced verbatim (including the `$Cr`=isSubagent and `PNa`→`dQa` re-mangle proofs); and the full false-delta hunt (18 grep diffs × 3 bundles) found **zero false deltas** — every NET-NEW symbol is absent in both 183 and 156, every CARRYOVER matches 183 counts, and the adversarial `rre`-phrase trap is correctly disclosed as carryover. The only issues were four ±1–2 line citation drifts, all fixed in place. The deltas (classifyAllShell trust-collapse, denial-reason surfacing + dark `toolDenialKind`, `sandbox.credentials` deny-read/unset + staged mask, org entitlement model gate, approve-persists + session-allowed-hosts, Agent named-spawn upfront deny) and the carryover ledger (worker-permission forwarding) are sound.
