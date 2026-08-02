# Auto-memory extraction pipeline — 2.1.220 current state

**Authoritative implementation:**
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`, principally
`:156903-157067`, `:160637-161307`, `:332350-332727`, and the stop-hook call at `:336419-336437`.

**Cross-validation only:** the 2.1.193 bundle at `:463390-463675 (193)` and the readable tree supplied
as 2.1.88, especially `src/services/extractMemories/extractMemories.ts`. The readable tree recovers
the design vocabulary and closure-state intent, but it is not treated as the 2.1.220 implementation.

This document fills the current-state gap left by the delta reports. The existing
[`README.md`](README.md), [`frontmatter_rewrite_safety.md`](frontmatter_rewrite_safety.md), and
[`memory_index_size_budget.md`](memory_index_size_budget.md) remain authoritative for the 193→220
format and size-limit changes.

---

## 1. System boundary

Auto-memory extraction is a **post-turn forked agent**, not part of the main model response. After the
main agent finishes a complete query loop, `handleStopHooks` (`Ycd`, `:336419`) starts the extractor
fire-and-forget at `:336433`. The fork sees the parent conversation and cache-safe request parameters,
but receives a constrained tool policy and writes no transcript of its own.

The complete 2.1.220 path is:

1. `handleStopHooks` checks main-agent status and the outer extraction gate.
2. `executeExtractMemories` (`GMy`, `:332715`) dispatches through a closure installed by
   `initExtractMemories` (`tHs`, `:332590`).
3. The inner entry point rejects subagents, a disabled `tengu_passport_quail` gate, disabled
   auto-memory, and a Remote Control child session.
4. The runner considers only messages after its UUID cursor.
5. It suppresses redundant extraction when the main agent already wrote memory, and suppresses turns
   with no substantive user prose.
6. A configurable turn throttle decides whether to run now.
7. The fork receives a precomputed memory-file manifest, a bounded five-turn budget, and a dedicated
   permission membrane.
8. Success advances the cursor, extracts verified written paths, emits telemetry, and optionally
   injects a compact “memory saved” system message.
9. Concurrent calls are coalesced into at most one trailing run; shutdown may drain all in-flight
   work for up to 60 seconds.

This architecture makes extraction best-effort and asynchronous while preserving a well-defined
completion boundary for non-interactive shutdown.

---

## 2. Eligibility and dispatch

### Auto-memory enablement ladder

**What it does:** Determines whether the memory subsystem itself may read or write in the current
process before the extraction-specific gate is considered.

**How it works:**
1. `isAutoMemoryEnabled` (`xm`, `:156938`) first rejects paused memory and safe mode.
2. `CLAUDE_CODE_DISABLE_AUTO_MEMORY=true` disables it; an explicitly false value forces it on.
3. `CLAUDE_CODE_SIMPLE` disables it.
4. A remote process without a remote memory directory or Cowork override is rejected.
5. A model-deny feature-gate pair can reject the active model.
6. An explicit `autoMemoryEnabled` setting wins next.
7. Otherwise auto-memory defaults to enabled.

**Why this approach:**
- Cheap local policy checks run before any disk scan or model call.
- Environment and safety controls outrank a user setting because they describe process capabilities,
  not preference.
- Default-on behavior preserves memory continuity, while explicit pause/safe/simple modes remain hard
  stops.
- An alternative single boolean would be simpler, but could not express remote storage availability,
  per-model disablement, or emergency environment overrides.

**Key insight:** `autoMemoryEnabled` is only one rung in a precedence ladder. Reading that setting
alone overstates availability.

### Extraction-specific entry gate

**What it does:** Prevents recursive or unsupported extraction and coalesces a call that arrives while
another extraction is running.

**How it works:**
1. Reject when `toolUseContext.agentId` is present, so a fork cannot recursively launch another memory
   fork.
2. Require `tengu_passport_quail` even though the stop-hook caller already checks the outer gate.
3. Require `isAutoMemoryEnabled`.
4. Reject a Remote Control child (`ru() !== null`).
5. If an extraction is already running, replace the pending context with this newest context and
   return immediately.
6. Otherwise enter the extraction runner.

**Why this approach:**
- Repeating the gate inside the service protects callers other than the normal stop-hook path.
- Rejecting subagents prevents geometric fan-out and keeps memory ownership with the main session.
- Latest-context replacement is safe because the newest transcript is a superset of earlier pending
  transcripts.
- Queueing every call would preserve arrival history but perform redundant scans and model calls.

**Key insight:** The pending slot is a **latest-state latch**, not a work queue.

```javascript
// ============================================
// executeExtractMemoriesImpl - Applies extraction gates and coalesces overlap
// Location: cli_inner_pretty.js:332688-332700
// ============================================

// ORIGINAL (for source lookup):
async function a(l, c) {
  if (l.toolUseContext.agentId) return;
  if (!Ke("tengu_passport_quail", !1)) return;
  if (!xm()) return;
  if (ru() !== null) return;
  if (n) {
    (w("[extractMemories] extraction in progress \u2014 stashing for trailing run"),
      O("tengu_extract_memories_coalesced", {}),
      (i = { context: l, appendSystemMessage: c }));
    return;
  }
  await s({ context: l, appendSystemMessage: c });
}

// READABLE (for understanding):
async function executeExtractMemoriesImpl(context, appendSystemMessage) {
  if (context.toolUseContext.agentId) return;
  if (!getFeatureValue("tengu_passport_quail", false)) return;
  if (!isAutoMemoryEnabled()) return;
  if (getRemoteControlSession() !== null) return;
  if (extractionInProgress) {
    logExtractionCoalesced();
    pendingContext = { context, appendSystemMessage };
    return;
  }
  await runExtraction({ context, appendSystemMessage });
}

// Mapping: a→executeExtractMemoriesImpl, l→context, c→appendSystemMessage,
//          n→extractionInProgress, i→pendingContext, s→runExtraction
```

---

## 3. Incremental cursor and relevance filters

### Compaction-tolerant UUID cursor

**What it does:** Counts only model-visible messages added since the last successful or intentionally
skipped extraction.

**How it works:**
1. With no cursor, count every `user` or `assistant` message.
2. With a cursor, scan until its UUID is found and count visible messages after it.
3. Ignore progress, attachment, and system-only records because they are not the conversational signal
   the fork is meant to summarize.
4. If the cursor UUID is missing, count the entire visible transcript.
5. Advance the cursor after a successful fork or after a deliberate direct-write/no-prose skip.
6. Do **not** advance it on fork failure, allowing a later turn to retry the same evidence.

**Why this approach:**
- UUIDs survive insertions and are more robust than array offsets.
- Context compaction can remove the cursor message; treating “not found” as zero would permanently
  disable extraction for that session.
- Reprocessing the compacted visible history is costlier but safe, whereas silently losing all future
  extraction is not.
- Advancing only on success gives at-least-once consideration of meaningful turns.

**Key insight:** The missing-cursor fallback deliberately prefers duplicate consideration over
permanent starvation.

```javascript
// ============================================
// countModelVisibleMessagesSince - Counts conversational messages after a UUID cursor
// Location: cli_inner_pretty.js:332427-332440
// ============================================

// ORIGINAL (for source lookup):
function OMy(e, t) {
  if (t === null || t === void 0) return pr(e, eHs);
  let r = !1,
    n = 0;
  for (let o of e) {
    if (!r) {
      if (o.uuid === t) r = !0;
      continue;
    }
    if (eHs(o)) n++;
  }
  if (!r) return pr(e, eHs);
  return n;
}

// READABLE (for understanding):
function countModelVisibleMessagesSince(messages, cursorUuid) {
  if (cursorUuid == null) return count(messages, isModelVisibleMessage);
  let foundCursor = false;
  let countAfterCursor = 0;
  for (const message of messages) {
    if (!foundCursor) {
      if (message.uuid === cursorUuid) foundCursor = true;
      continue;
    }
    if (isModelVisibleMessage(message)) countAfterCursor++;
  }
  if (!foundCursor) return count(messages, isModelVisibleMessage);
  return countAfterCursor;
}

// Mapping: OMy→countModelVisibleMessagesSince, e→messages, t→cursorUuid,
//          r→foundCursor, n→countAfterCursor, eHs→isModelVisibleMessage
```

### Direct-write mutual exclusion

**What it does:** Avoids launching a second agent when the main conversation has already updated an
auto-memory file in the same cursor window.

**How it works:**
1. Scan assistant messages after the cursor.
2. Inspect only Edit/Write `tool_use` blocks.
3. Extract `file_path` and test it against the auto-memory root.
4. On the first match, skip the fork, advance the cursor, and emit
   `tengu_extract_memories_skipped_direct_write`.

**Why this approach:**
- The main agent already has memory-writing guidance; a second interpretation could duplicate or
  conflict with its explicit write.
- Tool-use inspection is deterministic and cheaper than comparing directory snapshots.
- This does not inspect shell-mediated writes, a trade-off for avoiding full shell-command semantics
  on the hot path.

**Key insight:** Main-agent and background-agent writes are mutually exclusive per cursor range, but
the exclusion proof is limited to recognized Edit/Write operations.

### Substantive-user-prose filter

**What it does:** Suppresses extraction for tool-only, meta-only, or trivial turns that are unlikely to
contain durable user information.

**How it works:**
1. Consider only non-meta user messages.
2. For string content, split on whitespace and require at least `3` non-empty tokens.
3. For block-array content, accept when any text block meets that threshold.
4. Search after the cursor; if compaction removed the cursor, rescan the whole transcript.
5. On failure, advance the cursor and emit `tengu_extract_memories_skipped_no_prose`.

**Why this approach:**
- A three-token lexical threshold is extremely cheap and avoids model calls after acknowledgements or
  mechanical UI turns.
- It is intentionally language-agnostic but imperfect for languages that do not separate words with
  spaces.
- Semantic classification would be more accurate but would defeat the cost-saving purpose.

**Key insight:** This is a cost heuristic, not a claim that short text can never contain memory-worthy
information.

```javascript
// ============================================
// hasSubstantiveUserProseSince - Finds non-meta user text of at least three tokens
// Location: cli_inner_pretty.js:332461-332479
// ============================================

// ORIGINAL (for source lookup):
function Hld(e) {
  if (e.type !== "user" || e.isMeta) return !1;
  let t = e.message.content;
  if (typeof t === "string") return kld(t) >= xld;
  if (!Array.isArray(t)) return !1;
  return t.some((r) => r.type === "text" && kld(r.text) >= xld);
}
function NMy(e, t) {
  let r = t === void 0;
  for (let n of e) {
    if (!r) {
      if (n.uuid === t) r = !0;
      continue;
    }
    if (Hld(n)) return !0;
  }
  if (!r) return e.some(Hld);
  return !1;
}

// READABLE (for understanding):
function isSubstantiveUserProse(message) {
  if (message.type !== "user" || message.isMeta) return false;
  const content = message.message.content;
  if (typeof content === "string") return countWords(content) >= MIN_USER_PROSE_WORDS;
  if (!Array.isArray(content)) return false;
  return content.some(block => block.type === "text" && countWords(block.text) >= MIN_USER_PROSE_WORDS);
}
function hasSubstantiveUserProseSince(messages, cursorUuid) {
  let afterCursor = cursorUuid === undefined;
  for (const message of messages) {
    if (!afterCursor) {
      if (message.uuid === cursorUuid) afterCursor = true;
      continue;
    }
    if (isSubstantiveUserProse(message)) return true;
  }
  if (!afterCursor) return messages.some(isSubstantiveUserProse);
  return false;
}

// Mapping: Hld→isSubstantiveUserProse, NMy→hasSubstantiveUserProseSince,
//          kld→countWords, xld→MIN_USER_PROSE_WORDS, e→messages/message, t→cursorUuid
```

---

## 4. Throttling and overlap control

### Turn throttle plus single trailing run

**What it does:** Limits extraction frequency and prevents overlapping forks while retaining the newest
work that arrived during a run.

**How it works:**
1. Read `tengu_bramble_lintel`, defaulting to `1` eligible turn.
2. Increment `turnsSinceLastExtraction` only for a normal run.
3. Return until the threshold is reached, then reset the counter and mark the runner in progress.
4. Calls arriving during the fork overwrite `pendingContext` with the latest context.
5. In `finally`, clear the in-progress flag and take the pending context once.
6. Run that context as a trailing run only when the configured threshold is `<= 1`.
7. The trailing run bypasses the turn throttle and recomputes its message count from the cursor advanced
   by the just-finished run.

**Why this approach:**
- The threshold provides a remote cost/latency dial without changing the service architecture.
- A single pending slot bounds memory and avoids a queue of redundant transcript supersets.
- Skipping the trailing run when the threshold is greater than one preserves the configured cadence;
  immediately processing it would undermine throttling.
- Running the recursive continuation inside `finally` means the outer promise covers the entire chain,
  which makes shutdown draining correct.

**Key insight:** Coalescing is coupled to cursor advancement: the trailing run sees only messages that
arrived while the first run was active.

### In-flight drain

**What it does:** Gives command-line shutdown a bounded opportunity to finish memory writes.

**How it works:**
1. Every public extraction promise is inserted into an in-flight `Set`.
2. It is removed in `finally`, regardless of success.
3. The drainer returns immediately for an empty set.
4. Otherwise it races `Promise.all` against an unreferenced 60-second timer.
5. Individual extraction errors are swallowed at the drain boundary because they were already logged
   inside the best-effort service.

**Why this approach:**
- Fire-and-forget keeps interactive response latency low.
- Draining after output flush prevents normal process exit from cutting off useful writes.
- A hard wait would make shutdown hang on network failure; a soft timeout bounds that risk.

**Key insight:** The in-flight promise covers recursive trailing work, so draining the set is stronger
than merely waiting for the first fork.

---

## 5. Permission membrane

### Root-bound tool policy

**What it does:** Lets the extraction agent inspect context and maintain Markdown memories without
granting general write or shell capability.

**How it works:**
1. Deny everything while memory is paused.
2. Allow the REPL wrapper; inner primitive calls are checked again by the same policy.
3. Allow Read/Grep/Glob only after their normal permission-context check succeeds.
4. Allow shell commands classified as read-only.
5. Additionally allow a single simple deletion command, but only for `.md` paths under the supplied
   memory root and outside protected subdirectories.
6. POSIX `rm` forbids redirects, environment assignments, globs, relative paths, compound commands,
   and every option except `-f`/`--force`.
7. PowerShell aliases are tokenized conservatively; arbitrary flags and metacharacters are rejected.
8. Allow Edit/Write only when `file_path` passes the same root-bound `.md` containment test.
9. Deny all other tools and emit sanitized telemetry.

**Why this approach:**
- The model needs deletion to prune stale memories during Dream, but general shell writes would make
  the fork a broad ambient authority.
- Parsing the POSIX command through the shell parser avoids unsafe string-prefix checks.
- Absolute, root-bound paths plus protected-directory rejection defend against traversal into `.git`,
  `.claude`, `agents`, and similar control surfaces.
- Allowing unrestricted read-only inspection improves synthesis quality, at the privacy cost that the
  fork can read outside memory; the fork already inherits the parent session's read context.

**Key insight:** The effective rule is not “writes under a path”; it is “Markdown writes/deletes under
the exact supplied root, excluding normalized protected segments.”

```javascript
// ============================================
// isAllowedPosixMemoryDelete - Accepts only simple absolute rm operations on safe Markdown paths
// Location: cli_inner_pretty.js:332503-332534
// ============================================

// ORIGINAL (for source lookup):
async function UMy(e, t) {
  let r = await aVe(e);
  if (r.kind !== "simple") return !1;
  if (r.commands.length !== 1) return !1;
  let n = r.commands[0];
  if (!n) return !1;
  if (n.argv[0] !== "rm") return !1;
  if (n.redirects.length > 0) return !1;
  if (n.envVars.length > 0) return !1;
  let o = 0,
    i = !1;
  for (let s = 1; s < n.argv.length; s++) {
    let a = n.argv[s];
    if (a === void 0) continue;
    if (!i) {
      if (a === "--") {
        i = !0;
        continue;
      }
      if (a.startsWith("-")) {
        if (a === "-f" || a === "--force") continue;
        return !1;
      }
    }
    if (/[*?[]/.test(a)) return !1;
    if (!a.startsWith("/") || !W1t(a, t)) return !1;
    o++;
  }
  return o > 0;
}
function W1t(e, t) {
  return e.endsWith(".md") && gVr(e, t);
}

// READABLE (for understanding):
async function isAllowedPosixMemoryDelete(command, memoryRoot) {
  const parsed = await parseShellCommand(command);
  if (parsed.kind !== "simple" || parsed.commands.length !== 1) return false;
  const cmd = parsed.commands[0];
  if (!cmd || cmd.argv[0] !== "rm" || cmd.redirects.length > 0 || cmd.envVars.length > 0) return false;
  let pathCount = 0;
  let afterDoubleDash = false;
  for (const arg of cmd.argv.slice(1)) {
    if (arg === undefined) continue;
    if (!afterDoubleDash && arg === "--") { afterDoubleDash = true; continue; }
    if (!afterDoubleDash && arg.startsWith("-")) {
      if (arg === "-f" || arg === "--force") continue;
      return false;
    }
    if (/[*?[]/.test(arg)) return false;
    if (!arg.startsWith("/") || !isAllowedAutoMemWritePath(arg, memoryRoot)) return false;
    pathCount++;
  }
  return pathCount > 0;
}
function isAllowedAutoMemWritePath(path, memoryRoot) {
  return path.endsWith(".md") && isPathInsideUnprotectedMemoryRoot(path, memoryRoot);
}

// Mapping: UMy→isAllowedPosixMemoryDelete, W1t→isAllowedAutoMemWritePath,
//          e→command/path, t→memoryRoot, r→parsed, n→cmd, o→pathCount, i→afterDoubleDash
```

The 2.1.193 twin allowed arbitrary non-recursive POSIX flags. In 2.1.220 only force is accepted. This
is a real hardening delta: it removes parser-dependent option behavior and makes the prompt's
“`rm` takes no flags except `-f`” claim executable policy.

---

## 6. Fork execution and result accounting

### Manifest-first bounded extraction

**What it does:** Runs the memory model with enough existing-state context to update rather than
duplicate records, while bounding cost and transcript side effects.

**How it works:**
1. Scan memory files only after the turn throttle passes.
2. Format a manifest and inject it directly into the extraction prompt.
3. Select personal-only or combined personal/team guidance based on active team stores.
4. Reuse cache-safe parameters from the parent conversation.
5. Launch with `querySource` and `forkLabel` both set to `extract_memories`.
6. Set `skipTranscript: true` and `maxTurns: 5`.
7. Optionally set `skipCacheWrite` under the basalt feature combination.
8. On success, advance the cursor and collect only root-validated Edit/Write paths.

**Why this approach:**
- Pre-injecting the manifest saves the fork's first `ls` turn and steers it toward updates.
- Five turns accommodate read→write→verify behavior but cap rabbit holes.
- Sharing the parent prompt/tool cache reduces the extra request's input cost.
- Skipping transcript output avoids races with the main thread and prevents the memory worker from
  becoming future conversation content.

**Key insight:** The manifest scan is deliberately placed **after** throttling, so skipped turns incur
neither filesystem scan nor model cost.

### Success, failure, and notification semantics

**What it does:** Separates mechanical index writes from user-visible saved memories and treats the
entire service as best-effort.

**How it works:**
1. Collect and deduplicate verified written paths.
2. Exclude `MEMORY.md` from the semantic memory count because it is only an index.
3. Count team-memory paths separately.
4. Emit usage, turns, files written, memories saved, team saves, and duration.
5. Append a compact saved-memory system message only when at least one non-index path was written.
6. On any error, log and emit `tengu_extract_memories_error`; do not notify the user and do not advance
   the cursor.

**Why this approach:**
- Counting the index as a saved memory would inflate telemetry and user messages.
- Best-effort failure prevents a background persistence feature from failing the user's foreground
  request.
- Retaining the cursor on failure makes the next eligible run a retry.

**Key insight:** A successful fork that writes only `MEMORY.md` is operationally successful but reports
zero saved memories.

---

## 7. Three-way cross-validation

### 2.1.220 versus 2.1.193

The orchestration skeleton is carryover. The 193 functions at `:463390-463675 (193)` already contain
the UUID cursor, direct-write skip, three-token prose test, turn throttle, latest-context coalescing,
five-turn fork, success-only cursor advancement, telemetry, and 60-second drain.

Confirmed 2.1.220 changes in this surface:

- The write/delete path validator now receives the exact memory root instead of relying only on a
  global root helper (`W1t(path, root)`, `:332533`).
- POSIX deletion accepts only `-f`/`--force`; 193 rejected recursive flags but otherwise allowed flags.
- The prompt explicitly describes protected subdirectories and the force-only deletion rule.
- The extraction prompt can omit legacy type/scope prose when the compact memory-prompt variant is
  active (`N$e()`, `:332377-332407`).
- Team-memory detection includes discovered mounted stores (`wj() || n1().length > 0`, `:332615`).

### 2.1.220 versus the readable 2.1.88 reference

The readable `extractMemories.ts` validates these semantic names and design choices:

- `isModelVisibleMessage`, `countModelVisibleMessagesSince`, and `hasMemoryWritesSince` match the 220
  helpers structurally.
- `initExtractMemories` documents the closure-owned cursor, overlap guard, and latest pending context.
- `runForkedAgent`, cache-safe parameters, `skipTranscript`, `maxTurns: 5`, success-only cursor advance,
  and the in-flight drain all align.

It does **not** prove the full 220 state. The supplied readable file lacks the 220/193 substantive-prose
filter and its no-prose telemetry, has a narrower deletion policy, does not pass an explicit root to
every output-path validation, and differs in team-memory/prompt wiring. Those facts were therefore
derived from the 2.1.220 bundle, not backfilled from readable names.

### Confidence

**HIGH** for the execution, cursor, throttling, coalescing, permission, and drain algorithms: their
complete 2.1.220 bodies were read and their 193 twins were inspected side-by-side.

**MEDIUM-HIGH** for the readable-source ancestry statement: the function shapes and comments are
strong corroboration, but the supplied tree is not build-identical and cannot establish 220-only
branches.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_auto_memory.md](../00_overview/symbol_additions_v2_1_220_auto_memory.md).

Key functions in this document:
- `isAutoMemoryEnabled` (`xm`, `:156938`) - process, environment, model, and settings eligibility ladder
- `buildMemoryExtractionPrompt` (`Tld`, `:332357`) - manifest-first constrained fork prompt
- `countModelVisibleMessagesSince` (`OMy`, `:332427`) - compaction-tolerant UUID cursor counter
- `hasMemoryWritesSince` (`$My`, `:332441`) - main-agent/background-agent mutual exclusion check
- `hasSubstantiveUserProseSince` (`NMy`, `:332468`) - three-token non-meta user-prose filter
- `isAllowedPosixMemoryDelete` (`UMy`, `:332503`) - parsed force-only Markdown deletion validator
- `isAllowedAutoMemWritePath` (`W1t`, `:332533`) - root-bound protected-path predicate
- `createAutoMemCanUseTool` (`Nwo`, `:332536`) - fork permission membrane
- `extractWrittenPaths` (`jMy`, `:332577`) - verified output-path collector
- `initExtractMemories` (`tHs`, `:332590`) - closure state, throttle, fork, coalescing, and drain setup
- `executeExtractMemories` (`GMy`, `:332715`) - public stop-hook entry point
- `drainPendingExtraction` (`WMy`, `:332718`) - bounded graceful-shutdown drain
