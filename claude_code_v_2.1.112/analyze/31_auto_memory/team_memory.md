# Team Memory System Overview (v2.1.112)

## Overview

Team memory is a second persistent memory directory that lives *inside* the per-project auto-memory tree (`<memoryBase>/projects/<sanitized-project-root>/memory/team/`). Where auto-memory captures one user's private facts, team memory captures facts contributed by every Claude user who runs in the same canonical git repo.

**Version**: Claude Code v2.1.112
**v2.1.88 source**: `src/memdir/teamMemPaths.ts`, `src/memdir/teamMemPrompts.ts`, `src/services/teamMemorySync/`
**v2.1.112 chunks**: chunks.83 (paths/validation), chunks.191 (prompt), chunks.192 (dispatcher), chunks.154 (extract + dream), chunks.173 (TUI option)

**Key insight**: Team memory is **not a separate storage domain** — it is a `team/` subdirectory of the auto-memory directory plus a sync watcher that mirrors that directory across teammates. This nesting decision flows through every other choice: the enablement gate, the path validation, the prompt builder, and the extract subagent.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) — full index for v2.1.112
> - [symbol_additions_unit_05.md](../00_overview/symbol_additions_unit_05.md) — this unit's additions

Key functions in this document:
- `isTeamMemoryEnabled` (`Ye6`) — `chunks.83.mjs:2021`
- `getTeamMemPath` (`vp`) — `chunks.83.mjs:2026`
- `getTeamMemEntrypoint` — derived (`chunks.83.mjs` adjacent — see deep dive in `team_paths.md`)
- `isTeamMemPath` (`MW4`) — `chunks.83.mjs:2067`
- `isTeamMemFile` (`Ae6`) — `chunks.83.mjs:2094`
- `buildCombinedMemoryPrompt` (`BtY`) — `chunks.191.mjs:3104`
- `extractMemoriesEntrypoint` (uses `vkK` + `isTeamMemoryEnabled` gate) — `chunks.154.mjs:213`

---

## 1. Architecture

### 1.1 The Nesting Decision

```
<memoryBase>/                                           ← $CLAUDE_CODE_REMOTE_MEMORY_DIR or ~/.claude
└── projects/
    └── <sanitized-canonical-git-root>/                 ← from sanitizePath(findCanonicalGitRoot(cwd))
        └── memory/                                     ← getAutoMemPath() — private to user
            ├── MEMORY.md                               ← private entrypoint
            ├── <user-private-memory-files>.md
            └── team/                                   ← getTeamMemPath() — shared with all teammates
                ├── MEMORY.md                           ← team entrypoint
                └── <team-shared-memory-files>.md
```

**Why nest team inside the user memory dir?**

1. **Scope alignment**: Both kinds of memory are project-scoped (keyed on the canonical git root). Nesting makes the scope identity obvious — same project key, same git-root prefix.
2. **Single watcher root**: The auto-dream + extract-memories agents only need to iterate `getAutoMemPath()` to see *all* memory; `team/` is naturally a sub-walk.
3. **Permission carve-out reuse**: `filesystem.ts` already grants the auto-memory directory a permission bypass; team memory inherits it for free (no second carve-out, no second danger-zone check). This is why `isTeamMemPath` is implemented as a string-prefix on `getTeamMemPath()` (chunks.83.mjs:2067) — the bypass logic only needs one source of truth.
4. **Cleanup symmetry**: When a project is uninstalled, removing the project-key directory removes both user and team memory together.

**Trade-off accepted**: A teammate who clones a repo for the first time has *no* team memory until the `teamMemorySync` watcher (a separate background fetch) materializes the synced files. Until that pull lands, `getTeamMemSyncState()` returns something other than `"has-content"` and `isTeamMemSyncActive()` (`HR8` at chunks.83.mjs:2030) returns false. This is the trigger for the "team memory unavailable" UI state.

### 1.2 Two-Tier Enablement Gate

Team memory is gated by **two** sequential checks. Both must pass:

```javascript
// ============================================
// isTeamMemoryEnabled - Two-tier feature gate
// Location: chunks.83.mjs:2021-2024
// ============================================

// ORIGINAL (for source lookup):
function Ye6() {
    if (!x3()) return !1;
    return u8("tengu_herring_clock", !1)
}

// READABLE (for understanding):
function isTeamMemoryEnabled() {
  if (!isAutoMemoryEnabled()) {
    return false;
  }
  return getFeatureValue_CACHED_MAY_BE_STALE('tengu_herring_clock', false);
}

// Mapping: Ye6→isTeamMemoryEnabled, x3→isAutoMemoryEnabled, u8→getFeatureValue_CACHED_MAY_BE_STALE
```

**What it does**: Returns `true` only if (a) the user has not opted out of auto-memory **and** (b) the Growthbook flag `tengu_herring_clock` is true for this session.

**How it works**:
1. `isAutoMemoryEnabled()` runs first — it checks `CLAUDE_CODE_DISABLE_AUTO_MEMORY`, `CLAUDE_CODE_SIMPLE`, the CCR-without-persistent-storage case, and `settings.json#autoMemoryEnabled`.
2. Only if that passes does it consult the cached Growthbook value.

**Why this approach**:
- Stacking auto-memory disable on top of team-memory disable means a user who killed auto memory cannot accidentally still emit team memory side-effects (sync writes, extraction).
- Putting `isAutoMemoryEnabled` first short-circuits the Growthbook call when memory is off entirely — that call hits a cache but isn't free.
- Using the **cached** Growthbook reader (`_CACHED_MAY_BE_STALE`) means the gate is callable from any rendering path without inducing a network fetch. Staleness is acceptable here: an in-flight session does not need to react to a flag flip mid-conversation.

**Key insight**: The two checks compose orthogonally. `tengu_herring_clock` controls **enrollment** in the team feature; `isAutoMemoryEnabled` controls **all** memory machinery. Disabling either suffices to shut team memory off — there is no separate kill switch.

### 1.3 The Empty-Directory Branch

When team memory is enabled but `isTeamMemSyncActive()` reports `"has-content" === false` (no synced files yet), the prompt builder still includes the team directory text. The agent will see `# Memory` with both paths — and an empty `team/MEMORY.md` — and that is fine: it can write to the team dir, and the watcher will sync those writes out next cycle.

Compare against `services/teamMemorySync/watcher.ts:256` (v2.1.88): the watcher's startup also checks `isTeamMemoryEnabled()` before subscribing. Both ends of the sync converge on the same gate.

---

## 2. Read/Write Semantics

### 2.1 Who Reads Team Memory?

Three readers, all running in the same Claude Code process:

| Reader | Reads | Behavior |
|--------|-------|----------|
| **Main agent** (prompt) | `team/MEMORY.md` content (loaded into combined prompt via `buildCombinedMemoryPrompt`) | Always reads when team memory enabled |
| **Relevant-memory recall** (`startRelevantMemoryPrefetch` `ikK`) | Individual files under `team/*.md` (semantic search hits) | Filters per query; uses `memoryHeader` prefix |
| **Extract-memories subagent** (`extractMemories` at chunks.154.mjs:213) | Both `team/` and root memory dirs when deciding what's already saved | Only reads to dedupe; never returns content to user |

Importantly, **nobody outside the Claude Code process reads team memory directly**. The teammate sync watcher pushes/pulls bytes to/from a remote store, but the agents only see what landed on local disk.

### 2.2 Who Writes Team Memory?

Writes go through one of three channels, **all subject to `validateTeamMemWritePath`**:

1. **Main agent via Write/Edit tools**: The system prompt instructs the agent to write to `team/<file>.md` when the scope is `team`. The permission carve-out (`isAutoMemPath` / `isTeamMemPath`) skips the per-write user confirmation.
2. **Extract-memories subagent**: Runs at turn-end when `tengu_passport_quail` is on. Its prompt also references `team/` and it writes via the same Write tool.
3. **teamMemorySync watcher**: A background fetch that materializes server-side changes onto local disk. Writes are funneled through `validateTeamMemKey` because the server speaks in relative path keys, not absolute paths.

All three pass through `validateTeamMemWritePath` / `validateTeamMemKey`. See `team_paths.md` for the full traversal-defense walkthrough.

### 2.3 No Write Lock

Team memory writes have **no explicit lock**. The design assumes:

1. **Local write order is preserved by the filesystem**: One main agent + one extract subagent + one sync watcher per session, all on one machine.
2. **Conflicts are resolved server-side**: If two teammates write to the same file at the same time, the sync layer (out of scope for this doc) decides who wins. The local copy will converge to the server's view on next pull.
3. **MEMORY.md is the index, not the data**: A duplicate write to `team/foo.md` is far less harmful than to `team/MEMORY.md`. The extract prompt explicitly tells the agent to update existing files when content overlaps.

**Why no lock**: Adding a cross-process lock would force `teamMemorySync` to coordinate with `extractMemories` on every cycle — wasted complexity for an at-most-one-writer-per-millisecond workload.

---

## 3. Lifecycle

### 3.1 Session Start

1. **`getAutoMemoryPromptForSession`** (chunks.192.mjs:30+) decides which memory prompt to inject. Decision tree:
   - If extract mode active → `buildExtractAgentMemoryPrompt` variant
   - **Else if `isTeamMemoryEnabled()` →** `buildCombinedMemoryPrompt` (dual-directory)
   - Else if just auto-memory → single-directory prompt
   - Else → `null` (memory section omitted from system prompt entirely)

2. **`teamMemorySync.startWatcher`** (v2.1.88 `services/teamMemorySync/watcher.ts:256`) checks `isTeamMemoryEnabled() && isTeamMemorySyncAvailable()`. If both, it subscribes to the remote channel and begins pulling deltas.

3. The TUI's "Open memory folder" option (chunks.173.mjs:1646) adds a second entry "Open team memory folder" pointing at `getTeamMemPath()`.

### 3.2 During a Turn

Read flow (every time the user sends a message):

```
User message
  │
  ├─► startRelevantMemoryPrefetch (ikK, chunks.155.mjs:2159)
  │     └─► recallMemoryRequest with budget = MAX_SESSION_BYTES
  │           └─► returns hits including team/<file>.md paths
  │
  ├─► loadAndFormatRelevantMemories (CMY, chunks.155.mjs:2126)
  │     └─► applies memoryHeader to each hit → relevant_memories attachment
  │
  └─► Main agent sees system prompt with:
        - buildCombinedMemoryPrompt section (paths to both dirs)
        - nested_memory blocks for any CLAUDE.md files in cwd
        - relevant_memories attachments (filtered & truncated)
```

Write flow (when the agent uses Write/Edit):
```
Agent → Write tool → permissions.ts
  ├─ isAutoMemPath(target)? → write carve-out (no user prompt)
  ├─ isTeamMemPath(target)? → falls through isAutoMemPath because team/ ⊂ memory/
  └─ otherwise → standard user confirmation flow
```

### 3.3 Turn End

`extractMemories` (chunks.154.mjs:200+) runs as a fork:

1. Reads `isTeamMemoryEnabled()` once at the top of the run.
2. Builds the extract prompt variant via `vkK(messageCount, entrypointBytes, teamMemoryEnabled)`.
3. The subagent writes files; the runner uses `isTeamMemPath` to count `team_memories_saved` separately for telemetry.

```javascript
// ============================================
// extractMemories team-aware branch
// Location: chunks.154.mjs:213-258
// ============================================

// ORIGINAL (for source lookup):
let P = VkK.isTeamMemoryEnabled(),
    W = u8("tengu_bramble_lintel", null) ?? 1,
    // ...
    v = vkK(M, f, P),
    // ...
    B = w7(x, VkK.isTeamMemPath);

// READABLE (for understanding):
const teamMemoryEnabled = isTeamMemoryEnabled();
const minMessagesBetweenExtractions = getFeatureValue('tengu_bramble_lintel', null) ?? 1;
// ...
const extractPrompt = buildExtractMemoriesPrompt(messageCount, entrypointBytes, teamMemoryEnabled);
// ...
const teamMemoriesSavedCount = countWhere(writtenPaths, isTeamMemPath);

// Mapping: VkK→teamPathsModule, vkK→buildExtractMemoriesPrompt, w7→countWhere
```

**Why one read of `isTeamMemoryEnabled` at the top**: The function is cheap but not free (calls into `isAutoMemoryEnabled` which inspects env/settings). Once per extract run is enough.

### 3.4 Session End

Nothing memory-specific runs. The sync watcher's `[Symbol.dispose]` (or process exit) tears down the network subscription; on-disk state is left intact for the next session.

---

## 4. Differences vs Private (Auto) Memory

| Aspect | Auto Memory | Team Memory |
|--------|-------------|-------------|
| Path | `memory/` | `memory/team/` |
| Enablement | `isAutoMemoryEnabled()` (env/settings) | `isAutoMemoryEnabled() && tengu_herring_clock` |
| Sync | None (local only) | `teamMemorySync` watcher |
| Permission bypass | Yes (`isAutoMemPath`) | Inherits via prefix match (`isTeamMemPath` ⊂ `isAutoMemPath`) |
| Path validation | `isAutoMemPath` (normalize + prefix) | `validateTeamMemWritePath` / `validateTeamMemKey` — full realpath traversal defense |
| MEMORY.md handling | Loaded as nested-memory attachment | Loaded by `buildCombinedMemoryPrompt` text; nested-memory excluded via `PW4` (chunks.83.mjs:2113) |
| Extraction prompt | Single-scope (private only) | Dual-scope (private/team chooser) via `vkK` 3rd arg |
| TUI folder option | "Open auto-memory folder" | + "Open team memory folder" (chunks.173.mjs:1649) |

The **path validation gap** is the biggest structural difference. Auto memory trusts the absolute-path-prefix check because writes only come from the agent's own Write tool (which itself runs in the user's process and resolves paths via `path.resolve`). Team memory has an additional writer (the sync watcher receiving server-side data) that operates on **relative path keys** chosen by the remote. Those keys could be adversarial, so the team module adds:

1. `sanitizePathKey` to scrub the key string itself (null bytes, URL-encoded `..`, NFKC normalization attacks, backslashes, absolute paths).
2. `realpathDeepestExisting` + `isRealPathWithinTeamDir` to defeat symlink escapes that `path.resolve` cannot see through.

Auto memory could in theory adopt the same defenses, but the absence of an untrusted writer makes the cost-benefit unfavorable. See `team_paths.md` for the threat model and step-by-step algorithm.

---

## 5. Cross-References

- **`team_paths.md`**: Deep deobfuscation of every function in `src/memdir/teamMemPaths.ts`, with the symlink-escape threat model and realpath algorithm.
- **`messages_integration.md`**: How the team memory prompt is assembled (`buildCombinedMemoryPrompt`), how `nested_memory` and `relevant_memories` attachments thread back into the conversation, and where `memoryHeader` is computed and cached.
- **v2.1.76 baseline**: `claude_code_v_2.1.76/analyze/31_auto_memory/24_team_memory_system.md` — the earlier (less-defended) version that did not yet have `realpath`-based traversal protection.
- **v2.1.88 source**: `/lyz/codespace/3rd/claude-code/src/memdir/teamMemPaths.ts` is the readable companion of chunks.83.mjs:2003-2096.

---

## 6. Summary

Team memory in v2.1.112:

1. Lives as a **`team/` subdirectory** inside the per-project auto-memory directory.
2. Is **gated** by `isAutoMemoryEnabled() && tengu_herring_clock`.
3. Is **populated** by three writers (main agent, extract subagent, sync watcher) — all funneled through realpath-validated entry points (`validateTeamMemWritePath` / `validateTeamMemKey`).
4. Is **surfaced** via `buildCombinedMemoryPrompt` (dual-directory system prompt) plus the per-turn `relevant_memories` attachment pipeline.
5. Has **no local lock** — concurrency is resolved by the (out-of-scope) sync layer.
6. Adds **defense-in-depth** versus private memory: sanitization of relative path keys + realpath-based symlink-escape detection (PSR M22186 and M22187).
