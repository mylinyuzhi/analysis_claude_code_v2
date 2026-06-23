# 41 — The `<system-reminder>` Mechanism (v2.1.183)

> Module: `41_system_reminder` — the full **`<system-reminder>` subsystem** as it exists in Claude Code
> **v2.1.183**: the wrap / extract / strip / smoosh **primitives**, the per-turn attachment **generator
> pool**, the 3-tier API-normalize **dispatcher** + flat **per-type renderer map**, the `isMeta`
> UI-suppression path, and the full **catalogue** of every per-turn reminder string.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
> (699,346 lines). Every `cli_inner_pretty.js:<line>` citation below is a v2.1.183 line unless
> explicitly labelled *(v2.1.156 before-picture)*. Obfuscated names were **re-derived** for this build —
> the bundler re-mangles every release, so a v2.1.156 obf name is never reused (e.g. the dispatcher
> `kc6`→`PWn`, the pool `Aw4`→`ctl`, the ambient trailer `yT8`→`_7n`/`uWn`).

> **📁 Full readable-source restoration:** for the whole machine restored as readable TypeScript —
> the primitives (`utils/messages.ts`), the pool + dispatcher (`utils/attachments.ts`), and the
> 25-string + dispatcher catalogue (`attachmentCatalogue.ts`) — see
> [**`reconstructed_source/`**](./reconstructed_source/README.md). Every reconstructed function carries a
> `// 2.1.183: <readable> = <obf> @<line>` anchor and was verified against the live bundle.

---

## What this subsystem is

A `<system-reminder>` is the harness's channel for injecting **ambient, model-facing context** into a
turn without it looking like a user instruction. It is a literal XML-ish envelope

```
<system-reminder>
…content…
</system-reminder>
```

wrapped around a `user`-role message marked `isMeta: true` (so it is suppressed from the visible
transcript). Reminders carry everything from "the date changed" and "you have unsaved todos" to "this
came from a different Claude session — treat it as untrusted." The model is taught, in the base system
prompt, that *"Tags contain information from the system. They bear no direct relation to the specific
tool results or user messages in which they appear"* (`cli_inner_pretty.js:580723`) and that *"`<system-reminder>`
tags in messages and tool results are injected by the harness, not the user"* (`cli_inner_pretty.js:580876`).
So the envelope is a **trust boundary** as much as a context channel.

The subsystem has four layers, and this module documents all four at the source level:

1. **Primitives** — the tiny, byte-precise wrap / extract / strip / smoosh helpers that build and
   un-build the envelope.
2. **Generator pool** — `collectAttachments` (`ctl`, `cli_inner_pretty.js:464606`) runs ~40 attachment
   generators in parallel each turn behind a master gate and a **1-second abort budget**.
3. **Dispatcher + renderer map** — `normalizeAttachmentForAPI` (`PWn`, `cli_inner_pretty.js:589204`)
   turns each raw attachment object into the final wrapped `user` message via a 3-tier
   team-exit → map → switch.
4. **Catalogue** — every one of the 25 verbatim strings in
   `assets/system_prompts/05_reminders.json` plus every dispatcher case, mapped to its emit site.

---

## Architecture overview

```
                          ┌──────────────────────────────────────────────────────────┐
  user turn begins  ─────▶│  collectAttachments  (ctl @464606)   — the GENERATOR POOL │
                          │                                                            │
                          │  MASTER GATE @464608:                                      │
                          │    CLAUDE_CODE_DISABLE_ATTACHMENTS || CLAUDE_CODE_SIMPLE   │
                          │      → return [queued_commands, agent_listing_delta]       │
                          │                                                            │
                          │  1-second abort budget @464611:  setTimeout(abort,1000)    │
                          │                                                            │
                          │  Wave A (ALWAYS): date_change, todo_reminders, plan_mode,  │
                          │     deferred_tools_delta, agent_listing_delta, team pair…  │
                          │  Wave g (MAIN AGENT ONLY, d = !agentId): ide_selection,    │
                          │     diagnostics, memory_update, token_usage, ultracode…    │
                          │                                                            │
                          │  each generator wrapped by runAttachmentGenerator (BA      │
                          │     @464693): try/catch + 5% timing telemetry              │
                          └───────────────────────────────┬──────────────────────────┘
                                                          │  raw Attachment[]  (one obj per signal)
                                                          ▼
                          ┌──────────────────────────────────────────────────────────┐
                          │  normalizeAttachmentForAPI  (PWn @589204) — DISPATCHER     │
                          │                                                            │
                          │  TIER 1  Sl()-gated team fast-path:                        │
                          │     teammate_mailbox @589206 · team_context @589213        │
                          │  TIER 2  renderer MAP:  e.type in ONl  →  ONl[e.type](e)   │
                          │     (ONl @590431 — flat per-type renderer object)          │
                          │  TIER 3  inline switch(e.type):  file, invoked_skills,     │
                          │     todo_reminder, relevant_memories, diagnostics, …       │
                          │  default → logAntError("Unknown attachment type") @589606  │
                          └───────────────────────────────┬──────────────────────────┘
                                                          │  UserMessage[]  (isMeta:true)
                                                          ▼
       PRIMITIVES (utils/messages.ts)                    │
       ┌───────────────────────────────────────┐         │
       │ wrap:   TI @589004 (multiline)         │◀────────┘  every renderer calls
       │         Jp @589078 (list helper)       │            Jp([Rn({content, isMeta:true})])
       │         bSf @588027 (idempotent rewrap)│            or wraps text via TI
       │         xOi @220203 (single-line mem)  │
       │ extract:q0o @589021 (→original)        │
       │         oKr @277246 (→null, history)   │
       │ strip:  Rbl @587389 / ePo @606165 NEW  │
       │         _Ql @661920 (→space)           │
       │         fyl-loop @518094 (→nothing)    │
       │ smoosh: WNl @588040 / G0o @588506      │── final pass folds leading reminders INTO
       │ factory:Rn @587504 (isMeta)            │   the trailing tool_result; gated by
       │ trailer:_7n @590353 ("ambient context")│   tengu_chair_sermon @588352/588370
       └───────────────────────────────────────┘
```

The flow is strictly one-directional per turn: **pool produces raw attachment objects → dispatcher
renders each into a wrapped `isMeta` message → the merge/smoosh final pass folds the leading reminders
into the trailing tool_result so the API sees one clean user message.** Extraction and stripping run
on the *read* side (transcript search, history-format telemetry, sticky-prompt cleanup), never on the
inject side.

---

## Reconstructed source files

The whole subsystem is restored under [`reconstructed_source/`](./reconstructed_source/). Three `.ts`
files split the machine along the v2.1.88 named-TS module boundaries.

| File | Restores | v2.1.183 regions | LOC |
|------|----------|------------------|----:|
| [`reconstructed_source/utils/messages.ts`](./reconstructed_source/utils/messages.ts) | The **primitives**: all 4 wrap helpers (`wrapInSystemReminder`, `wrapMessagesInSystemReminder`, `ensureSystemReminderWrap`, the single-line `wrapMemoryAgeReminder`), both extract helpers (returns-original vs returns-null), the 4 strip forms (leading, the NEW guarded leading, regex→space, the index-loop→nothing), the smoosh/merge final pass (`smooshSystemReminderSiblings`, `smooshIntoToolResult` with its `tool_reference` decline, `mergeUserMessagesAndToolResults` driver gated by `tengu_chair_sermon`), and the `createUserMessage` factory carrying `isMeta`. | 588027–589091, 587389–587543, 220191–220208, 277246, 518094–518148, 606156–606165, 661920 | 619 |
| [`reconstructed_source/utils/attachments.ts`](./reconstructed_source/utils/attachments.ts) | The **generator pool + dispatcher**: `collectAttachments` (master gate, 1 s abort budget, two waves, main-agent-only flag), `runAttachmentGenerator` (try/catch + 5 % telemetry), `getQueuedCommandAttachments` (the only generator that survives the gate), the 3-tier `normalizeAttachmentForAPI` dispatcher, the `PER_TYPE_RENDERERS` map, and the five per-feature cadence configs. | 464606–464751, 589204–589607, 590431–590642, 466059–466064 | 849 |
| [`reconstructed_source/attachmentCatalogue.ts`](./reconstructed_source/attachmentCatalogue.ts) | The **catalogue**: a const-table inventory of every per-turn reminder renderer case (switch + map) **plus** the reminder-shaped strings the asset extractor harvested into `05_reminders.json` that are NOT per-turn reminders (tool descriptions / base-prompt / debug-log strings), each tagged with readable name, attachment type, emit `@line`, trigger, NEW-vs-2.1.156 status, and verbatim text. | 148102, 298898, 363300, 367816, 581457, 589198–590642 | 1342 |

> **Why this 3-file split?** The v2.1.183 bundle is one concatenated file — the renderer map physically
> sits *next to* the generator pool, and the primitives are scattered across 5 regions. The split
> follows the genuine v2.1.88 source-tree convention (`utils/messages.ts` for the envelope primitives,
> `utils/attachments.ts` for the pool, a catalogue for the string inventory); each file's header
> discloses exactly where its content physically lives in the bundle.

---

## Key design decisions & algorithms

### 1. The `isMeta` UI-suppression path — why ambient context is a *user* message

**What it does:** Every rendered reminder is a `user`-role message with `isMeta: true`. `isMeta`
messages are sent to the model but **suppressed from the visible transcript** — the user never sees the
date-changed nudge or the token-budget meter.

**How it works:** `createUserMessage` (`Rn`, `cli_inner_pretty.js:587504-587543`) is the single factory.
It destructures `{content, isMeta, …}` and returns `{type:"user", message:{role:"user", content: content || Dw}, isMeta, …}`,
where `Dw` (`cli_inner_pretty.js:148106`) is the `"(no content)"` placeholder so the API never receives
an empty string. Every renderer case in the dispatcher emits `Jp([Rn({content, isMeta:!0})])`.

**Why this approach:** A reminder *must* reach the model as conversational content (so attention can
weigh it), but it is **not** something the user said and must not pollute the visible transcript or be
re-attributed to the user on replay. Modeling it as a `user`/`isMeta` message — rather than a
`system`-role message — is deliberate: the Anthropic API historically rejects mid-conversation
`role:"system"` messages, and the harness has an explicit fallback that records *"server rejected
role:\"system\" — falling back to `<system-reminder>` body, sticky-rejecting beta until /clear or
/compact"* (`cli_inner_pretty.js:583222`). So the `<system-reminder>` *envelope inside a user message*
is the robust, always-accepted vehicle; `isMeta` is the orthogonal flag that hides it from the UI.

**Key insight:** "user message that the user never sent and never sees" is the whole trick. The
envelope is the model-facing trust signal; `isMeta` is the UI-facing suppression signal. They are
independent and both required.

### 2. The generator pool's master gate + 1-second abort budget

**What it does:** `collectAttachments` (`ctl`, `cli_inner_pretty.js:464606`) runs ~40 attachment
generators **in parallel** each turn, but bounds them with two safety valves: a master gate that
short-circuits everything in headless/SIMPLE mode, and a hard 1-second deadline.

**How it works:**
1. **Master gate** (`cli_inner_pretty.js:464608`): `if (st(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || Ge.CLAUDE_CODE_SIMPLE) return [...(await oGt(r,a)), ...TLe(t,o)]` — bail out returning **only** queued commands plus the agent-listing delta.
2. **Abort budget** (`cli_inner_pretty.js:464611`): `let c = setTimeout((_) => _.abort(), 1000, l)` — a fresh AbortController is armed to fire at 1 s and threaded into every generator's context.
3. **Two waves**: Wave A always runs (date, todos, plan-mode, deferred-tools delta, the `Sl()`-gated team pair, …); Wave g runs **only for the main agent** (`d = !t.agentId`, `cli_inner_pretty.js:464613`) — IDE selection, diagnostics, memory updates, token/budget meters, the ultracode pair.
4. **Final assembly** (`cli_inner_pretty.js:464690`): `await Promise.all([...])`, `clearTimeout(c)`, then flatten and drop `null`/`undefined`.

**Why this approach:** Attachment computation touches the filesystem, the LSP, the IDE socket, and the
memory store — any of which can hang. A single slow generator must never block the turn. Running them
in parallel with a shared 1 s deadline means *the turn proceeds with whatever finished*; a stuck
generator is simply absent that turn, not fatal. The **main-agent-only** wave avoids spending the
budget on signals (IDE selection, diagnostics) that are meaningless inside a subagent. The master gate
exists because headless/SDK runs want a deterministic, minimal context — but note the v2.1.183 delta:
the gate still lets the **agent-listing delta** through (in v2.1.156 it returned queued commands only,
`cli_inner_pretty.js:412662` *(before-picture)*), so SDK callers now keep an accurate agent roster.

**Key insight:** The pool is *best-effort under a deadline*, not transactional. `runAttachmentGenerator`
(`BA`, `cli_inner_pretty.js:464693`) reinforces this: each generator is individually try/caught and
returns `[]` on failure, so one generator's exception never loses the whole set — only its own
contribution.

### 3. The 3-tier dispatcher — why team-exit, map, *and* switch

**What it does:** `normalizeAttachmentForAPI` (`PWn`, `cli_inner_pretty.js:589204`) converts a raw
attachment object into the final `UserMessage[]` via three tiers tried in order.

**How it works:**
1. **Tier 1 — team fast-path** (`cli_inner_pretty.js:589205-589245`), gated by `Sl()`: only `teammate_mailbox` and `team_context` are handled here, *before* the generic dispatch, because they carry agent-team identity that must be rendered with the live coordinator state.
2. **Tier 2 — renderer map** (`cli_inner_pretty.js:589246`): `if (e.type in ONl) return ONl[e.type](e)`. `ONl` (`cli_inner_pretty.js:590431-590642`) is a flat object whose keys are attachment `type` strings and whose values are pure `(e) => UserMessage[]` renderers — the common case, O(1) lookup, no branch chain.
3. **Tier 3 — inline switch** (`cli_inner_pretty.js:589247+`): the cases with *sub-structure* (`file` has image/text/notebook/pdf subcases; `invoked_skills`, `relevant_memories`, `diagnostics`, `plan_mode`) that don't fit a one-liner.
4. **Default** (`cli_inner_pretty.js:589606`): `logAntError("normalizeAttachmentForAPI", Error("Unknown attachment type: …"))` and return `[]` — an unknown type is logged, never thrown.

**Why this approach:** A single flat `switch` over 60+ types would be unreadable and would force every
case — even the trivial one-line ones — into the same verbose form. Splitting the trivial renderers
into a **map** (`ONl`) keeps them as terse data, while the **switch** holds only the cases that
genuinely branch. The **team fast-path** is first because it must win even if a same-named generic case
existed, and because it depends on a feature gate (`Sl()`) that the other tiers don't. The unknown-type
fallback being a logged no-op (not a throw) keeps the turn alive when a new attachment type ships ahead
of its renderer.

**Key insight:** The three tiers are ordered by *specificity and cost*: gate-dependent identity cases
first, O(1) data-driven renderers second, structural branches last, log-and-survive default. This is
the same "map-then-switch" pattern the codebase uses wherever a discriminated union has a long tail of
trivial cases plus a few rich ones.

### 4. The smoosh final pass — folding leading reminders into the tool_result

**What it does:** Before the message list goes to the API, leading `<system-reminder>` text blocks in a
user message are **folded into that message's trailing `tool_result`**, so the API sees one coherent
tool-result block rather than a reminder floating ahead of it.

**How it works:** `smooshSystemReminderSiblings` (`WNl`, `cli_inner_pretty.js:588040`) partitions a user
message's content into SR-prefixed text (`o`) vs. the rest (`s`), finds the *last* `tool_result`, and
calls `smooshIntoToolResult` (`G0o`, `cli_inner_pretty.js:588506`) to merge the reminders in. `G0o`
**declines** (returns `null`, leaving the message untouched) when the tool_result contains a
`tool_reference` block (`n.some(rne)`, `cli_inner_pretty.js:588509`) — folding text into a tool-reference
would corrupt it. The whole pass is gated by the `tengu_chair_sermon` Statsig flag (default OFF) at two
sites in the merge driver `mergeUserMessagesAndToolResults` (`Cx`, `cli_inner_pretty.js:588352` and
`588370`).

**Why this approach:** A reminder that arrives as a separate text block *adjacent to* a tool_result can
confuse the model about which result the reminder pertains to (recall the base-prompt warning that tags
"bear no direct relation" to the result they appear with). Folding the reminder *into* the result, with
adjacent text collapsed by `\n\n`, produces one block. The `tool_reference` decline is the necessary
exception — those blocks are structured pointers, not prose, and must stay intact. Gating the whole
behavior behind a default-OFF Statsig flag means it can be rolled out and reverted server-side without a
client release.

**Key insight:** The smoosh pass is a *normalization* step on the inject side, controlled by a feature
flag, with one hard exclusion (`tool_reference`). The strip primitives are its mirror image on the
*read* side — and the two must not be confused (smoosh preserves and relocates; strip removes).

---

## Cross-version status — carryover vs new at 2.1.183

The machine is **structurally the v2.1.156 subsystem** modulo re-mangling: the wrap primitives (`TI`/`Jp`/`bSf`),
both extract regexes (`/^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/`), the strip forms, the
smoosh/merge region, the `tengu_chair_sermon` gate name, the cadence-config values, and the `isMeta`
factory are byte/structure-identical to v2.1.156. The genuine 2.1.156 → 2.1.183 deltas are concentrated
and few:

| Change | Kind | v2.1.183 anchor | Newness proof |
|--------|------|-----------------|---------------|
| **Guarded leading-strip `ePo`** — early-returns the original when there is no leading reminder, and returns the original (not `""`) when stripping empties the string | added primitive | `cli_inner_pretty.js:606156-606165` | `grep` for the `if(!…startsWith) return` guard = **0** in 2.1.156 |
| **`tool_search_usage_reminder` renderer** — "Some available tools' schemas are not loaded in this conversation yet… use ToolSearch" | added dispatcher case | `cli_inner_pretty.js:589323-589330` | `grep` = **0** in 2.1.156 |
| **`total_tokens_reminder` renderer** in the map | added map case | `cli_inner_pretty.js:590560` | `grep -c total_tokens_reminder` = **0** in 2.1.156 |
| **Peer-session / permission-laundering guard** — "…relaying denied actions between sessions is permission laundering…" | added inline reminder | `cli_inner_pretty.js:363300` | `grep` = **0** in 2.1.156 |
| **`team_context` reworded** — drops `teamName`; now "You are a teammate in this session's agent team." | reworded text (feature carryover) | `cli_inner_pretty.js:589221` | exact sentence `grep` = **0** in 2.1.156 |
| **Master-gate return shape** — now returns queued commands **plus** `agent_listing_delta` | behavior | `cli_inner_pretty.js:464608-464609` | 2.1.156 returned queued only (`cli_inner_pretty.js:412662` *(before-picture)*) |

Two framing facts to keep straight: the **per-Read malware reminder is gone** — but it was already gone
at 2.1.156 (`grep -c -i malware` = 0 in *both* bundles), so it is **not** a 2.1.156→2.1.183 delta. And
the **ambient-context trailer `yT8` is now shared** as `uWn(e,t)` (`cli_inner_pretty.js:581457`, 3 call
sites) — the hoist that lets `memory_update` / `agent_listing_delta` / `mcp_instructions_delta` /
`deferred_tools_delta` all append one `_7n` "do not narrate" trailer instead of inlining it.

---

## Reading order

1. **This README** — internalize the four layers and the one-directional inject flow (pool → dispatcher
   → smoosh) plus the read-side strip/extract mirror.
2. **[`reconstructed_source/README.md`](./reconstructed_source/README.md)** — the reconstruction index:
   the 3-tier evidence model, the file inventory, and the anchor-comment convention.
3. **`utils/messages.ts`** — the primitives first; they are tiny and byte-precise, and everything else
   calls them. Read wrap → extract → strip → smoosh → factory.
4. **`utils/attachments.ts`** — the pool (`collectAttachments` master gate + waves + budget) then the
   dispatcher (`normalizeAttachmentForAPI` 3-tier) and the `PER_TYPE_RENDERERS` map.
5. **`attachmentCatalogue.ts`** — the exhaustive string inventory; use it as the lookup table when you
   need "which reminder fires when, and what does it say verbatim."

For the *provenance* of every claim (the anchor dossiers + conventions) read the headers in
[`reconstructed_source/`](./reconstructed_source/README.md#provenance).

---

## Related modules

- **`42_workflow/`** — the `ultracode` keyword reminders (`workflow_keyword_request`, `ultra_effort_enter/exit`)
  are *emitted* by this dispatcher but *owned* by the Workflow module; their rename and gating live there.
- **`30_agent_team/`** — `team_context` / `teammate_mailbox` (Tier-1 fast-path) and the peer-session
  permission-laundering guard belong to the agent-team subsystem; this module documents only their
  rendering.
- **`31_auto_memory/`** — `relevant_memories`, `memory_update`, and the single-line memory-age
  staleness reminder (`xOi`/`YWr`) are produced by the memory engine; this module documents the wrap.
- **`36_background_agents/`** — `container_restart`, `task_status`, and the queued `task-notification`
  mode that survives the master gate connect to the background-task plumbing.
- **`40_system_prompt/`** — the base-prompt lines that *teach the model* what `<system-reminder>` means
  (the "# System" / "# Harness" sections, the `isLeanSystemPrompt`/`Dg` gate selecting slim vs full
  tool descriptions).

---

## Related Symbols

> Symbol mappings live in the central index and the per-feature additions file (never as tables in
> module docs):
> - [symbol_additions_v2_1_183_system_reminder.md](../00_overview/symbol_additions_v2_1_183_system_reminder.md) — **All re-derived v2.1.183 system-reminder symbols** (164 rows: primitives, pool, dispatcher, renderer map, cadence configs, catalogue; add new rows there).
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (the system-reminder / attachment mechanism is a core feature; also Plan, Hooks, Skills, Compact, Todo, Thinking, Steering, CLI).
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (the per-turn attachment collection point in the agent loop; subagent context that sets `agentId`).
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (the `ct` Statsig gate evaluator, the `tengu_chair_sermon` flag, telemetry sinks, the lean-prompt gate).
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (IDE selection / opened-file attachments, LSP diagnostics, transcript-search strip).

Key functions in this module (re-derived v2.1.183 names):

- `wrapInSystemReminder` (`TI`, `cli_inner_pretty.js:589004`) — the canonical multiline envelope.
- `wrapMessagesInSystemReminder` (`Jp`, `cli_inner_pretty.js:589078`) — list helper every renderer calls.
- `ensureSystemReminderWrap` (`bSf`, `cli_inner_pretty.js:588027`) — idempotent identity-preserving final-pass re-wrap.
- `wrapMemoryAgeReminder` (`xOi`, `cli_inner_pretty.js:220203`) / `memoryAgeReminderText` (`YWr`, `cli_inner_pretty.js:220194`) — the single-line memory-staleness variant.
- `extractSystemReminderContent` (`q0o`, `cli_inner_pretty.js:589021`) / returns-null history form (`oKr`, `cli_inner_pretty.js:277246`) — the two no-match conventions over one anchored regex.
- `stripLeadingReminders` (`Rbl`, `cli_inner_pretty.js:587389`) / guarded variant (`ePo`, `cli_inner_pretty.js:606156`, **NEW**) / `stripAllReminders` (`_Ql`, `cli_inner_pretty.js:661920`) — the strip family.
- `smooshSystemReminderSiblings` (`WNl`, `cli_inner_pretty.js:588040`) / `smooshIntoToolResult` (`G0o`, `cli_inner_pretty.js:588506`) — the smoosh final pass + its `tool_reference` decline.
- `mergeUserMessagesAndToolResults` (`Cx`, `cli_inner_pretty.js:588170`) — the merge driver gated by `tengu_chair_sermon`.
- `createUserMessage` (`Rn`, `cli_inner_pretty.js:587504`) — the `isMeta` factory; `NO_CONTENT_MESSAGE` (`Dw`, `cli_inner_pretty.js:148106`).
- `collectAttachments` (`ctl`, `cli_inner_pretty.js:464606`) — the generator pool (master gate, 1 s budget, two waves).
- `runAttachmentGenerator` (`BA`, `cli_inner_pretty.js:464693`) — per-generator try/catch + 5 % telemetry.
- `getQueuedCommandAttachments` (`oGt`, `cli_inner_pretty.js:464716`) — the only generator surviving the master gate.
- `normalizeAttachmentForAPI` (`PWn`, `cli_inner_pretty.js:589204`) — the 3-tier dispatcher.
- `PER_TYPE_RENDERERS` (`ONl`, `cli_inner_pretty.js:590431`) — the flat per-type renderer map.
- `AMBIENT_CONTEXT_TRAILER` (`_7n`, `cli_inner_pretty.js:590353`) / shared ambient wrapper (`uWn`, `cli_inner_pretty.js:581457`).
- `isAgentTeamEnabled` (`Sl`, `cli_inner_pretty.js:293831`) — gates dispatcher Tier 1 + the team generator pair.
