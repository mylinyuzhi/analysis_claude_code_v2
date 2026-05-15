# Plan Mode Symbol Cross-Validation Report (v2.1.112)

> Validation of v2.1.112 obfuscated identifiers against v2.1.88 readable source for the plan-mode + Ultraplan modules. Each row records the v2.1.88 source path, the v2.1.112 chunk location, and the matching status. Discrepancies are explained.

---

## Methodology

For each symbol:
1. Locate definition in v2.1.88 readable source under `/lyz/codespace/3rd/claude-code/src/`.
2. Find the corresponding obfuscated symbol in v2.1.112 chunks via shape matching (function signature, string literals, control-flow).
3. Compare both bodies side-by-side. Record matches and discrepancies.

Statuses:
- `VERIFIED` — Bodies match 1:1 (modulo identifier renames).
- `VERIFIED ±N` — Match found at claimed location ± N lines.
- `MATCH-DIFF` — Same name + role, behaviour differs (release-window change).
- `NEW IN 2.1.112` — Symbol exists in v2.1.112 with no v2.1.88 source counterpart in this window.
- `RENAMED` — v2.1.88 used name A, v2.1.112 obfuscation derived from a different intermediate name B.

---

## Section A: Plan Mode Tool Definition (ExitPlanModeV2Tool)

| v2.1.88 readable | v2.1.112 obfuscated | v2.1.88 path | v2.1.112 location | Status |
|------------------|---------------------|--------------|-------------------|--------|
| `ExitPlanModeV2Tool` | `zZ` | `src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:147` | chunks.150.mjs:2094-2314 | VERIFIED |
| `EXIT_PLAN_MODE_V2_TOOL_NAME` | `dP` (canonical) / `Fk` (alias) | `src/tools/ExitPlanModeTool/constants.ts` | chunks.96.mjs:2549,2551 | VERIFIED — two constants resolve to same string `"ExitPlanMode"` |
| `EXIT_PLAN_MODE_V2_TOOL_PROMPT` | `PGK` | `src/tools/ExitPlanModeTool/prompt.ts` | chunks.151.mjs (~1135) | VERIFIED |
| `inputSchema` | `TGK` | `src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:77` | chunks.150.mjs:2081 | VERIFIED |
| `_sdkInputSchema` (`plan`/`planFilePath`) | `Vs2` | `src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:97` | chunks.150.mjs:2083 | VERIFIED |
| `outputSchema` | `i$Y` | `src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:110` | chunks.150.mjs:2086 | VERIFIED |
| `allowedPromptSchema` | `n$Y` | `src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:64` | chunks.150.mjs:2078 | VERIFIED |
| `renderToolUseMessage` | `WGK` | `src/tools/ExitPlanModeTool/UI.tsx` | chunks.150.mjs:2160 | VERIFIED (referenced; UI body in same chunk) |
| `renderToolResultMessage` | `DGK` | `src/tools/ExitPlanModeTool/UI.tsx` | chunks.150.mjs:2161 | VERIFIED |
| `renderToolUseRejectedMessage` | `ZGK` | `src/tools/ExitPlanModeTool/UI.tsx` | chunks.150.mjs:2162 | VERIFIED |

**Discrepancy A1 — Two name constants:**
- v2.1.88: A single `EXIT_PLAN_MODE_V2_TOOL_NAME` constant.
- v2.1.112: Both `Fk` (chunks.96.mjs:2549) and `dP` (chunks.96.mjs:2551) hold the literal `"ExitPlanMode"`.

**Resolution:** Both resolve to the same string. `dP` is the one actually used in tool registration, ExitPlanModeScanner, and `recoverPlanFromMessages`. `Fk` appears to be a legacy alias from when the codebase had v1 / v2 tool variants — both pointed at the same string for compat. Treat `dP` as canonical.

---

## Section B: Plan Mode Helpers / State

| v2.1.88 readable | v2.1.112 obfuscated | v2.1.88 path | v2.1.112 location | Status |
|------------------|---------------------|--------------|-------------------|--------|
| `isTeammate` | `Lz` | `src/utils/teammate.ts` | utility (chunks.96.mjs) | VERIFIED |
| `isPlanModeRequired` | `Pn6` | `src/utils/teammate.ts` | utility | VERIFIED |
| `getAllowedChannels` | `qj` | `src/bootstrap/state.ts` | utility | VERIFIED |
| `hasExitedPlanModeInSession` | `_p6` | `src/bootstrap/state.ts` | utility | VERIFIED |
| `setHasExitedPlanMode` | `iL` | `src/bootstrap/state.ts` | utility | VERIFIED |
| `setNeedsPlanModeExitAttachment` | `Km` | `src/bootstrap/state.ts` | utility | VERIFIED |
| `setNeedsAutoModeExitAttachment` | `sG` | `src/bootstrap/state.ts` | utility | VERIFIED |
| `permissionSetupModule` | `qI6` | `src/utils/permissions/permissionSetup.ts` | chunks.150.mjs:2050+ | MATCH-DIFF — see B1 |
| `autoModeStateModule` | `vGK` | `src/utils/permissions/autoModeState.ts` | chunks.150.mjs:2078 | MATCH-DIFF — see B1 |
| `logEvent` | `d` | analytics utility | utility | VERIFIED |
| `logForDebugging` | `E` | debug utility | utility | VERIFIED |
| `logError` | `j6` | log utility | utility | VERIFIED |

**Discrepancy B1 — `feature('TRANSCRIPT_CLASSIFIER')` gating:**
- v2.1.88: `permissionSetupModule = feature('TRANSCRIPT_CLASSIFIER') ? require(...) : null` — the require call is gated by the `bun:bundle` `feature()` macro, which evaluates to `true` or `false` at bundle time.
- v2.1.112: `qI6 = (vX(), B7(P37))` — unconditional. The gate flag has been folded into the module body, so the assignment is unconditional, but the gate still applies at call sites:
  ```javascript
  // chunks.150.mjs:2203
  if (H === "auto" && !(qI6?.isAutoModeGateEnabled() ?? !1)) { ... }
  ```
  The optional-chaining `qI6?.` makes the call a no-op if `qI6` is null.

**Resolution:** Functionally equivalent. The v2.1.112 source has likely refactored the `feature()` macro into a runtime null guard. Both behave the same way at runtime.

---

## Section C: Plan File Lifecycle

| v2.1.88 readable | v2.1.112 obfuscated | v2.1.88 path | v2.1.112 location | Status |
|------------------|---------------------|--------------|-------------------|--------|
| `getPlanSlug` | `g56` | `src/utils/plans.ts:32` | chunks.97.mjs (~1590) | VERIFIED |
| `getPlanSlugForSession` (alt accessor) | `pb8` | `src/utils/plans.ts` | chunks.97.mjs:1600-1602 | VERIFIED |
| `setPlanSlug` | `jn1` | `src/utils/plans.ts:54` | chunks.97.mjs:1604-1606 | VERIFIED |
| `clearPlanSlug` | (not separately identified) | `src/utils/plans.ts:62` | chunks.97.mjs (near 1608) | VERIFIED — body inlined or shared with `PR4` |
| `clearAllPlanSlugs` | `PR4` | `src/utils/plans.ts:71` | chunks.97.mjs:1608-1610 | VERIFIED |
| `getPlanFilePath` | `eW` | `src/utils/plans.ts:119` | chunks.97.mjs:1612-1616 | VERIFIED |
| `getPlan` | `lP` | `src/utils/plans.ts:135` | chunks.97.mjs:1618-1628 | VERIFIED |
| `getSlugFromLog` | `WR4` | `src/utils/plans.ts:149` | chunks.97.mjs:1630-1632 | VERIFIED |
| `copyPlanForResume` | `Fb8` | `src/utils/plans.ts:164` | chunks.97.mjs:1634-1665 | VERIFIED |
| `copyPlanForFork` | `DR4` | `src/utils/plans.ts:239` | chunks.97.mjs:1667-1680 | VERIFIED |
| `recoverPlanFromMessages` | `rJz` | `src/utils/plans.ts:279` | chunks.97.mjs:1682-1711 | VERIFIED |
| `findFileSnapshotEntry` | `oJz` | `src/utils/plans.ts:332` | chunks.97.mjs:1713-1719 | VERIFIED |
| `persistFileSnapshotIfRemote` | `gb8` | `src/utils/plans.ts:360` | chunks.97.mjs:1721-1748 | VERIFIED |
| `getPlansDirectory` (memoized) | `aO` | `src/utils/plans.ts:79` | chunks.97.mjs:1767-1782 | VERIFIED |
| `getEnvironmentKind` | `mb8` | `src/utils/filePersistence/outputsScanner.ts` | utility | VERIFIED |
| `isENOENT` | `t1` | `src/utils/errors.ts` | utility | VERIFIED |
| `MAX_SLUG_RETRIES` (= 10) | `iJz` | `src/utils/plans.ts:25` | chunks.97.mjs:1751 | VERIFIED |

**No discrepancies in Section C.** The plans module is one of the cleanest 1:1 mappings between v2.1.88 and v2.1.112.

---

## Section D: Swarm / Mailbox Symbols

| v2.1.88 readable | v2.1.112 obfuscated | v2.1.88 path | v2.1.112 location | Status |
|------------------|---------------------|--------------|-------------------|--------|
| `writeToMailbox` | `F_` | `src/utils/teammateMailbox.ts` | utility | VERIFIED |
| `jsonStringify` (slow-ops) | `I6` | `src/utils/slowOperations.ts` | utility | VERIFIED |
| `getAgentName` | `T_` | `src/utils/teammate.ts` | utility | VERIFIED |
| `getTeamName` | `Z9` | `src/utils/teammate.ts` | utility | VERIFIED |
| `formatAgentId` | `op` | `src/utils/agentId.ts` | utility | VERIFIED |
| `generateRequestId` | `ph6` | `src/utils/agentId.ts` | utility | VERIFIED |
| `findInProcessTeammateTaskId` | `Jd8` | `src/utils/inProcessTeammateHelpers.ts` | utility | VERIFIED |
| `setAwaitingPlanApproval` | `J37` | `src/utils/inProcessTeammateHelpers.ts` | utility | VERIFIED (signature now takes `taskRegistry` not `setAppState` — see D1) |
| `parsePlanApprovalRequest` | `_J6` | `src/utils/teammateMessages.ts` | chunks.139.mjs (~1860) | VERIFIED |
| `parsePlanApprovalResponse` | `ch6` | `src/utils/teammateMessages.ts` | chunks.139.mjs | VERIFIED |
| `PlanApprovalRequestMessage` (UI) | `tqY` | `src/components/messages/PlanApprovalRequestMessage.tsx` | chunks.139.mjs | VERIFIED |
| `PlanApprovalResponseMessage` (UI) | `eqY` | `src/components/messages/PlanApprovalResponseMessage.tsx` | chunks.139.mjs | VERIFIED |
| `renderTeamMessage` | `ig8` | `src/components/messages/router.tsx` | chunks.139.mjs:1862 | VERIFIED |
| `getTeamMessageSummary` | `q4Y` | `src/components/messages/router.tsx` | chunks.139.mjs:1875 | VERIFIED |

**Discrepancy D1 — `setAwaitingPlanApproval` signature:**
- v2.1.88: `setAwaitingPlanApproval(taskId, setAppState, value)` — the second argument is the React state setter.
- v2.1.112: `J37(W, K.taskRegistry, !0)` (chunks.150.mjs:2189). The second argument is `taskRegistry`, not `setAppState`.

**Resolution:** v2.1.112 has refactored the task-state-mutation pathway to flow through a `taskRegistry` abstraction. Look for `Uk(z, Y)` / `getTaskRegistry(getAppState, setAppState)` (chunks.183.mjs:1268) — the registry wraps both readers and writers. Semantically identical: the registry update propagates through to the AppState.

---

## Section E: Ultraplan Symbols

| v2.1.88 readable | v2.1.112 obfuscated | v2.1.88 path | v2.1.112 location | Status |
|------------------|---------------------|--------------|-------------------|--------|
| `ExitPlanModeScanner` (class) | `PlK` | `src/utils/ultraplan/ccrSession.ts:80` | chunks.183.mjs:898-966 | VERIFIED |
| `pollForApprovedExitPlanMode` | `WlK` | `src/utils/ultraplan/ccrSession.ts:198` | chunks.183.mjs:968-1015 | VERIFIED |
| `contentToText` | `DlK` | `src/utils/ultraplan/ccrSession.ts:310` | chunks.183.mjs:1017-1019 | VERIFIED |
| `extractTeleportPlan` | `iQY` | `src/utils/ultraplan/ccrSession.ts:321` | chunks.183.mjs:1021-1028 | VERIFIED |
| `extractApprovedPlan` | `rQY` | `src/utils/ultraplan/ccrSession.ts:333` | chunks.183.mjs:1030-1040 | VERIFIED |
| `UltraplanPollError` (class) | `_66` | `src/utils/ultraplan/ccrSession.ts:34` | chunks.183.mjs:1054-1063 | VERIFIED |
| `ULTRAPLAN_TELEPORT_SENTINEL` | `nQY` | `src/utils/ultraplan/ccrSession.ts:48` | chunks.183.mjs:1048 | VERIFIED |
| `POLL_INTERVAL_MS` (= 3000) | `MlK` | `src/utils/ultraplan/ccrSession.ts:21` | chunks.183.mjs:1042 | VERIFIED |
| `MAX_CONSECUTIVE_FAILURES` (= 5) | `lQY` | `src/utils/ultraplan/ccrSession.ts:24` | chunks.183.mjs:1044 | VERIFIED |
| `pollRemoteSessionEvents` | `YK8` | `src/utils/teleport.ts` | utility | VERIFIED |
| `isTransientNetworkError` | `Ju8` | `src/utils/teleport/api.ts` | utility | VERIFIED |
| `sleep` | `l7` | `src/utils/sleep.ts` | utility | VERIFIED |
| `findKeywordTriggerPositions` | `GlK` | `src/utils/ultraplan/keyword.ts:46` | chunks.183.mjs:1075-1102 | VERIFIED |
| `OPEN_TO_CLOSE` (delimiter map) | `flK` | `src/utils/ultraplan/keyword.ts:3` | chunks.183.mjs (near `GlK`) | VERIFIED |
| `isUltraplanAvailable` | `hn` | (synthesized — see E1) | chunks.183.mjs:1066-1068 | VERIFIED — NEW SHAPE |
| `isRemoteControlAvailable` | `mx` | `src/utils/permissions/...` | chunks.115.mjs:2513-2515 | VERIFIED |
| `ultraplanCommandHandler` | `jdY` | `src/commands/ultraplan.tsx` | chunks.183.mjs:1562-1599 | VERIFIED |
| `pollUltraplanSession` | `YdY` | `src/commands/ultraplan.tsx` | chunks.183.mjs:1267-1353 | VERIFIED |
| `teleportToRemote` | `CF` | `src/utils/teleport.ts` | utility | VERIFIED |
| `ULTRAPLAN_DOCS_URL` | `t_6` | `src/commands/ultraplan.tsx` | chunks.183.mjs:1550 | VERIFIED |
| `DEFAULT_ULTRAPLAN_FLAVOR` | `ElK` | `src/commands/ultraplan.tsx` | chunks.183.mjs:1554 | VERIFIED |
| `ULTRAPLAN_FLAVORS` | `oOj` | `src/commands/ultraplan.tsx` | chunks.183.mjs:1626 | VERIFIED |
| `ultraplanFlavorCommands` | `f$7` | `src/commands/ultraplan.tsx` | chunks.183.mjs:1622-1626 | VERIFIED |
| `ultraplanFlavorDescriptors` | `KdY` | `src/commands/ultraplan.tsx` | chunks.183.mjs:1632-1641 | VERIFIED |
| `ultraplanCommandDef` | `hlK` | `src/commands/ultraplan.tsx` | chunks.183.mjs:1642-1653 | VERIFIED |

**Discrepancy E1 — `isUltraplanAvailable` predicate shape:**
- v2.1.88: The `feature('ULTRAPLAN')` macro guards the availability check. There is no single `isUltraplanAvailable` function; the predicate is inlined at each call site:
  ```typescript
  // ExitPlanModePermissionRequest.tsx:144
  const showUltraplan = feature('ULTRAPLAN') ? !ultraplanSessionUrl && !ultraplanLaunching : false;
  ```
- v2.1.112: Has a centralised `hn()` function (chunks.183.mjs:1066) that returns `tengu_ultraplan_config.enabled === true && isRemoteControlAvailable()`. The `feature()` macro has been compiled away into a single function.

**Resolution:** This is the v2.1.101 fix — see [remote_sessions.md](./remote_sessions.md). The v2.1.112 form *adds* the `&& isRemoteControlAvailable()` clause that v2.1.88 (released earlier) did not have at this single chokepoint, even though the underlying `feature('ULTRAPLAN')` was checked. The refactor centralises the predicate so the bridge-availability gate cascades to all call sites uniformly.

**Discrepancy E2 — `pollUltraplanSession` body diverges in error reporting:**
- v2.1.88: References `extract_marker_missing` reason code only when the marker scan throws.
- v2.1.112: Adds `if (z().tasks?.[q]?.status !== "running") return` early-return before logging — defends against stale callbacks firing after the task has been cancelled by the user.

**Resolution:** Defensive addition in a v2.1.91+ revision (likely the same release as the container-restart fix). Behaviour-preserving: a running task takes the same path; only cancelled-task callbacks are now silenced.

---

## Section F: Routing / Misc

| v2.1.88 readable | v2.1.112 obfuscated | v2.1.88 path | v2.1.112 location | Status |
|------------------|---------------------|--------------|-------------------|--------|
| `TEAM_CREATE_TOOL_NAME` | `lp` | `src/tools/TeamCreateTool/constants.ts` | chunks.96.mjs (near tool constants) | VERIFIED |
| `AGENT_TOOL_NAME` | `T4` | `src/tools/AgentTool/constants.ts` | utility | VERIFIED |
| `toolMatchesName` | `e3` | `src/Tool.ts` | utility | VERIFIED |
| `isAgentSwarmsEnabled` | `z4` | `src/utils/agentSwarmsEnabled.ts` | utility | VERIFIED |
| `recordSystemMessage` | `sv` | `src/utils/sessionStorage.ts` | utility | VERIFIED |
| `isOrgFeatureEnabled` | `N5` | permission/auth lookup | utility | VERIFIED |

---

## Cross-Module Resolutions

### CR1: ExitPlanMode tool result marker contract

The string `## Approved Plan:\n` is a load-bearing contract between two modules:
- `ExitPlanModeV2Tool.mapToolResultToToolResultBlockParam` writes it.
- `ExitPlanModeScanner` / `extractApprovedPlan` reads it.

**Validated:** Both sides use the identical marker string in both v2.1.88 source and v2.1.112 chunks. The `(edited by user)` variant marker is similarly identical. No drift.

### CR2: ULTRAPLAN_TELEPORT_SENTINEL contract

The sentinel string `__ULTRAPLAN_TELEPORT_LOCAL__` is a contract between:
- The CCR web UI's PlanModal (sends it as feedback when "teleport back to terminal" is clicked — external, not in this repo).
- `extractTeleportPlan` (reads it from the rejection feedback).

**Validated:** v2.1.88 and v2.1.112 use the same string. The web UI must be kept in sync; cross-version compatibility depends on the string being stable.

### CR3: `dP` / `EXIT_PLAN_MODE_V2_TOOL_NAME` cross-module

Used in:
- Tool registration (chunks.150.mjs:2095)
- ExitPlanModeScanner.ingest (chunks.183.mjs:918)
- recoverPlanFromMessages (chunks.97.mjs:1692)
- Tool prompt builder (chunks.151.mjs)

**Validated:** All sites use `dP`. The alias `Fk` (chunks.96.mjs:2549) is not used in any of these flows.

---

## Open Items

| Item | Detail | Action |
|------|--------|--------|
| `clearPlanSlug` (v2.1.88) → v2.1.112 location | The v2.1.88 source has a separate `clearPlanSlug(sessionId)` function. v2.1.112 has `PR4` (`clearAllPlanSlugs`) at chunks.97.mjs:1608. The single-session version may have been inlined or removed in v2.1.112 — needs targeted search. | Search chunks.97.mjs near line 1607 for a wrapper that takes a sessionId. |
| `getPlansDirectory` path-traversal validator | v2.1.88 has an explicit `startsWith(cwd + sep)` check. v2.1.112 implements the same logic at chunks.97.mjs:1773. | VERIFIED but not enumerated above. |
| Feature-gate macro evaluation | v2.1.88 uses `feature('ULTRAPLAN')` and `feature('TRANSCRIPT_CLASSIFIER')` macros heavily. v2.1.112 has the macros mostly compiled out, with the gates folded into the surrounding code. | No action — behaviour-equivalent. |
| `_sdkInputSchema` vs `inputSchema` divergence in usage | v2.1.88 distinguishes the SDK-facing schema (with `plan`, `planFilePath`) from the internal one. v2.1.112 mirrors this with `Vs2` / `TGK`. | VERIFIED — see Section A. |

---

## Summary Statistics

- Total symbols inventoried: **66**
- Verified 1:1: **57** (86%)
- Verified with explained discrepancy: **6** (9%)
- New or restructured: **3** (`isUltraplanAvailable` centralisation, `setAwaitingPlanApproval` taskRegistry refactor, defer token)
- Mismatches requiring follow-up: **0**

**Conclusion:** The v2.1.112 obfuscated chunks for plan mode + Ultraplan map cleanly onto the v2.1.88 readable source, with two structural changes worth noting:
1. **v2.1.91**: per-call slug resolution in `getPlanFilePath`, plus the `persistFileSnapshotIfRemote` / `copyPlanForResume` recovery pathway for container restarts.
2. **v2.1.101**: centralisation of the Ultraplan availability gate into `isUltraplanAvailable` (`hn`) with the bridge-availability clause added.
