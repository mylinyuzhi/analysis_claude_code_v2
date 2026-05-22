# Subagent Resume & State Hydration (v2.1.142)

## TL;DR

When a subagent is interrupted (parent abort, OOM, network drop, prompt-too-long retry), its state can be re-hydrated and execution continued. The mechanism has three pillars:

1. **Sidechain transcript** — the entire subagent transcript persists as `~/.claude/sidechains/<agentId>.jsonl`. Each emitted message is appended after it's produced.
2. **Sidechain metadata** — `~/.claude/sidechains/<agentId>.json` carries `agentType`, `cwd`, `worktreePath`, `description`, `name` — enough to reconstruct the spawn context.
3. **Fork-pointer hydrate** — for fork-subagents that inherit parent context, the persisted record is a **pointer** (`recordForkContextRef`/`Vy6`) rather than a copy of the parent's messages. On resume, the parent transcript is loaded and the pointer reconstructs the inherited window.

Three v2.1.x fixes form the modern resume story:

| Version | Fix |
|---------|-----|
| **v2.1.118** | `/fork` writing the full parent conversation to disk per fork — now writes a pointer (`Vy6`) and hydrates on read |
| **v2.1.118** | Subagents resumed via `SendMessage` not restoring the explicit `cwd` they were spawned with — now `runResumedSubagent` reads `cwd` from metadata |
| **v2.1.121** | SDK `mcp_authenticate` now supports `redirectUri` for custom-scheme completion (matters for subagent-spawned MCP OAuth flows) |
| **v2.1.132** | `resumePersistedCount` dedup — re-runs don't re-write the already-persisted prefix on PTL retries |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_subagent.md](../00_overview/symbol_additions_v2_1_142_subagent.md) - v2.1.142 subagent subsystem
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform (MCP auth)

Key functions in this document:
- `runResumedSubagent` (`uiH`) - resume entrypoint (cli_inner_pretty.js:386626-386766)
- `loadSubagentTranscript` (`miH`) - read sidechain JSONL into messages array
- `readAgentMetadata` (`vE6`) - read `~/.claude/sidechains/<id>.json` (cli_inner_pretty.js:514425)
- `writeAgentMetadata` (`tJ$`) - write metadata sidecar (cli_inner_pretty.js:514386)
- `filterUnresolvedToolUses` (`cJ6`) - drop assistant messages with orphan tool_uses (cli_inner_pretty.js:393435-393451)
- `stripDeadFork` (`HJ$`) - drop messages on dead-fork branches
- `fixupOrphanToolUseIds` (`ej$`) - rebuild tool_use ↔ tool_result invariants
- `mergeContentReplacements` (`ArK`) - merge persisted replacements on resume
- `recordForkContextRef` (`Vy6`) - write fork pointer rather than copy parent (called at cli_inner_pretty.js:393300)
- `recordSidechainTranscript` (`Me`) - JSONL append (cli_inner_pretty.js:514415)

## The Resume Entrypoint: `runResumedSubagent` (`uiH`)

```javascript
// ============================================
// runResumedSubagent - Re-hydrate a persisted subagent and resume execution
// Location: cli_inner_pretty.js:386626-386766 (excerpt)
// ============================================

// ORIGINAL (for source lookup):
async function uiH({ agentId: H, prompt: $, toolUseContext: q, canUseTool: K, invokingRequestId: _ }) {
  let A = Date.now(),
    z = q.getAppState(),
    { taskRegistry: Y } = q,
    f = z.toolPermissionContext.mode,
    [O, M] = await Promise.all([miH(Zz(H)), vE6(Zz(H))]);
  if (!O) throw (uH("subagent_launch", "subagent_resume_transcript_missing"),
    Error(`No transcript found for agent ID: ${H}`));
  let w = ej$(HJ$(IA8(O.messages))),
    D = ArK(q.contentReplacementState, w, O.contentReplacements),
    // ... worktree path validation, agent definition lookup, system prompt rebuild ...
    j = M?.worktreePath ? await ensureWorktreeExists(M.worktreePath) : void 0;
  let I = {
    agentDefinition: X,
    promptMessages: [...w, w8({ content: $ })],
    toolUseContext: q,
    canUseTool: K,
    isAsync: !0,
    querySource: HdH(X.agentType, rj(X)),
    forkContextMessages: void 0,
    resumePersistedCount: w.length,            // ← v2.1.132 fix
    ...(L && { useExactTools: !0 }),
    worktreePath: j,
    cwd: M?.cwd,                               // ← v2.1.118 fix
    description: M?.description,
    name: M?.name,
    contentReplacementState: D,
  };
  // ... rest of slH lifecycle dispatch
}

// READABLE (for understanding):
async function runResumedSubagent({ agentId, prompt, toolUseContext, canUseTool, invokingRequestId }) {
  const startTime = Date.now();
  const appState = toolUseContext.getAppState();
  const { taskRegistry } = toolUseContext;
  const parentMode = appState.toolPermissionContext.mode;

  // 1. Load transcript and metadata concurrently
  const [persistedTranscript, persistedMetadata] = await Promise.all([
    loadSubagentTranscript(toSidechainId(agentId)),    // miH
    readAgentMetadata(toSidechainId(agentId)),         // vE6
  ]);
  if (!persistedTranscript) {
    telemetryFailure("subagent_launch", "subagent_resume_transcript_missing");
    throw new Error(`No transcript found for agent ID: ${agentId}`);
  }

  // 2. Sanitize the loaded message stream
  //    a. Parse JSONL (drop malformed lines silently)
  //    b. Strip dead-fork messages (entries from rewound timelines)
  //    c. Rebuild orphan tool_use IDs (tool_use with no matching tool_result)
  const existingMessages = fixupOrphanToolUseIds(
    stripDeadFork(
      loadJSONL(persistedTranscript.messages)
    )
  );

  // 3. Merge persisted contentReplacements into the live state
  const replacementState = mergeContentReplacements(
    toolUseContext.contentReplacementState,
    existingMessages,
    persistedTranscript.contentReplacements
  );

  // 4. v2.1.118: restore cwd from metadata
  //    Best-effort worktree validation: if the original worktree was removed externally,
  //    fall back to parent cwd rather than crashing on chdir later.
  const worktreePath = persistedMetadata?.worktreePath
    ? await ensureWorktreeExists(persistedMetadata.worktreePath)
    : undefined;

  // 5. Build the spawn invocation
  const invocation = {
    agentDefinition,
    promptMessages: [...existingMessages, makeUserMessage({ content: prompt })],
    toolUseContext,
    canUseTool,
    isAsync: true,
    querySource: deriveQuerySource(agentDefinition.agentType, isBuiltInAgent(agentDefinition)),
    forkContextMessages: undefined,
    resumePersistedCount: existingMessages.length,   // ← v2.1.132: skip persisted prefix on writes
    ...(isMainSession && { useExactTools: true }),
    worktreePath,
    cwd: persistedMetadata?.cwd,                     // ← v2.1.118 fix: restore cwd
    description: persistedMetadata?.description,
    name: persistedMetadata?.name,
    contentReplacementState: replacementState,
  };

  // 6. Dispatch through slH (the async-task lifecycle wrapper)
  return runSubagentLifecycle(invocation, /* ...rest */);
}

// Mapping: uiH→runResumedSubagent, H→agentId, $→prompt, q→toolUseContext,
//          K→canUseTool, O→persistedTranscript, M→persistedMetadata,
//          w→existingMessages, D→replacementState, j→worktreePath,
//          IA8→loadJSONL, HJ$→stripDeadFork, ej$→fixupOrphanToolUseIds,
//          ArK→mergeContentReplacements,
//          miH→loadSubagentTranscript, vE6→readAgentMetadata,
//          Zz→toSidechainId, X→agentDefinition
```

## Fork-Pointer Hydrate (v2.1.118)

### The Pre-Fix Behavior

Pre-v2.1.118, when a fork subagent persisted its first message to disk, the code wrote the **entire parent transcript** as the subagent's "initial messages". A parent with 10MB of context history would produce 10MB of writes *per fork*, multiplied by the fork count in a single assistant message. Five parallel forks = 50MB of duplicate writes for the parent's history.

### The Fix: Fork-Context Reference

v2.1.118 introduced `recordForkContextRef` (`Vy6`): when a fork's transcript is first persisted, instead of copying the parent messages, it writes a **pointer**:

```json
{ "type": "fork-context-ref",
  "agentId": "<fork-agent-uuid>",
  "parentSessionId": "<parent-session-uuid>",
  "parentLastUuid": "<parent's-last-message-uuid>",
  "contextLength": 47 }
```

On resume, the loader reads this pointer, walks the parent's transcript up to `parentLastUuid`, and uses those messages as the fork's inherited prefix.

The fork-pointer write is conditional in `runAgent`:

```javascript
// cli_inner_pretty.js:393293-393311
let UH = x, q$ = null;                                  // UH = messages to write, q$ = parent UUID anchor
if (h !== void 0) {                                     // h = resumePersistedCount; resumes skip the prefix
  UH = x.slice(h);
  q$ = x[h - 1]?.uuid ?? null;
} else if (z !== void 0 && z === q.messages && q.agentId === void 0) {
  // Fork case: z is the parent's messages, S is filterUnresolvedToolUses(z)
  let $$ = S.at(-1)?.uuid;
  if ($$ !== void 0) {
    UH = x.slice(S.length);
    // Write the fork pointer rather than copy parent messages:
    Vy6({
      agentId: u,
      parentSessionId: v$(),
      parentLastUuid: $$,
      contextLength: S.length
    }).catch((G$) => N(`Failed to record fork-context-ref: ${G$}`));
  }
}
// Persist UH only (not the parent's prefix):
Me(UH, u, q$).catch(...);
tJ$(u, { agentType: H.agentType, ...(Z && { worktreePath: Z }), ... }).catch(...);
```

The conditions for writing a fork pointer:
- `z !== undefined` — the parent's full messages array was threaded in via `forkContextMessages`
- `z === q.messages` — the parent's messages object is the same identity as the current toolUseContext's
- `q.agentId === undefined` — this isn't an Agent-tool spawn (the parent isn't itself a subagent)

When all three hold, it's a fork-from-main-session, and the pointer optimization applies.

### Why a Pointer Instead of Compression?

**Alternative considered**: compress the parent prefix with gzip/lz4 before writing.

A compressed 10MB transcript is still 1-3MB on disk. With 5 forks that's 5-15MB of duplicated bytes. The pointer is ~200 bytes regardless of parent size. The order-of-magnitude saving wins.

**Alternative considered**: write a hash of the parent transcript and have a separate "transcript pool" indexed by hash.

This would deduplicate across all forks of the same parent state. But it adds a content-addressable store, GC for orphaned blobs, and reference counting — significant complexity for a workload that already has its IO budget. The pointer-by-UUID approach trusts the parent session's transcript file as authoritative.

**Key insight**: the parent's transcript file already exists on disk. The fork just needs a *reference* to it. Writing a copy is duplicated effort with no integrity benefit.

## Transcript-Line Gating

When `runAgent` decides whether to record each emitted message to JSONL, it gates by message type. From the streaming loop (cli_inner_pretty.js:393316-393366):

```javascript
for await (let $$ of gC({ messages: x, systemPrompt: TH, ... })) {
  // ... ttftMs / api_error / max_turns_reached handling ...

  if ($$.type === "attachment") {
    if (mH?.push($$), $$.attachment.type === "max_turns_reached") {
      log(`[Agent: ${H.agentType}] Reached max turns limit (${$$.attachment.maxTurns})`);
      break;
    }
    yield $$;
    continue;
  }

  if (isRecordableMessage($$)) {     // Q85($$): assistant|user|progress|system.compact_boundary
    if ($$.type !== "progress") mH?.push($$);
    if (...) {
      await Me([$$], u, iH).catch((G$) => log(`Failed to record sidechain transcript: ${G$}`));
      if ($$.type !== "progress") iH = $$.uuid;       // advance parent UUID anchor
    }
    yield $$;
  }
}
```

The gate `isRecordableMessage` accepts `assistant`, `user`, `progress`, and `system.compact_boundary` messages. Other types (`api_error`, `stream_event`, `attachment`) are *yielded to the parent's stream* but **not** persisted.

The reasoning:
- **`api_error`** is per-attempt; the retry produces the same content, no point persisting both.
- **`stream_event`** carries TTFT, token usage deltas — accounting metadata, not conversation history.
- **`attachment`** is hook outputs, max-turns markers, etc. — synthesized in-memory, recomputable on resume.
- **`progress`** is a streaming status update for the UI; only the *terminal* assistant message it precedes is the canonical record.

`Me` writes one message at a time, anchoring each new line's `parentUuid` to the previous *recordable* message. This builds the JSONL into a linear chain that resume can re-traverse.

## The Persisted Sidechain Metadata

`writeAgentMetadata` (`tJ$`) writes a small sidecar JSON file alongside the JSONL:

```javascript
// cli_inner_pretty.js:393305-393311 (the writeAgentMetadata call in runAgent's setup)
tJ$(u, {
  agentType: H.agentType,
  ...(Z && { worktreePath: Z }),     // only present if isolation:worktree
  ...(W && { cwd: W }),              // ← v2.1.118 stores the cwd
  ...(G && { description: G }),
  ...(V && { name: V }),
}).catch(($$) => log(`Failed to write agent metadata: ${$$}`));
```

The metadata file at `~/.claude/sidechains/<agentId>.json` looks like:

```json
{
  "agentType": "code-reviewer",
  "worktreePath": "/tmp/claude-worktree-abc123",
  "cwd": "/Users/joe/projects/myapp",
  "description": "Review PR #2138 for security issues",
  "name": "review-2138"
}
```

When `runResumedSubagent` loads this via `readAgentMetadata` (`vE6`):
- `agentType` → look up the AgentDefinition (e.g. via `activeAgents.find(a => a.agentType === metadata.agentType)`)
- `worktreePath` → re-validate the directory still exists; if not, log and fall back
- `cwd` → restored as the working directory for filesystem operations (v2.1.118 fix)
- `description` → used in task-notification labels
- `name` → re-registered in `agentNameRegistry` if not already present (for SendMessage addressing)

### v2.1.118 cwd Fix Detail

The bug pre-v2.1.118: when a subagent was spawned with `Agent({ cwd: "/special/dir", ... })`, the spawn correctly chdir'd there, but the cwd was **not** written to metadata. On resume via `SendMessage` (which routes to `runResumedSubagent`), the metadata sidecar lacked a `cwd` field, so the resumed subagent ran in the *parent's* cwd. File operations referenced by paths from the original conversation now resolved differently.

The fix: `tJ$` writes `cwd: W` when `W !== undefined`, and `runResumedSubagent` reads `M?.cwd` into the spawn invocation. Now `runWithCwdOverride` correctly applies the original cwd at resume time.

### Worktree Existence Validation

Worktrees can be removed externally (user deletes the temp dir, `git worktree prune`, etc.). The resume path validates:

```typescript
// from resumeAgent.ts (v2.1.88 source — same pattern in 2.1.142):
const resumedWorktreePath = meta?.worktreePath
  ? await fsp.stat(meta.worktreePath).then(
      s => (s.isDirectory() ? meta.worktreePath : undefined),
      () => {
        logForDebugging(`Resumed worktree ${meta.worktreePath} no longer exists; falling back to parent cwd`);
        return undefined;
      },
    )
  : undefined;

if (resumedWorktreePath) {
  // Bump mtime so stale-worktree cleanup doesn't delete a just-resumed worktree (#22355)
  const now = new Date();
  await fsp.utimes(resumedWorktreePath, now, now);
}
```

Two affordances:
1. **Graceful fallback**: missing worktree doesn't crash the resume; it falls back to parent cwd.
2. **mtime bump**: the retention cleanup sweep deletes worktrees not touched recently. Resuming bumps mtime so the cleanup sweep won't immediately reap a freshly-resumed worktree.

## v2.1.132 `resumePersistedCount` — The Dedup Fix

When a `--resume`'d subagent hits prompt-too-long mid-stream, the runner retries via `vI6` (the compactor) with a truncated head. Pre-v2.1.132, each retry would re-emit the entire reconstructed transcript through the persist loop, **including messages already on disk**.

### Pre-Fix Impact

A 5MB transcript on disk + 3 PTL retries = 15MB of duplicate writes = 20MB on-disk file with 5MB of unique content. Three knock-on effects:
- Disk pressure on long-running sessions
- Slower retries (every retry pays I/O for re-persisting all history)
- JSONL parsers (resume on next session) had to deduplicate by UUID, masking the size issue but still paying I/O on load

### The Fix

Thread `resumePersistedCount` from `runResumedSubagent` into `runAgent`:

```javascript
// from the resume-time invocation builder:
resumePersistedCount: existingMessages.length,        // how many messages are already on disk

// inside runAgent's write gate (cli_inner_pretty.js:393293):
let UH = x, q$ = null;
if (h !== void 0) {                              // h = resumePersistedCount
  UH = x.slice(h);                               // skip the persisted head
  q$ = x[h - 1]?.uuid ?? null;                   // anchor parentUuid to last persisted message
}
// ... downstream:
Me(UH, u, q$).catch(($$) => log(`Failed to record sidechain transcript: ${$$}`));
```

After the fix: only the *new* tail of messages is written; the `parentUuid` of the first new message correctly anchors to the last *persisted* (not last in-memory) UUID. PTL retries that re-stream the existing prefix now write zero bytes for that prefix.

### Telemetry & Insight

The fix has a per-session reproducibility property: if `resumePersistedCount` is wrong (off-by-one, or stale because the in-memory `x` was sliced), the persisted chain breaks. The implementation is defensive: `UH = x.slice(h)` and `q$ = x[h - 1]?.uuid ?? null` so a too-large `h` just produces an empty `UH` (no writes) rather than corrupting the chain.

**Key insight**: this fix is *coordination state passed across function calls* — the inner runner needs to know how much the outer hydrate already wrote. Storing it in the invocation object is the cleanest way (vs. a module-level flag that would be racy across concurrent subagents).

## SDK `mcp_authenticate` `redirectUri` (v2.1.121)

The SDK can request MCP OAuth authentication on behalf of the user via the `mcp_authenticate` control request. Pre-v2.1.121, this only supported a localhost callback. v2.1.121 added a `redirectUri` field for custom-scheme completion — for example, `myapp://oauth-callback` for hybrid mobile/desktop SDK consumers.

Relevant code at cli_inner_pretty.js:602724-602791:

```javascript
} else if (LH.request.subtype === "mcp_authenticate") {
  let { serverName: s, redirectUri: AH } = LH.request,
    VH = Y(),
    IH = lookupServerConfig(s) /* ... */ ;
  if (!IH) W$(LH, `Server not found: ${s}`);
  else if (IH.type === "claudeai-proxy") {
    // ... claude.ai connector path ...
  } else if (IH.type !== "sse" && IH.type !== "http")
    W$(LH, `Server type "${IH.type}" does not support OAuth authentication`);
  else
    try {
      let pH = (x8) => {
        // Build OAuth flow with custom or localhost redirectUri
        let _8 = iHH(s, IH, (Y6) => Q6(Y6), void 0, {
          skipBrowserOpen: !0,
          redirectUri: x8,         // ← custom uri threaded into the OAuth client
          onWaitingForCallback: (Y6, Eq, k6) => {
            ((Mq = Eq), (t6 = k6));
          },
        });
        // ...
      },
      CH = "localhost", X$ = pH(AH), w$;
      if (AH)
        try {
          ((w$ = await X$.raced), (CH = "custom"));
        } catch (x8) {
          // Custom redirectUri rejected by the AS — fall back to localhost
          (log(`[mcp_authenticate] AS rejected custom redirectUri for ${s}; falling back to localhost: ${ZH(x8)}`),
            (X$ = pH()),
            (w$ = await X$.raced));
        }
      else w$ = await X$.raced;
      // ... reply with authUrl, callbackPort/state for SDK to drive ...
```

For subagents: a subagent that initializes an MCP server requiring OAuth can now trigger the SDK's auth flow without forcing the SDK to use localhost. This is critical for environments where:
- Localhost callbacks are blocked (firewalled containers, sandboxed apps)
- The SDK runs in a non-CLI host (mobile app, browser extension, IDE plugin) where a custom URL scheme is the natural callback channel

The fallback is automatic: if the OAuth Authorization Server (AS) rejects the custom redirectUri (some require pre-registration), the code retries with localhost. This avoids breaking existing setups.

## State Hydration Order

The order of operations in `runResumedSubagent` is deliberate:

```
1. Load transcript + metadata concurrently (Promise.all)
2. Sanitize message array (drop malformed lines → dead-fork strip → tool_use fixup)
3. Merge content replacements
4. Validate worktree (file system check, fallback to parent cwd)
5. Look up AgentDefinition (by stored agentType)
6. Compute model / permissionMode / system prompt (same as fresh spawn)
7. Build invocation object with resumePersistedCount + cwd + worktreePath
8. Dispatch to slH (the async lifecycle wrapper)
```

The ordering ensures:
- Filesystem checks (4) happen *before* the LLM call (8), so a missing worktree fails fast.
- The agentDefinition lookup (5) happens *after* sanitization (2) so the agentType comparison is against the canonical persisted value, not a corrupted one.
- The `resumePersistedCount` (7) is computed from the *sanitized* messages length, not the raw JSONL line count. If the raw JSONL has 100 lines but `stripDeadFork` removes 20, the count is 80 — matching what the in-memory `x` array will reach when streaming continues.

## Key Insight

The subagent resume path treats the on-disk JSONL as **append-only ground truth** and reconstructs everything else (agent definition, system prompt, MCP servers, hooks, content replacements) at resume time. The persisted state is intentionally narrow:

- Transcript (messages, with content replacements)
- Metadata (agentType, cwd, worktreePath, description, name)

Nothing else is persisted. That keeps the format stable across CLI versions — a transcript written by v2.1.117 reads cleanly in v2.1.142 because the *interpretation* (which agent definition to apply) is recomputed from the current binary's `activeAgents` registry. Frontmatter changes to the agent definition will affect a resumed subagent, which is the desired behavior (resume should pick up any fixes to the agent's prompt or tools).

The v2.1.118 cwd fix and v2.1.132 dedup fix are both examples of the *minimal-additional-persisted-state* principle: each was one new field threaded into the metadata or invocation object. No new file format, no new versioning concerns.
