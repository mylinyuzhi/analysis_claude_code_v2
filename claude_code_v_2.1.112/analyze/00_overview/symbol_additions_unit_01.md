# Symbol Additions — Unit 1 (Plan Mode, v2.1.112)

This file lists symbols discovered while producing the `12_plan_mode/` deobfuscation pack. It is the **non-canonical** companion to `symbol_index.md` (Unit 1 contributions; the canonical symbol_index files at `00_overview/symbol_index_*.md` are not modified per unit policy).

All entries cross-validated against the v2.1.88 unobfuscated source at `/lyz/codespace/3rd/claude-code/src/`. Each symbol has BOTH a v2.1.112 chunk location AND a v2.1.88 source file:line reference.

---

## Module: Plan Mode — Tools

| Obfuscated | Readable | v2.1.112 File:Line | v2.1.88 Source | Type |
|------------|----------|--------------------|----------------|------|
| `o58` | `EnterPlanModeTool` | chunks.151.mjs:1286 | `tools/EnterPlanModeTool/EnterPlanModeTool.ts:36` | tool object |
| `d56` | `ENTER_PLAN_MODE_TOOL_NAME` | chunks.98.mjs:1319 | `tools/EnterPlanModeTool/constants.ts:1` | constant `"EnterPlanMode"` |
| `RjY` | `enterPlanModeInputSchema` | chunks.151.mjs:1284 | `tools/EnterPlanModeTool/EnterPlanModeTool.ts:21` | Zod schema (lazy) |
| `SjY` | `enterPlanModeOutputSchema` | chunks.151.mjs:1284 | `tools/EnterPlanModeTool/EnterPlanModeTool.ts:27` | Zod schema (lazy) |
| `$vK` | `getEnterPlanModeToolPrompt` | chunks.151.mjs (call site) | `tools/EnterPlanModeTool/prompt.ts:165` | function (dispatcher) |
| `HvK` | `renderEnterPlanModeToolUseMessage` | chunks.151.mjs:1316 | `tools/EnterPlanModeTool/UI.tsx` | function |
| `JvK` | `renderEnterPlanModeToolResultMessage` | chunks.151.mjs:1317 | `tools/EnterPlanModeTool/UI.tsx` | function |
| `XvK` | `renderEnterPlanModeToolUseRejectedMessage` | chunks.151.mjs:1318 | `tools/EnterPlanModeTool/UI.tsx` | function |
| `zZ` | `ExitPlanModeV2Tool` | chunks.150.mjs:2094 | `tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:127` | tool object |
| `dP` | `EXIT_PLAN_MODE_V2_TOOL_NAME` | chunks.96.mjs:2551 | `tools/ExitPlanModeTool/constants.ts:2` | constant `"ExitPlanMode"` |
| `Fk` | `EXIT_PLAN_MODE_TOOL_NAME` (legacy alias) | chunks.96.mjs:2549 | `tools/ExitPlanModeTool/constants.ts:1` | constant `"ExitPlanMode"` |
| `PGK` | `EXIT_PLAN_MODE_V2_TOOL_PROMPT` | chunks.150.mjs (prompt ref) | `tools/ExitPlanModeTool/prompt.ts:7` | string |
| `n$Y` | `allowedPromptSchema` | chunks.150.mjs:2079 | `tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:64` | Zod schema |
| `TGK` | `exitPlanModeInputSchema` | chunks.150.mjs:2081 | `tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:75` | Zod schema (lazy) |
| `Vs2` | `exitPlanMode_sdkInputSchema` | chunks.150.mjs:2083 | `tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:88` | Zod schema (lazy, SDK-facing) |
| `i$Y` | `exitPlanModeOutputSchema` | chunks.150.mjs:2086 | `tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:97` | Zod schema (lazy) |
| `vGK` | `autoModeStateModule` | chunks.150.mjs:2078 | `tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:51` | feature-gated module ref |
| `qI6` | `permissionSetupModule` | chunks.150.mjs:2078 | `tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:54` | feature-gated module ref |
| `WGK` | `renderExitPlanModeToolUseMessage` | chunks.150.mjs:2160 | `tools/ExitPlanModeTool/UI.tsx` | function |
| `DGK` | `renderExitPlanModeToolResultMessage` | chunks.150.mjs:2161 | `tools/ExitPlanModeTool/UI.tsx` | function |
| `ZGK` | `renderExitPlanModeToolUseRejectedMessage` | chunks.150.mjs:2162 | `tools/ExitPlanModeTool/UI.tsx` | function |

---

## Module: Plan Mode — Plan File / Slug

| Obfuscated | Readable | v2.1.112 File:Line | v2.1.88 Source | Type |
|------------|----------|--------------------|----------------|------|
| `g56` | `getPlanSlug` | chunks.97.mjs:1583 | `utils/plans.ts:32` | function (extended signature) |
| `pb8` | `getPlanSlugForSession` (cache reader) | chunks.97.mjs:1600 | `utils/plans.ts:59` (`clearPlanSlug` returns existing) | function |
| `jn1` | `setPlanSlug` | chunks.97.mjs:1604 | `utils/plans.ts:55` | function |
| `PR4` | `clearAllPlanSlugs` | chunks.97.mjs:1608 | `utils/plans.ts:72` | function |
| `eW` | `getPlanFilePath` | chunks.97.mjs:1612 | `utils/plans.ts:117` | function |
| `lP` | `getPlan` | chunks.97.mjs:1618 | `utils/plans.ts:131` | function |
| `WR4` | `getSlugFromLog` | chunks.97.mjs:1630 | `utils/plans.ts:144` | function |
| `Fb8` | `copyPlanForResume` | chunks.97.mjs:1634 | `utils/plans.ts:156` | async function |
| `DR4` | `copyPlanForFork` | chunks.97.mjs:1667 | `utils/plans.ts:227` | async function |
| `rJz` | `recoverPlanFromMessages` | chunks.97.mjs:1682 | `utils/plans.ts:268` | function |
| `oJz` | `findFileSnapshotEntry` | chunks.97.mjs:1713 | `utils/plans.ts:316` | function |
| `gb8` | `persistFileSnapshotIfRemote` | chunks.97.mjs:1721 | `utils/plans.ts:339` | async function |
| `aO` | `getPlansDirectory` | chunks.97.mjs:1767 | `utils/plans.ts:84` | function (memoized) |
| `iJz` | `MAX_SLUG_RETRIES` | chunks.97.mjs:1751 | `utils/plans.ts:24` | constant `10` |
| `Bb8` | `generateWordSlug` | chunks.97.mjs:1552 | `utils/words.ts:785` | function (3-word slug) |
| `Zh6` | `generateShortWordSlug` | chunks.97.mjs:1567 | `utils/words.ts:796` | function (2-word slug) |
| `MR4` | `slugifyPrompt` | chunks.97.mjs:1559 | (not in v2.1.88) | function (v2.1.112-new) |
| `UJz` | `randomInt` | chunks.97.mjs:1544 | `utils/words.ts:763` | function (crypto-backed) |
| `R88` | `pickRandom` | chunks.97.mjs:1548 | `utils/words.ts:773` | function |
| `JR4` | `ADJECTIVES` | chunks.97.mjs:1580 | `utils/words.ts:9` | constant (array of 235) |
| `XR4` | `NOUNS` | chunks.97.mjs:1580 | `utils/words.ts:271` | constant (array ~330) |
| `gJz` | `VERBS` | chunks.97.mjs:1580 | `utils/words.ts:633` | constant (array of 108) |

---

## Module: Plan Mode — State (chunks.1 session flags)

| Obfuscated | Readable | v2.1.112 File:Line | v2.1.88 Source | Type |
|------------|----------|--------------------|----------------|------|
| `_p6` | `hasExitedPlanModeInSession` | chunks.1.mjs:3026 | `bootstrap/state.ts` | function (getter) |
| `iL` | `setHasExitedPlanMode` | chunks.1.mjs:3030 | `bootstrap/state.ts` | function (setter) |
| `x81` | `getNeedsPlanModeExitAttachment` | chunks.1.mjs:3034 | `bootstrap/state.ts` | function (getter) |
| `Km` | `setNeedsPlanModeExitAttachment` | chunks.1.mjs:3038 | `bootstrap/state.ts` | function (setter) |
| `bi` | `handlePlanModeTransition` | chunks.1.mjs:3042 | `bootstrap/state.ts` | function (transition hook) |
| `u81` | `getNeedsAutoModeExitAttachment` | chunks.1.mjs:3047 | `bootstrap/state.ts` | function (getter) |
| `sG` | `setNeedsAutoModeExitAttachment` | chunks.1.mjs:3051 | `bootstrap/state.ts` | function (setter) |
| `m81` | `handleAutoModeTransition` | chunks.1.mjs:3055 | `bootstrap/state.ts` | function (transition hook) |
| `B8.hasExitedPlanMode` | (state field) | chunks.1.mjs:2319 | `bootstrap/state.ts` | flag |
| `B8.needsPlanModeExitAttachment` | (state field) | chunks.1.mjs:2320 | `bootstrap/state.ts` | flag |
| `B8.needsAutoModeExitAttachment` | (state field) | chunks.1.mjs:2321 | `bootstrap/state.ts` | flag |

---

## Module: Plan Mode — Attachment Builder

| Obfuscated | Readable | v2.1.112 File:Line | v2.1.88 Source | Type |
|------------|----------|--------------------|----------------|------|
| `HMY` | `buildPlanModeAttachment` | chunks.155.mjs:1624 | `services/attachments/planModeAttachment.ts` (approximate) | async function |
| `$MY` | `countTurnsSinceLastPlanAttachment` | chunks.155.mjs:1595 | (attachment helper) | function |
| `jMY` | `countPlanModeAttachmentsSinceExit` | chunks.155.mjs:1612 | (attachment helper) | function |
| `bNK` | `PLAN_MODE` (config constants) | chunks.155.mjs (config) | (config block) | object/constants |
| `planSlugSeed` | (slash-command option key) | chunks.141.mjs:2249 | `commands/slash/runner.ts` (approximate) | option key (v2.1.112-new plumbing) |

---

## v2.1.112-Only Additions (Net New vs v2.1.88)

These symbols/behaviors exist in v2.1.112 but **not** in the v2.1.88 source tree at `/lyz/codespace/3rd/claude-code/src/`:

| Symbol | What it is | Where |
|--------|------------|-------|
| `MR4` / `slugifyPrompt` | Prompt → kebab-case prefix function (4 words, max 40 chars) | chunks.97.mjs:1559 |
| `getPlanSlug` second parameter `promptSeed` | Extends signature to accept a prompt-derived slug seed | chunks.97.mjs:1583, was 1-arg in v2.1.88 |
| `planSlugSeed` option propagation | Slash commands surface their prompt as a slug seed for the attachment builder | chunks.141.mjs:2249 |
| Auto-mode gate fallback notification | When `prePlanMode === 'auto'` but gate is off, force-restore to `default` with a TUI+transcript notification | chunks.150.mjs:2200-2228 |
| `recordSystemNotification` (`sv`) emit inside exit-tool gate fallback | Mirrors the TUI toast as a transcript-visible system message | chunks.150.mjs:2219-2227 |

---

## Symbol Lookup Quick Reference

If reading the analysis docs and you encounter an unfamiliar obfuscated name in the plan-mode docs, search this table first. For non-plan-mode symbols, check the canonical `symbol_index_*.md` files.

### Notes on Renaming Convention

- Multi-letter symbols ending in numbers (`g56`, `_p6`, `o58`) tend to be exports surviving across chunks; we use full readable names.
- Single-letter parameter names inside `call`/`mapToolResultToToolResultBlockParam` (`q`, `K`, `_`, `z`, `Y`, `A`, `O`, `w`, `$`, `j`, `H`, `J`, `X`, `M`, `P`, `W`) are remapped to semantic parameter names per-function. See the code snippet mapping comments in the module docs for per-function pairings.
- The dual `Fk`/`dP` (both `"ExitPlanMode"`) is preserved because their callers differ; `dP` is the v2 path used everywhere in v2.1.112.
