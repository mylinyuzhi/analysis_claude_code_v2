# Reconstruction Conventions — Workflow / ultracode (v2.1.183, readable-source restoration)

> **Goal:** a *readable-source-level* restoration of the **entire** Dynamic-Workflow / `ultracode`
> subsystem **as it exists in Claude Code v2.1.183**, written as clean TypeScript organized the way
> the genuine Anthropic source tree (v2.1.88 named-TS at `/lyz/codespace/3rd/claude-code/src`)
> organizes it. This is NOT a delta doc — reconstruct the *whole machine*, including the parts that
> are carryover from v2.1.156.

## Three evidence tiers (do not confuse them)

1. **PRIMARY — the v2.1.183 obfuscated bundle**
   `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
   **Every** reconstructed function, constant, branch, and string MUST be verified by *reading the
   exact line(s)* here. This is the only source of truth for behavior. Obfuscated names re-mangle
   every build — never trust a name from another version; re-derive it here.

2. **SCAFFOLD — the v2.1.156 baseline analysis docs**
   `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/42_workflow/`.
   These already contain detailed *readable logic* and established *readable names* for the unchanged
   spine (compile/VM/DSL/determinism/subagents/journal/meta/source/gate). Use them to (a) inherit
   consistent readable names and (b) jump-start the logic — but **re-verify every claim against the
   v2.1.183 bundle** (lines + obf names differ). Treat as a strong hint, not gospel.

3. **CONVENTION ONLY — the v2.1.88 named-TS source**
   `/lyz/codespace/3rd/claude-code/src`. The Workflow feature is **stripped/gated** here
   (`feature('WORKFLOW_SCRIPTS')`), so there is **no implementation to copy** — only the *shape*:
   file layout, naming idioms, the `Tool`/`buildTool` factory, Zod v4 usage, `feature()` gates,
   ESM `.js` import specifiers on `.ts` files, React/Ink `.tsx` for UI, the `local_workflow` task
   type (`Task.ts`, id-prefix `'w'`), and the referenced (gated-out) paths
   `tools/WorkflowTool/WorkflowTool.tsx`, `tools/WorkflowTool/bundled/index.ts`,
   `tools/WorkflowTool/createWorkflowCommand.ts`, `commands/workflows/index.ts`,
   `tasks/LocalWorkflowTask/LocalWorkflowTask.ts`. Mirror these conventions; cite the 2.1.88 file
   when you borrow a convention.

## File format (each reconstructed `.ts`/`.tsx`)

- Clean, idiomatic, **readable** TypeScript — what the original source plausibly looked like. Prefer
  the readable names already used in the 2.1.156 baseline + the 2.1.183 delta docs (e.g.
  `isWorkflowsEnabled`, `matchKeyword`, `findUltracodeKeyword`, `parseWorkflowMeta`,
  `resolveWorkflowSource`, `computeWorkflowConcurrency`, `isNonDeterministic`).
- **Every** top-level function/const carries an anchor comment tying it to evidence, e.g.
  `// 2.1.183: isWorkflowsEnabled = Pw @cli_inner_pretty.js:148784`. Non-trivial branches get inline
  `// @<line>` anchors so a reviewer can re-verify any line.
- **File header block** (top of file) listing: the v2.1.183 source regions covered, the 2.1.88
  convention mirror (path), the 2.1.156 baseline section used as scaffold, and a one-line
  cross-validation note (what you re-verified in the 183 bundle).
- **No invented behavior.** If a detail can't be confirmed in the 183 bundle, either omit it or mark
  `// UNVERIFIED: …` and report it in your manifest. Faithful-to-source beats plausible-but-guessed.
- Keep obfuscated single-letter locals only where readability doesn't suffer; otherwise rename to
  intent-revealing names and note the mapping in a trailing `// Mapping: …` comment for that function.
- English only.

## Anchor-comment style (so reviewers can re-verify fast)

```ts
/**
 * 4-layer enablement gate. Logic-equivalent to v2.1.156 `NZ`; re-derived for v2.1.183.
 * 2.1.183 regions: cli_inner_pretty.js:148777-148810
 * 2.1.88 convention: gate helpers live beside the tool; `feature('WORKFLOW_SCRIPTS')` strips it externally.
 * 2.1.156 scaffold: 42_workflow/gate_caps_lifecycle_relations.md Part 1
 */
// 2.1.183: isWorkflowsEnabled = Pw @148784
export function isWorkflowsEnabled(): boolean {
  if (isWorkflowsManagedDisabled()) return false   // @148785  Kyn()
  if (!isWorkflowsPolicyAllowed()) return false     // @148786  aAi()
  ...
}
```

## Naming consistency (reuse across files)

Reuse these readable names project-wide (sourced from the 2.1.156 baseline + 2.1.183 delta docs):
`isWorkflowsEnabled`(Pw), `isWorkflowsManagedDisabled`(Kyn), `isWorkflowsPolicyAllowed`(aAi),
`resolveWorkflowAvailability`(HJu), `getUserWorkflowSetting`(EJu), `isUltracodeKeywordTriggerEnabled`(Jyn),
`matchKeyword`(hho), `findUltracodeKeyword`(yho), `hasUltracodeKeyword`(Qel),
`makeWorkflowKeywordReminder`(o4p), `WORKFLOW_DESCRIPTION`(gdo), `workflowTool`(DLp),
`workflowInputSchema`(CLp), `workflowOutputSchema`(ILp), `serverFallbackRetraction`(r5a),
`abortedByServerFallback`(zCe), `resolveWorkflowSource`(n5a), `parseWorkflowMeta`(m0),
`isNonDeterministic`(rWa), `computeWorkflowConcurrency`(K0p), `agentContext`(Dt),
`normalizeEffort`(rB), `workflowsCommand`(jmf), `isUltracodeOption`(T4), `supportsXhighEffort`(hTe),
`resolveEffort`(ZQ), `WORKFLOW_AGENT_CAP`(_Wa=1000), `WORKFLOW_STALL_MS_DEFAULT`(rLp=180000),
`WORKFLOW_REMOTE_DEFAULT`(X0p=50), `WORKFLOW_SCRIPT_MAX_BYTES`(A2=524288).

If you discover a NEW symbol not in the above or in `00_overview/symbol_additions_v2_1_183_workflow.md`,
record it in your manifest so it can be added to the symbol index.
