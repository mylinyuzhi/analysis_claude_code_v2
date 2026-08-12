# Auto-memory recall, extraction, consolidation, and integrity

## Scope and version assessment

The 2.1.227 subsystem retains the mature 2.1.220 extraction and Dream architecture, including the UUID
cursor, latest-state coalescing, restricted fork, PID/mtime lock, safe YAML rewrite, and memory-index
budget. This document re-derives those mechanisms from the target rather than carrying forward old
obfuscated names.

The largest current-state expansion is prompt routing: personal auto-memory can coexist with team
mounts and connected memory stores, and the builder chooses among inline filesystem indexes,
tool-addressed stores, lean prompts, and split static/dynamic prompt forms. The 2.1.227 target also
retains explicit pause propagation into permission checks and worker resume metadata.

### Enablement and trusted directory resolution

**What it does:** Decides whether this process may use auto-memory and resolves exactly one safe,
normalized root for all downstream checks.

**How it works:**
1. `isAutoMemoryEnabled` (`Jh`, `cli_inner_pretty.js:618265-618282`) first rejects a session pause and
   restricted runtime state.
2. A truthy `CLAUDE_CODE_DISABLE_AUTO_MEMORY` disables memory; an explicitly falsy value forces it on
   before the ordinary user setting is consulted. Minimal mode disables it.
3. Remote sessions require an explicit remote memory root or Cowork override. A model-list feature
   policy may also disable memory for the active model.
4. If none of those process-capability gates decide the result, the explicit `autoMemoryEnabled`
   setting wins; otherwise memory defaults on.
5. The custom path resolver accepts an absolute local path or a safe `~/` expansion, rejects roots,
   UNC/network forms, traversal, NUL bytes, and very short drive roots, then normalizes to NFC with one
   trailing separator (`:618309-618343`).
6. `getAutoMemoryDirectory` (`ym`, `:618346-618364`) prefers a trusted runtime override, then the
   permitted setting layers, then `~/.claude/projects/<sanitized-project>/memory/`. The result is
   memoized by project and product mode.
7. Every later containment check requires the trusted root to retain its trailing separator and
   rejects protected descendants, preventing prefix collisions such as `memory-other`.

**Why this approach:**
- Environment and runtime gates describe whether memory is technically or administratively possible,
  so they must outrank preference settings.
- Central path resolution keeps prompt text, Read/Edit permissions, extraction, and Dream on the same
  root; independently resolving paths would create policy gaps.
- Rejecting broad roots limits the blast radius of the extractor's narrowly granted write/delete
  capability.
- The trade-off is a nontrivial precedence ladder. It supports emergency disablement, remote storage,
  per-model rollout, and user choice without overloading a single boolean.

**Key insight:** `autoMemoryEnabled` is a preference inside a capability ladder. It is not the final
authority, and the resolved directory is part of the security boundary.

### Prompt-time memory routing and bounded recall

**What it does:** Builds the model-visible memory contract and selects the appropriate index surfaces
without loading unbounded memory contents.

**How it works:**
1. `buildMemorySystemPrompt` (`sIn`, `cli_inner_pretty.js:587956-588112`) starts from current
   enablement, product mode, configured memory mounts, connected-store eligibility, and an
   `analysisOnly` flag that suppresses state mutations during prompt inspection.
2. A product-supplied memory-guidelines environment value may replace the normal generated section,
   but directory creation and load telemetry still use the same root.
3. When connected stores are active, the builder resolves each store's public mount, read/write mode,
   and prompt index. Nonempty indexes are inserted as bounded index views; empty writable stores get
   instructions for creating their first document and index entry.
4. Without connected tools, team-memory mounts are mapped to filesystem paths. Read-only mounts are
   described as such, while writable mounts receive precise index/file placement guidance.
5. Lean and split-prompt modes can put only the directory location in dynamic session context while
   retaining generic memory policy in the cacheable system-prompt prefix.
6. The personal `MEMORY.md` loader truncates by both bytes and lines and records whether either limit
   was hit. Topic files stay on disk and are read on demand rather than concatenated into every
   request.
7. The generated policy distinguishes cross-session memory from plans and tasks, preventing current
   execution state from being persisted merely because it is important now.

**Why this approach:**
- A small index plus topic files bounds recurring prompt cost while preserving discoverability.
- One router supports personal, team, remote, and connected-memory deployments without giving the
  model conflicting storage instructions.
- Moving per-user paths out of the static prefix improves cross-user prompt-cache reuse, at the cost of
  slightly weaker positional authority; the setting documents that trade-off explicitly.
- `analysisOnly` lets diagnostic surfaces render the exact prompt without falsely marking memory as
  loaded or changing runtime flags.

**Key insight:** Recall is index-first, not “load every memory.” The prompt teaches the model how to
fetch detail and chooses a storage vocabulary compatible with the current backend.

### Incremental post-turn extraction scheduler

**What it does:** Runs a bounded fork after useful main-agent turns while avoiding recursion,
duplicate work, and lost updates under overlapping triggers.

**How it works:**
1. `initExtractMemories` (`$Ys`, `cli_inner_pretty.js:361389-361514`) installs closure state: a UUID
   cursor, turn-throttle counter, in-progress flag, pending latest context, and a set of promises for
   shutdown draining.
2. The entry path rejects subagents, a disabled extraction rollout gate, disabled memory, and Remote
   Control child sessions.
3. It counts user/assistant messages after the cursor. If compaction removed the cursor, it recounts
   the visible transcript rather than returning zero.
4. It skips and advances the cursor when the main conversation already completed a connected-memory
   write or wrote an auto-memory file. It also skips turns without at least one substantive user text
   segment.
5. A remotely configurable turn cadence delays the fork. On admission, the counter resets and the
   current memory-file manifest is read before prompt construction.
6. The fork gets the cache-safe parent context, no transcript of its own, at most five model turns,
   and a specialized permission callback. Successful completion advances the cursor and extracts
   actual written paths from tool calls.
7. If another trigger arrives while extraction runs, only the newest context is retained. The trailing
   run is safe because the latest transcript contains earlier pending evidence.
8. Failures do not advance the cursor. Shutdown can await all active extraction promises, bounded by a
   60-second race.

**Why this approach:**
- Fire-and-forget extraction avoids adding latency to the user's completed response.
- A UUID cursor tolerates inserted messages and deliberately chooses duplicate consideration over
  permanent starvation after compaction.
- The latest-state latch prevents a queue of redundant model calls; a FIFO queue would repeatedly
  summarize overlapping transcript prefixes.
- The five-turn cap and manifest-first prompt control cost, but may defer a complex cleanup to Dream.

**Key insight:** Extraction is at-least-once consideration, not exactly-once execution. Cursor advance
rules make failure retryable while direct writes and no-prose turns are intentional checkpoints.

### Forked-agent tool confinement

**What it does:** Grants enough capability to maintain memory files without inheriting the parent
session's broad tool permissions.

**How it works:**
1. `createAutoMemoryToolPolicy` (`H4o`, `cli_inner_pretty.js:361335-361366`) rejects all tools when the
   session pause flag is active.
2. It allows read/search primitives after their own path safety checks and permits only shell commands
   classified as read-only.
3. The only mutating shell exception is a single parsed `rm`/`Remove-Item` command targeting one or
   more absolute `.md` paths inside the memory root. Redirects, environment assignments, globs,
   command composition, and unsupported flags fail closed.
4. `Write` and `Edit` are allowed only when `file_path` is a `.md` descendant of the normalized memory
   root and not inside a protected subtree.
5. MCP tools, Agent, ordinary write-capable shell, and every unrecognized tool are denied regardless
   of the parent session's permission mode.
6. The extraction prompt tells the model to parallelize reads before writes because Edit requires a
   prior Read and the fork has a small turn budget.

**Why this approach:**
- A dedicated permission membrane prevents prompt injection in conversation history from converting a
  maintenance fork into a general-purpose agent.
- Parsing the delete command is more robust than matching a raw prefix that could hide extra commands.
- Allowing deletion is necessary for forgetting and consolidation; limiting it to Markdown under one
  root makes that power proportional.
- The trade-off is reduced flexibility: the fork cannot inspect the repository to verify a claimed
  fact, and the prompt explicitly tells it not to try.

**Key insight:** The memory fork receives a capability set, not the user's session permissions. Its
prompt and callback agree on the same narrow filesystem boundary.

### Cross-session Dream scheduling and lease algorithm

**What it does:** Periodically consolidates accumulated memories using recent session transcripts
while preventing multiple CLI processes from running the same expensive pass.

**How it works:**
1. `initAutoDream` (`q8d`, `cli_inner_pretty.js:362061-362184`) requires memory, Dream rollout/user
   enablement, a supported foreground process, and no SDK/Remote Control child context.
2. The feature config validates `minHours` and `minSessions` independently, defaulting to 24 hours and
   five sessions. The lock-file mtime supplies the last-consolidated timestamp.
3. Cheap time gating runs before transcript enumeration. After the time gate passes, a ten-minute
   in-memory scan throttle prevents every completed turn from rescanning an under-threshold project.
4. Session files touched after the checkpoint are listed, and the current session is excluded. Below
   `minSessions`, the scheduler records a structured skip.
5. `tryAcquireDreamLock` (`tZ_`, `:361934-361957`) reads `.consolidate-lock` mtime and PID. A recent
   live holder wins; dead, malformed, absent, or hour-old ownership can be reclaimed.
6. The contender writes its PID and reads it back. Only the last writer that observes its own PID owns
   the lease; the function returns the prior mtime for rollback.
7. Dream registers a visible cancellable task, forks with the same restricted memory policy, tracks
   touched paths from tool events, and publishes progress without writing a transcript.
8. Failure before fork completion marks the task failed and `rollbackDreamLock` (`rZ_`,
   `:361961-361974`) restores the prior checkpoint. A successful run leaves the new mtime as the next
   schedule boundary.

**Why this approach:**
- Time plus activity thresholds prevent both frequent low-value consolidation and an expensive pass
  after an idle period with no new evidence.
- PID/mtime plus read-back ownership works across processes without a database or portable advisory
  lock dependency.
- Reusing the mtime as lease age and last-success checkpoint minimizes state, while rollback preserves
  retryability.
- The trade-off is heuristic stale-lock handling and possible redundant work under pathological PID
  reuse; the one-hour lease bounds that risk.

**Key insight:** Writing the lock is only a claim. Reading back the current PID establishes ownership,
and the returned old mtime is the transaction's rollback token.

### Pause membrane and resumed-worker propagation

**What it does:** Stops both new recall and mutation for the current session, including background
maintenance and resumed print-mode workers.

**How it works:**
1. The pause state is stored in session runtime state and reported through internal session metadata.
2. `isAutoMemoryEnabled` rejects while paused, preventing prompt reload, extraction, and Dream entry.
3. Read permission checks explicitly deny paths under the memory root while paused; write checks return
   a non-classifier-approvable safety denial. User approval cannot override it for one call.
4. The fork-specific policy performs the same pause check before considering individual tools.
5. Worker resume restores `memory_toggled_off` from prior-epoch internal metadata, so spawning a fresh
   process does not silently reactivate memory.
6. The target still contains a `/pause-memory` command implementation at
   `cli_inner_pretty.js:408744-408782`, but its command object's `isEnabled` predicate is false in this
   build. The underlying state and enforcement remain active for host/session-metadata paths.

**Why this approach:**
- Removing only the prompt would not stop direct tool calls or maintenance forks.
- A hard safety denial is stronger than an ordinary ask rule and matches the user's expectation that
  “pause” applies to the whole session.
- Metadata propagation preserves the invariant across worker replacement.
- The retained disabled command code supports alternate hosts/rollouts but means string presence alone
  must not be interpreted as CLI availability.

**Key insight:** Pause is a cross-layer membrane—enablement, prompt, permissions, forks, and resume—not
merely a UI toggle.

### Write-time frontmatter and index-budget integrity

**What it does:** Adds provenance/modified timestamps without lossy YAML rewrites and warns before the
bounded `MEMORY.md` index becomes unreadable at its tail.

**How it works:**
1. `stampMemoryFrontmatter` (`DBo`, `cli_inner_pretty.js:317270-317286`) applies only to Markdown under
   the auto-memory root with a frontmatter fence.
2. `parseFrontmatter` (`af`, `:123298-123353`) optionally re-quotes top-level plain scalars whose YAML
   parse would silently treat an inline `#` as a comment. Ambiguous fences, nested/unprovable keys, and
   empty-object round trips produce a `rewriteHazard`.
3. When the parse is provably safe and provenance is absent, the target serializes
   `originSessionId` plus `modified`. Otherwise it avoids whole-object serialization and attempts a
   surgical `modified:` line splice.
4. The surgical result is parsed again and compared structurally and bytewise outside the intended
   line. If equivalence cannot be proved, the original content is retained.
5. `buildMemoryIndexSizeNotice` (`gGo`, `:370908-370936`) compares the effective bytes and optional
   line count to their load caps, choosing the dimension with the largest fraction.
6. Below 80% it is silent; from 80% it requests compaction to 70%; above 100% it emits an explicit
   error explaining that the write succeeded but the unread tail is already being dropped.
7. `measureMemoryIndexForNotice` (`GKd`, `:370938-370975`) accounts for raw versus spliced index
   surfaces and uses the stricter effective fraction.

**Why this approach:**
- YAML parse/serialize is not lossless. Refusing an unprovable metadata rewrite is safer than silently
  corrupting user-authored frontmatter.
- A verified surgical splice preserves comments, quoting, field order, and body bytes while still
  dating most hazardous documents.
- The 80% warning provides headroom for another write and estimation variance; a 70% target reduces
  immediate warning recurrence.
- Keeping the original write successful avoids losing new memory, while the high-salience follow-up
  directs the model to repair index discoverability.

**Key insight:** Integrity is enforced by proof obligations. If the target cannot prove a rewrite is
faithful, it prefers stale metadata over corrupted memory content.

## 2.1.220 to 2.1.227 conclusion

- UUID-cursor extraction, direct-write suppression, latest-context coalescing, five-turn forks,
  restricted tools, Dream thresholds, PID/mtime leasing, safe frontmatter stamping, and 80%/70% index
  budgeting are retained and independently re-anchored.
- The current prompt router is broader: it integrates connected stores and multiple team-memory forms
  while preserving the bounded index-first recall strategy.
- Session pause enforcement spans the permission layer and worker metadata even though the local slash
  command is disabled in this target build.
- No changelog bullet in 2.1.221–2.1.227 announces a replacement of the extraction or Dream algorithms;
  target inspection confirms incremental integration rather than a scheduler rewrite.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isAutoMemoryEnabled` (`Jh`) - availability/preference ladder.
- `getAutoMemoryDirectory` (`ym`) - canonical memory root.
- `buildMemorySystemPrompt` (`sIn`) - recall and backend router.
- `initExtractMemories` (`$Ys`) - extraction state machine.
- `executeExtractMemories` (`jQ_`) - extraction dispatcher.
- `drainPendingExtraction` (`zQ_`) - bounded shutdown drain.
- `createAutoMemoryToolPolicy` (`H4o`) - restricted fork permissions.
- `isAutoDreamEnabled` (`b4o`) - Dream rollout and preference decision.
- `initAutoDream` (`q8d`) - Dream scheduler.
- `tryAcquireDreamLock` (`tZ_`) - cross-process claim/read-back lease.
- `rollbackDreamLock` (`rZ_`) - checkpoint restoration.
- `parseFrontmatter` (`af`) - opt-in lossy-YAML detector.
- `stampMemoryFrontmatter` (`DBo`) - safe provenance/date update.
- `buildMemoryIndexSizeNotice` (`gGo`) - cap ratio selection and notice.
- `measureMemoryIndexForNotice` (`GKd`) - effective index measurement.
