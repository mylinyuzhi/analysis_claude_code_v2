# File and search tools: Read / Edit / Write / Grep / Glob / NotebookEdit deltas

Nine changelog bullets across `.208`, `.210`, `.212` and `.218` land on the file and search tools. Four of
them are the most instructive deltas in the whole `04_tools/` theme, because in each case the *literal* is
carryover and the change is a **removed gate**, a **new constructor argument**, or a **new bail-out
condition**. This document proves each one.

Two findings here contradict the naive reading of the changelog:

- `.208` "Edit failing on files modified after reading when the text still matches uniquely" is **not**
  carryover, despite every error literal being unchanged. It was fixed by **deleting a GrowthBook gate**
  (`tengu_cedar_sundial`, 220=0 / **193=1**) and replacing it with a permission-derived predicate.
- `.208` "bounding the file edit read cache to 16 MB instead of pinning up to 1,000 full files" is
  **exactly true**, and provable to the byte — but it applies to a *different* cache from the one most
  readers will find first (`readFileState`, which is unchanged at 25 MiB in both builds).

---

## 1. Grep / Glob pagination past the end of results (`.208` #17, `.210` #14)

> `.208`: Fixed Read reporting empty files as "shorter than offset", Grep silently returning "No files
> found" for invalid regex patterns, Grep count mode under-reporting totals when paginated, and Glob
> crashing with an unclear error when the pattern, path, or working directory contained a null byte
>
> `.210`: Fixed Grep content mode claiming "No matches found" when paginating past the end of results

**Verdict: NET_NEW.** `No entries at this offset` **220=3 / 193=0**; `totalFiles` **220=3 / 193=0**;
`must be a whole number of 0 or more` **220=1 / 193=0**.

The single result mapper covers all three Grep/Glob output modes, and 2.1.193's version of the very same
function is available for a line-by-line comparison:

```javascript
// ============================================
// GrepTool.mapToolResultToToolResultBlockParam - three pagination-aware empty-result branches
// Location: cli_inner_pretty.js:312191-312240   (193 counterpart :378905-378942 (193))
// ============================================

// ORIGINAL (for source lookup, 2.1.220):
      mapToolResultToToolResultBlockParam(
        { mode: e = "files_with_matches", numFiles: t, filenames: r, content: n, numLines: o,
          numMatches: i, totalFiles: s, totalLines: a, appliedLimit: l, appliedOffset: c }, u ) {
        if (e === "content") {
          let f = iTs(l, c),
            m = n || (c && (a ?? 0) > 0 ? "No entries at this offset" : "No matches found"),
            g = f ? `${m}\n\n[Showing results with pagination = ${f}]` : m;
          return { tool_use_id: u, type: "tool_result", content: g };
        }
        if (e === "count") {
          let f = iTs(l, c), m = i ?? 0, g = t ?? 0,
            y = n || (m > 0 ? "No entries at this offset" : "No matches found"),
            _ = `\n\nFound ${m} total ${m === 1 ? "occurrence" : "occurrences"} across ${g} ${g === 1 ? "file" : "files"}.${f ? ` with pagination = ${f}` : ""}`;
          return { tool_use_id: u, type: "tool_result", content: y + _ };
        }
        let d = iTs(l, c);
        if (t === 0)
          return { tool_use_id: u, type: "tool_result",
            content: c && (s ?? 0) > 0
              ? `No entries at this offset. [Showing results with pagination = ${d}]`
              : "No files found" };
        ...
      },

// ORIGINAL (2.1.193 — cli_inner_pretty.js:378905-378939 (193), the same three places):
//   content mode:  let p = r || "No matches found",
//   count mode:    let p = r || "No matches found",
//   files mode:    if (t === 0) return { ..., content: "No files found" };

// READABLE (for understanding, 2.1.220):
      mapToolResultToToolResultBlockParam(
        { mode = "files_with_matches", numFiles, filenames, content, numLines,
          numMatches, totalFiles, totalLines, appliedLimit, appliedOffset }, toolUseId) {
        if (mode === "content") {
          let pageNote = formatPaginationNote(appliedLimit, appliedOffset),
            // "past the end" == an offset was applied AND the file set really did have lines
            body = content || (appliedOffset && (totalLines ?? 0) > 0
                                ? "No entries at this offset" : "No matches found");
          return { tool_use_id: toolUseId, type: "tool_result",
                   content: pageNote ? `${body}\n\n[Showing results with pagination = ${pageNote}]` : body };
        }
        if (mode === "count") {
          let pageNote = formatPaginationNote(appliedLimit, appliedOffset),
            matches = numMatches ?? 0, files = numFiles ?? 0,
            // count mode keys on numMatches, not on totalLines: the server-side count is authoritative
            body = content || (matches > 0 ? "No entries at this offset" : "No matches found");
          return { tool_use_id: toolUseId, type: "tool_result",
                   content: body + `\n\nFound ${matches} total ${...} across ${files} ${...}.${...}` };
        }
        let pageNote = formatPaginationNote(appliedLimit, appliedOffset);
        if (numFiles === 0)
          return { tool_use_id: toolUseId, type: "tool_result",
            content: appliedOffset && (totalFiles ?? 0) > 0
              ? `No entries at this offset. [Showing results with pagination = ${pageNote}]`
              : "No files found" };
        ...
      },

// Mapping: iTs→formatPaginationNote (:312007), a→totalLines, s→totalFiles, c→appliedOffset, l→appliedLimit
```

### The "empty because paginated" vs "empty because absent" distinction

**What it does:** distinguishes *"your query matched nothing"* from *"your query matched things, but your
`offset` is past the last one"* — two states that produced the identical string in 2.1.193.

**How it works:** each of the three modes needs a different witness that results existed:

| Mode | Witness | Predicate | Why this witness |
|---|---|---|---|
| `content` | `totalLines` | `appliedOffset && (totalLines ?? 0) > 0` | content mode paginates over *matching lines*, so the total line count is the right denominator |
| `count` | `numMatches` | `numMatches > 0` | count mode's own payload already contains the authoritative total; no separate `total*` field is needed, and `appliedOffset` is not even consulted |
| `files_with_matches` / Glob | `totalFiles` (**new field**) | `appliedOffset && (totalFiles ?? 0) > 0` | file mode paginates over *files*, so a file-count total had to be added |

`totalFiles` being **220=3 / 193=0** while `totalLines` is 220=44 / 193=38 is the tell: the line total
already existed and only had to be *consulted*; the file total had to be *plumbed through*.

**Why `count` mode does not test `appliedOffset`:** in count mode the numeric total is emitted regardless
of pagination, so `matches > 0` with empty `content` can only mean the page was empty. Adding the offset
test would be redundant and would mis-handle the case where a caller passes `offset: 0` explicitly
(`0` is falsy, so `appliedOffset && …` would fail). Note the other two modes **do** have that latent
quirk: `offset: 0` with matches beyond the page would still say "No matches found". Given `offset: 0` is
also the "no pagination" default, that is benign, but it is a real edge in the predicate.

**Why it matters more than it looks:** an agent that reads "No matches found" concludes the thing does not
exist and stops searching. "No entries at this offset" tells it to reduce `offset`. This is a
**model-behaviour** bug fix expressed as a string change — the class of fix that is invisible in a diff
of behaviour but decisive in a diff of outcomes.

### 1.1 The `.208` input-validation half

The same bullet's "Read reporting empty files as shorter than offset" / "Grep … invalid regex" clauses map
to the validator immediately above, `:312151-312177`:

```javascript
        for (let [a, l] of [ ["head_limit", o], ["offset", i] ])
          if (l !== void 0 && (!Number.isInteger(l) || l < 0))
            return { result: !1,
              message: `${a} must be a whole number of 0 or more, got ${l}.${a === "head_limit" ? " Pass 0 for unlimited." : ""}`,
              errorCode: 2 };
```

`must be a whole number of 0 or more` is **220=1 / 193=0**; `Pass 0 for unlimited` is **220=2 / 193=1**,
so the phrase existed once before and is now also used in this validator. The loop validates both
parameters with one code path, and appends the `Pass 0 for unlimited` hint only for `head_limit` — because
`offset: 0` and `head_limit: 0` mean different things (start-of-results vs unlimited), and a single shared
message would have been wrong for one of them.

Note the UNC bail-out one line earlier (`:312164`):

```javascript
          if (l.startsWith("\\\\") || l.startsWith("//")) return { result: !0 };
```

A UNC path is accepted without `stat`, because `stat` on an unreachable share blocks for the OS timeout.
`.216` #20 (`UNC network paths require manual approval`, 220=1 / **193=1**) handles the security side of
UNC in the permission layer — that is carryover and belongs to `38_permissions`.

---

## 2. ripgrep and the null byte (`.208` #17, fourth clause)

**Verdict: NET_NEW.** `ripgrep spawn blocked: null byte` **220=3 / 193=0**.

```javascript
// ============================================
// assertNoNullBytesBeforeRipgrepSpawn - three-way blame before spawning rg
// Location: cli_inner_pretty.js:204177-204187
// ============================================

// ORIGINAL (for source lookup):
function rss(e, t, r) {
  let n = e.findIndex((i) => i.includes("\x00")),
    o = r.includes("\x00")
      ? { local: "the session working directory", telemetry: "ripgrep spawn blocked: null byte in session cwd" }
      : t.includes("\x00")
        ? { local: "the target path", telemetry: "ripgrep spawn blocked: null byte in target path" }
        : n !== -1
          ? { local: `caller argument ${n}`, telemetry: "ripgrep spawn blocked: null byte in argv" }
          : null;
  if (o) throw oi(new HTu(`Cannot spawn ripgrep: ${o.local} contains a null byte (\\0)`), o.telemetry);
}

// READABLE (for understanding):
function assertNoNullBytesBeforeRipgrepSpawn(argv, targetPath, cwd) {
  let badArgIndex = argv.findIndex((a) => a.includes("\0"));
  let blame =
      cwd.includes("\0")        ? { local: "the session working directory",
                                    telemetry: "ripgrep spawn blocked: null byte in session cwd" }
    : targetPath.includes("\0") ? { local: "the target path",
                                    telemetry: "ripgrep spawn blocked: null byte in target path" }
    : badArgIndex !== -1        ? { local: `caller argument ${badArgIndex}`,
                                    telemetry: "ripgrep spawn blocked: null byte in argv" }
    : null;
  if (blame)
    throw tagForTelemetry(new RipgrepSpawnError(`Cannot spawn ripgrep: ${blame.local} contains a null byte (\\0)`),
                          blame.telemetry);
}

// Mapping: rss→assertNoNullBytesBeforeRipgrepSpawn, HTu→RipgrepSpawnError, oi→tagForTelemetry
```

Called from all three spawn paths — `:204205` (`argv0` spawn), `:204261`, `:204296`.

### Why blame ordering is cwd → target → argv

**What it does:** replaces Node's opaque `TypeError [ERR_INVALID_ARG_VALUE]: The argument 'cwd' must be a
string without null bytes` with a message naming which of three inputs is poisoned.

**How it works / why this order:** the three sources have different *causes* and different *fixes*, and the
order is by decreasing blast radius:

1. **cwd** — a poisoned session cwd breaks *every* subsequent search, not just this one. It is checked
   first so that the message points at the durable problem rather than at a downstream symptom.
2. **target path** — model-supplied `path` argument; the model can correct it.
3. **argv index** — a caller bug inside the CLI, reported with the index so it can be located in code.

Note `badArgIndex` is computed eagerly but only *used* in the third branch. That is a deliberate
simplification (one `findIndex` instead of duplicating it inside a nested ternary) at the cost of one
scan on the happy path — argv is a handful of short strings, so the cost is nil.

**Why throw rather than sanitise?** A null byte in a search pattern or path is never intentional; it is a
symptom of a truncated buffer or a mis-decoded string upstream. Stripping it would produce a search for
something the caller did not ask for. The separate `telemetry` string per branch means the three causes are
distinguishable in aggregate data, which is how you find out *which* upstream bug is producing them.

---

## 3. Memory blowup on files with extremely long single lines (`.208` #33)

> Fixed a memory blowup when reading files with extremely long single lines using offset/limit — the read
> now returns a clean error instead of loading the whole line

**Verdict: NET_NEW, and the scoping file's `UNANCHORED / THIN` verdict for this bullet is superseded.**
`maxSelectedBytes` **220=11 / 193=0**; `SelectedRangeTooLargeError` **220=2 / 193=0**;
`The requested line range contains over` **220=1 / 193=0**; `no limit will fit it` **220=1 / 193=0**.

The fix is a new **optional byte budget** threaded from the Read tool into the streaming line reader, and
it is only supplied on the `limit`-present path:

```javascript
// ============================================
// ReadTool.call (text path) - passes a byte budget only when the caller asked for a line range
// Location: cli_inner_pretty.js:439483-439497
// ============================================

// ORIGINAL (for source lookup):
  let g = i === 0 ? 0 : i - 1,
    { content: y, lineCount: _, totalLines: E, totalBytes: A, readBytes: b, mtimeMs: T } = await lFe(
      n,
      g,
      s,
      s === void 0 ? l : void 0,
      u.abortController.signal,
      s === void 0 ? void 0 : { maxSelectedBytes: c * TSs },
    ),

// READABLE (for understanding):
  let zeroBasedOffset = offset === 0 ? 0 : offset - 1,
    { content, lineCount, totalLines, totalBytes, readBytes, mtimeMs } = await readFileLines(
      absolutePath,
      zeroBasedOffset,
      limit,
      limit === undefined ? wholeFileByteLimit : undefined,     // whole-file cap only when unpaginated
      ctx.abortController.signal,
      limit === undefined ? undefined : { maxSelectedBytes: tokenCap * MAX_BYTES_PER_TOKEN },   // TSs = 128
    ),

// Mapping: lFe→readFileLines, s→limit, l→wholeFileByteLimit, c→tokenCap, TSs→MAX_BYTES_PER_TOKEN (:284307)
```

The reader honours the budget both in the small-file fast path and in the streaming path:

```javascript
// ============================================
// readFileLines - byte-budget short circuit and the two enforcement points
// Location: cli_inner_pretty.js:235119-235137 (entry), :235180-235189 (buffered), :235257-235285 (stream)
// ============================================

// ORIGINAL (for source lookup) - entry:
async function lFe(e, t = 0, r, n, o, i) {
  o?.throwIfAborted();
  let s = i?.truncateOnByteLimit ?? !1,
    a = i?.maxSelectedBytes,
    l = await Zpo.stat(e);
  if (a !== void 0 && l.isFile() && l.size <= a) a = void 0;
  ...
  if (l.isFile() && l.size < Vry) {
    if (!s && n !== void 0 && l.size > n) throw new Iir(l.size, n);
    let c = await Zpo.readFile(e, { encoding: "utf8", signal: o });
    return Kry(c, l.size, l.mtimeMs, t, r, s ? n : void 0, a);
  }
  return Qry(e, t, r, n, a, l.isFile() ? void 0 : zry, s, o);
}

// ORIGINAL - the per-line accumulator inside the buffered splitter (:235180-235189):
  function y(E) {
    if (s !== void 0 || i !== void 0) {
      let A = u.length > 0 ? 1 : 0,
        b = m + A + Buffer.byteLength(E);
      if (i !== void 0 && b > i) return ((g = !0), !1);
      if (s !== void 0 && b > s) throw new Rir(b, s);
      m = b;
    }
    return (u.push(E), !0);
  }

// ORIGINAL - the streaming enforcement (:235261-235263):
        else if (this.maxSelectedBytes !== void 0 && u > this.maxSelectedBytes) {
          this.stream.destroy(new Rir(u, this.maxSelectedBytes));
          return;
        }

// READABLE (for understanding) - entry:
async function readFileLines(path, offset = 0, limit, wholeFileByteLimit, signal, opts) {
  signal?.throwIfAborted();
  let truncateOnByteLimit = opts?.truncateOnByteLimit ?? false,
    maxSelectedBytes = opts?.maxSelectedBytes,
    st = await fsp.stat(path);
  // If the WHOLE file fits the budget, drop the budget: no per-line accounting needed at all.
  if (maxSelectedBytes !== undefined && st.isFile() && st.size <= maxSelectedBytes) maxSelectedBytes = undefined;
  ...
  if (st.isFile() && st.size < SMALL_FILE_THRESHOLD /* 10 MiB, Vry */) {
    if (!truncateOnByteLimit && wholeFileByteLimit !== undefined && st.size > wholeFileByteLimit)
      throw new FileTooLargeError(st.size, wholeFileByteLimit);
    let text = await fsp.readFile(path, { encoding: "utf8", signal });
    return splitBufferedLines(text, st.size, st.mtimeMs, offset, limit,
                              truncateOnByteLimit ? wholeFileByteLimit : undefined, maxSelectedBytes);
  }
  return streamFileLines(path, offset, limit, wholeFileByteLimit, maxSelectedBytes,
                         st.isFile() ? undefined : STREAM_CAP /* 128 MiB, zry */, truncateOnByteLimit, signal);
}

// Mapping: lFe→readFileLines, Kry→splitBufferedLines, Qry→streamFileLines,
//          Iir→FileTooLargeError (:235355), Rir→SelectedRangeTooLargeError (:235367),
//          Vry→SMALL_FILE_THRESHOLD (10485760), zry→STREAM_CAP (134217728)
```

The error class, read verbatim at `:235367-235378`:

```javascript
  Rir = class Rir extends Error {
    selectedBytes; maxSelectedBytes;
    constructor(e, t) {
      super(`The requested line range contains over ${pl(t)} of text, more than a read can return. Use a smaller limit \u2014 or, if a single line is this large, no limit will fit it: search for specific content instead.`);
      this.selectedBytes = e; this.maxSelectedBytes = t; this.name = "SelectedRangeTooLargeError";
    }
  };
```

### The byte-budget design

**What it does:** bounds the memory a paginated `Read` can allocate, and fails fast when even a single
requested line exceeds the bound.

**How it works:**
1. The budget is `tokenCap × 128` (`c * TSs`, `TSs = 128` at `:284307`). 128 bytes/token is a deliberate
   over-estimate — real text is 3–4 bytes/token, so the budget is roughly **32× the token cap in
   "reasonable text" terms**. It is a memory guard, not a token guard: it must never reject a page that
   the token cap would have accepted.
2. `if (a !== void 0 && l.isFile() && l.size <= a) a = void 0;` (`:235124`) — **the budget is dropped
   entirely when the whole file already fits**. This one line is what keeps the fix free for the 99.9% case:
   without it, every paginated read of every small file would pay `Buffer.byteLength()` per line.
3. Enforcement is *incremental*: the accumulator tracks running bytes (`m` / `this.selectedBytes`), adds
   1 for the joining newline (`u.length > 0 ? 1 : 0`), and compares before pushing. So the offending line
   is **never appended** — the peak allocation is the current chunk, not the line.
4. In the streaming path the reaction is `this.stream.destroy(new Rir(...))` — the read stream is torn
   down mid-file, so a 2 GB single-line file stops being read at the point of overflow.
5. `truncateOnByteLimit` (220=10 / 193=7) is the *other*, pre-existing knob: it makes the whole-file cap
   truncate instead of throw. The two are kept separate — `maxSelectedBytes` **always** throws, because a
   truncated line range would silently give the model a partial line and no way to know.

**Why throw rather than truncate here?** The message answers it: `if a single line is this large, no limit
will fit it: search for specific content instead`. Truncating mid-line hands the model a fragment that
looks complete. The error redirects to `Grep`, which streams and never materialises the line.

**Who consumes the error:** `:517734` — the at-mention / auto-read path catches all three of
`X9e` (token cap), `Iir` (`FileTooLargeError`) and `Rir` and falls back to `u()` (the degraded
attachment), so a mention of a pathological file does not break the turn.

### 3.1 CARRYOVER trap in the immediate neighbourhood

The **token-cap** long-line path that sits 40 lines below (`:439522-439546`) is *nearly byte-identical* to
193 `:471982-472008 (193)`, including the string `this file has very long lines and cannot be paginated by
line` (**220=1 / 193=1**), the 6-iteration `0.7`-shrink loop, and the lone-surrogate trim
(`if (Y >= 55296 && Y <= 56319) j = j.slice(0, -1)`). The only 220 difference is a `${r}: ` file-path
prefix on the notice. **Do not present that block as the fix** — it is the pre-existing token-budget
degradation, and it operates *after* the file has already been loaded, which is precisely why the byte
budget had to be added upstream.

---

## 4. The file-edit read cache: 1,000 entries -> 16 MiB (`.208` #37)

> Reduced memory usage by bounding the file edit read cache to 16 MB instead of pinning up to 1,000 full
> files

**Verdict: NET_NEW and exactly as described.** The class was rewritten from a hand-rolled FIFO `Map` to a
size-aware LRU.

```javascript
// ============================================
// FileContentCache - mtime-keyed content cache used by the edit tools
// Location: cli_inner_pretty.js:310451-310484   (193: :375738-375774 (193))
// ============================================

// ORIGINAL (for source lookup, 2.1.220):
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
    let o = GGn(e),
      i = t.readFileSync(e, { encoding: o }).replaceAll(`\r\n`, `\n`);
    return (this.cache.set(e, { content: i, encoding: o, mtime: r.mtimeMs }), { content: i, encoding: o });
  }
  clear() { this.cache.clear(); }
  invalidate(e) { this.cache.delete(e); }
  getStats() {
    return { size: this.cache.size, totalChars: this.cache.calculatedSize, entries: Array.from(this.cache.keys()) };
  }
}
var eky = 1000, tky = 16777216;

// ORIGINAL (2.1.193 — cli_inner_pretty.js:375738-375774 (193)):
class B8a {
  cache = new Map();
  maxCacheSize = 1000;
  readFile(e) {
    ...
    if ((this.cache.set(r, { content: i, encoding: s, mtime: n.mtimeMs }), this.cache.size > this.maxCacheSize)) {
      let a = this.cache.keys().next().value;
      if (a) this.cache.delete(a);
    }
    return { content: i, encoding: s };
  }
  ...
  getStats() { return { size: this.cache.size, entries: Array.from(this.cache.keys()) }; }
}

// READABLE (for understanding, 2.1.220):
class FileContentCache {
  cache;
  constructor(maxEntries = FILE_CACHE_MAX_ENTRIES /* 1000 */,
              maxBytes   = FILE_CACHE_MAX_BYTES   /* 16777216 = 16 MiB */) {
    this.cache = new LRUCache({ max: maxEntries, maxSize: maxBytes,
                                sizeCalculation: (v) => Math.max(1, v.content.length) });
  }
  readFile(path) {
    let fs = getFs(), st;
    try { st = fs.statSync(path); }
    catch (err) { throw (this.cache.delete(path), err); }        // a vanished file is evicted, then rethrown
    let hit = this.cache.get(path);
    if (hit && hit.mtime === st.mtimeMs) return { content: hit.content, encoding: hit.encoding };
    let encoding = detectEncoding(path),
      text = fs.readFileSync(path, { encoding }).replaceAll("\r\n", "\n");   // normalised at ingest
    this.cache.set(path, { content: text, encoding, mtime: st.mtimeMs });
    return { content: text, encoding };
  }
  getStats() { return { size: this.cache.size, totalChars: this.cache.calculatedSize,
                        entries: Array.from(this.cache.keys()) }; }
}

// Mapping: OZu→FileContentCache, z5→LRUCache, eky→FILE_CACHE_MAX_ENTRIES, tky→FILE_CACHE_MAX_BYTES,
//          Xt→getFs, GGn→detectEncoding, Bws (:310485)→readCachedFileContent
```

### Why the rewrite, and what "1,000 full files" cost

**The 193 failure mode, precisely:** the cache was a `Map` with an *entry-count* bound only. Eviction
took `this.cache.keys().next().value` — the **oldest inserted** key, i.e. FIFO, not LRU. There was no
notion of size. A session that edited 1,000 files of 2 MB each would hold **2 GB** of normalised file text
with no pressure release, and the FIFO order meant the file you were actively editing could be evicted
while 999 stale ones stayed resident.

**The 220 fix does three things with one class swap:**
1. **`maxSize: 16777216`** with `sizeCalculation: (v) => Math.max(1, v.content.length)` — a hard byte
   ceiling. 16 MiB is roughly 1,000 × 16 KB, i.e. it preserves the *intended* capacity for
   normal-sized source files while capping the pathological case. `Math.max(1, …)` avoids a zero size for
   an empty file, which `lru-cache` rejects.
2. **LRU instead of FIFO** — recency now protects the working set.
3. **`max: 1000` retained** as a second bound, so a session touching a million 10-byte files still cannot
   grow the map unboundedly (16 MiB / 10 bytes would otherwise be 1.6 M entries of overhead).

`totalChars: this.cache.calculatedSize` in `getStats()` is new and is how you would verify the bound at
runtime.

**Trade-off:** an `lru-cache` instance with `sizeCalculation` is measurably slower per `set` than a raw
`Map`, and content length in UTF-16 code units is not bytes (a CJK-heavy file counts ~1 unit per 2 bytes,
so the real ceiling can approach 32 MB). Both were accepted; the bound only has to be *a* bound.

### 4.1 The cache the bullet does **not** refer to

`readFileState` — the per-session "which files has the model read, and when" map — is a **different**
cache and is **unchanged**. Its class (`SZu`, `:309753-309802`) is byte-for-byte equivalent to 193's
`nXi` (`:233649-233699 (193)`), with the same defaults:

| | 2.1.220 | 2.1.193 |
|---|---|---|
| class | `SZu` `:309753` | `nXi` `:233649 (193)` (`lF` factory `:233701 (193)`) |
| default `maxSize` | `$xy = 26214400` (25 MiB) `:309832` | `L9d = 26214400` `:233724 (193)` |
| default `max` | `S9 = 5000` `:309831` | `p1 = 5000` `:233723 (193)` |
| inline-content threshold | `Nxy = 4096` `:309833` | `D9d = 4096` `:233725 (193)` |
| `sizeCalculation` | `Math.max(1, Buffer.byteLength(r.content))` | identical |

So a reader who greps `readFileState` (220=80 / 193=70) looking for the "16 MB" change will find nothing —
the +10 sites are new *call sites*, not a new bound. Recording the distinction because conflating the two
caches would produce a wrong write-up of a correct bullet.

---

## 5. Edit on a file modified since read (`.208` #14) — a DELETED GATE, not carryover

> `.208`: Fixed Edit failing on files modified after reading when the text still matches uniquely

The scoping file marks this **CARRYOVER / THIN** on the basis that `has been modified since` is
**220=3 / 193=3**. The literal *is* carryover. The behaviour is not. Here is the proof.

```javascript
// ============================================
// EditTool.validateInput (stale-read branch) - the recovery predicate changed
// Location: cli_inner_pretty.js:311114-311130   (193: :452615-452629 (193))
// ============================================

// ORIGINAL (for source lookup, 2.1.220):
        if (p) {
          if (MQ(s) > p.timestamp)
            if (Aze(p) && EEe(p, d));
            else {
              let A = Qws(d, n, i),
                b = A === "applies" && Jws(s, t);
              if ((O("tengu_edit_tool_stale_read", { wouldHaveResult: XZu(A), recovered: b }), !b))
                return { result: !1, behavior: "ask",
                  message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
                  errorCode: 7 };
            }
        }

// ORIGINAL (2.1.193 — cli_inner_pretty.js:452615-452629 (193)):
        if (p) {
          if (RZ(i) > p.timestamp)
            if ((p.offset ?? 1) <= 1 && p.limit === void 0 && gce(p, d));
            else {
              let _ = KCo(d, r, s), S = lgl(_);
              if ((V("tengu_edit_tool_stale_read", { wouldHaveResult: cgl(_), recovered: S }), !S))
                return { result: !1, behavior: "ask", message: "File has been modified since read, ...", errorCode: 7 };
            }
        }
// and the predicate it used:
function lgl(e) { return e === "applies" && it("tengu_cedar_sundial", !1); }     // :452397-452399 (193)

// READABLE (for understanding, 2.1.220):
        if (lastRead) {
          if (mtimeOf(absPath) > lastRead.timestamp)
            if (isFullFileRead(lastRead) && contentMatchesCachedRead(lastRead, diskContent)) { /* fine */ }
            else {
              let applicability = classifyOldStringApplicability(diskContent, oldString, replaceAll),
                recovered = applicability === "applies" && readWouldBeAutoAllowed(absPath, ctx);
              logEvent("tengu_edit_tool_stale_read", { wouldHaveResult: bucket(applicability), recovered });
              if (!recovered)
                return { result: false, behavior: "ask",
                         message: "File has been modified since read, ...", errorCode: 7 };
            }
        }

// Mapping: Aze→isFullFileRead (:309718), EEe→contentMatchesCachedRead (:309735),
//          Qws→classifyOldStringApplicability (:310881), Jws→readWouldBeAutoAllowed (:310878),
//          MQ→mtimeOf, lgl (193)→wasGatedRecoveryAllowed
```

**The delta, stated exactly:**

| | 2.1.193 | 2.1.220 |
|---|---|---|
| recovery predicate | `applicability === "applies" && getFeatureValue("tengu_cedar_sundial", false)` | `applicability === "applies" && readWouldBeAutoAllowed(path, ctx)` |
| gate `tengu_cedar_sundial` | **1 occurrence** | **0 occurrences** |
| gate `tengu_velvet_hammer` (the sibling not-read-yet gate) | **2 occurrences** | **0 occurrences** |
| gate `tengu_velvet_mallet` | 3 | 2 |
| full-file-read test | inline `(p.offset ?? 1) <= 1 && p.limit === void 0 && gce(p, d)` | extracted to `Aze(p) && EEe(p, d)` |

Both `tengu_cedar_sundial` and `tengu_velvet_hammer` appear in the **GONE gate list** of
[`../00_overview/_raw_asset_diff_193_to_220.md`](../00_overview/_raw_asset_diff_193_to_220.md).
So in 2.1.193 the unique-match recovery **existed but was off by default** (`getFeatureValue(…, false)`),
which is precisely the reported symptom: "Edit failing on files modified after reading when the text still
matches uniquely". The `.208` fix removed the gate and replaced it with a real predicate.

### The replacement predicate is a permission question, not a flag

```javascript
// ============================================
// readWouldBeAutoAllowed - "could the model just re-Read this file without a prompt?"
// Location: cli_inner_pretty.js:310874-310880 (cky/Jws) + :528628-528639 (DKe/Zws)
// ============================================

// ORIGINAL (for source lookup):
function Zws(e, t) {
  if (WB(t, DIe) !== null || PIe(t, DIe) !== null) return !1;
  let r = DKe(e, t);
  if (r.behavior === "allow") return !0;
  if (r.behavior !== "ask") return !1;
  if (t.mode !== "bypassPermissions") return !1;
  let n = r.decisionReason;
  return !(n?.type === "rule" && n.rule.ruleBehavior === "ask");
}
function cky(e) {
  let t = e.options.tools ?? [];
  return t.some((r) => qa(r, fl)) && !t.some((r) => qa(r, zi)) && !t.some((r) => qa(r, Ng));
}
function Jws(e, t) {
  return !cky(t) && Zws(e, En(t));
}

// READABLE (for understanding):
function readOnPathIsSilentlyAllowed(absPath, permissionCtx) {
  // Any deny or ask rule naming the Read tool at all -> the user cares about reads -> no shortcut.
  if (findDenyRuleForTool(permissionCtx, ReadTool) !== null
   || findAskRuleForTool(permissionCtx, ReadTool)  !== null) return false;
  let decision = checkReadPermission(absPath, permissionCtx);
  if (decision.behavior === "allow") return true;
  if (decision.behavior !== "ask") return false;                   // deny
  if (permissionCtx.mode !== "bypassPermissions") return false;    // "ask" is a real prompt -> no shortcut
  let why = decision.decisionReason;
  return !(why?.type === "rule" && why.rule.ruleBehavior === "ask");  // in bypass, only an explicit ask rule blocks
}
function toolsetHasEditButNoRead(ctx) {
  let tools = ctx.options.tools ?? [];
  return tools.some((t) => toolNameMatches(t, "Edit"))
      && !tools.some((t) => toolNameMatches(t, "Read"))
      && !tools.some((t) => toolNameMatches(t, "REPL"));
}
function readWouldBeAutoAllowed(absPath, ctx) {
  return !toolsetHasEditButNoRead(ctx) && readOnPathIsSilentlyAllowed(absPath, permissionContextOf(ctx));
}

// Mapping: Zws→readOnPathIsSilentlyAllowed, cky→toolsetHasEditButNoRead, Jws→readWouldBeAutoAllowed,
//          DIe→ReadTool proxy (:529062), DKe→checkReadPermission (:528628), WB/PIe→deny/ask rule finders,
//          En→permissionContextOf, fl→"Edit" (:151945), zi→"Read" (:162298), Ng→"REPL" (:162744)
```

### The recovery decision

**What it does:** allows an `Edit` to proceed against a file whose mtime moved after the last read, when
(a) the `old_string` still matches **uniquely** on the current disk content, and (b) the model could have
re-read the file without asking anyone.

**How it works:**
1. `classifyOldStringApplicability` (`:310881-310890`, 193 counterpart `KCo` `:452387 (193)`) returns one of three states, and the ordering is
   the whole safety argument:
   ```javascript
   function Qws(e, t, r) {
     if (t === "") return "no_match";                          // empty old_string is a create, not an edit
     let n = Pdt(e, t);
     if (!n) return "no_match";                                // the text is gone -> the change conflicts
     if (!r) {                                                 // unless replace_all
       let o = e.indexOf(n);
       if (e.indexOf(n, o + n.length) !== -1) return "ambiguous";   // 2+ occurrences -> cannot recover
     }
     return "applies";
   }
   ```
   Only `"applies"` — present **exactly once** (or `replace_all`) — can recover. `"ambiguous"` is refused
   because the external edit may have inserted the second occurrence, and picking one would be a coin flip.
2. `readWouldBeAutoAllowed` reframes the question as a **permission equivalence**: if `Read` on this path
   is silently allowed, then the read-before-write rule buys nothing — the model could call `Read` and
   immediately retry, and the only effect of refusing is a wasted round trip. If reading would *prompt*,
   the rule is protecting a user decision and must hold.
3. The deny/ask-rule pre-check (`WB`/`PIe` against the Read tool) is a **coarse veto**: any rule anywhere
   mentioning `Read` disables the shortcut, even if it would not apply to this path. Cheap and
   conservative.
4. `toolsetHasEditButNoRead` is the fail-closed clause: a tool set with `Edit` but **neither** `Read`
   **nor** `REPL` is a deliberately restricted configuration (a narrow subagent, a plugin-scoped tool
   list). There, the read-before-write invariant is the only thing standing between the agent and blind
   writes, so the shortcut is withheld. Note `REPL` counts as a read channel because it can read files
   programmatically.
5. The `bypassPermissions` special case: in bypass mode an `"ask"` verdict normally means "would have
   prompted, but we are bypassing" → treat as allowed. The exception `!(why?.type === "rule" &&
   why.rule.ruleBehavior === "ask")` preserves an **explicit** `ask` rule even under bypass, matching the
   general rule precedence elsewhere in the permission system.

**Why this is better than the gate:** a GrowthBook boolean is a global on/off with no per-path
information. The permission-derived predicate makes the recovery *exactly as permissive as reading
already is* — it can never grant an Edit the user would not have granted a Read for, which is why it could
be shipped on by default where the flag could not.

**Key insight:** the fix is invisible to a literal-count diff (`has been modified since` 3/3) and visible
only as a **disappearing gate name**. Checking the GONE-gate list against a "carryover" verdict is the
technique that finds this class of change.

### 5.1 Related CARRYOVER-trap: `.212` #20

> Fixed a spurious "File has not been read yet" error when editing a file that had been read with
> offset/limit before resuming a session

`File has not been read yet` **220=5 / 193=5**; `isPartialView` **220=12 / 193=11**. The guard structure
at `:311091-311112` mirrors 193 `:452595-452614 (193)` closely; the extracted helpers `Aze`
(`isFullFileRead`, `:309718`) and `EEe` (`contentMatchesCachedRead`, `:309735`) are the visible refactor
(193 inlined the same test at `:452617 (193)`),
and `Aze` now also tolerates a `limit`-present read whose cached content covers the whole file:

```javascript
function Aze(e) {                                    // :309718-309733
  if ((e.offset ?? 1) > 1 || e.isPartialView) return !1;
  if (e.limit === void 0) return !0;
  return (e.content !== "" && au(e.content, ...) ...);
}
```

That is the most likely home of the `.212` #20 fix (a `limit`-present read at offset 1 whose content is
complete is no longer treated as partial), but the 193 side is an inline expression rather than a named
function, so a byte-level before/after is not available. Marked **DELTA (probable), partially anchored** —
not claimed as proven.

---

## 6. Windows `\u` path corruption (`.218` #3)

> Fixed Windows paths with `\u`-prefixed segments (like `C:\Users\unicorn`) being corrupted into CJK
> characters in tool inputs, which made those files inaccessible

**Verdict: NET_NEW guard over a CARRYOVER repair function.**
`tengu_repair_double_escaped_unicode` **220=1 / 193=0**; `repairedStrings` **220=4 / 193=0**;
`windowsPathSkips` **220=4 / 193=0**. But the repair regex itself is **220=1 / 193=1** — 193 had the same
function (`hor`, `:593474-593496 (193)`) with a byte-identical body and no Windows guard.

```javascript
// ============================================
// repairDoubleEscapedUnicode - recursive tool-input repair with a Windows-path bail-out
// Location: cli_inner_pretty.js:508472-508506 (regexes at :508587-508589)
// ============================================

// ORIGINAL (for source lookup):
function ctp(e) {
  let t = { repairedStrings: 0, windowsPathSkips: 0 },
    r = vqs(e, t);
  if (t.repairedStrings > 0 || t.windowsPathSkips > 0)
    O("tengu_repair_double_escaped_unicode", { repaired_strings: t.repairedStrings, windows_path_skips: t.windowsPathSkips });
  return r;
}
function vqs(e, t) {
  if (typeof e === "string") {
    if (!e.includes("\\u")) return e;
    if (!ltp.test(e)) return e;
    if (UO_.test(e)) return (t.windowsPathSkips++, e);
    let r = e.replace(BO_, (n, o, i, s, a) => {
      let l = a;
      while (l > 0 && e[l - 1] === "\\") l--;
      if ((a - l) & 1) return n;
      if (o !== void 0) return String.fromCharCode(parseInt(o, 16), parseInt(i, 16));
      let c = parseInt(s, 16);
      if (c >= 55296 && c <= 57343) return n;
      return String.fromCharCode(c);
    });
    if (r !== e) t.repairedStrings++;
    return r;
  }
  if (Array.isArray(e)) return e.map((r) => vqs(r, t));
  if (e !== null && typeof e === "object") {
    let r = {};
    for (let [n, o] of Object.entries(e)) r[n] = vqs(o, t);
    return r;
  }
  return e;
}
// :508587-508589
  ((ltp = /\\u([dD][89aAbB][0-9a-fA-F]{2})\\u([dD][c-fC-F][0-9a-fA-F]{2})|\\u([0-9a-fA-F]{4})/),
    (BO_ = new RegExp(ltp.source, "g")),
    (UO_ = /(?:^|[^A-Za-z])[A-Za-z]:[\\/]|(?:^|[\s"'=])\\\\[^\s\\/]+[\\/](?!\\)/));

// READABLE (for understanding):
function repairDoubleEscapedUnicode(input) {
  let stats = { repairedStrings: 0, windowsPathSkips: 0 },
    out = repairValue(input, stats);
  if (stats.repairedStrings > 0 || stats.windowsPathSkips > 0)
    logEvent("tengu_repair_double_escaped_unicode",
             { repaired_strings: stats.repairedStrings, windows_path_skips: stats.windowsPathSkips });
  return out;
}
function repairValue(value, stats) {
  if (typeof value === "string") {
    if (!value.includes("\\u")) return value;                 // 1. cheapest possible reject
    if (!ESCAPE_RE.test(value)) return value;                 // 2. NEW: no actual \uXXXX match -> done
    if (WINDOWS_PATH_RE.test(value))                          // 3. NEW: looks like a Windows path -> bail out
      return (stats.windowsPathSkips++, value);
    let repaired = value.replace(ESCAPE_RE_G, (whole, hi, lo, single, at) => {
      let scan = at;
      while (scan > 0 && value[scan - 1] === "\\") scan--;     // count preceding backslashes
      if ((at - scan) & 1) return whole;                       // odd -> the backslash is itself escaped
      if (hi !== undefined)                                    // surrogate pair -> recombine
        return String.fromCharCode(parseInt(hi, 16), parseInt(lo, 16));
      let cp = parseInt(single, 16);
      if (cp >= 0xd800 && cp <= 0xdfff) return whole;          // lone surrogate -> refuse
      return String.fromCharCode(cp);
    });
    if (repaired !== value) stats.repairedStrings++;
    return repaired;
  }
  if (Array.isArray(value)) return value.map((v) => repairValue(v, stats));
  if (value !== null && typeof value === "object") {
    let out = {};
    for (let [k, v] of Object.entries(value)) out[k] = repairValue(v, stats);
    return out;
  }
  return value;
}

// Mapping: ctp→repairDoubleEscapedUnicode, vqs→repairValue, ltp→ESCAPE_RE, BO_→ESCAPE_RE_G,
//          UO_→WINDOWS_PATH_RE
```

Call site — **every tool input, on every assistant message**, at `:531887-531891`:

```javascript
              let a = pU_(i, s.inputSchema, s.inputJSONSchema),
                l = ctp(a);
              if (s.name === dk && typeof a.script === "string") l.script = a.script;   // REPL script exempt
              ((i = l), (i = atp(s, l, r)));
```

### The Windows-path bail-out

**What it does:** disables the double-escaped-unicode repair for any string that looks like it contains a
Windows path.

**How the detector works.** `UO_` has two alternatives:

- `(?:^|[^A-Za-z])[A-Za-z]:[\\/]` — a drive letter followed by `\` or `/`, where the character before the
  letter must not be another letter. The `[^A-Za-z]` guard is what stops it firing on `https://` (the
  `s:` in `https:` is preceded by `p`) while still matching `"C:\…"`, `=C:/…`, ` C:\…` and a bare
  `C:\…` at string start.
- `(?:^|[\s"'=])\\\\[^\s\\/]+[\\/](?!\\)` — a UNC prefix `\\server\`, anchored to a delimiter so it does
  not fire mid-token, with `(?!\\)` excluding the `\\?\` and `\\.\` device namespaces.

**Why bail out on the whole string rather than repair around the path?** Because the string *is* usually
just the path (a `file_path` argument), and any per-match exclusion would need to know where the path ends.
A whole-string bail-out is provably safe in the direction that matters: it can only *skip* a repair, never
corrupt a path. The cost is that a genuinely double-escaped emoji in a string that also happens to
contain `C:\` is left unrepaired — an acceptable loss.

**Honest note on the changelog's example.** `C:\Users\unicorn` **does not itself match the repair regex**:
after `\u` the next four characters are `nico`, and `n` is not a hex digit, so `/\\u([0-9a-fA-F]{4})/`
cannot match. Additionally the parity guard (`(at - scan) & 1`) already protects a doubled `\\u`. So the
changelog's path is *illustrative of the class* rather than a literal reproduction; the strings that
actually corrupt are segments like `\uabcd` / `\udead` / `\ufeed`, which decode into CJK and Hangul
ranges — matching the reported "corrupted into CJK characters" symptom. The guard is deliberately broader
than the minimal fix, which for a heuristic operating on model-authored paths is the right direction.

**The REPL exemption is the other half of the design.** `if (s.name === dk && typeof a.script === "string")
l.script = a.script;` restores the un-repaired `script` field for the REPL tool. JavaScript source
legitimately contains `\uXXXX` escapes, and "repairing" them would rewrite the program. This is the
mirror image of the Windows guard: two input domains where a backslash-u sequence is *meant* literally.

**Telemetry design:** one event, fired only when something happened (`repairedStrings > 0 ||
windowsPathSkips > 0`), carrying both counters. That makes the two questions answerable from one event:
how often is the repair needed at all, and how often is the new guard saving a path.

---

## 7. NotebookEdit

No changelog bullet in this window names `NotebookEdit`. Its staleness check at `:314933-314951` uses the
same `readFileState` lookup and the same `has been modified since` message (`:314947`) as Edit/Write, and
`maxResultSizeChars: 1e5` at `:314860` matches the other file tools. **Nothing to report** — recorded
explicitly so the absence is not mistaken for an unexamined area.

---

## 8. Verdict table for this document

| Bullet | Version | Verdict | Anchor |
|---|---|---|---|
| Grep content mode "No matches found" when paginated | .210 | **NET_NEW** | `No entries at this offset` 220=3/193=0, `:312208` |
| Read/Grep/Glob error fixes (offset, regex, count, null byte) | .208 | **NET_NEW** | `:312208`, `:312220`, `:312233`, `:312158`, `:204180` |
| Glob null byte | .208 | **NET_NEW** | `ripgrep spawn blocked: null byte` 220=3/193=0, `:204180` |
| long-line memory blowup via offset/limit | .208 | **NET_NEW** | `maxSelectedBytes` 220=11/193=0, `:235122`, `:439497` |
| edit read cache 16 MB | .208 | **NET_NEW** | `tky = 16777216` `:310490`; 193 was `maxCacheSize = 1000` on a `Map` `:375740 (193)` |
| Edit fails on modified file though text matches uniquely | .208 | **NET_NEW via a DELETED GATE** | `tengu_cedar_sundial` 220=**0**/193=1; new predicate `:310878` |
| spurious "File has not been read yet" after offset/limit read | .212 | **DELTA (probable), partially anchored** | literal 5/5; `Aze` `:309718` is the extracted+extended test |
| Windows `\u` path corruption | .218 | **NET_NEW guard / CARRYOVER repair** | `windowsPathSkips` 220=4/193=0, `:508486`; regex 1/1 |
| token-cap long-line notice | — | **CARRYOVER** | `this file has very long lines…` 220=1/**193=1** |
| `readFileState` LRU bound | — | **CARRYOVER** | 25 MiB / 5000 / 4096 identical in both |
| UNC network paths require approval | .216 | **CARRYOVER** (permissions-owned) | 220=1/**193=1** |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New rows for this window are staged in
> [symbol_additions_v2_1_220_tools.md](../00_overview/symbol_additions_v2_1_220_tools.md).

Key functions in this document:
- `formatPaginationNote` (`iTs`) - `limit: N, offset: M` suffix builder
- `assertNoNullBytesBeforeRipgrepSpawn` (`rss`) - cwd/target/argv blame before `rg` spawn
- `RipgrepSpawnError` (`HTu`) - thrown by the above
- `readFileLines` (`lFe`) - entry point; drops the byte budget when the whole file fits
- `splitBufferedLines` (`Kry`) / `streamFileLines` (`Qry`) - the two enforcement paths
- `SelectedRangeTooLargeError` (`Rir`) - new byte-budget error, always throws
- `FileTooLargeError` (`Iir`) - pre-existing whole-file cap error
- `MAX_BYTES_PER_TOKEN` (`TSs`) - `128`, the token-cap→byte-budget multiplier
- `FileContentCache` (`OZu`) - LRU rewrite of the edit read cache
- `FILE_CACHE_MAX_ENTRIES` (`eky`) / `FILE_CACHE_MAX_BYTES` (`tky`) - `1000` / `16777216`
- `readCachedFileContent` (`Bws`) - the module-level accessor
- `ReadFileStateCache` (`SZu`) / `cloneReadFileState` (`GHe`) - unchanged 25 MiB session read map
- `classifyOldStringApplicability` (`Qws`) - `no_match` / `ambiguous` / `applies`
- `readWouldBeAutoAllowed` (`Jws`) / `readOnPathIsSilentlyAllowed` (`Zws`) - the gate's replacement
- `toolsetHasEditButNoRead` (`cky`) - fail-closed clause for restricted tool sets
- `isFullFileRead` (`Aze`) / `contentMatchesCachedRead` (`EEe`) - extracted staleness helpers
- `repairDoubleEscapedUnicode` (`ctp`) / `repairValue` (`vqs`) - recursive tool-input repair
- `WINDOWS_PATH_RE` (`UO_`) - drive-letter and UNC bail-out detector
