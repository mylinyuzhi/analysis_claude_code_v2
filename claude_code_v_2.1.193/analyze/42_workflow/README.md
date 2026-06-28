# 42 — Workflow / Structured Output (v2.1.183 → v2.1.193, EXTEND)

> Delta module: documents the **v2.1.183 → v2.1.193** changes to the Workflow VM's `agent({schema})` StructuredOutput call-control and the `/workflows` agent-detail view.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, VERSION `2.1.193`, build `a1938d2a`, BUILD_TIME `2026-06-25T18:18:11Z`). Every `cli_inner_pretty.js:<line>` below is a **193** line unless tagged *(183)*.
> BEFORE-PICTURE: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
> **CANONICAL for the runtime / VM spine (everything unchanged):** the v2.1.183 tree [`../../../claude_code_v_2.1.183/analyze/42_workflow/`](../../../claude_code_v_2.1.183/analyze/42_workflow/README.md) — the JS-sandbox runtime (`createContext`/`runInContext`), the `pipeline(`/`parallel(`/`phase(` builtins, the `agent()` builtin contract, and the `Workflow` tool. Obfuscated names are **re-mangled every build** — none from 183 are reused here; all 193 obf names were re-derived by line.

---

## TL;DR — three small call-control deltas on an unchanged VM spine

The Workflow VM (the sandbox, the builtins, the `agent({schema})` contract, the `WORKFLOW_TOOL_NAME = "Workflow"` constant `Rw` @`229559`) is **structurally identical** to 183. The per-agent runner `wt` (`async function wt(tt,nt,Rt,$t)` @`423705`) is the same function with **surgical insertions**. This window's genuine, source-backed deltas are three changelog bullets, all patching how StructuredOutput calls are *controlled*:

1. **NET-NEW (2.1.187): no infinite StructuredOutput re-call after a success; follow-up turns reliably return structured output.** Two cooperating mechanisms — a workflow-loop **success guard** (`dt !== void 0 && sr > 2 → abort("stalled")`, the catch returning the captured output cleanly) and a brand-new `requiresStructuredOutput` query option whose **inline, gated enforcement** in `vbl` (@`465638`) *replaces* the old 183 **Stop hook** `zKn` (@`575795`, 183). `requiresStructuredOutput` and the `[structured-output-enforce]` sentinel are **0 in 183**. → [`structured_output_call_control.md`](./structured_output_call_control.md) §1
2. **NET-NEW wiring (2.1.186): `agent({schema})` aborts after 5 schema-validation failures.** A net-new failure counter + cap (`Mr >= kn`, `kn = MAX_STRUCTURED_OUTPUT_RETRIES ?? NYp`, `NYp = 5`) throws a `DualError` so an in-process workflow subagent can no longer loop forever on repeated validation failures. The cap *concept* already existed for `--json-schema` print mode (CARRYOVER); what ships is applying it to the workflow loop. `"StructuredOutput retry cap"` is **0 in 183**. → [`structured_output_call_control.md`](./structured_output_call_control.md) §2
3. **NET-NEW filter (2.1.186): a `f`-key status filter in the `/workflows` agent-detail view.** A status-filter cycle (`f` → all/running/queued/failed/done/skipped/interrupted, skipping statuses no agent currently has) layered on an otherwise carryover detail component. `f filter`, the cycle array, and the `key === "f" && S === "agents"` handler are all **0 in 183**. → [`workflows_detail_status_filter.md`](./workflows_detail_status_filter.md)

**Confidence: high for all three** (each proved with a before/after read + grep-count diff in this round). The remainder of the workflow subsystem — sandbox, builtins, `agent()` doc string, the `Workflow` tool, the stall-retry loop (`kol = 5`, @`424306`, distinct from `NYp`) — is **re-mangled carryover**.

---

## What changed at a glance

| # | Delta | Kind | 193 anchor | 183 before | Confidence |
|---|-------|------|------------|------------|:----------:|
| B1a | StructuredOutput success guard (stop re-calling after a captured result) | **NET-NEW** | guard `423840`, abort `423841`, catch `423852-423875` | runner only counted attempts (`417279`, 183) | high |
| B1b | `requiresStructuredOutput` inline enforcement (replaces the 183 Stop-hook) | **NET-NEW** (refactor + fix) | `vbl` `465638`; `Ibl` `601998`; `Hbl` `465901` | Stop hook `zKn` `575795` (183); `grep -c requiresStructuredOutput`=0 (183) | high |
| B2 | `agent({schema})` 5-failure retry cap → abort | **NET-NEW** wiring | cap `423782`, count `423819`, throw `423822-423826`; `NYp=5` `424307` | runner had no counter/cap (`417266-417272`, 183); cap string=0 (183) | high |
| B2′ | print-mode `--json-schema` 5-retry cap | **CARRYOVER** | `704023-704054` | byte-equiv `685293-685320` (183); `error_max_structured_output_retries` 5× both | high |
| B3 | `/workflows` detail `f` status filter | **NET-NEW** filter on carryover host | state `542947`, cycle `543007`, key `543081`, hint `543128`, order `543272` | host component present; `f`/cycle/hint all grep=0 (183) | high |
| — | Workflow VM spine (sandbox, builtins, `agent()` doc, `Workflow` tool, runner shape) | **CARRYOVER** | runner `wt` `423705`; `Rw="Workflow"` `229559` | runner line-for-line vs 183 `417238+` | high |

---

## Module docs

- [`structured_output_call_control.md`](./structured_output_call_control.md) — bullets 1 + 2 together (they patch the same `wt` runner): the success guard, the `requiresStructuredOutput` inline enforcement and why it replaced the 183 Stop-hook, the `Ibl`/`Hbl` dedup, and the 5-failure retry cap (with the print-mode-carryover caveat).
- [`workflows_detail_status_filter.md`](./workflows_detail_status_filter.md) — bullet 3: the `f`-key filter, `eYt` cycle order, empty-status skipping, footer hint, on a carryover detail component.

Related sibling 193 deltas: workflow-spawned agents carry a `depth` (`K3(pe)+1` @`423707`) that feeds the shared 5-level subagent depth cap documented in [`../36_background_agents/subagent_depth_tracking.md`](../36_background_agents/subagent_depth_tracking.md). The Agent-tool teammate routing is in [`../30_agent_team/`](../30_agent_team/README.md).

## Related Symbols

> Symbol mappings live in the central index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Agent Loop, Tools, Subagent)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Workflow** is indexed here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - per-feature additions: [symbol_additions_v2_1_193_workflow.md](../00_overview/symbol_additions_v2_1_193_workflow.md)

Key symbols in this module:
- `STRUCTURED_OUTPUT_TOOL` (`Ep`, `:229498`) — the `"StructuredOutput"` tool-name constant.
- `STRUCTURED_OUTPUT_BASE_TOOL` (`$Qr`, `:229509`) — always-enabled, read-only, concurrency-safe, closed-world tool object; prompt/description/search hint, `maxResultSizeChars:100000`, `endsTurn:true`, and compact JSON-stringified `renderToolUseMessage` are defined here.
- `workflowAgentRunner` (`wt`, `:423705`) — the per-`agent({schema})` runner hosting all of bullets 1 and 2.
- `requiresStructuredOutput` (query option, 8× @ `:398601`/`:423795`/`:465638`/…) — force-StructuredOutput flag (NET-NEW).
- `enforceStructuredOutputNudge` (`vbl`, `:465576`) / `structuredOutputSucceeded` (`Ibl`, `:601998`) / `ENFORCE_SENTINEL` (`Hbl`, `:465901`) — the inline enforcement trio.
- `DEFAULT_SO_RETRIES` (`NYp`, `:424307`) — the workflow `agent({schema})` retry cap (`5`).
- `workflowDetailFilterOrder` (`eYt`, `:543272`) / `agentStatus` (`D$e`, `:541975`) — the `/workflows` detail status filter.
