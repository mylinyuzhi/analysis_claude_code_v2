# Symbol additions — v2.1.220 — theme `system_prompt`

Staged additions from [`../40_system_prompt/`](../40_system_prompt/). Every row's `File:Line` was read in
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js` (872,596 lines) during this
module pass. Line numbers are valid **only for build `4073f595` / 2.1.220**; the stable anchor is the string
literal, gate name, env var, or beta-header id given in the Notes column.

Merge instructions are stated per group. Sort alphabetically inside each module section on merge.

---

## Module: System Prompts

**Merge into `symbol_index_core_execution.md`, section `Module: System Prompts`.**

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cO_` | `buildSystemSection` | cli_inner_pretty.js:507555 | function |
| `Jep` | `usesMidConvSystemFraming` | cli_inner_pretty.js:508116 | variable |
| `lO_` | `MID_CONV_SYSTEM_FRAMING` | cli_inner_pretty.js:508026 | constant |
| `Qep` | `selectOutOfBandFramingSentence` | cli_inner_pretty.js:507549 | function |
| `aO_` | `buildInteractiveAgentPreamble` | cli_inner_pretty.js:507542 | function |
| `zon` | `buildSubagentPromptTail` | cli_inner_pretty.js:507925 | function |
| `Xep` | `buildLatestModelIdsSentence` | cli_inner_pretty.js:508104 | variable |
| `lpd` | `SUBAGENT_ROLE_SENTENCE` | cli_inner_pretty.js:508044 | constant |
| `Kep` | `AGENT_TOOL_RESTRAINT_LINES` | cli_inner_pretty.js:508111 | constant |

Notes:
- `Qep` is the three-way framing selector; `lO_` is its 220-only branch text
  (`These are system-controlled, unlike function results`, 220=1 / 193=0). `cO_` places `Qep(e, "standard")`
  at `:507559`, immediately before the prompt-injection instruction at `:507560`.
- `zon` carries the `.198` authority clause at `:507936` (anchor: `launched you`, 220=1 / 193=0).
- 2.1.193 has no `Qep`/`Jep` split: the two framing sentences are inline literals at `:592592 (193)`
  (inside `L3f`) and `:592747 (193)`.

---

## Module: Agent Loop / LLM API

**Merge into `symbol_index_core_execution.md`, section `Module: LLM API` (create it if absent).**

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bji` | `MID_CONV_CACHE_PROMOTION_OK_LATCH` | cli_inner_pretty.js:109220 | constant |
| `btp` | `makeEffortOnlySystemTurn` | cli_inner_pretty.js:508707 | function |
| `cU_` | `enforceApiSystemPlacement` | cli_inner_pretty.js:531760 | function |
| `dvi` | `setMidConvCachePromotionRejectedGlobal` | cli_inner_pretty.js:3933 | function |
| `Etp` | `stripPerTurnEffortConfigs` | cli_inner_pretty.js:508691 | function |
| `g1_` | `placeCacheBreakpoints` | cli_inner_pretty.js:511886 | function |
| `H` (inner) | `flushPendingReminders` | cli_inner_pretty.js:531516 | function |
| `Jno` | `makeApiSystemMessage` | cli_inner_pretty.js:157377 | function |
| `lW` | `PER_TURN_CONTROL_BETA` | cli_inner_pretty.js:109215 | constant |
| `NN` | `normalizeMessagesForApi` | cli_inner_pretty.js:531420 | function |
| `r5r` | `MID_CONV_CACHE_PROMOTION_LATCH` | cli_inner_pretty.js:109219 | constant |
| `rus` | `isCacheControlRejection` | cli_inner_pretty.js:228393 | function |
| `Stp` | `insertPerTurnEffortStatements` | cli_inner_pretty.js:508671 | function |
| `uvi` | `isMidConvCachePromotionRejected` | cli_inner_pretty.js:3930 | function |
| `VLu` | `SYSTEM_ROLE_ERROR_RE` | cli_inner_pretty.js:229018 | constant |
| `vNr` | `resetStickyBetasAndEffortPins` | cli_inner_pretty.js:3951 | function |
| `vpo` | `isSystemRoleRejection` | cli_inner_pretty.js:228385 | function |
| `vtp` | `collectUserMessageUuids` | cli_inner_pretty.js:508704 | function |
| `Ww` | `wrapInSystemReminder` | cli_inner_pretty.js:532376 | function |
| `I9s` | `unwrapSystemReminder` | cli_inner_pretty.js:532381 | function |
| `vU_` | `joinUnwrappedReminderTexts` | cli_inner_pretty.js:532427 | function |
| `Epo` | `errorNamesBetaHeader` | cli_inner_pretty.js:228382 | function |

Notes:
- **Net-new anchors (220 > 0 / 193 = 0):** `mid_conv_cache_promotion` 2/0 (`r5r` `:109219`, `bji` `:109220`);
  `retry:api-system-cache-demote` 1/0 (`:509925`); `proxy rejected cache_control` 1/0 (`:509921`);
  `sticky-rejecting the beta` 2/0; `per-turn-control-2026-07-01` 1/0 (`lW` `:109215`);
  `perTurnEffort`/`per_turn_effort` 12/0.
- **Carryover, do not call new:** `mid-conversation-system-2026-04-07` 1/1 (`aW` `:109214`,
  193 `:102184`); `retry:mid-conv-system` 1/1 (220 `:509912`, 193 `:595124`);
  `tengu_mid_conv_system_fallback_retry` 1/1 — but 220's payload is `{ per_turn_effort: mr }` (`:509912`)
  vs 193's `{}` (`:595123`).
- `g1_` is the `.211` fix: the promotion expression is `:511909`
  (`f = c && t && !n && l >= 0 && p ? u : l`) and the `cache_control` emission on an `api_system` message is
  `:511938-511943`. The 2.1.193 twin `PGf` (`:596391-596427`) emits
  `{ role: "system", content: u.message.content }` with no cache field at all.
- `vpo` gained one line over its 193 twin `EPn` (`:237478-237484`): `:228390`
  `if (t.includes("cache_control") && VLu.test(t)) return !0;` — the tie-break that routes an ambiguous 400
  to the role-rejection remedy rather than the cache-demote remedy.
- `NN`'s two mid-conv flags are `o = Ser(model)` (`:531421`) and `i = o && mro(model)` (`:531422`).

---

## Module: Model Selection

**Merge into `symbol_index_infra_platform.md`, section `Module: Model Selection`.**
(Cross-check against `symbol_additions_v2_1_220_models.md` before merging — `M$` may already be staged there.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Fc` | `isOpus48` | cli_inner_pretty.js:118668 | function |
| `aW` | `MID_CONVERSATION_SYSTEM_BETA` | cli_inner_pretty.js:109214 | constant |
| `Ede` | `getCustomModelCapabilityOverride` | cli_inner_pretty.js:118826 | variable |
| `eug` | `CUSTOM_MODEL_ENV_VAR_PAIRS` | cli_inner_pretty.js:118800 | constant |
| `M$` | `modelHasCapability` | cli_inner_pretty.js:14517 | function |
| `mro` | `isSonnet5` | cli_inner_pretty.js:150395 | function |
| `Ser` | `supportsMidConversationSystem` | cli_inner_pretty.js:150505 | variable |
| `w_e` | `experimentalBetasDisabled` | cli_inner_pretty.js:109341 | function |
| `hro` | `modelPrefersTemperature` | cli_inner_pretty.js:150398 | function |
| `vkl` | `resolveAliasForProvider` | cli_inner_pretty.js:14523 | function |

Notes:
- `Ser` is the memoised (`Vr`) resolver; its 2.1.193 twin is `TAn` at `:135284 (193)`. The **deny list is
  byte-identical** in both builds (10 model ids); only the allow test changed from a hardcoded three-id list
  (`:135303 (193)`) to `M$(r, "mid_conv_system") || r === "claude-mythos-5"` (`:150524`).
- `M$` returns `undefined` (not `false`) for a catalogued model lacking the capability, so control falls
  through to the optimistic first-party default. That is why `claude-mythos-5` — catalogue entry `:14439`
  with `capabilities: []` — needs the `|| r === "claude-mythos-5"` name clause.
- `mro` is 220-only by construction: `claude-sonnet-5` is 220=35 / 193=0.
- `Ede` reads `ANTHROPIC_CUSTOM_MODEL_OPTION` / `ANTHROPIC_CUSTOM_MODEL_OPTION_SUPPORTED_CAPABILITIES`
  pairs from `eug` and is consulted by every capability predicate (`effort` `:119360`, `max_effort`
  `:119378`, `xhigh_effort` `:119396`, `thinking` `:119686`, `adaptive_thinking` `:119716`,
  `interleaved_thinking` `:150354`, `temperature` `:150399`, `mid_conversation_system` `:150508`).
- `mid_conv_system` capability declarations in the catalogue: `:14207` (sonnet-5), `:14355` (opus-4-8),
  `:14390` (opus-5), `:14428` (fable-5).

---

## Module: Steering / Message Provenance

**Merge into `symbol_index_core_features.md`, section `Module: Steering` (create a
`Message provenance` sub-heading if useful).**

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_kS` | `classifyTaskNotificationOrigin` | cli_inner_pretty.js:737186 | function |
| `dZg` | `SCHEDULED_TASK_BANNER_PREFIX` | cli_inner_pretty.js:226513 | constant |
| `fVe` | `isPeerOrObserverOrigin` | cli_inner_pretty.js:216900 | function |
| `gXa` | `humanOriginForEntrypoint` | cli_inner_pretty.js:737182 | function |
| `Hcs` | `prefixScheduledTaskBanner` | cli_inner_pretty.js:226508 | function |
| `iee` | `isHumanOrAutoContinuation` | cli_inner_pretty.js:216903 | function |
| `juo` | `isHumanTypedOrigin` | cli_inner_pretty.js:216894 | function |
| `kcs` | `prefixSystemNotificationBanner` | cli_inner_pretty.js:226504 | function |
| `kNt` | `applyOriginBanner` | cli_inner_pretty.js:533914 | function |
| `m_l` | `USER_MESSAGE_ORIGIN_SCHEMA` | cli_inner_pretty.js:836439 | variable |
| `Nie` | `isHumanOrLegacyOrigin` | cli_inner_pretty.js:216897 | function |
| `x7r` | `SYSTEM_NOTIFICATION_BANNER` | cli_inner_pretty.js:226516 | constant |
| `Zdo` | `SCHEDULED_TASK_BANNER` | cli_inner_pretty.js:226522 | constant |

Notes:
- **Net-new (220 > 0 / 193 = 0):** `No human input has been received` 1/0 (`:226519`);
  `SCHEDULED TASK - AUTOMATED FIRING OF A CONFIGURED PROMPT` 2/0 (`:226513`, `:226522`);
  `delivered by the scheduler as configured` 1/0 (`:226524`); `scheduled-trigger` 5/0;
  `isHumanTypedPrompt` 2/0 (`:516671`, `:652560`).
- **Carryover trap:** the banner prefix `[SYSTEM NOTIFICATION - NOT USER INPUT]` is 220=1 (`:226516`) /
  193=1 (`:599351`). Only the fourth line is the `.205` delta. Grep `no human` (220=3 / 193=0) instead.
- `kcs` / `Hcs` are **idempotent** (`if (e.startsWith(x7r)) return e;`), unlike 193's `DQl` (`:599351`),
  which was a one-shot constructor. The banners moved from message-construction time to normalization time
  (`NN` `:531548-531558`, dispatcher `kNt` `:533918`, third check-site `:443723`).
- The origin union gained `observer` and `observer-activity` in 220 (`:836441-836505`) vs
  `:699217-699236 (193)`; `task-notification` gained a `subkind` field (`:836486`).

---

## Module: Workflow

**Merge into `symbol_index_core_features.md`, section `Module: Workflow`.**
(Cross-check against `symbol_additions_v2_1_220_workflow.md` — `aJn` may already be staged there.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aJn` | `isWorkflowKeywordTriggerEnabled` | cli_inner_pretty.js:119330 | function |
| `DN_` | `buildWorkflowKeywordRequest` | cli_inner_pretty.js:516931 | function |
| `DWs` | `findUltracodeMatches` | cli_inner_pretty.js:498297 | function |
| `eXd` | `hasUltraplanKeyword` | cli_inner_pretty.js:498300 | function |
| `FFo` | `findUltraplanMatches` | cli_inner_pretty.js:498291 | function |
| `LWs` | `findKeywordOutsideQuotes` | cli_inner_pretty.js:498250 | function |
| `Q7d` | `QUOTE_AND_BRACKET_PAIRS` | cli_inner_pretty.js:498316 | constant |
| `tXd` | `hasUltracodeKeyword` | cli_inner_pretty.js:498303 | function |
| `Z7d` | `findUltrareviewMatches` | cli_inner_pretty.js:498294 | function |
| `BFo` | `stripUltraplanKeywordFromPrompt` | cli_inner_pretty.js:498306 | function |

Notes:
- `LWs` is **carryover**: its `new RegExp(\`\\b${t}\\b\`, "gi")` line is `:498275` in 220 and
  `:472958 (193)`. `.210`'s fix is the provenance gate at `:516671`, **not** the scanner.
- The `.210` before/after is one identifier on one line: 193 `:473269` reads
  `i?.isRegularUserPrompt && …`; 220 `:516671` reads `s?.isHumanTypedPrompt && …`.
- `isHumanTypedPrompt` is computed once at prompt submission (`:652554`, `K = V && juo(b)`) and passed down
  in the prompt-meta object at `:652560`.

---

## Cross-references

- Model catalogue rows, alias resolution and `pricing_tiers` live in
  [`symbol_additions_v2_1_220_models.md`](symbol_additions_v2_1_220_models.md) — this file adds only the
  capability *consumers*.
- The remaining arms of the request-retry classifier (`Gl`, `Spo`, `Zcs`, `mpo`, `eus`, `tus`, `wpo`,
  `ous`, `nus`, `Apo`) belong to `symbol_additions_v2_1_220_*` for `57_api_reliability`; only `vpo`
  and `rus` are staged here because they mutate the system block.
- `Wko` (Agent tool) and the subagent instruction-scrubber `:345393` belong to
  [`symbol_additions_v2_1_220_subagent_limits.md`](symbol_additions_v2_1_220_subagent_limits.md).
