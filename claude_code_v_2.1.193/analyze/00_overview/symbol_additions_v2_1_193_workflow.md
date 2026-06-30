# Symbol Additions — v2.1.193 — Workflow / Structured Output (EXTEND)

> These symbols route to **[symbol_index_core_features.md](./symbol_index_core_features.md)** (the **Workflow** subsystem is indexed there).
>
> Bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`, BUILD_TIME `2026-06-25T18:18:11Z`). Every line below was **re-derived in the live 193 bundle** for this round (grep -n / Read). Obfuscated names are re-mangled per build and are **never** assumed to carry across versions; where a symbol is *carryover* from v2.1.183 with a different obf token, the 183 obf name is noted in the readable column for traceability.
>
> Scope of this round (the 183→193 Workflow / StructuredOutput delta): (1) NET-NEW StructuredOutput **success guard** + `requiresStructuredOutput` inline enforcement that replaces the 183 Stop-hook (2.1.187), (2) NET-NEW `agent({schema})` **5-failure retry cap** wired into the workflow runner (2.1.186; the print-mode cap itself is carryover), (3) NET-NEW `/workflows` detail **`f` status filter** (2.1.186). The Workflow VM/sandbox/builtins and the `agent()` contract are **unchanged carryover** in this window and are NOT re-indexed here (see the v2.1.183 `42_workflow` tree).

## Module: Workflow — StructuredOutput core (CARRYOVER, anchors for the new logic)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ep` | `STRUCTURED_OUTPUT_TOOL` (`"StructuredOutput"`; 183 `Em`) | cli_inner_pretty.js:229498 | constant |
| `$Qr` | `STRUCTURED_OUTPUT_BASE_TOOL` (`isMcp:false`, enabled, read-only, concurrency-safe, `isOpenWorld:false`, `maxResultSizeChars:1e5`, search hint, prompt/description, allow permissions, `endsTurn:true`, compact `renderToolUseMessage`) | cli_inner_pretty.js:229509 | object |
| `qVd` | `schemaToolFactory` (Ajv `allErrors:true`; validate caller schema; compile validator; override `inputJSONSchema`; `call()` throws `Fi` on schema mismatch) | cli_inner_pretty.js:229472 | function |
| `WVd` | `structuredOutputDefaultInputSchema` (`A.object({}).passthrough()`; superseded by `qVd`'s `inputJSONSchema` for `agent({schema})`) | cli_inner_pretty.js:229507 | variable |
| `VVd` | `structuredOutputOutputSchema` (`A.string().describe("Structured output tool result")`) | cli_inner_pretty.js:229508 | variable |
| `renderToolUseMessage` | StructuredOutput compact display (`0 fields→null`; `<=3→key: JSON.stringify(value)`; `>3→"N fields: first, second, third…"`) | cli_inner_pretty.js:229544 | method |
| `Fi` | `DualError` (`class Fi extends Error`; user msg + internal/telemetry msg) | cli_inner_pretty.js:9055 | class |
| `Rw` | `WORKFLOW_TOOL_NAME` (`"Workflow"`) | cli_inner_pretty.js:229559 | constant |

## Module: Workflow — `agent({schema})` runner success guard + retry cap (NET-NEW 2.1.187 + 2.1.186)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `wt` | `workflowAgentRunner` (`async function wt(tt,nt,Rt,$t)`; hosts success guard + retry cap + SO spawn) | cli_inner_pretty.js:423705 | function |
| `m4` | `subagentQueryGenerator` (`async function* m4`; gains `requiresStructuredOutput: W` param) | cli_inner_pretty.js:398565 | function |
| `requiresStructuredOutput` | force-StructuredOutput query option (NET-NEW; `grep -c`=0 in 183, 8 in 193) | cli_inner_pretty.js:398601 | variable |
| `NYp` | `DEFAULT_SO_RETRIES` (`5`; workflow `agent({schema})` schema-failure cap) | cli_inner_pretty.js:424307 | constant |
| `kol` | `STALL_RETRY_CAP` (`5`; separate outer stall-retry cap — do NOT conflate with `NYp`) | cli_inner_pretty.js:424306 | constant |
| (local `kn`) | `retryCap` (`Be.MAX_STRUCTURED_OUTPUT_RETRIES ?? NYp`) | cli_inner_pretty.js:423782 | variable |
| (local `Mr`) | `failedStructuredOutputCalls` (counts `is_error` StructuredOutput `tool_result`s) | cli_inner_pretty.js:423779 (decl) / 423819 (increment) | variable |
| (local `Ko`) | `structuredOutputCallIds` (Set of in-flight StructuredOutput `tool_use` ids) | cli_inner_pretty.js:423781 (decl) / 423819 and 423840 (delete/add) | variable |
| (local `dt`) | `capturedStructuredOutput` (set from the `structured_output` attachment) | cli_inner_pretty.js:423775 (decl) / 423804 (capture) | variable |
| (local `sr`) | `structuredOutputAttempts` (StructuredOutput `tool_use` count this run) | cli_inner_pretty.js:423778 (decl) / 423840 (increment) | variable |

## Module: Workflow — `requiresStructuredOutput` inline enforcement (NET-NEW 2.1.187, replaces 183 Stop-hook)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `vbl` | `messagePrepGenerator` (`async function* vbl`; per-turn; injects the gated SO nudge) | cli_inner_pretty.js:465576 | function |
| `Ibl` | `structuredOutputSucceeded` (latest SO `tool_use` has a non-error `tool_result`? `is_error !== true`) | cli_inner_pretty.js:601998 | function |
| `Hbl` | `ENFORCE_SENTINEL` (`"[structured-output-enforce]"`; nudge dedup marker; 0 in 183) | cli_inner_pretty.js:465901 | constant |
| `Abl` | `findLastUserIndex` (scopes the nudge dedup window to messages since last user turn) | cli_inner_pretty.js:465479 | function |
| `zKn` *(183)* | `registerStructuredOutputStopHook` (183 Stop-hook; REMOVED in 193) | cli_inner_pretty.js:575795 *(183)* | function |

## Module: Workflow — `/workflows` detail `f` status filter (NET-NEW 2.1.186)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `eYt` | `workflowDetailFilterOrder` (`["all","running","queued","failed","done","skipped","interrupted"]`; 0 in 183) | cli_inner_pretty.js:543272 | constant |
| `XOo` | `STATUS_LABELS` (status → display label; `done→"Completed"`, `interrupted→"Stopped"`) | cli_inner_pretty.js:543273 | object |
| `pe` | `cycleStatusFilter` (advance filter, skipping statuses no agent currently has; resets scroll/selection) | cli_inner_pretty.js:543007 | function |
| `D$e` | `agentStatus` (derive an agent's status token from `(agent, isRunning)`; CARRYOVER) | cli_inner_pretty.js:541975 | function |
| (local `[P,O]`) | `[statusFilter, setStatusFilter]` (`useState("all")`) | cli_inner_pretty.js:542947 | variable |
| (local `F`) | `filteredModel` (`useMemo` filtered agent list) | cli_inner_pretty.js:542951 | variable |
