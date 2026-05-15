# Subagent --resume — Skip Already-Persisted Transcript Prefix (v2.1.132)

## Changelog Anchor

(Maps to the user-facing v2.1.132 fix; the implementation hook is `resumePersistedCount`. The original task description framed this as "Subagent transcript copies via `--resume` retry fix" / "duplicate multi-MB subagent transcript writes on prompt-too-long retries".)

## The Problem

Subagents persist their transcripts to disk so the parent agent can read the final result via `Read(<agent-transcript>.jsonl)` and so `--resume` can pick up a stalled or aborted subagent. The write happens in `slH` (the streaming subagent runner) and friends, looping over emitted messages and calling `Me(messages, agentId, parentUuid)` which appends to the JSONL.

When a subagent run with `--resume` hits **Prompt is too long** mid-stream, the runner retries by:

1. Truncating the head of the messages array (PTL retry strategy from `vI6`/`KLK`).
2. Re-issuing the LLM call.
3. On success, continuing where it left off.

Pre-v2.1.132, **each retry would re-call the persist loop with the entire reconstructed transcript** — including the messages that were already on disk from earlier turns. A 5 MB transcript would get re-written 5 MB on every PTL retry. Three PTL attempts → 15 MB of duplicate writes → 20 MB on-disk file with 5 MB of unique content.

This caused:
- Disk pressure on long-running sessions
- Slower retries (every retry pays the I/O cost of re-persisting the whole history)
- JSONL parsers (resume on next session) had to deduplicate by UUID, masking the size issue but still paying I/O on load

## The Fix — `resumePersistedCount`

The resume path threads a count of how many messages were already on disk into the new run. The runner slices that prefix off the write set:

```javascript
// ============================================
// runResumedSubagent - Resume a previously-persisted subagent transcript
// Location: cli_inner_pretty.js:386626-386713
// ============================================

// ORIGINAL (for source lookup):
async function uiH({ agentId: H, prompt: $, toolUseContext: q, canUseTool: K, invokingRequestId: _ }) {
  let A = Date.now(),
    z = q.getAppState(),
    { taskRegistry: Y } = q,
    f = z.toolPermissionContext.mode,
    [O, M] = await Promise.all([miH(Zz(H)), vE6(Zz(H))]);
  if (!O) throw (uH("subagent_launch", "subagent_resume_transcript_missing"), Error(`No transcript found for agent ID: ${H}`));
  let w = ej$(HJ$(IA8(O.messages))),                    // load persisted messages, fix-up tool-pair integrity
    D = ArK(q.contentReplacementState, w, O.contentReplacements),
    ...
  let I = {
      agentDefinition: X,
      promptMessages: [...w, w8({ content: $ })],       // existing transcript + new user prompt
      toolUseContext: q,
      canUseTool: K,
      isAsync: !0,
      querySource: HdH(X.agentType, rj(X)),
      ...
      forkContextMessages: void 0,
      resumePersistedCount: w.length,                   // ← NEW: how many messages are already on disk
      ...(L && { useExactTools: !0 }),
      worktreePath: j,
      cwd: M?.cwd,
      description: M?.description,
      name: M?.name,
      contentReplacementState: D,
    },
    ...
}

// READABLE (for understanding):
async function runResumedSubagent({ agentId, prompt, toolUseContext, canUseTool, invokingRequestId }) {
  const startTime = Date.now();
  const appState = toolUseContext.getAppState();
  const { taskRegistry } = toolUseContext;
  const permissionMode = appState.toolPermissionContext.mode;

  const [persistedTranscript, persistedMetadata] = await Promise.all([
    loadSubagentTranscript(toSidechainId(agentId)),                     // miH
    loadSubagentMetadata(toSidechainId(agentId)),                       // vE6
  ]);
  if (!persistedTranscript) {
    telemetryFailure("subagent_launch", "subagent_resume_transcript_missing");
    throw new Error(`No transcript found for agent ID: ${agentId}`);
  }

  // Reconstruct the messages array from disk, repairing any tool_use/tool_result
  // imbalance the persist might have left (e.g. interrupted before tool_result was written).
  const existingMessages = fixupOrphanToolUseIds(stripDeadFork(loadJSONL(persistedTranscript.messages)));  // ej$(HJ$(IA8(...)))

  const replacementState = mergeContentReplacements(toolUseContext.contentReplacementState, existingMessages, persistedTranscript.contentReplacements);

  // ─── worktree, system prompt, agent-def resolution (omitted for brevity) ───
  ...

  const invocation = {
    agentDefinition,
    promptMessages: [...existingMessages, makeUserMessage({ content: prompt })],  // ENTIRE history + new prompt for the LLM call

    // ─── v2.1.132 KEY: tell the runner not to re-persist the existing prefix ───
    resumePersistedCount: existingMessages.length,
    // ───────────────────────────────────────────────────────────────────────────

    toolUseContext,
    canUseTool,
    isAsync: true,
    querySource: deriveQuerySource(agentDefinition.agentType, isBuiltInAgent(agentDefinition)),
    spawnedBySkill: undefined,
    model: undefined,
    override: isMainSession ? { systemPrompt: renderedSystemPrompt } : undefined,
    availableTools,
    forkContextMessages: undefined,
    ...(isMainSession && { useExactTools: true }),
    worktreePath,
    cwd: persistedMetadata?.cwd,
    description: persistedMetadata?.description,
    name: persistedMetadata?.name,
    contentReplacementState: replacementState,
  };
  ...
}

// Mapping: uiH→runResumedSubagent, H→agentId, $→prompt, q→toolUseContext, K→canUseTool,
//          O→persistedTranscript, M→persistedMetadata, w→existingMessages, D→replacementState,
//          IA8→loadJSONL, HJ$→stripDeadFork, ej$→fixupOrphanToolUseIds,
//          miH→loadSubagentTranscript, vE6→loadSubagentMetadata
```

## Consumption Site — `resumePersistedCount` In Action

```javascript
// ============================================
// runSubagentInnerWriteGate - Slice off persisted prefix before writing transcript
// Location: cli_inner_pretty.js:393293-393311
// ============================================

// ORIGINAL (for source lookup):
let UH = x,                                              // all messages in this run
  q$ = null;                                             // parentUuid for first new message

if (h !== void 0)                                        // h === resumePersistedCount
  ((UH = x.slice(h)),                                    // skip the persisted head
   (q$ = x[h - 1]?.uuid ?? null));                       // anchor parentUuid to last persisted message

else if (z !== void 0 && z === q.messages && q.agentId === void 0) {
  let $$ = S.at(-1)?.uuid;
  if ($$ !== void 0)
    ((UH = x.slice(S.length)),
      Vy6({ agentId: u, parentSessionId: v$(), parentLastUuid: $$, contextLength: S.length }).catch((G$) =>
        N(`Failed to record fork-context-ref: ${G$}`),
      ));
}

(Me(UH, u, q$).catch(($$) => N(`Failed to record sidechain transcript: ${$$}`)),                    // ← only writes UH
 tJ$(u, { agentType: H.agentType, ...(Z && { worktreePath: Z }), ...(W && { cwd: W }),
          ...(G && { description: G }), ...(V && { name: V }), }).catch(...));

// READABLE (for understanding):
let messagesToWrite = allMessages;                       // x: every message accumulated for this run
let parentUuidForFirstWrite = null;

// ─── Resume path: skip the persisted prefix ─────────────────────────────────
if (resumePersistedCount !== undefined) {                // h
  messagesToWrite = allMessages.slice(resumePersistedCount);
  // Anchor the chain: the first new message we write should claim the last
  // persisted message as its parentUuid so the JSONL doc remains a valid tree.
  parentUuidForFirstWrite = allMessages[resumePersistedCount - 1]?.uuid ?? null;
}
// ─── Fork path: similar slice but for spawned-from-context case ─────────────
else if (forkContextMessages !== undefined
         && forkContextMessages === parentToolUseContext.messages
         && parentToolUseContext.agentId === undefined) {
  const lastForkContextUuid = forkContextMessages.at(-1)?.uuid;
  if (lastForkContextUuid !== undefined) {
    messagesToWrite = allMessages.slice(forkContextMessages.length);
    recordForkContextRef({
      agentId,
      parentSessionId: getCurrentSessionId(),
      parentLastUuid: lastForkContextUuid,
      contextLength: forkContextMessages.length,
    }).catch((e) => log(`Failed to record fork-context-ref: ${e}`));
  }
}

// Now persist only messagesToWrite (not the full allMessages):
persistSubagentTranscript(messagesToWrite, agentId, parentUuidForFirstWrite)
  .catch((e) => log(`Failed to record sidechain transcript: ${e}`));

persistSubagentMetadata(agentId, {
  agentType,
  ...(worktreePath && { worktreePath }),
  ...(cwd && { cwd }),
  ...(description && { description }),
  ...(name && { name }),
}).catch((e) => log(`Failed to write agent metadata: ${e}`));

// Mapping: h→resumePersistedCount, x→allMessages, UH→messagesToWrite, q$→parentUuidForFirstWrite,
//          z→forkContextMessages, S→forkContextMessages (after cJ6 strip), Me→persistSubagentTranscript,
//          Vy6→recordForkContextRef, tJ$→persistSubagentMetadata
```

## The Three Write Modes

The same function `slH`/runner handles three different "how much to write" cases:

| Mode | Trigger | Slice | parentUuid for first write |
|------|---------|-------|----------------------------|
| **Resume** | `resumePersistedCount` set | `messages.slice(resumePersistedCount)` | UUID of last persisted message |
| **Fork** | `forkContextMessages` matches parent's messages | `messages.slice(forkContextMessages.length)` | (handled by fork-context-ref record) |
| **Fresh** | Neither | `messages` entire | null (root) |

The bug pre-fix was that **Resume mode didn't exist** — every write was treated as Fresh, so the JSONL got the persisted prefix re-appended.

## PTL Retry Interaction

The PTL retry path in `vI6` (truncates head and retries) doesn't directly fan out to per-retry writes. But the subagent runner (`slH`) emits messages as the stream produces them, and each emitted message is independently appended to the JSONL. So a PTL retry that goes through `vI6` and re-streams would, pre-fix, re-emit the historical messages alongside the new ones — and each re-emission would re-append to disk.

With `resumePersistedCount` set, the runner's emit loop checks the slice point and only persists messages beyond that point. So PTL retries:

1. Reconstruct the truncated history in the runner's in-memory buffer (for the LLM call).
2. Emit new messages as the stream comes back.
3. **Persist only the new messages.** The historical messages have UUIDs ≤ the `resumePersistedCount` cutoff and don't get re-appended.

## Verification

```bash
# Confirm the slice gate:
grep -n "resumePersistedCount\|h !== void 0" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js | head -5
# → 386697:      resumePersistedCount: w.length,
# → 393125:  resumePersistedCount: h,
# → 393295:  if (h !== void 0) ((UH = x.slice(h)), (q$ = x[h - 1]?.uuid ?? null));
```

## Why the Field Lives In the Invocation Object

`resumePersistedCount` is computed at *resume entry* and threaded down to the runner via the invocation object. It isn't recomputed mid-stream because:

- The persisted-count is invariant per resume: once you've decided "the first N messages are already on disk", that doesn't change during this run's execution.
- If a PTL retry happens mid-run, the runner has already written some new messages. Those new messages are now also "persisted", but they don't need to be re-counted — the runner's emit loop only writes messages it hasn't yet handed to `Me()`.

## Edge Cases

| Case | Behavior |
|------|----------|
| `resumePersistedCount` is 0 | Slice is `messages.slice(0) === messages` — writes everything. Same as fresh. |
| `resumePersistedCount` equals `messages.length` | Slice is empty array. No initial transcript write; new messages emitted during the run still write incrementally. |
| `messages[count - 1]` is `undefined` | `parentUuidForFirstWrite` falls back to `null`. The first new message becomes a tree root in the JSONL. (Edge case shouldn't happen in practice — a resume always has at least one persisted message.) |
| Mid-stream abort | `Me()` writes are append-only; whatever made it through is durable. Next resume reads the longer prefix and slices accordingly. |

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Subagent runner, transcript persistence
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compaction interacts via PTL retries
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - This unit's new symbols

Key functions:
- `runResumedSubagent` (`uiH`) — `cli_inner_pretty.js:386626-386713` — Loads persisted transcript and sets `resumePersistedCount`
- `runSubagentInner` (function around 393098) — Consumes `resumePersistedCount` via the slice gate at line 393293-393311
- `loadSubagentTranscript` (`miH`) — Reads the JSONL for a given subagent id
- `loadSubagentMetadata` (`vE6`) — Reads worktreePath, cwd, agentType, etc.
- `persistSubagentTranscript` (`Me`) — The actual append-to-JSONL writer
- `fixupOrphanToolUseIds` (`ej$`) — Repairs tool_use/tool_result pairs that the prior session left orphaned
- `stripDeadFork` (`HJ$`/`X3`) — Filters out messages from forks that were rolled back
