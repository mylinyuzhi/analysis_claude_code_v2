# State Preservation — Post-Compact Restoration

## Overview

When `vI6` runs, the agent's conversation history is replaced with a 2–3 KB summary. Without explicit re-attachment, the agent would lose:
- The contents of files it was working with
- The status of subagent tasks it had spawned
- The plan it was following
- The skills it had invoked
- The current set of tools, agents, and MCP servers available
- Tools it had dynamically discovered

State preservation is the system that re-attaches this state as `attachment`-type messages immediately after the summary. The result: even though the conversation history is gone, the agent's *operational state* survives.

This document covers all the collectors:
- `Nx8` — file content restoration
- `hx8` — task status attachments
- `Ex8` — plan file reference
- `Lx8` — plan-mode reminder
- `yx8` — invoked skills
- `MR6` / `PR6` / `WR6` — system-reminder deltas (tools, agents, MCP)
- `pe6` / `sj6` — pre-compact state preservation helpers
- `Y4` — attachment-message wrapper

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — State management

Key functions in this document:
- `restoreFilesPostCompact` (`Nx8`) — chunks.159.mjs:1057
- `loadTaskStatusAttachments` (`hx8`) — chunks.159.mjs:1125
- `collectPlanAttachment` (`Ex8`) — chunks.159.mjs:1081
- `collectAsyncAgentAttachment` (`Lx8`) — chunks.159.mjs:1112
- `collectInvokedSkillsAttachment` (`yx8`) — chunks.159.mjs:1092
- `buildDeferredToolsReminder` (`MR6`) — chunks.155.mjs:1738
- `buildAgentListingReminder` (`PR6`) — chunks.155.mjs:1750
- `buildMcpInstructionsReminder` (`WR6`) — chunks.155.mjs:1787
- `wrapAttachment` (`Y4`) — chunks.155.mjs:2497
- `preserveReadFileState` (`pe6`) — chunks.86.mjs:1531
- `resetMemorySelector` (`sj6`) — chunks.86.mjs:2631
- `extractPathsFromKeptMessages` (`bDY`) — referenced
- `truncateContent` (`IDY`) — referenced

Constants:
- `kx8` (`MAX_FILES_TO_RESTORE`) — 5
- `yDY` (`POST_COMPACT_FILE_TOKEN_BUDGET`) — 50,000
- `LDY` (`POST_COMPACT_TOKENS_PER_FILE`) — 5,000
- `RDY` (`POST_COMPACT_SKILLS_TOKEN_BUDGET`) — 25,000
- `hDY` (`POST_COMPACT_TOKENS_PER_SKILL`) — 5,000

---

## 1. The Restoration Phase in `vI6`

```javascript
// chunks.159.mjs:638-664 (excerpted)
let N = pe6(K.readFileState);                    // Snapshot read file state
K.readFileState.clear();                          // Clear immediately
K.loadedNestedMemoryPaths?.clear();
sj6(K.memorySelector);                            // Reset memory selector

let [R, h] = await Promise.all([
    Nx8(N, K, kx8),                               // 5 most-recent files
    hx8(K)                                        // task statuses
]);
let C = [...R, ...h];

let x = Ex8(K.agentId);                           if (x) C.push(x);  // plan file
let B = await Lx8(K);                             if (B) C.push(B);  // plan mode reminder
let m = yx8(K.agentId);                           if (m) C.push(m);  // invoked skills

for (let r of MR6(...)) C.push(Y4(r));            // deferred_tools_delta
for (let r of PR6(K, [])) C.push(Y4(r));          // agent_listing_delta
for (let r of WR6(...)) C.push(Y4(r));            // mcp_instructions_delta
```

The snapshot-clear-restore pattern is deliberate:
1. **Snapshot first** so we know what to restore.
2. **Clear before restore** so the post-compact state starts fresh — files that had been read but are no longer relevant get dropped.
3. **Restore selectively** — top 5 by recency, with token budgets.

The `Promise.all` parallelizes file restoration and task-status loading because they're independent.

---

## 2. File Restoration — `Nx8`

```javascript
// ============================================
// restoreFilesPostCompact - Re-attach top-N most-recently-read files
// Location: chunks.159.mjs:1057-1079
// ============================================

// ORIGINAL:
async function Nx8(q, K, _, z = []) {
    let Y = bDY(z),
        A = Object.entries(q).map(([$, j]) => ({
            filename: $,
            ...j
        })).filter(($) => !xDY($.filename, K.agentId) && !Y.has(Wq($.filename))).sort(($, j) => j.timestamp - $.timestamp).slice(0, _),
        O = await Promise.all(A.map(async ($) => {
            let j = await p97($.filename, {
                ...K,
                fileReadingLimits: {
                    maxTokens: LDY
                }
            }, "tengu_post_compact_file_restore_success", "tengu_post_compact_file_restore_error", "compact");
            return j ? Y4(j) : null
        })),
        w = 0;
    return O.filter(($) => {
        if ($ === null) return !1;
        let j = w_(I6($));
        if (w + j <= yDY) return w += j, !0;
        return !1
    })
}

// READABLE:
async function restoreFilesPostCompact(readFileState, sessionContext, maxFiles, keptMessagesForPartial = []) {
  // Step 1: Build set of paths already mentioned in kept-verbatim messages (partial compact)
  const alreadyMentioned = extractPathsFromKeptMessages(keptMessagesForPartial);

  // Step 2: Sort + filter + slice candidates
  const candidates = Object.entries(readFileState)
    .map(([filename, data]) => ({ filename, ...data }))
    .filter(file =>
      !isInternalFile(file.filename, sessionContext.agentId) &&
      !alreadyMentioned.has(normalizePath(file.filename))
    )
    .sort((a, b) => b.timestamp - a.timestamp)  // newest first
    .slice(0, maxFiles);                         // top N

  // Step 3: Re-read each file (parallel) with per-file token cap
  const restoredAttachments = await Promise.all(candidates.map(async file => {
    const content = await readFileWithLimits(file.filename, {
      ...sessionContext,
      fileReadingLimits: { maxTokens: POST_COMPACT_TOKENS_PER_FILE },
    }, "tengu_post_compact_file_restore_success", "tengu_post_compact_file_restore_error", "compact");
    return content ? wrapAttachment(content) : null;
  }));

  // Step 4: Filter through aggregate token budget
  let runningTokens = 0;
  return restoredAttachments.filter(attachment => {
    if (attachment === null) return false;
    const tokens = estimateTokens(serializeAttachment(attachment));
    if (runningTokens + tokens <= POST_COMPACT_FILE_TOKEN_BUDGET) {
      runningTokens += tokens;
      return true;
    }
    return false;
  });
}

// Mapping: Nx8→restoreFilesPostCompact, q→readFileState, K→sessionContext, _→maxFiles,
//          z→keptMessagesForPartial, bDY→extractPathsFromKeptMessages, xDY→isInternalFile,
//          Wq→normalizePath, p97→readFileWithLimits, Y4→wrapAttachment, w_→estimateTokens,
//          I6→serializeAttachment, LDY→POST_COMPACT_TOKENS_PER_FILE (5000),
//          yDY→POST_COMPACT_FILE_TOKEN_BUDGET (50000)
```

### Algorithm Walkthrough

#### Step 1: Already-Mentioned Set (Partial Compact Only)

For full compact, `keptMessagesForPartial` is empty `[]`, so `alreadyMentioned = new Set()` and no filtering happens.

For partial compact (`zLK`), `keptMessagesForPartial = J` (the kept-verbatim messages). `bDY(J)` extracts the set of file paths mentioned in those messages — typically file paths from `Read` tool_use blocks. Files in this set are skipped to avoid duplication.

This matters because partial compact's kept slice already shows the user (and the model) the file contents directly. Re-attaching the same file would waste tokens without adding information.

#### Step 2: Sort + Filter + Slice

```javascript
.map(([filename, data]) => ({filename, ...data}))   // Object → array
.filter(file => !isInternalFile(file.filename, agentId) && !alreadyMentioned.has(normalizedPath))
.sort((a, b) => b.timestamp - a.timestamp)           // newest first
.slice(0, maxFiles);                                  // top kx8 = 5
```

- **`isInternalFile` (`xDY`)** filters out `~/.claude/...` files, plan files (which are restored by `Ex8`), and other agent-internal paths. Without this, the file restoration might re-attach a `tasks.json` or `plan.md` that's already being attached separately.
- **Sort by `timestamp` descending** — most recent first. The agent's recency bias is correct most of the time; recent files are more likely to be referenced next.
- **Slice top 5** — `kx8` constant. Hard cap regardless of how many were read.

#### Step 3: Re-Read Each File (Parallel)

`p97(filename, ctx, successEvent, errorEvent, source)` is the post-compact file reader:
- It re-reads the file from disk fresh (not from any cache).
- Applies `maxTokens: LDY = 5000` per-file truncation.
- Emits success or error telemetry events depending on whether the read succeeded.
- The 5th arg `"compact"` is passed for telemetry context.

If the read fails (file deleted, no permissions), `p97` returns null. The attachment slot is then filtered out in Step 4.

Critically, `p97` is called **freshly** rather than using the snapshotted `readFileState`'s content. This means if the file changed on disk between the original read and post-compact, the agent sees the *current* content. This trade-off:
- ✅ Prevents stale content
- ⚠️ The summary may reference content that no longer exists
- ⚠️ The user may not know the file changed

#### Step 4: Aggregate Budget Filtering

Even with per-file caps at 5k, 5 files × 5k = 25k. Plus header/metadata serialization, the actual attachment can be larger. The aggregate budget `yDY = 50_000` provides a hard ceiling.

Files are added in order until the budget is exceeded. **Once exceeded, all remaining files are dropped** — there's no priority-based selection. This means files later in the sort order (older timestamps) may be dropped while a single huge file early in the list consumes the budget.

This is a deliberate simplification: the post-compact attachment list is *augmentative* — the model still has the summary to fall back on, so dropping a few less-recently-used files is acceptable.

### File Restoration Telemetry

Each file restoration attempt emits one of:
- `tengu_post_compact_file_restore_success` — file read succeeded
- `tengu_post_compact_file_restore_error` — file read failed

These tell the team what fraction of post-compact restoration is failing, which helps tune the read pipeline (timeouts, permission handling, etc.).

---

## 3. Task Status Restoration — `hx8`

```javascript
// ============================================
// loadTaskStatusAttachments - Re-attach status of running/completed local-agent subtasks
// Location: chunks.159.mjs:1125-1139
// ============================================

// ORIGINAL:
async function hx8(q) {
    let K = q.getAppState();
    return Object.values(K.tasks).filter((z) => z.type === "local_agent").flatMap((z) => {
        if (z.retrieved || z.status === "pending" || z.agentId === q.agentId) return [];
        return [Y4({
            type: "task_status",
            taskId: z.agentId,
            taskType: "local_agent",
            description: z.description,
            status: z.status,
            deltaSummary: z.status === "running" ? z.progress?.summary ?? null : z.error ?? null,
            outputFilePath: $A(z.agentId)
        })]
    })
}

// READABLE:
async function loadTaskStatusAttachments(sessionContext) {
  const appState = sessionContext.getAppState();
  return Object.values(appState.tasks)
    .filter(task => task.type === "local_agent")
    .flatMap(task => {
      // Skip tasks that:
      //   - have already been retrieved (output collected)
      //   - are still pending (no useful info yet)
      //   - belong to the current agent (avoid self-reference loop)
      if (task.retrieved || task.status === "pending" || task.agentId === sessionContext.agentId) {
        return [];
      }
      return [wrapAttachment({
        type: "task_status",
        taskId: task.agentId,
        taskType: "local_agent",
        description: task.description,
        status: task.status,                         // running, completed, failed
        deltaSummary: task.status === "running" ? task.progress?.summary ?? null : task.error ?? null,
        outputFilePath: getTaskOutputPath(task.agentId),
      })];
    });
}

// Mapping: hx8→loadTaskStatusAttachments, q→sessionContext, $A→getTaskOutputPath
```

### Why Skip These Tasks?

| Skip condition | Why |
|----------------|-----|
| `retrieved` | Output already pulled into the conversation. Re-attaching would duplicate. |
| `status === "pending"` | Task hasn't started yet. No useful state to attach. |
| `agentId === sessionContext.agentId` | Don't reference yourself in your own state — could create a recursive reference loop in the message tree. |

### What's Attached?

Each surviving task gets an `attachment` of type `task_status` with:
- `taskId`: the agent ID (for cross-reference)
- `description`: what the task was supposed to do
- `status`: `"running"`, `"completed"`, or `"failed"`
- `deltaSummary`: latest progress (if running) or error (if failed)
- `outputFilePath`: where the task wrote its output (for the agent to retrieve later)

### What This Enables

After compact, the model sees:

```
[task_status: agent_xyz, description="research deployment options",
 status="running", deltaSummary="found 3 candidates, evaluating...",
 outputFilePath="/tmp/agent_xyz_output.md"]
```

The model knows the task is in progress and where to look for output. Without this attachment, the model would forget that the task was even spawned, and might re-spawn it (wasting compute) or fail to wait for its result.

---

## 4. Plan File Attachment — `Ex8`

```javascript
// ============================================
// collectPlanAttachment - Re-attach the plan file's content if plan mode is active
// Location: chunks.159.mjs:1081-1090
// ============================================

// ORIGINAL:
function Ex8(q) {
    let K = lP(q);
    if (!K) return null;
    let _ = eW(q);
    return Y4({
        type: "plan_file_reference",
        planFilePath: _,
        planContent: K
    })
}

// READABLE:
function collectPlanAttachment(agentId) {
  const planContent = readPlanFileContent(agentId);
  if (!planContent) return null;
  const planFilePath = getPlanFilePath(agentId);
  return wrapAttachment({
    type: "plan_file_reference",
    planFilePath,
    planContent,
  });
}

// Mapping: Ex8→collectPlanAttachment, q→agentId, lP→readPlanFileContent, eW→getPlanFilePath
```

### What This Does

Reads the agent's plan file (a `plan.md` in the agent's working directory if plan mode is active) and creates a `plan_file_reference` attachment containing the path AND the full content.

Why include both:
- **Path** — the model can `Edit` or `Write` to update the plan
- **Content** — the model knows what the current plan says without needing to `Read` it

`Ex8` returns null if there's no plan file (most agent contexts don't use plan mode).

### Constraints

- **No truncation** — the full plan file content is included regardless of length. This is reasonable because plan files are typically small (few KB), and a truncated plan is much worse than a long one.
- **Synchronous** — `lP(agentId)` is sync, no I/O. This is because plan files are kept in memory by the plan-mode subsystem.

---

## 5. Plan-Mode Reminder — `Lx8`

```javascript
// ============================================
// collectAsyncAgentAttachment - Plan-mode reminder, only when in plan mode
// Location: chunks.159.mjs:1112-1123
// ============================================

// ORIGINAL:
async function Lx8(q) {
    if (q.getAppState().toolPermissionContext.mode !== "plan") return null;
    let _ = eW(q.agentId),
        z = lP(q.agentId) !== null;
    return Y4({
        type: "plan_mode",
        reminderType: "full",
        isSubAgent: !!q.agentId,
        planFilePath: _,
        planExists: z
    })
}

// READABLE:
async function collectAsyncAgentAttachment(sessionContext) {
  if (sessionContext.getAppState().toolPermissionContext.mode !== "plan") return null;
  const planFilePath = getPlanFilePath(sessionContext.agentId);
  const planExists = readPlanFileContent(sessionContext.agentId) !== null;
  return wrapAttachment({
    type: "plan_mode",
    reminderType: "full",
    isSubAgent: !!sessionContext.agentId,
    planFilePath,
    planExists,
  });
}

// Mapping: Lx8→collectAsyncAgentAttachment, q→sessionContext, eW→getPlanFilePath,
//          lP→readPlanFileContent
```

### When This Fires

Only when the agent's tool permission context is in `"plan"` mode. Plan mode is a subset of normal modes where:
- Only read/research tools are allowed
- The agent must produce a plan before any mutations
- The plan file lives at a stable path

### Difference from `Ex8`

`Ex8` returns the plan **content**; `Lx8` returns the plan **mode reminder**:
- `Ex8` → "here's the current plan: ..."
- `Lx8` → "you're in plan mode; here's how plan mode works"

Both can fire together — `Ex8` provides the data, `Lx8` provides the directive.

`reminderType: "full"` means this is the verbose plan-mode reminder. Other contexts may use a "brief" reminder. After compact, `"full"` is appropriate because the model's understanding has been wiped — give it the full guidance.

---

## 6. Invoked Skills Attachment — `yx8`

```javascript
// ============================================
// collectInvokedSkillsAttachment - Re-attach skill content for skills invoked in this session
// Location: chunks.159.mjs:1092-1110
// ============================================

// ORIGINAL:
function yx8(q) {
    let K = g81(q);
    if (K.size === 0) return null;
    let _ = 0,
        z = Array.from(K.values()).sort((Y, A) => A.invokedAt - Y.invokedAt).map((Y) => ({
            name: Y.skillName,
            path: Y.skillPath,
            content: IDY(Y.content, hDY)
        })).filter((Y) => {
            let A = w_(Y.content);
            if (_ + A > RDY) return !1;
            return _ += A, !0
        });
    if (z.length === 0) return null;
    return Y4({
        type: "invoked_skills",
        skills: z
    })
}

// READABLE:
function collectInvokedSkillsAttachment(agentId) {
  const skillsByName = getInvokedSkillsMap(agentId);
  if (skillsByName.size === 0) return null;

  let runningTokens = 0;
  const skills = Array.from(skillsByName.values())
    .sort((a, b) => b.invokedAt - a.invokedAt)         // newest invocation first
    .map(skill => ({
      name: skill.skillName,
      path: skill.skillPath,
      content: truncateContent(skill.content, POST_COMPACT_TOKENS_PER_SKILL),  // hDY = 5000
    }))
    .filter(skill => {
      const tokens = estimateTokens(skill.content);
      if (runningTokens + tokens > POST_COMPACT_SKILLS_TOKEN_BUDGET) return false;  // RDY = 25000
      runningTokens += tokens;
      return true;
    });

  if (skills.length === 0) return null;
  return wrapAttachment({
    type: "invoked_skills",
    skills,
  });
}

// Mapping: yx8→collectInvokedSkillsAttachment, q→agentId, g81→getInvokedSkillsMap,
//          IDY→truncateContent, hDY→POST_COMPACT_TOKENS_PER_SKILL (5000),
//          RDY→POST_COMPACT_SKILLS_TOKEN_BUDGET (25000), w_→estimateTokens
```

### Why Skills Need Special Treatment

Skills are user-defined or built-in capability bundles (e.g., `lark-mail`, `keybindings-help`). When the agent invokes a skill, it loads the skill's content into context. Without re-attachment after compact, the model would lose the skill's instructions.

But not all skills should be re-attached:
- **Only invoked skills** — `g81(agentId)` returns the map of skills that were actually invoked this session. Built-in skills that weren't invoked stay out of the post-compact prompt.
- **Sorted by recency** — most recently invoked first.
- **Per-skill truncation** — `hDY = 5000` tokens per skill to prevent any single skill from monopolizing the budget.
- **Aggregate budget** — `RDY = 25000` tokens total across all skills.

The truncation function `IDY` likely uses head-and-tail or just-head truncation; without seeing its implementation, we can infer from the budget structure that it preserves enough of the skill's structure to be useful while fitting the cap.

### Why Sorted by Recency?

Like file restoration, skill restoration uses recency as a proxy for relevance. The most recently invoked skill is most likely to be invoked again. If the budget can only fit 4 of 7 invoked skills, drop the 3 oldest.

---

## 7. System-Reminder Deltas — `MR6`, `PR6`, `WR6`

These are the same delta builders that fire during normal turns. After compact, they're called with empty previous-message lists, so they emit "isInitial: true" deltas — a fresh declaration of available tools/agents/MCP servers.

### `MR6` — Deferred Tools Delta

```javascript
// ============================================
// buildDeferredToolsReminder - Tells the model about tools available via deferred loading
// Location: chunks.155.mjs:1738-1748
// ============================================

// ORIGINAL:
function MR6(q, K, _, z) {
    if (!GS()) return [];
    if (!k38(K)) return [];
    if (!BM6(q)) return [];
    let Y = g97(q, _ ?? [], z);
    if (!Y) return [];
    return [{
        type: "deferred_tools_delta",
        ...Y
    }]
}

// READABLE:
function buildDeferredToolsReminder(tools, model, prevMessages, opts) {
  if (!isDeferredToolLoadingEnabled()) return [];
  if (!modelSupportsDeferredTools(model)) return [];
  if (!hasAnyDeferredTools(tools)) return [];
  const delta = computeDeferredToolsDelta(tools, prevMessages ?? [], opts);
  if (!delta) return [];
  return [{ type: "deferred_tools_delta", ...delta }];
}

// Mapping: MR6→buildDeferredToolsReminder, q→tools, K→model, _→prevMessages,
//          z→opts, GS→isDeferredToolLoadingEnabled, k38→modelSupportsDeferredTools,
//          BM6→hasAnyDeferredTools, g97→computeDeferredToolsDelta
```

The `deferred_tools_delta` reminds the model what tools are loadable on demand (the system uses `ToolSearch` to fetch deferred tools). Critical for after-compact — without it, the model might think only the immediately-loaded tools are available.

`opts.callSite: "compact_full"` (or `"compact_partial"`) is forwarded to telemetry to distinguish from per-turn deltas.

### `PR6` — Agent Listing Delta

```javascript
// chunks.155.mjs:1750-1785 (excerpt)
function PR6(q, K) {
    if (!on1()) return [];
    if (!q.options.tools.some((J) => e3(J, T4))) return [];
    let { activeAgents: _, allowedAgentTypes: z } = q.options.agentDefinitions, Y = new Set;
    for (let J of q.options.tools) {
        let X = iH6(J);
        if (X) Y.add(X)
    }
    let A = q.getAppState().toolPermissionContext,
        O = QK8(V88(_, [...Y]), A, T4);
    if (z) O = O.filter((J) => z.includes(J.agentType));

    let w = new Set;
    for (let J of K ?? []) {
        if (J.type !== "attachment") continue;
        if (J.attachment.type !== "agent_listing_delta") continue;
        for (let X of J.attachment.addedTypes) w.add(X);
        for (let X of J.attachment.removedTypes) w.delete(X)
    }
    let $ = new Set(O.map((J) => J.agentType)),
        j = O.filter((J) => !w.has(J.agentType)),
        H = [];
    for (let J of w) if (!$.has(J)) H.push(J);
    if (j.length === 0 && H.length === 0) return [];
    return j.sort((J, X) => J.agentType.localeCompare(X.agentType)), H.sort(), [{
        type: "agent_listing_delta",
        addedTypes: j.map((J) => J.agentType),
        addedLines: j.map(rn1),
        removedTypes: H,
        isInitial: w.size === 0,
        showConcurrencyNote: MK() !== "pro" && !an1()
    }]
}
```

This computes a **delta** between the currently-available agents and what the previous attachment list (`K`) declared. After compact, `K` is `[]`, so `w = new Set()` (empty), `j = O` (all currently-available agents), and `H = []` (nothing removed). The `isInitial: w.size === 0` condition is true, so the reminder includes the full list as a fresh declaration.

### `WR6` — MCP Instructions Delta

```javascript
// chunks.155.mjs:1787-1803
function WR6(q, K, _, z) {
    let Y = [];
    if (GS() && k38(_) && BM6(K)) Y.push({serverName: Ex, block: OC4});
    Y.push({serverName: QE, block: $C4});
    let A = oS4(q, z ?? [], Y);
    if (!A) return [];
    return [{type: "mcp_instructions_delta", ...A}]
}
```

Computes the delta of MCP server instructions. After compact, this re-declares all currently-active MCP servers and their per-server instructions to the model.

---

## 8. The Attachment Wrapper — `Y4`

```javascript
// ============================================
// wrapAttachment - Wrap any attachment object in a message envelope
// Location: chunks.155.mjs:2497-2504
// ============================================

// ORIGINAL:
function Y4(q) {
    return {
        attachment: q,
        type: "attachment",
        uuid: KMY(),
        timestamp: new Date().toISOString()
    }
}

// READABLE:
function wrapAttachment(attachment) {
  return {
    attachment,
    type: "attachment",
    uuid: generateUuid(),
    timestamp: new Date().toISOString(),
  };
}

// Mapping: Y4→wrapAttachment, q→attachment, KMY→generateUuid
```

Every attachment in v2.1.112 is wrapped in this envelope before being added to the message list. The envelope:
- Marks the message type as `"attachment"` (distinct from `user`/`assistant`/`system`)
- Carries a unique UUID for cross-reference
- Records timestamp for ordering and telemetry

The actual `attachment` field carries the typed payload (`type: "task_status"`, `type: "plan_file_reference"`, etc.). When the message-builder pipeline serializes this for the API, the typed payload is converted to text (each attachment type has its own serializer).

---

## 9. Pre-Compact State Helpers — `pe6`, `sj6`

### `pe6` — Snapshot Read File State

```javascript
// chunks.86.mjs:1531-1533
function pe6(q) {
    return Object.fromEntries(q.entries())
}
```

Converts the read-file state Map to a plain object. Called immediately before clearing the Map so we have a snapshot to pass to `Nx8`.

### `sj6` — Reset Memory Selector

```javascript
// chunks.86.mjs:2631-2634
function sj6(q) {
    if (!q) return;
    q.stateByDir.clear(), q.lastUsage = null
}
```

Resets the memory selector's per-directory state and lastUsage tracker. The memory selector is the system that decides which `CLAUDE.md` files to load when the agent navigates a project — after compact, its state should start fresh.

---

## 10. Constants Reference

| Constant | Value | Used By | Purpose |
|----------|-------|---------|---------|
| `kx8` | 5 | `Nx8` | Max files to restore |
| `yDY` | 50,000 | `Nx8` | Aggregate token budget for files |
| `LDY` | 5,000 | `Nx8` | Per-file truncation cap |
| `RDY` | 25,000 | `yx8` | Aggregate token budget for skills |
| `hDY` | 5,000 | `yx8` | Per-skill truncation cap |

These constants exactly mirror v2.1.88's `POST_COMPACT_*` constants — the budget structure has not changed.

---

## 11. The Restoration Order Matters

The order in `vI6` is:

1. Files (`Nx8`) — most foundational
2. Task statuses (`hx8`)
3. Plan attachment (`Ex8`)
4. Plan-mode reminder (`Lx8`)
5. Skills (`yx8`)
6. Deferred tools delta (`MR6`)
7. Agent listing delta (`PR6`)
8. MCP instructions delta (`WR6`)

Why this order? **Cumulative token budget management**. Files and tasks are most critical — they should always make it into the post-compact prompt if they exist. Skills come next, but with their own budget. System reminders come last — they're informational and tend to be small.

If the post-compact context is somehow over-budget at the end, **none of the above are dropped** — the compact pipeline doesn't have a final "if too large, drop X" gate. Instead, the next turn's autocompact would catch the overflow. This is consistent with how rapid-refill detection works: if compaction immediately over-fills the next turn, the breaker eventually fires.

---

## 12. The "True Post-Compact Token Count" Calculation

After all attachments are collected, the boundary marker's `compactMetadata.postTokens` is set to:

```javascript
// chunks.159.mjs:691
let A6 = qT([U, ...l, ...C, ...S]);
boundaryMarker.compactMetadata.postTokens = A6;
```

Where:
- `U` = boundary marker
- `l` = summary message(s)
- `C` = all attachments
- `S` = SessionStart hook results

`qT` walks each message and sums tokens by serializing the content. This is the **true** post-compact token count — what the next turn's API call will actually carry. The `postCompactTokenCount` field in the compact result is this same number.

This count drives:
- `willRetriggerNextTurn` telemetry field — true if `postTokens >= autoCompactThreshold`
- The rapid-refill breaker — counts how many times in a row this is true

---

## 13. Comparison with v2.1.88

| Component | v2.1.88 | v2.1.112 |
|-----------|---------|----------|
| File restoration | `collectFilesToKeep` (POST_COMPACT_MAX_FILES_TO_RESTORE = 5, MAX_FILE_RESTORE_TOKENS = 50_000, MAX_TOKENS_PER_FILE = 5_000) | Same constants in `Nx8` (kx8 = 5, yDY = 50_000, LDY = 5_000) |
| Task restoration | `collectTasksToKeep` | `hx8` (similar logic, restricted to local_agent type) |
| Plan restoration | `collectPlanToKeep` (separate from plan mode) | `Ex8` (file content) + `Lx8` (mode reminder) — split into two |
| Skill restoration | `getInvokedSkillsAttachment` | `yx8` (same constants: 25k aggregate, 5k per skill) |
| Tool/agent reminders | Inline in `compact.ts` | Separate `MR6`/`PR6`/`WR6` builders shared with normal turns |
| Pre-restore snapshot | `Object.entries(readFileState)` | `pe6(readFileState)` (same logic) |
| Memory selector reset | inline | `sj6` (same logic extracted) |

The structure is preserved; the implementation is more modular in v2.1.112. Most notably, the system-reminder builders are **shared** with the normal turn pipeline — if the per-turn delta logic improves, the post-compact path automatically benefits.

---

## 14. Key Insight

Post-compact restoration is a **token budget vs context completeness** trade-off. The system makes deliberate choices:

- **Files**: hard cap at 5 + 50k aggregate (sacrifices completeness for predictability)
- **Skills**: hard cap at 25k aggregate (less than files because skills are typically smaller)
- **Tasks/Plans/Reminders**: no cap (bound by their inherent size, no budget gate)

The **total post-compact attachment budget is approximately 100k tokens** if everything maxes out. Combined with the summary (~3k) and boundary marker (~1k), the post-compact starting point is ~104k. With autocompact threshold at ~167k, that leaves ~63k of headroom for the next turn's user message and response.

This explains why **rapid-refill is a real concern**: a single 60k file read after compact pushes us straight to the threshold. The rapid-refill breaker exists because the system *cannot* prevent the next turn from filling the post-compact headroom — it can only detect when the cycle keeps repeating.

The complementary design choice is in `MR6`/`PR6`/`WR6`: these are deltas, not full lists. After compact they declare everything as "added" because the previous list is empty. But during normal turns they only include changes — keeping the per-turn cost low.
