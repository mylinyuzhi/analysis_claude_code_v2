# 40 — System prompt and reminder deltas (2.1.193 → 2.1.220)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

This module owns **what the harness tells the model out of band** — the mid-conversation `role: "system"`
channel, the `<system-reminder>` wrapper, the notification banners that precede automated turns, and the
provenance gates that decide whether a turn counts as human input. It does **not** own the model catalogue
(see [`../47_models/`](../47_models/)) or the retry state machine (see
[`../57_api_reliability/`](../57_api_reliability/)); it owns the *content and placement* of the system block
and the *framing* of the reminders.

Two topic documents:

| Doc | Covers |
|---|---|
| [`mid_conversation_system_role.md`](mid_conversation_system_role.md) | the `mid_conv_system` capability, the Sonnet-5 carve-out, the message-assembly path, cache-breakpoint promotion, the fallback ladder, and the undocumented per-turn-effort piggyback |
| [`reminder_framing_and_human_origin.md`](reminder_framing_and_human_origin.md) | `<system-reminder>` framing selection, the `ultracode` human-origin gate, the automated-turn banners, the subagent-authority clause, and the unanchored injection-warning bullet |

---

## 0. Headline finding — I **partially challenge** `_GROUND_TRUTH` §6.3

[`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §6.3 states that `.201`'s
*"Claude Sonnet 5 sessions no longer use the mid-conversation system role for harness reminders"* was
**reverted** before `.220`. Re-reading every site, that is **half right, and the half it misses is the
interesting half.**

| Claim | Verdict | Evidence |
|---|---|---|
| Sonnet 5 declares `mid_conv_system` in the catalogue | **Confirmed** | `:14207` inside `claude-sonnet-5` (`:14177-14213`) |
| `supportsMidConversationSystem` returns `true` for Sonnet 5 | **Confirmed** | `Ser` `:150505-150526`; Sonnet 5 is absent from the 10-id exclusion list `:150512-150521`, so control reaches `:150524` |
| Therefore Sonnet 5 uses the mid-conversation system role again | **Confirmed for the transport** | `:150547` pushes beta `aW` (`mid-conversation-system-2026-04-07`, `:109214`); `:531421` sets `o = Ser(model)`, which is what enables `api_system` message emission at all |
| Therefore the `.201` change was superseded / undone | **CHALLENGED — a Sonnet-5-only carve-out survives in two places** | `mro(e) { return lo(e) === "claude-sonnet-5" }` at `:150395-150397`, consumed at `:508117` and `:531422` |

The two surviving carve-outs are:

1. **`:508117`** — `Jep = memoize(model => Ser(model) && !mro(model) && !$Fc(model))`. `Jep` selects the
   *system-prompt sentence* that explains where out-of-band information comes from (`Qep`, `:507549`).
   Because `mro` excludes Sonnet 5 (and `$Fc`, `:118668`, excludes Opus 4.8), **a Sonnet 5 session is still
   told the `<system-reminder>` story, not the mid-conversation-system story.**
2. **`:531422`** — `i = o && mro(r)` inside the message normalizer `NN` (`:531420`). When `i` is true, each
   reminder is individually wrapped in `<system-reminder>` tags *before* going into the `role: "system"`
   block (`:531573`, `:531634`), and the demotion path skips re-wrapping (`:531528`, `:531783`).

So the accurate statement is: **`.201`'s role-level exclusion was reverted; a presentation-level
compatibility shim replaced it.** In 2.1.220 a Sonnet 5 turn *does* carry a `role: "system"` message, but
its payload is byte-shaped exactly like the pre-`.201` `<system-reminder>` text, and the system prompt never
mentions mid-conversation system turns. Every other `mid_conv_system` model (Opus 5, Fable 5, Mythos 5) gets
the raw form plus the explanatory sentence; Opus 4.8 is a third case — raw transport, old framing.

`mro` and `$Fc` are both **220-only** (`claude-sonnet-5` 220=35 / 193=0; the whole `Jep`/`Qep` split does not
exist in 193, where both framing sentences are hardcoded string literals at `:592592 (193)` and
`:592747 (193)`). See [`mid_conversation_system_role.md`](mid_conversation_system_role.md) §3.

---

## 1. The four-state truth table

The single most useful artefact in this module. Reading only `mid_conv_system` gives you column 1 and misses
the rest.

| Model | `Ser` — role:"system" used? | `mro` — Sonnet-5 shim? | `Jep` — new prompt sentence? | Net effect |
|---|---|---|---|---|
| `claude-opus-5` (`:14365`) | yes (`:14390`) | no | **yes** | raw reminders in a system turn; prompt explains it |
| `claude-fable-5` (`:14402`) | yes (`:14428`) | no | **yes** | same |
| `claude-mythos-5` (`:14439`) | yes — by **name**, `:150524` | no | **yes** | same, but reached through the `r === "claude-mythos-5"` special case because its `capabilities` array is empty |
| `claude-opus-4-8` (`:14330`) | yes (`:14355`) | no | **no** (`$Fc`, `:118669`) | raw reminders in a system turn; prompt still says `<system-reminder>` |
| `claude-sonnet-5` (`:14177`) | yes (`:14207`) | **yes** (`:150396`) | **no** | `<system-reminder>`-wrapped reminders inside a system turn; prompt says `<system-reminder>` |
| everything else | no — 10-id exclusion list `:150512-150521` | — | no | reminders ride as meta user messages |

Two escape hatches sit above the whole table (`Ser`, `:150506-150509`, in evaluation order):
`iY("hipaa")` forces `false`; `Z.CLAUDE_CODE_FORCE_MID_CONVERSATION_SYSTEM` forces `true`;
`Ede(model, "mid_conversation_system")` (`:118826-118843`) lets an operator override per model through the
`ANTHROPIC_CUSTOM_MODEL_OPTION` / `…_SUPPORTED_CAPABILITIES` env pair.

---

## 2. Per-bullet ledger

Every changelog bullet routed to `system_prompt` in
[`../00_overview/_scope_v*.md`](../00_overview/), plus the two prompt-caching bullets the brief assigned.

| # | Bullet (abridged) | Version | Verdict | Anchor (2.1.220) | 220 / 193 | Doc section |
|---|---|---|---|---|---|---|
| 1 | Sonnet 5 sessions no longer use the mid-conversation system role for harness reminders | `.201` | **PARTIALLY REVERTED** — role restored, presentation shim kept | `Ser` `:150505`; `mro` `:150395`; capability `:14207` | `mid_conv_system` 6/1 | [mid-conv §1-§3](mid_conversation_system_role.md) |
| 2 | Subagents treat launcher messages as task direction, never as user approval | `.198` | **NET_NEW** | `:507936` inside `zon` (`:507925`) | `launched you` 1/0 | [framing §4](reminder_framing_and_human_origin.md) |
| 3 | Background task notifications state that no human input has occurred | `.205` | **NET_NEW (one line added to a carryover banner)** | `:226519` in `x7r` (`:226516-226521`) | `No human input has been received` 1/0; banner prefix 1/1 | [framing §3.1](reminder_framing_and_human_origin.md) |
| 4 | Spurious prompt-injection warnings from benign system-generated updates | `.207` | **UNANCHORED** — no new literal; two candidate mechanisms, neither proven | — (`:507560` is byte-identical carryover) | `prompt injection` 8/7 | [framing §5](reminder_framing_and_human_origin.md) |
| 5 | `ultracode` keyword opt-in firing on non-human input (webhooks, relayed PR comments) | `.210` | **NET_NEW — one identifier changed** | `:516671`; `juo` `:216894`; `K` `:652554` | `isHumanTypedPrompt` 2/0 | [framing §1](reminder_framing_and_human_origin.md) |
| 6 | Scheduled tasks refusing their own configured prompt as untrusted input | `.214` | **NET_NEW (a whole second banner)** | `Zdo` `:226522-226527`; dispatch `:533918` | `SCHEDULED TASK - AUTOMATED FIRING` 2/0 | [framing §3.2](reminder_framing_and_human_origin.md) |
| 7 | Prompt-caching regression billing the trailing system block as fresh input (Bedrock/Vertex/Mantle/Foundry) | `.211` | **NET_NEW — breakpoint promotion** | `g1_` `:511886`, promotion at `:511909`, emission at `:511938-511943` | `PGf` (193 `:596391`) never emitted `cache_control` on `api_system` | [mid-conv §5](mid_conversation_system_role.md) |
| 8 | Mid-conversation system block now works behind LLM gateways and custom base URLs | `.212` | **NET_NEW — a demote latch + a widened 400 classifier** | `:509916-509922`; `r5r` `:109219`; `rus` `:228393`; `vpo` `:228390` | `mid_conv_cache_promotion` 2/0; `retry:api-system-cache-demote` 1/0 | [mid-conv §5.2, §6](mid_conversation_system_role.md) |
| 9 | Agent tool hardened against indirect prompt injection via read content | `.210` | **owned elsewhere** | `:345393` | 1/0 | [`../53_subagent_limits/`](../53_subagent_limits/) |
| 10 | Subagents less likely to re-delegate their entire task | `.203` | **NET_NEW, owned elsewhere** | `:269324` | 1/0 | [`../53_subagent_limits/`](../53_subagent_limits/) |
| 11 | Background agent result reporting — never fabricate a pending agent's results | `.211` | **NET_NEW, owned elsewhere** | `:397985` | 2/0 | [`../36_background_agents/`](../36_background_agents/) |
| 12 | `.claude/rules/` not loading via a symlinked path | `.199` | **not covered** — auto-memory loader, no isolated literal | — | `.claude/rules` 8/5 | see "Not covered" below |
| 13 | Nested `.claude/rules/*.md` loading when setting sources exclude project settings | `.211` | **not covered** — same loader | — | `.claude/rules` 8/5 | see "Not covered" below |
| 14 | `/doctor` proposing trimming of a checked-in `CLAUDE.md` | `.206` | **owned elsewhere** | `:785865` | 1/0 | [`../43_slash_commands/`](../43_slash_commands/) |
| 15 | EndConversation tool | `.214` | **owned elsewhere** | `:413141` | 7/0 | [`../04_tools/`](../04_tools/) |
| — | *(undocumented)* per-turn effort carried on an empty `role: "system"` turn | — | **NET_NEW, no changelog bullet** | `btp` `:508707`; `Stp` `:508671`; beta `lW` `:109215` | `perTurnEffort` 12/0 | [mid-conv §7](mid_conversation_system_role.md) |
| — | *(undocumented)* the reminder framing sentence became model-dependent | — | **NET_NEW, no changelog bullet** | `Qep` `:507549`; `lO_` `:508026` | `These are system-controlled, unlike function results` 1/0 | [framing §2](reminder_framing_and_human_origin.md) |

**Score:** 9 bullets anchored (7 NET_NEW, 1 partially-reverted, 1 with a real one-line delta), 1 disproven as
unanchored, 2 deferred to their loader owners, 4 routed to other modules, and **2 undocumented additions
found that no changelog bullet mentions**.

---

## 3. False deltas caught in this theme

| Literal | 220 | 193 | Why it is a trap |
|---|---|---|---|
| `[SYSTEM NOTIFICATION - NOT USER INPUT]` | 1 (`:226516`) | 1 (`:599351 (193)`) | The banner *prefix* is carryover. Only line 4 is new. Grep `No human input has been received` (1/0), not the banner. Pre-flagged in the ledger; re-confirmed by reading both sites. |
| `retry:mid-conv-system` | 1 (`:509912`) | 1 (`:595124 (193)`) | The role-rejection fallback *retry* is carryover. What changed is the fallback *body* (193 rebuilt into a `<system-reminder>` body; 220 rebuilds into "a body with no `{role:"system"}` turn") and the fact that `Etp` (`:508691`) now strips per-turn-effort configs on the same path. |
| `tengu_mid_conv_system_fallback_retry` | 1 | 1 | Same event name in both builds — but 220 attaches a `{ per_turn_effort: mr }` property (`:509912`) that 193's payload (`{}`, `:595123 (193)`) does not have. A count-only check reads "no change". |
| `mid-conversation-system-2026-04-07` | 1 (`:109214`) | 1 (`:102184 (193)`) | The beta header is carryover; the capability *routing* around it is what changed. |
| `prompt injection` | 8 | 7 | The +1 is `/doctor` rule-syntax prompt text (`:785823`), unrelated to `.207` #4. The actual injection-warning sentence (`:507560`) is byte-identical to `:592593 (193)`. |
| `tengu_hazel_osprey` | 2 (`:508715`, `:508718`) | 2 (`:593628`, `:593631`) | The per-turn-effort gate *name* pre-exists. `perTurnEffort` (12/0) and `outputConfig` on an `api_system` message (`:511943`, 220-only) are the real delta. |
| `flag it directly to the user` | 1 | 1 | The injection-warning clause did not change text. |
| `LWs` keyword scanner (`\b${t}\b` regex line) | `:498275` | `:472958 (193)` | The `ultracode` *lexical* scanner — quote/bracket skipping, path-context rejection — is byte-identical. `.210` changed the *provenance* gate, not the scanner. |

---

## 4. Not covered, and why

- **`.199` #22 and `.211` #8 — the `.claude/rules/` loader.** `.claude/rules` is 220=8 / 193=5 and the three
  new sites are inside the memory/rules loader, which
  [`../31_auto_memory/`](../31_auto_memory/) owns. Neither bullet has an isolable literal (`realpath`
  277/179, useless), so pinning them needs a statement-by-statement diff of the loader, which is outside this
  module's budget. Recorded as a pointer rather than guessed at.
- **`.207` #4** is written up as **unanchored**, with the two candidate mechanisms and the argument against
  each, rather than attached to the nearest plausible line. See
  [`reminder_framing_and_human_origin.md`](reminder_framing_and_human_origin.md) §5.
- **The retry state machine itself** (ordering of the seven `sl`/`Gl` classifiers, sticky-beta bookkeeping,
  backoff) belongs to [`../57_api_reliability/`](../57_api_reliability/). This module documents only the two
  arms that mutate the system block: `retry:mid-conv-system` and `retry:api-system-cache-demote`.
- **Alias resolution and per-provider model mapping** belong to [`../47_models/`](../47_models/). This module
  uses the catalogue only as the source of the `mid_conv_system` capability bit.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this module are staged in
> [symbol_additions_v2_1_220_system_prompt.md](../00_overview/symbol_additions_v2_1_220_system_prompt.md).

Key functions in this module:
- `supportsMidConversationSystem` (`Ser`, `:150505`) - memoised capability resolver for the `role:"system"` transport
- `isSonnet5` (`mro`, `:150395`) - the surviving `.201` carve-out predicate
- `isOpus48` (`$Fc`, `:118668`) - excludes Opus 4.8 from the new prompt framing
- `usesMidConvSystemFraming` (`Jep`, `:508116`) - `Ser && !isSonnet5 && !isOpus48`
- `selectOutOfBandFramingSentence` (`Qep`, `:507549`) - three-way system-prompt sentence selector
- `normalizeMessagesForApi` (`NN`, `:531420`) - message assembler that mints `api_system` messages
- `wrapInSystemReminder` (`Ww`, `:532376`) - the `<system-reminder>` tag wrapper
- `placeCacheBreakpoints` (`g1_`, `:511886`) - breakpoint placer with the `.211` api_system promotion
- `isHumanTypedOrigin` (`juo`, `:216894`) - `origin?.kind === "human"`
- `prefixScheduledTaskBanner` (`Hcs`, `:226508`) / `prefixSystemNotificationBanner` (`kcs`, `:226504`)
