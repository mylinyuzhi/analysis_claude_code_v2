# Team Memory System Overview (v2.1.142)

## Overview

Team memory is a second persistent memory directory that lives *inside* the per-project auto-memory tree (`<memoryBase>/projects/<sanitized-project-root>/memory/team/`, or under `tiny_memory/team/` when the tiny flag is on). Where auto-memory captures one user's private facts, team memory captures facts contributed by every Claude user who runs in the same canonical git repo.

**Version**: Claude Code v2.1.142
**v2.1.88 source**: `src/memdir/teamMemPaths.ts`, `src/memdir/teamMemPrompts.ts`, `src/services/teamMemorySync/`
**v2.1.142 locations** in `cli_inner_pretty.js`:
- `142484-142596` — Team paths + validation (`Dl`, `bVK`, `YS1`, `ri$`, `g5$`, `ii$`, `RVK`, `CVK`, `Q5$`, `zS1`)
- `142597-142671` — Team prompt builder (`xVK` namespace + `fS1` function)
- `142855-142927` — Dispatcher integration (`c5$` calls `OS1.buildCombinedMemoryPrompt`)

**Key insight**: Team memory is **not a separate storage domain** — it is a `team/` subdirectory of the auto-memory directory plus a sync watcher that mirrors that directory across teammates. This nesting decision flows through every other choice: the enablement gate, the path validation, the prompt builder, and the extract subagent. Unchanged from v2.1.112.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_auto_memory.md](../00_overview/symbol_additions_v2_1_142_auto_memory.md) — this unit's additions

Key functions in this document:
- `isTeamMemoryEnabled` (`g5$`) — `cli_inner_pretty.js:142511-142514`
- `getTeamMemPath` (`Dl`) — `cli_inner_pretty.js:142515-142517`
- `isTeamMemoryActiveForCwd` (`ii$`) — `cli_inner_pretty.js:142518-142521`
- `isTeamMemPath` (`bVK`) — `cli_inner_pretty.js:142556-142560`
- `isTeamMemFile` (`Q5$`) — `cli_inner_pretty.js:142580-142582`
- `buildCombinedMemoryPrompt` (`fS1` on `xVK` namespace) — `cli_inner_pretty.js:142599-142671`
- `validateTeamMemWritePath` (`YS1`) — `cli_inner_pretty.js:142561-142569`
- `validateTeamMemKey` (`ri$`) — `cli_inner_pretty.js:142570-142579`
- `realpathDeepestExisting` (`RVK`) — `cli_inner_pretty.js:142522-142543`
- `isRealPathWithinTeamDir` (`CVK`) — `cli_inner_pretty.js:142544-142555`
- `sanitizePathKey` (`zS1`) — `cli_inner_pretty.js:142495-142510`
- `PathTraversalError` (`uT`) — `cli_inner_pretty.js:142590-142595`

---

## 1. Architecture

### 1.1 The Nesting Decision

```
<memoryBase>/                                           ← $CLAUDE_CODE_REMOTE_MEMORY_DIR or ~/.claude
└── projects/
    └── <sanitized-canonical-git-root>/                 ← from sanitizePath(findCanonicalGitRoot(cwd))
        └── memory/ (or tiny_memory/)                   ← getAutoMemPath() — private to user
            ├── MEMORY.md                               ← private entrypoint (non-tiny only)
            ├── <user-private-memory-files>.md
            └── team/                                   ← getTeamMemPath() — shared with all teammates
                ├── MEMORY.md                           ← team entrypoint (non-tiny only)
                └── <team-shared-memory-files>.md
```

**Why nest team inside the user memory dir?**

1. **Scope alignment**: Both kinds of memory are project-scoped.
2. **Single watcher root**: The auto-dream + extract-memories agents only need to iterate `getAutoMemPath()` to see *all* memory; `team/` is naturally a sub-walk.
3. **Permission carve-out reuse**: `filesystem.ts` already grants the auto-memory directory a permission bypass; team memory inherits it for free. This is why `isTeamMemPath` is implemented as a string-prefix on `getTeamMemPath()`.
4. **Cleanup symmetry**: When a project is uninstalled, removing the project-key directory removes both user and team memory together.

**Trade-off accepted**: A teammate who clones a repo for the first time has *no* team memory until the team-memory sync watcher materializes the synced files. Until that pull lands, `getTeamMemSyncState()` returns something other than `"has-content"` and `ii$()` returns false. This is the trigger for the "team memory unavailable" UI state.

### 1.2 Two-Tier Enablement Gate

Team memory is gated by **two** sequential checks. Both must pass:

```javascript
// ============================================
// isTeamMemoryEnabled - Two-tier feature gate
// Location: cli_inner_pretty.js:142511-142514
// ============================================

// ORIGINAL (for source lookup):
function g5$() {
  if (!x9()) return !1;
  return Z$("tengu_herring_clock", !1);
}

// READABLE (for understanding):
export function isTeamMemoryEnabled() {
  if (!isAutoMemoryEnabled()) return false
  return getFeatureValue_CACHED_MAY_BE_STALE('tengu_herring_clock', false)
}

// Mapping: g5$→isTeamMemoryEnabled, x9→isAutoMemoryEnabled, Z$→getFeatureValue_CACHED_MAY_BE_STALE
```

**What it does**: Returns `true` only if (a) the user has not opted out of auto-memory **and** (b) the Growthbook flag `tengu_herring_clock` is true for this session.

**Why this approach** (unchanged from v2.1.112):
- Stacking auto-memory disable on top of team-memory disable means a user who killed auto memory cannot accidentally still emit team memory side-effects.
- Using the **cached** Growthbook reader means the gate is callable from any rendering path without inducing a network fetch.

**Key insight**: The two checks compose orthogonally. `tengu_herring_clock` controls **enrollment** in the team feature; `isAutoMemoryEnabled` controls **all** memory machinery. Disabling either suffices to shut team memory off.

### 1.3 The Empty-Directory Branch

When team memory is enabled but the team-mem sync reports no content yet, the prompt builder still includes the team directory text. The agent will see `# Memory` with both paths — and an empty `team/MEMORY.md` — and that is fine: it can write to the team dir, and the watcher will sync those writes out next cycle.

`isTeamMemoryActiveForCwd` (`ii$`) gates whether the *sync indicator* (and certain UI affordances) appears — but the prompt is emitted regardless of whether team memory has synced yet.

---

## 2. Read/Write Semantics

### 2.1 Who Reads Team Memory?

Three readers, all running in the same Claude Code process (unchanged from v2.1.112):

| Reader | Reads | Behavior |
|--------|-------|----------|
| **Main agent** (prompt) | `team/MEMORY.md` content (loaded into combined prompt via `fS1`) | Always reads when team memory enabled |
| **Relevant-memory recall** (`oo7`/`startRelevantMemoryPrefetch`) | Individual files under `team/*.md` (semantic search hits) | Filters per query; uses `memoryHeader` prefix |
| **Extract-memories subagent** | Both `team/` and root memory dirs when deciding what's already saved | Only reads to dedupe; never returns content to user |

### 2.2 Who Writes Team Memory?

Writes go through one of three channels, **all subject to `validateTeamMemWritePath`**:

1. **Main agent via Write/Edit tools**: The system prompt instructs the agent to write to `team/<file>.md` when the scope is `team`.
2. **Extract-memories subagent**: Runs at turn-end when `tengu_passport_quail` is on.
3. **teamMemorySync watcher**: A background fetch that materializes server-side changes onto local disk. Writes are funneled through `validateTeamMemKey`.

All three pass through `validateTeamMemWritePath` / `validateTeamMemKey`. See [team_paths.md](./team_paths.md) for the full traversal-defense walkthrough.

### 2.3 No Write Lock

Team memory writes have **no explicit lock**. The design assumes:

1. Local write order is preserved by the filesystem.
2. Conflicts are resolved server-side.
3. MEMORY.md is the index, not the data.

---

## 3. Lifecycle

### 3.1 Session Start

1. **`loadMemoryPrompt`** (`c5$` at `cli_inner_pretty.js:142855`) decides which memory prompt to inject. Decision tree (v2.1.142 — adds simple-prompt and tiny branches):
   - If `CLAUDE_COWORK_MEMORY_GUIDELINES` env var set → return verbatim
   - If simple-system-prompt + non-tiny → `IVK` (simple combined or auto)
   - If tiny + team-mem → `hVK` (tiny dual-dir)
   - If tiny + auto-only → `yVK` (tiny single-dir)
   - **If team-mem enabled (non-tiny, non-simple) →** `OS1.buildCombinedMemoryPrompt` (`fS1`)
   - Else if just auto-memory → `VK6` single-directory prompt
   - Else → `null`

2. **teamMemorySync watcher startup**: checks `isTeamMemoryEnabled()` and (separately) `isTeamMemoryActiveForCwd()`. If both, it subscribes to the remote channel and begins pulling deltas.

3. The TUI's "Open memory folder" option adds a second entry "Open team memory folder" pointing at `getTeamMemPath()` (`Dl`).

### 3.2 During a Turn

Read flow (every time the user sends a message):

```
User message
  │
  ├─► startRelevantMemoryPrefetch (oo7, cli_inner_pretty.js:398243)
  │     └─► getRelevantMemoryAttachments (Oq5) with budget = MAX_SESSION_BYTES
  │           └─► returns hits including team/<file>.md paths
  │
  ├─► readMemoriesForSurfacing (analog of CMY)
  │     └─► applies memoryHeader (_h6) to each hit → relevant_memories attachment
  │
  └─► Main agent sees system prompt with:
        - fS1.buildCombinedMemoryPrompt section (paths to both dirs)
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

`extractMemories` runs as a fork (unchanged from v2.1.112 — same machinery, different obfuscated names):

1. Reads `isTeamMemoryEnabled()` once at the top of the run.
2. Builds the extract prompt variant.
3. The subagent writes files; the runner uses `isTeamMemPath` to count `team_memories_saved` separately for telemetry.

### 3.4 Session End

Nothing memory-specific runs. The sync watcher's `[Symbol.dispose]` (or process exit) tears down the network subscription; on-disk state is left intact for the next session.

---

## 4. Differences vs Private (Auto) Memory

| Aspect | Auto Memory | Team Memory |
|--------|-------------|-------------|
| Path | `memory/` (or `tiny_memory/`) | `memory/team/` (or `tiny_memory/team/`) |
| Enablement | `isAutoMemoryEnabled()` | `isAutoMemoryEnabled() && tengu_herring_clock` |
| Sync | None (local only) | team-memory sync watcher |
| Permission bypass | Yes (`isAutoMemPath`) | Inherits via prefix match (`isTeamMemPath` ⊂ `isAutoMemPath`) |
| Path validation | `isAutoMemPath` (normalize + prefix) | `validateTeamMemWritePath` / `validateTeamMemKey` — full realpath traversal defense |
| MEMORY.md handling | Loaded as nested-memory attachment | Loaded by `buildCombinedMemoryPrompt` text |
| Extraction prompt | Single-scope (private only) | Dual-scope (private/team chooser) |
| TUI folder option | "Open auto-memory folder" | + "Open team memory folder" |

The **path validation gap** is the biggest structural difference. Auto memory trusts the absolute-path-prefix check because writes only come from the agent's own Write tool. Team memory has an additional writer (the sync watcher receiving server-side data) that operates on **relative path keys** chosen by the remote. The team module adds:

1. `sanitizePathKey` (`zS1`) to scrub the key string itself (null bytes, URL-encoded `..`, NFKC normalization attacks, backslashes, absolute paths).
2. `realpathDeepestExisting` (`RVK`) + `isRealPathWithinTeamDir` (`CVK`) to defeat symlink escapes that `path.resolve` cannot see through.

See [team_paths.md](./team_paths.md) for the threat model and step-by-step algorithm.

---

## 5. The Combined Prompt: `fS1`

`OS1.buildCombinedMemoryPrompt` (`fS1` exported as `buildCombinedMemoryPrompt` on the `xVK` namespace) emits the team-aware system-prompt memory section.

### What it changed from v2.1.112

The body of `fS1` is largely the v2.1.112 prose. Two notable differences:

1. **The "How to save memories" block now uses the v2.1.142 frontmatter** (`metadata.type` nested, with wikilink guidance).
2. **The "## When to access memories" first bullet** is slightly reworded — emphasizing "personal or team" memory recall: "When memories (personal or team) seem relevant, or the user references prior work with them or others in their organization."

The skill-bouncer swap (`ZZH`) also applies here — if `tengu_ochre_finch` is on, the COMBINED types section collapses to the 4-bullet pointer.

### Tiny dual-directory variant: `hVK`

When `gM()` is on, the dual-dir path uses `hVK` instead. See [memdir_core.md](./memdir_core.md#buildcombinedmemorypromptiny-hvk--tiny-dual-dir-variant) for the per-section differences.

---

## 6. Cross-References

- **[team_paths.md](./team_paths.md)**: Deep deobfuscation of every function in team paths, with the symlink-escape threat model and realpath algorithm.
- **[messages_integration.md](./messages_integration.md)**: How the team memory prompt is assembled, how `nested_memory` and `relevant_memories` attachments thread back into the conversation, and where `memoryHeader` is computed.
- **[memdir_core.md](./memdir_core.md)**: The dispatcher (`c5$`) that decides when team-mem fires vs the other branches.

---

## 7. Summary

Team memory in v2.1.142:

1. Lives as a **`team/` subdirectory** inside the per-project auto-memory directory (which itself is `memory/` or `tiny_memory/` based on the tiny flag).
2. Is **gated** by `isAutoMemoryEnabled() && tengu_herring_clock` — identical to v2.1.112.
3. Is **populated** by three writers (main agent, extract subagent, sync watcher) — all funneled through realpath-validated entry points (`validateTeamMemWritePath` / `validateTeamMemKey`).
4. Is **surfaced** via `fS1.buildCombinedMemoryPrompt` (dual-directory system prompt) plus the per-turn `relevant_memories` attachment pipeline.
5. Has **no local lock** — concurrency is resolved by the sync layer.
6. Has the same **defense-in-depth** validators as v2.1.112: sanitization of relative path keys + realpath-based symlink-escape detection.
7. Is **identical in behavior to v2.1.112** at this level — the changes in v2.1.142 are confined to prompt-content evolution (frontmatter format, tiny variant) and dispatcher precedence (simple-prompt branch ahead of team), not to the team module itself.
