# Cross-Validation: 30_agent_team Analysis vs v2.1.112 Source

## Methodology

This document **cross-validates** the v2.1.112 agent-teams analysis against the actual obfuscated source at `/Users/bytedance/codespace/myapp/analysis_claude_code_v2/claude_code_v_2.1.112/source/chunks.*.mjs`.

For each claim in the module documents, I:
1. Re-grepped the source for the symbol.
2. Read the actual definition.
3. Compared name, location, signature, and behavior to my doc.

The verification covers four claim categories:
- **Symbol locations** (file:line for each obfuscated → readable mapping).
- **Function behaviors** (what the code actually does vs my pseudocode).
- **Constants** (literal values).
- **Algorithmic claims** (e.g., poll order, gate cascade, message flow).

Findings fall into four buckets:
- **✅ Validations** — claim matches source exactly.
- **⚠️ Partial errors** — line is close but off-by-a-few, or symbol is in a different chunk than claimed but logically consistent.
- **❌ Errors** — claim contradicts source; corrections required.
- **➕ Gaps** — source has something my docs missed.

---

## Section A: Validations — Analysis Matches Source

### Spawn flow

| Symbol | My doc | Source | Status |
|--------|--------|--------|--------|
| `n7Y` (spawnTeammateDispatcher) | chunks.137.mjs:2929 | chunks.137.mjs:2929 | ✅ |
| `c7Y` (spawnSplitPaneTeammate) | chunks.137.mjs:2534 | chunks.137.mjs:2534 | ✅ |
| `l7Y` (spawnTmuxTeammate) | chunks.137.mjs:2653 | chunks.137.mjs:2653 | ✅ |
| `j2K` (spawnInProcessTeammate) | chunks.137.mjs:2803 | chunks.137.mjs:2803 | ✅ |
| `P2K` (legacy alias) | chunks.137.mjs:2941 | chunks.137.mjs:2941 | ✅ |
| `M2K` (registerInProcessTask) | chunks.137.mjs:2757 | chunks.137.mjs:2757 | ✅ |
| `d7Y` (pickUniqueTeammateName) | chunks.137.mjs:2525 | chunks.137.mjs:2525 | ✅ |
| `E77` (wrapWithTeamConfigUpdate) | chunks.137.mjs:2476 | chunks.137.mjs:2476 | ✅ |
| `y77` (persistTeammateRecord) | chunks.137.mjs:2517 | chunks.137.mjs:2517 | ✅ |
| `UX6` (getTeammateMode) | chunks.137.mjs:1738 | chunks.137.mjs:1738 | ✅ |
| `HK8` (buildTeammateEnv) | chunks.137.mjs:2374 | chunks.137.mjs:2374 | ✅ |
| `J2K` (resolveClaudeBinPath) | chunks.137.mjs:2449 | chunks.137.mjs:2449 | ✅ |
| `X2K` (buildExtraCliArgs) | chunks.137.mjs:2454 | chunks.137.mjs:2454 | ✅ |
| `Y2K`/`A2K`/`O2K` (pane helpers) | chunks.137.mjs:2402/2406/2410 | exact match | ✅ |
| `Q7Y` (ensureTmuxSession) | chunks.137.mjs:2442 | chunks.137.mjs:2442 | ✅ |
| `z2K` (isInsideTmux) | chunks.137.mjs:2395 | chunks.137.mjs:2395 | ✅ |

### Mailbox

| Symbol | My doc | Source | Status |
|--------|--------|--------|--------|
| `eH6` (getInboxPath) | chunks.99.mjs:1934 | chunks.99.mjs:1934 | ✅ |
| `dWz` (ensureInboxDirectory) | chunks.99.mjs:1943 | chunks.99.mjs:1943 | ✅ |
| `ts` (readMailbox) | chunks.99.mjs:1952 | chunks.99.mjs:1952 | ✅ |
| `qJ6` (readUnreadMessages) | chunks.99.mjs:1965 | chunks.99.mjs:1965 | ✅ |
| `_18` (parseAgentName) | chunks.99.mjs:1902 | chunks.99.mjs:1902 | ✅ |
| `ph6` (composeMessageId) | chunks.99.mjs:1911 | chunks.99.mjs:1911 | ✅ |
| `gh6` (defaultSwarmName) | chunks.99.mjs:1916 | chunks.99.mjs:1916 | ✅ |
| `F_` (writeToMailbox) | chunks.100.mjs:3 | chunks.100.mjs:3 | ✅ |
| `Y18` (markMessageAsReadByIndex) | chunks.100.mjs:38 | chunks.100.mjs:38 | ✅ |
| `A18` (markMessagesAsRead) | chunks.100.mjs:73 | chunks.100.mjs:73 | ✅ |
| `O18` (clearInbox) | chunks.100.mjs:103 | chunks.100.mjs:103 | ✅ |
| `cWz` (formatTeammateXmlBlocks) | chunks.100.mjs:122 | chunks.100.mjs:122 | ✅ |
| `w18` (buildIdleNotification) | chunks.100.mjs:134 | chunks.100.mjs:134 | ✅ |
| `$18` (parseIdleNotification) | chunks.100.mjs:147 | chunks.100.mjs:147 | ✅ |
| `Ti1` (buildPermissionRequest) | chunks.100.mjs:155 | chunks.100.mjs:155 | ✅ |
| `Vi1` (buildPermissionResponse) | chunks.100.mjs:168 | chunks.100.mjs:168 | ✅ |
| `j18` (parsePermissionRequest) | chunks.100.mjs:186 | chunks.100.mjs:186 | ✅ |
| `KJ6` (parsePermissionResponse) | chunks.100.mjs:194 | chunks.100.mjs:194 | ✅ |
| `dh6` (buildShutdownRequest) | chunks.100.mjs:242 | chunks.100.mjs:242 | ✅ |
| `i56` (parseShutdownRequest) | chunks.100.mjs:293 | chunks.100.mjs:293 | ✅ |

### In-process runner & poll

| Symbol | My doc | Source | Status |
|--------|--------|--------|--------|
| `bXY` (inProcessAgentRunner) | chunks.155.mjs:3 | chunks.155.mjs:3 | ✅ |
| `Jg8` (startInProcessAgentExecution) | chunks.155.mjs:309 | chunks.155.mjs:309 | ✅ |
| `yXY = 500` (pollIntervalMs) | chunks.155.mjs:316 | chunks.155.mjs:316 | ✅ |
| `JNK` (InProcessBackend) | chunks.155.mjs:350 | chunks.155.mjs:350 | ✅ |
| `N97` (TmuxBackend) | chunks.155.mjs:639 | chunks.155.mjs:639 | ✅ |
| `y97` (ITermBackend) | chunks.155.mjs:870 | chunks.155.mjs:870 | ✅ |
| `bF` (inProcessExecutorCheck) | chunks.155.mjs:1104 | chunks.155.mjs:1104 | ✅ |
| `FXY` (getTeammateBackendMode) | chunks.155.mjs:1100 | chunks.155.mjs:1100 | ✅ |
| `d37` (resolveBackendType) | chunks.155.mjs:1119 | chunks.155.mjs:1119 | ✅ |
| `LNK` (getInProcessBackend) | chunks.155.mjs:1123 | chunks.155.mjs:1123 | ✅ |
| `gXY` (pickBackendExecutor) | chunks.155.mjs:1128 | chunks.155.mjs:1128 | ✅ |
| `UXY` (cachePaneBackendExecutor) | chunks.155.mjs:1133 | chunks.155.mjs:1133 | ✅ |
| `LXY` (buildCanUseToolForTeammate) | chunks.154.mjs:2203 | chunks.154.mjs:2203 | ✅ |
| `k97` (wrapMessageForTeammate) | chunks.154.mjs:2386 | chunks.154.mjs:2386 | ✅ |
| `sF` (mutateInProcessTeammateTask) | chunks.154.mjs:2394 | chunks.154.mjs:2394 | ✅ |
| `hXY` (dispatchToLeader) | chunks.154.mjs:2410 | chunks.154.mjs:2410 | ✅ |
| `jNK` (sendIdleNotification) | chunks.154.mjs:2419 | chunks.154.mjs:2419 | ✅ |
| `RXY` (findClaimableTask) | chunks.154.mjs:2424 | chunks.154.mjs:2424 | ✅ |
| `SXY` (formatTaskPrompt) | chunks.154.mjs:2433 | chunks.154.mjs:2433 | ✅ |
| `HNK` (claimUnclaimedTask) | chunks.154.mjs:2443 | chunks.154.mjs:2443 | ✅ |
| `CXY` (pollForNextMessage) | chunks.154.mjs:2462 | chunks.154.mjs:2462 | ✅ |

### Permission sync

| Symbol | My doc | Source | Status |
|--------|--------|--------|--------|
| `bb4` (getTeamLeaderName) | chunks.100.mjs:1369 | chunks.100.mjs:1369 | ✅ |
| `aI8` (sendPermissionRequest) | chunks.100.mjs:1377 | chunks.100.mjs:1377 | ✅ |
| `sI8` (sendPermissionResponse) | chunks.100.mjs:1401 | chunks.100.mjs:1401 | ✅ |
| `Ib4` (makeSandboxRequestId) | chunks.100.mjs:1423 | chunks.100.mjs:1423 | ✅ |
| `xb4` (sendSandboxPermissionRequest) | chunks.100.mjs:1427 | chunks.100.mjs:1427 | ✅ |
| `tI8` (sendSandboxPermissionResponse) | chunks.100.mjs:1455 | chunks.100.mjs:1455 | ✅ |
| `Y0z` (derivePermissionMode) | chunks.100.mjs:1073 | chunks.100.mjs:1073 | ✅ |
| `cI8` (spawnInProcessHelper) | chunks.100.mjs:1079 | chunks.100.mjs:1079 | ✅ |
| `W18` (updateTaskWithResult) | chunks.100.mjs:1152 | chunks.100.mjs:1152 | ✅ |

### Tools

| Symbol | My doc | Source | Status |
|--------|--------|--------|--------|
| `LJY` (SendMessageTool) | chunks.153.mjs:367 | chunks.153.mjs:367 | ✅ |
| `vJY` (sendMessageToOne) | chunks.153.mjs:96 | chunks.153.mjs:96 | ✅ |
| `TJY` (broadcastMessage) | chunks.153.mjs:125 | chunks.153.mjs:125 | ✅ |
| `VJY` (sendShutdownRequest) | chunks.153.mjs:169 | chunks.153.mjs:169 | ✅ |
| `kJY` (approveShutdown) | chunks.153.mjs:194 | chunks.153.mjs:194 | ✅ |
| `NJY` (rejectShutdown) | chunks.153.mjs:250 | chunks.153.mjs:250 | ✅ |
| `EJY` (approveTeammatePlan) | chunks.153.mjs:272 | chunks.153.mjs:272 | ✅ |
| `yJY` (rejectTeammatePlan) | chunks.153.mjs:298 | chunks.153.mjs:298 | ✅ |
| `RHK` (AgentTool) | chunks.141.mjs:456 | chunks.141.mjs:456 | ✅ |
| `wJY` (TeamCreateTool) | chunks.152.mjs:2439 | chunks.152.mjs:2439 | ✅ |
| `_b4` (planApprovalRequestSchema) | chunks.100.mjs:451 | chunks.100.mjs:450 | ⚠️ off-by-1 |
| `zb4` (planApprovalResponseSchema) | chunks.100.mjs:458 | chunks.100.mjs:457 | ⚠️ off-by-1 |

### Constants

| Symbol | My doc | Source | Status |
|--------|--------|--------|--------|
| `Mz = "team-lead"` | chunks.99.mjs:1920 | chunks.99.mjs:1920 | ✅ |
| `Ny = "claude-swarm"` | chunks.99.mjs:1922 | chunks.99.mjs:1922 | ✅ |
| `Fh6 = "swarm-view"` | chunks.99.mjs:1924 | chunks.99.mjs:1924 | ✅ |
| `mD = "tmux"` | chunks.99.mjs:1926 | chunks.99.mjs:1926 | ✅ |
| `Gi1 = "claude-hidden"` | chunks.99.mjs:1928 | chunks.99.mjs:1928 | ✅ |
| `Uh6 = "CLAUDE_CODE_TEAMMATE_COMMAND"` | chunks.99.mjs:1930 | chunks.99.mjs:1930 | ✅ |

### Telemetry

| Event | My doc | Source | Status |
|-------|--------|--------|--------|
| `tengu_team_created` | chunks.152.mjs:2544 | chunks.152.mjs:2544 | ✅ |
| `tengu_team_deleted` | chunks.152.mjs:2659 | chunks.152.mjs:2659 | ✅ |
| `tengu_teammate_mode_changed` | chunks.169.mjs:675 | chunks.169.mjs:675 | ✅ |
| `tengu_teammate_default_model_changed` | chunks.169.mjs:1069 | chunks.169.mjs:1069 | ✅ |
| `tengu_team_mem_sync_pull` | chunks.163.mjs:1388 | chunks.163.mjs:1388 | ✅ |
| `tengu_team_mem_sync_push` | chunks.163.mjs:1415 | chunks.163.mjs:1415 | ✅ |
| `tengu_team_mem_entries_capped` | chunks.163.mjs:973 | chunks.163.mjs:973 | ✅ |
| `tengu_team_mem_file_read/edit/write` | chunks.163.mjs:1781-1791 | chunks.163.mjs:1781/1786/1791 | ✅ |
| `tengu_agent_memory_loaded` | chunks.155.mjs:46 | chunks.155.mjs:46 | ✅ |

### Behaviors

| Claim | Status |
|-------|--------|
| 5-level priority polling in `CXY` | ✅ matches `CXY` source line-for-line |
| `dWz` creates inbox dir recursively before write | ✅ |
| `F_` uses `wx` exclusive create + lock | ✅ |
| `O18` clears inbox on spawn | ✅ |
| `bXY` runs nested agent loop with `eQ`+`lZ8` AsyncLocalStorage scopes | ✅ |
| Embedded autocompact (PreCompact-blocked → continue uncompacted) | ✅ |
| `RXY` finds first pending unowned task with `blockedBy` resolved | ✅ |
| `HNK` uses lock-protected atomic claim via `HR4` | ✅ (HR4 referenced) |
| `aI8` writes permission_request to leader's inbox | ✅ |
| `Jg8` is fire-and-forget | ✅ |
| Default swarm tmux session is `Ny = "claude-swarm"` | ✅ |
| `bF()` is the in-process check | ✅ |
| Pane backends use `proper-lockfile` (`Jj`) | ✅ |
| `kJY` (approve shutdown) directly aborts in-process worker | ✅ |
| Custom agent's tools merged with team tools | ✅ |
| `tengu_team_created` carries `team_name`/`teammate_count`/`lead_agent_type`/`teammate_mode` | ✅ |

---

## Section B: Errors — Source Contradicts Analysis

### B1. `oX` constant value — **WRONG**

**My doc says:** `oX` (`TEAMMATE_TAG`) = `"teammate"` (chunks.99.mjs)

**Source says:** `oX = "teammate-message"` (chunks.16.mjs:584)

**Impact:** All XML wrap examples in mailbox_protocol.md, in_process_runner.md, and tui_integration.md show:
```
<teammate teammate_id="..." color="...">body</teammate>
```
Should be:
```
<teammate-message teammate_id="..." color="...">body</teammate-message>
```

**Affected files:**
- `mailbox_protocol.md` — wrapMessageForTeammate code snippet, "Wrapping incoming messages with XML tags" section.
- `in_process_runner.md` — runner snippet showing wrapped prompt.
- `README.md` — "Tag wrapping incoming messages" entry in the constants table.
- `symbol_index.md` — the table claims chunks.99.mjs (referenced); actually chunks.16.mjs:584.

### B2. Plan approval message schemas — **field names are camelCase, not snake_case**

**My doc says (plan_approval_integration.md):**
```typescript
type PlanApprovalRequestText = {
  type: "plan_approval_request";
  request_id: string;             // ❌ should be requestId
  plan: string;                    // ❌ should be planContent
  // ❌ missing planFilePath, from, timestamp
};
type PlanApprovalResponseText = {
  type: "plan_approval_response";
  request_id: string;              // ❌ should be requestId
  approve: boolean;                // ❌ should be approved
  feedback?: string;
  // ❌ missing timestamp, permissionMode
};
```

**Source says (chunks.100.mjs:450-463):**
```typescript
_b4 = y.object({
  type: "plan_approval_request",
  from: string,
  timestamp: string,
  planFilePath: string,
  planContent: string,
  requestId: string,
});
zb4 = y.object({
  type: "plan_approval_response",
  requestId: string,
  approved: boolean,
  feedback: string?,
  timestamp: string,
  permissionMode: ss().optional(),  // permission mode the worker should adopt after approval
});
```

**Why this matters:** Two semantic differences:
1. `planFilePath` exists separately from `planContent` — the plan is written to a file *and* sent inline. (Builder is in chunks.150.mjs:2174-2181, inside the ExitPlanMode tool).
2. `permissionMode` in the response carries the new permission mode the worker should switch into after approval.

**Affected files:**
- `plan_mode_integration.md` — entire schema sections need correction.
- `mailbox_protocol.md` — message-type registry table needs field-name correction.

### B3. Shutdown approval is **not** a `shutdown_response{approve: bool}` — there are **separate** `shutdown_approved`/`shutdown_rejected` types

**My doc says (mailbox_protocol.md, edge_cases_and_failures.md):**
- `shutdown_response` is one type with a discriminating `approve: boolean`.

**Source says:**
- `shutdown_approved` (`Ab4` schema, builder `Ei1` chunks.100.mjs:252).
- `shutdown_rejected` (`Ob4` schema, builder `yi1` chunks.100.mjs:263).

These are *separate* types with their own schemas:
```typescript
shutdown_approved = { type, requestId, from, timestamp, paneId?, backendType? };
shutdown_rejected = { type, requestId, from, reason, timestamp };
```

**Why this matters:** The leader's response handler logic is split (`Qk` parses approved, `SI8` parses rejected). The teammate response handlers (`kJY`, `NJY`) build different envelopes per case.

Also: `shutdown_approved` carries `paneId` and `backendType` so the leader can clean up the pane after the worker has exited. This is crucial info.

**Affected files:**
- `mailbox_protocol.md` — message-type registry needs three rows (request, approved, rejected) instead of two (request, response).
- `edge_cases_and_failures.md` — shutdown flow description.

### B4. Parser-symbol assignments to wrong types

**My doc says (mailbox_protocol.md, symbol_index.md):**
- `_J6` parses sandbox_permission_request.
- `Qk` parses sandbox_permission_response.

**Source says:**
- `hI8` (chunks.100.mjs:226) parses `sandbox_permission_request`.
- `H18` (chunks.100.mjs:234) parses `sandbox_permission_response`.
- `_J6` (chunks.100.mjs:301) parses `plan_approval_request` (uses `_b4` schema).
- `Qk` (chunks.100.mjs:309) parses `shutdown_approved` (uses `Ab4` schema).

**Why this matters:** Anyone using the symbol index to find a parser for a given message type would be misled.

**Affected files:**
- `mailbox_protocol.md` — message-type registry table has wrong parser symbols.
- `symbol_index.md` — `_J6`/`Qk` lines are wrong.

### B5. `$u6` (status verb formatter) does NOT use spinnerVerb/pastTenseVerb

**My doc says (tui_integration.md):**
```javascript
function formatTeammateStatusVerb(task) {
  if (task.shutdownRequested && task.status === "running") return "Stopping…";
  if (task.awaitingPlanApproval) return "Awaiting plan approval";
  if (task.isIdle) return task.pastTenseVerb;            // ❌ wrong
  if (task.status === "running") return task.spinnerVerb + "…"; // ❌ wrong
  ...
}
```

**Source says (chunks.183.mjs:2733-2738):**
```javascript
function $u6(q) {
  if (q.shutdownRequested) return "stopping";          // lowercase, no ellipsis
  if (q.awaitingPlanApproval) return "awaiting approval";  // shorter
  if (q.isIdle) return "idle";                          // NOT pastTenseVerb
  return (q.progress?.recentActivities && kC6(q.progress.recentActivities))
       ?? q.progress?.lastActivity?.activityDescription
       ?? "working";                                    // NOT spinnerVerb
}
```

**Why this matters:** `$u6` is for the **agent tab** (chunks.183) which uses live progress data, not the random spinner verbs. The team status renderer in chunks.135 *does* use spinner verbs (line 472: `g = (k && !k.isIdle ? k.spinnerVerb ?? S : F) + "…";`).

**Two TUI surfaces with different verb logic:**
- Agent tab (`$u6` / `_nK` chunks.183.mjs:2733/2756): activity-driven verbs from `progress.recentActivities`.
- Team status panel (chunks.135.mjs:472, in `nAK` / `k8Y` row component): spinner-verb-driven from task.spinnerVerb.

**Affected files:**
- `tui_integration.md` — Status Verb Logic section is wrong; spinner verbs section overstates their TUI role.

### B6. Team status renderer is in chunks.135.mjs, not chunks.183.mjs

**My doc says (tui_integration.md, README.md):**
- `_nK` (`AgentStatusComponent`) at chunks.183.mjs:2756 is "the team status renderer".

**Source says:**
- `_nK` at chunks.183.mjs:2756 is the **agent tab row** component (a different surface — the global agent listing).
- The actual **team status row** is `nAK` (chunks.135.mjs:3) and the team **block** is `k8Y` (chunks.135.mjs:413).

**Affected files:**
- `tui_integration.md` — "Team status renderer" attribution is wrong.
- `README.md` — TUI section reference.
- `symbol_index.md` — should add chunks.135.mjs entries.

### B7. `tengu_team_created.teammate_count` is always 1, not "often 0"

**My doc says (hooks_and_telemetry.md):**
- `teammate_count` "Number of teammates initially configured (often 0)"

**Source says (chunks.152.mjs:2544-2548):**
```javascript
d("tengu_team_created", {
  team_name: j,
  teammate_count: 1,        // hardcoded — only the lead exists at creation
  lead_agent_type: J,
  teammate_mode: d37()
})
```

`teammate_count: 1` is hardcoded — at creation only the lead exists. Subsequent additions don't re-fire `tengu_team_created`.

**Affected files:**
- `hooks_and_telemetry.md`

### B8. Team deletion event source — **separate tool, not "TeamCreate cleanup"**

**My doc says (configuration_schema.md):**
- "Team deletion (TeamCreate cleanup)" → directory removal.

**Source says:**
- `tengu_team_deleted` is fired by a separate tool `jJY` (chunks.152.mjs:2609) whose name is `Cc`. This is a distinct disband/cleanup tool, not part of `TeamCreate`.

**Affected files:**
- `configuration_schema.md` — Cleanup on Team Delete section.
- README — should mention `Cc` as the team-cleanup tool alongside `TeamCreate`.

### B9. `LJ` is `q0z` — random pick is `q0z`, not unnamed

**My doc says (symbol_index.md, tui_integration.md):**
- `LJ` (`pickRandomSpinnerVerb`) at chunks.100.mjs:621.

**Source says:**
- `LJ` at chunks.100.mjs:615 (declaration) is **assigned** to `q0z` (chunks.100.mjs:610) at line 621 inside `uc = L(() => { ... LJ = q0z })`.
- The actual function is `q0z`, which is a generic random picker (works on both arrays and fancy iterators via `uO(q) ? BI8 : Db4`).

**Why this matters:** `LJ` is an alias, not a function definition. The function body is `q0z`.

**Affected files:**
- `symbol_index.md` — should note `LJ = q0z` (alias).

### B10. `Si1` is the verb pool but `nh6` (idle verbs) has only 8 entries

**My doc says (tui_integration.md):**
- "DEFAULT_SPINNER_VERBS" has "175+ verbs". ✅ verified.
- "IDLE_VERBS (nh6)" — implied to be a similar large pool. ❌

**Source says (chunks.100.mjs:641):**
```javascript
nh6 = ["Baked", "Brewed", "Churned", "Cogitated", "Cooked", "Crunched", "Sautéed", "Worked"]
```

Only **8** idle verbs.

**Affected files:**
- `tui_integration.md` — should note nh6 is small.

---

## Section C: Gaps — Source Has More Than Analysis Captured

### C1. ➕ `TaskCreated` hook (third team-related hook)

**Found:** `e58` at chunks.192.mjs:2829 — fires `hook_event_name: "TaskCreated"` with same fields as `TaskCompleted` (task_id, task_subject, task_description, teammate_name, team_name).

**Why missed:** I checked for TeammateIdle and TaskCompleted but not for TaskCreated. The trigger site fires when the runner registers a new task (or possibly when the Task tool creates one inside a teammate context).

**Doc impact:** `hooks_and_telemetry.md` should document three hooks, not two.

### C2. ➕ Additional team-memory telemetry events (4 more)

**Found:**
- `tengu_team_mem_secret_skipped` — chunks.163.mjs:1192
- `tengu_team_mem_push_suppressed` — chunks.163.mjs:1511
- `tengu_team_mem_sync_started` — chunks.163.mjs:1614
- `tengu_team_mem_accessed` — chunks.163.mjs:1776

**Doc impact:** `hooks_and_telemetry.md` telemetry section is incomplete.

### C3. ➕ The `Cc` team-cleanup tool

**Found:** `jJY = Iq({ name: Cc, searchHint: "disband a swarm team and clean up", ... })` at chunks.152.mjs:2609.

**Why missed:** I treated `Cc` as just a constant referenced by the runner's tool merge list. It's actually a full tool that:
1. Refuses cleanup if active members remain (forces user to graceful shutdown).
2. Calls `pd8(teamName)` (likely directory removal).
3. Clears teammateColors registry.
4. Fires `tengu_team_deleted`.

**Doc impact:** `README.md` and `configuration_schema.md` should document `Cc` (TeamCleanup) as a third user-facing tool alongside SendMessage and TeamCreate.

### C4. ➕ `RI8` standalone shutdown_request sender

**Found:** `RI8` at chunks.100.mjs:273 sends `shutdown_request` directly. This is invoked outside of SendMessage's `VJY`.

**Why missed:** I treated SendMessage as the only path for shutdown_request. There's a non-tool path too.

### C5. ➕ `_2K` is dead code (no callers)

**Found:** `_2K` at chunks.137.mjs:2350 is a near-duplicate of `X2K` (chunks.137.mjs:2454), differing only by including `--teammate-mode` in the args. It has **no callers** anywhere in the codebase.

**Why important:** My symbol_index calls it `formatModelArg` — that's wrong (it's actually a never-used variant of `buildExtraCliArgs`). It's likely vestigial from an older spawn flow.

**Doc impact:** symbol_index.md `_2K` line should mark this as dead code (analogous to how 07_compact's `dead_code_audit.md` notes vestigial `snipTokensFreed`).

### C6. ➕ `l7Y` (separate-window spawn) is **unreachable**

**Found:** `n7Y` (chunks.137.mjs:2937) routes to `l7Y` only when `q.use_splitpane === false`. The only call site of `n7Y` (via `P2K`, only invoked from chunks.141.mjs:514) hardcodes `use_splitpane: !0` (true). Therefore `l7Y` is **never invoked** from any tool-driven spawn.

**Why important:** The README and spawn_mechanism.md frame three reachable backends. In practice only **two** are reachable in v2.1.112 via the public API: `j2K` (in-process) and `c7Y` (split-pane).

**Doc impact:**
- `README.md` — backend table should mark new-window as "unreachable from current tool surface".
- `spawn_mechanism.md` — decision tree should note the dead branch.

### C7. ➕ Spawn dispatchers reset `inProcessFallbackActive` via `h77()`

**Found:** When `n7Y`'s pane probe fails in auto mode, it calls `h77()` (chunks.155.mjs:1096). I correctly noted this as "sticky flag" but didn't enumerate `h77`'s signature/location precisely.

**Doc impact:** Minor — symbol_index could benefit from `h77 chunks.155.mjs:1096`.

### C8. ➕ `S77` and `T96` (sanitization helpers) are in chunks.155.mjs, not chunks.137.mjs

**Found:**
- `S77` (sanitizeAgentName) — chunks.155.mjs:1165
- `T96` (sanitizeForTmuxName) — chunks.155.mjs:1161

My symbol_index marked both as "chunks.137.mjs (referenced)". Should be corrected.

### C9. ➕ `v96` (paneBackendProbe) is in chunks.155.mjs:1002

My symbol_index says "chunks.137.mjs (referenced)". Source: chunks.155.mjs:1002.

### C10. ➕ `R77` (invalidatePaneBackendCache) is in chunks.155.mjs:1141

My symbol_index says "chunks.137.mjs (referenced)". Source: chunks.155.mjs:1141.

### C11. ➕ `z18` lock options have a `maxTimeout: 100` field

**Found (chunks.100.mjs:443):**
```javascript
z18 = { retries: { retries: 10, minTimeout: 5, maxTimeout: 100 } };
```

I documented `retries: 10, minTimeout: 5ms` but missed `maxTimeout: 100ms`. The maxTimeout caps exponential backoff at 100ms per retry attempt.

**Doc impact:** `mailbox_protocol.md` lock section.

### C12. ➕ `kJY` (shutdown approve) takes additional in-process action

**Found (chunks.153.mjs:194-247):** When the worker accepts shutdown:
1. Builds and sends `shutdown_approved` envelope (with `paneId` and `backendType`) to lead's inbox.
2. If backend is `in-process`: directly aborts its own AbortController.
3. If backend is `tmux`/`iterm2`: as a fallback, also looks up an in-process task record and aborts it (defensive).
4. If neither: schedules `setImmediate(() => WK(0, "other"))` — likely a `process.exit(0)` shim.

**Doc impact:** `edge_cases_and_failures.md` shutdown approval description is too high-level.

### C13. ➕ Plan-mode ExitPlanMode handler writes plan file before sending request

**Found (chunks.150.mjs:2163-2199):** The teammate `ExitPlanMode` tool:
1. If `plan` arg is provided, writes it to the plan file (path resolved by `eW(agentId)`).
2. If teammate-mode (`Lz() && Pn6()`), builds `plan_approval_request` containing both `planFilePath` and `planContent`.
3. Writes envelope to leader's inbox.
4. Calls `J37(taskRecord, taskRegistry, true)` — likely sets `awaitingPlanApproval: true`.
5. Returns `{plan, isAgent: true, filePath, awaitingLeaderApproval: true, requestId}`.

**Doc impact:** `plan_mode_integration.md` Worker-Side Dispatch section is conceptually right but missed: (a) plan file write side effect, (b) `J37` AppState mutation, (c) tool result fields.

### C14. ➕ Permission decision can carry `permissionMode`

**Found (chunks.153.mjs:283):** Plan approval response includes `permissionMode: O` where `O = (currentMode === "plan" ? "default" : currentMode)`. The teammate adopts the lead's permission mode (with plan→default rewrite) on approval.

**Doc impact:** `plan_mode_integration.md` should describe this transmission.

---

## Section D: Partial Errors — Off-by-Few or Minor Misattributions

### D1. ⚠️ `_b4`/`zb4` schema lines off-by-1

My doc: chunks.100.mjs:451 / 458.
Source: chunks.100.mjs:450 / 457.

The line numbers I cited reference the body inside the `C6(() => y.object({...}))` wrapper rather than the start of the assignment. Minor.

### D2. ⚠️ `W38`/`CM6` hook locations off-by-3

My doc: TeammateIdle at chunks.192.mjs:2814; TaskCompleted at chunks.192.mjs:2848.
Source: TeammateIdle at chunks.192.mjs:2814 ✅; TaskCompleted at chunks.192.mjs:2848 ✅.

Actually verified — these are exact. Earlier I noted slight offsets (2817/2851) but those were the `hook_event_name:` lines inside; my function-definition cites are correct.

### D3. ⚠️ "In-process is the new default" claim

My doc framed this as a polarity flip. The actual `bF()` logic returns true only when:
- `I7()` (non-interactive) is true, OR
- `FXY() === "in-process"` (explicit), OR
- `inProcessFallbackActive` (sticky after failure), OR
- (auto mode AND `!insideTmux && !inITerm2`).

For users running interactively in tmux or iTerm2 (the common case), `bF()` returns *false*, so the default is still pane mode. The "in-process by default" claim only holds for plain shell or non-interactive sessions.

This is more nuanced than my README implied. The README should clarify: in-process is the **fallback** when no terminal-managed pane backend is available, not the universal default.

### D4. ⚠️ `c7Y` line range cited as 2534-2651

Source: c7Y is defined at line 2534 — actual body extends to line 2651, which is correct, but the function's logic is dense (handles iterm2 setup modal, pane creation, env, command building, send-keys, AppState update). My implementation.md pseudocode covers the major branches but the actual source has additional debug-logging and registerCleanup calls I didn't document line-by-line.

### D5. ⚠️ Lock retry budget claim "~50ms"

My doc: "10 attempts, 5ms backoff (~50ms cumulative)".
Source: `retries: 10, minTimeout: 5, maxTimeout: 100`. With exponential backoff, the cumulative budget is closer to 100ms × 10 = ~1 second worst case. The 50ms estimate is the *minimum* time for 10 retries at minTimeout, not the practical budget.

---

## Section E: Verified Algorithmic Claims

The following high-level descriptions in the docs are confirmed by direct source reading:

✅ **5-level priority order in `CXY`** — pendingUserMessages → shutdown_request scan → team-lead messages → any unread → claimUnclaimedTask. Source matches exactly (chunks.154.mjs:2462-2547).

✅ **In-memory `pendingUserMessages` is checked before `await sleep(500)`** — confirmed at chunks.154.mjs:2467-2487.

✅ **Shutdown scan is a full-array sweep, not order-aware** — confirmed at chunks.154.mjs:2497-2515.

✅ **Team-lead messages preferred via `m.from === Mz`** — confirmed at chunks.154.mjs:2517-2523.

✅ **Auto-claim is last** — confirmed at chunks.154.mjs:2538-2543.

✅ **`F_` uses `wx` exclusive create + `properLockfile.lock`** — confirmed at chunks.100.mjs:9-30.

✅ **`bXY` runs the agent loop inside double AsyncLocalStorage scope** — confirmed at chunks.155.mjs:132-200.

✅ **Embedded compact catches `GI6`-prefixed errors and continues** — confirmed at chunks.155.mjs:103-118.

✅ **Idle dedup via `wasAlreadyIdle` check** — confirmed at chunks.155.mjs:215-226.

✅ **`abortController.signal.aborted` is the lifecycle exit condition** — confirmed at chunks.155.mjs:80, 165, 203, 245.

✅ **`currentWorkAbort` is per-turn, recreated each iteration** — confirmed at chunks.155.mjs:82-86.

✅ **`Jg8` is fire-and-forget with `.catch()` for unhandled errors** — confirmed at chunks.155.mjs:309-313.

✅ **`bF()` returns true for non-interactive sessions** — confirmed at chunks.155.mjs:1105.

✅ **`y77` is the per-spawn team-config update** — confirmed in c7Y/l7Y/j2K call sites.

---

## Summary

| Category | Count |
|----------|-------|
| ✅ Validations | ~80 symbols + ~25 behaviors |
| ⚠️ Partial errors | 5 |
| ❌ Errors | 10 |
| ➕ Gaps | 14 |

The analysis is **largely accurate at the symbol-mapping level** — function names, line numbers, and dispatch flow all map correctly to the source. The errors are concentrated in:
1. **Structured-message schemas** (B1, B2, B3, B4) — I assumed snake_case fields and a unified `shutdown_response` shape; the source uses camelCase and split shutdown types.
2. **TUI surface attribution** (B5, B6) — I conflated the agent tab (chunks.183) with the team status panel (chunks.135). They are distinct surfaces.
3. **In-process default framing** (D3) — Overstated.

The gaps are concentrated in:
1. **Additional telemetry events** (C2) — 4 missed.
2. **TaskCreated hook** (C1) — third hook missed.
3. **`Cc` team-cleanup tool** (C3) — separate from TeamCreate.
4. **Dead code** — `l7Y` and `_2K` are unreachable in v2.1.112's tool surface (C5, C6).
5. **Plan-mode ExitPlanMode flow** (C13) writes plan to file before announcing.

## Corrections Backlog (in priority order)

1. **High** — Fix all schema field names in `mailbox_protocol.md`, `plan_mode_integration.md`. (Errors B2, B3.)
2. **High** — Fix `oX = "teammate-message"` in all XML wrap examples. (Error B1.)
3. **High** — Fix parser-symbol mappings (`_J6` is plan_approval_request, `Qk` is shutdown_approved). (Error B4.)
4. **Medium** — Add `TaskCreated` hook to `hooks_and_telemetry.md`. (Gap C1.)
5. **Medium** — Add 4 missed telemetry events. (Gap C2.)
6. **Medium** — Document `Cc` team-cleanup tool. (Gap C3.)
7. **Medium** — Mark `l7Y` and `_2K` as dead code in symbol_index and module docs. (Gaps C5, C6.)
8. **Medium** — Correct TUI surface attribution: agent tab (chunks.183) vs team status panel (chunks.135). (Errors B5, B6.)
9. **Medium** — Soften "in-process is the new default" framing. (Partial D3.)
10. **Low** — Fix `S77`/`T96`/`v96`/`R77`/`h77` chunk attributions in symbol_index. (Gaps C8-C10.)
11. **Low** — Note `LJ = q0z` alias in symbol_index. (Error B9.)
12. **Low** — Update `nh6` (idle verbs) note: only 8 entries. (Error B10.)
13. **Low** — Fix `tengu_team_created.teammate_count: 1` hardcoded. (Error B7.)
14. **Low** — Update lock retry budget estimate. (Partial D5.)

The corrections do not invalidate the architectural narrative or the major design insights; they tighten the symbol/schema accuracy.
