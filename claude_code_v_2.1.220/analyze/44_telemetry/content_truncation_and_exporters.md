# Content truncation and the OTLP export path (2.1.212 / 2.1.214 / 2.1.216 / 2.1.217)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
**Baseline:** `…/2.1.193/extract/cli_inner_pretty.js` — every `(193)` citation is tagged.

Bullets covered here:

| Version | Bullet |
|---|---|
| `.214` | *Added `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` to configure the 60 KB truncation limit on OpenTelemetry content attributes* |
| `.212` | *Fixed OpenTelemetry HTTP exports being rejected with 411/400 by Azure Monitor and other endpoints that don't accept chunked transfer encoding* |
| `.216` | *Fixed the Prometheus metrics endpoint (`OTEL_METRICS_EXPORTER=prometheus`) emitting invalid `# UNIT` lines* |
| `.217` | *Fixed managed settings that set `OTEL_EXPORTER_OTLP_ENDPOINT` not governing all signals — lower-scope signal-specific overrides no longer redirect telemetry away from the managed endpoint* |

---

## 1. `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` (.214)

### 1.1 Where the 60 KB came from

The 2.1.193 analysis tree documented this constant as `TELEMETRY_CONTENT_LIMIT_BYTES = 61440`. The
`v2.1.88` named tree explains *why* that number, in a comment the bundle discards:

```typescript
// 3rd/claude-code/src/utils/telemetry/betaSessionTracing.ts:70
const MAX_CONTENT_SIZE = 60 * 1024 // 60KB (Honeycomb limit is 64KB, staying safe)

// 3rd/claude-code/src/utils/telemetry/betaSessionTracing.ts:103-121
/**
 * Truncate content to fit within Honeycomb limits.
 */
export function truncateContent(
  content: string,
  maxSize: number = MAX_CONTENT_SIZE,
): { content: string; truncated: boolean } { … }
```

So 61440 was never an OTel-protocol limit. It was **one specific vendor's per-attribute ceiling
(Honeycomb, 64 KiB) minus a 4 KiB safety margin**, hard-coded into a client shipped to everyone.
That is the entire motivation for the `.214` bullet: users exporting to a backend with a different
ceiling had no way to move it — either they lost content they could have kept, or they blew a limit
lower than 60 KB and had the SDK truncate mid-value.

### 1.2 What the env var actually does

```javascript
// ============================================
// resolveOtelContentMaxLength - the effective per-attribute content ceiling
// Location: cli_inner_pretty.js:167272-167279
// ============================================

// ORIGINAL (for source lookup):
function V1g() {
  return Math.min(
    Z.CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH ?? q1g,
    Z.OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT ?? 1 / 0,
    Z.OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT ?? 1 / 0,
    Z.OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT ?? 1 / 0,
  );
}
var q1g = 61440;                                       // :167289

// READABLE (for understanding):
function resolveOtelContentMaxLength() {
  return Math.min(
    env.CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH ?? TELEMETRY_CONTENT_LIMIT_BYTES,   // Claude Code's own knob
    env.OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT ?? Infinity,                          // OTel spec: all attributes
    env.OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT ?? Infinity,                // OTel spec: log records
    env.OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT ?? Infinity,                     // OTel spec: spans
  );
}
var TELEMETRY_CONTENT_LIMIT_BYTES = 61440;

// Mapping: V1g→resolveOtelContentMaxLength, q1g→TELEMETRY_CONTENT_LIMIT_BYTES, Z→env
```

```javascript
// ============================================
// truncateTelemetryContent - applies the ceiling and appends a self-describing marker
// Location: cli_inner_pretty.js:167280-167288
// ============================================

// ORIGINAL (for source lookup):
function WP(e) {
  let t = V1g();
  if (e.length <= t) return { content: e, truncated: !1 };
  let n = `

[TRUNCATED - Content exceeds ${t >= 1024 ? `${Math.floor(t / 1024)}KB` : `${t} character`} limit]`;
  if (n.length >= t) return { content: e.slice(0, t), truncated: !0 };
  return { content: e.slice(0, t - n.length) + n, truncated: !0 };
}

// READABLE (for understanding):
function truncateTelemetryContent(content) {
  let limit = resolveOtelContentMaxLength();
  if (content.length <= limit) return { content, truncated: false };
  let marker = `\n\n[TRUNCATED - Content exceeds ${
    limit >= 1024 ? `${Math.floor(limit / 1024)}KB` : `${limit} character`
  } limit]`;
  if (marker.length >= limit) return { content: content.slice(0, limit), truncated: true };  // no room for the marker
  return { content: content.slice(0, limit - marker.length) + marker, truncated: true };     // total length === limit
}

// Mapping: WP→truncateTelemetryContent, V1g→resolveOtelContentMaxLength
```

And the 2.1.193 function it replaced:

```javascript
// ORIGINAL (2.1.193, for source lookup) — cli_inner_pretty.js:285861-285871 (193):
function CD(e, t = xcp) {
  if (e.length <= t) return { content: e, truncated: !1 };
  return {
    content:
      e.slice(0, t) +
      `

[TRUNCATED - Content exceeds 60KB limit]`,
    truncated: !0,
  };
}
var xcp = 61440;                                       // :286044 (193)
```

### `Algorithm: the four-way Math.min, and why the limit became a hard cap`

**What it does:** turns a single hard-coded 60 KB into a resolved ceiling that respects both Claude
Code's own knob and the three standard OpenTelemetry attribute-length limits, then truncates to it
without ever exceeding it.

**How it works:**
1. `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH ?? 61440` — the operator's value, or the legacy default. Note
   the `??`: the old constant is still the default, so an untouched installation behaves exactly as
   2.1.193 did.
2. The three `OTEL_*_LENGTH_LIMIT` env vars default to `Infinity`, so an unset limit cannot lower the
   result. They are **standard OTel SDK variables** — the SDK will already enforce them by truncating
   attribute values itself.
3. `Math.min` over all four. The result is the tightest applicable ceiling.
4. The marker is built *after* the limit is known, so it self-describes:
   `[TRUNCATED - Content exceeds 60KB limit]` for the default, `[TRUNCATED - Content exceeds 4KB limit]`
   for `=4096`.
5. `if (marker.length >= limit)` — the degenerate case. The zod schema allows `min: 1`, so
   `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH=10` is legal. The marker for a sub-1024 limit is ~51 characters,
   longer than the budget. Rather than emit a value longer than the limit, the function returns a bare
   slice with `truncated: true` and *no marker*.
6. Otherwise `content.slice(0, limit - marker.length) + marker` — **total output length is exactly
   `limit`**.

**Why this approach:**
- **Why include the three `OTEL_*` limits at all?** Because without them the two truncators fight.
  Suppose an operator sets `OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT=8192` for their backend. In 2.1.193,
  `CD` would slice at 61440, append `[TRUNCATED - Content exceeds 60KB limit]`, and hand a ~60 KB
  string to the SDK, which would then chop it at 8192 — deleting the marker and producing a value
  that *looks* complete but is not, and whose truncation is invisible in the record. Folding the SDK
  limits into `Math.min` means Claude Code truncates first, at the limit that will actually apply, and
  its marker survives.
- **Why is step 6 the interesting change?** 2.1.193's `CD` returned `e.slice(0, t) + marker` — length
  `t + 42`. **The old function always overshot its own limit by the marker's length.** At the default
  60 KB against Honeycomb's 64 KiB that was harmless (the 4 KiB margin absorbed it). Against an
  operator-chosen limit that exactly matches their backend, a 42-byte overshoot is a rejected or
  silently re-truncated attribute. Making the limit a hard cap is what makes the env var *usable*, not
  merely present.
- **Alternative not taken:** keeping `CD`'s optional `maxSize` parameter and passing the resolved
  limit from each of the sixteen call sites. Instead the parameter was **removed** and the resolution
  moved inside — so no call site can accidentally bypass the env var. That is why `WP` takes one
  argument where `CD` took two.
- **`V1g()` is called on every invocation** — no memoisation. Sixteen-plus call sites, four `Math.min`
  arguments, four env reads each. The env reads go through the `Z` accessor table, which is itself
  parse-cached; the cost is a handful of property lookups per telemetry attribute. Recomputing keeps
  the value correct if the process mutates its own environment (which `:494737-494745` demonstrably
  does — it strips `console` from the exporter lists in some modes).

**Key insight:** the bullet reads like "we exposed a constant". The substantive change is that the
constant became *authoritative*: `Math.min` makes it the floor of the SDK's own limits, and the
`limit - marker.length` slice makes the output actually obey it. Both were needed for the knob to mean
anything.

### 1.3 The env-var schema — the only `digitsOnly` in the OTel block

```javascript
// :24390  (module export table)
  CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH: () => WYm,

// :24526-24529  (schema declarations, in order)
    (UYm = De.int({ min: 0 })),                            // OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT
    (jYm = De.int({ min: 0 })),                            // OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT
    (GYm = De.int({ min: 0 })),                            // OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT
    (WYm = De.int({ min: 1, digitsOnly: !0 })),            // CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH
```

`digitsOnly` is 220=**7** / 193=**0** — the option itself is new in this window, and
`CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` is one of only six env vars that use it (`:24529`, `:31394`,
`:32639-32642`). The coercer:

```javascript
// ============================================
// makeIntEnvSchema - integer env-var parser; returns undefined on any rejection
// Location: cli_inner_pretty.js:24101-24116
// ============================================

// ORIGINAL (for source lookup):
function XIl(e) {
  return Re.preprocess(
    KBr,
    Re.string()
      .optional()
      .transform((t) => {
        if (t === void 0) return;
        if (e?.digitsOnly && !/^[+-]?\d+$/.test(t.trim())) return;
        let r = Fd(t);
        if (Number.isNaN(r)) return;
        if (e?.min !== void 0 && r < e.min) return;
        if (e?.max !== void 0 && r > e.max) return;
        return r;
      }),
  );
}

// READABLE (for understanding):
function makeIntEnvSchema(options) {
  return zod.preprocess(toStringOrUndefined, zod.string().optional().transform((raw) => {
    if (raw === undefined) return undefined;
    if (options?.digitsOnly && !/^[+-]?\d+$/.test(raw.trim())) return undefined;   // reject 1e6 / 64_000
    let parsed = parseLenientInteger(raw);
    if (Number.isNaN(parsed)) return undefined;
    if (options?.min !== undefined && parsed < options.min) return undefined;
    if (options?.max !== undefined && parsed > options.max) return undefined;
    return parsed;
  }));
}

// Mapping: XIl→makeIntEnvSchema, KBr→toStringOrUndefined, Fd→parseLenientInteger (:4441)
```

`parseLenientInteger` (`Fd`, `:4441-4444`) is deliberately permissive — it accepts scientific
notation via the regex at `:4453` and digit-group separators via `:4454-4455`. That is the `.211`
"integer env vars accept scientific notation / digit separators (`1e6`, `64_000`)" behaviour.
`digitsOnly: true` **opts this variable out of that leniency**.

**Failure mode, and it is silent.** Every rejection path returns `undefined`, so the `??` in `V1g()`
falls back to 61440. `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH=1e6`, `=64_000`, `=0`, `=-5`, `=abc`,
`=100KB` all behave identically to not setting it — **no warning, no error, no log line**. An
operator who writes `1e6` gets 60 KB and no indication why. The asymmetry with its three OTel
neighbours (which *do* accept `1e6`) makes this a genuine usability trap, and it is worth stating
plainly: the strictness is a deliberate choice about a byte budget, but the diagnostics for it do not
exist.

Two further cosmetic defects in the marker, both present in the shipped build:

- `${t} character limit` is **not pluralised** — `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH=500` yields
  `[TRUNCATED - Content exceeds 500 character limit]`.
- `Math.floor(t / 1024)` **understates** non-multiples — `=2000` yields `1KB`.

### 1.4 The one *new* call site: raw-body truncation was unified

`WP` has 17 call sites in 2.1.220; `CD` had 16 in 2.1.193, and fifteen map one-to-one. (`:293970`
and `:299512` both correspond to the single 193 site `:292939 (193)` — that is the MCP-client
double-emission artefact recorded in `_GROUND_TRUTH_verified_anchors.md` §6.7, not a new call.)

The genuinely new caller is `:339459`, and it replaced a **second, independent 61440 truncator**:

```javascript
// 2.1.193 — the beta raw-body emitter had its OWN copy of the logic
// cli_inner_pretty.js:468089-468100 (193):
  let s = o.length > Qbl;
  Jc(e, {
    body: s
      ? o.slice(0, Qbl) +
        `

[TRUNCATED - Content exceeds 60KB limit]`
      : o,
    body_length: String(o.length),
    ...(s && { body_truncated: "true" }),
    ...n,
  });
// var Qbl = 61440;                                      // :468132 (193)

// 2.1.220 — the same emitter now calls the shared truncator
// cli_inner_pretty.js:339459-339460:
  let { content: i, truncated: s } = WP(o);
  Ac(e, { body: i, body_length: String(o.length), ...(s && { body_truncated: "true" }), ...r });
```

Consequences worth stating:

1. `[TRUNCATED - Content exceeds 60KB limit]` is 220=**1** / 193=**2**. The duplicate is gone.
2. `61440` as a literal is 220=1 in the telemetry module (`:167289`) versus 193=2 (`:286044 (193)`,
   `:468132 (193)`). The other 61440s in 2.1.220 (`:416217` in the worker-events module, `:518136`
   `MAX_SESSION_BYTES`) are unrelated constants that happen to share the value.
3. **`CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` therefore also governs `OTEL_LOG_RAW_API_BODIES=inline`.**
   Nothing in the changelog says so. An operator raising the limit to capture whole request bodies
   gets that behaviour for free; an operator lowering it to protect a metrics backend also silently
   truncates their raw-body captures.
4. The `file` mode of `OTEL_LOG_RAW_API_BODIES` (`:339450-339457`) is **not** affected — it writes the
   full body to disk and emits only a `body_ref` path plus `body_length`. So the limit constrains
   what crosses the wire, not what can be captured locally. That is the right split, and it is a
   pre-existing design (`:468085-468086 (193)`).

---

## 2. Chunked transfer encoding rejected by Azure Monitor (.212)

**Anchor:** `OTLP request body chunk is not string or Uint8Array` — 220=1 (`:494957`) / 193=0.

### 2.1 The problem

Claude Code's OTLP/HTTP exporters run over a custom `http.Agent`/`https.Agent`/`HttpsProxyAgent`
built by `JKd` (`:495002-495028`) with `{ keepAlive: true, maxSockets: 1 }`. Node writes a request
body with no `Content-Length` using `Transfer-Encoding: chunked`. Several OTLP receivers — Azure
Monitor is the one the bullet names — reject that with **411 Length Required** or **400**.

The exporter cannot fix this itself: it hands the body to Node's `ClientRequest` and Node decides the
framing. So 2.1.220 intercepts at the *agent* layer.

### 2.2 The mechanism

```javascript
// ============================================
// wrapAgentToBufferBodyAndSetContentLength - forces Content-Length on every OTLP HTTP request
// Location: cli_inner_pretty.js:494959-495001
// ============================================

// ORIGINAL (for source lookup):
function _Fo(e) {
  let t = e,
    r = t.addRequest.bind(t);
  return (
    (t.addRequest = function (o, ...i) {
      if (!o.getHeader("content-length") && !o.getHeader("transfer-encoding")) {
        let c = function () {
            ((o.write = a), (o.end = l));
          },
          u = function (d) {
            (c(), o.destroy(d instanceof Error ? d : TypeError("OTLP request body chunk conversion failed")));
          },
          s = [],
          a = o.write.bind(o),
          l = o.end.bind(o);
        ((o.write = function (p, f, m) {
          try {
            s.push(XKd(p, f));
          } catch (y) {
            return (u(y), !1);
          }
          let g = typeof f === "function" ? f : m;
          if (g) process.nextTick(g, null);
          return !0;
        }),
          (o.end = function (p, f, m) {
            if (p != null && typeof p !== "function")
              try {
                s.push(XKd(p, f));
              } catch (_) {
                return (u(_), o);
              }
            let g = typeof p === "function" ? p : typeof f === "function" ? f : m,
              y = Buffer.concat(s);
            if (!o.headersSent) o.setHeader("Content-Length", String(y.byteLength));
            return (c(), l(y, g));
          }));
      }
      r(o, ...i);
    }),
    e
  );
}

// READABLE (for understanding):
function wrapAgentToBufferBodyAndSetContentLength(agent) {
  let originalAddRequest = agent.addRequest.bind(agent);
  agent.addRequest = function (req, ...rest) {
    // Only intervene when the caller has NOT already framed the body itself.
    if (!req.getHeader("content-length") && !req.getHeader("transfer-encoding")) {
      let chunks = [],
        realWrite = req.write.bind(req),
        realEnd = req.end.bind(req),
        restore = () => { req.write = realWrite; req.end = realEnd; },
        failRequest = (err) => {
          restore();
          req.destroy(err instanceof Error ? err : new TypeError("OTLP request body chunk conversion failed"));
        };

      req.write = function (chunk, encodingOrCb, cb) {
        try { chunks.push(toBuffer(chunk, encodingOrCb)); }
        catch (e) { failRequest(e); return false; }                     // backpressure-style false
        let callback = typeof encodingOrCb === "function" ? encodingOrCb : cb;
        if (callback) process.nextTick(callback, null);                 // preserve write(cb) contract
        return true;                                                    // never signal backpressure
      };

      req.end = function (chunkOrCb, encodingOrCb, cb) {
        if (chunkOrCb != null && typeof chunkOrCb !== "function")
          try { chunks.push(toBuffer(chunkOrCb, encodingOrCb)); }
          catch (e) { failRequest(e); return req; }
        let callback = typeof chunkOrCb === "function" ? chunkOrCb
                     : typeof encodingOrCb === "function" ? encodingOrCb : cb,
          body = Buffer.concat(chunks);
        if (!req.headersSent) req.setHeader("Content-Length", String(body.byteLength));
        restore();
        return realEnd(body, callback);                                  // one write, correctly framed
      };
    }
    originalAddRequest(req, ...rest);
  };
  return agent;
}

// ============================================
// toBuffer - normalises a write() chunk to a Buffer, or throws
// Location: cli_inner_pretty.js:494953-494958
// ============================================

// ORIGINAL (for source lookup):
function XKd(e, t) {
  if (Buffer.isBuffer(e)) return e;
  if (typeof e === "string") return typeof t === "string" ? Buffer.from(e, t) : Buffer.from(e);
  if (e instanceof Uint8Array) return Buffer.from(e);
  throw TypeError("OTLP request body chunk is not string or Uint8Array");
}

// Mapping: _Fo→wrapAgentToBufferBodyAndSetContentLength, XKd→toBuffer,
//          JKd→buildOtlpHttpAgentFactory (:495002)
```

Applied at all three agent constructions in `JKd`:

```javascript
// :495016  proxied
          ((c = _Fo(new eYd.HttpsProxyAgent(t, { ...s, keepAlive: !0, maxSockets: 1 }))),
// :495021  plain http
        if (!a) a = _Fo(new QKd.default.Agent({ keepAlive: !0, maxSockets: 1 }));
// :495024  https
      if (!l) l = _Fo(new ZKd.default.Agent({ ...s, keepAlive: !0, maxSockets: 1 }));
```

The 2.1.193 equivalent, `l4a` at `:350288-350312 (193)`, constructs the same three agents with the
same options and **no wrapper** (`:350301`, `:350305`, `:350308`). Net-new, unambiguously.

### `Decision: patch the Agent, not the exporter`

**What it does:** buffers an outgoing OTLP HTTP request body in memory so a `Content-Length` header
can be set before the headers are flushed.

**How it works:**
1. `addRequest` is the Agent hook Node calls with the `ClientRequest` *before* the socket is assigned
   and before headers are written. That is the last moment a header can still be added — hence the
   choice of hook, and hence the `!req.headersSent` re-check at `:494993`.
2. **Guard first:** `!getHeader("content-length") && !getHeader("transfer-encoding")` (`:494964`). If
   the exporter already set either header it knows what it is doing; the wrapper stands down. This is
   what keeps the patch safe for the gRPC path and for any future exporter that frames its own body.
3. `write` is replaced with a collector. Every chunk goes through `toBuffer`, which handles
   `Buffer` / `string` (+ optional encoding) / `Uint8Array` and **throws** on anything else.
4. `write` returns `true` unconditionally. There is no socket yet and no real backpressure, so
   claiming "buffer full" would stall the exporter forever. A write callback, if supplied, is invoked
   on `process.nextTick` — preserving the `write(chunk, cb)` contract without recursing synchronously.
5. `end` concatenates, sets `Content-Length`, restores the real methods, then performs **one** real
   `end(body, cb)`. Exactly one write reaches the socket, so Node emits a fixed-length body.
6. `end`'s argument shuffle (`:494991`) handles all three Node overloads: `end(cb)`,
   `end(chunk, cb)`, `end(chunk, encoding, cb)`.
7. **Failure path:** a chunk that is not string/Buffer/Uint8Array throws, `failRequest` restores the
   original methods and `req.destroy(err)` aborts. The exporter sees a normal request error and
   retries through its own machinery. The `restore()` inside `failRequest` matters: without it a
   destroyed-but-reused request object would keep the collector methods and silently swallow the next
   body.

**Why this approach:**
- **Why not `exporter.headers = { 'content-length': … }`?** The length is not known until the body is
  serialised, which happens inside the SDK exporter after the request object exists. There is no
  configuration point between "body known" and "headers flushed".
- **Why not fork the exporter?** Claude Code loads the OTLP exporters lazily from the vendored
  `@opentelemetry/exporter-*` packages by protocol (`:494625-494637` for metrics, `:494666-494678` for
  logs, `:494698-494709` for traces) — **nine** exporter classes across three signals and three
  protocols. Patching one shared Agent covers all nine HTTP variants with one function; patching
  exporters would mean six edits into vendored code.
- **Memory trade-off, and why it is acceptable:** the whole body is now held in memory. OTLP batches
  are already fully serialised in memory before the write, so the wrapper roughly doubles peak
  batch footprint, not more. And `Q5s` wraps every exporter with the export-result logger
  (`:494650`, `:494686`, `:494718`), while batch sizes are bounded by the export intervals
  (`ZH_ = 60000` metrics, `tYd = 5000` logs, `rYd = 5000` traces — `:495037-495039`).
- **Why is `maxSockets: 1` relevant?** It serialises OTLP requests on one connection. With chunked
  encoding and `keepAlive`, a receiver that 411s mid-stream can poison a kept-alive socket for the
  *next* export too. Fixed-length framing makes every request independently parseable, which matters
  more with a single shared socket than it would with a pool.

**Key insight:** the fix is placed at the only layer that can see *both* the complete body and the
unflushed headers, and it is written to be inert whenever anyone else has already taken
responsibility for framing. That guard is what makes a monkey-patch of a Node internal defensible.

---

## 3. Prometheus `# UNIT` lines (.216)

`# UNIT` is 220=**1** / 193=**1** — and the scoping pass's anchor (`:494156`) is a **decoy**.

### 3.1 What the decoy is

`:494148-494183` is the vendored `PrometheusSerializer._serializeMetricData`. Its 2.1.193 counterpart
is `:349507-349529 (193)`. I read both, plus their helper blocks (`:494050-494089` vs
`:349412-349446 (193)`): `cFo`/`P3n` (escaping), `z5s`/`Pgo` (name sanitising), `$H_`/`KOp`
(`_total` suffixing), `FH_`/`XOp` (type mapping) are **byte-identical**. The serializer was not
touched. It emits `# UNIT <name> <unit>` whenever `descriptor.unit` is set, exactly as it always did.

### 3.2 Where the fix actually is

OpenMetrics requires that a metric carrying a `# UNIT` line have the unit as a **suffix of its
name** — `claude_code_cost_usage_USD`, not `claude_code_cost_usage` with `# UNIT … USD`. Claude Code's
metric names do not carry unit suffixes, so every `# UNIT` line it emitted was invalid. The fix is to
**stop declaring units when Prometheus is the only consumer**.

```javascript
// ============================================
// setMeterAndCounters - creates the eight claude_code.* counters; units now suppressible
// Location: cli_inner_pretty.js:3178-3198
// ============================================

// ORIGINAL (for source lookup):
function FSi(e, t, { omitUnits: r = !1 } = {}) {
  Ot.meter = e;
  let n = (o) => (r ? void 0 : o);
  ((Ot.sessionCounter = t("claude_code.session.count", { description: "Count of CLI sessions started" })),
    ...
    (Ot.costCounter = t("claude_code.cost.usage", { description: "Cost of the Claude Code session", unit: n("USD") })),
    (Ot.tokenCounter = t("claude_code.token.usage", { description: "Number of tokens used", unit: n("tokens") })),
    ...
    (Ot.activeTimeCounter = t("claude_code.active_time.total", {
      description: "Total active time in seconds",
      unit: n("s"),
    })));
}

// READABLE (for understanding):
function setMeterAndCounters(meter, createCounter, { omitUnits = false } = {}) {
  STATE.meter = meter;
  let unit = (u) => (omitUnits ? undefined : u);          // identity, or erase
  STATE.sessionCounter            = createCounter("claude_code.session.count",           { description: "…" });
  STATE.locCounter                = createCounter("claude_code.lines_of_code.count",      { description: "…" });
  STATE.prCounter                 = createCounter("claude_code.pull_request.count",       { description: "…" });
  STATE.commitCounter             = createCounter("claude_code.commit.count",             { description: "…" });
  STATE.costCounter               = createCounter("claude_code.cost.usage",   { description: "…", unit: unit("USD") });
  STATE.tokenCounter              = createCounter("claude_code.token.usage",  { description: "…", unit: unit("tokens") });
  STATE.codeEditToolDecisionCounter = createCounter("claude_code.code_edit_tool.decision", { description: "…" });
  STATE.activeTimeCounter         = createCounter("claude_code.active_time.total", { description: "…", unit: unit("s") });
}

// Mapping: FSi→setMeterAndCounters (named `setMeter` in 3rd/claude-code/src/bootstrap/state.ts:948),
//          Ot→STATE, t→createCounter, n→unit
```

The 2.1.193 version, `Upr` at `:2966-2985 (193)`, takes **two** parameters and writes
`unit: "USD"` / `unit: "tokens"` / `unit: "s"` as bare literals (`:2975`, `:2976`, `:2983 (193)`).
The `v2.1.88` named tree confirms the two-parameter signature and the same three units
(`3rd/claude-code/src/bootstrap/state.ts:948-987`), so the third parameter is unambiguously this
window's addition. `omitUnits` and `metricsExporterKinds` are both 220>0 / 193=0.

### 3.3 The predicate — where the real judgement lives

```javascript
// ============================================
// initializeTelemetryAndCounters - decides whether units are declared at all
// Location: cli_inner_pretty.js:827904-827922
// ============================================

// ORIGINAL (for source lookup):
async function kiE() {
  let { initializeTelemetry: e } = await Promise.resolve().then(() => (eWs(), Z5s)),
    { meter: t, metricsExporterKinds: r } = await e();
  if (t)
    (FSi(
      t,
      (o, i) => {
        let s = t?.createCounter(o, i);
        return {
          add(a, l = {}) {
            let u = { ...qRt(), ...l };
            s?.add(a, u);
          },
        };
      },
      { omitUnits: r.length > 0 && r.every((o) => o === "prometheus") },
    ),
      BSi()?.add(1, { start_type: pEi() }));
}

// READABLE (for understanding):
async function initializeTelemetryAndCounters() {
  let { initializeTelemetry } = await import("./telemetry/instrumentation");
  let { meter, metricsExporterKinds } = await initializeTelemetry();
  if (!meter) return;
  setMeterAndCounters(
    meter,
    (name, options) => {                                   // AttributedCounter factory
      let counter = meter?.createCounter(name, options);
      return { add(value, attrs = {}) { counter?.add(value, { ...getTelemetryAttributes(), ...attrs }); } };
    },
    { omitUnits: metricsExporterKinds.length > 0 && metricsExporterKinds.every((k) => k === "prometheus") },
  );
  getSessionCounter()?.add(1, { start_type: getSessionStartType() });
}

// Mapping: kiE→initializeTelemetryAndCounters, FSi→setMeterAndCounters, qRt→getTelemetryAttributes,
//          BSi→getSessionCounter, pEi→getSessionStartType
```

`metricsExporterKinds` is produced by `initializeTelemetry` at `:494749`
(`r = t ? SFo(Z.OTEL_METRICS_EXPORTER) : []`) and returned on both of its two exit paths (`:494790`
for the beta-tracing branch, `:494881` for the normal branch).

### `Decision: suppress units only when Prometheus is the sole metrics exporter`

**What it does:** removes the `unit` field from three of eight instruments, but only in the
configuration where declaring it is harmful.

**How it works:**
1. `metricsExporterKinds` is the parsed `OTEL_METRICS_EXPORTER` list — `[]` when telemetry is off.
2. `r.length > 0` — the necessary guard, because **`[].every(pred)` is `true`**. Without it, telemetry
   disabled (or `OTEL_METRICS_EXPORTER` unset) would suppress units, and any later re-enabling path
   would inherit unit-less instruments for no reason.
3. `r.every(k => k === "prometheus")` — every configured exporter must be Prometheus.
4. `unit()` is an identity-or-erase closure applied per instrument. Passing `unit: undefined` is not
   the same as passing no `unit` key at the type level, but the OTel SDK treats an undefined `unit`
   as absent, and the serializer's `e.descriptor.unit ? … : ""` (`:494154-494157`) then emits nothing.

**Why this approach:**
- **Why `every` and not `includes`?** This is the load-bearing choice. `OTEL_METRICS_EXPORTER=prometheus,otlp`
  keeps units. Units are *valid and useful* over OTLP — a backend can render `USD` and `s` correctly.
  Stripping them to satisfy Prometheus would degrade the OTLP payload for every consumer. The code
  chooses to leave the invalid `# UNIT` line in place in mixed configurations rather than damage the
  richer channel. That is a deliberate, defensible ranking of harms: a malformed comment line that
  scrapers tolerate, versus permanently lost semantic metadata.
- **Why not fix the serializer to append the unit to the name?** That would rename
  `claude_code_cost_usage` to `claude_code_cost_usage_USD`, breaking every existing dashboard,
  recording rule and alert — and it would rename it *only* for Prometheus users, diverging the metric
  name between backends. Suppressing a comment line breaks nothing.
- **Why not drop the units unconditionally?** They are the only machine-readable statement that
  `claude_code.cost.usage` is dollars and `claude_code.active_time.total` is seconds. Neither name
  carries that.
- **Consequence to record:** three instruments have configuration-dependent metadata. The same build,
  same code, same metric name reports a unit or not depending on `OTEL_METRICS_EXPORTER`. Anyone
  diffing OTLP payloads across two differently-configured fleets will see it.

**Key insight:** the entire fix is one options parameter, one three-line closure and one predicate —
and the predicate is where the engineering is. `every` instead of `includes` converts "fix Prometheus"
into "fix Prometheus without touching anyone else", which is why the change could ship without a
metric-rename migration.

---

## 4. Managed `OTEL_EXPORTER_OTLP_ENDPOINT` precedence (.217)

`OTEL_EXPORTER_OTLP_ENDPOINT` is 220=**9** / 193=**7**. Site-by-site:

| 220 | 193 | What it is |
|---|---|---|
| `:24372` | `:36278 (193)` | env accessor export table |
| `:471326` | `:326716 (193)` | vendored `getStringFromEnv` |
| `:489040` | `:344399 (193)` | vendored gRPC config: signal-specific ?? umbrella |
| `:494603` | `:349945 (193)` | debug log line |
| `:494657` | `:350002 (193)` | logs-exporter endpoint read |
| `:494939` | `:350274 (193)` | agent-options endpoint (`OTEL_EXPORTER_OTLP_${SIGNAL}_ENDPOINT ?? umbrella`) |
| `:861011` | — | **new** — gateway warning text |
| `:861020` | — | **new** — gateway managed-env payload |

Also `ANT_OTEL_EXPORTER_OTLP_ENDPOINT` (`:24411` vs `:36314 (193)`) — carryover.

So the **client-side** endpoint resolution is unchanged. The vendored precedence
(`signal-specific ?? umbrella`, `:489038-489042`) and Claude Code's own copy of it (`:494939`) are
byte-equivalent to 2.1.193. The delta is entirely in the **Cloud gateway**, a server component that
is not present in 2.1.193 at all:

```
forward_to               11 / 0
telemetry.forward_to      7 / 0
store.postgres_url        3 / 0
/managed/settings         8 / 1
all upstreams failed      2 / 0
```

```javascript
// ============================================
// buildManagedTelemetryEnv - the env block the gateway pushes to clients via /managed/settings
// Location: cli_inner_pretty.js:861003-861023
// ============================================

// ORIGINAL (for source lookup):
function hyE(e) {
  if (e.telemetry.forward_to.length === 0) return null;
  let t = e.listen.public_url;
  if (!t)
    return (
      Ap(
        "warn",
        "telemetry.forward_to is configured but listen.public_url is not — " +
          "clients will not be told to export OTLP. Set listen.public_url so /managed/settings can push OTEL_EXPORTER_OTLP_ENDPOINT.",
      ),
      null
    );
  return {
    CLAUDE_CODE_ENABLE_TELEMETRY: "1",
    OTEL_METRICS_EXPORTER: "otlp",
    OTEL_LOGS_EXPORTER: "otlp",
    OTEL_TRACES_EXPORTER: "otlp",
    OTEL_EXPORTER_OTLP_ENDPOINT: t,
    OTEL_EXPORTER_OTLP_PROTOCOL: "http/protobuf",
  };
}

// READABLE (for understanding):
function buildManagedTelemetryEnv(gatewayConfig) {
  if (gatewayConfig.telemetry.forward_to.length === 0) return null;      // forwarding not configured
  let publicUrl = gatewayConfig.listen.public_url;
  if (!publicUrl) {
    logGateway("warn",
      "telemetry.forward_to is configured but listen.public_url is not — clients will not be told to " +
      "export OTLP. Set listen.public_url so /managed/settings can push OTEL_EXPORTER_OTLP_ENDPOINT.");
    return null;
  }
  return {
    CLAUDE_CODE_ENABLE_TELEMETRY: "1",
    OTEL_METRICS_EXPORTER: "otlp",       // all three signals, explicitly
    OTEL_LOGS_EXPORTER: "otlp",
    OTEL_TRACES_EXPORTER: "otlp",
    OTEL_EXPORTER_OTLP_ENDPOINT: publicUrl,
    OTEL_EXPORTER_OTLP_PROTOCOL: "http/protobuf",
  };
}

// Mapping: hyE→buildManagedTelemetryEnv, Ap→logGateway
```

Its single caller shows the precedence:

```javascript
// ============================================
// buildManagedSettingsPolicies - merges the telemetry env into every managed policy
// Location: cli_inner_pretty.js:860924-860942
// ============================================

// ORIGINAL (for source lookup):
async function pMm(e) {
  let t = hyE(e),
    r = e.managed,
    n;
  if (r?.policies)
    ((n = r.policies.map(
      (o, i) => (lMm(o.cli, `managed.policies[${i}].cli`), { match: o.match, cli: o.cli, desktop: o.desktop }),
    )),
      (n = uyE(n)));
  else if (r?.settings) {
    let o = await gyE(r.settings);
    (lMm(o, "managed settings"), (n = [{ match: {}, cli: o }]));
  } else if (t) n = [{ match: {}, cli: {} }];
  else return null;
  return n.map(({ match: o, cli: i, desktop: s }) => {
    let a = t ? { ...i, env: { ...t, ...(J1n(i.env) ? i.env : {}) } } : i,
      l = xPo(a);
    return { match: o, payload: { uuid: l, checksum: l, settings: a }, availableModels: lyE(a), desktop: s };
  });
}

// READABLE (for understanding):
async function buildManagedSettingsPolicies(gatewayConfig) {
  let telemetryEnv = buildManagedTelemetryEnv(gatewayConfig);
  let managed = gatewayConfig.managed;
  let policies;
  if (managed?.policies) {
    policies = managed.policies.map((p, i) => (validateManagedCliSettings(p.cli, `managed.policies[${i}].cli`),
                                               { match: p.match, cli: p.cli, desktop: p.desktop }));
    policies = mergeCatchAllPolicyIntoOthers(policies);
  } else if (managed?.settings) {
    let resolved = await resolveManagedSettings(managed.settings);
    validateManagedCliSettings(resolved, "managed settings");
    policies = [{ match: {}, cli: resolved }];
  } else if (telemetryEnv) {
    policies = [{ match: {}, cli: {} }];        // synthesise a catch-all just to carry the telemetry env
  } else return null;

  return policies.map(({ match, cli, desktop }) => {
    let settings = telemetryEnv
      ? { ...cli, env: { ...telemetryEnv, ...(isPlainObject(cli.env) ? cli.env : {}) } }   // policy env WINS
      : cli;
    let checksum = hashSettings(settings);
    return { match, payload: { uuid: checksum, checksum, settings }, availableModels: extractAvailableModels(settings), desktop };
  });
}

// Mapping: pMm→buildManagedSettingsPolicies, hyE→buildManagedTelemetryEnv,
//          lMm→validateManagedCliSettings, uyE→mergeCatchAllPolicyIntoOthers,
//          gyE→resolveManagedSettings, J1n→isPlainObject, xPo→hashSettings, lyE→extractAvailableModels
```

### `Decision: three-signal explicitness, spread-order precedence, and a synthesised policy`

**What it does:** ensures a gateway operator who configures `telemetry.forward_to` actually receives
all three OTel signals from every client, without overriding anything the operator set by hand.

**How it works:**
1. `buildManagedTelemetryEnv` returns `null` unless `forward_to` is non-empty **and**
   `listen.public_url` is set. The second case logs a specific, actionable warning naming both the
   missing key and the mechanism (`/managed/settings`) — otherwise the failure mode is "telemetry
   configured, nothing arrives, no explanation".
2. **All three exporters are named explicitly.** `OTEL_EXPORTER_OTLP_ENDPOINT` alone does nothing if
   `OTEL_METRICS_EXPORTER` / `OTEL_LOGS_EXPORTER` / `OTEL_TRACES_EXPORTER` are unset — the client's
   `SFo(Z.OTEL_*_EXPORTER)` yields an empty list and no exporter is constructed (`:494749`,
   `:494655`, `:494689`). **This is the "not governing all signals" half of the bullet**: an endpoint
   with no exporter list is inert.
3. `{ ...telemetryEnv, ...(policy.env ?? {}) }` at `:860939` — telemetry first, **policy last**. An
   operator who deliberately sets `OTEL_LOGS_EXPORTER: "none"` in their managed policy keeps that
   value. The derived block supplies defaults, never overrides.
4. `else if (telemetryEnv) policies = [{ match: {}, cli: {} }]` at `:860936` — if telemetry
   forwarding is configured but *no* managed policy or settings block exists, a catch-all policy with
   empty settings is synthesised purely so step 3 has something to attach the env to. Without this,
   configuring `telemetry.forward_to` on a gateway with no managed settings would silently do nothing.
5. `hashSettings(settings)` is used as *both* `uuid` and `checksum` (`:860941`) — the payload identity
   is content-derived, so adding the telemetry env changes the checksum and clients re-fetch.

**Why this approach:**
- **Why `http/protobuf`?** It is the only protocol all three of the client's signal paths implement
  without a gRPC dependency, and it is the one the `Content-Length` fix in §2 covers. Pushing `grpc`
  would take clients down a code path with a different agent factory.
- **Why not have the gateway rewrite the *signal-specific* variables too?** The bullet's phrase
  "*lower-scope signal-specific overrides no longer redirect telemetry away from the managed
  endpoint*" describes intent, but the shipped `hyE` sets **only the umbrella endpoint**. A client
  that already has `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT` in its own environment will still win, because
  `:494939` and `:489038-489042` both read signal-specific first. **This is a partial fix and the
  bullet over-claims it.** The three `*_EXPORTER` variables are what changed; the endpoint precedence
  did not.
- **Trade-off in step 3:** policy-wins is the safe direction for an operator who knows what they are
  doing, and the unsafe direction for the bullet's stated goal — a stale `env` block in a managed
  policy still redirects telemetry. The code chose operator authority over enforcement.

**Key insight:** nine literal occurrences, and the two new ones are in a *server* the baseline bundle
does not contain. The client's endpoint-precedence logic is untouched carryover. Anyone diffing this
bullet on the client side finds nothing — which is the finding.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this module are staged in
> [symbol_additions_v2_1_220_telemetry.md](../00_overview/symbol_additions_v2_1_220_telemetry.md).

Key functions in this document:
- `resolveOtelContentMaxLength` (`V1g`, `:167272`) - `Math.min` of the Claude Code knob and three OTel SDK limits
- `truncateTelemetryContent` (`WP`, `:167280`) - hard-capped truncation with a self-describing marker; named `truncateContent` in `3rd/claude-code/src/utils/telemetry/betaSessionTracing.ts`
- `TELEMETRY_CONTENT_LIMIT_BYTES` (`q1g`, `:167289`) - 61440; `MAX_CONTENT_SIZE = 60 * 1024` in the named tree
- `makeIntEnvSchema` (`XIl`, `:24101`) - integer env coercer; `digitsOnly` rejects `1e6` / `64_000`
- `parseLenientInteger` (`Fd`, `:4441`) - the lenient parser `digitsOnly` bypasses
- `emitRawApiBodyEvent` (`Pud`, `:339446`) - `OTEL_LOG_RAW_API_BODIES`; now shares the truncator
- `resolveRawApiBodyMode` (`Lud`, `:339430`) - `disabled` / `inline` / `file`
- `wrapAgentToBufferBodyAndSetContentLength` (`_Fo`, `:494959`) - `addRequest` patch forcing `Content-Length`
- `toBuffer` (`XKd`, `:494953`) - chunk normaliser; throws `OTLP request body chunk is not string or Uint8Array`
- `buildOtlpHttpAgentFactory` (`JKd`, `:495002`) - builds and wraps the three agents
- `isLoopbackEndpoint` (`sI_`, `:494944`) - proxy-bypass predicate
- `buildOtlpExporterOptions` (`EFo`, `:494912`) - per-signal url/headers/agent options
- `setMeterAndCounters` (`FSi`, `:3178`) - eight `claude_code.*` counters; `{ omitUnits }` is new; named `setMeter` in `3rd/claude-code/src/bootstrap/state.ts:948`
- `initializeTelemetryAndCounters` (`kiE`, `:827904`) - computes `omitUnits` from `metricsExporterKinds`
- `initializeTelemetry` (`oI_`, `:494733`) - returns `{ meter, metricsExporterKinds }`
- `getOtlpMetricReaders` (`tI_`, `:494600`) / `getOtlpLogExporters` (`sYd`, `:494654`) / `getOtlpTraceExporters` (`rI_`, `:494688`)
- `buildManagedTelemetryEnv` (`hyE`, `:861003`) - gateway `/managed/settings` telemetry env block
- `buildManagedSettingsPolicies` (`pMm`, `:860924`) - merges it, policy `env` last
