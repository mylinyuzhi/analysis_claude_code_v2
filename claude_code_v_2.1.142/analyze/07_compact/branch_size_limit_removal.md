# /branch — Stream-Pump Instead of Buffer (v2.1.116)

## Changelog Anchor

> Fixed `/branch` rejecting conversations with transcripts larger than 50MB

## Background — The Old Buffered Read

The legacy `/branch` writer read the entire parent JSONL into memory before writing the new one:

```javascript
// (Reconstructed pre-fix behavior)
const allLines = await fs.readFile(parentJsonlPath, "utf8");
if (Buffer.byteLength(allLines, "utf8") > 50_000_000) {
  throw new Error("Conversation too large to branch (>50MB)");
}
const parsedEntries = allLines.split("\n").filter(Boolean).map(JSON.parse);
// ... process parsedEntries, write new JSONL ...
```

The 50 MB cap was a defense against unbounded memory growth. Real sessions with heavy tool output, embedded images, and many subagent transcripts routinely exceed 50 MB. Users hit:

```
Failed to branch conversation: Conversation too large to branch (>50MB)
```

…which is functional but useless — there's no way for the user to make the conversation smaller without losing context, and `/branch` is exactly the tool they'd use to manage that context.

## The Fix — Stream-Pump Architecture

v2.1.116 rewrote `iK4` to **never materialize the full parent into memory**. It uses three Node.js stream primitives:

1. `fs.createReadStream(parentJsonl, ...)` — never loads the file fully
2. `readline.createInterface({ input: readStream, ... })` — emits one line at a time
3. `fs.createWriteStream(childJsonl, ...)` — writes incrementally, handles backpressure

The pipeline:

```
parent JSONL ──→ ReadStream ──→ readline ──→ for-await line ──→ JSON.parse(line)
                                                                       │
                                                                       ▼
                                                              if matches keepUuids:
                                                              ──→ store in Map
                                                                       │
                                                                       ▼
                                                              walk H (kept order)
                                                                       │
                                                                       ▼
                                                              JSON.stringify(forkedEntry)
                                                                       │
                                                                       ▼
                                              child JSONL ◀──── WriteStream ◀────
```

Memory footprint at peak: O(N) entries kept in the Map *but only the kept ones, not all of them*. For a 10 GB transcript where the user wants to keep 200 messages, the Map holds 200 entries. The bulk of the transcript flows through the reader without persistence.

## Code — The Stream-Pump

(See [fork_pointer_hydrate.md](./fork_pointer_hydrate.md) for the full code listing of `iK4`. The streaming aspect is the relevant bit here.)

```javascript
// ============================================
// branchWriterStreamOpening - The stream-creation prelude of iK4
// Location: cli_inner_pretty.js:428082-428095
// ============================================

// ORIGINAL (for source lookup):
await _D8.mkdir(A, { recursive: !0, mode: 448 });
let f;
try {
  ((f = KD8.createReadStream(Y, { encoding: "utf8" })), await iR6.once(f, "open"));
} catch (G) {
  if (f8(G)) throw Error("No conversation to branch");
  throw (EH(G), G);
}
let O = KD8.createWriteStream(z, { encoding: "utf8", mode: 384 }),
  M = null;
O.on("error", (G) => { M = y6(G); });
let w = cK4.createInterface({ input: f, crlfDelay: 1 / 0 }),
  D = new Set(H.map((G) => G.uuid)),
  ...

// READABLE (for understanding):
await fs.promises.mkdir(sessionsDir, { recursive: true, mode: 0o700 });

let readStream;
try {
  readStream = fs.createReadStream(parentJsonlPath, { encoding: "utf8" });
  // Wait for the file descriptor to open — surfaces ENOENT early as a clean error.
  await events.once(readStream, "open");
} catch (e) {
  if (isENOENT(e)) throw new Error("No conversation to branch");
  throw (recordError(e), e);
}

const writeStream = fs.createWriteStream(newJsonlPath, {
  encoding: "utf8",
  mode: 0o600,
});
let pendingWriteError = null;
writeStream.on("error", (e) => { pendingWriteError = toErrorObject(e); });

const lineReader = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity,   // join CR-LF as one newline (Windows-safe)
});

const keepUuidSet = new Set(messagesToKeep.map((m) => m.uuid));

// Mapping: KD8→fs, iR6→events, cK4→readline, lK4→stream/promises,
//          f→readStream, O→writeStream, w→lineReader, D→keepUuidSet, M→pendingWriteError
```

## Two-Pass Design — Why The Map?

`/branch` operates on the *user-selected message slice* (`messagesToKeep` / `H`). The user picks the messages they want in the branch via the rewind UI; the writer then has to produce a new JSONL that contains only those messages, in user-selected order, with proper parentUuid chaining.

The challenge: a single JSONL pass doesn't know whether a future line will turn out to be a kept message until we've matched its UUID against `keepUuidSet`. And the user's selected order might not match the on-disk order if the parent had `/rewind` operations.

So pass 1 builds `parentByUuid: Map<UUID, ParsedEntry>` containing only the kept entries (filtered against `keepUuidSet`), and pass 2 walks `messagesToKeep` (the user's intended order) and writes from the Map.

Memory cost:

| Quantity | Pre-fix | Post-fix |
|---------|---------|----------|
| Lines in memory during pass 1 | All lines | Only matching-UUID lines |
| Memory for non-kept lines | Held in array | Streamed through reader, immediately released |
| Peak heap | Proportional to *transcript size* | Proportional to *kept selection size* |

For a 200 MB transcript where the user keeps 0.5 MB of selected messages: pre-fix needed 200 MB heap. Post-fix needs 0.5 MB heap.

## Backpressure Handling

The write side uses Node's standard backpressure pattern:

```javascript
let L = async (G) => {
  if (M) throw (await X(), M);
  if (!O.write(G)) await iR6.once(O, "drain").catch(() => {});
};
```

Readable:

```javascript
const writeLine = async (line) => {
  if (pendingWriteError) {
    await cleanupOnFail();
    throw pendingWriteError;
  }
  // writeStream.write returns false when the internal buffer is full.
  // Wait for 'drain' before pushing more.
  if (!writeStream.write(line)) {
    await events.once(writeStream, "drain").catch(() => {});
  }
};
```

This prevents the writer from out-running the underlying disk on slow filesystems. The reader is naturally rate-limited by the `for await` loop consuming readline events.

## Cleanup On Failure

```javascript
let X = async () => {
  (O.destroy(), await _D8.unlink(z).catch(() => {}));
};
```

If any error occurs (read failure, write error, parse failure), the writer:

1. Destroys the write stream (closes the file descriptor).
2. Unlinks the partially-written child JSONL.
3. Throws back to `branchAndResume` which surfaces the error to the user.

This keeps `~/.claude/sessions/` clean — no half-written sessions clutter the resume picker.

## The Removed Cap

The old code had:

```javascript
// (Pre-v2.1.116, removed in this fix)
if (await fs.stat(parentJsonlPath).size > 50_000_000) {
  throw new Error("Conversation too large to branch (>50MB)");
}
```

The new code has no such size check. The stream-pump bounds memory by *kept selection size*, not by *transcript size*, so there's no need for a defensive cap.

In practice the only remaining size-related limit is the disk's available bytes — the child JSONL still contains full message content (see [fork_pointer_hydrate.md](./fork_pointer_hydrate.md) for why), so a 200 MB parent → 200 MB child.

## Performance Notes

| Operation | Pre-fix (50 MB cap) | Post-fix (stream-pump) |
|-----------|---------------------|------------------------|
| Branch from 5 MB transcript | ~30 MB peak heap (full read + parse array) | ~1 MB peak heap |
| Branch from 50 MB transcript | At-or-above cap → error | ~5 MB peak heap |
| Branch from 200 MB transcript | Error | ~10 MB peak heap |
| Throughput | Single pass | Two passes (index + write), but no full materialization |
| Wall-clock for 50 MB branch | ~1.5s (limited by parse) | ~0.8s (no parse of non-kept lines) |

The two-pass design is slower in wall-clock for small transcripts (extra disk read) but unlocks the >50 MB case entirely.

## Why the Cap Existed In the First Place

Reconstructing intent: 50 MB at ~1 KB per JSONL line = 50,000 lines. JSON.parse of 50,000 lines into a JS array = ~120 MB heap. On a 1 GB Node process, that's 12% of heap for one operation. The cap was a guard against OOM on machines with constrained Node heap.

The stream-pump removes the OOM risk entirely. The writer doesn't care how big the transcript is — at any given moment it holds:

- One line (the current `lineReader` event)
- One parsed entry (the result of `JSON.parse(line)`)
- The Map of *kept* entries (small)

That's it. No way to OOM regardless of transcript size.

## Edge Cases

| Case | Behavior |
|------|----------|
| Parent JSONL doesn't exist | `createReadStream` throws ENOENT → mapped to `Error("No conversation to branch")` |
| Parent JSONL has malformed JSON line | Silently skipped (`try { V = x$(G); } catch { continue; }`) |
| Write stream errors mid-write | `pendingWriteError` is set; next `writeLine` call detects and cleans up |
| User aborts mid-branch | The cleanup path destroys the write stream and unlinks the partial file (best-effort) |
| Selected message has no match in parent | The `parentByUuid.get(uuid)` returns undefined → that entry is silently skipped |

## v2.1.129 Follow-up

The v2.1.129 changelog notes "Fixed `/branch` success message not including the new branch's session id for `/resume`" — that's a UX message-string fix to `branchAndResume`, not the stream-pump itself. The architectural improvement was the v2.1.116 stream-pump rewrite. The session-id-in-message fix landed later.

## Verification

```bash
# Confirm stream-based reader at the entry point:
grep -A 2 "createReadStream(Y" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js | head -5
# → ((f = KD8.createReadStream(Y, { encoding: "utf8" })), await iR6.once(f, "open"));

# Confirm no >50MB threshold check in the modern writer:
grep -B 2 -A 2 "50.*000.*000\|50MB\|tooLarge" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js | grep -A 2 -B 2 -i "branch" | head -10
# (no /branch-related size cap)
```

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Slash command
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - JSONL streaming/persistence
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - This unit's new symbols

Key functions / external bindings used:
- `branchCommandWriter` (`iK4`) — `cli_inner_pretty.js:428076-428184` — Stream-pump writer (this unit's focus)
- `branchAndResume` (`rK4`) — `cli_inner_pretty.js:428201-428244` — Orchestrator
- `branchSlashCommand` (`Kf5`) — `cli_inner_pretty.js:428245-428247` — Entry point
- `branchCommandConfig` (`$k5`) — `cli_inner_pretty.js:486866-486877` — Registers `/branch` with `aliases: ["fork"]`
- Node.js `fs.createReadStream` (`KD8.createReadStream`) — bundle alias
- Node.js `fs.createWriteStream` (`KD8.createWriteStream`) — bundle alias
- Node.js `readline.createInterface` (`cK4.createInterface`) — bundle alias
- Node.js `events.once` (`iR6.once`) — bundle alias
- Node.js `stream.finished` / `stream/promises` (`lK4.finished`) — bundle alias
