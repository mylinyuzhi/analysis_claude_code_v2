# Symbol Additions — Unit 02 (Plan Mode + Ultraplan)

Symbols discovered during Unit 02 analysis of `12_plan_mode/` for v2.1.112. These should be merged into the canonical `symbol_index_core_features.md` once all 18 units complete.

Each row pairs a v2.1.112 obfuscated identifier with the readable name confirmed against the v2.1.88 source at `/lyz/codespace/3rd/claude-code/src/`.

---

## Module: Plan Mode — Tool & Schemas

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `zZ` | `ExitPlanModeV2Tool` | chunks.150.mjs:2094-2314 | object |
| `dP` | `EXIT_PLAN_MODE_V2_TOOL_NAME` (`"ExitPlanMode"`) | chunks.96.mjs:2551 | constant |
| `Fk` | `EXIT_PLAN_MODE_V2_TOOL_NAME` (alias, same string) | chunks.96.mjs:2549 | constant |
| `PGK` | `EXIT_PLAN_MODE_V2_TOOL_PROMPT` | chunks.151.mjs:1135+ | constant |
| `TGK` | `inputSchema` (lazy factory for ExitPlanMode input) | chunks.150.mjs:2081 | function |
| `Vs2` | `_sdkInputSchema` (extended with `plan` / `planFilePath`) | chunks.150.mjs:2083 | function |
| `i$Y` | `outputSchema` (lazy factory) | chunks.150.mjs:2086 | function |
| `n$Y` | `allowedPromptSchema` (lazy factory) | chunks.150.mjs:2078 | function |
| `WGK` | `renderToolUseMessage` (ExitPlanMode UI) | chunks.150.mjs:2160 | function |
| `DGK` | `renderToolResultMessage` (ExitPlanMode UI) | chunks.150.mjs:2161 | function |
| `ZGK` | `renderToolUseRejectedMessage` (ExitPlanMode UI) | chunks.150.mjs:2162 | function |

## Module: Plan Mode — Helpers (Validation, Permissions, State)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Lz` | `isTeammate` | utility (chunks.96.mjs) | function |
| `Pn6` | `isPlanModeRequired` | utility (chunks.84/96) | function |
| `qj` | `getAllowedChannels` | utility (Kairos/Telegram gate) | function |
| `_p6` | `hasExitedPlanModeInSession` | bootstrap/state | function |
| `iL` | `setHasExitedPlanMode` | bootstrap/state | function |
| `Km` | `setNeedsPlanModeExitAttachment` | bootstrap/state | function |
| `sG` | `setNeedsAutoModeExitAttachment` | bootstrap/state | function |
| `qI6` | `permissionSetupModule` (lazy require, gated by feature `TRANSCRIPT_CLASSIFIER`) | chunks.150.mjs:2050,2078 | variable |
| `vGK` | `autoModeStateModule` (lazy require) | chunks.150.mjs:2078 | variable |
| `eW` | `getPlanFilePath` | chunks.97.mjs:1612 | function |
| `lP` | `getPlan` | chunks.97.mjs:1618 | function |
| `gb8` | `persistFileSnapshotIfRemote` | chunks.97.mjs:1721 | function |
| `l$Y` | `writeFile` (fs/promises bound) | chunks.150.mjs:2168 | function |
| `j6` | `logError` | utility | function |
| `E` | `logForDebugging` | utility | function |

## Module: Plan Mode — Plan File Lifecycle

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `h86` | `getPlanSlugCache` | utility (chunks.97) | function |
| `g56` | `getPlanSlug` | chunks.97.mjs:~1590 | function |
| `pb8` | `getPlanSlugForSession` | chunks.97.mjs:1600 | function |
| `jn1` | `setPlanSlug` | chunks.97.mjs:1604 | function |
| `PR4` | `clearAllPlanSlugs` | chunks.97.mjs:1608 | function |
| `WR4` | `getSlugFromLog` | chunks.97.mjs:1630 | function |
| `Fb8` | `copyPlanForResume` | chunks.97.mjs:1634-1665 | function |
| `DR4` | `copyPlanForFork` | chunks.97.mjs:1667-1680 | function |
| `rJz` | `recoverPlanFromMessages` | chunks.97.mjs:1682-1711 | function |
| `oJz` | `findFileSnapshotEntry` | chunks.97.mjs:1713-1719 | function |
| `mb8` | `getEnvironmentKind` | utility (filePersistence) | function |
| `t1` | `isENOENT` | utility | function |
| `aO` | `getPlansDirectory` (memoized) | chunks.97.mjs:1767-1782 | function |
| `iJz` | `MAX_SLUG_RETRIES` (= 10) | chunks.97.mjs:1751 | constant |

## Module: Plan Mode — Swarm / Mailbox

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `F_` | `writeToMailbox` | utility | function |
| `I6` | `jsonStringify` (mailbox-safe) | utility | function |
| `T_` | `getAgentName` | utility | function |
| `Z9` | `getTeamName` | utility | function |
| `op` | `formatAgentId` | utility | function |
| `ph6` | `generateRequestId` | utility (agentId.js) | function |
| `Jd8` | `findInProcessTeammateTaskId` | utility (inProcessTeammateHelpers) | function |
| `J37` | `setAwaitingPlanApproval` | utility (inProcessTeammateHelpers) | function |
| `_J6` | `parsePlanApprovalRequest` | chunks.139.mjs (~1860) | function |
| `ch6` | `parsePlanApprovalResponse` | chunks.139.mjs (~1860) | function |
| `tqY` | `PlanApprovalRequestMessage` (UI component) | chunks.139.mjs | function |
| `eqY` | `PlanApprovalResponseMessage` (UI component) | chunks.139.mjs | function |
| `ig8` | `renderTeamMessage` | chunks.139.mjs:1862 | function |
| `q4Y` | `getTeamMessageSummary` | chunks.139.mjs:1875 | function |

## Module: Ultraplan — Polling & Scanner

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `PlK` | `ExitPlanModeScanner` (class) | chunks.183.mjs:898-966 | class |
| `WlK` | `pollForApprovedExitPlanMode` | chunks.183.mjs:968-1015 | function |
| `iQY` | `extractTeleportPlan` | chunks.183.mjs:1021-1028 | function |
| `rQY` | `extractApprovedPlan` | chunks.183.mjs:1030-1040 | function |
| `DlK` | `contentToText` | chunks.183.mjs:1017-1019 | function |
| `_66` | `UltraplanPollError` (class) | chunks.183.mjs:1054-1063 | class |
| `nQY` | `ULTRAPLAN_TELEPORT_SENTINEL` (`"__ULTRAPLAN_TELEPORT_LOCAL__"`) | chunks.183.mjs:1048 | constant |
| `MlK` | `POLL_INTERVAL_MS` (= 3000) | chunks.183.mjs:1042 | constant |
| `lQY` | `MAX_CONSECUTIVE_FAILURES` (= 5) | chunks.183.mjs:1044 | constant |
| `YK8` | `pollRemoteSessionEvents` | utility (teleport.js) | function |
| `Ju8` | `isTransientNetworkError` | utility (teleport/api.js) | function |
| `l7` | `sleep` | utility | function |

## Module: Ultraplan — CCR Session Launch / Slash Command

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `hn` | `isUltraplanAvailable` (= `tengu_ultraplan_config.enabled && isRemoteControlAvailable`) | chunks.183.mjs:1066-1068 | function |
| `mx` | `isRemoteControlAvailable` (CCR bridge predicate) | chunks.115.mjs:2513-2515 | function |
| `hlK` | `ultraplanCommandDef` (slash-command definition) | chunks.183.mjs:1642-1653 | object |
| `jdY` | `ultraplanCommandHandler` | chunks.183.mjs:1562-1599 | function |
| `CF` | `teleportToRemote` (CCR launch entry) | utility | function |
| `YdY` | `pollUltraplanSession` (background polling task) | chunks.183.mjs:1267-1353 | function |
| `D96` | `registerRemoteAgentTask` | utility | function |
| `LY` | `enqueuePendingNotification` | utility | function |
| `ak` | `archiveRemoteSession` | utility | function |
| `c_8` | `getUltraplanUnavailableMessage` | utility | function |
| `wu6` | `getUltraplanTermsSource` (cache hydration) | utility | function |
| `KdY` | `ultraplanFlavorDescriptors` (object map) | chunks.183.mjs:1632-1641 | object |
| `f$7` | `ultraplanFlavorCommands` (`{ simple_plan, visual_plan, three_subagents_with_critique }`) | chunks.183.mjs:1622-1626 | object |
| `oOj` | `ULTRAPLAN_FLAVORS` (= `Object.keys(f$7)`) | chunks.183.mjs:1626 | constant |
| `ElK` | `DEFAULT_ULTRAPLAN_FLAVOR` (= `"simple_plan"`) | chunks.183.mjs:1554 | constant |
| `t_6` | `ULTRAPLAN_DOCS_URL` | chunks.183.mjs:1550 | constant |
| `tQY` | `getUltraplanTimeoutMs` | utility | function |
| `nz` | `addNotification` (UI bridge) | utility | function |
| `TlK` | `shouldSuggestUltraplan` | chunks.183.mjs | function |

## Module: Ultraplan — Keyword Triggers (input-bar detection)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `GlK` | `findKeywordTriggerPositions` | chunks.183.mjs:1075-1102 | function |
| `flK` | `OPEN_TO_CLOSE` (delimiter map for paired-skip) | chunks.183.mjs (constant near GlK) | constant |
| (export wrapper) | `findUltraplanTriggerPositions` | chunks.183.mjs (after GlK) | function |
| (export wrapper) | `findUltrareviewTriggerPositions` | chunks.183.mjs | function |
| (export wrapper) | `hasUltraplanKeyword` | chunks.183.mjs | function |
| (export wrapper) | `replaceUltraplanKeyword` | chunks.183.mjs | function |

## Module: Plan Mode — Misc Routing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `lp` | `TEAM_CREATE_TOOL_NAME` | chunks.96.mjs (near tool constants) | constant |
| `T4` | `AGENT_TOOL_NAME` | utility | constant |
| `e3` | `toolMatchesName` | utility | function |
| `z4` | `isAgentSwarmsEnabled` | utility | function |
| `sv` | `recordSystemMessage` (notification mirroring) | utility | function |
| `d` | `logEvent` (analytics) | utility | function |
| `N5` | `isOrgFeatureEnabled` (auth/permission flag lookup) | utility | function |

---

## Notes on Discrepancies

1. **`Fk` vs `dP`** — Both resolve to the string `"ExitPlanMode"`. `Fk` (chunks.96.mjs:2549) appears to be a legacy alias; the canonical reference used inside `ExitPlanModeV2Tool.call()`, `ExitPlanModeScanner.ingest()`, and `recoverPlanFromMessages()` is `dP`.
2. **`autoModeStateModule` (`vGK`) / `permissionSetupModule` (`qI6`)** — In v2.1.88 these are `feature('TRANSCRIPT_CLASSIFIER')`-gated lazy `require()` calls. In v2.1.112 the gate flag has been folded into the module body (`vGK = (Kn(), B7(Pe))`), so the lookup is unconditional but the underlying gate still applies inside the callees.
3. **`getPlanFilePath` (`eW`)** — In v2.1.91, this was changed to resolve the slug-and-directory on every call (rather than caching). The v2.1.112 implementation matches the v2.1.88 source 1:1: `lP` and `eW` both call `g56(I8())` (= `getPlanSlug(getSessionId())`) inline.
4. **`hn` (`isUltraplanAvailable`)** — v2.1.101 introduced the `mx()` (`isRemoteControlAvailable`) clause so that orgs that cannot reach Claude Code on the web do not see the "Refine with Ultraplan" option. This is the v2.1.112 form: `tengu_ultraplan_config.enabled === true && isRemoteControlAvailable()`.
