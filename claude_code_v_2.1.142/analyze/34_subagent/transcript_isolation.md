# Subagent Transcript Isolation (v2.1.142)

## TL;DR

Subagent transcripts are written to a **separate JSONL file from the parent session** under `~/.claude/sidechains/<agentId>.jsonl`. The transcript subdir can be overridden per-agent (e.g. for `context: fork` skills that want their own subdirectory). The retention sweep covers sidechains as of v2.1.110. PTL retries no longer duplicate-write the prefix (v2.1.105 + v2.1.132).

## Why a Separate Transcript?

Three reasons:

1. **Read by Read tool** — A parent can `Read("~/.claude/sidechains/<agentId>.jsonl")` to inspect a subagent's full transcript (intermediate tool calls, thinking blocks, error traces). The parent's own transcript should not bloat with subagent details that may run thousands of turns.
2. **Resume independence** — A subagent can be `--resume`'d (`runResumedSubagent`) without disturbing the parent session. Its JSONL is the authoritative state.
3. **`/resume` over big parents** — A user resuming a parent session shouldn't have to parse every subagent's transcript. Separation keeps parent JSONL bounded.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_subagent.md](../00_overview/symbol_additions_v2_1_142_subagent.md) - v2.1.142 subagent subsystem
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `recordSidechainTranscript` (`Me`) - append messages to sidechain JSONL (cli_inner_pretty.js:514415)
- `writeAgentMetadata` (`tJ$`) - write metadata sidecar (cli_inner_pretty.js:514386)
- `setAgentTranscriptSubdir` (`jVK`) - per-agent transcript dir override (called from cli_inner_pretty.js:393131)
- `clearAgentTranscriptSubdir` (`JVK`) - lifecycle cleanup (called from cli_inner_pretty.js:393417)
- `cleanupPeriodDays` settings field - retention window (cli_inner_pretty.js:50403)

## On-Disk Layout

```
~/.claude/
├── projects/
│   └── <project-slug>/
│       └── <sessionId>.jsonl              ← parent session transcript
├── sidechains/
│   ├── <subagent-uuid-1>.jsonl             ← subagent transcript
│   ├── <subagent-uuid-1>.json              ← metadata sidecar
│   ├── <subagent-uuid-2>.jsonl
│   ├── <subagent-uuid-2>.json
│   └── ...
├── tasks/                                  ← LocalAgentTask state (per-agent task records)
├── shell-snapshots/                        ← bash environment snapshots
└── backups/
```

Each subagent has *one JSONL + one JSON metadata file* keyed by `agentId` (a UUID generated at spawn via `createAgentId`).

The JSONL format mirrors the project transcript format: one JSON object per line, with fields:

```json
{ "type":"user",       "uuid":"...", "parentUuid":"...", "message":{...}, "timestamp":"..." }
{ "type":"assistant",  "uuid":"...", "parentUuid":"...", "message":{...}, "timestamp":"..." }
{ "type":"progress",   "uuid":"...", "parentUuid":"...", "data":{...},    "timestamp":"..." }
{ "type":"system",     "uuid":"...", "parentUuid":"...", "subtype":"compact_boundary", ... }
```

Plus, in fork subagent JSONLs, an opening **fork-context-ref** record (v2.1.118):

```json
{ "type":"fork-context-ref", "agentId":"...", "parentSessionId":"...", "parentLastUuid":"...", "contextLength":47 }
```

This pointer replaces the previous copy-the-parent-transcript behavior.

## The Append Loop: `recordSidechainTranscript` (`Me`)

`Me` is called from inside `runAgent`'s streaming loop for every recordable message (filtered by `isRecordableMessage` / `Q85`):

```javascript
// from cli_inner_pretty.js:393316-393366
for await (let $$ of gC({ messages: x, systemPrompt: TH, ... })) {
  // ... handle attachment / api_error / stream_event / etc ...

  if (isRecordableMessage($$)) {
    if ($$.type !== "progress") mH?.push($$);

    if (...) {
      // The actual transcript append:
      await Me([$$], u, iH).catch((G$) => log(`Failed to record sidechain transcript: ${G$}`));

      // Advance the parent UUID anchor (so the next recordable message can chain to this one)
      if ($$.type !== "progress") iH = $$.uuid;
    }
    yield $$;
  }
}
```

`Me` signature: `recordSidechainTranscript(messages, agentId, parentUuid)`. Each call appends `messages` to `<agentId>.jsonl`, each one tagged with `parentUuid` so the chain is reconstructable on read.

**Why per-message append rather than batch-at-end?**

If the process crashes mid-stream, the transcript still has every message produced *up to the crash point*. A batch write at the end of the run would lose everything on crash. The cost (one filesystem write per message) is paid because user-visible "started but never wrote anything" failures are far worse than "wrote partial state".

The write is fire-and-forget (`.catch(...)` only logs); failures don't interrupt the stream. The model already produced the output and the parent already has it in-memory; persistence is a *nice to have* for resume, not a precondition for correctness of this turn.

## Per-Agent Transcript Subdir Override

A subagent can write its transcript to a *subdirectory* of `~/.claude/sidechains/` rather than directly into the flat layout. This is set up by `setAgentTranscriptSubdir` (`jVK`):

```javascript
// from cli_inner_pretty.js:393131 (inside runAgent's setup)
let v = transcriptSubdir;             // optional caller-supplied override
let u = O?.agentId ? O.agentId : hm();
if (v) jVK(u, v);                     // ← register the subdir override for this agentId
```

And torn down at SubagentStop via the cleanup chain:

```javascript
// from cli_inner_pretty.js:393417
{ name: "transcriptSubdir", run: () => JVK(u) },        // clearAgentTranscriptSubdir
```

### When Is This Used?

The primary caller is **`context: fork` skills**. When a skill is configured with `context: fork` (as opposed to `context: inline`), invoking the skill spawns a subagent. That subagent's transcripts are routed to a subdir like `~/.claude/sidechains/skill-deploy/<agentId>.jsonl` so:

- The skill's transcripts are visually grouped in the sidechain directory.
- The transcripts can be cleaned up as a group (e.g., when the skill is uninstalled).
- Multiple skills don't pollute each other's transcript namespaces.

The override is per-agent, registered at spawn, cleared at stop. It's intentionally session-scoped (not persistent state) because the same agentId is unique to a single run.

## Cleanup: `cleanupPeriodDays` and the v2.1.110 Retention Sweep

### The Setting

`cleanupPeriodDays` is a settings key (default 30, minimum 1) that controls how long transcripts are retained before automatic cleanup. From cli_inner_pretty.js:50403:

```javascript
cleanupPeriodDays: y.number().int().min(1).optional(),
```

With validation error at 51141:
> `cleanupPeriodDays must be at least 1. To keep transcripts for a long time, set a large number (e.g. 3650 for ~10 years). To disable transcript writes entirely, remove this setting and use the --no-session-persistence CLI flag or the SDK persistSession:false option instead.`

The note explains why `0` is rejected: users setting it to mean "never clean up" got surprise "all transcripts deleted on start" behavior.

### The Sweep (Pre-v2.1.110)

Pre-v2.1.110, the retention sweep ran on session start and walked:
- `~/.claude/projects/*/` — parent session transcripts older than `cleanupPeriodDays` removed

It **did not** cover:
- `~/.claude/sidechains/` — subagent transcripts accumulated indefinitely
- `~/.claude/tasks/` — LocalAgentTask state files
- `~/.claude/shell-snapshots/` — bash env snapshots
- `~/.claude/backups/` — fork-pointer history backups

Users with heavy subagent use noticed `.claude/` ballooning to multi-GB on long-running setups.

### The v2.1.110 Fix

> The `cleanupPeriodDays` retention sweep now also covers `~/.claude/tasks/`, `~/.claude/shell-snapshots/`, and `~/.claude/backups/`

(Sidechains were already covered or added at this time — the changelog wording groups by category.)

The retention walker now hits each subagent JSONL file's mtime, removes ones older than the window, and also reaps the matching `.json` metadata sidecar. Per-subagent worktrees (registered via `writeAgentMetadata`) also get pruned via `removeAgentWorktree`.

### The Bumped-mtime Affordance

A subtle interaction with resume: if a subagent JSONL has been on disk for `cleanupPeriodDays - 1` days and a user resumes it, the resume flow bumps the file's mtime so the next sweep doesn't reap it the next morning. This is also done for worktrees (see `resume_state.md`). Without this, a `--resume` of a stale subagent could race with the cleanup sweep and find its transcript missing.

## v2.1.105 Fix: Duplicate Subagent Transcripts on PTL Retries

### The Problem

Pre-v2.1.105, when a subagent hit "Prompt is too long" mid-stream, the compactor (`vI6`) retried by truncating the head of the messages array and re-issuing the call. The streaming subagent runner (`slH`) re-emitted the historical messages alongside the new ones — and each re-emission was independently appended to the JSONL by `Me`.

The same message appeared on disk multiple times (once per PTL attempt). The resume parser deduplicated by UUID, but the disk file grew unbounded.

### The Fix Chain

- **v2.1.105**: stopped the peer-process race that allowed concurrent retries to interleave writes.
- **v2.1.132**: `resumePersistedCount` (see [resume_state.md](./resume_state.md)) ensures the persist loop skips messages already on disk.

The v2.1.105 fix specifically addressed a *peer-process gating issue*: two competing in-process attempts (the original stream and the PTL-retry stream) both calling `Me` for the same agentId on the same file, without coordination. The fix added an in-process `Map<agentId, AbortController>` so only one streaming context per agentId writes at a time. The losing context's writes are dropped before they reach the file.

### Why Two Fixes?

v2.1.105 fixed the *concurrency* (two-streams-same-time). v2.1.132 fixed the *quantity* (writes that should never happen). Both are needed: without v2.1.105, even a correct count could be raced. Without v2.1.132, even a single stream re-wrote prefix on retry.

## Peer-Process Gating

The "peer-process" terminology in v2.1.105 refers to two competing producers for the same subagent JSONL within a single Node process — not two OS processes. Subagents are nested `runAgent` calls inside the same Node process; concurrency comes from JS async, not multi-process.

A single subagent run produces *one* writer at a time. The peer-process bug was:

1. Run starts, begins streaming.
2. Run hits PTL mid-stream.
3. PTL retry creates a new internal stream context (with the truncated head).
4. The original stream context's `for await` loop is *also* still running because it hasn't been awaited to completion yet.
5. Both contexts call `Me` for the same `agentId`, interleaved.

The fix added an `Map<agentId, AbortController>` registered before the first stream and cleared in the SubagentStop cleanup chain. On PTL retry, the old controller is aborted (cancelling its `Me` calls before they hit the file system) and the new one takes ownership.

## Cleanup Lifecycle

When `runAgent` exits normally, the `finally` block runs the cleanup chain (cli_inner_pretty.js:393369-393432):

```javascript
let $$ = _ && A$ && !vH.signal.aborted && qa7(u, q.taskRegistry),
  G$ = [
    { name: "SubagentStop", run: async () => { /* fire stop hooks if not already */ } },
    { name: "mcp", run: () => H$() },
    { name: "sessionHooks", run: () => { if (H.hooks) q.sessionHooksRegistry.clear(u); } },
    { name: "promptCacheTracking", run: () => { if (Ag()) vnK(u); } },
    { name: "readFileState", run: () => WH.readFileState.clear() },
    { name: "sentSkillNames", run: () => $a7(u) },
    { name: "initialMessages", run: () => { x.length = 0; } },
    { name: "liveMessages", run: () => { if (mH) mH.length = 0; } },
    { name: "replHydrationSnapshot", run: () => { WH.replHydration = void 0; } },
    { name: "perfetto", run: () => nTH(u) },
    { name: "transcriptSubdir", run: () => JVK(u) },         // ← clearAgentTranscriptSubdir
    { name: "todos", run: () => q.agentLifecycle.clearTodos(u) },
    { name: "replContext", run: () => { /* clear timers, replContext */ } },
    { name: "mcpMonitors", keepaliveGated: !0, run: () => {} },
    { name: "shellTasks", keepaliveGated: !0, run: () => en7(u, q.taskRegistry) },
  ];

for (let M$ of G$) {
  if ($$ && M$.keepaliveGated) continue;          // background-task survivors skip keepalive-gated cleanups
  await M$.run();
}
```

The `keepaliveGated` flag controls whether the cleanup runs for background-survivor agents. Background agents (run-in-background or background-frontmatter:true) might still be alive after the parent's turn ends; their MCP monitors and shell tasks shouldn't be cleaned up prematurely.

The transcript subdir cleanup (`JVK`/`clearAgentTranscriptSubdir`) is *not* keepalive-gated — the in-memory subdir override is purely a routing hint for the current `runAgent` call. Once that's exited, the override has nothing to do.

## When the JSONL Is Read

There are three readers of subagent JSONLs:

1. **`runResumedSubagent` (`uiH`)** — calls `loadSubagentTranscript` (`miH`) to hydrate the messages array on resume. See [resume_state.md](./resume_state.md).
2. **Read tool** — a parent can `Read("~/.claude/sidechains/<id>.jsonl")` to inspect a subagent's full activity. This is most commonly used in patterns like "spawn subagent, wait for it to finish, then read its transcript to understand what happened".
3. **`/branch` and `/fork`** — when cloning a parent session that included subagent dispatches, the cloner walks subagent JSONLs to capture intermediate state.

For (2), the JSONL is human-readable: every message is one JSON object on one line. `jq` works directly. The Read tool's output is bounded by its line-cap, so very large transcripts get truncated.

## Subagent Transcript and Remote Control

> Fixed Remote Control sessions not streaming subagent transcripts (v2.1.113)

Before v2.1.113, Remote Control sessions (claude.ai mobile/web client) didn't forward subagent JSONL writes — they only forwarded the parent transcript. The Remote Control viewer saw "Agent tool returned a result" without any inspection of intermediate steps.

The fix routes every `recordSidechainTranscript` (`Me`) call also through the Remote Control event stream so connected viewers can pull the subagent's transcript live. The local file write and the remote stream emit are concurrent (both fire-and-forget).

## Key Insight

Subagent transcript isolation is a **filesystem-level separation of concerns**: each subagent gets its own JSONL, totally decoupled from the parent session's file. This produces:

- **Independent durability** — A crash mid-subagent doesn't corrupt the parent's transcript.
- **Independent retention** — Cleanup sweeps both files based on mtime, but they age independently.
- **Independent resume** — Hydrate the subagent without re-loading the (potentially huge) parent.
- **Independent inspection** — Read tool / `jq` can target one file.

The trade-off: querying *across* subagent transcripts (e.g. "show me all `Bash` tool calls across every subagent this session has spawned") requires a directory walk. There's no central index. For Claude Code's workload (interactive sessions, occasional resume) this is fine; for a high-volume agent farm it would be a scalability concern.

The cleanup additions in v2.1.110 closed an embarrassing leak. The PTL-retry fixes in v2.1.105 + v2.1.132 closed a duplicate-write leak. Together they make the sidechain layer **bounded in disk and bytes-per-message**, which is the property an automated system depends on.
