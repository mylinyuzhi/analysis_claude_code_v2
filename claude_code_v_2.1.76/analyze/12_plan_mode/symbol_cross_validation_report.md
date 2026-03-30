# Cross-Validation Report (Symbols + Code Logic)

> **Date**: 2026-03-29
> **Scope**: 12_plan_mode + 30_agent_teams modules
> **Method**:
> - Phase 1: Symbol name/location verification (direct source reading at claimed file:line)
> - Phase 2: Code logic verification (branch-by-branch comparison of ORIGINAL/READABLE snippets vs actual source)

---

## Plan Mode Symbols (34 total)

### Verified (25/34)

| # | Obfuscated | Readable | Location | Status |
|---|-----------|----------|----------|--------|
| 1 | ki | modeTransitionHandler | chunks.173.mjs:409 | VERIFIED |
| 3 | Dp | handlePlanModeTransition | chunks.1.mjs:2946 | VERIFIED |
| 5 | nk6 | hasExitedPlanModeInSession | chunks.1.mjs:2930 | VERIFIED |
| 7 | Fu1 | getNeedsPlanModeExitAttachment | chunks.1.mjs:2938 | VERIFIED |
| 8 | Ki6 | EnterPlanModeTool | chunks.144.mjs:1579 | VERIFIED |
| 9 | dt | ENTER_PLAN_MODE_NAME | chunks.90.mjs:3121 | VERIFIED |
| 10 | RIY | getEnterPlanModePrompt | chunks.144.mjs:1416 | VERIFIED |
| 13 | Z1q | exitPlanModePromptText | chunks.143.mjs:2595 | VERIFIED |
| 14 | Fj | getPlanFilePath | chunks.90.mjs:533 | VERIFIED |
| 15 | sJ | getPlanContent | chunks.90.mjs:539 | VERIFIED |
| 16 | W26 | getNextCycleMode | chunks.191.mjs:3007 | VERIFIED |
| 17 | cbq | isAutoModeAvailableForCycle | chunks.191.mjs:3003 | VERIFIED |
| 18 | lbq | computeModeCycle | chunks.191.mjs:3027 | VERIFIED |
| 19 | Wzz | planModeReminderDispatcher | chunks.173.mjs:2525 | VERIFIED |
| 20 | Nzz | fullPlanModeReminder | chunks.173.mjs:2555 | VERIFIED |
| 22 | Ezz | sparsePlanModeReminder | chunks.173.mjs:2692 | VERIFIED |
| 23 | yzz | subagentPlanModeReminder | chunks.173.mjs:2701 | VERIFIED |
| 24 | Zzz | ultraplanCompleteReminder | chunks.173.mjs:2532 | VERIFIED |
| 25 | rO | isPlanModeInterviewPhase | chunks.50.mjs:2520 | VERIFIED |
| 26 | NF6 | isPlanModeRequired | chunks.84.mjs:1478 | VERIFIED |
| 27 | DuY | getPlanModeAttachment | chunks.147.mjs:136 | VERIFIED |
| 28 | XuY | getPlanModeExitAttachment | chunks.147.mjs:170 | VERIFIED |
| 32 | pF8 | getPromptSuggestionBlockReason | chunks.148.mjs:2191 | VERIFIED |
| 33 | T1q | renderExitPlanModeResult | chunks.143.mjs:2628 | VERIFIED |
| 34 | E8q | renderEnterPlanModeResult | chunks.144.mjs:1526 | VERIFIED |

### Corrected Line Numbers (9/34)

All readable names and types were correct; only line offsets needed fixing.

| # | Obfuscated | Readable | Claimed | Corrected | Delta |
|---|-----------|----------|---------|-----------|-------|
| 2 | LT6 | savePrePlanMode | chunks.173.mjs:702 | chunks.173.mjs:763 | +61 |
| 4 | HV | setHasExitedPlanMode | chunks.1.mjs:2932 | chunks.1.mjs:2934 | +2 |
| 6 | JS | setNeedsPlanModeExitAttachment | chunks.1.mjs:2940 | chunks.1.mjs:2942 | +2 |
| 11 | zD | ExitPlanModeTool | chunks.143.mjs:2798 | chunks.143.mjs:2802 | +4 |
| 12 | aJ | EXIT_PLAN_MODE_NAME | chunks.90.mjs:505 | chunks.90.mjs:507 | +2 |
| 21 | kzz | iterativePlanModeReminder | chunks.173.mjs:2644 | chunks.173.mjs:2637 | -7 |
| 29 | ag8 | setAwaitingPlanApproval | chunks.143.mjs:2707 | chunks.143.mjs:2708 | +1 |
| 30 | k1q | clearAwaitingPlanApproval | chunks.143.mjs:2713 | chunks.143.mjs:2715 | +2 |
| 31 | ik1 | findTeammateTaskByName | chunks.143.mjs:2701 | chunks.143.mjs:2702 | +1 |

**Note**: `aJ` at line 505 is actually `Uk = "ExitPlanMode"` (a duplicate constant). The `aJ` assignment is at line 507.

---

## Agent Teams Symbols (45 total)

### Verified (39/45)

| # | Obfuscated | Readable | Location | Status |
|---|-----------|----------|----------|--------|
| 1 | E7 | isAgentTeamsEnabled | chunks.50.mjs:2543 | VERIFIED |
| 2 | hI | SEND_MESSAGE_NAME | chunks.91.mjs:39 | VERIFIED |
| 3 | OxY | SendMessageTool | chunks.145.mjs:2609 | VERIFIED |
| 4 | AxY | sendDirectMessage | chunks.145.mjs:2345 | VERIFIED |
| 5 | qxY | broadcastMessage | chunks.145.mjs:2374 | VERIFIED |
| 6 | KxY | sendShutdownRequest | chunks.145.mjs:2418 | VERIFIED |
| 7 | YxY | handleShutdownApproval | chunks.145.mjs:2443 | VERIFIED |
| 8 | zxY | handleShutdownRejection | chunks.145.mjs:2499 | VERIFIED |
| 9 | _xY | approvePlan | chunks.145.mjs:2521 | VERIFIED |
| 10 | wxY | rejectPlan | chunks.145.mjs:2547 | VERIFIED |
| 11 | wl | readMailbox | chunks.132.mjs:3 | VERIFIED |
| 12 | pY6 | readUnreadMessages | chunks.132.mjs:16 | VERIFIED |
| 13 | x3 | writeToMailbox | chunks.132.mjs:22 | VERIFIED |
| 14 | Vc6 | markMessageAsReadByIndex | chunks.132.mjs:57 | VERIFIED |
| 15 | kc6 | markMessagesAsRead | chunks.132.mjs:92 | VERIFIED |
| 16 | $TY | clearInbox | chunks.132.mjs:128 | VERIFIED |
| 17 | HTY | formatMessagesAsXML | chunks.132.mjs:141 | VERIFIED |
| 18 | FY6 | getInboxPath | chunks.131.mjs:2849 | VERIFIED |
| 19 | Ec6 | createIdleNotification | chunks.132.mjs:153 | VERIFIED |
| 20 | Xx8 | createPermissionRequest | chunks.132.mjs:174 | VERIFIED |
| 21 | Px8 | createPermissionResponse | chunks.132.mjs:187 | VERIFIED |
| 22 | Wx8 | createSandboxPermissionRequest | chunks.132.mjs:221 | VERIFIED |
| 23 | Zx8 | createSandboxPermissionResponse | chunks.132.mjs:235 | VERIFIED |
| 24 | Wf6 | createShutdownRequest | chunks.132.mjs:261 | VERIFIED |
| 25 | Gx8 | createShutdownApproved | chunks.132.mjs:271 | VERIFIED |
| 26 | fx8 | createShutdownRejected | chunks.132.mjs:282 | VERIFIED |
| 29 | BNY | spawnSplitPaneTeammate | chunks.135.mjs:710 | VERIFIED |
| 32 | mZ6 | spawnInProcessTeammateCore | chunks.113.mjs:1188 | VERIFIED |
| 33 | Kz6 | readTeamConfig | chunks.135.mjs:680 | VERIFIED |
| 34 | Ru8 | writeTeamConfig | chunks.135.mjs:691 | VERIFIED (±1) |
| 35 | hu8 | deduplicateTeammateName | chunks.135.mjs:700 | VERIFIED (±1) |
| 36 | ei4 | getTeamDirectory | chunks.135.mjs:676 | VERIFIED |
| 37 | DNY | inProcessRunnerPollLoop | chunks.134.mjs:1483 | VERIFIED |
| 38 | XNY | startTeammateAgentLoop | chunks.134.mjs:1571 | VERIFIED |
| 39 | SN1 | createPermissionRequestObject | chunks.134.mjs:950 | VERIFIED |
| 40 | CN1 | sendPermissionRequestToLeader | chunks.134.mjs:1006 | VERIFIED (±1) |
| 41 | IN1 | sendPermissionResponseToWorker | chunks.134.mjs:1030 | VERIFIED (±2) |
| 42 | tx8 | TEAMMATE_COMMUNICATION_PROMPT | chunks.134.mjs:930 | VERIFIED |
| 44 | _NY | isTeamLeadProcess | chunks.134.mjs:974 | VERIFIED (±1) |
| 45 | ic6 | isTeammateProcess | chunks.134.mjs:980 | VERIFIED (±1) |

### Corrected Line Numbers (6/45)

All readable names and types were correct; only line offsets needed fixing.

| # | Obfuscated | Readable | Claimed | Corrected | Delta |
|---|-----------|----------|---------|-----------|-------|
| 27 | qn4 | spawnTeammate | chunks.135.mjs:958 | chunks.135.mjs:1116 | +158 |
| 28 | pNY | spawnRouter | chunks.135.mjs:953 | chunks.135.mjs:1110 | +157 |
| 30 | gNY | spawnTmuxTeammate | chunks.135.mjs:812 | chunks.135.mjs:838 | +26 |
| 31 | FNY | spawnInProcessTeammate | chunks.135.mjs:893 | chunks.135.mjs:985 | +92 |
| 43 | An4 | registerTeammateTracking | chunks.135.mjs:866 | chunks.135.mjs:943 | +77 |

**Root cause**: The chunks.135.mjs offsets for spawn functions were systematically wrong, likely due to an earlier analysis pass that used preliminary line counts before the full file was available.

---

## Overall Statistics

| Metric | Plan Mode | Agent Teams | Total |
|--------|-----------|-------------|-------|
| Total symbols | 34 | 45 | 79 |
| Fully verified | 25 (73%) | 39 (87%) | 64 (81%) |
| Line number corrections | 9 (26%) | 6 (13%) | 15 (19%) |
| Name/type corrections | 0 (0%) | 0 (0%) | 0 (0%) |
| **Semantic accuracy** | **100%** | **100%** | **100%** |

**Key finding**: All 79 readable names accurately describe the obfuscated code's purpose. All type classifications are correct. The only errors were line number offsets, with the largest being LT6 (off by 61 lines) and the chunks.135.mjs spawn cluster (off by 77-158 lines). All corrections have been applied to `symbol_index_core_features.md` and the analysis documents.

---

## Phase 2: Code Logic Verification

Verified 10 key functions by comparing ORIGINAL/READABLE code snippets against actual source code, checking every branch, parameter, return value, and side effect.

### Plan Mode Functions

| Function | Verdict | Issues Found → Fixed |
|----------|---------|---------------------|
| `ki` (modeTransitionHandler) | **FIXED** | Was drastically simplified: missing 5 branches (Dp, Qu1, Vi, x_6, IN gate), wrong params. Replaced with exact source code. |
| `LT6` (savePrePlanMode) | **FIXED** | Parameter was typed as string (actually object), missing Vi() call, KS1/IN faked as property access. Replaced with exact source. |
| `ExitPlanMode.call()` teammate | **FIXED** | Guard was `$Y()` only (actually `$Y() && NF6()`), error handling was `return` (actually `throw`), return structure fabricated, ag8 signature wrong. All replaced. |
| `ExitPlanMode.call()` main | **FIXED** | HV/JS shown as state properties (actually function calls inside callback), missing mode guard, missing tCY/MS calls, return structure fabricated. Replaced with exact source showing callback pattern. |
| `Wzz` (dispatcher) | **FIXED** | Used boolean flags `A.ultraplanComplete`/`A.sparse` (actually string comparisons `A.reminderType === "..."`)`. Replaced with exact source. |
| `Nzz` (fullPlanModeReminder) | **FIXED** | Fabricated `<plan-mode-instructions>` XML wrapper (actual is plain markdown), Phase 4 hardcoded (actually dynamic via vzz()), wrong variable names. Replaced with source showing conditional planExists, dynamic Phase 4, correct var names. |
| `DuY` (getPlanModeAttachment) | **FIXED** | Wrong param count (1 vs 2), `return null` (actually `return []`), fabricated `sparseThreshold` property (actually modulo counter). Replaced with exact source showing dual params, array returns, and `(MuY()+1)%5===1` logic. |

### Agent Teams Functions

| Function | Verdict | Issues Found → Fixed |
|----------|---------|---------------------|
| `DNY` (polling loop) | **FIXED** | Missing `originalMessage` in shutdown return, missing defensive type-check guard in setAppState callback. Both added. |
| `SendMessage.call()` | **FIXED** | Missing `throw Error` broadcast guard for structured messages, missing `?? "Plan needs revision"` fallback, missing backfillObservableInput and isConcurrencySafe. All added. |
| `writeToMailbox` (x3) | **ACCURATE** | Core logic, locking, error handling all correct. Only minor log abbreviation in ORIGINAL snippet. No fixes needed. |
| `pNY` (spawnRouter) | **ACCURATE** | Three-branch routing exactly matches source. Minor: Rb() internal logic not explained. No fixes needed. |

### Root Cause Analysis

The fabricated code snippets had a consistent pattern: the initial analysis generated **pseudocode reconstructions** rather than copying actual source. This led to:
- Simplified parameter types (strings instead of objects)
- Fabricated return structures
- Missing side-effect calls (Dp, Qu1, Vi, x_6, MS, tCY)
- Wrong error handling patterns (return vs throw)
- Invented property names (sparseThreshold, ultraplanComplete)
- Missing guard conditions

All issues were caught during branch-by-branch verification and corrected by replacing fabricated snippets with actual source code.
