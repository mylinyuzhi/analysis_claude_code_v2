# Cross-Validation Report — System-Prompt Construction module (v2.1.183)

**Module:** System-prompt construction (assembler + identity + builders + env + cacheable sections + sub-agents)
**Reconstructed files:** `40_system_prompt/reconstructed_source/**/*.ts` (6 files)
**Bundle of record:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
**Method:** Adversarial, default-to-fail. 35 load-bearing anchors opened directly in the bundle; decl/obf-id + control-flow + byte-exact strings re-checked. Several claims re-derived from scratch without trusting the cited anchor (lean-gate cluster, identity selector, `$vp` head concatenation, `Su`/`JO` predicate semantics).
**Date:** 2026-06-23

---

## PASS / FAIL table

| # | File : symbol | Bundle anchor | What was checked | Verdict |
|---|---------------|---------------|------------------|---------|
| A1 | systemPromptType.ts : `getIdentityString` (l_n) + 3 identity strings | @149945-149961 | selector flow (`vertex`→base, NI+append→SDK_CLI, NI→SDK_AGENT, else base) + 3 verbatim strings | PASS |
| A2 | systemPromptType.ts : `asSystemPrompt` (Wc) | @360521-360523 | identity brand `function Wc(e){return e;}` | PASS |
| A3 | systemPrompt.ts : lean-gate cluster `cme`/`C8u`/`I8u`/`Dg` | @134232-134273 | eap regex, isFullPromptModel model list, isForcedLeanModel clientData/cascade, memoized 4-step precedence | PASS |
| A4 | systemPrompt.ts : `isSimplePromptMode` (n0o) | @580858-580860 | `return Ge.CLAUDE_CODE_SIMPLE` | PASS |
| A5 | systemPromptSections.ts : `Jx` + `O8a` + `iLe` | @429774-429789 | factory `cacheBreak:!1`, resolver memo, `iLe=(lyt(),dyt())` | PASS |
| A6 | systemPrompt.ts : `buildEffectiveSystemPromptSections` (KL) | @580888-580940 | SIMPLE short-circuit, full registry (25 entries) order+gates, head ternary, boundary, attachments, filter | PASS |
| A7 | prompts.ts : `getEnvBlockSimple` (D_f) | @581006-581039 | full body byte-exact incl. worktree/git/platform/shell/os/model/cutoff/model-list/CLI/fast-mode | PASS |
| A8 | prompts.ts : `FRONTIER_MODEL_IDS`/`getModelIds` (wPe) | @581254-581259 | fable/opus/sonnet/haiku id map | PASS |
| A9 | system.ts : `CYBER_RISK_INSTRUCTION` (Jko) | @580615-580616 | verbatim security-testing clause | PASS |
| A10 | system.ts : `buildSystemSection` (__f) | @580719-580730 | 6-clause order incl. `<system-reminder>` convention + hooks slot | PASS |
| A11 | prompts.ts : `buildHooksClause` (f_f) | @580670-580672 | verbatim hooks clause | PASS |
| A12 | system.ts : `buildToneAndStyleSection` (T_f) | @580848-580857 | 4 tone clauses + no-op filter + header | PASS |
| A13 | prompts.ts : `getLeanHarnessIntroSection` (w_f) | @580861-580881 | 4 ownership×output-style intro variants + cyber-risk + 5 `# Harness` bullets | PASS |
| A14 | prompts.ts : `isOwnershipFrameEnabled` (t0o) | @581260-581266 | memoized env-or-`tengu_walnut_prism`(default !1), debug log source | PASS |
| A15 | systemPrompt.ts : `investigateFirstMode` (i0o) + U_f | @581166-581178 | opus-4-7 scope, env passthrough, lean→off, `tengu_slate_harrier` default off | PASS |
| A16 | systemPrompt.ts : `isDynamicBoundaryEnabled` (Xve) | @134600-134605 | `$M() && Pu() && (firstParty|anthropicAws)` | PASS |
| A17 | prompts.ts : `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` (hoe) | @53897 | `"__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__"` | PASS |
| A18 | systemPrompt.ts : `mergeSystemPrompt` (bW) | @362647-362665 | override→coord→agent(builtin/regular)→memory-telemetry→append branch→default precedence | PASS |
| A19 | prompts.ts : `DEFAULT_AGENT_PROMPT` (NBa) | @581198-581199 | verbatim default-agent contract sentence | PASS |
| A20 | prompts.ts : `getDefaultAgentPrompt` (\$vp) | @384820-384835 | head (inline 2-literal concat == NBa) + strengths/guidelines block | PASS |
| A21 | subagents.ts : `buildExplorePrompt` (Gbp) head+seams | @371916-371925 | Su/ns/Xs/Qw seam resolution + verbatim head | PASS |
| A22 | subagents.ts : `EXPLORE_WHEN_TO_USE`/`_LEAN` (Wbp/qbp) | @371969-371971 | both verbatim | PASS |
| A23 | subagents.ts : `getCoordinatorSystemPrompt` (bvd) head | @221940-221955 | search-list, workers-tools line (`${Fa}` Edit slot), workflow bullet, verbatim role head | PASS |
| A24 | subagents.ts : Plan def (k5n) + `PLAN_WHEN_TO_USE` | @472041-472052 | whenToUse verbatim, model `inherit`, omitClaudeMd, getSystemPrompt zGp | PASS |
| A25 | subagents.ts : Explore def (uce) | @371986-371996 | disallowedTools `[vs,yx,Fa,Kc,xL]`, model `haiku`, getSystemPrompt Gbp | PASS |
| A26 | systemPromptSections.ts : date_change reminder | @590594 | verbatim "The date has changed…already aware." | PASS |
| A27 | systemPromptSections.ts : `detectDateChangeAttachment` (ftl) | @464855-464864 | today/prr/SCe gating + dedupe loop + emit | PASS |
| A28 | prompts.ts : `getKnowledgeCutoff` (r0o) | @581075-581087 | all model→cutoff mappings | PASS |
| A29 | prompts.ts : `prependBullets` (pV) | @580709-580711 | flatMap nested `  - ` vs scalar ` - ` | PASS |
| A30 | prompts.ts : `getScratchpadInstructions` (HUn) | @581135-581155 | MX/bg/B_e gates + verbatim scratchpad text | PASS |
| A31 | prompts.ts : `getShellInfoLine` (o0o) | @581088-581098 | strings+branch order byte-exact; **predicate names mislabeled** (Su/JO) → FIXED | FIXED |
| A32 | prompts.ts : `getEnvBlockUname` (L_f) | @580976-581005 | `<env>` block byte-exact + model line + cutoff trailer | PASS |
| A33 | systemPrompt.ts : `CONTEXT_MANAGEMENT_SECTION` (\$_f) | @581200-581201 | `# Context management` const present (declared) | PASS |
| A34 | systemPrompt.ts : `buildAutonomyAppendSection` (A_f) | @580686-580696 | `tengu_amber_sextant` default TRUE + GQ gate + verbatim text | PASS |
| A35 | systemPrompt.ts : `buildHeronBrookSection` (m_f) | @580673-580684 | clientData-then-growthbook (default "") + telemetry | PASS |

---

## Counts

- **Sampled:** 35
- **Passed:** 34
- **Fixed:** 1
- **Flagged (structural, unfixed):** 0

---

## The one defect (fixed in place)

**`prompts.ts` `getShellInfoLine` (o0o @581088-581098) — predicate mislabel.** The bundle's Windows branch is `if (!Su()) return "Shell: PowerShell"; if (JO()) return "...Bash tool also available..."`. Re-deriving the two obf ids from scratch:

- `Su` @221433 = `Kt()!=="windows" || Cpe()!==null` → **`isPosixShell()`** ("a bash/POSIX shell is reachable"), NOT `isWindows()`.
- `JO` @221425 = `CLAUDE_CODE_USE_POWERSHELL_TOOL` + `tengu_cobalt_ridge` resolution → **`isPowerShellToolEnabled()`**, NOT a generic `hasBashTool()`.

The reconstruction had imported `{ isWindows, hasBashTool }` and named the branches `!isWindows()` / `hasBashTool()`. The **emitted strings and the branch order/negation were byte-exact and correct** (so no rendered-prompt divergence), but the helper names inverted the meaning of the gates — a reader would conclude the wrong condition produces the PowerShell-only line. Corrected the import to `{ isPosixShell, isPowerShellToolEnabled }`, renamed the two call sites, and added a NOTE documenting the verified `Su`/`JO` semantics with their bundle locations. Note `Su`=`isPosixShell` is consistent with how `subagents.ts` already maps `Su()` (Explore/Plan/coordinator seams), so this fix also reconciles a cross-file naming inconsistency.

## Minor naming notes (left as-is; no logic/string impact)

- `mergeSystemPrompt` memory telemetry: bundle wraps `Ne(e.memory)` / `Qe("main-thread")` (intern/redact helpers); reconstruction shows the bare values. Semantically equivalent.
- `getEnvBlockSimple`/`buildSimpleEnvSection` second arg: bundle `D_f(t,p,n)` passes `p`=`excludeDynamicSections` into the slot the `prompts.ts` reconstruction names `isTeammate`. Both files agree the second arg suppresses the fast-mode line; the divergent readable name is a documentation choice, not a logic error.
- Explore/Plan find-branch seam: reconstruction renders `${bashToolName}` where the bundle hardcodes `ns`; the branch only fires when `Su()` is true, so `bashToolName === ns` — identical output.

---

## Verdict

The System-prompt-construction module is a **high-fidelity reconstruction that PASSES** independent adversarial cross-validation. Across 35 load-bearing anchors spanning all six files — the lean-gate cluster (`cme`/`C8u`/`I8u`/`Dg`), the section assembler `KL` with its full 25-entry gated registry and head ternary, the merge precedence ladder `bW`, the identity selector `l_n`, every verbatim security/tone/`<system-reminder>`/env/scratchpad/cyber-risk literal, the cacheable-section factory + resolver (`Jx`/`O8a`) and the two out-of-band "uncached" mechanisms (`a0o` cache-scope split + `ftl` date attachment), and all five sub-agent surfaces (Explore `Gbp`, Plan `zGp`/`k5n`, general-purpose `$vp`/`NBa`, coordinator `bvd`, plus the Aqa description slices) — control flow, obfuscated-id bindings, gate predicates/defaults, and byte-exact strings all matched the live 2.1.183 bundle. The only defect was a localized predicate **mislabel** in `getShellInfoLine` (`Su`/`JO` named as `isWindows`/`hasBashTool`), which did not affect any rendered prompt text and has been fixed in place. No structural issues remain; nothing required flagging.
