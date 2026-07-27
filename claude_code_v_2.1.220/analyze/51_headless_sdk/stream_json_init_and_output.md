# The headless wire: the `init` event, and getting bytes out of the process alive

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

This document covers the two halves of the headless *output* surface:

1. **What the session announces at startup** — the `system`/`init` stream-json event, which gained four
   fields in this window, one of them (`mcp_server_errors`) with a changelog bullet and three without.
2. **How output and input survive process boundaries** — a cluster of five bullets across `.208`,
   `.211`, `.214` and `.219` that all turn out to be one engineering programme: *make stdout writes
   accountable, drain them before exiting, size the drain to the backlog, stop dying on bad stdin, and
   stop throwing away text the model already produced.*

The most important structural fact: **2.1.193's stdout module had no drain, no byte accounting, and no
stdin-error guard at all.** The whole IO module was rewritten in this window. `writeToStdout` in 193
(`ki`, `:10112-10114 (193)`) is three lines; in 2.1.220 (`Js`, `:20542-20551`) it is a byte accountant
feeding a drain protocol. Everything below hangs off that.

---

## 0. The two modules being changed

| Region (2.1.220) | What lives there | Stable anchor |
|---|---|---|
| `:20501-20653` | the process-IO module: stdout byte accounting, exit drain, stdin-usability predicate, stream iteration | `drainStdoutBeforeExit: () => jzt` `:20513` |
| `:836894-836983` | the SDK message zod schema for `system`/`init` | `subtype: v.literal("init")` `:836910` |
| `:593588-593626` | the init-event **builder** `tAr` | `subtype: "init"` `:593593` |
| `:829243-829298` | `--mcp-config` parsing, error collection, terminal warning | `skipped due to invalid config` `:829294` |
| `:839959-840228` | the stream-json **input** reader (`read()` / `processLine()`) | `async processLine(e)` `:840089` |
| `:843299-843329`, `:845410-845503` | the plain-text output accumulator and the headless output switch | `partialForResult` `:843300` |

The 193 twins are `:10085-10165 (193)` (IO module), `:699564-699620 (193)` (init schema),
`:617292-617326 (193)` (init builder), `:712827-712861 (193)` (`--mcp-config`),
`:701790-702010 (193)` (stream-json input), `:705520-705570 (193)` (output switch).

---

## 1. `.219` #4 — `mcp_server_errors` in the init event

> *"Added `mcp_server_errors` to the headless stream-json `init` event, listing `--mcp-config` entries
> skipped by config validation, plus a terminal startup warning."*

**Verdict: NET_NEW.** `mcp_server_errors` is 220=3 (`:593620`, `:836948`, `:836952`) / **193=0**.
`skipped due to invalid config` is 220=1 (`:829294`) / **193=0**.

> **Module boundary.** [`../39_mcp/errors_and_diagnostics.md`](../39_mcp/errors_and_diagnostics.md) owns
> *which* errors are produced (the `skipReason` taxonomy, the validator `Ilr`, the redaction formatter).
> This document owns the **event shape**, the **two filter stages**, and the **terminal warning**.
> The two documents deliberately do not overlap.

### 1.1 What 2.1.193 did with a partly-invalid `--mcp-config`

```javascript
// ============================================
// 2.1.193 --mcp-config entry loop - per-entry warnings are logged and then dropped
// Location: cli_inner_pretty.js:712845-712851 (193)
// ============================================

// ORIGINAL (for source lookup):
            if (rc) {
              if (((hs = { ...hs, ...rc }), bd.length > 0))
                T(
                  `--mcp-config: ${bd.length} entry warning(s): ${bd.map((tl) => `${tl.path ? tl.path + ": " : ""}${tl.message}`).join("; ")}`,
                  { level: "warn" },
                );
            } else va.push(...bd);

// READABLE (for understanding):
            if (parsedServers) {
              if (((mergedServers = { ...mergedServers, ...parsedServers }), entryErrors.length > 0))
                debugLog(
                  `--mcp-config: ${entryErrors.length} entry warning(s): ` +
                    entryErrors.map((e) => `${e.path ? e.path + ": " : ""}${e.message}`).join("; "),
                  { level: "warn" },
                );
            } else fatalErrors.push(...entryErrors);   // only a *whole-file* failure is fatal

// Mapping: hs→mergedServers, rc→parsedServers, bd→entryErrors, va→fatalErrors, T→debugLog
```

Two consequences, both bad for a CI/SDK consumer:

- The warning goes to the **debug log**, not to stderr. On a non-debug run it is invisible.
- Nothing collects it. A server silently absent from `mcp_servers[]` was indistinguishable from a server
  the user never configured.

### 1.2 What 2.1.220 does — a two-stage filter, then two sinks

```javascript
// ============================================
// collectSkippedMcpServers - .219's replacement: collect, dedupe, record, warn
// Location: cli_inner_pretty.js:829262-829298
// ============================================

// ORIGINAL (for source lookup):
      if (Yn) {
        if (((Hr = { ...Hr, ...Yn }), mo.length > 0)) {
          w(`--mcp-config: ${mo.length} entry warning(s): ${mo.map((Ql) => `${Ql.path ? Ql.path + ": " : ""}${Ql.message}`).join("; ")}`, { level: "warn" });
          for (let Ql of mo) {
            let kc = Ql.mcpErrorMetadata;
            if (kc?.skipReason && kc.serverName != null)
              jn.push({ name: kc.serverName, type: kc.skipReason, message: Ql.message });
          }
        }
      } else Cr.push(...mo);
    ...
    let Ao = new Map();
    for (let Zo of jn) if (!Object.hasOwn(Hr, Zo.name)) Ao.set(Zo.name, Zo);
    if (Ao.size > 0) {
      let Zo = Array.from(Ao.values());
      if ((TEm(Zo), process.stderr.isTTY)) {
        let Yn = (mo) => xi(mo).replace(/[\x00-\x1f\x7f-\x9f]+/g, " ").trim();
        n2(`Warning: ${Zo.length} ${Et(Zo.length, "MCP server")} skipped due to invalid config:
${Zo.map((mo) => `  - ${Yn(mo.message)}`).join(`
`)}`);
      }
    }

// READABLE (for understanding):
      if (parsedServers) {
        if (((mergedServers = { ...mergedServers, ...parsedServers }), entryErrors.length > 0)) {
          debugLog(`--mcp-config: ${entryErrors.length} entry warning(s): …`, { level: "warn" });
          for (let err of entryErrors) {                        // NEW: harvest structured metadata
            let meta = err.mcpErrorMetadata;
            if (meta?.skipReason && meta.serverName != null)
              skipped.push({ name: meta.serverName, type: meta.skipReason, message: err.message });
          }
        }
      } else fatalErrors.push(...entryErrors);
    ...
    let byName = new Map();
    for (let s of skipped)                                       // STAGE 1 filter: dedupe by name AND
      if (!Object.hasOwn(mergedServers, s.name)) byName.set(s.name, s);   // drop names another entry defined
    if (byName.size > 0) {
      let list = Array.from(byName.values());
      if ((recordSkippedMcpServers(list), process.stderr.isTTY)) {        // sink 1: the init event
        let sanitize = (msg) => stripAnsi(msg)                            // sink 2: the terminal, but only a TTY
              .replace(/[\x00-\x1f\x7f-\x9f]+/g, " ")                     // C0 + C1 control chars out
              .trim();
        warnToStderr(`Warning: ${list.length} ${plural(list.length, "MCP server")} skipped due to invalid config:\n` +
                     list.map((s) => `  - ${sanitize(s.message)}`).join("\n"));
      }
    }

// Mapping: jn→skipped, Hr→mergedServers, Ao→byName, TEm→recordSkippedMcpServers, n2→warnToStderr,
//          xi→stripAnsi, Et→plural, mo/Ql/Zo/Yn→loop locals
```

### The two-stage name filter

**What it does:** Guarantees that `mcp_server_errors[]` and `mcp_servers[]` are disjoint, so an SDK
client can render them as one list without de-duplicating.

**How it works:**

1. **Stage 1, at parse time (`:829286`)** — `if (!Object.hasOwn(Hr, Zo.name))`. `--mcp-config` is
   repeatable and later entries shallow-merge over earlier ones. If entry A defines `github` badly and
   entry B defines `github` well, the merged config has a working `github`; reporting it as skipped
   would be a lie.
2. **Stage 2, at emit time (`:593589-593590`)** — inside the init builder:
   `let t = new Set(e.mcpClients.map(o => o.name)), r = e.mcpServerErrors.filter(o => !t.has(o.name));`
   This re-checks against the *connected client* list, which by then also contains servers from
   `.mcp.json`, plugins, and the `initialize` control request. A `--mcp-config` entry that was skipped
   but whose name is satisfied from another source is dropped again.

**Why two stages instead of one?** They run at different times against different data. Stage 1 sees only
the `--mcp-config` merge result and runs during argv processing, long before any server has connected.
Stage 2 sees the live client roster. Doing only stage 2 would leave the *terminal warning* over-reporting
(it prints before connection); doing only stage 1 would leave the *event* over-reporting.

**Key insight:** the field's own doc comment states the contract this filtering exists to keep —
`Affected servers are absent from mcp_servers[]` — and even tells CI how to use it:

> `@internal MCP server config entries from --mcp-config that failed validation and were skipped (e.g. a
> `url` entry with no `type`). Affected servers are absent from `mcp_servers[]`. `type` is a stable
> category, currently one of: unknown_type, url_missing_type, invalid_config, or reserved_name. Open set
> — treat values you do not recognize as a generic skip. The key is omitted when there are no errors; CI
> can fail on `(mcp_server_errors?.length ?? 0) > 0`.` — `:836952`

### The terminal warning's control-character scrub

`:829290-829293` sanitises each message with `xi(msg).replace(/[\x00-\x1f\x7f-\x9f]+/g, " ").trim()`
before printing. `xi` strips ANSI SGR; the regex then removes **C0 (`\x00-\x1f`) and C1
(`\x7f-\x9f`)** control characters.

**Why:** the message text is built from a *user-supplied JSON file* and can embed a server name. Without
the scrub, a `.mcp.json` containing `[2J[H` or a raw C1 CSI (``) in a server name would
repaint the operator's terminal at startup. Stripping ANSI alone is insufficient because the C1 8-bit
forms (`` = CSI, `` = OSC) are single bytes that most ANSI regexes miss. Note also the
`process.stderr.isTTY` guard — the warning is suppressed when stderr is a pipe, precisely so it cannot
contaminate a machine-readable stderr capture.

### The recorder is a module-level array, not session state

```javascript
// ============================================
// recordSkippedMcpServers / getSkippedMcpServers - a process-global, append-only list
// Location: cli_inner_pretty.js:828309-828318
// ============================================

// ORIGINAL (for source lookup):
function TEm(e) { wEm.push(...e); }
function CEm() { return wEm; }
var wEm;
var tgl = S(() => { wEm = []; });

// READABLE (for understanding):
function recordSkippedMcpServers(list) { SKIPPED_MCP_SERVERS.push(...list); }
function getSkippedMcpServers() { return SKIPPED_MCP_SERVERS; }
let SKIPPED_MCP_SERVERS;
const initModule = lazyModule(() => { SKIPPED_MCP_SERVERS = []; });

// Mapping: TEm→recordSkippedMcpServers, CEm→getSkippedMcpServers, wEm→SKIPPED_MCP_SERVERS, S→lazyModule
```

Read at `:841710` (`mcpServerErrors: CEm()`) when the SDK `query` path builds its init event. It is
initialised once per process, never cleared, and never reset by `/clear` — appropriate, because
`--mcp-config` is an argv fact that cannot change within a process.

---

## 2. The rest of the init event — three undocumented field additions

Diffing the zod schema `:836907-836982` against `:699564-699619 (193)` field by field gives a complete
answer to "what did the init event gain in this window":

| Field | 193 | 220 | Bullet? |
|---|---|---|---|
| `plugins[].version` | absent | `:836933` (`.describe(g_l)`) | no |
| `plugin_errors`, `plugin_warnings` | present, byte-identical descriptions | `:836936-836947` | — |
| `mcp_server_errors` | **absent** | `:836948-836953` | `.219` #4 |
| `fast_mode_state` | present `:699601 (193)` | `:836954` | — |
| `fast_mode_disabled_reason` | **absent** (220=18/193=0) | `:836955` | no |
| `capabilities` | **absent** | `:836956-836961` | no |
| `ttft_ms` (on `stream_event`) | `A.number()` `:699628 (193)` | `v.number().int()` `:836991` | no |

### 2.1 `capabilities` — feature detection replaces version sniffing

**What it does:** ships an open set of protocol capability tokens on the init event so an SDK client can
ask "does this CLI support X" instead of parsing `claude_code_version`.

Three tokens are defined at `:593634-593636`:

```javascript
Psa = "interrupt_receipt_v1",
Msa = "msg_lifecycle_v1",
Ulb = "interrupt_cancel_queued_v1",
```

`interrupt_receipt_v1` 220=4/193=0; `interrupt_cancel_queued_v1` 220=5/193=0; `still_queued` 220=10/193=0;
`cancel_queued` 220=8/193=0. All net-new.

**The non-obvious part: there are two different capability sets, and they disagree.**

| Constant | Value | Line | Used by |
|---|---|---|---|
| `uDp` | `[interrupt_receipt_v1, interrupt_cancel_queued_v1, msg_lifecycle_v1]` | `:593652` | the SDK `query()` path, `:841716` (`this.config.capabilities ?? uDp`) |
| `lCb` | `[interrupt_receipt_v1, msg_lifecycle_v1]` | `:653849` | the engine/REPL path, `:653020` |

So a session driven through the engine surface advertises **two** capabilities; a session driven through
the SDK query surface advertises **three**. `interrupt_cancel_queued_v1` — the ability to honour
`cancel_queued: true` on an interrupt, whose handler is at `:847465-847469` — is only announced on the
SDK path. That is consistent with the handler (it lives in the print-mode control loop), but it means a
client must not assume the two surfaces are interchangeable. This asymmetry has no changelog bullet.

The `capabilities` field is also *overridable* per session: `this.config.capabilities ?? uDp` at
`:841716` lets an embedder narrow the advertised set — useful for a host that proxies the CLI and cannot
implement one of the behaviours.

### 2.2 Why the description text is the real deliverable

The `capabilities` describe block (`:836960`) is the clearest specification of interrupt semantics
anywhere in the bundle, including a subtlety the type alone cannot express:

> `'interrupt_cancel_queued_v1' = the interrupt control_request honors cancel_queued:true (queued and
> pending-dispatch commands are cancelled alongside the abort, listed on the response's cancelled field;
> still_queued is always empty — including any uuid that was mid-fold at the interrupt instant, since
> this request also aborts and the fold never delivers it).`

That parenthetical describes a **race the API deliberately resolves by fiat**: a message being folded
into the turn at the instant of interrupt is neither cancelled nor still-queued in any natural sense, so
the contract declares `still_queued` empty rather than leave the client guessing.

---

## 3. `.208` #11 + `.214` #19 — stdout truncation at exit

> `.208` #11: *"Fixed truncated stream-json/JSON output and a missing result message when piping large
> responses from `claude -p`."*
> `.214` #19: *"Fixed stream-json output truncation at exit; the drain now scales with queued bytes
> instead of a flat 2 s cap."*

**Verdict: both NET_NEW relative to 2.1.193, but they are two steps of one change and cannot be split
from a 193 baseline.** `drainStdoutBeforeExit` 220=1/193=0; `scaleBudgetToQueue` 220=3/193=0;
`stdout drain timeout (exit)` 220=1 (`:20559`)/193=0.

The `.208` step introduced `drainStdoutBeforeExit(2000)` — *that* is the "flat 2 s cap" the `.214`
bullet refers to. The 2.1.220 bundle still carries it as the **default parameter** `e = 2000`
(`:20552`), which is the only surviving trace of the intermediate state. Because 2.1.193 predates both,
I cannot show the flat-cap build; the evidence for the two-step story is the default value, the opt-out
option, and the two call sites that pass `scaleBudgetToQueue: !1`.

### 3.1 Step zero (undocumented): making stdout writes accountable

None of this works without byte accounting, and 2.1.193 had none.

```javascript
// ============================================
// writeToStdout - 220 counts bytes in and bytes actually flushed
// Location: cli_inner_pretty.js:20538-20551  (193 twin :10108-10114)
// ============================================

// ORIGINAL (for source lookup):
function dIl(e, t, r) {
  if (e.destroyed || e.writableEnded) return !1;
  return (e.write(t, r), !0);
}
function Js(e) {
  pIl = !0;
  let t = Buffer.byteLength(e);
  if (dIl(process.stdout, e, () => { ((mIl += t), MUn?.()); })) fIl += t;
}

// READABLE (for understanding):
function writeIfWritable(stream, chunk, onFlushed) {
  if (stream.destroyed || stream.writableEnded) return false;
  return (stream.write(chunk, onFlushed), true);
}
function writeToStdout(chunk) {
  everWroteToStdout = true;
  let bytes = Buffer.byteLength(chunk);
  if (writeIfWritable(process.stdout, chunk, () => { (bytesFlushed += bytes; onQueueDrained?.()); }))
    bytesQueued += bytes;
}

// Mapping: dIl→writeIfWritable, Js→writeToStdout, pIl→everWroteToStdout,
//          fIl→bytesQueued, mIl→bytesFlushed, MUn→onQueueDrained
```

2.1.193's equivalent (`ki`, `:10112-10114 (193)`) is `MXo(process.stdout, e)` →
`if (e.destroyed) return; e.write(t);` — **no callback, no counters, and no `writableEnded` check.**

The backlog is then simply `gIl() = fIl - mIl` (`:20572-20574`), with a short-circuit to `0` when stdout
is destroyed or has latched an error (`pCi`, set by the `error` handler at `:20533-20535`) — otherwise
the drain would wait for bytes that can never flush.

### 3.2 The batching fix inside the stream-json stdout guard

**This is the actual `.208` #11 mechanism and it is invisible from the bullet's wording.** The
stream-json stdout guard (`$Cm`, `:841083-841129`) is pure carryover as a *feature* (193: `N0c`,
`:702712-702757`) — it monkey-patches `process.stdout.write` and diverts any line that is not valid JSON
to stderr with a `[stdout-guard]` prefix, so a stray `console.log` cannot corrupt the stream. But its
write path changed in exactly the way that matters:

| | 2.1.193 (`:702727-702740`) | 2.1.220 (`:841098-841111`) |
|---|---|---|
| per-line action | `i = bKe(l + "\n")` — one real `write()` **per line** | `s += l + "\n"` — accumulate |
| final write | none (already written) | `return a ? Qwt(s, a) : Qwt(s)` — **one** write for the whole chunk |
| caller's write callback | never forwarded; `queueMicrotask(() => a())` **always** | forwarded into the real `write()` when there is data |
| return value | last per-line result | the real write's backpressure boolean, else `!0` |

**Why this is the fix, not a cosmetic refactor:** `writeToStdout` (§3.1) learns that bytes were flushed
*only through the write callback*. 193's guard swallowed that callback and fired a synthetic one on a
microtask. Under that regime the accounting would report every byte flushed the instant it was
submitted, `gIl()` would always be `0`, and any drain built on it would exit immediately — which is the
truncation the `.208` bullet describes. Restoring callback pass-through is what makes the backlog real.
The batching is a free side effect: N lines became one `write()` syscall instead of N.

### 3.3 The drain protocol

```javascript
// ============================================
// drainStdoutBeforeExit - end stdout, wait for the queue, bounded by a budget
// Location: cli_inner_pretty.js:20552-20560
// ============================================

// ORIGINAL (for source lookup):
async function jzt(e = 2000, { scaleBudgetToQueue: t = !0 } = {}) {
  let r = process.stdout;
  if (lCi === void 0) {
    if (r.isTTY || r.destroyed || r.writableEnded || !pIl) return;
    lCi = new Promise((o) => r.end(o));
  }
  let n = Promise.all([lCi, g9m()]);
  await Oa(t ? Promise.race([n, p9m(e)]) : n, t ? OUn(e) : e, "stdout drain timeout (exit)").catch(() => {});
}

// READABLE (for understanding):
async function drainStdoutBeforeExit(baseBudgetMs = 2000, { scaleBudgetToQueue = true } = {}) {
  let out = process.stdout;
  if (stdoutEndPromise === undefined) {
    if (out.isTTY || out.destroyed || out.writableEnded || !everWroteToStdout) return;  // nothing to drain
    stdoutEndPromise = new Promise((resolve) => out.end(resolve));   // half-close; resolves on real flush
  }
  let fullyDrained = Promise.all([stdoutEndPromise, waitForQueueEmpty()]);
  await withTimeout(
    scaleBudgetToQueue ? Promise.race([fullyDrained, externalClockGrace(baseBudgetMs)]) : fullyDrained,
    scaleBudgetToQueue ? getStdoutDrainBudgetMs(baseBudgetMs) : baseBudgetMs,
    "stdout drain timeout (exit)",
  ).catch(() => {});
}

// Mapping: jzt→drainStdoutBeforeExit, lCi→stdoutEndPromise, pIl→everWroteToStdout,
//          g9m→waitForQueueEmpty, p9m→externalClockGrace, OUn→getStdoutDrainBudgetMs, Oa→withTimeout
```

**Four early-outs, in a deliberate order (`:20555`).** `isTTY` first: an interactive terminal never
buffers meaningfully and `out.end()` on a TTY would close the user's terminal stream. Then `destroyed` /
`writableEnded` (nothing to wait for). Then `!pIl` — *this process never wrote a byte to stdout* — which
is the common case for interactive runs and avoids a pointless `end()`.

**`out.end(cb)` rather than polling `writableLength`.** `end()` half-closes the stream and its callback
fires after the final flush, which is the only event Node offers that means "the kernel has it". The
`Promise.all` with `waitForQueueEmpty()` adds the application-level counter check, because a pipe reader
that has read the bytes is not the same as a stream that has finished its internal queue.

### 3.4 `getStdoutDrainBudgetMs` — the `.214` change

```javascript
// ============================================
// getStdoutDrainBudgetMs - derive the drain deadline from the actual backlog
// Location: cli_inner_pretty.js:20578-20580 (constants :20646-20647)
// ============================================

// ORIGINAL (for source lookup):
function OUn(e = 2000) {
  return Math.min(m9m, Math.max(e, Math.ceil((gIl() * 1000) / f9m)));
}
// ... f9m = 262144, m9m = 30000

// READABLE (for understanding):
function getStdoutDrainBudgetMs(floorMs = 2000) {
  return Math.min(
    MAX_DRAIN_MS,                                                   // 30_000
    Math.max(floorMs, Math.ceil((queuedBytes() * 1000) / ASSUMED_BYTES_PER_SEC)),  // 262_144
  );
}

// Mapping: OUn→getStdoutDrainBudgetMs, gIl→queuedBytes, f9m→ASSUMED_BYTES_PER_SEC, m9m→MAX_DRAIN_MS
```

### Deriving a timeout from a throughput assumption

**What it does:** converts "how many bytes are still queued" into "how long to wait", clamped both ways.

**How it works:**

1. `gIl()` = `bytesQueued - bytesFlushed`, i.e. bytes submitted to `stdout.write` whose flush callback
   has not fired. Returns `0` if stdout is destroyed or error-latched.
2. Divide by `f9m = 262144` bytes/s (**256 KiB/s**) and multiply by 1000 → the milliseconds a consumer
   draining at that rate would need.
3. `Math.max(floorMs, …)` — never shorter than the caller's floor (2000 ms by default).
4. `Math.min(30000, …)` — never longer than 30 s.

**Why 256 KiB/s?** It is a deliberately *pessimistic* pipe-throughput floor, not a measurement. A local
pipe moves tens of MB/s; 256 KiB/s is roughly what you would expect from a slow consumer doing per-line
JSON parsing in a scripting language, which is exactly the `claude -p | jq`-style consumer that hit the
`.208` bug. Being pessimistic is the safe direction: the budget is a *ceiling*, and the drain returns as
soon as the queue actually empties, so over-estimating costs nothing on a fast consumer while
under-estimating truncates output.

**Why cap at 30 s?** 30 s × 256 KiB/s = **7.5 MiB**. Past that the process would hang for a consumer that
has stopped reading entirely (a `head -1` that already exited, a full pipe buffer with a dead reader).
The cap converts a hang into a truncation, which is the right trade at exit time. The asymmetry is worth
stating plainly: below 7.5 MiB of backlog the design prefers *correctness*; above it, *liveness*.

**Why a floor of 2000 ms rather than 0?** With an empty queue the formula yields 0, and a 0 ms timeout
would race the `end()` callback. The floor also preserves the pre-`.214` behaviour exactly for the
common small-output case, which is why the parameter is named as a base rather than a minimum.

### 3.5 The three call sites and why two opt out

| Site | Call | Budget | Rationale |
|---|---|---|---|
| `:522374` (`Uip`, the normal exit) | `jzt()` | scaled, floor 2000 | the only path where full output matters |
| `:522216` (`Q8s`, the forced-exit watchdog) | `jzt(500, { scaleBudgetToQueue: !1 })` | hard 500 ms | this timer exists *because* a graceful exit already overran |
| `:840582` (`T_l`, fatal stdin/protocol error) | `jzt(remaining, { scaleBudgetToQueue: !1 })` | whatever is left of a 2 s total | a bounded total budget shared with the write-queue drain |

The normal path is `:522373-522375`:

```javascript
async function Uip(e) {
  (Q8s(OUn() + GF_, e), await jzt());     // GF_ = 1500  (:522406)
}
```

**This is the interesting composition.** `Q8s` arms the forced-exit watchdog at
`getStdoutDrainBudgetMs() + 1500 ms` — i.e. *the drain's own budget plus 1.5 s of slack* — and only then
awaits the drain. The watchdog therefore cannot fire before the drain has had its full computed budget,
and when it does fire it uses a hard 500 ms so a stuck drain cannot extend it further. Two timers, each
derived from the other, with the fallback strictly weaker than the primary. Without the `OUn()` term the
`.214` change would have been self-defeating: a 30 s scaled drain under a fixed watchdog would simply be
killed at the old deadline.

### 3.6 `markStdoutDrainExternallyClocked` — the signal path

`fWe` (`:20561-20563`) resolves the promise `p9m(e)` waits on. It is called from the signal handlers
(`:522268` orphan detected, `:522442` SIGINT, `:522455`, `:522468` SIGHUP, `:522473`, `:845663`) before
`Ds(<code>)`.

The effect: on a *signal-driven* exit, the drain race becomes
`Promise.race([fullyDrained, externalClock.then(() => delay(baseBudgetMs))])` — the drain is allowed
`baseBudgetMs` **after the signal**, rather than waiting for the whole computed budget. On a normal exit
`fWe` is never called, `p9m` never resolves, and the race degenerates to the plain drain under
`OUn(e)`. One function, two exit disciplines, and the name says exactly which: the clock is *external*
(the signal) rather than *internal* (the byte count).

---

## 4. `.208` #19 — blank CRLF and whitespace-only stream-json input lines

> *"Fixed stream-json input killing the session on blank CRLF or whitespace-only lines from Windows SDK
> hosts."*

**Verdict: NET_NEW, and it is a two-token change. The scoping pass recorded this bullet as UNANCHORED
(`CRLF` 220=6/193=5, `whitespace-only` 220=9/193=2 with `:376615` unrelated); those are the wrong
anchors. The real anchor is a guard expression, not a string.**

### 4.1 The bug, proven from both bundles

The stream-json reader (`read()`, `:839959-839999`) splits the stdin byte stream on `\n` only and hands
each line to `processLine`. Compare the first statements:

```javascript
// ============================================
// processLine - the stream-json input line dispatcher, first statements only
// Location: cli_inner_pretty.js:840089-840093  (193 twin :701897-701900)
// ============================================

// ORIGINAL (for source lookup):
  async processLine(e) {
    if (!e.trim()) return;
    e = SU(e);
    try {
      let t = xIo(Ut(e));

// 193 ORIGINAL, for contrast (:701897-701900):
//   async processLine(e) {
//     if (!e) return;
//     try {
//       let t = Rtr(Ut(e));

// READABLE (for understanding):
  async processLine(line) {
    if (!line.trim()) return;      // 193: `if (!line) return;`  — only "" was skipped
    line = stripBom(line);         // 193: absent
    try {
      let msg = validateSdkInputMessage(parseJson(line));

// Mapping: SU→stripBom, Ut→parseJson, xIo/Rtr→validateSdkInputMessage
```

`SU` is `:57355-57357`: `return e.startsWith("﻿") ? e.slice(1) : e;` — a BOM stripper.

### 4.2 Why a lone `\r` was fatal, not merely ignored

Follow the 193 control flow for a line whose content is `"\r"`:

1. `if (!e) return;` — `"\r"` is truthy, so it passes.
2. `Ut("\r")` → `JSON.parse` throws `SyntaxError: Unexpected end of JSON input`.
3. The `catch` at `:701999-702001 (193)`: `w9o("Error parsing streaming input line: " + e + ": " + t)`.
4. `w9o` is `:702308-702310 (193)`:
   ```javascript
   function w9o(e) { (console.error(e), process.exit(1)); }
   ```

**`process.exit(1)`.** A single stray carriage return from a Windows host that writes `\r\n` while the
reader splits on `\n` terminates the whole session. That is precisely the bullet's "killing the
session", and it explains why the symptom was Windows-specific: a POSIX host writing `\n` produces empty
strings, which 193's `if (!e)` already caught.

The 2.1.220 twin, `T_l` (`:840578-840584`), still exits 1 — the fatal disposition for a genuinely
malformed line is unchanged and correct. What changed is which lines reach it. `!e.trim()` covers `""`,
`"\r"`, `" "`, `"\t"`, and any mixture; the BOM strip additionally covers the case where a host writes a
UTF-8 BOM before the *first* JSON object, which would otherwise be a hard parse error on line 1.

**Why `trim()` before the BOM strip and not after?** `"﻿".trim()` is `""` in modern V8 (U+FEFF is
whitespace per `String.prototype.trim`), so a BOM-only line is caught by the first guard and never
reaches `stripBom`. Ordering them the other way would work too; this order means the cheap check runs
first on every line.

### 4.3 An undocumented robustness fix in the same function

The tail of `processLine` also changed (`:840222-840227` vs `:701997-702001 (193)`):

| | 2.1.193 | 2.1.220 |
|---|---|---|
| role check | `if (t.message.role !== "user") w9o(…)` — **no `return`** | `if (t.message?.role !== "user") return T_l(…)` |
| missing `message` | `t.message.role` → TypeError → caught → `w9o` (exit 1) | optional chaining → the role message, still exit 1 but with a useful diagnostic |
| missing `request` | `if (!t.request) w9o(…)` — no `return` | `if (!t.request) return T_l(…)` |
| fatal helper | `w9o` — `console.error` then `process.exit(1)`, **no drain** | `T_l` — drains the write queue (2 s) *and* stdout before `process.exit(1)` |

The `return` additions matter because `w9o`/`T_l` are typed as returning `void`/`Promise<void>`; without
the `return`, 193 continued executing after an "unrecoverable" error, relying on `process.exit`'s
synchronous nature. That works, but it is why the diagnostic and the exit could interleave with pending
output. 220's `T_l` is `async` and *awaited via `return`* — and it drains, which ties this bullet back
to §3: **even the error path now flushes stdout before exiting**, so the last `result` frame a client
sees before a protocol error is no longer lost.

---

## 5. `.211` #21 — headless print mode crashing on unreadable stdin

> *"Fixed headless print-mode sessions on Windows crashing when stdin is unreadable."*

**Verdict: NET_NEW.** `isStdinUnusableError` 220=1 export + 3 call sites / **193=0**;
`stdin is unreadable` 220=3 / 193=0; `tengu_bg_stdin_unreadable` 220=1 (`:682705`) / 193=0.

### 5.1 The predicate

```javascript
// ============================================
// isStdinUnusableError - two error-code sets, one predicate
// Location: cli_inner_pretty.js:20516-20518 (sets at :20652)
// ============================================

// ORIGINAL (for source lookup):
function Uzt(e) {
  let t = e !== null && typeof e === "object" && "code" in e && typeof e.code === "string" ? e.code : void 0;
  return t !== void 0 && (u9m.has(t) || uIl.has(t));
}
// ((uIl = new Set(["EPIPE", "EIO", "ENXIO", "EBADF"])), (u9m = new Set(["EISDIR", "ENOTCONN", "ECONNRESET"])));

// READABLE (for understanding):
function isStdinUnusableError(err) {
  let code = (err !== null && typeof err === "object" && "code" in err && typeof err.code === "string")
    ? err.code : undefined;
  return code !== undefined && (STDIN_ONLY_CODES.has(code) || STREAM_GONE_CODES.has(code));
}
// STREAM_GONE_CODES = { EPIPE, EIO, ENXIO, EBADF }      // shared with handleStreamGoneErrors
// STDIN_ONLY_CODES  = { EISDIR, ENOTCONN, ECONNRESET }  // stdin-specific

// Mapping: Uzt→isStdinUnusableError, uIl→STREAM_GONE_CODES, u9m→STDIN_ONLY_CODES
```

**Why two sets?** `uIl` is the pre-existing "the stream is gone" set (`:10164 (193)` has the identical
four codes) used by `handleStreamGoneErrors` to destroy a stream silently. `u9m` is new and holds the
three codes that mean "this handle is not a readable stdin" without meaning "the stream broke":

- **`EISDIR`** — stdin is a directory. Reachable on Windows when a launcher passes a folder handle, and
  on Linux via `claude -p < /some/dir`.
- **`ENOTCONN`** — stdin is a socket that was never connected. The classic Windows service-host case:
  `CreateProcess` with a `NULL` `hStdInput` under a session-0 service gives a handle that fails
  `setEncoding` at first read.
- **`ECONNRESET`** — the parent closed its end of the named pipe before the child touched it.

Keeping them separate preserves `handleStreamGoneErrors`'s narrower meaning while letting the stdin
readers accept the wider set. Anything *not* in either set still rethrows — the guard is a whitelist, not
a blanket `catch`.

### 5.2 Where it is applied, and the deliberate severity split

`getInputPrompt` (`dEm`, `:828110-828147`) wraps the two ways print mode touches stdin:

| Path | Site | On unusable stdin | Why |
|---|---|---|---|
| `--input-format=stream-json` | `LiE` `:828098-828109` | **fatal** — `fm("Error: cannot read --input-format=stream-json messages from stdin (<code>): stdin is unreadable. stream-json input requires a readable stdin for the lifetime of the session.")` | stdin is the *only* input channel; a session that can never receive a message is dead by definition |
| piped prompt text | `:828124-828137` | **warning** — `n2("Warning: stdin is unreadable (<code>), proceeding without piped input. …")`, returns the argv prompt `e` | the prompt may have been supplied on argv; killing the run would be worse than losing an optional stdin append |

The warning text names the recovery explicitly — *"pass it as a prompt argument, or check that the
process launching Claude Code wires stdin to a pipe or /dev/null"* (`:828132-828133`) — which is the
actionable half for the service-host case.

Both branches also emit a structured error through `xe(Object.assign(Error(...), { code: … }))`
(`:828104`, `:828130`) so the failure is visible in crash telemetry even on the non-fatal path.

The 2.1.193 twin (`Fhm`, `:712134-712159 (193)`) has **no try/catch at all**: line `:712137 (193)` is a
bare `process.stdin.setEncoding("utf8");`. The throw escapes to the top level and the process dies with
an unhandled rejection — the reported crash.

### 5.3 The third call site: `claude --bg` dispatch

`readBgStdin` (`duf`, `:682687-682716`) has the same guard at `:682702` plus its own telemetry gate
`tengu_bg_stdin_unreadable` (`:682705`) carrying `error_code`. This is the `claude --bg` argv path, not
print mode, but it shares the predicate — evidence that the fix was applied as a *module-level
capability* (an export on the IO module) rather than a local patch, which is why all three sites read
identically.

---

## 6. `.219` #7 — `claude -p` dropping the answer when a turn dies mid-stream

> *"Fixed `claude -p` text output dropping the already-produced answer when a turn dies on a mid-stream
> API error."*

**Verdict: NET_NEW, and the scoping pass's UNANCHORED verdict is wrong.** `priorAssistantText` is
220=4 / **193=0**; `partialForResult` 220=4 / **193=0**; `lastAssistantText` 220=8 / **193=2**.

This is the subtlest bullet in the theme and the mechanism is genuinely clever.

### 6.1 What the engine does when the stream dies

When a streaming response is cut off *after* the model has produced text, the API layer synthesises a
final assistant message whose content ends with a fixed notice (`:511277-511282`):

```javascript
yield _u({
  content: Ys
    ? mo   ? `${RE}: Response stalled mid-stream. The response above may be incomplete.`
      : Yn ? `${RE}: Server error mid-response. The response above may be incomplete.`
           : `${RE}: Connection closed mid-response. The response above may be incomplete.`
    : mo   ? `${RE}: Response stalled while thinking, before producing a response. Try again.`
           : `${RE}: Connection closed while thinking, before producing a response. Try again.`,
  error: "server_error",
});
```

(`Ys` = "the model had already emitted output". 2.1.193 has the same construct at `:595839-595845 (193)`
with **two** variants; 220 added the `Server error mid-response` arm and a four-way `cause` taxonomy
`watchdog | server_error | network_down | stale_connection` at `:511267-511273`.)

The turn then ends "successfully" — the result frame is `subtype: "success"` with `is_error: true`, and
`result` is set to the **last** assistant message, which is that notice. The real answer is the
message *before* it.

### 6.2 The 193 renderer printed only `result`

```javascript
// 2.1.193, :705529-705539 — headless plain-text output, success arm (whitespace collapsed)
      switch (z.subtype) {
        case "success":
          ki(z.result.endsWith("\n") ? z.result : z.result + "\n");
          break;
```

So `claude -p "…"` on a mid-stream failure printed exactly
`API Error: Connection closed mid-response. The response above may be incomplete.` and **nothing else** —
"the response above" being a response the user never saw. The stream-json consumer was fine (it received
every assistant message); only the text renderer lost the answer.

### 6.3 The 2.1.220 fix: a two-slot rolling accumulator

```javascript
// ============================================
// makeTextOutputAccumulator / feedTextOutputAccumulator - keep the last two top-level assistant texts
// Location: cli_inner_pretty.js:843299-843329
// ============================================

// ORIGINAL (for source lookup):
function wxm() {
  return { lastAssistantText: void 0, priorAssistantText: void 0, partialForResult: void 0 };
}
function Txm(e, t) {
  if (t.type === "system" && t.subtype === "compact_boundary") { F_l(e); return; }
  if (t.type === "assistant" && t.parent_tool_use_id === null) {
    if (t.supersedes?.length) F_l(e);
    let r = t.message?.content;
    if (!Array.isArray(r)) return;
    let n = Xc(r.filter((o) => o != null), `
`);
    if (n) ((e.priorAssistantText = e.lastAssistantText), (e.lastAssistantText = n));
    return;
  }
  if (t.type !== "result") return;
  ((e.partialForResult =
    t.subtype === "success" && t.is_error && t.result.endsWith(vpE) && e.lastAssistantText === t.result
      ? e.priorAssistantText
      : void 0),
    F_l(e));
}
function F_l(e) { ((e.lastAssistantText = void 0), (e.priorAssistantText = void 0)); }
var vpE = "The response above may be incomplete.";

// READABLE (for understanding):
function makeTextOutputAccumulator() {
  return { lastAssistantText: undefined, priorAssistantText: undefined, partialForResult: undefined };
}
function feedTextOutputAccumulator(acc, msg) {
  if (msg.type === "system" && msg.subtype === "compact_boundary") { resetAccumulator(acc); return; }
  if (msg.type === "assistant" && msg.parent_tool_use_id === null) {   // top level only, not subagents
    if (msg.supersedes?.length) resetAccumulator(acc);                 // a retracted turn invalidates both slots
    let content = msg.message?.content;
    if (!Array.isArray(content)) return;
    let text = joinTextBlocks(content.filter((b) => b != null), "\n");
    if (text) ((acc.priorAssistantText = acc.lastAssistantText), (acc.lastAssistantText = text));
    return;                                                            // shift-register: prior <- last <- new
  }
  if (msg.type !== "result") return;
  acc.partialForResult =
    msg.subtype === "success" &&                    // the engine calls a truncated turn "success"
    msg.is_error &&                                 // …but flags it
    msg.result.endsWith(INCOMPLETE_NOTICE) &&       // …and result IS the notice
    acc.lastAssistantText === msg.result            // …and the notice was the last assistant message
      ? acc.priorAssistantText                      // -> the real answer is the one before it
      : undefined;
  resetAccumulator(acc);
}
const INCOMPLETE_NOTICE = "The response above may be incomplete.";

// Mapping: wxm→makeTextOutputAccumulator, Txm→feedTextOutputAccumulator, F_l→resetAccumulator,
//          vpE→INCOMPLETE_NOTICE, Xc→joinTextBlocks
```

and the renderer (`:845474-845489`):

```javascript
        case "success": {
          let Ae = ae.partialForResult === void 0
              ? de.result
              : `${ae.partialForResult}\n${de.result}`;
          Js(Ae.endsWith("\n") ? Ae : Ae + "\n");
          break;
        }
```

### The four-condition recovery predicate

**What it does:** decides whether the `result` string is a *truncation notice standing in for an answer*,
in which case the previous assistant message is prepended to the output.

**How it works — and why each condition is load-bearing:**

1. `subtype === "success"` — the engine reports a mid-stream cut-off as `success`, not
   `error_during_execution` (that subtype is reserved for a thrown exception, `:653473-653481`). Testing
   for the error subtypes would miss the case entirely.
2. `is_error` — distinguishes it from a genuine success. A normal answer must never get a second message
   glued onto it.
3. `result.endsWith("The response above may be incomplete.")` — identifies *this specific* failure
   family. Other `is_error` successes (refusals, budget stops) have different tails and must not
   recover a prior message that is unrelated.
4. `lastAssistantText === result` — the strictest condition, and the one that makes the whole thing
   safe. It asserts that the notice **is** the entire last assistant message, i.e. the model produced
   nothing else in that final turn. If the model had emitted real text *and then* been cut off, that
   text is already inside `result` and prepending `priorAssistantText` would duplicate an earlier,
   superseded answer.

**Why the two reset triggers?** `compact_boundary` (`:843303`) and `supersedes?.length` (`:843308`).
After a compaction the "prior" message may no longer be in the conversation at all; after a refusal
fallback retracts messages (`supersedes` carries the retracted uuids), the prior text is one the user
was explicitly not supposed to see. In both cases the accumulator drops both slots rather than risk
printing a withdrawn answer. This is the failure mode a naive "just remember the last two messages"
implementation would get wrong.

**Why `parent_tool_use_id === null`?** Subagent assistant messages also flow through this stream. Without
the filter, a `claude -p` run whose main turn died would print the last *subagent*'s text as if it were
the answer.

**Why is the accumulator only fed in text mode?** `Te = l.outputFormat !== "json" && l.outputFormat !==
"stream-json"` (`:845406`), and `Txm(ae, Ae)` runs only under `if (… Te)` (`:845438`). JSON and
stream-json consumers receive every assistant message and can do this reconstruction themselves; only
the lossy text renderer needs help. Keeping it out of the structured paths avoids changing a wire format
to fix a presentation bug.

**Key insight:** the fix does not change what the engine produces, does not add a field to the result
frame, and does not touch the API layer. It is a **pure re-derivation at the last possible moment**, in
the one output mode that had discarded the information. That is why it is invisible to a literal diff of
the protocol and why the scoping pass could not anchor it.

---

## 7. Not covered here

- The `skipReason` taxonomy and MCP config validator — [`../39_mcp/errors_and_diagnostics.md`](../39_mcp/errors_and_diagnostics.md).
- `--json-schema` / structured output (`.205` #2) — primary theme `workflow`.
- `CLAUDE_RUNNER_ACTIVITY_FD` (`.204`) — primary theme `hooks`; the headless side is only the
  `teeActivity`/`writeActivityLine` fork at `:841036-841045`.
- The four-way mid-stream `cause` taxonomy at `:511267-511273` — primary theme `api_reliability`.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_headless_sdk.md](../00_overview/symbol_additions_v2_1_220_headless_sdk.md).

Key functions in this document:
- `writeToStdout` (`Js`, `:20542`) - byte-accounting stdout writer; feeds the drain
- `writeIfWritable` (`dIl`, `:20538`) - guarded `stream.write` with a flush callback
- `drainStdoutBeforeExit` (`jzt`, `:20552`) - the exit drain, `.208` + `.214`
- `getStdoutDrainBudgetMs` (`OUn`, `:20578`) - `min(30000, max(floor, ceil(queued*1000/262144)))`
- `queuedStdoutBytes` (`gIl`, `:20572`) - `bytesQueued - bytesFlushed`, zero when stdout is dead
- `waitForStdoutQueueEmpty` (`g9m`, `:20581`) - one-shot promise resolved by the flush callback
- `markStdoutDrainExternallyClocked` (`fWe`, `:20561`) - signal handlers start the grace clock
- `externalClockGrace` (`p9m`, `:20569`) - `externalClock.then(() => delay(ms))`
- `isStdinUnusableError` (`Uzt`, `:20516`) - the seven-code stdin whitelist
- `withTimeout` (`Oa`, `:20483`) - `Promise.race` with a labelled rejection
- `finalDrainAndExit` (`Uip`, `:522373`) - arms the watchdog at `OUn() + 1500`, then drains
- `armForcedExitWatchdog` (`Q8s`, `:522210`) - hard 500 ms unscaled drain then exit
- `fatalStreamInputError` (`T_l`, `:840578`) - drains the write queue and stdout, then exit 1
- `buildInitEvent` (`tAr`, `:593588`) - the `system`/`init` builder, holds the stage-2 name filter
- `recordSkippedMcpServers` (`TEm`, `:828309`) / `getSkippedMcpServers` (`CEm`, `:828312`) - process-global list
- `SDK_CAPABILITIES_QUERY` (`uDp`, `:593652`) / `SDK_CAPABILITIES_ENGINE` (`lCb`, `:653849`) - the two, unequal, capability sets
- `getInputPrompt` (`dEm`, `:828110`) - piped-prompt reader with the new stdin guard
- `getStreamJsonStdinIterator` (`LiE`, `:828098`) - stream-json reader; fatal on unusable stdin
- `readBgStdin` (`duf`, `:682687`) - `claude --bg` reader, third user of the guard
- `processLine` (`:840089`) - stream-json input dispatcher; `!line.trim()` is the `.208` #19 fix
- `stripBom` (`SU`, `:57355`) - U+FEFF stripper
- `streamJsonStdoutGuard` (`$Cm`, `:841083`) - non-JSON line diverter; now batches and forwards callbacks
- `makeTextOutputAccumulator` (`wxm`, `:843299`) / `feedTextOutputAccumulator` (`Txm`, `:843302`) - the `.219` #7 recovery
- `INCOMPLETE_NOTICE` (`vpE`, `:843329`) - `"The response above may be incomplete."`
- `isSessionBusyForCwdChange` (`kxm`, `:843367`) - see [`control_requests.md`](./control_requests.md) §5
