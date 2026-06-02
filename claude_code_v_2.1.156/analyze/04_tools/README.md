# 04 — Tools Subsystem (v2.1.143 → v2.1.156 delta)

> **Module**: `04_tools/` — the tools-subsystem changes in the v2.1.143 → v2.1.156 window.
> **Bundle**: `cli_inner_pretty.js` (2.1.156 extract).
> **TypeScript reference**: `/lyz/codespace/3rd/claude-code/src/` (2.1.88 baseline) —
> `tools.ts`, `tools/AskUserQuestionTool/{prompt.ts,AskUserQuestionTool.tsx}`,
> `skills/loadSkillsDir.ts`, `utils/plugins/loadPluginCommands.ts`, `utils/api.ts`,
> `tools/FileReadTool/FileReadTool.ts`, `tools/FileWriteTool/FileWriteTool.ts`.
>
> **Scope note:** This is a *delta* tree, not a full re-analysis. The foundational tool-subsystem
> docs (factory, schema validation, permission pipeline, lifecycle, runtime executor, UI rendering,
> full tool inventory) live in `../../../claude_code_v_2.1.142/analyze/04_tools/` and remain
> structurally accurate for 2.1.156. This module documents only what *changed* between 2.1.143 and
> 2.1.156.

## TL;DR — what changed in the tools subsystem (2.1.143–156)

Four tools-subsystem deltas landed in this window, none of which rewrote the core contract — every
one rides on machinery that already existed in 2.1.142/2.1.88:

1. **Workflow tool registration (2.1.154).** The new `Workflow` tool (`n0_`) slots into the
   canonical built-in array `getAllBaseTools` (`ra`) through a lazy module slot `_H$`, spread in as
   `...(_H$ ? [_H$] : [])`. The *registration plumbing* is the same lazy-slot-then-spread idiom used
   by cron/monitor/powershell/agent-teams; what is genuinely new is that the old static
   `feature('WORKFLOW_SCRIPTS')` flag is **gone** — enablement is now a recomputed runtime gate
   (`isEnabled → NZ → KP6/SL5 + r$7/H48 + hL5`) plus a deny-rule filter.

2. **AskUserQuestion reservation (2.1.154).** The tool's prompt hook is now `prompt({ model })`. For
   lean/simple-system-prompt models (Opus 4.8 and the broader lean cohort, decided by `X3(model)`),
   it appends a "reservation" paragraph (`FUK`) telling the model to *withhold* the tool unless the
   user's answer genuinely changes the plan — a runtime-overridable inversion of the old
   invitational framing, gated by the `tengu_cinder_plover` feature gate.

3. **`disallowed-tools` skill/command frontmatter (2.1.143+).** Skills and slash commands can now
   *remove* tools while active via a `disallowed-tools:` frontmatter field — the deny-side mirror of
   `allowed-tools`. Inline commands append to `alwaysDenyRules.command` (cleared on the next user
   turn); forked commands emit a `{kind:"disallowed_tools"}` permission layer that auto-expires with
   the subagent.

4. **Read PARTIAL-view truncation (2.1.145) + streaming exec extended to Bedrock/Vertex (2.1.156).**
   Oversized whole-file Reads are salvaged into paginated excerpts marked `isPartialView` (so
   Edit/Write/dedup/@-mention refuse to treat them as full reads); and `eager_input_streaming` is
   extended from firstParty-only to Bedrock/Vertex via a new per-model `eagerInputStreaming`
   capability record. Streaming is **not** literally always-on: `buildToolSchema` (`w08`) gates it
   through a four-way per-provider/per-model conditional (firstParty+`tengu_fgts` | vertex+caps |
   bedrock+caps | env force), bracketed by an explicit-off env kill — `eager_input_streaming` is
   attached only when that branch fires (cli_inner_pretty.js:555990-555996).

**Cross-validation verdict:** the *registration mechanism*, the `isPartialView` consumer mesh, and
the firstParty streaming branch are byte-for-byte 2.1.88 precursors (confidence **high**). The
Workflow tool + its runtime gate, the model-gated AskUserQuestion reservation + the lean-prompt
predicate, the skill/command `disallowed-tools` frontmatter + permission-layer machinery, Read
truncation as an `isPartialView` *producer*, and the per-model `eagerInputStreaming` field are all
**NEW post-2.1.88**.

## Architecture overview — where each delta sits in the pipeline

```
                  ┌──────────────────────────────────────────────────────────┐
  REGISTRATION    │ getAllBaseTools (ra)  — static, exhaustive built-in array  │
  (delta #1)      │   ...(_H$ ? [_H$] : [])     ← Workflow lazy slot           │
                  │   filled once by k0 (T()-thunk), provider wired via iUK    │
                  └───────────────────────────┬──────────────────────────────┘
                                              │
                  ┌───────────────────────────▼──────────────────────────────┐
  ENABLEMENT      │ getTools (Jk) / getToolsForDefaultPreset (Xg6)             │
  (delta #1)      │   mask = tools.map(t => t.isEnabled())                     │
                  │   Workflow: isEnabled() → NZ() (H48→r$7→KP6/SL5→hL5)       │
                  │ assembleToolPool (zl): + deny filter (HqH) + skill/MCP     │
                  │   disallowed-tools removes tools here (delta #3)           │
                  └───────────────────────────┬──────────────────────────────┘
                                              │  surviving tools
                  ┌───────────────────────────▼──────────────────────────────┐
  SERIALIZATION   │ buildToolSchema (w08) per tool:                            │
  (delta #4b)     │   prompt(model)  ← AskUserQuestion reservation (delta #2)  │
                  │   eager_input_streaming  ← per-model caps (delta #4b)      │
                  │   cache key = "L:"?(lean) + "F:"?(stream) + name           │
                  └───────────────────────────┬──────────────────────────────┘
                                              │  wire tool schemas → model
                  ┌───────────────────────────▼──────────────────────────────┐
  EXECUTION       │ tool.call(...)  → e.g. Read readFileBody (gJ4):           │
  (delta #4a)     │   token-cap overrun → PARTIAL-view excerpt + isPartialView │
                  │   → Edit/Write/dedup/@-mention honor isPartialView         │
                  └────────────────────────────────────────────────────────────┘
```

### Key insight

Every one of these deltas was made *cheap* by reusing an existing seam rather than adding new
infrastructure:
- Workflow reuses the conditional-slot-spread idiom and the `isEnabled` filter — it added **no new
  registration machinery**, only a new gate function family that replaced a static flag.
- The AskUserQuestion reservation reuses the single memoized lean-prompt predicate `X3` instead of a
  tool-local model check, inheriting its env override, A/B gate, and per-model targeting for free.
- `disallowed-tools` reuses the same `IS`/`fc` tool-list parser as the CLI flag and the same
  `alwaysDenyRules.command` enforcement primitive — the new frontmatter field is just a new *source*
  for an existing deny channel (plus the new `permissionLayers` abstraction for the fork path).
- Read truncation reuses the `isPartialView` channel that Edit/Write/dedup already honored — a new
  *producer* on an existing *consumer mesh*; and eager streaming reuses the session-stable
  tool-schema cache and the existing `eager_input_streaming` overlay — the only new moving part is a
  per-model `eagerInputStreaming` capability table.

## Module Structure

| File | Topic | Status vs. 2.1.88 |
|------|-------|-------------------|
| `workflow_tool_registration.md` | How the Workflow tool (`n0_`) enters `getAllBaseTools` (`ra`) via the lazy `_H$` slot + `...(_H$ ? [_H$] : [])` spread, populated once in `k0`; the `isEnabled → NZ → KP6/SL5 + r$7/H48 + hL5` gate chain and deny-rule filter (`HqH`) that decide whether the model ever sees it; the IIFE that runs `initBundledWorkflows()` before reading the tool. | Plumbing has a direct `src/tools.ts` precursor (high); the runtime gate replacing the static feature flag is **NEW**. |
| `ask_user_question_reservation.md` | The 2.1.154 `prompt({ model })` change: the reservation paragraph (`FUK`) injected only when `X3(model)` (lean set, incl. Opus 4.8) is true, with a `tengu_cinder_plover` runtime override; the gate `X3 = !c45(model) \|\| d45(model)` and its helpers; composition order `base + reservation + preview`. | **NEW** — 2.1.88 `prompt()` took no model arg and had no reservation/gate. |
| `disallowed_tools_frontmatter.md` | The `disallowed-tools` skill/slash-command frontmatter field end to end: the Zod schema (`GL5`) + canonical `disallowedTools` alias, the `fc`/`IS` paren-aware parser, the inline path appending to `alwaysDenyRules.command` via `c28(...,"union")` with clear-on-next-message in `fI8` (replace mode), and the fork path emitting a `{kind:"disallowed_tools"}` layer folded by `T6 → fV8`. Includes "why deny is eager but allow is lazy". | **NEW** — skill/command frontmatter form + `permissionLayers`/`contextLayers` machinery are post-2.1.88; the agent `disallowedTools` field and `--disallowed-tools` CLI flag are the only precursors. |
| `read_partial_view_and_streaming_exec.md` | (P1) Read PARTIAL-view truncation (2.1.145): the line-then-char geometric-shrink algorithm in `readFileBody` (`gJ4`), the self-calibrating estimator, the two reminder phrasings, and how `isPartialView` is load-bearing across Edit/Write/dedup/@-mention. (P2) Streaming exec extended to Bedrock/Vertex (2.1.156), per-provider/per-model gated (not literally always-on): the four-way `eager_input_streaming` gate in `buildToolSchema` (`w08`) and the per-model `eagerInputStreaming` caps (`Ji$`/`Xi$`), plus the `"L:"`/`"F:"` cache-key tags. | `isPartialView` consumers + firstParty streaming branch are byte-identical precursors (high); Read-truncation *producer* + per-model `eagerInputStreaming` field are **NEW**. |

## Reading order

1. **`workflow_tool_registration.md`** — start here. It establishes the registration → enablement →
   filtering pipeline (`ra` → `Jk`/`Xg6` → `zl`) that the other docs reference, and explains the
   structural-vs-runtime gate split that is the dominant design theme of the window.
2. **`disallowed_tools_frontmatter.md`** — the subtractive counterpart to registration: how a
   skill/command *removes* tools from the assembled pool (`zl`) and how the new `permissionLayers`
   abstraction works (used again by the fork path and referenced from `10_skill_system/`).
3. **`ask_user_question_reservation.md`** — moves from *which* tools the model sees to *what prompt*
   one tool contributes, introducing the lean-prompt predicate `X3` (shared with `44_lean_prompt`
   and `43_model_opus48`).
4. **`read_partial_view_and_streaming_exec.md`** — finishes at runtime: how a tool's `call` (Read)
   degrades gracefully, and how the wire schema (`buildToolSchema`) gains `eager_input_streaming`.
   Reading it last is natural because its Part 2 cache-key discussion reuses the `X3` lean-prompt
   tag introduced in doc 3.

## Cross-version status summary

| Delta | First shipped | Precursor in 2.1.88? | Confidence |
|-------|---------------|----------------------|------------|
| Workflow tool registration plumbing (`ra`/`Jk`/`zl`/lazy slot) | (pre-existing idiom) | yes — `src/tools.ts` | high |
| Workflow runtime gate (`NZ/SL5/KP6/r$7/H48`) replacing static `feature('WORKFLOW_SCRIPTS')` | 2.1.154 | no | high (NEW) |
| AskUserQuestion `prompt({model})` + reservation (`FUK`) + `X3` gate + `tengu_cinder_plover` | 2.1.154 | no | high (NEW) |
| `disallowed-tools` on skill/command frontmatter (`GL5`, inline `c28`, fork layer) | 2.1.143+ | no (only agent field + CLI flag) | high (NEW) |
| `permissionLayers` / `contextLayers` abstraction | post-2.1.88 | no | high (NEW) |
| Read PARTIAL-view truncation producer (`gJ4` catch block → `isPartialView`) | 2.1.145 | no (consumer mesh existed) | high (NEW producer) |
| `isPartialView` consumer mesh (Edit/Write/dedup/@-mention guards) | (pre-existing) | yes — byte-identical | high |
| Per-model `eagerInputStreaming` Bedrock/Vertex caps | 2.1.156 | no | high (NEW) |
| firstParty `eager_input_streaming` branch (`Rz()` + `tengu_fgts`) | (pre-existing) | yes — byte-identical | high |

## Related modules

- `42_workflow/` — the Workflow tool's own schema / `validateInput` / `checkPermissions` / `call`,
  the runtime gate from the launch angle, and the coordinator-mode system prompt. This module
  documents only the *registration* wiring; `42_workflow/` documents the tool itself.
- `43_model_opus48/` — Opus 4.8 model id maps (incl. the `eagerInputStreaming` caps in P2 above) and
  effort levels.
- `44_lean_prompt/` — the lean/simple-system-prompt subsystem; `X3`/`c45`/`d45` (the AskUserQuestion
  reservation gate) are home symbols there.
- `10_skill_system/` — skills/slash-command loaders that parse `disallowed-tools`; the subtractive
  filter is applied after `zl`.
- `37_permission_policy/` — the broader allow/deny/ask policy engine that `alwaysDenyRules.command`
  feeds; deny beats allow, which is why `disallowed-tools` is enforced as a deny rule.
- `11_hooks/` — PreToolUse/PostToolUse hooks that bracket `tool.call`.
- `../../../claude_code_v_2.1.142/analyze/04_tools/` — the foundational (non-delta) tool-subsystem
  analysis: factory, schema validation, lifecycle, runtime executor, UI rendering, full inventory.

## Related Symbols

> Symbol mappings live ONLY in the central index files (and the per-module additions file below) —
> never as a table in these module docs:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools, Agent Loop, LLM API, State)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Workflows, Skills, Slash Commands)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Model, Prompt, Permissions, Gates)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - v2.1.156 tools additions: [symbol_additions_v2_1_156_tools.md](../00_overview/symbol_additions_v2_1_156_tools.md)
> - v2.1.156 workflow additions (gate family overlap): [symbol_additions_v2_1_156_workflow.md](../00_overview/symbol_additions_v2_1_156_workflow.md)

Key entries (full list + line numbers in the additions file above):
- `getAllBaseTools` (`ra`) — exhaustive built-in tool array; Workflow slot spread point
- `WorkflowTool` (`n0_`) + `workflowToolSlot` (`_H$`) — the tool object and its lazy slot
- `initializeBundledTools` (`k0`) — one-time slot populator; calls `iUK(ra)`
- `isWorkflowsEnabled` (`NZ`) — four-layer runtime gate behind `n0_.isEnabled`
- `askUserQuestionTool` (`YtH`) + `ASK_USER_QUESTION_RESERVATION_PROMPT` (`FUK`) — the 2.1.154 reservation
- `isLeanSystemPrompt` (`X3`) — lean/simple-prompt predicate that gates the reservation
- `commandFrontmatterSchema` (`GL5`) + `parseToolList` (`fc`) — `disallowed-tools` schema + parser
- `appendOrReplaceCommandDenyRules` (`c28`) + `computeEffectivePermissionContext` (`T6`) — inline + fork enforcement
- `readFileBody` (`gJ4`) + `PARTIAL_VIEW_PREFIX` (`$j$`) — Read truncation producer
- `buildToolSchema` (`w08`) + `opus48Caps` (`Xi$`) — eager-streaming gate + per-model caps

## Validation status

- **Docs in module**: 5 — `README.md` (this), `workflow_tool_registration.md`,
  `ask_user_question_reservation.md`, `disallowed_tools_frontmatter.md`,
  `read_partial_view_and_streaming_exec.md`.
- **Symbols consolidated**: see `../00_overview/symbol_additions_v2_1_156_tools.md` (≈80 rows,
  deduplicated, alphabetically ordered). Every line number was verified directly against
  `cli_inner_pretty.js`.
- **Correction applied during finalize**: the seed listed `defineLazyExports` (`X$`) at
  cli_inner_pretty.js:378080; that is the *call site*. The definition is at cli_inner_pretty.js:55 —
  the additions file cites the definition. `ez` (`AskUserQuestion`) was deduplicated to a single row.
- **No symbol mapping tables in any module doc** — list-format refs only; the only tables in the
  doc bodies are explicitly-labeled cross-version *behavioral* diffs, not symbol mappings.
