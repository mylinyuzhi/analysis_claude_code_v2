# Precomputed and reactive compaction — 2.1.220 current-state analysis

**Authoritative source:**
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
All unqualified locations refer to that bundle. The 2.1.193 bundle is used only for delta
validation, and `/lyz/codespace/3rd/claude-code/src/services/compact/` only for readable semantic
cross-checking.

## Executive result

2.1.220 operates two cooperating mechanisms:

1. **Precomputed compaction** starts the expensive summary before the blocking limit, keeps a
   per-agent `pending | ready | failed` entry, and swaps it into the live turn when the threshold or a
   withheld 413 is reached.
2. **Reactive compaction** is the correctness fallback. It summarizes the oldest API-round groups,
   preserves a recent suffix verbatim, and expands that suffix adaptively when the summary request is
   itself too large.

The important 2.1.220 addition over 2.1.193 is not the in-memory state machine; that already existed.
It is the **main-session persistence and rehydration layer**: a versioned `.precompact.json` sidecar,
bounded at 8,000,000 bytes, serialized writes/deletes, and rejection checks for stale or incompatible
conversation state. This is what makes a ready precompute reusable after resume without trusting an
orphaned summary blindly.

## 1. Feature gates and ownership

### Precomputed-compaction enablement

**What it does:** Decides whether the process may arm or consume precomputed summaries.

**How it works:**
1. `isAutoCompactEnabled` (`KI`) must permit auto-compaction.
2. `isReactiveCompactAllowed` (`ESe`) must permit the reactive architecture.
3. the remote feature `tengu_sepia_moth` must be true;
4. the resolved `precomputeCompactionEnabled` setting must be true. Its bundled default function
   `precomputeCompactionDefault` (`kdr`) returns false.
5. Persistence is a second, independent gate: `tengu_amber_packet` must be true and the environment
   predicate `w1()` must be false. Therefore in-memory precompute can run without disk persistence.

**Why this approach:**
- A risky latency optimization is independently kill-switchable from ordinary and reactive compact.
- Separating persistence limits the blast radius of filesystem or resume defects without disabling
  same-process precompute.
- The conservative false default makes server-side/config rollout explicit.

**Key insight:** The precompute gate authorizes computation; it does not imply that a sidecar exists or
is reusable.

```javascript
// ============================================
// isPrecomputedCompactionEnabled - Resolve all runtime gates for precompute
// Location: cli_inner_pretty.js:328456-328461
// ============================================

// ORIGINAL (for source lookup):
function Hnn() {
  if (!KI()) return !1;
  if (!ESe()) return !1;
  if (!Ke("tengu_sepia_moth", !1)) return !1;
  return Pc("precomputeCompactionEnabled", kdr()).value;
}

// READABLE (for understanding):
function isPrecomputedCompactionEnabled() {
  if (!isAutoCompactEnabled()) return false;
  if (!isReactiveCompactAllowed()) return false;
  if (!feature("tengu_sepia_moth", false)) return false;
  return resolveSetting("precomputeCompactionEnabled", precomputeCompactionDefault()).value;
}

// Mapping: Hnn→isPrecomputedCompactionEnabled, KI→isAutoCompactEnabled, ESe→isReactiveCompactAllowed, Ke→feature, Pc→resolveSetting, kdr→precomputeCompactionDefault
```

## 2. Sidecar persistence and rehydration

### Versioned, bounded sidecar write

**What it does:** Persists only the material needed to reconstruct a ready summary.

**How it works:**
1. `getPrecompactSidecarPath` (`Hdr`) replaces the transcript's `.jsonl` suffix with
   `.precompact.json`.
2. `persistPrecompactSidecar` (`zsd`) JSON-serializes the payload and measures UTF-8 bytes.
3. Payloads over `MAX_PRECOMPACT_SIDECAR_BYTES` (`Bxs = 8,000,000`) are rejected before I/O.
4. Accepted payloads use `sp(path, data, 384)`: the existing secure/atomic write helper with mode
   decimal 384 (`0600`).
5. All writes and deletes are placed on `precompactSidecarIOChain` (`jxs`) by
   `serializePrecompactSidecarIO` (`XAo`), even after an earlier operation rejects.

**Why this approach:**
- Storing message UUIDs rather than duplicate retained messages keeps the sidecar smaller and makes
  the current transcript the authority for verbatim content.
- A hard size ceiling prevents an unexpectedly huge summary from becoming an unbounded resume cost.
- A promise chain prevents an older delete racing a newer write for the same session.

**Key insight:** The sidecar is a cache, not a second transcript; deletion errors are intentionally
ignored because loss of the cache must not break the conversation.

```javascript
// ============================================
// persistPrecompactSidecar - Size-check and securely write a precompute cache
// Location: cli_inner_pretty.js:328348-328356
// ============================================

// ORIGINAL (for source lookup):
async function zsd(e, t = Hdr(e.sessionId)) {
  let r = Ie(e),
    n = Buffer.byteLength(r, "utf8");
  if (n > Bxs) return { ok: !1, reason: "too_large", bytes: n };
  try {
    return (await sp(t, r, 384), { ok: !0, bytes: n });
  } catch (o) {
    return { ok: !1, reason: "write_error", bytes: n, detail: le(o) };
  }
}

// READABLE (for understanding):
async function persistPrecompactSidecar(payload, path = getPrecompactSidecarPath(payload.sessionId)) {
  const serialized = jsonStringify(payload);
  const bytes = Buffer.byteLength(serialized, "utf8");
  if (bytes > MAX_PRECOMPACT_SIDECAR_BYTES) return { ok: false, reason: "too_large", bytes };
  try {
    await secureAtomicWrite(path, serialized, 0o600);
    return { ok: true, bytes };
  } catch (error) {
    return { ok: false, reason: "write_error", bytes, detail: getErrorMessage(error) };
  }
}

// Mapping: zsd→persistPrecompactSidecar, e→payload, t→path, Hdr→getPrecompactSidecarPath, Ie→jsonStringify, Bxs→MAX_PRECOMPACT_SIDECAR_BYTES, sp→secureAtomicWrite, le→getErrorMessage
```

### Rehydration validator

**What it does:** Reconstructs an in-memory `ready` entry only when the sidecar still describes the
current main-session history.

**How it works:**
1. It runs only for agent key `main`, never for the compact query source, and only when persistence and
   precompute are enabled.
2. `rehydratedSessions` (`Wxs`) allows one load attempt per current session; an existing in-memory
   entry wins over disk.
3. `loadPrecompactSidecar` (`Ksd`) validates file size before and after reading, JSON shape, version 1,
   scalar fields, non-empty summary messages, UUID arrays, and finite numeric fields.
4. `rehydratePrecomputedCompaction` (`tad`) rejects session/model mismatch, invalid timestamps,
   age over seven days, a missing precompute boundary UUID, growth over 150,000 estimated tokens, or
   shrinkage greater than half of the recorded token count.
5. Every preserved UUID must still resolve in the current messages. The current message objects, not
   serialized copies, become `messagesToPreserve`.
6. Success creates a resolved `ready` entry and records whether the sidecar's CLI version matches;
   mismatch is telemetry, not a rejection.
7. Any substantive rejection schedules sidecar deletion and emits a reasoned telemetry event.

**Why this approach:**
- UUID continuity proves that both the summary boundary and retained suffix still refer to this
  transcript.
- Asymmetric growth/shrink checks tolerate ordinary continuation but reject histories rewritten far
  enough that summary relevance is doubtful.
- The CLI version is deliberately informational because the payload has its own schema version.

**Key insight:** Resume safety is based on conversation identity and structural continuity, not merely
file freshness.

```javascript
// ============================================
// rehydratePrecomputedCompaction - Validate a persisted ready summary against live history
// Location: cli_inner_pretty.js:328471-328520
// ============================================

// ORIGINAL (for source lookup):
function tad(e, t, r, n) {
  if (e !== "main" || Inn(t) || !Vxs() || !Hnn()) return;
  let o = kt();
  if (Wxs.has(o)) return;
  if (T9.has(e)) return;
  Wxs.add(o);
  let i = Ksd(o);
  if (!i.ok) {
    if (i.reason !== "absent") Qsd(o, i.reason, void 0);
    return;
  }
  let { payload: s } = i,
    a = Math.max(0, Date.now() - Date.parse(s.createdAt)),
    l = (p) => Qsd(o, p, a);
  if (s.sessionId !== o) return l("session_mismatch");
  if (s.model !== n) return l("model_mismatch");
  if (!Number.isFinite(a)) return l("bad_timestamp");
  if (a > WPy) return l("too_old");
  if (r.every((p) => p.uuid !== s.precomputedAtUuid)) return l("boundary_missing");
  let c = Y0(r) - s.preCompactTokens;
  if (c > qPy) return l("grew_too_much");
  if (c < -(s.preCompactTokens / 2)) return l("shrank_too_much");
  let u = new Map(r.map((p) => [p.uuid, p])),
    d = s.preserveUuids.flatMap((p) => {
      let f = u.get(p);
      return f === void 0 ? [] : [f];
    });
  if (d.length !== s.preserveUuids.length) return l("preserve_uuid_missing");
  (T9.set(e, {
    status: "ready",
    result: Ysd(s, d),
    precomputedAtUuid: s.precomputedAtUuid,
    preCompactTokens: s.preCompactTokens,
    startedAt: performance.now() - a,
    readyDurationMs: s.readyDurationMs,
    abortController: new AbortController(),
    preCompactHookDisplay: s.preCompactHookDisplay,
    settled: Promise.resolve(),
    rehydrated: !0,
    sidecarSessionId: o,
  }),
    O("tengu_precomputed_compact_rehydrated", {
      ageMs: Math.round(a),
      preCompactTokens: s.preCompactTokens,
      growthTokens: c,
      summaryBytes: Buffer.byteLength(s.summaryText, "utf8"),
      cliVersionMatch: s.cliVersion === ead,
    }),
    w(`precomputed compact: rehydrated (${e}, age ${Math.round(a)}ms, growth ~${c} tok)`));
}

// READABLE (for understanding):
function rehydratePrecomputedCompaction(agentKey, querySource, messages, model) {
  if (agentKey !== "main" || isCompactQuerySource(querySource) || !isPersistenceEnabled() || !isPrecomputeEnabled()) return;
  const sessionId = getSessionId();
  if (rehydratedSessions.has(sessionId) || precomputeState.has(agentKey)) return;
  rehydratedSessions.add(sessionId);
  const loaded = loadPrecompactSidecar(sessionId);
  if (!loaded.ok) return rejectUnlessAbsent(loaded.reason);
  const payload = loaded.payload;
  const ageMs = Math.max(0, Date.now() - Date.parse(payload.createdAt));
  if (payload.sessionId !== sessionId) return reject("session_mismatch");
  if (payload.model !== model) return reject("model_mismatch");
  if (!Number.isFinite(ageMs) || ageMs > MAX_REHYDRATE_AGE_MS) return reject("too_old");
  if (!messages.some(message => message.uuid === payload.precomputedAtUuid)) return reject("boundary_missing");
  const growthTokens = estimateTokens(messages) - payload.preCompactTokens;
  if (growthTokens > MAX_REHYDRATE_GROWTH_TOKENS) return reject("grew_too_much");
  if (growthTokens < -(payload.preCompactTokens / 2)) return reject("shrank_too_much");
  const byUuid = new Map(messages.map(message => [message.uuid, message]));
  const preserved = payload.preserveUuids.flatMap(uuid => byUuid.has(uuid) ? [byUuid.get(uuid)] : []);
  if (preserved.length !== payload.preserveUuids.length) return reject("preserve_uuid_missing");
  precomputeState.set(agentKey, makeReadyState(payload, preserved, ageMs));
}

// Mapping: tad→rehydratePrecomputedCompaction, e→agentKey, t→querySource, r→messages, n→model, Inn→isCompactQuerySource, Vxs→isPrecomputePersistenceEnabled, Hnn→isPrecomputedCompactionEnabled, kt→getSessionId, Wxs→rehydratedSessions, T9→precomputeState, Ksd→loadPrecompactSidecar, Qsd→rejectRehydratedPrecompute, WPy→MAX_REHYDRATE_AGE_MS, qPy→MAX_REHYDRATE_GROWTH_TOKENS, Y0→estimateTokens, Ysd→rehydratePrecompactResult
```

## 3. The precompute state machine

### Arming and guarded settlement

**What it does:** Starts a summary early without allowing a stale async completion to overwrite newer
state.

**How it works:**
1. `shouldArmPrecomputedCompaction` (`zxs`) rejects a completed auto-compact, a pre-first-compact fork,
   a turn that already tried reactive compact, and the transition immediately after a precomputed
   swap. It finally applies the blocking-window predicate.
2. `armPrecomputedCompaction` (`Kxs`) rechecks all gates, attempts rehydration first, caps consecutive
   meaningful failures at three, and rejects a missing message boundary.
3. SDK sessions with at most one user prompt and no rewritten history are gated once. This avoids
   spending a parallel summary call on single-shot SDK invocations.
4. The function snapshots messages, token estimate, model, session/path, and a cloned tool context with
   its own abort controller and no compact UI callback.
5. It runs the PreCompact hook, then `summarizeOldGroupsReactively` (`qAo`) in an async task.
6. Aborts and `too_few_groups` do not increment the consecutive-failure cap. Other non-abort failures
   do; the third emits `tengu_precomputed_compact_rearm_capped`.
7. A successful result becomes `ready`, resets the failure cap, and is persisted for the main agent if
   the persistence gate is active.
8. `settlePendingPrecompute` (`YAo`) mutates state only if both status is still `pending` and the stored
   abort controller is the same object. A late completion from a cleared/replaced task is therefore
   inert.

**Why this approach:**
- The early request improves threshold-turn latency, but its result is speculative; identity-guarded
  settlement prevents it from resurrecting discarded work.
- Failure capping controls API cost while excluding conditions that do not predict another request
  will fail.
- PreCompact hooks execute at arm time so hook-supplied summary instructions are baked into the cached
  result.

**Key insight:** The abort controller doubles as a generation token. Object identity, not just agent
key, protects the state map from stale promise completion.

```javascript
// ============================================
// settlePendingPrecompute - Commit an async transition only to its original pending generation
// Location: cli_inner_pretty.js:328726-328734
// ============================================

// ORIGINAL (for source lookup):
function YAo(e, t, r) {
  let n = T9.get(e);
  if (n?.status !== "pending" || n.abortController !== t) return;
  if (r === null) {
    T9.delete(e);
    return;
  }
  T9.set(e, r(n));
}

// READABLE (for understanding):
function settlePendingPrecompute(agentKey, generationController, transition) {
  const current = precomputeState.get(agentKey);
  if (current?.status !== "pending" || current.abortController !== generationController) return;
  if (transition === null) {
    precomputeState.delete(agentKey);
    return;
  }
  precomputeState.set(agentKey, transition(current));
}

// Mapping: YAo→settlePendingPrecompute, e→agentKey, t→generationController, r→transition, T9→precomputeState
```

### Borrow versus consume

**What it does:** Supports both ownership transfer and temporary use of another agent's precompute.

**How it works:**
1. `borrowPrecomputedCompaction` (`KPy`) waits for a pending entry but leaves it in the map.
2. `consumePrecomputedCompaction` (`Yxs`) waits, removes the entry, and schedules deletion of its
   sidecar.
3. Both race settlement against the current turn's abort signal. If the turn aborts, the entry remains
   available rather than being destroyed.
4. `tryApplyPrecomputedCompaction` (`Xxs`) may borrow from an explicit agent key, otherwise consumes the
   current agent's entry.
5. A borrowed boundary miss is telemetry only; an owned boundary miss records a discard reason.
6. Success computes `messagesSince` strictly after `precomputedAtUuid`, excluding progress records.
   Those messages are appended to the precomputed retained suffix during reactive finalization.

**Why this approach:**
- Borrowing lets a fork reuse a main-thread computation without stealing it.
- Waiting on pending work is worthwhile only at the actual limit; an aborted user turn must not consume
  a summary it never installed.
- Boundary lookup makes the splice explicit and prevents a summary from silently replacing unrelated
  history.

**Key insight:** A precomputed summary describes history only through one UUID. Correctness comes from
preserving everything after that UUID verbatim at swap time.

```javascript
// ============================================
// messagesAfterPrecomputeBoundary - Recover live messages not covered by the cached summary
// Location: cli_inner_pretty.js:328889-328893
// ============================================

// ORIGINAL (for source lookup):
function Jxs(e, t) {
  let r = e.findIndex((n) => n.uuid === t);
  if (r === -1) return null;
  return e.slice(r + 1).filter((n) => n.type !== "progress");
}

// READABLE (for understanding):
function messagesAfterPrecomputeBoundary(messages, boundaryUuid) {
  const boundaryIndex = messages.findIndex(message => message.uuid === boundaryUuid);
  if (boundaryIndex === -1) return null;
  return messages.slice(boundaryIndex + 1).filter(message => message.type !== "progress");
}

// Mapping: Jxs→messagesAfterPrecomputeBoundary, e→messages, t→boundaryUuid, r→boundaryIndex
```

## 4. Reactive suffix-preserving algorithm

### Adaptive group preservation

**What it does:** Finds a summary request that fits while retaining the newest coherent conversation
groups verbatim.

**How it works:**
1. `summarizeOldGroupsReactively` (`qAo`) groups messages by API round with
   `groupMessagesByApiRound` (`Cnn`). Fewer than two groups cannot be compacted.
2. It starts by preserving one newest group. If the caller supplies an initial token gap and there are
   more than three groups, it estimates an initial multi-group jump.
3. Each attempt summarizes the prefix and preserves the suffix. A prefix with no assistant message is
   rejected because it cannot form a useful conversation summary.
4. A successful call returns summary text/messages plus the flattened suffix and usage metrics.
5. Abort and ordinary API errors stop immediately.
6. A media-size error retries the same split once after stripping non-essential media. The retry does
   not increment the logical attempt count.
7. For prompt-too-long, `computeReactivePreserveStep` (`BPy`) uses the parsed token gap to sum backward
   from the end of the summarize prefix. If the gap is unavailable, it advances by one group.
8. The loop ends when no summarizable prefix remains. Credit-boundary rescues are separately measured.

**Why this approach:**
- API-round grouping avoids splitting assistant tool calls from their user tool results.
- Preserving from the tail prioritizes recency and exactness while the lossy summary covers older work.
- Gap-guided jumps reduce repeated doomed API calls; the one-group fallback handles providers whose
  error format lacks a usable token gap.
- Media stripping is retried once because repeated stripping cannot make further progress.

**Key insight:** The loop changes the **preserved suffix**, not the oldest messages one-by-one. That
keeps semantic/tool-call boundaries intact while monotonically reducing summary input.

```javascript
// ============================================
// computeReactivePreserveStep - Convert a prompt overflow gap into a group-count jump
// Location: cli_inner_pretty.js:328166-328175
// ============================================

// ORIGINAL (for source lookup):
function jsd(e, t, r) {
  let n = 0,
    o = 0;
  for (let i = t - 1; i >= 0; i--) if (((n += e[i]), o++, n >= r)) break;
  if (o >= t - 1) return Math.max(1, Math.floor(t / 2));
  return o;
}
function BPy(e, t, r) {
  if (e === void 0) return { mode: "gap_unparseable", step: 1 };
  return { mode: "gap_guided", step: jsd(t, r, e) };
}

// READABLE (for understanding):
function groupsNeededToCoverGap(groupTokens, summarizeGroupCount, tokenGap) {
  let tokens = 0;
  let groups = 0;
  for (let index = summarizeGroupCount - 1; index >= 0; index--) {
    tokens += groupTokens[index];
    groups++;
    if (tokens >= tokenGap) break;
  }
  if (groups >= summarizeGroupCount - 1) return Math.max(1, Math.floor(summarizeGroupCount / 2));
  return groups;
}
function computeReactivePreserveStep(tokenGap, groupTokens, summarizeGroupCount) {
  if (tokenGap === undefined) return { mode: "gap_unparseable", step: 1 };
  return { mode: "gap_guided", step: groupsNeededToCoverGap(groupTokens, summarizeGroupCount, tokenGap) };
}

// Mapping: jsd→groupsNeededToCoverGap, BPy→computeReactivePreserveStep, e→tokenGap/groupTokens, t→groupTokens/summarizeGroupCount, r→summarizeGroupCount/tokenGap, n→tokens, o→groups, i→index
```

## 5. Reactive finalization

### Install a reactive or precomputed result

**What it does:** Converts a summary-plus-suffix into the same post-compact shape consumed by the query
loop.

**How it works:**
1. `runReactiveCompaction` (`nwo`) permits one attempt, rejects compact query recursion, requires both
   auto and reactive compact, and honors turn abort.
2. If a precomputed swap exists, it skips a second PreCompact hook and uses the saved hook display;
   otherwise it runs the hook and calls `summarizeOldGroupsReactively` (`qAo`).
3. A hook block emits terminal UI events and returns `{result:null, hookBlocked:true}`.
4. `finalizeReactiveCompaction` (`owo`) clears read/nested-memory state and restores file, plan,
   task-status, skill, tool, agent, and MCP attachments through `buildPostCompactAttachments` (`iwo`).
5. The retained messages are normalized with `Cpt`; precomputed results concatenate their original
   retained suffix and `messagesSince` first.
6. `annotateBoundaryWithPreservedMessages` (`tks`) records both an on-disk UUID subset and an in-memory
   superset, then token-counts the complete installed context.
7. PostCompact hooks run only after the summary and restored context are ready. Cleanup follows a
   successful result.

**Why this approach:**
- Both freshly computed and precomputed summaries converge on one finalizer, preventing differences in
  cache clearing, restored context, metadata, or telemetry.
- Keeping post-compact hooks out of speculative precompute avoids observable side effects before a
  summary is actually installed.
- UUID metadata is necessary because retained original messages already exist in the transcript and
  are normally deduplicated during recording.

**Key insight:** Precompute optimizes summary latency only. Installation remains live-turn work because
it depends on current messages, state caches, hooks, and attachments.

## 6. Failure and cleanup matrix

| Condition | Result | Entry/sidecar effect |
|---|---|---|
| PreCompact hook blocks while arming | no ready summary | pending entry deleted |
| turn aborts while borrow/consume waits | `turn_aborted` | entry retained |
| owned ready entry has no boundary UUID | `none` + discard telemetry | entry already consumed; sidecar deleted |
| borrowed entry has no boundary UUID | `none` + borrow-miss telemetry | owner's entry retained |
| reactive hook blocks | `hookBlocked: true` | no compact result installed |
| reactive summary fails | structured failure telemetry | no post-compact cleanup |
| `clearPrecomputedCompaction` (`QAo`) | abort + delete | ready sidecar scheduled for deletion |
| subagent exit | same cleanup plus counters/dedupe reset | permits clean reuse of the agent key |

## 7. Cross-version verification

### 2.1.193 comparison

The 2.1.193 functions `FIo`, `$Kn`, `jif`, `UIo`, `jIo`, `GIo`, and `FKn`
(`:461334-461655 (193)`) are structural twins of 2.1.220's arm, settle, borrow, consume, swap,
boundary, and clear operations. The reactive summarizer `ZPn` (`:241501-241597 (193)`) is likewise a
statement-level twin of `qAo` except for re-mangled dependencies.

What 2.1.193 does **not** have in this region:

- `.precompact.json`;
- the 8,000,000-byte payload cap and schema version;
- serialized sidecar I/O;
- rehydration validation and the three `rehydrated`, `rehydrate_rejected`, and `persisted` events;
- `rehydrated` telemetry on consumption/discard;
- the 2.1.220 default change from `precomputeCompactionEnabled: true` in 193's `OKn` to the false
  default supplied by `kdr`.

### Readable-source cross-check

The readable tree contains the same reactive design concepts in its compact comments and API-round
grouping, but it contains no precompute sidecar implementation under `src/services/compact/`.
Therefore it corroborates names such as `compactConversation`, grouping, preservation, and cleanup;
it is **not evidence** for the 2.1.220 persistence lifecycle. Every persistence claim above comes from
the 2.1.220 bundle itself.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isPrecomputedCompactionEnabled` (`Hnn`) - four-layer precompute gate
- `persistPrecompactSidecar` (`zsd`) - bounded secure sidecar write
- `loadPrecompactSidecar` (`Ksd`) - size, JSON, version, and schema validation
- `rehydratePrecomputedCompaction` (`tad`) - live-history compatibility check
- `armPrecomputedCompaction` (`Kxs`) - asynchronous pending-to-ready producer
- `settlePendingPrecompute` (`YAo`) - generation-safe state transition
- `borrowPrecomputedCompaction` (`KPy`) - non-consuming wait/read
- `consumePrecomputedCompaction` (`Yxs`) - owning wait/read/delete
- `tryApplyPrecomputedCompaction` (`Xxs`) - threshold/413 swap coordinator
- `summarizeOldGroupsReactively` (`qAo`) - adaptive suffix-preserving summarizer
- `runReactiveCompaction` (`nwo`) - reactive orchestration and hook handling
- `finalizeReactiveCompaction` (`owo`) - common installation and restoration path
- `clearPrecomputedCompaction` (`QAo`) - abort, discard, and lifecycle cleanup
