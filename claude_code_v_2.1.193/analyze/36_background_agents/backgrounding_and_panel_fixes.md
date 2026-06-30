# Backgrounding & Agent-Panel Fixes (2.1.193 / 2.1.191)

> **Type:** mixed — one isolable carry-over-aware count fix, one prompt body-change, one partially-isolable adoption fix, one isolable bg-job metadata refresh, and two honestly-flagged non-isolable UI/channel items · **Versions:** 2.1.193 / 2.1.191 · **Module:** `36_background_agents/` (EXTEND)
> **Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). `cli_inner_pretty.js:<line>` = a **193** line unless tagged *(183)*.

This doc covers the cluster of backgrounding/panel UX fixes. Each item is tagged with how cleanly it isolates to source; the remaining UI-only/channel items are flagged honestly rather than given fabricated anchors.

---

## 1. Spurious "N tasks would be abandoned" when all tasks carry over (ISOLABLE, 2.1.193)

### What it does

When the user double-taps `←←` to background a session, the interstitial used to warn "N background task(s) would be abandoned" and demand a second confirmation — *even when every active task was adoptable and would actually be carried over* into the detached job. The fix makes the warned count subtract the carry-over set, so when all tasks carry over the count is `0` and the second-confirm prompt is skipped.

### How it works

The warn-count is `countAbandonedBgTasks` (`oUo`, `:578073`) = total bg tasks **minus** tasks that carry over:

```javascript
// ============================================
// countAbandonedBgTasks - tasks that would truly be lost = total − carried-over
// Location: cli_inner_pretty.js:578073-578075
// ============================================

// ORIGINAL (for source lookup):
function oUo(e, t = fze(e)) {
  return y_t(e).count - H7t(e, t);
}

// READABLE (for understanding):
function countAbandonedBgTasks(tasks, carryOverMap = computeCarryOverMap(tasks)) {
  return countBackgroundTasks(tasks).count - countCarryOverTasks(tasks, carryOverMap);
}

// Mapping: oUo→countAbandonedBgTasks, fze→computeCarryOverMap, y_t→countBackgroundTasks, H7t→countCarryOverTasks
```

The carry-over set is built by `computeCarryOverMap` (`fze`, `:578006`), which walks the task tree from roots (`parentAgentId === void 0`) and marks a subtree as carrying over **only if every node in it is adoptable** — an adoptable node is a backgrounded *running* agent with an `abortController` (and not the `main-session` sentinel), or a detachable backgrounded running shell (not a `monitor`), or a running workflow with `scriptPath` + `workflowRunId`:

```javascript
// ============================================
// computeCarryOverMap - per-subtree "carries over?" map; a subtree carries iff ALL its nodes are adoptable
// Location: cli_inner_pretty.js:578019-578052 (adoptable predicate + tree walk)
// ============================================

// ORIGINAL (for source lookup):
  let o = (i) => {
      if (Kl(i)) return (i.agentType !== "main-session" && i.status === "running" && i.isBackgrounded && i.abortController !== void 0);
      if (iT(i)) return (i.kind !== "monitor" && i.status === "running" && i.isBackgrounded && i.shellCommand !== null && i.shellCommand.detach !== void 0);
      if (Aqt(i)) return (i.status === "running" && i.scriptPath !== void 0 && i.workflowRunId !== void 0 && i.abortController !== void 0);
      return !1;
    },
    s = (i, a) => { a.push(i.id); let l = o(i); for (let c of r.get(i.id) ?? []) l = s(c, a) && l; return l; };

// READABLE (for understanding):
  let isAdoptable = (task) => {
      if (isLocalAgentTask(task)) return task.agentType !== "main-session" && task.status === "running" && task.isBackgrounded && task.abortController !== undefined;
      if (isLocalShellTask(task)) return task.kind !== "monitor" && task.status === "running" && task.isBackgrounded && task.shellCommand?.detach !== undefined;
      if (isWorkflowTask(task))   return task.status === "running" && task.scriptPath !== undefined && task.workflowRunId !== undefined && task.abortController !== undefined;
      return false;
    },
    walkSubtree = (node, ids) => { ids.push(node.id); let carries = isAdoptable(node); for (let child of childrenOf(node.id)) carries = walkSubtree(child, ids) && carries; return carries; };

// Mapping: o→isAdoptable, s→walkSubtree, Kl→isLocalAgentTask, iT→isLocalShellTask, Aqt→isWorkflowTask, r→childrenOf
```

`countCarryOverTasks` (`H7t`, `:578070`) then counts the marked tasks across local tasks and the remote roster. The interstitial guard is `if (FI > 0 || (!confirmedInterstitial && Qo > 0))` (`:689571`) where `Qo = countAbandonedBgTasks(...)`; the warning string is `${Qo} background ${pluralize(Qo,"task")} would be abandoned` (`:689578`). When **all** active tasks are adoptable, `countCarryOverTasks === countBackgroundTasks` ⇒ `Qo === 0` ⇒ the guard is false ⇒ no warning, and `←←` backgrounds immediately.

### Why this approach

The bug was a *category error*: the interstitial counted *active* tasks as *abandoned* tasks, but backgrounding **adopts** active work into the detached job rather than killing it. The fix computes the precise subset that truly cannot be carried (e.g. a `monitor` shell, a non-running task, a task without an abort handle) and warns only about *that*. The per-subtree "all-or-nothing" rule (`walkSubtree` ANDs the children's results) is the subtle part: a subtree carries over only if its *entire* descendant chain is adoptable, because adopting a parent without its children would orphan the children — so a single non-adoptable leaf taints its whole ancestry's carry-over eligibility, and those tasks correctly count as abandoned.

### Evidence

`grep -c "would be abandoned"` = **0** in 183, present in 193 (`:689578`, plus the skip-ahead variant `:690133`). The granular, carry-over-aware count UI is net-new in the 183→193 window. **Confidence: HIGH** on the mechanism (isolable in 193); the specific "spurious when all carry over" fix is the `- H7t(...)` subtraction inside `oUo`. (183's only bg-cancel string was a single generic "Backgrounding cancelled" with no per-task count.)

---

## 2. Background launch result no longer says "end your response" (ISOLABLE, body-change, 2.1.193)

### What it does

After an **async (background)** subagent launch, the tool-result text injected back to the model used to instruct it to *stop* ("…and end your response. Do not generate any other text…"). 193 drops that directive, so after launching a background subagent the model is free to keep working on other tasks instead of halting.

### The diff

```javascript
// ============================================
// async_launched tool-result text - 183 vs 193 (the "end your response" drop)
// Location: cli_inner_pretty.js:431256-431261 (193) ; 424285-424290 (183)
// ============================================

// ORIGINAL 183 (async_launched, both branches end with the stop directive):
//   canReadOutputFile ? "...Work on non-overlapping tasks, or briefly tell the user what you launched and end your response.\noutput_file: ..."
//                     : "Briefly tell the user what you launched and end your response. Do not generate any other text — agent results will arrive in a subsequent message."

// ORIGINAL 193 (async_launched, both branches drop the stop directive):
              ? `Do not duplicate this agent's work — avoid working with the same files or topics it is using.
output_file: ${e.outputFile}
Do NOT ${Ls} or tail this file via the shell tool — it is the full subagent JSONL transcript ...`
              : "Briefly tell the user what you launched. Agent results will arrive in a subsequent message.",

// READABLE (for understanding):
//   193 removes "...and end your response. Do not generate any other text..." from BOTH the
//   canReadOutputFile and the plain async_launched branches → the model keeps working after a bg launch.
```

### False-delta guard (scope)

The **Cloud / remote** launch result (`remote_launched`) still says "end your response" in **both** versions (193 `:431248`, 183 identical): `…You will be notified automatically when it completes.\nBriefly tell the user what you launched and end your response.` So this change is **scoped to async/background launches only**, not cloud — do not claim the cloud path changed. (Separately, the `async_launched` agentId hint also gained a `summary:'<5-10 word recap>'` arg at `:431255` vs 183 `:424284` — that is the 2.1.191 SendMessage-summary work, not this item.) **Confidence: HIGH** — exact before/after located in both bundles.

---

## 3. Phantom "general-purpose (resumed)" subagent on bg main turn (PARTIALLY ISOLABLE, 2.1.193)

### What it does

Backgrounding the *main* turn used to spawn a phantom "general-purpose (resumed)" subagent card that re-ran the conversation. The locus is the **job-adoption loop** that re-registers persisted agents when a session attaches/resumes, combined with the `main-session` sentinel that must keep the top-level session from being treated as a subagent.

### How it works

When a session attaches, the adoption loop iterates persisted agents from the job dir (`readJobDir` `JKl` `:577927`, sorted by `spawnDepth`) and re-registers each via `registerCompletedResumedAgent` (`Lgl`, `:454100`):

```javascript
// ============================================
// registerCompletedResumedAgent - re-register a persisted agent as a completed card
// Location: cli_inner_pretty.js:454100-454123 ; adoption loop :688699
// ============================================

// ORIGINAL (for source lookup):
function Lgl(e, t) {
  let n = jw(e.agentId, "local_agent", e.description ?? "(resumed agent)", e.toolUseId),
    r = { ...n, type: "local_agent", status: "completed", agentId: e.agentId, /* ... */
          agentType: e.agentType ?? "general-purpose", /* ... */ };
  t.register(r);
}
// adoption loop (:688699): (await QKl(ho), Lgl(ho, Ye), zt.add(ho.agentId), gn.push(ho));

// READABLE (for understanding):
function registerCompletedResumedAgent(entry, registry) {
  let base = baseTaskFields(entry.agentId, "local_agent", entry.description ?? "(resumed agent)", entry.toolUseId);
  let record = { ...base, type: "local_agent", status: "completed", agentId: entry.agentId, /* ... */
                 agentType: entry.agentType ?? "general-purpose", /* ... */ };
  registry.register(record);
}

// Mapping: Lgl→registerCompletedResumedAgent, jw→baseTaskFields, QKl→linkAdoptedAgentTranscript, e→entry, t→registry
```

`Lgl`'s `agentType: e.agentType ?? "general-purpose"` and `description: e.description ?? "(resumed agent)"` defaults are exactly what produce a "general-purpose (resumed)" card when those fields are missing — which is what happens if the **main session** is fed through this adoption path without being recognized as `main-session`.

### The isolable signal: the `main-session` guard count 9 → 10

The top-level session is tagged `agentType:"main-session"` (`:441096`) precisely so it is **excluded** from subagent treatment. The filters that exclude it (`Kl(n) && n.agentType !== "main-session"`, `:453732`/`:453735`; and inside the carry-over predicate `fze`, `:578022`) gained one site in the window: `grep -c '"main-session"'` = **9** in 183 → **10** in 193. The added guard is consistent with the fix — recognizing the main session via `agentType:"main-session"` so backgrounding the main turn does **not** re-adopt/register it as a `general-purpose` subagent that re-runs the conversation.

### Honest limitation

The adoption machinery (`:688699` loop + `Lgl`) and the `main-session` sentinel are the right locus, and the 9→10 guard delta is real and isolable. But I could **not** byte-diff the exact added guard line against 183 (re-mangling), so the attribution is *corroborating*, not conclusive. **Confidence: MED** — anchors + count delta solid; exact patched line not pinned.

---

## 4. Bg-job cwd/resume metadata refresh after `/cd` and `/clear` (ISOLABLE; likely root of the pinned re-prompt fix, 2.1.193)

The resume prompt itself is still carryover: `getResumePrompt` (`WWn`, `:371461`) returns `process.env.CLAUDE_CODE_RESUME_PROMPT || "Continue from where you left off."`, and the two injection sites are still the interrupted-turn deserializer (`:371503`) and the print/headless deferred-tool auto-resume path (`:706889`). 183 has the same two surfaces (`zNn`, `:360198` / `:360237` / `:688092`). So the 2.1.193 "pinned bg agents re-prompted after auto-update" changelog item is **not** a change at the `WWn` call site.

What *is* isolable is a new bg-job metadata refresh layer that keeps the job's durable `state.json` in sync after directory/session resets. This is the first source-backed explanation for the prior low-confidence item: stale `cwd`, `originCwd`, `resumeSessionId`, or `linkScanPath` can make a resumed pinned job scan the wrong transcript boundary, which is exactly the class of bug that manifests as an unwanted synthetic "Continue..." on the next auto-resume/update cycle.

### bgJobMetadataRefresh

**What it does:** Updates the current background job's persisted cwd and resume/transcript pointers when the live session changes them.

**How it works:**
1. `/cd` calls `refreshBgJobCwdAfterCd` (`k3i`, `:193514`) after the chdir/transcript move succeeds (`:484488`).
2. `k3i` is bg-only: it exits unless `CLAUDE_JOB_DIR` exists and `CLAUDE_CODE_SESSION_KIND === "bg"` (`:193515-193516`).
3. It rereads the job state, preserves `originCwd` for worktree jobs, otherwise writes `{ cwd: currentCwd, originCwd: currentCwd, updatedAt }` (`:193518-193523`).
4. Conversation reset (`/clear` and equivalent flows) calls `refreshBgJobResumePointers` (`R3i`, `:193529`) after the new session id is minted (`:485419`).
5. `R3i` writes the new `{ resumeSessionId, linkScanPath, linkScanOffset: 0, updatedAt }` if either pointer changed (`:193533-193542`).
6. The classifier/state writer consumes the refreshed cwd via `currentBgCwdOverride` (`$Kr`, `:193511`) when writing `cwd` and non-worktree `originCwd` (`:465236`, `:465238`), so subsequent bg state reflects the live cwd rather than stale persisted state.

```javascript
// ============================================
// bgJobMetadataRefresh - keep bg job cwd and transcript pointers current
// Location: cli_inner_pretty.js:193511-193542, 484488, 485419, 465236-465238
// ============================================

// ORIGINAL (for source lookup):
function $Kr() { return x3i; }
async function k3i(e) {
  let t = Be.CLAUDE_JOB_DIR;
  if (!t || Be.CLAUDE_CODE_SESSION_KIND !== "bg") return;
  ((x3i = e), Bb(t));
  let n = await ji(t), r = n?.worktreePath ? n.originCwd : e;
  if (!n || (n.cwd === e && n.originCwd === r)) return;
  Bb(t);
  let o = (await ji(t)) ?? n;
  await Bd(t, { ...o, cwd: e, originCwd: o.worktreePath ? o.originCwd : e, updatedAt: new Date().toISOString() }).catch(Nf);
}
async function R3i(e, t) {
  let n = Be.CLAUDE_JOB_DIR;
  if (!n || Be.CLAUDE_CODE_SESSION_KIND !== "bg") return;
  Bb(n);
  let r = await ji(n);
  if (!r || (r.resumeSessionId === e && r.linkScanPath === t)) return;
  Bb(n);
  let o = (await ji(n)) ?? r;
  await Bd(n, { ...o, resumeSessionId: e, linkScanPath: t, linkScanOffset: 0, updatedAt: new Date().toISOString() }).catch(Nf);
}

// READABLE (for understanding):
function currentBgCwdOverride() { return currentBgCwd; }
async function refreshBgJobCwdAfterCd(currentCwd) {
  let jobDir = env.CLAUDE_JOB_DIR;
  if (!jobDir || env.CLAUDE_CODE_SESSION_KIND !== "bg") return;
  currentBgCwd = currentCwd;
  invalidateJobStateCache(jobDir);
  let state = await readJobState(jobDir);
  let expectedOrigin = state?.worktreePath ? state.originCwd : currentCwd;
  if (!state || (state.cwd === currentCwd && state.originCwd === expectedOrigin)) return;
  let latest = (await readJobState(jobDir)) ?? state;
  await writeJobState(jobDir, { ...latest, cwd: currentCwd, originCwd: latest.worktreePath ? latest.originCwd : currentCwd, updatedAt: now() });
}
async function refreshBgJobResumePointers(sessionId, transcriptPath) {
  let jobDir = env.CLAUDE_JOB_DIR;
  if (!jobDir || env.CLAUDE_CODE_SESSION_KIND !== "bg") return;
  invalidateJobStateCache(jobDir);
  let state = await readJobState(jobDir);
  if (!state || (state.resumeSessionId === sessionId && state.linkScanPath === transcriptPath)) return;
  let latest = (await readJobState(jobDir)) ?? state;
  await writeJobState(jobDir, { ...latest, resumeSessionId: sessionId, linkScanPath: transcriptPath, linkScanOffset: 0, updatedAt: now() });
}

// Mapping: $Kr->currentBgCwdOverride, k3i->refreshBgJobCwdAfterCd, R3i->refreshBgJobResumePointers, x3i->currentBgCwd, Bb->invalidateJobStateCache, ji->readJobState, Bd->writeJobState, Be->env
```

**Why this approach:**
- It updates the durable job state at the two points where the live session identity can diverge from the saved bg-job record: `/cd` changes cwd/origin cwd, while `/clear`/conversation reset changes session id and transcript path.
- It avoids reclassifying the whole job immediately. Instead it performs a narrow state write and lets the existing classifier consume the corrected fields on the next write.
- It preserves worktree `originCwd`, which is important because worktree jobs deliberately distinguish the worktree cwd from the original project root.

**Key insight:** The prompt string did not change; the state boundary did. 193 adds the missing "tell the bg job what session/transcript/cwd it now represents" updates, while 183 only changed the live process state. That is why the old low-confidence `WWn` explanation was too narrow.

### Before-picture and remaining limitation

In 183, the equivalent `/clear` reset body jumps directly from `await lX()` to `NW(...)` (`:476579`) with no bg job pointer refresh, and the classifier writes `cwd: T?.cwd ?? Pt()` plus `originCwd: T?.originCwd` (`:456715`, `:456717`). There is no `currentBgCwdOverride` equivalent in the re-read 183 window.

The literal **pin-specific UI guard** still does not isolate cleanly by searching `pinned`/`pin`: most matches belong to fleet-view ordering, notification pins, model pins, or the `pins.json` persistence layer. So this item is upgraded from "not isolable" to: **metadata-refresh fix isolated, pin-specific surface still inferred**. **Confidence: MED-HIGH** for the metadata mechanism; **LOW** for a direct `pinned` guard.

---

## 5. Agent panel hiding siblings / jumping a row (UI render mechanism bounded; exact patch line not isolated; 2.1.193 / 2.1.191)

The "agent panel hides sibling agents when viewing a subagent" (2.1.193) and "panel jumps a row past the overflow cap" (2.1.191) fixes live in the agents-panel render pipeline, not in background-agent state or transport. The earlier schema reference was only the `subagentStatusLine` settings schema; the verified panel region is the roster/detail UI cluster at `cli_inner_pretty.js:674539-678193`.

### Agent-panel child-row preservation

**What it does:** Converts a job's child artifacts into rows rendered inside the agents panel and detail/peek panel.

**How it works:**
1. The roster row passes `childRows: Xl.state.children ? dSc(Xl.state.children, x) : []` to `agentRosterRow` (`Qim`) at `cli_inner_pretty.js:678001`.
2. The detail/peek panel passes the currently focused job's memoized `childRows` into `agentPeekPanel` (`FSc`) at `cli_inner_pretty.js:678193`.
3. In 183, the equivalent mapper `JJl` first ran `.filter((n) => n.kind !== "frame")`, so frame children were removed before row rendering (`183:661843-661864`).
4. In 193, `mapAgentPanelChildRows` (`dSc`) maps every child. For `kind === "frame"`, it now creates a visible fallback row with `label: n.id`, no PR number, no status, no diff stats, and `color: "claude"` (`:674897-674910`).
5. The detail panel still enforces a terminal-height cap: it computes `qe = Math.max(cSc, Se - fe - Ne)`, takes `ct = l.slice(0, qe)`, and renders an `"N more"` row for the hidden tail (`:675425-675428`, `:675565-675568`).

**Why this approach:**
- Mapping frame children into normal row objects fixes the "siblings disappear" class without adding a separate branch to the row renderer. The rest of the panel can keep treating PR rows and frame rows as one `childRows` list.
- The overflow cap remains a render-time slice, which keeps the detail panel bounded by terminal height. That matches the 2.1.191 row-jump symptom, but the exact one-line patch for the jump is still not isolated from the large carried-over component.
- The artifact-column width helper changed in the same cluster: 183 `wBf` returned `0` when all children were frames (`183:661512-661521`), while 193 `measureChildArtifactWidth` (`Eim`) reserves fallback width using the generic artifact label (`:674539-674548`). This prevents frame-only child sets from collapsing the artifact column.

**Key insight:** The source-backed part is the child-row data shape, not a new background-agent state transition. 193 stops dropping frame children before rendering and gives frame-only child lists layout width, which explains the sibling/row-display class. The precise changelog patch line remains UI-only and not independently isolable, so confidence is **MED** for the bounded render mechanism and **LOW** for assigning the exact bullet to one line.

```javascript
// ============================================
// mapAgentPanelChildRows - Preserve frame children as visible panel rows
// Location: cli_inner_pretty.js:674897-674928
// ============================================

// ORIGINAL (for source lookup):
function dSc(e, t) {
  return Nim(
    e.map((n) => {
      if (n.kind === "frame")
        return { row: n, prNumber: void 0, label: n.id, status: [], diffStat: void 0, isDraft: !1, color: "claude", sortRank: 0 };
      let r = t.get(n.href), o = r ? aBn(r) : void 0;
      return { row: n, prNumber: r?.number ?? xSc(n), label: r?.title ?? "", status: r ? RSc(r) : [], diffStat: r && r.state !== "MERGED" && r.state !== "CLOSED" ? { additions: r.additions, deletions: r.deletions } : void 0, isDraft: r?.state === "DRAFT", color: r ? AVo(r) : void 0, sortRank: r?.state === "OPEN" && o ? (Oim[o] ?? 0) : 0 };
    }),
  );
}

// READABLE (for understanding):
function mapAgentPanelChildRows(children, pullRequestByHref) {
  return sortChildRows(
    children.map((child) => {
      if (child.kind === "frame") {
        return { row: child, prNumber: undefined, label: child.id, status: [], diffStat: undefined, isDraft: false, color: "claude", sortRank: 0 };
      }
      let pr = pullRequestByHref.get(child.href);
      let prState = pr ? classifyPullRequest(pr) : undefined;
      return {
        row: child,
        prNumber: pr?.number ?? extractPullRequestNumber(child),
        label: pr?.title ?? "",
        status: pr ? formatPullRequestStatus(pr) : [],
        diffStat: pr && pr.state !== "MERGED" && pr.state !== "CLOSED" ? { additions: pr.additions, deletions: pr.deletions } : undefined,
        isDraft: pr?.state === "DRAFT",
        color: pr ? pullRequestColor(pr) : undefined,
        sortRank: pr?.state === "OPEN" && prState ? (OPEN_PR_SORT_RANK[prState] ?? 0) : 0,
      };
    }),
  );
}

// Mapping: dSc->mapAgentPanelChildRows, e->children, t->pullRequestByHref, Nim->sortChildRows, aBn->classifyPullRequest, xSc->extractPullRequestNumber, RSc->formatPullRequestStatus, AVo->pullRequestColor, Oim->OPEN_PR_SORT_RANK
```

---

## 6. Channel connections dropping after `/bg` `/tui` `/update` (NOT ISOLABLE; bounded negative evidence, 2.1.187)

The "channel" is the live status path for `claude agents` / remote-agent updates. The agents-view toggle and the `/tui` / `/bg` slash handling are present, but the actual agents-channel teardown/reconnect on view navigation could not be isolated to a clean 193-specific patch.

### Agents status-channel boundary

**What it does:** Carries task status changes from the running session/supervisor into streaming clients and the `claude agents` view.

**How it works:**
1. The wire event is `system` / `task_updated`: schema at `cli_inner_pretty.js:700169` with a wire-safe patch subset (`status`, `description`, `end_time`, `total_paused_ms`, `error`, `is_backgrounded`).
2. The event sanitizer keeps only the public task id plus patch status for compact event views (`:702429-702432`).
3. The headless/streaming output filter explicitly allows `task_updated` through (`:705470-705475`), alongside `task_started`, `task_progress`, `notification`, and related system events.
4. The agents view carries liveness/status snapshots through open/attach state (`loopKicks`, `statuses`, `statusesTs` at `:677134-677171`), then uses `Date.now() - statusesTs < 1500 && statusForJob(...) !== void 0` as a `knownAlive` hint before respawning/reattaching (`:678593`).
5. The daemon control socket has update compatibility paths for stale clients and updated workers: reply without a control key gets the "older than the daemon (left open across an update?)" rejection (`:715740`), and attach can return `"job is restarting on the updated Claude Code; retry attach"` (`:715852`).

**Why this is still not isolated:**
- The same `task_updated`/status-snapshot/control-socket machinery exists in 183 (`183:683717`, `183:686725`, `183:663975-664012`, `183:665331`, `183:696483`, `183:696585`), so these are verified channel boundaries, not the patch itself.
- The obvious `EventSource` sites in the bundle are the **feature-gate / StatSig streaming SDK** (`/sub/<clientKey>`, `backgroundSync`), which is **unrelated** to the agents channel and **identical in 183** (`EventSource` count 4 = 4).
- The MCP/plugin `claude/channel` paths are also unrelated to the agents status channel; they handle plugin-origin messages and `--channels`, not `claude agents` task liveness.

**Key insight:** The fix should be looked for around `task_updated` delivery, status-snapshot freshness, or daemon-control reconnect semantics, not in `EventSource` or MCP plugin channels. The boundary is now source-bounded, but the exact 2.1.187 patch line remains unisolated. **Confidence: MED for the channel boundary / LOW for the exact patch.**

---

## Evidence summary

| # | Item | Version | 183→193 signal | Class | Confidence |
|---|------|---------|----------------|-------|:----------:|
| 1 | carry-over-aware abandoned count | 2.1.193 | "would be abandoned" 0→present; `oUo = total − H7t` | ISOLABLE | HIGH |
| 2 | bg launch result drops "end your response" | 2.1.193 | both async_launched branches lose the directive (cloud unchanged) | ISOLABLE body-change | HIGH |
| 3 | phantom "general-purpose (resumed)" subagent | 2.1.193 | `main-session` guard 9→10; `Lgl` defaults | PARTIAL | MED |
| 4 | bg-job cwd/resume metadata refresh (likely pinned re-prompt root) | 2.1.193 | `k3i`/`R3i` 193-only call sites; `WWn` unchanged | ISOLABLE mechanism / pin-specific inferred | MED-HIGH |
| 5 | panel hides siblings / jumps a row | 2.1.193/191 | `dSc` maps frame children; `Eim` reserves frame-only artifact width; exact bullet line not isolated | UI render | MED for mechanism / LOW for exact line |
| 6 | channel drops after `/bg /tui /update` | 2.1.187 | `task_updated` event/status snapshots/control-socket update paths bounded; exact patch not isolated | NOT ISOLABLE | MED for boundary / LOW for exact line |

---

## Cross-links

- Sibling 193 docs: [`bg_shell_pressure_reap.md`](./bg_shell_pressure_reap.md), [`subagent_depth_tracking.md`](./subagent_depth_tracking.md), [`agent_stop_lifecycle.md`](./agent_stop_lifecycle.md), [`README.md`](./README.md).
- 183 tree (canonical for the unchanged `/bg` flow, dispatcher, classifier, and agents-view): [`../../../claude_code_v_2.1.183/analyze/36_background_agents/README.md`](../../../claude_code_v_2.1.183/analyze/36_background_agents/README.md); `/bg` flow baseline [`../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md).

## Related Symbols

> Symbol mappings live in the symbol index files (list format, never a mapping table):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)
> - per-feature additions: [symbol_additions_v2_1_193_background_agents.md](../00_overview/symbol_additions_v2_1_193_background_agents.md)

Key functions/constants in this document:

- `countAbandonedBgTasks` (obf: `oUo`, `:578073`) — `countBackgroundTasks − countCarryOverTasks`; the spurious-warning fix.
- `computeCarryOverMap` (obf: `fze`, `:578006`) — per-subtree all-or-nothing adoptability map.
- `countCarryOverTasks` (obf: `H7t`, `:578070`) / `countBackgroundTasks` (obf: `y_t`, `:485964`) — the two count inputs.
- `registerCompletedResumedAgent` (obf: `Lgl`, `:454100`) — source of the "general-purpose (resumed)" card defaults.
- `readJobDir` (obf: `JKl`, `:577927`) / `linkAdoptedAgentTranscript` (obf: `QKl`, `:577951`) — the adoption loop helpers (`:688699`).
- `getResumePrompt` (obf: `WWn`, `:371461`) — `"Continue from where you left off."`; carryover prompt surface.
- `currentBgCwdOverride` (obf: `$Kr`, `:193511`) / `refreshBgJobCwdAfterCd` (obf: `k3i`, `:193514`) / `refreshBgJobResumePointers` (obf: `R3i`, `:193529`) — 193-only bg-job metadata refresh after `/cd` and conversation reset.
- `main-session` sentinel (`:441096`; filters `:453732`/`:453735`/`:578022`) — guard count 9→10 across the window.
