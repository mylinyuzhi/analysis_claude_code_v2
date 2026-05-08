# Cross-Validation: 30_agent_team Analysis vs `claude-code/src/` (v2.1.88 TypeScript)

## Methodology

This document **cross-validates** the v2.1.112 agent-teams analysis against the v2.1.88 upstream TypeScript source at `/Users/bytedance/codespace/myapp/claude-code/src/`.

The v2.1.88 source is the **last unobfuscated reference** that's directly comparable. Most of the agent-teams subsystem was introduced in v2.1.32–v2.1.34 and refined incrementally; v2.1.88's source predates v2.1.112's binary by several minor versions, so:

1. **Validations** — patterns/symbols that are identical or trivially-renamed.
2. **v2.1.112 changes** — divergences where the binary differs from v2.1.88's TS.
3. **My analysis errors** — places where my v2.1.112 analysis disagrees with both.

---

## Files Read for Cross-Validation

| File | Lines | Purpose |
|------|-------|---------|
| `utils/agentSwarmsEnabled.ts` | 44 | Feature gate |
| `utils/teammateMailbox.ts` | 1184 | Mailbox protocol, message envelopes, schemas |
| `utils/swarm/constants.ts` | 33 | Constants (TEAM_LEAD_NAME etc.) |
| `utils/swarm/inProcessRunner.ts` | 1553 | Long-lived runner (canonical pseudocode) |
| `utils/swarm/spawnInProcess.ts` | 217+ | In-process spawn helper |
| `utils/swarm/teamHelpers.ts` | 233+ | Team config read/write |
| `utils/swarm/backends/registry.ts` | 389+ | `isInProcessEnabled` predicate |
| `tools/shared/spawnMultiAgent.ts` | 1078+ | `handleSpawn` dispatcher |
| `tools/AgentTool/AgentTool.tsx` | 290+ | Spawn invocation site (`use_splitpane: true`) |
| `tools/TeamCreateTool/TeamCreateTool.ts` | 222 | Team creation, telemetry |
| `tools/TeamDeleteTool/{TeamDeleteTool.ts,constants.ts}` | 100+ | Team deletion |
| `constants/xml.ts` | 87 | `TEAMMATE_MESSAGE_TAG` |
| `utils/hooks.ts` | (1899+) | Hook event names |

---

## Section A: Validations — Analysis Matches v2.1.88

### A1. Feature gate (with one v2.1.112 difference)

**v2.1.88** (`utils/agentSwarmsEnabled.ts:24`):
```ts
export function isAgentSwarmsEnabled(): boolean {
  if (process.env.USER_TYPE === 'ant') return true            // (1) ant bypass
  if (!isEnvTruthy(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) &&
      !isAgentTeamsFlagSet()) return false
  if (!getFeatureValue_CACHED_MAY_BE_STALE('tengu_amber_flint', true)) return false
  return true
}
```

**v2.1.112** (`chunks.63.mjs:2617`):
```js
function z4() {
  if (!S6(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) && !cN_()) return !1;
  if (!u8("tengu_amber_flint", !0)) return !1;
  return !0;
}
```

> **🔥 NEW FINDING (v2.1.112 behavior change):** The `USER_TYPE === 'ant'` bypass that exists in v2.1.88 has been **removed** in v2.1.112. v2.1.112's `z4()` requires both env-var/CLI-flag AND `tengu_amber_flint` for *all* user types — Anthropic-internal users ("ant") now have to opt in like everyone else.
>
> This is consistent with v2.1.112's broader pattern of making feature gates strict (verified: only one mention of `USER_TYPE=ant` remains in v2.1.112 source, in a debug message at chunks.188.mjs:622).

✅ My doc correctly identified the dual-gate semantics. The doc should add a note about the removed ant bypass.

### A2. Mailbox protocol — exact match

| Function | v2.1.88 (TS) | v2.1.112 (obfuscated) | Status |
|----------|--------------|------------------------|--------|
| Path resolver | `getInboxPath` (`teammateMailbox.ts:56`) | `eH6` (chunks.99.mjs:1934) | ✅ Same logic, line-for-line |
| Ensure dir | `ensureInboxDir` (`teammateMailbox.ts:71`) | `dWz` (chunks.99.mjs:1943) | ✅ |
| Read all | `readMailbox` (`teammateMailbox.ts:84`) | `ts` (chunks.99.mjs:1952) | ✅ |
| Read unread | `readUnreadMessages` (`teammateMailbox.ts:115`) | `qJ6` (chunks.99.mjs:1965) | ✅ |
| Write | `writeToMailbox` (`teammateMailbox.ts:134`) | `F_` (chunks.100.mjs:3) | ✅ Same `wx` create + lock pattern |
| Mark single read | `markMessageAsReadByIndex` (`teammateMailbox.ts:201`) | `Y18` (chunks.100.mjs:38) | ✅ |
| Mark all read | `markMessagesAsRead` (`teammateMailbox.ts:279`) | `A18` (chunks.100.mjs:73) | ✅ |
| Clear | `clearMailbox` (`teammateMailbox.ts:349`) | `O18` (chunks.100.mjs:103) | ⚠️ See A2.1 |
| Format XML | `formatTeammateMessages` (`teammateMailbox.ts:373`) | `cWz` (chunks.100.mjs:122) | ✅ |
| Build idle | `createIdleNotification` (`teammateMailbox.ts:410`) | `w18` (chunks.100.mjs:134) | ✅ |
| Parse idle | `isIdleNotification` (`teammateMailbox.ts:435`) | `$18` (chunks.100.mjs:147) | ✅ |
| Build perm req | `createPermissionRequestMessage` (`teammateMailbox.ts:488`) | `Ti1` (chunks.100.mjs:155) | ✅ |
| Build perm resp | `createPermissionResponseMessage` (`teammateMailbox.ts:512`) | `Vi1` (chunks.100.mjs:168) | ✅ |
| Parse perm req | `isPermissionRequest` (`teammateMailbox.ts:541`) | `j18` (chunks.100.mjs:186) | ✅ |
| Parse perm resp | `isPermissionResponse` (`teammateMailbox.ts:558`) | `KJ6` (chunks.100.mjs:194) | ✅ |
| Build sandbox req | `createSandboxPermissionRequestMessage` (`teammateMailbox.ts:612`) | `ki1` (chunks.100.mjs:202) | ✅ |
| Build sandbox resp | `createSandboxPermissionResponseMessage` (`teammateMailbox.ts:633`) | `Ni1` (chunks.100.mjs:216) | ✅ |
| Parse sandbox req | `isSandboxPermissionRequest` (`teammateMailbox.ts:650`) | `hI8` (chunks.100.mjs:226) | ✅ |
| Parse sandbox resp | `isSandboxPermissionResponse` (`teammateMailbox.ts:667`) | `H18` (chunks.100.mjs:234) | ✅ |
| Build shutdown req | `createShutdownRequestMessage` (`teammateMailbox.ts:772`) | `dh6` (chunks.100.mjs:242) | ✅ |
| Build shutdown approved | `createShutdownApprovedMessage` (`teammateMailbox.ts:789`) | `Ei1` (chunks.100.mjs:252) | ✅ |
| Build shutdown rejected | `createShutdownRejectedMessage` (`teammateMailbox.ts:808`) | `yi1` (chunks.100.mjs:263) | ✅ |
| Parse shutdown req | `isShutdownRequest` (`teammateMailbox.ts:868`) | `i56` (chunks.100.mjs:293) | ✅ |
| Parse plan req | `isPlanApprovalRequest` (`teammateMailbox.ts:885`) | `_J6` (chunks.100.mjs:301) | ✅ (matches my correction) |
| Parse shutdown approved | `isShutdownApproved` (`teammateMailbox.ts:902`) | `Qk` (chunks.100.mjs:309) | ✅ (matches my correction) |
| Parse shutdown rejected | `isShutdownRejected` (`teammateMailbox.ts:919`) | `SI8` (chunks.100.mjs:317) | ✅ |
| Parse plan resp | `isPlanApprovalResponse` (`teammateMailbox.ts:936`) | `ch6` (chunks.100.mjs:325) | ✅ |
| Send shutdown to mailbox | `sendShutdownRequestToMailbox` (`teammateMailbox.ts:831`) | `RI8` (chunks.100.mjs:273) | ✅ |
| Last DM summary | `getLastPeerDmSummary` (`teammateMailbox.ts:1149`) | (used in `bXY`'s idle path) | ✅ |

### A2.1 ⚠️ `clearMailbox` — different ENOENT handling between v2.1.88 and v2.1.112

**v2.1.88** uses `flag: 'r+'` which throws ENOENT for missing files (deliberate — refuses to create), then catches it:
```ts
await writeFile(inboxPath, '[]', { encoding: 'utf-8', flag: 'r+' })
```

**v2.1.112** acquires a lockfile first (which throws ENOENT if the file doesn't exist), then writes WITHOUT `r+` (so the write would create the file if reached, but the lock fails first):
```js
Y = await Jj(_, { lockfilePath: z, ...z18 }), await Qh6(_, "[]", { encoding: "utf-8" })
```

**Behavioral difference:** Both refuse to (re)create a missing inbox, but the v2.1.112 path adds lock overhead. Likely a defensive change; the comment in v2.1.88 explains the intent ("so we don't accidentally create an inbox file that wasn't there"), and v2.1.112 inherits it.

### A3. Lock options — exact match

**v2.1.88** (`teammateMailbox.ts:35-41`):
```ts
const LOCK_OPTIONS = {
  retries: { retries: 10, minTimeout: 5, maxTimeout: 100 },
}
```

**v2.1.112** (`chunks.100.mjs:443-449`):
```js
z18 = { retries: { retries: 10, minTimeout: 5, maxTimeout: 100 } };
```

✅ Exact match. My CROSS_VALIDATION.md (the v2.1.112-only one) already noted the `maxTimeout: 100` field I had missed initially; this confirms it.

### A4. XML tag — exact match

**v2.1.88** (`constants/xml.ts:52`):
```ts
export const TEAMMATE_MESSAGE_TAG = 'teammate-message'
```

**v2.1.112** (`chunks.16.mjs:584`):
```js
oX = "teammate-message"
```

✅ Confirms my correction. The earlier draft of my docs incorrectly said `"teammate"`.

### A5. Plan-approval message schemas — camelCase confirmed

**v2.1.88** (`teammateMailbox.ts:684-715`):
```ts
PlanApprovalRequestMessageSchema = z.object({
  type: z.literal('plan_approval_request'),
  from: z.string(),
  timestamp: z.string(),
  planFilePath: z.string(),         // camelCase
  planContent: z.string(),
  requestId: z.string(),            // camelCase
})

PlanApprovalResponseMessageSchema = z.object({
  type: z.literal('plan_approval_response'),
  requestId: z.string(),
  approved: z.boolean(),            // not "approve"
  feedback: z.string().optional(),
  timestamp: z.string(),
  permissionMode: PermissionModeSchema().optional(),
})
```

**v2.1.112** (`chunks.100.mjs:450-463`): identical Zod schemas.

✅ Confirms the camelCase + `approved` boolean + `permissionMode` optional fields. My initial doc draft had snake_case + `approve`; my CROSS_VALIDATION.md already corrected this.

### A6. Shutdown message schemas — three-message pattern confirmed

**v2.1.88** has three distinct schemas (`teammateMailbox.ts:720-767`):
- `ShutdownRequestMessageSchema`: `{type, requestId, from, reason?, timestamp}`
- `ShutdownApprovedMessageSchema`: `{type, requestId, from, timestamp, paneId?, backendType?}`
- `ShutdownRejectedMessageSchema`: `{type, requestId, from, reason, timestamp}`

**v2.1.112** has the same three schemas at chunks.100.mjs.

✅ Confirms that `shutdown_response{approve: bool}` was always wrong — there are three types from the start. My CROSS_VALIDATION.md correction is right.

### A7. Spawn dispatch — line-for-line equivalent

**v2.1.88** (`tools/shared/spawnMultiAgent.ts:1040-1078`):
```ts
async function handleSpawn(input, context) {
  if (isInProcessEnabled()) return handleSpawnInProcess(input, context)
  try { await detectAndGetBackend() }
  catch (error) {
    if (getTeammateModeFromSnapshot() !== 'auto') throw error
    markInProcessFallback()
    return handleSpawnInProcess(input, context)
  }
  const useSplitPane = input.use_splitpane !== false
  if (useSplitPane) return handleSpawnSplitPane(input, context)
  return handleSpawnSeparateWindow(input, context)
}
```

**v2.1.112** (`chunks.137.mjs:2929-2939`):
```js
async function n7Y(q, K) {
  if (bF()) return j2K(q, K);
  try { await v96() }
  catch (z) {
    if (UX6() !== "auto") throw z;
    return E(...), h77(), j2K(q, K);
  }
  if (q.use_splitpane !== !1) return c7Y(q, K);
  return l7Y(q, K);
}
```

Symbol mapping verified:
- `handleSpawn` ↔ `n7Y`
- `isInProcessEnabled` ↔ `bF`
- `handleSpawnInProcess` ↔ `j2K`
- `detectAndGetBackend` ↔ `v96`
- `getTeammateModeFromSnapshot` ↔ `UX6`
- `markInProcessFallback` ↔ `h77`
- `handleSpawnSplitPane` ↔ `c7Y`
- `handleSpawnSeparateWindow` ↔ `l7Y`

✅ All exact matches.

### A8. `isInProcessEnabled` — line-for-line equivalent

**v2.1.88** (`utils/swarm/backends/registry.ts:351-389`):
```ts
export function isInProcessEnabled(): boolean {
  if (getIsNonInteractiveSession()) return true
  const mode = getTeammateMode()
  let enabled
  if (mode === 'in-process') enabled = true
  else if (mode === 'tmux') enabled = false
  else {  // auto
    if (inProcessFallbackActive) return true
    const insideTmux = isInsideTmuxSync()
    const inITerm2 = isInITerm2()
    enabled = !insideTmux && !inITerm2
  }
  return enabled
}
```

**v2.1.112** (`chunks.155.mjs:1104-1117`): identical logic.

✅ Exact match. The TypeScript comments confirm the intent:
> If inside tmux, use pane backend (return false)
> If inside iTerm2, use pane backend (return false)
> Otherwise, use in-process (return true)

This validates my "in-process is fallback default for plain shells, NOT a universal default" framing in the corrected README.

### A9. `l7Y` (separate-window) is unreachable — confirmed in v2.1.88 too

**v2.1.88** (`tools/AgentTool/AgentTool.tsx:290-300`):
```tsx
const result = await spawnTeammate({
  name, prompt, description,
  team_name: teamName,
  use_splitpane: true,                  // ← always true
  ...
})
```

This is the only call site of `spawnTeammate` in v2.1.88. The dispatcher (`handleSpawn`) routes to `handleSpawnSeparateWindow` only if `use_splitpane === false` — but no caller passes that.

✅ My finding that `l7Y` is unreachable holds in v2.1.88 too. The dead-code path predates v2.1.112.

### A10. In-process runner — exact mapping

**v2.1.88** `runInProcessTeammate` (`utils/swarm/inProcessRunner.ts:883-1534`) maps line-for-line to **v2.1.112** `bXY` (chunks.155.mjs:3-307):

| Concern | v2.1.88 | v2.1.112 |
|---------|---------|----------|
| Main runner | `runInProcessTeammate` | `bXY` |
| Fire-and-forget wrapper | `startInProcessTeammate` | `Jg8` |
| Per-turn poll | `waitForNextPromptOrShutdown` | `CXY` |
| Task auto-claim | `tryClaimNextTask` | `HNK` |
| Find available task | `findAvailableTask` | `RXY` |
| Format task as prompt | `formatTaskAsPrompt` | `SXY` |
| Wrap as XML | `formatAsTeammateMessage` | `k97` |
| Send idle | `sendIdleNotification` | `jNK` |
| Send to leader | `sendMessageToLeader` | `hXY` (inlined) |
| Update task state | `updateTaskState` | `sF` |
| Per-turn ALS | `runWithAgentContext` | `eQ` |
| Outer ALS | `runWithTeammateContext` | `lZ8` |
| Build canUseTool | `createInProcessCanUseTool` | `LXY` |
| Compact step | `compactConversation` | `vI6` |
| Token threshold | `getAutoCompactThreshold` | `v38` |

Constants:
- `POLL_INTERVAL_MS = 500` (v2.1.88) ↔ `yXY = 500` (v2.1.112) ✅

Behaviors:
- Pre-roll task claim (v2.1.88 line 1019) ↔ v2.1.112 line 71 ✅
- Two abort controllers (lifecycle + per-turn) ✅
- Embedded compaction with isolated context ✅
- Idle dedup via `wasAlreadyIdle` check ✅
- TEAMMATE_SYSTEM_PROMPT_ADDENDUM appended to system prompt ✅
- `permissionMode: 'default'` in resolved agent definition (overridden per-turn from task state) ✅

### A11. 5-level priority polling — exact match

**v2.1.88** (`inProcessRunner.ts:689-868`) implements the same 5 levels:

1. `task.pendingUserMessages` (line 706-739) → in-memory
2. shutdown_request scan (line 763-803) → priority bypass
3. `from === TEAM_LEAD_NAME` (line 813-819) → preferred sender
4. Any unread (line 822-823) → FIFO fallback
5. `tryClaimNextTask(taskListId, agentName)` (line 854-861) → task auto-claim

The TS includes the same `count(allMessages.slice(0, shutdownIndex), m => !m.read)` skip-counter for diagnostic logging that the v2.1.112 obfuscated version has.

✅ Exact match including the diagnostic logging.

### A12. Permission sync — extended fast-path documented

**v2.1.88** (`inProcessRunner.ts:128-451`): `createInProcessCanUseTool` has **two paths**:

1. **Fast path** (lines 198-334) — Use leader's `ToolUseConfirm` dialog with worker badge, via the `getLeaderToolUseConfirmQueue()` bridge. Bypasses the mailbox entirely for in-process teammates when the leader can show a UI prompt.
2. **Mailbox fallback** (lines 336-449) — Send `permission_request` via mailbox, register a `pendingPermissions` callback, poll the teammate's own mailbox at `PERMISSION_POLL_INTERVAL_MS = 500` for the response.

The fast path uses `setToolUseConfirmQueue` to inject the prompt into the leader's React queue with a `workerBadge: { name, color }`. This is the in-process equivalent of "use the leader's UI to ask the user for permission" — no mailbox round-trip needed.

> **Doc gap:** my `permission_sync.md` mentions both paths briefly but doesn't fully document the leader-bridge mechanism. The TS source clarifies it's a queue-based delivery into the leader's React tree, not a direct function call.

### A13. Bash classifier auto-approval — teammate-specific behavior

**v2.1.88** (`inProcessRunner.ts:158-176`):
```ts
if (feature('BASH_CLASSIFIER') &&
    tool.name === BASH_TOOL_NAME &&
    result.pendingClassifierCheck) {
  const classifierDecision = await awaitClassifierAutoApproval(...)
  if (classifierDecision) return { behavior: 'allow', updatedInput, ... }
}
```

> **Doc gap:** Teammates **await** the classifier result for Bash before showing the leader UI dialog. The leader's main agent (in standalone mode) races classifier vs UI; teammates wait. This is documented in a comment:
> "Agents await the classifier result (rather than racing it against user interaction like the main agent)."

Worth noting in `permission_sync.md` as a teammate-specific permission optimization.

### A14. Telemetry events — confirmed and additional

All telemetry events I documented are confirmed in v2.1.88:
- `tengu_team_created` (`tools/TeamCreateTool/TeamCreateTool.ts:214`) — payload `{team_name, teammate_count: 1, lead_agent_type, teammate_mode}` ✅
- `tengu_team_deleted` (`tools/TeamDeleteTool/TeamDeleteTool.ts:111`) — payload `{team_name}` ✅
- `tengu_teammate_mode_changed` (`components/Settings/Config.tsx:917`)
- `tengu_teammate_default_model_changed` (`components/Settings/Config.tsx:1508`)
- `tengu_team_mem_*` (multiple in `services/teamMemorySync/`)
- `tengu_agent_memory_loaded` (multiple sites including `inProcessRunner.ts:949`)

➕ **One additional event found:** `tengu_team_memdir_disabled` at `memdir/memdir.ts:504` — fired when team memory dir is explicitly disabled. Not in my docs.

### A15. Hooks — three team-related events confirmed

**v2.1.88** (`utils/hooks.ts:94-96, 1649-1651`):
```ts
import {
  TeammateIdleHookInput,
  TaskCreatedHookInput,
  TaskCompletedHookInput,
} from ...

// Inside the dispatcher's switch:
case 'TeammateIdle':
case 'TaskCreated':
case 'TaskCompleted':
```

✅ Exactly the three hooks I corrected to in cross-validation. The handlers in v2.1.88 are `executeTaskCreatedHooks` (called from `tools/TaskCreateTool/TaskCreateTool.ts:93`) and `executeTaskCompletedHooks` (called from `tools/TaskUpdateTool/TaskUpdateTool.ts:235`). My v2.1.112 mappings (`e58`, `CM6`) are correct.

---

## Section B: New Findings — v2.1.112 Differs From v2.1.88

### B1. 🔥 `USER_TYPE === 'ant'` bypass removed

Already detailed in A1. v2.1.88 has it; v2.1.112 doesn't. ant users now need explicit opt-in.

**Doc impact:** README.md "Feature Flags" section should add a note:
> Pre-v2.1.112, ant users (set via `USER_TYPE=ant`) bypassed both halves of the gate. v2.1.112 removed the bypass — all users now require both env-var/flag and `tengu_amber_flint`.

### B2. 🔥 Permission-mode derivation extended

**v2.1.88** (`spawnInProcess.ts:173`):
```ts
permissionMode: planModeRequired ? 'plan' : 'default',
```

**v2.1.112** (`chunks.100.mjs:1124`):
```js
permissionMode: Y0z(K.getAppState().toolPermissionContext.mode, O),
```

Where `Y0z` is `derivePermissionMode`:
```js
function Y0z(currentMode, planModeRequired) {
  if (planModeRequired) return "plan";
  if (currentMode === "plan" || currentMode === "dontAsk") return "default";
  return currentMode;     // inherit leader's mode
}
```

**Behavioral difference:**
- v2.1.88: teammate always starts at `"default"` (or `"plan"` if required).
- v2.1.112: teammate **inherits** leader's mode (e.g., `"auto"`, `"acceptEdits"`, `"bypassPermissions"`) unless leader is itself in `"plan"`/`"dontAsk"` (in which case downgrade to `"default"`).

This means v2.1.112 teammates can start with a more permissive mode if the leader already escalated. Worth documenting as a v2.1.112 enhancement.

**Doc impact:** `plan_mode_integration.md` and `permission_sync.md` already touch this; add a clear comparison.

### B3. Tool name correction — `TeamDelete`, not `TeamCleanup`

**v2.1.88** (`tools/TeamDeleteTool/constants.ts:1`):
```ts
export const TEAM_DELETE_TOOL_NAME = 'TeamDelete'
```

**v2.1.112** (`chunks.98.mjs:1491`):
```js
Cc = "TeamDelete"
```

The tool is canonically named `TeamDelete`, not `TeamCleanup`. My docs called it both in different places after the v2.1.112-only cross-validation; this v2.1.88 confirmation locks the name as `TeamDelete`.

**Doc impact:** Replace all `TeamCleanup` → `TeamDelete` in README.md, configuration_schema.md, hooks_and_telemetry.md.

### B4. `handleSpawnSeparateWindow` is the canonical name (not `spawnTmuxTeammate`)

**v2.1.88** uses `handleSpawnSeparateWindow` for the `l7Y` symbol; I called it `spawnTmuxTeammate` in my docs. The TS name is more semantic (it's about windowing, not tmux specifically).

**Doc impact:** Update symbol_index.md and module docs to use `spawnSeparateWindowTeammate` or note both names.

### B5. ➕ Many message types I missed

The v2.1.88 `teammateMailbox.ts` defines additional structured message types I missed:

| Type | Builder | Parser | Purpose |
|------|---------|--------|---------|
| `task_assignment` | (inline) | `isTaskAssignment` | Task assignment notification |
| `team_permission_update` | (inline) | `isTeamPermissionUpdate` | Broadcasts new permission rules to all teammates |
| `mode_set_request` | `createModeSetRequestMessage` | `isModeSetRequest` | Leader broadcasts permission mode change |

Plus the predicate `isStructuredProtocolMessage` enumerates **10** known protocol message types (mine missed 3).

**Doc impact:** `mailbox_protocol.md` message-type registry needs three more rows.

### B6. ➕ `markMessagesAsReadByPredicate` helper

`teammateMailbox.ts:1101` defines a selective mark-as-read variant that takes a predicate. Mine docs only mentioned single-index and bulk variants.

### B7. ➕ `getLastPeerDmSummary` helper

`teammateMailbox.ts:1149` — extracts the summary from the **last peer DM** in the message history (used in idle notifications to tell the leader what the teammate last said to a peer). Mine v2.1.112 docs called this `J18` and the readable summary helper used by `bXY`.

### B8. ➕ Cross-session UDS message tag

**v2.1.88** (`constants/xml.ts:59`):
```ts
export const CROSS_SESSION_MESSAGE_TAG = 'cross-session-message'
```

There's a parallel **cross-session UDS** mailbox mechanism (likely used when multiple Claude sessions on the same machine want to communicate beyond a single team). Mine docs didn't mention this. Out of scope for the agent-team subsystem proper, but related.

---

## Section C: Errors in My Analysis

### C1. ❌ "Team status renderer is `_nK`" — wrong attribution still

In my v2.1.112 CROSS_VALIDATION.md I noted that `_nK` (chunks.183.mjs:2756) is the **agent tab**, not the team status renderer. The TS source confirms there are **two** distinct components:
- Agent tab — broader cross-team listing (`_nK` ↔ some component in `agentDisplay.ts`)
- Team status renderer — team-scoped, embedded in the leader's main view (`components/teams/TeamStatus.tsx`)

✅ My corrected docs match. No further fix needed.

### C2. ❌ "TeamCreate fires team_created and TeamCreate cleanup fires team_deleted" — wrong tool

Already corrected in CROSS_VALIDATION.md and the docs. v2.1.88 confirms: deletion is via the separate `TeamDelete` tool.

### C3. ❌ Missed sandbox permission parser symbols

In CROSS_VALIDATION.md (the v2.1.112-only one) I corrected `_J6 → parsePlanApprovalRequest` and `Qk → parseShutdownApproved`, fixing the wrong-attribution-to-sandbox claim.

The actual sandbox parsers in v2.1.88 are `isSandboxPermissionRequest` ↔ `hI8` and `isSandboxPermissionResponse` ↔ `H18` — both verified and now correctly noted in symbol_index.md.

✅ Corrections stand.

### C4. ⚠️ `LJ = q0z` is correct but `q0z` purpose understated

`q0z` (`chunks.100.mjs:610`) — confirmed as a generic random-pick wrapper:
```js
function q0z(q) {
  var K = uO(q) ? BI8 : Db4;
  return K(q);
}
```

But the v2.1.88 source uses the imported `sample` function:
```ts
spinnerVerb: sample(getSpinnerVerbs()),
pastTenseVerb: sample(TURN_COMPLETION_VERBS),
```

So `q0z` is the obfuscated equivalent of `sample`. `LJ = q0z` is the assignment alias, exactly as I noted. My finding is correct.

---

## Section D: v2.1.88 Names → v2.1.112 Mapping (Updated)

| v2.1.88 readable name | v2.1.112 obfuscated | My doc's name | Aligned? |
|------------------------|----------------------|----------------|----------|
| `isAgentSwarmsEnabled` | `z4` | `isAgentTeamsEnabled` | ⚠️ Different name (Swarms vs Teams) |
| `isAgentTeamsFlagSet` | `cN_` | `agentTeamsCliFlag` | ⚠️ |
| `handleSpawn` | `n7Y` | `spawnTeammateDispatcher` | ✅ Semantically equivalent |
| `handleSpawnInProcess` | `j2K` | `spawnInProcessTeammate` | ⚠️ TS calls inner function `spawnInProcessTeammate` (matches!) but outer is `handleSpawnInProcess` |
| `handleSpawnSplitPane` | `c7Y` | `spawnSplitPaneTeammate` | ⚠️ TS uses "handle" prefix |
| `handleSpawnSeparateWindow` | `l7Y` | `spawnTmuxTeammate` | ❌ Mine is more specific; TS is more semantic |
| `isInProcessEnabled` | `bF` | `inProcessExecutorCheck` | ⚠️ TS is more semantic |
| `markInProcessFallback` | `h77` | `enableInProcessFallback` | ✅ Equivalent |
| `detectAndGetBackend` | `v96` | `paneBackendProbe` | ✅ Equivalent |
| `getTeammateMode` | `UX6` | `getTeammateMode` | ✅ Identical |
| `getTeammateModeFromSnapshot` | (same `UX6`?) | `getTeammateMode` | ⚠️ V2.1.88 has snapshot variant; v2.1.112 may have folded |
| `runInProcessTeammate` | `bXY` | `inProcessAgentRunner` | ✅ Same |
| `startInProcessTeammate` | `Jg8` | `startInProcessAgentExecution` | ✅ |
| `waitForNextPromptOrShutdown` | `CXY` | `pollForNextMessage` | ⚠️ TS name is more descriptive |
| `tryClaimNextTask` | `HNK` | `claimUnclaimedTask` | ⚠️ |
| `findAvailableTask` | `RXY` | `findClaimableTask` | ✅ |
| `formatTaskAsPrompt` | `SXY` | `formatTaskPrompt` | ✅ |
| `formatAsTeammateMessage` | `k97` | `wrapMessageForTeammate` | ✅ |
| `sendMessageToLeader` | `hXY` | `dispatchToLeader` | ✅ |
| `sendIdleNotification` | `jNK` | `sendIdleNotification` | ✅ Identical |
| `updateTaskState` | `sF` | `mutateInProcessTeammateTask` | ⚠️ |
| `createInProcessCanUseTool` | `LXY` | `buildCanUseToolForTeammate` | ✅ |
| `getInboxPath` | `eH6` | `getInboxPath` | ✅ Identical |
| `ensureInboxDir` | `dWz` | `ensureInboxDirectory` | ✅ |
| `readMailbox` | `ts` | `readMailbox` | ✅ Identical |
| `readUnreadMessages` | `qJ6` | `readUnreadMessages` | ✅ Identical |
| `writeToMailbox` | `F_` | `writeToMailbox` | ✅ Identical |
| `markMessageAsReadByIndex` | `Y18` | `markMessageAsReadByIndex` | ✅ Identical |
| `markMessagesAsRead` | `A18` | `markMessagesAsRead` | ✅ Identical |
| `clearMailbox` | `O18` | `clearInbox` | ⚠️ Mine slightly different |
| `formatTeammateMessages` | `cWz` | `formatTeammateXmlBlocks` | ⚠️ |
| `createIdleNotification` | `w18` | `buildIdleNotification` | ⚠️ |
| `isIdleNotification` | `$18` | `parseIdleNotification` | ⚠️ |
| `getTeamFilePath` | `oF` | `getTeamConfigPath` | ⚠️ TS uses "FilePath", file is `config.json` |
| `readTeamFile` | `uM` | `readTeamConfigSync` | ⚠️ |
| `readTeamFileAsync` | `$J6` | `readTeamConfigAsync` | ⚠️ |
| `writeTeamFileAsync` | `lM6` | `writeTeamConfig` | ⚠️ |
| `removeTeammateFromTeamFile` | (referenced) | (not documented) | ➕ |
| `TEAMMATE_MESSAGE_TAG` | `oX` | `TEAMMATE_MESSAGE_TAG` | ✅ Identical |
| `TEAM_LEAD_NAME` | `Mz` | `LEAD_NAME` | ⚠️ |
| `SWARM_SESSION_NAME` | `Ny` | `SWARM_SESSION` | ⚠️ |
| `SWARM_VIEW_WINDOW_NAME` | `Fh6` | `SWARM_VIEW_WINDOW` | ⚠️ |
| `TMUX_COMMAND` | `mD` | `TMUX` | ⚠️ |
| `HIDDEN_SESSION_NAME` | `Gi1` | `HIDDEN_PANE` | ❌ TS says "Session", mine says "Pane" — TS is more accurate (it's a session, not a pane) |
| `TEAMMATE_COMMAND_ENV_VAR` | `Uh6` | `TEAMMATE_COMMAND_ENV` | ⚠️ |
| `TEAM_DELETE_TOOL_NAME` | `Cc` | `TEAM_CLEANUP_TOOL_NAME` | ❌ Wrong — it's `TeamDelete` |
| `getSwarmSocketName` | `gh6` | `defaultSwarmName` | ⚠️ |

> Most of mine are semantically correct but slightly less aligned with the TS naming. Where mine and TS diverge significantly (e.g., `HIDDEN_PANE` vs `HIDDEN_SESSION`, `TeamCleanup` vs `TeamDelete`, `Tmux` vs `SeparateWindow`), the TS names are more accurate.

---

## Section E: Validated Algorithms (TS confirms)

✅ **5-level priority order in `CXY`** — identical in v2.1.88's `waitForNextPromptOrShutdown`.
✅ **In-memory `pendingUserMessages` checked before `await sleep(500)`** — identical.
✅ **Shutdown scan is full-array sweep** — identical.
✅ **Team-lead messages preferred via `from === TEAM_LEAD_NAME`** — identical.
✅ **Auto-claim is last** — identical.
✅ **`writeToMailbox` uses `wx` exclusive create + lockfile** — identical.
✅ **In-process runner uses double AsyncLocalStorage scope** — identical.
✅ **Embedded compact uses isolated context** — `cloneFileStateCache(toolUseContext.readFileState)` confirmed.
✅ **Idle dedup via `wasAlreadyIdle`** — identical comment in TS.
✅ **`abortController.signal.aborted` lifecycle exit + per-turn `currentWorkAbortController`** — identical.
✅ **`startInProcessTeammate` is fire-and-forget with `.catch()`** — identical (line 1549-1551).
✅ **Pre-roll task claim** — identical (`tryClaimNextTask` at line 1019).
✅ **Default tools merged with custom agent tools** — TS source enumerates the same 7 tools (SendMessage, TeamCreate, TeamDelete, TaskCreate, TaskGet, TaskList, TaskUpdate).

---

## Section F: Significant v2.1.88 → v2.1.112 Changes

### F1. Removed: `USER_TYPE === 'ant'` bypass in `isAgentSwarmsEnabled`

v2.1.88 had it; v2.1.112 doesn't. Affects internal Anthropic users.

### F2. Extended: Permission mode inheritance

v2.1.88's `permissionMode: planModeRequired ? 'plan' : 'default'` (always reset to default).
v2.1.112's `Y0z(leaderMode, planModeRequired)` — inherits leader's mode unless plan/dontAsk.

### F3. Lock semantics: clearMailbox uses lockfile in v2.1.112

v2.1.88: `flag: 'r+'` (no lock) — refuses on missing.
v2.1.112: lockfile.lock() then write — relies on lock failure for missing-file detection.

### F4. Symbol renames (cosmetic)

| Concept | v2.1.88 | v2.1.112 |
|---------|---------|----------|
| Inner spawn helper | `spawnInProcessTeammate` (in `spawnInProcess.ts`) | same name in obfuscated form (different chunk) |
| Outer dispatcher | `handleSpawn` | `n7Y` |
| Outer in-process | `handleSpawnInProcess` | `j2K` |
| (etc.) |  |  |

These are purely obfuscation-driven; the structure is unchanged.

### F5. No detected v2.1.112-only message types

All structured message types in v2.1.112 (`shutdown_*`, `plan_approval_*`, `permission_*`, `sandbox_permission_*`, `mode_set_request`, `team_permission_update`, `task_assignment`, `idle_notification`) are present in v2.1.88. No new protocol messages introduced between v2.1.88 → v2.1.112.

---

## Summary

The v2.1.88 TypeScript source provides **strong line-for-line validation** of the v2.1.112 binary analysis. The agent-teams subsystem's protocols, lifecycle, polling priorities, message schemas, and dispatch flow are unchanged between v2.1.88 and v2.1.112 — what changed is:

1. **Ant-user gate removed** (B1) — material behavior change.
2. **Permission mode inheritance extended** (B2) — material behavior change.
3. **Cosmetic symbol renames** from obfuscation (F4) — no behavior change.
4. **Some helpers I missed** in my earlier docs (B5–B7) — doc gaps, not errors.

After applying the corrections from the earlier `CROSS_VALIDATION.md` (v2.1.112-only) and the additions documented here, the analysis aligns with both the v2.1.88 TS source and the v2.1.112 binary.

| Category | Count |
|----------|-------|
| ✅ Validations | ~50 functions + ~15 algorithms + all major schemas |
| ⚠️ Semantic naming differences | ~25 |
| ❌ Errors corrected here | 4 (TeamDelete name, USER_TYPE bypass note, additional message types, helper omissions) |
| 🔥 v2.1.112-vs-v2.1.88 behavioral changes | 3 (ant gate, permission mode, clearMailbox lock) |

## Corrections Backlog (additional, after this validation)

1. **High** — Replace all `TeamCleanup` → `TeamDelete` (was a confused name).
2. **High** — Add `USER_TYPE=='ant'` removed-bypass note to README.md feature-flag section.
3. **Medium** — Document the `Y0z`/`derivePermissionMode` inheritance behavior change in `plan_mode_integration.md` and `permission_sync.md`.
4. **Medium** — Add `mode_set_request`, `team_permission_update`, `task_assignment` to the message-type registry in `mailbox_protocol.md`.
5. **Medium** — Document `markMessagesAsReadByPredicate` and `getLastPeerDmSummary` helpers.
6. **Low** — Update `HIDDEN_PANE` → `HIDDEN_SESSION` in symbol_index.md (TS uses `HIDDEN_SESSION_NAME`).
7. **Low** — Note the leader-bridge fast path for permission sync (`getLeaderToolUseConfirmQueue`) in `permission_sync.md`.
8. **Low** — Document Bash classifier teammate-await behavior in `permission_sync.md`.
