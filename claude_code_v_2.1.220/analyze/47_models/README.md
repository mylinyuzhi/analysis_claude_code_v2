# 47_models — Models, the model registry rewrite, and fast mode (v2.1.193 → v2.1.220)

> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, build `4073f595`, `build_time 2026-07-24T22:17:45Z`).
> BASELINE: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` in this directory is a **220** line unless tagged **(193)**.
> Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md).
> Verified anchors this module builds on: [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md)
> (sections 1, 6.2, 6.3 and open questions 2–6 are answered here).

---

## The window's story for this theme, in one paragraph

The changelog tells you two things happened to models between `.195` and `.220`: **Sonnet 5 shipped
in `.197`** and **Opus 5 shipped in `.219`**. Both are true. What it never says is that the *reason*
both launches were one-line changes is that the entire model registry was rewritten in this window —
from ~15 hand-written camelCase provider objects plus a dozen scattered `if/else-if` ladders
(`:95560-95724 (193)`, `:134799-134827 (193)`, `:592952-592964 (193)`) into a single declarative,
zod-validated, snake_case catalogue at `cli_inner_pretty.js:14008-14496`. Twelve new catalogue
literals are `220>0 / 193=0`. Along the way an **eighth provider channel**
(`anthropic_google_cloud`, "Claude Platform on Google Cloud") shipped with **zero** changelog
bullets, and a **fourth precedence level** (org default models, `.196`) was added on top of model
resolution. And in the opposite direction, two changelog claims do not survive contact with the
bundle: **`.219`'s "Removed Opus 4.7 from fast mode" is not implemented client-side**, and **`.201`'s
Sonnet-5 mid-conversation-system change was reverted before `.220` shipped**. This theme is the
sharpest example in the tree of a changelog that simultaneously over-claims and under-reports.

---

## Documents

| Doc | Covers |
|---|---|
| [`model_catalogue_rewrite.md`](model_catalogue_rewrite.md) | **The headline.** The camelCase→snake_case rewrite: the blob, the zod schema and its silent empty-catalogue fallback, the two derived indexes (one of which throws), the compatibility adapter that regenerates 193's shape, the `claude-mythos-5` contradiction, the surviving four-stage capability-probe pattern, what `latest_per_family` / `best` / `alias_migration` / `advisor_rank` / `defaults` actually drive, tier-token → dollars, provider-dependent alias resolution, and the id normaliser. Also: five schema fields that no entry populates (the evidence for a *server-pushed* catalogue next). |
| [`opus5_and_sonnet5.md`](opus5_and_sonnet5.md) | The two default-model releases. Full field-by-field entries, `opus_5_prompt_bundle` as a six-gate bundle, the three 1M-context fields and why the gateway rule is an intersection, the `tier_5_25` ↔ "$10/$50" reconciliation, the `.201` reversion, the server-controlled Sonnet-5 promo date, and the four `.219` picker bullets. |
| [`fast_mode.md`](fast_mode.md) | Eligibility predicate, the **Opus 4.7 changelog↔code discrepancy** with the 193 before-picture, the org+flag gate, three separate unavailability taxonomies, the availability state machine and its fail-closed network posture, the lazy cooldown, and the `.208`/`.218`/`.219` toggle-telemetry deltas. Opens with a carryover table because almost all of fast mode is carryover. |
| [`org_default_models_and_picker.md`](org_default_models_and_picker.md) | `.196` org/role default models (and the missing `Role default` label), the four-level attribution ladder, `orgModelDefaultCache` validation, the `.206` anchor-misplacement fix (**anchored here for the first time**), entitlement step-down as a rendering pass, custom-model rows, and four adjacent command-surface fixes. |
| [`anthropic_google_cloud_channel.md`](anthropic_google_cloud_channel.md) | The **unannounced** eighth provider channel, end to end: enum precedence, the `isClaudePlatformProvider` grouping and its five consumers, ten populated `provider_ids` slots, five env vars across eight allow-lists, client construction and the ADC pre-flight, the error taxonomy, and its membership in the public SDK enum. |

No planned doc was merged away; the theme turned out to have *more* substance than four documents
could hold, so `anthropic_google_cloud_channel.md` was added as a fifth content doc.

---

## Per-bullet ledger

**Legend.** `NET_NEW` = 220>0 / 193=0 with a read site. `DELTA` = the literal or mechanism pre-existed;
the true change is narrower. `CARRYOVER` = no isolable change. `SERVER_SIDE` = the client path exists
but the trigger is data. `UNANCHORED` = probed and not found. `DISCREPANCY` = the code contradicts the
bullet.

### Bullets where `models` is the primary theme (18)

| Bullet | Ver | Verdict | Anchor (220 unless tagged) | Doc section |
|---|---|---|---|---|
| Organization default models; shows as "Org default" / "Role default" in `/model` | `.196` #1 | **NET_NEW (partial)** — `Org default` 220=2/193=0; **`Role default` 220=0/193=0, the label does not exist** | `:154491-154507`, `:110736-110751`, `:111167`, `:120003-120005`, `:450437-450441` | org_default §1–2, TL;DR |
| Introducing Claude Sonnet 5: default model, native 1M context, promo $2/$10 per Mtok | `.197` #1 | **NET_NEW**; promo *date* is SERVER_SIDE (`cedar_basin` flag) | `:14177-14213`; `:120043-120047`; `:119957-119962` | opus5_and_sonnet5 §1, §6 |
| `/model` or `/fast` while viewing a subagent opened the lead's picker; notice now explains | `.199` #13 | **NET_NEW** (`tengu_agent_view_leader_command_notice` 220=1/193=0) | `:748982-748998`, `:753903` | org_default §7.1 |
| `/model` picker printing another model's price; 1P prices on 3P providers | `.206` #13 | **NET_NEW** (`promoListPrice` 220=20/193=0) | `:120048-120054`, `:111181-111187` (`!uGr()` guard), `:120590-120603` | opus5 §6; org_default §5 |
| Server-provided model rows misplaced when entitlement drops their anchor | `.206` #14 | **DELTA — newly anchored** (scoping had this UNANCHORED; `positionAfter` 0/0 was a dead end) | `:120665-120701` vs `:236104-236123 (193)` — the `!u && n !== null` skip-set line | org_default §4 |
| Bedrock / Vertex / Claude Platform on AWS default to Claude Opus 4.8 | `.207` #19 | **DELTA — SUPERSEDED inside the window**; those three `per_provider` rows read `claude-opus-5` in 2.1.220 | `:14465`, `:14466`, `:14469` | catalogue §9 |
| Fable 5 usage-credits consent prompt starts on the decline option | `.208` #5 | **UNANCHORED** (`declineFirst`/`defaultOption`/`initialIndex` all 3/3) | — (machinery at `:120656-120664`) | org_default §8 |
| Fast mode restores automatically when switching back to a supporting model | `.208` #6 | **NET_NEW** (`model_switch_restore` 220=1/193=0) | `:109475-109482` (`HU`), `:109483-109490` (`IU`), 11 call sites | fast_mode §7.1 |
| Fable temporarily unavailable in the advisor picker (server-side issue) | `.210` #33 | **SERVER_SIDE** — client path present, trigger is a `disabled: true` server row | `:308416-308423` (`F6e(t) && !Qkt()` early return), `:110521-110533`, `:154474-154484` | catalogue §7.4 |
| Claude Opus 5 (`claude-opus-5`), default Opus, 1M context, fast mode $10/$50 | `.219` #1 | **NET_NEW**; the "$10/$50" reconciles as a *substitute* cost table, not a multiplier | `:14365-14400`; `:109843-109850` (`a7n` = tier_10_50); `:109772-109784` | opus5 §2, §4 |
| Fable model row showing "Requires usage credits" for plans that include it | `.219` #9 | **DELTA** — count *fell* 2→1; fix is a strip-then-re-append normaliser on server rows | `:120084-120091`, `:120715`, call site `:120508` | opus5 §8 |
| `/model` picker showing the merged Opus row as "Opus" not "Opus (1M context)" | `.219` #10 | **DELTA (a removal)** — count fell 4→3; 193's post-hoc label rewrite was deleted | `:120548-120554` vs `:236012 (193)`; builders `:120205`, `:120261`, `:120270` | opus5 §7 |
| `/model` picker highlights only the newest model's name | `.219` #20 | **DELTA (target changed)** — corrected on second pass: the `replaceAll(name, accent(name))` mechanism is **carryover**; 193 highlighted `Fable 5` (`:490616 (193)`), 220 highlights `Opus 5`. There is no `isNew` flag. The word "only" is unverifiable from these two endpoints (both have exactly one site) | `:667097` vs `:490616 (193)` | opus5 §6 |
| Removed Opus 4.7 from fast mode; `/fast` applies to Opus 5 and Opus 4.8 | `.219` #22 | **⚠ DISCREPANCY — not implemented client-side.** Opus 4.7 passes on *both* branches | `:14324` (`fast_mode` capability), `:109467-109474` (`opus-4-7 \|\| opus-4-8 \|\| opus-5`); 193 was `4-6 \|\| 4-7 \|\| 4-8` at `:102320-102325 (193)` | fast_mode §2 |
| Announcement when fast mode changes via `/config model=<x>` or Remote Control | `.218` #31 | **NET_NEW** — the announcement builder + `announceKeptOn`; the event itself is carryover | `:450667-450676`, `:451241-451256`, `:450878-450889` | fast_mode §7.2 |
| Vertex/Bedrock attempting default Opus at startup + spurious fallback notice | `.211` #6 | **UNANCHORED** (`Falling back to` 11/10 — carryover) — partial mechanism found | `:110561-110573` (`jji`, the `CLAUDE_CODE_3P_PROBE_WROTE_SONNET_DEFAULT` guard) | org_default §6 |
| Session transcripts record the reasoning effort level on each assistant message | `.212` #44 | **DELTA — false anchor corrected.** `:453616` (`model_reasoning_effort`) is the **`/import` foreign-agent config schema** (`approval_policy`, `sandbox_mode`), not a Claude Code transcript; the transcript site `:438126` is byte-equivalent to `:459180 (193)` | see the false-delta table below | README (not covered in depth) |
| Fast mode restores / fast mode announcements — see `.208` #6 and `.218` #31 above | — | — | — | — |

### Bullets where `models` is a secondary theme (16)

| Bullet | Ver | Verdict | Anchor | Doc section |
|---|---|---|---|---|
| Claude Sonnet 5 sessions no longer use the mid-conversation system role | `.201` #1 | **⚠ DELTA — REVERTED before `.220`.** Sonnet 5 declares `mid_conv_system` and is absent from the exclusion list | `:14207`; `:150505-150526`; 193's true-list at `:135302 (193)` | opus5 §5 |
| Bg sessions ignoring `effortLevel` changes in settings.json when daemon-forked | `.205` #20 | **UNANCHORED** (`effortLevel` 23/19 — growth is in subagent plumbing) | — | not covered |
| Expired login failing every model with a misleading model error | `.206` #7 | **CARRYOVER** (`There's an issue with the selected model` 1/1) | not read by this agent | not covered |
| Context window briefly resetting to 200k after an auto-update | `.208` #9 | **UNANCHORED** (`cachedContextWindow` 0/0; `2e5` too common) | mechanism at `:150238-150242` | opus5 §3 (closing note) |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` using the mantissa of `1e6` | `.208` #12 | **UNANCHORED** (`scientific` 1/1) | env clamp visible at `:150305-150306` | catalogue §1.1 (mechanism only) |
| `/model` and other dialogs unblocked in `claude agents` bg sessions (revert) | `.209` #1 | **NET_NEW** (`tengu_slash_command_unavailable` 2/0, `unavailable_in_agent_view` 1/0) | `:806776-806782` | org_default §7.2 |
| `claude agents --effort ultracode` silently dropped | `.210` #18 | **DELTA** (`"ultracode"` 83/70) | `uJn` `:802163` (parser) vs 193 `cje` `:674085-674086 (193)` (validator); alias table `hBc` `:119651` | [../by_version/2.1.210.md](../by_version/2.1.210.md) §3 |
| Auto-mode classifier defaults to Sonnet 5 for external sessions, pinned | `.210` #27 | **DELTA** (`tengu_auto_mode_classifier_queue` 1/0) | `tengu_auto_mode_classifier_queue` 1/0 | [../38_permissions/classifier_adjudication.md](../38_permissions/classifier_adjudication.md) |
| Subagents with an explicit model override revert to parent model on resume | `.211` #7 | **DELTA, unpinned** (`modelOverride` 28/16) | resolver `Wrd` `:318835-318866`; `subagent_model_resolve` 7/0 — ⚠ `modelOverride` 28/16 is an **unrelated subsystem** | [../by_version/2.1.211.md](../by_version/2.1.211.md) §6 |
| Prompt-caching regression on Bedrock/Vertex/Mantle/Foundry trailing system block | `.211` #37 | **NET_NEW (gate only)** (`tengu_lapis_anchor_*` 1/0) | `g1_` `:511909` promotes the cache breakpoint onto the `api_system` tail — 193 `PGf` `:596391` emitted **no** `cache_control` on any system message | [../40_system_prompt/mid_conversation_system_role.md](../40_system_prompt/mid_conversation_system_role.md) (api_reliability) |
| Headless/SDK `set_model` control request applies mid-turn | `.212` #45 | **NET_NEW** (`tengu_live_model_switch` 2/0, `tengu_set_model_unrecognized` 1/0) | `:337601-337614`, `:847590-847612` | org_default §7.3 |
| Reasoning effort added to the `subagentStatusLine` payload | `.214` #13 | **NET_NEW** (`effort: g.effort` 1/0) | `effort: g.effort` `:750210` **1/0**; `subagentStatusLine` container is 11/11 carryover | [../by_version/2.1.214.md](../by_version/2.1.214.md) §3.6 |
| Auto-compact never triggering for Opus 4.8 on Bedrock; `/compact` over the limit | `.216` #6 | **DELTA** — the Opus 4.8 entry's `context.window: 1e6` + `native_1m` (no `native_1m_3p`) is the relevant catalogue data | `:14347`; `$xg` `:150210-150222` | opus5 §3 (mechanism) |
| Remote Control clients keeping a stale fast-mode status after switch/reconnect | `.219` #12 | **NET_NEW** — a third `tengu_fast_mode_toggled` source, `remote_wire_adopt` | `:757319-757330`; `fast_mode_state` 21/18 | fast_mode §7.3 |
| claude-api skill defaults to Claude Opus 5, with a migration path from Opus 4.8 | `.219` #23 | **DELTA** (`OPUS_ID` 181/141) | table `QzS` `:799615-799631` vs `Esm` `:671821-671833 (193)`; `PREV_OPUS_ID` **10/0** (it holds 193's `OPUS_ID` value — a one-deep generational ring) | [../45_skills/skill_loading_and_stacking.md](../45_skills/skill_loading_and_stacking.md) §8 |
| Bug fixes and reliability improvements | `.220` #1 | **SERVER_SIDE / contentless** — `.220` is the build under analysis | — | — |

### Undocumented deltas this module surfaces (no changelog bullet at all)

| Finding | Evidence | Doc |
|---|---|---|
| **The whole model registry was rewritten** (imperative camelCase → declarative snake_case catalogue) | `provider_ids` 22/0, `knowledge_cutoff` 16/0, `advisor_rank` 12/0, `vertex_region_env_var` 19/0, `supports_1m_suffix` 13/0, `native_1m` 11/0, `latest_per_family` 4/0, `alias_migration` 4/0, `per_provider` 4/0, `tier_*` 16/0; blob at `:14008-14496` | catalogue (all) |
| **`anthropic_google_cloud` — an eighth provider channel** | `anthropicGoogleCloud` 23/0, `ANTHROPIC_GOOGLE_CLOUD` 47/0, `claude.googleapis.com` 3/0, in the public SDK enum at `:836303` | anthropic_google_cloud (all) |
| **Alias resolution is provider-dependent**, so "now the default Opus/Sonnet model" is not universal | `:14461-14486`: `opus`→Opus 4.6 on foundry (`:14467`), Opus 4.7 on gateway (`:14470`); `sonnet`→Sonnet 4.5 on bedrock/vertex/foundry/mantle (`:14476-14479`) | catalogue §9 |
| **`claude-mythos-5`**: a fully-plumbed, first-party-only, server-unlockable family; catalogue nulls every provider id while a legacy literal supplies all eight | `:14439-14459` vs `:100253-100263`; special-cased by name in 9 predicates | catalogue §5 |
| **`opus_5_prompt_bundle` flips six prompt-experiment gates at once**, with one kill switch | `:118700-118704`, `:118705-118707`, gate names `:118744-118750` (all 7 in the new-gate list) | opus5 §2 |
| **Five catalogue schema fields declared and never populated** (`slogan`, `fallback_chain`, `picker`, `deprecation`, `min_cli_version`) + an unassigned capability-override seam `z8m` + `.loose()` schemas | `:14567`, `:14606`, `:14607-14615`, `:14616-14622`, `:14623`; `z8m` declared `:14530`, called `:14521`, never assigned | catalogue §6, §7.6 |
| **`alias_migration` plumbing shipped without data, and is not even wired to the catalogue** | catalogue field `:14495` is `{}`; the consumer `rTm` reads a *separate* empty `qlE` (`:833753`); `tengu_alias_migration` can never fire | catalogue §7.3 |
| **Fast-mode pricing is still imperative** — `a7n` (`:109843-109850`) duplicates `tier_10_50` (`:14022`) as a hard-coded literal | `zkt` `:109713-109717`, `Dji` `:109772-109784` | opus5 §4 |
| **The retirement-date table is the one per-model dataset the rewrite did not absorb** | `JIc` `:110053-110134` (camelCase, `retirementDates` 7/7 carryover) vs the empty `deprecation` schema slot `:14616-14622` | catalogue §7.6 |

---

## False deltas caught (things that read as new but are not)

These are the traps a bullet-first reading falls into. Each was measured in **both** bundles.

| Reads as new | Reality | Evidence |
|---|---|---|
| `.219` "Removed Opus 4.7 from fast mode" | **Not implemented client-side.** The `fast_mode` capability is still on the Opus 4.7 entry *and* `opus-4-7` is still in the substring fallback | `fast_mode` capability sites 220=3 (`:14324`, `:14357`, `:14392`); `:109473`. 193's list was `4-6 \|\| 4-7 \|\| 4-8` (`:102324 (193)`) — the real delta is 4-6 out / 5 in |
| The whole of fast mode | **Carryover.** 17 fast-mode strings/gates/settings are 1:1, and four counts *shrank* | `Fast mode has been disabled by your organization` 220=1/**193=2**; `Checking fast mode availability` 220=1/**193=2**; `Fast mode OFF` 220=6/**193=7**; `Draws from usage credits` 220=5/**193=7**; `fastModePerSessionOptIn` 3/3; `xji` byte-equivalent to `HOr` `:102314-102319 (193)` |
| `.219` #10 "Opus (1M context)" label | **A removal, not an addition.** The count fell | `Opus (1M context)` 220=3 / **193=4**; the deleted line is 193's `:236012` relabel patch |
| `.219` #9 "Requires usage credits" | **A consolidation.** Two inline appends became one constant + one idempotent normaliser | 220=1 / **193=2** (`:235655 (193)`, `:350738 (193)`) |
| `.196` "shows as … 'Role default'" | **The label does not exist in the bundle** | `Role default` 220=**0** / 193=0 |
| `.212` #44 "transcripts record the reasoning effort level" — anchored at `model_reasoning_effort` `:453616` | **Decoy.** `:453616` sits in a zod object alongside `approval_policy` / `sandbox_mode` / `bearer_token_env_var` — the `/import` foreign-agent config reader, not a Claude Code transcript. The real transcript site `:438126` is byte-equivalent to `:459180 (193)` | `model_reasoning_effort` 220=1/193=0 but in the wrong subsystem; `effortLevel` 220=23/193=19 with the growth in `:314304`/`:314401`/`:314434`/`:314443` (subagent status), not transcripts |
| `.201` "Sonnet 5 no longer uses the mid-conversation system role" | **Real change, reverted.** Sonnet 5 declares the capability again | `:14207` inside `:14177-14213`; `:150524` returns true; the 193 true-list at `:135302 (193)` is gone |
| `mid_conv_system` "was already there in 193 (count 1)" | **The 193=1 hit is a different thing** — the substring inside the gate name `tengu_mid_conv_system_fallback_retry` (`:595123 (193)`). The capability token is 220=4 / **193=0** | whole-word check |
| `.207` "Bedrock/Vertex/Claude Platform on AWS default to Opus 4.8" | **Superseded within the window** — those rows read `claude-opus-5` in 2.1.220 | `:14465`, `:14466`, `:14469` |
| `tengu_sunset_penguin_opus47` looks like the Opus 4.7 retirement | **Carryover, and shipped already-expired.** 220=1/193=1; in 193 it was one row of a *generic* two-row sunset table (`:102522-102525 (193)`) that 220 collapsed to a hard-coded 4.7 check. Its default date `2026-07-25` is 1 h 42 min after this build's `build_time` | `:109491-109497` |
| `ANTHROPIC_GOOGLE_CLOUD_AUTH` looks like a sixth GCP env var | **It is the suffix of `CLAUDE_CODE_SKIP_ANTHROPIC_GOOGLE_CLOUD_AUTH`** (`:24179`). Whole-word grep returns 0 | `grep -n '\bANTHROPIC_GOOGLE_CLOUD_AUTH\b'` → empty |
| `tengu_config_model_changed` looks like the `.218` announcement delta | **Carryover** 1/1; the delta is the `HU`→`IU`→`kmt` chain wired around it | `:451241-451256` |
| `1M context` machinery looks new because Sonnet 5 is native-1M | **Carryover.** `1M context` 220=42/193=40. Only `native_1m` / `native_1m_3p` are new | `:14196-14197` |
| `positionAfter` as the `.206` #14 anchor | **0/0 in both bundles** — the concept exists but under no such name | the real anchor is `$Qt` `:120665-120701` |
| `replaceAll("Opus 5", accent(…))` looks NET_NEW at 220=1/193=0 | **The probe is too narrow.** 193 has the identical mapper with a different target: `replaceAll("Fable 5", xo("claude", h)("Fable 5"))` at `:490616 (193)`. Mechanism carryover; only the highlighted literal moved | corrected in the ledger; see opus5 §6 |
| `Ede(...)` / `*_SUPPORTED_CAPABILITIES` look like part of the catalogue rewrite | **Carryover.** `_SUPPORTED_CAPABILITIES` is **220=15 / 193=15**; the five env pairs (`:118804-118825`) predate the catalogue. Only the vocabulary of tokens they may name changed | `:118826-118844` |

---

## ⚠ Correction to `_GROUND_TRUTH_verified_anchors.md` §6.5

Ground truth §6.5 states: *"There is **no fast-mode tier and no multiplier anywhere in the pricing
code** … the client's own cost accounting prices a fast-mode turn at the standard `tier_5_25` rate, so
session cost is under-reported by ~2x in fast mode."* It then tells `47_models` not to claim the client
implements the $10/$50 price.

**That conclusion is wrong, and this module contradicts it with source.** There is no *multiplier*, but
there is a **cost-object substitution** keyed on `usage.speed`:

```javascript
// ORIGINAL (:109772-109784) - Dji, resolveModelCosts
function Dji(e, t) {
  let r = lo(e);
  if (t.speed === "fast") {
    if (r === "claude-opus-4-8" || r === "claude-opus-5") return a7n;   // $10/$50
    if (r === "claude-opus-4-6" || r === "claude-opus-4-7") return UIc; // $30/$150
  }
  let n = Fot[r];
  ...
}
```

`a7n` = `{inputTokens: 10, outputTokens: 50, …}` at `:109843-109850`; `UIc` = `{30, 150, …}` at
`:109835-109842`. `Dji` is the *only* input to `Roe`/`Lji` (`:109788-109790`, `:109763-109771`), i.e. the
real session-cost accumulator, and `Kkt` (`:109792-109802`) forwards `speed` into it. So **fast-mode
turns are billed client-side at $10/$50 for Opus 4.8/5 and $30/$150 for Opus 4.6/4.7**; session cost is
*not* under-reported. `zkt` (`:109715-109719`) applies the same substitution for the `/fast` confirmation
string, which is where the changelog's "$10/$50" comes from.

The mechanism is also **carryover**, not new: 2.1.193 has the identical branch at `:102555-102558 (193)`
(`if (n === "claude-opus-4-8") return n_n;` / `if (n === "claude-opus-4-6" || n === "claude-opus-4-7") return r7s;`).
The window's delta is one disjunct — `|| r === "claude-opus-5"` — added to the $10/$50 arm.

Ground truth is right that `fast_mode_multiplier` / `fastModeMultiplier` are 0/0 and that the
`claude-api` skill text at `:797089` also carries "$10/$50"; it drew the wrong inference from those two
facts. Detail in [`fast_mode.md`](fast_mode.md) and [`opus5_and_sonnet5.md`](opus5_and_sonnet5.md) §4.

---

## Answers to the ground-truth open questions

| # | Question | Answer | Where |
|---|---|---|---|
| 2 | `.219` says Opus 5 fast mode is "$10/$50" but the catalogue says `tier_5_25`. Where is the multiplier? | **There is no multiplier.** Fast mode substitutes a whole cost record: `a7n = {10, 50, 12.5, 20, 1, 0.01}` (`:109843-109850`), numerically identical to `tier_10_50` (`:14022`). Base stays `tier_5_25` = $5/$25. Opus 4.6/4.7 fast mode uses `UIc` = $30/$150 (`:109835-109842`), i.e. 6× base; 4.8/5 is 2× base. Selected by `zkt()` (`:109713-109717`) for display and `Dji()` (`:109772-109784`) for billing, keyed on `usage.speed === "fast"` | opus5 §4 |
| 3 | What is `claude-mythos-5`? | A first-party-only, server-unlockable `family: "mythos"` with Fable-5 economics (`tier_10_50`, `advisor_rank: 5`, 1M native). The catalogue nulls all eight provider ids (`:14443-14452`) and empties `capabilities` (`:14456`), so it is excluded from the bridge table `OZh` and hand-written as camelCase `ybc` (`:100253-100263`) with **all eight ids populated** — a contradiction inside one build. **This exclusion is carryover** (193 did the same with `VWs`/`Kc`). It is gated by `_7n()` (`:110534-110537`), and special-cased **by name** in 9 predicates because `capabilities: []` makes the catalogue path useless. A fourth id, `claude-mythos-preview`, is 12/12 carryover | catalogue §5 |
| 4 | `alias_migration: {}` is empty — what consumes it, and what does `tengu_alias_migration` do? | **Nothing consumes it.** The catalogue field (`:14495`) is validated (`:14640`) but never read: `grep` finds no `yQ().alias_migration`. The would-be consumer `rTm()` (`:833732-833744`) defaults its argument to a *separate* local table `qlE = {}` (`:833753`) and is called with no arguments (`:834073`). So `tengu_alias_migration` cannot fire in this build. The intended mechanism is legible: first-party only, reads persisted `userSettings.model`, strips `[1m]` with `Qs`, looks the bare id up, writes the replacement back preserving the suffix, reports `{from_model, to_model, has_1m}` — a pre-built "we retired the id you pinned" self-heal | catalogue §7.3 |
| 5 | `best: "fable"` — what consumes it, and does it explain `.210`'s Fable-advisor bullet? | `iRc()` (`:110496-110500`) resolves `best` only if the family is in the one-entry registry `m7n` (`:111372`) *and* `.available()` — which is `Qkt()` (`:110521-110533`, first-party + official base URL + an enabled server row). Otherwise `best` silently means `"opus"`. `sRc()` (`:110501-110514`) is what `vi("best")` returns, with a re-entrancy latch `Fji`. `best` is in the alias allow-list `m1e` (`:86599`). **And yes** — the `.210` bullet maps onto `wws()`'s early return `if (F6e(t) && !Qkt()) return;` (`:308419`): a `disabled: true` Fable row from the server makes the advisor rank `undefined`, dropping Fable below the `mxy` floor in `QQu()` (`:308440-308443`). Correctly SERVER_SIDE | catalogue §7.2, §7.4 |
| 6 | `anthropic_google_cloud` has no changelog bullet — trace its plumbing | Done end-to-end: 8-way provider enum with GCP inserted before `vertex` (`:100310-100311`), `isClaudePlatformProvider` (`:100346-100348`) with 5 consumers, 10 populated `provider_ids` slots, two name bridges (`:100179`, `:111379`), two label tables (`:100389`, `:593290`), 5 env vars across 8 allow-lists, client construction with 7 env mirrors + ADC pre-flight (`:149628-149650`), base URL `https://claude.googleapis.com` (`:149737`), 3-way auth remediation (`:228637-228652`), transient-error hint naming Google's status page (`:228152`), `/status` rows (`:666180-666191`), retry-safety `false` grouped with `gateway` (`:509330-509331`), and membership in the **public SDK `api_provider` enum** (`:835305`, `:836303`) | anthropic_google_cloud (all) |
| 1 | Which `filesystem.disabled` / `strictAllowlist` sites are new? | Not this module's theme (sandbox) | — |

---

## Not covered

Honest list of what this module does **not** answer, and why.

1. **`.210` #18 (`--effort ultracode` dropped)**, **`.210` #27 (auto-mode classifier pins Sonnet 5)**,
   **`.211` #7 (subagent model override on resume)**, **`.211` #37 (prompt-cache anchor)**,
   **`.214` #13 (`subagentStatusLine` effort)**, **`.219` #23 (claude-api skill `OPUS_ID`)**.
   All six are `models`-*secondary* bullets whose primary mechanism lives in another module
   (background_agents, permissions, subagent_limits, api_reliability, skills_plugins). Their scoping
   verdicts and anchors are recorded in the ledger above, but **I did not read those sites in the
   2.1.220 bundle**, so I cite nothing for them.
2. **`.206` #7 (expired login → misleading model error).** Scoping measured it CARRYOVER (1/1) and I
   did not read `:228674`. Recorded as carryover on the strength of the count only.
3. **`.205` #20, `.208` #9, `.208` #12, `.208` #5 remain UNANCHORED.** I re-probed `.208` #5's
   `declineFirst`/`initialIndex` (3/3) and confirmed the dead end; for the other three I relied on the
   scoping counts. The plausible mechanisms are named in the docs, but no changed line is identified.
4. **`E7n` (`resolveEnforcedAvailableModel`, `:110784-110936`) is described but not dissected.** It is
   150 lines of `enforceAvailableModels` + `modelOverrides` resolution with its own alias re-resolution,
   a `fB` warn-once set, and a `v7n()` cascade-trust state machine. It deserves its own doc under
   `38_permissions/` or a follow-up here; I documented its *position* in the ladder and its inputs, not
   its internals.
5. ~~**`Ede(model, capability)`** definition not located.~~ **CLOSED on a second verification pass.**
   `Ede` is assigned at `:118826-118844` from the five-row table `eug` at `:118804-118825`; it reads
   `ANTHROPIC_DEFAULT_{FABLE,OPUS,SONNET,HAIKU}_MODEL_SUPPORTED_CAPABILITIES` +
   `ANTHROPIC_CUSTOM_MODEL_OPTION_SUPPORTED_CAPABILITIES`, is **inert on first-party** (`if (rm()) return;`),
   and is `_SUPPORTED_CAPABILITIES` **220=15 / 193=15 — carryover**. Full dissection in
   [`model_catalogue_rewrite.md`](model_catalogue_rewrite.md) §7 layer 3.
6. **The `.216` #6 auto-compact/Bedrock bullet** is credited to the compact module. I identified the
   relevant catalogue data (Opus 4.8 has `native_1m` but **no** `native_1m_3p`, `:14347`, so
   `$xg("bedrock", ctx)` returns false and the effective window on Bedrock is not 1M) which is very
   likely the root cause — but I did not read the auto-compact trigger itself, so I label it a
   mechanism hypothesis, not the fix.
7. **`tengu_remote_model_picker`, `tengu_advisor_settings_sync`, `tengu_import*`** and other new gates
   adjacent to models are noted where read (`:715357`, `:715363`) and otherwise left to their owning
   modules.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> All symbols discovered by this module are staged for merge in
> [symbol_additions_v2_1_220_models.md](../00_overview/symbol_additions_v2_1_220_models.md)
> (routing: **Model Selection** and **Prompt Building** groups → `symbol_index_infra_platform.md`;
> **UI Components** group → `symbol_index_infra_integration.md`).

The five highest-value entry points for a reader:
- `BAKED_CATALOGUE` (`Skl`, `:14008-14496`) - the declarative catalogue itself
- `getModelCatalogue` (`yQ` / `PFr`, `:14653-14657`) - the memoised validated accessor
- `resolveModelWithAttribution` (`iQt`, `:110736-110751`) - the four-level model precedence ladder
- `isFastModeEligibleModel` (`mv`, `:109467-109474`) - the predicate that contradicts `.219` bullet 22
- `getAPIProvider` (`Hn`, `:100302-100317`) - the eight-way provider enum
