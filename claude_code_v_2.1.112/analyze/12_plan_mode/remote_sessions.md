# Plan Mode in Remote Sessions (v2.1.112)

> Two changelog-driven topics: the **v2.1.91** fix for plan-mode resilience across container restarts ("plan mode in remote sessions losing track of the plan file after a container restart"), and the **v2.1.101** UX fix that hides the "Refine with Ultraplan" option when an org cannot reach Claude Code on the web. Both are visible in the v2.1.112 obfuscated source.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_02.md](../00_overview/symbol_additions_unit_02.md) — Symbol discoveries for this unit
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Existing plan-mode references

Key functions in this document:
- `getPlanFilePath` (`eW`) — Slug-anchored plan path (re-resolved per call), chunks.97.mjs:1612
- `getPlan` (`lP`) — Disk read, chunks.97.mjs:1618
- `getPlanSlug` (`g56`) — Lazy slug generator with collision retry, chunks.97.mjs (~1590)
- `setPlanSlug` (`jn1`) — Plant a slug for a session on resume, chunks.97.mjs:1604
- `copyPlanForResume` (`Fb8`) — Plan recovery on `--resume`, chunks.97.mjs:1634-1665
- `copyPlanForFork` (`DR4`) — Plan copy for forked session, chunks.97.mjs:1667-1680
- `recoverPlanFromMessages` (`rJz`) — Salvage plan from transcript, chunks.97.mjs:1682-1711
- `findFileSnapshotEntry` (`oJz`) — Locate file-snapshot system message, chunks.97.mjs:1713-1719
- `persistFileSnapshotIfRemote` (`gb8`) — Mirror plan to transcript (remote only), chunks.97.mjs:1721-1748
- `getEnvironmentKind` (`mb8`) — Detects CCR vs local environment
- `isUltraplanAvailable` (`hn`) — Combined gate, chunks.183.mjs:1066
- `isRemoteControlAvailable` (`mx`) — CCR bridge predicate, chunks.115.mjs:2513

---

## v2.1.91: Container Restart Resilience

### The Bug

In remote (CCR) sessions, the underlying container can be restarted by the platform — for example, on memory pressure or after an idle interval. When it restarts, the container's filesystem is a *new ephemeral volume*. The previous session's plan file is gone.

Before v2.1.91 the local CLI cached the plan file path at session-start, then served that cached path to:
- The plan-approval modal (renders the plan from the path)
- File-edit permission prompts (asks "may I edit `<path>`?")
- The model itself (the plan-mode system prompt embeds the path)

After a restart, all three referenced a path that no longer existed. The user would see:
- An empty plan-approval modal (file read returned nothing)
- A "may I edit this strange unrecognised file?" prompt for every plan-file edit
- The model confused about its own plan

### The Fix

Two changes were applied. The first is the surface-level cache removal — `getPlanFilePath` re-resolves the slug on every call. The second is more interesting: a **transcript-mirrored snapshot** of the plan file that survives container restarts.

#### Surface-level: Re-resolve on every access

```javascript
// ============================================
// getPlanFilePath - Per-call slug-anchored path resolution
// Location: chunks.97.mjs:1612-1616
// ============================================

// ORIGINAL (for source lookup):
function eW(q) {
    let K = g56(I8());
    if (!q) return F56(aO(), `${K}.md`);
    return F56(aO(), `${K}-agent-${q}.md`)
}

// READABLE (for understanding):
function getPlanFilePath(agentId) {
    const slug = getPlanSlug(getSessionId());   // re-resolved each call
    if (!agentId) return path.join(getPlansDirectory(), `${slug}.md`);
    return path.join(getPlansDirectory(), `${slug}-agent-${agentId}.md`);
}

// Mapping: eW→getPlanFilePath, g56→getPlanSlug, I8→getSessionId, F56→path.join, aO→getPlansDirectory
```

The structure deliberately does *not* cache. `getPlanSlug` reads from `getPlanSlugCache()` (a `Map<SessionId, string>`), and `getPlansDirectory` is memoised by `memoize`. But the *composition* runs every call. The marginal cost of two map lookups and a string concat per call is trivial; the bug it prevents is severe.

#### Deep fix: Transcript-mirrored file snapshot

```javascript
// ============================================
// persistFileSnapshotIfRemote - Mirror plan content to transcript
// Location: chunks.97.mjs:1721-1748
// ============================================

// ORIGINAL (for source lookup):
async function gb8() {
    if (mb8() === null) return;
    try {
        let q = [], K = lP();
        if (K) q.push({ key: "plan", path: eW(), content: K });
        if (q.length === 0) return;
        let _ = {
                type: "system",
                subtype: "file_snapshot",
                content: "File snapshot",
                level: "info",
                isMeta: !0,
                timestamp: new Date().toISOString(),
                uuid: QJz(),
                snapshotFiles: q
            },
            { recordTranscript: z } = await Promise.resolve().then(() => (g4(), Ub8));
        await z([_])
    } catch (q) { j6(q) }
}

// READABLE (for understanding):
async function persistFileSnapshotIfRemote() {
    // Local sessions persist plan files in ~/.claude/plans — no need to mirror.
    if (getEnvironmentKind() === null) return;
    try {
        const snapshotFiles = [];
        const plan = getPlan();
        if (plan) snapshotFiles.push({ key: "plan", path: getPlanFilePath(), content: plan });
        if (snapshotFiles.length === 0) return;

        const message = {
            type: "system",
            subtype: "file_snapshot",
            content: "File snapshot",
            level: "info",
            isMeta: true,
            timestamp: new Date().toISOString(),
            uuid: randomUUID(),
            snapshotFiles,
        };
        const { recordTranscript } = await import("./sessionStorage.js");
        await recordTranscript([message]);
    } catch (e) { logError(e); }
}

// Mapping: gb8→persistFileSnapshotIfRemote, mb8→getEnvironmentKind, lP→getPlan, eW→getPlanFilePath,
//          j6→logError, QJz→randomUUID
```

### Algorithm Deep Dive: File-snapshot mirroring

**What it does:** Records the current plan file's content as a system message in the durable transcript, but only in remote sessions.

**How it works:**
1. Check `getEnvironmentKind()` — returns the CCR environment descriptor or `null` for local runs. Local sessions skip mirroring entirely (the plan file persists in `~/.claude/plans` across CLI restarts; mirroring would be redundant).
2. Read the current plan from disk via `getPlan()`. If the file doesn't exist or is empty, skip (no useful snapshot to record).
3. Build a `SystemFileSnapshotMessage` with:
   - `subtype: "file_snapshot"` — discriminator the resume path checks for
   - `key: "plan"` — array entry key (the helper supports multiple files, e.g., plan + todos, in the same snapshot)
   - `path: getPlanFilePath()` — current path (used for restoration target)
   - `content: <full text>` — the actual plan
   - `isMeta: true` — does not contribute to model context tokens
4. Dynamically import `sessionStorage.js` to break a possible circular dependency at module-load time.
5. Append the message via `recordTranscript`.

**When is it called?**
- Inside `ExitPlanModeV2Tool.call()` when the user edits the plan via Ctrl+G in the modal (the disk write needs to be reflected in the transcript so a subsequent restart can recover the edit). See chunks.150.mjs:2168.
- Indirectly via `normalizeToolInput` during the api.ts request preparation — before permission, the plan content is snapshotted so even a pre-permission crash leaves a recoverable copy.

**Why this approach:**
- The transcript is the *only* surface that survives a container restart (the platform persists transcripts in user storage, files in container storage).
- Encoding the plan as a `system` message with `isMeta: true` means it doesn't pollute the model's context — the model reads from the file, the recovery path reads from the transcript.
- Keeping the snapshot as an *append-only* event preserves edit history if needed for debugging.

**Trade-offs:**
- Storage cost: a 5 KB plan creates a 5 KB transcript entry on every Ctrl+G edit. For active editing sessions this can add up, but is bounded (the model isn't writing megabytes).
- Race: between disk write and snapshot record, a crash could leave the disk ahead of the transcript. Acceptable — the next ExitPlanMode call will re-snapshot.

**Key insight:** The function is a no-op in local sessions. This is critical for cost — local users would pay token-overhead for a feature they don't need. The CCR gate is the discriminator.

---

### Algorithm Deep Dive: copyPlanForResume — Recovery on `--resume`

```javascript
// ============================================
// copyPlanForResume - Restore plan file on session resume
// Location: chunks.97.mjs:1634-1665
// ============================================

// READABLE (for understanding):
async function copyPlanForResume(log, targetSessionId) {
    const slug = getSlugFromLog(log);
    if (!slug) return false;

    const sessionId = targetSessionId ?? getSessionId();
    setPlanSlug(sessionId, slug);

    const planPath = path.join(getPlansDirectory(), `${slug}.md`);
    try {
        await getFsImplementation().readFile(planPath, { encoding: "utf-8" });
        return true;                                   // file present — done
    } catch (e) {
        if (!isENOENT(e)) { logError(e); return false; }

        // Only attempt recovery in remote sessions (local files don't evaporate)
        if (getEnvironmentKind() === null) return false;
        logForDebugging(`Plan file missing during resume: ${planPath}. Attempting recovery.`);

        // 1) Try the file-snapshot system messages (the v2.1.91 fix)
        const snapshot = findFileSnapshotEntry(log.messages, "plan");
        let recovered = null;
        if (snapshot && snapshot.content.length > 0) {
            recovered = snapshot.content;
            logForDebugging(`Plan recovered from file snapshot, ${recovered.length} chars`, { level: "info" });
        } else {
            // 2) Fallback: scan message history for plan content
            recovered = recoverPlanFromMessages(log);
            if (recovered) logForDebugging(`Plan recovered from message history, ${recovered.length} chars`, { level: "info" });
        }

        if (recovered) {
            try {
                await writeFile(planPath, recovered, { encoding: "utf-8" });
                return true;
            } catch (writeErr) { logError(writeErr); return false; }
        }
        logForDebugging("Plan file recovery failed: no file snapshot or plan content found in message history");
        return false;
    }
}

// Mapping: Fb8→copyPlanForResume, WR4→getSlugFromLog, I8→getSessionId, jn1→setPlanSlug,
//          F56→path.join, aO→getPlansDirectory, V8→getFsImplementation, t1→isENOENT,
//          j6→logError, mb8→getEnvironmentKind, E→logForDebugging,
//          oJz→findFileSnapshotEntry, rJz→recoverPlanFromMessages
```

### Algorithm Deep Dive: Three-tier recovery strategy

**What it does:** When resuming a session in a remote environment after a container restart, restores the plan file from the most reliable source available.

**How it works (in priority order):**

1. **Disk read.** If the file still exists at the slug-anchored path, do nothing. Most resumes (no restart) hit this branch.

2. **File-snapshot system messages.** Scan the message history backwards for a `system` message with `subtype: "file_snapshot"` containing a `key: "plan"` entry. This is the path created by `persistFileSnapshotIfRemote` and is the **canonical** recovery source — the snapshot has the full file content as-of the last edit/write.

3. **Message history scan.** As a last resort, scan all messages for plan content embedded in:
   - `tool_use` blocks named `ExitPlanMode` (the model's tool call carried the plan in `input.plan` if normalizeToolInput injected it before serialisation)
   - User messages with a `planContent` field (set by the "clear context + execute" flow)
   - `plan_file_reference` attachments (created by auto-compact to preserve plans across compaction)

```javascript
// ============================================
// recoverPlanFromMessages - Three-source message scan
// Location: chunks.97.mjs:1682-1711
// ============================================

// READABLE:
function recoverPlanFromMessages(log) {
    for (let i = log.messages.length - 1; i >= 0; i--) {
        const msg = log.messages[i];
        if (!msg) continue;

        if (msg.type === "assistant") {
            const { content } = msg.message;
            if (Array.isArray(content)) {
                for (const block of content) {
                    if (block.type === "tool_use" && block.name === EXIT_PLAN_MODE_V2_TOOL_NAME) {
                        const plan = block.input?.plan;
                        if (typeof plan === "string" && plan.length > 0) return plan;
                    }
                }
            }
        }

        if (msg.type === "user") {
            if (typeof msg.planContent === "string" && msg.planContent.length > 0) return msg.planContent;
        }

        if (msg.type === "attachment") {
            if (msg.attachment?.type === "plan_file_reference") {
                const plan = msg.attachment.planContent;
                if (typeof plan === "string" && plan.length > 0) return plan;
            }
        }
    }
    return null;
}
```

**Why this approach:**
- The file-snapshot path covers the common case (any session that called `persistFileSnapshotIfRemote` will succeed cleanly).
- The message-scan fallback covers older sessions that predate the file-snapshot feature, or edge cases (e.g., the snapshot record was truncated by transcript compaction).
- The fallback also catches plan content that arrived via `auto-compact` (which creates `plan_file_reference` attachments) — preserves the plan across compaction.

**Trade-offs:**
- The fallback scans the *entire* transcript (`log.messages.length` items, backwards) on every miss. For very long sessions this can be slow, but resume is already a heavyweight operation so the cost is amortised.
- Three distinct discovery shapes means the recovery is fragile to message-schema changes. Each addition (e.g., a new way for plans to live in messages) needs an explicit case here.

**Key insight:** The order of the three checks inside `recoverPlanFromMessages` is *most-recent-first* — the loop walks backwards. This means an edit captured in an `attachment` after a `tool_use` will win, preserving the most recent plan version.

---

### `copyPlanForFork` — Distinct Path

```javascript
// ============================================
// copyPlanForFork - Copy plan when forking a session
// Location: chunks.97.mjs:1667-1680
// ============================================

// READABLE (for understanding):
async function copyPlanForFork(log, targetSessionId) {
    const originalSlug = getSlugFromLog(log);
    if (!originalSlug) return false;

    const plansDir = getPlansDirectory();
    const originalPath = path.join(plansDir, `${originalSlug}.md`);

    // Crucial: generate a NEW slug for the forked session, NOT the original.
    const newSlug = getPlanSlug(targetSessionId);
    const newPath = path.join(plansDir, `${newSlug}.md`);
    try {
        await copyFile(originalPath, newPath);
        return true;
    } catch (e) {
        if (isENOENT(e)) return false;
        logError(e);
        return false;
    }
}
```

### Why fork generates a new slug

Unlike `copyPlanForResume` which reuses the original slug (the resumed session continues the same plan), forking creates a divergent branch. If both the original and the fork shared a slug, they would write to the same file path and clobber each other.

The new slug generation goes through `getPlanSlug(targetSessionId)` which is cached per-session — once the fork has a slug it stays stable for that fork's lifetime.

---

## v2.1.101: Hide "Refine with Ultraplan" When Web Is Unreachable

### The Bug

`ExitPlanModePermissionRequest` (the approval modal) listed "Refine with Ultraplan" as one of the options whenever `feature('ULTRAPLAN')` was on. For orgs whose users could not reach Claude Code on the web (on-prem-only deployments, network-restricted enterprise environments), selecting that option would dismiss the modal and then fail when `launchUltraplan()` tried to establish the CCR bridge.

### The Fix

The availability check `isUltraplanAvailable()` was extended to require the `isRemoteControlAvailable()` predicate. The single change at the predicate level cascades to:
- The modal's option list (option is filtered out)
- The `/ultraplan` slash command (`isEnabled: () => isUltraplanAvailable()`)
- The keyword-trigger UI in PromptInput (rainbow highlight + suggestion)

```javascript
// ============================================
// isUltraplanAvailable - Combined gate (v2.1.101 form)
// Location: chunks.183.mjs:1066-1068
// ============================================

// ORIGINAL (for source lookup):
function hn() {
    return u8("tengu_ultraplan_config", null)?.enabled === !0 && mx()
}

// READABLE (for understanding):
function isUltraplanAvailable() {
    const config = getFeatureFlag("tengu_ultraplan_config", null);
    return config?.enabled === true && isRemoteControlAvailable();
}

// Mapping: hn→isUltraplanAvailable, u8→getFeatureFlag, mx→isRemoteControlAvailable
```

```javascript
// ============================================
// isRemoteControlAvailable - CCR bridge predicate
// Location: chunks.115.mjs:2513-2515
// ============================================

// ORIGINAL (for source lookup):
function mx() {
    return Qo1() && u8("tengu_ccr_bridge", !1)
}

// READABLE (for understanding):
function isRemoteControlAvailable() {
    return hasSubscriptionForRemoteControl() && getFeatureFlag("tengu_ccr_bridge", false);
}

// Mapping: mx→isRemoteControlAvailable, Qo1→hasSubscriptionForRemoteControl, u8→getFeatureFlag
```

### Why this composition

| Layer | What it checks | Failure mode pre-v2.1.101 |
|-------|---------------|---------------------------|
| `tengu_ultraplan_config.enabled` | Product-level GrowthBook flag — Anthropic controls rollout | Always passed for enrolled users regardless of org policy |
| `Qo1()` | claude.ai-class subscription login (not setup-token / `CLAUDE_CODE_OAUTH_TOKEN`) | Already gated correctly |
| `tengu_ccr_bridge` | GrowthBook flag for the CCR bridge — Anthropic + org control | Was checked elsewhere but not in the modal-option-list path |

Composing both predicates makes the bridge-availability the gating factor for the option's visibility, not just its execution. The user no longer sees an option that will fail.

### Call sites

All three users observed in v2.1.112 chunks.183.mjs:
1. `isEnabled: () => hn()` — slash-command registration (chunks.183.mjs:1649)
2. `cJ = useMemo(() => hn() && !ultraplanSessionUrl && !ultraplanLaunching ? pr8(i4) : [], ...)` — PromptInput keyword highlight (chunks.204.mjs:215)
3. `if (hn() && K === "prompt" && ...)` — UserPromptSubmit-equivalent ultraplan suggestion (chunks.205.mjs:1909)

And in chunks.200.mjs:461:
4. `G = hn() && N5("allow_remote_sessions") && !W && !D` — composite gate that *also* checks the org-level `allow_remote_sessions` permission

The v2.1.88 readable source confirms this via `showUltraplan = feature('ULTRAPLAN') ? !ultraplanSessionUrl && !ultraplanLaunching : false` in `ExitPlanModePermissionRequest.tsx`. The TypeScript code structures the same predicate using a different surface (`feature('ULTRAPLAN')` vs the GrowthBook flag).

---

## Summary: Remote Session Plan Mode Pipeline

```
Local CLI                              CCR Container                  Transcript
    │                                       │                              │
    │  ExitPlanMode call() →               │                              │
    │    writeFile(planPath, plan) ────────►│ (writes to container fs)     │
    │    persistFileSnapshotIfRemote() ────────────────────────────────►   │ system msg
    │                                       │                              │   subtype:
    │  user Ctrl+G edit →                  │                              │   file_snapshot
    │    writeFile(planPath, new) ─────────►│ (overwrites)                 │
    │    persistFileSnapshotIfRemote() ────────────────────────────────►   │ (append)
    │                                       │                              │
    │                          [container restart, fs lost]                │
    │                                       │                              │
    │  --resume <sessionId> →              │                              │
    │    copyPlanForResume(log)            │                              │
    │      tries disk → MISS              │                              │
    │      findFileSnapshotEntry ◄─────────────────────────────────────────┤
    │      writeFile(planPath, snapshot) ──►│ (re-populated)               │
    │                                       │                              │
    │  user sees plan, modal works, model continues planning normally     │
```

This pipeline makes "container restart" transparent to the user — the only sign is a debug-level log line.
