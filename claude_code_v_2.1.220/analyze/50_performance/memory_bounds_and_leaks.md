# Memory bounds and leaks (2.1.193 → 2.1.220)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`. Every bare `cli_inner_pretty.js:<line>` is a **220** line I read.

`2.1.208` shipped eleven resource bullets in one release — the single densest performance block in the
window. This document covers the memory half of that block plus the three later leak fixes
(`.205` streaming download, `.214` bounded settings read, `.217` truncation flattening).

## 0. Why the changelog numbers are misleading, and how to read them

Every bullet here is phrased as a **measurement** (`64 MB`, `50-doc cap`, `16 MB`, `400 MB`, `2 MiB`).
Two of those numbers are the *pre-fix bound*, not the new cap, and grepping for them therefore
produces the wrong verdict:

| Changelog number | What the number actually is | Naive grep verdict | True verdict |
|---|---|---|---|
| `.208` "MCP stdio stderr accumulating up to **64 MB** per server" | the **pre-existing** guard that limited the damage; `67108864` is in 193 too | "carryover, no fix" | NET_NEW — the fix is a *listener detach*, not a cap |
| `.208` "LSP documents … now LRU with **50**-doc cap" | the new cap | — | NET_NEW (`zCy = 50`) |
| `.208` "file edit read cache bounded to **16 MB** instead of pinning up to 1,000 full files" | the new cap | `16777216` is 220=24 / 193=16 → "carryover" | NET_NEW — the count is polluted by unrelated `16777216`s, and **two different new 16 MiB budgets** exist |
| `.205` "cutting the updater's peak memory by roughly **400 MB**" | an estimate of the saving, no constant | — | NET_NEW (`responseType: "arraybuffer"` → `"stream"`) |
| `.214` "oversized (**>2 MiB**) settings files now fail at startup" | the new cap | — | NET_NEW (`Xye = 2097152`) |

**Method that works here:** find the *named constant*, not the number, then read both sides of the
call. The scoping pass rated 6 of the 11 `.206`–`.210` performance bullets UNANCHORED; four of those
six are anchored below, because the anchor was a constant identifier or a removed/added `removeListener`
call, never a string literal.

---

## 1. The MCP stdio stderr leak — the cap was never the bug

> `.208`: *"Fixed several memory leaks in long sessions: MCP stdio server stderr accumulating up to
> 64 MB per server …"*

**Verdict: NET_NEW, but not where the bullet points.** `67108864` at the stderr accumulator is
**220=1 (`:294837`) / 193=1 (`:293619`)** — byte-identical guard, both builds.

### The accumulator

Both builds attach a `data` listener to the child's stderr during MCP connect and append every chunk
to a string, so that a connect failure can be reported with the server's own diagnostics:

```javascript
// ============================================
// attachStdioStderrCollector - buffers an MCP stdio child's stderr during connect
// Location: cli_inner_pretty.js:294832-294843
// ============================================

// ORIGINAL (for source lookup):
        if (t.type === "stdio" || !t.type) {
          let V = l;
          if (V.stderr instanceof RKu.Readable)
            ((m = V.stderr),
              (f = (K) => {
                if (g.length < 67108864)
                  try {
                    g += K.toString();
                  } catch {}
              }),
              m.on("data", f));
        }

// READABLE (for understanding):
        if (serverRef.type === "stdio" || !serverRef.type) {
          let stdioTransport = transport;
          if (stdioTransport.stderr instanceof nodeStream.Readable) {
            stderrStream = stdioTransport.stderr;
            stderrListener = (chunk) => {
              if (stderrBuffer.length < MCP_STDERR_MAX_CHARS /* 64 MiB */)
                try { stderrBuffer += chunk.toString(); } catch {}
            };
            stderrStream.on("data", stderrListener);
          }
        }

// Mapping: l→transport, V→stdioTransport, m→stderrStream, f→stderrListener, g→stderrBuffer,
//          K→chunk, RKu→node:stream, t→serverRef
```

### Where 2.1.193 leaked

In 193 the listener is only ever detached inside the **disconnect** handler:

```javascript
// :293882 (193), inside the async close/teardown closure `O`
if (u && (t.type === "stdio" || !t.type)) i.stderr?.off("data", u);
```

Post-connect, 193 does clear the accumulator once — `if ((await Promise.race([m, g]), d)) (iu(e, \`Server
stderr: ${d}\`), (d = ""))` at `:293690 (193)` — **but leaves the listener attached**. So a chatty MCP
server (debug logging, deprecation warnings, progress spam) refills `d` for the whole session lifetime,
and the only thing stopping it is the 64 MiB guard. Multiply by the number of configured stdio servers
and the bullet's "up to 64 MB per server" is exactly right.

### What 2.1.220 changed — one line

```javascript
// :294909-294911
        try {
          if ((await Promise.race([E, A]), g)) (Fl(e, `Server stderr: ${g}`), (g = ""));
          if (f && m) (m.off("data", f), m.resume());
```

**How it works:**

1. `Promise.race([connectPromise, connectTimeoutPromise])` resolves — the handshake is done.
2. The buffered stderr is flushed once to the MCP debug log and the string is released (`g = ""`).
3. **`m.off("data", f)`** detaches the collector. From here the accumulator can never grow again;
   the closure variable stays `""` for the session.
4. **`m.resume()`** is the non-obvious half. A `Readable` with no `data` listener and no `pipe` sits
   *paused*; the child's stderr writes then fill Node's internal stream buffer and, once it is full,
   apply back-pressure to the child process — which for a server that logs heavily means a **hung MCP
   server**, a strictly worse failure than the leak. `resume()` puts the stream in flowing mode with
   no consumer, so chunks are read and discarded.

**Why this approach:** the alternative — keep collecting but with a ring buffer — would preserve
post-connect diagnostics at a bounded cost. The code chose to drop them entirely, which is defensible:
the buffer only ever feeds the three `Server stderr:` reporters, and all three
(`:294910`, `:294921`, `:294968`) fire inside the connect path. After connect nothing reads it, so
collecting was pure waste.

**Key insight:** the 64 MiB guard was a *damage limiter for a leak nobody had found*. Its presence in
both builds is why a count-based check scores this bullet "carryover"; the real delta is the addition
of a teardown that should have existed since the collector was written.

**Duplication caveat.** Per `_GROUND_TRUTH` §6.7 the bundle emits part of the MCP client twice. Both
copies carry the fix: the clone lives at `:300379` (guard), `:300452` (flush) and `:300453` (detach).
Do not read the pair as "two servers" or "two code paths".

---

## 2. LSP documents — an unbounded open-document set becomes a 50-entry LRU

> `.208`: *"… LSP documents staying open indefinitely (now LRU with 50-doc cap) …"*

**Verdict: NET_NEW.** `didClose for evicted document` 220=3 / 193=0; the cap is `zCy = 50` at
`:307353`.

### What actually leaked

The client-side map is cheap — one URI string plus a server name per entry. **The leak is in the
language server process, not in Claude Code.** Every `textDocument/didOpen` hands the server the file's
full text and obliges it to keep that document (and its parse tree, symbol table and diagnostics)
resident until a matching `didClose`. 2.1.193 had a `closeFile` method (`g`, `:298460-298473 (193)`)
and exported it, but nothing in the session lifecycle called it during normal editing — so a long
session that touched 2,000 files left 2,000 documents open in every running language server.

### The 2.1.220 LRU

```javascript
// ============================================
// evictOverflowDocuments - LRU eviction of open LSP documents with a real didClose
// Location: cli_inner_pretty.js:307176-307191
// ============================================

// ORIGINAL (for source lookup):
  function i(E, A) {
    (r.delete(E), r.set(E, A));
  }
  function s() {
    for (let [E, A] of r) {
      if (r.size <= zCy) return;
      r.delete(E);
      let b = e.get(A);
      if (!b || b.state !== "running") continue;
      (w(`LSP: Sending didClose for evicted document ${E}`),
        b.sendNotification("textDocument/didClose", { textDocument: { uri: E } }).catch((T) => {
          (Jee(T, "Failed to send didClose for evicted document"),
            w(`LSP: Failed to send didClose for evicted document ${E}: ${le(T)}`, { level: "error" }));
        }));
    }
  }

// READABLE (for understanding):
  function touchDocument(uri, serverName) {
    openDocuments.delete(uri);        // remove + reinsert = move to the end of Map iteration order
    openDocuments.set(uri, serverName);
  }
  function evictOverflowDocuments() {
    for (let [uri, serverName] of openDocuments) {     // Map iterates oldest-first
      if (openDocuments.size <= LSP_MAX_OPEN_DOCUMENTS /* 50 */) return;
      openDocuments.delete(uri);
      let server = servers.get(serverName);
      if (!server || server.state !== "running") continue;   // dead server: drop silently
      logDebug(`LSP: Sending didClose for evicted document ${uri}`);
      server.sendNotification("textDocument/didClose", { textDocument: { uri } }).catch((err) => { ... });
    }
  }

// Mapping: i→touchDocument, s→evictOverflowDocuments, r→openDocuments, e→servers,
//          zCy→LSP_MAX_OPEN_DOCUMENTS, E→uri, A→serverName, b→server
```

**How it works:**

1. `openDocuments` is a `Map<uri, serverName>`. JavaScript `Map` preserves insertion order, so
   `delete` + `set` on a hit is a two-operation "move to most-recently-used" — no separate LRU list.
2. `touchDocument` is called at **four** sites: after `didOpen` (`:307292`), on the
   already-open short-circuit inside `openFile` (`:307282`), on `changeFile` (`:307305`), and on
   `sendRequest` (`:307267`). The fourth is what makes it a genuine LRU rather than a FIFO — a file the
   model keeps querying (hover, definitions, diagnostics) stays warm even if it is never re-opened.
3. `evictOverflowDocuments` is invoked from exactly one place, immediately after a successful
   `didOpen` (`:307293`). That is the only moment the set can grow, so it is the only moment it needs
   checking.
4. Eviction is oldest-first with the size test **at the top of each iteration**, so it drains to
   exactly 50 and stops.
5. `r.delete(E)` runs *before* the server-state check: a document whose server has died is dropped
   from the map unconditionally. Correct — that server holds nothing.

**Why 50:** the cap has to exceed the working set of a realistic task (the model reads and edits
maybe a dozen files, plus imports the LSP itself pulls in) while keeping worst-case server memory to
50 parsed documents per language. Too low and the LRU thrashes: each eviction plus re-open forces the
server to re-parse and re-index, and a `didOpen`/`didClose` round trip is far more expensive than
holding the text. 50 buys roughly a 4× margin over typical use.

**A residual leak, stated honestly.** The version-counter map `n` (`:307171`, one integer keyed by
URI, read by `getDocumentVersion`) is **never pruned** — not on eviction, and 220 no longer exports a
`closeFile` at all (compare the 193 return object at `:298481-298489 (193)`, which had both `closeFile`
and `getSupportedExtensions`). The per-entry cost is a URI string plus a small integer, so this is
bounded by "distinct files opened this session", not by content size. It is a real but minor residue.

**Key insight:** the bullet reads like a client-side cache fix. It is not — it is a *protocol
obligation* fix. The client's own footprint barely changes; the memory being reclaimed lives in
processes Claude Code spawned and had been silently telling to remember everything.

---

## 3. Async hook output retained after backgrounding

> `.208`: *"… async hook output retained after backgrounding …"*

**Verdict: NET_NEW.** Provable by a two-line diff, no new literal.

An async hook is a hook whose first line of stdout is a JSON object that identifies it as async; the
CLI then hands the still-running process to a background registry and returns immediately.

**2.1.193** (`:589530-589562 (193)`) attaches **anonymous** `data` handlers and, on the async
handover, does nothing but resolve the waiter:

```javascript
// :589552 (193)
            ((z = !0), ie?.({ stdout: K, stderr: X, output: Z, status: 0 }));
```

`K` (stdout), `X` (stderr) and `Z` (combined) are closure strings, and the two anonymous listeners are
unreachable — there is no reference to pass to `removeListener`. The backgrounded hook keeps writing;
all three strings keep growing; and the closure is kept alive by the `getOutput` accessor handed to the
registry at `:589563 (193)`. A long-running async hook (a watcher, a linter daemon, a `tail -f`)
therefore grows three unbounded strings for its entire lifetime, of which the combined one `Z` is a
full duplicate of the other two.

**2.1.220** refactors the two handlers into **named** functions `te` (stdout, `:520084-520117`) and
`ee` (stderr, `:520081-520083`) purely so they can be detached, and detaches them at handover:

```javascript
// ============================================
// detachHookOutputCollectorsOnBackgrounding - stop buffering once the hook is handed to the registry
// Location: cli_inner_pretty.js:520093-520109
// ============================================

// ORIGINAL (for source lookup):
            if (
              (w(`Hooks: Detected async hook, backgrounding process ${Oe}`),
              fip({ processId: Oe, hookId: s, shellCommand: j, asyncResponse: ge, hookEvent: t,
                    hookName: r, command: H, pluginId: c }))
            )
              ((z = !0),
                F.stdout.removeListener("data", te),
                F.stderr.removeListener("data", ee),
                se?.({ stdout: Y, stderr: re, output: oe, status: 0 }));

// READABLE (for understanding):
            if (
              (logDebug(`Hooks: Detected async hook, backgrounding process ${backgroundProcessId}`),
              registerBackgroundHookProcess({ processId: backgroundProcessId, hookId, shellCommand,
                    asyncResponse, hookEvent, hookName, command, pluginId }))
            ) {
              handedOff = true;
              child.stdout.removeListener("data", onStdoutChunk);   // <- the fix
              child.stderr.removeListener("data", onStderrChunk);   // <- the fix
              resolveWaiter?.({ stdout: stdoutBuf, stderr: stderrBuf, output: combinedBuf, status: 0 });
            }

// Mapping: F→child, te→onStdoutChunk, ee→onStderrChunk, Y→stdoutBuf, re→stderrBuf,
//          oe→combinedBuf, z→handedOff, se→resolveWaiter, fip→registerBackgroundHookProcess,
//          Oe→backgroundProcessId
```

**Why the ordering matters:** the detach is inside the `if (registerBackgroundHookProcess(...))` body.
If registration *fails* the listeners stay attached and the hook is treated as synchronous — the
fail-safe direction. Detaching first and then discovering registration failed would silently lose the
hook's remaining output.

**Note the asymmetry with §1:** the MCP fix also calls `resume()`; this one does not. That is correct
here because the hook child's streams are consumed elsewhere — `:520126`/`:520129` still await
`"end"` on both — so the pipes keep draining.

---

## 4. The file edit read cache: 1,000 unbounded entries → a 16 MiB LRU

> `.208`: *"Reduced memory usage by bounding the file edit read cache to 16 MB instead of pinning up
> to 1,000 full files."*

**Verdict: NET_NEW.** Rated UNANCHORED by the scoping pass because `16777216` is 220=24 / 193=16 —
a useless count, since the bundle contains many unrelated `1 << 24`s (Yoga flags, DES tables, React
lane masks). The anchor is the **constant pair** `eky = 1000, tky = 16777216` at `:310489-310490`.

### 2.1.193: a FIFO of whole files

```javascript
// :375738-375774 (193)
class B8a {
  cache = new Map();
  maxCacheSize = 1000;
  readFile(e) { ...
    if ((this.cache.set(r, { content: i, encoding: s, mtime: n.mtimeMs }), this.cache.size > this.maxCacheSize)) {
      let a = this.cache.keys().next().value;
      if (a) this.cache.delete(a);
    }
    return { content: i, encoding: s };
  }
  getStats() { return { size: this.cache.size, entries: Array.from(this.cache.keys()) }; }
}
```

Two defects:

- **No byte budget.** 1,000 entries × arbitrary file size. A repo of large generated files (lockfiles,
  bundles, fixtures) puts hundreds of megabytes in a cache whose only limit is the entry count.
- **It is a FIFO, not an LRU.** Eviction takes `keys().next().value` (oldest *inserted*), and a cache
  **hit** returns early at `:375751 (193)` without re-inserting. The file the model is editing over and
  over is evicted on schedule while a file read once at session start survives.

### 2.1.220: a size-calculating LRU

```javascript
// ============================================
// EditFileReadCache - mtime-validated file cache bounded by entries AND characters
// Location: cli_inner_pretty.js:310451-310497
// ============================================

// ORIGINAL (for source lookup):
class OZu {
  cache;
  constructor(e = eky, t = tky) {
    this.cache = new z5({ max: e, maxSize: t, sizeCalculation: (r) => Math.max(1, r.content.length) });
  }
  readFile(e) {
    let t = Xt(), r;
    try { r = t.statSync(e); } catch (s) { throw (this.cache.delete(e), s); }
    let n = this.cache.get(e);
    if (n && n.mtime === r.mtimeMs) return { content: n.content, encoding: n.encoding };
    let o = GGn(e), i = t.readFileSync(e, { encoding: o }).replaceAll(`\r\n`, `\n`);
    return (this.cache.set(e, { content: i, encoding: o, mtime: r.mtimeMs }), { content: i, encoding: o });
  }
  ...
  getStats() {
    return { size: this.cache.size, totalChars: this.cache.calculatedSize, entries: Array.from(this.cache.keys()) };
  }
}
var eky = 1000, tky = 16777216, rky;

// READABLE (for understanding):
class EditFileReadCache {
  constructor(maxEntries = EDIT_CACHE_MAX_ENTRIES /* 1000 */,
              maxChars   = EDIT_CACHE_MAX_CHARS   /* 16777216 = 16 MiB */) {
    this.cache = new LruCache({ max: maxEntries, maxSize: maxChars,
                                sizeCalculation: (entry) => Math.max(1, entry.content.length) });
  }
  readFile(path) {
    let fs = getFs(), stat;
    try { stat = fs.statSync(path); } catch (err) { this.cache.delete(path); throw err; }  // vanished file -> drop
    let hit = this.cache.get(path);                                    // get() also refreshes recency
    if (hit && hit.mtime === stat.mtimeMs) return { content: hit.content, encoding: hit.encoding };
    let encoding = detectEncoding(path),
        content  = fs.readFileSync(path, { encoding }).replaceAll("\r\n", "\n");
    this.cache.set(path, { content, encoding, mtime: stat.mtimeMs });
    return { content, encoding };
  }
  getStats() { return { size: ..., totalChars: this.cache.calculatedSize, entries: ... }; }
}

// Mapping: OZu→EditFileReadCache, z5→LruCache, eky→EDIT_CACHE_MAX_ENTRIES,
//          tky→EDIT_CACHE_MAX_CHARS, rky→the module singleton (:310496), GGn→detectEncoding,
//          Xt→getFs, Bws (:310485)→readCachedFileContent
```

**How it works:**

1. Both limits are live. `lru-cache` evicts on whichever binds first — 1,000 entries *or* 16,777,216
   accumulated `sizeCalculation` units.
2. Recency is real: `cache.get()` on the hit path (`:310464`) refreshes the entry, so the actively
   edited file is the last thing evicted. This is the FIFO→LRU repair, and the bullet does not mention
   it.
3. `statSync` throwing (deleted/renamed file) **deletes the entry before rethrowing** (`:310462`) — a
   stale entry for a vanished path can never be served.
4. `getStats().totalChars` exposes `calculatedSize`, so the budget is observable.

**Why 16 MiB:** the cache exists so that `Edit`'s "does `old_string` still match?" check does not
re-read from disk on every edit in a multi-edit turn. The working set for that is a handful of source
files — a few hundred kilobytes. 16 MiB is roughly two orders of magnitude of headroom, chosen small
enough that the cache can never be a top-line contributor to RSS. The 1,000-entry limit is kept as a
belt-and-braces bound on *metadata* (path strings, `Map` overhead) for the pathological
many-tiny-files case, where the byte budget would never trigger.

**An accounting inconsistency worth knowing.** `sizeCalculation` here measures
`r.content.length` — JavaScript string **length**, i.e. UTF-16 code units. The sibling read-file-state
cache one screen up measures real bytes:

```javascript
// :309756 — SZu (the readFileState cache)
this.cache = new z5({ max: e, maxSize: t, sizeCalculation: (r) => Math.max(1, Buffer.byteLength(r.content)) });
```

For ASCII, V8 stores one byte per character and `.length` under-counts nothing meaningful. For CJK or
emoji-heavy content V8 stores two bytes per code unit, so the true heap cost of a "16 MiB" cache is up
to **32 MiB**. This is a 2× ceiling, not a leak, and it only bites on non-Latin1 sources — but the
inconsistency with `SZu` five hundred lines away suggests the two caches were written by different
hands and the char/byte choice was not deliberate.

### The trap this bullet sets: there are TWO new 16 MiB budgets

`16777216` also appears at `:527424` as `bB_` — the byte budget of the **fork-context prefix cache**
(see [`disk_and_transcript.md`](./disk_and_transcript.md) §4). They are unrelated caches with the same
number. Anyone grepping `16777216` and reading the first non-vendor hit will attribute the wrong
mechanism to this bullet.

---

## 5. Reading a file with an enormous single line

> `.208`: *"Fixed a memory blowup when reading files with extremely long single lines using
> offset/limit — the read now returns a clean error instead of loading the whole line."*

**Verdict: NET_NEW.** Rated UNANCHORED by the scoping pass ("long-line guard strings 0 / 0").
The anchor is the error class: `SelectedRangeTooLargeError` 220=2 / 193=0, and
`maxSelectedBytes` 220=11 / 193=0.

### The new error and the new budget

```javascript
// ============================================
// SelectedRangeTooLargeError - thrown when an offset/limit selection exceeds the byte budget
// Location: cli_inner_pretty.js:235367-235378
// ============================================

// ORIGINAL (for source lookup):
  Rir = class Rir extends Error {
    selectedBytes;
    maxSelectedBytes;
    constructor(e, t) {
      super(
        `The requested line range contains over ${pl(t)} of text, more than a read can return. Use a smaller limit — or, if a single line is this large, no limit will fit it: search for specific content instead.`,
      );
      this.selectedBytes = e;
      this.maxSelectedBytes = t;
      this.name = "SelectedRangeTooLargeError";
    }
  };

// READABLE (for understanding):
  SelectedRangeTooLargeError = class extends Error {
    constructor(selectedBytes, maxSelectedBytes) {
      super(`The requested line range contains over ${formatBytes(maxSelectedBytes)} of text, more than a read can return. `
          + `Use a smaller limit — or, if a single line is this large, no limit will fit it: search for specific content instead.`);
      this.selectedBytes = selectedBytes;
      this.maxSelectedBytes = maxSelectedBytes;
      this.name = "SelectedRangeTooLargeError";
    }
  };

// Mapping: Rir→SelectedRangeTooLargeError, Iir (:235355)→FileTooLargeError, pl→formatBytes
```

Note the message text: it explicitly names the single-line case and tells the model that *no* `limit`
will help — the correct recovery is `Grep`, not a smaller read. That phrasing is the strongest
evidence that this class was written for exactly this bullet.

### How the guard is wired — and why it only arms on `offset`/`limit`

The Read tool calls the file reader with a **sixth argument that is present only when `limit` was
supplied**:

```javascript
// :439491-439498, inside the Read tool handler; s = limit, l = maxBytes, c = maxTokens
    } = await lFe(
      n,                                        // path
      g,                                        // offset (0-based)
      s,                                        // limit
      s === void 0 ? l : void 0,                // maxBytes: only when there is NO limit
      u.abortController.signal,
      s === void 0 ? void 0 : { maxSelectedBytes: c * TSs },   // <- the new budget, only WITH a limit
    ),
```

with `TSs = 128` at `:284307`. So `maxSelectedBytes = maxTokens × 128 bytes`.

**Why the two paths are mutually exclusive:** without a `limit`, the reader already has a whole-file
byte cap `maxBytes` and truncates gracefully. *With* a `limit`, the caller has asserted "I want exactly
these N lines", so silently truncating would be a correctness bug — the model would believe it read
lines 100–200 and got them all. The new path therefore **errors** instead of truncating. That is why
the fix needed a new error class rather than reusing the existing truncation flag.

**Why 128 bytes per token:** real text is ~4 bytes/token, so this is a ~32× margin. The budget is
deliberately not a content limit — it is a *pathology detector*. It cannot fire on prose or code; it
fires on minified bundles, base64 blobs, and single-line JSON, which is precisely the class the bullet
names.

**Where it is enforced — two places, matching the two read strategies:**

1. **Whole-file path** (`Kry`, `:235139`; taken when `size < Vry = 10485760`). The accumulator helper
   `y(line)` at `:235180-235189` tracks running bytes and throws `Rir` at `:235185`.
2. **Streaming path** (`Qry`, `:235315`, `createReadStream` with `highWaterMark: 524288`). The chunk
   handler checks after each completed line (`:235261`) and after the trailing partial (`:235281`), and
   on breach calls **`this.stream.destroy(new Rir(...))`** — which is the part that actually saves
   memory: the file handle is closed mid-read and the remaining gigabytes are never allocated.

There is also a cheap pre-check at `:235124`:

```javascript
  if (a !== void 0 && l.isFile() && l.size <= a) a = void 0;
```

If the entire file is smaller than the budget, the budget is discarded so the per-line bookkeeping
never runs. Constant-time, and it removes the overhead for the overwhelmingly common case.

**2.1.193 for comparison:** `Ryt` (`:463007-463024 (193)`) takes five parameters, has no
`maxSelectedBytes`, and its line splitter pushes `e.slice(p, f)` unconditionally. A 400 MB single-line
file read with `offset: 0, limit: 1` allocated the whole line.

---

## 6. Truncation that kept the original alive (`.217`)

> `.217`: *"Fixed a memory leak where truncated MCP tool outputs kept the full untruncated result in
> memory for the rest of the session."*

**Verdict: NET_NEW, and much wider than the bullet.** Rated UNANCHORED by the scoping pass
(`untruncated` 0/0, `tengu_mcp_tool_result_truncated` 0/0). The anchor is a three-line helper:
`Buffer.from(e, "utf16le").toString("utf16le")` is **220=1 (`:20688`) / 193=0**.

### The V8 behaviour being worked around

`String.prototype.slice` in V8 does not copy for results of 13 characters or more — it allocates a
`SlicedString` holding `{parent, offset, length}`. The parent stays reachable. Truncating a 200 MB MCP
tool result to 100 KB with `.slice(0, 100000)` therefore frees **nothing**, and the 200 MB stays alive
for as long as the truncated string is referenced — which, for a tool result written into the
conversation, is the rest of the session. That is the bullet, exactly.

### The 193 code

```javascript
// :244811-244813 (193), inside KKd — the MCP content-block truncator
      else {
        let i = { type: "text", text: o.text.slice(0, s) };
        if (o._meta) i._meta = o._meta;
        n.push(i);
        break;
      }
```

and the generic helper it should have used, also non-flattening:

```javascript
// :10187-10192 (193)
function ZI(e, t) {
  if (e.length <= t) return e;
  let n = e.slice(0, t),
    r = n.charCodeAt(t - 1);
  return r >= 55296 && r <= 56319 ? n.slice(0, -1) : n;   // surrogate-safe, still a SlicedString
}
```

### The 220 fix

```javascript
// ============================================
// truncateStart / flattenString - surrogate-safe truncation that releases the parent string
// Location: cli_inner_pretty.js:20675-20689
// ============================================

// ORIGINAL (for source lookup):
function ma(e, t) {
  if (e.length <= t) return e;
  let r = e.slice(0, t),
    n = r.charCodeAt(t - 1);
  return _Il(n >= 55296 && n <= 56319 ? r.slice(0, -1) : r);
}
function m8(e, t) {
  if (e.length <= t) return e;
  let r = e.slice(-t),
    n = r.charCodeAt(0);
  return _Il(n >= 56320 && n <= 57343 ? r.slice(1) : r);
}
function _Il(e) {
  return Buffer.from(e, "utf16le").toString("utf16le");
}

// READABLE (for understanding):
function truncateStart(str, maxChars) {                    // keep the first maxChars
  if (str.length <= maxChars) return str;
  let head = str.slice(0, maxChars),
    lastUnit = head.charCodeAt(maxChars - 1);
  return flattenString(isHighSurrogate(lastUnit) ? head.slice(0, -1) : head);
}
function truncateEnd(str, maxChars) {                      // keep the last maxChars
  if (str.length <= maxChars) return str;
  let tail = str.slice(-maxChars),
    firstUnit = tail.charCodeAt(0);
  return flattenString(isLowSurrogate(firstUnit) ? tail.slice(1) : tail);
}
function flattenString(str) {
  // Copies the UTF-16 code units into a fresh Buffer and back, producing a brand-new
  // SeqString. Breaks V8's SlicedString parent pointer so the original can be collected.
  return Buffer.from(str, "utf16le").toString("utf16le");
}

// Mapping: ma→truncateStart, m8→truncateEnd, _Il→flattenString
```

and the MCP call site now routes through it:

```javascript
// :266604 — Mmy, the 220 twin of 193's KKd
        let s = ma(o.text, i);
        if (s) {
          let a = { type: "text", text: s };
          if (o._meta) a._meta = o._meta;
          r.push(a);
        }
```

**Why `utf16le` specifically:** `Buffer.from(str, "utf16le")` is a lossless memcpy of V8's internal
two-byte representation — no encoding, no validation, and (unlike `"utf8"`) it round-trips lone
surrogates unchanged, which matters because the caller has just done surrogate-boundary trimming and
must not have that undone. Cost is 2 bytes/char copied twice, i.e. linear in the *kept* size, not the
original.

**Why this approach:** the alternatives are all worse. `str.substring()` has identical V8 behaviour.
`(" " + s).slice(1)` is the folklore trick but relies on undocumented `ConsString` flattening.
`JSON.parse(JSON.stringify(s))` is orders of magnitude slower. A `Buffer` round-trip is explicit,
V8-version-independent, and readable.

**Scope of the fix.** `\bma(` occurs **66** times in 220 (the definition plus **65 call sites**);
`\bZI(` occurs 15 times in 193 (14 call sites). It is the
product-wide truncator: MCP results, transcript last-prompt normalisation (`:523594`), IDE selections,
log lines. So `.217`'s bullet names one symptom of a class fix. If any other truncation-retains-parent
bug existed in 2.1.193, this closed it too — which is a plausible (but **not proven from the bundle**)
explanation for `.208`'s otherwise-unanchorable *"unbounded growth in headless/SDK sessions from large
tool-result payloads"*.

**Honest limit:** the *string* branch of the MCP truncator, `J3` (`:20666-20673`), was already flat in
both builds — it iterates code points and `join("")`s, which allocates fresh. Only the
**array-of-content-blocks** branch leaked. Since almost every MCP server returns
`content: [{type:"text", …}]`, that is the branch that mattered.

---

## 7. Auto-update downloads: buffer → stream (`.205`)

> `.205`: *"Auto-update binary downloads now stream to disk instead of buffering in memory, cutting
> the updater's peak memory usage by roughly 400 MB."*

**Verdict: NET_NEW.** `highWaterMark: 4194304` 220=1 (`:540228`) / 193=0; five supporting literals
are also 220-only (`proxies sometimes cut off large downloads`, `Download timed out: exceeded the
total deadline`, `ERR_STREAM_PREMATURE_CLOSE`, `dropRetried`, `Failed to remove partial download`).

### 2.1.193 — three full copies in RAM

```javascript
// :352473-352488 (193), inside X1p
      let d = await cho(e, { timeout: K1p, responseType: "arraybuffer", signal: a.signal,
                             onDownloadProgress: () => { u(); }, ...r });
      c();
      let p = Buffer.isBuffer(d.data) ? d.data : Buffer.from(d.data),
        f = l3a.createHash("sha256");
      f.update(p);
      let m = f.digest("hex");
      if (m !== t) throw Error(`Checksum mismatch: expected ${t}, got ${m}`);
      return (await oGn.writeFile(n, p), await oGn.chmod(n, 493), s);
```

Peak residency: the axios `ArrayBuffer`, plus the `Buffer.from` copy when the runtime does not hand
back a `Buffer` (a genuine second allocation), plus whatever the HTTP layer holds while assembling.
For a ~130 MB Bun-compiled binary that is comfortably in the 300–400 MB range the bullet cites.

### 2.1.220 — a hashing pass-through pipeline

```javascript
// ============================================
// downloadBinaryToFile - streaming download with incremental hashing and a two-clock abort
// Location: cli_inner_pretty.js:540219-540236
// ============================================

// ORIGINAL (for source lookup):
    try {
      (g(), (p = setTimeout((b) => b.abort("deadline"), xj_(), l)));
      let y = await dKs(e, { timeout: xup, responseType: "stream", signal: l.signal, ...n }),
        _ = vup.createHash("sha256"),
        E = new x4o.Transform({
          transform(b, T, C) {
            (g(), _.update(b), C(null, b));
          },
        });
      ((f = Aup.createWriteStream(r, { highWaterMark: 4194304 })),
        f.on("drain", g),
        await Tup.pipeline(y.data, E, f, { signal: l.signal }),
        (c = !0),
        m());
      let A = _.digest("hex");
      if (A !== t)
        throw new Lr(`Checksum mismatch: expected ${t}, got ${A}`, "Checksum mismatch during binary download");
      return ((u = !0), await C4o.chmod(r, 493), { checksumRetried: i, dropRetried: s });

// READABLE (for understanding):
    try {
      refreshStallTimer();
      deadlineTimer = setTimeout((ac) => ac.abort("deadline"), getDownloadDeadlineMs(), abortController);
      let response = await httpGet(url, { timeout: DOWNLOAD_DEADLINE_MS, responseType: "stream",
                                          signal: abortController.signal, ...opts }),
        hasher = crypto.createHash("sha256"),
        hashingPassThrough = new stream.Transform({
          transform(chunk, _enc, done) {
            refreshStallTimer();          // progress = bytes through the pipe, not axios callbacks
            hasher.update(chunk);         // hash incrementally; never hold the whole binary
            done(null, chunk);            // pass through unchanged
          },
        });
      writeStream = fs.createWriteStream(destPath, { highWaterMark: 4194304 /* 4 MiB */ });
      writeStream.on("drain", refreshStallTimer);   // a slow-but-progressing disk is not a stall
      await streamPromises.pipeline(response.data, hashingPassThrough, writeStream,
                                    { signal: abortController.signal });
      pipelineCompleted = true;
      clearTimers();
      let digest = hasher.digest("hex");
      if (digest !== expectedSha256)
        throw new UserFacingError(`Checksum mismatch: expected ${expectedSha256}, got ${digest}`, ...);
      succeeded = true;
      await fsp.chmod(destPath, 0o755);
      return { checksumRetried, dropRetried };

// Mapping: kj_→downloadBinaryToFile, l→abortController, g→refreshStallTimer, p→deadlineTimer,
//          xj_→getDownloadDeadlineMs, y→response, _→hasher, E→hashingPassThrough,
//          f→writeStream, c→pipelineCompleted, m→clearTimers, u→succeeded, Dbr→MAX_DOWNLOAD_ATTEMPTS
```

**How it works, and what each change buys:**

1. `responseType: "stream"` removes the whole-body buffer. Peak becomes
   `writeStream.highWaterMark (4 MiB) + socket buffers`, **independent of binary size**.
2. The `Transform` hashes as bytes flow. `createHash().update()` is incremental, so this costs nothing
   extra; it is only expressible once the body is a stream.
3. `highWaterMark: 4194304` (4 MiB, up from Node's 64 KiB default) trades 4 MiB of RSS for ~64× fewer
   `write` syscalls — a deliberate memory-for-throughput trade in a function whose entire point was
   reducing memory. It is the right call: 4 MiB is 0.01× of what was saved.
4. **Two independent clocks.** `refreshStallTimer` (120 s, `Tj_ = 120000` `:540391`) is refreshed by
   *pipeline progress* and by `drain`; a separate `deadlineTimer` (600 s, `xup = 600000` `:540393`)
   is never refreshed. `abort("stall")` and `abort("deadline")` are distinguished at `:540246-540248`,
   and only the stall is retried — a deadline breach throws immediately. 193 had only the stall clock
   (`z1p = 120000` `:352601 (193)`), so a download that trickled forever never gave up.
   Both numbers are byte-identical to 193's; the *second clock* is the delta, not a new value.
5. **Partial-file cleanup** (`:540239-540245`) is newly *necessary*: the buffered version wrote the
   file only after a successful checksum, so a failure left nothing behind. A stream leaves a truncated
   binary at `destPath`, which a later step could try to `chmod +x` and execute. The handler closes
   the stream and `rm -f`s the path before rethrowing.
6. `ERR_STREAM_PREMATURE_CLOSE` (`:540251`) is a new failure mode for the same reason — a proxy that
   cuts a long-lived connection now surfaces as a stream error rather than an HTTP error. It is
   classified as retryable and, after `Dbr = 3` attempts, produces the user-facing *"proxies sometimes
   cut off large downloads"* hint (`:540266`).

**Key insight:** this is the cleanest example in the module of a resource fix that *creates* new
failure modes. Four of the six new literals here exist only because streaming replaced buffering.

---

## 8. Bounded settings reads (`.214`) — the device-file case

> `.214`: *"Fixed unbounded memory growth when `--settings` points at a device file or multi-GB file;
> oversized (>2 MiB) settings files now fail at startup with a clear error."*

**Verdict: NET_NEW.** `ERR_FILE_TOO_LARGE` 220=2 / 193=0; `ERR_NOT_REGULAR_FILE` 220=2 / 193=0;
`Not a regular file (device, FIFO, or socket)` 220=1 / 193=0; `File exceeds maxBytes limit` 220=1 / 193=0.

```javascript
// ============================================
// assertReadableRegularFile - the three pre-read guards behind every bounded settings read
// Location: cli_inner_pretty.js:49998-50019
// ============================================

// ORIGINAL (for source lookup):
function F4l(e, t, r) {
  let n = e.statSync(t);
  if (n.isDirectory())
    throw Object.assign(Error("EISDIR: illegal operation on a directory, read"),
      { code: "EISDIR", errno: -21, syscall: "read", path: t });
  if (!n.isFile())
    throw Object.assign(Error("Not a regular file (device, FIFO, or socket)"),
      { code: "ERR_NOT_REGULAR_FILE", path: t });
  if (r !== void 0 && n.size > r)
    throw Object.assign(Error("File exceeds maxBytes limit"),
      { code: "ERR_FILE_TOO_LARGE", path: t, size: n.size, maxBytes: r });
}

// READABLE (for understanding):
function assertReadableRegularFile(fs, path, maxBytes) {
  let stat = fs.statSync(path);
  if (stat.isDirectory())  throw errorWith("EISDIR: illegal operation on a directory, read", "EISDIR", ...);
  if (!stat.isFile())      throw errorWith("Not a regular file (device, FIFO, or socket)", "ERR_NOT_REGULAR_FILE", { path });
  if (maxBytes !== undefined && stat.size > maxBytes)
    throw errorWith("File exceeds maxBytes limit", "ERR_FILE_TOO_LARGE", { path, size: stat.size, maxBytes });
}

// Mapping: F4l→assertReadableRegularFile, e→fs, t→path, r→maxBytes,
//          OWe (:50045)→readTextFileBounded, ej (:50064)→readTextFileBoundedSync,
//          Bye (:50067)→readTextFileBoundedAsync
```

**Why the ordering is exactly this:**

1. `isDirectory()` first, because that is the common user typo and deserves the familiar `EISDIR`.
2. **`!isFile()` second — and this is the load-bearing guard.** A character device such as
   `/dev/zero` or `/dev/urandom` reports `size: 0`, so a size check would *pass* it and then
   `readFileSync` would allocate until the process is OOM-killed. The size test cannot catch this
   case; only the type test can. Note the check is `!isFile()`, not `isCharacterDevice()` — a
   fail-closed whitelist that also rejects FIFOs, sockets and block devices.
3. Size last, since it is the only one that needs the caller's budget.

All three run against the `statSync` result **before a single byte is read**, so the failure is O(1)
in file size.

`Xye = 2097152` (2 MiB) at `:62620` is the settings budget, threaded through **seven** call sites:
project/user settings loads (`:62249`, `:63410`, `:63615`), the `--settings` flag (`:833484`),
managed settings (`:865354`), the user-facing error text (`:833488`, which prints `Xye / 1048576` so
the message and the constant can never drift), and a derived quarter-budget
`fa_ = Xye / 4` (`:447658`) used to warn when the `autoMode` section alone approaches 512 KiB
(`:447507`).

**Why 2 MiB:** settings are hand-authored JSON. The largest legitimate producer is an `autoMode`
classifier rule list, and the code says so out loud in the `:447507` warning. 2 MiB is roughly two
orders of magnitude above any plausible hand-written file while still being small enough that the
whole thing can be parsed synchronously at startup without a perceptible pause.

---

## 9. Not anchored — the agent-view pasted-image bullets

> `.208`: *"Fixed a memory leak in the agent view where pasted images were retained for the screen's
> lifetime after sending peek replies."*
> `.210`: *"… agents dashboard retaining pasted images from abandoned reply drafts."*

**Verdict: UNANCHORED, and I could not close it.**
[`36_background_agents/README.md`](../36_background_agents/README.md) defers both rows here, so they
are recorded rather than dropped.

Everything in the paste-retention surface is 1:1 carryover: `pastedContents` 220=58 / **193=60** (it
*shrank*), `setPastedContents` 7/7, `pastedContents: {}` 2/2 (`:454964`, `:755027`). `pastedImage`,
`draftImages`, `clearPastedContents`, `peekReply` are 0/0 in both. The only 220-only neighbour is
`tengu_feedback_draft_discarded` (220=1/193=0), which the scoping pass already identified as a
*different* subsystem (the feedback dialog, not the agent-view reply composer).

The fix is almost certainly a React state reset — clearing a `pastedContents` object in a cleanup
effect or on submit — which compiles to no distinguishing literal. **I decline to name a line.** The
one thing that can be said with confidence: the generic paste store was not changed, so whatever was
fixed is local to the agent view's reply composer.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_performance.md](../00_overview/symbol_additions_v2_1_220_performance.md).

Key functions and constants in this document:
- `MCP_STDERR_MAX_CHARS` (`67108864` inline, `:294837`) - 64 MiB stderr guard, **carryover** (193 `:293619`)
- `detachStdioStderrCollector` (the `m.off("data", f), m.resume()` pair, `:294911`; clone `:300453`) - the actual `.208` MCP fix
- `touchDocument` (`i`, `:307176`) - LSP LRU recency bump, four call sites
- `evictOverflowDocuments` (`s`, `:307179`) - LSP eviction with real `textDocument/didClose`
- `LSP_MAX_OPEN_DOCUMENTS` (`zCy`, `:307353`) - `50`
- `onStdoutChunk` / `onStderrChunk` (`te` `:520084`, `ee` `:520081`) - named async-hook collectors, detached at `:520107-520108`
- `EditFileReadCache` (`OZu`, `:310451`) - mtime-validated LRU replacing 193's `B8a` FIFO (`:375738 (193)`)
- `EDIT_CACHE_MAX_ENTRIES` (`eky`, `:310489`) - `1000`
- `EDIT_CACHE_MAX_CHARS` (`tky`, `:310490`) - `16777216`
- `readFileStateCache` (`SZu`, `:309753`) - the sibling cache, `Buffer.byteLength` sizing, default `$xy = 26214400` (`:309832`), carryover from `:233652 (193)`
- `readFileWithLineRange` (`lFe`, `:235119`) - reader that accepts `maxSelectedBytes`
- `sliceLinesFromLoadedFile` (`Kry`, `:235139`) - whole-file path, throws at `:235185`
- `streamLinesFromFile` (`Qry`, `:235315`) - streaming path, `stream.destroy(new Rir(...))` at `:235262`/`:235282`
- `SelectedRangeTooLargeError` (`Rir`, `:235367`) - the `.208` long-line error
- `FileTooLargeError` (`Iir`, `:235355`) - pre-existing whole-file error, for contrast
- `WHOLE_FILE_READ_THRESHOLD` (`Vry`, `:235348`) - `10485760`
- `NON_REGULAR_FILE_HARD_CAP` (`zry`, `:235349`) - `134217728`
- `BYTES_PER_TOKEN_READ_BUDGET` (`TSs`, `:284307`) - `128`
- `truncateStart` (`ma`, `:20675`) - 65 call sites (66 occurrences incl. the definition); 193 twin `ZI` (`:10187 (193)`, 14 call sites)
- `truncateEnd` (`m8`, `:20681`)
- `flattenString` (`_Il`, `:20687`) - the `Buffer.from(…,"utf16le")` SlicedString breaker, 220-only
- `truncateMcpContentBlocks` (`Mmy`, `:266595`) - now calls `ma` at `:266604`; 193 twin `KKd` used raw `.slice` at `:244811 (193)`
- `getMcpOutputTokenLimit` (`tyo`, `:266544`) - `MAX_MCP_OUTPUT_TOKENS` env → `tengu_velvet_ibis.mcp_tool` gate → `Dmy = 25000`
- `downloadBinaryToFile` (`kj_`, `:540200`) - streaming updater; 193 twin `X1p` (`:352459 (193)`)
- `DOWNLOAD_STALL_TIMEOUT_MS` (`Tj_`, `:540391`) - `120000` (carryover value)
- `DOWNLOAD_DEADLINE_MS` (`xup`, `:540393`) - `600000`, newly used as a second clock
- `MAX_DOWNLOAD_ATTEMPTS` (`Dbr`, `:540392`) - `3`
- `assertReadableRegularFile` (`F4l`, `:49998`) - the three pre-read guards
- `readTextFileBoundedSync` (`ej`, `:50064`) / `readTextFileBoundedAsync` (`Bye`, `:50067`)
- `MAX_SETTINGS_FILE_BYTES` (`Xye`, `:62620`) - `2097152`, seven call sites
- `MAX_AUTO_MODE_SECTION_BYTES` (`fa_`, `:447658`) - `Xye / 4`
