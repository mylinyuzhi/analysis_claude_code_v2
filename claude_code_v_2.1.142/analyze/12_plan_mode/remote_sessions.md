# Plan Mode in Remote Sessions (v2.1.142)

> Plan-mode persistence across container restarts and forked sessions. The v2.1.91-era container-restart resilience and v2.1.101-era Ultraplan UX gating carry over unchanged into v2.1.142. This document also captures how the v2.1.132 --permission-mode resume fix interacts with remote sessions.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_plan_mode.md](../00_overview/symbol_additions_v2_1_142_plan_mode.md) — Symbol discoveries for this unit
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Existing plan-mode references

Key functions in this document:
- `getPlanFilePath` (obfuscated: `v2`) — Slug-anchored plan path (re-resolved per call), `cli_inner_pretty.js:517657`
- `getPlan` (obfuscated: `HW`) — Disk read, `cli_inner_pretty.js:517662`
- `getPlanSlug` (obfuscated: `PDH`) — Lazy slug generator with collision retry, `cli_inner_pretty.js:517632`
- `setPlanSlug` (obfuscated: `tg6`) — Plant a slug for a session on resume, `cli_inner_pretty.js:517651`
- `copyPlanForResume` (obfuscated: `RA8`) — Plan recovery on `--resume`, `cli_inner_pretty.js:517674`
- `copyPlanForFork` (obfuscated: `$y4`) — Plan copy for forked session, `cli_inner_pretty.js:517700`
- `recoverPlanFromMessages` (obfuscated: `ox5`) — Salvage plan from transcript, `cli_inner_pretty.js:517714`
- `findFileSnapshotEntry` (obfuscated: `ax5`) — Locate file-snapshot system message, `cli_inner_pretty.js:517742`
- `persistFileSnapshotIfRemote` (obfuscated: `u38`) — Mirror plan to transcript (remote only), `cli_inner_pretty.js:517750`
- `getEnvironmentKind` (obfuscated: `$r$`) — Detects CCR vs local environment
- `restoreFromTranscriptPermissionMode` (obfuscated: `ur5`) — Resume-time mode filter, `cli_inner_pretty.js:564219`

---

## Container Restart Resilience (carried over from v2.1.91)

### The Bug

In remote (CCR) sessions, the underlying container can be restarted by the platform — for example, on memory pressure or after an idle interval. When it restarts, the container's filesystem is a *new ephemeral volume*. The previous session's plan file is gone.

Before the v2.1.91 fix, the local CLI cached the plan file path at session-start, then served that cached path to:
- The plan-approval modal (renders the plan from the path)
- File-edit permission prompts (asks "may I edit `<path>`?")
- The model itself (the plan-mode system prompt embeds the path)

After a restart, all three referenced a path that no longer existed.

### The Fix (preserved in v2.1.142)

Two changes were applied. The first is surface-level cache removal — `getPlanFilePath` re-resolves the slug on every call. The second is more interesting: a **transcript-mirrored snapshot** of the plan file that survives container restarts.

#### Surface-level: Re-resolve on every access

```javascript
// ============================================
// getPlanFilePath - Per-call slug-anchored path resolution
// Location: cli_inner_pretty.js:517657-517661
// ============================================

// ORIGINAL (for source lookup):
function v2(H) {
  let $ = PDH(v$());
  if (!H) return oB.join(SO(), `${$}.md`);
  return oB.join(SO(), `${$}-agent-${H}.md`);
}

// READABLE (for understanding):
function getPlanFilePath(agentId) {
  const planSlug = getPlanSlug(getSessionId());  // re-resolves each call
  if (!agentId) return path.join(getPlansDirectory(), `${planSlug}.md`);
  return path.join(getPlansDirectory(), `${planSlug}-agent-${agentId}.md`);
}

// Mapping: v2→getPlanFilePath, H→agentId, $→planSlug, PDH→getPlanSlug,
//          v$→getSessionId, oB→path, SO→getPlansDirectory
```

`getPlanSlug` (`PDH`) is memoized inside its own Map cache (`getPlanSlugCache`), not via a top-level cached path. After a restart the Map is empty; `getPlanSlug` regenerates the slug from the same `(sessionId, promptSeed)` inputs. Since `promptSeed` derives from a deterministic source (the prompt), the regenerated slug is the same — UNLESS the prompt seed has been lost (which leads us to the second part of the fix).

#### Transcript-mirrored snapshot: `persistFileSnapshotIfRemote`

```javascript
// ============================================
// persistFileSnapshotIfRemote - Mirror plan to transcript on every change
// Location: cli_inner_pretty.js:517750-517772
// ============================================

// ORIGINAL (for source lookup):
async function u38() {
  if ($r$() === null) return;
  try {
    let H = [], $ = HW();
    if ($) H.push({ key: "plan", path: v2(), content: $ });
    if (H.length === 0) return;
    let q = {
      type: "system", subtype: "file_snapshot",
      content: "File snapshot", level: "info", isMeta: !0,
      timestamp: new Date().toISOString(),
      uuid: eE4.randomUUID(),
      snapshotFiles: H,
    },
    { recordTranscript: K } = await Promise.resolve().then(() => (Z4(), CK8));
    await K([q]);
  } catch (H) { EH(H); }
}

// READABLE (for understanding):
async function persistFileSnapshotIfRemote() {
  if (getEnvironmentKind() === null) return;  // local-only: skip (file on disk is durable)
  try {
    const snapshotFiles = [];
    const plan = getPlan();
    if (plan) {
      snapshotFiles.push({ key: 'plan', path: getPlanFilePath(), content: plan });
    }
    if (snapshotFiles.length === 0) return;
    const message = {
      type: 'system',
      subtype: 'file_snapshot',
      content: 'File snapshot',
      level: 'info',
      isMeta: true,
      timestamp: new Date().toISOString(),
      uuid: crypto.randomUUID(),
      snapshotFiles,
    };
    const { recordTranscript } = await import('./sessionStorage.js');
    await recordTranscript([message]);
  } catch (error) {
    logError(error);
  }
}

// Mapping: u38→persistFileSnapshotIfRemote, $r$→getEnvironmentKind, HW→getPlan,
//          v2→getPlanFilePath, eE4→crypto, EH→logError, Z4→dynamic sessionStorage import
```

### Algorithm: Why mirror to transcript?

**What it does:** Whenever the plan file is written or edited, append a `system` message of subtype `file_snapshot` to the transcript carrying the full plan content.

**Why:**
1. **Container-restart resilience**: The container's filesystem is ephemeral, but the transcript is durable. After a restart, the local CLI can rebuild the plan file from the most recent `file_snapshot` system message.
2. **Compaction resilience**: If auto-compaction summarizes away the plan, the snapshot message (marked `isMeta: true`) is preserved.
3. **Recovery as fallback**: If the snapshot is missing (e.g., the plan was written before snapshot machinery existed), `recoverPlanFromMessages` scans the transcript for tool_use input, `user.planContent`, or `plan_file_reference` attachments.

**Gated by `getEnvironmentKind() === null`:** Snapshot is suppressed in local sessions. Local plan files are durable; mirroring would just bloat the transcript.

**Fire-and-forget:** Called as `void persistFileSnapshotIfRemote()` (no await) so the producing write doesn't block on the snapshot recording.

---

## Plan Recovery on Resume

`copyPlanForResume` (`RA8`) is the entry point on `--resume` / `--continue`:

```javascript
// ============================================
// copyPlanForResume - Restore plan slug + content on session resume
// Location: cli_inner_pretty.js:517674-517699
// ============================================

// ORIGINAL (for source lookup):
async function RA8(H, $) {
  let q = Hy4(H);
  if (!q) return !1;
  let K = $ ?? v$();
  tg6(K, q);
  let _ = oB.join(SO(), `${q}.md`);
  try {
    return (await C$().readFile(_, { encoding: "utf-8" }), !0);
  } catch (A) {
    if (!f8(A)) return (EH(A), !1);
    if ($r$() === null) return !1;
    N(`Plan file missing during resume: ${_}. Attempting recovery.`);
    let z = ax5(H.messages, "plan"), Y = null;
    if (z && z.content.length > 0)
      ((Y = z.content), N(`Plan recovered from file snapshot, ${Y.length} chars`, { level: "info" }));
    else if (((Y = ox5(H)), Y))
      N(`Plan recovered from message history, ${Y.length} chars`, { level: "info" });
    if (Y) {
      try {
        return (await _W8.writeFile(_, Y, { encoding: "utf-8" }), !0);
      } catch (f) { return (EH(f), !1); }
    }
    return (N("Plan file recovery failed: no file snapshot or plan content found in message history"), !1);
  }
}

// READABLE (for understanding):
async function copyPlanForResume(log, targetSessionId) {
  const slug = getSlugFromLog(log);
  if (!slug) return false;
  const sessionId = targetSessionId ?? getSessionId();
  setPlanSlug(sessionId, slug);  // Plant the slug for this session
  const planPath = path.join(getPlansDirectory(), `${slug}.md`);
  try {
    await getFsImplementation().readFile(planPath, { encoding: 'utf-8' });
    return true;  // file present; nothing to recover
  } catch (e) {
    if (!isENOENT(e)) {
      logError(e);
      return false;
    }
    if (getEnvironmentKind() === null) return false;  // local-only, no recovery infrastructure
    logForDebugging(`Plan file missing during resume: ${planPath}. Attempting recovery.`);
    // 1. Try most-recent file_snapshot system message
    const snapshotEntry = findFileSnapshotEntry(log.messages, 'plan');
    let recovered = null;
    if (snapshotEntry && snapshotEntry.content.length > 0) {
      recovered = snapshotEntry.content;
      logForDebugging(`Plan recovered from file snapshot, ${recovered.length} chars`, { level: 'info' });
    } else {
      // 2. Fall back to scanning message history
      recovered = recoverPlanFromMessages(log);
      if (recovered) {
        logForDebugging(`Plan recovered from message history, ${recovered.length} chars`, { level: 'info' });
      }
    }
    if (recovered) {
      try {
        await fsPromises.writeFile(planPath, recovered, { encoding: 'utf-8' });
        return true;
      } catch (e) {
        logError(e);
        return false;
      }
    }
    logForDebugging('Plan file recovery failed: no file snapshot or plan content found in message history');
    return false;
  }
}

// Mapping: RA8→copyPlanForResume, H→log, $→targetSessionId, q→slug, K→sessionId, _→planPath,
//          z→snapshotEntry, Y→recovered, Hy4→getSlugFromLog, tg6→setPlanSlug,
//          ax5→findFileSnapshotEntry, ox5→recoverPlanFromMessages, $r$→getEnvironmentKind,
//          f8→isENOENT, EH→logError, N→logForDebugging, C$→getFsImplementation, _W8→fs.promises
```

### Algorithm: 2-Tier Recovery

**What it does:** Restore the plan file content on resume from one of two sources, preferring the more recent.

**Tier 1: `findFileSnapshotEntry`** — scans backwards through messages for a `system` message with `subtype: 'file_snapshot'` and a `snapshotFiles` entry keyed by `'plan'`. This is the v2.1.91 mechanism: incremental snapshots written during the original session.

**Tier 2: `recoverPlanFromMessages`** — scans backwards for one of:
- `assistant` tool_use blocks with name `ExitPlanMode` and `input.plan` (the SDK-shape input)
- `user` messages with `planContent` field (set during the "clear context + implement" flow)
- `attachment` messages with `attachment.type === 'plan_file_reference'` and `planContent` (set by auto-compact to preserve the plan across compaction boundaries)

The recovery routine returns the first non-empty match. Writing the recovered content back to disk re-establishes the file. The slug was already planted via `setPlanSlug(sessionId, slug)` at the top of `copyPlanForResume`, so subsequent calls to `getPlanFilePath` resolve to the same path.

### Algorithm: `recoverPlanFromMessages` (ox5)

```javascript
// ============================================
// recoverPlanFromMessages - Salvage plan content from any message source
// Location: cli_inner_pretty.js:517714-517741
// ============================================

// ORIGINAL (for source lookup):
function ox5(H) {
  for (let $ = H.messages.length - 1; $ >= 0; $--) {
    let q = H.messages[$];
    if (!q) continue;
    if (q.type === "assistant") {
      let { content: K } = q.message;
      if (Array.isArray(K))
        for (let _ of K)
          if (_.type === "tool_use" && _.name === NZ) {
            let z = _.input?.plan;
            if (typeof z === "string" && z.length > 0) return z;
          }
    }
    if (q.type === "user") {
      let K = q;
      if (typeof K.planContent === "string" && K.planContent.length > 0) return K.planContent;
    }
    if (q.type === "attachment") {
      let K = q;
      if (K.attachment?.type === "plan_file_reference") {
        let _ = K.attachment.planContent;
        if (typeof _ === "string" && _.length > 0) return _;
      }
    }
  }
  return null;
}

// READABLE (for understanding):
function recoverPlanFromMessages(log) {
  // Scan from most-recent to oldest
  for (let i = log.messages.length - 1; i >= 0; i--) {
    const msg = log.messages[i];
    if (!msg) continue;
    // Source A: ExitPlanMode tool_use input.plan
    if (msg.type === 'assistant') {
      const { content } = msg.message;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === 'tool_use' && block.name === EXIT_PLAN_MODE_V2_TOOL_NAME) {
            const plan = block.input?.plan;
            if (typeof plan === 'string' && plan.length > 0) return plan;
          }
        }
      }
    }
    // Source B: user.planContent (set during "clear context + implement")
    if (msg.type === 'user') {
      if (typeof msg.planContent === 'string' && msg.planContent.length > 0) {
        return msg.planContent;
      }
    }
    // Source C: plan_file_reference attachment (auto-compact preservation)
    if (msg.type === 'attachment') {
      if (msg.attachment?.type === 'plan_file_reference') {
        const plan = msg.attachment.planContent;
        if (typeof plan === 'string' && plan.length > 0) return plan;
      }
    }
  }
  return null;
}

// Mapping: ox5→recoverPlanFromMessages, H→log, $→i, q→msg, K/_/z→inner vars, NZ→EXIT_PLAN_MODE_V2_TOOL_NAME
```

### Why three sources?

1. **`assistant` tool_use input.plan** — the SDK-shape input injected by `normalizeToolInput`. Persists in the transcript indefinitely.
2. **`user.planContent`** — set by the "clear context + implement" flow when ExitPlanMode is approved with the `/clear` option. This survives a context clear because the planContent is attached to the new seed user message.
3. **`plan_file_reference` attachment** — created by auto-compact (`cli_inner_pretty.js:408120-408150`) to preserve the plan across compaction boundaries. The attachment is `isMeta: true`-style and gets compaction-immunity treatment.

The scan is reverse-chronological so the most-recent source wins. This handles cases where the plan was edited mid-session: the edited version (in a later message) takes precedence over the original.

---

## Forked Session Recovery

`copyPlanForFork` (`$y4`) handles `--fork-session` paths:

```javascript
// ============================================
// copyPlanForFork - Copy plan to a new session with a new slug
// Location: cli_inner_pretty.js:517700-517713
// ============================================

// ORIGINAL (for source lookup):
async function $y4(H, $) {
  let q = Hy4(H);
  if (!q) return !1;
  let K = SO(), _ = oB.join(K, `${q}.md`),
    A = PDH($), z = oB.join(K, `${A}.md`);
  try {
    return (await _W8.copyFile(_, z), !0);
  } catch (Y) {
    if (f8(Y)) return !1;
    return (EH(Y), !1);
  }
}

// READABLE (for understanding):
async function copyPlanForFork(log, targetSessionId) {
  const originalSlug = getSlugFromLog(log);
  if (!originalSlug) return false;
  const plansDir = getPlansDirectory();
  const originalPath = path.join(plansDir, `${originalSlug}.md`);
  const newSlug = getPlanSlug(targetSessionId);  // generates fresh slug for fork
  const newPath = path.join(plansDir, `${newSlug}.md`);
  try {
    await fsPromises.copyFile(originalPath, newPath);
    return true;
  } catch (e) {
    if (isENOENT(e)) return false;
    logError(e);
    return false;
  }
}

// Mapping: $y4→copyPlanForFork, H→log, $→targetSessionId, q→originalSlug, K→plansDir,
//          _→originalPath, A→newSlug, z→newPath, Hy4→getSlugFromLog, SO→getPlansDirectory,
//          PDH→getPlanSlug, _W8→fs.promises, oB→path, f8→isENOENT, EH→logError
```

### Algorithm: Why a NEW slug for forks?

**What it does:** Forked sessions get a fresh slug; the original plan content is copied to the new path.

**Why:**
- A fork is a *parallel* session, not a continuation. The original session may still be running. If both sessions wrote to the same plan file, they'd clobber each other's edits.
- The new slug is derived from the new session ID (via `getPlanSlug(targetSessionId)`). The plan content is identical, but the file is distinct.

**Trade-off:** Forking duplicates the plan on disk. For small plans this is fine. For very large plans (>50KB), it's still negligible because `~/.claude/plans/` is per-user storage.

---

## v2.1.132 Resume + --permission-mode + Remote

The v2.1.132 fix interacts with remote sessions in a specific way: when `--resume <id> --permission-mode plan` is used and the session being resumed is a remote (CCR) session, the local CLI:

1. Plants the slug from the resumed transcript via `setPlanSlug(sessionId, slug)`.
2. Recovers the plan file via `copyPlanForResume` (using the 2-tier recovery if the disk file is missing).
3. Applies the CLI permission mode (`plan` in this example) instead of the transcript-saved mode.
4. The CCR sends a `control_request: { subtype: "set_permission_mode", mode: "plan" }` to align the remote session's mode with the local override.

**Mechanism:** `ur5(transcript.permissionMode, cliSet)` short-circuits to return `undefined` when `cliSet === true`, so the transcript-saved mode is dropped. The CLI permission mode flows through `zR6` (computes the initial mode from CLI/env/settings) and lands on the session's `toolPermissionContext.mode`.

See [permission_mode_persistence.md](./permission_mode_persistence.md) for the full sequence.

---

## v2.1.112 → v2.1.142 Diff Summary

| Aspect | v2.1.112 | v2.1.142 | Status |
|--------|----------|----------|--------|
| `getPlanFilePath` re-resolves slug per call | yes | yes | Identical |
| `persistFileSnapshotIfRemote` on plan writes | yes | yes | Identical |
| `copyPlanForResume` 2-tier recovery (snapshot + message scan) | yes | yes | Identical |
| `copyPlanForFork` generates fresh slug | yes | yes | Identical |
| `recoverPlanFromMessages` 3 sources | yes | yes | Identical |
| `getEnvironmentKind` gate (local skips snapshot/recovery) | yes | yes | Identical |
| `setPlanSlug` planted from transcript on resume | yes | yes | Identical |
| `--permission-mode` flag interaction on resume | Lost to transcript mode | CLI flag wins (NEW) | **v2.1.132 fix** |

The recovery and persistence mechanisms are unchanged. The only relevant v2.1.132 change is how `--permission-mode` interacts with the resume path; the recovery itself is identical.

---

## Related

- [plan_file_naming.md](./plan_file_naming.md) — slug generation and slug cache
- [implementation.md](./implementation.md) — lifecycle including `persistFileSnapshotIfRemote` triggers
- [permission_mode_persistence.md](./permission_mode_persistence.md) — v2.1.132 resume fix details
- [ultraplan_integration.md](./ultraplan_integration.md) — remote CCR-specific Ultraplan flow
